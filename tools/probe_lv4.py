"""Patikra 4: statdb.bank.lv lentelės 317/325/327/323 – CSV atsisiuntimas ir „Kopīgot“ JSON nuoroda (Playwright)."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path("probe_out"); out.mkdir(exist_ok=True)
L = []
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(accept_downloads=True)
    for n in (317, 325, 327, 323):
        try:
            pg.goto(f"https://statdb.bank.lv/LB/Data/{n}", timeout=90000); pg.wait_for_timeout(2000)
            L.append(f"== {n} {pg.title()} | {pg.locator('h1, h2').first.inner_text()[:150] if pg.locator('h1, h2').count() else ''}")
            L.append(pg.locator("body").inner_text()[:3000].replace("\n", " | "))
            with pg.expect_download(timeout=90000) as d:
                pg.evaluate("__doPostBack('ctl00$ctl00$Main$Main$lnkCsv','')")
            f = out / f"lv_db_{n}.csv"; d.value.save_as(f); L.append(f"CSV {f.stat().st_size}")
        except Exception as e:
            L.append(f"ERR csv {n} {e}")
        try:
            pg.goto(f"https://statdb.bank.lv/LB/Data/{n}", timeout=90000); pg.wait_for_timeout(1500)
            pg.click("#a1"); pg.wait_for_timeout(1000)
            pg.check("#ctl00_ctl00_Main_Main_lnkToJsonUrl"); pg.wait_for_timeout(500)
            btn = pg.locator("#divShareLink input[type=submit], #divShareLink a, #fancybox-wrap input[type=submit]")
            L.append("share buttons: " + " / ".join(btn.nth(i).evaluate("e => e.outerHTML")[:200] for i in range(min(btn.count(), 6))))
            pg.evaluate("$('#aspnetForm').submit()"); pg.wait_for_timeout(4000)
            u = pg.locator("input.urlLabel").first.input_value() if pg.locator("input.urlLabel").count() else ""
            L.append(f"JSON URL {n}: {u}")
            if u:
                r = pg.request.get(u); L.append(f"   -> {r.status} {r.headers.get('content-type')} {r.text()[:1500]}")
                (out / f"lv_db_{n}.json").write_text(r.text(), encoding="utf-8")
        except Exception as e:
            L.append(f"ERR share {n} {e}")
    b.close()
(out / "lv4.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:4000])
