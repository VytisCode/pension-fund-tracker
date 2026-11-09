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
  python liquidity.py --mgr Swedbank         – kitas valdytojas (Allianz, Artea, Goindex, Luminor, SEB, Swedbank)
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
def share(a: float, t: float, x: float, m: float, mode: str = "fix") -> float:
    """Nelikvidžios dalies (a) svoris po x išėjimų ir m rinkų kritimo.
    fix (pataisyta, pagrindinė; savininkas 2026-11-09 „ištaisyk formules“): x – viso fondo turto (AUM) dalis, kaip lentelėje;
         išėjimai mokami iš likvaus turto, tada rinkos kritimas m taikomas likusiam likviam turtui: (t − a − x·t)(1 − m).
         Prie m = 0 riba sutampa su lentelės „Išėjimo riba“.
    excel: (t−a)(1−x−m) – kaip 2026-07-30 Excel faile (x ir m – PRADINIO likvaus turto dalys, sumuojamos)."""
    if a <= 0:
        return 0.0
    rest = (t - a) * (1 - x - m) if mode == "excel" else (t - a - x * t) * (1 - m)
    return 1.0 if rest <= 0 else min(1.0, a / (a + rest))


def exit_limit(a: float, t: float, lim: float):
    """Kiek % viso AUM gali išeiti, kol a/AUM pasiekia lim (a nekinta). Grąžina (%, EUR)."""
    if not t or t <= 0 or not lim:
        return None, None
    v = max(0.0, min(1.0, 1 - a / (lim * t)))
    return v, max(0.0, t - a / lim)


def grid_hit(a, t, lim, m, mode="fix"):
    """Mažiausias matricos išėjimų lygis (0–90 %), kai dalis ≥ ribos; None – nepasiekiama iki 90 %."""
    for x in EXITS:
        if share(a, t, x, m, mode) >= lim - 1e-12:
            return x
    return None


def exact_hit(a, t, lim, m):
    """Tiksli išėjimų dalis (viso AUM), kai pasiekiama riba, pataisytai formulei."""
    if a <= 0 or t <= a:
        return None if a <= 0 else 0.0
    return max(0.0, min(1.0, (t - a - a * (1 - lim) / (lim * (1 - m))) / t))


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


START = "2024-09-30"                            # nuo kada rodoma (svetainė, istorija)
_PF = {}


def _load_pf():
    """Visų valdytojų LB portfeliai nuo START (ir visų datų sąrašas) – vienas failo nuskaitymas."""
    if not _PF:
        dates, rows = defaultdict(set), defaultdict(lambda: defaultdict(list))
        with PF.open(encoding="utf-8") as f:
            for r in csv.DictReader(f):
                dates[r["provider"]].add(r["date"])
                if r["date"] >= "2024-01-01":
                    rows[r["provider"]][r["date"]].append(r)
        _PF.update(dates={k: sorted(v) for k, v in dates.items()}, rows=rows)
    return _PF


def providers():
    return sorted(_load_pf()["dates"])


def prov_dates(prov="SEB"):
    return _load_pf()["dates"].get(prov, [])


def prov_rows(prov="SEB"):
    return _load_pf()["rows"].get(prov, {})


def lb_results():
    nav, part, risky = {}, {}, {}
    if LBR.exists():
        with LBR.open(encoding="utf-8") as f:
            for r in csv.DictReader(f):
                if r["kind"] == "fund" and r["code"]:
                    k = (r["date"], r["code"])
                    if num(r["nav_meur"]):
                        nav[k] = num(r["nav_meur"]) * 1e6
                    if num(r["participants"]):
                        part[k] = num(r["participants"])
                    if r["risky"]:
                        risky[k] = (r["pillar"], r["risky"])
    return nav, part, risky


def lb_bond_limit(pillar, risky):
    """Strateginė ne rizikingų (obligacijų ir pan.) dalis = 100 − LB „rizikingų investicijų dalis“.
    II pakopai sutampa su SEB „Obligacijų dalis taisyklėse“ (pvz. 1961–1967: 100 − 26,6 = 73,4 %). III: „iki X“ → 100 − X,
    „a-b“ → 100 − vidurys; 0 % ar mažiau – ribos nėra."""
    if not risky:
        return None
    v = str(risky).replace(",", ".").strip()
    m = re.match(r"^(?:iki\s*)?([\d.]+)(?:\s*-\s*([\d.]+))?$", v)
    if not m:
        return None
    x = float(m.group(1)) if not m.group(2) else (float(m.group(1)) + float(m.group(2))) / 2
    lim = 100 - x
    return lim if lim > 0.5 else None


def short_name(prov, name, code):
    y = re.search(r"(\d{4})\s*[–-]\s*(\d{4})", name)
    if y:
        return f"{prov} {y.group(1)}–{y.group(2)}"
    if "TIPF" in code or "išsaugojimo" in name.lower():
        return f"{prov} turto išsaugojimo"
    return name if prov.lower() in name.lower() else f"{prov} {name}"


def universe(prov, funds_cfg, amap):
    """Analizuojami valdytojo fondai: SEB – iš data/liq_funds.csv; kiti – visi LB portfelių fondai nuo START.
    Alternatyvų analizei – fondai, kurie bent vieną ketvirtį turėjo alternatyvų; Baltijos – visi."""
    if prov == "SEB":
        return [f for f in funds_cfg]
    rows = prov_rows(prov)
    names, has_alt, pillar = {}, set(), {}
    for d, rs in rows.items():
        if d < START:
            continue
        for r in rs:
            names[r["fund_code"]] = r["fund_name"]
            pillar[r["fund_code"]] = r["pillar"]
            if r["type"] == "fund" and amap.get(r["pos_id"] if r["pos_id"] in amap else norm(r["name"])):
                has_alt.add(r["fund_code"])
    order = lambda c: (pillar[c], "0" if "TIPF" in c else c)
    return [dict(code=c, name=short_name(prov, names[c], c), pillar=pillar[c], alt="1" if c in has_alt else "0", baltic="1",
                 bond_limit_pct="", limit_source="LB rizikingų investicijų dalis (100 − X %)", reviewed="", note="")
            for c in sorted(names, key=order)]


# ---------- vieno laikotarpio analizė ----------
def analyse(date, rows, funds, amap, nav, part, all_dates, risky=None):
    cfg = {f["code"]: f for f in funds}
    risky = risky or {}
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
            if f.get("reviewed") and (f["alt"] == "1" or f["baltic"] == "1"):   # tik konfigūruotiems (SEB) fondams
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
        rk = risky.get((date, code))
        lb_lim = lb_bond_limit(*rk) if rk else None
        if lim is not None and lb_lim is not None and abs(lim - lb_lim) > 0.5:
            exc.append(("Riba skiriasi nuo LB", code, f["name"], None,
                        f"konfigūracijoje {lim:.1f} %, pagal LB rizikingų dalį {lb_lim:.1f} % – patikrinti fondo taisykles"))
        if lim is None:
            lim = lb_lim
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
        r["c5010_xl"] = share(d["alt"], t, *CENTRAL, mode="excel")
        r["hit0_xl"], r["hit10_xl"] = grid_hit(d["alt"], t, ALT_LIMIT, 0, "excel"), grid_hit(d["alt"], t, ALT_LIMIT, 0.10, "excel")
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
    for pl in ("II", "III"):
        g = [r for r in bal if r["pillar"] == pl]
        t = sum(r["aum"] for r in g)
        s[f"bal_{pl}"] = dict(aum=t, bal=sum(r["bal"] for r in g), xe=sum(r["bal_xe"] for r in g)) if t else None
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
    if not prev or not prev["summary"].get("alt_min") or not cur["summary"].get("alt_min"):
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
    if not prev or not prev["summary"].get("ii_x") or not cur["summary"].get("ii_x"):
        return "reikšmingai nepasikeitė", "ankstesnio vertinimo (II pakopos) duomenų palyginimui nėra"
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


def letters(cur, prev, ref, prov="SEB"):
    s, d = cur["summary"], cur["date"]
    # Kur įklijuoti dashboard vaizdus (savininkas 2026-11-09). Virš kiekvienos lentelės ir grafiko dešinėje – mygtukas ⧉
    # („Kopijuoti kaip paveikslėlį“ / „Kopijuoti vaizdą“) – nukopijuoja PNG su pavadinimu ir data; laiške – Ctrl+V.
    nav = f"Portfeliai → Alternatyvios (Valdytojas {prov}, Ketvirtis {d})"

    def pic(n, what, how):
        return f"[ĮKLIJUOTI {n} PAV.: {nav} → {what}. {how}]"
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
    caveat = ("30 % riba skaičiuojama nuo faktinio fondų turto, todėl vertinimas remiasi Lietuvos banko duomenyse parodytomis "
              "faktinėmis portfelio pozicijomis vertinimo dieną. Dar neišmokėti alternatyvių investicijų įsipareigojimai į ribą "
              "neįskaičiuojami ir šiame vertinime nenagrinėti (juos galima vertinti tik kaip papildomą teorinį scenarijų).")
    a = [f"Tema: Pensijų fondų likvidumo vertinimas pagal {d} portfelių duomenis", "", "Sveiki,", "",
         f"Vertinimas atliktas naudojant {d} Lietuvos banko paskelbtus pensijų fondų portfelių duomenis.", "",
         "Pakartotinai įvertinau, kokio masto turto išėjimai ir rinkų korekcija galėtų reikšmingai paveikti fondų struktūrą. "
         "Analizėje daugiausia dėmesio skirta alternatyvioms investicijoms ir Baltijos šalių obligacijoms.", "",
         "Alternatyvios investicijos", "",
         f"• Dabartinis alternatyvių investicijų svoris analizuojamuose fonduose siekia {rng}. Ankstesnio vertinimo metu jis siekė {prev_rng}.",
         f"• Didžiausia alternatyvių investicijų dalis nustatyta fonde {mx['name']}, kuriame ji sudaro {pct(mx['alt_sh'])}, arba {meur(mx['alt'])}.",
         f"• Neįskaitant likusių neišmokėtų įsipareigojimų, II pakopos fondus iki 30 % alternatyvių investicijų ribos galėtų palikti apie {pct(s['ii_x'], 0)} turto, arba {meur(s['ii_xe'], 0)}.",
         f"• Jautriausi likvidumo rizikai yra {sens_txt}.",
         "", pic(1, "„Kaip artėjame prie ribų“, Rodiklis „Išėjimo riba iki 30 %“, Spalvos „Kontrastas“",
                 "Du paveikslėliai: grafikas (mygtukas ⧉ virš grafiko) ir lentelė (mygtukas ⧉ virš lentelės). Parodo, kaip kiekvieno fondo riba mažėjo per ketvirčius."),
         "", pic(2, "„Alternatyvios investicijos ir 30 % riba“ – pirmoji lentelė", "Mygtukas ⧉ virš lentelės (fondai, AUM, alternatyvos, išėjimo riba)."),
         "",
         f"• Fondą {sel['name']} analizei pasirinkau, nes {s['sel_reason']}. Jo jautrumo analizė rodo:",
         f"   – esant −10 % rinkų kritimui, 30 % riba pasiekiama maždaug ties {grid_txt(sel['hit10'])} išėjimų;",
         f"   – nesant rinkų pokyčio, riba pasiekiama maždaug ties {grid_txt(sel['hit0'])} išėjimų;",
         f"   – esant 50 % išėjimų ir −10 % rinkų kritimui, alternatyvių investicijų dalis sudarytų {pct(sel['c5010'])}, "
         f"todėl iki 30 % ribos liktų {(ALT_LIMIT - sel['c5010']) * 100:.2f}".replace(".", ",") + " procentinio punkto buferis."
         if sel["c5010"] < ALT_LIMIT else
         f"   – esant 50 % išėjimų ir −10 % rinkų kritimui, alternatyvių investicijų dalis sudarytų {pct(sel['c5010'])}, t. y. 30 % riba būtų viršyta.",
         f"   (Skaičiuota pataisyta formule: išėjimai – viso fondo turto dalis, rinkų kritimas taikomas po išėjimų likusiam likviam turtui. "
         f"Pagal ankstesnio Excel failo formulę 50 % / −10 % scenarijus būtų {pct(sel['c5010_xl'])}.)",
         "", pic(3, f"„Matrica fondui“ – pasirinkite {sel['name']}, Matricos formulė „Pataisyta“", "Spalvota matrica – mygtukas ⧉ virš matricos."),
         "", "Baltijos šalių obligacijos", "",
         f"• Didžiausia Baltijos obligacijų dalis nustatyta fonduose {bal_top}."]
    if bm:
        a.append(f"• Mažiausia apskaičiuota išėjimų riba iki konkrečiam fondui taikomos obligacijų ribos yra {pct(bm['bal_x'])} fonde {bm['name']} (riba {pct(bm['lim'], 1)}).")
    a += [f"• Pagal taikytas konservatyvias prielaidas, {bal_concl}.", "",
          pic(4, "„Baltijos šalių obligacijos ir fondo obligacijų riba“ – lentelė", "Mygtukas ⧉ virš lentelės. Jei reikia – ir žemiau esanti matrica fondui arčiausiai ribos."),
          "", "Pokyčiai nuo ankstesnio vertinimo", ""]
    a += [f"• {c}" for c in changes]
    if prev:
        a += ["", pic(5, "„Pokyčiai“ – lentelė „Alternatyvų dalies pokytis … kiek dėl alternatyvų vertės, kiek dėl fondo turto pokyčio“",
                      "Mygtukas ⧉ virš lentelės. Parodo, ar dalis auga dėl naujų investicijų, ar dėl mažėjančio fondo turto.")]
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
         "", pic(1, "„Kaip artėjame prie ribų“, Rodiklis „Išėjimo riba iki 30 %“, Spalvos „Kontrastas“", "Tik grafikas – mygtukas ⧉ virš grafiko."), "",
         f"• Esant 50 % išėjimų ir −10 % rinkų kritimui, fondo {sel['name']} alternatyvių investicijų dalis sudarytų {pct(sel['c5010'])}, "
         f"o buferis iki 30 % ribos būtų {(ALT_LIMIT - sel['c5010']) * 100:.2f}".replace(".", ",") + " procentinio punkto.",
         "", pic(2, f"„Matrica fondui“ – {sel['name']}", "Mygtukas ⧉ virš matricos."), "",
         f"• Didžiausia Baltijos obligacijų koncentracija nustatyta fonduose {bal_top}.",
         f"• Palyginti su ankstesniu vertinimu, situacija {verd}, nes {why}.", "",
         "Vertinimas – pagal faktinį turtą (kaip skaičiuojama 30 % riba); neišmokėti įsipareigojimai neįtraukti.", "",
         "Pridedu skaičiavimus ir jautrumo matricas."]
    return a, b


# ---------- Excel ----------
def write_xlsx(path, cur, prev, ref, la, lb, hist=None, prov="SEB", an=None):
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
    ws["A1"] = f"{prov} pensijų fondų likvidumo analizė – {cur['date']} (LB portfelių duomenys)"
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
                  f"{pct(s.get('ii_x_avg_wrong'))} – jis netaikomas, nes mažam ir dideliam fondui suteiktų vienodą svorį.")
    i += 2
    header(ws, i, ["Fondas", "Riba prie 0 % (matrica)", "Riba prie −10 % (matrica)", "Tiksli riba prie 0 %*",
                   "Tiksli riba prie −10 %*", "50 % / −10 %: alternatyvų dalis", "Buferis iki 30 %",
                   "50 % / −10 % kaip Excel faile**", "Riba prie −10 % kaip Excel faile**"])
    i += 1
    for r in alt:
        vals = [r["name"], grid_txt(r["hit0"]), grid_txt(r["hit10"]), r["ex0"], r["ex10"], r["c5010"], ALT_LIMIT - r["c5010"], r["c5010_xl"], grid_txt(r["hit10_xl"])]
        for j, v in enumerate(vals, 1):
            c = ws.cell(i, j, v)
            c.border = thin
            if 4 <= j <= 8:
                c.number_format = P2
        ws.cell(i, 6).fill = color_alt(r["c5010"])
        i += 1
    ws.cell(i + 1, 1, "* išėjimai kaip viso fondo turto dalis; prie 0 % sutampa su „Išėjimo riba“. ** 2026-07-30 Excel formulė (T−A)(1−x−m), x – ne alternatyvaus turto dalis – žr. Metodika.")

    # Alternatyvų matricos
    ws = wb.create_sheet("Alt matricos")
    sel = s.get("selected")
    order = ([sel] + [r for r in alt if r["code"] != sel["code"]]) if sel else []
    row = 1
    if not sel:
        ws["A1"] = "Valdytojo fondai alternatyvių investicijų neturi."
    ws.column_dimensions["A"].width = 22
    for k, r in enumerate(order):
        title = f"{r['name']}: alternatyvų dalis, kai A = {eur(r['alt'])}, AUM = {eur(r['aum'])}"
        if k == 0:
            title = "PAGRINDINĖ MATRICA – " + title + f". Pasirinkta, nes {s['sel_reason']}."
        row = matrix(ws, row, title, r["alt"], r["aum"], lambda v: color_alt(v), B, H, thin, P2)
    if sel:
        row = matrix(ws, row, f"Palyginimui – kaip 2026-07-30 Excel faile (T−A)(1−x−m), x – ne alternatyvaus turto dalis: {sel['name']}",
                     sel["alt"], sel["aum"], lambda v: color_alt(v), B, H, thin, P2, mode="excel")

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
    for pl in ("II", "III"):
        g = s.get(f"bal_{pl}")
        if g:
            for j, v in enumerate([f"Total {pl} pakopa", "", g["aum"], g["bal"], g["bal"] / g["aum"], None, g["xe"] / g["aum"], g["xe"]], 1):
                c = ws.cell(i, j, v)
                c.font, c.border = B, thin
                c.number_format = {3: E0, 4: E0, 8: E0, 5: P2, 7: P2}.get(j, "General")
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

    # Interaktyvi matrica: fondas pasirenkamas sąraše (geltonas langelis), langeliai – Excel formulės
    from openpyxl.worksheet.datavalidation import DataValidation
    ws = wb.create_sheet("Matrica (pasirinkti)")
    ws.column_dimensions["A"].width = 26
    ws["A1"] = "Pasirinkite fondą ir formulę geltonuose langeliuose – matrica persiskaičiuoja (Excel formulės)."
    ws["A1"].font = B
    lst = [r for r in cur["res"].values() if r["in_alt"] or (r["in_bal"] and r["lim"])]
    ws["N1"], ws["O1"], ws["P1"], ws["Q1"], ws["R1"] = "Fondas", "AUM", "Alternatyvos", "Baltijos obligacijos", "Obligacijų riba"
    for k, r in enumerate(lst, 2):
        for col, v in zip("NOPQR", [r["name"], r["aum"], r["alt"], r["bal"], r["lim"] or 0]):
            ws[f"{col}{k}"] = v
    n = len(lst) + 1
    YL = PatternFill("solid", fgColor="FFF2CC")
    ws["A3"], ws["B3"] = "Fondas", sel["name"] if sel else (lst[0]["name"] if lst else "")
    ws["A4"], ws["B4"] = "Rodiklis", "Alternatyvos" if sel else "Baltijos obligacijos"
    ws["A5"], ws["B5"] = "Formulė", "Pataisyta"
    for c in ("B3", "B4", "B5"):
        ws[c].fill, ws[c].font = YL, B
    for c, opts in (("B3", f"=$N$2:$N${n}"), ("B4", '"Alternatyvos,Baltijos obligacijos"'), ("B5", '"Pataisyta,Kaip Excel faile"')):
        dv = DataValidation(type="list", formula1=opts, allow_blank=False)
        ws.add_data_validation(dv)
        dv.add(c)
    ws["A6"], ws["B6"] = "AUM", f"=INDEX($O$2:$O${n},MATCH($B$3,$N$2:$N${n},0))"
    ws["A7"], ws["B7"] = "Nelikvidi dalis (A arba B)", f'=IF($B$4="Alternatyvos",INDEX($P$2:$P${n},MATCH($B$3,$N$2:$N${n},0)),INDEX($Q$2:$Q${n},MATCH($B$3,$N$2:$N${n},0)))'
    ws["A8"], ws["B8"] = "Riba", f'=IF($B$4="Alternatyvos",{ALT_LIMIT},INDEX($R$2:$R${n},MATCH($B$3,$N$2:$N${n},0)))'
    ws["B6"].number_format = ws["B7"].number_format = E0
    ws["B8"].number_format = "0.0%"
    ws["A10"] = "Rinkų kritimas ↓ / Išėjimai →"
    ws["A10"].font = B
    for j, x in enumerate(EXITS, 2):
        c = ws.cell(10, j, x)
        c.number_format, c.font, c.fill = "0%", B, H
    from openpyxl.formatting.rule import FormulaRule
    for k, m in enumerate(MARKET, 11):
        c = ws.cell(k, 1, m)
        c.number_format, c.font, c.fill = '"−"0%', B, H
        for j in range(2, 2 + len(EXITS)):
            col = ws.cell(10, j).column_letter
            x, mm = f"{col}$10", f"$A{k}"
            rest = f'IF($B$5="Pataisyta",($B$6-$B$7-{x}*$B$6)*(1-{mm}),($B$6-$B$7)*(1-{x}-{mm}))'
            c = ws.cell(k, j, f"=IF($B$7<=0,0,IF({rest}<=0,1,MIN(1,$B$7/($B$7+{rest}))))")
            c.number_format, c.border = P2, thin
    rng = f"B11:{ws.cell(10, 1 + len(EXITS)).column_letter}{10 + len(MARKET)}"
    ws.conditional_formatting.add(rng, FormulaRule(formula=["B11>=$B$8-0.0000001"], fill=R, stopIfTrue=True))
    ws.conditional_formatting.add(rng, FormulaRule(formula=['B11>=IF($B$4="Alternatyvos",0.25,0.9*$B$8)'], fill=Y, stopIfTrue=True))
    ws.conditional_formatting.add(rng, FormulaRule(formula=["B11>=0"], fill=G))
    ws.cell(12 + len(MARKET), 1, "Spalvos: raudona ≥ ribos; geltona – alternatyvoms 25–30 %, obligacijoms 90–100 % ribos; žalia – žemiau. "
                                 "Pataisyta: A/(A+(T−A−x·T)(1−m)); kaip Excel faile: A/(A+(T−A)(1−x−m)).")
    wb.calculation.fullCalcOnLoad = True

    # Istorija
    if hist:
        from openpyxl.chart import LineChart, Reference
        ws = wb.create_sheet("Istorija")
        cols = [("Data", "date", None), ("Alternatyvų dalis, min.", "alt_min", P2), ("Alternatyvų dalis, maks.", "alt_max", P2),
                ("Didžiausia dalis – fondas", "alt_max_f", None), ("II pakopos AUM (alt. analizė)", "ii_aum", E0),
                ("II pakopos alternatyvos, EUR", "ii_alt", E0), ("II pakopos išėjimo riba iki 30 %", "ii_x", P2),
                ("II pakopos išėjimo riba, EUR", "ii_xe", E0), ("Jautriausias fondas", "sens", None), ("Matricos fondas", "sel", None),
                ("50 % / −10 % (pataisyta)", "c5010", P2), ("50 % / −10 % (kaip Excel)", "c5010_xl", P2),
                ("Baltijos obligacijų dalis, II pakopa", "bal_ii", P2), ("Baltijos obl. išėjimų riba, II pakopa", "bal_ii_x", P2),
                ("Arčiausiai obligacijų ribos – fondas", "bal_min_f", None), ("Jo išėjimų riba", "bal_min_x", P2)]
        header(ws, 1, [c[0] for c in cols], [12, 12, 12, 26, 16, 16, 14, 16, 24, 24, 12, 12, 14, 14, 26, 12])
        for i, h in enumerate(hist, 2):
            for j, (_, k, f) in enumerate(cols, 1):
                c = ws.cell(i, j, h[k])
                c.border = thin
                if f:
                    c.number_format = f
        n = len(hist) + 1
        ch = LineChart()
        ch.title, ch.height, ch.width = "Alternatyvų dalis ir II pakopos išėjimo riba", 8, 22
        ch.y_axis.number_format = "0%"
        for col in (2, 3, 7, 11):
            ch.add_data(Reference(ws, min_col=col, min_row=1, max_row=n), titles_from_data=True)
        ch.set_categories(Reference(ws, min_col=1, min_row=2, max_row=n))
        ws.add_chart(ch, f"A{n + 3}")

    # Fondai laike – vieno valdytojo fondai × ketvirčiai (savininkas 2026-11-09: „kaip artėjame prie ribos“)
    if an and len(an) > 1:
        from openpyxl.chart import LineChart, Reference
        from openpyxl.formatting.rule import ColorScaleRule
        ws = wb.create_sheet("Fondai laike")
        ds = sorted(an)
        ws.cell(1, 1, f"{prov} fondai laike: kaip artėjama prie ribų").font = Font(bold=True, size=13)
        ws.cell(2, 1, "Spalvų skalė: raudona – prie ribos, geltona – pusiaukelėje, žalia – toli. Išėjimo riba 80 % = išėjus 80 % fondo turto "
                      "(alternatyvos neparduodamos), jų dalis pasiektų 30 %. Pokyčiai – Excel formulės.")
        blocks = [
            ("Išėjimo riba iki 30 % (kiek fondo turto gali išeiti)", lambda r: r["in_alt"], lambda r: r["alt_x"], "alt_xe", "aum", True),
            ("Alternatyvų dalis portfelyje", lambda r: r["in_alt"], lambda r: r["alt_sh"], "alt", "aum", False),
            ("Baltijos obligacijų išėjimų riba (iki fondo obligacijų ribos)", lambda r: r["in_bal"] and r["lim"] and r["bal"] > 0, lambda r: r["bal_x"], "bal_xe", "aum", True),
            ("Baltijos obligacijos: išnaudota fondo obligacijų ribos dalis", lambda r: r["in_bal"] and r["lim"] and r["bal"] > 0, lambda r: r["bal_sh"] / r["lim"], "bal", "limaum", False),
        ]
        row, n = 4, len(ds)
        yi = max(0, n - 5)
        first_block = None
        for title, ok, val, num_k, den_k, up_good in blocks:
            codes = {}
            for d in ds:
                for c, r in an[d]["res"].items():
                    if ok(r):
                        codes[c] = r
            if not codes:
                continue
            ws.cell(row, 1, title).font = B
            row += 1
            header(ws, row, ["Fondas"] + ds + ["Per ketvirtį, p. p.", f"Nuo {ds[yi]}, p. p."])
            row += 1
            r0 = row
            for c, last in sorted(codes.items(), key=lambda kv: (kv[1]["pillar"], kv[1]["name"])):
                ws.cell(row, 1, last["name"]).border = thin
                for j, d in enumerate(ds, 2):
                    r = an[d]["res"].get(c)
                    x = ws.cell(row, j, val(r) if r and ok(r) else None)
                    x.number_format, x.border = "0.0%", thin
                row += 1
            for pl in ("II", "III"):
                vals = []
                for d in ds:
                    g = [r for r in an[d]["res"].values() if r["pillar"] == pl and ok(r)]
                    den = sum(r["lim"] * r["aum"] if den_k == "limaum" else r["aum"] for r in g)
                    vals.append(sum(r[num_k] for r in g) / den if g and den else None)
                if not any(v is not None for v in vals):
                    continue
                ws.cell(row, 1, f"Total {pl} pakopa (svertinė)").font = B
                for j, v in enumerate(vals, 2):
                    x = ws.cell(row, j, v)
                    x.number_format, x.border, x.font = "0.0%", thin, B
                row += 1
            L = lambda j: ws.cell(1, j).column_letter  # noqa: E731
            for i in range(r0, row):
                for j, a in ((n + 2, n), (n + 3, yi + 2)):
                    x = ws.cell(i, j, f'=IF(OR({L(n + 1)}{i}="",{L(a)}{i}=""),"",({L(n + 1)}{i}-{L(a)}{i})*100)')
                    x.number_format, x.border = '+0.0;-0.0;0.0', thin
            rng = f"B{r0}:{L(n + 1)}{row - 1}"
            lo, hi = ("F8696B", "63BE7B") if up_good else ("63BE7B", "F8696B")
            if up_good:
                ws.conditional_formatting.add(rng, ColorScaleRule(start_type="num", start_value=0, start_color=lo, mid_type="num", mid_value=0.5, mid_color="FFEB84", end_type="num", end_value=1, end_color=hi))
            else:
                top = ALT_LIMIT if num_k == "alt" else 1
                ws.conditional_formatting.add(rng, ColorScaleRule(start_type="num", start_value=0, start_color=lo, mid_type="num", mid_value=top / 2, mid_color="FFEB84", end_type="num", end_value=top, end_color=hi))
            if first_block is None:
                first_block = (r0 - 1, row - 1)
            row += 2
        ws.column_dimensions["A"].width = 34
        for j in range(2, n + 4):
            ws.column_dimensions[ws.cell(1, j).column_letter].width = 12
        if first_block:
            h0, h1 = first_block
            ch = LineChart()
            ch.title, ch.height, ch.width = "Išėjimo riba iki 30 % pagal fondą", 9, 24
            ch.y_axis.number_format, ch.y_axis.scaling.min, ch.y_axis.scaling.max = "0%", 0, 1
            for i in range(h0 + 1, h1 + 1):
                ch.add_data(Reference(ws, min_col=1, max_col=n + 1, min_row=i), from_rows=True, titles_from_data=True)
            ch.set_categories(Reference(ws, min_col=2, max_col=n + 1, min_row=h0))
            ws.add_chart(ch, f"A{row + 1}")

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


def matrix(ws, row, title, a, t, color, B, H, thin, P2, mode="fix"):
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
    "Jautrumo matrica (pataisyta formulė – pagrindinė)",
    "• Langelis = A / (A + (T − A − x × T) × (1 − m)); A – alternatyvos, T – AUM, x – išėjimai kaip VISO fondo turto dalis (stulpeliai 0–90 %), m – rinkų kritimas (eilutės 0–95 %). Jei T − A − x × T ≤ 0 – 100 %; jei A = 0 – 0 %.",
    "• Eiga: dalyviai išsiima x viso fondo turto, išmokama tik iš likvaus turto; tada rinkos krenta m ir tai paveikia likusį likvų turtą. Prie m = 0 riba tiksliai sutampa su lentelės „Išėjimo riba“ (pvz. 1996–2002, 2026-07-30: 64,80 %).",
    "• Kodėl taisyta. 2026-07-30 Excel faile: A / (A + (T − A) × (1 − x − m)). Ten (1) x – ne alternatyvaus turto, o ne viso fondo dalis, todėl matricos riba (ties 80 %) nesutampa su lentelės riba (64,80 %); (2) x ir m sudedami – rinkos nuostolis skaičiuojamas nuo pradinio, o ne nuo po išėjimų likusio turto, todėl kritimas „užskaitomas“ ir išmokėtiems pinigams. Instrukcijoje užrašyta (1 − x)(1 − m) neatkuria nė vieno Excel kontrolinio skaičiaus (20,78 %, o ne 22,79 %).",
    "• Palyginimas, 1996–2002, 2026-07-30 įvestys: 50 % / −10 %: pataisyta 22,93 %, Excel 22,79 %; riba be rinkų kritimo: pataisyta 64,80 % (matricoje 70 %), Excel ~72 % ne alternatyvaus turto (80 %); prie −10 %: pataisyta 62,1 % (70 %), Excel ~62 % (70 %).",
    "• Lape „Alternatyvos“ ir matricų lape pateikiami abu variantai; laiške – pataisytas, su Excel varianto skaičiumi skliaustuose.",
    "• Prielaidos (konservatyvios): alternatyvų vertė nekinta; išėjimai finansuojami iš likvaus turto; rinkų kritimas veikia tik likvų turtą; alternatyvos neparduodamos. Jei alternatyvos kristų tiek pat, jų dalis nekiltų.",
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
    "   Matrica (pataisyta): (ALT + U) / (ALT + U + (AUM − ALT − U − x × AUM) × (1 − m)); Excel faile buvo (ALT + U) / (ALT + U + (AUM − ALT − U) × (1 − x − m)).",
    "   2026-07-30 pavyzdys (1996–2002): 4,18 mln. EUR (10,56 %) → su įsipareigojimais 6,17 mln. EUR (15,58 %); išėjimo riba 64,80 % → 48,08 %; 50 %/−10 %: 22,79 % → 31,56 %.",
    "• Pastaba dėl 2026-07-30 laiško: 22,79 % yra BE įsipareigojimų (ne „įskaitant būsimus įsipareigojimus“); „~60 % išėjimų“ su įsipareigojimais neatitinka matricos (~50 %). Ribos visada imamos iš apskaičiuotos matricos.",
    "",
    "Šaltinis: liquidity.py (pensijų fondų dashboard repo). Laiškas nesiunčiamas automatiškai.",
]


def summary_lines(cur, prev):
    s = cur["summary"]
    head = f"• Duomenų data: {cur['date']} (LB ketvirčio portfeliai); ankstesnis vertinimas: {prev['date'] if prev else '–'}."
    if not s.get("alt_min"):
        out = [head, "• Šis valdytojas alternatyvių (nelistinguotų PE / NT / infrastruktūros) investicijų neturi – vertinamos tik Baltijos obligacijos."]
        if s.get("bal_top"):
            out.append("• Didžiausia Baltijos obligacijų dalis: " + "; ".join(f"{r['name']} {pct(r['bal_sh'])} (riba {pct(r['lim'], 1)})" for r in s["bal_top"]) + ".")
        if s.get("bal_min"):
            out.append(f"• Arčiausiai obligacijų ribos: {s['bal_min']['name']} – išėjimų riba {pct(s['bal_min']['bal_x'])}.")
        return out
    sel = s["selected"]
    verd, why = verdict(cur, prev)
    out = [
        head,
        f"• Alternatyvų dalis: {pct(s['alt_min']['alt_sh'])} ({s['alt_min']['name']}) – {pct(s['alt_max']['alt_sh'])} ({s['alt_max']['name']}, {meur(s['alt_max']['alt'])}).",
        f"• II pakopos svertinė išėjimų riba iki 30 %: {pct(s['ii_x'])} arba {meur(s['ii_xe'])} (AUM {meur(s['ii_aum'])}).",
        f"• Jautriausias fondas: {s['sensitive']['name']} (išėjimo riba {pct(s['sensitive']['alt_x'])}).",
        f"• Matricos fondas: {sel['name']} – {s['sel_reason']}.",
        f"• {sel['name']}: riba pasiekiama ties {grid_txt(sel['hit0'])} išėjimų be rinkų kritimo ir ties {grid_txt(sel['hit10'])} prie −10 % "
        f"(tiksliai {pct(sel['ex0'], 1)} ir {pct(sel['ex10'], 1)} fondo turto).",
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
def run(date=None, out_dir=None, prov="SEB"):
    funds_cfg, alts, amap = load_cfg()
    funds = universe(prov, funds_cfg, amap)
    dates = prov_dates(prov)
    date = date or dates[-1]
    if date not in dates:
        raise SystemExit(f"Nėra {prov} portfelių duomenų {date}. Yra: {', '.join(dates[-8:])}")
    i = dates.index(date)
    prev_d = dates[i - 1] if i else None
    ref_d = REFERENCE_DATE if REFERENCE_DATE in dates and REFERENCE_DATE < (prev_d or date) else None
    rows = prov_rows(prov)
    nav, part, risky = lb_results()
    cur = analyse(date, rows[date], funds, amap, nav, part, dates, risky)
    prev = analyse(prev_d, rows[prev_d], funds, amap, nav, part, dates, risky) if prev_d else None
    ref = analyse(ref_d, rows[ref_d], funds, amap, nav, part, dates, risky) if ref_d else None
    la, lb = letters(cur, prev, ref, prov) if cur["summary"].get("alt_min") else ([], [])
    out = Path(out_dir or ROOT / "likvidumas") / date
    out.mkdir(parents=True, exist_ok=True)
    files = []
    x = out / f"{prov}_likvidumo_analize_{date}.xlsx"
    an = None
    try:
        an = all_analyses(prov)
        hist = [history_row(an[d]) for d in sorted(an) if d <= date]
    except Exception:  # noqa: BLE001
        hist = None
    write_xlsx(x, cur, prev, ref, la, lb, hist, prov, {d: v for d, v in an.items() if d <= date} if hist else None)
    files.append(x)
    pre = "" if prov == "SEB" else f"{prov}_"
    for tag, txt in (("A_issamus", la), ("B_trumpas", lb)):
        if not txt:
            continue
        p = out / f"{pre}laiskas_{tag}_{date}.txt"
        p.write_text("\n".join(txt) + "\n", encoding="utf-8")
        files.append(p)
    try:
        import docx
        doc = docx.Document()
        for tag, txt in (("Variantas A – išsamesnis", la), ("Variantas B – trumpesnis vadovybinis", lb)):
            doc.add_heading(tag, level=1)
            for t in txt:
                if t.startswith("[ĮKLIJUOTI"):
                    from docx.enum.text import WD_COLOR_INDEX
                    run = doc.add_paragraph().add_run(t)
                    run.bold, run.font.highlight_color = True, WD_COLOR_INDEX.YELLOW
                else:
                    doc.add_paragraph(t)
            doc.add_page_break()
        if not la:
            raise ImportError
        p = out / f"{pre}laiskas_{date}.docx"
        doc.save(p)
        files.append(p)
    except ImportError:
        pass
    return cur, prev, files


def history_row(a):
    """Vienas laiko eilutės įrašas (lapas „Istorija“ ir svetainės lentelė / grafikas)."""
    s = a["summary"]
    sel = s["selected"]
    b2 = s.get("bal_II") or {}
    return dict(date=a["date"], alt_min=s["alt_min"]["alt_sh"], alt_max=s["alt_max"]["alt_sh"], alt_max_f=s["alt_max"]["name"],
                ii_aum=s["ii_aum"], ii_alt=s["ii_alt"], ii_x=s["ii_x"], ii_xe=s["ii_xe"], sens=s["sensitive"]["name"],
                sel=sel["name"], c5010=sel["c5010"], c5010_xl=sel["c5010_xl"],
                bal_ii=(b2["bal"] / b2["aum"]) if b2.get("aum") else None, bal_ii_x=(b2["xe"] / b2["aum"]) if b2.get("aum") else None,
                bal_min_f=s["bal_min"]["name"] if s.get("bal_min") else None, bal_min_x=s["bal_min"]["bal_x"] if s.get("bal_min") else None)


def all_analyses(prov="SEB", lbr=None):
    funds_cfg, alts, amap = load_cfg()
    funds = universe(prov, funds_cfg, amap)
    alld = prov_dates(prov)
    rows = prov_rows(prov)
    nav, part, risky = lbr or lb_results()
    return {d: analyse(d, rows[d], funds, amap, nav, part, alld, risky) for d in alld if d >= START}


def prov_payload(prov, lbr):
    funds_cfg, alts, amap = load_cfg()
    an = all_analyses(prov, lbr)
    dates = sorted(an)
    keys = ["code", "name", "pillar", "in_alt", "in_bal", "aum", "nav_src", "alt", "alt_sh", "alt_x", "alt_xe", "bal", "bal_sh",
            "bonds", "lim", "bal_x", "bal_xe", "part", "part_chg", "c5010", "c5010_xl"]
    out = []
    for i, d in enumerate(dates):
        cur = an[d]
        prev = an[dates[i - 1]] if i else None
        ref = an.get(REFERENCE_DATE) if REFERENCE_DATE < (prev["date"] if prev else d) else None
        s = cur["summary"]
        has_alt = bool(s.get("alt_min"))
        last2 = i >= len(dates) - 2            # laiškai – tik 2 paskutiniams ketvirčiams (failo dydis)
        la, lb = letters(cur, prev, ref, prov) if has_alt and i >= len(dates) - 2 else ([], [])   # laiškai – 2 paskutiniams ketvirčiams
        rs = []
        for r in cur["res"].values():
            x = {k: (round(r[k], 6) if isinstance(r.get(k), float) else r.get(k)) for k in keys}
            x["altpos"] = sorted(([n, round(v)] for n, v in r["altpos"].items()), key=lambda z: -z[1]) if r["in_alt"] else []
            x["balpos"] = sorted(([n, round(v)] for n, v in r["balpos"].items()), key=lambda z: -z[1]) if r["in_bal"] else []
            rs.append(x)
        out.append(dict(
            date=d, prev=prev["date"] if prev else None, ref=ref["date"] if ref else None, funds=rs,
            sel=s["selected"]["code"] if has_alt else None, sel_reason=s.get("sel_reason", ""),
            sens=s["sensitive"]["code"] if has_alt else None,
            bal_sel=s["bal_sel"]["code"] if s.get("bal_sel") else None,
            ii=dict(aum=s.get("ii_aum"), alt=s.get("ii_alt"), xe=s.get("ii_xe"), x=s.get("ii_x"), avg_wrong=s.get("ii_x_avg_wrong")),
            bal_tot={pl: s.get(f"bal_{pl}") for pl in ("II", "III")},
            summary=summary_lines(cur, prev),
            cmp=[list(t) for t in compare(cur, prev)] if has_alt else [],
            cmp_ref=[list(t) for t in compare(cur, ref)] if (ref and has_alt) else [],
            dec=[{k: (round(v, 6) if isinstance(v, float) else v) for k, v in r.items()} for r in decompose(cur, prev)],
            exc=[[a, b, c, round(v) if isinstance(v, float) else v, e] for a, b, c, v, e in cur["exc"]],
            la=la, lb=lb))
    lim_rows = []
    if out:
        for f in out[-1]["funds"]:
            if f["in_bal"]:
                cfg = next((c for c in funds_cfg if c["code"] == f["code"]), None) if prov == "SEB" else None
                lim_rows.append(dict(code=f["code"], name=f["name"], lim=f["lim"] * 100 if f["lim"] else None,
                                     src=cfg["limit_source"] if cfg and cfg["bond_limit_pct"] else "LB rizikingų investicijų dalis (100 − X %)",
                                     rev=cfg["reviewed"] if cfg and cfg["bond_limit_pct"] else out[-1]["date"]))
    return dict(periods=out, hist=[history_row(an[d]) for d in dates if an[d]["summary"].get("alt_min")], limits=lim_rows)


def site_payload():
    """Svetainės skilčiai „Alternatyvios“ (portfolios.html, site/liq.js): kiekvienas valdytojas (savininkas 2026-11-09:
    „turėtų būti pritaikoma bet kuriam valdytojui“), visi ketvirčiai nuo START – lentelės, palyginimas, išimtys, laiškai;
    matricas naršyklė skaičiuoja pati iš A, B, AUM (abi formulės)."""
    _, alts, _ = load_cfg()
    lbr = lb_results()
    mg = {p: prov_payload(p, lbr) for p in providers()}
    return dict(mgr={k: v for k, v in mg.items() if v["periods"]}, limit=ALT_LIMIT, method=METHOD,
                alts=[dict(name=r["name"], is_alt=r["is_alt"], cls=r["class"], src=r["source"], rev=r["reviewed"]) for r in alts])


def latest_date():
    d = prov_dates("SEB")
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
    chk("1996–2002 50 %/−10 % (Excel formulė)", share(a, t, 0.5, 0.1, "excel"), 0.2279)
    print(f"    Excel matricos riba: 0 % → {grid_txt(grid_hit(a, t, .3, 0, 'excel'))} (laukta 80 %), −10 % → {grid_txt(grid_hit(a, t, .3, .1, 'excel'))} (laukta 70 %)")
    ok &= grid_hit(a, t, .3, 0, "excel") == 0.8 and grid_hit(a, t, .3, .1, "excel") == 0.7
    chk("pataisyta: riba prie 0 % = lentelės išėjimo riba", exact_hit(a, t, .3, 0), exit_limit(a, t, .3)[0], 1e-9)
    print(f"    pataisyta: 50 %/−10 % = {share(a, t, .5, .1) * 100:.2f} %, tiksli riba prie −10 % = {exact_hit(a, t, .3, .1) * 100:.2f} %")
    u = 0.1558 * t - a      # su įsipareigojimais 15,58 % – tik metodikos patikrai
    chk("su įsipareigojimais 50 %/−10 % (Excel formulė, tik metodikos patikra)", share(a + u, t, 0.5, 0.1, "excel"), 0.3156, 0.0003)
    chk("su įsipareigojimais išėjimo riba (tik metodikos patikra)", exit_limit(a + u, t, 0.30)[0], 0.4808, 0.0003)
    chk("1961–1967 Baltijos obligacijų išėjimų riba", 1 - 0.2206 / 0.734, 0.6995)
    print(f"    instrukcijos sandaugos formulė (T−A)(1−x)(1−m) 50 %/−10 % būtų {a / (a + (t - a) * .45) * 100:.2f} % – kontrolės NEatitinka")
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
    prov = args[args.index("--mgr") + 1] if "--mgr" in args else "SEB"
    cur, prev, files = run(date, out, prov)
    print("\n".join(summary_lines(cur, prev)))
    print("\nFailai:\n" + "\n".join(str(f) for f in files))


if __name__ == "__main__":
    main()
