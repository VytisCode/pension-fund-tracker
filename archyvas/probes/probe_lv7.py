"""Patikra 7: LV ataskaitų istorija (fetch_lv_reports.py su dideliu biudžetu) ir EE pensionikeskus fondų kodai mėnesio ataskaitoms."""
import re, shutil, subprocess, sys, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
subprocess.run("sudo apt-get install -y -q poppler-utils >/dev/null", shell=True)
for f in ("baltic_lv_plans.csv", "lv_reports.csv", "lv_holdings.csv"):
    if Path("data", f).exists():
        shutil.copy(Path("data", f), out / f)
L = []
for u in ("https://www.pensionikeskus.ee/en/ii-pillar/funds/", "https://www.pensionikeskus.ee/ii-sammas/fondid/", "https://www.pensionikeskus.ee/en/statistics/ii-pillar/funded-pension-daily-statistics/"):
    try:
        h = urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"}), timeout=60).read().decode("utf-8", "replace")
        L.append(f"== {u} {len(h)}"); L += sorted(set(re.findall(r'href="([^"]*(?:fond|fund)[^"]*)"', h)))[:200]
        L += sorted(set(re.findall(r"raport/[A-Z0-9]+/[^\"' ]+", h)))[:50]
    except Exception as e:
        L.append(f"ERR {u} {e}")
(out / "lv7.txt").write_text("\n".join(L), encoding="utf-8")
subprocess.run([sys.executable, "-u", "tools/fetch_lv_reports.py", str(out), "--budget", "3000", "--minutes", "13"], timeout=17 * 60)
