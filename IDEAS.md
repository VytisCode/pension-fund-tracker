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

## Laukia savininko (nieko nedaryti, kol neatsakys)

- **#11** Artea Ambicingas Active 16+ didžiausias kritimas −78,8 %: viršūnė 2007-10-11 (0,6092), dugnas 2009-03-09 (0,1292), daugiausia 2008 m. rugsėjo–lapkričio mėn. Savininkas patikrins šias datas.
- Saugumas: 2026-10-12 į projekto dėžutę atėjo GitHub raktas atviru tekstu. Patarta jį atšaukti. Raktas nenaudotas.

## Nedaryti (savininkas atmetė)

Audito #3, #4, #13 (stulpelio „Sodra €“ neslėpti), #29, #33, #35, #37, #47, #56, #58, #62.

## Daroma (2026-10-14 savininko užduotis)

- [Rezultatai] 4 heat map lentelės kaip savininko Excel: grąža, palyginimas su konkurentais, vieta grupėje, metinė; eilutė „Vidurkis“ su tarpeliu.
- [Rezultatai] infliacijos linija grafike „Fondų palyginimas“.
- [Rezultatai ir visur, kur indeksai] indekso mokestis: įrašomas ranka; numatytasis – tipinio to indekso ETF mokestis; be mokesčio; pensijų fondų vidutinis mokestis.
- [Turtas] lentelė „Grynieji aktyvai“: bet koks datų intervalas; fondų pasirinkimas (valdytojų sumos, visi valdytojo fondai, pasirinkti fondai).
- [Ataskaitos] vietoj „Fondo rodikliai (LB išdėstymas)“ – pusmečio ataskaitos lentelės bet kuriam fondui (ir III pakopos): mokesčiai, rizikingi aktyvai, SFDR, vidutinė metinė grąža, grąža pagal metus, didžiausios pozicijos, pasiskirstymas pagal rūšį ir regionus; patikrinta su SEB 2024–2026 ataskaitomis; Excel su formulėmis puslapio viršuje.

## Ateityje (savininkas pateiks medžiagą, kai bus baigti dabartiniai darbai)

- „KID Performance Scenario Calculations“ lentelė – savininkas pasidalins metodika.
- Fondų dalyvių skaičiai iš LB ataskaitų.

## Eilė: audito paketai (vienas ciklas = vienas paketas)

### 9. Pradžios puslapis ir KPI kortelės
- **#42** Pradžios puslapis „Šiandien trumpai“ (dabar `index.html` peradresuoja): 3–4 didelės kortelės (metų pradžios lyderis ir atsiliekantis, savaitės pokytis, II pakopos turtas iš viso), 2–3 automatiniai sakiniai, mažos kreivės, nuorodos „Plačiau →“. Remtis savininko „Performance & peers“ vaizdu (žr. sprendimus). Be kreipinių į lankytoją.
- **#50** KPI kortelės kiekvieno puslapio viršuje (kaip III pakopos puslapyje).
- **#52** Telefone svarbiausios lentelės (santrauka, AUM) – kortelių režimu.

### 10. Šviežumas ir šaltiniai
- **#54** Šviežumo priminimai **visiems duomenims**: LB portfelių ataskaitos, LB rezultatų ir mokesčių failai, ketvirčio AUM, indeksai, €STR. Bendras sąrašas su „kitų laukiama iki“ datomis ir viena juosta puslapio viršuje.
- **#55** Po kiekviena lentele smulki eilutė: „Šaltinis: …, data · Metodika →“.
- **#57** Žinomų apribojimų sąrašas „Apie“ puslapyje ir trumpai prie susijusių lentelių.

### 11. „Apie ir metodika“ + Excel su formulėmis (gali užimti 2 ciklus)
- **#53** Puslapis „Apie ir metodika“: iš kur kiekvienas duomuo, kaip dažnai atnaujinama, formulės, prielaidos, žinomi netikslumai; be nuorodų į kodą ar GitHub. **Labai svarbu:** prie kiekvienos lentelės ir diagramos – to vaizdo Excel failas su (1) pradiniais duomenimis (vieneto vertės su datomis, šaltinis), (2) skaičiavimu žingsnis po žingsnio su **tikromis Excel formulėmis**, (3) lapu „Metodika ir šaltiniai“. Tikslas – kad savininkas galėtų įrodyti savo skaičius kitam analitikui. Dabartiniai Excel failai per sudėtingi. Pradėti nuo „Rezultatų“ heatmap ir rodiklių lentelių.

### 12. Grafikų eksportas ir naujos diagramos
- **#67** „Kopijuoti vaizdą“ ir „Atsisiųsti PNG“ prie kiekvieno grafiko (savininkui labai patinka).
- **#60** [Rezultatai] horizontali stulpelinė diagrama – laikotarpio grąža kiekvienam fondui, surikiuota, su reikšmėmis.
- **#68** [Turtas] turto pokytį išskaidyti į grąžą, įmokas ir išmokas (reforma) – stulpeliai.

### 13. Spausdinimas
- **#51** Spausdinimas / PDF: slėpti mygtukus, antraštė su data ir šaltiniais, lūžiai tarp kortelių. Renkamasi iš dviejų dizainų – esamo (jaukaus) ir universalaus (baltas fonas, prezentacijoms).

### 14. Fondo / valdytojo puslapis (2–3 ciklai)
- **#61 + #64** Vieno fondo arba vieno valdytojo puslapis: grąžos visais laikotarpiais, vieta grupėje, mokestis, turtas, portfelio sudėtis, 10 didžiausių pozicijų, rizika. Pasirinkus valdytoją, puslapis įgauna jo spalvas (Swedbank – oranžinė, SEB – žalia ir t. t.). Spausdinama vieno A4 lapo valdytojo suvestinė.

### 15. Apžvalgos ir kita
- **#59** Automatinė mėnesio apžvalga (PDF persiuntimui) ir ketvirčio apžvalga: kas pasikeitė per mėnesį, ketvirtį, YTD ir YoY; portfelių pokyčiai, išskirtinumai.
- **#63** [Portfeliai] valdytojų panašumas – kiek portfeliai sutampa, unikaliausias valdytojas; regionai, turto klasės, TER, alternatyvos.
- **#65** [Kelias į pensiją] ateities scenarijai (pesimistinis/vidutinis/optimistinis). Sodros pensijai pirma ieškoti oficialių prognozių (Sodros skaičiuoklė, ministerijų projekcijos, EK „Ageing Report“, „Pension Adequacy Report“); jei nėra – rodyti tik kaupimo dalį ir pažymėti prielaidas.
- **#66** Žodynėlis (užuominos ant terminų) – paskutinis.

## Senesnės patvirtintos idėjos (prieš imant – patikrinti, ar dar aktualu)

- Ataskaitos: lentelė su vid. vieneto vertės ir indekso pokyčiu bei standartiniais nuokrypiais (6 mėn., 1, 3, 5 m., nuo pradžios) (Meet B13); valdymo mokestis proporcingai laikotarpiui (Meet B16).
- Šviežumo eilutė ir vakariniame laiške („atsilieka: Luminor (2 d. d.)“).
- Duomenų spragos grafike – punktyru.
- „Mano fondas“: pasirinktas fondas paryškinamas visur, įsimenamas naršyklėje.
- Pilka pasaulio akcijų indekso (ETF eurais) linija grafike.
- Heatmap langelio užuomina: fondas, datos, vieneto vertės.
- Paskutinės dienos pokytis („1 d.“ stulpelis apžvalgoje).
- Rinkimo laikų žurnalas vakariniame laiške.
