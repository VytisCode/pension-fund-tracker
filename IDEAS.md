# Idėjos – aktyvus sąrašas

Čia tik tai, kas dar laukia darbo. Atlikti ir atmesti punktai, sena istorija ir visi ankstesni savininko atsakymai – `archyvas/IDEAS-iki-2026-10-14.md` (**neskaityti**, nebent reikia konkretaus seno sprendimo – tada `grep`).

Būsenos: *nauja → patvirtinta → daroma → atlikta*. Atliktą punktą **ištrinti iš šio failo** ir vienos eilutės įrašą pridėti į `archyvas/ATLIKTA.md` (data, punktas, commit). Taip šis failas lieka trumpas.

## Galiojantys savininko sprendimai

- Vieneto vertės jau po mokesčių – mokesčių iš grąžos dar kartą neatimti.
- Lyginamieji indeksai (benchmark): daugiau duomenų nebus, langeliai lieka tušti. **Neklausti.**
- Kompiuterio ekranas pirmiau, telefonas antroje vietoje.
- Svetainėje skaidrumas apie šaltinius, prielaidas ir netikslumus; kas mėnesį priminti apie pasenusius duomenis.
- Svetainėje niekada nerašyti, kad kodas viešas, ir nenurodyti GitHub nuorodų.
- Dalykiškas tonas, be kreipinių į lankytoją. Grafikai aštrūs, ne „dailės parodai“.
- SEB – atskaitos fondas savininko „Performance & peers“ vaizde (grąža, skirtumas nuo konkurentų, vieta 1–6, metinė).
- 2026-10-10: visos tuo metu „naujos“ Claude idėjos atmestos – jų nesiūlyti iš naujo (sąrašas archyve).
- **2026-10-14: dirbti tik `main` šakoje, be naujų šakų ir PR** (savininkas kodo netikrina). Ciklai sustabdyti, kol savininkas paprašys atnaujinti.
- **2026-10-14: SEB valdymo mokestis** – mokestiniu laikotarpiu 2026-02-03–2026-05-17 visiems SEB II pakopos fondams, **išskyrus turto išsaugojimo**, taikytas 0,40 %, kitu metu – 0,50 % (SEB pusmečio ataskaitos). Skaičiavimuose taikoma (`rep.js` `FEE_WINDOWS`).
- **2026-10-14: lyginamasis valdytojas visada pasirenkamas, pagrindinio valdytojo nėra** (galioja ir pradžios puslapiui #42). Kol nepasirinkta – lyginti su kitų valdytojų mediana.
- 2026-10-14: ciklų nebepaleidinėti – darbai atliekami iš karto pokalbyje.
- 2026-10-14: #65 ateities scenarijai – savininkas nori visų 3 variantų (Sodra + LB keliai, tik kaupimas, pagal KID); KID variantas laukia savininko medžiagos (žr. „Ateityje“).
- 2026-10-14 (atsakymai): eilė 9–15 daroma iš karto, paketas po paketo; „Relative to the peers“ – kol valdytojas nepasirinktas, lyginama su kitų mediana (tinka); Ataskaitose renkamas bet kuris ketvirčio galas, iš pradžių paskutinis; SFDR – tiesioginės akcijos, obligacijos, indėliai, išvestinės – eilutė „Neklasifikuojama“; mokesčių lentelė pildoma iš LB mokesčių failų (`data/fees.csv`, `import_lb_fees.py`). Artea Ambicingas Active 16+ −78,8 % savininkas patikrino – duomenys teisingi.

- 2026-10-14: „Mokesčių poveikis“ – tik „Kelias į pensiją“ (iš Rezultatų išimta); turto vaizde rodyti ir rinkos dalį, ir ketvirčio pokytį (%); KID scenarijai – „Ataskaitų“ apačioje.

## Laukia savininko (nieko nedaryti, kol neatsakys)

- Saugumas: 2026-10-12 į projekto dėžutę atėjo GitHub raktas atviru tekstu. Patarta jį atšaukti. Raktas nenaudotas.

## Nedaryti (savininkas atmetė)

Audito #3, #4, #13 (stulpelio „Sodra €“ neslėpti), #29, #33, #35, #37, #47, #56, #58, #62.

## Ateityje (savininkas pateiks medžiagą, kai bus baigti dabartiniai darbai)

- Ataskaitos: SFDR dar nežinomas ~40 mažesnių fondų (daugiausia Baltijos privataus kapitalo / NT) – papildyti `data/fund_attributes.csv`, kai bus šaltinis.

- Fondų dalyvių skaičiai iš LB ataskaitų – **duomenys yra** (2026-10-19: savininkas atsiuntė 93 LB rezultatų failus 2015–2026, `lb_history.py` → `data/lb_results_history.csv`, atnaujinama automatiškai kas ketvirtį). **Padaryta 2026-10-19:** Pradžios puslapis perdarytas (savininko prašymu – „LIPFA ir visai rinkai“): skirtukai Šiandien, Ketvirčio faktai (kopijuojami sakiniai su šaltiniu, paryškinamas valdytojas), Rinka laike, Valdytojai, Fondai pagal grupes. II pakopos 2015-06-30 failo nėra – LB klaida (nuoroda atidaro III pakopos failą), lieka tuščia. **2026-10-19 (2):** kiekvienas faktas ir lentelė – Excel su formulėmis iš LB duomenų (patikrinta perskaičiavus LibreOffice – sutampa su svetaine); nauji skirtukai „Faktai visuomenei“ (eurais, per dieną, vienam dalyviui, padvigubėjimas) ir „II ir III pakopa“ (III/II santykis, III augimas ir pagreitis pagal valdytoją, srautai, II+III dalys); valdytojų įžvalgų ir stiprybių (#1 grupėje) kortelės; Šiandien – ketvirčio santrauka; Įrankiai › žalių duomenų atsisiuntimas. **Kitos (pasiūlyta Vyčiui 2026-10-19, jis „lauks naujų idėjų“):** 1) ~~ketvirčio apžvalgos juodraštis~~ **padaryta 2026-10-19:** „Ketvirčio faktai“ › „Apžvalgos juodraštis (Word)“ – .docx su visais faktais, „kaip skaičiuota“, lentelėmis ir 9 grafikais (`quarterReview` mkt.js); taip pat Rezultatuose laikotarpiai 1 d. ir 1 sav.; 2) ~~mėnesio faktai~~ **padaryta 2026-10-20:** skirtukas „Mėnesio faktai“ (`renderMf`, Excel `mfBook`); **2026-10-20 savininko prašymu kortelės perdarytos:** išskleidus – laikotarpis (1/3/5/10 m., visa istorija nuo 2015 m.), vaizdas (laike / pokytis per ketvirtį / per metus / palyginimas), valdytojų pasirinkimas, grupė; sakinys, grafikas ir lentelė persiskaičiuoja (`exOf` + `EXK` mkt.js); sakiniai perrašyti kopijavimui (be „+“, „padidėjo/sumažėjo“, linksniai `ltN`); 3) palyginimas su Latvija ir Estija (grąžos, mokesčiai). Toliau galima: tarptautiniai palyginimai (OECD), vietinės investicijos, faktai iš kasdienių duomenų (mėnesio grąža), III pakopos žmonių (ne dalyvavimų) skaičius iš LIPFA/Sodros.

## Savininko prašymai 2026-10-21 (rytas) – padaryta tą pačią dieną
- „Uždarbis eurais“ (Pradžia): kiek eurų fondas, valdytojas ar visa pakopa uždirbo/prarado iš investicijų per dieną, mėnesį, ketvirtį, metus; prieš reformą ir po jos; Excel su formulėmis (`earnings.py`, `site/earn.js`).
- Reformų palyginimas Estija 2021 vs Lietuva 2026 (Baltijos šalys → Reformos): dalyviai, turtas, grynasis srautas nuo reformos pradžios, sąlygos su šaltiniais.
- „Naujienos apie pensijas“ (Pradžia + 5 naujausios „Šiandien“): `tools/fetch_news.py` kasdien, archyvas `data/news.csv` nuo 2019 m. (480 straipsnių pradžioje), temos, grafikas, Excel analizei. Savininkas: „jei vien kodo pagalba neįmanoma – neverta“ → veikia be Claude.
- Tikrinta: manapensija.lv plānų turto, dalyvių ir portfelių neskelbia (tik akcijų dalis, valdymo tipas, aprašas); pensionikeskus.ee portfelių neskelbia; 2026-10-21 rytą jų statistikos puslapiai grąžino 503 (stebėti kasdienį rinkimą).
- **Savininko atsakymai 2026-10-21 05:06:** (1) AI santraukų (Claude API) – NE: nenori išlaidų, dashboard turi būti kuo savarankiškesnis → santraukos tik iš straipsnio aprašo (og:description), be AI. (2) Nauji šaltiniai – TAIP: Latvijas Banka statistika (LV turtas, dalyviai), LV/EE valdytojų svetainės (portfeliai). Baltijos grąžų „heatmap“ – daryti.
- **Naujas prašymas 2026-10-21 05:06 (padaryta, žr. žemiau):** naujienų laiko juosta – kiek laiko tema buvo aktuali, kada pradėta ir baigta kalbėti; kurios partijos, organizacijos, Sodra, Seimas, LIPFA ir pavieniai komentatoriai (pvz. Lazutka, Rukas – be atskirų asmens kortelių, „nes tai būtų nepagarba“) ką sakė ir kaip pozicija keitėsi laike; ką svarsto Seimas. Facebook įrašų automatiškai gauti negalima; pozicija be AI nustatoma tik apytiksliai – rodomos antraštės chronologiškai, vertina skaitytojas.
- **Padaryta 2026-10-21:** skirtukas „Naujienos apie pensijas“ – įžvalgų kortelės (kas dabar karšta, kiek savaičių tema aktuali, vėl iškilusi, užgesusi, didžiausia banga, dažniausiai minimi veikėjai, naujas balsas, Seimas), temų laiko juosta su „bangomis“ ir Seimo eilute, „Kas kalba“ (veikėjų × laikotarpių lentelė, pasisakymai laiko tvarka su paryškintais „siūlo/kritikuoja/pritaria“), „Ką svarsto Seimas“ (LRS atviri duomenys 2016–2026, `tools/fetch_seimas.py`), laikotarpio filtras ir savos datos, Excel (bangos, veikėjai su COUNTIFS, Seimas); straipsniai ir viršutinėje paieškoje. Aprašai be AI – iš straipsnio puslapio (og:description), papildoma kasdien po truputį. Sodra, e-seimas, lb.lt Actions'ams grąžina 403; Facebook – neįmanoma.
- **Toliau:** Latvijas Banka statistika (LV turtas, dalyviai), LV/EE valdytojų portfeliai, Baltijos grąžų „heatmap“; naujienų veikėjų sąrašą pildyti (`news_tags.py`), kai atsiranda naujų balsų.

## Baltijos šalys – Latvija ir Estija (savininko atsakymai 2026-10-20 19:23) – 1 etapas padarytas 2026-10-20
- **Padaryta:** meniu „Baltijos šalys“ (`baltic.html`): apžvalga, panašios rizikos palyginimas tarp šalių, visi fondai (filtrai, rikiavimas), laisvas palyginimas, metodika, Excel su formulėmis; kasdien `tools/fetch_baltic.py`. Estijos 1/3/5 m. grąžos sutampa su pensionikeskus.ee (±0,01 p. p.).
- **Toliau:** Latvijos plānų turtas ir dalyviai (manapensija.lv neskelbia; galbūt ketvirčio ataskaitose – file-list API); Latvijos kintamoji mokesčio dalis; Estijos III pakopos dalyviai; Estijos fondų akcijų dalis; ilgesnė LT istorija iš LB duomenų; faktų kortelės apie Baltijos šalis; „Kuo gali pasigirti“ Baltijos mastu.
- Šaltiniai – tik nacionalinės svetainės: Latvija manapensija.lv, Estija pensionikeskus.ee / pensionifondid (Pensionika). Viskas nemokama; kolegos patikrinti negali; Vytis, jei reikės, suras atskirų valdytojų ataskaitas sutikrinimui (prašyti konkrečiai).
- Apimtis: II ir III pakopos kartu nuo pradžių; ta pati kokybė kaip LT (šaltinis, Excel formulės, „kaip skaičiuota“).
- Kalbos: LT ir EN – visas dashboard turi būti vienodai suprantamas abiem kalbomis.
- Palyginimas: šalies viduje pagal jos grupes; tarp šalių – tik panašios rizikos, aiškiai pažymėta; bet palikti laisvę lyginti bet ką su bet kuo (vėliau paaiškės, kaip geriau grupuoti).
- Vieta: atskiras meniu skyrius „Baltijos šalys“ su atskirais puslapiais; dabartinio LT dashboard neteršti.

## Valdytojų „Kuo gali pasigirti“ (savininko prašymas 2026-10-20 19:23) – padaryta 2026-10-20
- Pradžia › Valdytojai: kiekvienam valdytojui šiuo metu galiojančios pirmos vietos (didžiausias valdytojas, labiausiai padidino rinkos dalį, daugiausiai naujų dalyvių, geriausia grąža grupėje 5/3/1 m. ir nuo metų pradžios, stabiliausias augimas, mažiausi mokesčiai, visi fondai virš grupės vidurkio); Excel su formulėmis (`bragFacts` mkt.js). Galimos plėtros: III pakopos dalyvių augimas rodomas ir II pakopos vaizde; mėnesio duomenų pirmos vietos.

## UI/UX atnaujinimas (savininko promptas 2026-10-17)
Jau buvo: tamsusis režimas + jungiklis, skirtukai, KPI kortelės, paieška su katalogu, kasdienė puslapių patikra (`tools/smoke_test.py`).
Atlikta 2026-10-17: suskleidžiamas šoninis meniu (savininkas pasirinko; `common.js` `sideUI`, ≤1000 px – ištraukiamas ☰, Esc, fokusas); bendri būsenų komponentai `showLoading` / `showError` / `stateHTML` (`common.js` „Būsenos“); tuščios lentelės ir grafikai, kol kraunasi – rėmeliai (CSS `html:not(.booted)`); tuščias grafikas – „nepasirinktas fondas“ / „laikotarpiui duomenų nėra“; Rinkos įžvalgos – klaida su „Bandyti dar kartą“ (anksčiau amžinai „Kraunama…“).
Toliau (daryti pačiam, eilės tvarka):
- Kiti vėliau kraunami failai (`rep.js` rep_daily/data_pf, `hy.js`, `choose.js` data_rep) – dabar klaida nutylima (`onerror = ok`); naudoti `showLoading`/`showError`.
- Lentelė be eilučių po filtro – bendra būsena „filtras nieko nerado → atstatyti filtrą“ (`tableTools`).
- Temos ir meniu būsena – į `<head>` (be blyksnio kraunant puslapį).
- Klaviatūra: skirtukams `role=tablist` + rodyklės; fokuso žiedai visiems `.seg` mygtukams; kontrasto patikra (WCAG AA) abiem temoms.
- Smoke testas: tikrinti šoninį meniu ir telefono plotį (be horizontalaus slinkimo).

## Eilė: savininko užduotys 2026-10-16

- **Patikimumas (spragos po audito 2026-10-16)**: II/III pakopos vertės turi tik vieną šaltinį (valdytojo svetainė) – ieškoti antro (pvz. valdytojų mėnesinės ataskaitos, LB duomenys) bent istorijai patikrinti; MSCI – vienintelis adresas; S&P 500: Yahoo GitHub paleidimui grąžina 429; savininkas 2026-10-16 – indekso nekeisti (MSCI USA atmesta), ieškoti atsarginio šaltinio. Padaryta: pratęsimas pagal S&P 500 kainų indeksą (FRED, Stooq) + 1,3 % dividendai, pažymimas kaip apytikslis (build_site.sp500_tail); 2026-10-16 bandymai GitHub paleidime: FRED – baigiasi laukimo laikas, Nasdaq API – 400, Stooq – grąžina HTML (ne CSV); priežastys – `data/source_status.json` („idx.SP500_PR“). Toliau: pagal pilną Nasdaq klaidos tekstą pataisyti užklausą arba rasti kitą nemokamą šaltinį (bandyti per naršyklės žingsnį Playwright, kuris jau įdiegtas paleidime); EONIA (iki 2019-10) iš ECB negauta – patikrinti serijos raktą `FM/D.U2.EUR.4F.MM.EONIA.HSTA`.
- **Struktūra ir naršymas** – savininko atsakymai 2026-10-16: (1) dashboard'as – jam darbui, aiškus ir naujokams; (2) sutinka su ~6 skyriais: Pradžia (Šiandien + Mėnesio apžvalga), Rezultatai (II/III pakopa – jungiklis), Valdytojai ir fondai, Portfeliai ir turtas (Portfeliai + AUM + Apžvalga), Ataskaitos, Kelias į pensiją; Apie – apačioje/meniu; (3) II ir III pakopos tarpusavyje lyginti nereikia – tame pačiame puslapyje perjungti vaizdą; (4) nenaudoja „Return vs. Risk“ taškinės diagramos; „Calendar year returns“ ir „Rolling returns“ dubliuojasi – nuspręsti, kur intuityviau (patinka, kaip rodoma Ataskaitose); dažniau lyginami visi fondai su visais viename vaizde, o ne vienos gimimo grupės; laukia ir Claude pasiūlymų, ką trinti / keisti; (5) paieška su katalogu (kaip el. parduotuvėje – matyti, ką galima rasti); (9) eilė: pranešimai → Excel → struktūra; prieš pertvarką – planas / maketas patvirtinti.
  - 2026-10-16: savininkui išsiųstas planas ir maketas (Design artifact „Pensijų fondų dashboard – nauja struktūra“: viršus su paieška ir katalogu, Rezultatai su II/III jungikliu ir skirtukais, schema 11 → 6). Siūloma pašalinti: „Grąža ir rizika“ (taškinė), „Grąža palyginti su grupės vidurkiu“. Savininkas 2026-10-16 15:04: (1) pašalinti abi diagramas – sutinka; (2) metai ir mėnesiai – vienas skaičiavimas dviejose vietose – sutinka, **bet turi būti galima pasirinkti ir savo datas**; (3) skyriai OK, bet katalogo punktai buvo neaiškūs – maketas pataisytas (kiekvienas punktas: ką pamatysi, tipas Lentelė/Grafikas, Excel ženklas, peržiūra). Kryptis patvirtinta – galima pertvarkyti.
  - **Savininko pastabos 2026-10-16 15:57** (atlikta): rinkos lentelės – visada visos keturios (jungiklis pašalintas); grupės pasirinkimas – prie „Fondų palyginimo“ + grupės ženkliukai priklausomose lentelėse; reali grąža – tik linijiniam grafikui; papildomi rodikliai supaprastinti (6 stulpeliai) + €STR šaltinio nuoroda; Valdytojai ir fondai – aiškūs „Duomenys iki“ (naujausi / metų / ketvirčio pabaiga / data), turto grafikui – savi laikotarpio mygtukai, turto lentelė – tik Excel; Duomenų kalendoriaus legendos mygtukai (filtras + artimiausios datos); Portfeliai – nauja „Ketvirčio apžvalga“ viršuje (kas pasikeitė pas valdytojus, kuo išsiskiria – automatiškai, fondų palyginimas), išsami analizė lieka žemiau. Toliau Portfeliuose: palyginimo lentelės Excel su formulėmis; „kuo išsiskiria“ – ir pozicijų lygiu (unikalios investicijos, koncentracija); III pakopa – kategorijos kaip grupės.
  - **Pertvarkos eiga**: ✅ 1) 6 skyrių meniu + skyrių puslapių juosta + paieška su katalogu + `#go=` nuorodos; ✅ pašalintos 2 diagramos; ✅ 2) „Visa rinka“ – rodiklio jungiklis (Grąža / Vieta / Skirtumas / Metinė / Visos keturios). Liko: 3) Pradžia: „Šiandien“ + „Mėnesio apžvalga“ vienas puslapis su Šiandien / Savaitė / Mėnuo / YTD; viena „lyderis ir paskutinis“ lentelė (dabar 3 vietose); 4) III pakopa tais pačiais įrankiais (pakopos jungiklis Rezultatuose); 5) „Metai ir mėnesiai“ – kalendoriniai metai + mėnesių žemėlapis + slenkanti grąža viename, Ataskaitų stiliumi, su savomis datomis; tas pats skaičiavimas Ataskaitose; 6) Bendras reitingas + Vieta pagal laikotarpį – viena lentelė; 7) Fondo kortelė (Valdytojai ir fondai); 8) Lyginamasis indeksas (tik SEB); 9) „Rinkos įžvalgos“ iš Kelio į pensiją → Rezultatai; senų adresų nukreipimai.
- **Excel ir kopijavimas** – daroma. Atlikta 2026-10-16: prie kiekvienos lentelės (75 lentelių, 11 puslapių) ⧉ paveikslėlis, ⊞ lentelė, Excel (lapai Rezultatas / [builderio lapai] / Metodika iš `site/methodology.js`); Excel rašomas be bibliotekų (`site/xl.js`, įterpiamas į docs/common.js; `XLSX_SHIM` – senieji mygtukai veikia per jį, be interneto); „Visa rinka“ (tRet, tRelM, tRank, tAnnM) – pilna formulių grandinė nuo vieneto verčių (INDEX/MATCH), patikrinta LibreOffice. Liko: (1) išsamūs builderiai (`XLB.set(lentelės id, …)`) kitoms lentelėms – rodikliai, kalendoriniai metai, III pakopa, portfeliai, ataskaitos; (2) diagramoms be lentelės – `box._xl` (linijiniai grafikai su serijomis); (3) senų builderių lapams – žingsnių eilutė ir spalvos ranka, kur automatinis stilius netikslus.
  - **2026-10-16 vakaras (savininkas: „Excel nerodo skaičiavimų“)**: lentelės „Excel“ mygtukas dabar atiduoda išsamų failą, kur jis yra (KID, ataskaitos, rinka, rodikliai ir kt.); nauji skaičiavimų failai (formulės → „Skaičiavimai“ → „Vertės“): kalendoriniai metai, mėnesiai, mėnesių šiluma, slenkanti grąža, Lyderiai ir judesiai, Bendras reitingas (RANK/COUNTIF), pradžios puslapio grupės, valdytojo II/III lentelės (vieta – COUNTIFS), turto pokytis ir ketvirčių pabaigos (SUMIFS). Vėliau tą patį vakarą – ir visos likusios: portfelių (ketvirčio pokyčiai, sandoriai, alternatyvios, fondo portfelis, pozicijos istorija, palyginimas, panašumas – SUMIFS/SUMPRODUCT iš LB pozicijų), Kelio į pensiją (anuitetai, palyginimai, indeksai su XIRR, mokesčių poveikis, Kurį fondą rinktis, ateities scenarijai), III pakopos ir apžvalgos kortelės, Sharpe matrica, vieta pagal laikotarpį, valdytojo 10 didžiausių pozicijų. Visi 32 failai perskaičiuoti LibreOffice – formulės atkartoja svetainės skaičius be neatitikimų. Tik vertėmis lieka: prielaidų ir šaltinių sąrašai (juose nėra skaičiavimų).
- **Lyginamojo indekso sekimas (savininko idėja 2026-10-16)**: kiekvienam fondui – kaip seka savo lyginamąjį indeksą: nukrypimas per dieną, savaitę, mėnesį, YTD ir t. t. Grafikas: 1 fondas + 1 jo indeksas; lentelė: visų fondų heatmap (skirtumas, p. p.), kad matytųsi, ar aktyvūs sprendimai padėjo. Pirma patikrinti, kuriems fondams turime kasdienes indekso vertes (dabar – mėnesio pabaigos iš valdytojų; SEB – kasdien KID darbui).
  - **Savininko sprendimas 2026-10-16**: lyginti tik SEB (tik SEB skelbia indekso duomenis); kitiems valdytojams rašyti „indekso duomenys nepaskelbti“ (ateities projektas – gauti); analizuojant ne SEB fondus, indekso palyginimus slėpti, kad nesimaišytų. Neperkrauti – daryti kartu su struktūros pertvarka.

- **Duomenų kalendorius (savininko idėja 2026-10-16)** – atlikta pirma versija: `ops.html` + `ops.js`, įvykiai `data/ops_log.csv` (`tools/ops_log.py` kiekviename paleidime prieš commit; istorija atkurta iš commit'ų nuo 2026-10-04). Rodo: kalendorių (atkeliavo / nepavyko / vėl veikia / laukiama / ranka), dienos įvykius, kada valdytojai paskelbia vertes (II ir III), artėjančius darbus su nuorodomis, nesėkmes. Toliau: įtraukti į naują navigaciją ir paiešką (skyrius „Pagalba“ arba „Pradžia“), mėnesio / ketvirčio statistika (vidutinis vėlavimas pagal valdytoją), LB paskelbimo dienos po ketvirčio pabaigos istorija (kai sukaups), rankiniai darbai – tiksli nuoroda į failą/vietą.

## Eilė: audito paketai (vienas ciklas = vienas paketas)

## Eilė: savininko užduotys 2026-10-14 (vakaras)

- **S9 tęsinys** KID: obligacijų indeksas (ECB 7 m. AAA) pradės kauptis per kasdienį paleidimą – patikrinti, ar atsirado `EUR_GOV7Y` ir ar mišrių / obligacijų fondų scenarijai protingi (SEB 50+, 58+ su PID). Kitų valdytojų PID – surinkti (savininkas atsiųs arba automatiškai).

- **S1 tęsinys – automatizavimas**: LB failai – tools/fetch_lb.py kasdien (lb.lt puslapiai GitHub serveriams grąžina 403, imami tiesioginiai adresai): II ir III pakopos rezultatai ir portfeliai (pf-portfeliai-YYYYMMDD[_].xlsx) randami patys; mokesčių ir lyginamųjų indeksų failų vardai turi nenuspėjamą datą (laukiama savininko nuorodų). Liko rankiniai: MMA (VDA SDMX nėra), valstybės skatinamoji įmoka, Sodros anuitetai, PID skaičiai, fondų atributai.

- **KID scenarijai (savininko sprendimai 2026-10-16: tik SEB, du režimai, SEB Excel failų ateityje nebus, strategijos galioja nuo fondų įsteigimo)**: „Kaip SEB PID“ atkartoja visus 4 SEB III pakopos PID (2026 ir 2023) iki cento; „Pagal reglamentą“ (numatytasis) – fondo vieneto vertės nuo įsteigimo (`own_from`), iki tol pataisytas indeksas minus išlaidos; be SEB failo klaidų; 7(b) langai 12…12n−1 mėn.; stresinis w = 6 mėn. (1 m.) ir 0,5·σS²·N. Excel – formulės + „Instrukcija“ (perskaičiuota LibreOffice – sutampa). Automatinis atnaujinimas: SEB PID indekso eilutės pratęsiamos SEB skelbiamo fondo lyginamojo indekso (`benchmark_index`) mėnesio grąžomis; jis renkamas kasdien iš SEB fondo puslapio CSV „Istorinės fondo vieneto vertės“ (`pillar3.fetch_seb_history`, nuo 2026-10-16 – patikrinti žurnale, ar veikia). Patikra: pratęsus 1 metus skirtumas nuo tikslaus SEB 0–7 €. Solactive ISIN (jei kada reikės komponentų): SOLEUSOV DE000SLA44D6, SOLEUSRC DE000SLA7S63, SOLEUHYC DE000SLA2W47, SOLEBLS DE000SLA8QH7 (CAD), SESGGMN DE000SLA7XH5, SCTBGMN DE000SL0E3B1.

## Senesnės patvirtintos idėjos (prieš imant – patikrinti, ar dar aktualu)

- Ataskaitos: lentelė su vid. vieneto vertės ir indekso pokyčiu bei standartiniais nuokrypiais (6 mėn., 1, 3, 5 m., nuo pradžios) (Meet B13); valdymo mokestis proporcingai laikotarpiui (Meet B16).
- Šviežumo eilutė ir vakariniame laiške („atsilieka: Luminor (2 d. d.)“).
- Duomenų spragos grafike – punktyru.
- „Mano fondas“: pasirinktas fondas paryškinamas visur, įsimenamas naršyklėje.
- Pilka pasaulio akcijų indekso (ETF eurais) linija grafike.
- Heatmap langelio užuomina: fondas, datos, vieneto vertės.
- Paskutinės dienos pokytis („1 d.“ stulpelis apžvalgoje).
- Rinkimo laikų žurnalas vakariniame laiške.

## 2026-10-16 (vakaras) – savininko pastabos
- Turto grafikas: naujas rodinys „Pokytis nuo laikotarpio pradžios, %“, eilutė „Per laikotarpį: X → Y mln. € (±%)“, pasirinkimai „Visa rinka – II / III pakopa“. Sumos rodomos tik kai žinomas visų veikiančių fondų turtas.
- Reformos išmokos (2026–2027): II pakopos ketvirčio pabaigos pinigų / trumpų obligacijų rezervas – ne strategija. Portfeliuose „Akcijos be rezervo“, „Išmokų rezervas“; teiginiai skaičiuojami pagal akcijas be rezervo (REFORM pf.js, iki 2028-03).
- Laukia: kasdienis Swedbank (ir SEB) III pakopos turtas – dabar III rinkos suma naujausia tik iki jų paskutinės datos.

## Ilgas darbas 2026-10-16 (savininkas patvirtino 17:42 – dirbti be sustojimo, pabaigoje laiškas į Gmail)
Susitarimai: dublikatus šalinti pagal 6 skyrių planą; nauji rodikliai – tik kaip papildomi vaizdai; vaizdai suprantami prezentacijoms;
Excel – aiškūs auditoriams (šaltinis+data, žingsniai, patikros eilutės, Metodika). Nieko mokamo, palyginimo logikos nekeisti.
Priminimai tęsti: trig_01EZJuxDucAX4fTyA2cUYDVL, trig_01J6gQ1kJaQHwysV4WKTDCDv, trig_01TmvjqdNrHrT1dNxeno8y3i (ištrinti pabaigoje).
Eiga (žymėti [x]):
- [x] 1 Pradžia: Diena/Savaitė/Mėnuo/Ketvirtis/Metai jungiklis (index.html)
- [x] 2 III pakopa Rezultatuose: performance3.html (perf.js IS3, build_perf3)
- [x] 3 Metai ir mėnesiai: viena kortelė su jungikliu (metai / mėnesiai / slenkanti / vienas fondas); mėnesių grąža sutikrinta su Ataskaitomis
- [x] 4 Bendras reitingas + Vieta pagal laikotarpį – viena kortelė su grupės pasirinkimu
- [x] 5 Fondo kortelė (manager.html#VALD/II:grupė): + kalendoriniai metai su grupe, nuoroda į portfelį (#fund=), grafiko žymos
- [x] 6 Lyginamojo indekso sekimas fondo kortelėje: SEB ir Goindex (data_rep bm), kitiems – „neskelbia“
- [x] 7 Rinkos įžvalgos → Rezultatai (kraunama tik priartėjus); journey.html#ins… → performance.html#go=insTitle
- [x] 8 Kelias į pensiją: „Kurį fondą rinktis?“ (choose.js): balai pagal grąžą, pastovumą, grąžą/svyravimą, kritimus, mokestį; svoriai pagal laiką iki pensijos
- [x] 9 Nauji rodikliai „Papildomuose rodikliuose“: metinė grąža prieš mokestį, grąža / didž. kritimas (Calmar); III pakopai mokesčiai iš data_rep
- [x] 10 PNG: tikslus pavadinimas, laikotarpio paaiškinimas, šaltinis+data; Excel Metodikoje – nuoroda su tuo pačiu vaizdu; pataisytas journey dubliuotas id chTitle
- [x] 11 LV/EE: iš Estijos – svertinis pensijų indeksas (EPI analogas): grupės vidurkis grafike/lentelėse (GAVG), visos rinkos indeksas Pradžioje. LV – skirta dalyviams (testas, skaičiuoklė) – mūsų analogas „Kurį fondą rinktis?“. Idėja vėliau: bendros išlaidos = mokestis + investicinių fondų TER
- [x] 12 Duomenys: S&P 500 – CNBC atsarginis (.SPXTR, .SPX; veikia iš GitHub, 2026-10-09–15 spraga užpildyta); EONIA – pataisytas ECB raktas (EON/D.EONIA_TO.RATE, patikrins kitas paleidimas); III pakopos kasdienis SEB/Swedbank turtas – laukia
- [x] papildomai: portfelių palyginime – valdymo mokestis ir bendros metinės išlaidos (mokestis + fondų TER), kaip Estijos „ongoing charges“
- [x] 13 Galutinė patikra (13 puslapių be JS klaidų, be dubliuotų id, telefono plotis), laiškas išsiųstas; priminimai ištrinti
Laukia: EONIA (būsena „eonia“ šaltinių būsenoje parodys priežastį), Swedbank III kasdienis turtas, SEB III aktyvai iš istorijos CSV (patikrinti po kito paleidimo)

## Ilgas darbas 2: aiškumas kolegoms (savininkas 2026-10-16 19:18)
Užduotis: grafikų formos; atvaizdavimo, turinio tvarkos, kodo optimizavimo, savarankiškumo problemos; kad galima būtų rodyti kolegoms.
Priminimai: trig_0153VxEgvSJzky18DwzKZt8W, trig_01AWkujoiQHNckoAQ56D2GgD (ištrinti pabaigoje).
- [x] Iškreipti grafikai (lentelės įrankių juosta tinklelyje) – pataisyta
- [x] Puslapių skirtukai (common.js showTab/addSubnav): Rezultatai (II, III), Portfeliai
- [x] Terminai: Tiekėjas → Valdytojas, TIF → Turto išsaug.; Rezultatuose be KPI eilutės; Sharpe matrica – bendras laikotarpis
- [x] Skirtukai: Turtas, Ataskaitos, Kelias į pensiją, III kategorijos; Apie – priežiūros lentelės suskleistos savininkui
- [x] Navigacija: Duomenų kalendorius – į Įrankius; Pradžioje „Ką rasite svetainėje“; grafiko retieji nustatymai suskleisti; valdytojo portfelis „pro fondus“
- [x] Kodo valymas: renderMarketView, renderRelative, taškinės diagramos likučiai, moneyChart, seni journey nav – pašalinti (~7 KB)
- [x] Savarankiškumas: tools/smoke_test.py (update.yml žingsnis „Website check“) → source_status „site“ → vakarinis laiškas; CLAUDE.md failų žemėlapis atnaujintas
- [x] Galutinė patikra (13 puslapių, skirtukai, telefonas), laiškas; priminimai ištrinti
