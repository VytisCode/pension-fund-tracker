# Idėjų sąrašas

Čia laikomos visos dashboard idėjos: savininko ir Claude. Savininko idėjos turi pirmenybę.

Būsenos: *nauja → siūloma → patvirtinta → daroma → atlikta*.
Kad Claude imtųsi idėjos, pakeiskite jos būseną į **patvirtinta** arba tiesiog parašykite tai pokalbyje.

---

## Pirmi 3 siūlomi darbai (1 etapo užbaigimui)

### 1. Kad duomenys tikrai būtų renkami automatiškai kasdien
- **Būsena:** siūloma
- **Autorius:** Claude
- **Kodėl:** darbo eiga „Update fund data“ veikia, kai paleidžiama ranka, bet pagal tvarkaraštį GitHub jos dar nė karto nepaleido (2026-10-06 rytą: 0 suplanuotų paleidimų). Kol taip yra, 1 etapo 2 punktas (kasdienis automatinis rinkimas) neįvykdytas.
- **Ką daryti:** išsiaiškinti, kodėl GitHub nevykdo tvarkaraščio, ir jį „perkrauti“. Pridėti apsaugą: jei per dieną nebuvo nė vieno paleidimo, apie tai pranešti kasdienėje ataskaitoje. Jei GitHub tvarkaraštis ir toliau neveiks, pasiūlyti nemokamą atsarginį paleidiklį.
- **Nauda:** svetainė atsinaujins be jūsų įsikišimo.

### 2. Svetainės ir repozitorijos privatumas: `noindex` ir proxy adreso slėpimas
- **Būsena:** siūloma
- **Autorius:** Claude
- **Kodėl:** CLAUDE.md reikalauja, kad svetainėje būtų `noindex`, bet nė viename puslapyje jo dar nėra. Be to, viešame žurnale `data/last_update_log.txt` matyti Luminor proxy IP adresas ir prievadas. Slaptažodis ten nerodomas.
- **Ką daryti:** visiems puslapiams pridėti `<meta name="robots" content="noindex">` ir `robots.txt`. Žurnale proxy adresą pakeisti į „***“.
- **Nauda:** svetainės nerodys „Google“ ir kitos paieškos sistemos, o proxy adresas nebebus skelbiamas viešai.

### 3. Kasdienė ataskaita el. paštu vietoj „Issue“ komentarų
- **Būsena:** siūloma
- **Autorius:** Claude
- **Kodėl:** dabar po kiekvieno paleidimo ataskaita rašoma kaip GitHub „Issue“ komentaras (testavimo fazė). CLAUDE.md numato **vieną** trumpą ataskaitą per dieną į jūsų asmeninį paštą iš `fundsautomationbot@gmail.com`.
- **Ką daryti:** vakare (po paskutinio paleidimo) siųsti vieną laišką. Laiške nurodyti, kurie fondai atnaujinti, kurie ne, ar buvo klaidų, kiek liko Luminor bandymų, ir įtraukti dienos idėjas bei klausimą. Prisijungimo duomenis laikyti tik GitHub Secrets. Pradėjus siųsti laiškus, „Issue“ komentarų žingsnį pašalinti.
- **Nauda:** viskas vienoje vietoje, mažiau pranešimų.

---

## Kitos idėjos (vėlesniam laikui)

### Valdymo mokesčių rinkimas
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** CLAUDE.md numato rinkti ir valdymo mokesčius, bet kol kas renkamos tik vieneto vertės ir turto dydis.
- **Nauda:** galima palyginti, kiek fondai kainuoja, ir grąžą vertinti atsižvelgiant į mokesčius.

### Visos fondų nuorodos viename konfigūracijos faile
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** fondų puslapių nuorodos dabar išbarstytos po kelis failus (`sources/*.py`, `update.py`, `pillar3.py`). CLAUDE.md prašo jas laikyti vienoje vietoje.
- **Nauda:** pasikeitus fondo svetainei, nuorodą reikės pataisyti tik vienoje vietoje.

### Duomenų šviežumo ženklas svetainėje
- **Būsena:** nauja
- **Autorius:** Claude
- **Kodėl:** fondai vertes skelbia skirtingu laiku, o kartais rinkimas nepavyksta (pvz., Luminor).
- **Nauda:** prie kiekvieno valdytojo matytųsi paskutinė vertės data. Jei duomenys pasenę, ji būtų paryškinta, kad lankytojas nesuklystų lygindamas.

### Lietuvos banko ketvirtiniai portfelių duomenys
- **Būsena:** nauja (2 etapas, CLAUDE.md skyrius „Vėliau“)
- **Autorius:** savininkas (CLAUDE.md)
- **Kodėl:** fondų portfelių sudėties ir jos pokyčių kas ketvirtį analizė.
