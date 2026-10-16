"""KID veiklos rezultatų scenarijai pagal Reglamento (ES) 2017/653 IV priedą (su 2021/2268 pakeitimais), 2 kategorijos produktas,
reguliarios įmokos 1000 EUR per metus (puslapio „Ataskaitos“ apačia; savininko sprendimas 2026-10-14 – rodyti savo skaičiavimą ir oficialius PID skaičius).

Metodika (patikrinta su 4 SEB III pakopos PID, 2026-04-30):
- stebėjimo laikotarpis – RHP + 5 metai (bet ne mažiau 10), baigiasi paskutinių pilnų metų gruodžio 31 d. (6 p.);
- kainos – pakaitinis lyginamasis indeksas: akcijų dalis × MSCI ACWI EUR Net Return + likusi dalis × sintetinis euro zonos AAA
  vyriausybės obligacijų 7 m. indeksas (indexes.py EUR_GOV7Y), perbalansuojama kas mėnesį; stebėjimai – mėnesių pabaigos;
- jei valdytojas pateikė savo KID skaičiavimo lyginamojo indekso eilutę (data/kid_bench.csv, kid_official.json "bench") – naudojama ji;
- išlaidos (einamosios + sandorių) kaip SEB: iš kiekvieno mėnesio grąžos atimama metinių išlaidų 1/12 (7 c ii, 39 p.);
- kiekvienam laikotarpiui n (1 m., tarpinis = round(RHP ÷ 2), RHP) – visi persidengiantys n metų langai (7 a);
  vidutinis = mediana, palankus = maksimumas (9–10 p.); nepalankus = minimumas, įtraukiant ir langus, kurie baigiasi laikotarpio
  pabaigoje (1…n metų; trumpesnio lango augimas laikomas n metų augimu – 7 b, 7 c iv, 8 p.);
- stresinis (18–19 p.), kaip SEB: paskutinių 60 mėn. log grąžos; 12 mėn. slenkančių langų populiacijos nuokrypių
  99 (1 m.) / 95 (ilgiau) procentilis (Excel PERCENTILE) = σs; Cornish-Fisher su tų 60 mėn. asimetrija ir ekscesu;
  atimamas narys 0,5 × σ0² × N su bendru 60 mėn. σ0; ne geresnis už nepalankų (20 p.);
- 1000 EUR kiekvienų metų pradžioje; scenarijaus metinė grąža r taikoma visoms įmokoms: suma = Σ 1000 × (1 + r)^k (k = 1…n).
Patikra (2026-10-15): su SEB pensija 18+ KID indekso eilute visi 4 scenarijai sutampa su PID iki cento.
Su MSCI ACWI vietoj valdytojo indekso skiriasi 0,1–0,3 p. p. per metus.
"""
import bisect
import csv
import json
import math
import statistics as st
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent
DEFAULT_RHP = {"equity": 15, "mixed": 10, "bond": 5}        # III pakopa, kai PID nežinomas (SEB PID: akcijų 15, mišrūs 11, obligacijų 7)
DEFAULT_EQ = {"equity": 95, "mixed": 50, "bond": 10}        # akcijų dalis, kai LB strategijos dalies nėra
MAX_RHP = 20                                                 # MSCI ACWI istorija nuo 2001 m. – ilgesniam RHP + 5 m. duomenų nėra


def _load():
    s = {"MSCI_ACWI": {}, "EUR_GOV7Y": {}}
    with (ROOT / "data" / "indexes.csv").open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            if r["index"] in s:
                s[r["index"]][r["date"]] = float(r["value"])
    return {k: sorted(v.items()) for k, v in s.items()}


def benches() -> dict:
    """Valdytojų KID skaičiavimo lyginamųjų indeksų eilutės (prieš išlaidas): {pavadinimas: [(metai, mėnuo), vertė]}"""
    p = ROOT / "data" / "kid_bench.csv"
    out = {}
    if p.exists():
        with p.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                out.setdefault(r["bench"], {})[(int(r["date"][:4]), int(r["date"][5:7]))] = float(r["value"])
    return {k: sorted(v.items()) for k, v in out.items()}


def _month_ends(pts):
    """Paskutinė kiekvieno mėnesio reikšmė: {(metai, mėnuo): vertė}"""
    out = {}
    for d, v in pts:
        out[(int(d[:4]), int(d[5:7]))] = v
    return out


def _addm(ym, k):
    y, m = ym
    m += k
    return (y + (m - 1) // 12, (m - 1) % 12 + 1)


def blend(eq_pct, data):
    """Mėnesio pabaigų pakaitinio indekso eilutė [(metai, mėnuo), vertė], perbalansuojama kas mėnesį."""
    e, b = _month_ends(data["MSCI_ACWI"]), _month_ends(data["EUR_GOV7Y"])
    w = eq_pct / 100
    keys = sorted(k for k in e if w >= 0.999 or k in b)
    if w < 0.999:
        keys = [k for k in keys if k in b]
    out, lvl = [], 100.0
    for i, k in enumerate(keys):
        if i:
            p = keys[i - 1]
            if _addm(p, 1) != k:
                out, lvl = [], 100.0            # spraga – pradedama iš naujo
            else:
                r = w * (e[k] / e[p] - 1) + ((1 - w) * (b[k] / b[p] - 1) if w < 0.999 else 0)
                lvl *= 1 + r
        out.append((k, lvl))
    return out


def scenarios(series, rhp, cost_pct, end_year, mom_drop=0):
    """series – [(metai, mėnuo), vertė]; grąžina {n: [stresinis, nepalankus, vidutinis, palankus]} (metinė grąža, %) arba None."""
    obs_years = max(rhp + 5, 10)
    y0 = end_year - obs_years                       # bazė: (y0, 12) – diena prieš stebėjimo pradžią
    keys = [k for k, _ in series]
    vals = dict(series)
    base, last = (y0, 12), (end_year, 12)
    if base not in vals or last not in vals:
        return None
    obs = [k for k in keys if base <= k <= last]
    if len(obs) != obs_years * 12 + 1:
        return None
    c = cost_pct / 100
    px = {obs[0]: 1.0}                                # išlaidos – iš kiekvieno mėnesio grąžos atimama c / 12 (kaip SEB)
    for a, b in zip(obs, obs[1:]):
        px[b] = px[a] * (vals[b] / vals[a] - c / 12)
    g = lambda a, b: px[b] / px[a]
    mid = int(rhp / 2 + 0.5)
    out = {}
    r_all = [math.log(px[obs[i]] / px[obs[i - 1]]) for i in range(1, len(obs))]
    rr = r_all[-60:]                                  # momentai – paskutiniai 5 metai
    mr = rr[:len(rr) - mom_drop]                      # SEB 50+ 2026 faile momentai tik iš pirmų 48 mėn. (jų klaida, kartojama PID versijoje)
    m = sum(mr) / len(mr)
    M2 = sum((x - m) ** 2 for x in mr) / len(mr)
    mu1 = sum((x - m) ** 3 for x in mr) / len(mr) / M2 ** 1.5
    mu2 = sum((x - m) ** 4 for x in mr) / len(mr) / M2 ** 2 - 3
    for n in sorted({1, mid, rhp}):
        wins = sorted(g(s, _addm(s, 12 * n)) ** (1 / n) - 1 for s in obs if _addm(s, 12 * n) <= last)
        if not wins:
            return None
        unf = wins[0]
        # kaip SEB: ir „uodegos“ langai, besibaigiantys paskutine data (12 … 12n+1 mėn.)
        unf = min([unf] + [g(s, last) ** (1 / n) - 1 for s in obs if _addm(last, -12 * n - 1) <= s <= _addm(last, -12)])
        vols = sorted(st.pstdev(rr[i:i + 12]) for i in range(len(rr) - 11))     # kaip SEB: 12 mėn. langai tik paskutinių 60 mėn.
        h = (0.99 if n == 1 else 0.95) * (len(vols) - 1)                          # Excel PERCENTILE (INC)
        sig = vols[int(h)] + (vols[min(int(h) + 1, len(vols) - 1)] - vols[int(h)]) * (h - int(h))
        N, z = 12 * n, (-2.326347874 if n == 1 else -1.644853627)
        cf = z + (z * z - 1) / 6 * mu1 / math.sqrt(N) + (z ** 3 - 3 * z) / 24 * mu2 / N - (2 * z ** 3 - 5 * z) / 36 * mu1 ** 2 / N
        stress = math.exp(sig * math.sqrt(N) * cf - 0.5 * M2 * N) ** (1 / n) - 1   # atimamame naryje – bendras 60 mėn. σ (kaip SEB)
        out[n] = [round(100 * min(stress, unf), 2), round(100 * unf, 2), round(100 * st.median(wins), 2), round(100 * wins[-1], 2)]
    return out


def amount(r_pct, n):
    """Suma po n metų, kai 1000 EUR investuojama kiekvienų metų pradžioje ir metinė grąža r."""
    r = r_pct / 100
    return sum(1000 * (1 + r) ** k for k in range(1, n + 1))


def monthly() -> dict:
    """Mėnesių pabaigų indeksų eilutės puslapio skaičiuoklei (kid.js): {"e0": "YYYY-MM", "e": [...], "b0": ..., "b": [...]}"""
    out = {}
    for k, name in (("e", "MSCI_ACWI"), ("b", "EUR_GOV7Y")):
        me = sorted(_month_ends(_load()[name]).items())
        if not me:
            continue
        y, m = me[0][0]
        vals, cur = [], me[0][0]
        for ym, v in me:
            if ym != cur:                     # spraga – eilutė nutraukiama
                break
            vals.append(float(f"{v:.8g}"))
            cur = _addm(cur, 1)
        out[k + "0"], out[k] = f"{y}-{m:02d}", vals
    out["x"] = {k: {"s0": f"{v[0][0][0]}-{v[0][0][1]:02d}", "v": [float(f"{x:.10g}") for _, x in v]} for k, v in benches().items()}
    return out


def official():
    p = ROOT / "data" / "kid_official.json"
    return json.loads(p.read_text(encoding="utf-8"))["funds"] if p.exists() else []


def for_funds(funds: list, today: date | None = None) -> None:
    """Prideda f["kid"] REP fondams (reports.build): {rhp, years, eq, cost, from, to, s: {n: [4 %]}, src, off?}."""
    today = today or date.today()
    data = _load()
    off = {(o["p"], o["n"]): o for o in official()}
    have_b = bool(data["EUR_GOV7Y"])
    bx = benches()
    cache = {}
    for f in funds:
        o = off.get((f["p"], f["n"]))
        if f["pl"] == "II":
            if f["g"] == "turto":
                rhp, eq0 = 5, f.get("risky")
            else:
                y1 = int(f["g"][-4:]) - 3                    # grupės vidurys
                rhp, eq0 = max(5, 65 - (today.year - y1)), f.get("risky")
        else:
            rhp, eq0 = DEFAULT_RHP.get(f["g"], 10), f.get("risky")
        eq = o["eq"] if o else (eq0 if isinstance(eq0, (int, float)) else DEFAULT_EQ.get(f["g"], 50))
        rhp = o["rhp"] if o else rhp
        capped = rhp > MAX_RHP
        rhp = min(rhp, MAX_RHP)
        cost = o.get("cost", o["ongoing"] + o["tx"]) if o else (f.get("bar") or f.get("fee") or 0.5)
        bench = o.get("bench") if o and o.get("bench") in bx else None
        k = bench or eq
        end_year = today.year - 1
        if eq < 95 and not have_b and not bench:
            f["kid"] = {"rhp": rhp, "eq": eq, "wait": 1}
            continue
        if k not in cache:
            cache[k] = bx[bench] if bench else blend(eq if have_b else 100, data)   # be obligacijų duomenų – ≥ 95 % akcijų fondai skaičiuojami kaip 100 % akcijų
        md = o.get("mom_drop", 0) if bench else 0
        s = scenarios(cache[k], rhp, cost, end_year, md)
        if s is None and today.month <= 1:
            s, end_year = scenarios(cache[k], rhp, cost, end_year - 1, md), end_year - 1
        kid = {"rhp": rhp, "mid": int(rhp / 2 + 0.5), "eq": eq, "cost": round(cost, 6), "bench": bench, "momDrop": md, "capped": int(capped),
               "from": f"{end_year - max(rhp + 5, 10) + 1}-01-01", "to": f"{end_year}-12-31", "s": s, "src": "pid" if o else "rule"}
        if o:
            kid["off"] = {"doc": o["doc"], "years": o["years"], "s": [[o["s"][sc][i]["ret"] for sc in ("stress", "unfav", "mod", "fav")] for i in range(3)],
                          "a": [[o["s"][sc][i]["amount"] for sc in ("stress", "unfav", "mod", "fav")] for i in range(3)], "from": o["from"], "to": o["to"]}
            pk = lambda x: {"doc": x["doc"], "years": o["years"], "s": [[x["s"][sc][i]["ret"] for sc in ("stress", "unfav", "mod", "fav")] for i in range(3)],
                            "a": [[x["s"][sc][i]["amount"] for sc in ("stress", "unfav", "mod", "fav")] for i in range(3)], "from": x["from"], "to": x["to"]}
            kid["old"] = [{**pk(x), "bench": x["bench"], "cost": x["cost"]} for x in o.get("older", []) if x["bench"] in bx]   # ankstesni PID – patikrai
            kid["alt"] = [x for x in o.get("alt", []) if x["bench"] in bx]   # alternatyvios (pataisytos) indekso eilutės
        f["kid"] = kid


if __name__ == "__main__":
    s = scenarios(benches()["SEB pensija 18+"], 15, 1.176988092323284, 2025)
    print("SEB KID indeksas, RHP 15, išlaidos 1,177 %:", s)
    print("PID SEB pensija 18+: 1 m. [-39.19, -39.19, 8.99, 49.78], 8 m. [-10.40, 0.84, 9.53, 14.79], 15 m. [-7.88, 0.45, 7.85, 11.84]")
