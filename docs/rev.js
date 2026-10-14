/* Mėnesio ir ketvirčio apžvalga (auditas #59): kas pasikeitė per pasirinktą mėnesį ar ketvirtį, nuo metų pradžios ir per 12 mėn.;
   turto pokytis (grąža, įmokos, išmokos), III pakopa, portfelių pokyčiai (ketvirčiui), išskirtinumai. Skirta spausdinti / persiųsti PDF.
   Valdytojo grąža – jo gyvenimo ciklo fondų vidurkis (kaip „Šiandien“ ir „Rezultatų“ puslapiuose); fondai lyginami tik savo grupėje. */
addStrings({
  selR: 'Period:', optM: 'Months', optQ: 'Quarters', pr: '🖶 Print / PDF',
  title: l => `Review: ${l}`, sub: (a, b) => `${a} – ${b}. Generated automatically from the site data.`,
  hSay: 'Key points', s1: (v, up) => `The average life-cycle fund ${up ? 'rose' : 'fell'} by ${v}.`,
  s2: (b, bv, w, wv) => `${b} did best (${bv} on average across its life-cycle funds), ${w} did worst (${wv}).`,
  s3: (g, a, b, v) => `The largest gap was in the ${g} group: ${a} and ${b} differ by ${v} pp.`,
  s4: (p, v) => `Among asset-preservation funds ${p} led (${v}).`,
  s5: (v, r, fl, pay) => `Pillar II assets changed by ${v}: return ${r}, contributions and switches ${fl}${pay ? `, reform payouts ${pay}` : ''}.`,
  s6: (f, d, v) => `The largest one-day move: ${f} ${v} on ${d}.`,
  s7: (c, f, v) => `Pillar III, ${c}: ${f} led (${v}).`,
  hMgr: 'Managers: average life-cycle fund', mMgr: 'Place among managers in brackets. Returns are not annualised.', thMgr: 'Manager', thPer: 'This period', thYtd: 'Since start of year', thYoy: '12 months',
  hGrp: 'Groups: leader and last fund in the period', thG: 'Group', thLead: 'Leader', thLast: 'Last', thGap: 'Gap, pp',
  hAum: 'Pillar II assets: what changed them', mAum: '€ m. Return = assets × unit value change; contributions and switches – the rest of the change; payouts – reform payouts.',
  thStart: 'Start', thRet: 'Return', thFlow: 'Contributions & switches', thPay: 'Payouts', thEnd: 'End', total: 'Total',
  hP3: 'Pillar III: leaders by category', mP3: 'Month-end unit values.', thCat: 'Category', cat: { bond: 'Bonds', mixed: 'Mixed', equity: 'Equity' },
  hPf: q => `Portfolio changes in the quarter (${q})`, mPf: 'All pillar II funds of the manager together; change in share of the portfolio, pp; new holdings – securities not held at the previous quarter end.',
  thEq: 'Shares', thBd: 'Bonds', thFd: 'Funds & ETFs', thCash: 'Cash', thNew: 'Largest new holdings',
  noPf: 'Portfolio reports for this quarter are not published yet.',
  foot: 'Returns are changes in unit value (fees already deducted), not annualised. For information only, not investment advice.',
}, {
  selR: 'Laikotarpis:', optM: 'Mėnesiai', optQ: 'Ketvirčiai', pr: '🖶 Spausdinti / PDF',
  title: l => `Apžvalga: ${l}`, sub: (a, b) => `${a} – ${b}. Sudaryta automatiškai iš svetainės duomenų.`,
  hSay: 'Svarbiausia', s1: (v, up) => `Vidutinis gyvenimo ciklo fondas ${up ? 'pakilo' : 'nukrito'} ${v}.`,
  s2: (b, bv, w, wv) => `Geriausiai sekėsi ${b} (vidutiniškai ${bv} per gyvenimo ciklo fondus), silpniausiai – ${w} (${wv}).`,
  s3: (g, a, b, v) => `Didžiausias skirtumas – ${g} grupėje: ${a} ir ${b} skiriasi ${v} p. p.`,
  s4: (p, v) => `Tarp turto išsaugojimo fondų pirmavo ${p} (${v}).`,
  s5: (v, r, fl, pay) => `II pakopos turtas pasikeitė ${v}: grąža ${r}, įmokos ir perėjimai ${fl}${pay ? `, reformos išmokos ${pay}` : ''}.`,
  s6: (f, d, v) => `Didžiausias vienos dienos pokytis: ${f} ${v} (${d}).`,
  s7: (c, f, v) => `III pakopa, ${c}: pirmavo ${f} (${v}).`,
  hMgr: 'Valdytojai: vidutinis gyvenimo ciklo fondas', mMgr: 'Skliaustuose – vieta tarp valdytojų. Grąža ne metinė.', thMgr: 'Valdytojas', thPer: 'Šis laikotarpis', thYtd: 'Nuo metų pradžios', thYoy: '12 mėn.',
  hGrp: 'Grupės: laikotarpio lyderis ir paskutinis', thG: 'Grupė', thLead: 'Lyderis', thLast: 'Paskutinis', thGap: 'Skirtumas, p. p.',
  hAum: 'II pakopos turtas: kas jį pakeitė', mAum: 'Mln. €. Grąža = turtas × vieneto vertės pokytis; įmokos ir perėjimai – likęs pokytis; išmokos – reformos išmokos.',
  thStart: 'Pradžia', thRet: 'Grąža', thFlow: 'Įmokos ir perėjimai', thPay: 'Išmokos', thEnd: 'Pabaiga', total: 'Iš viso',
  hP3: 'III pakopa: lyderiai pagal kategoriją', mP3: 'Mėnesio pabaigos vieneto vertės.', thCat: 'Kategorija', cat: { bond: 'Obligacijų', mixed: 'Mišrūs', equity: 'Akcijų' },
  hPf: q => `Portfelių pokyčiai per ketvirtį (${q})`, mPf: 'Visi valdytojo II pakopos fondai kartu; dalies portfelyje pokytis, p. p.; naujos pozicijos – vertybiniai popieriai, kurių nebuvo praėjusio ketvirčio pabaigoje.',
  thEq: 'Akcijos', thBd: 'Obligacijos', thFd: 'Fondai ir ETF', thCash: 'Pinigai', thNew: 'Didžiausios naujos pozicijos',
  noPf: 'Šio ketvirčio portfelių ataskaitos dar nepaskelbtos.',
  foot: 'Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti), ne metinė. Informacinė medžiaga, ne investavimo rekomendacija.',
});
const $ = id => document.getElementById(id);
const PROVS = DATA.providers.map(p => p.id);
const LC = DATA.groups.filter(g => g.id !== 'turto'), TURTO = DATA.groups.find(g => g.id === 'turto');
const mean = xs => { const a = xs.filter(x => x != null); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const LAST = Math.max(...DATA.groups.flatMap(g => g.funds.map(f => f.d[f.d.length - 1])));
const mEnd = (y, m) => Math.round(Date.UTC(y, m, 0) / DAY);            // m – 1..12; mėnesio paskutinė diena
const money = v => (v < 0 ? '−' : v > 0 ? '+' : '') + num(Math.abs(v), 1);

/* ---------- laikotarpiai ---------- */
function periods() {
  const ms = [], qs = [], d = new Date(LAST * DAY);
  for (let y = d.getUTCFullYear(); y >= 2019; y--) for (let m = 12; m >= 1; m--) { const e = mEnd(y, m); if (e <= LAST && e > mEnd(2019, 1)) { ms.push(`m:${y}-${m}`); if (m % 3 === 0) qs.push(`q:${y}-${m / 3}`); } }
  return { ms: ms.slice(0, 36), qs: qs.slice(0, 16) };
}
function bounds(id) {
  const [k, v] = id.split(':'), [y, n] = v.split('-').map(Number);
  const m1 = k === 'm' ? n : n * 3, m0 = k === 'm' ? n - 1 : n * 3 - 3;
  return { k, y, m0, m1, anchor: m0 ? mEnd(y, m0) : mEnd(y - 1, 12), end: mEnd(y, m1) };
}
const pLabel = id => { const b = bounds(id); return b.k === 'q' ? (lang === 'lt' ? `${b.y} m. ${['I', 'II', 'III', 'IV'][b.m1 / 3 - 1]} ketvirtis` : `Q${b.m1 / 3} ${b.y}`) : new Date(Date.UTC(b.y, b.m1 - 1, 15)).toLocaleDateString(T().locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }); };

/* ---------- II pakopa ---------- */
function groupRet(g, anchor, end) {      // {provider: grąža} grupėje tarp dviejų dienų (fondai be tos dienos vertės – null)
  const out = {};
  g.funds.forEach(f => { const ie = lastOnOrBefore(f, end); const s = ie >= 0 && end - f.d[ie] <= 7 ? seriesOf(f, anchor, end) : null; out[f.provider] = s ? s.ret : null; });
  return out;
}
function mgrTable(anchor, end) {
  const ytdA = mEnd(new Date(end * DAY).getUTCFullYear() - 1, 12), yoyA = shiftMonths(end, 12);
  const per = LC.map(g => groupRet(g, anchor, end)), ytd = LC.map(g => groupRet(g, ytdA, end)), yoy = LC.map(g => groupRet(g, yoyA, end));
  const rows = PROVS.map(p => ({ p, per: mean(per.map(r => r[p])), ytd: mean(ytd.map(r => r[p])), yoy: mean(yoy.map(r => r[p])) })).filter(r => r.per != null);
  ['per', 'ytd', 'yoy'].forEach(k => { const s = rows.filter(r => r[k] != null).map(r => r[k]).sort((a, b) => b - a); rows.forEach(r => { r[k + 'K'] = r[k] == null ? null : s.indexOf(r[k]) + 1; }); });
  return { rows: rows.sort((a, b) => b.per - a.per), groups: LC.map((g, i) => ({ g, r: per[i] })), avg: mean(per.flatMap(r => Object.values(r))) };
}
function biggestDay(anchor, end) {
  let best = null;
  LC.concat(TURTO ? [TURTO] : []).forEach(g => g.funds.forEach(f => { const a = lastOnOrBefore(f, anchor), b = lastOnOrBefore(f, end); for (let i = Math.max(1, a + 1); i <= b; i++) { const v = (f.v[i] / f.v[i - 1] - 1) * 100; if (f.d[i] - f.d[i - 1] <= 5 && (!best || Math.abs(v) > Math.abs(best.v))) best = { f, g, d: f.d[i], v }; } }));
  return best;
}
function aumTable(b) {                   // valdytojo II pakopos turtas pradžioje / pabaigoje ir išskaidymas iš AUM.funds[].dm
  const at = (f, day) => { let v = null; for (let i = 0; i < f.d.length && f.d[i] <= day; i++) v = day - f.d[i] <= 10 ? f.a[i] : null; return v; };
  const k0 = b.y * 12 + b.m0 - 1, k1 = b.y * 12 + b.m1 - 1;   // dm raktai: metai*12 + mėn − 1; laikotarpis – (m0, m1]
  return PROVS.map(p => {
    const fs = AUM.funds.filter(f => f.pl === 'II' && f.p === p); let s0 = 0, s1 = 0, r = 0, fl = 0, pay = 0, ok = true;
    fs.forEach(f => { const a0 = at(f, b.anchor), a1 = at(f, b.end); if (a1 == null) { if (a0) ok = false; return; } s0 += a0 || 0; s1 += a1;
      (f.dm || []).forEach(([k, x, y, z]) => { if (k > k0 && k <= k1) { r += x; fl += y; pay += z; } }); });
    return ok && s1 ? { p, s0, s1, r, fl, pay } : null;
  }).filter(Boolean);
}

/* ---------- III pakopa (mėnesio pabaigos vertės) ---------- */
function p3Leaders(b) {
  const i1 = REP.months.findIndex(d => d === b.end), i0 = REP.months.findIndex(d => d === b.anchor);
  if (i0 < 0 || i1 < 0) return [];
  return ['bond', 'mixed', 'equity'].map(c => { const xs = REP.funds.filter(f => f.pl === 'III' && f.g === c && f.m[i0] && f.m[i1]).map(f => ({ f, v: (f.m[i1] / f.m[i0] - 1) * 100 })).sort((a, b) => b.v - a.v);
    return xs.length ? { c, xs } : null; }).filter(Boolean);
}

/* ---------- portfelių pokyčiai per ketvirtį (data_pf.js) ---------- */
function pfChanges(b) {
  if (b.k !== 'q') return null;
  const qi = PF.quarters.indexOf(iso(b.end));
  if (qi < 1) return [];
  const agg = (p, q) => { const m = new Map(); let t = 0; PF.funds.filter(f => f.pl === 'II' && f.p === labelOf(p)).forEach(f => { for (let i = 0; i < f.r.length; i += 4) if (f.r[i] === q) { m.set(f.r[i + 1], (m.get(f.r[i + 1]) || 0) + f.r[i + 3]); t += f.r[i + 3]; } }); return { m, t }; };
  const share = (A, t) => { let s = 0; A.m.forEach((v, si) => { if (PF.secs[si][1] === t) s += v; }); return A.t ? s / A.t * 100 : 0; };
  return PROVS.map(p => { const A = agg(p, qi - 1), B = agg(p, qi); if (!A.t || !B.t) return null;
    const d = Object.fromEntries(['e', 'b', 'f', 'c'].map(t => [t, share(B, t) - share(A, t)]));
    const nw = [...B.m.entries()].filter(([si]) => !A.m.has(si)).sort((x, y) => y[1] - x[1]).slice(0, 3).map(([si, v]) => ({ n: PF.secs[si][8] || PF.secs[si][0], w: v / B.t * 100 }));
    return { p, d, nw }; }).filter(Boolean);
}

/* ---------- puslapis ---------- */
let SEL = '';
try { SEL = localStorage.getItem('revSel') || ''; } catch (e) {}
function render() {
  const t = T(), P = periods(), sel = $('selR');
  if (![...P.ms, ...P.qs].includes(SEL)) SEL = P.ms[0];
  sel.innerHTML = `<optgroup label="${t.optM}">${P.ms.map(id => `<option value="${id}">${pLabel(id)}</option>`).join('')}</optgroup><optgroup label="${t.optQ}">${P.qs.map(id => `<option value="${id}">${pLabel(id)}</option>`).join('')}</optgroup>`;
  sel.value = SEL; $('selRL').textContent = t.selR; $('btnPr').textContent = t.pr;
  const b = bounds(SEL), M = mgrTable(b.anchor, b.end), A = aumTable(b), P3 = p3Leaders(b), PFc = pfChanges(b), big = biggestDay(b.anchor, b.end);
  const lab = pLabel(SEL), say = [];
  if (M.avg != null) say.push(t.s1(pctPlain(Math.abs(M.avg)), M.avg >= 0));
  if (M.rows.length > 1) { const B = M.rows[0], W = M.rows[M.rows.length - 1]; say.push(t.s2(labelOf(B.p), pct(B.per), labelOf(W.p), pct(W.per))); }
  const gaps = M.groups.map(x => { const e = Object.entries(x.r).filter(([, v]) => v != null).sort((a, b) => b[1] - a[1]); return e.length > 1 ? { g: x.g, a: e[0], z: e[e.length - 1], gap: e[0][1] - e[e.length - 1][1] } : null; }).filter(Boolean);
  const G = [...gaps].sort((a, b) => b.gap - a.gap)[0];
  if (G) say.push(t.s3(groupLabel(G.g), labelOf(G.a[0]), labelOf(G.z[0]), num(G.gap, 2)));
  if (TURTO) { const r = Object.entries(groupRet(TURTO, b.anchor, b.end)).filter(([, v]) => v != null).sort((a, b) => b[1] - a[1]); if (r.length) say.push(t.s4(labelOf(r[0][0]), pct(r[0][1]))); }
  if (A.length) { const S = k => A.reduce((s, x) => s + x[k], 0); say.push(t.s5(`${money(S('s1') - S('s0'))} ${lang === 'lt' ? 'mln. €' : '€ m'}`, money(S('r')), money(S('fl')), Math.abs(S('pay')) > 0.05 ? money(S('pay')) : '')); }
  if (big) say.push(t.s6(`${labelOf(big.f.provider)} ${groupLabel(big.g)}`, iso(big.d), pct(big.v)));
  P3.forEach(x => say.push(t.s7(t.cat[x.c].toLowerCase(), hEsc(x.xs[0].f.n), pct(x.xs[0].v))));
  const sw = id => `<i class="sw" style="background:${colorOf(id)}"></i>`;
  const kc = (v, k, n) => `<td class="n">${v == null ? '–' : pct(v)}${k ? `<small>(${k})</small>` : ''}</td>`;
  let h = `<section class="card"><h2>${t.title(lab)}</h2><div class="meta">${t.sub(iso(b.anchor), iso(Math.min(b.end, LAST)))}</div></section>`;
  h += `<section class="card says" data-src="nav"><h2>${t.hSay}</h2>${say.map(x => `<p>${x}</p>`).join('')}</section>`;
  h += `<div class="two"><section class="card" data-src="nav"><h2>${t.hMgr}</h2><div class="meta">${t.mMgr}</div><div class="scroll"><table class="rt" id="tM"><thead><tr><th>${t.thMgr}</th><th class="n">${t.thPer}</th><th class="n">${t.thYtd}</th><th class="n">${t.thYoy}</th></tr></thead><tbody>`
    + M.rows.map(r => `<tr><td>${sw(r.p)}${labelOf(r.p)}</td>${kc(r.per, r.perK)}${kc(r.ytd, r.ytdK)}${kc(r.yoy, r.yoyK)}</tr>`).join('') + `</tbody></table></div></section>`;
  h += `<section class="card" data-src="nav"><h2>${t.hGrp}</h2><div class="scroll"><table class="rt" id="tG"><thead><tr><th>${t.thG}</th><th>${t.thLead}</th><th class="n"></th><th>${t.thLast}</th><th class="n"></th><th class="n">${t.thGap}</th></tr></thead><tbody>`
    + [...gaps].reverse().map(x => `<tr><td>${groupLabel(x.g)}</td><td>${sw(x.a[0])}${labelOf(x.a[0])}</td><td class="n">${pct(x.a[1])}</td><td>${sw(x.z[0])}${labelOf(x.z[0])}</td><td class="n">${pct(x.z[1])}</td><td class="n">${num(x.gap, 2)}</td></tr>`).join('') + `</tbody></table></div></section></div>`;
  if (A.length) {
    const S = k => A.reduce((s, x) => s + x[k], 0), c = v => `<td class="n${v > 0.05 ? ' pos' : v < -0.05 ? ' neg' : ''}">${money(v)}</td>`;
    h += `<section class="card" data-src="aum"><h2>${t.hAum}</h2><div class="meta">${t.mAum}</div><div class="scroll"><table class="rt" id="tA"><thead><tr><th>${t.thMgr}</th><th class="n">${t.thStart}</th><th class="n">${t.thRet}</th><th class="n">${t.thFlow}</th><th class="n">${t.thPay}</th><th class="n">${t.thEnd}</th></tr></thead><tbody>`
      + A.map(x => `<tr><td>${sw(x.p)}${labelOf(x.p)}</td><td class="n">${num(x.s0, 1)}</td>${c(x.r)}${c(x.fl)}${c(x.pay)}<td class="n">${num(x.s1, 1)}</td></tr>`).join('')
      + `</tbody><tfoot><tr><td>${t.total}</td><td class="n">${num(S('s0'), 1)}</td>${c(S('r'))}${c(S('fl'))}${c(S('pay'))}<td class="n">${num(S('s1'), 1)}</td></tr></tfoot></table></div></section>`;
  }
  if (P3.length) h += `<section class="card" data-src="p3"><h2>${t.hP3}</h2><div class="meta">${t.mP3}</div><div class="scroll"><table class="rt" id="t3"><thead><tr><th>${t.thCat}</th><th>${t.thLead}</th><th class="n"></th><th>${t.thLast}</th><th class="n"></th></tr></thead><tbody>`
    + P3.map(x => { const a = x.xs[0], z = x.xs[x.xs.length - 1]; return `<tr><td>${t.cat[x.c]}</td><td>${sw(a.f.p)}${hEsc(a.f.n)}</td><td class="n">${pct(a.v)}</td><td>${sw(z.f.p)}${hEsc(z.f.n)}</td><td class="n">${pct(z.v)}</td></tr>`; }).join('') + `</tbody></table></div></section>`;
  if (PFc) h += `<section class="card" data-src="pf"><h2>${t.hPf(lab)}</h2>` + (PFc.length ? `<div class="meta">${t.mPf}</div><div class="scroll"><table class="rt" id="tP"><thead><tr><th>${t.thMgr}</th><th class="n">${t.thEq}</th><th class="n">${t.thBd}</th><th class="n">${t.thFd}</th><th class="n">${t.thCash}</th><th>${t.thNew}</th></tr></thead><tbody>`
    + PFc.map(x => `<tr><td>${sw(x.p)}${labelOf(x.p)}</td>${['e', 'b', 'f', 'c'].map(k => `<td class="n">${(x.d[k] >= 0 ? '+' : '−') + num(Math.abs(x.d[k]), 1)}</td>`).join('')}<td class="wrap">${x.nw.map(n => `${hEsc(n.n)} (${num(n.w, 1)}${pctSfx()})`).join('; ') || '–'}</td></tr>`).join('') + `</tbody></table></div>` : `<p class="na">${t.noPf}</p>`) + `</section>`;
  $('body').innerHTML = h;
  ['tM', 'tG', 'tA', 't3', 'tP'].forEach(id => $(id) && cardify($(id)));
  document.title = `${t.title(lab)} · ${t.siteTitle}`;
  $('foot').textContent = t.foot;
  srcLines();
}
$('selR').addEventListener('change', e => { SEL = e.target.value; try { localStorage.setItem('revSel', SEL); } catch (x) {} render(); });
$('btnPr').addEventListener('click', () => { document.documentElement.dataset.print = 'plain'; setTimeout(() => window.print(), 50); });
renderHeader('review', render);
render();
