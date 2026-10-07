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
    }
    DOCS.mkdir(exist_ok=True)
    data_js = "const DATA=" + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (DOCS / "data.js").write_text(data_js, encoding="utf-8")
    # Grynieji aktyvai pagal dienas – kraunami tik spaudžiant „dienos lentelės“ Excel mygtuką
    (DOCS / "assets.js").write_text("const ASSETS=" + json.dumps(assets_js, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    assets = ("perf.js", "events.js", "style.css", "common.js", "data.js")
    for name in ("index.html", "overview.html", "performance.html") + assets[:-1]:
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
    sec_ids = sorted(names)
    si = {p: i for i, p in enumerate(sec_ids)}
    secs = []
    for p in sec_ids:
        kind, country, cur, kis = meta[p]
        name = best_name(names[p], kind)
        secs.append([name, PF_TYPES[kind], country, cur, kis,
                     p if re.match(r"^[A-Z]{2}[A-Z0-9]{9}\d$", p) else "",
                     int(kind == "fund" and bool(COMPANY_NAME.search(name)))])  # 1 = žinoma tik valdymo bendrovė
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
    payload = {"quarters": quarters, "secs": secs, "funds": out}
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


if __name__ == "__main__":
    main()
