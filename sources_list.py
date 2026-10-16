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
         pages=["portfolios", "manager", "review", "reports", "aum"], mode="auto", f_lt="kas ketvirtį", f_en="quarterly",
         how_lt="Parsisiunčiama automatiškai iš Lietuvos banko kartą per dieną. Jei vėluoja – LB dar nepaskelbė arba sugedo rinkimas.", how_en="Downloaded automatically from the Bank of Lithuania once a day. If late, the Bank has not published it yet or the collection broke."),
    dict(id="lbr", lt="Fondų rezultatų ataskaita (rizikingas turtas, BAR)", en="Fund results report (risky assets, TER)",
         url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["reports"], mode="auto", f_lt="kas ketvirtį", f_en="quarterly",
         how_lt="Parsisiunčiama automatiškai iš Lietuvos banko kartą per dieną. Jei vėluoja – LB dar nepaskelbė arba sugedo rinkimas.", how_en="Downloaded automatically from the Bank of Lithuania once a day. If late, the Bank has not published it yet or the collection broke."),
    dict(id="fee2", lt="II pakopos mokesčiai", en="Pillar II fees", url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["performance", "manager", "reports", "journey"], mode="auto", f_lt="kartą per metus arba pasikeitus", f_en="yearly or when changed",
         how_lt="Parsisiunčiama automatiškai iš Lietuvos banko kartą per dieną. Jei vėluoja – LB dar nepaskelbė arba sugedo rinkimas.", how_en="Downloaded automatically from the Bank of Lithuania once a day. If late, the Bank has not published it yet or the collection broke."),
    dict(id="fee3", lt="III pakopos mokesčiai", en="Pillar III fees", url="https://www.lb.lt/lt/pf-veiklos-rodikliai", src_lt="Lietuvos bankas", src_en="Bank of Lithuania",
         pages=["pillar3", "manager", "reports"], mode="auto", f_lt="kartą per metus arba pasikeitus", f_en="yearly or when changed",
         how_lt="Parsisiunčiama automatiškai iš Lietuvos banko kartą per dieną. Jei vėluoja – LB dar nepaskelbė arba sugedo rinkimas.", how_en="Downloaded automatically from the Bank of Lithuania once a day. If late, the Bank has not published it yet or the collection broke."),
    dict(id="attrs", lt="Fondų ir ETF savybės (turto klasė, regionas, SFDR, TER)", en="Fund and ETF attributes (asset class, region, SFDR, TER)",
         url="https://www.justetf.com", src_lt="fondų dokumentai, ETF duomenų bazės", src_en="fund documents, ETF databases",
         pages=["portfolios", "reports"], mode="manual", f_lt="kartą per metus (po metinių dokumentų)", f_en="yearly (after annual documents)",
         how_lt="Paprašyti Claude patikrinti naujų ir pasikeitusių fondų savybes.", how_en="Ask Claude to check attributes of new and changed funds."),
    dict(id="kidoff", lt="Oficialūs KID (PID) veiklos rezultatų scenarijai", en="Official KID performance scenarios",
         url="", src_lt="valdytojų pagrindinės informacijos dokumentai", src_en="managers’ key information documents",
         pages=["reports"], mode="manual", f_lt="kartą per metus (kovą–gegužę)", f_en="yearly (March–May)",
         how_lt="Atsiųsti Claude naujus fondų PID (PDF) arba nuorodas į juos.", how_en="Send Claude the new fund KIDs (PDF) or links to them."),
    dict(id="wages", lt="Vidutinis darbo užmokestis", en="Average wage", url="https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai",
         src_lt="Valstybės duomenų agentūra", src_en="State Data Agency", pages=["journey"], mode="auto", f_lt="kartą per metus (kovą)", f_en="yearly (March)",
         how_lt="Parsisiunčiama automatiškai iš VDA (kasdien tikrinama, ar paskelbti nauji metai).", how_en="Downloaded automatically from the State Data Agency (checked daily for a new year)."),
    dict(id="minw", lt="Minimali mėnesinė alga", en="Minimum monthly wage", url="https://socmin.lrv.lt/",
         src_lt="Socialinės apsaugos ir darbo ministerija", src_en="Ministry of Social Security and Labour", pages=["journey"], mode="manual",
         f_lt="kartą per metus (rudenį – kitiems metams)", f_en="yearly (autumn, for next year)",
         how_lt="Kai Vyriausybė patvirtina kitų metų MMA – pranešti Claude.", how_en="When the Government sets next year’s minimum wage, tell Claude."),
    dict(id="sodra", lt="Sodros įmokų pervedimo į fondus datos", en="Dates of Sodra transfers to funds",
         url="https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija", src_lt="Sodra", src_en="Sodra",
         pages=["journey"], mode="auto", f_lt="kartą per metus (grafikas)", f_en="yearly (schedule)",
         how_lt="Datos po paskutinės žinomos įvertinamos automatiškai (2-asis mėnesio ketvirtadienis); paskelbus naujų metų Sodros grafiką, tikslias datas galima įrašyti.", how_en="Dates after the last known one are estimated automatically (second Thursday of the month); exact dates can be added when Sodra publishes the new schedule."),
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


# Patikimumo auditas (savininko užduotis 2026-10-16): kiekvienam šaltiniui – atsarginis kelias ir kas nutinka, jei
# neveikia nei pagrindinis, nei atsarginis. Rodoma „Apie“ puslapyje; spragos – IDEAS.md („Patikimumas“).
RELIABILITY = {
    "nav": ("Kiekvienas valdytojas bandomas iki 6 kartų per dieną; Luminor – per proxy, nepavykus be jo; kitą rytą papildomas paleidimas praleistoms dienoms.",
            "Each manager is retried up to 6 times a day; Luminor via proxy, otherwise directly; an extra morning run fills missed days.",
            "Rodoma paskutinė gauta diena, pranešimas paaiškina; vertę galima įkelti rankiniu būdu iš valdytojo svetainės.",
            "The last day received is shown with an explanatory notice; values can be uploaded manually from the manager’s site."),
    "p3": ("Kaip II pakopoje; Goindex istorija – iš savininko failų.", "As for pillar II; Goindex history from the owner’s files.",
           "III pakopos puslapis rodo paskutinę gautą dieną.", "The pillar III page shows the last day received."),
    "idx": ("MSCI – oficialus MSCI duomenų adresas; S&P 500 – Yahoo (du serveriai, po 2 bandymus); kursas – ECB.",
            "MSCI – official MSCI data endpoint; S&P 500 – Yahoo (two servers, 2 tries each); FX – ECB.",
            "Indekso linija baigiasi anksčiau; fondų rezultatams įtakos nėra.", "The index line ends earlier; fund results are not affected."),
    "estr": ("ECB; nepavykus – paskutinė išsaugota norma ir mėnesių vidurkiai.", "ECB; otherwise the last saved rate and monthly averages.",
             "Sharpe skaičiuojamas su paskutine norma (įtaka nedidelė).", "Sharpe uses the last rate (small effect)."),
    "cpi": ("VDA duomenų API.", "State Data Agency API.", "Reali grąža naujausiems mėnesiams – su paskutiniu indeksu.", "Real return for the newest months uses the last index."),
    "pens": ("VDA duomenų API.", "State Data Agency API.", "Kelio į pensiją skaičiai – su paskutiniais metais.", "Retirement path uses the last year."),
    "wages": ("VDA duomenų API.", "State Data Agency API.", "Kelio į pensiją skaičiai – su paskutiniais metais.", "Retirement path uses the last year."),
    "isin": ("OpenFIGI, obligacijoms – ESMA FIRDS; žinomi pavadinimai išsaugomi.", "OpenFIGI, for bonds ESMA FIRDS; known names are kept.",
             "Naujos pozicijos rodomos su ISIN kodu vietoj pavadinimo.", "New holdings show the ISIN instead of a name."),
    "pf": ("LB puslapių paieška; nepavykus – tiesioginiai LB failų adresai pagal įprastą pavadinimą.", "Search of the Bank of Lithuania pages; otherwise direct file addresses by the usual name.",
           "Rodomas ankstesnis ketvirtis; failą galima atsiųsti Claude.", "The previous quarter is shown; the file can be sent to Claude."),
    "lbr": ("Kaip portfelių ataskaitos.", "As for portfolio reports.", "Rodomas ankstesnis ketvirtis.", "The previous quarter is shown."),
    "fee2": ("Kaip portfelių ataskaitos.", "As for portfolio reports.", "Naudojami ankstesni mokesčiai.", "Previous fees are used."),
    "fee3": ("Kaip portfelių ataskaitos.", "As for portfolio reports.", "Naudojami ankstesni mokesčiai.", "Previous fees are used."),
    "sodra": ("Datos po paskutinio grafiko įvertinamos taisykle (2-asis mėnesio ketvirtadienis).", "Dates after the last schedule are estimated (second Thursday).",
              "Naudojamos įvertintos datos.", "Estimated dates are used."),
}
MANUAL_BACKUP = ("Rankinis darbas: priminimas svetainės pranešimuose ir vakariniame laiške likus 3 sav. iki termino.",
                 "Manual task: reminder in site notices and the evening e-mail 3 weeks before the due date.",
                 "Naudojamos ankstesnės reikšmės, kol neatnaujinta.", "Previous values are used until updated.")


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
                d = _d(_last_row(J / "sodra_dates.csv", "date")); last = dn(d); nxt = dn(d + timedelta(days=365))   # po grafiko – įvertis (journey.sodra_dates)
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
        r = RELIABILITY.get(k) or (MANUAL_BACKUP if s["mode"] == "manual" else None)
        if r:
            s = {**s, "bk_lt": r[0], "bk_en": r[1], "fl_lt": r[2], "fl_en": r[3]}
        out.append({**s, "last": last, "next": nxt, "fmt": fmt})
    return out
