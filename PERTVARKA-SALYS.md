# Trys šalys viename dashboard – projekto planas

Savininko sprendimas 2026-11-10: atskiras „Baltijos šalys“ skyrius atsisakomas. Vienas dashboard, viršuje jungiklis **LT | LV | EE**;
visos šalys turi tą pačią navigaciją ir valdiklius kaip dabartinė Lietuvos versija (ji – pavyzdys). Atskiras puslapis lieka tik
**Baltijos šalių palyginimui**. Kalbos: LT, EN, LV, ET. Claude veda projektą pats, etapais, ir kiekvieno pranešimo pabaigoje
primena, kuriame etape esame.

**Atšaukimas:** paskutinė versija prieš pertvarką – commit `85f4dee` (2026-11-10). Grąžinti: `git revert` pertvarkos commit'us
arba `git checkout 85f4dee -- site/ build_site.py` ir `python build_site.py`. Dabartinis `baltic.html` veikia iki 4 etapo pabaigos.

## Susitarimai
- Kur šalies duomenų nėra – meniu punktas ar skirtukas lieka matomas, bet pilkas; paspaudus – kortelė „kodėl nėra ir ką rodome vietoj“
  (`common.js` `CTRY_PAGES`, `ctryNa`). „Apie“ – lentelė, kas yra kiekvienoje šalyje.
- Peer grupės: LV – pagal akcijų dalį (≤30 %, 31–75 %, >75 %), EE – pagal 3 m. svyravimą (rizikos grupės). Savininkas 2026-11-12 aptars su
  vietos analitikais (priminimas – `data/owner_reminders.csv` → vakarinis laiškas).
- LV/EE naujienos – tokios pačios kaip LT (Google News + RSS, be AI vertimo).
- Kalbų sistema: `lang` lieka 'lt' | 'en' (turinio kalba kode), `ulang` – 'lt' | 'en' | 'lv' | 'et' (sąsajos kalba). `I18N.lv` / `I18N.et`
  paveldi `I18N.en` (ko neišversta – rodoma angliškai); `addStrings3(lv, et)` – vertimai. Nauja funkcija = tekstai 4 kalbomis.
- Šalis: `CTRY` (`localStorage` 'ctry'); puslapio šalis – iš puslapio (`baltic_lv*` → LV, `baltic.html` → `CR.c`), kitur LT.

## Etapai
| # | Kas | Būsena |
|---|-----|--------|
| 0 | Atšaukimo taškas, šis planas, šalies jungiklis antraštėje, pilki meniu punktai su paaiškinimu, 4 kalbų sistema (meniu ir antraštė LV/ET), priminimas laiške | PADARYTA 2026-11-10 |
| 1 | Rezultatai (II ir III pakopa, visi skirtukai kaip LT) ir Valdytojai LV/EE – meniu veda į šalies versijas, grupės kaip LT; LT pranešimai (LB failai) nerodomi LV/EE puslapiuose | PADARYTA 2026-11-10: šalies skirtukų juosta pagal meniu skyrių (`common.js` `bxTabs`), LV grupių tvarka nuo konservatyviausios, šalies „Duomenys iki“, „Apie“ – lentelė „Kas yra kiekvienai šaliai“. Dar trūksta (pilka): Grupių grafikai, Rinkos įžvalgos, Kategorijų grafikai – 2 etape |
| 2 | Turtas (Turto pokytis jau yra), Rinkos faktai (faktų kortelės, mėnesio apžvalga), Pradžia LV/EE, Grupių/Kategorijų grafikai ir Rinkos įžvalgos LV/EE | PADARYTA 2026-11-10 (didžioji dalis): Grupių/Kategorijų grafikai (`baltic_*_ov.html`), Pradžia `index_lv/ee.html` (Šiandien) ir Rinkos faktai `facts_lv/ee.html` (Ketvirčio, Mėnesio faktai, II ir III pakopa, Rinka laike, Fondai pagal grupes) iš kasdienių duomenų ketvirčio pabaigoje (`baltic.py mkt` → `data_mkt_lv/ee.js`, tas pats `mkt.js`); šaltinių pavadinimai šalies kopijose (`ctryTexts`). Perkelta į 3 etapą (pilka, `HOME_NA`): Naujienos, Uždarbis eurais, Faktai visuomenei, Rinkos įžvalgos, mėnesio apžvalga |
| 3 | LV/EE naujienos, valdytojo puslapis, mėnesio apžvalga, Uždarbis eurais, Faktai visuomenei, Rinkos įžvalgos | PADARYTA 2026-11-10: Šiandien (valdytojai), Rinkos įžvalgos (`insights.js` `inBxAum`), naujienos, Uždarbis eurais (`baltic.py earn` → `data_earn_lv/ee.js`, `earnings.pillar`), Faktai visuomenei (be LT atlyginimų), mėnesio apžvalga `review_lv/ee.html` (sujungimai atskirai), Valdytojas ir fondas `manager_lv/ee.html` (`mgr.js` CTRY režimas, `build_site.ctry_mgr_data` → `data_mgr_lv/ee.js`: AUM, REP, TOPS); LV Rezultatai – kasdienės vertės; „Rinkos dalis laike“ – trūkstamų perimtų fondų žymos (`share_gaps`). Likę LT specifiniai tekstai – 4 etape kartu su vertimais |
| 4 | Visi tekstai LV ir ET; „Baltijos šalys“ → tik „Baltijos šalių palyginimas“; senų Baltijos šalies skirtukų išėmimas | VYKDOMA (2026-11-10): meniu jau veda į bendrus puslapius, o „Baltijos šalių palyginimas“ – tik palyginimas. Išversta: bendri `common.js` tekstai (`addStrings3` antras blokas), skirtukų pavadinimai (`TX`/`txNav`), Rezultatų, Pradžios, Valdytojo ir Mėnesio apžvalgos antraštės ir stulpeliai (`addStrings3` po pirmo `addStrings` kiekviename faile). Liko: ilgi paaiškinimai ir `L ? … : …` tekstai kode (~750 vietų, angliškai), Portfeliai/Ataskaitos/Kelias į pensiją (LT puslapiai). Vertimai – Claude; kolegos latviai ir estai turėtų perskaityti. Seni `baltic.html` šalies skirtukai lieka, kol Vytis patvirtins. |
| vėliau | Pilni LV/EE portfeliai iš valdytojų svetainių – tik savininkui sutikus | – |
