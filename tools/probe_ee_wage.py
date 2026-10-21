"""Vienkartinė patikra: kur Statistikaameti PxWeb medyje yra vidutinio bruto darbo užmokesčio (ketvirčių) lentelė. Rezultatas – probe_out/eewage.txt."""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("probe_out"); OUT.mkdir(exist_ok=True)
LOG = (OUT / "eewage.txt").open("w", encoding="utf-8")
EE = "https://andmed.stat.ee/api/v1/en/stat"


def get(u):
    req = urllib.request.Request(urllib.parse.quote(u, safe=":/?=&.%-_"), headers={"User-Agent": "pension-fund-tracker"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read())


def walk(path, depth, budget):
    if depth > 5 or budget[0] <= 0:
        return
    budget[0] -= 1
    try:
        items = get(f"{EE}/{path}" if path else EE)
    except Exception as e:
        LOG.write(f"ERR {path}: {e}\n"); return
    time.sleep(0.15)
    for it in items:
        txt, iid, typ = it.get("text", ""), it.get("id", ""), it.get("type", "")
        p = f"{path}/{iid}" if path else iid
        if typ == "l":
            LOG.write(f"{'  ' * depth}DIR {p} | {txt}\n")
            if depth < 1 or any(k in (txt + iid).lower() for k in ("wage", "palk", "labour", "töö", "earn", "salar")):
                walk(p, depth + 1, budget)
        elif typ == "t" and ("wage" in txt.lower() or iid.upper().startswith("PA")):
            LOG.write(f"{'  ' * depth}TABLE {p} | {txt}\n")


walk("", 0, [300])
LOG.close()
print((OUT / "eewage.txt").read_text(encoding="utf-8")[:20000])
