#!/usr/bin/env python3
"""
Importuoja Goindex istorinių verčių CSV failus iš imports/goindex/ į data/nav_history.csv.

Formatas: kableliais atskirti stulpeliai, dešimtainis taškas, datos mažėjančia tvarka:
    Data,Vieneto vertė,Lyginamasis indeksas,Grynųjų aktyvų vertė,
Grynųjų aktyvų reikšmės <= 0 laikomos trūkstamais duomenimis (paleidimo laikotarpis 2022 m.).
Pakartotinis paleidimas saugus.
"""
import csv
import re
import sys
from datetime import date
from pathlib import Path

import store

IMPORT_DIR = Path(__file__).parent / "imports" / "goindex"


def fund_name(path: Path) -> str:
    years = re.search(r"(\d{4})-(\d{4})", path.stem)
    if years:
        return f"Goindex pensija {years.group(1)}-{years.group(2)}"
    if "turto" in path.stem.lower():
        return "Goindex pensijų turto išsaugojimo fondas"
    raise ValueError(f"Nepavyko nustatyti fondo: {path.name}")


def number(text):
    text = (text or "").strip()
    return float(text) if text else None


def parse(path: Path) -> list:
    name = fund_name(path)
    rows = {}
    with path.open(encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        next(reader)
        for parts in reader:
            if len(parts) < 2 or not parts[0].strip():
                continue
            unit_value = number(parts[1])
            if unit_value is None:
                continue
            benchmark = number(parts[2]) if len(parts) > 2 else None
            assets = number(parts[3]) if len(parts) > 3 else None
            rows[parts[0].strip()] = {
                "date": parts[0].strip(),
                "provider": "GOINDEX",
                "fund": name,
                "unit_value": unit_value,
                "net_assets": round(assets) if assets and assets > 0 else None,
                "benchmark_index": benchmark,
            }
    return [rows[d] for d in sorted(rows)]


def main() -> int:
    files = sorted(IMPORT_DIR.glob("*.csv"))
    if not files:
        print(f"Nerasta failų: {IMPORT_DIR}")
        return 1
    for path in files:
        rows = parse(path)
        changed = store.upsert(rows)
        dates = [date.fromisoformat(r["date"]) for r in rows]
        max_gap = max((b - a).days for a, b in zip(dates, dates[1:]))
        missing = sum(1 for r in rows if r["net_assets"] is None)
        print(f"{rows[0]['fund']}: {len(rows)} eil. ({rows[0]['date']} → {rows[-1]['date']}), "
              f"nauja/pakeista: {changed}, didžiausia spraga: {max_gap} d., be aktyvų: {missing}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
