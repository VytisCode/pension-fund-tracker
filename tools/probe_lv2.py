"""Patikra 2: bank.lv pensiju fondu uzraudzības statistika (failai) ir manapensija.lv plāno puslapio failų sąrašas (ataskaitos)."""
import json
import re
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
out = Path("probe_out"); out.mkdir(exist_ok=True)
L = []


def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60) as r:
            b = r.read(); L.append(f"== {r.status} {r.headers.get('content-type')} {len(b)} {r.geturl()}"); return b
    except Exception as e:
        L.append(f"== ERR {e} {u}"); return b""


h = get("https://www.bank.lv/statistika/dati-statistika/uzraudzibas-statistika").decode("utf-8", "replace")
i = h.find("pensiju-fondu-uzraudzibas-statistika")
L.append(re.sub(r"\s+", " ", h[i:i + 6000]))
fl = []
for m in re.finditer(r'href="([^"]+\.(?:xlsx?|csv|zip|pdf))"[^>]*>(.*?)</a>', h, re.S | re.I):
    u = m.group(1); u = u if u.startswith("http") else "https://www.bank.lv" + u
    fl.append((u, re.sub(r"\s+", " ", re.sub("<[^>]+>", "", m.group(2))).strip()))
L.append("FILES:\n" + "\n".join(f"  {t[:80]} -> {u}" for u, t in fl))
for k, (u, t) in enumerate([x for x in fl if re.search(r"pensij|VFPS|PPF|fond", x[0] + x[1], re.I) and re.search(r"xlsx?$", x[0], re.I)][:4]):
    b = get(u)
    (out / f"lv_bank_{k}{Path(u).suffix}").write_bytes(b)
# manapensija plāna lapa – failų id
sm = get("https://www.manapensija.lv/sitemap.xml").decode("utf-8", "replace")
locs = re.findall(r"<loc>(.*?)</loc>", sm)
L.append("sitemap: %d %s" % (len(locs), [l for l in locs if "plan" in l][:5]))
for u in [l for l in locs if re.search(r"plan", l)][:2]:
    p = get(u).decode("utf-8", "replace")
    ids = sorted(set(re.findall(r"files\?id=(\d+)[^\"']*", p)))
    L.append(f"{u} file ids {ids[:40]}")
    m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', p, re.S)
    if m:
        a = json.loads(m.group(1))
        fs = [x for x in a if isinstance(x, str) and re.search(r"pārskat|ceturk|report|\.pdf", x, re.I)]
        L.append("nuxt strings: " + " | ".join(fs[:60]))
        (out / "lv_plan_nuxt.json").write_text(json.dumps(a, ensure_ascii=False)[:300000], encoding="utf-8")
(out / "lv2.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:3000])
