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
    "index.html": [("#gT tbody tr", 7), ("#mgT tbody tr", 5), ("#qfTable tbody tr", 6)],
    "review.html": [],
    "performance.html": [("#tRet tbody tr", 8), ("#tOv tbody tr", 5)],
    "performance3.html": [("#tSum tbody tr", 3)],
    "pillar3.html": [("#all tbody tr", 10)],
    "overview.html": [],
    "manager.html": [],
    "portfolios.html": [("#ovChg tbody tr", 5)],
    "aum.html": [],
    "reports.html": [("#calTable tbody tr", 5)],
    "journey.html": [("#annTable tbody tr", 1)],
    "ops.html": [],
    "apie.html": [],
}


def serve():
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass
    handler = functools.partial(Quiet, directory=str(DOCS))
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


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
            for page_name, checks in CHECKS.items():
                if not (DOCS / page_name).exists():
                    problems.append(f"{page_name}: failo nėra")
                    continue
                pg = browser.new_page(viewport={"width": 1300, "height": 900})
                errs = []
                pg.on("pageerror", lambda e, errs=errs: errs.append(str(e)[:160]))
                try:
                    pg.goto(base + page_name, wait_until="load", timeout=60000)
                    pg.wait_for_timeout(2500)
                    for sel, n in checks:
                        got = pg.locator(sel).count()
                        if got < n:
                            problems.append(f"{page_name}: {sel} – {got} (laukta ≥ {n})")
                    txt = len(pg.inner_text("body"))
                    if txt < 400:
                        problems.append(f"{page_name}: puslapis beveik tuščias ({txt} simb.)")
                except Exception as e:  # noqa: BLE001
                    problems.append(f"{page_name}: neatsidarė ({e.__class__.__name__})")
                problems += [f"{page_name}: JS klaida – {x}" for x in errs[:3]]
                pg.close()
            browser.close()
    finally:
        srv.shutdown()
    if problems:
        print("Svetainės patikra – rasta problemų:\n  " + "\n  ".join(problems))
        source_status.fail("site", "; ".join(problems)[:500], "format")
    else:
        print(f"Svetainės patikra: visi {len(CHECKS)} puslapiai atsidaro be klaidų, lentelės užpildytos.")
        source_status.ok("site", f"{len(CHECKS)} puslapiai")
    return 0


if __name__ == "__main__":
    sys.exit(main())
