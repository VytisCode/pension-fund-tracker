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
**Svetainės duomenys:** `build_site.py` generuoja `docs/` iš `site/` + `data/`; dalis duomenų – `aum.py`, `reports.py`, `portfolios.py`, `bonds.py`, `journey.py`, `earnings.py` (Pradžios skirtukas „Uždarbis eurais“ → `docs/data_earn.js` + `site/earn.js`).
**LB rezultatų istorija:** `lb_history.py` – visi LB II/III pakopos ketvirčių rezultatų failai (2015-03 → dabar; `imports/lb_history/` + naujus parsisiunčia `tools/fetch_lb.py`) → `data/lb_results_history.csv`: fondų dalyviai, grynieji aktyvai, grąžos, lyginamieji indeksai, rizika, BAR/BIK, LB svertiniai grupių vidurkiai (svoriai – aktyvai ataskaitos dieną), valdymo įmonių sumos.
**Puslapiai (šaltinis `site/`):** Dviejų puslapių bendra skirtukų juosta (`common.js` `TAB_GROUP`, `PAGE_ALIAS`): III pakopa = `pillar3` + `performance3`, II pakopa = `performance` + `overview`. `performance.html`+`perf.js` (Rezultatai; `performance3.html` – tas pats su III pakopa, generuoja `build_perf3`), `overview.html`, `pillar3.html`+`p3.js`, `portfolios.html`+`pf.js`, `reports.html`+`rep.js`, `aum.html`+`aum.js`, `journey.html`+`journey.js`+`insights.js`; Pradžia `index.html` (vienas šaltinis trims puslapiams – `build_home_split`, skirtukų vieta `common.js` `TAB_HOME`: Pradžia = Šiandien, Naujienos; `facts.html` Rinkos faktai = Ketvirčio, Mėnesio faktai, Faktai visuomenei, Uždarbis, II ir III pakopa, Rinka laike, Fondai pagal grupes; `managers.html` = Valdytojai – `mkt.js`, duomenys `market.py` → `docs/data_mkt.js`; faktas = sakinys + `nums` su Excel formulėmis, `mkFactBook`); skyrių nuotraukos `site/img/` (`sec-*` juosta – `common.js` `SEC_IMG`, `tile-*` – Pradžios plytelės); bendri `common.js` (+ `xl.js` Excel rašytuvas, skirtukai `showTab`/`addSubnav`, paieška), `style.css`, `events.js`, `methodology.js`; „Kurį fondą rinktis?“ – `choose.js`; rinkos įžvalgos – `insights.js` (Rezultatų skirtukas). Ilgi puslapiai suskirstyti į skirtukus `[data-tab]`.
**Baltijos šalys:** `tools/fetch_baltic.py` (Latvija – manapensija.lv, Estija – pensionikeskus.ee → `data/baltic_*.csv`, tik papildo) ; LV II pakopos plānų ketvirčio ataskaitos (PDF, `pdftotext`) – `tools/fetch_lv_reports.py` → `data/lv_reports.csv` (turtas), `data/lv_holdings.csv` (10 didžiausių), `data/lv_files.csv`; EE fondų 10 didžiausių – `tools/fetch_ee_reports.py` (pensionikeskus.ee mėnesio ataskaitos) → `data/ee_holdings.csv`; LV rinkos suma – `tools/fetch_lv_lb.py` (Latvijas Banka lentelė 325, Playwright) → `data/baltic_lv_lb.csv`) → `baltic.py` → `docs/data_baltic.js`; puslapis `baltic.html`+`baltic.js` (viršuje šalies/pakopos juosta `common.js` `bxBar`/`bxTabs`; šalies skirtukai: Apžvalga, Visa rinka, Rizika, Valdytojai, Didžiausios investicijos – `baltic.html#c=LV&pl=II&tab=…`; Lyderiai ir judesiai, Fondų palyginimas, Metai ir mėnesiai, Kilimas ir kritimas – `perf.js` kopijos `baltic_lv(3).html`, `baltic_ee(3).html` su `docs/data_bx_*.js` (`baltic.py perf_data`, `build_site.py build_baltic_perf`, `PLX`), `baltic_lt(3).html` – Lietuvos duomenys; „Šalių palyginimas“: panaši rizika, metų grąžos, laisvas palyginimas, reformos EE 2021 vs LT 2026; infliacija – Eurostat SVKI `tools/fetch_hicp.py` → `data/hicp.csv`).
**Naujienos:** `tools/fetch_news.py` (kasdien: Google News + leidinių ir organizacijų RSS → `data/news.csv`, tik papildo; tikras adresas ir aprašas be AI – `article_url`, `--enrich`), `tools/fetch_seimas.py` (Seimo darbotvarkių pensijų klausimai → `data/seimas.csv`), veikėjai – `news_tags.py` → `docs/data_news.js`; Pradžios skirtukas „Naujienos apie pensijas“ – `site/news.js` (įžvalgos, temų laiko juosta, „Kas kalba“, Seimas, sąrašas); straipsniai ir viršutinėje paieškoje.
**Kasdien per `update.yml`:** `tools/fetch_isin_names.py`, `tools/fetch_security_terms.py`, `tools/fetch_cpi.py`, `tools/fetch_pension.py`.
**Vienkartiniai:** `import_*.py`, `backfill_*.py`, kiti `tools/*` (`probe_*` – senos patikros) – neskaityti, nebent užduotis apie juos.

**Kaip skaityti didelius JS/Python failus** (`perf.js`, `journey.js`, `common.js`, `pf.js` – 60–110 KB, kai kurios eilutės iki 4000 simbolių): niekada neskaityti viso failo. Pirma skyrių sąrašas `grep -n "^/\* ----------" site/perf.js` (Python: `grep -n "^# ---\|^def " update.py`), arba `grep -n "raktažodis"`, tada `Read` tik reikiamas eilutes (`offset`/`limit`).
**Savarankiškumas:** `tools/smoke_test.py` – kasdien po build atidaro visus puslapius (JS klaidos, tuščios lentelės) → `source_status.json` raktas `site` → vakarinis laiškas. `tools/ops_log.py` – duomenų įvykių žurnalas (Duomenų kalendorius `ops.html`).
**Darbo eigos:** `.github/workflows/update.yml` (rinkimas + build + laiškas; keisti tik būtinai), `notify.yml`.
**Idėjos:** `IDEAS.md` (aktyvus sąrašas). Ciklo nurodymas: `CIKLO-NURODYMAS.md`.

**NESKAITYTI (dideli / sugeneruoti):** visas `docs/` (generuojamas – taisyti `site/`), `data/portfolios.csv` (14 MB), `data/lb_results_history.csv` (tik `head`), `data/nav_history.csv` (5 MB), `data/pillar3_history.csv` (4 MB), `data/baltic_ee.csv` (7 MB), `data/baltic_lv_index.csv`, `data/indexes.csv`, kiti `data/*.csv` (tik `head`), `imports/` (pradiniai failai), `site/fonts/`, `archyvas/`, `README.md` (žmonėms), `data/last_update_log.txt` (tik `tail -40`). Draudimai įrašyti `.claude/settings.json`.

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
