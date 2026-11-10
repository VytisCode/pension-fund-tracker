"""Patikra 9: kolegės (BC) atsakymas 2026-11-10.

LV: VSAA mėnesinė „Dalībnieku kustība pa ieguldījumu plāniem atskaites periodā“ – failų sąrašas, formatas, lapų turinys.
EE: pensionikeskus III pakopos dienos statistika – stulpelis „Unit ow.“ (vienetų savininkai) ir ar yra jo istorija.
Nieko neįrašo į data/; rezultatai – probe_out/ (šaka probe-results).
"""
import re, time, urllib.parse, urllib.request
from io import BytesIO
from pathlib import Path

out = Path("probe_out"); out.mkdir(exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"}
LOG = []


def log(*a):
    s = " ".join(str(x) for x in a); print(s); LOG.append(s)


def get(u):
    try:
        with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=90) as r:
            return r.status, r.headers.get("Content-Type", ""), r.read()
    except urllib.error.HTTPError as e:
        return e.code, "", b""
    except Exception as e:
        return 0, str(e)[:100], b""


def dump_xlsx(b, name, rows=40):
    import openpyxl
    wb = openpyxl.load_workbook(BytesIO(b), data_only=True)
    for ws in wb.worksheets:
        log(f"   sheet {ws.title!r} {ws.max_row}x{ws.max_column}")
        for i, r in enumerate(ws.iter_rows(values_only=True)):
            if i >= rows:
                break
            if any(c is not None for c in r):
                log("     ", " | ".join("" if c is None else str(c)[:40] for c in r[:20]))


# ---- LV VSAA
P = "https://www.vsaa.gov.lv/lv/dalibnieku-kustiba-pa-ieguldijumu-planiem-atskaites-perioda"
st, ct, b = get(P); h = b.decode("utf-8", "replace")
(out / "vsaa_kustiba.html").write_text(h, encoding="utf-8")
log("== VSAA", st, len(h))
main = re.search(r"<main.*?</main>", h, re.S)
log("   text:", re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", main.group(0) if main else h))[:3000])
links = [(urllib.parse.urljoin(P, a), re.sub(r"<[^>]+>|\s+", " ", t).strip())
         for a, t in re.findall(r'<a[^>]+href="([^"]*(?:media/\d+|\.xlsx?|\.csv|\.pdf|download)[^"]*)"[^>]*>(.*?)</a>', h, re.S)]
log("   files", len(links))
for u, t in links:
    log("   FILE", u, "|", t[:150])
pick = links[:2] + links[-1:] if len(links) > 3 else links
for i, (u, t) in enumerate(pick):
    st, ct, b = get(u)
    kind = "xlsx" if b[:2] == b"PK" else "pdf" if b[:4] == b"%PDF" else "xls" if b[:4] == b"\xd0\xcf\x11\xe0" else "bin"
    (out / f"vsaa_kust_{i}.{kind}").write_bytes(b)
    log(f"== GOT {st} {ct} {len(b)} {kind} {u} | {t[:80]}")
    if kind == "xlsx":
        try:
            dump_xlsx(b, t)
        except Exception as e:
            log("   xlsx err", e)
    time.sleep(1)

# ---- EE III
EE = "https://www.pensionikeskus.ee/en/statistics/"
st, ct, b = get(EE + "iii-pillar/suppl-funded-pension-daily-statistics/?download=xls")
t = b.decode("utf-16", "replace") if b[:2] in (b"\xff\xfe", b"\xfe\xff") else b.decode("utf-8", "replace")
log("== EE III daily xls", st, len(b))
for l in t.splitlines()[:6]:
    log("   ", l[:400])
for page in ("iii-pillar/suppl-funded-pension-daily-statistics/", "iii-pillar/", "ii-pillar/funded-pension-daily-statistics/"):
    st, ct, b = get(EE + page); h = b.decode("utf-8", "replace")
    (out / ("ee_" + re.sub(r"\W+", "_", page) + ".html")).write_text(h, encoding="utf-8")
    log("== EE page", st, len(h), page)
    for l in sorted(set(re.findall(r'href="(/en/statistics/[^"]+)"', h))):
        log("   menu", l)
    for m in sorted(set(re.findall(r"[^<>]{0,60}(?:unit.?ow|owners|unit-hold|osakuomanik)[^<>]{0,60}", h, re.I)))[:30]:
        log("   kw", m.strip())
# kandidatai istorijai
for c in ("iii-pillar/number-of-unit-owners/", "iii-pillar/unit-owners/", "iii-pillar/number-of-unit-holders/",
          "iii-pillar/active-investors/", "iii-pillar/investors/"):
    st, ct, b = get(EE + c + "?download=xls&date_from=2026-10-01&date_to=2026-11-09")
    log("== cand", st, len(b), c, (b.decode("utf-16", "replace") if b[:2] == b"\xff\xfe" else b.decode("utf-8", "replace"))[:300].replace("\n", " | "))

(out / "baltic9.txt").write_text("\n".join(LOG), encoding="utf-8")
