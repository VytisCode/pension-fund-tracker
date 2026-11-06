# Morningstar: tikroji sudėtis „pro fondus“ – ketvirtinė procedūra (Claude)

**Kada:** kiekvieną ketvirtį, kai į `data/portfolios.csv` įkelti nauji LB portfeliai, ir kartu su „surink portfelių požymius“
(svetainės / vakarinio laiško priminimas). Morningstar įrankis veikia tik Claude sesijoje, ne GitHub Actions.

**Kodėl:** ~70 % pensijų fondų turto yra ETF ir fonduose. LB ataskaita rodo tik „dėžutes“; kad matytume tikrus sektorius,
regionus, didžiausias bendroves ir obligacijų riziką, reikia ETF vidaus.

**Licencija:** žali Morningstar duomenys laikomi tik PRIVAČIAME projekto aplanke `/mnt/project-files/morningstar/<ketvirtis>/`.
Viešoje repozitorijoje – tik mūsų apskaičiuoti suvestiniai rodikliai (`data/lookthrough.csv`). Morningstar reitingų,
kategorijų ar žvaigždučių svetainėje nerodome.
Išimtis (savininkas patvirtino 2026-11-06, kad prieiga leidžia viešinti): kiekvieno ETF / fondo profilis – `data/etf_profiles.csv`
(struktūra, sektoriai, regionai, trukmė, kredito kokybė, 10 didžiausių pozicijų), rodomas „Fondo portfelis“ → „Fondo vidus ▾“ su „© Morningstar, Inc.“.
Jį automatiškai rašo `tools/ms_lookthrough.py`.

## Žingsniai

0. **Per 10 dienų po ketvirčio pabaigos** (vakarinis laiškas primena: „surink ETF sudėtis ketvirčio pabaigai“): Morningstar duoda
   tik naujausias sudėtis, todėl 4 žingsnį atlikti iškart, praėjusio ketvirčio ETF sąrašu (`src/ids.csv`), ir išsaugoti į naujo
   ketvirčio `src/holdings-*.json`. Kai LB portfeliai pasirodys (~1–2 mėn.), tik naujiems ETF sudėtis rinkti tada.
   2026-09-30 sudėtys surinktos 2026-11-04 (dauguma ETF – lapkričio 3–5 d.), t. y. ~5 sav. vėliau nei portfeliai.

1. **Pozicijų sąrašas** naujam ketvirčiui `Q` (pvz. 2026-12-31): fondai / ETF su `kis_type` 1, 3, 4 ir visos tiesioginės akcijos
   iš `data/portfolios.csv`. Ankstesnio ketvirčio `src/ids.csv` jau turi daugumos ISIN → Morningstar ID; ieškoti tik naujų.
2. **ID:** `morningstar-id-lookup-tool` po ~30 ISIN; fondams imti pirmą `F0…` ID, akcijoms – pirmą `0P…`.
   Įrašyti į `/mnt/project-files/morningstar/<Q>/src/ids.csv` (`isin,ms_id,kind,name`, kind = fund | stock).
3. **Profiliai:** `morningstar-data-tool`, po 10 fondų, `start_date` = Q − 1 mėn., `end_date` = Q (laiko eilutė → atsakymas
   išsaugomas į failą; mėnesinių fondų atveju imti platesnį intervalą). Duomenų taškai:
   `HS02E HS02D HS00X` (akcijos / obligacijos / pinigai %), `AA03K…AA03U` (11 sektorių), `HS06G HS06F HS06D HS06E HS06I HS06J
   HS06H HS006 HS06K HS06L HS06N HS06M` (12 regionų), `HS02F` (trukmė), `HS00C` (vid. kredito kokybė).
   Akcijoms – tik `AA03K…AA03U` (po 50). Failus kopijuoti į `src/data-*.json`.
4. **Sudėtys:** `morningstar-fund-holdings-tool`, `num_holdings=100`, po 10 fondų → `src/holdings-*.json`.
5. **Analogai:** fondams be savų duomenų – `src/proxy.csv` (`ms_id,profile_from,holdings_from`). Sintetiniai (swap) ETF
   rodo tik „TRS …“ – jiems `holdings_from` = fizinis to paties / artimiausio indekso ETF (žr. 2026-09-30 `proxy.csv`).
6. **Konvertuoti ir apskaičiuoti:**
   ```
   python tools/ms_raw_to_csv.py --src /mnt/project-files/morningstar/<Q>/src --out /mnt/project-files/morningstar/<Q> --date <Q>
   python tools/ms_lookthrough.py --raw /mnt/project-files/morningstar/<Q> --date <Q>
   python build_site.py
   ```
   Patikrinti: „fondų/ETF vertės su Morningstar profiliu“ ≥ 95 %; Portfelių puslapis → „Fondo portfelis“ ir „Palyginimas grupėje“.
7. Commit `data/lookthrough.csv` (+ kodo pakeitimai, jei buvo) į `main`.

## Žinomi apribojimai (rodomi ir svetainėje)

- Didžiausios bendrovės – iš iki 100 didžiausių kiekvieno ETF pozicijų pagal naujausią paskelbtą sudėtį (ne ketvirčio pabaigos).
  Plačiuose ETF tai dengia ~60 % vertės, smulkių įmonių ETF – ~15 %; 10–15 didžiausių pensijų fondo bendrovių tikslios.
- Sektoriai ir regionai – viso ETF portfelio, ketvirčio pabaigos.
- Obligacijų fondų „pinigai“ priskiriami obligacijoms (dažnai tai išvestinių užstatas), pinigų rinkos fondai – pinigams,
  aukso fondų ne akcijų dalis – „Kita“.
- Kredito kokybė – tik obligacijų fondų vidutinė; tiesioginių obligacijų reitingų neturime. Trukmė – tiesioginių
  (`bonds.py`) ir fondų (Morningstar) svertinė.
- Ankstesni ketvirčiai: profiliai turi istoriją (galima atgaline data), sudėtys – tik naujausios. 2026-11-06 atgal užpildyta
  2024-09-30 … 2026-06-30 (tik profiliai, be bendrovių): žali failai `/mnt/project-files/morningstar/hist/src/` (vienos dienos langas –
  `start_date = end_date = ketvirčio pabaiga`, po ~50 fondų į užklausą; ilgesnis langas grąžina dienines eilutes ir užklausa lūžta).
  `ms_lookthrough.py` be sudėčių nerašo `top*` rodiklių.
