#!/usr/bin/env python3
"""
Swedbank III pakopos fondų visa vieneto verčių istorija iš fondo puslapio grafiko duomenų
(price-provider/pub/json, grąžina [[laikas_ms, vertė], ...]). Kiekvienas fondas įrašomas į
probe_out/<fondas>.csv (stulpeliai: date;unit_value). Paleidimas per „Probe III pillar sources“
su script=fetch_swedbank_pillar3_history.py.
"""
import json
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from playwright.sync_api import sync_playwright

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
LIST = "https://www.swedbank.lt/private/pensions/pillar3/allFunds?language=LIT"
FUNDS = [
    "Pensijos fondas 18+",
    "Pensijos fondas 50+",
    "Pensijos fondas 60+",
    "Pensijos fondas 18+ (apriboto nutraukimo)",
    "Pensijos fondas 50+ (apriboto nutraukimo)",
    "Pensijos fondas 60+ (apriboto nutraukimo)",
]
VILNIUS = ZoneInfo("Europe/Vilnius")


def log(text):
    print(text)
    with open(OUT / "swedbank_history_log.txt", "a", encoding="utf-8") as f:
        f.write(text + "\n")


def fetch_one(page, fund):
    page.goto(LIST, wait_until="networkidle", timeout=90000)
    for btn in page.query_selector_all("ui-cookie-consent button"):
        try:
            btn.click(force=True)
        except Exception:
            pass
    page.wait_for_timeout(1000)
    link = None
    for a in page.query_selector_all("tbody tr a"):
        if " ".join(a.inner_text().split()) == fund:
            link = a
            break
    if link is None:
        raise RuntimeError("fund link not found")
    with page.expect_response(lambda r: "price-provider/pub/json" in r.url, timeout=60000) as info:
        link.click()
    data = json.loads(info.value.text())
    page.wait_for_timeout(1500)
    rows = []
    for ts, value in data:
        day = datetime.fromtimestamp(ts / 1000, tz=VILNIUS).date().isoformat()
        rows.append((day, value))
    return rows


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=["--no-sandbox"])
        page = browser.new_context(user_agent=UA, locale="lt-LT").new_page()
        for fund in FUNDS:
            try:
                rows = fetch_one(page, fund)
                dates = [r[0] for r in rows]
                name = fund.replace(" ", "_").replace("(", "").replace(")", "")
                with open(OUT / f"Swedbank_{name}.csv", "w", encoding="utf-8") as f:
                    f.write("date;unit_value\n")
                    for d, v in rows:
                        f.write(f"{d};{v}\n")
                log(f"{fund}: {len(rows)} rows {rows[0]} .. {rows[-1]} duplicates={len(dates) - len(set(dates))}")
            except Exception as exc:
                log(f"{fund}: ERROR {exc}")
        browser.close()


if __name__ == "__main__":
    main()
