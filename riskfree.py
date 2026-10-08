#!/usr/bin/env python3
"""
Nerizikinga palūkanų norma Sharpe koeficientui: ECB skelbiama euro trumpalaikių palūkanų norma €STR
(standartinė nerizikinga norma EUR investuotojams). Imama per svetainės generavimą (build_site.py);
jei ECB nepasiekiamas, naudojama paskutinė išsaugota reikšmė (data/risk_free.json), o jei jos nėra – None.
"""
import csv
import io
import json
import urllib.request
from pathlib import Path

import fund_links

CACHE = Path(__file__).parent / "data" / "risk_free.json"


def parse(text: str):
    """ECB „csvdata“ atsakymas → {"value": % per metus, "date": "YYYY-MM-DD"} arba None."""
    rows = [r for r in csv.DictReader(io.StringIO(text)) if r.get("OBS_VALUE") and r.get("TIME_PERIOD")]
    if not rows:
        return None
    last = max(rows, key=lambda r: r["TIME_PERIOD"])
    value = float(last["OBS_VALUE"])
    if not -2 < value < 15:          # neįtikėtina reikšmė – nenaudojame
        return None
    return {"value": round(value, 3), "date": last["TIME_PERIOD"][:10]}


def fetch(timeout: int = 15):
    try:
        req = urllib.request.Request(fund_links.ECB_ESTR_API, headers={"Accept": "text/csv", "User-Agent": "pension-fund-tracker"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return parse(resp.read().decode("utf-8"))
    except Exception as exc:          # svetainės generavimas dėl to niekada nesustoja
        print(f"€STR: nepavyko gauti iš ECB ({exc.__class__.__name__}: {exc})")
        return None


def current():
    """Šviežia €STR reikšmė arba paskutinė išsaugota; prideda šaltinio nuorodą."""
    value = fetch()
    if value:
        CACHE.write_text(json.dumps(value, ensure_ascii=False) + "\n", encoding="utf-8")
    elif CACHE.exists():
        value = json.loads(CACHE.read_text(encoding="utf-8"))
    if value:
        value["source"] = fund_links.ECB_ESTR_PAGE
    return value


if __name__ == "__main__":
    print(current())
