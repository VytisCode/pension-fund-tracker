#!/usr/bin/env python3
"""Patikra: SEB III pakopos fondo puslapio „Istorinės fondo vieneto vertės“ atsisiuntimas. Rezultatai -> probe_out/."""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import fund_links
from playwright.sync_api import sync_playwright

OUT = Path("probe_out"); OUT.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
rep = {}
with sync_playwright() as pw:
    br = pw.chromium.launch(headless=True, args=["--no-sandbox"])
    ctx = br.new_context(user_agent=UA, locale="lt-LT", accept_downloads=True)
    page = ctx.new_page()
    reqs = []
    page.on("request", lambda r: reqs.append(f"{r.method} {r.url[:300]}"))
    for i, (fund, href) in enumerate(list(fund_links.SEB_III_DETAILS.items())[:2]):
        r = {"href": href}
        reqs.clear()
        page.goto(href, wait_until="domcontentloaded", timeout=90000)
        page.wait_for_timeout(3000)
        (OUT / f"seb_{i}.html").write_text(page.content(), encoding="utf-8")
        page.screenshot(path=str(OUT / f"seb_{i}.png"), full_page=True)
        els = page.query_selector_all("a, button, input[type=submit], input[type=button]")
        r["candidates"] = []
        for e in els:
            t = " ".join((e.inner_text() or e.get_attribute("value") or "").split())
            if "istor" in t.lower() or "csv" in t.lower() or "excel" in t.lower() or "atsisi" in t.lower():
                r["candidates"].append({"text": t, "tag": e.evaluate("e=>e.tagName"), "href": e.get_attribute("href"),
                                        "onclick": e.get_attribute("onclick"), "outer": e.evaluate("e=>e.outerHTML")[:600],
                                        "visible": e.is_visible(), "box": e.bounding_box()})
        r["frames"] = [f.url for f in page.frames]
        r["reqs_load"] = reqs[:60]
        link = page.query_selector("a:has-text('Istorinės fondo vieneto vertės')") or page.query_selector("a:has-text('Istorinės')")
        if link:
            reqs.clear()
            try:
                with page.expect_download(timeout=20000) as dl:
                    link.click(timeout=10000, force=True)
                p = Path(dl.value.path()); raw = p.read_bytes()
                r["download"] = {"name": dl.value.suggested_filename, "len": len(raw), "head": raw[:600].decode("cp1257", "replace")}
            except Exception as exc:
                r["click_error"] = str(exc)[:400]
            page.wait_for_timeout(3000)
            r["reqs_click"] = reqs[:40]
            r["url_after"] = page.url
            (OUT / f"seb_{i}_after.html").write_text(page.content(), encoding="utf-8")
            page.screenshot(path=str(OUT / f"seb_{i}_after.png"), full_page=True)
        rep[fund] = r
    br.close()
(OUT / "seb_hist_report.json").write_text(json.dumps(rep, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(rep, ensure_ascii=False, indent=1)[:4000])
