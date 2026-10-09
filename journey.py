#!/usr/bin/env python3
"""
„Kelias į pensiją“ polapio duomenys: imports/journey/*.csv -> docs/data_journey.js (žr. build_site.build_journey).

Lentelės (pildomos rankomis, kai paskelbiami nauji duomenys):
- sodra_dates.csv     – Sodros įmokų pervedimo į fondus datos (months = už kiek mėnesių pervesta: 3 = ketvirtinė įmoka);
- rates.csv           – įmokų tarifai % nuo datos (Sodra, valstybė, dalyvis; dalyvio laipsniškas tarifas 2019–2023);
- state_incentive.csv – valstybės paskata € per mėnesį nuo 2019 m. (max = dalyvis moka 3 %, min = laipsniškai didina);
- wages.csv           – vidutinis mėnesinis darbo užmokestis (bruto, neto), osp.stat.gov.lt;
- pensions.csv        – vidutinė senatvės pensija, osp.stat.gov.lt;
- cpi.csv             – vartotojų kainų indeksas (VKI) pagal mėnesį;
- min_wage.csv        – minimali mėnesinė alga (bruto – Eurostat, neto nuo 2019 m. – apskaičiuota).
II pakopos fondų vieneto vertės imamos iš docs/data.js, III pakopos – iš docs/data3.js (žr. build_site.build_journey).
"""
import csv
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "imports" / "journey"

ANNUITY_PER_1000 = 4.8090   # LB bazinio pensijų anuiteto dydis: € per mėnesį už 1000 € (nuo 65 m.)


def _rows(name):
    with (SRC / name).open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def _f(x):
    return float(x) if x not in (None, "") else None


def build() -> dict:
    return {
        "dates": [[r["date"], int(r["months"])] for r in _rows("sodra_dates.csv")],
        "rates": [[r["from"], _f(r["sodra_pct"]), _f(r["state_pct"]), _f(r["participant_pct"]), _f(r["participant_gradual_pct"])] for r in _rows("rates.csv")],
        "incentive": {r["year"]: [_f(r["max_eur"]), _f(r["min_eur"])] for r in _rows("state_incentive.csv")},
        "wages": {r["year"]: [_f(r["gross"]), _f(r["net"])] for r in _rows("wages.csv")},
        "pensions": {r["year"]: _f(r["avg_old_age_pension"]) for r in _rows("pensions.csv")},
        "cpi": {r["month"]: _f(r["cpi"]) for r in _rows("cpi.csv")},
        "minWage": [[r["from"], _f(r["gross"]), _f(r["net"])] for r in _rows("min_wage.csv")],
        "annuity": ANNUITY_PER_1000,
    }


if __name__ == "__main__":
    p = build()
    print({k: len(v) if hasattr(v, "__len__") else v for k, v in p.items()})
