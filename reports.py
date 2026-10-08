"""Puslapio „Ataskaitos“ duomenys (docs/data_rep.js): vieno valdytojo visų fondų lentelės kaip savininko Excel ataskaitose.

- Vieneto vertės ir lyginamieji indeksai mėnesių pabaigose (paskutinė reikšmė iki mėnesio pabaigos) ir paskutinę dieną:
  iš to skaičiuojama kalendorinių metų, mėnesių ir laikotarpių (YTD, 1, 3, 5 m.) grąža.
- Strategijos akcijų (rizikingų aktyvų) dalis ir 2025 m. BAR (atskaitymai nuo turto) – iš Lietuvos banko II pakopos
  rezultatų failo imports/lb_results/2-pakopa-rezultatai-YYYYMMDD.xlsx (vieša LB ataskaita).
- Paskutiniai grynieji aktyvai (AUM) – iš kasdienių duomenų.
- Kasdienės vieneto vertės ir indeksai nuo 2018-12 (docs/rep_daily.js, kraunama atskirai): standartiniam nuokrypiui
  ir Excel atsisiuntimams su skaičiavimais.
- Dabartiniai mokesčiai nuo turto – data/fees.csv (LB mokesčių failai, žr. import_lb_fees.py). II pakopoje mažesnis
  mokestis (0,4 %, Goindex 0,35 %) taikomas, kai bendrovės visų pensijų fondų (II ir III pakopos) turto vidutinė
  metinė vertė praėjusiais metais viršijo 2,5 mlrd. Eur (vertinama pagal LB ketvirčių pabaigos sumas).
"""
import csv
import re
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent
MAX_GAP = 10          # mėnesio pabaigos reikšmė priimama, jei paskutinis taškas ne senesnis nei 10 d.
LB_PROVIDER = {"LMN": "LUMINOR", "INV": "ARTEA", "SBN": "SEB", "SWD": "SWEDBANK", "AVI": "ALLIANZ", "GOX": "GOINDEX"}


def day_number(iso: str) -> int:
    return (date.fromisoformat(iso) - date(1970, 1, 1)).days


def group_of(fund: str):
    years = re.search(r"(\d{4})\s*[-–]\s*(\d{4})", fund)
    if years:
        return f"{years.group(1)}-{years.group(2)}"
    return "turto" if "turto" in fund.lower() else None


def read(path: Path):
    """{(tiekėjas, fondas): [(data, vieneto vertė, turtas | None, indeksas | None)]}"""
    out = defaultdict(list)
    with path.open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            if r["unit_value"]:
                out[(r["provider"], r["fund"])].append((r["date"], float(r["unit_value"]),
                                                        float(r["net_assets"]) if r["net_assets"] else None,
                                                        float(r["benchmark_index"]) if r.get("benchmark_index") else None))
    for v in out.values():
        v.sort()
    return out


def month_ends(first: str, last: str):
    y, m = int(first[:4]), int(first[5:7])
    out = []
    while True:
        nxt = date(y + (m == 12), m % 12 + 1, 1)
        end = nxt - timedelta(days=1)
        if end.isoformat() > last:
            return out
        out.append(end.isoformat())
        y, m = nxt.year, nxt.month


def at_month_ends(rows, ends, col):
    vals, i, best = [], 0, None
    for e in ends:
        while i < len(rows) and rows[i][0] <= e:
            if rows[i][col] is not None:
                best = rows[i]
            i += 1
        ok = best and (date.fromisoformat(e) - date.fromisoformat(best[0])).days <= MAX_GAP
        vals.append(round(best[col], 6) if ok else None)
    return vals


def read_lb_results():
    """{LB kodas: {"risky": %, "bar": %}} iš naujausio LB II pakopos rezultatų failo"""
    files = sorted((ROOT / "imports" / "lb_results").glob("2-pakopa-rezultatai-*.xlsx"))
    if not files:
        return {}, None
    import openpyxl
    wb = openpyxl.load_workbook(files[-1], read_only=True, data_only=True)
    out = {}
    for ws in wb.worksheets:
        for r in ws.iter_rows(values_only=True):
            if len(r) > 22 and r[1] and re.match(r"[A-Z]{3}-(\d\d/\d\d|TIPF)$", str(r[1]).strip()):
                num = lambda v: float(v) if isinstance(v, (int, float)) else None
                out[str(r[1]).strip()] = {"risky": num(r[4]), "bar": num(r[22])}
    return out, re.search(r"(\d{8})", files[-1].name).group(1)


def read_fees():
    """{(pakopa, tiekėjas, grupė arba fondas): (mokestis, mokestis didelei bendrovei)}"""
    path, out = ROOT / "data" / "fees.csv", {}
    if path.exists():
        with path.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                key = r["group"] if r["pillar"] == "II" else r["fund"]
                out[(r["pillar"], r["provider"], key)] = (float(r["fee"]), float(r["fee_large"]))
    return out


def large_companies(year):
    """Bendrovės, kurių II+III pakopos fondų turto vidurkis praėjusiais metais (LB ketvirčių pabaigos) > 2,5 mlrd. Eur"""
    tot = defaultdict(lambda: defaultdict(float))
    path = ROOT / "data" / "portfolios.csv"
    if path.exists():
        with path.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                if r["date"].startswith(str(year - 1)):
                    tot[r["provider"].upper()][r["date"]] += float(r["value"])
    return {p for p, by_q in tot.items() if by_q and sum(by_q.values()) / len(by_q) > 2.5e9}


def lb_code(provider, group):
    pref = {v: k for k, v in LB_PROVIDER.items()}[provider]
    if group == "turto":
        return f"{pref}-TIPF"
    a, b = group.split("-")
    return f"{pref}-{a[2:]}/{b[2:]}"


def build():
    import pillar3

    d2, d3 = read(ROOT / "data" / "nav_history.csv"), read(ROOT / "data" / "pillar3_history.csv")
    lb, lb_date = read_lb_results()
    fees, fee_year = read_fees(), date.today().year
    large = large_companies(fee_year)
    last_day = max(r[-1][0] for r in list(d2.values()) + list(d3.values()))
    ends = month_ends("2018-12-01", last_day)
    funds, daily = [], []
    for pillar, data in (("II", d2), ("III", d3)):
        for (prov, name), rows in sorted(data.items()):
            if pillar == "II":
                g = group_of(name)
                meta = lb.get(lb_code(prov, g), {}) if g else {}
                risky, bar = meta.get("risky"), meta.get("bar")
            else:
                f = next((x for x in pillar3.FUNDS if x[1] == name), None)
                g, risky, bar = (f[2], f[4], None) if f else (None, None, None)
            if g is None:
                continue
            rows = [r for r in rows if r[0] >= "2018-12-01"] or rows[-1:]
            aum = next(((r[0], r[2]) for r in reversed(rows) if r[2]), (None, None))
            has_bm = any(r[3] for r in rows)
            last = rows[-1]
            bm_last = next((r for r in reversed(rows) if r[3]), None)
            funds.append({
                "pl": pillar, "p": prov, "g": g, "n": name,
                "m": at_month_ends(rows, ends, 1),
                "ld": day_number(last[0]), "lv": last[1],
                "bm": at_month_ends(rows, ends, 3) if has_bm else None,
                "bld": day_number(bm_last[0]) if bm_last else None, "blv": bm_last[3] if bm_last else None,
                "risky": risky, "bar": bar,
                "fee": (lambda x: (x[1] if prov in large else x[0]) if x else None)(fees.get((pillar, prov, g if pillar == "II" else name))),
                "aum": round(aum[1]) if aum[1] else None, "aumd": day_number(aum[0]) if aum[0] else None,
                "s0": [day_number(rows[0][0]), rows[0][1]],
                "am": [round(v) if v else None for v in at_month_ends(rows, ends, 2)],
            })
            days = [day_number(r[0]) for r in rows]
            daily.append([days[0], [b - a for a, b in zip(days, days[1:])], [r[1] for r in rows],
                          [r[3] for r in rows] if has_bm else 0])
    return {"months": [day_number(e) for e in ends], "funds": funds, "lbDate": lb_date, "feeYear": fee_year, "large": sorted(large), "_daily": daily}


if __name__ == "__main__":
    data = build()
    print(len(data["months"]), "mėn.;", len(data["funds"]), "fondų; LB", data["lbDate"])
    for f in data["funds"][:3] + [x for x in data["funds"] if x["bm"]][:1]:
        print(f["pl"], f["p"], f["g"], f["n"], f["m"][:3], f["m"][-3:], f["lv"], f["risky"], f["bar"], f["aum"])
