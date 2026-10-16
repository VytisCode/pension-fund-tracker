#!/usr/bin/env python3
"""
Nerizikinga palūkanų norma Sharpe koeficientui: ECB skelbiama euro trumpalaikių palūkanų norma €STR
(standartinė nerizikinga norma EUR investuotojams). Imama per svetainės generavimą (build_site.py);
jei ECB nepasiekiamas, naudojama paskutinė išsaugota reikšmė (data/risk_free.json), o jei jos nėra – None.

Sharpe koeficientui naudojama laikotarpio VIDUTINĖ €STR (ne paskutinė): monthly() grąžina mėnesių vidurkius
nuo 2018-12 (iki 2019-10 – EONIA − 0,085 p. p.), išsaugotus data/estr_monthly.json. Svetainė iš jų pagal dienas
apskaičiuoja kiekvieno laikotarpio vidurkį.
"""
import csv
import io
import json
import urllib.request
from pathlib import Path

import fund_links
import source_status

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


def _get(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"Accept": "text/csv", "User-Agent": "pension-fund-tracker"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8")


def daily_rows(text: str, shift: float = 0.0) -> dict:
    """ECB „csvdata“ → {"YYYY-MM-DD": % per metus}; neįtikėtinos reikšmės praleidžiamos."""
    out = {}
    for r in csv.DictReader(io.StringIO(text)):
        d, v = (r.get("TIME_PERIOD") or "")[:10], r.get("OBS_VALUE")
        if len(d) == 10 and v not in (None, ""):
            x = float(v) - shift
            if -2 < x < 15:
                out[d] = x
    return out


def monthly_avg(daily: dict) -> dict:
    """{"YYYY-MM-DD": x} → {"YYYY-MM": vidurkis}. Kiekviena paskelbta reikšmė galioja iki kitos (savaitgaliais ir
    šventėmis – paskutinė paskelbta), todėl vidurkis svertinis pagal kalendorines dienas."""
    from datetime import date, timedelta
    if not daily:
        return {}
    days = sorted(daily)
    first, last = date.fromisoformat(days[0]), date.fromisoformat(days[-1])
    sums, cnt, cur, k, d = {}, {}, daily[days[0]], 0, first
    while d <= last:
        key = d.isoformat()
        if key in daily:
            cur = daily[key]
        m = key[:7]
        sums[m] = sums.get(m, 0.0) + cur
        cnt[m] = cnt.get(m, 0) + 1
        d += timedelta(days=1)
    return {m: round(sums[m] / cnt[m], 4) for m in sorted(sums)}


MONTHLY = Path(__file__).parent / "data" / "estr_monthly.json"


def monthly():
    """Mėnesių vidurkiai svetainei: {"start": "YYYY-MM", "v": [...], "last": "YYYY-MM-DD", "source": url} arba None.
    Jei ECB nepasiekiamas – paskutinė išsaugota versija; senesni išsaugoti mėnesiai niekada neprarandami."""
    old = {}
    if MONTHLY.exists():
        try:
            j = json.loads(MONTHLY.read_text(encoding="utf-8"))
            y, m = map(int, j["start"].split("-"))
            for i, v in enumerate(j["v"]):
                yy, mm = y + (m - 1 + i) // 12, (m - 1 + i) % 12 + 1
                if v is not None:
                    old[f"{yy:04d}-{mm:02d}"] = v
            old_last = j.get("last")
        except Exception as exc:
            print(f"€STR istorija: nepavyko perskaityti {MONTHLY.name} ({exc})")
            old_last = None
    else:
        old_last = None
    new, last = {}, old_last
    try:
        estr = daily_rows(_get(fund_links.ECB_ESTR_HIST_API))
        if len(estr) > 500:                       # turi būti visa istorija, ne vienas įrašas
            new.update(monthly_avg(estr))
            last = max(estr)
        try:
            eonia = daily_rows(_get(fund_links.ECB_EONIA_API), shift=0.085)
            for m, v in monthly_avg(eonia).items():
                if m < "2019-10":
                    new[m] = v
        except Exception as exc:
            print(f"EONIA: nepavyko gauti iš ECB ({exc.__class__.__name__}: {exc})")
    except Exception as exc:
        print(f"€STR istorija: nepavyko gauti iš ECB ({exc.__class__.__name__}: {exc})")
    merged = {**old, **new}
    if not merged:
        return None
    keys = sorted(merged)
    y, m = map(int, keys[0].split("-"))
    ly, lm = map(int, keys[-1].split("-"))
    vals = []
    while (y, m) <= (ly, lm):
        vals.append(merged.get(f"{y:04d}-{m:02d}"))
        m += 1
        if m > 12:
            y, m = y + 1, 1
    payload = {"start": keys[0], "v": vals, "last": last}
    if new:
        MONTHLY.write_text(json.dumps(payload, ensure_ascii=False) + "\n", encoding="utf-8")
    payload["source"] = fund_links.ECB_ESTR_PAGE
    return payload


def fetch(timeout: int = 15):
    try:
        req = urllib.request.Request(fund_links.ECB_ESTR_API, headers={"Accept": "text/csv", "User-Agent": "pension-fund-tracker"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            out = parse(resp.read().decode("utf-8"))
        source_status.ok("estr") if out else source_status.fail("estr", "neįtikėtina arba tuščia reikšmė", "format")
        return out
    except Exception as exc:          # svetainės generavimas dėl to niekada nesustoja
        print(f"€STR: nepavyko gauti iš ECB ({exc.__class__.__name__}: {exc})")
        source_status.fail("estr", exc)
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
    h = monthly()
    print(h and {"start": h["start"], "months": len(h["v"]), "last": h["last"]})
