#!/usr/bin/env python3
"""
Vidutinis mėnesinis darbo užmokestis (bruto, neto, metinis) iš Valstybės duomenų agentūros -> imports/journey/wages.csv
(savininko prašymas 2026-10-14 – kuo mažiau rankinio darbo).

Šaltinis: osp-rs.stat.gov.lt SDMX rinkinys S3R0050_M3060847 (rasta su --probe, 2024 m. 2223,0 / 1368,0 – sutampa su failu).
Minimalios mėnesinės algos VDA SDMX rinkiniuose nėra – ji lieka rankinė (kartą per metus).
Pridedami tik nauji metai (seni neperrašomi, skirtumai tik parašomi žurnale); neįtikėtinas pokytis atmetamas.
"""
import re
import sys
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (pension fund tracker)"}
BASE = "https://osp-rs.stat.gov.lt/rest_xml/"


def get(url: str) -> str:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read().decode("utf-8", "replace")


DATASETS = {"wages": "S3R0050_M3060847"}   # „Darbo užmokestis (mėnesinis)“, metinis, visa ekonomika (EVRK TOTAL), abi lytys; bruto ir neto
OUT = __import__("pathlib").Path(__file__).resolve().parent.parent / "imports" / "journey" / "wages.csv"


def parse_wages(text: str) -> dict:
    out = {}
    for o in re.findall(r"<g:Obs>(.*?)</g:Obs>", text, re.S):
        kv = dict(re.findall(r'<g:Value id="([^"]+)" value="([^"]*)"', o))
        v = re.search(r'ObsValue value="([^"]+)"', o)
        per = kv.get("LAIKOTARPIS", "")
        if not v or not re.fullmatch(r"\d{4}", per) or kv.get("Lytis") != "0" or kv.get("MATVNT") != "eur" or kv.get("EVRK2M3060837") != "TOTAL":
            continue
        out.setdefault(int(per), {})[kv.get("darboM3060321")] = round(float(v.group(1)), 1)
    return {y: d for y, d in out.items() if d.get("bruto") and d.get("neto")}


def update_wages():
    import csv
    data = parse_wages(get(BASE + "data/" + DATASETS["wages"]))
    with OUT.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    have = {int(r["year"]): r for r in rows}
    added = False
    print("VDA vidutinis DU:", {y: (d["bruto"], d["neto"]) for y, d in sorted(data.items())[-4:]})
    for y, d in sorted(data.items()):
        if y in have:
            r = have[y]
            if abs(float(r["gross"]) - d["bruto"]) > 0.5 or abs(float(r["net"] or 0) - d["neto"]) > 0.5:
                print(f"  {y}: faile {r['gross']}/{r['net']}, VDA {d['bruto']}/{d['neto']} – skiriasi (seni duomenys neperrašomi)")
            continue
        last = max(have)
        if y != last + 1 or not (0.95 < d["bruto"] / float(have[last]["gross"]) < 1.2):
            print(f"  {y}: praleidžiama (ne kiti metai arba neįtikėtinas pokytis)")
            continue
        new = {"year": str(y), "gross": f"{d['bruto']}", "net": f"{d['neto']}", "source": "osp.stat.gov.lt"}
        rows.append(new); have[y] = new; added = True
        print(f"  pridėta {y}: {d['bruto']} / {d['neto']}")
    if not added:
        return
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["year", "gross", "net", "source"], lineterminator="\n")
        w.writeheader()
        w.writerows(rows)


def probe():
    text = get(BASE + "dataflow/")
    print(f"dataflow: {len(text)} simbolių; pradžia: {text[:300]!r}")
    parts = re.split(r"<(?:\w+:)?Dataflow\b", text)[1:]
    print(f"rinkinių: {len(parts)}")
    for p in parts:
        m = re.search(r'\bid="([^"]+)"', p)
        names = re.findall(r'<(?:\w+:)?Name xml:lang="lt">([^<]+)<', p) or re.findall(r'<(?:\w+:)?Name[^>]*>([^<]+)<', p)
        name = names[0] if names else ""
        if m and re.search(r"darbo užmokest|minimal", name, re.I):
            print("  ", m.group(1), "|", name)


if __name__ == "__main__":
    if "--probe" in sys.argv:
        probe()
    else:
        update_wages()
