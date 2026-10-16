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
  kidShI: 'Instructions', kidShE: 'Evidence', kidShP: 'Comparison',
  kidRegL: 'Regulation (EU) 2017/653 on EUR-Lex (Lithuanian; amendments of 2021/2268 are in the consolidated version)',
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
  kidShI: 'Instrukcija', kidShE: 'Įrodymai', kidShP: 'Palyginimas',
  kidRegL: 'Reglamentas (ES) 2017/653 EUR-Lex svetainėje (lietuviškai; 2021/2268 pakeitimai – konsoliduotoje redakcijoje)',
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
  html += `<p class="note">${p.mode === 'seb' ? S.kidModeSebNote : S.kidModeRegNote}</p><p class="kidi"><a href="${KID_REG}" target="_blank" rel="noopener">${S.kidRegL}</a> · <a href="${KID_REGC}" target="_blank" rel="noopener">${lang === 'lt' ? 'konsoliduota redakcija' : 'consolidated version'}</a></p>`;
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

const KID_REG = 'https://eur-lex.europa.eu/eli/reg_del/2017/653/oj/lit', KID_REGC = 'https://eur-lex.europa.eu/legal-content/LT/TXT/?uri=CELEX:02017R0653-20230101',
  KID_QA = 'https://www.esma.europa.eu/sites/default/files/2023-05/JC_2023_22_-_Consolidated_JC_PRIIPs_Q_As.pdf';
/* Įrodymų lentelė Excel'iui: kiekvienas skaičiavimo žingsnis – reglamento reikalavimas (oficiali EN citata, OL puslapis),
   ką daro SEB skaičiavimo failas (langelis, formulė), ar atitinka, kur tai šiame faile ir kiek keičia rezultatą.
   OL puslapiai nustatyti iš oficialių PDF teksto sluoksnio (EUR-Lex), Q&A – spausdinti puslapiai. */
function kidEvidence(f, L) {
  const k = f.kid, t = (a, b) => L ? a : b, Y = t('Taip', 'Yes'), No = t('Ne', 'No');
  const D = '2021/2268, ' + t('IV priedas', 'Annex IV') + ', ', O = t('OL L 455 I, ', 'OJ L 455 I, '), Q = 'ESAs Q&A JC 2023 22, ';
  const ev = [
    { t: t('Stebėjimo laikotarpis', 'Observation period'), q: '"…shall be calculated over a time period which is equal to the recommended holding period plus five years" (6); "it is greater than 10" (5(a))',
      s: D + t('5 ir 6 p.; ', 'points 5 and 6; ') + O + '17–18',
      m: t('RHP iki 5 m. – paskutiniai 10 m.; ilgesniam RHP – RHP + 5 m.; laikotarpis baigiasi skaičiavimo dieną (PID – gruodžio 31 d.).', 'RHP up to 5 years – the last 10 years; longer RHP – RHP + 5 years, ending at the calculation date (KID – 31 December).'),
      e: t('Stebėjimo laikotarpis RHP + 5 m., baigiasi gruodžio 31 d.', 'Observation period RHP + 5 years ending 31 December.'), ok: Y,
      w: t('Instrukcija: stebėjimo laikotarpis; Mėnesiai: A stulpelis', 'Instructions: observation period; Months: column A') },
    { t: t('Mėnesiniai duomenys', 'Monthly data'), q: '"The scenarios shall be calculated at least on a monthly basis." (11)',
      s: D + t('7(a) ir 11 p.; ', 'points 7(a) and 11; ') + O + '18; ' + Q + 'VI Q21, p. 43',
      m: t('Naudojamos mėnesių pabaigų vertės.', 'Month-end values are used.'), e: t('Mėnesių pabaigų vertės.', 'Month-end values.'), ok: Y,
      w: t('Mėnesiai: A–F stulpeliai', 'Months: columns A–F') },
    { t: t('Fondo istorija ar lyginamasis indeksas', 'Fund history or benchmark'), step: 'own',
      q: '"(i) based on the performance of the PRIIP during the exact duration of each sub interval;" (7(c)(i)); "…using data of a benchmark to supplement the values for the PRIIP less all applicable costs" (12); "In the case described only the historical data of the PRIIP should be used." (Q&A VI Q12)',
      s: D + '7(c)(i) ' + t('ir 12 p.; ', 'and point 12; ') + O + '18–19; ' + Q + 'VI Q11 p. 40, VI Q12 p. 41',
      m: t('Rezultatas skaičiuojamas iš paties fondo (PRIIP) vertės. Lyginamasis indeksas (minus išlaidos) tik papildo laikotarpį, kai fondo dar nebuvo.', 'Performance is the PRIIP’s own. A benchmark (less costs) only supplements the period before the fund existed.'),
      e: t('Lapas „Grąžos“: visam 10–16 m. laikotarpiui – SEB sudėtinis lyginamasis indeksas minus išlaidos/12, nors fondas tuo metu jau veikė (vieneto vertės skelbiamos).', 'Sheet “Grąžos”: the whole 10–16-year period uses SEB’s composite benchmark less costs/12, although the fund already existed (unit values are published).'),
      ok: No, w: t('Mėnesiai: J (fondo vieneto vertė), K (grąžos šaltinis), F (formulė: fondo grąža, kai yra, kitaip indeksas − išlaidos/12)', 'Months: J (fund unit value), K (source), F (formula: fund return where available, else index − costs/12)') },
    ...(k.alt && k.alt.length ? [{ t: t('SEB indekso duomenų klaida (SOLEBLS)', 'SEB index data error (SOLEBLS)'), step: 'ser',
      q: '"(i) based on the performance of the PRIIP during the exact duration of each sub interval;" (7(c)(i))', s: D + '7(c)(i) p.; ' + O + '18',
      m: t('Duomenys turi atspindėti tikrą rezultatą. Dirbtinis indekso šuolis jo neatspindi.', 'Data must reflect real performance; an artificial jump does not.'),
      e: t('„Grąžos“!K70 =VLOOKUP(A70,[1]Sheet1!$A:$K,11,0) = 335,28, K71 (2015-01) = 635,64; L71 = +89,58 % per mėnesį; portfelio mėnesio grąža P71 = 9,60 %. Vertės iki 2015 m. ~0,58 karto mažesnės už SOLEBLS EUR (Bloomberg) – kitokia valiuta ar indekso versija.', '“Grąžos”!K70 =VLOOKUP(A70,[1]Sheet1!$A:$K,11,0) = 335.28, K71 (2015-01) = 635.64; L71 = +89.58 % in a month; portfolio monthly return P71 = 9.60 %. Values before 2015 are ~0.58× SOLEBLS EUR (Bloomberg) – a different currency or index version.'),
      ok: No, w: t('Mėnesiai: B stulpelis (pataisyta eilutė, režimas „Pagal reglamentą“, duomenys – indeksas)', 'Months: column B (corrected series, mode “By the regulation”, data – index)') }] : []),
    { t: t('Išlaidos', 'Costs'), q: '"(ii) net of all applicable costs;" (7(c)(ii)); "…shall be calculated as net of all applicable costs in accordance with Annex VI" (39)',
      s: D + t('7(c)(ii) ir 39 p.; ', '7(c)(ii) and point 39; ') + O + '18, 24',
      m: t('Rezultatai – atskaičius visas išlaidas.', 'Results are net of all costs.'), e: t('Kas mėnesį atimama išlaidos/12: vertė × (indeksas_t / indeksas_t−1 − išlaidos/12).', 'Costs/12 subtracted each month: value × (index_t / index_t−1 − costs/12).'), ok: Y,
      w: t('Skaičiavimai: B5; Mėnesiai: F. Fondo vieneto vertės jau po išlaidų – papildomai neatimama.', 'Calculation: B5; Months: F. Fund unit values are already net – nothing more is subtracted.') },
    { t: t('Nuosaikus ir palankus scenarijai', 'Moderate and favourable'), q: '"rank the sub intervals identified in accordance with point (a) … to identify from within those sub intervals the median and best sub intervals" (7(d))',
      s: D + t('7(a), 7(d), 9, 10 p.; ', 'points 7(a), 7(d), 9, 10; ') + O + '18',
      m: t('Iš visų pilnų n metų langų: nuosaikus – mediana, palankus – geriausias.', 'Of all full n-year windows: moderate – median, favourable – best.'), e: t('Mediana ir didžiausia pilnų langų reikšmė.', 'Median and maximum of full windows.'), ok: Y,
      w: t('Langai; Skaičiavimai: 15–16 eil.', 'Windows; Calculation: rows 15–16') },
    { t: t('Nepalankus: trumpesni langai iki laikotarpio pabaigos', 'Unfavourable: shorter windows to the end'), step: 'tl',
      q: '"for PRIIPs with a recommended holding period of more than one year, identification of all overlapping sub intervals … individually equal or shorter in length to the duration of the recommended holding period, but equal to or longer than one year, … and which end at the end of the time period" (7(b)); "This means running from 4 years and 11 months to 1 year" (Q&A VI Q8)',
      s: D + '7(b), 7(e), 8 p.; ' + O + '18; ' + Q + 'VI Q8, p. 39',
      m: t('Tik kai RHP > 1 m.: pridedami langai nuo 12 mėn. iki RHP − 1 mėn., kurie baigiasi laikotarpio pabaigoje. 1 metų laikotarpiui – jokių.', 'Only when RHP > 1 year: windows of 12 months to RHP − 1 month ending at the period end. None for 1 year.'),
      e: t('„Scenarijų grąžos“ H3 =WORKDAY(EOMONTH(I3,-G3-1)+1,-1), G3 = Q3*12 → langai 12 … 12n+1 mėn. (ilgesni už RHP); 1 metų lape O3 =MIN(E:E,L3:L4) įtraukia ir 13 mėn. langą.', '“Scenarijų grąžos” H3 =WORKDAY(EOMONTH(I3,-G3-1)+1,-1), G3 = Q3*12 → windows of 12 … 12n+1 months (longer than RHP); the 1-year sheet O3 =MIN(E:E,L3:L4) also includes a 13-month window.'),
      ok: No, w: t('Langai: „langai iki pabaigos“; Skaičiavimai: 18–19 eil.', 'Windows: “windows to the end”; Calculation: rows 18–19') },
    { t: t('Linijinė transformacija', 'Linear transformation'), q: '"The linear transformation means that the performance over that shorter period … is taken to be also the performance over the recommended holding period" (Q&A VI Q9)',
      s: D + '7(c)(iv) p.; ' + O + '18; ' + Q + 'VI Q9, p. 40',
      m: t('Trumpesnio lango rezultatas laikomas viso laikotarpio rezultatu: (pabaiga / pradžia)^(1/n) − 1.', 'The shorter window’s outcome is taken as the full period’s outcome: (end / start)^(1/n) − 1.'), e: t('Taip pat.', 'The same.'), ok: Y,
      w: t('Langai: metinė grąža', 'Windows: annual return') },
    { t: t('Stresinis: nuokrypio langas w', 'Stress: deviation window w'), step: 'sm',
      q: '"identify a sub interval of length w which corresponds to the following intervals:" – table: Monthly prices: 1 year 6, > 1 year 12 (18(a))',
      s: D + '18(a) p. ' + t('ir lentelė; ', 'and table; ') + O + '20–21',
      m: t('Mėnesio duomenims: 1 metams w = 6 mėn., ilgesniems – 12 mėn.', 'Monthly data: w = 6 months for 1 year, 12 for longer.'),
      e: t('„Nepalankiausio grąžos (1,6,11)“ M3 =STDEV.P(C3:C14) – 12 mėn. langai visiems laikotarpiams, ir 1 metams.', '“Nepalankiausio grąžos (1,6,11)” M3 =STDEV.P(C3:C14) – 12-month windows for every period, also 1 year.'),
      ok: No, w: t('Mėnesiai: H (6 mėn.), I (12 mėn.); Skaičiavimai: 20 eil.', 'Months: H (6 m), I (12 m); Calculation: row 20'), note: t('įtaka – kartu su kita eilute', 'impact together with the next row') },
    { t: t('Stresinis: procentilis', 'Stress: percentile'), q: '"infer the value that corresponds to the 99th percentile for one year and the 95th percentile for the other holding periods; … that value shall be the stressed volatility" (18(d))',
      s: D + '18(c), 18(d) p.; ' + O + '21', m: t('σS = 99-asis (1 m.) arba 95-asis procentilis.', 'σS = 99th (1 year) or 95th percentile.'),
      e: 'P14/P15 =PERCENTILE($M$3:$M$51;0,95 / 0,99)', ok: Y, w: t('Skaičiavimai: 21 ir 23 eil.', 'Calculation: rows 21 and 23') },
    { t: t('Stresinis: atimamas narys 0,5·σS²·N', 'Stress: subtracted term 0.5·σS²·N'), step: 'sm',
      q: '2017: "… − 0,5 wσS² N" (IV pr. 11 p.); 2021: "N is the number of trading periods in the recommended holding period, and where the other terms are defined in point 12 of Annex II" (19(a))',
      s: D + '19 p.; ' + O + '21; ' + t('2017/653 pradinė redakcija, IV pr. 10(d), 11 p.; OL L 100, 28 psl.', '2017/653 original, Annex IV points 10(d), 11; OJ L 100/28'),
      m: t('Formulėje atimamas narys naudoja stresinį nuokrypį σS (ne įprastą σ). 2021 m. tekste formulė – paveikslėlis: patikrinkite akimi L 455 I/21.', 'The subtracted term uses the stressed σS (not the ordinary σ). In the 2021 text the formula is an image: check visually on L 455 I/21.'),
      e: t('Y21 =0.5*$P$8^2*P21, P8 =SQRT(P4) – įprastas 60 mėn. σ.', 'Y21 =0.5*$P$8^2*P21, P8 =SQRT(P4) – the ordinary 60-month σ.'), ok: No,
      w: t('Skaičiavimai: 27 eil. formulė', 'Calculation: row 27 formula'), note: t('įtaka – kartu su ankstesne eilute', 'impact together with the previous row') },
    { t: t('Momentai iš 5 metų', 'Moments over 5 years'), step: k.momDrop ? 'err' : null,
      q: '"The VaR shall be calculated from the moments of the observed distribution of returns of the PRIIP\'s or its benchmark or proxy\'s price during the past 5 years." (II pr. 1 d. 9 p.)',
      s: t('2017/653, II priedo 1 dalis, 9, 11, 12 p.; OL L 100, 16 psl.', '2017/653, Annex II Part 1 points 9, 11, 12; OJ L 100/16'),
      m: t('Vidurkis, dispersija, asimetrija, ekscesas – iš visų 60 paskutinių mėnesių log grąžų.', 'Mean, variance, skewness, kurtosis from all 60 last monthly log returns.'),
      e: k.momDrop ? t('50+ 2026 m. PID: „Nepalankiausio grąžos (1,6,11)“ P2 =COUNT(C3:C50) = 48; P3 =SUM(C3:C50)/P2; P4–P6 ir P27 =STDEV.P(C3:C50) – tik 48 iš 60 mėn., nors nuokrypiai M3:M51 skaičiuojami iš C3:C62.', '50+ 2026 KID: “Nepalankiausio grąžos (1,6,11)” P2 =COUNT(C3:C50) = 48; P3 =SUM(C3:C50)/P2; P4–P6 and P27 =STDEV.P(C3:C50) – only 48 of 60 months, while deviations M3:M51 use C3:C62.') : t('60 mėnesių.', '60 months.'),
      ok: k.momDrop ? t('Ne (50+ 2026)', 'No (50+ 2026)') : Y, w: t('Skaičiavimai: B8:B11', 'Calculation: B8:B11') },
    ...(k.w12 ? [{ t: t('50+: 11 metų langų grąža', '50+: 11-year window returns'), step: 'err', q: '"(i) based on the performance of the PRIIP during the exact duration of each sub interval;" (7(c)(i))', s: D + '7(c)(i) p.; ' + O + '18',
      m: t('Kiekvieno lango grąža – per visą jo trukmę.', 'Each window’s return over its whole length.'),
      e: t('„Scenarijų grąžos 11M“ E40:E63: 24 langams (pradžia 2013-01 … 2014-12) grąža skaičiuota tik iš paskutinių 12 mėn. (pvz. E60 = 0,005423; nustatyta iš reikšmių).', '“Scenarijų grąžos 11M” E40:E63: for 24 windows (start 2013-01 … 2014-12) the return uses only the last 12 months (e.g. E60 = 0.005423; inferred from values).'),
      ok: t('Ne (50+ 2026)', 'No (50+ 2026)'), w: t('Langai: visų langų formulės vienodos', 'Windows: all window formulas are the same'), note: t('įtaka – kartu su ankstesne eilute', 'impact together with the previous row') }] : []),
    { t: t('Stresinis ne geresnis už nepalankų', 'Stress not better than unfavourable'), q: '"The stress scenario value shown shall not be better than the value of the unfavourable scenario." (20)', s: D + '20 p.; ' + O + '21',
      m: t('Stresinis = min(stresinis, nepalankus).', 'Stress = min(stress, unfavourable).'), e: t('Taikoma.', 'Applied.'), ok: Y, w: t('Skaičiavimai: 28 eil.', 'Calculation: row 28') },
    { t: t('Tarpiniai laikotarpiai', 'Intermediate periods'), q: '"…at the end of the first year, after half of the recommended holding period rounded up to the end of the nearest year, and at the end of the recommended holding period." (33)',
      s: D + '33, 35, 36 p.; ' + O + '23–24', m: t('1 m., pusė RHP (suapvalinus aukštyn), RHP; stresiniam N = tarpinio laikotarpio mėnesiai.', '1 year, half RHP (rounded up), RHP; stress N = months of the intermediate period.'),
      e: t('Taip pat.', 'The same.'), ok: Y, w: t('Skaičiavimai: B–D stulpeliai, 24 eil. (N)', 'Calculation: columns B–D, row 24 (N)') },
    { t: t('Pateikimas: sumos ir grąža', 'Presentation: amounts and return'), q: '"Figures shall by default be rounded to the nearest 10 EUR" (42); "Performance scenarios shall also be presented in percentage terms, as the average annual return of the investment." (44)',
      s: D + '42, 44 p.; ' + O + '24–25', m: t('Sumos pagal nutylėjimą apvalinamos iki 10 EUR; grąža – vidutinė metinė.', 'Amounts rounded to 10 EUR by default; return – average annual.'),
      e: t('Sumos – iki cento; III pakopai (1000 € kasmet) grąža – įmokų XIRR.', 'Amounts to the cent; for the III pillar (1,000 € a year) the return is the XIRR of the payments.'), ok: t('Iš dalies', 'Partly'),
      w: t('Scenarijai. Šiame faile sumos paliktos iki cento, kad būtų galima palyginti su PID; viešinant – apvalinti iki 10 EUR.', 'Scenarios. Kept to the cent here to compare with the KID; round to 10 EUR when publishing.') },
  ];
  return ev;
}
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
      ['5. Palyginkite su PID: žemiau – paskelbto PID reikšmės ir šio failo rezultatai.'],
      ['6. „Įrodymai“ – kiekvienas skaičiavimo žingsnis su reglamento punktu, OL puslapiu ir citata, ką daro SEB failas (langelis, formulė), ar tai atitinka reglamentą ir kiek keičia rezultatą.'],
      ['7. „Palyginimas“ – paskelbtas PID, SEB metodas ir skaičiavimas pagal reglamentą šalia, su skirtumais.']] : [
      ['1. “Scenarios” – the KID-format table. Amounts are formulas: 1,000 € at the start of each year, amount = Σ 1000 × (1 + r)^k, r – the scenario annual return from “Calculation”. Average return each year for longer periods – XIRR of the payments (value, as in the KID).'],
      ['2. “Calculation” – B8:B11 moments (mean, variance, skewness, excess kurtosis) of the last 60 monthly log returns; then for each period (columns B–D): number of windows, median (moderate), maximum (favourable), minimum (unfavourable, incl. windows to the end), stress σS (PERCENTILE), Cornish-Fisher and the stress result.'],
      ['3. “Windows” – all n-year windows (start, end, annual return = (end value / start value)^(1/n) − 1) and windows ending at the period end (for the unfavourable scenario).'],
      ['4. “Months” – index (and fund) value of each month, value after costs (F), monthly log return (G), rolling 6- and 12-month deviations (H, I). Change the costs in “Calculation” B5 and everything recalculates.'],
      ['5. Compare with the KID: below – the published KID values and this file’s results.'],
      ['6. “Evidence” – each step with the regulation point, OJ page and quote, what SEB’s file does (cell, formula), whether it complies and the impact.'],
      ['7. “Comparison” – published KID, SEB’s method and the regulation side by side, with differences.']]),
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
    ['Reglamentas (ES) 2017/653: ' + KID_REG], ['Konsoliduota redakcija su 2021/2268 pakeitimais (IV priedas): ' + KID_REGC],
    ['ESAs Q&A (JC 2023 22), skyrius „Performance scenarios“: https://www.esma.europa.eu/sites/default/files/2023-05/JC_2023_22_-_Consolidated_JC_PRIIPs_Q_As.pdf'],
    [L ? 'SEB PID ir SEB Excel skaičiavimo failai (gauti iš savininko); indekso duomenys – SEB; SOLEBLS EUR – Bloomberg.' : 'SEB KIDs and SEB Excel calculation files (from the owner); index data – SEB; SOLEBLS EUR – Bloomberg.']);
  // Įrodymai: reikalavimas → SEB failas → atitinka? → kur šiame faile → įtaka eurais (žingsnių lentelė)
  const ev = kidEvidence(f, L), stp = {}, scN = S.kidSc;
  const sg = v => Math.abs(v) < 0.005 ? '0' : (v > 0 ? '+' : '−') + num(Math.abs(v), 2);
  if (st && st.length > 1) st.forEach((x, i) => { if (i) stp[x.id] = scN.map((_, j) => x.R.ns.filter((n, q) => q < 2 || n !== x.R.ns[1]).map(n => `${S.kidYr(n)}: ${sg(kidAmt(x.R.per[n].ret[j], n) - kidAmt(st[i - 1].R.per[n].ret[j], n))}`).join('; ')); });
  const E = [[L ? `${f.n}: kaip skaičiavimas atitinka reglamentą ir kur SEB PID skaičiavimas jo neatitinka` : `${f.n}: how the calculation follows the regulation and where SEB’s KID calculation does not`],
    [L ? 'Citatos – oficialus angliškas reglamento tekstas (EUR-Lex PDF, žodis žodin). OL puslapių numeriai visose kalbose tie patys – lietuvišką tekstą rasite tuose pačiuose puslapiuose: ' + KID_REG : 'Quotes – the official English text of the regulation (EUR-Lex PDF, verbatim). OJ page numbers are the same in every language: ' + KID_REG],
    [L ? 'OL puslapiai nustatyti iš oficialaus PDF teksto; prieš teikiant institucijoms verta atsiversti PDF ir patikrinti akimi. SEB langeliai ir formulės – iš SEB PID skaičiavimo Excel failų (2026 m. PID).' : 'OJ pages were read from the official PDF text layer; check them visually before submitting. SEB cells and formulas – from SEB’s KID calculation Excel files (2026 KID).'],
    [],
    [L ? 'Nr.' : 'No.', L ? 'Tema' : 'Topic', L ? 'Reglamento reikalavimas (oficiali citata, EN)' : 'Requirement (official quote)', L ? 'Dokumentas, punktas, OL puslapis' : 'Document, point, OJ page',
      L ? 'Ką tai reiškia' : 'What it means', L ? 'Ką daro SEB PID skaičiavimo failas (lapas, langelis, formulė)' : 'What SEB’s KID calculation file does (sheet, cell, formula)', L ? 'SEB atitinka?' : 'SEB compliant?',
      L ? 'Kur patikrinti šiame faile' : 'Where to check in this file', ...scN.map(x => (L ? 'Įtaka, EUR: ' : 'Impact, EUR: ') + x)]];
  const used = {};
  ev.forEach((x, i) => {
    const im = x.step && stp[x.step] && !used[x.step] ? stp[x.step] : null;
    if (im) used[x.step] = 1;
    E.push([i + 1, x.t, x.q, x.s, x.m, x.e, x.ok, x.w, ...scN.map((_, j) => im ? im[j] : (x.step && stp[x.step] && x.note ? x.note : null))]);
  });
  E.push([], [L ? `Įtaka – kiek eurų pasikeičia kiekvieno laikotarpio suma, ištaisius tą neatitikimą (žingsniai iš eilės, kaip lape „${S.kidShP}“). Tuščia – neatitikimo nėra arba pasirinktas ne PID laikotarpis.` : `Impact – change in EUR of each period’s amount after fixing that item (steps in order, as on “${S.kidShP}”). Empty – compliant or the period is not the KID period.`],
    [], [L ? 'Šaltiniai' : 'Sources'], [KID_REG], [KID_REGC], ['2021/2268 (OL L 455 I, 2021-12-20): https://eur-lex.europa.eu/legal-content/LT/TXT/?uri=CELEX:32021R2268'], [KID_QA]);
  // Palyginimas: paskelbtas PID, SEB metodas ir reglamentas tam pačiam laikotarpiui
  const Rs = kidCalc(kidParams(f, KS.o[kidKey(f)] || {}, { mode: 'seb' })), Rg = kidCalc(kidParams(f, KS.o[kidKey(f)] || {}, { mode: 'reg' }));
  const pidOk = off && off.years.every((n, i) => n === R.ns[i]) && kidYm(off.from.slice(0, 7)) === p.from && kidYm(off.to.slice(0, 7)) === p.to;
  const PA = [[L ? `${f.n}: paskelbtas PID, SEB metodas ir skaičiavimas pagal reglamentą (${kidYs(p.from)} – ${kidYs(p.to)}, RHP ${p.rhp} m.)` : `${f.n}: published KID, SEB’s method and the calculation by the regulation (${kidYs(p.from)} – ${kidYs(p.to)}, RHP ${p.rhp} y)`], [],
    [L ? 'Scenarijus' : 'Scenario', L ? 'Laikotarpis' : 'Period', L ? 'Paskelbtas PID, EUR' : 'Published KID, EUR', L ? 'Kaip SEB PID (atkartota), EUR' : 'As SEB’s KID (reproduced), EUR', L ? 'Skirtumas nuo PID' : 'Difference from KID',
      L ? 'Pagal reglamentą, EUR' : 'By the regulation, EUR', L ? 'Reglamentas − PID' : 'Regulation − KID', L ? 'Pagal reglamentą, metinė grąža' : 'By the regulation, annual return']];
  const am = (RR, i, j) => RR && !RR.err ? kidAmt(RR.per[RR.ns[i]].ret[j], RR.ns[i]) : null;
  scN.forEach((sc, j) => R.ns.forEach((n, i) => {
    const r0 = 4 + PA.length - 3, a = pidOk ? off.a[i][j] : null, s1 = am(Rs, i, j), g1 = am(Rg, i, j);
    PA.push([sc, S.kidYr(n), a == null ? null : P(a, '#,##0.00'), s1 == null ? null : P(s1, '#,##0.00'), a != null && s1 != null ? F(`D${r0}-C${r0}`, s1 - a, '+#,##0.00;-#,##0.00;0.00') : null,
      g1 == null ? null : P(g1, '#,##0.00'), a != null && g1 != null ? F(`F${r0}-C${r0}`, g1 - a, '+#,##0.00;-#,##0.00;0.00') : null, Rg && !Rg.err ? P(kidXirr(Rg.per[Rg.ns[i]].ret[j], n) / 100, '0.00%') : null]);
  }));
  PA.push([], [L ? 'Šiame lape – reikšmės. Visos formulės – kituose lapuose (režimas, kurį pasirinkote svetainėje). Kito režimo formules gausite perjungę režimą ir atsisiuntę dar kartą.' : 'Values here. All formulas are on the other sheets (the mode chosen on the site). Switch the mode and download again for the other mode’s formulas.']);
  if (st && st.length > 1) {
    PA.push([], [S.kidStepT(p.rhp).toUpperCase()], [S.kidStepH, '', ...scN]);
    st.forEach((x, i) => PA.push([`${i}. ${x.t}`, '', ...scN.map((_, j) => P(kidAmt(x.R.per[p.rhp].ret[j], p.rhp), '#,##0.00 "EUR"'))]));
    PA.push([S.kidStepNote], [L ? `Kiekvieno žingsnio priežastis ir reglamento punktas – lape „${S.kidShE}“.` : `The reason and regulation point for each step – sheet “${S.kidShE}”.`]);
  }
  const wb = XLSX.utils.book_new(), add = (aoa, name, cols) => { const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = cols; XLSX.utils.book_append_sheet(wb, ws, name); };
  add(I, S.kidShI, [{ wch: 70 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }]);
  add(E, S.kidShE, [{ wch: 5 }, { wch: 26 }, { wch: 60 }, { wch: 30 }, { wch: 45 }, { wch: 60 }, { wch: 12 }, { wch: 38 }, { wch: 30 }, { wch: 30 }, { wch: 30 }, { wch: 30 }]);
  add(PA, S.kidShP, [{ wch: 40 }, { wch: 10 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 14 }]);
  add(Tt, S.kidShT, [{ wch: 28 }, { wch: 38 }, { wch: 16 }, { wch: 16 }, { wch: 22 }]);
  add(C, S.kidShC, [{ wch: 44 }, { wch: 16 }, { wch: 16 }, { wch: 16 }]);
  add(Wrows, S.kidShW, Array(c).fill({ wch: 12 }));
  add(M, S.kidShM, [{ wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }]);
  return { wb, file: `${f.n.replace(/[^\p{L}\p{N}.-]+/gu, '_')}_KID.xlsx` };
}
