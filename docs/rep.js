/* Ataskaitų polapis: vieno valdytojo visų fondų lentelės (kalendorinių metų ir mėnesių grąža, Performance KPI,
   LB stiliaus fondo rodikliai). Kiekviena lentelė turi metodikos paaiškinimą (ⓘ) ir Excel atsisiuntimą su formulėmis. */
addStrings({
  mgr: 'Manager', calTitle: 'Returns since 2019',
  calLead: 'Every fund of the selected manager: total and average annual return since the end of 2018, then each calendar year. The current year runs to the latest unit value.',
  thFund: 'Fund', thTot: 'Total for the whole period', thAvg: 'Average annual', ytdCol: y => `${y} (YTD)`,
  rkTip: 'Place among this manager’s funds in this table (1 = highest total return)',
  calNote: (a, e) => `Period ${a} → ${e}. * = the fund started later, so the figure covers only part of the period. Colour: green = gain, red = loss.`,
  monTitle: y => `Monthly returns ${y}`, ytd: 'Year to date',
  monNote: e => `Month-end unit values; the last month runs to the latest value (${e}).`,
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  kpiTitle: 'Performance KPI',
  kpiLead: 'Returns of the manager’s funds for the chosen period compared with the other managers’ funds in the same group and with the fund’s benchmark (SAA).',
  view: 'View', per: { ytd: 'YTD', '1y': '1Y', '3yc': '3Y cumulative', '3ya': '3Y annualized', '5yc': '5Y cumulative', '5ya': '5Y annualized' },
  asof: 'As of', asLast: 'latest day', asMonth: 'latest month-end', qLabel: (y, q, d) => `${y} Q${q} (${d})`,
  cmp: 'Compare with',
  thNet: 'Net return', thMed: 'Peer median', thGross: 'Gross return', thFee: 'Fee now, % a year', thSaa: 'SAA (benchmark)', thNetD: 'Net − SAA', thGrossD: 'Gross − SAA',
  thRank: 'Ranking in risk class', thN: 'Number of funds in risk class', thRisk: 'Risk class', thAum: 'AUM, €', thShare: 'Share',
  eq: v => `${num(v, 0)}% equity`, total: 'Total', pl2: 'II pillar', pl3: 'III pillar',
  kpiNote: (a, e, ann) => `Period ${a} → ${e}; ${ann ? 'returns are annualized (average a year)' : 'returns are cumulative for the whole period'}. Ranking 1 = best in the group. Method: (i) next to the title.`,
  lbTitle: 'Fund indicators (Bank of Lithuania layout)',
  lbLead: 'One fund at a time, as in the Bank of Lithuania fund results tables: average unit value and benchmark change and their standard deviation from 6 months to since start, then each calendar year.',
  fund: 'Fund', lbAvg: 'Average unit value change, %', lbAvgB: 'Average benchmark change, %', lbStd: 'Standard deviation of unit value change, %', lbStdB: 'Standard deviation of benchmark change, %',
  lbFund: 'Fund annual return', lbIdx: 'Benchmark annual return', lbCols: ['6 mo.', '1 yr', '3 yrs', '5 yrs', 'Since start'], lbYear: y => `${y}`, sinceStart: 'Since start',
  lbNote: (e, s) => `As of ${e}. Since start = from ${s}. * = part of the year (the fund started that year). The benchmark is published only by SEB and Goindex. Method: (i) next to the title.`,
  loading: 'loading…', xls: 'Excel', xlsTip: 'Download this table as Excel: the table, every input value with its date and the formulas used',
  sheetT: 'Table', sheetC: 'Calculations', sheetD: 'Daily',
  cH: ['Fund', 'Item', 'Start date', 'Start value', 'End date', 'End value', 'Years', 'Fee added, %', 'Result', 'How', 'AUM, €'],
  hCum: 'end ÷ start − 1', hAnn: '(end ÷ start)^(1 ÷ years) − 1', hG: 'end ÷ start − 1 + fee ÷ 100', hGA: '(end ÷ start + fee ÷ 100)^(1 ÷ years) − 1',
  hStd: (n, k) => `sample standard deviation of ${n} daily changes (sheet ${T().sheetD}) × √${k}`, hYrs: 'years = days ÷ 365.25', hYrsM: m => `years = ${m} months ÷ 12`,
  hFee: 'fee = Σ rate × days in the period that year ÷ days in the year',
  dH: ['Date', 'Unit value', 'Benchmark', 'Unit value change', 'Benchmark change'],
  dNote: 'Only days when the unit value or the benchmark changed (days with no change at all are left out, as the Bank of Lithuania does).',
  info: {
    cal: 'Data: each fund’s unit value at the end of every month = the last unit value published on or before the month’s last day (not older than 10 days).\n\nTotal = latest unit value ÷ unit value on 2018-12-31 − 1. A fund that started later is counted from its first month-end (marked *).\nAverage annual = (1 + total)^(1 ÷ years) − 1, years = days ÷ 365.25.\nCalendar year = unit value on 31 Dec ÷ unit value on 31 Dec of the year before − 1; the current year runs to the latest unit value.\nPlace = order by total among this manager’s funds of the same pillar.\n\nExcel: the “Calculations” sheet lists for every cell the start and end date, both unit values and the formula; the “Table” cells point to it.',
    mon: 'Month = month-end unit value ÷ previous month-end unit value − 1; the current month runs to the latest unit value.\nYear to date = latest unit value ÷ unit value on 31 Dec of last year − 1.\nMonth-end unit value = the last unit value published on or before the month’s last day.\n\nExcel: every cell with its dates, unit values and formula.',
    kpi: 'As of: a quarter end (default: the latest one), the latest month-end, or the latest day each fund has.\nStart: YTD = 31 Dec of the previous year; 1Y / 3Y / 5Y = the month-end 12 / 36 / 60 months before.\n\nNet return = unit value at the end ÷ unit value at the start − 1 (unit values are already after fees).\nAnnualized = (end ÷ start)^(1 ÷ years) − 1, years = 3 or 5 (months ÷ 12; with “latest day”: days ÷ 365.25).\nPeer median = median of the other managers’ funds in the same group (II pillar: birth-year group; III pillar: fund type).\nGross = net + fees added back: for each calendar year in the period, fee rate × days of the period in that year ÷ days in that year. Rates: II pillar until 2025 = each fund’s 2025 BAR (Bank of Lithuania results report); from 2026 = the fee published by the Bank of Lithuania (the base rate; the lower rate for large managers is not used: it applied only briefly); III pillar = the published asset management fee for the whole period. Annualized gross = (1 + net + fees)^(1 ÷ years) − 1.\nSAA = the same calculation on the fund’s benchmark index (published daily only by SEB and Goindex).\nRanking = 1 + number of funds in the group with a higher net return; number of funds = funds in the group with data for the whole period.\nRisk class = equity share in the fund strategy (Bank of Lithuania). AUM = net assets on the as-of date (with “latest day”: the latest known); share = fund AUM ÷ the manager’s pillar AUM. Total = AUM-weighted net return.\n\nExcel: every fund of every group with dates, unit values, years, the fee formula and the result; median, ranking and total are Excel formulas.',
    lb: 'As of the chosen quarter end (or the latest month-end).\n\nAverage change: 6 months and 1 year = cumulative (end ÷ start − 1); 3 years, 5 years and since start = average a year, (end ÷ start)^(1 ÷ years) − 1, years = months ÷ 12. Start = the month-end 6 / 12 / 36 / 60 months before; since start = 2018-12-31 (or the fund’s first unit value if it started later).\n\nStandard deviation: daily unit values (and benchmark); days when neither the unit value nor the benchmark changed are left out; daily change = value ÷ previous kept value − 1; sample standard deviation of the changes in the period × √252 (a year). For 6 months × √126 (half a year, not annualized). This reproduces the Bank of Lithuania figures.\n\nAnnual return = unit value on 31 Dec ÷ 31 Dec of the year before − 1; the as-of year runs to the as-of date. Since start = cumulative from the start.\n\nExcel: the “Daily” sheet has the kept daily values with change formulas; standard deviations are STDEV(range) × SQRT(252) on it.',
  },
  foot: 'Sources: providers’ unit values and net assets (collected automatically), Bank of Lithuania results reports and fee files. For information only, not investment advice.',
}, {
  mgr: 'Valdytojas', calTitle: 'Grąža nuo 2019 m.',
  calLead: 'Visi pasirinkto valdytojo fondai: bendra ir vidutinė metinė grąža nuo 2018 m. pabaigos, tada kiekvieni kalendoriniai metai. Šie metai – iki paskutinės vieneto vertės.',
  thFund: 'Fondas', thTot: 'Bendra per visą laikotarpį', thAvg: 'Vidutinė metinė', ytdCol: y => `${y} (YTD)`,
  rkTip: 'Vieta tarp šio valdytojo fondų šioje lentelėje (1 = didžiausia bendra grąža)',
  calNote: (a, e) => `Laikotarpis ${a} → ${e}. * = fondas pradėjo veikti vėliau, todėl skaičius apima tik dalį laikotarpio. Spalva: žalia = pelnas, raudona = nuostolis.`,
  monTitle: y => `Mėnesių grąža ${y} m.`, ytd: 'Nuo metų pradžios',
  monNote: e => `Mėnesių pabaigos vieneto vertės; paskutinis mėnuo – iki paskutinės vertės (${e}).`,
  months: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
  kpiTitle: 'Performance KPI',
  kpiLead: 'Valdytojo fondų grąža pasirinktu laikotarpiu, palyginti su kitų valdytojų tos pačios grupės fondais ir su fondo lyginamuoju indeksu (SAA).',
  view: 'Vaizdas', per: { ytd: 'YTD', '1y': '1 m.', '3yc': '3 m. sukaupta', '3ya': '3 m. metinė', '5yc': '5 m. sukaupta', '5ya': '5 m. metinė' },
  asof: 'Data', asLast: 'paskutinė diena', asMonth: 'paskutinė mėn. pabaiga', qLabel: (y, q, d) => `${y} Q${q} (${d})`,
  cmp: 'Palyginti su',
  thNet: 'Grynoji grąža', thMed: 'Peer median', thGross: 'Bruto grąža', thFee: 'Mokestis dabar, % per metus', thSaa: 'SAA (indeksas)', thNetD: 'Grynoji − SAA', thGrossD: 'Bruto − SAA',
  thRank: 'Vieta rizikos klasėje', thN: 'Fondų skaičius klasėje', thRisk: 'Rizikos klasė', thAum: 'AUM, €', thShare: 'Dalis',
  eq: v => `${num(v, 0)}% akcijų`, total: 'Iš viso', pl2: 'II pakopa', pl3: 'III pakopa',
  kpiNote: (a, e, ann) => `Laikotarpis ${a} → ${e}; ${ann ? 'grąža metinė (vidutiniškai per metus)' : 'grąža sukaupta per visą laikotarpį'}. Vieta 1 = geriausias grupėje. Metodika: (i) prie pavadinimo.`,
  lbTitle: 'Fondo rodikliai (Lietuvos banko forma)',
  lbLead: 'Vienas fondas, kaip Lietuvos banko fondų rezultatų lentelėse: vidutinis vieneto vertės ir lyginamojo indekso pokytis ir jų standartinis nuokrypis nuo 6 mėn. iki viso laikotarpio, tada kiekvieni kalendoriniai metai.',
  fund: 'Fondas', lbAvg: 'Vidutinis vieneto vertės pokytis, %', lbAvgB: 'Vidutinis lyginamojo indekso pokytis, %', lbStd: 'Vieneto vertės pokyčio standartinis nuokrypis, %', lbStdB: 'Lyginamojo indekso standartinis nuokrypis, %',
  lbFund: 'Fondo metinė grąža', lbIdx: 'Indekso metinė grąža', lbCols: ['6 mėn.', '1 m.', '3 m.', '5 m.', 'Nuo veiklos pradžios'], lbYear: y => `${y} m.`, sinceStart: 'Nuo veiklos pradžios',
  lbNote: (e, s) => `${e} duomenimis. Nuo veiklos pradžios = nuo ${s}. * = dalis metų (fondas pradėjo veikti tais metais). Lyginamąjį indeksą skelbia tik SEB ir Goindex. Metodika: (i) prie pavadinimo.`,
  loading: 'kraunama…', xls: 'Excel', xlsTip: 'Atsisiųsti šią lentelę Excel faile: lentelė, visi naudoti duomenys su datomis ir formulės',
  sheetT: 'Lentelė', sheetC: 'Skaičiavimai', sheetD: 'Dienos',
  cH: ['Fondas', 'Rodiklis', 'Pradžios data', 'Pradžios reikšmė', 'Pabaigos data', 'Pabaigos reikšmė', 'Metai', 'Pridėtas mokestis, %', 'Rezultatas', 'Kaip', 'AUM, €'],
  hCum: 'pabaiga ÷ pradžia − 1', hAnn: '(pabaiga ÷ pradžia)^(1 ÷ metai) − 1', hG: 'pabaiga ÷ pradžia − 1 + mokestis ÷ 100', hGA: '(pabaiga ÷ pradžia + mokestis ÷ 100)^(1 ÷ metai) − 1',
  hStd: (n, k) => `${n} dienos pokyčių imties standartinis nuokrypis (lapas „${T().sheetD}“) × √${k}`, hYrs: 'metai = dienos ÷ 365,25', hYrsM: m => `metai = ${m} mėn. ÷ 12`,
  hFee: 'mokestis = Σ tarifas × laikotarpio dienos tais metais ÷ metų dienos',
  dH: ['Data', 'Vieneto vertė', 'Indeksas', 'Vieneto vertės pokytis', 'Indekso pokytis'],
  dNote: 'Tik dienos, kai pasikeitė vieneto vertė arba indeksas (dienos be jokio pokyčio praleistos, kaip daro Lietuvos bankas).',
  info: {
    cal: 'Duomenys: kiekvieno fondo vieneto vertė mėnesio pabaigoje = paskutinė paskelbta vertė iki mėnesio paskutinės dienos imtinai (ne senesnė nei 10 d.).\n\nBendra = paskutinė vieneto vertė ÷ vertė 2018-12-31 − 1. Vėliau pradėjęs fondas skaičiuojamas nuo pirmos mėnesio pabaigos (pažymėta *).\nVidutinė metinė = (1 + bendra)^(1 ÷ metai) − 1, metai = dienos ÷ 365,25.\nKalendoriniai metai = gruodžio 31 d. vertė ÷ ankstesnių metų gruodžio 31 d. vertė − 1; šie metai – iki paskutinės vertės.\nVieta = eilė pagal bendrą grąžą tarp šio valdytojo tos pačios pakopos fondų.\n\nExcel: lape „Skaičiavimai“ kiekvienam langeliui – pradžios ir pabaigos data, abi vieneto vertės ir formulė; lapo „Lentelė“ langeliai į jį rodo.',
    mon: 'Mėnuo = mėnesio pabaigos vieneto vertė ÷ ankstesnio mėnesio pabaigos vertė − 1; einamasis mėnuo – iki paskutinės vertės.\nNuo metų pradžios = paskutinė vertė ÷ praėjusių metų gruodžio 31 d. vertė − 1.\nMėnesio pabaigos vertė = paskutinė paskelbta vertė iki mėnesio paskutinės dienos imtinai.\n\nExcel: kiekvienas langelis su datomis, vieneto vertėmis ir formule.',
    kpi: 'Data: ketvirčio pabaiga (numatyta – paskutinė), paskutinė mėnesio pabaiga arba kiekvieno fondo paskutinė diena.\nPradžia: YTD = praėjusių metų gruodžio 31 d.; 1 / 3 / 5 m. = mėnesio pabaiga prieš 12 / 36 / 60 mėn.\n\nGrynoji grąža = vieneto vertė pabaigoje ÷ vieneto vertė pradžioje − 1 (vieneto vertės jau po mokesčių).\nMetinė = (pabaiga ÷ pradžia)^(1 ÷ metai) − 1, metai = 3 arba 5 (mėnesiai ÷ 12; su „paskutinė diena“ – dienos ÷ 365,25).\nPeer median = kitų valdytojų tos pačios grupės fondų grąžos mediana (II pakopa – gimimo metų grupė, III pakopa – fondo tipas).\nBruto = grynoji + atgal pridėti mokesčiai: kiekvieniems kalendoriniams metams laikotarpyje – mokesčio tarifas × laikotarpio dienos tais metais ÷ dienos tais metais. Tarifai: II pakopa iki 2025 m. – kiekvieno fondo 2025 m. BAR (Lietuvos banko rezultatų ataskaita); nuo 2026 m. – Lietuvos banko skelbiamas mokestis (bazinis tarifas; mažesnis tarifas didelėms bendrovėms netaikomas, nes galiojo labai trumpai); III pakopa – skelbiamas valdymo mokestis nuo turto visam laikotarpiui. Metinė bruto = (1 + grynoji + mokesčiai)^(1 ÷ metai) − 1.\nSAA = tas pats skaičiavimas su fondo lyginamuoju indeksu (kasdien jį skelbia tik SEB ir Goindex).\nVieta = 1 + grupės fondų su didesne grynąja grąža skaičius; fondų skaičius = grupės fondai, turintys duomenis visam laikotarpiui.\nRizikos klasė = akcijų dalis fondo strategijoje (Lietuvos bankas). AUM = grynieji aktyvai pasirinktą datą (su „paskutinė diena“ – paskutiniai žinomi); dalis = fondo AUM ÷ valdytojo pakopos AUM. Iš viso = AUM pasverta grynoji grąža.\n\nExcel: visi kiekvienos grupės fondai su datomis, vieneto vertėmis, metais, mokesčio formule ir rezultatu; mediana, vieta ir „Iš viso“ – Excel formulės.',
    lb: 'Pasirinktos ketvirčio pabaigos (arba paskutinės mėnesio pabaigos) duomenimis.\n\nVidutinis pokytis: 6 mėn. ir 1 m. – sukauptas (pabaiga ÷ pradžia − 1); 3 m., 5 m. ir nuo veiklos pradžios – vidutinis per metus, (pabaiga ÷ pradžia)^(1 ÷ metai) − 1, metai = mėnesiai ÷ 12. Pradžia = mėnesio pabaiga prieš 6 / 12 / 36 / 60 mėn.; nuo veiklos pradžios = 2018-12-31 (arba pirmoji fondo vieneto vertė, jei fondas pradėjo vėliau).\n\nStandartinis nuokrypis: kasdienės vieneto vertės (ir indeksas); dienos, kai nepasikeitė nei vieneto vertė, nei indeksas, praleidžiamos; dienos pokytis = vertė ÷ ankstesnė likusi vertė − 1; laikotarpio pokyčių imties standartinis nuokrypis × √252 (metinis). 6 mėn. – × √126 (pusmečio, ne metinis). Taip gaunami Lietuvos banko skaičiai.\n\nMetų grąža = gruodžio 31 d. vertė ÷ ankstesnių metų gruodžio 31 d. vertė − 1; pasirinktos datos metai – iki tos datos. Nuo veiklos pradžios = sukaupta nuo pradžios.\n\nExcel: lape „Dienos“ – likusios kasdienės vertės su pokyčių formulėmis; standartiniai nuokrypiai = STDEV(intervalas) × SQRT(252) šiame lape.',
  },
  foot: 'Šaltiniai: bendrovių skelbiamos vieneto vertės ir grynieji aktyvai (renkami automatiškai), Lietuvos banko rezultatų ataskaitos ir mokesčių failai. Informacinė medžiaga, ne investavimo rekomendacija.',
});

const MGRS = ['ALLIANZ', 'ARTEA', 'GOINDEX', 'LUMINOR', 'SEB', 'SWEDBANK'];       // tvarka = spalvos --s1..--s6
const MLABEL = { ALLIANZ: 'Allianz', ARTEA: 'Artea', GOINDEX: 'Goindex', LUMINOR: 'Luminor', SEB: 'SEB', SWEDBANK: 'Swedbank' };
var DATA = { providers: MGRS.map(m => ({ id: m, label: MLABEL[m] })) };
const ORDER2 = ['turto', '1961-1967', '1968-1974', '1975-1981', '1982-1988', '1989-1995', '1996-2002', '2003-2009'];
const ORDER3 = ['bond', 'mixed', 'equity'];
const FEE_FROM_2026 = { life: 0.40, turto: 0.20 };        // atsarginė reikšmė, jei fondo nėra data/fees.csv
const M = REP.months, NM = M.length;
const field = (label, html) => `<label class="field">${label} ${html}</label>`;
function seg(id, opts, cur) {
  return `<div class="seg" role="group" data-seg="${id}">` + opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${t}</button>`).join('') + '</div>';
}
function wire(root, handlers) {
  root.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => handlers[g.dataset.seg](b.dataset.v))));
}
const ST = Object.assign({ m: 'SEB', per: 'ytd', kas: 'q', las: 'q', lf: '', c1: 'SWEDBANK', c2: 'ARTEA', c3: 'GOINDEX' },
  (() => { try { return JSON.parse(localStorage.getItem('repstate')) || {}; } catch (e) { return {}; } })());
if (ST.per === '3y' || ST.per === '5y') ST.per += 'c';
try { const q = new URLSearchParams(location.search).get('m'); if (q && MGRS.includes(q)) ST.m = q; } catch (e) {}
const save = () => { try { localStorage.setItem('repstate', JSON.stringify(ST)); } catch (e) {} };
const ik = k => `<button type="button" class="info" data-k="${k}" aria-label="info">i</button>`;
const xbtn = k => `<button type="button" class="btn xls" data-x="${k}" title="${T().xlsTip}">⤓ ${T().xls}</button>`;

/* ---------- skaičiavimai ---------- */
const yearOf = d => new Date(d * DAY).getUTCFullYear(), monthOf = d => new Date(d * DAY).getUTCMonth();
const mIdx = (y, m) => M.findIndex(d => yearOf(d) === y && monthOf(d) === m);   // mėnesio pabaigos indeksas
const short = d => iso(d).replace(/-/g, '.');
/* taškas: mėnesio pabaigos indeksas, 'L' (paskutinė diena) arba 'S' (pirmoji vertė nuo 2018-12) -> [diena, vertė] */
function pt(f, i, bm) {
  if (i === 'L') return bm ? (f.blv != null ? [f.bld, f.blv] : null) : [f.ld, f.lv];
  if (i === 'S') return bm ? null : f.s0;
  const v = bm ? f.bm && f.bm[i] : f.m[i];
  return v != null ? [M[i], v] : null;
}
function firstIdx(f, from) { for (let i = from; i < NM; i++) if (f.m[i] != null) return i; return null; }
function feeParts(f, d0, d1) {              // [[tarifas %, dienos, metų dienos]] – atskaitymai proporcingai dienoms
  if (f.pl === 'III' ? f.fee == null : f.bar == null && f.fee == null) return null;
  const out = [];
  for (let y = yearOf(d0); y <= yearOf(d1); y++) {
    const ys = Math.round(Date.UTC(y, 0, 1) / DAY), ye = Math.round(Date.UTC(y + 1, 0, 1) / DAY);
    const days = Math.max(0, Math.min(d1, ye) - Math.max(d0, ys));
    // II pakopa: iki 2025 m. – fondo 2025 m. BAR, nuo 2026 m. – LB skelbiamas mokestis; III pakopa – LB skelbiamas mokestis
    const rate = f.pl === 'III' ? f.fee : y >= 2026 ? (f.fee ?? FEE_FROM_2026[f.g === 'turto' ? 'turto' : 'life']) : (f.bar ?? f.fee);
    if (days) out.push([rate, days, ye - ys]);
  }
  return out;
}
const median = xs => { const s = xs.filter(x => x != null).sort((a, b) => a - b); if (!s.length) return null; const k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
const fundsOf = (pl, m) => REP.funds.filter(f => f.pl === pl && f.p === m)
  .sort((a, b) => pl === 'II' ? ORDER2.indexOf(a.g) - ORDER2.indexOf(b.g) : ORDER3.indexOf(a.g) - ORDER3.indexOf(b.g) || a.n.localeCompare(b.n));
const shortName = f => f.n.replace(' tikslinės grupės pensijų fondas', '').replace(' gimusiems', '').replace(/ m\.$/, '').replace('–', '-');

/* ---------- kasdieniai duomenys (docs/rep_daily.js, kraunami atskirai) ---------- */
let DAILY_P = null;
function loadDaily() {
  if (!DAILY_P) DAILY_P = new Promise(ok => { const s = document.createElement('script'); s.src = document.body.dataset.daily || 'rep_daily.js'; s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
  return DAILY_P;
}
const DCACHE = new Map();
function dailyOf(f) {                        // tik dienos, kai pasikeitė vieneto vertė arba indeksas
  if (!window.REPD) return null;
  if (DCACHE.has(f)) return DCACHE.get(f);
  const x = REPD[REP.funds.indexOf(f)];
  if (!x) return null;
  const days = [x[0]]; x[1].forEach(dd => days.push(days[days.length - 1] + dd));
  const v = x[2], b = x[3] || null, kd = [], kv = [], kb = [];
  for (let k = 0; k < days.length; k++) {
    if (k && v[k] === v[k - 1] && (!b || b[k] === b[k - 1])) continue;
    kd.push(days[k]); kv.push(v[k]); kb.push(b ? b[k] : null);
  }
  const D = { kd, kv, kb };
  DCACHE.set(f, D);
  return D;
}

/* ---------- Excel modelis: kiekviena skaičiuota reikšmė = eilutė lape „Skaičiavimai“ ---------- */
function XB() { this.rows = []; this.table = []; this.daily = null; }
/* rec(): grąža tarp dviejų taškų; o = {bm, ann, years (mėn. ÷ 12) arba null -> dienos ÷ 365,25, months, gross}; grąžina {n: Excel eilutė, v: %} */
XB.prototype.rec = function (f, item, a, b, o = {}) {
  const p0 = pt(f, a, o.bm), p1 = pt(f, b, o.bm);
  if (!(p0 && p1 && p1[0] > p0[0])) return { n: null, v: null };
  const yrs = o.ann ? (o.years || (p1[0] - p0[0]) / 365.25) : null;
  const parts = o.gross ? feeParts(f, p0[0], p1[0]) : null;
  if (o.gross && !parts) return { n: null, v: null };
  const fee = parts ? parts.reduce((s, [r, d, y]) => s + r * d / y, 0) : 0, q = p1[1] / p0[1];
  const v = (o.ann ? Math.pow(q + fee / 100, 1 / yrs) - 1 : q - 1 + fee / 100) * 100;
  this.rows.push({ f, item, d0: p0[0], v0: p0[1], d1: p1[0], v1: p1[1], yrs, ym: o.ann ? (o.years ? o.months : 'd') : null, parts, ann: !!o.ann, gross: !!o.gross, v, aum: o.aum });
  return { n: this.rows.length + 1, v };
};
/* std(): standartinis nuokrypis iš kasdienių pokyčių, kurių data (t0; t1], × √scale */
XB.prototype.std = function (f, label, bm, t0, t1, scale) {
  const D = dailyOf(f);
  if (!D) return { n: null, v: null, wait: !window.REPD };
  const col = bm ? D.kb : D.kv;
  let a = D.kd.findIndex(d => d > t0), b = -1;
  for (let k = D.kd.length - 1; k >= 0; k--) if (D.kd[k] <= t1) { b = k; break; }
  if (a < 1 || b - a < 1 || D.kd[0] > t0) return { n: null, v: null };
  const r = [];
  for (let k = a; k <= b; k++) if (col[k] != null && col[k - 1] != null) r.push(col[k] / col[k - 1] - 1);
  if (r.length < 2) return { n: null, v: null };
  const mu = r.reduce((s, x) => s + x, 0) / r.length, sd = Math.sqrt(r.reduce((s, x) => s + (x - mu) ** 2, 0) / (r.length - 1));
  const v = sd * Math.sqrt(scale) * 100;
  this.daily = f;
  this.rows.push({ f, item: label, d0: t0, d1: t1, std: { a: a + 2, b: b + 2, col: bm ? 'E' : 'D', scale, cnt: r.length }, v });
  return { n: this.rows.length + 1, v };
};
/* lentelės langelis Excel: tekstas / skaičius / {n, v} (nuoroda į skaičiavimą) / {f, v, z} (formulė) */
const ref = c => c && c.n ? c : null;

/* ---------- spalvos, formatai ---------- */
function heat(v, scale) {
  if (v == null) return '';
  const t = Math.min(1, Math.abs(v) / scale);
  return `background:${v >= 0 ? `hsl(135,45%,${92 - 37 * t}%)` : `hsl(5,75%,${92 - 27 * t}%)`}`;
}
const pc = (v, p = 2) => v == null ? '–' : `${v < 0 ? '−' : ''}${num(Math.abs(v), p)}%`;
const pp = (v, p = 2) => v == null ? '–' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${num(Math.abs(v), p)}`;
const hcell = (v, scale, extra = '', cls = '') => v == null ? `<td class="na ${cls}">–</td>` : `<td class="hc ${cls}" style="${heat(v, scale)}">${pc(v)}${extra}</td>`;
const ranks = vals => vals.map(v => v == null ? null : 1 + vals.filter(o => o != null && o > v).length);
const head = (id, title, k) => { document.getElementById(id).innerHTML = `${title} ${ik(k)} ${xbtn(k)}`; };

/* datos pasirinkimas: ketvirčių pabaigos (naujausia pirmiau), paskutinė mėnesio pabaiga, (KPI) paskutinė diena */
const qDefault = () => { for (let i = NM - 1; i > 0; i--) if (monthOf(M[i]) % 3 === 2) return i; return NM - 1; };
function asofOpts(withLast) {
  const out = [];
  if (withLast) out.push(['last', T().asLast]);
  if (monthOf(M[NM - 1]) % 3 !== 2) out.push(['m', `${T().asMonth} (${short(M[NM - 1])})`]);
  for (let i = NM - 1; i > 0; i--) if (monthOf(M[i]) % 3 === 2 && yearOf(M[i]) >= 2019) out.push([String(i), T().qLabel(yearOf(M[i]), (monthOf(M[i]) + 1) / 3, short(M[i]))]);
  return out;
}
const asofIdx = v => v === 'last' ? 'L' : v === 'm' ? NM - 1 : +v > 0 && +v < NM ? +v : qDefault();
const asofSel = (key, withLast) => {
  const cur = ST[key] === 'last' || ST[key] === 'm' ? ST[key] : String(asofIdx(ST[key]));
  return `<select data-a="${key}">${asofOpts(withLast).map(([v, t]) => `<option value="${v}"${v === cur ? ' selected' : ''}>${t}</option>`).join('')}</select>`;
};

const MODELS = {};                         // lentelė -> XB (Excel atsisiuntimui)

/* ---------- 1. grąža nuo 2019 m. ---------- */
function renderCal() {
  const xb = new XB();
  const i0 = mIdx(2018, 11), lastY = yearOf(Math.max(...REP.funds.map(f => f.ld)));
  const years = []; for (let y = lastY; y >= 2019; y--) years.push(y);
  xb.table.push(['', T().thFund, T().thTot, T().thAvg, ...years.map((y, j) => j ? String(y) : T().ytdCol(y))]);
  let body = '';
  for (const pl of ['II', 'III']) {
    const fs = fundsOf(pl, ST.m);
    if (!fs.length) continue;
    const rows = fs.map(f => {
      const s = f.m[i0] != null ? i0 : firstIdx(f, i0);
      const tot = s != null ? xb.rec(f, T().thTot, s, 'L') : { v: null };
      const avg = s != null && (f.ld - M[s]) / 365.25 >= 1 ? xb.rec(f, T().thAvg, s, 'L', { ann: true }) : { v: null };
      const ys = years.map(y => {
        const a = mIdx(y - 1, 11), b = y === lastY ? 'L' : mIdx(y, 11), fa = firstIdx(f, a);
        const aa = f.m[a] != null ? a : (fa != null && yearOf(M[fa]) === y ? fa : null);
        return aa == null ? { v: null } : Object.assign(xb.rec(f, String(y), aa, b), { part: aa !== a });
      });
      return { f, tot, avg, part: s !== i0, ys };
    });
    const rk = ranks(rows.map(r => r.tot.v));
    xb.table.push(['', pl === 'II' ? T().pl2 : T().pl3]);
    rows.forEach((r, k) => xb.table.push([rk[k], shortName(r.f), ref(r.tot), ref(r.avg), ...r.ys.map(ref)]));
    body += `<tr class="sep"><td colspan="${4 + years.length}">${pl === 'II' ? T().pl2 : T().pl3}</td></tr>`;
    body += rows.map((r, k) => `<tr><td class="rk" title="${T().rkTip}">${rk[k] ?? ''}</td><td class="l">${shortName(r.f)}</td>${hcell(r.tot.v, 150, r.part ? '*' : '')}<td class="hc b">${pc(r.avg.v)}</td>${r.ys.map((x, j) => x.v != null ? `<td class="hc${j ? '' : ' bl'}" style="${heat(x.v, 25)}">${pc(x.v)}${x.part ? '*' : ''}</td>` : `<td class="na${j ? '' : ' bl'}">–</td>`).join('')}</tr>`).join('');
  }
  head('calTitle', T().calTitle, 'cal');
  document.getElementById('calTable').innerHTML = `<thead><tr><th></th><th class="l">${T().thFund}</th><th>${T().thTot}</th><th>${T().thAvg}</th>${years.map((y, j) => `<th class="${j ? '' : 'bl'}">${j ? y : T().ytdCol(y)}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
  const e = Math.max(...fundsOf('II', ST.m).concat(fundsOf('III', ST.m)).map(f => f.ld));
  document.getElementById('calNote').textContent = T().calNote(short(M[i0]), short(e));
  MODELS.cal = Object.assign(xb, { name: `${MLABEL[ST.m]} ${T().calTitle}` });
}

/* ---------- 2. mėnesių grąža ---------- */
function renderMonths() {
  const xb = new XB();
  const all = fundsOf('II', ST.m).concat(fundsOf('III', ST.m));
  const e = Math.max(...all.map(f => f.ld)), y = yearOf(e), lastM = monthOf(e);
  head('monTitle', T().monTitle(y), 'mon');
  const i0 = mIdx(y - 1, 11);
  xb.table.push(['', T().thFund, T().ytd, ...T().months]);
  let body = '';
  for (const pl of ['II', 'III']) {
    const fs = fundsOf(pl, ST.m);
    if (!fs.length) continue;
    const rows = fs.map(f => ({ f, ytd: xb.rec(f, T().ytd, i0, 'L'), ms: T().months.map((mn, m) => { if (m > lastM) return undefined; const a = m === 0 ? i0 : mIdx(y, m - 1), b = m === lastM ? 'L' : mIdx(y, m); return xb.rec(f, `${mn} ${y}`, a, b); }) }));
    const rk = ranks(rows.map(r => r.ytd.v));
    xb.table.push(['', pl === 'II' ? T().pl2 : T().pl3]);
    rows.forEach((r, k) => xb.table.push([rk[k], shortName(r.f), ref(r.ytd), ...r.ms.map(ref)]));
    body += `<tr class="sep"><td colspan="15">${pl === 'II' ? T().pl2 : T().pl3}</td></tr>`;
    body += rows.map((r, k) => `<tr><td class="rk" title="${T().rkTip}">${rk[k] ?? ''}</td><td class="l">${shortName(r.f)}</td>${hcell(r.ytd.v, 20, '', 'b')}${r.ms.map((x, j) => x === undefined ? `<td class="na${j ? '' : ' bl'}"></td>` : x.v == null ? `<td class="na${j ? '' : ' bl'}">–</td>` : `<td class="hc${j ? '' : ' bl'}" style="${heat(x.v, 6)}">${pc(x.v)}</td>`).join('')}</tr>`).join('');
  }
  document.getElementById('monTable').innerHTML = `<thead><tr><th></th><th class="l">${T().thFund}</th><th>${T().ytd}</th>${T().months.map((m, j) => `<th class="${j ? '' : 'bl'}">${m}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
  document.getElementById('monNote').textContent = T().monNote(short(e));
  MODELS.mon = Object.assign(xb, { name: `${MLABEL[ST.m]} ${T().monTitle(y)}` });
}

/* ---------- 3. Performance KPI ---------- */
function renderKpi() {
  if (!T().per[ST.per]) ST.per = 'ytd';
  const others = MGRS.filter(m => m !== ST.m);
  ['c1', 'c2', 'c3'].forEach((c, k) => { if (ST[c] === ST.m || !MGRS.includes(ST[c])) ST[c] = others[k]; });
  const sel = c => `<select data-c="${c}">${others.map(m => `<option value="${m}"${m === ST[c] ? ' selected' : ''}>${MLABEL[m]}</option>`).join('')}</select>`;
  const bar = document.getElementById('kpiBar');
  bar.innerHTML = field(T().asof, asofSel('kas', true)) + field(T().view, seg('per', Object.keys(T().per).map(p => [p, T().per[p]]), ST.per))
    + field(T().cmp, sel('c1') + sel('c2') + sel('c3'));
  wire(bar, { per: v => { ST.per = v; save(); renderKpi(); } });
  bar.querySelectorAll('select[data-c]').forEach(s => s.addEventListener('change', () => { ST[s.dataset.c] = s.value; save(); renderKpi(); }));
  bar.querySelector('select[data-a]').addEventListener('change', e => { ST.kas = e.target.value; save(); renderKpi(); });
  head('kpiTitle', T().kpiTitle, 'kpi');

  // pabaiga: pasirinkta ketvirčio / mėnesio pabaiga arba kiekvieno fondo paskutinė diena; pradžia – mėnesio pabaiga prieš n mėn.
  const xb = new XB();
  const lastAll = Math.max(...REP.funds.map(f => f.ld)), endKey = asofIdx(ST.kas), bi = endKey === 'L' ? NM - 1 : endKey;
  const endDay = endKey === 'L' ? lastAll : M[endKey];
  const n = { ytd: 0, '1y': 12, '3yc': 36, '3ya': 36, '5yc': 60, '5ya': 60 }[ST.per], ann = ST.per.endsWith('a');
  const ai = ST.per === 'ytd' ? mIdx(yearOf(endDay) - 1, 11) : bi - n;
  MODELS.kpi = null;
  if (ai < 0) { document.getElementById('kpiTable').innerHTML = ''; document.getElementById('kpiNote').textContent = '–'; return; }
  const o = (extra = {}) => Object.assign({ ann, years: ann && endKey !== 'L' ? n / 12 : null, months: n }, extra);
  const cols = [ST.c1, ST.c2, ST.c3];
  xb.table.push([T().thFund, T().thNet, T().thMed, T().thGross, T().thFee, T().thSaa, T().thNetD, T().thGrossD, ...cols.map(m => MLABEL[m]), T().thRank, T().thN, T().thRisk, T().thAum, T().thShare]);
  const C = c => `'${T().sheetC}'!I${c.n}`;
  let body = '';
  for (const pl of ['II', 'III']) {
    const fs = fundsOf(pl, ST.m);
    if (!fs.length) continue;
    const aumOf = f => endKey === 'L' ? f.aum : f.am && f.am[endKey];      // AUM pasirinktą datą
    const aumTot = fs.reduce((a, f) => a + (aumOf(f) || 0), 0);
    xb.table.push([pl === 'II' ? T().pl2 : T().pl3]);
    const tRows = [];
    let wsum = 0, wret = 0;
    body += `<tr class="sep"><td colspan="16">${pl === 'II' ? T().pl2 : T().pl3}</td></tr>`;
    body += fs.map(f => {
      // visi grupės fondai (visų valdytojų) – kad mediana, vieta ir palyginimai būtų patikrinami Excel
      const peers = REP.funds.filter(x => x.pl === pl && x.g === f.g).sort((a, b) => MGRS.indexOf(a.p) - MGRS.indexOf(b.p) || a.n.localeCompare(b.n));
      const pr = peers.map(x => ({ x, c: xb.rec(x, T().thNet, ai, endKey, o({ aum: aumOf(x) })) }));
      const me = pr.find(p => p.x === f).c, net = me.v, oth = pr.filter(p => p.x.p !== f.p && p.c.n);
      const med = median(oth.map(p => p.c.v));
      const gross = xb.rec(f, T().thGross, ai, endKey, o({ gross: true })), saa = xb.rec(f, T().thSaa, ai, endKey, o({ bm: true }));
      const valid = pr.filter(p => p.c.n), rk = net == null ? null : 1 + valid.filter(p => p.c.v > net).length, cnt = valid.length;
      const cmpv = cols.map(m => { if (pl !== 'II') return null; const p = pr.find(p => p.x.p === m); return p ? p.c : null; });
      const aum = aumOf(f);
      if (net != null && aum) { wsum += aum; wret += aum * net; tRows.push([me.n, aum]); }
      xb.table.push([shortName(f), ref(me), oth.length ? { f: `MEDIAN(${oth.map(p => C(p.c)).join(',')})`, v: med } : null, ref(gross), f.fee,
        ref(saa), me.n && saa.n ? { f: `${C(me)}-${C(saa)}`, v: net - saa.v } : null, gross.n && saa.n ? { f: `${C(gross)}-${C(saa)}`, v: gross.v - saa.v } : null,
        ...cmpv.map(ref), me.n ? { f: `1+${valid.map(p => `(${C(p.c)}>${C(me)})`).join('+')}`, v: rk, z: '0' } : null, valid.length ? { f: `COUNT(${valid.map(p => C(p.c)).join(',')})`, v: cnt, z: '0' } : null,
        pl === 'II' ? (f.risky == null ? '' : T().eq(f.risky)) : (f.risky || ''), aum ?? null, aum && aumTot ? { v: aum / aumTot * 100 } : null]);
      const vs = (a, b) => a == null || b == null ? '' : a >= b ? 'good' : 'bad';
      const risk = pl === 'II' ? (f.risky == null ? '–' : T().eq(f.risky)) : (f.risky || '–');
      return `<tr><td class="l">${shortName(f)}</td><td>${pc(net)}</td><td class="${vs(net, med)}">${pc(med)}</td><td>${pc(gross.v)}</td><td class="rsub">${f.fee == null ? '–' : num(f.fee, 2)}</td><td class="${vs(gross.v, saa.v)}">${pc(saa.v)}</td>`
        + `<td class="${net != null && saa.v != null ? (net >= saa.v ? 'up' : 'down') : ''}">${net != null && saa.v != null ? pp(net - saa.v) : '–'}</td><td class="${gross.v != null && saa.v != null ? (gross.v >= saa.v ? 'up' : 'down') : ''}">${gross.v != null && saa.v != null ? pp(gross.v - saa.v) : '–'}</td>`
        + cmpv.map((c, k) => `<td class="${k ? '' : 'bl'}">${pl === 'II' ? pc(c && c.v) : ''}</td>`).join('')
        + `<td class="bl">${rk ?? '–'}</td><td>${cnt || '–'}</td><td>${risk}</td><td class="bl">${aum ? num(aum, 0) : '–'}</td><td>${aum && aumTot ? pc(aum / aumTot * 100) : '–'}</td></tr>`;
    }).join('');
    xb.table.push([T().total, tRows.length ? { f: `(${tRows.map(([r, a]) => `'${T().sheetC}'!I${r}*${a}`).join('+')})/${wsum}`, v: wret / wsum } : null, ...Array(12).fill(null), aumTot, { v: 100 }]);
    body += `<tr class="tot"><td class="l">${T().total}</td><td>${wsum ? pc(wret / wsum) : '–'}</td><td colspan="12"></td><td class="bl">${num(aumTot, 0)}</td><td>100%</td></tr>`;
  }
  document.getElementById('kpiTable').innerHTML = `<thead><tr><th class="l">${T().thFund}</th><th>${T().thNet}</th><th>${T().thMed}</th><th>${T().thGross}</th><th>${T().thFee}</th><th>${T().thSaa}</th><th>${T().thNetD}</th><th>${T().thGrossD}</th>${cols.map((m, k) => `<th class="${k ? '' : 'bl'}">${MLABEL[m]}</th>`).join('')}<th class="bl">${T().thRank}</th><th>${T().thN}</th><th>${T().thRisk}</th><th class="bl">${T().thAum}</th><th>${T().thShare}</th></tr></thead><tbody>${body}</tbody>`;
  document.getElementById('kpiNote').textContent = T().kpiNote(short(M[ai]), short(endDay), ann);
  MODELS.kpi = Object.assign(xb, { name: `${MLABEL[ST.m]} KPI ${T().per[ST.per]} ${iso(endDay)}` });
}

/* ---------- 4. LB stiliaus fondo rodikliai ---------- */
function renderLb() {
  const fs = fundsOf('II', ST.m).concat(fundsOf('III', ST.m));
  if (!fs.some(f => REP.funds.indexOf(f) === +ST.lf)) ST.lf = String(REP.funds.indexOf(fs.find(f => f.g === '1975-1981') || fs[0]));
  const f = REP.funds[+ST.lf];
  const bar = document.getElementById('lbBar');
  bar.innerHTML = field(T().asof, asofSel('las', false)) + field(T().fund, `<select data-f>${fs.map(x => `<option value="${REP.funds.indexOf(x)}"${x === f ? ' selected' : ''}>${shortName(x)}</option>`).join('')}</select>`);
  bar.querySelector('select[data-a]').addEventListener('change', e => { ST.las = e.target.value; save(); renderLb(); });
  bar.querySelector('select[data-f]').addEventListener('change', e => { ST.lf = e.target.value; save(); renderLb(); });
  head('lbTitle', T().lbTitle, 'lb');

  const xb = new XB(), bi = asofIdx(ST.las), hasB = !!f.bm;
  const s = f.m[0] != null ? 0 : 'S', sDay = s === 0 ? M[0] : f.s0[0];      // veiklos pradžia: 2018-12-31 arba pirmoji vertė
  const wins = [[6, false], [12, false], [36, true], [60, true], [null, true]];   // [mėnesiai, metinė]
  const rowRet = bm => wins.map(([n, ann], j) => {
    const a = n == null ? s : bi - n;
    if (n != null && (a < 0 || M[a] < sDay)) return { v: null };
    const months = n ?? bi;
    return xb.rec(f, `${bm ? T().lbAvgB : T().lbAvg} · ${T().lbCols[j]}`, a, bi, { bm, ann, years: ann && (n != null || s === 0) ? months / 12 : null, months });
  });
  const rowStd = bm => wins.map(([n], j) => {
    const t0 = n == null ? sDay : (bi - n >= 0 ? M[bi - n] : null);
    if (t0 == null || t0 < sDay) return { v: null };
    return xb.std(f, `${bm ? T().lbStdB : T().lbStd} · ${T().lbCols[j]}`, bm, t0, M[bi], n === 6 ? 126 : 252);
  });
  const r1 = rowRet(false), r2 = hasB ? rowRet(true) : null, r3 = rowStd(false), r4 = hasB ? rowStd(true) : null;
  const y1 = yearOf(M[bi]), years = []; for (let y = y1; y >= Math.max(2019, yearOf(sDay + 1)); y--) years.push(y);
  const yr = bm => years.map(y => {
    const a = mIdx(y - 1, 11), b = y === y1 ? bi : mIdx(y, 11);
    const aa = M[a] >= sDay ? a : s === 'S' && yearOf(sDay) === y ? s : null;
    return aa == null ? { v: null } : Object.assign(xb.rec(f, `${bm ? T().lbIdx : T().lbFund} · ${T().lbYear(y)}`, aa, b, { bm }), { part: aa === 'S' });
  }).concat([xb.rec(f, `${bm ? T().lbIdx : T().lbFund} · ${T().sinceStart}`, s, bi, { bm })]);
  const a1 = yr(false), a2 = hasB ? yr(true) : null;
  const cell = c => c.v == null ? `<td class="na">${c.wait ? T().loading : '–'}</td>` : `<td>${num(c.v, 2)}</td>`;
  const cellP = (c, j) => `<td class="${j === years.length ? 'bl ' : ''}${c.v == null ? 'na' : ''}">${c.v == null ? '–' : `${num(c.v, 2)}%${c.part ? '*' : ''}`}</td>`;
  const dash = k => Array(k).fill('<td class="na">–</td>').join('');
  const line = (label, cs) => `<tr><td class="l">${label}</td>${cs ? cs.map(cell).join('') : dash(wins.length)}</tr>`;
  document.getElementById('lbTable').innerHTML = `<thead><tr><th class="l">${shortName(f)}</th>${T().lbCols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>`
    + line(T().lbAvg, r1) + line(T().lbAvgB, r2) + line(T().lbStd, r3) + line(T().lbStdB, r4) + '</tbody>';
  document.getElementById('lbYears').innerHTML = `<thead><tr><th class="l"></th>${years.map(y => `<th>${T().lbYear(y)}</th>`).join('')}<th class="bl">${T().sinceStart}</th></tr></thead><tbody>`
    + [[T().lbFund, a1], [T().lbIdx, a2]].map(([l, cs]) => `<tr><td class="l">${l}</td>${cs ? cs.map(cellP).join('') : dash(years.length + 1)}</tr>`).join('') + '</tbody>';
  document.getElementById('lbNote').textContent = T().lbNote(short(M[bi]), short(sDay));
  const raw = c => c && c.n ? { n: c.n, v: c.v, z: '0.00' } : null;
  xb.table.push([shortName(f), ...T().lbCols], [T().lbAvg, ...r1.map(raw)], [T().lbAvgB, ...(r2 || []).map(raw)], [T().lbStd, ...r3.map(raw)], [T().lbStdB, ...(r4 || []).map(raw)], [],
    ['', ...years.map(T().lbYear), T().sinceStart], [T().lbFund, ...a1.map(ref)], [T().lbIdx, ...(a2 || []).map(ref)]);
  MODELS.lb = Object.assign(xb, { name: `${shortName(f)} ${iso(M[bi])}` });
}

/* ---------- Excel ---------- */
function loadScript(src) { return new Promise((ok, no) => { if (window.XLSX) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
const xd = d => ({ t: 'n', v: d + 25569, z: 'yyyy-mm-dd' });           // Excel data (dienos nuo 1900 m.)
function buildBook(k) {
  const X = MODELS[k], S = T(), CN = `'${S.sheetC}'`;
  if (!X) return null;
  const calc = [S.cH];
  X.rows.forEach((r, i) => {
    const n = i + 2, name = `${MLABEL[r.f.p]} · ${r.f.n}`;
    if (r.std) {
      const { a, b, col, scale, cnt } = r.std;
      calc.push([name, r.item, xd(r.d0), null, xd(r.d1), null, null, null, { t: 'n', v: r.v / 100, f: `STDEV('${S.sheetD}'!${col}${a}:${col}${b})*SQRT(${scale})`, z: '0.00%' }, S.hStd(cnt, scale)]);
      return;
    }
    const yrs = r.ann ? (r.ym === 'd' ? { t: 'n', v: r.yrs, f: `(E${n}-C${n})/365.25`, z: '0.0000' } : { t: 'n', v: r.yrs, f: `${r.ym}/12`, z: '0.0000' }) : null;
    const fee = r.parts ? { t: 'n', v: r.parts.reduce((s, [a, d, y]) => s + a * d / y, 0), f: r.parts.map(([a, d, y]) => `${a}*${d}/${y}`).join('+'), z: '0.0000' } : null;
    const f = r.gross ? (r.ann ? `(F${n}/D${n}+H${n}/100)^(1/G${n})-1` : `F${n}/D${n}-1+H${n}/100`) : (r.ann ? `(F${n}/D${n})^(1/G${n})-1` : `F${n}/D${n}-1`);
    const how = (r.gross ? (r.ann ? S.hGA : S.hG) : (r.ann ? S.hAnn : S.hCum)) + (r.ann ? '; ' + (r.ym === 'd' ? S.hYrs : S.hYrsM(r.ym)) : '') + (r.gross ? '; ' + S.hFee : '');
    calc.push([name, r.item, xd(r.d0), r.v0, xd(r.d1), r.v1, yrs, fee, { t: 'n', v: r.v / 100, f, z: '0.00%' }, how, r.aum ?? null]);
  });
  // lentelės lapas: langeliai – formulės, rodančios į „Skaičiavimai“
  const cellOf = c => {
    if (c == null || typeof c !== 'object') return c ?? null;
    const z = c.z || '0.00%', div = z === '0.00%' ? 100 : 1;
    if (c.n) return z === '0.00' ? { t: 'n', v: c.v, f: `${CN}!I${c.n}*100`, z } : { t: 'n', v: c.v / 100, f: `${CN}!I${c.n}`, z };
    return c.f ? { t: 'n', v: c.v / div, f: c.f, z } : { t: 'n', v: c.v / div, z };
  };
  const wb = XLSX.utils.book_new();
  const wsT = XLSX.utils.aoa_to_sheet(X.table.map(r => r.map(cellOf)));
  wsT['!cols'] = [{ wch: 40 }, ...Array(20).fill({ wch: 13 })];
  XLSX.utils.book_append_sheet(wb, wsT, S.sheetT);
  const wsC = XLSX.utils.aoa_to_sheet(calc);
  wsC['!cols'] = [{ wch: 55 }, { wch: 36 }, { wch: 11 }, { wch: 12 }, { wch: 11 }, { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 10 }, { wch: 60 }, { wch: 14 }];
  XLSX.utils.book_append_sheet(wb, wsC, S.sheetC);
  if (X.daily) {                            // kasdieniai duomenys su pokyčių formulėmis
    const D = dailyOf(X.daily), rows = [S.dH];
    D.kd.forEach((d, k) => {
      const n = k + 2;
      rows.push([xd(d), D.kv[k], D.kb[k], k ? { t: 'n', v: D.kv[k] / D.kv[k - 1] - 1, f: `B${n}/B${n - 1}-1`, z: '0.0000%' } : null,
        k && D.kb[k] != null && D.kb[k - 1] != null ? { t: 'n', v: D.kb[k] / D.kb[k - 1] - 1, f: `C${n}/C${n - 1}-1`, z: '0.0000%' } : null]);
    });
    rows.push([], [S.dNote]);
    const wsD = XLSX.utils.aoa_to_sheet(rows);
    wsD['!cols'] = [{ wch: 11 }, { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsD, S.sheetD);
  }
  return { wb, file: `${X.name.replace(/[^\p{L}\p{N}.-]+/gu, '_')}.xlsx` };
}
async function download(k) {
  await Promise.all([loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'), k === 'lb' ? loadDaily().then(renderLb) : null]);
  const b = buildBook(k);
  if (b) XLSX.writeFile(b.wb, b.file);
}

function renderAllParts() {
  document.getElementById('sub').textContent = `${T().navReports} · ${T().updated} ${REP.generated}`;
  const bar = document.getElementById('mgrBar');
  bar.innerHTML = field(T().mgr, seg('m', MGRS.map(m => [m, MLABEL[m]]), ST.m));
  wire(bar, { m: v => { ST.m = v; save(); renderAllParts(); } });
  ['calLead', 'kpiLead', 'lbLead', 'foot'].forEach(id => { document.getElementById(id).textContent = T()[id]; });
  renderCal(); renderMonths(); renderKpi(); renderLb();
}
document.addEventListener('click', e => {
  const x = e.target.closest('.xls');
  if (x) { download(x.dataset.x).catch(err => alert('Excel: ' + err)); return; }
  const pop = document.getElementById('pop'), b = e.target.closest('.info');
  if (!b) { if (!e.target.closest('#pop')) pop.style.display = 'none'; return; }
  e.stopPropagation();
  if (pop.style.display === 'block' && pop._b === b) { pop.style.display = 'none'; return; }
  pop.textContent = T().info[b.dataset.k]; pop._b = b; pop.style.display = 'block';
  const r = b.getBoundingClientRect(), w = pop.offsetWidth;
  pop.style.left = Math.max(8, Math.min(r.left + scrollX - 8, scrollX + document.documentElement.clientWidth - w - 8)) + 'px'; pop.style.top = (r.bottom + scrollY + 6) + 'px';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('pop').style.display = 'none'; });
renderHeader('reports', renderAllParts);
renderAllParts();
loadDaily().then(renderLb);
