#!/usr/bin/env python3
"""
„Kelias į pensiją“ polapio duomenys: imports/journey/*.csv -> docs/data_journey.js (žr. build_site.build_journey).

Lentelės (pildomos rankomis, kai paskelbiami nauji duomenys):
- sodra_dates.csv     – Sodros įmokų pervedimo į fondus datos (months = už kiek mėnesių pervesta: 3 = ketvirtinė įmoka);
- rates.csv           – įmokų tarifai % nuo datos (Sodra, valstybė, dalyvis; dalyvio laipsniškas tarifas 2019–2023);
- state_incentive.csv – valstybės paskata € per mėnesį nuo 2019 m. (max = dalyvis moka 3 %, min = laipsniškai didina);
- wages.csv           – vidutinis mėnesinis darbo užmokestis (bruto, neto), osp.stat.gov.lt;
- pensions.csv        – vidutinė senatvės pensija, osp.stat.gov.lt (nuo 2025 m. – S3R892 ketvirčių vidurkis, prideda tools/fetch_pension.py);
- cpi.csv             – vartotojų kainų indeksas (VKI, 2025 = 100) pagal mėnesį, Valstybės duomenų agentūra
                        (osp-rs.stat.gov.lt, S7R330_M2020121_2, CP00); naujus mėnesius prideda tools/fetch_cpi.py;
- min_wage.csv        – minimali mėnesinė alga, metų vidurkis (bruto ir neto – osp.stat.gov.lt; neto skelbiamas nuo 2010 m.).
II pakopos fondų vieneto vertės imamos iš docs/data.js, III pakopos – iš docs/data3.js (žr. build_site.build_journey).
"""
import csv
import re
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "imports" / "journey"

# Sodros pensijų anuitetas – tikslūs Sodros anuitetų skaičiuoklės (sodra.lt/skaiciuokles/pensiju-anuitetu-skaiciuokle) rezultatai,
# kuriuos savininkas gavo 2026-10-09: gimimo data 1961-10-09, prašymo data 2026-10-09 (lygiai 65 m.), sukaupta suma 20 000 000 €
# (didelė suma, kad būtų matyti visi skaitmenys; tas pats santykis gaunamas ir su 20 000 € – 79,47 €).
# Skaičiuoklė jau įvertina 2,5 % administravimo mokestį, 1 % grąžą ir Sodros mirtingumo lentelę, todėl rezultatai naudojami tiesiogiai:
# išmoka = sukaupta suma ÷ 1000 × koeficientas. Skaičiuoklė už Cloudflare apsaugos, todėl kasmet (pasikeitus sąlygoms) – patikrinti ranka.
ANNUITY = {
    "age": 65, "guar_to": 85,
    "calc": {"date": "2026-10-09", "birth": "1961-10-09", "amount": 20_000_000,
             "std": 79469.72, "inh": 71890.52, "def_pkb": 65430.96, "def_sodra": 65436.91, "pkb_part": 15638000.00},
    "year": 2026,                                                # kurių metų Sodros sąlygos (ribos, skaičiuoklė) – kasmet patikrinti
    "lump_max": 16785, "free_above": 83926,                      # 2026 m. ribos: iki – galima vienkartinė išmoka; virš – perviršį galima atsiimti
}


def _annuity_factors(a=ANNUITY):
    """€ per mėnesį už 1000 € sukauptos sumos pagal Sodros skaičiuoklę: standartinis, paveldimas (iki 85 m.),
    atidėtasis (pensijų kaupimo bendrovės periodinės išmokos iki 85 m. + Sodros anuitetas nuo 85 m.)."""
    c = a["calc"]
    k = 1000 / c["amount"]
    return {"std": c["std"] * k, "inh": c["inh"] * k, "defPer": c["def_pkb"] * k, "defAnn": c["def_sodra"] * k,
            "deferred_share65": 1 - c["pkb_part"] / c["amount"]}


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
        "pensionsQ": {r["year"]: int(m.group(1)) for r in _rows("pensions.csv") if (m := re.search(r"\((\d) ketv\.\)", r["source"]))},
        "cpi": {r["month"]: _f(r["cpi"]) for r in _rows("cpi.csv")},
        "minWage": {r["year"]: [_f(r["gross"]), _f(r["net"])] for r in _rows("min_wage.csv")},
        "annuity": round(_annuity_factors()["std"], 4),
        "fresh": freshness(),
        "annuityModel": {**{k: round(v, 6) for k, v in _annuity_factors().items()}, **{k: ANNUITY[k] for k in ("age", "guar_to", "lump_max", "free_above", "calc")}},
    }


def _add_months(y, m, n):
    k = y * 12 + m - 1 + n
    return date(k // 12, k % 12 + 1, 1)


def freshness() -> list:
    """Kiekvieno pradinio duomenų šaltinio šviežumas: paskutinis turimas laikotarpis ir data, iki kurios turėtų būti naujas.
    Jei šiandien vėliau nei „due“, duomenys laikomi pasenusiais (puslapis rodo priminimą, kasdienė ataskaita kartą per mėnesį).
    auto = atnaujinama automatiškai (jei pasenę – automatinis atnaujinimas nepavyko); kitaip – atnaujinama rankiniu būdu."""
    out = []

    def add(key, lt, en, last, due, auto, url):
        out.append({"key": key, "lt": lt, "en": en, "last": last, "due": due.isoformat(), "auto": auto, "url": url})

    cpi = max(r["month"] for r in _rows("cpi.csv"))                  # mėnuo M skelbiamas ~M+2 vidury
    y, m = map(int, cpi.split("-"))
    add("cpi", "Vartotojų kainų indeksas (VKI)", "Consumer price index (CPI)", cpi, _add_months(y, m, 2) + timedelta(days=20), True,
        "https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai")
    pen = _rows("pensions.csv")[-1]                                   # ketvirtis skelbiamas ~2 mėn. po pabaigos; kito laukiama iki jo pabaigos + 2 mėn.
    q = int(m.group(1)) if (m := re.search(r"\((\d) ketv\.\)", pen["source"])) else 4
    add("pensions", "Vidutinė senatvės pensija", "Average old-age pension", f"{pen['year']} K{q}",
        _add_months(int(pen["year"]), 3 * q, 6), True, "https://www.sodra.lt/statistika/pagrindiniai-socialiniai-rodikliai")
    wy = max(int(r["year"]) for r in _rows("wages.csv"))                # metų vidurkis skelbiamas kitų metų kovą
    add("wages", "Vidutinis darbo užmokestis (bruto, neto)", "Average salary (gross, net)", str(wy), date(wy + 2, 4, 15), False,
        "https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai")
    mw = _rows("min_wage.csv")
    my = max(int(r["year"]) for r in mw)                                # kitų metų MMA žinoma iki sausio
    add("min_wage", "Minimali mėnesinė alga (MMA)", "Minimum monthly wage", str(my), date(my + 1, 1, 31), False,
        "https://socmin.lrv.lt/")
    mn = max(int(r["year"]) for r in mw if r["net"])
    add("min_wage_net", "MMA neto (metų vidurkis)", "Minimum wage, net (annual average)", str(mn), date(mn + 2, 4, 15), False,
        "https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai")
    iy = max(int(r["year"]) for r in _rows("state_incentive.csv"))     # paskata metams žinoma iki sausio pabaigos
    add("incentive", "Valstybės paskata (II pakopa)", "State incentive (II pillar)", str(iy), date(iy + 1, 1, 31), False,
        "https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija")
    ry = max(int(r["from"][:4]) for r in _rows("rates.csv"))
    add("rates", "Įmokų tarifai", "Contribution rates", str(ry), date(ry + 1, 1, 31), False,
        "https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija")
    sd = max(r["date"] for r in _rows("sodra_dates.csv"))              # naujas grafikas reikalingas prieš baigiantis senajam
    add("sodra_dates", "Sodros pervedimų į fondus grafikas", "Sodra transfer schedule", sd, date.fromisoformat(sd) - timedelta(days=30), False,
        "https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija")
    add("annuity", "Sodros anuiteto sąlygos ir ribos", "Sodra annuity conditions and limits", str(ANNUITY["year"]), date(ANNUITY["year"] + 1, 1, 31), False,
        "https://www.sodra.lt/skaiciuokles/pensiju-anuitetu-skaiciuokle")
    idx = ROOT / "data" / "indexes.csv"
    if idx.exists():
        with idx.open(encoding="utf-8") as f:
            last = max(line[:10] for line in f if line[:4].isdigit())
        add("indexes", "Pasaulio akcijų indeksai", "World equity indexes", last, date.fromisoformat(last) + timedelta(days=7), True,
            "https://www.msci.com/indexes")
    return out


def stale(today: date | None = None) -> list:
    t = (today or date.today()).isoformat()
    return [f for f in freshness() if f["due"] < t]


if __name__ == "__main__":
    p = build()
    print({k: len(v) if hasattr(v, "__len__") else v for k, v in p.items()})
