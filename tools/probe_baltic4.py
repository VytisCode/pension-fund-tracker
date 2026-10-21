"""Patikra: kokių dar duomenų turi manapensija.lv ir pensionikeskus.ee (dalyviai, turtas, portfeliai, išėjimai, reformos statistika).
Rezultatai – probe_out/ (nuorodų sąrašai, API adresai iš JS, puslapių santraukos)."""
import json
import re
import time
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"
out = Path("probe_out")
out.mkdir(exist_ok=True)
log = []


def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60) as r:
            b = r.read()
            log.append(f"{r.status} {len(b)} {r.headers.get('content-type')} {url}")
            return b
    except Exception as e:
        log.append(f"ERR {e} {url}")
        return b""


def text(b):
    for enc in ("utf-8", "utf-16"):
        try:
            return b.decode(enc)
        except UnicodeDecodeError:
            pass
    return b.decode("latin-1")


# ---------- Estija ----------
EE = "https://www.pensionikeskus.ee"
seen, links = set(), set()
queue = [f"{EE}/en/statistics/", f"{EE}/en/statistics/ii-pillar/", f"{EE}/en/statistics/iii-pillar/", f"{EE}/en/",
         f"{EE}/en/ii-pillar/", f"{EE}/en/sitemap/"]
while queue and len(seen) < 120:
    u = queue.pop(0)
    if u in seen:
        continue
    seen.add(u)
    h = text(get(u))
    for l in re.findall(r'href="([^"#]+)"', h):
        l = l if l.startswith("http") else EE + l if l.startswith("/") else None
        if not l or "pensionikeskus.ee" not in l:
            continue
        l = l.split("?")[0]
        links.add(l)
        if "/en/statistics/" in l and l not in seen:
            queue.append(l)
    time.sleep(0.3)
(out / "ee_links.txt").write_text("\n".join(sorted(links)), encoding="utf-8")
# statistikos puslapių antraštės ir lentelių pradžia
summ = []
for u in sorted(l for l in links if "/en/statistics/" in l):
    h = text(get(u))
    t = re.search(r"<h1[^>]*>(.*?)</h1>", h, re.S)
    mt = re.search(r"<table.*?</table>", h, re.S)
    tbl = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", mt.group(0) if mt else ""))[:600]
    h1 = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", t.group(1))).strip() if t else ""
    summ.append("== " + u + "\n" + h1 + "\n" + tbl + "\n")
    time.sleep(0.3)
(out / "ee_stats.txt").write_text("\n".join(summ), encoding="utf-8")

# ---------- Latvija ----------
LV = "https://www.manapensija.lv"
home = text(get(LV + "/"))
sm = text(get(LV + "/sitemap.xml"))
(out / "lv_sitemap.txt").write_text("\n".join(re.findall(r"<loc>(.*?)</loc>", sm)), encoding="utf-8")
js = sorted(set(re.findall(r'(/_nuxt/[^"\']+\.js)', home)))
api = set()
for j in js[:60]:
    s = text(get(LV + j))
    api |= set(re.findall(r'["\'`](/?api/[A-Za-z0-9_\-/{}$.]+)', s))
    api |= set(re.findall(r'["\'`]([a-z0-9\-]+/(?:2nd|3rd)-level[A-Za-z0-9_\-/]*)', s))
(out / "lv_api.txt").write_text("\n".join(sorted(api)), encoding="utf-8")
# plāna lapa: visi NUXT bloki ir jų laukai
pl = [l for l in re.findall(r"<loc>(.*?)</loc>", sm) if l.count("/") >= 4][:400]
(out / "lv_deep_urls.txt").write_text("\n".join(pl), encoding="utf-8")
keys = {}
for u in [x for x in pl if "plan" in x or "plans" in x][:3] + pl[:3]:
    h = text(get(u))
    m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', h, re.S)
    if m:
        a = json.loads(m.group(1))
        keys[u] = sorted({k for x in a if isinstance(x, dict) for k in x})[:300]
        keys[u + " types"] = sorted({x.get("type") for x in a if isinstance(x, dict) and isinstance(x.get("type"), str)})
    time.sleep(0.3)
(out / "lv_page_keys.json").write_text(json.dumps(keys, ensure_ascii=False, indent=1), encoding="utf-8")
# žinomi / spėjami API: statistika, dalyviai, aktyvai
for a in sorted(api)[:80]:
    if "{" in a or "$" in a:
        continue
    u = LV + "/" + a.lstrip("/")
    b = get(u + ("&" if "?" in u else "?") + "pension_plan=1")
    if b[:1] in (b"{", b"["):
        (out / ("lv_api_" + re.sub(r"\W+", "_", a)[:60] + ".json")).write_bytes(b[:20000])
    time.sleep(0.3)
(out / "summary.txt").write_text("\n".join(log), encoding="utf-8")
print("\n".join(log[-50:]))
