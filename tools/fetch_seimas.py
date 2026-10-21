"""Ką Seimas svarsto apie pensijas (savininko užduotis 2026-10-21): Seimo posėdžių darbotvarkių klausimai apie pensijų kaupimą,
pensijas, anuitetus, Sodros biudžetą ir GPM -> data/seimas.csv (tik papildomas).

Šaltinis – Seimo kanceliarijos atviri duomenys (CC BY 4.0, be raktų): apps.lrs.lt/sip/p2b.ad_seimo_kadencijos,
p2b.ad_seimo_sesijos, p2b.ad_seimo_posedziai, p2b.ad_sp_darbotvarke. Kiekvienas įrašas – vienas darbotvarkės klausimas su stadija
(pateikimas, svarstymas, priėmimas), projekto numeriu (XVP-…) ir nuoroda į projektą e-seime.

Naudojimas: python tools/fetch_seimas.py [aplankas]                 – kasdien: einamosios ir ankstesnės sesijos
            python tools/fetch_seimas.py [aplankas] --backfill 8 9 10 – istorija pagal kadencijas (8 = 2016–2020)
"""
import csv
import re
import sys
import time
import urllib.request
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from datetime import date
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension news monitor)"
A = "https://apps.lrs.lt/sip/"
args = [a for a in sys.argv[1:] if not a.startswith("--") and not a.isdigit()]
OUT = Path(args[0]) if args else Path(__file__).resolve().parent.parent / "data"
TODAY = date.today().isoformat()
FIELDS = ["id", "date", "time", "sitting", "sitting_type", "item", "title", "stage", "project", "category", "speakers", "doc_url", "first_seen"]
CATS = [  # kategorija: raktažodžiai darbotvarkės klausimo pavadinime (pirmas atitikęs)
    ("kaupimas", r"pensijų kaupim|pensijų anuitet|papildomo savanoriško pensijų kaup|pensijų fond"),
    ("pensijos", r"pensij"),
    ("sodra", r"valstybinio socialinio draudimo fondo|socialinio draudimo įstatym"),
    ("gpm", r"gyventojų pajamų mokesčio"),
]


def get(u):
    for i in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60) as r:
                return ET.fromstring(r.read())
        except Exception as e:
            err = e
            time.sleep(2 * (i + 1))
    raise err


def cat(t):
    for k, rx in CATS:
        if re.search(rx, t, re.I):
            return k
    return ""


def sittings(sid):
    return [(p.get("posėdžio_id"), p.get("pradžia") or "", p.get("numeris") or "", p.get("tipas") or "") for p in get(A + "p2b.ad_seimo_posedziai?sesijos_id=" + sid).iter("SeimoPosėdis")]


def agenda(pid, start, no, typ):
    out = []
    for q in get(A + "p2b.ad_sp_darbotvarke?posedzio_id=" + pid).iter("DarbotvarkėsKlausimas"):
        t = re.sub(r"\s+", " ", (q.get("pavadinimas") or "").replace("\xa0", " ")).strip()
        c = cat(t)
        if not c:
            continue
        sp = "; ".join(f"{s.get('asmuo')} ({s.get('pareigos')})" if s.get("pareigos") else s.get("asmuo") or "" for s in q.iter("KlausimoPranešėjas"))
        pr = re.search(r"Nr\. ([A-ZĄČĘĖĮŠŲŪŽ]+P-\d+(?:\(\d+\))?)", t)
        for st in list(q.iter("KlausimoStadija")) or [None]:
            out.append({"id": f"{pid}:{st.get('darbotvarkės_klausimo_id') if st is not None else q.get('numeris')}", "date": start[:10], "time": q.get("laikas_nuo") or start[11:16],
                        "sitting": no, "sitting_type": typ, "item": (q.get("numeris") or "").replace("  ", " ").strip(), "title": t,
                        "stage": st.get("pavadinimas") if st is not None else "", "project": pr.group(1) if pr else "", "category": c, "speakers": sp,
                        "doc_url": st.get("dokumento_nuoroda") if st is not None else "", "first_seen": TODAY})
    return out


def merge(rows):
    path = OUT / "seimas.csv"
    old = {}
    if path.exists():
        for r in csv.DictReader(path.open(encoding="utf-8")):
            old[r["id"]] = r
    add = 0
    for r in rows:
        o = old.get(r["id"])
        if not o:
            old[r["id"]] = r; add += 1
        else:                                                   # tik tušti laukai papildomi (pvz. vėliau atsiradusi nuoroda)
            for k, v in r.items():
                if v and not o.get(k):
                    o[k] = v
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, FIELDS)
        w.writeheader()
        for r in sorted(old.values(), key=lambda r: (r["date"], r["time"], r["id"]), reverse=True):
            w.writerow({f: r.get(f, "") for f in FIELDS})
    print(f"seimas.csv: +{add} naujų, iš viso {len(old)}")


def run(kads, recent_only):
    rows = []
    for k in kads:
        ses = [(s.get("sesijos_id"), s.get("data_nuo") or "") for s in get(A + "p2b.ad_seimo_sesijos?kadencijos_id=" + k).iter("SeimoSesija")]
        ses.sort(key=lambda s: s[1])
        if recent_only:
            ses = ses[-2:]
        for sid, _ in ses:
            todo = [x for x in sittings(sid) if not recent_only or x[1][:10] >= date.fromordinal(date.today().toordinal() - 45).isoformat()]

            def one(x):
                try:
                    return agenda(*x)
                except Exception as e:
                    print("klaida", x[0], e)
                    return []
            with ThreadPoolExecutor(4) as ex:               # 4 lygiagrečios užklausos – istorija per kelias minutes
                for r in ex.map(one, todo):
                    rows += r
            print(k, sid, len(todo), len(rows), flush=True)
            if not recent_only:
                merge(rows); rows = []                      # istorija įrašoma po kiekvienos sesijos
    merge(rows)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    if "--backfill" in sys.argv:
        run([a for a in sys.argv[1:] if a.isdigit()] or ["8", "9", "10"], False)
    else:
        last = max(get(A + "p2b.ad_seimo_kadencijos").iter("SeimoKadencija"), key=lambda k: int(k.get("kadencijos_id"))).get("kadencijos_id")
        run([last], True)
