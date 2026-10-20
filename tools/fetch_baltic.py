"""Latvijos ir Estijos pensijų fondų duomenys (savininko užduotis 2026-10-20: skyrius „Baltijos šalys“).

Šaltiniai (vieši, nemokami; robots.txt neriboja):
- Estija – pensionikeskus.ee: kasdienės vieneto vertės (NAV), grynieji aktyvai ir aktyvūs investuotojai (II pakopa)
  nuo 2002 m. per „?download=xls“ (UTF-16, tab), fondų sąrašas – iš „daily statistics“ puslapio nuorodų (f=ID);
  „daily statistics“ XLS – TER, grąžos, investuotojai, aktyvai šiandien.
- Latvija – manapensija.lv: valdytojų puslapių __NUXT_DATA__ (plānų sąrašas: ID, valdytojas, mokestis, akcijų dalis,
  valdymo tipas) ir plāno grafiko API (vertė, indeksuota į 100 nuo pradžios, ~kas 9 d.; kartu – grupės vidurkis).

Įrašo (tik papildo, istorijos neperrašo – žr. CLAUDE.md 6 taisyklę):
  data/baltic_ee.csv        date,pillar,fund_id,nav,net_assets,investors (aktyvai – €, sveikas skaičius)
  data/baltic_ee_meta.csv   pillar,fund_id,isin,fund,first,last
  data/baltic_ee_funds.csv  snapshot_date,pillar,fund,date,nav,r3m,r6m,r1y,r3y,r5y,r10y,r15y,r20y,ytd,ter,investors,net_assets_m
  data/baltic_lv_plans.csv  pillar,plan_id,provider,name,profit,fee_fixed,stock_pct,management,slug,seen
  data/baltic_lv_index.csv  pillar,plan_id,date,value,avg
Naudojimas: python tools/fetch_baltic.py [išvesties aplankas, numatyta data/]
"""
import csv
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import date, timedelta
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "data"
EE = "https://www.pensionikeskus.ee/en/statistics/"
LV = "https://www.manapensija.lv"
TODAY = date.today().isoformat()
EE_PAGES = {"II": ("ii-pillar/funded-pension-daily-statistics/", {"nav": "ii-pillar/nav-of-funded-pension/",
                                                                   "net_assets": "ii-pillar/value-of-assets-of-funded-pension/",
                                                                   "investors": "ii-pillar/active-investors/"}),
            "III": ("iii-pillar/suppl-funded-pension-daily-statistics/", {"nav": "iii-pillar/nav-of-suppl-funded-pension/",
                                                                          "net_assets": "iii-pillar/value-of-assets-of-suppl-funded-pension/"})}


def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120) as r:
                return r.read()
        except (urllib.error.URLError, TimeoutError) as e:
            print("  retry", i + 1, url, e)
            time.sleep(3 * (i + 1))
    raise RuntimeError(f"nepavyko: {url}")


def num(s):
    s = (s or "").strip().replace("\xa0", "").replace(" ", "").replace(",", ".")
    try:
        return float(s)
    except ValueError:
        return None


def merge(path, key, rows, fields):
    """Prideda naujas eilutes; esamose užpildo tik tuščius laukus (istorija neperrašoma)."""
    old = {}
    if path.exists():
        for r in csv.DictReader(path.open(encoding="utf-8")):
            old[tuple(r[k] for k in key)] = r
    add = fill = 0
    for r in rows:
        k = tuple(str(r[x]) for x in key)
        if k not in old:
            old[k] = {f: r.get(f, "") for f in fields}
            add += 1
        else:
            for f in fields:
                if old[k].get(f, "") in ("", None) and r.get(f, "") not in ("", None):
                    old[k][f] = r[f]
                    fill += 1
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fields)
        w.writeheader()
        for k in sorted(old):
            w.writerow({f: old[k].get(f, "") for f in fields})
    print(f"{path.name}: +{add} eil., užpildyta laukų {fill}, iš viso {len(old)}")


def ee():
    rows, snap, meta, since = {}, [], {}, {}
    # tik papildymas: atsisiunčiama nuo paskutinės turimos fondo datos − 10 d. (naujam fondui – visa istorija nuo 2002 m.)
    if (OUT / "baltic_ee.csv").exists():
        for r in csv.DictReader((OUT / "baltic_ee.csv").open(encoding="utf-8")):
            k = (r["pillar"], int(r["fund_id"]))
            since[k] = max(since.get(k, ""), r["date"])
    if (OUT / "baltic_ee_meta.csv").exists():
        for r in csv.DictReader((OUT / "baltic_ee_meta.csv").open(encoding="utf-8")):
            meta[(r["pillar"], int(r["fund_id"]))] = {**r, "fund_id": int(r["fund_id"])}
    for pl, (daily, kinds) in EE_PAGES.items():
        page = get(EE + daily).decode("utf-8", "replace")
        ids = sorted({int(x) for x in re.findall(r"[?&]f=(\d+)&", page)})
        print("EE", pl, "fondai", ids)
        t = get(EE + daily + "?download=xls").decode("utf-16")
        lines = [l.split("\t") for l in t.splitlines() if l.strip()]
        h = lines[0]
        for l in lines[1:]:
            r = dict(zip(h, l))
            d = r.get("Date", "")
            d = f"{d[6:10]}-{d[3:5]}-{d[0:2]}" if re.match(r"\d\d\.\d\d\.\d{4}", d) else d
            snap.append({"snapshot_date": TODAY, "pillar": pl, "fund": r.get("Fund", "").strip(), "date": d, "nav": num(r.get("NAV")),
                         "r3m": num(r.get("3m")), "r6m": num(r.get("6m")), "r1y": num(r.get("1y")), "r3y": num(r.get("3y")),
                         "r5y": num(r.get("5y")), "r10y": num(r.get("10y")), "r15y": num(r.get("15y")), "r20y": num(r.get("20y")),
                         "ytd": num(r.get("YTD")), "ter": num(r.get("TER %")), "investors": num(r.get("Active invest.")),
                         "net_assets_m": num(r.get("Net assets"))})
        for fid in ids:
            for k, path in kinds.items():
                d0 = since.get((pl, fid))
                d0 = (date.fromisoformat(d0) - timedelta(days=10)).isoformat() if d0 else "2002-01-01"
                t = get(f"{EE}{path}?download=xls&date_from={d0}&date_to={TODAY}&f%5B0%5D={fid}").decode("utf-16")
                ls = [l.split("\t") for l in t.splitlines() if l.strip()]
                if not ls or len(ls[0]) < 5:
                    print("  tuščia", pl, fid, k)
                    continue
                for l in ls[1:]:
                    if len(l) < 5:
                        continue
                    v = num(l[4])
                    if not v:                       # 0 – fondas dar neveikė
                        continue
                    rr = rows.setdefault((l[0], pl, fid), {"date": l[0], "pillar": pl, "fund_id": fid})
                    rr[k] = int(round(v)) if k in ("investors", "net_assets") else v
                    m = meta.setdefault((pl, fid), {"pillar": pl, "fund_id": fid, "isin": l[3], "fund": l[1].strip(), "first": l[0], "last": l[0]})
                    m["first"], m["last"], m["fund"] = min(m["first"], l[0]), max(m["last"], l[0]), l[1].strip()
                time.sleep(0.5)
    merge(OUT / "baltic_ee.csv", ["date", "pillar", "fund_id"], rows.values(), ["date", "pillar", "fund_id", "nav", "net_assets", "investors"])
    with (OUT / "baltic_ee_meta.csv").open("w", encoding="utf-8", newline="") as fh:   # aprašai – visada naujausi
        w = csv.DictWriter(fh, ["pillar", "fund_id", "isin", "fund", "first", "last"]); w.writeheader(); w.writerows(sorted(meta.values(), key=lambda m: (m["pillar"], m["fund_id"])))
    merge(OUT / "baltic_ee_funds.csv", ["snapshot_date", "pillar", "fund"], snap,
          ["snapshot_date", "pillar", "fund", "date", "nav", "r3m", "r6m", "r1y", "r3y", "r5y", "r10y", "r15y", "r20y", "ytd", "ter", "investors", "net_assets_m"])


def nuxt(html):
    m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    a = json.loads(m.group(1)) if m else []

    def res(x, d=0):
        x = a[x] if isinstance(x, int) and 0 <= x < len(a) else x
        if d > 6:
            return None
        if isinstance(x, dict):
            return {k: res(v, d + 1) for k, v in x.items()}
        if isinstance(x, list):
            return [res(v, d + 1) for v in x]
        return x
    return [res(i) for i, x in enumerate(a) if isinstance(x, dict) and x.get("type") is not None and "data" in x and "data_endpoint" in x]


def lv():
    sm = get(LV + "/sitemap.xml").decode("utf-8")
    slugs = sorted({u for u in re.findall(r"<loc>https://www\.manapensija\.lv/([a-z]+)</loc>", sm)})
    plans = {}
    for s in slugs:
        try:
            blocks = nuxt(get(f"{LV}/{s}").decode("utf-8", "replace"))
        except RuntimeError as e:
            print(e)
            continue
        for b in blocks:
            pl = {"provider_second_level": "II", "provider_third_level": "III"}.get(b["type"])
            if not pl:
                continue
            for p in b["data"] or []:
                plans[(pl, p["id"])] = {"pillar": pl, "plan_id": p["id"], "provider": p.get("provider"), "name": p.get("name"),
                                        "profit": p.get("profit"), "fee_fixed": p.get("commissionFixed"), "stock_pct": p.get("stockPercentage"),
                                        "management": p.get("managementType"), "slug": p.get("slug"), "seen": TODAY}
        time.sleep(0.5)
    print("LV plāni", len(plans))
    idx = []
    for (pl, pid), p in plans.items():
        api = "pension-2nd-level-average-charts" if pl == "II" else "pensions/3rd-level/average-charts"
        try:
            d = json.loads(get(f"{LV}/api/data/{api}?pension_plan={pid}&startDate=2001-01-01"))
        except Exception as e:
            print("  grafikas", pid, e)
            continue
        own = (d.get("plan_data") or {}).get("chart_data") or []
        avg = {x["date"]: x["value"] for c in ((d.get("average") or {}).get("chart_data") or [])[:1] for x in c["data"]}
        for x in (own[0]["data"] if own else []):
            idx.append({"pillar": pl, "plan_id": pid, "date": x["date"], "value": x["value"], "avg": avg.get(x["date"], "")})
        time.sleep(0.5)
    merge(OUT / "baltic_lv_plans.csv", ["pillar", "plan_id", "seen"], plans.values(),
          ["pillar", "plan_id", "provider", "name", "profit", "fee_fixed", "stock_pct", "management", "slug", "seen"])
    merge(OUT / "baltic_lv_index.csv", ["pillar", "plan_id", "date"], idx, ["pillar", "plan_id", "date", "value", "avg"])


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for f in (ee, lv):
        try:
            f()
        except Exception as e:
            print("KLAIDA", f.__name__, e)
