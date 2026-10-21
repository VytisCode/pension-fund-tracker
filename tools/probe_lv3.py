"""Patikra 3: Latvijas Banka statistikos duomenų bazė (statdb.bank.lv/LB/Data/N) – pensijų plānų lentelės ir eksportas."""
import re
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
out = Path("probe_out"); out.mkdir(exist_ok=True)
L = []


def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=40) as r:
            return r.status, r.headers.get("content-type"), r.read()
    except Exception as e:
        return str(e), "", b""


st, ct, b = get("https://statdb.bank.lv/LB/Data/407")
h = b.decode("utf-8", "replace")
(out / "lv_407.html").write_text(h, encoding="utf-8")
L.append(f"407 {st} {ct} {len(b)}")
L.append("links: " + " ".join(sorted(set(re.findall(r'href="([^"]+)"', h)))[:200]))
L.append("forms/js: " + " ".join(sorted(set(re.findall(r'(?:url|action|src)\s*[:=]\s*["\']([^"\']+)', h)))[:80]))
for n in list(range(380, 440)):
    st, ct, b = get(f"https://statdb.bank.lv/LB/Data/{n}")
    t = re.search(r"<title>(.*?)</title>", b.decode("utf-8", "replace"), re.S)
    h1 = re.findall(r"<h[12][^>]*>(.*?)</h[12]>", b.decode("utf-8", "replace"), re.S)
    L.append(f"{n} {st} {t.group(1).strip()[:120] if t else ''} | {[re.sub('<[^>]+>', '', x).strip()[:100] for x in h1[:3]]}")
for u in ["https://statdb.bank.lv/LB/Data/407/csv", "https://statdb.bank.lv/LB/Export/407", "https://statdb.bank.lv/lb/Data/407?format=csv", "https://statdb.bank.lv/LB/Home/Tree", "https://statdb.bank.lv/LB/"]:
    st, ct, b = get(u)
    L.append(f"{u} -> {st} {ct} {len(b)} {b[:300]!r}")
(out / "lv3.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:3000])
