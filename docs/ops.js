/* „Duomenų kalendorius“ (savininko užduotis 2026-10-16): kada kokie duomenys atkeliavo, kas nepavyko ir kada vėl veikė,
   kada valdytojai paskelbia vertes, kokie atnaujinimai laukia ateityje ir ką reikia įkelti ranka (su nuorodomis).
   Duomenys – data_ops.js (build_site.build_ops iš data/ops_log.csv ir sources_list.py). */
addStrings({ navOps: 'Data calendar' }, { navOps: 'Duomenų kalendorius' });
const OS = {
  lt: {
    kToday: 'Šiandien atkeliavo', kTodayS: n => `${n} įvykių`, kFail: 'Nesėkmės per 7 d.', kFailS: n => n ? `${n} šaltinių` : 'nėra', kNext: 'Artimiausias laukiamas', kMan: 'Rankiniai darbai per 30 d.',
    kManS: n => n ? 'žr. „Artėja“' : 'nėra',
    hCal: 'Kalendorius', nCal: 'Kiekviena diena: kas atkeliavo (žalia), kas nepavyko (raudona), ko laukiama (punktyras) ir ką reikia padaryti ranka (oranžinis punktyras). Paspauskite dieną – apačioje bus visi tos dienos įvykiai.',
    today: 'Šiandien', dw: ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'],
    lg: [['new', 'Atkeliavo nauji duomenys'], ['fail', 'Nepavyko'], ['ok', 'Vėl veikia'], ['due', 'Laukiama (automatiškai)'], ['man', 'Reikia įkelti ranka']],
    hDay: d => `Diena: ${d}`, th: ['Laikas', 'Šaltinis', 'Įvykis', 'Duomenų diena', 'Eilučių', 'Pastaba'], noEv: 'Šią dieną įvykių nėra.',
    ev: { new: 'atkeliavo', fail: 'nepavyko', ok: 'vėl veikia', due: 'laukiama', man: 'reikia įkelti ranka' },
    hArr: 'Kada valdytojai paskelbia vertes', nArr: 'Laikas, kada mūsų rinkimas pirmą kartą rado naują vertę (Vilniaus laiku). Tikrinama darbo dienomis kas 30 min. 14:07–19:37 ir 07:37 ryte, todėl tikrasis paskelbimo laikas – iki 30 min. anksčiau (ryte – nuo vakaro). „+1 d.“ – rasta kitą dieną.',
    thP: 'Valdytojas', thMed: 'Įprastai', thDd: 'Vertė už',
    hUp: 'Artėja: laukiami duomenys ir darbai', nUp: '120 dienų į priekį ir pavėluoti. Automatiniai atsisiunčiami patys; „Rankiniu būdu“ – darbas svetainės prižiūrėtojui.',
    thUp: ['Iki', 'Kas', 'Kaip', 'Ką daryti'], auto: 'Automatiškai', man: 'Rankiniu būdu', late: 'vėluoja', open: 'Šaltinis ↗',
    hFail: 'Nesėkmės', nFail: 'Paskutinės 60 dienų. Priežastis – iš rinkimo klaidos; „vėl veikia“ – kada šaltinis vėl atsakė.', thF: ['Kada', 'Šaltinis', 'Priežastis', 'Vėl veikia'], noFail: 'Nesėkmių nebuvo.', still: 'dar neveikia',
    src: { nav: 'II pakopa', p3: 'III pakopa', idx: 'Indeksas', cpi: 'Infliacija (VKI)', estr: '€STR', 'lb.pf': 'LB portfelių ataskaita', 'lb.lbr': 'LB rezultatų ataskaita', 'lb.fee': 'LB mokesčiai', lb: 'Lietuvos banko failai', proxy: 'Luminor proxy', pens: 'Vidutinė pensija', wages: 'Vidutinis atlyginimas', fee: 'Mokesčiai' },
    navAll: n => `II pakopa ${n}/6`, p3n: n => `III pakopa ${n}`, idxN: 'Indeksai', more: n => `+${n}`, nextDay: '+1 d.',
  },
  en: {
    kToday: 'Arrived today', kTodayS: n => `${n} events`, kFail: 'Failures in 7 days', kFailS: n => n ? `${n} sources` : 'none', kNext: 'Next expected', kMan: 'Manual tasks in 30 days',
    kManS: n => n ? 'see “Coming up”' : 'none',
    hCal: 'Calendar', nCal: 'Each day: what arrived (green), what failed (red), what is expected (dashed) and what has to be done by hand (orange dashed). Click a day to list its events below.',
    today: 'Today', dw: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    lg: [['new', 'New data arrived'], ['fail', 'Failed'], ['ok', 'Working again'], ['due', 'Expected (automatic)'], ['man', 'Manual upload needed']],
    hDay: d => `Day: ${d}`, th: ['Time', 'Source', 'Event', 'Data date', 'Rows', 'Note'], noEv: 'No events on this day.',
    ev: { new: 'arrived', fail: 'failed', ok: 'working again', due: 'expected', man: 'manual upload' },
    hArr: 'When managers publish their values', nArr: 'Time our collection first found a new value (Vilnius time). Checked on business days every 30 min 14:07–19:37 and at 07:37, so the real publication time is up to 30 min earlier (in the morning – since the evening). “+1 d.” – found the next day.',
    thP: 'Manager', thMed: 'Usually', thDd: 'Value for',
    hUp: 'Coming up: expected data and tasks', nUp: '120 days ahead plus overdue. Automatic ones download themselves; “Manual” – a task for the site maintainer.',
    thUp: ['By', 'What', 'How', 'What to do'], auto: 'Automatic', man: 'Manual', late: 'overdue', open: 'Source ↗',
    hFail: 'Failures', nFail: 'Last 60 days. Reason – from the collection error; “working again” – when the source answered again.', thF: ['When', 'Source', 'Reason', 'Working again'], noFail: 'No failures.', still: 'still failing',
    src: { nav: 'Pillar II', p3: 'Pillar III', idx: 'Index', cpi: 'Inflation (CPI)', estr: '€STR', 'lb.pf': 'BoL portfolio report', 'lb.lbr': 'BoL results report', 'lb.fee': 'BoL fees', lb: 'Bank of Lithuania files', proxy: 'Luminor proxy', pens: 'Average pension', wages: 'Average wage', fee: 'Fees' },
    navAll: n => `Pillar II ${n}/6`, p3n: n => `Pillar III ${n}`, idxN: 'Indices', more: n => `+${n}`, nextDay: '+1 d.',
  },
};
const O = () => OS[lang] || OS.lt;
const $ = id => document.getElementById(id);
const VILNIUS = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Vilnius', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
const loc = ts => { const s = VILNIUS.format(new Date(ts + ':00Z')); return { day: s.slice(0, 10), hm: s.slice(11, 16) }; };
const todayLoc = () => VILNIUS.format(new Date()).slice(0, 10);
const dayNum = s => Math.round(Date.parse(s.slice(0, 10) + 'T00:00:00Z') / DAY);
const PROV = Object.fromEntries((OPS.prov || []).map(p => [p.id, p.label]));
function srcLabel(k) {
  const o = O(), [a, b] = k.split('.');
  if ((a === 'nav' || a === 'p3') && b) return `${o.src[a]} · ${PROV[b] || b.charAt(0) + b.slice(1).toLowerCase()}`;
  if (a === 'idx' && b) return `${o.src.idx} ${({ MSCI_WORLD: 'MSCI World', MSCI_ACWI: 'MSCI ACWI', SP500: 'S&P 500', SP500_PR: 'S&P 500 (kainų)', EURUSD: 'EUR/USD', EUR_GOV7Y: 'euro obligacijų' })[b] || b}`;
  return o.src[k] || o.src[a] || k;
}
const EV = (OPS.ev || []).map(([ts, src, ev, dd, n, msg]) => ({ ts, src, ev, dd, n, msg, ...loc(ts) }));
const byDay = {}; EV.forEach(e => (byDay[e.day] = byDay[e.day] || []).push(e));
const DAILY = new Set(['nav', 'p3', 'idx', 'estr', 'isin']);       // kasdieniai – jų būklę rodo kalendorius ir pranešimai, ne „Artėja“
const UP = (OPS.up || []).filter(s => s.next != null && !DAILY.has(s.id)).map(s => ({ ...s, due: iso(s.next), over: s.mode === 'manual' ? dayNum(todayLoc()) > s.next : false }));
const upByDay = {}; UP.forEach(s => (upByDay[s.due] = upByDay[s.due] || []).push(s));
let VIEW = todayLoc().slice(0, 7), SEL = todayLoc();
function chipsOf(day) {
  const o = O(), ev = byDay[day] || [], out = [];
  const nav = new Set(ev.filter(e => e.ev === 'new' && e.src.startsWith('nav.')).map(e => e.src)), p3 = new Set(ev.filter(e => e.ev === 'new' && e.src.startsWith('p3.')).map(e => e.src));
  if (nav.size) out.push(['new', o.navAll(nav.size)]);
  if (p3.size) out.push(['new', o.p3n(p3.size)]);
  if (ev.some(e => e.ev === 'new' && e.src.startsWith('idx.'))) out.push(['new', o.idxN]);
  ev.filter(e => e.ev === 'new' && !/^(nav|p3|idx)\./.test(e.src)).forEach(e => out.push(['new', srcLabel(e.src)]));
  [...new Set(ev.filter(e => e.ev === 'fail').map(e => e.src))].forEach(s => out.push(['fail', '⚠ ' + srcLabel(s)]));
  [...new Set(ev.filter(e => e.ev === 'ok').map(e => e.src))].forEach(s => out.push(['ok', '✓ ' + srcLabel(s)]));
  (upByDay[day] || []).forEach(s => out.push([s.mode === 'manual' ? 'man' : 'due', lang === 'lt' ? s.lt : s.en]));
  return out;
}
function renderCal() {
  const o = O(), [y, m] = VIEW.split('-').map(Number), first = new Date(Date.UTC(y, m - 1, 1)), start = new Date(first); start.setUTCDate(1 - ((first.getUTCDay() + 6) % 7));
  $('mon').textContent = first.toLocaleDateString(T().locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  let h = o.dw.map(d => `<div class="dw">${d}</div>`).join('');
  for (let i = 0; i < 42; i++) {
    const d = new Date(start); d.setUTCDate(start.getUTCDate() + i); const s = d.toISOString().slice(0, 10), wd = d.getUTCDay();
    if (i >= 35 && d.getUTCMonth() !== m - 1) break;
    const ch = chipsOf(s), show = ch.slice(0, 4);
    h += `<button type="button" class="d${d.getUTCMonth() !== m - 1 ? ' out' : ''}${wd === 0 || wd === 6 ? ' we' : ''}${s === todayLoc() ? ' today' : ''}${s === SEL ? ' sel' : ''}" data-d="${s}" aria-label="${s}"><span class="n">${d.getUTCDate()}</span>`
      + show.map(([k, t]) => `<span class="chip ${k}" title="${hEsc(t)}">${hEsc(t)}</span>`).join('') + (ch.length > 4 ? `<span class="chip">${o.more(ch.length - 4)}</span>` : '') + '</button>';
  }
  $('cal').innerHTML = h;
  $('cal').querySelectorAll('.d').forEach(b => b.onclick = () => { SEL = b.dataset.d; renderCal(); renderDay(); });
}
function renderDay() {
  const o = O(), ev = (byDay[SEL] || []).slice().sort((a, b) => a.ts.localeCompare(b.ts)), up = upByDay[SEL] || [];
  $('hDay').textContent = o.hDay(SEL);
  if (!ev.length && !up.length) { $('tDay').innerHTML = `<tbody><tr><td>${o.noEv}</td></tr></tbody>`; return; }
  $('tDay').innerHTML = `<thead><tr>${o.th.map((x, i) => `<th${i === 4 ? ' class="n"' : ''}>${x}</th>`).join('')}</tr></thead><tbody>`
    + ev.map(e => `<tr class="${e.ev === 'fail' ? 'fail' : ''}"><td class="t">${e.hm}</td><td>${hEsc(srcLabel(e.src))}</td><td>${o.ev[e.ev] || e.ev}</td><td class="t">${e.dd || ''}</td><td class="n">${e.n || ''}</td><td>${hEsc(e.msg || '')}</td></tr>`).join('')
    + up.map(s => `<tr><td class="t">–</td><td>${hEsc(lang === 'lt' ? s.lt : s.en)}</td><td>${o.ev[s.mode === 'manual' ? 'man' : 'due']}</td><td></td><td></td><td>${hEsc((lang === 'lt' ? s.how_lt : s.how_en) || (lang === 'lt' ? s.f_lt : s.f_en) || '')}${s.url ? ` <a href="${hEsc(s.url)}" target="_blank" rel="noopener">${o.open}</a>` : ''}</td></tr>`).join('') + '</tbody>';
}
function renderArr() {
  const o = O(), first = {};                              // šaltinis|duomenų diena → pirmas radimas
  EV.filter(e => e.ev === 'new' && /^(nav|p3)\./.test(e.src) && e.dd).forEach(e => { const k = e.src + '|' + e.dd; if (!first[k] || e.ts < first[k].ts) first[k] = e; });
  const dds = [...new Set(EV.filter(e => e.ev === 'new' && e.src.startsWith('nav.') && e.dd).map(e => e.dd))].sort().slice(-12);
  const srcs = [...new Set(EV.filter(e => /^(nav|p3)\./.test(e.src)).map(e => e.src))].sort((a, b) => (a.startsWith('nav') ? 0 : 1) - (b.startsWith('nav') ? 0 : 1) || a.localeCompare(b));
  const mins = hm => { const [h, m] = hm.split(':').map(Number); return h * 60 + m; };
  const cell = (s, dd) => { const e = first[s + '|' + dd]; if (!e) return { t: '–' }; const lag = dayNum(e.day) - dayNum(dd), bd = businessDaysBetween(dayNum(dd), dayNum(e.day));
    return { t: e.hm + (bd > 1 ? ` <small>+${bd - 1} d.</small>` : ''), m: bd <= 1 && lag >= 1 ? mins(e.hm) : null }; };
  const med = xs => { const a = xs.filter(x => x != null).sort((x, y) => x - y); if (!a.length) return '–'; const v = a[a.length >> 1]; return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`; };
  $('tArr').innerHTML = `<thead><tr><th>${o.thP}</th><th class="n">${o.thMed}</th>${dds.map(d => `<th class="n">${d.slice(5)}</th>`).join('')}</tr></thead><tbody>`
    + srcs.map(s => { const cs = dds.map(d => cell(s, d)); return `<tr><td>${hEsc(srcLabel(s))}</td><td class="n"><b>${med(cs.map(c => c.m))}</b></td>${cs.map(c => `<td class="c">${c.t}</td>`).join('')}</tr>`; }).join('') + '</tbody>';
}
function renderUp() {
  const o = O(), now = dayNum(todayLoc());
  const rows = UP.filter(s => s.next <= now + 120 && (s.next >= now - 365)).sort((a, b) => a.next - b.next);
  $('tUp').innerHTML = `<thead><tr>${o.thUp.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>`
    + rows.map(s => `<tr class="${s.over ? 'late' : ''}"><td class="t">${s.due}${s.over ? ' ⚠ ' + o.late : ''}</td><td>${hEsc(lang === 'lt' ? s.lt : s.en)}</td>`
      + `<td>${s.mode === 'manual' ? `<span class="tag man">${o.man}</span>` : `<span class="tag">${o.auto}</span>`}</td>`
      + `<td>${hEsc((lang === 'lt' ? s.how_lt : s.how_en) || (lang === 'lt' ? s.f_lt : s.f_en) || '')}${s.url ? ` <a href="${hEsc(s.url)}" target="_blank" rel="noopener">${o.open}</a>` : ''}</td></tr>`).join('') + '</tbody>';
}
function renderFail() {
  const o = O(), cut = dayNum(todayLoc()) - 60, fails = EV.filter(e => e.ev === 'fail' && dayNum(e.day) >= cut).sort((a, b) => b.ts.localeCompare(a.ts));
  if (!fails.length) { $('tFail').innerHTML = `<tbody><tr><td>${o.noFail}</td></tr></tbody>`; return; }
  $('tFail').innerHTML = `<thead><tr>${o.thF.map(x => `<th>${x}</th>`).join('')}</tr></thead><tbody>`
    + fails.map(e => { const rec = EV.find(x => x.src === e.src && x.ts > e.ts && (x.ev === 'ok' || x.ev === 'new'));
      return `<tr><td class="t">${e.day} ${e.hm}</td><td>${hEsc(srcLabel(e.src))}</td><td>${hEsc(e.msg)}</td><td class="t">${rec ? rec.day + ' ' + rec.hm : `<b style="color:var(--dneg)">${o.still}</b>`}</td></tr>`; }).join('') + '</tbody>';
}
function renderKpis() {
  const o = O(), t = todayLoc(), now = dayNum(t), evT = byDay[t] || [], f7 = new Set(EV.filter(e => e.ev === 'fail' && dayNum(e.day) > now - 7).map(e => e.src));
  const nx = UP.filter(s => s.next >= now).sort((a, b) => a.next - b.next)[0], man = UP.filter(s => s.mode === 'manual' && s.next <= now + 30);
  const k = (l, v, s) => `<div class="k"><div class="l">${l}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
  $('kpis').innerHTML = k(o.kToday, evT.filter(e => e.ev === 'new').length, o.kTodayS(evT.length)) + k(o.kFail, f7.size, o.kFailS(f7.size))
    + k(o.kNext, nx ? nx.due : '–', nx ? hEsc(lang === 'lt' ? nx.lt : nx.en) : '') + k(o.kMan, man.length, o.kManS(man.length));
}
function render() {
  const o = O();
  $('hCal').textContent = o.hCal; $('nCal').textContent = o.nCal; $('todayB').textContent = o.today;
  $('lgd').innerHTML = o.lg.map(([k, t]) => `<span><span class="chip ${k}">&nbsp;&nbsp;&nbsp;</span>${t}</span>`).join('');
  $('hArr').textContent = o.hArr; $('nArr').textContent = o.nArr; $('hUp').textContent = o.hUp; $('nUp').textContent = o.nUp; $('hFail').textContent = o.hFail; $('nFail').textContent = o.nFail;
  renderKpis(); renderCal(); renderDay(); renderArr(); renderUp(); renderFail();
}
$('prev').onclick = () => { const [y, m] = VIEW.split('-').map(Number), d = new Date(Date.UTC(y, m - 2, 1)); VIEW = d.toISOString().slice(0, 7); renderCal(); };
$('next').onclick = () => { const [y, m] = VIEW.split('-').map(Number), d = new Date(Date.UTC(y, m, 1)); VIEW = d.toISOString().slice(0, 7); renderCal(); };
$('todayB').onclick = () => { VIEW = todayLoc().slice(0, 7); SEL = todayLoc(); renderCal(); renderDay(); };
renderHeader('ops', render);
render();
