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
    top = defaultdict(lambda: defaultdict(list))              # 10 didžiausių investicijų (tools/fetch_ee_reports.py), naujausias mėnuo
    if (D / "ee_holdings.csv").exists():
        for r in csv.DictReader((D / "ee_holdings.csv").open(encoding="utf-8")):
            top[(r["pillar"], r["fund_id"])][r["date"]].append((int(r["rank"]), r["name"], float(r["weight"])))
    out = []
    for k, m in meta.items():
        if not ser.get(k):
            continue
        tq = max(top[k]) if top.get(k) else None
        s = snap.get((k[0], m["fund"].strip()), {})
        pts = weekly(ser[k])
        mgr = next((p for p in EE_PROV if m["fund"].lower().startswith(p.lower())), m["fund"].split()[0])
        lr = last[k]
        out.append({"id": f"EE-{k[0]}-{k[1]}", "c": "EE", "pl": k[0], "m": mgr, "n": m["fund"].strip(), "isin": m["isin"],
                    "fee": fnum(s.get("ter")), "feeK": "ter", "eq": None,
                    "na": round(float(lr["net_assets"]) / 1e6, 3) if lr.get("net_assets") else None,
                    "inv": int(lr["investors"]) if lr.get("investors") else None, "start": m["first"],
                    "top": [[n, w] for _, n, w in sorted(top[k][tq])] if tq else None, "topQ": tq,
                    "cg": None, "vol": vol3(weekly(ser[k], 0)), "pts": pts, "full": sorted(ser[k])})
    return out


def lv_reports():
    """LV plānų ketvirčio ataskaitos (tools/fetch_lv_reports.py): {plan_id: {quarter: eilutė}} ir {plan_id: (ketvirtis, [[pavadinimas, %], …])}."""
    rp, hp = D / "lv_reports.csv", D / "lv_holdings.csv"
    rep, top = defaultdict(dict), {}
    if not rp.exists():
        return rep, top
    for r in csv.DictReader(rp.open(encoding="utf-8")):
        o = rep[r["plan_id"]].get(r["quarter"])
        if not o or (r["assets_eur"] and not o["assets_eur"]):
            rep[r["plan_id"]][r["quarter"]] = r
    for pl, qs in rep.items():                              # akivaizdžios skaitymo klaidos: vertė 2 kartus skiriasi nuo abiejų kaimynų
        v = [(q, float(r["assets_eur"])) for q, r in sorted(qs.items()) if r["assets_eur"]]
        for (_, a), (q, b), (_, c) in zip(v, v[1:], v[2:]):
            if (b < a / 2 and b < c / 2) or (b > a * 2 and b > c * 2):
                qs[q] = dict(qs[q], assets_eur="")
    if hp.exists():
        h = defaultdict(lambda: defaultdict(list))
        for r in csv.DictReader(hp.open(encoding="utf-8")):
            h[r["plan_id"]][r["quarter"]].append((int(r["rank"]), r["name"], float(r["weight"])))
        for pl, qs in h.items():
            q = max(qs)
            top[pl] = (q, [[n, w] for _, n, w in sorted(qs[q])])
    return rep, top


def lv_totals(funds, rep):
    """LV II pakopos turtas (mln. €) ketvirčio pabaigoje – visų planų ataskaitų suma. Ketvirtis rodomas tik tada, kai yra visų tuo
    metu veikusių planų turtas (nepavykus perskaityti vienos ataskaitos – imama gretimo ketvirčio vertė, jų skaičius – „fill“);
    kitaip suma būtų per maža."""
    qs = sorted({q for p in rep.values() for q in p})
    live = [f for f in funds if f["pl"] == "II"]
    out = {"m": [], "na": [], "n": [], "fill": []}
    for i, q in enumerate(qs):
        qd = day(q)
        tot, n, ok, fill = 0.0, 0, True, 0
        for f in live:
            pl = f["id"].split("-")[-1]
            if f["pts"][0][0] > qd - 80 or f["pts"][-1][0] < qd - 100:      # planas tą ketvirtį dar neveikė arba jau uždarytas
                continue
            r = rep.get(pl, {}).get(q)
            v = float(r["assets_eur"]) if r and r["assets_eur"] else None
            for j in (i - 1, i + 1):                            # nepavykus perskaityti – gretimo ketvirčio vertė
                if v is None and 0 <= j < len(qs):
                    pr = rep.get(pl, {}).get(qs[j])
                    v = float(pr["assets_eur"]) if pr and pr["assets_eur"] else None
                    fill += v is not None
            if v is None:
                ok = False
                break
            tot += v; n += 1
        if ok and n:
            out["m"].append(q[:7]); out["na"].append(round(tot / 1e6, 1)); out["n"].append(n); out["fill"].append(fill)
    return out


def lv_lb(plan_sums):
    """Latvijos rinka laike – Latvijas Banka grynieji aktyvai (mln. €, ketvirčio pabaiga; tools/fetch_lv_lb.py). „chk“ – patikra:
    naujausio ketvirčio visų plānų ataskaitų suma ir banko suma (II pakopa)."""
    by = defaultdict(dict)
    for r in csv.DictReader((D / "baltic_lv_lb.csv").open(encoding="utf-8")):
        by[r["pillar"]][r["quarter"]] = round(float(r["net_assets_k"]) / 1e3, 1)
    out = {p: {"m": [q[:7] for q in sorted(v)], "na": [v[q] for q in sorted(v)]} for p, v in by.items()}
    if plan_sums and "II" in out:
        ps = dict(zip(plan_sums["m"], plan_sums["na"]))
        both = [m for m in out["II"]["m"] if m in ps]
        if both:
            m = both[-1]
            out["chk"] = [m, ps[m], out["II"]["na"][out["II"]["m"].index(m)]]
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
    rep, top = lv_reports()
    out = []
    for k, p in plans.items():
        if not ser.get(k):
            continue
        last = rep.get(k[1], {})
        lq = max((q for q, r in last.items() if r["assets_eur"]), default=None) if k[0] == "II" else None
        prov = p["provider"].lower()
        mgr = next((lab for key, lab in LV_PROV if key in prov), p["provider"])
        eq = fnum(p["stock_pct"])
        pts = sorted(ser[k])
        out.append({"id": f"LV-{k[0]}-{k[1]}", "c": "LV", "pl": k[0], "m": mgr, "n": p["name"].strip(), "isin": None,
                    "fee": fnum(p["fee_fixed"]), "feeK": "fix", "eq": eq,
                    "na": round(float(last[lq]["assets_eur"]) / 1e6, 1) if lq else None, "naQ": lq,
                    "inv": int(last[lq]["participants"]) if lq and last[lq]["participants"] else None,
                    "top": top[k[1]][1] if k[0] == "II" and k[1] in top else None, "topQ": top[k[1]][0] if k[0] == "II" and k[1] in top else None,
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
    lvt = None
    try:
        lvt = lv_totals([f for f in funds if f["c"] == "LV"], lv_reports()[0])
        lvt = lvt if lvt["m"] else None
    except Exception as e:                  # papildoma dalis – jos klaida neturi sustabdyti puslapio
        print("baltic: LV sumos nepavyko:", e)
    for f in funds:
        f["risk"] = risk_of(f["vol"])
    perf = perf_data(funds)
    for f in funds:
        f.pop("full", None)
        f["d"], f["v"] = enc(f.pop("pts"))
    try:
        tot = {"EE": ee_totals()}
    except FileNotFoundError:
        tot = {}
    try:
        lv = lv_lb(lvt)
        if lv:
            tot["LV"] = lv
    except FileNotFoundError:
        pass
    try:
        rf = reform()
    except Exception as e:                  # papildoma dalis – jos klaida neturi sustabdyti puslapio
        print("baltic: reformų palyginimas nepavyko:", e)
        rf = None
    return {"funds": sorted(funds, key=lambda f: (f["c"], f["pl"], f["m"], f["n"])), "tot": tot, "rf": rf, "cpi": hicp(), "jr": jr(), "_perf": perf}


PGRP = {"LV": [("zz", "Kiti plānai", "Other plans"), ("e30", "Iki 30 % akcijų", "Up to 30% equities"), ("e75", "31–75 % akcijų", "31–75% equities"), ("e100", "Daugiau nei 75 % akcijų", "Over 75% equities")],
        "EE": [("zz", "Per trumpa istorija", "Too short history"), ("r1", "Maža rizika (svyravimas iki 4 %)", "Low risk (volatility under 4%)"), ("r2", "Vidutinė rizika (4–8 %)", "Moderate risk (4–8%)"),
               ("r3", "Didesnė rizika (8–12 %)", "Higher risk (8–12%)"), ("r4", "Didelė rizika (daugiau nei 12 %)", "High risk (over 12%)")]}


def perf_data(funds):
    """Latvijos ir Estijos fondai tuo pačiu formatu kaip III pakopos data3.js – kad „Rezultatų“ puslapis (perf.js) veiktų ir jiems
    (savininkas 2026-10-21: „kad latviai ir estai jaustų tą pačią kokybę, kokią matys Lietuvoje“). Grupės – šalies peer grupės:
    LV – akcijų dalis, EE – rizikos grupė (3 m. svyravimas). Uždaryti fondai (paskutinė vertė > 45 d. senesnė) neįtraukiami.
    {(šalis, pakopa): {"providers", "groups", "ppy", "stale"}}"""
    out = {}
    for c in ("LV", "EE"):
        for pl in ("II", "III"):
            fs = [f for f in funds if f["c"] == c and f["pl"] == pl]
            if not fs:
                continue
            ser = {f["id"]: f.get("full") or f["pts"] for f in fs}
            top = max(v[-1][0] for v in ser.values())
            fs = [f for f in fs if ser[f["id"]][-1][0] > top - 45]
            key = (lambda f: f["cg"] or "zz") if c == "LV" else (lambda f: f["risk"] or "zz")
            provs, groups = [], []
            for gid, lt, en in PGRP[c]:
                gf = sorted([f for f in fs if key(f) == gid], key=lambda f: (f["m"], f["n"]))
                if not gf:
                    continue
                rows = []
                for f in gf:
                    pid = f"f{len(provs)}"
                    provs.append({"id": pid, "label": f["n"], "brand": re.sub(r"[^A-Z]", "", f["m"].upper()) or "X", "m": f["m"]})
                    pts = ser[f["id"]]
                    dd, v = enc(pts)
                    rows.append({"provider": pid, "brand": provs[-1]["brand"], "name": f["n"], "code": f["id"], "risky": "0", "d0": dd[0], "dd": dd[1:], "v": v,
                                 "assets": round(f["na"] * 1e6) if f.get("na") else None, "assetsDate": (day(f["naQ"]) if f.get("naQ") else pts[-1][0]) if f.get("na") else None,
                                 "fee": f["fee"] if f.get("feeK") == "ter" else None})
                groups.append({"id": gid, "lbl": {"lt": lt, "en": en}, "funds": rows})
            last = max(ser[f["id"]][-1][0] for f in fs)
            n3 = [len([p for p in ser[f["id"]] if p[0] > last - 1096]) / 3 for f in fs if ser[f["id"]][0][0] < last - 1096]
            ppy = sorted(n3)[len(n3) // 2] if n3 else 252
            out[(c, pl)] = {"providers": provs, "groups": groups, "ppy": round(ppy, 1), "stale": 20 if c == "LV" else 5}
    return out


def hicp():
    """Eurostat SVKI (data/hicp.csv, tools/fetch_hicp.py) realiai grąžai: {šalis: {"u": bazė, "s": "YYYY-MM", "v": [indeksas…]}}.
    Naudojama bazė, kurios duomenys naujausi, mėnesiai be tarpų; trūkstamas mėnuo – None."""
    p = ROOT / "data" / "hicp.csv"
    if not p.exists():
        return None
    rows = defaultdict(dict)
    for r in csv.DictReader(p.open(encoding="utf-8")):
        rows[(r["geo"], r["unit"])][r["month"]] = float(r["index"])
    out = {}
    for g in ("LT", "LV", "EE"):
        us = [u for (gg, u) in rows if gg == g]
        if not us:
            continue
        u = max(us, key=lambda u: (max(rows[(g, u)]), len(rows[(g, u)])))   # bazė su naujausiu mėnesiu (ir ilgiausia istorija)
        m = dict(rows[(g, u)])
        o = max((x for x in us if x != u), key=lambda x: (len(rows[(g, x)]), max(rows[(g, x)])), default=None)
        if o:                                           # senesni mėnesiai – iš ilgiausios senos bazės, perskaičiuoti paskutinio bendro mėnesio santykiu
            com = sorted(set(m) & set(rows[(g, o)]))
            if com:
                k = m[com[-1]] / rows[(g, o)][com[-1]]
                for mm, x in rows[(g, o)].items():
                    if mm < com[-1]:                    # iki sujungimo mėnesio – sena bazė (be šuolio ties sujungimu)
                        m[mm] = round(x * k, 4)
        ks = sorted(m)
        y, mo = map(int, ks[0].split("-")); v = []
        while f"{y:04d}-{mo:02d}" <= ks[-1]:
            v.append(m.get(f"{y:04d}-{mo:02d}")); mo += 1
            if mo > 12:
                y, mo = y + 1, 1
        out[g] = {"u": u, "s": ks[0], "v": v}
    return out or None


if __name__ == "__main__":
    b = build()
    from collections import Counter
    print(Counter((f["c"], f["pl"]) for f in b["funds"]), Counter(f["risk"] for f in b["funds"]))


# ---------- Kelias į pensiją: Latvija ir Estija (savininkas 2026-10-21: „net ir Estišką; Latvišką kelią į pensiją“) ----------
# II pakopos įmokų tarifai (% nuo bruto darbo užmokesčio) nuo mėnesio „from“; own – darbuotojo, state – iš socialinio mokesčio / draudimo įmokos.
# Apytiksliai (šaltiniai skiriasi) – pažymėta tekste; vartotojas mato visas taisykles ir šaltinius puslapyje.
JR_SRC = {"LV": "https://www.manapensija.lv/", "EE": "https://www.pensionikeskus.ee/"}
JR_RATES = {
    "LV": [
        ("2001-07", None, 2, "II pakopa pradėta: 2 % iš 20 % socialinio draudimo įmokos pensijoms", "Pillar II started: 2% out of the 20% pension social contribution"),
        ("2007-01", None, 4, "4 %", "4%"),
        ("2008-01", None, 8, "8 % (buvo planuota kilti iki 10 %)", "8% (planned to rise to 10%)"),
        ("2009-05", None, 2, "Krizė: sumažinta iki 2 % (mėnuo apytikslis – 2009 m. gegužė)", "Crisis: cut to 2% (month approximate – May 2009)"),
        ("2013-01", None, 4, "4 %", "4%"),
        ("2015-01", None, 5, "5 %", "5%"),
        ("2016-01", None, 6, "6 %", "6%"),
        ("2025-01", None, 5, "5 % (1 p. p. grąžintas į I pakopą)", "5% (1 pp moved back to pillar I)"),
    ],
    "EE": [
        ("2002-07", 2, 4, "II pakopa pradėta: darbuotojas 2 % + valstybė 4 % iš 33 % socialinio mokesčio", "Pillar II started: employee 2% + state 4% out of the 33% social tax"),
        ("2009-06", 0, 0, "Krizė: valstybės įmoka sustabdyta (iki 2010-12-31), darbuotojo – tik pateikus prašymą (čia – nemokėjo)", "Crisis: state contribution suspended (to 2010-12-31), employee only on application (here – not paid)"),
        ("2011-01", 2, 2, "Dalinai atnaujinta: valstybė 2 % (apytiksliai – šaltiniai skiriasi)", "Partly restored: state 2% (approximate – sources differ)"),
        ("2012-01", 2, 4, "Vėl 2 % + 4 % (2014–2017 m. pateikusieji prašymą mokėjo 3 % + 6 % – čia neįskaičiuota)", "Back to 2% + 4% (in 2014–2017 those who applied paid 3% + 6% – not modelled here)"),
        ("2020-07", 2, 0, "Valstybės 4 % sustabdyta iki 2021-08-31; nesumokėta dalis kompensuota 2023–2024 m. (čia – lygiomis dalimis)", "State 4% suspended to 2021-08-31; the missed part was compensated in 2023–2024 (here – in equal parts)"),
        ("2021-09", 2, 4, "Vėl 2 % + 4 %; nuo 2021 m. II pakopa savanoriška (galima išeiti)", "Back to 2% + 4%; since 2021 pillar II is voluntary (can leave)"),
        ("2025-01", 2, 4, "Savo įmoka pasirenkama: 2, 4 arba 6 % + valstybės 4 %", "Own contribution chosen: 2, 4 or 6% + state 4%"),
    ],
}
JR_TXT = {
    "LV": ("Latvijos II pakopos (fondētā pensiju shēma) įmokos – dalis 20 % socialinio draudimo pensijų įmokos, kurią moka darbdavys ir darbuotojas; dalyvis papildomai nemoka. Pensinis amžius – 65 m. Atlyginimai – Centrālā statistikas pārvalde (DSV010m), pensijos – PPP040.",
           "Latvian pillar II (funded scheme) contributions are part of the 20% pension social contribution paid by employer and employee; the participant pays nothing extra. Retirement age 65. Wages – Central Statistical Bureau (DSV010m), pensions – PPP040."),
    "EE": ("Estijos II pakopos įmokas sudaro darbuotojo 2 % (nuo 2025 m. – 2, 4 arba 6 %) ir valstybės 4 % iš 33 % socialinio mokesčio. Pensinis amžius 2026 m. – 65 m., nuo 2027 m. susietas su gyvenimo trukme. Atlyginimai ir pensijos – Statistikaamet (ketvirčiai).",
           "Estonian pillar II contributions: employee 2% (from 2025 – 2, 4 or 6%) and state 4% out of the 33% social tax. Retirement age 65 in 2026, linked to life expectancy from 2027. Wages and pensions – Statistics Estonia (quarters)."),
}


def jr():
    """Kelio į pensiją duomenys: tarifai, vidutinis bruto darbo užmokestis (EE – ketvirčiai, LV – mėnesiai), vidutinė senatvės pensija."""
    wage, pen = {"LV": {}, "EE": {}}, {"LV": {}, "EE": {}}
    p = D / "baltic_macro.csv"
    if p.exists():
        for r in csv.DictReader(p.open(encoding="utf-8")):
            v = fnum(r["value"])
            if v is None or r["geo"] not in wage:
                continue
            if r["series"] == "wage_gross":
                wage[r["geo"]][r["period"]] = v
            elif r["series"] == "pension":
                pen[r["geo"]][r["period"]] = v
    rates = {c: [{"from": f, "own": o, "state": st, "choice": c == "EE" and f >= "2025-01", "lt": lt, "en": en, "src": JR_SRC[c]} for f, o, st, lt, en in R]
             for c, R in JR_RATES.items()}
    return {"rates": rates, "wage": wage, "pension": pen, "src": {c: {"lt": a, "en": b} for c, (a, b) in JR_TXT.items()},
            "comp": {"EE": {"from": "2020-07", "to": "2021-08", "pct": 4, "payFrom": "2023-01", "payTo": "2024-12", "payN": 24}}}
