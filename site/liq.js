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
  const st = { m: 'SEB', d: null, mode: 'fix', af: null, bf: null };
  try { Object.assign(st, JSON.parse(localStorage.getItem('liqST') || '{}')); } catch (e) { /* be atminties */ }
  if (!MG[st.m]) st.m = MGRS[0];
  const save = () => { try { localStorage.setItem('liqST', JSON.stringify({ mode: st.mode, m: st.m })); } catch (e) { /* */ } };
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
      o += `<section class="card" style="margin-top:12px"><b>Rodikliai laike</b>${svg}
        <div class="legend">${ser.map(([, l, c]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')}<span><i style="background:#c0392b;opacity:.5"></i>${pc(LIM, 0)} riba</span></div>`
        + tbl(['Data', 'Alternatyvų dalis, min.–maks.', 'Didžiausia dalis – fondas', 'II pakopos AUM', 'II pakopos alternatyvos', 'II pakopos išėjimo riba, %', 'Išėjimo riba, €', 'Jautriausias fondas', 'Matricos fondas', '50 % / −10 % (pataisyta)', '50 % / −10 % (kaip Excel)', 'Baltijos obl. dalis, II', 'Baltijos obl. išėjimų riba, II', 'Arčiausiai obl. ribos'],
          HS.map(x => tr([x.date, `${pc(x.alt_min)} – ${pc(x.alt_max)}`, h(x.alt_max_f), eu(x.ii_aum), eu(x.ii_alt), pc(x.ii_x), eu(x.ii_xe), h(x.sens), h(x.sel), pc(x.c5010), pc(x.c5010_xl), pc(x.bal_ii), pc(x.bal_ii_x), `${h(x.bal_min_f || '–')} ${pc(x.bal_min_x)}`])))
        + '<p class="note">Matricos fondas kiekvieną ketvirtį parenkamas iš naujo (daugiausia dalyvių netekęs II pakopos fondas), todėl 50 % / −10 % eilutė gali būti apie skirtingus fondus.</p></section>';
    }

    // Pokyčiai
    o += `<section class="card" style="margin-top:12px"><b>Pokyčiai</b>`
      + (p.cmp.length ? tbl(['Rodiklis', `Ankstesnis (${p.prev})`, `Naujas (${p.date})`, 'Pokytis'], p.cmp.map(r => tr(r.map(h)))) : '<p class="note">Ankstesnio ketvirčio duomenų nėra.</p>')
      + (p.cmp_ref.length ? `<p class="meta" style="margin-top:8px">Nuo ${p.ref} (prieš reformą)</p>` + tbl(['Rodiklis', p.ref, p.date, 'Pokytis'], p.cmp_ref.map(r => tr(r.map(h)))) : '')
      + (p.dec.length ? `<p class="meta" style="margin-top:8px">Alternatyvų dalies pokytis ${p.prev} → ${p.date}: kiek dėl alternatyvų vertės, kiek dėl fondo turto pokyčio</p>`
        + tbl(['Fondas', 'Dalies pokytis', 'Dėl alternatyvų vertės (€)', 'Dėl AUM pokyčio', 'Alternatyvos, € pokytis', 'AUM pokytis'], p.dec.map(r => tr([h(r.name), pc(r.d_sh), pc(r.by_alt), pc(r.by_aum), eu(r.d_alt), pc(r.d_aum, 1)])))
        + '<p class="note">Didesnė procentinė dalis dar nereiškia papildomų investicijų – ji gali kilti vien dėl mažėjančio AUM. Alternatyvų vertės pokytis € gali būti ir nauji įmokėjimai (drawdown), ir perkainojimas ar išmokos.</p>' : '')
      + '</section>';

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
    box.querySelector('#liqG').addEventListener('change', e => { st.m = e.target.value; st.d = null; st.af = st.bf = null; save(); render(); });
    box.querySelector('#liqD').addEventListener('change', e => { st.d = +e.target.value; render(); });
    box.querySelector('#liqM').addEventListener('change', e => { st.mode = e.target.value; save(); render(); });
    const af0 = box.querySelector('#liqAF'); if (af0) af0.addEventListener('change', e => { st.af = e.target.value; render(); });
    const b = box.querySelector('#liqBF'); if (b) b.addEventListener('change', e => { st.bf = e.target.value; render(); });
    box.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => {
      const t = document.getElementById(btn.dataset.copy).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { btn.textContent = 'Nukopijuota'; }, () => { btn.textContent = 'Nepavyko – pažymėkite tekstą'; });
    }));
  }
  render();
})();
