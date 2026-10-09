#!/usr/bin/env python3
"""
Pasaulio akcijų indeksai palyginimui su pensijų fondais: data/indexes.csv (date, index, value).

- MSCI_WORLD – MSCI World Net Return, EUR (išsivysčiusių šalių akcijos, dividendai reinvestuoti po mokesčių);
- MSCI_ACWI  – MSCI ACWI Net Return, EUR (viso pasaulio akcijos, ir besivystančios rinkos);
- SP500      – S&P 500 Total Return (USD, Yahoo ^SP500TR) ÷ ECB EUR/USD kursas = vertė eurais.

Indeksų vertės – be jokių mokesčių (fondų vieneto vertės jau po valdymo mokesčių).
Komandos:  python indexes.py update          – parsiunčia paskutines ~40 dienų ir prideda naujas dienas
           python indexes.py import <aplankas> – vienkartinis istorijos importas iš atsisiųstų failų
Istorija niekada netrinama ir neperrašoma; neįtikėtini šuoliai (> 25 % per dieną) atmetami.
"""
import csv
import io
import json
import sys
import time
import urllib.request
from datetime import date, timedelta
from pathlib import Path

import fund_links

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


def update():
    data = load()
    start = date.today() - timedelta(days=40)
    for name, code in MSCI.items():
        try:
            n = merge(data, name, parse_msci(_get(fund_links.MSCI_LEVELS_API.format(start=start.strftime("%Y%m%d"), end=date.today().strftime("%Y%m%d"), code=code))))
            print(f"{name}: +{n}")
        except Exception as e:  # noqa: BLE001  – vieno indekso klaida kitų nestabdo
            print(f"{name}: nepavyko ({e.__class__.__name__}: {e})")
    try:
        p1 = int(time.mktime(start.timetuple()))
        usd = parse_yahoo(_get(fund_links.YAHOO_CHART_API.format(symbol="%5ESP500TR", p1=p1, p2=int(time.time()) + 86400)))
        fx = parse_ecb(_get(fund_links.ECB_EURUSD_API.format(start=(start - timedelta(days=10)).isoformat())))
        print(f"SP500: +{merge(data, 'SP500', sp500_eur(usd, fx))}")
    except Exception as e:  # noqa: BLE001
        print(f"SP500: nepavyko ({e.__class__.__name__}: {e})")
    save(data)


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
