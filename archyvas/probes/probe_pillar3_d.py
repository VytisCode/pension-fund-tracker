#!/usr/bin/env python3
"""III pakopos patikra, 4 dalis: iš kur Swedbank fondo puslapio grafikas ima istorinius duomenis."""
import json
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")
LIST = "https://www.swedbank.lt/private/pensions/pillar3/allFunds?language=LIT"
STATIC = re.compile(r"\.(js|css|png|jpg|svg|woff2?|gif|ico)(\?|$)", re.I)


def log(text):
    print(text)
    with open(OUT / "swedbank_d.txt", "a", encoding="utf-8") as f:
        f.write(text + "\n")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, args=["--no-sandbox"])
        ctx = browser.new_context(user_agent=UA, locale="lt-LT")
        page = ctx.new_page()
        seen = []

        def on_resp(resp):
            if STATIC.search(resp.url) or "cls_report" in resp.url:
                return
            try:
                body = resp.text()
            except Exception:
                body = ""
            seen.append((resp.request.method, resp.status, resp.url, resp.request.post_data, body))

        page.on("response", on_resp)
        page.goto(LIST, wait_until="networkidle", timeout=90000)
        for btn in page.query_selector_all("ui-cookie-consent button"):
            try:
                btn.click(force=True)
            except Exception:
                pass
        page.wait_for_timeout(1500)
        link = page.locator("tbody tr a", has_text="Pensijos fondas 18+").first
        n_before = len(seen)
        link.click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(4000)
        log(f"detail url: {page.url}")
        for label in ["All", "Visas", "Viskas"]:
            try:
                page.get_by_text(label, exact=True).first.click(timeout=3000)
                log(f"clicked period {label}")
                page.wait_for_timeout(4000)
                break
            except Exception:
                pass
        html = page.content()
        (OUT / "swedbank_detail.html").write_text(html, encoding="utf-8")
        log(f"html size {len(html)}; dates in html: {len(re.findall(r'20[0-2][0-9]-[01][0-9]-[0-3][0-9]', html))}")
        for i, (m, s, u, pd, body) in enumerate(seen[n_before:]):
            dates = len(re.findall(r"20[0-2][0-9][-./][01][0-9][-./][0-3][0-9]", body))
            log(f"REQ {m} {s} {u} post={str(pd)[:300]} len={len(body)} dates={dates}")
            if dates > 20 or len(body) > 20000:
                (OUT / f"swedbank_resp_{i}.txt").write_text(f"{m} {u}\nPOST: {pd}\n\n{body}", encoding="utf-8")
        # Grafiko duomenys gali būti JS kintamuosiuose
        try:
            info = page.evaluate("""() => {
              const out = [];
              if (window.Highcharts && Highcharts.charts) {
                Highcharts.charts.filter(Boolean).forEach((c, i) => c.series.forEach(s =>
                  out.push({chart: i, name: s.name, n: s.options.data ? s.options.data.length : 0,
                            first: s.options.data ? s.options.data.slice(0,2) : null,
                            last: s.options.data ? s.options.data.slice(-2) : null})));
              }
              return out;
            }""")
            log("HIGHCHARTS: " + json.dumps(info)[:3000])
        except Exception as exc:
            log(f"highcharts eval failed: {exc}")
        browser.close()


if __name__ == "__main__":
    main()
