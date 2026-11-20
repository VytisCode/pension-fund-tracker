"""Patikra: atsisiunčia nurodytus manapensija.lv failus (id) į probe_out – skaitytuvo derinimui pagal tikrus PDF."""
import sys, urllib.request
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
for i in sys.argv[1:]:
    try:
        b = urllib.request.urlopen(urllib.request.Request(f"https://www.manapensija.lv/api/data/files?id={i}&level=2", headers={"User-Agent": "Mozilla/5.0"}), timeout=90).read()
        (out / f"f_{i}.pdf").write_bytes(b); print(i, len(b))
    except Exception as e:
        print(i, "ERR", e)
