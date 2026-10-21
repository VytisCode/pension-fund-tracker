"""Suderintas vartotojų kainų indeksas (SVKI, HICP) Lietuvai, Latvijai ir Estijai iš Eurostat -> data/hicp.csv (tik papildomas).

Reikalingas realiai (po infliacijos) grąžai visose trijose šalyse skaičiuoti vienodai (auditas 2026-10-21). Šaltinis – Eurostat
atvira API (be rakto), rinkinys prc_hicp_midx (mėnesio indeksas), CP00 (visos prekės ir paslaugos). Eurostat bazę keičia
(2015 = 100 -> 2025 = 100), todėl kiekviena eilutė turi savo bazę (unit) – skaičiuojant naudojama viena bazė.

Naudojimas: python tools/fetch_hicp.py [aplankas]
"""
import csv
import json
import sys
import time
import urllib.request
from datetime import date
from pathlib import Path

args = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = Path(args[0]) if args else Path(__file__).resolve().parent.parent / "data"
URL = ("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_midx"
       "?format=JSON&lang=EN&coicop=CP00&geo=LT&geo=LV&geo=EE&sinceTimePeriod=2000-01")
FIELDS = ["month", "geo", "unit", "index", "first_seen"]


def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "pension-fund-tracker"}), timeout=60) as r:
                return json.loads(r.read())
        except Exception as e:
            err = e
            time.sleep(3 * (i + 1))
    raise err


def parse(j):
    """JSON-stat 2.0 -> [(month, geo, unit, index)]"""
    ids, size = j["id"], j["size"]
    cat = {d: j["dimension"][d]["category"]["index"] for d in ids}
    inv = {d: {v: k for k, v in cat[d].items()} for d in ids}
    out = []
    for flat, v in j["value"].items():
        k, pos = int(flat), {}
        for d, s in zip(reversed(ids), reversed(size)):
            pos[d] = inv[d][k % s]; k //= s
        if v is None or pos.get("unit", "").startswith("RCH"):
            continue
        out.append((pos["time"].replace("M", "-") if "M" in pos["time"] else pos["time"], pos["geo"], pos.get("unit", ""), float(v)))
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "hicp.csv"
    old = {}
    if path.exists():
        for r in csv.DictReader(path.open(encoding="utf-8")):
            old[(r["month"], r["geo"], r["unit"])] = r
    rows = [r for r in parse(get(URL)) if r[2] in ("I15", "I25")]
    add = 0
    for m, g, u, v in rows:
        if (m, g, u) not in old and 20 < v < 300:          # neįtikėtinos reikšmės praleidžiamos
            old[(m, g, u)] = {"month": m, "geo": g, "unit": u, "index": v, "first_seen": date.today().isoformat()}
            add += 1
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, FIELDS)
        w.writeheader()
        for k in sorted(old):
            w.writerow(old[k])
    print(f"hicp.csv: +{add} naujų, iš viso {len(old)}; paskutinis mėnuo {max((k[0] for k in old), default='-')}")


if __name__ == "__main__":
    main()
