"""Estijos II ir III pakopos fondų 10 didžiausių investicijų (savininkas 2026-10-21 pritarė: „LV ir EE valdytojų portfeliai“).
Šaltinis – pensionikeskus.ee fondo puslapis (/en/ii-pillar/mandatory-pension-funds/fid/<id>/), kuriame – visos mėnesio ataskaitos
(/files/raport/<KODAS>/<kalba>_<KODAS>_raport_YYYYMMDD.pdf). LHV, SEB, Luminor, Tuleva skelbia visą investicijų sąrašą su dalimis –
imamos 10 didžiausių; Swedbank – faktų lapą su „Top 10 holdings“. Tekstas – `pdftotext -layout` (poppler-utils).
Rezultatas (tik papildomas): data/ee_holdings.csv – fund_id, pillar, date, rank, name, weight, first_seen.

Naudojimas: python tools/fetch_ee_reports.py [aplankas] [--test aplankas_su_pdf]
"""
import csv
import re
import subprocess
import sys
import tempfile
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

UA = {"User-Agent": "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"}
B = "https://www.pensionikeskus.ee"
args = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = Path(args[0]) if args and "--test" not in sys.argv else Path(__file__).resolve().parent.parent / "data"
TODAY = date.today().isoformat()
FIELDS = ["fund_id", "pillar", "date", "rank", "name", "weight", "first_seen"]
PCT = re.compile(r"(\d{1,2}[.,]\d{1,2}) ?%")
SKIP = re.compile(r"Arvelduskonto|Hoius|kokku|total|liik|Emitent|nimetus|väärtusest|Fondi |^\d+\.|puhas|Hoiused|Raha|Nõuded|Kohustused|Tuletis", re.I)


def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r:
                return r.read()
        except Exception as e:
            err = e
            time.sleep(3 * (i + 1))
    raise err


ISIN = re.compile(r"[A-Z]{2}[A-Z0-9]{9}\d")


def full_list(t):
    """Visas investicijų sąrašas: eilutė, kurios pirmas segmentas – pavadinimas (Luminor obligacijų – eilutėje aukščiau, pirmas
    segmentas tada ISIN), o dalis fondo grynųjų aktyvų vertėje – pirmas procentas iškart po sumos eurais (kiti procentai – pajamingumas,
    praėjusio mėnesio dalis ar emisijos dalis)."""
    out, prev = [], ""
    for ln in t.splitlines():
        segs = [x.strip() for x in re.split(r"\s{2,}", ln.strip()) if x.strip()]
        first = segs[0] if segs else ""
        w = None
        for m in PCT.finditer(ln):
            if re.search(r"\d{1,3}(?:[ ,.]\d{3})+\s*$", ln[: m.start()]):
                w = float(m.group(1).replace(",", "."))
                break
        if w is not None and len(segs) >= 4 and 0 < w <= 60 and re.search(r"\b(EUR|USD|GBP|SEK|NOK|DKK|CHF|JPY|PLN)\b", ln):
            nm = first                                       # tarpinės sumos (Aktsiad, Fondiosakud…) neturi valiutos – praleidžiamos
            if ISIN.fullmatch(first):
                nm = segs[1] if re.search(r"[A-Za-z]{3}", segs[1]) and not re.fullmatch(r"[A-Z]{2}", segs[1]) else prev
            if not (SKIP.search(nm) or re.fullmatch(r"[\d\s,.%-]+", nm) or len(nm) < 3):
                out.append((nm, w))
        if w is None and re.search(r"[A-Za-z]{3}", first) and not re.fullmatch(r"[A-D]{1,3}[a-z]?[0-9+-]*|\(.*\)", first):
            prev = first                                     # galimas kitos eilutės pavadinimas (ne reitingas, ne data)
    return out


def swedbank_top(t):
    L = t.splitlines()
    st = next((i for i, ln in enumerate(L) if re.search(r"Top 10 holdings", ln)), None)
    if st is None:
        return []
    out = []
    for ln in L[st + 1: st + 25]:
        m = re.match(r"\s*(\S.*?\S)\s+(\d{1,2}\.\d)(?:\s{2,}|$)", ln)
        if m and not re.fullmatch(r"[A-Z]{3}", m.group(1)) and "Weight" not in m.group(1):
            out.append((m.group(1), float(m.group(2))))
        if len(out) >= 10:
            break
    return out


def parse(pdf):
    t = subprocess.run(["pdftotext", "-layout", str(pdf), "-"], capture_output=True, text=True).stdout
    h = swedbank_top(t) if "Top 10 holdings" in t else full_list(t)
    seen, top = set(), []
    for n, w in sorted(h, key=lambda x: -x[1]):
        k = re.sub(r"\s+", " ", re.sub(r"\s*(\(\d\)|[¹²³⁴])+\s*$", "", n)).strip()
        if k not in seen:
            seen.add(k); top.append((k, w))
    top = top[:10]
    return top if top and sum(w for _, w in top) <= 100.5 else []


def latest_report(pillar, fid):
    path = "ii-pillar/mandatory-pension-funds" if pillar == "II" else "iii-pillar/supplementary-pension-funds"
    h = get(f"{B}/en/{path}/fid/{fid}/").decode("utf-8", "replace")
    rp = set(re.findall(r"/files/raport/[A-Z0-9]+/[^\"' <>]+?\.pdf", h))
    if not rp:
        return None, None
    d = lambda x: re.findall(r"_(\d{8})", x)[-1]
    best = max(rp, key=lambda x: (d(x), x.split("/")[-1].startswith("est")))   # sama data – eesti keeles (pilnas sąrašas)
    s = d(best)
    return f"{s[:4]}-{s[4:6]}-{s[6:]}", best


def run():
    meta = list(csv.DictReader((OUT / "baltic_ee_meta.csv").open(encoding="utf-8")))
    meta = [m for m in meta if m["last"] >= date.fromordinal(date.today().toordinal() - 60).isoformat()]   # tik veikiantys fondai
    path = OUT / "ee_holdings.csv"
    rows = list(csv.DictReader(path.open(encoding="utf-8"))) if path.exists() else []
    have = {(r["fund_id"], r["date"]) for r in rows}
    tmp = Path(tempfile.mkdtemp())

    def one(m):
        try:
            d, url = latest_report(m["pillar"], m["fund_id"])
            if not d or (m["fund_id"], d) in have:
                return m, d, None
            f = tmp / f"{m['fund_id']}.pdf"
            f.write_bytes(get(B + url))
            return m, d, parse(f)
        except Exception as e:
            print("  klaida", m["fund_id"], m["fund"], e)
            return m, None, None
    add = 0
    with ThreadPoolExecutor(4) as ex:
        for m, d, top in ex.map(one, meta):
            if top:
                rows += [{"fund_id": m["fund_id"], "pillar": m["pillar"], "date": d, "rank": i + 1, "name": n, "weight": w, "first_seen": TODAY} for i, (n, w) in enumerate(top)]
                add += 1
            elif top is not None:
                print("  neperskaityta", m["fund_id"], m["fund"], d)
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, FIELDS)
        w.writeheader()
        for r in sorted(rows, key=lambda r: (r["date"], r["fund_id"], int(r["rank"]))):
            w.writerow(r)
    print(f"ee_holdings.csv: +{add} fondų ataskaitos; fondų {len(meta)}")


if __name__ == "__main__":
    if "--test" in sys.argv:
        for f in sorted(Path(args[0]).glob("ee_*.pdf")):
            print(f.stem, parse(f)[:10])
    else:
        run()
