/* ---------- Naujienos apie pensijas (savininkas 2026-10-21: „skiltis su nuorodomis į naujienų straipsnius apie pensijų sistemą
   LT, LV, EE … archyvuoti, kad būtų galima analizuoti temos aktualumą žiniasklaidoje ir valdžioje“) ----------
   Duomenys – docs/data_news.js iš data/news.csv (tools/fetch_news.py kasdien: Google News ir leidinių RSS, atranka raktažodžiais).
   NEWS = [[data, šalis, leidinys, antraštė, aprašas, nuoroda, temos „a;b“], …] – naujausi pirmi. */
addStrings({ nw: {
  title: 'Pension news', lead: 'News articles about the pension systems of Lithuania, Latvia and Estonia, collected automatically every day from Google News and news sites’ RSS feeds and kept in an archive. Click a headline to open the full article. The chart shows how often the topic appears in the media.',
  all: 'All', search: 'Search headlines…', more: n => `Show ${n} more`, none: 'No articles for this choice.', count: (n, a) => `${n} of ${a} articles`,
  chart: 'Articles per month', chartQ: 'Articles per quarter', xl: 'Excel (for analysis)', latest: 'Latest pension news', toAll: 'All news →',
  t: { reform: 'Reform, exits', tax: 'Taxes, reliefs', state: 'State incentive', returns: 'Returns', fees: 'Fees', payout: 'Payouts, annuities', politics: 'Government, politics' },
  c: { LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia' },
  note: 'Sources: Google News search (headline, outlet and date; the link opens through news.google.com) and RSS feeds of LRT, 15min, Lrytas, the Ministry of Social Security and Labour, ERR, Postimees, Äripäev, LSM, Dienas Bizness, Diena and TVNET (with a short description). Articles are selected by keywords (pension funds, pillar II/III, sammas, līmenis…), so a few unrelated ones may slip in. History before October 2026 – Google News month by month (headlines only). The archive is only added to.',
  xh: ['Date', 'Country', 'Outlet', 'Headline', 'Description', 'Link', 'Topics'] } }, { nw: {
  title: 'Naujienos apie pensijas', lead: 'Naujienų straipsniai apie Lietuvos, Latvijos ir Estijos pensijų sistemas – kasdien automatiškai renkami iš Google News ir leidinių RSS srautų ir kaupiami archyve. Paspaudus antraštę atsidaro visas straipsnis. Grafikas rodo, kaip dažnai tema minima žiniasklaidoje.',
  all: 'Visos', search: 'Ieškoti antraštėse…', more: n => `Rodyti dar ${n}`, none: 'Šiam pasirinkimui straipsnių nėra.', count: (n, a) => `${n} iš ${a} straipsnių`,
  chart: 'Straipsniai per mėnesį', chartQ: 'Straipsniai per ketvirtį', xl: 'Excel (analizei)', latest: 'Naujausios naujienos apie pensijas', toAll: 'Visos naujienos →',
  t: { reform: 'Reforma, išėjimai', tax: 'Mokesčiai, lengvatos', state: 'Valstybės paskata', returns: 'Grąža', fees: 'Valdymo mokesčiai', payout: 'Išmokos, anuitetai', politics: 'Valdžia, politika' },
  c: { LT: 'Lietuva', LV: 'Latvija', EE: 'Estija' },
  note: 'Šaltiniai: Google News paieška (antraštė, leidinys ir data; nuoroda atsidaro per news.google.com) ir LRT, 15min, Lrytas, Socialinės apsaugos ir darbo ministerijos, ERR, Postimees, Äripäev, LSM, Dienas Bizness, Diena ir TVNET RSS srautai (su trumpu aprašu). Straipsniai atrenkami pagal raktažodžius (pensijų fondai, II/III pakopa, sammas, līmenis…), todėl gali pasitaikyti nesusijusių. Istorija iki 2026 m. spalio – Google News pagal mėnesius (tik antraštės). Archyvas tik papildomas.',
  xh: ['Data', 'Šalis', 'Leidinys', 'Antraštė', 'Aprašas', 'Nuoroda', 'Temos'] } });

const NWS = { c: '', t: '', q: '', n: 30 };
const nwTopic = k => T().nw.t[k] || k;
function nwRows() {
  if (typeof NEWS === 'undefined' || !NEWS) return [];
  const q = NWS.q.trim().toLowerCase();
  return NEWS.filter(r => (!NWS.c || r[1] === NWS.c) && (!NWS.t || r[6].split(';').includes(NWS.t)) && (!q || (r[3] + ' ' + r[4] + ' ' + r[2]).toLowerCase().includes(q)));
}
const nwCard = r => `<article class="nwc"><div class="meta"><span class="flag">${r[1]}</span> ${hEsc(r[0])} · ${hEsc(r[2] || '')}</div>`
  + `<h3><a href="${hEsc(r[5])}" target="_blank" rel="noopener noreferrer">${hEsc(r[3])}</a></h3>${r[4] ? `<p>${hEsc(r[4].length > 320 ? r[4].slice(0, 317) + '…' : r[4])}</p>` : ''}`
  + `${r[6] ? `<div class="tags">${r[6].split(';').filter(Boolean).map(x => `<button type="button" class="chip" data-nwt="${hEsc(x)}">${hEsc(nwTopic(x))}</button>`).join('')}</div>` : ''}</article>`;
function renderNews() {
  const t = T().nw, box = document.getElementById('nwBody');
  const lt = document.getElementById('tdNews');
  if (lt) lt.innerHTML = typeof NEWS !== 'undefined' && NEWS && NEWS.length ? `<h2>${t.latest}</h2>${NEWS.slice(0, 5).map(nwCard).join('')}<p class="more"><a href="#" data-gonw="1">${t.toAll}</a></p>` : '';
  if (!box) return;
  document.getElementById('nwTitle').textContent = t.title; document.getElementById('nwLead').textContent = t.lead;
  if (typeof NEWS === 'undefined' || !NEWS || !NEWS.length) { box.innerHTML = `<p class="note">${t.none}</p>`; return; }
  const tops = [...new Set(NEWS.flatMap(r => r[6].split(';')).filter(Boolean))].sort((a, b) => (t.t[a] ? 0 : 1) - (t.t[b] ? 0 : 1) || a.localeCompare(b));
  const chip = (k, v, l) => `<button type="button" class="chip" data-nw="${k}" data-v="${hEsc(v)}" aria-pressed="${NWS[k] === v}">${hEsc(l)}</button>`;
  document.getElementById('nwBar').innerHTML = `<div class="bar nwbar"><div class="chips">${chip('c', '', t.all)}${['LT', 'LV', 'EE'].map(c => chip('c', c, t.c[c])).join('')}</div>`
    + `<input type="search" id="nwQ" placeholder="${t.search}" value="${hEsc(NWS.q)}"><button type="button" class="btn xl" id="nwXl">${t.xl}</button>`
    + `<div class="chips">${chip('t', '', t.all)}${tops.map(x => chip('t', x, nwTopic(x))).join('')}</div></div>`;
  nwList();
}
function nwList() {
  const t = T().nw, rs = nwRows(), box = document.getElementById('nwBody');
  box.innerHTML = `<section class="card"><h2>${rs.length && dayOf(rs[rs.length - 1][0]) < dayOf(rs[0][0]) - 900 ? t.chartQ : t.chart}</h2><div class="chart" id="nwCh"></div></section>`
    + `<section class="card"><p class="meta">${t.count(rs.length, NEWS.length)}</p>${rs.length ? rs.slice(0, NWS.n).map(nwCard).join('') : `<p class="note">${t.none}</p>`}`
    + `${rs.length > NWS.n ? `<p><button type="button" class="btn" id="nwMore">${t.more(Math.min(30, rs.length - NWS.n))}</button></p>` : ''}<p class="note">${t.note}</p></section>`;
  nwChart(document.getElementById('nwCh'), rs);
}
function nwChart(el, rs) {
  if (!rs.length) { el.innerHTML = ''; return; }
  const t = T().nw, d0 = dayOf(rs[rs.length - 1][0]), d1 = dayOf(rs[0][0]), byQ = d1 - d0 > 900;
  const key = s => byQ ? `${s.slice(0, 4)}-${Math.floor((+s.slice(5, 7) - 1) / 3) + 1}` : s.slice(0, 7);
  const keys = []; for (let y = +rs[rs.length - 1][0].slice(0, 4), m = +rs[rs.length - 1][0].slice(5, 7); `${y}-${String(m).padStart(2, '0')}` <= rs[0][0].slice(0, 7); m = m % 12 + 1, y += m === 1 ? 1 : 0) { const k = key(`${y}-${String(m).padStart(2, '0')}`); if (!keys.includes(k)) keys.push(k); }
  const cnt = {}; rs.forEach(r => { const k = key(r[0]); cnt[k] = cnt[k] || { LT: 0, LV: 0, EE: 0 }; cnt[k][r[1]]++; });
  const W = el.clientWidth || 600, H = 200, m = { l: 34, r: 8, t: 8, b: 24 }, n = keys.length, bw = (W - m.l - m.r) / n;
  const hi = Math.max(1, ...keys.map(k => cnt[k] ? cnt[k].LT + cnt[k].LV + cnt[k].EE : 0)) * 1.08, Y = v => m.t + (hi - v) / hi * (H - m.t - m.b);
  const col = { LT: 'var(--s5, #2f8f5b)', LV: '#c9765a', EE: '#2b8de0' };
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${hEsc(t.chart)}">`;
  niceTicks(0, hi, 4).forEach(v => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--grid)" stroke-dasharray="2 3"/><text x="${m.l - 5}" y="${Y(v) + 4}" text-anchor="end" fill="var(--text-3)" font-size="11">${num(v, 0)}</text>`; });
  let lastX = -1e9;
  keys.forEach((k, i) => { let y = 0; const c = cnt[k] || {}; ['LT', 'LV', 'EE'].forEach(cc => { const v = c[cc] || 0; if (!v) return;
      s += `<rect x="${m.l + i * bw + bw * 0.1}" y="${Y(y + v)}" width="${Math.max(1, bw * 0.8)}" height="${Y(y) - Y(y + v)}" fill="${col[cc]}"><title>${k} · ${t.c[cc]}: ${v}</title></rect>`; y += v; });
    const lab = byQ ? (k.endsWith('-1') ? k.slice(0, 4) : '') : (k.endsWith('-01') || n < 14 ? (n < 14 ? `${T().monShort[+k.slice(5) - 1]}` : k.slice(0, 4)) : '');
    const x = m.l + i * bw; if (lab && x - lastX > 34) { s += `<text x="${x}" y="${H - 6}" fill="var(--text-3)" font-size="11">${lab}</text>`; lastX = x; } });
  el.innerHTML = s + '</svg>' + `<div class="chips" style="margin-top:4px">${['LT', 'LV', 'EE'].map(c => `<span class="chip"><span style="display:inline-block;width:9px;height:9px;border-radius:2px;background:${col[c]};margin-right:5px"></span>${t.c[c]}</span>`).join('')}</div>`;
}
async function nwExcel(b) {
  const t = T().nw, rs = nwRows(), wb = XL.book(), o = b.textContent; b.disabled = true; b.textContent = '…';
  try {
    XL.sheet(wb, t.title.slice(0, 31), [[{ v: t.title, s: 'title' }], [{ v: t.note, s: 'note' }], [], t.xh.map(h => ({ v: h, s: 'hdr' })),
      ...rs.map(r => [{ v: dayOf(r[0]) + 25569, z: 'yyyy-mm-dd' }, r[1], r[2], r[3], r[4], { v: r[5], l: r[5] }, r[6].split(';').filter(Boolean).map(nwTopic).join(', ')])], { cols: [12, 7, 18, 70, 70, 40, 30], freeze: { r: 4 } });
    await XL.save(wb, `${lang === 'lt' ? 'pensiju-naujienos' : 'pension-news'}.xlsx`); b.textContent = '✓';
  } catch (e) { console.error(e); b.textContent = '!'; }
  setTimeout(() => { b.textContent = o; b.disabled = false; }, 1500);
}
document.addEventListener('click', e => {
  const c = e.target.closest('[data-nw]'); if (c) { NWS[c.dataset.nw] = c.dataset.v; NWS.n = 30; renderNews(); return; }
  const tg = e.target.closest('[data-nwt]'); if (tg) { NWS.t = tg.dataset.nwt; NWS.n = 30; if (!document.getElementById('nwBody').offsetParent) showTab(paneOf(document.getElementById('nwTitle')), true); renderNews(); return; }
  if (e.target.closest('#nwMore')) { NWS.n += 30; nwList(); return; }
  if (e.target.closest('#nwXl')) return nwExcel(e.target.closest('#nwXl'));
  if (e.target.closest('[data-gonw]')) { e.preventDefault(); showTab(paneOf(document.getElementById('nwTitle')), true); }
});
let nwQt; document.addEventListener('input', e => { if (e.target.id !== 'nwQ') return; clearTimeout(nwQt); nwQt = setTimeout(() => { NWS.q = e.target.value; NWS.n = 30; nwList(); }, 200); });
