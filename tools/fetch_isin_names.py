#!/usr/bin/env python3
"""
Vertybinių popierių pavadinimai pagal ISIN iš nemokamo OpenFIGI katalogo (https://www.openfigi.com/api).

Lietuvos banko portfelių ataskaitose kai kurie valdytojai (pvz. Allianz) vietoj fondo pavadinimo
rašo tik valdymo bendrovę („Schroder Investment Management (Europe) S.A.“). Šis skriptas surenka
visų ISIN kodų iš data/portfolios.csv pavadinimus ir išsaugo juos data/isin_names.csv.

Klausiama tik apie dar nežinomus ISIN, todėl pakartotinis paleidimas trunka kelias sekundes.
Nerasti ISIN įrašomi su tuščiu pavadinimu, kad nebūtų klausiama kas kartą.
Rakto nereikia (be rakto: 10 ISIN vienoje užklausoje, 25 užklausos per minutę).

Naudojimas: python tools/fetch_isin_names.py [išvesties_failas]
"""
import csv
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "portfolios.csv"
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data" / "isin_names.csv"
API = "https://api.openfigi.com/v3/mapping"
BATCH, PAUSE = 10, 2.6            # 25 užklausos per minutę be rakto
ISIN = re.compile(r"^[A-Z]{2}[A-Z0-9]{9}\d$")
FIELDS = ["isin", "name", "ticker", "security_type"]


def load(path: Path) -> dict:
    if not path.exists():
        return {}
    with path.open(encoding="utf-8", newline="") as f:
        return {r["isin"]: r for r in csv.DictReader(f)}


def ask(isins: list) -> list:
    body = json.dumps([{"idType": "ID_ISIN", "idValue": i} for i in isins]).encode()
    req = urllib.request.Request(API, data=body, headers={"Content-Type": "application/json", "User-Agent": "pension-fund-tracker"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code == 429:                      # per daug užklausų – palaukti
                time.sleep(15 * (attempt + 1))
                continue
            raise
    raise RuntimeError("OpenFIGI: per daug užklausų")


def pick(items: list) -> dict:
    """Iš kelių biržų įrašų – pirmas su pavadinimu (pavadinimas visur tas pats)."""
    for d in items:
        if d.get("name"):
            return {"name": d["name"].strip(), "ticker": (d.get("ticker") or "").strip(),
                    "security_type": (d.get("securityType2") or d.get("securityType") or "").strip()}
    return {"name": "", "ticker": "", "security_type": ""}


def main() -> None:
    known = load(OUT)
    with SRC.open(encoding="utf-8", newline="") as f:
        isins = sorted({r["pos_id"] for r in csv.DictReader(f) if ISIN.match(r["pos_id"])})
    todo = [i for i in isins if i not in known]
    print(f"ISIN: {len(isins)}, jau žinomi: {len(isins) - len(todo)}, klausiama: {len(todo)}")
    found = 0
    for k in range(0, len(todo), BATCH):
        part = todo[k:k + BATCH]
        try:
            res = ask(part)
        except Exception as exc:                     # tinklo klaida – išsaugome, ką turime, ir baigiame
            print(f"OpenFIGI klaida ({exc.__class__.__name__}: {exc}); sustojama")
            break
        for isin, r in zip(part, res):
            row = {"isin": isin, **pick(r.get("data") or [])}
            known[isin] = row
            found += bool(row["name"])
        if (k // BATCH) % 10 == 0:
            print(f"  {k + len(part)}/{len(todo)}")
        time.sleep(PAUSE)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        for isin in sorted(known):
            w.writerow({k: known[isin].get(k, "") for k in FIELDS})
    print(f"Rasta pavadinimų: {found}; iš viso faile: {len(known)} -> {OUT}")


if __name__ == "__main__":
    main()
