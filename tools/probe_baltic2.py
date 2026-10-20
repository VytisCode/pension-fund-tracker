"""Antra Baltijos šaltinių patikra: Estijos XLS atsisiuntimai (visa istorija), III pakopos puslapiai; Latvijos plānu
salīdzinājums ir API galiniai taškai. Paleidžiama per probe_pillar3.yml (script = probe_baltic2.py); rezultatai – probe_out/.
robots.txt: manapensija.lv leidžia viską, pensionikeskus.ee robots.txt neturi (404)."""
import json
import re
import urllib.error
import urllib.request
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (pension-fund-tracker research; public statistics)"
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a)
    print(s)
    LOG.append(s)


def safe(url):
    return re.sub(r"[^A-Za-z0-9]+", "_", url.split("://", 1)[-1])[-110:]


def get(url, name=None, keep=3_000_000):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90) as r:
            b, ct, code = r.read(), r.headers.get("content-type", ""), r.status
    except urllib.error.HTTPError as e:
        b, ct, code = e.read() or b"", e.headers.get("content-type", ""), e.code
    except Exception as e:
        log("GET fail", url, e)
        return None
    (OUT / (name or safe(url))).write_bytes(b[:keep])
    log("GET", code, ct, len(b), url)
    return b


EE = "https://www.pensionikeskus.ee/en/statistics/"
with sync_playwright() as p:
    br = p.chromium.launch()
    pg = br.new_page(user_agent=UA)
    got = []

    def on_resp(r):
        ct = r.headers.get("content-type", "")
        if ("json" in ct or "csv" in ct) and "_nuxt/builds" not in r.url and len(got) < 80:
            try:
                b = r.body()
            except Exception:
                return
            n = f"resp{len(got):02d}_{safe(r.url)[-70:]}"
            (OUT / n).write_bytes(b[:3_000_000])
            got.append(r.url)
            log("  RESP", ct, len(b), r.url)

    pg.on("response", on_resp)

    def page(url, tag):
        try:
            pg.goto(url, wait_until="networkidle", timeout=60000)
            pg.wait_for_timeout(2500)
            (OUT / f"{tag}.html").write_text(pg.content(), encoding="utf-8")
            links = pg.eval_on_selector_all("a[href]", "as => as.map(a => [a.textContent.trim().slice(0, 80), a.href])")
            (OUT / f"{tag}_links.json").write_text(json.dumps(links, ensure_ascii=False, indent=1), encoding="utf-8")
            log("PAGE", tag, url, len(links))
            return links
        except Exception as e:
            log("PAGE fail", url, e)
            return []

    # --- Estija: III pakopos puslapiai
    links = page(EE + "iii-pillar/", "ee_p3")
    p3 = sorted({h.split("?")[0] for t, h in links if "/statistics/iii-pillar/" in h})
    log("EE III pages", p3)
    for i, u in enumerate(p3[:10]):
        page(u, f"ee_p3_{i:02d}")
    page(EE + "ii-pillar/funded-pension-daily-statistics/", "ee_daily")
    page("https://www.pensionikeskus.ee/en/ii-pillar/funds/", "ee_funds2")
    # --- Latvija: plānu salīdzinājums
    page("https://www.manapensija.lv/", "lv_home")
    try:
        pg.get_by_text("Salīdzini plānus").first.click(timeout=10000)
        pg.wait_for_timeout(5000)
        (OUT / "lv_compare.html").write_text(pg.content(), encoding="utf-8")
        log("LV compare url", pg.url)
        for t in ("2. līmenis", "3. līmenis"):
            try:
                pg.get_by_text(t).first.click(timeout=5000)
                pg.wait_for_timeout(3000)
            except Exception as e:
                log("click", t, e)
        (OUT / "lv_compare2.html").write_text(pg.content(), encoding="utf-8")
    except Exception as e:
        log("compare click fail", e)
    page("https://www.manapensija.lv/cbl", "lv_mgr_cbl")
    # JS failuose – API adresai
    js = set(re.findall(r'src="(/_nuxt/[^"]+\.js)"', (OUT / "lv_home.html").read_text(encoding="utf-8")))
    api = set()
    for j in sorted(js)[:60]:
        try:
            with urllib.request.urlopen(urllib.request.Request("https://www.manapensija.lv" + j, headers={"User-Agent": UA}), timeout=60) as r:
                s = r.read().decode("utf-8", "replace")
            api |= set(re.findall(r"""["'`](/?api/[A-Za-z0-9_\-/{}$.]+)""", s))
        except Exception as e:
            log("js fail", j, e)
    log("LV JS api strings", sorted(api))
    br.close()

# --- Estija: visos istorijos XLS (visi fondai) ir JSON
for kind in ("nav-of-funded-pension", "value-of-assets-of-funded-pension", "active-investors", "no-of-open-pension-accounts"):
    get(f"{EE}ii-pillar/{kind}/?download=xls&date_from=2002-01-01&date_to=2026-10-20", f"ee2_{kind}.xls", keep=20_000_000)
get(f"{EE}ii-pillar/funded-pension-daily-statistics/?download=xls", "ee2_daily.xls")
get(f"{EE}ii-pillar/nav-of-funded-pension/?download=xls&date_from=2002-01-01&date_to=2026-10-20&f%5B0%5D=38", "ee2_nav_f38.xls")
# --- Latvija: ilgos istorijos grafikas vienam plānui
get("https://www.manapensija.lv/api/data/pension-2nd-level-average-charts?pension_plan=043&startDate=2001-01-01", "lv2_043_full.json")
get("https://www.manapensija.lv/api/data/pensions/3rd-level/average-charts?pension_plan=PP5&startDate=2001-01-01", "lv3_PP5_full.json")

(OUT / "summary.txt").write_text("\n".join(LOG), encoding="utf-8")
