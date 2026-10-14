/* Ataskaitų polapis, 5 dalis: KID veiklos rezultatų scenarijai (Reglamento (ES) 2017/653 IV priedas) visiems valdytojo fondams.
   Skaičiuoja kid_scenarios.py (data_rep.js f.kid): pakaitinis indeksas (akcijų dalis × MSCI ACWI EUR + obligacijos – ECB 7 m. AAA),
   1000 € kiekvienų metų pradžioje. Kur turime valdytojo PID – šalia oficialūs skaičiai ir skirtumas (savininko sprendimas 2026-10-14). */
addStrings({
  kidTitle: 'KID performance scenarios', kidLead: 'Every fund of the manager by the EU KID method (Regulation 2017/653, Annex IV): what 1,000 € invested at the start of each year could become after 1 year, half the recommended holding period and the full period, in four scenarios. Where we have the manager’s KID, its official figures and the difference are shown below ours.',
  kidRhp: 'Holding period (RHP)', kidEq: 'Equities, %', kidCost: 'Costs, % a year', kidP1: '1 year', kidPm: 'Intermediate', kidPr: 'Recommended (RHP)',
  kidSc: ['Stress', 'Unfavourable', 'Moderate', 'Favourable'], kidOurs: 'Our calculation', kidPid: d => `Manager’s KID (${d})`, kidDiff: 'Difference, pp', kidAmt: 'Amount, €',
  kidWait: 'waiting for the bond index data (collected automatically)', kidCap: 'RHP shortened to 20 years – the equity index history starts in 2001',
  kidRule: 'RHP and equity share – our assumption', kidYrs: (n, m) => `${n} yr (intermediate ${m})`,
  kidNote: (a, b) => `Average return a year, %; hover over a cell for the amount after the period (€). Observation period ${a}–${b}. Proxy benchmark: equity share × MSCI ACWI EUR Net Return + the rest × synthetic euro area AAA government 7-year bond index (ECB yield curve), rebalanced monthly. Life-cycle funds: RHP = years to 65 for the middle of the birth-year group (at most 20). Not a forecast.`,
  kidInfo: 'Method (Regulation (EU) 2017/653 Annex IV as amended by 2021/2268, category 2 product):\n\n• Observation period = RHP + 5 years (at least 10), ending on 31 December of the last full year; month-end values.\n• Costs (ongoing + transaction, % a year) are deducted from the value.\n• For each period n (1 year, half the RHP rounded, RHP) every overlapping n-year window is taken: moderate = median, favourable = maximum, unfavourable = minimum, also counting windows of 1…n years that end at the period end (their growth is treated as growth over n years).\n• Stress: 95th (1 year – 99th) percentile of rolling volatility of monthly log returns (6 / 12 months), Cornish-Fisher with skewness and kurtosis; never better than unfavourable.\n• 1,000 € at the start of each year; amount = Σ 1000 × (1 + r)^k.\n\nCheck against SEB KIDs (2026-04-30): unfavourable, moderate and favourable differ by 0.1–0.3 pp a year (proxy instead of the fund’s Solactive benchmark); SEB’s stress scenario is ~3 pp milder.\n\nExcel: amounts are formulas from the return.',
}, {
  kidTitle: 'KID veiklos rezultatų scenarijai', kidLead: 'Visi valdytojo fondai pagal ES pagrindinės informacijos dokumento (KID / PID) metodiką (Reglamentas 2017/653, IV priedas): kiek galėtų tapti 1000 €, investuojamų kiekvienų metų pradžioje, po 1 metų, pusės rekomenduojamo laikymo laikotarpio ir viso laikotarpio – keturiais scenarijais. Kur turime valdytojo PID, po mūsų skaičiavimu rodomi oficialūs skaičiai ir skirtumas.',
  kidRhp: 'Laikymo laikotarpis (RHP)', kidEq: 'Akcijos, %', kidCost: 'Išlaidos, % per metus', kidP1: '1 metai', kidPm: 'Tarpinis', kidPr: 'Rekomenduojamas (RHP)',
  kidSc: ['Stresinis', 'Nepalankus', 'Nuosaikus', 'Palankus'], kidOurs: 'Mūsų skaičiavimas', kidPid: d => `Valdytojo PID (${d})`, kidDiff: 'Skirtumas, p. p.', kidAmt: 'Suma, €',
  kidWait: 'laukiama obligacijų indekso duomenų (renkami automatiškai)', kidCap: 'RHP sutrumpintas iki 20 metų – akcijų indekso istorija nuo 2001 m.',
  kidRule: 'RHP ir akcijų dalis – mūsų prielaida', kidYrs: (n, m) => `${n} m. (tarpinis ${m})`,
  kidNote: (a, b) => `Vidutinė metinė grąža, %; užvedus pelę ant langelio – suma laikotarpio pabaigoje (€). Stebėjimo laikotarpis ${a}–${b}. Pakaitinis lyginamasis indeksas: akcijų dalis × MSCI ACWI EUR Net Return + likusi dalis × sintetinis euro zonos AAA vyriausybės 7 m. obligacijų indeksas (ECB pajamingumo kreivė), perbalansuojama kas mėnesį. Gyvenimo ciklo fondų RHP – metai iki 65 m. gimimo metų grupės viduriui (ne daugiau 20). Tai ne prognozė.`,
  kidInfo: 'Metodika (Reglamento (ES) 2017/653 IV priedas su 2021/2268 pakeitimais, 2 kategorijos produktas):\n\n• Stebėjimo laikotarpis = RHP + 5 metai (ne mažiau 10), baigiasi paskutinių pilnų metų gruodžio 31 d.; mėnesių pabaigų vertės.\n• Išlaidos (einamosios + sandorių, % per metus) atimamos iš vertės.\n• Kiekvienam laikotarpiui n (1 metai, pusė RHP suapvalinus, RHP) imami visi persidengiantys n metų langai: nuosaikus = mediana, palankus = didžiausias, nepalankus = mažiausias, įskaitant ir 1…n metų langus, kurie baigiasi laikotarpio pabaigoje (jų augimas laikomas n metų augimu).\n• Stresinis: mėnesio log grąžų slenkančio nuokrypio (6 / 12 mėn.) 95-asis (1 metams – 99-asis) procentilis, Cornish-Fisher su asimetrija ir ekscesu; ne geresnis už nepalankų.\n• 1000 € kiekvienų metų pradžioje; suma = Σ 1000 × (1 + r)^k.\n\nPatikra su SEB PID (2026-04-30): nepalankus, nuosaikus ir palankus skiriasi 0,1–0,3 p. p. per metus (pakaitinis indeksas vietoj fondo Solactive lyginamojo indekso); SEB stresinis ~3 p. p. švelnesnis.\n\nExcel: sumos – formulės iš grąžos.',
});
const kidAmt = (r, n) => { const x = r / 100; return Math.abs(x) < 1e-9 ? 1000 * n : 1000 * (Math.pow(1 + x, n + 1) - (1 + x)) / x; };
function renderKid() {
  const S = T(), fs = REP.funds.filter(f => f.p === ST.m && f.kid).sort((a, b) => (a.pl > b.pl) - (a.pl < b.pl) || (a.pl === 'II' ? ORDER2.indexOf(a.g) - ORDER2.indexOf(b.g) : ORDER3.indexOf(a.g) - ORDER3.indexOf(b.g) || a.n.localeCompare(b.n)));
  document.getElementById('kidTitle').innerHTML = `${S.kidTitle} ${ik('kid')} ${xbtn('kid')}`;
  document.getElementById('kidLead').textContent = S.kidLead;
  const xb = new XB(), t = xb.table, num2 = v => v == null ? '–' : num(v, 2);
  const cols = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
  t.push([`${MLABEL[ST.m]} · ${S.kidTitle}`], [S.kidNote('', '').split('. ').slice(2, 3).join('')], []);
  t.push([S.thFund, '', S.kidRhp, S.kidEq, S.kidCost, ...[S.kidP1, S.kidPm, S.kidPr].flatMap(p => S.kidSc.map(s => `${p} · ${s}`))]);
  let body = '', span = [];
  for (const pl of ['II', 'III']) {
    const xs = fs.filter(f => f.pl === pl); if (!xs.length) continue;
    body += `<tr class="sep"><td colspan="17">${pl === 'II' ? S.pl2 : S.pl3}</td></tr>`;
    xs.forEach(f => {
      const k = f.kid, info = `<td>${k.s ? S.kidYrs(k.rhp, k.mid) : k.rhp + (lang === 'lt' ? ' m.' : ' yr')}${k.capped ? '*' : ''}</td><td>${num(k.eq, 0)}</td><td>${k.cost != null ? num(k.cost, 2) : '–'}</td>`;
      if (!k.s) { body += `<tr><td class="l">${shortName(f)}</td><td class="l">${S.kidOurs}</td>${info}<td class="na" colspan="12">${S.kidWait}</td></tr>`; return; }
      if (k.from) span.push(k.from, k.to);
      const ns = Object.keys(k.s).map(Number).sort((a, b) => a - b), per = ns.length === 2 ? [ns[0], ns[1], ns[1]] : ns;   // RHP = 2 – tarpinis sutampa
      const vals = per.flatMap(n => k.s[n]);
      const cells = (vs, ys, am) => vs.map((v, i) => { const n = ys[Math.floor(i / 4)], a = am ? am[i] : kidAmt(v, n); return `<td class="hc${i % 4 ? '' : ' bl'}" style="${heat(v, 12)}" title="${num(a, 2)} € · ${n} ${lang === 'lt' ? 'm.' : 'yr'}">${num2(v)}</td>`; }).join('');
      body += `<tr><td class="l"><b>${shortName(f)}</b>${k.src === 'rule' ? ` <small title="${S.kidRule}">ⓘ</small>` : ''}</td><td class="l">${S.kidOurs}</td>${info}${cells(vals, per)}</tr>`;
      const r0 = t.length + 1;
      t.push([shortName(f), S.kidOurs, k.rhp, k.eq, k.cost, ...vals.map(v => ({ v, z: '0.00%' }))]);
      t.push(['', S.kidAmt, '', '', '', ...vals.map((v, i) => { const n = per[Math.floor(i / 4)], c = `${cols[i]}${r0}`; return { f: `IF(${c}=0,1000*${n},1000*((1+${c})^(${n}+1)-(1+${c}))/${c})`, v: kidAmt(v, n), z: '#,##0.00' }; })]);
      if (k.off) {
        const o = k.off, ov = o.s.flat(), oa = o.a.flat();
        body += `<tr><td></td><td class="l">${S.kidPid(o.doc)}</td><td>${S.kidYrs(o.years[2], o.years[1])}</td><td></td><td></td>${cells(ov, o.years, oa)}</tr>`;
        body += `<tr><td></td><td class="l">${S.kidDiff}</td><td></td><td></td><td></td>${vals.map((v, i) => `<td class="${i % 4 ? '' : 'bl'}">${pp(v - ov[i])}</td>`).join('')}</tr>`;
        const r1 = t.length + 1;
        t.push(['', S.kidPid(o.doc), o.years[2], '', '', ...ov.map(v => ({ v, z: '0.00%' }))]);
        t.push(['', `${S.kidPid(o.doc)} · ${S.kidAmt}`, '', '', '', ...oa.map(v => ({ v, z: '#,##0.00' }))]);
        t.push(['', S.kidDiff, '', '', '', ...vals.map((v, i) => ({ f: `(${cols[i]}${r0}-${cols[i]}${r1})*100`, v: v - ov[i], z: '0.00' }))]);
      }
    });
  }
  const scH = S.kidSc.map((s, i) => `<th class="${i ? '' : 'bl'}">${s}</th>`).join('');
  document.getElementById('kidTable').innerHTML = `<thead><tr><th class="l" rowspan="2">${S.thFund}</th><th rowspan="2"></th><th rowspan="2">${S.kidRhp}</th><th rowspan="2">${S.kidEq}</th><th rowspan="2">${S.kidCost}</th><th colspan="4" class="bl">${S.kidP1}</th><th colspan="4" class="bl">${S.kidPm}</th><th colspan="4" class="bl">${S.kidPr}</th></tr><tr>${scH}${scH}${scH}</tr></thead><tbody>${body}</tbody>`;
  span.sort();
  document.getElementById('kidNote').textContent = S.kidNote(span[0] || '–', span[span.length - 1] || '–') + (fs.some(f => f.kid.capped) ? ' * ' + S.kidCap + '.' : '');
  t[1] = [S.kidNote(span[0] || '–', span[span.length - 1] || '–')];
  xb.name = `${MLABEL[ST.m]} KID`;
  MODELS.kid = xb;
}
