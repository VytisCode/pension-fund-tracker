"""Latvijos II pakopos plānų ketvirčio ataskaitos (savininkas 2026-10-21 pritarė: „LV ir EE valdytojų portfeliai“, „Latvijos fondų
turtas ir dalyviai“). Latvijas Banka skelbia tik visos sistemos sumas, todėl kiekvieno plano duomenys imami iš valdytojų ketvirčio
ataskaitų (PDF), kurias skelbia manapensija.lv: plano turtas ketvirčio pabaigoje, vieneto vertė, dalyvių skaičius (jei nurodytas
tekste) ir 10 didžiausių investicijų su dalimis.

Šaltinis: manapensija.lv /api/data/file-list?plan=XXX&level=2&type=quarter (puslapiais) ir /api/data/files?id=N (PDF).
Tekstas – `pdftotext -layout` (poppler-utils). Rezultatai (tik papildomi, istorija neperrašoma):
  data/lv_reports.csv  – plan_id, quarter (YYYY-MM-DD), file_id, name, assets_eur, unit, participants, n_hold, first_seen
  data/lv_holdings.csv – plan_id, quarter, rank, name, weight
  data/lv_files.csv    – visų žinomų ataskaitų sąrašas (plan_id, file_id, name)
Kasdien patikrinama, ar yra naujų ketvirčių, ir apdorojama iki BUDGET dar neapdorotų failų (nuo naujausių) – taip istorija
užsipildo per kelias dienas be atskiro paleidimo.

Naudojimas: python tools/fetch_lv_reports.py [aplankas] [--budget N] [--minutes M] [--test aplankas_su_pdf]
"""
import csv
import json
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (pension-fund-tracker; public pension statistics)", "Accept": "application/json"}
B = "https://www.manapensija.lv"
args = [a for a in sys.argv[1:] if not a.startswith("--")]
BUDGET = int(sys.argv[sys.argv.index("--budget") + 1]) if "--budget" in sys.argv else 80
MINUTES = float(sys.argv[sys.argv.index("--minutes") + 1]) if "--minutes" in sys.argv else 6     # laiko riba (kasdienis žingsnis)
args = [a for a in args if a not in (str(BUDGET), sys.argv[sys.argv.index("--minutes") + 1] if "--minutes" in sys.argv else None)]
T0 = time.time()
OUT = Path(args[0]) if args and "--test" not in sys.argv else Path(__file__).resolve().parent.parent / "data"
TODAY = date.today().isoformat()
RF = ["plan_id", "quarter", "file_id", "name", "assets_eur", "unit", "participants", "n_hold", "first_seen"]
HF = ["plan_id", "quarter", "rank", "name", "weight"]
FF = ["plan_id", "file_id", "name", "first_seen"]                   # visų žinomų ketvirčio ataskaitų sąrašas (kas dar neapdorota)
QEND = {"1": "03-31", "2": "06-30", "3": "09-30", "4": "12-31"}


def get(u, js=False):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r:
                b = r.read()
                return json.loads(b) if js else b
        except Exception as e:
            err = e
            time.sleep(3 * (i + 1))
    raise err


def quarter(name):
    m = re.search(r"(\d{4})\. gada (\d)\. ceturksn", name)
    return f"{m.group(1)}-{QEND[m.group(2)]}" if m else ""


NUM = r"\d{1,3}(?:[ ,. ]\d{3}){2,}"                 # 217 607 290 / 306,216,443 / 83.275.623


def big(s):
    return float(re.sub(r"[ ,. ]", "", s))


NUM1 = r"\d{1,3}(?:[ ,.\u00a0]\d{3})+"                    # ir mažesnės sumos (888 186) – tik po turto etikete


def split2(x):
    """„84 518 129 100 116 001“ – dvi sumos, sulipusios vienu tarpu: padalijama ten, kur abi dalys artimiausios viena kitai."""
    g = re.split(r"[ ,.\u00a0]", x)
    if len(g) < 5:
        return [x]
    best = min(range(2, len(g) - 1), key=lambda k: abs(float("".join(g[:k])) / float("".join(g[k:])) - 1) if g[k][0] != "0" else 9e9)
    return [" ".join(g[:best]), " ".join(g[best:])]


def after(ln, m):
    """Skaičiai iškart po etiketės: tik segmentai (atskirti ≥2 tarpais) be raidžių, iki pirmo segmento su raidėmis."""
    out = []
    for seg in re.split(r"\s{2,}|\t", ln[m.end():]):
        seg = re.sub(r"\(?EUR\)?", "", seg).strip(" :,")
        if not seg or seg == "-":
            continue
        if re.search(r"[A-Za-zĀ-ž]", seg):
            break
        out += split2(seg) if re.fullmatch(NUM1, seg) else [seg]
    return [x for x in out if re.fullmatch(NUM1, x) and big(x) >= 10000]


def assets(t):
    """Plano turtas ketvirčio pabaigoje (EUR). Dvi reikšmės po etikete – ankstesnio ir šio ketvirčio pabaiga, imama antroji."""
    L = t.splitlines()
    for i, ln in enumerate(L):
        m = re.search(r"Līdzekļu apjoms(?: \(EUR\))?|Līdzekļu vērtība, EUR|Aktīvu vērtība, EUR|Neto aktīvi(?!,)|ceturkšņa beigās(?: EUR)?|Pārskata perioda beigās", ln)
        if m:
            ns = after(ln, m)
            if not ns and "ceturkšņa beigās" in m.group(0) and i + 1 < len(L):
                ns = [x for x in re.findall(NUM1, L[i + 1][:110]) if big(x) >= 10000][:1]
            if not ns and m.group(0) == "Neto aktīvi" and not re.search(r"\d", ln):      # INDEXO 2024–2025: vertės žemiau, pirmoji – ketvirčio pabaiga
                for k in range(i + 1, min(i + 9, len(L))):
                    ns = re.findall(NUM, L[k])
                    if ns:
                        return big(ns[0])
            if ns:
                return big(ns[1] if len(ns) > 1 else ns[0])
        if re.search(r"Plāna aktīvu vērtība", ln):                       # SEB: „Pārskata perioda beigās 309,651,758 EUR“ (iki 10 eilučių žemiau)
            for k in range(i + 1, min(i + 10, len(L))):
                if "beigās" in L[k]:
                    ns = re.findall(NUM, L[k])
                    if ns:
                        return big(ns[0])
    s1 = re.sub(r"\s+", " ", t)
    m = re.search(r"neto aktīvi sasniedza (" + NUM + ")", s1)
    if m:
        return big(m.group(1))
    m = re.search(r"neto aktīvu vērtība [^;]{0,60}?sasniedza (\d+(?:,\d+)?) milj", s1)          # Luminor 2019–2021: „sasniedza 138,4 milj. eiro“
    return float(m.group(1).replace(",", ".")) * 1e6 if m else None


def unit(t):
    for ln in t.splitlines():
        if re.search(r"Daļas vērtība(, EUR| \(EUR\)|\s{3})", ln[:110]):
            ns = re.findall(r"\b\d\.\d{4,7}\b|\b\d,\d{5,7}\b", ln[:110])
            if ns:
                return float(ns[-1].replace(",", "."))
    m = re.search(r"Pārskata perioda beigās\s+(\d[.,]\d{4,7}) EUR", t)
    return float(m.group(1).replace(",", ".")) if m else None


def participants(t):
    s = re.sub(r"\s+", " ", t)
    m = re.search(r"dalībnieku skaits[^.]{0,80}?līdz (\d+(?:[.,]\d+)?) (tūkst)", s) or re.search(r"(\d{1,3}(?: \d{3})+) (?:pensiju 2\. līmeņa )?dalībniek", s) or re.search(r"dalībnieku skaits bija (\d{1,3}(?: \d{3})+)", s)
    if not m:
        return None
    v = float(m.group(1).replace(",", ".").replace(" ", ""))
    return round(v * 1000) if m.lastindex > 1 and m.group(2) else round(v)


STOP = re.compile(r"Ģeogrāf|Portfeļa|Plāna ieguldījumu struktūra|Sadalījums pa|Aktīvu (veidu|klašu)|Atdeves|Valūtu|Nozaru|Plāna pārvaldīšanas|Ienesīgums", re.I)
PCTF = re.compile(r"(\d{1,2}[.,] ?\d{1,2}) ?%")


def holdings1(t, back, tol, cont_ok):
    """10 didžiausių investicijų. Pavadinimas – tekstas nuo antraštės stulpelio; dalis – procentas tame pačiame stulpelyje kaip
    pirmosios investicijos (kitų stulpelių procentai – geografija, grąžos – praleidžiami); eilutė be procento, prasidedanti
    pavadinimų stulpelyje, – ankstesnio pavadinimo tęsinys. Sąrašas atmetamas, jei dalys ne mažėjančios ar jų suma > 100 %."""
    L = t.splitlines()
    st = next((i for i, ln in enumerate(L) if re.search(r"(10 )?[Ll]ielākie (plāna )?ieguldījumi", ln)), None)
    if st is None:
        return []
    hc = re.search(r"(10 )?[Ll]ielākie (plāna )?ieguldījumi", L[st]).start()
    out, pc, cont, pend, split = [], None, False, "", False
    for ln in L[st + 1: st + 45]:
        if STOP.search(ln[max(0, hc - 5): hc + 45]):
            break
        lo = max(0, hc - back)
        hit = None
        for m in PCTF.finditer(ln):
            if pc is not None and abs(m.start() - pc) > tol:          # kito stulpelio procentai (geografija, grąžos)
                continue
            pre = re.sub(r"\s+(EUR|USD|SEK|GBP|JPY|CHF|NOK|DKK|PLN)$", "", ln[lo:m.start()].rstrip())
            nm = re.split(r"\s{2,}", pre.strip())[-1].strip() if pre.strip() else ""
            if not nm and pend:                                     # INDEXO: pavadinimas eilute aukščiau, procentas atskirai
                nm, split = pend, True
            if len(nm) >= 3 and not re.search(r"mēneš|Svārst|Sharpe|Sortino|Value|īpatsvar|skaits|atlīdzīb|izmaks", nm, re.I):
                hit = (nm, m)
            break
        if hit:
            pc = hit[1].start() if pc is None else pc
            out.append([hit[0], float(re.sub(r"\s", "", hit[1].group(1)).replace(",", "."))]); cont, pend = not split, ""
            if len(out) >= 10:
                break
            continue
        x = ln[lo:]
        ind = len(x) - len(x.lstrip())
        first = re.split(r"\s{2,}", x.strip())[0] if x.strip() else ""
        if first and not PCTF.search(first) and len(first) < 70:
            pend = first if not (cont and out) or split else pend
        if cont_ok and cont and out and first and ind <= back + 3 and len(first) < 40 and not PCTF.search(first) and not re.search(r"\(EUR\)|Fonda|īpatsvars", first):
            out[-1][0] += " " + first
        elif not x.strip() and pc is None:
            continue
    w = [x[1] for x in out]
    if not out or sum(w) > 100.5 or sum(w) < 15 or any(b > a + 0.6 for a, b in zip(w, w[1:])):
        return []
    return [(re.sub(r"\s+", " ", n).strip(), v) for n, v in out]


LATV = re.compile(r"\b(var|āna|un|politika|ieguldījumu|dzīvescikla|gadā|līdz|tiek|plāna|izņemot)\b|ās,", re.I)


def holdings(t):
    """Valdytojų maketai skiriasi, todėl bandomi keli nustatymai ir imamas geriausias sąrašas: daugiau eilučių, pavadinimai be
    lietuviško/latviško aprašo teksto ir ne ilgesni nei 75 simboliai."""
    best, bs = [], 0
    for cfg in ((12, 10, True), (30, 35, True), (30, 60, False), (12, 60, False), (45, 35, True), (12, 999, False), (12, 999, True)):
        h = holdings1(t, *cfg)
        sc = sum(1 - 0.8 * bool(LATV.search(n)) - 0.8 * (len(n) > 75) for n, _ in h)
        if sc > bs + 0.01:
            best, bs = h, sc
    return best


def parse(pdf):
    t = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True).stdout
    return {"assets_eur": assets(t), "unit": unit(t), "participants": participants(t)}, holdings(t)


def load(path, f):
    return list(csv.DictReader(path.open(encoding="utf-8"))) if path.exists() else []


def save(path, f, rows, key):
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, f)
        w.writeheader()
        for r in sorted(rows, key=key):
            w.writerow({k: r.get(k, "") for k in f})


def plan_files(pl):
    out, n = [], 1
    while n < 40:
        j = get(f"{B}/api/data/file-list?plan={pl}&level=2&type=quarter&page={n}", True)
        out += [(x["id"], x["name"]) for x in j["other_files"]["items"]]
        if not j["links"]["next"]:
            break
        n += 1
    return out


def run():
    plans = [r["plan_id"] for r in csv.DictReader((OUT / "baltic_lv_plans.csv").open(encoding="utf-8")) if r["pillar"] == "II"]
    rp, hp, fp = OUT / "lv_reports.csv", OUT / "lv_holdings.csv", OUT / "lv_files.csv"
    R, H, F = load(rp, RF), load(hp, HF), load(fp, FF)
    have = {r["file_id"] for r in R}
    known = {r["file_id"] for r in F}
    def lst(pl):                                          # plano sąrašas visas – tik pirmą kartą, vėliau – pirmas puslapis (nauji ketvirčiai)
        try:
            full = not any(r["plan_id"] == pl for r in F)
            return pl, plan_files(pl) if full else [(x["id"], x["name"]) for x in get(f"{B}/api/data/file-list?plan={pl}&level=2&type=quarter", True)["other_files"]["items"]]
        except Exception as e:
            print("  klaida", pl, e)
            return pl, []
    with ThreadPoolExecutor(4) as ex:
        for pl, fl in list(ex.map(lst, plans)):
            F += [{"plan_id": pl, "file_id": str(i), "name": n, "first_seen": TODAY} for i, n in fl if str(i) not in known and quarter(n)]
            known |= {str(i) for i, _ in fl}
    save(fp, FF, F, lambda r: (r["plan_id"], quarter(r["name"]), r["file_id"]))
    todo = [(r["plan_id"], r["file_id"], r["name"]) for r in F if r["file_id"] not in have]
    todo.sort(key=lambda x: quarter(x[2]), reverse=True)
    todo = todo[:BUDGET]
    print(f"LV ataskaitos: {len(todo)} naujų failų (biudžetas {BUDGET}), planų {len(plans)}")
    tmp = Path(tempfile.mkdtemp())

    def one(x):
        pl, fid, name = x
        if time.time() - T0 > MINUTES * 60:
            return x, None, []
        try:
            f = tmp / f"{fid}.pdf"
            f.write_bytes(get(f"{B}/api/data/files?id={fid}&level=2"))
            v, h = parse(f)
            f.unlink()
            return x, v, h
        except Exception as e:
            print("  klaida", pl, fid, e)
            return x, None, []
    ok = 0
    with ThreadPoolExecutor(4) as ex:
        for (pl, fid, name), v, h in ex.map(one, todo):
            if v is None:
                continue
            q = quarter(name)
            R.append({"plan_id": pl, "quarter": q, "file_id": fid, "name": name, "assets_eur": f"{v['assets_eur']:.0f}" if v["assets_eur"] else "",
                      "unit": v["unit"] or "", "participants": v["participants"] or "", "n_hold": len(h), "first_seen": TODAY})
            if not any(r["plan_id"] == pl and r["quarter"] == q for r in H):
                H += [{"plan_id": pl, "quarter": q, "rank": i + 1, "name": n, "weight": w} for i, (n, w) in enumerate(h)]
            ok += 1
    save(rp, RF, R, lambda r: (r["quarter"], r["plan_id"], r["file_id"]))
    save(hp, HF, H, lambda r: (r["quarter"], r["plan_id"], int(r["rank"])))
    print(f"  apdorota {ok}; su turtu {sum(1 for r in R if r['assets_eur'])}/{len(R)}, su portfeliu {sum(1 for r in R if r['n_hold'] not in ('', '0'))}")


if __name__ == "__main__":
    if "--test" in sys.argv:
        for f in sorted(Path(args[0]).glob("q_*.pdf")):
            v, h = parse(f)
            print(f.stem, v, len(h), h[:3])
    else:
        run()
