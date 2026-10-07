"""Fondų turto (grynųjų aktyvų, AUM) duomenys svetainės puslapiui „Turtas“ (docs/data_aum.js).

- Kasdieniai grynieji aktyvai: data/nav_history.csv (II pakopa) ir data/pillar3_history.csv (III pakopa).
- Kur kasdienių duomenų dar nėra (pvz. Swedbank ir Luminor II pakopos iki 2026-06), naudojamos
  Lietuvos banko ketvirčio pabaigos portfelių sumos (data/portfolios.csv, žr. portfolios.py).
- Išmokėjimai pagal pensijų reformą: ketvirčio pradžioje (sausio, balandžio, liepos, spalio 1–20 d.)
  ieškoma dienų, kai turtas sumažėjo labiau, nei paaiškina vieneto vertės pokytis:
  srautas_t = turtas_t − turtas_(t−1) × vieneto_vertė_t / vieneto_vertė_(t−1).
"""
import csv
import re
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
PROVIDERS = ["ALLIANZ", "ARTEA", "GOINDEX", "LUMINOR", "SEB", "SWEDBANK"]
LB_PROVIDER = {"Allianz": "ALLIANZ", "Artea": "ARTEA", "Goindex": "GOINDEX", "Luminor": "LUMINOR", "SEB": "SEB", "Swedbank": "SWEDBANK"}
PAYOUT_MONTHS = (1, 4, 7, 10)
PAYOUT_LAST_DAY = 20          # išmokama iki 15 d.; paliekama atsarga dėl vėliau paskelbtų duomenų
PAYOUT_MIN_SHARE = 0.01       # valdytojo dienos srautas < −1 % jo turto laikomas išmokėjimu
REFORM_START = "2026-01-01"   # ketvirčių duomenų įvertis skaičiuojamas tik nuo reformos


def day_number(iso: str) -> int:
    return (date.fromisoformat(iso) - date(1970, 1, 1)).days


def group_of(fund: str):
    years = re.search(r"(\d{4})\s*[-–]\s*(\d{4})", fund)
    if years:
        return f"{years.group(1)}-{years.group(2)}"
    return "turto" if "turto" in fund.lower() else None


def lb_group(code: str):
    m = re.match(r"[A-Z]{3}-(\d\d)/(\d\d)$", code)
    if m:
        a, b = (int(x) + (2000 if int(x) < 30 else 1900) for x in m.groups())
        return f"{a}-{b}"
    return "turto" if code.endswith("-TIPF") else None


def read_daily(path: Path):
    """{(tiekėjas, fondas): [(data, vieneto vertė, turtas | None)]}"""
    out = defaultdict(list)
    if not path.exists():
        return out
    with path.open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            if r["unit_value"]:
                out[(r["provider"], r["fund"])].append(
                    (r["date"], float(r["unit_value"]), float(r["net_assets"]) if r["net_assets"] else None))
    for v in out.values():
        v.sort()
    return out


def read_lb_totals():
    """{LB fondo kodas: {(ketvirčio pabaiga): suma}} ir {kodas: (pakopa, tiekėjas)}"""
    path = ROOT / "data" / "portfolios.csv"
    tot, meta = defaultdict(lambda: defaultdict(float)), {}
    if path.exists():
        with path.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                tot[r["fund_code"]][r["date"]] += float(r["value"])
                meta[r["fund_code"]] = (r["pillar"], LB_PROVIDER[r["provider"]])
    return tot, meta


def uv_on(rows, d):
    """Paskutinė vieneto vertė iki datos d (imtinai)."""
    best = None
    for dd, u, _ in rows:
        if dd > d:
            break
        best = u
    return best


def build():
    import pillar3

    daily2 = read_daily(ROOT / "data" / "nav_history.csv")
    daily3 = read_daily(ROOT / "data" / "pillar3_history.csv")
    lb_tot, lb_meta = read_lb_totals()

    # LB kodas kiekvienam fondui
    code_of = {}
    for (prov, fund) in daily2:
        g = group_of(fund)
        for code, (pl, p) in lb_meta.items():
            if pl == "II" and p == prov and lb_group(code) == g:
                code_of[(prov, fund)] = code
    for prov, name, cat, code, risky in pillar3.FUNDS:
        code_of[(prov, name)] = code

    funds = []
    for pillar, daily in (("II", daily2), ("III", daily3)):
        for (prov, fund), rows in sorted(daily.items()):
            group = group_of(fund) if pillar == "II" else next((c for p, n, c, *_ in pillar3.FUNDS if n == fund), None)
            if group is None:
                continue
            pts = [(d, a) for d, _, a in rows if a]
            first_daily = pts[0][0] if pts else "9999"
            code = code_of.get((prov, fund))
            # ketvirčio pabaigos sumos iš LB ten, kur kasdienių duomenų dar nėra
            q = sorted((d, a) for d, a in lb_tot.get(code, {}).items() if d < first_daily) if code else []
            series = q + pts
            if len(series) < 2:
                continue
            funds.append({
                "pl": pillar, "p": prov, "g": group, "n": fund, "code": code or "",
                "d": [day_number(d) for d, _ in series], "a": [round(a / 1e6, 3) for _, a in series],
                "q": len(q),          # kiek pirmųjų taškų – LB ketvirčio duomenys
            })

    events = payouts(daily2, lb_tot, code_of)
    return {"funds": funds, "payouts": events}


def payouts(daily2, lb_tot, code_of):
    """II pakopos išmokėjimai: [{q, p, dates, flow, base, funds: {fondas: [srautas, bazė]}, est}]"""
    flows = defaultdict(lambda: defaultdict(dict))   # (tiekėjas, ketvirtis) -> data -> fondas -> (srautas, turtas prieš)
    for (prov, fund), rows in daily2.items():
        rows = [r for r in rows if r[2]]
        for (d0, u0, a0), (d1, u1, a1) in zip(rows, rows[1:]):
            y, m, dd = map(int, d1.split("-"))
            if m not in PAYOUT_MONTHS or dd > PAYOUT_LAST_DAY or (date.fromisoformat(d1) - date.fromisoformat(d0)).days > 7:
                continue
            flows[(prov, f"{y}-{(m - 1) // 3 + 1}")][d1][fund] = (a1 - a0 * u1 / u0, a0)
    out = []
    covered = set()
    for (prov, q), by_day in sorted(flows.items()):
        # valdytojo turtas prieš langą: visų fondų turtas pirmą lango dieną prieš srautą
        days = sorted(by_day)
        pay_days = []
        for d in days:
            fl = sum(v[0] for v in by_day[d].values())
            base = sum(v[1] for v in by_day[d].values())
            if base and fl / base < -PAYOUT_MIN_SHARE:
                pay_days.append(d)
        if not pay_days:
            continue
        per_fund = defaultdict(lambda: [0.0, None])
        for d in pay_days:
            for fund, (fl, a0) in by_day[d].items():
                per_fund[fund][0] += fl
                if per_fund[fund][1] is None:
                    per_fund[fund][1] = a0
        flow = sum(v[0] for v in per_fund.values())
        base = sum(v[1] for v in per_fund.values())
        covered.add((prov, q))
        out.append({"q": q, "p": prov, "dates": pay_days, "flow": round(flow / 1e6, 2), "base": round(base / 1e6, 2), "est": 0,
                    "funds": {f: [round(v[0] / 1e6, 3), round(v[1] / 1e6, 3)] for f, v in sorted(per_fund.items())}})
    # Ketvirčiai be kasdienių turto duomenų: įvertis iš LB ketvirčio pabaigos sumų (data nežinoma)
    quarters = sorted({d for t in lb_tot.values() for d in t})
    for prov in PROVIDERS:
        for q0, q1 in zip(quarters, quarters[1:]):
            if q1 < REFORM_START:
                continue
            y, m = int(q1[:4]), int(q1[5:7])
            qid = f"{y}-{(m - 1) // 3 + 1}"
            if (prov, qid) in covered:
                continue
            per_fund, base = {}, 0.0
            for (p, fund), rows in daily2.items():
                code = code_of.get((p, fund))
                if p != prov or not code or q0 not in lb_tot[code] or q1 not in lb_tot[code]:
                    continue
                u0, u1 = uv_on(rows, q0), uv_on(rows, q1)
                if not u0 or not u1:
                    continue
                # LB suma gali jau neįtraukti kito ketvirčio pradžioje išmokamo turto (pvz. Swedbank 2026-06-30),
                # todėl kur yra kasdieniai grynieji aktyvai, naudojami jie
                a0 = next((a for d, _, a in rows if d == q0 and a), lb_tot[code][q0])
                a1 = next((a for d, _, a in rows if d == q1 and a), lb_tot[code][q1])
                per_fund[fund] = [round((a1 - a0 * u1 / u0) / 1e6, 3), round(a0 / 1e6, 3)]
            if not per_fund:
                continue
            flow = sum(v[0] for v in per_fund.values())
            base = sum(v[1] for v in per_fund.values())
            if base and flow / base < -0.05:   # tik ryškūs (reformos) išmokėjimai
                out.append({"q": qid, "p": prov, "dates": [], "flow": round(flow, 2), "base": round(base, 2), "est": 1,
                            "funds": dict(sorted(per_fund.items()))})
    out.sort(key=lambda e: (e["q"], e["p"]))
    return out


if __name__ == "__main__":
    data = build()
    for e in data["payouts"]:
        print(e["q"], e["p"], e["dates"], e["flow"], e["base"], f"{e['flow'] / e['base'] * 100:.1f}%", "≈" if e["est"] else "")
    print(len(data["funds"]), "fondų")
