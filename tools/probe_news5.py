"""Vienkartinė istorija į probe_out/ (data/ nekeičiama; rezultatą Claude patikrina ir perkelia): argumentas –
seimas [kadencijos] | newsbf | enrich [sekundės]. Pradžiai nukopijuojami esami data/news.csv ir data/seimas.csv."""
import shutil
import subprocess
import sys
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
for f in ("news.csv", "seimas.csv"):
    if Path("data", f).exists():
        shutil.copy(Path("data", f), out / f)
a = sys.argv[1:] or ["seimas"]
cmd = {"seimas": ["tools/fetch_seimas.py", str(out), "--backfill"] + a[1:],
       "newsbf": ["tools/fetch_news.py", str(out), "--backfill", "2019-01", "--extra-only"],
       "enrich": ["tools/fetch_news.py", str(out), "--enrich", a[1] if len(a) > 1 else "1000"]}[a[0]]
r = subprocess.run([sys.executable, "-u"] + cmd, capture_output=True, text=True, timeout=1080)
(out / "summary.txt").write_text(r.stdout[-8000:] + "\n" + r.stderr[-4000:], encoding="utf-8")
print(r.stdout[-3000:], r.stderr[-2000:])
