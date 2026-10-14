/* Ataskaitų polapis, 4 dalis: pusmečio ataskaitos lentelės bet kuriam fondui (II ir III pakopa), ta pačia tvarka kaip
   SEB pusmečio ataskaitose (savininko užduotis 2026-10-14). Pozicijos – Lietuvos banko ketvirčio portfelių ataskaitos (data_pf.js,
   kraunama tik prireikus), vieneto vertės ir turtas – data_rep.js. Skaičiavimai patikrinti su SEB 2024–2026 m. pusmečio ataskaitomis.
   Naudoja rep.js kintamuosius (REP, M, ST, XB, pt, feeParts ...) – įkeliamas prieš rep.js, funkcijos kviečiamos vėliau. */
addStrings({
  hyTitle: 'Half-year report tables',
  hyLead: 'Any fund (II or III pillar) laid out as in the providers’ half-year reports: fees, risky assets, sustainability (SFDR), returns, the largest holdings, asset types and regions. Holdings come from the Bank of Lithuania quarterly portfolio reports, so the date is a quarter end.',
  hyLoading: 'Loading portfolio data…', hyNoPf: 'No Bank of Lithuania portfolio report for this fund on this date.',
  hyNav: 'Net assets', hyUv: 'Unit value', hyStart: 'Start of operations',
  t1: '1. Fees charged to participants', t2: '2. Risky and less risky assets according to the investment strategy, %', t3: '3. Sustainable investments in the fund, %',
  t4: '4. Average annual return of the fund and the benchmark over different periods', t5: '5. Fund return, %', t6: '6. Portfolio composition (largest holdings)',
  t7: '7. Actual breakdown of investments by type, %', t8: '8. Investments by region, %',
  fee: 'Fee', feeMax: 'Maximum set in the rules', feeAct: 'Actually applied', feeMgmt: 'Asset management fee', feeCo: 'Change of company', feeFund: 'Change of fund',
  feeAvg: '% of average annual net assets', feeTr: '% of the amount transferred', feeNa: 'no data', feeLaw: 'by law',
  feeWin: (a, b, r) => `* ${a}–${b} a reduced ${num(r, 2)} % fee was applied (the manager’s half-year report).`,
  feeNote: y => `Fees: Bank of Lithuania fee files ${y}; the maximum for the II pillar is the statutory cap. The maximum fees in the III pillar fund rules are not collected.`,
  rsStrat: 'By the investment strategy', rsAct: 'At the end of the period', rsRisky: 'Risky assets', rsLess: 'Less risky assets',
  rsNote: d => `Strategy: Bank of Lithuania results report (${d}); shown only for that date. Actual: equities (direct, equity funds, global private equity) + other investments (real estate, private equity, infrastructure) as a share of net assets.`,
  sf8: 'Article 8', sf9: 'Article 9', sf6: 'Article 6', sfDirect: 'Direct shares and bonds (SFDR does not apply)', sfCash: 'Cash, deposits and other', sfUnk: 'Funds with no SFDR data',
  sfNote: 'SFDR article of each fund or ETF held (issuers’ documents). Unlike some managers, direct shares and bonds are not classified, so the figures differ from the managers’ own reports.',
  r4cols: ['6 mo.', '1 yr', '3 yrs', '5 yrs', 'Since start'],
  r4f: 'Average fund return, %', r4b: 'Average benchmark return, %', r4s: 'Standard deviation of the unit value change**, %', r4sb: 'Standard deviation of the benchmark change, %',
  r4note: '6 months and 1 year: cumulative change; 3 and 5 years and since start: geometric average a year. ** 6 months: standard deviation of daily changes × √126; other periods × √252.',
  r5f: 'Fund return, %', r5b: 'Benchmark return, %', ytdNow: d => `YTD (to ${d})`, ytdHalf: (y, d) => d.endsWith('06-30') ? `${y} (H1)` : `${y} (to ${d})`, partYear: '* part of the year (the fund started that year)',
  top: 'Name of the largest holdings', weight: 'Weight, %',
  ty: { mm: 'Money market instruments', eq: 'Equities', cb: 'Corporate bonds', gb: 'Government bonds', ot: 'Other investments' },
  rg: { emEq: 'Emerging market equities', dmEq: 'Developed market equities', cb: 'Global corporate bonds', ot: 'Other investments', emGb: 'Emerging market government bonds', dmGb: 'Developed market government bonds', lt: 'Lithuanian government and corporate bonds' },
  share: 'Share, %',
  tyNote: 'Share of net assets. Money market instruments = cash, deposits, money market funds and the rest of net assets (accrued items, derivatives), so the total is 100 %.',
  hyXls: 'Excel with all calculations', hyXlsTip: 'Half-year report tables of the fund chosen below: every figure is an Excel formula over the holdings, unit values and daily changes, so each number can be checked.',
  sheetPos: 'Holdings', sheetHy: 'Report tables', yes: 'Yes', no: 'No', posSum: 'Sum of holdings, €',
  posNote: 'Source: Bank of Lithuania quarterly portfolio report (value of each holding, €). Columns L–O show how each holding is assigned; the tables sheet sums column J with SUMIF by these labels and divides by net assets (row below the sum).',
  posH: ['#', 'Name', 'ISIN / code', 'Kind', 'Country', 'Asset class (fund data)', 'Region (fund data)', 'EM', 'SFDR', 'Value, €', 'Weight, %', 'Type (table 7)', 'Region (table 8)', 'SFDR group (table 3)', 'Risky (table 2)'],
  kinds: { e: 'share', b: 'bond', f: 'fund', c: 'cash / deposit', d: 'derivative' },
  navRow: 'Net assets (NAV), € – denominator of every share',
  infoHy: 'Date: a quarter end (Bank of Lithuania portfolio reports are quarterly).\n\n1. Fees: Bank of Lithuania fee file; reduced fee windows are taken from the managers’ reports.\n2. Risky assets: strategy share from the Bank of Lithuania results report; actual share = equities + other investments ÷ net assets.\n3. SFDR: article of each fund held ÷ net assets.\n4. Returns from month-end unit values: 6 months and 1 year cumulative, 3 and 5 years and since start annualized (years = months ÷ 12; since start of a III pillar fund – days ÷ 365.25). Standard deviation: sample standard deviation of daily changes on days when the unit value changed × √252 (6 months × √126).\n5. Calendar years: 31 Dec to 31 Dec; the current year to the chosen date and to the latest day.\n6.–8. Holdings value ÷ net assets on the date. Type: direct shares, equity funds and global private equity = equities; bond funds and bonds split into government (issuer is a state or a state agency, or a government bond fund) and corporate; cash, deposits and money market funds = money market. Region: equities by issuer country or fund focus (emerging = not MSCI developed, so Baltic shares count as emerging); Lithuanian issuers’ bonds separately.\n\nChecked against the SEB half-year reports of 2024, 2025 and 2026: differences come only from how a few securities are classified.',
}, {
  hyTitle: 'Pusmečio ataskaitos lentelės',
  hyLead: 'Bet kuris fondas (II ar III pakopos) taip, kaip valdytojų pusmečio ataskaitose: mokesčiai, rizikingi aktyvai, tvarumas (SFDR), grąža, didžiausios pozicijos, investicijų rūšys ir regionai. Pozicijos – iš Lietuvos banko ketvirčio portfelių ataskaitų, todėl data – ketvirčio pabaiga.',
  hyLoading: 'Kraunami portfelių duomenys…', hyNoPf: 'Šiai datai šio fondo Lietuvos banko portfelio ataskaitos nėra.',
  hyNav: 'Grynųjų aktyvų vertė', hyUv: 'Apskaitos vieneto vertė', hyStart: 'Veiklos pradžia',
  t1: '1. Dalyviams taikomi mokesčiai', t2: '2. Rizikingų ir mažiau rizikingų aktyvų pasiskirstymas pagal investavimo strategiją, proc.', t3: '3. Tvarių investicijų pasiskirstymas fonde, proc.',
  t4: '4. Pensijų fondo ir lyginamojo indekso vidutinė metinė grąža skirtingais laikotarpiais', t5: '5. Fondo grąža, proc.', t6: '6. Informacija apie investicinių priemonių portfelio sudėtį',
  t7: '7. Faktinis investicijų pasiskirstymas pagal rūšį, proc.', t8: '8. Investicijos pagal regionus, proc.',
  fee: 'Mokestis', feeMax: 'Taisyklėse numatyti maksimalūs dydžiai', feeAct: 'Faktiškai taikyti dydžiai', feeMgmt: 'Turto valdymo mokestis', feeCo: 'Įmonės keitimas', feeFund: 'Fondo keitimas',
  feeAvg: 'proc. (nuo vidutinės metinės vertės)', feeTr: 'proc. (nuo pervedamų piniginių lėšų)', feeNa: 'duomenų nėra', feeLaw: 'pagal įstatymą',
  feeWin: (a, b, r) => `* ${a}–${b} taikytas sumažintas ${num(r, 2)} proc. mokestis (valdytojo pusmečio ataskaita).`,
  feeNote: y => `Mokesčiai: Lietuvos banko mokesčių failai (${y}); II pakopos maksimalus dydis – įstatymo riba. III pakopos fondų taisyklių maksimalūs dydžiai nerenkami.`,
  rsStrat: 'Pagal investavimo strategiją', rsAct: 'Ataskaitinio laikotarpio pabaigoje', rsRisky: 'Rizikingi aktyvai', rsLess: 'Mažiau rizikingi aktyvai',
  rsNote: d => `Strategija – Lietuvos banko rezultatų ataskaita (${d}); rodoma tik tai datai. Faktinė dalis = akcijos (tiesioginės, akcijų fondai, pasaulio privataus kapitalo fondai) + kitos investicijos (nekilnojamasis turtas, privatus kapitalas, infrastruktūra) nuo grynųjų aktyvų.`,
  sf8: 'Straipsnis 8', sf9: 'Straipsnis 9', sf6: 'Straipsnis 6', sfDirect: 'Tiesioginės akcijos ir obligacijos (SFDR netaikomas)', sfCash: 'Pinigai, indėliai ir kita', sfUnk: 'Fondai be SFDR duomenų',
  sfNote: 'Kiekvieno turimo fondo ar ETF SFDR straipsnis (leidėjų dokumentai). Tiesioginės akcijos ir obligacijos neklasifikuojamos (kai kurie valdytojai jas priskiria), todėl skaičiai skiriasi nuo valdytojų ataskaitų.',
  r4cols: ['6 mėn.', '1 metai', '3 metai', '5 metai', 'Nuo veiklos pradžios'],
  r4f: 'Vidutinė pensijų fondo grąža, proc.', r4b: 'Vidutinė lyginamojo indekso grąža, proc.', r4s: 'Apskaitos vieneto vertės pokyčio standartinis nuokrypis**, proc.', r4sb: 'Lyginamojo indekso pokyčio standartinis nuokrypis, proc.',
  r4note: '6 mėn. ir 1 metai – sukauptas pokytis; 3 ir 5 metai bei nuo veiklos pradžios – metinių pokyčių geometrinis vidurkis. ** 6 mėn. – dienos pokyčių standartinis nuokrypis × √126; kiti laikotarpiai × √252.',
  r5f: 'Fondo grąža, proc.', r5b: 'Lyginamojo indekso grąža, proc.', ytdNow: d => `YTD (iki ${d})`, ytdHalf: (y, d) => d.endsWith('06-30') ? `${y} m. (I pusmetis)` : `${y} m. (iki ${d})`, partYear: '* dalis metų (fondas pradėjo veikti tais metais)',
  top: 'Didžiausių pozicijų pavadinimai', weight: 'Svoris, proc.',
  ty: { mm: 'Pinigų rinkos priemonės', eq: 'Akcijos', cb: 'Įmonių obligacijos', gb: 'Vyriausybių obligacijos', ot: 'Kitos investicijos' },
  rg: { emEq: 'Besivystančių šalių akcijos', dmEq: 'Išsivysčiusių šalių akcijos', cb: 'Pasaulio įmonių obligacijos', ot: 'Kitos investicijos', emGb: 'Besivystančių šalių vyriausybių obligacijos', dmGb: 'Išsivysčiusių šalių vyriausybių obligacijos', lt: 'Lietuvos Respublikos vyriausybės ir įmonių obligacijos' },
  share: 'Dalis, proc.',
  tyNote: 'Dalis nuo grynųjų aktyvų. Pinigų rinkos priemonės = pinigai, indėliai, pinigų rinkos fondai ir likusi grynųjų aktyvų dalis (sukauptos sumos, išvestinės priemonės), todėl iš viso – 100 %.',
  hyXls: 'Excel su visais skaičiavimais', hyXlsTip: 'Žemiau pasirinkto fondo pusmečio ataskaitos lentelės: kiekvienas skaičius – Excel formulė iš pozicijų, vieneto verčių ir dienos pokyčių, todėl kiekvieną galima patikrinti.',
  sheetPos: 'Pozicijos', sheetHy: 'Ataskaitos lentelės', yes: 'Taip', no: 'Ne', posSum: 'Pozicijų suma, €',
  posNote: 'Šaltinis: Lietuvos banko ketvirčio portfelių ataskaita (kiekvienos pozicijos vertė, €). Stulpeliai L–O rodo, kur pozicija priskirta; lentelių lape stulpelis J sumuojamas SUMIF pagal šias žymes ir dalijamas iš grynųjų aktyvų (eilutė po suma).',
  posH: ['#', 'Pavadinimas', 'ISIN / kodas', 'Rūšis', 'Šalis', 'Turto klasė (fondo duomenys)', 'Regionas (fondo duomenys)', 'EM', 'SFDR', 'Vertė, €', 'Svoris, %', 'Rūšis (7 lentelė)', 'Regionas (8 lentelė)', 'SFDR grupė (3 lentelė)', 'Rizikingas (2 lentelė)'],
  kinds: { e: 'akcija', b: 'obligacija', f: 'fondas', c: 'pinigai / indėlis', d: 'išvestinė priemonė' },
  navRow: 'Grynųjų aktyvų vertė (NAV), € – visų dalių vardiklis',
  infoHy: 'Data – ketvirčio pabaiga (Lietuvos banko portfelių ataskaitos ketvirtinės).\n\n1. Mokesčiai – Lietuvos banko mokesčių failas; sumažinto mokesčio laikotarpiai – iš valdytojų ataskaitų.\n2. Rizikingi aktyvai: strategijos dalis – Lietuvos banko rezultatų ataskaita; faktinė = akcijos + kitos investicijos ÷ grynieji aktyvai.\n3. SFDR: kiekvieno turimo fondo straipsnis ÷ grynieji aktyvai.\n4. Grąža iš mėnesių pabaigos vieneto verčių: 6 mėn. ir 1 metai – sukaupta, 3 ir 5 metai bei nuo veiklos pradžios – metinė (metai = mėnesiai ÷ 12; III pakopos fondo nuo veiklos pradžios – dienos ÷ 365,25). Standartinis nuokrypis – dienų, kai pasikeitė vieneto vertė, pokyčių imties standartinis nuokrypis × √252 (6 mėn. × √126).\n5. Kalendoriniai metai: nuo gruodžio 31 d. iki gruodžio 31 d.; einamieji metai – iki pasirinktos datos ir iki paskutinės dienos.\n6.–8. Pozicijos vertė ÷ grynieji aktyvai tą dieną. Rūšis: tiesioginės akcijos, akcijų fondai ir pasaulio privataus kapitalo fondai = akcijos; obligacijų fondai ir obligacijos skirstomi į vyriausybių (leidėjas – valstybė ar valstybės įstaiga, arba vyriausybių obligacijų fondas) ir įmonių; pinigai, indėliai ir pinigų rinkos fondai = pinigų rinkos priemonės. Regionas: akcijos – pagal leidėjo šalį arba fondo kryptį (besivystančios = ne MSCI išsivysčiusios, todėl Baltijos akcijos – besivystančių); Lietuvos leidėjų obligacijos – atskirai.\n\nPatikrinta su SEB 2024, 2025 ir 2026 m. pusmečio ataskaitomis: skirtumai atsiranda tik dėl kelių vertybinių popierių priskyrimo.',
});

/* ---------- klasifikavimas ---------- */
const DM_EQ = new Set('AT BE DK FI FR DE IE IL IT NL NO PT ES SE CH GB US CA JP AU NZ HK SG LU'.split(' '));   // MSCI išsivysčiusios
const DM_GB = new Set([...DM_EQ, 'SI', 'SK', 'LV', 'EE', 'CY', 'MT', 'HR', 'CZ', 'GR']);                      // + kitos euro zonos / ES valstybės
const GOV_ISSUER = /vyriausyb|respublik|karalyst|federacin|government|republic|kingdom|treasury|bundes|valstybės investicinis kapitalas|staatsanleihe|\bstate of\b/i;
const GOV_FUND = /govern|govt|treasur|sovereign|local currency|\bgov\b|staatsanleihen|state bond/i;
const EM_NAME = /emerging|\bem\b|frontier/i;
/* pozicija -> {ty: rūšis (mm/eq/cb/gb/ot), rg: regionas, sf: SFDR grupė, risky: 0/1} */
function classify(sec, country) {
  const [name, kind, , , kis, , , , full, a] = sec;
  const at = a || [], ac = at[0] || '', reg = at[1] || '', em = at[2] || '', nm = `${full || ''} ${name}`;
  let ty = 'ot', rg = 'ot', sf = 'unk';
  if (kind === 'c') { ty = 'mm'; rg = 'ot'; sf = 'cash'; }
  else if (kind === 'd') { ty = 'mm'; rg = 'ot'; sf = 'cash'; }
  else if (kind === 'e') { ty = 'eq'; rg = DM_EQ.has(country) ? 'dmEq' : 'emEq'; sf = 'direct'; }
  else if (kind === 'b') {
    ty = GOV_ISSUER.test(name) ? 'gb' : 'cb'; sf = 'direct';
    rg = country === 'LT' ? 'lt' : ty === 'cb' ? 'cb' : DM_GB.has(country) ? 'dmGb' : 'emGb';
  } else {                                     // fondas / ETF
    sf = at[4] === '8' ? 'a8' : at[4] === '9' ? 'a9' : at[4] === '6' ? 'a6' : 'unk';
    const isEm = em === 'only' || reg === 'em' || reg === 'em_ex_china' || (!em && !reg && EM_NAME.test(nm));
    const cls = ac || ({ '1': 'bond', '3': 'equity', '4': 'money_market', '5': 'real_estate' })[kis] || 'other';
    if (cls === 'equity' || (cls === 'private_equity' && /^(global|global_dm|us)$/.test(reg))) { ty = 'eq'; rg = isEm ? 'emEq' : 'dmEq'; }
    else if (cls === 'bond') { ty = GOV_FUND.test(nm) ? 'gb' : 'cb'; rg = ty === 'cb' ? 'cb' : isEm ? 'emGb' : 'dmGb'; }
    else if (cls === 'money_market') { ty = 'mm'; rg = 'ot'; }
    else { ty = 'ot'; rg = 'ot'; }
  }
  return { ty, rg, sf, risky: ty === 'eq' || ty === 'ot' ? 1 : 0 };
}

/* ---------- duomenys ---------- */
const HAS_PF = () => typeof PF !== 'undefined';            // data_pf.js: „const PF“ – ne window savybė
let PF_P = null;
function loadPf() {
  if (!PF_P) PF_P = new Promise(ok => { const s = document.createElement('script'); s.src = document.body.dataset.pf || 'data_pf.js'; s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
  return PF_P;
}
const normName = s => s.toLowerCase().replace(/^(swedbank|seb|luminor|artea|goindex|allianz)\s+/, '').replace(/[\s–-]+/g, '');
function pfFundOf(f) {                       // REP fondas -> PF fondas (II pakopa – pagal valdytoją ir grupę, III – pagal pavadinimą)
  if (!HAS_PF()) return null;
  const P = MLABEL[f.p];
  if (f.pl === 'II') return PF.funds.find(x => x.pl === 'II' && x.p === P && x.g === f.g) || null;
  const n = normName(f.n);
  return PF.funds.find(x => x.pl === 'III' && x.p === P && normName(x.full) === n) || PF.funds.find(x => x.pl === 'III' && x.p === P && normName(x.n) === n) || null;
}
function holdings(pf, qd) {                  // qd – 'YYYY-MM-DD'; grąžina [{s: sec index, v: vertė}]
  const qi = PF.quarters.indexOf(qd); if (qi < 0 || !pf) return null;
  const by = new Map();
  for (let k = 0; k < pf.r.length; k += 4) if (pf.r[k] === qi) by.set(pf.r[k + 1], (by.get(pf.r[k + 1]) || 0) + pf.r[k + 3]);
  return by.size ? [...by].map(([s, v]) => ({ s, v })) : null;
}
const secName = s => { const x = PF.secs[s]; return x[8] || x[0]; };

/* ---------- vaizdas ---------- */
function hyQuarters() {                      // ketvirčių pabaigos (naujausia pirmiau), kurioms yra mėnesio vertės
  const out = [];
  for (let i = NM - 1; i > 0; i--) if (monthOf(M[i]) % 3 === 2 && yearOf(M[i]) >= 2019) out.push(i);
  return out;
}
function renderHy() {
  const all = REP.funds.filter(f => f.p === ST.m).sort((a, b) => (a.pl > b.pl) - (a.pl < b.pl) || (a.pl === 'II' ? ORDER2.indexOf(a.g) - ORDER2.indexOf(b.g) : ORDER3.indexOf(a.g) - ORDER3.indexOf(b.g) || a.n.localeCompare(b.n)));
  if (!all.some(f => REP.funds.indexOf(f) === +ST.hf)) ST.hf = String(REP.funds.indexOf(all.find(f => f.g === '1968-1974') || all[0]));
  const f = REP.funds[+ST.hf];
  const qs = hyQuarters().filter(i => !HAS_PF() || PF.quarters.includes(iso(M[i])));   // tik ketvirčiai su LB portfelių ataskaita
  if (!qs.includes(+ST.hq)) ST.hq = String(qs[0]);
  const bi = +ST.hq;
  const bar = document.getElementById('hyBar');
  bar.innerHTML = field(T().fund, `<select data-hf>${['II', 'III'].map(pl => `<optgroup label="${pl === 'II' ? T().pl2 : T().pl3}">${all.filter(x => x.pl === pl).map(x => `<option value="${REP.funds.indexOf(x)}"${x === f ? ' selected' : ''}>${shortName(x)}</option>`).join('')}</optgroup>`).join('')}</select>`)
    + field(T().asof, `<select data-hq>${qs.map(i => `<option value="${i}"${i === bi ? ' selected' : ''}>${T().qLabel(yearOf(M[i]), (monthOf(M[i]) + 1) / 3, short(M[i]))}</option>`).join('')}</select>`)
    + `<button class="btn xls" type="button" data-x="hy">⤓ ${T().hyXls}</button>`;
  bar.querySelector('[data-hf]').onchange = e => { ST.hf = e.target.value; save(); renderHy(); };
  bar.querySelector('[data-hq]').onchange = e => { ST.hq = e.target.value; save(); renderHy(); };
  document.getElementById('hyTitle').innerHTML = `${T().hyTitle} ${ik('hy')}`;
  document.getElementById('hyLead').textContent = T().hyLead;
  const body = document.getElementById('hyBody');
  if (!HAS_PF()) { body.innerHTML = `<p class="na">${T().hyLoading}</p>`; return; }

  const xb = new XB(), qd = iso(M[bi]), pf = pfFundOf(f), H = holdings(pf, qd);
  const nav = f.am && f.am[bi] ? f.am[bi] : H ? H.reduce((s, h) => s + h.v, 0) : null;
  const uv = f.m[bi];
  const card = (t, html, note = '') => `<section class="card hy"><h3>${t}</h3><div class="scroll">${html}</div>${note ? `<p class="note">${note}</p>` : ''}</section>`;
  const p2 = v => v == null ? '–' : num(v, 2);
  let out = `<div class="hyhead"><b>${f.n}</b> · ${T().hyNav}: <b>${nav ? num(nav, 0) + ' €' : '–'}</b> · ${T().hyUv}: <b>${uv != null ? num(uv, 4) + ' €' : '–'}</b> · ${short(M[bi])}</div>`;

  /* 1. mokesčiai */
  const yr = yearOf(M[bi]), wins = FEE_WINDOWS.filter(w => w.p === f.p && w.pl === f.pl && !w.not.includes(f.g) && yearOf(w.from) === yr);
  const feeTxt = f.fee == null ? T().feeNa : wins.length ? `${num(Math.min(f.fee, ...wins.map(w => w.rate)), 2)} – ${num(f.fee, 2)} ${T().feeAvg}*` : `${num(f.fee, 2)} ${T().feeAvg}`;
  const maxMg = f.pl === 'II' && f.g !== 'turto' ? `0,50 ${T().feeAvg} (${T().feeLaw})` : '–';
  const maxSw = f.pl === 'II' ? `0,05 ${T().feeTr} (${T().feeLaw})` : '–';
  out += card(T().t1, `<table class="rt"><thead><tr><th class="l">${T().fee}</th><th class="l">${T().feeMax}</th><th class="l">${T().feeAct}</th></tr></thead><tbody>`
    + `<tr><td class="l">${T().feeMgmt}</td><td class="l">${maxMg}</td><td class="l">${feeTxt}</td></tr>`
    + (f.pl === 'II' ? `<tr><td class="l">${T().feeCo}</td><td class="l">${maxSw}</td><td class="l na">${T().feeNa}</td></tr><tr><td class="l">${T().feeFund}</td><td class="l">${maxSw}</td><td class="l na">${T().feeNa}</td></tr>` : '')
    + '</tbody></table>', (wins.length ? wins.map(w => T().feeWin(short(w.from), short(w.to), w.rate)).join(' ') + ' ' : '') + T().feeNote(REP.feeYear));
  xb.hy = { f, bi, qd, nav, uv, pf, H, fee: { maxMg, maxSw, feeTxt } };

  /* 2.–3., 6.–8. iš pozicijų */
  if (!H) out += `<p class="na">${T().hyNoPf}</p>`;
  else {
    const rows = H.map(h => ({ ...h, c: classify(PF.secs[h.s], PF.secs[h.s][2]) })).sort((a, b) => b.v - a.v);
    xb.hy.rows = rows;
    const sum = key => { const o = {}; rows.forEach(r => { o[r.c[key]] = (o[r.c[key]] || 0) + r.v; }); return o; };
    const ty = sum('ty'), rg = sum('rg'), sf = sum('sf'), pctOf = v => v / nav * 100;
    const nonMm = Object.entries(ty).filter(([k]) => k !== 'mm').reduce((s, [, v]) => s + v, 0);
    const T7 = { eq: pctOf(ty.eq || 0), cb: pctOf(ty.cb || 0), gb: pctOf(ty.gb || 0), ot: pctOf(ty.ot || 0) }; T7.mm = 100 - T7.eq - T7.cb - T7.gb - T7.ot;
    const nonOt = Object.entries(rg).filter(([k]) => k !== 'ot').reduce((s, [, v]) => s + v, 0);
    const T8 = {}; ['emEq', 'dmEq', 'cb', 'emGb', 'dmGb', 'lt'].forEach(k => { T8[k] = pctOf(rg[k] || 0); }); T8.ot = 100 - Object.values(T8).reduce((s, v) => s + v, 0);
    const T3 = {}; ['a8', 'a9', 'a6', 'direct', 'unk'].forEach(k => { T3[k] = pctOf(sf[k] || 0); }); T3.cash = 100 - Object.values(T3).reduce((s, v) => s + v, 0);
    const riskyAct = T7.eq + T7.ot, strat = typeof f.risky === 'number' && qd.replace(/-/g, '') === String(REP.lbDate).replace(/-/g, '') ? f.risky : null, stratTxt = typeof f.risky === 'string' ? f.risky : null;
    Object.assign(xb.hy, { T3, T7, T8, riskyAct, strat, nonMm, nonOt });
    out += card(T().t2, `<table class="rt"><thead><tr><th class="l"></th><th>${T().rsStrat}</th><th>${T().rsAct}</th></tr></thead><tbody>`
      + `<tr><td class="l">${T().rsRisky}</td><td>${strat != null ? p2(strat) : stratTxt ? stratTxt + ' %' : '–'}</td><td>${p2(riskyAct)}</td></tr>`
      + `<tr><td class="l">${T().rsLess}</td><td>${strat != null ? p2(100 - strat) : '–'}</td><td>${p2(100 - riskyAct)}</td></tr></tbody></table>`, T().rsNote(REP.lbDate || '–'));
    out += card(T().t3, `<table class="rt"><tbody>${[['a8', T().sf8], ['a9', T().sf9], ['a6', T().sf6], ['direct', T().sfDirect], ['unk', T().sfUnk], ['cash', T().sfCash]].map(([k, l]) => `<tr><td class="l">${l}</td><td>${p2(T3[k])}</td></tr>`).join('')}</tbody></table>`, T().sfNote);
    /* 4.–5. grąža (vėliau, žr. žemiau) – vieta išlaikoma pagal ataskaitos tvarką */
    out += '<!--R45-->';
    const top = rows.filter(r => PF.secs[r.s][1] !== 'c' && PF.secs[r.s][1] !== 'd').slice(0, 10);
    xb.hy.top = top;
    out += card(T().t6, `<table class="rt"><thead><tr><th class="l">${T().top}</th><th>${T().weight}</th></tr></thead><tbody>${top.map((r, i) => `<tr><td class="l">${i + 1}. ${secName(r.s)}</td><td>${p2(pctOf(r.v))}</td></tr>`).join('')}</tbody></table>`);
    out += `<div class="two hy2">` + card(T().t7, `<table class="rt"><tbody>${['mm', 'eq', 'cb', 'gb', 'ot'].map(k => `<tr><td class="l">${T().ty[k]}</td><td>${p2(T7[k])}</td></tr>`).join('')}</tbody></table>`, T().tyNote)
      + card(T().t8, `<table class="rt"><tbody>${['emEq', 'dmEq', 'cb', 'ot', 'emGb', 'dmGb', 'lt'].map(k => `<tr><td class="l">${T().rg[k]}</td><td>${p2(T8[k])}</td></tr>`).join('')}</tbody></table>`) + '</div>';
  }

  /* 4. vidutinė metinė grąža ir standartinis nuokrypis; 5. metų grąža */
  const hasB = !!f.bm;
  const s0i = M.indexOf(f.s0[0]);
  let s = f.m[0] != null ? 0 : s0i >= 0 && f.m[s0i] != null ? s0i : 'S', sDay = s === 'S' ? f.s0[0] : M[s];
  if (f.pl === 'III' && f.i0 && f.i0[0] < sDay - START_GAP) { s = 'I'; sDay = f.i0[0]; }      // III pakopa – tikroji veiklos pradžia
  const W = [[6, false], [12, false], [36, true], [60, true], [null, true]];
  const rowRet = bm => W.map(([n, ann], j) => {
    if (bm && n == null && s === 'I') return { v: null };
    const a = n == null ? s : bi - n;
    if (n != null && (a < 0 || M[a] < sDay - START_GAP)) return { v: null };
    // pradėjęs per START_GAP d. po mėnesio pabaigos (pvz. 2025-01-02) – metai skaičiuojami nuo tos mėnesio pabaigos (kaip SEB: 18 mėn. ÷ 12)
    const sm = s === 'S' ? (() => { let k = -1; for (let i = 0; i < NM; i++) if (M[i] <= f.s0[0]) k = i; return k >= 0 && f.s0[0] - M[k] <= START_GAP ? k : null; })() : null;
    const months = n ?? (typeof s === 'string' ? (sm != null ? bi - sm : null) : bi - s);
    return xb.rec(f, `${bm ? T().r4b : T().r4f} · ${T().r4cols[j]}`, a, bi, { bm, ann, years: ann && months != null ? months / 12 : null, months });
  });
  const rowStd = bm => W.map(([n], j) => {
    const t0 = n == null ? sDay : (bi - n >= 0 ? M[bi - n] : null);
    if (t0 == null || t0 < sDay - START_GAP) return { v: null };
    return xb.std(f, `${bm ? T().r4sb : T().r4s} · ${T().r4cols[j]}`, bm, t0, M[bi], n === 6 ? 126 : 252);
  });
  const r1 = rowRet(false), r2 = hasB ? rowRet(true) : null, r3 = rowStd(false), r4 = hasB ? rowStd(true) : null;
  const years = []; for (let y = yr - 1; y >= Math.max(2019, yearOf(sDay + 1)); y--) years.push(y);
  const lastIdx = 'L';
  const yrRow = bm => {
    const ytdNow = f.ld > M[bi] && yearOf(f.ld) === yr ? xb.rec(f, `${bm ? T().r5b : T().r5f} · YTD ${iso(bm ? f.bld || 0 : f.ld)}`, mIdx(yr - 1, 11), lastIdx, { bm }) : { v: null };
    const ytdA = mIdx(yr - 1, 11);
    const half = M[ytdA] >= sDay - START_GAP ? xb.rec(f, `${bm ? T().r5b : T().r5f} · ${T().ytdHalf(yr, qd)}`, ytdA, bi, { bm }) : { v: null };
    const ys = years.map(y => {
      const a = mIdx(y - 1, 11), b = mIdx(y, 11);
      const aa = M[a] >= sDay - START_GAP ? a : (s === 'S' || s === 'I') && yearOf(sDay) === y && !bm ? s : null;
      return aa == null ? { v: null } : Object.assign(xb.rec(f, `${bm ? T().r5b : T().r5f} · ${y}`, aa, b, { bm }), { part: aa === s && typeof s === 'string' });
    });
    const since = bm && s === 'I' ? { v: null } : xb.rec(f, `${bm ? T().r5b : T().r5f} · ${T().sinceStart}`, s, bi, { bm });
    return [ytdNow, half, ...ys, since];
  };
  const a1 = yrRow(false), a2 = hasB ? yrRow(true) : null;
  const cell = c => c.v == null ? `<td class="na">${c.wait ? T().loading : '–'}</td>` : `<td>${num(c.v, 2)}${c.part ? '*' : ''}</td>`;
  const dash = k => Array(k).fill('<td class="na">–</td>').join('');
  const line = (label, cs, k) => `<tr><td class="l">${label}</td>${cs ? cs.map(cell).join('') : dash(k)}</tr>`;
  const ytdLbl = T().ytdNow(short(f.ld)), cols5 = [ytdLbl, T().ytdHalf(yr, qd), ...years.map(T().lbYear), T().sinceStart];
  const t4 = card(T().t4, `<table class="rt lbt"><thead><tr><th class="l">${shortName(f)}</th>${T().r4cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>`
    + line(T().r4f, r1, 5) + line(T().r4b, r2, 5) + line(T().r4s, r3, 5) + line(T().r4sb, r4, 5) + '</tbody></table>', T().r4note + ` ${T().sinceStart}: ${short(sDay)}.`);
  const t5 = card(T().t5, `<table class="rt lbt"><thead><tr><th class="l">${shortName(f)}</th>${cols5.map((c, i) => `<th${i === cols5.length - 1 ? ' class="bl"' : ''}>${c}</th>`).join('')}</tr></thead><tbody>`
    + line(T().r5f, a1, cols5.length) + line(T().r5b, a2, cols5.length) + '</tbody></table>', a1.some(c => c.part) ? T().partYear : '');
  out = out.includes('<!--R45-->') ? out.replace('<!--R45-->', t4 + t5) : out + t4 + t5;
  body.innerHTML = out;

  /* Excel: lentelių lapas – formulės, rodančios į „Pozicijos“ (SUMIF pagal priskyrimą) ir „Skaičiavimai“ (grąža, nuokrypis) */
  const raw = c => c && c.n ? { n: c.n, v: c.v, z: '0.00' } : null;
  Object.assign(xb.hy, { r: [r1, r2, r3, r4], a: [a1, a2], cols5 });
  const t = xb.table, PS = `'${T().sheetPos}'`, h = xb.hy;
  t.push([f.n], [T().asof, qd], [T().hyNav + ', €', h.H ? { f: `${PS}!J${h.H.length + 3}`, v: nav, z: '#,##0' } : nav], [T().hyUv + ', €', uv], []);
  t.push([T().t1], [T().fee, T().feeMax, T().feeAct], [T().feeMgmt, h.fee.maxMg, h.fee.feeTxt]);
  if (f.pl === 'II') t.push([T().feeCo, h.fee.maxSw, T().feeNa], [T().feeFund, h.fee.maxSw, T().feeNa]);
  t.push([]);
  if (h.rows) {
    const N = `${PS}!$J$${h.rows.length + 3}`, J = `${PS}!$J$2:$J$${h.rows.length + 1}`, col = c => `${PS}!$${c}$2:$${c}$${h.rows.length + 1}`;
    const sumif = (c, lab, v) => ({ f: `SUMIF(${col(c)},"${lab}",${J})/${N}`, v, z: '0.00%' });
    const r0 = t.length + 1;            // Excel eilutė, kurioje bus pirmoji lentelės reikšmė (1-based)
    t.push([T().t2], ['', T().rsStrat, T().rsAct]);
    t.push([T().rsRisky, h.strat != null ? { v: h.strat, z: '0.00' } : '–', sumif('O', T().yes, h.riskyAct)]);
    t.push([T().rsLess, h.strat != null ? { f: `100-B${t.length}`, v: 100 - h.strat, z: '0.00' } : '–', { f: `1-C${t.length}`, v: 100 - h.riskyAct, z: '0.00%' }], []);
    t.push([T().t3]);
    const s3 = t.length + 1;
    [['a8', T().sf8], ['a9', T().sf9], ['a6', T().sf6], ['direct', T().sfDirect], ['unk', T().sfUnk]].forEach(([k, l]) => t.push([l, sumif('N', l, h.T3[k])]));
    t.push([T().sfCash, { f: `1-SUM(B${s3}:B${t.length})`, v: h.T3.cash, z: '0.00%' }], []);
    xb.hy.tPos = t.length;               // čia įterpiamos 4–5 lentelės (žr. žemiau)
    t.push([T().t6], [T().top, T().weight]);
    h.top.forEach((r, i) => t.push([`${i + 1}. ${secName(r.s)}`, { f: `${PS}!J${h.rows.indexOf(r) + 2}/${N}`, v: r.v / nav * 100, z: '0.00%' }]));
    t.push([], [T().t7]);
    const s7 = t.length + 1;
    ['eq', 'cb', 'gb', 'ot'].forEach(k => t.push([T().ty[k], sumif('L', T().ty[k], h.T7[k])]));
    t.push([T().ty.mm, { f: `1-SUM(B${s7}:B${t.length})`, v: h.T7.mm, z: '0.00%' }], [], [T().t8]);
    const s8 = t.length + 1;
    ['emEq', 'dmEq', 'cb', 'emGb', 'dmGb', 'lt'].forEach(k => t.push([T().rg[k], sumif('M', T().rg[k], h.T8[k])]));
    t.push([T().rg.ot, { f: `1-SUM(B${s8}:B${t.length})`, v: h.T8.ot, z: '0.00%' }]);
  }
  const t45 = [[], [T().t4], [shortName(f), ...T().r4cols], [T().r4f, ...r1.map(raw)], [T().r4b, ...(r2 || []).map(raw)], [T().r4s, ...r3.map(raw)], [T().r4sb, ...(r4 || []).map(raw)],
    [], [T().t5], [shortName(f), ...cols5], [T().r5f, ...a1.map(ref)], [T().r5b, ...(a2 || []).map(ref)], []];
  if (xb.hy.tPos != null) {             // 4–5 lentelės ten, kur ataskaitoje; formulių eilučių numeriai pastumiami
    const k = xb.hy.tPos, sh = t45.length;
    t.slice(k).forEach(row => row.forEach(c => { if (c && c.f) c.f = c.f.replace(/(^|[^!$A-Z])([BC])(\d+)/g, (m, a, L, n) => a + L + (+n > k ? +n + sh : n)); }));
    t.splice(k, 0, ...t45);
  } else t.push(...t45);
  xb.name = `${shortName(f)} ${qd}`;
  MODELS.hy = xb;
}

/* Excel: pozicijų lapas pridedamas prie rep.js buildBook() sukurtos knygos */
function hyBook() {
  const b = buildBook('hy'); if (!b) return null;
  const h = MODELS.hy.hy, S = T();
  if (h.rows) {
    const yes = S.yes, rows = [S.posH];
    h.rows.forEach((r, i) => {
      const x = PF.secs[r.s], a = x[9] || [], n = i + 2;
      rows.push([i + 1, secName(r.s), x[5] || '', S.kinds[x[1]] || x[1], x[2], a[0] || '', a[1] || '', a[2] || '', a[4] || '', r.v,
        { t: 'n', v: r.v / h.nav, f: `J${n}/$J$${h.rows.length + 3}`, z: '0.00%' }, S.ty[r.c.ty], S.rg[r.c.rg],
        { a8: S.sf8, a9: S.sf9, a6: S.sf6, direct: S.sfDirect, unk: S.sfUnk, cash: S.sfCash }[r.c.sf], r.c.risky ? yes : S.no]);
    });
    const n1 = h.rows.length + 1;
    rows.push([null, S.posSum, null, null, null, null, null, null, null, { t: 'n', v: h.rows.reduce((s, r) => s + r.v, 0), f: `SUM(J2:J${n1})`, z: '#,##0' }]);
    rows.push([null, S.navRow, null, null, null, null, null, null, null, { t: 'n', v: h.nav, z: '#,##0' }]);
    rows.push([], [null, S.posNote]);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 4 }, { wch: 60 }, { wch: 14 }, { wch: 12 }, { wch: 6 }, { wch: 14 }, { wch: 12 }, { wch: 6 }, { wch: 6 }, { wch: 14 }, { wch: 9 }, { wch: 26 }, { wch: 34 }, { wch: 34 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(b.wb, ws, S.sheetPos);
  }
  return b;
}
