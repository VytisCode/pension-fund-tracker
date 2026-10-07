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

---

## Klausimas savininkui

Kai rodote dashboard draugams ar kolegoms, ar dažniau naudojatės **telefonu** ar **kompiuteriu**? Nuo to priklauso, ar naujas diagramas (pvz., grąžos ir rizikos žemėlapį) pirmiausia pritaikyti mažam ekranui.

---

## Savininko idėjos

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
5. **Grąžos ir rizikos žemėlapis:** taškinė diagrama (horizontaliai svyravimai, vertikaliai grąža, spalva pagal gimimo grupę). – *patvirtinta*
6. **Santykinė grąža prieš grupės vidurkį:** juostinė diagrama, nulis = grupės vidurkis. – *patvirtinta*
7. **Reitingo kaita laike:** fondo vieta kas mėnesį ar ketvirtį. – *patvirtinta*
8. **Max drawdown pagal grupę:** juostos su giliausiu kiekvieno fondo kritimu. – *patvirtinta*
9. **Mokesčių poveikis laike:** kiek valdymo mokesčiai sukaupia per 5–10 m., palyginti tarp fondų. – *patvirtinta* (dėl 5–9: įtraukti visas, nereikalingas išmesti vėliau)
10. **Valdomo turto (AUM) kaita** kiekvienam II pakopos fondui kas ketvirtį: grafikas ir lentelė (pensijų reformos kontekstas). Pradėti nuo turimų duomenų. – *patvirtinta*
11. **Lankstus laikotarpis linijiniuose grafikuose:** „Visa istorija“ lieka; papildomai „nuo [fondo] pradžios“ ir mygtukas „nuo jauniausio fondo pradžios“. – *patvirtinta*

**B. Naujas puslapis „Ataskaitos“ (Reports)**
12. **Puslapis su valdymo bendrovės pasirinkimu** viršuje; visos lentelės rodo tik jos duomenis. – *patvirtinta*
13. **Lentelė nr. 1 – rodikliai per laikotarpius** kiekvienam bendrovės fondui: vid. vieneto vertės pokytis, vid. lyginamojo indekso pokytis, abiejų standartiniai nuokrypiai, fondo ir indekso metinė grąža; laikotarpiai 6 mėn., 1, 3, 5 m., nuo pradžios. – *patvirtinta*
14. **Eksportas į Excel ir PDF.** – *patvirtinta*
15. **Lentelė nr. 2 – fondas prieš indeksą:** fondo grąža, indekso grąža, skirtumas, bruto grąža (be valdymo mokesčio). – *patvirtinta*
16. **Valdymo mokesčiai** kiekvienam fondui; mokestis skaičiuojamas proporcingai laikotarpiui. – *patvirtinta*
17. **Lentelė nr. 3 – „Performance KPI“:** fondas, grąža, peer median (be tos bendrovės), gross return, SAA (indekso grąža), Active / Local Active / Local Passive Manager (pasirenkami), rank in risk class, risk class (akcijų dalis %), fondų skaičius klasėje, AUM, dalis bendrovės turte; apačioje AUM pasverta grąža ir bendras AUM. – *patvirtinta*
18. **Atskiros „Performance KPI“ lentelės** II ir III pakopai. – *patvirtinta*

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
- **Būsena:** patvirtinta (2 etapas, CLAUDE.md skyrius „Vėliau“)
- **Autorius:** savininkas (CLAUDE.md)
- **Kodėl:** fondų portfelių sudėties ir jos pokyčių kas ketvirtį analizė.

### Fondo vietos (rank) kitimas laike
- **Būsena:** patvirtinta (2026-10-06; sujungta su „Meet“ 7)
- **Autorius:** Claude (pagal savininko atsakymą)
- **Kodėl:** jūs dažniausiai stebite fondo vietą konkurencijos lentelėje. Dabar matoma tik dabartinė vieta.
- **Nauda:** grafikas, kaip kiekvieno fondo vieta savo grupėje (pvz., pagal 1 m. grąžą) keitėsi kas mėnesį. Taip matyti, ar fondas pastoviai geras, ar tik neseniai pakilo.

### Šviežumo ženklas ir el. laiške
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** svetainėje jau matyti, kurie valdytojai atsilieka, bet vakarinis laiškas to nemini taip aiškiai.
- **Nauda:** laiške viena eilutė „atsilieka: Luminor (2 d. d.)“ – nereikia atidaryti svetainės.

### Duomenų spragų ženklas grafike
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** savininkas rankiniu būdu pildys istorines spragas; kol jų nėra, grafikas tyliai jungia taškus tiesia linija.
- **Nauda:** punktyrinė linija ten, kur trūksta duomenų, kad lankytojas neapsigautų.

### Grąžos ir rizikos taškinė diagrama peer grupėje
- **Būsena:** patvirtinta (sujungta su „Meet“ 5)
- **Autorius:** Claude
- **Kodėl:** lentelėse jau yra grąža, svyravimai ir Sharpe rodiklis, bet juos sunku aprėpti vienu žvilgsniu.
- **Nauda:** vienas grafikas: horizontaliai rizika (svyravimai), vertikaliai grąža, kiekvienas taškas yra grupės fondas. Iškart matyti, kuris fondas uždirba daugiau už tą pačią riziką.

### „Mano fondas“: savo fondo paryškinimas visur
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** dažniausiai žmogus seka vieną savo fondą ir jo vietą tarp kitų.
- **Nauda:** pasirinkus savo fondą, jis paryškinamas visose lentelėse ir grafikuose, o pasirinkimas įsimenamas naršyklėje. Patogu ir draugams: kiekvienas mato savo fondą.

### Palyginimas su pasaulio akcijų indeksu
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** jaunesnių gimimo grupių fondai daugiausia investuoja į pasaulio akcijas. Lyginant tik tarpusavyje, nematyti, ar visi kartu neatsilieka nuo rinkos.
- **Nauda:** grafike papildoma pilka linija, pvz. nemokamai skelbiamas pasaulio akcijų indekso ETF eurais. Matyti, kiek valdytojų rezultatas skiriasi nuo pigaus indekso.

### Užfiksuotas pirmas stulpelis plačiose lentelėse telefone
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** telefone plačios lentelės slenkamos į šoną, ir kairysis stulpelis (gimimo grupė ar fondas) dingsta iš akių.
- **Nauda:** slenkant lentelę, grupės pavadinimas lieka matomas, todėl skaičių nebereikia „gaudyti“.

### Heatmap langelio paaiškinimas užvedus pelę
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** langelyje matyti tik grąža, bet ne datos ir vieneto vertės, iš kurių ji paskaičiuota.
- **Nauda:** užvedus pelę ar paspaudus telefone matyti fondo pavadinimas, pradžios ir pabaigos datos bei vieneto vertės. Lengviau patikrinti skaičių ir paaiškinti draugams.

### Valdytojo kortelė paspaudus jo pavadinimą
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** rinkos lentelėse matyti visų valdytojų skaičiai, bet norint pažiūrėti vieną valdytoją reikia ieškoti po kelias lenteles.
- **Nauda:** paspaudus, pvz., „Swedbank“, atsidaro trumpa suvestinė: visi jo fondai, grąžos ir vietos per laikotarpius vienoje vietoje. Patogu ruošiantis pokalbiui apie konkretų valdytoją.

### Paskutinės dienos pokytis
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** dabar trumpiausias laikotarpis yra 1 mėn., todėl nematyti, kaip fondai pajudėjo vakar, pvz., po didesnio rinkos kritimo.
- **Nauda:** „Apžvalgos“ puslapyje stulpelis „1 d.“ su paskutinės dienos vieneto vertės pokyčiu. Iškart matyti, kurie fondai labiausiai reagavo į rinką.

### Rinkimo laikų žurnalas ataskaitoje
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** GitHub tvarkaraštis paleidimus vėlina valandomis (2026-10-07 rytinis paleidimas įvyko tik 14:19), o dabar tai matyti tik GitHub svetainėje.
- **Nauda:** vakariniame laiške viena eilutė: kada vyko paleidimai ir kada kiekvienas valdytojas paskelbė vertę. Per kelias savaites paaiškės, kada geriausia rinkti duomenis, ir bus galima sumažinti nereikalingų paleidimų.
