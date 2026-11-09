#!/usr/bin/env python3
"""
SEB pensijų fondų likvidumo analizė pagal Lietuvos banko ketvirčio portfelių duomenis (savininko užduotis 2026-11-09).

Klausimas: kiek fondo turto gali išeiti (dalyvių išėjimai) ir kiek gali kristi rinkos, kol
  • alternatyvių (nelistinguotų PE / infrastruktūros / NT / VC) investicijų dalis pasiekia 30 % ribą;
  • Baltijos šalių obligacijų dalis pasiekia fondo taisyklėse nustatytą obligacijų dalį.
Tai ne prognozė, o konservatyvus matematinis testas: nelikvidi dalis laikoma nekintančia, išėjimai ir rinkų
kritimas mažina tik likusį (likvidų) turtą.

Šaltiniai: data/portfolios.csv (LB portfeliai, portfolios.py), data/lb_results_history.csv (grynieji aktyvai,
dalyviai). Konfigūracija (su šaltiniu ir peržiūros data): data/liq_funds.csv (fondai, obligacijų ribos),
data/liq_alternatives.csv (kontroliuojamas alternatyvų sąrašas; is_alt=0 – patvirtinta, kad NE alternatyva). Nauji ar neaiškūs instrumentai į skaičiavimą
NEįtraukiami – jie rodomi išimčių sąraše žmogaus peržiūrai.

„Įskaitant likusius įsipareigojimus“ (undrawn commitment) NEskaičiuojama – patikimų duomenų nėra; logika
aprašyta lape „Metodika“.

Rezultatas: Excel (lentelės, spalvotos matricos, palyginimas, išimtys, metodika) ir laiško projektai A/B (.txt, .docx).
Failai yra SEB vidinė analizė – į viešą repo / svetainę NEdėti. Laiškas niekada nesiunčiamas automatiškai.

Paleidimas:
  python liquidity.py                      – naujausias ketvirtis → ./likvidumas/<data>/
  python liquidity.py --date 2026-06-30 --out /mnt/project-files/likvidumas
  python liquidity.py status               – naujausia data ir ar jau išsiųsta vakariniame laiške
  python liquidity.py selftest             – kontroliniai pavyzdžiai iš 2026-07-30 matricos
"""
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).parent
PF = ROOT / "data" / "portfolios.csv"
LBR = ROOT / "data" / "lb_results_history.csv"
FUNDS = ROOT / "data" / "liq_funds.csv"
ALTS = ROOT / "data" / "liq_alternatives.csv"
STATE = ROOT / "data" / "report_state.json"     # raktas "liq" – paskutinė vakariniame laiške pridėta data

ALT_LIMIT = 0.30
REFERENCE_DATE = "2025-12-31"                   # paskutinis ketvirtis prieš 2026 m. II pakopos reformą
EXITS = [i / 10 for i in range(10)]             # 0 … 90 %
MARKET = [i / 20 for i in range(20)]            # 0 … 95 % kritimas
CENTRAL = (0.5, 0.10)                           # fiksuotas neigiamas scenarijus: 50 % išėjimų, −10 % rinkos
ALT_KIS = {"5", "6", "7"}                       # LB KIS tipai: 5 NT, 6/7 kiti (privataus kapitalo ir pan.) fondai
KEYWORDS = ["private equity", "venture capital", "infrastructure fund", "real estate fund", "opportunity fund",
            "partners fund", "green fund", "capital fund", "kūb", "kub", "scsp"]
BALTIC = {"LT", "LV", "EE"}
POS_TOL = 0.02                                  # pozicijų suma vs grynieji aktyvai


# ---------- pagalbinės ----------
def norm(s: str) -> str:
    s = (s or "").lower().replace("ū", "u").replace("„", "").replace("“", "").replace('"', "")
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def pct(x, d=2) -> str:
    return "–" if x is None else f"{x * 100:.{d}f}".replace(".", ",") + " %"


def pp(x, d=2) -> str:
    return "–" if x is None else f"{x * 100:+.{d}f}".replace(".", ",") + " p. p."


def eur(x) -> str:
    return "–" if x is None else f"{x:,.0f}".replace(",", " ") + " EUR"


def meur(x, d=2) -> str:
    if x is None:
        return "–"
    if abs(x) >= 1e9:
        return f"{x / 1e9:.3f}".replace(".", ",") + " mlrd. EUR"
    return f"{x / 1e6:.{d}f}".replace(".", ",") + " mln. EUR"


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return None


# ---------- formulės ----------
def share(a: float, t: float, x: float, m: float, mode: str = "excel") -> float:
    """Nelikvidžios dalies (a) svoris po x išėjimų ir m rinkų kritimo; likusi dalis t−a.
    excel: (t−a)(1−x−m) – kaip 2026-07-30 Excel faile (x ir m – pradinio likvaus turto dalys, sumuojamos);
    seq:   (t−a)(1−x)(1−m) – kritimas taikomas po išėjimų (švelnesnis)."""
    if a <= 0:
        return 0.0
    rest = (t - a) * ((1 - x - m) if mode == "excel" else (1 - x) * (1 - m))
    return 1.0 if rest <= 0 else min(1.0, a / (a + rest))


def exit_limit(a: float, t: float, lim: float):
    """Kiek % viso AUM gali išeiti, kol a/AUM pasiekia lim (a nekinta). Grąžina (%, EUR)."""
    if not t or t <= 0 or not lim:
        return None, None
    v = max(0.0, min(1.0, 1 - a / (lim * t)))
    return v, max(0.0, t - a / lim)


def grid_hit(a, t, lim, m, mode="excel"):
    """Mažiausias matricos išėjimų lygis (0–90 %), kai dalis ≥ ribos; None – nepasiekiama iki 90 %."""
    for x in EXITS:
        if share(a, t, x, m, mode) >= lim - 1e-12:
            return x
    return None


def exact_hit(a, t, lim, m):
    """Tiksli išėjimų dalis (nuo likvaus turto t−a), kai pasiekiama riba, Excel formulei."""
    if a <= 0 or t <= a:
        return None if a <= 0 else 0.0
    return max(0.0, 1 - m - a * (1 - lim) / (lim * (t - a)))


# ---------- duomenys ----------
def load_cfg():
    funds = list(csv.DictReader(FUNDS.open(encoding="utf-8")))
    alts = list(csv.DictReader(ALTS.open(encoding="utf-8")))
    amap = {}      # pavadinimas / ISIN → sąrašo pavadinimas; "" – patvirtinta, kad NE alternatyva (is_alt=0)
    for r in alts:
        val = r["name"] if r.get("is_alt", "1") == "1" else ""
        for n in [r["name"]] + [x for x in r.get("aliases", "").split("|") if x]:
            amap[norm(n)] = val
        if r.get("isin"):
            amap[r["isin"]] = val
    return funds, alts, amap


def seb_dates():
    ds = set()
    with PF.open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["provider"] == "SEB":
                ds.add(r["date"])
    return sorted(ds)


def seb_rows(dates: set):
    out = defaultdict(list)
    with PF.open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            if r["provider"] == "SEB" and r["date"] in dates:
                out[r["date"]].append(r)
    return out


def lb_results():
    nav, part = {}, {}
    if LBR.exists():
        with LBR.open(encoding="utf-8") as f:
            for r in csv.DictReader(f):
                if r["provider"] == "SEB" and r["kind"] == "fund" and r["code"]:
                    if num(r["nav_meur"]):
                        nav[(r["date"], r["code"])] = num(r["nav_meur"]) * 1e6
                    if num(r["participants"]):
                        part[(r["date"], r["code"])] = num(r["participants"])
    return nav, part


# ---------- vieno laikotarpio analizė ----------
def analyse(date, rows, funds, amap, nav, part, all_dates):
    cfg = {f["code"]: f for f in funds}
    fx = {}
    exc = []          # (tipas, fondas, pavadinimas, vertė, pastaba)
    review = {}       # galimai alternatyvios
    seen_codes = {}
    for r in rows:
        code = r["fund_code"]
        seen_codes[code] = r["fund_name"]
        d = fx.setdefault(code, dict(pos=0.0, alt=0.0, bal=0.0, bonds=0.0, altpos=defaultdict(float), balpos=defaultdict(float)))
        v = num(r["value"])
        if v is None:
            exc.append(("Trūksta vertės", code, r["name"], None, "pozicija be vertės – neįtraukta"))
            continue
        if v < 0 and r["type"] != "derivative":
            exc.append(("Neigiama vertė", code, r["name"], v, f"tipas {r['type']} – patikrinti"))
        d["pos"] += v
        is_alt = None
        if r["type"] == "fund":
            key = r["pos_id"] if r["pos_id"] in amap else norm(r["name"])
            is_alt = amap.get(key)
            if key in amap and not is_alt:
                pass   # patvirtinta: ne alternatyva
            elif is_alt:
                d["alt"] += v
                d["altpos"][is_alt] += v
            elif r["kis_type"] in ALT_KIS or any(k in r["name"].lower() for k in KEYWORDS):
                k = norm(r["name"])
                rv = review.setdefault(k, dict(name=r["name"], pos_id=r["pos_id"], kis=r["kis_type"], value=0.0, funds=set()))
                rv["value"] += v
                rv["funds"].add(code)
        if r["type"] == "bond":
            d["bonds"] += v
            if r["country"] in BALTIC:
                d["bal"] += v
                d["balpos"][f"{r['name']} ({r['country']})"] += v
        elif r["type"] == "equity" and r["country"] in BALTIC:
            pass   # Baltijos akcijos sąmoningai neįtraukiamos
    for code, name in seen_codes.items():
        if code not in cfg:
            exc.append(("Naujas arba neklasifikuotas fondas", code, name, fx[code]["pos"], "nėra data/liq_funds.csv – reikia žmogaus peržiūros"))
    res = {}
    # dalyvių pokytis per 2 ketvirčius (faktinių išėjimų pakaitalas)
    i = all_dates.index(date) if date in all_dates else -1
    d2 = all_dates[i - 2] if i >= 2 else None
    for f in funds:
        code = f["code"]
        if code not in fx:
            if f["alt"] == "1" or f["baltic"] == "1":
                exc.append(("Fondo nėra duomenyse", code, f["name"], None, "konfigūracijoje yra, LB faile – ne"))
            continue
        d = fx[code]
        t_nav = nav.get((date, code))
        t = t_nav or d["pos"]
        if not t_nav:
            exc.append(("Trūksta AUM", code, f["name"], d["pos"], "LB grynųjų aktyvų nėra – naudota pozicijų suma"))
        elif abs(d["pos"] / t_nav - 1) > POS_TOL:
            exc.append(("Nesutampa sumos", code, f["name"], d["pos"] - t_nav,
                        f"pozicijų suma {pct(d['pos'] / t_nav)} grynųjų aktyvų"))
        if d["alt"] > t:
            exc.append(("Alternatyvos > AUM", code, f["name"], d["alt"], "neįmanoma – patikrinti duomenis"))
        if d["bal"] > d["bonds"] + 1e-6:
            exc.append(("Baltijos obligacijos > visos obligacijos", code, f["name"], d["bal"], "patikrinti"))
        lim = num(f["bond_limit_pct"])
        lim = lim / 100 if lim is not None else None
        if f["baltic"] == "1" and not lim:
            exc.append(("Nėra obligacijų ribos", code, f["name"], None, "papildyti data/liq_funds.csv"))
        p_now, p_old = part.get((date, code)), part.get((d2, code)) if d2 else None
        ex_p, ex_e = exit_limit(d["alt"], t, ALT_LIMIT)
        bx_p, bx_e = exit_limit(d["bal"], t, lim) if lim else (None, None)
        res[code] = dict(code=code, name=f["name"], pillar=f["pillar"], in_alt=f["alt"] == "1", in_bal=f["baltic"] == "1",
                         aum=t, pos=d["pos"], nav_src="LB grynieji aktyvai" if t_nav else "pozicijų suma",
                         alt=d["alt"], alt_sh=d["alt"] / t if t else None, alt_x=ex_p, alt_xe=ex_e,
                         bal=d["bal"], bal_sh=d["bal"] / t if t else None, bonds=d["bonds"], lim=lim, bal_x=bx_p, bal_xe=bx_e,
                         altpos=dict(d["altpos"]), balpos=dict(d["balpos"]),
                         part=p_now, part_chg=(p_now / p_old - 1) if p_now and p_old else None)
        r = res[code]
        r["hit0"], r["hit10"] = grid_hit(d["alt"], t, ALT_LIMIT, 0), grid_hit(d["alt"], t, ALT_LIMIT, 0.10)
        r["ex0"], r["ex10"] = exact_hit(d["alt"], t, ALT_LIMIT, 0), exact_hit(d["alt"], t, ALT_LIMIT, 0.10)
        r["c5010"] = share(d["alt"], t, *CENTRAL)
        r["c5010_seq"] = share(d["alt"], t, *CENTRAL, mode="seq")
        if lim:
            r["bhit0"], r["bhit10"] = grid_hit(d["bal"], t, lim, 0), grid_hit(d["bal"], t, lim, 0.10)
            r["b5010"] = share(d["bal"], t, *CENTRAL)
    for k, rv in review.items():
        exc.append(("Galimai alternatyvi investicija", ", ".join(sorted(rv["funds"])), rv["name"], rv["value"],
                    f"LB KIS tipas {rv['kis'] or '–'}; NEįtraukta – patvirtinti ir įrašyti į data/liq_alternatives.csv"))
    return dict(date=date, res=res, exc=exc, d2=d2, summary=summarise(res))


def total(rs, key_in):
    t = sum(r["aum"] for r in rs)
    a = sum(r[key_in] for r in rs)
    return t, a


def summarise(res):
    alt = [r for r in res.values() if r["in_alt"]]
    ii = [r for r in alt if r["pillar"] == "II"]
    s = {}
    if alt:
        s["alt_min"] = min(alt, key=lambda r: r["alt_sh"])
        s["alt_max"] = max(alt, key=lambda r: r["alt_sh"])
        s["sensitive"] = min(alt, key=lambda r: r["alt_x"])
        t, a = total(ii, "alt")
        s["ii_aum"], s["ii_alt"] = t, a
        s["ii_xe"] = sum(r["alt_xe"] for r in ii)
        s["ii_x"] = s["ii_xe"] / t if t else None
        s["ii_x_avg_wrong"] = sum(r["alt_x"] for r in ii) / len(ii) if ii else None
        ta, aa = total(alt, "alt")
        s["all_aum"], s["all_alt"], s["all_xe"] = ta, aa, sum(r["alt_xe"] for r in alt)
        drops = [r for r in ii if r["part_chg"] is not None]
        if drops:
            s["selected"] = min(drops, key=lambda r: r["part_chg"])
            s["sel_reason"] = (f"per du paskutinius ketvirčius jame labiausiai sumažėjo dalyvių skaičius "
                               f"({pct(s['selected']['part_chg'], 1)}, LB rezultatų duomenys)")
            if s["selected"]["code"] != s["sensitive"]["code"]:
                s["sel_reason"] += f"; matematiškai jautriausias – {s['sensitive']['name']}"
        else:
            s["selected"] = s["sensitive"]
            s["sel_reason"] = ("tai matematiškai jautriausias fondas (mažiausia išėjimų riba iki 30 %); "
                               "tai nėra prognozė, kad iš jo pasitrauks daugiausia dalyvių")
    bal = [r for r in res.values() if r["in_bal"] and r["lim"]]
    if bal:
        s["bal_top"] = sorted(bal, key=lambda r: -r["bal_sh"])[:2]
        s["bal_over"] = [r for r in bal if r["bal_sh"] >= r["lim"]]
        ok = [r for r in bal if r["bal_sh"] < r["lim"] and r["bal"] > 0]
        s["bal_min"] = min(ok, key=lambda r: r["bal_x"]) if ok else None
        s["bal_sel"] = s["bal_min"] or (s["bal_over"][0] if s["bal_over"] else None)
    return s


# ---------- palyginimas ----------
def compare(cur, prev):
    """(rodiklis, ankstesnis, naujas, pokytis) – tekstu."""
    if not prev:
        return []
    a, b = prev["summary"], cur["summary"]
    rows = []

    def add(label, va, vb, fmt, diff=None):
        rows.append((label, fmt(va) if va is not None else "–", fmt(vb) if vb is not None else "–",
                     diff(va, vb) if (diff and va is not None and vb is not None) else ""))
    d_pp = lambda x, y: pp(y - x)
    d_eur = lambda x, y: (meur(y - x) if abs(y - x) < 1e9 else meur(y - x)) + f" ({pct(y / x - 1, 1)})" if x else meur(y - x)
    add("Alternatyvų dalis, mažiausia", a["alt_min"]["alt_sh"], b["alt_min"]["alt_sh"], pct, d_pp)
    add("Alternatyvų dalis, didžiausia", a["alt_max"]["alt_sh"], b["alt_max"]["alt_sh"], pct, d_pp)
    rows.append(("Didžiausią alternatyvų dalį turintis fondas", a["alt_max"]["name"], b["alt_max"]["name"],
                 "nepasikeitė" if a["alt_max"]["code"] == b["alt_max"]["code"] else "PASIKEITĖ"))
    add("Alternatyvos, EUR (visi analizuojami)", a["all_alt"], b["all_alt"], meur, d_eur)
    add("II pakopos AUM (alternatyvų analizė)", a["ii_aum"], b["ii_aum"], meur, d_eur)
    add("II pakopos svertinė išėjimų riba, %", a["ii_x"], b["ii_x"], pct, d_pp)
    add("II pakopos svertinė išėjimų riba, EUR", a["ii_xe"], b["ii_xe"], meur, d_eur)
    rows.append(("Jautriausias fondas (alternatyvos)", a["sensitive"]["name"], b["sensitive"]["name"],
                 "nepasikeitė" if a["sensitive"]["code"] == b["sensitive"]["code"] else "PASIKEITĖ"))
    code = b["selected"]["code"]
    ra, rb = prev["res"].get(code), cur["res"][code]
    add(f"50 % išėjimų / −10 % rinkos: {rb['name']}", ra and ra["c5010"], rb["c5010"], pct, d_pp)
    if b.get("bal_top"):
        for r in b["bal_top"]:
            ra = prev["res"].get(r["code"])
            add(f"Baltijos obligacijų dalis: {r['name']}", ra and ra["bal_sh"], r["bal_sh"], pct, d_pp)
    if b.get("bal_min"):
        r = b["bal_min"]
        ra = prev["res"].get(r["code"])
        add(f"Baltijos obligacijų išėjimų riba: {r['name']}", ra and ra["bal_x"], r["bal_x"], pct, d_pp)
    if a.get("bal_min") and b.get("bal_min"):
        rows.append(("Arčiausiai obligacijų ribos esantis fondas", a["bal_min"]["name"], b["bal_min"]["name"],
                     "nepasikeitė" if a["bal_min"]["code"] == b["bal_min"]["code"] else "PASIKEITĖ"))
    return rows


def decompose(cur, prev):
    """Alternatyvų dalies pokytis: kiek dėl alternatyvų vertės (EUR) pokyčio, kiek dėl AUM pokyčio."""
    out = []
    if not prev:
        return out
    for code, r in cur["res"].items():
        p = prev["res"].get(code)
        if not r["in_alt"] or not p or not p["aum"]:
            continue
        by_aum = p["alt"] / r["aum"] - p["alt_sh"]
        by_alt = (r["alt"] - p["alt"]) / r["aum"]
        out.append(dict(name=r["name"], d_sh=r["alt_sh"] - p["alt_sh"], by_alt=by_alt, by_aum=by_aum,
                        d_alt=r["alt"] - p["alt"], d_aum=r["aum"] / p["aum"] - 1))
    return out


def verdict(cur, prev):
    if not prev:
        return "reikšmingai nepasikeitė", "ankstesnio vertinimo duomenų nėra"
    a, b = prev["summary"], cur["summary"]
    dx = b["ii_x"] - a["ii_x"]
    dalt = b["all_alt"] / a["all_alt"] - 1 if a["all_alt"] else 0
    daum = b["ii_aum"] / a["ii_aum"] - 1 if a["ii_aum"] else 0
    why = (f"II pakopos svertinė išėjimų riba pakito {pp(dx, 1)} (alternatyvų vertė {pct(dalt, 1)}, "
           f"II pakopos AUM {pct(daum, 1)})")
    if dx > 0.02:
        return "pagerėjo", why
    if dx < -0.02:
        return "pablogėjo", why
    return "reikšmingai nepasikeitė", why


# ---------- laiškai ----------
def grid_txt(x):
    return "daugiau nei 90 %" if x is None else f"{x * 100:.0f} %"


def letters(cur, prev, ref):
    s, d = cur["summary"], cur["date"]
    sel = s["selected"]
    verd, why = verdict(cur, prev)
    sens = sorted([r for r in cur["res"].values() if r["in_alt"]], key=lambda r: r["alt_x"])[:2]
    sens_txt = " ir ".join(f"{r['name']} (išėjimų riba {pct(r['alt_x'], 1)})" for r in sens)
    p = prev["summary"] if prev else None
    prev_rng = f"{pct(p['alt_min']['alt_sh'])[:-2]}–{pct(p['alt_max']['alt_sh'])} ({prev['date']})" if p else "–"
    bal_top = " ir ".join(f"{r['name']} ({pct(r['bal_sh'])})" for r in s.get("bal_top", []))
    bm = s.get("bal_min")
    if s.get("bal_over"):
        bal_concl = ("nustatyta, kad " + ", ".join(f"{r['name']} ({pct(r['bal_sh'])} prie {pct(r['lim'], 1)} ribos)" for r in s["bal_over"])
                     + " Baltijos obligacijų dalis jau siekia arba viršija taikomą obligacijų dalį")
    elif bm and bm["bal_x"] < 0.30:
        bal_concl = f"nustatytas reikšmingas priartėjimas prie ribos fonde {bm['name']}"
    else:
        bal_concl = "reikšmingų rizikų nenustatyta"
    changes = []
    if prev:
        for r in sorted(decompose(cur, prev), key=lambda r: -abs(r["d_sh"]))[:2]:
            src = "alternatyvų vertės pokyčio" if abs(r["by_alt"]) >= abs(r["by_aum"]) else "fondo turto (AUM) pokyčio"
            changes.append(f"{r['name']}: alternatyvų dalis pakito {pp(r['d_sh'])} – daugiausia dėl {src} "
                           f"(alternatyvos {meur(r['d_alt'])}, AUM {pct(r['d_aum'], 1)}). Iš vertės pokyčio negalima "
                           f"spręsti, ar tai nauji įsipareigojimų mokėjimai, ar perkainojimas.")
        changes.append(f"II pakopos svertinė išėjimų riba: {pct(p['ii_x'], 1)} → {pct(s['ii_x'], 1)} "
                       f"({meur(p['ii_xe'])} → {meur(s['ii_xe'])}).")
        if p["sensitive"]["code"] != s["sensitive"]["code"]:
            changes.append(f"Pasikeitė jautriausias fondas: {p['sensitive']['name']} → {s['sensitive']['name']}.")
    if ref and ref is not prev:
        r0 = ref["summary"]
        changes.append(f"Palyginti su {ref['date']} (prieš reformą): alternatyvų dalis buvo "
                       f"{pct(r0['alt_min']['alt_sh'])}–{pct(r0['alt_max']['alt_sh'])}, II pakopos išėjimų riba {pct(r0['ii_x'], 1)}.")
    changes = changes or ["Ankstesnio vertinimo duomenų palyginimui nėra."]
    rng = f"{pct(s['alt_min']['alt_sh'])[:-2]}–{pct(s['alt_max']['alt_sh'])}"
    mx = s["alt_max"]
    caveat = ("Analizėje neįvertinti dar neišmokėti alternatyvių investicijų įsipareigojimai, nes naujausi patikimi "
              "commitment duomenys nebuvo prieinami. Todėl pateiktas vertinimas atspindi tik Lietuvos banko duomenyse "
              "parodytas faktines portfelio pozicijas vertinimo dieną.")
    a = [f"Tema: Pensijų fondų likvidumo vertinimas pagal {d} portfelių duomenis", "", "Sveiki,", "",
         f"Vertinimas atliktas naudojant {d} Lietuvos banko paskelbtus pensijų fondų portfelių duomenis.", "",
         "Pakartotinai įvertinau, kokio masto turto išėjimai ir rinkų korekcija galėtų reikšmingai paveikti fondų struktūrą. "
         "Analizėje daugiausia dėmesio skirta alternatyvioms investicijoms ir Baltijos šalių obligacijoms.", "",
         "Alternatyvios investicijos", "",
         f"• Dabartinis alternatyvių investicijų svoris analizuojamuose fonduose siekia {rng}. Ankstesnio vertinimo metu jis siekė {prev_rng}.",
         f"• Didžiausia alternatyvių investicijų dalis nustatyta fonde {mx['name']}, kuriame ji sudaro {pct(mx['alt_sh'])}, arba {meur(mx['alt'])}.",
         f"• Neįskaitant likusių neišmokėtų įsipareigojimų, II pakopos fondus iki 30 % alternatyvių investicijų ribos galėtų palikti apie {pct(s['ii_x'], 0)} turto, arba {meur(s['ii_xe'], 0)}.",
         f"• Jautriausi likvidumo rizikai yra {sens_txt}.",
         f"• Fondą {sel['name']} analizei pasirinkau, nes {s['sel_reason']}. Jo jautrumo analizė rodo:",
         f"   – esant −10 % rinkų kritimui, 30 % riba pasiekiama maždaug ties {grid_txt(sel['hit10'])} išėjimų;",
         f"   – nesant rinkų pokyčio, riba pasiekiama maždaug ties {grid_txt(sel['hit0'])} išėjimų;",
         f"   – esant 50 % išėjimų ir −10 % rinkų kritimui, alternatyvių investicijų dalis sudarytų {pct(sel['c5010'])}, "
         f"todėl iki 30 % ribos liktų {(ALT_LIMIT - sel['c5010']) * 100:.2f}".replace(".", ",") + " procentinio punkto buferis."
         if sel["c5010"] < ALT_LIMIT else
         f"   – esant 50 % išėjimų ir −10 % rinkų kritimui, alternatyvių investicijų dalis sudarytų {pct(sel['c5010'])}, t. y. 30 % riba būtų viršyta.",
         "   (Matricoje išėjimai ir rinkų kritimas matuojami kaip dalis ne alternatyvaus turto, todėl jie nesutampa su aukščiau nurodyta riba, skaičiuojama nuo viso fondo turto.)",
         "", "Baltijos šalių obligacijos", "",
         f"• Didžiausia Baltijos obligacijų dalis nustatyta fonduose {bal_top}."]
    if bm:
        a.append(f"• Mažiausia apskaičiuota išėjimų riba iki konkrečiam fondui taikomos obligacijų ribos yra {pct(bm['bal_x'])} fonde {bm['name']} (riba {pct(bm['lim'], 1)}).")
    a += [f"• Pagal taikytas konservatyvias prielaidas, {bal_concl}.", "", "Pokyčiai nuo ankstesnio vertinimo", ""]
    a += [f"• {c}" for c in changes]
    a += ["", "Apibendrinimas", "",
          f"Bendrai vertinant, esant stabilioms rinkų sąlygoms, 30 % alternatyvių investicijų riba būtų pasiekta po maždaug {pct(s['ii_x'], 0)} II pakopos fondų turto išėjimo. "
          f"Didžiausia rizika išlieka fonduose {' ir '.join(r['name'] for r in sens)}. "
          f"Baltijos obligacijų atžvilgiu {bal_concl}. Palyginti su ankstesniu vertinimu, situacija {verd}.", "",
          caveat, "", "Pridedu failą su skaičiavimais, lentelėmis ir jautrumo matricomis."]
    b = [f"Tema: Pensijų fondų likvidumo analizė pagal {d} duomenis", "", "Sveiki,", "",
         f"Atnaujinau pensijų fondų likvidumo vertinimą pagal {d} Lietuvos banko portfelių duomenis.", "", "Pagrindinės išvados:", "",
         f"• Alternatyvių investicijų dalis fonduose siekia {rng}.",
         f"• Iki 30 % ribos II pakopos fondus galėtų palikti apie {pct(s['ii_x'], 0)} turto, arba {meur(s['ii_xe'], 0)}.",
         f"• Jautriausi fondai: {sens_txt}.",
         f"• Esant 50 % išėjimų ir −10 % rinkų kritimui, fondo {sel['name']} alternatyvių investicijų dalis sudarytų {pct(sel['c5010'])}, "
         f"o buferis iki 30 % ribos būtų {(ALT_LIMIT - sel['c5010']) * 100:.2f}".replace(".", ",") + " procentinio punkto.",
         f"• Didžiausia Baltijos obligacijų koncentracija nustatyta fonduose {bal_top}.",
         f"• Palyginti su ankstesniu vertinimu, situacija {verd}, nes {why}.", "",
         "Analizėje neįtraukti likę neišmokėti alternatyvių investicijų įsipareigojimai, nes šie duomenys neprieinami.", "",
         "Pridedu skaičiavimus ir jautrumo matricas."]
    return a, b


# ---------- Excel ----------
def write_xlsx(path, cur, prev, ref, la, lb):
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Border, Font, PatternFill, Side

    G, Y, R = (PatternFill("solid", fgColor=c) for c in ("C6EFCE", "FFEB9C", "FFC7CE"))
    H = PatternFill("solid", fgColor="DDEBF7")
    B = Font(bold=True)
    thin = Border(*(Side(style="thin", color="BBBBBB"),) * 4)
    P2, E0 = "0.00%", "#,##0"
    wb = Workbook()
    s = cur["summary"]

    def header(ws, row, cols, widths=None):
        for j, c in enumerate(cols, 1):
            x = ws.cell(row, j, c)
            x.font, x.fill, x.alignment = B, H, Alignment(wrap_text=True, vertical="center")
        if widths:
            for j, w in enumerate(widths, 1):
                ws.column_dimensions[ws.cell(1, j).column_letter].width = w

    def color_alt(v):
        return R if v >= ALT_LIMIT - 1e-12 else Y if v >= 0.25 else G

    def color_bal(v, lim):
        return R if v >= lim - 1e-12 else Y if v >= 0.9 * lim else G

    # Santrauka
    ws = wb.active
    ws.title = "Santrauka"
    ws.column_dimensions["A"].width = 120
    ws["A1"] = f"SEB pensijų fondų likvidumo analizė – {cur['date']} (LB portfelių duomenys)"
    ws["A1"].font = Font(bold=True, size=14)
    for i, t in enumerate(summary_lines(cur, prev), 3):
        ws.cell(i, 1, t).alignment = Alignment(wrap_text=True)

    # Alternatyvos
    ws = wb.create_sheet("Alternatyvos")
    header(ws, 1, ["Fondas", "Pakopa", "AUM, EUR", "Alternatyvos, EUR", "Alternatyvos, %", "Išėjimo riba iki 30 %, %",
                   "Išėjimo riba iki 30 %, EUR", "Dalyvių pokytis per 2 ketv.", "AUM šaltinis"], [32, 8, 16, 16, 12, 14, 16, 14, 20])
    alt = [r for r in cur["res"].values() if r["in_alt"]]
    i = 2
    for r in alt:
        vals = [r["name"], r["pillar"], r["aum"], r["alt"], r["alt_sh"], r["alt_x"], r["alt_xe"], r["part_chg"], r["nav_src"]]
        for j, v in enumerate(vals, 1):
            c = ws.cell(i, j, v)
            c.border = thin
            c.number_format = {3: E0, 4: E0, 7: E0, 5: P2, 6: P2, 8: P2}.get(j, "General")
        ws.cell(i, 5).fill = color_alt(r["alt_sh"])
        i += 1
    ii = [r for r in alt if r["pillar"] == "II"]
    iii = [r for r in alt if r["pillar"] == "III"]
    for label, grp in (("Total II pakopa", ii), ("III pakopa (SEB pensija 18+)", iii), ("Total visi analizuojami fondai", alt)):
        t, a = sum(r["aum"] for r in grp), sum(r["alt"] for r in grp)
        xe = sum(r["alt_xe"] for r in grp)
        for j, v in enumerate([label, "", t, a, a / t if t else None, xe / t if t else None, xe], 1):
            c = ws.cell(i, j, v)
            c.font, c.border = B, thin
            c.number_format = {3: E0, 4: E0, 7: E0, 5: P2, 6: P2}.get(j, "General")
        i += 1
    i += 1
    ws.cell(i, 1, "Bendra riba = Σ išėjimo ribų EUR / Σ AUM (svertinė eurais). Paprastas procentų vidurkis būtų "
                  f"{pct(s['ii_x_avg_wrong'])} – jis netaikomas, nes mažam ir dideliam fondui suteiktų vienodą svorį.")
    i += 2
    header(ws, i, ["Fondas", "Riba prie 0 % (matrica)", "Riba prie −10 % (matrica)", "Tiksli riba prie 0 %*",
                   "Tiksli riba prie −10 %*", "50 % / −10 %: alternatyvų dalis", "Buferis iki 30 %",
                   "50 % / −10 % (seka)**"])
    i += 1
    for r in alt:
        vals = [r["name"], grid_txt(r["hit0"]), grid_txt(r["hit10"]), r["ex0"], r["ex10"], r["c5010"], ALT_LIMIT - r["c5010"], r["c5010_seq"]]
        for j, v in enumerate(vals, 1):
            c = ws.cell(i, j, v)
            c.border = thin
            if j >= 4:
                c.number_format = P2
        ws.cell(i, 6).fill = color_alt(r["c5010"])
        i += 1
    ws.cell(i + 1, 1, "* išėjimai kaip ne alternatyvaus turto dalis (kaip matricos stulpeliuose); ** kritimas taikomas po išėjimų (T−A)(1−x)(1−m) – žr. Metodika.")

    # Alternatyvų matricos
    ws = wb.create_sheet("Alt matricos")
    sel = s["selected"]
    order = [sel] + [r for r in alt if r["code"] != sel["code"]]
    row = 1
    ws.column_dimensions["A"].width = 22
    for k, r in enumerate(order):
        title = f"{r['name']}: alternatyvų dalis, kai A = {eur(r['alt'])}, AUM = {eur(r['aum'])}"
        if k == 0:
            title = "PAGRINDINĖ MATRICA – " + title + f". Pasirinkta, nes {s['sel_reason']}."
        row = matrix(ws, row, title, r["alt"], r["aum"], lambda v: color_alt(v), B, H, thin, P2)
    row = matrix(ws, row, f"Palyginimui (ne pagrindinė): {sel['name']}, rinkų kritimas taikomas po išėjimų (T−A)(1−x)(1−m)",
                 sel["alt"], sel["aum"], lambda v: color_alt(v), B, H, thin, P2, mode="seq")

    # Baltijos obligacijos
    ws = wb.create_sheet("Baltijos obligacijos")
    header(ws, 1, ["Fondas", "Pakopa", "AUM, EUR", "Baltijos obligacijos, EUR", "Baltijos obligacijos, %",
                   "Fondo obligacijų riba, %", "Išėjimų riba, %", "Išėjimų riba, EUR", "Visos obligacijos, EUR",
                   "Prie 0 % (matrica)", "Prie −10 % (matrica)", "50 % / −10 %"], [32, 8, 16, 16, 12, 12, 12, 16, 16, 12, 12, 12])
    i = 2
    for r in cur["res"].values():
        if not r["in_bal"]:
            continue
        vals = [r["name"], r["pillar"], r["aum"], r["bal"], r["bal_sh"], r["lim"], r["bal_x"], r["bal_xe"], r["bonds"],
                grid_txt(r.get("bhit0")) if r["lim"] else "–", grid_txt(r.get("bhit10")) if r["lim"] else "–", r.get("b5010")]
        for j, v in enumerate(vals, 1):
            c = ws.cell(i, j, v)
            c.border = thin
            c.number_format = {3: E0, 4: E0, 8: E0, 9: E0, 5: P2, 6: "0.0%", 7: P2, 12: P2}.get(j, "General")
        if r["lim"]:
            ws.cell(i, 5).fill = color_bal(r["bal_sh"], r["lim"])
        i += 1
    i += 1
    ws.cell(i, 1, "Įtraukta: LB lapo „Skolos VP“ pozicijos, kurių emitento šalis LT, LV arba EE. Neįtraukta: akcijos, fondai, "
                  "pinigai, ne Baltijos obligacijos. Spalva – pagal fondo ribą: žalia < 90 % ribos, geltona 90–100 %, raudona ≥ ribos.")
    i += 1
    ws.cell(i, 1, "Ribų šaltinis ir peržiūros data – data/liq_funds.csv. Pasikeitus fondo taisyklėms ribas būtina atnaujinti.")

    ws = wb.create_sheet("Balt matricos")
    ws.column_dimensions["A"].width = 22
    row = 1
    bsel = s.get("bal_sel")
    bl = [r for r in cur["res"].values() if r["in_bal"] and r["lim"] and r["bal"] > 0]
    if bsel:
        bl = [bsel] + [r for r in bl if r["code"] != bsel["code"]]
    for k, r in enumerate(bl):
        title = f"{r['name']}: Baltijos obligacijų dalis (riba {pct(r['lim'], 1)}), B = {eur(r['bal'])}, AUM = {eur(r['aum'])}"
        if k == 0 and bsel:
            title = "PAGRINDINĖ – arčiausiai ribos (mažiausia teigiama išėjimų riba). " + title
        lim = r["lim"]
        row = matrix(ws, row, title, r["bal"], r["aum"], lambda v, lim=lim: color_bal(v, lim), B, H, thin, P2)

    # Pokyčiai
    ws = wb.create_sheet("Pokyčiai")
    header(ws, 1, ["Rodiklis", f"Ankstesnis ({prev['date'] if prev else '–'})", f"Naujas ({cur['date']})", "Pokytis"], [55, 34, 34, 28])
    i = 2
    for t in compare(cur, prev):
        for j, v in enumerate(t, 1):
            ws.cell(i, j, v).border = thin
        i += 1
    if ref and ref is not prev:
        i += 1
        ws.cell(i, 1, f"Atskaitos laikotarpis {ref['date']} (prieš reformą) → {cur['date']}").font = B
        i += 1
        for t in compare(cur, ref):
            for j, v in enumerate(t, 1):
                ws.cell(i, j, v).border = thin
            i += 1
    i += 1
    ws.cell(i, 1, "Alternatyvų dalies pokyčio išskaidymas (ankstesnis → naujas)").font = B
    i += 1
    header(ws, i, ["Fondas", "Dalies pokytis", "Dėl alternatyvų vertės (EUR) pokyčio", "Dėl AUM pokyčio", "Alternatyvos, EUR pokytis", "AUM pokytis"])
    i += 1
    for r in decompose(cur, prev):
        for j, v in enumerate([r["name"], r["d_sh"], r["by_alt"], r["by_aum"], r["d_alt"], r["d_aum"]], 1):
            c = ws.cell(i, j, v)
            c.border = thin
            c.number_format = E0 if j == 5 else P2 if j > 1 else "General"
        i += 1
    ws.cell(i + 1, 1, "Didesnis procentinis svoris dar nereiškia papildomų investicijų: jis gali kilti vien dėl mažėjančio AUM. "
                      "Alternatyvų vertės pokytis EUR gali būti tiek nauji įmokėjimai (drawdown), tiek perkainojimas ar išmokos.")

    # Pozicijos
    ws = wb.create_sheet("Pozicijos")
    header(ws, 1, ["Fondas", "Rūšis", "Pozicija", "Vertė, EUR", "Dalis fonde"], [32, 22, 60, 16, 12])
    i = 2
    for r in cur["res"].values():
        for kind, pos in (("Alternatyva", r["altpos"] if r["in_alt"] else {}), ("Baltijos obligacija", r["balpos"] if r["in_bal"] else {})):
            for n, v in sorted(pos.items(), key=lambda x: -x[1]):
                for j, x in enumerate([r["name"], kind, n, v, v / r["aum"]], 1):
                    c = ws.cell(i, j, x)
                    c.number_format = E0 if j == 4 else P2 if j == 5 else "General"
                i += 1

    # Išimtys
    ws = wb.create_sheet("Išimtys")
    header(ws, 1, ["Tipas", "Fondas", "Pavadinimas", "Vertė, EUR", "Pastaba"], [30, 18, 50, 16, 70])
    i = 2
    for t in cur["exc"] or [("Išimčių nenustatyta", "", "", None, "")]:
        for j, v in enumerate(t, 1):
            c = ws.cell(i, j, v)
            if j == 4:
                c.number_format = E0
        i += 1

    ws = wb.create_sheet("Metodika")
    ws.column_dimensions["A"].width = 140
    for i, t in enumerate(METHOD, 1):
        c = ws.cell(i, 1, t)
        c.alignment = Alignment(wrap_text=True)
        if t and not t.startswith(("•", " ", "–")) and len(t) < 70:
            c.font = B
    for name, txt in (("Laiškas A", la), ("Laiškas B", lb)):
        ws = wb.create_sheet(name)
        ws.column_dimensions["A"].width = 140
        for i, t in enumerate(txt, 1):
            ws.cell(i, 1, t).alignment = Alignment(wrap_text=True)
    wb.save(path)


def matrix(ws, row, title, a, t, color, B, H, thin, P2, mode="excel"):
    ws.cell(row, 1, title).font = B
    row += 1
    ws.cell(row, 1, "Rinkų kritimas ↓ / Išėjimai →").font = B
    for j, x in enumerate(EXITS, 2):
        c = ws.cell(row, j, x)
        c.number_format, c.font, c.fill = "0%", B, H
    for m in MARKET:
        row += 1
        c = ws.cell(row, 1, -m)
        c.number_format, c.font, c.fill = "0%", B, H
        for j, x in enumerate(EXITS, 2):
            v = share(a, t, x, m, mode)
            c = ws.cell(row, j, v)
            c.number_format, c.fill, c.border = P2, color(v), thin
    return row + 3


METHOD = [
    "Metodika",
    "",
    "Tikslas – ne prognozuoti dalyvių elgesį, o parodyti, kiek fondas gali sumažėti, kol nelikvidžių arba strategiškai ribojamų investicijų dalis pasiekia ribą.",
    "",
    "Duomenys",
    "• LB ketvirčio portfelių failas (lapai „Nuosavybės VP“, „Skolos VP“, „Pinigai, indėliai“, „KIS“, „Išvestinės FP“) → data/portfolios.csv (vertės eurais).",
    "• AUM = LB grynieji aktyvai tą pačią dieną (LB rezultatų failas); jei jų nėra – pozicijų suma (pažymima išimtyse). Pozicijų suma tikrinama ±2 %.",
    "• Duomenys yra ketvirtiniai (kovo 31, birželio 30, rugsėjo 30, gruodžio 31). Tarpinės datos (pvz. 2026-07-30) iš LB duomenų neatkuriamos.",
    "",
    "Alternatyvios investicijos",
    "• Tik kontroliuojamas sąrašas data/liq_alternatives.csv (pavadinimas, pavadinimo variantai, šaltinis, peržiūros data).",
    "• Nauji LB KIS tipo 5/6/7 fondai arba pavadinimai su „Private Equity“, „Venture Capital“, „Infrastructure Fund“, „Real Estate Fund“, „Opportunity Fund“, „Partners Fund“ ir pan. – lape „Išimtys“ kaip „Galimai alternatyvi investicija“; į skaičiavimą neįtraukiami, kol žmogus nepatvirtina.",
    "• ALT% = ALT / AUM. Išėjimo riba % = 1 − ALT / (30 % × AUM) = 1 − ALT% / 30 %; EUR = AUM − ALT / 30 %. Jei ALT% ≥ 30 % – riba 0 %.",
    "• Bendra II pakopos riba = Σ išėjimo ribų EUR / Σ AUM (svertinė eurais), ne fondų procentų vidurkis.",
    "",
    "Jautrumo matrica (kaip 2026-07-30 Excel faile)",
    "• Langelis = A / (A + (T − A) × (1 − x − m)); A – alternatyvos, T – AUM, x – išėjimai (stulpeliai 0–90 %), m – rinkų kritimas (eilutės 0–95 %). Jei (1 − x − m) ≤ 0 – 100 %; jei A = 0 – 0 %.",
    "• SVARBU: šis Excel failo variantas x ir m SUMUOJA. Instrukcijoje užrašyta sandauga (1 − x)(1 − m) duoda 20,79 %, o ne kontrolinius 22,79 % (1996–2002, 50 %/−10 %); 22,79 % ir 31,56 % (su įsipareigojimais) atkuriami tik sumos formule. Todėl pagrindinė matrica – sumos formulė, o palyginimui pateikta ir sandaugos matrica.",
    "• Kaip suprasti sumos formulę: ir išėjimai, ir rinkų nuostolis matuojami kaip PRADINIO ne alternatyvaus turto dalis (eurais). Sandaugos formulėje rinkos kritimas taikomas jau sumažėjusiam turtui – rezultatas švelnesnis.",
    "• Matricos x yra ne alternatyvaus turto dalis, o lentelės „Išėjimo riba“ – viso AUM dalis. Pvz. 1996–2002 (2026-07-30): 64,80 % AUM = 72,45 % ne alternatyvaus turto, todėl matricoje riba be rinkų kritimo – ties 80 % stulpeliu.",
    "• Prielaidos (konservatyvios): alternatyvų vertė nekinta; išėjimai finansuojami iš likvidaus turto; rinkų kritimas veikia tik likvidų turtą; alternatyvos neparduodamos. Jei alternatyvos kristų tiek pat, jų dalis nekiltų.",
    "• Spalvos (fiksuotos): žalia < 25 %, geltona 25–30 %, raudona ≥ 30 %.",
    "• Matricos fondas: jei turimi LB dalyvių skaičiai – II pakopos fondas, kuriame per 2 paskutinius ketvirčius labiausiai sumažėjo dalyvių (faktinių išėjimų pakaitalas; mažėjimą lemia ir išėjimai į pensiją); kitaip – mažiausia išėjimo riba. Kitų fondų matricos – žemiau tame pačiame lape.",
    "",
    "Baltijos šalių obligacijos",
    "• Įtraukiamos LB „Skolos VP“ pozicijos, kurių emitento šalis LT, LV, EE (vyriausybės, savivaldybės, bendrovės, bankai). Neįtraukiamos akcijos, fondai, pinigai, ne Baltijos obligacijos.",
    "• Riba R – „Obligacijų dalis taisyklėse“ (data/liq_funds.csv su šaltiniu ir peržiūros data). Išėjimo riba % = 1 − B / (R × AUM); EUR = AUM − B / R; jei B ≥ R × AUM – 0 %.",
    "• Matrica ta pati (B vietoje A), spalvos pagal fondo ribą: žalia < 90 % R, geltona 90–100 % R, raudona ≥ R.",
    "",
    "Palyginimas",
    "• Lyginama su ankstesniu ketvirčiu ir su atskaitos laikotarpiu (2025-12-31, prieš reformą). Alternatyvų dalies pokytis išskaidomas į dalį dėl alternatyvų vertės EUR pokyčio ((A1 − A0)/T1) ir dėl AUM pokyčio (A0/T1 − A0/T0).",
    "",
    "„Įskaitant likusius įsipareigojimus“ – NESKAIČIUOJAMA",
    "• Patikimų duomenų apie likusius neišmokėtus įsipareigojimus (undrawn commitment) nėra, todėl jie nesugalvojami, neperkeliami iš ankstesnių laikotarpių ir laiške nepateikiami.",
    "• Jei duomenys būtų: kiekvienam alternatyviam fondui ir pensijų fondui – commitment, visi drawdown, commitment pokyčiai, grąžintos sumos, perleidimai.",
    "   Undrawn = Commitment − Σ Drawdown (+ grąžintos commitment sumos ± perleidimai ar korekcijos).",
    "   ALT su commitment = ALT + Σ Undrawn; dalis = (ALT + Σ Undrawn) / AUM; išėjimo riba = 1 − (ALT + Σ Undrawn) / (30 % × AUM).",
    "   Matrica: (ALT + U) / (ALT + U + (AUM − ALT − U) × (1 − x − m)).",
    "   2026-07-30 pavyzdys (1996–2002): 4,18 mln. EUR (10,56 %) → su įsipareigojimais 6,17 mln. EUR (15,58 %); išėjimo riba 64,80 % → 48,08 %; 50 %/−10 %: 22,79 % → 31,56 %.",
    "• Pastaba dėl 2026-07-30 laiško: 22,79 % yra BE įsipareigojimų (ne „įskaitant būsimus įsipareigojimus“); „~60 % išėjimų“ su įsipareigojimais neatitinka matricos (~50 %). Ribos visada imamos iš apskaičiuotos matricos.",
    "",
    "Šaltinis: liquidity.py (pensijų fondų dashboard repo). Laiškas nesiunčiamas automatiškai.",
]


def summary_lines(cur, prev):
    s = cur["summary"]
    sel = s["selected"]
    verd, why = verdict(cur, prev)
    out = [
        f"• Duomenų data: {cur['date']} (LB ketvirčio portfeliai); ankstesnis vertinimas: {prev['date'] if prev else '–'}.",
        f"• Alternatyvų dalis: {pct(s['alt_min']['alt_sh'])} ({s['alt_min']['name']}) – {pct(s['alt_max']['alt_sh'])} ({s['alt_max']['name']}, {meur(s['alt_max']['alt'])}).",
        f"• II pakopos svertinė išėjimų riba iki 30 %: {pct(s['ii_x'])} arba {meur(s['ii_xe'])} (AUM {meur(s['ii_aum'])}).",
        f"• Jautriausias fondas: {s['sensitive']['name']} (išėjimo riba {pct(s['sensitive']['alt_x'])}).",
        f"• Matricos fondas: {sel['name']} – {s['sel_reason']}.",
        f"• {sel['name']}: riba pasiekiama ties {grid_txt(sel['hit0'])} išėjimų be rinkų kritimo ir ties {grid_txt(sel['hit10'])} prie −10 % "
        f"(tiksliai {pct(sel['ex0'], 1)} ir {pct(sel['ex10'], 1)} ne alternatyvaus turto).",
        f"• 50 % išėjimų / −10 % rinkos: {pct(sel['c5010'])}, buferis {pp(ALT_LIMIT - sel['c5010'])} iki 30 %.",
    ]
    if s.get("bal_top"):
        out.append("• Didžiausia Baltijos obligacijų dalis: " + "; ".join(f"{r['name']} {pct(r['bal_sh'])} (riba {pct(r['lim'], 1)})" for r in s["bal_top"]) + ".")
    if s.get("bal_min"):
        out.append(f"• Arčiausiai obligacijų ribos: {s['bal_min']['name']} – išėjimų riba {pct(s['bal_min']['bal_x'])} ({meur(s['bal_min']['bal_xe'])}).")
    if s.get("bal_over"):
        out.append("• Baltijos obligacijos jau ≥ fondo obligacijų ribos: " + ", ".join(f"{r['name']} ({pct(r['bal_sh'])} / {pct(r['lim'], 1)})" for r in s["bal_over"]) + " – išėjimų riba 0 %.")
    out.append(f"• Palyginti su ankstesniu: situacija {verd} – {why}.")
    n_rev = sum(1 for e in cur["exc"] if e[0].startswith("Galimai"))
    out.append(f"• Išimtys: {len(cur['exc'])} (iš jų galimai alternatyvių naujų pozicijų – {n_rev}); žr. lapą „Išimtys“.")
    out.append("• Apribojimai: ketvirtiniai LB duomenys; neįtraukti likę neišmokėti įsipareigojimai; matrica – konservatyvus testas, ne prognozė.")
    return out


# ---------- paleidimas ----------
def run(date=None, out_dir=None):
    funds, alts, amap = load_cfg()
    dates = seb_dates()
    date = date or dates[-1]
    if date not in dates:
        raise SystemExit(f"Nėra SEB portfelių duomenų {date}. Yra: {', '.join(dates[-8:])}")
    i = dates.index(date)
    prev_d = dates[i - 1] if i else None
    ref_d = REFERENCE_DATE if REFERENCE_DATE in dates and REFERENCE_DATE < (prev_d or date) else None
    rows = seb_rows({x for x in (date, prev_d, ref_d) if x})
    nav, part = lb_results()
    cur = analyse(date, rows[date], funds, amap, nav, part, dates)
    prev = analyse(prev_d, rows[prev_d], funds, amap, nav, part, dates) if prev_d else None
    ref = analyse(ref_d, rows[ref_d], funds, amap, nav, part, dates) if ref_d else None
    la, lb = letters(cur, prev, ref)
    out = Path(out_dir or ROOT / "likvidumas") / date
    out.mkdir(parents=True, exist_ok=True)
    files = []
    x = out / f"SEB_likvidumo_analize_{date}.xlsx"
    write_xlsx(x, cur, prev, ref, la, lb)
    files.append(x)
    for tag, txt in (("A_issamus", la), ("B_trumpas", lb)):
        p = out / f"laiskas_{tag}_{date}.txt"
        p.write_text("\n".join(txt) + "\n", encoding="utf-8")
        files.append(p)
    try:
        import docx
        doc = docx.Document()
        for tag, txt in (("Variantas A – išsamesnis", la), ("Variantas B – trumpesnis vadovybinis", lb)):
            doc.add_heading(tag, level=1)
            for t in txt:
                doc.add_paragraph(t)
            doc.add_page_break()
        p = out / f"laiskas_{date}.docx"
        doc.save(p)
        files.append(p)
    except ImportError:
        pass
    return cur, prev, files


def latest_date():
    d = seb_dates()
    return d[-1] if d else None


def selftest():
    """Kontroliniai pavyzdžiai iš 2026-07-30 Excel / laiško."""
    t, a = 39_587_991.83, 4_180_687.97
    ok = True

    def chk(name, got, want, tol=0.00006):
        nonlocal ok
        good = abs(got - want) <= tol
        ok &= good
        print(f"{'OK ' if good else 'BLOGAI'} {name}: {got * 100:.2f} % (laukta {want * 100:.2f} %)")
    chk("1996–2002 alternatyvų dalis", a / t, 0.1056)
    chk("1996–2002 išėjimo riba", exit_limit(a, t, 0.30)[0], 0.6480)
    print(f"    išėjimo riba EUR: {meur(exit_limit(a, t, 0.30)[1])} (laukta ~25,65 mln.)")
    chk("1996–2002 50 %/−10 %", share(a, t, 0.5, 0.1), 0.2279)
    print(f"    matricos riba: 0 % → {grid_txt(grid_hit(a, t, .3, 0))} (laukta 80 %), −10 % → {grid_txt(grid_hit(a, t, .3, .1))} (laukta 70 %)")
    ok &= grid_hit(a, t, .3, 0) == 0.8 and grid_hit(a, t, .3, .1) == 0.7
    u = 0.1558 * t - a      # su įsipareigojimais 15,58 % – tik metodikos patikrai
    chk("su įsipareigojimais 50 %/−10 % (tik metodikos patikra)", share(a + u, t, 0.5, 0.1), 0.3156, 0.0003)
    chk("su įsipareigojimais išėjimo riba (tik metodikos patikra)", exit_limit(a + u, t, 0.30)[0], 0.4808, 0.0003)
    chk("1961–1967 Baltijos obligacijų išėjimų riba", 1 - 0.2206 / 0.734, 0.6995)
    print(f"    sandaugos formulė 50 %/−10 % būtų {share(a, t, .5, .1, 'seq') * 100:.2f} % – kontrolės NEatitinka")
    return ok


def main():
    args = sys.argv[1:]
    if args and args[0] == "selftest":
        sys.exit(0 if selftest() else 1)
    if args and args[0] == "status":
        try:
            sent = json.loads(STATE.read_text(encoding="utf-8")).get("liq", "")
        except (OSError, ValueError):
            sent = ""
        print(f"Naujausi SEB portfeliai: {latest_date()}; vakariniame laiške išsiųsta: {sent or '–'}")
        return
    date = args[args.index("--date") + 1] if "--date" in args else None
    out = args[args.index("--out") + 1] if "--out" in args else None
    cur, prev, files = run(date, out)
    print("\n".join(summary_lines(cur, prev)))
    print("\nFailai:\n" + "\n".join(str(f) for f in files))


if __name__ == "__main__":
    main()
