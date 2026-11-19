"""SEB II pakopos fondų lyginamasis indeksas (savininkas 2026-11-19: „Indekso sekimas“ – tik SEB skelbia indeksą).

Kiekvieno SEB II pakopos fondo puslapyje (FUND_DETAILS) yra JS kintamasis `ltdata`: fondo vieneto vertės ir
lyginamojo indekso istorija (tas pats turinys kaip mygtukas „Istorinės fondo vieneto vertės“ CSV). Skriptas
papildo TIK tuščius `benchmark_index` laukus esamose `data/nav_history.csv` eilutėse (taisyklė 6), jei SEB puslapio
vieneto vertė sutampa su mūsų (apsauga nuo neteisingo fondo / datos).

Indekso lygis: SEB puslapio indeksas gali būti kitame mastelyje nei anksčiau importuoti failai. Jei abi eilutės
persidengia, nauji taškai perskaičiuojami į senąjį mastelį pagal paskutinę bendrą dieną (grąžos nepasikeičia –
naudojami tik santykiai). Jei persidengimo nėra – įrašoma kaip yra.

  python tools/fetch_seb_bench.py            # papildo data/nav_history.csv
  python tools/fetch_seb_bench.py --probe    # nieko neįrašo, ataskaita į probe_out/seb_bench.json
"""
import json
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import fund_links  # noqa: E402
import pillar3  # noqa: E402
import store  # noqa: E402

FUNDS = ["SEB pensija 1961-1967", "SEB pensija 1968-1974", "SEB pensija 1975-1981", "SEB pensija 1982-1988",
         "SEB pensija 1989-1995", "SEB pensija 1996-2002", "SEB pensija 2003-2009", "SEB turto išsaugojimo fondas"]


# Fondų puslapiai (sąraše nuorodos atidaromos JS, adresai nustatyti 2026-11-19); jei kuris neveiks – bandoma paspausti sąraše.
DETAILS = {f: f"{fund_links.SEB_BASE}?sesskey=&lang=LIT&act=FUND_DETAILS&isin={code}&frnam=X&unetmenuhigh=" for f, code in {
    "SEB pensija 1961-1967": "FOVIS61XXXXX", "SEB pensija 1968-1974": "FOVIS68XXXXX", "SEB pensija 1975-1981": "FOVIS75XXXXX",
    "SEB pensija 1982-1988": "FOVIS82XXXXX", "SEB pensija 1989-1995": "FOVIS89XXXXX", "SEB pensija 1996-2002": "FOVIS96XXXXX",
    "SEB pensija 2003-2009": "FOVIS09XXXXX", "SEB turto išsaugojimo fondas": "FOVIS516XXXX"}.items()}


def parse_ltdata(html: str) -> dict:
    """JS kintamasis ltdata: pirma serija – fondas ["YYYYMMDD", vieneto vertė, aktyvai], serija su „lyginamasis“ – indeksas.
    Grąžina {data: (vieneto vertė, indeksas arba None)} (logika – kaip pillar3.parse_seb_ltdata)."""
    series = re.findall(r'isin:\s*"[^"]*",\s*name:\s*"([^"]*)",\s*data:\s*\[(.*?)\]\s*\}', html, re.S)
    if not series:
        return {}
    pts = lambda body: re.findall(r'\["(\d{8})",\s*([-\d.eE]+)(?:,\s*([-\d.eE]+))?\]', body)
    bench = next(({d: float(v) for d, v, _ in pts(body)} for name, body in series[1:] if "lyginamasis" in name.lower()), {})
    return {f"{d[:4]}-{d[4:6]}-{d[6:]}": (float(u), bench.get(d)) for d, u, _ in pts(series[0][1]) if float(u) > 0}


def series(page, fund) -> dict:
    page.goto(DETAILS[fund], wait_until="domcontentloaded", timeout=90000)
    page.wait_for_timeout(2000)
    out = parse_ltdata(page.content())
    if not out:     # atsarginis kelias – paspausti sąraše (kaip sources/seb_pensions.py)
        page.goto(fund_links.SEB_II, wait_until="domcontentloaded", timeout=90000)
        page.wait_for_timeout(3000)
        page.locator(f"a:has-text('{fund}')").first.click(timeout=15000)
        page.wait_for_load_state("domcontentloaded")
        page.wait_for_timeout(2500)
        out = parse_ltdata(page.content())
    return out


DEBUG = {}


def plan(fund, web, have) -> tuple:
    """Grąžina (užpildymai {data: indeksas}, ataskaita)."""
    ours = {d: r for (d, f), r in have.items() if f == fund}
    both = sorted(d for d, (_, b) in web.items() if b and d in ours and ours[d].get("benchmark_index"))
    scale, ratios = 1.0, []
    if both:
        ratios = [float(ours[d]["benchmark_index"]) / web[d][1] for d in both[-60:]]
        scale = ratios[-1]
    fills, bad_uv = {}, 0
    for d, (uv, b) in sorted(web.items()):
        r = ours.get(d)
        if not b or not r or r.get("benchmark_index"):
            continue
        if abs(float(r["unit_value"]) / uv - 1) > 0.0005:
            bad_uv += 1
            continue
        fills[d] = round(b * scale, 6)
    rep = {"web_days": len(web), "web_bench_days": sum(1 for v in web.values() if v[1]),
           "web_last": max(web) if web else None, "overlap": len(both), "scale": scale,
           "scale_min": min(ratios) if ratios else None, "scale_max": max(ratios) if ratios else None,
           "fills": len(fills), "fill_from": min(fills) if fills else None, "fill_to": max(fills) if fills else None,
           "uv_mismatch": bad_uv}
    return fills, rep


def main(probe=False):
    have = store.load()
    pw, browser, page = pillar3.browser_page()
    report, upd = {}, []
    try:
        ln = []
        for fund in FUNDS:
            try:
                web = series(page, fund)
            except Exception as exc:  # noqa: BLE001
                print(f"SEB {fund} klaida: {str(exc)[:200]}")
                continue
            ln.append(fund)
            fills, rep = plan(fund, web, have)
            report[fund] = rep
            print(fund, rep)
            if probe and fund == "SEB pensija 1975-1981":
                DEBUG["sample"] = {d: web[d] for d in sorted(web)[-15:]}
                DEBUG["cmp"] = {d: [have.get((d, fund), {}).get("unit_value"), have.get((d, fund), {}).get("benchmark_index"), *web[d]]
                                for d in sorted(web) if "2026-09-22" <= d <= "2026-10-08"}
            for d, b in fills.items():
                upd.append({**have[(d, fund)], "benchmark_index": b})
    finally:
        browser.close()
        pw.stop()
    if probe:
        out = ROOT / "probe_out"
        out.mkdir(exist_ok=True)
        (out / "seb_bench.json").write_text(json.dumps({"report": report, "debug": DEBUG}, ensure_ascii=False, indent=1), encoding="utf-8")
        (out / "seb_bench_rows.json").write_text(json.dumps(upd, ensure_ascii=False), encoding="utf-8")
        return
    if not ln:
        print("SEB II lyginamasis indeksas nepavyko: puslapyje nerasta fondų nuorodų")
        return
    if not any(r["web_bench_days"] for r in report.values()):
        print("SEB II lyginamasis indeksas nepavyko: puslapiuose nėra indekso serijos")
        return
    print(f"SEB II lyginamasis indeksas: papildyta {store.upsert(upd) if upd else 0} eilučių")


if __name__ == "__main__":
    main("--probe" in sys.argv)
