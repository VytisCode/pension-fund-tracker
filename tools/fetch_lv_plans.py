"""Latvijos II ir III pakopos plānų dienos duomenys iš manapensija.lv (tas pats šaltinis, kurį naudoja „Lejupielādēt“ CSV):
turtas (assetValue, €), dalyvių skaičius (participantCount), vieneto vertė, akcijų dalis, rizika.

API: /api/data/pension-2nd-level-plans?date=YYYY-MM-DD ir /api/data/pensions/3rd-level/plans?date=YYYY-MM-DD
(be datos – naujausia diena). Istorija pasiekiama nuo 2003 m. (patikrinta 2026-11-09, probe_baltic8.py).

Rašoma: data/baltic_lv_daily.csv  date,pillar,slug,name,provider,nav,assets_eur,participants,stock_pct,risk,first_seen
         data/lv_daily_state.json  jau užklaustos datos be duomenų (savaitgaliai, šventės), kad nebūtų klausiama iš naujo.
Tik papildoma: esamos eilutės neperrašomos (užpildomi tik tušti laukai).

Kasdien: naujausia diena + paskutinės 14 dienų; po to istorija (biudžetas): pirma visų mėnesių pabaigos nuo 2003 m.,
tada visos darbo dienos nuo naujausių senyn.
Paleidimas: python tools/fetch_lv_plans.py [OUT_DIR] [--budget N] [--minutes M]
"""
import argparse
import csv
import json
import sys
import time
import urllib.error
import urllib.request
from datetime import date, timedelta
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"
API = {"II": "https://www.manapensija.lv/api/data/pension-2nd-level-plans",
       "III": "https://www.manapensija.lv/api/data/pensions/3rd-level/plans"}
FIELDS = ["date", "pillar", "slug", "name", "provider", "nav", "assets_eur", "participants", "stock_pct", "risk", "first_seen"]
START = date(2003, 1, 1)
TODAY = date.today()

ap = argparse.ArgumentParser()
ap.add_argument("out", nargs="?", default=str(Path(__file__).resolve().parent.parent / "data"))
ap.add_argument("--budget", type=int, default=300, help="kiek istorinių užklausų daugiausiai")
ap.add_argument("--minutes", type=float, default=6)
a = ap.parse_args()
OUT = Path(a.out); OUT.mkdir(parents=True, exist_ok=True)
CSV, STATE = OUT / "baltic_lv_daily.csv", OUT / "lv_daily_state.json"
T0 = time.time()


def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
                return json.loads(r.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            print("  retry", i + 1, url, e)
            time.sleep(3 * (i + 1))
    raise RuntimeError(f"nepavyko: {url}")


def num(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


rows, have = {}, set()
if CSV.exists():
    for r in csv.DictReader(CSV.open(encoding="utf-8")):
        rows[(r["date"], r["pillar"], r["slug"])] = r
        have.add((r["pillar"], r["date"]))
state = json.loads(STATE.read_text()) if STATE.exists() else {"empty": {"II": [], "III": []}}
empty = {p: set(state["empty"].get(p, [])) for p in API}
add = fill = calls = 0


def fetch(pl, d=None):
    """Grąžina gautų eilučių datą arba None. d=None – naujausia diena."""
    global add, fill, calls
    calls += 1
    data = get(API[pl] + (f"?date={d}" if d else ""))
    got = None
    for p in data or []:
        dd = (p.get("date") or "")[:10]
        if not dd or not p.get("slug"):
            continue
        got = dd
        assets, part = num(p.get("assetValue")), num(p.get("participantCount"))
        new = {"date": dd, "pillar": pl, "slug": p["slug"].strip("/"), "name": (p.get("name") or "").strip(),
               "provider": (p.get("provider") or "").strip(), "nav": p.get("partitionValue") or "",
               "assets_eur": int(assets) if assets else "", "participants": int(part) if part else "",
               "stock_pct": p.get("stockPercentage") if p.get("stockPercentage") is not None else "",
               "risk": p.get("risk") or "", "first_seen": TODAY.isoformat()}
        k = (dd, pl, new["slug"])
        if k not in rows:
            rows[k] = new; add += 1
        else:
            for f in FIELDS:
                if rows[k].get(f, "") in ("", None) and new.get(f, "") not in ("", None):
                    rows[k][f] = new[f]; fill += 1
        have.add((pl, dd))
    if d and got != d:
        empty[pl].add(d)          # tą dieną duomenų nėra (savaitgalis, šventė) arba grąžinta kita data
    time.sleep(0.3)
    return got


# 1) naujausia diena ir paskutinės 14 dienų (vėluojančios vertės)
for pl in API:
    try:
        last = fetch(pl)
        print("LV", pl, "naujausia diena", last)
        for i in range(1, 15):
            d = (TODAY - timedelta(days=i))
            if d.weekday() < 5 and (pl, d.isoformat()) not in have:
                fetch(pl, d.isoformat())
    except RuntimeError as e:
        print(e)

# 2) istorija pagal biudžetą: mėnesių pabaigos (paskutinė darbo diena), tada visos darbo dienos nuo naujausių
def month_ends():
    y, m = START.year, START.month
    while date(y, m, 1) <= TODAY:
        nx = date(y + (m == 12), m % 12 + 1, 1)
        d = nx - timedelta(days=1)
        while d.weekday() >= 5:
            d -= timedelta(days=1)
        if d < TODAY:
            yield d.isoformat()
        y, m = nx.year, nx.month


def workdays():
    d = TODAY - timedelta(days=15)
    while d >= START:
        if d.weekday() < 5:
            yield d.isoformat()
        d -= timedelta(days=1)


todo = []
for gen in (month_ends, workdays):
    for d in (sorted(gen(), reverse=True) if gen is month_ends else gen()):
        for pl in API:
            if (pl, d) not in have and d not in empty[pl] and (pl, d) not in todo:
                todo.append((pl, d))
hist = 0
for pl, d in todo:
    if hist >= a.budget or time.time() - T0 > a.minutes * 60:
        break
    try:
        fetch(pl, d); hist += 1
    except RuntimeError as e:
        print(e); break

with CSV.open("w", encoding="utf-8", newline="") as fh:
    w = csv.DictWriter(fh, FIELDS); w.writeheader()
    for k in sorted(rows):
        w.writerow({f: rows[k].get(f, "") for f in FIELDS})
STATE.write_text(json.dumps({"empty": {p: sorted(v) for p, v in empty.items()}}, indent=0))
left = len(todo) - hist
print(f"baltic_lv_daily.csv: +{add} eil., užpildyta {fill}, iš viso {len(rows)}; užklausų {calls}, istorijos liko ~{left}")
