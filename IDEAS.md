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
