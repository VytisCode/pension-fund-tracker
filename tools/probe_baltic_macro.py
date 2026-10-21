"""Vienkartinė patikra: Estijos ir Latvijos statistikos PxWeb API – vidutinio darbo užmokesčio ir vidutinės senatvės pensijos
lentelių vieta ir kintamieji (Baltijos „Kelias į pensiją“, savininkas 2026-10-21). Rezultatai – probe_out/macro.txt (šaka probe-results)."""
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("probe_out"); OUT.mkdir(exist_ok=True)
LOG = (OUT / "macro.txt").open("w", encoding="utf-8")
EE = "https://andmed.stat.ee/api/v1/en/stat"


def get(u):
    req = urllib.request.Request(urllib.parse.quote(u, safe=":/?=&.%-_"), headers={"User-Agent": "pension-fund-tracker"})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.loads(r.read())


def walk(base, path, depth, budget, want):
    if depth > 6 or budget[0] <= 0:
        return
    budget[0] -= 1
    try:
        items = get(f"{base}/{path}" if path else base)
    except Exception as e:
        LOG.write(f"ERR {base}/{path}: {e}\n"); return
    time.sleep(0.2)
    for it in items:
        txt, iid, typ = it.get("text", ""), it.get("id", ""), it.get("type", "")
        p = f"{path}/{iid}" if path else iid
        if typ == "t" and any(k in txt.lower() for k in want):
            LOG.write(f"TABLE {base}/{p} | {txt}\n")
        elif typ == "l" and (depth < 1 or any(k in (txt + iid).lower() for k in ("majandus", "palk", "wage", "salar", "economy", "labour"))):
            walk(base, p, depth + 1, budget, want)


LOG.write("== EE wages\n")
walk(EE, "majandus", 1, [200], ("gross wage", "wages and salar"))
for u in (EE + "/sotsiaalelu/sotsiaalne-kaitse/sotsiaalkindlustus/pensionikindlustus/SK153.PX",
          "https://data.stat.gov.lv/api/v1/en/OSP_PUB/EMP/DS/DSV/DSV010m", "https://data.stat.gov.lv/api/v1/en/OSP_PUB/EMP/DS/DSV/DSV010",
          "https://data.stat.gov.lv/api/v1/en/OSP_PUB/VES/PP/PPP/PPP040", "https://data.stat.gov.lv/api/v1/en/OSP_PUB/EMP/DS/DSM/DSM010"):
    try:
        m = get(u)
        LOG.write(f"\n== META {u}\n{m.get('title')}\n")
        for v in m.get("variables", []):
            LOG.write(f"  {v['code']} | {v['text']} | {list(zip(v['values'], v['valueTexts']))[:40]} ... n={len(v['values'])} last={v['values'][-3:]}\n")
    except Exception as e:
        LOG.write(f"ERR META {u}: {e}\n")
LOG.flush()
# EE wage tables found above – metadata of the first few
for line in (OUT / "macro.txt").read_text(encoding="utf-8").splitlines():
    if line.startswith("TABLE ") and "andmed.stat.ee" in line:
        u = line.split()[1]
        try:
            m = get(u); LOG.write(f"\n== META {u}\n{m.get('title')}\n")
            for v in m.get("variables", []):
                LOG.write(f"  {v['code']} | {v['text']} | {list(zip(v['values'], v['valueTexts']))[:25]} ... n={len(v['values'])} last={v['values'][-3:]}\n")
        except Exception as e:
            LOG.write(f"ERR META {u}: {e}\n")
LOG.close()
print((OUT / "macro.txt").read_text(encoding="utf-8")[:30000])
