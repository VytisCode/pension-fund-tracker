"""Patikra: ar iš GitHub Actions pasiekiami naujienų RSS srautai (LT, LV, EE) ir Google News paieškos RSS (ir su datų intervalu
istorijai). Rezultatai – probe_out/news.txt."""
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; news monitor)"
out = Path("probe_out")
out.mkdir(exist_ok=True)
lines = []


def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers={"User-Agent": UA}), timeout=40) as r:
            return r.status, r.geturl(), r.read().decode("utf-8", "replace")
    except Exception as e:
        return str(e), u, ""


def items(x):
    its = re.findall(r"<item>(.*?)</item>", x, re.S) or re.findall(r"<entry>(.*?)</entry>", x, re.S)
    res = []
    for it in its:
        t = re.search(r"<title[^>]*>(.*?)</title>", it, re.S)
        d = re.search(r"<description[^>]*>(.*?)</description>", it, re.S) or re.search(r"<summary[^>]*>(.*?)</summary>", it, re.S)
        l = re.search(r"<link[^>]*>(.*?)</link>", it, re.S) or re.search(r'<link[^>]*href="([^"]+)"', it)
        p = re.search(r"<pubDate>(.*?)</pubDate>", it) or re.search(r"<published>(.*?)</published>", it)
        res.append((t.group(1).strip()[:120] if t else "", len(d.group(1)) if d else 0, (d.group(1)[:200] if d else ""), l.group(1).strip()[:150] if l else "", p.group(1) if p else ""))
    return res


FEEDS = ["https://www.lrt.lt/?rss", "https://www.lrt.lt/naujienos/verslas?rss", "https://www.15min.lt/rss", "https://www.15min.lt/rss/verslas",
         "https://www.delfi.lt/rss/feeds/daily.xml", "https://www.delfi.lt/rss/feeds/business.xml", "https://www.vz.lt/rss", "https://www.elta.lt/lt/rss",
         "https://www.bns.lt/rss", "https://www.tv3.lt/rss", "https://www.lrytas.lt/rss", "https://www.alfa.lt/rss",
         "https://www.err.ee/rss", "https://news.err.ee/rss", "https://www.postimees.ee/rss", "https://majandus.postimees.ee/rss", "https://www.delfi.ee/rss",
         "https://www.aripaev.ee/rss", "https://www.lsm.lv/rss/", "https://eng.lsm.lv/rss/", "https://www.delfi.lv/rss/", "https://www.db.lv/rss",
         "https://www.tvnet.lv/rss", "https://www.diena.lv/rss/", "https://www.lrt.lt/en/news-in-english?rss", "https://www.sodra.lt/lt/naujienos?rss",
         "https://www.lb.lt/lt/naujienos?rss", "https://socmin.lrv.lt/lt/naujienos/rss"]
for u in FEEDS:
    st, fu, x = get(u)
    its = items(x)
    lines.append(f"== {u} -> {st} {fu} items={len(its)}")
    for it in its[:2]:
        lines.append(f"   {it}")
    time.sleep(0.5)
Q = {"lt": ("pensijų kaupimas OR \"II pakopa\" OR \"III pakopa\" OR pensijų fondai", "LT"), "lv": ("pensiju plāni OR \"2. līmeņa\" OR pensiju fondi", "LV"),
     "et": ("pensionifond OR \"teine sammas\" OR \"II sammas\" OR \"kolmas sammas\"", "EE")}
for hl, (q, gl) in Q.items():
    for extra in ("", " after:2023-05-01 before:2023-06-01", " after:2021-08-01 before:2021-09-01"):
        u = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": q + extra, "hl": hl, "gl": gl, "ceid": f"{gl}:{hl}"})
        st, fu, x = get(u)
        its = items(x)
        lines.append(f"== GN {hl}{extra} -> {st} items={len(its)}")
        for it in its[:4]:
            lines.append(f"   {it}")
        if its and not extra:
            st2, fu2, x2 = get(re.sub(r"&amp;", "&", its[0][3]))
            md = re.search(r'<meta[^>]+(?:property="og:description"|name="description")[^>]+content="([^"]*)"', x2)
            lines.append(f"   follow -> {st2} {fu2[:150]} desc={md.group(1)[:200] if md else None} len={len(x2)}")
        time.sleep(1)
(out / "news.txt").write_text("\n".join(lines), encoding="utf-8")
print("\n".join(lines))
