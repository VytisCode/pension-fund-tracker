/* Valdytojo ir fondo puslapis (auditas #61 + #64). Pasirinkus valdytoją – jo suvestinė (II ir III pakopos fondai, vieta grupėse,
   mokesčiai, turtas, portfelis, 10 didžiausių pozicijų, rizika); pasirinkus fondą – to fondo kortelė su konkurentais.
   Puslapis įgauna valdytojo spalvą. Spausdinama vieno A4 lapo suvestinė.
   Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti), ne metinė; II pakopa – kasdienės vertės, III pakopa – mėnesio pabaigos (data_rep.js).
   Fondai lyginami tik su savo grupe: gyvenimo ciklo – ta pačia gimimo metų grupe, turto išsaugojimo – tarpusavyje, III pakopa – ta pačia rizikos kategorija. */
addStrings({
  selP: 'Manager:', selF: 'View:', allF: 'Manager summary (all funds)', optII: 'Pillar II', optIII: 'Pillar III', a4: '🖶 One-page A4 summary',
  bandS: (n2, n3) => `${n2} pillar II and ${n3} pillar III funds`,
  kII: 'Pillar II assets', kIII: 'Pillar III assets', kShare: 'Share of pillar II market', kYtd: 'This year, average life-cycle fund', kYtdS: (k, n) => `place ${k} of ${n} managers`,
  kFee: 'Asset-weighted fee (II)', kPay: y => `Reform payouts ${y}`, kUv: 'Unit value', kAs: 'Net assets', kFeeF: 'Management fee', kPlace: 'Place in group this year',
  h2: 'Pillar II funds: return and place in group', m2: (d) => `Unit value change to ${d}, not annualised; next to it – place among the group’s funds (1 = best). Volatility and maximum fall – last 3 years.`,
  h3: 'Pillar III funds: return and place in category', m3: (d) => `Month-end unit values to ${d}, not annualised; compared within the same risk category.`,
  thFund: 'Fund', thG: 'Group', thFee: 'Fee, %', thAum: 'Assets, € m', thVol: 'Volatility, %', thDd: 'Max fall, %', thCat: 'Category', thMed: 'Group median', thDiff: 'Difference, pp', thPer: 'Period', thPlace: 'Place',
  cat: { bond: 'Bonds', mixed: 'Mixed', equity: 'Equity' },
  hAum: 'Net assets at quarter ends', mAum: 'Sum of the manager’s funds, € m. Until daily data exist – Bank of Lithuania quarter-end portfolio totals.',
  hAl: q => `Portfolio by asset type, ${q}`, hTop: q => `10 largest holdings, ${q}`, mPf: n => `Bank of Lithuania portfolio reports; ${n}.`, pfAll: 'all pillar II funds of the manager', pfOne: 'this fund',
  thPos: 'Holding', thType: 'Type', thW: 'Share, %',
  types: { e: 'Shares', b: 'Bonds', f: 'Funds & ETFs', c: 'Cash & deposits', d: 'Derivatives' },
  hPeers: 'Compared with the group', mPeers: 'Each period ends on the group’s common latest day.', hChart: '3-year return compared with the group', hRisk: 'Risk',
  rVol1: 'Volatility, 1 year', rVol3: 'Volatility, 3 years', rDd3: 'Maximum fall, 3 years', rRisky: 'Risky assets (LB)', rNote: 'Volatility – annualised standard deviation of daily changes; maximum fall – the largest drop from a peak.',
  noPf: 'No portfolio data for this fund.', foot: 'Returns are changes in unit value (fees already deducted), not annualised. Funds are compared only within their group. For information only, not investment advice.',
}, {
  selP: 'Valdytojas:', selF: 'Rodyti:', allF: 'Valdytojo suvestinė (visi fondai)', optII: 'II pakopa', optIII: 'III pakopa', a4: '🖶 Vieno A4 lapo suvestinė',
  bandS: (n2, n3) => `${n2} II pakopos ir ${n3} III pakopos fondai`,
  kII: 'II pakopos turtas', kIII: 'III pakopos turtas', kShare: 'Dalis II pakopos rinkoje', kYtd: 'Šie metai, vidutinis gyvenimo ciklo fondas', kYtdS: (k, n) => `${k} vieta iš ${n} valdytojų`,
  kFee: 'Svertinis mokestis (II)', kPay: y => `Reformos išmokos ${y} m.`, kUv: 'Vieneto vertė', kAs: 'Grynieji aktyvai', kFeeF: 'Valdymo mokestis', kPlace: 'Vieta grupėje šiais metais',
  h2: 'II pakopos fondai: grąža ir vieta grupėje', m2: (d) => `Vieneto vertės pokytis iki ${d}, ne metinis; šalia – vieta tarp grupės fondų (1 – geriausia). Svyravimas ir didžiausias kritimas – paskutinių 3 metų.`,
  h3: 'III pakopos fondai: grąža ir vieta kategorijoje', m3: (d) => `Mėnesio pabaigos vieneto vertės iki ${d}, ne metinis pokytis; lyginama toje pačioje rizikos kategorijoje.`,
  thFund: 'Fondas', thG: 'Grupė', thFee: 'Mokestis, %', thAum: 'Turtas, mln. €', thVol: 'Svyravimas, %', thDd: 'Didž. kritimas, %', thCat: 'Kategorija', thMed: 'Grupės mediana', thDiff: 'Skirtumas, p. p.', thPer: 'Laikotarpis', thPlace: 'Vieta',
  cat: { bond: 'Obligacijų', mixed: 'Mišrūs', equity: 'Akcijų' },
  hAum: 'Grynieji aktyvai ketvirčių pabaigoje', mAum: 'Valdytojo fondų suma, mln. €. Kol nebuvo kasdienių duomenų – Lietuvos banko ketvirčio pabaigos portfelių sumos.',
  hAl: q => `Portfelis pagal turto rūšį, ${q}`, hTop: q => `10 didžiausių pozicijų, ${q}`, mPf: n => `Lietuvos banko portfelių ataskaitos; ${n}.`, pfAll: 'visi valdytojo II pakopos fondai', pfOne: 'šis fondas',
  thPos: 'Pozicija', thType: 'Rūšis', thW: 'Dalis, %',
  types: { e: 'Akcijos', b: 'Obligacijos', f: 'Fondai ir ETF', c: 'Pinigai ir indėliai', d: 'Išvestinės' },
  hPeers: 'Palyginimas su grupe', mPeers: 'Kiekvienas laikotarpis baigiasi bendra naujausia grupės diena.', hChart: '3 metų grąža, palyginti su grupe', hRisk: 'Rizika',
  rVol1: 'Svyravimas, 1 metai', rVol3: 'Svyravimas, 3 metai', rDd3: 'Didžiausias kritimas, 3 metai', rRisky: 'Rizikingas turtas (LB)', rNote: 'Svyravimas – metinis dienos pokyčių standartinis nuokrypis; didžiausias kritimas – didžiausias sumažėjimas nuo piko.',
  noPf: 'Šio fondo portfelio duomenų nėra.', foot: 'Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti), ne metinė. Fondai lyginami tik savo grupėje. Informacinė medžiaga, ne investavimo rekomendacija.',
});
const $ = id => document.getElementById(id);
const PROVS = DATA.providers.map(p => p.id);
const PERS = ['ytd', '1y', '3y', '5y'];
const LC = DATA.groups.filter(g => g.id !== 'turto');
const median = xs => { const a = xs.filter(x => x != null).sort((x, y) => x - y); if (!a.length) return null; const k = a.length >> 1; return a.length % 2 ? a[k] : (a[k - 1] + a[k]) / 2; };
const mean = xs => { const a = xs.filter(x => x != null); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const fmt = (x, p = 2) => x == null ? '–' : num(x, p);
const ST = { p: 'SEB', f: '' };
try { const s = JSON.parse(localStorage.getItem('mgrState') || '{}'); if (PROVS.includes(s.p)) { ST.p = s.p; ST.f = s.f || ''; } } catch (e) {}
(() => { const h = decodeURIComponent(location.hash.slice(1)); if (!h) return; const k = h.indexOf('/'), p = k < 0 ? h : h.slice(0, k), f = k < 0 ? '' : h.slice(k + 1); if (PROVS.includes(p)) { ST.p = p; ST.f = f || ''; } })();
function save() { try { localStorage.setItem('mgrState', JSON.stringify(ST)); } catch (e) {} history.replaceState(null, '', '#' + encodeURIComponent(ST.p) + (ST.f ? '/' + encodeURIComponent(ST.f) : '')); }

/* ---------- II pakopa: grąža, vieta ir rizika iš kasdienių verčių (data.js) ---------- */
const PEER = new Map();                 // grupė+laikotarpis -> {end, rets: {provider: grąža}}
function peerRets(g, per) {
  const key = g.id + per; if (PEER.has(key)) return PEER.get(key);
  const { end, overallLast } = groupEnd(g);
  const r = presetRangeF(per, end, g.funds, maxAnchorOf(g.funds)), rets = {};
  g.funds.forEach(f => { const s = f.d[f.d.length - 1] >= overallLast - 5 ? seriesOf(f, r.anchor, r.end) : null; rets[f.provider] = s ? s.ret : null; });
  const out = { end: r.end, anchor: r.anchor, rets }; PEER.set(key, out); return out;
}
function placeOf(rets, p) {             // vieta (1 – geriausia) ir kiek fondų turi reikšmę
  const xs = Object.values(rets).filter(v => v != null), v = rets[p];
  return v == null ? null : { k: xs.filter(x => x > v).length + 1, n: xs.length };
}
function risk(f, end, months) {         // metinis svyravimas ir didžiausias kritimas (%) laikotarpyje
  const a = lastOnOrBefore(f, shiftMonths(end, months)), b = lastOnOrBefore(f, end);
  if (a < 0 || b - a < 20 || f.d[0] > shiftMonths(end, months) + 7) return null;
  const rs = []; let peak = f.v[a], dd = 0;
  for (let i = a + 1; i <= b; i++) { rs.push(f.v[i] / f.v[i - 1] - 1); peak = Math.max(peak, f.v[i]); dd = Math.min(dd, f.v[i] / peak - 1); }
  const m = rs.reduce((s, x) => s + x, 0) / rs.length, sd = Math.sqrt(rs.reduce((s, x) => s + (x - m) ** 2, 0) / (rs.length - 1));
  return { vol: sd * Math.sqrt(252) * 100, dd: dd * 100 };
}
const fundsII = p => DATA.groups.map(g => ({ g, f: g.funds.find(f => f.provider === p) })).filter(x => x.f).reverse();   // jauniausi pirmi
const repOf = (pl, p, gOrN) => REP.funds.find(x => x.pl === pl && x.p === p && (pl === 'II' ? x.g === gOrN : x.n === gOrN));

/* ---------- III pakopa: mėnesio pabaigos vertės (data_rep.js) ---------- */
const fundsIII = p => REP.funds.filter(x => x.pl === 'III' && x.p === p).sort((a, b) => ['bond', 'mixed', 'equity'].indexOf(a.g) - ['bond', 'mixed', 'equity'].indexOf(b.g) || a.n.localeCompare(b.n));
const M3END = (() => { const fs = REP.funds.filter(x => x.pl === 'III'); for (let i = REP.months.length - 1; i >= 0; i--) if (fs.filter(f => f.m[i] != null).length >= fs.length * 0.8) return i; return REP.months.length - 1; })();
function retIII(f, per) {
  const e = REP.months[M3END], t = per === 'ytd' ? Math.round(Date.UTC(new Date(e * DAY).getUTCFullYear() - 1, 11, 31) / DAY) : shiftMonths(e, { '1y': 12, '3y': 36, '5y': 60 }[per]);
  const i0 = REP.months.findIndex(d => Math.abs(d - t) <= 3);
  return i0 < 0 || f.m[i0] == null || f.m[M3END] == null ? null : (f.m[M3END] / f.m[i0] - 1) * 100;
}
const peersIII = (f, per) => Object.fromEntries(REP.funds.filter(x => x.pl === 'III' && x.g === f.g).map(x => [x.n, retIII(x, per)]));

/* ---------- turtas ketvirčių pabaigoje (data_aum.js) ---------- */
function aumSeries(p, pl, only) {
  const fs = AUM.funds.filter(f => f.p === p && f.pl === pl && (!only || f.n === only));
  if (!fs.length) return [];
  const last = Math.max(...fs.map(f => f.d[f.d.length - 1])), first = Math.min(...fs.map(f => f.d[0]));
  const at = (f, day) => { let v = null; for (let i = 0; i < f.d.length && f.d[i] <= day; i++) if (day - f.d[i] <= 10) v = f.a[i]; return v; };
  const ends = [];
  for (let y = new Date(first * DAY).getUTCFullYear(); ; y++) { let stop = false; for (const m of [3, 6, 9, 12]) { const d = Math.round(Date.UTC(y, m, 0) / DAY); if (d > last) { stop = true; break; } if (d >= first) ends.push(d); } if (stop) break; }
  ends.push(last);
  return ends.map(d => { let s = 0, ok = 0; fs.forEach(f => { const v = at(f, d); if (v != null) { s += v; ok++; } }); return ok ? [d, s] : null; }).filter(Boolean);
}
function moneyChart(el, series) {        // paprasta linijinė diagrama mln. € (pradžia nuo nulio)
  el.innerHTML = '';
  const start = series[0].pts.length > 1 ? series[0].pts[0][0] : -Infinity;   // nuo pirmos (II pakopos) eilutės pradžios
  series = series.map(s => ({ ...s, pts: s.pts.filter(p => p[0] >= start) })).filter(s => s.pts.length > 1);
  if (!series.length) { el.innerHTML = `<p class="na">${T().noData}</p>`; return; }
  const W = el.clientWidth || 600, H = 220, m = { l: 52, r: 12, t: 10, b: 24 };
  const x0 = Math.min(...series.map(s => s.pts[0][0])), x1 = Math.max(...series.map(s => s.pts[s.pts.length - 1][0]));
  const hi = Math.max(...series.flatMap(s => s.pts.map(p => p[1]))) * 1.06 || 1, ticks = niceTicks(0, hi, 4);
  const X = d => m.l + (d - x0) / (x1 - x0 || 1) * (W - m.l - m.r), Y = v => m.t + (1 - v / hi) * (H - m.t - m.b);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${hEsc(T().hAum)}">`;
  ticks.forEach(t => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(t)}" y2="${Y(t)}" stroke="var(--grid)"/><text x="${m.l - 6}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="var(--text-3)">${num(t, 0)}</text>`; });
  const y0 = new Date(x0 * DAY).getUTCFullYear(), y1 = new Date(x1 * DAY).getUTCFullYear(), step = Math.ceil((y1 - y0 + 1) / 8);
  for (let y = y0 + 1; y <= y1; y += step) { const d = Math.round(Date.UTC(y, 0, 1) / DAY); s += `<line x1="${X(d)}" x2="${X(d)}" y1="${m.t}" y2="${H - m.b}" stroke="var(--grid)"/><text x="${X(d)}" y="${H - 6}" text-anchor="middle" font-size="11" fill="var(--text-3)">${y}</text>`; }
  series.forEach(r => { s += `<polyline fill="none" stroke="${r.c}" stroke-width="2" ${r.dash ? 'stroke-dasharray="5 4"' : ''} points="${r.pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ')}"/>`; const l = r.pts[r.pts.length - 1]; s += `<circle cx="${X(l[0])}" cy="${Y(l[1])}" r="3" fill="${r.c}"/>`; });
  el.innerHTML = s + '</svg>';
  el._legend = series.map(r => ({ c: r.c, l: r.l, d: r.dash ? '5 4' : '' }));
}

/* ---------- portfelis (data_pf.js): naujausias ketvirtis ---------- */
function portfolio(p, g) {               // g – grupė (vienas fondas) arba null (visi II pakopos fondai)
  const fs = PF.funds.filter(f => f.pl === 'II' && f.p === labelOf(p) && (g ? f.g === g : true));
  let q = -1; fs.forEach(f => { for (let i = 0; i < f.r.length; i += 4) q = Math.max(q, f.r[i]); });
  if (q < 0) return null;
  const by = new Map(); let tot = 0;
  fs.forEach(f => { for (let i = 0; i < f.r.length; i += 4) if (f.r[i] === q) { by.set(f.r[i + 1], (by.get(f.r[i + 1]) || 0) + f.r[i + 3]); tot += f.r[i + 3]; } });
  const types = {}; by.forEach((v, si) => { const t = PF.secs[si][1]; types[t] = (types[t] || 0) + v; });
  const top = [...by.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([si, v]) => ({ s: PF.secs[si], w: v / tot * 100 }));
  return { q: PF.quarters[q], tot, types: Object.entries(types).map(([t, v]) => ({ t, w: v / tot * 100 })).sort((a, b) => b.w - a.w), top };
}
function pfHTML(pf, sub) {
  const t = T();
  if (!pf) return `<section class="card"><p class="na">${t.noPf}</p></section>`;
  const al = pf.types.map(x => `<span>${t.types[x.t] || x.t}</span><span class="t"><i style="width:${Math.min(100, Math.max(0, x.w))}%"></i></span><span class="n">${fmt(x.w, 1)}</span>`).join('');
  const top = pf.top.map((x, i) => `<tr><td class="n">${i + 1}</td><td class="wrap">${hEsc(x.s[8] || x.s[0])}</td><td>${t.types[x.s[1]] || ''}</td><td class="n">${fmt(x.w, 2)}</td></tr>`).join('');
  return `<div class="two"><section class="card" data-src="pf"><h2>${t.hAl(pf.q)}</h2><div class="meta">${t.mPf(sub)}</div><div class="alloc">${al}</div></section>
    <section class="card" data-src="pf"><h2>${t.hTop(pf.q)}</h2><div class="scroll"><table class="mt"><thead><tr><th class="n">#</th><th>${t.thPos}</th><th>${t.thType}</th><th class="n">${t.thW}</th></tr></thead><tbody>${top}</tbody></table></div></section></div>`;
}

/* ---------- valdytojo suvestinė ---------- */
function renderManager() {
  const t = T(), p = ST.p, ii = fundsII(p), iii = fundsIII(p);
  const all = DATA.groups.flatMap(g => g.funds), last = Math.max(...all.map(f => f.d[f.d.length - 1]));
  const live = all.filter(f => f.assets && f.assetsDate >= last - 10), mine = live.filter(f => f.provider === p);
  const aII = mine.reduce((s, f) => s + f.assets, 0), aAll = live.reduce((s, f) => s + f.assets, 0), aIII = iii.reduce((s, f) => s + (f.aum || 0), 0);
  const ytdM = PROVS.map(q => ({ q, v: mean(LC.map(g => peerRets(g, 'ytd').rets[q])) })).filter(x => x.v != null).sort((a, b) => b.v - a.v);
  const me = ytdM.find(x => x.q === p);
  const feeW = (() => { let s = 0, w = 0; ii.forEach(({ g }) => { const r = repOf('II', p, g.id), f = mine.find(x => x === g.funds.find(y => y.provider === p)); if (r && r.fee != null && f) { s += r.fee * f.assets; w += f.assets; } }); return w ? s / w : null; })();
  const yNow = new Date(last * DAY).getUTCFullYear(), pay = AUM.payouts.filter(e => e.p === p && e.q.startsWith(yNow + '-')).reduce((s, e) => s + e.flow, 0);
  kpiRow([[t.kII, kpMoney(aII), iso(Math.max(...mine.map(f => f.assetsDate)))], [t.kShare, fmt(aII / aAll * 100, 1) + pctSfx()],
    me && [t.kYtd, pct(me.v), t.kYtdS(ytdM.indexOf(me) + 1, ytdM.length)], feeW != null && [t.kFee, fmt(feeW, 2) + pctSfx()],
    pay ? [t.kPay(yNow), kpMoney(-pay * 1e6).replace(/^/, '−')] : null, iii.length && [t.kIII, kpMoney(aIII)]]);
  let h = '';
  const per2 = PERS.map(per => ({ per, rs: ii.map(({ g }) => peerRets(g, per)) }));
  const endD = Math.max(...ii.map(({ g }) => peerRets(g, 'ytd').end));
  const cell = (v, pl) => `<td class="n${pl && pl.n > 2 && pl.k === 1 ? ' top' : pl && pl.n > 2 && pl.k === pl.n ? ' bot' : ''}">${v == null ? '–' : pct(v)}${pl ? `<small>${pl.k}/${pl.n}</small>` : ''}</td>`;
  const rows2 = ii.map(({ g, f }, i) => {
    const r = repOf('II', p, g.id), rk = risk(f, endD, 36);
    return `<tr><td>${groupLabel(g)}</td>${per2.map(x => { const pr = x.rs[i]; return cell(pr.rets[p], placeOf(pr.rets, p)); }).join('')}<td class="n">${r && r.fee != null ? fmt(r.fee) : '–'}</td><td class="n">${f.assets ? fmt(f.assets / 1e6, 1) : '–'}</td><td class="n">${rk ? fmt(rk.vol) : '–'}</td><td class="n">${rk ? fmt(rk.dd) : '–'}</td></tr>`;
  }).join('');
  h += `<section class="card" data-src="nav"><h2>${t.h2}</h2><div class="meta">${t.m2(iso(endD))}</div><div class="scroll"><table class="mt" id="t2"><thead><tr><th>${t.thG}</th>${PERS.map(x => `<th class="n">${T().periods[x]}</th>`).join('')}<th class="n">${t.thFee}</th><th class="n">${t.thAum}</th><th class="n">${t.thVol}</th><th class="n">${t.thDd}</th></tr></thead><tbody>${rows2}</tbody></table></div></section>`;
  if (iii.length) {
    const rows3 = iii.map(f => `<tr><td>${hEsc(f.n)}</td><td>${t.cat[f.g] || f.g}</td>${PERS.map(per => { const ps = peersIII(f, per); return cell(ps[f.n], placeOf(ps, f.n)); }).join('')}<td class="n">${f.fee != null ? fmt(f.fee) : '–'}</td><td class="n">${f.aum ? fmt(f.aum / 1e6, 1) : '–'}</td></tr>`).join('');
    h += `<section class="card" data-src="p3"><h2>${t.h3}</h2><div class="meta">${t.m3(iso(REP.months[M3END]))}</div><div class="scroll"><table class="mt" id="t3"><thead><tr><th>${t.thFund}</th><th>${t.thCat}</th>${PERS.map(x => `<th class="n">${T().periods[x]}</th>`).join('')}<th class="n">${t.thFee}</th><th class="n">${t.thAum}</th></tr></thead><tbody>${rows3}</tbody></table></div></section>`;
  }
  h += `<section class="card chart-card" data-src="aum"><h2>${t.hAum}</h2><div class="meta">${t.mAum}</div><div class="mchart" id="aumC"></div></section>`;
  h += pfHTML(portfolio(p, null), t.pfAll);
  $('body').innerHTML = h;
  cardify($('t2')); if ($('t3')) cardify($('t3'));
  moneyChart($('aumC'), [{ l: t.optII, c: 'var(--mc)', pts: aumSeries(p, 'II') }, { l: t.optIII, c: 'var(--mc)', dash: 1, pts: aumSeries(p, 'III') }]);
}

/* ---------- vienas fondas ---------- */
function renderFund() {
  const t = T(), p = ST.p, [pl, key] = [ST.f.slice(0, ST.f.indexOf(':')), ST.f.slice(ST.f.indexOf(':') + 1)];
  let h = '';
  if (pl === 'II') {
    const g = DATA.groups.find(x => x.id === key), f = g.funds.find(x => x.provider === p), r = repOf('II', p, key);
    const ytd = peerRets(g, 'ytd'), pl0 = placeOf(ytd.rets, p), end = ytd.end;
    kpiRow([[t.kUv, num(f.v[f.v.length - 1], 4), iso(f.d[f.d.length - 1])], f.assets && [t.kAs, kpMoney(f.assets), iso(f.assetsDate)],
      r && r.fee != null && [t.kFeeF, fmt(r.fee) + pctSfx()], pl0 && [t.kPlace, `${pl0.k} / ${pl0.n}`, pct(ytd.rets[p])]]);
    const rows = [...PERS, 'max'].map(per => { const x = peerRets(g, per), v = x.rets[p], o = Object.entries(x.rets).filter(([q]) => q !== p).map(([, v]) => v), md = median(o), pl1 = placeOf(x.rets, p);
      return `<tr><td>${T().periods[per]}<small> ${iso(x.anchor)} – ${iso(x.end)}</small></td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${md == null ? '–' : pct(md)}</td><td class="n">${v == null || md == null ? '–' : (v - md >= 0 ? '+' : '−') + num(Math.abs(v - md), 2)}</td><td class="n">${pl1 ? `${pl1.k} / ${pl1.n}` : '–'}</td></tr>`; }).join('');
    const peers = g.funds.map(x => ({ p: x.provider, v: ytd.rets[x.provider], r: repOf('II', x.provider, key), f: x, rk: risk(x, end, 36) })).sort((a, b) => (b.v ?? -1e9) - (a.v ?? -1e9));
    const prow = peers.map(x => `<tr${x.p === p ? ' class="me"' : ''}><td><i class="sw" style="background:${colorOf(x.p)}"></i>${labelOf(x.p)}</td><td class="n">${x.v == null ? '–' : pct(x.v)}</td><td class="n">${x.r && x.r.fee != null ? fmt(x.r.fee) : '–'}</td><td class="n">${x.f.assets ? fmt(x.f.assets / 1e6, 1) : '–'}</td><td class="n">${x.rk ? fmt(x.rk.vol) : '–'}</td><td class="n">${x.rk ? fmt(x.rk.dd) : '–'}</td></tr>`).join('');
    const r1 = risk(f, end, 12), r3 = risk(f, end, 36);
    h += `<section class="card" data-src="nav"><h2>${t.hPeers} · ${groupLabel(g)}</h2><div class="meta">${t.mPeers}</div><div class="scroll"><table class="mt" id="tp"><thead><tr><th>${t.thPer}</th><th class="n">${labelOf(p)}</th><th class="n">${t.thMed}</th><th class="n">${t.thDiff}</th><th class="n">${t.thPlace}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    h += `<div class="two"><section class="card chart-card" data-src="nav"><h2>${t.hChart}</h2><div class="mchart" id="fC"></div></section>
      <section class="card" data-src="nav"><h2>${groupLabel(g)} · ${T().periods.ytd}</h2><div class="scroll"><table class="mt" id="tq"><thead><tr><th>${t.thFund}</th><th class="n">${T().periods.ytd}</th><th class="n">${t.thFee}</th><th class="n">${t.thAum}</th><th class="n">${t.thVol}</th><th class="n">${t.thDd}</th></tr></thead><tbody>${prow}</tbody></table></div>
      <h3>${t.hRisk}</h3><table class="mt"><tbody><tr><td>${t.rVol1}</td><td class="n">${r1 ? fmt(r1.vol) + pctSfx() : '–'}</td></tr><tr><td>${t.rVol3}</td><td class="n">${r3 ? fmt(r3.vol) + pctSfx() : '–'}</td></tr><tr><td>${t.rDd3}</td><td class="n">${r3 ? fmt(r3.dd) + pctSfx() : '–'}</td></tr>${r && r.risky != null ? `<tr><td>${t.rRisky}</td><td class="n">${fmt(r.risky, 1)}${pctSfx()}</td></tr>` : ''}</tbody></table><p class="note">${t.rNote}</p></section></div>`;
    h += pfHTML(portfolio(p, key), t.pfOne);
    $('body').innerHTML = h;
    cardify($('tp')); cardify($('tq'));
    const x = peerRets(g, '3y');
    drawLineChart($('fC'), buildSeries(g.funds, x.anchor, x.end), x.anchor, x.end, { height: 260 });
  } else {
    const f = REP.funds.find(x => x.pl === 'III' && x.p === p && x.n === key);
    if (!f) { ST.f = ''; return renderManager(); }
    const ytd = peersIII(f, 'ytd'), pl0 = placeOf(ytd, f.n);
    kpiRow([[t.kUv, num(f.lv, 4), iso(f.ld)], f.aum && [t.kAs, kpMoney(f.aum), iso(f.aumd)], f.fee != null && [t.kFeeF, fmt(f.fee) + pctSfx()], pl0 && [t.kPlace, `${pl0.k} / ${pl0.n}`, pct(ytd[f.n])]]);
    const rows = PERS.map(per => { const ps = peersIII(f, per), v = ps[f.n], md = median(Object.entries(ps).filter(([n]) => n !== f.n).map(([, v]) => v)), pl1 = placeOf(ps, f.n);
      return `<tr><td>${T().periods[per]}</td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${md == null ? '–' : pct(md)}</td><td class="n">${v == null || md == null ? '–' : (v - md >= 0 ? '+' : '−') + num(Math.abs(v - md), 2)}</td><td class="n">${pl1 ? `${pl1.k} / ${pl1.n}` : '–'}</td></tr>`; }).join('');
    const peers = REP.funds.filter(x => x.pl === 'III' && x.g === f.g).map(x => ({ x, v: ytd[x.n] })).sort((a, b) => (b.v ?? -1e9) - (a.v ?? -1e9));
    const prow = peers.map(({ x, v }) => `<tr${x === f ? ' class="me"' : ''}><td><i class="sw" style="background:${colorOf(x.p)}"></i>${hEsc(x.n)}</td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${x.fee != null ? fmt(x.fee) : '–'}</td><td class="n">${x.aum ? fmt(x.aum / 1e6, 1) : '–'}</td></tr>`).join('');
    h += `<section class="card" data-src="p3"><h2>${t.hPeers} · ${t.cat[f.g] || f.g}</h2><div class="meta">${t.m3(iso(REP.months[M3END]))}</div><div class="scroll"><table class="mt" id="tp"><thead><tr><th>${t.thPer}</th><th class="n">${hEsc(f.n)}</th><th class="n">${t.thMed}</th><th class="n">${t.thDiff}</th><th class="n">${t.thPlace}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    h += `<section class="card" data-src="p3"><h2>${t.cat[f.g] || f.g} · ${T().periods.ytd}</h2><div class="scroll"><table class="mt" id="tq"><thead><tr><th>${t.thFund}</th><th class="n">${T().periods.ytd}</th><th class="n">${t.thFee}</th><th class="n">${t.thAum}</th></tr></thead><tbody>${prow}</tbody></table></div></section>`;
    h += `<section class="card chart-card" data-src="aum"><h2>${t.hAum}</h2><div class="mchart" id="aumC"></div></section>`;
    $('body').innerHTML = h;
    cardify($('tp')); cardify($('tq'));
    moneyChart($('aumC'), [{ l: f.n, c: 'var(--mc)', pts: aumSeries(p, 'III', f.n) }]);
  }
}

function render() {
  const t = T(), p = ST.p;
  document.documentElement.style.setProperty('--mc', colorOf(p));
  $('selPL').textContent = t.selP; $('selFL').textContent = t.selF; $('btnA4').textContent = t.a4;
  $('selP').innerHTML = PROVS.map(q => `<option value="${q}">${labelOf(q)}</option>`).join(''); $('selP').value = p;
  const ii = fundsII(p), iii = fundsIII(p);
  $('selF').innerHTML = `<option value="">${t.allF}</option><optgroup label="${t.optII}">${ii.map(({ g }) => `<option value="II:${g.id}">${labelOf(p)} ${groupLabel(g)}</option>`).join('')}</optgroup>`
    + (iii.length ? `<optgroup label="${t.optIII}">${iii.map(f => `<option value="III:${hEsc(f.n)}">${hEsc(f.n)}</option>`).join('')}</optgroup>` : '');
  if (ST.f && ![...$('selF').options].some(o => o.value === ST.f)) ST.f = '';
  $('selF').value = ST.f;
  const fl = ST.f ? $('selF').selectedOptions[0].textContent : t.allF;
  $('band').innerHTML = `<div><h2>${ST.f ? hEsc(fl) : labelOf(p)}</h2><div class="s">${ST.f ? labelOf(p) : t.bandS(ii.length, iii.length)}</div></div>`;
  document.title = `${ST.f ? fl : labelOf(p)} · ${t.siteTitle}`;
  if (ST.f) renderFund(); else renderManager();
  $('foot').textContent = t.foot;
  if (typeof srcLines === 'function') srcLines();
}
$('selP').addEventListener('change', e => { ST.p = e.target.value; ST.f = ''; save(); render(); });
$('selF').addEventListener('change', e => { ST.f = e.target.value; save(); render(); });
$('btnA4').addEventListener('click', () => { const r = document.documentElement; r.dataset.print = 'plain'; r.dataset.printA4 = '1'; setTimeout(() => window.print(), 50); });
addEventListener('afterprint', () => { delete document.documentElement.dataset.printA4; });
addEventListener('hashchange', () => { const h = decodeURIComponent(location.hash.slice(1)), k = h.indexOf('/'), p = k < 0 ? h : h.slice(0, k), f = k < 0 ? '' : h.slice(k + 1); if (PROVS.includes(p)) { ST.p = p; ST.f = f || ''; render(); } });
let rsz; addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(render, 200); });
renderHeader('manager', render);
render();
