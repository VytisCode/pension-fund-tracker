# Idėjų sąrašas

Čia laikomos visos dashboard idėjos: savininko ir Claude. Savininko idėjos turi pirmenybę.

Būsenos: *nauja → siūloma → patvirtinta → daroma → atlikta*.
Kad Claude imtųsi idėjos, pakeiskite jos būseną į **patvirtinta** arba tiesiog parašykite tai pokalbyje.

---

## Savininko atsakymai ir pageidavimai

- **2026-10-06.** Dažniausiai lyginami skirtingų laikotarpių grąžos ir stebima fondo vieta (rank) konkurencijos lentelėje.
- **2026-10-06.** Klaidina, kai vėliau atsiradęs fondas linijiniame grafike rodomas nuo dirbtinio pradžios taško (kitų fondų vidurkio). Geriau ilgame laikotarpyje tokio fondo visai nerodyti.
- **2026-10-06.** Visi Claude pasiūlymai (žemiau) patvirtinti.
- **2026-10-06.** Projektas tik prasideda – dirbti intensyviau: du vystymo ciklai kiekvieną darbo dieną.
- **2026-10-06.** Claude gali **pats sujungti (merge)** PR, kurie įgyvendina patvirtintas idėjas ar smulkius patobulinimus, jei patikra praėjo. Savininkas apie juos sužino iš vakarinio laiško. Išimtys (sujungia savininkas): PR, keičiantys `.github/workflows/update.yml`, naujos didelės funkcijos ir viskas, kas nepatvirtinta.
- **2026-10-06.** Po kiekvieno Claude vystymo ciklo – trumpas laiškas savininkui (darbo eiga `notify.yml`): ką padaryta ir kokia kita užduotis.
- **2026-10-06.** Savininkas planuoja balso pokalbius („meet“) apie dashboard. Jų išvados įrašomos į GitHub „Issue“ pavadinimu „Meet: <data>“; Claude ciklas jas perkelia į šį sąrašą kaip patvirtintas idėjas.
- **2026-10-06 (laiškas, 12:36).** Valdymo mokesčiai nuskaičiuojami kasdien, todėl paskelbtos vieneto vertės jau yra po mokesčių. Papildomai mokesčių iš grąžos atimti nereikia. Visos kitos tos dienos idėjos patvirtintos.
- **2026-10-06 (laiškas, 15:59).** Lyginamieji indeksai (benchmark): daugiau informacijos savininkas gauti negali. Kur duomenų nėra, langeliai lieka tušti. **Šio klausimo daugiau neklausti.**
- **2026-10-07.** Dashboard pirmiausia kuriamas **kompiuterio** ekranui (telefonas antroje vietoje).
- **2026-10-07.** Rizikingos (akcijų) dalies % visiems fondams savininkas pateiks Excel failais. Kai jų prireiks, paprašyti laišku.
- **2026-10-07.** Kiekvieno ciklo laiškas siunčiamas kaip atsakymas į **tą pačią laiškų giją**, kad visas ataskaitas būtų galima slinkti viename laiške. – *atlikta (PR #17, 2026-10-07)*
- **2026-10-07.** Savininko atsakymai laiškais ateina į fundsautomationbot@gmail.com kaip atsakymai į ciklo laiškus. Ciklas juos privalo perskaityti ir įrašyti čia (10-06 popietės atsakymas buvo praleistas).
- **2026-10-07.** Netrukus savininkas pateiks: SEB 1989 fondo duomenis, visų fondų rizikingos dalies % (Excel) ir visas LB portfelių ataskaitas. Iš LB ataskaitų bus atskiras analizės polapis; kai jos ateis, Claude pasiūlo, kokia analizė naudingiausia.
- **2026-10-07 (vakaras).** Vystymo ciklai – **6 kartus per dieną, kasdien** (~08:50, 10:50, 12:50, 14:50, 16:50, 18:50 Vilniaus laiku), kol savininkas pasakys kitaip. Kad ciklai būtų nedideli ir neužpildytų pašto: naujas idėjas rašyti ne dažniau kaip 2 kartus per dieną (rytą ir popiet), klausimą savininkui – kartą per dieną (pirmame dienos cikle). Jei baigiasi Pro limitas – ciklą praleisti ir paminėti kitame laiške.
- **2026-10-07 (vakaras).** Duomenų atnaujinimas vis dar „stringa“: GitHub tvarkaraštis paleidžia tik apie 2 iš 12 suplanuotų paleidimų per dieną. Todėl kiekvienas ciklas tikrina `python update.py status` ir `python pillar3.py status`: jei darbo dieną po 13:00 Vilniaus laiku dar trūksta laukiamos dienos duomenų, o „Update fund data“ per paskutinę valandą nebuvo paleistas ir dabar nevyksta, ciklas jį paleidžia pats (`actions_run_trigger`, `update.yml`, `main`) ir parašo apie tai laiške.
- **2026-10-07 (vakaras).** Savininkas turi kasdienius AUM (grynųjų aktyvų) duomenis nuo ~2026-03-23 kitame kompiuteryje ir pabandys juos atsiųsti (svarbiausia Swedbank ir Luminor II pakopa 03-23–06-01, Swedbank III pakopa). Kai atsiųs – importuoti į istoriją ir patikslinti puslapio „Turtas (AUM)“ balandžio išmokėjimus. **2026-10-08: gauta** (tik II pakopa, 2026-03-23–10-06; III pakopos duomenų faile nėra). Importuota `import_owner_aum.py` (tik tušti laukai; nukopijuotos Swedbank eilutės 05-19 ir 05-28 bei 1968–1974 m. fondo 04-16 reikšmė praleistos). Balandžio išmokėjimai dabar pagal tikras dienas: Swedbank ir Luminor 04-07.
- **2026-10-08 (laiškas, 09:12).** (1) Grąžos ir rizikos žemėlapyje reikia savų mygtukų laikotarpiui, fondams (amžiaus grupėms) ir valdytojams keisti, o taškų spalvos turi būti pagal valdytoją – dabar sunku susiorientuoti. – *atlikta (PR #30, 2026-10-08)*. (2) Risk-free rate: gerai, kad galima įrašyti savo skaičių, bet jis turi periodiškai pats atsinaujinti iš patikimo šaltinio, o šalia turi būti „i“ mygtukas su paaiškinimu, iš kur paimtas. Visi fondų dalyviai – EUR investuotojai. – *atlikta (PR #34, 2026-10-08): numatyta norma – ECB €STR, atnaujinama kiekvieną kartą generuojant svetainę; šalia „i“ su šaltiniu ir data; savo skaičių galima įrašyti, mygtukas „Grąžinti €STR“.*
- **2026-10-09 (projekto pokalbis, 21:40).** Patvirtinti audito punktai – žr. skyrių „Audito užduotys (2026-10-09)“. Savaitgalį savininkas tik tvirtina PR, informaciją nori gauti tik el. paštu; užduočių eilę nustato Claude, padaryti kuo daugiau.
- **2026-10-09 (laiškas, 16:30).** Mokesčių poveikis (Meet 9) rodyti **ir eurais, ir procentais**. – *atlikta (Meet 9)*

---

## Audito užduotys (2026-10-09) – PIRMENYBĖ

Savininkas 2026-10-09 vakare peržiūrėjo visos svetainės auditą (68 punktai) ir patvirtino žemiau esančius. Numeriai – audito numeriai (pilnas tekstas: projekto failas `notes/auditas-2026-10-09.md`; čia surašyta viskas, ko reikia darbui). Visi žemiau – **patvirtinta**, pirmenybė prieš kitas idėjas. Vienas punktas = vienas PR. Eiliškumą nustato Claude (savininkas taip paprašė); siūloma eilė – kaip surašyta. Savaitgalį (10-10–10-11) savininkas labai užsiėmęs: tik tvirtina PR telefone, **visą informaciją nori gauti tik el. paštu**. Savininko Claude savaitės limitas 10-09 vakare jau 80 % (atsinaujina antradienį 21:00) – jei limitas baigsis, ciklą praleisti ir paminėti kitame laiške.

**Pirmadienio (10-12) laiške priminti savininkui:**
- **#1** SEB mokestis rodomas 0,50 %, LB faile yra ir 0,40 % (`fee_large`). Savininkas sako, kad sumažintas mokestis buvo taikomas labai trumpai; jis pabandys rasti, kiek laiko. Kol neatsakė – nieko nekeisti.
- **#11** Artea Ambicingas Active 16+ didžiausias kritimas −78,8 % (2007–2009). Savininkas patikrins prie kompiuterio.

**Nedaryti (savininkas atmetė):** #3 (reformos pardavimų neatskirti – reforma tęsis iki 2027 m. pabaigos), #4, #29, #33, #35, #37, #47, #56, #58, #62. **#13** – stulpelio „Sodra €“ neslėpti (gali prireikti, jei atsiras 2004 m. fondų duomenys).

### 1. Klaidos ir smulkūs taisymai
- **#18** [Rezultatai → Visa rinka] „Turto išsaugojimo“ užrašas užlipa ant pirmo langelio. Heatmap lentelėse rašyti **„TIF“**, užvedus pelę – „Turto išsaugojimo fondas“. – *atlikta (PR #67, 2026-10-10)*
- **#20 + lipnios antraštės** Portfeliai telefone 4 px platesni už ekraną (`tcTable` apvalkalas). **Papildomai (savininkas):** visose lentelėse antraštės eilutė turi būti fiksuota (sticky), kad slenkant žemyn matytųsi, kokie duomenys stulpeliuose.
- **#19** [III pakopa, telefone] puslapis 590 px pločio – kaltas „Pradžia“ `select.st` su ilgu tekstu. `max-width:100%` arba trumpesnis tekstas.
- **#21** [III pakopa → Visi III pakopos fondai] lentelė nukirsta ir kompiuteryje (matosi tik „A…“). Šešėlis/rodyklė dešiniame krašte arba mažiau stulpelių.
- **#22** Visos plačios lentelės telefone – šešėlis kraštuose, kad matytųsi, jog galima slinkti; pirmas stulpelis užšaldytas. Bendras sprendimas `style.css` `.scroll`.
- **#10** Visoje svetainėje „1 m.“/„3 m.“ painiojasi su „1 mėn.“/„3 mėn.“ – rašyti „1 metai“, „3 metai“, „5 metai“, „10 metų“; III pakopos lentelėse nurodyti, ar sukaupta, ar metinė.
- **#2** [Portfeliai] obligacijos, kurių išpirkimo data ≤ ketvirčio pabaiga, žymimos ne „Pardavė visą“, o **„Išpirkta“** (atskira, gerai matoma žyma; savininkas nori, kad būtų matoma).
- **#5** [Rezultatai → Bendra reitingų lentelė] Goindex lyginamas 16 kartų, kiti 30. Jungiklis „tik bendri laikotarpiai“ (kur dalyvauja visi 6) ir pastaba po lentele.
- **#6** [Rezultatai → Automatinė santrauka] „Didžiausias 1 d. pokytis“ rodyti du stulpelius: didžiausias kilimas ir didžiausias kritimas.
- **#7** [Rezultatai, 2003–2009 grupė] Savininko sprendimas: fondai, kurių vieneto vertė prasidėjo nuo 1 € 2025-01-02, turi būti įtraukti, kai pasirinkta „Šie metai“, „2025“ ir pan. Skaičiuoti nuo bendros datos – laikotarpio pradžios taškas tokiems fondams = pirmoji vertė (1,00 € 2025-01-02), kad SEB/Swedbank (nuo 2024-12-31) ir kiti (nuo 2025-01-02) būtų lyginami tarpusavyje, o ne atmetami dėl vienos dienos skirtumo.
- **#8** [III pakopa] „Nuo bendros pradžios“ – meniu su daug pasirinkimų: kiekvieno fondo pavadinimas ir jo pradžios data („Nuo Luminor ateitis akcijų index pradžios (2026-01-21)“, „Nuo Goindex pasaulio akcijų pradžios (2022-08-22)“ …), kad būtų aišku, nuo kurio fondo pradžios rodoma ir skaičiuojama. Numatytoji bendra pradžia – be fondų, jaunesnių nei 1 m.
- **#9** [III pakopa] kai grupėje ≤ 3 fondai, heatmap spalvos švelnesnės (ne ryškiai žalia už −0,8 %).
- **#12** [Kelias į pensiją] dvi skirtingos „grąžos %“: tekste rašyti „investicijų grąža sudaro 36 % turto“, kortelėje „grąža nuo įmokų – 55,87 %“.
- **#14** [Turtas (AUM)] ketvirčio sumas (Luminor, Swedbank iki 2025-12-31) piešti punktyru su taškais, ne ištisine linija.
- **#15** [Ataskaitos → Grąža nuo 2019 m.] skaičius prieš fondo pavadinimą – pridėti antraštę „Vieta“.
- **#16** [Ataskaitos ir visur, kur yra vidutinė metinė grąža] trumpiau veikiančių fondų vidurkį aiškiai pažymėti (`*` ir paaiškinimas), kad analitikas matytų, jog jis neobjektyviai palyginamas su ilgiau veikiančių; fondams < 1 m. metinės nerodyti.
- **#17** Dienas, kai vertę skelbia tik vienas valdytojas (pvz. SEB 2026-04-06 Velykų pirmadienis), statistikoje ignoruoti (svyravimas, dienų skaičius, didžiausias pokytis). Istorinių duomenų netrinti – tik neįtraukti skaičiuojant.
- **#24** [Kelias į pensiją → Pakeitimo norma ir turtas laike] mažų grafikų kortelės vienodo aukščio, legenda iškart po grafiku.
- **#25** Visų grafikų X ašyje – mėnesių pradžios žmonišku formatu („vas.“, „2026 bal.“), pirma žyma – laikotarpio pradžia.
- **#26** Kiekvienam puslapiui savas `<title>` pagal kalbą („III pakopa · Pensijų fondai“).
- **#27** Svetainės ženkliukas (SVG favicon) – dabar 404. – *atlikta (PR #68, 2026-10-10)*
- **#28** Numatytoji kalba – **LT** (EN lieka mygtuku).
- **#30** [Ataskaitos] išversti „Performance KPI“, „Peer median“, „SAA“, „AUM“ (angliški – skliaustuose arba „i“).
- **#31** Vienas skaičių formatas visur: **visada du skaitmenys po kablelio**, grąža su ženklu, LT – tarpas prieš %. **Papildomai:** visose stulpelinėse diagramose – reikšmės (data labels) virš stulpelių.
- **#32** Amžiaus grupių tvarka visuose puslapiuose vienoda: turto išsaugojimo viršuje, toliau 1961–1967 … 2003–2009 (Meet A1).
- **#34** [Rezultatai] apatinės lentelės priklauso nuo „Fondų palyginimo“ grupės: grupės pasirinkimas lipnus ir kiekvienos lentelės antraštėje grupė („Kalendorinių metų grąža · 2003–2009“).
- **#36** Vienodas nuorodų stilius (dabar „šaltinis“ – standartinė mėlyna).
- **#49** „–“ ir tuščios reikšmės: „Auksas –“ → „0,00 %“ arba „nėra“; lentelių „–“ su užuomina („fondas tada dar neveikė“).

### 2. Jaukus dizainas (pagrindas)
- **#38** Šilta paletė per `style.css` kintamuosius: fonas #FAF6EF, kortelės #FFFDF9, linijos #EAE2D6, tekstas #2B2622, akcentas terakota #C0643C arba giliai žalsva #2F6B5A; tamsi tema šiltai ruda-anglinė #1E1B18. Valdytojų spalvos atpažįstamos.
- **#39** Heatmap švelnesnės spalvos: šalavijo žalia (#9DC3A5 → #5E9C76), molio raudona (#E8B4A0 → #C9765A), smėlinė vidurys; tikrinti kontrastą.
- **#40** Šriftai: antraštėms serifinis (Fraunces arba Source Serif 4), tekstui Inter su `tabular-nums`. **Būtinai patikrinti, ar šriftas turi visas lietuviškas raides (ą č ę ė į š ų ū ž, didžiosios taip pat)** – geriausia laikyti šrifto failus repozitorijoje (`latin-ext`).
- **#41** Nauja antraštė: ženkliukas + „Pensijų fondai“, eilutė „Duomenys iki … · visi 6 valdytojai atnaujinti ✓“ (vėluojantis – geltonas su vardu); navigacija vienoje eilutėje su ikonomis, lipni; įrankiai (Kopijuoti, Excel, Dienos lentelė, Spausdinti, Duomenys) – į „⋯ Įrankiai“ meniu; kalba ir tema – ikonos kampe.
- **#46** Grafikai: 2 px linijos, paskutinė reikšmė etikete linijos gale, švelnesnis tinklelis, užuominos su visų fondų reikšmėmis surikiuotos. **Savininkas: per daug nesuapvalinti – analitikai mėgsta aštresnes linijas, tai ne dailės parodos puslapis.**
- **#48** [III pakopa] to paties valdytojo keli fondai – skirtingas linijos tipas (ištisinė/punktyras/taškai) arba aiškiau skirtingi atspalviai.
- **#45** Ilgi paaiškinimai po lentelėmis – po „Kaip skaityti? ▾“, matomas vienas sakinys.
- **#44** Kortelių antraštė – automatinė išvada („2025 m. visi fondai krito ~20 %, atsigavo per 3 mėn.“), mažesnėmis raidėmis – lentelės pavadinimas.
- **#50** KPI kortelės kiekvieno puslapio viršuje (kaip III pakopos puslapyje).
- **#43** [Rezultatai ir palyginimas] ~7000 px puslapis: vidinė navigacija arba skirtukai („Santrauka · Visa rinka · Grupės palyginimas · Rizika · Mokesčiai · Kalendorius“). Nieko nepašalinti.
- **#42** Pradžios puslapis „Šiandien trumpai“ (dabar `index.html` peradresuoja): 3–4 didelės kortelės (metų pradžios lyderis ir atsiliekantis, savaitės pokytis, II pakopos turtas iš viso), 2–3 automatiniai sakiniai, mažos kreivės, nuorodos „Plačiau →“. **Savininkas: be kreipinių į lankytoją („Labas“ ir pan.)** – dalykiškas tonas.
- **#52** Telefone svarbiausios lentelės (santrauka, AUM) – kortelių režimu.
- **#51** Spausdinimas / PDF: slėpti mygtukus, antraštė su data ir šaltiniais, lūžiai tarp kortelių. **Savininkas: spausdinant renkamasi iš dviejų dizainų – esamo (jaukaus) ir universalaus (neutralaus, baltas fonas, tinkamas prezentacijoms).** Lentelės ir paveikslėliai bus naudojami prezentacijose.

### 3. Skaidrumas ir duomenų patikrinamumas
- **#54** Šviežumo priminimai **visiems duomenims**, ne tik „Kelyje į pensiją“ (savininko 2026-10-09 sprendimas): LB portfelių ataskaitos, LB rezultatų ir mokesčių failai, ketvirčio AUM, indeksai, €STR. Bendras sąrašas su „kitų laukiama iki“ datomis ir viena juosta puslapio viršuje.
- **#53** Puslapis „Apie ir metodika“: iš kur kiekvienas duomuo, kaip dažnai atnaujinama, formulės, prielaidos, žinomi netikslumai; be nuorodų į kodą ar GitHub. **Savininko papildymas (labai svarbu):** prie **kiekvienos lentelės ir diagramos** – galimybė atsisiųsti būtent to vaizdo Excel failą su: (1) naudotais pradiniais duomenimis (vieneto vertės su datomis, šaltinis), (2) skaičiavimu žingsnis po žingsnio su **tikromis Excel formulėmis** (ne vien reikšmėmis), (3) lapu „Metodika ir šaltiniai“. Tikslas – kad savininkas galėtų įrodyti savo skaičius kitam analitikui (pvz. jei nesutampa su kolegos skaičiais) ir atsekti kiekvieną žingsnį. Dabartiniai Excel failai per sudėtingi suprasti. Daryti dalimis: pradėti nuo „Rezultatų“ heatmap ir rodiklių lentelių.
- **#55** Po kiekviena lentele smulki eilutė: „Šaltinis: …, data · Metodika →“.
- **#57** Žinomų apribojimų sąrašas „Apie“ puslapyje ir trumpai prie susijusių lentelių.

### 4. Naujos funkcijos
- **#67** „Kopijuoti vaizdą“ ir „Atsisiųsti PNG“ prie kiekvieno grafiko (savininkui labai patinka).
- **#60** [Rezultatai] horizontali stulpelinė diagrama – laikotarpio grąža kiekvienam fondui, surikiuota, su reikšmėmis.
- **#68** [Turtas] turto pokytį išskaidyti į grąžą, įmokas ir išmokas (reforma) – stulpeliai.
- **#59** Automatinė **mėnesio apžvalga** (PDF, kurį savininkas galėtų persiųsti el. paštu) ir atskira **ketvirčio apžvalga** apie viską, kas svarbu: portfelių pokyčiai, išskirtinumai. Analitikai mėgsta palyginamumą: kas pasikeitė **per mėnesį, ketvirtį, YTD ir YoY**.
- **#63** [Portfeliai] valdytojų panašumas – kiek portfelio sutampa (bendros pozicijos), unikaliausias valdytojas; lyginti įvairiais kampais (regionai, turto klasės, TER, alternatyvos), ieškoti įdomių atradimų.
- **#61 + #64** Vieno fondo **arba vieno valdytojo** puslapis: grąžos visais laikotarpiais, vieta grupėje, mokestis, turtas, portfelio sudėtis, 10 didžiausių pozicijų, rizika. **Savininkas:** pasirinkus valdytoją, puslapis įgauna to valdytojo spalvas (Swedbank – oranžinė, SEB – žalia ir t. t.), kad jaustumeisi kaip tos bendrovės atstovas. Sujungti su #64: spausdinama vieno A4 lapo valdytojo suvestinė. Didelė užduotis – skaidyti į kelis PR.
- **#65** [Kelias į pensiją] ateities scenarijai (pesimistinis/vidutinis/optimistinis). Savininkas klausia, kaip prognozuoti valstybinę (Sodros) pensiją – pirmiausia paieškoti oficialių prognozių (Sodros pensijų skaičiuoklė, Finansų / Socialinės apsaugos ir darbo ministerijos projekcijos, EK „Ageing Report“ ir „Pension Adequacy Report“ apie Lietuvą); jei patikimų nėra – parodyti tik kaupimo dalį ir aiškiai pažymėti prielaidas. Laiške trumpai pranešti, ką rasta.
- **#66** Žodynėlis (užuominos ant terminų) – **neprioritetinė**, daryti paskutinę.

---

## Klausimas savininkui

*(Atsakyta 2026-10-09: ir eurais, ir procentais. Kitas pirmas dienos ciklas įrašo naują klausimą.)*

---

## Savininko užduotys (2026-10-07)

Visos patvirtintos savininko. Pirmenybė prieš kitas idėjas.

**III pakopos polapis**
1. **Po kiekvienu linijiniu grafiku – dvi heatmap lentelės** (grąža per laikotarpį ir vieta grupėje), tokios pačios kaip „Rezultatai ir palyginimas“ puslapyje. – *atlikta (PR #19, 2026-10-07; laukia sujungimo)*
2. **Fondų įjungimas / išjungimas linijiniuose grafikuose** ir jų palyginimas, kaip „Rezultatai ir palyginimas“ → „Fondų palyginimas“. – *atlikta (PR #19, 2026-10-07; laukia sujungimo)*
3. **Laikotarpio pasirinkimas prie kiekvienos diagramos:** „Nuo bendros pradžios“ (since common inception), „Nuo SEB pradžios“, „Nuo Goindex pradžios“ ir t. t. – *atlikta (PR #19, 2026-10-07; laukia sujungimo)*
4. **Mygtukai istoriniams rinkų įvykiams** (kaip II pakopos puslapyje, bet daugiau įvykių). – *atlikta (PR #19, 2026-10-07; laukia sujungimo)*

**„Pension fund tracker“ (rezultatų) puslapis**
5. **Heatmap lentelėse „Return over the period“ ir „Rank within the age group“ – jungiklis „Nuo Goindex pradžios“**, kad „All history“ režime būtų galima objektyviai palyginti ir su Goindex. – *atlikta (PR #18, 2026-10-07; laukia sujungimo)*
6. **Lentelė „Overall ranking across all groups and periods“:** periodų pasirinkimo mygtukai ir aiškus paaiškinimas, kas yra „Comparisons“. – *atlikta (PR #18, 2026-10-07; laukia sujungimo)*

---

## Savininko idėjos

### Polapis „Kelias į pensiją“ (Retirement Journey)
- **Būsena:** daroma (PR #53, 2026-10-09)
- **Autorius:** savininkas (Excel modelis ir aprašas, 2026-10-09)
- **Kas:** vieno dalyvio kaupimas nuo pirmos įmokos iki šiandien: įmokos pagal šaltinį, fondo vienetai, sukaupta suma, anuitetas, pakeitimo norma ir reali vertė po infliacijos. Keičiami pakopa, gimimo metai, pradžia, atlyginimas (vidutinis, MMA, % vidutinio), įmokų tarifas, valdytojas / III pakopos fondas, savo įmoka (% bruto arba € per mėn.) ir data. Lentelė „Vidutinis ir minimalus atlyginimas, II ir III pakopa“. Pradinės lentelės – `imports/journey/`, modelis – `site/journey.js`.
- **Savininko sprendimai (2026-10-09):** II pakopa kol kas skaičiuojama nuo gyvenimo ciklo fondų pradžios (2019-01); III pakopa – nuo fondo pradžios, tomis pačiomis Sodros datomis, be valstybės paskatos; II pakopos 3 % – nuo bruto, dalyvio išlaidos rodomos kaip neto atlyginimo dalis; 2025-09-30 papildoma eilutė Excel'yje – ignoruoti.
- **Laukia iš savininko:** Excel failas (VKI po 2025-06; vėliau – senųjų SEB pensija 2/3 fondų istorija, jei norėsime II pakopą nuo 2004 m.).

### Nerodyti vėliau atsiradusių fondų nuo dirbtinės pradžios
- **Būsena:** atlikta (PR #2, 2026-10-06)
- **Autorius:** savininkas
- **Kas:** jei fondas pradėjo veikti vėliau nei pasirinkto laikotarpio pradžia, jo linija grafike nebepiešiama. Po grafiku parašoma, kurie fondai nerodomi ir nuo kada jų duomenys prasideda. Pasirinkus trumpesnį laikotarpį, jie vėl matomi. Tas pats galioja ir „Apžvalgos“ bei III pakopos puslapiams.

---

## „Meet“ užduotys (2026-10-06, Issue #10)

Visos šio skyriaus užduotys yra savininko, būsena **patvirtinta**. Daromos eilės tvarka, didelės skaidomos į kelis PR. Kur trūksta duomenų (pvz., akcijų dalies), Claude klausia savininko.

**A. „Performance & peers“ puslapis**
1. **Heatmap lentelių eilutės pagal riziką:** viršuje turto išsaugojimo (payout), toliau 1961, 1968 … , jauniausi (2003) apačioje. – *atlikta (PR #11, 2026-10-06)*
2. **Vienodo pločio, sulygiuoti heatmap langeliai**, elegantiškesnės lentelės. – *atlikta (PR #11, 2026-10-06)*
3. **Pašalinti lentelę „Quartile within age group“.** – *atlikta (PR #13, 2026-10-07)*
4. **Kvartilius visur pakeisti konkrečia vieta** (1–6) rizikos grupėje; kvartilių neliks niekur. – *atlikta (PR #13, 2026-10-07)*
5. **Grąžos ir rizikos žemėlapis:** taškinė diagrama (horizontaliai svyravimai, vertikaliai grąža, spalva pagal gimimo grupę). – *atlikta (PR #25, 2026-10-08)*
6. **Santykinė grąža prieš grupės vidurkį:** juostinė diagrama, nulis = grupės vidurkis. – *atlikta (PR #41, 2026-10-08)*
7. **Reitingo kaita laike:** fondo vieta kas mėnesį ar ketvirtį. – *atlikta (PR #43, 2026-10-08)*
8. **Max drawdown pagal grupę:** juostos su giliausiu kiekvieno fondo kritimu. – *atlikta (PR #50, 2026-10-09)*
9. **Mokesčių poveikis laike:** kiek valdymo mokesčiai sukaupia per 5–10 m., palyginti tarp fondų. – *atlikta (PR #65, 2026-10-09: „Grąža“ puslapyje lentelė su skaičiuokle – mėnesio įmoka, 5/10/20/30 m., prielaidinė grąža; skirtumas ir eurais, ir procentais)* (dėl 5–9: įtraukti visas, nereikalingas išmesti vėliau)
10. **Valdomo turto (AUM) kaita** kiekvienam II pakopos fondui kas ketvirtį: grafikas ir lentelė (pensijų reformos kontekstas). Pradėti nuo turimų duomenų. – *atlikta (puslapis „Turtas (AUM)“: grafikas ir pokyčiai – kita sesija; lentelė „Turtas ketvirčių pabaigose pagal fondą“ – PR #64, 2026-10-09)*
11. **Lankstus laikotarpis linijiniuose grafikuose:** „Visa istorija“ lieka; papildomai „nuo [fondo] pradžios“ ir mygtukas „nuo jauniausio fondo pradžios“. – *atlikta (PR #54, 2026-10-09: „Grafiko pradžia“ – laikotarpio pradžia, nuo bet kurio fondo pradžios arba nuo jauniausio fondo pradžios)*

**B. Naujas puslapis „Ataskaitos“ (Reports)**
12. **Puslapis su valdymo bendrovės pasirinkimu** viršuje; visos lentelės rodo tik jos duomenis. – *atlikta (puslapis „Ataskaitos“, 2026-10-08: grąža nuo 2019 m. ir mėnesių grąža kaip savininko lentelėse)*
13. **Lentelė nr. 1 – rodikliai per laikotarpius** kiekvienam bendrovės fondui: vid. vieneto vertės pokytis, vid. lyginamojo indekso pokytis, abiejų standartiniai nuokrypiai, fondo ir indekso metinė grąža; laikotarpiai 6 mėn., 1, 3, 5 m., nuo pradžios. – *patvirtinta*
14. **Eksportas į Excel ir PDF.** – *atlikta (Excel – kiekvienai „Ataskaitų“ lentelei su formulėmis; PDF – mygtukas „Spausdinti / PDF“, PR #60, 2026-10-09)*
15. **Lentelė nr. 2 – fondas prieš indeksą:** fondo grąža, indekso grąža, skirtumas, bruto grąža (be valdymo mokesčio). – *atlikta (KPI lentelėje: Grynoji/Bruto − SAA, laikotarpiai YTD, 1, 3, 5 m., kaip savininko „Baltic YTD / 3Y“)*
16. **Valdymo mokesčiai** kiekvienam fondui; mokestis skaičiuojamas proporcingai laikotarpiui. – *patvirtinta*
17. **Lentelė nr. 3 – „Performance KPI“:** fondas, grąža, peer median (be tos bendrovės), gross return, SAA (indekso grąža), Active / Local Active / Local Passive Manager (pasirenkami), rank in risk class, risk class (akcijų dalis %), fondų skaičius klasėje, AUM, dalis bendrovės turte; apačioje AUM pasverta grąža ir bendras AUM. – *atlikta (2026-10-08; palyginimo stulpeliai – 3 pasirenkami valdytojai, numatyta Swedbank, Artea, Goindex; 2026 m. mokestis – prielaida 0,40 % / 0,20 %, kol savininkas nepatvirtins)*
18. **Atskiros „Performance KPI“ lentelės** II ir III pakopai. – *atlikta (2026-10-08)*

---

## Pirmi 3 darbai (1 etapo užbaigimui)

### 1. Kad duomenys tikrai būtų renkami automatiškai kasdien
- **Būsena:** daroma (tvarkaraštis veikia, bet GitHub paleidimus vėlina ar praleidžia; PR #12 – pakartotiniai bandymai kas 30 min., PR #14 – pavėlavęs rytinis paleidimas po pietų veikia kaip įprastas; liko apsauga – pranešti ataskaitoje, jei per dieną nebuvo paleidimų)
- **Autorius:** Claude
- **Kodėl:** darbo eiga „Update fund data“ veikia, kai paleidžiama ranka, bet pagal tvarkaraštį GitHub jos dar nė karto nepaleido (2026-10-06 rytą: 0 suplanuotų paleidimų). Kol taip yra, 1 etapo 2 punktas (kasdienis automatinis rinkimas) neįvykdytas.
- **Ką daryti:** išsiaiškinti, kodėl GitHub nevykdo tvarkaraščio, ir jį „perkrauti“. Pridėti apsaugą: jei per dieną nebuvo nė vieno paleidimo, apie tai pranešti kasdienėje ataskaitoje. Jei GitHub tvarkaraštis ir toliau neveiks, pasiūlyti nemokamą atsarginį paleidiklį.
- **Nauda:** svetainė atsinaujins be jūsų įsikišimo.

### 2. Svetainės ir repozitorijos privatumas: `noindex` ir proxy adreso slėpimas
- **Būsena:** atlikta (PR #3, 2026-10-06)
- **Autorius:** Claude
- **Kodėl:** CLAUDE.md reikalauja, kad svetainėje būtų `noindex`, bet nė viename puslapyje jo dar nėra. Be to, viešame žurnale `data/last_update_log.txt` matyti Luminor proxy IP adresas ir prievadas. Slaptažodis ten nerodomas.
- **Ką daryti:** visiems puslapiams pridėti `<meta name="robots" content="noindex">` ir `robots.txt`. Žurnale proxy adresą pakeisti į „***“.
- **Nauda:** svetainės nerodys „Google“ ir kitos paieškos sistemos, o proxy adresas nebebus skelbiamas viešai.

### 3. Kasdienė ataskaita el. paštu vietoj „Issue“ komentarų
- **Būsena:** atlikta (PR #4, 2026-10-06; Gmail nustatymai įrašyti, bandomasis laiškas gautas)
- **Autorius:** Claude
- **Kodėl:** dabar po kiekvieno paleidimo ataskaita rašoma kaip GitHub „Issue“ komentaras (testavimo fazė). CLAUDE.md numato **vieną** trumpą ataskaitą per dieną į jūsų asmeninį paštą iš `fundsautomationbot@gmail.com`.
- **Ką daryti:** vakare (po paskutinio paleidimo) siųsti vieną laišką. Laiške nurodyti, kurie fondai atnaujinti, kurie ne, ar buvo klaidų, kiek liko Luminor bandymų, ir įtraukti dienos idėjas bei klausimą. Prisijungimo duomenis laikyti tik GitHub Secrets. Pradėjus siųsti laiškus, „Issue“ komentarų žingsnį pašalinti.
- **Nauda:** viskas vienoje vietoje, mažiau pranešimų.

---

## Kitos idėjos (vėlesniam laikui)

### Valdymo mokesčių rinkimas
- **Būsena:** patvirtinta (sujungta su „Meet“ 16)
- **Autorius:** Claude
- **Kodėl:** CLAUDE.md numato rinkti ir valdymo mokesčius, bet kol kas renkamos tik vieneto vertės ir turto dydis.
- **Nauda:** galima palyginti, kiek fondai kainuoja, ir grąžą vertinti atsižvelgiant į mokesčius.

### Visos fondų nuorodos viename konfigūracijos faile
- **Būsena:** atlikta (2026-10-06, failas `fund_links.py`)
- **Autorius:** Claude
- **Kodėl:** fondų puslapių nuorodos dabar išbarstytos po kelis failus (`sources/*.py`, `update.py`, `pillar3.py`). CLAUDE.md prašo jas laikyti vienoje vietoje.
- **Nauda:** pasikeitus fondo svetainei, nuorodą reikės pataisyti tik vienoje vietoje.

### Duomenų šviežumo ženklas svetainėje
- **Būsena:** atlikta (PR #8, 2026-10-06)
- **Autorius:** Claude
- **Kodėl:** fondai vertes skelbia skirtingu laiku, o kartais rinkimas nepavyksta (pvz., Luminor).
- **Nauda:** prie kiekvieno valdytojo matytųsi paskutinė vertės data. Jei duomenys pasenę, ji būtų paryškinta, kad lankytojas nesuklystų lygindamas.

### Lietuvos banko ketvirtiniai portfelių duomenys
- **Būsena:** daroma (2026-10-07 savininkas davė visus 28 ketvirčius ir leido kurti; pirmoji dalis – polapis „Portfeliai“: ketvirčio didžiausi pokyčiai ir fondo portfelis su pozicijų istorija)
- **Autorius:** savininkas (CLAUDE.md)
- **Kodėl:** fondų portfelių sudėties ir jos pokyčių kas ketvirtį analizė.
- **Duomenys:** `imports/lb_portfolios/` (LB xlsx failai) → `python3 portfolios.py` → `data/portfolios.csv`. Atsiradus naujam ketvirčiui – įdėti failą ir paleisti iš naujo.

### Portfeliai: alternatyvių investicijų dalis
- **Būsena:** daroma (savininko prašymas 2026-10-07)
- **Autorius:** savininkas
- **Kodėl:** alternatyvūs fondai (privatus kapitalas, infrastruktūra, NT, privati skola) nelikvidūs; po reformos parduodant likvidų turtą jų dalis portfeliuose didėja.
- **Kas daroma:** puslapyje „Portfeliai“ skyrius su alternatyvų dalimi pagal valdytoją (grafikas) ir pagal fondą (lentelė per 8 ketvirčius, rūšys, alternatyvų ir viso portfelio vertės pokytis); fondo kortelėje – rodiklis ir filtras „Alternatyvūs fondai“.

### Turtas (AUM) ir reformos išmokėjimai
- **Būsena:** daroma (savininko prašymas 2026-10-07)
- **Autorius:** savininkas
- **Kodėl:** po reformos kiekvieno ketvirčio pradžioje išmokamas pasitraukusių dalyvių turtas; svarbu matyti, kada ir kiek kiekvienas valdytojas išmokėjo, ir kaip auga III pakopos turtas.
- **Kas daroma:** puslapis „Turtas (AUM)“: grafikas (II / III pakopa, valdytojai arba grupė, laikotarpiai, mln. € arba %), turto pokyčio lentelė ir išmokėjimų lentelė pagal valdytoją ar fondą (`aum.py` aptinka išmokėjimų dienas).
- **Trūksta:** Swedbank III pakopos kasdienių grynųjų aktyvų (dabar tik LB ketvirčio sumos).

### Portfeliai: tikri fondų pavadinimai pagal ISIN
- **Būsena:** daroma (savininko prioritetas 2026-10-08)
- **Autorius:** Claude
- **Kodėl:** Allianz ir kai kurios SEB ataskaitos vietoj fondo pavadinimo rašo tik valdymo bendrovę (pvz. „Schroder Investment Management“), todėl apie 90 iš ~490 fondų / ETF rodomi tik su ISIN kodu.
- **Nauda:** nemokamas OpenFIGI katalogas pagal ISIN grąžina tikrą pavadinimą; vieną kartą paleidus per GitHub Actions, pavadinimai būtų išsaugoti faile ir visur matytųsi aiškiai.
- **2026-10-08:** OpenFIGI pavadinimai savininkui per neaiškūs (sutrumpinimai). Pilni oficialūs pavadinimai dabar imami iš `data/fund_attributes.csv` (fondų puslapiai, KID, justETF).

### Portfeliai: vertybinių popierių požymiai ir palyginimas grupėje
- **Būsena:** daroma (savininkas patvirtino visus 3 etapus 2026-10-08)
- **Autorius:** savininkas
- **Kodėl:** suprasti, kodėl tos pačios amžiaus grupės fondai pas skirtingus valdytojus uždirba skirtingai: kas neturi EM, kas tik išsivysčiusios rinkos, kas laiko auksą, kieno ETF brangiausi, kiek indeksinių fondų, SFDR 8/9.
- **Kas daroma:** 1 etapas – fondų ir ETF požymiai `data/fund_attributes.csv` (turto klasė, regionas, EM, indeksinis/aktyvus, SFDR, TER, valiutos apsauga, šaltinis), fondo kortelėje „Ką dengia portfelis“, naujas skyrius „Palyginimas grupėje“ su signalais. 2 etapas – obligacijų YTM ir trukmė (ESMA FIRDS + LB kaina, `bonds.py`, `data/security_terms.csv`). 3 etapas – tiesioginių akcijų sektoriai.
- **Priežiūra:** kas ketvirtį, atėjus naujai LB ataskaitai, aprašyti naujai atsiradusius fondus (keletas eilučių `data/fund_attributes.csv`).

### Portfeliai: sudėties kitimas laike
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** fondo kortelėje dabar matyti tik vieno ketvirčio sudėtis (akcijos, fondai, obligacijos, pinigai).
- **Nauda:** grafikas, kaip nuo 2019 m. keitėsi akcijų, obligacijų, Lietuvos investicijų ir valiutų dalys; galima palyginti visų valdytojų tos pačios grupės fondus vienoje vietoje.

### Portfeliai: kas turi šią poziciją
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** įdomu matyti, kurie fondai turi, pvz., Nvidia ar Ignitis obligacijas ir kiek.
- **Nauda:** paieška pagal pavadinimą ar ISIN – lentelė su visais fondais, kuriuose ta pozicija yra, jos svoriu ir pokyčiu.

### Fondo vietos (rank) kitimas laike
- **Būsena:** atlikta (PR #43, 2026-10-08; „Meet“ 7)
- **Autorius:** Claude (pagal savininko atsakymą)
- **Kodėl:** jūs dažniausiai stebite fondo vietą konkurencijos lentelėje. Dabar matoma tik dabartinė vieta.
- **Nauda:** grafikas, kaip kiekvieno fondo vieta savo grupėje (pvz., pagal 1 m. grąžą) keitėsi kas mėnesį. Taip matyti, ar fondas pastoviai geras, ar tik neseniai pakilo.

### Šviežumo ženklas ir el. laiške
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** svetainėje jau matyti, kurie valdytojai atsilieka, bet vakarinis laiškas to nemini taip aiškiai.
- **Nauda:** laiške viena eilutė „atsilieka: Luminor (2 d. d.)“ – nereikia atidaryti svetainės.

### Duomenų spragų ženklas grafike
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** savininkas rankiniu būdu pildys istorines spragas; kol jų nėra, grafikas tyliai jungia taškus tiesia linija.
- **Nauda:** punktyrinė linija ten, kur trūksta duomenų, kad lankytojas neapsigautų.

### Grąžos ir rizikos taškinė diagrama peer grupėje
- **Būsena:** atlikta (PR #25, 2026-10-08; „Meet“ 5)
- **Autorius:** Claude
- **Kodėl:** lentelėse jau yra grąža, svyravimai ir Sharpe rodiklis, bet juos sunku aprėpti vienu žvilgsniu.
- **Nauda:** vienas grafikas: horizontaliai rizika (svyravimai), vertikaliai grąža, kiekvienas taškas yra grupės fondas. Iškart matyti, kuris fondas uždirba daugiau už tą pačią riziką.

### „Mano fondas“: savo fondo paryškinimas visur
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** dažniausiai žmogus seka vieną savo fondą ir jo vietą tarp kitų.
- **Nauda:** pasirinkus savo fondą, jis paryškinamas visose lentelėse ir grafikuose, o pasirinkimas įsimenamas naršyklėje. Patogu ir draugams: kiekvienas mato savo fondą.

### Palyginimas su pasaulio akcijų indeksu
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** jaunesnių gimimo grupių fondai daugiausia investuoja į pasaulio akcijas. Lyginant tik tarpusavyje, nematyti, ar visi kartu neatsilieka nuo rinkos.
- **Nauda:** grafike papildoma pilka linija, pvz. nemokamai skelbiamas pasaulio akcijų indekso ETF eurais. Matyti, kiek valdytojų rezultatas skiriasi nuo pigaus indekso.

### Užfiksuotas pirmas stulpelis plačiose lentelėse telefone
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** telefone plačios lentelės slenkamos į šoną, ir kairysis stulpelis (gimimo grupė ar fondas) dingsta iš akių.
- **Nauda:** slenkant lentelę, grupės pavadinimas lieka matomas, todėl skaičių nebereikia „gaudyti“.

### Heatmap langelio paaiškinimas užvedus pelę
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** langelyje matyti tik grąža, bet ne datos ir vieneto vertės, iš kurių ji paskaičiuota.
- **Nauda:** užvedus pelę ar paspaudus telefone matyti fondo pavadinimas, pradžios ir pabaigos datos bei vieneto vertės. Lengviau patikrinti skaičių ir paaiškinti draugams.

### Valdytojo kortelė paspaudus jo pavadinimą
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** rinkos lentelėse matyti visų valdytojų skaičiai, bet norint pažiūrėti vieną valdytoją reikia ieškoti po kelias lenteles.
- **Nauda:** paspaudus, pvz., „Swedbank“, atsidaro trumpa suvestinė: visi jo fondai, grąžos ir vietos per laikotarpius vienoje vietoje. Patogu ruošiantis pokalbiui apie konkretų valdytoją.

### Paskutinės dienos pokytis
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** dabar trumpiausias laikotarpis yra 1 mėn., todėl nematyti, kaip fondai pajudėjo vakar, pvz., po didesnio rinkos kritimo.
- **Nauda:** „Apžvalgos“ puslapyje stulpelis „1 d.“ su paskutinės dienos vieneto vertės pokyčiu. Iškart matyti, kurie fondai labiausiai reagavo į rinką.

### Rinkimo laikų žurnalas ataskaitoje
- **Būsena:** patvirtinta (2026-10-06/07)
- **Autorius:** Claude
- **Kodėl:** GitHub tvarkaraštis paleidimus vėlina valandomis (2026-10-07 rytinis paleidimas įvyko tik 14:19), o dabar tai matyti tik GitHub svetainėje.
- **Nauda:** vakariniame laiške viena eilutė: kada vyko paleidimai ir kada kiekvienas valdytojas paskelbė vertę. Per kelias savaites paaiškės, kada geriausia rinkti duomenis, ir bus galima sumažinti nereikalingų paleidimų.

### Grupių vidurkiai grąžos ir rizikos žemėlapyje
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** žemėlapyje matyti visi 48 fondai, bet sunku pasakyti, ar konkretus fondas savo grupėje uždirba daugiau už tą pačią riziką.
- **Nauda:** kiekvienos amžiaus grupės vidurkis žemėlapyje rodomas kaip didesnis žiedas. Iškart matyti, kurie fondai yra aukščiau už savo grupės vidurkį (geriau), o kurie žemiau.

### Ataskaitos: ketvirčiai, LB lentelė, metodika ir Excel su formulėmis
- **Būsena:** atlikta (2026-10-08)
- **Autorius:** savininkas
- **Kodėl:** ataskaitos ruošiamos kas ketvirtį (Q3 YTD, Q4 YTD), o skaičiai tikrinami savarankiškai.
- **Nauda:** Performance KPI – pasirenkama ketvirčio pabaiga ir vaizdai YTD / 3 m. sukaupta / 3 m. metinė (taip pat 1 m. ir 5 m.); nauja Lietuvos banko formos fondo lentelė (vidutinis pokytis, standartinis nuokrypis, metų grąža); prie kiekvienos lentelės ⓘ su metodika ir Excel failas su naudotais duomenimis ir formulėmis. AUM puslapyje procentai su 2 skaičiais po kablelio.

### Santykinės grąžos kaita laike
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** naujoji „grąža palyginti su grupės vidurkiu“ diagrama rodo tik vieną laikotarpį, todėl nematyti, ar fondas lenkia konkurentus nuolat, ar tik pastaruoju metu.
- **Nauda:** linijinis grafikas, kur nulis yra grupės vidurkis, o kiekvieno valdytojo linija rodo sukauptą skirtumą nuo jo per laiką. Iškart matyti, kada fondas pradėjo atsilikti ar lenkti kitus.

### Atsigavimo laikas po didžiausio kritimo
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** didžiausio kritimo juostos rodo, kiek fondas nukrito, bet ne kiek laiko užtruko grįžti į ankstesnę viršūnę. Taupytojui tai dažnai svarbiau nei pats kritimo gylis.
- **Nauda:** šalia kritimo – skaičius „atsigavo per N mėn.“ arba „dar neatsigavo“. Matyti, kurie valdytojai po krizių atsigauna greičiau.

### „Ataskaitų“ santrauka viršuje
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** „Ataskaitų“ puslapyje daug lentelių, o svarbiausius skaičius tenka susirinkti iš kelių vietų.
- **Nauda:** viršuje 4 kortelės pasirinktam valdytojui: vidutinė vieta tarp konkurentų, geriausias ir silpniausias fondas, turto (AUM) pokytis per ketvirtį. Patogu pradėti pokalbį ar pristatymą.

### III pakopos išmokėjimo būdas „Kelyje į pensiją“
- **Būsena:** atlikta (2026-10-09)
- **Autorius:** savininkas (2026-10-09)
- **Kas:** III pakopos lėšų negalima panaudoti Sodros anuitetui, todėl meniu pasirenkama: likti fonde ir kas mėnesį iki 85 m. parduoti vienetų dalį; atsiimti ir dalinti kas mėnesį iki 85 m. neinvestuojant; atsiimti visą sumą iš karto. Prognozių nedaroma.

### III pakopos GPM lengvata „Kelyje į pensiją“
- **Būsena:** atmesta (savininkas 2026-10-09: GPM lengvata naujoms sutartims nebegalioja nuo 2025 m.)
- **Autorius:** Claude
- **Kodėl:** III pakopos įmokos mažina gyventojų pajamų mokestį (dalis įmokos grąžinama kitais metais), o dabar modelis rodo tik paties dalyvio įmokas.
- **Nauda:** jungiklis „GPM lengvata“: grąžinta suma laikoma papildoma įmoka kitų metų pradžioje (ribos – pagal kiekvienų metų įstatymą). Matyti tikroji III pakopos nauda, palyginti su II pakopa.

### Darbdavio įmoka į III pakopą
- **Būsena:** atlikta (2026-10-09; kartu perdėliotas puslapis ir pridėta pensijos sudėties schema, savininko prašymu)
- **Autorius:** Claude
- **Kodėl:** daug darbdavių moka į III pakopą už darbuotoją, ir tai dažnai didžiausias III pakopos privalumas.
- **Nauda:** laukelis „Darbdavio įmoka, € / mėn.“ – atskira spalva grafike ir lentelėse, kaip valstybės įmoka II pakopoje.
