#!/usr/bin/env python3
"""
III pakopos patikra, 2 dalis: Artea ir Goindex fondų kodai (puslapiai saugomi Cloudflare).
Naršyklė su „stealth“ nustatymais ir ne-headless režimu (per xvfb), ilgesnis laukimas;
fiksuojamos visos api.sb.lt / dapi.goindex.lt užklausos. Rezultatai – probe_out/.
"""
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

try:
    from playwright_stealth import Stealth
except Exception:  # pragma: no cover
    Stealth = None

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")

ARTEA = "https://www.artea.lt/lt/privatiems/pensija/iii-pakopos-pensija/"
PAGES = {
    "artea": [ARTEA + s for s in ["artea-stabilus-58", "artea-subalansuotas-47", "artea-ambicingas-16",
                                  "artea-ambicingas-active-16", "artea-ambicingas-index-16"]],
    "goindex": ["https://www.goindex.lt/3-pakopa/fondu-rezultatai-ir-dokumentai/"],
}
API_HOST = re.compile(r"api\.sb\.lt|dapi\.goindex|/api/|funds", re.I)


def log(name, text):
    print(text)
    with open(OUT / f"{name}_b.txt", "a", encoding="utf-8") as f:
        f.write(text + "\n")


def proxy_settings():
    server = os.getenv("LUMINOR_PROXY_SERVER", "")
    if not server:
        return None
    if "://" not in server:
        server = "http://" + server
    p = {"server": server}
    if os.getenv("LUMINOR_PROXY_USERNAME"):
        p["username"] = os.getenv("LUMINOR_PROXY_USERNAME")
        p["password"] = os.getenv("LUMINOR_PROXY_PASSWORD", "")
    return p


def probe(p, name, url, use_proxy):
    log(name, f"\n===== {url} (proxy={use_proxy})")
    args = ["--disable-blink-features=AutomationControlled", "--no-sandbox", "--disable-dev-shm-usage"]
    kw = {"headless": False, "args": args}
    if use_proxy and proxy_settings():
        kw["proxy"] = proxy_settings()
    elif use_proxy:
        log(name, "no proxy configured")
        return False
    browser = p.chromium.launch(**kw)
    ctx = browser.new_context(user_agent=UA, locale="lt-LT", timezone_id="Europe/Vilnius",
                              viewport={"width": 1366, "height": 900})
    if Stealth:
        try:
            Stealth().apply_stealth_sync(ctx)
        except Exception as exc:
            log(name, f"stealth failed: {exc}")
    page = ctx.new_page()
    calls = []

    def on_resp(resp):
        if API_HOST.search(resp.url) and "challenges.cloudflare" not in resp.url:
            try:
                body = resp.text()[:500]
            except Exception:
                body = ""
            calls.append(f"API {resp.status} {resp.request.method} {resp.url}\n    {body}")

    page.on("response", on_resp)
    ok = False
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        for _ in range(20):
            page.wait_for_timeout(2000)
            if "Luktelėkite" not in page.title() and "Just a moment" not in page.title():
                ok = True
                break
        page.wait_for_timeout(6000)
        log(name, f"title: {page.title()} passed={ok}")
        if ok:
            html = page.content()
            for m in sorted(set(re.findall(r"(?:INV|GOX)-[A-Za-z0-9/+_.-]{1,12}", html))):
                log(name, "CODE-IN-HTML: " + m)
            for m in sorted(set(re.findall(r"fundCode[\"'=:\s]+[\"']?([^\"'&\s<>]{2,20})", html))):
                log(name, "fundCode: " + m)
            body = page.inner_text("body")
            for line in body.splitlines():
                line = " ".join(line.split())
                if re.search(r"\d+[.,]\d{3,}", line) and len(line) < 200:
                    log(name, "NUM: " + line)
            for r in page.query_selector_all("tr")[:60]:
                t = " | ".join(" ".join(c.inner_text().split()) for c in r.query_selector_all("td,th"))
                if t.strip():
                    log(name, "ROW: " + t[:300])
    except Exception as exc:
        log(name, f"ERROR: {exc}")
    for c in calls:
        log(name, c)
    browser.close()
    return ok


def http_get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", errors="ignore")


def artea_guesses():
    log("artea", "\n===== Artea code guesses")
    codes = ["INV-58+", "INV-47+", "INV-16+", "INV-16+A", "INV-16+I", "INV-S58", "INV-SUB47", "INV-AMB16",
             "INV-STAB58", "INV-III-58", "INV-ST58", "INV-SB47", "INV-AM16", "INV-AA16", "INV-AI16",
             "INV-PF58", "INV-PF47", "INV-PF16", "INV-3P58", "INV-3P47", "INV-3P16"]
    for code in codes:
        url = "https://api.sb.lt/funds-api/Prices/History?" + urllib.parse.urlencode({"fundCode": code})
        try:
            s, b = http_get(url)
            log("artea", f"HIT {code}: {s} {b[:150]}")
        except Exception as exc:
            log("artea", f"{code}: {exc}")
    for path in ["Funds", "Funds/List", "Prices/Latest", "Prices", "Fund", "Funds/All"]:
        try:
            s, b = http_get("https://api.sb.lt/funds-api/" + path)
            log("artea", f"PATH {path}: {s} {b[:400]}")
        except Exception as exc:
            log("artea", f"PATH {path}: {exc}")


def main():
    with sync_playwright() as p:
        for name, urls in PAGES.items():
            for i, url in enumerate(urls):
                if not probe(p, name, url, use_proxy=False):
                    probe(p, name, url, use_proxy=True)
    artea_guesses()


if __name__ == "__main__":
    main()
