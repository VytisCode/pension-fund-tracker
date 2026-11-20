#!/usr/bin/env python3
"""
Importuoja Luminor istorines vieneto vertes iš imports/luminor/*.csv į data/nav_history.csv.

Luminor eksportas (originaliai .xls, paversti į CSV) turi tik du stulpelius:
    Date, <pilnas fondo pavadinimas>
Datos eina mažėjančia tvarka. Grynųjų aktyvų šiame eksporte nėra (paliekama tuščia).
Pakartotinis paleidimas saugus: tos pačios (data, fondas) eilutės nesidubliuoja.
"""
import csv
import sys
from datetime import date
from pathlib import Path

import store

IMPORT_DIR = Path(__file__).parent / "imports" / "luminor"


def parse(path: Path) -> list:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        header = next(reader)
        fund = header[1].strip()
        rows = []
        for line in reader:
            if len(line) < 2 or not line[0].strip() or not line[1].strip():
                continue
            rows.append(
                {
                    "date": line[0].strip(),
                    "provider": "LUMINOR",
                    "fund": fund,
                    "unit_value": float(line[1].replace(",", ".")),
                    "net_assets": None,
                    "benchmark_index": None,
                }
            )
    rows.sort(key=lambda r: r["date"])
    return rows


def main() -> int:
    files = sorted(IMPORT_DIR.glob("*.csv"))
    if not files:
        print(f"Nerasta failų: {IMPORT_DIR}")
        return 1
    for path in files:
        rows = parse(path)
        changed = store.upsert(rows)
        dates = [date.fromisoformat(r["date"]) for r in rows]
        max_gap = max((b - a).days for a, b in zip(dates, dates[1:])) if len(dates) > 1 else 0
        print(
            f"{rows[0]['fund']}: {len(rows)} eil. ({rows[0]['date']} → {rows[-1]['date']}), "
            f"nauja/pakeista: {changed}, didžiausia spraga: {max_gap} d."
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
