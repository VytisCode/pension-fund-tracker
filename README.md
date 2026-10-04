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
