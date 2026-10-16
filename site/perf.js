/* III pakopa (savininkas 2026-10-16: „tie patys įrankiai abiem pakopoms su jungikliu“): performance3.html – tas pats puslapis su data3.js
   (kiekvienas fondas – atskiras „tiekėjas“, grupės – LB kategorijos). Valdytojų lentelės (visa rinka, bendras reitingas) slepiamos:
   III pakopoje lyginami fondai tik savo kategorijoje, ne valdytojai. II ir III pakopos tarpusavyje nelyginamos. */
const IS3 = typeof window.PL3 !== 'undefined', STKEY = IS3 ? 'perfState3' : 'perfState';
/* Rezultatų ir palyginimo puslapis. Priklauso nuo: data.js (DATA), events.js (EVENTS), common.js. */
addStrings({
  idxLbl: 'Compare with',
  from: 'From', to: 'To', group: 'Group', ret: 'Return', rank: 'Rank (1 = best)', avg: 'Average', avgW: 'Weighted', avgWt: 'Average weighted by the funds’ net assets (larger funds count more)',
  hSum: 'Automatic summary', winsel: p => `Selected period (${p})`, win1w: 'Last 7 days', win1m: 'Last month', qPlace: 'Quarter', yPlace: 'Year',
  hMarket: 'Whole market: return and rank by age group', hFund: 'Compare funds',
  hRet: 'Return over the period, %', hRank: 'Rank within the age group (1 = best return)',
  cpiBtn: 'Inflation line', cpiLine: 'Inflation (HICP, Lithuania)',
  hRelM: 'Relative to the peers, pp', hAnnM: 'Annualized return, %', mrefNone: 'each vs. median of the other five', mrefPick: r => `${r} minus each peer`,
  peerMed: r => r ? `Median ex ${r}` : 'Median', peerAvg: 'Peers’ avg.',
  hOv: 'Overall ranking across all groups and periods', ovAll: 'All periods', realOff: 'Nominal', realOn: 'Real (after inflation)', realTip: m => `Real return = nominal return adjusted for Lithuanian inflation (consumer price index, State Data Agency; latest month ${m}). Applies to period returns, rankings and charts; volatility and calendar-year tables stay nominal.`, ovCommonOff: 'All comparisons', ovCommonOn: 'Only where all 6 take part', ovCommonNote: 'Younger funds (e.g. Goindex) take part in fewer comparisons than the others, so their shares are based on a different set. “Only where all 6 take part” keeps just the comparisons in which every manager has a result, so all are compared on the same basis.', ovLong: '1 yr and longer', ovPick: 'Periods included:',
  hBar: 'Return over the period', mxlTip2: 'The metrics with the daily unit values used and Excel formulas', mxl: 'Excel with formulas', mxlTip: 'The four tables with the unit values used and Excel formulas, so every number can be checked', gxBtn: 'Since Goindex start', gxNote: d => `“Since Goindex start” is on: in each age group every fund is measured from the start of the Goindex fund (${d}) or from the period start, whichever is later, so all six providers are compared over the same dates.`,
  nOv: (pers, ng) => `How to read: for each of the ${ng} age groups and each selected period (${pers}) the providers are ranked by return – each such ranking is one comparison. “Comparisons” = how many rankings the provider took part in (it is left out where its fund did not exist at the period start or has no fresh data; rankings with fewer than 3 providers are skipped), so the maximum is ${ng} × the number of periods. “1st places” = how many of them it won; “% 1st” and “% 1st–2nd” = share of its comparisons; “Avg. rank” = average position (1 = best). Each period ends on its group’s latest date.`,
  mMarket: p => `Period: ${p}. Colours show the rank within each row (green = best, red = worst).`,
  nMarket: 'Return = change in unit value between the period start and the latest common date in each group. “–” = the fund did not exist at the start of the period or has no fresh data. Average row: simple average across the age groups where the fund has a value. Asset-weighted row: the same groups, each weighted by the fund’s latest net assets – closer to how the provider’s members’ money as a whole did.',
  thCmp: 'Comparisons', thFirst: '1st places', thFirstPct: '% 1st', thTop2: '% 1st–2nd', thAvgRank: 'Avg. rank',
  rmBest: 'Best ratio', rmAvgRank: 'Average place', rmTip: (r, v, k, n) => `Return ${r}, volatility ${v} % · place ${k} of ${n}`,
  nRmT: (rf, auto) => `Return-to-risk ratio (Sharpe) = (annualised return − ${auto ? `average €STR over the period, ≈ ${rf} %` : `risk-free rate ${rf} %`}) ÷ annualised volatility, for the period, age groups and providers chosen above. Higher = more return per unit of risk. Colour = place within the age group (green = best); funds are compared only with the same age group. “Average place” = the provider’s average place across the chosen groups. On periods shorter than a year the annualised figures are less reliable.`,
  hDd: 'Run-up and drawdown',
  hFee: 'Fee impact over time', feeLife: 'Life-cycle funds', feeM: 'Monthly contribution', feeR: 'Assumed return before fees, % p.a.', feeYrs: y => `${y} yr`,
  feeRate: 'Fee, % p.a.', feeContrib: 'Paid in', feeGross: 'Final sum without fees', feeNet: 'Final sum with fees', feePaid: 'Fees paid', feeLoss: 'Lower final sum, €', feeLossPct: 'Lower final sum, %',
  capFee: (m, y, r) => `${num(m, 0)} € every month for ${y} years at ${num(r, 1)} % a year before fees. The only difference between providers is the asset-based management fee (Bank of Lithuania list); contribution fees and the real future return are not included.`,
  hRisk: 'Return-to-risk ratio (Sharpe) by group', hRel: 'Return vs. age-group average', relAvg: 'average', pp: 'pp',
  capRel: t => `${t}. Each bar = the fund’s return minus the simple average of all funds in its age group, in percentage points; right of the centre line = better than average. Same scale for all groups.`, axVol: 'Volatility, % p.a.', axRet: 'Return over the period, %',
  capRisk: (t, n) => `${t}. Each dot is one fund (${n}); colour = provider. Choose the period, age groups and providers above the chart.`, rmGroups: 'Age groups:', rmProvs: 'Providers:', rmAll: 'All',
  cMetrics: (a, ra, z, rz, v, rv) => `<b>${a}</b> earned the most (${ra}), <b>${z}</b> the least (${rz}); <b>${v}</b> was the least volatile (${rv}).`,
  cCal: (y, a, ra, z, rz) => `In ${y} the best was <b>${a}</b> (${ra}), the weakest <b>${z}</b> (${rz}).`,
  cFee: (y, lo, hi, d) => `Over ${y} years savings in the lowest-fee (${lo}) and highest-fee (${hi}) funds differ by <b>${d}</b>.`,
  pnav: ['Whole market', 'Leaders & moves', 'Fund comparison', 'Risk', 'Years & months', 'Market insights'],
  hMetrics: 'Performance metrics', hCal: 'Calendar-year returns', hRoll: 'Rolling returns (to the latest date)',
  hQP: 'Rank by period (this group; 1 = best)', hHm: 'Monthly returns heat map –',
  thRank: '#', thFund: 'Manager', thPeriodRet: 'Return, period', thVol: 'Volatility p.a., period', thMdd: 'Max drawdown, period',
  thInception: 'Inception', thCagr: 'Return p.a. since inception', thVolAll: 'Volatility p.a. since inception', thMddAll: 'Max drawdown since inception',
  thRet1m: '1 mo', thRet3m: '3 mo', thRet6m: '6 mo', thRet1y: '1 yr', thRet3y: '3 yr p.a.', thRet5y: '5 yr p.a.',
  thR1avg: 'Rolling 1-yr: average', thR1min: 'min', thR1max: 'max', thR1pos: '% positive', thYear: 'Year',
  csLbl: 'Chart start', csPeriod: 'Start of the period', csYoung: 'Since the youngest fund’s start', csFrom: p => `Since ${p} start`,
  ytd: 'YTD', mChart: (g, p) => `${g} · ${p}. Returns rebased to 0 % at the start of the period.`,
  mZoom: (g, a, b) => `${g} · zoomed ${a} → ${b}. Returns rebased to 0 % at the start of the zoomed range.`,
  nFund: 'Volatility = standard deviation of daily returns × √252 (days with no price change are excluded; days when only one manager published a value – e.g. SEB on public holidays – are skipped in daily statistics, the change is measured to the next common day). Annualised return = compound annual growth between the first and last available price (shown only for histories of at least one year). Max drawdown = largest peak-to-trough fall. * = fund started during that year (return since inception). Rolling returns longer than one year are annualised. Unit values are already net of fees and taxes. Past performance is not a guide to future returns.',
  foot: 'Data is collected automatically from the providers\' websites and APIs; for information only, not investment advice.',
  share: 'Copy link', copied: 'Link copied', xlsx: 'Excel', xlsxBusy: 'Preparing…', allFunds: 'All funds', allNote: 'The chart is drawn for one age group at a time – pick a group above to see it. The tables below show all funds; ranks and highlighted best values are within each age group.', capMetrics2: '“Since inception” columns: each fund’s first date → end date.', xlsxDay: 'Daily table (.xlsx)', xlsxDayTip: 'Same layout as the old daily file (fund, date, unit value, net assets): one row per fund for the chosen date; default = latest. If a fund has no value on that day, its last earlier value is used.', xlsxFail: 'Could not load the Excel library (no internet?).', print: 'Print / PDF',
  viewret: 'Return', viewdiff: 'Difference', diffFrom: 'from', diffAvg: 'Group average', mDiff: r => `Lines show each fund’s cumulative return minus ${r ? r + '’s' : 'the group average'}, in % (0 = ${r || 'group average'}).`,
  eventsBtn: 'Market events', resetZoom: 'Reset zoom', png: 'Download PNG', zoomHint: 'Tip: drag across the chart to zoom; hover a provider to highlight it; click a name at the chart’s right edge (or double-click a chip) to pin it.',
  advBtn: 'Advanced metrics: Sharpe, best and worst month', rf: 'Risk-free rate, % p.a.', rfAvg: 'average €STR over the period', rfAutoBtn: 'Use €STR',
  hAdv: 'Advanced metrics', thAnn: 'Return p.a., period', thSharpe: 'Sharpe ratio', thBestD: 'Best day', thWorstD: 'Worst day', thBestM: 'Best month', thWorstM: 'Worst month',
  thBestY: 'Best year', thWorstY: 'Worst year', thPosM: '% positive months',
  nAdv: 'For the selected period. Sharpe = (annualised return − risk-free rate) ÷ annualised volatility; default rate – average €STR over the same period. Higher Sharpe – more return for the same risk. Bold – best value in the group (volatility – lowest). Month date – on hover. Annualised figures are unreliable for periods shorter than a year.',
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
  thGroup: 'Group', thLeader: 'Leader', thLagger: 'Laggard', thSpread: 'Spread, %', thMove: 'Largest 1-day move', thUp1: 'Largest 1-day rise', thDn1: 'Largest 1-day fall',
  nSum: 'Computed automatically from the latest data in each age group; leader / laggard by return over the window.',
  info: {
    fee: 'Every month the contribution is added, the money grows at the assumed return, and the management fee (annual % ÷ 12) is deducted from the accumulated assets – the way II pillar fees are charged (daily, already included in unit values). “Fees paid” = all fees deducted; “Lower final sum” also includes the return those fees would have earned. Fees: base asset-based fee from the Bank of Lithuania list (life-cycle funds of a manager share one fee).',
    dd: 'Run-up = the largest rise of the unit value from its lowest point within a month, quarter or year; drawdown = the largest fall from its highest point within that period. Together they show how widely the fund swung inside each period, not only where it ended. “Line” shows the cumulative return and how far the fund was below its previous high on every day – the deepest dip is the maximum drawdown.',
    rel: 'Shows how far each fund is above or below its peers: return over the selected period minus the simple (unweighted) average return of all funds in the same age group. Provider chips only hide bars; the average always uses all funds with fresh data.',
    rf: () => DATA.rf ? `Default: the average €STR (euro short-term rate, published daily by the European Central Bank) over each fund’s period – the rate a risk-free deposit would actually have earned over the same days (before October 2019: EONIA − 0.085 pp, the ECB’s official link between the two). The field shows the average for the selected period; latest value ${num(DATA.rf.value, 2)} % p.a. on ${DATA.rf.date}. If the history is unavailable, the latest value is used. It is the standard risk-free rate for euro investors (all Lithuanian pension fund members invest in EUR) and is updated automatically with the site data. Source: ${DATA.rf.source}. A value you type is used for all periods; “Use €STR” returns to the automatic average.` : 'The automatic €STR rate (European Central Bank) is not available yet, so 2 % p.a. is used. You can type your own value.',
    riskmap: 'Horizontally: volatility (annualised standard deviation of daily returns over the selected period). Vertically: return over the same period. Up and to the left is better: more return for less risk. Only funds with fresh data and at least 20 days of returns are shown.',
    ret: 'Change in unit value between the start and end of the period. Unit values are already net of fees and taxes, so no further deduction is needed.',
    rank: 'Position of each provider within its age group by return over the selected period; 1 = best.',
    relm: 'Without a selected provider: each provider’s return minus the median return of the other five in the same age group. With a selected provider: that provider’s return minus each peer’s return; the last column is minus the simple average of the peers. Green = the first one is ahead, red = behind. pp = percentage points.',
    annm: 'Return over the period converted to a yearly rate: (1 + return)^(365.25 ÷ days) − 1. For periods shorter than a year this extrapolates, so read it with care.',
    overall: 'Every age group × every period is one comparison. Counts how often a provider is first, in the top two, and its average rank. Short periods are noisy, so the “1 yr and longer” view is usually fairer.',
    vol: 'Volatility = standard deviation of daily returns × √252 – how much the unit value fluctuates; higher = more risk. Days with no price change are excluded.',
    mdd: 'Maximum drawdown = the largest fall from a peak to a later trough. Shows the worst loss an investor could have suffered.',
    cagr: 'Compound annual growth rate between the first and last available unit value (shown only when the history is at least one year).',
    cal: 'Return for each calendar year. * = the fund started during that year, so the figure covers only part of it. The last column is the current year to date.',
    roll: 'Return over the last 1, 3, 6, 12, 36, 60 months (longer than a year – annualised). Rolling 1-yr = every possible 12-month window in history: average, worst, best and share that were positive.',
    heat: 'Return in each calendar month (rows = years). Green = gain, red = loss; the last column is the year.',
    sharpe: 'Sharpe ratio = (annualised return − risk-free rate) ÷ annualised volatility. Higher = better return per unit of risk. By default the risk-free rate is the average €STR over the same period; you can type your own (e.g. a deposit rate).',
    bestworst: 'Best / worst single day and calendar month inside the selected period, and best / worst full calendar year over the whole history.',
    posm: 'Share of full calendar months with a positive return, within the selected period.',
    idx: 'Dashed lines and grey rows = world equity indexes for comparison: MSCI ACWI (all world stocks) and MSCI World (developed markets) – Net Return in EUR, published by MSCI; S&P 500 – Total Return in USD (dividends reinvested) converted to EUR at the ECB rate. Index values have no fees, while fund unit values are already net of management fees. Pension funds also hold bonds (especially for older age groups), so they are expected to lag equities in rising markets and fall less in crises. In the tables “since inception” for an index = since the earliest fund in the group started.',
    events: 'Shows key market and pension-system events on the chart. Hover (or see the list below the chart) for what happened and the source. Off by default.',
    summary: 'Generated automatically from the latest data: who leads and lags over the last 7 days or month in each age group, and the largest one-day move.',
    coverage: 'Some funds have a shorter history than their peers.',
  },
}, {
  idxLbl: 'Palyginti su',
  from: 'Nuo', to: 'Iki', group: 'Grupė', ret: 'Grąža', rank: 'Vieta (1 = geriausia)', avg: 'Vidurkis', avgW: 'Svertinis', avgWt: 'Svertinis vidurkis pagal fondų grynuosius aktyvus (didesni fondai sveria daugiau)',
  hSum: 'Automatinė santrauka', winsel: p => `Pasirinktas laikotarpis (${p})`, win1w: 'Paskutinės 7 dienos', win1m: 'Paskutinis mėnuo', qPlace: 'Ketvirtis', yPlace: 'Metai',
  hMarket: 'Visa rinka: grąža ir vieta pagal amžiaus grupes', hFund: 'Fondų palyginimas',
  hRet: 'Grąža laikotarpyje, %', hRank: 'Vieta amžiaus grupėje (1 = geriausia grąža)',
  cpiBtn: 'Infliacijos linija', cpiLine: 'Infliacija (SVKI, Lietuva)',
  hRelM: 'Palyginimas su konkurentais, p. p.', hAnnM: 'Metinė grąža, %', mrefNone: 'kiekvienas – su kitų penkių mediana', mrefPick: r => `${r} minus kiekvienas konkurentas`,
  peerMed: r => r ? `Mediana be ${r}` : 'Mediana', peerAvg: 'Konkurentų vid.',
  hOv: 'Bendra reitingų lentelė (visos grupės ir laikotarpiai)', ovAll: 'Visi laikotarpiai', realOff: 'Nominali', realOn: 'Reali (po infliacijos)', realTip: m => `Reali grąža = nominali grąža, atėmus Lietuvos infliaciją (vartotojų kainų indeksas, Valstybės duomenų agentūra; paskutinis mėnuo ${m}). Taikoma laikotarpio grąžai, reitingams ir grafikams; svyravimas ir kalendorinių metų lentelės lieka nominalios.`, ovCommonOff: 'Visi palyginimai', ovCommonOn: 'Tik kur dalyvauja visi 6', ovCommonNote: 'Jaunesni fondai (pvz. Goindex) dalyvauja mažiau palyginimų nei kiti, todėl jų dalys skaičiuojamos iš kitokio rinkinio. „Tik kur dalyvauja visi 6“ palieka tik tuos palyginimus, kuriuose rezultatą turi visi valdytojai – tada visi lyginami vienodai.', ovLong: '1 metai ir ilgesni', ovPick: 'Įtraukti laikotarpiai:',
  hBar: 'Laikotarpio grąža', mxlTip2: 'Rodikliai su naudotomis dienų vieneto vertėmis ir Excel formulėmis', mxl: 'Excel su formulėmis', mxlTip: 'Keturios lentelės su naudotomis vieneto vertėmis ir Excel formulėmis – kiekvieną skaičių galima patikrinti', gxBtn: 'Nuo Goindex pradžios', gxNote: d => `Įjungta „Nuo Goindex pradžios“: kiekvienoje amžiaus grupėje visi fondai skaičiuojami nuo Goindex fondo pradžios (${d}) arba nuo laikotarpio pradžios, jei ji vėlesnė, todėl visi šeši tiekėjai lyginami per tas pačias datas.`,
  nOv: (pers, ng) => `Kaip skaityti: kiekvienoje iš ${ng} amžiaus grupių ir kiekvienu pažymėtu laikotarpiu (${pers}) tiekėjai surikiuojami pagal grąžą – kiekvienas toks rikiavimas yra vienas palyginimas. „Palyginimų“ = kiek rikiavimų tiekėjas dalyvavo (jis neįtraukiamas, jei laikotarpio pradžioje jo fondo dar nebuvo arba nėra naujų duomenų; rikiavimai, kuriuose mažiau nei 3 tiekėjai, praleidžiami), todėl daugiausia gali būti ${ng} × laikotarpių skaičius. „1 vietų“ = kiek kartų buvo pirmas; „% 1 vietų“ ir „% 1–2 vietų“ = dalis nuo jo palyginimų; „Vid. vieta“ = vidutinė vieta (1 = geriausia). Kiekvienas laikotarpis baigiasi savo grupės paskutine diena.`,
  mMarket: p => `Laikotarpis: ${p}. Spalvos rodo vietą kiekvienoje eilutėje (žalia – geriausia, raudona – prasčiausia).`,
  nMarket: 'Grąža = vieneto vertės pokytis tarp laikotarpio pradžios ir paskutinės bendros dienos grupėje. „–“ = fondo laikotarpio pradžioje dar nebuvo arba nėra naujų duomenų. Vidurkio eilutė: paprastas vidurkis tarp amžiaus grupių, kuriose fondas turi reikšmę. Svertinio vidurkio eilutė: tos pačios grupės, kiekviena pasverta pagal fondo paskutinius grynuosius aktyvus – artimiau tam, kaip sekėsi visiems valdytojo dalyvių pinigams.',
  thCmp: 'Palyginimų', thFirst: '1 vietų', thFirstPct: '% 1 vietų', thTop2: '% 1–2 vietų', thAvgRank: 'Vid. vieta',
  rmBest: 'Geriausias santykis', rmAvgRank: 'Vidutinė vieta', rmTip: (r, v, k, n) => `Grąža ${r}, svyravimas ${v} % · vieta ${k} iš ${n}`,
  nRmT: (rf, auto) => `Grąžos ir rizikos santykis (Sharpe) = (metinė grąža − ${auto ? `vidutinė laikotarpio €STR, ≈ ${rf} %` : `be rizikos palūkanų norma ${rf} %`}) ÷ metinis svyravimas, pagal virš grafiko pasirinktą laikotarpį, amžiaus grupes ir tiekėjus. Didesnis = daugiau grąžos vienam rizikos vienetui. Spalva – vieta amžiaus grupėje (žalia = geriausia); fondai lyginami tik su tos pačios grupės fondais. „Vidutinė vieta“ – tiekėjo vidutinė vieta pasirinktose grupėse. Trumpesniais nei metų laikotarpiais metiniai skaičiai mažiau patikimi.`,
  hDd: 'Kilimas ir kritimas',
  hFee: 'Mokesčių poveikis laike', feeLife: 'Gyvenimo ciklo fondai', feeM: 'Įmoka per mėnesį', feeR: 'Prielaidinė grąža prieš mokesčius, % per metus', feeYrs: y => `${y} ${y >= 10 ? 'metų' : 'metai'}`,
  feeRate: 'Mokestis, % per metus', feeContrib: 'Įmokėta', feeGross: 'Sukaupta be mokesčių', feeNet: 'Sukaupta su mokesčiais', feePaid: 'Sumokėta mokesčių', feeLoss: 'Mažesnė suma, €', feeLossPct: 'Mažesnė suma, %',
  capFee: (m, y, r) => `${num(m, 0)} € kas mėnesį per ${y} ${y >= 10 ? 'metų' : 'metus'}, kai grąža prieš mokesčius – ${num(r, 1)} % per metus. Valdytojai skiriasi tik valdymo mokesčiu nuo turto (Lietuvos banko sąrašas); atskaitymai nuo įmokų ir tikroji ateities grąža neįskaičiuoti.`,
  hRisk: 'Grąžos ir rizikos santykis (Sharpe) pagal grupes', hRel: 'Grąža palyginti su amžiaus grupės vidurkiu', relAvg: 'vidurkis', pp: 'p. p.',
  capRel: t => `${t}. Kiekviena juosta – fondo grąža minus visų tos amžiaus grupės fondų paprastas vidurkis, procentiniais punktais; dešiniau vidurio linijos – geriau už vidurkį. Visoms grupėms ta pati skalė.`, axVol: 'Svyravimas, % per metus', axRet: 'Grąža per laikotarpį, %',
  capRisk: (t, n) => `${t}. Kiekvienas taškas – vienas fondas (${n}); spalva – tiekėjas. Laikotarpį, amžiaus grupes ir tiekėjus pasirinkite virš grafiko.`, rmGroups: 'Amžiaus grupės:', rmProvs: 'Tiekėjai:', rmAll: 'Visos',
  cMetrics: (a, ra, z, rz, v, rv) => `Daugiausia uždirbo <b>${a}</b> (${ra}), mažiausiai – <b>${z}</b> (${rz}); mažiausiai svyravo <b>${v}</b> (${rv}).`,
  cCal: (y, a, ra, z, rz) => `${y} m. geriausias – <b>${a}</b> (${ra}), silpniausias – <b>${z}</b> (${rz}).`,
  cFee: (y, lo, hi, d) => `Per ${y} ${y >= 10 ? 'metų' : 'metus'} mažiausio (${lo}) ir didžiausio (${hi}) mokesčio fonduose sukauptos sumos skiriasi <b>${d}</b>.`,
  pnav: ['Visa rinka', 'Lyderiai ir judesiai', 'Fondų palyginimas', 'Rizika', 'Metai ir mėnesiai', 'Rinkos įžvalgos'],
  hMetrics: 'Rezultatų rodikliai', hCal: 'Kalendorinių metų grąža', hRoll: 'Slenkanti grąža (iki paskutinės dienos)',
  hQP: 'Vieta pagal laikotarpį (ši grupė; 1 = geriausia)', hHm: 'Mėnesių grąžos šilumos žemėlapis –',
  thRank: '#', thFund: 'Valdytojas', thPeriodRet: 'Grąža laikotarpyje', thVol: 'Svyravimas per metus, laikotarpyje', thMdd: 'Didžiausias kritimas, laikotarpyje',
  thInception: 'Pradžia', thCagr: 'Metinė grąža nuo įsteigimo', thVolAll: 'Svyravimas per metus nuo įsteigimo', thMddAll: 'Didžiausias kritimas nuo įsteigimo',
  thRet1m: '1 mėn.', thRet3m: '3 mėn.', thRet6m: '6 mėn.', thRet1y: '1 metai', thRet3y: '3 metai, metinė', thRet5y: '5 metai, metinė',
  thR1avg: 'Slenkantys 1 metai: vidurkis', thR1min: 'min.', thR1max: 'maks.', thR1pos: '% teigiamų', thYear: 'Metai',
  csLbl: 'Grafiko pradžia', csPeriod: 'Laikotarpio pradžia', csYoung: 'Nuo jauniausio fondo pradžios', csFrom: p => `Nuo ${p} pradžios`,
  ytd: 'Šie metai', mChart: (g, p) => `${g} · ${p}. Grąža perskaičiuota į 0 % laikotarpio pradžioje.`,
  mZoom: (g, a, b) => `${g} · priartinta ${a} → ${b}. Grąža perskaičiuota į 0 % priartinto laikotarpio pradžioje.`,
  nFund: 'Svyravimas = dienos grąžų standartinis nuokrypis × √252 (dienos be kainos pokyčio neįtraukiamos; dienos, kai vertę paskelbė tik vienas valdytojas – pvz. SEB per šventes – dienos statistikoje praleidžiamos, pokytis skaičiuojamas iki kitos bendros dienos). Metinė grąža = sudėtinis metinis augimas tarp pirmos ir paskutinės turimos kainos (rodoma tik bent vienerių metų istorijai). Didžiausias kritimas = didžiausias nuosmukis nuo viršūnės iki dugno. * = fondas pradėjo veikti tais metais (grąža nuo įsteigimo). Ilgesnė nei metų slenkanti grąža perskaičiuota metine. Vieneto vertė jau yra po mokesčių ir mokesčių fondui. Praeities rezultatai negarantuoja ateities grąžos.',
  foot: 'Duomenys renkami automatiškai iš tiekėjų svetainių ir API; tai informacinė medžiaga, ne investavimo rekomendacija.',
  share: 'Kopijuoti nuorodą', copied: 'Nuoroda nukopijuota', xlsx: 'Excel', xlsxBusy: 'Ruošiama…', allFunds: 'Visi fondai', allNote: 'Grafikas braižomas vienai amžiaus grupei – pasirinkite grupę aukščiau, kad jį pamatytumėte. Lentelėse žemiau rodomi visi fondai; vietos ir paryškintos geriausios reikšmės skaičiuojamos kiekvienoje amžiaus grupėje.', capMetrics2: 'Stulpeliai „nuo įsteigimo“: kiekvieno fondo pirma diena → pabaigos data.', xlsxDay: 'Dienos lentelė (.xlsx)', xlsxDayTip: 'Toks pat išdėstymas kaip senajame dienos faile (fondas, data, vieneto vertė, grynieji aktyvai): po eilutę kiekvienam fondui pasirinktai dienai; pagal nutylėjimą – naujausia. Jei fondas tą dieną vertės neturi, imama paskutinė ankstesnė.', xlsxFail: 'Nepavyko įkelti Excel bibliotekos (nėra interneto?).', print: 'Spausdinti / PDF',
  viewret: 'Grąža', viewdiff: 'Skirtumas', diffFrom: 'nuo', diffAvg: 'Grupės vidurkio', mDiff: r => `Linijos rodo kiekvieno fondo sukauptą grąžą minus ${r ? r + ' grąža' : 'grupės vidurkis'}, procentais (0 = ${r || 'grupės vidurkis'}).`,
  eventsBtn: 'Rinkų įvykiai', resetZoom: 'Atstatyti mastelį', png: 'Atsisiųsti PNG', zoomHint: 'Patarimas: pele pažymėkite sritį grafike, kad priartintumėte; užveskite pelę ant tiekėjo, kad jį paryškintumėte; paspauskite pavadinimą grafiko dešinėje (arba dukart paspauskite mygtuką), kad jį prisegtumėte.',
  advBtn: 'Papildomi rodikliai: Sharpe, geriausias ir blogiausias mėnuo', rf: 'Be rizikos palūkanų norma, % per metus', rfAvg: 'vidutinė laikotarpio €STR', rfAutoBtn: 'Grąžinti €STR',
  hAdv: 'Papildomi rodikliai', thAnn: 'Metinė grąža, laikotarpyje', thSharpe: 'Sharpe koeficientas', thBestD: 'Geriausia diena', thWorstD: 'Blogiausia diena', thBestM: 'Geriausias mėnuo', thWorstM: 'Blogiausias mėnuo',
  thBestY: 'Geriausi metai', thWorstY: 'Blogiausi metai', thPosM: '% teigiamų mėnesių',
  nAdv: 'Pasirinktam laikotarpiui. Sharpe = (metinė grąža − be rizikos palūkanų norma) ÷ metinis svyravimas; numatyta norma – vidutinė €STR per tą patį laikotarpį. Didesnis Sharpe – daugiau grąžos už tą pačią riziką. Paryškinta – geriausia reikšmė grupėje (svyravimo – mažiausia). Mėnesio data – užvedus pelę. Trumpesniems nei metų laikotarpiams metiniai skaičiai nepatikimi.',
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
  thGroup: 'Grupė', thLeader: 'Lyderis', thLagger: 'Atsiliekantis', thSpread: 'Skirtumas, %', thMove: 'Didžiausias 1 d. pokytis', thUp1: 'Didžiausias 1 d. kilimas', thDn1: 'Didžiausias 1 d. kritimas',
  nSum: 'Skaičiuojama automatiškai iš naujausių kiekvienos amžiaus grupės duomenų; lyderis / atsiliekantis – pagal grąžą pasirinktame lange.',
  info: {
    fee: 'Kiekvieną mėnesį pridedama įmoka, pinigai auga prielaidine grąža, o valdymo mokestis (metinis % ÷ 12) atskaitomas nuo sukaupto turto – taip, kaip II pakopoje (kasdien, jau įskaičiuota į vieneto vertę). „Sumokėta mokesčių“ = visi atskaityti mokesčiai; „Mažesnė suma“ apima ir grąžą, kurią tie pinigai būtų uždirbę. Mokesčiai – bazinis mokestis nuo turto iš Lietuvos banko sąrašo (vieno valdytojo gyvenimo ciklo fondų mokestis vienodas).',
    dd: 'Kilimas = didžiausias vieneto vertės pakilimas nuo žemiausio taško per mėnesį, ketvirtį ar metus; kritimas = didžiausias nuosmukis nuo aukščiausio taško per tą laikotarpį. Kartu jie parodo, kaip plačiai fondas svyravo kiekvieno laikotarpio viduje, o ne tik kuo jis baigėsi. „Linija“ rodo sukauptą grąžą ir kiek kiekvieną dieną fondas buvo žemiau ankstesnės viršūnės – giliausia duobė ir yra didžiausias kritimas.',
    rel: 'Parodo, kiek kiekvienas fondas lenkia savo konkurentus arba atsilieka nuo jų: grąža per pasirinktą laikotarpį minus paprastas (nesvertinis) visų tos pačios amžiaus grupės fondų grąžos vidurkis. Tiekėjų mygtukai tik paslepia juostas – vidurkis visada skaičiuojamas iš visų fondų su šviežiais duomenimis.',
    rf: () => DATA.rf ? `Numatyta: vidutinė €STR (euro trumpalaikių palūkanų norma, kurią kasdien skelbia Europos centrinis bankas) per kiekvieno fondo laikotarpį – tiek, kiek per tas pačias dienas iš tikrųjų būtų uždirbęs nerizikingas indėlis (iki 2019 m. spalio – EONIA − 0,085 p. p., oficialus ECB ryšys tarp jų). Laukelyje rodomas pasirinkto laikotarpio vidurkis; paskutinė reikšmė ${num(DATA.rf.value, 2)} % per metus (${DATA.rf.date}). Jei istorijos nėra, naudojama paskutinė reikšmė. Tai standartinė nerizikinga norma EUR investuotojams (visi Lietuvos pensijų fondų dalyviai investuoja eurais); ji atnaujinama automatiškai kartu su svetainės duomenimis. Šaltinis: ${DATA.rf.source}. Įrašytas savas skaičius taikomas visiems laikotarpiams; „Grąžinti €STR“ grąžina automatinį vidurkį.` : 'Automatinė €STR norma (Europos centrinis bankas) dar negauta, todėl naudojama 2 % per metus. Galite įrašyti savo skaičių.',
    riskmap: 'Horizontaliai – svyravimas (dienos grąžų standartinis nuokrypis, perskaičiuotas metams) pasirinktu laikotarpiu. Vertikaliai – grąža per tą patį laikotarpį. Aukščiau ir kairiau – geriau: daugiau grąžos už mažesnę riziką. Rodomi tik fondai su šviežiais duomenimis ir bent 20 dienų grąžų.',
    ret: 'Vieneto vertės pokytis tarp laikotarpio pradžios ir pabaigos. Vieneto vertė jau yra po mokesčių ir sąnaudų, todėl papildomai nieko atimti nereikia.',
    rank: 'Kiekvieno tiekėjo vieta savo amžiaus grupėje pagal grąžą pasirinktu laikotarpiu; 1 = geriausia.',
    relm: 'Nepasirinkus valdytojo: kiekvieno valdytojo grąža minus kitų penkių tos pačios amžiaus grupės fondų grąžos mediana. Pasirinkus valdytoją: jo grąža minus kiekvieno konkurento grąža; paskutinis stulpelis – minus paprastas konkurentų vidurkis. Žalia – pirmasis lenkia, raudona – atsilieka. p. p. = procentiniai punktai.',
    annm: 'Laikotarpio grąža, perskaičiuota metams: (1 + grąža)^(365,25 ÷ dienos) − 1. Trumpesniam nei metai laikotarpiui tai ekstrapoliacija – vertinti atsargiai.',
    overall: 'Kiekviena amžiaus grupė × kiekvienas laikotarpis yra vienas palyginimas. Skaičiuojama, kaip dažnai tiekėjas yra pirmas, 1–2 vietoje ir jo vidutinė vieta. Trumpi laikotarpiai triukšmingi, todėl „1 m. ir ilgesni“ dažniausiai teisingesnis.',
    vol: 'Svyravimas = dienos grąžų standartinis nuokrypis × √252 – kiek svyruoja vieneto vertė; didesnis = didesnė rizika. Dienos be kainos pokyčio neįtraukiamos.',
    mdd: 'Didžiausias kritimas = didžiausias nuosmukis nuo viršūnės iki vėlesnio dugno. Rodo blogiausią galimą investuotojo nuostolį.',
    cagr: 'Sudėtinis metinis augimas tarp pirmos ir paskutinės turimos vieneto vertės (rodoma tik bent vienerių metų istorijai).',
    cal: 'Grąža už kiekvienus kalendorinius metus. * = fondas pradėjo veikti tais metais, todėl rodoma tik dalis metų. Paskutinis stulpelis – šie metai iki šiol.',
    roll: 'Grąža per paskutinius 1, 3, 6, 12, 36, 60 mėn. (ilgesnė nei metų – perskaičiuota metine). Slenkantys 1 metai = visi galimi 12 mėn. langai istorijoje: vidurkis, blogiausias, geriausias ir teigiamų dalis.',
    heat: 'Grąža kiekvieną kalendorinį mėnesį (eilutės = metai). Žalia = pelnas, raudona = nuostolis; paskutinis stulpelis – metai.',
    sharpe: 'Sharpe koeficientas = (metinė grąža − be rizikos palūkanų norma) ÷ metinis svyravimas. Didesnis = geresnė grąža vienam rizikos vienetui. Numatyta be rizikos norma – vidutinė €STR per tą patį laikotarpį; galite įrašyti savo (pvz., indėlių palūkanas).',
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
// amžiaus grupių tvarka visur vienoda: turto išsaugojimo, 1961–1967 … 2003–2009 (auditas #32)
DATA.groups.sort((a, b) => (a.id === 'turto' ? '0' : a.id).localeCompare(b.id === 'turto' ? '0' : b.id));
const P = { period: 'ytd', from: '', to: '', group: DATA.groups[DATA.groups.length - 1].id, provs: new Set(DATA.providers.map(p => p.id)),
  hmGroup: DATA.groups[DATA.groups.length - 1].id, hl: null, pin: null, view: 'ret', diffRef: 'avg', zoom: null, events: false, adv: false, cs: null, rf: null, hmProv: null, sumWin: 'sel', ovP: new Set(['1y', '3y', '5y', 'max']), gx: false, idx: new Set(['MSCI_ACWI', 'SP500']) };
const $ = id => document.getElementById(id);
const byId = id => DATA.groups.find(g => g.id === id);

/* ---------- būsenos išsaugojimas (naršyklėje) ir dalijimosi nuoroda ---------- */
function saveState() {
  try { localStorage.setItem(STKEY, JSON.stringify({ real: !!P.real, period: P.period, from: P.from, to: P.to, group: P.group, provs: [...P.provs], adv: P.adv, rfUser: P.rf, view: P.view, diffRef: P.diffRef, hmProv: P.hmProv, hmGroup: P.hmGroup, mref: P.mref, cpi: !!P.cpi, sumWin: P.sumWin, ovP: [...P.ovP], gx: P.gx, idx: [...P.idx] })); } catch (e) {}
}
function applyState(s) {
  if (!s) return;
  if (PRESET_IDS.includes(s.period) || s.period === 'custom' || isCalPeriod(s.period)) P.period = s.period;
  P.real = s.real === true && typeof CPI !== 'undefined';   // reali grąža – tik „Fondų palyginimo“ grafikui (savininkas 2026-10-16)
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
  if (typeof s.cpi === 'boolean') P.cpi = s.cpi;
  if (s.mref === '' || DATA.providers.some(p => p.id === s.mref)) P.mref = s.mref;
  if (Array.isArray(s.idx)) P.idx = new Set(s.idx.filter(x => IDX_META[x] || x === 'GAVG'));
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
try { applyState(JSON.parse(localStorage.getItem(STKEY))); } catch (e) {}
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
  const ix = statIdx(f, ia, ie);
  for (let k = 1; k < ix.length; k++) {
    const i = ix[k], x = f.v[i] / f.v[ix[k - 1]] - 1; if (x !== 0) r.push(x);
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
  const ix = statIdx(f, ia, ie);
  for (let k = 1; k < ix.length; k++) {
    const i = ix[k], x = (f.v[i] / f.v[ix[k - 1]] - 1) * 100;
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
  const rfx = rf ?? rfAuto(f.d[ia], f.d[ie]);
  return { ann, vol, sharpe: ann !== null && vol ? (ann - rfx) / vol : null, bestD, worstD, bestM, worstM, bestY, worstY, posM: months.length ? months.filter(x => x.v > 0).length / months.length * 100 : null };
}
function rankOf(values) {                   // values: [{key, v}] -> Map key -> vieta (didesnė reikšmė = geresnė)
  const ok = values.filter(o => o.v !== null && o.v !== undefined).sort((a, b) => b.v - a.v), map = new Map();
  ok.forEach((o, i) => map.set(o.key, i + 1)); return { map, n: ok.length };
}
const rkClass = (rank, n) => (!rank || n < 2) ? '' : 'rk' + (Math.round((rank - 1) / (n - 1) * 5) + 1);
const MARKET_ORDER = ['SEB', 'SWEDBANK', 'ARTEA', 'ALLIANZ', 'LUMINOR', 'GOINDEX'];   // lentelių stulpelių tvarka
const marketProvs = () => IS3 ? DATA.providers : MARKET_ORDER.map(id => DATA.providers.find(p => p.id === id));
const retOf = (g, pid, rng) => { const f = g.funds.find(x => x.provider === pid); if (!f || isStale(f, rng.overallLast)) return null; const s = seriesOf(f, rng.anchor, rng.end); return s ? s.ret : null; };
const fmtP = (v, p = 1) => pct(v, p);

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
      const ix = statIdx(f, s.ia, s.ie); for (let k = 1; k < ix.length; k++) { const i = ix[k], x = (f.v[i] / f.v[ix[k - 1]] - 1) * 100; if (!move || Math.abs(x) > Math.abs(move.v)) move = { p: f.provider, g, v: x, d: f.d[i] }; }
    });
    if (items.length < 2) return;
    items.sort((a, b) => b.r - a.r); ng++;
    const a = items[0], b = items[items.length - 1];
    lead[a.p] = (lead[a.p] || 0) + 1; lag[b.p] = (lag[b.p] || 0) + 1;
    rows.push({ g, a, b, anchor, end });
  });
  const top = o => Object.entries(o).sort((x, y) => y[1] - x[1])[0];
  const parts = [T().sumLatest(iso(latest))];
  if (!IS3 && top(lead)) { const [p, k] = top(lead); parts.push(T().sumLead(labelOf(p), k, ng)); }
  if (!IS3 && top(lag)) { const [p, k] = top(lag); parts.push(T().sumLag(labelOf(p), k, ng)); }
  if (move) parts.push(T().sumMove(labelOf(move.p), groupLabel(move.g), fmtP(move.v, 2), iso(move.d)));
  $('sumText').innerHTML = ng ? `<p class="sumline">${parts.join(' ')}</p>` : `<p class="na">${T().sumNoData}</p>`;
  const cellMove = (g, anchor, end, dir) => {   // dir > 0 – didžiausias kilimas, dir < 0 – didžiausias kritimas (auditas #6)
    let best = null; g.funds.forEach(f => { if (isStale(f, groupEnd(g).overallLast)) return; const s = seriesOf(f, anchor, end); if (!s) return; const ix = statIdx(f, s.ia, s.ie); for (let k = 1; k < ix.length; k++) { const i = ix[k], x = (f.v[i] / f.v[ix[k - 1]] - 1) * 100; if (x * dir > 0 && (!best || x * dir > best.v * dir)) best = { p: f.provider, v: x, d: f.d[i] }; } });
    return best ? `${labelOf(best.p)} ${fmtP(best.v, 2)} <span class="na">${iso(best.d)}</span>` : '–';
  };
  const sw = p => `<span class="sw" style="background:${colorOf(p)}"></span>`;
  if (rows.length) setCap('tSum', spanText(winLabel(P.sumWin), rows));
  $('tSum').innerHTML = `<thead><tr><th style="text-align:left">${T().thGroup}</th><th>${T().thLeader}</th><th>${T().thLagger}</th><th>${T().thSpread}</th><th>${T().thUp1}</th><th>${T().thDn1}</th></tr></thead><tbody>`
    + rows.map(r => `<tr><td style="text-align:left">${groupLabel(r.g)}</td><td>${sw(r.a.p)}${labelOf(r.a.p)} ${fmtP(r.a.r, 2)}</td><td>${sw(r.b.p)}${labelOf(r.b.p)} ${fmtP(r.b.r, 2)}</td><td>${num(r.a.r - r.b.r, 2)}</td><td>${cellMove(r.g, r.anchor, r.end, 1)}</td><td>${cellMove(r.g, r.anchor, r.end, -1)}</td></tr>`).join('') + '</tbody>';
  cardify($('tSum'));
}

/* ---------- 1. visos rinkos lentelės ---------- */
/* Keturios heat map lentelės kaip savininko Excel: grąža (+ konkurentų mediana), palyginimas su konkurentais, vieta, metinė grąža.
   Lyginamasis valdytojas (P.mref) pasirenkamas; nepasirinkus – kiekvienas lyginamas su kitų penkių mediana (savininko sprendimas 2026-10-14). */
const medianOf = xs => { const a = xs.filter(x => x !== null && x !== undefined).sort((x, y) => x - y); if (!a.length) return null; const k = a.length >> 1; return a.length % 2 ? a[k] : (a[k - 1] + a[k]) / 2; };
const meanOf = xs => { const a = xs.filter(x => x !== null && x !== undefined); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const relStyle = v => `background:${heatColor(v * 1.5)}`;
/* Žemiau „Fondų palyginimo“ – lentelės, kurios priklauso nuo pasirinktos grupės: prie antraštės – grupės ženkliukas,
   kad nebūtų painiojama su viršutinėmis visos rinkos lentelėmis (savininkas 2026-10-16) */
function markGroup() {
  const g = P.group === 'all' ? T().allFunds : groupName(P.group);
  ['hMetrics', 'hDd', 'hCal', 'hMon', 'hRoll', 'hQP', 'hAdv'].forEach(id => { const h = $(id); if (!h) return; let b = h.querySelector(':scope > .gbadge');
    if (!b) { b = document.createElement('a'); b.className = 'gbadge'; b.href = '#'; b.onclick = e => { e.preventDefault(); $('group').scrollIntoView({ block: 'center' }); $('group').focus(); }; h.append(b); }
    b.textContent = g; b.title = lang === 'lt' ? 'Grupė – keisti „Fondų palyginimo“ viršuje' : 'Group – change at the top of “Fund comparison”'; });
}
function renderMarket() {
  $('hMarket').textContent = T().hMarket; $('hRet').innerHTML = T().hRet + ik('ret'); $('hRank').innerHTML = T().hRank + ik('rank');
  $('hRelM').innerHTML = T().hRelM + ik('relm'); $('hAnnM').innerHTML = T().hAnnM + ik('annm');
  $('mMarket').textContent = T().mMarket(periodText()); $('nMarket').textContent = T().nMarket;
  const provs = marketProvs(), ref = provs.some(p => p.id === P.mref) ? P.mref : '', refLabel = ref ? labelOf(ref) : '';
  const ms = $('mref');
  ms.innerHTML = `<option value="">${T().mrefNone}</option>` + provs.map(p => `<option value="${p.id}">${T().mrefPick(p.label)}</option>`).join(''); ms.value = ref;
  const hcell = p => `<th><span class="sw-top" style="background:${colorOf(p.id)}"></span>${p.label}</th>`;
  const head = `<thead><tr><th></th>${provs.map(hcell).join('')}</tr></thead>`;
  const headRet = `<thead><tr><th></th>${provs.map(hcell).join('')}<th class="pm">${T().peerMed(refLabel)}</th></tr></thead>`;
  const peers = provs.filter(p => p.id !== ref);
  const headRel = `<thead><tr><th></th>${(ref ? peers : provs).map(hcell).join('')}${ref ? `<th class="pm">${T().peerAvg}</th>` : ''}</tr></thead>`;
  // eilutės pagal riziką: viršuje turto išsaugojimo, toliau vyresni, jauniausi (2003–2009) apačioje
  const gxStarts = [];
  const rows = DATA.groups.map(g => {
    const rng = rangeFor(g), vals = {}, ann = {};
    if (P.gx) {                                   // visi nuo Goindex fondo pradžios (arba nuo vėlesnės laikotarpio pradžios)
      const gf = g.funds.find(f => f.provider === 'GOINDEX');
      if (gf) { rng.anchor = Math.max(rng.anchor, gf.d[0]); gxStarts.push(gf.d[0]); }
    }
    g.rngM = rng;
    provs.forEach(p => {
      vals[p.id] = retOf(g, p.id, rng);
      const f = g.funds.find(x => x.provider === p.id), days = f ? rng.end - Math.max(rng.anchor, f.d[0]) : 0;
      ann[p.id] = vals[p.id] === null || days < 1 ? null : (Math.pow(1 + vals[p.id] / 100, 365.25 / days) - 1) * 100;
    });
    const med = medianOf(peers.map(p => vals[p.id]));
    const rel = {};
    if (ref) { peers.forEach(p => { rel[p.id] = vals[ref] === null || vals[p.id] === null ? null : vals[ref] - vals[p.id]; }); const pa = meanOf(peers.map(p => vals[p.id])); rel.avg = vals[ref] === null || pa === null ? null : vals[ref] - pa; }
    else provs.forEach(p => { const m = medianOf(provs.filter(q => q.id !== p.id).map(q => vals[q.id])); rel[p.id] = vals[p.id] === null || m === null ? null : vals[p.id] - m; });
    const { map, n } = rankOf(provs.map(p => ({ key: p.id, v: vals[p.id] })));
    return { g, vals, ann, med, rel, ranks: map, n };
  });
  const avgOf = (fn) => meanOf(rows.map(fn));
  const avgRet = {}, avgRank = {}, avgAnn = {}, avgRel = {};
  provs.forEach(p => {
    avgRet[p.id] = avgOf(x => x.vals[p.id]); avgAnn[p.id] = avgOf(x => x.ann[p.id]);
    avgRank[p.id] = avgOf(x => x.ranks.get(p.id) || null);
  });
  (ref ? [...peers.map(p => p.id), 'avg'] : provs.map(p => p.id)).forEach(k => { avgRel[k] = avgOf(x => x.rel[k]); });
  const avgMed = avgOf(x => x.med);
  const avgW = {};                                // svertinis pagal fondo paskutinius grynuosius aktyvus (tos pačios grupės kaip vidurkio eilutėje)
  provs.forEach(p => {
    let s = 0, w = 0;
    rows.forEach(r => { const v = r.vals[p.id], f = r.g.funds.find(x => x.provider === p.id); if (v !== null && v !== undefined && f && f.assets > 0) { s += v * f.assets; w += f.assets; } });
    avgW[p.id] = w > 0 ? s / w : null;
  });
  const awRank = rankOf(provs.map(p => ({ key: p.id, v: avgW[p.id] })));
  const arRank = rankOf(provs.map(p => ({ key: p.id, v: avgRet[p.id] }))), akRank = rankOf(provs.map(p => ({ key: p.id, v: avgRank[p.id] === null ? null : -avgRank[p.id] }))), aaRank = rankOf(provs.map(p => ({ key: p.id, v: avgAnn[p.id] })));
  const pc2 = v => num(v, 2) + pctSfx();
  const na = '<td class="na">–</td>', gap = c => `<tr class="gap"><td colspan="${c}"></td></tr>`;
  const pmCell = v => v === null ? na : `<td class="pm">${pc2(v)}</td>`;
  const relCell = v => v === null || v === undefined ? na : `<td style="${relStyle(v)}">${num(v, 2)}</td>`;
  const rkCell = (v, rank, n, f) => v === null ? na : `<td class="${rkClass(rank, n)}">${f(v)}</td>`;
  const retBody = rows.map(r => `<tr><td>${groupShort(r.g)}</td>${provs.map(p => rkCell(r.vals[p.id], r.ranks.get(p.id), r.n, pc2)).join('')}${pmCell(r.med)}</tr>`).join('')
    + gap(provs.length + 2) + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => rkCell(avgRet[p.id], arRank.map.get(p.id), arRank.n, pc2)).join('')}${pmCell(avgMed)}</tr>`
    + `<tr class="avg"><td title="${T().avgWt}">${T().avgW} <span class="info" aria-hidden="true">i</span></td>${provs.map(p => rkCell(avgW[p.id], awRank.map.get(p.id), awRank.n, pc2)).join('')}${na}</tr>`;
  const relKeys = ref ? [...peers.map(p => p.id), 'avg'] : provs.map(p => p.id);
  const relBody = rows.map(r => `<tr><td>${groupShort(r.g)}</td>${relKeys.map(k => relCell(r.rel[k])).join('')}</tr>`).join('')
    + gap(relKeys.length + 1) + `<tr class="avg"><td>${T().avg}</td>${relKeys.map(k => relCell(avgRel[k])).join('')}</tr>`;
  const rankBody = rows.map(r => `<tr><td>${groupShort(r.g)}</td>${provs.map(p => { const k = r.ranks.get(p.id); return k ? `<td class="${rkClass(k, r.n)}">${k}</td>` : na; }).join('')}</tr>`).join('')
    + gap(provs.length + 1) + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => rkCell(avgRank[p.id], akRank.map.get(p.id), akRank.n, v => num(v, 1))).join('')}</tr>`;
  const annBody = rows.map(r => { const rk = rankOf(provs.map(p => ({ key: p.id, v: r.ann[p.id] }))); return `<tr><td>${groupShort(r.g)}</td>${provs.map(p => rkCell(r.ann[p.id], rk.map.get(p.id), rk.n, pc2)).join('')}</tr>`; }).join('')
    + gap(provs.length + 1) + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => rkCell(avgAnn[p.id], aaRank.map.get(p.id), aaRank.n, pc2)).join('')}</tr>`;
  const spanAll = spanText(periodText() + (P.gx ? ' · ' + T().gxBtn : ''), rows.map(r => r.g.rngM));
  $('btnGx').textContent = T().gxBtn; $('btnGx').setAttribute('aria-pressed', P.gx); $('btnMxl').textContent = '⤓ ' + T().mxl; $('btnMxl').title = T().mxlTip;
  const gxa = Math.min(...gxStarts), gxb = Math.max(...gxStarts);
  $('nGx').hidden = !P.gx; $('nGx').textContent = P.gx && gxStarts.length ? T().gxNote(gxa === gxb ? iso(gxa) : `${iso(gxa)}…${iso(gxb)}`) : '';
  ['tRet', 'tRank', 'tRelM', 'tAnnM'].forEach(id => setCap(id, spanAll));
  $('tRet').innerHTML = headRet + `<tbody>${retBody}</tbody>`;
  $('tRelM').innerHTML = headRel + `<tbody>${relBody}</tbody>`;
  $('tRank').innerHTML = head + `<tbody>${rankBody}</tbody>`;
  $('tAnnM').innerHTML = head + `<tbody>${annBody}</tbody>`;
  renderOverall();
}

/* bendras reitingas: visos grupės × laikotarpiai */
/* „Bendras reitingas“ + „Vieta pagal laikotarpį“ – viena kortelė (savininko patvirtinta struktūra 2026-10-16):
   „Visos grupės“ – kiek kartų kiekvienas valdytojas buvo 1-as ar 2-as; pasirinkus grupę – tos grupės vietos kiekvienu laikotarpiu */
addStrings({ ovG: 'Group:', ovGAll: 'All groups (summary)' }, { ovG: 'Grupė:', ovGAll: 'Visos grupės (suvestinė)' });
function renderOverall() {
  let gsel = $('ovG');
  if (!gsel) { const l = document.createElement('label'); l.className = 'field'; l.innerHTML = '<span id="ovGL"></span> <select id="ovG"></select>'; $('lblOvP').before(l); gsel = $('ovG');
    gsel.addEventListener('change', () => { P.ovG = gsel.value; renderOverall(); }); }
  $('ovGL').textContent = T().ovG;
  gsel.innerHTML = `<option value="all">${T().ovGAll}</option>` + DATA.groups.map(g => `<option value="${g.id}">${groupLabel(g)}</option>`).join('');
  gsel.value = P.ovG && byId(P.ovG) ? P.ovG : 'all';
  const one = gsel.value !== 'all';
  ['lblOvP', 'ovPers', 'ovPreset', 'ovCommon'].forEach(id => { const e = $(id); if (e) e.hidden = one; });
  $('hOv').innerHTML = T().hOv;
  if (one) { const g = byId(gsel.value); renderRanksByPeriod([g], false, 'tOv'); $('nOv').textContent = ''; return; }
  $('lblOvP').textContent = T().ovPick;
  $('ovPers').querySelectorAll('button').forEach(b => { b.textContent = T().periods[b.dataset.p]; b.setAttribute('aria-pressed', P.ovP.has(b.dataset.p)); });
  const isSet = ids => ids.length === P.ovP.size && ids.every(x => P.ovP.has(x));
  $('ovPreset').querySelectorAll('button').forEach(b => { b.textContent = T()[b.dataset.k]; b.setAttribute('aria-pressed', isSet(OV_PRESETS[b.dataset.k])); });
  let cseg = $('ovCommon');   // jungiklis „tik bendri palyginimai“ – kur dalyvauja visi valdytojai (auditas #5)
  if (!cseg) {
    cseg = document.createElement('div'); cseg.className = 'seg'; cseg.id = 'ovCommon'; cseg.setAttribute('role', 'group');
    cseg.innerHTML = '<button type="button" data-v="0"></button><button type="button" data-v="1"></button>';
    $('ovPreset').after(cseg);
    cseg.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; P.ovCommon = b.dataset.v === '1'; renderOverall(); });
  }
  cseg.querySelectorAll('button').forEach(b => { b.textContent = b.dataset.v === '1' ? T().ovCommonOn : T().ovCommonOff; b.setAttribute('aria-pressed', String(!!P.ovCommon === (b.dataset.v === '1'))); });
  const pers = PERIOD_IDS.filter(p => P.ovP.has(p)), st = {}, perTxt = pers.map(p => T().periods[p]).join(', ');
  setCap('tOv', T().capOv(perTxt, iso(LATEST)));
  $('nOv').textContent = T().nOv(perTxt, DATA.groups.length) + ' ' + T().ovCommonNote;
  DATA.providers.forEach(p => { st[p.id] = { cmp: 0, first: 0, top2: 0, rs: 0 }; });
  DATA.groups.forEach(g => pers.forEach(per => {
    const rng = rangeAt(g, per), vals = DATA.providers.map(p => ({ key: p.id, v: retOf(g, p.id, rng) })), { map, n } = rankOf(vals);
    if (n < 3 || (P.ovCommon && n < DATA.providers.length)) return;
    map.forEach((rank, id) => { const s = st[id]; s.cmp++; s.rs += rank; if (rank === 1) s.first++; if (rank <= 2) s.top2++; });
  }));
  const list = DATA.providers.filter(p => st[p.id].cmp).map(p => ({ id: p.id, ...st[p.id], avg: st[p.id].rs / st[p.id].cmp })).sort((a, b) => a.avg - b.avg);
  const bst = (k, dir) => Math.max(...list.map(x => dir * x[k]));
  const mark = (v, k, dir, txt) => `<td class="${dir * v === bst(k, dir) ? 'best' : ''}">${txt}</td>`;
  const bFirst = Math.max(...list.map(x => x.first / x.cmp)), bTop2 = Math.max(...list.map(x => x.top2 / x.cmp)), bAvg = Math.min(...list.map(x => x.avg));
  $('tOv').innerHTML = `<thead><tr>${th(T().thRank, 'overall')}<th style="text-align:left">${T().thFund}</th><th>${T().thCmp}</th><th>${T().thFirst}</th><th>${T().thFirstPct}</th><th>${T().thTop2}</th><th>${T().thAvgRank}</th></tr></thead><tbody>`
    + list.map((x, i) => `<tr><td class="n">${i + 1}</td><td class="name"><span class="sw" style="background:${colorOf(x.id)}"></span>${labelOf(x.id)}</td><td>${x.cmp}</td><td>${x.first}</td><td class="${x.first / x.cmp === bFirst ? 'best' : ''}">${num(x.first / x.cmp * 100, 2)}${pctSfx()}</td><td class="${x.top2 / x.cmp === bTop2 ? 'best' : ''}">${num(x.top2 / x.cmp * 100, 2)}${pctSfx()}</td><td class="${x.avg === bAvg ? 'best' : ''}">${num(x.avg, 2)}</td></tr>`).join('') + '</tbody>';
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
function setIdxAvgFee() {                 // rodomų pensijų fondų vidutinis valdymo mokestis (indekso mokesčio režimui „Fondų vidutinis“)
  if (typeof FEES === 'undefined') { IDX_AVG_FEE = null; return; }
  const gs = P.group === 'all' ? DATA.groups : [byId(P.group)], xs = [];
  gs.forEach(g => g.funds.forEach(f => { if (P.provs.has(f.provider) && FEES[`${f.provider}|${g.id}`] != null) xs.push(FEES[`${f.provider}|${g.id}`]); }));
  IDX_AVG_FEE = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  idxFeeCtl($('idxFee'), () => { renderIdxChips(); renderFunds(); });
}
function drawChart() { REAL = !!P.real; try { drawChart0(); } finally { REAL = false; } }
function drawChart0() {
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
  if (P.view !== 'diff' && P.cpi && typeof CPI !== 'undefined') {   // sukaupta infliacija nuo grafiko pradžios (mėnesio VKI)
    const c0 = cpiRaw(x0), pts = [[x0, 0]];
    if (c0) {
      for (let y = new Date(x0 * DAY).getUTCFullYear(), m = new Date(x0 * DAY).getUTCMonth(); ; m++) {
        if (m > 11) { m = 0; y++; }
        const d = Math.min(Math.round(Date.UTC(y, m + 1, 0) / DAY), x1); if (d <= x0) continue;
        const c = cpiRaw(d); if (c) pts.push([d, (c / c0 - 1) * 100]);
        if (d >= x1) break;
      }
      if (pts.length > 1) series.push({ provider: 'CPI', label: T().cpiLine, color: '#b45309', dash: '1 3', points: pts });
    }
  }
  if (P.view !== 'diff' && P.idx.has('GAVG') && grpAvg(g)) { const f = grpAvg(g), s = seriesOf(f, x0, x1); if (s && s.points.length > 1) series.push({ provider: f.provider, label: f.label, color: f.color, dash: f.dash, points: s.points }); }
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
  fin.innerHTML = narrow ? series.map(r => ({ r, v: r.points[r.points.length - 1][1] })).sort((a, b) => b.v - a.v).map(o => `<span><i style="background:${o.r.color || colorOf(o.r.provider)}"></i>${o.r.label || labelOf(o.r.provider)} <b>${pct(o.v, 1)}</b></span>`).join('') : '';
  $('evList').innerHTML = evs.map(e => `<li><span class="n">${e.n}</span><div><b>${iso(e.day)} · ${e.title}</b> – ${e.text} <span class="na">(${e.src.map(s => `<a href="${s.u}" target="_blank" rel="noopener">${s.n}</a>`).join(', ')})</span></div></li>`).join('');
}
/* Grupės vidurkis, svertinis pagal turtą (kaip Estijos pensijų indeksas EPI): data.js „mkt“, skaičiuojama build_site.market_index */
const GAVG_C = {};
function grpAvg(g) {
  if (!DATA.mkt || !DATA.mkt[g.id]) return null;
  if (!GAVG_C[g.id]) { const x = DATA.mkt[g.id], d = [x.d0]; x.dd.forEach(v => d.push(d[d.length - 1] + v)); GAVG_C[g.id] = { provider: 'GAVG', id: 'GAVG', color: 'var(--text-2)', dash: '6 3 1 3', d, v: x.v }; }
  const f = GAVG_C[g.id]; f.label = lang === 'lt' ? 'Grupės vidurkis (svertinis pagal turtą)' : 'Group average (asset-weighted)'; return f;
}
function renderIdxChips() {
  const ga = DATA.mkt ? `<button type="button" class="chip" data-idx="GAVG" aria-pressed="${P.idx.has('GAVG')}" title="${lang === 'lt' ? 'Visų grupės fondų grąža, pasverta pagal jų turtą (didesni fondai sveria daugiau) – kaip Estijos pensijų indeksas EPI' : 'Return of all funds in the group weighted by assets – like the Estonian pension index EPI'}"><span class="sw" style="background:var(--text-2)"></span>${lang === 'lt' ? 'Grupės vidurkis (svertinis)' : 'Group average (weighted)'}</button>` : '';
  $('idxChips').innerHTML = ga + idxFunds().map(f => `<button type="button" class="chip" data-idx="${f.id}" aria-pressed="${P.idx.has(f.id)}"><span class="sw" style="background:${f.color}"></span>${f.label}</button>`).join('');
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
const idxOf = pt => [...(P.idx.has('GAVG') && grpAvg(pt.g) ? [grpAvg(pt.g)] : []), ...(pt.g.id === 'turto' ? [] : idxFunds().filter(f => P.idx.has(f.id)))];     // turto išsaugojimo fondų su akcijomis nelyginame
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
const groupShort = g => g.id === 'turto' ? (lang === 'lt' ? 'Turto išsaug.' : 'Preservation') : groupLabel(g);   // be neaiškios santrumpos „TIF“
const groupName = id => id === 'all' ? T().allFunds : groupLabel(byId(id));
function renderFunds() {
  const ALL = P.group === 'all', gs = ALL ? DATA.groups : [byId(P.group)];
  setIdxAvgFee();
  $('hFund').textContent = T().hFund; $('lblGroup').textContent = T().group;
  const gTag = ` <span class="gtag">· ${groupName(P.group)}</span>`;   // lentelės antraštėje – pasirinkta grupė (auditas #34)
  $('hMetrics').innerHTML = T().hMetrics + gTag + ik('ret'); $('btnMetXl').textContent = '⤓ ' + T().mxl; $('btnMetXl').title = T().mxlTip2; $('hCal').innerHTML = T().hCal + gTag + ik('cal'); $('hRoll').innerHTML = T().hRoll + gTag + ik('roll'); $('nFund').textContent = T().nFund;
  $('hQP').innerHTML = T().hQP + gTag + ik('rank'); $('hHm').innerHTML = T().hHm + ik('heat');
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
      return pt.all.map((s, i) => tr(i === 0, `<td class="n">${rk.map.get(s.f.provider) || ''}</td>${nm(s)}${cell(s.ret, v => pct(v), bestOf('ret', 1))}${cell(s.vol, v => num(v, 2) + pctSfx(), bestOf('vol', -1))}${cell(s.mdd, v => num(v, 2) + pctSfx(), bestOf('mdd', 1))}<td>${iso(s.inception)}</td>${cell(s.cagr, v => pct(v), bestOf('cagr', 1))}${cell(s.volAll, v => num(v, 2) + pctSfx(), bestOf('volAll', -1))}${cell(s.mddAll, v => num(v, 2) + pctSfx(), bestOf('mddAll', 1))}`)).join('')
        + idxOf(pt).map(f => { const s = idxStats(f, pt.rng, grpStart(pt.g)); return `<tr class="idxrow"><td class="n"></td>${idxName(f)}${cell(s.ret, v => pct(v), null)}${cell(s.vol, v => num(v, 2) + pctSfx(), null)}${cell(s.mdd, v => num(v, 2) + pctSfx(), null)}<td>${iso(s.inception)}</td>${cell(s.cagr, v => pct(v), null)}${cell(s.volAll, v => num(v, 2) + pctSfx(), null)}${cell(s.mddAll, v => num(v, 2) + pctSfx(), null)}</tr>`; }).join('');
    }).join('') + '</tbody>';

  renderBars(parts);
  // automatinės išvados kortelių antraštėse (auditas #44) – kai rodoma viena grupė
  const one = !ALL && parts[0].all.filter(s => s.ret !== null);
  if (one && one.length > 1) {
    const vols = one.filter(s => s.vol !== null).sort((x, y) => x.vol - y.vol), A = one[0], Z = one[one.length - 1];
    setConcl('hMetrics', vols.length ? T().cMetrics(labelOf(A.f.provider), pct(A.ret), labelOf(Z.f.provider), pct(Z.ret), labelOf(vols[0].f.provider), num(vols[0].vol, 2) + pctSfx()) : '');
  } else setConcl('hMetrics', '');
  const endAll = Math.max(...rngs.map(r => r.end));
  const calP = parts.map(pt => ({ pt, cal: pt.all.map(s => ({ s, c: calendarReturns(s.f, pt.rng.end) })) }));
  const calRows = calP.flatMap(x => x.cal), needN = Math.min(calRows.length, Math.max(2, Math.ceil(calRows.length * 0.25)));   // metų, kuriuose beveik nėra duomenų (pvz., 2018 – kelios dienos), stulpelio nerodome
  const years = [...new Set(calRows.flatMap(y => Object.keys(y.c)))].map(Number).filter(y => calRows.filter(r => r.c[y]).length >= needN).sort((a, b) => a - b);
  const lastYear = new Date(endAll * DAY).getUTCFullYear();
  setCap('tCal', T().capCal(years[0], lastYear, ALL ? [...new Set(rngs.map(r => iso(r.end)))].join(' / ') : iso(rngs[0].end)));
  $('tCal').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${years.map(y => `<th>${y === lastYear ? T().ytd : y}</th>`).join('')}</tr></thead><tbody>`
    + calP.map(({ pt, cal }) => cal.map((x, i) => tr(i === 0, `${nm(x.s)}${years.map(y => { const c = x.c[y]; if (!c) return '<td class="na">–</td>'; const best = Math.max(...cal.map(z => z.c[y] ? z.c[y].ret : -1e9)); return `<td class="${c.ret === best ? 'best' : ''}">${pct(c.ret, 1)}${c.partial ? '*' : ''}</td>`; }).join('')}`)).join('')
      + idxOf(pt).map(f => { const c = calendarReturns(idxSince(f, grpStart(pt.g)), pt.rng.end); return `<tr class="idxrow">${idxName(f)}${years.map(y => c[y] ? `<td>${pct(c[y].ret, 1)}</td>` : '<td class="na">–</td>').join('')}</tr>`; }).join('')).join('') + '</tbody>';

  { const y = lastYear - 1, cs = !ALL ? calP[0].cal.filter(x => x.c[y] && !x.c[y].partial).sort((p, q) => q.c[y].ret - p.c[y].ret) : [];
    setConcl('hCal', cs.length > 1 ? T().cCal(y, labelOf(cs[0].s.f.provider), pct(cs[0].c[y].ret), labelOf(cs[cs.length - 1].s.f.provider), pct(cs[cs.length - 1].c[y].ret)) : ''); }
  setCap('tRoll', T().capRoll(ALL ? [...new Set(gs.map(g => iso(groupEnd(g).end)))].join(' / ') : iso(groupEnd(gs[0]).end)));
  const keys = [[1, 'thRet1m'], [3, 'thRet3m'], [6, 'thRet6m'], [12, 'thRet1y'], [36, 'thRet3y'], [60, 'thRet5y']];
  $('tRoll').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${keys.map(k => `<th>${T()[k[1]]}</th>`).join('')}<th>${T().thR1avg}</th><th>${T().thR1min}</th><th>${T().thR1max}</th><th>${T().thR1pos}</th></tr></thead><tbody>`
    + parts.map(pt => {
      const rol = pt.all.map(s => ({ s, r: rolling(s.f, groupEnd(pt.g).end) }));
      const rb = k => { const vs = rol.map(x => x.r[k]).filter(v => v !== null && v !== undefined); return vs.length ? Math.max(...vs) : null; };
      return rol.map((x, i) => tr(i === 0, `${nm(x.s)}${keys.map(k => cell(x.r[k[0]] ?? null, v => pct(v, 1), rb(k[0]))).join('')}${x.r.r1 ? `<td>${pct(x.r.r1.avg, 1)}</td><td>${pct(x.r.r1.min, 1)}</td><td>${pct(x.r.r1.max, 1)}</td><td>${num(x.r.r1.pos, 2)}${pctSfx()}</td>` : '<td class="na">–</td>'.repeat(4)}`)).join('');
    }).join('') + '</tbody>';

  renderMonthsTable(parts, ALL, nm, tr); renderYM();
  renderRiskMap(); renderDrawdown();          // „Grąža palyginti su grupės vidurkiu“ pašalinta (savininkas 2026-10-16: dubliuoja palyginimą su konkurentais)
  if (IS3) renderRanksByPeriod(gs, ALL); else [$('hQP'), $('c_tQP'), $('tQP') && $('tQP').closest('.card')].forEach(e => { if (e) e.hidden = true; });   // II pakopa – „Bendrame reitinge“
  renderHeatmap(ALL ? byId(P.hmGroup) : gs[0], ALL); renderAdvanced(parts, ALL);
  markGroup();
  fitSticky();
}
/* grąžos ir rizikos žemėlapis: savi laikotarpio, amžiaus grupių ir tiekėjų pasirinkimai; spalva – tiekėjas */
const RM = { per: null, groups: null, provs: null };
function renderRiskMap() {
  $('hRisk').innerHTML = T().hRisk + ik('riskmap');
  RM.per = P.period; RM.groups = new Set(DATA.groups.map(g => g.id)); RM.provs = new Set(DATA.providers.map(p => p.id));   // laikotarpis – bendras viršuje (vienas laikotarpio pasirinkimas puslapyje)
  $('rmTools').hidden = true;   // atskiri filtrai pašalinti – naudojamas bendras laikotarpis
  const el = $('riskMap'), oneGroup = RM.groups.size === 1;
  const pts = DATA.groups.filter(g => RM.groups.has(g.id)).flatMap(g => { const rng = rangeFor(g, false); return g.funds.filter(f => RM.provs.has(f.provider)).map(f => fundStats(f, rng)).filter(s => s && s.ret !== null && s.vol !== null).map(s => ({ g, f: s.f, x: s.vol, y: s.ret })); });
  setCap('riskMap', T().capRisk(periodText(), pts.length));
  renderRiskTable(pts);
  el.innerHTML = ''; el.hidden = true; $('c_riskMap').hidden = true;   // taškinė diagrama pašalinta (savininkas 2026-10-16) – lieka Sharpe lentelė
}

function renderRiskTable(pts) {
  const tb = $('rmTable');
  const groups = DATA.groups.filter(g => RM.groups.has(g.id) && pts.some(p => p.g === g));
  const provs = marketProvs().filter(p => RM.provs.has(p.id) && pts.some(x => x.f.provider === p.id));
  const g0 = groups[0] || DATA.groups[0], r0 = rangeFor(g0, false);
  $('rmNote').textContent = T().nRmT(num(rfNow(r0.anchor, r0.end), 2), P.rf === null && rfAvg(r0.anchor, r0.end) !== null);
  if (!groups.length) { tb.innerHTML = ''; return; }
  const sharpe = p => {
    const rr = rangeFor(p.g, false), s = seriesOf(p.f, rr.anchor, rr.end); if (!s || !p.x) return null;
    const days = p.f.d[s.ie] - p.f.d[s.ia]; if (days < 30) return null;
    return ((Math.pow(1 + p.y / 100, 365.25 / days) - 1) * 100 - rfNow(p.f.d[s.ia], p.f.d[s.ie])) / p.x;
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
function renderDrawdown() {
  $('hDd').innerHTML = T().hDd + ik('dd');
  RDD = runupDrawdown($('rddCard'), DATA.groups.map(g => ({ id: g.id, label: groupLabel(g), funds: g.funds })), 'p2', P.group !== 'all' ? P.group : DATA.groups[DATA.groups.length - 1].id);
}
function renderRanksByPeriod(gs, ALL, tid = 'tQP') {
  setCap(tid, T().capQP(ALL ? [...new Set(gs.map(g => iso(groupEnd(g).end)))].join(' / ') : iso(groupEnd(gs[0]).end), ALL ? iso(Math.min(...gs.map(g => rangeAt(g, 'max').anchor))) + '…' + iso(Math.max(...gs.map(g => rangeAt(g, 'max').anchor))) : iso(rangeAt(gs[0], 'max').anchor)));
  $(tid).innerHTML = `<thead><tr><th></th>${PERIOD_IDS.map(per => `<th>${T().periods[per]}</th>`).join('')}</tr></thead><tbody>`
    + gs.map(g => {
      const ranks = {}; PERIOD_IDS.forEach(per => { const rng = rangeAt(g, per); ranks[per] = rankOf(g.funds.map(f => ({ key: f.provider, v: retOf(g, f.provider, rng) }))); });
      return marketProvs().filter(p => g.funds.some(f => f.provider === p.id)).map((p, i) => `<tr${ALL && i === 0 ? ' class="gstart"' : ''}><td class="name"><span class="sw" style="background:${colorOf(p.id)}"></span>${p.label}${ALL ? ` <span class="na">${groupLabel(g)}</span>` : ''}</td>${PERIOD_IDS.map(per => { const r = ranks[per], k = r.map.get(p.id); return k && r.n >= 2 ? `<td class="${rkClass(k, r.n)}" title="${k}/${r.n}">${k}</td>` : '<td class="na">–</td>'; }).join('')}</tr>`).join('');
    }).join('') + '</tbody>';
}
/* ---------- „Metai ir mėnesiai“: kalendoriniai metai, mėnesiai, slenkanti grąža, vieno fondo mėnesiai (viena kortelė) ----------
   Mėnesio grąža = mėnesio paskutinės vieneto vertės ÷ ankstesnio mėnesio paskutinės − 1 – tas pats skaičiavimas kaip „Ataskaitose“. */
addStrings({ ymH: 'Years and months', ymTabs: { cal: 'Calendar years', mon: 'Months', roll: 'Rolling', hm: 'One fund – all months' }, monH: 'Monthly returns', monY: 'Year', thYear: 'Year',
  capMon: (y, e) => `${y}: return of each month = last unit value of the month ÷ last unit value of the previous month − 1 (same calculation as in Reports)${e ? `; the last month runs to ${e}` : ''}. Bold – best in the column.` },
  { ymH: 'Metai ir mėnesiai', ymTabs: { cal: 'Kalendoriniai metai', mon: 'Mėnesiai', roll: 'Slenkanti grąža', hm: 'Vienas fondas – visi mėnesiai' }, monH: 'Mėnesių grąža', monY: 'Metai', thYear: 'Metai',
  capMon: (y, e) => `${y} m.: kiekvieno mėnesio grąža = mėnesio paskutinė vieneto vertė ÷ ankstesnio mėnesio paskutinė vertė − 1 (tas pats skaičiavimas kaip „Ataskaitose“)${e ? `; paskutinis mėnuo – iki ${e}` : ''}. Paryškinta – geriausia stulpelyje.` });
const YM_KEYS = ['cal', 'mon', 'roll', 'hm'];
let YM = 'cal'; try { const v = localStorage.getItem('ymTab'); if (YM_KEYS.includes(v)) YM = v; } catch (e) {}
function renderYM() {
  $('hYM').textContent = T().ymH;
  const tabs = $('ymTabs');
  tabs.innerHTML = YM_KEYS.map(k => `<button type="button" data-k="${k}" aria-pressed="${k === YM}">${T().ymTabs[k]}</button>`).join('');
  tabs.onclick = e => { const b = e.target.closest('button'); if (!b) return; YM = b.dataset.k; try { localStorage.setItem('ymTab', YM); } catch (er) {} renderYM(); };
  document.querySelectorAll('[data-ym]').forEach(d => { d.hidden = d.dataset.ym !== YM; });
}
let MON_Y = null;
function renderMonthsTable(parts, ALL, nm, tr) {
  const endAll = Math.max(...parts.map(pt => groupEnd(pt.g).end)), lastY = new Date(endAll * DAY).getUTCFullYear();
  const firstY = Math.max(2005, Math.min(...parts.flatMap(pt => pt.all.map(s => new Date(s.f.d[0] * DAY).getUTCFullYear()))));
  if (!MON_Y || MON_Y > lastY || MON_Y < firstY) MON_Y = lastY;
  const sel = $('monYear'); sel.innerHTML = Array.from({ length: lastY - firstY + 1 }, (_, i) => lastY - i).map(y => `<option value="${y}"${y === MON_Y ? ' selected' : ''}>${y}</option>`).join('');
  sel.onchange = () => { MON_Y = +sel.value; renderMonthsTable(parts, ALL, nm, tr); };
  $('hMon').textContent = T().monH;
  const Y = MON_Y, lastM = Y === lastY ? new Date(endAll * DAY).getUTCMonth() : 11, ms = Array.from({ length: 12 }, (_, m) => m);
  setCap('tMon', T().capMon(Y, Y === lastY ? iso(endAll) : ''));
  const heat = v => v == null ? '' : ` style="background:${heatColor(v * 1.2)}"`;
  $('tMon').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${ms.map(m => `<th>${T().monShort[m]}</th>`).join('')}<th>${Y === lastY ? T().ytd : T().thYear}</th></tr></thead><tbody>`
    + parts.map(pt => {
      const end = groupEnd(pt.g).end;
      const rows = pt.all.map(s => { const mr = monthlyReturns(s.f, end)[Y] || {}, c = calendarReturns(s.f, end)[Y]; return { s, mr, y: c && !c.partial ? c.ret : null }; });
      const best = m => { const vs = rows.map(r => r.mr[m]).filter(v => v != null); return vs.length ? Math.max(...vs) : null; };
      const by = (() => { const vs = rows.map(r => r.y).filter(v => v != null); return vs.length ? Math.max(...vs) : null; })();
      return rows.map((r, i) => tr(i === 0, `${nm(r.s)}${ms.map(m => m > lastM ? '<td class="na"></td>' : r.mr[m] == null ? '<td class="na">–</td>' : `<td class="${r.mr[m] === best(m) ? 'best' : ''}"${heat(r.mr[m])}>${pct(r.mr[m], 1)}</td>`).join('')}${r.y == null ? '<td class="na">–</td>' : `<td class="${r.y === by ? 'best' : ''}"><b>${pct(r.y, 1)}</b></td>`}`)).join('');
    }).join('') + '</tbody>';
}
function heatColor(v) {
  const t = Math.min(1, Math.abs(v) / 6);
  return v >= 0 ? `hsl(142,26%,${93 - 44 * t}%)` : `hsl(15,50%,${92 - 35 * t}%)`;   // šalavijo žalia / molio raudona (auditas #39)
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
/* Nerizikinga norma Sharpe koeficientui: vidutinė €STR tarp dienų a ir b (DATA.rfm – mėnesių vidurkiai, svertiniai pagal
   kalendorines dienas); jei istorija dengia < pusę laikotarpio – paskutinė €STR; jei ir jos nėra – 2 % */
function rfAvg(a, b) {
  const H = DATA.rfm; if (!H || !H.v || !(b > a)) return null;
  const [y0, m0] = H.start.split('-').map(Number), da = new Date(a * DAY);
  let y = da.getUTCFullYear(), m = da.getUTCMonth(), s = 0, n = 0;
  for (let k = 0; k < 1000; k++) {
    const ms = Date.UTC(y, m, 1) / DAY, me = Date.UTC(y, m + 1, 1) / DAY; if (ms >= b) break;
    const ov = Math.min(b, me) - Math.max(a, ms), v = H.v[(y - y0) * 12 + m - (m0 - 1)];
    if (ov > 0 && v !== null && v !== undefined) { s += v * ov; n += ov; }
    m++; if (m > 11) { m = 0; y++; }
  }
  return n >= (b - a) / 2 ? s / n : null;
}
const rfAuto = (a, b) => rfAvg(a, b) ?? (DATA.rf ? DATA.rf.value : 2);
const rfNow = (a, b) => P.rf ?? rfAuto(a, b);
function renderAdvanced(parts, ALL) {
  $('btnAdv').setAttribute('aria-pressed', P.adv); $('adv').hidden = !P.adv;
  const rngs = parts.map(x => x.rng), a0 = Math.min(...rngs.map(r => r.anchor)), a1 = Math.max(...rngs.map(r => r.anchor));
  const rfShow = rngs.length ? rfNow(a0, Math.max(...rngs.map(r => r.end))) : rfNow();
  if (document.activeElement !== $('rf')) $('rf').value = Math.round(rfShow * 100) / 100;
  $('rfAuto').hidden = P.rf === null; $('rfAuto').textContent = T().rfAutoBtn; $('rfInfo').innerHTML = ik('rf');
  $('rf').title = P.rf === null ? T().rfAvg : '';
  if (!P.adv) return;
  setCap('tAdv', T().capAdv(a0 === a1 ? iso(a0) : `${iso(a0)}…${iso(a1)}`, iso(Math.max(...rngs.map(r => r.end)))));
  $('lblRf').textContent = T().rf; $('nAdv').textContent = T().nAdv;
  const rows = parts.flatMap(pt => pt.all.map((s, i) => ({ s, first: i === 0, a: advStats(s.f, pt.rng, P.rf) }))).filter(x => x.a);
  /* papildomi rodikliai (savininkas 2026-10-16 – nauji palyginimo rodikliai kaip papildomas vaizdas): grąža prieš valdymo mokestį ir grąža / didž. kritimas */
  rows.forEach(({ s, a }) => { const fee = typeof FEES !== 'undefined' && s.g ? FEES[`${s.f.provider}|${s.g.id}`] : null; a.fee = fee ?? null; a.gross = a.ann != null && fee != null ? a.ann + fee : null; a.calmar = a.ann != null && s.mdd ? a.ann / Math.abs(s.mdd) : null; });
  /* supaprastinta (savininkas 2026-10-16): 6 rodikliai, datos – užvedus pelę; geriausia reikšmė grupėje paryškinta */
  const L = lang === 'lt', mo = x => x ? iso(x.d).slice(0, 7) : '';
  const cols = [
    { h: T().thAnn, v: a => a.ann, f: v => fmtP(v, 1), hi: true },
    { h: T().thVol, v: a => a.vol, f: v => num(v, 1) + pctSfx(), hi: false, ik: 'vol' },
    { h: T().thSharpe, v: a => a.sharpe, f: v => num(v, 2), hi: true, ik: 'sharpe' },
    { h: T().thWorstM, v: a => a.worstM && a.worstM.v, f: v => fmtP(v, 1), hi: true, t: a => mo(a.worstM) },
    { h: T().thBestM, v: a => a.bestM && a.bestM.v, f: v => fmtP(v, 1), hi: true, t: a => mo(a.bestM) },
    { h: T().thPosM, v: a => a.posM, f: v => num(v, 0) + pctSfx(), hi: true, ik: 'posm' },
    { h: L ? 'Metinė grąža prieš mokestį' : 'Annualised return before fee', v: a => a.gross, f: v => fmtP(v, 1), hi: true, ik: 'gross' },
    { h: L ? 'Grąža / didž. kritimas' : 'Return / max fall', v: a => a.calmar, f: v => num(v, 2), hi: true, ik: 'calmar' },
  ];
  const best = new Map();                       // grupė → stulpelis → geriausia reikšmė
  parts.forEach(pt => { const rs = rows.filter(r => pt.all.includes(r.s)); best.set(pt, cols.map(c => { const vs = rs.map(r => c.v(r.a)).filter(v => v != null && isFinite(v)); return vs.length ? (c.hi ? Math.max(...vs) : Math.min(...vs)) : null; })); });
  const partOf = s => parts.find(pt => pt.all.includes(s));
  $('tAdv').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${cols.map(c => c.ik ? th(c.h, c.ik) : `<th>${c.h}</th>`).join('')}</tr></thead><tbody>`
    + rows.map(({ s, a, first }) => { const bv = best.get(partOf(s));
      return `<tr${ALL && first ? ' class="gstart"' : ''}><td class="name"><span class="sw" style="background:${colorOf(s.f.provider)}"></span>${labelOf(s.f.provider)}${ALL ? ` <span class="na">${groupLabel(s.g)}</span>` : ''}</td>`
        + cols.map((c, i) => { const v = c.v(a); if (v == null || !isFinite(v)) return '<td class="na">–</td>'; const tt = c.t ? c.t(a) : '';
          return `<td${bv && bv[i] === v && rows.length > 1 ? ' class="best"' : ''}${tt ? ` title="${tt}"` : ''}>${c.f(v)}</td>`; }).join('') + '</tr>'; }).join('') + '</tbody>';
  const src = DATA.rf && DATA.rf.source;
  if (src && !$('rfSrc')) $('rfInfo').insertAdjacentHTML('afterend', ` <a id="rfSrc" href="${src}" target="_blank" rel="noopener" style="font-size:13px"></a>`);
  if ($('rfSrc')) $('rfSrc').textContent = L ? '€STR šaltinis – Europos centrinis bankas ↗' : '€STR source – European Central Bank ↗';
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
    const sheets = [['Summary', 'tSum'], ['Return', 'tRet'], ['Relative to peers', 'tRelM'], ['Rank', 'tRank'], ['Annualized', 'tAnnM'], ['Overall ranking', 'tOv'], ['Metrics', 'tMetrics'], ['Calendar years', 'tCal'], ['Rolling', 'tRoll'], ['Rank by period', 'tQP'], ['Monthly heat map', 'tHm']];
    if (P.adv) sheets.push(['Advanced', 'tAdv']);
    sheets.forEach(([name, id]) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tableToAoa(id)), name));
    XLSX.writeFile(wb, `pension-funds-${iso(Math.max(...DATA.groups.map(x => groupEnd(x).end)))}.xlsx`);
  } catch (e) { alert(T().xlsxFail); }
  btn.disabled = false; btn.textContent = T().xlsx;
}
/* „Visa rinka“ Excel su tikromis formulėmis (auditas #53): pradiniai duomenys → skaičiavimai → 4 lentelės → metodika.
   Kiekvieną skaičių galima patikrinti: vertės ir datos – iš valdytojų, visa kita – Excel formulės. */
const xlCol = n => { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; };
const xlDate = d => ({ t: 'n', v: d + 25569, z: 'yyyy-mm-dd' });
const xlF = (f, v, z) => ({ t: 'n', f, v: v == null || !isFinite(v) ? 0 : v, z });
function marketBook() {
  const L = lang === 'lt', provs = marketProvs(), ref = provs.some(p => p.id === P.mref) ? P.mref : '';
  const peers = provs.filter(p => p.id !== ref), groups = DATA.groups;
  const S = L ? { calc: 'Skaičiavimai', vals: 'Vertės', ret: 'Grąža', rel: 'Palyginimas', rank: 'Vieta', ann: 'Metinė grąža', meth: 'Metodika ir šaltiniai', avg: 'Vidurkis', med: 'Konkurentų mediana', pavg: 'Konkurentų vidurkis' }
    : { calc: 'Calculations', vals: 'Values', ret: 'Return', rel: 'Relative', rank: 'Rank', ann: 'Annualized', meth: 'Methodology and sources', avg: 'Average', med: 'Peer median', pavg: 'Peer average' };
  const q = s => `'${s}'`;
  /* 1. Skaičiavimai: viena eilutė fondui */
  const hdr = L ? ['Grupė', 'Valdytojas', 'Fondas', 'Laikotarpio pradžia', 'Laikotarpio pabaiga', 'Pradžios vertės data', 'Pradžios vieneto vertė, €', 'Pabaigos vertės data', 'Pabaigos vieneto vertė, €', 'Grąža', 'Dienos', 'Metinė grąža']
    : ['Group', 'Manager', 'Fund', 'Period start', 'Period end', 'Start value date', 'Start unit value, €', 'End value date', 'End unit value, €', 'Return', 'Days', 'Annualized return'];
  if (REAL) hdr.push(L ? 'VKI pradžioje' : 'CPI at start', L ? 'VKI pabaigoje' : 'CPI at end');
  const step = L ? ['', '', '', 'Pasirinkto laikotarpio pradžia', 'Bendra paskutinė grupės diena', 'Paskutinė fondo vertė pradžios dieną ar prieš ją', '= vertė iš lapo „Vertės“ tą dieną', 'Paskutinė fondo vertė iki pabaigos', '= vertė iš lapo „Vertės“ tą dieną', '= pabaigos vertė ÷ pradžios vertė − 1', '= pabaiga − pradžia', '= (1 + grąža) ^ (365,25 ÷ dienos) − 1']
    : ['', '', '', 'Selected period start', 'Latest common day in the group', 'Fund’s last value on or before the start', '= value from sheet “Values” on that day', 'Fund’s last value up to the end', '= value from sheet “Values” on that day', '= end value ÷ start value − 1', '= end − start', '= (1 + return) ^ (365.25 ÷ days) − 1'];
  const calc = [hdr, step.map(x => x ? { v: x, s: 'step' } : null)], at = {}, used = [];
  groups.forEach(g => {
    const rng = g.rngM || rangeFor(g);
    provs.forEach(p => {
      const f = g.funds.find(x => x.provider === p.id), v = retOf(g, p.id, rng);
      if (!f || v === null) return;
      const s = seriesOf(f, rng.anchor, rng.end), r = calc.length + 1, d0 = Math.max(rng.anchor, f.d[0]), days = rng.end - d0;
      const vc = xlCol(used.length + 1), V = q(S.vals), look = (dc, val) => ({ t: 'n', f: `INDEX(${V}!${vc}:${vc},MATCH(${dc}${r},${V}!$A:$A,0))`, v: val, z: '0.0000' });
      const row = [groupLabel(g), p.label, f.name, xlDate(d0), xlDate(rng.end), xlDate(f.d[s.ia]), look('F', f.v[s.ia]), xlDate(f.d[s.ie]), look('H', f.v[s.ie])];
      const nom = f.v[s.ie] / f.v[s.ia] - 1;
      row.push(REAL ? xlF(`(I${r}/G${r})/(N${r}/M${r})-1`, v / 100, '0.00%') : xlF(`I${r}/G${r}-1`, nom, '0.00%'));
      row.push(xlF(`E${r}-D${r}`, days, '0'));
      row.push(xlF(`(1+J${r})^(365.25/K${r})-1`, Math.pow(1 + v / 100, 365.25 / days) - 1, '0.00%'));
      if (REAL) row.push(cpiAt(rng.anchor), cpiAt(f.d[s.ie]));
      calc.push(row); at[g.id + '|' + p.id] = r; used.push({ g, p, f, rng });
    });
  });
  /* 2. Vertės: pradiniai dienos duomenys (tik naudojami fondai, nuo laikotarpio pradžios) */
  const d0 = Math.min(...used.map(u => { const i = lastOnOrBefore(u.f, u.rng.anchor); return i >= 0 ? u.f.d[i] : u.f.d[0]; })), d1 = Math.max(...used.map(u => u.rng.end));
  const days = [...new Set(used.flatMap(u => u.f.d.filter(d => d >= d0 && d <= d1)))].sort((a, b) => a - b);
  const vals = [[L ? 'Data' : 'Date', ...used.map(u => `${groupLabel(u.g)} · ${u.p.label}`)]];
  const maps = used.map(u => new Map(u.f.d.map((d, i) => [d, u.f.v[i]])));
  days.forEach(d => vals.push([xlDate(d), ...maps.map(m => m.has(d) ? m.get(d) : null)]));
  /* 3. Lentelės: eilutės – grupės, stulpeliai – valdytojai */
  const C = q(S.calc), n = groups.length, last = n + 1, colOf = i => xlCol(i + 1);
  const cell = (g, p, c) => at[g.id + '|' + p.id] ? `${C}!${c}${at[g.id + '|' + p.id]}` : null;
  const valOf = (g, p, c) => { const r = at[g.id + '|' + p.id]; return r ? calc[r - 1][c === 'J' ? 9 : 11].v : null; };
  const grid = (c, extra) => {
    const t = [[L ? 'Grupė' : 'Group', ...provs.map(p => p.label), ...(extra ? [extra] : [])]];
    groups.forEach(g => t.push([groupLabel(g), ...provs.map(p => { const ref_ = cell(g, p, c); return ref_ ? xlF(ref_, valOf(g, p, c), '0.00%') : null; })]));
    t.push([S.avg, ...provs.map((p, i) => xlF(`AVERAGE(${colOf(i)}2:${colOf(i)}${last})`, meanOf(groups.map(g => valOf(g, p, c))), '0.00%'))]);
    return t;
  };
  const ret = grid('J', S.med), ann = grid('L');
  const peerCols = peers.map(p => colOf(provs.indexOf(p)));
  groups.forEach((g, k) => { const r = k + 2; const m = medianOf(peers.map(p => valOf(g, p, 'J'))); ret[r - 1].push(m == null ? null : xlF(`MEDIAN(${peerCols.map(c => c + r).join(',')})`, m, '0.00%')); });
  ret[n + 1].push(xlF(`AVERAGE(${colOf(provs.length)}2:${colOf(provs.length)}${last})`, meanOf(groups.map(g => medianOf(peers.map(p => valOf(g, p, 'J'))))), '0.00%'));
  const R = q(S.ret), rel = [], rank = [[L ? 'Grupė' : 'Group', ...provs.map(p => p.label)]];
  if (ref) {
    const rc = colOf(provs.findIndex(p => p.id === ref));
    rel.push([L ? `Grupė (${labelOf(ref)} minus)` : `Group (${labelOf(ref)} minus)`, ...peers.map(p => p.label), S.pavg]);
    groups.forEach((g, k) => { const r = k + 2, rv = valOf(g, provs.find(p => p.id === ref), 'J');
      rel.push([groupLabel(g), ...peers.map(p => { const v = valOf(g, p, 'J'); return v == null || rv == null ? null : xlF(`${R}!${rc}${r}-${R}!${colOf(provs.indexOf(p))}${r}`, rv - v, '0.00%'); }),
        rv == null ? null : xlF(`${R}!${rc}${r}-AVERAGE(${peerCols.map(c => `${R}!${c}${r}`).join(',')})`, rv - meanOf(peers.map(p => valOf(g, p, 'J'))), '0.00%')]); });
  } else {
    rel.push([L ? 'Grupė (valdytojas minus kitų mediana)' : 'Group (manager minus median of the others)', ...provs.map(p => p.label)]);
    groups.forEach((g, k) => { const r = k + 2;
      rel.push([groupLabel(g), ...provs.map((p, i) => { const v = valOf(g, p, 'J'), oth = provs.filter(o => o !== p); if (v == null) return null;
        return xlF(`${R}!${colOf(i)}${r}-MEDIAN(${oth.map(o => `${R}!${colOf(provs.indexOf(o))}${r}`).join(',')})`, v - medianOf(oth.map(o => valOf(g, o, 'J'))), '0.00%'); })]); });
  }
  const rl = rel[0].length - 1;
  rel.push([S.avg, ...Array.from({ length: rl }, (_, i) => xlF(`AVERAGE(${colOf(i)}2:${colOf(i)}${last})`, meanOf(rel.slice(1).map(x => x[i + 1] ? x[i + 1].v : null)), '0.00%'))]);
  groups.forEach((g, k) => { const r = k + 2;
    rank.push([groupLabel(g), ...provs.map((p, i) => valOf(g, p, 'J') == null ? null : xlF(`RANK(${R}!${colOf(i)}${r},${R}!$B${r}:$${colOf(provs.length - 1)}${r},0)`, rankOf(provs.map(o => ({ key: o.id, v: valOf(g, o, 'J') }))).map.get(p.id), '0')) ]); });
  rank.push([S.avg, ...provs.map((p, i) => xlF(`AVERAGE(${colOf(i)}2:${colOf(i)}${last})`, meanOf(rank.slice(1).map(x => x[i + 1] ? x[i + 1].v : null)), '0.0'))]);
  /* 4. Metodika */
  const meth = L ? [['Metodika ir šaltiniai'], [], ['Laikotarpis', periodText() + (P.gx ? ' · nuo Goindex pradžios' : '')], ['Duomenys iki', iso(LATEST)], ['Atsisiųsta', DATA.generated],
    ['Šaltinis', 'Valdytojų skelbiamos vieneto vertės (lapas „Vertės“) – patikrinamos valdytojų svetainėse.'], [],
    ['Grąža', 'Pabaigos vieneto vertė ÷ pradžios vieneto vertė − 1 (lapas „Skaičiavimai“, stulpelis J). Pradžios vertė – paskutinė vertė laikotarpio pradžios dieną arba prieš ją.' + (REAL ? ' Reali grąža: dar padalinta iš VKI pokyčio (M, N stulpeliai).' : '')],
    ['Metinė grąža', '(1 + grąža) ^ (365,25 ÷ dienos) − 1; dienos = laikotarpio pabaiga − pradžia (stulpeliai K, L).'],
    ['Mokesčiai', 'Vieneto vertės jau po valdymo mokesčio – mokesčiai antrą kartą neatimami.'],
    ['Palyginimas', ref ? `${labelOf(ref)} grąža minus kiekvieno konkurento grąža; paskutinis stulpelis – minus konkurentų vidurkis.` : 'Kiekvieno valdytojo grąža minus kitų valdytojų medianos toje grupėje (MEDIAN).'],
    ['Vieta', 'RANK: 1 – didžiausia grąža grupėje.'], ['Vidurkis', 'Paprastas grupių vidurkis (AVERAGE), tušti langeliai neskaičiuojami.'],
    ['Pastaba', 'Fondas be naujų duomenų (> 5 d. atsilikęs) arba neturintis vertės laikotarpio pradžioje – paliekamas tuščias. 2003–2009 fondai, pradėti ≤ 7 d. po laikotarpio pradžios už 1,00 €, skaičiuojami nuo pirmos vertės.']]
    : [['Methodology and sources'], [], ['Period', periodText() + (P.gx ? ' · since Goindex start' : '')], ['Data until', iso(LATEST)], ['Downloaded', DATA.generated],
    ['Source', 'Unit values published by the managers (sheet “Values”) – can be checked on the managers’ websites.'], [],
    ['Return', 'End unit value ÷ start unit value − 1 (sheet “Calculations”, column J). Start value – the last value on or before the period start.' + (REAL ? ' Real return: also divided by the CPI change (columns M, N).' : '')],
    ['Annualized', '(1 + return) ^ (365.25 ÷ days) − 1; days = period end − start (columns K, L).'],
    ['Fees', 'Unit values are net of the management fee – fees are not deducted again.'],
    ['Relative', ref ? `${labelOf(ref)} return minus each peer’s return; last column – minus the peer average.` : 'Each manager’s return minus the median of the other managers in the group (MEDIAN).'],
    ['Rank', 'RANK: 1 – highest return in the group.'], ['Average', 'Simple average of groups (AVERAGE); empty cells are ignored.'],
    ['Note', 'A fund without new data (> 5 days behind) or without a value at the period start is left empty. 2003–2009 funds that started ≤ 7 days after the period start at €1.00 run from the first value.']];
  const wb = XLSX.utils.book_new(), add = (rows, name, w) => { const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = w; XLSX.utils.book_append_sheet(wb, ws, name); };
  const wg = [{ wch: 22 }, ...provs.map(() => ({ wch: 11 })), { wch: 18 }];
  meth.splice(1, 0, [L ? 'Kaip patikrinti' : 'How to check', L ? 'Lapas „Vertės“ – valdytojų paskelbtos vieneto vertės (mėlynos). Lapas „Skaičiavimai“ – kiekvienam fondui pradžios ir pabaigos vertė paimama iš „Vertės“ (INDEX/MATCH pagal datą), iš jų – grąža ir metinė grąža. Lentelių lapai – nuorodos į „Skaičiavimai“ ir MEDIAN, RANK, AVERAGE.' : 'Sheet “Values” – unit values published by the managers (blue). Sheet “Calculations” – each fund’s start and end value is taken from “Values” (INDEX/MATCH by date), then return and annualized return. Table sheets – links to “Calculations” plus MEDIAN, RANK, AVERAGE.']);
  add(meth, S.meth, [{ wch: 16 }, { wch: 110 }]);
  add(ret, S.ret, wg); add(rel, S.rel, [{ wch: 30 }, ...Array(rl).fill({ wch: 11 })]); add(rank, S.rank, wg); add(ann, S.ann, wg);
  add(calc, S.calc, [{ wch: 22 }, { wch: 10 }, { wch: 40 }, ...Array(hdr.length - 3).fill({ wch: 13 })]);
  add(vals, S.vals, [{ wch: 11 }, ...used.map(() => ({ wch: 14 }))]);
  return wb;
}
/* Laikotarpio grąža stulpeliais (auditas #60): kiekvienas fondas ir pasirinkti indeksai, surikiuota, su reikšmėmis; tik vienai grupei */
function renderBars(parts) {
  const card = $('barCard'); if (!card) return;
  card.hidden = parts.length !== 1; if (card.hidden) return;
  const pt = parts[0], rows = pt.all.filter(s => s.ret !== null).map(s => ({ l: labelOf(s.f.provider), c: colorOf(s.f.provider), v: s.ret }))
    .concat(idxOf(pt).map(f => ({ l: f.label, c: f.color, v: idxStats(f, pt.rng, grpStart(pt.g)).ret, idx: true })).filter(x => x.v !== null && x.v !== undefined))
    .sort((a, b) => b.v - a.v);
  $('hBar').textContent = `${T().hBar} · ${groupName(P.group)}`; $('mBar').textContent = `${periodText()}: ${iso(pt.rng.anchor)} → ${iso(pt.rng.end)}`;
  const box = $('barChart'), W = box.clientWidth || 800, rh = 26, lw = Math.min(260, Math.max(110, W * 0.28)), vw = 70, H = rows.length * rh + 8;
  const lo = Math.min(0, ...rows.map(r => r.v)), hi = Math.max(0, ...rows.map(r => r.v)), span = (hi - lo) || 1;
  const X = v => lw + (v - lo) / span * (W - lw - vw - 8), esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  box.querySelectorAll('svg').forEach(n => n.remove());
  box._legend = [];
  box.insertAdjacentHTML('afterbegin', `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(T().hBar)}">`
    + rows.map((r, i) => { const y = 4 + i * rh, x0 = X(Math.min(0, r.v)), w = Math.max(1, Math.abs(X(r.v) - X(0)));
      return `<text x="${lw - 8}" y="${y + rh / 2 + 4}" text-anchor="end" font-size="13" fill="var(--text)">${esc(r.l)}</text>`
        + `<rect x="${x0}" y="${y + 4}" width="${w}" height="${rh - 8}" rx="3" fill="${r.c}"${r.idx ? ' fill-opacity="0.45"' : ''}/>`
        + `<text x="${r.v >= 0 ? X(r.v) + 6 : X(0) + 6}" y="${y + rh / 2 + 4}" font-size="12" fill="var(--text-2)" style="font-variant-numeric:tabular-nums">${pct(r.v)}</text>`; }).join('')
    + `<line x1="${X(0)}" x2="${X(0)}" y1="0" y2="${H}" stroke="var(--axis)" stroke-width="1"/></svg>`);
}
/* Rodiklių lentelės Excel su formulėmis: kiekvienam fondui dienų vertės (laikotarpio ir visos istorijos), dienos grąža, aukščiausia vertė, kritimas;
   lentelė „Rodikliai“ – formulės, rodančios į tas dienas. Dienos – tos pačios kaip svetainėje (be „vienišų“ dienų). */
function metricsBook() {
  const L = lang === 'lt', parts = lastParts, wb = XLSX.utils.book_new();
  const S = L ? { met: 'Rodikliai', per: 'Laikotarpio dienos', all: 'Visa istorija', meth: 'Metodika ir šaltiniai' } : { met: 'Metrics', per: 'Period days', all: 'Full history', meth: 'Methodology and sources' };
  const blockHdr = L ? ['Data', 'Vieneto vertė, €', 'Dienos grąža', 'Aukščiausia iki šiol', 'Kritimas nuo aukščiausios'] : ['Date', 'Unit value, €', 'Daily return', 'Peak so far', 'Drawdown from peak'];
  const sheets = { per: [[], []], all: [[], []] };
  const block = (key, k, label, f, idx) => {          // fondo blokas: 5 stulpeliai + tarpas; grąžina {c: stulpelių raidės, r0, r1}
    const sh = sheets[key], b = k * 6, cs = [0, 1, 2, 3, 4].map(i => xlCol(b + i));
    sh[0][b] = label; blockHdr.forEach((h, i) => { sh[1][b + i] = h; });
    let peak = -Infinity;
    idx.forEach((i, j) => {
      const r = j + 3, row = sh[r - 1] = sh[r - 1] || [];
      peak = Math.max(peak, f.v[i]);
      row[b] = xlDate(f.d[i]); row[b + 1] = f.v[i];
      if (j) { const x = f.v[i] / f.v[idx[j - 1]] - 1; row[b + 2] = { t: x === 0 ? 's' : 'n', f: `IF(${cs[1]}${r}=${cs[1]}${r - 1},"",${cs[1]}${r}/${cs[1]}${r - 1}-1)`, v: x === 0 ? '' : x, z: '0.0000%' }; }
      row[b + 3] = j ? xlF(`MAX(${cs[3]}${r - 1},${cs[1]}${r})`, peak, '0.0000') : xlF(`${cs[1]}${r}`, peak, '0.0000');
      row[b + 4] = xlF(`${cs[1]}${r}/${cs[3]}${r}-1`, f.v[i] / peak - 1, '0.00%');
    });
    return { c: cs, r0: 3, r1: idx.length + 2 };
  };
  const hdr = L ? ['Grupė', 'Valdytojas', 'Fondas', 'Laikotarpio pradžia', 'Laikotarpio pabaiga', 'Laikotarpio grąža', 'Svyravimas (metinis)', 'Didžiausias kritimas', 'Fondo pradžia', 'Metinė grąža nuo pradžios', 'Svyravimas nuo pradžios', 'Didžiausias kritimas nuo pradžios']
    : ['Group', 'Manager', 'Fund', 'Period start', 'Period end', 'Period return', 'Volatility (annual)', 'Max drawdown', 'Fund start', 'Annual return since start', 'Volatility since start', 'Max drawdown since start'];
  if (REAL) hdr.push(L ? 'VKI pradžioje' : 'CPI at start', L ? 'VKI pabaigoje' : 'CPI at end');
  const met = [hdr], P1 = `'${S.per}'`, PA = `'${S.all}'`, pc = v => v == null ? null : v / 100;
  let k = 0;
  parts.forEach(pt => pt.all.forEach(s => {
    const f = s.f, sr = seriesOf(f, pt.rng.anchor, pt.rng.end), ieAll = lastOnOrBefore(f, pt.rng.end), r = met.length + 1, label = `${groupLabel(pt.g)} · ${labelOf(f.provider)}`;
    const row = [groupLabel(pt.g), labelOf(f.provider), f.name, xlDate(pt.rng.anchor), xlDate(pt.rng.end)];
    if (sr) {
      const bp = block('per', k, label, f, statIdx(f, sr.ia, sr.ie)), [cd, cv, cr, , cdd] = bp.c;
      row.push(REAL ? xlF(`(${P1}!${cv}${bp.r1}/${P1}!${cv}${bp.r0})/(N${r}/M${r})-1`, pc(s.ret), '0.00%') : xlF(`${P1}!${cv}${bp.r1}/${P1}!${cv}${bp.r0}-1`, pc(s.ret), '0.00%'));
      row.push(s.vol == null ? null : xlF(`STDEV(${P1}!${cr}${bp.r0 + 1}:${cr}${bp.r1})*SQRT(252)`, pc(s.vol), '0.00%'));
      row.push(xlF(`MIN(${P1}!${cdd}${bp.r0}:${cdd}${bp.r1})`, pc(s.mdd), '0.00%'));
    } else row.push(null, null, null);
    row.push(xlDate(f.d[0]));
    if (ieAll > 0) {
      const ba = block('all', k, label, f, statIdx(f, 0, ieAll)), [cd, cv, cr, , cdd] = ba.c;
      row.push(s.cagr == null ? null : xlF(`(${PA}!${cv}${ba.r1}/${PA}!${cv}${ba.r0})^(365.25/(${PA}!${cd}${ba.r1}-${PA}!${cd}${ba.r0}))-1`, pc(s.cagr), '0.00%'));
      row.push(s.volAll == null ? null : xlF(`STDEV(${PA}!${cr}${ba.r0 + 1}:${cr}${ba.r1})*SQRT(252)`, pc(s.volAll), '0.00%'));
      row.push(xlF(`MIN(${PA}!${cdd}${ba.r0}:${cdd}${ba.r1})`, pc(s.mddAll), '0.00%'));
    } else row.push(null, null, null);
    if (REAL) row.push(cpiAt(pt.rng.anchor), sr ? cpiAt(f.d[sr.ie]) : null);
    met.push(row); k++;
  }));
  const meth = L ? [['Metodika ir šaltiniai'], [], ['Laikotarpis', periodText()], ['Grupė', groupName(P.group)], ['Atsisiųsta', DATA.generated],
    ['Šaltinis', 'Valdytojų skelbiamos vieneto vertės (lapai „Laikotarpio dienos“ ir „Visa istorija“).'], [],
    ['Laikotarpio grąža', 'Paskutinė vertė ÷ pirmoji vertė − 1. Vertės jau po valdymo mokesčio.' + (REAL ? ' Reali: dar padalinta iš VKI pokyčio (M, N).' : '')],
    ['Svyravimas', 'Dienos grąžų imties standartinis nuokrypis (STDEV) × √252; dienos be vertės pokyčio neskaičiuojamos (tuščias langelis); jei pokyčių < 20 – nerodoma.'],
    ['Didžiausias kritimas', 'Mažiausia reikšmė stulpelyje „Kritimas nuo aukščiausios“ = vertė ÷ aukščiausia vertė iki tos dienos − 1.'],
    ['Metinė grąža nuo pradžios', '(paskutinė ÷ pirmoji vertė) ^ (365,25 ÷ dienos) − 1; rodoma, kai istorija ≥ 365 d.'],
    ['Dienos', 'Neįtrauktos dienos, kai vertę paskelbė tik vienas valdytojas (kaip svetainėje). Indeksų eilutės į šį failą neįtrauktos.']]
    : [['Methodology and sources'], [], ['Period', periodText()], ['Group', groupName(P.group)], ['Downloaded', DATA.generated],
    ['Source', 'Unit values published by the managers (sheets “Period days” and “Full history”).'], [],
    ['Period return', 'Last value ÷ first value − 1. Values are already net of the management fee.' + (REAL ? ' Real: also divided by the CPI change (M, N).' : '')],
    ['Volatility', 'Sample standard deviation of daily returns (STDEV) × √252; days without a value change are left empty; not shown with < 20 changes.'],
    ['Max drawdown', 'Lowest value in “Drawdown from peak” = value ÷ highest value so far − 1.'],
    ['Annual return since start', '(last ÷ first value) ^ (365.25 ÷ days) − 1; shown when the history is ≥ 365 days.'],
    ['Days', 'Days when only one manager published a value are excluded (as on the site). Index rows are not included in this file.']];
  // Kalendorinių metų grąža (auditas #53): lapas su metų pradžios ir pabaigos vertėmis + matrica su nuorodomis į jį
  const YS = L ? 'Metų vertės' : 'Year values', YC = L ? 'Kalendoriniai metai' : 'Calendar years', YQ = `'${YS}'`;
  const yv = [L ? ['Grupė', 'Valdytojas', 'Metai', 'Pradžios data', 'Pradžios vertė', 'Pabaigos data', 'Pabaigos vertė', 'Grąža', 'Dalis metų'] : ['Group', 'Manager', 'Year', 'Start date', 'Start value', 'End date', 'End value', 'Return', 'Part of year']];
  const yRows = [];
  parts.forEach(pt => pt.all.forEach(s => {
    const f = s.f, last = new Date(pt.rng.end * DAY).getUTCFullYear(), refs = {};
    for (let y = new Date(f.d[0] * DAY).getUTCFullYear(); y <= last; y++) {
      const ie = lastOnOrBefore(f, y === last ? pt.rng.end : Math.round(Date.UTC(y, 11, 31) / DAY));
      let ia = lastOnOrBefore(f, Math.round(Date.UTC(y - 1, 11, 31) / DAY)), part = false;
      if (ia < 0) { ia = 0; part = f.d[0] > Math.round(Date.UTC(y, 0, 7) / DAY); }
      if (ie <= ia) continue;
      const r = yv.length + 1;
      yv.push([groupLabel(pt.g), labelOf(f.provider), y, xlDate(f.d[ia]), f.v[ia], xlDate(f.d[ie]), f.v[ie], xlF(`G${r}/E${r}-1`, f.v[ie] / f.v[ia] - 1, '0.00%'), part || y === last ? (L ? 'taip' : 'yes') : '']);
      refs[y] = r;
    }
    yRows.push({ g: groupLabel(pt.g), p: labelOf(f.provider), refs });
  }));
  const yrs = [...new Set(yRows.flatMap(x => Object.keys(x.refs).map(Number)))].sort((a, b) => a - b);
  const ycal = [[L ? 'Grupė' : 'Group', L ? 'Valdytojas' : 'Manager', ...yrs]].concat(yRows.map(x => [x.g, x.p, ...yrs.map(y => x.refs[y] ? xlF(`${YQ}!H${x.refs[y]}`, yv[x.refs[y] - 1][7].v, '0.00%') : null)]));
  meth.push([], [L ? 'Kalendoriniai metai' : 'Calendar years', L ? 'Grąža = metų paskutinė vertė ÷ praėjusių metų paskutinė vertė − 1 (lapas „Metų vertės“). Jei fondas įsteigtas per metus – nuo pirmos vertės (dalis metų); paskutiniai metai – iki naujausios dienos.' : 'Return = last value of the year ÷ last value of the previous year − 1 (sheet “Year values”). If the fund started during the year – from its first value (part of year); the last year – to the latest day.']);
  const add = (rows, name, w) => { const ws = XLSX.utils.aoa_to_sheet(rows); if (w) ws['!cols'] = w; XLSX.utils.book_append_sheet(wb, ws, name); };
  add(meth, S.meth, [{ wch: 26 }, { wch: 110 }]);
  add(ycal, YC, [{ wch: 22 }, { wch: 10 }, ...yrs.map(() => ({ wch: 10 }))]); add(yv, YS, [{ wch: 22 }, { wch: 10 }, { wch: 6 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }]);
  add(met, S.met, [{ wch: 22 }, { wch: 10 }, { wch: 40 }, ...Array(hdr.length - 3).fill({ wch: 14 })]);
  add(sheets.per, S.per); add(sheets.all, S.all);
  return wb;
}
async function exportMetricsXlsx() {
  const btn = $('btnMetXl'); btn.disabled = true;
  try { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); XLSX.writeFile(metricsBook(), `${lang === 'lt' ? 'Rodikliai' : 'Metrics'}_${P.group}_${iso(LATEST)}.xlsx`); }
  catch (e) { alert(T().xlsxFail); }
  btn.disabled = false;
}
['tRet', 'tRelM', 'tRank', 'tAnnM'].forEach(id => XLB.set(id, async () => ({ sheets: XLSX_SHIM.toXL(marketBook()) })));
async function exportMarketXlsx() {
  const btn = $('btnMxl'); btn.disabled = true;
  try { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'); XLSX.writeFile(marketBook(), `${lang === 'lt' ? 'Visa_rinka' : 'Market'}_${iso(LATEST)}.xlsx`); }
  catch (e) { alert(T().xlsxFail); }
  btn.disabled = false;
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
  $('group').addEventListener('change', e => { P.group = e.target.value; resetZoom(); saveState(); syncChips(); renderFunds(); });
  $('hmProv').addEventListener('change', e => { P.hmProv = e.target.value; saveState(); renderHeatmap(byId(P.group === 'all' ? P.hmGroup : P.group), P.group === 'all'); });
  $('hmGroup').addEventListener('change', e => { P.hmGroup = e.target.value; saveState(); renderHeatmap(byId(P.hmGroup), true); });
  PERIOD_IDS.forEach(per => { const b = document.createElement('button'); b.type = 'button'; b.dataset.p = per;
    b.addEventListener('click', () => { if (P.ovP.has(per)) { if (P.ovP.size > 1) P.ovP.delete(per); } else P.ovP.add(per); saveState(); renderOverall(); });
    $('ovPers').appendChild(b); });
  Object.keys(OV_PRESETS).forEach(k => { const b = document.createElement('button'); b.type = 'button'; b.dataset.k = k;
    b.addEventListener('click', () => { P.ovP = new Set(OV_PRESETS[k]); saveState(); renderOverall(); });
    $('ovPreset').appendChild(b); });
  $('btnGx').addEventListener('click', () => { P.gx = !P.gx; saveState(); renderMarket(); });
  $('btnMxl').addEventListener('click', exportMarketXlsx); $('btnMetXl').addEventListener('click', exportMetricsXlsx);
  $('mref').addEventListener('change', e => { P.mref = e.target.value; saveState(); renderMarket(); });
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
  $('btnCpi').addEventListener('click', () => { P.cpi = !P.cpi; saveState(); $('btnCpi').setAttribute('aria-pressed', P.cpi); drawChart(); });
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
function syncChips() { const g = IS3 && P.group !== 'all' ? byId(P.group) : null; document.querySelectorAll('#chips .chip').forEach(c => { c.setAttribute('aria-pressed', P.provs.has(c.dataset.id)); c.hidden = !!g && !g.funds.some(f => f.provider === c.dataset.id); }); }   // III pakopa – tik pasirinktos kategorijos fondai
function syncView() {
  const sel = $('diffRef'), cur = P.diffRef;
  sel.innerHTML = `<option value="avg">${T().diffAvg}</option>` + marketProvs().map(p => `<option value="${p.id}">${p.label}</option>`).join(''); sel.value = cur; sel.hidden = P.view !== 'diff';
  $('diffFromLbl').hidden = P.view !== 'diff'; $('diffFromLbl').textContent = T().diffFrom; $('viewSeg').querySelectorAll('button').forEach(b => { b.textContent = T()['view' + b.dataset.v]; b.setAttribute('aria-pressed', b.dataset.v === P.view); }); }
function winLabel(w) { const v = T()['win' + w]; return typeof v === 'function' ? v(periodText()) : v; }
function syncSumWin() { $('sumWin').querySelectorAll('button').forEach(b => { b.textContent = winLabel(b.dataset.w); b.setAttribute('aria-pressed', b.dataset.w === P.sumWin); }); }
function labelControls() {
  // KPI eilutė (fondų / valdytojų skaičius) pašalinta – kolegoms tik triukšmas (savininkas 2026-10-16: „per daug painus“)
  $('periods').setAttribute('aria-label', T().period);
  $('periods').querySelectorAll('button').forEach(b => b.textContent = T().periods[b.dataset.id]);
  syncCalSelects();
  $('lblFrom').textContent = T().from; $('lblTo').textContent = T().to;
  ['from', 'to'].forEach(id => { $(id).min = iso(EARLIEST); $(id).max = iso(LATEST); });
  const sel = $('group'), cur = P.group; sel.innerHTML = `<option value="all">${T().allFunds}</option>` + DATA.groups.map(g => `<option value="${g.id}">${groupLabel(g)}</option>`).join(''); sel.value = cur;
  $('foot').textContent = T().foot;
  $('btnShare').textContent = T().share; $('btnXlsx').textContent = T().xlsx; $('btnXlsxDay').textContent = T().xlsxDay; $('btnXlsxDay').title = T().xlsxDayTip; $('xlDate').title = T().xlsxDayTip; $('xlDate').min = iso(EARLIEST); $('xlDate').max = iso(LATEST); if (!$('xlDate').value) $('xlDate').value = iso(LATEST); $('btnPrint').textContent = T().print;
  $('idxLbl').innerHTML = T().idxLbl + ik('idx'); renderIdxChips();
  $('btnCpi').textContent = T().cpiBtn; $('btnCpi').hidden = typeof CPI === 'undefined'; $('btnCpi').setAttribute('aria-pressed', !!P.cpi);
  $('btnEvents').textContent = T().eventsBtn; $('evInfo').innerHTML = ik('events'); $('resetZoom').textContent = T().resetZoom; $('btnPng').textContent = T().png; $('zoomHint').textContent = T().zoomHint;
  $('btnAdv').innerHTML = T().advBtn;
  addSubnav(['hMarket', 'hSum', 'hFund', 'hRisk', 'hYM', 'insTitle'].map((id, i) => ({ id, label: T().pnav[i] })).filter(x => !IS3 || (x.id !== 'hMarket' && x.id !== 'insTitle')));   // vidinė navigacija (auditas #43)
  syncSumWin(); syncView();
}
function syncAll() {
  let rs = $('realSeg');   // nominali / reali grąža (patvirtinta idėja „Realioji grąža“, 2026-10-10)
  if (!rs && typeof CPI !== 'undefined') {
    rs = document.createElement('div'); rs.className = 'seg'; rs.id = 'realSeg'; rs.setAttribute('role', 'group');
    rs.innerHTML = '<button type="button" data-v="0"></button><button type="button" data-v="1"></button>';
    $('viewSeg').before(rs);
    rs.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; P.real = b.dataset.v === '1'; saveState(); syncAll(); });
  }
  if (rs) {
    rs.querySelectorAll('button').forEach(b => { b.textContent = b.dataset.v === '1' ? T().realOn : T().realOff; b.setAttribute('aria-pressed', String(!!P.real === (b.dataset.v === '1'))); });
    const ks = Object.keys(CPI); rs.title = T().realTip(ks[ks.length - 1]);
    let rn = $('realNote'); if (!rn) { rn = document.createElement('p'); rn.className = 'note'; rn.id = 'realNote'; rn.style.margin = '6px 0 0'; $('chartCard').append(rn); }
    rn.hidden = !P.real; rn.textContent = P.real ? T().realTip(ks[ks.length - 1]) : '';
  }
  $('periods').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === P.period));
  syncCalSelects();
  $('btnEvents').setAttribute('aria-pressed', P.events);
  $('printMeta').textContent = `${T().siteTitle} · ${groupName(P.group)} · ${periodText()} · ${T().updated} ${DATA.generated}`;
  renderSummary(); if (!IS3) renderMarket(); renderFunds(); fitSticky();
}
buildControls(); syncChips();
if (IS3) {   // III pakopa: valdytojų lentelių ir Sharpe matricos (grupės × valdytojai) nėra – Sharpe yra „Papildomuose rodikliuose“
  const sm = $('hMarket').closest('section'); if (sm) { sm.removeAttribute('data-tab'); sm.hidden = true; }
  [$('hRisk'), $('c_riskMap'), $('riskMap') && $('riskMap').closest('.card')].forEach(e => { if (e) e.hidden = true; });
  addStrings({ thFund: 'Fund' }, { thFund: 'Fondas' });
}
renderHeader(IS3 ? 'performance3' : 'performance', () => { labelControls(); syncAll(); });
labelControls();
$('from').value = P.from; $('to').value = P.to;
syncAll();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { chartState && drawChart(); renderRiskMap(); renderBars(lastParts); RDD && RDD.paint(); fitSticky(); }, 120); });

/* paaiškinimai naujiems rodikliams */
Object.assign(I18N.lt.info, { gross: 'Metinė grąža + dabartinis valdymo mokestis (Lietuvos banko sąrašas). Parodo, kaip sekėsi investuoti prieš mokestį – kiek skirtumą tarp fondų lemia mokestis, o kiek investavimas. Apytikslė: mokestis laikomas pastoviu visą laikotarpį.', calmar: 'Metinė grąža ÷ didžiausio kritimo laikotarpyje dydis (Calmar koeficientas). Kuo didesnis, tuo daugiau grąžos gauta už patirtą didžiausią nuosmukį.' });
Object.assign(I18N.en.info, { gross: 'Annualised return + current management fee (Bank of Lithuania list). Shows investment results before the fee – how much of the gap between funds comes from the fee and how much from investing. Approximate: the fee is assumed constant over the period.', calmar: 'Annualised return ÷ size of the largest fall in the period (Calmar ratio). Higher = more return for the worst drawdown suffered.' });
