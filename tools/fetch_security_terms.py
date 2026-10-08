#!/usr/bin/env python3
"""
Vertybinių popierių duomenys iš ESMA FIRDS registro (oficialus, nemokamas ES finansinių priemonių registras).

Kiekvienam fondų ir obligacijų ISIN iš data/portfolios.csv išsaugoma (data/security_terms.csv):
- pilnas pavadinimas (pvz. „Schroder International Selection Fund Global Gold C Accumulation EUR“),
- CFI kodas (priemonės rūšis),
- obligacijoms: išpirkimo data, fiksuota palūkanų norma (kuponas), nominalo vienetas, valiuta.
Iš jų svetainė apskaičiuoja obligacijų pajamingumą (YTM) ir trukmę (duration).

Klausiama tik apie dar nežinomus ISIN; nerasti įrašomi tušti, kad nebūtų klausiama kas kartą.
Naudojimas: python tools/fetch_security_terms.py [išvesties_failas]
"""
import csv
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "portfolios.csv"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "security_terms.csv"
API = "https://registers.esma.europa.eu/solr/esma_registers_firds/select"
ISIN = re.compile(r"^[A-Z]{2}[A-Z0-9]{9}\d$")
FIELDS = ["isin", "name", "cfi", "maturity", "coupon", "floating", "nominal_unit", "currency"]
TYPES = {"fund", "bond"}


def load(path: Path) -> dict:
    if not path.exists():
        return {}
    with path.open(encoding="utf-8", newline="") as f:
        return {r["isin"]: r for r in csv.DictReader(f)}


def ask(isin: str) -> list:
    url = API + "?" + urllib.parse.urlencode({"q": f"isin:{isin}", "wt": "json", "rows": 50})
    req = urllib.request.Request(url, headers={"User-Agent": "pension-fund-tracker"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))["response"]["docs"]
        except Exception:
            if attempt == 3:
                raise
            time.sleep(5 * (attempt + 1))
    return []


def nice_name(names: list) -> str:
    """Iš skirtingų biržų pavadinimų – aiškiausias: su mažosiomis raidėmis ir tarpais, ilgiausias."""
    good = [n.strip() for n in names if n and re.search(r"[a-z]", n) and " " in n.strip()]
    pool = good or [n.strip() for n in names if n]
    if not pool:
        return ""
    common = Counter(pool).most_common()
    return max(pool, key=lambda n: (len(n) <= 120, len(n), dict(common)[n]))


def parse(isin: str, docs: list) -> dict:
    row = {k: "" for k in FIELDS}
    row["isin"] = isin
    if not docs:
        return row
    row["name"] = nice_name([d.get("gnr_full_name", "") for d in docs])
    first = lambda key: next((d[key] for d in docs if d.get(key)), "")
    row["cfi"] = first("gnr_cfi_code")
    row["maturity"] = first("bnd_maturity_date")[:10]
    row["coupon"] = first("bnd_fixed_rate")
    row["floating"] = "1" if first("bnd_flltg_rate") or first("bnd_flltg_rate_ref_rate_isin") or first("bnd_flltg_rate_ref_rate_index") else ""
    row["nominal_unit"] = first("bnd_nmnl_value_unit")
    row["currency"] = first("bnd_nmnl_value_curr_code") or first("gnr_notional_curr_code")
    return row


def main() -> None:
    known = load(OUT)
    with SRC.open(encoding="utf-8", newline="") as f:
        isins = sorted({r["pos_id"] for r in csv.DictReader(f) if r["type"] in TYPES and ISIN.match(r["pos_id"])})
    todo = [i for i in isins if i not in known]
    print(f"ISIN: {len(isins)}, jau žinomi: {len(isins) - len(todo)}, klausiama: {len(todo)}")
    found = 0
    for k, isin in enumerate(todo):
        try:
            docs = ask(isin)
        except Exception as exc:
            print(f"FIRDS klaida ({exc.__class__.__name__}: {exc}); sustojama")
            break
        known[isin] = parse(isin, docs)
        found += bool(known[isin]["name"])
        if k % 100 == 0:
            print(f"  {k}/{len(todo)}")
        time.sleep(0.3)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for isin in sorted(known):
            w.writerow({k: known[isin].get(k, "") for k in FIELDS})
    print(f"Rasta: {found}; iš viso faile: {len(known)} -> {OUT}")


if __name__ == "__main__":
    main()
