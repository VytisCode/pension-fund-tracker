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
    }
    DOCS.mkdir(exist_ok=True)
    data_js = "const DATA=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data.js").write_text(data_js, encoding="utf-8")
    # Grynieji aktyvai pagal dienas – kraunami tik spaudžiant „dienos lentelės“ Excel mygtuką
    (DOCS / "assets.js").write_text("const ASSETS=" + json.dumps(assets_js, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    build_indexes()
    build_fees()
    assets = ("perf.js", "events.js", "style.css", "common.js", "data.js", "data_idx.js", "data_fee.js")
    for name in ("index.html", "overview.html", "performance.html") + assets[:-3] + ("favicon.svg",):
        shutil.copyfile(SITE / name, DOCS / name)
    # Naršyklės talpykla: prie failų pridedame turinio parašą (?v=...), kad pakeitimai matytųsi iškart
    ver = {n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in assets}
    for page in ("index.html", "overview.html", "performance.html"):
        text = (DOCS / page).read_text(encoding="utf-8")
        for n in assets:
            text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
        (DOCS / page).write_text(text, encoding="utf-8")
    print(f"docs/data.js: {len(data_js) / 1024:.0f} KB, grupių: {len(groups)}, fondų: {sum(len(g['funds']) for g in groups)}")
    build_pillar3(ver)
    build_portfolios(ver)
    build_aum(ver)
    build_reports(ver)
    build_journey(ver)


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


def build_indexes() -> None:
    """Pasaulio akcijų indeksai (data/indexes.csv, žr. indexes.py) -> docs/data_idx.js: {id: {d0, dd, v}} nuo 2003-12-31."""
    import indexes
    data = indexes.load()
    out = {}
    for name in ("MSCI_ACWI", "MSCI_WORLD", "SP500"):
        rows = sorted((d, v) for d, v in data.get(name, {}).items() if d >= "2003-12-31")
        if not rows:
            continue
        days = [day_number(d) for d, _ in rows]
        out[name] = {"d0": days[0], "dd": [b - a for a, b in zip(days, days[1:])], "v": [round(v, 2) for _, v in rows]}
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


def build_aum(ver: dict) -> None:
    """Turto (AUM) polapis: docs/data_aum.js (žr. aum.py) + site/aum.html, site/aum.js."""
    import aum

    payload = aum.build()
    payload["generated"] = datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M")
    data_js = "const AUM=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data_aum.js").write_text(data_js, encoding="utf-8")
    shutil.copyfile(SITE / "aum.html", DOCS / "aum.html")
    shutil.copyfile(SITE / "aum.js", DOCS / "aum.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_aum.js", "aum.js")}}
    text = (DOCS / "aum.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "data_aum.js", "aum.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "aum.html").write_text(text, encoding="utf-8")
    print(f"docs/data_aum.js: {len(data_js) / 1024:.0f} KB, fondų: {len(payload['funds'])}, išmokėjimų: {len(payload['payouts'])}")


def build_reports(ver: dict) -> None:
    """Ataskaitų polapis: docs/data_rep.js (žr. reports.py) + site/reports.html, site/rep.js."""
    import reports

    payload = reports.build()
    daily = payload.pop("_daily")
    (DOCS / "rep_daily.js").write_text("var REPD=" + json.dumps(daily, separators=(",", ":")) + ";\n", encoding="utf-8")
    payload["generated"] = datetime.now(ZoneInfo("Europe/Vilnius")).strftime("%Y-%m-%d %H:%M")
    data_js = "const REP=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data_rep.js").write_text(data_js, encoding="utf-8")
    shutil.copyfile(SITE / "reports.html", DOCS / "reports.html")
    shutil.copyfile(SITE / "rep.js", DOCS / "rep.js")
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_rep.js", "rep.js", "rep_daily.js")}}
    text = (DOCS / "reports.html").read_text(encoding="utf-8").replace("rep_daily.js", f"rep_daily.js?v={ver['rep_daily.js']}")
    for n in ("style.css", "common.js", "data_rep.js", "rep.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "reports.html").write_text(text, encoding="utf-8")
    print(f"docs/data_rep.js: {len(data_js) / 1024:.0f} KB, fondų: {len(payload['funds'])}")


def build_journey(ver: dict) -> None:
    """„Kelias į pensiją“ polapis: docs/data_journey.js (žr. journey.py) + site/journey.html, site/journey.js; fondų vertės – iš data.js."""
    import journey

    payload = journey.build()
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
    ver = {**ver, **{n: hashlib.md5((DOCS / n).read_bytes()).hexdigest()[:8] for n in ("data_journey.js", "journey.js", "data_journey3.js", "insights.js")}}
    text = (DOCS / "journey.html").read_text(encoding="utf-8")
    for n in ("style.css", "common.js", "data.js", "data_idx.js", "data_journey.js", "data_journey3.js", "journey.js", "insights.js"):
        text = text.replace(f'src="{n}"', f'src="{n}?v={ver[n]}"').replace(f'href="{n}"', f'href="{n}?v={ver[n]}"')
    (DOCS / "journey.html").write_text(text, encoding="utf-8")
    print(f"docs/data_journey.js: {len(data_js) / 1024:.0f} KB, Sodros datų: {len(payload['dates'])}")


if __name__ == "__main__":
    main()
