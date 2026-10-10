/* Rezultatų ir palyginimo puslapis. Priklauso nuo: data.js (DATA), events.js (EVENTS), common.js. */
addStrings({
  idxLbl: 'Compare with',
  from: 'From', to: 'To', group: 'Group', ret: 'Return', rank: 'Rank (1 = best)', avg: 'Average',
  hSum: 'Automatic summary', winsel: p => `Selected period (${p})`, win1w: 'Last 7 days', win1m: 'Last month', qPlace: 'Quarter', yPlace: 'Year',
  hMarket: 'Whole market: return and rank by age group', hFund: 'Compare funds',
  hRet: 'Return over the period, %', hRank: 'Rank within the age group (1 = best return)',
  hOv: 'Overall ranking across all groups and periods', ovAll: 'All periods', ovLong: '1 yr and longer', ovPick: 'Periods included:',
  gxBtn: 'Since Goindex start', gxNote: d => `“Since Goindex start” is on: in each age group every fund is measured from the start of the Goindex fund (${d}) or from the period start, whichever is later, so all six providers are compared over the same dates.`,
  nOv: (pers, ng) => `How to read: for each of the ${ng} age groups and each selected period (${pers}) the providers are ranked by return – each such ranking is one comparison. “Comparisons” = how many rankings the provider took part in (it is left out where its fund did not exist at the period start or has no fresh data; rankings with fewer than 3 providers are skipped), so the maximum is ${ng} × the number of periods. “1st places” = how many of them it won; “% 1st” and “% 1st–2nd” = share of its comparisons; “Avg. rank” = average position (1 = best). Each period ends on its group’s latest date.`,
  mMarket: p => `Period: ${p}. Colours show the rank within each row (green = best, red = worst).`,
  nMarket: 'Return = change in unit value between the period start and the latest common date in each group. “–” = the fund did not exist at the start of the period or has no fresh data. Average row: simple average across the age groups where the fund has a value.',
  thCmp: 'Comparisons', thFirst: '1st places', thFirstPct: '% 1st', thTop2: '% 1st–2nd', thAvgRank: 'Avg. rank',
  rmBest: 'Best ratio', rmAvgRank: 'Average place', rmTip: (r, v, k, n) => `Return ${r}, volatility ${v} % · place ${k} of ${n}`,
  nRmT: rf => `Return-to-risk ratio (Sharpe) = (annualised return − risk-free rate ${rf} %) ÷ annualised volatility, for the period, age groups and providers chosen above. Higher = more return per unit of risk. Colour = place within the age group (green = best); funds are compared only with the same age group. “Average place” = the provider’s average place across the chosen groups. On periods shorter than a year the annualised figures are less reliable.`,
  hDd: 'Run-up and drawdown',
  hFee: 'Fee impact over time', feeLife: 'Life-cycle funds', feeM: 'Monthly contribution', feeR: 'Assumed return before fees, % p.a.', feeYrs: y => `${y} yr`,
  feeRate: 'Fee, % p.a.', feeContrib: 'Paid in', feeGross: 'Final sum without fees', feeNet: 'Final sum with fees', feePaid: 'Fees paid', feeLoss: 'Lower final sum, €', feeLossPct: 'Lower final sum, %',
  capFee: (m, y, r) => `${num(m, 0)} € every month for ${y} years at ${num(r, 1)} % a year before fees. The only difference between providers is the asset-based management fee (Bank of Lithuania list); contribution fees and the real future return are not included.`,
  hRisk: 'Return vs. risk', hRel: 'Return vs. age-group average', relAvg: 'average', pp: 'pp',
  capRel: t => `${t}. Each bar = the fund’s return minus the simple average of all funds in its age group, in percentage points; right of the centre line = better than average. Same scale for all groups.`, axVol: 'Volatility, % p.a.', axRet: 'Return over the period, %',
  capRisk: (t, n) => `${t}. Each dot is one fund (${n}); colour = provider. Choose the period, age groups and providers above the chart.`, rmGroups: 'Age groups:', rmProvs: 'Providers:', rmAll: 'All',
  hMetrics: 'Performance metrics', hCal: 'Calendar-year returns', hRoll: 'Rolling returns (to the latest date)',
  hQP: 'Rank by period (this group; 1 = best)', hHm: 'Monthly returns heat map –',
  thRank: '#', thFund: 'Provider', thPeriodRet: 'Return, period', thVol: 'Volatility p.a., period', thMdd: 'Max drawdown, period',
  thInception: 'Inception', thCagr: 'Return p.a. since inception', thVolAll: 'Volatility p.a. since inception', thMddAll: 'Max drawdown since inception',
  thRet1m: '1 mo', thRet3m: '3 mo', thRet6m: '6 mo', thRet1y: '1 yr', thRet3y: '3 yr p.a.', thRet5y: '5 yr p.a.',
  thR1avg: 'Rolling 1-yr: average', thR1min: 'min', thR1max: 'max', thR1pos: '% positive', thYear: 'Year',
  csLbl: 'Chart start', csPeriod: 'Start of the period', csYoung: 'Since the youngest fund’s start', csFrom: p => `Since ${p} start`,
  ytd: 'YTD', mChart: (g, p) => `${g} · ${p}. Returns rebased to 0 % at the start of the period.`,
  mZoom: (g, a, b) => `${g} · zoomed ${a} → ${b}. Returns rebased to 0 % at the start of the zoomed range.`,
  nFund: 'Volatility = standard deviation of daily returns × √252 (days with no price change are excluded). Annualised return = compound annual growth between the first and last available price (shown only for histories of at least one year). Max drawdown = largest peak-to-trough fall. * = fund started during that year (return since inception). Rolling returns longer than one year are annualised. Unit values are already net of fees and taxes. Past performance is not a guide to future returns.',
  foot: 'Data is collected automatically from the providers\' websites and APIs; for information only, not investment advice.',
  share: 'Copy link', copied: 'Link copied', xlsx: 'Excel', xlsxBusy: 'Preparing…', allFunds: 'All funds', allNote: 'The chart is drawn for one age group at a time – pick a group above to see it. The tables below show all funds; ranks and highlighted best values are within each age group.', capMetrics2: '“Since inception” columns: each fund’s first date → end date.', xlsxDay: 'Daily table (.xlsx)', xlsxDayTip: 'Same layout as the old daily file (fund, date, unit value, net assets): one row per fund for the chosen date; default = latest. If a fund has no value on that day, its last earlier value is used.', xlsxFail: 'Could not load the Excel library (no internet?).', print: 'Print / PDF',
  viewret: 'Return', viewdiff: 'Difference', diffFrom: 'from', diffAvg: 'Group average', mDiff: r => `Lines show each fund’s cumulative return minus ${r ? r + '’s' : 'the group average'}, in % (0 = ${r || 'group average'}).`,
  eventsBtn: 'Market events', resetZoom: 'Reset zoom', png: 'Download PNG', zoomHint: 'Tip: drag across the chart to zoom; hover a provider to highlight it; click a name at the chart’s right edge (or double-click a chip) to pin it.',
  advBtn: 'Advanced metrics (Sharpe ratio, best / worst periods)', rf: 'Risk-free rate, % p.a.', rfAutoBtn: 'Use €STR',
  hAdv: 'Advanced metrics', thAnn: 'Return p.a., period', thSharpe: 'Sharpe ratio', thBestD: 'Best day', thWorstD: 'Worst day', thBestM: 'Best month', thWorstM: 'Worst month',
  thBestY: 'Best year', thWorstY: 'Worst year', thPosM: '% positive months',
  nAdv: 'Computed for the selected period (best / worst calendar year: whole history, full years only). Sharpe = (annualised return − risk-free rate) ÷ annualised volatility; on periods shorter than a year the annualised figures are unreliable. Months = full calendar months inside the period.',
  notShown: l => `Not shown on the chart (started later than the period start): ${l}. Pick a shorter period to see them.`,
  capSpan: (l, a, e) => `${l}: ${a} → ${e}`, byGroup: 'start differs by group', endByGroup: 'end differs by group',
  capOv: (h, d) => `${h}; every period ends on its group’s latest date (up to ${d})`,
  capMetrics: (a, e) => `Period columns: ${a} → ${e}. “Since inception” columns: each fund’s first date → ${e}.`,
  capCal: (y0, y1, e) => `Calendar years ${y0}–${y1}; the last column is year to date (to ${e}).`,
  capRoll: e => `Rolling windows ending ${e}; “Rolling 1-yr” statistics use every 12-month window in the fund’s history.`,
  capQP: (e, a) => `Periods ending ${e}; “All history” starts ${a}.`,
  capHm: (p, a, e) => `${p}: monthly returns ${a} → ${e}; the first and last months may be partial.`,
  capAdv: (a, e) => `Period ${a} → ${e}; best / worst calendar year: whole history.`,
  covTitle: 'Data coverage', covLater: (p, d) => `${p}: data starts ${d} – later than the other funds in this group (the fund is newer or earlier history is not available), so long periods and “since inception” figures cover a shorter history.`,
  covSeb: 'Earlier history has not been loaded yet (only data from the date above is available).',
  sumNoData: 'Not enough data.', sumLatest: d => `Latest data: <b>${d}</b>.`,
  sumLead: (p, k, n) => `<b>${p}</b> led in ${k} of ${n} age groups.`, sumLag: (p, k, n) => `<b>${p}</b> lagged in ${k} of ${n} age groups.`,
  sumMove: (p, g, v, d) => `Largest one-day move: <b>${p}</b> (${g}) <b>${v}</b> on ${d}.`,
  thGroup: 'Group', thLeader: 'Leader', thLagger: 'Laggard', thSpread: 'Spread, %', thMove: 'Largest 1-day move',
  nSum: 'Computed automatically from the latest data in each age group; leader / laggard by return over the window.',
  info: {
    fee: 'Every month the contribution is added, the money grows at the assumed return, and the management fee (annual % ÷ 12) is deducted from the accumulated assets – the way II pillar fees are charged (daily, already included in unit values). “Fees paid” = all fees deducted; “Lower final sum” also includes the return those fees would have earned. Fees: base asset-based fee from the Bank of Lithuania list (life-cycle funds of a manager share one fee).',
    dd: 'Run-up = the largest rise of the unit value from its lowest point within a month, quarter or year; drawdown = the largest fall from its highest point within that period. Together they show how widely the fund swung inside each period, not only where it ended. “Line” shows the cumulative return and how far the fund was below its previous high on every day – the deepest dip is the maximum drawdown.',
    rel: 'Shows how far each fund is above or below its peers: return over the selected period minus the simple (unweighted) average return of all funds in the same age group. Provider chips only hide bars; the average always uses all funds with fresh data.',
    rf: () => DATA.rf ? `Default: €STR (euro short-term rate) published daily by the European Central Bank – ${num(DATA.rf.value, 2)} % p.a. on ${DATA.rf.date}. It is the standard risk-free rate for euro investors (all Lithuanian pension fund members invest in EUR) and is updated automatically with the site data. Source: ${DATA.rf.source}. You can type your own value; “Use €STR” returns to the automatic one.` : 'The automatic €STR rate (European Central Bank) is not available yet, so 2 % p.a. is used. You can type your own value.',
    riskmap: 'Horizontally: volatility (annualised standard deviation of daily returns over the selected period). Vertically: return over the same period. Up and to the left is better: more return for less risk. Only funds with fresh data and at least 20 days of returns are shown.',
    ret: 'Change in unit value between the start and end of the period. Unit values are already net of fees and taxes, so no further deduction is needed.',
    rank: 'Position of each provider within its age group by return over the selected period; 1 = best.',
    overall: 'Every age group × every period is one comparison. Counts how often a provider is first, in the top two, and its average rank. Short periods are noisy, so the “1 yr and longer” view is usually fairer.',
    vol: 'Volatility = standard deviation of daily returns × √252 – how much the unit value fluctuates; higher = more risk. Days with no price change are excluded.',
    mdd: 'Maximum drawdown = the largest fall from a peak to a later trough. Shows the worst loss an investor could have suffered.',
    cagr: 'Compound annual growth rate between the first and last available unit value (shown only when the history is at least one year).',
    cal: 'Return for each calendar year. * = the fund started during that year, so the figure covers only part of it. The last column is the current year to date.',
    roll: 'Return over the last 1, 3, 6, 12, 36, 60 months (longer than a year – annualised). Rolling 1-yr = every possible 12-month window in history: average, worst, best and share that were positive.',
    heat: 'Return in each calendar month (rows = years). Green = gain, red = loss; the last column is the year.',
    sharpe: 'Sharpe ratio = (annualised return − risk-free rate) ÷ annualised volatility. Higher = better return per unit of risk. Choose the risk-free rate (e.g. a deposit or short-term government bond yield).',
    bestworst: 'Best / worst single day and calendar month inside the selected period, and best / worst full calendar year over the whole history.',
    posm: 'Share of full calendar months with a positive return, within the selected period.',
    idx: 'Dashed lines and grey rows = world equity indexes for comparison: MSCI ACWI (all world stocks) and MSCI World (developed markets) – Net Return in EUR, published by MSCI; S&P 500 – Total Return in USD (dividends reinvested) converted to EUR at the ECB rate. Index values have no fees, while fund unit values are already net of management fees. Pension funds also hold bonds (especially for older age groups), so they are expected to lag equities in rising markets and fall less in crises. In the tables “since inception” for an index = since the earliest fund in the group started.',
    events: 'Shows key market and pension-system events on the chart. Hover (or see the list below the chart) for what happened and the source. Off by default.',
    summary: 'Generated automatically from the latest data: who leads and lags over the last 7 days or month in each age group, and the largest one-day move.',
    coverage: 'Some funds have a shorter history than their peers.',
  },
}, {
  idxLbl: 'Palyginti su',
  from: 'Nuo', to: 'Iki', group: 'Grupė', ret: 'Grąža', rank: 'Vieta (1 = geriausia)', avg: 'Vidurkis',
  hSum: 'Automatinė santrauka', winsel: p => `Pasirinktas laikotarpis (${p})`, win1w: 'Paskutinės 7 dienos', win1m: 'Paskutinis mėnuo', qPlace: 'Ketvirtis', yPlace: 'Metai',
  hMarket: 'Visa rinka: grąža ir vieta pagal amžiaus grupes', hFund: 'Fondų palyginimas',
  hRet: 'Grąža laikotarpyje, %', hRank: 'Vieta amžiaus grupėje (1 = geriausia grąža)',
  hOv: 'Bendra reitingų lentelė (visos grupės ir laikotarpiai)', ovAll: 'Visi laikotarpiai', ovLong: '1 metai ir ilgesni', ovPick: 'Įtraukti laikotarpiai:',
  gxBtn: 'Nuo Goindex pradžios', gxNote: d => `Įjungta „Nuo Goindex pradžios“: kiekvienoje amžiaus grupėje visi fondai skaičiuojami nuo Goindex fondo pradžios (${d}) arba nuo laikotarpio pradžios, jei ji vėlesnė, todėl visi šeši tiekėjai lyginami per tas pačias datas.`,
  nOv: (pers, ng) => `Kaip skaityti: kiekvienoje iš ${ng} amžiaus grupių ir kiekvienu pažymėtu laikotarpiu (${pers}) tiekėjai surikiuojami pagal grąžą – kiekvienas toks rikiavimas yra vienas palyginimas. „Palyginimų“ = kiek rikiavimų tiekėjas dalyvavo (jis neįtraukiamas, jei laikotarpio pradžioje jo fondo dar nebuvo arba nėra naujų duomenų; rikiavimai, kuriuose mažiau nei 3 tiekėjai, praleidžiami), todėl daugiausia gali būti ${ng} × laikotarpių skaičius. „1 vietų“ = kiek kartų buvo pirmas; „% 1 vietų“ ir „% 1–2 vietų“ = dalis nuo jo palyginimų; „Vid. vieta“ = vidutinė vieta (1 = geriausia). Kiekvienas laikotarpis baigiasi savo grupės paskutine diena.`,
  mMarket: p => `Laikotarpis: ${p}. Spalvos rodo vietą kiekvienoje eilutėje (žalia – geriausia, raudona – prasčiausia).`,
  nMarket: 'Grąža = vieneto vertės pokytis tarp laikotarpio pradžios ir paskutinės bendros dienos grupėje. „–“ = fondo laikotarpio pradžioje dar nebuvo arba nėra naujų duomenų. Vidurkio eilutė: paprastas vidurkis tarp amžiaus grupių, kuriose fondas turi reikšmę.',
  thCmp: 'Palyginimų', thFirst: '1 vietų', thFirstPct: '% 1 vietų', thTop2: '% 1–2 vietų', thAvgRank: 'Vid. vieta',
  rmBest: 'Geriausias santykis', rmAvgRank: 'Vidutinė vieta', rmTip: (r, v, k, n) => `Grąža ${r}, svyravimas ${v} % · vieta ${k} iš ${n}`,
  nRmT: rf => `Grąžos ir rizikos santykis (Sharpe) = (metinė grąža − be rizikos palūkanų norma ${rf} %) ÷ metinis svyravimas, pagal virš grafiko pasirinktą laikotarpį, amžiaus grupes ir tiekėjus. Didesnis = daugiau grąžos vienam rizikos vienetui. Spalva – vieta amžiaus grupėje (žalia = geriausia); fondai lyginami tik su tos pačios grupės fondais. „Vidutinė vieta“ – tiekėjo vidutinė vieta pasirinktose grupėse. Trumpesniais nei metų laikotarpiais metiniai skaičiai mažiau patikimi.`,
  hDd: 'Kilimas ir kritimas',
  hFee: 'Mokesčių poveikis laike', feeLife: 'Gyvenimo ciklo fondai', feeM: 'Įmoka per mėnesį', feeR: 'Prielaidinė grąža prieš mokesčius, % per metus', feeYrs: y => `${y} ${y >= 10 ? 'metų' : 'metai'}`,
  feeRate: 'Mokestis, % per metus', feeContrib: 'Įmokėta', feeGross: 'Sukaupta be mokesčių', feeNet: 'Sukaupta su mokesčiais', feePaid: 'Sumokėta mokesčių', feeLoss: 'Mažesnė suma, €', feeLossPct: 'Mažesnė suma, %',
  capFee: (m, y, r) => `${num(m, 0)} € kas mėnesį per ${y} ${y >= 10 ? 'metų' : 'metus'}, kai grąža prieš mokesčius – ${num(r, 1)} % per metus. Valdytojai skiriasi tik valdymo mokesčiu nuo turto (Lietuvos banko sąrašas); atskaitymai nuo įmokų ir tikroji ateities grąža neįskaičiuoti.`,
  hRisk: 'Grąža ir rizika', hRel: 'Grąža palyginti su amžiaus grupės vidurkiu', relAvg: 'vidurkis', pp: 'p. p.',
  capRel: t => `${t}. Kiekviena juosta – fondo grąža minus visų tos amžiaus grupės fondų paprastas vidurkis, procentiniais punktais; dešiniau vidurio linijos – geriau už vidurkį. Visoms grupėms ta pati skalė.`, axVol: 'Svyravimas, % per metus', axRet: 'Grąža per laikotarpį, %',
  capRisk: (t, n) => `${t}. Kiekvienas taškas – vienas fondas (${n}); spalva – tiekėjas. Laikotarpį, amžiaus grupes ir tiekėjus pasirinkite virš grafiko.`, rmGroups: 'Amžiaus grupės:', rmProvs: 'Tiekėjai:', rmAll: 'Visos',
  hMetrics: 'Rezultatų rodikliai', hCal: 'Kalendorinių metų grąža', hRoll: 'Slenkanti grąža (iki paskutinės dienos)',
  hQP: 'Vieta pagal laikotarpį (ši grupė; 1 = geriausia)', hHm: 'Mėnesių grąžos šilumos žemėlapis –',
  thRank: '#', thFund: 'Tiekėjas', thPeriodRet: 'Grąža laikotarpyje', thVol: 'Svyravimas per metus, laikotarpyje', thMdd: 'Didžiausias kritimas, laikotarpyje',
  thInception: 'Pradžia', thCagr: 'Metinė grąža nuo įsteigimo', thVolAll: 'Svyravimas per metus nuo įsteigimo', thMddAll: 'Didžiausias kritimas nuo įsteigimo',
  thRet1m: '1 mėn.', thRet3m: '3 mėn.', thRet6m: '6 mėn.', thRet1y: '1 metai', thRet3y: '3 metai, metinė', thRet5y: '5 metai, metinė',
  thR1avg: 'Slenkantys 1 metai: vidurkis', thR1min: 'min.', thR1max: 'maks.', thR1pos: '% teigiamų', thYear: 'Metai',
  csLbl: 'Grafiko pradžia', csPeriod: 'Laikotarpio pradžia', csYoung: 'Nuo jauniausio fondo pradžios', csFrom: p => `Nuo ${p} pradžios`,
  ytd: 'Šie metai', mChart: (g, p) => `${g} · ${p}. Grąža perskaičiuota į 0 % laikotarpio pradžioje.`,
  mZoom: (g, a, b) => `${g} · priartinta ${a} → ${b}. Grąža perskaičiuota į 0 % priartinto laikotarpio pradžioje.`,
  nFund: 'Svyravimas = dienos grąžų standartinis nuokrypis × √252 (dienos be kainos pokyčio neįtraukiamos). Metinė grąža = sudėtinis metinis augimas tarp pirmos ir paskutinės turimos kainos (rodoma tik bent vienerių metų istorijai). Didžiausias kritimas = didžiausias nuosmukis nuo viršūnės iki dugno. * = fondas pradėjo veikti tais metais (grąža nuo įsteigimo). Ilgesnė nei metų slenkanti grąža perskaičiuota metine. Vieneto vertė jau yra po mokesčių ir mokesčių fondui. Praeities rezultatai negarantuoja ateities grąžos.',
  foot: 'Duomenys renkami automatiškai iš tiekėjų svetainių ir API; tai informacinė medžiaga, ne investavimo rekomendacija.',
  share: 'Kopijuoti nuorodą', copied: 'Nuoroda nukopijuota', xlsx: 'Excel', xlsxBusy: 'Ruošiama…', allFunds: 'Visi fondai', allNote: 'Grafikas braižomas vienai amžiaus grupei – pasirinkite grupę aukščiau, kad jį pamatytumėte. Lentelėse žemiau rodomi visi fondai; vietos ir paryškintos geriausios reikšmės skaičiuojamos kiekvienoje amžiaus grupėje.', capMetrics2: 'Stulpeliai „nuo įsteigimo“: kiekvieno fondo pirma diena → pabaigos data.', xlsxDay: 'Dienos lentelė (.xlsx)', xlsxDayTip: 'Toks pat išdėstymas kaip senajame dienos faile (fondas, data, vieneto vertė, grynieji aktyvai): po eilutę kiekvienam fondui pasirinktai dienai; pagal nutylėjimą – naujausia. Jei fondas tą dieną vertės neturi, imama paskutinė ankstesnė.', xlsxFail: 'Nepavyko įkelti Excel bibliotekos (nėra interneto?).', print: 'Spausdinti / PDF',
  viewret: 'Grąža', viewdiff: 'Skirtumas', diffFrom: 'nuo', diffAvg: 'Grupės vidurkio', mDiff: r => `Linijos rodo kiekvieno fondo sukauptą grąžą minus ${r ? r + ' grąža' : 'grupės vidurkis'}, procentais (0 = ${r || 'grupės vidurkis'}).`,
  eventsBtn: 'Rinkų įvykiai', resetZoom: 'Atstatyti mastelį', png: 'Atsisiųsti PNG', zoomHint: 'Patarimas: pele pažymėkite sritį grafike, kad priartintumėte; užveskite pelę ant tiekėjo, kad jį paryškintumėte; paspauskite pavadinimą grafiko dešinėje (arba dukart paspauskite mygtuką), kad jį prisegtumėte.',
  advBtn: 'Papildomi rodikliai (Sharpe koeficientas, geriausi / blogiausi laikotarpiai)', rf: 'Be rizikos palūkanų norma, % per metus', rfAutoBtn: 'Grąžinti €STR',
  hAdv: 'Papildomi rodikliai', thAnn: 'Metinė grąža, laikotarpyje', thSharpe: 'Sharpe koeficientas', thBestD: 'Geriausia diena', thWorstD: 'Blogiausia diena', thBestM: 'Geriausias mėnuo', thWorstM: 'Blogiausias mėnuo',
  thBestY: 'Geriausi metai', thWorstY: 'Blogiausi metai', thPosM: '% teigiamų mėnesių',
  nAdv: 'Skaičiuojama pasirinktam laikotarpiui (geriausi / blogiausi kalendoriniai metai – visa istorija, tik pilni metai). Sharpe = (metinė grąža − be rizikos palūkanų norma) ÷ metinis svyravimas; trumpesniems nei metų laikotarpiams metiniai skaičiai nepatikimi. Mėnesiai = pilni kalendoriniai mėnesiai laikotarpio viduje.',
  notShown: l => `Grafike nerodoma (pradėjo vėliau nei laikotarpio pradžia): ${l}. Pasirinkite trumpesnį laikotarpį, kad juos matytumėte.`,
  capSpan: (l, a, e) => `${l}: ${a} → ${e}`, byGroup: 'pradžia skiriasi pagal grupę', endByGroup: 'pabaiga skiriasi pagal grupę',
  capOv: (h, d) => `${h}; kiekvienas laikotarpis baigiasi savo grupės paskutine diena (iki ${d})`,
  capMetrics: (a, e) => `Laikotarpio stulpeliai: ${a} → ${e}. Stulpeliai „nuo įsteigimo“: kiekvieno fondo pirma diena → ${e}.`,
  capCal: (y0, y1, e) => `Kalendoriniai metai ${y0}–${y1}; paskutinis stulpelis – šie metai iki šiol (iki ${e}).`,
  capRoll: e => `Slenkantys langai, baigiantys ${e}; „Slenkantys 1 metai“ rodikliai naudoja visus 12 mėn. langus fondo istorijoje.`,
  capQP: (e, a) => `Laikotarpiai baigiasi ${e}; „Visa istorija“ prasideda ${a}.`,
  capHm: (p, a, e) => `${p}: mėnesių grąža ${a} → ${e}; pirmas ir paskutinis mėnuo gali būti nepilni.`,
  capAdv: (a, e) => `Laikotarpis ${a} → ${e}; geriausi / blogiausi kalendoriniai metai – visa istorija.`,
  covTitle: 'Duomenų aprėptis', covLater: (p, d) => `${p}: duomenys prasideda ${d} – vėliau nei kitų šios grupės fondų (fondas naujesnis arba ankstesnės istorijos nėra), todėl ilgi laikotarpiai ir rodikliai „nuo įsteigimo“ apima trumpesnę istoriją.`,
  covSeb: 'Ankstesnė istorija dar neįkelta (turimi tik duomenys nuo nurodytos dienos).',
  sumNoData: 'Duomenų nepakanka.', sumLatest: d => `Naujausi duomenys: <b>${d}</b>.`,
  sumLead: (p, k, n) => `<b>${p}</b> pirmavo ${k} iš ${n} amžiaus grupių.`, sumLag: (p, k, n) => `<b>${p}</b> atsiliko ${k} iš ${n} amžiaus grupių.`,
  sumMove: (p, g, v, d) => `Didžiausias vienos dienos pokytis: <b>${p}</b> (${g}) <b>${v}</b>, ${d}.`,
  thGroup: 'Grupė', thLeader: 'Lyderis', thLagger: 'Atsiliekantis', thSpread: 'Skirtumas, %', thMove: 'Didžiausias 1 d. pokytis',
  nSum: 'Skaičiuojama automatiškai iš naujausių kiekvienos amžiaus grupės duomenų; lyderis / atsiliekantis – pagal grąžą pasirinktame lange.',
  info: {
    fee: 'Kiekvieną mėnesį pridedama įmoka, pinigai auga prielaidine grąža, o valdymo mokestis (metinis % ÷ 12) atskaitomas nuo sukaupto turto – taip, kaip II pakopoje (kasdien, jau įskaičiuota į vieneto vertę). „Sumokėta mokesčių“ = visi atskaityti mokesčiai; „Mažesnė suma“ apima ir grąžą, kurią tie pinigai būtų uždirbę. Mokesčiai – bazinis mokestis nuo turto iš Lietuvos banko sąrašo (vieno valdytojo gyvenimo ciklo fondų mokestis vienodas).',
    dd: 'Kilimas = didžiausias vieneto vertės pakilimas nuo žemiausio taško per mėnesį, ketvirtį ar metus; kritimas = didžiausias nuosmukis nuo aukščiausio taško per tą laikotarpį. Kartu jie parodo, kaip plačiai fondas svyravo kiekvieno laikotarpio viduje, o ne tik kuo jis baigėsi. „Linija“ rodo sukauptą grąžą ir kiek kiekvieną dieną fondas buvo žemiau ankstesnės viršūnės – giliausia duobė ir yra didžiausias kritimas.',
    rel: 'Parodo, kiek kiekvienas fondas lenkia savo konkurentus arba atsilieka nuo jų: grąža per pasirinktą laikotarpį minus paprastas (nesvertinis) visų tos pačios amžiaus grupės fondų grąžos vidurkis. Tiekėjų mygtukai tik paslepia juostas – vidurkis visada skaičiuojamas iš visų fondų su šviežiais duomenimis.',
    rf: () => DATA.rf ? `Numatyta: €STR (euro trumpalaikių palūkanų norma), kurią kasdien skelbia Europos centrinis bankas – ${num(DATA.rf.value, 2)} % per metus (${DATA.rf.date}). Tai standartinė nerizikinga norma EUR investuotojams (visi Lietuvos pensijų fondų dalyviai investuoja eurais); ji atnaujinama automatiškai kartu su svetainės duomenimis. Šaltinis: ${DATA.rf.source}. Galite įrašyti savo skaičių; „Grąžinti €STR“ grąžina automatinę reikšmę.` : 'Automatinė €STR norma (Europos centrinis bankas) dar negauta, todėl naudojama 2 % per metus. Galite įrašyti savo skaičių.',
    riskmap: 'Horizontaliai – svyravimas (dienos grąžų standartinis nuokrypis, perskaičiuotas metams) pasirinktu laikotarpiu. Vertikaliai – grąža per tą patį laikotarpį. Aukščiau ir kairiau – geriau: daugiau grąžos už mažesnę riziką. Rodomi tik fondai su šviežiais duomenimis ir bent 20 dienų grąžų.',
    ret: 'Vieneto vertės pokytis tarp laikotarpio pradžios ir pabaigos. Vieneto vertė jau yra po mokesčių ir sąnaudų, todėl papildomai nieko atimti nereikia.',
    rank: 'Kiekvieno tiekėjo vieta savo amžiaus grupėje pagal grąžą pasirinktu laikotarpiu; 1 = geriausia.',
    overall: 'Kiekviena amžiaus grupė × kiekvienas laikotarpis yra vienas palyginimas. Skaičiuojama, kaip dažnai tiekėjas yra pirmas, 1–2 vietoje ir jo vidutinė vieta. Trumpi laikotarpiai triukšmingi, todėl „1 m. ir ilgesni“ dažniausiai teisingesnis.',
    vol: 'Svyravimas = dienos grąžų standartinis nuokrypis × √252 – kiek svyruoja vieneto vertė; didesnis = didesnė rizika. Dienos be kainos pokyčio neįtraukiamos.',
    mdd: 'Didžiausias kritimas = didžiausias nuosmukis nuo viršūnės iki vėlesnio dugno. Rodo blogiausią galimą investuotojo nuostolį.',
    cagr: 'Sudėtinis metinis augimas tarp pirmos ir paskutinės turimos vieneto vertės (rodoma tik bent vienerių metų istorijai).',
    cal: 'Grąža už kiekvienus kalendorinius metus. * = fondas pradėjo veikti tais metais, todėl rodoma tik dalis metų. Paskutinis stulpelis – šie metai iki šiol.',
    roll: 'Grąža per paskutinius 1, 3, 6, 12, 36, 60 mėn. (ilgesnė nei metų – perskaičiuota metine). Slenkantys 1 metai = visi galimi 12 mėn. langai istorijoje: vidurkis, blogiausias, geriausias ir teigiamų dalis.',
    heat: 'Grąža kiekvieną kalendorinį mėnesį (eilutės = metai). Žalia = pelnas, raudona = nuostolis; paskutinis stulpelis – metai.',
    sharpe: 'Sharpe koeficientas = (metinė grąža − be rizikos palūkanų norma) ÷ metinis svyravimas. Didesnis = geresnė grąža vienam rizikos vienetui. Be rizikos normą pasirinkite patys (pvz., indėlių ar trumpų vyriausybės obligacijų pelningumą).',
    bestworst: 'Geriausia / blogiausia viena diena ir kalendorinis mėnuo pasirinktu laikotarpiu bei geriausi / blogiausi pilni kalendoriniai metai per visą istoriją.',
    posm: 'Pilnų kalendorinių mėnesių su teigiama grąža dalis pasirinktame laikotarpyje.',
    idx: 'Punktyrinės linijos ir pilkos eilutės – pasaulio akcijų indeksai palyginimui: MSCI ACWI (viso pasaulio akcijos) ir MSCI World (išsivysčiusios rinkos) – grynosios grąžos (Net Return) indeksai eurais, skelbia MSCI; S&P 500 – su reinvestuotais dividendais (Total Return) doleriais, perskaičiuotas į eurus pagal ECB kursą. Indeksai be jokių mokesčių, o fondų vieneto vertės jau po valdymo mokesčių. Pensijų fondai turi ir obligacijų (ypač vyresnių grupių), todėl kylant rinkoms paprastai atsilieka nuo akcijų, o krizėse krenta mažiau. Lentelėse indekso „nuo pradžios“ = nuo anksčiausio grupės fondo pradžios.',
    events: 'Grafike pažymi svarbius rinkų ir pensijų sistemos įvykius. Užveskite pelę (arba žiūrėkite sąrašą po grafiku), kad pamatytumėte, kas įvyko, ir šaltinį. Pagal nutylėjimą išjungta.',
    summary: 'Sugeneruota automatiškai iš naujausių duomenų: kas pirmauja ir atsilieka per paskutines 7 dienas arba mėnesį kiekvienoje amžiaus grupėje, bei didžiausias vienos dienos pokytis.',
    coverage: 'Kai kurių fondų istorija trumpesnė nei konkurentų.',
  },
});

const PERIOD_IDS = ['1m', '3m', '6m', 'ytd', '1y', '3y', '5y', 'max'];            // lentelėms „pagal laikotarpį“ ir bendram reitingui
const OV_PRESETS = { ovAll: PERIOD_IDS, ovLong: ['1y', '3y', '5y', 'max'] };
const presetRange = (per, end, group, sel) => presetRangeF(per, end, group.funds, per === 'max' ? maxAnchor(group, sel) : 0);
const P = { period: 'ytd', from: '', to: '', group: DATA.groups[0].id, provs: new Set(DATA.providers.map(p => p.id)),
  hmGroup: DATA.groups[0].id, hl: null, pin: null, view: 'ret', diffRef: 'avg', zoom: null, events: false, adv: false, cs: null, rf: null, hmProv: null, sumWin: 'sel', ovP: new Set(['1y', '3y', '5y', 'max']), gx: false, idx: new Set(['MSCI_ACWI', 'SP500']) };
const $ = id => document.getElementById(id);
const byId = id => DATA.groups.find(g => g.id === id);

/* ---------- būsenos išsaugojimas (naršyklėje) ir dalijimosi nuoroda ---------- */
function saveState() {
  try { localStorage.setItem('perfState', JSON.stringify({ period: P.period, from: P.from, to: P.to, group: P.group, provs: [...P.provs], adv: P.adv, rfUser: P.rf, view: P.view, diffRef: P.diffRef, hmProv: P.hmProv, hmGroup: P.hmGroup, sumWin: P.sumWin, ovP: [...P.ovP], gx: P.gx, idx: [...P.idx] })); } catch (e) {}
}
function applyState(s) {
  if (!s) return;
  if (PRESET_IDS.includes(s.period) || s.period === 'custom' || isCalPeriod(s.period)) P.period = s.period;
  if (typeof s.from === 'string') P.from = s.from; if (typeof s.to === 'string') P.to = s.to;
  if (s.group === 'all' || byId(s.group)) P.group = s.group;
  if (byId(s.hmGroup)) P.hmGroup = s.hmGroup;
  if (Array.isArray(s.provs)) { const v = s.provs.filter(id => DATA.providers.some(p => p.id === id)); if (v.length) P.provs = new Set(v); }
  if (s.view === 'ret' || s.view === 'diff') P.view = s.view;
  if (s.diffRef === 'avg' || DATA.providers.some(p => p.id === s.diffRef)) P.diffRef = s.diffRef;
  if (typeof s.adv === 'boolean') P.adv = s.adv;
  if (typeof s.rfUser === 'number' && isFinite(s.rfUser)) P.rf = s.rfUser;   // tik paties įrašyta norma; kitaip – €STR
  if (typeof s.rf === 'number' && isFinite(s.rf) && s.fromUrl) P.rf = s.rf;
  if (s.hmProv && DATA.providers.some(p => p.id === s.hmProv)) P.hmProv = s.hmProv;
  if (s.sumWin === 'sel' || s.sumWin === '1w' || s.sumWin === '1m') P.sumWin = s.sumWin;
  if (s.ovH === 'all') P.ovP = new Set(PERIOD_IDS);                                   // senos nuorodos / išsaugota būsena
  if (Array.isArray(s.ovP)) { const v = s.ovP.filter(x => PERIOD_IDS.includes(x)); if (v.length) P.ovP = new Set(v); }
  if (typeof s.gx === 'boolean') P.gx = s.gx;
  if (Array.isArray(s.idx)) P.idx = new Set(s.idx.filter(x => IDX_META[x]));
}
function loadHash() {
  const q = new URLSearchParams(location.hash.slice(1)); if (![...q.keys()].length) return;
  const s = {};
  if (q.get('p')) s.period = q.get('p'); if (q.get('f')) s.from = q.get('f'); if (q.get('t')) s.to = q.get('t'); if (q.get('g')) s.group = q.get('g');
  if (q.get('v')) s.provs = q.get('v').split(','); if (q.get('rf')) { s.rf = parseFloat(q.get('rf')); s.fromUrl = true; } if (q.get('adv')) s.adv = q.get('adv') === '1';
  if (q.get('vw')) s.view = q.get('vw'); if (q.get('dr')) s.diffRef = q.get('dr'); if (q.get('hm')) s.hmProv = q.get('hm'); if (q.get('sw')) s.sumWin = q.get('sw'); if (q.get('oh')) s.ovH = q.get('oh'); if (q.get('op')) s.ovP = q.get('op').split(','); if (q.get('gx')) s.gx = q.get('gx') === '1'; if (q.has('ix')) s.idx = q.get('ix') ? q.get('ix').split(',') : [];
  applyState(s);
  if (q.get('l') === 'en' || q.get('l') === 'lt') lang = q.get('l');
  if (q.get('ev') === '1') P.events = true;
  if (q.get('z')) { const z = q.get('z').split('_').map(dayOf); if (z.length === 2 && z[0] < z[1]) P.zoom = z; }
}
function shareUrl() {
  const q = new URLSearchParams();
  q.set('p', P.period); if (P.period === 'custom') { q.set('f', P.from); q.set('t', P.to); }
  q.set('g', P.group); q.set('v', [...P.provs].join(',')); q.set('l', lang);
  if (P.events) q.set('ev', '1'); if (P.zoom) q.set('z', iso(P.zoom[0]) + '_' + iso(P.zoom[1]));
  if (P.adv) { q.set('adv', '1'); if (P.rf !== null) q.set('rf', P.rf); }
  if (P.view !== 'ret') { q.set('vw', P.view); q.set('dr', P.diffRef); }
  q.set('sw', P.sumWin); q.set('op', [...P.ovP].join(',')); if (P.gx) q.set('gx', '1'); if (P.hmProv) q.set('hm', P.hmProv); q.set('ix', [...P.idx].join(','));
  return location.origin === 'null' ? location.href.split('#')[0] + '#' + q : location.origin + location.pathname + '#' + q;
}
/* Datos negalima rinkti vėliau nei naujausi turimi duomenys (fondai skelbia ankstesnės darbo dienos vertę, šiandienos nebūna) */
const LATEST = Math.max(...DATA.groups.map(g => groupEnd(g).end)), EARLIEST = Math.min(...DATA.groups.flatMap(g => g.funds.map(f => f.d[0])));
function normalizeDates(changed) {
  const fix = v => { if (!v) return ''; const d = dayOf(v); return isNaN(d) ? '' : iso(Math.min(Math.max(d, EARLIEST), LATEST)); };
  P.from = fix(P.from); P.to = fix(P.to);
  if (P.from && P.to && P.from > P.to) { if (changed === 'to') P.from = P.to; else P.to = P.from; }
}
try { applyState(JSON.parse(localStorage.getItem('perfState'))); } catch (e) {}
loadHash(); normalizeDates();

/* ---------- laikotarpis ---------- */
/* „Visa istorija“ = nuo ankstyviausio fondo pradžios (vėliau pradėję fondai rodomi „–“ / negrafikuojami).
   sel = true: skaičiuojama tik iš pasirinktų tiekėjų (grafikui ir lentelėms po juo). */
const maxAnchor = (group, sel) => maxAnchorOf(group.funds.filter(f => !sel || P.provs.has(f.provider)));
function rangeFor(group, sel) {
  const { end: commonEnd, overallLast } = groupEnd(group);
  if (P.period === 'custom') {
    const anchor = P.from ? dayOf(P.from) : maxAnchor(group, sel);
    const end = P.to ? Math.min(dayOf(P.to), commonEnd) : commonEnd;
    return { anchor, end, overallLast };
  }
  return { ...presetRange(P.period, commonEnd, group, sel), overallLast };
}
const rangeAt = (group, per) => { const { end, overallLast } = groupEnd(group); return { ...presetRange(per, end, group, false), overallLast }; };
const setCap = (id, t) => { const e = $('c_' + id); if (e) e.textContent = t; };
function spanText(label, rngs) {                         // laikotarpio datos per visas grupes
  const A = rngs.map(r => r.anchor), E = rngs.map(r => r.end), a0 = Math.min(...A), a1 = Math.max(...A), e0 = Math.min(...E), e1 = Math.max(...E);
  const a = a0 === a1 ? iso(a0) : `${iso(a0)}…${iso(a1)} (${T().byGroup})`, e = e0 === e1 ? iso(e0) : `${iso(e0)}…${iso(e1)}`;
  return T().capSpan(label, a, e);
}
const periodText = () => P.period === 'custom' ? `${P.from || '…'} → ${P.to || '…'}` : periodLabel(P.period);
const isStale = (f, overallLast) => f.d[f.d.length - 1] < overallLast - 5;
const ik = k => `<button type="button" class="info" data-k="${k}" aria-label="info">i</button>`;
const th = (label, k, style = '') => `<th${style ? ` style="${style}"` : ''}>${label}${k ? ik(k) : ''}</th>`;

/* ---------- skaičiavimai ---------- */
function stdev(a) { const n = a.length; if (n < 2) return null; const m = a.reduce((s, x) => s + x, 0) / n; return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (n - 1)); }
function riskStats(f, ia, ie) {            // svyravimas ir didžiausias kritimas tarp indeksų
  const r = []; let peak = f.v[ia], mdd = 0;
  for (let i = ia + 1; i <= ie; i++) {
    const x = f.v[i] / f.v[i - 1] - 1; if (x !== 0) r.push(x);
    if (f.v[i] > peak) peak = f.v[i];
    mdd = Math.min(mdd, f.v[i] / peak - 1);
  }
  const sd = r.length >= 20 ? stdev(r) : null;
  return { vol: sd === null ? null : sd * Math.sqrt(252) * 100, mdd: mdd * 100 };
}
function fundStats(f, rng) {
  if (isStale(f, rng.overallLast)) return null;
  const s = seriesOf(f, rng.anchor, rng.end);
  const ie = lastOnOrBefore(f, rng.end);
  const out = { f, ret: null, points: [], vol: null, mdd: null, cagr: null, volAll: null, mddAll: null, inception: f.d[0] };
  if (s) { out.ret = s.ret; out.points = s.points; const rs = riskStats(f, s.ia, s.ie); out.vol = rs.vol; out.mdd = rs.mdd; }
  if (ie > 0) {
    const days = f.d[ie] - f.d[0];
    if (days >= 365) out.cagr = (Math.pow(f.v[ie] / f.v[0], 365.25 / days) - 1) * 100;
    const ra = riskStats(f, 0, ie); out.volAll = ra.vol; out.mddAll = ra.mdd;
  }
  return out;
}
function calendarReturns(f, endDay) {
  const last = new Date(endDay * DAY).getUTCFullYear(), first = new Date(f.d[0] * DAY).getUTCFullYear(), out = {};
  for (let y = first; y <= last; y++) {
    const yEnd = y === last ? endDay : Math.round(Date.UTC(y, 11, 31) / DAY);
    const ie = lastOnOrBefore(f, yEnd);
    let ia = lastOnOrBefore(f, Math.round(Date.UTC(y - 1, 11, 31) / DAY)), partial = false;
    if (ia < 0) { ia = 0; partial = f.d[0] > Math.round(Date.UTC(y, 0, 7) / DAY); }
    if (ie > ia) out[y] = { ret: (f.v[ie] / f.v[ia] - 1) * 100, partial };
  }
  return out;
}
function rolling(f, endDay) {
  const ie = lastOnOrBefore(f, endDay), out = {};
  [1, 3, 6, 12, 36, 60].forEach(h => {
    const ia = lastOnOrBefore(f, shiftMonths(endDay, h));
    if (ia < 0 || f.d[0] > shiftMonths(endDay, h) || ie <= ia) { out[h] = null; return; }
    const r = f.v[ie] / f.v[ia] - 1;
    out[h] = (h > 12 ? Math.pow(1 + r, 12 / h) - 1 : r) * 100;
  });
  const wins = [];
  for (let i = 0; i <= ie; i++) {
    if (f.d[i] - 365 < f.d[0]) continue;
    const ja = lastOnOrBefore(f, f.d[i] - 365); if (ja < 0) continue;
    wins.push((f.v[i] / f.v[ja] - 1) * 100);
  }
  if (wins.length > 20) out.r1 = { avg: wins.reduce((s, x) => s + x, 0) / wins.length, min: Math.min(...wins), max: Math.max(...wins), pos: wins.filter(x => x > 0).length / wins.length * 100 };
  return out;
}
const monthEnd = (y, m) => Math.round(Date.UTC(y, m + 1, 0) / DAY);
function monthlyReturns(f, endDay) {          // {metai: {mėn. 0-11: grąža %}}
  const out = {}, d0 = new Date(f.d[0] * DAY), dE = new Date(endDay * DAY);
  let y = d0.getUTCFullYear(), m = d0.getUTCMonth(), prev = -1;
  while (y < dE.getUTCFullYear() || (y === dE.getUTCFullYear() && m <= dE.getUTCMonth())) {
    const me = Math.min(monthEnd(y, m), endDay), ie = lastOnOrBefore(f, me);
    const base = prev >= 0 ? prev : 0;
    if (ie > base) { (out[y] = out[y] || {})[m] = (f.v[ie] / f.v[base] - 1) * 100; }
    if (ie >= 0) prev = ie;
    m++; if (m > 11) { m = 0; y++; }
  }
  return out;
}
function advStats(f, rng, rf) {
  const s = seriesOf(f, rng.anchor, rng.end); if (!s) return null;
  const { ia, ie } = s, days = f.d[ie] - f.d[ia];
  let bestD = null, worstD = null;
  for (let i = ia + 1; i <= ie; i++) {
    const x = (f.v[i] / f.v[i - 1] - 1) * 100;
    if (!bestD || x > bestD.v) bestD = { v: x, d: f.d[i] };
    if (!worstD || x < worstD.v) worstD = { v: x, d: f.d[i] };
  }
  const months = []; let cur = new Date(rng.anchor * DAY), y = cur.getUTCFullYear(), m = cur.getUTCMonth();
  if (monthEnd(y, m) < rng.anchor) { m++; }
  const bounds = [];
  for (let k = 0; k < 2000; k++) { const yy = y + Math.floor((m + k) / 12), mm = (m + k) % 12, b = monthEnd(yy, mm); if (b > rng.end) break; if (b >= rng.anchor && f.d[0] <= b) bounds.push(b); }
  for (let i = 1; i < bounds.length; i++) { const a = lastOnOrBefore(f, bounds[i - 1]), b = lastOnOrBefore(f, bounds[i]); if (a >= 0 && b > a) months.push({ v: (f.v[b] / f.v[a] - 1) * 100, d: bounds[i] }); }
  const bestM = months.length ? months.reduce((a, b) => b.v > a.v ? b : a) : null, worstM = months.length ? months.reduce((a, b) => b.v < a.v ? b : a) : null;
  const cal = calendarReturns(f, groupEnd({ funds: [f] }).end), lastY = new Date(f.d[f.d.length - 1] * DAY).getUTCFullYear();
  const full = Object.entries(cal).filter(([yr, c]) => !c.partial && !(Number(yr) === lastY && f.d[f.d.length - 1] < Math.round(Date.UTC(lastY, 11, 28) / DAY))).map(([yr, c]) => ({ y: Number(yr), v: c.ret }));
  const bestY = full.length ? full.reduce((a, b) => b.v > a.v ? b : a) : null, worstY = full.length ? full.reduce((a, b) => b.v < a.v ? b : a) : null;
  const ann = days >= 30 ? (Math.pow(1 + s.ret / 100, 365.25 / days) - 1) * 100 : null, vol = riskStats(f, ia, ie).vol;
  return { ann, vol, sharpe: ann !== null && vol ? (ann - rf) / vol : null, bestD, worstD, bestM, worstM, bestY, worstY, posM: months.length ? months.filter(x => x.v > 0).length / months.length * 100 : null };
}
function rankOf(values) {                   // values: [{key, v}] -> Map key -> vieta (didesnė reikšmė = geresnė)
  const ok = values.filter(o => o.v !== null && o.v !== undefined).sort((a, b) => b.v - a.v), map = new Map();
  ok.forEach((o, i) => map.set(o.key, i + 1)); return { map, n: ok.length };
}
const rkClass = (rank, n) => (!rank || n < 2) ? '' : 'rk' + (Math.round((rank - 1) / (n - 1) * 5) + 1);
const MARKET_ORDER = ['SEB', 'SWEDBANK', 'ARTEA', 'ALLIANZ', 'LUMINOR', 'GOINDEX'];   // lentelių stulpelių tvarka
const marketProvs = () => MARKET_ORDER.map(id => DATA.providers.find(p => p.id === id));
const retOf = (g, pid, rng) => { const f = g.funds.find(x => x.provider === pid); if (!f || isStale(f, rng.overallLast)) return null; const s = seriesOf(f, rng.anchor, rng.end); return s ? s.ret : null; };
const fmtP = (v, p = 1) => pct(v, p).replace(' %', '%');

/* ---------- 0. automatinė santrauka ---------- */
function renderSummary() {
  syncSumWin();
  $('hSum').innerHTML = T().hSum + ik('summary'); $('nSum').textContent = T().nSum;
  const rows = []; const lead = {}, lag = {}; let move = null, latest = 0, ng = 0;
  DATA.groups.forEach(g => {
    const { end: gEnd, overallLast } = groupEnd(g); latest = Math.max(latest, gEnd);
    let anchor, end = gEnd;
    if (P.sumWin === 'sel') { const r = rangeFor(g, false); anchor = r.anchor; end = r.end; }
    else anchor = P.sumWin === '1w' ? gEnd - 7 : shiftMonths(gEnd, 1);
    const items = [];
    g.funds.forEach(f => {
      if (isStale(f, overallLast)) return;
      const s = seriesOf(f, anchor, end); if (!s) return;
      items.push({ p: f.provider, r: s.ret });
      for (let i = s.ia + 1; i <= s.ie; i++) { const x = (f.v[i] / f.v[i - 1] - 1) * 100; if (!move || Math.abs(x) > Math.abs(move.v)) move = { p: f.provider, g, v: x, d: f.d[i] }; }
    });
    if (items.length < 2) return;
    items.sort((a, b) => b.r - a.r); ng++;
    const a = items[0], b = items[items.length - 1];
    lead[a.p] = (lead[a.p] || 0) + 1; lag[b.p] = (lag[b.p] || 0) + 1;
    rows.push({ g, a, b, anchor, end });
  });
  const top = o => Object.entries(o).sort((x, y) => y[1] - x[1])[0];
  const parts = [T().sumLatest(iso(latest))];
  if (top(lead)) { const [p, k] = top(lead); parts.push(T().sumLead(labelOf(p), k, ng)); }
  if (top(lag)) { const [p, k] = top(lag); parts.push(T().sumLag(labelOf(p), k, ng)); }
  if (move) parts.push(T().sumMove(labelOf(move.p), groupLabel(move.g), fmtP(move.v, 2), iso(move.d)));
  $('sumText').innerHTML = ng ? `<p class="sumline">${parts.join(' ')}</p>` : `<p class="na">${T().sumNoData}</p>`;
  const cellMove = (g, anchor, end) => {
    let best = null; g.funds.forEach(f => { if (isStale(f, groupEnd(g).overallLast)) return; const s = seriesOf(f, anchor, end); if (!s) return; for (let i = s.ia + 1; i <= s.ie; i++) { const x = (f.v[i] / f.v[i - 1] - 1) * 100; if (!best || Math.abs(x) > Math.abs(best.v)) best = { p: f.provider, v: x, d: f.d[i] }; } });
    return best ? `${labelOf(best.p)} ${fmtP(best.v, 2)} <span class="na">${iso(best.d)}</span>` : '–';
  };
  const sw = p => `<span class="sw" style="background:${colorOf(p)}"></span>`;
  if (rows.length) setCap('tSum', spanText(winLabel(P.sumWin), rows));
  $('tSum').innerHTML = `<thead><tr><th style="text-align:left">${T().thGroup}</th><th>${T().thLeader}</th><th>${T().thLagger}</th><th>${T().thSpread}</th><th>${T().thMove}</th></tr></thead><tbody>`
    + rows.map(r => `<tr><td style="text-align:left">${groupLabel(r.g)}</td><td>${sw(r.a.p)}${labelOf(r.a.p)} ${fmtP(r.a.r, 2)}</td><td>${sw(r.b.p)}${labelOf(r.b.p)} ${fmtP(r.b.r, 2)}</td><td>${num(r.a.r - r.b.r, 2)}</td><td>${cellMove(r.g, r.anchor, r.end)}</td></tr>`).join('') + '</tbody>';
}

/* ---------- 1. visos rinkos lentelės ---------- */
function renderMarket() {
  $('hMarket').textContent = T().hMarket; $('hRet').innerHTML = T().hRet + ik('ret'); $('hRank').innerHTML = T().hRank + ik('rank');
  $('mMarket').textContent = T().mMarket(periodText()); $('nMarket').textContent = T().nMarket;
  const provs = marketProvs();
  const head = `<thead><tr><th></th>${provs.map(p => `<th><span class="sw-top" style="background:${colorOf(p.id)}"></span>${p.label}</th>`).join('')}</tr></thead>`;
  // eilutės pagal riziką: viršuje turto išsaugojimo, toliau vyresni, jauniausi (2003–2009) apačioje
  const gxStarts = [];
  const rows = DATA.groups.slice().reverse().map(g => {
    const rng = rangeFor(g), vals = {};
    if (P.gx) {                                   // visi nuo Goindex fondo pradžios (arba nuo vėlesnės laikotarpio pradžios)
      const gf = g.funds.find(f => f.provider === 'GOINDEX');
      if (gf) { rng.anchor = Math.max(rng.anchor, gf.d[0]); gxStarts.push(gf.d[0]); }
    }
    g.rngM = rng;
    provs.forEach(p => { vals[p.id] = retOf(g, p.id, rng); });
    const { map, n } = rankOf(provs.map(p => ({ key: p.id, v: vals[p.id] })));
    return { g, vals, ranks: map, n };
  });
  const avgRet = {}, avgRank = {};
  provs.forEach(p => {
    const r = rows.map(x => x.vals[p.id]).filter(v => v !== null), k = rows.map(x => x.ranks.get(p.id)).filter(v => v);
    avgRet[p.id] = r.length ? r.reduce((s, x) => s + x, 0) / r.length : null;
    avgRank[p.id] = k.length ? k.reduce((s, x) => s + x, 0) / k.length : null;
  });
  const arRank = rankOf(provs.map(p => ({ key: p.id, v: avgRet[p.id] }))), akRank = rankOf(provs.map(p => ({ key: p.id, v: avgRank[p.id] === null ? null : -avgRank[p.id] })));
  const retBody = rows.map(r => `<tr><td>${groupShort(r.g)}</td>${provs.map(p => { const v = r.vals[p.id]; return v === null ? '<td class="na">–</td>' : `<td class="${rkClass(r.ranks.get(p.id), r.n)}">${pct(v, 1)}</td>`; }).join('')}</tr>`).join('')
    + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => avgRet[p.id] === null ? '<td class="na">–</td>' : `<td class="${rkClass(arRank.map.get(p.id), arRank.n)}">${pct(avgRet[p.id], 1)}</td>`).join('')}</tr>`;
  const rankBody = rows.map(r => `<tr><td>${groupShort(r.g)}</td>${provs.map(p => { const k = r.ranks.get(p.id); return k ? `<td class="${rkClass(k, r.n)}">${k}</td>` : '<td class="na">–</td>'; }).join('')}</tr>`).join('')
    + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => avgRank[p.id] === null ? '<td class="na">–</td>' : `<td class="${rkClass(akRank.map.get(p.id), akRank.n)}">${num(avgRank[p.id], 1)}</td>`).join('')}</tr>`;
  const spanAll = spanText(periodText() + (P.gx ? ' · ' + T().gxBtn : ''), rows.map(r => r.g.rngM));
  $('btnGx').textContent = T().gxBtn; $('btnGx').setAttribute('aria-pressed', P.gx);
  const gxa = Math.min(...gxStarts), gxb = Math.max(...gxStarts);
  $('nGx').hidden = !P.gx; $('nGx').textContent = P.gx && gxStarts.length ? T().gxNote(gxa === gxb ? iso(gxa) : `${iso(gxa)}…${iso(gxb)}`) : '';
  ['tRet', 'tRank'].forEach(id => setCap(id, spanAll));
  $('tRet').innerHTML = head + `<tbody>${retBody}</tbody>`;
  $('tRank').innerHTML = head + `<tbody>${rankBody}</tbody>`;
  renderOverall();
}

/* bendras reitingas: visos grupės × laikotarpiai */
function renderOverall() {
  $('hOv').innerHTML = T().hOv; $('lblOvP').textContent = T().ovPick;
  $('ovPers').querySelectorAll('button').forEach(b => { b.textContent = T().periods[b.dataset.p]; b.setAttribute('aria-pressed', P.ovP.has(b.dataset.p)); });
  const isSet = ids => ids.length === P.ovP.size && ids.every(x => P.ovP.has(x));
  $('ovPreset').querySelectorAll('button').forEach(b => { b.textContent = T()[b.dataset.k]; b.setAttribute('aria-pressed', isSet(OV_PRESETS[b.dataset.k])); });
  const pers = PERIOD_IDS.filter(p => P.ovP.has(p)), st = {}, perTxt = pers.map(p => T().periods[p]).join(', ');
  setCap('tOv', T().capOv(perTxt, iso(LATEST)));
  $('nOv').textContent = T().nOv(perTxt, DATA.groups.length);
  DATA.providers.forEach(p => { st[p.id] = { cmp: 0, first: 0, top2: 0, rs: 0 }; });
  DATA.groups.forEach(g => pers.forEach(per => {
    const rng = rangeAt(g, per), vals = DATA.providers.map(p => ({ key: p.id, v: retOf(g, p.id, rng) })), { map, n } = rankOf(vals);
    if (n < 3) return;
    map.forEach((rank, id) => { const s = st[id]; s.cmp++; s.rs += rank; if (rank === 1) s.first++; if (rank <= 2) s.top2++; });
  }));
  const list = DATA.providers.filter(p => st[p.id].cmp).map(p => ({ id: p.id, ...st[p.id], avg: st[p.id].rs / st[p.id].cmp })).sort((a, b) => a.avg - b.avg);
  const bst = (k, dir) => Math.max(...list.map(x => dir * x[k]));
  const mark = (v, k, dir, txt) => `<td class="${dir * v === bst(k, dir) ? 'best' : ''}">${txt}</td>`;
  const bFirst = Math.max(...list.map(x => x.first / x.cmp)), bTop2 = Math.max(...list.map(x => x.top2 / x.cmp)), bAvg = Math.min(...list.map(x => x.avg));
  $('tOv').innerHTML = `<thead><tr>${th(T().thRank, 'overall')}<th style="text-align:left">${T().thFund}</th><th>${T().thCmp}</th><th>${T().thFirst}</th><th>${T().thFirstPct}</th><th>${T().thTop2}</th><th>${T().thAvgRank}</th></tr></thead><tbody>`
    + list.map((x, i) => `<tr><td class="n">${i + 1}</td><td class="name"><span class="sw" style="background:${colorOf(x.id)}"></span>${labelOf(x.id)}</td><td>${x.cmp}</td><td>${x.first}</td><td class="${x.first / x.cmp === bFirst ? 'best' : ''}">${num(x.first / x.cmp * 100, 0)}%</td><td class="${x.top2 / x.cmp === bTop2 ? 'best' : ''}">${num(x.top2 / x.cmp * 100, 0)}%</td><td class="${x.avg === bAvg ? 'best' : ''}">${num(x.avg, 2)}</td></tr>`).join('') + '</tbody>';
}

/* ---------- 2. fondų palyginimas ---------- */
let chartState = null;
P.mr = 16;                                               // dešinė paraštė: grafikas „susispaudžia“ užvedus pelę, kad tilptų legenda
function paintChart() { const cs = chartState; if (cs) cs.ctl = drawLineChart($('chart'), cs.series, cs.x0, cs.x1, Object.assign({}, cs.opt, { mr: P.mr })); }
let mrAnim = 0;
function animateMr(target) {
  cancelAnimationFrame(mrAnim);
  const step = () => { P.mr += (target - P.mr) * 0.35; if (Math.abs(target - P.mr) < 1) P.mr = target; paintChart(); if (P.mr !== target) mrAnim = requestAnimationFrame(step); };
  mrAnim = requestAnimationFrame(step);
}
let chartRef = null;
/* grafiko pradžia: pagal laikotarpį (numatyta), nuo pasirinkto fondo pradžios arba nuo jauniausio fondo pradžios */
function chartStart(g, fs, rng) {
  const starts = fs.map(f => ({ id: f.provider, d: f.d[0] }));
  const young = starts.length ? Math.max(...starts.map(x => x.d)) : null;
  const sel = $('csSel'), cur = P.cs;
  sel.innerHTML = `<option value="">${T().csPeriod}</option><option value="young">${T().csYoung}${young !== null ? ` (${iso(young)})` : ''}</option>`
    + starts.slice().sort((a, b) => a.d - b.d).map(x => `<option value="${x.id}">${T().csFrom(labelOf(x.id))} (${iso(x.d)})</option>`).join('');
  sel.value = cur && (cur === 'young' || starts.some(x => x.id === cur)) ? cur : '';
  $('csLbl').textContent = T().csLbl;
  if (!sel.value) return null;
  const d = cur === 'young' ? young : starts.find(x => x.id === cur).d;
  return d < rng.end ? d : null;
}
function drawChart() {
  if (P.group === 'all') return;
  const g = byId(P.group), rng = rangeFor(g, true);
  const fs = g.funds.filter(f => P.provs.has(f.provider) && !isStale(f, rng.overallLast));
  const cs = chartStart(g, fs, rng), a0 = cs ?? rng.anchor;
  const x0 = P.zoom ? P.zoom[0] : a0, x1 = P.zoom ? Math.min(P.zoom[1], rng.end) : rng.end;
  const series = buildSeries(fs, x0, x1);
  const sortedEv = EVENTS.map((e, i) => ({ day: dayOf(e.day), n: i + 1, title: e[lang].t, text: e[lang].d, src: e.src })).sort((a, b) => a.day - b.day);
  if (P.view === 'diff') {                                       // skirtumas nuo grupės vidurkio arba pasirinkto tiekėjo,
    const refS = P.diffRef !== 'avg' ? buildSeries(g.funds.filter(f => !isStale(f, rng.overallLast)), x0, x1).find(r => r.provider === P.diffRef) : null;
    if (refS) {
      const lvl = d => { let v = null; for (let i = refS.points.length - 1; i >= 0; i--) if (refS.points[i][0] <= d) { v = refS.points[i][1]; break; } return v; };
      series.forEach(r => { r.points = r.points.map(([d, v]) => { const rv = lvl(d); return rv === null ? null : [d, v - rv]; }).filter(Boolean); });
    } else if (series.length > 1) {
      const days = [...new Set(series.flatMap(r => r.points.map(p => p[0])))].sort((a, b) => a - b), idx = series.map(() => 0), out = series.map(() => []);
      days.forEach(d => {
        const v = series.map((r, k) => { while (idx[k] + 1 < r.points.length && r.points[idx[k] + 1][0] <= d) idx[k]++; return r.points[0][0] <= d ? r.points[idx[k]][1] : null; });
        const ok = v.filter(x => x !== null), avg = ok.reduce((a, b) => a + b, 0) / ok.length;
        v.forEach((x, k) => { if (x !== null) out[k].push([d, x - avg]); });
      });
      series.forEach((r, k) => { r.points = out[k]; });
    }
    chartRef = refS ? labelOf(P.diffRef) : null;
  }
  if (P.view !== 'diff') idxFunds().filter(f => P.idx.has(f.id)).forEach(f => {      // pasaulio akcijų indeksai – punktyrinės linijos
    const s = seriesOf(f, x0, x1); if (s && s.points.length > 1) series.push({ provider: f.provider, label: f.label, color: f.color, dash: f.dash, points: s.points });
  });
  const evs = P.events ? sortedEv.filter(e => e.day >= x0 && e.day <= x1) : [];
  $('mChart').textContent = (P.zoom ? T().mZoom(groupLabel(g), iso(x0), iso(x1)) : T().mChart(groupLabel(g), `${cs !== null ? $('csSel').selectedOptions[0].textContent.replace(/ \(.*\)$/, '') : periodText()} (${iso(a0)} → ${iso(rng.end)})`)) + (P.view === 'diff' ? ' ' + T().mDiff(chartRef) : '');
  const late = series.hidden.map(h => `${labelOf(h.provider)} (${iso(h.start)})`);
  if (late.length) $('mChart').textContent += ' ' + T().notShown(late.join(', '));
  $('resetZoom').hidden = !P.zoom;
  const diff = P.view === 'diff', unit = ' %', W = $('chart').clientWidth || 600;
  const opt = { events: evs, hl: P.pin || P.hl, height: Math.max(300, Math.min(520, Math.round(W * 0.42))), unit, axisUnit: '%',
    onZoom: (a, b) => { P.zoom = [a, b]; drawChart(); }, onPick: id => { P.pin = P.pin === id ? null : id; drawChart(); } };
  chartState = { ctl: null, series, x0, x1, evs, opt };
  paintChart();
  const fin = $('finals'); const narrow = W <= 560;                    // siaurame ekrane galutinės reikšmės – po grafiku
  fin.innerHTML = narrow ? series.map(r => ({ r, v: r.points[r.points.length - 1][1] })).sort((a, b) => b.v - a.v).map(o => `<span><i style="background:${o.r.color || colorOf(o.r.provider)}"></i>${o.r.label || labelOf(o.r.provider)} <b>${pct(o.v, 1).replace(' %', '%')}</b></span>`).join('') : '';
  $('evList').innerHTML = evs.map(e => `<li><span class="n">${e.n}</span><div><b>${iso(e.day)} · ${e.title}</b> – ${e.text} <span class="na">(${e.src.map(s => `<a href="${s.u}" target="_blank" rel="noopener">${s.n}</a>`).join(', ')})</span></div></li>`).join('');
}
function renderIdxChips() {
  $('idxChips').innerHTML = idxFunds().map(f => `<button type="button" class="chip" data-idx="${f.id}" aria-pressed="${P.idx.has(f.id)}"><span class="sw" style="background:${f.color}"></span>${f.label}</button>`).join('');
}
/* Indekso eilutė lentelėms: tie patys rodikliai, kaip fondų, bet „nuo pradžios“ – nuo anksčiausio grupės fondo pradžios */
function idxStats(f, rng, start) {
  const s = seriesOf(f, rng.anchor, rng.end), ia = lastOnOrBefore(f, start), ie = lastOnOrBefore(f, rng.end);
  const out = { f, idx: true, ret: null, vol: null, mdd: null, cagr: null, volAll: null, mddAll: null, inception: start };
  if (s) { out.ret = s.ret; const rs = riskStats(f, s.ia, s.ie); out.vol = rs.vol; out.mdd = rs.mdd; }
  if (ia >= 0 && ie > ia) { const days = f.d[ie] - f.d[ia]; if (days >= 365) out.cagr = (Math.pow(f.v[ie] / f.v[ia], 365.25 / days) - 1) * 100; const ra = riskStats(f, ia, ie); out.volAll = ra.vol; out.mddAll = ra.mdd; }
  return out;
}
const grpStart = g => Math.min(...g.funds.map(f => f.d[0]));
const idxOf = pt => pt.g.id === 'turto' ? [] : idxFunds().filter(f => P.idx.has(f.id));     // turto išsaugojimo fondų su akcijomis nelyginame
const idxName = f => `<td class="name"><span class="sw" style="background:${f.color}"></span><i>${f.label}</i></td>`;
const idxSince = (f, start) => { const ia = Math.max(0, lastOnOrBefore(f, start)); return { d: f.d.slice(ia), v: f.v.slice(ia) }; };
function renderCoverage(gs, ALL) {
  const lines = [];
  gs.forEach(g => {
    const firsts = g.funds.map(f => ({ f, d: f.d[0] })), earliest = Math.min(...firsts.map(x => x.d));
    firsts.forEach(({ f, d }) => {
      const sebGap = f.provider === 'SEB' && g.id === '1989-1995' && d >= dayOf('2023-10-01');
      if (d - earliest > 31 || sebGap) {
        let t = T().covLater(labelOf(f.provider), iso(d));
        if (ALL) t = `${groupLabel(g)}: ${t}`;
        if (sebGap) t += ' ' + T().covSeb;
        lines.push(t);
      }
    });
  });
  const c = $('cov'); c.hidden = !lines.length;
  c.innerHTML = lines.length ? `<b>${T().covTitle}</b>${ik('coverage')}` + lines.map(l => `<div>${l}</div>`).join('') : '';
}
let lastParts = [];
// heatmap lentelėse – trumpas pavadinimas, kad neužliptų ant langelių (auditas #18)
const groupShort = g => g.id === 'turto' && lang === 'lt' ? '<abbr class="tif" title="Turto išsaugojimo fondas">TIF</abbr>' : groupLabel(g);
const groupName = id => id === 'all' ? T().allFunds : groupLabel(byId(id));
function renderFunds() {
  const ALL = P.group === 'all', gs = ALL ? DATA.groups : [byId(P.group)];
  $('hFund').textContent = T().hFund; $('lblGroup').textContent = T().group;
  $('hMetrics').innerHTML = T().hMetrics + ik('ret'); $('hCal').innerHTML = T().hCal + ik('cal'); $('hRoll').innerHTML = T().hRoll + ik('roll'); $('nFund').textContent = T().nFund;
  $('hQP').innerHTML = T().hQP + ik('rank'); $('hHm').innerHTML = T().hHm + ik('heat');
  const parts = gs.map(g => {
    const rng = rangeFor(g, true);
    const all = g.funds.filter(f => P.provs.has(f.provider)).map(f => { const s = fundStats(f, rng); if (s) s.g = g; return s; }).filter(Boolean);
    all.sort((a, b) => (b.ret ?? -1e9) - (a.ret ?? -1e9));
    return { g, rng, all };
  });
  lastParts = parts;
  const rngs = parts.map(x => x.rng);
  $('chartCard').hidden = ALL; $('allNote').hidden = !ALL; $('allNote').textContent = T().allNote;
  if (ALL) { $('cov').hidden = false; renderCoverage(gs, true); } else { drawChart(); renderCoverage(gs, false); }

  setCap('tMetrics', ALL ? spanText(periodText(), rngs) + '. ' + T().capMetrics2 : T().capMetrics(`${iso(rngs[0].anchor)}`, iso(rngs[0].end)));
  const cell = (v, fmt, best) => v === null ? '<td class="na">–</td>' : `<td class="${v === best ? 'best' : ''}">${fmt(v)}</td>`;
  const nm = s => `<td class="name"><span class="sw" style="background:${colorOf(s.f.provider)}"></span>${labelOf(s.f.provider)}${ALL ? ` <span class="na">${groupLabel(s.g)}</span>` : ''}</td>`;
  const tr = (first, inner) => `<tr${ALL && first ? ' class="gstart"' : ''}>${inner}</tr>`;
  const body = fn => parts.map(pt => pt.all.map((s, i) => tr(i === 0, fn(s, pt, i))).join('')).join('');
  $('tMetrics').innerHTML = `<thead><tr><th>${T().thRank}</th><th style="text-align:left">${T().thFund}</th><th>${T().thPeriodRet}</th>${th(T().thVol, 'vol')}${th(T().thMdd, 'mdd')}<th>${T().thInception}</th>${th(T().thCagr, 'cagr')}<th>${T().thVolAll}</th><th>${T().thMddAll}</th></tr></thead><tbody>`
    + parts.map(pt => {
      const rk = rankOf(pt.all.map(s => ({ key: s.f.provider, v: s.ret })));
      const bestOf = (key, dir) => { const vs = pt.all.map(s => s[key]).filter(v => v !== null); return vs.length ? (dir > 0 ? Math.max(...vs) : Math.min(...vs)) : null; };
      return pt.all.map((s, i) => tr(i === 0, `<td class="n">${rk.map.get(s.f.provider) || ''}</td>${nm(s)}${cell(s.ret, v => pct(v), bestOf('ret', 1))}${cell(s.vol, v => num(v, 1) + ' %', bestOf('vol', -1))}${cell(s.mdd, v => num(v, 1) + ' %', bestOf('mdd', 1))}<td>${iso(s.inception)}</td>${cell(s.cagr, v => pct(v), bestOf('cagr', 1))}${cell(s.volAll, v => num(v, 1) + ' %', bestOf('volAll', -1))}${cell(s.mddAll, v => num(v, 1) + ' %', bestOf('mddAll', 1))}`)).join('')
        + idxOf(pt).map(f => { const s = idxStats(f, pt.rng, grpStart(pt.g)); return `<tr class="idxrow"><td class="n"></td>${idxName(f)}${cell(s.ret, v => pct(v), null)}${cell(s.vol, v => num(v, 1) + ' %', null)}${cell(s.mdd, v => num(v, 1) + ' %', null)}<td>${iso(s.inception)}</td>${cell(s.cagr, v => pct(v), null)}${cell(s.volAll, v => num(v, 1) + ' %', null)}${cell(s.mddAll, v => num(v, 1) + ' %', null)}</tr>`; }).join('');
    }).join('') + '</tbody>';

  const endAll = Math.max(...rngs.map(r => r.end));
  const calP = parts.map(pt => ({ pt, cal: pt.all.map(s => ({ s, c: calendarReturns(s.f, pt.rng.end) })) }));
  const calRows = calP.flatMap(x => x.cal), needN = Math.min(calRows.length, Math.max(2, Math.ceil(calRows.length * 0.25)));   // metų, kuriuose beveik nėra duomenų (pvz., 2018 – kelios dienos), stulpelio nerodome
  const years = [...new Set(calRows.flatMap(y => Object.keys(y.c)))].map(Number).filter(y => calRows.filter(r => r.c[y]).length >= needN).sort((a, b) => a - b);
  const lastYear = new Date(endAll * DAY).getUTCFullYear();
  setCap('tCal', T().capCal(years[0], lastYear, ALL ? [...new Set(rngs.map(r => iso(r.end)))].join(' / ') : iso(rngs[0].end)));
  $('tCal').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${years.map(y => `<th>${y === lastYear ? T().ytd : y}</th>`).join('')}</tr></thead><tbody>`
    + calP.map(({ pt, cal }) => cal.map((x, i) => tr(i === 0, `${nm(x.s)}${years.map(y => { const c = x.c[y]; if (!c) return '<td class="na">–</td>'; const best = Math.max(...cal.map(z => z.c[y] ? z.c[y].ret : -1e9)); return `<td class="${c.ret === best ? 'best' : ''}">${pct(c.ret, 1).replace(' %', '%')}${c.partial ? '*' : ''}</td>`; }).join('')}`)).join('')
      + idxOf(pt).map(f => { const c = calendarReturns(idxSince(f, grpStart(pt.g)), pt.rng.end); return `<tr class="idxrow">${idxName(f)}${years.map(y => c[y] ? `<td>${pct(c[y].ret, 1).replace(' %', '%')}</td>` : '<td class="na">–</td>').join('')}</tr>`; }).join('')).join('') + '</tbody>';

  setCap('tRoll', T().capRoll(ALL ? [...new Set(gs.map(g => iso(groupEnd(g).end)))].join(' / ') : iso(groupEnd(gs[0]).end)));
  const keys = [[1, 'thRet1m'], [3, 'thRet3m'], [6, 'thRet6m'], [12, 'thRet1y'], [36, 'thRet3y'], [60, 'thRet5y']];
  $('tRoll').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${keys.map(k => `<th>${T()[k[1]]}</th>`).join('')}<th>${T().thR1avg}</th><th>${T().thR1min}</th><th>${T().thR1max}</th><th>${T().thR1pos}</th></tr></thead><tbody>`
    + parts.map(pt => {
      const rol = pt.all.map(s => ({ s, r: rolling(s.f, groupEnd(pt.g).end) }));
      const rb = k => { const vs = rol.map(x => x.r[k]).filter(v => v !== null && v !== undefined); return vs.length ? Math.max(...vs) : null; };
      return rol.map((x, i) => tr(i === 0, `${nm(x.s)}${keys.map(k => cell(x.r[k[0]] ?? null, v => pct(v, 1).replace(' %', '%'), rb(k[0]))).join('')}${x.r.r1 ? `<td>${pct(x.r.r1.avg, 1).replace(' %', '%')}</td><td>${pct(x.r.r1.min, 1).replace(' %', '%')}</td><td>${pct(x.r.r1.max, 1).replace(' %', '%')}</td><td>${num(x.r.r1.pos, 0)}%</td>` : '<td class="na">–</td>'.repeat(4)}`)).join('');
    }).join('') + '</tbody>';

  renderRiskMap(); renderRelative(gs); renderDrawdown(); renderFees();
  renderRanksByPeriod(gs, ALL); renderHeatmap(ALL ? byId(P.hmGroup) : gs[0], ALL); renderAdvanced(parts, ALL);
  fitSticky();
}
/* grąžos ir rizikos žemėlapis: savi laikotarpio, amžiaus grupių ir tiekėjų pasirinkimai; spalva – tiekėjas */
const RM = { per: null, groups: null, provs: null };
function renderRiskMap() {
  $('hRisk').innerHTML = T().hRisk + ik('riskmap');
  if (!RM.per) { RM.per = PERIOD_IDS.includes(P.period) ? P.period : 'ytd'; RM.groups = new Set(DATA.groups.map(g => g.id)); RM.provs = new Set(DATA.providers.map(p => p.id)); }
  const tools = $('rmTools'), groupsByRisk = DATA.groups.slice().reverse();      // turto, 1961 … 2003
  const chip = (id, on, label, color) => `<button type="button" class="chip" data-id="${id}" aria-pressed="${on}">${color ? `<i style="background:${color}"></i>` : ''}${label}</button>`;
  tools.innerHTML = `<div class="seg" data-k="per" role="group" aria-label="${T().period}">${PERIOD_IDS.map(id => `<button type="button" data-id="${id}" aria-pressed="${id === RM.per}">${T().periods[id]}</button>`).join('')}</div>`
    + `<div class="chips" data-k="groups"><span class="rmlbl">${T().rmGroups}</span>${chip('all', RM.groups.size === DATA.groups.length, T().rmAll)}${groupsByRisk.map(g => chip(g.id, RM.groups.has(g.id), groupLabel(g))).join('')}</div>`
    + `<div class="chips" data-k="provs"><span class="rmlbl">${T().rmProvs}</span>${marketProvs().map(p => chip(p.id, RM.provs.has(p.id), p.label, colorOf(p.id))).join('')}</div>`;
  tools.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    const k = b.parentElement.dataset.k, id = b.dataset.id;
    if (k === 'per') RM.per = id;
    else if (k === 'groups') {
      if (id === 'all') RM.groups = new Set(DATA.groups.map(g => g.id));
      else if (RM.groups.size === DATA.groups.length) RM.groups = new Set([id]);   // iš „visų“ – pirmas paspaudimas palieka vieną grupę
      else if (RM.groups.has(id)) { if (RM.groups.size > 1) RM.groups.delete(id); } else RM.groups.add(id);
    } else if (k === 'provs') { if (RM.provs.has(id)) { if (RM.provs.size > 1) RM.provs.delete(id); } else RM.provs.add(id); }
    renderRiskMap();
  };
  const el = $('riskMap'), oneGroup = RM.groups.size === 1;
  const pts = DATA.groups.filter(g => RM.groups.has(g.id)).flatMap(g => { const rng = rangeAt(g, RM.per); return g.funds.filter(f => RM.provs.has(f.provider)).map(f => fundStats(f, rng)).filter(s => s && s.ret !== null && s.vol !== null).map(s => ({ g, f: s.f, x: s.vol, y: s.ret })); });
  setCap('riskMap', T().capRisk(T().periods[RM.per], pts.length));
  renderRiskTable(pts);
  el.innerHTML = '';
  if (!pts.length) { el.innerHTML = `<p class="na">${T().noData}</p>`; return; }
  const W = el.clientWidth, H = el.clientHeight, m = { l: 48, r: 14, t: 10, b: 38 };
  const xs = niceTicks(0, Math.max(...pts.map(p => p.x)) * 1.05), y0 = Math.min(0, ...pts.map(p => p.y)), y1 = Math.max(0, ...pts.map(p => p.y));
  const ys = niceTicks(y0 - (y1 - y0) * 0.04, y1 + (y1 - y0) * 0.06);
  const extend = (t, top) => { const st = t[1] - t[0]; while (t[t.length - 1] < top) t.push(+(t[t.length - 1] + st).toFixed(10)); };   // ašis baigiasi žyma už didžiausio taško
  extend(xs, Math.max(...pts.map(p => p.x)) * 1.03); extend(ys, y1);
  const xMax = xs[xs.length - 1], yMin = Math.min(ys[0], y0), yMax = ys[ys.length - 1];
  const X = v => m.l + v / xMax * (W - m.l - m.r), Y = v => m.t + (yMax - v) / (yMax - yMin || 1) * (H - m.t - m.b);
  const dec = t => (t[1] - t[0]) % 1 ? 1 : 0;                         // žingsnis 2,5 → viena dešimtainė
  const labelsFor = list => {                                      // pavadinimai šalia taškų; persidengiantys perstumiami žemyn
    const placed = [];
    return list.slice().sort((a, b) => Y(a.y) - Y(b.y)).map(p => {
      const right = X(p.x) > W - m.r - 70, x = X(p.x) + (right ? -9 : 9), x0 = right ? x - 66 : x;
      let y = Y(p.y) + 4;
      while (placed.some(q => Math.abs(q.y - y) < 12 && Math.abs(q.x0 - x0) < 66)) y += 12;
      placed.push({ y, x0 });
      return `<text class="lbl" x="${x}" y="${y}"${right ? ' text-anchor="end"' : ''}>${oneGroup ? labelOf(p.f.provider) : groupLabel(p.g)}</text>`;
    }).join('');
  };
  el.innerHTML = `<svg width="${W}" height="${H}" role="img" aria-label="${T().hRisk}">`
    + ys.map(v => `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? 'var(--axis)' : 'var(--grid)'}"/><text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--text-3)">${num(v, dec(ys))}</text>`).join('')
    + xs.map(v => `<text x="${X(v)}" y="${H - m.b + 16}" text-anchor="middle" font-size="11" fill="var(--text-3)">${num(v, dec(xs))}</text>`).join('')
    + `<text x="${(m.l + W - m.r) / 2}" y="${H - 4}" text-anchor="middle" font-size="12" fill="var(--text-2)">${T().axVol}</text>`
    + `<text transform="translate(12 ${(m.t + H - m.b) / 2}) rotate(-90)" text-anchor="middle" font-size="12" fill="var(--text-2)">${T().axRet}</text>`
    + pts.map(p => `<circle class="pt" cx="${X(p.x)}" cy="${Y(p.y)}" r="6" fill="${colorOf(p.f.provider)}"><title>${labelOf(p.f.provider)} ${groupLabel(p.g)}: ${pct(p.y, 1)}, ${num(p.x, 1)} %</title></circle>`).join('')
    + (oneGroup || RM.provs.size === 1 ? labelsFor(pts) : '')
    + '</svg>';
  const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; el.appendChild(tip);
  el.onmousemove = e => {
    const r = el.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top;
    let best = null, bd = 196;                                       // 14 px spindulys
    pts.forEach(p => { const d = (X(p.x) - mx) ** 2 + (Y(p.y) - my) ** 2; if (d < bd) { bd = d; best = p; } });
    if (!best) { tip.style.display = 'none'; return; }
    tip.innerHTML = `<b><span class="sw" style="background:${colorOf(best.f.provider)}"></span>${labelOf(best.f.provider)} · ${groupLabel(best.g)}</b><div><span>${T().thPeriodRet}</span><span>${pct(best.y, 2)}</span></div><div><span>${T().thVol}</span><span>${num(best.x, 1)} %</span></div>`;
    tip.style.display = 'block';
    const w = tip.offsetWidth, tx = X(best.x) + 12;
    tip.style.left = (tx + w > W ? X(best.x) - w - 12 : tx) + 'px'; tip.style.top = Math.max(0, Y(best.y) - tip.offsetHeight / 2) + 'px';
  };
  el.onmouseleave = () => { tip.style.display = 'none'; };
}
/* grąžos ir rizikos santykis (Sharpe) po žemėlapiu: eilutės – amžiaus grupės, stulpeliai – tiekėjai; spalva – vieta grupėje */
function renderRiskTable(pts) {
  const tb = $('rmTable'), rf = rfNow();
  const groups = DATA.groups.filter(g => RM.groups.has(g.id) && pts.some(p => p.g === g));
  const provs = marketProvs().filter(p => RM.provs.has(p.id) && pts.some(x => x.f.provider === p.id));
  $('rmNote').textContent = T().nRmT(num(rf, 2));
  if (!groups.length) { tb.innerHTML = ''; return; }
  const sharpe = p => {
    const s = seriesOf(p.f, rangeAt(p.g, RM.per).anchor, rangeAt(p.g, RM.per).end); if (!s || !p.x) return null;
    const days = p.f.d[s.ie] - p.f.d[s.ia]; if (days < 30) return null;
    return ((Math.pow(1 + p.y / 100, 365.25 / days) - 1) * 100 - rf) / p.x;
  };
  const rows = groups.map(g => {
    const vals = {}, info = {};
    provs.forEach(pr => { const p = pts.find(x => x.g === g && x.f.provider === pr.id); vals[pr.id] = p ? sharpe(p) : null; info[pr.id] = p; });
    const { map, n } = rankOf(provs.map(pr => ({ key: pr.id, v: vals[pr.id] })));
    return { g, vals, info, ranks: map, n };
  });
  const avgRank = {};
  provs.forEach(pr => { const k = rows.map(r => r.ranks.get(pr.id)).filter(Boolean); avgRank[pr.id] = k.length ? k.reduce((a, b) => a + b, 0) / k.length : null; });
  const ak = rankOf(provs.map(pr => ({ key: pr.id, v: avgRank[pr.id] === null ? null : -avgRank[pr.id] })));
  const best = rows.map(r => { const id = [...r.ranks].find(([, k]) => k === 1); return id ? id[0] : null; });
  tb.innerHTML = `<thead><tr><th style="text-align:left">${T().group}</th>${provs.map(pr => `<th><span class="sw" style="background:${colorOf(pr.id)}"></span>${pr.label}</th>`).join('')}<th style="text-align:left">${T().rmBest}</th></tr></thead><tbody>`
    + rows.map((r, i) => `<tr><td>${groupShort(r.g)}</td>${provs.map(pr => { const v = r.vals[pr.id], p = r.info[pr.id]; return v === null ? '<td class="na">–</td>' : `<td class="${rkClass(r.ranks.get(pr.id), r.n)}" title="${T().rmTip(fmtP(p.y, 2), num(p.x, 1), r.ranks.get(pr.id), r.n)}">${num(v, 2)}</td>`; }).join('')}<td style="text-align:left">${best[i] ? labelOf(best[i]) : '–'}</td></tr>`).join('')
    + (rows.length > 1 ? `<tr class="avg"><td>${T().rmAvgRank}</td>${provs.map(pr => avgRank[pr.id] === null ? '<td class="na">–</td>' : `<td class="${rkClass(ak.map.get(pr.id), ak.n)}">${num(avgRank[pr.id], 1)}</td>`).join('')}<td style="text-align:left">${(() => { const id = [...ak.map].find(([, k]) => k === 1); return id ? labelOf(id[0]) : '–'; })()}</td></tr>` : '')
    + '</tbody>';
}
/* santykinė grąža: fondo grąža minus visų grupės fondų paprastas vidurkis (procentiniai punktai) */
function renderRelative(gs) {
  $('hRel').innerHTML = T().hRel + ik('rel');
  const order = DATA.groups.slice().reverse();                     // turto, 1961 … 2003 – kaip rinkos lentelėse
  const cards = order.filter(g => gs.includes(g)).map(g => {
    const rng = rangeFor(g, false);
    const all = g.funds.map(f => fundStats(f, rng)).filter(s => s && s.ret !== null);
    if (all.length < 2) return null;
    const avg = all.reduce((a, s) => a + s.ret, 0) / all.length;
    return { g, rng, avg, rows: all.filter(s => P.provs.has(s.f.provider)).map(s => ({ s, d: s.ret - avg })).sort((a, b) => b.d - a.d) };
  }).filter(Boolean);
  setCap('relGrid', T().capRel(spanText(periodText(), cards.map(c => c.rng))));
  if (!cards.length) { $('relGrid').innerHTML = `<p class="na">${T().noData}</p>`; return; }
  const max = Math.max(...cards.flatMap(c => c.rows.map(r => Math.abs(r.d))), 0.01);   // bendra skalė visoms grupėms
  $('relGrid').classList.toggle('one', cards.length === 1);
  $('relGrid').innerHTML = cards.map(c => `<div class="card relcard"><div class="relh"><b>${groupLabel(c.g)}</b><span class="na">${T().relAvg} ${pct(c.avg, 1)}</span></div>`
    + c.rows.map(r => {
      const w = Math.abs(r.d) / max * 50, pos = r.d >= 0;
      return `<div class="relrow" title="${labelOf(r.s.f.provider)}: ${pct(r.s.ret, 2)} · ${T().relAvg} ${pct(c.avg, 2)}"><span class="relname"><span class="sw" style="background:${colorOf(r.s.f.provider)}"></span>${labelOf(r.s.f.provider)}</span>`
        + `<span class="reltrack"><i class="${pos ? 'up' : 'dn'}" style="${pos ? 'left:50%' : `left:${50 - w}%`};width:${w}%"></i></span><span class="relval">${(pos ? '+' : '−') + num(Math.abs(r.d), 1)} ${T().pp}</span></div>`;
    }).join('') + '</div>').join('');
}
/* kilimas ir kritimas kiekvieno laikotarpio viduje (bendras komponentas – common.js) */
let RDD = null;
function renderDrawdown() {
  $('hDd').innerHTML = T().hDd + ik('dd');
  RDD = runupDrawdown($('rddCard'), DATA.groups.slice().reverse().map(g => ({ id: g.id, label: groupLabel(g), funds: g.funds })), 'p2', P.group !== 'all' ? P.group : DATA.groups[0].id);
}
/* mokesčių poveikis: kas mėnesį įmokama suma, prielaidinė grąža prieš mokesčius, valdymo mokestis nuo turto */
const FEEP = { kind: 'life', m: 100, y: 10, r: 5 };
function feeSim(fee, m, y, r) {
  const g = Math.pow(1 + r / 100, 1 / 12) - 1, f = fee / 100 / 12;
  let gross = 0, net = 0, paid = 0;
  for (let i = 0; i < y * 12; i++) { gross = (gross + m) * (1 + g); net = (net + m) * (1 + g); const c = net * f; paid += c; net -= c; }
  return { gross, net, paid, contrib: m * y * 12 };
}
function renderFees() {
  $('hFee').innerHTML = T().hFee + ik('fee');
  const tools = $('feeTools');
  if (!tools.dataset.ready) {                                    // valdikliai kuriami vieną kartą, kad įvedimo laukai neprarastų žymeklio
    tools.dataset.ready = '1';
    tools.innerHTML = `<div class="seg" id="feeKind" role="group"></div>`
      + `<label class="field"><span id="feeLblM"></span><input class="small-in" type="number" id="feeM" min="0" step="10" value="${FEEP.m}"> €</label>`
      + `<div class="seg" id="feeYears" role="group">${[5, 10, 20, 30].map(y => `<button type="button" data-y="${y}"></button>`).join('')}</div>`
      + `<label class="field"><span id="feeLblR"></span><input class="small-in" type="number" id="feeR" min="-5" max="15" step="0.5" value="${FEEP.r}"> %</label>`;
    $('feeKind').innerHTML = ['life', 'turto'].map(k => `<button type="button" data-k="${k}"></button>`).join('');
    $('feeKind').onclick = e => { const b = e.target.closest('button'); if (b) { FEEP.kind = b.dataset.k; renderFees(); } };
    $('feeYears').onclick = e => { const b = e.target.closest('button'); if (b) { FEEP.y = +b.dataset.y; renderFees(); } };
    $('feeM').oninput = e => { const v = parseFloat(e.target.value); if (isFinite(v) && v >= 0) { FEEP.m = v; renderFees(); } };
    $('feeR').oninput = e => { const v = parseFloat(e.target.value); if (isFinite(v)) { FEEP.r = v; renderFees(); } };
  }
  $('feeKind').querySelectorAll('button').forEach(b => { b.textContent = b.dataset.k === 'life' ? T().feeLife : T().turto; b.setAttribute('aria-pressed', b.dataset.k === FEEP.kind); });
  $('feeYears').querySelectorAll('button').forEach(b => { b.textContent = T().feeYrs(+b.dataset.y); b.setAttribute('aria-pressed', +b.dataset.y === FEEP.y); });
  $('feeLblM').textContent = T().feeM; $('feeLblR').textContent = T().feeR;
  const grp = FEEP.kind === 'life' ? '1996-2002' : 'turto';      // gyvenimo ciklo fondų mokestis visose amžiaus grupėse vienodas
  const rows = marketProvs().map(p => ({ p, fee: typeof FEES !== 'undefined' ? FEES[`${p.id}|${grp}`] : undefined })).filter(x => x.fee != null)
    .map(x => ({ ...x, s: feeSim(x.fee, FEEP.m, FEEP.y, FEEP.r) })).sort((a, b) => a.fee - b.fee || a.p.label.localeCompare(b.p.label));
  setCap('feeTbl', T().capFee(FEEP.m, FEEP.y, FEEP.r));
  if (!rows.length) { $('feeTbl').innerHTML = `<tbody><tr><td class="na">${T().noData}</td></tr></tbody>`; return; }
  const eur = v => num(v, 0) + ' €', maxLoss = Math.max(...rows.map(r => r.s.gross - r.s.net), 1);
  $('feeTbl').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th><th>${T().feeRate}</th><th>${T().feeContrib}</th><th>${T().feeGross}</th><th>${T().feeNet}</th><th>${T().feePaid}</th><th>${T().feeLoss}</th><th>${T().feeLossPct}</th></tr></thead><tbody>`
    + rows.map(r => {
      const loss = r.s.gross - r.s.net;
      return `<tr><td class="name"><span class="sw" style="background:${colorOf(r.p.id)}"></span>${r.p.label}</td><td>${num(r.fee, 2)} %</td><td>${eur(r.s.contrib)}</td><td>${eur(r.s.gross)}</td><td>${eur(r.s.net)}</td><td>${eur(r.s.paid)}</td>`
        + `<td><span class="feebar"><i style="width:${loss / maxLoss * 100}%"></i></span>${eur(loss)}</td><td>${num(loss / r.s.gross * 100, 1)} %</td></tr>`;
    }).join('') + '</tbody>';
}
function renderRanksByPeriod(gs, ALL) {
  setCap('tQP', T().capQP(ALL ? [...new Set(gs.map(g => iso(groupEnd(g).end)))].join(' / ') : iso(groupEnd(gs[0]).end), ALL ? iso(Math.min(...gs.map(g => rangeAt(g, 'max').anchor))) + '…' + iso(Math.max(...gs.map(g => rangeAt(g, 'max').anchor))) : iso(rangeAt(gs[0], 'max').anchor)));
  $('tQP').innerHTML = `<thead><tr><th></th>${PERIOD_IDS.map(per => `<th>${T().periods[per]}</th>`).join('')}</tr></thead><tbody>`
    + gs.map(g => {
      const ranks = {}; PERIOD_IDS.forEach(per => { const rng = rangeAt(g, per); ranks[per] = rankOf(g.funds.map(f => ({ key: f.provider, v: retOf(g, f.provider, rng) }))); });
      return marketProvs().filter(p => g.funds.some(f => f.provider === p.id)).map((p, i) => `<tr${ALL && i === 0 ? ' class="gstart"' : ''}><td class="name"><span class="sw" style="background:${colorOf(p.id)}"></span>${p.label}${ALL ? ` <span class="na">${groupLabel(g)}</span>` : ''}</td>${PERIOD_IDS.map(per => { const r = ranks[per], k = r.map.get(p.id); return k && r.n >= 2 ? `<td class="${rkClass(k, r.n)}" title="${k}/${r.n}">${k}</td>` : '<td class="na">–</td>'; }).join('')}</tr>`).join('');
    }).join('') + '</tbody>';
}
function heatColor(v) {
  const t = Math.min(1, Math.abs(v) / 6);
  return v >= 0 ? `hsl(135,45%,${92 - 37 * t}%)` : `hsl(5,75%,${92 - 27 * t}%)`;
}
function renderHeatmap(g, ALL) {
  const hg = $('hmGroup'); hg.hidden = !ALL; if (ALL) { hg.innerHTML = DATA.groups.map(x => `<option value="${x.id}">${groupLabel(x)}</option>`).join(''); hg.value = g.id; }
  const sel = $('hmProv'), provs = marketProvs().filter(p => g.funds.some(f => f.provider === p.id));
  if (!provs.some(p => p.id === P.hmProv)) P.hmProv = (provs.find(p => P.provs.has(p.id)) || provs[0]).id;
  sel.innerHTML = provs.map(p => `<option value="${p.id}">${p.label}</option>`).join(''); sel.value = P.hmProv;
  const f = g.funds.find(x => x.provider === P.hmProv), end = groupEnd(g).end;
  setCap('tHm', T().capHm(labelOf(P.hmProv), iso(f.d[0]), iso(Math.min(end, f.d[f.d.length - 1]))));
  const mr = monthlyReturns(f, Math.min(end, f.d[f.d.length - 1])), cal = calendarReturns(f, Math.min(end, f.d[f.d.length - 1]));
  const years = Object.keys(mr).map(Number).sort((a, b) => b - a), lastY = new Date(end * DAY).getUTCFullYear();
  const mn = Array.from({ length: 12 }, (_, m) => new Date(Date.UTC(2000, m, 1)).toLocaleDateString(T().locale, { month: 'short', timeZone: 'UTC' }));
  $('tHm').innerHTML = `<thead><tr><th>${T().thYear}</th>${mn.map(m => `<th>${m}</th>`).join('')}<th>${T().thYear}</th></tr></thead><tbody>`
    + years.map(y => `<tr><td>${y === lastY ? T().ytd : y}</td>${mn.map((_, m) => { const v = mr[y][m]; return v === undefined ? '<td class="na"></td>' : `<td style="background:${heatColor(v)}">${num(v, 1)}</td>`; }).join('')}${cal[y] ? `<td class="yr" style="background:${heatColor(cal[y].ret / 3)}">${num(cal[y].ret, 1)}${cal[y].partial ? '*' : ''}</td>` : '<td class="na"></td>'}</tr>`).join('') + '</tbody>';
}
const rfAuto = () => DATA.rf ? DATA.rf.value : 2;                // €STR iš ECB; jei jo nėra – 2 %
const rfNow = () => P.rf ?? rfAuto();
function renderAdvanced(parts, ALL) {
  $('btnAdv').setAttribute('aria-pressed', P.adv); $('adv').hidden = !P.adv;
  if (document.activeElement !== $('rf')) $('rf').value = rfNow();
  $('rfAuto').hidden = P.rf === null; $('rfAuto').textContent = T().rfAutoBtn; $('rfInfo').innerHTML = ik('rf');
  if (!P.adv) return;
  const rngs = parts.map(x => x.rng), a0 = Math.min(...rngs.map(r => r.anchor)), a1 = Math.max(...rngs.map(r => r.anchor));
  setCap('tAdv', T().capAdv(a0 === a1 ? iso(a0) : `${iso(a0)}…${iso(a1)}`, iso(Math.max(...rngs.map(r => r.end)))));
  $('lblRf').textContent = T().rf; $('nAdv').textContent = T().nAdv;
  const rows = parts.flatMap(pt => pt.all.map((s, i) => ({ s, first: i === 0, a: advStats(s.f, pt.rng, rfNow()) }))).filter(x => x.a);
  const d = x => x ? `${fmtP(x.v, 2)} <span class="na">${iso(x.d)}</span>` : '–', y = x => x ? `${fmtP(x.v, 1)} <span class="na">${x.y}</span>` : '–';
  const m = x => x ? `${fmtP(x.v, 2)} <span class="na">${iso(x.d).slice(0, 7)}</span>` : '–';
  $('tAdv').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th><th>${T().thAnn}</th>${th(T().thVol, 'vol')}${th(T().thSharpe, 'sharpe')}${th(T().thBestD, 'bestworst')}<th>${T().thWorstD}</th><th>${T().thBestM}</th><th>${T().thWorstM}</th><th>${T().thBestY}</th><th>${T().thWorstY}</th>${th(T().thPosM, 'posm')}</tr></thead><tbody>`
    + rows.map(({ s, a, first }) => `<tr${ALL && first ? ' class="gstart"' : ''}><td class="name"><span class="sw" style="background:${colorOf(s.f.provider)}"></span>${labelOf(s.f.provider)}${ALL ? ` <span class="na">${groupLabel(s.g)}</span>` : ''}</td><td>${a.ann === null ? '–' : fmtP(a.ann, 1)}</td><td>${a.vol === null ? '–' : num(a.vol, 1) + ' %'}</td><td>${a.sharpe === null ? '–' : num(a.sharpe, 2)}</td><td>${d(a.bestD)}</td><td>${d(a.worstD)}</td><td>${m(a.bestM)}</td><td>${m(a.worstM)}</td><td>${y(a.bestY)}</td><td>${y(a.worstY)}</td><td>${a.posM === null ? '–' : num(a.posM, 0) + '%'}</td></tr>`).join('') + '</tbody>';
}

/* ---------- eksportas ---------- */
const parseCell = t => {
  const raw = t.replace(/[\u00a0\u202f]/g, ' ').trim();
  if (!/^[−+-]?[\d ,.]+ ?%?\*?$/.test(raw)) return raw;
  let s = raw.replace('−', '-').replace('*', '').replace('%', '').replace('+', '').trim();
  s = lang === 'en' ? s.replace(/,/g, '') : s.replace(/ /g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : raw;
};
function tableToAoa(id) {
  const c = $(id).cloneNode(true); c.querySelectorAll('.info').forEach(n => n.remove());
  return [...c.rows].map(r => [...r.cells].map(x => parseCell(x.textContent)));
}
function loadScript(src) { return new Promise((ok, no) => { if (window.XLSX) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
/* „Dienos lentelė“: tas pats stulpelių ir fondų pavadinimų išdėstymas kaip senajame faile (pension_data_combined_YYYY-MM-DD.xlsx) */
const EXPORT_NAMES = {"ALLIANZ":[["2003-2009","Allianz D1 gimusiems 2003-2009 m."],["turto","Allianz S turto išsaugojimo"],["1961-1967","Allianz X1 gimusiems 1961–1967 m."],["1968-1974","Allianz X2 gimusiems 1968–1974 m."],["1975-1981","Allianz X3 gimusiems 1975–1981 m."],["1982-1988","Allianz Y1 gimusiems 1982–1988 m."],["1989-1995","Allianz Y2 gimusiems 1989–1995 m."],["1996-2002","Allianz Y3 gimusiems 1996–2002 m."]],"ARTEA":[["2003-2009","Artea pensija 2003-2009"],["1996-2002","Artea pensija 1996-2002"],["1989-1995","Artea pensija 1989-1995"],["1982-1988","Artea pensija 1982-1988"],["1975-1981","Artea pensija 1975-1981"],["1968-1974","Artea pensija 1968-1974"],["1961-1967","Artea pensija 1961-1967"],["turto","Artea pensijų turto išsaugojimo fondas"]],"GOINDEX":[["2003-2009","Goindex pensija 2003-2009"],["1996-2002","Goindex pensija 1996-2002"],["1989-1995","Goindex pensija 1989-1995"],["1982-1988","Goindex pensija 1982-1988"],["1975-1981","Goindex pensija 1975-1981"],["1968-1974","Goindex pensija 1968-1974"],["1961-1967","Goindex pensija 1961-1967"],["turto","Goindex pensijų turto išsaugojimo fondas"]],"LUMINOR":[["2003-2009","Luminor 2003-2009 tikslinės grupės pensijų fondas"],["1996-2002","Luminor 1996-2002 tikslinės grupės pensijų fondas"],["1989-1995","Luminor 1989-1995 tikslinės grupės pensijų fondas"],["1982-1988","Luminor 1982-1988 tikslinės grupės pensijų fondas"],["1975-1981","Luminor 1975-1981 tikslinės grupės pensijų fondas"],["1968-1974","Luminor 1968-1974 tikslinės grupės pensijų fondas"],["1961-1967","Luminor 1961-1967 tikslinės grupės pensijų fondas"],["turto","Luminor pensijų turto išsaugojimo fondas"]],"SEB":[["2003-2009","SEB pensija 2003-2009"],["1996-2002","SEB pensija 1996-2002"],["1989-1995","SEB pensija 1989-1995"],["1982-1988","SEB pensija 1982-1988"],["1975-1981","SEB pensija 1975-1981"],["1968-1974","SEB pensija 1968-1974"],["1961-1967","SEB pensija 1961-1967"],["turto","SEB turto išsaugojimo fondas"]],"SWEDBANK":[["2003-2009","Pensija 2003-2009"],["1996-2002","Pensija 1996-2002"],["1989-1995","Pensija 1989-1995"],["1982-1988","Pensija 1982-1988"],["1975-1981","Pensija 1975-1981"],["1968-1974","Pensija 1968-1974"],["1961-1967","Pensija 1961-1967"],["turto","Turto išsaugojimo pensijų fondas"]]};
function loadAssets() { return new Promise((ok, no) => { if (typeof ASSETS !== 'undefined') return ok(); const s = document.createElement('script'); s.src = 'assets.js?v=' + encodeURIComponent(DATA.generated); s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
async function exportDay() {
  const btn = $('btnXlsxDay'); btn.textContent = T().xlsxBusy; btn.disabled = true;
  try {
    await Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'), loadAssets()]);
    const D = Math.min(Math.max(dayOf($('xlDate').value || iso(LATEST)), EARLIEST), LATEST);
    const rows = [['Fondo pavadinimas', 'Data', 'Vieneto vertė', 'Grynieji aktyvai']]; let eff = 0;
    DATA.providers.forEach(p => {
      rows.push([p.id]);
      (EXPORT_NAMES[p.id] || []).forEach(([gid, name]) => {
        const g = byId(gid), f = g && g.funds.find(x => x.provider === p.id), i = f ? lastOnOrBefore(f, D) : -1;
        if (i < 0) { rows.push([name, '', '', '']); return; }
        const a = ASSETS[f.name]; let j = a ? a.d.length - 1 : -1; while (j >= 0 && a.d[j] > f.d[i]) j--;
        eff = Math.max(eff, f.d[i]);
        rows.push([name, iso(f.d[i]), f.v[i], j >= 0 ? a.a[j] : '']);
      });
    });
    const wb = XLSX.utils.book_new(), ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 40 }, { wch: 21.5 }, { wch: 21.5 }, { wch: 21.5 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `pension_data_combined_${iso(eff)}.xlsx`);
  } catch (e) { alert(T().xlsxFail); }
  btn.disabled = false; btn.textContent = T().xlsxDay;
}
async function exportXlsx() {
  const btn = $('btnXlsx'); btn.textContent = T().xlsxBusy; btn.disabled = true;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    const wb = XLSX.utils.book_new();
    const info = [[T().siteTitle], [T().updated, DATA.generated], [T().dataUntil, iso(Math.max(...DATA.groups.map(x => groupEnd(x).end)))], [T().period, periodText()], [T().group, groupName(P.group)], [], [T().foot]];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(info), 'Info');
    const sheets = [['Summary', 'tSum'], ['Return', 'tRet'], ['Rank', 'tRank'], ['Overall ranking', 'tOv'], ['Metrics', 'tMetrics'], ['Calendar years', 'tCal'], ['Rolling', 'tRoll'], ['Rank by period', 'tQP'], ['Monthly heat map', 'tHm']];
    if (P.adv) sheets.push(['Advanced', 'tAdv']);
    sheets.forEach(([name, id]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tableToAoa(id)), name));
    XLSX.writeFile(wb, `pension-funds-${iso(Math.max(...DATA.groups.map(x => groupEnd(x).end)))}.xlsx`);
  } catch (e) { alert(T().xlsxFail); }
  btn.disabled = false; btn.textContent = T().xlsx;
}
function downloadPng() {
  const g = byId(P.group), tmp = document.createElement('div'), W = 1100, H = 520;
  const ctl = drawLineChart(tmp, chartState.series, chartState.x0, chartState.x1, { width: W, height: H, events: chartState.evs, unit: chartState.opt.unit, axisUnit: chartState.opt.axisUnit, mr: 150 });
  if (!ctl) return;
  const cs = getComputedStyle(document.documentElement), res = s => s.replace(/var\((--[\w-]+)\)/g, (_, k) => cs.getPropertyValue(k).trim() || '#888');
  const ser = new XMLSerializer(), inner = res([...ctl.svg.childNodes].map(n => ser.serializeToString(n)).join(''));
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;'), top = 64, bottom = 28;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H + top + bottom}" viewBox="0 0 ${W} ${H + top + bottom}" font-family="system-ui,Segoe UI,Arial,sans-serif">`
    + `<rect width="100%" height="100%" fill="${cs.getPropertyValue('--card').trim() || '#fff'}"/>`
    + `<text x="16" y="28" font-size="18" font-weight="600" fill="${cs.getPropertyValue('--text').trim()}">${esc(T().siteTitle)} – ${esc(groupLabel(g))}</text>`
    + `<text x="16" y="48" font-size="12" fill="${cs.getPropertyValue('--text-2').trim()}">${esc(P.zoom ? `${iso(chartState.x0)} → ${iso(chartState.x1)}` : periodText())} · ${esc(T().chartLabel)}</text>`
    + `<g transform="translate(0,${top})">${inner}</g>`
    + `<text x="16" y="${H + top + 18}" font-size="11" fill="${cs.getPropertyValue('--text-3').trim()}">${esc(location.host || '')} · ${esc(T().updated)} ${esc(DATA.generated)}</text></svg>`;
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = (W) * 2; c.height = (H + top + bottom) * 2;
    const x = c.getContext('2d'); x.scale(2, 2); x.drawImage(img, 0, 0);
    c.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `chart-${P.group}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); });
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/* ---------- valdikliai ---------- */
function resetZoom() { P.zoom = null; P.cs = null; }   // laikotarpio ar grupės keitimas grąžina ir pradžią į laikotarpio pradžią
function buildControls() {
  const pe = $('periods');
  [...PRESET_IDS, 'custom'].forEach(id => {
    if (id === 'Q' || id === 'Y') {                    // išskleidžiami sąrašai: ketvirčiai ir kalendoriniai metai
      const sel = document.createElement('select'); sel.className = 'segsel'; sel.dataset.kind = id.toLowerCase();
      sel.addEventListener('change', () => { if (!sel.value) return; P.period = sel.value; resetZoom(); saveState(); syncAll(); });
      pe.appendChild(sel); return;
    }
    const b = document.createElement('button'); b.type = 'button'; b.dataset.id = id;
    b.addEventListener('click', () => {
      P.period = id;
      if (id === 'custom' && !P.from) { const e = groupEnd(DATA.groups[0]).end; P.from = iso(shiftMonths(e, 12)); P.to = iso(e); $('from').value = P.from; $('to').value = P.to; }
      resetZoom(); saveState(); syncAll();
    });
    pe.appendChild(b);
  });
  $('from').addEventListener('change', e => { P.from = e.target.value; normalizeDates('from'); $('from').value = P.from; $('to').value = P.to; P.period = 'custom'; resetZoom(); saveState(); syncAll(); });
  $('to').addEventListener('change', e => { P.to = e.target.value; normalizeDates('to'); $('from').value = P.from; $('to').value = P.to; P.period = 'custom'; resetZoom(); saveState(); syncAll(); });
  $('group').addEventListener('change', e => { P.group = e.target.value; resetZoom(); saveState(); renderFunds(); });
  $('hmProv').addEventListener('change', e => { P.hmProv = e.target.value; saveState(); renderHeatmap(byId(P.group === 'all' ? P.hmGroup : P.group), P.group === 'all'); });
  $('hmGroup').addEventListener('change', e => { P.hmGroup = e.target.value; saveState(); renderHeatmap(byId(P.hmGroup), true); });
  PERIOD_IDS.forEach(per => { const b = document.createElement('button'); b.type = 'button'; b.dataset.p = per;
    b.addEventListener('click', () => { if (P.ovP.has(per)) { if (P.ovP.size > 1) P.ovP.delete(per); } else P.ovP.add(per); saveState(); renderOverall(); });
    $('ovPers').appendChild(b); });
  Object.keys(OV_PRESETS).forEach(k => { const b = document.createElement('button'); b.type = 'button'; b.dataset.k = k;
    b.addEventListener('click', () => { P.ovP = new Set(OV_PRESETS[k]); saveState(); renderOverall(); });
    $('ovPreset').appendChild(b); });
  $('btnGx').addEventListener('click', () => { P.gx = !P.gx; saveState(); renderMarket(); });
  $('chips').innerHTML = '';
  DATA.providers.forEach(p => {
    const c = document.createElement('button'); c.type = 'button'; c.className = 'chip'; c.dataset.id = p.id;
    c.innerHTML = `<i style="background:${colorOf(p.id)}"></i>${p.label}`;
    c.addEventListener('click', () => { if (P.provs.has(p.id)) { if (P.provs.size > 1) P.provs.delete(p.id); } else P.provs.add(p.id); syncChips(); saveState(); renderFunds(); });
    const hl = id => { P.hl = id; if (chartState && chartState.ctl) chartState.ctl.highlight(id || P.pin || null); };
    c.addEventListener('dblclick', () => { P.pin = P.pin === p.id ? null : p.id; if (!P.provs.has(p.id)) { P.provs.add(p.id); syncChips(); renderFunds(); } else drawChart(); });
    c.addEventListener('mouseenter', () => hl(p.id)); c.addEventListener('mouseleave', () => hl(null));
    c.addEventListener('focus', () => hl(p.id)); c.addEventListener('blur', () => hl(null));
    $('chips').appendChild(c);
  });
  ['sel', '1w', '1m'].forEach(w => { const b = document.createElement('button'); b.type = 'button'; b.dataset.w = w; b.addEventListener('click', () => { P.sumWin = w; saveState(); syncSumWin(); renderSummary(); }); $('sumWin').appendChild(b); });
  ['ret', 'diff'].forEach(v => { const b = document.createElement('button'); b.type = 'button'; b.dataset.v = v; b.addEventListener('click', () => { P.view = v; saveState(); syncView(); drawChart(); }); $('viewSeg').appendChild(b); });
  if (!matchMedia('(hover: none)').matches) {
    $('chart').addEventListener('mouseenter', () => { if (($('chart').clientWidth || 0) > 560) animateMr(150); });
    $('chart').addEventListener('mouseleave', () => animateMr(16));
  }
  $('diffRef').addEventListener('change', e => { P.diffRef = e.target.value; saveState(); drawChart(); });
  $('resetZoom').addEventListener('click', () => { P.zoom = null; drawChart(); });
  $('csSel').addEventListener('change', e => { P.cs = e.target.value || null; P.zoom = null; drawChart(); });
  $('btnEvents').addEventListener('click', () => { P.events = !P.events; $('btnEvents').setAttribute('aria-pressed', P.events); drawChart(); });
  $('btnPng').addEventListener('click', downloadPng);
  $('idxChips').addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; const k = b.dataset.idx; P.idx.has(k) ? P.idx.delete(k) : P.idx.add(k); saveState(); renderIdxChips(); renderFunds(); });
  $('btnAdv').addEventListener('click', () => { P.adv = !P.adv; saveState(); renderFunds(); });
  $('rf').addEventListener('input', e => { const v = parseFloat(e.target.value); if (isFinite(v)) { P.rf = v; saveState(); renderAdvanced(lastParts, P.group === 'all'); } });
  $('rfAuto').addEventListener('click', () => { P.rf = null; saveState(); renderAdvanced(lastParts, P.group === 'all'); });
  $('btnXlsx').addEventListener('click', exportXlsx);
  $('btnXlsxDay').addEventListener('click', exportDay);
  $('btnPrint').addEventListener('click', () => window.print());
  $('btnShare').addEventListener('click', async () => {
    const url = shareUrl(); history.replaceState(null, '', url.slice(url.indexOf('#')));
    try { await navigator.clipboard.writeText(url); } catch (e) { prompt(T().share, url); return; }
    const b = $('btnShare'); b.textContent = T().copied; setTimeout(() => { b.textContent = T().share; }, 1800);
  });
  document.addEventListener('click', e => {                           // „i“ paaiškinimai
    const pop = $('pop'), b = e.target.closest('.info');
    if (!b) { pop.style.display = 'none'; return; }
    e.stopPropagation(); if (pop.dataset.k === b.dataset.k && pop.style.display === 'block' && pop._b === b) { pop.style.display = 'none'; return; }
    const iv = T().info[b.dataset.k]; pop.textContent = typeof iv === 'function' ? iv() : iv; pop.dataset.k = b.dataset.k; pop._b = b; pop.style.display = 'block';
    const r = b.getBoundingClientRect(), w = pop.offsetWidth;
    pop.style.left = Math.max(8, Math.min(r.left + scrollX - 8, scrollX + document.documentElement.clientWidth - w - 8)) + 'px'; pop.style.top = (r.bottom + scrollY + 6) + 'px';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('pop').style.display = 'none'; });
}
const CAL_OPTS = calOptions(LATEST, EARLIEST);
function syncCalSelects() {
  $('periods').querySelectorAll('select.segsel').forEach(sel => {
    const k = sel.dataset.kind, active = P.period.startsWith(k + ':');
    sel.innerHTML = `<option value="">${k === 'q' ? T().qPlace : T().yPlace}</option>` + CAL_OPTS[k].map(id => `<option value="${id}">${periodLabel(id)}</option>`).join('');
    sel.value = active ? P.period : ''; sel.classList.toggle('active', active);
  });
}
function syncChips() { document.querySelectorAll('#chips .chip').forEach(c => c.setAttribute('aria-pressed', P.provs.has(c.dataset.id))); }
function syncView() {
  const sel = $('diffRef'), cur = P.diffRef;
  sel.innerHTML = `<option value="avg">${T().diffAvg}</option>` + marketProvs().map(p => `<option value="${p.id}">${p.label}</option>`).join(''); sel.value = cur; sel.hidden = P.view !== 'diff';
  $('diffFromLbl').hidden = P.view !== 'diff'; $('diffFromLbl').textContent = T().diffFrom; $('viewSeg').querySelectorAll('button').forEach(b => { b.textContent = T()['view' + b.dataset.v]; b.setAttribute('aria-pressed', b.dataset.v === P.view); }); }
function winLabel(w) { const v = T()['win' + w]; return typeof v === 'function' ? v(periodText()) : v; }
function syncSumWin() { $('sumWin').querySelectorAll('button').forEach(b => { b.textContent = winLabel(b.dataset.w); b.setAttribute('aria-pressed', b.dataset.w === P.sumWin); }); }
function labelControls() {
  $('periods').setAttribute('aria-label', T().period);
  $('periods').querySelectorAll('button').forEach(b => b.textContent = T().periods[b.dataset.id]);
  syncCalSelects();
  $('lblFrom').textContent = T().from; $('lblTo').textContent = T().to;
  ['from', 'to'].forEach(id => { $(id).min = iso(EARLIEST); $(id).max = iso(LATEST); });
  const sel = $('group'), cur = P.group; sel.innerHTML = `<option value="all">${T().allFunds}</option>` + DATA.groups.map(g => `<option value="${g.id}">${groupLabel(g)}</option>`).join(''); sel.value = cur;
  $('foot').textContent = T().foot;
  $('btnShare').textContent = T().share; $('btnXlsx').textContent = T().xlsx; $('btnXlsxDay').textContent = T().xlsxDay; $('btnXlsxDay').title = T().xlsxDayTip; $('xlDate').title = T().xlsxDayTip; $('xlDate').min = iso(EARLIEST); $('xlDate').max = iso(LATEST); if (!$('xlDate').value) $('xlDate').value = iso(LATEST); $('btnPrint').textContent = T().print;
  $('idxLbl').innerHTML = T().idxLbl + ik('idx'); renderIdxChips();
  $('btnEvents').textContent = T().eventsBtn; $('evInfo').innerHTML = ik('events'); $('resetZoom').textContent = T().resetZoom; $('btnPng').textContent = T().png; $('zoomHint').textContent = T().zoomHint;
  $('btnAdv').innerHTML = T().advBtn;
  $('sub').textContent = `${T().dataUntil} ${iso(Math.max(...DATA.groups.map(g => groupEnd(g).end)))} · ${T().updated} ${DATA.generated}`;
  syncSumWin(); syncView();
}
function syncAll() {
  $('periods').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === P.period));
  syncCalSelects();
  $('btnEvents').setAttribute('aria-pressed', P.events);
  $('printMeta').textContent = `${T().siteTitle} · ${groupName(P.group)} · ${periodText()} · ${T().updated} ${DATA.generated}`;
  renderSummary(); renderMarket(); renderFunds(); fitSticky();
}
buildControls(); syncChips();
renderHeader('performance', () => { labelControls(); syncAll(); });
document.querySelector('#top .top-tools').prepend($('actions'));   // veiksmų mygtukai – antraštėje, filtrų juosta lieka vienoje eilutėje
labelControls();
$('from').value = P.from; $('to').value = P.to;
syncAll();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { chartState && drawChart(); renderRiskMap(); RDD && RDD.paint(); fitSticky(); }, 120); });
