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


if __name__ == "__main__":
    if "--probe" in sys.argv or not DATASETS:
        probe()
