/* ---------- Uždarbis eurais (savininkas 2026-10-21: „kiek šiandien pensijų fondas, valdytojas arba visa pakopos rinka uždirbo
   arba prarado eurų iš investicijų … kasdien, ketvirtį ar metus … prieš reformą ir dabar“) ----------
   Duomenys – docs/data_earn.js (earnings.py): fondo dienos uždarbis = turtas ankstesnę dieną × (vieneto vertė ÷ ankstesnė − 1).
   Įmokos, perėjimai ir išmokos uždarbio nekeičia. Kur kasdienio turto nėra – paskutinis žinomas turtas, perskaičiuotas pagal vieneto
   vertę (įvertis, jo dalis rodoma). Ketvirčiai be pilnų kasdienių duomenų (iki 2019 IV ketv.) – LB ketvirčio įvertis. */
addStrings({ eu: {
  title: 'Gains in euros', lead: 'How many euros pension funds earned or lost from investments – per day, month, quarter or year. Contributions, switches and reform payouts are not gains: they change only the assets. Even a small daily return of 0.02 % is millions of euros for the whole market.',
  pl: { II: 'Pillar II', III: 'Pillar III', all: 'II + III' }, scope: 'Whose gains:', mkt: 'Whole market', mgrs: 'Managers', fnds: 'Funds',
  gran: { d: 'Day', m: 'Month', q: 'Quarter', y: 'Year' }, per: { '1m': '1 mo', '3m': '3 mo', '1y': '1 yr', '3y': '3 yr', all: 'All' },
  who: (pl, sc) => sc ? sc : pl === 'all' ? 'pillar II and III funds' : `pillar ${pl} funds`,
  whoS: (pl, sc) => sc ? `${sc} funds` : pl === 'all' ? 'Pillar II and III funds' : `Pillar ${pl} funds`,
  verb: v => v >= 0 ? 'earned' : 'lost',
  kDay: d => `Last day (${d})`, kMon: 'This month', kQ: 'This quarter', kY: 'This year', kAvg: 'Average per working day', kOne: '1 % of return now equals',
  sDay: (w, d, v, r) => `On ${d} ${w} ${v >= 0 ? 'earned' : 'lost'} ${mMn(Math.abs(v))} from investments (return ${pctPlain(r)}).`,
  sPer: (w, p, d0, d1, v, r) => `${p} (${d0} – ${d1}) ${w} ${v >= 0 ? 'earned' : 'lost'} ${mMn(Math.abs(v))} from investments (return ${pctPlain(r)}).`,
  pMon: 'This month', pQ: 'This quarter', pY: 'This year',
  sAvg: (w, y, a, py, pa) => `In ${y} ${w} on average ${a >= 0 ? 'earned' : 'lost'} ${mMn(Math.abs(a))} per working day; in ${py} – ${pa >= 0 ? '' : 'lost '}${mMn(Math.abs(pa))}.`,
  sRef: (w, a, b, r0, r1) => ` Before the reform (Oct 2019 – Dec 2025) – ${mMn(a)} per working day on average (return ${pctPlain(r0)} a year), since the reform (2026) – ${mMn(b)} (${pctPlain(r1)} over the period).`,
  sOne: (d, a, d0, b) => `On ${d} a 1 % return equals ${mMn(a)} for these funds; at the end of 2025 (before the reform payouts) it was ${mMn(b)}. So the same return now gives ${a < b ? 'fewer' : 'more'} euros: the euro amount depends on the assets as much as on the return.`,
  chart: 'Investment gain, € m', reform: 'Reform', lbEst: 'lighter bars – Bank of Lithuania quarterly estimate', estN: p => `For ${p} of the assets daily net assets are not published – the last known assets were scaled by the unit value change (estimate).`,
  tip: (p, v, r) => `${p}: ${mSMn(v)}${r != null ? ` (${pct(r)})` : ''}`,
  th: ['Year', 'Gain, € m', 'Working days', 'Average per day, € m', 'Average per month, € m', 'Best day', 'Worst day', 'Days with a gain', 'Return'],
  tbl: 'By year', part: 'part of the year', qOf: (n, m) => `${n} of ${m} quarters`, lbRow: 'LB estimate',
  note: 'Gain of a fund on a day = its net assets on the previous day × (unit value ÷ previous unit value − 1). Unit values are after fees. The market, manager and pillar figures are sums over funds. Quarters before October 2019 (pillar II) or without full daily data are estimated from Bank of Lithuania quarterly reports: quarter return × (assets at start + assets at end) ÷ 2 ÷ (1 + return ÷ 2). Return over a period – daily returns chained, weighted by assets. Fund-level daily data – the last 400 days.',
  fundDays: 'Fund-level daily values are kept for the last 400 days; choose a month, quarter or year for a longer history.',
  xl: 'Excel with calculations', shD: 'Days by fund', shP: 'Periods', shM: 'Method',
  xh: ['Date', 'Pillar', 'Manager', 'Fund', 'Unit value the day before', 'Unit value', 'Net assets the day before, € m', 'Assets estimated (1 = yes)', 'Gain, € m', 'Return'],
  ph: ['Period', 'Gain, € m', 'Return', 'Source'], srcD: 'daily data', srcLB: 'LB quarterly estimate',
  none: 'No data for this choice.' } }, { eu: {
  title: 'Uždarbis eurais', lead: 'Kiek eurų pensijų fondai uždirbo ar prarado iš investicijų – per dieną, mėnesį, ketvirtį ar metus. Įmokos, perėjimai ir reformos išmokos nėra uždarbis: jie keičia tik turtą. Net maža 0,02 % dienos grąža visai rinkai – milijonai eurų.',
  pl: { II: 'II pakopa', III: 'III pakopa', all: 'II + III' }, scope: 'Kieno uždarbis:', mkt: 'Visa rinka', mgrs: 'Valdytojai', fnds: 'Fondai',
  gran: { d: 'Diena', m: 'Mėnuo', q: 'Ketvirtis', y: 'Metai' }, per: { '1m': '1 mėn.', '3m': '3 mėn.', '1y': '1 metai', '3y': '3 metai', all: 'Visi' },
  who: (pl, sc) => sc ? `${sc} fondai` : pl === 'all' ? 'II ir III pakopos fondai' : `${pl} pakopos fondai`,
  whoS: (pl, sc) => sc ? `${sc} fondai` : pl === 'all' ? 'II ir III pakopos fondai' : `${pl} pakopos fondai`,
  verb: v => v >= 0 ? 'uždirbo' : 'prarado',
  kDay: d => `Paskutinė diena (${d})`, kMon: 'Šį mėnesį', kQ: 'Šį ketvirtį', kY: 'Šiais metais', kAvg: 'Vidutiniškai per darbo dieną', kOne: '1 % grąžos dabar –',
  sDay: (w, d, v, r) => `${d} ${w} iš investicijų ${v >= 0 ? 'uždirbo' : 'prarado'} ${mMn(Math.abs(v))} (grąža ${pctPlain(r)}).`,
  sPer: (w, p, d0, d1, v, r) => `${p} (${d0} – ${d1}) ${w} iš investicijų ${v >= 0 ? 'uždirbo' : 'prarado'} ${mMn(Math.abs(v))} (grąža ${pctPlain(r)}).`,
  pMon: 'Šį mėnesį', pQ: 'Šį ketvirtį', pY: 'Šiais metais',
  sAvg: (w, y, a, py, pa) => `${y} m. ${w} per darbo dieną vidutiniškai ${a >= 0 ? 'uždirbo' : 'prarado'} ${mMn(Math.abs(a))}, ${py} m. – ${pa >= 0 ? '' : 'prarado '}${mMn(Math.abs(pa))}.`,
  sRef: (w, a, b, r0, r1) => ` Prieš reformą (2019 m. spalis – 2025 m. gruodis) – vidutiniškai ${mMn(a)} per darbo dieną (grąža ${pctPlain(r0)} per metus), nuo reformos (2026 m.) – ${mMn(b)} (${pctPlain(r1)} per laikotarpį).`,
  sOne: (d, a, d0, b) => `${d} šių fondų 1 % grąžos – ${mMn(a)}; 2025 m. pabaigoje (prieš reformos išmokas) buvo ${mMn(b)}. Ta pati grąža dabar duoda ${a < b ? 'mažiau' : 'daugiau'} eurų: eurų suma priklauso ne tik nuo grąžos, bet ir nuo turto dydžio.`,
  chart: 'Uždarbis iš investicijų, mln. €', reform: 'Reforma', lbEst: 'šviesesni stulpeliai – Lietuvos banko ketvirčio įvertis', estN: p => `${p} turto kasdienių grynųjų aktyvų valdytojai neskelbia – paskutinis žinomas turtas perskaičiuotas pagal vieneto vertės pokytį (įvertis).`,
  tip: (p, v, r) => `${p}: ${mSMn(v)}${r != null ? ` (${pct(r)})` : ''}`,
  th: ['Metai', 'Uždarbis, mln. €', 'Darbo dienų', 'Vidutiniškai per dieną, mln. €', 'Vidutiniškai per mėnesį, mln. €', 'Geriausia diena', 'Blogiausia diena', 'Dienų su uždarbiu', 'Grąža'],
  tbl: 'Pagal metus', part: 'metų dalis', qOf: (n, m) => `${n} ketv. iš ${m}`, lbRow: 'LB įvertis',
  note: 'Fondo dienos uždarbis = jo grynieji aktyvai ankstesnę dieną × (vieneto vertė ÷ ankstesnė vieneto vertė − 1). Vieneto vertės – atskaičius mokesčius. Rinkos, valdytojo ir pakopos skaičiai – fondų sumos. Ketvirčiai iki 2019 m. spalio (II pakopa) arba be pilnų kasdienių duomenų įvertinti iš Lietuvos banko ketvirčio ataskaitų: ketvirčio grąža × (turtas pradžioje + turtas pabaigoje) ÷ 2 ÷ (1 + grąža ÷ 2). Laikotarpio grąža – sujungtos dienų grąžos, svertinės pagal turtą. Fondų kasdieniai duomenys – paskutinės 400 dienų.',
  fundDays: 'Fondų kasdienės vertės saugomos paskutinėms 400 dienų; ilgesnei istorijai rinkis mėnesį, ketvirtį ar metus.',
  xl: 'Excel su skaičiavimais', shD: 'Dienos pagal fondą', shP: 'Laikotarpiai', shM: 'Metodika',
  xh: ['Data', 'Pakopa', 'Valdytojas', 'Fondas', 'Vieneto vertė ankstesnę dieną', 'Vieneto vertė', 'Grynieji aktyvai ankstesnę dieną, mln. €', 'Turtas įvertintas (1 – taip)', 'Uždarbis, mln. €', 'Grąža'],
  ph: ['Laikotarpis', 'Uždarbis, mln. €', 'Grąža', 'Šaltinis'], srcD: 'kasdieniai duomenys', srcLB: 'LB ketvirčio įvertis',
  none: 'Šiam pasirinkimui duomenų nėra.' } });

const EUS = { pl: 'II', sc: '', gr: 'd', per: '3m' };
try { Object.assign(EUS, JSON.parse(localStorage.getItem('euS') || '{}')); } catch (e) {}
const euSave = () => { try { localStorage.setItem('euS', JSON.stringify(EUS)); } catch (e) {} };
const EU_REFORM = dayOf('2026-01-01');
const euCache = {};

function euDays(pl) {                                  // dienų numeriai iš skirtumų
  if (euCache['d' + pl]) return euCache['d' + pl];
  let d = 0; return (euCache['d' + pl] = EARN[pl].dd.map(x => (d += x)));
}
/* kasdienė eilutė pasirinktam rinkiniui: [{d, g, b, e}] (g ir b – mln. €; e – įvertintos bazės dalis) */
function euDaily(pl, sc) {
  const k = pl + '|' + sc; if (euCache[k]) return euCache[k];
  if (pl === 'all') {
    const m = new Map();
    ['II', 'III'].forEach(p => euDaily(p, sc).forEach(x => { const y = m.get(x.d) || { d: x.d, g: 0, b: 0, eb: 0 }; y.g += x.g; y.b += x.b; y.eb += x.e * x.b; m.set(x.d, y); }));
    return (euCache[k] = [...m.values()].sort((a, b) => a.d - b.d).map(y => ({ d: y.d, g: y.g, b: y.b, e: y.b ? y.eb / y.b : 0 })));
  }
  const E = EARN[pl], ds = euDays(pl);
  let out;
  if (sc.startsWith('f:')) {
    const fi = +sc.slice(2);
    out = E.fd.filter(r => r[1] === fi).map(r => ({ d: r[0], g: r[4] * (r[3] / r[2] - 1), b: r[4], e: r[5], u0: r[2], u1: r[3], fi }));
  } else if (sc) {
    const g = E.m[sc], b = E.mb[sc]; if (!g) return (euCache[k] = []);
    out = ds.map((d, i) => ({ d, g: g[i], b: b[i], e: 0 })).filter(x => x.b);
  } else out = ds.map((d, i) => ({ d, g: E.g[i], b: E.b[i], e: E.e[i] }));
  return (euCache[k] = out.filter(x => x.d >= E.ds || sc.startsWith('f:')));
}
const euMon = d => iso(d).slice(0, 7), euQ = d => { const s = iso(d); return `${s.slice(0, 4)}-${Math.floor((+s.slice(5, 7) - 1) / 3) + 1}`; };
const euQLab = q => lang === 'lt' ? `${q.slice(0, 4)} ${['I', 'II', 'III', 'IV'][+q.slice(5) - 1]} ketv.` : `Q${q.slice(5)} ${q.slice(0, 4)}`;
const euMLab = m => `${T().monShort[+m.slice(5) - 1]} ${m.slice(0, 4)}`;
/* laikotarpių eilutė: [{k, lab, d0, d1, g, r, lb}] */
function euPeriods(pl, sc, gr) {
  const daily = euDaily(pl, sc);
  if (gr === 'd') return daily.map(x => ({ k: x.d, lab: iso(x.d), d0: x.d, d1: x.d, g: x.g, r: x.b ? x.g / x.b * 100 : null, e: x.e, x }));
  const kf = gr === 'm' ? euMon : gr === 'q' ? euQ : d => iso(d).slice(0, 4);
  const lab = gr === 'm' ? euMLab : gr === 'q' ? euQLab : k => k;
  const m = new Map();
  daily.forEach(x => { const k = kf(x.d); const y = m.get(k) || { k, lab: lab(k), d0: x.d, d1: x.d, g: 0, f: 1, lb: false }; y.g += x.g; y.f *= x.b ? 1 + x.g / x.b : 1; y.d1 = x.d; m.set(k, y); });
  const fund = sc.startsWith('f:');
  // ilgesnė istorija: fondams – mėnesiai (fm), rinkai ir valdytojams – LB ketvirčių įverčiai
  const add = (k, g, lb, d0) => { if (m.has(k)) return; m.set(k, { k, lab: lab(k), d0, d1: d0, g, f: null, lb }); };
  const pls = pl === 'all' ? ['II', 'III'] : [pl];
  if (fund && gr !== 'd') {
    const E = EARN[pl], fi = +sc.slice(2), first = daily.length ? daily[0].d : Infinity, acc = new Map();
    E.fm.filter(r => r[1] === fi).forEach(r => { const ms = `${Math.floor(r[0] / 12)}-${String(r[0] % 12 + 1).padStart(2, '0')}`, d0 = dayOf(ms + '-01');
      if (d0 + 31 > first) return; const k = kf(d0); const y = acc.get(k) || { g: 0, d0 }; y.g += r[2]; acc.set(k, y); });
    acc.forEach((y, k) => add(k, y.g, false, y.d0));
  } else if (!fund && gr !== 'm') {
    const acc = new Map();
    pls.forEach(p => EARN[p].q.forEach(q => { if (q[1] !== 'lb') return; const v = sc ? q[3][sc] : q[2]; if (v == null) return;
      const d0 = dayOf(`${q[0].slice(0, 4)}-${String((+q[0].slice(5) - 1) * 3 + 1).padStart(2, '0')}-01`); const k = kf(d0);
      if (dayOf(`${q[0].slice(0, 4)}-${String(+q[0].slice(5) * 3).padStart(2, '0')}-28`) >= EARN[p].ds) return;
      const y = acc.get(k) || { g: 0, d0, nq: 0 }; y.g += v; y.nq++; acc.set(k, y); }));
    acc.forEach((y, k) => { if (m.has(k)) { const z = m.get(k); z.g += y.g; z.lb = true; z.f = null; z.d0 = Math.min(z.d0, y.d0); } else { add(k, y.g, true, y.d0); m.get(k).nq = y.nq; m.get(k).nqMax = (gr === 'q' ? 1 : 4) * pls.length; } });
  }
  return [...m.values()].sort((a, b) => a.d0 - b.d0).map(y => ({ ...y, r: y.f != null ? (y.f - 1) * 100 : null }));
}
function euSum(daily, d0, d1) {                         // uždarbis ir sujungta grąža tarp dienų (imtinai)
  let g = 0, f = 1, n = 0, a = null, b = null; daily.forEach(x => { if (x.d < d0 || x.d > d1) return; g += x.g; f *= x.b ? 1 + x.g / x.b : 1; n++; if (a == null) a = x.d; b = x.d; });
  return { g, r: (f - 1) * 100, n, a, b };
}

function euBar() {
  const t = T().eu, E = EARN, pls = ['II', 'III', 'all'];
  const opt = (v, l) => `<option value="${hEsc(v)}"${v === EUS.sc ? ' selected' : ''}>${hEsc(l)}</option>`;
  const mg = [...new Set(['II', 'III'].filter(p => EUS.pl === 'all' || p === EUS.pl).flatMap(p => Object.keys(E[p].m)))].sort();
  const fnd = EUS.pl === 'all' ? [] : E[EUS.pl].funds.map((f, i) => [i, f]).sort((a, b) => (a[1][0] + a[1][1]).localeCompare(b[1][0] + b[1][1], 'lt'));
  const seg = (k, items) => `<span class="seg" role="group">${items.map(([v, l]) => `<button type="button" data-eu="${k}" data-v="${v}" aria-pressed="${EUS[k] === v}">${hEsc(l)}</button>`).join('')}</span>`;
  const pers = EUS.gr === 'd' ? ['1m', '3m', '1y', '3y', 'all'] : EUS.gr === 'm' ? ['1y', '3y', 'all'] : [];
  return `<div class="bar eubar">${seg('pl', pls.map(p => [p, t.pl[p]]))}<label class="field">${t.scope} <select data-eu="sc">${opt('', t.mkt)}<optgroup label="${t.mgrs}">${mg.map(m => opt(m, m)).join('')}</optgroup>${fnd.length ? `<optgroup label="${t.fnds}">${fnd.map(([i, f]) => opt('f:' + i, `${f[1]}`)).join('')}</optgroup>` : ''}</select></label>`
    + seg('gr', ['d', 'm', 'q', 'y'].map(g => [g, t.gran[g]])) + (pers.length ? seg('per', pers.map(p => [p, t.per[p]])) : '') + `<button type="button" class="btn xl" id="euXl">${t.xl}</button></div>`;
}
function euWho() {
  const t = T().eu; if (!EUS.sc) return t.who(EUS.pl, '');
  if (EUS.sc.startsWith('f:')) return EARN[EUS.pl].funds[+EUS.sc.slice(2)][1];
  return t.who(EUS.pl, EUS.sc);
}
function euFix() {
  if (!['II', 'III', 'all'].includes(EUS.pl)) EUS.pl = 'II';
  if (EUS.sc.startsWith('f:') && (EUS.pl === 'all' || !EARN[EUS.pl].funds[+EUS.sc.slice(2)])) EUS.sc = '';
  if (EUS.sc && !EUS.sc.startsWith('f:') && !['II', 'III'].some(p => (EUS.pl === 'all' || p === EUS.pl) && EARN[p].m[EUS.sc])) EUS.sc = '';
  if (EUS.gr === 'd' && !['1m', '3m', '1y', '3y', 'all'].includes(EUS.per)) EUS.per = '3m';
  if (EUS.gr === 'm' && !['1y', '3y', 'all'].includes(EUS.per)) EUS.per = 'all';
}

function renderEarn() {
  const box = document.getElementById('euBody'); if (!box) return;
  const t = T().eu;
  document.getElementById('euTitle').textContent = t.title; document.getElementById('euLead').textContent = t.lead;
  if (typeof EARN === 'undefined' || !EARN) { box.innerHTML = `<p class="note">${t.none}</p>`; return; }
  euFix();
  document.getElementById('euBar').innerHTML = euBar();
  const daily = euDaily(EUS.pl, EUS.sc), who = euWho();
  if (!daily.length) { box.innerHTML = `<p class="note">${t.none}</p>`; return; }
  // ---- KPI su sakiniais
  const L = daily[daily.length - 1], ld = iso(L.d), y = ld.slice(0, 4), mo = ld.slice(0, 7), qq = euQ(L.d);
  const s = (d0) => euSum(daily, d0, L.d);
  const mS = s(dayOf(mo + '-01')), qS = s(dayOf(`${y}-${String((+qq.slice(5) - 1) * 3 + 1).padStart(2, '0')}-01`)), yS = s(dayOf(y + '-01-01'));
  const py = String(+y - 1), pyS = euSum(daily, dayOf(py + '-01-01'), dayOf(py + '-12-31'));
  const pre = euSum(daily, 0, EU_REFORM - 1), post = euSum(daily, EU_REFORM, L.d);
  const preYears = pre.n ? (pre.b - pre.a) / 365.25 : 0, preAnn = preYears > 0.5 ? (Math.pow(1 + pre.r / 100, 1 / preYears) - 1) * 100 : pre.r;
  const at = d => { let x = null; daily.forEach(z => { if (z.d <= d) x = z; }); return x; };
  const before = at(EU_REFORM - 1), oneNow = L.b / 100, oneBefore = before ? before.b / 100 : null;
  const fd = d => iso(d);
  let facts = [
    { h: t.kDay(ld), v: L.g, r: L.b ? L.g / L.b * 100 : 0, text: t.sDay(who, ld, L.g, L.b ? L.g / L.b * 100 : 0) },
    { h: t.kMon, v: mS.g, r: mS.r, text: t.sPer(who, t.pMon, fd(mS.a), ld, mS.g, mS.r) },
    qS.a !== mS.a && { h: t.kQ, v: qS.g, r: qS.r, text: t.sPer(who, t.pQ, fd(qS.a), ld, qS.g, qS.r) },
    { h: t.kY, v: yS.g, r: yS.r, text: t.sPer(who, t.pY, fd(yS.a), ld, yS.g, yS.r) },
    { h: t.kAvg, v: yS.n ? yS.g / yS.n : 0, sub: `${py}: ${pyS.n ? mSMn(pyS.g / pyS.n) : '–'}`,
      text: t.sAvg(who, y, yS.n ? yS.g / yS.n : 0, py, pyS.n ? pyS.g / pyS.n : 0) + (pre.n > 200 && post.n ? t.sRef(who, pre.g / pre.n, post.g / post.n, preAnn, post.r) : '') },
  ];
  facts = facts.filter(Boolean);
  if (oneBefore) facts.push({ h: t.kOne, v: oneNow, plain: true, sub: `2025-12-31: ${mMn(oneBefore)}`, text: t.sOne(ld, oneNow, iso(before.d), oneBefore) });
  const ests = L.e > 0.005 ? `<p class="note">${t.estN(pctPlain(L.e * 100, 0))}</p>` : '';
  const kp = `<div class="kpis eukp">${facts.map((f, i) => `<div class="kpi"><span>${hEsc(f.h)}</span><b class="${f.plain ? '' : mCls(f.v)}">${f.plain ? mMn(f.v) : mSMn(f.v)}</b><small>${f.r != null ? pct(f.r) : hEsc(f.sub || '')}</small></div>`).join('')}</div>`;
  const says = `<ul class="eusay">${facts.map((f, i) => `<li>${hEsc(f.text)} <button type="button" class="btn" data-eucp="${i}">${T().copy}</button></li>`).join('')}</ul>`;
  // ---- grafikas
  let ps = euPeriods(EUS.pl, EUS.sc, EUS.gr);
  if (EUS.gr === 'd' || EUS.gr === 'm') { const back = { '1m': 31, '3m': 92, '1y': 366, '3y': 1096, all: 1e6 }[EUS.per]; ps = ps.filter(p => p.d0 > L.d - back); }
  const fundNote = EUS.sc.startsWith('f:') && EUS.gr === 'd' ? `<p class="note">${t.fundDays}</p>` : '';
  box.innerHTML = kp + says + ests + `<section class="card"><h2>${t.chart}</h2><div class="chart" id="euCh"></div><p class="note" id="euTip"></p>${ps.some(p => p.lb) ? `<p class="note">${t.lbEst}</p>` : ''}${fundNote}</section>`
    + `<section class="card"><h2>${t.tbl}</h2><div class="scroll"><table class="at" id="euT"></table></div><p class="note">${t.note}</p></section>`;
  box._facts = facts; box._ps = ps;
  euChart(document.getElementById('euCh'), ps);
  euTable(daily);
}
function euChart(el, ps) {
  const t = T().eu, W = el.clientWidth || 600, H = Math.max(220, Math.min(320, W * 0.45)), m = { l: 52, r: 10, t: 18, b: 26 };
  if (!ps.length) { el.innerHTML = `<p class="note">${t.none}</p>`; return; }
  let lo = Math.min(0, ...ps.map(p => p.g)), hi = Math.max(0, ...ps.map(p => p.g)); const pad = (hi - lo) * 0.06 || 1; lo -= pad; hi += pad;
  const n = ps.length, bw = (W - m.l - m.r) / n, X = i => m.l + i * bw, Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${hEsc(t.chart)}">`;
  niceTicks(lo, hi).forEach(v => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? 'var(--axis)' : 'var(--grid)'}" ${v ? 'stroke-dasharray="2 3"' : ''}/><text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end" fill="var(--text-3)" font-size="11">${num(v, Math.abs(hi - lo) < 10 ? 1 : 0)}</text>`; });
  ps.forEach((p, i) => { const y0 = Y(Math.max(0, p.g)), h = Math.max(0.5, Math.abs(Y(p.g) - Y(0)));
    s += `<rect x="${X(i) + (bw > 3 ? bw * 0.12 : 0)}" y="${y0}" width="${Math.max(0.6, bw > 3 ? bw * 0.76 : bw)}" height="${h}" fill="${p.g >= 0 ? 'var(--s5, #2f8f5b)' : '#d0453f'}" opacity="${p.lb ? 0.45 : 0.9}"/>`; });
  // x ašis: metai arba mėnesiai
  const span = ps[n - 1].d1 - ps[0].d0, labs = []; let prev = '';
  ps.forEach((p, i) => { const k = span > 800 ? iso(p.d0).slice(0, 4) : iso(p.d0).slice(0, 7); if (k !== prev) { labs.push([i, span > 800 ? k : euMLab(k)]); prev = k; } });
  const every = Math.max(1, Math.ceil(labs.length / Math.max(2, Math.floor((W - m.l) / 70))));
  let lastX = -1e9;
  labs.forEach(([i, l], j) => { if (j % every || X(i) - lastX < l.length * 6.5 + 8) return; lastX = X(i); s += `<line x1="${X(i)}" x2="${X(i)}" y1="${H - m.b}" y2="${H - m.b + 4}" stroke="var(--axis)"/><text x="${X(i) + 2}" y="${H - 8}" fill="var(--text-3)" font-size="11">${hEsc(l)}</text>`; });
  const ri = ps.findIndex(p => p.d0 >= EU_REFORM);
  if (ri > 0) s += `<line x1="${X(ri)}" x2="${X(ri)}" y1="${m.t - 6}" y2="${H - m.b}" stroke="var(--text-3)" stroke-dasharray="4 3"/><text x="${X(ri) + 4}" y="${m.t + 4}" fill="var(--text-2)" font-size="11">${t.reform}</text>`;
  s += `<line class="euh" x1="0" x2="0" y1="${m.t}" y2="${H - m.b}" stroke="var(--text-2)" opacity="0"/></svg>`;
  el.innerHTML = s;
  const svg = el.querySelector('svg'), hl = svg.querySelector('.euh'), tip = document.getElementById('euTip');
  const show = i => { const p = ps[i]; tip.textContent = t.tip(p.lab + (p.lb ? ` (${t.lbRow})` : ''), p.g, p.r); hl.setAttribute('x1', X(i) + bw / 2); hl.setAttribute('x2', X(i) + bw / 2); hl.setAttribute('opacity', 0.5); };
  svg.addEventListener('pointermove', e => { const r = svg.getBoundingClientRect(), x = (e.clientX - r.left) * W / r.width; show(Math.max(0, Math.min(n - 1, Math.floor((x - m.l) / bw)))); });
  show(n - 1);
}
function euTable(daily) {
  const t = T().eu, by = new Map();
  daily.forEach(x => { const y = iso(x.d).slice(0, 4); const a = by.get(y) || { y, g: 0, n: 0, f: 1, best: null, worst: null, pos: 0, ms: new Set() }; a.g += x.g; a.n++; a.f *= x.b ? 1 + x.g / x.b : 1; a.ms.add(iso(x.d).slice(0, 7));
    if (!a.best || x.g > a.best.g) a.best = x; if (!a.worst || x.g < a.worst.g) a.worst = x; if (x.g > 0) a.pos++; by.set(y, a); });
  const rows = [...by.values()];
  // LB metai (tik visai rinkai ir valdytojams), kai kasdienių duomenų dar nėra
  const lb = EUS.sc.startsWith('f:') ? [] : euPeriods(EUS.pl, EUS.sc, 'y').filter(p => !by.has(p.k) || p.lb);
  const gr4 = p => p.nq && p.nq < p.nqMax ? `, ${t.qOf(p.nq, p.nqMax)}` : '';
  const fm = (v, p = 1) => mCell(v, x => num(x, p)), dl = x => `${mSMn(x.g)} <small class="meta">${iso(x.d)}</small>`;
  const last = daily[daily.length - 1].d, first = daily[0].d;
  const body = lb.filter(p => !by.has(p.k)).map(p => `<tr><td class="l">${p.k} <small class="meta">${t.lbRow}${gr4(p)}</small></td><td class="${mCls(p.g)}">${fm(p.g)}</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>`)
    .concat(rows.map(a => { const part = (a.y === iso(first).slice(0, 4) && iso(first).slice(5) > '01-10') || a.y === iso(last).slice(0, 4);
      const lbx = lb.find(p => p.k === a.y && p.lb);
      return `<tr${a.y === iso(last).slice(0, 4) ? ' class="cur"' : ''}><td class="l">${a.y}${part ? ` <small class="meta">${t.part}</small>` : ''}${lbx ? ` <small class="meta">+ ${t.lbRow}</small>` : ''}</td><td class="${mCls(a.g)}">${fm(lbx ? lbx.g : a.g)}</td><td>${a.n}</td><td class="${mCls(a.g)}">${fm(a.g / a.n, 2)}</td><td>${fm(a.g / a.ms.size, 1)}</td><td>${dl(a.best)}</td><td>${dl(a.worst)}</td><td>${pctPlain(a.pos / a.n * 100, 0)}</td><td class="${mCls(a.f - 1)}">${pct((a.f - 1) * 100)}</td></tr>`; })).join('');
  document.getElementById('euT').innerHTML = `<thead><tr>${t.th.map((h, i) => `<th class="${i ? '' : 'l'}">${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
}

async function euExcel(b) {
  const t = T().eu, L = lang === 'lt', wb = XL.book(), ps = document.getElementById('euBody')._ps || [], who = euWho();
  const o = b.textContent; b.disabled = true; b.textContent = '…';
  try {
    const H = h => h.map(x => ({ v: x, s: 'hdr' }));
    const xd = d => ({ v: d + 25569, z: 'yyyy-mm-dd', s: 'in' });
    // 1. Dienos pagal fondą (formulės) – rodomam laikotarpiui, jei yra fondų kasdienių eilučių
    const d0 = ps.length ? ps[0].d0 : 0, d1 = ps.length ? ps[ps.length - 1].d1 : 0, rows = [[{ v: `${t.title}: ${who}`, s: 'title' }], [{ v: t.note, s: 'note' }], [], H(t.xh)];
    const pls = EUS.pl === 'all' ? ['II', 'III'] : [EUS.pl];
    pls.forEach(p => EARN[p].fd.forEach(r => {
      if (r[0] < d0 || r[0] > d1) return; const f = EARN[p].funds[r[1]];
      if (EUS.sc.startsWith('f:') ? r[1] !== +EUS.sc.slice(2) : EUS.sc && f[0] !== EUS.sc) return;
      const n = rows.length + 1;
      rows.push([xd(r[0]), p, f[0], f[1], { v: r[2], s: 'in' }, { v: r[3], s: 'in' }, { v: r[4], s: 'in', z: '0.000' }, { v: r[5], s: 'in' },
        { f: `G${n}*(F${n}/E${n}-1)`, v: r[4] * (r[3] / r[2] - 1), z: '0.000' }, { f: `F${n}/E${n}-1`, v: r[3] / r[2] - 1, z: '0.0000%' }]);
    }));
    const nD = rows.length;
    XL.sheet(wb, t.shD, rows, { cols: [12, 7, 11, 40, 14, 12, 16, 12, 14, 10], freeze: { r: 4, c: 0 } });
    // 2. Laikotarpiai: dienų rodinyje – SUMIFS iš 1 lapo; kitur – reikšmės
    const pr = [[{ v: `${t.shP}: ${who}`, s: 'title' }], [], H(t.ph)], sh = `'${t.shD}'`;
    ps.forEach(p => { const n = pr.length + 1, daily = EUS.gr === 'd' && nD > 4 && p.d0 >= (rows[4] ? rows[4][0].v - 25569 : Infinity);
      pr.push([EUS.gr === 'd' ? xd(p.d0) : p.lab, daily ? { f: `SUMIFS(${sh}!I:I,${sh}!A:A,A${n})`, v: p.g, z: '0.000', s: 'res' } : { v: p.g, z: '0.000' },
        p.r != null ? { v: p.r / 100, z: '0.00%' } : '', p.lb ? t.srcLB : t.srcD]); });
    XL.sheet(wb, t.shP, pr, { cols: [16, 16, 12, 24] });
    XL.sheet(wb, t.shM, [[{ v: t.shM, s: 'title' }], [{ v: t.note, s: 'note' }], [{ v: t.lead, s: 'note' }]], { cols: [120] });
    await XL.save(wb, `${L ? 'uzdarbis-eurais' : 'gains-in-euros'}-${EUS.pl}.xlsx`);
    b.textContent = '✓';
  } catch (e) { console.error(e); b.textContent = '!'; }
  setTimeout(() => { b.textContent = o; b.disabled = false; }, 1500);
}
document.addEventListener('click', e => {
  const b = e.target.closest('.eubar [data-eu]'); if (b && b.tagName === 'BUTTON') { EUS[b.dataset.eu] = b.dataset.v; if (b.dataset.eu === 'pl' && EUS.sc.startsWith('f:')) EUS.sc = ''; euSave(); renderEarn(); return; }
  if (e.target.closest('#euXl')) return euExcel(e.target.closest('#euXl'));
  const c = e.target.closest('[data-eucp]'); if (c) { const f = document.getElementById('euBody')._facts[+c.dataset.eucp]; const s = lang === 'lt' ? 'Šaltinis: valdytojų skelbiamos vieneto vertės ir grynieji aktyvai, skaičiavimas – pensijų fondų apžvalga.' : 'Source: managers’ published unit values and net assets.'; mkCopy(`${f.text} ${s}`, c); }
});
document.addEventListener('change', e => { const s = e.target.closest('.eubar select[data-eu]'); if (!s) return; EUS.sc = s.value; euSave(); renderEarn(); });
let euRz; addEventListener('resize', () => { clearTimeout(euRz); euRz = setTimeout(() => { const el = document.getElementById('euCh'), b = document.getElementById('euBody'); if (el && b && b._ps) euChart(el, b._ps); }, 150); });
