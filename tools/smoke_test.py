#!/usr/bin/env python3
"""
Svetainės patikra po kiekvieno sugeneravimo (savininkas 2026-10-16: „kad veiktų ir be Claude“).

Atidaro kiekvieną docs/ puslapį naršyklėje (Playwright, Chromium), surenka JavaScript klaidas ir patikrina,
ar pagrindinės lentelės turi duomenų. Rezultatas įrašomas į data/source_status.json raktu „site“:
  – viskas gerai → ok (pranešimas dingsta);
  – klaida → fail su puslapių ir klaidų sąrašu – matoma vakariniame laiške ir svetainės pranešimuose.
Jei naršyklė neįdiegta (tą dieną jos nereikėjo duomenims), patikra praleidžiama ir būsena nekeičiama.

    python tools/smoke_test.py            # GitHub Actions: būsena įrašoma; vietoje – tik ataskaita ekrane
"""
import functools
import http.server
import socketserver
import sys
import threading
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import source_status  # noqa: E402

DOCS = ROOT / "docs"
# puslapis -> [(CSS selektorius, mažiausias eilučių / elementų skaičius)]
CHECKS = {
    "index.html": [("#gT tbody tr", 7)],
    "facts.html": [("#qfTable tbody tr", 6), ("#qfCards .fact", 8), ("#mfCards .fact", 5), ("#pvCards .fact", 3), ("#p23Cards .fact", 3)],
    "managers.html": [("#mgT tbody tr", 5)],
    "review.html": [],
    "performance.html": [("#tRet tbody tr", 8), ("#tOv tbody tr", 5)],
    "performance3.html": [("#tSum tbody tr", 3), ("#tRet tbody tr", 3)],
    "pillar3.html": [("#all tbody tr", 10)],
    "overview.html": [],
    "manager.html": [],
    "portfolios.html": [("#ovChg tbody tr", 5)],
    "aum.html": [],
    "reports.html": [("#calTable tbody tr", 5)],
    "journey.html": [("#annTable tbody tr", 1)],
    "baltic.html": [("#crTbl tbody tr", 10), ("#mgTbl tbody tr", 3)],
    "baltic_ee.html": [("#tSum tbody tr", 3), ("#tRet tbody tr", 3)],
    "baltic_lv.html": [("#tSum tbody tr", 3), ("#tRet tbody tr", 3)],
    "baltic_ee3.html": [], "baltic_lv3.html": [], "baltic_lt.html": [], "baltic_lt3.html": [],
    # LV/EE kopijos (trys šalys viename dashboard, PERTVARKA-SALYS.md) – generuoja build_site.py iš LT puslapių
    "index_lv.html": [("#gT tbody tr", 3)], "index_ee.html": [("#gT tbody tr", 3)],
    "facts_lv.html": [], "facts_ee.html": [], "review_lv.html": [], "review_ee.html": [],
    "manager_lv.html": [], "manager_ee.html": [],
    "baltic_lv_ov.html": [], "baltic_ee_ov.html": [], "baltic_lv3_ov.html": [], "baltic_ee3_ov.html": [],
    "ops.html": [],
    "how.html": [(".nd", 25)],
    "apie.html": [],
    "present.html": [("#psBar button", 15)],
}

LANG_PAGES = ["index.html", "index_lv.html", "baltic_lv.html", "manager_ee.html", "review_lv.html"]


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(DOCS))
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def check_slides(browser, base: str) -> list:
    """Pristatymas (present.js SLIDES): kiekvienos skaidrės puslapis turi atsidaryti be JS klaidų ir turėti nurodytą skirtuką –
    taip sužinome, jei pakeitus puslapį skaidrė nebetiktų (LT, nes komentarai rašyti pagal LT puslapius)."""
    out = []
    pg = browser.new_page(viewport={"width": 1300, "height": 900})
    try:
        pg.goto(base + "present.html", wait_until="load", timeout=60000)
        slides = pg.evaluate("SLIDES.filter(s => !s.text).map(s => [s.id, slideUrl(s, 'LT')])")
    except Exception as e:  # noqa: BLE001
        pg.close()
        return [f"present.html: skaidrių sąrašas neperskaitytas ({e.__class__.__name__})"]
    pg.close()
    for sid, url in slides:
        if not url:
            out.append(f"pristatymas {sid}: nėra puslapio")
            continue
        tab = dict(x.split("=", 1) for x in url.split("#", 1)[1].split("&") if "=" in x).get("tab") if "#" in url else None
        pg = browser.new_page(viewport={"width": 1300, "height": 900})
        errs = []
        pg.on("pageerror", lambda e, errs=errs: errs.append(str(e)[:120]))
        try:
            pg.goto(base + url, wait_until="load", timeout=60000)
            pg.wait_for_timeout(1200)
            if tab and not pg.locator(f'[data-tab="{tab}"]').count():
                out.append(f"pristatymas {sid}: puslapyje nebėra skirtuko „{tab}“ (pataisyti site/present.js SLIDES)")
        except Exception as e:  # noqa: BLE001
            out.append(f"pristatymas {sid}: neatsidarė ({e.__class__.__name__})")
        out += [f"pristatymas {sid}: JS klaida – {x}" for x in errs[:2]]
        pg.close()
    return out


def main() -> int:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Svetainės patikra praleista: Playwright neįdiegtas.")
        return 0
    srv = serve()
    base = f"http://127.0.0.1:{srv.server_address[1]}/"
    problems = []
    try:
        with sync_playwright() as p:
            try:
                browser = p.chromium.launch()
            except Exception as e:  # noqa: BLE001 – naršyklė neįdiegta šiame paleidime
                print(f"Svetainės patikra praleista: {e.__class__.__name__}")
                return 0
            # (puslapis, kalba): sąsajos kalbos LV ir ET – addStrings3/TX vertimai neturi sugadinti puslapių
            runs = [(n, c, None) for n, c in CHECKS.items()] + [(n, [], lg) for n in LANG_PAGES for lg in ("lv", "et")]
            for page_name, checks, lg in runs:
                if not (DOCS / page_name).exists():
                    problems.append(f"{page_name}: failo nėra")
                    continue
                pg = browser.new_page(viewport={"width": 1300, "height": 900})
                if lg:
                    pg.add_init_script(f"try{{localStorage.setItem('lang','{lg}')}}catch(e){{}}")
                    page_name_l = f"{page_name} [{lg}]"
                else:
                    page_name_l = page_name
                errs = []
                pg.on("pageerror", lambda e, errs=errs: errs.append(str(e)[:160]))
                try:
                    pg.goto(base + page_name, wait_until="load", timeout=60000)
                    pg.wait_for_timeout(2500)
                    for sel, n in checks:
                        got = pg.locator(sel).count()
                        if got < n:
                            problems.append(f"{page_name_l}: {sel} – {got} (laukta ≥ {n})")
                    txt = len(pg.inner_text("body"))
                    if txt < 400:
                        problems.append(f"{page_name_l}: puslapis beveik tuščias ({txt} simb.)")
                except Exception as e:  # noqa: BLE001
                    problems.append(f"{page_name_l}: neatsidarė ({e.__class__.__name__})")
                problems += [f"{page_name_l}: JS klaida – {x}" for x in errs[:3]]
                pg.close()
            problems += check_slides(browser, base)
            browser.close()
    finally:
        srv.shutdown()
    if problems:
        print("Svetainės patikra – rasta problemų:\n  " + "\n  ".join(problems))
        source_status.fail("site", "; ".join(problems)[:500], "format")
    else:
        print(f"Svetainės patikra: visi {len(runs)} puslapiai atsidaro be klaidų, lentelės užpildytos.")
        source_status.ok("site", f"{len(runs)} puslapiai")
    return 0


if __name__ == "__main__":
    sys.exit(main())
