/* Valdytojų fondų likvidumas (skiltis „Alternatyvios“, portfolios.html) – bet kuris valdytojas (savininkas 2026-11-09).
   Duomenys – docs/data_liq.js (liquidity.py site_payload, build_site.py). Matricas skaičiuoja čia, iš A / B ir AUM.
   Savininkas 2026-11-09: „ištaisyk formules, viskas turi matytis dashboard skiltyje Alternatyvos“. */
(function () {
  if (typeof LIQ === 'undefined' || !LIQ.mgr || !Object.keys(LIQ.mgr).length) return;
  const box = document.getElementById('liqBox');
  if (!box) return;
  const MG = LIQ.mgr, LIM = LIQ.limit, MGRS = Object.keys(MG).sort((a, b) => (a === 'SEB' ? -1 : b === 'SEB' ? 1 : a.localeCompare(b)));
  let P = null;
  const EX = [0, .1, .2, .3, .4, .5, .6, .7, .8, .9], MK = Array.from({ length: 20 }, (_, i) => i / 20);
  const st = { m: 'SEB', d: null, mode: 'fix', af: null, bf: null, tm: 'ax', hs: 'rel' };
  try { Object.assign(st, JSON.parse(localStorage.getItem('liqST') || '{}')); } catch (e) { /* be atminties */ }
  if (!MG[st.m]) st.m = MGRS[0];
  const save = () => { try { localStorage.setItem('liqST', JSON.stringify({ mode: st.mode, m: st.m, tm: st.tm, hs: st.hs })); } catch (e) { /* */ } };
  const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pc = (v, d = 2) => v == null ? '–' : (v * 100).toFixed(d).replace('.', ',') + ' %';
  const eu = v => v == null ? '–' : Math.round(v).toLocaleString('lt-LT').replace(/ /g, ' ') + ' €';
  const me = v => v == null ? '–' : (Math.abs(v) >= 1e9 ? (v / 1e9).toFixed(3).replace('.', ',') + ' mlrd. €' : (v / 1e6).toFixed(2).replace('.', ',') + ' mln. €');
  const gx = x => x == null ? '> 90 %' : Math.round(x * 100) + ' %';
  function share(a, t, x, m, mode) {
    if (a <= 0) return 0;
    const rest = mode === 'excel' ? (t - a) * (1 - x - m) : (t - a - x * t) * (1 - m);
    return rest <= 0 ? 1 : Math.min(1, a / (a + rest));
  }
  // vientisos spalvos (ne permatomos) – kad nukopijuota lentelė Outlook / Excel atrodytų taip pat
  const G = '#C6EFCE;color:#1d3b23', Y = '#FFEB9C;color:#4a3a00', R = '#FFC7CE;color:#5c0d14';
  const cAlt = v => v >= LIM - 1e-12 ? R : v >= .25 ? Y : G;
  const cBal = (v, l) => v >= l - 1e-12 ? R : v >= .9 * l ? Y : G;
  const hit = (a, t, l, m, mode) => { for (const x of EX) if (share(a, t, x, m, mode) >= l - 1e-12) return x; return null; };

  function matrix(a, t, col, mode) {
    return `<div class="scroll"><table class="pft liqm"><thead><tr><th class="l">Rinkų kritimas ↓ / Išėjimai →</th>${EX.map(x => `<th>${Math.round(x * 100)} %</th>`).join('')}</tr></thead><tbody>`
      + MK.map(m => `<tr><th class="l">${m ? '−' : ''}${Math.round(m * 100)} %</th>${EX.map(x => { const v = share(a, t, x, m, mode); return `<td style="background:${col(v)}">${pc(v)}</td>`; }).join('')}</tr>`).join('')
      + '</tbody></table></div>';
  }
  const fsel = (id, list, cur) => `<select id="${id}">${list.map(f => `<option value="${f.code}"${f.code === cur ? ' selected' : ''}>${h(f.name)}</option>`).join('')}</select>`;
  const tbl = (head, rows, cls = '') => `<div class="scroll"><table class="pft ${cls}"><thead><tr>${head.map((x, i) => `<th${i ? '' : ' class="l"'}>${x}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  const tr = (cells, bold) => `<tr${bold ? ' style="font-weight:700"' : ''}>${cells.map((c, i) => i ? `<td>${c}</td>` : `<td class="l">${c}</td>`).join('')}</tr>`;
  // Užvedus pelę – didžiausios pozicijos (title), paspaudus – visas sąrašas po eilute (savininkas 2026-11-09)
  const isGov = n => /vyriausyb|government|republic|respublik/i.test(n);
  const posOf = (k, f) => k === 'alt' ? f.altpos : f.balpos;
  const tip = (k, f) => {
    const L0 = posOf(k, f); if (!L0.length) return '';
    const top = L0.slice(0, 6).map(([n, v]) => `${n} – ${pc(v / f.aum)} (${me(v)})`).join('\n');
    const g = k === 'bal' ? L0.filter(([n]) => isGov(n)).reduce((a, [, v]) => a + v, 0) : 0;
    return (k === 'bal' ? `Vyriausybių ${me(g)} · įmonių ${me(f.bal - g)}\n` : '') + top + (L0.length > 6 ? `\n… dar ${L0.length - 6}. Spustelėkite – visas sąrašas.` : '\nSpustelėkite – visas sąrašas.');
  };
  const pk = (k, f, extra = '') => posOf(k, f).length ? ` class="liqk" data-k="${k}" data-c="${f.code}" title="${h(tip(k, f))}"${extra}` : extra;
  const det = (title, body, open) => `<details class="liqd"${open ? ' open' : ''}><summary><b>${title}</b></summary>${body}</details>`;

  /* ---------- Fondai laike ---------- */
  // Rodiklis: v – reikšmė, d – atstumas iki ribos (0 = riba pasiekta), g – „gerumas“ 0..1 spalvai
  const TM = {
    ax: { t: 'Išėjimo riba iki 30 % – kiek fondo turto gali išeiti', ok: f => f.in_alt, v: f => f.alt_x, d: v => v, g: v => v, e: f => f.alt_xe,
      tot: g => { const t = g.reduce((a, f) => a + f.aum, 0); return t ? g.reduce((a, f) => a + f.alt_xe, 0) / t : null; } },
    as: { t: 'Alternatyvų dalis portfelyje', ok: f => f.in_alt, v: f => f.alt_sh, d: v => LIM - v, g: v => 1 - v / LIM, e: f => f.alt,
      tot: g => { const t = g.reduce((a, f) => a + f.aum, 0); return t ? g.reduce((a, f) => a + f.alt, 0) / t : null; } },
    bx: { t: 'Baltijos obligacijų išėjimų riba – kiek turto gali išeiti iki fondo obligacijų ribos', ok: f => f.in_bal && f.lim && f.bal > 0, v: f => f.bal_x, d: v => v, g: v => v, e: f => f.bal_xe,
      tot: g => { const t = g.reduce((a, f) => a + f.aum, 0); return t ? g.reduce((a, f) => a + f.bal_xe, 0) / t : null; } },
    bu: { t: 'Baltijos obligacijos – kiek fondo obligacijų ribos jau išnaudota', ok: f => f.in_bal && f.lim && f.bal > 0, v: f => f.bal_sh / f.lim, d: v => 1 - v, g: v => 1 - v, e: f => f.bal,
      tot: g => { const t = g.reduce((a, f) => a + f.lim * f.aum, 0); return t ? g.reduce((a, f) => a + f.bal, 0) / t : null; } },
  };
  // Excel 3 spalvų skalė (raudona → geltona → žalia), vientisos spalvos – kad kopijuojant išliktų
  const mix = (a, b, t) => '#' + [0, 2, 4].map(i => Math.round(parseInt(a.substr(i, 2), 16) * (1 - t) + parseInt(b.substr(i, 2), 16) * t).toString(16).padStart(2, '0')).join('');
  const heat0 = g => { g = Math.max(0, Math.min(1, g)); return (g < .5 ? mix('F8696B', 'FFEB84', g * 2) : mix('FFEB84', '63BE7B', (g - .5) * 2)) + ';color:#1a1a1a'; };
  const ppf = v => v == null ? '–' : (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v * 100).toFixed(1).replace('.', ',') + ' p. p.';
  const qn = d => d.slice(0, 4) + ' ' + ['I', 'II', 'III', 'IV'][Math.floor((+d.slice(5, 7) - 1) / 3)] + ' ketv.';
  // tempas – vidutinis atstumo iki ribos sumažėjimas per ketvirtį per paskutinius (iki) 4 ketvirčius
  const eta = (ds, kk = 4) => {
    const L0 = ds.filter(x => x != null); if (L0.length < 2) return '–';
    const k = Math.min(kk, L0.length - 1), now = L0[L0.length - 1], sp = (L0[L0.length - 1 - k] - now) / k;
    if (now <= 1e-9) return 'riba pasiekta';
    if (sp <= 1e-9) return 'tolsta nuo ribos';
    const n = now / sp; return n > 40 ? '> 10 metų' : `~${n.toFixed(1).replace('.', ',')} ketv.`;
  };
  function trend(PS) {
    const M = TM[st.tm] || TM.ax; if (!TM[st.tm]) st.tm = 'ax';
    const last = new Map(); PS.forEach(p => p.funds.forEach(f => { if (M.ok(f)) last.set(f.code, f); }));
    const rows = [...last.values()].sort((a, b) => a.pillar.localeCompare(b.pillar) || a.name.localeCompare(b.name));
    const pick = `<div class="bar pfbar"><label>Rodiklis <select id="liqTM">${Object.entries(TM).map(([k, x]) => `<option value="${k}"${k === st.tm ? ' selected' : ''}>${x.t}</option>`).join('')}</select></label>
      <label>Spalvos <select id="liqHS"><option value="abs"${st.hs === 'rel' ? '' : ' selected'}>Pagal atstumą iki ribos</option><option value="rel"${st.hs === 'rel' ? ' selected' : ''}>Kontrastas: lentelės mažiausia – didžiausia</option></select></label></div>`;
    let o = `<section class="card" style="margin-top:12px"><h3 style="margin:0 0 6px;font-size:1em;font-weight:700">Kaip artėjame prie ribų: ${h(st.m)} fondai laike</h3>${pick}`;
    if (!rows.length) return o + `<p class="note">${h(st.m)} fondai šiam rodikliui duomenų neturi${st.tm[0] === 'a' ? ' (alternatyvių investicijų nėra)' : ''}.</p></section>`;
    const at = (p, c) => p.funds.find(f => f.code === c);
    const n0 = PS.length, yi = Math.max(0, n0 - 5);
    const gs = rows.flatMap(r => PS.map(p => { const f = at(p, r.code); return f && M.ok(f) ? M.g(M.v(f)) : null; })).filter(x => x != null);
    const g0 = Math.min(...gs), g1 = Math.max(...gs), REL = st.hs === 'rel' && g1 - g0 > 1e-6;
    const heat = g => heat0(REL ? (g - g0) / (g1 - g0) : g);
    const cell = (f, p) => {
      if (!f || !M.ok(f)) return '<td>–</td>';
      const v = M.v(f);
      return `<td style="background:${heat(M.g(v))}" title="${h(`${f.name} · ${p.date}\nAUM ${me(f.aum)}\n${st.tm === 'ax' ? `Gali išeiti ${me(f.alt_xe)}; alternatyvos ${me(f.alt)} (${pc(f.alt_sh)})` : st.tm === 'as' ? `Alternatyvos ${me(f.alt)}; gali išeiti ${pc(f.alt_x)}` : `Baltijos obl. ${me(f.bal)} (${pc(f.bal_sh)}), fondo riba ${pc(f.lim, 1)}; gali išeiti ${me(f.bal_xe)}`}`)}">${pc(v, 1)}</td>`;
    };
    const line = (lbl, vals, bold) => {
      const ds = vals.map(v => v == null ? null : M.d(v)), cur = vals[n0 - 1], q = vals[n0 - 2], y = vals[yi];
      return `<tr${bold ? ' style="font-weight:700"' : ''}><td class="l">${lbl}</td>${vals.map(v => v == null ? '<td>–</td>' : `<td style="background:${heat(M.g(v))}">${pc(v, 1)}</td>`).join('')}<td>${cur == null || q == null ? '–' : ppf(cur - q)}</td><td>${cur == null || y == null ? '–' : ppf(cur - y)}</td><td>${eta(ds, 1)}</td><td>${eta(ds)}</td></tr>`;
    };
    const head = ['Fondas', ...PS.map(p => qn(p.date)), 'Per ketvirtį', `Nuo ${qn(PS[yi].date)}`, 'Riba: paskut. ketv. tempu', `Riba: ${Math.min(4, n0 - 1)} ketv. tempu`];
    const body = rows.map(r => {
      const fs = PS.map(p => at(p, r.code)), vals = fs.map(f => f && M.ok(f) ? M.v(f) : null);
      const ds = vals.map(v => v == null ? null : M.d(v)), cur = vals[n0 - 1], q = vals[n0 - 2], y = vals[yi];
      return `<tr><td class="l">${h(r.name)}</td>${fs.map((f, i) => cell(f, PS[i])).join('')}<td>${cur == null || q == null ? '–' : ppf(cur - q)}</td><td>${cur == null || y == null ? '–' : ppf(cur - y)}</td><td>${eta(ds, 1)}</td><td>${eta(ds)}</td></tr>`;
    });
    const tots = ['II', 'III'].filter(pl => rows.some(r => r.pillar === pl)).map(pl => line(`Total ${pl} pakopa (svertinė)`, PS.map(p => { const g = p.funds.filter(f => f.pillar === pl && M.ok(f)); return g.length ? M.tot(g) : null; }), 1));
    // grafikas – po liniją kiekvienam fondui
    const C8 = ['#2f6fb3', '#c0392b', '#2e8b57', '#c9a227', '#8e44ad', '#16a085', '#d35400', '#7f8c8d', '#e84393', '#34495e'];
    const top = st.tm === 'as' ? Math.max(LIM * 1.15, ...rows.flatMap(r => PS.map(p => { const f = at(p, r.code); return f && M.ok(f) ? M.v(f) : 0; }))) : st.tm === 'bu' ? Math.max(1.1, ...rows.flatMap(r => PS.map(p => { const f = at(p, r.code); return f && M.ok(f) ? M.v(f) : 0; }))) : 1;
    const W = 900, H0 = 280, pl0 = 46, pr = 200, pt = 12, pb = 28, xs = i => pl0 + (n0 === 1 ? 0 : i * (W - pl0 - pr) / (n0 - 1)), ys = v => pt + (1 - v / top) * (H0 - pt - pb);
    let svg = `<svg viewBox="0 0 ${W} ${H0}" style="width:100%;max-width:${W}px;height:auto" role="img" aria-label="${h(M.t)}">`;
    const step = top > .6 ? .2 : .05;
    for (let g = 0; g <= top + 1e-9; g += step) svg += `<line x1="${pl0}" x2="${W - pr}" y1="${ys(g)}" y2="${ys(g)}" stroke="currentColor" stroke-opacity=".12"/><text x="${pl0 - 6}" y="${ys(g) + 4}" text-anchor="end" font-size="11" fill="currentColor" opacity=".7">${Math.round(g * 100)} %</text>`;
    const lim = st.tm === 'as' ? LIM : st.tm === 'bu' ? 1 : 0;
    svg += `<line x1="${pl0}" x2="${W - pr}" y1="${ys(lim)}" y2="${ys(lim)}" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/><text x="${pl0 + 4}" y="${ys(lim) - 5}" font-size="11" fill="#c0392b">riba</text>`;
    PS.forEach((p, i) => { svg += `<text x="${xs(i)}" y="${H0 - 8}" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">${p.date.slice(0, 7)}</text>`; });
    const ends = [];
    rows.forEach((r, k) => {
      const c = C8[k % C8.length], pts = PS.map((p, i) => { const f = at(p, r.code); return f && M.ok(f) ? [xs(i), ys(M.v(f)), M.v(f), p.date] : null; }).filter(Boolean);
      if (!pts.length) return;
      svg += `<polyline fill="none" stroke="${c}" stroke-width="2" points="${pts.map(q => q[0] + ',' + q[1]).join(' ')}"/>` + pts.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="${c}"><title>${h(r.name)} ${q[3]}: ${pc(q[2], 1)}</title></circle>`).join('');
      const e = pts[pts.length - 1]; ends.push([e[1], c, `${r.name.replace(/^\S+\s/, '')} ${pc(e[2], 1)}`, e[0]]);
    });
    ends.sort((a, b) => a[0] - b[0]); let yPrev = -1e9;
    ends.forEach(e => { const y = Math.max(e[0], yPrev + 13); yPrev = y; svg += `<text x="${e[3] + 8}" y="${y + 4}" font-size="11" fill="${e[1]}">${h(e[2])}</text>`; });
    svg += '</svg>';
    const expl = { ax: `100 % – riba toli, 0 % – alternatyvos jau sudaro ${pc(LIM, 0)}. Pvz. 80 % reiškia: išėjus 80 % fondo turto (alternatyvos neparduodamos), jų dalis pasiektų ${pc(LIM, 0)}.`,
      as: `Raudona linija – ${pc(LIM, 0)} riba.`, bx: '100 % – riba toli, 0 % – Baltijos obligacijos jau pasiekė fondo obligacijų ribą.', bu: '100 % – Baltijos obligacijų dalis lygi fondo obligacijų ribai.' }[st.tm];
    return o + `<div class="chart">${svg}</div>` + tbl(head, body.concat(tots))
      + `<p class="note">${expl} Spalva – tolydi skalė: ${REL ? `kontrasto režimas – raudoniausias langelis yra arčiausiai ribos šioje lentelėje, žaliausias – toliausiai; spalvos rodo skirtumus, ne absoliutų pavojų` : 'žalia – toli nuo ribos, geltona – pusiaukelėje, raudona – prie ribos'}. „Riba … tempu“ – po kiek ketvirčių riba būtų pasiekta, jei atstumas iki jos mažėtų tokiu pačiu greičiu kaip per paskutinį ketvirtį arba vidutiniškai per paskutinius ${Math.min(4, n0 - 1)} ketv. (tiesinė ekstrapoliacija, ne prognozė). Užvedus pelę ant langelio – eurai ir AUM.</p></section>`;
  }

  /* ---------- Pokyčiai ---------- */
  const BAD = '#FFC7CE;color:#5c0d14', GOOD = '#C6EFCE;color:#1d3b23';
  // v – pokytis; up – ar didėjimas blogai (artėjama prie ribos)
  const dc = (v, up, txt, eps = 5e-4) => v == null || Math.abs(v) < eps ? `<td>${txt}</td>` : `<td style="background:${(v > 0) === up ? BAD : GOOD}">${txt}</td>`;
  const sgn = (v, d = 1) => v == null ? '–' : (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v * 100).toFixed(d).replace('.', ',') + ' %';
  const dme = v => v == null ? '–' : (v > 0 ? '+' : v < 0 ? '−' : '') + me(Math.abs(v));
  function changes(PS, di) {
    const p = PS[di];
    if (!di) return `<section class="card" style="margin-top:12px"><h3 style="margin:0 0 6px;font-size:1em;font-weight:700">Pokyčiai</h3><p class="note">Ankstesnio ketvirčio duomenų nėra.</p></section>`;
    if (st.cb == null || st.cb >= di) st.cb = di - 1;
    const q = PS[st.cb], qi = st.cb;
    const opts = PS.slice(0, di).map((x, i) => `<option value="${i}"${i === qi ? ' selected' : ''}>${qn(x.date)}${i === di - 1 ? ' (ankstesnis)' : i === di - 4 ? ' (prieš metus)' : x.date === p.ref ? ' (prieš reformą)' : ''}</option>`).reverse().join('');
    let o = `<section class="card" style="margin-top:12px"><h3 style="margin:0 0 6px;font-size:1em;font-weight:700">Pokyčiai: ${qn(q.date)} → ${qn(p.date)}</h3>
      <div class="bar pfbar"><label>Palyginti su <select id="liqCB">${opts}</select></label></div>`;
    // plytelės – II pakopos visuma
    const tot = (pp0, pl) => { const g = pp0.funds.filter(f => f.pillar === pl && f.in_alt); const t = g.reduce((a, f) => a + f.aum, 0);
      return g.length ? { aum: t, alt: g.reduce((a, f) => a + f.alt, 0), xe: g.reduce((a, f) => a + f.alt_xe, 0) } : null; };
    const A = tot(q, 'II'), B = tot(p, 'II');
    const kpi = (lbl, a, b, fmt, dfmt, up) => {
      const d = a == null || b == null ? null : b - a, col = d == null || Math.abs(d) < 1e-9 ? 'var(--text-2)' : (d > 0) === up ? '#c0392b' : '#2e8b57';
      return `<div class="kpi"><span>${lbl}</span><b>${fmt(b)}</b><small>buvo ${fmt(a)} · <span style="color:${col};font-weight:700">${d == null ? '–' : dfmt(d, a)}</span></small></div>`; };
    if (A && B) {
      const mx = pp0 => pp0.funds.filter(f => f.in_alt).reduce((m, f) => !m || f.alt_sh > m.alt_sh ? f : m, null);
      const ma = mx(q), mb = mx(p);
      o += `<div class="kpis">`
        + kpi('II pakopa: gali išeiti iki 30 % ribos', A.xe / A.aum, B.xe / B.aum, v => pc(v, 1), d => ppf(d), false)
        + kpi('Tai eurais', A.xe, B.xe, me, (d, a) => `${dme(d)} (${sgn(d / a)})`, false)
        + kpi('II pakopos fondų turtas', A.aum, B.aum, me, (d, a) => `${dme(d)} (${sgn(d / a)})`, false)
        + kpi('II pakopos alternatyvos eurais', A.alt, B.alt, me, (d, a) => `${dme(d)} (${sgn(d / a)})`, true)
        + kpi(`Didžiausia alternatyvų dalis${mb ? ' – ' + h(mb.name.replace(/^\S+\s(pensija\s)?/, '')) : ''}`, ma && ma.alt_sh, mb && mb.alt_sh, v => pc(v, 1), d => ppf(d), true)
        + `</div>`;
    }
    // fondų lentelė
    const rows = p.funds.filter(f => f.in_alt || (f.in_bal && f.lim && f.bal > 0)).sort((a, b) => a.pillar.localeCompare(b.pillar) || a.name.localeCompare(b.name));
    const why = (a, b) => {
      if (!a.alt && !b.alt) return '–';
      const byAum = a.alt / b.aum - a.alt_sh, byAlt = (b.alt - a.alt) / b.aum;
      const main = Math.abs(byAum) >= Math.abs(byAlt) ? (b.aum < a.aum ? 'sumažėjo fondo turtas' : 'padidėjo fondo turtas') : (b.alt > a.alt ? 'padidėjo alternatyvų vertė' : 'sumažėjo alternatyvų vertė');
      return [byAum, byAlt, main];
    };
    const body = rows.map(f => {
      const a = q.funds.find(x => x.code === f.code);
      if (!a) return `<tr><td class="l">${h(f.name)}</td><td colspan="10" class="l">naujas fondas – ${qn(q.date)} duomenų nėra</td></tr>`;
      const w = f.in_alt ? why(a, f) : '–', alt = f.in_alt;
      return `<tr><td class="l">${h(f.name)}</td>`
        + dc(f.aum / a.aum - 1, false, sgn(f.aum / a.aum - 1), 5e-3)
        + (alt ? dc(a.alt ? f.alt / a.alt - 1 : null, true, a.alt ? sgn(f.alt / a.alt - 1) : '–', 5e-3) : '<td>–</td>')
        + (alt ? `<td>${pc(a.alt_sh)} → <b>${pc(f.alt_sh)}</b></td>` + dc(f.alt_sh - a.alt_sh, true, ppf(f.alt_sh - a.alt_sh)) : '<td>–</td><td>–</td>')
        + (Array.isArray(w) ? `<td class="l" title="${h(`Dėl fondo turto pokyčio: ${ppf(w[0])}\nDėl alternatyvų vertės pokyčio: ${ppf(w[1])}`)}">${w[2]} <span class="meta">(${ppf(Math.abs(w[0]) >= Math.abs(w[1]) ? w[0] : w[1])})</span></td>` : '<td>–</td>')
        + (alt ? `<td>${pc(a.alt_x, 1)} → <b>${pc(f.alt_x, 1)}</b></td>` : '<td>–</td>')
        + (f.in_bal && f.lim && f.bal > 0 && a.lim ? dc(f.bal_sh - a.bal_sh, true, ppf(f.bal_sh - a.bal_sh)) : '<td>–</td>')
        + '</tr>';
    });
    o += tbl(['Fondas', 'Fondo turtas', 'Alternatyvos, €', 'Alternatyvų dalis', 'Pokytis', 'Kodėl pasikeitė', 'Gali išeiti iki 30 %', 'Baltijos obl. dalis'], body)
      + `<p class="note">Raudona – arčiau ribos (pablogėjo), žalia – toliau nuo ribos. Alternatyvų dalies pokytis išskaidytas į dvi dalis: kiek jis atsirado vien dėl to, kad pasikeitė fondo turtas (alternatyvos tos pačios), ir kiek – dėl pačių alternatyvų vertės pokyčio (nauji įmokėjimai, perkainojimas ar išmokos – iš LB duomenų jų atskirti negalima). Abiejų dalių suma = visas pokytis; „Kodėl pasikeitė“ rodo didesniąją (užvedus pelę – abi).</p>`;
    // kas pasikeitė vardiniuose rodikliuose
    const cmp = qi === di - 1 ? p.cmp : (q.date === p.ref ? p.cmp_ref : null);
    if (cmp && cmp.length) o += det('Visi suvestiniai rodikliai (kaip Excel lape „Pokyčiai“)', tbl(['Rodiklis', qn(q.date), qn(p.date), 'Pokytis'], cmp.map(r => tr(r.map(h)))));
    return o + '</section>';
  }

  function render() {
    P = MG[st.m].periods;
    if (st.d == null || st.d >= P.length) st.d = P.length - 1;
    const p = P[st.d], F = p.funds, mode = st.mode, XL = mode === 'excel';
    const alt = F.filter(f => f.in_alt), bal = F.filter(f => f.in_bal && f.lim && f.bal > 0);
    const byC = Object.fromEntries(F.map(f => [f.code, f]));
    if (!byC[st.af] || !byC[st.af].in_alt) st.af = p.sel;
    if (!byC[st.bf] || !bal.includes(byC[st.bf])) st.bf = p.bal_sel || (bal[0] && bal[0].code);
    const sel = byC[p.sel];
    let o = `<h2 class="sec">${h(st.m)} fondų likvidumas: kiek turto gali išeiti iki ribų</h2>
      <p class="lead">Kiek turto gali išeiti ir kiek gali kristi rinkos, kol <b>alternatyvių investicijų</b> dalis pasiekia ${pc(LIM, 0)} ribą, o <b>Baltijos šalių obligacijų</b> dalis – fondo taisyklėse nustatytą obligacijų dalį.
      Tai ne prognozė, o konservatyvus testas: nelikvidi dalis laikoma nekintančia, išėjimai ir rinkų kritimas mažina tik likusį turtą. Neįtraukti likę neišmokėti įsipareigojimai (commitment) – jų duomenų nėra.</p>
      <div class="bar pfbar"><label>Valdytojas <select id="liqG">${MGRS.map(m => `<option${m === st.m ? ' selected' : ''}>${h(m)}</option>`).join('')}</select></label><label>Ketvirtis <select id="liqD">${P.map((x, i) => `<option value="${i}"${i === st.d ? ' selected' : ''}>${x.date}</option>`).join('')}</select></label>
      <label>Matricos formulė <select id="liqM"><option value="fix"${XL ? '' : ' selected'}>Pataisyta (pagrindinė)</option><option value="excel"${XL ? ' selected' : ''}>Kaip 2026-07-30 Excel faile</option></select></label></div>
      <p class="note">${XL
        ? 'Kaip Excel faile: A / (A + (T − A) × (1 − x − m)); x – ne alternatyvaus turto dalis, x ir m sudedami. Taip atkuriami 2026-07-30 laiško skaičiai (22,79 %), bet matricos riba nesutampa su lentelės „Išėjimo riba“.'
        : 'Pataisyta: A / (A + (T − A − x × T) × (1 − m)); x – viso fondo turto dalis (kaip lentelėje), rinkos kritimas taikomas po išėjimų likusiam turtui. Be rinkų kritimo riba sutampa su lentelės „Išėjimo riba“.'} Kodėl taisyta – „Metodika“ apačioje.</p>
      <section class="card"><b>Santrauka – ${p.date}</b><ul class="liqs">${p.summary.map(x => `<li>${h(x.replace(/^•\s*/, ''))}</li>`).join('')}</ul></section>`;

    // Fondai laike: vieno valdytojo visi fondai × ketvirčiai – kaip artėjama prie ribų (savininkas 2026-11-09)
    o += trend(P.slice(0, st.d + 1));

    // Alternatyvų lentelė
    const sum = g => { const t = g.reduce((a, f) => a + f.aum, 0), a = g.reduce((x, f) => x + f.alt, 0), xe = g.reduce((x, f) => x + f.alt_xe, 0); return [t, a, xe]; };
    const ii = alt.filter(f => f.pillar === 'II'), iii = alt.filter(f => f.pillar === 'III');
    const totRow = (lbl, g) => { const [t, a, xe] = sum(g); return tr([lbl, '', eu(t), eu(a), pc(t ? a / t : null), pc(t ? xe / t : null), eu(xe), ''], 1); };
    if (!alt.length) o += `<section class="card" style="margin-top:12px"><b>Alternatyvios investicijos ir ${pc(LIM, 0)} riba</b><p class="note">${h(st.m)} fondai ${p.date} alternatyvių (nelistinguotų privataus kapitalo, NT, infrastruktūros ir pan.) investicijų neturi.</p></section>`;
    else {
    o += `<section class="card" style="margin-top:12px"><b>Alternatyvios investicijos ir ${pc(LIM, 0)} riba</b>`
      + tbl(['Fondas', 'Pakopa', 'AUM', 'Alternatyvos, €', 'Alternatyvos, %', `Išėjimo riba iki ${pc(LIM, 0)}, %`, 'Išėjimo riba, €', 'Dalyvių pokytis per 2 ketv.'],
        alt.map(f => `<tr><td class="l">${h(f.name)}${f.code === p.sel ? ' ★' : ''}</td><td>${f.pillar}</td><td>${eu(f.aum)}</td><td${pk('alt', f)}>${eu(f.alt)}</td><td${pk('alt', f, ` style="background:${cAlt(f.alt_sh)}"`)}>${pc(f.alt_sh)}</td><td>${pc(f.alt_x)}</td><td>${eu(f.alt_xe)}</td><td>${pc(f.part_chg, 1)}</td></tr>`)
          .concat([totRow('Total II pakopa', ii), ...(iii.length ? [totRow('Total III pakopa', iii)] : []), totRow('Total visi analizuojami', alt)]))
      + `<p class="note">Išėjimo riba = 1 − alternatyvų dalis ÷ ${pc(LIM, 0)}. Bendra riba – svertinė eurais (Σ išėjimo ribų € ÷ Σ AUM); paprastas fondų procentų vidurkis būtų ${pc(p.ii.avg_wrong)}, bet jis netaikomas – mažam ir dideliam fondui suteiktų vienodą svorį. ★ – matricos fondas: ${h(p.sel_reason)}. AUM – LB grynieji aktyvai.</p>`;
    o += tbl(['Fondas', 'Riba prie 0 % (matrica)', 'Riba prie −10 % (matrica)', '50 % išėjimų / −10 % rinkos', 'Buferis iki 30 %', 'Tas pats kitu būdu*'],
      alt.map(f => {
        const v = share(f.alt, f.aum, .5, .1, mode), v2 = share(f.alt, f.aum, .5, .1, XL ? 'fix' : 'excel');
        return `<tr><td class="l">${h(f.name)}</td><td>${gx(hit(f.alt, f.aum, LIM, 0, mode))}</td><td>${gx(hit(f.alt, f.aum, LIM, .1, mode))}</td><td style="background:${cAlt(v)}">${pc(v)}</td><td>${((LIM - v) * 100).toFixed(2).replace('.', ',')} p. p.</td><td>${pc(v2)}</td></tr>`;
      }))
      + `<p class="note">* ${XL ? 'pataisyta formule' : 'kaip 2026-07-30 Excel faile'}. Matricos riba – mažiausias 10 p. p. žingsnio stulpelis, kuriame dalis ≥ ${pc(LIM, 0)}.</p>`;
    const af = byC[st.af];
    o += `<div class="bar pfbar" style="margin-top:10px"><label>Matrica fondui ${fsel('liqAF', alt, st.af)}</label></div>
      <p class="meta">${h(af.name)}: alternatyvų dalis, kai A = ${eu(af.alt)}, AUM = ${eu(af.aum)}. Spalvos: žalia &lt; 25 %, geltona 25–30 %, raudona ≥ 30 %.</p>`
      + matrix(af.alt, af.aum, cAlt, mode)
      + det('Alternatyvios pozicijos', alt.some(f => f.altpos.length) ? tbl(['Fondas', 'Pozicija', 'Vertė', 'Dalis'], alt.flatMap(f => f.altpos.map(([n, v]) => tr([h(f.name), h(n), eu(v), pc(v / f.aum)])))) : '<p class="note">Pozicijų sąrašas – tik 2 paskutiniams ketvirčiams.</p>')
      + '</section>';
    }

    // Baltijos obligacijos
    o += `<section class="card" style="margin-top:12px"><b>Baltijos šalių obligacijos ir fondo obligacijų riba</b>`
      + tbl(['Fondas', 'Pakopa', 'AUM', 'Baltijos obligacijos, €', 'Baltijos obligacijos, %', 'Fondo obligacijų riba', 'Išėjimų riba, %', 'Išėjimų riba, €', 'Visos obligacijos, €', 'Prie 0 %', 'Prie −10 %', '50 % / −10 %'],
        F.filter(f => f.in_bal).map(f => {
          const ok = f.lim, v = ok ? share(f.bal, f.aum, .5, .1, mode) : null;
          return `<tr><td class="l">${h(f.name)}</td><td>${f.pillar}</td><td>${eu(f.aum)}</td><td${pk('bal', f)}>${eu(f.bal)}</td><td${pk('bal', f, ok ? ` style="background:${cBal(f.bal_sh, f.lim)}"` : '')}>${pc(f.bal_sh)}</td><td>${pc(f.lim, 1)}</td><td>${pc(f.bal_x)}</td><td>${eu(f.bal_xe)}</td><td>${eu(f.bonds)}</td>
            <td>${ok && f.bal ? gx(hit(f.bal, f.aum, f.lim, 0, mode)) : '–'}</td><td>${ok && f.bal ? gx(hit(f.bal, f.aum, f.lim, .1, mode)) : '–'}</td><td${v != null ? ` style="background:${cBal(v, f.lim)}"` : ''}>${pc(v)}</td></tr>`;
        }).concat(['II', 'III'].filter(pl => p.bal_tot && p.bal_tot[pl]).map(pl => { const g = p.bal_tot[pl];
          return tr([`Total ${pl} pakopa`, '', eu(g.aum), eu(g.bal), pc(g.bal / g.aum), '', pc(g.xe / g.aum), eu(g.xe), '', '', '', ''], 1); })))
      + '<p class="note">Įtraukta: LB „Skolos VP“ pozicijos, kurių emitento šalis LT, LV ar EE. Neįtraukta: akcijos, fondai, pinigai, ne Baltijos obligacijos. Išėjimų riba = 1 − Baltijos obligacijų dalis ÷ fondo riba. Spalva – pagal fondo ribą: žalia &lt; 90 % ribos, geltona 90–100 %, raudona ≥ ribos.</p>';
    const bf = byC[st.bf];
    if (bf) o += `<div class="bar pfbar"><label>Matrica fondui ${fsel('liqBF', bal, st.bf)}</label></div>
      <p class="meta">${h(bf.name)}: Baltijos obligacijų dalis (riba ${pc(bf.lim, 1)}), B = ${eu(bf.bal)}, AUM = ${eu(bf.aum)}. Numatytasis – fondas arčiausiai ribos.</p>`
      + matrix(bf.bal, bf.aum, v => cBal(v, bf.lim), mode)
      + det('Baltijos obligacijų pozicijos', !F.some(f => f.balpos.length) ? '<p class="note">Pozicijų sąrašas – tik 2 paskutiniams ketvirčiams.</p>' : tbl(['Fondas', 'Pozicija', 'Vertė', 'Dalis'], F.filter(f => f.in_bal).flatMap(f => f.balpos.map(([n, v]) => tr([h(f.name), h(n), eu(v), pc(v / f.aum)])))));
    o += '</section>';

    // Istorija: lentelė + grafikas (visi ketvirčiai iki pasirinkto)
    const HS = (MG[st.m].hist || []).filter(x => x.date <= p.date);
    if (HS.length > 1) {
      const ser = [['alt_max', 'Alternatyvų dalis, maks.', '#c9a227'], ['ii_x', 'II pakopos išėjimo riba iki 30 %', '#2f6fb3'], ['c5010', 'Matricos fondas: 50 % / −10 %', '#c0392b'], ['bal_ii_x', 'Baltijos obl. išėjimų riba, II pakopa', '#2e8b57']];
      const W = 900, H0 = 260, pl = 46, pr = 34, pt = 12, pb = 28, xs = i => pl + (HS.length === 1 ? 0 : i * (W - pl - pr) / (HS.length - 1)), ys = v => pt + (1 - v) * (H0 - pt - pb);
      let svg = `<svg viewBox="0 0 ${W} ${H0}" style="width:100%;max-width:${W}px;height:auto" role="img" aria-label="Likvidumo rodikliai laike">`;
      for (let g = 0; g <= 1.0001; g += .2) svg += `<line x1="${pl}" x2="${W - pr}" y1="${ys(g)}" y2="${ys(g)}" stroke="currentColor" stroke-opacity=".12"/><text x="${pl - 6}" y="${ys(g) + 4}" text-anchor="end" font-size="11" fill="currentColor" opacity=".7">${Math.round(g * 100)} %</text>`;
      svg += `<line x1="${pl}" x2="${W - pr}" y1="${ys(LIM)}" y2="${ys(LIM)}" stroke="#c0392b" stroke-dasharray="4 4" stroke-opacity=".6"/>`;
      HS.forEach((x, i) => { svg += `<text x="${xs(i)}" y="${H0 - 8}" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">${x.date.slice(0, 7)}</text>`; });
      ser.forEach(([k, , c]) => {
        const pts = HS.map((x, i) => x[k] == null ? null : [xs(i), ys(x[k])]).filter(Boolean);
        svg += `<polyline fill="none" stroke="${c}" stroke-width="2" points="${pts.map(q => q.join(',')).join(' ')}"/>` + pts.map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="${c}"/>`).join('');
      });
      svg += '</svg>';
      o += `<section class="card" style="margin-top:12px"><h3 style="margin:0 0 6px;font-size:1em;font-weight:700">Rodikliai laike</h3><div class="chart" id="liqHC">${svg}</div>
        <div class="legend">${ser.map(([, l, c]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')}<span><i style="background:#c0392b;opacity:.5"></i>${pc(LIM, 0)} riba</span></div>`
        + tbl(['Data', 'Alternatyvų dalis, min.–maks.', 'Didžiausia dalis – fondas', 'II pakopos AUM', 'II pakopos alternatyvos', 'II pakopos išėjimo riba, %', 'Išėjimo riba, €', 'Jautriausias fondas', 'Matricos fondas', '50 % / −10 % (pataisyta)', '50 % / −10 % (kaip Excel)', 'Baltijos obl. dalis, II', 'Baltijos obl. išėjimų riba, II', 'Arčiausiai obl. ribos'],
          HS.map(x => tr([x.date, `${pc(x.alt_min)} – ${pc(x.alt_max)}`, h(x.alt_max_f), eu(x.ii_aum), eu(x.ii_alt), pc(x.ii_x), eu(x.ii_xe), h(x.sens), h(x.sel), pc(x.c5010), pc(x.c5010_xl), pc(x.bal_ii), pc(x.bal_ii_x), `${h(x.bal_min_f || '–')} ${pc(x.bal_min_x)}`])))
        + '<p class="note">Matricos fondas kiekvieną ketvirtį parenkamas iš naujo (daugiausia dalyvių netekęs II pakopos fondas), todėl 50 % / −10 % eilutė gali būti apie skirtingus fondus.</p></section>';
    }

    // Pokyčiai – perdaryta į rodiklių plyteles + vieną fondų lentelę (savininkas 2026-11-09: „labai neįdomu ir nepatogu skaityti“)
    o += changes(P, st.d);

    // Išimtys
    o += `<section class="card" style="margin-top:12px"><b>Duomenų patikros ir išimtys (${p.exc.length})</b>`
      + (p.exc.length ? tbl(['Tipas', 'Fondas', 'Pavadinimas', 'Vertė', 'Pastaba'], p.exc.map(r => tr([h(r[0]), h(r[1]), h(r[2]), r[3] == null ? '–' : eu(r[3]), h(r[4])]))) : '<p class="note">Išimčių nenustatyta.</p>')
      + '<p class="note">Tikrinama: pozicijų suma ≈ grynieji aktyvai (±2 %), alternatyvos ≤ AUM, Baltijos ≤ visos obligacijos, neigiamos ir trūkstamos vertės, nauji fondai ir instrumentai. „Galimai alternatyvi“ pozicija į skaičiavimą neįtraukiama, kol žmogus nepatvirtina (data/liq_alternatives.csv).</p></section>';

    // Laiškai, metodika, konfigūracija
    const letter = (id, lines) => `<p><button type="button" class="btn" data-copy="${id}">Kopijuoti</button></p><pre class="liqp" id="${id}">${h(lines.join('\n'))}</pre>`;
    o += `<section class="card" style="margin-top:12px">`
      + (p.la.length ? det('Laiško projektas A – išsamesnis', letter('liqLA', p.la)) + det('Laiško projektas B – trumpesnis vadovybinis', letter('liqLB', p.lb))
        : `<p class="note">Laiško projektai – 2 paskutiniams ketvirčiams${alt.length ? '' : ' ir tik valdytojams, turintiems alternatyvių investicijų'}.</p>`)
      + det('Metodika ir „įskaitant likusius įsipareigojimus“ logika', `<pre class="liqp">${h(LIQ.method.join('\n'))}</pre>`)
      + det('Konfigūracija: alternatyvų sąrašas ir obligacijų ribos',
        tbl(['Pavadinimas', 'Alternatyva?', 'Rūšis', 'Šaltinis', 'Peržiūrėta'], LIQ.alts.map(a => tr([h(a.name), a.is_alt === '1' ? 'taip' : 'NE', h(a.cls), h(a.src), h(a.rev)])))
        + tbl(['Fondas', 'Obligacijų riba, %', 'Šaltinis', 'Peržiūrėta'], MG[st.m].limits.map(a => tr([h(a.name), a.lim == null ? 'nėra (LB: rizikingų iki 100 %)' : (Math.round(a.lim * 10) / 10).toString().replace('.', ','), h(a.src), h(a.rev)]))))
      + '<p class="note">Excel su visomis lentelėmis ir spalvotomis matricomis bei laiškai A/B ateina su vakariniu laišku, kai LB paskelbia naujus portfelius. Laiškas kolegoms automatiškai nesiunčiamas.</p></section>';
    box.innerHTML = o;
    const hc = box.querySelector('#liqHC'); if (hc) hc._legend = [['Alternatyvų dalis, maks.', '#c9a227'], ['II pakopos išėjimo riba iki 30 %', '#2f6fb3'], ['Matricos fondas: 50 % / −10 %', '#c0392b'], ['Baltijos obl. išėjimų riba, II pakopa', '#2e8b57']].map(([l, c]) => ({ l, c }));
    box.querySelectorAll('.liqk').forEach(td => td.addEventListener('click', () => {
      const row = td.closest('tr'), nx = row.nextElementSibling, key = td.dataset.k + td.dataset.c;
      if (nx && nx.classList.contains('liqx')) { const same = nx.dataset.key === key; nx.remove(); if (same) return; }
      const f = byC[td.dataset.c], k = td.dataset.k, L0 = posOf(k, f);
      const g = k === 'bal' ? [['Vyriausybių obligacijos', L0.filter(([n]) => isGov(n))], ['Įmonių obligacijos', L0.filter(([n]) => !isGov(n))]] : [['', L0]];
      const body = g.filter(([, l]) => l.length).map(([t, l]) => (t ? `<tr><td class="l" colspan="3"><b>${t}: ${eu(l.reduce((a, [, v]) => a + v, 0))} (${pc(l.reduce((a, [, v]) => a + v, 0) / f.aum)})</b></td></tr>` : '')
        + l.map(([n, v]) => `<tr><td class="l">${h(n)}</td><td>${eu(v)}</td><td>${pc(v / f.aum)}</td></tr>`).join('')).join('');
      const x = document.createElement('tr'); x.className = 'liqx'; x.dataset.key = key;
      x.innerHTML = `<td colspan="${row.children.length}" class="l"><b>${h(f.name)} – ${k === 'alt' ? 'alternatyvios investicijos' : 'Baltijos obligacijos'} (${p.date})</b>
        <div class="fmore"><table class="liqxt"><thead><tr><th class="l">Pozicija</th><th>Vertė</th><th>Dalis fonde</th></tr></thead><tbody>${body}</tbody></table></div></td>`;
      row.after(x);
    }));
    box.querySelector('#liqG').addEventListener('change', e => { st.m = e.target.value; st.d = null; st.cb = null; st.af = st.bf = null; save(); render(); });
    box.querySelector('#liqD').addEventListener('change', e => { st.d = +e.target.value; st.cb = null; render(); });
    box.querySelector('#liqM').addEventListener('change', e => { st.mode = e.target.value; save(); render(); });
    const af0 = box.querySelector('#liqAF'); if (af0) af0.addEventListener('change', e => { st.af = e.target.value; render(); });
    const tm0 = box.querySelector('#liqTM'); if (tm0) tm0.addEventListener('change', e => { st.tm = e.target.value; save(); render(); });
    const cb0 = box.querySelector('#liqCB'); if (cb0) cb0.addEventListener('change', e => { st.cb = +e.target.value; render(); });
    const hs0 = box.querySelector('#liqHS'); if (hs0) hs0.addEventListener('change', e => { st.hs = e.target.value; save(); render(); });
    const b = box.querySelector('#liqBF'); if (b) b.addEventListener('change', e => { st.bf = e.target.value; render(); });
    box.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => {
      const t = document.getElementById(btn.dataset.copy).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { btn.textContent = 'Nukopijuota'; }, () => { btn.textContent = 'Nepavyko – pažymėkite tekstą'; });
    }));
  }
  render();
})();
