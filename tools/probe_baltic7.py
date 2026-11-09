"""Patikra 7: kolegės (BC) nurodyti šaltiniai.

LV: manapensija.lv /pensiju-2-limena-planu-rezultati ir /pensiju-3-limena-planu-rezultati – ar yra CSV atsisiuntimas
    su turtu (AuM), grąža ir dalyviais; kokie API kreipiniai (XHR) ir koks atsisiunčiamas failas.
EE: pensionikeskus.ee II/III dienos statistika – visi statistikos meniu punktai (ar III pakopai yra dalyviai,
    įmokos, fondų keitimai).
Nieko neįrašo į data/; rezultatai – probe_out/.
"""
import json, re, time, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a); print(s); LOG.append(s)


def get(u):
    try:
        r = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60)
        return r.status, r.headers.get("Content-Type", ""), r.read(6_000_000)
    except urllib.error.HTTPError as e:
        return e.code, "", b""
    except Exception as e:
        return 0, str(e)[:100], b""


LV_PAGES = ["https://www.manapensija.lv/pensiju-2-limena-planu-rezultati", "https://www.manapensija.lv/pensiju-3-limena-planu-rezultati"]
EE_PAGES = ["https://www.pensionikeskus.ee/en/statistics/ii-pillar/funded-pension-daily-statistics/",
            "https://www.pensionikeskus.ee/en/statistics/iii-pillar/suppl-funded-pension-daily-statistics/",
            "https://www.pensionikeskus.ee/en/statistics/"]

# 1) statinis HTML: NUXT blokai, csv/export žodžiai, statistikos meniu
for u in LV_PAGES + EE_PAGES:
    st, ct, b = get(u); h = b.decode("utf-8", "replace")
    n = re.sub(r"\W+", "_", u.split("//")[1])[:80]
    (out / f"{n}.html").write_text(h, encoding="utf-8")
    log(f"== {st} {len(h)} {u}")
    for m in sorted(set(re.findall(r"[^\"'\s<>]{0,80}(?:csv|export|download|lejup)[^\"'\s<>]{0,80}", h, re.I)))[:60]:
        log("   kw", m)
    if "manapensija" in u:
        m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', h, re.S)
        if m:
            a = json.loads(m.group(1))
            for i, x in enumerate(a):
                if isinstance(x, dict) and ("data_endpoint" in x or "type" in x):
                    ep = a[x["data_endpoint"]] if isinstance(x.get("data_endpoint"), int) else x.get("data_endpoint")
                    tp = a[x["type"]] if isinstance(x.get("type"), int) else x.get("type")
                    log("   block", tp, ep, list(x.keys())[:12])
            strs = sorted({s for s in a if isinstance(s, str) and re.search(r"api/|csv|export|aktīv|dalībn|participant|asset", s, re.I)})
            for s in strs[:80]: log("   str", s[:160])
    else:
        for l in sorted(set(re.findall(r'href="(/en/statistics/[^"]+)"', h))): log("   menu", l)

# 2) naršyklė: XHR kreipiniai ir atsisiuntimo mygtukas
try:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(user_agent=UA, accept_downloads=True)
        for u in LV_PAGES:
            pg = ctx.new_page(); reqs = []
            pg.on("request", lambda r: reqs.append((r.method, r.url, r.post_data)) if r.resource_type in ("xhr", "fetch") else None)
            pg.goto(u, wait_until="networkidle", timeout=90000); time.sleep(3)
            log(f"== PW {u}")
            for r in reqs: log("   xhr", r[0], r[1][:250], (r[2] or "")[:200])
            # mygtukai/nuorodos su csv / lejupielādēt
            els = pg.query_selector_all("a, button")
            cands = []
            for e in els:
                t = (e.inner_text() or "").strip(); href = e.get_attribute("href") or ""
                if re.search(r"csv|lejup|download|eksport|export|xls", t + " " + href, re.I):
                    cands.append((t[:60], href[:200])); log("   btn", t[:60], href[:200])
            n0 = len(reqs)
            for e in els:
                t = (e.inner_text() or "").strip(); href = e.get_attribute("href") or ""
                if re.search(r"csv|lejup|download|eksport|export|xls", t + " " + href, re.I):
                    try:
                        with pg.expect_download(timeout=30000) as d:
                            e.click()
                        dl = d.value; fn = out / ("lv_" + re.sub(r"[^\w.]+", "_", dl.suggested_filename))
                        dl.save_as(fn); log("   DOWNLOAD", dl.url[:250], fn.name, fn.stat().st_size)
                        log("   head", fn.read_bytes()[:1500].decode("utf-8", "replace").replace("\n", " | "))
                    except Exception as ex:
                        log("   click err", t[:40], str(ex)[:120])
                    break
            for r in reqs[n0:]: log("   xhr-after-click", r[0], r[1][:250], (r[2] or "")[:200])
            pg.screenshot(path=str(out / ("lv_" + u.rsplit("/", 1)[1] + ".png")), full_page=False)
            pg.close()
        br.close()
except Exception as ex:
    log("PW ERR", ex)

# 3) API kandidatai pagal rastus XHR (bandoma ir CSV formatas)
for l in list(LOG):
    if l.strip().startswith("xhr") and "manapensija.lv/api" in l:
        url = l.split()[2]
        st, ct, b = get(url)
        log("== API", st, ct, len(b), url[:200])
        log("   ", b[:1200].decode("utf-8", "replace").replace("\n", " | "))
        (out / ("api_" + re.sub(r"\W+", "_", url.split("/api/")[1])[:90] + ".txt")).write_bytes(b[:3_000_000])

(out / "baltic7.txt").write_text("\n".join(LOG), encoding="utf-8")
