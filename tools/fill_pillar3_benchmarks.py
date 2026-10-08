"""Vienkartinis: įrašo III pakopos lyginamąjį indeksą (SEB, Goindex) iš imports/pillar3/ failų į data/pillar3_history.csv.

Pildomi tik tušti benchmark_index langeliai tų dienų, kurios jau yra istorijoje ir kurių vieneto vertė sutampa su failu.
Kitos reikšmės nekeičiamos.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import pillar3  # noqa: E402
import store  # noqa: E402

existing = pillar3.load()
filled = skipped = 0
for r in pillar3.read_import_files():
    old = existing.get((r["date"], r["fund"]))
    if not r["benchmark_index"] or not old or old.get("benchmark_index"):
        continue
    if abs(float(old["unit_value"]) - r["unit_value"]) > 1e-9:
        skipped += 1
        continue
    old["benchmark_index"] = str(r["benchmark_index"])
    filled += 1
store.upsert(list(existing.values()), pillar3.DATA_FILE)
print(f"įrašyta {filled}, praleista (kita vieneto vertė) {skipped}")
