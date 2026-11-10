/* ---------- Mano kortelės (savininkas 2026-11-10: „leisti pačiam pakeisti, ką nori matyti iš pasiūlytų variantų … valdyti laike, pagal fondą
   ir pagal valdytoją“) – Pradžios skirtuke „Šiandien“.
   Kortelių rinkinys saugomas naršyklėje (localStorage, atskirai kiekvienai šaliai); mygtukas „Dalintis vaizdu“ įrašo rinkinį į nuorodą (?my=…),
   kad kolega matytų tą patį. Visi skaičiai skaičiuojami tomis pačiomis funkcijomis kaip likusioje svetainėje (seriesOf, byMgr, AUM.payouts) –
   naujų rodiklių ar kitokių apibrėžimų čia nėra. ---------- */
const MYS = {
  lt: { h: 'Mano kortelės', lead: 'Pasirinkite, ką norite matyti. Rinkinys išsaugomas šioje naršyklėje; „Dalintis vaizdu“ nukopijuoja nuorodą su tuo pačiu rinkiniu.',
    add: '+ Pridėti kortelę', share: 'Dalintis vaizdu', shared: 'Nuoroda nukopijuota', reset: 'Atstatyti', lib: 'Kortelių biblioteka', close: 'Uždaryti',
    up: 'Aukštyn', down: 'Žemyn', rm: 'Pašalinti', sharedV: 'Žiūrite pasidalintą vaizdą.', keep: 'Išsaugoti kaip mano', drop: 'Grįžti prie mano', empty: 'Kortelių nėra – pridėkite iš bibliotekos.',
    per: 'Laikotarpis', fund: 'Fondas', fund2: 'Lyginti su', mgr: 'Valdytojas', grp: 'Grupė', metric: 'Rodiklis', all: 'Visi valdytojai', load: 'Įkeliama…',
    P: { d: '1 d.', w: '1 sav.', mtd: 'Mėnuo', qtd: 'Ketvirtis', ytd: 'Šie metai', '1y': '1 metai', '3y': '3 metai', '5y': '5 metai' },
    T: { fund: ['Fondo grąža', 'Vieno fondo grąža, vieta grupėje ir kreivė'], mgr: ['Valdytojas visose grupėse', 'Valdytojo fondų grąža ir vieta kiekvienoje grupėje'],
      grp: ['Grupės reitingas', 'Visi grupės fondai pagal grąžą'], cmp: ['Du fondai', 'Dviejų fondų grąža ir skirtumas'], dd: ['Didžiausias kritimas', 'Fondo kritimas nuo piko per laikotarpį'],
      share: ['Rinkos dalis', 'Valdytojo turto ar dalyvių dalis ir pokytis'], reform: ['Reformos išmokos', 'Kiek išmokėta išeinantiems iš II pakopos (2026–2027)'], news: ['Naujienos apie valdytoją', 'Naujausi straipsniai, kuriuose minimas valdytojas'],
      peer: ['Prieš svertinį vidurkį', 'Kiek kiekvienas fondas ar valdytojas lenkia turtu svertinį vidurkį'], brag: ['Kodėl mes geriausi', 'Valdytojo stiprybės: kur jis pirmas ar virš svertinio vidurkio (marketingui)'] },
    wAvg: 'Turtu svertinis vidurkis', allG: 'Visos grupės (valdytojai)', b1: (g, p) => `geriausias grupėje ${g} per ${p}`, bW: (g, p, d) => `virš grupės ${g} svertinio vidurkio per ${p} (${d})`, bDD: (g, p) => `mažiausias kritimas grupėje ${g} per ${p}`, bCnt: (n, m, p) => `${n} iš ${m} fondų – virš savo grupės svertinio vidurkio per ${p}`, bNone: 'Šiais laikotarpiais nėra kuo pasigirti – pabandykite kitą valdytoją.', pw: { ytd: 'šiuos metus', '1y': '1 metus', '3y': '3 metus', '5y': '5 metus' },
    place: (k, n) => `${k} vieta iš ${n} grupėje`, med: 'grupės mediana', diff: 'skirtumas', ddNow: 'dabar nuo piko', ddMax: 'didžiausias kritimas', peak: 'pikas',
    shNav: 'Turto dalis', shPart: 'Dalyvių dalis', shY: 'per metus', paid: 'išmokėta iš viso', ofA: 'turto', q: 'ketv.', noNews: 'Straipsnių nerasta.', noData: 'Duomenų nėra.' },
  en: { h: 'My cards', lead: 'Choose what you want to see. The set is saved in this browser; “Share view” copies a link with the same set.',
    add: '+ Add card', share: 'Share view', shared: 'Link copied', reset: 'Reset', lib: 'Card library', close: 'Close',
    up: 'Up', down: 'Down', rm: 'Remove', sharedV: 'You are looking at a shared view.', keep: 'Save as mine', drop: 'Back to mine', empty: 'No cards – add some from the library.',
    per: 'Period', fund: 'Fund', fund2: 'Compare with', mgr: 'Manager', grp: 'Group', metric: 'Measure', all: 'All managers', load: 'Loading…',
    P: { d: '1 d', w: '1 wk', mtd: 'Month', qtd: 'Quarter', ytd: 'This year', '1y': '1 year', '3y': '3 years', '5y': '5 years' },
    T: { fund: ['Fund return', 'Return of one fund, its place in the group and a curve'], mgr: ['Manager across groups', 'The manager’s fund return and place in every group'],
      grp: ['Group ranking', 'All funds of a group by return'], cmp: ['Two funds', 'Return of two funds and the difference'], dd: ['Largest fall', 'The fund’s fall from its peak within the period'],
      share: ['Market share', 'The manager’s share of assets or members and its change'], reform: ['Reform payouts', 'Money paid to people leaving pillar II (2026–2027)'], news: ['News on a manager', 'Latest articles that mention the manager'],
      peer: ['Versus weighted average', 'How far each fund or manager is above the asset-weighted average'], brag: ['Why we are the best', 'The manager’s strengths: where it is first or above the weighted average (for marketing)'] },
    wAvg: 'Asset-weighted average', allG: 'All groups (managers)', b1: (g, p) => `best in group ${g} over ${p}`, bW: (g, p, d) => `above the weighted average of ${g} over ${p} (${d})`, bDD: (g, p) => `smallest fall in group ${g} over ${p}`, bCnt: (n, m, p) => `${n} of ${m} funds above their group’s weighted average over ${p}`, bNone: 'Nothing to highlight in these periods – try another manager.', pw: { ytd: 'this year', '1y': '1 year', '3y': '3 years', '5y': '5 years' },
    place: (k, n) => `${k} of ${n} in the group`, med: 'group median', diff: 'difference', ddNow: 'now from peak', ddMax: 'largest fall', peak: 'peak',
    shNav: 'Share of assets', shPart: 'Share of members', shY: 'in a year', paid: 'paid in total', ofA: 'of assets', q: 'Q', noNews: 'No articles found.', noData: 'No data.' },
  lv: { h: 'Manas kartītes', add: '+ Pievienot kartīti', share: 'Dalīties ar skatu', shared: 'Saite nokopēta', reset: 'Atiestatīt', lib: 'Kartīšu bibliotēka', close: 'Aizvērt',
    up: 'Uz augšu', down: 'Uz leju', rm: 'Noņemt', per: 'Periods', fund: 'Fonds', fund2: 'Salīdzināt ar', mgr: 'Pārvaldnieks', grp: 'Grupa', metric: 'Rādītājs', all: 'Visi pārvaldnieki',
    P: { d: '1 d.', w: '1 ned.', mtd: 'Mēnesis', qtd: 'Ceturksnis', ytd: 'Šis gads', '1y': '1 gads', '3y': '3 gadi', '5y': '5 gadi' } },
  et: { h: 'Minu kaardid', add: '+ Lisa kaart', share: 'Jaga vaadet', shared: 'Link kopeeritud', reset: 'Lähtesta', lib: 'Kaartide kogu', close: 'Sulge',
    up: 'Üles', down: 'Alla', rm: 'Eemalda', per: 'Periood', fund: 'Fond', fund2: 'Võrdle', mgr: 'Fondivalitseja', grp: 'Grupp', metric: 'Näitaja', all: 'Kõik valitsejad',
    P: { d: '1 p', w: '1 näd', mtd: 'Kuu', qtd: 'Kvartal', ytd: 'See aasta', '1y': '1 aasta', '3y': '3 aastat', '5y': '5 aastat' } },
};
const myT = () => { const u = typeof ulang === 'string' ? ulang : lang, b = u === 'lt' ? MYS.lt : MYS.en, x = MYS[u] || {}; return { ...b, ...x, P: { ...b.P, ...(x.P || {}) } }; };
const MY_C = typeof CTRY_COPY !== 'undefined' ? CTRY_COPY : 'LT', MY_KEY = 'myCards_' + MY_C;
const MY_TYPES = ['fund', 'mgr', 'grp', 'cmp', 'peer', 'brag', 'dd', 'share', ...(MY_C === 'LT' ? ['reform'] : []), 'news'];
const MY_PERS = ['d', 'w', 'mtd', 'qtd', 'ytd', '1y', '3y', '5y'];
const myGroups = () => DATA.groups;
/* III pakopos fondai (tik LT; savininkas 2026-11-10: „mėgstu lyginti SEB index. Klimato ateitis su SEB 1996“) – data3.js įkeliamas tik kai reikia */
let D3 = null, D3_L = 0;
function myNeed3() { if (D3_L || MY_C !== 'LT') return; D3_L = 1;
  fetch('data3.js').then(r => r.text()).then(tx => { const D = (new Function(tx + '\n;return DATA;'))();
    D.groups.forEach(g => g.funds.forEach(f => { if (!f.d) { const d = [f.d0]; f.dd.forEach(x => d.push(d[d.length - 1] + x)); f.d = d; } }));
    D.groups.forEach(g => { g._p3 = 1; g._br = Object.fromEntries(D.providers.map(p => [p.id, p.brand])); }); D3 = D; myRender(); }).catch(() => {}); }
const myG3 = () => D3 ? D3.groups : [];
const myGL = g => g._p3 ? `${lang === 'lt' ? 'III pakopa' : 'Pillar III'} · ${g.label || groupLabel(g)}` : groupLabel(g);
const myFunds = () => [...DATA.groups, ...myG3()].flatMap(g => g.funds.map(f => ({ k: (g._p3 ? '3|' : '') + g.id + '|' + f.provider + '|' + f.name, g, f })));
const myFCol = x => x.g._p3 ? (brandCol(x.g._br[x.f.provider]) || 'var(--text-3)') : myPCol(x.f.provider);
const myFund = k => (k && k.startsWith('3?') ? myFunds().find(x => x.g._p3 && x.f.name === k.slice(2)) : null) || myFunds().find(x => x.k === k) || myFunds().find(x => k && x.k.startsWith(k.split('|').slice(0, 2).join('|') + '|')) || null;
const myPName = p => CTRY ? MOF[p] : labelOf(p);   // fondo tiekėjas → valdytojo vardas (LV/EE kopijose tiekėjas = fondas)
const myProv = () => [...new Set(DATA.providers.map(p => myPName(p.id)))];   // valdytojų vardai
const myPCol = p => brandCol(myPName(p)) || colorOf(p);
const myMCol = m => brandCol(m) || (DATA.providers.find(p => myPName(p.id) === m) ? colorOf(DATA.providers.find(p => myPName(p.id) === m).id) : 'var(--accent)');
function myAnchor(per, end) { if (/^\dy$/.test(per)) return end - Math.round(365.25 * +per[0]); return anchorOf(per, end); }
function myRets(g, per) {                 // {fundKey: grąža} grupėje – tas pats kaip groupRets(), bet ir ilgesni laikotarpiai
  const { end, overallLast } = groupEnd(g), a = myAnchor(per, end), out = [];
  g.funds.forEach(f => { const s = f.d[f.d.length - 1] >= overallLast - 5 ? seriesOf(f, a, end) : null; if (s) out.push({ f, s, k: g.id + '|' + f.provider + '|' + f.name }); });
  return { out: out.sort((x, y) => y.s.ret - x.s.ret), end, a };
}
function myDefaults() {
  const ps = myProv(), aum = m => DATA.groups.flatMap(g => g.funds).filter(f => myPName(f.provider) === m).reduce((s, f) => s + (f.assets || 0), 0);
  const ref = MY_C === 'LT' && ps.includes('SEB') ? 'SEB' : [...ps].sort((a, b) => aum(b) - aum(a))[0], fs = myFunds(), g0 = LC[Math.floor((LC.length - 1) / 2)] || DATA.groups[0];
  const f0 = fs.find(x => x.g === g0 && myPName(x.f.provider) === ref) || fs.find(x => myPName(x.f.provider) === ref) || fs[0], f1 = fs.find(x => x.g === f0.g && x.f !== f0.f) || fs[1] || f0;
  const s96 = MY_C === 'LT' && fs.find(x => x.g.id === '1996-2002' && x.f.provider === 'SEB');
  return [{ t: 'fund', f: f0.k, p: 'ytd' }, s96 ? { t: 'cmp', f: s96.k, f2: '3?SEB index. Klimato ateitis', p: '1y' } : { t: 'cmp', f: f0.k, f2: f1.k, p: '1y' }, { t: 'peer', g: 'all', p: '1y' }, { t: 'brag', m: ref },
    { t: 'mgr', m: ref, p: 'ytd' }, { t: 'share', m: ref, k: 'nav' }, ...(MY_C === 'LT' ? [{ t: 'reform', m: '' }] : []), { t: 'news', m: ref }];
}
const b64e = o => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64d = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
let MY = null, MY_SHARED = false;
(function myLoad() {
  try { const q = new URLSearchParams(location.search).get('my'); if (q) { const x = b64d(q); if (Array.isArray(x)) { MY = x.filter(c => MY_TYPES.includes(c.t)); MY_SHARED = true; return; } } } catch (e) {}
  try { const x = JSON.parse(localStorage.getItem(MY_KEY) || 'null'); if (Array.isArray(x)) MY = x.filter(c => MY_TYPES.includes(c.t)); } catch (e) {}
})();
function mySave() { if (MY_SHARED) return; try { localStorage.setItem(MY_KEY, JSON.stringify(MY)); } catch (e) {} }
const myOpt = (v, l, cur) => `<option value="${hEsc(v)}"${v === cur ? ' selected' : ''}>${hEsc(l)}</option>`;
const mySel = (i, key, opts, cur, lab) => `<label class="field">${lab} <select data-my="${i}" data-k="${key}">${opts.map(([v, l]) => myOpt(v, l, cur)).join('')}</select></label>`;
const myPerSel = (i, c, t) => mySel(i, 'p', MY_PERS.map(p => [p, t.P[p]]), c.p || 'ytd', t.per);
const myFundSel = (i, key, c, t, lab) => `<label class="field">${lab} <select data-my="${i}" data-k="${key}">${[...myGroups(), ...myG3()].map(g => `<optgroup label="${hEsc(myGL(g))}">${g.funds.map(f => myOpt((g._p3 ? '3|' : '') + g.id + '|' + f.provider + '|' + f.name, f.name, (myFund(c[key]) || {}).k)).join('')}</optgroup>`).join('')}</select></label>`;
const myMgrSel = (i, c, t, all) => mySel(i, 'm', [...(all ? [['', t.all]] : []), ...myProv().map(m => [m, m])], all ? c.m || '' : myM(c), t.mgr);
const myM = c => myProv().includes(c.m) ? c.m : myProv()[0];
function mySpark(pts, col, W = 220, H = 40) {
  if (!pts || pts.length < 3) return '';
  const x0 = pts[0][0], x1 = pts[pts.length - 1][0], ys = pts.map(p => p[1]), lo = Math.min(...ys), hi = Math.max(...ys);
  const P = pts.map(([d, v], i) => `${i ? 'L' : 'M'}${((d - x0) / ((x1 - x0) || 1) * W).toFixed(1)} ${(H - 3 - (v - lo) / ((hi - lo) || 1) * (H - 6)).toFixed(1)}`).join('');
  return `<svg class="myspark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${P}" fill="none" stroke="${col}" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`;
}
function mySpark2(a, ca, b, cb, W = 220, H = 48) {   // dvi linijos bendrame mastelyje
  if (!a || !b || a.length < 3 || b.length < 3) return '';
  const all = [...a, ...b], x0 = Math.min(...all.map(p => p[0])), x1 = Math.max(...all.map(p => p[0])), lo = Math.min(...all.map(p => p[1])), hi = Math.max(...all.map(p => p[1]));
  const P = pts => pts.map(([d, v], i) => `${i ? 'L' : 'M'}${((d - x0) / ((x1 - x0) || 1) * W).toFixed(1)} ${(H - 3 - (v - lo) / ((hi - lo) || 1) * (H - 6)).toFixed(1)}`).join('');
  return `<svg class="myspark" style="height:${H}px" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${P(b)}" fill="none" stroke="${cb}" stroke-width="1.6" vector-effect="non-scaling-stroke"/><path d="${P(a)}" fill="none" stroke="${ca}" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`;
}
const myBars = rows => { const m = Math.max(...rows.map(r => Math.abs(r[2])), 0.01);
  return `<div class="mybars">${rows.map(([l, col, v, tx, hl]) => `<span class="${hl ? 'hl' : ''}">${hEsc(l)}</span><span class="t"><i style="background:${col};width:${Math.abs(v) / m * 100}%"></i></span><span class="n${hl ? ' hl' : ''}">${tx}</span>`).join('')}</div>`; };
const myWA = xs => { let s = 0, w = 0, n = 0, z = 0; xs.forEach(o => { const a = o.f.assets > 0 ? o.f.assets : 0; s += o.s.ret * a; w += a; z += o.s.ret; n++; }); return w > 0 ? s / w : n ? z / n : null; };   // kaip visur svetainėje: svoriai – paskutiniai grynieji aktyvai
const myDiv = rows => { const m = Math.max(...rows.map(r => Math.abs(r[2])), 0.01);
  return `<div class="mybars dv">${rows.map(([l, col, v, tx]) => { const w = Math.abs(v) / m * 50; return `<span>${hEsc(l)}</span><span class="t"><i style="background:${col};width:${w}%;left:${v >= 0 ? 50 : 50 - w}%"></i></span><span class="n ${v < 0 ? 'neg' : 'pos'}">${tx}</span>`; }).join('')}</div>`; };
const myPP = () => lang === 'lt' ? 'p. p.' : 'pp';
const myKd = (v, sfx = '') => v == null ? '–' : `<span class="kd ${v < 0 ? 'neg' : 'pos'}">${v >= 0 ? '+' : '−'}${num(Math.abs(v), 2)}${sfx}</span>`;

/* kiekvienas tipas: [antraštė, valdikliai, turinys] */
const MY_R = {
  fund(c, i, t) {
    const x = myFund(c.f); if (!x) return ['', '', t.noData];
    const r = myRets(x.g, c.p || 'ytd'), me = r.out.find(o => o.f === x.f), k = r.out.indexOf(me) + 1, med = r.out.length ? medianOf(r.out.map(o => o.s.ret)) : null;
    return [`${hEsc(x.f.name)}`, myFundSel(i, 'f', c, t, t.fund) + myPerSel(i, c, t),
      me ? `<b class="myv">${pct(me.s.ret)}</b><span class="mys">${t.place(k, r.out.length)} · ${t.med} ${pct(med)}</span>${mySpark(me.s.points, myFCol(x))}<small class="mym">${iso(r.a)} → ${iso(r.end)}</small>` : t.noData];
  },
  mgr(c, i, t) {
    const m = myM(c), rows = [];
    DATA.groups.forEach(g => { const r = myRets(g, c.p || 'ytd'); r.out.forEach((o, j) => { if (myPName(o.f.provider) === m) rows.push([CTRY ? o.f.name : groupLabel(g), o.s.ret, j + 1, r.out.length, groupLabel(g)]); }); });
    return [`${hEsc(m)} · ${t.P[c.p || 'ytd']}`, myMgrSel(i, c, t) + myPerSel(i, c, t),
      rows.length ? `<table class="myt"><tbody>${rows.map(([g, v, k, n, gl]) => `<tr><td class="l" title="${hEsc(gl)}">${hEsc(g)}</td><td>${pct(v)}</td><td class="rk${k === 1 ? ' top' : ''}">${k} / ${n}</td></tr>`).join('')}</tbody></table>` : t.noData];
  },
  grp(c, i, t) {
    const g = DATA.groups.find(x => x.id === c.g) || LC[0] || DATA.groups[0], r = myRets(g, c.p || 'ytd');
    return [`${hEsc(groupLabel(g))} · ${t.P[c.p || 'ytd']}`, mySel(i, 'g', DATA.groups.map(x => [x.id, groupLabel(x)]), g.id, t.grp) + myPerSel(i, c, t),
      r.out.length ? myBars(r.out.map((o, j) => [`${j ? j + 1 : '♛'} ${CTRY ? o.f.name : myPName(o.f.provider)}`, myPCol(o.f.provider), o.s.ret, pct(o.s.ret), !j])) + `<small class="mym">${iso(r.a)} → ${iso(r.end)}</small>` : t.noData];
  },
  cmp(c, i, t) {
    const a = myFund(c.f), b = myFund(c.f2) || a; if (!a) return ['', '', t.noData];
    const ra = myRets(a.g, c.p || '1y').out.find(o => o.f === a.f), rb = myRets(b.g, c.p || '1y').out.find(o => o.f === b.f);
    const ln = (o, col) => o ? `<div class="mycl"><i style="background:${col}"></i><span>${hEsc(o.f.name)}</span><b>${pct(o.s.ret)}</b></div>` : '';
    return [`${t.T.cmp[0]} · ${t.P[c.p || '1y']}`, myFundSel(i, 'f', c, t, t.fund) + myFundSel(i, 'f2', c, t, t.fund2) + myPerSel(i, { p: c.p || '1y' }, t),
      ra && rb ? `${ln(ra, myFCol(a))}${ln(rb, myFCol(a) === myFCol(b) ? 'var(--text-3)' : myFCol(b))}<span class="mys">${t.diff}: ${myKd(ra.s.ret - rb.s.ret, ' ' + (lang === 'lt' ? 'p. p.' : 'pp'))}</span>${mySpark2(ra.s.points, myFCol(a), rb.s.points, myFCol(a) === myFCol(b) ? 'var(--text-3)' : myFCol(b))}` : t.noData];
  },
  peer(c, i, t) {
    const p = c.p || 'ytd', all = c.g === 'all', fx = v => `${v >= 0 ? '+' : '−'}${num(Math.abs(v), 2)} ${myPP()}`;
    const g1 = DATA.groups.find(x => x.id === c.g) || LC[0] || DATA.groups[0];
    const ctl = mySel(i, 'g', [['all', t.allG], ...DATA.groups.map(x => [x.id, groupLabel(x)])], all ? 'all' : g1.id, t.grp) + myPerSel(i, c, t);
    let rows, wa;
    if (all) { const xs = LC.flatMap(g => myRets(g, p).out); wa = myWA(xs);
      rows = myProv().map(m => { const ys = xs.filter(o => myPName(o.f.provider) === m); return ys.length ? [m, myMCol(m), myWA(ys) - wa] : null; }).filter(Boolean).sort((a, b) => b[2] - a[2]); }
    else { const r = myRets(g1, p); wa = myWA(r.out); rows = r.out.map(o => [CTRY ? o.f.name : myPName(o.f.provider), myPCol(o.f.provider), o.s.ret - wa]); }
    if (wa == null || !rows.length) return [t.T.peer[0], ctl, t.noData];
    return [`${t.T.peer[0]} · ${all ? t.allG : hEsc(groupLabel(g1))}`, ctl,
      `<span class="mys">${t.wAvg}: <b>${pct(wa)}</b> · ${t.P[p]}</span>${myDiv(rows.map(r => [r[0], r[1], r[2], fx(r[2])]))}`];
  },
  brag(c, i, t) {
    const m = myM(c), out = [], P = ['5y', '3y', '1y', 'ytd'], pw = t.pw || MYS.en.pw; let nA = 0, nT = 0;
    DATA.groups.forEach(g => P.forEach((p, pi) => { const r = myRets(g, p), wa = myWA(r.out), gl = groupLabel(g);
      r.out.forEach((o, j) => { if (myPName(o.f.provider) !== m) return; const fn = CTRY ? o.f.name : gl;
        if (p === '1y') { nT++; if (wa != null && o.s.ret > wa) nA++; }
        if (j === 0 && r.out.length > 1) out.push([3, pi, `<b>${hEsc(fn)}</b>: ${t.b1(gl, pw[p])} – ${pct(o.s.ret)}`]);
        else if (wa != null && o.s.ret > wa) out.push([1, pi, `<b>${hEsc(fn)}</b>: ${t.bW(gl, pw[p], `+${num(o.s.ret - wa, 2)} ${myPP()}`)}`]); });
      if (p === '1y' || p === '3y') { const dd = r.out.map(o => { let pk = -1e9, mx = 0; o.s.points.forEach(([, v]) => { const l = 1 + v / 100; if (l > pk) pk = l; mx = Math.min(mx, (l / pk - 1) * 100); }); return [o, mx]; }).sort((a, b) => b[1] - a[1]);
        if (dd.length > 1 && myPName(dd[0][0].f.provider) === m) out.push([2, pi, `<b>${hEsc(CTRY ? dd[0][0].f.name : gl)}</b>: ${t.bDD(gl, pw[p])} – ${pctPlain(dd[0][1])}`]); } }));
    out.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
    const cnt = nT ? `<span class="mys">${t.bCnt(nA, nT, pw['1y'])}</span>` : '';
    return [`${t.T.brag[0]}: ${hEsc(m)}`, myMgrSel(i, c, t), out.length ? `${cnt}<ul class="mybr">${out.slice(0, 7).map(x => `<li>${x[2]}</li>`).join('')}</ul>${out.length > 7 ? `<small class="mym">+${out.length - 7}</small>` : ''}` : `${cnt}<p class="note">${t.bNone}</p>`];
  },
  dd(c, i, t) {
    const x = myFund(c.f); if (!x) return ['', '', t.noData];
    const me = myRets(x.g, c.p || '1y').out.find(o => o.f === x.f); if (!me) return [hEsc(x.f.name), myFundSel(i, 'f', c, t, t.fund) + myPerSel(i, { p: c.p || '1y' }, t), t.noData];
    let pk = -Infinity, pkD = null, mx = 0, mxD = null; const lv = me.s.points.map(([d, v]) => [d, 1 + v / 100]);
    lv.forEach(([d, v]) => { if (v > pk) { pk = v; pkD = d; } const dd = (v / pk - 1) * 100; if (dd < mx) { mx = dd; mxD = d; } });
    const now = (lv[lv.length - 1][1] / pk - 1) * 100;
    return [`${hEsc(x.f.name)}`, myFundSel(i, 'f', c, t, t.fund) + myPerSel(i, { p: c.p || '1y' }, t),
      `<b class="myv">${pctPlain(mx)}</b><span class="mys">${t.ddMax}${mxD ? ` · ${iso(mxD)}` : ''} · ${t.ddNow} ${pctPlain(now)}</span>${mySpark(me.s.points, myFCol(x))}`];
  },
  share(c, i, t) {
    if (typeof MKT === 'undefined' || !MKT.II) return [t.T.share[0], '', t.noData];
    const pl = 'II', ds = MKT[pl].dates, di = ds.length - 1, dy = dIdx(pl, qBack(ds[di], 12)), m = myM(c), nm = m, k = c.k === 'part' ? 'part' : 'nav';
    const sh = j => { const x = j >= 0 && byMgr(pl, j)[nm], tt = totals(pl, j); return x && tt[k] ? x[k] / tt[k] * 100 : null; };
    const s1 = sh(di), s0 = sh(dy), pts = []; for (let j = Math.max(0, di - 11); j <= di; j++) { const v = sh(j); if (v != null) pts.push([dayOf(ds[j]), v]); }
    return [`${hEsc(nm)} · ${k === 'part' ? t.shPart : t.shNav}`, myMgrSel(i, c, t) + mySel(i, 'k', [['nav', t.shNav], ['part', t.shPart]], k, t.metric),
      s1 == null ? t.noData : `<b class="myv">${pctPlain(s1)}</b><span class="mym">${ds[di]}</span><span class="mys">${myKd(s0 == null ? null : s1 - s0, ' ' + (lang === 'lt' ? 'p. p.' : 'pp'))} ${t.shY}</span>${mySpark(pts, myMCol(m))}<small class="mym">${ds[Math.max(0, di - 11)]} → ${ds[di]}</small>`];
  },
  reform(c, i, t) {
    if (typeof AUM === 'undefined') { myNeedAum(); return [t.T.reform[0], myMgrSel(i, c, t, true), t.load]; }
    const ev = AUM.payouts.filter(e => !c.m || myPName(e.p) === c.m); if (!ev.length) return [t.T.reform[0], myMgrSel(i, c, t, true), t.noData];
    const qs = [...new Set(ev.map(e => e.q))].sort(), tot = ev.reduce((s, e) => s - e.flow, 0);
    const rows = qs.map(q => { const es = ev.filter(e => e.q === q), f = es.reduce((s, e) => s - e.flow, 0), b = es.reduce((s, e) => s + e.base, 0); return [`${q.replace('-', ' ')} ${t.q}`, 'var(--accent)', f, `${num(f, 0)} ${T().mn || 'mln. €'} · ${num(f / b * 100, 1)} %`]; });
    return [`${t.T.reform[0]} · ${c.m ? hEsc(c.m) : t.all}`, myMgrSel(i, c, t, true),
      `<b class="myv">${num(tot, 0)} ${T().mn || 'mln. €'}</b><span class="mys">${t.paid}${ev.some(e => e.est) ? ' (≈)' : ''}</span>${myBars(rows)}`];
  },
  news(c, i, t) {
    if (typeof NEWS === 'undefined') return [t.T.news[0], '', t.noData];
    const nm = myM(c), re = new RegExp(nm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const xs = NEWS.filter(r => r[1] === MY_C && (re.test(r[3] + ' ' + r[4]) || (r[7] || '').toLowerCase().split(';').some(a => a.includes(nm.toLowerCase())))).slice(0, 5);
    return [`${t.T.news[0]}: ${hEsc(nm)}`, myMgrSel(i, c, t), xs.length && typeof nwRow === 'function' ? `<div class="nwrows">${xs.map(r => nwRow(r)).join('')}</div>` : t.noNews];
  },
};
let MY_AUM = 0;
function myNeedAum() { if (MY_AUM) return; MY_AUM = 1; const s = document.createElement('script'); s.src = 'data_aum.js'; s.onload = () => myRender(); document.head.append(s); }
function myRender() {
  const el = document.getElementById('myC'); if (!el) return;
  const t = myT(); if (!MY) MY = myDefaults();
  if (MY.some(c => ['fund', 'cmp', 'dd'].includes(c.t))) myNeed3();
  const ico = (b, l, a) => `<button type="button" class="btn ico" data-mya="${a}" title="${l}" aria-label="${l}">${b}</button>`;
  el.innerHTML = `<div class="myhd"><h2>${t.h}</h2><span style="flex:1"></span><button type="button" class="btn" data-mya="lib">${t.add}</button><button type="button" class="btn" data-mya="share">${t.share}</button><button type="button" class="btn" data-mya="reset">${t.reset}</button></div>`
    + (t.lead ? `<p class="meta">${t.lead}</p>` : '')
    + (MY_SHARED ? `<p class="mysh">${t.sharedV || ''} <button type="button" class="btn" data-mya="keep">${t.keep || 'OK'}</button> <button type="button" class="btn" data-mya="drop">${t.drop || '×'}</button></p>` : '')
    + `<div class="mylib" id="myLib" hidden><b>${t.lib}</b>${MY_TYPES.map(k => `<button type="button" class="mylit" data-myadd="${k}"><b>${(t.T || MYS.en.T)[k][0]}</b><span>${(t.T || MYS.en.T)[k][1]}</span></button>`).join('')}</div>`
    + `<div class="mygrid">${MY.length ? MY.map((c, i) => { let r; try { r = MY_R[c.t](c, i, { ...MYS.en, ...t, T: { ...MYS.en.T, ...(t.T || {}) } }); } catch (e) { console.error(e); r = ['', '', t.noData || '–']; }
      return `<article class="myc" data-i="${i}"><div class="mych"><span class="myk">${(t.T || MYS.en.T)[c.t][0]}</span><span style="flex:1"></span>${ico('↑', t.up, 'up')}${ico('↓', t.down, 'down')}${ico('✕', t.rm, 'rm')}</div>`
        + `<h3>${r[0]}</h3><div class="myctl">${r[1]}</div><div class="mybd">${r[2]}</div></article>`; }).join('') : `<p class="note">${t.empty || ''}</p>`}</div>`;
}
document.addEventListener('click', e => {
  const a = e.target.closest('#myC [data-mya], #myC [data-myadd]'); if (!a) return;
  const t = myT(), card = a.closest('.myc'), i = card ? +card.dataset.i : -1, act = a.dataset.mya;
  if (a.dataset.myadd) { const k = a.dataset.myadd, d = myDefaults(), base = d.find(x => x.t === k) || { t: k, f: d[0].f, f2: (d.find(x => x.t === 'cmp') || {}).f2 || d[0].f, m: (d.find(x => x.m) || {}).m || myProv()[0], p: k === 'peer' ? '1y' : 'ytd', ...(k === 'peer' ? { g: 'all' } : {}) }; MY.unshift({ ...base }); mySave(); myRender(); return; }
  if (act === 'lib') { const l = document.getElementById('myLib'); l.hidden = !l.hidden; return; }
  if (act === 'share') { const u = location.origin + location.pathname + '?my=' + b64e(MY);
    const done = () => { a.textContent = t.shared; setTimeout(() => { a.textContent = t.share; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(u).then(done, () => prompt(t.share, u)); else prompt(t.share, u); return; }
  if (act === 'reset') { MY = myDefaults(); mySave(); myRender(); return; }
  if (act === 'keep' || act === 'drop') { MY_SHARED = false; history.replaceState(null, '', location.pathname + location.hash);
    if (act === 'keep') mySave(); else { MY = null; try { const x = JSON.parse(localStorage.getItem(MY_KEY) || 'null'); if (Array.isArray(x)) MY = x; } catch (er) {} }
    myRender(); return; }
  if (i < 0) return;
  if (act === 'rm') MY.splice(i, 1);
  else if (act === 'up' && i > 0) [MY[i - 1], MY[i]] = [MY[i], MY[i - 1]];
  else if (act === 'down' && i < MY.length - 1) [MY[i + 1], MY[i]] = [MY[i], MY[i + 1]];
  mySave(); myRender();
});
document.addEventListener('change', e => { const s = e.target.closest('#myC select[data-my]'); if (!s) return; MY[+s.dataset.my][s.dataset.k] = s.value; mySave(); myRender(); });
