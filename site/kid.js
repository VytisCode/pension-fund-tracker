/* Ataskaitų polapis, 5 dalis: KID veiklos rezultatų scenarijai (Reglamento (ES) 2017/653 IV priedas) – lentelė tokio pat formato kaip
   valdytojų III pakopos PID (savininko prašymas 2026-10-14), su pasirenkamu fondu, laikymo ir stebėjimo laikotarpiu, akcijų dalimi ir išlaidomis.
   Skaičiuojama čia pat iš REP.kidm (mėnesių pabaigų MSCI ACWI EUR NR ir sintetinis ECB 7 m. AAA obligacijų indeksas, kid_scenarios.py);
   numatytosios reikšmės – f.kid (PID, jei turime, arba mūsų taisyklė). Excel – visas skaičiavimas formulėmis. */
addStrings({
  kidTitle: 'KID performance scenarios', kidLead: 'SEB III pillar funds by the EU key information document method (Regulation 2017/653, Annex IV), in the same layout as SEB’s KIDs: what 1,000 € invested at the start of each year could become after 1 year, about half the recommended holding period and the full period. Two calculations: “As in SEB’s KID” (repeats SEB’s Excel file to the cent, with its errors) and “By the regulation” (correct). You can change the holding and observation periods and costs; the Excel file has the whole calculation as formulas with instructions.',
  kidW12: (n, a, b) => `As in the manager’s file, in the ${n}-year sheet the windows starting ${a} – ${b} take only the return of their last 12 months (the manager’s formula error; it lowers the moderate scenario; the corrected series uses full windows).`,
  kidMomDrop: k => `As in the manager’s file, the stress scenario moments (mean, σ, skewness, kurtosis) use only the first ${k} of the last 60 months (the manager’s formula range error; the corrected series uses all 60).`, kidFund: 'Fund', kidSer: 'Benchmark series', kidSerPid: 'As in the manager’s KID', kidRhpY: 'Holding period, years', kidEq: 'Equities, %', kidCost: 'Costs, % a year', kidFrom: 'Observation from', kidTo: 'to', kidReset: 'Defaults',
  kidInv: 'Investment 1,000 EUR a year', kidScH: 'Scenarios', kidRec: '(Recommended holding period)', kidYr: n => `${n} ${n === 1 ? 'year' : 'years'}`,
  kidSc: ['Stress scenario', 'Unfavourable scenario', 'Moderate scenario', 'Favourable scenario'], kidGet: 'What you might get back after costs', kidRet: 'Average return each year', kidPaid: 'Amount invested over time',
  kidIntro: (a, b) => `The scenarios shown are illustrations based on the available historical data of the fund’s benchmark from ${a} to ${b} showing the possible worst, average and best results of the pension fund over the stated periods.`,
  kidOurs: 'Our calculation', kidPid: d => `Manager’s KID (${d})`, kidDiff: 'Difference (ours − KID)', kidDiffNote: 'Return – percentage points, amount – €.',
  kidWait: 'Waiting for the bond index data (collected automatically).', kidShort: 'The observation period must be longer than the holding period and fit in the index history: ',
  kidRule: 'Holding period and equity share are our assumption (no KID of the manager): life-cycle funds – years to 65 for the middle of the birth-year group (at least 5, at most 20), asset preservation – 5; pillar III by type.',
  kidPidSrc: 'Defaults are taken from the manager’s KID.',
  kidOld: (d, a, b, c) => `Check against the earlier KID (${d}): set the observation period ${a} – ${b} – its benchmark series and costs ${c} % are used.`,
  kidBenchNote: 'Benchmark: the series SEB used in its own KID calculation (value before costs, month-ends; received from SEB via the owner). Average return each year for 1 year is the scenario return, for longer periods – XIRR of the payments (as in the KID).',
  kidNote: 'Proxy benchmark: equity share × MSCI ACWI EUR Net Return + the rest × synthetic euro area AAA government 7-year bond index (ECB yield curve), rebalanced monthly; month-end values. Not a forecast.',
  kidInfo: 'Method (Regulation (EU) 2017/653 Annex IV as amended by 2021/2268, category 2 product; ESAs Q&A JC 2023 22):\n\n• Observation period = RHP + 5 years (at least 10), ending on 31 December of the last full year; month-end values.\n• Costs (ongoing + transaction, % a year): 1/12 is subtracted from every monthly benchmark return; fund unit values are already net of costs.\n• For each period n (1 year, half the RHP rounded, RHP) every overlapping n-year window: moderate = median, favourable = maximum, unfavourable = minimum also counting shorter windows ending at the period end (their outcome is taken as the outcome over n years).\n• Stress: last 60 monthly log returns; σS = 99th (1 year) / 95th percentile of rolling standard deviations; Cornish-Fisher with skewness and excess kurtosis; never better than unfavourable.\n• 1,000 € at the start of each year; amount = Σ 1000 × (1 + r)^k; longer periods – XIRR of the payments.\n\n“As in SEB’s KID” and “By the regulation” differ in: data (SOLEBLS error; optionally the fund’s own unit values), SEB’s Excel formula errors (50+), the shorter unfavourable windows (12…12n+1 months vs 12…12n−1, none for 1 year) and the stress scenario (w = 12 vs 6 months for 1 year; 0.5·σ²·N vs 0.5·σS²·N). All differences, with their effect step by step, are shown under the table and in the Excel “Instructions” sheet.\n\nCheck: “As in SEB’s KID” reproduces all SEB III pillar KIDs (2026 and 2023) to the cent (50+ 2023 – to the euro, the data has 4 decimals). The Excel formulas were recalculated independently (LibreOffice) – identical to the page.',
  kidMode: 'Calculation', kidModeReg: 'By the regulation', kidModeSeb: 'As in SEB’s KID', kidData: 'Data',
  kidDataOwn: 'Fund unit values (benchmark before the fund existed)', kidDataIdx: 'Benchmark only',
  kidModeSebNote: '“As in SEB’s KID” repeats SEB’s own Excel calculation exactly, including its deviations from the regulation and its errors, so the result can be checked against the published KID to the cent.',
  kidModeRegNote: '“By the regulation” follows Regulation (EU) 2017/653 Annex IV (as amended by 2021/2268) and the ESAs Q&A (JC 2023 22): corrected index data, and the regulation’s rules for the shorter unfavourable windows and the stress scenario. The differences are listed step by step below. “Data” lets you use the fund’s own unit values instead of the benchmark (the regulation’s first choice where the fund’s history since its current strategy is long enough).',
  kidOwnUsed: (n, N, a) => `Fund unit values used for ${n} of ${N} months (from ${a}); earlier months – benchmark minus costs. Unit values are already net of all fund costs, so costs are not subtracted again for those months.`,
  kidOwnNone: 'The fund has no unit values in this observation period – the benchmark (minus costs) is used for all months.',
  kidStep: { seb: 'As in SEB’s KID (SEB’s Excel file)', err: 'SEB Excel file errors corrected', tl: 'Shorter unfavourable windows by the regulation', sm: 'Stress scenario by the regulation', ser: 'Corrected index data (SOLEBLS in EUR)', own: 'Fund’s own unit values (option “Data”)' },
  kidStepH: 'Step', kidStepT: n => `How SEB’s KID becomes the calculation by the regulation (${n} years, amount after costs)`,
  kidStepNote: 'Each row adds one correction to the row above; the small number shows the change caused by that correction. The first row is “As in SEB’s KID”, the second to last – “By the regulation” with the benchmark, the last – “By the regulation” with the fund’s own unit values. Corrections that do not change anything for this fund are still shown.',
  kidDiffsT: 'What exactly differs between “As in SEB’s KID” and “By the regulation” (click)',
  kidDiffs: [
    { t: '1. Data: fund history or benchmark', seb: 'the whole 10–16-year history is SEB’s composite benchmark (component indices with fixed weights, rebalanced monthly), minus costs / 12 each month.', reg: 'Annex IV points 5 and 12 and ESAs Q&A VI.12: the PRIIP’s own price history is used first; a benchmark (minus all costs) only supplements the months before the fund existed. Unit values are already net of costs. Option “Benchmark only” shows the result if the fund’s past (e.g. before a change of strategy) is considered not representative – the regulation and Q&A have no explicit rule for that in scenarios.', why: 'Effect: the fund’s real results replace a theoretical index. Unit values exist for SEB pensija 18+ and 58+ since 2004, 50+ since 2020, Klimato ateitis since 2022. The owner confirmed (2026-10-16) that the strategies apply since the funds were set up, so fund values are used by default and the benchmark only for months before the fund existed.' },
    { t: '2. Errors in SEB’s index data (SOLEBLS)', seb: 'SEB pensija 58+ and 50+: the emerging-market local-currency bond index (SOLEBLS) jumps +89.6 % in January 2015 (values before 2015 are at a different level), so the composite index jumps too.', reg: 'SOLEBLS monthly returns in EUR from Bloomberg (data from the owner); the rest of SEB’s composite unchanged.', why: 'Effect: mainly the favourable scenario (the jump made one-year windows containing January 2015 look much better).' },
    { t: '3. Formula errors in SEB’s Excel file (SEB pensija 50+ 2026 KID)', seb: 'stress moments (mean, σ, skewness, kurtosis) use only the first 48 of the last 60 months; in the 11-year sheet the windows starting 2013-01 … 2014-12 use only their last 12 months.', reg: 'Annex II point 12: moments of the whole 5-year (60-month) return sample; Annex IV point 7(a): every window is exactly the holding-period long.', why: 'Effect: SEB’s moderate 11-year scenario is too low (15,673 € instead of about 16,180 €).' },
    { t: '4. Shorter windows in the unfavourable scenario', seb: 'windows of 12 … 12n+1 months ending at the end of the period are added for every period, also for 1 year (a 13-month window).', reg: 'Annex IV point 7(b) and Q&A VI.8: only windows from 1 year to the holding period minus 1 month (the full-length one is already in 7(a)); for 1 year there are no shorter windows. Both treat the outcome of a shorter window as the outcome over the whole period (“linear transformation”, Q&A VI.9).', why: 'Effect: usually small; it matters when the worst result is in the extra window.' },
    { t: '5. Stress scenario', seb: '12-month rolling volatility windows also for 1 year; the subtracted term 0.5·σ²·N uses the ordinary 60-month σ.', reg: 'Annex IV point 18(a): for monthly prices w = 6 months for 1 year and 12 months for longer periods; point 19 (original 2017/653 Annex IV point 11): the subtracted term is 0.5·σS²·N with the stressed volatility σS.', why: 'Effect: the regulation’s stress result is lower (more conservative), especially for longer periods.' },
    { t: '6. The same in both', seb: '', reg: 'observation period RHP + 5 years (at least 10); month-end values; moderate = median and favourable = best of all full windows; percentiles 99 % (1 year) / 95 %; z for 1 % / 5 %; Cornish-Fisher; stress never better than unfavourable; 1,000 € at the start of each year; costs = ongoing + transaction costs, 1/12 subtracted from each monthly benchmark return; average return each year for longer periods = XIRR of the payments (the regulation gives no separate formula for regular payments).', why: 'Presentation: the regulation (Annex IV point 42) asks to round amounts to the nearest 10 €; here cents are shown so that the check is exact.' },
  ],
  kidShI: 'Instructions',
  kidExt: a => `From ${a} SEB’s KID benchmark series is extended automatically with the monthly returns of the fund benchmark SEB publishes daily (SEB’s KID Excel files will no longer be used). Check: extending one year this way differs from SEB’s exact calculation by 0–7 €.`,
  kidShM: 'Months', kidShW: 'Windows', kidShC: 'Calculation', kidShT: 'Scenarios',
}, {
  kidTitle: 'KID veiklos rezultatų scenarijai', kidLead: 'SEB III pakopos fondai pagal ES pagrindinės informacijos dokumento (KID / PID) metodiką (Reglamentas 2017/653, IV priedas), tokio pat formato lentele kaip SEB PID: kiek galėtų tapti 1000 €, investuojamų kiekvienų metų pradžioje, po 1 metų, maždaug pusės rekomenduojamo laikymo laikotarpio ir viso laikotarpio. Du skaičiavimai: „Kaip SEB PID“ (atkartoja SEB Excel failą iki cento, su jo klaidomis) ir „Pagal reglamentą“ (teisingas). Galite keisti laikymo ir stebėjimo laikotarpį ir išlaidas; Excel faile – visas skaičiavimas formulėmis su instrukcija.',
  kidW12: (n, a, b) => `Kaip valdytojo faile, ${n} m. lape langai, prasidedantys ${a} – ${b}, ima tik paskutinių 12 mėn. grąžą (valdytojo formulės klaida; ji sumažina nuosaikų scenarijų; pataisytoje eilutėje – pilni langai).`,
  kidMomDrop: k => `Kaip valdytojo faile, nepalankiausio scenarijaus momentai (vidurkis, σ, asimetrija, ekscesas) skaičiuojami tik iš pirmų ${k} iš paskutinių 60 mėn. (valdytojo formulės diapazono klaida; pataisytoje eilutėje – visi 60).`, kidFund: 'Fondas', kidSer: 'Indekso eilutė', kidSerPid: 'Kaip valdytojo PID', kidRhpY: 'Laikymo laikotarpis, metai', kidEq: 'Akcijos, %', kidCost: 'Išlaidos, % per metus', kidFrom: 'Stebėjimas nuo', kidTo: 'iki', kidReset: 'Numatytieji',
  kidInv: 'Investicija 1 000 EUR per metus', kidScH: 'Scenarijai', kidRec: '(Rekomenduojamas laikymo laikotarpis)', kidYr: n => `${n} ${n % 10 === 0 || (n % 100 > 9 && n % 100 < 21) ? 'metų' : 'metai'}`,
  kidSc: ['Nepalankiausias scenarijus', 'Nepalankus scenarijus', 'Nuosaikus scenarijus', 'Palankus scenarijus'], kidGet: 'Ką galite atgauti atskaičius išlaidas', kidRet: 'Metinė vidutinė grąža', kidPaid: 'Sukaupta investuota suma',
  kidIntro: (a, b) => `Pateikiami scenarijai yra pavyzdžiai, kurie naudojant turimus pensijų fondo lyginamojo indekso istorinius duomenis nuo ${a} iki ${b} d. parodo galimus blogiausius, vidutinius ir geriausius pensijų fondo rezultatus nurodytais laikotarpiais.`,
  kidOurs: 'Mūsų skaičiavimas', kidPid: d => `Valdytojo PID (${d})`, kidDiff: 'Skirtumas (mūsų − PID)', kidDiffNote: 'Grąža – procentiniais punktais, suma – eurais.',
  kidWait: 'Laukiama obligacijų indekso duomenų (renkami automatiškai).', kidShort: 'Stebėjimo laikotarpis turi būti ilgesnis už laikymo laikotarpį ir tilpti į indekso istoriją: ',
  kidRule: 'Laikymo laikotarpis ir akcijų dalis – mūsų prielaida (valdytojo PID neturime): gyvenimo ciklo fondams – metai iki 65 m. gimimo metų grupės viduriui (ne mažiau 5, ne daugiau 20), turto išsaugojimo – 5; III pakopos – pagal fondo rūšį.',
  kidPidSrc: 'Numatytosios reikšmės paimtos iš valdytojo PID.',
  kidOld: (d, a, b, c) => `Patikrai su ankstesniu PID (${d}): nustatykite stebėjimą ${a} – ${b} – bus naudojama to PID indekso eilutė ir išlaidos ${String(c).replace('.', ',')} %.`,
  kidBenchNote: 'Lyginamasis indeksas – eilutė, kurią SEB naudojo savo PID skaičiavime (vertė prieš išlaidas, mėnesių pabaigos; gauta iš SEB per savininką). Metinė vidutinė grąža: 1 metams – scenarijaus grąža, ilgesniems laikotarpiams – įmokų XIRR (kaip PID).',
  kidNote: 'Pakaitinis lyginamasis indeksas: akcijų dalis × MSCI ACWI EUR Net Return + likusi dalis × sintetinis euro zonos AAA vyriausybės 7 m. obligacijų indeksas (ECB pajamingumo kreivė), perbalansuojama kas mėnesį; mėnesių pabaigų vertės. Tai ne prognozė.',
  kidInfo: 'Metodika (Reglamento (ES) 2017/653 IV priedas su 2021/2268 pakeitimais, 2 kategorijos produktas; ESAs Q&A JC 2023 22):\n\n• Stebėjimo laikotarpis = RHP + 5 metai (ne mažiau 10), baigiasi paskutinių pilnų metų gruodžio 31 d.; mėnesių pabaigų vertės.\n• Išlaidos (einamosios + sandorių, % per metus): iš kiekvienos indekso mėnesio grąžos atimama 1/12; fondo vieneto vertės jau atskaičius išlaidas.\n• Kiekvienam laikotarpiui n (1 metai, pusė RHP suapvalinus, RHP) – visi persidengiantys n metų langai: nuosaikus = mediana, palankus = didžiausias, nepalankus = mažiausias, įskaitant trumpesnius langus iki laikotarpio pabaigos (jų rezultatas laikomas n metų rezultatu).\n• Nepalankiausias (stresinis): paskutinių 60 mėn. log grąžos; σS = slenkančių nuokrypių 99-asis (1 metams) / 95-asis procentilis; Cornish-Fisher su asimetrija ir ekscesu; ne geresnis už nepalankų.\n• 1000 € kiekvienų metų pradžioje; suma = Σ 1000 × (1 + r)^k; ilgesniems laikotarpiams – įmokų XIRR.\n\n„Kaip SEB PID“ ir „Pagal reglamentą“ skiriasi: duomenimis (SOLEBLS klaida; pasirinktinai – paties fondo vieneto vertės), SEB Excel formulių klaidomis (50+), nepalankaus scenarijaus trumpesniais langais (12…12n+1 mėn. vs 12…12n−1, 1 metams – jokių) ir stresiniu scenarijumi (1 metams w = 12 vs 6 mėn.; 0,5·σ²·N vs 0,5·σS²·N). Visi skirtumai ir jų įtaka žingsnis po žingsnio – po lentele ir Excel lape „Instrukcija“.\n\nPatikra: „Kaip SEB PID“ atkartoja visus SEB III pakopos PID (2026 ir 2023) iki cento (50+ 2023 – iki euro, duomenys su 4 skaitmenimis). Excel formulės nepriklausomai perskaičiuotos (LibreOffice) – sutampa su puslapiu.',
  kidMode: 'Skaičiavimas', kidModeReg: 'Pagal reglamentą', kidModeSeb: 'Kaip SEB PID', kidData: 'Duomenys',
  kidDataOwn: 'Fondo vieneto vertės (iki fondo veiklos – lyginamasis indeksas)', kidDataIdx: 'Tik lyginamasis indeksas',
  kidModeSebNote: '„Kaip SEB PID“ tiksliai atkartoja paties SEB Excel skaičiavimą – su jo nukrypimais nuo reglamento ir klaidomis, todėl rezultatą galima patikrinti su paskelbtu PID iki cento.',
  kidModeRegNote: '„Pagal reglamentą“ – pagal Reglamento (ES) 2017/653 IV priedą (su 2021/2268 pakeitimais) ir ESAs klausimus-atsakymus (JC 2023 22): pataisyti indekso duomenys, reglamento taisyklės nepalankaus scenarijaus trumpesniems langams ir stresiniam scenarijui. Skirtumai – žingsnis po žingsnio žemiau. „Duomenys“ leidžia vietoj indekso naudoti paties fondo vieneto vertes (reglamento pirmenybė, kai fondo istorija nuo dabartinės strategijos pradžios pakankamai ilga).',
  kidOwnUsed: (n, N, a) => `Fondo vieneto vertės naudojamos ${n} iš ${N} mėn. (nuo ${a}); ankstesni mėnesiai – lyginamasis indeksas minus išlaidos. Vieneto vertės jau atskaičius visas fondo išlaidas, todėl tiems mėnesiams išlaidos antrą kartą neatimamos.`,
  kidOwnNone: 'Šiame stebėjimo laikotarpyje fondas vieneto verčių neturi – visiems mėnesiams naudojamas lyginamasis indeksas (minus išlaidos).',
  kidStep: { seb: 'Kaip SEB PID (SEB Excel failas)', err: 'Ištaisytos SEB Excel failo klaidos', tl: 'Nepalankaus scenarijaus trumpesni langai pagal reglamentą', sm: 'Stresinis scenarijus pagal reglamentą', ser: 'Pataisyti indekso duomenys (SOLEBLS eurais)', own: 'Paties fondo vieneto vertės (pasirinkimas „Duomenys“)' },
  kidStepH: 'Žingsnis', kidStepT: n => `Kaip SEB PID skaičiavimas virsta skaičiavimu pagal reglamentą (${n} m., suma atskaičius išlaidas)`,
  kidStepNote: 'Kiekviena eilutė prideda vieną pataisą prie ankstesnės eilutės; mažas skaičius – tos pataisos sukeltas pokytis. Pirma eilutė – „Kaip SEB PID“, priešpaskutinė – „Pagal reglamentą“ su lyginamuoju indeksu, paskutinė – „Pagal reglamentą“ su paties fondo vieneto vertėmis. Rodomos ir pataisos, kurios šiam fondui nieko nekeičia.',
  kidDiffsT: 'Kuo tiksliai skiriasi „Kaip SEB PID“ ir „Pagal reglamentą“ (paspauskite)',
  kidDiffs: [
    { t: '1. Duomenys: fondo istorija ar lyginamasis indeksas', seb: 'visa 10–16 metų istorija – SEB sudėtinis lyginamasis indeksas (komponentų indeksai fiksuotais svoriais, perbalansuojama kas mėnesį), kas mėnesį atimant išlaidas / 12.', reg: 'IV priedo 5 ir 12 p., ESAs Q&A VI.12: pirmiausia naudojama paties produkto kainų istorija; lyginamasis indeksas (minus visos išlaidos) tik papildo mėnesius iki fondo veiklos pradžios. Vieneto vertės jau atskaičius išlaidas. Pasirinkimas „Tik lyginamasis indeksas“ parodo rezultatą, jei fondo praeitis (pvz. iki strategijos pakeitimo) laikoma nebeatspindinčia – scenarijams reglamentas ir Q&A tam aiškios taisyklės neturi.', why: 'Įtaka: teorinį indeksą pakeičia tikri fondo rezultatai. SEB pensija 18+ ir 58+ vieneto vertės yra nuo 2004 m., 50+ – nuo 2020 m., Klimato ateitis – nuo 2022 m. Savininkas patvirtino (2026-10-16), kad strategijos galioja nuo fondų įsteigimo, todėl pagal nutylėjimą naudojamos fondo vertės, o indeksas – tik mėnesiams iki fondo įsteigimo.' },
    { t: '2. SEB indekso duomenų klaida (SOLEBLS)', seb: 'SEB pensija 58+ ir 50+: besivystančių rinkų vietos valiutos obligacijų indeksas (SOLEBLS) 2015 m. sausį šokteli +89,6 % (iki 2015 m. vertės kito lygio), todėl šokteli ir sudėtinis indeksas.', reg: 'SOLEBLS mėnesio grąžos eurais iš Bloomberg (savininko duomenys); likusi SEB sudėtinio indekso dalis nepakeista.', why: 'Įtaka: daugiausia palankiam scenarijui (šuolis labai pagerino 1 metų langus su 2015 m. sausiu).' },
    { t: '3. SEB Excel failo formulių klaidos (SEB pensija 50+ 2026 m. PID)', seb: 'stresinio scenarijaus momentai (vidurkis, σ, asimetrija, ekscesas) – tik iš pirmų 48 iš paskutinių 60 mėn.; 11 metų lape langai, prasidedantys 2013-01 … 2014-12, ima tik paskutinių 12 mėn. grąžą.', reg: 'II priedo 12 p.: momentai iš visų 5 metų (60 mėn.) grąžų; IV priedo 7(a) p.: kiekvienas langas lygiai laikymo laikotarpio ilgio.', why: 'Įtaka: SEB nuosaikus 11 m. scenarijus per mažas (15 673 € vietoj ~16 180 €).' },
    { t: '4. Trumpesni langai nepalankiame scenarijuje', seb: 'kiekvienam laikotarpiui pridedami 12 … 12n+1 mėn. langai, kurie baigiasi laikotarpio pabaigoje, ir 1 metams (13 mėn. langas).', reg: 'IV priedo 7(b) p. ir Q&A VI.8: tik nuo 1 metų iki laikymo laikotarpio minus 1 mėn. ilgio langai (pilno ilgio – jau 7(a)); 1 metams trumpesnių langų nėra. Abu trumpesnio lango rezultatą laiko viso laikotarpio rezultatu („tiesinė transformacija“, Q&A VI.9).', why: 'Įtaka: dažniausiai maža; svarbi, kai blogiausias rezultatas – papildomame lange.' },
    { t: '5. Nepalankiausias (stresinis) scenarijus', seb: '12 mėn. slenkantys nuokrypio langai ir 1 metams; atimamame naryje 0,5·σ²·N naudojamas įprastas 60 mėn. σ.', reg: 'IV priedo 18(a) p.: mėnesiniams duomenims w = 6 mėn. 1 metams ir 12 mėn. ilgesniems laikotarpiams; 19 p. (pradinio 2017/653 IV priedo 11 p. tekstas): atimamas narys 0,5·σS²·N su stresiniu nuokrypiu σS.', why: 'Įtaka: pagal reglamentą stresinis rezultatas mažesnis (atsargesnis), ypač ilgesniems laikotarpiams.' },
    { t: '6. Kas abiem atvejais vienoda', seb: '', reg: 'stebėjimo laikotarpis RHP + 5 m. (ne mažiau 10); mėnesių pabaigų vertės; nuosaikus = mediana, palankus = geriausias iš visų pilnų langų; procentiliai 99 % (1 m.) / 95 %; z 1 % / 5 %; Cornish-Fisher; stresinis ne geresnis už nepalankų; 1000 € kiekvienų metų pradžioje; išlaidos = einamosios + sandorių, iš kiekvieno indekso mėnesio grąžos atimama 1/12; ilgesnių laikotarpių metinė vidutinė grąža = įmokų XIRR (reglamentas reguliarioms įmokoms atskiros formulės nenurodo).', why: 'Pateikimas: reglamentas (IV priedo 42 p.) liepia sumas apvalinti iki 10 €; čia rodomi centai, kad patikra būtų tiksli.' },
  ],
  kidShI: 'Instrukcija',
  kidExt: a => `Nuo ${a} SEB PID indekso eilutė automatiškai pratęsiama SEB kasdien skelbiamo fondo lyginamojo indekso mėnesio grąžomis (SEB PID Excel failų nebebus). Patikra: taip pratęsus vienus metus, skirtumas nuo tikslaus SEB skaičiavimo 0–7 €.`,
  kidShM: 'Mėnesiai', kidShW: 'Langai', kidShC: 'Skaičiavimai', kidShT: 'Scenarijai',
});
const kidAmt = (r, n) => { const x = r / 100; return Math.abs(x) < 1e-12 ? 1000 * n : 1000 * (Math.pow(1 + x, n + 1) - (1 + x)) / x; };
/* XIRR kaip PID: −1000 kiekvienų metų sausio 1 d. nuo 2000 m., gauta suma po n metų; dienos / 365 */
function kidXirr(r, n) {
  if (n <= 1) return r;
  const A = kidAmt(r, n), d = k => (Date.UTC(2000 + k, 0, 1) - Date.UTC(2000, 0, 1)) / 864e5;
  const npv = x => { let v = A / Math.pow(1 + x, d(n) / 365); for (let k = 0; k < n; k++) v -= 1000 / Math.pow(1 + x, d(k) / 365); return v; };
  let lo = -0.99, hi = 1;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (npv(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2 * 100;
}
const kidKey = f => `${f.pl}|${f.p}|${f.n}`;
const kidYm = s => { const [y, m] = s.split('-').map(Number); return y * 12 + m - 1; };
const kidYs = i => `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`;
const KS = { f: '', o: {} };                 // pasirinktas fondas ir pakeisti parametrai (tik šiai naršyklei)
try { Object.assign(KS, JSON.parse(localStorage.getItem('kidstate')) || {}); } catch (e) {}
const kidSave = () => { try { localStorage.setItem('kidstate', JSON.stringify(KS)); } catch (e) {} };

/* pakaitinio indekso mėnesių eilutė [pirmas mėnuo, lygiai]; akcijų dalis ≥ 99,9 % – tik akcijos */
function kidLevels(eq, bench) {
  const X = bench && REP.kidm.x && REP.kidm.x[bench];
  if (X) { const s = kidYm(X.s0); return { s, end: s + X.v.length - 1, L: X.v, onlyE: true, bench }; }
  const K = REP.kidm, e0 = kidYm(K.e0), w = eq / 100, onlyE = w >= 0.999 || !K.b;
  const b0 = onlyE ? e0 : kidYm(K.b0), s = Math.max(e0, b0), end = Math.min(e0 + K.e.length, onlyE ? Infinity : b0 + K.b.length) - 1;
  const E = i => K.e[i - e0], B = i => K.b[i - b0], L = [100];
  for (let i = s + 1; i <= end; i++) L.push(L[L.length - 1] * (1 + w * (E(i) / E(i - 1) - 1) + (onlyE ? 0 : (1 - w) * (B(i) / B(i - 1) - 1))));
  return { s, end, L, onlyE };
}
const kidStd = a => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); };   // populiacijos

/* p = {eq, rhp, cost, from, to, bench, own, tl, sm, momDrop, w12} (from/to – mėnesių numeriai: pirmas ir paskutinis stebėjimo mėnuo).
   tl / sm – nepalankaus scenarijaus trumpesnių langų ir stresinio scenarijaus taisyklė: 'seb' (kaip SEB PID faile) arba 'reg' (pagal reglamentą);
   own – fondo vieneto vertės (jau po išlaidų), o lyginamasis indeksas (minus išlaidos) tik mėnesiams, kurių fondas neturi (IV priedo 12 p.). */
function kidCalc(p) {
  const { s, end: e0, L, onlyE, bench } = kidLevels(p.eq, p.bench), base = p.from - 1, N = p.to - base;
  const FX = p.own && REP.kidm.f && REP.kidm.f[p.fund], f0 = FX ? kidYm(FX.s0) : 0, fv = ym => FX ? FX.v[ym - f0] : undefined;
  const end = FX ? Math.max(e0, f0 + FX.v.length - 1) : e0;   // su fondo vertėmis – ir mėnesiai po indekso pabaigos
  if (base < s || p.to > end || N < 12 * p.rhp + 12) return { err: `${kidYs(s + 1)} – ${kidYs(end)}`, s, end };
  const Fv = [];
  for (let i = 0; i <= N; i++) Fv.push(fv(base + i) ?? null);
  for (let i = 1; i <= N; i++) if (base + i > e0 && (Fv[i] == null || Fv[i - 1] == null)) return { err: `${kidYs(s + 1)} – ${kidYs(e0)}`, s, end: e0 };
  const c = p.cost / 100, L0 = L[base - s], Ln = Array.from({ length: N + 1 }, (_, i) => base + i <= e0 ? L[base - s + i] / L0 * 100 : null), px = [100], own = [0];
  for (let i = 1; i <= N; i++) {
    const o = Fv[i] != null && Fv[i - 1] != null;   // abu mėnesiai turi fondo vertę – fondo grąža (išlaidos jau atskaitytos)
    own.push(o ? 1 : 0);
    px.push(o ? px[i - 1] * Fv[i] / Fv[i - 1] : px[i - 1] * (Ln[i] / Ln[i - 1] - c / 12));   // kaip SEB: iš indekso mėnesio grąžos atimama c / 12
  }
  const r = px.slice(1).map((v, i) => Math.log(v / px[i])), rr = r.slice(-60), mr = rr.slice(0, rr.length - (p.momDrop || 0)), m = mr.reduce((x, y) => x + y, 0) / mr.length;   // momDrop – SEB 50+ 2026 faile momentai iš 48 mėn.
  const M2 = mr.reduce((x, y) => x + (y - m) ** 2, 0) / mr.length, mu1 = mr.reduce((x, y) => x + (y - m) ** 3, 0) / mr.length / M2 ** 1.5,
    mu2 = mr.reduce((x, y) => x + (y - m) ** 4, 0) / mr.length / M2 ** 2 - 3;
  const mid = Math.floor(p.rhp / 2 + 0.5), ns = [...new Set([1, mid, p.rhp])], per = {}, regT = p.tl === 'reg', regS = p.sm === 'reg';
  for (const n of ns) {
    const g = (a, b) => Math.pow(px[b] / px[a], 1 / n) - 1, wins = [], tail = [];
    const ws = [];   // lango pradžia; w12 – SEB 50+ 2026 faile RHP lapo eilutės nuo w12 skaičiuoja tik paskutinių 12 mėn. grąžą (jų klaida)
    for (let a = 0; a + 12 * n <= N; a++) { ws.push(p.w12 && n === p.rhp && a >= p.w12 ? a + 12 * n - 12 : a); wins.push(g(ws[a], a + 12 * n)); }
    // langai iki pabaigos: SEB – 12 … 12n+1 mėn. (ir 1 metams); reglamentas (IV priedo 7(b), Q&A VI.8) – 12 … 12n−1 mėn., tik kai n > 1.
    // Trumpesnio lango rezultatas laikomas viso laikotarpio rezultatu (tiesinė transformacija, Q&A VI.9) – abiem atvejais.
    const t0 = regT ? N - 12 * n + 1 : Math.max(0, N - 12 * n - 1);
    if (!regT || n > 1) for (let a = t0; a <= N - 12; a++) tail.push(g(a, N));
    const srt = [...wins].sort((x, y) => x - y), h = srt.length >> 1, med = srt.length % 2 ? srt[h] : (srt[h - 1] + srt[h]) / 2;
    const unf = Math.min(srt[0], ...tail), w = regS && n === 1 ? 6 : 12, q = n === 1 ? 0.99 : 0.95, vols = [];   // 18(a): mėnesiniams duomenims 1 metams w = 6, ilgesniems 12
    for (let i = 0; i + w <= rr.length; i++) vols.push(kidStd(rr.slice(i, i + w)));
    vols.sort((x, y) => x - y);
    const k = q * (vols.length - 1), k0 = Math.floor(k), sig = vols[k0] + ((vols[Math.min(k0 + 1, vols.length - 1)]) - vols[k0]) * (k - k0),   // Excel PERCENTILE
      NN = 12 * n, z = n === 1 ? -2.326347874 : -1.644853627;
    const cf = z + (z * z - 1) / 6 * mu1 / Math.sqrt(NN) + (z ** 3 - 3 * z) / 24 * mu2 / NN - (2 * z ** 3 - 5 * z) / 36 * mu1 ** 2 / NN;
    const st0 = Math.pow(Math.exp(sig * Math.sqrt(NN) * cf - 0.5 * (regS ? sig * sig : M2) * NN), 1 / n) - 1;   // SEB: 0,5·σ²·N su bendru 60 mėn. σ; reglamentas (19 p.): 0,5·σS²·N
    per[n] = { ret: [Math.min(st0, unf), unf, med, srt[srt.length - 1]].map(v => v * 100), nw: wins.length, ws, nt: tail.length, t0, w, q, k, sig, z, cf, st0 };
  }
  return { ns: [1, mid, p.rhp], per, N, base, px, r, m, M2, mu1, mu2, L: Ln, onlyE, bench, own, Fv, nOwn: own.reduce((x, y) => x + y, 0) };
}

/* Tik SEB III pakopos fondai su PID (savininko sprendimas 2026-10-16), nepriklausomai nuo puslapio valdytojo pasirinkimo */
function kidFunds() {
  return REP.funds.filter(f => f.p === 'SEB' && f.pl === 'III' && f.kid && f.kid.off).sort((a, b) => ORDER3.indexOf(a.g) - ORDER3.indexOf(b.g) || a.n.localeCompare(b.n));
}
function kidDefaults(f) {
  const k = f.kid, to = k.to ? kidYm(k.to.slice(0, 7)) : kidYm(`${new Date().getFullYear() - 1}-12`);
  return { rhp: k.rhp, eq: k.eq, cost: k.cost ?? 0.5, to, from: to - 12 * Math.max(k.rhp + 5, 10) + 1, mode: 'reg', data: f.kid.ownDef ? 'own' : 'idx' };   // fondo istorija pagal nutylėjimą – tik kai žinoma strategijos pradžia (own_from)
}
/* Skaičiavimo parametrai pagal režimą: 'seb' – atkartoja SEB PID Excel failą (su jo klaidomis), 'reg' – pagal reglamentą */
function kidParams(f, o, ov = {}) {
  const d = kidDefaults(f), p = { ...d, ...o, ...ov, eq: d.eq, fund: f.n }, X = REP.kidm.x || {}, k = f.kid;
  const pid = p.from === d.from && p.to === d.to && p.rhp === d.rhp;   // SEB failo klaidos – tik PID laikotarpiui
  p.old = p.mode === 'seb' ? (k.old || []).find(x => kidYm(x.from.slice(0, 7)) === p.from && kidYm(x.to.slice(0, 7)) === p.to && X[x.bench]) : null;
  if (p.old) { p.bench = p.old.bench; if (!('cost' in o)) p.cost = p.old.cost; }
  else p.bench = X[k.bench] ? k.bench : null;
  const alt = (k.alt || []).find(x => X[x.bench]);
  if (p.mode === 'seb') Object.assign(p, { tl: 'seb', sm: 'seb', own: false, momDrop: !p.old && pid ? k.momDrop || 0 : 0, w12: !p.old && pid ? k.w12 || 0 : 0 });
  else Object.assign(p, { tl: 'reg', sm: 'reg', own: p.data === 'own', momDrop: 0, w12: 0, bench: alt ? alt.bench : p.bench, alt });
  Object.assign(p, ov);
  if (!('to' in o) && !('to' in ov)) {   // numatytasis laikotarpis – paskutiniai pilni metai, kuriuos duomenys apima (naujų metų indeksas gali vėluoti)
    const ex = REP.kidm.x[p.bench], FX = p.own && REP.kidm.f && REP.kidm.f[p.fund];
    let e = ex ? kidYm(ex.s0) + ex.v.length - 1 : d.to;
    if (FX) e = Math.max(e, kidYm(FX.s0) + FX.v.length - 1);
    const to = Math.min(kidYm(`${new Date().getFullYear() - 1}-12`), e - (e % 12 === 11 ? 0 : e % 12 + 1));
    if (to !== p.to) { p.to = to; if (!('from' in o)) p.from = to - 12 * Math.max(p.rhp + 5, 10) + 1; }
  }
  return p;
}
/* Žingsnis po žingsnio nuo SEB PID skaičiavimo iki skaičiavimo pagal reglamentą (kiekvieno skirtumo įtaka) */
function kidSteps(f, o) {
  const S = T(), b = kidParams(f, o, { mode: 'seb' }), X = REP.kidm.x || {}, alt = (f.kid.alt || []).find(x => X[x.bench]), out = [];
  const add = (id, q) => { const R = kidCalc(q); if (!R.err) out.push({ id, t: S.kidStep[id], R, q }); };
  if (b.old) return out;
  add('seb', b);
  let q = b;
  if (b.momDrop || b.w12) add('err', q = { ...q, momDrop: 0, w12: 0 });
  add('tl', q = { ...q, momDrop: 0, w12: 0, tl: 'reg' });
  add('sm', q = { ...q, sm: 'reg' });
  if (alt) add('ser', q = { ...q, bench: alt.bench });
  add('own', q = { ...q, own: true });
  return out;
}

/* PID formato lentelė: rows = 4 scenarijai × [suma, grąža]; ys – laikotarpių metai */
function kidTableHtml(ys, ret, amt, fmtR, fmtA) {
  const S = T();
  const head = `<thead><tr><th class="l" colspan="2">${S.kidInv}</th>${ys.map((n, i) => `<th>${S.kidYr(n)}${i === 2 ? `<br><small>${S.kidRec}</small>` : ''}</th>`).join('')}</tr>`
    + `<tr><th class="l" colspan="2">${S.kidScH}</th><th></th><th></th><th></th></tr></thead>`;
  let b = '';
  S.kidSc.forEach((sc, j) => {
    b += `<tr class="kt"><th class="l" rowspan="2">${sc}</th><td class="l">${S.kidGet}</td>${ys.map((_, i) => `<td>${fmtA(amt[i][j])}</td>`).join('')}</tr>`
      + `<tr><td class="l">${S.kidRet}</td>${ys.map((_, i) => `<td>${fmtR(ret[i][j])}</td>`).join('')}</tr>`;
  });
  b += `<tr class="kt"><th class="l" colspan="2">${S.kidPaid}</th>${ys.map(n => `<td>${num(1000 * n, 0)} EUR</td>`).join('')}</tr>`;
  return head + `<tbody>${b}</tbody>`;
}
const kidEur = v => `${num(v, 2)} EUR`, kidPct = v => `${num(v, 2)}%`;

function renderKid() {
  const S = T(), fs = kidFunds(), box = document.getElementById('kidBox');
  document.getElementById('kidTitle').innerHTML = `${S.kidTitle} ${ik('kid')} ${xbtn('kid')}`;
  document.getElementById('kidLead').textContent = S.kidLead;
  MODELS.kid = null;
  if (!fs.length || !REP.kidm) { box.innerHTML = ''; return; }
  const f = fs.find(x => kidKey(x) === KS.f) || fs[0], fk = kidKey(f), d = kidDefaults(f), o = KS.o[fk] || {}, p = kidParams(f, o);
  const opts = fs.map(x => `<option value="${kidKey(x)}"${x === f ? ' selected' : ''}>${shortName(x)}</option>`).join('');
  const sel = (id, v, list) => `<select id="${id}">${list.map(([k, t]) => `<option value="${k}"${k === v ? ' selected' : ''}>${t}</option>`).join('')}</select>`;
  const inp = (k, v, a) => `<input type="number" data-k="${k}" value="${v}" ${a}>`, mon = (k, v) => `<input type="month" data-k="${k}" value="${kidYs(v)}">`;
  let html = `<div class="controls kidc">${field(S.kidFund, `<select id="kidF">${opts}</select>`)}${field(S.kidMode, sel('kidM', p.mode, [['reg', S.kidModeReg], ['seb', S.kidModeSeb]]))}`
    + `${p.mode === 'reg' ? field(S.kidData, sel('kidD', p.data, [['own', S.kidDataOwn], ['idx', S.kidDataIdx]])) : ''}`
    + `${field(S.kidRhpY, inp('rhp', p.rhp, 'min="1" max="25" step="1" style="width:5em"'))}${field(S.kidCost, inp('cost', p.cost, 'min="0" max="5" step="0.01" style="width:6em"'))}`
    + `${field(S.kidFrom, mon('from', p.from))}${field(S.kidTo, mon('to', p.to))}<button class="btn" type="button" id="kidReset"${Object.keys(o).length ? '' : ' disabled'}>${S.kidReset}</button></div>`;
  html += `<p class="note">${p.mode === 'seb' ? S.kidModeSebNote : S.kidModeRegNote}</p>`;
  const R = kidCalc(p);
  if (R.err) html += `<p class="note late">${S.kidShort}${R.err}.</p>`;
  else {
    const ys = R.ns, rr = ys.map(n => R.per[n].ret), amt = ys.map((n, i) => rr[i].map(v => kidAmt(v, n))), ret = ys.map((n, i) => rr[i].map(v => kidXirr(v, n)));
    html += `<p class="kidi">${S.kidIntro(kidYs(p.from) + '-01', isoEnd(p.to))}</p><h3 class="kidh">${S.kidOurs}: ${f.n} – ${p.mode === 'seb' ? S.kidModeSeb : S.kidModeReg}</h3>`
      + `<div class="scroll"><table class="rt kidp">${kidTableHtml(ys, ret, amt, kidPct, kidEur)}</table></div>`;
    if (p.own) html += `<p class="note">${R.nOwn ? S.kidOwnUsed(R.nOwn, R.N, kidYs(R.base + R.own.indexOf(1))) : S.kidOwnNone}</p>`;
    const off = p.old || f.kid.off;
    if (off) {
      const ov = off.s, oa = off.a;
      html += `<h3 class="kidh">${S.kidPid(off.doc)}</h3><p class="kidi">${S.kidIntro(off.from, off.to)}</p>`
        + `<div class="scroll"><table class="rt kidp">${kidTableHtml(off.years, ov, oa, kidPct, kidEur)}</table></div>`;
      if (off.years.every((n, i) => n === ys[i]) && kidYm(off.from.slice(0, 7)) === p.from && kidYm(off.to.slice(0, 7)) === p.to)
        html += `<h3 class="kidh">${S.kidDiff}</h3><div class="scroll"><table class="rt kidp">${kidTableHtml(ys, ret.map((r, i) => r.map((v, j) => v - ov[i][j])), amt.map((r, i) => r.map((v, j) => v - oa[i][j])), v => pp(v), v => `${pp(v)} EUR`)}</table></div><p class="note">${S.kidDiffNote}</p>`;
    }
    const st = kidSteps(f, o);
    if (st.length > 1) {
      const A = x => S.kidSc.map((_, j) => kidAmt(x.R.per[p.rhp].ret[j], p.rhp));
      let tb = `<thead><tr><th class="l">${S.kidStepH}</th>${S.kidSc.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>`;
      st.forEach((x, i) => {
        const a = A(x), pr = i ? A(st[i - 1]) : null;
        tb += `<tr${i === 0 || i === st.length - 1 ? ' class="kt"' : ''}><td class="l">${i}. ${x.t}</td>${a.map((v, j) => `<td>${num(v, 2)} EUR${pr ? `<br><small>${pp(v - pr[j])}</small>` : ''}</td>`).join('')}</tr>`;
      });
      html += `<h3 class="kidh">${S.kidStepT(p.rhp)}</h3><div class="scroll"><table class="rt kidp kids">${tb}</tbody></table></div><p class="note">${S.kidStepNote}</p>`;
      MODELS.kidSteps = st;
    } else MODELS.kidSteps = null;
    html += `<details class="kidx"><summary>${S.kidDiffsT}</summary>${S.kidDiffs.map(x => `<h4>${x.t}</h4>${x.seb ? `<p><b>SEB PID:</b> ${x.seb}</p>` : ''}<p><b>${S.kidModeReg}:</b> ${x.reg}</p>${x.why ? `<p class="note">${x.why}</p>` : ''}`).join('')}</details>`;
    MODELS.kid = { f, p, R, ret, rr, amt };
  }
  const ex = p.bench && REP.kidm.x[p.bench] && REP.kidm.x[p.bench].ext;
  html += `<p class="note">${ex && p.to >= kidYm(ex) && !(p.own && R.nOwn === R.N) ? S.kidExt(ex) + ' ' : ''}${S.kidPidSrc} ${S.kidBenchNote} ${p.alt && p.mode === 'reg' ? (lang === 'lt' ? p.alt.note_lt : p.alt.note_en) + ' ' : ''}${p.momDrop ? S.kidMomDrop(60 - p.momDrop) + ' ' : ''}${p.w12 ? S.kidW12(p.rhp, kidYs(p.from - 1 + p.w12), kidYs(p.to - 12 * p.rhp)) + ' ' : ''}${(f.kid.old || []).map(x => S.kidOld(x.doc, x.from.slice(0, 7), x.to.slice(0, 7), x.cost)).join(' ')}</p>`;
  box.innerHTML = html;
  const set = (k, v) => { const cur = { ...(KS.o[fk] || {}) }; if (v === d[k]) delete cur[k]; else cur[k] = v; KS.o[fk] = cur; kidSave(); renderKid(); };
  document.getElementById('kidF').onchange = e => { KS.f = e.target.value; kidSave(); renderKid(); };
  document.getElementById('kidM').onchange = e => set('mode', e.target.value);
  const kd = document.getElementById('kidD'); if (kd) kd.onchange = e => set('data', e.target.value);
  document.getElementById('kidReset').onclick = () => { delete KS.o[fk]; kidSave(); renderKid(); };
  box.querySelectorAll('input[data-k]').forEach(el => el.addEventListener('change', () => {
    const k = el.dataset.k, cur = { ...(KS.o[fk] || {}) };
    if (k === 'from' || k === 'to') { if (!el.value) return; cur[k] = kidYm(el.value); }
    else { const v = parseFloat(el.value); if (!isFinite(v)) return; cur[k] = k === 'rhp' ? Math.max(1, Math.round(v)) : v;
      if (k === 'rhp') cur.from = (cur.to ?? d.to) - 12 * Math.max(cur.rhp + 5, 10) + 1; }   // pakeitus RHP – stebėjimas RHP + 5 m.
    KS.o[fk] = cur; kidSave(); renderKid();
  }));
}
const isoEnd = i => { const y = Math.floor(i / 12), m = i % 12 + 1, last = new Date(Date.UTC(y, m, 0)).getUTCDate(); return `${y}-${String(m).padStart(2, '0')}-${last}`; };

/* Excel: visas skaičiavimas formulėmis */
function kidBook() {
  const X = MODELS.kid; if (!X) return null;
  const S = T(), { f, p, R } = X, MN = `'${S.kidShM}'`, WN = `'${S.kidShW}'`, CN = `'${S.kidShC}'`;
  const col = i => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
  const N = R.N, last = N + 2, P = (v, z = '0.0000%') => ({ t: 'n', v, z }), F = (f, v, z = '0.0000%') => ({ t: 'n', f, v, z });
  // Mėnesiai: eilutė 2 – bazinis mėnuo (diena prieš stebėjimo pradžią), 3… – stebėjimo mėnesiai
  const K = REP.kidm, e0 = kidYm(K.e0), b0 = K.b ? kidYm(K.b0) : 0;
  const mh = lang === 'lt' ? ['Mėnuo', 'MSCI ACWI EUR NR', 'Obligacijų indeksas (ECB 7 m. AAA)', 'Indeksas (bazė 100)', 'Mėn. nuo pradžios', 'Vertė atskaičius išlaidas', 'Mėnesio log grąža', 'Slenkantis nuokrypis 6 mėn.', 'Slenkantis nuokrypis 12 mėn.', 'Fondo vieneto vertė', 'Mėnesio grąžos šaltinis']
    : ['Month', 'MSCI ACWI EUR NR', 'Bond index (ECB 7Y AAA)', 'Index (base 100)', 'Months from start', 'Value after costs', 'Monthly log return', 'Rolling deviation 6 m', 'Rolling deviation 12 m', 'Fund unit value', 'Source of the monthly return'];
  const srcF = lang === 'lt' ? 'fondas (be papildomų išlaidų)' : 'fund (no extra costs)', srcI = lang === 'lt' ? 'indeksas − išlaidos/12' : 'index − costs/12';
  if (R.bench) mh[1] = (lang === 'lt' ? 'Valdytojo KID indeksas: ' : 'Manager’s KID index: ') + R.bench;
  const M = [mh];
  for (let i = 0; i <= N; i++) {
    const ym = R.base + i, rw = i + 2, e = R.bench ? REP.kidm.x[R.bench].v[ym - kidYm(REP.kidm.x[R.bench].s0)] : K.e[ym - e0], b = R.onlyE ? null : K.b[ym - b0];
    const lvl = i && R.L[i] == null ? null : i ? F(R.onlyE ? `D${rw - 1}*(B${rw}/B${rw - 1})` : `D${rw - 1}*(1+${CN}!$B$4*(B${rw}/B${rw - 1}-1)+(1-${CN}!$B$4)*(C${rw}/C${rw - 1}-1))`, R.L[i], '0.0000') : P(100, '0.0000');
    const fx = p.own ? `IF(AND(ISNUMBER(J${rw}),ISNUMBER(J${rw - 1})),F${rw - 1}*J${rw}/J${rw - 1},F${rw - 1}*(D${rw}/D${rw - 1}-${CN}!$B$5/12))` : `F${rw - 1}*(D${rw}/D${rw - 1}-${CN}!$B$5/12)`;
    M.push([kidYs(ym), e, b, lvl, i, (i ? F(fx, R.px[i], '0.0000') : P(100, '0.0000')),
      i ? F(`LN(F${rw}/F${rw - 1})`, R.r[i - 1], '0.000000') : null,
      i >= 6 ? F(`STDEVP(G${rw - 5}:G${rw})`, kidStd(R.r.slice(i - 6, i)), '0.000000') : null,
      i >= 12 ? F(`STDEVP(G${rw - 11}:G${rw})`, kidStd(R.r.slice(i - 12, i)), '0.000000') : null,
      p.own && R.Fv[i] != null ? P(R.Fv[i], '0.0000') : null, i ? (R.own[i] ? srcF : srcI) : null]);
  }
  // Langai: kiekvienam laikotarpiui – pradžia, pabaiga, metinė grąža; ir langai iki laikotarpio pabaigos (12 … 12n+1 mėn.)
  const W = [[]], WH = [[]], ref = {};
  let c = 0;
  R.ns.forEach((n, j) => {
    if (j === 2 && n === R.ns[1]) { ref[j] = ref[1]; return; }
    const pr = R.per[n], gc = col(c + 2), base = c;
    WH[0][c] = `${S.kidYr(n)}: ${lang === 'lt' ? 'pradžia' : 'start'}`; WH[0][c + 1] = lang === 'lt' ? 'pabaiga' : 'end'; WH[0][c + 2] = lang === 'lt' ? 'metinė grąža' : 'annual return';
    for (let a = 0; a < pr.nw; a++) {
      W[a + 1] = W[a + 1] || [];
      W[a + 1][c] = kidYs(R.base + a); W[a + 1][c + 1] = kidYs(R.base + a + 12 * n);
      W[a + 1][c + 2] = F(`(${MN}!F${a + 12 * n + 2}/${MN}!F${pr.ws[a] + 2})^(1/${n})-1`, Math.pow(R.px[a + 12 * n] / R.px[pr.ws[a]], 1 / n) - 1);
    }
    ref[j] = { w: `${WN}!${gc}2:${gc}${pr.nw + 1}` };
    c += 3;
    if (pr.nt) {
      const tc = col(c + 1), a0 = pr.t0;
      WH[0][c] = `${S.kidYr(n)}: ${lang === 'lt' ? 'langai iki pabaigos – pradžia' : 'windows to the end – start'}`; WH[0][c + 1] = lang === 'lt' ? 'metinė grąža' : 'annual return';
      for (let a = a0, k = 0; a <= N - 12; a++, k++) {
        W[k + 1] = W[k + 1] || [];
        W[k + 1][c] = kidYs(R.base + a);
        W[k + 1][c + 1] = F(`(${MN}!F${last}/${MN}!F${a + 2})^(1/${n})-1`, Math.pow(R.px[N] / R.px[a], 1 / n) - 1);
      }
      ref[j].t = `${WN}!${tc}2:${tc}${pr.nt + 1}`;
      c += 2;
    }
    c++; void base;
  });
  const Wrows = [WH[0], ...W.slice(1)].map(r => Array.from({ length: c }, (_, i) => r[i] ?? null));
  // Skaičiavimai
  const reg = p.mode === 'reg', g0 = Math.max(3, last - 59), G = `${MN}!G${g0}:G${last - (p.momDrop || 0)}`, L = lang === 'lt';
  const C = [[`${f.n} · ${S.kidTitle}`], [S.kidFund, f.n],
    [L ? 'Akcijų dalis' : 'Equity share', null], [L ? 'Akcijų dalis (koeficientas)' : 'Equity share (fraction)', P(p.eq / 100, '0.00%')],
    [L ? 'Išlaidos per metus' : 'Costs a year', P(p.cost / 100, '0.00%')], [L ? 'Laikymo laikotarpis (RHP), metai' : 'Holding period (RHP), years', p.rhp],
    [L ? 'Stebėjimo laikotarpis' : 'Observation period', `${kidYs(p.from)} – ${kidYs(p.to)}`],
    [L ? `Log grąžų vidurkis (${60 - (p.momDrop || 0)} mėn.)` : `Mean of monthly log returns (${60 - (p.momDrop || 0)} months)`, F(`AVERAGE(${G})`, R.m, '0.000000')],
    [L ? 'Dispersija (populiacijos)' : 'Variance (population)', F(`VARP(${G})`, R.M2, '0.00000000')],
    [L ? 'Asimetrija' : 'Skewness', F(`SUMPRODUCT((${G}-B8)^3)/COUNT(${G})/B9^1.5`, R.mu1, '0.0000')],
    [L ? 'Ekscesas' : 'Excess kurtosis', F(`SUMPRODUCT((${G}-B8)^4)/COUNT(${G})/B9^2-3`, R.mu2, '0.0000')], []];
  C[2] = [L ? 'Pakaitinis indeksas' : 'Proxy index', R.bench ? (L ? 'valdytojo KID indeksas: ' : 'manager’s KID index: ') + R.bench : R.onlyE ? 'MSCI ACWI EUR NR' : (L ? 'akcijų dalis × MSCI ACWI + likusi × obligacijų indeksas' : 'equity share × MSCI ACWI + rest × bond index')];
  const hdr = 13, cl = ['B', 'C', 'D'];
  const lab = L ? ['Laikotarpis, metai', 'Langų skaičius', 'Nuosaikus (mediana)', 'Palankus (didžiausias)', 'Mažiausias n metų langas', 'Mažiausias langas iki pabaigos', 'Nepalankus', 'Nuokrypio langas, mėn.', 'Procentilis', 'Nuokrypių skaičius (paskutiniai 60 mėn.)', 'Nuokrypis σs (PERCENTILE)', 'Mėnesių skaičius N', 'z', 'Cornish-Fisher', 'Stresinis (prieš ribą)', 'Nepalankiausias (stresinis)']
    : ['Period, years', 'Number of windows', 'Moderate (median)', 'Favourable (maximum)', 'Smallest n-year window', 'Smallest window to the end', 'Unfavourable', 'Deviation window, months', 'Percentile', 'Number of deviations (last 60 months)', 'Deviation σs (PERCENTILE)', 'Number of months N', 'z', 'Cornish-Fisher', 'Stress (before cap)', 'Stress'];
  const rows = lab.map(l => [l, null, null, null]);
  R.ns.forEach((n, j) => {
    const pr = R.per[n], x = cl[j], rr = ref[j], rn = k => `${x}${hdr + k}`, H = rr.w.split('!')[1].split(':'), hc = pr.w === 6 ? 'H' : 'I';
    rows[0][j + 1] = n;
    rows[1][j + 1] = F(`COUNT(${rr.w})`, pr.nw, '0');
    rows[2][j + 1] = F(`MEDIAN(${rr.w})`, pr.ret[2] / 100);
    rows[3][j + 1] = F(`MAX(${rr.w})`, pr.ret[3] / 100);
    const minW = Math.min(...Array.from({ length: pr.nw }, (_, a) => Math.pow(R.px[a + 12 * n] / R.px[pr.ws[a]], 1 / n) - 1));
    rows[4][j + 1] = F(`MIN(${rr.w})`, minW);
    rows[5][j + 1] = rr.t ? F(`MIN(${rr.t})`, Math.min(...Array.from({ length: pr.nt }, (_, k) => Math.pow(R.px[N] / R.px[pr.t0 + k], 1 / n) - 1))) : null;
    rows[6][j + 1] = F(rr.t ? `MIN(${rn(4)},${rn(5)})` : rn(4), pr.ret[1] / 100);
    rows[7][j + 1] = pr.w; rows[8][j + 1] = P(pr.q, '0%');
    const vr = `${MN}!${hc}${Math.max(g0 + pr.w - 1, pr.w + 2)}:${hc}${last}`;
    rows[9][j + 1] = F(`COUNT(${vr})`, Math.min(R.r.length, 60) - pr.w + 1, '0');
    rows[10][j + 1] = F(`PERCENTILE(${vr},${rn(8)})`, pr.sig, '0.000000');
    rows[11][j + 1] = F(`12*${rn(0)}`, 12 * n, '0');
    rows[12][j + 1] = P(pr.z, '0.000000000');
    const z = rn(12), Nn = rn(11);
    rows[13][j + 1] = F(`${z}+(${z}^2-1)/6*$B$10/SQRT(${Nn})+(${z}^3-3*${z})/24*$B$11/${Nn}-(2*${z}^3-5*${z})/36*$B$10^2/${Nn}`, pr.cf, '0.000000');
    rows[14][j + 1] = F(`EXP(${rn(10)}*SQRT(${Nn})*${rn(13)}-0.5*${p.sm === 'reg' ? rn(10) + '^2' : '$B$9'}*${Nn})^(1/${rn(0)})-1`, pr.st0);   // reglamentas: σS²; SEB: 60 mėn. dispersija
    rows[15][j + 1] = F(`MIN(${rn(14)},${rn(6)})`, pr.ret[0] / 100);
    void H;
  });
  C.push(...rows);
  // Scenarijai – PID formato lentelė, langeliai – formulės į „Skaičiavimai“
  const scRow = [hdr + 15, hdr + 6, hdr + 2, hdr + 3], Tt = [[`${f.n} · ${S.kidTitle}`], [S.kidIntro(kidYs(p.from) + '-01', isoEnd(p.to))], [],
    [S.kidInv, '', ...R.ns.map((n, i) => S.kidYr(n) + (i === 2 ? ' ' + S.kidRec : ''))], [S.kidScH]];
  S.kidSc.forEach((sc, j) => {
    const rets = R.ns.map((n, i) => ({ c: `${CN}!${cl[i]}${scRow[j]}`, v: X.rr[i][j] / 100, n }));
    Tt.push([sc, S.kidGet, ...rets.map((x, i) => F(`IF(${x.c}=0,1000*${CN}!${cl[i]}${hdr},1000*((1+${x.c})^(${CN}!${cl[i]}${hdr}+1)-(1+${x.c}))/${x.c})`, X.amt[i][j], '#,##0.00 "EUR"'))]);
    Tt.push(['', S.kidRet, ...rets.map((x, i) => x.n > 1 ? P(X.ret[i][j] / 100, '0.00%') : F(x.c, x.v, '0.00%'))]);   // n > 1 – XIRR (reikšmė)
  });
  Tt.push([S.kidPaid, '', ...R.ns.map((n, i) => F(`1000*${CN}!${cl[i]}${hdr}`, 1000 * n, '#,##0 "EUR"'))], [], [reg ? S.kidModeRegNote : S.kidModeSebNote]);
  // Instrukcija: kas, kaip skaičiuota, kur tikrinti, kuo skiriasi režimai, žingsnių lentelė, PID palyginimas, šaltiniai
  const I = [[`${f.n} · ${S.kidTitle}`], [],
    [S.kidFund, f.n], [S.kidMode, reg ? S.kidModeReg : S.kidModeSeb], [S.kidData, p.own ? S.kidDataOwn : S.kidDataIdx + (R.bench ? ': ' + R.bench : '')],
    [L ? 'Stebėjimo laikotarpis' : 'Observation period', `${kidYs(p.from)} – ${kidYs(p.to)}`], [L ? 'Laikymo laikotarpis (RHP), metai' : 'Holding period (RHP), years', p.rhp],
    [L ? 'Išlaidos, % per metus (einamosios + sandorių)' : 'Costs, % a year (ongoing + transaction)', P(p.cost / 100, '0.0000%')],
    [L ? 'Failas sukurtas' : 'File created', new Date().toISOString().slice(0, 10)], [], [reg ? S.kidModeRegNote : S.kidModeSebNote], [],
    [L ? 'KAIP PATIKRINTI (lapai iš kairės į dešinę)' : 'HOW TO CHECK (sheets left to right)'],
    ...(L ? [
      ['1. „Scenarijai“ – PID formato lentelė. Sumos – formulės: 1000 € kiekvienų metų pradžioje, suma = Σ 1000 × (1 + r)^k, r – scenarijaus metinė grąža iš „Skaičiavimai“. Ilgesnių laikotarpių metinė vidutinė grąža – įmokų XIRR (vertė, kaip PID).'],
      ['2. „Skaičiavimai“ – B8:B11 momentai (vidurkis, dispersija, asimetrija, ekscesas) iš paskutinių 60 mėn. log grąžų; toliau kiekvienam laikotarpiui (stulpeliai B–D): langų skaičius, mediana (nuosaikus), didžiausias (palankus), mažiausias (nepalankus, su langais iki pabaigos), stresinio σS (PERCENTILE), Cornish-Fisher ir stresinis rezultatas.'],
      ['3. „Langai“ – visi n metų langai (pradžia, pabaiga, metinė grąža = (pabaigos vertė / pradžios vertė)^(1/n) − 1) ir langai, kurie baigiasi laikotarpio pabaigoje (nepalankiam scenarijui).'],
      ['4. „Mėnesiai“ – kiekvieno mėnesio indekso (ir fondo) vertė, vertė atskaičius išlaidas (F), mėnesio log grąža (G), slenkantys 6 ir 12 mėn. nuokrypiai (H, I). Pakeiskite išlaidas lape „Skaičiavimai“ B5 – viskas persiskaičiuos.'],
      ['5. Palyginkite su PID: žemiau – paskelbto PID reikšmės ir šio failo rezultatai.']] : [
      ['1. “Scenarios” – the KID-format table. Amounts are formulas: 1,000 € at the start of each year, amount = Σ 1000 × (1 + r)^k, r – the scenario annual return from “Calculation”. Average return each year for longer periods – XIRR of the payments (value, as in the KID).'],
      ['2. “Calculation” – B8:B11 moments (mean, variance, skewness, excess kurtosis) of the last 60 monthly log returns; then for each period (columns B–D): number of windows, median (moderate), maximum (favourable), minimum (unfavourable, incl. windows to the end), stress σS (PERCENTILE), Cornish-Fisher and the stress result.'],
      ['3. “Windows” – all n-year windows (start, end, annual return = (end value / start value)^(1/n) − 1) and windows ending at the period end (for the unfavourable scenario).'],
      ['4. “Months” – index (and fund) value of each month, value after costs (F), monthly log return (G), rolling 6- and 12-month deviations (H, I). Change the costs in “Calculation” B5 and everything recalculates.'],
      ['5. Compare with the KID: below – the published KID values and this file’s results.']]),
    [], [L ? 'KUO SKIRIASI „KAIP SEB PID“ IR „PAGAL REGLAMENTĄ“' : 'HOW “AS IN SEB’S KID” AND “BY THE REGULATION” DIFFER']];
  S.kidDiffs.forEach(x => { I.push([x.t]); if (x.seb) I.push(['   SEB PID: ' + x.seb]); I.push([`   ${S.kidModeReg}: ${x.reg}`]); if (x.why) I.push(['   ' + x.why]); });
  const st = MODELS.kidSteps;
  if (st && st.length > 1) {
    I.push([], [S.kidStepT(p.rhp).toUpperCase()], [S.kidStepH, ...S.kidSc]);
    st.forEach((x, i) => I.push([`${i}. ${x.t}`, ...S.kidSc.map((_, j) => P(kidAmt(x.R.per[p.rhp].ret[j], p.rhp), '#,##0.00 "EUR"'))]));
    I.push([S.kidStepNote]);
  }
  const off = p.old || f.kid.off;
  if (off && off.years.every((n, i) => n === R.ns[i]) && kidYm(off.from.slice(0, 7)) === p.from && kidYm(off.to.slice(0, 7)) === p.to) {
    I.push([], [(L ? 'PALYGINIMAS SU PID: ' : 'COMPARISON WITH THE KID: ') + off.doc], [L ? 'Scenarijus / laikotarpis' : 'Scenario / period', L ? 'PID suma' : 'KID amount', L ? 'Šis failas' : 'This file', L ? 'Skirtumas' : 'Difference']);
    S.kidSc.forEach((sc, j) => off.years.forEach((n, i) => I.push([`${sc}, ${S.kidYr(n)}`, P(off.a[i][j], '#,##0.00'), P(X.amt[i][j], '#,##0.00'), P(X.amt[i][j] - off.a[i][j], '+#,##0.00;-#,##0.00;0.00')])));
  }
  I.push([], [L ? 'ŠALTINIAI' : 'SOURCES'],
    ['Reglamentas (ES) 2017/653 su 2021/2268 pakeitimais, IV priedas (konsoliduota redakcija): https://eur-lex.europa.eu/legal-content/LT/TXT/?uri=CELEX:02017R0653-20230101'],
    ['ESAs Q&A (JC 2023 22), skyrius „Performance scenarios“: https://www.esma.europa.eu/sites/default/files/2023-05/JC_2023_22_-_Consolidated_JC_PRIIPs_Q_As.pdf'],
    [L ? 'SEB PID ir SEB Excel skaičiavimo failai (gauti iš savininko); indekso duomenys – SEB; SOLEBLS EUR – Bloomberg.' : 'SEB KIDs and SEB Excel calculation files (from the owner); index data – SEB; SOLEBLS EUR – Bloomberg.']);
  const wb = XLSX.utils.book_new(), add = (aoa, name, cols) => { const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = cols; XLSX.utils.book_append_sheet(wb, ws, name); };
  add(I, S.kidShI, [{ wch: 70 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }]);
  add(Tt, S.kidShT, [{ wch: 28 }, { wch: 38 }, { wch: 16 }, { wch: 16 }, { wch: 22 }]);
  add(C, S.kidShC, [{ wch: 44 }, { wch: 16 }, { wch: 16 }, { wch: 16 }]);
  add(Wrows, S.kidShW, Array(c).fill({ wch: 12 }));
  add(M, S.kidShM, [{ wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }]);
  return { wb, file: `${f.n.replace(/[^\p{L}\p{N}.-]+/gu, '_')}_KID.xlsx` };
}
