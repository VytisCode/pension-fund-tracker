"""Kiek eurų pensijų fondai uždirbo (ar prarado) iš investicijų – Pradžios skirtukas „Uždarbis eurais“ (docs/data_earn.js).
Savininko užduotis 2026-10-21: žurnalistams – kiek per dieną, mėnesį, ketvirtį ar metus fondas, valdytojas ar visa pakopa
uždirbo eurų (pvz. 0,02 % per dieną gali būti 40 mln. €); palyginti laikotarpius prieš reformą ir po jos.

Fondo dienos uždarbis = turtas ankstesnę dieną × (vieneto vertė šiandien ÷ vieneto vertė ankstesnę dieną − 1).
Įmokos, perėjimai ir išmokos uždarbio nekeičia – jie keičia tik turtą. Vieneto vertė jau atskaičius mokesčius.
Turtas ankstesnę dieną – valdytojo paskelbtas grynasis aktyvas; kur kasdienio turto nėra (pvz. Swedbank ir Luminor II pakopa
iki 2026-06, dalis III pakopos), – paskutinis žinomas turtas (kasdienis arba LB ketvirčio pabaigos, žr. aum.py), perskaičiuotas
pagal vieneto vertės pokytį (įvertis: neįskaito tos dienos įmokų ir išmokų); jų dalis rodoma („e“).
Ketvirčiams, kurių kasdieniai duomenys neapima viso LB ketvirčio turto, naudojamas LB ketvirčio įvertis:
uždarbis ≈ ketvirčio grąža × (turtas pradžioje + turtas pabaigoje) ÷ 2 ÷ (1 + grąža ÷ 2) (modifikuotas Dietz – įmokos per ketvirtį tolygios).
"""
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
MAX_STALE = 120          # paskutinis žinomas turtas ne senesnis nei 120 d.
MAX_JUMP = 0.2           # dienos vieneto vertės pokytis > 20 % – duomenų klaida, praleidžiama
DAILY_FUND_DAYS = 400    # fondų kasdienės eilutės – tik paskutinės 400 d. (svetainės dydis); mėnesiai – visa istorija
MIN_COVER = 0.9          # ketvirtis iš kasdienių duomenų, jei jie apima ≥ 90 % LB ketvirčio pradžios turto
START = {"II": "2019-01-01", "III": "2015-01-01"}   # iki tol kasdienių vertių per mažai


def dn(iso):
    return (date.fromisoformat(iso) - date(1970, 1, 1)).days


def wk(iso):
    """Savaitgalio vertė (kai kurie fondai skelbia ir šeštadienį ar sekmadienį) priskiriama kitam darbo dienai – kad dienų vidurkiai būtų darbo dienų."""
    x = date.fromisoformat(iso)
    return x.isoformat() if x.weekday() < 5 else date.fromordinal(x.toordinal() + 7 - x.weekday()).isoformat()


def qkey(iso):
    return f"{iso[:4]}-{(int(iso[5:7]) - 1) // 3 + 1}"


def fund_days(rows, pts):
    """rows [(data, vv, turtas|None)], pts [(data, turtas €)] -> [(data, uždarbis €, bazė €, įvertis?)]"""
    uv, ud = {d: u for d, u, _ in rows}, [d for d, _, _ in rows]
    import bisect

    def uv_at(d):                                   # LB ketvirčio pabaiga gali būti savaitgalį – paskutinė vertė iki jos
        i = bisect.bisect_right(ud, d) - 1
        return rows[i][1] if i >= 0 and dn(d) - dn(ud[i]) <= 7 else None
    out, k = [], -1
    for (d0, u0, _), (d1, u1, _) in zip(rows, rows[1:]):
        while k + 1 < len(pts) and pts[k + 1][0] <= d0:
            k += 1
        if k < 0 or not u0 or not u1 or abs(u1 / u0 - 1) > MAX_JUMP:
            continue
        dk, ak = pts[k]
        uk = uv.get(dk) or uv_at(dk)
        if dn(d0) - dn(dk) > MAX_STALE or not uk:
            continue
        base = ak if dk == d0 else ak * u0 / uk
        out.append((d1, base * (u1 / u0 - 1), base, dk != d0, u0, u1))
    return out


def lb_quarters(mkt, pl):
    """LB ketvirčio įvertis: {ketvirtis: {valdytojas: (uždarbis €, turtas pradžioje €)}}"""
    m = mkt[pl]
    cols = mkt["cols"]["row"]
    iq, inav = cols.index("ret_q"), cols.index("nav")
    prev, out = {}, defaultdict(dict)
    for r in sorted(m["rows"], key=lambda r: r[0]):
        d, fid, nav, rq = m["dates"][r[0]], r[1], r[inav], r[iq]
        p0 = prev.get(fid)
        prev[fid] = (d, nav)
        if nav is None or rq is None:
            continue
        n0 = p0[1] if p0 and p0[1] is not None and dn(d) - dn(p0[0]) < 100 else 0.0
        g = rq / 100 * (n0 + nav) / 2 / (1 + rq / 200) * 1e6
        mg = m["funds"][fid][0]
        a = out[qkey(d)].get(mg, (0.0, 0.0))
        out[qkey(d)][mg] = (a[0] + g, a[1] + n0 * 1e6)
    return out


def build(mkt=None):
    import aum
    import market

    mkt = mkt or market.build()
    NAME = {v: k for k, v in aum.LB_PROVIDER.items()}
    daily = {"II": aum.read_daily(ROOT / "data" / "nav_history.csv"), "III": aum.read_daily(ROOT / "data" / "pillar3_history.csv")}
    funds = aum.build()["funds"]
    out = {}
    for pl in ("II", "III"):
        tot = defaultdict(lambda: [0.0, 0.0, 0.0])                # diena -> [uždarbis, bazė, įvertinta bazė]
        mgr = defaultdict(lambda: defaultdict(float))
        mgb = defaultdict(lambda: defaultdict(float))
        fm, fd, flist = [], [], []
        last = max((r[0] for f in funds if f["pl"] == pl for r in daily[pl].get((f["p"], f["n"]), [])), default="2000-01-01")
        cut = date.fromordinal(date.fromisoformat(last).toordinal() - DAILY_FUND_DAYS).isoformat()
        qcov = defaultdict(float)                                   # ketvirtis -> kasdieniais duomenimis apimtas pradžios turtas
        for f in funds:
            if f["pl"] != pl:
                continue
            rows = [r for r in daily[pl].get((f["p"], f["n"]), []) if r[0] >= START[pl]]
            pts = [(date.fromordinal(date(1970, 1, 1).toordinal() + d).isoformat(), a * 1e6) for d, a in zip(f["d"], f["a"])]
            ds = fund_days(rows, pts)
            if not ds:
                continue
            fi = len(flist)
            mg = NAME.get(f["p"], f["p"])
            flist.append([mg, f["n"], f["g"]])
            mon = defaultdict(lambda: [0.0, 0.0])
            seenq = set()
            for d1, g, b, e, u0, u1 in ds:
                d = wk(d1)
                t = tot[d]
                t[0] += g; t[1] += b; t[2] += b if e else 0
                mgr[mg][d] += g
                mgb[mg][d] += b
                mm = mon[d[:7]]
                mm[0] += g
                if not mm[1]:
                    mm[1] = b                                       # turtas mėnesio pradžioje (pirmos dienos bazė)
                if qkey(d) not in seenq:
                    seenq.add(qkey(d)); qcov[qkey(d)] += b
                if d >= cut:
                    fd.append([dn(d1), fi, u0, u1, round(b / 1e6, 3), int(e)])
            for k, (g, b) in sorted(mon.items()):
                fm.append([int(k[:4]) * 12 + int(k[5:7]) - 1, fi, round(g / 1e6, 4), round(b / 1e6, 2)])
        days = sorted(tot)
        dd, prev = [], 0
        for d in days:
            dd.append(dn(d) - prev); prev = dn(d)
        provs = sorted(mgr)
        # ketvirčiai: kasdieniai, jei apima ≥ 90 % LB pradžios turto, kitaip – LB įvertis
        lbq = lb_quarters(mkt, pl)
        qs = []
        for q in sorted(set(lbq) | {qkey(d) for d in days}):
            lb = lbq.get(q, {})
            lb_base = sum(b for _, b in lb.values())
            dg = {p: sum(v for d, v in mgr[p].items() if qkey(d) == q) for p in provs}
            in_q = [d for d in days if qkey(d) == q]
            full = in_q and (not lb_base or qcov[q] >= MIN_COVER * lb_base) and in_q[0][5:] <= f"{['01', '04', '07', '10'][int(q[-1]) - 1]}-10"
            if full:
                qs.append([q, "d", round(sum(tot[d][0] for d in in_q) / 1e6, 3), {p: round(v / 1e6, 3) for p, v in dg.items() if v},
                           round(qcov[q] / 1e6, 1), round(sum(lb[p][0] for p in lb) / 1e6, 3) if lb else None])
            elif lb:
                lmg = defaultdict(float)
                for p, (g, b) in lb.items():
                    lmg[p] += g
                qs.append([q, "lb", round(sum(lmg.values()) / 1e6, 3), {p: round(v / 1e6, 3) for p, v in lmg.items()}, round(lb_base / 1e6, 1), None])
        run = 0                                                     # dienų rodinys – nuo paskutinės nepertrauktos kasdienių ketvirčių sekos
        for i in range(len(qs) - 1, -1, -1):
            if qs[i][1] != "d":
                break
            run = i
        q0 = qs[run][0]
        ds = dn(f"{q0[:4]}-{int(q0[-1]) * 3 - 2:02d}-01")
        out[pl] = {"ds": ds, "dd": dd, "g": [round(tot[d][0] / 1e6, 3) for d in days], "b": [round(tot[d][1] / 1e6, 1) for d in days],
                   "e": [round(tot[d][2] / tot[d][1], 2) if tot[d][1] else 0 for d in days],
                   "m": {p: [round(mgr[p].get(d, 0) / 1e6, 4) for d in days] for p in provs},
                   "mb": {p: [round(mgb[p].get(d, 0) / 1e6, 1) for d in days] for p in provs},
                   "funds": flist, "fm": fm, "fd": fd, "q": qs}
    out["cols"] = {"fm": ["month (y*12+m-1)", "fund", "gain €m", "assets at month start €m"], "fd": ["day", "fund", "unit value day before", "unit value", "assets day before €m", "estimated"],
                   "q": ["quarter", "source d|lb", "gain €m", "by manager", "assets at start €m", "LB estimate €m"]}
    return out


if __name__ == "__main__":
    b = build()
    for pl in ("II", "III"):
        x = b[pl]
        print(pl, "dienų", len(x["g"]), "fondų", len(x["funds"]), "fd", len(x["fd"]))
        for q in x["q"][-12:]:
            print("  ", q[0], q[1], q[2], q[4], "LB:", q[5])
        print("  ", [q[0] + q[1] for q in x["q"]][:40])
