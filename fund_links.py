"""Visos fondų duomenų puslapių ir API nuorodos vienoje vietoje.

Pasikeitus fondo svetainės adresui, taisyti reikia tik čia.
"""

SEB_II = "https://e.seb.lt/web/ipank.p?sesskey=&act=VPFOND&filterCode=P&lang=lit&frnam=X&unetmenuhigh="
SEB_BASE = "https://e.seb.lt/web/ipank.p"
SWEDBANK_II = "https://www.swedbank.lt/private/pensions/pillar2/allFunds?language=LIT"
SWEDBANK_III = "https://www.swedbank.lt/private/pensions/pillar3/allFunds?language=LIT"
ARTEA_PAGE = "https://www.artea.lt/lt/privatiems/pensija/ii-pakopos-pensija/artea-pensija-1996-2002-index-plus"
ARTEA_HISTORY_API = "https://api.sb.lt/funds-api/Prices/History"
ALLIANZ_PAGE = "https://investavimorezultatai.allianz.lt/?tipas=gyvenimo-ciklo-pensiju-fondai"
GOINDEX_PAGE = "https://www.goindex.lt/2-pakopa/fondu-rezultatai-ir-dokumentai/"
GOINDEX_API = "https://dapi.goindex.lt/v1/funds/summary/tab"
LUMINOR_BASE_URLS = [
    "https://luminor.lt/lt/rinkis-fonda",
    "https://www.luminor.lt/lt/rinkis-fonda",
]
LUMINOR_TABLE_URLS = [
    "https://luminor.lt/lt/pensiju-fondai",
    "https://www.luminor.lt/lt/pensiju-fondai",
]

# Nerizikinga palūkanų norma (Sharpe koeficientui): ECB euro trumpalaikių palūkanų norma €STR
ECB_ESTR_API = "https://data-api.ecb.europa.eu/service/data/EST/B.EU000A2X2A25.WT?lastNObservations=1&format=csvdata"
ECB_ESTR_PAGE = "https://data.ecb.europa.eu/data/datasets/EST/EST.B.EU000A2X2A25.WT"

# Pasaulio akcijų indeksai palyginimui (žr. indexes.py): MSCI grynosios grąžos (NETR) indeksai eurais iš MSCI,
# S&P 500 su dividendais (USD, Yahoo) perskaičiuojamas į eurus pagal ECB EUR/USD kursą.
MSCI_LEVELS_API = ("https://app2.msci.com/products/service/index/indexmaster/getLevelDataForGraph"
                   "?currency_symbol=EUR&index_variant=NETR&start_date={start}&end_date={end}&data_frequency=DAILY&index_codes={code}")
YAHOO_CHART_API = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?period1={p1}&period2={p2}&interval=1d"
ECB_EURUSD_API = "https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?format=csvdata&startPeriod={start}"
