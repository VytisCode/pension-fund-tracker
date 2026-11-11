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

/* p – LT puslapis (šalies atitikmuo – ctryHref), h – skirtukas / vieta (#tab=…, #go=…), u – fiksuotas adresas (be šalies jungiklio) */
const SLIDES = [
  { id: 'intro', s: 'intro', text: 'intro',
    t: { lt: 'Pensijų fondų dashboard', en: 'Pension fund dashboard', lv: 'Pensiju fondu panelis', et: 'Pensionifondide ülevaade' } },
  { id: 'td', s: 'home', p: 'index', h: 'tab=td',
    t: { lt: 'Šiandien', en: 'Today', lv: 'Šodien', et: 'Täna' },
    b: { lt: ['Visų gimimo metų grupių grąžos vienoje lentelėje: diena, mėnuo, metai ir ilgesni laikotarpiai.', 'Lyginamasis valdytojas pasirenkamas; kol nepasirinktas – lyginama su kitų valdytojų mediana.', 'Duomenys atnaujinami automatiškai kiekvieną darbo dieną.'],
      en: ['Returns of all birth-year groups in one table: day, month, year and longer periods.', 'The reference manager is chosen freely; until chosen, results are compared with the median of the others.', 'Data are updated automatically every working day.'],
      lv: ['Visu dzimšanas gadu grupu ienesīgums vienā tabulā: diena, mēnesis, gads un ilgāki periodi.', 'Salīdzināmo pārvaldītāju izvēlas brīvi; kamēr nav izvēlēts – salīdzina ar pārējo mediānu.', 'Dati tiek atjaunināti automātiski katru darba dienu.'],
      et: ['Kõigi sünniaastate gruppide tootlus ühes tabelis: päev, kuu, aasta ja pikemad perioodid.', 'Võrdlusfondivalitseja valitakse vabalt; kuni valimata – võrreldakse teiste mediaaniga.', 'Andmed uuenevad automaatselt igal tööpäeval.'] },
    w: { lt: 'Vienas žvilgsnis atsako, kaip rinkai sekėsi šiandien ir kur yra kiekvienas valdytojas.', en: 'One glance answers how the market did today and where each manager stands.', lv: 'Viens skatiens atbild, kā tirgum veicās šodien un kur atrodas katrs pārvaldītājs.', et: 'Üks pilk vastab, kuidas turul täna läks ja kus iga fondivalitseja asub.' } },
  { id: 'my', s: 'home', p: 'index', h: 'tab=td&go=myC',
    t: { lt: 'Mano kortelės', en: 'My cards', lv: 'Manas kartītes', et: 'Minu kaardid' },
    b: { lt: ['Kiekvienas susidaro savo kortelių rinkinį: fondas, valdytojas, laikotarpis, palyginimas.', 'Rinkinį galima perduoti kolegai nuoroda.', 'Išsaugoma naršyklėje, atskirai kiekvienai šaliai.'],
      en: ['Everyone builds their own set of cards: fund, manager, period, comparison.', 'The set can be shared with a colleague as a link.', 'Saved in the browser, separately for each country.'],
      lv: ['Katrs izveido savu kartīšu kopu: fonds, pārvaldītājs, periods, salīdzinājums.', 'Kopu var nodot kolēģim ar saiti.', 'Saglabājas pārlūkā, atsevišķi katrai valstij.'],
      et: ['Igaüks paneb kokku oma kaardid: fond, fondivalitseja, periood, võrdlus.', 'Komplekti saab kolleegile saata lingiga.', 'Salvestub brauseris, iga riigi jaoks eraldi.'] },
    w: { lt: 'Skirtingiems žmonėms svarbūs skirtingi skaičiai: vienas dashboard, daug vaizdų.', en: 'Different people need different numbers: one dashboard, many views.', lv: 'Dažādiem cilvēkiem svarīgi dažādi skaitļi: viens panelis, daudz skatu.', et: 'Eri inimestele on olulised eri numbrid: üks ülevaade, palju vaateid.' } },
  { id: 'nw', s: 'home', p: 'index', h: 'tab=nw',
    t: { lt: 'Naujienos apie pensijas', en: 'Pension news', lv: 'Pensiju ziņas', et: 'Pensioniuudised' },
    b: { lt: ['Kasdien surenkami straipsniai iš naujienų paieškos ir leidinių RSS, archyvas nuo 2019 m.', 'Temų laiko juosta: kada tema iškilo, kiek truko, kada užgeso.', '„Kas kalba“: politikai, organizacijos, komentatoriai, Seimo darbotvarkės.'],
      en: ['Articles collected daily from news search and publishers’ RSS, archive since 2019.', 'Topic timeline: when a topic appeared, how long it lasted, when it faded.', '“Who speaks”: politicians, organisations, commentators, parliament agendas.'],
      lv: ['Raksti tiek apkopoti katru dienu no ziņu meklēšanas un izdevumu RSS, arhīvs kopš 2019. gada.', 'Tēmu laika josla: kad tēma parādījās, cik ilgi ilga, kad pierima.', '“Kas runā”: politiķi, organizācijas, komentētāji, parlamenta darba kārtība.'],
      et: ['Artiklid kogutakse iga päev uudisteotsingust ja väljaannete RSS-ist, arhiiv alates 2019.', 'Teemade ajajoon: millal teema tekkis, kui kaua kestis, millal vaibus.', '„Kes räägib“: poliitikud, organisatsioonid, kommentaatorid, parlamendi päevakord.'] },
    w: { lt: 'Pensijų rezultatus dažnai lemia ne tik rinkos, bet ir sprendimai: reforma, įmokos, mokesčiai.', en: 'Pension outcomes depend not only on markets but on decisions: reform, contributions, taxes.', lv: 'Pensiju rezultātus nosaka ne tikai tirgi, bet arī lēmumi: reforma, iemaksas, nodokļi.', et: 'Pensionitulemusi ei mõjuta ainult turud, vaid ka otsused: reform, sissemaksed, maksud.' } },
  { id: 'qf', s: 'facts', p: 'facts', h: 'tab=qf',
    t: { lt: 'Ketvirčio faktai', en: 'Quarter facts', lv: 'Ceturkšņa fakti', et: 'Kvartali faktid' },
    b: { lt: ['Faktai sakiniais su skaičiais: kas augo, kas krito, kas pirmavo.', 'Prie kiekvieno fakto – Excel su formulėmis, kad būtų galima patikrinti.', 'Pagrindas – Lietuvos banko ketvirčio duomenys nuo 2015 m.'],
      en: ['Facts as sentences with numbers: what grew, what fell, who led.', 'Each fact comes with an Excel file of formulas so it can be checked.', 'Based on Bank of Lithuania quarterly data since 2015.'],
      lv: ['Fakti teikumos ar skaitļiem: kas auga, kas kritās, kas bija pirmais.', 'Katram faktam – Excel ar formulām, lai to varētu pārbaudīt.', 'Pamatā – Lietuvas Bankas ceturkšņa dati kopš 2015. gada.'],
      et: ['Faktid lausetena koos numbritega: mis kasvas, mis langes, kes juhtis.', 'Iga fakti juures on valemitega Excel, et seda saaks kontrollida.', 'Aluseks Leedu Panga kvartaliandmed alates 2015.'] },
    w: { lt: 'Ataskaitai reikia ne lentelės, o patikrinamo sakinio.', en: 'A report needs a verifiable sentence, not a table.', lv: 'Pārskatam vajag nevis tabulu, bet pārbaudāmu teikumu.', et: 'Aruandesse on vaja kontrollitavat lauset, mitte tabelit.' } },
  { id: 'eu', s: 'facts', p: 'facts', h: 'tab=eu',
    t: { lt: 'Uždarbis eurais', en: 'Earnings in euros', lv: 'Peļņa eiro', et: 'Tulu eurodes' },
    b: { lt: ['Kiek eurų fondas, valdytojas ar visa pakopa uždirbo ar prarado per dieną, mėnesį, ketvirtį, metus.', 'Skaičiuojama tik investicijų grąža: įmokos ir išmokos atskirtos.', 'Laikotarpis prieš reformą ir po jos.'],
      en: ['How many euros a fund, a manager or the whole pillar earned or lost per day, month, quarter, year.', 'Only investment return is counted: contributions and payouts are separated.', 'Periods before and after the reform.'],
      lv: ['Cik eiro fonds, pārvaldītājs vai viss līmenis nopelnīja vai zaudēja dienā, mēnesī, ceturksnī, gadā.', 'Tiek skaitīts tikai ieguldījumu ienesīgums: iemaksas un izmaksas atdalītas.', 'Periodi pirms reformas un pēc tās.'],
      et: ['Mitu eurot fond, fondivalitseja või kogu sammas teenis või kaotas päevas, kuus, kvartalis, aastas.', 'Arvestatakse ainult investeerimistulu: sissemaksed ja väljamaksed on eraldatud.', 'Perioodid enne reformi ja pärast seda.'] },
    w: { lt: 'Procentai abstraktūs, eurai parodo mastą: kiek tai reiškia visiems dalyviams kartu.', en: 'Percentages are abstract; euros show the scale for all members together.', lv: 'Procenti ir abstrakti, eiro parāda mērogu visiem dalībniekiem kopā.', et: 'Protsendid on abstraktsed, eurod näitavad mastaapi kõigi osalejate jaoks kokku.' } },
  { id: 'mg', s: 'mgr', p: 'managers', h: 'tab=mg',
    t: { lt: 'Valdytojai', en: 'Managers', lv: 'Pārvaldītāji', et: 'Fondivalitsejad' },
    b: { lt: ['Valdytojų plytelės: turtas, rinkos dalis ir jos pokytis.', '„Kuo gali pasigirti“: šiuo metu galiojančios kiekvieno valdytojo pirmos vietos.', 'Rinkos dalis laike ir dalyvių judėjimas.'],
      en: ['Manager tiles: assets, market share and its change.', '“Bragging rights”: each manager’s current first places.', 'Market share over time and member movements.'],
      lv: ['Pārvaldītāju kartītes: aktīvi, tirgus daļa un tās izmaiņas.', '“Ar ko var lepoties”: katra pārvaldītāja pašreizējās pirmās vietas.', 'Tirgus daļa laikā un dalībnieku kustība.'],
      et: ['Fondivalitsejate kaardid: varad, turuosa ja selle muutus.', '„Millega kiidelda“: iga fondivalitseja praegused esikohad.', 'Turuosa ajas ja osalejate liikumine.'] },
    w: { lt: 'Rinkos dalies pokytis rodo, kur realiai juda dalyviai ir pinigai.', en: 'Changes in market share show where members and money actually move.', lv: 'Tirgus daļas izmaiņas parāda, kur patiesībā pārvietojas dalībnieki un nauda.', et: 'Turuosa muutus näitab, kuhu osalejad ja raha tegelikult liiguvad.' } },
  { id: 'market', s: 'p2', p: 'performance', h: 'tab=market',
    t: { lt: 'Visa rinka', en: 'Whole market', lv: 'Viss tirgus', et: 'Kogu turg' },
    b: { lt: ['Visų II pakopos fondų grąžos 13 laikotarpių.', 'Valdytojų svertinė grąža: svoriai – fondų grynieji aktyvai.', 'Kiekvienas grafikas: kopijuoti, PNG, Excel.'],
      en: ['Returns of all pillar II funds over 13 periods.', 'Managers’ weighted return: weights are the funds’ net assets.', 'Every chart: copy, PNG, Excel.'],
      lv: ['Visu 2. līmeņa fondu ienesīgums 13 periodos.', 'Pārvaldītāju svērtais ienesīgums: svari – fondu neto aktīvi.', 'Katrs grafiks: kopēt, PNG, Excel.'],
      et: ['Kõigi II samba fondide tootlus 13 perioodi lõikes.', 'Fondivalitsejate kaalutud tootlus: kaaludeks fondide puhasvara.', 'Iga graafik: kopeeri, PNG, Excel.'] },
    w: { lt: 'Pirmas klausimas – kaip sekėsi rinkai; tik tada – kaip sekėsi konkrečiam fondui.', en: 'First question: how did the market do; only then: how did a given fund do.', lv: 'Pirmais jautājums – kā veicās tirgum; tikai tad – kā veicās konkrētam fondam.', et: 'Esimene küsimus: kuidas läks turul; alles siis: kuidas läks konkreetsel fondil.' } },
  { id: 'sum', s: 'p2', p: 'performance', h: 'tab=sum',
    t: { lt: 'Lyderiai ir judesiai', en: 'Leaders & moves', lv: 'Līderi un izmaiņas', et: 'Liidrid ja liikumised' },
    b: { lt: ['Lyderiai kiekvienoje gimimo metų grupėje ir vieta grupėje.', 'Kas pakilo ir kas nukrito reitinge per pasirinktą laikotarpį.', 'Grupė pasirenkama pačioje kortelėje.'],
      en: ['Leaders in each birth-year group and rank within the group.', 'Who moved up and who moved down over the chosen period.', 'The group is chosen within the card itself.'],
      lv: ['Līderi katrā dzimšanas gadu grupā un vieta grupā.', 'Kas pakāpās un kas noslīdēja izvēlētajā periodā.', 'Grupu izvēlas pašā kartītē.'],
      et: ['Liidrid igas sünniaastate grupis ja koht grupis.', 'Kes tõusis ja kes langes valitud perioodil.', 'Grupp valitakse kaardil endal.'] },
    w: { lt: 'Fondai lyginami tik su tos pačios gimimo metų grupės fondais – kitaip lygintume skirtingą riziką.', en: 'Funds are compared only within the same birth-year group; otherwise we would compare different risk.', lv: 'Fondus salīdzina tikai vienas dzimšanas gadu grupas ietvaros – citādi salīdzinātu atšķirīgu risku.', et: 'Fonde võrreldakse ainult sama sünniaastate grupi sees – muidu võrdleksime erinevat riski.' } },
  { id: 'fund', s: 'p2', p: 'performance', h: 'tab=fund',
    t: { lt: 'Fondų palyginimas', en: 'Fund comparison', lv: 'Fondu salīdzinājums', et: 'Fondide võrdlus' },
    b: { lt: ['Bet kurie fondai vienoje diagramoje, nuo pasirinktos datos.', 'Rodikliai šalia: grąža, svyravimai, skirtumas nuo grupės.', 'Grafiką galima įkelti į ataskaitą per kelias sekundes.'],
      en: ['Any funds on one chart, from a chosen date.', 'Key figures alongside: return, volatility, difference from the group.', 'A chart can go into a report in seconds.'],
      lv: ['Jebkuri fondi vienā grafikā, no izvēlētā datuma.', 'Rādītāji blakus: ienesīgums, svārstīgums, atšķirība no grupas.', 'Grafiku var ievietot pārskatā dažās sekundēs.'],
      et: ['Mis tahes fondid ühel graafikul, valitud kuupäevast.', 'Näitajad kõrval: tootlus, volatiilsus, erinevus grupist.', 'Graafiku saab aruandesse panna sekunditega.'] },
    w: { lt: 'Vienas vaizdas pakeičia kelias lenteles ir vienodai skaitomas visiems.', en: 'One view replaces several tables and reads the same for everyone.', lv: 'Viens skats aizstāj vairākas tabulas un visiem lasāms vienādi.', et: 'Üks vaade asendab mitu tabelit ja on kõigile ühtmoodi loetav.' } },
  { id: 'risk', s: 'p2', p: 'performance', h: 'tab=risk',
    t: { lt: 'Rizika', en: 'Risk', lv: 'Risks', et: 'Risk' },
    b: { lt: ['Svyravimai (standartinis nuokrypis) ir didžiausias kritimas.', 'Kilimas ir kritimas: kiek truko atsigavimas po nuosmukio.', 'Formulės sutikrintos su Lietuvos banko skelbiamais skaičiais.'],
      en: ['Volatility (standard deviation) and maximum drawdown.', 'Run-up and drawdown: how long recovery took after a fall.', 'Formulas checked against figures published by the Bank of Lithuania.'],
      lv: ['Svārstīgums (standartnovirze) un lielākais kritums.', 'Kāpums un kritums: cik ilgi ilga atgūšanās pēc krituma.', 'Formulas pārbaudītas pret Lietuvas Bankas publicētajiem skaitļiem.'],
      et: ['Volatiilsus (standardhälve) ja suurim langus.', 'Tõus ja langus: kui kaua kestis taastumine pärast langust.', 'Valemid kontrollitud Leedu Panga avaldatud arvudega.'] },
    w: { lt: 'Ta pati grąža su mažesniais svyravimais – geresnis rezultatas dalyviui.', en: 'The same return with lower volatility is a better outcome for members.', lv: 'Tāds pats ienesīgums ar mazākām svārstībām – labāks rezultāts dalībniekam.', et: 'Sama tootlus väiksema kõikumisega on osalejale parem tulemus.' } },
  { id: 'ym', s: 'p2', p: 'performance', h: 'tab=ym',
    t: { lt: 'Metai ir mėnesiai', en: 'Years & months', lv: 'Gadi un mēneši', et: 'Aastad ja kuud' },
    b: { lt: ['Kalendorinių metų ir mėnesių grąžos spalvų žemėlapyje.', 'Galima rodyti grąžą arba vietą grupėje.', 'Excel su formulėmis kiekvienam langeliui.'],
      en: ['Calendar-year and monthly returns as heat maps.', 'Shows either the return or the rank within the group.', 'Excel with a formula for every cell.'],
      lv: ['Kalendāro gadu un mēnešu ienesīgums krāsu kartē.', 'Var rādīt ienesīgumu vai vietu grupā.', 'Excel ar formulu katrai šūnai.'],
      et: ['Kalendriaastate ja kuude tootlus soojuskaardil.', 'Näitab kas tootlust või kohta grupis.', 'Excel valemiga iga lahtri jaoks.'] },
    w: { lt: 'Spalvos parodo, kuris valdytojas laimi kritimuose, o kuris – kilimuose.', en: 'Colours show which manager wins in falling markets and which in rising ones.', lv: 'Krāsas parāda, kurš pārvaldītājs uzvar kritumos un kurš – kāpumos.', et: 'Värvid näitavad, kes võidab langevatel ja kes tõusvatel turgudel.' } },
  { id: 'p3', s: 'p3', p: 'performance3', h: 'tab=market',
    t: { lt: 'III pakopa', en: 'Pillar III', lv: '3. līmenis', et: 'III sammas' },
    b: { lt: ['Tie patys skirtukai ir ta pati tvarka kaip II pakopoje.', 'Visa rinka – valdytojų vaizdu.', 'Fondai lyginami panašios rizikos kategorijose.'],
      en: ['The same tabs in the same order as pillar II.', 'Whole market – by manager.', 'Funds are compared within similar-risk categories.'],
      lv: ['Tās pašas cilnes tādā pašā secībā kā 2. līmenī.', 'Viss tirgus – pa pārvaldītājiem.', 'Fondus salīdzina līdzīga riska kategorijās.'],
      et: ['Samad vahelehed samas järjekorras nagu II sambas.', 'Kogu turg – fondivalitsejate kaupa.', 'Fonde võrreldakse sarnase riskiga kategooriates.'] },
    w: { lt: 'III pakopoje fondą dalyvis renkasi pats, todėl skirtumai tarp fondų jam svarbesni.', en: 'In pillar III members choose the fund themselves, so differences between funds matter more.', lv: '3. līmenī dalībnieks fondu izvēlas pats, tāpēc atšķirības starp fondiem ir svarīgākas.', et: 'III sambas valib osaleja fondi ise, seega on fondidevahelised erinevused olulisemad.' } },
  { id: 'pf', s: 'pf', p: 'portfolios', h: 'tab=ov',
    t: { lt: 'Portfeliai', en: 'Portfolios', lv: 'Portfeļi', et: 'Portfellid' },
    b: { lt: ['Ketvirčio apžvalga: ką fondai laiko – akcijos, obligacijos, fondai, indėliai.', 'Pirkimai ir pardavimai tarp ketvirčių, panašumas tarp fondų.', 'Tikroji sudėtis pro investicinius fondus (Morningstar).'],
      en: ['Quarter overview: what funds hold – equities, bonds, funds, deposits.', 'Buys and sells between quarters, similarity between funds.', 'True look-through composition of underlying funds (Morningstar).'],
      lv: ['Ceturkšņa pārskats: ko fondi tur – akcijas, obligācijas, fondi, noguldījumi.', 'Pirkumi un pārdošana starp ceturkšņiem, līdzība starp fondiem.', 'Patiesais sastāvs caur ieguldījumu fondiem (Morningstar).'],
      et: ['Kvartali ülevaade: mida fondid hoiavad – aktsiad, võlakirjad, fondid, hoiused.', 'Ostud ja müügid kvartalite vahel, fondide sarnasus.', 'Tegelik koosseis läbi alusfondide (Morningstar).'] },
    w: { lt: 'Grąža – rezultatas, portfelis – jo priežastis.', en: 'Return is the result; the portfolio is its cause.', lv: 'Ienesīgums ir rezultāts, portfelis – tā cēlonis.', et: 'Tootlus on tulemus, portfell on selle põhjus.' } },
  { id: 'alt', s: 'pf', p: 'portfolios', h: 'tab=alt', ltOnly: 1,
    t: { lt: 'Alternatyvios ir likvidumas', en: 'Alternatives and liquidity', lv: 'Alternatīvie ieguldījumi un likviditāte', et: 'Alternatiivid ja likviidsus' },
    b: { lt: ['Alternatyvių investicijų dalis lyginama su 30 % riba (II pakopa).', 'Baltijos šalių obligacijos lyginamos su fondo obligacijų dalimi.', 'Excel – įrodymų failas: visos lentelės yra formulės su šaltiniais.'],
      en: ['The share of alternative investments is compared with the 30% limit (pillar II).', 'Baltic bonds are compared with the fund’s bond share.', 'Excel is an evidence file: every table is formulas with sources.'],
      lv: ['Alternatīvo ieguldījumu daļa salīdzināta ar 30 % robežu (2. līmenis).', 'Baltijas obligācijas salīdzinātas ar fonda obligāciju daļu.', 'Excel – pierādījumu fails: visas tabulas ir formulas ar avotiem.'],
      et: ['Alternatiivinvesteeringute osa võrreldakse 30% piiriga (II sammas).', 'Balti võlakirju võrreldakse fondi võlakirjade osaga.', 'Excel on tõendifail: kõik tabelid on allikatega valemid.'] },
    w: { lt: 'Nelikvidų turtą sunku greitai parduoti, kai dalyviai keičia fondą ar atsiima pinigus.', en: 'Illiquid assets are hard to sell quickly when members switch funds or withdraw.', lv: 'Nelikvīdus aktīvus grūti ātri pārdot, kad dalībnieki maina fondu vai izņem naudu.', et: 'Mittelikviidset vara on raske kiiresti müüa, kui osalejad vahetavad fondi või võtavad raha välja.' } },
  { id: 'aum', s: 'aum', p: 'aum', h: 'tab=ch',
    t: { lt: 'Turtas ir pinigų srautai', en: 'Assets and flows', lv: 'Aktīvi un naudas plūsmas', et: 'Varad ja rahavood' },
    b: { lt: ['Grynieji aktyvai kasdien, rinkos dalis ir ketvirčio pokytis.', 'Kas keitė turtą: investicijų grąža ar pinigų srautai.', 'Reformos išmokos atpažįstamos automatiškai.'],
      en: ['Net assets daily, market share and quarterly change.', 'What changed assets: investment return or money flows.', 'Reform payouts are detected automatically.'],
      lv: ['Neto aktīvi katru dienu, tirgus daļa un ceturkšņa izmaiņas.', 'Kas mainīja aktīvus: ieguldījumu ienesīgums vai naudas plūsmas.', 'Reformas izmaksas tiek atpazītas automātiski.'],
      et: ['Puhasvara iga päev, turuosa ja kvartali muutus.', 'Mis muutis varasid: investeerimistulu või rahavood.', 'Reformi väljamaksed tuvastatakse automaatselt.'] },
    w: { lt: 'Turtas auga dėl dviejų priežasčių – įmokų ir grąžos; jas būtina atskirti.', en: 'Assets grow for two reasons – contributions and return; they must be separated.', lv: 'Aktīvi aug divu iemeslu dēļ – iemaksas un ienesīgums; tie jānodala.', et: 'Varad kasvavad kahel põhjusel – sissemaksed ja tootlus; need tuleb eristada.' } },
  { id: 'rep', s: 'rep', p: 'reports', h: 'tab=kid',
    t: { lt: 'Ataskaitos ir KID scenarijai', en: 'Reports and KID scenarios', lv: 'Pārskati un KID scenāriji', et: 'Aruanded ja KID stsenaariumid' },
    b: { lt: ['Grąža nuo 2019 m., mėnesių grąža, rezultatų rodikliai, pusmečio lentelės.', 'KID scenarijai dviem būdais: „kaip valdytojo ataskaitoje“ ir „teisingai pagal reglamentą“.', 'Skirtumai paaiškinti svetainėje ir Excel faile.'],
      en: ['Returns since 2019, monthly returns, performance KPIs, half-year tables.', 'KID scenarios two ways: “as in the manager’s report” and “correct per regulation”.', 'Differences explained on the site and in the Excel file.'],
      lv: ['Ienesīgums kopš 2019. gada, mēnešu ienesīgums, rezultātu rādītāji, pusgada tabulas.', 'KID scenāriji divos veidos: “kā pārvaldītāja pārskatā” un “pareizi pēc regulas”.', 'Atšķirības izskaidrotas vietnē un Excel failā.'],
      et: ['Tootlus alates 2019, kuude tootlus, tulemusnäitajad, poolaasta tabelid.', 'KID stsenaariumid kahel viisil: „nagu fondivalitseja aruandes“ ja „õigesti määruse järgi“.', 'Erinevused selgitatud lehel ja Exceli failis.'] },
    w: { lt: 'Valdytojų ataskaitas galima atkartoti ir patikrinti, o ne priimti tikėjimu.', en: 'Managers’ reports can be reproduced and checked, not taken on faith.', lv: 'Pārvaldītāju pārskatus var atkārtot un pārbaudīt, nevis pieņemt uz ticību.', et: 'Fondivalitsejate aruandeid saab korrata ja kontrollida, mitte usu peale võtta.' } },
  { id: 'jr', s: 'jr', p: 'journey', h: 'tab=my',
    t: { lt: 'Kelias į pensiją', en: 'Road to retirement', lv: 'Ceļš uz pensiju', et: 'Tee pensionini' },
    b: { lt: ['Asmeninis skaičiavimas: įmokos, fondas, sukaupta suma.', 'Ateities scenarijai: Sodros prielaidos, Lietuvos banko keliai, tik kaupimas.', 'Mokesčių poveikis ir „Kurį fondą rinktis?“.'],
      en: ['Personal calculation: contributions, fund, accumulated amount.', 'Future scenarios: Sodra assumptions, Bank of Lithuania paths, accumulation only.', 'Fee impact and “Which fund?”.'],
      lv: ['Personīgs aprēķins: iemaksas, fonds, uzkrātā summa.', 'Nākotnes scenāriji: Sodra pieņēmumi, Lietuvas Bankas ceļi, tikai uzkrāšana.', 'Komisiju ietekme un “Kuru fondu izvēlēties?”.'],
      et: ['Isiklik arvutus: sissemaksed, fond, kogunenud summa.', 'Tulevikustsenaariumid: Sodra eeldused, Leedu Panga teed, ainult kogumine.', 'Tasude mõju ja „Millise fondi valida?“.'] },
    w: { lt: 'Nedidelis grąžos ar mokesčio skirtumas per 30 metų virsta tūkstančiais eurų.', en: 'A small difference in return or fees becomes thousands of euros over 30 years.', lv: 'Neliela ienesīguma vai komisijas atšķirība 30 gados kļūst par tūkstošiem eiro.', et: 'Väike tootluse või tasu erinevus muutub 30 aastaga tuhandeteks eurodeks.' } },
  { id: 'bx', s: 'bx', u: 'index_lv.html#tab=td',
    t: { lt: 'Latvija ir Estija – tas pats dashboard', en: 'Latvia and Estonia – the same dashboard', lv: 'Latvija un Igaunija – tas pats panelis', et: 'Läti ja Eesti – sama ülevaade' },
    b: { lt: ['Viršuje LT | LV | EE jungiklis: tas pats puslapis kitos šalies duomenimis.', 'Kur šalis duomenų neskelbia, skirtukas pilkas ir paaiškina kodėl.', 'Keturios kalbos: LT, EN, LV, ET.'],
      en: ['LT | LV | EE switch at the top: the same page with another country’s data.', 'Where a country does not publish data, the tab is grey and explains why.', 'Four languages: LT, EN, LV, ET.'],
      lv: ['Augšā LT | LV | EE pārslēgs: tā pati lapa ar citas valsts datiem.', 'Kur valsts datus nepublicē, cilne ir pelēka un paskaidro kāpēc.', 'Četras valodas: LT, EN, LV, ET.'],
      et: ['Üleval LT | LV | EE lüliti: sama leht teise riigi andmetega.', 'Kui riik andmeid ei avalda, on vaheleht hall ja selgitab põhjust.', 'Neli keelt: LT, EN, LV, ET.'] },
    w: { lt: 'Vienoda navigacija leidžia tą patį klausimą užduoti visoms trims šalims vienodai.', en: 'Identical navigation lets the same question be asked of all three countries.', lv: 'Vienāda navigācija ļauj vienu jautājumu uzdot visām trim valstīm vienādi.', et: 'Ühtne navigeerimine võimaldab sama küsimust esitada kõigile kolmele riigile.' } },
  { id: 'rk', s: 'bx', u: 'baltic.html#c=X&tab=rk',
    t: { lt: 'Šalių palyginimas', en: 'Country comparison', lv: 'Valstu salīdzinājums', et: 'Riikide võrdlus' },
    b: { lt: ['Tarp šalių lyginami tik panašios rizikos fondai, tai aiškiai pažymėta.', 'Metų grąžos, laisvas palyginimas, reformos: Estija 2021 ir Lietuva 2026.', 'Šalies viduje – savos grupės: Latvijoje pagal akcijų dalį, Estijoje pagal rizikos grupę.'],
      en: ['Across countries only similar-risk funds are compared, clearly marked.', 'Yearly returns, free comparison, reforms: Estonia 2021 and Lithuania 2026.', 'Within a country – its own groups: Latvia by equity share, Estonia by risk group.'],
      lv: ['Starp valstīm salīdzina tikai līdzīga riska fondus, tas skaidri atzīmēts.', 'Gada ienesīgums, brīvs salīdzinājums, reformas: Igaunija 2021 un Lietuva 2026.', 'Valsts iekšienē – savas grupas: Latvijā pēc akciju daļas, Igaunijā pēc riska grupas.'],
      et: ['Riikide vahel võrreldakse ainult sarnase riskiga fonde, see on selgelt märgitud.', 'Aastatootlus, vaba võrdlus, reformid: Eesti 2021 ja Leedu 2026.', 'Riigi sees – oma grupid: Lätis aktsiate osa, Eestis riskigrupi järgi.'] },
    w: { lt: 'Palyginimas teisingas tik tada, kai lyginama panaši rizika.', en: 'A comparison is fair only when similar risk is compared.', lv: 'Salīdzinājums ir godīgs tikai tad, ja salīdzina līdzīgu risku.', et: 'Võrdlus on aus ainult siis, kui võrreldakse sarnast riski.' } },
  { id: 'how', s: 'how', p: 'how', h: '',
    t: { lt: 'Kaip tai veikia', en: 'How it works', lv: 'Kā tas darbojas', et: 'Kuidas see töötab' },
    b: { lt: ['Duomenų kelias: šaltinis → rinkiklis → failas → puslapis.', 'Kasdien automatiškai: rinkimas, svetainės sugeneravimas, patikra, vakarinis laiškas.', 'Kiekvienas šaltinis turi būseną: jei vėluoja, tai matyti svetainėje ir laiške.'],
      en: ['Data path: source → collector → file → page.', 'Automatic every day: collection, site build, checks, evening e-mail.', 'Each source has a status: delays are shown on the site and in the e-mail.'],
      lv: ['Datu ceļš: avots → savācējs → fails → lapa.', 'Automātiski katru dienu: vākšana, vietnes izveide, pārbaude, vakara e-pasts.', 'Katram avotam ir statuss: kavējumi redzami vietnē un e-pastā.'],
      et: ['Andmete tee: allikas → koguja → fail → leht.', 'Iga päev automaatselt: kogumine, lehe koostamine, kontroll, õhtune e-kiri.', 'Igal allikal on olek: hilinemised on näha lehel ja e-kirjas.'] },
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
  keys: { lt: [['→  tarpas  PageDown', 'kita skaidrė (tinka pristatymų pultelis)'], ['←  PageUp', 'ankstesnė'], ['Home / End', 'pirma / paskutinė'], ['F', 'visas ekranas'], ['L', 'lazerinė rodyklė'], ['D', 'piešti ant ekrano (C – išvalyti)'], ['S', 'prožektorius'], ['Esc', 'išjungti įrankį'], ['N', 'rodyti / slėpti komentarus'], ['G', 'visų skaidrių tinklelis'], ['B', 'juodas ekranas'], ['+  −  0', 'mastelis'], ['?', 'ši pagalba']],
    en: [['→  Space  PageDown', 'next slide (presentation clickers work)'], ['←  PageUp', 'previous'], ['Home / End', 'first / last'], ['F', 'full screen'], ['L', 'laser pointer'], ['D', 'draw on screen (C – clear)'], ['S', 'spotlight'], ['Esc', 'turn the tool off'], ['N', 'show / hide notes'], ['G', 'all slides'], ['B', 'black screen'], ['+  −  0', 'zoom'], ['?', 'this help']],
    lv: [['→  atstarpe  PageDown', 'nākamais slaids (der prezentāciju pults)'], ['←  PageUp', 'iepriekšējais'], ['Home / End', 'pirmais / pēdējais'], ['F', 'pilnekrāns'], ['L', 'lāzera rādītājs'], ['D', 'zīmēt uz ekrāna (C – notīrīt)'], ['S', 'prožektors'], ['Esc', 'izslēgt rīku'], ['N', 'rādīt / slēpt komentārus'], ['G', 'visi slaidi'], ['B', 'melns ekrāns'], ['+  −  0', 'mērogs'], ['?', 'šī palīdzība']],
    et: [['→  tühik  PageDown', 'järgmine slaid (esitluspult töötab)'], ['←  PageUp', 'eelmine'], ['Home / End', 'esimene / viimane'], ['F', 'täisekraan'], ['L', 'laserkursor'], ['D', 'joonista ekraanile (C – puhasta)'], ['S', 'prožektor'], ['Esc', 'lülita tööriist välja'], ['N', 'näita / peida märkmed'], ['G', 'kõik slaidid'], ['B', 'must ekraan'], ['+  −  0', 'suurendus'], ['?', 'see abi']] },
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
  f.addEventListener('load', () => { f.dataset.ready = '1'; hookFrame(f); if (f.classList.contains('on')) $('psLoad').textContent = ''; });
  f.src = url; $('psStage').prepend(f); PS.frames.set(url, f); layout();
  while (PS.frames.size > 4) { const [k, old] = PS.frames.entries().next().value; if (old.classList.contains('on')) break; old.remove(); PS.frames.delete(k); }
  return f;
}
function hookFrame(f) {                 // klavišai veikia ir tada, kai pelė ar fokusas – puslapyje
  try { f.contentWindow.addEventListener('keydown', e => onKey(e, true)); } catch (e) {}
}
function layout() {                     // puslapis piešiamas ≥ 1280 px pločio ir sumažinamas, kad tilptų (+/− – mastelis)
  const st = $('psStage'), W = st.clientWidth, H = st.clientHeight;
  const s = Math.min(1, W / 1280) * PS.zoom;
  PS.frames.forEach(f => { f.style.width = (W / s) + 'px'; f.style.height = (H / s) + 'px'; f.style.transform = `scale(${s})`; });
  const cv = $('psInk'), r = devicePixelRatio || 1;
  if (cv.width !== Math.round(W * r) || cv.height !== Math.round(H * r)) { cv.width = Math.round(W * r); cv.height = Math.round(H * r); INK.strokes = INK.strokes; drawInk(); }
}

/* ---------- skaidrės rodymas ---------- */
function show(i, push = true) {
  PS.i = Math.max(0, Math.min(SLIDES.length - 1, i));
  const sl = SLIDES[PS.i], url = slideUrl(sl, PS.c);
  INK.strokes = []; drawInk();
  PS.frames.forEach(f => f.classList.remove('on'));
  const tx = $('psText'); tx.classList.remove('on'); $('psLoad').textContent = '';
  if (sl.text || url === null) { tx.innerHTML = sl.text === 'intro' ? introHTML() : sl.text === 'end' ? endHTML() : naHTML(sl); tx.classList.add('on'); }
  else { const f = frameFor(url); f.classList.add('on'); if (!f.dataset.ready) $('psLoad').textContent = PL(PS_TX.loading); }
  notes(sl, url);
  $('psTtl').textContent = `${PL(PS_SEC[sl.s])} · ${PL(sl.t)}`;
  $('psCnt').textContent = `${PS.i + 1} / ${SLIDES.length}`;
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
    + `<ul>${(PL(sl.b) || []).map(x => `<li>${escP(x)}</li>`).join('')}</ul>`
    + `<div class="why"><b>${escP(PL(PS_TX.why))}</b>${escP(PL(sl.w))}</div>`
    + (sl.u ? `<p class="cnote">${escP(PL(PS_TX.fixed))}</p>` : PS.c !== 'LT' ? `<p class="cnote">${escP(PL(PS_TX.ctryNote)(cn))}</p>` : '')
    + (url ? `<p class="open"><a href="${escP(url.replace(/([?&])embed=1&?/, '$1').replace(/\?(#|$)/, '$1'))}" target="_blank" rel="noopener">${escP(PL(PS_TX.open))} ↗</a></p>` : '');
}
function introHTML() {
  const seen = new Set(), items = [];
  SLIDES.forEach((s, k) => { if (s.text || seen.has(s.s)) return; seen.add(s.s); const ts = SLIDES.filter(x => x.s === s.s).map(x => PL(x.t)).filter(x => x !== PL(PS_SEC[s.s]));
    items.push(`<button type="button" data-go="${k}"><b>${escP(PL(PS_SEC[s.s]))}</b><span>${ts.map(escP).join(' · ')}</span></button>`); });
  return `<h1>${escP(PL(SLIDES[0].t))}</h1><p class="sub">${escP(PL(PS_TX.sub))} · ${new Date().toISOString().slice(0, 10)}</p>`
    + `<p><span class="ps-pill">${escP(PL(PS_TX.live))}</span><span class="ps-pill">F · L · D · S · ?</span></p><div class="ps-agenda">${items.join('')}</div>`;
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

/* ---------- klavišai ir mygtukai ---------- */
function fullscreen() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); }
function overlay(id, on) { const o = $(id), v = on === undefined ? !o.classList.contains('on') : on; o.classList.toggle('on', v); if (v && id === 'psGrid') gridHTML(); if (v && id === 'psHelp') helpHTML(); }
function anyOverlay() { return ['psGrid', 'psHelp'].some(id => $(id).classList.contains('on')); }
function onKey(e, inFrame) {
  const tg = e.target, typing = tg && (/^(INPUT|TEXTAREA|SELECT)$/.test(tg.tagName) || tg.isContentEditable);
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key, go = d => { e.preventDefault(); overlay('psGrid', false); overlay('psHelp', false); show(PS.i + d); };
  if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !inFrame)) return go(1);
  if (k === 'ArrowLeft' || k === 'PageUp') return go(-1);
  if (k === 'Home') return go(-PS.i);
  if (k === 'End') return go(SLIDES.length);
  const l = k.toLowerCase(), act = { f: fullscreen, l: () => setTool('laser'), d: () => setTool('pen'), s: () => setTool('spot'),
    c: () => { INK.strokes = []; drawInk(); }, n: () => { $('ps').classList.toggle('nonotes'); setTimeout(layout, 30); }, g: () => overlay('psGrid'), '?': () => overlay('psHelp'),
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
  document.querySelectorAll('.ps-tool[data-a]').forEach(b => { const a = b.dataset.a, kk = { notes: 'N', grid: 'G', full: 'F' }[a]; if (kk) b.innerHTML = `${escP(PL(PS_TX[a]))} <kbd>${kk}</kbd>`; });
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
  document.addEventListener('keydown', e => onKey(e, false));
  document.addEventListener('click', e => {
    const g = e.target.closest('[data-go]'); if (g) { overlay('psGrid', false); show(+g.dataset.go); return; }
    const t = e.target.closest('.ps-tool[data-t]'); if (t) { setTool(t.dataset.t); t.blur(); return; }
    const a = e.target.closest('.ps-tool[data-a]');
    if (a) { a.blur(); ({ prev: () => show(PS.i - 1), next: () => show(PS.i + 1), full: fullscreen, grid: () => overlay('psGrid'), help: () => overlay('psHelp'),
      notes: () => { $('ps').classList.toggle('nonotes'); setTimeout(layout, 30); } })[a.dataset.a](); return; }
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
