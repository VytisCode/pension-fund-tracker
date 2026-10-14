#!/usr/bin/env python3
"""
Vidutinis mėnesinis darbo užmokestis (bruto, neto) ir minimali mėnesinė alga iš Valstybės duomenų agentūros
-> imports/journey/wages.csv, imports/journey/min_wage.csv (savininko prašymas 2026-10-14 – kuo mažiau rankinio darbo).

Šaltinis: osp-rs.stat.gov.lt SDMX. Rinkinių kodai – DATASETS; jei jų nėra ar jie nebeveikia, paleidus su --probe
išspausdinami rinkiniai, kurių pavadinime yra „darbo užmokest“ arba „minimali“ (rinkinių sąrašas – /rest_xml/dataflow).
Pridedami tik nauji metai (seni neperrašomi); neįtikėtinas pokytis (> 20 % per metus) atmetamas.
"""
import re
import sys
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (pension fund tracker)"}
BASE = "https://osp-rs.stat.gov.lt/rest_xml/"


def get(url: str) -> str:
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120) as r:
        return r.read().decode("utf-8", "replace")


DATASETS = {}          # {"gross": ..., "net": ..., "min": ...} – užpildoma po --probe


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


def probe2():
    """Kuriame rinkinyje yra žinomos 2024–2025 m. reikšmės (bruto 2223,0 / 2337,7, neto 1368,0 / 1436,4)."""
    targets = {"2024": (2223.0, 1368.0), "2025": (2337.7, 1436.4)}
    ids = ["S3R0050_M3060315_1", "S3R0050_M3060320_1", "S3R0050_M3060322", "S3R0050_M3060836_1", "S3R0050_M3060837_1", "S3R0050_M3060838_1",
           "S3R0050_M3060847", "S3R0050_M3060862_1", "S3R0050_M3060862_3", "S3R0050_M3060320_3", "S3R0050_M3060315_12", "S3R0048_M3060844_1"]
    for i in ids:
        try:
            text = get(BASE + "data/" + i)
        except Exception as e:
            print(i, "klaida", e)
            continue
        hits = 0
        for o in re.findall(r"<g:Obs>(.*?)</g:Obs>", text, re.S):
            per = re.search(r'LAIKOTARPIS" value="([^"]+)"', o)
            v = re.search(r'ObsValue value="([^"]+)"', o)
            if not per or not v:
                continue
            y = per.group(1)[:4]
            if y in targets and any(abs(float(v.group(1)) - t) < 0.06 for t in targets[y]) and hits < 6:
                hits += 1
                print(i, len(text), per.group(1), v.group(1), re.sub(r"\s+", " ", o)[:400])
        if not hits:
            print(i, len(text), "– nėra", re.sub(r"\s+", " ", (re.findall(r"<g:Obs>(.*?)</g:Obs>", text, re.S) or [""])[0])[:300])


if __name__ == "__main__":
    if "--probe2" in sys.argv or not DATASETS:
        probe2()
        sys.exit()
    if "--probe" in sys.argv or not DATASETS:
        probe()
