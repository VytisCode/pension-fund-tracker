"""Patikra 6: kiekvieno LV plano naujausia ketvirčio ataskaita (PDF) ir vieno plano visas ketvirčių sąrašas (puslapiavimas)."""
import csv, json, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}
B = "https://www.manapensija.lv"
L = []

def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60) as r:
        return r.read()

plans = [(r["plan_id"], r["provider"], r["name"]) for r in csv.DictReader(open("data/baltic_lv_plans.csv", encoding="utf-8"))]

def one(p):
    pl = p[0]
    try:
        j = json.loads(get(f"{B}/api/data/file-list?plan={pl}&level=2&type=quarter"))
        it = j["other_files"]["items"]
        if not it:
            return f"{pl} nėra"
        b = get(B + it[0]["url"])
        (out / f"q_{pl}.pdf").write_bytes(b)
        return f"{pl} {it[0]['name']} {len(b)} total={j['meta']['total']} | {p[1]} | {p[2]}"
    except Exception as e:
        return f"{pl} ERR {e}"

with ThreadPoolExecutor(4) as ex:
    L += list(ex.map(one, plans))
pg = []
for n in range(1, 30):                                   # puslapiavimas: ar reikia plan parametro?
    try:
        j = json.loads(get(f"{B}/api/data/file-list?plan=002&level=2&type=quarter&page={n}"))
        pg += [(x["id"], x["name"]) for x in j["other_files"]["items"]]
        if not j["links"]["next"]:
            break
    except Exception as e:
        L.append(f"page {n} ERR {e}"); break
L.append("002 visi: " + json.dumps(pg, ensure_ascii=False))
(out / "lv6.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:3000])
