"""Patikra 8: manapensija.lv „Lejupielādēt visu vēsturi“ (II ir III pakopos plānų istorija: turtas, dalyviai, vieneto vertė)
ir ?date= parametras senoms datoms. Nieko neįrašo į data/; failai – probe_out/."""
import re, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
B = "https://www.manapensija.lv/api/data/"
L = []
U = ["pension-2nd-level-plan-history", "pension-2nd-level-plan-history?format=csv", "pensions/3rd-level/history",
     "pensions/3rd-level/history?format=csv", "pension-2nd-level-plans?format=csv", "pensions/3rd-level/plans?format=csv"]
for d in ("2026-06-30", "2024-12-31", "2020-12-31", "2015-12-31", "2010-12-31", "2005-12-30"):
    U += [f"pension-2nd-level-plans?date={d}", f"pensions/3rd-level/plans?date={d}"]
for u in U:
    try:
        r = urllib.request.urlopen(urllib.request.Request(B + u, headers={"User-Agent": UA}), timeout=180)
        b = r.read(); ct = r.headers.get("Content-Type", ""); cd = r.headers.get("Content-Disposition", "")
    except Exception as e:
        L.append(f"ERR {u} {e}"); continue
    fn = out / (re.sub(r"\W+", "_", u)[:80] + (".csv" if "csv" in ct or "format=csv" in u else ".json"))
    fn.write_bytes(b)
    t = b.decode("utf-8-sig", "replace")
    L.append(f"== {u} {ct} {cd} {len(b)} bytes, lines {t.count(chr(10))}")
    L.append("   head " + t[:700].replace("\n", " | "))
    L.append("   tail " + t[-400:].replace("\n", " | "))
    ds = re.findall(r"(?:19|20)\d\d-\d\d-\d\d|\d\d\.\d\d\.(?:19|20)\d\d", t)
    if ds: L.append(f"   dates {len(ds)} min {min(ds)} max {max(ds)}")
(out / "baltic8.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L))
