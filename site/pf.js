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
  fund: 'Fund', kTotal: 'Portfolio value', kPos: 'Positions', kTop10: 'Top 10 positions', kNew: 'New / sold out',
  showExits: 'Sold-out positions are listed at the bottom.',
  fcNote: 'Weight = position value ÷ sum of all positions (≈ net assets). Change in units shows buying or selling; a change in weight can also come from price moves. Fund names in the reports are sometimes given only as the management company – then the ISIN code identifies the fund.',
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
  fund: 'Fondas', kTotal: 'Portfelio vertė', kPos: 'Pozicijų', kTop10: '10 didžiausių pozicijų', kNew: 'Naujos / parduotos',
  showExits: 'Visiškai parduotos pozicijos – lentelės apačioje.',
  fcNote: 'Svoris = pozicijos vertė ÷ visų pozicijų suma (≈ grynieji aktyvai). Vienetų pokytis rodo pirkimą ar pardavimą; svoris gali keistis ir dėl kainų. Ataskaitose fondų pavadinimai kartais nurodomi tik kaip valdymo bendrovė – tada fondą atpažinti padeda ISIN kodas.',
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
const S = PF.secs.map(s => ({ name: s[0], t: s[1], cty: s[2], cur: s[3], kis: s[4], isin: s[5], co: s[6] }));
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
const posLabel = s => s.co && s.isin ? `${s.name} · ${s.isin}` : s.name;
const typeLabel = s => { const l = s.t === 'f' && s.kis ? (T().kis[s.kis] || T().types.f) : T().types[s.t]; return l[0].toUpperCase() + l.slice(1); };
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
      <td class="nm">${esc(posLabel(r.s))}<br><small>${typeLabel(r.s)} · ${r.s.cty || '–'}${r.s.isin && !r.s.co ? ' · ' + r.s.isin : ''}</small></td>
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
const TYPE_COL = { e: 'var(--s1)', f3: 'var(--s4)', f: 'var(--s3)', b: 'var(--s2)', c: 'var(--s5)', d: 'var(--s6)' };
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
    + field(T().assetType, `<select id="fcType">${['all', 'e', 'b', 'f', 'c', 'd'].map(t => `<option value="${t}"${t === ST.ft ? ' selected' : ''}>${t === 'all' ? T().all : T().types[t]}</option>`).join('')}</select>`);
  bar.querySelector('#fcFund').addEventListener('change', e => { ST.fund = e.target.value; ST.fq = fundBy[ST.fund].q[ST.fq] ? ST.fq : fundBy[ST.fund].last; ST.pos = null; fcLimit = 40; save(); renderFund(); });
  bar.querySelector('#fcQ').addEventListener('change', e => { ST.fq = +e.target.value; fcLimit = 40; save(); renderFund(); });
  bar.querySelector('#fcType').addEventListener('change', e => { ST.ft = e.target.value; fcLimit = 40; save(); renderFund(); });

  const { rows, exits } = fundRows(f, ST.fq);
  const tot = f.tot[ST.fq], byW = rows.slice().sort((a, b) => b.w - a.w);
  const nNew = rows.filter(r => r.act === 'new').length;
  document.getElementById('fcKpis').innerHTML = [
    [T().kTotal, eur(tot)], [T().kPos, rows.length], [T().kTop10, wFmt(byW.slice(0, 10).reduce((a, r) => a + r.w, 0), 1)],
    [T().kNew, ST.fq > first ? `${nNew} / ${exits.length}` : '–'],
  ].map(([l, v]) => `<div class="kpi"><span>${l}</span><b>${v}</b></div>`).join('');
  // sudėtis pagal turto tipą (akcijų fondai atskirai nuo kitų fondų)
  const comp = {}; rows.forEach(r => { const k = r.s.t === 'f' && r.s.kis === '3' ? 'f3' : r.s.t; comp[k] = (comp[k] || 0) + r.w; });
  const compLbl = k => k === 'f3' ? T().kis[3] : k === 'f' ? (lang === 'lt' ? 'kiti fondai' : 'other funds') : T().types[k];
  const keys = ['e', 'f3', 'f', 'b', 'c', 'd'].filter(k => comp[k]);
  document.getElementById('fcComp').innerHTML = `<div class="comp">${keys.filter(k => comp[k] > 0).map(k => `<span style="width:${comp[k]}%;background:${TYPE_COL[k]}" title="${compLbl(k)} ${wFmt(comp[k], 1)}"></span>`).join('')}</div>
    <div class="complg">${keys.map(k => `<span><i style="background:${TYPE_COL[k]}"></i>${compLbl(k)} <b>${wFmt(comp[k], 1)}</b></span>`).join('')}</div>`;

  const all = byW.concat(exits.sort((a, b) => a.dw - b.dw)).filter(r => ST.ft === 'all' || r.s.t === ST.ft);
  const selAt = all.findIndex(r => r.si === ST.pos);
  if (selAt >= fcLimit) fcLimit = selAt + 1;                 // pasirinkta pozicija visada matoma
  const list = all.slice(0, fcLimit);
  const tb = document.getElementById('fcTable');
  tb.innerHTML = `<thead><tr><th class="l">#</th><th class="l">${T().thPos}</th>
    <th>${T().thValue}</th><th>${T().thW}</th><th>${T().thDw}</th><th>${T().thDq}</th><th class="l">${T().thAct}</th></tr></thead><tbody>`
    + list.map((r, i) => `<tr data-si="${r.si}" class="${r.exit ? 'exit' : ''}${r.si === ST.pos ? ' sel' : ''}"><td class="l pfsub">${r.exit ? '' : i + 1}</td>
      <td class="nm">${esc(posLabel(r.s))}<br><small>${typeLabel(r.s)} · ${r.s.cty || '–'}${r.s.isin && !r.s.co ? ' · ' + r.s.isin : ''}</small></td>
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
  document.getElementById('phMeta').textContent = s ? `${typeLabel(s)} · ${s.cty || '–'}${s.isin ? ' · ' + s.isin : ''} — ${T().phMeta}` : '';
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

function renderAll() {
  document.getElementById('sub').textContent = `${T().navPortfolios} · ${lang === 'lt' ? 'LB ataskaitos' : 'Bank of Lithuania reports'} ${qLabel(0)} – ${qLabel(NQ - 1)}`;
  ['tcTitle', 'tcLead', 'fcTitle', 'fcLead', 'foot'].forEach(id => { document.getElementById(id).textContent = T()[id]; });
  renderTopChanges(); renderFund();
}
renderHeader('portfolios', renderAll);
renderAll();
let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => renderPosition.paint && renderPosition.paint(), 120); });
