"""Visos rinkos ketvirčių duomenys „Pradžios“ puslapiui (docs/data_mkt.js): dalyviai, turtas, grąžos pagal fondą,
valdytoją ir LB grupę iš data/lb_results_history.csv (žr. lb_history.py).

Kiekvienai pakopai:
- dates – ketvirčių pabaigos (II pakopos 2015-06-30 failo LB nepaskelbė: nuoroda veda į III pakopos failą);
- groups – LB grupės (raktas, LB pavadinimas);
- funds – fondai [valdytojas, pavadinimas (naujausias), grupės nr.]; tas pats fondas per ketvirčius atpažįstamas pagal LB kodą
  arba pavadinimą ankstesniame ketvirtyje;
- rows – fondų ketvirčių eilutės: [datos nr., fondo nr., dalyviai, turtas mln. €, grąžos …, ketvirčio grąža];
- avgs – LB svertiniai vidurkiai (grupės nr. −1 = visa pakopa).
Ketvirčio grąža išvedama iš LB „nuo metų pradžios“ grąžų: (1 + YTD) ÷ (1 + ankstesnio ketvirčio YTD) − 1.
"""
import csv
import re
from datetime import date
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "data" / "lb_results_history.csv"
RET = ["ret_ytd", "ret_1y", "ret_3y", "ret_5y", "ret_gcf", "bm_ytd", "bm_1y", "std_3y", "risky"]


def group_key(pillar: str, g: str) -> str:
    s = g.lower()
    m = re.search(r"(\d{4})\s*[-–]\s*(\d{4})", s)
    if m:
        return f"{m.group(1)}-{m.group(2)}"
    for k, w in (("turto", "išsaugojimo"), ("gc", "gyvenimo ciklo"), ("kons", "konservatyv"), ("maz", "mažos akcijų"),
                 ("vid", "vidutinės akcijų"), ("obl", "obligacijų"), ("mis", "mišraus"), ("akc", "akcijų")):
        if w in s:
            return k
    return "kita"


def f(v):
    try:
        return round(float(v), 2) if v not in ("", None) else None
    except ValueError:
        return None


def prev_q(d: str, months: int) -> str:
    y, m = int(d[:4]), int(d[5:7]) - months
    while m <= 0:
        y, m = y - 1, m + 12
    nd = (date(y + (m == 12), m % 12 + 1, 1) - date.resolution)
    return nd.isoformat()


def build() -> dict:
    rows = list(csv.DictReader(SRC.open(encoding="utf-8")))
    out = {}
    for pillar in ("II", "III"):
        rs = [r for r in rows if r["pillar"] == pillar]
        dates = sorted({r["date"] for r in rs})
        di = {d: i for i, d in enumerate(dates)}
        groups, gi = [], {}
        for r in rs:
            if r["kind"] in ("fund", "group_avg") and r["lb_group"]:
                k = group_key(pillar, r["lb_group"])
                if k not in gi:
                    gi[k] = len(groups)
                    groups.append([k, r["lb_group"]])
        funds = [r for r in rs if r["kind"] == "fund" and (f(r["nav_meur"]) or f(r["participants"]))]
        key = lambda r: (r["code"] or "", re.sub(r"\W+", " ", r["name"].lower()).strip())
        by = {}
        for r in funds:
            c, n = key(r)
            if c:
                by[(r["date"], "c", c)] = r
            by[(r["date"], "n", n)] = r

        def find(r, d):
            c, n = key(r)
            return (by.get((d, "c", c)) if c else None) or by.get((d, "n", n))

        ident, F, R = {}, [], []
        for r in sorted(funds, key=lambda r: r["date"]):
            q1 = find(r, prev_q(r["date"], 3))
            q2 = q1 or find(r, prev_q(r["date"], 6))          # per trūkstamą ketvirtį (II 2015-06-30)
            fid = ident.get(id(q2)) if q2 else None
            if fid is None:
                fid = len(F)
                F.append(None)
            ident[id(r)] = fid
            F[fid] = [r["provider"], r["name"], gi[group_key(pillar, r["lb_group"])]]   # naujausias pavadinimas
            ytd, qret = f(r["ret_ytd"]), None
            if ytd is not None:
                if r["date"][5:7] == "03":
                    qret = ytd
                elif q1 and f(q1["ret_ytd"]) is not None:
                    qret = round(((1 + ytd / 100) / (1 + f(q1["ret_ytd"]) / 100) - 1) * 100, 2)
            part, nav = f(r["participants"]), r["nav_meur"]
            R.append([di[r["date"]], fid, int(part) if part is not None else None, round(float(nav), 3) if nav else None]
                     + [f(r[k]) for k in RET] + [qret])
        A = []
        prev = {}
        for r in sorted((r for r in rs if r["kind"] in ("group_avg", "all_avg")), key=lambda r: r["date"]):
            g = -1 if r["kind"] == "all_avg" else gi.get(group_key(pillar, r["lb_group"] or r["name"]), -2)
            if g == -2:
                continue
            ytd, qret = f(r["ret_ytd"]), None
            p = prev.get((g, prev_q(r["date"], 3)))
            if ytd is not None:
                if r["date"][5:7] == "03":
                    qret = ytd
                elif p is not None:
                    qret = round(((1 + ytd / 100) / (1 + p / 100) - 1) * 100, 2)
            prev[(g, r["date"])] = ytd
            A.append([di[r["date"]], g] + [f(r[k]) for k in RET[:7]] + [qret])
        out[pillar] = {"dates": dates, "groups": groups, "funds": F, "rows": R, "avgs": A}
    out["cols"] = {"row": ["d", "f", "part", "nav"] + RET + ["ret_q"], "avg": ["d", "g"] + RET[:7] + ["ret_q"]}
    return out


if __name__ == "__main__":
    b = build()
    for p in ("II", "III"):
        print(p, len(b[p]["dates"]), "ketv.,", len(b[p]["funds"]), "fondų,", len(b[p]["rows"]), "eilučių,", len(b[p]["avgs"]), "vidurkių")
