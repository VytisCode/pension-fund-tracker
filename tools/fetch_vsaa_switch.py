"""Latvijos II pakopa: mėnesinis dalyvių perėjimas tarp plānų (VSAA „Dalībnieku kustība pa ieguldījumu plāniem atskaites periodā“).

Šaltinis: https://www.vsaa.gov.lv/lv/dalibnieku-kustiba-pa-ieguldijumu-planiem-atskaites-perioda – kiekvieniems metams vienas .xls
(lapai = mėnuo: jan, feb, …, dec; senuose failuose dar ketvirčių / metų suvestinės – praleidžiamos). Lapas – matrica:
eilutė = plāns, į kurį dalyvis atėjo, stulpelis = plāns, iš kurio išėjo (paskutinis stulpelis „KOPĀ klāt nākušo“, paskutinė eilutė
„KOPĀ prom aizgājušo“). Duomenys nuo 2003-01. VSAA skelbia apie kiekvieno mėnesio 15 d. (kolegės iš BC informacija 2026-11-10).
Tai tik perėjimai tarp plānų (ne nauji dalyviai, ne mirę / išėję į pensiją – tie yra metinėse ataskaitose, tools/fetch_vsaa.py).

Rašoma (tik papildoma): data/lv_switch.csv  month,to_plan,from_plan,n,first_seen   (tik n > 0)
                        data/lv_switch_files.json  {metai: apdorotų mėnesių skaičius} – užbaigti metai (12 mėn.) nebeparsisiunčiami.
Paleidimas: python tools/fetch_vsaa_switch.py [OUT_DIR] [--files a.xls b.xls ...]   (--files – vietiniai failai bandymui)
"""
import csv
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

PAGE = "https://www.vsaa.gov.lv/lv/dalibnieku-kustiba-pa-ieguldijumu-planiem-atskaites-perioda"
UA = "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"
F = ["month", "to_plan", "from_plan", "n", "first_seen"]
MON = {"jan": 1, "feb": 2, "mar": 3, "apr": 4, "mai": 5, "jun": 6, "jūn": 6, "jul": 7, "jūl": 7, "aug": 8, "sep": 9, "okt": 10, "nov": 11, "dec": 12}
LVM = {"janvār": 1, "februār": 2, "mart": 3, "aprīl": 4, "maij": 5, "jūnij": 6, "jūlij": 7, "august": 8, "septembr": 9, "oktobr": 10, "novembr": 11, "decembr": 12}


def xlrd():
    try:
        import xlrd as x
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "-q", "xlrd"], check=True)
        import xlrd as x
    return x


def clean(s):
    return re.sub(r"\s+", " ", str(s or "")).strip().strip('"„“”').strip()


def period(sh, year, name):
    """Lapo mėnuo: pirmiausia iš antraštės („2026. gada janvāris“ arba „01.01.2003 - 31.01.2003“), kitaip – iš lapo vardo."""
    for i in range(min(6, sh.nrows)):
        t = " ".join(str(c) for c in sh.row_values(i)).lower()
        m = re.search(r"(\d\d)\.(\d\d)\.(\d{4})\s*-\s*(\d\d)\.(\d\d)\.(\d{4})", t)
        if m:
            if m[2] == m[5] and m[3] == m[6]:
                return int(m[6]), int(m[5])
            if m[3] == m[6] and int(m[5]) - int(m[2]) == 2 and int(m[2]) % 3 == 1:   # ketvirčio suvestinė
                return int(m[6]), -int(m[5])
            return None                                                            # metų suvestinė
        m = re.search(r"(\d{4})\.\s*gada\s+([a-zāēīūčšž]+)", t)
        if m and (sum(t.count(k) for k in LVM) > 1 or not (name.strip().lower()[:3] in MON and len(name.strip()) <= 5)):           # „janvāris – decembris“ – kelių mėnesių suvestinė
            return None
        if m:
            mm = next((v for k, v in LVM.items() if m[2].startswith(k)), None)
            return (int(m[1]), mm) if mm else None
    k = name.strip().lower()[:3]
    return (year, MON[k]) if k in MON and len(name.strip()) <= 4 else None


def parse(path, year):
    x = xlrd()
    wb = x.open_workbook(str(path))
    out, qs = {}, {}
    for sh in wb.sheets():
        per = period(sh, year, sh.name)
        if not per:
            continue
        hr = next((i for i in range(min(12, sh.nrows)) if any("ip nosaukums" in str(c).lower() for c in sh.row_values(i))), None)
        if hr is None:
            print("  be antraštės:", path.name, sh.name); continue
        head = [clean(c) for c in sh.row_values(hr)]
        cols = {j: h for j, h in enumerate(head) if j >= 2 and h and not h.lower().startswith("kop")}
        nums = sh.row_values(hr + 1)
        idx = {}                                             # eilutės numeris -> stulpelio plāna vardas
        for j, h in cols.items():
            try:
                idx[int(float(nums[j]))] = h
            except (ValueError, TypeError, IndexError):
                pass
        m = f"{per[0]}-{abs(per[1]):02d}"
        rows = []
        for i in range(hr + 2, sh.nrows):
            r = sh.row_values(i)
            try:
                k = int(float(r[0]))
            except (ValueError, TypeError):
                continue                                     # KOPĀ eilutė
            to = idx.get(k) or clean(r[1])
            for j, fr in cols.items():
                if j < len(r) and isinstance(r[j], float) and r[j] > 0 and fr != to:
                    rows.append({"month": m, "to_plan": to, "from_plan": fr, "n": int(round(r[j]))})
        if rows and per[1] < 0:
            qs[(per[0], -per[1])] = rows
        elif rows:
            out[m] = rows
    # apsauga: mėnuo, kurio suma didesnė už pusę kitų tų metų mėnesių sumos – tikriausiai metų suvestinė
    tot = {k: sum(r["n"] for r in v) for k, v in out.items()}
    for k in list(out):
        rest = [v for kk, v in tot.items() if kk[:4] == k[:4] and kk != k]
        if len(rest) >= 6 and tot[k] > 0.5 * sum(rest):
            print("  praleista (panašu į suvestinę):", path.name, k, tot[k]); out.pop(k)
    # trūkstamas mėnuo (pvz. 2003 m. kovo lapo nėra, yra tik „I cet“) = ketvirtis − kiti du mėnesiai
    for (y, qe), rows in qs.items():
        ms = [f"{y}-{k:02d}" for k in (qe - 2, qe - 1, qe)]
        miss = [k for k in ms if k not in out]
        if len(miss) != 1:
            continue
        v = {}
        for r in rows:
            v[(r["to_plan"], r["from_plan"])] = v.get((r["to_plan"], r["from_plan"]), 0) + r["n"]
        for k in ms:
            for r in out.get(k, []):
                v[(r["to_plan"], r["from_plan"])] = v.get((r["to_plan"], r["from_plan"]), 0) - r["n"]
        out[miss[0]] = [{"month": miss[0], "to_plan": a, "from_plan": b, "n": n} for (a, b), n in v.items() if n > 0]
        print("  išvestas iš ketvirčio:", miss[0])
    return out


def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=120) as r:
                return r.read()
        except Exception as e:
            print("  retry", i + 1, u, e); time.sleep(5 * (i + 1))
    raise RuntimeError(u)


def save(out, months):
    p = out / "lv_switch.csv"
    old = {}
    if p.exists():
        for r in csv.DictReader(p.open(encoding="utf-8")):
            old[(r["month"], r["to_plan"], r["from_plan"])] = r
    have_m = {k[0] for k in old}
    today, add = date.today().isoformat(), 0
    for m, rows in months.items():
        if m in have_m:                                      # mėnuo jau įrašytas – neperrašoma (istorija nekeičiama)
            continue
        for r in rows:
            old[(m, r["to_plan"], r["from_plan"])] = {**r, "first_seen": today}; add += 1
    with p.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, F); w.writeheader()
        for k in sorted(old):
            w.writerow({f: old[k].get(f, "") for f in F})
    print(f"lv_switch.csv: +{add} eil., mėnesių {len({k[0] for k in old})}")


def run(out, files=None):
    months = {}
    if files:
        for f in files:
            p = Path(f)
            y = int(re.search(r"(20\d\d)", p.name)[1]) if re.search(r"(20\d\d)", p.name) else date.today().year
            months.update(parse(p, y))
        save(out, months); return
    st_p = out / "lv_switch_files.json"
    done = json.loads(st_p.read_text()) if st_p.exists() else {}
    h = get(PAGE).decode("utf-8", "replace")
    links = re.findall(r'<a[^>]+href="([^"]*media/\d+/download[^"]*)"[^>]*>(.*?)</a>', h, re.S)
    tmp = out.parent / ".vsaa_tmp.xls"
    for href, t in links:
        y = re.search(r"(20\d\d)\.?\s*gad", re.sub(r"<[^>]+>|\s+", " ", t))
        if not y or done.get(y[1], 0) >= 12:
            continue
        b = get(urllib.parse.urljoin(PAGE, href))
        if b[:4] != b"\xd0\xcf\x11\xe0" and b[:2] != b"PK":
            print("VSAA kustība", y[1], "ne Excel – praleista"); continue
        tmp.write_bytes(b)
        try:
            ms = parse(tmp, int(y[1]))
        except Exception as e:
            print("VSAA kustība", y[1], "klaida:", e); continue
        print("VSAA kustība", y[1], "mėnesių", len(ms))
        months.update(ms)
        done[y[1]] = len(ms)
        time.sleep(1)
    tmp.unlink(missing_ok=True)
    save(out, months)
    st_p.write_text(json.dumps(done, indent=0, sort_keys=True))


if __name__ == "__main__":
    a = sys.argv[1:]
    fl = a[a.index("--files") + 1:] if "--files" in a else None
    a = a[:a.index("--files")] if "--files" in a else a
    run(Path(a[0]) if a else Path(__file__).resolve().parent.parent / "data", fl)
