"""Vakarinio laiško rinkos dalis (savininkas 2026-11-06: „Ką svarbaus galima man kasdien pranešti?“).

Skaičiuoja iš jau sugeneruotų svetainės duomenų (docs/data.js – II pakopa, docs/data3.js – III pakopa), todėl skaičiai
sutampa su svetaine. Be AI, be išorinių užklausų.

Kasdien: II ir III pakopos dienos ir metų pokytis, valdytojų eilė šiais metais, vietų pokyčiai grupėse, neįprasti judesiai,
naujienos ir Seimas, artėjantys duomenys. Penktadienį – savaitės suvestinė, pirmą mėnesio laišką – praėjusio mėnesio.
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


def news_lines(today: str) -> list:
    try:
        with (ROOT / "data" / "news.csv").open(encoding="utf-8") as f:
            rows = [r for r in csv.DictReader(f) if r["first_seen"] == today]
    except OSError:
        return []
    if not rows:
        return []
    rows.sort(key=lambda r: (r["country"] != "LT", r["date"]), reverse=False)
    lt = [r for r in rows if r["country"] == "LT"]
    other = len(rows) - len(lt)
    out = ["", f"Naujienos ({len(lt)} LT" + (f", {other} LV/EE" if other else "") + "):"]
    clean = lambda u: re.sub(r"[?&]utm_[^#]*$", "", u)
    out += [f"  • {r['title']} – {r['source'] or r['via']}\n    {clean(r['article_url'] or r['url'])}" for r in (lt or rows)[:3]]
    if len(lt) > 3:
        out.append(f"  … ir dar {len(lt) - 3}: {SITE}index.html#tab=nw")
    return out


def seimas_lines(today: str) -> list:
    try:
        with (ROOT / "data" / "seimas.csv").open(encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
    except OSError:
        return []
    soon = (date.fromisoformat(today) + timedelta(days=14)).isoformat()
    up = sorted({(r["date"], r["title"], r["stage"]) for r in rows if today <= r["date"] <= soon})
    new = sorted({(r["date"], r["title"], r["stage"]) for r in rows if r["first_seen"] == today and r["date"] < today})
    if not up and not new:
        return []
    cut = lambda s: s if len(s) <= 150 else s[:147] + "…"
    return (["", "Seimas (pensijų ir Sodros klausimai):"]
            + [f"  • {d}: {cut(t)}" + (f" ({st})" if st else "") for d, t, st in (up + new)[:4]])


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
    return (["", "Artimiausi laukiami duomenys (30 d.):"] + [f"  • {_iso(s['next'])}: {s['lt']}" for s in xs[:5]]) if xs else []


def build(today: str, first_of_month: bool) -> list:
    D2, D3 = _load("data.js"), _load("data3.js")
    L2, L3 = _last_day(D2), _last_day(D3)
    P2, P3 = _prev_day(D2, L2), _prev_day(D3, L3)
    y2, y3 = _ytd0(L2), _ytd0(L3)
    out = ["", f"RINKA ({_iso(L2)})"]
    d_mkt, _ = pillar2(D2, P2, L2, True)
    y_mkt, y_mgr = pillar2(D2, y2, L2)
    out.append(f"II pakopa, vidutinis gyvenimo ciklo fondas (svertinis pagal turtą): dieną {_pp(d_mkt)}, šiais metais {_pp(y_mkt)}.")
    order = sorted(y_mgr.items(), key=lambda kv: -kv[1])
    out.append("  Valdytojai šiais metais (jų gyvenimo ciklo fondų vidurkis): " + ", ".join(f"{NAMES.get(p, p)} {_pp(v)}" for p, v in order) + ".")
    # vietų pokyčiai grupėse (šie metai): vakar vs šiandien
    r0, r1 = ranks2(D2, y2, P2), ranks2(D2, y2, L2)
    moves = []
    for g in D2["groups"]:
        for p, k in r1.get(g["id"], {}).items():
            k0 = r0.get(g["id"], {}).get(p)
            if k0 and k < k0:                                 # tik pakilimai (kiekvienas pakilimas reiškia kažkieno kritimą)
                moves.append((g["label"] if "label" in g else g["id"], p, k0, k))
    if moves:
        out.append("  Pakilo grupėje (šie metai): " + "; ".join(f"{gl.replace('Gimę ', '')} – {NAMES.get(p, p)} {k0}→{k} vieta" for gl, p, k0, k in moves[:6])
                   + (f" ir dar {len(moves) - 6}" if len(moves) > 6 else "") + ".")
    p3d, p3y = pillar3(D3, P3, L3, True), pillar3(D3, y3, L3)
    out.append(f"III pakopa ({_iso(L3)}), kategorijų vidurkiai – dieną / šiais metais:")
    for k in ("bond", "mixed", "equity"):
        if k in p3y:
            avg, best, worst, n = p3y[k]
            out.append(f"  {CAT3[k]}: {_pp(p3d.get(k, (None,))[0])} / {_pp(avg)}; geriausias {best[1]} {_pp(best[0])}, silpniausias {worst[1]} {_pp(worst[0])} (iš {n})")
    lbl2 = lambda f: NAMES.get(f["provider"], f["provider"])
    lbl3 = lambda f: next((p["label"] for p in D3["providers"] if p["id"] == f["provider"]), "")
    odd = unusual(D2, _prev_day(D2, P2), P2, L2, 1.0, lbl2) + unusual(D3, _prev_day(D3, P3), P3, L3, 1.5, lbl3)
    if odd:
        out += ["  Neįprasti dienos judesiai (nukrypimas nuo grupės > 1 p. p., III pakopoje > 1,5 p. p.):"] + [f"    • {x}" for x in odd[:5]]
    wd = date.fromisoformat(today).weekday()
    if wd == 4:                                          # penktadienis – savaitės suvestinė
        w0 = L2 - 7
        w_mkt, w_mgr = pillar2(D2, w0, L2)
        out += ["", f"SAVAITĖ ({_iso(w0)} → {_iso(L2)})",
                f"II pakopa: {_pp(w_mkt)}. Valdytojai: " + ", ".join(f"{NAMES.get(p, p)} {_pp(v)}" for p, v in sorted(w_mgr.items(), key=lambda kv: -kv[1])) + ".",
                "III pakopa: " + ", ".join(f"{CAT3[k]} {_pp(v[0])}" for k, v in pillar3(D3, L3 - 7, L3).items() if k in CAT3) + "."]
    if first_of_month:                                    # pirmas mėnesio laiškas – praėjusio mėnesio suvestinė
        t = date.fromisoformat(today)
        m1 = (date(t.year, t.month, 1) - timedelta(days=1))
        m0 = (date(m1.year, m1.month, 1) - timedelta(days=1))
        a, b = (m0 - EPOCH).days, (m1 - EPOCH).days
        m_mkt, m_mgr = pillar2(D2, a, b)
        out += ["", f"PRAĖJĘS MĖNUO ({m1:%Y-%m})",
                f"II pakopa: {_pp(m_mkt)}. Valdytojai: " + ", ".join(f"{NAMES.get(p, p)} {_pp(v)}" for p, v in sorted(m_mgr.items(), key=lambda kv: -kv[1])) + ".",
                "III pakopa: " + ", ".join(f"{CAT3[k]} {_pp(v[0])}" for k, v in pillar3(D3, a, b).items() if k in CAT3) + ".",
                f"Mėnesio apžvalga: {SITE}review.html"]
    out += news_lines(today) + seimas_lines(today) + calendar_lines(today)
    return out


if __name__ == "__main__":
    print("\n".join(build(str(date.today()), True)))


def headline() -> str:
    """Laiško temai: II pakopos vidutinio gyvenimo ciklo fondo dienos pokytis."""
    D2 = _load("data.js")
    L2 = _last_day(D2)
    d, _ = pillar2(D2, _prev_day(D2, L2), L2, True)
    return f"II pakopa {_pp(d)} per dieną" if d is not None else ""
