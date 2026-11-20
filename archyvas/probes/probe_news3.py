"""Patikra: Google News nuorodų iššifravimas į tikrą straipsnio adresą (be raktų) ir straipsnio aprašas (og:description);
Seimo, LIPFA, Sodros ir kitų šaltinių srautai. Rezultatai – probe_out/news3.txt."""
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, "tools")
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
out = Path("probe_out")
out.mkdir(exist_ok=True)
L = []


def get(u, data=None, hdr=None):
    try:
        req = urllib.request.Request(u, data=data, headers={"User-Agent": UA, **(hdr or {})})
        with urllib.request.urlopen(req, timeout=40) as r:
            return r.status, r.geturl(), r.read().decode("utf-8", "replace")
    except Exception as e:
        return str(e), u, ""


def decode(gurl):
    aid = urllib.parse.urlparse(gurl).path.split("/")[-1]
    st, _, h = get(f"https://news.google.com/rss/articles/{aid}")
    sg = re.search(r'data-n-a-sg="([^"]+)"', h)
    ts = re.search(r'data-n-a-ts="([^"]+)"', h)
    if not sg or not ts:
        st, _, h = get(f"https://news.google.com/articles/{aid}")
        sg = re.search(r'data-n-a-sg="([^"]+)"', h)
        ts = re.search(r'data-n-a-ts="([^"]+)"', h)
    if not sg or not ts:
        return f"no sig ({st})"
    inner = f'["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"{aid}",{ts.group(1)},"{sg.group(1)}"]'
    body = urllib.parse.urlencode({"f.req": json.dumps([[["Fbv4je", inner, None, "generic"]]])}).encode()
    st, _, t = get("https://news.google.com/_/DotsSplashUi/data/batchexecute", body, {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"})
    try:
        j = json.loads(t.split("\n\n", 1)[1])
        return json.loads(j[0][2])[1]
    except Exception as e:
        return f"parse fail {st} {t[:200]}"


import fetch_news as F
x = get("https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": "pensijų fondai", "hl": "lt", "gl": "LT", "ceid": "LT:lt"}))[2]
for it in F.items(x)[:6]:
    u = decode(it["url"])
    L.append(f"GN {it['title'][:70]} -> {u}")
    if u.startswith("http"):
        st, fu, h = get(u)
        md = re.search(r'<meta[^>]+(?:property="og:description"|name="description")[^>]+content="([^"]*)"', h) or re.search(r'<meta[^>]+content="([^"]*)"[^>]+(?:property="og:description"|name="description")', h)
        pt = re.search(r'"datePublished"\s*:\s*"([^"]+)"', h)
        L.append(f"    page {st} len={len(h)} desc={md.group(1)[:250] if md else None} pub={pt.group(1) if pt else None}")
    time.sleep(1.5)
for u in ["https://lipfa.lt/feed/", "https://lipfa.lt/naujienos/", "https://www.sodra.lt/lt/naujienos", "https://www.sodra.lt/rss",
          "https://www.lrs.lt/sip/portal.show?p_r=35403&p_k=1", "https://www.lrs.lt/rss/naujienos.xml", "https://www.lrs.lt/sip/rss.xml",
          "https://apps.lrs.lt/sip/p2b.ad_seimo_kadencijos", "https://apps.lrs.lt/sip/p2b.ad_seimo_sesijos?kadencijos_id=10",
          "https://e-seimas.lrs.lt/portal/legalActSearch/lt?searchCriteria=pensij%C5%B3%20kaupimo", "https://www.e-tar.lt/rss",
          "https://www.lb.lt/lt/rss", "https://finmin.lrv.lt/lt/naujienos/rss", "https://lrv.lt/lt/naujienos/rss",
          "https://www.vz.lt/rss/finansai", "https://www.vz.lt/rss.xml", "https://www.delfi.lt/rss/", "https://www.tv3.lt/rss/naujienos",
          "https://www.bank.lv/lv/statistika", "https://www.bank.lv/rss", "https://www.manapensija.lv/api/contents", "https://www.fm.gov.lv/lv/rss",
          "https://www.lsm.lv/temas/pensijas/rss/", "https://www.tuleva.ee/feed/", "https://www.riigikogu.ee/feed/", "https://www.fin.ee/rss.xml"]:
    st, fu, h = get(u)
    n = len(re.findall(r"<item\b", h))
    titles = [re.sub(r"<!\[CDATA\[|\]\]>", "", t)[:80] for t in re.findall(r"<title[^>]*>(.*?)</title>", h, re.S)[:4]]
    L.append(f"== {u} -> {st} {fu[:100]} len={len(h)} items={n} {titles}")
    time.sleep(0.7)
(out / "news3.txt").write_text("\n".join(L), encoding="utf-8")
print("\n".join(L))
