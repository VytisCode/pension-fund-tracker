/* ---------- Indekso sekimas (savininkas 2026-11-19): SEB II pakopos fondų grąža − lyginamojo indekso grąža ----------
   Tik SEB kasdien skelbia lyginamąjį indeksą (fondo puslapis, tools/fetch_seb_bench.py → data/nav_history.csv benchmark_index → docs/bench.js).
   Skirtumas = fondo grąža − indekso grąža tam pačiam laikotarpiui, procentiniais punktais (kaip savininko Excel „vs Index“):
   – YTD kiekvieną dieną: bazė – paskutinė praėjusių metų diena, kurią turi ir fondas, ir indeksas;
   – mėnesio: nuo paskutinės praėjusio mėnesio dienos iki paskutinės to mėnesio dienos (einamasis mėnuo – iki paskutinės turimos dienos);
   – sekimo paklaida: paskutinių 36 pilnų mėnesių skirtumų standartinis nuokrypis × √12 (dienos skirtumai išpūstų dėl skirtingo vertinimo laiko).
   Excel – įrodymų failas: lapas „Duomenys“ (mėlyni vieneto vertė ir indeksas), visi rezultatai – formulės. */
const BMT = {
  lt: { tab: 'Indekso sekimas', lead: 'Kaip SEB II pakopos fondų grąža atitinka jų lyginamąjį indeksą: fondo grąža − indekso grąža, procentiniais punktais (p. p.). Kiti Lietuvos valdytojai indekso reikšmių kasdien neskelbia.',
    pres: 'Turto išsaugojimo', ytdH: 'Skirtumas nuo metų pradžios (YTD) kiekvieną dieną', monH: 'Mėnesio skirtumas', date: 'Data', month: 'Mėnuo', year: 'Metai', rows: 'Eilutės', all: 'visos',
    yRow: y => `${y} m. iš viso`, part: d => `iki ${d}`, none: 'SEB lyginamojo indekso duomenų nėra.',
    capY: (y, b) => `Kiekviena eilutė: fondo grąža − indekso grąža nuo ${b} iki tos dienos. Žalia – fondas lenkia indeksą, raudona – atsilieka.`,
    capM: 'Mėnesio fondo grąža − mėnesio indekso grąža (nuo praėjusio mėnesio paskutinės dienos). Metų eilutė – kalendorinių metų skirtumas.',
    q1: 'Kiek SEB fondai šiemet lenkia indeksą ar nuo jo atsilieka?', q2: 'O šį mėnesį?', q3: 'Kaip tiksliai fondai seka indeksą?',
    s1: d => `Fondo grąža − indekso grąža nuo metų pradžios iki ${d}, p. p.`, s2: (a, d) => `Nuo ${a} iki ${d}, p. p.`, s3: (a, b) => `Sekimo paklaida pagal 36 pilnų mėnesių skirtumus (${a}–${b}), % per metus.`,
    rng: (a, b) => `nuo ${a} iki ${b} p. p.`, te: (a, b) => `${a}–${b} %`,
    i1: 'Fondo grąža – iš vieneto vertės (jau atskaičius valdymo mokestį), indekso grąža – iš SEB skelbiamo lyginamojo indekso. Bazė – paskutinė praėjusių metų diena. Teigiamas skirtumas – fondas uždirbo daugiau nei indeksas.',
    i2: 'Mėnesio skirtumas: fondo grąža − indekso grąža nuo praėjusio mėnesio paskutinės dienos iki paskutinės turimos dienos.',
    i3: 'Sekimo paklaida (tracking error) – kiek svyruoja fondo ir indekso mėnesio grąžų skirtumas: paskutinių 36 pilnų mėnesių skirtumų standartinis nuokrypis × √12. Mėnesiai, o ne dienos – nes fondo vieneto vertė ir indeksas gali būti įvertinti skirtingu laiku, todėl dienos skirtumai svyruoja daugiau, nei iš tikrųjų skiriasi portfelis. Kuo mažesnė, tuo artimiau fondas seka indeksą; ji nerodo, ar fondas lenkia, ar atsilieka.',
    src: 'Šaltinis: SEB fondų puslapiai (vieneto vertė ir lyginamasis indeksas).', xlName: 'SEB_indekso_sekimas' },
  en: { tab: 'Benchmark tracking', lead: 'How the returns of SEB second-pillar funds match their benchmark: fund return − benchmark return, in percentage points (pp). Other Lithuanian managers do not publish daily benchmark values.',
    pres: 'Asset preservation', ytdH: 'Year-to-date (YTD) difference each day', monH: 'Monthly difference', date: 'Date', month: 'Month', year: 'Year', rows: 'Rows', all: 'all',
    yRow: y => `${y} full year`, part: d => `to ${d}`, none: 'No SEB benchmark data.',
    capY: (y, b) => `Each row: fund return − benchmark return from ${b} to that day. Green – fund ahead of the benchmark, red – behind.`,
    capM: 'Monthly fund return − monthly benchmark return (from the last day of the previous month). Year row – calendar-year difference.',
    q1: 'How far are SEB funds ahead of or behind the benchmark this year?', q2: 'And this month?', q3: 'How closely do the funds track the benchmark?',
    s1: d => `Fund return − benchmark return year-to-date to ${d}, pp.`, s2: (a, d) => `From ${a} to ${d}, pp.`, s3: (a, b) => `Tracking error from 36 full-month differences (${a}–${b}), % a year.`,
    rng: (a, b) => `${a} to ${b} pp`, te: (a, b) => `${a}–${b}%`,
    i1: 'Fund return – from the unit value (after the management fee); benchmark return – from the benchmark published by SEB. Base – the last day of the previous year. A positive difference means the fund earned more than the benchmark.',
    i2: 'Monthly difference: fund return − benchmark return from the last day of the previous month to the latest available day.',
    i3: 'Tracking error – how much the monthly difference between fund and benchmark returns varies: standard deviation of the last 36 full-month differences × √12. Months rather than days, because the unit value and the benchmark may be valued at different times, so daily differences vary more than the portfolios really differ. The lower, the closer the fund tracks the benchmark; it does not show whether the fund is ahead or behind.',
    src: 'Source: SEB fund pages (unit value and benchmark).', xlName: 'SEB_benchmark_tracking' } };
BMT.lv = { ...BMT.en, tab: 'Indeksa sekošana' }; BMT.et = { ...BMT.en, tab: 'Indeksi järgimine' };
const bmT = () => BMT[ulang] || BMT[lang] || BMT.en;
const BM_ORDER = ['turto', '1961-1967', '1968-1974', '1975-1981', '1982-1988', '1989-1995', '1996-2002', '2003-2009'];
const BM = { y: null, n: 15, done: false };

function bmFunds() {      // [{ k, lab, f, days[], u[], b[] }] – tik dienos, kurias turi ir fondas, ir indeksas
  if (typeof BENCH === 'undefined') return [];
  return BM_ORDER.map(k => {
    const g = DATA.groups.find(x => x.id === k), f = g && g.funds.find(x => x.provider === 'SEB'), bb = f && BENCH[f.name];
    if (!bb) return null;
    const um = new Map(f.d.map((d, i) => [d, f.v[i]])), days = [], u = [], b = [];
    bb.d.forEach((d, i) => { if (um.has(d) && bb.b[i] > 0) { days.push(d); u.push(um.get(d)); b.push(bb.b[i]); } });
    return days.length > 1 ? { k, lab: k === 'turto' ? bmT().pres : k, f, days, u, b, at: new Map(days.map((d, i) => [d, i])) } : null;
  }).filter(Boolean);
}
const bmYear = d => new Date(d * DAY).getUTCFullYear(), bmYM = d => { const x = new Date(d * DAY); return x.getUTCFullYear() * 12 + x.getUTCMonth(); };
const bmLastBefore = (s, day) => { let r = -1; for (let i = 0; i < s.days.length && s.days[i] < day; i++) r = i; return r; };
const bmDiff = (s, i0, i1) => i0 < 0 || i1 < 0 ? null : ((s.u[i1] / s.u[i0]) - (s.b[i1] / s.b[i0])) * 100;
const bmYStart = y => Date.UTC(y, 0, 1) / DAY;
function bmMonths(s) {     // { ym: [i0, i1] }: i1 – paskutinė mėnesio diena, i0 – paskutinė ankstesnio mėnesio diena
  const last = {}; s.days.forEach((d, i) => { last[bmYM(d)] = i; });
  const out = {}; Object.keys(last).map(Number).forEach(ym => { if (last[ym - 1] != null) out[ym] = [last[ym - 1], last[ym]]; });
  return out;
}
function bmUnion(F) { return [...new Set(F.flatMap(s => s.days))].sort((a, b) => a - b); }
const BM_TE_N = 36;   // sekimo paklaida – 36 pilni mėnesiai (dienos skirtumai išpūstų dėl skirtingo fondo ir indekso vertinimo laiko)
function bmTEm(s) {       // [{ ym, i0, i1 }] – paskutiniai pilni mėnesiai (be einamojo)
  const M = bmMonths(s), cur = bmYM(s.days[s.days.length - 1]);
  return Object.keys(M).map(Number).filter(ym => ym < cur).sort((a, b) => a - b).slice(-BM_TE_N).map(ym => ({ ym, i0: M[ym][0], i1: M[ym][1] }));
}
function bmTE(F) {
  return F.map(s => { const x = bmTEm(s).map(o => bmDiff(s, o.i0, o.i1) / 100); if (x.length < 12) return null;
    const m = x.reduce((p, v) => p + v, 0) / x.length; return Math.sqrt(x.reduce((p, v) => p + (v - m) ** 2, 0) / (x.length - 1)) * Math.sqrt(12) * 100; });
}
const bmFmt = v => { if (v == null) return '–'; const r = Math.round(v * 100) / 100; return (r > 0 ? '+' : r < 0 ? '−' : '') + num(Math.abs(r), 2); };
const bmHeat = v => v == null ? '' : ` style="background:${heatColor(v * 3)}"`;
const bmCol = v => v >= 0 ? 'var(--good, #2e7d5b)' : 'var(--bad, #b5523b)';
const bmD = d => iso(d).replace(/-/g, '.');
const bmYmTxt = ym => `${Math.floor(ym / 12)}-${String(ym % 12 + 1).padStart(2, '0')}`;

function renderBm() {
  const sec = document.getElementById('bmSec'); if (!sec) return; const t = bmT();
  const F = bmFunds();
  document.getElementById('bmTitle').textContent = t.tab; document.getElementById('bmLead').textContent = t.lead;
  if (!F.length) { document.getElementById('bmBody').innerHTML = `<p class="lead">${t.none}</p>`; return; }
  const U = bmUnion(F), end = U[U.length - 1], Y = bmYear(end);
  if (BM.y == null) BM.y = Y;
  // kortelės
  const ytd = F.map(s => { const i1 = s.days.length - 1; return bmYear(s.days[i1]) === Y ? bmDiff(s, bmLastBefore(s, bmYStart(Y)), i1) : null; });
  const mtd = F.map(s => { const i1 = s.days.length - 1, m = bmMonths(s)[bmYM(s.days[i1])]; return m ? bmDiff(s, m[0], m[1]) : null; });
  const mBase = (() => { const s = F[0], m = bmMonths(s)[bmYM(s.days[s.days.length - 1])]; return m ? s.days[m[0]] : null; })();
  const te = bmTE(F), tm = bmTEm(F[0]);
  const bars = vals => ecBars(F.map((s, i) => [s.lab, bmCol(vals[i] || 0), vals[i] || 0, bmFmt(vals[i]), false, vals[i] == null ? null : +vals[i].toFixed(4)]).filter((r, i) => vals[i] != null));
  const rg = vals => { const v = vals.filter(x => x != null); return v.length ? t.rng(bmFmt(Math.min(...v)), bmFmt(Math.max(...v))) : '–'; };
  const tv = te.filter(x => x != null);
  document.getElementById('bmCards').innerHTML =
    ecCard({ sz: 'm', ic: 'arrow-trending', ey: 'SEB', q: t.q1, big: rg(ytd), sub: t.s1(bmD(end)), info: t.i1 + ' ' + t.src, vis: bars(ytd), xf: 'bmXl', k: 'bm1', xu: 'p. p.' })
    + ecCard({ sz: 'm', ic: 'calendar-ltr', ey: 'SEB', q: t.q2, big: rg(mtd), sub: mBase ? t.s2(bmD(mBase), bmD(end)) : '', info: t.i2 + ' ' + t.src, vis: bars(mtd), xf: 'bmXl', k: 'bm2', xu: 'p. p.' })
    + ecCard({ sz: 'm', ic: 'target-arrow', ey: 'SEB', q: t.q3, big: tv.length ? t.te(num(Math.min(...tv), 2), num(Math.max(...tv), 2)) : '–',
      sub: tm.length ? t.s3(bmD(F[0].days[tm[0].i0]), bmD(F[0].days[tm[tm.length - 1].i1])) : '', info: t.i3 + ' ' + t.src,
      vis: ecBars(F.map((s, i) => [s.lab, '#6b7f99', te[i] || 0, te[i] == null ? '–' : num(te[i], 2) + pctSfx(), false, te[i] == null ? null : +te[i].toFixed(4)])), xf: 'bmXl', k: 'bm3', xu: '%' });
  if (typeof ecFold === 'function') ecFold(document.getElementById('bmCards'));
  // YTD lentelė
  const years = [...new Set(U.map(bmYear))].sort((a, b) => b - a);
  const yDays = U.filter(d => bmYear(d) === BM.y).reverse(), shown = BM.n ? yDays.slice(0, BM.n) : yDays;
  const base = F.map(s => bmLastBefore(s, bmYStart(BM.y)));
  const bj = base.findIndex(x => x >= 0), baseDay = bj < 0 ? null : F[bj].days[base[bj]];
  const head = first => `<thead><tr><th style="text-align:left">${first}</th>${F.map(s => `<th>${hEsc(s.lab)}</th>`).join('')}</tr></thead>`;
  const yRows = shown.map(d => `<tr><td style="text-align:left">${bmD(d)}</td>${F.map((s, j) => { const i = s.at.get(d), v = i == null ? null : bmDiff(s, base[j], i); return `<td${bmHeat(v)}>${bmFmt(v)}</td>`; }).join('')}</tr>`).join('');
  // mėnesių lentelė
  const MS = F.map(bmMonths), yms = [...new Set(MS.flatMap(m => Object.keys(m).map(Number)))].sort((a, b) => b - a);
  const mName = ym => new Date(Date.UTC(Math.floor(ym / 12), ym % 12, 1)).toLocaleDateString(T().locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  let mRows = '', prevY = null;
  yms.forEach(ym => {
    const yy = Math.floor(ym / 12);
    if (yy !== prevY) {
      const cal = F.map(s => { const i1 = bmLastBefore(s, bmYStart(yy + 1)); return i1 >= 0 && bmYear(s.days[i1]) === yy ? bmDiff(s, bmLastBefore(s, bmYStart(yy)), i1) : null; });
      mRows += `<tr class="grp"><td style="text-align:left"><b>${t.yRow(yy)}${yy === Y ? ' (' + t.part(bmD(end)) + ')' : ''}</b></td>${cal.map(v => `<td${bmHeat(v)}><b>${bmFmt(v)}</b></td>`).join('')}</tr>`; prevY = yy;
    }
    mRows += `<tr><td style="text-align:left">${mName(ym)}${ym === bmYM(end) ? ' (' + t.part(bmD(end)) + ')' : ''}</td>${MS.map((m, j) => { const v = m[ym] ? bmDiff(F[j], m[ym][0], m[ym][1]) : null; return `<td${bmHeat(v)}>${bmFmt(v)}</td>`; }).join('')}</tr>`;
  });
  document.getElementById('bmBody').innerHTML =
    `<div class="group-h"><span>${t.ytdH}</span> <label class="field">${t.year} <select id="bmYear">${years.map(y => `<option value="${y}"${y === BM.y ? ' selected' : ''}>${y}</option>`).join('')}</select></label>
     <label class="field">${t.rows} <select id="bmN">${[15, 30, 60, 0].map(n => `<option value="${n}"${n === BM.n ? ' selected' : ''}>${n || t.all}</option>`).join('')}</select></label>
     <button type="button" class="btn xls" id="bmXlsBtn">⤓ Excel</button></div>
     <div class="cap">${t.capY(BM.y, baseDay ? bmD(baseDay) : '–')}</div><div class="card scroll"><table class="metrics" id="tBmY">${head(t.date)}<tbody>${yRows}</tbody></table></div>
     <div class="group-h"><span>${t.monH}</span></div>
     <div class="cap">${t.capM}</div><div class="card scroll"><table class="metrics" id="tBmM">${head(t.month)}<tbody>${mRows}</tbody></table></div>
     <p class="cap">${t.src}</p>`;
  document.getElementById('bmYear').onchange = e => { BM.y = +e.target.value; renderBm(); };
  document.getElementById('bmN').onchange = e => { BM.n = +e.target.value; renderBm(); };
  document.getElementById('bmXlsBtn').onclick = () => bmXl();
}

/* Excel įrodymų failas: „Duomenys“ – mėlyni pradiniai skaičiai (vieneto vertė, indeksas), kiti lapai – formulės, nurodančios į juos */
async function bmXl() {
  const L = lang === 'lt', t = bmT(), F = bmFunds(); if (!F.length) return;
  const U = bmUnion(F), row = new Map(U.map((d, i) => [d, i + 5])), end = U[U.length - 1], Y = bmYear(end), wb = XL.book();
  const uc = j => XL.col(1 + 2 * j), bc = j => XL.col(2 + 2 * j), DS = L ? 'Duomenys' : 'Data';
  const ref = (c, r) => `'${DS}'!${c}${r}`;
  const d0 = [[{ v: L ? 'SEB II pakopos fondai: vieneto vertė ir lyginamasis indeksas' : 'SEB II pillar funds: unit value and benchmark', s: 'title' }],
    [{ v: t.src + (L ? ' Mėlyni skaičiai – pradiniai duomenys; juodi – formulės.' : ' Blue numbers – source data; black – formulas.'), s: 'note' }],
    [null, ...F.flatMap(s => [{ v: s.lab, s: 'b' }, null])],
    [{ v: t.date, s: 'hdr' }, ...F.flatMap(() => [{ v: L ? 'Vieneto vertė' : 'Unit value', s: 'hdr' }, { v: L ? 'Indeksas' : 'Benchmark', s: 'hdr' }])]];
  U.forEach(d => d0.push([{ v: d + 25569, z: 'yyyy-mm-dd', s: 'in' }, ...F.flatMap(s => { const k = s.at.get(d);
    return k == null ? [null, null] : [{ v: s.u[k], z: '0.0000', s: 'in' }, { v: s.b[k], z: '0.0000', s: 'in' }]; })]));
  const f = (s, j, i0, i1) => i0 < 0 || i1 < 0 ? null : { f: `(${ref(uc(j), row.get(s.days[i1]))}/${ref(uc(j), row.get(s.days[i0]))}-${ref(bc(j), row.get(s.days[i1]))}/${ref(bc(j), row.get(s.days[i0]))})*100`, v: bmDiff(s, i0, i1), z: '0.00', s: 'calc' };
  const hdr = first => [{ v: first, s: 'hdr' }, ...F.map(s => ({ v: s.lab, s: 'hdr' }))];
  // YTD – visos pasirinktų metų dienos
  const base = F.map(s => bmLastBefore(s, bmYStart(BM.y))), bj = base.findIndex(x => x >= 0);
  const y = [[{ v: `${t.ytdH}, ${BM.y} (p. p.)`, s: 'title' }], [{ v: t.capY(BM.y, bj < 0 ? '–' : bmD(F[bj].days[base[bj]])), s: 'note' }], hdr(t.date)];
  U.filter(d => bmYear(d) === BM.y).reverse().forEach(d => y.push([{ v: d + 25569, z: 'yyyy-mm-dd', s: 'in' }, ...F.map((s, j) => { const i = s.at.get(d); return i == null ? null : f(s, j, base[j], i); })]));
  // mėnesiai ir metai
  const MS = F.map(bmMonths), yms = [...new Set(MS.flatMap(m => Object.keys(m).map(Number)))].sort((a, b) => b - a);
  const m = [[{ v: t.monH + ' (p. p.)', s: 'title' }], [{ v: t.capM, s: 'note' }], hdr(t.month)];
  let prevY = null;
  yms.forEach(ym => { const yy = Math.floor(ym / 12);
    if (yy !== prevY) { m.push([{ v: t.yRow(yy) + (yy === Y ? ' (' + t.part(bmD(end)) + ')' : ''), s: 'b' }, ...F.map((s, j) => { const i1 = bmLastBefore(s, bmYStart(yy + 1)); return i1 >= 0 && bmYear(s.days[i1]) === yy ? f(s, j, bmLastBefore(s, bmYStart(yy)), i1) : null; })]); prevY = yy; }
    m.push([bmYmTxt(ym) + (ym === bmYM(end) ? ' (' + t.part(bmD(end)) + ')' : ''), ...MS.map((mm, j) => mm[ym] ? f(F[j], j, mm[ym][0], mm[ym][1]) : null)]); });
  // sekimo paklaida: 36 pilnų mėnesių skirtumai (formulės) → STDEV.S × √12
  const te = bmTE(F), TM = F.map(s => new Map(bmTEm(s).map(o => [o.ym, o]))), YMS = [...new Set(TM.flatMap(x => [...x.keys()]))].sort((a, b) => a - b), n = YMS.length;
  const tk = [[{ v: t.q3, s: 'title' }], [{ v: t.i3, s: 'note' }], [], hdr(L ? 'Rodiklis' : 'Measure'),
    [{ v: L ? 'Sekimo paklaida, % per metus' : 'Tracking error, % a year', s: 'b' }, ...F.map((s, j) => te[j] == null ? null : { f: `STDEV.S(${XL.col(j + 1)}7:${XL.col(j + 1)}${6 + n})*SQRT(12)`, v: te[j], z: '0.00', s: 'res' })],
    [{ v: L ? 'Mėnesio skirtumai, p. p.:' : 'Monthly differences, pp:', s: 'note' }]];
  YMS.forEach(ym => tk.push([bmYmTxt(ym), ...F.map((s, j) => { const o = TM[j].get(ym); return o ? f(s, j, o.i0, o.i1) : null; })]));
  XL.sheet(wb, 'YTD', y, { cols: [12, ...F.map(() => 14)], freeze: { r: 3, c: 1 } });
  XL.sheet(wb, L ? 'Mėnesiai' : 'Months', m, { cols: [30, ...F.map(() => 14)], freeze: { r: 3, c: 1 } });
  XL.sheet(wb, L ? 'Sekimo paklaida' : 'Tracking error', tk, { cols: [30, ...F.map(() => 14)] });
  XL.sheet(wb, DS, d0, { cols: [12, ...F.flatMap(() => [12, 12])], freeze: { r: 4, c: 1 } });
  await XL.save(wb, `${t.xlName}_${iso(end)}.xlsx`);
}
window.bmXl = bmXl;

(function bmInit() {
  const sec = document.getElementById('bmSec'); if (!sec) return;
  const go = () => { if (BM.done || sec.hidden) return; BM.done = true; (typeof loadBench === 'function' ? loadBench() : Promise.resolve()).then(renderBm); };
  new MutationObserver(go).observe(document.body, { attributes: true, attributeFilter: ['data-ptab'] });
  go();
})();
