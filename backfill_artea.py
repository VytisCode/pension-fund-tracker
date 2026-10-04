#!/usr/bin/env python3
"""
Užpildo Artea fondų istoriją nuo 2019 m. iš jų viešo API (raktas nereikalingas)
ir įrašo į data/nav_history.csv.

Laukai API atsakyme: d = data, p = vieneto vertė, n = grynieji aktyvai.
(Pagal merginos kodą: `p` yra vieneto vertė, `b` – vidinė normalizuota kaina.)
"""
import json
import sys
import urllib.error
import urllib.parse
import urllib.request

import store

API_HISTORY_URL = "https://api.sb.lt/funds-api/Prices/History"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
FUND_CODE_MAP = {
    "INV-03/09": "Artea pensija 2003-2009",
    "INV-61/67": "Artea pensija 1961-1967",
    "INV-68/74": "Artea pensija 1968-1974",
    "INV-75/81": "Artea pensija 1975-1981",
    "INV-82/88": "Artea pensija 1982-1988",
    "INV-89/95": "Artea pensija 1989-1995",
    "INV-96/02": "Artea pensija 1996-2002",
    "INV-TIPF": "Artea pensijų turto išsaugojimo fondas",
}


def fetch_history(fund_code: str) -> list:
    url = f"{API_HISTORY_URL}?{urllib.parse.urlencode({'fundCode': fund_code})}"
    request = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"}
    )
    with urllib.request.urlopen(request, timeout=60) as response:
        data = json.load(response)
    if not isinstance(data, list) or not data:
        raise RuntimeError(f"Netikėtas API atsakymas: {fund_code}")
    return data


def main() -> int:
    failures = []
    for code, name in FUND_CODE_MAP.items():
        try:
            history = fetch_history(code)
        except Exception as exc:  # noqa: BLE001 - norime tęsti su kitais fondais
            failures.append(code)
            print(f"KLAIDA {code}: {exc}")
            continue

        rows = [
            {
                "date": record.get("d"),
                "provider": "ARTEA",
                "fund": name,
                "unit_value": record.get("p"),
                "net_assets": record.get("n"),
            }
            for record in history
            if record.get("d") and record.get("p") is not None
        ]
        changed = store.upsert(rows)
        first = rows[0]["date"] if rows else "-"
        last = rows[-1]["date"] if rows else "-"
        print(f"{name}: {len(rows)} eilučių ({first} → {last}), nauja/pakeista: {changed}")

    if failures:
        print(f"Nepavyko: {', '.join(failures)}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
