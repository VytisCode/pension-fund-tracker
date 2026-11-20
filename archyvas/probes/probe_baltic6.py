"""Patikra: Baltijos šalių (LV, EE) viešų pensijų statistikos šaltinių paieška.

Nieko neįrašo į data/. Kiekvienam pradiniam puslapiui surenka to paties domeno nuorodas su raktažodžiais
(statistika, fondai, dalyviai, įmokos ...), aplanko jas (1 lygis) ir užrašo: būseną, pavadinimą, lentelių skaičių,
failų nuorodas (xlsx/csv/pdf/json). Rezultatas – probe_out/baltic6.txt ir baltic6.json.
Paleidimas: probe_pillar3.yml su script=probe_baltic6.py (svetainės pasiekiamos tik iš GitHub Actions).
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      "Accept-Language": "en,lv,et;q=0.8"}
SEEDS = [
    # Estija
    "https://www.pensionikeskus.ee/en/statistics/",
    "https://www.pensionikeskus.ee/statistika/",
    "https://www.fi.ee/en/statistics",
    "https://statistika.eestipank.ee/",
    "https://www.eestipank.ee/en/statistics",
    # Latvija
    "https://www.manapensija.lv/",
    "https://www.manapensija.lv/sitemap.xml",
    "https://www.vsaa.gov.lv/lv/statistika",
    "https://www.bank.lv/statistika",
    "https://www.bank.lv/en/statistics",
    "https://statdati.bank.lv/",
]
APIS = [
    "https://data.gov.lv/dati/api/3/action/package_search?q=pensiju&rows=50",
    "https://data.gov.lv/dati/api/3/action/package_search?q=pensiju%20pl%C4%81ni&rows=50",
    "https://avaandmed.eesti.ee/api/datasets?search=pension",
    "https://andmed.eesti.ee/api/datasets?search=pension",
]
KW = re.compile(r"statist|statistik|fond|fund|pensij|pension|dalibniek|dalībniek|osalej|member|makse|contribut|iemaks|"
                r"vahetus|switch|pl[aā]n|aktiv|asset|dati|data|report|aruand|p[aā]rskat|kvart|quarter|ii-|iii-|sammas|pillar|limen|līmen", re.I)
FILE = re.compile(r"\.(xlsx?|csv|pdf|json|zip|px)(\?|$)", re.I)
T0 = time.time(); LIMIT = 15 * 60


def get(u, tries=2):
    last = None
    for i in range(tries):
        try:
            r = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40)
            b = r.read(4_000_000)
            return r.status, r.headers.get("Content-Type", ""), b.decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            return e.code, "", ""
        except Exception as e:
            last = e; time.sleep(2)
    return 0, str(last)[:120], ""


def page_info(u, st, ct, h):
    t = re.search(r"<title[^>]*>(.*?)</title>", h, re.S | re.I)
    links = set()
    for m in re.findall(r"""(?:href|src)=["']([^"'#]+)["']""", h):
        links.add(urllib.parse.urljoin(u, m.strip()))
    links |= set(re.findall(r"<loc>([^<]+)</loc>", h))
    links |= set(re.findall(r"https?://[^\s\"'<>]+\.(?:xlsx?|csv|pdf|json|zip)", h, re.I))
    return {"url": u, "status": st, "type": ct[:40], "size": len(h),
            "title": re.sub(r"\s+", " ", t.group(1)).strip()[:120] if t else "",
            "tables": len(re.findall(r"<table", h, re.I)), "links": sorted(links)}


pages, seen = [], set()
for s in SEEDS:
    if time.time() - T0 > LIMIT: break
    st, ct, h = get(s); seen.add(s)
    p = page_info(s, st, ct, h); pages.append(p)
    host = urllib.parse.urlparse(s).netloc
    cand = [l for l in p["links"] if urllib.parse.urlparse(l).netloc == host and KW.search(l) and not FILE.search(l)
            and not re.search(r"\.(css|js|png|jpe?g|svg|ico|woff2?)(\?|$)", l, re.I)]
    for l in cand[:70]:
        if l in seen or time.time() - T0 > LIMIT: continue
        seen.add(l); st2, ct2, h2 = get(l, 1)
        q = page_info(l, st2, ct2, h2); q["from"] = s; pages.append(q)
        time.sleep(0.4)

api = []
for u in APIS:
    st, ct, h = get(u)
    item = {"url": u, "status": st, "size": len(h)}
    try:
        j = json.loads(h)
        res = (j.get("result") or {}).get("results") or j.get("data") or j.get("results") or []
        item["datasets"] = [{"name": d.get("title") or d.get("name"), "org": (d.get("organization") or {}).get("title") if isinstance(d.get("organization"), dict) else d.get("organization"),
                             "res": [r.get("url") for r in d.get("resources", [])][:8]} for d in res[:50] if isinstance(d, dict)]
    except Exception as e:
        item["err"] = str(e)[:80]; item["head"] = h[:300]
    api.append(item)

(out / "baltic6.json").write_text(json.dumps({"pages": pages, "api": api}, ensure_ascii=False, indent=1), encoding="utf-8")
L = []
for p in pages:
    files = [l for l in p["links"] if FILE.search(l)]
    L.append(f"{p['status']} t{p['tables']} {p['size']:>8} {p['url']}  | {p['title']}  files={len(files)}")
    for f in files[:40]: L.append(f"      F {f}")
L.append("\n== API")
for a in api:
    L.append(f"{a['status']} {a['url']} {a.get('err','')}")
    for d in a.get("datasets", []): L.append(f"   D {d['name']} | {d['org']} | {' '.join(x or '' for x in d['res'][:4])}")
(out / "baltic6.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L[:400]))
