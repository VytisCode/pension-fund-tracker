"""Vienkartinė patikra: Estijos ir Latvijos statistikos PxWeb API – kur yra vidutinio darbo užmokesčio ir vidutinės senatvės pensijos
lentelės (Baltijos „Kelias į pensiją“, savininkas 2026-10-21). Rezultatai – probe_out/macro.txt (šaka probe-results)."""
import json
import time
import urllib.request
from pathlib import Path

OUT = Path("probe_out"); OUT.mkdir(exist_ok=True)
LOG = (OUT / "macro.txt").open("w", encoding="utf-8")
KEYS = ("wage", "salar", "earn", "pension", "old-age", "minimum")


def get(u):
    req = urllib.request.Request(u, headers={"User-Agent": "pension-fund-tracker"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read())


def walk(base, path, depth, budget):
    if depth > 6 or budget[0] <= 0:
        return
    budget[0] -= 1
    try:
        items = get(f"{base}/{path}" if path else base)
    except Exception as e:
        LOG.write(f"ERR {base}/{path}: {e}\n"); return
    time.sleep(0.25)
    for it in items:
        txt, iid, typ = it.get("text", ""), it.get("id", ""), it.get("type", "")
        p = f"{path}/{iid}" if path else iid
        low = txt.lower()
        if typ == "t":
            if any(k in low for k in KEYS):
                LOG.write(f"TABLE {base}/{p} | {txt}\n")
        elif typ == "l" and (depth < 2 or any(k in low for k in ("labour", "work", "wage", "social", "pension", "income", "employ", "salar", "living"))):
            walk(base, p, depth + 1, budget)


for base in ("https://andmed.stat.ee/api/v1/en/stat", "https://data.stat.gov.lv/api/v1/en/OSP_PUB"):
    LOG.write(f"== {base}\n")
    walk(base, "", 0, [400])
    LOG.flush()
LOG.close()
print((OUT / "macro.txt").read_text(encoding="utf-8")[:20000])
