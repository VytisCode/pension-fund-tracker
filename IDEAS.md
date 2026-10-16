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

- Fondų dalyvių skaičiai iš LB ataskaitų.

## Eilė: savininko užduotys 2026-10-16

- **Patikimumas (spragos po audito 2026-10-16)**: II/III pakopos vertės turi tik vieną šaltinį (valdytojo svetainė) – ieškoti antro (pvz. valdytojų mėnesinės ataskaitos, LB duomenys) bent istorijai patikrinti; MSCI – vienintelis adresas; S&P 500: Yahoo GitHub paleidimui grąžina 429; savininkas 2026-10-16 – indekso nekeisti (MSCI USA atmesta), ieškoti atsarginio šaltinio. Padaryta: pratęsimas pagal S&P 500 kainų indeksą (FRED, Stooq) + 1,3 % dividendai, pažymimas kaip apytikslis (build_site.sp500_tail); 2026-10-16 bandymai GitHub paleidime: FRED – baigiasi laukimo laikas, Nasdaq API – 400, Stooq – grąžina HTML (ne CSV); priežastys – `data/source_status.json` („idx.SP500_PR“). Toliau: pagal pilną Nasdaq klaidos tekstą pataisyti užklausą arba rasti kitą nemokamą šaltinį (bandyti per naršyklės žingsnį Playwright, kuris jau įdiegtas paleidime); EONIA (iki 2019-10) iš ECB negauta – patikrinti serijos raktą `FM/D.U2.EUR.4F.MM.EONIA.HSTA`.
- **Struktūra ir naršymas** – savininko atsakymai 2026-10-16: (1) dashboard'as – jam darbui, aiškus ir naujokams; (2) sutinka su ~6 skyriais: Pradžia (Šiandien + Mėnesio apžvalga), Rezultatai (II/III pakopa – jungiklis), Valdytojai ir fondai, Portfeliai ir turtas (Portfeliai + AUM + Apžvalga), Ataskaitos, Kelias į pensiją; Apie – apačioje/meniu; (3) II ir III pakopos tarpusavyje lyginti nereikia – tame pačiame puslapyje perjungti vaizdą; (4) nenaudoja „Return vs. Risk“ taškinės diagramos; „Calendar year returns“ ir „Rolling returns“ dubliuojasi – nuspręsti, kur intuityviau (patinka, kaip rodoma Ataskaitose); dažniau lyginami visi fondai su visais viename vaizde, o ne vienos gimimo grupės; laukia ir Claude pasiūlymų, ką trinti / keisti; (5) paieška su katalogu (kaip el. parduotuvėje – matyti, ką galima rasti); (9) eilė: pranešimai → Excel → struktūra; prieš pertvarką – planas / maketas patvirtinti.
  - 2026-10-16: savininkui išsiųstas planas ir maketas (Design artifact „Pensijų fondų dashboard – nauja struktūra“: viršus su paieška ir katalogu, Rezultatai su II/III jungikliu ir skirtukais, schema 11 → 6). Siūloma pašalinti: „Grąža ir rizika“ (taškinė), „Grąža palyginti su grupės vidurkiu“. Savininkas 2026-10-16 15:04: (1) pašalinti abi diagramas – sutinka; (2) metai ir mėnesiai – vienas skaičiavimas dviejose vietose – sutinka, **bet turi būti galima pasirinkti ir savo datas**; (3) skyriai OK, bet katalogo punktai buvo neaiškūs – maketas pataisytas (kiekvienas punktas: ką pamatysi, tipas Lentelė/Grafikas, Excel ženklas, peržiūra). Kryptis patvirtinta – galima pertvarkyti.
  - **Pertvarkos eiga**: ✅ 1) 6 skyrių meniu + skyrių puslapių juosta + paieška su katalogu + `#go=` nuorodos; ✅ pašalintos 2 diagramos; ✅ 2) „Visa rinka“ – rodiklio jungiklis (Grąža / Vieta / Skirtumas / Metinė / Visos keturios). Liko: 3) Pradžia: „Šiandien“ + „Mėnesio apžvalga“ vienas puslapis su Šiandien / Savaitė / Mėnuo / YTD; viena „lyderis ir paskutinis“ lentelė (dabar 3 vietose); 4) III pakopa tais pačiais įrankiais (pakopos jungiklis Rezultatuose); 5) „Metai ir mėnesiai“ – kalendoriniai metai + mėnesių žemėlapis + slenkanti grąža viename, Ataskaitų stiliumi, su savomis datomis; tas pats skaičiavimas Ataskaitose; 6) Bendras reitingas + Vieta pagal laikotarpį – viena lentelė; 7) Fondo kortelė (Valdytojai ir fondai); 8) Lyginamasis indeksas (tik SEB); 9) „Rinkos įžvalgos“ iš Kelio į pensiją → Rezultatai; senų adresų nukreipimai.
- **Excel ir kopijavimas** – daroma. Atlikta 2026-10-16: prie kiekvienos lentelės (75 lentelių, 11 puslapių) ⧉ paveikslėlis, ⊞ lentelė, Excel (lapai Rezultatas / [builderio lapai] / Metodika iš `site/methodology.js`); Excel rašomas be bibliotekų (`site/xl.js`, įterpiamas į docs/common.js; `XLSX_SHIM` – senieji mygtukai veikia per jį, be interneto); „Visa rinka“ (tRet, tRelM, tRank, tAnnM) – pilna formulių grandinė nuo vieneto verčių (INDEX/MATCH), patikrinta LibreOffice. Liko: (1) išsamūs builderiai (`XLB.set(lentelės id, …)`) kitoms lentelėms – rodikliai, kalendoriniai metai, III pakopa, portfeliai, ataskaitos; (2) diagramoms be lentelės – `box._xl` (linijiniai grafikai su serijomis); (3) senų builderių lapams – žingsnių eilutė ir spalvos ranka, kur automatinis stilius netikslus.
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
