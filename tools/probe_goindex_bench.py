"""Vienkartinė patikra (2026-11-18): ar Goindex API grąžina lyginamąjį indeksą.
Paleidžiama per probe_pillar3.yml (script=probe_goindex_bench.py); rezultatai – probe_out/goindex_bench.json (šaka probe-results).
Raktas į rezultatus neįrašomas."""
import json
import os
import pathlib
import urllib.error
import urllib.parse
import urllib.request

KEY = os.getenv("GOINDEX_API_SECRET_KEY", "").strip()
BASE = "https://dapi.goindex.lt/v1/funds/"
OUT = pathlib.Path("probe_out"); OUT.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}


def get(path, **q):
    q["secret_key"] = KEY
    url = BASE + path + "?" + urllib.parse.urlencode(q)
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
            body = r.read().decode("utf-8", "ignore")
            try:
                js = json.loads(body)
            except ValueError:
                js = None
            return {"status": r.status, "json": js if js is not None and len(body) < 200000 else None, "len": len(body), "head": body[:1500]}
    except urllib.error.HTTPError as e:
        return {"status": e.code, "head": e.read().decode("utf-8", "ignore")[:500]}
    except Exception as e:  # noqa: BLE001
        return {"error": str(e)[:300]}


def keys(x, pre="", out=None):
    out = out if out is not None else []
    if isinstance(x, dict):
        for k, v in x.items():
            keys(v, f"{pre}.{k}" if pre else k, out)
    elif isinstance(x, list) and x:
        keys(x[0], pre + "[]", out)
    else:
        out.append(pre)
    return out


res = {}
for code in ("S057", "S056", "GOX-61/67"):
    r = get("summary/tab", code=code)
    res[f"summary/tab {code}"] = {**r, "keys": keys(r.get("json"))}
for path in ("history", "history/tab", "chart", "chart/tab", "prices", "summary", "benchmark", "summary/chart", "performance/tab", "returns/tab"):
    r = get(path, code="S057")
    res[f"{path} S057"] = {**r, "keys": keys(r.get("json"))[:200]}
    res[f"{path} S057"].pop("json", None)
(OUT / "goindex_bench.json").write_text(json.dumps(res, ensure_ascii=False, indent=1).replace(KEY, "***") if KEY else json.dumps(res), encoding="utf-8")
print(json.dumps({k: (v.get("status"), v.get("len")) for k, v in res.items()}, ensure_ascii=False))
