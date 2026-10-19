#!/usr/bin/env python3
"""
Lietuvos banko ketvirtinių pensijų fondų rezultatų failų istorija -> data/lb_results_history.csv.

Šaltiniai (viešos LB ataskaitos „Pensijų fondų veiklos rodikliai“, lb.lt/lt/pf-veiklos-rodikliai):
- imports/lb_history/ii-YYYYMMDD.xls[x], iii-YYYYMMDD.xls[x] – savininko atsiųsti 2015-03-31…2026-09-30 failai (2026-10-19);
- imports/lb_results/2-pakopa-rezultatai-YYYYMMDD.xlsx ir imports/lb_archive/3_pakopa_rezultatai_YYYYMMDD*.xlsx –
  naujesni failai, kuriuos kasdien parsisiunčia tools/fetch_lb.py (jis po naujo failo paleidžia ir šį skriptą).
Tai pačiai datai imamas imports/lb_history failas, jei jo nėra – automatiškai parsisiųstas.

LB failų formos:
- 2015–2019-03: lapas „Rezultatai“ (fondo pavadinimas, be kodo; grupės – „KONSERVATYVAUS INVESTAVIMO…“ eilutės) ir
  „Papildomi duomenys“ / „Papildoma informacija“ (dalyvių skaičius ir grynieji aktyvai pagal fondą ir valdymo įmonę);
- nuo 2019-06: lapas su fondų kodais (LMN-75/81, S022…), dalyviais, grąžomis, lyginamaisiais indeksais, rizika, BAR/BIK;
  II pakopos failuose tos pačios eilutės dar pakartotos kiekvienos grupės lape (dublikatai praleidžiami).
Stulpeliai atpažįstami pagal antraščių tekstą, todėl LB pridėti ar perkelti stulpeliai nesugadina skaitymo.

Eilutės rūšis (kind): fund – fondas; group_avg – LB svertinis grupės vidurkis (svoriai – fondų grynieji aktyvai
ataskaitos dieną, LB išnaša); all_avg – visų fondų svertinis vidurkis; company – valdymo įmonės suma (dalyviai, aktyvai).
Grąžos – procentais, kaip LB faile (3, 5, 10, 15 m. ir nuo GCF pradžios – vidutinės metinės).

Paleidimas: python3 lb_history.py  (reikia openpyxl ir xlrd).
"""
import csv
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).parent
IMP = ROOT / "imports"
OUT = ROOT / "data" / "lb_results_history.csv"

FIELDS = ["date", "pillar", "kind", "provider", "company", "code", "name", "lb_group", "years", "risky",
          "nav_meur", "participants", "ret_ytd", "ret_1y", "ret_3y", "ret_5y", "ret_10y", "ret_15y", "ret_gcf",
          "bm_ytd", "bm_1y", "bm_3y", "bm_5y", "bm_gcf", "std_ytd", "std_3y", "std_5y", "std_10y",
          "bar", "bik", "bik_exp", "source"]

# Dabartinis valdytojas pagal įmonės / fondo pavadinimo žodį (tvarka svarbi: „SEB“ prieš „SB Asset“).
# Perėmimai: Aviva → Allianz; DNB → Luminor; Finasta, MP Pension Funds Baltic, INVL, SB Asset Management → Artea;
# Danske Capital → Swedbank (2015). Nežinomi (pvz. ERGO) paliekami savo vardu.
PROVIDER = [("allianz", "Allianz"), ("aviva", "Allianz"), ("goindex", "Goindex"), ("seb", "SEB"),
            ("swedbank", "Swedbank"), ("danske", "Swedbank"), ("luminor", "Luminor"), ("dnb", "Luminor"),
            ("invl", "Artea"), ("artea", "Artea"), ("sb asset", "Artea"), ("finasta", "Artea"),
            ("mp pension", "Artea"), ("mp ", "Artea"), ("ergo", "ERGO"), ("citadele", "Citadele")]
CODE_PROVIDER = {"AVI": "Allianz", "GOX": "Goindex", "INV": "Artea", "LMN": "Luminor", "SBN": "SEB", "SWD": "Swedbank"}
CODE_RE = re.compile(r"^(?:[A-Z]{3}-(?:\d\d/\d\d|TIPF)|S0\d\d)$")

# antraštės tekstas -> laukas (pirmas tinkamas; tikrinama mažosiomis raidėmis)
PERIODS = [("ytd", r"nuo metų pradžios"), ("1y", r"\b1 met"), ("3y", r"\b3 met"), ("5y", r"\b5 met"),
           ("10y", r"\b10 met"), ("15y", r"\b15 met"), ("gcf", r"gcf")]


def field_of(h: str):
    h = h.lower()
    if not h:
        return None
    for key, pat in [("code", r"fondo kodas"), ("company", r"bendrovės pavadinimas"), ("participants", r"dalyvių"),
                     ("nav_meur", r"grynųjų aktyvų|fondo dydis"), ("risky", r"rizikingų aktyvų|akcijas dalis"),
                     ("years", r"veiklos\s+laikotarpis"), ("bik_exp", r"tikėtinas"), ("bik", r"bik"),
                     ("bar", r"\bbar\b")]:
        if re.search(pat, h):
            return key
    if re.search(r"fondo pavadinimas", h):
        return "name"
    for per, pat in PERIODS:
        if re.search(pat, h):
            if "nuokryp" in h:
                return None if "lyginam" in h else f"std_{per}"
            if "lyginam" in h:
                return f"bm_{per}"
            if re.search(r"grąž|pokyt", h):
                return f"ret_{per}"
    return None


def sheets(path: Path):
    if path.suffix == ".xls":
        import xlrd
        wb = xlrd.open_workbook(str(path))
        for sh in wb.sheets():
            yield sh.name, [sh.row_values(i) for i in range(sh.nrows)]
    else:
        import openpyxl
        wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
        for ws in wb.worksheets:
            yield ws.title, [list(r) for r in ws.iter_rows(values_only=True)]


def txt(v) -> str:
    return re.sub(r"\s+", " ", str(v)).strip() if v not in (None, "") else ""


def num(v):
    """Skaičius iš LB langelio: 12.3, „48,84 (168,63)“ (mln. Eur (mln. Lt)), „-“, „Veikia trumpiau“ -> None."""
    if isinstance(v, bool) or v in (None, ""):
        return None
    if isinstance(v, (int, float)):
        return float(v)
    m = re.match(r"^\s*(-?\d[\d ]*(?:[.,]\d+)?)\s*(?:\(|%|$)", str(v))
    return float(m.group(1).replace(" ", "").replace(",", ".")) if m else None


def norm(s: str) -> str:
    s = unicodedata.normalize("NFKD", s.lower())
    return re.sub(r"[^a-z0-9]+", " ", "".join(c for c in s if not unicodedata.combining(c))).strip()


def provider_of(company: str, name: str, code: str = "") -> str:
    if code[:3] in CODE_PROVIDER:
        return CODE_PROVIDER[code[:3]]
    for text in (company, name):
        t = " " + text.lower().replace("„", "").replace("“", "").replace('"', "") + " "
        for key, prov in PROVIDER:
            if (" " + key) in t:
                return prov
    return ""


def years_of(v):
    """„21 m. 9 mėn.“ / 10.797 -> metai (float)."""
    if isinstance(v, (int, float)):
        return round(float(v), 2)
    m = re.match(r"\s*(\d+)\s*m\.\s*(\d+)?", txt(v))
    return round(int(m.group(1)) + int(m.group(2) or 0) / 12, 2) if m else None


def results_sheet(rows, date, pillar, src, sheet):
    """Rezultatų lapas -> eilučių sąrašas (fondai ir svertiniai vidurkiai)."""
    hdr = next((i for i, r in enumerate(rows[:8]) if any("pavadinimas" in txt(c).lower() for c in r)), None)
    if hdr is None:
        return []
    last = hdr + 1 if any("proc" in txt(c).lower() for c in rows[hdr + 1]) else hdr
    width = max(len(r) for r in rows[: last + 1])
    cols = {}
    for j in range(width):
        h = " ".join(txt(rows[i][j]) for i in range(last + 1) if j < len(rows[i]))
        f = field_of(h)
        if f and f not in cols.values():
            cols[j] = f
    if "name" not in cols.values():
        cols[0 if "code" not in cols.values() else 2] = "name"
    inv = {f: j for j, f in cols.items()}
    group = "Likviduoti fondai" if sheet.lower().startswith("likviduoti") else ""
    out = []
    for r in rows[last + 1:]:
        cells = [txt(c) for c in r]
        if not any(cells):
            continue
        first = cells[0]
        if re.match(r"^(\*|\[\d|pastaba|rizikos ir|kuo |dešiniau|dalyvių skaičiaus|fondas\b)", first.lower()):
            break                                           # išnašos ir grafikų duomenys po lentelės
        get = lambda f: r[inv[f]] if f in inv and inv[f] < len(r) else None
        vals = {f: num(get(f)) for f in inv if f.startswith(("ret_", "bm_", "std_"))}
        avg = next((c for c in cells if "svertinis" in c.lower()), "")
        if not avg and re.match(r"^(iš )?viso:?$", first.lower()):
            avg = "Visų fondų iš viso"                     # 2015–2019 m. failų paskutinė eilutė (turtas + svertinė grąža)
        code = txt(get("code"))
        name = re.sub(r"\s*\*+$", "", txt(get("name")))  # išnašų žvaigždutės
        if not avg and not any(v is not None for v in vals.values()) and num(get("nav_meur")) is None:
            if first and not CODE_RE.match(code):
                group = re.sub(r"\s*\*+$", "", first)       # grupės antraštė
            continue
        if avg and first and "svertinis" not in first.lower() and not first.lower().startswith(("viso", "iš viso")):
            group = first                                   # nuo 2019-06: grupės pavadinimas ir vidurkis vienoje eilutėje
        row = dict(date=date, pillar=pillar, source=src, lb_group=group, **{k: v for k, v in vals.items()})
        if avg:
            row.update(kind="all_avg" if "visų" in avg.lower() else "group_avg", name=group if "visų" not in avg.lower() else "Visi fondai")
            if row["kind"] == "all_avg":
                row["lb_group"] = ""
                row["nav_meur"] = num(get("nav_meur"))
            if row["kind"] == "group_avg" and not group:
                continue
        else:
            if not name:
                continue
            company = txt(get("company"))
            row.update(kind="fund", code=code if CODE_RE.match(code) else "", name=name, company=company,
                       provider=provider_of(company, name, code), years=years_of(get("years")),
                       risky=txt(get("risky")), nav_meur=num(get("nav_meur")), participants=num(get("participants")),
                       bar=num(get("bar")), bik=num(get("bik")), bik_exp=num(get("bik_exp")))
        out.append(row)
    return out


def extra_sheet(rows):
    """„Papildomi duomenys“ / „Papildoma informacija“ -> ({fondas: {participants, nav_eur}}, {įmonė: {...}})."""
    funds, comps = {}, {}
    target = metric = None
    for r in rows:
        a, b = (txt(r[0]) if r else ""), (r[1] if len(r) > 1 else None)
        al = a.lower()
        heads = [txt(c).lower() for c in r[1:4]]
        if al in ("fondas", "valdymo įmonė", "pensijų kaupimo bendrovė") or al.startswith("pensijų fond"):
            target = funds if al.startswith(("fondas", "pensijų fond")) else comps
            metric = [("participants" if "dalyvi" in h else "nav_meur" if "aktyv" in h else None,
                       ("mln" not in h) and "aktyv" in h) for h in heads]
            continue
        if target is None or not a:
            continue
        if al.startswith(("viso", "iš viso", "*")) or num(b) is None:
            if al.startswith(("viso", "iš viso")):
                key = "__total__"
                for (m, in_eur), v in zip(metric, r[1:4]):
                    if m and num(v) is not None:
                        target.setdefault(key, {})[m] = num(v) / 1e6 if in_eur else num(v)
            target = None if not al.startswith(("viso", "iš viso")) else target
            continue
        for (m, in_eur), v in zip(metric, r[1:4]):
            if m and num(v) is not None:
                target.setdefault(a, {})[m] = num(v) / 1e6 if in_eur else num(v)
    return funds, comps


def match(fund: dict, byname: dict):
    """Fondas papildomame lape. 2017–2019 m. ten trumpesni vardai („Pensija 3“ = „Swedbank Pensija 3“, „INVL EXTREMO II
    16 + pensijų fondas“ = „INVL EXTREMO II 16+“), o dalyvių ir aktyvų blokuose tas pats fondas kartais pavadintas skirtingai.
    Todėl sujungiama: tikslus vardas + tas pats grynųjų aktyvų dydis (rezultatų lape mln. Eur, papildomame – Eur) +
    vienintelis vardas, kuris yra kito pradžia ar pabaiga."""
    n = norm(fund["name"])
    out = dict(byname.get(n, {}))
    nav = fund.get("nav_meur")
    if nav and "participants" not in out:
        hit = [v for v in byname.values() if v.get("nav_meur") is not None and abs(v["nav_meur"] - nav) < 0.006]
        if len(hit) == 1:
            out = {**hit[0], **out}
    for same in (lambda k: n.endswith(" " + k) or k.endswith(" " + n),        # pirma – pagal pabaigą, tada – pagal pradžią
                 lambda k: n.startswith(k + " ") or k.startswith(n + " ")):
        if "participants" in out:
            break
        hit = [v for k, v in byname.items() if k != n and same(k)]
        if len(hit) == 1:
            out = {**hit[0], **out}
    return out or None


def date_of(path: Path, rows) -> str:
    for r in rows[:2]:
        for c in r[:2]:
            s = str(c or "")
            m = re.search(r"(20\d\d)-(\d\d)-(\d\d)", s)
            if m:
                return m.group(0)
    m = re.search(r"(20\d\d)-?(\d\d)-?(\d\d)", path.name)
    return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"


def files():
    """{(pakopa, YYYYMMDD): kelias} – imports/lb_history pirmenybė, kitaip automatiškai parsisiųsti failai."""
    out = {}
    auto = list((IMP / "lb_results").glob("2-pakopa-rezultatai-*.xlsx")) + \
        list((IMP / "lb_archive").glob("3_pakopa_rezultatai_*.xlsx"))
    for p in sorted(auto):
        m = re.search(r"(\d{8})", p.name)
        out[("II" if p.name.startswith("2") else "III", m.group(1))] = p
    for p in sorted((IMP / "lb_history").glob("ii*-*.xls*")):
        m = re.match(r"(iii|ii)-(\d{8})\.xlsx?$", p.name)
        if m:
            out[(m.group(1).upper(), m.group(2))] = p
    return out


def read(path: Path, pillar: str):
    src = str(path.resolve().relative_to(ROOT.resolve()))
    rows_out, extra = [], ({}, {})
    first = None
    for name, rows in sheets(path):
        if first is None:
            first = rows
        nl = name.lower()
        if "strategij" in nl:
            continue
        if nl.startswith("papildom"):
            extra = extra_sheet(rows)
            continue
        rows_out += results_sheet(rows, date_of(path, first), pillar, src, name)
    date = date_of(path, first)
    seen, uniq = set(), []
    for r in rows_out:                              # II pakopos grupių lapai kartoja pagrindinio lapo eilutes
        key = (r["kind"], r.get("code") or r.get("name"), r["lb_group"] if r["kind"] != "fund" else "")
        if key in seen:
            continue
        seen.add(key)
        uniq.append(r)
    funds, comps = extra
    byname = {}
    for k, v in funds.items():                      # dalyvių ir aktyvų blokuose tas pats fondas kartais rašomas skirtinga raide
        if k != "__total__":
            byname.setdefault(norm(k), {}).update(v)
    for r in uniq:
        if r["kind"] == "fund":
            x = match(r, byname)
            if x:
                if r.get("participants") is None:
                    r["participants"] = x.get("participants")
                if r.get("nav_meur") is None:
                    r["nav_meur"] = x.get("nav_meur")
    for comp, x in comps.items():
        if comp == "__total__":
            continue
        uniq.append(dict(date=date, pillar=pillar, kind="company", company=comp, provider=provider_of(comp, comp),
                         name=comp, source=src, **x))
    tot = comps.get("__total__") or funds.get("__total__")
    if tot:
        uniq.append(dict(date=date, pillar=pillar, kind="company", name="Iš viso", company="Iš viso", source=src, **tot))
    return uniq


def main():
    all_rows = []
    for (pillar, d), path in sorted(files().items(), key=lambda x: (x[0][1], x[0][0])):
        rows = read(path, pillar)
        nf = sum(r["kind"] == "fund" for r in rows)
        npart = sum(r["kind"] == "fund" and r.get("participants") is not None for r in rows)
        print(f"{pillar:>3} {d}: fondų {nf:3}, su dalyviais {npart:3}  ({path.name})")
        all_rows += rows
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, FIELDS, extrasaction="ignore")
        w.writeheader()
        for r in all_rows:
            w.writerow({k: (round(v, 6) if isinstance(v, float) else v) for k, v in r.items()})
    print(f"Įrašyta {OUT.relative_to(ROOT)}: {len(all_rows)} eilučių")


if __name__ == "__main__":
    main()
