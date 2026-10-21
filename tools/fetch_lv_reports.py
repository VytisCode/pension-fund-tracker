"""Latvijos II pakopos plānų ketvirčio ataskaitos (savininkas 2026-10-21 pritarė: „LV ir EE valdytojų portfeliai“, „Latvijos fondų
turtas ir dalyviai“). Latvijas Banka skelbia tik visos sistemos sumas, todėl kiekvieno plano duomenys imami iš valdytojų ketvirčio
ataskaitų (PDF), kurias skelbia manapensija.lv: plano turtas ketvirčio pabaigoje, vieneto vertė, dalyvių skaičius (jei nurodytas
tekste) ir 10 didžiausių investicijų su dalimis.

Šaltinis: manapensija.lv /api/data/file-list?plan=XXX&level=2&type=quarter (puslapiais) ir /api/data/files?id=N (PDF).
Tekstas – `pdftotext -layout` (poppler-utils). Rezultatai (tik papildomi, istorija neperrašoma):
  data/lv_reports.csv  – plan_id, quarter (YYYY-MM-DD), file_id, name, assets_eur, unit, participants, n_hold, first_seen
  data/lv_holdings.csv – plan_id, quarter, rank, name, weight
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


def after(ln, m):
    """Skaičiai iškart po etiketės: tik segmentai (atskirti ≥2 tarpais) be raidžių, iki pirmo segmento su raidėmis."""
    out = []
    for seg in re.split(r"\s{2,}", ln[m.end():]):
        seg = re.sub(r"\(?EUR\)?", "", seg).strip(" :,")
        if not seg:
            continue
        if re.search(r"[A-Za-zĀ-ž]", seg):
            break
        out.append(seg)
    return out


def assets(t):
    """Plano turtas ketvirčio pabaigoje (EUR). Dvi reikšmės po etikete – ankstesnio ir šio ketvirčio pabaiga, imama antroji."""
    L = t.splitlines()
    for i, ln in enumerate(L):
        m = re.search(r"Līdzekļu apjoms(?: \(EUR\))?|Līdzekļu vērtība, EUR|Aktīvu vērtība, EUR|Neto aktīvi(?!,)|ceturkšņa beigās(?: EUR)?", ln)
        if m:
            ns = [x for x in after(ln, m) if re.fullmatch(NUM, x)]
            if not ns and "beigās" in m.group(0) and i + 1 < len(L):
                ns = re.findall(NUM, L[i + 1][:110])[:1]
            if ns:
                return big(ns[1] if len(ns) > 1 else ns[0])
        if re.search(r"Plāna aktīvu vērtība", ln[:110]):                # SEB: „Pārskata perioda beigās 309,651,758 EUR“
            for k in range(i + 1, min(i + 4, len(L))):
                if "beigās" in L[k]:
                    ns = re.findall(NUM, L[k][:110])
                    if ns:
                        return big(ns[0])
    m = re.search(r"neto aktīvi sasniedza (" + NUM + ")", t)
    return big(m.group(1)) if m else None


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
    m = re.search(r"dalībnieku skaits[^.]{0,80}?līdz (\d+(?:[.,]\d+)?) (tūkst)", s) or re.search(r"(\d{1,3}(?: \d{3})+) (?:pensiju 2\. līmeņa )?dalībniek", s)
    if not m:
        return None
    v = float(m.group(1).replace(",", ".").replace(" ", ""))
    return round(v * 1000) if m.lastindex > 1 and m.group(2) else round(v)


STOP = re.compile(r"Ģeogrāf|Portfeļa|Plāna ieguldījumu struktūra|Sadalījums pa|Aktīvu (veidu|klašu)|Atdeves|Valūtu|Nozaru|Plāna pārvaldīšanas|Ienesīgums", re.I)
HROW = re.compile(r"^(.*?\S)\s+(\d{1,2}[.,] ?\d{1,2}) ?%")


def holdings(t):
    """10 didžiausių investicijų. Imama sritis nuo antraštės stulpelio į dešinę; pavadinimas – paskutinis segmentas prieš pirmą
    procentą (valiutos kodas praleidžiamas); trumpa eilutė be procento – ankstesnio pavadinimo tęsinys."""
    L = t.splitlines()
    st = next((i for i, ln in enumerate(L) if re.search(r"(10 )?[Ll]ielākie ieguldījumi", ln)), None)
    if st is None:
        return []
    hc = re.search(r"(10 )?[Ll]ielākie ieguldījumi", L[st]).start()
    out, cont = [], False
    for ln in L[st + 1: st + 40]:
        reg = ln[max(0, hc - 12):]
        if STOP.search(ln[max(0, hc - 5): hc + 45]):
            break
        m = HROW.match(reg.strip())
        if m:
            pre = re.sub(r"\s+(EUR|USD|SEK|GBP|JPY|CHF|NOK|DKK|PLN)$", "", m.group(1).strip())
            nm = re.split(r"\s{2,}", pre)[-1].strip()
            if len(nm) >= 3 and not re.search(r"mēneš|Svārst|Sharpe|Sortino|Value|īpatsvar|skaits", nm, re.I):
                out.append([nm, float(re.sub(r"\s", "", m.group(2)).replace(",", "."))]); cont = True
                if len(out) >= 10:
                    break
                continue
        x = reg.strip()
        if cont and out and x and len(x) < 40 and not re.search(r"\d ?%", x) and len(ln) - len(ln.lstrip()) >= hc - 12:
            out[-1][0] += " " + re.split(r"\s{2,}", x)[0]
        cont = bool(x) and cont
    w = [x[1] for x in out]
    return [tuple(x) for x in out] if out and sum(w) <= 100.5 else []


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
    rp, hp = OUT / "lv_reports.csv", OUT / "lv_holdings.csv"
    R, H = load(rp, RF), load(hp, HF)
    have = {r["file_id"] for r in R}
    first = not R
    todo = []
    for pl in plans:                                      # pirmą kartą – visas sąrašas, vėliau – tik pirmas puslapis (nauji ketvirčiai)
        try:
            fl = plan_files(pl) if first or not any(r["plan_id"] == pl for r in R) else [(x["id"], x["name"]) for x in get(f"{B}/api/data/file-list?plan={pl}&level=2&type=quarter", True)["other_files"]["items"]]
        except Exception as e:
            print("  klaida", pl, e)
            continue
        todo += [(pl, str(i), n) for i, n in fl if str(i) not in have and quarter(n)]
    pend = [r for r in R if not r["assets_eur"] and r["first_seen"] != TODAY]
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
