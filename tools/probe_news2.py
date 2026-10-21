"""Vienkartinė naujienų istorija: tools/fetch_news.py --backfill 2019-01 ir kasdienis rinkimas į probe_out/ (data/ nekeičiama)."""
import subprocess
import sys
from pathlib import Path

out = Path("probe_out")
out.mkdir(exist_ok=True)
log = ""
for a in (["--backfill", "2019-01"], []):
    r = subprocess.run([sys.executable, "-u", "tools/fetch_news.py", str(out)] + a, capture_output=True, text=True)
    log += r.stdout[-6000:] + "\n" + r.stderr[-3000:] + "\n"
(out / "summary.txt").write_text(log, encoding="utf-8")
print(log)
