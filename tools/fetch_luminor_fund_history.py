#!/usr/bin/env python3
"""
Luminor fondo vieneto verčių istorija iš rinkis-fonda puslapio payload'o (fundRatesHistory).
Naudoja esamo Luminor skaitytuvo curl + proxy kelią. Fondų ID nurodomi argumentais
(numatyta: 24 = Luminor ateitis akcijų index). Rezultatas: probe_out/Luminor_<id>.csv.
Paleidimas per „Probe III pillar sources“ su script=fetch_luminor_fund_history.py.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import sources.luminor_pensions as lp  # noqa: E402

OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
FROM, TO = "2000-01-01", "2030-12-31"


def log(text):
    print(text)
    with open(OUT / "luminor_history_log.txt", "a", encoding="utf-8") as f:
        f.write(text + "\n")


class HistoryScraper(lp.LuminorPensionsScraper):
    def build_url(self, base_url, fund_id):
        return (f"{base_url}?fund_type=pension&fund={fund_id}&currency=eur"
                f"&period=custom&from={FROM}&to={TO}")


def main():
    ids = sys.argv[1:] or ["24"]
    s = HistoryScraper()
    for fund_id in ids:
        payload = {}
        for use_proxy in (False, True):
            for attempt in range(3):
                try:
                    payload = s.fetch_payload_via_curl(fund_id, use_proxy=use_proxy)
                    if payload:
                        break
                except Exception as exc:
                    log(f"fund {fund_id} proxy={use_proxy} attempt {attempt + 1}: {exc}")
            if payload:
                break
        if not payload:
            log(f"fund {fund_id}: no payload")
            continue
        rates = payload.get("fundRates") or {}
        name = rates.get("name_alias_lt") or rates.get("name_lt") or rates.get("name") or fund_id
        hist = payload.get("fundRatesHistory") or {}
        sample = list(hist.items())[:2]
        log(f"fund {fund_id} '{name}': keys={list(payload.keys())} history entries={len(hist)} sample={json.dumps(sample, ensure_ascii=False)[:400]}")
        rows = []
        for day, val in sorted(hist.items()):
            if isinstance(val, dict):
                val = val.get("unit_price_eur") or val.get("unit_price") or val.get("value") or val.get("price")
            rows.append((day, val))
        with open(OUT / f"Luminor_{fund_id}.csv", "w", encoding="utf-8") as f:
            f.write(f"Date,{name}\n")
            for d, v in rows:
                f.write(f"{d},{v}\n")
        if rows:
            log(f"  {len(rows)} rows {rows[0]} .. {rows[-1]}")
        (OUT / f"Luminor_{fund_id}_payload.json").write_text(json.dumps(payload, ensure_ascii=False)[:200000], encoding="utf-8")


if __name__ == "__main__":
    main()
