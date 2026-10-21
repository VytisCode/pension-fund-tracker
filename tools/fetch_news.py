"""Naujienos apie pensijų sistemą Lietuvoje, Latvijoje ir Estijoje (savininko užduotis 2026-10-21): antraštė, šaltinis, data,
trumpas aprašas ir nuoroda; archyvas kaupiamas į data/news.csv (tik papildomas – istorija neperrašoma), kad vėliau būtų galima
analizuoti temų aktualumą žiniasklaidoje ir valdžioje.

Šaltiniai (nemokami, be raktų):
- Google News paieškos RSS kiekvienai šaliai (antraštė + leidinys + data; nuoroda veda per news.google.com);
- tiesioginiai leidinių RSS (LRT, 15min, Lrytas, SADM, ERR, Postimees, Äripäev, LSM, Dienas Bizness, Diena, TVNET) – su aprašu ir
  tiesiogine nuoroda; jei ta pati antraštė yra abiejuose, imamas tiesioginis.
- organizacijų srautai (LIPFA, Finansų ministerija, Vyriausybė, Tuleva, Riigikogu).
Atrenkama pagal raktažodžius (pensijų fondai, II/III pakopa, sammas, līmenis…), temos priskiriamos raktažodžiais.
Aprašas be AI (savininkas 2026-10-21: be mokamų paslaugų): Google News nuoroda iššifruojama į tikrą straipsnio adresą
(article_url) ir iš straipsnio puslapio paimamas jo paties aprašas (og:description) – tik tušti laukai papildomi.
Kasdien papildoma ribotai (laiko biudžetas), tad senesni įrašai papildomi palaipsniui.

Naudojimas: python tools/fetch_news.py [išvesties aplankas]          – kasdien (update.yml)
            python tools/fetch_news.py [aplankas] --backfill 2019-01  – vienkartinė istorija iš Google News pagal mėnesius
            python tools/fetch_news.py [aplankas] --enrich 900         – papildyti aprašus ir tikras nuorodas (iki 900 s)
"""
import csv
import hashlib
import html
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

import json

UA = "Mozilla/5.0 (pension-fund-tracker; public pension news monitor)"
BUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"  # straipsnių puslapiams
args = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = Path(args[0]) if args else Path(__file__).resolve().parent.parent / "data"
TODAY = date.today().isoformat()
FIELDS = ["id", "date", "country", "lang", "source", "title", "summary", "url", "topics", "via", "first_seen", "article_url"]

GN = {  # šalis: (kalba, užklausos)
    "LT": ("lt", ["pensijų fondai OR pensijų kaupimas OR \"II pakopa\" OR \"III pakopa\"", "\"antroji pakopa\" OR \"antrosios pakopos\" OR \"trečiosios pakopos\" OR pensijų reforma"]),
    "LV": ("lv", ["pensiju plāni OR pensiju fondi OR \"pensiju 2. līmenis\" OR \"2. pensiju līmenis\"", "\"pensiju 3. līmenis\" OR \"otrais pensiju līmenis\" OR pensiju reforma"]),
    "EE": ("et", ["pensionifond OR \"teine sammas\" OR \"II sammas\" OR \"III sammas\"", "\"teise samba\" OR \"kolmanda samba\" OR pensionireform"]),
}
FEEDS = [("LT", "lt", "LRT", "https://www.lrt.lt/?rss"), ("LT", "lt", "LRT", "https://www.lrt.lt/naujienos/verslas?rss"), ("LT", "lt", "15min", "https://www.15min.lt/rss"),
         ("LT", "lt", "15min", "https://www.15min.lt/rss/verslas"), ("LT", "lt", "Lrytas", "https://www.lrytas.lt/rss"), ("LT", "lt", "SADM", "https://socmin.lrv.lt/lt/naujienos/rss"),
         ("LT", "en", "LRT English", "https://www.lrt.lt/en/news-in-english?rss"), ("EE", "et", "ERR", "https://www.err.ee/rss"), ("EE", "en", "ERR News", "https://news.err.ee/rss"),
         ("EE", "et", "Postimees", "https://www.postimees.ee/rss"), ("EE", "et", "Postimees", "https://majandus.postimees.ee/rss"), ("EE", "et", "Äripäev", "https://www.aripaev.ee/rss"),
         ("LV", "lv", "LSM", "https://www.lsm.lv/rss/"), ("LV", "en", "LSM English", "https://eng.lsm.lv/rss/"), ("LV", "lv", "Dienas Bizness", "https://www.db.lv/rss"),
         ("LV", "lv", "Diena", "https://www.diena.lv/rss/"), ("LV", "lv", "TVNET", "https://www.tvnet.lv/rss"),
         ("LT", "lt", "Finansų ministerija", "https://finmin.lrv.lt/lt/naujienos/rss"), ("LT", "lt", "Vyriausybė", "https://lrv.lt/lt/naujienos/rss"),
         ("EE", "et", "Riigikogu", "https://www.riigikogu.ee/feed/")]
ORG_FEEDS = [("LT", "lt", "LIPFA", "https://lipfa.lt/feed/"), ("EE", "et", "Tuleva", "https://tuleva.ee/feed/")]   # visi įrašai susiję su pensijomis
# papildomos istorijos užklausos (pagal ketvirčius): temos ir veikėjai, kurių bendros užklausos nepagauna
BFQ = {"LT": ["pensijų kaupimo įstatymas OR \"pensijų kaupimo\" Seimas", "III pakopa GPM lengvata OR \"pensijų fondų\" lengvata", "valstybės paskata pensijų kaupimas OR \"valstybės įmoka\" pakopa",
              "pensijų anuitetas OR anuitetai Sodra", "LIPFA pensijų OR \"investicinių ir pensijų fondų asociacija\"", "Lazutka pensijų OR Rukas pensijų",
              "pensijų fondų valdymo mokesčiai OR atskaitymai", "pensijų fondų grąža OR \"pensijų fondai\" uždirbo"],
       "LV": ["\"2. līmeņa\" pensiju OR \"pensiju 2. līmeņa\" iemaksas", "pensiju plānu ienesīgums OR pensiju pārvaldītāji"],
       "EE": ["pensionireform Riigikogu OR \"teise samba\" seadus", "\"teise samba\" raha väljavõtmine OR \"II sambast\" lahkumine", "Tuleva pension OR pensionifondide tootlus"]}
# straipsnis laikomas susijusiu su pensijų sistema, jei antraštėje ar apraše yra šių žodžių
KEY = re.compile(r"pensij\w* (fond|kaup|pakop|reform|anuitet|sistem|sutaup|santaup)|\b(ii|iii|antr\w*|treči\w*) pakop|pensijų kaup|pensijų fond|pensijų reform"
                 r"|pensiju (plān|fond|līmen|reform|uzkrāj|sistēm)|\b[23]\. (pensiju )?līme|otr\w* pensiju līme|pensiju [23]\. līme"
                 r"|pensionifond|pensionisamm|pensionikeskus|pensionireform|\b(teine|kolmas|teise|kolmanda|ii|iii) samba?\b|\b(ii|iii) sammas"
                 r"|pension (fund|pillar|reform|saving)|(second|third|2nd|3rd) pillar|private pension", re.I)
TOPICS = [  # tema: raktažodžiai (visomis kalbomis)
    ("reform", r"reform|išėj|pasitrauk|atsiim|išsiim|lahku|väljamaks|väljavõt|izstā|izņem|withdraw|opt.?out|leav"),
    ("tax", r"\bgpm\b|lengvat|mokesč|nodok|tulumaks|maksusoodust|\btax"),
    ("state", r"paskat|valstybės (įmok|dal)|valsts (iemaks|daļ)|riigi (panus|osa)|sotsiaalmaks|incentive|state contribution|state co"),
    ("returns", r"grąž|uždirb|prarad|rezultat|ienesīg|peļņ|zaudēj|tootlus|kasum|kahjum|\breturn|yield|earn|loss"),
    ("fees", r"mokest|atskaitym|komisij|valdymo|tasu|haldus|\bfee"),
    ("payout", r"anuitet|išmok|izmaks|väljamakse|annuit|payout"),
    ("politics", r"seim|vyriausyb|ministr|saeim|valdīb|riigikogu|valitsus|government|parliament|minister|biudžet|budžet|eelarve|budget"),
]
MGRS = ["SEB", "Swedbank", "Luminor", "Allianz", "Artea", "Goindex", "INVL", "LHV", "Tuleva", "CBL", "Indexo", "Citadele", "Signet"]


def get(url, data=None, hdr=None, ua=UA, timeout=40):
    with urllib.request.urlopen(urllib.request.Request(url, data=data, headers={"User-Agent": ua, **(hdr or {})}), timeout=timeout) as r:
        return r.read().decode("utf-8", "replace")


def decode(gurl):
    """Google News nuoroda -> tikras straipsnio adresas (viešas news.google.com „batchexecute“ kvietimas, be raktų); None, jei nepavyko."""
    aid = urllib.parse.urlparse(gurl).path.split("/")[-1]
    sg = ts = None
    for u in (f"https://news.google.com/rss/articles/{aid}", f"https://news.google.com/articles/{aid}"):
        try:
            h = get(u, ua=BUA, timeout=20)
        except Exception:
            continue
        sg, ts = re.search(r'data-n-a-sg="([^"]+)"', h), re.search(r'data-n-a-ts="([^"]+)"', h)
        if sg and ts:
            break
    if not sg or not ts:
        return None
    inner = f'["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"{aid}",{ts.group(1)},"{sg.group(1)}"]'
    body = urllib.parse.urlencode({"f.req": json.dumps([[["Fbv4je", inner, None, "generic"]]])}).encode()
    try:
        t = get("https://news.google.com/_/DotsSplashUi/data/batchexecute", body, {"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}, BUA, 20)
        u = json.loads(json.loads(t.split("\n\n", 1)[1])[0][2])[1]
        return u if u.startswith("http") else None
    except Exception:
        return None


def describe(url):
    """Straipsnio paties aprašas (og:description / description), be AI."""
    try:
        h = get(url, ua=BUA, timeout=20)[:400000]
    except Exception:
        return ""
    for rx in (r'<meta[^>]+(?:property|name)="(?:og:description|description|twitter:description)"[^>]+content="([^"]*)"',
               r'<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="(?:og:description|description|twitter:description)"'):
        m = re.search(rx, h, re.I)
        if m and len(clean(m.group(1))) > 30:
            return clean(m.group(1))[:600]
    return ""


def clean(s):
    s = re.sub(r"<!\[CDATA\[|\]\]>", "", s or "")
    s = html.unescape(html.unescape(re.sub(r"<[^>]+>", " ", s)))
    return re.sub(r"\s+", " ", s).strip()


def pdate(s):
    try:
        return parsedate_to_datetime(s).astimezone(timezone.utc).date().isoformat()
    except Exception:
        try:
            return datetime.fromisoformat(s.strip().replace("Z", "+00:00")).date().isoformat()
        except Exception:
            return TODAY


def items(x):
    out = []
    for it in re.findall(r"<item\b.*?</item>", x, re.S):
        g = lambda t: (re.search(rf"<{t}\b[^>]*>(.*?)</{t}>", it, re.S) or [None, ""])[1]
        src = clean(g("source"))
        out.append({"title": clean(g("title")), "summary": clean(g("description")), "url": clean(g("link")), "date": pdate(clean(g("pubDate"))), "source": src})
    return out


def norm(t):
    return re.sub(r"\W+", " ", t.lower()).strip()


def topics(text):
    ts = [k for k, rx in TOPICS if re.search(rx, text, re.I)]
    ts += [m for m in MGRS if re.search(rf"\b{re.escape(m)}\b", text)]
    return ";".join(ts)


def row(country, lang, source, it, via):
    title, summary = it["title"], it["summary"]
    if via == "gn":                       # Google News: „Antraštė - Leidinys“, aprašas – tik antraštė
        source = it["source"] or (title.rsplit(" - ", 1)[1] if " - " in title else "")
        if source and title.endswith(" - " + source):
            title = title[: -len(source) - 3]
        summary = ""
    summary = summary[:600]
    return {"id": hashlib.sha1(norm(title).encode()).hexdigest()[:12], "date": it["date"], "country": country, "lang": lang, "source": source,
            "title": title, "summary": summary, "url": it["url"], "topics": topics(title + " " + summary), "via": via, "first_seen": TODAY}


def gn(country, q, extra=""):
    hl = GN[country][0]
    u = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": q + extra, "hl": hl, "gl": country, "ceid": f"{country}:{hl}"})
    return [row(country, hl, "", it, "gn") for it in items(get(u))]


def load():
    old = {}
    path = OUT / "news.csv"
    if path.exists():
        for r in csv.DictReader(path.open(encoding="utf-8")):
            old[r["id"]] = r
    return old


def save(old):
    with (OUT / "news.csv").open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, FIELDS)
        w.writeheader()
        for r in sorted(old.values(), key=lambda r: (r["date"], r["id"]), reverse=True):
            w.writerow({f: r.get(f, "") for f in FIELDS})


def enrich(old, budget):
    """Tušti laukai: article_url (tikras adresas; „-“ – nepavyko) ir summary (straipsnio aprašas). Naujausi pirmi, iki `budget` sekundžių."""
    t0, n, ok = time.time(), 0, 0
    for r in sorted(old.values(), key=lambda r: r["date"], reverse=True):
        if time.time() - t0 > budget:
            break
        if r.get("article_url"):
            continue
        u = r["url"] if "news.google.com" not in r["url"] else decode(r["url"])
        n += 1
        r["article_url"] = u or "-"
        if u and not r["summary"]:
            d = describe(u)
            if d and norm(d) != norm(r["title"]):
                r["summary"] = d; ok += 1
                r["topics"] = topics(r["title"] + " " + d)
        time.sleep(0.8)
    left = sum(1 for r in old.values() if not r.get("article_url"))
    print(f"aprašai: bandyta {n}, papildyta {ok}, liko nebandytų {left}")


def merge(rows, budget=0):
    old = load()
    add = fill = 0
    for r in rows:
        if not r["title"] or not (r.get("org") or KEY.search(r["title"] + " " + r["summary"])):
            continue
        o = old.get(r["id"])
        if not o:
            old[r["id"]] = r
            add += 1
            continue
        if o["via"] == "gn" and r["via"] == "rss":           # tiesioginė nuoroda ir aprašas vietoje Google nuorodos (tušti laukai / tik nuoroda)
            if not o["summary"] and r["summary"]:
                o["summary"] = r["summary"]; fill += 1
            if "news.google.com" in o["url"]:
                o["url"] = r["url"]; o["via"] = "rss"
            o["topics"] = topics(o["title"] + " " + o["summary"])
    for r in old.values():
        r.pop("org", None)
    print(f"news.csv: +{add} naujų, papildyta {fill}, iš viso {len(old)}")
    if budget:
        enrich(old, budget)
    save(old)


def daily():
    rows = []
    for c, (hl, qs) in GN.items():
        for q in qs:
            try:
                rows += gn(c, q, " when:30d")
            except Exception as e:
                print("GN klaida", c, e)
            time.sleep(1)
    for c, lang, src, u in FEEDS:
        try:
            rows += [row(c, lang, src, it, "rss") for it in items(get(u))]
        except Exception as e:
            print("RSS klaida", src, u, e)
        time.sleep(0.5)
    for c, lang, src, u in ORG_FEEDS:
        try:
            rows += [dict(row(c, lang, src, it, "rss"), org=1) for it in items(get(u))]
        except Exception as e:
            print("RSS klaida", src, u, e)
    rows.sort(key=lambda r: r["via"] != "gn")                 # pirma Google, tada tiesioginiai – kad tiesioginiai papildytų
    merge(rows, 150)


def backfill(start):
    y, m = int(start[:4]), int(start[5:7])
    rows = []
    while f"{y}-{m:02d}" <= TODAY[:7]:
        ny, nm = (y + (m == 12), m % 12 + 1)
        extra = f" after:{y}-{m:02d}-01 before:{ny}-{nm:02d}-01"
        for c, (hl, qs) in ({} if "--extra-only" in sys.argv else GN).items():   # --extra-only – tik papildomos užklausos
            for q in qs:
                try:
                    rows += gn(c, q, extra)
                except Exception as e:
                    print("GN klaida", c, y, m, e)
                time.sleep(1.2)
        if m % 3 == 1:                                            # papildomos temų ir veikėjų užklausos – ketvirčiui
            qy, qm = (y + (m + 3 > 12), (m + 2) % 12 + 1)
            for c, qs in BFQ.items():
                for q in qs:
                    try:
                        rows += gn(c, q, f" after:{y}-{m:02d}-01 before:{qy}-{qm:02d}-01")
                    except Exception as e:
                        print("GN klaida", c, y, m, e)
                    time.sleep(1.2)
        print(y, m, len(rows))
        y, m = ny, nm
    merge(rows)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    if "--enrich" in sys.argv:
        o = load(); enrich(o, int(sys.argv[sys.argv.index("--enrich") + 1])); save(o)
    elif "--backfill" in sys.argv:
        backfill(sys.argv[sys.argv.index("--backfill") + 1] if len(sys.argv) > sys.argv.index("--backfill") + 1 else "2019-01")
    else:
        daily()
