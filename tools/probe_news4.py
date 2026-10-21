"""Patikra: Seimo atviri duomenys (posėdžiai, darbotvarkės), LRS naujienų puslapis, Delfi skyrių RSS. Rezultatai – probe_out/news4.txt."""
import re
import time
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension news monitor)"
out = Path("probe_out"); out.mkdir(exist_ok=True)
log = []


def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=60) as r:
            b = r.read().decode("utf-8", "replace")
            log.append("== %s %s len=%d" % (r.status, u, len(b)))
            return b
    except Exception as e:
        log.append("== ERR %s %s" % (e, u))
        return ""


A = "https://apps.lrs.lt/sip/"
k = get(A + "p2b.ad_seimo_kadencijos"); log.append(k[:1500])
s = get(A + "p2b.ad_seimo_sesijos?kadencijos_id=10"); log.append(s[:1500])
sid = re.findall(r'sesijos_id="(\d+)"', s)
log.append("sesijos: %s" % sid[-5:])
for x in sid[-2:]:
    p = get(A + "p2b.ad_seimo_posedziai?sesijos_id=" + x); log.append(p[:1200])
    pid = re.findall(r'posėdžio_id="(\d+)"|posedzio_id="(\d+)"', p)
    pid = [a or b for a, b in pid]
    log.append("posedziai %s: %d %s" % (x, len(pid), pid[-3:]))
    for y in pid[-2:]:
        d = get(A + "p2b.ad_sp_darbotvarke?posedzio_id=" + y); log.append(d[:2500])
        d2 = get(A + "p2b.ad_sp_posedzio_eiga?posedzio_id=" + y); log.append(d2[:1500])
    time.sleep(0.5)
for u in ["https://www.lrs.lt/sip/portal.show?p_r=35403&p_k=1", "https://www.lrs.lt/sip/portal.show?p_r=35403&p_k=1&p_a=paieska&p_text=pensij"]:
    h = get(u)
    log.append("\n".join(sorted(set(re.sub(r"\s+", " ", re.sub("<[^>]+>", "", m)).strip()[:160] for m in re.findall(r"<a[^>]+href=\"[^\"]*p_t=\d+[^\"]*\"[^>]*>(.*?)</a>", h, re.S)))[:40])[:3000])
    log.append(str(re.findall(r'href="([^"]*p_t=\d+[^"]*)"', h)[:5]))
for u in ["https://feed.delfi.lt/v2?format=rss&category=verslas", "https://www.delfi.lt/rss/feeds/verslas.xml", "https://feed.delfi.lt/v2?format=rss&channel=verslas",
          "https://www.vz.lt/rss/finansai", "https://www.lsm.lv/temas/pensijas/rss/", "https://www.tv3.lt/rss/naujienos"]:
    h = get(u)
    log.append(h[:800])
(out / "news4.txt").write_text("\n".join(log), encoding="utf-8")
print("\n".join(log)[:3000])
