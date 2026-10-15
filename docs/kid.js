/* Ataskaitų polapis, 5 dalis: KID veiklos rezultatų scenarijai (Reglamento (ES) 2017/653 IV priedas) – lentelė tokio pat formato kaip
   valdytojų III pakopos PID (savininko prašymas 2026-10-14), su pasirenkamu fondu, laikymo ir stebėjimo laikotarpiu, akcijų dalimi ir išlaidomis.
   Skaičiuojama čia pat iš REP.kidm (mėnesių pabaigų MSCI ACWI EUR NR ir sintetinis ECB 7 m. AAA obligacijų indeksas, kid_scenarios.py);
   numatytosios reikšmės – f.kid (PID, jei turime, arba mūsų taisyklė). Excel – visas skaičiavimas formulėmis. */
addStrings({
  kidTitle: 'KID performance scenarios', kidLead: 'By the EU key information document method (Regulation 2017/653, Annex IV), in the same layout as the managers’ KIDs: what 1,000 € invested at the start of each year could become after 1 year, about half the recommended holding period and the full period. Choose the fund and, if you wish, change the holding and observation periods, the equity share and costs; the Excel file has the whole calculation as formulas.',
  kidFund: 'Fund', kidRhpY: 'Holding period, years', kidEq: 'Equities, %', kidCost: 'Costs, % a year', kidFrom: 'Observation from', kidTo: 'to', kidReset: 'Defaults',
  kidInv: 'Investment 1,000 EUR a year', kidScH: 'Scenarios', kidRec: '(Recommended holding period)', kidYr: n => `${n} ${n === 1 ? 'year' : 'years'}`,
  kidSc: ['Stress scenario', 'Unfavourable scenario', 'Moderate scenario', 'Favourable scenario'], kidGet: 'What you might get back after costs', kidRet: 'Average return each year', kidPaid: 'Amount invested over time',
  kidIntro: (a, b) => `The scenarios shown are illustrations based on the available historical data of the fund’s benchmark from ${a} to ${b} showing the possible worst, average and best results of the pension fund over the stated periods.`,
  kidOurs: 'Our calculation', kidPid: d => `Manager’s KID (${d})`, kidDiff: 'Difference (ours − KID)', kidDiffNote: 'Return – percentage points, amount – €.',
  kidWait: 'Waiting for the bond index data (collected automatically).', kidShort: 'The observation period must be longer than the holding period and fit in the index history: ',
  kidRule: 'Holding period and equity share are our assumption (no KID of the manager): life-cycle funds – years to 65 for the middle of the birth-year group (at least 5, at most 20), asset preservation – 5; pillar III by type.',
  kidPidSrc: 'Defaults are taken from the manager’s KID.',
  kidBenchNote: 'Benchmark: the series the manager used in its own KID calculation (value before costs, month-ends; received from the manager). If you change the equity share, the proxy below is used instead. Average return each year for 1 year is the scenario return, for longer periods – XIRR of the payments (as in the KID).',
  kidNote: 'Proxy benchmark: equity share × MSCI ACWI EUR Net Return + the rest × synthetic euro area AAA government 7-year bond index (ECB yield curve), rebalanced monthly; month-end values. Not a forecast.',
  kidInfo: 'Method (Regulation (EU) 2017/653 Annex IV as amended by 2021/2268, category 2 product):\n\n• Observation period = RHP + 5 years (at least 10), by default ending on 31 December of the last full year; month-end values. You can enter another period.\n• Costs (ongoing + transaction, % a year): 1/12 is subtracted from every monthly return (as in SEB’s KID calculation).\n• For each period n (1 year, half the RHP rounded, RHP) every overlapping n-year window is taken: moderate = median, favourable = maximum, unfavourable = minimum, also counting windows of 1…n years that end at the period end (their growth is treated as growth over n years).\n• Stress: 90th (1 year – 99th) percentile of the rolling (population) standard deviation of monthly log returns (6 / 12 months), Cornish-Fisher with skewness and excess kurtosis of the last 60 months; never better than unfavourable.\n• 1,000 € at the start of each year; amount = Σ 1000 × (1 + r)^k; average return each year for longer periods – XIRR of these payments (dates from 2000-01-01, as in the KID).\n\nCheck against SEB KIDs (2026-04-30): with SEB’s own benchmark series (SEB pensija 18+) unfavourable, moderate and favourable match the KID to the cent; the stress scenario is still ~1.5 pp a year harsher than SEB’s (details of SEB’s calculation awaited). With our proxy, equity funds differ by 0.1–0.3 pp a year. Mixed and bond funds differ more because our bond proxy (7-year AAA government) is not the fund’s bond benchmark.\n\nExcel: sheets “Months” (index, value after costs, log returns, rolling deviations), “Windows” (all windows) and “Calculation” (median, max, min, stress) – all formulas.',
  kidShM: 'Months', kidShW: 'Windows', kidShC: 'Calculation', kidShT: 'Scenarios',
}, {
  kidTitle: 'KID veiklos rezultatų scenarijai', kidLead: 'Pagal ES pagrindinės informacijos dokumento (KID / PID) metodiką (Reglamentas 2017/653, IV priedas), tokio pat formato lentele kaip valdytojų PID: kiek galėtų tapti 1000 €, investuojamų kiekvienų metų pradžioje, po 1 metų, maždaug pusės rekomenduojamo laikymo laikotarpio ir viso laikotarpio. Pasirinkite fondą ir, jei norite, pakeiskite laikymo ir stebėjimo laikotarpį, akcijų dalį ir išlaidas; Excel faile – visas skaičiavimas formulėmis.',
  kidFund: 'Fondas', kidRhpY: 'Laikymo laikotarpis, metai', kidEq: 'Akcijos, %', kidCost: 'Išlaidos, % per metus', kidFrom: 'Stebėjimas nuo', kidTo: 'iki', kidReset: 'Numatytieji',
  kidInv: 'Investicija 1 000 EUR per metus', kidScH: 'Scenarijai', kidRec: '(Rekomenduojamas laikymo laikotarpis)', kidYr: n => `${n} ${n % 10 === 0 || (n % 100 > 9 && n % 100 < 21) ? 'metų' : 'metai'}`,
  kidSc: ['Nepalankiausias scenarijus', 'Nepalankus scenarijus', 'Nuosaikus scenarijus', 'Palankus scenarijus'], kidGet: 'Ką galite atgauti atskaičius išlaidas', kidRet: 'Metinė vidutinė grąža', kidPaid: 'Sukaupta investuota suma',
  kidIntro: (a, b) => `Pateikiami scenarijai yra pavyzdžiai, kurie naudojant turimus pensijų fondo lyginamojo indekso istorinius duomenis nuo ${a} iki ${b} d. parodo galimus blogiausius, vidutinius ir geriausius pensijų fondo rezultatus nurodytais laikotarpiais.`,
  kidOurs: 'Mūsų skaičiavimas', kidPid: d => `Valdytojo PID (${d})`, kidDiff: 'Skirtumas (mūsų − PID)', kidDiffNote: 'Grąža – procentiniais punktais, suma – eurais.',
  kidWait: 'Laukiama obligacijų indekso duomenų (renkami automatiškai).', kidShort: 'Stebėjimo laikotarpis turi būti ilgesnis už laikymo laikotarpį ir tilpti į indekso istoriją: ',
  kidRule: 'Laikymo laikotarpis ir akcijų dalis – mūsų prielaida (valdytojo PID neturime): gyvenimo ciklo fondams – metai iki 65 m. gimimo metų grupės viduriui (ne mažiau 5, ne daugiau 20), turto išsaugojimo – 5; III pakopos – pagal fondo rūšį.',
  kidPidSrc: 'Numatytosios reikšmės paimtos iš valdytojo PID.',
  kidBenchNote: 'Lyginamasis indeksas – eilutė, kurią valdytojas naudojo savo PID skaičiavime (vertė prieš išlaidas, mėnesių pabaigos; gauta iš valdytojo). Pakeitus akcijų dalį naudojamas toliau aprašytas pakaitinis indeksas. Metinė vidutinė grąža: 1 metams – scenarijaus grąža, ilgesniems laikotarpiams – įmokų XIRR (kaip PID).',
  kidNote: 'Pakaitinis lyginamasis indeksas: akcijų dalis × MSCI ACWI EUR Net Return + likusi dalis × sintetinis euro zonos AAA vyriausybės 7 m. obligacijų indeksas (ECB pajamingumo kreivė), perbalansuojama kas mėnesį; mėnesių pabaigų vertės. Tai ne prognozė.',
  kidInfo: 'Metodika (Reglamento (ES) 2017/653 IV priedas su 2021/2268 pakeitimais, 2 kategorijos produktas):\n\n• Stebėjimo laikotarpis = RHP + 5 metai (ne mažiau 10), numatytasis – baigiasi paskutinių pilnų metų gruodžio 31 d.; mėnesių pabaigų vertės. Galite įvesti kitą laikotarpį.\n• Išlaidos (einamosios + sandorių, % per metus): iš kiekvieno mėnesio grąžos atimama 1/12 (kaip SEB PID skaičiavime).\n• Kiekvienam laikotarpiui n (1 metai, pusė RHP suapvalinus, RHP) imami visi persidengiantys n metų langai: nuosaikus = mediana, palankus = didžiausias, nepalankus = mažiausias, įskaitant ir 1…n metų langus, kurie baigiasi laikotarpio pabaigoje (jų augimas laikomas n metų augimu).\n• Nepalankiausias (stresinis): mėnesio log grąžų slenkančio (populiacijos) standartinio nuokrypio (6 / 12 mėn.) 90-asis (1 metams – 99-asis) procentilis, Cornish-Fisher su paskutinių 60 mėn. asimetrija ir ekscesu; ne geresnis už nepalankų.\n• 1000 € kiekvienų metų pradžioje; suma = Σ 1000 × (1 + r)^k; ilgesnių laikotarpių metinė vidutinė grąža – šių įmokų XIRR (datos nuo 2000-01-01, kaip PID).\n\nPatikra su SEB PID (2026-04-30): su paties SEB lyginamojo indekso eilute (SEB pensija 18+) nepalankus, nuosaikus ir palankus sutampa su PID iki cento; nepalankiausias kol kas ~1,5 p. p. per metus griežtesnis nei SEB (laukiama SEB skaičiavimo detalių). Su mūsų pakaitiniu indeksu akcijų fondų skirtumai 0,1–0,3 p. p. per metus. Mišrių ir obligacijų fondų skirtumai didesni, nes mūsų obligacijų indeksas (7 m. AAA vyriausybės) nėra fondo obligacijų lyginamasis indeksas.\n\nExcel: lapai „Mėnesiai“ (indeksas, vertė atskaičius išlaidas, log grąžos, slenkantys nuokrypiai), „Langai“ (visi langai) ir „Skaičiavimai“ (mediana, didžiausias, mažiausias, stresinis) – viskas formulėmis.',
  kidShM: 'Mėnesiai', kidShW: 'Langai', kidShC: 'Skaičiavimai', kidShT: 'Scenarijai',
});
const kidAmt = (r, n) => { const x = r / 100; return Math.abs(x) < 1e-12 ? 1000 * n : 1000 * (Math.pow(1 + x, n + 1) - (1 + x)) / x; };
/* XIRR kaip PID: −1000 kiekvienų metų sausio 1 d. nuo 2000 m., gauta suma po n metų; dienos / 365 */
function kidXirr(r, n) {
  if (n <= 1) return r;
  const A = kidAmt(r, n), d = k => (Date.UTC(2000 + k, 0, 1) - Date.UTC(2000, 0, 1)) / 864e5;
  const npv = x => { let v = A / Math.pow(1 + x, d(n) / 365); for (let k = 0; k < n; k++) v -= 1000 / Math.pow(1 + x, d(k) / 365); return v; };
  let lo = -0.99, hi = 1;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (npv(m) > 0) lo = m; else hi = m; }
  return (lo + hi) / 2 * 100;
}
const kidKey = f => `${f.pl}|${f.p}|${f.n}`;
const kidYm = s => { const [y, m] = s.split('-').map(Number); return y * 12 + m - 1; };
const kidYs = i => `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`;
const KS = { f: '', o: {} };                 // pasirinktas fondas ir pakeisti parametrai (tik šiai naršyklei)
try { Object.assign(KS, JSON.parse(localStorage.getItem('kidstate')) || {}); } catch (e) {}
const kidSave = () => { try { localStorage.setItem('kidstate', JSON.stringify(KS)); } catch (e) {} };

/* pakaitinio indekso mėnesių eilutė [pirmas mėnuo, lygiai]; akcijų dalis ≥ 99,9 % – tik akcijos */
function kidLevels(eq, bench) {
  const X = bench && REP.kidm.x && REP.kidm.x[bench];
  if (X) { const s = kidYm(X.s0); return { s, end: s + X.v.length - 1, L: X.v, onlyE: true, bench }; }
  const K = REP.kidm, e0 = kidYm(K.e0), w = eq / 100, onlyE = w >= 0.999 || !K.b;
  const b0 = onlyE ? e0 : kidYm(K.b0), s = Math.max(e0, b0), end = Math.min(e0 + K.e.length, onlyE ? Infinity : b0 + K.b.length) - 1;
  const E = i => K.e[i - e0], B = i => K.b[i - b0], L = [100];
  for (let i = s + 1; i <= end; i++) L.push(L[L.length - 1] * (1 + w * (E(i) / E(i - 1) - 1) + (onlyE ? 0 : (1 - w) * (B(i) / B(i - 1) - 1))));
  return { s, end, L, onlyE };
}
const kidStd = a => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); };   // populiacijos

/* p = {eq, rhp, cost, from, to} (from/to – mėnesių numeriai: pirmas ir paskutinis stebėjimo mėnuo) */
function kidCalc(p) {
  const { s, end, L, onlyE, bench } = kidLevels(p.eq, p.bench), base = p.from - 1, N = p.to - base;
  if (base < s || p.to > end || N < 12 * p.rhp + 12) return { err: `${kidYs(s + 1)} – ${kidYs(end)}`, s, end };
  const c = p.cost / 100, L0 = L[base - s], Ln = L.slice(base - s, base - s + N + 1).map(v => v / L0 * 100), px = [100];
  for (let i = 1; i < Ln.length; i++) px.push(px[i - 1] * (Ln[i] / Ln[i - 1] - c / 12));   // kaip SEB: iš mėnesio grąžos atimama c / 12
  const r = px.slice(1).map((v, i) => Math.log(v / px[i])), rr = r.slice(-60), m = rr.reduce((x, y) => x + y, 0) / rr.length;
  const M2 = rr.reduce((x, y) => x + (y - m) ** 2, 0) / rr.length, mu1 = rr.reduce((x, y) => x + (y - m) ** 3, 0) / rr.length / M2 ** 1.5,
    mu2 = rr.reduce((x, y) => x + (y - m) ** 4, 0) / rr.length / M2 ** 2 - 3;
  const mid = Math.floor(p.rhp / 2 + 0.5), ns = [...new Set([1, mid, p.rhp])], per = {};
  for (const n of ns) {
    const g = (a, b) => Math.pow(px[b] / px[a], 1 / n) - 1, wins = [], tail = [];
    for (let a = 0; a + 12 * n <= N; a++) wins.push(g(a, a + 12 * n));
    if (n > 1) for (let a = Math.max(0, N - 12 * n); a <= N - 12; a++) tail.push(g(a, N));
    const srt = [...wins].sort((x, y) => x - y), h = srt.length >> 1, med = srt.length % 2 ? srt[h] : (srt[h - 1] + srt[h]) / 2;
    const unf = Math.min(srt[0], ...tail), w = n === 1 ? 6 : 12, q = n === 1 ? 0.99 : 0.90, vols = [];
    for (let i = 0; i + w <= r.length; i++) vols.push(kidStd(r.slice(i, i + w)));
    vols.sort((x, y) => x - y);
    const k = Math.ceil(+(q * vols.length).toFixed(9)), sig = vols[Math.min(vols.length, k) - 1], NN = 12 * n, z = n === 1 ? -2.326347874 : -1.644853627;
    const cf = z + (z * z - 1) / 6 * mu1 / Math.sqrt(NN) + (z ** 3 - 3 * z) / 24 * mu2 / NN - (2 * z ** 3 - 5 * z) / 36 * mu1 ** 2 / NN;
    const st0 = Math.pow(Math.exp(sig * Math.sqrt(NN) * cf - 0.5 * sig * sig * NN), 1 / n) - 1;
    per[n] = { ret: [Math.min(st0, unf), unf, med, srt[srt.length - 1]].map(v => v * 100), nw: wins.length, nt: tail.length, w, q, k, sig, z, cf, st0 };
  }
  return { ns: [1, mid, p.rhp], per, N, base, px, r, m, M2, mu1, mu2, L: Ln, onlyE, bench };
}

function kidFunds() {
  return REP.funds.filter(f => f.p === ST.m && f.kid).sort((a, b) => (a.pl > b.pl) - (a.pl < b.pl) || (a.pl === 'II' ? ORDER2.indexOf(a.g) - ORDER2.indexOf(b.g) : ORDER3.indexOf(a.g) - ORDER3.indexOf(b.g) || a.n.localeCompare(b.n)));
}
function kidDefaults(f) {
  const k = f.kid, to = k.to ? kidYm(k.to.slice(0, 7)) : kidYm(`${new Date().getFullYear() - 1}-12`);
  return { rhp: k.rhp, eq: k.eq, cost: k.cost ?? 0.5, to, from: to - 12 * Math.max(k.rhp + 5, 10) + 1 };
}

/* PID formato lentelė: rows = 4 scenarijai × [suma, grąža]; ys – laikotarpių metai */
function kidTableHtml(ys, ret, amt, fmtR, fmtA) {
  const S = T();
  const head = `<thead><tr><th class="l" colspan="2">${S.kidInv}</th>${ys.map((n, i) => `<th>${S.kidYr(n)}${i === 2 ? `<br><small>${S.kidRec}</small>` : ''}</th>`).join('')}</tr>`
    + `<tr><th class="l" colspan="2">${S.kidScH}</th><th></th><th></th><th></th></tr></thead>`;
  let b = '';
  S.kidSc.forEach((sc, j) => {
    b += `<tr class="kt"><th class="l" rowspan="2">${sc}</th><td class="l">${S.kidGet}</td>${ys.map((_, i) => `<td>${fmtA(amt[i][j])}</td>`).join('')}</tr>`
      + `<tr><td class="l">${S.kidRet}</td>${ys.map((_, i) => `<td>${fmtR(ret[i][j])}</td>`).join('')}</tr>`;
  });
  b += `<tr class="kt"><th class="l" colspan="2">${S.kidPaid}</th>${ys.map(n => `<td>${num(1000 * n, 0)} EUR</td>`).join('')}</tr>`;
  return head + `<tbody>${b}</tbody>`;
}
const kidEur = v => `${num(v, 2)} EUR`, kidPct = v => `${num(v, 2)}%`;

function renderKid() {
  const S = T(), fs = kidFunds(), box = document.getElementById('kidBox');
  document.getElementById('kidTitle').innerHTML = `${S.kidTitle} ${ik('kid')} ${xbtn('kid')}`;
  document.getElementById('kidLead').textContent = S.kidLead;
  MODELS.kid = null;
  if (!fs.length || !REP.kidm) { box.innerHTML = ''; return; }
  const f = fs.find(x => kidKey(x) === KS.f) || fs.find(x => x.kid.off) || fs[0], fk = kidKey(f), d = kidDefaults(f), o = KS.o[fk] || {}, p = { ...d, ...o };
  const opts = fs.map(x => `<option value="${kidKey(x)}"${x === f ? ' selected' : ''}>${x.pl} · ${shortName(x)}</option>`).join('');
  const inp = (k, v, a) => `<input type="number" data-k="${k}" value="${v}" ${a}>`, mon = (k, v) => `<input type="month" data-k="${k}" value="${kidYs(v)}">`;
  let html = `<div class="controls kidc">${field(S.kidFund, `<select id="kidF">${opts}</select>`)}${field(S.kidRhpY, inp('rhp', p.rhp, 'min="1" max="25" step="1" style="width:5em"'))}`
    + `${field(S.kidEq, inp('eq', p.eq, 'min="0" max="100" step="1" style="width:5em"'))}${field(S.kidCost, inp('cost', p.cost, 'min="0" max="5" step="0.01" style="width:6em"'))}`
    + `${field(S.kidFrom, mon('from', p.from))}${field(S.kidTo, mon('to', p.to))}<button class="btn" type="button" id="kidReset"${Object.keys(o).length ? '' : ' disabled'}>${S.kidReset}</button></div>`;
  p.bench = f.kid.bench && p.eq === d.eq && REP.kidm.x && REP.kidm.x[f.kid.bench] ? f.kid.bench : null;
  const R = p.eq < 99.9 && !REP.kidm.b && !p.bench ? { wait: 1 } : kidCalc(p);
  if (R.wait) html += `<p class="note">${S.kidWait}</p>`;
  else if (R.err) html += `<p class="note late">${S.kidShort}${R.err}.</p>`;
  else {
    const ys = R.ns, rr = ys.map(n => R.per[n].ret), amt = ys.map((n, i) => rr[i].map(v => kidAmt(v, n))), ret = ys.map((n, i) => rr[i].map(v => kidXirr(v, n)));
    html += `<p class="kidi">${S.kidIntro(kidYs(p.from) + '-01', isoEnd(p.to))}</p><h3 class="kidh">${S.kidOurs}: ${f.n}</h3>`
      + `<div class="scroll"><table class="rt kidp">${kidTableHtml(ys, ret, amt, kidPct, kidEur)}</table></div>`;
    const k = f.kid;
    if (k.off) {
      const ov = k.off.s, oa = k.off.a;
      html += `<h3 class="kidh">${S.kidPid(k.off.doc)}</h3><p class="kidi">${S.kidIntro(k.off.from, k.off.to)}</p>`
        + `<div class="scroll"><table class="rt kidp">${kidTableHtml(k.off.years, ov, oa, kidPct, kidEur)}</table></div>`;
      if (k.off.years.every((n, i) => n === ys[i]))
        html += `<h3 class="kidh">${S.kidDiff}</h3><div class="scroll"><table class="rt kidp">${kidTableHtml(ys, ret.map((r, i) => r.map((v, j) => v - ov[i][j])), amt.map((r, i) => r.map((v, j) => v - oa[i][j])), v => pp(v), v => `${pp(v)} EUR`)}</table></div><p class="note">${S.kidDiffNote}</p>`;
    }
    MODELS.kid = { f, p, R, ret, rr, amt };
  }
  html += `<p class="note">${f.kid.src === 'pid' ? S.kidPidSrc : S.kidRule} ${p.bench ? S.kidBenchNote + ' ' : ''}${S.kidNote}</p>`;
  box.innerHTML = html;
  document.getElementById('kidF').onchange = e => { KS.f = e.target.value; kidSave(); renderKid(); };
  document.getElementById('kidReset').onclick = () => { delete KS.o[fk]; kidSave(); renderKid(); };
  box.querySelectorAll('input[data-k]').forEach(el => el.addEventListener('change', () => {
    const k = el.dataset.k, cur = { ...(KS.o[fk] || {}) };
    if (k === 'from' || k === 'to') { if (!el.value) return; cur[k] = kidYm(el.value); }
    else { const v = parseFloat(el.value); if (!isFinite(v)) return; cur[k] = k === 'rhp' ? Math.max(1, Math.round(v)) : v;
      if (k === 'rhp') cur.from = (cur.to ?? d.to) - 12 * Math.max(cur.rhp + 5, 10) + 1; }   // pakeitus RHP – stebėjimas RHP + 5 m.
    KS.o[fk] = cur; kidSave(); renderKid();
  }));
}
const isoEnd = i => { const y = Math.floor(i / 12), m = i % 12 + 1, last = new Date(Date.UTC(y, m, 0)).getUTCDate(); return `${y}-${String(m).padStart(2, '0')}-${last}`; };

/* Excel: visas skaičiavimas formulėmis */
function kidBook() {
  const X = MODELS.kid; if (!X) return null;
  const S = T(), { f, p, R } = X, MN = `'${S.kidShM}'`, WN = `'${S.kidShW}'`, CN = `'${S.kidShC}'`;
  const col = i => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
  const N = R.N, last = N + 2, P = (v, z = '0.0000%') => ({ t: 'n', v, z }), F = (f, v, z = '0.0000%') => ({ t: 'n', f, v, z });
  // Mėnesiai: eilutė 2 – bazinis mėnuo (diena prieš stebėjimo pradžią), 3… – stebėjimo mėnesiai
  const K = REP.kidm, e0 = kidYm(K.e0), b0 = K.b ? kidYm(K.b0) : 0;
  const mh = lang === 'lt' ? ['Mėnuo', 'MSCI ACWI EUR NR', 'Obligacijų indeksas (ECB 7 m. AAA)', 'Pakaitinis indeksas', 'Mėn. nuo pradžios', 'Vertė atskaičius išlaidas', 'Mėnesio log grąža', 'Slenkantis nuokrypis 6 mėn.', 'Slenkantis nuokrypis 12 mėn.']
    : ['Month', 'MSCI ACWI EUR NR', 'Bond index (ECB 7Y AAA)', 'Proxy index', 'Months from start', 'Value after costs', 'Monthly log return', 'Rolling deviation 6 m', 'Rolling deviation 12 m'];
  if (R.bench) mh[1] = (lang === 'lt' ? 'Valdytojo KID indeksas: ' : 'Manager’s KID index: ') + R.bench;
  const M = [mh];
  for (let i = 0; i <= N; i++) {
    const ym = R.base + i, rw = i + 2, e = R.bench ? REP.kidm.x[R.bench].v[ym - kidYm(REP.kidm.x[R.bench].s0)] : K.e[ym - e0], b = R.onlyE ? null : K.b[ym - b0];
    const lvl = i ? F(R.onlyE ? `D${rw - 1}*(B${rw}/B${rw - 1})` : `D${rw - 1}*(1+${CN}!$B$4*(B${rw}/B${rw - 1}-1)+(1-${CN}!$B$4)*(C${rw}/C${rw - 1}-1))`, R.L[i], '0.0000') : P(100, '0.0000');
    M.push([kidYs(ym), e, b, lvl, i, (i ? F(`F${rw - 1}*(D${rw}/D${rw - 1}-${CN}!$B$5/12)`, R.px[i], '0.0000') : P(100, '0.0000')),
      i ? F(`LN(F${rw}/F${rw - 1})`, R.r[i - 1], '0.000000') : null,
      i >= 6 ? F(`STDEVP(G${rw - 5}:G${rw})`, kidStd(R.r.slice(i - 6, i)), '0.000000') : null,
      i >= 12 ? F(`STDEVP(G${rw - 11}:G${rw})`, kidStd(R.r.slice(i - 12, i)), '0.000000') : null]);
  }
  // Langai: kiekvienam laikotarpiui – pradžia, pabaiga, metinė grąža; n > 1 – ir langai iki laikotarpio pabaigos
  const W = [[]], WH = [[]], ref = {};
  let c = 0;
  R.ns.forEach((n, j) => {
    if (j === 2 && n === R.ns[1]) { ref[j] = ref[1]; return; }
    const pr = R.per[n], gc = col(c + 2), base = c;
    WH[0][c] = `${S.kidYr(n)}: ${lang === 'lt' ? 'pradžia' : 'start'}`; WH[0][c + 1] = lang === 'lt' ? 'pabaiga' : 'end'; WH[0][c + 2] = lang === 'lt' ? 'metinė grąža' : 'annual return';
    for (let a = 0; a < pr.nw; a++) {
      W[a + 1] = W[a + 1] || [];
      W[a + 1][c] = kidYs(R.base + a); W[a + 1][c + 1] = kidYs(R.base + a + 12 * n);
      W[a + 1][c + 2] = F(`(${MN}!F${a + 12 * n + 2}/${MN}!F${a + 2})^(1/${n})-1`, Math.pow(R.px[a + 12 * n] / R.px[a], 1 / n) - 1);
    }
    ref[j] = { w: `${WN}!${gc}2:${gc}${pr.nw + 1}` };
    c += 3;
    if (n > 1) {
      const tc = col(c + 1), a0 = Math.max(0, N - 12 * n);
      WH[0][c] = `${S.kidYr(n)}: ${lang === 'lt' ? 'langai iki pabaigos – pradžia' : 'windows to the end – start'}`; WH[0][c + 1] = lang === 'lt' ? 'metinė grąža' : 'annual return';
      for (let a = a0, k = 0; a <= N - 12; a++, k++) {
        W[k + 1] = W[k + 1] || [];
        W[k + 1][c] = kidYs(R.base + a);
        W[k + 1][c + 1] = F(`(${MN}!F${last}/${MN}!F${a + 2})^(1/${n})-1`, Math.pow(R.px[N] / R.px[a], 1 / n) - 1);
      }
      ref[j].t = `${WN}!${tc}2:${tc}${pr.nt + 1}`;
      c += 2;
    }
    c++; void base;
  });
  const Wrows = [WH[0], ...W.slice(1)].map(r => Array.from({ length: c }, (_, i) => r[i] ?? null));
  // Skaičiavimai
  const g0 = Math.max(3, last - 59), G = `${MN}!G${g0}:G${last}`, L = lang === 'lt';
  const C = [[`${f.n} · ${S.kidTitle}`], [S.kidFund, f.n],
    [L ? 'Akcijų dalis' : 'Equity share', null], [L ? 'Akcijų dalis (koeficientas)' : 'Equity share (fraction)', P(p.eq / 100, '0.00%')],
    [L ? 'Išlaidos per metus' : 'Costs a year', P(p.cost / 100, '0.00%')], [L ? 'Laikymo laikotarpis (RHP), metai' : 'Holding period (RHP), years', p.rhp],
    [L ? 'Stebėjimo laikotarpis' : 'Observation period', `${kidYs(p.from)} – ${kidYs(p.to)}`],
    [L ? 'Paskutinių 60 mėn. log grąžų vidurkis' : 'Mean of the last 60 monthly log returns', F(`AVERAGE(${G})`, R.m, '0.000000')],
    [L ? 'Dispersija (populiacijos)' : 'Variance (population)', F(`VARP(${G})`, R.M2, '0.00000000')],
    [L ? 'Asimetrija' : 'Skewness', F(`SUMPRODUCT((${G}-B8)^3)/COUNT(${G})/B9^1.5`, R.mu1, '0.0000')],
    [L ? 'Ekscesas' : 'Excess kurtosis', F(`SUMPRODUCT((${G}-B8)^4)/COUNT(${G})/B9^2-3`, R.mu2, '0.0000')], []];
  C[2] = [L ? 'Pakaitinis indeksas' : 'Proxy index', R.bench ? (L ? 'valdytojo KID indeksas: ' : 'manager’s KID index: ') + R.bench : R.onlyE ? 'MSCI ACWI EUR NR' : (L ? 'akcijų dalis × MSCI ACWI + likusi × obligacijų indeksas' : 'equity share × MSCI ACWI + rest × bond index')];
  const hdr = 13, cl = ['B', 'C', 'D'];
  const lab = L ? ['Laikotarpis, metai', 'Langų skaičius', 'Nuosaikus (mediana)', 'Palankus (didžiausias)', 'Mažiausias n metų langas', 'Mažiausias langas iki pabaigos', 'Nepalankus', 'Nuokrypio langas, mėn.', 'Procentilis', 'Procentilio eilės nr.', 'Nuokrypis σ', 'Mėnesių skaičius N', 'z', 'Cornish-Fisher', 'Stresinis (prieš ribą)', 'Nepalankiausias (stresinis)']
    : ['Period, years', 'Number of windows', 'Moderate (median)', 'Favourable (maximum)', 'Smallest n-year window', 'Smallest window to the end', 'Unfavourable', 'Deviation window, months', 'Percentile', 'Percentile rank', 'Deviation σ', 'Number of months N', 'z', 'Cornish-Fisher', 'Stress (before cap)', 'Stress'];
  const rows = lab.map(l => [l, null, null, null]);
  R.ns.forEach((n, j) => {
    const pr = R.per[n], x = cl[j], rr = ref[j], rn = k => `${x}${hdr + k}`, H = rr.w.split('!')[1].split(':'), hc = pr.w === 6 ? 'H' : 'I';
    rows[0][j + 1] = n;
    rows[1][j + 1] = F(`COUNT(${rr.w})`, pr.nw, '0');
    rows[2][j + 1] = F(`MEDIAN(${rr.w})`, pr.ret[2] / 100);
    rows[3][j + 1] = F(`MAX(${rr.w})`, pr.ret[3] / 100);
    const minW = Math.min(...Array.from({ length: pr.nw }, (_, a) => Math.pow(R.px[a + 12 * n] / R.px[a], 1 / n) - 1));
    rows[4][j + 1] = F(`MIN(${rr.w})`, minW);
    rows[5][j + 1] = rr.t ? F(`MIN(${rr.t})`, Math.min(...Array.from({ length: pr.nt }, (_, k) => Math.pow(R.px[N] / R.px[Math.max(0, N - 12 * n) + k], 1 / n) - 1))) : null;
    rows[6][j + 1] = F(rr.t ? `MIN(${rn(4)},${rn(5)})` : rn(4), pr.ret[1] / 100);
    rows[7][j + 1] = pr.w; rows[8][j + 1] = P(pr.q, '0%');
    const vr = `${MN}!${hc}${pr.w + 2}:${hc}${last}`;
    rows[9][j + 1] = F(`ROUNDUP(ROUND(${rn(8)}*COUNT(${vr}),9),0)`, pr.k, '0');
    rows[10][j + 1] = F(`SMALL(${vr},${rn(9)})`, pr.sig, '0.000000');
    rows[11][j + 1] = F(`12*${rn(0)}`, 12 * n, '0');
    rows[12][j + 1] = P(pr.z, '0.000000000');
    const z = rn(12), Nn = rn(11);
    rows[13][j + 1] = F(`${z}+(${z}^2-1)/6*$B$10/SQRT(${Nn})+(${z}^3-3*${z})/24*$B$11/${Nn}-(2*${z}^3-5*${z})/36*$B$10^2/${Nn}`, pr.cf, '0.000000');
    rows[14][j + 1] = F(`EXP(${rn(10)}*SQRT(${Nn})*${rn(13)}-0.5*${rn(10)}^2*${Nn})^(1/${rn(0)})-1`, pr.st0);
    rows[15][j + 1] = F(`MIN(${rn(14)},${rn(6)})`, pr.ret[0] / 100);
    void H;
  });
  C.push(...rows);
  // Scenarijai – PID formato lentelė, langeliai – formulės į „Skaičiavimai“
  const scRow = [hdr + 15, hdr + 6, hdr + 2, hdr + 3], Tt = [[`${f.n} · ${S.kidTitle}`], [S.kidIntro(kidYs(p.from) + '-01', isoEnd(p.to))], [],
    [S.kidInv, '', ...R.ns.map((n, i) => S.kidYr(n) + (i === 2 ? ' ' + S.kidRec : ''))], [S.kidScH]];
  S.kidSc.forEach((sc, j) => {
    const rets = R.ns.map((n, i) => ({ c: `${CN}!${cl[i]}${scRow[j]}`, v: X.rr[i][j] / 100, n }));
    Tt.push([sc, S.kidGet, ...rets.map((x, i) => F(`IF(${x.c}=0,1000*${CN}!${cl[i]}${hdr},1000*((1+${x.c})^(${CN}!${cl[i]}${hdr}+1)-(1+${x.c}))/${x.c})`, X.amt[i][j], '#,##0.00 "EUR"'))]);
    Tt.push(['', S.kidRet, ...rets.map((x, i) => x.n > 1 ? P(X.ret[i][j] / 100, '0.00%') : F(x.c, x.v, '0.00%'))]);   // n > 1 – XIRR (reikšmė)
  });
  Tt.push([S.kidPaid, '', ...R.ns.map((n, i) => F(`1000*${CN}!${cl[i]}${hdr}`, 1000 * n, '#,##0 "EUR"'))], [], [S.kidNote]);
  const wb = XLSX.utils.book_new(), add = (aoa, name, cols) => { const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols'] = cols; XLSX.utils.book_append_sheet(wb, ws, name); };
  add(Tt, S.kidShT, [{ wch: 28 }, { wch: 38 }, { wch: 16 }, { wch: 16 }, { wch: 22 }]);
  add(C, S.kidShC, [{ wch: 44 }, { wch: 16 }, { wch: 16 }, { wch: 16 }]);
  add(Wrows, S.kidShW, Array(c).fill({ wch: 12 }));
  add(M, S.kidShM, [{ wch: 10 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }]);
  return { wb, file: `${f.n.replace(/[^\p{L}\p{N}.-]+/gu, '_')}_KID.xlsx` };
}
