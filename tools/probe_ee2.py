"""Patikra EE 2: fetch_ee_reports.py visiems fondams (rezultatas – probe_out/ee_holdings.csv)."""
import shutil, subprocess, sys
from pathlib import Path
out = Path("probe_out"); out.mkdir(exist_ok=True)
subprocess.run("command -v pdftotext >/dev/null || sudo apt-get install -y -q poppler-utils >/dev/null", shell=True)
shutil.copy("data/baltic_ee_meta.csv", out / "baltic_ee_meta.csv")
subprocess.run([sys.executable, "-u", "tools/fetch_ee_reports.py", str(out)], timeout=15 * 60)
