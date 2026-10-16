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

## Ką Claude daro pats / tik siūlo (savininko sprendimas 2026-10-16)

Claude – šio projekto **produkto savininkas (product owner)**. Tikslas – ilgalaikis, kuo savarankiškiau veikiantis įrankis pensijų fondų rinkos analizei ir ataskaitoms, kurio duomenimis galima pasitikėti (istoriniai duomenys ir senos ataskaitos duodami kalibravimui).
- Pats ieško problemų ir jas taiso, siūlo ir diegia geriausius (world class) sprendimus, net jei savininkas apie juos dar negalvojo; galvoja ilgalaikiai (kodas turi veikti ir be Claude).
- Pats: klaidų taisymai, patobulinimai, naujos funkcijos, atitinkančios tikslą, duomenų rinkimo automatizavimas. Apie didesnius pakeitimus – trumpai po fakto (ką ir kodėl).
- Klausia tik: kas kainuoja, esamų funkcijų šalinimas, fondų palyginimo logikos keitimas, kai trūksta informacijos iš savininko. Kai reikia savininko veiksmų – visada aiškiai praneša, žingsnis po žingsnio.
- Skaičiavimai, atkartojantys valdytojų ataskaitas (pvz. KID/PID scenarijai), turi dvi versijas: „kaip valdytojo ataskaitoje“ (su jų klaidomis) ir „teisingai pagal reglamentą“; skirtumai detaliai paaiškinami svetainėje ir Excel faile.
- Fondai lyginami tik peer grupėse: gyvenimo ciklo – pagal gimimo metų grupę; turto išsaugojimo – tarpusavyje.

## Failų žemėlapis

**Duomenų rinkimas (Python):** `update.py` (kasdienis rinkimas, `python update.py status`), `sources/*.py` + `base_scraper.py` (valdytojų skaitytuvai), `fund_links.py` (visos nuorodos), `store.py` (įrašymas į `data/nav_history.csv`), `pillar3.py` (III pakopa, `status`), `riskfree.py` (€STR), `indexes.py`, `daily_report.py` (vakarinis laiškas), `notify.py` (ciklo laiškas).
**Svetainės duomenys:** `build_site.py` generuoja `docs/` iš `site/` + `data/`; dalis duomenų – `aum.py`, `reports.py`, `portfolios.py`, `bonds.py`, `journey.py`.
**Puslapiai (šaltinis `site/`):** `performance.html`+`perf.js` (Rezultatai; `performance3.html` – tas pats su III pakopa, generuoja `build_perf3`), `overview.html`, `pillar3.html`+`p3.js`, `portfolios.html`+`pf.js`, `reports.html`+`rep.js`, `aum.html`+`aum.js`, `journey.html`+`journey.js`+`insights.js`; bendri `common.js` (+ `xl.js` Excel rašytuvas, skirtukai `showTab`/`addSubnav`, paieška), `style.css`, `events.js`, `methodology.js`; „Kurį fondą rinktis?“ – `choose.js`; rinkos įžvalgos – `insights.js` (Rezultatų skirtukas). Ilgi puslapiai suskirstyti į skirtukus `[data-tab]`.
**Kasdien per `update.yml`:** `tools/fetch_isin_names.py`, `tools/fetch_security_terms.py`, `tools/fetch_cpi.py`, `tools/fetch_pension.py`.
**Vienkartiniai:** `import_*.py`, `backfill_*.py`, kiti `tools/*` (`probe_*` – senos patikros) – neskaityti, nebent užduotis apie juos.

**Kaip skaityti didelius JS/Python failus** (`perf.js`, `journey.js`, `common.js`, `pf.js` – 60–110 KB, kai kurios eilutės iki 4000 simbolių): niekada neskaityti viso failo. Pirma skyrių sąrašas `grep -n "^/\* ----------" site/perf.js` (Python: `grep -n "^# ---\|^def " update.py`), arba `grep -n "raktažodis"`, tada `Read` tik reikiamas eilutes (`offset`/`limit`).
**Savarankiškumas:** `tools/smoke_test.py` – kasdien po build atidaro visus puslapius (JS klaidos, tuščios lentelės) → `source_status.json` raktas `site` → vakarinis laiškas. `tools/ops_log.py` – duomenų įvykių žurnalas (Duomenų kalendorius `ops.html`).
**Darbo eigos:** `.github/workflows/update.yml` (rinkimas + build + laiškas; keisti tik būtinai), `notify.yml`.
**Idėjos:** `IDEAS.md` (aktyvus sąrašas). Ciklo nurodymas: `CIKLO-NURODYMAS.md`.

**NESKAITYTI (dideli / sugeneruoti):** visas `docs/` (generuojamas – taisyti `site/`), `data/portfolios.csv` (14 MB), `data/nav_history.csv` (5 MB), `data/pillar3_history.csv` (4 MB), `data/indexes.csv`, kiti `data/*.csv` (tik `head`), `imports/` (pradiniai failai), `site/fonts/`, `archyvas/`, `README.md` (žmonėms), `data/last_update_log.txt` (tik `tail -40`). Draudimai įrašyti `.claude/settings.json`.

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
