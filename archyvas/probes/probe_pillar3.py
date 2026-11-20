#!/usr/bin/env python3
"""
III pakopos fondų šaltinių patikra (vienkartinė, nieko neįrašo į data/).

Kiekvienam tiekėjui atidaro III pakopos puslapį naršykle, išspausdina lentelių eilutes
su fondų pavadinimais ir užfiksuoja visus JSON / API užklausų adresus (kad rastume
fondų kodus ir istorijos šaltinius). Rezultatas – probe_out/ aplanke ir paleidimo žurnale.
Paleidimas: Actions → "Probe III pillar sources" → Run workflow.
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

PAGES = {
    "seb": ["https://e.seb.lt/web/ipank.p?sesskey=&act=VPFOND&filterCode=P&lang=lit&frnam=X&unetmenuhigh="],
    "swedbank": ["https://www.swedbank.lt/private/pensions/pillar3/allFunds?language=LIT"],
    "artea": [
        "https://www.artea.lt/lt/privatiems/pensija/iii-pakopos-pensija",
        "https://www.artea.lt/lt/privatiems/pensija/iii-pakopos-pensija/artea-stabilus-58",
    ],
    "goindex": [
        "https://www.goindex.lt/3-pakopa/fondu-rezultatai-ir-dokumentai/",
        "https://www.goindex.lt/3-pakopa/",
    ],
    "luminor": ["https://www.luminor.lt/lt/pensiju-fondai"],
}

KEYWORDS = re.compile(
    r"58|50|47|16|18|60|Stabil|Subalans|Ambicing|Klimat|ateitis|akcij|pasaulio|apriboto|Pensijos fondas",
    re.I,
)


def log(provider, text):
    print(text)
    with open(OUT / f"{provider}.txt", "a", encoding="utf-8") as f:
        f.write(text + "\n")


def probe_page(browser, provider, url):
    log(provider, f"\n===== {provider}: {url}")
    ctx = browser.new_context(user_agent=UA, locale="lt-LT")
    page = ctx.new_page()
    api_calls = []

    def on_response(resp):
        try:
            ct = resp.headers.get("content-type", "")
            if "json" in ct or "api" in resp.url:
                body = ""
                try:
                    body = resp.text()[:600]
                except Exception:
                    pass
                api_calls.append((resp.status, resp.request.method, resp.url, body))
        except Exception:
            pass

    page.on("response", on_response)
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(8000)
        for sel in ["button:has-text('Sutinku')", "button:has-text('Priimti')", "button:has-text('Leisti')",
                    "ui-cookie-consent button", "#onetrust-accept-btn-handler"]:
            try:
                page.locator(sel).first.click(timeout=1500)
            except Exception:
                pass
        page.wait_for_timeout(3000)
        log(provider, f"title: {page.title()}  final url: {page.url}")
        rows = page.query_selector_all("tr")
        log(provider, f"table rows: {len(rows)}")
        for r in rows:
            t = " | ".join(" ".join(c.inner_text().split()) for c in r.query_selector_all("td,th"))
            if t.strip():
                log(provider, "ROW: " + t[:300])
        body = page.inner_text("body")
        (OUT / f"{provider}_{abs(hash(url)) % 10000}_body.txt").write_text(body, encoding="utf-8")
        if not rows:
            for line in body.splitlines():
                line = " ".join(line.split())
                if line and KEYWORDS.search(line) and len(line) < 200:
                    log(provider, "TXT: " + line)
        links = set()
        for a in page.query_selector_all("a"):
            href = a.get_attribute("href") or ""
            if re.search(r"pakop|pensij|fond|fund|pillar3", href, re.I):
                links.add(href)
        for h in sorted(links)[:80]:
            log(provider, "LINK: " + h)
    except Exception as exc:
        log(provider, f"ERROR: {exc}")
    for status, method, u, body in api_calls:
        log(provider, f"API {status} {method} {u}\n    {body[:400]}")
    ctx.close()


def http_get(url, headers=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json", **(headers or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", errors="ignore")


def probe_artea_api():
    log("artea", "\n===== Artea API guesses")
    for code in ["INV-S58", "INV-STAB", "INV-58", "INV-SUB", "INV-AMB", "INV-AMBA", "INV-AMBI"]:
        url = "https://api.sb.lt/funds-api/Prices/History?" + urllib.parse.urlencode({"fundCode": code})
        try:
            s, b = http_get(url)
            log("artea", f"{code}: {s} {b[:200]}")
        except Exception as exc:
            log("artea", f"{code}: {exc}")


def probe_goindex_api():
    key = os.getenv("GOINDEX_API_SECRET_KEY", "")
    log("goindex", f"\n===== Goindex API (key set: {bool(key)})")
    for code in ["GOX-SUB", "GOX-SUBAL", "GOX-PA", "GOX-PAS", "GOX-AKC", "GOX-3SUB", "GOX-3PA"]:
        url = "https://dapi.goindex.lt/v1/funds/summary/tab?" + urllib.parse.urlencode({"secret_key": key, "code": code})
        try:
            s, b = http_get(url)
            log("goindex", f"{code}: {s} {b[:200]}")
        except Exception as exc:
            log("goindex", f"{code}: {exc}")


def probe_luminor_table():
    log("luminor", "\n===== Luminor table via existing scraper (exclusions off)")
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    try:
        import sources.luminor_pensions as lp
        lp.EXCLUDED_FUNDS.clear()
        s = lp.LuminorPensionsScraper()
        html = ""
        for use_proxy in (False, True):
            try:
                html = s.fetch_table_html_via_curl(use_proxy=use_proxy)
                if html and not s.is_cloudflare_challenge(html):
                    break
            except Exception as exc:
                log("luminor", f"curl (proxy={use_proxy}) failed: {exc}")
        if html and not s.is_cloudflare_challenge(html):
            for row in s.parse_rows_from_table_html(html):
                log("luminor", "PARSED: " + json.dumps(row, ensure_ascii=False))
        else:
            log("luminor", "Table blocked by Cloudflare / empty")
    except Exception as exc:
        log("luminor", f"ERROR: {exc}")


def main():
    only = sys.argv[1:] or list(PAGES)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        for provider in only:
            for url in PAGES.get(provider, []):
                probe_page(browser, provider, url)
        browser.close()
    if "artea" in only:
        probe_artea_api()
    if "goindex" in only:
        probe_goindex_api()
    if "luminor" in only:
        probe_luminor_table()


if __name__ == "__main__":
    main()
