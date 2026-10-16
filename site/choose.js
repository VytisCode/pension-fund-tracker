/* „Kurį fondą rinktis?“ (savininkas 2026-10-16): pagal gimimo metus ir pakopą įvertina visus turimus duomenis ir surikiuoja fondus.
   Lyginama tik tarp panašių fondų: II pakopa – savo gimimo metų grupėje (6 valdytojai), III pakopa – LB kategorijoje, kuri tinka
   laikotarpiui iki pensijos (≥ 15 m. – akcijų, 7–15 m. – mišraus investavimo, < 7 m. – obligacijų).
   Kiekvienas rodiklis paverčiamas vieta grupėje (0–100 balų: geriausias 100, blogiausias 0), balai sveriami ir sudedami.
   Svoriai priklauso nuo laiko iki pensijos: toli – svarbiau ilgalaikė grąža ir mokestis, arti – kritimai ir stabilumas.
   Visi skaičiai – iš tų pačių vieneto verčių kaip kituose puslapiuose; mokesčiai – LB sąrašas (II – data_fee.js, III – data_rep.js). */
addStrings({
  ch: {
    title: 'Which fund to choose?', lead: 'Enter the year of birth and the pillar: all available data on the comparable funds are scored and ranked. Only similar funds are compared – pillar II within the birth-year group, pillar III within the Bank of Lithuania category that suits the time left to retirement.',
    birth: 'Year of birth', pl: 'Pillar', plII: 'Pillar II', plIII: 'Pillar III', plBoth: 'Pillars II and III', cat: 'Pillar III category', catAuto: 'by time to retirement',
    cats: { equity: 'Equity funds', mixed: 'Mixed funds', bond: 'Bond funds' },
    years: (b, y, r) => `Born ${b}: ${y} years to retirement (age 65, ${r}).`,
    pick2: (g, f, s) => `<b>Pillar II:</b> in the ${g} group the best long-term choice by these criteria is <b>${f}</b> (score ${s} of 100).`,
    pick3: (c, f, s) => `<b>Pillar III:</b> among ${c.toLowerCase()} the best choice is <b>${f}</b> (score ${s} of 100).`,
    why: 'Why: ', strong: { lt: 'highest long-term return', rec: 'strong last 3 years', cons: 'consistently high in calendar years', rr: 'best return per unit of risk', dd: 'smallest falls', fee: 'low fee' },
    th: ['#', 'Fund', 'Score', 'Long-term return p.a.', '3 years p.a.', 'Calendar-year consistency', 'Return / volatility', 'Max fall', 'Fee, %'],
    win: (a, b, n) => `Compared over the same window ${a} → ${b} (${n} years). Funds with a shorter history are listed below and not scored.`,
    short: 'Shorter history – not scored', weights: 'Weights for this horizon: ', wNames: { lt: 'long-term return', rec: '3-year return', cons: 'consistency', rr: 'return/volatility', dd: 'max fall', fee: 'fee' },
    how: 'How it is calculated',
    howTxt: 'Each metric is turned into a place in the group: the best fund gets 100 points, the worst 0, the rest in between by rank. The total = weighted average. Long-term return – annualised over the common window (up to 10 years); 3 years – annualised; consistency – average place in full calendar years in the window; return/volatility – annualised return ÷ annualised volatility of daily changes; max fall – largest fall from a peak in the window; fee – current management fee (Bank of Lithuania list). Returns are after fees (unit values). The far-from-retirement weights favour long-term return and cost, the close-to-retirement weights favour small falls and stability.',
    disc: 'Past results do not guarantee future results. This is a ranking by historical data for comparison, not personal investment advice: it does not know your other savings, risk tolerance or plans.',
    loading: 'Loading fee data…', none: 'Not enough data for this group.',
    rest: 'restricted withdrawal',
  },
}, {
  ch: {
    title: 'Kurį fondą rinktis?', lead: 'Įveskite gimimo metus ir pakopą: visi turimi palyginamų fondų duomenys įvertinami balais ir surikiuojami. Lyginami tik panašūs fondai – II pakopoje savo gimimo metų grupėje, III pakopoje – Lietuvos banko kategorijoje, kuri tinka laikui iki pensijos.',
    birth: 'Gimimo metai', pl: 'Pakopa', plII: 'II pakopa', plIII: 'III pakopa', plBoth: 'II ir III pakopa', cat: 'III pakopos kategorija', catAuto: 'pagal laiką iki pensijos',
    cats: { equity: 'Akcijų fondai', mixed: 'Mišraus investavimo fondai', bond: 'Obligacijų fondai' },
    years: (b, y, r) => `Gimęs ${b} m.: iki pensijos ${y} m. (65 metų, ${r} m.).`,
    pick2: (g, f, s) => `<b>II pakopa:</b> ${g} grupėje pagal šiuos kriterijus geriausias ilgalaikis pasirinkimas – <b>${f}</b> (įvertinimas ${s} iš 100).`,
    pick3: (c, f, s) => `<b>III pakopa:</b> tarp ${({ 'Akcijų fondai': 'akcijų fondų', 'Mišraus investavimo fondai': 'mišraus investavimo fondų', 'Obligacijų fondai': 'obligacijų fondų' })[c] || c} geriausias pasirinkimas – <b>${f}</b> (įvertinimas ${s} iš 100).`,
    why: 'Kodėl: ', strong: { lt: 'didžiausia ilgalaikė grąža', rec: 'stiprūs paskutiniai 3 metai', cons: 'nuolat aukštai kalendoriniais metais', rr: 'geriausia grąža rizikos vienetui', dd: 'mažiausi kritimai', fee: 'mažas mokestis' },
    th: ['#', 'Fondas', 'Balai', 'Ilgalaikė grąža, metinė', '3 metai, metinė', 'Pastovumas kalendoriniais metais', 'Grąža / svyravimas', 'Didž. kritimas', 'Mokestis, %'],
    win: (a, b, n) => `Lyginama tame pačiame laikotarpyje ${a} → ${b} (${n} m.). Trumpesnės istorijos fondai parodyti žemiau ir balais nevertinami.`,
    short: 'Trumpesnė istorija – nevertinama', weights: 'Svoriai šiam laikotarpiui iki pensijos: ', wNames: { lt: 'ilgalaikė grąža', rec: '3 metų grąža', cons: 'pastovumas', rr: 'grąža / svyravimas', dd: 'didž. kritimas', fee: 'mokestis' },
    how: 'Kaip skaičiuojama',
    howTxt: 'Kiekvienas rodiklis paverčiamas vieta grupėje: geriausias fondas gauna 100 balų, prasčiausias – 0, kiti – pagal vietą tarp jų. Bendras balas – svertinis vidurkis. Ilgalaikė grąža – metinė per bendrą laikotarpį (iki 10 metų); 3 metai – metinė; pastovumas – vidutinė vieta pilnais kalendoriniais metais tame laikotarpyje; grąža / svyravimas – metinė grąža ÷ metinis dienos pokyčių svyravimas; didžiausias kritimas – didžiausias kritimas nuo piko tame laikotarpyje; mokestis – dabartinis valdymo mokestis (Lietuvos banko sąrašas). Grąža – po mokesčių (vieneto vertės). Kai iki pensijos toli, daugiau sveria ilgalaikė grąža ir mokestis; kai arti – maži kritimai ir pastovumas.',
    disc: 'Ankstesni rezultatai negarantuoja būsimų. Tai reitingas pagal istorinius duomenis palyginimui, ne asmeninė investavimo rekomendacija: jis nežino kitų jūsų santaupų, požiūrio į riziką ir planų.',
    loading: 'Kraunami mokesčių duomenys…', none: 'Šiai grupei nepakanka duomenų.',
    rest: 'apriboto nutraukimo',
  },
});
const CH = { birth: null, pl: 'II', cat: '' };
try { const s = JSON.parse(localStorage.getItem('chState') || '{}'); if (s.birth) CH.birth = s.birth; if (['II', 'III', 'both'].includes(s.pl)) CH.pl = s.pl; if (typeof s.cat === 'string') CH.cat = s.cat; } catch (e) {}
const chSave = () => { try { localStorage.setItem('chState', JSON.stringify(CH)); } catch (e) {} };
const CH_LAST = Math.max(...DATA.groups.flatMap(g => g.funds.map(f => f.d[f.d.length - 1])));
const chNorm = s => s.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim().toLowerCase();
let CH_REP = null;
function chLoadRep() {           // III pakopos mokesčiai – iš data_rep.js (kraunama tik šiai kortelei)
  if (typeof REP !== 'undefined') return Promise.resolve();
  if (!CH_REP) CH_REP = new Promise(ok => { const s = document.createElement('script'); s.src = 'data_rep.js?v=' + encodeURIComponent(JDATA.generated); s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
  return CH_REP;
}
function chGroupOf(birth) {
  const g = DATA.groups.filter(x => x.id !== 'turto').find(x => { const [a, b] = x.id.split('-').map(Number); return birth >= a && birth <= b; });
  if (g) return g;
  const ids = DATA.groups.filter(x => x.id !== 'turto').map(x => x.id).sort();
  return birth < +ids[0].slice(0, 4) ? DATA.groups.find(x => x.id === 'turto') : DATA.groups.find(x => x.id === ids[ids.length - 1]);
}
/* rodikliai vienam fondui laikotarpyje [a, b] */
function chStats(f, a, b) {
  const ia = lastOnOrBefore(f, a), ib = lastOnOrBefore(f, b);
  if (ia < 0 || ib <= ia || f.d[0] > a + 7) return null;
  const yrs = (f.d[ib] - f.d[ia]) / 365.25, lt = (Math.pow(f.v[ib] / f.v[ia], 1 / yrs) - 1) * 100;
  const r = []; let pk = f.v[ia], dd = 0;
  for (let i = ia + 1; i <= ib; i++) { if (f.v[i] !== f.v[i - 1]) r.push(Math.log(f.v[i] / f.v[i - 1])); pk = Math.max(pk, f.v[i]); dd = Math.min(dd, f.v[i] / pk - 1); }
  const mu = r.reduce((s, x) => s + x, 0) / (r.length || 1), sd = Math.sqrt(r.reduce((s, x) => s + (x - mu) ** 2, 0) / Math.max(1, r.length - 1));
  const span = (f.d[ib] - f.d[ia]) || 1, perYear = r.length / (span / 365.25), vol = sd * Math.sqrt(perYear) * 100;
  const i3 = lastOnOrBefore(f, b - Math.round(3 * 365.25)), rec = i3 >= 0 && f.d[0] <= b - 3 * 365 ? (Math.pow(f.v[ib] / f.v[i3], 1 / ((f.d[ib] - f.d[i3]) / 365.25)) - 1) * 100 : null;
  return { lt, rec, vol, rr: vol ? lt / vol : null, dd: dd * 100 };
}
function chYearRet(f, y, b) {
  const a = Math.round(Date.UTC(y - 1, 11, 31) / DAY), e = Math.min(b, Math.round(Date.UTC(y, 11, 31) / DAY)), ia = lastOnOrBefore(f, a), ie = lastOnOrBefore(f, e);
  return ia >= 0 && ie > ia && f.d[0] <= a + 7 ? f.v[ie] / f.v[ia] - 1 : null;
}
const chPctRank = (vals, better) => {   // [v] -> [0..100] pagal vietą (better: 1 – didesnis geriau, −1 – mažesnis geriau)
  const idx = vals.map((v, i) => [v, i]).filter(x => x[0] != null).sort((p, q) => better * (q[0] - p[0])), n = idx.length, out = vals.map(() => null);
  idx.forEach(([v, i], k) => { const first = idx.findIndex(x => x[0] === v); out[i] = n > 1 ? 100 * (1 - first / (n - 1)) : 100; });
  return out;
};
function chWeights(left) {             // svoriai pagal metus iki pensijos
  if (left >= 20) return { lt: 30, rec: 10, cons: 20, rr: 10, dd: 10, fee: 20 };
  if (left >= 10) return { lt: 25, rec: 10, cons: 20, rr: 15, dd: 15, fee: 15 };
  return { lt: 15, rec: 10, cons: 20, rr: 20, dd: 25, fee: 10 };
}
/* fondų sąrašas [{name, d, v, fee, brand}] -> įvertinimas */
function chScore(funds, left) {
  const b = Math.min(CH_LAST, Math.max(...funds.map(f => f.d[f.d.length - 1])));
  const starts = funds.map(f => f.d[0]).sort((x, y) => x - y);
  // bendras laikotarpis: iki 10 metų; jei jauniausias fondas jaunesnis nei 3 m. – jis nevertinamas
  let a = Math.max(b - Math.round(10 * 365.25), starts[0]);
  const old = funds.filter(f => f.d[0] <= b - 3 * 365);
  a = Math.max(a, ...old.map(f => f.d[0]));
  const inW = funds.filter(f => f.d[0] <= a + 7), out = funds.filter(f => !inW.includes(f));
  const st = inW.map(f => ({ f, s: chStats(f, a, b) })).filter(x => x.s);
  const y0 = new Date(a * DAY).getUTCFullYear() + 1, y1 = new Date(b * DAY).getUTCFullYear() - 1, ys = []; for (let y = y0; y <= y1; y++) ys.push(y);
  const cons = st.map(() => []);
  ys.forEach(y => { const rs = st.map(x => chYearRet(x.f, y, b)), pr = chPctRank(rs, 1); pr.forEach((p, i) => { if (p != null) cons[i].push(p); }); });
  st.forEach((x, i) => { x.s.cons = cons[i].length ? cons[i].reduce((s, v) => s + v, 0) / cons[i].length : null; x.s.fee = x.f.fee; });
  const W = chWeights(left), keys = Object.keys(W), dir = { lt: 1, rec: 1, cons: 1, rr: 1, dd: 1, fee: -1 };
  const P = {}; keys.forEach(k => { P[k] = chPctRank(st.map(x => x.s[k] ?? null), dir[k]); });
  st.forEach((x, i) => { let s = 0, w = 0; keys.forEach(k => { if (P[k][i] != null) { s += P[k][i] * W[k]; w += W[k]; } }); x.score = w ? s / w : null; x.p = Object.fromEntries(keys.map(k => [k, P[k][i]])); });
  st.sort((p, q) => (q.score ?? -1) - (p.score ?? -1));
  return { a, b, st, out, W, years: ((b - a) / 365.25).toFixed(1).replace('.', lang === 'lt' ? ',' : '.') };
}
function chTable(R, id) {
  const X = T().ch, cell = (v, f) => v == null ? '<td class="na">–</td>' : `<td>${f(v)}</td>`;
  const rows = R.st.map((x, i) => `<tr${i === 0 ? ' class="cur"' : ''}><td>${i + 1}</td><td class="l">${hEsc(x.f.name)}</td><td><b>${x.score == null ? '–' : num(x.score, 0)}</b></td>${cell(x.s.lt, v => pctPlain(v))}${cell(x.s.rec, v => pctPlain(v))}${cell(x.s.cons, v => num(v, 0) + ' / 100')}${cell(x.s.rr, v => num(v, 2))}${cell(x.s.dd, v => pctPlain(v))}${cell(x.s.fee, v => num(v, 2))}</tr>`).join('')
    + R.out.map(f => `<tr class="est"><td></td><td class="l">${hEsc(f.name)} <span class="na">(${X.short}, ${lang === 'lt' ? 'nuo' : 'since'} ${iso(f.d[0])})</span></td><td class="na">–</td><td colspan="6"></td></tr>`).join('');
  return `<div class="scroll"><table class="jt" id="${id}"><thead><tr>${X.th.map((h, i) => `<th class="${i === 1 ? 'l' : ''}">${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
const chWhy = x => { const X = T().ch, ks = Object.entries(x.p).filter(([, v]) => v != null && v >= 80).sort((p, q) => q[1] - p[1]).map(([k]) => X.strong[k]); return ks.length ? X.why + ks.slice(0, 3).join(', ') + '.' : ''; };
const CH_R = {};
function renderChoose() {
  const box = document.getElementById('pickBody'); if (!box) return;
  const X = T().ch, now = new Date(CH_LAST * DAY).getUTCFullYear();
  CH.birth = (typeof ST !== 'undefined' && ST.birth) || CH.birth || 1990;   // gimimo metai – iš nustatymų viršuje (vienas įvedimas puslapyje)
  document.getElementById('pickTitle').textContent = X.title;
  const left = Math.max(0, 65 - (now - CH.birth)), autoCat = left >= 15 ? 'equity' : left >= 7 ? 'mixed' : 'bond', cat = CH.cat || autoCat;
  const plSeg = `<div class="seg" role="group" data-ch="pl">${[['II', X.plII], ['III', X.plIII], ['both', X.plBoth]].map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === CH.pl}">${l}</button>`).join('')}</div>`;
  const catSel = `<select data-ch="cat"><option value="">${X.cats[autoCat]} (${X.catAuto})</option>${Object.keys(X.cats).map(k => `<option value="${k}"${k === CH.cat ? ' selected' : ''}>${X.cats[k]}</option>`).join('')}</select>`;
  let h = `<p class="lead" style="margin-top:0">${X.lead}</p><div class="bar" style="display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:10px 0">
    ${plSeg}${CH.pl !== 'II' ? `<label class="field">${X.cat} ${catSel}</label>` : ''}</div>
    <p>${X.years(CH.birth, left, CH.birth + 65)} ${X.weights}${Object.entries(chWeights(left)).map(([k, w]) => `${X.wNames[k]} ${w} %`).join(', ')}.</p>`;
  const parts = [];
  if (CH.pl !== 'III') {
    const g = chGroupOf(CH.birth), funds = g.funds.map(f => ({ name: labelOf(f.provider) + ' ' + groupLabel(g), brand: f.provider, d: f.d, v: f.v, fee: typeof FEES !== 'undefined' ? FEES[`${f.provider}|${g.id}`] ?? null : null }));
    const R = chScore(funds, left);
    parts.push(R.st.length ? `<h3 class="sub3">${X.plII} · ${groupLabel(g)}</h3><p>${X.pick2(groupLabel(g), hEsc(R.st[0].f.name), num(R.st[0].score, 0))} ${chWhy(R.st[0])}</p><p class="note">${X.win(iso(R.a), iso(R.b), R.years)}</p>${chTable(R, 'chT2')}` : `<p class="note">${X.none}</p>`);
    CH_R.chT2 = { R, left, title: `${X.plII} · ${groupLabel(g)}` };
  }
  if (CH.pl !== 'II') {
    if (typeof REP === 'undefined') { parts.push(`<p class="note">${X.loading}</p>`); chLoadRep().then(renderChoose); }
    else {
      const fee = n => { const r = REP.funds.find(x => x.pl === 'III' && chNorm(x.n) === chNorm(n)); return r && r.fee != null ? r.fee : null; };
      const funds = P3.filter(f => f.cat === cat).map(f => ({ name: f.name, brand: f.brand, d: f.d, v: f.v, fee: fee(f.name) }));
      const R = funds.length ? chScore(funds, left) : null;
      parts.push(R && R.st.length ? `<h3 class="sub3">${X.plIII} · ${X.cats[cat]}</h3><p>${X.pick3(X.cats[cat], hEsc(R.st[0].f.name), num(R.st[0].score, 0))} ${chWhy(R.st[0])}</p><p class="note">${X.win(iso(R.a), iso(R.b), R.years)}</p>${chTable(R, 'chT3')}` : `<p class="note">${X.none}</p>`);
      if (R) CH_R.chT3 = { R, left, title: `${X.plIII} · ${X.cats[cat]}` };
    }
  }
  h += parts.join('') + `<details style="margin-top:12px"><summary>${X.how}</summary><p class="note">${X.howTxt}</p></details><p class="note"><b>${X.disc}</b></p>`;
  box.innerHTML = h;
  box.querySelectorAll('[data-ch="pl"] button').forEach(b => b.addEventListener('click', () => { CH.pl = b.dataset.v; chSave(); renderChoose(); }));
  const cs = box.querySelector('[data-ch="cat"]'); if (cs) cs.addEventListener('change', e => { CH.cat = e.target.value; chSave(); renderChoose(); });
  if (typeof tableTools === 'function') try { tableTools(box); } catch (e) {}
}
/* Excel su skaičiavimais (auditui): vertės → rodikliai → vieta grupėje (0–100) → balai; visa grandinė formulėmis */
function chBook(id) {
  const C = CH_R[id]; if (!C || !C.R.st.length) return null;
  const { R, left, title } = C, X = T().ch, L = lang === 'lt', st = R.st, n = st.length, SV = L ? 'Vertės' : 'Values', SR = L ? 'Rodikliai' : 'Metrics', SY = L ? 'Metai' : 'Years', q = s_ => `'${s_}'`;
  /* Vertės: kiekvienam fondui 5 stulpeliai – data, vertė, log grąža, viršūnė, kritimas nuo viršūnės */
  const blocks = st.map(x => { const f = x.f, ia = lastOnOrBefore(f, R.a), ib = lastOnOrBefore(f, R.b); return { ia, ib, n: ib - ia + 1 }; });
  const H = Math.max(...blocks.map(b => b.n)), vals = [st.flatMap(x => [`${x.f.name}: ${L ? 'data' : 'date'}`, L ? 'vertė' : 'value', L ? 'log grąža' : 'log return', L ? 'viršūnė' : 'peak', L ? 'kritimas' : 'drawdown'])];
  const pk = st.map(() => 0);
  for (let k = 0; k < H; k++) { const r = k + 2; vals.push(st.flatMap((x, i) => { const b = blocks[i], f = x.f, c = j => xlCol(i * 5 + j); if (k >= b.n) return [null, null, null, null, null]; const at = b.ia + k; pk[i] = Math.max(k ? pk[i] : f.v[at], f.v[at]);
    const lr = k ? (f.v[at] !== f.v[at - 1] ? xlF(`IF(${c(1)}${r}=${c(1)}${r - 1},"",LN(${c(1)}${r}/${c(1)}${r - 1}))`, Math.log(f.v[at] / f.v[at - 1]), '0.000000') : { f: `IF(${c(1)}${r}=${c(1)}${r - 1},"",LN(${c(1)}${r}/${c(1)}${r - 1}))`, v: '' }) : null;
    return [xlDate(f.d[at]), { t: 'n', v: f.v[at], z: '0.0000' }, lr, k ? xlF(`MAX(${c(3)}${r - 1},${c(1)}${r})`, pk[i], '0.0000') : xlF(`${c(1)}${r}`, f.v[at], '0.0000'), xlF(`${c(1)}${r}/${c(3)}${r}-1`, f.v[at] / pk[i] - 1, '0.00%')]; })); }
  const rng = (i, j) => `${q(SV)}!$${xlCol(i * 5 + j)}$2:$${xlCol(i * 5 + j)}$${blocks[i].n + 1}`, look = (i, cell) => `INDEX(${rng(i, 1)},MATCH(${cell},${rng(i, 0)},1))`;
  /* Rodikliai */
  const met = [[L ? 'Fondas' : 'Fund', L ? 'Pradžia' : 'Start', L ? 'Pradžios vertė' : 'Start value', L ? 'Pabaiga' : 'End', L ? 'Pabaigos vertė' : 'End value', L ? 'Metai' : 'Years', X.th[3], L ? '3 m. pradžia' : '3 y start', L ? '3 m. pradžios vertė' : '3 y start value', X.th[4], L ? 'Svyravimas, metinis' : 'Volatility p.a.', X.th[6], X.th[7], X.th[8], X.th[5]]];
  st.forEach((x, i) => { const r = i + 2, f = x.f, b = blocks[i], s_ = x.s, d3 = f.d[0] <= R.b - 3 * 365 ? lastOnOrBefore(f, R.b - Math.round(3 * 365.25)) : -1;
    met.push([f.name, xlDate(f.d[b.ia]), xlF(`${q(SV)}!${xlCol(i * 5 + 1)}2`, f.v[b.ia], '0.0000'), xlDate(f.d[b.ib]), xlF(`${q(SV)}!${xlCol(i * 5 + 1)}${b.n + 1}`, f.v[b.ib], '0.0000'), xlF(`(D${r}-B${r})/365.25`, (f.d[b.ib] - f.d[b.ia]) / 365.25, '0.00'),
      xlF(`(E${r}/C${r})^(1/F${r})-1`, s_.lt / 100, '0.00%'), d3 >= 0 ? xlDate(f.d[d3]) : null, d3 >= 0 ? (d3 >= b.ia ? xlF(look(i, `H${r}`), f.v[d3], '0.0000') : { t: 'n', v: f.v[d3], z: '0.0000' }) : null,
      s_.rec == null ? null : xlF(`(E${r}/I${r})^(1/((D${r}-H${r})/365.25))-1`, s_.rec / 100, '0.00%'),
      xlF(`STDEV(${rng(i, 2)})*SQRT(COUNT(${rng(i, 2)})/F${r})`, s_.vol / 100, '0.00%'), s_.rr == null ? null : xlF(`G${r}/K${r}`, s_.rr, '0.00'), xlF(`MIN(${rng(i, 4)})`, s_.dd / 100, '0.00%'),
      s_.fee == null ? null : { t: 'n', v: s_.fee, z: '0.00' }, s_.cons == null ? null : xlF(`AVERAGE(${q(SY)}!${xlCol(1)}${n + 4 + i}:${xlCol(Math.max(1, 1 + yrs().length - 1))}${n + 4 + i})`, s_.cons, '0.0')]); });
  function yrs() { const y0 = new Date(R.a * DAY).getUTCFullYear() + 1, y1 = new Date(R.b * DAY).getUTCFullYear() - 1, o = []; for (let y = y0; y <= y1; y++) o.push(y); return o; }
  /* Metai: kalendorinių metų grąža ir vieta (0–100) kiekvienais metais */
  const ys = yrs(), yr = [[L ? 'Kalendorinių metų grąža' : 'Calendar-year return', ...ys.map(String)]];
  const yRet = st.map(x => ys.map(y => chYearRet(x.f, y, R.b)));
  st.forEach((x, i) => yr.push([x.f.name, ...ys.map((y, j) => { const v = yRet[i][j]; if (v == null) return null; const a = Math.round(Date.UTC(y - 1, 11, 31) / DAY), e = Math.min(R.b, Math.round(Date.UTC(y, 11, 31) / DAY));
    return xlF(`${look(i, e + 25569)}/${look(i, a + 25569)}-1`, v, '0.00%'); })]));
  yr.push([], [L ? 'Vieta metais (0–100: 100 – geriausias)' : 'Rank in the year (0–100: 100 – best)', ...ys.map(String)]);
  const pr = ys.map((_, j) => chPctRank(yRet.map(r => r[j]), 1));
  st.forEach((x, i) => { const r = n + 4 + i; yr.push([x.f.name, ...ys.map((_, j) => { const c = xlCol(1 + j), cell = `${c}${i + 2}`, col = `$${c}$2:$${c}$${n + 1}`;
    return pr[j][i] == null ? null : xlF(`IF(COUNT(${col})>1,100*(1-COUNTIF(${col},">"&${cell})/(COUNT(${col})-1)),100)`, pr[j][i], '0.0'); })]); void r; });
  /* Rezultatas: rodiklių vietos ir balai */
  const W = R.W, keys = ['lt', 'rec', 'cons', 'rr', 'dd', 'fee'], mc = { lt: 'G', rec: 'J', cons: 'O', rr: 'L', dd: 'M', fee: 'N' }, dir = { lt: 1, rec: 1, cons: 1, rr: 1, dd: 1, fee: -1 };
  const res = [[`${X.title} · ${title}`], [X.win(iso(R.a), iso(R.b), R.years).replace(/<[^>]+>/g, '')], [...X.th, ...keys.map(k => `${L ? 'Vieta' : 'Rank'}: ${X.wNames[k]}`)]];
  const wRow = n + 5;
  st.forEach((x, i) => { const r = i + 4, mr = i + 2, metRef = k => `${q(SR)}!${mc[k]}${mr}`, colRef = k => `${q(SR)}!$${mc[k]}$2:$${mc[k]}$${n + 1}`;
    const pc_ = keys.map((k, j) => x.p[k] == null ? null : xlF(`IF(COUNT(${colRef(k)})>1,100*(1-COUNTIF(${colRef(k)},"${dir[k] > 0 ? '>' : '<'}"&${metRef(k)})/(COUNT(${colRef(k)})-1)),100)`, x.p[k], '0.0'));
    const pcl = j => xlCol(9 + j), num_ = keys.map((k, j) => `IF(${pcl(j)}${r}="",0,${pcl(j)}${r}*${pcl(j)}$${wRow})`).join('+'), den = keys.map((k, j) => `IF(${pcl(j)}${r}="",0,${pcl(j)}$${wRow})`).join('+');
    res.push([i + 1, x.f.name, x.score == null ? null : xlF(`(${num_})/(${den})`, x.score, '0.0'), ...keys.map(k => { const v = x.s[k]; if (v == null) return null; const z = k === 'rr' ? '0.00' : k === 'cons' ? '0.0' : k === 'fee' ? '0.00' : '0.00%'; return xlF(metRef(k), k === 'lt' || k === 'rec' || k === 'dd' ? v / 100 : v, z); }), ...pc_]); });
  res.push([], [L ? 'Svoriai, %' : 'Weights, %', null, null, null, null, null, null, null, null, ...keys.map(k => W[k])]);
  const out = R.out.map(f => `${f.name} (${X.short}, ${iso(f.d[0])})`);
  const wb = XLSX_SHIM.utils.book_new(), add = (rows, name, w) => { const ws = XLSX_SHIM.utils.aoa_to_sheet(rows); ws['!cols'] = w; XLSX_SHIM.utils.book_append_sheet(wb, ws, name); };
  add(res, L ? 'Rezultatas' : 'Result', [{ wch: 4 }, { wch: 30 }, ...Array(13).fill({ wch: 12 })]); add(met, SR, [{ wch: 30 }, ...Array(14).fill({ wch: 12 })]); add(yr, SY, [{ wch: 30 }, ...ys.map(() => ({ wch: 9 }))]);
  add(vals, SV, st.flatMap(() => [{ wch: 11 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 9 }]));
  add([[L ? 'Metodika' : 'Methodology'], [L ? 'Laikotarpis' : 'Period', X.win(iso(R.a), iso(R.b), R.years).replace(/<[^>]+>/g, '')],
    [L ? 'Rodikliai' : 'Metrics', L ? 'Ilgalaikė grąža = (pabaiga ÷ pradžia)^(1 ÷ metai) − 1; 3 metų – tas pats nuo vertės prieš 3 metus; svyravimas = STDEV(log dienos grąžų, kai vertė pasikeitė) × √(grąžų sk. per metus); grąža / svyravimas; didžiausias kritimas = MIN(vertė ÷ ankstesnė viršūnė − 1); pastovumas = vietų kalendoriniais metais vidurkis.' : 'Long-term return = (end ÷ start)^(1 ÷ years) − 1; 3 years – the same from the value 3 years earlier; volatility = STDEV(daily log returns where the value changed) × √(returns per year); return / volatility; max fall = MIN(value ÷ previous peak − 1); consistency = average calendar-year rank.'],
    [L ? 'Vieta (0–100)' : 'Rank (0–100)', L ? '100 × (1 − kiek fondų geresni ÷ (fondų sk. − 1)); mokesčiui geresnis – mažesnis.' : '100 × (1 − number of better funds ÷ (number of funds − 1)); for the fee lower is better.'],
    [L ? 'Balai' : 'Score', L ? 'Σ(vieta × svoris) ÷ Σ svorių (tik rodikliai su reikšme); svoriai priklauso nuo metų iki pensijos.' : 'Σ(rank × weight) ÷ Σ weights (metrics with a value only); weights depend on years to retirement.'],
    ...(out.length ? [[L ? 'Nevertinti' : 'Not scored', out.join('; ')]] : []), [L ? 'Pastaba' : 'Note', X.disc]], L ? 'Metodika' : 'Methodology', [{ wch: 16 }, { wch: 110 }]);
  return { sheets: XLSX_SHIM.toXL(wb), own: true };
}
['chT2', 'chT3'].forEach(id => XLB.set(id, async () => chBook(id)));
renderChoose();
