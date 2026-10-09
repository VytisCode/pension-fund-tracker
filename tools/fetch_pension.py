#!/usr/bin/env python3
"""
Vidutinė senatvės pensija iš Valstybės duomenų agentūros -> imports/journey/pensions.csv.

Šaltinis: osp-rs.stat.gov.lt SDMX rinkinys S3R892_M3160409 („Vidutinė valstybinio socialinio draudimo senatvės pensija
(ketvirtiniai duomenys)“, ~30 KB). Metų reikšmė = paskelbtų ketvirčių vidurkis (2018–2024 m. sutampa su metų duomenimis ±0,05 €).
Užbaigti metai (4 ketvirčiai) neperrašomi; einamieji metai atnaujinami, kai paskelbiamas naujas ketvirtis
(šaltinio stulpelyje nurodoma, kiek ketvirčių įskaičiuota). Neįtikėtinas pokytis (> 25 % per metus) atmetamas.
"""
import csv
import re
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "imports" / "journey" / "pensions.csv"
URL = "https://osp-rs.stat.gov.lt/rest_xml/data/S3R892_M3160409"
FIRST = 2018


def parse(text: str) -> dict:
    q = defaultdict(list)
    for y, k, v in re.findall(r'LAIKOTARPIS" value="(\d{4})K(\d)".*?ObsValue value="([^"]+)"', text, re.S):
        q[int(y)].append(float(v))
    return {y: (sum(v) / len(v), len(v)) for y, v in q.items() if y >= FIRST}


def read():
    with OUT.open(encoding="utf-8", newline="") as f:
        return {int(r["year"]): (r["avg_old_age_pension"], r["source"]) for r in csv.DictReader(f)}


def main():
    have = read()
    req = urllib.request.Request(URL, headers={"User-Agent": "pension-fund-tracker"})
    with urllib.request.urlopen(req, timeout=120) as r:
        new = parse(r.read().decode("utf-8"))
    changed = 0
    for y in sorted(new):
        val, n = new[y]
        if y in have and "ketv." not in have[y][1]:
            continue                       # užbaigti metai neperrašomi
        prev = have.get(y - 1)
        if prev and abs(val / float(prev[0]) - 1) > 0.25:
            print(f"Pensija {y}: neįtikėtinas pokytis {val:.2f} vs {prev[0]} – praleidžiama")
            break
        src = "osp.stat.gov.lt S3R892" + ("" if n == 4 else f" ({n} ketv.)")
        row = (f"{val:.2f}", src)
        if have.get(y) != row:
            have[y] = row
            changed += 1
    if changed:
        with OUT.open("w", encoding="utf-8", newline="") as f:
            w = csv.writer(f, lineterminator="\n")
            w.writerow(["year", "avg_old_age_pension", "source"])
            for y in sorted(have):
                w.writerow([y, *have[y]])
    print(f"Pensija: pakeista {changed} m., paskutiniai {max(have)} = {have[max(have)][0]} ({have[max(have)][1]})")


if __name__ == "__main__":
    main()
