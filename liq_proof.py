"""Likvidumo analizės Excel įrodymų failas (savininkas 2026-11-09: „beveik visose lentelėse nėra aiškių formulių …
skaičiams naudotą informaciją nuspalvindavai mėlynai, visur nurodydavai šaltinius“).

Svetainės Excel standartas (site/xl.js): pradiniai duomenys – mėlynas šriftas šviesiai mėlyname fone, formulės – juodos,
rezultatai – paryškinti geltoname fone, paaiškinimai – pilki, kiekviename lape – šaltinis. Visi skaičiai lentelėse – Excel
formulės iš lapų „Pozicijos“ ir „Fondai“ (LB duomenys), todėl kiekvieną skaičių galima atsekti iki LB failo eilutės.
Patikra: `python liq_proof.py check` – LibreOffice perskaičiuoja formules ir palygina su liquidity.py (svetainės) skaičiais.
"""
import sys
from datetime import datetime
from pathlib import Path

from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter as CL
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation

import liquidity as L

# --- stiliai (kaip site/xl.js) ---
F_IN, F_B, F_NOTE, F_TITLE, F_HDR, F_LINK = (Font(color="FF0000FF"), Font(bold=True), Font(italic=True, size=9, color="FF666666"),
                                             Font(bold=True, size=14), Font(bold=True, color="FFFFFFFF"), Font(underline="single", color="FF0563C1"))
P_IN, P_HDR, P_RES = (PatternFill("solid", fgColor=c) for c in ("EAF1FB", "2F6B5A", "FFF2CC"))
G, Y, R = (PatternFill("solid", fgColor=c) for c in ("C6EFCE", "FFEB9C", "FFC7CE"))
THIN = Border(*(Side(style="thin", color="FFBBBBBB"),) * 4)
PCT, PCT1, EUR, PP = "0.00%", "0.0%", "#,##0", '+0.00" p. p.";-0.00" p. p.";0.00" p. p."'
LB_PF_URL = "https://www.lb.lt/lt/pensiju-fondai-1"
LB_RES_URL = "https://www.lb.lt/lt/pf-veiklos-rodikliai"
TYPE_LT = {"bond": "obligacija", "fund": "fondas (KIS)"}


def put(ws, r, c, v, kind="", fmt=None, bold=False):
    """kind: in – pradinis duomuo (mėlynas), f – formulė, res – rezultatas, note, hdr."""
    x = ws.cell(r, c, v)
    if kind == "in":
        x.font, x.fill = F_IN, P_IN
    elif kind == "res":
        x.font, x.fill = F_B, P_RES
    elif kind == "note":
        x.font = F_NOTE
    elif kind == "hdr":
        x.font, x.fill = F_HDR, P_HDR
        x.alignment = Alignment(wrap_text=True, vertical="center")
    if bold and kind != "hdr":
        x.font = Font(bold=True, color=x.font.color)
    if kind in ("in", "f", "res", "hdr", "t"):
        x.border = THIN
    if fmt:
        x.number_format = fmt
    return x


def head(ws, r, cols, widths=None):
    for j, h in enumerate(cols, 1):
        put(ws, r, j, h, "hdr")
    if widths:
        for j, w in enumerate(widths, 1):
            ws.column_dimensions[CL(j)].width = w
    ws.row_dimensions[r].height = 32


def title(ws, text, src, note=None):
    put(ws, 1, 1, text).font = F_TITLE
    put(ws, 2, 1, "Šaltinis: " + src, "note")
    if note:
        put(ws, 3, 1, note, "note")


def _matrix(wb, wm, helper, sel, cur, date, S, tabs):
    res = cur["res"]
    tabs["mx"] = wm.title
    title(wm, "3 lentelė. Jautrumo matrica: dalis pagal išėjimus ir rinkų kritimą", "lapas „Skaičiavimai“ (A, B, T – pasirinktam fondui)",
          "Pasirinkite fondą, rodiklį ir formulę (mėlyni langeliai). Pataisyta: A÷(A+(T−A−x·T)(1−m)); kaip 2026-07-30 Excel: A÷(A+(T−A)(1−x−m)).")
    wm.column_dimensions["A"].width = 30
    hc = 16   # pagalbinis sąrašas – stulpelis P
    put(wm, 4, hc, "Fondas", "hdr")
    put(wm, 4, hc + 1, "T", "hdr")
    put(wm, 4, hc + 2, "A", "hdr")
    put(wm, 4, hc + 3, "B", "hdr")
    put(wm, 4, hc + 4, "Obl. riba", "hdr")
    for k, x in enumerate(helper):
        rr = 5 + k
        put(wm, rr, hc, x["name"], "in")
        for j, col in ((1, "E"), (2, "F"), (3, "K"), (4, "N")):
            put(wm, rr, hc + j, f"={S(col, date, x['code'])}", "f", EUR if j < 4 else PCT1)
    hl = f"$P$5:$T${4 + len(helper)}"
    for rr, (lbl, val) in enumerate((("Fondas", sel["name"] if sel else (helper[0]["name"] if helper else "")),
                                     ("Rodiklis", "Alternatyvos" if sel else "Baltijos obligacijos"), ("Formulė", "Pataisyta")), 4):
        put(wm, rr, 1, lbl, bold=True)
        put(wm, rr, 2, val, "in")
    wm.column_dimensions["B"].width = 26
    dv = DataValidation(type="list", formula1=f"=$P$5:$P${4 + len(helper)}", allow_blank=False)
    dv2 = DataValidation(type="list", formula1='"Alternatyvos,Baltijos obligacijos"')
    dv3 = DataValidation(type="list", formula1='"Pataisyta,Kaip 2026-07-30 Excel"')
    for v_, c_ in ((dv, "B4"), (dv2, "B5"), (dv3, "B6")):
        wm.add_data_validation(v_)
        v_.add(c_)
    put(wm, 7, 1, "T – fondo turtas")
    put(wm, 7, 2, f"=VLOOKUP($B$4,{hl},2,FALSE)", "f", EUR)
    put(wm, 8, 1, "A arba B – nelikvidi dalis")
    put(wm, 8, 2, f'=IF($B$5="Alternatyvos",VLOOKUP($B$4,{hl},3,FALSE),VLOOKUP($B$4,{hl},4,FALSE))', "f", EUR)
    put(wm, 9, 1, "Riba")
    put(wm, 9, 2, f'=IF($B$5="Alternatyvos",Riba30,VLOOKUP($B$4,{hl},5,FALSE))', "f", PCT1)
    put(wm, 11, 1, "Rinkų kritimas ↓ / Išėjimai →", "hdr")
    xs = [i / 10 for i in range(10)]
    ms = [i / 20 for i in range(20)]
    for j, x in enumerate(xs, 2):
        put(wm, 11, j, x, "in", "0%")
    for i, m in enumerate(ms, 12):
        put(wm, i, 1, -m, "in", "0%")
        for j in range(2, 12):
            cx, cm = f"{CL(j)}$11", f"(-$A{i})"
            fix = f"($B$7-$B$8-{cx}*$B$7)*(1-{cm})"
            xl = f"($B$7-$B$8)*(1-{cx}-{cm})"
            put(wm, i, j, f'=IF($B$8<=0,0,IF(IF($B$6="Pataisyta",{fix},{xl})<=0,1,MIN(1,$B$8/($B$8+IF($B$6="Pataisyta",{fix},{xl})))))', "f", PCT)
    grid = f"B12:K{11 + len(ms)}"
    wm.conditional_formatting.add(grid, FormulaRule(formula=["B12>=$B$9-0.0000001"], fill=R, stopIfTrue=True))
    wm.conditional_formatting.add(grid, FormulaRule(formula=['B12>=IF($B$5="Alternatyvos",0.25,0.9*$B$9)'], fill=Y, stopIfTrue=True))
    wm.conditional_formatting.add(grid, FormulaRule(formula=["B12>=0"], fill=G))
    if sel:
        put(wm, 13 + len(ms), 1, f"Laiške minima: {sel['name']} – 50 % išėjimų ir −10 % rinkos (langelis G14), riba prie 0 % ir −10 % – pirmas raudonas langelis eilutėse 0 % ir −10 %. "
                                 f"Fondas pasirinktas, nes {cur['summary']['sel_reason']}.", "note")



def write_proof(path, prov, date, an, rows_by_date, funds_cfg, alts, amap, la, lb, lt):
    ds = sorted(d for d in an if d <= date)
    cur = an[date]
    di = ds.index(date)
    prev_d = ds[di - 1] if di else None
    ref_d = L.REFERENCE_DATE if L.REFERENCE_DATE in ds and L.REFERENCE_DATE < (prev_d or date) else None
    cfg = {f["code"]: f for f in funds_cfg}
    alt_cls = {a["name"]: a for a in alts}
    wb = Workbook()

    # ---------- Apie failą (įvestys, šaltiniai, spalvos) ----------
    ws = wb.active
    ws.title = "Apie failą"
    title(ws, f"{prov} fondų likvidumo analizė – {date}", "Lietuvos bankas (portfeliai ir veiklos rodikliai), projekto konfigūracija",
          f"Sukurta {datetime.now():%Y-%m-%d %H:%M}. Visi lentelių skaičiai – formulės; pakeitus mėlyną reikšmę, Excel perskaičiuoja.")
    ws.column_dimensions["A"].width, ws.column_dimensions["B"].width, ws.column_dimensions["C"].width = 44, 16, 90
    r = 5
    put(ws, r, 1, "Spalvos", bold=True)
    for lbl, kind, txt in (("12 345", "in", "Pradinis duomuo (LB failas arba konfigūracija) – mėlynas"), ("=1+1", "f", "Formulė – juoda"),
                           ("0,25", "res", "Rezultatas, minimas laiške – paryškintas, geltonas fonas")):
        r += 1
        put(ws, r, 1, txt)
        put(ws, r, 2, lbl, kind)
    r += 2
    put(ws, r, 1, "Įvestys (keičiamos)", bold=True)
    names = {}
    for key, lbl, val, fmt, src in (("Riba30", "Alternatyvų riba (tik II pakopos fondams)", L.ALT_LIMIT, PCT, "Pensijų kaupimo įstatymas; taikoma tik II pakopai (savininkas 2026-11-09)"),
                                    ("RibaMinksta", "Obligacijų dalis, kurią laikome ne riba (≤, %)", L.SOFT_BOND_LIMIT, "0.0", "Rizikinguose fonduose ~2 % – strateginė dalis, ne viršutinė riba (savininkas 2026-11-09)"),
                                    ("ScenX", "Scenarijus: išėjimai (viso fondo turto dalis)", L.CENTRAL[0], "0%", "2026-07-30 laiško scenarijus"),
                                    ("ScenM", "Scenarijus: rinkų kritimas", L.CENTRAL[1], "0%", "2026-07-30 laiško scenarijus")):
        r += 1
        put(ws, r, 1, lbl)
        put(ws, r, 2, val, "in", fmt)
        put(ws, r, 3, src, "note")
        wb.defined_names[key] = DefinedName(key, attr_text=f"'Apie failą'!$B${r}")
        names[key] = r
    r += 2
    put(ws, r, 1, "Šaltiniai", bold=True)
    for lbl, txt, url in (("LB pensijų fondų portfeliai (ketvirčio)", "Lapai „Skolos VP“ (obligacijos) ir „KIS“ (fondai) → lapas „Pozicijos“", LB_PF_URL),
                          ("LB pensijų fondų veiklos rodikliai (ketvirčio)", "Grynieji aktyvai, dalyviai, rizikingų investicijų dalis → lapas „Fondai“", LB_RES_URL),
                          ("Alternatyvų sąrašas", "Projekto konfigūracija data/liq_alternatives.csv (kiekviena eilutė su šaltiniu ir peržiūros data) → lapas „Alternatyvų sąrašas“", None),
                          ("Fondų obligacijų ribos", "SEB – Vyčio likvidumo matrica 2026-07-30 („Obligacijų dalis taisyklėse“); kiti valdytojai – 100 − LB „rizikingų investicijų dalis“", None)):
        r += 1
        put(ws, r, 1, lbl)
        c = put(ws, r, 3, txt + (f" – {url}" if url else ""))
        if url:
            c.hyperlink, c.font = url, F_LINK
    r += 2
    put(ws, r, 1, "Lapai", bold=True)
    for n, t in (("Santrauka", "Visi laiške minimi skaičiai – formulės, su nuoroda, kurioje lentelėje"),
                 ("1 Alternatyvos … 5 Pokyčiai", "Laiško lentelės (tie patys numeriai kaip laiške A)"),
                 ("Matrica", "Jautrumo matrica: pasirinkite fondą, rodiklį ir formulę (mėlyni langeliai)"),
                 ("Jautrumas", "Kiekvieno fondo ribos prie 0 % ir −10 % rinkos, 50 % / −10 % scenarijus"),
                 ("Skaičiavimai", "Visi fondai × ketvirčiai: kiekviena reikšmė – formulė iš „Pozicijos“ ir „Fondai“"),
                 ("Fondai", "LB grynieji aktyvai, dalyviai, obligacijų ribos (pradiniai duomenys)"),
                 ("Pozicijos", "Kiekviena LB obligacijų ir fondų (KIS) pozicija su požymiais (pradiniai duomenys)"),
                 ("Alternatyvų sąrašas", "Kurios pozicijos laikomos alternatyviomis ir kodėl"),
                 ("Išimtys", "Duomenų patikros"), ("Metodika", "Formulės ir prielaidos"), ("Laiškas A / B", "Laiško tekstai")):
        r += 1
        put(ws, r, 1, n)
        put(ws, r, 3, t)

    # ---------- Pozicijos ----------
    wp = wb.create_sheet("Pozicijos")
    title(wp, "LB portfelių pozicijos (obligacijos ir fondai)", f"LB pensijų fondų portfeliai, {ds[0]} – {date} ({LB_PF_URL})",
          "Mėlyna – iš LB failo arba alternatyvų sąrašo; „Baltijos obligacija“ – formulė (obligacija ir emitento šalis LT/LV/EE).")
    head(wp, 5, ["Ketvirtis", "Fondo kodas", "Fondas", "LB lapas (tipas)", "Pozicija", "ISIN / ID", "Emitento šalis", "KIS tipas",
                 "Vertė, EUR", "Alternatyva (1 – taip)", "Alternatyvų sąrašo eilutė", "Baltijos obligacija (1 – taip)", "Pastaba"],
         [11, 13, 30, 15, 46, 15, 9, 8, 15, 11, 30, 11, 34])
    pr = 6
    for d in ds:
        codes = set(an[d]["res"])
        for x in rows_by_date[d]:
            if x["fund_code"] not in codes or x["type"] not in ("bond", "fund"):
                continue
            v = L.num(x["value"])
            if v is None:
                continue
            alt, lname, note = 0, "", ""
            if x["type"] == "fund":
                key = x["pos_id"] if x["pos_id"] in amap else L.norm(x["name"])
                if key in amap:
                    lname = amap[key] or "(sąraše: ne alternatyva)"
                    alt = 1 if amap[key] else 0
                elif x["kis_type"] in L.ALT_KIS or any(k in x["name"].lower() for k in L.KEYWORDS):
                    note = "Galimai alternatyvi – neįtraukta, kol nepatvirtinta (Išimtys)"
            vals = [d, x["fund_code"], cfg.get(x["fund_code"], {}).get("name") or an[d]["res"][x["fund_code"]]["name"], TYPE_LT[x["type"]], x["name"],
                    x["pos_id"], x["country"], x["kis_type"], v, alt, lname]
            for j, val in enumerate(vals, 1):
                put(wp, pr, j, val, "in", EUR if j == 9 else None)
            put(wp, pr, 12, f'=IF(AND(D{pr}="obligacija",OR(G{pr}="LT",G{pr}="LV",G{pr}="EE")),1,0)', "f")
            if note:
                put(wp, pr, 13, note, "note")
            pr += 1
    wp.freeze_panes = "A6"
    wp.auto_filter.ref = f"A5:M{pr - 1}"
    PZ = lambda c: f"Pozicijos!${c}$6:${c}${pr - 1}"  # noqa: E731

    # ---------- Fondai ----------
    wf = wb.create_sheet("Fondai")
    title(wf, "Fondų duomenys", f"LB pensijų fondų veiklos rodikliai ({LB_RES_URL}); obligacijų ribos – data/liq_funds.csv arba LB rizikingų dalis")
    head(wf, 5, ["Ketvirtis", "Fondo kodas", "Fondas", "Pakopa", "Grynieji aktyvai, EUR", "Aktyvų šaltinis", "Dalyviai", "Dalyviai prieš 2 ketv.",
                 "Obligacijų dalis taisyklėse, %", "Ribos šaltinis", "Alternatyvų analizė (1)", "Baltijos analizė (1)"],
         [11, 13, 30, 8, 16, 26, 11, 12, 12, 44, 11, 11])
    nav, part, risky = L.lb_results()
    rowof = {}
    fr = 6
    alld = L.prov_dates(prov)
    for d in ds:
        k_ = alld.index(d) if d in alld else -1
        d2 = alld[k_ - 2] if k_ >= 2 else None   # kaip liquidity.analyse: 2 ketvirčiai atgal pagal visas LB datas
        for code, x in sorted(an[d]["res"].items(), key=lambda kv: (kv[1]["pillar"], kv[1]["name"])):
            c = cfg.get(code)
            raw = L.num(c["bond_limit_pct"]) if c else None
            rk = risky.get((d, code))
            lbl = L.lb_bond_limit(*rk) if rk else None
            lim, src = (raw, c["limit_source"]) if raw is not None else (lbl, f"LB rizikingų investicijų dalis {rk[1]} % → 100 − X" if rk else "nėra")
            vals = [d, code, x["name"], x["pillar"], x["aum"], x["nav_src"], part.get((d, code)), part.get((d2, code)) if d2 else None,
                    lim, src, 1 if (c["alt"] == "1" if c else x["in_alt"] or x.get("alt_info")) else 0, 1 if x["in_bal"] else 0]
            for j, val in enumerate(vals, 1):
                put(wf, fr, j, val, "in", EUR if j in (5, 7, 8) else "0.0" if j == 9 else None)
            rowof[(d, code)] = fr
            fr += 1
    wf.freeze_panes = "D6"

    # ---------- Skaičiavimai ----------
    wc = wb.create_sheet("Skaičiavimai")
    title(wc, "Skaičiavimai – kiekvienas fondas ir ketvirtis", "formulės iš lapų „Pozicijos“, „Fondai“ ir įvesčių („Apie failą“)",
          "Išėjimo riba = 1 − alternatyvų dalis ÷ 30 % (tik II pakopa). Scenarijus: A ÷ (A + (T − A − x·T)·(1 − m)); kaip 2026-07-30 Excel: A ÷ (A + (T − A)·(1 − x − m)).")
    cols = ["Ketvirtis", "Fondo kodas", "Fondas", "Pakopa", "Fondo turtas (T), EUR", "Alternatyvos (A), EUR", "Alternatyvų dalis", "30 % riba taikoma",
            "Gali išeiti iki 30 %", "Gali išeiti, EUR", "Baltijos obligacijos (B), EUR", "Visos obligacijos, EUR", "Baltijos obligacijų dalis",
            "Fondo obligacijų riba", "Gali išeiti iki obligacijų ribos", "Gali išeiti, EUR", "Dalyvių pokytis per 2 ketv.",
            "Scenarijus x / m (pataisyta)", "Scenarijus x / m (kaip 2026-07-30 Excel)", "Riba prie −10 % rinkos (tiksli)",
            "Ankstesnio ketv. A, EUR", "Ankstesnė alternatyvų dalis", "Dalies pokytis", "iš jo dėl fondo turto pokyčio", "iš jo dėl alternatyvų vertės",
            "Ankstesnė išėjimo riba", "Fondo turto pokytis", "Ankstesnė Baltijos obl. dalis"]
    head(wc, 5, cols, [11, 13, 30, 8, 16, 15, 11, 9, 11, 15, 15, 15, 11, 11, 11, 15, 11, 11, 11, 11, 15, 11, 11, 11, 11, 11, 11, 11])
    for (d, code), rr in rowof.items():
        i = ds.index(d)
        pv = rowof.get((ds[i - 1], code)) if i else None
        F = lambda c, rw=rr: f"Fondai!{c}{rw}"  # noqa: E731
        f = {
            1: f"={F('A')}", 2: f"={F('B')}", 3: f"={F('C')}", 4: f"={F('D')}", 5: f"={F('E')}",
            6: f'=SUMIFS({PZ("I")},{PZ("A")},A{rr},{PZ("B")},B{rr},{PZ("J")},1)',
            7: f'=IF(E{rr}>0,F{rr}/E{rr},"")',
            8: f'=IF(AND(D{rr}="II",{F("K")}=1),1,0)',
            9: f'=IF(AND(H{rr}=1,E{rr}>0),1-G{rr}/Riba30,"")',
            10: f'=IF(I{rr}="","",I{rr}*E{rr})',
            11: f'=SUMIFS({PZ("I")},{PZ("A")},A{rr},{PZ("B")},B{rr},{PZ("L")},1)',
            12: f'=SUMIFS({PZ("I")},{PZ("A")},A{rr},{PZ("B")},B{rr},{PZ("D")},"obligacija")',
            13: f'=IF(E{rr}>0,K{rr}/E{rr},"")',
            14: f'=IF(OR({F("I")}="",{F("I")}<=RibaMinksta),"",{F("I")}/100)',
            15: f'=IF(OR(N{rr}="",M{rr}="",{F("L")}<>1,K{rr}<=0),"",1-M{rr}/N{rr})',
            16: f'=IF(O{rr}="","",O{rr}*E{rr})',
            17: f'=IF(OR({F("G")}="",{F("H")}=""),"",{F("G")}/{F("H")}-1)',
            18: f"=IF(F{rr}<=0,0,IF((E{rr}-F{rr}-ScenX*E{rr})*(1-ScenM)<=0,1,MIN(1,F{rr}/(F{rr}+(E{rr}-F{rr}-ScenX*E{rr})*(1-ScenM)))))",
            19: f"=IF(F{rr}<=0,0,IF((E{rr}-F{rr})*(1-ScenX-ScenM)<=0,1,MIN(1,F{rr}/(F{rr}+(E{rr}-F{rr})*(1-ScenX-ScenM)))))",
            20: f'=IF(AND(H{rr}=1,E{rr}>0),MAX(0,(E{rr}-F{rr}-F{rr}*(1-Riba30)/(Riba30*(1-0.1)))/E{rr}),"")',
        }
        if pv:
            f.update({21: f"=F{pv}", 22: f"=G{pv}", 23: f'=IF(OR(G{rr}="",V{rr}=""),"",G{rr}-V{rr})', 24: f'=IF(OR(E{rr}<=0,V{rr}=""),"",U{rr}/E{rr}-V{rr})',
                      25: f"=IF(E{rr}>0,(F{rr}-U{rr})/E{rr},\"\")", 26: f"=I{pv}", 27: f"=IF(E{pv}>0,E{rr}/E{pv}-1,\"\")", 28: f"=M{pv}"})
        fm = {5: EUR, 6: EUR, 7: PCT, 9: PCT, 10: EUR, 11: EUR, 12: EUR, 13: PCT, 14: PCT1, 15: PCT, 16: EUR, 17: PCT1, 18: PCT, 19: PCT, 20: PCT,
              21: EUR, 22: PCT, 23: PCT, 24: PCT, 25: PCT, 26: PCT, 27: PCT1, 28: PCT}
        for j in range(1, 29):
            if j in f:
                put(wc, rr, j, f[j], "f", fm.get(j))
    wc.freeze_panes = "D6"
    S = lambda c, d, code: f"Skaičiavimai!{c}{rowof[(d, code)]}"  # noqa: E731

    res = cur["res"]
    alt = sorted([x for x in res.values() if x["in_alt"]], key=lambda x: x["alt_x"])
    info = sorted([x for x in res.values() if x.get("alt_info")], key=lambda x: x["name"])
    bal = sorted([x for x in res.values() if x["in_bal"] and x["lim"] and x["bal"] > 0], key=lambda x: x["bal_x"])

    def colors_alt(ws, rng):
        ws.conditional_formatting.add(rng, CellIsRule(operator="greaterThanOrEqual", formula=["Riba30"], fill=R, stopIfTrue=True))
        ws.conditional_formatting.add(rng, CellIsRule(operator="greaterThanOrEqual", formula=["0.25"], fill=Y, stopIfTrue=True))
        ws.conditional_formatting.add(rng, CellIsRule(operator="greaterThanOrEqual", formula=["0"], fill=G))

    def heat(ws, rng):
        ws.conditional_formatting.add(rng, ColorScaleRule(start_type="num", start_value=0, start_color="F8696B", mid_type="num", mid_value=0.5,
                                                          mid_color="FFEB84", end_type="num", end_value=1, end_color="63BE7B"))

    tabs = {}   # laiško lentelių lapai: raktas → lapo vardas
    # ---------- 1 Alternatyvos ----------
    w1 = wb.create_sheet("1 Alternatyvos")
    tabs["alt"] = w1.title
    title(w1, f"1 lentelė. Alternatyvios investicijos II pakopos fonduose, {date}", "lapas „Skaičiavimai“ (LB portfeliai ir veiklos rodikliai)",
          "Surikiuota nuo jautriausio fondo. Paryškinta – laiške minimi skaičiai (mažiausia / didžiausia dalis, du jautriausi fondai, II pakopos suma).")
    head(w1, 5, ["Fondas", "Fondo turtas, EUR", "Alternatyvos, EUR", f"Alternatyvų dalis {prev_d or ''}", f"Alternatyvų dalis {date}",
                 "Gali išeiti iki 30 %", "Gali išeiti, EUR"], [34, 16, 16, 14, 14, 14, 16])
    r0 = 6
    for k, x in enumerate(alt):
        rr = r0 + k
        c = x["code"]
        put(w1, rr, 1, f"={S('C', date, c)}", "f")
        for j, col in ((2, "E"), (3, "F"), (5, "G"), (6, "I"), (7, "J")):
            put(w1, rr, j, f"={S(col, date, c)}", "f", {2: EUR, 3: EUR, 5: PCT, 6: PCT1, 7: EUR}[j])
        put(w1, rr, 4, f"={S('V', date, c)}" if prev_d and (prev_d, c) in rowof else "", "f", PCT)
    r1 = r0 + len(alt) - 1
    tr = r1 + 1
    if alt:
        put(w1, tr, 1, "II pakopa iš viso", "res")
        put(w1, tr, 2, f"=SUM(B{r0}:B{r1})", "res", EUR)
        put(w1, tr, 3, f"=SUM(C{r0}:C{r1})", "res", EUR)
        if prev_d:
            put(w1, tr, 4, "=(" + "+".join(f"{S('U', date, x['code'])}" for x in alt if (prev_d, x["code"]) in rowof) + ")/(" +
                "+".join(f"Skaičiavimai!E{rowof[(prev_d, x['code'])]}" for x in alt if (prev_d, x["code"]) in rowof) + ")", "res", PCT)
        put(w1, tr, 5, f"=C{tr}/B{tr}", "res", PCT)
        put(w1, tr, 7, f"=SUM(G{r0}:G{r1})", "res", EUR)
        put(w1, tr, 6, f"=G{tr}/B{tr}", "res", PCT1)
        colors_alt(w1, f"E{r0}:E{r1}")
        heat(w1, f"F{r0}:F{tr}")
        for rng, fx in ((f"E{r0}:E{r1}", f"OR(E{r0}=MAX($E${r0}:$E${r1}),E{r0}=MIN($E${r0}:$E${r1}))"),
                        (f"D{r0}:D{r1}", f"OR(D{r0}=MAX($D${r0}:$D${r1}),D{r0}=MIN($D${r0}:$D${r1}))"),
                        (f"A{r0}:A{r1}", f"ROW(A{r0})<{r0 + 2}"), (f"F{r0}:F{r1}", f"ROW(F{r0})<{r0 + 2}"),
                        (f"C{r0}:C{r1}", f"E{r0}=MAX($E${r0}:$E${r1})")):
            w1.conditional_formatting.add(rng, FormulaRule(formula=[fx], font=Font(bold=True)))
    rr = tr + 2
    if info:
        put(w1, rr, 1, "III pakopa – tik informatyviai: 30 % riba III pakopos fondams netaikoma", bold=True)
        for x in info:
            rr += 1
            put(w1, rr, 1, f"={S('C', date, x['code'])}", "f")
            put(w1, rr, 2, f"={S('E', date, x['code'])}", "f", EUR)
            put(w1, rr, 3, f"={S('F', date, x['code'])}", "f", EUR)
            if prev_d and (prev_d, x["code"]) in rowof:
                put(w1, rr, 4, f"={S('V', date, x['code'])}", "f", PCT)
            put(w1, rr, 5, f"={S('G', date, x['code'])}", "f", PCT)
            put(w1, rr, 6, "netaikoma", "note")
    if alt:
        ch = BarChart()
        ch.type, ch.title, ch.height, ch.width = "bar", "Kiek fondo turto gali išeiti iki 30 % ribos", 7, 18
        ch.y_axis.number_format, ch.y_axis.scaling.min, ch.y_axis.scaling.max = "0%", 0, 1
        ch.add_data(Reference(w1, min_col=6, min_row=5, max_row=tr), titles_from_data=True)
        ch.set_categories(Reference(w1, min_col=1, min_row=r0, max_row=tr))
        ch.legend = None
        w1.add_chart(ch, f"I5")
    A1 = dict(r0=r0, r1=r1, tr=tr)

    # ---------- 2 Raida ----------
    if alt:
        w2 = wb.create_sheet("2 Raida")
        tabs["trend"] = w2.title
        q = ds[-5:] if len(ds) >= 5 else ds
        title(w2, "2 lentelė. Kiek fondo turto gali išeiti iki 30 % ribos – raida per ketvirčius", "lapas „Skaičiavimai“ (stulpelis „Gali išeiti iki 30 %“)",
              "100 % – riba toli, 0 % – alternatyvos jau sudaro 30 %. II pakopos suma – svertinė eurais: Σ „Gali išeiti, EUR“ ÷ Σ fondo turto.")
        head(w2, 5, ["Fondas"] + q + [f"Pokytis nuo {q[0]}, p. p."], [34] + [12] * len(q) + [16])
        lst = sorted(alt, key=lambda x: x["name"])
        for k, x in enumerate(lst):
            rr = 6 + k
            put(w2, rr, 1, f"={S('C', date, x['code'])}", "f")
            for j, d in enumerate(q, 2):
                if (d, x["code"]) in rowof:
                    put(w2, rr, j, f"={S('I', d, x['code'])}", "f", PCT1)
            put(w2, rr, len(q) + 2, f'=IF(OR(B{rr}="",{CL(len(q) + 1)}{rr}=""),"",({CL(len(q) + 1)}{rr}-B{rr})*100)', "f", '+0.0;-0.0;0.0')
        tr2 = 6 + len(lst)
        put(w2, tr2, 1, "II pakopa iš viso", "res")
        for j, d in enumerate(q, 2):
            cs = [x["code"] for x in alt if (d, x["code"]) in rowof and an[d]["res"][x["code"]]["in_alt"]]
            cs += [c for c, x in an[d]["res"].items() if x["in_alt"] and c not in cs]
            if cs:
                put(w2, tr2, j, "=(" + "+".join(f"N(Skaičiavimai!J{rowof[(d, c)]})" for c in cs) + ")/(" + "+".join(f"Skaičiavimai!E{rowof[(d, c)]}" for c in cs) + ")", "res", PCT1)
        put(w2, tr2, len(q) + 2, f"=({CL(len(q) + 1)}{tr2}-B{tr2})*100", "res", '+0.0;-0.0;0.0')
        heat(w2, f"B6:{CL(len(q) + 1)}{tr2}")

    # ---------- Matrica (interaktyvi) ----------
    sel = cur["summary"].get("selected")
    helper = [x for x in sorted(res.values(), key=lambda x: (x["pillar"], x["name"])) if x["in_alt"] or (x["in_bal"] and x["lim"] and x["bal"] > 0)]
    wm = wb.create_sheet("Matrica") if helper else None
    if helper:
        _matrix(wb, wm, helper, sel, cur, date, S, tabs)
    # ---------- 4 Baltijos ----------
    w4 = wb.create_sheet("4 Baltijos obligacijos")
    tabs["bal"] = w4.title
    title(w4, f"4 lentelė. Baltijos šalių obligacijos ir fondo obligacijų riba, {date}", "lapas „Skaičiavimai“ (LB „Skolos VP“, emitento šalis LT/LV/EE)",
          "Fondai, kurių obligacijų dalis taisyklėse ≤ 5 % (rizikingi, akcijos iki 100 %), neįtraukti – ten tai ne riba.")
    head(w4, 5, ["Fondas", "Pakopa", "Baltijos obligacijos, EUR", "Dalis fonde", "Fondo obligacijų riba", "Išnaudota ribos", "Gali išeiti iki ribos", "Gali išeiti, EUR"],
         [34, 8, 16, 12, 12, 12, 14, 16])
    for k, x in enumerate(bal):
        rr = 6 + k
        for j, col, fm_ in ((1, "C", None), (2, "D", None), (3, "K", EUR), (4, "M", PCT), (5, "N", PCT1), (7, "O", PCT), (8, "P", EUR)):
            put(w4, rr, j, f"={S(col, date, x['code'])}", "f", fm_)
        put(w4, rr, 6, f"=D{rr}/E{rr}", "f", PCT1)
    if bal:
        b1 = 5 + len(bal)
        w4.conditional_formatting.add(f"D6:D{b1}", FormulaRule(formula=["D6>=E6"], fill=R, stopIfTrue=True))
        w4.conditional_formatting.add(f"D6:D{b1}", FormulaRule(formula=["D6>=0.9*E6"], fill=Y, stopIfTrue=True))
        w4.conditional_formatting.add(f"D6:D{b1}", FormulaRule(formula=["D6>=0"], fill=G))
        heat(w4, f"G6:G{b1}")
        w4.conditional_formatting.add(f"A6:H{b1}", FormulaRule(formula=[f"OR($D6>=LARGE($D$6:$D${b1},MIN(2,COUNT($D$6:$D${b1}))),$G6=MIN($G$6:$G${b1}))"], font=Font(bold=True)))

    # ---------- 5 Pokyčiai ----------
    if prev_d and alt:
        w5 = wb.create_sheet("5 Pokyčiai")
        tabs["chg"] = w5.title
        title(w5, f"5 lentelė. Pokyčiai: {prev_d} → {date}", "lapas „Skaičiavimai“",
              "Dalies pokytis = dėl fondo turto pokyčio (A tas pats, keičiasi T) + dėl alternatyvų vertės pokyčio (nauji įmokėjimai, perkainojimas, išmokos – iš LB duomenų neatskiriama).")
        head(w5, 5, ["Fondas", "Fondo turto pokytis", "Alternatyvų pokytis, EUR", "Dalis buvo", "Dalis dabar", "Dalies pokytis", "iš jo dėl fondo turto",
                     "iš jo dėl alternatyvų vertės", "Pagrindinė priežastis", "Gali išeiti buvo", "Gali išeiti dabar"], [34, 12, 15, 11, 11, 11, 12, 12, 26, 12, 12])
        lst = [x for x in alt if (prev_d, x["code"]) in rowof]
        for k, x in enumerate(lst):
            rr = 6 + k
            c = x["code"]
            for j, col, fm_ in ((1, "C", None), (2, "AA", PCT1), (4, "V", PCT), (5, "G", PCT), (6, "W", PCT), (7, "X", PCT), (8, "Y", PCT), (10, "Z", PCT1), (11, "I", PCT1)):
                put(w5, rr, j, f"={S(col, date, c)}", "f", fm_)
            put(w5, rr, 3, f"={S('F', date, c)}-{S('U', date, c)}", "f", EUR)
            put(w5, rr, 9, f'=IF(ABS(G{rr})>=ABS(H{rr}),IF(B{rr}<0,"sumažėjo fondo turtas","padidėjo fondo turtas"),IF(C{rr}>0,"padidėjo alternatyvų vertė","sumažėjo alternatyvų vertė"))', "f")
        e1 = 5 + len(lst)
        put(w5, e1 + 1, 1, "II pakopa: gali išeiti iki 30 % (1 lentelė)", "res")
        put(w5, e1 + 1, 11, f"='1 Alternatyvos'!F{A1['tr']}", "res", PCT1)
        if "trend" in tabs and len(ds) >= 2:
            put(w5, e1 + 1, 10, f"='2 Raida'!{CL(min(5, len(ds)))}{6 + len(alt)}", "res", PCT1)
        for col in "BF":
            w5.conditional_formatting.add(f"{col}6:{col}{e1}", CellIsRule(operator="lessThan", formula=["-0.0005"], fill=R if col == "B" else G))
            w5.conditional_formatting.add(f"{col}6:{col}{e1}", CellIsRule(operator="greaterThan", formula=["0.0005"], fill=G if col == "B" else R))
        w5.conditional_formatting.add(f"A6:K{min(e1, 7)}", FormulaRule(formula=["TRUE"], font=Font(bold=True)))

    # ---------- Jautrumas ----------
    if alt:
        wj = wb.create_sheet("Jautrumas")
        title(wj, "Jautrumas: ribos prie rinkų kritimo ir scenarijus", "lapas „Skaičiavimai“", "Tiksli riba prie −10 %: x = (T − A − A·(1 − 30 %) ÷ (30 % · 0,9)) ÷ T.")
        head(wj, 5, ["Fondas", "Gali išeiti prie 0 % rinkos", "Gali išeiti prie −10 % rinkos", "Scenarijus x / m: alternatyvų dalis", "Buferis iki 30 %, p. p.",
                     "Tas pats kaip 2026-07-30 Excel", "Dalyvių pokytis per 2 ketv."], [34, 14, 14, 16, 14, 16, 14])
        for k, x in enumerate(alt):
            rr = 6 + k
            for j, col, fm_ in ((1, "C", None), (2, "I", PCT1), (3, "T", PCT1), (4, "R", PCT), (6, "S", PCT), (7, "Q", PCT1)):
                put(wj, rr, j, f"={S(col, date, x['code'])}", "f", fm_)
            put(wj, rr, 5, f"=(Riba30-D{rr})*100", "f", "0.00")
        colors_alt(wj, f"D6:D{5 + len(alt)}")

    # ---------- Santrauka (pirmas po „Apie failą“) ----------
    wsu = wb.create_sheet("Santrauka", 1)
    title(wsu, f"Santrauka – laiške minimi skaičiai, {date}", "lentelės 1–5 (formulės)")
    head(wsu, 5, ["Rodiklis", "Reikšmė", "Kur skaičiuojama"], [62, 22, 40])
    rows_s = []
    if alt:
        t1 = f"'1 Alternatyvos'!$E${A1['r0']}:$E${A1['r1']}"
        nm = f"'1 Alternatyvos'!$A${A1['r0']}:$A${A1['r1']}"
        ex = f"'1 Alternatyvos'!$F${A1['r0']}:$F${A1['r1']}"
        rows_s += [("Alternatyvų dalis II pakopos fonduose – mažiausia", f"=MIN({t1})", PCT, "1 lentelė, stulpelis E"),
                   ("Alternatyvų dalis II pakopos fonduose – didžiausia", f"=MAX({t1})", PCT, "1 lentelė, stulpelis E"),
                   ("Fondas su didžiausia alternatyvų dalimi", f"=INDEX({nm},MATCH(MAX({t1}),{t1},0))", None, "1 lentelė"),
                   ("Jo alternatyvos, EUR", f"=INDEX('1 Alternatyvos'!$C${A1['r0']}:$C${A1['r1']},MATCH(MAX({t1}),{t1},0))", EUR, "1 lentelė, stulpelis C"),
                   ("II pakopa: gali išeiti iki 30 % ribos", f"='1 Alternatyvos'!F{A1['tr']}", PCT1, "1 lentelė, eilutė „II pakopa iš viso“"),
                   ("II pakopa: gali išeiti, EUR", f"='1 Alternatyvos'!G{A1['tr']}", EUR, "1 lentelė, eilutė „II pakopa iš viso“"),
                   ("Jautriausias fondas", f"=INDEX({nm},MATCH(MIN({ex}),{ex},0))", None, "1 lentelė, mažiausia „Gali išeiti“"),
                   ("Jo išėjimo riba", f"=MIN({ex})", PCT1, "1 lentelė, stulpelis F")]
        if prev_d:
            rows_s += [("Ankstesnio ketvirčio alternatyvų dalis – mažiausia", f"=MIN('1 Alternatyvos'!$D${A1['r0']}:$D${A1['r1']})", PCT, "1 lentelė, stulpelis D"),
                       ("Ankstesnio ketvirčio alternatyvų dalis – didžiausia", f"=MAX('1 Alternatyvos'!$D${A1['r0']}:$D${A1['r1']})", PCT, "1 lentelė, stulpelis D")]
        if sel:
            rows_s += [(f"Matricos fondas: {sel['name']} – scenarijus 50 % / −10 %", f"={S('R', date, sel['code'])}", PCT, "Skaičiavimai, stulpelis R (ir Matrica)"),
                       ("Buferis iki 30 %, p. p.", f"=(Riba30-{S('R', date, sel['code'])})*100", "0.00", "Riba30 − scenarijus"),
                       ("Tas pats kaip 2026-07-30 Excel formule", f"={S('S', date, sel['code'])}", PCT, "Skaičiavimai, stulpelis S")]
    if bal:
        rows_s += [("Arčiausiai Baltijos obligacijų ribos – fondas", "='4 Baltijos obligacijos'!A6", None, "4 lentelė, pirma eilutė"),
                   ("Jo išėjimų riba iki obligacijų ribos", "='4 Baltijos obligacijos'!G6", PCT, "4 lentelė, stulpelis G")]
    for k, (lbl, fx, fm_, where) in enumerate(rows_s, 6):
        put(wsu, k, 1, lbl, "t")
        put(wsu, k, 2, fx, "res", fm_)
        put(wsu, k, 3, where, "note")

    # ---------- Alternatyvų sąrašas ----------
    wa = wb.create_sheet("Alternatyvų sąrašas")
    title(wa, "Alternatyvių investicijų sąrašas", "data/liq_alternatives.csv – kiekviena eilutė su šaltiniu ir peržiūros data",
          "is_alt = 0 – patvirtinta, kad NE alternatyva (pvz. listinguoti NT fondai). Naujos neklasifikuotos pozicijos – lape „Išimtys“.")
    head(wa, 5, ["Pavadinimas", "Kiti pavadinimai", "ISIN", "Alternatyva (1)", "Rūšis", "Šaltinis", "Peržiūrėta"], [40, 30, 14, 10, 24, 40, 12])
    for k, a in enumerate(alts, 6):
        for j, key in enumerate(("name", "aliases", "isin", "is_alt", "class", "source", "reviewed"), 1):
            put(wa, k, j, a.get(key, ""), "in")

    # ---------- Išimtys, Metodika, Laiškai ----------
    we = wb.create_sheet("Išimtys")
    title(we, "Duomenų patikros ir išimtys", "liquidity.py patikros (LB duomenys)")
    head(we, 5, ["Tipas", "Fondas", "Pavadinimas", "Vertė", "Pastaba"], [30, 16, 46, 16, 60])
    for k, e in enumerate(cur["exc"], 6):
        for j, v in enumerate(e, 1):
            put(we, k, j, v, "t", EUR if j == 4 else None)
    wt = wb.create_sheet("Metodika")
    wt.column_dimensions["A"].width = 150
    for k, t in enumerate(L.METHOD, 1):
        wt.cell(k, 1, t)
    for name, txt in (("Laiškas A", la), ("Laiškas B", lb)):
        if not txt:
            continue
        w = wb.create_sheet(name)
        w.column_dimensions["A"].width = 150
        for k, t in enumerate(txt, 1):
            tk = L.tok_parse(t, lt) if lt else None
            if tk:
                key = t[4:-2].split(":")[0]
                c = w.cell(k, 1, f"[{tk[1]} lentelė. {tk[0]['title']} – žr. lapą „{tabs.get(key, '')}“]")
                c.font = F_LINK
                if key in tabs:
                    c.hyperlink = f"#'{tabs[key]}'!A1"
            else:
                w.cell(k, 1, t)
    wb.calculation.fullCalcOnLoad = True
    wb.save(path)
    return path


# ---------- patikra: LibreOffice perskaičiuoja, palyginama su liquidity.py ----------
def check(prov="SEB", date=None):
    import shutil
    import subprocess
    import tempfile
    from openpyxl import load_workbook
    funds_cfg, alts, amap = L.load_cfg()
    an = L.all_analyses(prov)
    date = date or sorted(an)[-1]
    tmp = Path(tempfile.mkdtemp())
    p = tmp / "a.xlsx"
    write_proof(p, prov, date, an, L.prov_rows(prov), funds_cfg, alts, amap, [], [], {})
    subprocess.run(["soffice", "--headless", "--convert-to", "xlsx", "--outdir", str(tmp / "o"), str(p)], check=True, capture_output=True, timeout=180)
    wb = load_workbook(tmp / "o" / "a.xlsx", data_only=True)
    ws = wb["Skaičiavimai"]
    bad = n = 0
    keys = {6: "alt", 7: "alt_sh", 9: "alt_x", 10: "alt_xe", 11: "bal", 12: "bonds", 13: "bal_sh", 15: "bal_x", 18: "c5010", 19: "c5010_xl", 17: "part_chg"}
    for row in ws.iter_rows(min_row=6, values_only=True):
        if not row[0]:
            continue
        r = an[row[0]]["res"][row[1]]
        for j, k in keys.items():
            a, b = row[j - 1], r.get(k)
            if k in ("alt_x", "alt_xe") and not r["in_alt"]:
                b = None
            if k in ("bal_x",) and not (r["in_bal"] and r["lim"] and r["bal"] > 0):
                b = None
            a = None if a in ("", None) else float(a)
            n += 1
            if (a is None) != (b is None) or (a is not None and abs(a - b) > 1e-6 * max(1, abs(b))):
                bad += 1
                if bad <= 10:
                    print("NESUTAMPA", row[0], row[1], k, a, b)
    # visi lapai: jokių #REF!, #VALUE!, #NAME? ir pan.; santrauka = liquidity.py santrauka
    for w in wb.worksheets:
        for row in w.iter_rows():
            for c in row:
                if isinstance(c.value, str) and c.value.startswith("#") and c.value.rstrip("!?0/").isupper():
                    bad += 1
                    print("KLAIDA", w.title, c.coordinate, c.value)
    sm = cur_s = an[date]["summary"]
    if sm.get("alt_min"):
        su = {r[0]: r[1] for r in wb["Santrauka"].iter_rows(min_row=6, values_only=True) if r[0]}
        exp = {"Alternatyvų dalis II pakopos fonduose – mažiausia": cur_s["alt_min"]["alt_sh"], "Alternatyvų dalis II pakopos fonduose – didžiausia": cur_s["alt_max"]["alt_sh"],
               "Fondas su didžiausia alternatyvų dalimi": cur_s["alt_max"]["name"], "II pakopa: gali išeiti iki 30 % ribos": cur_s["ii_x"],
               "II pakopa: gali išeiti, EUR": cur_s["ii_xe"], "Jautriausias fondas": cur_s["sensitive"]["name"]}
        for k, v in exp.items():
            a = su.get(k)
            ok = a == v if isinstance(v, str) else (a is not None and abs(float(a) - v) <= 1e-6 * max(1, abs(v)))
            n += 1
            if not ok:
                bad += 1
                print("SANTRAUKA NESUTAMPA", k, a, v)
    print(f"{prov} {date}: patikrinta {n} reikšmių, nesutampa {bad}")
    shutil.rmtree(tmp, ignore_errors=True)
    return bad


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "check":
        provs = sys.argv[2:] or L.providers()
        sys.exit(1 if sum(check(p) for p in provs) else 0)
