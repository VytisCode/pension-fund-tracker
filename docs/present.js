/* Pristatymas (savininkas 2026-11-11): dashboard funkcijų apžvalga skaidrėmis.
   Kiekviena skaidrė – tikras svetainės puslapis rėmelyje (?embed=1: be meniu ir antraštės, common.js EMBED), tiesiai reikiamame skirtuke,
   todėl skaičiai visada šios dienos ir nieko nedubliuojama. Šalia – 2–4 trumpi komentarai ir „kodėl tai svarbu“.
   Tekstai – keturiomis kalbomis čia pat (vienoje vietoje lengviau prižiūrėti). Šalies jungiklis: tas pats puslapis kitos šalies duomenimis
   (common.js ctryHref; jei šalis duomenų neskelbia – ctryWhy paaiškinimas).
   Priežiūra: pakeitus puslapio skirtuką (data-tab) – pataisyti SLIDES; tools/smoke_test.py kasdien tikrina, ar kiekvienos skaidrės skirtukas yra.
   Klavišai: → ← tarpas PageUp/PageDown (pultelis), Home/End, F – visas ekranas, L – lazeris, D – piešti, S – prožektorius, C – išvalyti,
   N – komentarai, G – skaidrių tinklelis, B – juodas ekranas, + / − / 0 – mastelis, ? – pagalba, Esc – išjungti įrankį. */

const PS_SEC = {
  intro: { lt: 'Įžanga', en: 'Introduction', lv: 'Ievads', et: 'Sissejuhatus' },
  home: { lt: 'Pradžia', en: 'Home', lv: 'Sākums', et: 'Avaleht' },
  facts: { lt: 'Rinkos faktai', en: 'Market facts', lv: 'Tirgus fakti', et: 'Turu faktid' },
  mgr: { lt: 'Valdytojai', en: 'Managers', lv: 'Pārvaldītāji', et: 'Fondivalitsejad' },
  p2: { lt: 'II pakopa', en: 'Pillar II', lv: '2. līmenis', et: 'II sammas' },
  p3: { lt: 'III pakopa', en: 'Pillar III', lv: '3. līmenis', et: 'III sammas' },
  pf: { lt: 'Portfeliai', en: 'Portfolios', lv: 'Portfeļi', et: 'Portfellid' },
  aum: { lt: 'Turtas', en: 'Assets', lv: 'Aktīvi', et: 'Varad' },
  rep: { lt: 'Ataskaitos', en: 'Reports', lv: 'Pārskati', et: 'Aruanded' },
  jr: { lt: 'Kelias į pensiją', en: 'Road to retirement', lv: 'Ceļš uz pensiju', et: 'Tee pensionini' },
  bx: { lt: 'Trys šalys', en: 'Three countries', lv: 'Trīs valstis', et: 'Kolm riiki' },
  how: { lt: 'Kaip tai veikia', en: 'How it works', lv: 'Kā tas darbojas', et: 'Kuidas see töötab' },
  end: { lt: 'Pabaiga', en: 'Summary', lv: 'Kopsavilkums', et: 'Kokkuvõte' },
};

/* p – LT puslapis (šalies atitikmuo – ctryHref), h – skirtukas / vieta (#tab=…), u – fiksuotas adresas (be šalies jungiklio),
   ltOnly – tik Lietuvoje. b – komentarai ant vaizdo: q – CSS selektorius puslapyje, į kurį rodo rodyklė (null – be rodyklės);
   rodomi po vieną (→), paskutinis žingsnis – „kodėl tai svarbu“ (w). */
const SLIDES = [
  { id: 'intro', s: 'intro', text: 'intro',
    t: { lt: 'Pensijų fondų dashboard', en: 'Pension fund dashboard', lv: 'Pensiju fondu panelis', et: 'Pensionifondide ülevaade' } },
  { id: 'td', s: 'home', p: 'index', h: 'tab=td',
    t: { lt: 'Šiandien', en: 'Today', lv: 'Šodien', et: 'Täna' },
    b: [{ q: '#per', lt: 'Laikotarpis – diena, savaitė, mėnuo, ketvirtis, metai: visi skaičiai persiskaičiuoja iš karto.', en: 'Period – day, week, month, quarter, year: every number recalculates at once.', lv: 'Periods – diena, nedēļa, mēnesis, ceturksnis, gads: visi skaitļi pārrēķinās uzreiz.', et: 'Periood – päev, nädal, kuu, kvartal, aasta: kõik numbrid arvutatakse kohe ümber.' },
      { q: '#ref', lt: 'Lyginamasis valdytojas pasirenkamas; kol nepasirinktas – lyginama su kitų valdytojų mediana.', en: 'The reference manager is chosen freely; until chosen, results are compared with the median of the others.', lv: 'Salīdzināmo pārvaldītāju izvēlas brīvi; kamēr nav izvēlēts – salīdzina ar pārējo mediānu.', et: 'Võrdlusfondivalitseja valitakse vabalt; kuni valimata – võrreldakse teiste mediaaniga.' },
      { q: '#hg||#big', lt: 'Kortelės – kiekviena atsako į vieną klausimą: kiek uždirbo dalyvio euras, kas pirmauja, kiek sukaupta, kur didžiausi skirtumai.', en: 'Cards – each answers one question: what the participant’s euro earned, who leads, how much is saved, where the gaps are.', lv: 'Kartītes – katra atbild uz vienu jautājumu: cik nopelnīja dalībnieka eiro, kas ir līderis, cik uzkrāts, kur ir lielākās atšķirības.', et: 'Kaardid – igaüks vastab ühele küsimusele: mida teenis osaleja euro, kes on liider, kui palju on kogutud, kus on suurimad erinevused.' }],
    w: { lt: 'Vienas žvilgsnis atsako, kaip rinkai sekėsi ir kur yra kiekvienas valdytojas; atnaujinama kiekvieną darbo dieną.', en: 'One glance answers how the market did and where each manager stands; updated every working day.', lv: 'Viens skatiens atbild, kā tirgum veicās un kur atrodas katrs pārvaldītājs; atjaunināts katru darba dienu.', et: 'Üks pilk vastab, kuidas turul läks ja kus iga fondivalitseja asub; uueneb igal tööpäeval.' } },
  { id: 'my', s: 'home', p: 'index', h: 'tab=td',
    t: { lt: 'Mano kortelės', en: 'My cards', lv: 'Manas kartītes', et: 'Minu kaardid' },
    b: [{ q: '#myC [data-mya="lib"]', lt: 'Kiekvienas susidaro savo kortelių rinkinį: fondas, valdytojas, laikotarpis, palyginimas.', en: 'Everyone builds their own set of cards: fund, manager, period, comparison.', lv: 'Katrs izveido savu kartīšu kopu: fonds, pārvaldītājs, periods, salīdzinājums.', et: 'Igaüks paneb kokku oma kaardid: fond, fondivalitseja, periood, võrdlus.' },
      { q: '#myC [data-mya="share"]', lt: 'Rinkinį galima perduoti kolegai nuoroda.', en: 'The set can be shared with a colleague as a link.', lv: 'Kopu var nodot kolēģim ar saiti.', et: 'Komplekti saab kolleegile saata lingiga.' },
      { q: '#myC', lt: 'Kiekviena kortelė turi savo nustatymus; rinkinys išsaugomas naršyklėje, atskirai kiekvienai šaliai.', en: 'Each card has its own settings; the set is saved in the browser, separately for each country.', lv: 'Katrai kartītei savi iestatījumi; kopa saglabājas pārlūkā, atsevišķi katrai valstij.', et: 'Igal kaardil on oma seaded; komplekt salvestub brauseris, iga riigi jaoks eraldi.' }],
    w: { lt: 'Skirtingiems žmonėms svarbūs skirtingi skaičiai: vienas dashboard, daug vaizdų.', en: 'Different people need different numbers: one dashboard, many views.', lv: 'Dažādiem cilvēkiem svarīgi dažādi skaitļi: viens panelis, daudz skatu.', et: 'Eri inimestele on olulised eri numbrid: üks ülevaade, palju vaateid.' } },
  { id: 'nw', s: 'home', p: 'index', h: 'tab=nw',
    t: { lt: 'Naujienos apie pensijas', en: 'Pension news', lv: 'Pensiju ziņas', et: 'Pensioniuudised' },
    b: [{ q: '#nwBar', lt: 'Kasdien surenkami straipsniai iš naujienų paieškos ir leidinių RSS, archyvas nuo 2019 m.; atskirai kiekvienai šaliai.', en: 'Articles collected daily from news search and publishers’ RSS, archive since 2019; separately for each country.', lv: 'Raksti tiek apkopoti katru dienu no ziņu meklēšanas un izdevumu RSS, arhīvs kopš 2019. gada; atsevišķi katrai valstij.', et: 'Artiklid kogutakse iga päev uudisteotsingust ja väljaannete RSS-ist, arhiiv alates 2019; iga riigi jaoks eraldi.' },
      { q: '#nwTl', lt: 'Temų laiko juosta: kada tema iškilo, kiek truko, kada užgeso.', en: 'Topic timeline: when a topic appeared, how long it lasted, when it faded.', lv: 'Tēmu laika josla: kad tēma parādījās, cik ilgi ilga, kad pierima.', et: 'Teemade ajajoon: millal teema tekkis, kui kaua kestis, millal vaibus.' },
      { q: '#nwAc', lt: '„Kas kalba“: institucijos, partijos, organizacijos ir komentatoriai pagal metus.', en: '“Who speaks”: institutions, parties, organisations and commentators by year.', lv: '“Kas runā”: iestādes, partijas, organizācijas un komentētāji pa gadiem.', et: '„Kes räägib“: asutused, erakonnad, organisatsioonid ja kommentaatorid aastate kaupa.' }],
    w: { lt: 'Pensijų rezultatus lemia ne tik rinkos, bet ir sprendimai: reforma, įmokos, mokesčiai.', en: 'Pension outcomes depend not only on markets but on decisions: reform, contributions, taxes.', lv: 'Pensiju rezultātus nosaka ne tikai tirgi, bet arī lēmumi: reforma, iemaksas, nodokļi.', et: 'Pensionitulemusi ei mõjuta ainult turud, vaid ka otsused: reform, sissemaksed, maksud.' } },
  { id: 'qf', s: 'facts', p: 'facts', h: 'tab=qf',
    t: { lt: 'Ketvirčio faktai', en: 'Quarter facts', lv: 'Ceturkšņa fakti', et: 'Kvartali faktid' },
    b: [{ q: '#qfKpis', lt: 'Pagrindas – Lietuvos banko ketvirčio duomenys nuo 2015 m.: dalyviai, turtas, pokyčiai.', en: 'Based on Bank of Lithuania quarterly data since 2015: members, assets, changes.', lv: 'Pamatā – Lietuvas Bankas ceturkšņa dati kopš 2015. gada: dalībnieki, aktīvi, izmaiņas.', et: 'Aluseks Leedu Panga kvartaliandmed alates 2015: osalejad, varad, muutused.' },
      { q: '#qfCards .fact', lt: 'Faktai sakiniais su skaičiais: kas augo, kas krito, kas pirmavo.', en: 'Facts as sentences with numbers: what grew, what fell, who led.', lv: 'Fakti teikumos ar skaitļiem: kas auga, kas kritās, kas bija pirmais.', et: 'Faktid lausetena koos numbritega: mis kasvas, mis langes, kes juhtis.' },
      { q: '#qfXl', lt: 'Excel su formulėmis ir apžvalgos juodraštis Word formatu – vienu paspaudimu.', en: 'Excel with formulas and a review draft in Word – one click each.', lv: 'Excel ar formulām un pārskata melnraksts Word formātā – ar vienu klikšķi.', et: 'Valemitega Excel ja ülevaate mustand Wordis – ühe klõpsuga.' }],
    w: { lt: 'Ataskaitai reikia ne lentelės, o patikrinamo sakinio.', en: 'A report needs a verifiable sentence, not a table.', lv: 'Pārskatam vajag nevis tabulu, bet pārbaudāmu teikumu.', et: 'Aruandesse on vaja kontrollitavat lauset, mitte tabelit.' } },
  { id: 'eu', s: 'facts', p: 'facts', h: 'tab=eu',
    t: { lt: 'Uždarbis eurais', en: 'Earnings in euros', lv: 'Peļņa eiro', et: 'Tulu eurodes' },
    b: [{ q: '#euBody', lt: 'Kiek eurų fondai uždirbo ar prarado per paskutinę dieną, mėnesį, ketvirtį, metus.', en: 'How many euros the funds earned or lost over the last day, month, quarter, year.', lv: 'Cik eiro fondi nopelnīja vai zaudēja pēdējā dienā, mēnesī, ceturksnī, gadā.', et: 'Mitu eurot fondid teenisid või kaotasid viimasel päeval, kuul, kvartalis, aastal.' },
      { q: '#euCh', lt: 'Skaičiuojama tik investicijų grąža: įmokos ir išmokos atskirtos.', en: 'Only investment return is counted: contributions and payouts are separated.', lv: 'Tiek skaitīts tikai ieguldījumu ienesīgums: iemaksas un izmaksas atdalītas.', et: 'Arvestatakse ainult investeerimistulu: sissemaksed ja väljamaksed on eraldatud.' },
      { q: '#euBar', lt: 'Galima pasirinkti pakopą, valdytoją ar fondą.', en: 'Choose the pillar, a manager or a fund.', lv: 'Var izvēlēties līmeni, pārvaldītāju vai fondu.', et: 'Valida saab samba, fondivalitseja või fondi.' }],
    w: { lt: 'Procentai abstraktūs, eurai parodo mastą: kiek tai reiškia visiems dalyviams kartu.', en: 'Percentages are abstract; euros show the scale for all members together.', lv: 'Procenti ir abstrakti, eiro parāda mērogu visiem dalībniekiem kopā.', et: 'Protsendid on abstraktsed, eurod näitavad mastaapi kõigi osalejate jaoks kokku.' } },
  { id: 'mg', s: 'mgr', p: 'managers', h: 'tab=mg',
    t: { lt: 'Valdytojai', en: 'Managers', lv: 'Pārvaldītāji', et: 'Fondivalitsejad' },
    b: [{ q: '#mgTiles', lt: 'Valdytojų plytelės: rinkos dalis ir jos pokytis per ketvirtį ar metus.', en: 'Manager tiles: market share and its change over the quarter or year.', lv: 'Pārvaldītāju kartītes: tirgus daļa un tās izmaiņas ceturksnī vai gadā.', et: 'Fondivalitsejate kaardid: turuosa ja selle muutus kvartali või aasta jooksul.' },
      { q: '#brCards', lt: '„Kuo gali pasigirti“: šiuo metu galiojančios kiekvieno valdytojo pirmos vietos.', en: '“Bragging rights”: each manager’s current first places.', lv: '“Ar ko var lepoties”: katra pārvaldītāja pašreizējās pirmās vietas.', et: '„Millega kiidelda“: iga fondivalitseja praegused esikohad.' },
      { q: '#mgChartBox', lt: 'Rinkos dalis laike – nuo 2015 m.', en: 'Market share over time – since 2015.', lv: 'Tirgus daļa laikā – kopš 2015. gada.', et: 'Turuosa ajas – alates 2015.' }],
    w: { lt: 'Rinkos dalies pokytis rodo, kur realiai juda dalyviai ir pinigai.', en: 'Changes in market share show where members and money actually move.', lv: 'Tirgus daļas izmaiņas parāda, kur patiesībā pārvietojas dalībnieki un nauda.', et: 'Turuosa muutus näitab, kuhu osalejad ja raha tegelikult liiguvad.' } },
  { id: 'market', s: 'p2', p: 'performance', h: 'tab=market',
    t: { lt: 'Visa rinka', en: 'Whole market', lv: 'Viss tirgus', et: 'Kogu turg' },
    b: [{ q: '#periods', lt: '13 laikotarpių – nuo vienos dienos iki visos istorijos.', en: '13 periods – from one day to the full history.', lv: '13 periodi – no vienas dienas līdz visai vēsturei.', et: '13 perioodi – ühest päevast kogu ajaloani.' },
      { q: '#tRelM', lt: 'Kiekvienas fondas lyginamas su kitų valdytojų tos pačios grupės fondais.', en: 'Each fund is compared with the other managers’ funds of the same group.', lv: 'Katrs fonds salīdzināts ar citu pārvaldītāju tās pašas grupas fondiem.', et: 'Iga fondi võrreldakse teiste fondivalitsejate sama grupi fondidega.' },
      { q: '#btnMxl', lt: 'Excel su formulėmis: kiekvieną skaičių galima patikrinti.', en: 'Excel with formulas: every number can be checked.', lv: 'Excel ar formulām: katru skaitli var pārbaudīt.', et: 'Valemitega Excel: iga numbrit saab kontrollida.' }],
    w: { lt: 'Pirmas klausimas – kaip sekėsi rinkai; tik tada – kaip sekėsi konkrečiam fondui.', en: 'First question: how did the market do; only then: how did a given fund do.', lv: 'Pirmais jautājums – kā veicās tirgum; tikai tad – kā veicās konkrētam fondam.', et: 'Esimene küsimus: kuidas läks turul; alles siis: kuidas läks konkreetsel fondil.' } },
  { id: 'sum', s: 'p2', p: 'performance', h: 'tab=sum',
    t: { lt: 'Lyderiai ir judesiai', en: 'Leaders & moves', lv: 'Līderi un izmaiņas', et: 'Liidrid ja liikumised' },
    b: [{ q: '#sumText', lt: 'Automatinė santrauka sakiniais: kas pirmauja ir kas atsilieka.', en: 'Automatic summary in sentences: who leads and who lags.', lv: 'Automātisks kopsavilkums teikumos: kas vadībā un kas atpaliek.', et: 'Automaatne kokkuvõte lausetena: kes juhib ja kes jääb maha.' },
      { q: '#tSum', lt: 'Kiekvienoje gimimo metų grupėje – lyderis, atsiliekantis ir skirtumas tarp jų.', en: 'In each birth-year group – the leader, the laggard and the gap between them.', lv: 'Katrā dzimšanas gadu grupā – līderis, atpalicējs un atšķirība starp tiem.', et: 'Igas sünniaastate grupis – liider, mahajääja ja nende vahe.' },
      { q: '#periods', lt: 'Laikotarpis pasirenkamas viršuje – santrauka persirašo iš karto.', en: 'The period is chosen at the top – the summary rewrites itself at once.', lv: 'Periodu izvēlas augšā – kopsavilkums pārrakstās uzreiz.', et: 'Periood valitakse üleval – kokkuvõte kirjutatakse kohe ümber.' }],
    w: { lt: 'Fondai lyginami tik su tos pačios gimimo metų grupės fondais – kitaip lygintume skirtingą riziką.', en: 'Funds are compared only within the same birth-year group; otherwise we would compare different risk.', lv: 'Fondus salīdzina tikai vienas dzimšanas gadu grupas ietvaros – citādi salīdzinātu atšķirīgu risku.', et: 'Fonde võrreldakse ainult sama sünniaastate grupi sees – muidu võrdleksime erinevat riski.' } },
  { id: 'fund', s: 'p2', p: 'performance', h: 'tab=fund',
    t: { lt: 'Fondų palyginimas', en: 'Fund comparison', lv: 'Fondu salīdzinājums', et: 'Fondide võrdlus' },
    b: [{ q: '#chart', lt: 'Bet kurie fondai vienoje diagramoje, nuo pasirinktos datos; galima ir reali grąža po infliacijos.', en: 'Any funds on one chart, from a chosen date; real return after inflation too.', lv: 'Jebkuri fondi vienā grafikā, no izvēlētā datuma; arī reālais ienesīgums pēc inflācijas.', et: 'Mis tahes fondid ühel graafikul, valitud kuupäevast; ka reaaltootlus pärast inflatsiooni.' },
      { q: '#tMetrics', lt: 'Rodikliai greta: grąža, svyravimai, didžiausias kritimas.', en: 'Key figures alongside: return, volatility, maximum drawdown.', lv: 'Rādītāji blakus: ienesīgums, svārstīgums, lielākais kritums.', et: 'Näitajad kõrval: tootlus, volatiilsus, suurim langus.' },
      { q: '#btnPng', lt: 'Grafiką galima įkelti į ataskaitą per kelias sekundes – PNG arba Excel.', en: 'A chart goes into a report in seconds – PNG or Excel.', lv: 'Grafiku var ievietot pārskatā dažās sekundēs – PNG vai Excel.', et: 'Graafiku saab aruandesse sekunditega – PNG või Excel.' }],
    w: { lt: 'Vienas vaizdas pakeičia kelias lenteles ir vienodai skaitomas visiems.', en: 'One view replaces several tables and reads the same for everyone.', lv: 'Viens skats aizstāj vairākas tabulas un visiem lasāms vienādi.', et: 'Üks vaade asendab mitu tabelit ja on kõigile ühtmoodi loetav.' } },
  { id: 'risk', s: 'p2', p: 'performance', h: 'tab=risk',
    t: { lt: 'Rizika', en: 'Risk', lv: 'Risks', et: 'Risk' },
    b: [{ q: '#rmTable', lt: 'Grąžos ir rizikos santykis (Sharpe) kiekvienai grupei ir valdytojui.', en: 'Return-to-risk ratio (Sharpe) for every group and manager.', lv: 'Ienesīguma un riska attiecība (Sharpe) katrai grupai un pārvaldītājam.', et: 'Tootluse ja riski suhe (Sharpe) iga grupi ja fondivalitseja kohta.' },
      { q: '#rddCard', lt: 'Kilimas ir kritimas: kiek nukrito ir kiek truko atsigavimas.', en: 'Run-up and drawdown: how far it fell and how long recovery took.', lv: 'Kāpums un kritums: cik kritās un cik ilgi ilga atgūšanās.', et: 'Tõus ja langus: kui palju langes ja kui kaua kestis taastumine.' },
      { q: '#rmNote', lt: 'Formulės aprašytos ir sutikrintos su Lietuvos banko skelbiamais skaičiais.', en: 'Formulas are documented and checked against Bank of Lithuania figures.', lv: 'Formulas aprakstītas un pārbaudītas pret Lietuvas Bankas skaitļiem.', et: 'Valemid on kirjeldatud ja kontrollitud Leedu Panga arvudega.' }],
    w: { lt: 'Ta pati grąža su mažesniais svyravimais – geresnis rezultatas dalyviui.', en: 'The same return with lower volatility is a better outcome for members.', lv: 'Tāds pats ienesīgums ar mazākām svārstībām – labāks rezultāts dalībniekam.', et: 'Sama tootlus väiksema kõikumisega on osalejale parem tulemus.' } },
  { id: 'ym', s: 'p2', p: 'performance', h: 'tab=ym',
    t: { lt: 'Metai ir mėnesiai', en: 'Years & months', lv: 'Gadi un mēneši', et: 'Aastad ja kuud' },
    b: [{ q: '#tCal', lt: 'Kalendorinių metų grąžos – spalvos rodo geriausius ir blogiausius.', en: 'Calendar-year returns – colours mark the best and the worst.', lv: 'Kalendāro gadu ienesīgums – krāsas iezīmē labākos un sliktākos.', et: 'Kalendriaastate tootlus – värvid märgivad parimaid ja halvimaid.' },
      { q: '#ymTabs', lt: 'Taip pat mėnesiai ir slenkanti grąža.', en: 'Also months and rolling returns.', lv: 'Arī mēneši un slīdošais ienesīgums.', et: 'Samuti kuud ja libisev tootlus.' },
      { q: '#group', lt: 'Grupė pasirenkama viršuje – lyginami tik tos grupės fondai.', en: 'The group is chosen at the top – only that group’s funds are compared.', lv: 'Grupu izvēlas augšā – salīdzina tikai šīs grupas fondus.', et: 'Grupp valitakse üleval – võrreldakse ainult selle grupi fonde.' }],
    w: { lt: 'Matyti, kuris valdytojas laimi kritimuose, o kuris – kilimuose.', en: 'Shows which manager wins in falling markets and which in rising ones.', lv: 'Redzams, kurš pārvaldītājs uzvar kritumos un kurš – kāpumos.', et: 'Näha on, kes võidab langevatel ja kes tõusvatel turgudel.' } },
  { id: 'p3', s: 'p3', p: 'performance3', h: 'tab=market',
    t: { lt: 'III pakopa', en: 'Pillar III', lv: '3. līmenis', et: 'III sammas' },
    b: [{ q: '#hMarket', lt: 'Tie patys skirtukai ir ta pati tvarka kaip II pakopoje.', en: 'The same tabs in the same order as pillar II.', lv: 'Tās pašas cilnes tādā pašā secībā kā 2. līmenī.', et: 'Samad vahelehed samas järjekorras nagu II sambas.' },
      { q: '#mkMode', lt: 'Visa rinka – valdytojų vaizdu: visi valdytojo fondai arba didžiausias.', en: 'Whole market by manager: all of a manager’s funds or the largest one.', lv: 'Viss tirgus pa pārvaldītājiem: visi pārvaldītāja fondi vai lielākais.', et: 'Kogu turg fondivalitsejate kaupa: kõik fondid või suurim.' },
      { q: '#tRank', lt: 'Fondai lyginami panašios rizikos kategorijose.', en: 'Funds are compared within similar-risk categories.', lv: 'Fondus salīdzina līdzīga riska kategorijās.', et: 'Fonde võrreldakse sarnase riskiga kategooriates.' }],
    w: { lt: 'III pakopoje fondą dalyvis renkasi pats, todėl skirtumai tarp fondų jam svarbesni.', en: 'In pillar III members choose the fund themselves, so differences between funds matter more.', lv: '3. līmenī dalībnieks fondu izvēlas pats, tāpēc atšķirības starp fondiem ir svarīgākas.', et: 'III sambas valib osaleja fondi ise, seega on fondidevahelised erinevused olulisemad.' } },
  { id: 'pf', s: 'pf', p: 'portfolios', h: 'tab=ov',
    t: { lt: 'Portfeliai', en: 'Portfolios', lv: 'Portfeļi', et: 'Portfellid' },
    b: [{ q: '#ovChg', lt: 'Kas pasikeitė per ketvirtį: akcijos, obligacijos, fondai, indėliai pagal valdytojus.', en: 'What changed in the quarter: equities, bonds, funds, deposits by manager.', lv: 'Kas mainījās ceturksnī: akcijas, obligācijas, fondi, noguldījumi pa pārvaldītājiem.', et: 'Mis muutus kvartalis: aktsiad, võlakirjad, fondid, hoiused fondivalitsejate kaupa.' },
      { q: '#ovOut', lt: 'Kuo išsiskiria: automatiškai randami fondai, kurių portfelis aiškiai skiriasi nuo grupės.', en: 'What stands out: funds whose portfolio clearly differs from the group are found automatically.', lv: 'Kas izceļas: automātiski atrod fondus, kuru portfelis būtiski atšķiras no grupas.', et: 'Mis eristub: fondid, mille portfell erineb selgelt grupist, leitakse automaatselt.' },
      { q: '#ovCmp', lt: 'Fondų palyginimas greta: akcijų regionai, obligacijos, mokesčiai.', en: 'Funds side by side: equity regions, bonds, fees.', lv: 'Fondi blakus: akciju reģioni, obligācijas, komisijas.', et: 'Fondid kõrvuti: aktsiate piirkonnad, võlakirjad, tasud.' }],
    w: { lt: 'Grąža – rezultatas, portfelis – jo priežastis.', en: 'Return is the result; the portfolio is its cause.', lv: 'Ienesīgums ir rezultāts, portfelis – tā cēlonis.', et: 'Tootlus on tulemus, portfell on selle põhjus.' } },
  { id: 'fc', s: 'pf', p: 'portfolios', h: 'tab=fc', ltOnly: 1,
    t: { lt: 'Fondo portfelis – pro fondus', en: 'Fund portfolio – look-through', lv: 'Fonda portfelis – caur fondiem', et: 'Fondi portfell – läbi fondide' },
    b: [{ q: '#fcBar', lt: 'Bet kuris fondas ir ketvirtis: visos pozicijos, filtrai pagal tipą ir regioną.', en: 'Any fund and quarter: every holding, filters by type and region.', lv: 'Jebkurš fonds un ceturksnis: visas pozīcijas, filtri pēc veida un reģiona.', et: 'Mis tahes fond ja kvartal: kõik positsioonid, filtrid tüübi ja piirkonna järgi.' },
      { q: '#fcLook', lt: '„Ką dengia portfelis“: žiūrima pro ETF ir fondus – indeksinių dalis, mokesčiai (TER), regionai, auksas, SFDR.', en: '“What the portfolio covers”: looking through ETFs and funds – index share, fees (TER), regions, gold, SFDR.', lv: '“Ko aptver portfelis”: skatoties caur ETF un fondiem – indeksu daļa, komisijas (TER), reģioni, zelts, SFDR.', et: '„Mida portfell katab“: vaadates läbi ETF-ide ja fondide – indeksfondide osa, tasud (TER), piirkonnad, kuld, SFDR.' },
      { q: '#fcLook table', lt: 'Didžiausios įmonės per visus fondus kartu – tikroji koncentracija (Morningstar duomenys).', en: 'The largest companies across all funds combined – the real concentration (Morningstar data).', lv: 'Lielākie uzņēmumi visos fondos kopā – patiesā koncentrācija (Morningstar dati).', et: 'Suurimad ettevõtted kõigi fondide peale kokku – tegelik kontsentratsioon (Morningstari andmed).' },
      { q: '#fcSide', lt: 'Paspaudus poziciją – fondo profilis, jo istorija portfelyje ir kas dar jį laiko.', en: 'Click a holding – the fund’s profile, its history in the portfolio and who else holds it.', lv: 'Noklikšķinot uz pozīcijas – fonda profils, tā vēsture portfelī un kas vēl to tur.', et: 'Positsioonil klõpsates – fondi profiil, ajalugu portfellis ja kes seda veel hoiab.' }],
    w: { lt: 'Pro fondus matosi tikroji rizika: kiek iš tikrųjų JAV technologijų, kiek besivystančių rinkų. Tokios analizės viešai nėra niekur kitur.', en: 'Looking through funds shows the real risk: how much is really US tech, how much emerging markets. No other public source shows this.', lv: 'Caur fondiem redzams patiesais risks: cik patiesībā ir ASV tehnoloģiju, cik attīstības tirgu. Publiski šādas analīzes nekur citur nav.', et: 'Läbi fondide on näha tegelik risk: kui palju on tegelikult USA tehnoloogiat, kui palju arenevaid turge. Avalikult mujal sellist analüüsi pole.' } },
  { id: 'alt', s: 'pf', p: 'portfolios', h: 'tab=alt', ltOnly: 1,
    t: { lt: 'Alternatyvios ir likvidumas', en: 'Alternatives and liquidity', lv: 'Alternatīvie ieguldījumi un likviditāte', et: 'Alternatiivid ja likviidsus' },
    b: [{ q: '#altChart', lt: 'Nelikvidžių alternatyvių investicijų dalis kiekvieno valdytojo portfelyje, ketvirčiais.', en: 'The share of illiquid alternative investments in each manager’s portfolio, by quarter.', lv: 'Nelikvīdo alternatīvo ieguldījumu daļa katra pārvaldītāja portfelī, pa ceturkšņiem.', et: 'Mittelikviidsete alternatiivinvesteeringute osa iga fondivalitseja portfellis, kvartalite kaupa.' },
      { q: '#altTable', lt: 'Kiekvieno fondo dalis ir jos pokytis per pasirinktą laikotarpį.', en: 'Each fund’s share and its change over the chosen period.', lv: 'Katra fonda daļa un tās izmaiņas izvēlētajā periodā.', et: 'Iga fondi osa ja selle muutus valitud perioodil.' },
      { q: '#liqBox', lt: 'Likvidumo analizė: kiek dalyvių gali išeiti, kol alternatyvos viršys 30 % ribą; Excel – įrodymų failas su formulėmis.', en: 'Liquidity analysis: how many members can leave before alternatives exceed the 30% limit; Excel is an evidence file with formulas.', lv: 'Likviditātes analīze: cik dalībnieku var aiziet, līdz alternatīvie pārsniegs 30 % robežu; Excel – pierādījumu fails ar formulām.', et: 'Likviidsusanalüüs: kui palju osalejaid võib lahkuda, enne kui alternatiivid ületavad 30% piiri; Excel on valemitega tõendifail.' }],
    w: { lt: 'Nelikvidų turtą sunku greitai parduoti, kai dalyviai keičia fondą ar atsiima pinigus.', en: 'Illiquid assets are hard to sell quickly when members switch funds or withdraw.', lv: 'Nelikvīdus aktīvus grūti ātri pārdot, kad dalībnieki maina fondu vai izņem naudu.', et: 'Mittelikviidset vara on raske kiiresti müüa, kui osalejad vahetavad fondi või võtavad raha välja.' } },
  { id: 'aum', s: 'aum', p: 'aum', h: 'tab=ch',
    t: { lt: 'Turtas ir pinigų srautai', en: 'Assets and flows', lv: 'Aktīvi un naudas plūsmas', et: 'Varad ja rahavood' },
    b: [{ q: '#chart', lt: 'Grynieji aktyvai kasdien – valdytojai, grupės ar fondai.', en: 'Net assets daily – managers, groups or funds.', lv: 'Neto aktīvi katru dienu – pārvaldītāji, grupas vai fondi.', et: 'Puhasvara iga päev – fondivalitsejad, grupid või fondid.' },
      { q: '#chBar', lt: 'Kiti skirtukai: kas keitė turtą (grąža ar srautai), ketvirčių pabaigos, reformos išmokos.', en: 'Other tabs: what changed assets (return or flows), quarter ends, reform payouts.', lv: 'Citas cilnes: kas mainīja aktīvus (ienesīgums vai plūsmas), ceturkšņu beigas, reformas izmaksas.', et: 'Teised vahelehed: mis muutis varasid (tootlus või rahavood), kvartalilõpud, reformi väljamaksed.' },
      { q: '#chNote', lt: 'Ketvirčių pabaigos sutikrinamos su Lietuvos banko sumomis.', en: 'Quarter ends are checked against Bank of Lithuania totals.', lv: 'Ceturkšņu beigas pārbaudītas pret Lietuvas Bankas summām.', et: 'Kvartalilõpud on kontrollitud Leedu Panga summadega.' }],
    w: { lt: 'Turtas auga dėl dviejų priežasčių – įmokų ir grąžos; jas būtina atskirti.', en: 'Assets grow for two reasons – contributions and return; they must be separated.', lv: 'Aktīvi aug divu iemeslu dēļ – iemaksas un ienesīgums; tie jānodala.', et: 'Varad kasvavad kahel põhjusel – sissemaksed ja tootlus; need tuleb eristada.' } },
  { id: 'rep', s: 'rep', p: 'reports', h: 'tab=kid',
    t: { lt: 'Ataskaitos ir KID scenarijai', en: 'Reports and KID scenarios', lv: 'Pārskati un KID scenāriji', et: 'Aruanded ja KID stsenaariumid' },
    b: [{ q: '#kidLead', lt: 'Kiek galėtų tapti investuojami pinigai pagal KID scenarijus (SEB fondai).', en: 'What invested money could become under KID scenarios (SEB funds).', lv: 'Par ko varētu kļūt ieguldītā nauda pēc KID scenārijiem (SEB fondi).', et: 'Milleks võiks investeeritud raha saada KID stsenaariumide järgi (SEB fondid).' },
      { q: '#kidY', lt: 'Du būdai: „kaip valdytojo ataskaitoje“ ir „teisingai pagal reglamentą“.', en: 'Two ways: “as in the manager’s report” and “correct per regulation”.', lv: 'Divi veidi: “kā pārvaldītāja pārskatā” un “pareizi pēc regulas”.', et: 'Kaks viisi: „nagu fondivalitseja aruandes“ ja „õigesti määruse järgi“.' },
      { q: '#kidBox table', lt: 'Skirtumai paaiškinti svetainėje ir Excel faile; kiti skirtukai – grąža nuo 2019 m., rodikliai, pusmečio lentelės.', en: 'Differences explained on the site and in Excel; other tabs – returns since 2019, KPIs, half-year tables.', lv: 'Atšķirības izskaidrotas vietnē un Excel; citas cilnes – ienesīgums kopš 2019., rādītāji, pusgada tabulas.', et: 'Erinevused selgitatud lehel ja Excelis; teised vahelehed – tootlus alates 2019, näitajad, poolaasta tabelid.' }],
    w: { lt: 'Valdytojų ataskaitas galima atkartoti ir patikrinti, o ne priimti tikėjimu.', en: 'Managers’ reports can be reproduced and checked, not taken on faith.', lv: 'Pārvaldītāju pārskatus var atkārtot un pārbaudīt, nevis pieņemt uz ticību.', et: 'Fondivalitsejate aruandeid saab korrata ja kontrollida, mitte usu peale võtta.' } },
  { id: 'jr', s: 'jr', p: 'journey', h: 'tab=my',
    t: { lt: 'Kelias į pensiją', en: 'Road to retirement', lv: 'Ceļš uz pensiju', et: 'Tee pensionini' },
    b: [{ q: '#inBar', lt: 'Asmeninis skaičiavimas: gimimo metai, atlyginimas, fondas.', en: 'Personal calculation: birth year, salary, fund.', lv: 'Personīgs aprēķins: dzimšanas gads, alga, fonds.', et: 'Isiklik arvutus: sünniaasta, palk, fond.' },
      { q: '#chart', lt: 'Kaip augo turtas: investicijų grąža, dalyvio ir valstybės įmokos atskirai.', en: 'How assets grew: investment return, member and state contributions separately.', lv: 'Kā auga aktīvi: ieguldījumu ienesīgums, dalībnieka un valsts iemaksas atsevišķi.', et: 'Kuidas varad kasvasid: investeerimistulu, osaleja ja riigi sissemaksed eraldi.' },
      { q: '#annTable', lt: 'Sodros anuitetas: kiek per mėnesį būtų gaunama; kiti skirtukai – ateities scenarijai ir mokesčių poveikis.', en: 'Sodra annuity: monthly payout; other tabs – future scenarios and fee impact.', lv: 'Sodra anuitāte: ikmēneša izmaksa; citas cilnes – nākotnes scenāriji un komisiju ietekme.', et: 'Sodra annuiteet: igakuine väljamakse; teised vahelehed – tulevikustsenaariumid ja tasude mõju.' }],
    w: { lt: 'Nedidelis grąžos ar mokesčio skirtumas per 30 metų virsta tūkstančiais eurų.', en: 'A small difference in return or fees becomes thousands of euros over 30 years.', lv: 'Neliela ienesīguma vai komisijas atšķirība 30 gados kļūst par tūkstošiem eiro.', et: 'Väike tootluse või tasu erinevus muutub 30 aastaga tuhandeteks eurodeks.' } },
  { id: 'bx', s: 'bx', u: 'index_lv.html#tab=td',
    t: { lt: 'Latvija ir Estija – tas pats dashboard', en: 'Latvia and Estonia – the same dashboard', lv: 'Latvija un Igaunija – tas pats panelis', et: 'Läti ja Eesti – sama ülevaade' },
    b: [{ q: null, lt: 'Viršuje LT | LV | EE jungiklis: tas pats puslapis kitos šalies duomenimis; keturios kalbos.', en: 'LT | LV | EE switch at the top: the same page with another country’s data; four languages.', lv: 'Augšā LT | LV | EE pārslēgs: tā pati lapa ar citas valsts datiem; četras valodas.', et: 'Üleval LT | LV | EE lüliti: sama leht teise riigi andmetega; neli keelt.' },
      { q: '#ldG', lt: 'Latvijos fondai grupuojami pagal akcijų dalį, Estijos – pagal rizikos grupę.', en: 'Latvian funds are grouped by equity share, Estonian ones by risk group.', lv: 'Latvijas fondi grupēti pēc akciju daļas, Igaunijas – pēc riska grupas.', et: 'Läti fondid on rühmitatud aktsiate osa, Eesti fondid riskigrupi järgi.' },
      { q: '#tdMkK', lt: 'Duomenys – iš nacionalinių šaltinių (manapensija.lv, pensionikeskus.ee); kur jų nėra, skirtukas pilkas ir paaiškina kodėl.', en: 'Data come from national sources (manapensija.lv, pensionikeskus.ee); where missing, the tab is grey and explains why.', lv: 'Dati – no nacionālajiem avotiem (manapensija.lv, pensionikeskus.ee); kur to nav, cilne ir pelēka un paskaidro kāpēc.', et: 'Andmed on riiklikest allikatest (manapensija.lv, pensionikeskus.ee); kui neid pole, on vaheleht hall ja selgitab põhjust.' }],
    w: { lt: 'Vienoda navigacija leidžia tą patį klausimą užduoti visoms trims šalims vienodai.', en: 'Identical navigation lets the same question be asked of all three countries.', lv: 'Vienāda navigācija ļauj vienu jautājumu uzdot visām trim valstīm vienādi.', et: 'Ühtne navigeerimine võimaldab sama küsimust esitada kõigile kolmele riigile.' } },
  { id: 'rk', s: 'bx', u: 'baltic.html#c=X&tab=rk',
    t: { lt: 'Šalių palyginimas', en: 'Country comparison', lv: 'Valstu salīdzinājums', et: 'Riikide võrdlus' },
    b: [{ q: '#kp', lt: 'Trys šalys greta: fondai, turtas, dalyviai.', en: 'Three countries side by side: funds, assets, members.', lv: 'Trīs valstis blakus: fondi, aktīvi, dalībnieki.', et: 'Kolm riiki kõrvuti: fondid, varad, osalejad.' },
      { q: '#rkTbl', lt: 'Tarp šalių lyginami tik panašios rizikos fondai.', en: 'Across countries only similar-risk funds are compared.', lv: 'Starp valstīm salīdzina tikai līdzīga riska fondus.', et: 'Riikide vahel võrreldakse ainult sarnase riskiga fonde.' },
      { q: '#rkN', lt: 'Rizikos grupės – pagal 3 metų vieneto vertės svyravimą, visiems fondams vienodai; kiti skirtukai – metų grąžos, reformos EE 2021 ir LT 2026.', en: 'Risk groups by 3-year unit value volatility, the same for every fund; other tabs – yearly returns, reforms EE 2021 and LT 2026.', lv: 'Riska grupas pēc 3 gadu daļas vērtības svārstīguma, visiem fondiem vienādi; citas cilnes – gada ienesīgums, reformas EE 2021 un LT 2026.', et: 'Riskigrupid 3 aasta osakuväärtuse volatiilsuse järgi, kõigile fondidele ühtmoodi; teised vahelehed – aastatootlus, reformid EE 2021 ja LT 2026.' }],
    w: { lt: 'Palyginimas teisingas tik tada, kai lyginama panaši rizika.', en: 'A comparison is fair only when similar risk is compared.', lv: 'Salīdzinājums ir godīgs tikai tad, ja salīdzina līdzīgu risku.', et: 'Võrdlus on aus ainult siis, kui võrreldakse sarnast riski.' } },
  { id: 'how', s: 'how', p: 'how', h: '',
    t: { lt: 'Kaip tai veikia', en: 'How it works', lv: 'Kā tas darbojas', et: 'Kuidas see töötab' },
    b: [{ q: '#flow', lt: 'Duomenų kelias: šaltinis → rinkiklis → failas → puslapis; paspaudus kortelę matyti jos ryšiai.', en: 'Data path: source → collector → file → page; click a card to see its links.', lv: 'Datu ceļš: avots → savācējs → fails → lapa; noklikšķinot uz kartītes, redzamas tās saites.', et: 'Andmete tee: allikas → koguja → fail → leht; kaardil klõpsates on näha selle seosed.' },
      { q: '#tl', lt: 'Kasdien automatiškai: rinkimas, svetainės sugeneravimas, patikra, vakarinis laiškas.', en: 'Automatic every day: collection, site build, checks, evening e-mail.', lv: 'Automātiski katru dienu: vākšana, vietnes izveide, pārbaude, vakara e-pasts.', et: 'Iga päev automaatselt: kogumine, lehe koostamine, kontroll, õhtune e-kiri.' },
      { q: '#ai', lt: 'Kasdienis darbas – kodas be AI; Claude – tik kūrimas ir ketvirtiniai darbai.', en: 'Daily work is code without AI; Claude only for development and quarterly tasks.', lv: 'Ikdienas darbs – kods bez MI; Claude – tikai izstrādei un ceturkšņa darbiem.', et: 'Igapäevatöö on kood ilma tehisintellektita; Claude ainult arenduseks ja kvartalitöödeks.' }],
    w: { lt: 'Pasitikėjimas skaičiais = matomas kelias nuo šaltinio iki ekrano.', en: 'Trust in numbers = a visible path from source to screen.', lv: 'Uzticēšanās skaitļiem = redzams ceļš no avota līdz ekrānam.', et: 'Usaldus numbrite vastu = nähtav tee allikast ekraanini.' } },
  { id: 'end', s: 'end', text: 'end',
    t: { lt: 'Ką verta prisiminti', en: 'Key points', lv: 'Galvenais', et: 'Peamine' } },
];

const PS_TX = {
  brand: { lt: 'Pristatymas', en: 'Presentation', lv: 'Prezentācija', et: 'Esitlus' },
  laser: { lt: 'Lazeris', en: 'Laser', lv: 'Lāzers', et: 'Laser' },
  pen: { lt: 'Piešti', en: 'Draw', lv: 'Zīmēt', et: 'Joonista' },
  spot: { lt: 'Prožektorius', en: 'Spotlight', lv: 'Prožektors', et: 'Prožektor' },
  notes: { lt: 'Komentarai', en: 'Notes', lv: 'Komentāri', et: 'Märkmed' },
  grid: { lt: 'Skaidrės', en: 'Slides', lv: 'Slaidi', et: 'Slaidid' },
  full: { lt: 'Visas ekranas', en: 'Full screen', lv: 'Pilnekrāns', et: 'Täisekraan' },
  exit: { lt: 'Išeiti', en: 'Exit', lv: 'Iziet', et: 'Välju' },
  why: { lt: 'Kodėl tai svarbu', en: 'Why it matters', lv: 'Kāpēc tas ir svarīgi', et: 'Miks see on oluline' },
  open: { lt: 'Atidaryti šį puslapį atskirai', en: 'Open this page separately', lv: 'Atvērt šo lapu atsevišķi', et: 'Ava see leht eraldi' },
  loading: { lt: 'Kraunamas tikras puslapis…', en: 'Loading the live page…', lv: 'Ielādē īsto lapu…', et: 'Laadin päris lehte…' },
  live: { lt: 'Tikri šios dienos duomenys, ne ekrano nuotraukos', en: 'Live data of today, not screenshots', lv: 'Īsti šodienas dati, nevis ekrānuzņēmumi', et: 'Tänased päris andmed, mitte ekraanipildid' },
  sub: { lt: 'Lietuva, Latvija, Estija · II ir III pakopa · 4 kalbos', en: 'Lithuania, Latvia, Estonia · Pillars II and III · 4 languages', lv: 'Lietuva, Latvija, Igaunija · 2. un 3. līmenis · 4 valodas', et: 'Leedu, Läti, Eesti · II ja III sammas · 4 keelt' },
  ctryNote: { lt: c => `Rodoma: ${c}. Komentarai bendri visoms šalims.`, en: c => `Showing: ${c}. Notes are common to all countries.`, lv: c => `Rāda: ${c}. Komentāri kopīgi visām valstīm.`, et: c => `Kuvatakse: ${c}. Märkmed on kõigile riikidele ühised.` },
  fixed: { lt: 'Ši skaidrė visada rodo tą patį vaizdą.', en: 'This slide always shows the same view.', lv: 'Šis slaids vienmēr rāda vienu skatu.', et: 'See slaid näitab alati sama vaadet.' },
  toolOn: { lt: 'Įrankis įjungtas: puslapio mygtukai nespaudžiami (Esc – išjungti, ratukas – slinkti)', en: 'Tool on: page buttons are locked (Esc to turn off, wheel to scroll)', lv: 'Rīks ieslēgts: lapas pogas bloķētas (Esc – izslēgt, ritenītis – ritināt)', et: 'Tööriist sees: lehe nupud lukus (Esc – välja, ratas – keri)' },
  toolOff: { lt: 'Įrankis išjungtas: puslapis vėl valdomas', en: 'Tool off: the page is interactive again', lv: 'Rīks izslēgts: lapa atkal vadāma', et: 'Tööriist väljas: leht on taas kasutatav' },
  helpT: { lt: 'Klavišai', en: 'Keys', lv: 'Taustiņi', et: 'Klahvid' },
  keys: { lt: [['→  tarpas  PageDown', 'kitas komentaras, po paskutinio – kita skaidrė (tinka pristatymų pultelis)'], ['←  PageUp', 'atgal'], ['A', 'rodyti visus skaidrės komentarus'], ['H', 'slėpti / rodyti komentarus ant vaizdo'], ['Home / End', 'pirma / paskutinė'], ['F', 'visas ekranas'], ['L', 'lazerinė rodyklė'], ['D', 'piešti ant ekrano (C – išvalyti)'], ['S', 'prožektorius'], ['Esc', 'išjungti įrankį'], ['N', 'šoninis komentarų skydelis'], ['G', 'visų skaidrių tinklelis'], ['B', 'juodas ekranas'], ['+  −  0', 'mastelis'], ['?', 'ši pagalba'], ['Q', 'išeiti – į skaidrėje rodomą puslapį']],
    en: [['→  Space  PageDown', 'next note, after the last one – next slide (clickers work)'], ['←  PageUp', 'back'], ['A', 'show all notes of the slide'], ['H', 'hide / show notes on the view'], ['Home / End', 'first / last'], ['F', 'full screen'], ['L', 'laser pointer'], ['D', 'draw on screen (C – clear)'], ['S', 'spotlight'], ['Esc', 'turn the tool off'], ['N', 'side notes panel'], ['G', 'all slides'], ['B', 'black screen'], ['+  −  0', 'zoom'], ['?', 'this help'], ['Q', 'exit – to the page shown on the slide']],
    lv: [['→  atstarpe  PageDown', 'nākamais komentārs, pēc pēdējā – nākamais slaids (der pults)'], ['←  PageUp', 'atpakaļ'], ['A', 'rādīt visus slaida komentārus'], ['H', 'slēpt / rādīt komentārus uz skata'], ['Home / End', 'pirmais / pēdējais'], ['F', 'pilnekrāns'], ['L', 'lāzera rādītājs'], ['D', 'zīmēt uz ekrāna (C – notīrīt)'], ['S', 'prožektors'], ['Esc', 'izslēgt rīku'], ['N', 'sānu komentāru panelis'], ['G', 'visi slaidi'], ['B', 'melns ekrāns'], ['+  −  0', 'mērogs'], ['?', 'šī palīdzība'], ['Q', 'iziet – uz slaidā rādīto lapu']],
    et: [['→  tühik  PageDown', 'järgmine märkus, pärast viimast – järgmine slaid (pult töötab)'], ['←  PageUp', 'tagasi'], ['A', 'näita kõiki slaidi märkusi'], ['H', 'peida / näita märkusi vaatel'], ['Home / End', 'esimene / viimane'], ['F', 'täisekraan'], ['L', 'laserkursor'], ['D', 'joonista ekraanile (C – puhasta)'], ['S', 'prožektor'], ['Esc', 'lülita tööriist välja'], ['N', 'külgmine märkmete paneel'], ['G', 'kõik slaidid'], ['B', 'must ekraan'], ['+  −  0', 'suurendus'], ['?', 'see abi'], ['Q', 'välju – slaidil näidatud lehele']] },
  endPts: { lt: ['Duomenys renkami kasdien automatiškai, be rankinio darbo.', 'Kiekvienas skaičius – su šaltiniu ir Excel formule.', 'Fondai lyginami tik su panašios rizikos fondais.', 'Trys šalys, II ir III pakopa, keturios kalbos – vienoje vietoje.'],
    en: ['Data are collected automatically every day, without manual work.', 'Every number comes with a source and an Excel formula.', 'Funds are compared only with similar-risk funds.', 'Three countries, pillars II and III, four languages – in one place.'],
    lv: ['Dati tiek vākti automātiski katru dienu, bez roku darba.', 'Katram skaitlim – avots un Excel formula.', 'Fondus salīdzina tikai ar līdzīga riska fondiem.', 'Trīs valstis, 2. un 3. līmenis, četras valodas – vienuviet.'],
    et: ['Andmeid kogutakse iga päev automaatselt, ilma käsitööta.', 'Igal numbril on allikas ja Exceli valem.', 'Fonde võrreldakse ainult sarnase riskiga fondidega.', 'Kolm riiki, II ja III sammas, neli keelt – ühes kohas.'] },
};
const PL = o => (o && (o[ulang] || o.en)) || '';
const PS = { i: 0, c: 'LT', tool: null, zoom: 1, frames: new Map() };
const $ = id => document.getElementById(id);
const escP = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function slideUrl(sl, c) {             // tikro puslapio adresas skaidrei (null – šalis duomenų neskelbia)
  if (sl.text) return '';
  if (sl.ltOnly && c !== 'LT') return null;   // tik Lietuvos duomenys (pvz. pilni portfeliai)
  let u = sl.u || ctryHref(sl.p, c);
  if (!u) return null;
  if (!sl.u && !u.includes('#') && sl.h) u += '#' + sl.h;
  const [path, hash] = u.split('#');
  return path + (path.includes('?') ? '&' : '?') + 'embed=1' + (hash ? '#' + hash : '');
}

/* ---------- rėmeliai: talpykla (iki 4), kita skaidrė įkeliama iš anksto ---------- */
function frameFor(url) {
  let f = PS.frames.get(url);
  if (f) { PS.frames.delete(url); PS.frames.set(url, f); return f; }   // naujausias – sąrašo gale
  f = document.createElement('iframe'); f.title = 'slide'; f.loading = 'eager'; f.dataset.ready = '';
  f.addEventListener('load', () => { f.dataset.ready = '1'; hookFrame(f); if (f.classList.contains('on')) { $('psLoad').textContent = ''; setTimeout(annFocus, 900); } });
  f.src = url; $('psStage').prepend(f); PS.frames.set(url, f); layout();
  while (PS.frames.size > 4) { const [k, old] = PS.frames.entries().next().value; if (old.classList.contains('on')) break; old.remove(); PS.frames.delete(k); }
  return f;
}
function hookFrame(f) {                 // klavišai veikia ir tada, kai pelė ar fokusas – puslapyje
  try { f.contentWindow.addEventListener('keydown', e => onKey(e, true)); f.contentWindow.addEventListener('scroll', () => { if (f.classList.contains('on')) annSoon(); }, { passive: true }); } catch (e) {}
}
function layout() {                     // puslapis piešiamas ≥ 1280 px pločio ir sumažinamas, kad tilptų (+/− – mastelis)
  const st = $('psStage'), W = st.clientWidth, H = st.clientHeight;
  const s = Math.min(1, W / 1280) * PS.zoom;
  PS.frames.forEach(f => { f.style.width = (W / s) + 'px'; f.style.height = (H / s) + 'px'; f.style.transform = `scale(${s})`; });
  const cv = $('psInk'), r = devicePixelRatio || 1;
  annSoon();
  if (cv.width !== Math.round(W * r) || cv.height !== Math.round(H * r)) { cv.width = Math.round(W * r); cv.height = Math.round(H * r); INK.strokes = INK.strokes; drawInk(); }
}

/* ---------- skaidrės rodymas ---------- */
function show(i, push = true, atEnd = false) {
  PS.i = Math.max(0, Math.min(SLIDES.length - 1, i));
  const sl = SLIDES[PS.i], url = slideUrl(sl, PS.c);
  ANN.step = atEnd ? nSteps(sl) : 0;
  INK.strokes = []; drawInk();
  PS.frames.forEach(f => f.classList.remove('on'));
  const tx = $('psText'); tx.classList.remove('on'); $('psLoad').textContent = '';
  if (sl.text || url === null) { tx.innerHTML = sl.text === 'intro' ? introHTML() : sl.text === 'end' ? endHTML() : naHTML(sl); tx.classList.add('on'); }
  else { const f = frameFor(url); f.classList.add('on'); if (!f.dataset.ready) $('psLoad').textContent = PL(PS_TX.loading); else if (!atEnd) { try { f.contentWindow.scrollTo(0, 0); } catch (e) {} } }
  notes(sl, url); annFocus(); stepCnt();
  $('psTtl').textContent = `${PL(PS_SEC[sl.s])} · ${PL(sl.t)}`;
  document.title = `${PL(PS_TX.brand)} · ${PL(sl.t)}`;
  $('psBar').querySelectorAll('button').forEach((b, k) => { b.classList.toggle('cur', k === PS.i); b.classList.toggle('done', k < PS.i); });
  if (push) { try { history.replaceState(null, '', `#s=${sl.id}${PS.c !== 'LT' ? '&c=' + PS.c : ''}`); } catch (e) {} }
  const nx = SLIDES[PS.i + 1], nu = nx && slideUrl(nx, PS.c);   // kita skaidrė – iš anksto, kad perjungimas būtų greitas
  if (nu) setTimeout(() => { if (SLIDES[PS.i + 1] === nx) frameFor(nu); }, 1200);
}
function notes(sl, url) {
  const n = $('psNotes');
  if (sl.text) { n.innerHTML = `<div class="eb">${escP(PL(PS_SEC[sl.s]))}</div><h2>${escP(PL(sl.t))}</h2><p class="cnote">${escP(PL(PS_TX.live))}</p>`; return; }
  const cn = (T().ctry && T().ctry.names && T().ctry.names[PS.c]) || PS.c;
  n.innerHTML = `<div class="eb">${escP(PL(PS_SEC[sl.s]))}</div><h2>${escP(PL(sl.t))}</h2>`
    + `<ul>${(sl.b || []).map((x, k) => `<li data-k="${k}">${escP(PL(x))}</li>`).join('')}</ul>`
    + `<div class="why"><b>${escP(PL(PS_TX.why))}</b>${escP(PL(sl.w))}</div>`
    + (sl.u ? `<p class="cnote">${escP(PL(PS_TX.fixed))}</p>` : PS.c !== 'LT' ? `<p class="cnote">${escP(PL(PS_TX.ctryNote)(cn))}</p>` : '')
    + (url ? `<p class="open"><a href="${escP(url.replace(/([?&])embed=1&?/, '$1').replace(/\?(#|$)/, '$1'))}" target="_blank" rel="noopener">${escP(PL(PS_TX.open))} ↗</a></p>` : '');
}
function introHTML() {
  const seen = new Set(), items = [];
  SLIDES.forEach((s, k) => { if (s.text || seen.has(s.s)) return; seen.add(s.s); const ts = SLIDES.filter(x => x.s === s.s).map(x => PL(x.t)).filter(x => x !== PL(PS_SEC[s.s]));
    items.push(`<button type="button" data-go="${k}"><b>${escP(PL(PS_SEC[s.s]))}</b><span>${ts.map(escP).join(' · ')}</span></button>`); });
  return `<h1>${escP(PL(SLIDES[0].t))}</h1><p class="sub">${escP(PL(PS_TX.sub))} · ${new Date().toISOString().slice(0, 10)}</p>`
    + `<p><span class="ps-pill">${escP(PL(PS_TX.live))}</span><span class="ps-pill">→ · F · L · D · S · ?</span></p><div class="ps-agenda">${items.join('')}</div>`;
}
function endHTML() {
  return `<h1>${escP(PL(SLIDES[SLIDES.length - 1].t))}</h1><ul style="font-size:20px;line-height:1.6;max-width:900px">${PL(PS_TX.endPts).map(x => `<li>${escP(x)}</li>`).join('')}</ul>`;
}
function naHTML(sl) {
  return `<div class="ps-na"><h3 style="margin-top:0">${escP(PL(sl.t))}</h3><p>${escP(ctryWhy(sl.p, PS.c))}</p></div>`;
}

/* ---------- įrankiai: lazeris (blėstantis pėdsakas), piešimas, prožektorius ---------- */
const INK = { strokes: [], trail: [], cur: null, x: -99, y: -99, raf: 0 };
function setTool(t) {
  const was = PS.tool; PS.tool = PS.tool === t ? null : t;
  const st = $('psStage'); st.classList.remove('tool', 't-laser', 't-pen', 't-spot');
  if (PS.tool) st.classList.add('tool', 't-' + PS.tool);
  document.querySelectorAll('.ps-tool[data-t]').forEach(b => b.setAttribute('aria-pressed', b.dataset.t === PS.tool));
  if (!!was !== !!PS.tool) toast(PL(PS.tool ? PS_TX.toolOn : PS_TX.toolOff));
  INK.trail = []; spot(); drawInk();
}
function pos(e) { const r = $('psInk').getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function spot() {
  const s = $('psSpot'), R = Math.max(110, Math.min(220, $('psStage').clientWidth / 9));
  s.style.background = `radial-gradient(circle ${R + 24}px at ${INK.x}px ${INK.y}px, transparent ${R}px, rgba(0,0,0,.62) ${R + 24}px)`;
}
function drawInk() {
  const cv = $('psInk'), g = cv.getContext('2d'), r = devicePixelRatio || 1, now = performance.now();
  g.setTransform(r, 0, 0, r, 0, 0); g.clearRect(0, 0, cv.width, cv.height);
  g.lineCap = g.lineJoin = 'round';
  for (const s of INK.strokes) { if (s.length < 2) continue; g.strokeStyle = 'rgba(230,40,40,.9)'; g.lineWidth = 4; g.beginPath(); g.moveTo(s[0][0], s[0][1]); for (const p of s) g.lineTo(p[0], p[1]); g.stroke(); }
  if (PS.tool === 'laser') {
    INK.trail = INK.trail.filter(p => now - p[2] < 450);
    for (let k = 1; k < INK.trail.length; k++) { const a = INK.trail[k - 1], b = INK.trail[k], al = 1 - (now - b[2]) / 450;
      g.strokeStyle = `rgba(255,40,40,${(al * .55).toFixed(3)})`; g.lineWidth = 3 + 6 * al; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
    if (INK.x > -50) { const gr = g.createRadialGradient(INK.x, INK.y, 0, INK.x, INK.y, 16); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.25, 'rgba(255,40,40,1)'); gr.addColorStop(1, 'rgba(255,40,40,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(INK.x, INK.y, 16, 0, 7); g.fill(); }
    if (INK.trail.length && !INK.raf) INK.raf = requestAnimationFrame(() => { INK.raf = 0; drawInk(); });
  }
}
function inkEvents() {
  const cv = $('psInk');
  cv.addEventListener('pointermove', e => { [INK.x, INK.y] = pos(e);
    if (PS.tool === 'laser') { INK.trail.push([INK.x, INK.y, performance.now()]); drawInk(); }
    if (PS.tool === 'spot') spot();
    if (PS.tool === 'pen' && INK.cur) { INK.cur.push([INK.x, INK.y]); drawInk(); } });
  cv.addEventListener('pointerdown', e => { if (PS.tool !== 'pen') return; cv.setPointerCapture(e.pointerId); INK.cur = [pos(e)]; INK.strokes.push(INK.cur); });
  cv.addEventListener('pointerup', () => { INK.cur = null; });
  cv.addEventListener('pointerleave', () => { INK.x = INK.y = -99; drawInk(); if (PS.tool === 'spot') spot(); });
  cv.addEventListener('wheel', e => {   // įrankis įjungtas – ratukas vis tiek slenka puslapį
    const f = [...PS.frames.values()].find(x => x.classList.contains('on')), s = Math.min(1, $('psStage').clientWidth / 1280) * PS.zoom;
    if (f) { try { f.contentWindow.scrollBy(0, e.deltaY / s); } catch (er) {} } else $('psText').scrollBy(0, e.deltaY);
    e.preventDefault(); }, { passive: false });
}


/* ---------- komentarai ant vaizdo (savininkas 2026-11-11: „komentarus su rodyklytėmis tiesiog ant vaizdo“) ----------
   Kiekvienas komentaras rodo į tikrą puslapio elementą (b[].q). → atidengia po vieną: puslapis paslenkamas, kad elementas matytųsi,
   aplink jį – rėmelis, rodyklė – iš komentaro debesėlio. Senesni komentarai lieka blankesni; paskutinis žingsnis – „kodėl tai svarbu“.
   Neradus elemento (pakeistas puslapis ar kita šalis) – komentaras rodomas be rodyklės dešiniajame kampe. */
const ANN = { step: 0, hide: false, raf: 0, shown: '' };
const nSteps = sl => (sl.text || !sl.b || slideUrl(sl, PS.c) === null) ? 0 : sl.b.length + (sl.w ? 1 : 0);
const curFrame = () => [...PS.frames.values()].find(f => f.classList.contains('on'));
const pScale = () => Math.min(1, $('psStage').clientWidth / 1280) * PS.zoom;
function annTarget(q) {
  const f = curFrame(); if (!f || !q || !f.dataset.ready) return null;
  try { for (const x of q.split('||')) { const el = f.contentDocument.querySelector(x); if (el && el.getClientRects().length) return el; } return null; } catch (e) { return null; }   // „a||b“ – pirmas matomas (Pradžia: kortelių tinklelis arba senos plytelės)
}
function annSoon() { if (!ANN.raf) ANN.raf = requestAnimationFrame(() => { ANN.raf = 0; annDraw(); }); }
function stepCnt() {
  const n = nSteps(SLIDES[PS.i]);
  $('psCnt').textContent = `${PS.i + 1} / ${SLIDES.length}` + (n && !ANN.hide ? ` · ${ANN.step}/${n}` : '');
  $('psNotes').querySelectorAll('li[data-k]').forEach(li => li.classList.toggle('cur', +li.dataset.k === ANN.step - 1));
}
function next() { const n = nSteps(SLIDES[PS.i]); if (!ANN.hide && ANN.step < n) { ANN.step++; annFocus(); stepCnt(); } else if (PS.i < SLIDES.length - 1) show(PS.i + 1); }
function prev() { if (!ANN.hide && ANN.step > 0) { ANN.step--; annFocus(); stepCnt(); } else if (PS.i > 0) show(PS.i - 1, true, true); }
function exitPres() {                   // išeiti – į tą patį tikrą puslapį, kuris rodomas skaidrėje (įžangoje / pabaigoje – į Pradžią)
  const sl = SLIDES[PS.i], u = slideUrl(sl, PS.c);
  const go = () => { location.href = u ? u.replace(/([?&])embed=1&?/, '$1').replace(/\?(#|$)/, '$1') : (ctryHome(PS.c) || 'index.html'); };
  if (document.fullscreenElement) document.exitFullscreen().then(go, go); else go();
}
function toggleNotes() { const on = $('ps').classList.toggle('nonotes'); try { localStorage.setItem('psNotes', on ? '0' : '1'); } catch (e) {} setTimeout(layout, 30); }
function annFocus() {                   // naujausio komentaro elementas – į matomą sritį
  const sl = SLIDES[PS.i], b = sl.b && sl.b[ANN.step - 1], el = b && annTarget(b.q);
  if (el) {
    const w = curFrame().contentWindow, vh = w.innerHeight, r = el.getBoundingClientRect(), big = r.height > vh * .55;
    if (r.top < 10 || r.bottom > vh - 10 || big) w.scrollTo(0, Math.max(0, w.scrollY + r.top - (big ? 30 : Math.max(30, (vh - r.height) / 2.4))));
  }
  annDraw();
}
function annDraw() {
  const box = $('psAnn'), sl = SLIDES[PS.i], st = $('psStage'), W = st.clientWidth, H = st.clientHeight, s = pScale();
  box.innerHTML = '';
  if (ANN.hide || !ANN.step || !sl.b) return;
  const n = Math.min(ANN.step, sl.b.length), placed = [], paths = [], M = 10;
  const fresh = ANN.shown !== PS.i + ':' + ANN.step; ANN.shown = PS.i + ':' + ANN.step;   // įsibėgėjimo animacija – tik naujam komentarui (perpiešiama dažnai)
  const ov = (a, b) => a.x < b.x + b.w + 8 && b.x < a.x + a.w + 8 && a.y < b.y + b.h + 8 && b.y < a.y + a.h + 8;
  const fits = c => c.x >= M && c.y >= M && c.x + c.w <= W - M && c.y + c.h <= H - M && !placed.some(p => ov(p, c));
  let corner = 16;
  for (let k = 0; k < n; k++) {
    const b = sl.b[k], el = annTarget(b.q), last = k === ANN.step - 1;
    let r = null;
    if (el) { const q = el.getBoundingClientRect(); r = { l: q.left * s, t: q.top * s, r: q.right * s, b: q.bottom * s };
      if (r.b < 4 || r.t > H - 4) { if (!last) continue; r = null; } }
    if (!last) {                        // ankstesni komentarai – tik numeris prie elemento (tekstas – šoniniame skydelyje, N)
      if (!r) continue;
      const bx = Math.max(4, Math.min(W - 30, r.l - 8)), by = Math.max(4, Math.min(H - 30, r.t - 10));
      paths.push(`<rect class="ring" x="${Math.max(0, r.l) - 5}" y="${Math.max(0, r.t) - 5}" width="${Math.min(W, r.r) - Math.max(0, r.l) + 10}" height="${Math.min(H, r.b) - Math.max(0, r.t) + 10}" rx="10"/>`);
      const o = document.createElement('i'); o.className = 'ps-old'; o.textContent = k + 1; o.style.left = bx + 'px'; o.style.top = by + 'px'; box.append(o); continue;
    }
    const d = document.createElement('div'); d.className = 'ps-cb' + (last ? ' cur' : '') + (fresh ? ' anim' : '');
    d.innerHTML = `<i>${k + 1}</i><span>${escP(PL(b))}</span>`;
    const bw = Math.round(Math.min(330, Math.max(240, W * .26))); d.style.width = bw + 'px'; box.append(d);
    const bh = d.offsetHeight, G = 46;
    let c = null;
    if (r) {
      const cr = { l: Math.max(0, r.l), t: Math.max(0, r.t), r: Math.min(W, r.r), b: Math.min(H, r.b) }, cy = (cr.t + cr.b) / 2, cx = (cr.l + cr.r) / 2;
      const clampY = y => Math.max(M, Math.min(H - M - bh, y)), clampX = x => Math.max(M, Math.min(W - M - bw, x));
      const cands = [{ x: cr.r + G, y: clampY(cy - bh / 2) }, { x: cr.l - G - bw, y: clampY(cy - bh / 2) }, { x: clampX(cx - bw / 2), y: cr.b + G * .8 },
        { x: clampX(cx - bw / 2), y: cr.t - G * .8 - bh }, { x: clampX(cr.r - bw - 24), y: clampY(cr.t + 24), inside: 1 }, { x: clampX(cr.l + 24), y: clampY(cr.b - bh - 24), inside: 1 }];
      c = cands.map(o => ({ ...o, w: bw, h: bh })).find(fits) || { x: clampX(cr.r - bw - 24), y: clampY(cr.t + 24), w: bw, h: bh, inside: 1 };
      paths.push(`<rect class="ring${last ? ' cur' : ''}" x="${cr.l - 5}" y="${cr.t - 5}" width="${cr.r - cr.l + 10}" height="${cr.b - cr.t + 10}" rx="10"/>`);
      if (!c.inside) {                  // rodyklė: nuo debesėlio krašto iki artimiausio rėmelio taško
        const tx = Math.max(cr.l + 6, Math.min(cr.r - 6, c.x + bw / 2)), ty = Math.max(cr.t + 6, Math.min(cr.b - 6, c.y + bh / 2));
        const fx = Math.max(c.x, Math.min(c.x + bw, tx)), fy = Math.max(c.y, Math.min(c.y + bh, ty));
        const ex = tx + (fx - tx) * (8 / Math.max(1, Math.hypot(fx - tx, fy - ty))), ey = ty + (fy - ty) * (8 / Math.max(1, Math.hypot(fx - tx, fy - ty)));
        const mx = (fx + ex) / 2 + (ey - fy) * .18, my = (fy + ey) / 2 - (ex - fx) * .18;
        paths.push(`<path class="arr${last ? ' cur' : ''}" d="M${fx},${fy} Q${mx},${my} ${ex},${ey}" marker-end="url(#psHead${last ? 'C' : ''})"/>`);
      }
    } else { c = { x: W - bw - 16, y: corner, w: bw, h: bh }; corner += bh + 10; }
    placed.push(c); d.style.left = c.x + 'px'; d.style.top = c.y + 'px';
  }
  box.insertAdjacentHTML('afterbegin', `<svg width="${W}" height="${H}" aria-hidden="true"><defs><marker id="psHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="hd"/></marker><marker id="psHeadC" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="hd cur"/></marker></defs>${paths.join('')}</svg>`);
  if (ANN.step > sl.b.length && sl.w) {
    const w = document.createElement('div'); w.className = 'ps-whyb' + (fresh ? ' anim' : '');
    w.innerHTML = `<b>${escP(PL(PS_TX.why))}</b>${escP(PL(sl.w))}`; box.append(w);
  }
}

/* ---------- klavišai ir mygtukai ---------- */
function fullscreen() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
function overlay(id, on) { const o = $(id), v = on === undefined ? !o.classList.contains('on') : on; o.classList.toggle('on', v); if (v && id === 'psGrid') gridHTML(); if (v && id === 'psHelp') helpHTML(); }
function anyOverlay() { return ['psGrid', 'psHelp'].some(id => $(id).classList.contains('on')); }
function onKey(e, inFrame) {
  const tg = e.target, typing = tg && (/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) || tg.isContentEditable);
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key, go = fn => { e.preventDefault(); overlay('psGrid', false); overlay('psHelp', false); fn(); };
  if (k === 'ArrowRight' || k === 'PageDown' || k === 'ArrowDown' || (k === ' ' && !inFrame)) return go(next);
  if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') return go(prev);
  if (k === 'Home') return go(() => show(0));
  if (k === 'End') return go(() => show(SLIDES.length - 1));
  const l = k.toLowerCase(), act = { f: fullscreen, l: () => setTool('laser'), d: () => setTool('pen'), s: () => setTool('spot'),
    q: exitPres, c: () => { INK.strokes = []; drawInk(); }, n: toggleNotes, a: () => { ANN.hide = false; ANN.step = nSteps(SLIDES[PS.i]); annDraw(); stepCnt(); }, h: () => { ANN.hide = !ANN.hide; annDraw(); stepCnt(); }, g: () => overlay('psGrid'), '?': () => overlay('psHelp'),
    b: () => $('psBlack').classList.toggle('on'), '+': () => zoom(1.1), '=': () => zoom(1.1), '-': () => zoom(1 / 1.1), '0': () => { PS.zoom = 1; layout(); },
    escape: () => { if (anyOverlay()) { overlay('psGrid', false); overlay('psHelp', false); } else if ($('psBlack').classList.contains('on')) $('psBlack').classList.remove('on'); else if (PS.tool) setTool(PS.tool); } }[l];
  if (act) { e.preventDefault(); act(); }
}
function zoom(m) { PS.zoom = Math.max(.6, Math.min(1.8, PS.zoom * m)); layout(); toast(Math.round(PS.zoom * 100) + ' %'); }
let toastT = 0;
function toast(s) { const t = $('psToast'); t.textContent = s; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1800); }
function gridHTML() {
  $('psGrid').innerHTML = `<h3>${escP(PL(PS_TX.grid))}</h3><div class="ps-grid">${SLIDES.map((s, k) => `<button type="button" data-go="${k}" class="${k === PS.i ? 'cur' : ''}"><i>${k + 1} · ${escP(PL(PS_SEC[s.s]))}</i>${escP(PL(s.t))}</button>`).join('')}</div>`;
}
function helpHTML() {
  $('psHelp').innerHTML = `<h3>${escP(PL(PS_TX.helpT))}</h3><div class="ps-keys">${PL(PS_TX.keys).map(([a, b]) => `<kbd>${escP(a)}</kbd><span>${escP(b)}</span>`).join('')}</div>`;
}
function chrome() {                     // užrašai pagal kalbą
  $('psBrand').textContent = PL(PS_TX.brand);
  document.querySelectorAll('.ps-tool[data-t]').forEach(b => { const kk = { laser: 'L', pen: 'D', spot: 'S' }[b.dataset.t]; b.innerHTML = `${escP(PL(PS_TX[b.dataset.t]))} <kbd>${kk}</kbd>`; });
  document.querySelectorAll('.ps-tool[data-a]').forEach(b => { const a = b.dataset.a, kk = { notes: 'N', grid: 'G', full: 'F', exit: 'Q' }[a]; if (kk) b.innerHTML = `${escP(PL(PS_TX[a]))} <kbd>${kk}</kbd>`; });
  $('psCtry').innerHTML = CTRYS.map(c => `<button type="button" data-c="${c}" aria-pressed="${c === PS.c}">${c}</button>`).join('');
  $('psLang').innerHTML = ULANGS.map(l => `<option value="${l}"${l === ulang ? ' selected' : ''}>${l.toUpperCase()}</option>`).join('');
  $('psBar').innerHTML = SLIDES.map((s, k) => `<button type="button" data-go="${k}" title="${k + 1}. ${escP(PL(s.t))}"></button>`).join('');
  $('psHome').href = ctryHome(PS.c) || 'index.html';
  document.documentElement.lang = ulang;
}
function resetFrames() { PS.frames.forEach(f => f.remove()); PS.frames.clear(); }

function init() {
  let q; try { q = new URLSearchParams(location.hash.slice(1)); } catch (e) { q = new URLSearchParams(); }
  let c = q.get('c'); if (!c) { try { c = localStorage.getItem('ctry'); } catch (e) {} }
  PS.c = CTRYS.includes(c) ? c : 'LT';
  const si = SLIDES.findIndex(s => s.id === q.get('s'));
  chrome(); inkEvents();
  { let nv = null; try { nv = localStorage.getItem('psNotes'); } catch (e) {} if (nv !== '1') $('ps').classList.add('nonotes'); }   // numatyta: komentarai ant vaizdo, šoninis skydelis – N
  setInterval(() => { if (ANN.step && !document.hidden) annDraw(); }, 900);   // puslapio turinys dar gali persitvarkyti (vėliau kraunami duomenys)
  document.addEventListener('keydown', e => onKey(e, false));
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { overlay('psGrid', false); show(+g.dataset.go); return; }
    const t = e.target.closest('.ps-tool[data-t]'); if (t) { setTool(t.dataset.t); t.blur(); return; }
    const a = e.target.closest('.ps-tool[data-a]');
    if (a) { a.blur(); ({ prev, next, full: fullscreen, grid: () => overlay('psGrid'), help: () => overlay('psHelp'), notes: toggleNotes, exit: exitPres })[a.dataset.a](); return; }
    const cb = e.target.closest('#psCtry button[data-c]');
    if (cb && cb.dataset.c !== PS.c) { PS.c = cb.dataset.c; try { localStorage.setItem('ctry', PS.c); } catch (er) {} resetFrames(); chrome(); show(PS.i); }
    if (e.target.classList && e.target.classList.contains('ps-ov')) overlay(e.target.id, false);
  });
  $('psLang').addEventListener('change', e => {   // kalba bendra su svetaine (localStorage „lang“) – rėmeliai perkraunami
    ulang = ULANGS.includes(e.target.value) ? e.target.value : 'lt'; lang = ulang === 'lt' ? 'lt' : 'en';
    try { localStorage.setItem('lang', ulang); } catch (er) {}
    resetFrames(); chrome(); show(PS.i);
  });
  addEventListener('resize', layout);
  addEventListener('fullscreenchange', () => setTimeout(layout, 60));
  show(si < 0 ? 0 : si);
}
init();
