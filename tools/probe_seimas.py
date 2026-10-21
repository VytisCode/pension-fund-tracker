"""Patikra: Seimo posėdžių darbotvarkės (apps.lrs.lt/sip/p2b.ad_sp_darbotvarke) – formatas ir pensijų klausimai. probe_out/seimas.txt."""
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension news monitor)"
A = "https://apps.lrs.lt/sip/"
out = Path("probe_out"); out.mkdir(exist_ok=True)
L = []


def get(u):
    with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60) as r:
        return r.read().decode("utf-8", "replace")


pos = re.findall(r'posėdžio_id="(-?\d+)"[^>]*pradžia="([^"]+)"', get(A + "p2b.ad_seimo_posedziai?sesijos_id=145"))
L.append("posėdžiai: %d %s" % (len(pos), pos[:3]))
for i, (pid, d) in enumerate(pos):
    for ep in ("p2b.ad_sp_darbotvarke?posedzio_id=", "p2b.ad_sp_posedzio_eiga?posedzio_id=") if i < 2 else ("p2b.ad_sp_darbotvarke?posedzio_id=",):
        try:
            x = get(A + ep + pid)
        except Exception as e:
            L.append("ERR %s %s %s" % (ep, pid, e)); continue
        if i < 2:
            L.append("==== %s%s\n%s" % (ep, pid, x[:5000]))
        try:
            root = ET.fromstring(x)
            for el in root.iter():
                t = " ".join(v for v in el.attrib.values())
                if re.search(r"pensij|anuitet", t, re.I):
                    L.append("PENS %s %s %s %s" % (d, ep[:22], el.tag, dict(el.attrib)))
        except Exception as e:
            L.append("XML ERR %s" % e)
    time.sleep(0.3)
h = get("https://www.lrs.lt/sip/portal.show?p_r=35403&p_k=1")
i = h.find("p_t=")
L.append("==== LRS naujienos HTML\n" + h[max(0, i - 1500): i + 2500])
(out / "seimas.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L)[:3000])
