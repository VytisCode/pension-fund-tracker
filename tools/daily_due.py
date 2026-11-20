"""Kurie kartą per dieną tikrinami šaltiniai šiandien (UTC) dar nepavyko – pagal data/source_status.json.

  python tools/daily_due.py bx.lv_rep bx.vsaa seimas    # -> GitHub Actions išvestis due="bx.lv_rep seimas"

Šaltinis laikomas „atliktu“, kai jo būsena ok == šiandien; klaidos ar dar nebandytas – bandomas vėl kitame paleidime.
"""
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import source_status  # noqa: E402


def due(keys):
    st, today = source_status.load(), source_status._today()
    return [k for k in keys if (st.get(k) or {}).get("ok") != today]


if __name__ == "__main__":
    d = " ".join(due(sys.argv[1:]))
    print(f"Šiandien dar reikia: {d or '–'}")
    out = os.getenv("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as f:
            f.write(f"due={d}\n")
