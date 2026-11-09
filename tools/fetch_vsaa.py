"""Latvijos II pakopos (valsts fondēto pensiju shēma) metinės VSAA ataskaitos: dalyvių judėjimas ir plānų turtas metų pabaigoje.

Šaltinis: https://www.vsaa.gov.lv/lv/parskati-par-valsts-fondeto-pensiju-shemas-darbibu („Pārskats par valsts fondēto pensiju shēmas
darbību YYYY. gadā“, .docx). Kolegės (BC) sąraše – „Participant movements“; mėnesinių viešų duomenų neradome (2026-11-09).

Rašoma (tik papildoma, esamos eilutės neperrašomos):
  data/lv_vsaa_moves.csv   year,plan,start,new,from_other,to_other,died,retired,eu,correction,end,first_seen
                           (kiekvieno plāno dalyviai metų pradžioje ir pabaigoje; atėjo naujų / iš kitų plānų; išėjo į kitus plānus,
                           mirė, išėjo į pensiją, į ES pensijų sistemą; korekcija). Eilutė „KOPĀ“ – visa schema.
  data/lv_vsaa_assets.csv  year,plan,assets_eur,first_seen  (grynieji aktyvai metų pabaigoje)
  data/lv_vsaa_files.json  apdoroti metai (failas parsisiunčiamas tik kartą).
Senesni nei 2016 m. failai – .doc / .pdf (kol kas neapdorojami).
Paleidimas: python tools/fetch_vsaa.py [OUT_DIR]
"""
import csv
import json
import re
import sys
import time
import urllib.request
import zipfile
from datetime import date
from html import unescape
from io import BytesIO
from pathlib import Path

PAGE = "https://www.vsaa.gov.lv/lv/parskati-par-valsts-fondeto-pensiju-shemas-darbibu"
UA = "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"
MV = ["year", "plan", "start", "new", "from_other", "to_other", "died", "retired", "eu", "correction", "end", "first_seen"]
NA = ["year", "plan", "assets_eur", "first_seen"]


def tables(docx_bytes):
    """docx -> [[ [langelio tekstas, ...] eilutė ], ...] lentelės; sujungti langeliai (gridSpan) pakartojami."""
    x = zipfile.ZipFile(BytesIO(docx_bytes)).read("word/document.xml").decode("utf-8")
    out = []
    for tb in re.findall(r"<w:tbl>.*?</w:tbl>", x, re.S):
        rows = []
        for tr in re.findall(r"<w:tr[ >].*?</w:tr>", tb, re.S):
            row = []
            for tc in re.findall(r"<w:tc>.*?</w:tc>", tr, re.S):
                t = " ".join("".join(re.findall(r"<w:t[^>]*>([^<]*)</w:t>", p)) for p in re.findall(r"<w:p[ >].*?</w:p>", tc, re.S))
                t = re.sub(r"\s+", " ", unescape(t)).strip()
                n = int((re.search(r'<w:gridSpan w:val="(\d+)"', tc) or [0, 1])[1])
                row += [t] * n
            rows.append(row)
        out.append(rows)
    return out


def num(s):
    s = (s or "").replace("\xa0", " ").strip()
    neg = s.startswith("(") or s.startswith("-") or s.startswith("−")
    d = re.sub(r"[^\d]", "", s)
    return (-int(d) if neg else int(d)) if d else None


def split_head(rows):
    """Antraštės eilutės – iki pirmos eilutės, kurios bent pusė langelių (be pirmo) – skaičiai."""
    for i, r in enumerate(rows):
        vals = [c for c in r[1:] if c]
        if vals and sum(bool(re.fullmatch(r"\(?[−-]?[\d  .,]+\)?\s*%?|[−-]", c)) for c in vals) >= len(vals) / 2:
            return rows[:i], rows[i:]
    return rows, []


def parse(b, year):
    moves, assets = [], []
    for rows in tables(b):
        if len(rows) < 4:
            continue
        head, body = split_head(rows)
        if not head or not body:
            continue
        w = max(len(r) for r in rows)
        cols = [" ".join(h[j] if j < len(h) else "" for h in head).lower() for j in range(w)]
        allh = " ".join(cols)
        if "pieaugums" in allh and "samazin" in allh and ("jaun" in allh or "citiem" in allh):        # dalyvių judėjimas
            key, used = {}, set()
            for j, c in enumerate(cols[1:], 1):
                k = ("start" if "31.12" in c and "start" not in key else "end" if "31.12" in c or "beig" in c else
                     "new" if "jaun" in c else "from_other" if "no citiem" in c else "to_other" if "uz citiem" in c else
                     "died" if "miru" in c else "eu" if " es " in f" {c} " or "es pensiju" in c else
                     "retired" if "pension" in c or "pensijā" in c else "correction" if "korek" in c else None)
                if k and k not in used:
                    key[k] = j; used.add(k)
            if "start" not in key or "end" not in key:
                continue
            for r in body:
                nm = r[0].strip()
                if not nm or re.match(r"(konservat|sabalans|akt[īi]v|plān)", nm.lower()) and "kop" not in nm.lower() and not re.search(r"\bIP\b|plāns|“|\"", nm):
                    continue
                v = {k: num(r[j]) if j < len(r) else None for k, j in key.items()}
                if v["end"] is None and v["start"] is None:
                    continue
                for k in ("to_other", "died", "retired", "eu"):            # mažėjimas – visada neigiamas
                    if v.get(k) is not None:
                        v[k] = -abs(v[k])
                moves.append({"year": year, "plan": nm, **{k: v.get(k, "") if v.get(k) is not None else "" for k in MV[2:-1]}})
        elif "neto aktīv" in allh and ("tirgus daļa" in allh or "ienesīgums" in allh):              # plānų rezultatai ir turtas
            j = next((j for j, c in enumerate(cols) if "neto aktīv" in c and str(year) in c), None)
            if j is None:
                j = next((j for j, c in enumerate(cols) if "neto aktīv" in c), None)
            if j is None:
                continue
            for r in body:
                nm = r[0].strip()
                if nm and j < len(r) and num(r[j]) and "kopā" not in nm.lower():
                    assets.append({"year": year, "plan": nm, "assets_eur": num(r[j])})
    return moves, assets


def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=120) as r:
                return r.read()
        except Exception as e:
            print("  retry", i + 1, u, e); time.sleep(5 * (i + 1))
    raise RuntimeError(u)


def merge(path, key, rows, fields):
    old = {}
    if path.exists():
        for r in csv.DictReader(path.open(encoding="utf-8")):
            old[tuple(r[k] for k in key)] = r
    add = 0
    for r in rows:
        k = tuple(str(r[x]) for x in key)
        if k not in old:
            old[k] = {f: r.get(f, "") for f in fields}; add += 1
        else:
            for f in fields:
                if old[k].get(f, "") == "" and r.get(f, "") not in ("", None):
                    old[k][f] = r[f]
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fields); w.writeheader()
        for k in sorted(old):
            w.writerow({f: old[k].get(f, "") for f in fields})
    print(f"{path.name}: +{add}, iš viso {len(old)}")


def run(out):
    st_p = out / "lv_vsaa_files.json"
    done = json.loads(st_p.read_text()) if st_p.exists() else {}
    h = get(PAGE).decode("utf-8", "replace")
    links = re.findall(r'<a[^>]+href="([^"]*media/\d+/download[^"]*)"[^>]*>(.*?)</a>', h, re.S)
    today = date.today().isoformat()
    mv, na = [], []
    for href, t in links:
        t = re.sub(r"<[^>]+>|\s+", " ", t)
        y = re.search(r"(20\d\d)\.\s*gad", t)
        if not y or y.group(1) in done:
            continue
        y = int(y.group(1))
        b = get(urllib.parse.urljoin(PAGE, href))
        if b[:2] != b"PK":                                   # .doc / .pdf – kol kas neapdorojami
            print("VSAA", y, "ne .docx – praleista"); done[str(y)] = "skip"; continue
        m, a = parse(b, y)
        print("VSAA", y, "judėjimas", len(m), "turtas", len(a))
        if m or a:
            done[str(y)] = today
        mv += [dict(r, first_seen=today) for r in m]; na += [dict(r, first_seen=today) for r in a]
        time.sleep(1)
    if mv:
        merge(out / "lv_vsaa_moves.csv", ["year", "plan"], mv, MV)
    if na:
        merge(out / "lv_vsaa_assets.csv", ["year", "plan"], na, NA)
    st_p.write_text(json.dumps(done, indent=0, sort_keys=True))


if __name__ == "__main__":
    import urllib.parse
    run(Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parent.parent / "data")
