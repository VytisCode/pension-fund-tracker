/* Portfelių polapis: Lietuvos banko ketvirtinės fondų portfelių ataskaitos (nuo 2019 m.).
   1) Ketvirčio didžiausi pokyčiai – ką valdytojai (ar fondai) pirko ir pardavė;
   2) Fondo portfelis – visos pasirinkto fondo pozicijos, jų pokyčiai ir kiekvienos pozicijos istorija. */
addStrings({
  tcTitle: 'Biggest changes in the quarter',
  tcLead: 'What the managers bought and sold during the quarter. Trades are estimated from the change in the number of units (shares, ETF units, bond nominal) between two quarter-end reports, valued at the quarter-end price, so price moves alone do not count as trades.',
  fcTitle: 'Fund portfolio',
  fcLead: 'All positions of one fund at the end of the chosen quarter, compared with the previous quarter. Click a position to see its history since 2019, together with the same position in the other managers’ funds of the same age group.',
  quarter: 'Quarter', vs: 'vs', pillar: 'Pillar', all: 'All', manager: 'Manager', level: 'Show by',
  lvMgr: 'Manager', lvFund: 'Fund', assetType: 'Assets', action: 'Change', sortBy: 'Sort by',
  sortEur: 'Amount, €', sortW: 'Weight change',
  acts: { all: 'All', buy: 'Bought', sell: 'Sold', new: 'New', exit: 'Sold out' },
  types: { all: 'All securities', e: 'Shares', b: 'Bonds', f: 'Funds & ETFs', c: 'Cash & deposits', d: 'Derivatives' },
  kis: { 1: 'bond fund', 2: 'mixed fund', 3: 'equity fund', 4: 'money market fund', 5: 'real estate fund', 6: 'hedge fund', 7: 'other fund (private equity etc.)' },
  thMgr: 'Manager', thFund: 'Fund', thPos: 'Position', thAct: 'Change', thTrade: 'Traded (est.)', thValue: 'Value at end', thW0: 'Weight before',
  thW1: 'Weight after', thDw: 'Change, pp', thType: 'Type', thCty: 'Country', thW: 'Weight', thDq: 'Units change',
  thQ: 'Quarter', thUnits: 'Units', nFunds: n => `${n} fund${n === 1 ? '' : 's'}`,
  more: n => `Show ${n} more`, noRows: 'No changes match the filters.',
  tcNote: q => `Weight = share of the manager’s (or fund’s) portfolio in the selected pillar. “New” = not held at the end of the previous quarter, “Sold out” = no longer held. Cash, deposits and derivatives have no units, so they are not listed here – see the fund portfolio below. Data: Bank of Lithuania, quarterly pension fund portfolio reports (${q}).`,
  altTitle: 'Alternative investments',
  altLead: 'Share of illiquid alternative funds – private equity and venture capital, infrastructure and energy, real estate, private debt, forests – in each portfolio. They cannot be sold quickly, so when participants leave a fund (for example after the 2026 pension reform) and liquid securities are sold, the share of alternatives grows by itself.',
  alts: { pe: 'Private equity & venture', infra: 'Infrastructure & energy', re: 'Real estate', debt: 'Private debt', forest: 'Forest & land', hedge: 'Hedge funds' },
  altNone: m => `No alternative funds at all: ${m}.`, altShort: 'alternatives', altAll: 'Alternative funds', kAlt: 'Alternatives',
  altChart: 'Share of alternatives in the manager’s portfolios (all funds of the pillar together), %',
  thAltV: 'Alternatives, value', thAltMix: 'Of which', thChgAlt: 'Alternatives value', thChgTot: 'Whole portfolio', thChg: (a, b) => `Change ${a} → ${b}`,
  altNote: 'Alternative = Bank of Lithuania fund types 5 (real estate), 6 (hedge) and 7 (other: private equity, venture, infrastructure, private debt), excluding exchange-traded ETF/UCITS funds. The split by kind is based on the fund name. If alternatives’ value barely changes while the whole portfolio shrinks, the higher share comes from selling liquid assets. Click a fund to open its portfolio.',
  fund: 'Fund', kTotal: 'Portfolio value', kPos: 'Positions', kTop10: 'Top 10 positions', kNew: 'New / sold out',
  showExits: 'Sold-out positions are listed at the bottom.',
  fcNote: 'Weight = position value ÷ sum of all positions (≈ net assets). Change in units shows buying or selling; a change in weight can also come from price moves. Funds are shown with their full official name from the fund’s page, KID or justETF (otherwise from the OpenFIGI catalogue by ISIN); if the report gives only the management company, it is shown below the name.',
  phPick: 'Click a position in the table', phMeta: 'Weight in the portfolio at each quarter end, %',
  phPeers: 'Other lines: the same position in the other managers’ funds of the same age group (0 % = not held).',
  pIIa: 'II pillar', pIIIa: 'III pillar', closed: 'closed',
  foot: 'Source: Bank of Lithuania, quarterly reports on pension fund investment portfolios (from Q3 2019). Positions are matched by ISIN code across quarters. For information only, not investment advice.',
}, {
  tcTitle: 'Didžiausi ketvirčio pokyčiai',
  tcLead: 'Ką valdytojai pirko ir pardavė per ketvirtį. Sandoriai įvertinami pagal vienetų skaičiaus (akcijų, ETF vienetų, obligacijų nominalo) pokytį tarp dviejų ketvirčio pabaigos ataskaitų, kaina – ketvirčio pabaigos, todėl vien kainos pokytis sandoriu nelaikomas.',
  fcTitle: 'Fondo portfelis',
  fcLead: 'Visos vieno fondo pozicijos pasirinkto ketvirčio pabaigoje, palyginti su ankstesniu ketvirčiu. Paspaudus poziciją matyti jos istorija nuo 2019 m. kartu su ta pačia pozicija kitų valdytojų tos pačios amžiaus grupės fonduose.',
  quarter: 'Ketvirtis', vs: 'palyginti su', pillar: 'Pakopa', all: 'Visi', manager: 'Valdytojas', level: 'Rodyti pagal',
  lvMgr: 'Valdytoją', lvFund: 'Fondą', assetType: 'Turtas', action: 'Pokytis', sortBy: 'Rikiuoti pagal',
  sortEur: 'Sumą, €', sortW: 'Svorio pokytį',
  acts: { all: 'Visi', buy: 'Pirko', sell: 'Pardavė', new: 'Nauja', exit: 'Pardavė visą' },
  types: { all: 'Visi vertybiniai popieriai', e: 'Akcijos', b: 'Obligacijos', f: 'Fondai ir ETF', c: 'Pinigai ir indėliai', d: 'Išvestinės' },
  kis: { 1: 'obligacijų fondas', 2: 'mišrus fondas', 3: 'akcijų fondas', 4: 'pinigų rinkos fondas', 5: 'nekilnojamo turto fondas', 6: 'rizikos draudimo fondas', 7: 'kitas fondas (privataus kapitalo ir pan.)' },
  thMgr: 'Valdytojas', thFund: 'Fondas', thPos: 'Pozicija', thAct: 'Pokytis', thTrade: 'Sandorių suma (įvert.)', thValue: 'Vertė pabaigoje', thW0: 'Svoris prieš',
  thW1: 'Svoris po', thDw: 'Pokytis, p. p.', thType: 'Tipas', thCty: 'Šalis', thW: 'Svoris', thDq: 'Vienetų pokytis',
  thQ: 'Ketvirtis', thUnits: 'Vienetai', nFunds: n => `${n} fond${n === 1 ? 'as' : n < 10 ? 'ai' : 'ų'}`,
  more: n => `Rodyti dar ${n}`, noRows: 'Pagal pasirinktus filtrus pokyčių nėra.',
  tcNote: q => `Svoris = dalis valdytojo (ar fondo) portfelio pasirinktoje pakopoje. „Nauja“ = ankstesnio ketvirčio pabaigoje nebuvo, „Pardavė visą“ = nebeliko. Pinigai, indėliai ir išvestinės priemonės neturi vienetų, todėl čia nerodomi – žr. fondo portfelį žemiau. Duomenys: Lietuvos bankas, ketvirtinės pensijų fondų portfelių ataskaitos (${q}).`,
  altTitle: 'Alternatyvios investicijos',
  altLead: 'Nelikvidžių alternatyvių fondų – privataus ir rizikos kapitalo, infrastruktūros ir energetikos, nekilnojamo turto, privačios skolos, miškų – dalis kiekviename portfelyje. Jų greitai parduoti negalima, todėl kai dalyviai palieka fondą (pvz. po 2026 m. pensijų reformos) ir parduodami likvidūs vertybiniai popieriai, alternatyvų dalis išauga savaime.',
  alts: { pe: 'Privatus ir rizikos kapitalas', infra: 'Infrastruktūra ir energetika', re: 'Nekilnojamas turtas', debt: 'Privati skola', forest: 'Miškai ir žemė', hedge: 'Rizikos draudimo fondai' },
  altNone: m => `Alternatyvių fondų neturi: ${m}.`, altShort: 'alternatyvios', altAll: 'Alternatyvūs fondai', kAlt: 'Alternatyvios',
  altChart: 'Alternatyvų dalis valdytojo portfeliuose (visi pakopos fondai kartu), %',
  thAltV: 'Alternatyvų vertė', thAltMix: 'Iš jų', thChgAlt: 'Alternatyvų vertė', thChgTot: 'Visas portfelis', thChg: (a, b) => `Pokytis ${a} → ${b}`,
  altNote: 'Alternatyvios = Lietuvos banko KIS tipai 5 (nekilnojamas turtas), 6 (rizikos draudimo) ir 7 (kiti: privatus ir rizikos kapitalas, infrastruktūra, privati skola), išskyrus biržoje prekiaujamus ETF / UCITS fondus. Skirstymas pagal rūšį – pagal fondo pavadinimą. Jei alternatyvų vertė beveik nesikeičia, o visas portfelis mažėja, didesnė dalis atsiranda dėl likvidaus turto pardavimo. Paspaudus fondą atidaromas jo portfelis.',
  fund: 'Fondas', kTotal: 'Portfelio vertė', kPos: 'Pozicijų', kTop10: '10 didžiausių pozicijų', kNew: 'Naujos / parduotos',
  showExits: 'Visiškai parduotos pozicijos – lentelės apačioje.',
  fcNote: 'Svoris = pozicijos vertė ÷ visų pozicijų suma (≈ grynieji aktyvai). Vienetų pokytis rodo pirkimą ar pardavimą; svoris gali keistis ir dėl kainų. Fondai rodomi pilnu oficialiu pavadinimu iš fondo puslapio, KID dokumento ar justETF (kitaip – iš OpenFIGI katalogo pagal ISIN); jei ataskaitoje nurodyta tik valdymo bendrovė, ji rodoma po pavadinimu.',
  phPick: 'Paspauskite poziciją lentelėje', phMeta: 'Svoris portfelyje kiekvieno ketvirčio pabaigoje, %',
  phPeers: 'Kitos linijos: ta pati pozicija kitų valdytojų tos pačios amžiaus grupės fonduose (0 % = neturėjo).',
  pIIa: 'II pakopa', pIIIa: 'III pakopa', closed: 'uždarytas',
  foot: 'Šaltinis: Lietuvos bankas, ketvirtinės pensijų fondų investicijų portfelių ataskaitos (nuo 2019 m. III ketv.). Pozicijos ketvirčiuose susiejamos pagal ISIN kodą. Informacinė medžiaga, ne investavimo rekomendacija.',
});

/* ---------- duomenys ---------- */
const MGRS = ['Allianz', 'Artea', 'Goindex', 'Luminor', 'SEB', 'Swedbank'];      // tvarka = spalvos --s1..--s6
var DATA = { providers: MGRS.map(m => ({ id: m, label: m })) };                // drawLineChart spalvoms ir pavadinimams
const Q = PF.quarters, NQ = Q.length, QDAY = Q.map(dayOf);
const qLabel = i => { const [y, m] = Q[i].split('-'); return lang === 'lt' ? `${y} m. ${['I', 'II', 'III', 'IV'][m / 3 - 1]} ketv.` : `Q${m / 3} ${y}`; };
const S = PF.secs.map((s, i) => ({ si: i, name: s[0], t: s[1], cty: s[2], cur: s[3], kis: s[4], isin: s[5], co: s[6], alt: s[7] || '', fn: s[8] || '',
  a: s[9] ? { ac: s[9][0], reg: s[9][1], em: s[9][2], ap: s[9][3], sfdr: s[9][4], ter: s[9][5], hdg: s[9][6], th: s[9][7], src: s[9][8] } : null,
  bt: s[10] ? { mat: s[10][0], cpn: s[10][1], frn: s[10][2] } : null }));
// obligacijų YTM ir trukmė: BM[pozicija].get(ketvirtis) = { y: YTM %, md: modifikuota trukmė, yrs: metai iki išpirkimo }
const BM = {};
Object.entries(PF.bm || {}).forEach(([si, a]) => { const m = BM[si] = new Map(); for (let i = 0; i < a.length; i += 4) m.set(a[i], { y: a[i + 1], md: a[i + 2], yrs: a[i + 3] }); });
const bondAt = (si, qi) => BM[si] && BM[si].get(qi);
const FUNDS = PF.funds.map(f => {
  const q = Array.from({ length: NQ }, () => null);        // q[ketvirtis] = Map(pozicija -> {u, v}) arba null (fondo nebuvo)
  for (let i = 0; i < f.r.length; i += 4) {
    const [qi, si, u, v] = [f.r[i], f.r[i + 1], f.r[i + 2], f.r[i + 3]];
    (q[qi] = q[qi] || new Map()).set(si, { u, v });
  }
  const tot = q.map(m => m ? [...m.values()].reduce((a, x) => a + x.v, 0) : 0);
  const last = q.map((m, i) => m ? i : -1).filter(i => i >= 0).pop();
  return { ...f, q, tot, last };
});
const fundBy = Object.fromEntries(FUNDS.map(f => [f.c, f]));
// fondams rodomas pilnas oficialus pavadinimas (data/fund_attributes.csv, kitaip OpenFIGI); jei ataskaitoje nurodyta tik bendrovė – ji antroje eilutėje
const posLabel = s => s.fn ? s.fn : s.co && s.isin ? `${s.name} · ${s.isin}` : s.name;
const posSub = s => `${s.co && s.fn ? s.name + ' · ' : ''}${typeLabel(s)} · ${s.cty || '–'}${s.isin && (!s.co || s.fn) ? ' · ' + s.isin : ''}`;
const typeLabel = s => { const l = s.alt ? T().alts[s.alt] : s.t === 'f' && s.kis ? (T().kis[s.kis] || T().types.f) : T().types[s.t]; return l[0].toUpperCase() + l.slice(1); };
const fundName = f => f.g === 'turto' ? f.n.replace('turto išsaugojimo', lang === 'lt' ? 'turto išsaugojimo' : 'capital preservation') : f.n;
const sw = m => `<span class="sw" style="background:${colorOf(m)}"></span>`;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function eur(v) {
  const a = Math.abs(v), s = v < 0 ? '−' : '';
  if (a >= 1e9) return `${s}${num(a / 1e9, 2)} ${lang === 'lt' ? 'mlrd. €' : 'bn €'}`;
  if (a >= 1e6) return `${s}${num(a / 1e6, a >= 1e8 ? 0 : 1)} ${lang === 'lt' ? 'mln. €' : 'm €'}`;
  if (a >= 1e3) return `${s}${num(a / 1e3, 0)} ${lang === 'lt' ? 'tūkst. €' : 'k €'}`;
  return `${s}${num(a, 0)} €`;
}
const wFmt = (w, p = 2) => w ? num(w, p) + '%' : '–';
const pp = d => (d >= 0.005 ? '+' : d <= -0.005 ? '−' : '') + num(Math.abs(d), 2);
const badge = a => `<span class="badge b-${a}">${T().acts[a]}</span>`;
const MIN_CHANGE = 0.005;                                   // < 0,5 % vienetų pokytis laikomas nepasikeitusiu (apvalinimai)

/* ---------- fondų ir ETF požymiai (data/fund_attributes.csv) ---------- */
addStrings({
  ap: { index: 'Index', active: 'Active' },
  reg: { glob: 'Global (incl. EM)', gdm: 'Global developed', na: 'North America', eu: 'Europe', baltic: 'Baltics', jp: 'Japan', ap: 'Asia-Pacific developed', em: 'Emerging markets', oth: 'Other', unk: 'Not described' },
  emL: { no: 'no EM', yes: 'incl. EM', only: 'EM only' }, hedged: 'currency hedged', gold: 'Gold', source: 'source',
  lkTitle: 'What the portfolio covers', lkIdx: 'Index funds', lkTer: 'Funds’ fee (TER)', lkEm: 'Emerging markets', lkGold: 'Gold',
  lkSfdr: 'SFDR art. 8/9', lkCov: 'Funds described', lkEq: e => `Equities (${e} of the portfolio) by region, % of the portfolio`,
  lkTerSub: c => `weighted, known for ${c} of funds`, lkEmSub: w => `+ ${w} in global funds that hold some EM`, lkIdxSub: a => `active funds ${a}`,
  lkNote: 'Look-through by fund description: a fund’s whole value is assigned to its region (for example, an MSCI World fund counts as “Global developed”, an MSCI ACWI fund as “Global (incl. EM)”), directly held shares by the issuer’s country. TER = ongoing charges of the funds in the portfolio, weighted by their value; the pension fund’s own management fee comes on top. SFDR = EU sustainability disclosure article (8 = promotes ESG characteristics, 9 = sustainable investment objective); not every fund page states it. Fund descriptions were collected from fund pages, KIDs and justETF (October 2026); new funds appearing in later reports will be added.',
  pgTitle: 'Peer comparison: what drives the differences',
  pgLead: 'Funds of the same age group at different managers side by side: how much equity and alternatives they hold, how much is in index funds, what the underlying funds cost, whether they hold emerging markets or gold and where the equities are. These differences explain much of why the same age group earns different returns.',
  group: 'Group', pgSig: 'Signals', thEq: 'Equities', thBd: 'Bonds', thAlt: 'Alternatives', thCash: 'Cash & money market',
  thIdx: 'Index funds', thTer: 'Funds’ TER', thEm: 'EM', thEmW: 'Global funds incl. EM', thGold: 'Gold', thSfdr: 'SFDR 8/9', thReg: 'Equities by region, % of the portfolio',
  sigNoEm: f => `No emerging markets at all: ${f}.`, sigMost: (what, f, v) => `Most ${what}: ${f} (${v})`, sigLeast: (what, f, v) => `least: ${f} (${v}).`,
  sigTer: (a, av, b, bv) => `Cheapest underlying funds: ${a} (${av}); most expensive: ${b} (${bv}).`, sigGold: f => `Holds gold: ${f}.`, sigNoGold: 'Nobody in the group holds gold.',
  wEq: 'equities', wAlt: 'alternatives', wIdx: 'in index funds', wEm: 'emerging markets', wNa: 'North American equities', wBaltic: 'Baltic equities',
  pgNote: 'All columns are % of the fund’s portfolio at the end of the quarter. Equities = directly held shares + equity funds; bonds = direct bonds + bond funds; cash includes money market funds. EM = funds investing only in emerging markets + directly held EM shares; “global funds incl. EM” = whole value of global funds that hold some EM (typically ~10 % of such a fund). Colour intensity = relative to the highest value in the column. Bonds’ YTM and duration: directly held bonds only (see the note under the fund portfolio). Click a fund to open its portfolio below.',
  pgIII: 'III pillar (all funds)',
  ytm: 'YTM', dur: 'duration', cpn: 'coupon', frn: 'floating rate', matL: 'maturity',
  lkBond: b => `Directly held bonds (${b} of the portfolio)`, lkYtm: 'Yield to maturity (YTM)', lkDur: 'Modified duration', lkYrs: 'Average maturity', yrs: 'yrs',
  lkBondCov: c => `calculated for ${c} of bonds`, lkFrn: f => `floating rate ${f}`,
  thYtm: 'Bonds’ YTM', thDur: 'Bonds’ duration',
  sigYtm: (a, av, b, bv) => `Highest yield on directly held bonds: ${a} (${av}); lowest: ${b} (${bv}).`,
  sigDur: (a, av, b, bv) => `Longest bond duration (most sensitive to interest rates): ${a} (${av}); shortest: ${b} (${bv}).`,
  bondNote: 'YTM and modified duration of directly held bonds at the quarter end, weighted by value. Terms (coupon, maturity) come from the EU register ESMA FIRDS; the price is value ÷ nominal from the Bank of Lithuania report (including accrued interest). Annual coupons are assumed (semi-annual for USD), yield to final maturity (not to call). Floating-rate bonds count with duration ≈ 0 and are left out of YTM. Bond funds are not included.',
}, {
  ap: { index: 'Indeksinis', active: 'Aktyvus' },
  reg: { glob: 'Pasaulis (su EM)', gdm: 'Išsivysčiusios rinkos (pasaulis)', na: 'Šiaurės Amerika', eu: 'Europa', baltic: 'Baltijos šalys', jp: 'Japonija', ap: 'Azija ir Ramusis vand. (išsivyst.)', em: 'Besivystančios rinkos', oth: 'Kita', unk: 'Neaprašyta' },
  emL: { no: 'be EM', yes: 'su EM', only: 'tik EM' }, hedged: 'valiuta apdrausta', gold: 'Auksas', source: 'šaltinis',
  lkTitle: 'Ką dengia portfelis', lkIdx: 'Indeksiniai fondai', lkTer: 'Fondų mokestis (TER)', lkEm: 'Besivystančios rinkos', lkGold: 'Auksas',
  lkSfdr: 'SFDR 8 / 9 str.', lkCov: 'Aprašyta fondų', lkEq: e => `Akcijos (${e} portfelio) pagal regioną, % portfelio`,
  lkTerSub: c => `svertinis, žinomas ${c} fondų`, lkEmSub: w => `+ ${w} pasaulio fonduose, turinčiuose EM dalį`, lkIdxSub: a => `aktyvūs fondai ${a}`,
  lkNote: 'Skirstoma pagal fondo aprašą: visa fondo vertė priskiriama jo regionui (pvz. MSCI World fondas – „Išsivysčiusios rinkos (pasaulis)“, MSCI ACWI – „Pasaulis (su EM)“), tiesiogiai turimos akcijos – pagal emitento šalį. TER = portfelyje esančių fondų einamieji mokesčiai, svertiniai pagal jų vertę; pensijų fondo valdymo mokestis – papildomai. SFDR = ES tvarumo atskleidimo straipsnis (8 – skatina ESG savybes, 9 – tvaraus investavimo tikslas); ne visi fondų puslapiai jį nurodo. Fondų aprašai surinkti iš fondų puslapių, KID dokumentų ir justETF (2026 m. spalis); vėlesnėse ataskaitose atsiradę nauji fondai bus papildyti.',
  pgTitle: 'Palyginimas grupėje: kas lemia skirtumus',
  pgLead: 'Tos pačios amžiaus grupės skirtingų valdytojų fondai greta: kiek turi akcijų ir alternatyvų, kiek investuota per indeksinius fondus, kiek kainuoja jų fondai, ar turi besivystančių rinkų ir aukso, kur yra akcijos. Šie skirtumai daug paaiškina, kodėl tos pačios grupės fondų grąža skiriasi.',
  group: 'Grupė', pgSig: 'Signalai', thEq: 'Akcijos', thBd: 'Obligacijos', thAlt: 'Alternatyvios', thCash: 'Pinigai ir pinigų rinka',
  thIdx: 'Indeksiniai fondai', thTer: 'Fondų TER', thEm: 'EM', thEmW: 'Pasaulio fondai su EM', thGold: 'Auksas', thSfdr: 'SFDR 8/9', thReg: 'Akcijos pagal regioną, % portfelio',
  sigNoEm: f => `Besivystančių rinkų visai neturi: ${f}.`, sigMost: (what, f, v) => `Daugiausia ${what}: ${f} (${v})`, sigLeast: (what, f, v) => `mažiausiai: ${f} (${v}).`,
  sigTer: (a, av, b, bv) => `Pigiausi fondai portfelyje: ${a} (${av}); brangiausi: ${b} (${bv}).`, sigGold: f => `Turi aukso: ${f}.`, sigNoGold: 'Aukso grupėje neturi niekas.',
  wEq: 'akcijų', wAlt: 'alternatyvų', wIdx: 'indeksinių fondų', wEm: 'besivystančių rinkų', wNa: 'Šiaurės Amerikos akcijų', wBaltic: 'Baltijos akcijų',
  pgNote: 'Visi stulpeliai – % fondo portfelio ketvirčio pabaigoje. Akcijos = tiesiogiai turimos akcijos + akcijų fondai; obligacijos = tiesioginės obligacijos + obligacijų fondai; pinigai apima pinigų rinkos fondus. EM = fondai, investuojantys tik į besivystančias rinkas, + tiesiogiai turimos jų akcijos; „pasaulio fondai su EM“ = visa vertė pasaulio fondų, turinčių EM dalį (tokiame fonde jos paprastai ~10 %). Spalvos intensyvumas – lyginant su didžiausia stulpelio reikšme. Obligacijų YTM ir trukmė – tik tiesiogiai turimų obligacijų (žr. paaiškinimą po fondo portfeliu). Paspaudus fondą atidaromas jo portfelis žemiau.',
  pgIII: 'III pakopa (visi fondai)',
  ytm: 'YTM', dur: 'trukmė', cpn: 'kuponas', frn: 'kintamos palūkanos', matL: 'išpirkimas',
  lkBond: b => `Tiesiogiai turimos obligacijos (${b} portfelio)`, lkYtm: 'Pajamingumas iki išpirkimo (YTM)', lkDur: 'Modifikuota trukmė', lkYrs: 'Vidutinis likęs terminas', yrs: 'm.',
  lkBondCov: c => `apskaičiuota ${c} obligacijų`, lkFrn: f => `kintamos palūkanos ${f}`,
  thYtm: 'Obligacijų YTM', thDur: 'Obligacijų trukmė',
  sigYtm: (a, av, b, bv) => `Didžiausias tiesioginių obligacijų pajamingumas: ${a} (${av}); mažiausias: ${b} (${bv}).`,
  sigDur: (a, av, b, bv) => `Ilgiausia obligacijų trukmė (jautriausios palūkanų pokyčiams): ${a} (${av}); trumpiausia: ${b} (${bv}).`,
  bondNote: 'Tiesiogiai turimų obligacijų YTM ir modifikuota trukmė ketvirčio pabaigoje, svertiniai pagal vertę. Sąlygos (kuponas, išpirkimo data) – iš ES registro ESMA FIRDS, kaina = vertė ÷ nominalas iš Lietuvos banko ataskaitos (su sukauptomis palūkanomis). Laikoma, kad kuponas mokamas kartą per metus (USD – du kartus), pajamingumas – iki galutinio išpirkimo (ne iki pirmalaikio). Kintamų palūkanų obligacijos įskaičiuojamos su trukme ≈ 0 ir neįskaičiuojamos į YTM. Obligacijų fondai neįtraukti.',
});
const REG = { global: 'glob', global_dm: 'gdm', us: 'na', north_america: 'na', europe: 'eu', eurozone: 'eu', uk: 'eu', china: 'em', japan: 'jp', asia_pacific_dm: 'ap', em: 'em', em_ex_china: 'em', other: 'oth' };
const REG_KEYS = ['na', 'eu', 'baltic', 'gdm', 'glob', 'jp', 'ap', 'em', 'oth', 'unk'];
const REG_COL = { na: 'var(--s1)', eu: 'var(--s2)', baltic: 'var(--s5)', gdm: 'var(--s3)', glob: 'var(--s4)', jp: 'var(--s6)', ap: '#8e7cc3', em: '#d0453f', oth: 'var(--axis)', unk: 'var(--grid)' };
const CTY_EU = new Set('AT BE BG CH CY CZ DE DK ES FI FR GB GR HR HU IE IS IT LI LU MT NL NO PL PT RO SE SI SK JE GG IM FO'.split(' '));
const CTY_EM = new Set('CN TW IN KR BR MX ZA SA AE QA KW TH MY ID PH CL CO PE TR EG'.split(' '));
function ctyRegion(c) {
  if (['US', 'CA', 'BM', 'PA', 'KY', 'PR', 'BS'].includes(c)) return 'na';
  if (['LT', 'LV', 'EE'].includes(c)) return 'baltic';
  if (c === 'JP') return 'jp';
  if (['AU', 'NZ', 'HK', 'SG'].includes(c)) return 'ap';
  if (CTY_EM.has(c)) return 'em';
  return CTY_EU.has(c) ? 'eu' : 'oth';
}
// turto grupė: eq akcijos, bd obligacijos, alt alternatyvios, cash pinigai ir pinigų rinka, der išvestinės, oth kita
function bucket(s) {
  if (s.t !== 'f') return { e: 'eq', b: 'bd', c: 'cash', d: 'der' }[s.t];
  if (s.alt) return 'alt';
  const ac = s.a ? s.a.ac : { 1: 'bond', 3: 'equity', 4: 'money_market', 5: 'real_estate', 7: 'private_equity' }[s.kis] || '';
  return ac === 'equity' ? 'eq' : ac === 'bond' ? 'bd' : ac === 'money_market' ? 'cash' : ['private_equity', 'real_estate', 'other'].includes(ac) ? 'alt' : 'oth';
}
const regionOf = s => s.t === 'e' ? ctyRegion(s.cty) : s.a ? REG[s.a.reg] || 'oth' : 'unk';
/* Fondo portfelio požymių suvestinė: visi rodikliai – % portfelio */
function lookThrough(f, qi) {
  const m = f.q[qi], t = f.tot[qi], L = { b: {}, reg: {}, fw: 0, desc: 0, idx: 0, act: 0, terW: 0, terS: 0, em: 0, emW: 0, emUnk: 0, gold: 0, sfdr: 0, bw: 0, bdW: 0, mdS: 0, yrsS: 0, yW: 0, yS: 0, frn: 0 };
  if (!m || !t) return L;
  m.forEach((x, si) => {
    const s = S[si], w = x.v / t * 100, b = bucket(s);
    L.b[b] = (L.b[b] || 0) + w;
    if (b === 'eq') { const r = regionOf(s); L.reg[r] = (L.reg[r] || 0) + w; if (r === 'em') L.em += w; }
    if (s.t === 'b') {
      L.bw += w; const m = bondAt(si, qi);
      if (m) { L.bdW += w; L.mdS += w * m.md; L.yrsS += w * m.yrs; if (m.y != null) { L.yW += w; L.yS += w * m.y; } else L.frn += w; }
    }
    if (s.t !== 'f') return;
    L.fw += w;
    if (b === 'eq' && !(s.a && s.a.em)) L.emUnk += w;          // nežinoma, ar akcijų fondas turi EM
    if (!s.a) return;
    L.desc += w;
    if (s.a.ap === 'index') L.idx += w; else if (s.a.ap === 'active') L.act += w;
    if (s.a.ter != null) { L.terW += w; L.terS += w * s.a.ter; }
    if (s.a.em === 'only' && b !== 'eq') L.em += w;            // akcijų EM fondai jau įskaityti per regioną
    if (s.a.em === 'yes') L.emW += w;
    if (s.a.th === 'gold') L.gold += w;
    if (s.a.sfdr === '8' || s.a.sfdr === '9') L.sfdr += w;
  });
  L.ter = L.terW ? L.terS / L.terW : null;
  L.ytm = L.yW ? L.yS / L.yW : null; L.md = L.bdW ? L.mdS / L.bdW : null; L.yrs = L.bdW ? L.yrsS / L.bdW : null;
  return L;
}
function attrChips(s, qi) {
  if (s.t === 'b') {
    const m = s.bt ? bondAt(s.si, qi) : null, c = [];
    if (m && m.y != null) c.push(`${T().ytm} ${num(m.y, 2)}%`);
    if (m) c.push(`${T().dur} ${num(m.md, 1)}`);
    if (s.bt) { if (s.bt.frn) c.push(T().frn); else if (s.bt.cpn != null) c.push(`${T().cpn} ${num(s.bt.cpn, 2)}%`); c.push(`${T().matL} ${s.bt.mat}`); }
    return c.length ? `<span class="tags">${c.map(x => `<span>${esc(x)}</span>`).join('')}</span>` : '';
  }
  if (!s.a) return '';
  const a = s.a, c = [];
  if (a.ap) c.push(T().ap[a.ap]);
  if (a.reg) c.push(T().reg[REG[a.reg] || 'oth']);
  if (a.em && s.a.ac !== 'private_equity' && s.a.ac !== 'real_estate') c.push(T().emL[a.em]);
  if (a.th === 'gold') c.push(T().gold);
  if (a.sfdr) c.push('SFDR ' + a.sfdr);
  if (a.ter != null) c.push('TER ' + num(a.ter, 2) + '%');
  if (a.hdg === 'yes') c.push(T().hedged);
  return `<span class="tags">${c.map(x => `<span>${esc(x)}</span>`).join('')}</span>`;
}

/* Būsena (išsaugoma naršyklėje) */
const ST = Object.assign({ q: NQ - 1, pl: 'II', mgr: 'all', lv: 'mgr', type: 'all', act: 'all', sort: 'eur', fund: 'SWD-89/95', fq: NQ - 1, ft: 'all', pos: null, fsort: 'w' },
  (() => { try { return JSON.parse(localStorage.getItem('pfstate')) || {}; } catch (e) { return {}; } })());
if (!(ST.q >= 1 && ST.q < NQ)) ST.q = NQ - 1;
if (!fundBy[ST.fund]) ST.fund = FUNDS[0].c;
if (!(ST.fq >= 0 && ST.fq < NQ) || !fundBy[ST.fund].q[ST.fq]) ST.fq = fundBy[ST.fund].last;
const save = () => { try { localStorage.setItem('pfstate', JSON.stringify(ST)); } catch (e) {} };

/* ---------- valdikliai ---------- */
function seg(id, opts, cur, onPick) {      // opts: [[reikšmė, tekstas]]
  return `<div class="seg" role="group" data-seg="${id}">` + opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(cur)}">${t}</button>`).join('') + '</div>';
}
function wireSegs(root, handlers) {
  root.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => handlers[g.dataset.seg](b.dataset.v))));
}
const field = (label, html) => `<label class="field">${label} ${html}</label>`;
const quarterSelect = (id, cur, from = 0) => `<select id="${id}">` + Q.map((_, i) => i).filter(i => i >= from).reverse().map(i => `<option value="${i}"${i === cur ? ' selected' : ''}>${qLabel(i)}</option>`).join('') + '</select>';

/* ---------- 1. ketvirčio pokyčiai ---------- */
let tcLimit = 30, fcLimit = 40;
function changes() {
  const q1 = ST.q, q0 = q1 - 1;
  const funds = FUNDS.filter(f => (ST.pl === 'all' || f.pl === ST.pl) && (ST.mgr === 'all' || f.p === ST.mgr) && (f.q[q0] || f.q[q1]));
  const units = new Map();                                  // vienetas (valdytojas arba fondas) -> {tot0, tot1, pos: Map}
  funds.forEach(f => {
    const key = ST.lv === 'mgr' ? f.p : f.c;
    const U = units.get(key) || { key, mgr: f.p, fund: ST.lv === 'fund' ? f : null, tot0: 0, tot1: 0, pos: new Map() };
    units.set(key, U);
    U.tot0 += f.tot[q0]; U.tot1 += f.tot[q1];
    [[f.q[q0], 0], [f.q[q1], 1]].forEach(([m, k]) => m && m.forEach((x, si) => {
      const s = S[si]; if (s.t === 'c' || s.t === 'd' || x.u == null) return;
      const P = U.pos.get(si) || { si, u: [0, 0], v: [0, 0], funds: new Set() };
      P.u[k] += x.u; P.v[k] += x.v; P.funds.add(f.c); U.pos.set(si, P);
    }));
  });
  const rows = [];
  units.forEach(U => U.pos.forEach(P => {
    const s = S[P.si];
    if (ST.type !== 'all' && s.t !== ST.type) return;
    const [u0, u1] = P.u, du = u1 - u0;
    if (Math.abs(du) <= MIN_CHANGE * Math.max(Math.abs(u0), Math.abs(u1))) return;
    const act = u0 === 0 ? 'new' : u1 === 0 ? 'exit' : du > 0 ? 'buy' : 'sell';
    if (ST.act !== 'all' && !(ST.act === act || (ST.act === 'buy' && act === 'new') || (ST.act === 'sell' && act === 'exit'))) return;
    const price = u1 ? P.v[1] / u1 : P.v[0] / u0;
    const w0 = U.tot0 ? P.v[0] / U.tot0 * 100 : 0, w1 = U.tot1 ? P.v[1] / U.tot1 * 100 : 0;
    rows.push({ U, P, s, act, trade: du * price, w0, w1, dw: w1 - w0 });
  }));
  rows.sort(ST.sort === 'w' ? (a, b) => Math.abs(b.dw) - Math.abs(a.dw) : (a, b) => Math.abs(b.trade) - Math.abs(a.trade));
  return rows;
}
function renderTopChanges() {
  const bar = document.getElementById('tcBar');
  bar.innerHTML = field(T().quarter, quarterSelect('tcQ', ST.q, 1)) + `<span class="pfsub" id="tcVs"></span>`
    + field(T().pillar, seg('pl', [['II', 'II'], ['III', 'III'], ['all', T().all]], ST.pl))
    + field(T().manager, `<select id="tcMgr"><option value="all">${T().all}</option>${MGRS.map(m => `<option${m === ST.mgr ? ' selected' : ''}>${m}</option>`).join('')}</select>`)
    + field(T().level, seg('lv', [['mgr', T().lvMgr], ['fund', T().lvFund]], ST.lv))
    + field(T().assetType, `<select id="tcType">${['all', 'e', 'b', 'f'].map(t => `<option value="${t}"${t === ST.type ? ' selected' : ''}>${T().types[t]}</option>`).join('')}</select>`)
    + field(T().action, seg('act', Object.keys(T().acts).map(a => [a, T().acts[a]]), ST.act))
    + field(T().sortBy, seg('sort', [['eur', T().sortEur], ['w', T().sortW]], ST.sort));
  document.getElementById('tcVs').textContent = `${T().vs} ${qLabel(ST.q - 1)}`;
  const upd = (k, v) => { ST[k] = v; tcLimit = 30; save(); renderTopChanges(); };
  wireSegs(bar, { pl: v => upd('pl', v), lv: v => upd('lv', v), act: v => upd('act', v), sort: v => upd('sort', v) });
  bar.querySelector('#tcQ').addEventListener('change', e => upd('q', +e.target.value));
  bar.querySelector('#tcMgr').addEventListener('change', e => upd('mgr', e.target.value));
  bar.querySelector('#tcType').addEventListener('change', e => upd('type', e.target.value));

  const rows = changes(), shown = rows.slice(0, tcLimit), byFund = ST.lv === 'fund';
  const tb = document.getElementById('tcTable');
  tb.innerHTML = `<thead><tr><th class="l">${T().thMgr}</th><th class="l">${byFund ? T().thFund : ''}</th><th class="l">${T().thPos}</th><th class="l">${T().thAct}</th>
    <th>${T().thTrade}</th><th>${T().thValue}</th><th>${T().thW0}</th><th>${T().thW1}</th><th>${T().thDw}</th></tr></thead><tbody>`
    + (shown.length ? shown.map((r, i) => `<tr data-i="${i}"><td class="l">${sw(r.U.mgr)}${r.U.mgr}</td>
      <td class="l">${byFund ? esc(fundName(r.U.fund)) : `<span class="pfsub">${T().nFunds(r.P.funds.size)}</span>`}</td>
      <td class="nm">${esc(posLabel(r.s))}<br><small>${esc(posSub(r.s))}</small>${attrChips(r.s, ST.q)}</td>
      <td class="l">${badge(r.act)}</td>
      <td class="${r.trade > 0 ? 'up' : 'down'}">${r.trade > 0 ? '+' : ''}${eur(r.trade)}</td>
      <td>${r.P.v[1] ? eur(r.P.v[1]) : '–'}</td><td>${wFmt(r.w0)}</td><td>${wFmt(r.w1)}</td>
      <td class="${r.dw > 0 ? 'up' : 'down'}">${pp(r.dw)}</td></tr>`).join('')
      : `<tr><td colspan="9" class="na">${T().noRows}</td></tr>`) + '</tbody>';
  tb.querySelectorAll('tbody tr[data-i]').forEach(tr => tr.addEventListener('click', () => {   // atidaro poziciją fondo portfelyje
    const r = shown[+tr.dataset.i];
    const f = r.U.fund || [...r.P.funds].map(c => fundBy[c]).sort((a, b) => ((b.q[ST.q] || new Map()).get(r.P.si)?.v || 0) - ((a.q[ST.q] || new Map()).get(r.P.si)?.v || 0))[0];
    ST.fund = f.c; ST.fq = f.q[ST.q] ? ST.q : ST.q - 1; ST.pos = r.P.si; ST.ft = 'all'; save(); renderFund();
    document.getElementById('fcTitle').scrollIntoView({ behavior: 'smooth' });
  }));
  const more = document.getElementById('tcMore');
  more.style.display = rows.length > tcLimit ? '' : 'none';
  more.textContent = T().more(Math.min(30, rows.length - tcLimit));
  more.onclick = () => { tcLimit += 30; renderTopChanges(); };
  document.getElementById('tcNote').textContent = T().tcNote(`${qLabel(0)} – ${qLabel(NQ - 1)}`);
}

/* ---------- 2. fondo portfelis ---------- */
const TYPE_COL = { e: 'var(--s1)', f3: 'var(--s4)', f: 'var(--s3)', alt: '#c9a227', b: 'var(--s2)', c: 'var(--s5)', d: 'var(--s6)' };
function fundSelect() {
  const opt = f => `<option value="${f.c}"${f.c === ST.fund ? ' selected' : ''}>${esc(fundName(f))}${f.last < NQ - 1 ? ` (${T().closed})` : ''}</option>`;
  return `<select id="fcFund">` + ['II', 'III'].map(pl => MGRS.map(m => {
    const fs = FUNDS.filter(f => f.pl === pl && f.p === m);
    return fs.length ? `<optgroup label="${pl === 'II' ? T().pIIa : T().pIIIa} · ${m}">${fs.map(opt).join('')}</optgroup>` : '';
  }).join('')).join('') + '</select>';
}
function fundRows(f, qi) {
  const m1 = f.q[qi] || new Map(), m0 = (qi > 0 && f.q[qi - 1]) || null, t1 = f.tot[qi], t0 = qi > 0 ? f.tot[qi - 1] : 0;
  const rows = [];
  m1.forEach((x, si) => {
    const p = m0 && m0.get(si), w1 = x.v / t1 * 100, w0 = p ? p.v / t0 * 100 : 0;
    let act = '';
    if (m0 && !p) act = 'new';
    else if (p && x.u != null && p.u != null) { const du = x.u - p.u; if (Math.abs(du) > MIN_CHANGE * Math.max(Math.abs(x.u), Math.abs(p.u))) act = du > 0 ? 'buy' : 'sell'; }
    rows.push({ si, s: S[si], v: x.v, u: x.u, w: w1, dw: m0 ? w1 - w0 : null, dq: p && p.u && x.u != null ? (x.u / p.u - 1) * 100 : null, act });
  });
  const exits = [];
  if (m0) m0.forEach((p, si) => { if (!m1.has(si)) exits.push({ si, s: S[si], v: 0, u: 0, w: 0, dw: -p.v / t0 * 100, dq: -100, act: 'exit', exit: true }); });
  return { rows, exits };
}
function renderFund() {
  const f = fundBy[ST.fund];
  if (!f.q[ST.fq]) ST.fq = f.last;
  const first = f.q.findIndex(Boolean);
  const bar = document.getElementById('fcBar');
  bar.innerHTML = field(T().fund, fundSelect()) + field(T().quarter, quarterSelect('fcQ', ST.fq, first).replace(/<option value="(\d+)"/g, (s, i) => f.q[+i] ? s : s + ' disabled'))
    + field(T().assetType, `<select id="fcType">${['all', 'e', 'b', 'f', 'alt', 'c', 'd'].map(t => `<option value="${t}"${t === ST.ft ? ' selected' : ''}>${t === 'all' ? T().all : t === 'alt' ? T().altAll : T().types[t]}</option>`).join('')}</select>`);
  bar.querySelector('#fcFund').addEventListener('change', e => { ST.fund = e.target.value; ST.fq = fundBy[ST.fund].q[ST.fq] ? ST.fq : fundBy[ST.fund].last; ST.pos = null; fcLimit = 40; save(); renderFund(); });
  bar.querySelector('#fcQ').addEventListener('change', e => { ST.fq = +e.target.value; fcLimit = 40; save(); renderFund(); });
  bar.querySelector('#fcType').addEventListener('change', e => { ST.ft = e.target.value; fcLimit = 40; save(); renderFund(); });

  const { rows, exits } = fundRows(f, ST.fq);
  const tot = f.tot[ST.fq], byW = rows.slice().sort((a, b) => b.w - a.w);
  const nNew = rows.filter(r => r.act === 'new').length;
  document.getElementById('fcKpis').innerHTML = [
    [T().kTotal, eur(tot)], [T().kPos, rows.length], [T().kTop10, wFmt(byW.slice(0, 10).reduce((a, r) => a + r.w, 0), 1)],
    [T().kAlt, (() => { const a = altShare(f, ST.fq), a0 = ST.fq > first ? altShare(f, ST.fq - 1) : null; return wFmt(a, 1) + (a0 == null ? '' : ` <small class="${a > a0 ? 'up' : a < a0 ? 'down' : ''}" style="font-size:12px;white-space:nowrap">${pp(a - a0)} p. p.</small>`); })()],
    [T().kNew, ST.fq > first ? `${nNew} / ${exits.length}` : '–'],
  ].map(([l, v]) => `<div class="kpi"><span>${l}</span><b>${v}</b></div>`).join('');
  // sudėtis pagal turto tipą (akcijų fondai atskirai nuo kitų fondų)
  const comp = {}; rows.forEach(r => { const k = r.s.alt ? 'alt' : r.s.t === 'f' && r.s.kis === '3' ? 'f3' : r.s.t; comp[k] = (comp[k] || 0) + r.w; });
  const compLbl = k => k === 'alt' ? T().altAll : k === 'f3' ? T().kis[3] : k === 'f' ? (lang === 'lt' ? 'kiti fondai' : 'other funds') : T().types[k];
  const keys = ['e', 'f3', 'f', 'alt', 'b', 'c', 'd'].filter(k => comp[k]);
  document.getElementById('fcComp').innerHTML = `<div class="comp">${keys.filter(k => comp[k] > 0).map(k => `<span style="width:${comp[k]}%;background:${TYPE_COL[k]}" title="${compLbl(k)} ${wFmt(comp[k], 1)}"></span>`).join('')}</div>
    <div class="complg">${keys.map(k => `<span><i style="background:${TYPE_COL[k]}"></i>${compLbl(k)} <b>${wFmt(comp[k], 1)}</b></span>`).join('')}</div>`;
  renderLook(f, ST.fq);

  const all = byW.concat(exits.sort((a, b) => a.dw - b.dw)).filter(r => ST.ft === 'all' || (ST.ft === 'alt' ? !!r.s.alt : r.s.t === ST.ft));
  const selAt = all.findIndex(r => r.si === ST.pos);
  if (selAt >= fcLimit) fcLimit = selAt + 1;                 // pasirinkta pozicija visada matoma
  const list = all.slice(0, fcLimit);
  const tb = document.getElementById('fcTable');
  tb.innerHTML = `<thead><tr><th class="l">#</th><th class="l">${T().thPos}</th>
    <th>${T().thValue}</th><th>${T().thW}</th><th>${T().thDw}</th><th>${T().thDq}</th><th class="l">${T().thAct}</th></tr></thead><tbody>`
    + list.map((r, i) => `<tr data-si="${r.si}" class="${r.exit ? 'exit' : ''}${r.si === ST.pos ? ' sel' : ''}"><td class="l pfsub">${r.exit ? '' : i + 1}</td>
      <td class="nm">${esc(posLabel(r.s))}<br><small>${esc(posSub(r.s))}</small>${attrChips(r.s, r.exit ? ST.fq - 1 : ST.fq)}</td>
      <td>${r.exit ? '–' : eur(r.v)}</td><td>${wFmt(r.w)}</td>
      <td class="${r.dw > 0 ? 'up' : r.dw < 0 ? 'down' : ''}">${r.dw == null ? '–' : pp(r.dw)}</td>
      <td class="${r.dq > 0 ? 'up' : r.dq < 0 ? 'down' : ''}">${r.dq == null || r.act === '' ? '–' : (r.dq > 0 ? '+' : '−') + num(Math.abs(r.dq), 0) + '%'}</td>
      <td class="l">${r.act ? badge(r.act) : ''}</td></tr>`).join('') + '</tbody>';
  tb.querySelectorAll('tbody tr').forEach(tr => tr.addEventListener('click', () => { ST.pos = +tr.dataset.si; save(); renderFund(); }));
  const more = document.getElementById('fcMore');
  more.style.display = all.length > fcLimit ? '' : 'none';
  more.textContent = T().more(all.length - fcLimit) + (lang === 'lt' ? ' (visas)' : ' (all)');
  more.onclick = () => { fcLimit = all.length; renderFund(); };
  document.getElementById('fcNote').textContent = (exits.length ? T().showExits + ' ' : '') + T().fcNote;
  if (ST.pos == null || !list.some(r => r.si === ST.pos)) ST.pos = list.length ? list[0].si : null;
  tb.querySelectorAll('tbody tr').forEach(tr => tr.classList.toggle('sel', +tr.dataset.si === ST.pos));
  renderPosition();
}
function renderLook(f, qi) {
  const L = lookThrough(f, qi), el = document.getElementById('fcLook');
  if (!L.fw && !L.b.eq) { el.innerHTML = ''; return; }
  const share = (a, b) => b ? wFmt(a / b * 100, 0) : '–';
  const k = (l, v, sub) => `<div class="kpi"><span>${l}</span><b>${v}</b>${sub ? `<small>${sub}</small>` : ''}</div>`;
  const eq = L.b.eq || 0, regs = REG_KEYS.filter(r => L.reg[r] > 0.05);
  el.innerHTML = `<h3 class="lk">${T().lkTitle}</h3><div class="kpis lkk">`
    + k(T().lkIdx, wFmt(L.idx, 1), T().lkIdxSub(wFmt(L.act, 1)))
    + k(T().lkTer, L.ter == null ? '–' : num(L.ter, 2) + '%', L.ter == null ? '' : T().lkTerSub(share(L.terW, L.fw)))
    + k(T().lkEm, wFmt(L.em, 1), L.emW ? T().lkEmSub(wFmt(L.emW, 1)) : '')
    + k(T().lkGold, wFmt(L.gold, 1)) + k(T().lkSfdr, wFmt(L.sfdr, 1))
    + k(T().lkCov, share(L.desc, L.fw)) + '</div>'
    + (eq ? `<div class="meta">${T().lkEq(wFmt(eq, 1))}</div><div class="comp">${regs.map(r => `<span style="width:${L.reg[r] / eq * 100}%;background:${REG_COL[r]}" title="${T().reg[r]} ${wFmt(L.reg[r], 1)}"></span>`).join('')}</div>
      <div class="complg">${regs.map(r => `<span><i style="background:${REG_COL[r]}"></i>${T().reg[r]} <b>${wFmt(L.reg[r], 1)}</b></span>`).join('')}</div>` : '')
    + (L.bw > 0.5 ? `<div class="meta" style="margin-top:12px">${T().lkBond(wFmt(L.bw, 1))}</div><div class="kpis lkk">`
      + k(T().lkYtm, L.ytm == null ? '–' : num(L.ytm, 2) + '%', T().lkBondCov(share(L.bdW, L.bw)))
      + k(T().lkDur, L.md == null ? '–' : num(L.md, 1), L.frn > 0.05 ? T().lkFrn(share(L.frn, L.bw)) : '')
      + k(T().lkYrs, L.yrs == null ? '–' : `${num(L.yrs, 1)} ${T().yrs}`) + '</div>' : '')
    + `<p class="note">${T().lkNote}${L.bw > 0.5 ? ' ' + T().bondNote : ''}</p>`;
}
/* Pozicijos istorija: svoris kiekvieno ketvirčio pabaigoje šiame fonde ir kitų valdytojų tos pačios grupės fonduose */
function weightSeries(f, si) {
  const pts = [], first = f.q.findIndex(Boolean);
  for (let i = first; i <= f.last; i++) if (f.q[i]) { const x = f.q[i].get(si); pts.push([QDAY[i], x ? x.v / f.tot[i] * 100 : 0]); }
  return pts;
}
let posCtl = null;
function renderPosition() {
  const f = fundBy[ST.fund], el = document.getElementById('phChart');
  const s = ST.pos == null ? null : S[ST.pos];
  document.getElementById('phTitle').textContent = s ? posLabel(s) : T().phPick;
  document.getElementById('phMeta').innerHTML = s ? esc(`${s.co && s.fn ? s.name + ' · ' : ''}${typeLabel(s)} · ${s.cty || '–'}${s.isin ? ' · ' + s.isin : ''}`)
    + (s.a && s.a.src ? ` · <a href="${esc(s.a.src)}" target="_blank" rel="noopener">${T().source}</a>` : '') + attrChips(s, ST.fq) + `<br>${T().phMeta}` : '';
  if (!s) { el.innerHTML = ''; document.getElementById('phTable').innerHTML = ''; document.getElementById('phNote').textContent = ''; return; }
  const peers = f.pl === 'II' ? FUNDS.filter(g => g.pl === 'II' && g.g === f.g && g.p !== f.p && g.q.some(m => m && m.has(ST.pos))) : [];
  DATA.providers.forEach(p => { p.label = p.id; });
  DATA.providers.find(p => p.id === f.p).label = fundName(f);
  peers.forEach(g => { DATA.providers.find(p => p.id === g.p).label = fundName(g); });
  const series = [{ provider: f.p, points: weightSeries(f, ST.pos) }].concat(peers.map(g => ({ provider: g.p, points: weightSeries(g, ST.pos) })));
  const x0 = Math.min(...series.map(r => r.points[0][0])), x1 = QDAY[NQ - 1];
  const paint = () => { posCtl = drawLineChart(el, series, x0, x1, { height: 260, fmt: v => num(v, 2) + '%', mr: 16 }); };
  paint(); renderPosition.paint = paint;
  document.getElementById('phNote').innerHTML = peers.length ? `<span class="legend">${series.map(r => `<span${r.provider === f.p ? ' style="font-weight:700;color:var(--text)"' : ''}><i style="background:${colorOf(r.provider)}"></i>${esc(labelOf(r.provider))}</span>`).join('')}</span>${T().phPeers}` : '';
  // ketvirčių lentelė (naujausi viršuje): vienetai, vertė, svoris
  const hist = [];
  for (let i = f.last; i >= 0; i--) if (f.q[i] && f.q[i].has(ST.pos)) { const x = f.q[i].get(ST.pos); hist.push(`<tr><td>${qLabel(i)}</td><td>${x && x.u != null ? num(x.u, x.u % 1 ? 2 : 0) : '–'}</td><td>${x ? eur(x.v) : '–'}</td><td>${x ? wFmt(x.v / f.tot[i] * 100) : '–'}</td></tr>`); }
  document.getElementById('phTable').innerHTML = `<thead><tr><th>${T().thQ}</th><th>${T().thUnits}</th><th>${T().thValue}</th><th>${T().thW}</th></tr></thead><tbody>${hist.join('')}</tbody>`;
}

/* ---------- 3. alternatyvios investicijos ---------- */
function altValue(f, qi) { let a = 0; if (f.q[qi]) f.q[qi].forEach((x, si) => { if (S[si].alt) a += x.v; }); return a; }
const altShare = (f, qi) => f.q[qi] && f.tot[qi] ? altValue(f, qi) / f.tot[qi] * 100 : 0;
function altMix(f, qi) { const m = {}; if (f.q[qi]) f.q[qi].forEach((x, si) => { const k = S[si].alt; if (k) m[k] = (m[k] || 0) + x.v; }); return m; }
function renderAlt() {
  const pl = ST.apl || 'II', bar = document.getElementById('altBar');
  bar.innerHTML = field(T().pillar, seg('apl', [['II', 'II'], ['III', 'III']], pl))
    + field(T().quarter, quarterSelect('altQ0', ST.aq0 ?? NQ - 3, 0)) + `<span class="pfsub">→ ${qLabel(NQ - 1)}</span>`;
  wireSegs(bar, { apl: v => { ST.apl = v; save(); renderAlt(); } });
  const q1 = NQ - 1, q0 = Math.min(ST.aq0 ?? NQ - 3, q1 - 1);
  bar.querySelector('#altQ0').addEventListener('change', e => { ST.aq0 = +e.target.value; save(); renderAlt(); });
  // grafikas: valdytojų bendra alternatyvų dalis kiekvieno ketvirčio pabaigoje
  const series = MGRS.map(m => {
    const fs = FUNDS.filter(f => f.pl === pl && f.p === m), pts = [];
    for (let i = 0; i < NQ; i++) { const t = fs.reduce((a, f) => a + f.tot[i], 0); if (t) pts.push([QDAY[i], fs.reduce((a, f) => a + altValue(f, i), 0) / t * 100]); }
    return { provider: m, points: pts };
  }).filter(r => r.points.some(p => p[1] > 0));
  DATA.providers.forEach(p => { p.label = p.id; });
  const el = document.getElementById('altChart');
  const paint = mr => drawLineChart(el, series, QDAY[0], QDAY[q1], { fmt: v => num(v, 1) + '%', mr });
  const hc = renderAlt.hc || (renderAlt.hc = hoverCompress(el, mr => renderAlt.paint(mr)));
  renderAlt.paint = paint; paint(hc.mr);
  document.getElementById('altChartMeta').textContent = T().altChart;
  document.getElementById('altLegend').innerHTML = series.map(r => `<span><i style="background:${colorOf(r.provider)}"></i>${r.provider} <b>${num(r.points[r.points.length - 1][1], 1)}%</b></span>`).join('');
  // lentelė: kiekvienas fondas – dalis per paskutinius ketvirčius ir pokytis nuo pasirinkto ketvirčio
  const cols = []; for (let i = Math.max(0, q1 - 7); i <= q1; i++) cols.push(i);
  if (!cols.includes(q0)) cols.unshift(q0);
  const live = FUNDS.filter(f => f.pl === pl && f.last === q1);
  const funds = live.filter(f => cols.concat([q0]).some(i => altShare(f, i) > 0));
  const none = [...new Set(live.filter(f => !funds.includes(f)).map(f => f.p))];
  const order = g => g === 'turto' ? '0' : g;
  funds.sort((a, b) => order(b.g).localeCompare(order(a.g)) || a.p.localeCompare(b.p) || a.n.localeCompare(b.n));
  const maxA = Math.max(1, ...funds.flatMap(f => cols.map(i => altShare(f, i))));
  const cell = v => `<td style="background:color-mix(in srgb, #c9a227 ${Math.round(v / maxA * 85)}%, transparent)">${v ? num(v, 1) : '–'}</td>`;
  const chg = (a, b) => a && b ? `<td class="${b > a ? 'up' : b < a ? 'down' : ''}">${b > a ? '+' : '−'}${num(Math.abs(b / a - 1) * 100, 0)}%</td>` : '<td>–</td>';
  let lastG = null;
  const tb = document.getElementById('altTable');
  tb.innerHTML = `<thead><tr><th class="l">${T().thFund}</th>${cols.map(i => `<th>${qLabel(i)}</th>`).join('')}<th>${T().thDw}</th>
    <th>${T().thAltV}</th><th class="l">${T().thAltMix}</th><th>${T().thChgAlt}</th><th>${T().thChgTot}</th></tr>
    <tr><th></th>${cols.map(() => '<th></th>').join('')}<th></th><th></th><th></th><th colspan="2" style="text-align:center">${T().thChg(qLabel(q0), qLabel(q1))}</th></tr></thead><tbody>`
    + funds.map(f => {
      const sep = pl === 'II' && f.g !== lastG ? `<tr class="sep"><td colspan="${cols.length + 6}">${f.g === 'turto' ? T().turto : T().born + ' ' + f.g.replace('-', '–')}</td></tr>` : '';
      lastG = f.g;
      const a1 = altShare(f, q1), a0 = altShare(f, q0), mix = altMix(f, q1), mt = Object.values(mix).reduce((x, y) => x + y, 0);
      return sep + `<tr data-c="${f.c}"><td class="l">${sw(f.p)}${esc(fundName(f))}</td>${cols.map(i => cell(altShare(f, i))).join('')}
        <td class="${a1 > a0 ? 'up' : a1 < a0 ? 'down' : ''}">${f.q[q0] ? pp(a1 - a0) : '–'}</td><td>${mt ? eur(mt) : '–'}</td>
        <td class="l pfsub">${Object.entries(mix).sort((x, y) => y[1] - x[1]).map(([k, v]) => `${T().alts[k]} ${num(v / mt * 100, 0)}%`).join(' · ')}</td>
        ${chg(altValue(f, q0), altValue(f, q1))}${chg(f.tot[q0], f.tot[q1])}</tr>`;
    }).join('') + '</tbody>';
  tb.querySelectorAll('tbody tr[data-c]').forEach(tr => tr.addEventListener('click', () => {
    ST.fund = tr.dataset.c; ST.fq = q1; ST.ft = 'alt'; ST.pos = null; fcLimit = 40; save(); renderFund();
    document.getElementById('fcTitle').scrollIntoView({ behavior: 'smooth' });
  }));
  document.getElementById('altNote').textContent = (none.length ? T().altNone(none.join(', ')) + ' ' : '') + T().altNote;
}

/* ---------- 4. palyginimas grupėje ---------- */
const PG_COLS = [['eq', 'thEq'], ['bd', 'thBd'], ['alt', 'thAlt'], ['cash', 'thCash'], ['idx', 'thIdx'], ['ter', 'thTer'], ['em', 'thEm'], ['emW', 'thEmW'], ['gold', 'thGold'], ['sfdr', 'thSfdr'], ['ytm', 'thYtm'], ['md', 'thDur']];
const PG_REG = ['na', 'eu', 'baltic', 'gdm', 'glob', 'jp', 'ap', 'em', 'unk'];
function peerRow(f, qi) {
  const L = lookThrough(f, qi);
  const r = { f, emUnk: L.emUnk, eq: L.b.eq || 0, bd: L.b.bd || 0, alt: L.b.alt || 0, cash: L.b.cash || 0, idx: L.idx, ter: L.ter, em: L.em, emW: L.emW, gold: L.gold, sfdr: L.sfdr, ytm: L.bw > 0.5 ? L.ytm : null, md: L.bw > 0.5 ? L.md : null };
  PG_REG.forEach(k => { r['r_' + k] = L.reg[k] || 0; });
  return r;
}
function renderPeers() {
  const groups = [...new Set(FUNDS.filter(f => f.pl === 'II').map(f => f.g))].sort((a, b) => (a === 'turto' ? '9' : a).localeCompare(b === 'turto' ? '9' : b)).concat(['III']);
  const own = fundBy[ST.fund].pl === 'III' ? 'III' : fundBy[ST.fund].g;
  if (!groups.includes(ST.pg)) ST.pg = own;
  if (!(ST.pgq >= 0 && ST.pgq < NQ)) ST.pgq = NQ - 1;
  const gName = g => g === 'III' ? T().pgIII : g === 'turto' ? T().turto : T().born + ' ' + g.replace('-', '–');
  const bar = document.getElementById('pgBar');
  bar.innerHTML = field(T().group, `<select id="pgG">${groups.map(g => `<option value="${g}"${g === ST.pg ? ' selected' : ''}>${gName(g)}</option>`).join('')}</select>`)
    + field(T().quarter, quarterSelect('pgQ', ST.pgq, 0));
  bar.querySelector('#pgG').addEventListener('change', e => { ST.pg = e.target.value; save(); renderPeers(); });
  bar.querySelector('#pgQ').addEventListener('change', e => { ST.pgq = +e.target.value; save(); renderPeers(); });
  const qi = ST.pgq;
  const funds = FUNDS.filter(f => f.q[qi] && (ST.pg === 'III' ? f.pl === 'III' : f.pl === 'II' && f.g === ST.pg))
    .sort((a, b) => a.p.localeCompare(b.p) || a.n.localeCompare(b.n));
  const rows = funds.map(f => peerRow(f, qi));
  const cols = PG_COLS.concat(PG_REG.filter(k => rows.some(r => r['r_' + k] > 0.05)).map(k => ['r_' + k, null, k]));
  const maxOf = k => Math.max(...rows.map(r => r[k] || 0));
  const mx = Object.fromEntries(cols.map(([k]) => [k, maxOf(k)]));
  const colr = k => k === 'ytm' || k === 'md' ? 'var(--s2)' : k === 'ter' ? 'var(--s6)' : k === 'gold' ? '#c9a227' : k === 'em' || k === 'r_em' ? '#d0453f' : k.startsWith('r_') ? REG_COL[k.slice(2)] : 'var(--s1)';
  const cell = (r, k) => { const v = r[k]; if (v == null || (!v && k !== 'ter')) return '<td>–</td>';
    return `<td style="background:color-mix(in srgb, ${colr(k)} ${Math.round(v / (mx[k] || 1) * 45)}%, transparent)">${k === 'ter' || k === 'ytm' ? num(v, 2) + '%' : num(v, 1)}</td>`; };
  const nm = r => `${r.f.p}${ST.pg === 'III' ? ' ' + fundName(r.f).replace(r.f.p, '').trim() : ''}`;
  const tb = document.getElementById('pgTable');
  const nReg = cols.length - PG_COLS.length;
  tb.innerHTML = `<thead><tr><th class="l" rowspan="2">${T().thFund}</th>${PG_COLS.map(([, t]) => `<th rowspan="2">${T()[t]}</th>`).join('')}${nReg ? `<th colspan="${nReg}" style="text-align:center">${T().thReg}</th>` : ''}</tr>
    <tr>${cols.slice(PG_COLS.length).map(([, , r]) => `<th>${T().reg[r]}</th>`).join('')}</tr></thead><tbody>`
    + rows.map(r => `<tr data-c="${r.f.c}"><td class="l">${sw(r.f.p)}${esc(ST.pg === 'III' ? fundName(r.f) : r.f.p)}</td>${cols.map(([k]) => cell(r, k)).join('')}</tr>`).join('') + '</tbody>';
  tb.querySelectorAll('tbody tr[data-c]').forEach(tr => tr.addEventListener('click', () => {
    ST.fund = tr.dataset.c; ST.fq = qi; ST.ft = 'all'; ST.pos = null; fcLimit = 40; save(); renderFund();
    document.getElementById('fcTitle').scrollIntoView({ behavior: 'smooth' });
  }));
  // signalai
  const sig = [], list = a => a.map(nm).join(', ');
  const ext = (k, what, p = 1) => {
    const xs = rows.filter(r => r[k] != null); if (xs.length < 2) return;
    const hi = xs.reduce((a, b) => b[k] > a[k] ? b : a), lo = xs.reduce((a, b) => b[k] < a[k] ? b : a);
    if (hi[k] - lo[k] < 0.5) return;
    const zero = xs.filter(r => r[k] < 0.05), loTxt = zero.length ? T().sigLeast(what, list(zero), '0%') : T().sigLeast(what, nm(lo), wFmt(lo[k], p));
    sig.push(`${T().sigMost(what, nm(hi), wFmt(hi[k], p))}; ${loTxt}`);
  };
  if (rows.length > 1) {
    ext('eq', T().wEq); ext('alt', T().wAlt); ext('idx', T().wIdx);
    const noEm = rows.filter(r => r.em < 0.05 && r.emW < 0.05 && r.emUnk < 1 && r.eq > 1);
    if (noEm.length) sig.push(T().sigNoEm(list(noEm)));
    ext('em', T().wEm);
    const ters = rows.filter(r => r.ter != null);
    if (ters.length > 1) { const lo = ters.reduce((a, b) => b.ter < a.ter ? b : a), hi = ters.reduce((a, b) => b.ter > a.ter ? b : a);
      sig.push(T().sigTer(nm(lo), num(lo.ter, 2) + '%', nm(hi), num(hi.ter, 2) + '%')); }
    const gold = rows.filter(r => r.gold > 0.05);
    sig.push(gold.length ? T().sigGold(gold.map(r => `${nm(r)} ${wFmt(r.gold, 1)}`).join(', ')) : T().sigNoGold);
    [['ytm', 'sigYtm', v => num(v, 2) + '%'], ['md', 'sigDur', v => num(v, 1)]].forEach(([k, key, fm]) => {
      const xs = rows.filter(r => r[k] != null); if (xs.length < 2) return;
      const hi = xs.reduce((a, b) => b[k] > a[k] ? b : a), lo = xs.reduce((a, b) => b[k] < a[k] ? b : a);
      sig.push(T()[key](nm(hi), fm(hi[k]), nm(lo), fm(lo[k])));
    });
    ext('r_na', T().wNa); if (rows.some(r => r.r_baltic > 0.5)) ext('r_baltic', T().wBaltic);
  }
  document.getElementById('pgSignals').innerHTML = sig.length ? `<b>${T().pgSig}</b><ul>${sig.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  document.getElementById('pgNote').textContent = T().pgNote;
}

function renderAll() {
  document.getElementById('sub').textContent = `${T().navPortfolios} · ${lang === 'lt' ? 'LB ataskaitos' : 'Bank of Lithuania reports'} ${qLabel(0)} – ${qLabel(NQ - 1)}`;
  ['tcTitle', 'tcLead', 'altTitle', 'altLead', 'pgTitle', 'pgLead', 'fcTitle', 'fcLead', 'foot'].forEach(id => { document.getElementById(id).textContent = T()[id]; });
  renderTopChanges(); renderAlt(); renderPeers(); renderFund();
}
renderHeader('portfolios', renderAll);
renderAll();
let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { renderPosition.paint && renderPosition.paint(); renderAlt.paint && renderAlt.paint(renderAlt.hc.mr); }, 120); });
