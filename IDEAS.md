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
- 2026-10-14 (atsakymai): eilė 9–15 daroma iš karto, paketas po paketo; „Relative to the peers“ – kol valdytojas nepasirinktas, lyginama su kitų mediana (tinka); Ataskaitose renkamas bet kuris ketvirčio galas, iš pradžių paskutinis; SFDR – tiesioginės akcijos, obligacijos, indėliai, išvestinės – eilutė „Neklasifikuojama“; mokesčių lentelė pildoma iš LB mokesčių failų (`data/fees.csv`, `import_lb_fees.py`). Artea Ambicingas Active 16+ −78,8 % savininkas patikrino – duomenys teisingi.

## Laukia savininko (nieko nedaryti, kol neatsakys)

- Saugumas: 2026-10-12 į projekto dėžutę atėjo GitHub raktas atviru tekstu. Patarta jį atšaukti. Raktas nenaudotas.

## Nedaryti (savininkas atmetė)

Audito #3, #4, #13 (stulpelio „Sodra €“ neslėpti), #29, #33, #35, #37, #47, #56, #58, #62.

## Ateityje (savininkas pateiks medžiagą, kai bus baigti dabartiniai darbai)

- Ataskaitos: SFDR dar nežinomas ~40 mažesnių fondų (daugiausia Baltijos privataus kapitalo / NT) – papildyti `data/fund_attributes.csv`, kai bus šaltinis.

- „KID Performance Scenario Calculations“ lentelė – savininkas pasidalins metodika.
- Fondų dalyvių skaičiai iš LB ataskaitų.

## Eilė: audito paketai (vienas ciklas = vienas paketas)

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
