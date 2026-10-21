"""Estijos ir Latvijos vidutinis darbo užmokestis ir vidutinė senatvės pensija -> data/baltic_macro.csv (tik papildomas).

Reikalinga Baltijos „Kelias į pensiją“ skaičiavimui (savininkas 2026-10-21: „net ir Estišką; Latvišką kelią į pensiją“).
Šaltiniai – oficialių statistikos tarnybų PxWeb API (be rakto):
  EE – Statistikaamet: vidutinis bruto darbo užmokestis (ketvirčiai, PA001) ir SK153 vidutinė senatvės pensija (ketvirčiai);
  LV – Centrālā statistikas pārvalde: DSV010m vidutinis bruto ir neto darbo užmokestis (mėnesiai), PPP040 vidutinė senatvės pensija (metai).
Eilutės: geo, series (wage_gross, wage_net, pension), period (YYYY-MM, YYYY-Qn arba YYYY), value (EUR/mėn.), first_seen.
Naudojimas: python tools/fetch_baltic_macro.py [aplankas]
"""
import csv
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

args = [a for a in sys.argv[1:] if not a.startswith("--")]
OUT = Path(args[0]) if args else Path(__file__).resolve().parent.parent / "data"
EE = "https://andmed.stat.ee/api/v1/en/stat"
LV = "https://data.stat.gov.lv/api/v1/en/OSP_PUB"
FIELDS = ["geo", "series", "period", "value", "first_seen"]


def http(u, body=None):
    u = urllib.parse.quote(u, safe=":/?=&.%-_")
    for i in range(3):
        try:
            req = urllib.request.Request(u, data=json.dumps(body).encode() if body else None,
                                         headers={"User-Agent": "pension-fund-tracker", "Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode("utf-8-sig"))
        except Exception as e:
            err = e
            time.sleep(3 * (i + 1))
    raise err


def find(base, path, test, depth=0, budget=None):
    """PxWeb medis: pirmos lentelės, kurios pavadinimas tenkina test(), kelias"""
    budget = budget if budget is not None else [250]
    if depth > 6 or budget[0] <= 0:
        return None
    budget[0] -= 1
    try:
        items = http(f"{base}/{path}")
    except Exception:
        return None
    for it in items:
        if it.get("type") == "t" and test(it.get("text", "")):
            return f"{path}/{it['id']}"
    for it in items:
        if it.get("type") == "l":
            r = find(base, f"{path}/{it['id']}", test, depth + 1, budget)
            if r:
                return r
    return None


def query(url, pick):
    """pick: {kintamojo tekstas (mažosiomis, dalis) -> funkcija(reikšmės tekstas) -> bool}; laiko kintamasis – visos reikšmės"""
    meta = http(url)
    sel = []
    for v in meta["variables"]:
        name = v["text"].lower()
        if v.get("time") or name in ("year", "time period", "reference period", "quarter", "aasta", "kvartal") or v["code"].upper() in ("TIME", "AASTA", "KVARTAL", "VAATLUSPERIOOD"):
            vals = v["values"]
        else:
            f = next((fn for k, fn in pick.items() if k in name), None)
            vals = [x for x, t in zip(v["values"], v["valueTexts"]) if f and f(t.lower())][:1] or v["values"][:1]
        sel.append({"code": v["code"], "selection": {"filter": "item", "values": vals}})
    res = http(url, {"query": sel, "response": {"format": "json"}})
    cols = [c["code"] for c in res["columns"]]
    return cols, res["data"], meta


def num(x):
    try:
        v = float(str(x).replace(",", "."))
        return v if v > 0 else None
    except ValueError:
        return None


def ee_rows():
    out = []
    # Statistikaamet: majandus/palk-ja-toojeukulu/palk/luhiajastatistika – ketvirčių lentelės (EMTAK 2008 nuo 2008 m., senesnės – EMTAK 2003)
    test = lambda t: "MONTHLY GROSS WAGES" in t.upper() and "QUARTER" in t.upper() and not any(x in t.upper() for x in ("COUNTY", "SEX", "OCCUPATION", "OWNER", "SIZE", "CHANGE"))
    base = "majandus/palk-ja-toojeukulu/palk/luhiajastatistika"
    paths = []
    try:
        for it in http(f"{EE}/{base}"):
            if it.get("type") == "t" and test(it.get("text", "")):
                paths.append(f"{base}/{it['id']}")
            elif it.get("type") == "l":
                paths += [f"{base}/{it['id']}/{x['id']}" for x in http(f"{EE}/{base}/{it['id']}") if x.get("type") == "t" and test(x.get("text", ""))]
    except Exception as e:
        print("EE atlyginimų sąrašas nepasiekiamas:", e)
    if not paths:
        p = find(EE, "majandus/palk-ja-toojeukulu", test)
        paths = [p] if p else []
    # istorija iki 2021 m. (senesnė metodika – įmonių apklausa): archyvas „Lepetatud_tabelid“, PA001 (iki 2022) ir PA11 (2000–2008)
    arch = "Lepetatud_tabelid/Majandus. Arhiiv/Palk ja toojeukulu. Arhiiv"
    paths += [f"{arch}/PA011.PX", f"{arch}/PA001.PX", f"{arch}/PA11.PX"]   # PA003 netinka – tik viešasis sektorius (sluoksnis „Kiht“)
    for p in paths:
        try:
            cols, data, meta = query(f"{EE}/{p}", {"indicator": lambda t: ("average monthly gross wages" in t or t.startswith("average gross wages")) and "hour" not in t and "change" not in t,
                                                 "näitaja": lambda t: ("average monthly gross wages" in t or t.startswith("average gross wages")) and "hour" not in t and "change" not in t,
                                                 "economic activity": lambda t: t.startswith("total"), "tegevusala": lambda t: t.startswith("total"),
                                                 "section": lambda t: t.startswith("total")})
        except Exception as e:
            print("EE", p, "nepavyko:", e)
            with (OUT / "baltic_macro.log").open("a", encoding="utf-8") as lg:
                lg.write(f"EE {p}: {e}\n")
            continue
        print("EE darbo užmokestis:", p, meta.get("title"), len(data))
        if OUT.name == "probe_out":                     # patikros paleidimas – kintamieji į žurnalą
            with (OUT / "baltic_macro.log").open("a", encoding="utf-8") as lg:
                lg.write(f"EE {p}: {meta.get('title')} rows={len(data)} vars={[(v['code'], v['valueTexts'][:4]) for v in meta['variables']]}\n")
        for r in data:
            k = dict(zip(cols, r["key"])); y = next((v for v in k.values() if re.fullmatch(r"\d{4}", v)), None)
            q = next((v for v in k.values() if v in ("I", "II", "III", "IV")), None)
            if not q:                                   # kai kuriose lentelėse laikas – „2024Q1“ / „2024K1“
                m = next((re.fullmatch(r"(\d{4})\s*[QK]([1-4])", v) for v in k.values() if re.fullmatch(r"(\d{4})\s*[QK]([1-4])", v)), None)
                if m:
                    y, q = m.group(1), ["I", "II", "III", "IV"][int(m.group(2)) - 1]
            v = num(r["values"][0])
            if v and y and int(y) < 2011 and v > 4000:     # kronos (iki 2011 m.) → eurai
                v = v / 15.6466
            if y and q and v:
                out.append(("EE", "wage_gross", f"{y}-Q{['I', 'II', 'III', 'IV'].index(q) + 1}", v))
    if not paths:
        print("EE darbo užmokesčio lentelė nerasta")
    cols, data, meta = query(f"{EE}/sotsiaalelu/sotsiaalne-kaitse/sotsiaalkindlustus/pensionikindlustus/SK153.PX",
                             {"type of pension": lambda t: "old-age" in t})
    for r in data:
        k = r["key"]; v = num(r["values"][0])
        y = next((x for x in k if re.fullmatch(r"\d{4}", x)), None); q = next((x for x in k if x in ("I", "II", "III", "IV")), None)
        if y and q and v:
            out.append(("EE", "pension", f"{y}-Q{['I', 'II', 'III', 'IV'].index(q) + 1}", v))
    return out


def lv_rows():
    out = []
    for gn, ser in (("gross", "wage_gross"), ("net", "wage_net")):
        cols, data, _ = query(f"{LV}/EMP/DS/DSV/DSV010m", {"gross/ net": lambda t, gn=gn: t == gn, "sector": lambda t: t == "total", "indicator": lambda t: t == "euro"})
        for r in data:
            per = next((x for x in r["key"] if re.fullmatch(r"\d{4}M\d\d", x)), None); v = num(r["values"][0])
            if per and v:
                out.append(("LV", ser, per.replace("M", "-"), v))
    cols, data, _ = query(f"{LV}/VES/PP/PPP/PPP040", {"sex": lambda t: t == "total", "type of pension": lambda t: t == "old-age pension"})
    for r in data:
        y = next((x for x in r["key"] if re.fullmatch(r"\d{4}", x)), None); v = num(r["values"][0])
        if y and v:
            out.append(("LV", "pension", y, v))
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "baltic_macro.csv"
    old = {}
    if path.exists():
        for r in csv.DictReader(path.open(encoding="utf-8")):
            old[(r["geo"], r["series"], r["period"])] = r
    add = 0
    for fn in (ee_rows, lv_rows):
        try:
            rows = fn()
        except Exception as e:
            print(fn.__name__, "nepavyko:", e); continue
        for g, s, p, v in rows:
            if (g, s, p) not in old and 20 < v < 20000:
                old[(g, s, p)] = {"geo": g, "series": s, "period": p, "value": round(v, 2), "first_seen": date.today().isoformat()}
                add += 1
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, FIELDS); w.writeheader()
        for k in sorted(old):
            w.writerow(old[k])
    last = {}
    for g, s, p in old:
        last[(g, s)] = max(last.get((g, s), ""), p)
    print(f"baltic_macro.csv: +{add}, iš viso {len(old)}; paskutiniai: {last}")


if __name__ == "__main__":
    main()
