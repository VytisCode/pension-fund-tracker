#!/usr/bin/env python3
"""
Sugeneruoja statinę svetainę (docs/) iš data/nav_history.csv ir site/ failų (puslapiai + bendras kodas); duomenys – docs/data.js.
Paleidžiama po kiekvieno duomenų atnaujinimo (žr. .github/workflows/update.yml).
"""
import csv
import json
import re
import hashlib
import shutil
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import riskfree

ROOT = Path(__file__).parent
DATA = ROOT / "data" / "nav_history.csv"
SITE = ROOT / "site"
DOCS = ROOT / "docs"

PROVIDERS = [  # fiksuota tvarka = fiksuota spalva (CSS --series-N)
    ("ALLIANZ", "Allianz"),
    ("ARTEA", "Artea"),
    ("GOINDEX", "Goindex"),
    ("LUMINOR", "Luminor"),
    ("SEB", "SEB"),
    ("SWEDBANK", "Swedbank"),
]
GROUPS = [
    ("2003-2009", "Gimę 2003–2009"),
    ("1996-2002", "Gimę 1996–2002"),
    ("1989-1995", "Gimę 1989–1995"),
    ("1982-1988", "Gimę 1982–1988"),
    ("1975-1981", "Gimę 1975–1981"),
    ("1968-1974", "Gimę 1968–1974"),
    ("1961-1967", "Gimę 1961–1967"),
    ("turto", "Turto išsaugojimo fondai"),
]


def group_of(fund: str):
    years = re.search(r"(\d{4})\s*[-–]\s*(\d{4})", fund)
    if years:
        return f"{years.group(1)}-{years.group(2)}"
    if "turto" in fund.lower():
        return "turto"
    return None


def day_number(iso: str) -> int:
    return (date.fromisoformat(iso) - date(1970, 1, 1)).days


def main() -> None:
    funds = {}
    with DATA.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            group = group_of(row["fund"])
            if group is None or not row["unit_value"]:
                continue
            entry = funds.setdefault(row["fund"], {"provider": row["provider"], "group": group, "rows": []})
            assets = float(row["net_assets"]) if row["net_assets"] else None
            entry["rows"].append((row["date"], float(row["unit_value"]), assets))

    assets_js = {name: {"d": [day_number(d) for d, _, a in sorted(e["rows"]) if a], "a": [a for d, _, a in sorted(e["rows"]) if a]} for name, e in funds.items()}
    groups = []
    for gid, label in GROUPS:
        items = []
        for name, entry in sorted(funds.items()):
            if entry["group"] != gid:
                continue
            rows = sorted(entry["rows"])
            last_assets = next(((d, a) for d, _, a in reversed(rows) if a), (None, None))
            items.append({
                "provider": entry["provider"],
                "name": name,
                "d": [day_number(d) for d, _, _ in rows],
                "v": [round(v, 5) for _, v, _ in rows],
                "assets": last_assets[1],
                "assetsDate": day_number(last_assets[0]) if last_assets[0] else None,
            })
        groups.append({"id": gid, "label": label, "funds": items})

    payload = {
        "generated": datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M"),
        "providers": [{"id": pid, "label": label} for pid, label in PROVIDERS],
        "groups": groups,
        "rf": riskfree.current(),   # €STR Sharpe koeficientui (None, jei ECB nepasiekiamas ir nėra išsaugotos reikšmės)
        "rfm": riskfree.monthly(),  # €STR mėnesių vidurkiai – Sharpe naudoja laikotarpio vidutinę normą (None – tada paskutinė)
    }
    DOCS.mkdir(exist_ok=True)
    data_js = "const DATA=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data.js").write_text(data_js, encoding="utf-8")
    # Grynieji aktyvai pagal dienas – kraunami tik spaudžiant „dienos lentelės“ Excel mygtuką
    (DOCS / "assets.js").write_text("const ASSETS=" + json.dumps(assets_js, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    build_fresh(groups, payload["generated"])
    build_indexes()
    build_fees()
    build_cpi()
    assets = ("perf.js", "insights.js", "events.js", "style.css", "common.js", "methodology.js", "data.js", "data_idx.js", "data_fee.js", "data_cpi.js")
    for name in ("index.html", "overview.html", "performance.html", "apie.html") + assets[:-4] + ("favicon.svg",):
        shutil.copyfile(SITE / name, DOCS / name)
    # Excel rašytuvas (site/xl.js) – pridedamas prie common.js, kad veiktų visuose puslapiuose be papildomo failo
    (DOCS / "common.js").write_text((SITE / "common.js").read_text(encoding="utf-8") + "\n" + (SITE / "xl.js").read_text(encoding="utf-8"), encoding="utf-8")
    shutil.copytree(SITE / "fonts", DOCS / "fonts", dirs_exist_ok=True)   # šriftai su lietuviškomis raidėmis (Inter, Source Serif 4; OFL licencija)
    # Naršyklės talpykla: prie failų pridedame turinio parašą (?v=...), kad pakeitimai matytųsi iškart
    ver = {n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in assets}
    for page in ("index.html", "overview.html", "performance.html", "apie.html"):
        text = (DOCS / page).read_text(encoding="utf-8")
        for n in assets:
            text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
        if page == "apie.html":
            text = text.replace('src="data_src.js"', f'src="data_src.js?v={hashlib.md5((DOCS / "data_src.js").read_bytes()).hexdigest()[:8]}"')
        (DOCS / page).write_text(text, encoding="utf-8")
    print(f"docs/data.js: {len(data_js) / 1024:.0f} KB, grupių: {len(groups)}, fondų: {sum(len(g['funds']) for g in groups)}")
    build_pillar3(ver)
    build_perf3(ver)
    build_portfolios(ver)
    build_aum(ver)
    build_reports(ver)
    pf_iii_categories()
    build_search_index()
    build_journey(ver)
    build_manager(ver)
    text = (DOCS / "ops.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "data_ops.js", "ops.js"):
        v = ver.get(n) or hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8]
        text = text.replace(f'src="{n}"', f'src="{n}?v={v}"').replace(f'href="{n}"', f'href="{n}?v={v}"')
    (DOCS / "ops.html").write_text(text, encoding="utf-8")




def build_perf3(ver: dict) -> None:
    """III pakopa Rezultatuose (savininkas 2026-10-16): performance.html su data3.js – žr. perf.js PL3."""
    text = (DOCS / "performance.html").read_text(encoding="utf-8")
    v3 = hashlib.md5((DOCS / "data3.js").read_bytes()).hexdigest()[:8]
    shim = ('<script src="data3.js?v=' + v3 + '"></script><script>var PL3 = 1; DATA.groups.forEach(g => g.funds.forEach(f => { if (!f.d) { const d = [f.d0]; '
            'f.dd.forEach(x => d.push(d[d.length - 1] + x)); f.d = d; } }));</script>')
    t3 = text.replace(f'<script src="data.js?v={ver["data.js"]}"></script>', shim).replace("<title>", "<title>III pakopa · ")
    t3 = t3.replace(f'<script src="perf.js?v={ver["perf.js"]}"></script>', f'<script>p3Colors();</script><script src="perf.js?v={ver["perf.js"]}"></script>')
    # III pakopos valdymo mokesčiai (iš data_rep.js) – „Papildomiems rodikliams“ (grąža prieš mokestį)
    try:
        nrm = lambda x: re.sub(r"\s+", " ", x.replace("–", "-").replace("—", "-")).strip().lower()
        js3 = (DOCS / "data3.js").read_text(encoding="utf-8"); d3 = json.loads(js3[js3.index("=") + 1:].strip().rstrip(";").split(";\n")[0])
        jr = (DOCS / "data_rep.js").read_text(encoding="utf-8"); rp = json.loads(jr[jr.index("=") + 1:].strip().rstrip(";").split(";\n")[0])
        fee = {nrm(f["n"]): f["fee"] for f in rp["funds"] if f.get("pl") == "III" and f.get("fee") is not None}
        f3 = {f"{fd['provider']}|{g['id']}": fee[nrm(fd['name'])] for g in d3["groups"] for fd in g["funds"] if nrm(fd["name"]) in fee}
        t3 = t3.replace("<script>p3Colors();</script>", "<script>p3Colors(); if (typeof FEES !== 'undefined') Object.assign(FEES, " + json.dumps(f3) + ");</script>")
    except Exception as e:
        print("perf3: III mokesčių nepavyko pridėti:", e)
    assert "data3.js" in t3 and "p3Colors" in t3
    (DOCS / "performance3.html").write_text(t3, encoding="utf-8")

def build_manager(ver: dict) -> None:
    """Valdytojo ir fondo puslapis (auditas #61 + #64): site/manager.html, site/mgr.js; duomenys – jau sugeneruoti data*.js."""
    # taip pat „Mėnesio apžvalga“ (auditas #59): site/review.html, site/rev.js
    for page, js in (("manager.html", "mgr.js"), ("review.html", "rev.js")):
        shutil.copyfile(SITE / page, DOCS / page)
        shutil.copyfile(SITE / js, DOCS / js)
        names = ("style.css", "common.js", "data.js", "data_rep.js", "data_pf.js", "data_aum.js", js)
        v = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in names if n not in ver}}
        text = (DOCS / page).read_text(encoding="utf-8")
        for n in names:
            text = text.replace(f'src="{n}"', f'src="{n}?v={v[n]}"').replace(f'href="{n}"', f'href="{n}?v={v[n]}"')
        (DOCS / page).write_text(text, encoding="utf-8")


def sources() -> list:
    """Šviežumo sąrašas kitiems duomenims (auditas #54): [{k, d (diena), next (diena, kada laukiama naujų; None – nenuspėjama)}].
    Ketvirtiniai LB failai: laukiama per ~100 d. po kito ketvirčio pabaigos (2026-06-30 failai gauti 2026-10-07)."""
    import csv as _csv
    from datetime import date as _date, timedelta
    dn = lambda d: (d - _date(1970, 1, 1)).days
    def qnext(d):            # kito ketvirčio pabaiga + 100 d.
        y, m = (d.year, d.month + 3) if d.month < 10 else (d.year + 1, 3)
        end = _date(y, m, 30 if m in (6, 9) else 31)
        return end + timedelta(days=100)
    out = []
    def add(k, d, nxt):
        if d:
            out.append({"k": k, "d": dn(d), "next": dn(nxt) if nxt else None})
    def last_line(path):
        with open(path, "rb") as f:
            f.seek(max(0, f.seek(0, 2) - 400))
            return f.read().decode("utf-8", "ignore").strip().splitlines()[-1]
    iso_ = lambda t: _date.fromisoformat(t[:10])
    try:
        d = max(iso_(r["date"]) for r in _csv.DictReader((ROOT / "data" / "pillar3_history.csv").open(encoding="utf-8")) if r["date"])
        add("p3", d, d + timedelta(days=4))
    except Exception:
        pass
    try:
        d = iso_(last_line(ROOT / "data" / "portfolios.csv")); add("pf", d, qnext(d))
    except Exception:
        pass
    res = sorted((ROOT / "imports" / "lb_results").glob("2-pakopa-rezultatai-*.xlsx"))
    if res:
        t = re.search(r"(\d{8})", res[-1].name).group(1); d = _date(int(t[:4]), int(t[4:6]), int(t[6:])); add("lbr", d, qnext(d))
    for k, pat in (("fee2", "pf-ii-mokesciai-*.xls"), ("fee3", "PF_III_mokesciai_*.xlsx")):
        fs = sorted((ROOT / "imports" / "lb_fees").glob(pat))
        if fs:
            add(k, iso_(re.search(r"(\d{4}-\d\d-\d\d)", fs[-1].name).group(1)), None)
    try:
        last = {}
        for r in _csv.DictReader((ROOT / "data" / "indexes.csv").open(encoding="utf-8")):
            last[r["index"]] = max(last.get(r["index"], ""), r["date"])
        d = iso_(min(v for k, v in last.items() if k in ("MSCI_WORLD", "MSCI_ACWI", "SP500", "EUR_GOV7Y"))); add("idx", d, d + timedelta(days=6))   # S&P 500 eurais vėluoja keliomis dienomis (ECB kursas)
    except Exception:
        pass
    try:
        d = iso_(json.loads((ROOT / "data" / "risk_free.json").read_text())["date"]); add("estr", d, d + timedelta(days=4))
    except Exception:
        pass
    try:
        t = last_line(ROOT / "imports" / "journey" / "cpi.csv")[:7]; y, m = int(t[:4]), int(t[5:7])
        d = _date(y, m, 1); y2, m2 = (y, m + 2) if m <= 10 else (y + 1, m - 10); add("cpi", d, _date(y2, m2, 15))
    except Exception:
        pass
    return out


def build_fresh(groups: list, generated: str) -> None:
    """Antraštės šviežumo eilutė visuose puslapiuose: docs/data_fresh.js (naujausia diena ir kiekvieno valdytojo paskutinė diena).
    Valdytojo diena – seniausia iš jo fondų paskutinių dienų; fondai, neatnaujinti > 30 d. (uždaryti), neskaičiuojami."""
    lasts = [(f["provider"], f["d"][-1]) for g in groups for f in g["funds"] if f["d"]]
    top = max(d for _, d in lasts)
    prov = []
    for pid, label in PROVIDERS:
        ds = [d for p, d in lasts if p == pid and d >= top - 30]
        if ds:
            prov.append({"id": pid, "label": label, "d": min(ds)})
    import fund_links as FL
    import source_status
    import sources_list
    pages = {"SEB": FL.SEB_II, "SWEDBANK": FL.SWEDBANK_II, "ARTEA": FL.ARTEA_PAGE, "ALLIANZ": FL.ALLIANZ_PAGE,
             "GOINDEX": FL.GOINDEX_PAGE, "LUMINOR": FL.LUMINOR_TABLE_URLS[0]}
    for x in prov:
        x["url"] = pages.get(x["id"], "")
    payload = {"top": top, "generated": generated, "providers": prov, "src": sources()}
    # Pranešimams (common.js notices): šaltinių būsena (kada pavyko / nepavyko ir kodėl), kiekvieno indekso
    # paskutinė diena ir artėjantys ar pavėluoti rankiniai darbai su instrukcijomis
    payload["st"] = source_status.load()
    try:
        import csv as _csv
        last = {}
        for r in _csv.DictReader((ROOT / "data" / "indexes.csv").open(encoding="utf-8")):
            last[r["index"]] = max(last.get(r["index"], ""), r["date"])
        payload["idx"] = {k: day_number(v) for k, v in last.items() if k in ("MSCI_WORLD", "MSCI_ACWI", "SP500", "EUR_GOV7Y")}
        import indexes as _ix
        tail = sp500_tail(_ix.load())
        if tail:
            payload["idxEst"] = {"SP500": [day_number(min(tail)), day_number(max(tail))]}
    except Exception:
        pass
    inv = sources_list.inventory(payload["src"], top)
    today = day_number(datetime.now(ZoneInfo("Europe/Vilnius")).date().isoformat())
    payload["man"] = [{k: s.get(k) for k in ("id", "lt", "en", "how_lt", "how_en", "url", "next", "f_lt", "f_en")}
                      for s in inv if s["mode"] == "manual" and s.get("next") is not None and s["next"] <= today + 21]
    payload["urls"] = {s["id"]: s["url"] for s in inv if s.get("url")}
    (DOCS / "data_fresh.js").write_text("var FRESH=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    # visų šaltinių sąrašas puslapiui „Apie“ (sources_list.py)
    (DOCS / "data_src.js").write_text("const SRCINV=" + json.dumps(inv, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    build_ops(inv, prov)


def build_ops(inv: list, prov: list) -> None:
    """„Duomenų kalendorius“ (ops.html + ops.js): docs/data_ops.js – įvykiai iš data/ops_log.csv (paskutiniai 400 d.) ir
    artėjantys / pavėluoti atnaujinimai iš šaltinių sąrašo (sources_list.inventory)."""
    import csv as _csv
    from datetime import timedelta
    ev = []
    log = ROOT / "data" / "ops_log.csv"
    if log.exists():
        cut = (date.today() - timedelta(days=400)).isoformat()
        ev = [[r["ts"], r["src"], r["ev"], r["dd"], r["n"], r["msg"]] for r in _csv.DictReader(log.open(encoding="utf-8")) if r["ts"] >= cut]
    up = [{k: s.get(k) for k in ("id", "lt", "en", "url", "mode", "next", "last", "fmt", "f_lt", "f_en", "how_lt", "how_en", "src_lt", "src_en")} for s in inv]
    payload = {"ev": ev, "up": up, "prov": [{"id": p["id"], "label": p["label"], "url": p.get("url", "")} for p in prov]}
    (DOCS / "data_ops.js").write_text("const OPS=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    for n in ("ops.html", "ops.js"):
        shutil.copyfile(SITE / n, DOCS / n)


def build_cpi() -> None:
    """Lietuvos vartotojų kainų indeksas (imports/journey/cpi.csv, Valstybės duomenų agentūra) -> docs/data_cpi.js: {"YYYY-MM": indeksas}.
    Naudojama realiajai grąžai (po infliacijos) „Rezultatų“ puslapyje."""
    cpi = {}
    path = ROOT / "imports" / "journey" / "cpi.csv"
    if path.exists():
        with path.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                if r.get("month") and r.get("cpi"):
                    cpi[r["month"]] = round(float(r["cpi"]), 4)
    (DOCS / "data_cpi.js").write_text("const CPI=" + json.dumps(cpi, separators=(",", ":")) + ";\n", encoding="utf-8")


def build_fees() -> None:
    """II pakopos valdymo mokesčiai (data/fees.csv, žr. import_lb_fees.py) -> docs/data_fee.js: {"TIEKĖJAS|grupė": % per metus}.
    Imamas bazinis tarifas (kaip „Ataskaitose“), ne mažesnis didelių bendrovių tarifas."""
    fees = {}
    path = ROOT / "data" / "fees.csv"
    if path.exists():
        with path.open(encoding="utf-8", newline="") as f:
            for r in csv.DictReader(f):
                if r["pillar"] == "II" and r["fee"]:
                    fees[f'{r["provider"]}|{r["group"]}'] = float(r["fee"])
    (DOCS / "data_fee.js").write_text("const FEES=" + json.dumps(fees, separators=(",", ":")) + ";\n", encoding="utf-8")


SP500_DIV_YIELD = 0.013   # S&P 500 dividendų pajamingumas (~1,3 % per metus, 2024–2026) – tik atsarginiam pratęsimui


def sp500_tail(data: dict) -> dict:
    """Kai Yahoo (S&P 500 TR) neveikia: SP500 eurais pratęsiamas pagal S&P 500 kainų indekso (SP500_PR, USD) pokytį,
    pridedant dividendus (SP500_DIV_YIELD) ir perskaičiuojant ECB EUR/USD kursu. Grąžina {data: vertė} tik dienoms po
    paskutinės tikros SP500 vertės; data/indexes.csv nekeičiamas, todėl gavus tikras vertes jos šias pakeičia."""
    import math
    tr, pr, fx = data.get("SP500", {}), data.get("SP500_PR", {}), data.get("EURUSD", {})
    if not tr or not pr or not fx:
        return {}
    last = max(tr)
    base_pr = [d for d in pr if d <= last]
    base_fx = [d for d in fx if d <= last]
    if not base_pr or not base_fx:
        return {}
    p0, x0, v0 = pr[max(base_pr)], fx[max(base_fx)], tr[last]
    d_last = date.fromisoformat(last)
    out, rate = {}, x0
    for d in sorted(k for k in set(pr) | set(fx) if k > last):
        rate = fx.get(d, rate)
        if d in pr:
            days = (date.fromisoformat(d) - d_last).days
            out[d] = v0 * (pr[d] / p0) * (x0 / rate) * math.exp(math.log(1 + SP500_DIV_YIELD) * days / 365.25)
    return out


def build_indexes() -> None:
    """Pasaulio akcijų indeksai (data/indexes.csv, žr. indexes.py) -> docs/data_idx.js: {id: {d0, dd, v}} nuo 2003-12-31.
    SP500 gali turėti apytikslę pabaigą (sp500_tail) – tada {"est": pirmoji apytikslė diena}."""
    import indexes
    data = indexes.load()
    out = {}
    tail = sp500_tail(data)
    for name in ("MSCI_ACWI", "MSCI_WORLD", "SP500"):
        series = dict(data.get(name, {}))
        if name == "SP500" and tail:
            series.update(tail)
        rows = sorted((d, v) for d, v in series.items() if d >= "2003-12-31")
        if not rows:
            continue
        days = [day_number(d) for d, _ in rows]
        out[name] = {"d0": days[0], "dd": [b - a for a, b in zip(days, days[1:])], "v": [round(v, 2) for _, v in rows]}
        if name == "SP500" and tail:
            out[name]["est"] = day_number(min(tail))
    (DOCS / "data_idx.js").write_text("const IDX=" + json.dumps(out, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"docs/data_idx.js: {sum(len(x['v']) for x in out.values())} reikšmių")


def build_pillar3(ver: dict) -> None:
    """III pakopos polapis: docs/data3.js iš data/pillar3_history.csv + site/pillar3.html, site/p3.js."""
    import pillar3

    path = ROOT / "data" / "pillar3_history.csv"
    if not path.exists():
        return
    series = {}
    with path.open(encoding="utf-8", newline="") as f:
        for row in csv.DictReader(f):
            if row["unit_value"]:
                series.setdefault(row["fund"], []).append(
                    (row["date"], float(row["unit_value"]), float(row["net_assets"]) if row["net_assets"] else None))
    providers, groups = [], {"bond": [], "mixed": [], "equity": []}
    for i, (prov, name, cat, code, risky) in enumerate(pillar3.FUNDS):
        fid = f"f{i}"
        providers.append({"id": fid, "label": name, "brand": prov})
        rows = sorted(series.get(name, []))
        if not rows:
            continue
        last_assets = next(((d, a) for d, _, a in reversed(rows) if a), (None, None))
        d0 = day_number(rows[0][0])
        days = [day_number(d) for d, _, _ in rows]
        groups[cat].append({
            "provider": fid, "brand": prov, "name": name, "code": code, "risky": risky,
            "d0": d0, "dd": [b - a for a, b in zip([d0] + days[:-1], days)][1:],  # dienų skirtumai (mažesnis failas)
            "v": [round(v, 5) for _, v, _ in rows],
            "assets": last_assets[1], "assetsDate": day_number(last_assets[0]) if last_assets[0] else None,
        })
    payload = {
        "generated": datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M"),
        "providers": providers,
        "groups": [{"id": gid, "funds": funds} for gid, funds in groups.items()],
    }
    data_js = "const DATA=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data3.js").write_text(data_js, encoding="utf-8")
    shutil.copyfile(SITE / "pillar3.html", DOCS / "pillar3.html")
    shutil.copyfile(SITE / "p3.js", DOCS / "p3.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data3.js", "p3.js")}}
    text = (DOCS / "pillar3.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "events.js", "data3.js", "p3.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "pillar3.html").write_text(text, encoding="utf-8")
    print(f"docs/data3.js: {len(data_js) / 1024:.0f} KB, III pakopos fondų: {sum(len(g) for g in groups.values())}")


PF_TYPES = {"equity": "e", "bond": "b", "fund": "f", "cash": "c", "derivative": "d"}
# Pavadinimai, kurie iš tikrųjų yra valdymo bendrovės, o ne vertybinio popieriaus pavadinimas (pvz. Allianz ataskaitose)
COMPANY_NAME = re.compile(r"\b(S\.?A\.?|GmbH|Limited|Ltd|Management|Asset Management|Investors|S\.à r\.l\.|AG|plc|Inc)\b\.?\s*$", re.I)


def best_name(names, kind):
    """Iš kelių to paties ISIN pavadinimų (skirtingi valdytojai rašo skirtingai) parenkamas aiškiausias."""
    def score(item):
        n, cnt = item
        s = cnt
        if kind == "fund":
            s += 10000 * bool(re.search(r"ETF|UCITS|Fund|Index|fond|Trust|SICAV|Portfolio", n, re.I))
            s -= 20000 * bool(COMPANY_NAME.search(n))
        if kind == "bond":
            s += 10000 * bool(re.search(r"\d", n))       # su kuponu ir terminu
        s += 5000 * (n != n.upper())                      # ne vien didžiosios raidės
        return s
    return max(names.items(), key=score)[0]


# Alternatyvūs (nelikvidūs) fondai: LB KIS tipai 5 (nekilnojamas turtas), 6 (rizikos draudimo) ir 7 (kiti – privatus kapitalas,
# infrastruktūra, privati skola ir pan.), išskyrus biržoje prekiaujamus ETF / UCITS (pvz. NT indeksų ETF).
ALT_LIQUID = re.compile(r"ETF|UCITS|EPRA|NAREIT|FTSE|iShares|Xtrackers|Amundi|BNP P|Carmignac|Vontobel|SEB Asset Management SA", re.I)
ALT_KINDS = [  # (požymis, raktažodžiai pavadinime) – pirmas atitikęs laimi
    ("debt", r"debt|mezzanine|lending|credit|loan|skol|17Capital|BPM|CVI"),
    ("infra", r"infra|energ|renewabl|clean|solar|wind|green|Ignitis"),
    ("forest", r"forest|land|miš|SG Capital"),
    ("re", r"real estate|property|kinnisvara|EfTEN|Prosperus|LORDS|Capitalica|Horizon|residential|EIKA|PREF|NT fond"),
]


def alt_kind(kind, kis, name):
    if kind != "fund" or kis not in ("5", "6", "7") or ALT_LIQUID.search(name):
        return ""
    for tag, rx in ALT_KINDS:
        if re.search(rx, name, re.I):
            return tag
    return "re" if kis == "5" else "hedge" if kis == "6" else "pe"


def pf_fund_label(code, provider, pillar, name):
    m = re.match(r"[A-Z]{3}-(\d\d)/(\d\d)$", code)
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        a += 2000 if a < 30 else 1900
        b += 2000 if b < 30 else 1900
        return f"{provider} {a}–{b}", f"{a}-{b}"
    if code.endswith("-TIPF"):
        return f"{provider} turto išsaugojimo", "turto"
    short = re.sub(r"\s*\(.*?\)", "", name).strip(" „“\"")
    return short, "III"


def build_portfolios(ver: dict) -> None:
    """Portfelių polapis: docs/data_pf.js iš data/portfolios.csv (žr. portfolios.py) + site/portfolios.html, site/pf.js."""
    path = ROOT / "data" / "portfolios.csv"
    if not path.exists():
        return
    rows = list(csv.DictReader(path.open(encoding="utf-8", newline="")))
    quarters = sorted({r["date"] for r in rows})
    qi = {d: i for i, d in enumerate(quarters)}
    names, meta = {}, {}
    for r in rows:
        names.setdefault(r["pos_id"], {}).setdefault(r["name"], 0)
        names[r["pos_id"]][r["name"]] += 1
        meta[r["pos_id"]] = (r["type"], r["country"], r["currency"], r["kis_type"])  # naujausi duomenys
    # tikri pavadinimai pagal ISIN (tools/fetch_isin_names.py, OpenFIGI) – kai ataskaitoje nurodyta tik valdymo bendrovė
    figi_path = ROOT / "data" / "isin_names.csv"
    figi = {r["isin"]: r["name"] for r in csv.DictReader(figi_path.open(encoding="utf-8", newline=""))} if figi_path.exists() else {}
    # fondų ir ETF aprašai (data/fund_attributes.csv, surinkta iš fondų puslapių ir justETF): pilnas pavadinimas ir požymiai
    attr_path = ROOT / "data" / "fund_attributes.csv"
    attrs = {r["isin"]: r for r in csv.DictReader(attr_path.open(encoding="utf-8", newline=""))} if attr_path.exists() else {}
    # obligacijų sąlygos (data/security_terms.csv, ESMA FIRDS) – pajamingumui ir trukmei (žr. bonds.py)
    import bonds
    terms = bonds.load_terms()
    sec_ids = sorted(names)
    si = {p: i for i, p in enumerate(sec_ids)}
    secs = []
    for p in sec_ids:
        kind, country, cur, kis = meta[p]
        name = best_name(names[p], kind)
        co = kind == "fund" and bool(COMPANY_NAME.search(name))           # ataskaitoje nurodyta tik valdymo bendrovė
        a = attrs.get(p) if kind == "fund" else None
        full = (a or {}).get("name") or (figi.get(p, "") if co else "")   # pilnas oficialus pavadinimas
        ter = (a or {}).get("ter_pct", "")
        secs.append([name, PF_TYPES[kind], country, cur, kis,
                     p if re.match(r"^[A-Z]{2}[A-Z0-9]{9}\d$", p) else "",
                     int(co), alt_kind(kind, kis, " ".join(names[p])), full,
                     # [turto klasė, regionas, EM, indeksinis/aktyvus, SFDR, TER %, valiuta apdrausta, tema, šaltinis]
                     [a["asset_class"], a["region"], a["em"], a["approach"], a["sfdr"], float(ter) if ter else None,
                      a["currency_hedged"], a["theme"], a["source_url"]] if a else 0,
                     # obligacijoms: [išpirkimo data, kuponas %, 1 = kintamos palūkanos]
                     [terms[p]["maturity"], float(terms[p]["coupon"]) if terms[p]["coupon"] else None, int(terms[p]["floating"] == "1")]
                     if kind == "bond" and terms.get(p, {}).get("maturity") else 0])
    # obligacijų YTM ir trukmė kiekvieno ketvirčio pabaigoje: bm[pozicija] = [ketvirtis, YTM %, mod. trukmė, metai iki išpirkimo, ...]
    bm = {}
    seen = set()
    for r in rows:
        key = (r["date"], r["pos_id"])
        if r["type"] != "bond" or key in seen or not r["qty"]:
            continue
        seen.add(key)
        m = bonds.metrics(r["pos_id"], r["date"], float(r["value"]), float(r["qty"]), r["currency"], terms)
        if m:
            bm.setdefault(si[r["pos_id"]], []).extend([qi[r["date"]], None if m[0] is None else round(m[0], 2), round(m[1], 2), round(m[2], 2)])
    funds = {}
    for r in rows:
        f = funds.setdefault(r["fund_code"], {"c": r["fund_code"], "p": r["provider"], "pl": r["pillar"], "r": []})
        f["name"] = r["fund_name"]  # naujausias pavadinimas (eilutės surikiuotos pagal datą)
        qty = float(r["qty"]) if r["qty"] else None
        qty = None if qty is None else (round(qty) if abs(qty) >= 100 else round(qty, 3))
        f["r"].extend([qi[r["date"]], si[r["pos_id"]], qty, round(float(r["value"]))])
    out = []
    for f in sorted(funds.values(), key=lambda f: (f["pl"], f["p"], f["c"])):
        label, group = pf_fund_label(f["c"], f["p"], f["pl"], f["name"])
        out.append({"c": f["c"], "n": label, "full": f["name"], "p": f["p"], "pl": f["pl"], "g": group, "r": f["r"]})
    payload = {"quarters": quarters, "secs": secs, "funds": out, "bm": bm}
    data_js = "const PF=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data_pf.js").write_text(data_js, encoding="utf-8")
    shutil.copyfile(SITE / "portfolios.html", DOCS / "portfolios.html")
    shutil.copyfile(SITE / "pf.js", DOCS / "pf.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_pf.js", "pf.js")}}
    text = (DOCS / "portfolios.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "data_pf.js", "pf.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "portfolios.html").write_text(text, encoding="utf-8")
    print(f"docs/data_pf.js: {len(data_js) / 1024:.0f} KB, ketvirčių: {len(quarters)}, fondų: {len(out)}, pozicijų: {len(secs)}")


def pf_iii_categories() -> None:
    """III pakopos fondams portfelių duomenyse (data_pf.js) – LB kategorija (bond / mixed / equity) iš ataskaitų duomenų
    (data_rep.js), kad „Ketvirčio apžvalga“ lygintų tik tos pačios kategorijos fondus. Sutapatinama pagal pavadinimą."""
    norm = lambda s: re.sub(r"\s+\+", "+", re.sub(r"[\s\u2013\u2014-]+", " ", s.lower())).strip()
    rep_t = (DOCS / "data_rep.js").read_text(encoding="utf-8")
    rep = json.loads(rep_t[rep_t.index("=") + 1:].rstrip().rstrip(";"))
    cat = {norm(f["n"]): f["g"] for f in rep["funds"] if f.get("pl") == "III" and f.get("g")}
    pf_p = DOCS / "data_pf.js"
    pf_t = pf_p.read_text(encoding="utf-8")
    head, body = pf_t[:pf_t.index("=") + 1], pf_t[pf_t.index("=") + 1:].rstrip().rstrip(";")
    pf = json.loads(body)
    n = 0
    for f in pf["funds"]:
        if f.get("pl") != "III":
            continue
        for k in (norm(f["n"]), norm(f["p"] + " " + f["n"])):   # Swedbank fondų vardai portfeliuose – be „Swedbank“
            if k in cat:
                f["cat"] = cat[k]
                n += 1
                break
    pf_p.write_text(head + json.dumps(pf, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    v = hashlib.md5(pf_p.read_bytes()).hexdigest()[:8]                   # naujas talpyklos raktas po pakeitimo
    for page in DOCS.glob("*.html"):
        s = page.read_text(encoding="utf-8")
        s2 = re.sub(r"data_pf\.js\?v=[0-9a-f]+", f"data_pf.js?v={v}", s)
        if s2 != s:
            page.write_text(s2, encoding="utf-8")
    print(f"data_pf.js: III pakopos kategorijos {n} fondams")


def build_search_index() -> None:
    """Paieškos rodyklė (docs/data_search.js, kraunama tik atidarius paiešką): visi fondai (II ir III pakopa) ir visos
    naujausio ketvirčio portfelių investicijos – kad paieška rastų „Amundi“, „Gold“, ISIN ar fondo pavadinimą.
    Įrašas: fondui [„f“, pavadinimas, pakopa, grupė / kategorija, nuoroda, žodžiai]; investicijai [„s“, pavadinimas, rūšis, valdytojai,
    didžiausia dalis fonde %, nuoroda, žodžiai] – tekstas abiem kalbomis sudaromas svetainėje (common.js)."""
    def load(name, var):
        t = (DOCS / name).read_text(encoding="utf-8")
        return json.loads(t[t.index("=") + 1:].rstrip().rstrip(";"))
    pf, rep, data = load("data_pf.js", "PF"), load("data_rep.js", "REP"), load("data.js", "DATA")
    out = []
    for g in data["groups"]:
        for f in g["funds"]:
            pid = f["provider"]
            lab = f["name"]
            out.append(["f", lab, "II", g["id"], f"manager.html#{pid}/II:{g['id']}", f"{pid} {g['id']} fondas fund"])
    for f in rep["funds"]:
        if f.get("pl") == "III":
            out.append(["f", f["n"], "III", f.get("g") or "", f"manager.html#{f['p']}/III:{f['n']}", f"{f['p']} fondas fund iii"])
    last = len(pf["quarters"]) - 1
    held = {}
    for f in pf["funds"]:
        r = f["r"]
        tot = sum(r[i + 3] for i in range(0, len(r), 4) if r[i] == last) or 1
        for i in range(0, len(r), 4):
            if r[i] == last:
                si, w = r[i + 1], r[i + 3] / tot * 100
                h = held.setdefault(si, {"p": set(), "w": 0})
                h["p"].add(f["p"]); h["w"] = max(h["w"], w)
    types = {"e": "akcija stock share", "b": "obligacija bond", "f": "fondas etf fund"}
    for si, h in sorted(held.items(), key=lambda x: -x[1]["w"]):
        s = pf["secs"][si]
        if s[1] in ("c", "d"):
            continue
        name, isin, full, a = s[0], s[5], s[8], s[9]
        theme = a[7] if a else ""
        kw = " ".join(filter(None, [isin, s[0] if full else "", "gold auksas" if theme == "gold" else theme, types.get(s[1], ""), s[2]]))
        out.append(["s", full or name, s[1], sorted(h["p"]), round(h["w"], 1), f"portfolios.html#pos={si}", kw])
    (DOCS / "data_search.js").write_text("var QIDX=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(f"docs/data_search.js: {len(out)} įrašų")


def build_aum(ver: dict) -> None:
    """Turto (AUM) polapis: docs/data_aum.js (žr. aum.py) + site/aum.html, site/aum.js."""
    import aum

    payload = aum.build()
    payload["generated"] = datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M")
    # greitis (savininkas 2026-10-16: „dashboard sulėtėjo“): dienos – skirtumais nuo ankstesnės, turtas – 100 € tikslumu;
    # naršyklėje atkuriama iškart įkėlus failą, todėl puslapių kodas nesikeičia
    for f in payload["funds"]:
        if isinstance(f.get("d"), list) and f["d"] and isinstance(f.get("a"), list):
            f["dd"] = [f["d"][0]] + [b - a for a, b in zip(f["d"], f["d"][1:])]
            del f["d"]
            # turtas – šimtais €, vieneto vertė – kaip šaltinyje (6 sk. po kablelio); abu – skirtumais (null → 0 pokytis + žymė)
            for k, sc in (("a", 10000), ("u", 1000000)):
                if not isinstance(f.get(k), list):
                    continue
                ints = [round(v * sc) if isinstance(v, (int, float)) else None for v in f[k]]
                if any(v is None for v in ints):
                    f[k + "i"] = ints          # retas atvejis – be skirtumų
                else:
                    f[k + "x"] = [ints[0]] + [b - a for a, b in zip(ints, ints[1:])]
                del f[k]
    data_js = ("const AUM=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
               "AUM.funds.forEach(f=>{if(f.dd){let s=0;f.d=f.dd.map(x=>s+=x);delete f.dd;}for(const k of['a','u']){if(f[k+'x']){let s=0;f[k]=f[k+'x'].map(x=>(s+=x)/(k==='a'?1e4:1e6));delete f[k+'x'];}if(f[k+'i']){f[k]=f[k+'i'].map(x=>x==null?x:x/(k==='a'?1e4:1e6));delete f[k+'i'];}}});\n")
    (DOCS / "data_aum.js").write_text(data_js, encoding="utf-8")
    shutil.copyfile(SITE / "aum.html", DOCS / "aum.html")
    shutil.copyfile(SITE / "aum.js", DOCS / "aum.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_aum.js", "aum.js")}}
    text = (DOCS / "aum.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "data_aum.js", "aum.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "aum.html").write_text(text, encoding="utf-8")
    print(f"docs/data_aum.js: {len(data_js) / 1024:.0f} KB, fondų: {len(payload['funds'])}, išmokėjimų: {len(payload['payouts'])}")


KID_RHP = {}


def build_reports(ver: dict) -> None:
    """Ataskaitų polapis: docs/data_rep.js (žr. reports.py) + site/reports.html, site/rep.js."""
    import reports

    payload = reports.build()
    global KID_RHP
    KID_RHP = {(f"{f['p']}|{f['g']}" if f["pl"] == "II" else f"III|{f['n']}"): [f["kid"]["rhp"]] + f["kid"]["s"][f["kid"]["rhp"]][1:]
               for f in payload["funds"] if f.get("kid") and f["kid"].get("s")}   # RHP: nepalankus, nuosaikus, palankus % – „Kelio į pensiją“ KID variantui
    daily = payload.pop("_daily")
    (DOCS / "rep_daily.js").write_text("var REPD=" + json.dumps(daily, separators=(",", ":")) + ";\n", encoding="utf-8")
    payload["generated"] = datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M")
    data_js = "const REP=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data_rep.js").write_text(data_js, encoding="utf-8")
    shutil.copyfile(SITE / "reports.html", DOCS / "reports.html")
    shutil.copyfile(SITE / "rep.js", DOCS / "rep.js")
    shutil.copyfile(SITE / "hy.js", DOCS / "hy.js")
    shutil.copyfile(SITE / "kid.js", DOCS / "kid.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_rep.js", "rep.js", "hy.js", "kid.js", "rep_daily.js")}}
    text = (DOCS / "reports.html").read_text(encoding="utf-8").replace("rep_daily.js", f"rep_daily.js?v={ver['rep_daily.js']}")
    if (DOCS / "data_pf.js").exists():    # portfelių duomenys pusmečio ataskaitos lentelėms (kraunami tik prireikus)
        text = text.replace('data-pf="data_pf.js"', f'data-pf="data_pf.js?v={hashlib.md5((DOCS / "data_pf.js").read_bytes()).hexdigest()[:8]}"')
    for n in ("style.css", "common.js", "data_rep.js", "hy.js", "kid.js", "rep.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "reports.html").write_text(text, encoding="utf-8")
    print(f"docs/data_rep.js: {len(data_js) / 1024:.0f} KB, fondų: {len(payload['funds'])}")


def build_journey(ver: dict) -> None:
    """„Kelias į pensiją“ polapis: docs/data_journey.js (žr. journey.py) + site/journey.html, site/journey.js; fondų vertės – iš data.js."""
    import journey

    payload = journey.build()
    payload["kid"] = KID_RHP
    payload["generated"] = datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M")
    data_js = "const JDATA=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data_journey.js").write_text(data_js, encoding="utf-8")
    # III pakopos fondai – tas pats turinys kaip data3.js, bet kitu kintamuoju (data.js jau turi DATA)
    if (DOCS / "data3.js").exists():
        p3 = (DOCS / "data3.js").read_text(encoding="utf-8").replace("const DATA=", "var P3DATA=", 1)
        (DOCS / "data_journey3.js").write_text(p3, encoding="utf-8")
    shutil.copyfile(SITE / "journey.html", DOCS / "journey.html")
    shutil.copyfile(SITE / "journey.js", DOCS / "journey.js")
    shutil.copyfile(SITE / "insights.js", DOCS / "insights.js")
    shutil.copyfile(SITE / "choose.js", DOCS / "choose.js")
    shutil.copyfile(SITE / "future.js", DOCS / "future.js")
    shutil.copyfile(SITE / "feeimp.js", DOCS / "feeimp.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_journey.js", "journey.js", "data_journey3.js", "insights.js", "choose.js", "future.js", "feeimp.js")}}
    text = (DOCS / "journey.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "data.js", "data_idx.js", "data_journey.js", "data_journey3.js", "journey.js", "insights.js", "choose.js", "future.js", "feeimp.js", "data_fee.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "journey.html").write_text(text, encoding="utf-8")
    print(f"docs/data_journey.js: {len(data_js) / 1024:.0f} KB, Sodros datų: {len(payload['dates'])}")


if __name__ == "__main__":
    main()
