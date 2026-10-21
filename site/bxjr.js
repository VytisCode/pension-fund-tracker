/* „Kelias į pensiją“ Latvijai ir Estijai (savininkas 2026-10-21: „net ir Estišką; Latvišką kelią į pensiją galima sukurti“).
   Vienas II pakopos dalyvis, uždirbantis šalies vidutinį (ar pasirinktą jo dalį) bruto darbo užmokestį: kiekvieną mėnesį jo ir valstybės
   įmokos (tos šalies taisyklės, BALTIC.jr.rates – su šaltiniais) perkamos pasirinkto fondo vienetais tikromis vieneto vertėmis.
   Rezultatas – kiek sukaupta, kiek įmokėta, uždarbis eurais ir realiai (po infliacijos), vidinė grąža ir iliustracinė mėnesio išmoka.
   Lietuvos skaičiavimas – puslapyje „Kelias į pensiją“ (journey.html). Duomenys: baltic.py jr(), tools/fetch_baltic_macro.py. */
addStrings({ jr: {
  t: c => `${c}: road to retirement`, l: 'One pillar II participant earning the country’s average gross wage (or a chosen share of it): every month their own and the state’s contributions buy units of the chosen fund at real unit values. How much is saved, how much was paid in, and what it earned.',
  fund: 'Fund', start: 'Start of saving', pay: 'Wage', payAvg: p => p === 100 ? 'Average wage' : `${p}% of the average wage`, own: 'Own contribution from 2025', real: 'Values', realS: { nom: 'Nominal', real: 'Today’s euros' },
  k: { val: 'Saved now', paid: 'Paid in', own: 'of which own contributions', st: 'of which from the state (social tax / insurance)', gain: 'Earned', irr: 'Annual return on contributions (IRR)', realG: 'Earned in today’s euros (after inflation)', pay20: 'If paid out over 20 years', pen: 'Average old-age pension now', lv: 'all from the social insurance contribution – the participant pays nothing extra' },
  perM: 'per month', yrs: n => `${n} years`,
  chT: 'Contributions and value over time', ser: { val: 'Value of savings', paid: 'All contributions', own: 'Own contributions' },
  tT: 'By year', th: ['Year', 'Average gross wage, €/month', 'Contribution rate (own + state)', 'Own contributions, €', 'State contributions, €', 'Contributions paid to date, €', 'Value at year end, €', 'Earned to date, €'],
  sT: 'Rules, sources and assumptions', est: 'Estimates used', none: 'No data for this choice.', lt: 'The Lithuanian calculation – with Sodra contributions, state incentive and annuity – is on the “Road to retirement” page.', ltLink: 'Open the Lithuanian “Road to retirement” →',
  note: 'Contributions are invested on the 10th of the following month at that day’s unit value (Latvia – the nearest earlier chart point). Fees are already in unit values. The 20-year payout is illustrative (value ÷ 240), not the official pension: in Latvia the capital is added to the state pension or used to buy an annuity, in Estonia – a lump sum, fund pension or annuity.',
  xl: 'Road to retirement', xlH: ['Date invested', 'Wage month', 'Gross wage, €', 'Own rate, %', 'State rate, %', 'Own contribution, €', 'State contribution, €', 'Unit value', 'Units bought', 'Units total', 'Value, €', 'Contributions to date, €'] } }, { jr: {
  t: c => `${c}: kelias į pensiją`, l: 'Vienas II pakopos dalyvis, uždirbantis šalies vidutinį (ar pasirinktą jo dalį) bruto darbo užmokestį: kiekvieną mėnesį jo ir valstybės įmokos perkamos pasirinkto fondo vienetais tikromis vieneto vertėmis. Kiek sukaupta, kiek įmokėta ir kiek uždirbta.',
  fund: 'Fondas', start: 'Kaupti pradėta', pay: 'Atlyginimas', payAvg: p => p === 100 ? 'Vidutinis atlyginimas' : `${p} % vidutinio atlyginimo`, own: 'Savo įmoka nuo 2025 m.', real: 'Vertės', realS: { nom: 'Nominalios', real: 'Šiandienos eurais' },
  k: { val: 'Sukaupta dabar', paid: 'Įmokėta', own: 'iš jų savo įmokos', st: 'iš jų valstybės (iš socialinio draudimo įmokų)', gain: 'Uždirbta', irr: 'Metinė įmokų grąža (IRR)', realG: 'Uždirbta šiandienos eurais (po infliacijos)', pay20: 'Jei išmokėtų per 20 metų', pen: 'Vidutinė senatvės pensija dabar', lv: 'visos – iš socialinio draudimo įmokos, dalyvis papildomai nemoka' },
  perM: 'per mėn.', yrs: n => `${n} m.`,
  chT: 'Įmokos ir vertė laike', ser: { val: 'Sukaupta vertė', paid: 'Visos įmokos', own: 'Savo įmokos' },
  tT: 'Pagal metus', th: ['Metai', 'Vidutinis bruto atlyginimas, €/mėn.', 'Įmokų tarifas (savo + valstybės)', 'Savo įmokos, €', 'Valstybės įmokos, €', 'Iki tol įmokėta, €', 'Vertė metų pabaigoje, €', 'Iki tol uždirbta, €'],
  sT: 'Taisyklės, šaltiniai ir prielaidos', est: 'Naudoti įverčiai', none: 'Šiam pasirinkimui duomenų nėra.', lt: 'Lietuvos skaičiavimas – su Sodros įmokomis, valstybės skatinamąja įmoka ir anuitetu – puslapyje „Kelias į pensiją“.', ltLink: 'Atidaryti Lietuvos „Kelią į pensiją“ →',
  note: 'Įmokos investuojamos kito mėnesio 10 d. tos dienos vieneto verte (Latvijoje – artimiausiu ankstesniu grafiko tašku). Mokesčiai jau įskaičiuoti vieneto vertėse. Išmoka per 20 metų – iliustracija (vertė ÷ 240), ne oficiali pensija: Latvijoje kapitalas pridedamas prie valstybinės pensijos arba už jį perkamas anuitetas, Estijoje – vienkartinė išmoka, fondo pensija arba anuitetas.',
  xl: 'Kelias į pensiją', xlH: ['Investavimo data', 'Atlyginimo mėnuo', 'Bruto atlyginimas, €', 'Savo tarifas, %', 'Valstybės tarifas, %', 'Savo įmoka, €', 'Valstybės įmoka, €', 'Vieneto vertė', 'Nupirkta vienetų', 'Vienetų iš viso', 'Vertė, €', 'Iki tol įmokėta, €'] } });
const JRD = BALTIC.jr || null;
const JR = { LV: {}, EE: {} };
try { Object.assign(JR, JSON.parse(localStorage.getItem('bxJr') || '{}')); } catch (e) {}
const saveJ = () => { try { localStorage.setItem('bxJr', JSON.stringify(JR)); } catch (e) {} };
const mKey = (y, m) => `${y}-${String(m).padStart(2, '0')}`;
function wageOf(c, y, m, est) {                         // mėnesio bruto atlyginimas: LV – mėnesio, EE – ketvirčio; trūkstant – paskutinis žinomas (įvertis)
  const W = JRD.wage[c] || {}, k = c === 'EE' ? `${y}-Q${Math.floor((m - 1) / 3) + 1}` : mKey(y, m);
  if (W[k] != null) return W[k];
  const ks = Object.keys(W).sort(), last = ks.filter(x => x < k).pop();
  if (last) { est.add(`${T().jr.th[1]} ${k} = ${last}`); return W[last]; }
  return null;
}
function rateOf(c, d, own) {                            // [savo %, valstybės %] dienai d (pagal įmokos mėnesį)
  const R = JRD.rates[c]; let r = null;
  for (const x of R) if (x.from <= d) r = x;
  if (!r) return [0, 0];
  return [r.own == null ? 0 : (r.choice && own ? own : r.own), r.state];
}
function jrFunds(c) { return BX.filter(f => f.c === c && f.pl === 'II' && !f.closed).sort((a, b) => (b.na || 0) - (a.na || 0) || a.first - b.first); }
function jrState(c) {
  const S = JR[c] = JR[c] || {}, fs = jrFunds(c);
  if (!fs.some(f => f.id === S.f)) { const r4 = fs.filter(f => f.risk === 'r4'); S.f = (r4[0] || fs[0] || {}).id; }
  const f = BX.find(x => x.id === S.f);
  const y0 = f ? new Date(f.first * DAY).getUTCFullYear() + (new Date(f.first * DAY).getUTCMonth() > 0 ? 1 : 0) : 2016;
  if (!(S.y >= y0)) S.y = Math.max(y0, CY - 10);
  if (!S.p) S.p = 100; if (!S.o) S.o = 2;
  return { S, f, fs, y0 };
}
function jrSim(c) {
  const { S, f } = jrState(c); if (!f || !JRD) return null;
  const est = new Set(), rows = [], end = f.last;
  let units = 0, own = 0, st = 0, realPaid = 0;
  const comp = JRD.comp && JRD.comp[c];                  // EE: 2020-07–2021-08 nesumokėta valstybės 4 % – kompensuota 2023–2024 m. (lygiomis dalimis)
  let owed = 0;
  for (let y = S.y, m = 1; ; m++) {
    if (m > 12) { m = 1; y++; }
    const inv = Math.round(Date.UTC(y, m, 10) / DAY);   // kito mėnesio 10 d.
    if (inv > end) break;
    const w0 = wageOf(c, y, m, est); if (w0 == null) continue;
    const w = w0 * S.p / 100, d = mKey(y, m), [ro, rs] = rateOf(c, d, S.o);
    let co = w * ro / 100, cs = w * rs / 100;
    if (comp && d >= comp.from && d <= comp.to) owed += w * comp.pct / 100;
    if (comp && d >= comp.payFrom && d <= comp.payTo) { const n = comp.payN; cs += owed / n; }
    if (comp && d === comp.payTo) owed = 0;
    const p = at(f, inv) || (inv >= f.first ? null : null);
    if (!p) continue;
    const ct = co + cs; units += ct / p.v; own += co; st += cs;
    const cpi = cpiAt(c, inv), cpiN = cpiAt(c, end); if (ct && cpi && cpiN) realPaid += ct * cpiN / cpi;
    rows.push({ d: inv, ym: d, y, w, ro, rs, co, cs, price: p.v, pd: p.d, bought: ct / p.v, units, val: units * p.v, paid: own + st });
  }
  if (!rows.length) return null;
  const e = at(f, end), val = units * e.v, paid = own + st;
  // vidinė grąža (XIRR): įmokos neigiamos, galutinė vertė teigiama
  const cf = rows.map(r => [r.d, -(r.co + r.cs)]).concat([[e.d, val]]);
  let irr = 0.05; for (let k = 0; k < 60; k++) { let fv = 0, dv = 0; cf.forEach(([d, v]) => { const t = (d - e.d) / 365.25, g = Math.pow(1 + irr, -t); fv += v * g; dv += -t * v * g / (1 + irr); }); const nx = irr - fv / dv; if (!isFinite(nx)) break; if (Math.abs(nx - irr) < 1e-9) { irr = nx; break; } irr = Math.max(-0.99, nx); }
  const P = JRD.pension[c] || {}, pk = Object.keys(P).sort().pop();
  return { f, S, rows, val, paid, own, st, gain: val - paid, irr: irr * 100, realPaid, realGain: realPaid ? val - realPaid : null, end: e.d, est: [...est], pen: pk ? [pk, P[pk]] : null };
}
function renderJr() {
  const t = T(), j = t.jr, c = CR.c; if (c === 'X') return;
  $('jrT').textContent = j.t(t.c[c]);
  if (c === 'LT' || !JRD) { $('jrL').textContent = j.lt; $('jrBar').innerHTML = ''; $('jrBody').innerHTML = `<p><a class="btn" href="journey.html">${j.ltLink}</a></p>`; return; }
  $('jrL').textContent = j.l;
  const { S, fs, y0 } = jrState(c), ys = []; for (let y = y0; y <= CY; y++) ys.push(y);
  $('jrBar').innerHTML = `<label class="field">${j.fund} <select id="jrF">${fs.map(f => `<option value="${f.id}"${f.id === S.f ? ' selected' : ''}>${hEsc(f.n)}</option>`).join('')}</select></label>`
    + `<label class="field">${j.start} <select id="jrY">${ys.map(y => `<option${y === S.y ? ' selected' : ''}>${y}</option>`).join('')}</select></label>`
    + `<label class="field">${j.pay} <select id="jrP">${[50, 75, 100, 150, 200].map(p => `<option value="${p}"${p === S.p ? ' selected' : ''}>${j.payAvg(p)}</option>`).join('')}</select></label>`
    + (c === 'EE' ? `<label class="field">${j.own} <select id="jrO">${[2, 4, 6].map(p => `<option value="${p}"${p === S.o ? ' selected' : ''}>${p} %</option>`).join('')}</select></label>` : '');
  const R = jrSim(c);
  if (!R) { $('jrBody').innerHTML = `<p class="note">${j.none}</p>`; return; }
  const eur = v => `${num(v, 0)} €`, K = j.k, yrs = Math.round((R.end - R.rows[0].d) / 365.25);
  const card = (h, v, s, cls = '') => `<section class="card jk"><p class="note">${h}</p><b class="${cls}">${v}</b>${s ? `<p class="note">${s}</p>` : ''}</section>`;
  const pay = R.val / 240;
  let h = `<div class="jks">${card(K.val, eur(R.val), `${iso(R.end)} · ${j.yrs(yrs)}`)}${card(K.paid, eur(R.paid), R.own ? `${K.own} ${eur(R.own)}<br>${K.st} ${eur(R.st)}` : K.lv)}`
    + card(K.gain, eur(R.gain), `${pctPlain(R.gain / R.paid * 100)} · ${K.irr} ${pctPlain(R.irr)}`, sgn(R.gain))
    + (R.realGain != null ? card(K.realG, eur(R.realGain), `${pctPlain(R.realGain / R.realPaid * 100)}`, sgn(R.realGain)) : '')
    + card(K.pay20, `${eur(pay)} ${j.perM}`, R.pen ? `${K.pen}: ${eur(R.pen[1])} (${R.pen[0]})` : '') + '</div>';
  h += `<section class="card"><h2>${j.chT}</h2><div class="chart" id="jrCh"></div></section>`;
  const Y = []; R.rows.forEach(r => { let x = Y[Y.length - 1]; if (!x || x.y !== r.y) Y.push(x = { y: r.y, w: 0, n: 0, co: 0, cs: 0, rate: `${num(r.ro, 0)} + ${num(r.rs, 0)}` }); x.w += r.w; x.n++; x.co += r.co; x.cs += r.cs; x.last = r; });
  h += `<section class="card"><h2>${j.tT}</h2><div class="scroll"><table class="bt"><thead><tr>${j.th.map((x, i) => `<th${i ? ' class="n"' : ''}>${x}</th>`).join('')}</tr></thead><tbody>`
    + Y.map(x => { const ye = Math.min(Math.round(Date.UTC(x.y, 11, 31) / DAY), R.end), p = at(R.f, ye), v = p ? x.last.units * p.v : x.last.val;
      return `<tr><td>${x.y}</td><td class="n">${num(x.w / x.n, 0)}</td><td class="n">${x.rate}</td><td class="n">${num(x.co, 0)}</td><td class="n">${num(x.cs, 0)}</td><td class="n">${num(x.last.paid, 0)}</td><td class="n">${num(v, 0)}</td><td class="n ${sgn(v - x.last.paid)}">${num(v - x.last.paid, 0)}</td></tr>`; }).join('') + '</tbody></table></div></section>';
  h += `<section class="card mt"><h2>${j.sT}</h2><p class="note">${j.note}</p><ul>${JRD.rates[c].map(r => `<li><b>${r.from}</b>: ${hEsc(r[lang] || r.lt)}${r.src ? ` <a href="${r.src}" target="_blank" rel="noopener">↗</a>` : ''}</li>`).join('')}</ul>`
    + `<p class="note">${hEsc(JRD.src[c][lang] || JRD.src[c].lt)}</p>` + (R.est.length ? `<p class="note">${j.est}: ${hEsc(R.est.slice(0, 4).join('; '))}</p>` : '') + '</section>';
  $('jrBody').innerHTML = h;
  const ser = [['val', PAL[0], r => r.val], ['paid', PAL[1], r => r.paid], ['own', PAL[2], r => r.paid - R.rows.filter(q => q.d <= r.d).reduce((s, q) => s + q.cs, 0)]];
  let cs = 0; const ownCum = R.rows.map(r => (cs += r.co));
  drawLineChart($('jrCh'), ser.filter(x => x[0] !== 'own' || R.own).map(([k, col, fn], i) => ({ provider: k, label: j.ser[k], color: col, points: R.rows.map((r, n) => [r.d, k === 'own' ? ownCum[n] : fn(r)]) })), R.rows[0].d, R.rows[R.rows.length - 1].d, { zero: true, axisUnit: '', fmt: v => num(v, 0) });
}
document.addEventListener('change', e => {
  const id = e.target.id; if (!['jrF', 'jrY', 'jrP', 'jrO'].includes(id)) return;
  const S = JR[CR.c]; if (id === 'jrF') S.f = e.target.value; else if (id === 'jrY') S.y = +e.target.value; else if (id === 'jrP') S.p = +e.target.value; else S.o = +e.target.value;
  saveJ(); renderJr();
});
function jrSheet(wb) {                                  // Excel: kiekvieno mėnesio įmokos ir vienetai – formulės
  if (CR.c === 'X' || CR.c === 'LT') return;
  const R = jrSim(CR.c); if (!R) return;
  const j = T().jr, xd = d => ({ v: d + 25569, z: 'yyyy-mm-dd', s: 'in' });
  const rows = [[{ v: `${j.xl}: ${R.f.n}`, s: 'title' }], [{ v: j.note, s: 'note' }], [], j.xlH.map(h => ({ v: h, s: 'hdr' }))];
  R.rows.forEach((r, i) => { const n = i + 5;
    rows.push([xd(r.d), r.ym, { v: r.w, z: '0.00', s: 'in' }, { v: r.ro, s: 'in' }, { v: r.rs, s: 'in' }, { f: `C${n}*D${n}/100`, v: r.co, z: '0.00', s: 'calc' }, Math.abs(r.cs - r.w * r.rs / 100) < 0.005 ? { f: `C${n}*E${n}/100`, v: r.cs, z: '0.00', s: 'calc' } : { v: r.cs, z: '0.00', s: 'in' },
      { v: r.price, z: '0.00000', s: 'in' }, { f: `(F${n}+G${n})/H${n}`, v: r.bought, z: '0.0000', s: 'calc' }, { f: i ? `J${n - 1}+I${n}` : `I${n}`, v: r.units, z: '0.0000', s: 'calc' },
      { f: `J${n}*H${n}`, v: r.val, z: '0.00', s: 'calc' }, { f: i ? `L${n - 1}+F${n}+G${n}` : `F${n}+G${n}`, v: r.paid, z: '0.00', s: 'calc' }]); });
  XL.sheet(wb, j.xl, rows, { cols: [12, 10, 12, 9, 9, 12, 12, 11, 12, 12, 12, 14], freeze: { r: 4 } });
}
