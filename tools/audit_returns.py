"""Grąžų auditas: mūsų vieneto verčių istorija (data/nav_history.csv, data/pillar3_history.csv) vs Lietuvos banko
ketvirčių rezultatų lentelės (data/lb_results_history.csv). Kiekvienam II ir III pakopos fondui ir ketvirčiui
perskaičiuoja grąžą nuo metų pradžios, 1 m., 3 m. ir 5 m. (vidutinė metinė) iš mūsų vieneto verčių ir lygina su LB.

  python tools/audit_returns.py [nuo_datos=2020-12-31] [--csv kelias]

Taisyklės (kaip LB): vertė ketvirčio paskutinę dieną (jei ne darbo diena – paskutinė ankstesnė), bazė – ta pati
kalendorinė diena prieš N metų (arba paskutinė ankstesnė); 3 ir 5 m. – vidutinė metinė (geometrinė).
Vieneto vertės skelbiamos 4 skaitmenimis po kablelio, todėl ±0,03 p. p. skirtumas – apvalinimas, ne klaida.
"""
import bisect
import csv
import re
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOL = 0.03  # p. p.


def key(provider, name):
    n = re.sub(r"\s*\[\d+\]", "", name.lower().replace("–", "-").replace("—", "-"))
    m = re.search(r"(19|20)\d\d\s*-\s*(19|20)\d\d", n)
    if m:
        return provider.upper(), re.sub(r"\s", "", m.group(0))
    if "išsaugojimo" in n:
        return provider.upper(), "TIF"
    n = re.sub(r"^swedbank\s+", "", n)
    return provider.upper(), re.sub(r"[^a-z0-9+()]", "", n)


def series():
    s = defaultdict(dict)
    for pillar, f in (("II", "nav_history.csv"), ("III", "pillar3_history.csv")):
        for r in csv.DictReader(open(ROOT / "data" / f, encoding="utf-8")):
            try:
                v = float(r["unit_value"])
            except ValueError:
                continue
            if v > 0:
                s[(pillar,) + key(r["provider"], r["fund"])][r["date"]] = (v, r["fund"])
    return {k: (sorted(d), d) for k, d in s.items()}


def at(ser, day):
    days, d = ser
    i = bisect.bisect_right(days, day) - 1
    return (days[i], d[days[i]][0]) if i >= 0 else (None, None)


def back(day, years):
    y, m, dd = map(int, day.split("-"))
    try:
        return date(y - years, m, dd).isoformat()
    except ValueError:
        return date(y - years, m, dd - 1).isoformat()


def main():
    since = next((a for a in sys.argv[1:] if re.match(r"\d{4}-\d\d-\d\d$", a)), "2020-12-31")
    out_csv = sys.argv[sys.argv.index("--csv") + 1] if "--csv" in sys.argv else None
    S = series()
    rows, unmatched = [], set()
    for r in csv.DictReader(open(ROOT / "data" / "lb_results_history.csv", encoding="utf-8")):
        if r["kind"] != "fund" or r["date"] < since:
            continue
        k = (r["pillar"],) + key(r["provider"], r["name"])
        ser = S.get(k)
        if not ser:
            unmatched.add((r["pillar"], r["provider"], r["name"]))
            continue
        q = r["date"]
        d1, v1 = at(ser, q)
        if not d1 or (date.fromisoformat(q) - date.fromisoformat(d1)).days > 5:
            continue
        specs = [("ret_ytd", f"{int(q[:4]) - 1}-12-31", 1), ("ret_1y", back(q, 1), 1), ("ret_3y", back(q, 3), 3), ("ret_5y", back(q, 5), 5)]
        for col, base, yrs in specs:
            if not r[col]:
                continue
            d0, v0 = at(ser, base)
            if not d0 or (date.fromisoformat(base) - date.fromisoformat(d0)).days > 5 or ser[0][0] > base:
                continue
            ours = ((v1 / v0) ** (1 / yrs) - 1) * 100 if yrs > 1 else (v1 / v0 - 1) * 100
            lb = float(r[col])
            rows.append({"pillar": r["pillar"], "date": q, "fund": ser[1][d1][1], "lb_name": r["name"], "metric": col,
                         "lb": round(lb, 4), "ours": round(ours, 4), "diff_pp": round(ours - lb, 4),
                         "base_day": d0, "end_day": d1, "uv0": v0, "uv1": v1})
    bad = [x for x in rows if abs(x["diff_pp"]) > TOL]
    by = defaultdict(lambda: [0, 0])
    for x in rows:
        by[(x["pillar"], x["metric"])][0] += 1
        by[(x["pillar"], x["metric"])][1] += abs(x["diff_pp"]) > TOL
    print(f"Palyginta {len(rows)} reikšmių (nuo {since}); nesutampa > {TOL} p. p.: {len(bad)}")
    for (p, m), (n, b) in sorted(by.items()):
        print(f"  {p:>3} {m:<8} {n:>5} palyginta, {b:>3} nesutampa")
    for x in sorted(bad, key=lambda x: -abs(x["diff_pp"]))[:60]:
        print(f"  {x['pillar']} {x['date']} {x['fund']:<45} {x['metric']:<7} LB {x['lb']:>9.3f} mūsų {x['ours']:>9.3f} "
              f"skirt. {x['diff_pp']:>+7.3f} (bazė {x['base_day']} {x['uv0']}, pab. {x['end_day']} {x['uv1']})")
    if unmatched:
        print("Nesusieti LB fondai:", len(unmatched))
        for u in sorted(unmatched)[:40]:
            print("  ", *u)
    if out_csv:
        with open(out_csv, "w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)


if __name__ == "__main__":
    main()
