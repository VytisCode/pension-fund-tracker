#!/usr/bin/env python3
"""
Papildo tuščius net_assets laukus grynųjų aktyvų reikšmėmis iš esamo sekimo įrankio
chart_data.json (imports/assets/, apima 2026-06-02 → 2026-10-01 visiems tiekėjams).
Esamų reikšmių neperrašo; eilučių nekuria (tik papildo jau esančias (data, fondas) eilutes).
Paleisti iš naujo, kai atsiras daugiau eilučių (pvz. po Allianz importo).
"""
import json
import sys
from pathlib import Path

import store

SRC = sorted((Path(__file__).parent / "imports" / "assets").glob("chart_data_*.json"))[-1]


def norm(name: str) -> str:
    return name.replace("–", "-")


def our_name(provider: str, name: str) -> str:
    name = norm(name)
    if provider == "SWEDBANK":
        return "Swedbank turto išsaugojimo pensijų fondas" if name.startswith("Turto") \
            else "Swedbank " + name[0].lower() + name[1:]
    return name


def main() -> int:
    data = json.loads(SRC.read_text(encoding="utf-8"))
    existing = store.load()
    by_norm = {}
    for (d, fund), row in existing.items():
        by_norm.setdefault(norm(fund), []).append(fund)
    updates, per_fund = [], {}
    for f in data["funds"]:
        target = our_name(f["provider"], f["name"])
        match = by_norm.get(target)
        if not match:
            per_fund[target] = None
            continue
        fund = match[0]
        n = 0
        for d, v in f["assets"].items():
            row = existing.get((d, fund))
            if row and v and v > 0 and not row.get("net_assets"):
                updates.append({**row, "net_assets": round(v)})
                n += 1
        per_fund[fund] = n
    changed = store.upsert(updates)
    for k, v in per_fund.items():
        print(f"{k}: {'nėra eilučių saugykloje' if v is None else f'užpildyta {v}'}")
    print(f"Iš viso pakeista: {changed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
