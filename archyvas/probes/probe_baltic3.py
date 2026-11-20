"""Patikra: tools/fetch_baltic.py papildymo režimas su esamais data/baltic_*.csv (kopija probe_out/; data/ nekeičiama)."""
import shutil
import subprocess
import sys
from pathlib import Path

out = Path("probe_out")
out.mkdir(exist_ok=True)
for f in Path("data").glob("baltic_*.csv"):
    shutil.copy(f, out / f.name)
r = subprocess.run([sys.executable, "-u", "tools/fetch_baltic.py", str(out)], capture_output=True, text=True)
(out / "summary.txt").write_text(r.stdout + "\n" + r.stderr, encoding="utf-8")
print(r.stdout, r.stderr)
for f in out.glob("baltic_*.csv"):
    if f.stat().st_size > 5_000_000:
        f.unlink()                    # dideli failai nereikalingi rezultatų šakai
