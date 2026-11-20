"""Patikra EE 1: pensionikeskus.ee fondų puslapiai – fondų kodai ir mėnesio ataskaitų (raport) nuorodos; kelios ataskaitos PDF."""
import csv, re, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
H = {"User-Agent": "Mozilla/5.0"}
get = lambda u: urllib.request.urlopen(urllib.request.Request(u, headers=H), timeout=60).read()
L, seen = [], set()
meta = list(csv.DictReader(open("data/baltic_ee_meta.csv", encoding="utf-8")))
for m in meta:
    path = "ii-pillar/mandatory-pension-funds" if m["pillar"] == "II" else "iii-pillar/supplementary-pension-funds"
    u = f"https://www.pensionikeskus.ee/en/{path}/fid/{m['fund_id']}/"
    try:
        h = get(u).decode("utf-8", "replace")
        rp = sorted(set(re.findall(r"/files/raport/[A-Z0-9]+/[^\"' <>]+", h)), key=lambda x: re.findall(r"_(\d{8})", x)[-1] if re.findall(r"_(\d{8})", x) else "")
        other = sorted(set(re.findall(r'href="([^"]+\.(?:pdf|xlsx?|csv))"', h)))[:15]
        L.append(f"{m['pillar']} {m['fund_id']} {m['fund']} | n={len(rp)} | raport: {rp[-3:]} | files: {other}")
        if m["fund_id"] == "36":
            (out / "ee_fund36.html").write_text(h, encoding="utf-8")
        for r in rp[-1:]:
            mgr = m["fund"].split()[0]
            if mgr not in seen:
                seen.add(mgr)
                b = get("https://www.pensionikeskus.ee" + r)
                (out / f"ee_{m['fund_id']}.pdf").write_bytes(b)
                L.append(f"   saved {r} {len(b)}")
    except Exception as e:
        L.append(f"ERR {m['fund_id']} {u} {e}")
(out / "ee1.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:3000])
