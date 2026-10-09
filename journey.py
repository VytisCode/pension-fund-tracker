#!/usr/bin/env python3
"""
„Kelias į pensiją“ polapio duomenys: imports/journey/*.csv -> docs/data_journey.js (žr. build_site.build_journey).

Lentelės (pildomos rankomis, kai paskelbiami nauji duomenys):
- sodra_dates.csv     – Sodros įmokų pervedimo į fondus datos (months = už kiek mėnesių pervesta: 3 = ketvirtinė įmoka);
- rates.csv           – įmokų tarifai % nuo datos (Sodra, valstybė, dalyvis; dalyvio laipsniškas tarifas 2019–2023);
- state_incentive.csv – valstybės paskata € per mėnesį nuo 2019 m. (max = dalyvis moka 3 %, min = laipsniškai didina);
- wages.csv           – vidutinis mėnesinis darbo užmokestis (bruto, neto), osp.stat.gov.lt;
- pensions.csv        – vidutinė senatvės pensija, osp.stat.gov.lt;
- cpi.csv             – vartotojų kainų indeksas (VKI, 2015 = 100) pagal mėnesį, Valstybės duomenų agentūra (osp-rs.stat.gov.lt, S7R260);
                        nuo 2026-01 – VKI (2025 = 100, S7R330) × 1,5911 (2025 m. abiejų bazių santykis);
- min_wage.csv        – minimali mėnesinė alga, metų vidurkis (bruto ir neto – osp.stat.gov.lt; neto skelbiamas nuo 2010 m.).
II pakopos fondų vieneto vertės imamos iš docs/data.js, III pakopos – iš docs/data3.js (žr. build_site.build_journey).
"""
import csv
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "imports" / "journey"

# Sodros pensijų anuitetas (Pensijų anuitetų dydžių apskaičiavimo metodika, VSDF valdybos įsak. V-232, red. nuo 2026-01-01;
# prielaidos – Sodros vyr. aktuaro 2025 m. ataskaita, 2026-03-25 Nr. V-142):
# - investicijų grąža 1,00 % per metus, išmokos kas mėnesį;
# - iš sumokėtos sumos išskaičiuojamas 2,5 % administravimo mokestis;
# - mirtingumas: VSDF 2015–2019 m. lentelė, nuo 2026 m. 50 % moterų. Lentelė neskelbiama, todėl naudojamas Gompertz modelis,
#   suderintas su Sodros paskelbta tikėtina gyvenimo trukme 65 m.: vyrams 18,01, moterims 23,25 m. (su 40 % moterų gaunama 20,11 m. –
#   tiek pat, kiek ataskaitoje);
# - galiausiai suderinta su Sodros pavyzdžiu: 15 000 € -> 67,93 € per mėn. (standartinis anuitetas, 375 € mokestis).
ANNUITY = {
    "age": 65, "rate": 0.01, "fee": 0.025, "women": 0.5, "guar_to": 85,
    "men": (4.359445406036958e-05, 0.09), "wom": (4.528177910364305e-06, 0.11),
    "example": (15000, 67.93), "deferred_share65": 0.1544,     # atidėtojo anuiteto pirkimo dalis 65 m. (Sodros veiklos planas)
    "lump_max": 16785, "free_above": 83926,                      # 2026 m. ribos: iki – galima vienkartinė išmoka; virš – perviršį galima atsiimti
}


def _annuity_factors(a=ANNUITY):
    """€ per mėnesį už 1000 € sukauptos sumos: standartinis, paveldimas (iki 85 m.), atidėtasis (periodinės išmokos iki 85 m. + anuitetas nuo 85 m.)."""
    import math
    x, n = a["age"], 12 * 60
    v = (1 + a["rate"]) ** (-1 / 12)

    def surv(m):
        t = m / 12
        g = lambda ab: math.exp(-ab[0] / ab[1] * math.exp(ab[1] * x) * (math.exp(ab[1] * t) - 1))
        return (1 - a["women"]) * g(a["men"]) + a["women"] * g(a["wom"])
    std = sum(surv(k) * v ** k for k in range(1, n)) / 12
    g = (a["guar_to"] - x) * 12
    inh = sum(v ** k for k in range(1, g + 1)) / 12 + sum(surv(k) * v ** k for k in range(g + 1, n)) / 12
    dfr = sum(surv(k) * (1 + a["rate"]) ** (-(k - g) / 12) for k in range(g + 1, n)) / 12   # atidėjimo laikotarpiu garantuota grąža 0 %
    net = 1000 * (1 - a["fee"])
    cal = a["example"][1] / (a["example"][0] * (1 - a["fee"]) / std / 12)
    sh = a["deferred_share65"]
    return {"std": net / std / 12 * cal, "inh": net / inh / 12 * cal, "defPer": 1000 * (1 - sh) / g, "defAnn": net * sh / dfr / 12 * cal,
            "ax": std, "axInh": inh, "cal": cal, "uncal": net / std / 12}


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
        "minWage": {r["year"]: [_f(r["gross"]), _f(r["net"])] for r in _rows("min_wage.csv")},
        "annuity": round(_annuity_factors()["std"], 4),
        "annuityModel": {**{k: (round(v, 6) if isinstance(v, float) else v) for k, v in _annuity_factors().items()}, **{k: ANNUITY[k] for k in ("age", "rate", "fee", "women", "guar_to", "lump_max", "free_above", "example", "deferred_share65")}},
    }


if __name__ == "__main__":
    p = build()
    print({k: len(v) if hasattr(v, "__len__") else v for k, v in p.items()})
