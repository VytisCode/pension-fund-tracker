/* „Kelias į pensiją“: mokesčių poveikis dalyvio santaupoms (perkelta iš „Rezultatų“, savininko sprendimas 2026-10-14).
   Pradžia – dalyvio II pakopos modelio turtas šiandien, įmokos – jo įmokų lygis per paskutinius 12 mėn. (kaip ateities scenarijuose), atlyginimas auga 2,1 % per metus.
   Grąža prieš mokesčius – pasirinktas ateities scenarijus (akcijų dalis mažėja pagal gyvenimo ciklą), kas mėnesį atskaitomas valdymo mokestis (metinis % ÷ 12) nuo turto.
   Mokestis – kiekvieno valdytojo bazinis tarifas iš Lietuvos banko sąrašo (data_fee.js). Sumos – šiandienos eurais (2 % infliacija). */
addStrings({
  feeTitle: 'Fee impact on your savings', feeSc: 'Return scenario:', feeY: 'Period:', feeToR: n => `until 65 (${n} yr)`, feeYrs: y => `${y} yr`,
  feeLead: (y, s) => `Your pillar II savings and contributions from the data above, ${y} years ahead, ${s} return scenario. The only difference between the rows is the manager’s fee.`,
  feeTh: ['Manager', 'Fee, % a year', 'Without fees', 'With fees', 'Fees paid', 'Lower than without fees', 'Difference from your manager'],
  feeYou: 'your manager', feeNoII: 'The fee comparison applies to pillar II funds; your selection has no pillar II savings.', feeRet: 'You have reached 65 – no period remains to compare.',
  feeNote: 'Amounts in today’s euros (2 % inflation). Fees: base asset-based fee from the Bank of Lithuania list; life-cycle funds of a manager share one fee. “Lower than without fees” also includes the return the fees would have earned. Contribution fees and the actual future return are not included.',
}, {
  feeTitle: 'Mokesčių poveikis jūsų santaupoms', feeSc: 'Grąžos scenarijus:', feeY: 'Laikotarpis:', feeToR: n => `iki 65 metų (${n} m.)`, feeYrs: y => `${y} m.`,
  feeLead: (y, s) => `Jūsų II pakopos santaupos ir įmokos pagal viršuje įvestus duomenis, ${y} m. į priekį, ${s.toLowerCase()} grąžos scenarijus. Eilutės skiriasi tik valdytojo mokesčiu.`,
  feeTh: ['Valdytojas', 'Mokestis, % per metus', 'Be mokesčių', 'Su mokesčiais', 'Sumokėta mokesčių', 'Mažiau nei be mokesčių', 'Skirtumas nuo jūsų valdytojo'],
  feeYou: 'jūsų valdytojas', feeNoII: 'Mokesčių palyginimas skaičiuojamas II pakopos fondams, o jūsų pasirinkime II pakopos santaupų nėra.', feeRet: 'Jums jau 65 metai – lyginti nebeliko laikotarpio.',
  feeNote: 'Sumos – šiandienos eurais (2 % infliacija). Mokestis – bazinis tarifas nuo turto iš Lietuvos banko sąrašo; visų valdytojo gyvenimo ciklo fondų jis vienodas. „Mažiau nei be mokesčių“ apima ir grąžą, kurią būtų uždirbę sumokėti mokesčiai. Įmokų mokesčiai ir tikroji ateities grąža neįtraukti.',
});
const FEEI = { sc: 1, y: 0 };            // y: 0 – iki 65 metų
try { const s = JSON.parse(localStorage.getItem('feeImp') || '{}'); if (s.sc >= 0 && s.sc <= 2) FEEI.sc = s.sc; if (s.y >= 0) FEEI.y = s.y; } catch (e) {}
function feeRun(fee, S2, P, sc, years) {  // šiandienos eurais
  const y0 = yearOf(P.asof), w0 = wageAt(P.asof, P.pay, null), g = FUT.wage / 100, c = futRate(S2) || 0, inf = Math.pow(1 + FUT.infl / 100, 1 / 12);
  let v = S2.last.val, paid = 0, def = 1;
  for (let t = 1; t <= years; t++) {
    const eq = FUT.eq2(y0 + t - P.birth), rm = Math.pow(1 + (eq * sc.eq + (1 - eq) * sc.bd) / 100, 1 / 12) - 1, cm = c * (w0.g || 0) * Math.pow(1 + g, t), f = fee / 100 / 12;
    for (let m = 0; m < 12; m++) { def *= inf; v = (v + cm) * (1 + rm); const x = v * f; paid += x / def; v -= x; }
  }
  return { v: v / def, paid };
}
function renderFeeImpact() {
  const t = T(), box = document.getElementById('feeBody'); if (!box) return;
  document.getElementById('feeTitle').textContent = t.feeTitle;
  const S2 = P.pl === 'III' ? null : P.pl === 'both' ? SIM.parts[0] : SIM, n = P.birth + 65 - yearOf(P.asof);
  if (!S2) { box.innerHTML = `<p class="note">${t.feeNoII}</p>`; return; }
  if (n <= 0) { box.innerHTML = `<p class="note">${t.feeRet}</p>`; return; }
  const ys = [[0, t.feeToR(n)], ...[5, 10, 20, 30].filter(y => y < n).map(y => [y, t.feeYrs(y)])];
  if (!ys.some(x => x[0] === FEEI.y)) FEEI.y = 0;
  const years = FEEI.y || n, sc = FUT.sc[FEEI.sc], grp = groupOf(P.birth) || '1996-2002';
  const rows = MGRS.map(m => ({ m, fee: typeof FEES !== 'undefined' ? FEES[`${m}|${grp}`] ?? FEES[`${m}|1996-2002`] : undefined })).filter(x => x.fee != null)
    .map(x => ({ ...x, s: feeRun(x.fee, S2, P, sc, years) })).sort((a, b) => a.fee - b.fee || MLABEL[a.m].localeCompare(MLABEL[b.m]));
  renderFeeImpact.last = { rows, S2, sc, years, mine: P.mgr };
  const gross = feeRun(0, S2, P, sc, years).v, mine = rows.find(x => x.m === P.mgr), e0 = x => eur(x, 0);
  const opt = (id, xs, v) => `<select id="${id}">${xs.map(([k, l]) => `<option value="${k}"${k === v ? ' selected' : ''}>${l}</option>`).join('')}</select>`;
  let h = `<div class="bar" style="margin-bottom:8px"><label class="field">${t.feeSc} ${opt('feeScSel', t.futSc.map((l, i) => [i, l]), FEEI.sc)}</label><label class="field">${t.feeY} ${opt('feeYSel', ys, FEEI.y)}</label></div>`;
  h += `<p class="lead" style="margin:0 0 8px">${t.feeLead(years, t.futSc[FEEI.sc])}</p>`;
  if (!rows.length) h += `<p class="na">${t.noData}</p>`;
  else h += `<div class="scroll"><table class="jt" id="feeTable"><thead><tr>${t.feeTh.map((x, i) => `<th class="${i ? '' : 'l'}">${x}</th>`).join('')}</tr></thead><tbody>`
    + rows.map(r => { const me = r === mine, d = mine ? r.s.v - mine.s.v : null;
      return `<tr${me ? ' style="font-weight:600;background:var(--hl, rgba(0,0,0,.04))"' : ''}><td class="l"><span class="sw" style="background:${colorOf(r.m)}"></span>${MLABEL[r.m]}${me ? ` <small>(${t.feeYou})</small>` : ''}</td><td>${num(r.fee, 2)}${pctSfx()}</td><td>${e0(gross)}</td><td>${e0(r.s.v)}</td><td>${e0(r.s.paid)}</td>`
        + `<td>${e0(gross - r.s.v)} <small>(${num((gross - r.s.v) / gross * 100, 1)}${pctSfx()})</small></td><td>${d == null || me ? '–' : Math.abs(d) < 0.5 ? e0(0) : (d > 0 ? '+' : '−') + e0(Math.abs(d))}</td></tr>`; }).join('')
    + '</tbody></table></div>';
  box.innerHTML = h + `<p class="note">${t.feeNote}</p>`;
  const save = () => { try { localStorage.setItem('feeImp', JSON.stringify(FEEI)); } catch (e) {} renderFeeImpact(); };
  document.getElementById('feeScSel').onchange = e => { FEEI.sc = +e.target.value; save(); };
  document.getElementById('feeYSel').onchange = e => { FEEI.y = +e.target.value; save(); };
}
if (typeof SIM !== 'undefined' && SIM) renderFeeImpact();

/* Excel su skaičiavimais (auditui): kiekvieno mėnesio turtas su kiekvieno valdytojo mokesčiu (lapas „Mėnesiai“) */
XLB.set('feeTable', async () => {
  const Lx = renderFeeImpact.last; if (!Lx || !Lx.rows.length) return null;
  const t = T(), L = lang === 'lt', { rows, S2, sc, years } = Lx, y0 = yearOf(P.asof), w0 = wageAt(P.asof, P.pay, null), c = futRate(S2) || 0, SP = L ? 'Prielaidos' : 'Assumptions', SMn = L ? 'Mėnesiai' : 'Months', q = s => `'${s}'`;
  const prm = [[L ? 'Prielaida' : 'Assumption', L ? 'Reikšmė' : 'Value', L ? 'Paaiškinimas' : 'Note'],
    [L ? 'Turtas šiandien, €' : 'Assets today, €', { t: 'n', v: S2.last.val, z: '#,##0.00' }, L ? 'II pakopos modelio turtas (puslapio skaičiavimas, „⤓ Excel“)' : 'Pillar II model assets (page calculation, “⤓ Excel”)'],
    [L ? 'Bruto atlyginimas dabar, € / mėn.' : 'Gross wage now, € / month', { t: 'n', v: w0.g || 0, z: '#,##0.00' }, ''],
    [L ? 'Įmokų tarifas (dalis atlyginimo)' : 'Contribution rate (share of wage)', { t: 'n', v: c, z: '0.00%' }, L ? 'Paskutinių 12 mėn. įmokų lygis' : 'Contribution level over the last 12 months'],
    [L ? 'Atlyginimo augimas, % per metus' : 'Wage growth, % a year', { t: 'n', v: FUT.wage, z: '0.00' }, ''], [L ? 'Infliacija, % per metus' : 'Inflation, % a year', { t: 'n', v: FUT.infl, z: '0.00' }, L ? 'Sumos perskaičiuojamos šiandienos eurais' : 'Amounts converted to today’s euros'],
    [L ? 'Akcijų grąža, % per metus' : 'Equity return, % a year', { t: 'n', v: sc.eq, z: '0.00' }, t.futSc[FEEI.sc]], [L ? 'Obligacijų grąža, % per metus' : 'Bond return, % a year', { t: 'n', v: sc.bd, z: '0.00' }, t.futSc[FEEI.sc]]];
  const pr = r => `${q(SP)}!$B$${r}`, all = [{ m: null, fee: 0 }, ...rows], N = years * 12, last = N + 1;
  const hdr = [L ? 'Mėnuo' : 'Month', L ? 'Metai' : 'Year', L ? 'Amžius' : 'Age', L ? 'Akcijų dalis' : 'Equity share', L ? 'Mėnesio grąža' : 'Monthly return', L ? 'Įmoka, €' : 'Contribution, €', L ? 'Infliacijos koef.' : 'Inflation factor',
    ...all.flatMap(x => { const n = x.m ? MLABEL[x.m] : (L ? 'Be mokesčių' : 'No fees'); return [`${n}: ${L ? 'turtas' : 'assets'}`, `${n}: ${L ? 'sumokėta Σ (šiand. €)' : 'paid Σ (today €)'}`]; })];
  const mon = [hdr], R = q(L ? 'Rezultatas' : 'Result');
  let v = all.map(() => S2.last.val), paid = all.map(() => 0), def = 1;
  const inf = Math.pow(1 + FUT.infl / 100, 1 / 12), g = FUT.wage / 100;
  for (let k = 1; k <= N; k++) { const yr = Math.ceil(k / 12), r = k + 1, eq = FUT.eq2(y0 + yr - P.birth), rm = Math.pow(1 + (eq * sc.eq + (1 - eq) * sc.bd) / 100, 1 / 12) - 1, cm = c * (w0.g || 0) * Math.pow(1 + g, yr);
    def *= inf;
    const row = [k, yr, y0 + yr - P.birth, { t: 'n', v: eq, z: '0.0%' }, xlF(`(1+(D${r}*${pr(7)}+(1-D${r})*${pr(8)})/100)^(1/12)-1`, rm, '0.0000%'), xlF(`${pr(4)}*${pr(3)}*(1+${pr(5)}/100)^B${r}`, cm, '#,##0.00'), xlF(`(1+${pr(6)}/100)^(A${r}/12)`, def, '0.0000')];
    all.forEach((x, j) => { const vc = xlCol(7 + j * 2), pc_ = xlCol(8 + j * 2), fee = j ? `${R}!$B$${3 + j}` : '0', prevV = k === 1 ? pr(2) : `${vc}${r - 1}`, prevP = k === 1 ? '0' : `${pc_}${r - 1}`;
      const f = x.fee / 100 / 12, gr = (v[j] + cm) * (1 + rm), ch = gr * f; paid[j] += ch / def; v[j] = gr - ch;
      row.push(xlF(`(${prevV}+F${r})*(1+E${r})*(1-${fee}/1200)`, v[j], '#,##0.00'), xlF(`${prevP}+(${prevV}+F${r})*(1+E${r})*${fee}/1200/G${r}`, paid[j], '#,##0.00')); });
    mon.push(row); }
  const M = c_ => `${q(SMn)}!${c_}${last}`, G = M('G'), gross = v[0] / def, mi = rows.findIndex(x => x.m === Lx.mine);
  const res = [[t.feeTitle], [t.feeLead(years, t.futSc[FEEI.sc])], t.feeTh];
  rows.forEach((x, i) => { const r = res.length + 1, j = i + 1, net = v[j] / def;
    res.push([MLABEL[x.m] + (x.m === Lx.mine ? ` (${t.feeYou})` : ''), { t: 'n', v: x.fee, z: '0.00' }, xlF(`${M('H')}/${G}`, gross, '#,##0'), xlF(`${M(xlCol(7 + j * 2))}/${G}`, net, '#,##0'), xlF(M(xlCol(8 + j * 2)), paid[j], '#,##0'),
      xlF(`C${r}-D${r}`, gross - net, '#,##0'), mi < 0 || i === mi ? null : xlF(`D${r}-D${4 + mi}`, net - v[mi + 1] / def, '#,##0')]); });
  const wb = XLSX_SHIM.utils.book_new(), add = (rows_, name, w) => { const ws = XLSX_SHIM.utils.aoa_to_sheet(rows_); ws['!cols'] = w; XLSX_SHIM.utils.book_append_sheet(wb, ws, name); };
  add(res, L ? 'Rezultatas' : 'Result', [{ wch: 30 }, ...Array(6).fill({ wch: 15 })]); add(prm, SP, [{ wch: 36 }, { wch: 14 }, { wch: 50 }]); add(mon, SMn, [{ wch: 7 }, { wch: 6 }, { wch: 7 }, { wch: 10 }, { wch: 11 }, { wch: 11 }, { wch: 10 }, ...Array(all.length * 2).fill({ wch: 14 })]);
  add([[L ? 'Metodika' : 'Methodology'], [L ? 'Kiekvieną mėnesį' : 'Every month', L ? 'turtas = (ankstesnis turtas + įmoka) × (1 + mėnesio grąža) × (1 − metinis mokestis ÷ 12); sumokėtas mokestis perskaičiuojamas šiandienos eurais (÷ infliacijos koef.).' : 'assets = (previous assets + contribution) × (1 + monthly return) × (1 − annual fee ÷ 12); the fee paid is converted to today’s euros (÷ inflation factor).'],
    [L ? 'Grąža' : 'Return', L ? 'mėnesio grąža = (1 + (akcijų dalis × akcijų grąža + (1 − akcijų dalis) × obligacijų grąža) ÷ 100) ^ (1/12) − 1; akcijų dalis mažėja pagal gyvenimo ciklą (amžius).' : 'monthly return = (1 + (equity share × equity return + (1 − equity share) × bond return) ÷ 100) ^ (1/12) − 1; the equity share falls with age (life cycle).'],
    [L ? 'Įmoka' : 'Contribution', L ? 'tarifas × bruto atlyginimas × (1 + augimas) ^ metai.' : 'rate × gross wage × (1 + growth) ^ years.'], [L ? 'Mokesčiai' : 'Fees', t.feeNote]], L ? 'Metodika' : 'Methodology', [{ wch: 18 }, { wch: 110 }]);
  return { sheets: XLSX_SHIM.toXL(wb), own: true };
});
