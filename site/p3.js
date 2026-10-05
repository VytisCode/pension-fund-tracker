/* III pakopos polapis: kategorijų kortelės (reitingas + grafikas pasirinktu laikotarpiu) ir visų fondų rodiklių lentelė. */
addStrings({
  cat: { bond: 'Bond funds', mixed: 'Mixed funds', equity: 'Equity funds' },
  thFund: 'Fund', thCat: 'Type', thSince: 'Since', thYtd: 'YTD', th1y: '1 yr', th3y: '3 yr p.a.', th5y: '5 yr p.a.', th10y: '10 yr p.a.',
  thIncep: 'Since start p.a.', thVol: 'Volatility 3 yr', thDd: 'Max drawdown', thRisky: 'Equities', thUnitDate: 'Unit value',
  kFunds: 'Funds tracked', kProviders: 'Providers', kAssets: 'Net assets (known), € m', kHistory: 'History from', kUntil: 'Data until',
  allTitle: 'All Pillar III funds – key figures',
  allNote: 'p.a. = average annual return (geometric), calculated from unit values like the Bank of Lithuania does. Volatility = annualised standard deviation of monthly returns over the last 3 years. Max drawdown = largest fall from a previous peak since the fund started. Equities = maximum share of risky assets per the Bank of Lithuania (30 Jun 2026). Click a column header to sort. Bold = best in its category.',
  foot: 'Pillar III (voluntary) pension funds. Unit value histories from the providers (full history from each fund\'s start where available); returns do not include contribution fees. For information only, not investment advice.',
}, {
  cat: { bond: 'Obligacijų fondai', mixed: 'Mišraus investavimo fondai', equity: 'Akcijų fondai' },
  thFund: 'Fondas', thCat: 'Tipas', thSince: 'Nuo', thYtd: 'Šie metai', th1y: '1 m.', th3y: '3 m. vid.', th5y: '5 m. vid.', th10y: '10 m. vid.',
  thIncep: 'Nuo pradžios vid.', thVol: 'Svyravimas 3 m.', thDd: 'Didžiausias kritimas', thRisky: 'Akcijos', thUnitDate: 'Vieneto vertė',
  kFunds: 'Fondų', kProviders: 'Bendrovių', kAssets: 'Grynieji aktyvai (žinomi), mln. €', kHistory: 'Istorija nuo', kUntil: 'Duomenys iki',
  allTitle: 'Visi III pakopos fondai – pagrindiniai rodikliai',
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

/* ---------- kategorijų kortelės ---------- */
const cards = [];
function compute(group) {
  const { end, overallLast } = groupEnd(group);
  const { anchor, end: e2 } = presetRangeF(period, end, group.funds, maxAnchorOf(group.funds));
  const live = group.funds.filter(f => f.d[f.d.length - 1] >= overallLast - 5);
  const rows = group.funds.map(f => {
    const stale = f.d[f.d.length - 1] < overallLast - 5;
    const s = stale ? null : seriesOf(f, anchor, e2);
    const ie = lastOnOrBefore(f, e2);
    return { f, ret: s ? s.ret : null, unit: ie >= 0 ? f.v[ie] : null, stale };
  });
  rows.sort((a, b) => (b.ret ?? -1e9) - (a.ret ?? -1e9));
  return { rows, end: e2, anchor, series: buildSeries(live, anchor, e2) };
}
function paintCard(c, mr) {
  c.ctl = drawLineChart(c.chart, c.data.series, c.data.anchor, c.data.end, { mr, height: Math.max(260, Math.min(420, Math.round((c.chart.clientWidth || 600) * 0.45))), unit: ' %', axisUnit: '%' });
}
function renderCards() {
  const root = document.getElementById('groups'); root.innerHTML = ''; cards.length = 0;
  DATA.groups.forEach(g => {
    if (!g.funds.length) return;
    const data = compute(g);
    const card = document.createElement('section'); card.className = 'card';
    const late = data.series.filter(r => r.aligned).map(r => `${labelOf(r.provider)} (${iso(r.points[0][0])})`);
    card.innerHTML = `<h2>${T().cat[g.id]}</h2><div class="meta">${periodLabel(period)}: ${iso(data.anchor)} → ${iso(data.end)}${late.length ? ' ' + T().notShown(late.join(', ')) : ''}</div>
      <div class="body"><table><thead><tr><th style="text-align:left">${T().thFund}</th><th>${T().thReturn}</th><th class="hide-s">${T().thUnit}</th><th>${T().thAssets}</th></tr></thead><tbody></tbody></table><div><div class="chart"></div></div></div>`;
    const tb = card.querySelector('tbody');
    data.rows.forEach((r, i) => {
      const tr = document.createElement('tr');
      const ret = r.ret === null ? `<span class="na">${r.stale ? T().noNew : '–'}</span>` : `<span class="${r.ret >= 0 ? 'pos' : 'neg'}">${pct(r.ret)}</span>`;
      tr.innerHTML = `<td class="name"><span class="rank">${r.ret === null ? '' : i + 1}</span><span class="sw" style="background:${colorOf(r.f.provider)}"></span>${labelOf(r.f.provider)}</td>
        <td>${ret}</td><td class="hide-s">${r.unit === null ? '–' : num(r.unit, 4)}</td><td>${r.f.assets ? num(r.f.assets / 1e6, 1) : '<span class="na">–</span>'}</td>`;
      tr.addEventListener('mouseenter', () => c.ctl && c.ctl.highlight(r.f.provider));
      tr.addEventListener('mouseleave', () => c.ctl && c.ctl.highlight(null));
      tb.appendChild(tr);
    });
    root.appendChild(card);
    const c = { chart: card.querySelector('.chart'), data, ctl: null };
    c.hc = hoverCompress(c.chart, mr => paintCard(c, mr));
    cards.push(c);
  });
  cards.forEach(c => paintCard(c, 16));
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
}
renderHeader('pillar3', () => { sync(); renderAllParts(); });
sync(); renderAllParts();
let resizeTimer; addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => cards.forEach(c => paintCard(c, c.hc.mr)), 120); });
