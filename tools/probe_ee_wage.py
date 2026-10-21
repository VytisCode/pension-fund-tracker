"""Vienkartinė patikra: visos Statistikaameti „palk“ ir archyvo lentelės (EE atlyginimų istorija iki 2021 m.). Rezultatas – probe_out/eewage.txt."""
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


def walk(path, depth, budget, allt):
    if depth > 6 or budget[0] <= 0:
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
            if allt or depth < 1 or any(k in (txt + iid).lower() for k in ("wage", "palk", "arhiiv", "archive", "majandus")):
                walk(p, depth + 1, budget, allt)
        elif typ == "t" and (allt or "wage" in txt.lower()):
            LOG.write(f"{'  ' * depth}TABLE {p} | {txt}\n")


walk("majandus/palk-ja-toojeukulu/palk", 0, [100], True)
LOG.write("\n== ROOT\n")
walk("", 0, [200], False)
for u in ("majandus/palk-ja-toojeukulu/palk/luhiajastatistika",):
    try:
        for it in get(f"{EE}/{u}"):
            if it.get("type") == "t":
                m = get(f"{EE}/{u}/{it['id']}")
                LOG.write(f"\n== META {it['id']} {m.get('title')}\n")
                for v in m.get("variables", []):
                    LOG.write(f"  {v['code']} | {v['text']} | {v['valueTexts'][:8]} ... n={len(v['values'])} first={v['values'][:2]} last={v['values'][-2:]}\n")
    except Exception as e:
        LOG.write(f"ERR {e}\n")
LOG.close()
print((OUT / "eewage.txt").read_text(encoding="utf-8")[:30000])
