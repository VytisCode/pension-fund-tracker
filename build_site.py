#!/usr/bin/env python3
"""
Sugeneruoja statinę svetainę docs/index.html iš data/nav_history.csv ir site/template.html.
Paleidžiama po kiekvieno duomenų atnaujinimo (žr. .github/workflows/update.yml).
"""
import csv
import json
import re
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).parent
DATA = ROOT / "data" / "nav_history.csv"
TEMPLATE = ROOT / "site" / "template.html"
OUTPUT = ROOT / "docs" / "index.html"

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
    html = TEMPLATE.read_text(encoding="utf-8").replace(
        "/*DATA*/null", json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    )
    OUTPUT.parent.mkdir(exist_ok=True)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"docs/index.html: {len(html) / 1024:.0f} KB, grupių: {len(groups)}, fondų: {sum(len(g['funds']) for g in groups)}")


if __name__ == "__main__":
    main()
