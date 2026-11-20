"""Patikra 5: manapensija.lv planų failų sąrašai (/api/data/file-list) ir vienos ketvirčio ataskaitos tekstas (turtas, dalyviai, portfelis?)."""
import csv, json, subprocess, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
B = "https://www.manapensija.lv"
L = []

def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r:
        return r.read(), r.headers.get("content-type")

plans = [r["plan_id"] for r in csv.DictReader(open("data/baltic_lv_plans.csv", encoding="utf-8"))]
L.append(f"planų {len(plans)}")
allf = {}
for pl in plans[:6] + ["046"]:
    for flt in ("", "&filter=quarter", "&type=quarter"):
        try:
            b, ct = get(f"{B}/api/data/file-list?plan={pl}&level=2{flt}")
            L.append(f"== {pl} {flt} {ct} {b[:1500].decode('utf-8', 'replace')}")
            allf[pl + flt] = json.loads(b)
        except Exception as e:
            L.append(f"ERR {pl} {flt} {e}")
(out / "lv5_lists.json").write_text(json.dumps(allf, ensure_ascii=False, indent=1), encoding="utf-8")
for fid in (1091, 717):
    try:
        b, ct = get(f"{B}/api/data/files?id={fid}")
        f = out / f"lv5_{fid}.pdf"; f.write_bytes(b)
        L.append(f"FILE {fid} {ct} {len(b)}")
        t = subprocess.run(["pdftotext", "-layout", str(f), "-"], capture_output=True, text=True).stdout
        (out / f"lv5_{fid}.txt").write_text(t, encoding="utf-8")
        L.append(t[:5000])
    except Exception as e:
        L.append(f"ERR file {fid} {e}")
(out / "lv5.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:3000])
