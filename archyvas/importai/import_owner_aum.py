#!/usr/bin/env python3
"""
Papildo tuščius II pakopos net_assets laukus savininko rankomis surinktais kasdieniais grynaisiais aktyvais
(imports/assets/owner_aum_*.tsv, nuo 2026-03-23; po 9 stulpelius kiekvienam valdytojui:
Payout = turto išsaugojimo fondas, 1961 … 2003 = gyvenimo ciklo fondai, Total).
Esamų reikšmių neperrašo ir naujų eilučių nekuria: papildo tik jau esančias (data, fondas) eilutes.
Patikros: kiekvienos dienos fondų suma turi atitikti stulpelį Total; reikšmė praleidžiama, jei ji yra
pavienis šuolis (nukrypsta > 2 % nuo abiejų kaimyninių dienų, kurios tarpusavyje sutampa, įvertinus vieneto vertę),
pvz. per klaidą nukopijuota kito fondo reikšmė; valdytojo dienos eilutė praleidžiama visa, jei ji tiksliai
pasikartoja kitą dieną (nukopijuota eilutė).
"""
import re
import sys
from pathlib import Path

import store

SRC = sorted((Path(__file__).parent / "imports" / "assets").glob("owner_aum_*.tsv"))
PROVIDER = {"SEB": "SEB", "SWED": "SWEDBANK", "SB": "ARTEA", "Allianz": "ALLIANZ", "Luminor": "LUMINOR", "Goindex": "GOINDEX"}


def number(text: str):
    text = text.strip()
    if not text:
        return None
    if not re.fullmatch(r"\d{1,3}(\.\d{3})*(,\d+)?", text):
        raise ValueError(f"netikėtas skaičius: {text!r}")
    return float(text.replace(".", "").replace(",", "."))


def fund_of(funds_by_provider: dict, provider: str, column: str):
    for fund in funds_by_provider.get(provider, []):
        if column == "Payout" and "turto" in fund.lower():
            return fund
        if column.isdigit() and re.search(rf"{column}\s*[-–]\s*\d{{4}}", fund):
            return fund
    return None


def read(path: Path):
    """[(data, tiekėjas, stulpelis, reikšmė)] ir dienų sumų patikros klaidos"""
    lines = [l.split("\t") for l in path.read_text(encoding="utf-8").splitlines() if l.strip()]
    providers, columns = lines[0], lines[1]
    blocks, current = [], None
    for i, (p, c) in enumerate(zip(providers, columns)):
        if p.strip():
            current = PROVIDER[p.strip()]
        if i and c.strip():
            blocks.append((i, current, c.strip()))
    out, problems = [], []
    for cells in lines[2:]:
        day = cells[0].strip().replace(".", "-")
        sums, totals = {}, {}
        for i, prov, col in blocks:
            v = number(cells[i]) if i < len(cells) else None
            if v is None:
                continue
            if col == "Total":
                totals[prov] = v
            else:
                sums[prov] = sums.get(prov, 0) + v
                out.append((day, prov, col, v))
        for prov, t in totals.items():
            if prov in sums and abs(sums[prov] - t) > max(10, t * 1e-6):
                problems.append(f"{day} {prov}: fondų suma {sums[prov]:,.0f} ≠ Total {t:,.0f}")
    # nukopijuotos eilutės: tos pačios valdytojo reikšmės skirtingomis dienomis
    rows = {}
    for day, prov, col, v in out:
        rows.setdefault((day, prov), []).append(v)
    seen = {}
    for (day, prov), vals in rows.items():
        seen.setdefault((prov, tuple(vals)), []).append(day)
    copied = {(d, prov) for (prov, _), days in seen.items() if len(days) > 1 for d in days}
    for day, prov in sorted(copied):
        problems.append(f"{day} {prov}: eilutė pasikartoja kitą dieną, praleista")
    out = [x for x in out if (x[0], x[1]) not in copied]
    return out, problems


def drop_outliers(existing: dict, updates: list):
    new = {(u["date"], u["fund"]): u for u in updates}
    series = {}
    for key, row in list(existing.items()) + list(new.items()):
        a = row.get("net_assets")
        if a and row.get("unit_value"):
            series.setdefault(key[1], {})[key[0]] = (float(row["unit_value"]), float(a))
    bad = set()
    for fund, by_day in series.items():
        days = sorted(by_day)
        for prev, day, nxt in zip(days, days[1:], days[2:]):
            if (day, fund) not in new:
                continue
            (u0, a0), (u1, a1), (u2, a2) = by_day[prev], by_day[day], by_day[nxt]
            expect = a0 * u1 / u0                # turtas, jei nebūtų srautų
            neighbours_agree = abs(a2 / (a0 * u2 / u0) - 1) < 0.02
            if neighbours_agree and abs(a1 / expect - 1) > 0.02:
                bad.add((day, fund))
    kept = [u for u in updates if (u["date"], u["fund"]) not in bad]
    return kept, sorted(bad)


def main() -> int:
    existing = store.load()
    funds_by_provider = {}
    for (_, fund), row in existing.items():
        funds_by_provider.setdefault(row["provider"], set()).add(fund)
    funds_by_provider = {p: sorted(f) for p, f in funds_by_provider.items()}
    updates, filled, same, differ, missing = [], {}, 0, [], 0
    for path in SRC:
        values, problems = read(path)
        for p in problems:
            print("PATIKRA:", p)
        for day, prov, col, v in values:
            fund = fund_of(funds_by_provider, prov, col)
            row = existing.get((day, fund)) if fund else None
            if not row:
                missing += 1
                continue
            if row.get("net_assets"):
                old = float(row["net_assets"])
                if abs(old - v) <= max(1, old * 1e-4):
                    same += 1
                else:
                    differ.append((day, fund, old, v))
                continue
            updates.append({**row, "net_assets": round(v)})
            filled[fund] = filled.get(fund, 0) + 1
    updates, outliers = drop_outliers(existing, updates)
    for o in outliers:
        print("PRALEISTA (pavienis šuolis):", o)
    changed = store.upsert(updates)
    for fund, n in sorted(filled.items()):
        print(f"{fund}: užpildyta {n}")
    print(f"Sutampa su esamomis: {same}; skiriasi (paliktos esamos): {len(differ)}; be eilutės saugykloje: {missing}")
    for d in differ[:20]:
        print("  skiriasi:", d)
    print(f"Iš viso pakeista: {changed}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
