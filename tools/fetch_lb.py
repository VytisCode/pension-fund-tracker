#!/usr/bin/env python3
"""
Nauji Lietuvos banko pensijų fondų failai -> imports/lb_* (savininko sprendimas 2026-10-14 – parsisiųsti automatiškai).

Kartą per dieną peržiūrimi LB puslapiai (PAGES) ir jų nuorodos į failus:
- II pakopos rezultatai (2_pakopa_rezultatai_YYYYMMDD*.xlsx) -> imports/lb_results/2-pakopa-rezultatai-YYYYMMDD.xlsx;
- fondų portfeliai (PF_Portfeliai_YYYYMMDD.xlsx, anksčiau pf-portfeliai-…; žr. NAMES) -> imports/lb_portfolios/pf-portfeliai-YYYYMMDD.xlsx, tada portfolios.py;
- II pakopos mokesčiai (pf-ii-mokesciai-YYYY-MM-DD.xls) ir III pakopos (PF_III_mokesciai_YYYY-MM-DD.xlsx) -> imports/lb_fees/,
  tada import_lb_fees.py (data varde nežinoma – kasdien bandomos paskutinių 10 dienų datos, žr. dated());
- pataisytos jau paskelbtų ketvirčių versijos (galūnė _ ir pan.) – žr. revisions().
Visi kiti tų puslapių Excel failai (III pakopos rezultatai, II pakopos IRR, lyginamieji indeksai ir kt.) kaupiami originaliais
vardais imports/lb_archive/ (savininko prašymas 2026-10-14 – parsisiųsti visą LB informaciją).
Po to visada perskaičiuojama data/lb_results_history.csv (lb_history.py: dalyviai, turtas, grąžos nuo 2015 m.).
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
import urllib.error
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
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "lt-LT,lt;q=0.9,en;q=0.8"}

# rūšis: (failo vardo šablonas, katalogas, išsaugomas vardas, galūnė)
KINDS = {
    "lbr": (r"^(?:2|ii)_pakopa_rezultatai_(\d{4})-?(\d\d)-?(\d\d)", "lb_results", "2-pakopa-rezultatai-{y}{m}{d}", ".xlsx"),
    "pf": (r"portfel\w*?[_-](\d{4})-?(\d\d)-?(\d\d)", "lb_portfolios", "pf-portfeliai-{y}{m}{d}", ".xlsx"),
    "fee2": (r"^pf[_-]ii[_-]mokesciai[_-](\d{4})-(\d\d)-(\d\d)", "lb_fees", "pf-ii-mokesciai-{y}-{m}-{d}", ".xls"),
    "fee3": (r"^pf[_-]iii[_-]mokesciai[_-](\d{4})-(\d\d)-(\d\d)", "lb_fees", "PF_III_mokesciai_{y}-{m}-{d}", ".xlsx"),
}
LOCAL = {"lbr": "2-pakopa-rezultatai-*.xlsx", "pf": "pf-portfeliai-*.xlsx", "fee2": "pf-ii-mokesciai-*.xls", "fee3": "PF_III_mokesciai_*.xlsx"}
MAGIC = {".xlsx": b"PK\x03\x04", ".xls": b"\xd0\xcf\x11\xe0"}


_PW = {}


def _browser():
    """LB svetainė paprastoms užklausoms gali grąžinti 403 – tada naudojama naršyklė (Playwright, kaip valdytojų skaitytuvuose)."""
    if not _PW:
        try:
            from playwright.sync_api import sync_playwright
        except ImportError:
            subprocess.run([sys.executable, "-m", "pip", "install", "-q", "playwright"], check=True)
            from playwright.sync_api import sync_playwright
        pw = sync_playwright().start()
        try:
            b = pw.chromium.launch()
        except Exception:
            subprocess.run([sys.executable, "-m", "playwright", "install", "--with-deps", "chromium"], check=True)
            b = pw.chromium.launch()
        ctx = b.new_context(user_agent=UA["User-Agent"], locale="lt-LT")
        _PW.update(pw=pw, b=b, ctx=ctx, page=ctx.new_page())
    return _PW


def get(url: str) -> bytes:
    if not _PW:
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code not in (403, 429, 503):
                raise
            print(f"  {url}: HTTP {e.code} – bandoma per naršyklę")
    w = _browser()
    if re.search(r"\.xlsx?$", urllib.parse.urlparse(url).path, re.I):
        r = w["ctx"].request.get(url, timeout=90000)
        if not r.ok:
            raise RuntimeError(f"HTTP {r.status}")
        return r.body()
    r = w["page"].goto(url, timeout=90000, wait_until="domcontentloaded")
    if r is None or r.status >= 400:
        raise RuntimeError(f"HTTP {r.status if r else '?'}")
    return w["page"].content().encode("utf-8")


def unwrap(url: str) -> str:
    """LB puslapiuose failų nuorodos dažnai būna .../media/force_download/?url=%2Fuploads%2F...xlsx – grąžinamas tiesioginis
    failo adresas (be šito tokios nuorodos būdavo praleidžiamos)."""
    if "force_download" in url:
        q = urllib.parse.parse_qs(urllib.parse.urlparse(url).query).get("url")
        if q:
            return urllib.parse.urljoin("https://www.lb.lt/", q[0])
    return url


def links(page: str, text: str):
    for h in re.findall(r'href="([^"]+)"', text):
        yield unwrap(urllib.parse.urljoin(page, html.unescape(h)))


def classify(url: str):
    url = unwrap(url)
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


B = "https://www.lb.lt/uploads/documents/files/musu-veikla/finansu-rinkos-dalyviu-prieziura/finansu-sektoriai/pensiju-fondai/"


# Galimi failų vardai (LB vardus keičia: 2026 m. II ketv. – pf-portfeliai-20260630.xlsx, III ketv. – PF_Portfeliai_20260930.xlsx).
# Serveris skiria didžiąsias raides, todėl bandomi keli rašybos variantai ir LB kartais pridedamos galūnės.
NAMES = {
    "lbr": ["2_pakopa_rezultatai_{d}", "II_pakopa_rezultatai_{d}", "2-pakopa-rezultatai-{d}"],
    "pf": ["PF_Portfeliai_{d}", "pf-portfeliai-{d}", "pf_portfeliai_{d}", "PF_portfeliai_{d}", "PF-Portfeliai-{d}",
           "Pf_portfeliai_{d}", "PF_Portfeliai_{y}-{m}-{dd}", "pf-portfeliai-{y}-{m}-{dd}"],
}
SUFFIXES = ("", "_", "__", "_1", "__1", "_0", "_2", "_3")
# Per kiek dienų po ketvirčio pabaigos failas paprastai jau būna (rezultatai ~2 sav., portfeliai ~5 sav.);
# jei iki tol nerastas – vakariniame laiške ir svetainėje rodomas įspėjimas (greičiausiai LB pakeitė failo vardą).
DUE_DAYS = {"lbr": 40, "pf": 60}


def qends(after: str, until: str):
    """Ketvirčių pabaigos (YYYYMMDD) po datos `after` iki `until` imtinai."""
    y, q = int(after[:4]), (int(after[4:6]) - 1) // 3 + 1
    while True:
        y, q = (y + 1, 1) if q == 4 else (y, q + 1)
        d = f"{y}{3 * q:02d}{31 if q in (1, 4) else 30}"
        if d > until:
            return
        yield d


def probe(stems):
    """Bando tiesioginius LB failų adresus; grąžina pirmą, kuris yra tikras .xlsx failas."""
    for stem in stems:
        for x in SUFFIXES:
            url = B + stem + x + ".xlsx"
            try:
                body = get(url)
            except Exception:
                continue
            if body.startswith(MAGIC[".xlsx"]):
                return url
    return None


def guess(kinds=None):
    """LB puslapiai GitHub serveriams grąžina 403, todėl bandomi tiesioginiai naujų ketvirčių failų adresai (žinomi LB vardai).
    Kiekvienai rūšiai – iki 4 ketvirčių po jos naujausio turimo failo (portfeliai LB paskelbiami iki mėnesio vėliau nei rezultatai)."""
    found, other = {}, {}
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    arch = lambda pre: max((re.sub(r"\D", "", p.name[len(pre):])[:8] for p in ARCH.glob(pre + "*.xlsx")), default="")
    specs = [(k, local_latest(k), NAMES[k]) for k in ("lbr", "pf") if kinds is None or k in kinds]
    if kinds is None:
        specs += [(None, arch("3_pakopa_rezultatai_") or local_latest("lbr"), ["3_pakopa_rezultatai_{d}", "III_pakopa_rezultatai_{d}"]),
                  (None, arch("IRR_") or "20260630", ["IRR_{y}-{m}-{dd}", "IRR_{d}"])]
    for kind, have, pats in specs:
        for d in list(qends(have, today))[:4]:
            stems = [p.format(d=d, y=d[:4], m=d[4:6], dd=d[6:]) for p in pats]
            url = probe(stems)
            if url:
                print(f"  rasta tiesiogiai: {url}")
                if kind:
                    found[kind] = (d, url)
                else:
                    other[arch_name(url)] = url
            else:
                print(f"  {stems[0]}.xlsx: dar nepaskelbta arba kitas vardas")
    return found, other


# Failai su nenuspėjama data varde (LB juos atnaujina rečiau nei kas ketvirtį): tikrinamos paskutinių DATED_DAYS dienų datos.
# (rūšis arba None = tik į archyvą, katalogas, vardo šablonas, galūnės)
FILES = "https://www.lb.lt/uploads/documents/files/"
DATED = [("fee2", B, "pf-ii-mokesciai-{iso}", ".xls"), ("fee3", FILES, "PF_III_mokesciai_{iso}", ".xlsx"),
         ("fee3", B, "PF_III_mokesciai_{iso}", ".xlsx"), (None, B, "PF_lyginamieji_{iso}", ".xlsx"),
         (None, FILES, "PF_lyginamieji_{iso}", ".xlsx")]
DATED_SFX = ("", "_1", "_", "_2")
DATED_DAYS = 10


def dated(state: dict):
    """Mokesčių, lyginamųjų indeksų ir išlaidų rodiklių failai: kartą per dieną bandomos paskutinių DATED_DAYS dienų datos
    (failo vardo data – LB sprendimo diena, ji nežinoma iš anksto). Išlaidų rodikliai – kartą per metus (islaidu-rodikliai-YYYY)."""
    found, other = {}, {}
    now = datetime.now(timezone.utc)
    if state.get("dated") == now.strftime("%Y-%m-%d"):
        return found, other
    for i in range(DATED_DAYS):
        iso = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        for kind, base, pat, ext in DATED:
            if kind and kind in found:
                continue
            for x in DATED_SFX:
                url = base + pat.format(iso=iso) + x + ext
                try:
                    body = get(url)
                except Exception:
                    continue
                if body.startswith(MAGIC[ext]):
                    print(f"  rasta tiesiogiai: {url}")
                    if kind and iso.replace("-", "") > local_latest(kind):
                        found[kind] = (iso.replace("-", ""), url)
                    elif not kind:
                        other[arch_name(url)] = url
                    break
    for y in (now.year - 1, now.year):   # metiniai išlaidų rodikliai (BAR/BIK)
        for x in ("", "_1", "_2", "_3"):
            name = f"islaidu-rodikliai-{y}{x}.xlsx"
            if not (ARCH / name).exists():
                try:
                    if get(B + name).startswith(MAGIC[".xlsx"]):
                        print(f"  rasta tiesiogiai: {B + name}")
                        other[name] = B + name
                except Exception:
                    pass
    state["dated"] = now.strftime("%Y-%m-%d")
    return found, other


def revisions(state: dict):
    """LB kartais pataiso jau paskelbtą ketvirčio failą ir įkelia jį nauju vardu su galūne (pvz. 2_pakopa_rezultatai_20260930_.xlsx).
    Turimam naujausiam ketvirčiui bandomos galūnės; jei randamas kitoks failas – rezultatai/portfeliai pakeičiami (senasis
    lieka imports/lb_archive/), III pakopos pataisymas tiesiog įrašomas į archyvą (lb_history.py ima vėliausią vardą)."""
    other = {}
    if state.get("revisions") == datetime.now(timezone.utc).strftime("%Y-%m-%d"):
        return other
    for kind in ("lbr", "pf", None):
        d = local_latest(kind or "lbr")
        if not d:
            continue
        stems = NAMES[kind] if kind else ["3_pakopa_rezultatai_{d}"]
        hits = []
        for st in stems:
            for x in SUFFIXES[1:]:
                url = B + st.format(d=d, y=d[:4], m=d[4:6], dd=d[6:]) + x + ".xlsx"
                try:
                    body = get(url)
                except Exception:
                    continue
                if body.startswith(MAGIC[".xlsx"]):
                    hits.append((url, body))
        if not hits:
            continue
        url, body = hits[-1]                          # vėliausia galūnė – naujausia LB versija
        if kind is None:
            other[arch_name(url)] = url
            continue
        _, folder, name, ext = KINDS[kind]
        path = IMP / folder / (name.format(y=d[:4], m=d[4:6], d=d[6:]) + ext)
        if path.read_bytes() == body or state.get("files", {}).get(kind, {}).get("url") == url:
            continue
        print(f"{kind}: LB pataisė {d} failą – {url}")
        old = path.read_bytes()
        ARCH.mkdir(parents=True, exist_ok=True)
        (ARCH / f"senas_{path.name}").write_bytes(old)
        path.write_bytes(body)
        try:
            err = process(kind, path)
        except Exception as e:
            err = f"{type(e).__name__}: {e}"
        if err:
            print(f"  pataisymas ATMESTAS: {err}")
            path.write_bytes(old)
            (ARCH / f"senas_{path.name}").unlink()
            if kind == "pf":
                subprocess.run(["git", "checkout", "--", "data/portfolios.csv"], cwd=ROOT)
        else:
            print(f"  pakeista pataisyta versija: {path.relative_to(ROOT)}")
        state.setdefault("files", {})[kind] = {"date": d, "url": url, "at": str(datetime.now(timezone.utc).date())} | \
            ({"error": err} if err else {})
    state["revisions"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return other


def overdue() -> list:
    """Ketvirčiai, kurių failo jau seniai turėjome rasti, bet neturime (įspėjimui)."""
    now = datetime.now(timezone.utc)
    out = []
    for kind, days in DUE_DAYS.items():
        until = (now - timedelta(days=days)).strftime("%Y%m%d")
        miss = list(qends(local_latest(kind), until))
        if miss:
            what = {"lbr": "II pakopos rezultatų", "pf": "fondų portfelių"}[kind]
            out.append(f"LB {what} failas už {miss[-1][:4]}-{miss[-1][4:6]}-{miss[-1][6:]} nerastas praėjus {days} d. "
                       f"po ketvirčio pabaigos – galbūt LB pakeitė failo vardą (tools/fetch_lb.py NAMES)")
    return out


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
            body = getattr(e, "read", lambda: b"")()[:300].decode("utf-8", "replace").replace("\n", " ")
            print(f"  {page}: nepavyko ({e}) {body}")
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


def history():
    """II ir III pakopos rezultatų failai (seni imports/lb_history + nauji) -> data/lb_results_history.csv (lb_history.py).
    Jei rezultate fondų eilučių mažiau nei buvo – pakeitimas atmetamas (git checkout)."""
    deps()
    out = ROOT / "data" / "lb_results_history.csv"
    count = lambda: sum(1 for line in out.open(encoding="utf-8") if ",fund," in line) if out.exists() else 0
    before = count()
    r = subprocess.run([sys.executable, "lb_history.py"], cwd=ROOT, capture_output=True, text=True)
    after = count()
    if r.returncode or after < before:
        print(f"  lb_history.py ATMESTA (fondų eilučių {before} -> {after}): {r.stderr[-300:]}")
        subprocess.run(["git", "checkout", "--", "data/lb_results_history.csv"], cwd=ROOT)
    else:
        print(f"  LB rezultatų istorija: fondų eilučių {before} -> {after}")


def fee_counts():
    with (ROOT / "data" / "fees.csv").open(encoding="utf-8", newline="") as f:
        out = {}
        for r in csv.DictReader(f):
            out[r["pillar"]] = out.get(r["pillar"], 0) + 1
        return out


def _status() -> None:
    """Būsena „lb“ (vakarinis laiškas, svetainės pranešimai): klaida tik tada, kai laukiamo ketvirčio failo vis dar nėra.
    LB puslapių 403 – ne klaida (įprasta GitHub serveriams), o nauji failai pasirodo tik kartą per ketvirtį."""
    try:
        late = overdue()
        for m in late:
            print("  ĮSPĖJIMAS: " + m)
        sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
        import source_status
        source_status.fail("lb", "; ".join(late), "format") if late else source_status.ok("lb")
    except Exception as e:
        print(f"  būsenos įrašas nepavyko: {e}")


def main():
    now = datetime.now(timezone(timedelta(hours=3)))
    today = now.strftime("%Y-%m-%d")
    state = json.loads(STATE.read_text(encoding="utf-8")) if STATE.exists() else {}
    fail = state.get("fail", {})
    if "--force" not in sys.argv and (state.get("checked") == today or (fail.get("date") == today and fail.get("n", 0) >= 3)):
        print("LB failai šiandien jau tikrinti." if state.get("checked") == today else "LB šiandien nepasiekiamas (3 bandymai) – rytoj.")
        return
    print("Lietuvos banko failų paieška:")
    found, other = scan()
    if not found and not other:
        print("LB puslapiai nepasiekiami – bandomi tiesioginiai failų adresai:")
        found, other = guess()
    else:   # puslapiai pasiekiami, bet kai kurių rūšių nuorodų nerasta (pvz. kitas vardas) – tos rūšys ieškomos tiesiogiai
        miss = [k for k in NAMES if k not in found or found[k][0] <= local_latest(k)]
        if miss:
            print(f"Tiesioginiai adresai ({', '.join(miss)}):")
            g, _ = guess(miss)
            for k, v in g.items():
                if v[0] > found.get(k, ("", ""))[0]:
                    found[k] = v
    print("Failai su data varde (mokesčiai, lyginamieji indeksai, išlaidų rodikliai):")
    f2, o2 = dated(state)
    for k, v in f2.items():
        if v[0] > found.get(k, ("", ""))[0]:
            found[k] = v
    other.update(o2)
    print("Pataisytos jau turimų ketvirčių versijos:")
    other.update(revisions(state))
    if not found and not other:
        print("Naujų LB failų nerasta – bus bandoma kito paleidimo metu.")
        # LB puslapiai GitHub serveriams grąžina 403 (įprasta), o tiesioginiais adresais naujų failų dar nėra –
        # tai dažniausiai ne gedimas; jei laukiamo ketvirčio failo per DUE_DAYS nėra – _status() įspėja
        _status()
        state["fail"] = {"date": today, "n": (fail.get("n", 0) if fail.get("date") == today else 0) + 1}
        STATE.write_text(json.dumps(state, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        return
    state.pop("fail", None)
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
    history()
    _status()
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
