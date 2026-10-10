/* Bendras kodas visiems puslapiams: kalba, tema, antraštė, pagalbinės funkcijos, linijinė diagrama. */
const DAY = 86400000;
const iso = d => new Date(d * DAY).toISOString().slice(0, 10);
const dayOf = s => Math.round(Date.parse(s + 'T00:00:00Z') / DAY);

const I18N = {
  en: {
    refresh: 'Refresh data', refreshTip: 'Opens the data update on GitHub. Tap “Run workflow”, then the green “Run workflow” button. The site updates about 5 minutes later (only the owner can start it).',
    siteTitle: 'Pension fund tracker', theme: 'Theme', period: 'Period', locale: 'en-GB',
    navOverview: 'Overview', navPerformance: 'Performance & peers', navPillar3: 'Pillar III', navPortfolios: 'Portfolios', navAum: 'Assets (AUM)', navReports: 'Reports', navJourney: 'Retirement journey',
    thProvider: 'Provider', thReturn: 'Return', thUnit: 'Unit value', thAssets: 'Net assets, € m',
    dataUntil: 'Data until', updated: 'updated', freshLbl: 'Latest value:',
    freshLate: n => `${n} business day${n === 1 ? '' : 's'} behind the newest data – returns for this provider may be missing or older`,
    freshOk: 'Up to date', noNew: 'no new data', noData: 'Not enough data for this period.',
    chartLabel: 'Return over the selected period', born: 'Born', turto: 'Payout',
    periods: { '1m': '1 mo', '3m': '3 mo', '6m': '6 mo', ytd: 'YTD', '1y': '1 yr', '3y': '3 yr', '5y': '5 yr', max: 'All history', custom: 'Custom' },
  },
  lt: {
    refresh: 'Atnaujinti duomenis', refreshTip: 'Atidaro duomenų atnaujinimą GitHub’e. Paspausk „Run workflow“, tada žalią „Run workflow“ mygtuką. Svetainė atsinaujins maždaug po 5 minučių (paleisti gali tik savininkas).',
    siteTitle: 'Pensijų fondų sekimas', theme: 'Tema', period: 'Laikotarpis', locale: 'lt-LT',
    navOverview: 'Apžvalga', navPerformance: 'Rezultatai ir palyginimas', navPillar3: 'III pakopa', navPortfolios: 'Portfeliai', navAum: 'Turtas (AUM)', navReports: 'Ataskaitos', navJourney: 'Kelias į pensiją',
    thProvider: 'Tiekėjas', thReturn: 'Grąža', thUnit: 'Vieneto vertė', thAssets: 'Aktyvai, mln. €',
    dataUntil: 'Duomenys iki', updated: 'atnaujinta', freshLbl: 'Paskutinė vertė:',
    freshLate: n => `Atsilieka ${n} d. d. nuo naujausių duomenų – šio tiekėjo grąžos gali nebūti arba ji senesnė`,
    freshOk: 'Duomenys naujausi', noNew: 'nėra naujų duomenų', noData: 'Šiam laikotarpiui duomenų nepakanka.',
    chartLabel: 'Grąžos kitimas pasirinktu laikotarpiu', born: 'Gimę', turto: 'Turto išsaugojimo',
    periods: { '1m': '1 mėn.', '3m': '3 mėn.', '6m': '6 mėn.', ytd: 'Šie metai', '1y': '1 metai', '3y': '3 metai', '5y': '5 metai', max: 'Visa istorija', custom: 'Pasirinktas' },
  },
};
function addStrings(en, lt) { Object.assign(I18N.en, en); Object.assign(I18N.lt, lt); }

let lang = 'lt';                        // numatytoji kalba – lietuvių (auditas #28)
try { const l = localStorage.getItem('lang'); if (l === 'en' || l === 'lt') lang = l; } catch (e) {}
const T = () => I18N[lang];
const num = (x, p = 2) => x.toLocaleString(T().locale, { minimumFractionDigits: p, maximumFractionDigits: p });
const pct = (x, p = 2) => (x >= 0 ? '+' : '−') + num(Math.abs(x), p) + ' %';
const pctPlain = (x, p = 1) => (x < 0 ? '−' : '') + num(Math.abs(x), p) + '%';
const colorOf = id => `var(--s${DATA.providers.findIndex(p => p.id === id) + 1})`;
const labelOf = id => DATA.providers.find(p => p.id === id).label;
const groupLabel = g => g.id === 'turto' ? T().turto : g.id.replace('-', '–');

try { const t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}

/* Antraštė su navigacija, kalbos ir temos jungikliais. onLang – iš naujo nupiešia puslapį. */
/* „Atnaujinti duomenis“ mygtukas rodomas tik savininko naršyklėje: įjungiama vieną kartą atidarius bet kurį puslapį su ?owner=1
   (išjungiama ?owner=0). Tai tik paslėpimas, ne apsauga: paleisti atnaujinimą GitHub'e vis tiek gali tik savininkas. */
function isOwner() {
  try {
    const q = new URLSearchParams(location.search).get('owner');
    if (q === '1') localStorage.setItem('owner', '1');
    if (q === '0') localStorage.removeItem('owner');
    return localStorage.getItem('owner') === '1';
  } catch (e) { return false; }
}
function renderHeader(active, onLang) {
  const h = document.getElementById('top');
  h.innerHTML = `<div><h1 id="title"></h1><div class="sub" id="sub"></div><div class="fresh" id="fresh"></div>
    <nav class="nav"><a href="performance.html" data-p="performance"></a><a href="overview.html" data-p="overview"></a><a href="pillar3.html" data-p="pillar3"></a><a href="aum.html" data-p="aum"></a><a href="portfolios.html" data-p="portfolios"></a><a href="reports.html" data-p="reports"></a><a href="journey.html" data-p="journey"></a></nav></div>
    <div class="top-tools"><div class="dlwrap"><button class="btn" type="button" id="dlBtn" aria-expanded="false"></button><div class="dlpanel" id="dlPanel" hidden></div></div><a class="btn" id="refresh" hidden href="https://github.com/VytisCode/pension-fund-tracker/actions/workflows/update.yml" target="_blank" rel="noopener">↻ <span></span></a><div class="seg" id="lang" role="group" aria-label="Language">
      <button type="button" data-lang="en">EN</button><button type="button" data-lang="lt">LT</button></div>
      <div class="seg" id="theme" role="group">
        <button type="button" data-theme="light"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
        <button type="button" data-theme="dark"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></div></div>`;
  const apply = () => {
    document.documentElement.lang = lang;
    document.getElementById('title').textContent = T().siteTitle;
    const rb = document.getElementById('refresh'); rb.title = T().refreshTip; rb.querySelector('span').textContent = T().refresh; rb.hidden = !isOwner();
    const el = document.documentElement, dark = el.dataset.theme === 'dark' || (!el.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const tb = document.getElementById('theme'); tb.setAttribute('aria-label', T().theme);
    tb.querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', (b.dataset.theme === 'dark') === dark); b.title = b.dataset.theme === 'dark' ? (lang === 'lt' ? 'Tamsi tema' : 'Dark theme') : (lang === 'lt' ? 'Šviesi tema' : 'Light theme'); b.setAttribute('aria-label', b.title); });
    h.querySelector('[data-p="overview"]').textContent = T().navOverview;
    h.querySelector('[data-p="performance"]').textContent = T().navPerformance;
    h.querySelector('[data-p="pillar3"]').textContent = T().navPillar3;
    h.querySelector('[data-p="portfolios"]').textContent = T().navPortfolios;
    h.querySelector('[data-p="aum"]').textContent = T().navAum;
    h.querySelector('[data-p="reports"]').textContent = T().navReports;
    h.querySelector('[data-p="journey"]').textContent = T().navJourney;
    h.querySelectorAll('.nav a').forEach(a => a.removeAttribute('aria-current'));
    h.querySelector(`.nav a[data-p="${active}"]`).setAttribute('aria-current', 'page');
    document.title = `${h.querySelector(`.nav a[data-p="${active}"]`).textContent} · ${T().siteTitle}`;   // savas pavadinimas kiekvienam puslapiui (auditas #26)
    h.querySelectorAll('#lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    document.getElementById('dlBtn').textContent = '⬇ ' + T().dlBtn; if (!document.getElementById('dlPanel').hidden) dlRender();
    if (active === 'performance' || active === 'overview') document.getElementById('fresh').innerHTML = freshnessHTML();
  };
  h.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', () => {
    lang = b.dataset.lang; try { localStorage.setItem('lang', lang); } catch (e) {}
    apply(); onLang();
  }));
  h.querySelectorAll('#theme button').forEach(b => b.addEventListener('click', () => {
    document.documentElement.dataset.theme = b.dataset.theme;
    try { localStorage.setItem('theme', b.dataset.theme); } catch (e) {}
    apply();
  }));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);
  const dlb = document.getElementById('dlBtn'), dlp = document.getElementById('dlPanel');
  dlb.addEventListener('click', () => { dlp.hidden = !dlp.hidden; dlb.setAttribute('aria-expanded', !dlp.hidden); if (!dlp.hidden) dlRender(); });
  document.addEventListener('click', e => { if (e.isTrusted && !dlp.hidden && !e.target.closest('.dlwrap')) { dlp.hidden = true; dlb.setAttribute('aria-expanded', false); } });
  apply();
  return apply;
}

/* Duomenų šviežumas: kiekvieno tiekėjo seniausia iš paskutinių fondų verčių dienų (uždaryti fondai,
   neatnaujinti > 30 d., neskaičiuojami). Atsiliekantys nuo naujausios dienos paryškinami. */
// Lentelių antraštės lieka matomos slenkant (auditas #20). Telpanti lentelė – antraštė prilimpa ekrano viršuje (po lipnia juosta);
// platesnė už ekraną – lentelė gauna aukščio ribą, o antraštė prilimpa jos viduje
function fitSticky() {
  const bar = [...document.querySelectorAll('.bar.sticky, .jnav')].find(b => getComputedStyle(b).position === 'sticky');
  document.documentElement.style.setProperty('--stick', (bar ? bar.offsetHeight : 0) + 'px');
  document.querySelectorAll('.scroll').forEach(sc => {
    if (!sc.querySelector('thead')) return;
    sc.classList.remove('stick', 'stickbox', 'freeze');
    const fits = sc.scrollWidth <= sc.clientWidth + 1 && getComputedStyle(sc).maxHeight === 'none';   // savo aukščio ribą turinčios lentelės lieka dėžutėje
    sc.classList.add(fits ? 'stick' : 'stickbox');
    const th0 = sc.querySelector('thead th');   // pirmas stulpelis užšaldomas, kai jame pavadinimas (ne siauras numeris)
    sc.classList.toggle('freeze', !fits && !!th0 && th0.offsetWidth >= 80 && th0.offsetWidth < sc.clientWidth / 2);
    if (!sc.dataset.edges) { sc.dataset.edges = 1; sc.addEventListener('scroll', () => scrollEdges(sc), { passive: true }); }
    scrollEdges(sc);
  });
}
// plačios lentelės: šešėlis prie užšaldyto pirmo stulpelio ir išblukęs dešinys kraštas rodo, kad galima slinkti į šonus (auditas #21, #22)
function scrollEdges(sc) {
  sc.classList.toggle('sl', sc.scrollLeft > 1);
  sc.classList.toggle('sr', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 1);
}
{ let q = 0; const later = () => { if (!q) q = requestAnimationFrame(() => { q = 0; fitSticky(); }); };
  addEventListener('DOMContentLoaded', () => { new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); later(); });
  addEventListener('resize', later); }
function businessDaysBetween(a, b) {      // darbo dienos intervale (a, b]
  let n = 0; for (let d = a + 1; d <= b; d++) { const w = new Date(d * DAY).getUTCDay(); if (w !== 0 && w !== 6) n++; }
  return n;
}
function freshnessHTML() {
  const lasts = DATA.groups.flatMap(g => g.funds.map(f => ({ p: f.provider, d: f.d[f.d.length - 1] })));
  const top = Math.max(...lasts.map(x => x.d));
  return `<span class="fr-l">${T().freshLbl}</span>` + DATA.providers.map(p => {
    const ds = lasts.filter(x => x.p === p.id && x.d >= top - 30).map(x => x.d);
    if (!ds.length) return '';
    const d = Math.min(...ds), lag = businessDaysBetween(d, top);
    const tip = lag ? T().freshLate(lag) : T().freshOk;
    return `<span class="fr${lag ? ' late' : ''}" title="${tip}"><i style="background:${colorOf(p.id)}"></i>${p.label} ${iso(d).slice(5)}${lag ? ' ⚠' : ''}</span>`;
  }).join('');
}

/* ---------- laiko eilučių pagalbinės ---------- */
function lastOnOrBefore(f, day) {          // paskutinės reikšmės indeksas iki dienos (imtinai) arba -1
  let lo = 0, hi = f.d.length - 1, ans = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (f.d[mid] <= day) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
  return ans;
}
function shiftMonths(day, months) {
  const dt = new Date(day * DAY); dt.setUTCMonth(dt.getUTCMonth() - months);
  return Math.round(dt.getTime() / DAY);
}
function groupEnd(group) {                  // bendra paskutinė diena grupėje (jau atnaujinusių tiekėjų)
  const funds = group.funds;
  const overallLast = Math.max(...funds.map(f => f.d[f.d.length - 1]));
  const live = funds.filter(f => f.d[f.d.length - 1] >= overallLast - 5);
  return { end: Math.min(...live.map(f => f.d[f.d.length - 1])), overallLast };
}
function anchorFor(per, end, funds) {
  const e = new Date(end * DAY);
  switch (per) {
    case '1m': return shiftMonths(end, 1);
    case '3m': return shiftMonths(end, 3);
    case '6m': return shiftMonths(end, 6);
    case '1y': return shiftMonths(end, 12);
    case '3y': return shiftMonths(end, 36);
    case '5y': return shiftMonths(end, 60);
    case 'ytd': return Math.round(Date.UTC(e.getUTCFullYear() - 1, 11, 31) / DAY);
    default: return Math.max(...funds.map(f => f.d[0]));       // bendra pradžia
  }
}

/* ---------- linijinė diagrama ----------
   series: [{ provider, points: [[diena, grąža %], ...] }] */
function niceTicks(min, max, n = 5) {
  const span = max - min || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
  const out = []; for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) out.push(+t.toFixed(10));
  return out;
}
function drawLineChart(el, series, x0, x1, opts = {}) {
  el.querySelectorAll('svg, p.na').forEach(s => s.remove());
  series = series.filter(r => r.points.length > 1);
  const W = opts.width || el.clientWidth || 600, H = opts.height || Math.max(240, Math.min(340, W * 0.5));
  const wide = W > 560, m = { l: opts.ml ?? 46, r: opts.mr ?? 16, t: opts.events && opts.events.length ? 26 : 10, b: 26 };
  if (!series.length || x1 <= x0) { el.insertAdjacentHTML('beforeend', `<p class="na">${T().noData}</p>`); return null; }
  const els = {};                               // provider -> [elementai] paryškinimui
  const sCol = r => r.color || colorOf(r.provider), sLab = r => r.label || labelOf(r.provider);   // eilutė gali turėti savo spalvą / pavadinimą
  let lo = opts.zero === false ? Infinity : 0, hi = opts.zero === false ? -Infinity : 0;    // zero: false – ašis neprivalo apimti nulio
  series.forEach(s => s.points.forEach(p => { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); }));
  const pad = (hi - lo) * 0.06 || 1; lo -= pad; hi += pad;
  const X = d => m.l + (d - x0) / (x1 - x0) * (W - m.l - m.r);
  const Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', T().chartLabel);
  const add = (tag, attrs, parent = svg) => { const n = document.createElementNS(ns, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };

  niceTicks(lo, hi).forEach(t => {
    add('line', { x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t), stroke: t === 0 ? 'var(--axis)' : 'var(--grid)', 'stroke-width': 1 });
    const tx = add('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end', fill: 'var(--text-3)', 'font-size': 11 }); tx.textContent = num(t, t % 1 ? 1 : 0) + (opts.axisUnit ?? '%');
  });
  const years = (x1 - x0) / 365, ticks = [], cur = new Date(x0 * DAY);
  if (years > 5) { const yStep = Math.max(years > 6 ? 2 : 1, Math.ceil(years * 40 / (W - m.l - m.r)));   // siauruose grafikuose – rečiau
    for (let y = cur.getUTCFullYear() + 1; Date.UTC(y, 0, 1) / DAY < x1; y += yStep) ticks.push([Math.round(Date.UTC(y, 0, 1) / DAY), String(y)]); }
  else if (years > 1.2) {
    const stepM = years > 3 ? 6 : 3;
    for (let t = Date.UTC(cur.getUTCFullYear(), 0, 1); t / DAY < x1; ) {
      const dt = new Date(t); if (t / DAY > x0) ticks.push([Math.round(t / DAY), iso(Math.round(t / DAY)).slice(0, 7)]);
      t = Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + stepM, 1);
    }
  } else { for (let k = 0; k < 6; k++) { const d = Math.round(x0 + (x1 - x0) * k / 5); ticks.push([d, iso(d).slice(years > 0.4 ? 0 : 5)]); } }
  ticks.forEach(([d, label]) => {
    if (d <= x0 || d > x1) return;
    const tx = add('text', { x: X(d), y: H - 6, 'text-anchor': 'middle', fill: 'var(--text-3)', 'font-size': 11 }); tx.textContent = label;
  });

  const step = Math.max(1, Math.floor((x1 - x0) / (W * 1.2)));
  series.slice().reverse().forEach(r => {
    let path = '', last = -1e9;
    r.points.forEach((p, i) => { if (i === 0 || i === r.points.length - 1 || p[0] - last >= step) { path += (path ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); last = p[0]; } });
    (els[r.provider] = els[r.provider] || []).push(add('path', Object.assign({ d: path, fill: 'none', stroke: sCol(r), 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, r.dash ? { 'stroke-dasharray': r.dash } : {})));
  });
  if (wide) {                                  // tiesioginės žymos dešinėje be persidengimo
    const labels = series.map(r => ({ r, y: Y(r.points[r.points.length - 1][1]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + 13);
    labels.forEach(l => {
      const c = add('circle', { cx: X(x1), cy: Y(l.r.points[l.r.points.length - 1][1]), r: 3.5, fill: sCol(l.r), stroke: 'var(--card)', 'stroke-width': 2 });
      const t = add('text', { class: 'endlab', x: W - m.r + 8, y: l.y + 4, fill: 'var(--text-2)', 'font-size': 12, style: opts.onPick ? 'cursor:pointer' : 'cursor:default' });
      if (opts.onPick) t.addEventListener('click', () => opts.onPick(l.r.provider)); t.textContent = sLab(l.r) + ' ';
      const tv = add('tspan', { 'font-weight': 700, fill: 'var(--text)' }, t); const lv = l.r.points[l.r.points.length - 1][1]; tv.textContent = opts.fmt ? opts.fmt(lv) : pct(lv, 1).replace(' %', '%');
      els[l.r.provider].push(c, t);
      t.addEventListener('mouseenter', () => ctl.highlight(l.r.provider)); t.addEventListener('mouseleave', () => ctl.highlight(opts.hl || null));
    });
  }
  const cross = add('line', { y1: m.t, y2: H - m.b, stroke: 'var(--axis)', 'stroke-width': 1, visibility: 'hidden' });
  const hit = add('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent', style: opts.onZoom ? 'cursor:crosshair' : '' });
  const sel = add('rect', { y: m.t, height: H - m.t - m.b, fill: 'var(--accent)', 'fill-opacity': 0.15, stroke: 'var(--accent)', 'stroke-width': 1, visibility: 'hidden', 'pointer-events': 'none' });
  el.appendChild(svg);
  let tip = el.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; el.appendChild(tip); }
  const place = ev => { const box = el.getBoundingClientRect(); tip.style.left = Math.max(0, Math.min((ev.clientX - box.left) + 14, el.clientWidth - tip.offsetWidth - 4)) + 'px'; tip.style.top = Math.max(0, (ev.clientY - box.top) - tip.offsetHeight - 10) + 'px'; };
  const dayAt = ev => { const rect = svg.getBoundingClientRect(), px = (ev.clientX - rect.left) * (W / rect.width); return Math.max(x0, Math.min(x1, Math.round(x0 + (px - m.l) / (W - m.l - m.r) * (x1 - x0)))); };
  let dragging = null;
  const move = ev => {
    if (dragging) return;
    const day = dayAt(ev);
    const vals = series.map(r => { let v = null; for (let i = r.points.length - 1; i >= 0; i--) if (r.points[i][0] <= day) { v = r.points[i][1]; break; } return { r, v }; })
      .filter(o => o.v !== null).sort((a, b) => b.v - a.v);
    if (!vals.length) return;
    cross.setAttribute('x1', X(day)); cross.setAttribute('x2', X(day)); cross.setAttribute('visibility', 'visible');
    tip.innerHTML = `<b>${iso(day)}</b>` + vals.map(o => `<div><span><span class="sw" style="background:${sCol(o.r)}"></span>${sLab(o.r)}</span><span>${opts.fmt ? opts.fmt(o.v) : pct(o.v).replace(' %', opts.unit || ' %')}</span></div>`).join('');
    tip.style.display = 'block'; place(ev);
  };
  hit.addEventListener('mousemove', move); hit.addEventListener('touchmove', e => move(e.touches[0]), { passive: true });
  hit.addEventListener('mouseleave', () => { if (!dragging) { tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden'); } });
  if (opts.onZoom) {                              // pelės tempimas = priartinimas
    hit.addEventListener('pointerdown', ev => {
      if (ev.pointerType !== 'mouse' || ev.button !== 0) return;
      dragging = { a: dayAt(ev) }; tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden');
      const upd = e2 => { const b = dayAt(e2); sel.setAttribute('x', X(Math.min(dragging.a, b))); sel.setAttribute('width', Math.abs(X(b) - X(dragging.a))); sel.setAttribute('visibility', 'visible'); dragging.b = b; };
      const up = () => { removeEventListener('pointermove', upd); removeEventListener('pointerup', up); sel.setAttribute('visibility', 'hidden'); const d = dragging; dragging = null; if (d && d.b !== undefined && Math.abs(X(d.b) - X(d.a)) > 8) opts.onZoom(Math.min(d.a, d.b), Math.max(d.a, d.b)); };
      addEventListener('pointermove', upd); addEventListener('pointerup', up); ev.preventDefault();
    });
  }
  if (opts.events && opts.events.length) {         // įvykių žymos viršuje (numeruotos), tekstas – po grafiku
    opts.events.forEach(e => {
      if (e.day < x0 || e.day > x1) return;
      const x = X(e.day);
      add('line', { x1: x, x2: x, y1: 20, y2: H - m.b, stroke: 'var(--text-3)', 'stroke-width': 1, 'stroke-dasharray': '3 3', 'pointer-events': 'none' });
      const g = add('g', { style: 'cursor:default' });
      add('circle', { cx: x, cy: 11, r: 9, fill: 'var(--card)', stroke: 'var(--text-2)', 'stroke-width': 1.2 }, g);
      const t = add('text', { x, y: 15, 'text-anchor': 'middle', fill: 'var(--text)', 'font-size': 11, 'font-weight': 600 }, g); t.textContent = e.n;
      g.addEventListener('mouseenter', ev => { tip.innerHTML = `<b>${iso(e.day)} · ${e.title}</b><div style="display:block;max-width:260px;white-space:normal">${e.text}</div>`; tip.style.display = 'block'; place(ev); });
      g.addEventListener('mousemove', place); g.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
  }
  const ctl = {
    svg,
    highlight(id) {
      Object.keys(els).forEach(k => els[k].forEach(n => {
        const on = !id || k === id;
        n.setAttribute('opacity', on ? 1 : 0.15);
        if (n.tagName === 'path') { n.setAttribute('stroke-width', id && on ? 3 : 2); if (id && on) n.parentNode.insertBefore(n, cross); }
      }));
    },
  };
  ctl.highlight(opts.hl || null);
  return ctl;
}

/* Pasaulio akcijų indeksai palyginimui (data_idx.js, žr. indexes.py): fondo pavidalo objektai { provider, id, label, color, dash, d, v }.
   Indeksų vertės be mokesčių, fondų vieneto vertės – jau po valdymo mokesčių. */
const IDX_META = {
  MSCI_ACWI: { en: 'World equity (MSCI ACWI)', lt: 'Pasaulio akcijos (MSCI ACWI)', color: '#6b7280', dash: '6 4' },
  MSCI_WORLD: { en: 'MSCI World', lt: 'MSCI World', color: '#a3a3a3', dash: '2 3' },
  SP500: { en: 'S&P 500', lt: 'S&P 500', color: '#b7791f', dash: '6 3 2 3' },
};
let IDX_CACHE = null;
function idxFunds() {
  if (typeof IDX === 'undefined') return [];
  if (!IDX_CACHE) IDX_CACHE = Object.keys(IDX_META).filter(k => IDX[k]).map(k => {
    const x = IDX[k], d = [x.d0]; x.dd.forEach(v => d.push(d[d.length - 1] + v));
    return { provider: 'IDX_' + k, id: k, color: IDX_META[k].color, dash: IDX_META[k].dash, d, v: x.v };
  });
  IDX_CACHE.forEach(f => { f.label = IDX_META[f.id][lang]; });
  return IDX_CACHE;
}

/* Grupės kortelės: grąža ir linijos laikotarpyje (naudoja ir apžvalga, ir rezultatų puslapis) */
function seriesOf(f, anchor, end) {
  const ie = lastOnOrBefore(f, end), ia = lastOnOrBefore(f, anchor);
  if (ie < 0 || ia < 0 || f.d[0] > anchor) return null;
  const base = f.v[ia], points = [[anchor, 0]];
  for (let i = ia + 1; i <= ie; i++) if (f.d[i] > anchor) points.push([f.d[i], (f.v[i] / base - 1) * 100]);
  return { ret: (f.v[ie] / base - 1) * 100, points, ia, ie };
}


/* ---------- bendra laikotarpių logika (rezultatų ir apžvalgos puslapiai) ---------- */
const PRESET_IDS = ['1m', '3m', '6m', 'ytd', 'Q', '1y', 'Y', '3y', '5y', 'max'];   // Q ir Y – išskleidžiami sąrašai (ketvirtis „q:2026-3“, metai „y:2025“)
const isCalPeriod = id => /^q:\d{4}-[1-4]$/.test(id) || /^y:\d{4}$/.test(id);
const periodLabel = id => { let m; if ((m = /^q:(\d{4})-([1-4])$/.exec(id))) return `Q${m[2]} ${m[1]}`; if ((m = /^y:(\d{4})$/.exec(id))) return m[1]; return T().periods[id]; };
const maxAnchorOf = funds => {                  // „Visa istorija“: nuo ankstyviausio fondo; pradėję ≤31 d. vėliau laikomi pradėjusiais kartu
  const st = funds.map(f => f.d[0]).sort((x, y) => x - y);
  return Math.max(...st.filter(d => d - st[0] <= 31));
};
function presetRangeF(per, end, funds, maxA) {
  if (per === 'max') return { anchor: maxA, end };
  let m;
  if ((m = /^q:(\d{4})-([1-4])$/.exec(per))) { const y = +m[1], q = +m[2]; return { anchor: Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY), end: Math.min(end, Math.round(Date.UTC(y, q * 3, 0) / DAY)) }; }
  if ((m = /^y:(\d{4})$/.exec(per))) { const y = +m[1]; return { anchor: Math.round(Date.UTC(y - 1, 11, 31) / DAY), end: Math.min(end, Math.round(Date.UTC(y, 11, 31) / DAY)) }; }
  return { anchor: anchorFor(per, end, funds), end };
}
function calOptions(latest, earliest) {          // tik pilni ketvirčiai / metai, kurių pabaiga yra duomenų ribose
  const y1 = new Date(latest * DAY).getUTCFullYear(), y0 = new Date(earliest * DAY).getUTCFullYear(), qs = [], ys = [];
  for (let y = y1; y >= y0; y--) {
    for (let q = 4; q >= 1; q--) { const e = Math.round(Date.UTC(y, q * 3, 0) / DAY), st = Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY); if (e <= latest && st >= earliest) qs.push(`q:${y}-${q}`); }
    const e = Math.round(Date.UTC(y, 11, 31) / DAY), st = Math.round(Date.UTC(y - 1, 11, 31) / DAY); if (e <= latest && st >= earliest) ys.push(`y:${y}`);
  }
  return { q: qs, y: ys };
}
/* Eilutės grafikui: kiekvienam fondui nuo x0. Fondai, kurie pradėjo vėliau nei x0, grafike nerodomi
   (netikros pradžios vertės nekuriame) – jų sąrašas grąžinamas series.hidden, kad būtų galima paminėti po grafiku. */
function buildSeries(fs, x0, x1) {
  const series = fs.map(f => { const s = seriesOf(f, x0, x1); return s && s.points.length > 1 ? { provider: f.provider, points: s.points } : null; }).filter(Boolean);
  series.hidden = fs.filter(f => f.d[0] > x0 && f.d[0] < x1).map(f => ({ provider: f.provider, start: f.d[0] }));
  return series;
}
/* Grafikas „susispaudžia“ užvedus pelę, kad dešinėje tilptų fondų pavadinimai su galutinėmis reikšmėmis.
   paint(mr) – perpiešia grafiką su nurodyta dešine paraštė. */
function hoverCompress(el, paint) {
  const st = { mr: 16, anim: 0 };
  const go = target => {
    cancelAnimationFrame(st.anim);
    const step = () => { st.mr += (target - st.mr) * 0.35; if (Math.abs(target - st.mr) < 1) st.mr = target; paint(st.mr); if (st.mr !== target) st.anim = requestAnimationFrame(step); };
    st.anim = requestAnimationFrame(step);
  };
  if (!matchMedia('(hover: none)').matches) {
    el.addEventListener('mouseenter', () => { if ((el.clientWidth || 0) > 560) go(150); });
    el.addEventListener('mouseleave', () => go(16));
  }
  return st;
}
addStrings({
  qPlace: 'Quarter', yPlace: 'Year',
  notShown: l => `Not shown on the chart (started later than the period start): ${l}. Pick a shorter period to see them.`,
}, {
  qPlace: 'Ketvirtis', yPlace: 'Metai',
  notShown: l => `Grafike nerodoma (pradėjo vėliau nei laikotarpio pradžia): ${l}. Pasirinkite trumpesnį laikotarpį, kad juos matytumėte.`,
});

/* ---------- Kilimas ir kritimas (run-up / drawdown): rezultatų ir III pakopos puslapiai ----------
   Stulpeliai: kiekvieno laikotarpio (mėnesio, ketvirčio ar metų) didžiausias kilimas nuo žemiausio taško (+)
   ir didžiausias kritimas nuo aukščiausio taško (−) to laikotarpio viduje; lyginami tos pačios grupės fondai.
   Linija: sukaupta grąža nuo pradžios ir kritimas nuo iki tol aukščiausios vertės. */
addStrings({
  rdMode: 'View', rdBars: 'Columns', rdLine: 'Line', rdGran: { m: 'Months', q: 'Quarters', y: 'Years' },
  rdStart: 'From', rdIncep: 'Fund inception', rdDate: 'Chosen date', rdFund: 'Fund', rdAllDd: 'All funds – drawdown only',
  rdUp: 'Max run-up', rdDn: 'Max drawdown', rdCum: 'Cumulative return', rdDdLine: 'Drawdown from peak',
  rdQ: (y, q) => `Q${q} ${y}`,
  rdCapBars: g => `${g}. For every period: the full-colour column = the largest rise of the unit value from its lowest point within that period (run-up); the pale column below zero = the deepest point the unit value reached within that period below its highest value so far since the start (drawdown – the same dips as on the line view). The first period of a fund can be partial. Click a fund to hide or show it; hover for the figures.`,
  rdCapLine: (g, f) => `${g} · ${f}. Cumulative return = change of the unit value since the start; drawdown = how far the unit value is below its highest value so far (0 % = at a new high).`,
  rdCapAll: g => `${g}. Each line = how far the fund’s unit value is below its highest value so far (0 % = at a new high). Click a fund to hide or show it.`,
}, {
  rdMode: 'Rodinys', rdBars: 'Stulpeliai', rdLine: 'Linija', rdGran: { m: 'Mėnesiai', q: 'Ketvirčiai', y: 'Metai' },
  rdStart: 'Nuo', rdIncep: 'Fondo įsteigimo', rdDate: 'Pasirinktos datos', rdFund: 'Fondas', rdAllDd: 'Visi fondai – tik kritimas',
  rdUp: 'Didžiausias kilimas', rdDn: 'Didžiausias kritimas', rdCum: 'Sukaupta grąža', rdDdLine: 'Kritimas nuo viršūnės',
  rdQ: (y, q) => `${y} K${q}`,
  rdCapBars: g => `${g}. Kiekvienam laikotarpiui: ryškus stulpelis – didžiausias vieneto vertės kilimas nuo žemiausio taško to laikotarpio viduje; blyškus stulpelis žemiau nulio – giliausias taškas per tą laikotarpį žemiau iki tol (nuo pradžios) aukščiausios vertės (kritimas – tos pačios duobės kaip linijos rodinyje). Pirmasis fondo laikotarpis gali būti nepilnas. Paspaudus fondą jis paslepiamas arba parodomas; užvedus pelę matyti skaičiai.`,
  rdCapLine: (g, f) => `${g} · ${f}. Sukaupta grąža – vieneto vertės pokytis nuo pradžios; kritimas – kiek vieneto vertė yra žemiau iki tol aukščiausios vertės (0 % = nauja viršūnė).`,
  rdCapAll: g => `${g}. Kiekviena linija – kiek fondo vieneto vertė yra žemiau iki tol aukščiausios vertės (0 % = nauja viršūnė). Paspaudus fondą jis paslepiamas arba parodomas.`,
});
const rdBucket = (day, gran) => { const t = new Date(day * DAY), y = t.getUTCFullYear(), m = t.getUTCMonth(); return gran === 'y' ? y : gran === 'q' ? y * 4 + Math.floor(m / 3) : y * 12 + m; };
const rdBucketLabel = (k, gran) => gran === 'y' ? String(k) : gran === 'q' ? T().rdQ(Math.floor(k / 4), k % 4 + 1) : `${Math.floor(k / 12)}-${String(k % 12 + 1).padStart(2, '0')}`;
function rdBase(f, start) { return !start || start <= f.d[0] ? 0 : lastOnOrBefore(f, start); }   // pradžios vertės indeksas
function rdBars(f, start, gran) {           // Map laikotarpis -> { up, dn } procentais (kaip savininko Excel)
  // up – didžiausias kilimas nuo žemiausios vertės to laikotarpio viduje; dn – giliausias taškas žemiau iki tol aukščiausios vertės (nuo pradžios)
  const out = new Map(), ib = rdBase(f, start); let k = null, lo, up, dn, peak = f.v[ib];
  const flush = () => { if (k !== null) out.set(k, { up: up * 100, dn: dn * 100 }); };
  for (let i = ib + 1; i < f.d.length; i++) {
    const key = rdBucket(f.d[i], gran), v = f.v[i];
    if (key !== k) { flush(); k = key; lo = v; up = dn = 0; }
    lo = Math.min(lo, v); up = Math.max(up, v / lo - 1);
    peak = Math.max(peak, v); dn = Math.min(dn, v / peak - 1);
  }
  flush(); return out;
}
function rdLines(f, start) {                // sukaupta grąža ir kritimas nuo viršūnės
  const ib = rdBase(f, start), base = f.v[ib], cum = [[f.d[ib], 0]], dd = [[f.d[ib], 0]]; let peak = base;
  for (let i = ib + 1; i < f.d.length; i++) { const v = f.v[i]; peak = Math.max(peak, v); cum.push([f.d[i], (v / base - 1) * 100]); dd.push([f.d[i], (v / peak - 1) * 100]); }
  return { cum, dd };
}
/* root – tuščias elementas; groups – [{ id, label, funds }]; key – būsenos raktas naršyklėje */
function runupDrawdown(root, groups, key, defGroup) {
  const SK = 'rdd_' + key; let st = { group: defGroup, mode: 'bar', gran: 'y', start: '', fund: null, off: [] };
  try { Object.assign(st, JSON.parse(localStorage.getItem(SK)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(SK, JSON.stringify(st)); } catch (e) {} };
  const ctl = { render };
  function render() {
    const g = groups.find(x => x.id === st.group) || groups.find(x => x.id === defGroup) || groups[0]; st.group = g.id;
    const funds = g.funds, ids = funds.map(f => f.provider);
    if (st.fund !== 'all' && !ids.includes(st.fund)) st.fund = ids.find(id => /SEB/.test(labelOf(id))) || ids[0];
    const off = new Set(st.off.filter(id => ids.includes(id))), on = funds.filter(f => !off.has(f.provider));
    const first = Math.min(...funds.map(f => f.d[0])), last = Math.max(...funds.map(f => f.d[f.d.length - 1]));
    const startDay = st.start ? Math.max(first, Math.min(dayOf(st.start), last - 1)) : 0;
    const seg = (name, items, cur) => `<div class="seg" role="group" data-k="${name}">${items.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
    const bars = st.mode === 'bar', single = !bars && st.fund !== 'all';
    root.innerHTML = `<div class="tools rdtools">
        <select data-k="group">${groups.map(x => `<option value="${x.id}"${x.id === g.id ? ' selected' : ''}>${x.label}</option>`).join('')}</select>
        ${seg('mode', [['bar', T().rdBars], ['line', T().rdLine]], st.mode)}
        ${bars ? seg('gran', [['m', T().rdGran.m], ['q', T().rdGran.q], ['y', T().rdGran.y]], st.gran) : `<label class="field"><span>${T().rdFund}</span><select data-k="fund"><option value="all">${T().rdAllDd}</option>${funds.map(f => `<option value="${f.provider}"${f.provider === st.fund ? ' selected' : ''}>${labelOf(f.provider)}</option>`).join('')}</select></label>`}
        <label class="field"><span>${T().rdStart}</span><select data-k="start"><option value="">${T().rdIncep}</option><option value="d"${st.start ? ' selected' : ''}>${T().rdDate}</option></select></label>
        ${st.start ? `<input type="date" data-k="date" value="${iso(startDay)}" min="${iso(first)}" max="${iso(last)}">` : ''}
      </div>
      ${single ? '' : `<div class="chips rdchips">${funds.map(f => `<button type="button" class="chip" data-id="${f.provider}" aria-pressed="${!off.has(f.provider)}"><i style="background:${colorOf(f.provider)}"></i>${labelOf(f.provider)}</button>`).join('')}</div>`}
      <div class="cap rdcap"></div><div class="chart rdchart"></div>`;
    const q = s => root.querySelector(s), set = (k, v) => { st[k] = v; save(); render(); };
    q('[data-k=group]').onchange = e => set('group', e.target.value);
    root.querySelectorAll('.seg button').forEach(b => b.onclick = () => set(b.parentNode.dataset.k, b.dataset.v));
    if (q('[data-k=fund]')) q('[data-k=fund]').onchange = e => set('fund', e.target.value);
    q('[data-k=start]').onchange = e => set('start', e.target.value ? iso(Math.max(first, shiftMonths(last, 60))) : '');
    if (q('[data-k=date]')) q('[data-k=date]').onchange = e => { if (e.target.value) set('start', e.target.value); };
    root.querySelectorAll('.rdchips .chip').forEach(b => b.onclick = () => {
      const id = b.dataset.id, s = new Set(st.off); if (s.has(id)) s.delete(id); else if (on.length > 1) s.add(id); set('off', [...s]);
    });
    const el = q('.rdchart'), cap = q('.rdcap');
    ctl.paint = () => {
      if (bars) { cap.textContent = T().rdCapBars(g.label); rdDrawBars(el, on, startDay, st.gran); return; }
      if (single) {
        const f = funds.find(x => x.provider === st.fund), L = rdLines(f, startDay);
        cap.textContent = T().rdCapLine(g.label, labelOf(f.provider));
        drawLineChart(el, [{ provider: 'cum', color: colorOf(f.provider), label: T().rdCum, points: L.cum }, { provider: 'dd', color: 'var(--dneg)', label: T().rdDdLine, points: L.dd }],
          L.cum[0][0], L.cum[L.cum.length - 1][0], { mr: el.clientWidth > 560 ? 190 : 16, fmt: v => pct(v, 2) });
      } else {
        const ser = on.map(f => ({ provider: f.provider, points: rdLines(f, startDay).dd }));
        cap.textContent = T().rdCapAll(g.label);
        drawLineChart(el, ser, Math.min(...ser.map(s => s.points[0][0])), Math.max(...ser.map(s => s.points[s.points.length - 1][0])), { mr: el.clientWidth > 560 ? 150 : 16, fmt: v => pct(v, 2) });
      }
    };
    ctl.paint();
  }
  render();
  return ctl;
}
function rdDrawBars(el, funds, start, gran) {
  el.innerHTML = '';
  const data = funds.map(f => ({ f, m: rdBars(f, start, gran) })), keys = [...new Set(data.flatMap(x => [...x.m.keys()]))].sort((a, b) => a - b);
  if (!keys.length) { el.innerHTML = `<p class="na">${T().noData}</p>`; return; }
  let lo = 0, hi = 0; data.forEach(x => x.m.forEach(v => { lo = Math.min(lo, v.dn); hi = Math.max(hi, v.up); }));
  const ticks = niceTicks(lo, hi); lo = Math.min(lo, ticks[0]); hi = Math.max(hi, ticks[ticks.length - 1]);
  const W = el.clientWidth || 800, H = Math.max(280, Math.min(420, Math.round(W * 0.42))), m = { l: 46, r: 10, t: 10, b: 28 };
  const gw = (W - m.l - m.r) / keys.length, n = data.length, bw = Math.max(1, Math.min(26, gw * 0.84 / n)), X = i => m.l + i * gw + (gw - bw * n) / 2;
  const Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  const lblEvery = Math.max(1, Math.ceil(keys.length / Math.max(1, Math.floor((W - m.l - m.r) / (gran === 'y' ? 40 : gran === 'q' ? 64 : 58)))));
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${T().rdUp} / ${T().rdDn}">`
    + ticks.map(t => `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(t)}" y2="${Y(t)}" stroke="${t === 0 ? 'var(--axis)' : 'var(--grid)'}"/><text x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="var(--text-3)">${num(t, t % 1 ? 1 : 0)}%</text>`).join('')
    + keys.map((k, i) => i % lblEvery ? '' : `<text x="${m.l + (i + 0.5) * gw}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--text-3)">${rdBucketLabel(k, gran)}</text>`).join('')
    + `<rect class="rdhl" x="0" y="${m.t}" width="${gw}" height="${H - m.t - m.b}" fill="var(--hover)" visibility="hidden"/>`;
  keys.forEach((k, i) => data.forEach((x, j) => {
    const v = x.m.get(k); if (!v) return; const bx = (X(i) + j * bw).toFixed(1), w = Math.max(0.6, bw - (bw > 4 ? 1 : 0)).toFixed(1), c = colorOf(x.f.provider);
    svg += `<rect x="${bx}" y="${Y(v.up).toFixed(1)}" width="${w}" height="${Math.max(0, Y(0) - Y(v.up)).toFixed(1)}" fill="${c}"/>`
      + `<rect x="${bx}" y="${Y(0).toFixed(1)}" width="${w}" height="${Math.max(0, Y(v.dn) - Y(0)).toFixed(1)}" fill="${c}" fill-opacity="0.38"/>`;
  }));
  el.innerHTML = svg + '</svg>';
  const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; el.appendChild(tip);
  const hl = el.querySelector('.rdhl'), s = el.querySelector('svg');
  s.onmousemove = e => {
    const r = s.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width), i = Math.floor((px - m.l) / gw);
    if (i < 0 || i >= keys.length) { tip.style.display = 'none'; hl.setAttribute('visibility', 'hidden'); return; }
    const rows = data.map(x => ({ f: x.f, v: x.m.get(keys[i]) })).filter(x => x.v);
    tip.innerHTML = `<b>${rdBucketLabel(keys[i], gran)}</b><div><span></span><span>▲ ${T().rdUp} · ▼ ${T().rdDn}</span></div>` + rows.map(x => `<div><span><span class="sw" style="background:${colorOf(x.f.provider)}"></span>${labelOf(x.f.provider)}</span><span>▲ ${pctPlain(x.v.up, 1)} · ▼ ${pctPlain(x.v.dn, 1)}</span></div>`).join('');
    hl.setAttribute('x', m.l + i * gw); hl.setAttribute('visibility', 'visible'); tip.style.display = 'block';
    const cx = m.l + (i + 0.5) * gw, w = tip.offsetWidth; tip.style.left = (cx + gw / 2 + 8 + w > W ? Math.max(0, cx - gw / 2 - 8 - w) : cx + gw / 2 + 8) + 'px'; tip.style.top = m.t + 'px';
  };
  s.onmouseleave = () => { tip.style.display = 'none'; hl.setAttribute('visibility', 'hidden'); };
}

/* ---------- Neapdorotų duomenų atsisiuntimas (antraštės mygtukas „Duomenys“, visuose puslapiuose) ----------
   Duomenų failai (data.js, data3.js, data_pf.js) įkeliami atskirai ir vykdomi atskiroje funkcijoje, kad nesusimaišytų su puslapio DATA. */
addStrings({
  dlBtn: 'Data', dlWhat: 'What to download', dlNav2: 'Unit values – all Pillar II funds', dlNav3: 'Unit values – all Pillar III funds',
  dlPf: 'Portfolios with instrument details', dlPillar: 'Pillar', dlMgr: 'Manager', dlFund: 'Fund', dlAll: 'All', dlFrom: 'From quarter', dlTo: 'To quarter',
  dlGo: 'Download (.xlsx)', dlBusy: 'Preparing…', dlFail: 'Could not prepare the file (no internet?).',
  dlNoteNav: 'Excel file with two sheets: “Table” – one column per fund, one row per day; “List” – one row per fund and day. Unit values as published by the managers, full history.',
  dlNotePf: 'One row per position per quarter end (Bank of Lithuania reports), with our extra details: asset class, region, emerging markets, index/active, SFDR, TER, currency hedging, and for bonds – maturity, coupon, yield to maturity and duration. Blank = not known.',
  dlCols: { q: 'Quarter end', mgr: 'Manager', pl: 'Pillar', code: 'Fund code', fund: 'Fund', grp: 'Group', pos: 'Position', isin: 'ISIN', issuer: 'Issuer / company', type: 'Type', alt: 'Alternative kind', cty: 'Country', cur: 'Currency', units: 'Units / nominal', val: 'Value, €', w: 'Weight, %', ac: 'Asset class', reg: 'Region', em: 'Emerging markets', ap: 'Approach', sfdr: 'SFDR', ter: 'TER, %', hdg: 'Currency hedged', th: 'Theme', src: 'Source', mat: 'Maturity', cpn: 'Coupon, %', frn: 'Floating rate', ytm: 'Yield to maturity, %', md: 'Modified duration', yrs: 'Years to maturity', date: 'Date', unit: 'Unit value' },
  dlTypes: { e: 'Shares', b: 'Bonds', f: 'Funds & ETFs', c: 'Cash & deposits', d: 'Derivatives' }, dlYes: 'yes', dlNo: 'no', dlCat: { bond: 'Bond', mixed: 'Mixed', equity: 'Equity' },
}, {
  dlBtn: 'Duomenys', dlWhat: 'Ką atsisiųsti', dlNav2: 'Vieneto vertės – visi II pakopos fondai', dlNav3: 'Vieneto vertės – visi III pakopos fondai',
  dlPf: 'Portfeliai su priemonių informacija', dlPillar: 'Pakopa', dlMgr: 'Valdytojas', dlFund: 'Fondas', dlAll: 'Visi', dlFrom: 'Nuo ketvirčio', dlTo: 'Iki ketvirčio',
  dlGo: 'Atsisiųsti (.xlsx)', dlBusy: 'Ruošiama…', dlFail: 'Nepavyko paruošti failo (nėra interneto?).',
  dlNoteNav: 'Excel failas su dviem lapais: „Lentelė“ – kiekvienas fondas atskirame stulpelyje, kiekviena diena eilutėje; „Sąrašas“ – po eilutę kiekvienam fondui ir dienai. Vieneto vertės, kaip jas skelbia valdytojai, visa istorija.',
  dlNotePf: 'Po eilutę kiekvienai pozicijai kiekvieno ketvirčio pabaigoje (Lietuvos banko ataskaitos) su mūsų surinkta papildoma informacija: turto klasė, regionas, besivystančios rinkos, indeksinis / aktyvus, SFDR, TER, valiutos apsauga, o obligacijoms – išpirkimo data, kuponas, pajamingumas iki išpirkimo ir trukmė. Tuščia = nežinoma.',
  dlCols: { q: 'Ketvirčio pabaiga', mgr: 'Valdytojas', pl: 'Pakopa', code: 'Fondo kodas', fund: 'Fondas', grp: 'Grupė', pos: 'Pozicija', isin: 'ISIN', issuer: 'Emitentas / bendrovė', type: 'Tipas', alt: 'Alternatyvios rūšis', cty: 'Šalis', cur: 'Valiuta', units: 'Vienetai / nominalas', val: 'Vertė, €', w: 'Svoris, %', ac: 'Turto klasė', reg: 'Regionas', em: 'Besivystančios rinkos', ap: 'Valdymo būdas', sfdr: 'SFDR', ter: 'TER, %', hdg: 'Valiutos apsauga', th: 'Tema', src: 'Šaltinis', mat: 'Išpirkimo data', cpn: 'Kuponas, %', frn: 'Kintama palūkanų norma', ytm: 'Pajamingumas iki išpirkimo, %', md: 'Modifikuota trukmė', yrs: 'Metai iki išpirkimo', date: 'Data', unit: 'Vieneto vertė' },
  dlTypes: { e: 'Akcijos', b: 'Obligacijos', f: 'Fondai ir ETF', c: 'Pinigai ir indėliai', d: 'Išvestinės' }, dlYes: 'taip', dlNo: 'ne', dlCat: { bond: 'Obligacijų', mixed: 'Mišrus', equity: 'Akcijų' },
});
const DL = { what: 'nav2', pl: 'II', mgr: '', fund: '', q0: null, q1: null, cache: {} };
function dlLoad(file, name) {             // grąžina failo kintamąjį (DATA ar PF), neliečiant puslapio kintamųjų
  if (!DL.cache[file]) DL.cache[file] = fetch(file, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(file); return r.text(); }).then(t => new Function(t + `;return ${name};`)());
  return DL.cache[file];
}
function dlXlsx() { return new Promise((ok, no) => { if (window.XLSX) return ok(); const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
async function dlRender() {
  const p = document.getElementById('dlPanel'), t = T();
  let pf = null; if (DL.what === 'pf') { try { pf = await dlLoad('data_pf.js', 'PF'); } catch (e) { pf = null; } }
  const opt = (v, l, cur) => `<option value="${v}"${v === cur ? ' selected' : ''}>${l}</option>`;
  let extra = '';
  if (pf) {
    const nq = pf.quarters.length; if (DL.q1 === null || DL.q1 >= nq) DL.q1 = nq - 1; if (DL.q0 === null || DL.q0 > DL.q1) DL.q0 = DL.q1;
    const fs = pf.funds.filter(f => (!DL.pl || f.pl === DL.pl) && (!DL.mgr || f.p === DL.mgr)); if (!fs.some(f => f.c === DL.fund)) DL.fund = '';
    const mgrs = [...new Set(pf.funds.map(f => f.p))].sort(), ql = i => pf.quarters[i];
    extra = `<label class="field"><span>${t.dlPillar}</span><select data-k="pl">${opt('', t.dlAll, DL.pl)}${opt('II', 'II', DL.pl)}${opt('III', 'III', DL.pl)}</select></label>
      <label class="field"><span>${t.dlMgr}</span><select data-k="mgr">${opt('', t.dlAll, DL.mgr)}${mgrs.map(m => opt(m, m, DL.mgr)).join('')}</select></label>
      <label class="field"><span>${t.dlFund}</span><select data-k="fund">${opt('', t.dlAll, DL.fund)}${fs.map(f => opt(f.c, f.full || f.n, DL.fund)).join('')}</select></label>
      <label class="field"><span>${t.dlFrom}</span><select data-k="q0">${pf.quarters.map((q, i) => opt(String(i), ql(i), String(DL.q0))).join('')}</select></label>
      <label class="field"><span>${t.dlTo}</span><select data-k="q1">${pf.quarters.map((q, i) => opt(String(i), ql(i), String(DL.q1))).join('')}</select></label>`;
  }
  p.innerHTML = `<label class="field"><span>${t.dlWhat}</span><select data-k="what">${opt('nav2', t.dlNav2, DL.what)}${opt('nav3', t.dlNav3, DL.what)}${opt('pf', t.dlPf, DL.what)}</select></label>
    ${extra}<p class="note">${DL.what === 'pf' ? t.dlNotePf : t.dlNoteNav}</p><button class="btn dlgo" type="button">${t.dlGo}</button>`;
  p.querySelectorAll('select').forEach(sel => sel.addEventListener('change', () => {
    const k = sel.dataset.k; DL[k] = k === 'q0' || k === 'q1' ? +sel.value : sel.value;
    if (k === 'q0' && DL.q1 < DL.q0) DL.q1 = DL.q0; if (k === 'q1' && DL.q0 > DL.q1) DL.q0 = DL.q1;
    dlRender();
  }));
  const go = p.querySelector('.dlgo');
  go.addEventListener('click', async () => {
    go.disabled = true; go.textContent = t.dlBusy;
    try { await dlXlsx(); await (DL.what === 'pf' ? dlPortfolios() : dlNav(DL.what === 'nav3')); }
    catch (e) { alert(t.dlFail); }
    go.disabled = false; go.textContent = t.dlGo;
  });
}
const dlDays = f => f.d || (() => { const d = [f.d0]; f.dd.forEach(x => d.push(d[d.length - 1] + x)); return d; })();
async function dlNav(p3) {
  const D = await dlLoad(p3 ? 'data3.js' : 'data.js', 'DATA'), t = T(), c = t.dlCols;
  const label = id => (D.providers.find(p => p.id === id) || {}).label || id;
  const brand = b => b === 'SWEDBANK' ? 'Swedbank' : b === 'GOINDEX' ? 'Goindex' : b[0] + b.slice(1).toLowerCase().replace(/^eb$/, 'EB');
  const funds = D.groups.flatMap(g => g.funds.map(f => ({ g: p3 ? t.dlCat[g.id] || g.id : g.id, name: f.name, mgr: p3 ? brand(f.brand) : label(f.provider), d: dlDays(f), v: f.v })));
  const days = [...new Set(funds.flatMap(f => f.d))].sort((a, b) => a - b), pos = new Map(days.map((d, i) => [d, i]));
  const wide = [[c.date, ...funds.map(f => f.name)]], grid = days.map(d => [iso(d), ...funds.map(() => null)]);
  funds.forEach((f, j) => f.d.forEach((d, i) => { grid[pos.get(d)][j + 1] = f.v[i]; }));
  const long = [[c.date, c.mgr, c.grp, c.fund, c.unit]];
  funds.forEach(f => f.d.forEach((d, i) => long.push([iso(d), f.mgr, f.g, f.name, f.v[i]])));
  const wb = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet(wide.concat(grid)); ws1['!cols'] = [{ wch: 11 }, ...funds.map(() => ({ wch: 14 }))]; ws1['!freeze'] = { xSplit: 1, ySplit: 1 };
  const ws2 = XLSX.utils.aoa_to_sheet(long); ws2['!cols'] = [{ wch: 11 }, { wch: 12 }, { wch: 10 }, { wch: 48 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, ws1, lang === 'lt' ? 'Lentelė' : 'Table'); XLSX.utils.book_append_sheet(wb, ws2, lang === 'lt' ? 'Sąrašas' : 'List');
  XLSX.writeFile(wb, `${lang === 'lt' ? 'Vieneto_vertes' : 'Unit_values'}_${p3 ? 'III' : 'II'}_${String(D.generated).slice(0, 10)}.xlsx`);
}
async function dlPortfolios() {
  const PF = await dlLoad('data_pf.js', 'PF'), t = T(), c = t.dlCols;
  const bm = {}; Object.entries(PF.bm || {}).forEach(([si, a]) => { const m = bm[si] = new Map(); for (let i = 0; i < a.length; i += 4) m.set(a[i], a.slice(i + 1, i + 4)); });
  const yn = x => x === true || x === 1 || x === '1' || x === 'yes' ? t.dlYes : x === false || x === 0 || x === '0' || x === 'no' ? t.dlNo : (x ?? '');
  const cols = ['q', 'mgr', 'pl', 'code', 'fund', 'grp', 'pos', 'isin', 'issuer', 'type', 'alt', 'cty', 'cur', 'units', 'val', 'w', 'ac', 'reg', 'em', 'ap', 'sfdr', 'ter', 'hdg', 'th', 'src', 'mat', 'cpn', 'frn', 'ytm', 'md', 'yrs'];
  const rows = [cols.map(k => c[k])];
  PF.funds.filter(f => (!DL.pl || f.pl === DL.pl) && (!DL.mgr || f.p === DL.mgr) && (!DL.fund || f.c === DL.fund)).forEach(f => {
    const tot = {}; for (let i = 0; i < f.r.length; i += 4) if (f.r[i] >= DL.q0 && f.r[i] <= DL.q1) tot[f.r[i]] = (tot[f.r[i]] || 0) + f.r[i + 3];
    for (let i = 0; i < f.r.length; i += 4) {
      const qi = f.r[i]; if (qi < DL.q0 || qi > DL.q1) continue;
      const si = f.r[i + 1], s = PF.secs[si], a = s[9] || [], b = s[10] || [], y = bm[si] && bm[si].get(qi);
      rows.push([PF.quarters[qi], f.p, f.pl, f.c, f.full || f.n, f.g || '', s[8] || s[0], s[5] || '', s[8] ? s[0] : '', t.dlTypes[s[1]] || s[1], s[7] || '', s[2] || '', s[3] || '',
        f.r[i + 2], f.r[i + 3], tot[qi] ? +(f.r[i + 3] / tot[qi] * 100).toFixed(4) : null,
        a[0] || '', a[1] || '', yn(a[2]), a[3] || '', a[4] || '', a[5] ?? '', yn(a[6]), a[7] || '', a[8] || '',
        b[0] || '', b[1] ?? '', b.length ? yn(b[2]) : '', y ? y[0] : '', y && y[1] !== null ? y[1] : '', y ? y[2] : '']);
    }
  });
  const ws = XLSX.utils.aoa_to_sheet(rows), wb = XLSX.utils.book_new();
  ws['!cols'] = cols.map(k => ({ wch: { fund: 40, pos: 40, issuer: 28, src: 30 }[k] || 12 })); ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: cols.length - 1 } }) };
  XLSX.utils.book_append_sheet(wb, ws, lang === 'lt' ? 'Portfeliai' : 'Portfolios');
  const tag = [DL.pl, DL.fund || DL.mgr].filter(Boolean).join('_').replace(/[^\w-]+/g, '-');
  XLSX.writeFile(wb, `${lang === 'lt' ? 'Portfeliai' : 'Portfolios'}${tag ? '_' + tag : ''}_${PF.quarters[DL.q0]}_${PF.quarters[DL.q1]}.xlsx`);
}
