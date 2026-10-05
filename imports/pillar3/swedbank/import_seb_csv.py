#!/usr/bin/env python3
"""
Importuoja SEB istorinių vieneto verčių CSV failus (atsisiųstus iš SEB interneto banko)
iš imports/seb/ į data/nav_history.csv.

SEB failo formatas: kabliataškiais atskirti stulpeliai, kablelis kaip dešimtainis ženklas:
    Data;Vieneto vertė;Grynųjų aktyvų vertė;Lyginamasis indeksas;

Fondo pavadinimas imamas iš failo pavadinimo (metų intervalas arba žodis „turto").
Grynųjų aktyvų reikšmė 0 laikoma trūkstamais duomenimis (paliekama tuščia).
Pakartotinis paleidimas saugus: tos pačios (data, fondas) eilutės nesidubliuoja.
"""
import re
import sys
from datetime import date
from pathlib import Path

import store

IMPORT_DIR = Path(__file__).parent / "imports" / "seb"


def fund_name(path: Path) -> str:
    years = re.search(r"(\d{4})-(\d{4})", path.stem)
    if years:
        return f"SEB pensija {years.group(1)}-{years.group(2)}"
    if "turto" in path.stem.lower():
        return "SEB turto išsaugojimo fondas"
    raise ValueError(f"Nepavyko nustatyti fondo pagal failo pavadinimą: {path.name}")


def number(text: str):
    text = text.strip().replace(",", ".")
    return float(text) if text else None


def parse(path: Path) -> list:
    name = fund_name(path)
    rows = []
    for line in path.read_text(encoding="utf-8-sig").splitlines()[1:]:
        parts = [part.strip() for part in line.split(";")]
        if len(parts) < 2 or not parts[0]:
            continue
        unit_value = number(parts[1])
        if unit_value is None:
            continue
        assets = number(parts[2]) if len(parts) > 2 else None
        benchmark = number(parts[3]) if len(parts) > 3 else None
        rows.append(
            {
                "date": parts[0],
                "provider": "SEB",
                "fund": name,
                "unit_value": unit_value,
                "net_assets": int(assets) if assets else None,
                "benchmark_index": benchmark,
            }
        )
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
        missing_assets = sum(1 for r in rows if r["net_assets"] is None)
        print(
            f"{rows[0]['fund']}: {len(rows)} eil. ({rows[0]['date']} → {rows[-1]['date']}), "
            f"nauja/pakeista: {changed}, didžiausia spraga: {max_gap} d., "
            f"be aktyvų: {missing_assets}"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
