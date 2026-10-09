#!/usr/bin/env python3
"""
Vartotojų kainų indeksas (VKI, 2025 m. = 100) iš Valstybės duomenų agentūros -> imports/journey/cpi.csv.

Šaltinis: osp-rs.stat.gov.lt SDMX rinkinys S7R330_M2020121_2 („Vartotojų kainų indeksai (2025 m. – 100)“), eilutė CP00 (visos prekės ir paslaugos).
Agentūra filtruoti neleidžia, todėl parsiunčiamas visas rinkinys (~60 MB), bet tik kai trūksta naujo mėnesio:
VKI skelbiamas kito mėnesio pradžioje, todėl tikrinama, ar turime praėjusio mėnesio reikšmę.
Pridedami tik nauji mėnesiai; neįtikėtinas pokytis (> 5 % per mėnesį) atmetamas.
"""
import csv
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "imports" / "journey" / "cpi.csv"
URL = "https://osp-rs.stat.gov.lt/rest_xml/data/S7R330_M2020121_2"


def parse(text: str) -> dict:
    out = {}
    for o in re.findall(r"<g:Obs>(.*?)</g:Obs>", text, re.S):
        if 'value="CP00"' not in o:
            continue
        p = re.search(r'LAIKOTARPIS" value="(\d{4})M(\d\d)', o)
        v = re.search(r'ObsValue value="([^"]+)"', o)
        if p and v:
            out[f"{p.group(1)}-{p.group(2)}"] = float(v.group(1))
    return out


def read():
    with OUT.open(encoding="utf-8", newline="") as f:
        return {r["month"]: float(r["cpi"]) for r in csv.DictReader(f)}


def write(rows: dict):
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(["month", "cpi"])
        for m in sorted(rows):
            w.writerow([m, f"{rows[m]:.4f}"])


def main():
    have = read()
    t = date.today()
    prev = f"{t.year - (t.month == 1)}-{(t.month - 2) % 12 + 1:02d}"
    if max(have) >= prev and "--force" not in sys.argv:
        print(f"VKI: jau turime iki {max(have)} – nieko nedarome.")
        return
    req = urllib.request.Request(URL, headers={"User-Agent": "pension-fund-tracker"})
    with urllib.request.urlopen(req, timeout=180) as r:
        new = parse(r.read().decode("utf-8"))
    added = 0
    for m in sorted(new):
        if m <= max(have):
            continue
        last = have[max(have)]
        if abs(new[m] / last - 1) > 0.05:
            print(f"VKI {m}: neįtikėtinas pokytis {new[m]} vs {last} – praleidžiama")
            break
        have[m] = new[m]
        added += 1
    if added:
        write(have)
    print(f"VKI: +{added} mėn., paskutinis {max(have)}")


if __name__ == "__main__":
    main()
