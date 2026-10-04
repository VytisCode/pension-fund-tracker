/* Rezultatų ir palyginimo puslapis. Priklauso nuo: data.js (DATA), events.js (EVENTS), common.js. */
addStrings({
  from: 'From', to: 'To', group: 'Group', ret: 'Return', rank: 'Rank (1 = best)', avg: 'Average',
  hSum: 'Automatic summary', winsel: p => `Selected period (${p})`, win1w: 'Last 7 days', win1m: 'Last month', qPlace: 'Quarter', yPlace: 'Year',
  hMarket: 'Whole market: return and rank by age group', hFund: 'Compare funds',
  hRet: 'Return over the period, %', hRank: 'Rank within the age group (1 = best return)',
  hQ: 'Quartile within the age group (Q1 = top 25 %)',
  hOv: 'Overall ranking across all groups and periods –', ovAll: 'all periods', ovLong: '1 yr and longer',
  mMarket: p => `Period: ${p}. Colours show the rank within each row (green = best, red = worst).`,
  nMarket: 'Return = change in unit value between the period start and the latest common date in each group. “–” = the fund did not exist at the start of the period or has no fresh data. Average row: simple average across the age groups where the fund has a value. Quartile: rank 1–2 of 6 ≈ Q1–Q2 etc. (rank × 4 / number of funds, rounded up). Overall ranking: every age group × every period is one comparison; providers are ordered by average rank.',
  thCmp: 'Comparisons', thFirst: '1st places', thFirstPct: '% 1st', thQ1: '% top quartile', thAvgRank: 'Avg. rank',
  hMetrics: 'Performance metrics', hCal: 'Calendar-year returns', hRoll: 'Rolling returns (to the latest date)',
  hQP: 'Quartile by period (this group)', hHm: 'Monthly returns heat map –',
  thRank: '#', thFund: 'Provider', thPeriodRet: 'Return, period', thVol: 'Volatility p.a., period', thMdd: 'Max drawdown, period',
  thInception: 'Inception', thCagr: 'Return p.a. since inception', thVolAll: 'Volatility p.a. since inception', thMddAll: 'Max drawdown since inception',
  thRet1m: '1 mo', thRet3m: '3 mo', thRet6m: '6 mo', thRet1y: '1 yr', thRet3y: '3 yr p.a.', thRet5y: '5 yr p.a.',
  thR1avg: 'Rolling 1-yr: average', thR1min: 'min', thR1max: 'max', thR1pos: '% positive', thYear: 'Year',
  ytd: 'YTD', mChart: (g, p) => `${g} · ${p}. Returns rebased to 0 % at the start of the period.`,
  mZoom: (g, a, b) => `${g} · zoomed ${a} → ${b}. Returns rebased to 0 % at the start of the zoomed range.`,
  nFund: 'Volatility = standard deviation of daily returns × √252 (days with no price change are excluded). Annualised return = compound annual growth between the first and last available price (shown only for histories of at least one year). Max drawdown = largest peak-to-trough fall. * = fund started during that year (return since inception). Rolling returns longer than one year are annualised. Unit values are already net of fees and taxes. Past performance is not a guide to future returns.',
  foot: 'Data is collected automatically from the providers\' websites and APIs; for information only, not investment advice.',
  share: 'Copy link', copied: 'Link copied', xlsx: 'Excel', xlsxBusy: 'Preparing…', xlsxFail: 'Could not load the Excel library (no internet?).', print: 'Print / PDF',
  viewret: 'Return', viewdiff: 'Difference', diffFrom: 'from', diffAvg: 'Group average', mDiff: r => `Lines show each fund’s cumulative return minus ${r ? r + '’s' : 'the group average'}, in percentage points (0 = ${r || 'group average'}).`,
  eventsBtn: 'Market events', resetZoom: 'Reset zoom', png: 'Download PNG', zoomHint: 'Tip: drag across the chart to zoom; hover a provider to highlight it; click a name at the chart’s right edge (or double-click a chip) to pin it.',
  advBtn: 'Advanced metrics (Sharpe ratio, best / worst periods)', rf: 'Risk-free rate, % p.a.',
  hAdv: 'Advanced metrics', thAnn: 'Return p.a., period', thSharpe: 'Sharpe ratio', thBestD: 'Best day', thWorstD: 'Worst day', thBestM: 'Best month', thWorstM: 'Worst month',
  thBestY: 'Best year', thWorstY: 'Worst year', thPosM: '% positive months',
  nAdv: 'Computed for the selected period (best / worst calendar year: whole history, full years only). Sharpe = (annualised return − risk-free rate) ÷ annualised volatility; on periods shorter than a year the annualised figures are unreliable. Months = full calendar months inside the period.',
  notShown: l => `* Started later: ${l} – the line begins at the average level of the other funds on its first day, so only its subsequent movement is comparable; its own return over the full range is not shown.`,
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
  thGroup: 'Group', thLeader: 'Leader', thLagger: 'Laggard', thSpread: 'Spread, p.p.', thMove: 'Largest 1-day move',
  nSum: 'Computed automatically from the latest data in each age group; leader / laggard by return over the window.',
  info: {
    ret: 'Change in unit value between the start and end of the period. Unit values are already net of fees and taxes, so no further deduction is needed.',
    rank: 'Position of each provider within its age group by return over the selected period; 1 = best.',
    quartile: 'Funds in an age group are split into four equal-sized bands by return: Q1 = top 25 %, Q4 = bottom 25 %. With six funds, ranks 1–2 ≈ Q1–Q2 etc.',
    overall: 'Every age group × every period is one comparison. Counts how often a provider is first, in the top quartile, and its average rank. Short periods are noisy, so the “1 yr and longer” view is usually fairer.',
    vol: 'Volatility = standard deviation of daily returns × √252 – how much the unit value fluctuates; higher = more risk. Days with no price change are excluded.',
    mdd: 'Maximum drawdown = the largest fall from a peak to a later trough. Shows the worst loss an investor could have suffered.',
    cagr: 'Compound annual growth rate between the first and last available unit value (shown only when the history is at least one year).',
    cal: 'Return for each calendar year. * = the fund started during that year, so the figure covers only part of it. The last column is the current year to date.',
    roll: 'Return over the last 1, 3, 6, 12, 36, 60 months (longer than a year – annualised). Rolling 1-yr = every possible 12-month window in history: average, worst, best and share that were positive.',
    heat: 'Return in each calendar month (rows = years). Green = gain, red = loss; the last column is the year.',
    sharpe: 'Sharpe ratio = (annualised return − risk-free rate) ÷ annualised volatility. Higher = better return per unit of risk. Choose the risk-free rate (e.g. a deposit or short-term government bond yield).',
    bestworst: 'Best / worst single day and calendar month inside the selected period, and best / worst full calendar year over the whole history.',
    posm: 'Share of full calendar months with a positive return, within the selected period.',
    events: 'Shows key market and pension-system events on the chart. Hover (or see the list below the chart) for what happened and the source. Off by default.',
    summary: 'Generated automatically from the latest data: who leads and lags over the last 7 days or month in each age group, and the largest one-day move.',
    coverage: 'Some funds have a shorter history than their peers.',
  },
}, {
  from: 'Nuo', to: 'Iki', group: 'Grupė', ret: 'Grąža', rank: 'Vieta (1 = geriausia)', avg: 'Vidurkis',
  hSum: 'Automatinė santrauka', winsel: p => `Pasirinktas laikotarpis (${p})`, win1w: 'Paskutinės 7 dienos', win1m: 'Paskutinis mėnuo', qPlace: 'Ketvirtis', yPlace: 'Metai',
  hMarket: 'Visa rinka: grąža ir vieta pagal amžiaus grupes', hFund: 'Fondų palyginimas',
  hRet: 'Grąža laikotarpyje, %', hRank: 'Vieta amžiaus grupėje (1 = geriausia grąža)',
  hQ: 'Kvartilis amžiaus grupėje (Q1 = geriausi 25 %)',
  hOv: 'Bendra reitingų lentelė (visos grupės ir laikotarpiai) –', ovAll: 'visi laikotarpiai', ovLong: '1 m. ir ilgesni',
  mMarket: p => `Laikotarpis: ${p}. Spalvos rodo vietą kiekvienoje eilutėje (žalia – geriausia, raudona – prasčiausia).`,
  nMarket: 'Grąža = vieneto vertės pokytis tarp laikotarpio pradžios ir paskutinės bendros dienos grupėje. „–“ = fondo laikotarpio pradžioje dar nebuvo arba nėra naujų duomenų. Vidurkio eilutė: paprastas vidurkis tarp amžiaus grupių, kuriose fondas turi reikšmę. Kvartilis: vieta × 4 / fondų skaičius, apvalinama aukštyn (iš 6 fondų 1–2 vieta ≈ Q1–Q2 ir t. t.). Bendras reitingas: kiekviena amžiaus grupė × kiekvienas laikotarpis yra vienas palyginimas; tiekėjai rikiuojami pagal vidutinę vietą.',
  thCmp: 'Palyginimų', thFirst: '1 vietų', thFirstPct: '% 1 vietų', thQ1: '% viršutiniame kvartilyje', thAvgRank: 'Vid. vieta',
  hMetrics: 'Rezultatų rodikliai', hCal: 'Kalendorinių metų grąža', hRoll: 'Slenkanti grąža (iki paskutinės dienos)',
  hQP: 'Kvartilis pagal laikotarpį (ši grupė)', hHm: 'Mėnesių grąžos šilumos žemėlapis –',
  thRank: '#', thFund: 'Tiekėjas', thPeriodRet: 'Grąža laikotarpyje', thVol: 'Svyravimas per metus, laikotarpyje', thMdd: 'Didžiausias kritimas, laikotarpyje',
  thInception: 'Pradžia', thCagr: 'Metinė grąža nuo įsteigimo', thVolAll: 'Svyravimas per metus nuo įsteigimo', thMddAll: 'Didžiausias kritimas nuo įsteigimo',
  thRet1m: '1 mėn.', thRet3m: '3 mėn.', thRet6m: '6 mėn.', thRet1y: '1 m.', thRet3y: '3 m., metinė', thRet5y: '5 m., metinė',
  thR1avg: 'Slenkanti 1 m.: vidurkis', thR1min: 'min.', thR1max: 'maks.', thR1pos: '% teigiamų', thYear: 'Metai',
  ytd: 'Šie metai', mChart: (g, p) => `${g} · ${p}. Grąža perskaičiuota į 0 % laikotarpio pradžioje.`,
  mZoom: (g, a, b) => `${g} · priartinta ${a} → ${b}. Grąža perskaičiuota į 0 % priartinto laikotarpio pradžioje.`,
  nFund: 'Svyravimas = dienos grąžų standartinis nuokrypis × √252 (dienos be kainos pokyčio neįtraukiamos). Metinė grąža = sudėtinis metinis augimas tarp pirmos ir paskutinės turimos kainos (rodoma tik bent vienerių metų istorijai). Didžiausias kritimas = didžiausias nuosmukis nuo viršūnės iki dugno. * = fondas pradėjo veikti tais metais (grąža nuo įsteigimo). Ilgesnė nei metų slenkanti grąža perskaičiuota metine. Vieneto vertė jau yra po mokesčių ir mokesčių fondui. Praeities rezultatai negarantuoja ateities grąžos.',
  foot: 'Duomenys renkami automatiškai iš tiekėjų svetainių ir API; tai informacinė medžiaga, ne investavimo rekomendacija.',
  share: 'Kopijuoti nuorodą', copied: 'Nuoroda nukopijuota', xlsx: 'Excel', xlsxBusy: 'Ruošiama…', xlsxFail: 'Nepavyko įkelti Excel bibliotekos (nėra interneto?).', print: 'Spausdinti / PDF',
  viewret: 'Grąža', viewdiff: 'Skirtumas', diffFrom: 'nuo', diffAvg: 'Grupės vidurkio', mDiff: r => `Linijos rodo kiekvieno fondo sukauptą grąžą minus ${r ? r + ' grąža' : 'grupės vidurkis'}, procentiniais punktais (0 = ${r || 'grupės vidurkis'}).`,
  eventsBtn: 'Rinkų įvykiai', resetZoom: 'Atstatyti mastelį', png: 'Atsisiųsti PNG', zoomHint: 'Patarimas: pele pažymėkite sritį grafike, kad priartintumėte; užveskite pelę ant tiekėjo, kad jį paryškintumėte; paspauskite pavadinimą grafiko dešinėje (arba dukart paspauskite mygtuką), kad jį prisegtumėte.',
  advBtn: 'Papildomi rodikliai (Sharpe koeficientas, geriausi / blogiausi laikotarpiai)', rf: 'Be rizikos palūkanų norma, % per metus',
  hAdv: 'Papildomi rodikliai', thAnn: 'Metinė grąža, laikotarpyje', thSharpe: 'Sharpe koeficientas', thBestD: 'Geriausia diena', thWorstD: 'Blogiausia diena', thBestM: 'Geriausias mėnuo', thWorstM: 'Blogiausias mėnuo',
  thBestY: 'Geriausi metai', thWorstY: 'Blogiausi metai', thPosM: '% teigiamų mėnesių',
  nAdv: 'Skaičiuojama pasirinktam laikotarpiui (geriausi / blogiausi kalendoriniai metai – visa istorija, tik pilni metai). Sharpe = (metinė grąža − be rizikos palūkanų norma) ÷ metinis svyravimas; trumpesniems nei metų laikotarpiams metiniai skaičiai nepatikimi. Mėnesiai = pilni kalendoriniai mėnesiai laikotarpio viduje.',
  notShown: l => `* Pradėjo vėliau: ${l} – linija prasideda ties kitų fondų vidutiniu lygiu pirmą jo dieną, todėl palyginamas tik tolesnis kitimas; savo grąža per visą intervalą nerodoma.`,
  capSpan: (l, a, e) => `${l}: ${a} → ${e}`, byGroup: 'pradžia skiriasi pagal grupę', endByGroup: 'pabaiga skiriasi pagal grupę',
  capOv: (h, d) => `${h}; kiekvienas laikotarpis baigiasi savo grupės paskutine diena (iki ${d})`,
  capMetrics: (a, e) => `Laikotarpio stulpeliai: ${a} → ${e}. Stulpeliai „nuo įsteigimo“: kiekvieno fondo pirma diena → ${e}.`,
  capCal: (y0, y1, e) => `Kalendoriniai metai ${y0}–${y1}; paskutinis stulpelis – šie metai iki šiol (iki ${e}).`,
  capRoll: e => `Slenkantys langai, baigiantys ${e}; „Slenkanti 1 m.“ rodikliai naudoja visus 12 mėn. langus fondo istorijoje.`,
  capQP: (e, a) => `Laikotarpiai baigiasi ${e}; „Visa istorija“ prasideda ${a}.`,
  capHm: (p, a, e) => `${p}: mėnesių grąža ${a} → ${e}; pirmas ir paskutinis mėnuo gali būti nepilni.`,
  capAdv: (a, e) => `Laikotarpis ${a} → ${e}; geriausi / blogiausi kalendoriniai metai – visa istorija.`,
  covTitle: 'Duomenų aprėptis', covLater: (p, d) => `${p}: duomenys prasideda ${d} – vėliau nei kitų šios grupės fondų (fondas naujesnis arba ankstesnės istorijos nėra), todėl ilgi laikotarpiai ir rodikliai „nuo įsteigimo“ apima trumpesnę istoriją.`,
  covSeb: 'Ankstesnė istorija dar neįkelta (turimi tik duomenys nuo nurodytos dienos).',
  sumNoData: 'Duomenų nepakanka.', sumLatest: d => `Naujausi duomenys: <b>${d}</b>.`,
  sumLead: (p, k, n) => `<b>${p}</b> pirmavo ${k} iš ${n} amžiaus grupių.`, sumLag: (p, k, n) => `<b>${p}</b> atsiliko ${k} iš ${n} amžiaus grupių.`,
  sumMove: (p, g, v, d) => `Didžiausias vienos dienos pokytis: <b>${p}</b> (${g}) <b>${v}</b>, ${d}.`,
  thGroup: 'Grupė', thLeader: 'Lyderis', thLagger: 'Atsiliekantis', thSpread: 'Skirtumas, p. p.', thMove: 'Didžiausias 1 d. pokytis',
  nSum: 'Skaičiuojama automatiškai iš naujausių kiekvienos amžiaus grupės duomenų; lyderis / atsiliekantis – pagal grąžą pasirinktame lange.',
  info: {
    ret: 'Vieneto vertės pokytis tarp laikotarpio pradžios ir pabaigos. Vieneto vertė jau yra po mokesčių ir sąnaudų, todėl papildomai nieko atimti nereikia.',
    rank: 'Kiekvieno tiekėjo vieta savo amžiaus grupėje pagal grąžą pasirinktu laikotarpiu; 1 = geriausia.',
    quartile: 'Amžiaus grupės fondai pagal grąžą padalijami į keturias vienodo dydžio dalis: Q1 = geriausi 25 %, Q4 = prasčiausi 25 %. Esant šešiems fondams, 1–2 vieta ≈ Q1–Q2 ir t. t.',
    overall: 'Kiekviena amžiaus grupė × kiekvienas laikotarpis yra vienas palyginimas. Skaičiuojama, kaip dažnai tiekėjas yra pirmas, viršutiniame kvartilyje ir jo vidutinė vieta. Trumpi laikotarpiai triukšmingi, todėl „1 m. ir ilgesni“ dažniausiai teisingesnis.',
    vol: 'Svyravimas = dienos grąžų standartinis nuokrypis × √252 – kiek svyruoja vieneto vertė; didesnis = didesnė rizika. Dienos be kainos pokyčio neįtraukiamos.',
    mdd: 'Didžiausias kritimas = didžiausias nuosmukis nuo viršūnės iki vėlesnio dugno. Rodo blogiausią galimą investuotojo nuostolį.',
    cagr: 'Sudėtinis metinis augimas tarp pirmos ir paskutinės turimos vieneto vertės (rodoma tik bent vienerių metų istorijai).',
    cal: 'Grąža už kiekvienus kalendorinius metus. * = fondas pradėjo veikti tais metais, todėl rodoma tik dalis metų. Paskutinis stulpelis – šie metai iki šiol.',
    roll: 'Grąža per paskutinius 1, 3, 6, 12, 36, 60 mėn. (ilgesnė nei metų – perskaičiuota metine). Slenkanti 1 m. = visi galimi 12 mėn. langai istorijoje: vidurkis, blogiausias, geriausias ir teigiamų dalis.',
    heat: 'Grąža kiekvieną kalendorinį mėnesį (eilutės = metai). Žalia = pelnas, raudona = nuostolis; paskutinis stulpelis – metai.',
    sharpe: 'Sharpe koeficientas = (metinė grąža − be rizikos palūkanų norma) ÷ metinis svyravimas. Didesnis = geresnė grąža vienam rizikos vienetui. Be rizikos normą pasirinkite patys (pvz., indėlių ar trumpų vyriausybės obligacijų pelningumą).',
    bestworst: 'Geriausia / blogiausia viena diena ir kalendorinis mėnuo pasirinktu laikotarpiu bei geriausi / blogiausi pilni kalendoriniai metai per visą istoriją.',
    posm: 'Pilnų kalendorinių mėnesių su teigiama grąža dalis pasirinktame laikotarpyje.',
    events: 'Grafike pažymi svarbius rinkų ir pensijų sistemos įvykius. Užveskite pelę (arba žiūrėkite sąrašą po grafiku), kad pamatytumėte, kas įvyko, ir šaltinį. Pagal nutylėjimą išjungta.',
    summary: 'Sugeneruota automatiškai iš naujausių duomenų: kas pirmauja ir atsilieka per paskutines 7 dienas arba mėnesį kiekvienoje amžiaus grupėje, bei didžiausias vienos dienos pokytis.',
    coverage: 'Kai kurių fondų istorija trumpesnė nei konkurentų.',
  },
});

const PERIOD_IDS = ['1m', '3m', '6m', 'ytd', '1y', '3y', '5y', 'max'];            // lentelėms „pagal laikotarpį“ ir bendram reitingui
const PRESET_IDS = ['1m', '3m', '6m', 'ytd', 'Q', '1y', 'Y', '3y', '5y', 'max'];   // greitieji mygtukai; Q ir Y – išskleidžiami sąrašai (ketvirtis „q:2026-3“, kalendoriniai metai „y:2025“)
const isCalPeriod = id => /^q:\d{4}-[1-4]$/.test(id) || /^y:\d{4}$/.test(id);
function presetRange(per, end, group, sel) {
  if (per === 'max') return { anchor: maxAnchor(group, sel), end };
  let m;
  if ((m = /^q:(\d{4})-([1-4])$/.exec(per))) { const y = +m[1], q = +m[2]; return { anchor: Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY), end: Math.min(end, Math.round(Date.UTC(y, q * 3, 0) / DAY)) }; }
  if ((m = /^y:(\d{4})$/.exec(per))) { const y = +m[1]; return { anchor: Math.round(Date.UTC(y - 1, 11, 31) / DAY), end: Math.min(end, Math.round(Date.UTC(y, 11, 31) / DAY)) }; }
  return { anchor: anchorFor(per, end, group.funds), end };
}
const P = { period: 'ytd', from: '', to: '', group: DATA.groups[0].id, provs: new Set(DATA.providers.map(p => p.id)),
  hl: null, pin: null, view: 'ret', diffRef: 'avg', zoom: null, events: false, adv: false, rf: 2, hmProv: null, sumWin: 'sel', ovH: 'long' };
const $ = id => document.getElementById(id);
const byId = id => DATA.groups.find(g => g.id === id);

/* ---------- būsenos išsaugojimas (naršyklėje) ir dalijimosi nuoroda ---------- */
function saveState() {
  try { localStorage.setItem('perfState', JSON.stringify({ period: P.period, from: P.from, to: P.to, group: P.group, provs: [...P.provs], adv: P.adv, rf: P.rf, view: P.view, diffRef: P.diffRef, hmProv: P.hmProv, sumWin: P.sumWin, ovH: P.ovH })); } catch (e) {}
}
function applyState(s) {
  if (!s) return;
  if (PRESET_IDS.includes(s.period) || s.period === 'custom' || isCalPeriod(s.period)) P.period = s.period;
  if (typeof s.from === 'string') P.from = s.from; if (typeof s.to === 'string') P.to = s.to;
  if (byId(s.group)) P.group = s.group;
  if (Array.isArray(s.provs)) { const v = s.provs.filter(id => DATA.providers.some(p => p.id === id)); if (v.length) P.provs = new Set(v); }
  if (s.view === 'ret' || s.view === 'diff') P.view = s.view;
  if (s.diffRef === 'avg' || DATA.providers.some(p => p.id === s.diffRef)) P.diffRef = s.diffRef;
  if (typeof s.adv === 'boolean') P.adv = s.adv;
  if (typeof s.rf === 'number' && isFinite(s.rf)) P.rf = s.rf;
  if (s.hmProv && DATA.providers.some(p => p.id === s.hmProv)) P.hmProv = s.hmProv;
  if (s.sumWin === 'sel' || s.sumWin === '1w' || s.sumWin === '1m') P.sumWin = s.sumWin;
  if (s.ovH === 'all' || s.ovH === 'long') P.ovH = s.ovH;
}
function loadHash() {
  const q = new URLSearchParams(location.hash.slice(1)); if (![...q.keys()].length) return;
  const s = {};
  if (q.get('p')) s.period = q.get('p'); if (q.get('f')) s.from = q.get('f'); if (q.get('t')) s.to = q.get('t'); if (q.get('g')) s.group = q.get('g');
  if (q.get('v')) s.provs = q.get('v').split(','); if (q.get('rf')) s.rf = parseFloat(q.get('rf')); if (q.get('adv')) s.adv = q.get('adv') === '1';
  if (q.get('vw')) s.view = q.get('vw'); if (q.get('dr')) s.diffRef = q.get('dr'); if (q.get('hm')) s.hmProv = q.get('hm'); if (q.get('sw')) s.sumWin = q.get('sw'); if (q.get('oh')) s.ovH = q.get('oh');
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
  if (P.adv) { q.set('adv', '1'); q.set('rf', P.rf); }
  if (P.view !== 'ret') { q.set('vw', P.view); q.set('dr', P.diffRef); }
  q.set('sw', P.sumWin); q.set('oh', P.ovH); if (P.hmProv) q.set('hm', P.hmProv);
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
const maxAnchor = (group, sel) => {            // fondai, pradėję ≤31 d. po ankstyviausio, laikomi pradėjusiais kartu
  const st = group.funds.filter(f => !sel || P.provs.has(f.provider)).map(f => f.d[0]).sort((x, y) => x - y);
  return Math.max(...st.filter(d => d - st[0] <= 31));
};
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
const periodLabel = id => { let m; if ((m = /^q:(\d{4})-([1-4])$/.exec(id))) return `Q${m[2]} ${m[1]}`; if ((m = /^y:(\d{4})$/.exec(id))) return m[1]; return T().periods[id]; };
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
const quartileOf = (rank, n) => (!rank || n < 3) ? null : Math.min(4, Math.ceil(rank * 4 / n));
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
  $('hMarket').textContent = T().hMarket; $('hRet').innerHTML = T().hRet + ik('ret'); $('hRank').innerHTML = T().hRank + ik('rank'); $('hQ').innerHTML = T().hQ + ik('quartile');
  $('mMarket').textContent = T().mMarket(periodText()); $('nMarket').textContent = T().nMarket;
  const provs = marketProvs();
  const head = `<thead><tr><th></th>${provs.map(p => `<th><span class="sw" style="display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;background:${colorOf(p.id)}"></span>${p.label}</th>`).join('')}</tr></thead>`;
  const rows = DATA.groups.map(g => {
    const rng = rangeFor(g), vals = {};
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
  const retBody = rows.map(r => `<tr><td>${groupLabel(r.g)}</td>${provs.map(p => { const v = r.vals[p.id]; return v === null ? '<td class="na">–</td>' : `<td class="${rkClass(r.ranks.get(p.id), r.n)}">${pct(v, 1)}</td>`; }).join('')}</tr>`).join('')
    + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => avgRet[p.id] === null ? '<td class="na">–</td>' : `<td class="${rkClass(arRank.map.get(p.id), arRank.n)}">${pct(avgRet[p.id], 1)}</td>`).join('')}</tr>`;
  const rankBody = rows.map(r => `<tr><td>${groupLabel(r.g)}</td>${provs.map(p => { const k = r.ranks.get(p.id); return k ? `<td class="${rkClass(k, r.n)}">${k}</td>` : '<td class="na">–</td>'; }).join('')}</tr>`).join('')
    + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => avgRank[p.id] === null ? '<td class="na">–</td>' : `<td class="${rkClass(akRank.map.get(p.id), akRank.n)}">${num(avgRank[p.id], 1)}</td>`).join('')}</tr>`;
  const qCell = (rank, n) => { const q = quartileOf(rank, n); return q ? `<td class="q${q}">Q${q}</td>` : '<td class="na">–</td>'; };
  const qBody = rows.map(r => `<tr><td>${groupLabel(r.g)}</td>${provs.map(p => qCell(r.ranks.get(p.id), r.n)).join('')}</tr>`).join('')
    + `<tr class="avg"><td>${T().avg}</td>${provs.map(p => qCell(akRank.map.get(p.id), akRank.n)).join('')}</tr>`;
  const spanAll = spanText(periodText(), rows.map(r => rangeFor(r.g, false)));
  ['tRet', 'tRank', 'tQ'].forEach(id => setCap(id, spanAll));
  $('tRet').innerHTML = head + `<tbody>${retBody}</tbody>`;
  $('tRank').innerHTML = head + `<tbody>${rankBody}</tbody>`;
  $('tQ').innerHTML = head + `<tbody>${qBody}</tbody>`;
  renderOverall();
}

/* bendras reitingas: visos grupės × laikotarpiai */
function renderOverall() {
  $('hOv').innerHTML = T().hOv;
  const sel = $('ovH'); sel.innerHTML = `<option value="all">${T().ovAll}</option><option value="long">${T().ovLong}</option>`; sel.value = P.ovH;
  const pers = P.ovH === 'all' ? PERIOD_IDS : ['1y', '3y', '5y', 'max'], st = {};
  setCap('tOv', T().capOv(pers.map(p => T().periods[p]).join(', '), iso(LATEST)));
  DATA.providers.forEach(p => { st[p.id] = { cmp: 0, first: 0, q1: 0, rs: 0 }; });
  DATA.groups.forEach(g => pers.forEach(per => {
    const rng = rangeAt(g, per), vals = DATA.providers.map(p => ({ key: p.id, v: retOf(g, p.id, rng) })), { map, n } = rankOf(vals);
    if (n < 3) return;
    map.forEach((rank, id) => { const s = st[id]; s.cmp++; s.rs += rank; if (rank === 1) s.first++; if (quartileOf(rank, n) === 1) s.q1++; });
  }));
  const list = DATA.providers.filter(p => st[p.id].cmp).map(p => ({ id: p.id, ...st[p.id], avg: st[p.id].rs / st[p.id].cmp })).sort((a, b) => a.avg - b.avg);
  const bst = (k, dir) => Math.max(...list.map(x => dir * x[k]));
  const mark = (v, k, dir, txt) => `<td class="${dir * v === bst(k, dir) ? 'best' : ''}">${txt}</td>`;
  const bFirst = Math.max(...list.map(x => x.first / x.cmp)), bQ = Math.max(...list.map(x => x.q1 / x.cmp)), bAvg = Math.min(...list.map(x => x.avg));
  $('tOv').innerHTML = `<thead><tr>${th(T().thRank, 'overall')}<th style="text-align:left">${T().thFund}</th><th>${T().thCmp}</th><th>${T().thFirst}</th><th>${T().thFirstPct}</th><th>${T().thQ1}</th><th>${T().thAvgRank}</th></tr></thead><tbody>`
    + list.map((x, i) => `<tr><td class="n">${i + 1}</td><td class="name"><span class="sw" style="background:${colorOf(x.id)}"></span>${labelOf(x.id)}</td><td>${x.cmp}</td><td>${x.first}</td><td class="${x.first / x.cmp === bFirst ? 'best' : ''}">${num(x.first / x.cmp * 100, 0)}%</td><td class="${x.q1 / x.cmp === bQ ? 'best' : ''}">${num(x.q1 / x.cmp * 100, 0)}%</td><td class="${x.avg === bAvg ? 'best' : ''}">${num(x.avg, 2)}</td></tr>`).join('') + '</tbody>';
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
/* Eilutės grafikui: kiekvienam fondui nuo x0; vėliau pradėję fondai prasideda pirmą savo dieną ties kitų fondų vidutiniu lygiu (žymima *),
   kad būtų matomas jų kitimas, o ankstesnių fondų istorija nebūtų trumpinama. */
function buildSeries(fs, x0, x1) {
  const series = fs.map(f => { const s = seriesOf(f, x0, x1); return s && s.points.length > 1 ? { provider: f.provider, points: s.points } : null; }).filter(Boolean);
  fs.filter(f => f.d[0] > x0 && f.d[0] < x1).forEach(f => {
    const d0 = f.d[0], lv = series.filter(r => !r.aligned).map(r => { let v = null; for (let i = r.points.length - 1; i >= 0; i--) if (r.points[i][0] <= d0) { v = r.points[i][1]; break; } return v; }).filter(v => v !== null);
    const s = seriesOf(f, d0, x1); if (!lv.length || !s || s.points.length < 2) return;
    const L = lv.reduce((a, b) => a + b, 0) / lv.length;
    series.push({ provider: f.provider, aligned: true, points: s.points.map(([d, r]) => [d, ((1 + L / 100) * (1 + r / 100) - 1) * 100]) });
  });
  return series;
}
let chartRef = null;
function drawChart() {
  const g = byId(P.group), rng = rangeFor(g, true);
  const x0 = P.zoom ? P.zoom[0] : rng.anchor, x1 = P.zoom ? Math.min(P.zoom[1], rng.end) : rng.end;
  const fs = g.funds.filter(f => P.provs.has(f.provider) && !isStale(f, rng.overallLast));
  const series = buildSeries(fs, x0, x1);
  const sortedEv = EVENTS.map((e, i) => ({ day: dayOf(e.day), n: i + 1, title: e[lang].t, text: e[lang].d, src: e.src })).sort((a, b) => a.day - b.day);
  if (P.view === 'diff') {                                       // skirtumas nuo grupės vidurkio arba pasirinkto tiekėjo, p. p.
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
  const evs = P.events ? sortedEv.filter(e => e.day >= x0 && e.day <= x1) : [];
  $('mChart').textContent = (P.zoom ? T().mZoom(groupLabel(g), iso(x0), iso(x1)) : T().mChart(groupLabel(g), `${periodText()} (${iso(rng.anchor)} → ${iso(rng.end)})`)) + (P.view === 'diff' ? ' ' + T().mDiff(chartRef) : '');
  const late = series.filter(r => r.aligned).map(r => `${labelOf(r.provider)} (${iso(r.points[0][0])})`);
  if (late.length) $('mChart').textContent += ' ' + T().notShown(late.join(', '));
  $('resetZoom').hidden = !P.zoom;
  const diff = P.view === 'diff', unit = diff ? ' p.p.' : ' %', W = $('chart').clientWidth || 600;
  const opt = { events: evs, hl: P.pin || P.hl, height: Math.max(300, Math.min(520, Math.round(W * 0.42))), unit, axisUnit: diff ? ' pp' : '%',
    onZoom: (a, b) => { P.zoom = [a, b]; drawChart(); }, onPick: id => { P.pin = P.pin === id ? null : id; drawChart(); } };
  chartState = { ctl: null, series, x0, x1, evs, opt };
  paintChart();
  const fin = $('finals'); const narrow = W <= 560;                    // siaurame ekrane galutinės reikšmės – po grafiku
  fin.innerHTML = narrow ? series.map(r => ({ r, v: r.points[r.points.length - 1][1] })).sort((a, b) => b.v - a.v).map(o => `<span><i style="background:${colorOf(o.r.provider)}"></i>${labelOf(o.r.provider)}${o.r.aligned ? '*' : ''} <b>${pct(o.v, 1).replace(' %', diff ? ' p.p.' : '%')}</b></span>`).join('') : '';
  $('evList').innerHTML = evs.map(e => `<li><span class="n">${e.n}</span><div><b>${iso(e.day)} · ${e.title}</b> – ${e.text} <span class="na">(${e.src.map(s => `<a href="${s.u}" target="_blank" rel="noopener">${s.n}</a>`).join(', ')})</span></div></li>`).join('');
}
function renderCoverage(g) {
  const firsts = g.funds.map(f => ({ f, d: f.d[0] })), earliest = Math.min(...firsts.map(x => x.d)), lines = [];
  firsts.forEach(({ f, d }) => {
    if (d - earliest > 31 || (f.provider === 'SEB' && g.id === '1989-1995' && d >= dayOf('2023-10-01'))) {
      let t = T().covLater(labelOf(f.provider), iso(d));
      if (f.provider === 'SEB' && g.id === '1989-1995' && d >= dayOf('2023-10-01')) t += ' ' + T().covSeb;
      lines.push(t);
    }
  });
  const c = $('cov'); c.hidden = !lines.length;
  c.innerHTML = lines.length ? `<b>${T().covTitle}</b>${ik('coverage')}` + lines.map(l => `<div>${l}</div>`).join('') : '';
}
function renderFunds() {
  const g = byId(P.group), rng = rangeFor(g, true);
  $('hFund').textContent = T().hFund; $('lblGroup').textContent = T().group;
  $('hMetrics').innerHTML = T().hMetrics + ik('ret'); $('hCal').innerHTML = T().hCal + ik('cal'); $('hRoll').innerHTML = T().hRoll + ik('roll'); $('nFund').textContent = T().nFund;
  $('hQP').innerHTML = T().hQP + ik('quartile'); $('hHm').innerHTML = T().hHm + ik('heat');
  const all = g.funds.filter(f => P.provs.has(f.provider)).map(f => fundStats(f, rng)).filter(Boolean);
  all.sort((a, b) => (b.ret ?? -1e9) - (a.ret ?? -1e9));
  drawChart(); renderCoverage(g);

  setCap('tMetrics', T().capMetrics(`${iso(rng.anchor)}`, iso(rng.end)));
  const rk = rankOf(all.map(s => ({ key: s.f.provider, v: s.ret })));
  const bestOf = (key, dir) => { const vs = all.map(s => s[key]).filter(v => v !== null); return vs.length ? (dir > 0 ? Math.max(...vs) : Math.min(...vs)) : null; };
  const cell = (v, fmt, best) => v === null ? '<td class="na">–</td>' : `<td class="${v === best ? 'best' : ''}">${fmt(v)}</td>`;
  const nm = s => `<td class="name"><span class="sw" style="background:${colorOf(s.f.provider)}"></span>${labelOf(s.f.provider)}</td>`;
  $('tMetrics').innerHTML = `<thead><tr><th>${T().thRank}</th><th style="text-align:left">${T().thFund}</th><th>${T().thPeriodRet}</th>${th(T().thVol, 'vol')}${th(T().thMdd, 'mdd')}<th>${T().thInception}</th>${th(T().thCagr, 'cagr')}<th>${T().thVolAll}</th><th>${T().thMddAll}</th></tr></thead><tbody>`
    + all.map(s => `<tr><td class="n">${rk.map.get(s.f.provider) || ''}</td>${nm(s)}${cell(s.ret, v => pct(v), bestOf('ret', 1))}${cell(s.vol, v => num(v, 1) + ' %', bestOf('vol', -1))}${cell(s.mdd, v => num(v, 1) + ' %', bestOf('mdd', 1))}<td>${iso(s.inception)}</td>${cell(s.cagr, v => pct(v), bestOf('cagr', 1))}${cell(s.volAll, v => num(v, 1) + ' %', bestOf('volAll', -1))}${cell(s.mddAll, v => num(v, 1) + ' %', bestOf('mddAll', 1))}</tr>`).join('') + '</tbody>';

  const cal = all.map(s => ({ s, c: calendarReturns(s.f, rng.end) }));
  const years = [...new Set(cal.flatMap(x => Object.keys(x.c)))].map(Number).sort((a, b) => a - b);
  const lastYear = new Date(rng.end * DAY).getUTCFullYear();
  setCap('tCal', T().capCal(years[0], lastYear, iso(rng.end)));
  $('tCal').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${years.map(y => `<th>${y === lastYear ? T().ytd : y}</th>`).join('')}</tr></thead><tbody>`
    + cal.map(x => `<tr>${nm(x.s)}${years.map(y => { const c = x.c[y]; if (!c) return '<td class="na">–</td>'; const best = Math.max(...cal.map(z => z.c[y] ? z.c[y].ret : -1e9)); return `<td class="${c.ret === best ? 'best' : ''}">${pct(c.ret, 1).replace(' %', '%')}${c.partial ? '*' : ''}</td>`; }).join('')}</tr>`).join('') + '</tbody>';

  setCap('tRoll', T().capRoll(iso(groupEnd(g).end)));
  const rol = all.map(s => ({ s, r: rolling(s.f, groupEnd(g).end) }));
  const keys = [[1, 'thRet1m'], [3, 'thRet3m'], [6, 'thRet6m'], [12, 'thRet1y'], [36, 'thRet3y'], [60, 'thRet5y']];
  const rb = k => { const vs = rol.map(x => x.r[k]).filter(v => v !== null && v !== undefined); return vs.length ? Math.max(...vs) : null; };
  $('tRoll').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th>${keys.map(k => `<th>${T()[k[1]]}</th>`).join('')}<th>${T().thR1avg}</th><th>${T().thR1min}</th><th>${T().thR1max}</th><th>${T().thR1pos}</th></tr></thead><tbody>`
    + rol.map(x => `<tr>${nm(x.s)}${keys.map(k => cell(x.r[k[0]] ?? null, v => pct(v, 1).replace(' %', '%'), rb(k[0]))).join('')}${x.r.r1 ? `<td>${pct(x.r.r1.avg, 1).replace(' %', '%')}</td><td>${pct(x.r.r1.min, 1).replace(' %', '%')}</td><td>${pct(x.r.r1.max, 1).replace(' %', '%')}</td><td>${num(x.r.r1.pos, 0)}%</td>` : '<td class="na">–</td>'.repeat(4)}</tr>`).join('') + '</tbody>';

  renderQuartilesByPeriod(g); renderHeatmap(g); renderAdvanced(g, rng, all);
}
function renderQuartilesByPeriod(g) {
  setCap('tQP', T().capQP(iso(groupEnd(g).end), iso(rangeAt(g, 'max').anchor)));
  const ranks = {}; PERIOD_IDS.forEach(per => { const rng = rangeAt(g, per); ranks[per] = rankOf(g.funds.map(f => ({ key: f.provider, v: retOf(g, f.provider, rng) }))); });
  $('tQP').innerHTML = `<thead><tr><th></th>${PERIOD_IDS.map(per => `<th>${T().periods[per]}</th>`).join('')}</tr></thead><tbody>`
    + marketProvs().filter(p => g.funds.some(f => f.provider === p.id)).map(p => `<tr><td class="name"><span class="sw" style="background:${colorOf(p.id)}"></span>${p.label}</td>${PERIOD_IDS.map(per => { const r = ranks[per], q = quartileOf(r.map.get(p.id), r.n); return q ? `<td class="q${q}" title="${r.map.get(p.id)}/${r.n}">Q${q}</td>` : '<td class="na">–</td>'; }).join('')}</tr>`).join('') + '</tbody>';
}
function heatColor(v) {
  const t = Math.min(1, Math.abs(v) / 6);
  return v >= 0 ? `hsl(135,45%,${92 - 37 * t}%)` : `hsl(5,75%,${92 - 27 * t}%)`;
}
function renderHeatmap(g) {
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
function renderAdvanced(g, rng, all) {
  $('btnAdv').setAttribute('aria-pressed', P.adv); $('adv').hidden = !P.adv; $('rf').value = P.rf;
  if (!P.adv) return;
  setCap('tAdv', T().capAdv(iso(rng.anchor), iso(rng.end)));
  $('lblRf').textContent = T().rf; $('nAdv').textContent = T().nAdv;
  const rows = all.map(s => ({ s, a: advStats(s.f, rng, P.rf) })).filter(x => x.a);
  const d = x => x ? `${fmtP(x.v, 2)} <span class="na">${iso(x.d)}</span>` : '–', y = x => x ? `${fmtP(x.v, 1)} <span class="na">${x.y}</span>` : '–';
  const m = x => x ? `${fmtP(x.v, 2)} <span class="na">${iso(x.d).slice(0, 7)}</span>` : '–';
  $('tAdv').innerHTML = `<thead><tr><th style="text-align:left">${T().thFund}</th><th>${T().thAnn}</th>${th(T().thVol, 'vol')}${th(T().thSharpe, 'sharpe')}${th(T().thBestD, 'bestworst')}<th>${T().thWorstD}</th><th>${T().thBestM}</th><th>${T().thWorstM}</th><th>${T().thBestY}</th><th>${T().thWorstY}</th>${th(T().thPosM, 'posm')}</tr></thead><tbody>`
    + rows.map(({ s, a }) => `<tr><td class="name"><span class="sw" style="background:${colorOf(s.f.provider)}"></span>${labelOf(s.f.provider)}</td><td>${a.ann === null ? '–' : fmtP(a.ann, 1)}</td><td>${a.vol === null ? '–' : num(a.vol, 1) + ' %'}</td><td>${a.sharpe === null ? '–' : num(a.sharpe, 2)}</td><td>${d(a.bestD)}</td><td>${d(a.worstD)}</td><td>${m(a.bestM)}</td><td>${m(a.worstM)}</td><td>${y(a.bestY)}</td><td>${y(a.worstY)}</td><td>${a.posM === null ? '–' : num(a.posM, 0) + '%'}</td></tr>`).join('') + '</tbody>';
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
async function exportXlsx() {
  const btn = $('btnXlsx'); btn.textContent = T().xlsxBusy; btn.disabled = true;
  try {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
    const wb = XLSX.utils.book_new(), g = byId(P.group);
    const info = [[T().siteTitle], [T().updated, DATA.generated], [T().dataUntil, iso(Math.max(...DATA.groups.map(x => groupEnd(x).end)))], [T().period, periodText()], [T().group, groupLabel(g)], [], [T().foot]];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(info), 'Info');
    const sheets = [['Summary', 'tSum'], ['Return', 'tRet'], ['Rank', 'tRank'], ['Quartile', 'tQ'], ['Overall ranking', 'tOv'], ['Metrics', 'tMetrics'], ['Calendar years', 'tCal'], ['Rolling', 'tRoll'], ['Quartile by period', 'tQP'], ['Monthly heat map', 'tHm']];
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
function resetZoom() { P.zoom = null; }
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
  $('hmProv').addEventListener('change', e => { P.hmProv = e.target.value; saveState(); renderHeatmap(byId(P.group)); });
  $('ovH').addEventListener('change', e => { P.ovH = e.target.value; saveState(); renderOverall(); });
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
  $('resetZoom').addEventListener('click', () => { resetZoom(); drawChart(); });
  $('btnEvents').addEventListener('click', () => { P.events = !P.events; $('btnEvents').setAttribute('aria-pressed', P.events); drawChart(); });
  $('btnPng').addEventListener('click', downloadPng);
  $('btnAdv').addEventListener('click', () => { P.adv = !P.adv; saveState(); renderFunds(); });
  $('rf').addEventListener('input', e => { const v = parseFloat(e.target.value); if (isFinite(v)) { P.rf = v; saveState(); renderAdvanced(byId(P.group), rangeFor(byId(P.group), true), byId(P.group).funds.filter(f => P.provs.has(f.provider)).map(f => fundStats(f, rangeFor(byId(P.group), true))).filter(Boolean).sort((a, b) => (b.ret ?? -1e9) - (a.ret ?? -1e9))); } });
  $('btnXlsx').addEventListener('click', exportXlsx);
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
    pop.textContent = T().info[b.dataset.k]; pop.dataset.k = b.dataset.k; pop._b = b; pop.style.display = 'block';
    const r = b.getBoundingClientRect(), w = pop.offsetWidth;
    pop.style.left = Math.max(8, Math.min(r.left + scrollX - 8, scrollX + document.documentElement.clientWidth - w - 8)) + 'px'; pop.style.top = (r.bottom + scrollY + 6) + 'px';
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('pop').style.display = 'none'; });
}
function buildCalOptions() {                          // tik pilni ketvirčiai / metai, kurių pabaiga yra duomenų ribose
  const y1 = new Date(LATEST * DAY).getUTCFullYear(), y0 = new Date(EARLIEST * DAY).getUTCFullYear(), qs = [], ys = [];
  for (let y = y1; y >= y0; y--) {
    for (let q = 4; q >= 1; q--) { const e = Math.round(Date.UTC(y, q * 3, 0) / DAY), st = Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY); if (e <= LATEST && st >= EARLIEST) qs.push(`q:${y}-${q}`); }
    const e = Math.round(Date.UTC(y, 11, 31) / DAY), st = Math.round(Date.UTC(y - 1, 11, 31) / DAY); if (e <= LATEST && st >= EARLIEST) ys.push(`y:${y}`);
  }
  return { q: qs, y: ys };
}
const CAL_OPTS = buildCalOptions();
function syncCalSelects() {
  $('periods').querySelectorAll('select.segsel').forEach(sel => {
    const k = sel.dataset.kind, active = P.period.startsWith(k + ':');
    sel.innerHTML = `<option value="">${k === 'q' ? T().qPlace : T().yPlace}</option>` + CAL_OPTS[k].map(id => `<option value="${id}">${periodLabel(id)}</option>`).join('');
    sel.value = active ? P.period : ''; sel.classList.toggle('active', active);
  });
}
function syncChips() { document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', P.provs.has(c.dataset.id))); }
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
  const sel = $('group'), cur = P.group; sel.innerHTML = DATA.groups.map(g => `<option value="${g.id}">${groupLabel(g)}</option>`).join(''); sel.value = cur;
  $('foot').textContent = T().foot;
  $('btnShare').textContent = T().share; $('btnXlsx').textContent = T().xlsx; $('btnPrint').textContent = T().print;
  $('btnEvents').textContent = T().eventsBtn; $('evInfo').innerHTML = ik('events'); $('resetZoom').textContent = T().resetZoom; $('btnPng').textContent = T().png; $('zoomHint').textContent = T().zoomHint;
  $('btnAdv').innerHTML = T().advBtn;
  $('sub').textContent = `${T().dataUntil} ${iso(Math.max(...DATA.groups.map(g => groupEnd(g).end)))} · ${T().updated} ${DATA.generated}`;
  syncSumWin(); syncView();
}
function syncAll() {
  $('periods').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === P.period));
  syncCalSelects();
  $('btnEvents').setAttribute('aria-pressed', P.events);
  $('printMeta').textContent = `${T().siteTitle} · ${groupLabel(byId(P.group))} · ${periodText()} · ${T().updated} ${DATA.generated}`;
  renderSummary(); renderMarket(); renderFunds();
}
buildControls(); syncChips();
renderHeader('performance', () => { labelControls(); syncAll(); });
document.querySelector('#top .top-tools').prepend($('actions'));   // veiksmų mygtukai – antraštėje, filtrų juosta lieka vienoje eilutėje
labelControls();
$('from').value = P.from; $('to').value = P.to;
syncAll();
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => chartState && drawChart(), 120); });
