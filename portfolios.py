#!/usr/bin/env python3
"""
Lietuvos banko ketvirtinių pensijų fondų portfelių ataskaitų (xlsx) sujungimas į vieną lentelę.

Šaltinis: imports/lb_portfolios/pf-portfeliai-YYYYMMDD.xlsx (viešos LB ataskaitos, po vieną failą
kiekvienam ketvirčiui). Rezultatas: data/portfolios.csv – viena eilutė = viena fondo pozicija ketvirčio pabaigoje.

Paleidimas: python3 portfolios.py  (atsiradus naujam ketvirčio failui – įdėti jį į imports/lb_portfolios/ ir paleisti iš naujo).
"""
import csv
import re
from collections import Counter, defaultdict
from pathlib import Path

import openpyxl

ROOT = Path(__file__).parent
SRC = ROOT / "imports" / "lb_portfolios"
OUT = ROOT / "data" / "portfolios.csv"

# II pakopos fondų kodų pradžia → valdytojas (kodai nesikeičia, nors bendrovių pavadinimai keitėsi: INVL → Artea, Aviva → Allianz)
CODE_PROVIDER = {"AVI": "Allianz", "GOX": "Goindex", "INV": "Artea", "LMN": "Luminor", "SBN": "SEB", "SWD": "Swedbank"}
# III pakopos fondams valdytojas nustatomas iš bendrovės pavadinimo (tvarka svarbi: „SEB“ prieš „SB Asset“)
NAME_PROVIDER = [("Allianz", "Allianz"), ("Aviva", "Allianz"), ("Goindex", "Goindex"), ("SEB", "SEB"),
                 ("Swedbank", "Swedbank"), ("Luminor", "Luminor"), ("INVL", "Artea"), ("Artea", "Artea"),
                 ("SB Asset", "Artea")]

# lapas → (tipas, stulpeliai: id, šalis, pavadinimas, valiuta, kiekis, vertė, KIS tipas)
SHEETS = {
    "Nuosavybės VP": ("equity", dict(id=4, country=5, name=6, cur=7, qty=8, value=9)),
    "Skolos VP": ("bond", dict(id=4, country=5, name=6, cur=7, qty=8, value=9)),
    "Pinigai, indėliai": ("cash", dict(id=4, country=5, name=6, cur=7, value=8)),
    "KIS": ("fund", dict(id=4, country=5, name=6, mgr=7, kis=8, cur=9, qty=10, value=11)),
    "Išvestinės FP": ("derivative", dict(id=4, country=5, cur=6, name=8, value=9)),
}
FIELDS = ["date", "pillar", "provider", "fund_code", "fund_name", "type", "pos_id", "name", "country",
          "currency", "kis_type", "qty", "value"]


def provider_of(code: str, company: str) -> str:
    if code[:3] in CODE_PROVIDER:
        return CODE_PROVIDER[code[:3]]
    for key, prov in NAME_PROVIDER:
        if key in company:
            return prov
    raise ValueError(f"Nežinomas valdytojas: {company} ({code})")


def num(v):
    if v is None or v == "":
        return None
    if isinstance(v, (int, float)):
        return float(v)
    return float(str(v).replace(" ", "").replace(",", "."))


def clean(v) -> str:
    return re.sub(r"\s+", " ", str(v or "")).strip()


def read_quarter(path: Path):
    date = re.search(r"(\d{4})(\d{2})(\d{2})", path.name).groups()
    date = "-".join(date)
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    rows = []
    for sheet, (kind, col) in SHEETS.items():
        for r in wb[sheet].iter_rows(min_row=2, values_only=True):
            group = clean(r[0])
            if not group.endswith("fondas") or not r[3]:
                continue  # išnašos lapo apačioje
            code = clean(r[3])
            value = num(r[col["value"]])
            if value is None:
                continue
            name = clean(r[col["name"]])
            raw_id = clean(r[col["id"]])
            if kind == "cash":
                pos_id = f"CASH:{raw_id or 'A'}:{name}"  # A – pinigai, B – indėlis
                name = ("Indėlis: " if raw_id == "B" else "Pinigai: ") + name
            elif kind == "derivative":
                pos_id = f"DER:{clean(r[col['cur']])}"  # išvestinės (dažniausiai valiutos forvardai) sumuojamos pagal valiutą
                name = f"Išvestinės FP ({clean(r[col['cur']])})"
            else:
                pos_id = raw_id or f"NOISIN:{name}"
            rows.append({
                "date": date,
                "pillar": "II" if group.startswith("II ") else "III",
                "provider": provider_of(code, clean(r[1])),
                "fund_code": code,
                "fund_name": clean(r[2]),
                "type": kind,
                "pos_id": pos_id,
                "name": name,
                "country": clean(r[col["country"]]),
                "currency": clean(r[col["cur"]]),
                "kis_type": clean(r[col["kis"]]).replace("KIS ", "") if "kis" in col else "",
                "qty": num(r[col["qty"]]) if "qty" in col else None,
                "value": value,
            })
    # Ta pati pozicija tame pačiame fonde gali būti kelis kartus (pvz. keli forvardai) – sumuojama
    merged = {}
    for row in rows:
        key = (row["fund_code"], row["pos_id"])
        if key in merged:
            m = merged[key]
            m["value"] += row["value"]
            if row["qty"] is not None:
                m["qty"] = (m["qty"] or 0) + row["qty"]
        else:
            merged[key] = row
    return list(merged.values())


def main() -> None:
    files = sorted(SRC.glob("pf-portfeliai-*.xlsx"))
    rows = []
    for f in files:
        q = read_quarter(f)
        print(f"{f.name}: {len(q)} pozicijų, {len({r['fund_code'] for r in q})} fondų, "
              f"{sum(r['value'] for r in q) / 1e9:.2f} mlrd. Eur")
        rows += q
    OUT.parent.mkdir(exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for r in sorted(rows, key=lambda r: (r["date"], r["fund_code"], r["type"], r["pos_id"])):
            w.writerow({**r, "qty": "" if r["qty"] is None else f"{r['qty']:.4f}".rstrip("0").rstrip("."),
                        "value": f"{r['value']:.2f}"})
    print(f"Įrašyta {len(rows)} eilučių į {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
