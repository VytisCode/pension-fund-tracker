#!/usr/bin/env python3
"""
Allianz gyvenimo ciklo pensijų fondų istorija nuo 2019 m.

Puslapis /snippets/pensiju-fondai (POST) grąžina lentelę pasirinktai datai.
Laukai: _token (CSRF), direction (tuščias), pdate (YYYY-MM-DD).
Eilutės įrašomos pagal DATĄ, KURI PARODYTA ATSAKYME (savaitgaliais / šventinėmis
dienomis puslapis gali rodyti ankstesnę dieną), todėl dublių nelieka.
"""
import http.cookiejar
import html as htmllib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, timedelta

import store

BASE = "https://investavimorezultatai.allianz.lt"
PAGE = f"{BASE}/?tipas=gyvenimo-ciklo-pensiju-fondai"
ENDPOINT = f"{BASE}/snippets/pensiju-fondai"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
START = date(2019, 1, 2)
PAUSE_SECONDS = 0.3
EXCLUDED_FUNDS = {"Allianz B gimusiems 1954-1960 m."}  # likviduotas, 0 aktyvų
LT_MONTHS = {
    "sausio": 1, "vasario": 2, "kovo": 3, "balandžio": 4, "gegužės": 5, "birželio": 6,
    "liepos": 7, "rugpjūčio": 8, "rugsėjo": 9, "spalio": 10, "lapkričio": 11, "gruodžio": 12,
}


def clean(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text)
    return " ".join(htmllib.unescape(text).replace("\xa0", " ").split())


def parse_response(page_html: str):
    """Return (iso_date or None, rows)."""
    shown = None
    match = re.search(r"(\d{4})\s+m\.\s+(\S+)\s+(\d{1,2})\s+d\.", clean(page_html))
    if match and match.group(2).lower() in LT_MONTHS:
        shown = date(int(match.group(1)), LT_MONTHS[match.group(2).lower()], int(match.group(3)))

    # Vieneto vertės langelis turi vidinę lentelę, todėl eilutes skaidome pagal fondo pavadinimą.
    rows = []
    names = list(re.finditer(r"<nobr>\s*(Allianz[^<]*?)\s*</nobr>", page_html, re.S))
    for index, found in enumerate(names):
        end = names[index + 1].start() if index + 1 < len(names) else len(page_html)
        segment = page_html[found.end():end]
        name = clean(found.group(1)).replace("–", "-").replace("—", "-")
        if name in EXCLUDED_FUNDS:
            continue
        unit = re.search(r"<strong>\s*(\d+[.,]\d+)\s*</strong>", segment)
        if not unit:
            continue  # "-" = tą dieną fondo dar nebuvo
        assets = None
        total = re.search(r'<td[^>]*class="TotalSum"[^>]*>(.*?)</td>', segment, re.S)
        if total:
            text = clean(total.group(1))
            if re.match(r"^\d[\d ]*(?:[.,]\d+)?$", text):
                assets = float(text.replace(" ", "").replace(",", ".")) or None
        rows.append(
            {
                "provider": "ALLIANZ",
                "fund": name,
                "unit_value": float(unit.group(1).replace(",", ".")),
                "net_assets": assets,
            }
        )
    return shown, rows


class Session:
    def __init__(self):
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar())
        )
        self.opener.addheaders = [("User-Agent", UA), ("Accept-Language", "lt-LT,lt;q=0.9")]
        self.token = ""
        self.refresh()

    def refresh(self):
        page = self.opener.open(PAGE, timeout=60).read().decode("utf-8", errors="replace")
        match = re.search(r'name="csrf-token"\s+content="([^"]+)"', page)
        if not match:
            raise RuntimeError("CSRF žetonas nerastas")
        self.token = match.group(1)

    def fetch(self, day: date) -> str:
        body = urllib.parse.urlencode(
            {"_token": self.token, "direction": "", "pdate": day.isoformat()}
        ).encode()
        request = urllib.request.Request(
            ENDPOINT,
            data=body,
            headers={
                "X-CSRF-TOKEN": self.token,
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": PAGE,
                "Origin": BASE,
                "Accept": "text/html, */*; q=0.01",
            },
            method="POST",
        )
        last_error = None
        for attempt in range(3):
            try:
                return self.opener.open(request, timeout=60).read().decode("utf-8", errors="replace")
            except urllib.error.HTTPError as exc:
                last_error = exc
                if exc.code in (419, 403):  # nebegaliojantis žetonas / sesija
                    self.refresh()
                    request.data = urllib.parse.urlencode(
                        {"_token": self.token, "direction": "", "pdate": day.isoformat()}
                    ).encode()
                    request.headers["X-csrf-token"] = self.token
            except Exception as exc:  # noqa: BLE001
                last_error = exc
            time.sleep(2 * (attempt + 1))
        raise RuntimeError(f"{day}: {last_error}")


def main() -> int:
    session = Session()

    # Greita patikra: skirtingos datos turi grąžinti skirtingas dienas.
    check_a, _ = parse_response(session.fetch(date(2023, 6, 15)))
    check_b, _ = parse_response(session.fetch(date(2026, 9, 30)))
    print(f"Patikra: prašyta 2023-06-15 → parodyta {check_a}; prašyta 2026-09-30 → parodyta {check_b}")
    if check_a is None or check_a == check_b:
        print("Datos parametras neveikia taip, kaip tikėtasi. Stoju.")
        return 1

    collected = {}
    day = START
    today = date.today()
    requested = 0
    try:
        while day <= today:
            if day.weekday() < 5:  # tik darbo dienos
                shown, rows = parse_response(session.fetch(day))
                requested += 1
                if shown:
                    for row in rows:
                        collected[(shown.isoformat(), row["fund"])] = {**row, "date": shown.isoformat()}
                if requested % 100 == 0:
                    print(f"  {requested} užklausų, paskutinė data {day}, eilučių: {len(collected)}")
                time.sleep(PAUSE_SECONDS)
            day += timedelta(days=1)
    finally:
        changed = store.upsert(list(collected.values()))
        funds = sorted({fund for _, fund in collected})
        print(f"Įrašyta: {len(collected)} eilučių, nauja/pakeista: {changed}, užklausų: {requested}")
        for fund in funds:
            dates = sorted(d for d, f in collected if f == fund)
            print(f"  {fund}: {len(dates)} eil. ({dates[0]} → {dates[-1]})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
