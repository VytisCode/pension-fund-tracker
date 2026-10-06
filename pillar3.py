#!/usr/bin/env python3
"""
III pakopos pensijų fondai: atskira saugykla data/pillar3_history.csv (stulpeliai kaip II pakopos).

Komandos:
    python pillar3.py import          # sukelia istorijos failus iš imports/pillar3/ (SEB, Swedbank, Luminor, Goindex)
    python pillar3.py update          # kasdienis atnaujinimas (Artea API visa istorija, Goindex API,
                                      #   SEB / Swedbank / Luminor puslapiai; trūkstama Luminor istorija iš puslapio duomenų)
    python pillar3.py needs-browser   # needs_browser_p3=true/false į $GITHUB_OUTPUT
    python pillar3.py status

Šaltiniai ir fondų kodai patikrinti 2026-10-05 (žr. tools/probe_pillar3*.py).
Kiekvienas tiekėjas tikrinamas tik jei dar nėra laukiamos dienos duomenų (kaip ir II pakopoje).
"""
import csv
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

import fund_links
import store
import update as u

ROOT = Path(__file__).parent
DATA_FILE = ROOT / "data" / "pillar3_history.csv"
IMPORTS = ROOT / "imports" / "pillar3"
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

# provider, fondas (rodomas pavadinimas), kategorija, LB fondo kodas, rizikingų aktyvų dalis (LB 2026-06-30)
FUNDS = [
    ("LUMINOR", "Luminor ateitis 58+", "bond", "S040", "0"),
    ("ARTEA", "Artea Stabilus 58+", "bond", "S022", "0"),
    ("SEB", "SEB pensija 58+", "bond", "S017", "iki 8"),
    ("LUMINOR", "Luminor ateitis 50–58", "mixed", "S019", "iki 50"),
    ("ARTEA", "Artea Subalansuotas 47+", "mixed", "S032", "iki 70"),
    ("SWEDBANK", "Swedbank Pensijos fondas 60+ (apriboto nutraukimo)", "mixed", "S046", "iki 30"),
    ("SWEDBANK", "Swedbank Pensijos fondas 50+ (apriboto nutraukimo)", "mixed", "S047", "iki 60"),
    ("SWEDBANK", "Swedbank Pensijos fondas 60+", "mixed", "S054", "iki 30"),
    ("SWEDBANK", "Swedbank Pensijos fondas 50+", "mixed", "S053", "iki 60"),
    ("SEB", "SEB pensija 50+", "mixed", "S049", "40-60"),
    ("GOINDEX", "Goindex subalansuotas", "mixed", "S057", "iki 60"),
    ("LUMINOR", "Luminor ateitis 16–50", "equity", "S028", "iki 100"),
    ("ARTEA", "Artea Ambicingas Active 16+", "equity", "S021", "iki 100"),
    ("ARTEA", "Artea Ambicingas 16+", "equity", "S033", "iki 100"),
    ("ARTEA", "Artea Ambicingas Index 16+", "equity", "S058", "iki 100"),
    ("SEB", "SEB pensija 18+", "equity", "S018", "iki 100"),
    ("SEB", "SEB index. Klimato ateitis", "equity", "S051", "iki 100"),
    ("SWEDBANK", "Swedbank Pensijos fondas 18+ (apriboto nutraukimo)", "equity", "S048", "iki 100"),
    ("SWEDBANK", "Swedbank Pensijos fondas 18+", "equity", "S052", "iki 100"),
    ("LUMINOR", "Luminor tvari ateitis index", "equity", "S050", "iki 100"),
    ("LUMINOR", "Luminor ateitis akcijų index", "equity", "S059", "iki 100"),
    ("GOINDEX", "Goindex pasaulio akcijų", "equity", "S056", "iki 100"),
]
PROVIDER_OF = {name: p for p, name, *_ in FUNDS}
LUMINOR_INDEX_FUND_ID = "24"  # Luminor ateitis akcijų index (rinkis-fonda?fund=24)


def key(name: str) -> str:
    """Pavadinimų sutapatinimui: be tiekėjo priešdėlio, tarpų, brūkšnių skirtumų, „ +“."""
    text = " ".join(str(name).split()).lower().replace("–", "-").replace("—", "-")
    text = re.sub(r"^swedbank\s+", "", text)
    return re.sub(r"[\s.]", "", text)


KEY_TO_FUND = {key(name): name for _, name, *_ in FUNDS}


def fund_for(raw_name: str):
    return KEY_TO_FUND.get(key(raw_name))


def load() -> dict:
    return store.load(DATA_FILE)


def save(rows: list) -> int:
    return store.upsert(rows, DATA_FILE)


def row(day, fund, unit, assets=None):
    return {"date": day, "provider": PROVIDER_OF[fund], "fund": fund, "unit_value": unit,
            "net_assets": u.clean_assets(assets) if assets else None}


# --------------------------------------------------------------------------- importas iš failų
def read_import_files() -> list:
    rows = []
    # SEB: Data;Vieneto vertė;Grynųjų aktyvų vertė;...  (0 aktyvai = nėra)
    seb_names = {"SEB_pensija_18+": "SEB pensija 18+", "SEB_pensija_50+": "SEB pensija 50+",
                 "SEB_pensija_58+": "SEB pensija 58+", "SEB_index_Klimato_ateitis": "SEB index. Klimato ateitis"}
    for path in sorted((IMPORTS / "seb").glob("*.csv")):
        fund = seb_names[path.stem]
        with path.open(encoding="utf-8-sig") as f:
            for rec in csv.reader(f, delimiter=";"):
                if rec and re.match(r"\d{4}-\d{2}-\d{2}", rec[0]):
                    assets = u.number(rec[2]) if len(rec) > 2 else None
                    rows.append(row(rec[0], fund, u.number(rec[1]), assets if assets and assets > 1000 else None))
    # Swedbank: date;unit_value (iš grafiko duomenų)
    for path in sorted((IMPORTS / "swedbank").glob("*.csv")):
        raw = path.stem.replace("Swedbank_", "").replace("_apriboto_nutraukimo", " (apriboto nutraukimo)").replace("_", " ")
        fund = fund_for(raw)
        with path.open(encoding="utf-8") as f:
            for rec in csv.reader(f, delimiter=";"):
                if rec and re.match(r"\d{4}-\d{2}-\d{2}", rec[0]):
                    rows.append(row(rec[0], fund, u.number(rec[1])))
    # Luminor: Date,<fondo pavadinimas>
    for path in sorted((IMPORTS / "luminor").glob("*.csv")):
        with path.open(encoding="utf-8") as f:
            reader = csv.reader(f)
            fund = fund_for(next(reader)[1])
            for rec in reader:
                if rec and re.match(r"\d{4}-\d{2}-\d{2}", rec[0]):
                    rows.append(row(rec[0], fund, u.number(rec[1])))
    # Goindex: Data,Vieneto vertė,Lyginamasis indeksas,Grynųjų aktyvų vertė
    gox = {"Goindex_subalansuotas": "Goindex subalansuotas", "Goindex_pasaulio_akciju": "Goindex pasaulio akcijų"}
    for path in sorted((IMPORTS / "goindex").glob("*.csv")):
        fund = gox[path.stem]
        with path.open(encoding="utf-8") as f:
            for rec in csv.reader(f):
                if rec and re.match(r"\d{4}-\d{2}-\d{2}", rec[0]):
                    assets = u.number(rec[3]) if len(rec) > 3 else None
                    rows.append(row(rec[0], fund, u.number(rec[1]), assets if assets and assets > 1000 else None))
    bad = [r for r in rows if r["fund"] is None or not r["unit_value"]]
    if bad:
        raise SystemExit(f"Neatpažintos eilutės: {bad[:3]}")
    return rows


# --------------------------------------------------------------------------- šaltiniai
def http_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=40) as response:
        return json.load(response)


def fetch_artea() -> list:
    """Visa istorija iš api.sb.lt (nuo fondo įsteigimo) – pirmas paleidimas užpildo viską."""
    rows = []
    for _, fund, _, code, _ in [f for f in FUNDS if f[0] == "ARTEA"]:
        for rec in http_json(fund_links.ARTEA_HISTORY_API + "?" + urllib.parse.urlencode({"fundCode": code})):
            if rec.get("d") and rec.get("p"):
                assets = u.number(rec.get("n"))
                rows.append(row(u.iso_date(rec["d"]), fund, u.number(rec["p"]), assets if assets and assets > 1000 else None))
    return rows


def fetch_goindex() -> list:
    secret = os.getenv("GOINDEX_API_SECRET_KEY", "").strip()
    if not secret:
        raise RuntimeError("nenustatytas GOINDEX_API_SECRET_KEY")
    rows = []
    for _, fund, _, code, _ in [f for f in FUNDS if f[0] == "GOINDEX"]:
        rec = http_json(f"{u.GOINDEX_API}?" + urllib.parse.urlencode({"secret_key": secret, "code": code}))
        rows.append(row(u.iso_date(str(rec.get("date", "")).split("T")[0]), fund,
                        u.number(rec.get("unitValue")), u.number(rec.get("assets"))))
    return rows


def browser_page():
    from playwright.sync_api import sync_playwright
    pw = sync_playwright().start()
    browser = pw.chromium.launch(headless=True, args=["--no-sandbox", "--disable-blink-features=AutomationControlled"])
    page = browser.new_context(user_agent=UA, locale="lt-LT").new_page()
    return pw, browser, page


def table_rows(page) -> list:
    out = []
    for tr in page.query_selector_all("tr"):
        cells = [" ".join(c.inner_text().split()) for c in tr.query_selector_all("td")]
        if cells:
            out.append(cells)
    return out


def fetch_seb() -> list:
    pw, browser, page = browser_page()
    try:
        page.goto(fund_links.SEB_II,
                  wait_until="domcontentloaded", timeout=90000)
        page.wait_for_timeout(3000)
        years = re.findall(r"(\d{4})-\d{2}-\d{2}", page.inner_text("body"))
        today = u.today_vilnius()
        rows = []
        for cells in table_rows(page):
            if len(cells) < 7:
                continue
            fund = fund_for(cells[1])
            if not fund or PROVIDER_OF[fund] != "SEB" or not re.match(r"\d{2}\.\d{2}$", cells[5]):
                continue
            day, month = cells[5].split(".")
            year = int(years[-1]) if years else today.year
            d = date(year, int(month), int(day))
            if d > today:  # pvz. sausio pradžioje rodoma gruodžio data
                d = date(year - 1, int(month), int(day))
            rows.append(row(d.isoformat(), fund, u.number(cells[6])))
        return rows
    finally:
        browser.close()
        pw.stop()


def fetch_swedbank() -> list:
    pw, browser, page = browser_page()
    try:
        page.goto(fund_links.SWEDBANK_III,
                  wait_until="networkidle", timeout=90000)
        page.wait_for_timeout(2000)
        rows = []
        for cells in table_rows(page):
            # [tuščias, pavadinimas, EUR, "2026 10 02", "1.4998", ...]
            if len(cells) < 5:
                continue
            fund = fund_for("Swedbank " + cells[1])
            day = u.iso_date(cells[3])
            if fund and day:
                rows.append(row(day, fund, u.number(cells[4])))
        return rows
    finally:
        browser.close()
        pw.stop()


def luminor_scraper(history: bool = False):
    import sources.luminor_pensions as lp
    lp.EXCLUDED_FUNDS.clear()  # II pakopos skaitytuvas III pakopos fondus praleidžia; čia jų reikia

    class P3(lp.LuminorPensionsScraper):
        def build_url(self, base_url, fund_id):
            if history:
                return f"{base_url}?fund_type=pension&fund={fund_id}&currency=eur&period=custom&from=2000-01-01&to=2030-12-31"
            return super().build_url(base_url, fund_id)

    return P3()


def fetch_luminor() -> list:
    scraper = luminor_scraper()
    html, errors = "", []
    for use_proxy in (False, True):
        try:
            html = scraper.fetch_table_html_via_curl(use_proxy=use_proxy)
            if html and not scraper.is_cloudflare_challenge(html):
                break
        except Exception as exc:  # noqa: BLE001
            errors.append(str(exc)[:150])
        html = ""
    if not html:
        for use_proxy in (True, False):
            try:
                html = scraper.fetch_table_html_via_browser_navigation(use_proxy=use_proxy)
                break
            except Exception as exc:  # noqa: BLE001
                errors.append(str(exc)[:150])
            finally:
                try:
                    scraper.cleanup_browser() if hasattr(scraper, "cleanup_browser") else None
                except Exception:
                    pass
    if not html:
        raise RuntimeError("Luminor lentelė nepasiekiama: " + " | ".join(errors[-3:]))
    rows = []
    for rec in scraper.parse_rows_from_table_html(html):
        fund = fund_for(rec["Fund name"])
        if fund and PROVIDER_OF[fund] == "LUMINOR":
            rows.append(row(u.iso_date(rec["Data"]), fund, u.number(rec["Vieneto vertė"]), u.number(rec["Grynieji aktyvai"])))
    return rows


def fetch_luminor_index_history() -> list:
    """Luminor ateitis akcijų index istorija iš rinkis-fonda puslapio duomenų (fundRatesHistory)."""
    scraper = luminor_scraper(history=True)
    payload = {}
    for use_proxy in (False, True):
        try:
            payload = scraper.fetch_payload_via_curl(LUMINOR_INDEX_FUND_ID, use_proxy=use_proxy)
            if payload:
                break
        except Exception:  # noqa: BLE001
            continue
    hist = payload.get("fundRatesHistory") or {}
    rows = []
    for day, val in hist.items():
        if isinstance(val, dict):
            val = val.get("value_eur") or val.get("unit_price_eur") or val.get("unit_price") or val.get("value")
        if re.match(r"\d{4}-\d{2}-\d{2}$", str(day)) and u.number(val):
            rows.append(row(day, "Luminor ateitis akcijų index", u.number(val)))
    return rows


LIGHT = {"ARTEA": fetch_artea, "GOINDEX": fetch_goindex}
BROWSER = {"SEB": fetch_seb, "SWEDBANK": fetch_swedbank, "LUMINOR": fetch_luminor}


# --------------------------------------------------------------------------- atnaujinimas
def missing(existing: dict, provider: str, expected: date) -> list:
    last = {}
    for (day, fund), r in existing.items():
        if r["provider"] == provider:
            last[fund] = max(last.get(fund, ""), day)
    funds = [f for p, f, *_ in FUNDS if p == provider]
    return [f for f in funds if last.get(f, "") < expected.isoformat()]


def accept(provider: str, rows: list, existing: dict, log: list, full_history: bool = False) -> list:
    today = u.today_vilnius().isoformat()
    out = []
    for r in rows:
        if not r["date"] or r["date"] > today or not r["unit_value"] or r["unit_value"] <= 0:
            log.append(f"  ! {r['fund']}: netinkama eilutė {r['date']} {r['unit_value']} – praleista")
            continue
        if not full_history:
            prev = [x for (d, f), x in existing.items() if f == r["fund"] and d < r["date"]]
            if prev:
                last = float(max(prev, key=lambda x: x["date"])["unit_value"])
                if abs(r["unit_value"] / last - 1) > u.MAX_DAILY_JUMP:
                    log.append(f"  ! {r['fund']} {r['date']}: pokytis per didelis ({last} → {r['unit_value']}) – praleista")
                    continue
        old = existing.get((r["date"], r["fund"]))
        if old and old.get("net_assets") and not r.get("net_assets"):
            r = {**r, "net_assets": old["net_assets"]}
        out.append(r)
    return out


def run(providers: dict, browser: bool) -> None:
    expected = u.expected_date()
    existing = load()
    state = u.load_state()
    log = [f"III pakopa – Vilnius: {datetime.now(u.TZ):%Y-%m-%d %H:%M}, laukiama diena: {expected}"]
    attempted = False
    for provider, fetch in providers.items():
        miss = missing(existing, provider, expected)
        artea_backfill = provider == "ARTEA" and sum(1 for k in existing if PROVIDER_OF.get(k[1]) == "ARTEA") < 1000
        if not miss and not artea_backfill:
            log.append(f"{provider}: jau atnaujinta iki {expected}")
            continue
        state_key = "P3_" + provider
        if browser and u.attempts_today(state, state_key) >= u.MAX_BROWSER_ATTEMPTS:
            log.append(f"{provider}: pasiektas dienos bandymų limitas")
            continue
        attempted = True
        if browser:
            u.add_attempt(state, state_key)
        try:
            rows = fetch()
        except Exception as exc:  # noqa: BLE001
            log.append(f"{provider}: klaida – {str(exc)[:300]}")
            continue
        good = accept(provider, rows, existing, log, full_history=provider == "ARTEA")
        changed = save(good)
        existing = load()
        still = missing(existing, provider, expected)
        log.append(f"{provider}: gauta {len(rows)} eil., nauja/pakeista {changed}; "
                   f"{'viskas iki ' + str(expected) if not still else 'dar trūksta: ' + ', '.join(still)}")
    # Luminor ateitis akcijų index: jei dar nėra istorijos – bandome ją paimti iš puslapio duomenų
    if browser and sum(1 for k in existing if k[1] == "Luminor ateitis akcijų index") < 60:
        attempted = True
        try:
            rows = fetch_luminor_index_history()
            changed = save(accept("LUMINOR", rows, existing, log, full_history=True))
            log.append(f"LUMINOR akcijų index istorija: gauta {len(rows)} eil., nauja/pakeista {changed}")
        except Exception as exc:  # noqa: BLE001
            log.append(f"LUMINOR akcijų index istorija: klaida – {str(exc)[:200]}")
    u.save_state(state)
    u.summary(log, attempted)


def main() -> int:
    command = sys.argv[1] if len(sys.argv) > 1 else "status"
    if command == "import":
        rows = read_import_files()
        print(f"Importuota eilučių: {len(rows)}, nauja/pakeista: {save(rows)}")
        return 0
    if command == "light":
        run({p: f for p, f in LIGHT.items() if p != "GOINDEX" or os.getenv("GOINDEX_API_SECRET_KEY")}, browser=False)
        return 0
    if command == "browser":
        run(BROWSER, browser=True)
        return 0
    if command == "needs-browser":
        existing, expected, state = load(), u.expected_date(), u.load_state()
        need = [p for p in BROWSER if missing(existing, p, expected)
                and u.attempts_today(state, "P3_" + p) < u.MAX_BROWSER_ATTEMPTS]
        if sum(1 for k in existing if k[1] == "Luminor ateitis akcijų index") < 60:
            need.append("LUMINOR-index")
        print("III pakopai reikia naršyklės:", ", ".join(need) or "niekam")
        target = os.getenv("GITHUB_OUTPUT")
        if target:
            with open(target, "a", encoding="utf-8") as f:
                f.write(f"needs_browser_p3={'true' if need else 'false'}\n")
        return 0
    if command == "status":
        existing, expected = load(), u.expected_date()
        print(f"III pakopa, laukiama diena: {expected}")
        for provider in sorted({p for p, *_ in FUNDS}):
            miss = missing(existing, provider, expected)
            print(f"{provider}: {'atnaujinta' if not miss else 'trūksta: ' + ', '.join(miss)}")
        return 0
    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main())
