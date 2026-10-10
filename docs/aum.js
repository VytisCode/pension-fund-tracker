/* Turto (AUM) polapis: fondų grynųjų aktyvų kitimas, turto pokytis per laikotarpius ir pensijų reformos išmokėjimai. */
/* išmokėjimo ketvirtis (pvz. 2026-2 = balandis) -> prašymų ketvirtis, kaip savininko lentelėse („2026 Q1“) */
const appQ = q => { let [y, n] = q.split('-').map(Number); n -= 1; if (!n) { y -= 1; n = 4; } return `${y} Q${n}`; };
const PAY_QS = ['2026-2', '2026-3', '2026-4', '2027-1', '2027-2', '2027-3', '2027-4', '2028-1'];   // 8 reformos išmokėjimai
addStrings({
  chTitle: 'Net assets (AUM)',
  chLead: 'How much money the funds manage. Daily net assets from the providers; where daily figures are not yet collected, quarter-end values from the Bank of Lithuania portfolio reports are used.',
  gtTitle: 'Change in net assets',
  qtTitle: 'Net assets at quarter end, by fund', qtNow: 'Latest',
  qtNote: 'Net assets (€ m) of each fund on the last day of each quarter (the latest value on or before that day); the small figure is the change from the previous quarter. Pillar and age group follow the choice above the chart. Older quarters use Bank of Lithuania quarter-end data where daily figures are not available; “–” = no data for that fund.',
  poTitle: 'Payouts under the pension reform',
  poLead: 'Since 2026 participants who chose to leave the II pillar are paid out at the start of each quarter (by the 15th). A payout shows up as a sudden fall in net assets that the unit value does not explain. The table shows when each manager paid out and how much the funds lost.',
  pillar: 'Pillar', view: 'Show', vMgr: 'Managers (all funds)', vGrp: 'Group', show: 'Values', sEur: '€ m', sPct: 'Change, %',
  cpf: 'Capital preservation funds', cats: { bond: 'Bond funds', mixed: 'Mixed funds', equity: 'Equity funds' }, allGroups: 'All funds',
  lgTip: 'Click to hide or show this line; double-click to show only it', lgAll: 'Show all',
  chMeta: u => u === 'pct' ? 'Change in net assets since the start of the period, %' : 'Net assets, € m',
  chNote: q => q ? `Quarter-end values from the Bank of Lithuania (no daily data yet): ${q}.` : '',
  thMgr: 'Manager', thFund: 'Fund', thAum: 'Net assets, € m', thDate: 'Date', thPaid: 'Paid out, € m', thShare: 'Of assets', thWhen: 'Date',
  per: { '3m': '3 months', ytd: 'This year', '1y': '1 year', '3y': '3 years' }, total: 'Total',
  gtNote: 'Change = net assets at the latest date minus net assets at the period start (each manager from its own latest date). It includes contributions, payouts and investment returns. A total is shown only when all managers have data for the whole period.',
  byMgr: 'By manager', byFund: 'By fund', bySum: 'Summary', est: '≈ quarter', pu: 'Values', puPct: 'Share of assets', puEur: '€ m',
  thQ: 'Quarter', cum: 'Total so far', rankTip: 'Place among managers this quarter (1 = lost the smallest share of assets)',
  sumNote: 'Quarter = the quarter in which participants applied; the money is paid out at the start of the next quarter. The reform runs until the end of 2027, so there will be 8 payout quarters in total. Colour: green = the smallest share of assets lost, red = the largest (one scale for all cells); the small number = place among managers that quarter.',
  poNote: 'Payout = sum of daily outflows (change in net assets beyond the unit value change) on days in the first 20 days of the quarter when a manager lost more than 1 % of its assets. Share = payout ÷ net assets just before the payout, valued at the payout day’s unit value (so the market move of that day is removed from both the payout and the base). “≈ quarter”: no daily data for that quarter yet, so the figure is estimated from Bank of Lithuania quarter-end reports (it also includes the quarter’s regular contributions and returns are removed using unit values).',
  xls: 'Excel', xlsTip: 'Download the payouts as Excel: tables by manager and by fund, every daily input value and the formulas used',
  xSheets: ['By manager', 'By fund', 'Calculations'],
  xCalcH: ['Quarter (applications)', 'Manager', 'Fund', 'First payout day (1 = yes)', 'Previous date', 'Unit value', 'Net assets, €', 'Payout date', 'Unit value', 'Net assets, €', 'Base: previous assets at today’s unit value, € = G×I/F', 'Flow, € = J−K', 'Flow share = L/K', 'Estimate'],
  xTabH: ['Paid out, €', 'Base, €', 'Share'], xGroup: 'Group',
  xNote: 'Flow = net assets − previous net assets × (unit value ÷ previous unit value): the part of the change in net assets not explained by the unit value (the market). Paid out = sum of flows on payout days; base = net assets just before the payout at the payout day’s unit value (first payout day); share = paid out ÷ base. “≈”: estimate from Bank of Lithuania quarter-end data.',
  quarter: q => appQ(q),
  foot: 'Sources: providers’ daily net asset values (collected automatically), Bank of Lithuania quarterly portfolio reports. For information only, not investment advice.',
}, {
  chTitle: 'Fondų turtas (AUM)',
  chLead: 'Kiek pinigų valdo fondai. Kasdieniai grynieji aktyvai – iš bendrovių; kur kasdienių duomenų dar nerenkame, naudojamos ketvirčio pabaigos sumos iš Lietuvos banko portfelių ataskaitų.',
  gtTitle: 'Turto pokytis',
  qtTitle: 'Turtas ketvirčių pabaigose pagal fondą', qtNow: 'Naujausia',
  qtNote: 'Kiekvieno fondo turtas (mln. €) paskutinę ketvirčio dieną (paskutinė žinoma reikšmė iki tos dienos); mažas skaičius – pokytis nuo ankstesnio ketvirčio. Pakopa ir amžiaus grupė – kaip pasirinkta virš grafiko. Senesniems ketvirčiams, kur kasdienių duomenų nėra, naudojami Lietuvos banko ketvirčio pabaigos duomenys; „–“ = to fondo duomenų nėra.',
  poTitle: 'Išmokėjimai pagal pensijų reformą',
  poLead: 'Nuo 2026 m. iš II pakopos pasitraukti nusprendusiems dalyviams lėšos išmokamos kiekvieno ketvirčio pradžioje (iki 15 d.). Išmokėjimas matyti kaip staigus turto sumažėjimas, kurio nepaaiškina vieneto vertės pokytis. Lentelėje – kada kiekvienas valdytojas išmokėjo ir kiek fondai neteko turto.',
  pillar: 'Pakopa', view: 'Rodyti', vMgr: 'Valdytojus (visi fondai)', vGrp: 'Grupę', show: 'Reikšmės', sEur: 'mln. €', sPct: 'Pokytis, %',
  cpf: 'Turto išsaugojimo fondai', cats: { bond: 'Obligacijų fondai', mixed: 'Mišraus investavimo fondai', equity: 'Akcijų fondai' }, allGroups: 'Visi fondai',
  lgTip: 'Paspausk, kad paslėptum ar parodytum šią liniją; paspausk dukart, kad liktų tik ji', lgAll: 'Rodyti visas',
  chMeta: u => u === 'pct' ? 'Turto pokytis nuo laikotarpio pradžios, %' : 'Grynieji aktyvai, mln. €',
  chNote: q => q ? `Ketvirčio pabaigos sumos iš Lietuvos banko (kasdienių duomenų dar nėra): ${q}.` : '',
  thMgr: 'Valdytojas', thFund: 'Fondas', thAum: 'Turtas, mln. €', thDate: 'Data', thPaid: 'Išmokėta, mln. €', thShare: 'Turto dalis', thWhen: 'Data',
  per: { '3m': '3 mėn.', ytd: 'Šie metai', '1y': '1 metai', '3y': '3 metai' }, total: 'Iš viso',
  gtNote: 'Pokytis = turtas paskutinę dieną atėmus turtą laikotarpio pradžioje (kiekvienam valdytojui – nuo jo paskutinės datos). Į jį įeina įmokos, išmokos ir investicijų grąža. Bendra suma rodoma tik tada, kai visų valdytojų duomenys apima visą laikotarpį.',
  byMgr: 'Pagal valdytoją', byFund: 'Pagal fondą', bySum: 'Suvestinė', est: '≈ ketv.', pu: 'Reikšmės', puPct: 'Turto dalis', puEur: 'mln. €',
  thQ: 'Ketvirtis', cum: 'Iš viso iki šiol', rankTip: 'Vieta tarp valdytojų tą ketvirtį (1 = neteko mažiausios turto dalies)',
  sumNote: 'Ketvirtis = ketvirtis, kurį dalyviai pateikė prašymus; lėšos išmokamos kito ketvirčio pradžioje. Reforma tęsis iki 2027 m. pabaigos, todėl iš viso bus 8 išmokėjimų ketvirčiai. Spalva: žalia = neteko mažiausios turto dalies, raudona = didžiausios (viena skalė visiems langeliams); mažas skaičius = vieta tarp valdytojų tą ketvirtį.',
  poNote: 'Išmokėjimas = dienos srautų suma (turto pokytis, kurio nepaaiškina vieneto vertė) tomis pirmųjų 20 ketvirčio dienų dienomis, kai valdytojas neteko daugiau nei 1 % turto. Dalis = išmokėta suma ÷ turtas prieš pat išmokėjimą, perskaičiuotas išmokėjimo dienos vieneto verte (taip tos dienos rinkos pokytis atimamas ir iš sumos, ir iš bazės). „≈ ketv.“: to ketvirčio kasdienių duomenų dar nėra, todėl suma įvertinta iš Lietuvos banko ketvirčio pabaigos ataskaitų (į ją įeina ir ketvirčio įprastos įmokos; grąža atimta pagal vieneto vertę).',
  xls: 'Excel', xlsTip: 'Atsisiųsti išmokėjimus Excel faile: lentelės pagal valdytoją ir fondą, visi kasdieniai duomenys ir formulės',
  xSheets: ['Pagal valdytoją', 'Pagal fondą', 'Skaičiavimai'],
  xCalcH: ['Ketvirtis (prašymai)', 'Valdytojas', 'Fondas', 'Pirma išmokėjimo diena (1 = taip)', 'Ankstesnė data', 'Vieneto vertė', 'Grynieji aktyvai, €', 'Išmokėjimo data', 'Vieneto vertė', 'Grynieji aktyvai, €', 'Bazė: ankstesnis turtas šios dienos vieneto verte, € = G×I/F', 'Srautas, € = J−K', 'Srauto dalis = L/K', 'Įvertis'],
  xTabH: ['Išmokėta, €', 'Bazė, €', 'Dalis'], xGroup: 'Grupė',
  xNote: 'Srautas = grynieji aktyvai − ankstesni grynieji aktyvai × (vieneto vertė ÷ ankstesnė vieneto vertė): turto pokyčio dalis, kurios nepaaiškina vieneto vertės (rinkos) pokytis. Išmokėta = srautų suma išmokėjimo dienomis; bazė = turtas prieš pat išmokėjimą, perskaičiuotas išmokėjimo dienos vieneto verte (pirmą išmokėjimo dieną); dalis = išmokėta ÷ bazė. „≈“: įvertis iš Lietuvos banko ketvirčio pabaigos duomenų.',
  quarter: q => appQ(q),
  foot: 'Šaltiniai: bendrovių skelbiami kasdieniai grynieji aktyvai (renkami automatiškai), Lietuvos banko ketvirtinės portfelių ataskaitos. Informacinė medžiaga, ne investavimo rekomendacija.',
});

const MGRS = ['ALLIANZ', 'ARTEA', 'GOINDEX', 'LUMINOR', 'SEB', 'SWEDBANK'];       // tvarka = spalvos --s1..--s6
const MLABEL = { ALLIANZ: 'Allianz', ARTEA: 'Artea', GOINDEX: 'Goindex', LUMINOR: 'Luminor', SEB: 'SEB', SWEDBANK: 'Swedbank' };
var DATA = { providers: MGRS.map(m => ({ id: m, label: MLABEL[m] })) };
const GROUPS2 = ['2003-2009', '1996-2002', '1989-1995', '1982-1988', '1975-1981', '1968-1974', '1961-1967', 'turto'];
const sw = m => `<span class="sw" style="background:${colorOf(m)}"></span>`;
const mEur = v => num(v, Math.abs(v) < 10 ? 2 : Math.abs(v) < 100 ? 1 : 0);
const signed = (v, f) => (v > 0 ? '+' : v < 0 ? '−' : '') + f(Math.abs(v));
const cls = v => v > 0 ? 'up' : v < 0 ? 'down' : '';
const grpLabel = (pl, g) => pl === 'III' ? T().cats[g] : g === 'turto' ? T().cpf : `${T().born} ${g.replace('-', '–')}`;

const PO_MGRS = ['SEB', 'SWEDBANK', 'ARTEA', 'ALLIANZ', 'LUMINOR', 'GOINDEX'];   // tvarka kaip savininko lentelėse
const ST = Object.assign({ pl: 'II', g: 'all', per: '1y', unit: 'eur', po: 'sum', pu: 'pct', off: [] },
  (() => { try { return JSON.parse(localStorage.getItem('aumstate')) || {}; } catch (e) { return {}; } })());
const save = () => { try { localStorage.setItem('aumstate', JSON.stringify(ST)); } catch (e) {} };

/* Fondo turtas dienai: paskutinis taškas iki dienos; po paskutinio taško – tik 7 d. (kad uždaryti fondai nebūtų skaičiuojami) */
function valueAt(f, day) {
  const i = lastOnOrBefore(f, day);
  if (i < 0 || (i === f.d.length - 1 && day - f.d[i] > 7)) return null;
  return f.a[i];
}
/* Kelių fondų suma: dienos – visų fondų dienų sąjunga */
function sumSeries(fs) {
  const days = [...new Set(fs.flatMap(f => f.d))].sort((a, b) => a - b), d = [], a = [];
  days.forEach(day => { let s = 0, any = false; fs.forEach(f => { const v = valueAt(f, day); if (v != null) { s += v; any = true; } }); if (any) { d.push(day); a.push(s); } });
  return { d, a };
}
const fundsOf = (pl, g, m) => AUM.funds.filter(f => f.pl === pl && (g === 'all' || f.g === g) && (!m || f.p === m));

/* ---------- valdikliai ---------- */
function seg(id, opts, cur) {
  return `<div class="seg" role="group" data-seg="${id}">` + opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${t}</button>`).join('') + '</div>';
}
function wire(root, handlers) {
  root.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => handlers[g.dataset.seg](b.dataset.v))));
}
const field = (label, html) => `<label class="field">${label} ${html}</label>`;
const PERIODS = ['3m', '6m', 'ytd', '1y', '3y', 'max'];
function periodStart(per, end, first) {
  if (per === 'max') return first;
  if (per === 'ytd') return Math.round(Date.UTC(new Date(end * DAY).getUTCFullYear() - 1, 11, 31) / DAY);
  return shiftMonths(end, { '3m': 3, '6m': 6, '1y': 12, '3y': 36 }[per]);
}

/* ---------- 1. grafikas ---------- */
let hc = null;
function renderChart() {
  const bar = document.getElementById('chBar');
  const groups = ST.pl === 'II' ? GROUPS2 : ['bond', 'mixed', 'equity'];
  if (ST.g !== 'all' && !groups.includes(ST.g)) ST.g = 'all';
  bar.innerHTML = field(T().pillar, seg('pl', [['II', 'II'], ['III', 'III']], ST.pl))
    + field(T().view, `<select id="chG"><option value="all">${T().vMgr}</option>${groups.map(g => `<option value="${g}"${g === ST.g ? ' selected' : ''}>${grpLabel(ST.pl, g)}</option>`).join('')}</select>`)
    + field(T().period, seg('per', PERIODS.map(p => [p, T().periods[p] || p]), ST.per))
    + field(T().show, seg('unit', [['eur', T().sEur], ['pct', T().sPct]], ST.unit));
  wire(bar, { pl: v => { ST.pl = v; save(); renderAllParts(); }, per: v => { ST.per = v; save(); renderChart(); }, unit: v => { ST.unit = v; save(); renderChart(); } });
  bar.querySelector('#chG').addEventListener('change', e => { ST.g = e.target.value; save(); renderAllParts(); });

  const raw = MGRS.map(m => { const fs = fundsOf(ST.pl, ST.g, m); return fs.length ? { m, fs, s: sumSeries(fs) } : null; }).filter(x => x && x.s.d.length > 1);
  const end = Math.max(...raw.map(r => r.s.d[r.s.d.length - 1])), first = Math.min(...raw.map(r => r.s.d[0]));
  const x0 = Math.max(first, periodStart(ST.per, end, first));
  const series = raw.map(r => {
    const i0 = Math.max(0, lastOnOrBefore(r.s, x0));
    const base = r.s.a[i0], pts = [];
    for (let i = i0; i < r.s.d.length; i++) {
      const day = Math.max(r.s.d[i], x0);
      pts.push([day, ST.unit === 'pct' ? (r.s.a[i] / base - 1) * 100 : r.s.a[i]]);
    }
    if (ST.unit === 'pct' && r.s.d[0] > x0) return null;     // pradėjo vėliau – procentinis pokytis neteisingas
    return { provider: r.m, points: pts };
  }).filter(Boolean);
  if (!Array.isArray(ST.off)) ST.off = [];
  const shown = series.filter(r => !ST.off.includes(r.provider));
  const fmt = ST.unit === 'pct' ? v => pct(v, 2) : v => mEur(v) + (lang === 'lt' ? ' mln. €' : ' m €');
  const el = document.getElementById('chart');
  const paint = mr => drawLineChart(el, shown.length ? shown : series, x0, end, { fmt, axisUnit: ST.unit === 'pct' ? '%' : '', mr });
  hc = hc || hoverCompress(el, mr => renderChart.paint(mr));
  renderChart.paint = paint; paint(hc.mr);
  document.getElementById('chMeta').textContent = T().chMeta(ST.unit);
  // legenda = mygtukai: paspaudus linija paslepiama / parodoma, dukart paspaudus – rodoma tik ji
  const lg = document.getElementById('chLegend');
  lg.innerHTML = series.map(r => `<button type="button" class="chip" data-m="${r.provider}" aria-pressed="${!ST.off.includes(r.provider)}" title="${T().lgTip}"><i style="background:${colorOf(r.provider)}"></i>${MLABEL[r.provider]} <b>${fmt(r.points[r.points.length - 1][1])}</b></button>`).join('')
    + (ST.off.length ? `<button type="button" class="chip" data-m="*">${T().lgAll}</button>` : '');
  let clickT = null;
  lg.onclick = e => {
    const b = e.target.closest('.chip'); if (!b) return;
    const m = b.dataset.m;
    clearTimeout(clickT);
    clickT = setTimeout(() => {
      if (m === '*') ST.off = [];
      else if (ST.off.includes(m)) ST.off = ST.off.filter(x => x !== m);
      else if (series.filter(r => !ST.off.includes(r.provider)).length > 1) ST.off = [...ST.off, m];
      save(); renderChart();
    }, 220);
  };
  lg.ondblclick = e => {
    const b = e.target.closest('.chip'); if (!b || b.dataset.m === '*') return;
    clearTimeout(clickT);
    ST.off = MGRS.filter(x => x !== b.dataset.m); save(); renderChart();
  };
  const qOnly = [...new Set(fundsOf(ST.pl, ST.g).filter(f => f.q > 0 && f.d[f.q - 1] >= x0).map(f => `${MLABEL[f.p]} ${lang === 'lt' ? 'iki' : 'until'} ${iso(f.d[f.q - 1])}`))];
  document.getElementById('chNote').textContent = T().chNote(qOnly.join(', '));
}

/* ---------- 2. turto pokyčio lentelė ---------- */
function renderGrowth() {
  const pers = ['3m', 'ytd', '1y', '3y'];
  const rows = MGRS.map(m => { const fs = fundsOf(ST.pl, ST.g, m); return fs.length ? { m, s: sumSeries(fs) } : null; }).filter(x => x && x.s.d.length);
  // eilutės reikšmės: [turtas dabar, data, {laikotarpis: turtas pradžioje}]; „Iš viso“ = valdytojų sumos
  const calc = sr => {
    const n = sr.d.length - 1, end = sr.d[n], base = {};
    pers.forEach(p => { const a = periodStart(p, end, sr.d[0]), i = lastOnOrBefore(sr, a); base[p] = i < 0 || sr.d[0] > a ? null : sr.a[i]; });
    return { v: sr.a[n], end, base };
  };
  const vals = rows.map(r => calc(r.s));
  const tot = { v: vals.reduce((x, c) => x + c.v, 0), end: null, base: {} };
  pers.forEach(p => { tot.base[p] = vals.some(c => c.base[p] == null) ? null : vals.reduce((x, c) => x + c.base[p], 0); });
  const line = (label, c, isTot) => `<tr class="${isTot ? 'tot' : ''}"><td class="l">${label}</td><td>${mEur(c.v)}</td><td class="pfsub">${c.end == null ? '' : iso(c.end)}</td>` + pers.map(p => {
    const b = c.base[p], v = c.v;
    if (b == null) return '<td class="bl">–</td><td>–</td>';
    return `<td class="bl ${cls(v - b)}">${signed(v - b, mEur)}</td><td class="${cls(v - b)}">${signed((v / b - 1) * 100, x => num(x, 2))}${pctSfx()}</td>`;
  }).join('') + '</tr>';
  document.getElementById('gtTitle').textContent = `${T().gtTitle} · ${ST.pl === 'II' ? 'II' : 'III'} ${lang === 'lt' ? 'pakopa' : 'pillar'}${ST.g === 'all' ? '' : ' · ' + grpLabel(ST.pl, ST.g)}`;
  document.getElementById('gtTable').innerHTML = `<thead><tr><th class="l" rowspan="2">${T().thMgr}</th><th rowspan="2">${T().thAum}</th><th rowspan="2">${T().thDate}</th>${pers.map(p => `<th class="grp bl" colspan="2">${T().per[p]}</th>`).join('')}</tr>
    <tr>${pers.map(() => `<th class="bl">${lang === 'lt' ? 'mln. €' : '€ m'}</th><th>%</th>`).join('')}</tr></thead><tbody>`
    + rows.map((r, i) => line(sw(r.m) + MLABEL[r.m], vals[i])).join('') + (rows.length > 1 ? line(T().total, tot, true) : '') + '</tbody>';
  document.getElementById('gtNote').textContent = T().gtNote;
}

/* ---------- 2b. turtas ketvirčių pabaigose pagal fondą ---------- */
function renderQuarters() {
  const fs = fundsOf(ST.pl, ST.g).slice();
  const gOrder = ST.pl === 'II' ? GROUPS2.slice().reverse() : ['bond', 'mixed', 'equity'];
  fs.sort((a, b) => gOrder.indexOf(a.g) - gOrder.indexOf(b.g) || PO_MGRS.indexOf(a.p) - PO_MGRS.indexOf(b.p));
  const last = Math.max(...fs.map(f => f.d[f.d.length - 1]));
  const ends = []; const e = new Date(last * DAY);
  for (let y = e.getUTCFullYear(), q = Math.floor(e.getUTCMonth() / 3) - 1; ends.length < 8; q--) {   // paskutiniai 8 pilni ketvirčiai
    if (q < 0) { q = 3; y--; }
    ends.unshift({ d: Math.round(Date.UTC(y, (q + 1) * 3, 0) / DAY), lbl: `${y} Q${q + 1}` });
  }
  const cols = ends.concat([{ d: last, lbl: iso(last), now: true }]);
  const cell = (v, prev) => v == null ? '<td class="bl">–</td>'
    : `<td class="bl">${mEur(v)}${prev ? `<div class="pfsub ${cls(v - prev)}">${signed((v / prev - 1) * 100, x => num(x, 2))}${pctSfx()}</div>` : ''}</td>`;
  const row = (label, vals, isTot) => `<tr class="${isTot ? 'tot' : ''}"><td class="l">${label}</td>${vals.map((v, i) => cell(v, i ? vals[i - 1] : null)).join('')}</tr>`;
  const valsOf = f => cols.map(c => valueAt(f, c.d));
  let body = '', curG = null;
  const all = fs.map(f => ({ f, v: valsOf(f) }));
  all.forEach(({ f, v }) => {
    if (ST.g === 'all' && f.g !== curG) { curG = f.g; body += `<tr class="sep"><td class="l" colspan="${cols.length + 1}">${grpLabel(ST.pl, f.g)}</td></tr>`; }
    body += row(sw(f.p) + MLABEL[f.p], v);
  });
  const tot = cols.map((_, i) => { const xs = all.map(r => r.v[i]); return xs.some(x => x == null) ? null : xs.reduce((s, x) => s + x, 0); });
  document.getElementById('qtTitle').textContent = `${T().qtTitle} · ${ST.pl === 'II' ? 'II' : 'III'} ${lang === 'lt' ? 'pakopa' : 'pillar'}${ST.g === 'all' ? '' : ' · ' + grpLabel(ST.pl, ST.g)}`;
  document.getElementById('qtTable').innerHTML = `<thead><tr><th class="l">${T().thFund}</th>${cols.map(c => `<th class="bl">${c.now ? T().qtNow + '<br>' + c.lbl : c.lbl}</th>`).join('')}</tr></thead><tbody>`
    + body + (all.length > 1 ? row(T().total, tot, true) : '') + '</tbody>';
  document.getElementById('qtNote').textContent = T().qtNote;
}

/* ---------- 3. išmokėjimai ---------- */
function payHeat(v, lo, hi) {        // žalia (mažiausia dalis) -> geltona -> raudona (didžiausia)
  const t = hi > lo ? (v - lo) / (hi - lo) : 0.5;
  return `hsl(${Math.round(125 * (1 - t))},70%,${t < 0.5 ? 78 - 10 * t : 73 - 8 * (t - 0.5)}%)`;
}
function renderPaySummary() {
  const ev = (m, q) => AUM.payouts.find(e => e.p === m && e.q === q);
  const shares = AUM.payouts.map(e => -e.flow / e.base * 100), lo = Math.min(...shares), hi = Math.max(...shares);
  const pctMode = ST.pu === 'pct';
  const rows = PAY_QS.map(q => {
    const es = PO_MGRS.map(m => ev(m, q));
    const rank = es.map(e => e ? 1 + es.filter(o => o && -o.flow / o.base < -e.flow / e.base).length : null);
    const tf = es.reduce((a, e) => a + (e ? e.flow : 0), 0), tb = es.reduce((a, e) => a + (e ? e.base : 0), 0);
    const cells = es.map((e, i) => {
      if (!e) return '<td class="bl empty"></td>';
      const sh = -e.flow / e.base * 100, est = e.est ? `<span class="est"> ≈</span>` : '';
      return pctMode
        ? `<td class="bl heat" style="background:${payHeat(sh, lo, hi)}">${num(sh, 2)}${pctSfx()}${est} <sup title="${T().rankTip}">${rank[i]}</sup></td>`
        : `<td class="bl">${mEur(-e.flow)}${est}</td>`;
    }).join('');
    const tot = es.some(Boolean) ? (pctMode ? `${num(-tf / tb * 100, 2)}${pctSfx()}` : mEur(-tf)) : '';
    return `<tr><td class="l">${appQ(q)}</td>${cells}<td class="bl tt">${tot}</td></tr>`;
  }).join('');
  const cum = PO_MGRS.map(m => AUM.payouts.filter(e => e.p === m).reduce((a, e) => a - e.flow, 0));
  const foot = `<tr class="tot"><td class="l">${T().cum}, ${T().puEur}</td>${cum.map(v => `<td class="bl">${mEur(v)}</td>`).join('')}<td class="bl">${mEur(cum.reduce((a, b) => a + b, 0))}</td></tr>`;
  document.getElementById('poTable').innerHTML = `<thead><tr><th class="l">${T().thQ}</th>${PO_MGRS.map(m => `<th class="bl">${sw(m)}${MLABEL[m]}</th>`).join('')}<th class="bl">${T().total}</th></tr></thead><tbody>${rows}${foot}</tbody>`;
  document.getElementById('poNote').textContent = T().sumNote + ' ' + T().poNote;
}

function renderPayouts() {
  const bar = document.getElementById('poBar');
  bar.innerHTML = seg('po', [['sum', T().bySum], ['mgr', T().byMgr], ['fund', T().byFund]], ST.po)
    + (ST.po === 'sum' ? field(T().pu, seg('pu', [['pct', T().puPct], ['eur', T().puEur]], ST.pu)) : '')
    + `<button type="button" class="btn xls" id="poXls" title="${T().xlsTip}">⤓ ${T().xls}</button>`;
  wire(bar, { po: v => { ST.po = v; save(); renderPayouts(); }, pu: v => { ST.pu = v; save(); renderPayouts(); } });
  bar.querySelector('#poXls').addEventListener('click', () => payXls().catch(err => alert('Excel: ' + err)));
  if (ST.po === 'sum') return renderPaySummary();
  const qs = [...new Set(AUM.payouts.map(e => e.q))].sort();
  const ev = (m, q) => AUM.payouts.find(e => e.p === m && e.q === q);
  const dates = e => e.est ? `<span class="est">${T().est}</span>` : e.dates.map(d => d.slice(5).replace('-', '.')).join(', ');
  const cells = (e, flow, base) => e && base ? `<td class="bl pfsub">${dates(e)}</td><td class="down">${signed(flow, mEur)}</td><td class="down">${signed(flow / base * 100, x => num(x, 2))}${pctSfx()}</td>` : '<td class="bl">–</td><td>–</td><td>–</td>';
  let body = '';
  if (ST.po === 'mgr') {
    body = PO_MGRS.map(m => `<tr><td class="l">${sw(m)}${MLABEL[m]}</td>${qs.map(q => { const e = ev(m, q); return cells(e, e && e.flow, e && e.base); }).join('')}</tr>`).join('')
      + `<tr class="tot"><td class="l">${T().total}</td>${qs.map(q => { const es = AUM.payouts.filter(e => e.q === q), f = es.reduce((a, e) => a + e.flow, 0), b = es.reduce((a, e) => a + e.base, 0); return `<td class="bl"></td><td class="down">${signed(f, mEur)}</td><td class="down">${signed(f / b * 100, x => num(x, 2))}${pctSfx()}</td>`; }).join('')}</tr>`;
  } else {
    GROUPS2.forEach(g => {
      body += `<tr class="sep"><td colspan="${1 + qs.length * 3}">${grpLabel('II', g)}</td></tr>`;
      PO_MGRS.forEach(m => {
        const name = qs.map(q => ev(m, q)).filter(Boolean).flatMap(e => Object.keys(e.funds)).find(n => fundsOf('II', g, m).some(f => f.n === n));
        if (!name) return;
        body += `<tr><td class="l">${sw(m)}${MLABEL[m]}</td>${qs.map(q => { const e = ev(m, q), x = e && e.funds[name]; return cells(x && e, x && x[0], x && x[1]); }).join('')}</tr>`;
      });
    });
  }
  document.getElementById('poTable').innerHTML = `<thead><tr><th class="l" rowspan="2">${ST.po === 'mgr' ? T().thMgr : T().thFund}</th>${qs.map(q => `<th class="grp bl" colspan="3">${T().quarter(q)}</th>`).join('')}</tr>
    <tr>${qs.map(() => `<th class="bl">${T().thWhen}</th><th>${T().thPaid}</th><th>${T().thShare}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
  document.getElementById('poNote').textContent = T().sumNote.split('. ')[0] + '. ' + T().poNote;
}

/* ---------- išmokėjimų Excel: langeliai – formulės, kad būtų galima patikrinti ---------- */
function loadXlsx() { return new Promise((ok, no) => { if (window.XLSX) return ok(); const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
const xDate = d => ({ t: 'n', v: Date.parse(d + 'T00:00:00Z') / 864e5 + 25569, z: 'yyyy-mm-dd' });
function payBook() {
  const S = T(), [shM, shF, shC] = S.xSheets, C = `'${shC}'`, EUR = '#,##0', P = '0.00%';
  const evs = AUM.payouts.slice().sort((a, b) => a.q < b.q ? -1 : a.q > b.q ? 1 : PO_MGRS.indexOf(a.p) - PO_MGRS.indexOf(b.p));
  const calc = [S.xCalcH];
  evs.forEach(e => Object.entries(e.rows || {}).forEach(([fund, rows]) => rows.forEach(([d0, u0, a0, d1, u1, a1], k) => {
    const n = calc.length + 1, base = a0 * u1 / u0, fl = a1 - base;
    calc.push([appQ(e.q), MLABEL[e.p], fund, k ? 0 : 1, xDate(d0), u0, { t: 'n', v: a0, z: EUR }, xDate(d1), u1, { t: 'n', v: a1, z: EUR },
      { t: 'n', v: base, f: `G${n}*I${n}/F${n}`, z: EUR }, { t: 'n', v: fl, f: `J${n}-K${n}`, z: EUR }, { t: 'n', v: fl / base, f: `L${n}/K${n}`, z: P }, e.est ? '≈' : null]);
  })));
  const N = calc.length, rng = c => `${C}!$${c}$2:$${c}$${N}`;
  calc.push([], [S.xNote]);
  const qs = [...new Set(evs.map(e => e.q))];
  const head = first => [[...first, ...qs.flatMap(q => [appQ(q), null, null])], [...first.map(() => null), ...qs.flatMap(() => S.xTabH)]];
  // vienas ketvirčio blokas: išmokėta, bazė, dalis (formulės SUMIFS iš „Skaičiavimai“)
  const block = (q, crit, paid, base, r) => {
    const cond = `${rng('A')},"${appQ(q)}"${crit}`;
    const L = c => XLSX.utils.encode_col(c);
    return [{ t: 'n', v: -paid, f: `-SUMIFS(${rng('L')},${cond})`, z: EUR }, { t: 'n', v: base, f: `SUMIFS(${rng('K')},${cond},${rng('D')},1)`, z: EUR },
      base ? { t: 'n', v: -paid / base, f: `${L(r.c)}${r.n}/${L(r.c + 1)}${r.n}`, z: P } : null];
  };
  const sumOf = (es, pick) => es.reduce((a, e) => { const v = pick(e); return v ? [a[0] + v[0], a[1] + v[1]] : a; }, [0, 0]);
  const mgrRows = head([S.thMgr]);
  [...PO_MGRS, null].forEach(m => {
    const n = mgrRows.length + 1, row = [m ? MLABEL[m] : S.total];
    qs.forEach(q => {
      const es = evs.filter(e => e.q === q && (!m || e.p === m));
      const [fl, b] = sumOf(es, e => [e.rows ? Object.values(e.rows).flat().reduce((a, r) => a + r[5] - r[2] * r[4] / r[1], 0) : 0, Object.values(e.rows || {}).reduce((a, r) => a + r[0][2] * r[0][4] / r[0][1], 0)]);
      row.push(...(es.length ? block(q, m ? `,${rng('B')},"${MLABEL[m]}"` : '', fl, b, { c: row.length, n }) : [null, null, null]));
    });
    mgrRows.push(row);
  });
  const fundRows = head([S.xGroup, S.thMgr, S.thFund]);
  GROUPS2.forEach(g => PO_MGRS.forEach(m => {
    const names = [...new Set(evs.filter(e => e.p === m).flatMap(e => Object.keys(e.rows || {})))].filter(nm => fundsOf('II', g, m).some(f => f.n === nm));
    names.forEach(nm => {
      const n = fundRows.length + 1, row = [grpLabel('II', g), MLABEL[m], nm];
      qs.forEach(q => {
        const e = evs.find(x => x.q === q && x.p === m), r = e && e.rows && e.rows[nm];
        row.push(...(r ? block(q, `,${rng('C')},"${nm.replace(/"/g, '""')}"`, r.reduce((a, x) => a + x[5] - x[2] * x[4] / x[1], 0), r[0][2] * r[0][4] / r[0][1], { c: row.length, n }) : [null, null, null]));
      });
      fundRows.push(row);
    });
  }));
  const wb = XLSX.utils.book_new(), add = (rows, name, cols) => { const ws = XLSX.utils.aoa_to_sheet(rows); ws['!cols'] = cols; XLSX.utils.book_append_sheet(wb, ws, name); };
  add(mgrRows, shM, [{ wch: 14 }, ...Array(qs.length * 3).fill({ wch: 15 })]);
  add(fundRows, shF, [{ wch: 26 }, { wch: 11 }, { wch: 36 }, ...Array(qs.length * 3).fill({ wch: 15 })]);
  add(calc, shC, [{ wch: 11 }, { wch: 10 }, { wch: 36 }, { wch: 10 }, { wch: 11 }, { wch: 10 }, { wch: 15 }, { wch: 11 }, { wch: 10 }, { wch: 15 }, { wch: 17 }, { wch: 15 }, { wch: 10 }, { wch: 7 }]);
  return wb;
}
async function payXls() { await loadXlsx(); XLSX.writeFile(payBook(), `${lang === 'lt' ? 'Ismokejimai' : 'Payouts'}_${String(AUM.generated).slice(0, 10)}.xlsx`); }

function renderAllParts() {
  document.getElementById('sub').textContent = `${T().navAum} · ${T().updated} ${AUM.generated}`;
  ['chTitle', 'chLead', 'poTitle', 'poLead', 'foot'].forEach(id => { document.getElementById(id).textContent = T()[id]; });
  renderChart(); renderGrowth(); renderQuarters(); renderPayouts();
}
renderHeader('aum', renderAllParts);
renderAllParts();
let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => renderChart.paint && renderChart.paint(hc.mr), 120); });
