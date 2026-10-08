#!/usr/bin/env python3
"""Vienkartinė patikra: ką ESMA FIRDS registras grąžina obligacijų ISIN kodams (rezultatai į probe_out/)."""
import json
import sys
import urllib.request
from pathlib import Path

OUT = Path("probe_out"); OUT.mkdir(exist_ok=True)
ISINS = sys.argv[1:] or ["DE0001102457", "LT0000610057", "XS2231715322", "LT0000670045"]
for isin in ISINS:
    for name, url in {
        "solr": f"https://registers.esma.europa.eu/solr/esma_registers_firds/select?q=isin:{isin}&wt=json&rows=3",
        "solr_any": f"https://registers.esma.europa.eu/solr/esma_registers_firds/select?q={isin}&wt=json&rows=3",
    }.items():
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "pension-fund-tracker"}), timeout=30) as r:
                (OUT / f"{isin}_{name}.json").write_bytes(r.read())
        except Exception as exc:
            (OUT / f"{isin}_{name}.err").write_text(repr(exc))
print("done")
