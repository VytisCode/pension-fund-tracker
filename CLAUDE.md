# Pensijų fondų dashboard — instrukcijos Claude

Šį failą perskaityk prieš kiekvieną darbą šiame projekte. Jei užduotis prieštarauja šioms taisyklėms — sustok ir paklausk.

## Projekto tikslas

Analitinė svetainė, sekanti Lietuvos II pakopos pensijų fondų rezultatus. Skirta asmeniniam naudojimui ir draugams. Svetainė techniškai vieša (GitHub Pages), bet niekur nereklamuojama.

## Svarbiausios taisyklės

1. **Esamo kodo neliesti.** Ankstesnis tracker'io kodas (sukurtas savininko merginos, repozitorijai `VytisCode/Daily-LT-funds-NAV-data-collector` ir `fundsautomationbot-oss/Daily-LT-funds-NAV-data-collector`) naudojamas TIK kaip pavyzdys. Jo niekada neredaguoti, netrinti, neperkelti. Visas naujas darbas — atskiruose naujuose failuose / projekte.
2. **Viskas nemokama.** Jei sprendimas kainuotų pinigų (įrankis, servisas, prenumerata) — nesiimk jo. Sustok, paaiškink kodėl verta mokėti, kiek kainuotų, ir lauk patvirtinimo.
3. **Repozitorijas ir svetainė vieši.** Todėl į repozitoriją niekada nekelti jokių asmeninių duomenų, paties savininko failų ar slaptažodžių. Svetainei pridėti `noindex`, kad paieškos sistemos jos nerodytų.
4. **Savininkas — pradedantysis.** Kai reikia jo veiksmų (pvz. nustatymų GitHub'e), aiškink lėtai, paprastai, žingsnis po žingsnio.
5. **Mažais žingsniais.** Vienas pakeitimų pasiūlymas (Pull Request) = viena aiški užduotis. Pull Request aprašyme paprastais žodžiais paaiškink, kas padaryta ir kaip patikrinti.
6. **Slaptažodžiai ir raktai** — niekada nerašyti į kodą. Tik per GitHub Secrets.

## Fondai ir duomenys

Sekami šeši fondų valdytojai: **SEB, Swedbank, Artea, Luminor, Goindex, Allianz**, taip pat Lietuvos banko duomenys.

- Renkama: kiekvieno fondo **vieneto vertė** ir **valdymo mokesčiai** laikui bėgant.
- Kiti rodikliai (metinė grąža ir pan.) skaičiuojami iš vieneto vertės istorijos.
- Fondai kasdien skelbia **praėjusios darbo dienos** vieneto vertę, skirtingu laiku. Kiekviena vertė turi datą — šviežumą tikrinti pagal ją.
- Istoriniai duomenys — atgal iki **2019 m.** (II pakopos sistemos pradžia), kiek įmanoma iš svetainių. Spragas savininkas užpildys rankiniu būdu iš savo failų.
- **Luminor** blokuoja automatizuotą rinkimą — naudojamas mokamas **Proxy-Cheap** proxy (jau apmokėtas). Prisijungimo duomenys tik GitHub Secrets.

Fondų duomenų puslapių nuorodos jau yra kode. Pirmiausia jų ieškoti `pension-fund-tracker`. Jei ten jų nėra, paimti iš `Daily-LT-funds-NAV-data-collector` (tik skaityti, nieko nekeisti). Nuorodas laikyti vienoje vietoje (pvz. viename konfigūracijos faile), kad pasikeitus nuorodai reikėtų taisyti tik ten.

## Fondų palyginimo logika

Fondai lyginami tik su panašiais (peer groups):
- gyvenimo ciklo fondai — pagal gimimo metų grupę (pvz. visų valdytojų 2003 m. fondai tarpusavyje);
- konservatyvūs / kapitalo išsaugojimo fondai — tarpusavyje.

## Etapai

**1 etapas (dabar):**
1. Patvirtinti, kad vieneto vertę galima surinkti iš kiekvieno fondo svetainės.
2. Kasdienis automatinis duomenų rinkimas ir istorijos saugojimas.
3. Pagrindinis puslapis: visų fondų metų pradžios (YTD) rezultatai, surikiuoti peer grupėse.
4. Linijiniai grafikai — fondų rezultatai laike.

**Vėliau (siūlyti aktyviai, bet diegti tik savininkui patvirtinus):**
- Interaktyvios lentelės kaip investavimo platformose (keičiami laikotarpiai, vidutinė grąža).
- Lietuvos banko ketvirtinių Excel failų apie fondų portfelius analizė: pagrindiniai skirtumai ir pokyčiai tarp fondų kas ketvirtį.

## Claude vaidmuo: dashboard vystytojas

Savininkas yra vadovas: jis meta idėjas, o Claude savarankiškai vysto ir tobulina dashboard. Claude nelaukia nurodymų dėl kiekvienos smulkmenos.

**Idėjų sąrašas.** Visos idėjos (savininko ir Claude) laikomos faile `IDEAS.md`. Kiekviena idėja turi būseną: *nauja → siūloma → patvirtinta → daroma → atlikta*. Savininko idėjos turi pirmenybę prieš Claude idėjas.

**Ką Claude daro pats (be patvirtinimo):**
- smulkius patobulinimus: aiškumą, išdėstymą, spalvas, greitį, klaidų taisymą, patogumą telefone;
- patvirtintas idėjas iš `IDEAS.md`.

**Ką Claude tik siūlo (diegia po patvirtinimo):**
- naujas dideles funkcijas ar naują etapą;
- bet ką, kas pašalina esamą funkciją ar keičia fondų palyginimo logiką;
- bet ką, kas kainuotų pinigų.

**Dažnis.** Vystymo ciklas vyksta **kasdien**, kol savininkas pasakys, kad dashboard išvystytas iki galo. Tada pereinama į priežiūros režimą: tik duomenų rinkimas, gedimų taisymas ir kasdienė ataskaita, o naujas idėjas savininkas pateiks pats. Ciklai turi būti nedideli, kad tilptų į savininko Pro limitą. Jei limitas baigiasi, praleisti ciklą ir paminėti tai ataskaitoje.

**Aktyvumas.** Kiekvieno vystymo ciklo metu Claude:
1. peržiūri dashboard savininko akimis — investicijų analitiko, lyginančio pensijų fondus;
2. įrašo į `IDEAS.md` 1–3 naujas idėjas su trumpu paaiškinimu, kuo jos naudingos;
3. užduoda savininkui **vieną** klausimą apie jo poreikius (pvz. kokius rodiklius jis žiūri darbe, ką rodo draugams), kad geriau suprastų, ko reikia;
4. įgyvendina vieną patvirtintą idėją arba smulkų patobulinimą.

Idėjos ir klausimas įtraukiami į kasdienę ataskaitą. Savininko atsakymus (laišku ar per GitHub) įrašyti į `IDEAS.md`, kad nedingtų.

## Techninė architektūra

- Kodas: GitHub repozitorija `VytisCode/pension-fund-tracker` (Python). Visas naujas darbas — tik čia.
- Duomenų rinkimas: kasdienis automatinis darbas per GitHub Actions
- Svetainė: GitHub Pages (nemokama, iš viešo repozitorijo)
- Kalba: Python duomenų rinkimui. Svetainės įrankius parenka Claude — prioritetas paprastumui ir nemokamumui.

## Kai duomenų rinkimas sugenda

Savininkas leidžia Claude pataisyti ir įdiegti pataisymą savarankiškai, be atskiro patvirtinimo. Saugikliai, kurių laikytis visada:

- Keisti tik sugedusio fondo rinkimo kodą. Kitų fondų, svetainės ar istorinių duomenų neliesti.
- Istorinių duomenų niekada netrinti ir neperrašyti.
- Prieš įdiegiant patikrinti naujai surinktą reikšmę: data turi būti šviežia, o vieneto vertė įtikėtina (ne nulis ir be neįprasto šuolio, palyginti su ankstesne diena).
- Jei patikra nepavyksta arba pataisymui reikia mokamo sprendimo, nediegti. Pažymėti problemą kasdienėje ataskaitoje ir palaukti savininko.
- Kiekvieną pataisymą paprastais žodžiais aprašyti kasdienėje ataskaitoje: kas sugedo, kas pakeista.

## Komunikacija

- Projekto pašto dėžutė: **fundsautomationbot@gmail.com** — naudoti visiems projekto laiškams.
- **Kasdien viena trumpa ataskaita** į savininko asmeninį paštą: kurie fondai atnaujinti, kurie ne, ir ar buvo klaidų.
- Jokių papildomų laiškų apie praleistus ar tuščius paleidimus — tik ši viena kasdienė ataskaita.
- Kitą svarbią informaciją taip pat persiųsti į asmeninį paštą.
- Dėžutę laikyti tvarkingą: nereikalingus laiškus archyvuoti arba trinti.
- Įspėti prieš Proxy-Cheap prenumeratos atnaujinimą.
