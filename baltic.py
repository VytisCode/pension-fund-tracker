"""„Baltijos šalys“ puslapio duomenys (docs/data_baltic.js): Lietuvos, Latvijos ir Estijos II ir III pakopos fondai vienoje vietoje.

Šaltiniai: Estija – data/baltic_ee*.csv (pensionikeskus.ee), Latvija – data/baltic_lv_*.csv (manapensija.lv),
Lietuva – data/nav_history.csv (II) ir data/pillar3_history.csv (III); rinkimas – tools/fetch_baltic.py.
Kiekvienas fondas: šalis, pakopa, valdytojas, pavadinimas, mokestis, akcijų dalis (LV), aktyvai ir dalyviai (EE, LT aktyvai),
šalies grupė, rizikos grupė (3 m. metinis svyravimas – vienodas visoms šalims) ir vertės eilutė:
  EE ir LT – savaitės paskutinė vieneto vertė, LV – manapensija.lv grafiko taškai (indeksas, 100 = plano pradžia, kas ~9–13 d.).
EE ir LT paskutiniai 6 metai – kasdienės vertės. Eilutė užkoduota: d – dienų skirtumai nuo ankstesnio taško (pirmas – nuo 1970-01-01), v – vertės.
"""
import csv
import math
import re
from collections import defaultdict
from datetime import date

from pathlib import Path

ROOT = Path(__file__).parent
D = ROOT / "data"
LT_PROV = {"ALLIANZ": "Allianz", "ARTEA": "Artea", "GOINDEX": "Goindex", "LUMINOR": "Luminor", "SEB": "SEB", "SWEDBANK": "Swedbank"}
LV_PROV = [("swedbank", "Swedbank"), ("seb", "SEB"), ("cbl", "CBL"), ("invl", "INVL"), ("luminor", "Luminor"), ("indexo", "Indexo")]
EE_PROV = ["LHV", "Luminor", "SEB", "Swedbank", "Tuleva"]
RISK = [(4, "r1"), (8, "r2"), (12, "r3"), (1e9, "r4")]      # 3 m. metinis svyravimas, %: iki 4, 4–8, 8–12, virš 12


def day(s: str) -> int:
    return (date.fromisoformat(s) - date(1970, 1, 1)).days


def weekly(pts, daily_days=6 * 365):
    """[(diena, vertė)] -> senesnė istorija – paskutinė kiekvienos savaitės (pirmadienis–sekmadienis) vertė; paskutiniai 6 metai –
    kasdien, kad 1, 3 ir 5 metų grąžos sutaptų su oficialiomis (savaitės taškas gali būti iki 6 d. ankstesnis)."""
    pts = sorted(pts)
    if not pts:
        return []
    cut, out = pts[-1][0] - daily_days, {}
    for d, v in pts:
        out[("d", d) if d >= cut else ("w", (d + 3) // 7)] = (d, v)   # 1970-01-01 – ketvirtadienis: (d+3)//7 – savaitės nr.
    return sorted(out.values())


def vol3(pts):
    """Paskutinių 3 metų metinis vertės svyravimas, % (logaritminių pokyčių st. nuokrypis × √(365 / vid. intervalas))."""
    if len(pts) < 20:
        return None
    end = pts[-1][0]
    xs = [p for p in pts if p[0] >= end - 3 * 365]
    if len(xs) < 20 or xs[0][0] > end - 3 * 365 + 30:
        return None
    r = [math.log(b[1] / a[1]) for a, b in zip(xs, xs[1:]) if a[1] > 0 and b[1] > 0]
    gap = (xs[-1][0] - xs[0][0]) / max(1, len(xs) - 1)
    m = sum(r) / len(r)
    sd = math.sqrt(sum((x - m) ** 2 for x in r) / (len(r) - 1))
    return round(sd * math.sqrt(365 / gap) * 100, 2)


def risk_of(v):
    return None if v is None else next(k for lim, k in RISK if v < lim)


def enc(pts, nd=6):
    d, v, prev = [], [], 0
    for x, y in pts:
        d.append(x - prev)
        prev = x
        v.append(float(f"{y:.{nd}g}"))
    return d, v


def fnum(s):
    try:
        return float(s) if s not in ("", None) else None
    except ValueError:
        return None


def ee_funds():
    meta = {(r["pillar"], r["fund_id"]): r for r in csv.DictReader((D / "baltic_ee_meta.csv").open(encoding="utf-8"))}
    snap = {}
    for r in csv.DictReader((D / "baltic_ee_funds.csv").open(encoding="utf-8")):
        if r["snapshot_date"] >= snap.get((r["pillar"], r["fund"].strip()), {}).get("snapshot_date", ""):
            snap[(r["pillar"], r["fund"].strip())] = r
    ser, last = defaultdict(list), {}
    for r in csv.DictReader((D / "baltic_ee.csv").open(encoding="utf-8")):
        k = (r["pillar"], r["fund_id"])
        if r["nav"]:
            ser[k].append((day(r["date"]), float(r["nav"])))
        last[k] = r
    out = []
    for k, m in meta.items():
        if not ser.get(k):
            continue
        s = snap.get((k[0], m["fund"].strip()), {})
        pts = weekly(ser[k])
        mgr = next((p for p in EE_PROV if m["fund"].lower().startswith(p.lower())), m["fund"].split()[0])
        lr = last[k]
        out.append({"id": f"EE-{k[0]}-{k[1]}", "c": "EE", "pl": k[0], "m": mgr, "n": m["fund"].strip(), "isin": m["isin"],
                    "fee": fnum(s.get("ter")), "feeK": "ter", "eq": None,
                    "na": round(float(lr["net_assets"]) / 1e6, 3) if lr.get("net_assets") else None,
                    "inv": int(lr["investors"]) if lr.get("investors") else None, "start": m["first"],
                    "cg": None, "vol": vol3(weekly(ser[k], 0)), "pts": pts})
    return out


def lv_funds():
    plans = {}
    for r in csv.DictReader((D / "baltic_lv_plans.csv").open(encoding="utf-8")):
        k = (r["pillar"], r["plan_id"])
        if r["seen"] >= plans.get(k, {}).get("seen", ""):
            plans[k] = r
    ser, avg = defaultdict(list), defaultdict(list)
    for r in csv.DictReader((D / "baltic_lv_index.csv").open(encoding="utf-8")):
        k = (r["pillar"], r["plan_id"])
        ser[k].append((day(r["date"]), float(r["value"])))
        if r["avg"]:
            avg[k].append((day(r["date"]), float(r["avg"])))
    out = []
    for k, p in plans.items():
        if not ser.get(k):
            continue
        prov = p["provider"].lower()
        mgr = next((lab for key, lab in LV_PROV if key in prov), p["provider"])
        eq = fnum(p["stock_pct"])
        pts = sorted(ser[k])
        out.append({"id": f"LV-{k[0]}-{k[1]}", "c": "LV", "pl": k[0], "m": mgr, "n": p["name"].strip(), "isin": None,
                    "fee": fnum(p["fee_fixed"]), "feeK": "fix", "eq": eq, "na": None, "inv": None,
                    "start": date.fromordinal(date(1970, 1, 1).toordinal() + pts[0][0]).isoformat(),
                    "cg": None if eq is None else "e30" if eq <= 30 else "e75" if eq <= 75 else "e100",
                    "pass": p["management"] == "Pasīvs", "vol": vol3(pts), "pts": pts})
    return out


def lt_funds():
    out = []
    for pl, path in (("II", D / "nav_history.csv"), ("III", D / "pillar3_history.csv")):
        ser, na = defaultdict(list), {}
        for r in csv.DictReader(path.open(encoding="utf-8")):
            if not r["unit_value"]:
                continue
            k = (r["provider"], r["fund"])
            ser[k].append((day(r["date"]), float(r["unit_value"])))
            if r["net_assets"]:
                na[k] = (r["date"], float(r["net_assets"]))
        for (prov, fund), s in ser.items():
            pts = weekly(s)
            if len(pts) < 2:
                continue
            g = re.search(r"(\d{4})\s*[-–]\s*(\d{4})", fund)
            cg = f"b{g.group(1)}" if pl == "II" and g else "turto" if pl == "II" and "turto" in fund.lower() else None
            a = na.get((prov, fund))
            out.append({"id": f"LT-{pl}-{re.sub(r'[^A-Za-z0-9]+', '', fund)[:40]}", "c": "LT", "pl": pl, "m": LT_PROV.get(prov, prov), "n": fund,
                        "isin": None, "fee": None, "feeK": None, "eq": None, "na": round(a[1] / 1e6, 3) if a else None, "inv": None,
                        "start": date.fromordinal(date(1970, 1, 1).toordinal() + pts[0][0]).isoformat(),
                        "cg": cg, "vol": vol3(weekly(s, 0)), "pts": pts})
    return out


def ee_totals():
    """Estijos II ir III pakopos aktyvai (mln. €) ir II pakopos aktyvūs investuotojai mėnesio pabaigoje (visų fondų suma)."""
    by = defaultdict(lambda: defaultdict(dict))
    for r in csv.DictReader((D / "baltic_ee.csv").open(encoding="utf-8")):
        by[r["pillar"]][r["date"][:7]][r["fund_id"]] = r          # paskutinė mėnesio diena – rašoma vėliausia
    out = {}
    for pl, months in by.items():
        ms = sorted(months)[:-1] + sorted(months)[-1:]
        out[pl] = {"m": ms, "na": [round(sum(float(r["net_assets"]) for r in months[m].values() if r["net_assets"]) / 1e6, 1) for m in ms],
                   "inv": [sum(int(r["investors"]) for r in months[m].values() if r["investors"]) or None for m in ms]}
    return out


def reform():
    """II pakopos reformų palyginimas (savininkas 2026-10-21): Estija (išėjimas leidžiamas nuo 2021-01-01) ir Lietuva (nuo 2026-01-01).
    Kiekvienai šaliai – mėnesio (EE) ar ketvirčio (LT, LB duomenys) pabaigos taškai: mėnesių skaičius nuo paskutinio mėnesio prieš
    reformą (0), dalyviai, grynieji aktyvai (mln. €), sukauptas investicijų uždarbis ir sukauptas grynasis srautas (įmokos − išmokos −
    išėjimai) nuo taško 0, mln. €. Srautas = turto pokytis − uždarbis; uždarbis = turtas ankstesnę dieną × vieneto vertės pokytis."""
    out = {}
    # Estija: kasdien pagal fondą
    by = defaultdict(dict)
    for r in csv.DictReader((D / "baltic_ee.csv").open(encoding="utf-8")):
        if r["pillar"] == "II" and r["date"] >= "2018-12-01":
            by[r["date"]][r["fund_id"]] = r
    prev, mon = None, {}
    for d in sorted(by):
        rs = by[d]
        g = 0.0
        if prev:
            for k, r in rs.items():
                p = by[prev].get(k)
                if p and r["nav"] and p["nav"] and p["net_assets"]:
                    g += float(p["net_assets"]) * (float(r["nav"]) / float(p["nav"]) - 1)
        m = mon.setdefault(d[:7], {"g": 0.0})
        m["g"] += g
        m["d"], m["na"], m["inv"] = d, sum(float(r["net_assets"]) for r in rs.values() if r["net_assets"]), sum(int(r["investors"]) for r in rs.values() if r["investors"])
        prev = d
    ms = sorted(mon)
    if ms and ms[-1] >= date.today().isoformat()[:7]:
        pass                                                         # einamasis mėnuo – iki paskutinės dienos
    out["EE"] = series("2021-01", [(m, mon[m]["d"], mon[m]["inv"], mon[m]["na"] / 1e6, mon[m]["g"] / 1e6) for m in ms])
    # Lietuva: LB ketvirčiai (dalyviai, aktyvai) + earnings.py ketvirčio uždarbis
    import earnings
    import market
    mk = market.build()
    eq = {q[0]: q[2] for q in earnings.build(mk)["II"]["q"]}
    part, nav = defaultdict(float), defaultdict(float)
    for r in csv.DictReader((D / "lb_results_history.csv").open(encoding="utf-8")):
        if r["pillar"] == "II" and r["kind"] == "fund" and r["date"] >= "2018-12-31":
            part[r["date"]] += float(r["participants"] or 0)
            nav[r["date"]] += float(r["nav_meur"] or 0)
    pts = []
    for d in sorted(nav):
        q = f"{d[:4]}-{(int(d[5:7]) - 1) // 3 + 1}"
        pts.append((d[:7], d, part[d] or None, nav[d], eq.get(q)))
    out["LT"] = series("2026-01", pts)
    out["start"] = {"EE": "2021-01-01", "LT": "2026-01-01"}
    return out


def series(start, pts):
    """[(mėnuo, data, dalyviai, turtas mln., uždarbis per laikotarpį mln.)] -> stulpeliai; o – mėnesiai nuo mėnesio prieš reformą."""
    y0, m0 = int(start[:4]), int(start[5:7]) - 1
    base = next((i for i, p in enumerate(pts) if p[0] >= f"{y0 if m0 else y0 - 1}-{m0 or 12:02d}"), None)
    o, cg, cf, G, F = [], 0.0, 0.0, [], []
    for i, (m, d, inv, na, g) in enumerate(pts):
        o.append((int(m[:4]) - y0) * 12 + int(m[5:7]) - 1 - m0 + 1)
        if base is not None and i > base:
            gg = g or 0.0
            cg += gg
            cf += na - pts[i - 1][3] - gg
        G.append(round(cg, 1)); F.append(round(cf, 1))
    return {"o": o, "d": [p[1] for p in pts], "part": [int(p[2]) if p[2] else None for p in pts], "na": [round(p[3], 1) for p in pts],
            "gain": G, "flow": F, "base": base}


def build() -> dict:
    funds = []
    for f in (ee_funds, lv_funds, lt_funds):
        try:
            funds += f()
        except FileNotFoundError as e:
            print("baltic: nėra failo", e)
    for f in funds:
        f["risk"] = risk_of(f["vol"])
        f["d"], f["v"] = enc(f.pop("pts"))
    try:
        tot = {"EE": ee_totals()}
    except FileNotFoundError:
        tot = {}
    try:
        rf = reform()
    except Exception as e:                  # papildoma dalis – jos klaida neturi sustabdyti puslapio
        print("baltic: reformų palyginimas nepavyko:", e)
        rf = None
    return {"funds": sorted(funds, key=lambda f: (f["c"], f["pl"], f["m"], f["n"])), "tot": tot, "rf": rf}


if __name__ == "__main__":
    b = build()
    from collections import Counter
    print(Counter((f["c"], f["pl"]) for f in b["funds"]), Counter(f["risk"] for f in b["funds"]))
