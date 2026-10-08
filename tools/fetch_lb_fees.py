"""Atsisiunčia Lietuvos banko II ir III pakopos fondų mokesčių failus į probe_out/ (paleidžiama per „Probe III pillar sources“)."""
import sys
from pathlib import Path
import requests

URLS = {
    "pf-ii-mokesciai-2026-05-15.xls": "https://www.lb.lt/uploads/documents/files/musu-veikla/finansu-rinkos-dalyviu-prieziura/finansu-sektoriai/pensiju-fondai/pf-ii-mokesciai-2026-05-15.xls",
    "PF_III_mokesciai_2026-01-21.xlsx": "https://www.lb.lt/uploads/documents/files/PF_III_mokesciai_2026-01-21.xlsx",
}
out = Path("probe_out")
out.mkdir(exist_ok=True)
ok = True
for name, url in URLS.items():
    for u in (url, "https://www.lb.lt/lt/media/force_download/?url=" + requests.utils.quote(url.split("lb.lt")[1], safe="")):
        try:
            r = requests.get(u, timeout=60, headers={"User-Agent": "Mozilla/5.0"})
            print(u, r.status_code, len(r.content), r.headers.get("content-type"))
            if r.ok and len(r.content) > 1000 and not r.content[:200].lstrip().lower().startswith(b"<"):
                (out / name).write_bytes(r.content)
                break
        except Exception as e:
            print(u, "klaida:", e)
    else:
        ok = False
sys.exit(0 if ok else 1)
