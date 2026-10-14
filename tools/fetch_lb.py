#!/usr/bin/env python3
"""
Nauji Lietuvos banko pensijų fondų failai -> imports/lb_* (savininko sprendimas 2026-10-14 – parsisiųsti automatiškai).

Kartą per dieną peržiūrimi LB puslapiai (PAGES) ir jų nuorodos į failus:
- II pakopos rezultatai (2_pakopa_rezultatai_YYYYMMDD*.xlsx) -> imports/lb_results/2-pakopa-rezultatai-YYYYMMDD.xlsx;
- fondų portfeliai (*portfeli*YYYYMMDD*.xlsx) -> imports/lb_portfolios/pf-portfeliai-YYYYMMDD.xlsx, tada portfolios.py;
- II pakopos mokesčiai (pf-ii-mokesciai-YYYY-MM-DD.xls) ir III pakopos (PF_III_mokesciai_YYYY-MM-DD.xlsx) -> imports/lb_fees/,
  tada import_lb_fees.py.
Visi kiti tų puslapių Excel failai (III pakopos rezultatai, II pakopos IRR, lyginamieji indeksai ir kt.) kaupiami originaliais
vardais imports/lb_archive/ (savininko prašymas 2026-10-14 – parsisiųsti visą LB informaciją).
Imamas tik naujesnis už turimą failas (seni neperrašomi). Patikra: tikras Excel failas; apdorojimas be klaidų; portfelių
naujo ketvirčio turtas 0,7–1,4 karto ankstesnio ir fondų ne mažiau 80 % ankstesnio. Nepavykus – naujas failas pašalinamas,
apdoroti duomenys atstatomi (git checkout), o žurnale parašoma kodėl.
Paleidimas: python tools/fetch_lb.py [--force] (be --force tikrinama ne dažniau kaip kartą per dieną, data/lb_files.json).
"""
import csv
import html
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMP = ROOT / "imports"
STATE = ROOT / "data" / "lb_files.json"
ARCH = IMP / "lb_archive"
PAGES = [
    "https://www.lb.lt/lt/pf-veiklos-rodikliai",
    "https://www.lb.lt/lt/pensiju-kaupimo-veiklos-rodikliai-prieziurine-statistika",
    "https://www.lb.lt/lt/pensiju-fondai-1",
]
MAX_CRAWL = 25                      # jei portfelių nuorodos nerasta – papildomai peržiūrimi susiję LB puslapiai
UA = {"User-Agent": "Mozilla/5.0 (pension fund tracker; daily public data check)"}

# rūšis: (failo vardo šablonas, katalogas, išsaugomas vardas, galūnė)
KINDS = {
    "lbr": (r"^(?:2|ii)_pakopa_rezultatai_(\d{4})-?(\d\d)-?(\d\d)", "lb_results", "2-pakopa-rezultatai-{y}{m}{d}", ".xlsx"),
    "pf": (r"portfel\w*?[_-](\d{4})-?(\d\d)-?(\d\d)", "lb_portfolios", "pf-portfeliai-{y}{m}{d}", ".xlsx"),
    "fee2": (r"^pf[_-]ii[_-]mokesciai[_-](\d{4})-(\d\d)-(\d\d)", "lb_fees", "pf-ii-mokesciai-{y}-{m}-{d}", ".xls"),
    "fee3": (r"^pf[_-]iii[_-]mokesciai[_-](\d{4})-(\d\d)-(\d\d)", "lb_fees", "PF_III_mokesciai_{y}-{m}-{d}", ".xlsx"),
}
LOCAL = {"lbr": "2-pakopa-rezultatai-*.xlsx", "pf": "pf-portfeliai-*.xlsx", "fee2": "pf-ii-mokesciai-*.xls", "fee3": "PF_III_mokesciai_*.xlsx"}
MAGIC = {".xlsx": b"PK\x03\x04", ".xls": b"\xd0\xcf\x11\xe0"}


def get(url: str) -> bytes:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def links(page: str, text: str):
    for h in re.findall(r'href="([^"]+)"', text):
        yield urllib.parse.urljoin(page, html.unescape(h))


def classify(url: str):
    if "force_download" in url:
        return None
    name = urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit("/", 1)[-1]).lower()
    for kind, (pat, _, _, ext) in KINDS.items():
        m = re.search(pat, name)
        if m and name.endswith(ext):
            return kind, "".join(m.groups())
    return None


def local_latest(kind: str) -> str:
    files = sorted((IMP / KINDS[kind][1]).glob(LOCAL[kind]))
    ds = (re.search(r"(\d{4})-?(\d\d)-?(\d\d)", f.name) for f in files)
    return max(("".join(m.groups()) for m in ds if m), default="")


def is_excel(url: str) -> bool:
    return "force_download" not in url and re.search(r"\.xlsx?$", urllib.parse.urlparse(url).path, re.I) is not None


def scan():
    found, seen, extra, other = {}, set(), [], {}
    queue = list(PAGES)
    while queue and len(seen) < len(PAGES) + MAX_CRAWL:
        page = queue.pop(0)
        if page in seen:
            continue
        seen.add(page)
        try:
            text = get(page).decode("utf-8", "replace")
        except Exception as e:
            print(f"  {page}: nepavyko ({e})")
            continue
        n = 0
        for u in links(page, text):
            c = classify(u)
            if c:
                n += 1
                kind, d = c
                if d > found.get(kind, ("", ""))[0]:
                    found[kind] = (d, u)
            elif page in PAGES and is_excel(u):
                n += 1
                other.setdefault(arch_name(u), u)
            elif page in PAGES and "pf" not in found and re.match(r"https://www\.lb\.lt/lt/", u) \
                    and re.search(r"pensij|portfel|pf-", u) and not re.search(r"\.\w{3,4}$|[?#]", u):
                extra.append(u)
        print(f"  {page}: {n} failų nuorodų")
        if not queue and "pf" not in found and extra:
            queue, extra = list(dict.fromkeys(extra)), []
    return found, other


def arch_name(url: str) -> str:
    name = urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit("/", 1)[-1])
    return re.sub(r"[^\w.-]+", "_", name).strip("_")


def archive(other: dict):
    """Visi kiti LB puslapio Excel failai (III pakopos rezultatai, IRR, lyginamieji indeksai ir kt.) originaliais vardais
    -> imports/lb_archive/ (tik dar neturimi; seni neperrašomi)."""
    ARCH.mkdir(parents=True, exist_ok=True)
    new = 0
    for name, url in sorted(other.items()):
        path = ARCH / name
        if path.exists():
            continue
        try:
            body = get(url)
        except Exception as e:
            print(f"  archyvas {name}: nepavyko ({e})")
            continue
        if not body.startswith(tuple(MAGIC.values())):
            print(f"  archyvas {name}: ne Excel failas – praleidžiama")
            continue
        path.write_bytes(body)
        new += 1
        print(f"  archyvas: {name}")
        time.sleep(0.3)
    print(f"Archyve naujų failų: {new} (iš viso LB puslapyje kitų Excel failų: {len(other)})")


def deps():
    try:
        import openpyxl, xlrd  # noqa: F401
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "openpyxl", "xlrd"], check=True)


def pf_totals():
    tot = {}
    with (ROOT / "data" / "portfolios.csv").open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            t = tot.setdefault(r["date"], [0.0, set()])
            t[0] += float(r["value"] or 0)
            t[1].add(r["fund_code"])
    return tot


def process(kind: str, path: Path):
    """Apdoroja naują failą; grąžina klaidos tekstą arba None."""
    deps()
    if kind == "lbr":
        sys.path.insert(0, str(ROOT))
        import reports
        lb, _ = reports.read_lb_results()
        return None if len(lb) >= 20 else f"rezultatų faile rasta tik {len(lb)} fondų"
    if kind == "pf":
        r = subprocess.run([sys.executable, "portfolios.py"], cwd=ROOT, capture_output=True, text=True)
        if r.returncode:
            return "portfolios.py klaida: " + r.stderr[-400:]
        tot = pf_totals()
        ds = sorted(tot)
        if len(ds) < 2 or ds[-1].replace("-", "") != re.search(r"\d{8}", path.name).group():
            return "naujo ketvirčio eilučių nėra"
        (a, fa), (b, fb) = tot[ds[-2]], tot[ds[-1]]
        if not (0.7 <= b / a <= 1.4 and len(fb) >= 0.8 * len(fa)):
            return f"neįtikėtina: turtas {a / 1e9:.2f} -> {b / 1e9:.2f} mlrd., fondų {len(fa)} -> {len(fb)}"
        return None
    before = fee_counts()
    r = subprocess.run([sys.executable, "import_lb_fees.py"], cwd=ROOT, capture_output=True, text=True)
    if r.returncode:
        return "import_lb_fees.py klaida: " + r.stderr[-400:]
    after = fee_counts()
    bad = [p for p in before if after.get(p, 0) < 0.8 * before[p]]
    return f"mokesčių eilučių sumažėjo: {before} -> {after}" if bad else None


def fee_counts():
    with (ROOT / "data" / "fees.csv").open(encoding="utf-8", newline="") as f:
        out = {}
        for r in csv.DictReader(f):
            out[r["pillar"]] = out.get(r["pillar"], 0) + 1
        return out


def main():
    now = datetime.now(timezone(timedelta(hours=3)))
    today = now.strftime("%Y-%m-%d")
    state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
    if state.get("checked") == today and "--force" not in sys.argv:
        print("LB failai šiandien jau tikrinti.")
        return
    print("Lietuvos banko failų paieška:")
    found, other = scan()
    state["checked"] = today
    state.setdefault("files", {})
    for kind in KINDS:
        if kind not in found:
            print(f"{kind}: nuorodos nerasta")
            continue
        d, url = found[kind]
        have = local_latest(kind)
        print(f"{kind}: LB naujausias {d}, turime {have or '–'}")
        if d <= have:
            continue
        _, folder, name, ext = KINDS[kind]
        path = IMP / folder / (name.format(y=d[:4], m=d[4:6], d=d[6:]) + ext)
        try:
            body = get(url)
        except Exception as e:
            print(f"  parsisiųsti nepavyko: {e}")
            continue
        if not body.startswith(MAGIC[ext]) or len(body) < 5000:
            print(f"  ne Excel failas ({len(body)} B) – praleidžiama")
            continue
        olds = sorted((IMP / folder).glob(LOCAL[kind]))
        if olds and olds[-1].read_bytes() == body:
            print("  failas toks pat kaip ankstesnis – praleidžiama")
            continue
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(body)
        try:
            err = process(kind, path)
        except Exception as e:
            err = f"{type(e).__name__}: {e}"
        if err:
            print(f"  ATMESTA: {err}")
            path.unlink()
            if kind == "pf":
                subprocess.run(["git", "checkout", "--", "data/portfolios.csv"], cwd=ROOT)
            elif kind != "lbr":         # mokesčiai – iš naujo iš likusių (galbūt ką tik priimto kitos pakopos) failų
                subprocess.run([sys.executable, "import_lb_fees.py"], cwd=ROOT, capture_output=True)
            state["files"][kind] = {"date": d, "url": url, "error": err, "at": today}
        else:
            print(f"  įrašyta {path.relative_to(ROOT)}")
            state["files"][kind] = {"date": d, "url": url, "at": today}
    archive(other)
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
