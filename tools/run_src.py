"""Paleidžia duomenų rinkiklį ir įrašo jo būseną į data/source_status.json (savininkas 2026-11-10: „error priminimai,
kurie atsirastų, jei kažko nepavyktų gauti“). Klaida matoma vakariniame laiške (daily_report.source_lines) ir svetainės
pranešimuose; kitą sėkmingą kartą ji išsivalo pati.

  python tools/run_src.py bx.lv_plans tools/fetch_lv_plans.py --budget 300

Nesėkmė = ne nulinis išėjimo kodas ARBA išvestyje yra „Traceback“ / „nepavyko:“ / „klaida:“ (kai kurie rinkikliai klaidą
tik išspausdina ir tęsia). Išėjimo kodas visada 0, kad vienas šaltinis nesustabdytų kitų.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import source_status as st  # noqa: E402

BAD = re.compile(r"Traceback|nepavyko:|klaida:", re.I)


def main(key, cmd):
    p = subprocess.Popen([sys.executable, "-u", *cmd], cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
    tail, bad = [], None
    for line in p.stdout:
        print(line, end="")
        tail = (tail + [line.rstrip()])[-20:]
        if bad is None and BAD.search(line):
            bad = line.strip()
    rc = p.wait()
    if rc != 0 or bad:
        last = next((l for l in reversed(tail) if l.strip()), "")
        st.fail(key, f"{bad or last} (išėjimo kodas {rc})")
        print(f"[run_src] {key}: NEPAVYKO")
    else:
        st.ok(key)
        print(f"[run_src] {key}: gerai")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2:])
