/* „Kelias į pensiją“: vieno dalyvio kaupimas nuo pirmos įmokos iki šiandien (savininko Excel modelis).
   Kiekviena eilutė = Sodros pervedimo data (arba fondo keitimas). Įmoka = atlyginimas × tarifas (arba fiksuota suma); už ją perkami
   fondo vienetai tos dienos vieneto verte; sukaupta suma = vienetai × vieneto vertė.
   II pakopa – nuo gyvenimo ciklo fondų pradžios (2019-01): dalyvio įmoka + valstybės paskata. III pakopa – nuo fondo pradžios:
   tik dalyvio įmokos, tomis pačiomis Sodros datomis. Duomenys: data.js (II pakopa), data_journey3.js (III pakopa), data_journey.js (lentelės). */
const MGRS = ['SEB', 'SWEDBANK', 'ARTEA', 'LUMINOR', 'ALLIANZ', 'GOINDEX'];
const MLABEL = { ALLIANZ: 'Allianz', ARTEA: 'Artea', GOINDEX: 'Goindex', LUMINOR: 'Luminor', SEB: 'SEB', SWEDBANK: 'Swedbank' };
const GRPS = ['1961-1967', '1968-1974', '1975-1981', '1982-1988', '1989-1995', '1996-2002', '2003-2009'];
const LC_START = dayOf('2019-01-02');                                // gyvenimo ciklo fondų pradžia
const SRC = ['v', 'd', 'r'];                                         // valstybė, dalyvis, grąža
const SCOL = { v: 'var(--s1)', d: 'var(--s6)', r: 'var(--s5)' };
const PAYS = ['avg', 'mma', '50', '150', '200', '300'];

addStrings({
  navJourney: 'Retirement journey',
  inPl: 'Pillar', pl2: 'II pillar', pl3: 'III pillar', plBoth: 'II + III', plBothL: 'II and III pillars',
  inBirth: 'Born', inStart: 'Started saving', inPay: 'Salary', inRate: 'Contribution rate', rMax: 'Maximum (3 %)', rGrad: 'Gradual',
  inMgr: 'Manager', inFund: 'Fund', fund2Auto: 'Life-cycle fund for the birth year', inC3: 'Own contribution', c3pct: '% of gross salary', c3eur: '€ per month', inAsof: 'Data until',
  pay: { avg: 'Average', mma: 'Minimum (MMA)', 50: '50 % of average', 150: '150 % of average', 200: '200 % of average', 300: '300 % of average' },
  payLong: { avg: 'the national average salary', mma: 'the minimum monthly wage (MMA)' }, payPct: p => `${p} % of the national average salary`,
  cat: { bond: 'Bond funds', mixed: 'Mixed funds', equity: 'Equity funds' },
  sumTitle: 'From the first contribution to today', incTitle: 'Income if retiring this year',
  kAssets: 'Accumulated pension assets', kContrib: 'Contributions (nominal)', kReal: 'Contributions in today’s prices', kGainE: 'Growth after inflation, €', kGainP: 'Growth after inflation, %',
  kState: y => `State pension (${y})`, kRr: 'Replacement rate without savings', kAnn: 'Annuity, € / month', kAddRr: 'Extra replacement rate from savings', kTotal: 'Total monthly pension',
  kNet: y => `Net salary (${y})`, kSal: 'Assets in net salaries', kYears: 'Years the annuity would cover', kRrTot: 'Total replacement rate',
  cmpTitle: 'Average vs minimum wage, II vs III pillar', cmpLead: 'The same person (birth year, start, data date) in six cases. II pillar: 3 % of gross salary plus the state incentive, from 2019. III pillar: own contributions only, from the chosen III pillar fund’s start. II + III: both together, each from its own start.',
  cmpH: ['Case', 'Since', 'Own contribution, € / month', 'Of net salary', 'Own contributions', 'State', 'Assets', 'Growth after inflation', 'Annuity, € / month', 'Extra replacement rate'],
  cmpNote: 'Own contribution = the latest monthly contribution; “of net salary” = that ÷ the net salary of the same year (average and minimum wage, gross and net: Statistics Lithuania). The II pillar 3 % is always calculated from gross salary. Bold = the case shown above.',
  chTitle: 'How the assets grew', chMeta: 'Accumulated assets by source, €', shMeta: 'Where the money came from',
  srcName: { s: 'Sodra', v: 'State', d: 'Participant', r: 'Investment return' }, value: 'Assets',
  tbTitle: 'Calculation', tbLead: 'Each row is a Sodra transfer date (or a fund change, highlighted). The Excel file has every row with formulas.',
  tbYear: 'By year', tbAll: 'All rows', tbLeadBoth: 'II and III pillar by year. The Excel file has a separate calculation sheet for each pillar with every row and formula, and a summary that adds them up.',
  th: { date: 'Date', fund: 'Fund', wage: 'Gross salary', rs: 'Sodra %', cs: 'Sodra €', ss: 'Sodra Σ', rv: 'State €/mo', rd: 'Particip. %', cv: 'State €', cd: 'Particip. €', ct: 'Contribution €',
    price: 'Unit value €', bought: 'Units bought', units: 'Units total', val: 'Assets €', sv: 'State Σ', sd: 'Particip. Σ', st: 'Contributions Σ', ret: 'Return €', retp: 'Return %',
    ann: 'Annuity €/mo', pen: 'Avg pension', net: 'Net salary', tot: 'Pension with savings', rr0: 'Repl. rate without', rr1: 'Repl. rate with', rrd: 'Extra repl. rate',
    cpi: 'CPI', real: 'Contribution in today’s prices', gainE: 'Real growth €', gainP: 'Real growth %', year: 'Year', yc: 'Contributions in year €', ye: 'Assets at year end €' },
  swRow: (a, b) => `Fund change: ${a} → ${b}`, quarter: '×3 mo.',
  estNote: e => `Estimates (no official figure yet, the latest known one is used): ${e}.`,
  story: x => [`This participant began saving in the ${x.plName} in ${x.start}, at the age of ${x.ageStart}. Earning ${x.payL}, they have been saving for ${x.years} years. On ${x.date} the accumulated assets are ${x.assets} €, while all contributions in today’s prices are worth ${x.real} €. After inflation the assets ${x.gainP >= 0 ? 'have grown' : 'have shrunk'} by ${x.gainPs} in real terms.`,
    `The participant’s own contribution is ${x.own} € a month${x.ownNet ? `, ${x.ownNet} of the net salary` : ''}. ${x.retShare >= x.maxShare ? 'Investment returns make up the largest part of the assets' : 'The largest part of the assets comes from ' + (x.maxKey === 'd' ? 'own contributions' : 'the state')} (returns: ${x.retPs}).`,
    `If they retired today, the total monthly income would be ${x.total} € – ${x.rr1} of the net salary. The assets equal ${x.sal} monthly net salaries.`],
  prof: x => [`<b>Born</b> ${x.birth}`, `<b>Started saving</b> ${x.start}, at ${x.ageStart}`, `<b>Retirement</b> ${x.ret}, at 65 (${x.left} years to go)`, `<b>Earnings</b> ${x.payL}`, `<b>Contribution</b> ${x.rateL}`, `<b>Fund path</b> ${x.path}`],
  ix: { title: 'Compared with world equities', lead: 'What if the same contributions, on the same dates, had gone into a world equity index instead of the pension fund?',
    meta: 'Assets, € (the fund vs the same contributions in an index)', fund: 'This pension path', h: ['', 'Assets', 'Return, €', 'Return, %', 'Annual return (IRR)', 'Difference vs fund'],
    note: 'Indexes have no fees or taxes; the fund unit values are already net of fees. Pension funds also hold bonds, so in rising markets they usually lag equities.' },
  ann: { h: ['Sodra annuity type', '€ / month', 'Per 1000 €', 'How it works'], std: 'Standard annuity', inh: 'Inheritable standard annuity', def: 'Deferred annuity',
    stdD: 'Paid for life; the highest monthly amount; not inherited.', inhD: 'Paid for life; if the person dies before 85, heirs get the payments due until 85.',
    defD: s => `${s} of the assets buy an annuity paid from 85; until then the fund pays the rest as periodic payments (shown: rest ÷ months until 85, without returns).`,
    defA: 'from 85', defP: 'until 85',
    note: (lm, fa, x) => `2026 limits: with assets below ${lm} € the whole sum may be taken as a lump sum; above ${fa} € the part above the limit may be taken out. ${x}` },
  grid: { title: 'Replacement rate and assets over time', lead: 'The same participant day by day: how much savings add to the pension and how the assets grew. Charts follow the owner’s Excel dashboard.',
    rrPct: 'Replacement rate without and with savings, %', without: 'Without savings', with: 'With savings', addPct: 'Extra replacement rate, %', assets: 'Accumulated pension assets, €',
    ret: 'Investment return, %', rrEur: 'Pension without and with savings, €', avgPen: 'Average old-age pension', penWith: 'Pension with savings', addEur: 'Extra pension from savings (annuity), €',
    assetsC: 'Assets and contributions, €', own: 'Own contributions', allC: 'All contributions', na: 'No data for this period' },
  accL: 'Possible inaccuracies: ', acc: {"sum": "One model participant: the chosen salary level for the whole year, a contribution every month without breaks, no fund changes or withdrawals. Units are bought at the unit value of the Sodra transfer date; a fund may credit them 1–2 working days later. If the CPI for a month is not published yet, the latest month is used.", "inc": "The state pension is the average of all old-age pensioners, not this person’s; if the current year is not published yet, the latest year is used. The annuity is our model of Sodra’s pricing (about ±1 %), with 2026 conditions and age 65 for every birth year; future conditions may change. Net salary = the national average for the chosen level.", "cmp": "Same limits as the whole page: one model participant, official averages, no breaks in contributions.", "both": "Same limits as the whole page. III pillar: no tax relief, employer contributions or contribution fees.", "ix": "Indexes have no fees, trading costs or taxes, and S&P 500 is converted at the ECB rate, so a real investor would get somewhat less.", "grid": "Uses the same averages and annuity model as “Income”; years without official data use the latest known value.", "chart": "Same model as the whole page.", "tbl": "Contributions use the annual average salary, not each month’s; the state incentive is the fixed amount for the year. Sodra dates: 2004–2025 checked against the owner’s list, later ones from sodra.lt."},
  src: {"title": "Sources, assumptions and possible inaccuracies", "lead": "We cannot be 100 % accurate, but we can be 100 % open. Every number on this page comes from the sources below and the assumptions listed here. The Excel file shows every formula, and the code is public on <a href=\"https://github.com/VytisCode/pension-fund-tracker\" target=\"_blank\" rel=\"noopener\">GitHub</a>.", "g": [["Sources", ["II pillar unit values: the websites of the six managers (SEB, Swedbank, Artea, Luminor, Goindex, Allianz), collected every day. Unit values are published after management fees.", "III pillar unit values: the managers’ websites.", "Sodra transfer dates: <a href=\"https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija\" target=\"_blank\" rel=\"noopener\">sodra.lt</a>; 2004–2025 checked against the owner’s list.", "Contribution rates and the state incentive: the Law on Pension Accumulation.", "Average salary (gross and net), minimum monthly wage and average old-age pension: State Data Agency (<a href=\"https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai\" target=\"_blank\" rel=\"noopener\">osp.stat.gov.lt</a>); the latest pension figures: <a href=\"https://www.sodra.lt/statistika/pagrindiniai-socialiniai-rodikliai\" target=\"_blank\" rel=\"noopener\">Sodra statistics</a>.", "Consumer price index (CPI, 2025 = 100): State Data Agency, table S7R330, updated automatically each month.", "Annuity: Sodra’s <a href=\"https://www.sodra.lt/skaiciuokles/pensiju-anuitetu-skaiciuokle\" target=\"_blank\" rel=\"noopener\">annuity calculator</a> (its example), the Sodra chief actuary’s 2025 report (life expectancy at 65), the annuity methodology (1 % return, 2.5 % fee) and the 2026 limits.", "World equities: MSCI (ACWI and World Net Return in EUR), S&P 500 Total Return (Yahoo Finance) and the ECB EUR/USD rate.", "Market insights: managers’ daily assets and Bank of Lithuania fund data (quarterly reports, reform payouts)."]], ["Assumptions", ["One model participant who earns the national average (or the chosen level) every month of the year and never stops contributing.", "II pillar from 2019 (the start of life-cycle funds); earlier savings in the old funds are not included.", "Fund: the chosen manager’s life-cycle fund for the birth year, or the specific fund chosen. If that fund did not exist yet: the nearest older group, then SEB.", "II pillar contribution: 3 % of gross salary plus the state incentive (or the gradual path). III pillar: own contribution only, without tax relief, employer contributions or contribution fees.", "Each contribution is invested on the Sodra transfer date at that day’s unit value; until 2010 transfers were quarterly.", "Fees are already in the unit values, so nothing more is deducted. No taxes, withdrawals, fund changes or 2026 reform exits.", "Retirement at 65; the annuity uses 2026 Sodra conditions.", "Values in today’s prices use the CPI. If an official figure is not published yet, the latest known one is used and listed under “Estimates”."]], ["Why the numbers can differ from reality", ["A real person’s salary, breaks in work and payment dates differ, so their own amount will be different.", "Funds may credit units 1–2 working days after the Sodra transfer date.", "Salary is the annual average, so the timing of contributions within the year is approximate.", "The annuity is our model (about ±1 % from Sodra’s calculator) and future conditions may change.", "The latest year’s pension, salary or CPI may be an estimate until it is published.", "Market insights: Swedbank and Luminor assets before 2026 come from Bank of Lithuania quarterly data, so their monthly figures are estimates.", "Unit values are collected automatically and checked (fresh date, no unusual jump), but a source can still publish an error."]]]}, srcLink: 'Sources and assumptions',
  xls: 'Excel', xlsTip: 'Download the calculation as Excel: every row, the formulas and the input tables',
  xSheets: ['Calculation', 'Inputs', 'Summary'], xIn: ['Contribution rates, %', 'Average salary, €', 'Average old-age pension, €', 'State incentive, € / month', 'CPI', 'Minimum monthly wage, €'], xLatestCpi: 'Latest CPI (for contributions in today’s prices)',
  info: {
    sum: 'Accumulated assets = units held × unit value on the “Data until” date.\nContributions (nominal) = sum of all contributions (state + participant).\nContributions in today’s prices = each contribution × CPI(latest month) ÷ CPI(contribution month).\nGrowth after inflation = assets − contributions in today’s prices; % = that ÷ contributions in today’s prices.\nUnit values are published net of management fees, so fees are already included.',
    inc: 'State pension = average old-age pension of the latest year published by Statistics Lithuania (not this participant’s own state pension).\nAnnuity = Sodra standard pension annuity at 65: (assets − 2.5 % fee) ÷ (12 × annuity factor). The factor uses Sodra’s pricing assumptions (1.00 % return, monthly payments, 50 % women from 2026, life expectancy at 65: men 18.01, women 23.25 years – Sodra chief actuary’s 2025 report) and is matched to Sodra’s own example (15 000 € → 67.93 € a month). Result: 4.53 € a month per 1000 €. Sodra does not publish its mortality table, so the result can differ from the calculator by about 1 %. For the III pillar this is only a comparable estimate (III pillar money is paid by the fund or an insurer).\nReplacement rate = pension ÷ the participant’s net salary of the year; extra replacement rate = annuity ÷ net salary.\nYears covered = assets ÷ (annuity × 12). ',
    cmp: 'Each case is calculated with the same model as the page. II pillar: from 2019-01 (start of life-cycle funds), the chosen II pillar fund (by default the manager’s life-cycle fund for the birth year). III pillar: the chosen III pillar fund and own contribution, from the chosen start (not before the fund started).',
    both: 'II + III: the II and III pillar are calculated separately, each from its own start date and with its own contributions (II: 3 % + state incentive from 2019; III: own contribution only); the summary adds them up. The annuity is calculated from the combined assets.',
    ix: 'Each contribution (state + participant, the amount and date from the calculation table) buys index units at that day’s index value; assets = units × the index value on each day. Indexes: MSCI ACWI and MSCI World Net Return in EUR (MSCI), S&P 500 Total Return converted to EUR at the ECB rate. Annual return (IRR) = the money-weighted return that turns the contributions into today’s assets (the same method for the fund and for the indexes). Index values have no fees.',
    grid: 'Daily values: assets = units held × that day’s unit value (units change only on transfer dates). Investment return % = (assets − contributions) ÷ contributions. Replacement rate without savings = average old-age pension of the year ÷ the participant’s net salary of the year; with savings = (pension + annuity) ÷ net salary; extra = annuity ÷ net salary. The annuity is calculated as in the “Income” block. Pension data starts in 2018.',
    chart: 'Stacked areas = cumulative contributions by source; the green area = investment return (assets − contributions). If the return is negative the line drops into the contributions.',
    tbl: 'Since 2019 Sodra no longer diverts part of social insurance (until 2018 it did: 2–5.5 %), so its column is 0. II pillar contribution = gross salary × 3 % (gradual path: 1.8 % in 2019 rising to 3 % in 2023) + the state incentive (a fixed € amount a month, the lower one in the gradual path). III pillar contribution = gross salary × chosen % or a fixed € amount. Until 2010 Sodra transferred quarterly, so on those dates 3 months of contributions are invested. Units bought = contribution ÷ unit value on the transfer date. Assets = units total × unit value. A fund change converts the assets into the new fund’s units at that day’s unit values.',
  },
  foot: 'Sources: Sodra transfer dates, contribution rates (laws), Statistics Lithuania (average and minimum salaries, pensions, CPI), Sodra (annuity), providers’ unit values; full list under “Sources, assumptions and possible inaccuracies”. Model of one participant; for information only, not investment advice.',
}, {
  navJourney: 'Kelias į pensiją',
  inPl: 'Pakopa', pl2: 'II pakopa', pl3: 'III pakopa', plBoth: 'II + III', plBothL: 'II ir III pakopos',
  inBirth: 'Gimimo metai', inStart: 'Kaupti pradėjo', inPay: 'Atlyginimas', inRate: 'Įmokų tarifas', rMax: 'Maksimalus (3 %)', rGrad: 'Laipsniškas',
  inMgr: 'Valdytojas', inFund: 'Fondas', fund2Auto: 'Gyvenimo ciklo fondas pagal gimimo metus', inC3: 'Savo įmoka', c3pct: '% bruto atlyginimo', c3eur: '€ per mėn.', inAsof: 'Duomenys iki',
  pay: { avg: 'Vidutinis', mma: 'Minimalus (MMA)', 50: '50 % vidutinio', 150: '150 % vidutinio', 200: '200 % vidutinio', 300: '300 % vidutinio' },
  payLong: { avg: 'vidutinį šalies atlyginimą', mma: 'minimalią mėnesinę algą (MMA)' }, payPct: p => `${p} % vidutinio šalies atlyginimo`,
  cat: { bond: 'Obligacijų fondai', mixed: 'Mišraus investavimo fondai', equity: 'Akcijų fondai' },
  sumTitle: 'Nuo pirmos įmokos iki šiandien', incTitle: 'Pajamos išėjus į pensiją šiemet',
  kAssets: 'Sukauptas pensijų turtas', kContrib: 'Įmokų suma (nominali)', kReal: 'Įmokų perkamoji vertė šiandien', kGainE: 'Pokytis realia verte, €', kGainP: 'Pokytis realia verte, %',
  kState: y => `Valstybinė pensija (${y})`, kRr: 'Pakeitimo norma be kaupimo', kAnn: 'Anuitetas, € / mėn.', kAddRr: 'Papildoma pakeitimo norma dėl kaupimo', kTotal: 'Bendra mėnesio išmoka',
  kNet: y => `Neto atlyginimas (${y})`, kSal: 'Sukauptų atlyginimų skaičius', kYears: 'Metų, kuriems užteks anuiteto', kRrTot: 'Bendra pakeitimo norma',
  cmpTitle: 'Vidutinis ir minimalus atlyginimas, II ir III pakopa', cmpLead: 'Tas pats žmogus (gimimo metai, pradžia, duomenų data) šešiais atvejais. II pakopa: 3 % bruto atlyginimo ir valstybės paskata, nuo 2019 m. III pakopa: tik savo įmokos, nuo pasirinkto III pakopos fondo pradžios. II + III: abi pakopos kartu, kiekviena nuo savo pradžios.',
  cmpH: ['Atvejis', 'Nuo', 'Savo įmoka, € / mėn.', 'Neto atlyginimo dalis', 'Savo įmokos', 'Valstybė', 'Sukaupta', 'Pokytis realia verte', 'Anuitetas, € / mėn.', 'Papildoma pakeitimo norma'],
  cmpNote: 'Savo įmoka = paskutinė mėnesio įmoka; „neto atlyginimo dalis“ = ta įmoka ÷ tų metų neto atlyginimas (vidutinis ir minimalus atlyginimas, bruto ir neto – Statistikos departamentas). II pakopos 3 % visada skaičiuojami nuo bruto atlyginimo. Paryškinta – viršuje rodomas atvejis.',
  chTitle: 'Kaip augo turtas', chMeta: 'Sukauptas turtas pagal šaltinį, €', shMeta: 'Turto formavimo šaltiniai',
  srcName: { s: 'Sodra', v: 'Valstybė', d: 'Dalyvis', r: 'Investicijų grąža' }, value: 'Turtas',
  tbTitle: 'Skaičiavimas', tbLead: 'Kiekviena eilutė – Sodros pervedimo data (arba fondo keitimas, paryškinta). Excel faile – visos eilutės su formulėmis.',
  tbYear: 'Pagal metus', tbAll: 'Visos eilutės', tbLeadBoth: 'II ir III pakopa pagal metus. Excel faile kiekviena pakopa turi atskirą skaičiavimo lapą su visomis eilutėmis ir formulėmis, o suvestinė jas sudeda.',
  th: { date: 'Data', fund: 'Fondas', wage: 'Bruto atlyginimas', rs: 'Sodra %', cs: 'Sodra €', ss: 'Sodra Σ', rv: 'Valstybė €/mėn.', rd: 'Dalyvis %', cv: 'Valstybė €', cd: 'Dalyvis €', ct: 'Įmoka €',
    price: 'Vieneto vertė €', bought: 'Įsigyta vnt.', units: 'Vnt. iš viso', val: 'Sukaupta €', sv: 'Valstybė Σ', sd: 'Dalyvis Σ', st: 'Įmokos Σ', ret: 'Grąža €', retp: 'Grąža %',
    ann: 'Anuitetas €/mėn.', pen: 'Vid. pensija', net: 'Neto atlyginimas', tot: 'Pensija su kaupimu', rr0: 'Pakeitimo norma be kaupimo', rr1: 'Pakeitimo norma su kaupimu', rrd: 'Papildoma pakeitimo norma',
    cpi: 'VKI', real: 'Įmokos vertė šiandien', gainE: 'Pokytis realia verte €', gainP: 'Pokytis realia verte %', year: 'Metai', yc: 'Įmokos per metus €', ye: 'Turtas metų pabaigoje €' },
  swRow: (a, b) => `Fondo keitimas: ${a} → ${b}`, quarter: '×3 mėn.',
  estNote: e => `Įverčiai (oficialaus skaičiaus dar nėra, naudojamas naujausias žinomas): ${e}.`,
  story: x => [`Šis dalyvis ${x.pl === 'both' ? 'II ir III pakopose' : x.pl + ' pakopoje'} pradėjo kaupti ${x.start} m., būdamas ${x.ageStart} m. Uždirbdamas ${x.payL}, jis kaupia jau ${x.years} m. ${x.date} jo sukauptas turtas siekia ${x.assets} €, o visų įmokų perkamoji vertė – ${x.real} €. Tai reiškia, kad atsižvelgus į infliaciją, jo turtas ${x.gainP >= 0 ? 'išaugo' : 'sumažėjo'} ${x.gainPs} realia verte.`,
    `Paties dalyvio įmoka – ${x.own} € per mėnesį${x.ownNet ? `, t. y. ${x.ownNet} jo neto atlyginimo` : ''}. ${x.retShare >= x.maxShare ? 'Didžiausią turto dalį sudaro investicijų grąža' : 'Didžiausia turto dalis – ' + (x.maxKey === 'd' ? 'paties dalyvio įmokos' : 'valstybės įmokos')} (grąža – ${x.retPs}).`,
    `Jei dalyvis išeitų į pensiją šiandien, bendros jo pajamos būtų ${x.total} € – tai ${x.rr1} jo neto atlyginimo. Sukauptas turtas prilygsta ${x.sal} neto atlyginimų.`],
  prof: x => [`<b>Gimimo metai</b> ${x.birth}`, `<b>Kaupti pradėjo</b> ${x.start} m., ${x.ageStart} m. amžiaus`, `<b>Pensija</b> ${x.ret} m., 65 m. (liko ${x.left} m.)`, `<b>Pajamos</b> ${x.payL}`, `<b>Įmoka</b> ${x.rateL}`, `<b>Fondų kelias</b> ${x.path}`],
  ix: { title: 'Palyginimas su pasaulio akcijomis', lead: 'Kas būtų, jei tos pačios įmokos tomis pačiomis dienomis būtų investuotos ne į pensijų fondą, o į pasaulio akcijų indeksą?',
    meta: 'Turtas, € (fondas ir tos pačios įmokos indekse)', fund: 'Šis pensijų kelias', h: ['', 'Sukaupta', 'Grąža, €', 'Grąža, %', 'Metinė grąža (IRR)', 'Skirtumas nuo fondo'],
    note: 'Indeksai be mokesčių; fondų vieneto vertės jau po valdymo mokesčių. Pensijų fondai turi ir obligacijų, todėl kylant rinkoms paprastai atsilieka nuo akcijų.' },
  ann: { h: ['Sodros anuiteto rūšis', '€ / mėn.', 'Už 1000 €', 'Kaip veikia'], std: 'Standartinis anuitetas', inh: 'Paveldimas standartinis anuitetas', def: 'Atidėtasis anuitetas',
    stdD: 'Mokamas iki gyvos galvos; didžiausia mėnesio išmoka; nepaveldimas.', inhD: 'Mokamas iki gyvos galvos; mirus iki 85 m., paveldėtojai gauna išmokas, priklausančias iki 85 m.',
    defD: s => `${s} turto perkamas anuitetas, mokamas nuo 85 m.; iki tol fondas likutį moka periodinėmis išmokomis (rodoma: likutis ÷ mėnesiai iki 85 m., be grąžos).`,
    defA: 'nuo 85 m.', defP: 'iki 85 m.',
    note: (lm, fa, x) => `2026 m. ribos: sukaupus mažiau nei ${lm} €, visą sumą galima atsiimti vienkartine išmoka; virš ${fa} € – ribą viršijančią dalį galima atsiimti. ${x}` },
  grid: { title: 'Pakeitimo norma ir turtas laike', lead: 'Tas pats dalyvis kiekvieną dieną: kiek kaupimas prideda prie pensijos ir kaip augo turtas. Grafikai – kaip savininko Excel suvestinėje.',
    rrPct: 'Pakeitimo normos be ir su kaupimu, %', without: 'Be kaupimo', with: 'Su kaupimu', addPct: 'Papildoma pakeitimo norma, %', assets: 'Sukauptas pensijų turtas, €',
    ret: 'Investicijų grąža, %', rrEur: 'Pensija be ir su kaupimu, €', avgPen: 'Vidutinė senatvės pensija', penWith: 'Pensija su kaupimu', addEur: 'Papildoma pensija iš kaupimo (anuitetas), €',
    assetsC: 'Sukauptas turtas ir įmokos, €', own: 'Dalyvio įmokos', allC: 'Visos įmokos', na: 'Šiam laikotarpiui duomenų nėra' },
  accL: 'Galimi netikslumai: ', acc: {"sum": "Modelis – vienas dalyvis: pasirinkto lygio atlyginimas visus metus, įmoka kiekvieną mėnesį be pertraukų, be fondo keitimų ir išmokų. Vienetai perkami Sodros pervedimo dienos verte; fondas juos gali įskaityti 1–2 darbo dienomis vėliau. Jei mėnesio VKI dar nepaskelbtas, naudojamas naujausias.", "inc": "Valstybinė pensija – visų senatvės pensininkų vidurkis, o ne šio žmogaus; jei šių metų skaičius dar nepaskelbtas, imami naujausi paskelbti metai. Anuitetas – mūsų Sodros kainodaros modelis (apie ±1 %), pagal 2026 m. sąlygas ir 65 m. amžių visiems gimimo metams; ateityje sąlygos gali keistis. Neto atlyginimas – pasirinkto lygio šalies vidurkis.", "cmp": "Tie patys apribojimai kaip visam puslapiui: vienas modelio dalyvis, oficialūs vidurkiai, įmokos be pertraukų.", "both": "Tie patys apribojimai kaip visam puslapiui. III pakopa: be GPM lengvatos, darbdavio įmokų ir įmokų mokesčių.", "ix": "Indeksai be mokesčių, sandorių kaštų ir mokesčių valstybei, o S&P 500 perskaičiuotas ECB kursu, todėl tikras investuotojas gautų šiek tiek mažiau.", "grid": "Naudojami tie patys vidurkiai ir anuiteto modelis kaip bloke „Pajamos“; metams be oficialių duomenų – naujausia žinoma reikšmė.", "chart": "Tas pats modelis kaip visam puslapiui.", "tbl": "Įmokos skaičiuojamos nuo metų vidutinio atlyginimo, o ne nuo kiekvieno mėnesio; valstybės paskata – fiksuota metų suma. Sodros datos: 2004–2025 m. sutikrintos su savininko sąrašu, vėlesnės – iš sodra.lt."},
  src: {"title": "Šaltiniai, prielaidos ir galimi netikslumai", "lead": "Būti 100 % tikslūs negalime, bet galime būti 100 % atviri. Visi šio puslapio skaičiai remiasi žemiau išvardytais šaltiniais ir prielaidomis. Excel faile matyti visos formulės, o kodas viešas <a href=\"https://github.com/VytisCode/pension-fund-tracker\" target=\"_blank\" rel=\"noopener\">GitHub</a> svetainėje.", "g": [["Šaltiniai", ["II pakopos fondų vieneto vertės: šešių valdytojų (SEB, Swedbank, Artea, Luminor, Goindex, Allianz) svetainės, renkamos kasdien. Vieneto vertės skelbiamos jau atskaičius valdymo mokesčius.", "III pakopos fondų vieneto vertės: valdytojų svetainės.", "Sodros įmokų pervedimo į fondus datos: <a href=\"https://www.sodra.lt/pensijos/papildomai-kaupiama-pensija/pagrindine-informacija\" target=\"_blank\" rel=\"noopener\">sodra.lt</a>; 2004–2025 m. sutikrintos su savininko sąrašu.", "Įmokų tarifai ir valstybės paskata: Pensijų kaupimo įstatymas.", "Vidutinis darbo užmokestis (bruto ir neto), minimali mėnesinė alga ir vidutinė senatvės pensija: Valstybės duomenų agentūra (<a href=\"https://osp.stat.gov.lt/pagrindiniai-salies-rodikliai\" target=\"_blank\" rel=\"noopener\">osp.stat.gov.lt</a>); naujausi pensijų duomenys: <a href=\"https://www.sodra.lt/statistika/pagrindiniai-socialiniai-rodikliai\" target=\"_blank\" rel=\"noopener\">Sodros statistika</a>.", "Vartotojų kainų indeksas (VKI, 2025 = 100): Valstybės duomenų agentūra, lentelė S7R330, atnaujinamas automatiškai kas mėnesį.", "Anuitetas: Sodros <a href=\"https://www.sodra.lt/skaiciuokles/pensiju-anuitetu-skaiciuokle\" target=\"_blank\" rel=\"noopener\">anuitetų skaičiuoklė</a> (jos pavyzdys), Sodros vyr. aktuaro 2025 m. ataskaita (tikėtina gyvenimo trukmė 65 m.), anuitetų apskaičiavimo metodika (1 % grąža, 2,5 % mokestis) ir 2026 m. ribos.", "Pasaulio akcijos: MSCI (ACWI ir World grynoji grąža eurais), S&P 500 su dividendais (Yahoo Finance) ir ECB EUR/USD kursas.", "Rinkos įžvalgos: valdytojų dienos turto duomenys ir Lietuvos banko fondų duomenys (ketvirtinės ataskaitos, reformos išmokos)."]], ["Prielaidos", ["Vienas modelio dalyvis, kuris kiekvieną metų mėnesį uždirba šalies vidurkį (arba pasirinktą lygį) ir niekada nenustoja mokėti įmokų.", "II pakopa skaičiuojama nuo 2019 m. (gyvenimo ciklo fondų pradžia); ankstesnis kaupimas senuosiuose fonduose neįtrauktas.", "Fondas: pasirinkto valdytojo gyvenimo ciklo fondas pagal gimimo metus arba pasirinktas konkretus fondas. Jei to fondo dar nebuvo: artimiausia vyresnė grupė, tada SEB.", "II pakopos įmoka: 3 % bruto atlyginimo ir valstybės paskata (arba laipsniškas tarifas). III pakopa: tik savo įmoka, be GPM lengvatos, darbdavio įmokų ir įmokų mokesčių.", "Kiekviena įmoka investuojama Sodros pervedimo dieną tos dienos vieneto verte; iki 2010 m. pervesta kas ketvirtį.", "Mokesčiai jau įskaičiuoti vieneto vertėje, todėl papildomai nieko neatimama. Be mokesčių valstybei, išmokų, fondo keitimų ir 2026 m. reformos išstojimų.", "Į pensiją išeinama 65 m.; anuitetas skaičiuojamas pagal 2026 m. Sodros sąlygas.", "Vertė šiandienos kainomis skaičiuojama pagal VKI. Jei oficialus skaičius dar nepaskelbtas, naudojamas naujausias žinomas ir jis nurodomas pastaboje „Įverčiai“."]], ["Kodėl skaičiai gali skirtis nuo tikrųjų", ["Tikro žmogaus atlyginimas, darbo pertraukos ir mokėjimo datos skiriasi, todėl jo suma bus kitokia.", "Fondai vienetus gali įskaityti 1–2 darbo dienomis po Sodros pervedimo dienos.", "Atlyginimas – metų vidurkis, todėl įmokų laikas metų viduje apytikslis.", "Anuitetas – mūsų modelis (apie ±1 % nuo Sodros skaičiuoklės), o ateities sąlygos gali keistis.", "Naujausių metų pensija, atlyginimas ar VKI gali būti įvertis, kol oficialiai nepaskelbti.", "Rinkos įžvalgos: Swedbank ir Luminor turtas iki 2026 m. imamas iš Lietuvos banko ketvirtinių duomenų, todėl jų mėnesio skaičiai yra įverčiai.", "Vieneto vertės renkamos automatiškai ir tikrinamos (šviežia data, be neįprasto šuolio), bet ir šaltinis gali paskelbti klaidą."]]]}, srcLink: 'Šaltiniai ir prielaidos',
  xls: 'Excel', xlsTip: 'Atsisiųsti skaičiavimą Excel faile: visos eilutės, formulės ir pradinės lentelės',
  xSheets: ['Skaičiavimas', 'Pradiniai duomenys', 'Suvestinė'], xIn: ['Įmokų tarifai, %', 'Vidutinis darbo užmokestis, €', 'Vidutinė senatvės pensija, €', 'Valstybės paskata, € / mėn.', 'VKI', 'Minimali mėnesinė alga, €'], xLatestCpi: 'Naujausias VKI (įmokų vertei šiandien)',
  info: {
    sum: 'Sukauptas turtas = turimų vienetų skaičius × vieneto vertė dieną „Duomenys iki“.\nĮmokų suma (nominali) = visų įmokų suma (valstybė + dalyvis).\nĮmokų perkamoji vertė šiandien = kiekviena įmoka × VKI(naujausias mėnuo) ÷ VKI(įmokos mėnuo).\nPokytis realia verte = turtas − įmokų perkamoji vertė; % = tas skirtumas ÷ įmokų perkamoji vertė.\nVieneto vertė skelbiama jau atskaičius valdymo mokesčius, todėl mokesčiai jau įskaičiuoti.',
    inc: 'Valstybinė pensija = Statistikos departamento paskelbta naujausių metų vidutinė senatvės pensija (ne šio dalyvio asmeninė).\nAnuitetas = Sodros standartinis pensijų anuitetas 65 m.: (turtas − 2,5 % mokestis) ÷ (12 × anuiteto koeficientas). Koeficientas apskaičiuotas pagal Sodros prielaidas (1,00 % grąža, išmokos kas mėnesį, nuo 2026 m. 50 % moterų, tikėtina gyvenimo trukmė 65 m.: vyrų 18,01, moterų 23,25 m. – Sodros vyr. aktuaro 2025 m. ataskaita) ir suderintas su Sodros pavyzdžiu (15 000 € → 67,93 € per mėn.). Gaunama 4,53 € per mėn. už 1000 €. Sodra savo mirtingumo lentelės neskelbia, todėl nuo skaičiuoklės rezultato gali skirtis apie 1 %. III pakopai – tik palyginamas įvertis (III pakopos lėšas išmoka fondas arba draudikas).\nPakeitimo norma = pensija ÷ dalyvio tų metų neto atlyginimas; papildoma pakeitimo norma = anuitetas ÷ neto atlyginimas.\nMetų skaičius = turtas ÷ (anuitetas × 12). ',
    cmp: 'Kiekvienas atvejis skaičiuojamas tuo pačiu modeliu kaip ir visas puslapis. II pakopa: nuo 2019-01 (gyvenimo ciklo fondų pradžia), pasirinktas II pakopos fondas (numatyta – valdytojo gyvenimo ciklo fondas pagal gimimo metus). III pakopa: pasirinktas III pakopos fondas ir savo įmoka, nuo pasirinktos pradžios (ne anksčiau nei fondas pradėjo veikti).',
    both: 'II + III: II ir III pakopos skaičiuojamos atskirai, kiekviena nuo savo pradžios datos ir su savo įmokomis (II: 3 % + valstybės paskata nuo 2019 m.; III: tik savo įmoka); suvestinėje jos sudedamos. Anuitetas skaičiuojamas nuo bendros sukauptos sumos.',
    ix: 'Kiekviena įmoka (valstybės + dalyvio, suma ir data – iš skaičiavimo lentelės) perka indekso vienetų tos dienos indekso verte; turtas = vienetai × kiekvienos dienos indekso vertė. Indeksai: MSCI ACWI ir MSCI World grynosios grąžos eurais (MSCI), S&P 500 su dividendais, perskaičiuotas į eurus pagal ECB kursą. Metinė grąža (IRR) = pinigais svertinė grąža, kuri įmokas paverčia šiandieniniu turtu (tas pats metodas fondui ir indeksams). Indeksai be mokesčių.',
    grid: 'Kasdienės reikšmės: turtas = turimi vienetai × tos dienos vieneto vertė (vienetų skaičius keičiasi tik pervedimo dienomis). Investicijų grąža % = (turtas − įmokos) ÷ įmokos. Pakeitimo norma be kaupimo = tų metų vidutinė senatvės pensija ÷ dalyvio tų metų neto atlyginimas; su kaupimu = (pensija + anuitetas) ÷ neto atlyginimas; papildoma = anuitetas ÷ neto atlyginimas. Anuitetas skaičiuojamas kaip bloke „Pajamos“. Pensijų duomenys – nuo 2018 m.',
    chart: 'Spalvotos sritys = sukauptos įmokos pagal šaltinį; žalia sritis = investicijų grąža (turtas − įmokos). Kai grąža neigiama, turto linija nusileidžia žemiau įmokų.',
    tbl: 'Nuo 2019 m. Sodra nebeperveda dalies socialinio draudimo įmokų (iki 2018 m. pervesdavo 2–5,5 %), todėl jos stulpelis lygus 0. II pakopos įmoka = bruto atlyginimas × 3 % (laipsniškai: 2019 m. 1,8 %, iki 2023 m. – 3 %) + valstybės paskata (fiksuota suma per mėnesį; laipsniškai didinant – mažesnė). III pakopos įmoka = bruto atlyginimas × pasirinkti % arba fiksuota suma eurais. Iki 2010 m. Sodra pervesdavo kas ketvirtį, todėl tomis datomis investuojama 3 mėnesių įmoka. Įsigyta vnt. = įmoka ÷ vieneto vertė pervedimo dieną. Sukaupta = vienetai × vieneto vertė. Keičiant fondą, turtas tos dienos vieneto vertėmis konvertuojamas į naujo fondo vienetus.',
  },
  foot: 'Šaltiniai: Sodros pervedimų datos, įmokų tarifai (įstatymai), Statistikos departamentas (vidutinis ir minimalus atlyginimas, pensijos, VKI), Sodra (anuitetas), bendrovių vieneto vertės; visas sąrašas – skiltyje „Šaltiniai, prielaidos ir galimi netikslumai“. Vieno dalyvio modelis; informacinė medžiaga, ne investavimo rekomendacija.',
});

const J = JDATA;
const LAST = Math.max(...DATA.groups.flatMap(g => g.funds.map(f => f.d[f.d.length - 1])));
/* III pakopos fondai: d0 + dienų skirtumai -> dienos */
const P3 = (typeof P3DATA !== 'undefined' ? P3DATA.groups : []).flatMap(g => g.funds.map(f => {
  const d = [f.d0]; f.dd.forEach(x => d.push(d[d.length - 1] + x));
  return { name: f.name, brand: f.brand, cat: g.id, d, v: f.v };
}));
const p3Fund = name => P3.find(f => f.name === name) || P3.find(f => f.name === 'SEB pensija 18+') || P3[0];
const ST = Object.assign({ pl: 'II', birth: 1984, start2: 2019, start3: 2004, pay: 'avg', rate: 'max', mgr: 'SEB', fund2: '', fund3: 'SEB pensija 18+', c3: 'pct', c3pct: 3, c3eur: 50, asof: '', tb: 'y' },
  (() => { try { const s = JSON.parse(localStorage.getItem('jrnstate2')) || {}; return s; } catch (e) { return {}; } })());
const save = () => { try { localStorage.setItem('jrnstate2', JSON.stringify(ST)); } catch (e) {} };
const eur = (x, p = 2) => num(x, p) + ' €';
const pc = (x, p = 2) => (x < 0 ? '−' : '') + num(Math.abs(x) * 100, p) + ' %';
const yearOf = d => new Date(d * DAY).getUTCFullYear();
const dots = d => iso(d).replace(/-/g, '.');

/* ---------- pradiniai duomenys ---------- */
const DATES = J.dates.map(([d, m]) => [dayOf(d), m]);
const RATES = J.rates.map(([d, s, v, p, g]) => ({ d: dayOf(d), s, v, p, g }));
const lcFund = (mgr, g) => { for (const gr of DATA.groups) for (const f of gr.funds) if (f.provider === mgr && gr.id === g) return f; return null; };
const mgrFunds = mgr => DATA.groups.flatMap(gr => gr.funds.filter(f => f.provider === mgr));   // valdytojo II pakopos fondai (gyvenimo ciklo + turto išsaugojimo)
const fund2Of = P => P.fund2 ? mgrFunds(P.mgr).find(f => f.name === P.fund2) || null : null;  // pasirinktas konkretus II pakopos fondas
const groupOf = y => GRPS.find(g => { const [a, b] = g.split('-').map(Number); return y >= a && y <= b; });
/* reikšmė pagal metus: oficiali arba naujausia žinoma (pažymima kaip įvertis) */
function byYear(tbl, y, est, what) {
  if (tbl[y] != null) return tbl[y];
  const ys = Object.keys(tbl).map(Number).filter(k => k <= y && tbl[k] != null);
  if (!ys.length) return null;
  const k = Math.max(...ys); if (est) est.add(`${what} ${y} = ${k}`); return tbl[k];
}
/* atlyginimas dienai: { g: bruto, n: neto (gali nebūti) } pagal pasirinktą lygį */
function wageAt(day, pay, est) {
  if (pay === 'mma') {          // oficiali metų vidutinė MMA (bruto, neto); neto dar nepaskelbtas – pagal naujausią neto ir bruto santykį
    const y = yearOf(day), m = byYear(J.minWage, y, est, 'MMA');
    if (m[1] != null || y < 2010) return { g: m[0], n: m[1] };
    const ky = Math.max(...Object.keys(J.minWage).map(Number).filter(k => J.minWage[k][1] != null)), k = J.minWage[ky];
    if (est) est.add(`${lang === 'lt' ? 'MMA neto' : 'Net MMA'} ${y} ≈ ${lang === 'lt' ? 'bruto' : 'gross'} × ${ky} ${lang === 'lt' ? 'neto ir bruto santykis' : 'net-to-gross ratio'}`);
    return { g: m[0], n: m[0] * k[1] / k[0] };
  }
  const w = byYear(J.wages, yearOf(day), est, T().th.wage), k = pay === 'avg' ? 1 : +pay / 100;
  return { g: w[0] * k, n: w[1] * k };
}
function incentive(y, grad, est) {
  const t = J.incentive[y];
  if (t) return grad ? t[1] : t[0];
  const w = J.wages[y - 2];      // nėra paskelbtos sumos: 1,5 % vidutinio bruto atlyginimo prieš 2 metus
  if (w) { est.add(`${T().srcName.v} ${y} ≈ 1,5 % × ${T().th.wage} ${y - 2}`); return Math.round(w[0] * 1.5) / 100; }
  return null;
}
function cpiAt(day, est) {
  const m = iso(day).slice(0, 7);
  if (J.cpi[m] != null) return J.cpi[m];
  const ks = Object.keys(J.cpi).filter(k => k <= m).sort();
  if (!ks.length) return null;
  const k = ks[ks.length - 1]; est.add(`${T().th.cpi} > ${k}: ${k}`); return J.cpi[k];
}
/* II pakopos fondas dienai: pasirinktas konkretus fondas arba (numatyta) pasirinkto valdytojo gimimo metų fondas. Jei jo dar nebuvo (Goindex iki 2022-08, 2003–2009 fondai iki 2025):
   artimiausia vyresnė grupė, tada SEB. */
function fundFor(day, P) {
  if (P.pl === 'III') { const f = p3Fund(P.fund3); return f.d[0] <= day ? { id: f.name, f } : null; }
  const f2 = fund2Of(P);
  if (f2) return f2.d[0] <= day ? { id: f2.name, f: f2 } : null;
  const gi = GRPS.indexOf(groupOf(P.birth));
  for (const m of [P.mgr, 'SEB']) for (let i = gi; i >= 0; i--) {
    const f = lcFund(m, GRPS[i]);
    if (f && f.d[0] <= day) return { id: f.name, f };
  }
  return null;
}
function priceAt(fd, day) {
  const s = fd.f, i = lastOnOrBefore(s, day);
  if (i >= 0) return [s.d[i], s.v[i]];
  return s.d[0] - day <= 7 ? [s.d[0], s.v[0]] : null;   // fondas pradėjo veikti vos po dienos
}
const startDayOf = P => {
  const s = dayOf(`${P.pl === 'II' ? P.start2 : P.start3}-01-01`);
  return P.pl === 'II' ? Math.max(s, LC_START, fund2Of(P)?.d[0] ?? 0) : Math.max(s, p3Fund(P.fund3).d[0]);
};

/* ---------- anuitetas ---------- */
function annuityOf(val, P, day) { return val / 1000 * J.annuity; }   // standartinis Sodros anuitetas 65 m. (žr. journey.py ANNUITY)

/* ---------- modelis ---------- */
function simulate(P) {
  if (P.pl !== 'both') return simulate1(P);
  const a = simulate1(Object.assign({}, P, { pl: 'II' })), b = simulate1(Object.assign({}, P, { pl: 'III' }));
  return a && b ? combine(a, b, P) : a || b;
}
/* Abi pakopos: kiekvienai datai (bet kurios pakopos eilutei) sudedamos abiejų pakopų sumos.
   Pakopos turtas tą dieną = jos vienetai × tos dienos vieneto vertė; sukauptos įmokos – paskutinės eilutės iki tos dienos. */
function combine(a, b, P) {
  const parts = [a, b], days = [...new Set(parts.flatMap(S => S.rows.map(r => r.d)))].sort((x, y) => x - y), rows = [];
  const lastRow = (S, d) => { let r = null; for (const q of S.rows) { if (q.d > d) break; r = q; } return r; };
  days.forEach(d => {
    const r = { d, fund: 'II + III', val: 0, st: 0, sd: 0, sv: 0, ss: 0, realSum: 0, cs: 0, cv: 0, cd: 0, ct: 0, part: [] };
    parts.forEach(S => {
      const q = lastRow(S, d);
      if (!q) { r.part.push(null); return; }
      const pr = priceAt({ f: q.fo }, d), v = q.units * (pr ? pr[1] : q.price);
      r.val += v; r.st += q.st; r.sd += q.sd; r.sv += q.sv; r.ss += q.ss; r.realSum += q.realSum;
      S.rows.filter(x => x.d === d).forEach(x => { r.cs += x.cs; r.cv += x.cv; r.cd += x.cd; r.ct += x.ct; });
      r.part.push({ val: v, st: q.st, sd: q.sd, sv: q.sv, fund: q.fund });
    });
    r.ret = r.val - r.st; r.retp = r.st ? r.ret / r.st : null; r.gainE = r.val - r.realSum; r.gainP = r.realSum ? r.gainE / r.realSum : null;
    r.ann = annuityOf(r.val, P, d);
    const pen = yearOf(d) >= 2018 ? byYear(J.pensions, yearOf(d), null) : null, net = wageAt(d, P.pay, null).n;
    if (pen && net) { r.pen = pen; r.net = net; r.tot = pen + r.ann; r.rr0 = pen / net; r.rr1 = r.tot / net; r.rrd = r.rr1 - r.rr0; }
    rows.push(r);
  });
  const lo = parts.map(S => S.lastOwn).filter(Boolean);
  return { rows, last: rows[rows.length - 1], est: [...new Set(parts.flatMap(S => S.est))], path: [...a.path, ...b.path], cpiRef: a.cpiRef, penY: a.penY,
    lastOwn: lo.length ? { eur: lo.reduce((x, o) => x + o.eur, 0), net: lo[0].net } : null, P, parts };
}
function simulate1(P) {
  const est = new Set(), rows = [];
  const asof = P.asof, startDay = startDayOf(P);
  const events = DATES.filter(([d]) => d >= startDay && d <= asof).map(([d, m]) => ({ d, m }));
  if (P.pl === 'II' && !fund2Of(P)) {        // fondų keitimo dienos (pasirinkto fondo pradžia)
    const sw = new Set(), gi = GRPS.indexOf(groupOf(P.birth));
    for (const m of [P.mgr, 'SEB']) for (let i = gi; i >= 0; i--) { const f = lcFund(m, GRPS[i]); if (f) sw.add(f.d[0]); }
    [...sw].filter(d => d > startDay && d <= asof && !events.some(e => e.d === d)).forEach(d => events.push({ d, m: 0 }));
  }
  events.sort((a, b) => a.d - b.d);
  if (!events.length || events[events.length - 1].d !== asof) events.push({ d: asof, m: 0, val: true });
  let fund = null, units = 0, lastOwn = null; const path = [];
  for (const e of events) {
    const want = fundFor(e.d, P);
    if (!want) continue;
    if (!fund) { if (!e.m) continue; fund = want; path.push([fund.id, e.d]); }
    else if (want.id !== fund.id) {               // fondo keitimas
      const p0 = priceAt(fund, e.d), p1 = priceAt(want, e.d), value = units * p0[1];
      units = value / p1[1];
      rows.push({ d: e.d, sw: [fund.id, want.id], fund: want.id, fo: want.f, price: p1[1], bought: units, units, val: value, cs: 0, cv: 0, cd: 0, ct: 0 });
      fund = want; path.push([fund.id, e.d]);
      if (!e.m) continue;
    }
    if (!e.m && !e.val) continue;                 // keitimo diena be keitimo
    const pr = priceAt(fund, e.d);
    if (!pr) continue;
    const y = yearOf(e.d);
    const row = { d: e.d, fund: fund.id, fo: fund.f, price: pr[1], m: 0, cs: 0, cv: 0, cd: 0 };
    if (e.m) {
      const w = wageAt(e.d, P.pay, est);
      row.m = e.m; row.wage = w.g; row.netW = w.n;
      if (P.pl === 'II') {
        const r = RATES.filter(x => x.d <= e.d).pop(), grad = P.rate === 'grad' && r.g != null;
        row.rs = r.s; row.cs = row.wage * r.s / 100 * e.m;
        row.rd = grad ? r.g : r.p; row.cd = row.wage * row.rd / 100 * e.m;
        row.rv = incentive(y, grad, est); row.cv = (row.rv || 0) * e.m;
      } else if (P.c3 === 'eur') { row.fixed = P.c3eur; row.cd = P.c3eur * e.m; }
      else { row.rd = P.c3pct; row.cd = row.wage * P.c3pct / 100 * e.m; }
      lastOwn = { eur: row.cd / e.m, net: w.n, d: e.d };
    }
    row.ct = row.cs + row.cv + row.cd;
    row.bought = row.ct / pr[1]; units += row.bought; row.units = units; row.val = units * pr[1];
    if (e.val) row.valOnly = true;
    rows.push(row);
  }
  if (!rows.length) return null;
  // sukaupti stulpeliai, pensija, infliacija
  const cpiRef = cpiAt(asof, est);
  let realSum = 0, cs = 0, cv = 0, cd = 0;
  rows.forEach(r => {
    cs += r.cs; cv += r.cv; cd += r.cd;
    r.ss = cs; r.sv = cv; r.sd = cd; r.st = cs + cv + cd; r.ret = r.val - r.st; r.retp = r.st ? r.ret / r.st : null;
    const y = yearOf(r.d);
    r.cpi = cpiAt(r.d, est); r.real = r.ct && r.cpi ? r.ct * cpiRef / r.cpi : 0; realSum += r.real; r.realSum = realSum;
    r.gainE = r.val - realSum; r.gainP = realSum ? r.gainE / realSum : null;
    r.ann = r.val / 1000 * J.annuity;
    const pen = y >= 2018 ? byYear(J.pensions, y, null) : null, net = wageAt(r.d, P.pay, null).n;
    if (pen && net) { r.pen = pen; r.net = net; r.tot = pen + r.ann; r.rr0 = pen / net; r.rr1 = r.tot / net; r.rrd = r.rr1 - r.rr0; }
  });
  const yAs = yearOf(asof), last = rows[rows.length - 1];
  const penY = Math.max(...Object.keys(J.pensions).map(Number).filter(k => k <= yAs));
  if (J.pensions[yAs] == null) est.add(`${T().th.pen} ${yAs} = ${penY}`);
  if (P.pay !== 'mma' && !J.wages[yAs]) est.add(`${T().th.net} ${yAs} = ${Math.max(...Object.keys(J.wages).map(Number))}`);
  return { rows, last, est: [...est], path, cpiRef, penY, lastOwn, P };
}

/* ---------- valdikliai ---------- */
const field = (label, html) => `<label class="field">${label} ${html}</label>`;
const sel = (k, opts, cur) => `<select data-k="${k}">${opts.map(([v, t]) => `<option value="${v}"${String(v) === String(cur) ? ' selected' : ''}>${t}</option>`).join('')}</select>`;
const ik = k => `<button type="button" class="info" data-k="${k}" aria-label="info">i</button>`;
const xbtn = () => `<button type="button" class="btn xls" title="${T().xlsTip}">⤓ ${T().xls}</button>`;
function seg(id, opts, cur) { return `<div class="seg" role="group" data-seg="${id}">` + opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${t}</button>`).join('') + '</div>'; }
const NUMK = ['birth', 'start2', 'start3', 'c3pct', 'c3eur'];

function params(over = {}) {
  const S = Object.assign({}, ST, over);
  if (!GRPS.some(g => g === groupOf(S.birth))) S.birth = 1984;
  if (!P3.length) S.pl = 'II';
  S.start2 = Math.max(2019, S.start2, S.birth + 18);
  S.start3 = Math.max(S.start3, S.birth + 18, yearOf(p3Fund(S.fund3)?.d[0] ?? 0));
  if (S.fund2 && !mgrFunds(S.mgr).some(f => f.name === S.fund2)) {     // pakeitus valdytoją – tos pačios grupės naujo valdytojo fondas
    const g = DATA.groups.find(gr => gr.funds.some(f => f.name === S.fund2));
    S.fund2 = (g && lcFund(S.mgr, g.id)?.name) || '';
  }
  const asof = S.asof && dayOf(S.asof) <= LAST && dayOf(S.asof) > LC_START ? dayOf(S.asof) : LAST;
  return { pl: S.pl, birth: S.birth, start2: S.start2, start3: S.start3, pay: S.pay, rate: S.rate, mgr: S.mgr, fund2: S.fund2, fund3: p3Fund(S.fund3)?.name, c3: S.c3, c3pct: S.c3pct, c3eur: S.c3eur, asof };
}
function renderBar() {
  const bar = document.getElementById('inBar'), lastY = yearOf(LAST), t = T();
  const births = []; for (let y = 1961; y <= Math.min(2009, lastY - 18); y++) births.push([y, y]);
  const yrs = a => { const o = []; for (let y = a; y <= lastY; y++) o.push([y, y]); return o; };
  const both = P.pl === 'both', lab = (x, pl) => both ? `${x} (${pl})` : x;
  let h = field(t.inPl, seg('pl', [['II', t.pl2], ['III', t.pl3], ['both', t.plBoth]], P.pl)) + field(t.inBirth, sel('birth', births, P.birth))
    + field(t.inPay, sel('pay', PAYS.map(p => [p, t.pay[p]]), P.pay));
  if (P.pl !== 'III') {
    h += field(lab(t.inStart, 'II'), sel('start2', yrs(Math.max(2019, P.birth + 18)), P.start2))
      + field(t.inRate, seg('rate', [['max', t.rMax], ['grad', t.rGrad]], P.rate)) + field(t.inMgr, sel('mgr', MGRS.map(m => [m, MLABEL[m]]), P.mgr))
      + field(lab(t.inFund, 'II'), sel('fund2', [['', t.fund2Auto], ...mgrFunds(P.mgr).map(f => [f.name, f.name])], P.fund2));
  }
  if (P.pl !== 'II') {
    const f3 = p3Fund(P.fund3);
    const opts = ['bond', 'mixed', 'equity'].map(c => `<optgroup label="${t.cat[c]}">${P3.filter(f => f.cat === c).map(f => `<option value="${f.name}"${f.name === f3.name ? ' selected' : ''}>${f.name} (${yearOf(f.d[0])})</option>`).join('')}</optgroup>`).join('');
    h += field(lab(t.inFund, 'III'), `<select data-k="fund3">${opts}</select>`) + field(lab(t.inStart, 'III'), sel('start3', yrs(Math.max(yearOf(f3.d[0]), P.birth + 18)), P.start3))
      + field(t.inC3, seg('c3', [['pct', t.c3pct], ['eur', t.c3eur]], P.c3) + (P.c3 === 'eur'
        ? `<input type="number" data-k="c3eur" min="1" step="1" value="${P.c3eur}">` : `<input type="number" data-k="c3pct" min="0.1" step="0.5" value="${P.c3pct}">`));
  }
  h += field(t.inAsof, `<input type="date" data-k="asof" value="${iso(P.asof)}" min="2019-02-01" max="${iso(LAST)}">`);
  bar.innerHTML = h;
  bar.querySelectorAll('select[data-k], input[type=number][data-k]').forEach(s => s.addEventListener('change', () => {
    const k = s.dataset.k, v = NUMK.includes(k) ? +s.value : s.value;
    if (NUMK.includes(k) && !(v > 0)) return;
    ST[k] = v; save(); renderAll();
  }));
  bar.querySelector('input[data-k="asof"]').addEventListener('change', e => { ST.asof = e.target.value === iso(LAST) ? '' : e.target.value; save(); renderAll(); });
  bar.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { ST[g.dataset.seg] = b.dataset.v; save(); renderAll(); })));
}

const kpi = (l, v, s, cls = '') => `<div class="kpi ${cls}"><div class="l">${l}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
let SIM = null, P = null;
const payL = p => T().payLong[p] || T().payPct(p);
const plL = pl => pl === 'II' ? T().pl2 : pl === 'III' ? T().pl3 : T().plBothL;

function renderKpis() {
  const L = SIM.last, t = T(), yAs = yearOf(P.asof);
  const gcls = L.gainE >= 0 ? 'up' : 'down';
  document.getElementById('sumTitle').innerHTML = `${t.sumTitle} <span style="font-weight:400;font-size:13px;color:var(--text-3)">· ${plL(P.pl)} · ${dots(P.asof)}</span>${ik('sum')}${xbtn()}<a class="srclink" href="#srcTitle">${t.srcLink} ↓</a>`;
  document.getElementById('kpiA').innerHTML = kpi(t.kAssets, eur(L.val, 0), '', 'hl') + kpi(t.kContrib, eur(L.st, 0)) + kpi(t.kReal, eur(L.realSum, 0))
    + kpi(t.kGainE, `<span class="${gcls}">${L.gainE >= 0 ? '+' : '−'}${eur(Math.abs(L.gainE), 0)}</span>`) + kpi(t.kGainP, `<span class="${gcls}">${pc(L.gainP)}</span>`);
  document.getElementById('incTitle').innerHTML = `${t.incTitle}${ik('inc')}`;
  document.getElementById('kpiB').innerHTML = L.pen != null ? kpi(t.kState(SIM.penY), eur(L.pen, 0), `${t.kRr}: ${pc(L.rr0, 0)}`) + kpi(t.kAnn, eur(L.ann), `${t.kYears}: ${num(L.val / L.ann / 12, 1)}`)
    + kpi(t.kAddRr, pc(L.rrd), `${t.kRrTot}: ${pc(L.rr1)}`) + kpi(t.kTotal, eur(L.tot), `${t.kNet(yAs)}: ${eur(L.net, 0)} · ${t.kSal}: ${num(L.val / L.net, 1)}`, 'hl') : '';
}
function renderAnnuity() {
  const t = T(), A = J.annuityModel, v = SIM.last.val, sh = pc(A.deferred_share65, 2), tb = document.getElementById('annTable');
  const row = (n, e, k, d) => `<tr><td class="l">${n}</td><td>${e}</td><td>${k}</td><td class="l" style="white-space:normal">${d}</td></tr>`;
  tb.innerHTML = `<thead><tr>${t.ann.h.map((h, i) => `<th class="${i === 0 || i === 3 ? 'l' : ''}">${h}</th>`).join('')}</tr></thead><tbody>`
    + row(t.ann.std, eur(v / 1000 * A.std), num(A.std), t.ann.stdD) + row(t.ann.inh, eur(v / 1000 * A.inh), num(A.inh), t.ann.inhD)
    + row(t.ann.def, `${eur(v / 1000 * A.defPer)} ${t.ann.defP}<br>${eur(v / 1000 * A.defAnn)} ${t.ann.defA}`, `${num(A.defPer)}<br>${num(A.defAnn)}`, t.ann.defD(sh)) + '</tbody>';
  const x = v < A.lump_max ? (lang === 'lt' ? `Šio dalyvio ${eur(v, 0)} – mažiau už ribą.` : `This participant’s ${eur(v, 0)} is below the limit.`) : '';
  document.getElementById('annNote').textContent = t.ann.note(num(A.lump_max, 0), num(A.free_above, 0), x);
}
function shareOf(L) {
  const tot = L.val, r = L.val - L.st;
  return { v: L.sv / tot, d: L.sd / tot, r: r / tot, abs: { v: L.sv, d: L.sd, r } };
}
function renderStory() {
  const L = SIM.last, t = T(), shares = shareOf(L), maxKey = shares.v > shares.d ? 'v' : 'd', start = yearOf(SIM.rows[0].d), o = SIM.lastOwn;
  const r2 = `${P.rate === 'max' ? t.rMax : t.rGrad}`, r3 = P.c3 === 'eur' ? `${num(P.c3eur, 0)} € / ${lang === 'lt' ? 'mėn.' : 'month'}` : `${num(P.c3pct, 1)} % ${lang === 'lt' ? 'bruto atlyginimo' : 'of gross salary'}`;
  const rateL = P.pl === 'II' ? r2 : P.pl === 'III' ? r3 : `II: ${r2}; III: ${r3}`;
  const x = { pl: P.pl, plName: plL(P.pl), start, ageStart: start - P.birth, payL: payL(P.pay), years: yearOf(P.asof) - start + 1, date: dots(P.asof), assets: num(L.val, 0), real: num(L.realSum, 0),
    gainP: L.gainP, gainPs: pc(Math.abs(L.gainP)), retShare: shares.r, maxShare: shares[maxKey], maxKey, retPs: pc(Math.max(0, shares.r), 0),
    own: o ? num(o.eur) : '–', ownNet: o && o.net ? pc(o.eur / o.net, 1) : '',
    total: L.tot != null ? num(L.tot) : '–', rr1: L.rr1 != null ? pc(L.rr1) : '–', sal: L.net ? num(L.val / L.net, 1) : '–' };
  document.getElementById('story').innerHTML = t.story(x).map(s => `<p>${s}</p>`).join('');
  const pathL = SIM.path.map(([f, d]) => `${shortFund(f)} – ${lang === 'lt' ? 'nuo' : 'since'} ${dots(d)}`).join('<br>');
  const pr = { birth: P.birth, start, ageStart: start - P.birth, ret: P.birth + 65, left: Math.max(0, P.birth + 65 - yearOf(P.asof)), payL: t.pay[P.pay], rateL, path: pathL };
  document.getElementById('prof').innerHTML = t.prof(pr).map(s => `<div>${s}</div>`).join('');
}

/* ---------- palyginimas: vidutinis / minimalus atlyginimas, II / III pakopa ---------- */
function renderCompare() {
  const t = T(), tb = document.getElementById('cmpTable');
  document.getElementById('cmpTitle').innerHTML = `${t.cmpTitle}${ik('cmp')}`;
  document.getElementById('cmpLead').textContent = t.cmpLead;
  const cases = [['II', 'avg'], ['II', 'mma'], ['III', 'avg'], ['III', 'mma'], ['both', 'avg'], ['both', 'mma']].filter(([pl]) => pl === 'II' || P3.length);
  tb.innerHTML = `<thead><tr>${t.cmpH.map((h, i) => `<th class="${i < 2 ? 'l' : ''}">${h}</th>`).join('')}</tr></thead><tbody>` + cases.map(([pl, pay]) => {
    const S = pl === P.pl && pay === P.pay ? SIM : simulate(params({ pl, pay, asof: ST.asof }));
    if (!S) return '';
    const L = S.last, o = S.lastOwn, cur = pl === P.pl && pay === P.pay;
    return `<tr${cur ? ' class="cur"' : ''}><td class="l">${pl === 'both' ? t.plBoth : pl === 'II' ? t.pl2 : t.pl3} · ${t.pay[pay]}</td><td class="l">${dots(S.rows[0].d)}</td><td>${o ? num(o.eur) : ''}</td><td>${o && o.net ? pc(o.eur / o.net, 1) : '–'}</td>`
      + `<td>${eur(L.sd, 0)}</td><td>${eur(L.sv, 0)}</td><td>${eur(L.val, 0)}</td><td class="${L.gainE >= 0 ? 'up' : 'down'}">${pc(L.gainP, 1)}</td><td>${num(L.ann)}</td><td>${L.rrd != null ? pc(L.rrd) : '–'}</td></tr>`;
  }).join('') + '</tbody>';
  document.getElementById('cmpNote').textContent = t.cmpNote;
}

/* ---------- grafikas: sukauptos įmokos pagal šaltinį + grąža ---------- */
function renderChart() {
  const t = T(), el = document.getElementById('chart'), rows = SIM.rows;
  document.getElementById('chTitle').innerHTML = `${t.chTitle}${ik('chart')}`;
  document.getElementById('chMeta').textContent = t.chMeta;
  document.getElementById('shMeta').textContent = t.shMeta;
  el.querySelectorAll('svg, p.na').forEach(s => s.remove());
  const W = el.clientWidth || 700, H = Math.max(260, Math.min(360, W * 0.5)), m = { l: 58, r: 12, t: 10, b: 26 };
  const x0 = rows[0].d, x1 = rows[rows.length - 1].d;
  const hi = Math.max(...rows.map(r => Math.max(r.val, r.st))) * 1.04 || 1;
  const X = d => m.l + (d - x0) / Math.max(1, x1 - x0) * (W - m.l - m.r), Y = v => m.t + (hi - v) / hi * (H - m.t - m.b);
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', t.chMeta);
  const add = (tag, a, p = svg) => { const n = document.createElementNS(ns, tag); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  niceTicks(0, hi).forEach(v => {
    add('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), stroke: v === 0 ? 'var(--axis)' : 'var(--grid)' });
    add('text', { x: m.l - 8, y: Y(v) + 4, 'text-anchor': 'end', fill: 'var(--text-3)', 'font-size': 11 }).textContent = num(v, 0) + ' €';
  });
  const span = (x1 - x0) / 365, stepY = span > 12 ? 2 : 1;
  for (let y = yearOf(x0) + 1; y <= yearOf(x1); y += stepY) { const d = dayOf(`${y}-01-01`); add('text', { x: X(d), y: H - 6, 'text-anchor': 'middle', fill: 'var(--text-3)', 'font-size': 11 }).textContent = y; }
  // sukauptos įmokos: valstybė apačioje, dalyvis viršuje
  const stack = [['v', r => r.sv], ['d', r => r.st]];
  let prev = () => 0;
  stack.forEach(([k, top]) => {
    const lo = prev, pts = rows.map(r => [X(r.d), Y(top(r))]), base = rows.map(r => [X(r.d), Y(lo(r))]).reverse();
    add('path', { d: 'M' + pts.concat(base).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z', fill: SCOL[k], 'fill-opacity': 0.8, stroke: 'var(--card)', 'stroke-width': 1 });
    prev = top;
  });
  // grąža: sritis tarp įmokų ir turto
  const vp = rows.map(r => [X(r.d), Y(r.val)]), cp = rows.map(r => [X(r.d), Y(r.st)]).reverse();
  add('path', { d: 'M' + vp.concat(cp).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z', fill: SCOL.r, 'fill-opacity': 0.35 });
  add('path', { d: 'M' + vp.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'), fill: 'none', stroke: SCOL.r, 'stroke-width': 2, 'stroke-linejoin': 'round' });
  rows.filter(r => r.sw).forEach(r => add('line', { x1: X(r.d), x2: X(r.d), y1: m.t, y2: H - m.b, stroke: 'var(--text-3)', 'stroke-dasharray': '3 3' }));
  const cross = add('line', { y1: m.t, y2: H - m.b, stroke: 'var(--axis)', visibility: 'hidden' });
  const hit = add('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' });
  el.appendChild(svg);
  let tip = el.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; el.appendChild(tip); }
  const keys = SIM.last.sv > 0 ? ['r', 'd', 'v'] : ['r', 'd'];
  const move = ev => {
    const rect = svg.getBoundingClientRect(), px = (ev.clientX - rect.left) * (W / rect.width), day = x0 + (px - m.l) / (W - m.l - m.r) * (x1 - x0);
    let r = rows[0]; for (const q of rows) if (q.d <= day) r = q;
    cross.setAttribute('x1', X(r.d)); cross.setAttribute('x2', X(r.d)); cross.setAttribute('visibility', 'visible');
    const line = (c, l, v) => `<div><span><span class="sw" style="background:${c}"></span>${l}</span><span>${eur(v, 0)}</span></div>`;
    tip.innerHTML = `<b>${dots(r.d)}</b>` + line('transparent', t.value, r.val) + keys.map(k => line(SCOL[k], t.srcName[k], k === 'r' ? r.ret : k === 'd' ? r.sd : r.sv)).join('');
    tip.style.display = 'block';
    const box = el.getBoundingClientRect();
    tip.style.left = Math.max(0, Math.min(ev.clientX - box.left + 14, el.clientWidth - tip.offsetWidth - 4)) + 'px'; tip.style.top = Math.max(0, ev.clientY - box.top - tip.offsetHeight - 10) + 'px';
  };
  hit.addEventListener('mousemove', move); hit.addEventListener('touchmove', e => move(e.touches[0]), { passive: true });
  hit.addEventListener('mouseleave', () => { tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden'); });
  document.getElementById('chLegend').innerHTML = keys.map(k => `<span><i style="background:${SCOL[k]}"></i>${t.srcName[k]}</span>`).join('');
  // šaltinių dalys
  const sh = shareOf(SIM.last), pos = SRC.filter(k => sh.abs[k] > 0), sum = pos.reduce((a, k) => a + sh.abs[k], 0);
  document.getElementById('shares').innerHTML = `<div class="sbar">${pos.map(k => `<span style="flex:${sh.abs[k] / sum};background:${SCOL[k]}" title="${t.srcName[k]}"></span>`).join('')}</div>`
    + keys.map(k => `<div class="row"><span><span class="sw" style="display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;background:${SCOL[k]}"></span>${t.srcName[k]}</span><span>${eur(sh.abs[k])}</span><span>${pc(sh[k], 0)}</span></div>`).join('')
    + `<div class="row"><b>${t.value}</b><b>${eur(SIM.last.val)}</b><span></span></div>`;
}

/* ---------- palyginimas su pasaulio akcijų indeksais: tos pačios įmokos tomis pačiomis dienomis ---------- */
function xirr(flows) {                     // flows: [[diena, suma]] (įmokos neigiamos, galutinis turtas teigiamas) -> metinė grąža
  const npv = r => flows.reduce((a, [d, c]) => a + c / Math.pow(1 + r, (d - flows[0][0]) / 365.25), 0);
  let lo = -0.99, hi = 1;
  if (npv(lo) * npv(hi) > 0) return null;
  for (let k = 0; k < 100; k++) { const m = (lo + hi) / 2; (npv(lo) * npv(m) <= 0) ? hi = m : lo = m; }
  return (lo + hi) / 2;
}
function idxPath(f, rows, asof) {
  let units = 0, j = 0; const pts = [], flows = [];
  const cont = rows.filter(r => r.ct > 0);
  if (!cont.length || f.d[0] > cont[0].d) return null;
  for (let k = lastOnOrBefore(f, cont[0].d); k < f.d.length && f.d[k] <= asof; k++) {
    while (j < cont.length && cont[j].d <= f.d[k]) { const i = lastOnOrBefore(f, cont[j].d); units += cont[j].ct / f.v[i]; flows.push([cont[j].d, -cont[j].ct]); j++; }
    if (k >= 0) pts.push([f.d[k], units * f.v[k]]);
  }
  const val = pts.length ? pts[pts.length - 1][1] : 0;
  return { pts, val, irr: xirr([...flows, [asof, val]]) };
}
function renderIdx() {
  const t = T(), X = t.ix, fs = idxFunds(), L = SIM.last, el = document.getElementById('ixChart');
  document.getElementById('ixTitle').innerHTML = `${X.title}${ik('ix')}`;
  document.getElementById('ixLead').textContent = X.lead; document.getElementById('ixMeta').textContent = X.meta;
  const cont = SIM.rows.filter(r => r.ct > 0), fundFlows = [...cont.map(r => [r.d, -r.ct]), [P.asof, L.val]];
  const D = dailyOf(SIM), fundIrr = xirr(fundFlows);
  const paths = fs.map(f => ({ f, p: idxPath(f, SIM.rows, P.asof) })).filter(x => x.p);
  const ser = [{ provider: 'fund', label: X.fund, color: 'var(--s5)', points: D.map(x => [x.d, x.val]) }, ...paths.map(({ f, p }) => ({ provider: f.provider, label: f.label, color: f.color, dash: f.dash, points: p.pts }))];
  const x0 = D[0].d, x1 = D[D.length - 1].d;
  drawLineChart(el, ser, x0, x1, { height: 320, fmt: v => eur(v, 0), axisUnit: ' €', ml: 70 });
  document.getElementById('ixLegend').innerHTML = ser.map(x => `<span><i style="background:${x.color}"></i>${x.label}</span>`).join('');
  const row = (n, val, irr, sw, cls = '') => `<tr class="${cls}"><td class="l">${sw}${n}</td><td>${eur(val, 0)}</td><td class="${val >= L.st ? 'up' : 'down'}">${eur(val - L.st, 0)}</td><td>${pc((val - L.st) / L.st)}</td><td>${irr == null ? '–' : pc(irr)}</td><td>${cls ? '' : `<span class="${val - L.val >= 0 ? 'up' : 'down'}">${val - L.val >= 0 ? '+' : '−'}${eur(Math.abs(val - L.val), 0)}</span>`}</td></tr>`;
  const sw = c => `<span class="sw" style="display:inline-block;width:12px;height:3px;border-radius:2px;margin-right:6px;vertical-align:3px;background:${c}"></span>`;
  document.getElementById('ixTable').innerHTML = `<thead><tr>${X.h.map((h, i) => `<th class="${i ? '' : 'l'}">${h}</th>`).join('')}</tr></thead><tbody>`
    + row(X.fund, L.val, fundIrr, sw('var(--s5)'), 'cur') + paths.map(({ f, p }) => row(f.label, p.val, p.irr, sw(f.color))).join('') + '</tbody>';
  document.getElementById('ixNote').textContent = `${lang === 'lt' ? 'Įmokos' : 'Contributions'}: ${eur(L.st, 0)}. ${X.note}`;
}

/* ---------- savininko Excel vizualizacijos: pakeitimo normos, turtas, grąža (kasdien) ---------- */
/* Kasdienė eilutė: tarp pervedimų vienetų skaičius nekinta, todėl turtas = vienetai × tos dienos vieneto vertė. */
function dailyOf(S) {
  if (S.parts) {                       // abi pakopos: sudedamos kasdienės sumos (paskutinė žinoma kiekvienos pakopos reikšmė)
    const ds = S.parts.map(dailyOf), days = [...new Set(ds.flatMap(x => x.map(p => p.d)))].sort((a, b) => a - b), idx = ds.map(() => -1);
    return days.map(d => {
      const cur = ds.map((x, i) => { while (idx[i] + 1 < x.length && x[idx[i] + 1].d <= d) idx[i]++; return idx[i] >= 0 ? x[idx[i]] : null; }).filter(Boolean);
      const val = cur.reduce((a, p) => a + p.val, 0), st = cur.reduce((a, p) => a + p.st, 0), sd = cur.reduce((a, p) => a + p.sd, 0), ann = annuityOf(val, S.P, d), { pen, net } = cur[0];
      return { d, val, st, sd, ret: st ? (val - st) / st : null, ann, pen, net, rr0: pen && net ? pen / net : null, rr1: pen && net ? (pen + ann) / net : null };
    });
  }
  const rows = S.rows, out = [], asof = S.P.asof, cache = {};
  const penNet = y => cache[y] || (cache[y] = (() => { const pen = y >= 2018 ? byYear(J.pensions, y, null) : null, net = wageAt(dayOf(`${y}-07-01`), S.P.pay, null).n; return [pen, net]; })());
  rows.forEach((r, i) => {
    const end = i + 1 < rows.length ? rows[i + 1].d : asof + 1, f = r.fo;
    let k = lastOnOrBefore(f, r.d); if (k < 0) k = 0;
    out.push(pt(r.d, r.val, r));
    for (k++; k < f.d.length && f.d[k] < end; k++) if (f.d[k] > r.d) out.push(pt(f.d[k], r.units * f.v[k], r));
  });
  function pt(d, val, r) {
    const [pen, net] = penNet(yearOf(d)), ann = annuityOf(val, S.P, d);
    return { d, val, st: r.st, sd: r.sd, ret: r.st ? (val - r.st) / r.st : null, ann, pen, net, rr0: pen && net ? pen / net : null, rr1: pen && net ? (pen + ann) / net : null };
  }
  return out;
}
function renderGrid() {
  const t = T(), D = dailyOf(SIM), L = D[D.length - 1], el = document.getElementById('mgrid'), G = t.grid;
  document.getElementById('gridTitle').innerHTML = `${G.title}${ik('grid')}`;
  document.getElementById('gridLead').textContent = G.lead;
  const pts = (k, mul = 1, from = 0) => D.filter(x => x[k] != null && x.d >= from).map(x => [x.d, x[k] * mul]);
  const rrFrom = D.find(x => x.rr0 != null)?.d ?? Infinity;
  const C1 = 'var(--s2)', C2 = 'var(--s6)', C3 = 'var(--s5)';
  const cards = [
    { t: G.rrPct, s: L.rr1 != null ? `${pc(L.rr0)} → ${pc(L.rr1)}` : '', ser: [{ provider: 'a', label: G.without, color: C1, points: pts('rr0', 100, rrFrom) }, { provider: 'b', label: G.with, color: C3, points: pts('rr1', 100, rrFrom) }], fmt: v => num(v, 2) + ' %', unit: '%', zero: false },
    { t: G.addPct, s: L.rr1 != null ? pc(L.rr1 - L.rr0) : '', ser: [{ provider: 'a', label: G.addPct, color: C3, points: D.filter(x => x.rr0 != null).map(x => [x.d, (x.rr1 - x.rr0) * 100]) }], fmt: v => num(v, 2) + ' %', unit: '%' },
    { t: G.assets, s: eur(L.val, 0), ser: [{ provider: 'a', label: t.value, color: C3, points: pts('val') }], fmt: v => eur(v, 0), unit: ' €' },
    { t: G.ret, s: L.ret != null ? pc(L.ret) : '', ser: [{ provider: 'a', label: G.ret, color: C3, points: pts('ret', 100) }], fmt: v => num(v, 2) + ' %', unit: '%' },
    { t: G.rrEur, s: L.pen ? `${eur(L.pen)} → ${eur(L.pen + L.ann)}` : '', ser: [{ provider: 'a', label: G.avgPen, color: C1, points: pts('pen', 1, rrFrom) }, { provider: 'b', label: G.penWith, color: C3, points: D.filter(x => x.pen != null).map(x => [x.d, x.pen + x.ann]) }], fmt: v => eur(v), unit: ' €' },
    { t: G.addEur, s: eur(L.ann), ser: [{ provider: 'a', label: t.kAnn, color: C3, points: D.filter(x => x.d >= Math.min(rrFrom, D[D.length - 1].d)).map(x => [x.d, x.ann]) }], fmt: v => eur(v), unit: ' €' },
    { t: G.assetsC, s: `${eur(L.val, 0)} · ${eur(L.sd, 0)}`, ser: [{ provider: 'a', label: G.own, color: C2, points: pts('sd') }, { provider: 'b', label: G.allC, color: C1, points: pts('st') }, { provider: 'c', label: t.value, color: C3, points: pts('val') }], fmt: v => eur(v, 0), unit: ' €' },
  ];
  el.innerHTML = cards.map((c, i) => `<section class="card"><div class="mt">${c.t}</div><div class="ms">${c.s}</div><div class="chart" id="mg${i}"></div><div class="legend" style="font-size:12px">${c.ser.length > 1 ? c.ser.map(x => `<span><i style="background:${x.color}"></i>${x.label}</span>`).join('') : ''}</div></section>`).join('')
    + `<section class="card"><div class="mt">${t.shMeta}</div><div class="ms">${eur(SIM.last.val, 0)}</div><div class="tmap" id="tmap"></div></section>`;
  cards.forEach((c, i) => {
    const box = document.getElementById('mg' + i), ser = c.ser.filter(x => x.points.length > 1);
    if (!ser.length) { box.innerHTML = `<p class="na">${G.na}</p>`; return; }
    const x0 = Math.min(...ser.map(x => x.points[0][0])), x1 = Math.max(...ser.map(x => x.points[x.points.length - 1][0]));
    drawLineChart(box, ser, x0, x1, { height: 190, fmt: c.fmt, axisUnit: c.unit, mr: 8, zero: c.zero, ml: c.unit === ' €' ? 62 : 46 });
  });
  // šaltinių „treemap“: didžiausias kairėje, kiti dešinėje
  const Lr = SIM.last, parts = [['r', Lr.val - Lr.st], ['d', Lr.sd], ['v', Lr.sv], ['s', Lr.ss]].filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]);
  const col = { r: 'var(--s5)', d: 'var(--s6)', v: 'var(--s1)', s: 'var(--s4)' }, tot = parts.reduce((a, x) => a + x[1], 0);
  const tm = document.getElementById('tmap'), cell = ([k, v], ex = '') => `<div style="background:${col[k]};${ex}">${t.srcName[k]}<b>${eur(v, 0)}</b>${pc(v / tot, 0)}</div>`;
  if (parts.length < 2) { tm.style.gridTemplateColumns = '1fr'; tm.innerHTML = parts.map(cell).join(''); return; }
  const [a, ...rest] = parts, restSum = tot - a[1];
  tm.style.gridTemplateColumns = `${a[1] / tot}fr ${restSum / tot}fr`;
  tm.style.gridTemplateRows = '1fr';
  tm.innerHTML = cell(a)
    + `<div style="display:grid;grid-template-rows:${rest.slice(0, 1).map(x => `minmax(64px, ${x[1] / restSum}fr)`).join('')} ${rest.length > 1 ? `minmax(64px, ${(restSum - rest[0][1]) / restSum}fr)` : ''};gap:3px;padding:0;background:none">`
    + cell(rest[0]) + (rest.length > 1 ? `<div style="display:grid;grid-template-columns:${rest.slice(1).map(x => x[1] + 'fr').join(' ')};gap:3px;padding:0;background:none">${rest.slice(1).map(x => cell(x)).join('')}</div>` : '') + '</div>';
}

/* ---------- lentelė ---------- */
const COLS_ALL = ['date', 'fund', 'wage', 'rs', 'rd', 'rv', 'cs', 'cd', 'cv', 'ct', 'price', 'bought', 'units', 'val', 'ss', 'sd', 'sv', 'st', 'ret', 'retp', 'ann', 'pen', 'net', 'tot', 'rr0', 'rr1', 'rrd', 'cpi', 'real', 'gainE', 'gainP'];
const shortFund = f => f.replace(/ tikslinės grupės pensijų fondas/, '').replace(/^Allianz (\w+) gimusiems (\d{4}-\d{4}) m\./, 'Allianz $2');
function cellOf(r, k) {
  const v = r[k], n = (x, p) => x == null ? '' : num(x, p);
  switch (k) {
    case 'date': return dots(r.d);
    case 'fund': return shortFund(r.fund);
    case 'rs': return v == null ? '' : num(v, 2);
    case 'rd': return v == null ? (r.fixed ? `${num(r.fixed, 2)} €` : '') : num(v, 2) + (r.m === 3 ? ` <span style="color:var(--text-3)">${T().quarter}</span>` : '');
    case 'retp': case 'rr0': case 'rr1': case 'rrd': case 'gainP': return v == null ? '' : pc(v);
    case 'price': return n(v, 4);
    default: return n(v, 2);
  }
}
function cols() { return SIM.last.sv > 0 ? COLS_ALL : COLS_ALL.filter(k => !['rs', 'rv', 'cs', 'cv', 'ss', 'sv'].includes(k)); }
function renderTable() {
  const t = T(), rows = SIM.rows, C = cols();
  document.getElementById('tbTitle').innerHTML = `${t.tbTitle}${ik('tbl')}${xbtn()}`;
  document.getElementById('tbLead').textContent = t.tbLead;
  const bar = document.getElementById('tbBar');
  bar.style.display = SIM.parts ? 'none' : '';
  bar.innerHTML = SIM.parts ? '' : seg('tb', [['y', t.tbYear], ['a', t.tbAll]], ST.tb);
  bar.querySelectorAll('[data-seg] button').forEach(b => b.addEventListener('click', () => { ST.tb = b.dataset.v; save(); renderTable(); }));
  const tb = document.getElementById('tbl'), iv = C.indexOf('val');
  if (SIM.parts) {             // abi pakopos: metinė lentelė su II ir III dalimis; visos eilutės – Excel lapuose
    document.getElementById('tbLead').textContent = t.tbLeadBoth;
    const ys = [...new Set(rows.map(r => yearOf(r.d)))], pv = (e, i, k) => e.part[i] ? num(e.part[i][k]) : '';
    const ysum = (S, y) => S.rows.filter(r => yearOf(r.d) === y).reduce((a, r) => a + r.ct, 0);
    tb.innerHTML = `<thead><tr><th class="l">${t.th.year}</th><th>${t.th.yc} (II)</th><th>${t.th.yc} (III)</th><th class="bl">${t.th.st}</th><th>${t.th.ye} (II)</th><th>${t.th.ye} (III)</th><th>${t.th.ye}</th><th>${t.th.ret}</th><th>${t.th.retp}</th><th class="bl">${t.th.real}</th><th>${t.th.gainP}</th><th class="bl">${t.th.ann}</th><th>${t.th.rr1}</th></tr></thead><tbody>`
      + ys.map(y => {
        const e = rows.filter(r => yearOf(r.d) === y).pop();
        return `<tr><td class="l">${y}</td><td>${num(ysum(SIM.parts[0], y))}</td><td>${num(ysum(SIM.parts[1], y))}</td><td class="bl">${num(e.st)}</td><td>${pv(e, 0, 'val')}</td><td>${pv(e, 1, 'val')}</td><td>${num(e.val)}</td>`
          + `<td class="${e.ret >= 0 ? 'up' : 'down'}">${num(e.ret)}</td><td>${e.retp == null ? '' : pc(e.retp)}</td><td class="bl">${num(e.realSum)}</td><td>${e.gainP == null ? '' : pc(e.gainP)}</td><td class="bl">${num(e.ann)}</td><td>${e.rr1 == null ? '' : pc(e.rr1)}</td></tr>`;
      }).join('') + '</tbody>';
    document.getElementById('tbNote').textContent = SIM.est.length ? t.estNote(SIM.est.join('; ')) : '';
    return;
  }
  if (ST.tb === 'a') {
    tb.innerHTML = `<thead><tr>${C.map(k => `<th class="${k === 'date' || k === 'fund' ? 'l' : ''}">${t.th[k]}</th>`).join('')}</tr></thead><tbody>`
      + rows.map(r => r.sw ? `<tr class="sw"><td class="l">${dots(r.d)}</td><td class="l" colspan="${iv - 4}">${t.swRow(shortFund(r.sw[0]), shortFund(r.sw[1]))}</td><td>${num(r.price, 4)}</td><td>${num(r.bought, 2)}</td><td>${num(r.units, 2)}</td><td>${num(r.val, 2)}</td><td colspan="${C.length - iv - 1}"></td></tr>`
        : `<tr>${C.map(k => `<td class="${k === 'date' || k === 'fund' ? 'l' : ''}">${cellOf(r, k)}</td>`).join('')}</tr>`).join('') + '</tbody>';
  } else {
    const ys = [...new Set(rows.map(r => yearOf(r.d)))], st = SIM.last.sv > 0;
    tb.innerHTML = `<thead><tr><th class="l">${t.th.year}</th><th class="l">${t.th.fund}</th>${st ? `<th>${t.th.cs}</th>` : ''}<th>${t.th.cd}</th>${st ? `<th>${t.th.cv}</th>` : ''}<th>${t.th.yc}</th><th class="bl">${t.th.st}</th><th>${t.th.ye}</th><th>${t.th.ret}</th><th>${t.th.retp}</th><th class="bl">${t.th.real}</th><th>${t.th.gainP}</th><th class="bl">${t.th.ann}</th><th>${t.th.rr1}</th></tr></thead><tbody>`
      + ys.map(y => {
        const rs = rows.filter(r => yearOf(r.d) === y), e = rs[rs.length - 1], s = k => rs.reduce((a, r) => a + (r[k] || 0), 0);
        return `<tr><td class="l">${y}</td><td class="l">${shortFund(e.fund)}</td>${st ? `<td>${num(s('cs'))}</td>` : ''}<td>${num(s('cd'))}</td>${st ? `<td>${num(s('cv'))}</td>` : ''}<td>${num(s('ct'))}</td><td class="bl">${num(e.st)}</td><td>${num(e.val)}</td>`
          + `<td class="${e.ret >= 0 ? 'up' : 'down'}">${num(e.ret)}</td><td>${e.retp == null ? '' : pc(e.retp)}</td><td class="bl">${num(e.realSum)}</td><td>${e.gainP == null ? '' : pc(e.gainP)}</td><td class="bl">${num(e.ann)}</td><td>${e.rr1 == null ? '' : pc(e.rr1)}</td></tr>`;
      }).join('') + '</tbody>';
  }
  document.getElementById('tbNote').textContent = SIM.est.length ? t.estNote(SIM.est.join('; ')) : '';
}

/* ---------- Excel su formulėmis ---------- */
function loadXlsx() { return new Promise((ok, no) => { if (window.XLSX) return ok(); const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
/* Skaičiavimo lapas vienai pakopai (S = simulate1 rezultatas) */
function calcAoa(S) {
  const t = T(), rows = S.rows, H = t.th, lt = lang === 'lt', N = rows.length + 1;
  // A data, B fondas, C bruto atlyginimas, D Sodra %, E dalyvis %, F valstybė €/mėn., G mėnesių sk., H Sodra €, I dalyvis €, J valstybė €, K įmoka, L vieneto vertė,
  // M įsigyta, N vnt. iš viso, O sukaupta, P Sodra Σ, Q dalyvis Σ, R valstybė Σ, S įmokos Σ, T grąža, U grąža %, V anuitetas, W vid. pensija, X neto DU,
  // Y pensija su kaupimu, Z–AB pakeitimo normos, AC VKI, AD įmokos vertė šiandien, AE Σ, AF pokytis €, AG pokytis %
  const head = [H.date, H.fund, H.wage, 'Sodra %', H.rd, H.rv, lt ? 'Mėnesių' : 'Months', 'Sodra €', H.cd, H.cv, H.ct, H.price, H.bought, H.units, H.val, 'Sodra Σ', H.sd, H.sv, H.st, H.ret, H.retp, H.ann, H.pen, H.net, H.tot, H.rr0, H.rr1, H.rrd, H.cpi, H.real, `Σ ${H.real}`, H.gainE, H.gainP];
  const aoa = [head], ref = rows.length + 3, cpiCell = `$AC$${ref}`;
  rows.forEach((r, i) => {
    const R = i + 2, P1 = i ? R - 1 : null, prev = c => P1 ? `${c}${P1}+` : '';
    const f = (x, v, z) => ({ f: x, v, z });
    const row = [{ v: iso(r.d) }, { v: r.sw ? t.swRow(r.sw[0], r.sw[1]) : r.fund }];
    if (r.sw) row.push(null, null, null, null, null, { v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: r.price, z: '0.0000' }, f(`O${P1}/L${R}`, r.bought, '0.00'), f(`M${R}`, r.units, '0.00'));
    else {
      row.push(r.wage != null ? { v: r.wage, z: '0.00' } : null, { v: (r.rs || 0) / 100, z: '0.00%' }, r.rd != null ? { v: r.rd / 100, z: '0.00%' } : null, r.rv != null ? { v: r.rv, z: '0.00' } : null, { v: r.m || 0 },
        r.wage != null ? f(`C${R}*D${R}*G${R}`, r.cs, '0.00') : { v: 0 },
        r.rd != null ? f(`C${R}*E${R}*G${R}`, r.cd, '0.00') : r.fixed != null ? f(`${r.fixed}*G${R}`, r.cd, '0.00') : { v: r.cd, z: '0.00' },
        r.rv != null ? f(`F${R}*G${R}`, r.cv, '0.00') : { v: 0 },
        f(`H${R}+I${R}+J${R}`, r.ct, '0.00'), { v: r.price, z: '0.0000' }, f(`K${R}/L${R}`, r.bought, '0.00'), f(`${prev('N')}M${R}`, r.units, '0.00'));
    }
    row.push(f(`N${R}*L${R}`, r.val, '0.00'), f(`${prev('P')}H${R}`, r.ss, '0.00'), f(`${prev('Q')}I${R}`, r.sd, '0.00'), f(`${prev('R')}J${R}`, r.sv, '0.00'), f(`P${R}+Q${R}+R${R}`, r.st, '0.00'),
      f(`O${R}-S${R}`, r.ret, '0.00'), r.st ? f(`T${R}/S${R}`, r.retp, '0.00%') : null, f(`O${R}/1000*${J.annuity}`, r.ann, '0.00'),
      r.pen != null ? { v: r.pen, z: '0.00' } : null, r.net != null ? { v: r.net, z: '0.00' } : null,
      r.pen != null ? f(`W${R}+V${R}`, r.tot, '0.00') : null, r.pen != null ? f(`W${R}/X${R}`, r.rr0, '0.00%') : null, r.pen != null ? f(`Y${R}/X${R}`, r.rr1, '0.00%') : null, r.pen != null ? f(`AA${R}-Z${R}`, r.rrd, '0.00%') : null,
      r.cpi != null ? { v: r.cpi, z: '0.00' } : null, r.cpi != null ? f(`K${R}*${cpiCell}/AC${R}`, r.real, '0.00') : { v: 0 }, f(`${prev('AE')}AD${R}`, r.realSum, '0.00'),
      f(`O${R}-AE${R}`, r.gainE, '0.00'), r.realSum ? f(`AF${R}/AE${R}`, r.gainP, '0.00%') : null);
    aoa.push(row);
  });
  aoa.push([]);
  const refRow = new Array(33).fill(null); refRow[0] = { v: t.xLatestCpi }; refRow[28] = { v: S.cpiRef, z: '0.00' };
  aoa.push(refRow);
  aoa.push([{ v: t.info.tbl }]);
  if (S.est.length) aoa.push([{ v: t.estNote(S.est.join('; ')) }]);
  return { aoa, head, N };
}

/* Abiejų pakopų suvestinė: B = II, C = III, D = iš viso (formulės nurodo paskutines abiejų skaičiavimo lapų eilutes) */
function sumBoth(calcs, names) {
  const t = T(), lt = lang === 'lt', [a, b] = SIM.parts, L = SIM.last, z = '#,##0.00';
  const R = (k, c) => `'${names[k]}'!${c}${calcs[k].N}`;
  const line = (label, col, va, vb, row) => [{ v: label }, { f: R(0, col), v: va, z }, { f: R(1, col), v: vb, z }, { f: `B${row}+C${row}`, v: va + vb, z }];
  const out = [[{ v: `${t.sumTitle} · ${plL('both')} · ${iso(SIM.P.asof)}` }], [], [{ v: lt ? 'Šaltinis' : 'Source' }, { v: t.pl2 }, { v: t.pl3 }, { v: lt ? 'Iš viso' : 'Total' }]];
  out.push(line('Sodra', 'P', a.last.ss, b.last.ss, 4), line(t.srcName.v, 'R', a.last.sv, b.last.sv, 5), line(t.srcName.d, 'Q', a.last.sd, b.last.sd, 6));
  out.push([{ v: lt ? 'Įmokos iš viso' : 'Contributions total' }, { f: 'B4+B5+B6', v: a.last.st, z }, { f: 'C4+C5+C6', v: b.last.st, z }, { f: 'D4+D5+D6', v: L.st, z }]);
  out.push([{ v: t.srcName.r }, { f: 'B9-B7', v: a.last.ret, z }, { f: 'C9-C7', v: b.last.ret, z }, { f: 'D9-D7', v: L.val - L.st, z }]);
  out.push(line(t.kAssets, 'O', a.last.val, b.last.val, 9));
  out.push([]);
  out.push(line(t.kReal, 'AE', a.last.realSum, b.last.realSum, 11));
  out.push([{ v: t.kGainE }, { f: 'B9-B11', v: a.last.gainE, z }, { f: 'C9-C11', v: b.last.gainE, z }, { f: 'D9-D11', v: L.gainE, z }]);
  out.push([{ v: t.kGainP }, { f: 'B12/B11', v: a.last.gainP, z: '0.00%' }, { f: 'C12/C11', v: b.last.gainP, z: '0.00%' }, { f: 'D12/D11', v: L.gainP, z: '0.00%' }]);
  out.push([{ v: t.kAnn }, null, null, { f: `D9/1000*${J.annuity}`, v: L.ann, z }]);
  out.push([{ v: t.info.both }]);
  return out;
}

function book() {
  const t = T(), rows = SIM.rows, H = t.th, lt = lang === 'lt';
  const cell = c => c == null ? null : c.f ? { t: 'n', f: c.f, v: c.v, z: c.z } : typeof c.v === 'number' ? { t: 'n', v: c.v, z: c.z } : { t: 's', v: c.v };
  const parts = SIM.parts || [SIM], names = SIM.parts ? [`${t.xSheets[0]} II`, `${t.xSheets[0]} III`] : [t.xSheets[0]];
  const calcs = parts.map(calcAoa), { head } = calcs[0];
  const CS = `'${names[0]}'!`, L = SIM.last, N = calcs[0].N;
  // Suvestinė: kiek prisidėjo kiekvienas šaltinis (formulės nurodo paskutinę skaičiavimo eilutę)
  const sum = SIM.parts ? sumBoth(calcs, names) : [[{ v: `${t.sumTitle} · ${plL(P.pl)} · ${iso(P.asof)}` }], [],
    [{ v: lt ? 'Šaltinis' : 'Source' }, { v: '€' }, { v: lt ? 'Turto dalis' : 'Share of assets' }],
    [{ v: 'Sodra' }, { f: `${CS}P${N}`, v: L.ss, z: '#,##0.00' }, { f: `B4/B9`, v: L.ss / L.val, z: '0.0%' }],
    [{ v: t.srcName.v }, { f: `${CS}R${N}`, v: L.sv, z: '#,##0.00' }, { f: `B5/B9`, v: L.sv / L.val, z: '0.0%' }],
    [{ v: t.srcName.d }, { f: `${CS}Q${N}`, v: L.sd, z: '#,##0.00' }, { f: `B6/B9`, v: L.sd / L.val, z: '0.0%' }],
    [{ v: lt ? 'Įmokos iš viso' : 'Contributions total' }, { f: `B4+B5+B6`, v: L.st, z: '#,##0.00' }, { f: `B7/B9`, v: L.st / L.val, z: '0.0%' }],
    [{ v: t.srcName.r }, { f: `B9-B7`, v: L.ret, z: '#,##0.00' }, { f: `B8/B9`, v: L.ret / L.val, z: '0.0%' }],
    [{ v: t.kAssets }, { f: `${CS}O${N}`, v: L.val, z: '#,##0.00' }, { f: `B9/B9`, v: 1, z: '0.0%' }], [],
    [{ v: t.kReal }, { f: `${CS}AE${N}`, v: L.realSum, z: '#,##0.00' }],
    [{ v: t.kGainE }, { f: `B9-B11`, v: L.gainE, z: '#,##0.00' }], [{ v: t.kGainP }, { f: `B12/B11`, v: L.gainP, z: '0.00%' }],
    [{ v: t.kAnn }, { f: `${CS}V${N}`, v: L.ann, z: '#,##0.00' }], [],
    [{ v: t.th.year }, { v: `Sodra €` }, { v: t.th.cv }, { v: t.th.cd }, { v: t.th.yc }, { v: t.th.st }, { v: t.th.ye }, { v: t.th.ret }]];
  if (!SIM.parts) [...new Set(rows.map(r => yearOf(r.d)))].forEach(y => {    // pagal metus: SUM per tų metų eilutes
    const idx = rows.map((r, i) => [r, i + 2]).filter(([r]) => yearOf(r.d) === y), a = idx[0][1], b = idx[idx.length - 1][1], rs = idx.map(x => x[0]), e = rs[rs.length - 1], s = k => rs.reduce((q, r) => q + (r[k] || 0), 0);
    sum.push([{ v: y }, { f: `SUM(${CS}H${a}:H${b})`, v: s('cs'), z: '#,##0.00' }, { f: `SUM(${CS}J${a}:J${b})`, v: s('cv'), z: '#,##0.00' }, { f: `SUM(${CS}I${a}:I${b})`, v: s('cd'), z: '#,##0.00' },
      { f: `SUM(${CS}K${a}:K${b})`, v: s('ct'), z: '#,##0.00' }, { f: `${CS}S${b}`, v: e.st, z: '#,##0.00' }, { f: `${CS}O${b}`, v: e.val, z: '#,##0.00' }, { f: `${CS}T${b}`, v: e.ret, z: '#,##0.00' }]);
  });
  const wsS = XLSX.utils.aoa_to_sheet(sum.map(r => r.map(cell))); wsS['!cols'] = [{ wch: 34 }, ...Array(7).fill({ wch: 16 })];
  const wss = calcs.map(c => { const ws = XLSX.utils.aoa_to_sheet(c.aoa.map(r => r.map(cell))); ws['!cols'] = head.map((h, i) => ({ wch: i === 1 ? 34 : 13 })); return ws; });
  const inp = [[t.xIn[0]], ['', 'Sodra', t.srcName.v, H.rd, `${H.rd} (${t.rGrad})`], ...J.rates.map(r => r.map(x => x == null ? '' : x)), [],
    [t.xIn[1]], [H.year, 'Bruto', 'Neto'], ...Object.entries(J.wages).map(([y, w]) => [+y, w[0], w[1]]), [],
    [t.xIn[5]], [H.year, 'Bruto', 'Neto'], ...Object.entries(J.minWage).map(([y, w]) => [+y, w[0], w[1] ?? '']), [],
    [t.xIn[2]], ...Object.entries(J.pensions).map(([y, v]) => [+y, v]), [],
    [t.xIn[3]], [H.year, t.rMax, t.rGrad], ...Object.entries(J.incentive).map(([y, v]) => [+y, v[0], v[1]]), [],
    [t.xIn[4]], ...Object.entries(J.cpi).map(([m, v]) => [m, v]), [],
    [t.ann.h[0]], ...(() => { const A = J.annuityModel, lt = lang === 'lt'; return [
      [lt ? 'Amžius' : 'Age', A.age], [lt ? 'Grąža per metus' : 'Return per year', A.rate], [lt ? 'Administravimo mokestis' : 'Administration fee', A.fee], [lt ? 'Moterų dalis' : 'Share of women', A.women],
      [lt ? 'Anuiteto koeficientas (metais)' : 'Annuity factor (years)', A.ax], [lt ? 'Suderinimas su Sodros pavyzdžiu' : 'Match to Sodra’s example', A.cal],
      [t.ann.std + ', € / 1000 €', A.std], [t.ann.inh + ', € / 1000 €', A.inh], [`${t.ann.def} (${t.ann.defP}), € / 1000 €`, A.defPer], [`${t.ann.def} (${t.ann.defA}), € / 1000 €`, A.defAnn]]; })()];
  const wi = XLSX.utils.aoa_to_sheet(inp); wi['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsS, t.xSheets[2]); wss.forEach((ws, i) => XLSX.utils.book_append_sheet(wb, ws, names[i])); XLSX.utils.book_append_sheet(wb, wi, t.xSheets[1]);
  const wsr = XLSX.utils.aoa_to_sheet(srcText()); wsr['!cols'] = [{ wch: 140 }]; XLSX.utils.book_append_sheet(wb, wsr, t.srcLink);
  return wb;
}
/* šaltiniai, prielaidos ir galimi netikslumai (puslapio apačioje; nuoroda – santraukos antraštėje) */
function renderSources() {
  const S = T().src;
  document.getElementById('srcTitle').textContent = S.title;
  document.getElementById('srcBody').innerHTML = `<p class="lead">${S.lead}</p>` + S.g.map(([h, items]) => `<h3 class="sub3">${h}</h3><ul class="srcl">${items.map(x => `<li>${x}</li>`).join('')}</ul>`).join('');
}
const srcText = () => { const S = T().src, txt = h => h.replace(/<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g, '$2 ($1)'); return [[S.title], [txt(S.lead)], ...S.g.flatMap(([h, items]) => [[], [h], ...items.map(x => ['• ' + txt(x)])])]; };
async function download() { await loadXlsx(); XLSX.writeFile(book(), `${lang === 'lt' ? 'Kelias_i_pensija' : 'Retirement_journey'}_${P.pl}_${P.birth}_${iso(P.asof)}.xlsx`); }

function renderAll() {
  document.getElementById('sub').textContent = `${T().navJourney} · ${T().updated} ${JDATA.generated}`;
  P = params(); SIM = simulate(P);
  renderBar();
  if (!SIM) return;
  renderKpis(); renderAnnuity(); renderStory(); renderCompare(); renderChart(); renderIdx(); renderGrid(); renderTable();
  renderSources();
  document.getElementById('foot').textContent = T().foot;
  if (typeof renderInsights === 'function') renderInsights();
}
document.addEventListener('click', e => {
  if (e.target.closest('.xls')) { download().catch(err => alert('Excel: ' + err)); return; }
  const pop = document.getElementById('pop'), b = e.target.closest('.info');
  if (!b) { if (!e.target.closest('#pop')) pop.style.display = 'none'; return; }
  e.stopPropagation();
  if (pop.style.display === 'block' && pop._b === b) { pop.style.display = 'none'; return; }
  const t = T(), k = b.dataset.k; pop.textContent = (t.info[k] || '') + (t.acc[k] ? `\n\n${t.accL}${t.acc[k]}` : ''); pop._b = b; pop.style.display = 'block';
  const r = b.getBoundingClientRect(), w = pop.offsetWidth;
  pop.style.left = Math.max(8, Math.min(r.left + scrollX - 8, scrollX + document.documentElement.clientWidth - w - 8)) + 'px'; pop.style.top = (r.bottom + scrollY + 6) + 'px';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('pop').style.display = 'none'; });
addEventListener('resize', () => { clearTimeout(window._rz); window._rz = setTimeout(() => SIM && renderChart(), 150); });
renderHeader('journey', renderAll);
renderAll();
