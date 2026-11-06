"""Vakarinio laiško rinkos dalis (savininkas 2026-11-06: „Ką svarbaus galima man kasdien pranešti?“).

Skaičiuoja iš jau sugeneruotų svetainės duomenų (docs/data.js – II pakopa, docs/data3.js – III pakopa), todėl skaičiai
sutampa su svetaine. Be AI, be išorinių užklausų.

Savininkas 2026-11-06: kasdienis laiškas – trumpas, žmogiška kalba („dabar skaitau kaip robotas“); platesnis – kas mėnesį,
kas ketvirtį ir gavus naujus LB portfelius. Kasdien: kaip vakar sekėsi, ar pasikeitė metų lyderis, neįprastas valdytojo elgesys,
viena naujiena, penktadienį – savaitė. Mėnesio / ketvirčio / portfelių blokai – daily_report.py prideda pagal progą.
Vienos dienos „geriausias fondas“ sąmoningai nerodomas: dienos grąža – daugiausia rinkos triukšmas.

    python report_market.py      – atspausdina rinkos dalį
"""
import csv
import json
import re
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent
EPOCH = date(1970, 1, 1)
NAMES = {"ALLIANZ": "Allianz", "ARTEA": "Artea", "GOINDEX": "Goindex", "LUMINOR": "Luminor", "SEB": "SEB", "SWEDBANK": "Swedbank"}
CAT3 = {"bond": "Obligacijų", "mixed": "Mišraus", "equity": "Akcijų"}
SITE = "https://vytiscode.github.io/pension-fund-tracker/"


def _load(name: str) -> dict:
    t = (ROOT / "docs" / name).read_text(encoding="utf-8")
    d = json.loads(t[t.index("=") + 1:].split(";\n")[0].strip().rstrip(";"))
    for g in d["groups"]:
        for f in g["funds"]:
            if "d" not in f:                              # data3.js: dienos užrašytos skirtumais
                xs = [f["d0"]]
                for x in f["dd"]:
                    xs.append(xs[-1] + x)
                f["d"] = xs
    return d


def _val(f: dict, day: int):
    """Paskutinė vieneto vertė iki dienos `day` (imtinai) ir jos diena."""
    d = f["d"]
    lo, hi = 0, len(d) - 1
    if not d or d[0] > day:
        return None, None
    while lo < hi:
        m = (lo + hi + 1) // 2
        if d[m] <= day:
            lo = m
        else:
            hi = m - 1
    return f["v"][lo], d[lo]


def _ret(f: dict, a: int, b: int, exact: bool = False):
    va, da = _val(f, a)
    vb, db = _val(f, b)
    if not va or vb is None or db < b - 7 or f["d"][0] > a:   # pasenęs ar vėliau pradėjęs fondas – nelyginamas
        return None
    if exact and (db != b or da != a):                      # dienos pokytis – tik jei abi dienos tikrai paskelbtos (kitaip vėluojantis valdytojas atrodo „neįprastas“)
        return None
    return (vb / va - 1) * 100


def _avg(xs):
    xs = [x for x in xs if x is not None]
    return sum(xs) / len(xs) if xs else None


def _wavg(pairs):
    pairs = [(x, w) for x, w in pairs if x is not None]
    if not pairs:
        return None
    W = sum(w or 0 for _, w in pairs)
    return sum(x * (w or 0) for x, w in pairs) / W if W > 0 else _avg([x for x, _ in pairs])


def _pp(x, d=2):
    return "–" if x is None else f"{x:+.{d}f}".replace(".", ",").replace("-", "−") + " %"


def _iso(n: int) -> str:
    return str(EPOCH + timedelta(days=n))


def _last_day(D: dict) -> int:
    return max(f["d"][-1] for g in D["groups"] for f in g["funds"] if f["d"])


def _prev_day(D: dict, last: int) -> int:
    return max((x for g in D["groups"] for f in g["funds"] for x in f["d"][-3:] if x < last), default=last - 1)


def _ytd0(last: int) -> int:
    return (date((EPOCH + timedelta(days=last)).year - 1, 12, 31) - EPOCH).days


def pillar2(D: dict, a: int, b: int, exact: bool = False):
    """II pakopa (gyvenimo ciklo fondai, be turto išsaugojimo): rinkos svertinis pokytis ir valdytojų vidurkiai."""
    lc = [g for g in D["groups"] if g["id"] != "turto"]
    mkt = _wavg([(_ret(f, a, b, exact), f.get("assets")) for g in lc for f in g["funds"]])
    by = {}
    for g in lc:
        for f in g["funds"]:
            by.setdefault(f["provider"], []).append(_ret(f, a, b, exact))
    mgr = {p: _avg(xs) for p, xs in by.items() if _avg(xs) is not None}
    return mkt, mgr


def ranks2(D: dict, a: int, b: int) -> dict:
    """Vietos kiekvienoje II pakopos grupėje pagal grąžą laikotarpiu (a, b]."""
    out = {}
    for g in D["groups"]:
        xs = sorted(((r, f["provider"]) for f in g["funds"] if (r := _ret(f, a, b)) is not None), reverse=True)
        out[g["id"]] = {p: i + 1 for i, (_, p) in enumerate(xs)}
    return out


def pillar3(D: dict, a: int, b: int, exact: bool = False) -> dict:
    """III pakopa: kategorijos vidutinis pokytis (lygūs svoriai), geriausias ir silpniausias fondas."""
    out = {}
    for g in D["groups"]:
        name = {p["id"]: p["label"] for p in D["providers"]}
        xs = sorted(((r, name.get(f["provider"], f.get("name", ""))) for f in g["funds"] if (r := _ret(f, a, b, exact)) is not None), reverse=True)
        if xs:
            out[g["id"]] = (_avg([x for x, _ in xs]), xs[0], xs[-1], len(xs))
    return out


def _median(xs):
    s = sorted(xs)
    return None if not s else s[len(s) // 2] if len(s) % 2 else (s[len(s) // 2 - 1] + s[len(s) // 2]) / 2


def unusual(D: dict, a0: int, a: int, b: int, lim: float, label) -> list:
    """Fondai, kurių dienos pokytis nuo grupės medianos skiriasi daugiau nei `lim` p. p.
    Nerodomi tie, kurių pokytis atitinka vakarykštę grupės medianą: tai vertinimo vėlavimas (pvz. Allianz vertina vienos dienos
    senumo kainomis), o ne tikras skirtumas – kitaip jie „neįprasti“ būtų kas antrą dieną."""
    out = []
    for g in D["groups"]:
        rs = [(r, f) for f in g["funds"] if (r := _ret(f, a, b, True)) is not None]
        if len(rs) < 3:
            continue
        med, med0 = _median([r for r, _ in rs]), _median([r for f in g["funds"] if (r := _ret(f, a0, a, True)) is not None])
        out += [(label(f), (g.get('label') or CAT3.get(g['id'], g['id'])).replace('Gimę ', ''), r, med)
                for r, f in rs if abs(r - med) > lim and (med0 is None or abs(r - med0) > lim / 2)]
    by = {}                                             # vienas valdytojas keliose grupėse – viena eilutė
    for who, grp, r, med in out:
        by.setdefault(who, []).append((grp, r - med))
    return [f"{who}: " + (f"{grp} {_pp(dv).replace(' %', ' p. p.')} nuo grupės medianos" if len(xs) == 1 else
            f"{len(xs)} grupėse vidutiniškai {_pp(sum(x for _, x in xs) / len(xs)).replace(' %', ' p. p.')} nuo grupės medianos ({', '.join(gr for gr, _ in xs)})")
            for who, xs in by.items() for grp, dv in [xs[0]]]


MON = ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"]
MON_N = ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"]


def _p1(x):                                             # „−1,4 %“ – kasdieniam tekstui užtenka vieno skaitmens
    return _pp(x, 1)


def _day(n: int) -> str:
    d = EPOCH + timedelta(days=n)
    return f"{MON[d.month - 1]} {d.day} d."


def _move(x) -> str:
    return "beveik nepasikeitė" if x is None or abs(x) < 0.2 else ("pakilo" if x > 0 else "krito")


def _clean(u: str) -> str:
    return re.sub(r"[?&]utm_[^#]*$", "", u)


def _mgr_list(m: dict) -> str:
    return ", ".join(f"{NAMES.get(p, p)} {_p1(v)}" for p, v in sorted(m.items(), key=lambda kv: -kv[1]))


def _best_worst(m: dict) -> str:
    o = sorted(m.items(), key=lambda kv: -kv[1])
    return f"geriausias rezultatas – {NAMES.get(o[0][0], o[0][0])} ({_p1(o[0][1])}), prasčiausias – {NAMES.get(o[-1][0], o[-1][0])} ({_p1(o[-1][1])})" if len(o) > 1 else ""


def daily(today: str) -> tuple:
    """Trumpas kasdienis tekstas: (temos pradžia, eilutės)."""
    D2, D3 = _load("data.js"), _load("data3.js")
    L2, L3 = _last_day(D2), _last_day(D3)
    P2, P3 = _prev_day(D2, L2), _prev_day(D3, L3)
    d2, _ = pillar2(D2, P2, L2, True)
    y2, ym = pillar2(D2, _ytd0(L2), L2)
    _, ym0 = pillar2(D2, _ytd0(L2), P2)
    eq = pillar3(D3, P3, L3, True).get("equity")
    out = [f"{_day(L2).capitalize()} fondai {_move(d2)}: vidutinis II pakopos fondas {_p1(d2)}"
           + (f", III pakopos akcijų fondai {_p1(eq[0])}" if eq else "") + f". Nuo metų pradžios II pakopa uždirbo {_p1(y2)}."]
    lead = lambda m: max(m, key=m.get) if m else None
    if ym and ym0 and lead(ym) != lead(ym0):
        out.append(f"Naujas metų lyderis: {NAMES.get(lead(ym), lead(ym))} ({_p1(ym[lead(ym)])}) aplenkė {NAMES.get(lead(ym0), lead(ym0))}.")
    odd = unusual(D2, _prev_day(D2, P2), P2, L2, 1.0, lambda f: NAMES.get(f["provider"], f["provider"]))
    for x in odd[:2]:                                   # „Allianz: 4 grupėse vidutiniškai +1,92 p. p. …“ → paprastas sakinys
        m = re.match(r"(\S+): (?:(\d+) grupėse vidutiniškai )?.*?([+−]\d+,\d+) p\. p\.", x)
        if m:
            who, n, v = m.group(1), m.group(2), float(m.group(3).replace("−", "-").replace(",", "."))
            up = (d2 or 0) >= 0
            more = (v > 0) == up                        # nuokrypis ta pačia kryptimi kaip rinka – judėjo labiau
            verb = "pakilo" if up else "nukrito"
            out.append(f"{who} tą dieną elgėsi kitaip nei kiti: {verb} ~{abs(v):.1f} p. p. {'daugiau' if more else 'mažiau'}".replace(".", ",", 1)
                       + (f" ({n} grupėse)." if n else "."))
    if date.fromisoformat(today).weekday() == 4:        # penktadienis – savaitė vienu sakiniu
        w, wm = pillar2(D2, L2 - 7, L2)
        out.append(f"Per savaitę II pakopa {_p1(w)}; " + _best_worst(wm) + ".")
    out += news_short(today) + seimas_short(today)
    return f"{_p1(d2)} ({_day(L2)})", out


def news_short(today: str) -> list:
    try:
        with (ROOT / "data" / "news.csv").open(encoding="utf-8") as f:
            rows = [r for r in csv.DictReader(f) if r["first_seen"] == today and r["country"] == "LT"]
    except OSError:
        return []
    if not rows:
        return []
    r = rows[0]
    more = f" (ir dar {len(rows) - 1} – {SITE}index.html#tab=nw)" if len(rows) > 1 else ""
    return [f"Naujiena: {r['title']} ({r['source'] or r['via']}) {_clean(r['article_url'] or r['url'])}{more}"]


def seimas_short(today: str) -> list:
    try:
        with (ROOT / "data" / "seimas.csv").open(encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    except OSError:
        return []
    soon = (date.fromisoformat(today) + timedelta(days=3)).isoformat()
    up = sorted({(r["date"], r["title"]) for r in rows if today <= r["date"] <= soon})
    if not up:
        return []
    d, t = up[0]
    t = t if len(t) <= 120 else t[:117] + "…"
    return [f"Seime {_day((date.fromisoformat(d) - EPOCH).days)}: {t}" + (f" (ir dar {len(up) - 1})" if len(up) > 1 else "")]


def calendar_lines(today: str) -> list:
    """Artimiausi 30 d. laukiami nekasdieniai duomenys (sources_list.py)."""
    try:
        import build_site
        import sources_list
        d0 = (date.fromisoformat(today) - EPOCH).days
        xs = [s for s in sources_list.inventory(build_site.sources(), d0)
              if s["id"] not in ("nav", "p3", "idx", "estr") and s.get("next") is not None and d0 <= s["next"] <= d0 + 30]
    except Exception:  # noqa: BLE001
        return []
    xs.sort(key=lambda s: s["next"])
    return (["Šį mėnesį laukiama: " + "; ".join(f"{s['lt'][0].lower() + s['lt'][1:]} ({_day(s['next'])})" for s in xs[:4]) + "."]) if xs else []


def month_block(today: str) -> list:
    """Platesnis blokas pirmame mėnesio laiške: praėjęs mėnuo."""
    D2, D3 = _load("data.js"), _load("data3.js")
    t = date.fromisoformat(today)
    m1 = date(t.year, t.month, 1) - timedelta(days=1)
    m0 = date(m1.year, m1.month, 1) - timedelta(days=1)
    a, b = (m0 - EPOCH).days, (m1 - EPOCH).days
    mm, mg = pillar2(D2, a, b)
    ym, yg = pillar2(D2, _ytd0(b), b)
    c3 = pillar3(D3, a, b)
    out = ["", f"── {MON_N[m1.month - 1]}: kaip sekėsi per mėnesį ──",
           f"II pakopos vidutinis fondas {_p1(mm)}; {_best_worst(mg)}.",
           f"Nuo metų pradžios: {_mgr_list(yg)} (vidurkis {_p1(ym)}).",
           "III pakopa: " + ", ".join(f"{CAT3[k].lower()} fondai {_p1(c3[k][0])}" for k in CAT3 if k in c3) + "."]
    best = [(k, c3[k][1]) for k in ("equity", "mixed") if k in c3]
    if best:
        out.append("Geriausi III pakopos fondai: " + "; ".join(f"{CAT3[k].lower()} – {n} ({_p1(v)})" for k, (v, n) in best) + ".")
    out += calendar_lines(today)
    out.append(f"Išsami mėnesio apžvalga: {SITE}review.html")
    return out


def quarter_block(today: str) -> list:
    """Ketvirčio pradžios laiške: praėjęs ketvirtis ir valdytojų vietos."""
    D2, D3 = _load("data.js"), _load("data3.js")
    t = date.fromisoformat(today)
    q1 = date(t.year, t.month, 1) - timedelta(days=1)
    q0m = q1.month - 2
    q0 = date(q1.year, q0m, 1) - timedelta(days=1)
    a, b = (q0 - EPOCH).days, (q1 - EPOCH).days
    qm, qg = pillar2(D2, a, b)
    c3 = pillar3(D3, a, b)
    qn = (q1.month - 1) // 3 + 1
    out = ["", f"── {q1.year} m. {['I', 'II', 'III', 'IV'][qn - 1]} ketvirtis ──",
           f"II pakopos vidutinis fondas {_p1(qm)}. Valdytojai per ketvirtį: {_mgr_list(qg)}.",
           "III pakopa: " + "; ".join(f"{CAT3[k].lower()} {_p1(c3[k][0])}, geriausias {c3[k][1][1]} ({_p1(c3[k][1][0])})" for k in CAT3 if k in c3) + ".",
           "Lietuvos banko portfelius ir rezultatus už šį ketvirtį tikimės po ~2 mėn.; kai ateis, gausite atskirą platesnį laišką.",
           f"Rezultatai: {SITE}performance.html · III pakopa: {SITE}performance3.html"]
    return out


def portfolio_block() -> list:
    """Gavus naujus LB portfelius: ką fondai pakeitė per ketvirtį (visa rinka, II + III pakopa)."""
    rows = {}
    with (ROOT / "data" / "portfolios.csv").open(encoding="utf-8") as f:
        for r in csv.DictReader(f):
            rows.setdefault(r["date"], []).append(r)
    ds = sorted(rows)
    if len(ds) < 2:
        return []
    cur, prv = rows[ds[-1]], rows[ds[-2]]
    v = lambda r: float(r["value"] or 0)
    def mix(rs):
        tot = sum(v(r) for r in rs) or 1
        out = {}
        for r in rs:
            out[r["type"]] = out.get(r["type"], 0) + v(r) / tot * 100
        return out, tot
    m1, t1 = mix(cur)
    m0, t0 = mix(prv)
    lbl = {"equity": "akcijos", "fund": "fondai ir ETF", "bond": "obligacijos", "cash": "pinigai"}
    try:                                               # LB faile fondams dažnai nurodyta valdymo įmonė – tikras pavadinimas iš ISIN registro
        with (ROOT / "data" / "isin_names.csv").open(encoding="utf-8") as f:
            nm = {r["isin"]: r["name"] for r in csv.DictReader(f) if r.get("name")}
    except OSError:
        nm = {}
    def agg(rs, skip_bonds=False):
        out = {}
        for r in rs:
            if skip_bonds and r["type"] == "bond":       # obligacijų dingimas dažniausiai = išpirkimas, ne pardavimas (auditas #2)
                continue
            k = r["pos_id"] or r["name"]
            out[k] = (out.get(k, (0, ""))[0] + v(r), nm.get(r["pos_id"], r["name"]))
        return out
    a1, a0 = agg(cur), agg(prv)
    new = sorted(((x, n) for k, (x, n) in a1.items() if k not in a0), reverse=True)[:3]
    gone = sorted(((x, n) for k, (x, n) in agg(prv, True).items() if k not in a1), reverse=True)[:3]
    mln = lambda x: f"{x / 1e6:.1f}".replace(".", ",") + " mln. €"
    q = ds[-1]
    out = ["", f"── Nauji fondų portfeliai ({q}) ──",
           f"Visų II ir III pakopos fondų investicijos: {mln(t1)} (prieš ketvirtį {mln(t0)}).",
           "Sudėtis: " + ", ".join(f"{lbl[k]} {m1.get(k, 0):.0f} % (" + f"{(m1.get(k, 0) - m0.get(k, 0)):+.1f}".replace(".", ",").replace("-", "−") + " p. p.)"
                                    for k in ("fund", "equity", "bond", "cash")) + "."]
    if new:
        out.append("Didžiausi nauji pirkiniai: " + "; ".join(f"{n} ({mln(x)})" for x, n in new) + ".")
    if gone:
        out.append("Visiškai parduota (be išpirktų obligacijų): " + "; ".join(f"{n} ({mln(x)})" for x, n in gone) + ".")
    out.append(f"Visi pokyčiai: {SITE}portfolios.html#tab=tc")
    return out


if __name__ == "__main__":
    import sys
    t = sys.argv[1] if len(sys.argv) > 1 else str(date.today())
    h, ls = daily(t)
    print(h); print("\n".join(ls)); print("\n".join(month_block(t) + quarter_block(t) + portfolio_block()))
