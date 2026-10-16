#!/usr/bin/env python3
"""
Pasaulio akcijų indeksai palyginimui su pensijų fondais: data/indexes.csv (date, index, value).

- MSCI_WORLD – MSCI World Net Return, EUR (išsivysčiusių šalių akcijos, dividendai reinvestuoti po mokesčių);
- MSCI_ACWI  – MSCI ACWI Net Return, EUR (viso pasaulio akcijos, ir besivystančios rinkos);
- SP500      – S&P 500 Total Return (USD, Yahoo ^SP500TR) ÷ ECB EUR/USD kursas = vertė eurais.
- SP500_PR   – S&P 500 kainų indeksas (USD, FRED; atsargai Stooq) – tik atsarginis: kai Yahoo neveikia, svetainė
               SP500 pratęsia pagal jo pokytį + dividendų priedą (build_site.sp500_tail); tikros vertės vėliau jas pakeičia.
- EURUSD     – ECB EUR/USD kursas (saugomas, kad atsarginį S&P 500 būtų galima perskaičiuoti eurais).
- EUR_AAA_7Y – euro zonos AAA vyriausybės obligacijų 7 m. spot pajamingumas, % (ECB pajamingumo kreivė; gali būti neigiamas);
- EUR_GOV7Y  – sintetinis obligacijų grąžos indeksas iš EUR_AAA_7Y: pastovios 7 m. trukmės nulinės atkarpos obligacija,
               dienos log grąža = y(t−1) × dienos ÷ 365 − 7 × (y(t) − y(t−1)) (pajamingumas % ÷ 100). Naudojamas KID scenarijams.

Indeksų vertės – be jokių mokesčių (fondų vieneto vertės jau po valdymo mokesčių).
Komandos:  python indexes.py update          – parsiunčia paskutines ~40 dienų ir prideda naujas dienas
           python indexes.py import <aplankas> – vienkartinis istorijos importas iš atsisiųstų failų
Istorija niekada netrinama ir neperrašoma; neįtikėtini šuoliai (> 25 % per dieną) atmetami.
"""
import csv
import io
import json
import math
import re
import sys
import time
import urllib.request
from datetime import date, timedelta
from pathlib import Path

import fund_links
import source_status

ROOT = Path(__file__).parent
STORE = ROOT / "data" / "indexes.csv"
MSCI = {"MSCI_WORLD": "990100", "MSCI_ACWI": "892400"}
UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}


def _get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def parse_msci(raw):
    d = json.loads(raw)
    return {f"{str(x['calc_date'])[:4]}-{str(x['calc_date'])[4:6]}-{str(x['calc_date'])[6:]}": float(x["level_eod"]) for x in d["indexes"]["INDEX_LEVELS"]}


def parse_yahoo(raw):
    r = json.loads(raw)["chart"]["result"][0]
    out = {}
    for ts, c in zip(r["timestamp"], r["indicators"]["quote"][0]["close"]):
        if c:
            out[time.strftime("%Y-%m-%d", time.gmtime(ts + r["meta"].get("gmtoffset", 0)))] = float(c)
    return out


def parse_ecb(raw):
    return {row["TIME_PERIOD"]: float(row["OBS_VALUE"]) for row in csv.DictReader(io.StringIO(raw.decode("utf-8"))) if row.get("OBS_VALUE")}


def sp500_eur(usd, eurusd):
    """S&P 500 TR eurais: kiekvienai prekybos dienai – tos dienos (ar paskutinis žinomas) ECB kursas."""
    out, rate, days = {}, None, sorted(set(usd) | set(eurusd))
    for d in days:
        rate = eurusd.get(d, rate)
        if d in usd and rate:
            out[d] = usd[d] / rate
    return out


def load():
    if not STORE.exists():
        return {}
    data = {}
    with STORE.open(encoding="utf-8", newline="") as f:
        for r in csv.DictReader(f):
            data.setdefault(r["index"], {})[r["date"]] = float(r["value"])
    return data


def merge(data, name, new):
    """Prideda tik naujas dienas (seni įrašai neperrašomi); atmeta neįtikėtinus šuolius."""
    cur, added = data.setdefault(name, {}), 0
    for d in sorted(new):
        if d in cur or new[d] <= 0:
            continue
        prev = [k for k in cur if k < d]
        if prev:
            p = cur[max(prev)]
            if abs(new[d] / p - 1) > 0.25:
                print(f"{name} {d}: neįtikėtinas pokytis {new[d]:.2f} vs {p:.2f} – praleidžiama")
                continue
        cur[d] = new[d]
        added += 1
    return added


def save(data):
    STORE.parent.mkdir(exist_ok=True)
    with STORE.open("w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["date", "index", "value"])
        for name in sorted(data):
            for d in sorted(data[name]):
                w.writerow([d, name, f"{data[name][d]:.4f}"])


def sp500_usd(start):
    """S&P 500 TR (USD) iš Yahoo: pirma query1, nepavykus – atsarginis query2 (Yahoo dažnai riboja vieną iš jų),
    kiekvienas po 2 bandymus. Grąžina {data: vertė}; jei visi nepavyko – paskutinė klaida."""
    p1, p2 = int(time.mktime(start.timetuple())), int(time.time()) + 86400
    last = None
    for host in ("query1", "query2"):
        url = fund_links.YAHOO_CHART_API.replace("query1", host).format(symbol="%5ESP500TR", p1=p1, p2=p2)
        for attempt in range(2):
            try:
                out = parse_yahoo(_get(url))
                if out:
                    if host != "query1":
                        print(f"SP500: naudotas atsarginis Yahoo {host}")
                    return out
                last = ValueError("tuščias atsakymas")
            except Exception as e:  # noqa: BLE001
                last = e
            time.sleep(5 * (attempt + 1))
    raise last


def parse_fred(raw):
    out = {}
    for r in csv.reader(io.StringIO(raw.decode("utf-8"))):
        if len(r) >= 2 and re.match(r"\d{4}-\d\d-\d\d$", r[0]) and re.match(r"^\d+(\.\d+)?$", r[1]):
            out[r[0]] = float(r[1])
    return out


def parse_stooq(raw):
    out = {}
    for r in csv.DictReader(io.StringIO(raw.decode("utf-8"))):
        if r.get("Date") and r.get("Close"):
            try:
                out[r["Date"]] = float(r["Close"])
            except ValueError:
                pass
    return out


def sp500_price(start):
    """S&P 500 kainų indeksas (USD): FRED, nepavykus – Stooq. Grąžina ({data: vertė}, šaltinio pavadinimas)."""
    last = None
    for name, url, parse in (("FRED", fund_links.FRED_SP500_CSV.format(start=start.isoformat()), parse_fred),
                             ("Stooq", fund_links.STOOQ_SPX_CSV.format(start=start.strftime("%Y%m%d")), parse_stooq)):
        try:
            out = parse(_get(url))
            if len(out) >= 3:
                return out, name
            last = ValueError(f"{name}: per mažai reikšmių")
        except Exception as e:  # noqa: BLE001
            last = e
    raise last


def update():
    data = load()
    start = date.today() - timedelta(days=40)
    for name, code in MSCI.items():
        try:
            n = merge(data, name, parse_msci(_get(fund_links.MSCI_LEVELS_API.format(start=start.strftime("%Y%m%d"), end=date.today().strftime("%Y%m%d"), code=code))))
            print(f"{name}: +{n}")
            source_status.ok(f"idx.{name}")
        except Exception as e:  # noqa: BLE001  – vieno indekso klaida kitų nestabdo
            print(f"{name}: nepavyko ({e.__class__.__name__}: {e})")
            source_status.fail(f"idx.{name}", e)
    fx = {}
    try:
        fx = parse_ecb(_get(fund_links.ECB_EURUSD_API.format(start=(start - timedelta(days=10)).isoformat())))
        print(f"EURUSD: +{merge(data, 'EURUSD', fx)}")
        source_status.ok("idx.EURUSD")
    except Exception as e:  # noqa: BLE001
        print(f"EURUSD: nepavyko ({e.__class__.__name__}: {e})")
        source_status.fail("idx.EURUSD", e)
    try:
        usd = sp500_usd(start)
        if not fx:
            raise RuntimeError("nėra ECB EUR/USD kurso")
        print(f"SP500: +{merge(data, 'SP500', sp500_eur(usd, fx))}")
        source_status.ok("idx.SP500")
    except Exception as e:  # noqa: BLE001
        print(f"SP500: nepavyko ({e.__class__.__name__}: {e})")
        source_status.fail("idx.SP500", e)
    try:                                   # atsarginis kainų indeksas renkamas visada (mažas), kad būtų kuo pratęsti
        pr, src = sp500_price(start - timedelta(days=10))
        print(f"SP500_PR ({src}): +{merge(data, 'SP500_PR', pr)}")
        source_status.ok("idx.SP500_PR", src)
    except Exception as e:  # noqa: BLE001
        print(f"SP500_PR: nepavyko ({e.__class__.__name__}: {e})")
        source_status.fail("idx.SP500_PR", e)
    try:
        print(f"EUR_GOV7Y: +{update_bond(data)}")
        source_status.ok("idx.EUR_GOV7Y")
    except Exception as e:  # noqa: BLE001
        print(f"EUR_GOV7Y: nepavyko ({e.__class__.__name__}: {e})")
        source_status.fail("idx.EUR_GOV7Y", e)
    save(data)


def update_bond(data):
    """ECB 7 m. pajamingumas -> EUR_AAA_7Y (žalios reikšmės, ir neigiamos) ir sintetinis EUR_GOV7Y (pradžia 100).
    Pirmą kartą parsiunčiama visa istorija nuo 2004-09; vėliau – paskutinės 40 dienų. Seni įrašai neperrašomi."""
    ys = data.setdefault("EUR_AAA_7Y", {})
    start = (date.today() - timedelta(days=40)).isoformat() if ys else "2004-09-01"
    for d, v in parse_ecb(_get(fund_links.ECB_YC7_API.format(start=start))).items():
        if d not in ys and -5 < v < 20:
            ys[d] = v
    tr, days = data.setdefault("EUR_GOV7Y", {}), sorted(ys)
    if not days:
        return 0
    if not tr:
        tr[days[0]] = 100.0
    last = max(tr)
    added, lvl, prev = 0, tr[last], last
    for d in days:
        if d <= last:
            continue
        dt_ = (date.fromisoformat(d) - date.fromisoformat(prev)).days / 365
        lvl *= math.exp(ys[prev] / 100 * dt_ - 7 * (ys[d] - ys[prev]) / 100)
        tr[d], prev, added = lvl, d, added + 1
    return added


def import_dir(folder):
    p = Path(folder)
    data = load()
    for name, fn in [("MSCI_WORLD", "msci_world_NETR_EUR.json"), ("MSCI_ACWI", "msci_acwi_NETR_EUR.json")]:
        print(name, merge(data, name, parse_msci((p / fn).read_bytes())))
    print("SP500", merge(data, "SP500", sp500_eur(parse_yahoo((p / "yahoo_SP500TR.json").read_bytes()), parse_ecb((p / "ecb_eurusd.csv").read_bytes()))))
    save(data)


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else "update"
    if cmd == "import":
        import_dir(sys.argv[2])
    else:
        update()
