"""Patikra: manapensija.lv plānų lapų, rezultātu ir komisijas maksu lapų __NUXT_DATA__ blokai (kokie laukai yra: aktīvi, dalībnieki,
portfelis), pensionikeskus.ee statistikos meniu (pakartotinai, lėčiau) – rezultatai probe_out/."""
import json
import re
import time
import urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (pension-fund-tracker; public pension statistics)"
out = Path("probe_out")
out.mkdir(exist_ok=True)
log = []


def get(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"}), timeout=60) as r:
                b = r.read()
                log.append(f"{r.status} {len(b)} {url}")
                return b.decode("utf-8", "replace")
        except Exception as e:
            log.append(f"ERR {e} {url}")
            time.sleep(10 * (i + 1))
    return ""


def nuxt(html):
    m = re.search(r'<script[^>]*id="__NUXT_DATA__"[^>]*>(.*?)</script>', html, re.S)
    a = json.loads(m.group(1)) if m else []

    def res(x, d=0):
        x = a[x] if isinstance(x, int) and 0 <= x < len(a) else x
        if d > 7:
            return "…"
        if isinstance(x, dict):
            return {k: res(v, d + 1) for k, v in x.items()}
        if isinstance(x, list):
            return [res(v, d + 1) for v in x[:4]]
        return x
    return [res(i) for i, x in enumerate(a) if isinstance(x, dict) and isinstance(x.get("type"), str)]


LV = "https://www.manapensija.lv"
pages = ["/seb-indeksu-plans-15-54", "/swedbank-pensiju-plans-dinamika-18-49", "/indexo-plans-jauda-16-55", "/c-akciju-indeksu-pensiju-plans-18-45",
         "/swedbank-privatais-portfelis-pieauguma-strategija", "/pensiju-2-limena-planu-rezultati", "/pensiju-2-limena-planu-komisijas-maksas",
         "/pensiju-3-limena-planu-rezultati", "/pensiju-2-limena-planu-rezultatu-dinamika", "/pensiju-2-limenis", "/pensiju-sistema"]
dump = {}
for p in pages:
    h = get(LV + p)
    bl = nuxt(h)
    dump[p] = [{"type": b.get("type"), "data_endpoint": b.get("data_endpoint"), "keys": sorted(b), "sample": json.dumps(b, ensure_ascii=False)[:2500]} for b in bl]
    txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"<script.*?</script>|<style.*?</style>", " ", h, flags=re.S)))
    dump[p].append({"text": txt[:3000]})
    time.sleep(1)
(out / "lv_pages.json").write_text(json.dumps(dump, ensure_ascii=False, indent=1), encoding="utf-8")

EE = "https://www.pensionikeskus.ee"
ee = {}
for p in ["/en/statistics/", "/en/statistics/ii-pillar/", "/en/ii-pillar/payments/", "/statistika/", "/statistika/ii-sammas/"]:
    h = get(EE + p)
    links = sorted(set(re.findall(r'href="(/[^"#?]*statist[^"#?]*)"', h)))
    txt = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"<script.*?</script>|<style.*?</style>", " ", h, flags=re.S)))
    ee[p] = {"links": links, "text": txt[:4000]}
    time.sleep(5)
(out / "ee_pages.json").write_text(json.dumps(ee, ensure_ascii=False, indent=1), encoding="utf-8")
(out / "summary.txt").write_text("\n".join(log), encoding="utf-8")
print("\n".join(log))
