#!/usr/bin/env python3
"""
Lietuvos banko skelbiami pensijų fondų mokesčiai -> data/fees.csv.

Šaltiniai (vieši LB failai, imports/lb_fees/):
- pf-ii-mokesciai-YYYY-MM-DD.xls – II pakopa: administravimo mokestis nuo turto (pastaba *: kai bendrovės valdomo
  pensijų fondų turto vidutinė metinė vertė didesnė nei 2,5 mlrd. Eur – 0,4 %, Goindex – 0,35 %);
- PF_III_mokesciai_YYYY-MM-DD.xlsx – III pakopa: taikomas valdymo mokestis nuo turto.
Paleidimas (reikia xlrd .xls failui): python3 import_lb_fees.py. Paleisti iš naujo, kai LB paskelbs naują failą.
"""
import csv
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).parent
SRC = ROOT / "imports" / "lb_fees"
OUT = ROOT / "data" / "fees.csv"
COMPANY = [("SEB", "SEB"), ("Artea", "ARTEA"), ("Swedbank", "SWEDBANK"), ("Luminor", "LUMINOR"), ("Allianz", "ALLIANZ"), ("Goindex", "GOINDEX")]
LARGE = {"GOINDEX": 0.35}           # pastaba *: kai bendrovės turtas > 2,5 mlrd. Eur
LARGE_DEFAULT = 0.40
# papildomi stulpeliai (proc.; tekstas, kai LB taip parašė): II – perėjimas į kitos bendrovės fondą kartą per metus (sw_co),
# į kitą tos pačios bendrovės fondą daugiau nei kartą per metus (sw_fund); III – maksimalus valdymo (fee_max), startinis,
# įmokų (taikomas/maks.), depozitoriumo ir kitų išlaidų maks., atsiėmimas (nenutraukiant/nutraukiant), perėjimai.
FIELDS = ["pillar", "provider", "fund", "group", "fee", "fee_large", "source", "sw_co", "sw_fund", "fee_max", "start", "contrib",
          "contrib_max", "depo_max", "other_max", "wd_keep", "wd_end", "sw_same", "sw_same2", "sw_co2"]


def provider_of(text, current):
    for key, pid in COMPANY:
        if key.lower() in str(text).lower():
            return pid
    return current


def group_of(name):
    m = re.search(r"(\d{4})\s*[-–]\s*(\d{4})", name)
    return f"{m.group(1)}-{m.group(2)}" if m else ("turto" if "TIPF" in name or "turto" in name.lower() else None)


def pct(v):
    """Skaičius (dalis) -> procentai tekstu; LB tekstas ('-', 'iki 0,5 %', '30 % [2]') -> be išnašos; '-' = netaikomas (0)."""
    if isinstance(v, (int, float)):
        return f"{v * 100:.4f}".rstrip("0").rstrip(".")
    t = re.sub(r"\s*\[\d+\]", "", str(v or "")).strip()
    return "0" if t in ("-", "") else t.replace("%", "").replace(",", ".").strip() if re.fullmatch(r"[\d,.]+\s*%", t) else t


def pillar2(path):
    import xlrd
    sh = xlrd.open_workbook(path).sheet_by_index(0)
    rows, prov = [], None
    for r in range(sh.nrows):
        vals = [v for v in sh.row_values(r)]
        texts = [str(v).strip() for v in vals if isinstance(v, str) and str(v).strip()]
        nums = [v for v in vals if isinstance(v, float)]
        if not texts:
            continue
        if len(texts) >= 2:          # pirmoji bendrovės eilutė: bendrovė + fondas
            prov = provider_of(texts[0], prov)
        name = texts[-1]
        g = group_of(name)
        if g and prov and len(nums) >= 4:
            fee = nums[-3] * 100
            rows.append({"pillar": "II", "provider": prov, "fund": name, "group": g, "fee": round(fee, 4),
                         "fee_large": round(min(fee, LARGE.get(prov, LARGE_DEFAULT)), 4) if g != "turto" else round(fee, 4),
                         "sw_co": pct(nums[-2]), "sw_fund": pct(nums[-1])})
    return rows


def pillar3(path):
    import pillar3 as p3
    ws = openpyxl.load_workbook(path, data_only=True).worksheets[0]
    rows, prov = [], None
    names = {n: (p, n) for p, n, *_ in p3.FUNDS}
    norm = lambda s: re.sub(r"[^a-z0-9+]", "", s.lower().replace("pensijos fondas", "pensijosfondas"))
    for r in ws.iter_rows(values_only=True):
        cells = list(r)
        if not any(cells):
            continue
        if cells[0]:
            prov = provider_of(cells[0], prov)
        name = str(cells[1] or "").strip()
        fee = cells[5] if len(cells) > 5 else None
        if not name or not isinstance(fee, (int, float)):
            continue
        clean = re.sub(r"\s*\[\d+\]\s*$", "", name).strip()
        match = next((n for n, (p, _) in names.items() if p == prov and norm(n).endswith(norm(clean).replace("seb", "", 0))), None)
        match = match or next((n for n, (p, _) in names.items() if p == prov and norm(clean) in norm(n)), None)
        c = cells + [None] * 16
        rows.append({"pillar": "III", "provider": prov, "fund": match or clean, "group": "", "fee": round(fee * 100, 4), "fee_large": round(fee * 100, 4),
                     "fee_max": pct(c[6]), "start": pct(c[2]), "contrib": pct(c[3]), "contrib_max": pct(c[4]), "depo_max": pct(c[7]),
                     "other_max": pct(c[8]), "wd_keep": "–" if "[5]" in str(c[9]) else pct(c[9]), "wd_end": pct(c[10]),
                     "sw_same": pct(c[11]), "sw_co": pct(c[12]), "sw_same2": pct(c[13]), "sw_co2": pct(c[14])})
    return rows


def main():
    f2 = sorted(SRC.glob("pf-ii-mokesciai-*.xls"))[-1]
    f3 = sorted(SRC.glob("PF_III_mokesciai_*.xlsx"))[-1]
    rows = [dict(r, source=f2.name) for r in pillar2(f2)] + [dict(r, source=f3.name) for r in pillar3(f3)]
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS, restval="")
        w.writeheader()
        w.writerows(rows)
    print(f"{OUT}: {len(rows)} eilučių")
    for r in rows:
        print(r["pillar"], r["provider"], r["group"], r["fund"], r["fee"], r["fee_large"])


if __name__ == "__main__":
    main()
