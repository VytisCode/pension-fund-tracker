#!/usr/bin/env python3
"""Luminor patikra: kokią datą rodo pensiju-fondai lentelė ir rinkis-fonda puslapiai (per proxy ir tiesiogiai).
Paleidžiama per „Probe III pillar sources“ (script=probe_luminor.py); rezultatai – probe_out/ → šaka probe-results."""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import sources.luminor_pensions as lp  # noqa: E402

lp.EXCLUDED_FUNDS.clear()
OUT = Path("probe_out")
OUT.mkdir(exist_ok=True)
s = lp.LuminorPensionsScraper()
report = {}

for use_proxy in (True, False):
    tag = "proxy" if use_proxy else "direct"
    try:
        html = s.fetch_table_html_via_curl(use_proxy=use_proxy)
        (OUT / f"table_{tag}.html").write_text(html, encoding="utf-8")
        rows = s.parse_rows_from_table_html(html)
        report[f"table_{tag}"] = {
            "date": s._extract_table_data_date(html),
            "label": re.findall(r"Vieneto[^<]{0,60}", html)[:3],
            "rows": rows,
        }
    except Exception as exc:  # noqa: BLE001
        report[f"table_{tag}"] = {"error": str(exc)[:300]}
    for fund_id in lp.LUMINOR_II_FUND_IDS + ["24"]:
        try:
            p = s.fetch_payload_via_curl(fund_id, use_proxy=use_proxy)
            hist = p.get("fundRatesHistory") or {}
            keys = sorted(k for k in hist if re.match(r"\d{4}-\d{2}-\d{2}$", str(k)))
            fr = p.get("fundRates") or {}
            report[f"fund{fund_id}_{tag}"] = {
                "name": fr.get("name_alias_lt") or fr.get("name_lt"),
                "rates": {k: v for k, v in fr.items() if not isinstance(v, (dict, list))},
                "hist_last": {k: hist[k] for k in keys[-6:]},
            }
        except Exception as exc:  # noqa: BLE001
            report[f"fund{fund_id}_{tag}"] = {"error": str(exc)[:300]}

(OUT / "luminor_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1, default=str), encoding="utf-8")
print(json.dumps({k: (v.get("date") or v.get("hist_last") and list(v["hist_last"])[-1:] or v.get("error"))
                  for k, v in report.items()}, ensure_ascii=False, indent=1, default=str))
