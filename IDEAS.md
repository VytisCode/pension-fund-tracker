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

## Laukia savininko (nieko nedaryti, kol neatsakys)

- Saugumas: 2026-10-12 į projekto dėžutę atėjo GitHub raktas atviru tekstu. Patarta jį atšaukti. Raktas nenaudotas.

## Nedaryti (savininkas atmetė)

Audito #3, #4, #13 (stulpelio „Sodra €“ neslėpti), #29, #33, #35, #37, #47, #56, #58, #62.

## Ateityje (savininkas pateiks medžiagą, kai bus baigti dabartiniai darbai)

- Ataskaitos: SFDR dar nežinomas ~40 mažesnių fondų (daugiausia Baltijos privataus kapitalo / NT) – papildyti `data/fund_attributes.csv`, kai bus šaltinis.

- „KID Performance Scenario Calculations“ – metodika gauta 2026-10-14 (žr. S9).
- Fondų dalyvių skaičiai iš LB ataskaitų.

## Eilė: audito paketai (vienas ciklas = vienas paketas)

## Eilė: savininko užduotys 2026-10-14 (vakaras)

- **S1** Visi duomenų šaltiniai: peržiūrėti visus puslapius, surašyti kiekvieną šaltinį į esamą sąrašą („Apie“) su nuorodomis ir atnaujinimo datomis; automatizuoti kiek įmanoma; rankiniu būdu įkeliamiems – atnaujinimo tvarkaraštis.
- **S2** KPI „Istorija nuo 2018-12-21“ klaidina – gyvenimo ciklo fondai veikia nuo 2019 m.; nerodyti tokios datos.
- **S3** Kompiuteryje išnaudoti daugiau ekrano pločio (mažesni tarpai kairėje ir dešinėje).
- **S4** „Mokesčių poveikis laike“ – į „Kelias į pensiją“ apačią, susieti su dalyvio duomenimis (laukia atsakymo, ar palikti ir Rezultatuose); laikotarpis pagal pasirinkimą viršuje.
- **S5** III pakopa: laikotarpio juosta prilimpanti.
- **S6** „Valdytojas ir fondas“: datos / laikotarpio pasirinkimas; „Grynieji aktyvai ketvirčių pabaigoje“ – € ir %, II ir III pakopa atskirai, kiekvienas valdytojo fondas atskirai.
- **S7** Navigacijos juostos nepaslinkti – kompiuteryje nepasiekiami „Kelias į pensiją“, „Apie“.
- **S8** Ataskaitos: matyti visus valdytojo fondus vienu metu (lentelės ir vienas Excel).
- **S9** KID veiklos rezultatų scenarijai pagal Reglamento (ES) 2017/653 IV priedą; patikrinti su SEB PID (pensija 18+, index. Klimato ateitis, pensija 58+); naudoti ir „Kelias į pensiją“ KID variante.

## Senesnės patvirtintos idėjos (prieš imant – patikrinti, ar dar aktualu)

- Ataskaitos: lentelė su vid. vieneto vertės ir indekso pokyčiu bei standartiniais nuokrypiais (6 mėn., 1, 3, 5 m., nuo pradžios) (Meet B13); valdymo mokestis proporcingai laikotarpiui (Meet B16).
- Šviežumo eilutė ir vakariniame laiške („atsilieka: Luminor (2 d. d.)“).
- Duomenų spragos grafike – punktyru.
- „Mano fondas“: pasirinktas fondas paryškinamas visur, įsimenamas naršyklėje.
- Pilka pasaulio akcijų indekso (ETF eurais) linija grafike.
- Heatmap langelio užuomina: fondas, datos, vieneto vertės.
- Paskutinės dienos pokytis („1 d.“ stulpelis apžvalgoje).
- Rinkimo laikų žurnalas vakariniame laiške.
