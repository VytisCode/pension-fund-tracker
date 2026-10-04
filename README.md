# pension-fund-tracker

Privatus pensijų fondų (II pakopa) sekimo projektas: kasdien surenka Lietuvos fondų vieneto vertes, kaupia istoriją ir rodo rezultatus.

## Kur esame

- `base_scraper.py` ir `sources/` – skaitytuvai, perimti iš esamo veikiančio sprendimo (SEB, Swedbank, Artea, Luminor, Goindex, Allianz).
- Goindex API raktas **neįrašytas kode**. Skaitytuvas jį ima iš aplinkos kintamojo `GOINDEX_API_SECRET_KEY` (Github: Settings → Secrets and variables → Actions).
- Luminor, jei reikės, naudoja tarpinį serverį (proxy) per `LUMINOR_PROXY_*` kintamuosius.
- `store.py` – istorijos saugykla `data/nav_history.csv` (stulpeliai: `date, provider, fund, unit_value, net_assets`), kuri nesidubliuoja paleidus pakartotinai.
- `backfill_artea.py` – parsisiunčia visą Artea istoriją nuo 2019 m. į saugyklą. Paleidžiama Github: **Actions → Backfill Artea history → Run workflow**.
- `import_seb_csv.py` – importuoja SEB istorinius CSV failus iš `imports/seb/` (atsisiųsti iš SEB interneto banko). Saugykloje papildomas stulpelis `benchmark_index` (SEB „Lyginamasis indeksas"). Grynųjų aktyvų reikšmė 0 laikoma trūkstamais duomenimis.
- `import_goindex_csv.py` – importuoja Goindex CSV failus iš `imports/goindex/`. Grynųjų aktyvų reikšmės ≤ 0 (2022 m. rugpjūčio–spalio paleidimo laikotarpis) laikomos trūkstamais duomenimis. Goindex istorija prasideda 2022-08-22 (2003-2009 grupė – 2025-01-02).
- `import_swedbank_pdf.py` – importuoja Swedbank istorinius PDF failus iš `imports/swedbank/` (interneto banke pasirinkus laikotarpį „All" ir atspausdinus į PDF). Reikia `pdftotext`. Grynųjų aktyvų PDF neturi. Istorija nuo 2018-12-31 (2003-2009 – nuo 2024-12-31).
- `import_assets_from_chart_data.py` – papildo tuščius grynųjų aktyvų laukus iš esamo įrankio `chart_data.json` kopijos (`imports/assets/`, tik 2026-06-02 → 2026-10-01). Taip užpildyti Luminor ir Swedbank aktyvai. Po Allianz importo paleisti dar kartą.
- `import_luminor_csv.py` – importuoja Luminor istorines vertes iš `imports/luminor/` (originalūs `.xls` failai paversti į CSV; eksporte tik data ir vieneto vertė, grynųjų aktyvų nėra). Luminor šventinių dienų eilučių nepateikia.
- `backfill_allianz.py` – Allianz istorija nuo 2019 m. per `POST /snippets/pensiju-fondai` (laukai `_token`, `direction`, `pdate`). Paleidžiama Github: **Actions → Backfill Allianz history → Run workflow** (~15–40 min).
- Žinoma spraga: `SEB_pensija_1989-1995.csv` apima tik nuo 2023-10-02, reikia atsisiųsti visą laikotarpį ir paleisti importą iš naujo.

## Šaltinių patikros rezultatai (2026-10-04)

| Fondas | Būsena |
|---|---|
| Artea | API `api.sb.lt/funds-api/Prices/History?fundCode=...` duoda istoriją nuo 2019-01-02, be rakto |
| Swedbank | vertės matomos puslapio HTML |
| Luminor | puslapis atsidarė be blokavimo; Github serveriuose dar netikrinta |
| Allianz | duomenys įkeliami JavaScript, reikia naršyklės arba duomenų adreso |
| Goindex | API su slaptu raktu; paprastas puslapio atsisiuntimas grąžina 403 |
| SEB | `robots.txt` draudžia robotams; sprendimas dar priimamas |

## Planas

1. Duomenų saugykla: vienas failas su visa istorija (data, fondas, vieneto vertė, grynieji aktyvai).
2. Istorijos užpildymas nuo 2019 m. (pirma Artea, kitiems – iš savo failų).
3. Kasdienis automatinis atnaujinimas per Github Actions.
4. Svetainė: einamųjų metų rezultatų reitingas pagal grupes, linijinės diagramos.
5. Vėliau: valdymo mokesčiai, interaktyvios lentelės, Lietuvos banko ketvirtiniai portfelių failai.

## Kasdienis atnaujinimas

`update.py` + `.github/workflows/update.yml` („Update fund data"). Veikia darbo dienomis kas valandą nuo ~14:15 iki ~18:15 Vilniaus laiku (fondai dažniausiai atnaujina iki 18 val.) ir papildomai ryte ~07:30 (antradienį–šeštadienį) – ryto paleidimas užpildo vakarykštes spragas (`CATCHUP=true`). Naršyklės tiekėjai rodo tik naujausią dieną, todėl ryto paleidimas svarbus: jį praleidus, vėlai paskelbta diena prarandama.

- Laukiama diena = paskutinė darbo diena prieš šiandieną (įskaitant Lietuvos šventes). Tiekėjas tikrinamas **tik jei** saugykloje dar nėra jos duomenų – kitu atveju paleidimas baigiasi per sekundes.
- Lengvi tiekėjai (be naršyklės): Artea (API), Allianz (POST), Goindex (API, reikia `GOINDEX_API_SECRET_KEY`).
- Naršyklės tiekėjai (merginos skaitytuvai iš `sources/`): SEB, Swedbank, Luminor, Goindex (jei nėra rakto). Playwright diegiamas tik jei kam nors tikrai reikia; vienam tiekėjui – ne daugiau kaip 5 bandymai per dieną (`data/update_state.json`).
- Apsaugos: nežinomi fondai (pvz. III pakopos) praleidžiami; vienos dienos vertės pokytis >12 % laikomas klaida ir neįrašomas; esami grynieji aktyvai neperrašomi tuščiais.
- Rezultatai matomi Actions paleidimo „Summary" skiltyje.
- `python update.py status` – parodo, ko dar trūksta.

GitHub secrets (Settings → Secrets and variables → Actions): `GOINDEX_API_SECRET_KEY` (būtinas Goindex API keliui), neprivalomi `LUMINOR_PROXY_SERVER`, `LUMINOR_PROXY_USERNAME`, `LUMINOR_PROXY_PASSWORD`.

## Svetainė

Šaltinis – `site/` (puslapiai `performance.html` (pagrindinis; `index.html` tik nukreipia į jį), `overview.html`, bendras `common.js`, `style.css`). `build_site.py` iš `data/nav_history.csv` sugeneruoja `docs/` (įskaitant `docs/data.js` su visais duomenimis); atnaujinimo workflow ją perstato tik tada, kai pasikeičia duomenys. Svetainė talpinama per GitHub Pages: Settings → Pages → Deploy from a branch → `main`, aplankas `/docs`. **Docs aplanko failų ranka netaisyti – juos perrašo `build_site.py`.**

- **Overview / Apžvalga** – kiekvienos amžiaus grupės lentelė ir linijų grafikas.
- **Performance & peers / Rezultatai ir palyginimas** – visos rinkos grąžos ir vietų matricos, vienas grafikas su grupės ir tiekėjų pasirinkimu, rodikliai (metinė grąža nuo įsteigimo, kalendorinė, slenkanti, svyravimas, didžiausias kritimas).
- Kalbos: EN (numatyta) ir LT.
