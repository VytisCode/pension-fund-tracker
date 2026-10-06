/* Bendras kodas visiems puslapiams: kalba, tema, antraštė, pagalbinės funkcijos, linijinė diagrama. */
const DAY = 86400000;
const iso = d => new Date(d * DAY).toISOString().slice(0, 10);
const dayOf = s => Math.round(Date.parse(s + 'T00:00:00Z') / DAY);

const I18N = {
  en: {
    siteTitle: 'Pension fund tracker', theme: 'Theme', period: 'Period', locale: 'en-GB',
    navOverview: 'Overview', navPerformance: 'Performance & peers', navPillar3: 'Pillar III',
    thProvider: 'Provider', thReturn: 'Return', thUnit: 'Unit value', thAssets: 'Net assets, € m',
    dataUntil: 'Data until', updated: 'updated', noNew: 'no new data', noData: 'Not enough data for this period.',
    chartLabel: 'Return over the selected period', born: 'Born', turto: 'Payout',
    periods: { '1m': '1 mo', '3m': '3 mo', '6m': '6 mo', ytd: 'YTD', '1y': '1 yr', '3y': '3 yr', '5y': '5 yr', max: 'All history', custom: 'Custom' },
  },
  lt: {
    siteTitle: 'Pensijų fondų sekimas', theme: 'Tema', period: 'Laikotarpis', locale: 'lt-LT',
    navOverview: 'Apžvalga', navPerformance: 'Rezultatai ir palyginimas', navPillar3: 'III pakopa',
    thProvider: 'Tiekėjas', thReturn: 'Grąža', thUnit: 'Vieneto vertė', thAssets: 'Aktyvai, mln. €',
    dataUntil: 'Duomenys iki', updated: 'atnaujinta', noNew: 'nėra naujų duomenų', noData: 'Šiam laikotarpiui duomenų nepakanka.',
    chartLabel: 'Grąžos kitimas pasirinktu laikotarpiu', born: 'Gimę', turto: 'Turto išsaugojimo',
    periods: { '1m': '1 mėn.', '3m': '3 mėn.', '6m': '6 mėn.', ytd: 'Šie metai', '1y': '1 m.', '3y': '3 m.', '5y': '5 m.', max: 'Visa istorija', custom: 'Pasirinktas' },
  },
};
function addStrings(en, lt) { Object.assign(I18N.en, en); Object.assign(I18N.lt, lt); }

let lang = 'en';                        // numatytoji kalba – anglų
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
function renderHeader(active, onLang) {
  const h = document.getElementById('top');
  h.innerHTML = `<div><h1 id="title"></h1><div class="sub" id="sub"></div>
    <nav class="nav"><a href="performance.html" data-p="performance"></a><a href="overview.html" data-p="overview"></a><a href="pillar3.html" data-p="pillar3"></a></nav></div>
    <div class="top-tools"><div class="seg" id="lang" role="group" aria-label="Language">
      <button type="button" data-lang="en">EN</button><button type="button" data-lang="lt">LT</button></div>
      <div class="seg" id="theme" role="group">
        <button type="button" data-theme="light"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>
        <button type="button" data-theme="dark"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg></button></div></div>`;
  const apply = () => {
    document.documentElement.lang = lang;
    document.title = T().siteTitle;
    document.getElementById('title').textContent = T().siteTitle;
    const el = document.documentElement, dark = el.dataset.theme === 'dark' || (!el.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const tb = document.getElementById('theme'); tb.setAttribute('aria-label', T().theme);
    tb.querySelectorAll('button').forEach(b => { b.setAttribute('aria-pressed', (b.dataset.theme === 'dark') === dark); b.title = b.dataset.theme === 'dark' ? (lang === 'lt' ? 'Tamsi tema' : 'Dark theme') : (lang === 'lt' ? 'Šviesi tema' : 'Light theme'); b.setAttribute('aria-label', b.title); });
    h.querySelector('[data-p="overview"]').textContent = T().navOverview;
    h.querySelector('[data-p="performance"]').textContent = T().navPerformance;
    h.querySelector('[data-p="pillar3"]').textContent = T().navPillar3;
    h.querySelectorAll('.nav a').forEach(a => a.removeAttribute('aria-current'));
    h.querySelector(`.nav a[data-p="${active}"]`).setAttribute('aria-current', 'page');
    h.querySelectorAll('#lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
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
  apply();
  return apply;
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
  const wide = W > 560, m = { l: 46, r: opts.mr ?? 16, t: opts.events && opts.events.length ? 26 : 10, b: 26 };
  if (!series.length || x1 <= x0) { el.insertAdjacentHTML('beforeend', `<p class="na">${T().noData}</p>`); return null; }
  const els = {};                               // provider -> [elementai] paryškinimui
  let lo = 0, hi = 0;
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
    const tx = add('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end', fill: 'var(--text-3)', 'font-size': 11 }); tx.textContent = num(t, t % 1 ? 1 : 0) + (opts.axisUnit || '%');
  });
  const years = (x1 - x0) / 365, ticks = [], cur = new Date(x0 * DAY);
  if (years > 5) { for (let y = cur.getUTCFullYear() + 1; Date.UTC(y, 0, 1) / DAY < x1; y += years > 6 ? 2 : 1) ticks.push([Math.round(Date.UTC(y, 0, 1) / DAY), String(y)]); }
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
    (els[r.provider] = els[r.provider] || []).push(add('path', { d: path, fill: 'none', stroke: colorOf(r.provider), 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }));
  });
  if (wide) {                                  // tiesioginės žymos dešinėje be persidengimo
    const labels = series.map(r => ({ r, y: Y(r.points[r.points.length - 1][1]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + 13);
    labels.forEach(l => {
      const c = add('circle', { cx: X(x1), cy: Y(l.r.points[l.r.points.length - 1][1]), r: 3.5, fill: colorOf(l.r.provider), stroke: 'var(--card)', 'stroke-width': 2 });
      const t = add('text', { class: 'endlab', x: W - m.r + 8, y: l.y + 4, fill: 'var(--text-2)', 'font-size': 12, style: opts.onPick ? 'cursor:pointer' : 'cursor:default' });
      if (opts.onPick) t.addEventListener('click', () => opts.onPick(l.r.provider)); t.textContent = labelOf(l.r.provider) + ' ';
      const tv = add('tspan', { 'font-weight': 700, fill: 'var(--text)' }, t); tv.textContent = pct(l.r.points[l.r.points.length - 1][1], 1).replace(' %', '%');
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
    tip.innerHTML = `<b>${iso(day)}</b>` + vals.map(o => `<div><span><span class="sw" style="background:${colorOf(o.r.provider)}"></span>${labelOf(o.r.provider)}</span><span>${pct(o.v).replace(' %', opts.unit || ' %')}</span></div>`).join('');
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
