/* III pakopos polapis: kategorijų kortelės (reitingas + grafikas pasirinktu laikotarpiu) ir visų fondų rodiklių lentelė. */
addStrings({
  cat: { bond: 'Bond funds', mixed: 'Mixed funds', equity: 'Equity funds' },
  thFund: 'Fund', thCat: 'Type', thSince: 'Since', thYtd: 'YTD', th1y: '1 yr', th3y: '3 yr p.a.', th5y: '5 yr p.a.', th10y: '10 yr p.a.',
  thIncep: 'Since start p.a.', thVol: 'Volatility 3 yr', thDd: 'Max drawdown', thRisky: 'Equities', thUnitDate: 'Unit value',
  kFunds: 'Funds tracked', kProviders: 'Providers', kAssets: 'Net assets (known), € m', kHistory: 'History from', kUntil: 'Data until',
  allTitle: 'All Pillar III funds – key figures', rddTitle: 'Run-up and drawdown',
  stLbl: 'Start', stPeriod: p => `Period above (${p})`, stCommon: 'Since common inception', stFund: n => `Since ${n} start`, eventsBtn: 'Market events', p10y: '10 yr',
  hmRet: 'Return over the period, %', hmRank: 'Rank within the group (1 = best return)',
  hmCap: e => `Periods end ${e}. Colours show the rank within each row (green = best, red = worst). “–” = the fund did not exist at the period start. Hover a cell for dates and unit values. Fund buttons above choose which funds are compared.`,
  allNote: 'p.a. = average annual return (geometric), calculated from unit values like the Bank of Lithuania does. Volatility = annualised standard deviation of monthly returns over the last 3 years. Max drawdown = largest fall from a previous peak since the fund started. Equities = maximum share of risky assets per the Bank of Lithuania (30 Jun 2026). Click a column header to sort. Bold = best in its category.',
  foot: 'Pillar III (voluntary) pension funds. Unit value histories from the providers (full history from each fund\'s start where available); returns do not include contribution fees. For information only, not investment advice.',
}, {
  cat: { bond: 'Obligacijų fondai', mixed: 'Mišraus investavimo fondai', equity: 'Akcijų fondai' },
  thFund: 'Fondas', thCat: 'Tipas', thSince: 'Nuo', thYtd: 'Šie metai', th1y: '1 metai', th3y: '3 metai, metinė', th5y: '5 metai, metinė', th10y: '10 metų, metinė',
  thIncep: 'Nuo pradžios vid.', thVol: 'Svyravimas (3 metai)', thDd: 'Didžiausias kritimas', thRisky: 'Akcijos', thUnitDate: 'Vieneto vertė',
  kFunds: 'Fondų', kProviders: 'Bendrovių', kAssets: 'Grynieji aktyvai (žinomi), mln. €', kHistory: 'Istorija nuo', kUntil: 'Duomenys iki',
  allTitle: 'Visi III pakopos fondai – pagrindiniai rodikliai', rddTitle: 'Kilimas ir kritimas',
  stLbl: 'Pradžia', stPeriod: p => `Pagal laikotarpį viršuje (${p})`, stCommon: 'Nuo bendros pradžios', stFund: n => `Nuo ${n} pradžios`, eventsBtn: 'Rinkų įvykiai', p10y: '10 metų',
  hmRet: 'Grąža laikotarpyje, %', hmRank: 'Vieta grupėje (1 = geriausia grąža)',
  hmCap: e => `Laikotarpiai baigiasi ${e}. Spalvos rodo vietą kiekvienoje eilutėje (žalia – geriausia, raudona – prasčiausia). „–“ = laikotarpio pradžioje fondo dar nebuvo. Užvedus pelę ant langelio matyti datos ir vieneto vertės. Fondų mygtukais aukščiau pasirenkama, kuriuos fondus lyginti.`,
  allNote: 'vid. = vidutinė metinė grąža (geometrinė), skaičiuojama iš vieneto verčių kaip Lietuvos banko ataskaitose. Svyravimas = mėnesinių grąžų standartinis nuokrypis per 3 metus, perskaičiuotas į metinį. Didžiausias kritimas = didžiausias vertės kritimas nuo ankstesnės viršūnės nuo fondo pradžios. Akcijos = didžiausia rizikingų aktyvų dalis pagal Lietuvos banką (2026-06-30). Paspaudus stulpelio pavadinimą lentelė rikiuojama. Paryškinta = geriausias savo kategorijoje.',
  foot: 'III pakopos (savanoriškieji) pensijų fondai. Vieneto verčių istorija iš bendrovių (kur įmanoma – nuo fondo pradžios); grąža neįvertina atskaitymų nuo įmokų. Informacinė medžiaga, ne investavimo rekomendacija.',
});

/* Dienų skirtumai → dienos */
DATA.groups.forEach(g => g.funds.forEach(f => { const d = [f.d0]; f.dd.forEach(x => d.push(d[d.length - 1] + x)); f.d = d; }));
const ALL = DATA.groups.flatMap(g => g.funds.map(f => ({ ...f, cat: g.id })));

/* Spalvos: bendrovės prekės ženklo atspalviai (kiekvienam fondui savas) */
const BRAND = { ARTEA: [230, 55, 40], GOINDEX: [178, 80, 38], LUMINOR: [276, 52, 52], SEB: [104, 70, 34], SWEDBANK: [22, 100, 54] };
const SHADE = [0, 14, -10, 24, -18, 7];
(() => {
  const seen = {};
  DATA.providers.forEach((p, i) => {
    const [h, s, l] = BRAND[p.brand]; const k = seen[p.brand] = (seen[p.brand] ?? -1) + 1;
    document.documentElement.style.setProperty(`--s${i + 1}`, `hsl(${h} ${s}% ${Math.max(22, Math.min(74, l + SHADE[k % SHADE.length]))}%)`);
  });
})();

const LATEST = Math.max(...ALL.map(f => f.d[f.d.length - 1]));
const EARLIEST = Math.min(...ALL.map(f => f.d[0]));
const CAL_OPTS = calOptions(LATEST, EARLIEST);
let period = 'ytd';
try { const s = localStorage.getItem('p3period'); if (PRESET_IDS.includes(s) || isCalPeriod(s)) period = s; } catch (e) {}

/* ---------- rodikliai ---------- */
function valueAt(f, day) { const i = lastOnOrBefore(f, day); return i >= 0 ? f.v[i] : null; }
function annual(f, end, years) {
  const start = shiftMonths(end, years * 12);
  if (f.d[0] > start + 7) return null;
  const a = valueAt(f, start), b = valueAt(f, end);
  return a && b ? (Math.pow(b / a, 1 / years) - 1) * 100 : null;
}
function metrics(f) {
  const end = f.d[f.d.length - 1], last = f.v[f.v.length - 1];
  const e = new Date(end * DAY), ytdA = Math.round(Date.UTC(e.getUTCFullYear() - 1, 11, 31) / DAY);
  const yv = f.d[0] <= ytdA ? valueAt(f, ytdA) : null;
  const yrs = (end - f.d[0]) / 365.25;
  const incep = yrs >= 1 ? (Math.pow(last / f.v[0], 1 / yrs) - 1) * 100 : null;
  const r1 = f.d[0] <= shiftMonths(end, 12) + 7 ? (last / valueAt(f, shiftMonths(end, 12)) - 1) * 100 : null;
  // svyravimas: mėnesio pabaigos vertės per 36 mėn.
  let vol = null;
  if (f.d[0] <= shiftMonths(end, 36) + 7) {
    const m = []; for (let k = 36; k >= 0; k--) m.push(valueAt(f, shiftMonths(end, k)));
    const rs = m.slice(1).map((v, i) => v / m[i] - 1), mu = rs.reduce((a, b) => a + b, 0) / rs.length;
    vol = Math.sqrt(rs.reduce((a, b) => a + (b - mu) ** 2, 0) / (rs.length - 1)) * Math.sqrt(12) * 100;
  }
  let peak = 0, dd = 0; f.v.forEach(v => { peak = Math.max(peak, v); dd = Math.min(dd, v / peak - 1); });
  return { end, last, ytd: yv ? (last / yv - 1) * 100 : null, r1, r3: annual(f, end, 3), r5: annual(f, end, 5), r10: annual(f, end, 10), incep, vol, dd: dd * 100, yrs };
}

/* ---------- KPI ---------- */
function renderKpis() {
  const assets = ALL.reduce((s, f) => s + (f.assets && f.assetsDate >= LATEST - 10 ? f.assets : 0), 0);
  const items = [[T().kFunds, ALL.length], [T().kProviders, new Set(ALL.map(f => f.brand)).size],
    [T().kAssets, assets ? num(assets / 1e6, 1) : '–'], [T().kHistory, iso(EARLIEST)], [T().kUntil, iso(LATEST)]];
  document.getElementById('kpis').innerHTML = items.map(([k, v]) => `<div class="kpi"><span>${k}</span><b>${v}</b></div>`).join('');
}

/* ---------- kategorijų kortelės ----------
   Kiekviena kortelė: pradžios pasirinkimas (pagal laikotarpį viršuje / nuo bendros pradžios / nuo konkretaus fondo pradžios),
   fondų jungikliai, rinkų įvykiai, reitingas + grafikas, o po jais – dvi heatmap lentelės (grąža ir vieta) pagal laikotarpius. */
const CS = {};                                   // kortelių būsena pagal kategoriją: { provs: Set, start, events, pin }
DATA.groups.forEach(g => { CS[g.id] = { provs: new Set(g.funds.map(f => f.provider)), start: 'period', events: false, pin: null }; });
try {
  const s = JSON.parse(localStorage.getItem('p3cards'));
  if (s) DATA.groups.forEach(g => {
    const o = s[g.id]; if (!o) return; const ids = g.funds.map(f => f.provider);
    if (Array.isArray(o.provs)) { const v = o.provs.filter(x => ids.includes(x)); if (v.length) CS[g.id].provs = new Set(v); }
    if (o.start === 'period' || o.start === 'common' || ids.includes(o.start)) CS[g.id].start = o.start;
    if (typeof o.events === 'boolean') CS[g.id].events = o.events;
  });
} catch (e) {}
function saveCards() { try { const o = {}; Object.keys(CS).forEach(k => { o[k] = { provs: [...CS[k].provs], start: CS[k].start, events: CS[k].events }; }); localStorage.setItem('p3cards', JSON.stringify(o)); } catch (e) {} }

const shortName = l => l.replace('Pensijos fondas ', '').replace(' (apriboto nutraukimo)', ' (apr.)').replace('pensija ', '').replace('Luminor ateitis ', 'Luminor ').replace('Ambicingas ', 'Amb. ');
const HM_PERIODS = ['1m', '3m', '6m', 'ytd', '1y', '3y', '5y', '10y'];
const ALL_EVENTS = () => EVENTS.map(e => ({ day: dayOf(e.day), title: e[lang].t, text: e[lang].d, src: e.src })).sort((a, b) => a.day - b.day).map((e, i) => ({ ...e, n: i + 1 }));

function cardRange(g, st, sel) {                  // grafiko ir reitingo langas
  const { end, overallLast } = groupEnd(g);
  if (st.start === 'common') return { anchor: Math.max(...sel.map(f => f.d[0])), end, overallLast, label: T().stCommon };
  if (st.start !== 'period') { const f = g.funds.find(x => x.provider === st.start); return { anchor: f.d[0], end, overallLast, label: T().stFund(labelOf(f.provider)) }; }
  const r = presetRangeF(period, end, sel, maxAnchorOf(sel));
  return { ...r, overallLast, label: periodLabel(period) };
}
function windowFor(per, end, sel) {               // heatmap eilutės langas
  if (per === '10y') return { anchor: shiftMonths(end, 120), end };
  return presetRangeF(per, end, sel, 0);
}
function compute(g) {
  const st = CS[g.id], sel = g.funds.filter(f => st.provs.has(f.provider));
  const rng = cardRange(g, st, sel);
  const live = sel.filter(f => f.d[f.d.length - 1] >= rng.overallLast - 5);
  const rows = sel.map(f => {
    const stale = f.d[f.d.length - 1] < rng.overallLast - 5;
    const s = stale ? null : seriesOf(f, rng.anchor, rng.end);
    const ie = lastOnOrBefore(f, rng.end);
    return { f, ret: s ? s.ret : null, unit: ie >= 0 ? f.v[ie] : null, stale };
  });
  rows.sort((a, b) => (b.ret ?? -1e9) - (a.ret ?? -1e9));
  return { st, sel, live, rows, rng, series: buildSeries(live, rng.anchor, rng.end) };
}
const rankOf = vals => { const ok = vals.filter(o => o.v !== null).sort((a, b) => b.v - a.v), map = new Map(); ok.forEach((o, i) => map.set(o.key, i + 1)); return { map, n: ok.length }; };
const rkClass = (rank, n) => (!rank || n < 2) ? '' : 'rk' + (Math.round((rank - 1) / (n - 1) * 5) + 1);
function heatTables(g, data) {
  const { sel, rng } = data, fs = sel.slice().sort((a, b) => g.funds.indexOf(a) - g.funds.indexOf(b));
  const end = rng.end, rows = [];
  HM_PERIODS.forEach(per => rows.push({ label: per === '10y' ? T().p10y : T().periods[per], ...windowFor(per, end, sel) }));
  const common = Math.max(...sel.map(f => f.d[0]));
  rows.push({ label: `${T().stCommon} (${iso(common)})`, anchor: common, end });
  if (data.st.start !== 'period' && data.st.start !== 'common' && rng.anchor !== common) rows.push({ label: `${rng.label} (${iso(rng.anchor)})`, anchor: rng.anchor, end, cur: true });
  rows.forEach(r => {
    r.vals = {}; fs.forEach(f => { const s = f.d[f.d.length - 1] < rng.overallLast - 5 ? null : seriesOf(f, r.anchor, r.end); r.vals[f.provider] = s ? s.ret : null; });
    Object.assign(r, rankOf(fs.map(f => ({ key: f.provider, v: r.vals[f.provider] }))));
  });
  const head = `<thead><tr><th></th>${fs.map(f => `<th title="${f.name}"><span class="sw-top" style="background:${colorOf(f.provider)}"></span>${shortName(f.name)}</th>`).join('')}</tr></thead>`;
  const tip = (r, f) => { const ia = lastOnOrBefore(f, r.anchor), ie = lastOnOrBefore(f, r.end); return ia < 0 || ie < 0 ? '' : ` title="${f.name}: ${iso(f.d[ia])} ${num(f.v[ia], 4)} → ${iso(f.d[ie])} ${num(f.v[ie], 4)}"`; };
  const body = fn => rows.map(r => `<tr${r.cur ? ' class="avg"' : ''}><td>${r.label}</td>${fs.map(f => fn(r, f)).join('')}</tr>`).join('');
  const ret = head + '<tbody>' + body((r, f) => { const v = r.vals[f.provider]; return v === null ? '<td class="na">–</td>' : `<td class="${rkClass(r.map.get(f.provider), r.n)}"${tip(r, f)}>${pctPlain(v, 1)}</td>`; }) + '</tbody>';
  const rank = head + '<tbody>' + body((r, f) => { const k = r.map.get(f.provider); return k ? `<td class="${rkClass(k, r.n)}" title="${k}/${r.n}">${k}</td>` : '<td class="na">–</td>'; }) + '</tbody>';
  return { ret, rank, end };
}
function paintCard(c, mr) {
  const evs = c.data.st.events ? ALL_EVENTS().filter(e => e.day >= c.data.rng.anchor && e.day <= c.data.rng.end) : [];
  c.ctl = drawLineChart(c.chart, c.data.series, c.data.rng.anchor, c.data.rng.end, { mr, events: evs, hl: c.data.st.pin, unit: ' %', axisUnit: '%',
    height: Math.max(280, Math.min(440, Math.round((c.chart.clientWidth || 600) * 0.45))), onPick: id => { c.data.st.pin = c.data.st.pin === id ? null : id; c.ctl && c.ctl.highlight(c.data.st.pin); } });
  return evs;
}
function renderCard(g, card) {
  const data = compute(g), st = data.st;
  const late = data.series.hidden.map(h => `${labelOf(h.provider)} (${iso(h.start)})`);
  const starts = g.funds.slice().sort((a, b) => a.d[0] - b.d[0]);
  const common = Math.max(...data.sel.map(f => f.d[0]));
  card.innerHTML = `<h2>${T().cat[g.id]}</h2>
    <div class="tools" style="margin:0 0 8px"><label class="field"><span>${T().stLbl}</span><select class="st">
      <option value="period">${T().stPeriod(periodLabel(period))}</option><option value="common">${T().stCommon} (${iso(common)})</option>
      ${starts.map(f => `<option value="${f.provider}">${T().stFund(labelOf(f.provider))} (${iso(f.d[0])})</option>`).join('')}</select></label>
      <button class="btn ev" type="button" aria-pressed="${st.events}">${T().eventsBtn}</button></div>
    <div class="chips" style="margin:0 0 10px"></div>
    <div class="meta">${data.rng.label}: ${iso(data.rng.anchor)} → ${iso(data.rng.end)}${late.length ? ' ' + T().notShown(late.join(', ')) : ''}</div>
    <div class="body"><table><thead><tr><th style="text-align:left">${T().thFund}</th><th>${T().thReturn}</th><th class="hide-s">${T().thUnit}</th><th>${T().thAssets}</th></tr></thead><tbody></tbody></table><div><div class="chart"></div></div></div>
    <ul class="evlist"></ul>
    <div class="group-h">${T().hmRet}</div><div class="cap hmcap"></div><div class="scroll"><table class="mx p3mx hret"></table></div>
    <div class="group-h">${T().hmRank}</div><div class="cap hmcap"></div><div class="scroll"><table class="mx p3mx hrank"></table></div>`;
  const c = { chart: card.querySelector('.chart'), data, ctl: null };
  card.querySelector('select.st').value = st.start;
  card.querySelector('select.st').addEventListener('change', e => { st.start = e.target.value; saveCards(); renderCard(g, card); });
  card.querySelector('.ev').addEventListener('click', () => { st.events = !st.events; saveCards(); renderCard(g, card); });
  const chips = card.querySelector('.chips');
  g.funds.forEach(f => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', st.provs.has(f.provider));
    b.innerHTML = `<i style="background:${colorOf(f.provider)}"></i>${labelOf(f.provider)}`;
    b.addEventListener('click', () => { if (st.provs.has(f.provider)) { if (st.provs.size > 1) st.provs.delete(f.provider); } else st.provs.add(f.provider); if (st.start === f.provider && !st.provs.has(f.provider)) st.start = 'period'; saveCards(); renderCard(g, card); });
    b.addEventListener('dblclick', () => { st.pin = st.pin === f.provider ? null : f.provider; c.ctl && c.ctl.highlight(st.pin); });
    b.addEventListener('mouseenter', () => c.ctl && c.ctl.highlight(f.provider)); b.addEventListener('mouseleave', () => c.ctl && c.ctl.highlight(st.pin));
    chips.appendChild(b);
  });
  const tb = card.querySelector('tbody');
  data.rows.forEach((r, i) => {
    const tr = document.createElement('tr');
    const ret = r.ret === null ? `<span class="na">${r.stale ? T().noNew : '–'}</span>` : `<span class="${r.ret >= 0 ? 'pos' : 'neg'}">${pct(r.ret)}</span>`;
    tr.innerHTML = `<td class="name"><span class="rank">${r.ret === null ? '' : i + 1}</span><span class="sw" style="background:${colorOf(r.f.provider)}"></span>${labelOf(r.f.provider)}</td>
      <td>${ret}</td><td class="hide-s">${r.unit === null ? '–' : num(r.unit, 4)}</td><td>${r.f.assets ? num(r.f.assets / 1e6, 1) : '<span class="na">–</span>'}</td>`;
    tr.addEventListener('mouseenter', () => c.ctl && c.ctl.highlight(r.f.provider));
    tr.addEventListener('mouseleave', () => c.ctl && c.ctl.highlight(st.pin));
    tb.appendChild(tr);
  });
  const ht = heatTables(g, data);
  card.querySelector('.hret').innerHTML = ht.ret; card.querySelector('.hrank').innerHTML = ht.rank;
  card.querySelectorAll('.hmcap').forEach(e => { e.textContent = T().hmCap(iso(ht.end)); });
  const i = cards.findIndex(x => x.g === g); c.g = g; c.card = card;
  c.hc = hoverCompress(c.chart, mr => paintCard(c, mr));
  if (i >= 0) cards[i] = c; else cards.push(c);
  const evs = paintCard(c, 16);
  card.querySelector('.evlist').innerHTML = evs.map(e => `<li><span class="n">${e.n}</span><div><b>${iso(e.day)} · ${e.title}</b> – ${e.text} <span class="na">(${e.src.map(s => `<a href="${s.u}" target="_blank" rel="noopener">${s.n}</a>`).join(', ')})</span></div></li>`).join('');
}
const cards = [];
function renderCards() {
  const root = document.getElementById('groups'); root.innerHTML = ''; cards.length = 0;
  DATA.groups.forEach(g => {
    if (!g.funds.length) return;
    const card = document.createElement('section'); card.className = 'card'; root.appendChild(card);
    renderCard(g, card);
  });
}

/* ---------- visų fondų lentelė ---------- */
const COLS = [
  { k: 'ytd', t: 'thYtd' }, { k: 'r1', t: 'th1y' }, { k: 'r3', t: 'th3y' }, { k: 'r5', t: 'th5y' }, { k: 'r10', t: 'th10y' },
  { k: 'incep', t: 'thIncep' }, { k: 'vol', t: 'thVol', low: true }, { k: 'dd', t: 'thDd' },
];
let sortKey = null, sortDir = -1;
function renderAll() {
  const rows = ALL.map(f => ({ f, m: metrics(f) }));
  const best = {};
  ['bond', 'mixed', 'equity'].forEach(cat => COLS.forEach(c => {
    const vals = rows.filter(r => r.f.cat === cat && r.m[c.k] !== null).map(r => r.m[c.k]);
    if (vals.length > 1) best[cat + c.k] = c.low ? Math.min(...vals) : Math.max(...vals);
  }));
  const fmt = (v, c, cat) => v === null ? '<span class="na">–</span>' : `<span class="${best[cat + c.k] === v ? 'best' : ''}">${pctPlain(v, 2)}</span>`;
  const head = `<thead><tr><th data-k="name">${T().thFund}</th><th data-k="since">${T().thSince}</th><th data-k="unit">${T().thUnitDate}</th>${COLS.map(c => `<th data-k="${c.k}">${T()[c.t]}</th>`).join('')}<th data-k="assets">${T().thAssets}</th><th data-k="risky">${T().thRisky}</th></tr></thead>`;
  const line = r => `<tr><td><span class="sw" style="display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;background:${colorOf(r.f.provider)}"></span>${r.f.name}</td>
    <td>${iso(r.f.d[0])}</td><td>${num(r.m.last, 4)}</td>${COLS.map(c => `<td>${fmt(r.m[c.k], c, r.f.cat)}</td>`).join('')}
    <td>${r.f.assets ? num(r.f.assets / 1e6, 1) : '<span class="na">–</span>'}</td><td>${r.f.risky}</td></tr>`;
  let body = '';
  if (!sortKey) {
    ['bond', 'mixed', 'equity'].forEach(cat => {
      body += `<tr class="sep"><td colspan="${COLS.length + 5}">${T().cat[cat]}</td></tr>`;
      rows.filter(r => r.f.cat === cat).sort((a, b) => (b.m.incep ?? -1e9) - (a.m.incep ?? -1e9)).forEach(r => body += line(r));
    });
  } else {
    const val = r => sortKey === 'name' ? r.f.name : sortKey === 'since' ? r.f.d[0] : sortKey === 'unit' ? r.m.last : sortKey === 'assets' ? (r.f.assets ?? -1) : sortKey === 'risky' ? r.f.risky : (r.m[sortKey] ?? -1e9);
    rows.sort((a, b) => { const x = val(a), y = val(b); return (x > y ? 1 : x < y ? -1 : 0) * sortDir; }).forEach(r => body += line(r));
  }
  const t = document.getElementById('all');
  t.innerHTML = head + `<tbody>${body}</tbody>`;
  t.querySelectorAll('th').forEach(th => th.addEventListener('click', () => {
    const k = th.dataset.k;
    if (sortKey === k) { sortDir = -sortDir; if (sortDir === -1) sortKey = null; } else { sortKey = k; sortDir = k === 'name' || k === 'since' ? 1 : -1; }
    renderAll();
  }));
  document.getElementById('allTitle').textContent = T().allTitle;
  document.getElementById('allNote').textContent = T().allNote;
}

/* ---------- laikotarpiai ---------- */
const pe = document.getElementById('periods');
function labelPeriods() {
  pe.setAttribute('aria-label', T().period);
  pe.querySelectorAll('button').forEach(b => b.textContent = T().periods[b.dataset.id]);
  pe.querySelectorAll('select.segsel').forEach(sel => {
    const k = sel.dataset.kind, active = period.startsWith(k + ':');
    sel.innerHTML = `<option value="">${k === 'q' ? T().qPlace : T().yPlace}</option>` + CAL_OPTS[k].map(id => `<option value="${id}">${periodLabel(id)}</option>`).join('');
    sel.value = active ? period : ''; sel.classList.toggle('active', active);
  });
}
function setPeriod(p) { period = p; try { localStorage.setItem('p3period', p); } catch (e) {} sync(); renderCards(); }
PRESET_IDS.forEach(id => {
  if (id === 'Q' || id === 'Y') {
    const sel = document.createElement('select'); sel.className = 'segsel'; sel.dataset.kind = id.toLowerCase();
    sel.addEventListener('change', () => { if (sel.value) setPeriod(sel.value); });
    pe.appendChild(sel); return;
  }
  const b = document.createElement('button'); b.type = 'button'; b.dataset.id = id;
  b.addEventListener('click', () => setPeriod(id));
  pe.appendChild(b);
});
function sync() { pe.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === period)); labelPeriods(); }

function renderAllParts() {
  document.getElementById('sub').textContent = `${T().navPillar3} · ${T().dataUntil} ${iso(LATEST)} · ${T().updated} ${DATA.generated}`;
  document.getElementById('foot').textContent = T().foot;
  renderKpis(); renderCards(); renderAll();
  document.getElementById('rddTitle').textContent = T().rddTitle;
  RDD = runupDrawdown(document.getElementById('rdd'), DATA.groups.filter(g => g.funds.length).map(g => ({ id: g.id, label: T().cat[g.id], funds: g.funds })), 'p3', 'equity');
}
let RDD = null;
renderHeader('pillar3', () => { sync(); renderAllParts(); });
sync(); renderAllParts();
let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { cards.forEach(c => paintCard(c, c.hc.mr)); RDD && RDD.paint(); }, 120); });
