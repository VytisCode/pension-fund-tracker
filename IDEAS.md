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

Kai lyginate fondus darbe ar rodote draugams, ar jums svarbiau **grąža po mokesčių** (t. y. ką realiai gauna taupytojas), ar užtenka grąžos pagal vieneto vertę, kaip dabar? Nuo to priklauso, kaip rodysime valdymo mokesčius: atskiru stulpeliu ar jau įskaičiuotus į grąžą.

---

## Savininko idėjos

### Nerodyti vėliau atsiradusių fondų nuo dirbtinės pradžios
- **Būsena:** atlikta (PR #2, 2026-10-06)
- **Autorius:** savininkas
- **Kas:** jei fondas pradėjo veikti vėliau nei pasirinkto laikotarpio pradžia, jo linija grafike nebepiešiama. Po grafiku parašoma, kurie fondai nerodomi ir nuo kada jų duomenys prasideda. Pasirinkus trumpesnį laikotarpį, jie vėl matomi. Tas pats galioja ir „Apžvalgos“ bei III pakopos puslapiams.

---

## Pirmi 3 darbai (1 etapo užbaigimui)

### 1. Kad duomenys tikrai būtų renkami automatiškai kasdien
- **Būsena:** daroma (2026-10-06 savininkas per GitHub svetainę paredagavo `update.yml`; laukiama pirmo automatinio paleidimo)
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
- **Būsena:** patvirtinta
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
- **Būsena:** patvirtinta (2026-10-06)
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
- **Būsena:** nauja
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
