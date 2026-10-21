"""Patikra: Latvijos II pakopos plānų turtas, dalyviai ir portfeliai – Latvijas Banka (finanšu sektora rādītāji), manapensija.lv failų API,
CSP PxWeb. Rezultatai – probe_out/lv.txt ir pavyzdiniai failai."""
import json
import re
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
out = Path("probe_out"); out.mkdir(exist_ok=True)
L = []


def get(u, n=0):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60) as r:
            b = r.read()
            L.append(f"== {r.status} {r.headers.get('content-type')} {len(b)} {r.geturl()}")
            return b
    except Exception as e:
        L.append(f"== ERR {e} {u}")
        return b""


def links(h, base):
    h = h.decode("utf-8", "replace")
    out = []
    for m in re.finditer(r'href="([^"]+)"[^>]*>(.*?)</a>', h, re.S):
        u, t = m.group(1), re.sub(r"\s+", " ", re.sub("<[^>]+>", "", m.group(2))).strip()
        if u.startswith("/"):
            u = base + u
        out.append((u, t))
    return out


for u, base in [("https://cdn.latvijasbanka.lv/darbibas-jomas/uzraudziba/finansu-sektora-darbibas-raditaji", "https://cdn.latvijasbanka.lv"),
                ("https://www.latvijasbanka.lv/darbibas-jomas/uzraudziba/finansu-sektora-darbibas-raditaji", "https://www.latvijasbanka.lv"),
                ("https://www.bank.lv/statistika/dati-statistika/finansu-sektora-darbibas-raditaji", "https://www.bank.lv")]:
    ls = links(get(u), base)
    L.append(f"links {len(ls)}")
    for x in ls:
        if re.search(r"xls|csv|pdf|pensij|fondēt|VFPS|PPF", x[0] + x[1], re.I):
            L.append(f"   {x[1][:90]} -> {x[0]}")
# pirmas rastas VFPS xlsx – parsisiųsti pavyzdį
seen = [l.split(" -> ")[1] for l in L if " -> " in l and re.search(r"\.xlsx?$", l, re.I) and re.search(r"VFPS|pensij|fond", l, re.I)]
for i, u in enumerate(seen[:3]):
    b = get(u)
    if b:
        (out / f"lv_lb_{i}{Path(u).suffix}").write_bytes(b)
# manapensija failų API
for u in ["https://www.manapensija.lv/api/data/files?id=717&level=2", "https://www.manapensija.lv/api/data/files?level=2",
          "https://www.manapensija.lv/api/data/files", "https://www.manapensija.lv/api/data/files/list?level=2",
          "https://www.manapensija.lv/api/data/plans?level=2", "https://www.manapensija.lv/api/data/statistics?level=2",
          "https://www.manapensija.lv/api/contents"]:
    b = get(u)
    L.append("   " + b[:600].decode("utf-8", "replace").replace("\n", " ") if b[:1] in (b"{", b"[") else "   (ne JSON) " + b[:8].hex())
    if b[:4] == b"%PDF":
        (out / "lv_mp_file.pdf").write_bytes(b)
# JS: failų / statistikos API keliai
home = get("https://www.manapensija.lv/").decode("utf-8", "replace")
api = set()
for j in sorted(set(re.findall(r'(/_nuxt/[^"\']+\.js)', home)))[:80]:
    s = get("https://www.manapensija.lv" + j).decode("utf-8", "replace")
    api |= set(re.findall(r'["\'`](/?api/[A-Za-z0-9_\-/{}$.?=&]+)', s))
L.append("API: " + " ".join(sorted(api)))
# CSP PxWeb: pensiju lentelės
b = get("https://data.stat.gov.lv/api/v1/lv/OSP_PUB/START/VES/PP/PPP")
L.append("   " + b[:2500].decode("utf-8", "replace"))
(out / "lv.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:4000])
