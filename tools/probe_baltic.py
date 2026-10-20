"""Vienkartinė Latvijos (manapensija.lv) ir Estijos (pensionikeskus.ee) pensijų fondų duomenų šaltinių patikra.
Paleidžiama per probe_pillar3.yml (script = probe_baltic.py); rezultatai – probe_out/ → šaka probe-results.
Gerbia robots.txt: draudžiamų puslapių neatidaro, tik pažymi summary.txt. Nieko neįrašo į data/.
"""
import json
import re
import urllib.robotparser
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from playwright.sync_api import sync_playwright

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (pension-fund-tracker research; public statistics)"
LOG = []
ROBOTS = {}


def log(*a):
    s = " ".join(str(x) for x in a)
    print(s)
    LOG.append(s)


def allowed(url):
    host = urlparse(url).netloc
    if host not in ROBOTS:
        rp = urllib.robotparser.RobotFileParser()
        try:
            r = requests.get(f"https://{host}/robots.txt", headers={"User-Agent": UA}, timeout=30)
            (OUT / f"robots_{host}.txt").write_text(r.text, encoding="utf-8")
            rp.parse(r.text.splitlines() if r.status_code == 200 else [])
            log("robots", host, r.status_code)
        except Exception as e:
            log("robots fail", host, e)
            rp.parse([])
        ROBOTS[host] = rp
    ok = ROBOTS[host].can_fetch(UA, url)
    if not ok:
        log("ROBOTS DISALLOW", url)
    return ok


def safe(url):
    return re.sub(r"[^A-Za-z0-9]+", "_", url.split("://", 1)[-1])[:120]


def get(url):
    if not allowed(url):
        return None
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=40)
        ext = ".xml" if "xml" in r.headers.get("content-type", "") else ".html"
        (OUT / (safe(url) + ext)).write_bytes(r.content)
        log("GET", r.status_code, len(r.content), url)
        return r
    except Exception as e:
        log("GET fail", url, e)
        return None


def browse(pg, url, tag):
    """Atidaro puslapį naršykle, įrašo galutinį HTML ir visus JSON/CSV/XLS atsakymus."""
    if not allowed(url):
        return []
    got = []

    def on_resp(r):
        ct = r.headers.get("content-type", "")
        if any(k in ct for k in ("json", "csv", "excel", "spreadsheet", "octet")) and len(got) < 40:
            try:
                b = r.body()
            except Exception:
                return
            n = f"{tag}_resp{len(got):02d}_{safe(r.url)[-60:]}"
            (OUT / n).write_bytes(b[:3_000_000])
            got.append((r.url, ct, len(b)))
            log("  RESP", ct, len(b), r.url)

    pg.on("response", on_resp)
    try:
        pg.goto(url, wait_until="networkidle", timeout=60000)
        pg.wait_for_timeout(3000)
        (OUT / f"{tag}_rendered.html").write_text(pg.content(), encoding="utf-8")
        links = pg.eval_on_selector_all("a[href]", "as => as.map(a => [a.textContent.trim().slice(0, 80), a.href])")
        (OUT / f"{tag}_links.json").write_text(json.dumps(links, ensure_ascii=False, indent=1), encoding="utf-8")
        log("BROWSE", tag, url, "links", len(links))
    except Exception as e:
        log("BROWSE fail", url, e)
        links = []
    pg.remove_listener("response", on_resp)
    return links


KEY = re.compile(r"salidz|salīdz|plan|statist|ienes|fond|compare|nav|return|tulus|statistika|download|xls|csv|export|api", re.I)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(user_agent=UA)
    # Latvija
    r = get("https://www.manapensija.lv/sitemap.xml")
    sm = re.findall(r"<loc>([^<]+)</loc>", r.text) if r is not None else []
    log("LV sitemap urls", len(sm))
    (OUT / "lv_sitemap_urls.txt").write_text("\n".join(sm), encoding="utf-8")
    links = browse(pg, "https://www.manapensija.lv/", "lv_home")
    cand = [h for t, h in links if "manapensija.lv" in h and KEY.search(t + " " + h)]
    cand += [u for u in sm if KEY.search(u)]
    seen = set()
    for i, u in enumerate(x for x in cand if not (x in seen or seen.add(x))):
        if i >= 14:
            break
        browse(pg, u, f"lv_{i:02d}")
    # Estija
    for i, u in enumerate(["https://www.pensionikeskus.ee/en/statistics/",
                           "https://www.pensionikeskus.ee/en/statistics/ii-pillar/nav-of-funded-pension/",
                           "https://www.pensionikeskus.ee/en/statistics/iii-pillar/nav-of-supplementary-pension/",
                           "https://www.pensionikeskus.ee/en/statistics/ii-pillar/value-of-assets-of-funded-pension/",
                           "https://www.pensionikeskus.ee/en/statistics/ii-pillar/number-of-unit-holders-of-funded-pension/",
                           "https://www.pensionikeskus.ee/en/funds/"]):
        links = browse(pg, u, f"ee_{i:02d}")
        dl = [h for t, h in links if re.search(r"download|xls|csv|export|\.xlsx?|format=", h + t, re.I)]
        log("  EE download-like links", dl[:20])
    b.close()

(OUT / "summary.txt").write_text("\n".join(LOG), encoding="utf-8")
