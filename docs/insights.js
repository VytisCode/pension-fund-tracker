/* „Kelias į pensiją“ → Rinkos įžvalgos: visa II pakopos rinka, valdytojai ir fondai pasirinktu laikotarpiu.
   Duomenys: data_aum.js (fondų grynieji aktyvai, m€; kraunama tik šiai skilčiai) ir data.js (vieneto vertės).
   Investicijų uždarbis tarp dviejų turto taškų: r = vieneto vertės pokytis; kai taškai kasdieniai (≤ 7 d.),
   uždarbis = turtas(pradžia) × r; kai ketvirtiniai (Swedbank ir Luminor iki 2026 m. – LB ketvirčio duomenys),
   uždarbis = r × (turtas(pradžia) + turtas(pabaiga) ÷ (1 + r)) ÷ 2 (srautas laikomas tolygiu). Srautas = turto pokytis − uždarbis.
   Reformos išmokos – iš „Turto“ puslapio skaičiavimo (AUM.payouts). */
addStrings({
  in: {
    title: 'Market insights', lead: 'The whole II pillar market, each manager and each fund over the chosen period: how much participants earned from investments, the asset-weighted average return, money flows and payouts under the 2026 reform.',
    loading: 'Loading market data…', per: 'Period', ytd: 'This year', m12: 'Last 12 months', all: 'Since 2019', q: 'This quarter', to: 'Up to', latest: d => `Latest data (${d})`, qEnd: (y, q) => `End of Q${q} ${y}`, custom: 'Other date…',
    k: ['II pillar assets', 'Investment earnings', 'Average return (asset-weighted)', 'Net flows', 'Reform payouts'],
    ks: (a, b) => `${a} → ${b}`, mln: 'm €', bn: 'bn €',
    mTitle: 'By manager', fTitle: 'By fund', pTitle: 'Reform payouts by quarter', grp: 'Group', allG: 'All groups', turto: 'Asset preservation',
    hM: ['Manager', 'Assets at end, m €', 'Market share', 'Investment earnings, m €', 'Average return', 'Net flows, m €', 'of which reform payouts, m €', 'Payouts, % of assets at start'],
    hF: ['Fund', 'Manager', 'Group', 'Assets at end, m €', 'Investment earnings, m €', 'Return', 'Net flows, m €', 'Reform payouts, m €'],
    hP: ['Quarter', 'Manager', 'Payout date(s)', 'Paid out, m €', 'Assets before, m €', '% of assets'],
    total: 'Whole market',
    txt: x => [
      `From ${x.since} to ${x.end} II pillar participants earned <b>${x.eAll}</b> from investments; over the last 12 months – <b>${x.e12}</b>, year to date – <b>${x.eYtd}</b>.`,
      `In the chosen period (${x.per}) the asset-weighted average return was <b>${x.avg}</b>. The best manager was ${x.bestM} (${x.bestMr}), the weakest – ${x.worstM} (${x.worstMr}).`,
      `The most was earned by ${x.topE} (${x.topEv}) – it manages ${x.topEs} of the market. The best fund was ${x.bestF} (${x.bestFr}), the weakest – ${x.worstF} (${x.worstFr}).`,
      x.pay ? `Under the 2026 reform ${x.pay} have been paid out up to this date (${x.payP} of the assets before the payouts); the largest share left ${x.payTop} (${x.payTopP}).` : ''],
    note: 'Swedbank and Luminor daily assets exist only from 2026; earlier their assets are Bank of Lithuania quarter-end figures, so their earnings and flows are estimates. Data starts in 2019 (life-cycle funds), so earnings before 2019 are not included.',
    info: {
      ins: 'Investment earnings between two asset observations = assets at the start × the change in unit value (daily data). For quarterly data (Swedbank and Luminor before 2026): earnings = return × (assets at start + assets at end ÷ (1 + return)) ÷ 2, i.e. contributions and payouts are assumed spread evenly. Net flows = change in assets − earnings (contributions minus payouts and fund switches). For periods that cut through a quarter, quarterly earnings are split by days.\nUp to: every period ends on the chosen date (latest data by default). Associations and the Bank of Lithuania usually publish figures at quarter end, so to compare with them pick the same quarter end.\nAverage return = returns of the funds weighted by their assets at the start of the period (funds that started later are weighted by their first assets).\nReform payouts = days when assets fell more than the unit value explains (see the Assets page).\nComparison with LIPFA: assets and the weighted return match (2026-09-30: 5.9 bn €; 9 months 10.13 % vs LIPFA 10.2 %; 12 months 13.87 % vs 13.9 %). LIPFA calculates euro earnings differently and does not publish its method: its half-year figure (~600 m €) is larger than its 9-month figure (542.3 m €) although Q3 returns were positive. It appears to subtract part of the earnings paid out under the reform. This page shows all profit earned in the period, whether or not the participant later withdrew the money.',
      pay: 'Payouts under the 2026 pension reform: on the payout days, flow = assets(t) − assets(t−1) × unit value(t) ÷ unit value(t−1). Share = paid out ÷ assets before the payout (the same method as the Assets page).',
    },
    xls: 'Excel', xSheets: ['Managers', 'Funds', 'Payouts', 'Monthly data'],
  },
}, {
  in: {
    title: 'Rinkos įžvalgos', lead: 'Visa II pakopos rinka, kiekvienas valdytojas ir fondas pasirinktu laikotarpiu: kiek dalyviai uždirbo iš investicijų, turtu svertinė vidutinė grąža, pinigų srautai ir išmokos pagal 2026 m. reformą.',
    loading: 'Kraunami rinkos duomenys…', per: 'Laikotarpis', ytd: 'Šie metai', m12: 'Pastarieji 12 mėn.', all: 'Nuo 2019 m.', q: 'Šis ketvirtis', to: 'Iki', latest: d => `Naujausi duomenys (${d})`, qEnd: (y, q) => `${y} m. ${q} ketv. pabaiga`, custom: 'Kita data…',
    k: ['II pakopos turtas', 'Investicijų uždarbis', 'Vidutinė grąža (svertinė pagal turtą)', 'Grynasis srautas', 'Reformos išmokos'],
    ks: (a, b) => `${a} → ${b}`, mln: 'mln. €', bn: 'mlrd. €',
    mTitle: 'Pagal valdytoją', fTitle: 'Pagal fondą', pTitle: 'Reformos išmokos pagal ketvirtį', grp: 'Grupė', allG: 'Visos grupės', turto: 'Turto išsaugojimo',
    hM: ['Valdytojas', 'Turtas pabaigoje, mln. €', 'Rinkos dalis', 'Investicijų uždarbis, mln. €', 'Vidutinė grąža', 'Grynasis srautas, mln. €', 'iš jo reformos išmokos, mln. €', 'Išmokos, % pradžios turto'],
    hF: ['Fondas', 'Valdytojas', 'Grupė', 'Turtas pabaigoje, mln. €', 'Investicijų uždarbis, mln. €', 'Grąža', 'Grynasis srautas, mln. €', 'Reformos išmokos, mln. €'],
    hP: ['Ketvirtis', 'Valdytojas', 'Išmokėjimo data (-os)', 'Išmokėta, mln. €', 'Turtas prieš, mln. €', '% turto'],
    total: 'Visa rinka',
    txt: x => [
      `Nuo ${x.since} iki ${x.end} II pakopos dalyviai iš investicijų uždirbo <b>${x.eAll}</b>, per pastaruosius 12 mėn. – <b>${x.e12}</b>, o nuo metų pradžios – <b>${x.eYtd}</b>.`,
      `Pasirinktu laikotarpiu (${x.per}) turtu svertinė vidutinė grąža – <b>${x.avg}</b>. Geriausiai sekėsi ${x.bestM} (${x.bestMr}), silpniausiai – ${x.worstM} (${x.worstMr}).`,
      `Daugiausia uždirbo ${x.topE} (${x.topEv}) – jis valdo ${x.topEs} rinkos. Geriausias fondas – ${x.bestF} (${x.bestFr}), silpniausias – ${x.worstF} (${x.worstFr}).`,
      x.pay ? `Pagal 2026 m. reformą iki šios datos išmokėta ${x.pay} (${x.payP} turto prieš išmokas); didžiausia dalis išėjo iš ${x.payTop} (${x.payTopP}).` : ''],
    note: 'Swedbank ir Luminor kasdienis turtas yra tik nuo 2026 m.; anksčiau – Lietuvos banko ketvirčio pabaigos duomenys, todėl jų uždarbis ir srautai – įverčiai. Duomenys nuo 2019 m. (gyvenimo ciklo fondai), todėl ankstesnio uždarbio čia nėra.',
    info: {
      ins: 'Investicijų uždarbis tarp dviejų turto taškų = turtas pradžioje × vieneto vertės pokytis (kasdieniai duomenys). Ketvirtiniams duomenims (Swedbank ir Luminor iki 2026 m.): uždarbis = grąža × (turtas pradžioje + turtas pabaigoje ÷ (1 + grąža)) ÷ 2, t. y. laikoma, kad įmokos ir išmokos pasiskirsto tolygiai. Grynasis srautas = turto pokytis − uždarbis (įmokos minus išmokos ir perėjimai). Jei laikotarpis kerta ketvirtį, ketvirčio uždarbis dalijamas pagal dienas.\n„Iki“: visi laikotarpiai baigiasi pasirinkta data (numatyta – naujausi duomenys). Asociacijos ir Lietuvos bankas skaičius dažniausiai skelbia ketvirčio pabaigai, todėl norint palyginti su jais, pasirinkite tą pačią ketvirčio pabaigą.\nVidutinė grąža = fondų grąžos, svertinės pagal jų turtą laikotarpio pradžioje (vėliau pradėję fondai – pagal pirmą turtą).\nReformos išmokos = dienos, kai turtas sumažėjo labiau, nei paaiškina vieneto vertės pokytis (žr. puslapį „Turtas“).\nPalyginimas su LIPFA: turtas ir svertinė grąža sutampa (2026-09-30: 5,9 mlrd. €; 9 mėn. 10,13 % ir LIPFA 10,2 %; 12 mėn. 13,87 % ir 13,9 %). Uždarbio eurais LIPFA skaičiuoja kitaip ir metodikos neskelbia: jų pusmečio suma (~600 mln. €) didesnė už 9 mėnesių (542,3 mln. €), nors III ketvirčio grąža buvo teigiama. Panašu, kad iš uždarbio jie atima dalį, išmokėtą pagal reformą. Čia rodomas visas per laikotarpį uždirbtas pelnas, nepriklausomai nuo to, ar dalyvis vėliau pinigus atsiėmė.',
      pay: 'Išmokos pagal 2026 m. pensijų reformą: išmokėjimo dienomis srautas = turtas(t) − turtas(t−1) × vieneto vertė(t) ÷ vieneto vertė(t−1). Dalis = išmokėta ÷ turtas prieš išmokėjimą (tas pats metodas kaip puslapyje „Turtas“).',
    },
    xls: 'Excel', xSheets: ['Valdytojai', 'Fondai', 'Išmokos', 'Mėnesių duomenys'],
  },
});

const IN = { per: 'ytd', grp: '', to: '', loaded: false, F: null };      // to: '' = naujausi duomenys, kitaip ISO data
try { const s = JSON.parse(localStorage.getItem('insState') || '{}'); if (s.per) IN.per = s.per; if (typeof s.grp === 'string') IN.grp = s.grp; if (typeof s.to === 'string') IN.to = s.to; } catch (e) {}
const inSave = () => { try { localStorage.setItem('insState', JSON.stringify({ per: IN.per, grp: IN.grp, to: IN.to })); } catch (e) {} };
const mE = (x, p = 1) => (x < 0 ? '−' : '') + num(Math.abs(x), p);
const mLabel = (x, t) => Math.abs(x) >= 1000 ? `${num(x / 1000, 2)} ${t.in.bn}` : `${num(x, 1)} ${t.in.mln}`;
const pcIn = (x, p = 2) => (x < 0 ? '−' : x > 0 ? '+' : '') + num(Math.abs(x) * 100, 2) + pctSfx();

/* fondų intervalai: [pradžia, pabaiga, uždarbis, srautas, išmokos] (m€) */
const inKey = n => n.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();     // pavadinimuose pasitaiko skirtingų brūkšnių
function inPrepare() {
  const uvF = {}; DATA.groups.forEach(g => g.funds.forEach(f => { uvF[f.name] = f; }));
  const payDay = {};           // fondas -> {diena: išmoka}
  AUM.payouts.forEach(p => Object.entries(p.rows || {}).forEach(([fn, rows]) => {     // eilutė = [d0, u0, a0, d1, u1, a1] (diena prieš ir išmokėjimo diena)
    rows.forEach(([d0, u0, a0, d1, u1, a1]) => {
      if (a0 && a1 && u0 && u1) ((payDay[inKey(fn)] = payDay[inKey(fn)] || {})[dayOf(d1)] = (a1 - a0 * u1 / u0) / 1e6);
    });
  }));
  return AUM.funds.filter(f => f.pl === 'II' && uvF[f.n]).map(f => {
    const u = uvF[f.n], uv = d => { const i = lastOnOrBefore(u, d); return i >= 0 ? u.v[i] : null; }, iv = [];
    for (let i = 1; i < f.d.length; i++) {
      const d0 = f.d[i - 1], d1 = f.d[i], a0 = f.a[i - 1], a1 = f.a[i], u0 = uv(d0), u1 = uv(d1);
      if (u0 == null || u1 == null) continue;
      const r = u1 / u0 - 1, e = d1 - d0 <= 7 ? a0 * r : r * (a0 + a1 / (1 + r)) / 2;
      iv.push([d0, d1, e, a1 - a0 - e, (payDay[inKey(f.n)] || {})[d1] || 0]);
    }
    return { n: f.n, p: f.p, g: f.g, d: f.d, a: f.a, u, iv };
  });
}
function inLoad() {
  if (IN.loaded) return Promise.resolve();
  return new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = 'data_aum.js?v=' + encodeURIComponent(JDATA.generated);
    s.onload = () => { IN.F = inPrepare(); IN.loaded = true; ok(); }; s.onerror = no; document.head.appendChild(s);
  });
}
const inLatest = () => Math.min(LAST, Math.max(...IN.F.map(f => f.d[f.d.length - 1])));
const inEnd = () => { const L = inLatest(), d = /^\d{4}-\d{2}-\d{2}$/.test(IN.to) ? dayOf(IN.to) : L; return Math.max(dayOf('2019-01-31'), Math.min(L, d)); };
/* ketvirčių pabaigos nuo naujausios atgal iki 2019 m. I ketv. */
function inQEnds() { const L = inLatest(), out = []; for (let y = yearOf(L); y >= 2019; y--) for (let q = 4; q >= 1; q--) { const d = Math.round(Date.UTC(y, 3 * q, 0) / DAY); if (d <= L) out.push([iso(d), y, q]); } return out; }
function inRange(per, end) {
  const y = yearOf(end);
  if (per === 'ytd') return [dayOf(`${y - 1}-12-31`), end];
  if (per === 'm12') return [shiftMonths(end, 12), end];
  if (per === 'all') return [dayOf('2018-12-31'), end];
  if (per === 'q') { const [Y, M] = iso(end).split('-').map(Number), q0 = Math.round(Date.UTC(Y, 3 * Math.ceil(M / 3) - 3, 0) / DAY); return [q0 === end ? Math.round(Date.UTC(Y, M - 3, 0) / DAY) : q0, end]; }
  let m;
  if ((m = /^y(\d{4})$/.exec(per))) return [dayOf(`${+m[1] - 1}-12-31`), Math.min(end, dayOf(`${m[1]}-12-31`))];
  return [dayOf(`${y - 1}-12-31`), end];
}
/* fondo sumos intervale (a, b]: ketvirtiniai intervalai, kertantys ribą, dalijami pagal dienas */
function inFund(f, a, b) {
  let e = 0, fl = 0, pay = 0;
  f.iv.forEach(([d0, d1, ei, fi, pi]) => {
    if (d1 <= a || d0 >= b) return;
    const k = (Math.min(d1, b) - Math.max(d0, a)) / (d1 - d0);
    e += ei * k; fl += fi * k; if (d1 > a && d1 <= b) pay += pi;
  });
  const aAt = d => { let v = null; for (let i = 0; i < f.d.length && f.d[i] <= d; i++) v = f.a[i]; return v; };
  const ia = lastOnOrBefore(f.u, a), ib = lastOnOrBefore(f.u, b);
  const startOk = f.u.d[0] <= a + 7, r = ib > 0 ? f.u.v[ib] / f.u.v[Math.max(0, ia)] - 1 : null;
  const a0 = aAt(a) ?? (f.d[0] <= b ? f.a[0] : null);
  return { f, e, fl, pay, aEnd: aAt(b), a0, r, partial: !startOk };
}
function inAgg(rows) {
  const w = rows.filter(x => x.r != null && x.a0), sw = w.reduce((s, x) => s + x.a0, 0);
  return { e: rows.reduce((s, x) => s + x.e, 0), fl: rows.reduce((s, x) => s + x.fl, 0), pay: rows.reduce((s, x) => s + x.pay, 0),
    aEnd: rows.reduce((s, x) => s + (x.aEnd || 0), 0), a0: rows.reduce((s, x) => s + (x.a0 || 0), 0), r: sw ? w.reduce((s, x) => s + x.a0 * x.r, 0) / sw : null };
}
function inPerLabel(per) { const t = T().in; if (per === 'ytd') return t.ytd; if (per === 'm12') return t.m12; if (per === 'all') return t.all; if (per === 'q') return t.q; return per.slice(1); }

function renderInsights() {
  const t = T(), X = t.in, box = document.getElementById('insBody');
  if (!box) return;
  document.getElementById('insTitle').innerHTML = `${X.title}${ik('ins')}<button type="button" class="btn xls ins-xls" title="Excel">⤓ ${X.xls}</button>`;
  document.getElementById('insLead').textContent = X.lead;
  if (!IN.loaded) { box.innerHTML = `<p class="note">${X.loading}</p>`; inLoad().then(renderInsights).catch(() => {}); return; }
  const end = inEnd(), ys = []; for (let y = yearOf(end) - 1; y >= 2019; y--) ys.push(['y' + y, String(y)]);
  if (/^y\d{4}$/.test(IN.per) && !ys.some(([v]) => v === IN.per)) IN.per = 'ytd';     // pasirinkti metai vėlesni už „Iki“ datą
  const [a, b] = inRange(IN.per, end);
  const pers = [['ytd', X.ytd], ['q', X.q], ['m12', X.m12], ...ys, ['all', X.all]];
  const qe = inQEnds(), custom = IN.to && !qe.some(([d]) => d === IN.to);
  const toSel = `<select data-ins="to" style="font:inherit;font-size:13px;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)"><option value="">${X.latest(dots(inLatest()))}</option>${qe.map(([d, y, q]) => `<option value="${d}"${d === IN.to ? ' selected' : ''}>${X.qEnd(y, q)}</option>`).join('')}<option value="custom"${custom ? ' selected' : ''}>${X.custom}</option></select>`
    + (custom || IN.toCustom ? ` <input type="date" data-ins="toD" min="2019-01-31" max="${iso(inLatest())}" value="${iso(end)}" style="font:inherit;font-size:13px;padding:3px 6px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)">` : '');
  const rows = IN.F.map(f => inFund(f, a, b)), tot = inAgg(rows);
  const byM = MGRS.map(m => ({ m, ...inAgg(rows.filter(x => x.f.p === m)) })).filter(x => x.aEnd > 0).sort((p, q) => q.aEnd - p.aEnd);
  // tekstas: visada ir nuo 2019, 12 mėn., šie metai
  const sumE = (p0, p1) => IN.F.reduce((s, f) => s + inFund(f, p0, p1).e, 0);
  const ranked = byM.filter(x => x.r != null).sort((p, q) => q.r - p.r), topE = byM.slice().sort((p, q) => q.e - p.e)[0];
  const fr = rows.filter(x => x.r != null && !x.partial && x.f.g !== 'turto').sort((p, q) => q.r - p.r);
  const pays = AUM.payouts.filter(p => !p.est && (p.dates || []).every(d => dayOf(d) <= end)), payT = pays.reduce((s, p) => s + p.flow, 0), payB = (() => { const fq = {}; pays.forEach(p => { if (!fq[p.p] || p.q < fq[p.p].q) fq[p.p] = p; }); return Object.values(fq).reduce((s, p) => s + p.base, 0); })();
  const payM = MGRS.map(m => { const ps = pays.filter(p => p.p === m); const first = ps.slice().sort((x, y) => x.q < y.q ? -1 : 1)[0]; return { m, flow: ps.reduce((s, p) => s + p.flow, 0), base: first ? first.base : 0 }; }).filter(x => x.base).sort((p, q) => (p.flow / p.base) - (q.flow / q.base));
  const x = { since: dots(dayOf('2019-01-02')), end: dots(end), eAll: mLabel(sumE(dayOf('2018-12-31'), end), t), e12: mLabel(sumE(shiftMonths(end, 12), end), t), eYtd: mLabel(sumE(dayOf(`${yearOf(end) - 1}-12-31`), end), t),
    per: inPerLabel(IN.per), avg: tot.r != null ? pcIn(tot.r) : '–', bestM: MLABEL[ranked[0]?.m] || '–', bestMr: ranked[0] ? pcIn(ranked[0].r) : '', worstM: MLABEL[ranked[ranked.length - 1]?.m] || '–', worstMr: ranked.length ? pcIn(ranked[ranked.length - 1].r) : '',
    topE: MLABEL[topE?.m], topEv: topE ? mLabel(topE.e, t) : '', topEs: topE && tot.aEnd ? pc(topE.aEnd / tot.aEnd, 1) : '',
    bestF: fr[0] ? shortFund(fr[0].f.n) : '–', bestFr: fr[0] ? pcIn(fr[0].r) : '', worstF: fr.length ? shortFund(fr[fr.length - 1].f.n) : '–', worstFr: fr.length ? pcIn(fr[fr.length - 1].r) : '',
    pay: payT ? mLabel(-payT, t) : '', payP: payB ? pc(-payT / payB, 1) : '', payTop: MLABEL[payM[0]?.m], payTopP: payM[0] ? pc(-payM[0].flow / payM[0].base, 1) : '' };
  const kp = (l, v, s, cls = '') => `<div class="kpi ${cls}"><div class="l">${l}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
  const grps = [...new Set(IN.F.map(f => f.g))].sort((p, q) => p === 'turto' ? 1 : q === 'turto' ? -1 : p < q ? -1 : 1);
  const fRows = rows.filter(r => !IN.grp || r.f.g === IN.grp).filter(r => r.aEnd || r.e).sort((p, q) => q.e - p.e);
  const payQ = pays.slice().sort((p, q) => p.q < q.q ? -1 : p.q > q.q ? 1 : p.flow - q.flow);
  const th = (h, i) => `<th class="${i === 0 ? 'l' : ''}">${h}</th>`;
  const cls = v => v >= 0 ? 'up' : 'down';
  box.innerHTML = `<div class="bar" style="margin-bottom:12px">${field(X.per, `<div class="seg" role="group" data-ins="per">${pers.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === IN.per}">${l}</button>`).join('')}</div>`)}${field(X.to, toSel)}</div>`
    + `<div class="kpis">${kp(X.k[0], mLabel(tot.aEnd, t), dots(b), 'hl')}${kp(X.k[1], `<span class="${cls(tot.e)}">${mLabel(tot.e, t)}</span>`, X.ks(dots(a), dots(b)))}${kp(X.k[2], tot.r != null ? `<span class="${cls(tot.r)}">${pcIn(tot.r)}</span>` : '–', inPerLabel(IN.per))}${kp(X.k[3], mLabel(tot.fl, t), '')}${kp(X.k[4], mLabel(tot.pay, t), '')}</div>`
    + `<section class="card" style="margin-top:14px"><div class="story">${X.txt(x).filter(Boolean).map(s => `<p>${s}</p>`).join('')}</div></section>`
    + `<h3 class="sub3">${X.mTitle}</h3><section class="card"><div class="scroll"><table class="jt" id="insM"><thead><tr>${X.hM.map(th).join('')}</tr></thead><tbody>`
    + byM.map(r => `<tr><td class="l">${MLABEL[r.m]}</td><td>${mE(r.aEnd)}</td><td>${pc(r.aEnd / tot.aEnd, 1)}</td><td class="${cls(r.e)}">${mE(r.e)}</td><td>${r.r != null ? pcIn(r.r) : '–'}</td><td>${mE(r.fl)}</td><td>${r.pay ? mE(r.pay) : '–'}</td><td>${r.pay && r.a0 ? pc(-r.pay / r.a0, 1) : '–'}</td></tr>`).join('')
    + `<tr class="cur"><td class="l">${X.total}</td><td>${mE(tot.aEnd)}</td><td>100 %</td><td class="${cls(tot.e)}">${mE(tot.e)}</td><td>${tot.r != null ? pcIn(tot.r) : '–'}</td><td>${mE(tot.fl)}</td><td>${mE(tot.pay)}</td><td>${tot.pay && tot.a0 ? pc(-tot.pay / tot.a0, 1) : '–'}</td></tr></tbody></table></div></section>`
    + `<h3 class="sub3">${X.fTitle} <select data-ins="grp" style="font:inherit;font-size:13px;margin-left:8px;padding:4px 6px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)"><option value="">${X.allG}</option>${grps.map(g => `<option value="${g}"${g === IN.grp ? ' selected' : ''}>${g === 'turto' ? X.turto : g.replace('-', '–')}</option>`).join('')}</select></h3>`
    + `<section class="card"><div class="scroll" style="max-height:520px"><table class="jt" id="insF"><thead><tr>${X.hF.map(th).join('')}</tr></thead><tbody>`
    + fRows.map(r => `<tr><td class="l">${shortFund(r.f.n)}</td><td class="l">${MLABEL[r.f.p]}</td><td class="l">${r.f.g === 'turto' ? X.turto : r.f.g.replace('-', '–')}</td><td>${r.aEnd != null ? mE(r.aEnd) : '–'}</td><td class="${cls(r.e)}">${mE(r.e, 2)}</td><td>${r.r != null ? pcIn(r.r) + (r.partial ? '*' : '') : '–'}</td><td>${mE(r.fl, 2)}</td><td>${r.pay ? mE(r.pay, 2) : '–'}</td></tr>`).join('') + '</tbody></table></div></section>'
    + `<h3 class="sub3">${X.pTitle}${ik('pay')}</h3><section class="card"><div class="scroll"><table class="jt" id="insP"><thead><tr>${X.hP.map(th).join('')}</tr></thead><tbody>`
    + payQ.map(p => `<tr><td class="l">${lang === 'lt' ? p.q.replace('-', ' K') : 'Q' + p.q.slice(5) + ' ' + p.q.slice(0, 4)}</td><td class="l">${MLABEL[p.p]}</td><td class="l">${(p.dates || []).map(d => dots(dayOf(d))).join(', ')}</td><td class="down">${mE(p.flow)}</td><td>${mE(p.base)}</td><td>${pc(-p.flow / p.base, 2)}</td></tr>`).join('') + '</tbody></table></div></section>'
    + `<p class="note">${X.note}</p>`;
  box.querySelectorAll('[data-ins="per"] button').forEach(btn => btn.addEventListener('click', () => { IN.per = btn.dataset.v; inSave(); renderInsights(); }));
  box.querySelector('[data-ins="to"]').addEventListener('change', e => { const v = e.target.value; if (v === 'custom') { IN.toCustom = true; IN.to = iso(end); } else { IN.toCustom = false; IN.to = v; } inSave(); renderInsights(); });
  const tD = box.querySelector('[data-ins="toD"]'); if (tD) tD.addEventListener('change', e => { if (e.target.value) { IN.to = e.target.value; inSave(); renderInsights(); } });
  box.querySelector('[data-ins="grp"]').addEventListener('change', e => { IN.grp = e.target.value; inSave(); renderInsights(); });
  IN.last = { a, b, rows, byM, tot, payQ };
}

/* Excel: mėnesių duomenys (vertės) + suvestinės su SUMIFS formulėmis */
async function insXlsx() {
  await loadXlsx();
  const t = T(), X = t.in, { a, b, byM, payQ } = IN.last, lt = lang === 'lt';
  const mon = [[lt ? 'Mėnuo' : 'Month', X.hF[1], X.hF[0], X.hF[2], lt ? 'Turtas mėnesio pabaigoje, mln. €' : 'Assets at month end, m €', lt ? 'Uždarbis, mln. €' : 'Earnings, m €', lt ? 'Srautas, mln. €' : 'Flows, m €', lt ? 'Reformos išmokos, mln. €' : 'Reform payouts, m €', lt ? 'Mėnesio pabaiga' : 'Month end']];
  const monthEndD = (y, m) => Math.round(Date.UTC(y, m + 1, 0) / DAY);
  IN.F.forEach(f => {
    for (let y = 2019; y <= yearOf(b); y++) for (let m = 0; m < 12; m++) {
      const p1 = Math.min(monthEndD(y, m), b), p0 = monthEndD(y, m - 1);
      if (p0 >= b || p1 <= f.d[0]) continue;
      (a > p0 && a < p1 ? [[p0, a], [a, p1]] : [[p0, p1]]).forEach(([q0, q1]) => {    // laikotarpio pradžia mėnesio viduryje – dvi eilutės
        const s = inFund(f, q0, q1);
        mon.push([`${y}-${String(m + 1).padStart(2, '0')}`, MLABEL[f.p], shortFund(f.n), f.g, s.aEnd ?? '', +s.e.toFixed(6), +s.fl.toFixed(6), +s.pay.toFixed(6), { t: 'n', v: q1 + 25569, z: 'yyyy-mm-dd' }]);
      });
    }
  });
  const MS = `'${X.xSheets[3]}'!`, n = mon.length, rng = c => `${MS}$${c}$2:$${c}$${n}`;
  const win = `${rng('I')},">"&$B$1,${rng('I')},"<="&$C$1`;
  const xd = d => ({ t: 'n', v: d + 25569, z: 'yyyy-mm-dd', date: true });      // Excel datos skaičius
  const head = [[`${X.title} · ${inPerLabel(IN.per)}`, xd(a), xd(b)], []];
  const ms = [...head, [X.hM[0], X.hM[3], X.hM[5], X.hM[6], X.hM[4]]];
  byM.forEach((r, i) => { const R = i + 4; ms.push([MLABEL[r.m], { f: `SUMIFS(${rng('F')},${rng('B')},A${R},${win})`, v: r.e }, { f: `SUMIFS(${rng('G')},${rng('B')},A${R},${win})`, v: r.fl }, { f: `SUMIFS(${rng('H')},${rng('B')},A${R},${win})`, v: r.pay }, r.r]); });
  const L = byM.length + 3;
  const T0 = IN.last.tot;
  ms.push([X.total, { f: `SUM(B4:B${L})`, v: T0.e }, { f: `SUM(C4:C${L})`, v: T0.fl }, { f: `SUM(D4:D${L})`, v: T0.pay }, T0.r]);
  ms.push([]); ms.push([X.info.ins]);
  const cellOf = c => c == null || c === '' ? null : c.date ? { t: 'n', v: c.v, z: c.z } : typeof c === 'object' ? { t: 'n', f: c.f, v: c.v, z: c.z || '#,##0.00' } : typeof c === 'number' ? { t: 'n', v: c, z: '#,##0.00' } : { t: 's', v: c };
  const sheet = aoa => XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(cellOf)));
  const fs = [[...head[0]], [], [X.hF[0], X.hF[1], X.hF[2], X.hF[4], X.hF[6], X.hF[7], X.hF[5], lt ? 'Turtas pradžioje (svoris), mln. €' : 'Assets at start (weight), m €']];
  const fRows = IN.last.rows.filter(r => r.aEnd || r.e), FN = fRows.length + 3, FS = `'${X.xSheets[1]}'!`;
  fRows.forEach((r, i) => { const R = i + 4; fs.push([shortFund(r.f.n), MLABEL[r.f.p], r.f.g, { f: `SUMIFS(${rng('F')},${rng('C')},A${R},${win})`, v: r.e }, { f: `SUMIFS(${rng('G')},${rng('C')},A${R},${win})`, v: r.fl }, { f: `SUMIFS(${rng('H')},${rng('C')},A${R},${win})`, v: r.pay }, r.r ?? '', r.r != null && r.a0 ? r.a0 : '']); });
  ms.forEach((row, i) => { if (i >= 3 && row[0] && i < 3 + byM.length) row[4] = { f: `SUMPRODUCT((${FS}$B$4:$B$${FN}=A${i + 1})*${FS}$H$4:$H$${FN}*${FS}$G$4:$G$${FN})/SUMIFS(${FS}$H$4:$H$${FN},${FS}$B$4:$B$${FN},A${i + 1})`, v: row[4], z: '0.00%' }; });
  ms[3 + byM.length][4] = { f: `SUMPRODUCT(${FS}$H$4:$H$${FN},${FS}$G$4:$G$${FN})/SUM(${FS}$H$4:$H$${FN})`, v: IN.last.tot.r, z: '0.00%' };
  const ps = [X.hP, ...payQ.map(p => [p.q, MLABEL[p.p], (p.dates || []).join(', '), p.flow, p.base])];
  ps.forEach((r, i) => { if (i) r.push({ f: `-D${i + 1}/E${i + 1}`, v: -r[3] / r[4] }); });
  ps.push([]); ps.push([X.info.pay]);
  const wb = XLSX.utils.book_new();
  [[ms, 0], [fs, 1], [ps, 2]].forEach(([aoa, k]) => { const ws = sheet(aoa); ws['!cols'] = [{ wch: 30 }, ...Array(8).fill({ wch: 16 })]; XLSX.utils.book_append_sheet(wb, ws, X.xSheets[k]); });
  const wm = XLSX.utils.aoa_to_sheet(mon); wm['!cols'] = [{ wch: 9 }, { wch: 10 }, { wch: 30 }, { wch: 10 }, ...Array(5).fill({ wch: 14 })]; XLSX.utils.book_append_sheet(wb, wm, X.xSheets[3]);
  XLSX.writeFile(wb, `${lt ? 'Rinkos_izvalgos' : 'Market_insights'}_${IN.per}_${iso(b)}.xlsx`);
}
['en', 'lt'].forEach(l => Object.assign(I18N[l].info, I18N[l].in.info));
document.addEventListener('click', e => { if (e.target.closest('.ins-xls')) { e.stopImmediatePropagation(); insXlsx().catch(err => alert('Excel: ' + err)); } }, true);
renderInsights();
