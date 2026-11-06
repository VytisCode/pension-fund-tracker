#!/usr/bin/env python3
"""
Tikroji pensijų fondų sudėtis „pro fondus“ (look-through) iš Morningstar duomenų – kartą per ketvirtį.

Kodėl taip: pensijų fondai ~70 % turto laiko ETF ir investiciniuose fonduose, todėl LB portfelio ataskaita
parodo tik „dėžutes“ (pvz. „MSCI World ETF“), bet ne tai, kas jose: kiek realiai JAV, technologijų,
Nvidia ar žemo reitingo obligacijų. Šis skriptas ETF / fondų sudėtį (Morningstar) sudaugina iš pozicijos
vertės pensijų fonde ir sudeda su tiesiogiai turimomis akcijomis ir obligacijomis.

Morningstar duomenys pasiekiami tik per Claude sesijos Morningstar įrankį (ne per GitHub Actions), todėl:
  1) Claude kartą per ketvirtį (kai LB portfeliai jau įkelti) surenka žalius duomenis į PRIVATŲ projekto
     aplanką /mnt/project-files/morningstar/<ketvirtis>/ (procedūra – MORNINGSTAR.md);
  2) šis skriptas iš jų apskaičiuoja TIK išvestinius rodiklius kiekvienam pensijų fondui → data/lookthrough.csv
     (vieša repozitorija: Morningstar žalių duomenų, reitingų ir kategorijų čia nelaikome – licencija);
  3) build_site.py įdeda data/lookthrough.csv į docs/data_pf.js, svetainė rodo Portfelių puslapyje.

Įvestis (aplanke --raw):
  ms_profiles.csv  – kiekvienam ETF / fondui: turto klasės, 11 akcijų sektorių, 12 regionų (% akcijų dalies),
                     obligacijų trukmė, vidutinė kredito kokybė; profile_from / holdings_from – artimiausio
                     analogo ID, kai fondas neturi savų duomenų (pvz. sintetinis ETF su swap → fizinis to paties indekso ETF);
  ms_holdings.csv  – iki 100 didžiausių kiekvieno ETF / fondo pozicijų (% fondo turto);
  ms_stocks.csv    – tiesiogiai turimų akcijų sektorius ir Morningstar ID (kad sutaptų su ETF pozicijomis).

Naudojimas:  python tools/ms_lookthrough.py --raw /mnt/project-files/morningstar/2026-09-30 --date 2026-09-30
Rezultatas:  data/lookthrough.csv (date, fund_code, metric, value) – to ketvirčio eilutės perrašomos, kiti lieka.
"""
import argparse
import csv
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import bonds  # noqa: E402

OUT = ROOT / "data" / "lookthrough.csv"
SECTORS = ["technology", "financial", "healthcare", "industrials", "consumer_cyclical", "communication",
           "consumer_defensive", "energy", "basic_materials", "utilities", "real_estate"]
REGIONS = ["us", "canada", "latam", "uk", "eurozone", "europe_ex_euro", "europe_em", "africa_me",
           "japan", "australasia", "asia_dev", "asia_em"]
# tiesioginių akcijų emitento šalis → Morningstar regionas (tokie pat regionai kaip ETF profiliuose)
EUROZONE = set("AT BE CY DE EE ES FI FR GR HR IE IT LT LU LV MT NL PT SI SK".split())
CTY_REG = {**{c: "eurozone" for c in EUROZONE},
           **{c: "us" for c in ("US", "BM", "KY", "PR", "PA")}, "CA": "canada",
           **{c: "uk" for c in ("GB", "JE", "GG", "IM")},
           **{c: "europe_ex_euro" for c in ("CH", "NO", "SE", "DK", "IS", "LI", "FO")},
           **{c: "europe_em" for c in ("PL", "RO", "HU", "CZ", "BG", "TR", "RS", "UA")},
           "JP": "japan", "AU": "australasia", "NZ": "australasia",
           **{c: "asia_dev" for c in ("HK", "SG", "KR", "TW")},
           **{c: "asia_em" for c in ("CN", "IN", "ID", "TH", "MY", "PH", "VN")},
           **{c: "latam" for c in ("BR", "MX", "CL", "CO", "PE", "AR")},
           **{c: "africa_me" for c in ("ZA", "SA", "AE", "QA", "KW", "IL", "EG")}}
# vidutinė kredito kokybė → skaičius (didesnis – rizikingiau); atgal – raidė
CQ = {"AAA": 1, "AA": 2, "A": 3, "BBB": 4, "BB": 5, "B": 6, "BELOW B": 7}
ALT = ("private_equity", "real_estate", "infrastructure", "private_debt")
KIS_CLASS = {"1": "bond", "3": "equity", "4": "money_market", "5": "real_estate", "7": "private_equity"}


def f(x):
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def company(name: str) -> str:
    """Vienos bendrovės kelios akcijų klasės → vienas pavadinimas (Alphabet A + C)."""
    n = re.sub(r"\s+(Ordinary Shares\s*-?\s*)?Class [A-C]$", "", name.strip())
    n = re.sub(r"\s+(Registered Shares|Ordinary Shares)$", "", n)
    n = re.sub(r"(?<! and)(?<! &)\s+(Inc|Corp|Co|Co Ltd|Ltd|PLC|SA|AG|NV|SE|ASA|AB|Abp)\.?$", "", n)
    return n


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--raw", required=True)
    ap.add_argument("--date", required=True)
    a = ap.parse_args()
    raw, qd = Path(a.raw), a.date

    prof = {r["isin"]: r for r in csv.DictReader((raw / "ms_profiles.csv").open(encoding="utf-8"))}
    hold = defaultdict(list)
    for r in csv.DictReader((raw / "ms_holdings.csv").open(encoding="utf-8")):
        hold[r["fund_ms_id"]].append(r)
    stocks = {r["isin"]: r for r in csv.DictReader((raw / "ms_stocks.csv").open(encoding="utf-8"))}
    attrs = {r["isin"]: r for r in csv.DictReader((ROOT / "data" / "fund_attributes.csv").open(encoding="utf-8"))}
    # vienodi bendrovių pavadinimai: Morningstar pavadinimas iš ETF pozicijų, tiesioginėms akcijoms be jo – LB pavadinimas
    ms_name = {h["holding_ms_id"]: company(h["holding_name"]) for hs in hold.values() for h in hs if h["holding_ms_id"]}
    terms = bonds.load_terms()

    funds = defaultdict(list)
    for r in csv.DictReader((ROOT / "data" / "portfolios.csv").open(encoding="utf-8")):
        if r["date"] == qd:
            funds[r["fund_code"]].append(r)
    if not funds:
        sys.exit(f"{qd}: LB portfelių nėra data/portfolios.csv")

    rows = []
    stats = defaultdict(float)
    for code, pos in sorted(funds.items()):
        tot = sum(f(p["value"]) or 0 for p in pos)
        if tot <= 0:
            continue
        mix = defaultdict(float)
        sec, reg = defaultdict(float), defaultdict(float)
        eq_all = eq_sec = eq_reg = 0.0
        comp = defaultdict(float)
        eq_named = 0.0
        bd_all = bd_dur_w = bd_dur_s = 0.0
        bd_fund = bd_cq_w = bd_cq_s = bd_hy = bd_direct = 0.0
        fund_v = fund_cov = 0.0
        for p in pos:
            v = f(p["value"]) or 0
            if not v:
                continue
            t = p["type"]
            if t == "equity":
                mix["eq"] += v; eq_all += v
                s = stocks.get(p["pos_id"], {})
                if s.get("sector"):
                    sec[s["sector"]] += v; eq_sec += v
                rg = CTY_REG.get(p["country"])
                if rg:
                    reg[rg] += v; eq_reg += v
                comp[ms_name.get(s.get("ms_id")) or company(p["name"])] += v; eq_named += v
            elif t == "bond":
                mix["bd"] += v; bd_all += v; bd_direct += v
                m = bonds.metrics(p["pos_id"], qd, v, f(p["qty"]) or 0, p["currency"], terms) if p["qty"] else None
                if m:
                    bd_dur_w += v; bd_dur_s += v * m[1]
            elif t == "cash":
                mix["cash"] += v
            elif t == "derivative":
                mix["oth"] += v
            else:                                              # investiciniai fondai ir ETF
                pr = prof.get(p["pos_id"])
                ac = (attrs.get(p["pos_id"]) or {}).get("asset_class") or KIS_CLASS.get(p["kis_type"], "")
                if ac not in ALT:                              # padengimas – tik tarp kotiruojamų fondų / ETF (privatus kapitalas jų neturi)
                    fund_v += v
                e, b, c = (f(pr["equity"]), f(pr["bond"]), f(pr["cash"])) if pr else (None, None, None)
                if pr and e is not None and b is not None:
                    fund_cov += v if ac not in ALT else 0
                    c = c or 0
                    if ac == "money_market":                   # pinigų rinkos fondas – pinigai, nors viduje trumpos obligacijos
                        e, b, c = 0, 0, 100
                    elif ac == "bond":                         # obligacijų fondų „pinigai“ dažnai išvestinių užstatas → obligacijos
                        b, c = max(0, 100 - e), 0
                    elif (attrs.get(p["pos_id"]) or {}).get("theme") == "gold":   # aukso fondo ne akcijų dalis – auksas, ne pinigai
                        b, c = 0, 0
                    o = max(0.0, 100 - e - b - c)
                    mix["eq"] += v * e / 100; mix["bd"] += v * b / 100; mix["cash"] += v * c / 100
                    mix["alt" if ac in ALT else "oth"] += v * o / 100
                    ev = v * e / 100
                    eq_all += ev
                    sv = {k: f(pr.get("sec_" + k)) for k in SECTORS}
                    if ev and sum(x or 0 for x in sv.values()) > 50:
                        tot_s = sum(x or 0 for x in sv.values())
                        for k, x in sv.items():
                            sec[k] += ev * (x or 0) / tot_s
                        eq_sec += ev
                    rv = {k: f(pr.get("reg_" + k)) for k in REGIONS}
                    if ev and sum(x or 0 for x in rv.values()) > 50:
                        tot_r = sum(x or 0 for x in rv.values())
                        for k, x in rv.items():
                            reg[k] += ev * (x or 0) / tot_r
                        eq_reg += ev
                    # didžiausios bendrovės: ETF pozicijos (% fondo turto) × vertė
                    hid = pr.get("holdings_from") or pr["ms_id"]
                    named = 0.0
                    for h in hold.get(hid, []):
                        w = f(h["weight"]) or 0
                        if h["holding_ms_id"].startswith("0P") and w > 0:
                            comp[ms_name[h["holding_ms_id"]]] += v * w / 100
                            named += v * w / 100
                    eq_named += min(named, ev)
                    bv = v * b / 100
                    bd_all += bv
                    if bv:
                        dur = f(pr.get("duration"))
                        if dur is not None:
                            bd_dur_w += bv; bd_dur_s += bv * dur
                        q = CQ.get((pr.get("credit_quality") or "").upper())
                        bd_fund += bv
                        if q:
                            bd_cq_w += bv; bd_cq_s += bv * q
                            if q >= 5:
                                bd_hy += bv
                else:                                          # be Morningstar profilio – pagal fondo aprašą
                    k = {"equity": "eq", "bond": "bd", "money_market": "cash"}.get(ac, "alt" if ac in ALT else "oth")
                    mix[k] += v
                    if k == "eq":
                        eq_all += v
                    elif k == "bd":
                        bd_all += v; bd_fund += v
        pct = lambda x: round(x / tot * 100, 3)
        out = [("tot_eur", round(tot)), ("cov_fund", round(fund_cov / fund_v * 100, 1) if fund_v else "")]
        out += [("mix_" + k, pct(mix[k])) for k in ("eq", "bd", "cash", "alt", "oth")]
        if eq_all:
            out += [("cov_sec", round(eq_sec / eq_all * 100, 1)), ("cov_reg", round(eq_reg / eq_all * 100, 1))]
            if eq_sec:
                out += [("sec_" + k, round(sec[k] / eq_sec * 100, 2)) for k in SECTORS]
            if eq_reg:
                out += [("reg_" + k, round(reg[k] / eq_reg * 100, 2)) for k in REGIONS]
            top = sorted(comp.items(), key=lambda kv: -kv[1]) if hold else []   # ankstesni ketvirčiai – ETF sudėčių nėra (Morningstar duoda tik naujausias)
            if top:
                out += [("top10", pct(sum(x for _, x in top[:10]))), ("cov_top", round(min(eq_named, eq_all) / eq_all * 100, 1))]
                out += [("top|" + k, pct(x)) for k, x in top[:50] if x > 0]
        if bd_all:
            out += [("bd_dur", round(bd_dur_s / bd_dur_w, 2) if bd_dur_w else ""), ("cov_dur", round(bd_dur_w / bd_all * 100, 1)),
                    ("bd_direct", round(bd_direct / bd_all * 100, 1))]
            if bd_cq_w:
                out += [("bd_cq", round(bd_cq_s / bd_cq_w, 2)), ("bd_hy", round(bd_hy / bd_cq_w * 100, 1)),
                        ("cov_cq", round(bd_cq_w / bd_fund * 100, 1) if bd_fund else "")]
        rows += [(qd, code, m, v) for m, v in out if v != ""]
        stats["funds"] += 1; stats["fund_v"] += fund_v; stats["fund_cov"] += fund_cov

    etf_profiles(qd, prof, hold)
    old = []
    if OUT.exists():
        old = [r for r in csv.reader(OUT.open(encoding="utf-8")) if r and r[0] != "date" and r[0] != qd]
    with OUT.open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["date", "fund_code", "metric", "value"])
        w.writerows(sorted(old + [[str(x) for x in r] for r in rows], key=lambda r: (r[0], r[1])))
    print(f"{qd}: {int(stats['funds'])} pensijų fondai, fondų/ETF vertės su Morningstar profiliu "
          f"{stats['fund_cov'] / stats['fund_v'] * 100:.1f} % → {OUT.relative_to(ROOT)} ({len(rows)} eilučių)")


ETF_OUT = ROOT / "data" / "etf_profiles.csv"


def etf_profiles(qd: str, prof: dict, hold: dict) -> None:
    """Kiekvieno ETF / fondo profilis (savininkas 2026-11-06 patvirtino, kad Morningstar prieiga leidžia viešinti) →
    data/etf_profiles.csv: struktūra, sektoriai, regionai, trukmė, kredito kokybė, 10 didžiausių pozicijų. Perrašomas tik ketvirtis qd."""
    name_of = {r["ms_id"]: r.get("name", "") for r in prof.values()}
    cols = ["equity", "bond", "cash"] + ["sec_" + k for k in SECTORS] + ["reg_" + k for k in REGIONS] + ["duration", "credit_quality"]
    rows = []
    for isin, pr in sorted(prof.items()):
        if f(pr.get("equity")) is None and not hold.get(pr.get("holdings_from") or pr["ms_id"]):
            continue
        hid = pr.get("holdings_from") or pr["ms_id"]
        hs = sorted(hold.get(hid, []), key=lambda h: -(f(h["weight"]) or 0))[:10]
        top = json.dumps([[h["holding_name"], round(f(h["weight"]) or 0, 2)] for h in hs], ensure_ascii=False)
        px = "|".join(x for x in (name_of.get(pr.get("profile_from"), "") if pr.get("profile_from") else "",
                                  name_of.get(pr.get("holdings_from"), "") if pr.get("holdings_from") else "") if x)
        rows.append([qd, isin, pr.get("as_of", "")[:10], (hs[0]["as_of"][:10] if hs else ""), px]
                    + [("%.2f" % f(pr.get(c))) if f(pr.get(c)) is not None else (pr.get(c) or "") for c in cols] + [top])
    old = []
    if ETF_OUT.exists():
        old = [r for r in csv.reader(ETF_OUT.open(encoding="utf-8")) if r and r[0] != "date" and r[0] != qd]
    with ETF_OUT.open("w", encoding="utf-8", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(["date", "isin", "as_of", "hold_as_of", "proxy"] + cols + ["top10"])
        w.writerows(sorted(old) + rows)
    print(f"{qd}: ETF / fondų profiliai {len(rows)} → {ETF_OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
