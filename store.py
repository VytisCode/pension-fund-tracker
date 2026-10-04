#!/usr/bin/env python3
"""
Vieninga istorijos saugykla: data/nav_history.csv

Kiekviena eilutė = vieno fondo viena diena:
    date, provider, fund, unit_value, net_assets

Naujos eilutės įrašomos taip, kad ta pati (date, fund) pora niekada nesidubliuotų.
"""
import csv
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data" / "nav_history.csv"
COLUMNS = ["date", "provider", "fund", "unit_value", "net_assets", "benchmark_index"]


def load(path: Path = DATA_FILE) -> dict:
    """Return {(date, fund): row_dict}."""
    rows = {}
    if not path.exists():
        return rows
    with path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            rows[(row["date"], row["fund"])] = row
    return rows


def upsert(new_rows: list, path: Path = DATA_FILE) -> int:
    """Add or update rows. Returns how many rows are new or changed."""
    rows = load(path)
    changed = 0
    for item in new_rows:
        row = {column: "" if item.get(column) is None else str(item[column]) for column in COLUMNS}
        key = (row["date"], row["fund"])
        if rows.get(key) != row:
            rows[key] = row
            changed += 1

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=COLUMNS)
        writer.writeheader()
        for key in sorted(rows, key=lambda k: (k[1], k[0])):
            writer.writerow(rows[key])
    return changed
