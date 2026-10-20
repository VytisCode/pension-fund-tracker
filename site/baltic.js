/* „Baltijos šalys“ (savininko užduotis 2026-10-20): Lietuvos, Latvijos ir Estijos II ir III pakopos fondai vienoje vietoje.
   Fondai lyginami šalies grupėse (LT – gimimo metų grupės, LV – akcijų dalis, EE – oficialių grupių nėra), o tarp šalių – tik
   panašios rizikos grupėse (3 metų metinis vertės svyravimas, skaičiuojamas vienodai visiems fondams). Skirtuke „Palyginti“ –
   laisvas bet kurių fondų palyginimas. Duomenys – docs/data_baltic.js (baltic.py). */
const ltN = (n, a, b, c) => { const k = Math.abs(Math.round(n)), d = k % 10, h = k % 100; return d === 1 && h !== 11 ? a : d >= 2 && (h < 12 || h > 19) ? b : c; };   // lietuviški linksniai (kaip mkt.js)
addStrings({
  navBaltic: 'Baltic states',
  ovT: 'Lithuania, Latvia and Estonia', ovL: 'Pillar II and III pension funds of the three Baltic states in one place. Within a country funds are compared in that country’s groups; across countries only funds of similar risk are compared (clearly marked).',
  c: { LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia' }, pl: p => `Pillar ${p}`, both: 'Both pillars',
  kFunds: (a, b) => `Funds: <b>${a}</b> in pillar II, <b>${b}</b> in pillar III`, kNa: v => `Pillar II assets: <b>${v}</b>`, kInv: v => `Pillar II active investors: <b>${v}</b>`,
  kNaLv: 'Assets and participants per plan are not published on manapensija.lv.', kFee: (v, k) => `Average fee: <b>${v}</b> (${k})`, kR: (v, n) => `Median 1-year return of high-risk pillar II funds: <b>${v}</b> (${n} funds)`,
  feeK: { ter: 'ongoing charges, TER', fix: 'fixed part of the fee' }, feeLt: 'Lithuanian fees – on the “Reports” page',
  rkT: 'Similar risk across countries', rkN: 'Groups by 3-year annual volatility of unit value, the same calculation for every fund. Pillar II and III funds together. Median return of the group’s funds in each country; best fund below. 3, 5 and 10-year returns are annual.',
  rg: { r1: 'Low risk (volatility under 4%)', r2: 'Moderate (4–8%)', r3: 'Higher (8–12%)', r4: 'High (over 12%)' }, rgS: { r1: 'Low', r2: 'Moderate', r3: 'Higher', r4: 'High' }, rgNone: 'Too short history',
  hz: { y1: '1 year', y3: '3 years', y5: '5 years', y10: '10 years', ytd: 'Year to date', max: 'Since data start' },
  thRisk: 'Risk group', med: 'median', nF: n => `${n} funds`,
  eeT: 'Estonia: market over time', eeSeg: { na: 'Assets, € m', inv: 'Active investors (pillar II)' }, eeN: 'Sum of all funds at month end (pensionikeskus.ee).',
  fdT: 'All funds', fdL: 'Filter by country, pillar and group; click a column to sort; tick funds to compare them in the “Compare” tab.',
  fAll: 'All groups', fRisk: 'Risk groups (all countries)', fCg: c => `Groups – ${c}`, fQ: 'Search fund or manager…', fClosed: 'Show closed funds',
  cols: { c: 'Country', pl: 'Pillar', m: 'Manager', n: 'Fund', cg: 'Country group', risk: 'Risk group', vol: 'Volatility 3 y', y1: '1 y', y3: '3 y*', y5: '5 y*', y10: '10 y*', max: 'Since data start*', fee: 'Fee', eq: 'Equities', na: 'Assets, € m', inv: 'Participants', last: 'Data to', cmp: 'Compare' },
  fN: n => `${n} funds. * annual return. Returns are unit value changes (fees already deducted). Fee: Estonia – ongoing charges (TER), Latvia – fixed part only. Latvian values – manapensija.lv index points every 9–13 days, so a return may end a few days earlier. Lithuanian history on this page starts in 2018–2019 (daily unit values); longer Lithuanian results are on the Home and Results pages.`,
  cg: { e30: 'Up to 30% equities', e75: '31–75% equities', e100: 'Over 75% equities', turto: 'Asset preservation', born: (a, b) => `Born ${a}–${b}` }, none: '–',
  cmT: 'Compare any funds', cmL: 'Choose any funds of any country and pillar. Values are rebased to 0% at the start of the period; the period starts no earlier than the youngest selected fund.',
  cmAdd: 'Add a fund…', cmClear: 'Clear', cmDef: 'Suggested', cmNone: 'Choose at least one fund.',
  cmCols: { n: 'Fund', r: 'Return in period', a: 'Annual', vol: 'Volatility 3 y', fee: 'Fee', risk: 'Risk group' }, cmFrom: (a, b) => `Period: ${a} – ${b}.`,
  mtT: 'How it is calculated',
  xl: 'Excel with calculations', xlT: 'Baltic pension funds', xlS: 'Funds', xlV: 'Values and returns', xlM: 'Methodology',
  xlH: ['Country', 'Pillar', 'Manager', 'Fund', 'Country group', 'Risk group', 'Volatility 3 y, %', 'Fee, %', 'Fee type', 'Equities, %', 'Assets, € m', 'Participants', 'Start of data'],
  xlVH: ['Country', 'Pillar', 'Fund', 'Last date', 'Last value', 'Date 1 y ago', 'Value 1 y ago', '1 y return', 'Date 3 y ago', 'Value 3 y ago', '3 y annual return', 'Date 5 y ago', 'Value 5 y ago', '5 y annual return'],
  srcLine: 'Sources: pensionikeskus.ee (Estonia), manapensija.lv (Latvia), pension fund managers and the Bank of Lithuania (Lithuania).',
}, {
  navBaltic: 'Baltijos šalys',
  ovT: 'Lietuva, Latvija ir Estija', ovL: 'Trijų Baltijos šalių II ir III pakopos pensijų fondai vienoje vietoje. Šalies viduje fondai lyginami tos šalies grupėse, o tarp šalių – tik panašios rizikos fondai (aiškiai pažymėta).',
  c: { LT: 'Lietuva', LV: 'Latvija', EE: 'Estija' }, pl: p => `${p} pakopa`, both: 'Abi pakopos',
  kFunds: (a, b) => `Fondų: <b>${a}</b> II pakopoje, <b>${b}</b> III pakopoje`, kNa: v => `II pakopos turtas: <b>${v}</b>`, kInv: v => `II pakopos aktyvių investuotojų: <b>${v}</b>`,
  kNaLv: 'Plānų turto ir dalyvių skaičiaus manapensija.lv neskelbia.', kFee: (v, k) => `Vidutinis mokestis: <b>${v}</b> (${k})`, kR: (v, n) => `Didelės rizikos II pakopos fondų 1 metų grąžos mediana: <b>${v}</b> (${n} fondai)`,
  feeK: { ter: 'einamosios išlaidos, TER', fix: 'pastovioji mokesčio dalis' }, feeLt: 'Lietuvos mokesčiai – puslapyje „Ataskaitos“',
  rkT: 'Panaši rizika skirtingose šalyse', rkN: 'Grupės pagal 3 metų metinį vieneto vertės svyravimą – visiems fondams skaičiuojama vienodai. II ir III pakopos fondai kartu. Kiekvienos šalies grupės fondų grąžos mediana; po ja – geriausias fondas. 3, 5 ir 10 metų grąžos – metinės.',
  rg: { r1: 'Maža rizika (svyravimas iki 4 %)', r2: 'Vidutinė (4–8 %)', r3: 'Didesnė (8–12 %)', r4: 'Didelė (daugiau nei 12 %)' }, rgS: { r1: 'Maža', r2: 'Vidutinė', r3: 'Didesnė', r4: 'Didelė' }, rgNone: 'Per trumpa istorija',
  hz: { y1: '1 metai', y3: '3 metai', y5: '5 metai', y10: '10 metų', ytd: 'Nuo metų pradžios', max: 'Nuo duomenų pradžios' },
  thRisk: 'Rizikos grupė', med: 'mediana', nF: n => `${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}`,
  eeT: 'Estija: rinka laike', eeSeg: { na: 'Turtas, mln. €', inv: 'Aktyvūs investuotojai (II pakopa)' }, eeN: 'Visų fondų suma mėnesio pabaigoje (pensionikeskus.ee).',
  fdT: 'Visi fondai', fdL: 'Atsirinkite šalį, pakopą ir grupę; spauskite stulpelį, kad surikiuotumėte; pažymėkite fondus, kad juos palygintumėte skirtuke „Palyginti“.',
  fAll: 'Visos grupės', fRisk: 'Rizikos grupės (visos šalys)', fCg: c => `Grupės – ${c}`, fQ: 'Ieškoti fondo ar valdytojo…', fClosed: 'Rodyti uždarytus fondus',
  cols: { c: 'Šalis', pl: 'Pakopa', m: 'Valdytojas', n: 'Fondas', cg: 'Grupė šalyje', risk: 'Rizikos grupė', vol: 'Svyravimas 3 m.', y1: '1 m.', y3: '3 m.*', y5: '5 m.*', y10: '10 m.*', max: 'Nuo duomenų pradžios*', fee: 'Mokestis', eq: 'Akcijos', na: 'Turtas, mln. €', inv: 'Dalyviai', last: 'Duomenys iki', cmp: 'Lyginti' },
  fN: n => `${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}. * metinė grąža. Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti). Mokestis: Estijoje – einamosios išlaidos (TER), Latvijoje – tik pastovioji dalis. Latvijos vertės – manapensija.lv indekso taškai kas 9–13 dienų, todėl grąža gali baigtis keliomis dienomis anksčiau. Lietuvos istorija šiame puslapyje – nuo 2018–2019 m. (kasdienės vieneto vertės); ilgesni Lietuvos rezultatai – Pradžios ir Rezultatų puslapiuose.`,
  cg: { e30: 'Iki 30 % akcijų', e75: '31–75 % akcijų', e100: 'Daugiau nei 75 % akcijų', turto: 'Turto išsaugojimo', born: (a, b) => `Gimę ${a}–${b}` }, none: '–',
  cmT: 'Palyginti bet kuriuos fondus', cmL: 'Pasirinkite bet kuriuos bet kurios šalies ir pakopos fondus. Vertės perskaičiuotos nuo 0 % laikotarpio pradžioje; laikotarpis prasideda ne anksčiau nei jauniausio pasirinkto fondo pradžia.',
  cmAdd: 'Pridėti fondą…', cmClear: 'Išvalyti', cmDef: 'Siūlomi', cmNone: 'Pasirinkite bent vieną fondą.',
  cmCols: { n: 'Fondas', r: 'Grąža per laikotarpį', a: 'Metinė', vol: 'Svyravimas 3 m.', fee: 'Mokestis', risk: 'Rizikos grupė' }, cmFrom: (a, b) => `Laikotarpis: ${a} – ${b}.`,
  mtT: 'Kaip skaičiuota',
  xl: 'Excel su skaičiavimais', xlT: 'Baltijos šalių pensijų fondai', xlS: 'Fondai', xlV: 'Vertės ir grąžos', xlM: 'Metodika',
  xlH: ['Šalis', 'Pakopa', 'Valdytojas', 'Fondas', 'Grupė šalyje', 'Rizikos grupė', 'Svyravimas 3 m., %', 'Mokestis, %', 'Mokesčio rūšis', 'Akcijos, %', 'Turtas, mln. €', 'Dalyviai', 'Duomenų pradžia'],
  xlVH: ['Šalis', 'Pakopa', 'Fondas', 'Paskutinė data', 'Paskutinė vertė', 'Data prieš 1 m.', 'Vertė prieš 1 m.', '1 m. grąža', 'Data prieš 3 m.', 'Vertė prieš 3 m.', '3 m. metinė grąža', 'Data prieš 5 m.', 'Vertė prieš 5 m.', '5 m. metinė grąža'],
  srcLine: 'Šaltiniai: pensionikeskus.ee (Estija), manapensija.lv (Latvija), pensijų fondų valdytojai ir Lietuvos bankas (Lietuva).',
});
const MT = {
  lt: `<h3>Šaltiniai</h3><ul>
<li><b>Estija</b> – pensionikeskus.ee (Estijos pensijų centras): kasdienės II ir III pakopos fondų vieneto vertės, grynieji aktyvai ir II pakopos aktyvūs investuotojai nuo 2002 m.; einamosios išlaidos (TER) ir grąžos – kasdienė statistika.</li>
<li><b>Latvija</b> – manapensija.lv (nacionalinė pensijų svetainė): II ir III pakopos plānų sąrašas, valdytojas, pastovioji mokesčio dalis, akcijų dalis, valdymo būdas ir plano vertės grafikas (indeksas, 100 = plano pradžia arba 2003 m.), taškai kas 9–13 dienų.</li>
<li><b>Lietuva</b> – tie patys duomenys kaip kituose šios svetainės puslapiuose: fondų valdytojų skelbiamos vieneto vertės (II ir III pakopa) ir grynieji aktyvai.</li></ul>
<p>Duomenys atnaujinami automatiškai kiekvieną dieną. Istorija nekeičiama – kiekvieną kartą tik papildoma.</p>
<h3>Grąža</h3><p>Grąža – vieneto vertės (Latvijoje – indekso) pokytis tarp dviejų datų; mokesčiai jau atskaityti. 3, 5, 10 metų ir „nuo pradžios“ grąžos – metinės: (1 + bendra grąža)<sup>365,25 / dienų skaičius</sup> − 1. Pradžios vertė – paskutinė žinoma vertė pradžios dieną ar prieš ją (Latvijoje – artimiausias ankstesnis taškas, ne senesnis kaip 16 d.).</p>
<h3>Rizikos grupės</h3><p>Tarp šalių lyginami tik panašios rizikos fondai. Rizika – paskutinių 3 metų metinis vertės svyravimas: logaritminių vertės pokyčių (savaitės pabaigos; Latvijoje – grafiko taškų) standartinis nuokrypis × √(365 / vidutinis intervalas dienomis). Grupės: iki 4 %, 4–8 %, 8–12 %, daugiau nei 12 %. Fondams, turintiems mažiau nei 3 metų istoriją, grupė nenustatoma.</p>
<h3>Šalių grupės</h3><p>Lietuvoje – LB gyvenimo ciklo grupės (pagal gimimo metus) ir turto išsaugojimo fondai. Latvijoje – pagal plane nurodytą akcijų dalį: iki 30 %, 31–75 %, daugiau nei 75 %. Estijoje oficialių grupių nėra, todėl naudojamos rizikos grupės.</p>
<h3>Ką verta žinoti</h3><ul><li>Mokesčiai nevienodi: Estijoje nurodomos visos einamosios išlaidos (TER), Latvijoje – tik pastovioji mokesčio dalis (kintamoji dalis priklauso nuo rezultatų ir čia neįtraukta).</li>
<li>Latvijos plānų turto ir dalyvių skaičiaus manapensija.lv neskelbia, todėl Latvijos rinkos dydžio čia nėra.</li>
<li>Latvijos vertės – grafiko taškai, todėl paskutinė data gali būti kelias dienas senesnė nei Estijos ar Lietuvos.</li>
<li>Uždaryti ar sujungti fondai pagal nutylėjimą nerodomi (galima įjungti skirtuke „Visi fondai“).</li></ul>`,
  en: `<h3>Sources</h3><ul>
<li><b>Estonia</b> – pensionikeskus.ee (Estonian Pension Centre): daily unit values, net assets of pillar II and III funds and active pillar II investors since 2002; ongoing charges (TER) and returns – daily statistics.</li>
<li><b>Latvia</b> – manapensija.lv (national pension website): list of pillar II and III plans, manager, fixed part of the fee, equity share, management style and the plan value chart (index, 100 = plan start or 2003), points every 9–13 days.</li>
<li><b>Lithuania</b> – the same data as on the other pages of this site: unit values published by managers (pillars II and III) and net assets.</li></ul>
<p>Data are updated automatically every day. History is never changed – only added to.</p>
<h3>Return</h3><p>Return is the change in unit value (in Latvia – index) between two dates; fees are already deducted. 3, 5, 10-year and “since start” returns are annual: (1 + total return)<sup>365.25 / days</sup> − 1. The start value is the last known value on or before the start date (in Latvia – the nearest earlier point, at most 16 days older).</p>
<h3>Risk groups</h3><p>Across countries only funds of similar risk are compared. Risk is the 3-year annual volatility of the value: standard deviation of log changes (week-end values; in Latvia – chart points) × √(365 / average interval in days). Groups: under 4%, 4–8%, 8–12%, over 12%. Funds with less than 3 years of history get no group.</p>
<h3>Country groups</h3><p>Lithuania – Bank of Lithuania life-cycle groups (by year of birth) and asset preservation funds. Latvia – by the plan’s equity share: up to 30%, 31–75%, over 75%. Estonia has no official groups, so risk groups are used.</p>
<h3>Good to know</h3><ul><li>Fees differ: Estonia shows total ongoing charges (TER), Latvia only the fixed part of the fee (the variable, performance-linked part is not included).</li>
<li>manapensija.lv does not publish plan assets or participants, so Latvian market size is not shown.</li>
<li>Latvian values are chart points, so the last date may be a few days older than in Estonia or Lithuania.</li>
<li>Closed or merged funds are hidden by default (can be switched on in “All funds”).</li></ul>`,
};
const $ = id => document.getElementById(id);
const BX = BALTIC.funds;
BX.forEach(f => { let s = 0; f.D = f.d.map(x => (s += x)); f.V = f.v; f.first = f.D[0]; f.last = f.D[f.D.length - 1]; });
const TOP = Math.max(...BX.map(f => f.last));
BX.forEach(f => { f.closed = f.last < TOP - 45; });
const TOL = f => f.c === 'LV' ? 16 : 7;
const PAL = ['#2b8de0', '#ff7a2a', '#2f8f12', '#8a43c4', '#12b5b0', '#c9765a', '#2b3a93', '#d4a017', '#e0457b', '#5e9c76'];
function at(f, x) {                                // paskutinė vertė dieną x ar anksčiau (ne senesnė nei TOL dienų)
  let lo = 0, hi = f.D.length - 1, k = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (f.D[m] <= x) { k = m; lo = m + 1; } else hi = m - 1; }
  return k < 0 || x - f.D[k] > TOL(f) ? null : { d: f.D[k], v: f.V[k] };
}
const ytdStart = x => Math.round(Date.UTC(new Date(x * DAY).getUTCFullYear() - 1, 11, 31) / DAY);
function ret(f, h, end = f.last) {               // grąža %: y1 – bendra, y3/y5/y10/max – metinė
  const e = at(f, end); if (!e) return null;
  const s = h === 'max' ? { d: f.first, v: f.V[0] } : at(f, h === 'ytd' ? ytdStart(e.d) : e.d - Math.round(365.25 * +h.slice(1)));
  if (!s || s.d >= e.d) return null;
  const tot = e.v / s.v - 1, yrs = (e.d - s.d) / 365.25;
  return (h === 'y1' || h === 'ytd' || yrs < 1 ? tot : Math.pow(1 + tot, 1 / yrs) - 1) * 100;
}
const median = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
const fmtP = x => x == null ? T().none : pctPlain(x);
const sgn = x => x == null ? '' : x < 0 ? 'neg' : 'pos';
function cgLabel(f) {
  const t = T().cg; if (!f.cg) return T().none;
  if (f.cg === 'turto') return t.turto;
  if (f.cg[0] === 'b') { const m = f.n.match(/(\d{4})\s*[-–]\s*(\d{4})/); return m ? t.born(m[1], m[2]) : f.cg; }
  return t[f.cg] || f.cg;
}
const label = f => `${f.c} · ${f.n}`;
const rgHtml = f => f.risk ? `<span class="rg ${f.risk}" title="${hEsc(T().rg[f.risk])}">${T().rgS[f.risk]}</span>` : `<span class="note">${T().rgNone}</span>`;

/* ---------- Apžvalga ---------- */
let RKH = 'y1', EEK = 'na';
function renderOv() {
  const t = T(), act = BX.filter(f => !f.closed);
  $('ovT').textContent = t.ovT; $('ovL').textContent = t.ovL;
  $('kp').innerHTML = ['LT', 'LV', 'EE'].map(c => {
    const fs = act.filter(f => f.c === c), ii = fs.filter(f => f.pl === 'II'), na = ii.reduce((s, f) => s + (f.na || 0), 0), inv = ii.reduce((s, f) => s + (f.inv || 0), 0);
    const fees = fs.filter(f => f.fee != null).map(f => f.fee), hr = ii.filter(f => f.risk === 'r4').map(f => ret(f, 'y1')).filter(x => x != null);
    return `<section class="card"><h3><span class="flag">${c}</span>${t.c[c]}</h3><p>${t.kFunds(ii.length, fs.length - ii.length)}</p>`
      + (c === 'LV' ? `<p>${t.kNaLv}</p>` : `<p>${t.kNa(na >= 1000 ? `${num(na / 1000, 2)} ${lang === 'lt' ? 'mlrd. €' : 'bn €'}` : `${num(na, 0)} ${lang === 'lt' ? 'mln. €' : 'm €'}`)}</p>`)
      + (inv ? `<p>${t.kInv(num(inv, 0))}</p>` : '')
      + (fees.length ? `<p>${t.kFee(pctPlain(fees.reduce((a, b) => a + b, 0) / fees.length), t.feeK[fs.find(f => f.fee != null).feeK])}</p>` : `<p>${t.feeLt}</p>`)
      + (hr.length ? `<p>${t.kR(pctPlain(median(hr)), hr.length)}</p>` : '') + '</section>';
  }).join('');
  $('rkT').textContent = t.rkT; $('rkN').textContent = t.rkN;
  $('rkSeg').innerHTML = ['y1', 'y3', 'y5', 'y10', 'ytd'].map(h => `<button type="button" data-h="${h}" aria-pressed="${h === RKH}">${t.hz[h]}</button>`).join('');
  $('rkTbl').innerHTML = `<thead><tr><th>${t.thRisk}</th>${['LT', 'LV', 'EE'].map(c => `<th class="n">${t.c[c]}</th>`).join('')}</tr></thead><tbody>`
    + ['r1', 'r2', 'r3', 'r4'].map(r => `<tr><td>${rgHtml({ risk: r })} ${hEsc(t.rg[r])}</td>${['LT', 'LV', 'EE'].map(c => {
      const xs = act.filter(f => f.c === c && f.risk === r).map(f => ({ f, v: ret(f, RKH) })).filter(x => x.v != null);
      if (!xs.length) return `<td class="n">${t.none}</td>`;
      const b = xs.reduce((a, x) => x.v > a.v ? x : a);
      return `<td class="n"><b>${fmtP(median(xs.map(x => x.v)))}</b> <small class="note">${t.nF(xs.length)}</small><br><small class="note">${hEsc(b.f.n)} ${fmtP(b.v)}</small></td>`;
    }).join('')}</tr>`).join('') + '</tbody>';
  const E = (BALTIC.tot || {}).EE;
  $('eeT').textContent = t.eeT; $('eeN').textContent = t.eeN;
  $('eeSeg').innerHTML = ['na', 'inv'].map(k => `<button type="button" data-k="${k}" aria-pressed="${k === EEK}">${t.eeSeg[k]}</button>`).join('');
  if (E) {
    const md = m => Math.round(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0) / DAY);
    const ser = (EEK === 'inv' ? ['II'] : ['II', 'III']).filter(p => E[p]).map((p, i) => ({ provider: p, label: t.pl(p), color: PAL[i], points: E[p].m.map((m, j) => [md(m), E[p][EEK][j]]).filter(x => x[1] != null) }));
    const xs = ser.flatMap(s => s.points.map(p => p[0]));
    drawLineChart($('eeCh'), ser, Math.min(...xs), Math.max(...xs), { zero: true, axisUnit: '', fmt: v => num(v, 0) });
  }
}
$('rkSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; RKH = b.dataset.h; renderOv(); });
$('eeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; EEK = b.dataset.k; renderOv(); });

/* ---------- Visi fondai ---------- */
const FS = { c: { LT: true, LV: true, EE: true }, pl: 'II', g: '', q: '', closed: false, sort: 'y1', dir: -1 };
try { Object.assign(FS, JSON.parse(localStorage.getItem('bxF') || '{}')); } catch (e) {}
let SEL = null;
try { SEL = JSON.parse(localStorage.getItem('bxSel') || 'null'); } catch (e) {}
const saveF = () => { try { localStorage.setItem('bxF', JSON.stringify(FS)); localStorage.setItem('bxSel', JSON.stringify(SEL)); } catch (e) {} };
function defaults() {                           // kiekvienai šaliai – didžiausias didelės rizikos II pakopos fondas (LV – ilgiausios istorijos)
  return ['LT', 'LV', 'EE'].map(c => BX.filter(f => f.c === c && f.pl === 'II' && !f.closed && f.risk === 'r4')
    .sort((a, b) => (b.na || 0) - (a.na || 0) || a.first - b.first)[0]).filter(Boolean).map(f => f.id);
}
if (!SEL) SEL = defaults();
const COLS = ['cmp', 'c', 'pl', 'm', 'n', 'cg', 'risk', 'vol', 'y1', 'y3', 'y5', 'y10', 'max', 'fee', 'eq', 'na', 'inv', 'last'];
const NUMC = new Set(['vol', 'y1', 'y3', 'y5', 'y10', 'max', 'fee', 'eq', 'na', 'inv', 'last']);
function rows() {
  const q = FS.q.trim().toLowerCase();
  return BX.filter(f => FS.c[f.c] && (FS.pl === 'all' || f.pl === FS.pl) && (FS.closed || !f.closed)
    && (!FS.g || (FS.g[0] === 'r' ? f.risk === FS.g : `${f.c}:${f.cg}` === FS.g))
    && (!q || `${f.n} ${f.m}`.toLowerCase().includes(q)))
    .map(f => ({ f, y1: ret(f, 'y1'), y3: ret(f, 'y3'), y5: ret(f, 'y5'), y10: ret(f, 'y10'), max: ret(f, 'max') }));
}
function sortVal(r, k) {
  const f = r.f;
  return { c: f.c, pl: f.pl, m: f.m, n: f.n, cg: cgLabel(f), risk: f.risk || 'r9', vol: f.vol, fee: f.fee, eq: f.eq, na: f.na, inv: f.inv, last: f.last, cmp: SEL.includes(f.id) ? 0 : 1 }[k] ?? r[k];
}
function renderFd() {
  const t = T();
  $('fdT').textContent = t.fdT; $('fdL').textContent = t.fdL;
  const cgs = [...new Set(BX.filter(f => f.cg && f.pl === (FS.pl === 'all' ? f.pl : FS.pl)).map(f => `${f.c}:${f.cg}`))].sort();
  $('flt').innerHTML = `<div class="chips">${['LT', 'LV', 'EE'].map(c => `<button type="button" class="chip" data-c="${c}" aria-pressed="${FS.c[c]}"><span class="flag">${c}</span>${t.c[c]}</button>`).join('')}</div>`
    + `<div class="seg" role="group">${['II', 'III', 'all'].map(p => `<button type="button" data-pl="${p}" aria-pressed="${FS.pl === p}">${p === 'all' ? t.both : t.pl(p)}</button>`).join('')}</div>`
    + `<select id="fG"><option value="">${t.fAll}</option><optgroup label="${hEsc(t.fRisk)}">${['r1', 'r2', 'r3', 'r4'].map(r => `<option value="${r}"${FS.g === r ? ' selected' : ''}>${hEsc(t.rg[r])}</option>`).join('')}</optgroup>`
    + ['LT', 'LV'].map(c => { const o = cgs.filter(x => x.startsWith(c + ':')); return o.length ? `<optgroup label="${hEsc(t.fCg(t.c[c]))}">${o.map(x => { const f = BX.find(y => `${y.c}:${y.cg}` === x); return `<option value="${x}"${FS.g === x ? ' selected' : ''}>${hEsc(cgLabel(f))}</option>`; }).join('')}</optgroup>` : ''; }).join('') + '</select>'
    + `<input type="search" id="fQ" placeholder="${hEsc(t.fQ)}" value="${hEsc(FS.q)}">`
    + `<label class="field"><input type="checkbox" id="fC"${FS.closed ? ' checked' : ''}> ${t.fClosed}</label>`;
  const rs = rows().sort((a, b) => { const x = sortVal(a, FS.sort), y = sortVal(b, FS.sort); if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1; return (typeof x === 'string' ? x.localeCompare(y) : x - y) * FS.dir; });
  const cell = (r, k) => { const f = r.f;
    switch (k) {
      case 'cmp': return `<td><input type="checkbox" data-id="${f.id}"${SEL.includes(f.id) ? ' checked' : ''} aria-label="${hEsc(t.cols.cmp)}"></td>`;
      case 'c': return `<td><span class="flag">${f.c}</span></td>`; case 'pl': return `<td>${f.pl}</td>`; case 'm': return `<td>${hEsc(f.m)}</td>`;
      case 'n': return `<td class="nm">${hEsc(f.n)}</td>`; case 'cg': return `<td>${hEsc(cgLabel(f))}</td>`; case 'risk': return `<td>${rgHtml(f)}</td>`;
      case 'vol': return `<td class="n">${f.vol == null ? t.none : pctPlain(f.vol)}</td>`;
      case 'fee': return `<td class="n" title="${f.feeK ? hEsc(t.feeK[f.feeK]) : ''}">${f.fee == null ? t.none : pctPlain(f.fee)}</td>`;
      case 'eq': return `<td class="n">${f.eq == null ? t.none : num(f.eq, 0) + pctSfx()}</td>`;
      case 'na': return `<td class="n">${f.na == null ? t.none : num(f.na, 1)}</td>`; case 'inv': return `<td class="n">${f.inv == null ? t.none : num(f.inv, 0)}</td>`;
      case 'last': return `<td class="n" title="${hEsc(iso(f.first))} – ${hEsc(iso(f.last))}">${iso(f.last)}</td>`;
      default: return `<td class="n ${sgn(r[k])}">${fmtP(r[k])}</td>`;
    } };
  $('fTbl').innerHTML = `<thead><tr>${COLS.map(k => `<th data-k="${k}"${NUMC.has(k) ? ' class="n"' : ''}${FS.sort === k ? ` aria-sort="${FS.dir > 0 ? 'ascending' : 'descending'}"` : ''}>${t.cols[k]}</th>`).join('')}</tr></thead>`
    + `<tbody>${rs.map(r => `<tr${SEL.includes(r.f.id) ? ' class="cmp"' : ''}>${COLS.map(k => cell(r, k)).join('')}</tr>`).join('')}</tbody>`;
  $('fN').textContent = t.fN(rs.length);
  $('fG').addEventListener('change', e => { FS.g = e.target.value; saveF(); renderFd(); });
  $('fQ').addEventListener('input', e => { FS.q = e.target.value; saveF(); clearTimeout(renderFd.q); renderFd.q = setTimeout(() => { renderFd(); const i = $('fQ'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 250); });
  $('fC').addEventListener('change', e => { FS.closed = e.target.checked; saveF(); renderFd(); });
}
$('flt').addEventListener('click', e => {
  const c = e.target.closest('[data-c]'), p = e.target.closest('[data-pl]');
  if (c) { FS.c[c.dataset.c] = !FS.c[c.dataset.c]; if (!Object.values(FS.c).some(Boolean)) FS.c[c.dataset.c] = true; }
  else if (p) { FS.pl = p.dataset.pl; if (FS.g && FS.g[0] !== 'r') FS.g = ''; }
  else return;
  saveF(); renderFd();
});
$('fTbl').addEventListener('click', e => {
  const cb = e.target.closest('input[data-id]');
  if (cb) { SEL = cb.checked ? [...SEL, cb.dataset.id].slice(-10) : SEL.filter(x => x !== cb.dataset.id); saveF(); renderFd(); renderCmp(); return; }
  const th = e.target.closest('th[data-k]'); if (!th) return;
  const k = th.dataset.k; FS.dir = FS.sort === k ? -FS.dir : (NUMC.has(k) ? -1 : 1); FS.sort = k; saveF(); renderFd();
});

/* ---------- Palyginti ---------- */
let CH = 'y5';
function renderCmp() {
  const t = T(), fs = SEL.map(id => BX.find(f => f.id === id)).filter(Boolean);
  $('cmT').textContent = t.cmT; $('cmL').textContent = t.cmL;
  $('cmBar').innerHTML = `<div class="seg" role="group">${['y1', 'y3', 'y5', 'y10', 'max'].map(h => `<button type="button" data-h="${h}" aria-pressed="${h === CH}">${t.hz[h]}</button>`).join('')}</div>`
    + `<input type="search" id="cmQ" list="cmList" placeholder="${hEsc(t.cmAdd)}"><datalist id="cmList">${BX.filter(f => !SEL.includes(f.id)).map(f => `<option value="${hEsc(`${f.c} · ${f.pl} · ${f.n}`)}">`).join('')}</datalist>`
    + `<button type="button" class="btn" id="cmDef">${t.cmDef}</button><button type="button" class="btn" id="cmClr">${t.cmClear}</button>`;
  $('cmSel').innerHTML = fs.map((f, i) => `<button type="button" class="chip" data-rm="${f.id}"><i style="background:${PAL[i % PAL.length]}"></i><span class="flag">${f.c}</span> ${hEsc(f.n)} <span class="x">×</span></button>`).join('');
  $('cmQ').addEventListener('change', e => { const v = e.target.value, f = BX.find(x => `${x.c} · ${x.pl} · ${x.n}` === v); if (f && !SEL.includes(f.id)) { SEL = [...SEL, f.id].slice(-10); saveF(); renderCmp(); renderFd(); } });
  if (!fs.length) { $('cmCh').innerHTML = `<p class="note">${t.cmNone}</p>`; $('cmTbl').innerHTML = ''; $('cmN').textContent = ''; return; }
  const x1 = Math.max(...fs.map(f => f.last)), minStart = Math.max(...fs.map(f => f.first));
  const x0 = CH === 'max' ? minStart : Math.max(minStart, x1 - Math.round(365.25 * +CH.slice(1)));
  const ser = fs.map((f, i) => { const s = at(f, x0) || { d: f.first, v: f.V[0] }; const pts = [[x0, 0]];
    f.D.forEach((d, j) => { if (d > x0 && d <= x1) pts.push([d, (f.V[j] / s.v - 1) * 100]); });
    return { provider: f.id, label: `${f.c} ${f.n}`, color: PAL[i % PAL.length], points: pts }; });
  $('cmCh').innerHTML = '';
  drawLineChart($('cmCh'), ser, x0, x1, {});
  $('cmTbl').innerHTML = `<thead><tr>${['n', 'r', 'a', 'vol', 'fee', 'risk'].map(k => `<th${k === 'n' || k === 'risk' ? '' : ' class="n"'}>${t.cmCols[k]}</th>`).join('')}</tr></thead><tbody>`
    + fs.map((f, i) => { const s = at(f, x0) || { d: f.first, v: f.V[0] }, e = at(f, x1) || { d: f.last, v: f.V[f.V.length - 1] }, tot = (e.v / s.v - 1) * 100, yrs = (e.d - s.d) / 365.25, ann = yrs >= 1 ? (Math.pow(e.v / s.v, 1 / yrs) - 1) * 100 : null;
      return `<tr><td class="nm"><i class="sw" style="background:${PAL[i % PAL.length]};display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px"></i><span class="flag">${f.c}</span> ${hEsc(f.n)} <small class="note">${f.pl} · ${hEsc(f.m)}</small></td><td class="n ${sgn(tot)}">${fmtP(tot)}</td><td class="n ${sgn(ann)}">${fmtP(ann)}</td><td class="n">${f.vol == null ? t.none : pctPlain(f.vol)}</td><td class="n">${f.fee == null ? t.none : pctPlain(f.fee)}</td><td>${rgHtml(f)}</td></tr>`; }).join('') + '</tbody>';
  $('cmN').textContent = t.cmFrom(iso(x0), iso(x1));
}
$('cmBar').addEventListener('click', e => {
  const b = e.target.closest('[data-h]'); if (b) { CH = b.dataset.h; renderCmp(); return; }
  if (e.target.closest('#cmDef')) { SEL = defaults(); saveF(); renderCmp(); renderFd(); }
  if (e.target.closest('#cmClr')) { SEL = []; saveF(); renderCmp(); renderFd(); }
});
$('cmSel').addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (!b) return; SEL = SEL.filter(x => x !== b.dataset.rm); saveF(); renderCmp(); renderFd(); });

/* ---------- Excel: fondai ir vertės su formulėmis ---------- */
async function excel() {
  const t = T(), rs = rows(), wb = XL.book(), xd = d => ({ v: d + 25569, z: 'yyyy-mm-dd', s: 'in' }), xv = v => ({ v, z: '0.00000', s: 'in' });
  XL.sheet(wb, t.xlS, [[{ v: t.xlT, s: 'title' }], [{ v: t.srcLine, s: 'sub' }], [], t.xlH.map(h => ({ v: h, s: 'hdr' })),
    ...rs.map(({ f }) => [t.c[f.c], f.pl, f.m, f.n, cgLabel(f), f.risk ? t.rg[f.risk] : t.rgNone, f.vol, f.fee, f.feeK ? t.feeK[f.feeK] : '', f.eq, f.na, f.inv, xd(f.first)])],
    { cols: [10, 7, 12, 44, 22, 26, 10, 9, 24, 9, 11, 11, 12], freeze: { r: 4 } });
  const V = [[{ v: t.xlV, s: 'title' }], [{ v: lang === 'lt' ? '1 m. grąža = vertė ÷ vertė prieš 1 m. − 1; 3 ir 5 m. – metinė: (vertė ÷ pradžios vertė)^(365,25 ÷ dienų) − 1.' : '1 y return = value ÷ value 1 y ago − 1; 3 and 5 y – annual: (value ÷ start value)^(365.25 ÷ days) − 1.', s: 'note' }], [], t.xlVH.map(h => ({ v: h, s: 'hdr' }))];
  rs.forEach(({ f }, i) => { const r = i + 5, e = at(f, f.last), row = [t.c[f.c], f.pl, f.n, xd(e.d), xv(e.v)];
    [[1, 'F', 'G', 'H'], [3, 'I', 'J', 'K'], [5, 'L', 'M', 'N']].forEach(([y, cd, cv]) => { const s = at(f, e.d - Math.round(365.25 * y));
      if (!s) { row.push(null, null, null); return; }
      row.push(xd(s.d), xv(s.v), { f: y === 1 ? `E${r}/${cv}${r}-1` : `(E${r}/${cv}${r})^(365.25/(D${r}-${cd}${r}))-1`, z: '0.00%', s: 'calc', v: y === 1 ? e.v / s.v - 1 : Math.pow(e.v / s.v, 365.25 / (e.d - s.d)) - 1 }); });
    V.push(row); });
  XL.sheet(wb, t.xlV, V, { cols: [10, 7, 44, 12, 11, 12, 11, 10, 12, 11, 10, 12, 11, 10], freeze: { r: 4 } });
  const tmp = document.createElement('div'); tmp.innerHTML = MT[lang];
  XL.sheet(wb, t.xlM, [[{ v: t.mtT, s: 'title' }], ...[...tmp.querySelectorAll('h3, p, li')].map(n => [{ v: (n.tagName === 'LI' ? '• ' : '') + n.textContent, s: n.tagName === 'H3' ? 'b' : '' }])], { cols: [140] });
  await XL.save(wb, `${t.xlT} ${iso(TOP)}.xlsx`);
}
$('xlBtn').addEventListener('click', () => excel().catch(e => console.error(e)));

function render() {
  const t = T();
  document.title = `${t.navBaltic} · ${t.siteTitle}`;
  $('xlBtn').textContent = t.xl;
  renderOv(); renderFd(); renderCmp();
  $('mtT').textContent = t.mtT; $('mtB').innerHTML = MT[lang];
  $('foot').textContent = t.srcLine;
  addSubnav([{ id: 'ovT', label: lang === 'lt' ? 'Apžvalga' : 'Overview' }, { id: 'fdT', label: t.fdT }, { id: 'cmT', label: lang === 'lt' ? 'Palyginti' : 'Compare' }, { id: 'mtT', label: t.mtT }]);
}
renderHeader('baltic', render);
render();
addEventListener('resize', () => { clearTimeout(render.r); render.r = setTimeout(() => { renderOv(); renderCmp(); }, 200); });
