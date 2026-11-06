#!/usr/bin/env python3
"""
Morningstar įrankio atsakymai (JSON failai, kuriuos Claude sesija išsaugo) → normalizuoti CSV, kuriuos skaito
tools/ms_lookthrough.py. Procedūra – MORNINGSTAR.md.

Įvestis (--src aplankas):
  ids.csv                          – isin,ms_id,kind (fund | stock); ms_id – pirmas „F0…“ (fondams) / „0P…“ (akcijoms) iš id-lookup;
  data-*.json                      – morningstar-data-tool atsakymai (su start_date/end_date – laiko eilutės);
  holdings-*.json                  – morningstar-fund-holdings-tool atsakymai (num_holdings=100);
  proxy.csv (nebūtina)             – ms_id,profile_from,holdings_from: analogai, kai fondas savų duomenų neturi
                                     (sintetiniai ETF su swap – fizinis to paties indekso ETF).
Išvestis (--out aplankas, PRIVATUS – /mnt/project-files/morningstar/<ketvirtis>/): ms_profiles.csv, ms_holdings.csv, ms_stocks.csv.
Iš laiko eilučių imama paskutinė reikšmė ne vėliau kaip --date (LB ketvirčio pabaiga).
"""
import argparse
import csv
import glob
import json
from pathlib import Path

SEC = dict(AA03K="basic_materials", AA03L="communication", AA03M="consumer_cyclical", AA03N="consumer_defensive",
           AA03O="healthcare", AA03P="industrials", AA03Q="real_estate", AA03R="technology", AA03S="energy",
           AA03T="financial", AA03U="utilities")
REG = dict(HS06G="us", HS06F="canada", HS06D="latam", HS06E="uk", HS06I="eurozone", HS06J="europe_ex_euro",
           HS06H="europe_em", HS006="africa_me", HS06K="japan", HS06L="australasia", HS06N="asia_dev", HS06M="asia_em")
# HS02E akcijos %, HS02D obligacijos %, HS00X pinigai %, HS02F trukmė, HS00C vidutinė kredito kokybė


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--date", required=True)
    a = ap.parse_args()
    src, out = Path(a.src), Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    ids = list(csv.DictReader((src / "ids.csv").open(encoding="utf-8")))
    proxy = {r["ms_id"]: r for r in csv.DictReader((src / "proxy.csv").open(encoding="utf-8"))} if (src / "proxy.csv").exists() else {}

    vals = {}                                  # ms_id → datapoint → (data, reikšmė)
    for fn in glob.glob(str(src / "data-*.json")):
        for mid, r in json.load(open(fn, encoding="utf-8"))["result"].items():
            row = vals.setdefault(mid, {})
            for v in r.get("values", []):
                pts = v.get("timeSeriesData") or ([{"date": a.date, "value": v["value"]}] if "value" in v else [])
                pts = [p for p in pts if p["date"] <= a.date]
                if pts:
                    last = max(pts, key=lambda p: p["date"])
                    if v["datapointId"] not in row or last["date"] >= row[v["datapointId"]][0]:
                        row[v["datapointId"]] = (last["date"], last["value"])
    hold = {}
    for fn in glob.glob(str(src / "holdings-*.json")):
        for r in json.load(open(fn, encoding="utf-8"))["results"]:
            for mid, hs in r["holdings"].items():
                hold[mid] = (r.get("as_of_date", ""), hs)

    with (out / "ms_profiles.csv").open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["isin", "ms_id", "profile_from", "holdings_from", "as_of", "equity", "bond", "cash"]
                   + ["sec_" + x for x in SEC.values()] + ["reg_" + x for x in REG.values()] + ["duration", "credit_quality", "name"])
        for r in ids:
            if r["kind"] != "fund":
                continue
            px = proxy.get(r["ms_id"], {})
            pm = px.get("profile_from") or r["ms_id"]
            v = vals.get(pm, {})
            g = lambda k: v[k][1] if k in v else ""
            w.writerow([r["isin"], r["ms_id"], px.get("profile_from", ""), px.get("holdings_from", ""),
                        max((x[0] for x in v.values()), default=""), g("HS02E"), g("HS02D"), g("HS00X")]
                       + [g(k) for k in SEC] + [g(k) for k in REG] + [g("HS02F"), g("HS00C"), r.get("name", "")])
    with (out / "ms_holdings.csv").open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["fund_ms_id", "as_of", "holding_ms_id", "holding_name", "weight"])
        for mid, (asof, hs) in hold.items():
            for h in hs:
                w.writerow([mid, asof, h["morningstar_id"], h["holding_name"], h["holding_weight"]])
    with (out / "ms_stocks.csv").open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["isin", "ms_id", "sector", "name"])
        for r in ids:
            if r["kind"] != "stock":
                continue
            v = {k: float(x[1]) for k, x in vals.get(r["ms_id"], {}).items() if k in SEC}
            top = max(v, key=v.get) if v and max(v.values()) > 50 else None
            w.writerow([r["isin"], r["ms_id"], SEC[top] if top else "", r.get("name", "")])
    print(f"{out}: profiliai {sum(1 for r in ids if r['kind'] == 'fund')}, sudėtys {len(hold)}, akcijos {sum(1 for r in ids if r['kind'] == 'stock')}")


if __name__ == "__main__":
    main()
