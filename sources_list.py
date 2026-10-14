"""Visų svetainės duomenų šaltinių sąrašas (savininko užduotis 2026-10-14): iš kur, kuriems puslapiams, kaip atnaujinama,
paskutinių duomenų data ir kada laukiama naujų. Rodoma puslapyje „Apie“ (skyrius „Duomenų šaltiniai ir atnaujinimas“),
o pavėlavę rankiniai darbai – vakariniame laiške (daily_report.py).

mode: auto – renkama automatiškai kasdienio paleidimo metu; manual – reikia įkelti ranka (žr. how).
Datos skaičiuojamos iš pačių duomenų failų (build_site.sources() ir šis modulis), todėl sąrašas atsinaujina savaime.
"""
import csv
import json
import re
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).parent
J = ROOT / "imports" / "journey"

# Pastovios datos: kada šaltinis paskutinį kartą patikrintas ranka (keičiama, kai atnaujinama)
CHECKED = {
    "attrs": "2026-10-14",      # fondų ir ETF savybės, SFDR (data/fund_attributes.csv)
    "future": "2026-10-14",     # ateities scenarijų prielaidos (site/future.js): Sodros metodika 2025-12-16, LB straipsnis 2026-06-18
    "events": "2026-10-09",     # rinkos įvykių sąrašas (site/events.js)
}

SOURCES = [
    # id, pavadinimas LT / EN, nuoroda, puslapiai, būdas, dažnumas LT / EN, kaip atnaujinti LT / EN (tik rankiniams)
    dict(id="nav", lt="II pakopos vieneto vertės ir grynieji aktyvai", en="Pillar II unit values and net assets",
         url="https://www.lb.lt/lt/pensiju-fondai-1", src_lt="6 valdytojų svetainės", src_en="websites of the 6 managers",
         pages=["index", "review", "performance", "manager", "overview", "aum", "reports", "journey"], mode="auto",
         f_lt="kasdien darbo dienomis", f_en="every working day"),
    dict(id="p3", lt="III pakopos vieneto vertės, aktyvai ir lyginamieji indeksai", en="Pillar III unit values, assets and benchmarks",
         url="https://www.lb.lt/lt/iii-pakopos-pensiju-fondai", src_lt="valdytojų svetainės (22 fondai)", src_en="managers’ websites (22 funds)",
         pages=["pillar3", "manager", "aum", "reports", "journey"], mode="auto", f_lt="kasdien darbo dienomis", f_en="every working day"),
    dict(id="idx", lt="Indeksai (MSCI World, MSCI ACWI, S&P 500, euro obligacijų pajamingumas)", en="Indices (MSCI World, MSCI ACWI, S&P 500, euro bond yield)",
         url="https://www.msci.com/indexes", src_lt="MSCI, S&P (per Yahoo), ECB valiutų kursas", src_en="MSCI, S&P (via Yahoo), ECB exchange rate",
         pages=["performance", "journey", "reports"], mode="auto", f_lt="kasdien", f_en="daily"),
    dict(id="estr", lt="Nerizikinga palūkanų norma (€STR)", en="Risk-free rate (€STR)",
         url="https://data.ecb.europa.eu/data/datasets/EST/EST.B.EU000A2X2A25.WT", src_lt="Europos centrinis bankas", src_en="European Central Bank",
         pages=["performance"], mode="auto", f_lt="kasdien", f_en="daily"),
    dict(id="cpi", lt="Vartotojų kainų indeksas (infliacija)", en="Consumer price index (inflation)",
         url="https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai", src_lt="Valstybės duomenų agentūra", src_en="State Data Agency",
         pages=["performance", "journey"], mode="auto", f_lt="kas mėnesį", f_en="monthly"),
    dict(id="pens", lt="Vidutinė senatvės pensija", en="Average old-age pension",
         url="https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai", src_lt="Valstybės duomenų agentūra", src_en="State Data Agency",
         pages=["journey"], mode="auto", f_lt="kas ketvirtį", f_en="quarterly"),
    dict(id="isin", lt="Vertybinių popierių pavadinimai ir obligacijų sąlygos", en="Security names and bond terms",
         url="https://registers.esma.europa.eu/publication/searchRegister?core=esma_registers_firds", src_lt="OpenFIGI, ESMA FIRDS", src_en="OpenFIGI, ESMA FIRDS",
         pages=["portfolios", "reports"], mode="auto", f_lt="kasdien (naujoms pozicijoms)", f_en="daily (new holdings)"),
    dict(id="pf", lt="Fondų portfeliai (pozicijos ketvirčio pabaigoje)", en="Fund portfolios (holdings at quarter end)",
         url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["portfolios", "manager", "review", "reports", "aum"], mode="manual", f_lt="kas ketvirtį", f_en="quarterly",
         how_lt="Atsisiųsti naują ketvirčio portfelių failą (xlsx) iš Lietuvos banko ir atsiųsti Claude.", how_en="Download the new quarterly portfolio file (xlsx) from the Bank of Lithuania and send it to Claude."),
    dict(id="lbr", lt="Fondų rezultatų ataskaita (rizikingas turtas, BAR)", en="Fund results report (risky assets, TER)",
         url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["reports"], mode="manual", f_lt="kas ketvirtį", f_en="quarterly",
         how_lt="Atsisiųsti II pakopos rezultatų failą (xlsx) iš Lietuvos banko ir atsiųsti Claude.", how_en="Download the pillar II results file (xlsx) from the Bank of Lithuania and send it to Claude."),
    dict(id="fee2", lt="II pakopos mokesčiai", en="Pillar II fees", url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["performance", "manager", "reports", "journey"], mode="manual", f_lt="kartą per metus arba pasikeitus", f_en="yearly or when changed",
         how_lt="Atsisiųsti naują II pakopos mokesčių suvestinę (xls) ir atsiųsti Claude.", how_en="Download the new pillar II fee summary (xls) and send it to Claude."),
    dict(id="fee3", lt="III pakopos mokesčiai", en="Pillar III fees", url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["pillar3", "manager", "reports"], mode="manual", f_lt="kartą per metus arba pasikeitus", f_en="yearly or when changed",
         how_lt="Atsisiųsti naują III pakopos mokesčių suvestinę (xlsx) ir atsiųsti Claude.", how_en="Download the new pillar III fee summary (xlsx) and send it to Claude."),
    dict(id="attrs", lt="Fondų ir ETF savybės (turto klasė, regionas, SFDR, TER)", en="Fund and ETF attributes (asset class, region, SFDR, TER)",
         url="https://www.justetf.com", src_lt="fondų dokumentai, ETF duomenų bazės", src_en="fund documents, ETF databases",
         pages=["portfolios", "reports"], mode="manual", f_lt="kartą per metus (po metinių dokumentų)", f_en="yearly (after annual documents)",
         how_lt="Paprašyti Claude patikrinti naujų ir pasikeitusių fondų savybes.", how_en="Ask Claude to check attributes of new and changed funds."),
    dict(id="kidoff", lt="Oficialūs KID (PID) veiklos rezultatų scenarijai", en="Official KID performance scenarios",
         url="", src_lt="valdytojų pagrindinės informacijos dokumentai", src_en="managers’ key information documents",
         pages=["reports"], mode="manual", f_lt="kartą per metus (kovą–gegužę)", f_en="yearly (March–May)",
         how_lt="Atsiųsti Claude naujus fondų PID (PDF) arba nuorodas į juos.", how_en="Send Claude the new fund KIDs (PDF) or links to them."),
    dict(id="wages", lt="Vidutinis darbo užmokestis", en="Average wage", url="https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai",
         src_lt="Valstybės duomenų agentūra", src_en="State Data Agency", pages=["journey"], mode="manual", f_lt="kartą per metus (kovą)", f_en="yearly (March)",
         how_lt="Kai paskelbiamas praėjusių metų vidutinis darbo užmokestis – pranešti Claude.", how_en="When last year’s average wage is published, tell Claude."),
    dict(id="minw", lt="Minimali mėnesinė alga", en="Minimum monthly wage", url="https://socmin.lrv.lt/",
         src_lt="Socialinės apsaugos ir darbo ministerija", src_en="Ministry of Social Security and Labour", pages=["journey"], mode="manual",
         f_lt="kartą per metus (rudenį – kitiems metams)", f_en="yearly (autumn, for next year)",
         how_lt="Kai Vyriausybė patvirtina kitų metų MMA – pranešti Claude.", how_en="When the Government sets next year’s minimum wage, tell Claude."),
    dict(id="sodra", lt="Sodros įmokų pervedimo į fondus datos", en="Dates of Sodra transfers to funds",
         url="https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija", src_lt="Sodra", src_en="Sodra",
         pages=["journey"], mode="manual", f_lt="kas mėnesį", f_en="monthly",
         how_lt="Pranešti Claude naujas pervedimo datas (matyti fondo sąskaitos išraše arba Sodros svetainėje).", how_en="Tell Claude the new transfer dates (seen in the fund account statement or on the Sodra site)."),
    dict(id="rates", lt="Įmokų tarifai ir valstybės skatinamoji įmoka", en="Contribution rates and state incentive",
         url="https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija", src_lt="Sodra, įstatymai", src_en="Sodra, laws",
         pages=["journey"], mode="manual", f_lt="kartą per metus (gruodį – kitiems metams)", f_en="yearly (December, for next year)",
         how_lt="Kai paskelbiama kitų metų valstybės skatinamoji įmoka – pranešti Claude.", how_en="When next year’s state incentive is published, tell Claude."),
    dict(id="ann", lt="Sodros anuitetų koeficientai", en="Sodra annuity factors", url="https://www.sodra.lt/skaiciuokles/pensiju-anuitetu-skaiciuokle",
         src_lt="Sodros anuitetų skaičiuoklė", src_en="Sodra annuity calculator", pages=["journey"], mode="manual", f_lt="kartą per metus (sausį)", f_en="yearly (January)",
         how_lt="Sodros skaičiuoklėje įvesti gimimo datą prieš 65 m., šiandienos prašymo datą ir 20 000 000 € sumą; atsiųsti Claude rezultatus.", how_en="In the Sodra calculator enter a birth date 65 years ago, today as the request date and 20,000,000 €; send the results to Claude."),
    dict(id="future", lt="Ateities scenarijų prielaidos (grąža, pakeitimo norma)", en="Future scenario assumptions (returns, replacement rate)",
         url="https://www.sodra.lt/apie-skaiciuokle", src_lt="Sodros skaičiuoklės metodika, Lietuvos bankas, EK „Ageing Report“", src_en="Sodra calculator methodology, Bank of Lithuania, EC Ageing Report",
         pages=["journey"], mode="manual", f_lt="kartą per metus", f_en="yearly",
         how_lt="Paprašyti Claude patikrinti, ar Sodra, Lietuvos bankas ar EK paskelbė naujas prielaidas.", how_en="Ask Claude to check for new Sodra, Bank of Lithuania or EC assumptions."),
    dict(id="events", lt="Rinkos įvykiai diagramose", en="Market events on charts", url="", src_lt="vieši naujienų šaltiniai", src_en="public news sources",
         pages=["performance"], mode="manual", f_lt="pagal poreikį", f_en="as needed",
         how_lt="Pasiūlyti Claude naują įvykį (data ir trumpas aprašymas).", how_en="Suggest a new event to Claude (date and short description)."),
]


def _d(s):
    return date.fromisoformat(s[:10])


def _last_row(path, col):
    with open(path, encoding="utf-8", newline="") as f:
        rows = [r[col] for r in csv.DictReader(f) if r.get(col)]
    return max(rows) if rows else None


def inventory(src: list, top_day: int, today: date | None = None) -> list:
    """src – build_site.sources() rezultatas ({k, d, next} dienomis nuo 1970-01-01). Grąžina SOURCES su last/next (dienomis)."""
    today = today or date.today()
    dn = lambda d: (d - date(1970, 1, 1)).days if d else None
    known = {x["k"]: x for x in src}
    out = []
    for s in SOURCES:
        last = nxt = None; fmt = "m" if s["id"] == "cpi" else "d"
        k = s["id"]
        try:
            if k == "nav":
                last = top_day
            elif k in known:
                last, nxt = known[k]["d"], known[k]["next"]
                if k in ("fee2", "fee3") and last is not None:
                    nxt = last + 365                                   # mokesčių suvestinė – kartą per metus
            elif k == "pens":
                y = int(_last_row(J / "pensions.csv", "year")); last = dn(date(y, 1, 1)); fmt = "y"
            elif k == "isin":
                last = known.get("pf", {}).get("d")
            elif k == "wages":
                y = int(_last_row(J / "wages.csv", "year")); last = dn(date(y, 1, 1)); fmt = "y"; nxt = dn(date(y + 2, 3, 31))
            elif k == "minw":
                y = int(_last_row(J / "min_wage.csv", "year")); last = dn(date(y, 1, 1)); fmt = "y"; nxt = dn(date(y, 11, 30))
            elif k == "sodra":
                d = _d(_last_row(J / "sodra_dates.csv", "date")); last = dn(d); nxt = dn(d - timedelta(days=30))   # faile – ir suplanuotos datos; naujus metus įkelti iš anksto
            elif k == "rates":
                y = int(_last_row(J / "state_incentive.csv", "year")); last = dn(date(y, 1, 1)); fmt = "y"; nxt = dn(date(y, 12, 31))
            elif k == "ann":
                import journey
                c = journey.ANNUITY["calc"]["date"]; last = dn(_d(c)); nxt = dn(date(_d(c).year + 1, 1, 31))
            elif k == "kidoff":
                p = ROOT / "data" / "kid_official.json"
                docs = [f["doc"] for f in json.loads(p.read_text(encoding="utf-8"))["funds"]]
                last = dn(_d(max(docs))); nxt = last + 365
            elif k in CHECKED:
                last = dn(_d(CHECKED[k])); nxt = None if k == "events" else last + 365
        except Exception:
            pass
        out.append({**s, "last": last, "next": nxt, "fmt": fmt})
    return out
