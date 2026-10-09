#!/usr/bin/env python3
"""Vienkartinė šaltinių patikra „Kelias į pensiją“ puslapiui (paleidžiama per „Probe III pillar sources“ workflow).

Nieko neįrašo į data/. Rezultatai -> probe_out/ (workflow juos įkelia į šaką probe-results):
- Sodros anuitetų skaičiuoklė: puslapis, tinklo užklausos ir rezultatai kelioms sumoms / amžiams;
- Anuitetų dydžių apskaičiavimo metodika (e-tar.lt);
- pasaulio akcijų / S&P 500 indeksų istorija (MSCI, Yahoo, Stooq) ir ECB EUR/USD kursas;
- Valstybės duomenų agentūros VKI (osp-rs.stat.gov.lt) ir Eurostat SVKI.
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
      "Accept": "*/*"}
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a)
    print(s, flush=True)
    LOG.append(s)


def get(name, url, headers=None):
    try:
        req = urllib.request.Request(url, headers={**UA, **(headers or {})})
        with urllib.request.urlopen(req, timeout=60) as r:
            body = r.read()
        (OUT / name).write_bytes(body)
        log("OK", name, len(body), url)
        return body
    except Exception as e:  # noqa: BLE001
        log("FAIL", name, url, repr(e)[:200])
        return None


def indexes():
    for code, nm in [("990100", "msci_world"), ("892400", "msci_acwi"), ("984000", "msci_usa")]:
        for var in ["NETR", "STRD"]:
            get(f"{nm}_{var}_EUR.json", "https://app2.msci.com/products/service/index/indexmaster/getLevelDataForGraph"
                f"?currency_symbol=EUR&index_variant={var}&start_date=19990101&end_date=20261231&data_frequency=DAILY&index_codes={code}")
    for sym in ["%5ESP500TR", "%5EGSPC", "IWDA.AS", "SXR8.DE", "EUNL.DE"]:
        get(f"yahoo_{sym.replace('%5E', '')}.json", f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}?period1=946684800&period2=1830000000&interval=1d&events=div")
    get("stooq_spx.csv", "https://stooq.com/q/d/l/?s=%5Espx&i=d")
    get("stooq_spxtr.csv", "https://stooq.com/q/d/l/?s=%5Espxtr&i=d")
    get("ecb_eurusd.csv", "https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?format=csvdata")
    get("fred_sp500.csv", "https://fred.stlouisfed.org/graph/fredgraph.csv?id=SP500")


def cpi():
    get("eurostat_hicp_lt.json", "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_midx?geo=LT&coicop=CP00&unit=I15&format=JSON")
    flows = get("osp_dataflows.xml", "https://osp-rs.stat.gov.lt/rest_xml/dataflow/")
    if flows:
        txt = flows.decode("utf-8", "replace")
        # dataflow id + pavadinimas, kuriame minimas vartotojų kainų indeksas
        hits = re.findall(r'<str:Dataflow[^>]*id="([^"]+)"[^>]*>(.*?)</str:Dataflow>', txt, re.S)
        keep = []
        for fid, body in hits:
            names = re.findall(r'<com:Name[^>]*>([^<]+)</com:Name>', body)
            if any(re.search(r"vartotoj|consumer price|VKI|kain", n, re.I) for n in names):
                keep.append((fid, names))
        (OUT / "osp_cpi_flows.json").write_text(json.dumps(keep, ensure_ascii=False, indent=1), encoding="utf-8")
        log("osp cpi flows", len(keep))
        for fid, _ in keep[:12]:
            get(f"osp_{fid}.xml", f"https://osp-rs.stat.gov.lt/rest_xml/data/{fid}")


def methodology():
    get("etar_asr.html", "https://www.e-tar.lt/portal/lt/legalAct/a20d8f20a59111ea9515f752ff221ec9/asr")
    get("etar_editions.html", "https://www.e-tar.lt/portal/lt/legalActEditions/a20d8f20a59111ea9515f752ff221ec9")
    get("etar_original.docx", "https://www.e-tar.lt/rs/legalact/a20d8f20a59111ea9515f752ff221ec9/format/MSO2010_DOCX/")
    page = (OUT / "etar_asr.html").read_bytes().decode("utf-8", "replace") if (OUT / "etar_asr.html").exists() else ""
    for i, m in enumerate(sorted(set(re.findall(r'(/rs/[^"\']+?(?:DOCX|ODT|docx|pdf)[^"\']*)', page)))[:10]):
        get(f"etar_link_{i}" + (".docx" if "DOCX" in m.upper() else ".bin"), "https://www.e-tar.lt" + m.replace("&amp;", "&"))


def sodra_calc():
    from playwright.sync_api import sync_playwright
    url = "https://www.sodra.lt/skaiciuokles/pensiju-anuitetu-skaiciuokle"
    reqs = []
    cases = [("1961-01-15", "2026-02-15", 15000), ("1961-01-15", "2026-02-15", 10000), ("1961-01-15", "2026-02-15", 50000),
             ("1961-01-15", "2026-02-15", 100000), ("1959-01-15", "2026-02-15", 50000), ("1955-01-15", "2026-02-15", 50000),
             ("1956-01-15", "2026-02-15", 50000), ("1957-01-15", "2026-02-15", 50000), ("1958-01-15", "2026-02-15", 50000),
             ("1960-01-15", "2026-02-15", 50000), ("1961-07-15", "2026-02-15", 50000), ("1950-01-15", "2026-02-15", 50000)]
    results = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=False)
        pg = b.new_page(locale="lt-LT")
        pg.on("request", lambda r: reqs.append({"m": r.method, "url": r.url, "post": r.post_data}) if r.resource_type in ("xhr", "fetch", "script", "document") else None)
        resp_bodies = []

        def on_resp(r):
            if r.request.resource_type in ("xhr", "fetch"):
                try:
                    resp_bodies.append({"url": r.url, "status": r.status, "body": r.text()[:20000]})
                except Exception as e:  # noqa: BLE001
                    resp_bodies.append({"url": r.url, "err": repr(e)})
        pg.on("response", on_resp)
        pg.goto(url, wait_until="domcontentloaded", timeout=90000)
        pg.wait_for_timeout(8000)
        (OUT / "sodra_calc.html").write_text(pg.content(), encoding="utf-8")
        frames = [f.url for f in pg.frames]
        log("frames", frames)
        # skaičiuoklė gali būti iframe viduje
        target = pg
        for f in pg.frames:
            if f != pg.main_frame and ("skaiciuokl" in f.url or "calc" in f.url or "anuitet" in f.url):
                target = f
        try:
            (OUT / "sodra_calc_frame.html").write_text(target.content(), encoding="utf-8")
        except Exception as e:  # noqa: BLE001
            log("frame content fail", e)
        inputs = target.locator("input")
        log("inputs", inputs.count(), [inputs.nth(i).get_attribute("name") or inputs.nth(i).get_attribute("id") for i in range(inputs.count())])
        for birth, appl, amount in cases:
            try:
                vis = [inputs.nth(i) for i in range(inputs.count()) if inputs.nth(i).is_visible() and (inputs.nth(i).get_attribute("type") or "text") not in ("submit", "button", "checkbox", "radio", "hidden")]
                vals = [birth, appl, str(amount)]
                for el, v in zip(vis, vals):
                    el.fill("")
                    el.fill(v)
                    el.press("Tab")
                btn = target.get_by_text(re.compile("Skai(č|c)iuoti", re.I)).first
                btn.click()
                pg.wait_for_timeout(2500)
                txt = target.locator("body").inner_text()
                results.append({"birth": birth, "appl": appl, "amount": amount, "text": txt[-4000:]})
                log("case", birth, appl, amount, "done")
            except Exception as e:  # noqa: BLE001
                results.append({"birth": birth, "appl": appl, "amount": amount, "err": repr(e)})
                log("case fail", birth, amount, repr(e)[:200])
        pg.screenshot(path=str(OUT / "sodra_calc.png"), full_page=True)
        b.close()
    (OUT / "sodra_requests.json").write_text(json.dumps(reqs, ensure_ascii=False, indent=1), encoding="utf-8")
    (OUT / "sodra_responses.json").write_text(json.dumps(resp_bodies, ensure_ascii=False, indent=1), encoding="utf-8")
    (OUT / "sodra_results.json").write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")
    # skaičiuoklės JS failai (formulė gali būti juose)
    for i, r in enumerate([r for r in reqs if r["url"].endswith(".js") or ".js?" in r["url"]]):
        if "sodra" in r["url"]:
            get(f"sodra_js_{i}.js", r["url"])


def cpi2():
    for fid in ["S7R260_M2020121", "S7R260_M2020122", "S7R260_M2020121_1", "S7R260_M2020122_1",
                "S7R330_M2020121_2", "S7R330_M2020121_3", "S7R330_M2020122_4", "S7R330_M2020122_2"]:
        get(f"osp_{fid}.xml", f"https://osp-rs.stat.gov.lt/rest_xml/data/{fid}")


def cpi3():
    for i, u in enumerate(["https://osp-rs.stat.gov.lt/rest_xml/data/S7R330_M2020121_2/CP00.nera",
                           "https://osp-rs.stat.gov.lt/rest_xml/data/S7R330_M2020121_2/CP00..",
                           "https://osp-rs.stat.gov.lt/rest_xml/data/S7R330_M2020121_2/CP00",
                           "https://osp-rs.stat.gov.lt/rest_xml/data/S7R330_M2020121_2/CP00.nera.?startPeriod=2026M01",
                           "https://osp-rs.stat.gov.lt/rest_xml/datastructure/LSD/M2020121_2"]):
        get(f"cpi3_{i}.xml", u)


def etar_browser():
    """e-tar.lt grąžina 403 paprastoms užklausoms – bandoma per naršyklę."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(headless=False)
        pg = b.new_page(locale="lt-LT")
        for name, url in [("etar_asr", "https://www.e-tar.lt/portal/lt/legalAct/a20d8f20a59111ea9515f752ff221ec9/asr"),
                          ("etar_print", "https://www.e-tar.lt/portal/lt/legalActPrint?documentId=a20d8f20a59111ea9515f752ff221ec9")]:
            try:
                pg.goto(url, wait_until="domcontentloaded", timeout=90000)
                pg.wait_for_timeout(10000)
                (OUT / f"{name}.html").write_text(pg.content(), encoding="utf-8")
                (OUT / f"{name}.txt").write_text(pg.locator("body").inner_text(), encoding="utf-8")
                for fr in pg.frames[1:]:
                    try:
                        (OUT / f"{name}_frame.txt").write_text(fr.locator("body").inner_text(), encoding="utf-8")
                    except Exception:  # noqa: BLE001
                        pass
                log("etar ok", name)
            except Exception as e:  # noqa: BLE001
                log("etar fail", name, repr(e)[:200])
        b.close()


def pensions():
    """Vidutinė senatvės pensija: osp.stat.gov.lt pagrindiniai rodikliai ir sodra.lt statistika (puslapiai generuojami JS)."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(headless=False)
        pg = b.new_page(locale="lt-LT")
        for name, url in [("osp_rodikliai", "https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai"),
                          ("sodra_rodikliai", "https://www.sodra.lt/statistika/pagrindiniai-socialiniai-rodikliai")]:
            try:
                pg.goto(url, wait_until="domcontentloaded", timeout=90000)
                pg.wait_for_timeout(15000)
                (OUT / f"{name}.txt").write_text(pg.locator("body").inner_text(), encoding="utf-8")
                log("ok", name)
            except Exception as e:  # noqa: BLE001
                log("fail", name, repr(e)[:200])
        b.close()


def pensions_sdmx():
    """Vidutinė senatvės pensija iš osp-rs.stat.gov.lt SDMX (be Cloudflare)."""
    flows = get("osp_dataflows.xml", "https://osp-rs.stat.gov.lt/rest_xml/dataflow/")
    if not flows:
        return
    txt = flows.decode("utf-8", "replace")
    hits = re.findall(r'<str:Dataflow[^>]*id="([^"]+)"[^>]*>(.*?)</str:Dataflow>', txt, re.S)
    keep = [(fid, re.findall(r'<com:Name[^>]*>([^<]+)</com:Name>', body)) for fid, body in hits]
    keep = [(fid, n) for fid, n in keep if any(re.search(r"pensij|pension", x, re.I) for x in n)]
    (OUT / "osp_pension_flows.json").write_text(json.dumps(keep, ensure_ascii=False, indent=1), encoding="utf-8")
    log("osp pension flows", len(keep))
    for fid, n in keep:
        if any(re.search(r"senatv|old-age", x, re.I) for x in n) and any(re.search(r"vidutin|average", x, re.I) for x in n):
            get(f"osp_{fid}.xml", f"https://osp-rs.stat.gov.lt/rest_xml/data/{fid}")


if __name__ == "__main__":
    want = sys.argv[1:] or ["indexes", "cpi", "methodology", "sodra"]
    for w in want:
        try:
            {"indexes": indexes, "cpi": cpi, "cpi2": cpi2, "cpi3": cpi3, "etar": etar_browser, "pensions": pensions, "pensions_sdmx": pensions_sdmx, "methodology": methodology, "sodra": sodra_calc}[w]()
        except Exception as e:  # noqa: BLE001
            log("STEP FAIL", w, repr(e))
    (OUT / "log.txt").write_text("\n".join(LOG), encoding="utf-8")
