# Pensijų fondų dashboard — instrukcijos Claude

Lietuvos II ir III pakopos pensijų fondų analitinė svetainė (GitHub Pages, `noindex`, niekur nereklamuojama). Savininkas Vytis – ne programuotojas, bendrauja lietuviškai. Jei užduotis prieštarauja taisyklėms – sustok ir paklausk.

## Taisyklės

1. **Tik `main` šaka.** Jokių naujų šakų ir PR (savininko sprendimas 2026-10-14 – jis kodo netikrina). Commit'ai ir push tiesiai į `main`, tik po patikros (žr. „Patikra“).
2. **Taupyk limitą.** Skaityk tik tai, ko reikia užduočiai (žr. „Failų žemėlapis“). Neskaityk `git log` istorijos, archyvo, sugeneruotų failų. Didelius CSV žiūrėk tik `head`/`tail`/`grep`. Svetainės peržiūra naršykle (Playwright) – tik kai keitei puslapį, vienas patikrinimas.
3. **Viskas nemokama.** Jei kažkas kainuotų – nedaryk, paaiškink ir lauk patvirtinimo.
4. **Viešas repo ir svetainė:** jokių asmeninių duomenų, savininko failų, slaptažodžių. Raktai tik GitHub Secrets. Svetainėje nerašyti, kad kodas viešas, ir nenurodyti GitHub.
5. **Svetimų repozitorijų neliesti:** `VytisCode/Daily-LT-funds-NAV-data-collector`, `fundsautomationbot-oss/Daily-LT-funds-NAV-data-collector` – tik skaityti.
6. **Istorinių duomenų** (`data/*.csv`) niekada netrinti ir neperrašyti; papildyti tik tuščius laukus.
7. Kai reikia savininko veiksmų – žingsnis po žingsnio, paprastai, kad galėtų padaryti telefonu.

## Ką Claude daro pats / tik siūlo

- Pats: klaidų taisymai, smulkūs patobulinimai, patvirtinti punktai iš `IDEAS.md`, sugedusio duomenų rinkimo taisymas.
- Tik siūlo (diegia po patvirtinimo): naujos didelės funkcijos, funkcijų šalinimas, fondų palyginimo logikos keitimas, kas kainuoja.
- Fondai lyginami tik peer grupėse: gyvenimo ciklo – pagal gimimo metų grupę; turto išsaugojimo – tarpusavyje.

## Failų žemėlapis

**Duomenų rinkimas (Python):** `update.py` (kasdienis rinkimas, `python update.py status`), `sources/*.py` + `base_scraper.py` (valdytojų skaitytuvai), `fund_links.py` (visos nuorodos), `store.py` (įrašymas į `data/nav_history.csv`), `pillar3.py` (III pakopa, `status`), `riskfree.py` (€STR), `indexes.py`, `daily_report.py` (vakarinis laiškas), `notify.py` (ciklo laiškas).
**Svetainės duomenys:** `build_site.py` generuoja `docs/` iš `site/` + `data/`; dalis duomenų – `aum.py`, `reports.py`, `portfolios.py`, `bonds.py`, `journey.py`.
**Puslapiai (šaltinis `site/`):** `performance.html`+`perf.js` (Rezultatai), `overview.html`, `pillar3.html`+`p3.js`, `portfolios.html`+`pf.js`, `reports.html`+`rep.js`, `aum.html`+`aum.js`, `journey.html`+`journey.js`+`insights.js`; bendri `common.js`, `style.css`, `events.js`.
**Vienkartiniai:** `import_*.py`, `backfill_*.py`, `tools/` – neskaityti, nebent užduotis apie juos.
**Darbo eigos:** `.github/workflows/update.yml` (rinkimas + build + laiškas; keisti tik būtinai), `notify.yml`.
**Idėjos:** `IDEAS.md` (aktyvus sąrašas). Ciklo nurodymas: `CIKLO-NURODYMAS.md`.

**NESKAITYTI (dideli / sugeneruoti):** visas `docs/` (generuojamas – taisyti `site/`), `data/portfolios.csv` (14 MB), `data/nav_history.csv` (5 MB), `data/pillar3_history.csv` (4 MB), `data/indexes.csv`, `imports/` (pradiniai failai), `archyvas/`, `data/last_update_log.txt` (tik `tail`). Draudimai įrašyti `.claude/settings.json`.

## Patikra prieš push

1. `python build_site.py` veikia be klaidų.
2. Jei keistas puslapis – atsidaro be JS klaidų (Playwright, Chromium `/opt/pw-browsers/chromium`).
3. Po build atstatyk `docs/data.js`, `docs/data3.js` ir `?v=` maišas HTML, jei keitėsi tik „generated“ laikas (`git checkout -- docs/...`).
4. `git pull --rebase origin main`, tada `git push origin main`.

## Kai duomenų rinkimas sugenda

Galima taisyti ir įdiegti be patvirtinimo, bet: keisti tik sugedusio fondo kodą; nauja reikšmė turi būti šviežia ir įtikėtina (ne nulis, be neįprasto šuolio); jei patikra nepavyksta ar reikia mokamo sprendimo – nediegti, parašyti ataskaitoje. Luminor eina per apmokėtą Proxy-Cheap proxy (duomenys – GitHub Secrets).

## Komunikacija

- Projekto paštas: fundsautomationbot@gmail.com. Kasdien viena trumpa ataskaita savininkui (`daily_report.py`); jokių papildomų laiškų apie tuščius paleidimus.
- Ciklo laiškai – viena laiškų gija (`notify.py`). Savininko atsakymus įrašyti į `IDEAS.md`.
- Įspėti prieš Proxy-Cheap prenumeratos atnaujinimą.
