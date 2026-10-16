#!/usr/bin/env python3
"""
Duomenų įvykių žurnalas (savininko užduotis 2026-10-16): data/ops_log.csv – kada kokie duomenys atkeliavo, kas nepavyko
ir kada vėl pradėjo veikti. Iš jo svetainės puslapis „Duomenų kalendorius“ rodo kalendorių, valdytojų skelbimo laiką
ir artėjančius darbus.

Įvykiai skaičiuojami iš to, kas pasikeitė duomenų failuose (git diff), todėl tas pats kodas tinka ir dabarčiai,
ir istorijai:
  python tools/ops_log.py            – prieš commit kasdieniame paleidime: šio paleidimo pakeitimai + šaltinių būsenos pokyčiai
  python tools/ops_log.py backfill   – vienkartinis: atkuria įvykius iš ankstesnių automatinių commit'ų

Stulpeliai: ts (UTC, YYYY-MM-DDTHH:MM), src (nav.SEB, p3.SEB, idx.MSCI_ACWI, cpi, lb.pf, lb.lbr, lb.fee …), ev (new | fail | ok),
dd (naujausia duomenų diena), n (naujų eilučių), msg. Žurnalas tik papildomas, niekada neperrašomas.
"""
import csv
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOG = ROOT / "data" / "ops_log.csv"
COLS = ["ts", "src", "ev", "dd", "n", "msg"]
WATCH = ["data/nav_history.csv", "data/pillar3_history.csv", "data/indexes.csv", "imports/journey/cpi.csv",
         "imports/journey/pensions.csv", "imports/journey/wages.csv", "data/fees.csv", "data/risk_free.json"]
LB_DIRS = {"imports/lb_portfolios": "lb.pf", "imports/lb_results": "lb.lbr", "imports/lb_fees": "lb.fee"}
INDEXES = {"MSCI_WORLD", "MSCI_ACWI", "SP500", "EUR_GOV7Y"}


def git(*args) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True).stdout


def events_from_diff(diff: str, ts: str) -> list:
    """Unified diff (-U0) → įvykiai „new“: kiekvienam šaltiniui naujausia pridėta duomenų diena ir eilučių skaičius."""
    out, cur, agg = [], None, {}
    for line in diff.splitlines():
        if line.startswith("+++ "):
            cur = line[6:] if line.startswith("+++ b/") else None
            continue
        if not cur or not line.startswith("+") or line.startswith("+++"):
            continue
        row = line[1:]
        key = dd = None
        if cur in ("data/nav_history.csv", "data/pillar3_history.csv"):
            p = row.split(",")
            if len(p) >= 3 and re.match(r"\d{4}-\d\d-\d\d$", p[0]):
                key, dd = ("nav." if "nav" in cur else "p3.") + p[1], p[0]
        elif cur == "data/indexes.csv":
            p = row.split(",")
            if len(p) >= 3 and p[1] in INDEXES and re.match(r"\d{4}-\d\d-\d\d$", p[0]):
                key, dd = "idx." + p[1], p[0]
        elif cur == "imports/journey/cpi.csv":
            m = re.match(r"(\d{4}-\d\d)", row)
            if m:
                key, dd = "cpi", m.group(1)
        elif cur == "imports/journey/pensions.csv":
            m = re.match(r"(\d{4})", row)
            if m:
                key, dd = "pens", m.group(1)
        elif cur == "imports/journey/wages.csv":
            m = re.match(r"(\d{4})", row)
            if m:
                key, dd = "wages", m.group(1)
        elif cur == "data/fees.csv":
            key, dd = "fee", ""
        elif cur == "data/risk_free.json":
            m = re.search(r'"date":\s*"(\d{4}-\d\d-\d\d)"', row)
            if m:
                key, dd = "estr", m.group(1)
        if key:
            a = agg.setdefault(key, {"dd": "", "n": 0})
            a["n"] += 1
            if dd and dd > a["dd"]:
                a["dd"] = dd
    for key, a in sorted(agg.items()):
        out.append({"ts": ts, "src": key, "ev": "new", "dd": a["dd"], "n": a["n"], "msg": ""})
    return out


def lb_events(paths: list, ts: str) -> list:
    """Nauji Lietuvos banko failai (imports/lb_*): failo vardo data = ataskaitos laikotarpio pabaiga."""
    out = []
    for p in paths:
        for d, src in LB_DIRS.items():
            if p.startswith(d + "/"):
                m = re.search(r"(\d{4})-?(\d\d)-?(\d\d)", Path(p).name)
                out.append({"ts": ts, "src": src, "ev": "new", "dd": f"{m.group(1)}-{m.group(2)}-{m.group(3)}" if m else "", "n": 1, "msg": Path(p).name})
    return out


def status_events(old: dict, new: dict, ts: str) -> list:
    """Šaltinių būsenos pokyčiai: nauja klaida (arba kita klaidos rūšis) → „fail“; klaida dingo → „ok“ (vėl veikia)."""
    out = []
    for k in sorted(set(old) | set(new)):
        o, n = old.get(k, {}), new.get(k, {})
        if n.get("err") and (not o.get("err") or o.get("kind") != n.get("kind") or o.get("err") != n.get("err")):
            out.append({"ts": ts, "src": k, "ev": "fail", "dd": "", "n": "", "msg": f"{n.get('kind', '')}: {n.get('msg', '')}"[:200]})
        elif o.get("err") and not n.get("err") and n.get("ok"):
            out.append({"ts": ts, "src": k, "ev": "ok", "dd": "", "n": "", "msg": "vėl veikia"})
    return out


def append(rows: list) -> None:
    if not rows:
        return
    new = not LOG.exists()
    with LOG.open("a", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=COLS)
        if new:
            w.writeheader()
        for r in rows:
            w.writerow(r)
    print(f"ops_log: +{len(rows)} įvykių")


def load_json(text: str) -> dict:
    try:
        return json.loads(text) if text.strip() else {}
    except ValueError:
        return {}


def live() -> None:
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M")
    rows = events_from_diff(git("diff", "-U0", "HEAD", "--", *WATCH), ts)
    changed = [l[3:] for l in git("status", "--porcelain", "--untracked-files=all", "--", *LB_DIRS).splitlines() if l[:2].strip() in ("??", "A")]
    rows += lb_events(changed, ts)
    rows += status_events(load_json(git("show", "HEAD:data/source_status.json")),
                          load_json((ROOT / "data" / "source_status.json").read_text(encoding="utf-8")) if (ROOT / "data" / "source_status.json").exists() else {}, ts)
    append(rows)


def backfill() -> None:
    """Iš automatinių commit'ų („data: update …“, github-actions) – seniausi pirmi. Esamas žurnalas nepapildomas dubliais."""
    have = set()
    if LOG.exists():
        with LOG.open(encoding="utf-8") as f:
            have = {(r["ts"], r["src"], r["ev"]) for r in csv.DictReader(f)}
    commits = [l.split(" ", 1) for l in git("log", "--reverse", "--format=%H %cI", "--author=github-actions", "origin/main").splitlines()]
    rows, prev_status = [], {}
    for sha, iso in commits:
        ts = datetime.fromisoformat(iso).astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M")
        ev = events_from_diff(git("show", "-U0", "--format=", sha, "--", *WATCH), ts)
        added = [l[2:] for l in git("show", "--name-status", "--format=", sha, "--", *LB_DIRS).splitlines() if l.startswith("A\t")]
        ev += lb_events([a.strip() for a in added], ts)
        st = load_json(git("show", f"{sha}:data/source_status.json"))
        if st:
            ev += status_events(prev_status, st, ts)
            prev_status = st
        rows += [r for r in ev if (r["ts"], r["src"], r["ev"]) not in have]
    append(rows)


if __name__ == "__main__":
    backfill() if sys.argv[1:] == ["backfill"] else live()
