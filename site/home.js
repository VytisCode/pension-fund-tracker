/* Pradžia – kortelių tinklelis (savininkas 2026-11-11: „kaip Microsoft Edge pradžios puslapis“).
   Kiekviena kortelė atsako į vieną klausimą: klausimas + didelis skaičius + mažas vaizdas + „Plačiau“.
   Diagramos parinktos pagal klausimą: dalis iš visumos – žiedas, „kiek iš kiek“ – progreso juosta, kelias – mini linija,
   dienų uždarbis – kalendoriaus šilumos žemėlapis, intervalas grupėse – taškai, pokytis per metus – nuolydis.
   Bandomoji versija: įjungiama nuoroda ?nauja=1 (išjungiama ?nauja=0), kol savininkas patvirtins.
   Ikonos – Fluent UI System Icons (Microsoft, MIT) site/img/ic/, nuotraukos – site/img/ (CREDITS.md).
   Skaičiai – tie patys kaip senose kortelėse (compute(), EARN, MKT): viena sąvoka – vienas apibrėžimas. */
addStrings({
  hgQ: { avg: 'How is the average fund doing?', lead: 'Who is leading?', aum: 'How much is saved?', earn: 'How much did funds earn in euros?',
    pos: 'How many funds are up?', gap: 'Where are the gaps biggest?', part: 'How many participants?', share: 'Who gained market share?' },
  hgS: {
    avg: (l, w) => `Leader ${l}, last ${w}. Simple average of the life-cycle funds.`,
    lead: n => `Managers by average return of their ${n} life-cycle funds`,
    aum: (n, d) => `${n} funds · ${d}`,
    earn: (y, d) => `Investment gain of all funds since 1 January ${y} (to ${d}). Each square is one day.`,
    pos: (k, n) => `${k} of ${n} funds have a positive return in this period`,
    gap: 'Best and weakest fund in each age group, %',
    part: (d, ch, rf) => `Bank of Lithuania, ${d} · ${ch} over the year${rf ? ' (2026 reform: some participants left and withdrew their savings)' : ''}`,
    share: (a, b) => `Share of pillar assets, ${a} → ${b}`,
  },
  hgEy: { mk: 'Market', ld: 'Leaders', as: 'Assets', er: 'Earnings', br: 'Direction', gp: 'Gaps', pt: 'Participants', sh: 'Market shares' },
  hgHiS: (c, d) => `${c} · pillar II · data to ${d}`, hgMore: 'More', hgLess: 'less', hgMoreC: 'more', hgDay: 'day', hgMon: 'Months',
}, {
  hgQ: { avg: 'Kaip sekasi vidutiniam fondui?', lead: 'Kas pirmauja?', aum: 'Kiek sukaupta?', earn: 'Kiek fondai uždirbo eurais?',
    pos: 'Kiek fondų kyla?', gap: 'Kur didžiausi skirtumai?', part: 'Kiek dalyvių?', share: 'Kas augino rinkos dalį?' },
  hgS: {
    avg: (l, w) => `Pirmauja ${l}, paskutinis – ${w}. Paprastas gyvenimo ciklo fondų vidurkis.`,
    lead: n => `Valdytojai pagal jų ${n} gyvenimo ciklo fondų vidutinę grąžą`,
    aum: (n, d) => `${n} fondai · ${d}`,
    earn: (y, d) => `Visų fondų investicinis uždarbis nuo ${y} m. sausio 1 d. (iki ${d}). Kiekvienas kvadratėlis – viena diena.`,
    pos: (k, n) => `${k} iš ${n} fondų šiuo laikotarpiu grąža teigiama`,
    gap: 'Geriausias ir silpniausias fondas kiekvienoje amžiaus grupėje, %',
    part: (d, ch, rf) => `Lietuvos bankas, ${d} · per metus ${ch}${rf ? ' (2026 m. reforma: dalis dalyvių išėjo ir atsiėmė lėšas)' : ''}`,
    share: (a, b) => `Dalis pakopos turto, ${a} → ${b}`,
  },
  hgEy: { mk: 'Rinka', ld: 'Lyderiai', as: 'Turtas', er: 'Uždarbis', br: 'Kryptis', gp: 'Skirtumai', pt: 'Dalyviai', sh: 'Rinkos dalys' },
  hgHiS: (c, d) => `${c} · II pakopa · duomenys iki ${d}`, hgMore: 'Plačiau', hgLess: 'mažiau', hgMoreC: 'daugiau', hgDay: 'diena', hgMon: 'Mėnesiai',
});

const HG_SRC = { LV: 'manapensija.lv', EE: 'pensionikeskus.ee' };   // dalyvių šaltinis šalies kopijoje (ne Lietuvos bankas – savininkas pastebėjo 2026-11-11)
if (typeof CTRY_COPY !== 'undefined') addStrings({   // LV/EE: grupės – rizikos (akcijų dalies) grupės; ketvirčio duomenys – ne Lietuvos banko
  hgS: { ...I18N.en.hgS, avg: (l, w) => `Leader ${l}, last ${w}. Simple average of all funds.`, lead: n => `Managers by average return across ${n} fund groups`,
    gap: 'Best and weakest fund in each fund group, %', part: (d, ch) => `${HG_SRC[CTRY_COPY] || ''}, ${d} · ${ch} over the year` } }, {
  hgS: { ...I18N.lt.hgS, avg: (l, w) => `Pirmauja ${l}, paskutinis – ${w}. Paprastas visų fondų vidurkis.`, lead: n => `Valdytojai pagal vidutinę grąžą ${n} fondų grupėse`,
    gap: 'Geriausias ir silpniausias fondas kiekvienoje fondų grupėje, %', part: (d, ch) => `${HG_SRC[CTRY_COPY] || ''}, ${d} · per metus ${ch}` } });

const HG_ON = (() => { let v = null; try { const q = new URLSearchParams(location.search).get('nauja'); if (q != null) localStorage.setItem('homeV3', q === '0' ? '0' : '1'); v = localStorage.getItem('homeV3'); } catch (e) {} return v === '1'; })();
const hgIc = n => `<span class="hgic" style="--ic:url(img/ic/${n}.svg)" aria-hidden="true"></span>`;
const hgCard = o => `<article class="hgc ${o.sz || 's'}${o.img ? ' ph' : ''}"${o.img ? ` style="--ph:url(img/${o.img})"` : ''}>
  <header class="hgh">${hgIc(o.ic)}<span class="ey">${o.ey}</span>${o.per ? `<span class="per">${o.per}</span>` : ''}</header>
  <h3 class="hgq">${o.q}</h3>${o.big != null ? `<div class="hgb${o.cls ? ' ' + o.cls : ''}">${o.big}</div>` : ''}${o.sub ? `<p class="hgs">${o.sub}</p>` : ''}
  <div class="hgv">${o.vis || ''}</div><a class="hgm" href="${o.href}">${T().hgMore} ${hgIc('arrow-right')}</a></article>`;

/* ---------- mažos diagramos ---------- */
function hgLine(pts, W = 320, H = 70) {          // tiesios atkarpos (savininkas nemėgsta suapvalintų kreivių), plotas po linija
  if (!pts || pts.length < 3) return '';
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = xs[0], x1 = xs[xs.length - 1], lo = Math.min(0, ...ys), hi = Math.max(...ys);
  const X = x => ((x - x0) / ((x1 - x0) || 1) * W).toFixed(1), Y = y => (H - 4 - (y - lo) / ((hi - lo) || 1) * (H - 10)).toFixed(1);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x)} ${Y(y)}`).join('');
  return `<svg class="hgl" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" class="z"/><path d="${d}L${W} ${H}L0 ${H}Z" class="a"/><path d="${d}" class="l"/></svg>`;
}
function hgDonut(parts, label) {                   // dalis iš visumos: [pavadinimas, spalva, reikšmė]
  const tot = parts.reduce((s, p) => s + p[2], 0) || 1, R = 42, C = 2 * Math.PI * R; let off = 0;
  const arcs = parts.map(([, col, v]) => { const len = v / tot * C, s = `<circle r="${R}" cx="50" cy="50" fill="none" stroke="${col}" stroke-width="13" stroke-dasharray="${Math.max(0, len - 1.2).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"/>`; off += len; return s; }).join('');
  return `<div class="hgdn"><svg viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-90 50 50)">${arcs}</g><text x="50" y="55" text-anchor="middle">${label}</text></svg>
    <ul>${parts.map(([n, col, v]) => `<li><i style="background:${col}"></i>${hEsc(n)}<b>${num(v / tot * 100, 1)} %</b></li>`).join('')}</ul></div>`;
}
function hgBars(rows) {                             // [pavadinimas, spalva, reikšmė, tekstas] – nuo nulio
  const m = Math.max(...rows.map(r => Math.abs(r[2])), 0.01);
  return `<div class="hgbars">${rows.map(([n, col, v, tx], i) => `<div class="r${i ? '' : ' top'}"><span class="n">${hEsc(n)}</span><span class="t"><i style="width:${Math.abs(v) / m * 100}%;background:${col}"></i></span><b>${tx}</b></div>`).join('')}</div>`;
}
function hgDots(rows) {                             // intervalas grupėje: [grupė, min, max, minSpalva, maxSpalva]
  const lo = Math.min(0, ...rows.map(r => r[1])), hi = Math.max(...rows.map(r => r[2])), X = v => ((v - lo) / ((hi - lo) || 1) * 100).toFixed(1);
  return `<div class="hgdots">${rows.map(([g, a, b, ca, cb]) => `<div class="r"><span class="n">${hEsc(g)}</span><span class="t"><i class="rg" style="left:${X(a)}%;width:${X(b) - X(a)}%"></i><i class="d" style="left:${X(a)}%;background:${ca}"></i><i class="d" style="left:${X(b)}%;background:${cb}"></i></span><b>${num(b - a, 1)}</b></div>`).join('')}</div>`;
}
function hgSlope(rows, a, b) {                      // nuolydis: [pavadinimas, spalva, prieš, dabar]
  const W = 300, H = 180, vs = rows.flatMap(r => [r[2], r[3]]), lo = Math.min(...vs), hi = Math.max(...vs), Y = v => (10 + (hi - v) / ((hi - lo) || 1) * (H - 34)).toFixed(1);
  const L = 70, R = W - 70, sp = (vals) => { const o = vals.map((v, i) => [i, +Y(v)]).sort((a, b) => a[1] - b[1]); for (let i = 1; i < o.length; i++) if (o[i][1] - o[i - 1][1] < 12) o[i][1] = o[i - 1][1] + 12; const r = []; o.forEach(([i, y]) => { r[i] = y; }); return r; };
  const yl = sp(rows.map(r => r[2])), yr = sp(rows.map(r => r[3]));
  return `<svg class="hgsl" viewBox="0 0 ${W} ${H}" aria-hidden="true"><text x="${L}" y="${H}" class="ax" text-anchor="middle">${a}</text><text x="${R}" y="${H}" class="ax" text-anchor="middle">${b}</text>`
    + rows.map(([n, col, p, q], i) => `<line x1="${L}" y1="${Y(p)}" x2="${R}" y2="${Y(q)}" stroke="${col}" stroke-width="2.2"/><circle cx="${L}" cy="${Y(p)}" r="3.2" fill="${col}"/><circle cx="${R}" cy="${Y(q)}" r="3.2" fill="${col}"/>`
      + `<text x="${L - 7}" y="${yl[i] + 3.5}" text-anchor="end">${num(p, 1)}</text><text x="${R + 7}" y="${yr[i] + 3.5}">${hEsc(n)} ${num(q, 1)}</text>`).join('') + '</svg>';
}
function hgCal(daily, y) {                          // kalendoriaus šilumos žemėlapis: savaitės stulpeliai, dienos eilutės
  const d0 = dayOf(`${y}-01-01`), xs = daily.filter(z => z.d >= d0), m = Math.max(...xs.map(z => Math.abs(z.g)), 0.01);
  const wd = d => (new Date(d * DAY).getUTCDay() + 6) % 7, w0 = d0 - wd(d0), cs = 11, gp = 2;
  const last = xs.length ? xs[xs.length - 1].d : d0, nW = Math.floor((last - w0) / 7) + 1, W = nW * (cs + gp), H = 5 * (cs + gp) + 12;
  const mon = T().monShort || ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  let s = '';
  for (let mo = 0; mo < 12; mo++) { const md = dayOf(`${y}-${String(mo + 1).padStart(2, '0')}-01`); if (md > last) break; s += `<text x="${Math.floor((md - w0) / 7) * (cs + gp)}" y="9" class="ax">${mon[mo]}</text>`; }
  xs.forEach(z => { const k = wd(z.d); if (k > 4) return; const a = Math.min(1, Math.abs(z.g) / m), col = z.g >= 0 ? 'var(--dpos)' : 'var(--dneg)';
    s += `<rect x="${Math.floor((z.d - w0) / 7) * (cs + gp)}" y="${12 + k * (cs + gp)}" width="${cs}" height="${cs}" rx="2" style="fill:color-mix(in srgb, ${col} ${Math.round(18 + a * 82)}%, var(--card))"><title>${iso(z.d)}: ${mSMn(z.g)}</title></rect>`; });
  return `<svg class="hgcal" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}

/* ---------- kortelės ---------- */
function hgRender() {
  if (!HG_ON) return;
  const t = T(), c = compute(), P = t.per[PER], g = document.getElementById('hg'); if (!g) return;
  const L = c.byY[0], Wn = c.byY[c.byY.length - 1], pp = lang === 'lt' ? 'p. p.' : 'pp', out = [];
  // 1. kiek uždirbo vidutinis dalyvio euras – nuotrauka + palyginimas su infliacija ir €STR
  { const E = euroCmp(t, c, ['#ffffff', '#f3a487', 'rgba(255,255,255,.55)']), real = E.inf && E.pe != null ? pct(((1 + E.pe / 100) / (1 + E.inf.v / 100) - 1) * 100) : null;
    out.push(hgCard({ sz: 'l', img: 'sec2-results.jpg', ic: 'arrow-trending', ey: t.hgEy.mk, per: P, q: t.kEu(P).replace(/ · .*$/, ''),
      big: E.pe == null ? '–' : pct(E.pe), sub: [real && t.kEuReal(real), t.kEuS.replace(/\.\s.*$/, '.')].filter(Boolean).join(' · '),
      vis: E.html + `<p class="hgs">${[E.inf ? t.kEuIN(E.inf.m) : t.kEuNo, E.es != null ? '€STR – ECB' : ''].filter(Boolean).join(' · ')}</p>`, href: 'performance.html' })); }
  // 2. lyderis – juostos
  out.push(hgCard({ sz: 't', ic: 'trophy', ey: t.hgEy.ld, per: P, q: t.hgQ.lead, big: mLab(L.id), sub: `${pct(L.ytd)} · ${t.hgS.lead(LC.length)}`,
    vis: hgBars(c.byY.map(m => [mLab(m.id), mCol(m.id), m.ytd, pct(m.ytd)])), href: 'performance.html#tab=sum' }));
  // 3. turtas – žiedas
  const by = {}; DATA.groups.flatMap(x => x.funds).filter(f => f.assets && f.assetsDate >= c.end - 10).forEach(f => { const k = CTRY ? MOF[f.provider] : f.provider; by[k] = (by[k] || 0) + f.assets; });
  out.push(hgCard({ sz: 't', ic: 'savings', ey: t.hgEy.as, q: t.hgQ.aum, big: money(c.aum), sub: t.hgS.aum(c.nAum, iso(c.aumD)),
    vis: hgDonut(Object.entries(by).sort((a, b) => b[1] - a[1]).map(([p, v]) => [mLab(p), mCol(p), v]), money(c.aum).replace(/ .*/, '')), href: 'aum.html' }));
  // 4. uždarbis eurais – kalendorius
  if (typeof euDaily === 'function' && typeof EARN !== 'undefined' && EARN) {
    const daily = euDaily('II', ''); if (daily.length) { const Ld = daily[daily.length - 1], y = iso(Ld.d).slice(0, 4), yS = euSum(daily, dayOf(y + '-01-01'), Ld.d);
      out.push(hgCard({ sz: 'w', ic: 'money-hand', ey: t.hgEy.er, per: y, q: t.hgQ.earn, big: mSMn(yS.g), cls: yS.g >= 0 ? 'up' : 'down', sub: t.hgS.earn(y, iso(Ld.d)),
        vis: hgCal(daily, y) + `<div class="hglg"><span>${t.hgLess}</span><i style="--a:20%"></i><i style="--a:55%"></i><i style="--a:100%"></i><span>${t.hgMoreC}</span><i class="n"></i><span>−</span></div>`, href: 'facts.html#tab=eu' })); } }
  // 5. kiek fondų kyla – progreso juosta
  const all = c.groups.flatMap(x => x.xs.map(z => z[1])).concat(c.tu.map(z => z[1])), k = all.filter(v => v > 0).length;
  out.push(hgCard({ sz: 's', ic: 'target-arrow', ey: t.hgEy.br, per: P, q: t.hgQ.pos, big: `${k} / ${all.length}`, sub: t.hgS.pos(k, all.length),
    vis: `<div class="hgpr"><i style="width:${all.length ? k / all.length * 100 : 0}%"></i></div>`, href: 'performance.html' }));
  // 6. skirtumai grupėse – taškai
  const G = c.groups.filter(x => x.gap != null), Gm = [...G].sort((a, b) => b.gap - a.gap)[0];
  if (Gm) out.push(hgCard({ sz: 't', ic: 'scales', ey: t.hgEy.gp, per: P, q: t.hgQ.gap, big: `${num(Gm.gap, 2)} ${pp}`, sub: `${groupLabel(Gm.g)}: ${labelOf(Gm.xs[0][0])} – ${labelOf(Gm.xs[Gm.xs.length - 1][0])}`,
    vis: hgDots([...G].reverse().map(x => [groupLabel(x.g).replace(/\s*\(.*$/, ''), x.xs[x.xs.length - 1][1], x.xs[0][1], colorOf(x.xs[x.xs.length - 1][0]), colorOf(x.xs[0][0])])) + `<p class="hgs">${t.hgS.gap}</p>`, href: 'performance.html#tab=market' }));
  // 7. dalyviai ir 8. rinkos dalys – Lietuvos banko ketvirčio duomenys (MKT)
  if (typeof MKT !== 'undefined' && MKT.II && typeof byMgr === 'function') {
    const ds = MKT.II.dates, di = ds.length - 1, d = ds[di], pdi = ds.indexOf(qBack(d, 12)), tn = totals('II', di), tp = totals('II', pdi);
    const series = ds.map((x, i) => [dayOf(x), totals('II', i).part]).filter(p => p[1] > 0).slice(-12);
    out.push(hgCard({ sz: 's', ic: 'people', ey: t.hgEy.pt, per: d, q: t.hgQ.part, big: mInt(tn.part), sub: t.hgS.part(d, tp.ok ? mSInt(tn.part - tp.part) : '–', !CTRY && d >= '2026-06-30'), vis: hgLine(series, 240, 40), href: 'facts.html#tab=mk' }));
    if (pdi >= 0) { const a = byMgr('II', pdi), b = byMgr('II', di);
      const rows = Object.keys(b).filter(m => a[m]).map(m => [m, mkColor(m), a[m].nav / tp.nav * 100, b[m].nav / tn.nav * 100]).sort((x, y) => y[3] - x[3]);
      const top = [...rows].sort((x, y) => (y[3] - y[2]) - (x[3] - x[2]))[0];
      out.push(hgCard({ sz: 'w', ic: 'data-pie', ey: t.hgEy.sh, per: `${ds[pdi]} → ${d}`, q: t.hgQ.share, big: top ? `${top[0]} ${top[3] - top[2] >= 0 ? '+' : '−'}${num(Math.abs(top[3] - top[2]), 2)} ${pp}` : '–', sub: t.hgS.share(ds[pdi], d), vis: hgSlope(rows, ds[pdi].slice(0, 7), d.slice(0, 7)), href: 'managers.html#tab=mg' })); }
  }
  g.innerHTML = out.join('');
  { const tx = document.querySelector('.sechero.has-kpi .shtx');   // nuotraukos juosta – tik šalis, pakopa ir duomenų data; skaičiai – kortelėse
    if (tx) { let hi = tx.querySelector('.hgreet'); if (!hi) { hi = document.createElement('div'); hi.className = 'hgreet'; tx.prepend(hi); }
      hi.innerHTML = `<span>${t.hgHiS(t.hC[PCTRY] || t.hC.LT, iso(c.end))}</span>`; } }   // be pasisveikinimo (savininkas: „Laba diena“ naudos neduoda)
  // esamos kortelės (nieko nenumetame): Lyderiai, Trumpai, naujienos, Lietuvos banko faktai, grupių lentelė – į tą patį tinklelį
  [['ldrC', 'w'], ['tdNews', 'w'], [document.querySelector('.says'), 'w'], [document.querySelector('.tdmk'), 'w'], [document.getElementById('gT') && document.getElementById('gT').closest('section'), 'f']]
    .forEach(([el, sz]) => { el = typeof el === 'string' ? document.getElementById(el) : el; if (!el) return; el.classList.add('hgx', sz); g.appendChild(el); });
}
if (HG_ON) {
  document.documentElement.classList.add('hv3');
  const td = document.querySelector('[data-tab="td"]'), big = document.getElementById('big');
  const g = document.createElement('div'); g.className = 'hg'; g.id = 'hg';
  const my = document.getElementById('myC'); td.insertBefore(g, my);
  const _render = render; render = function () { _render(); hgRender(); };   // eslint-disable-line no-func-assign
  render();
}
