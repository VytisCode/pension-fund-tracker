#!/usr/bin/env python3
"""
Importuoja Swedbank istorinių verčių PDF failus (atspausdintus iš Swedbank interneto banko,
laikotarpis „All") iš imports/swedbank/ į data/nav_history.csv.

PDF turi tikrą tekstą; eilutės: „YYYY-MM-DD  vertė". Reikalingas `pdftotext` (poppler).
Failuose nėra grynųjų aktyvų, todėl net_assets paliekamas tuščias.
Reikšmė 1 pirmą dieną (fondo pradžia) paliekama kaip yra.
Pakartotinis paleidimas saugus.
"""
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

import store

IMPORT_DIR = Path(__file__).parent / "imports" / "swedbank"
ROW = re.compile(r"^\s*(\d{4}-\d{2}-\d{2})\s+(\d+(?:[.,]\d+)?)\s*$")


def fund_name(path: Path) -> str:
    years = re.search(r"(\d{4})", path.stem)
    if "turto" in path.stem.lower():
        return "Swedbank turto išsaugojimo pensijų fondas"
    if years:
        start = int(years.group(1))
        ends = {1961: 1967, 1968: 1974, 1975: 1981, 1982: 1988, 1989: 1995, 1996: 2002, 2003: 2009}
        return f"Swedbank pensija {start}-{ends[start]}"
    raise ValueError(path.name)


def parse(path: Path) -> list:
    text = subprocess.run(["pdftotext", "-layout", str(path), "-"], capture_output=True,
                          text=True, check=True).stdout
    rows = {}
    for line in text.splitlines():
        m = ROW.match(line)
        if m:
            rows[m.group(1)] = float(m.group(2).replace(",", "."))
    name = fund_name(path)
    return [{"date": d, "provider": "SWEDBANK", "fund": name, "unit_value": v,
             "net_assets": None, "benchmark_index": None} for d, v in sorted(rows.items())]


def main() -> int:
    files = sorted(IMPORT_DIR.glob("*.pdf"))
    if not files:
        print(f"Nerasta failų: {IMPORT_DIR}")
        return 1
    for path in files:
        rows = parse(path)
        changed = store.upsert(rows)
        dates = [date.fromisoformat(r["date"]) for r in rows]
        max_gap = max((b - a).days for a, b in zip(dates, dates[1:]))
        print(f"{rows[0]['fund']}: {len(rows)} eil. ({rows[0]['date']} → {rows[-1]['date']}), "
              f"nauja/pakeista: {changed}, didžiausia spraga: {max_gap} d.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
