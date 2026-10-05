#!/usr/bin/env python3
"""III pakopos patikra, 3 dalis: Artea (api.sb.lt) ir Goindex (dapi) API su rastais fondų kodais."""
import json
import os
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

ARTEA = {"S022": "Artea Stabilus 58+", "S032": "Artea Subalansuotas 47+", "S033": "Artea Ambicingas 16+",
         "S021": "Artea Ambicingas Active 16+", "S058": "Artea Ambicingas Index 16+"}
GOINDEX = {"S057": "Goindex subalansuotas", "S056": "Goindex pasaulio akcijų"}


def log(text):
    print(text)
    with open(OUT / "api_c.txt", "a", encoding="utf-8") as f:
        f.write(text + "\n")


def get(url, headers=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json",
                                               "Origin": "https://www.goindex.lt",
                                               "Referer": "https://www.goindex.lt/", **(headers or {})})
    with urllib.request.urlopen(req, timeout=40) as r:
        return r.status, r.read().decode("utf-8", errors="ignore")


def summarize_history(label, body):
    try:
        data = json.loads(body)
    except Exception:
        log(f"  {label}: not JSON: {body[:300]}")
        return
    if isinstance(data, list) and data:
        log(f"  {label}: {len(data)} records; first={json.dumps(data[0], ensure_ascii=False)} "
            f"last={json.dumps(data[-1], ensure_ascii=False)}")
    else:
        log(f"  {label}: {str(data)[:500]}")


def main():
    log("===== Artea api.sb.lt History")
    for code, name in {**ARTEA, **GOINDEX}.items():
        try:
            s, b = get("https://api.sb.lt/funds-api/Prices/History?" + urllib.parse.urlencode({"fundCode": code}))
            summarize_history(f"{code} {name} ({s})", b)
        except Exception as exc:
            log(f"  {code} {name}: {exc}")

    key = os.getenv("GOINDEX_API_SECRET_KEY", "")
    log("===== Goindex dapi")
    paths = ["v1/funds/summary/tab", "v1/funds/history", "v1/funds/prices", "v1/funds/chart",
             "v1/funds/summary", "v1/funds/summary/chart", "v1/funds/prices/history"]
    for code in list(GOINDEX) + ["GOX-03/09"]:
        for path in paths:
            q = urllib.parse.urlencode({"secret_key": key, "code": code})
            try:
                s, b = get(f"https://dapi.goindex.lt/{path}?{q}")
                log(f"  {code} {path}: {s} len={len(b)} {b[:400]}")
            except Exception as exc:
                log(f"  {code} {path}: {exc}")


if __name__ == "__main__":
    main()
