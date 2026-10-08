/* Ataskaitų polapis: vieno valdytojo visų fondų lentelės (kalendorinių metų ir mėnesių grąža, Performance KPI). */
addStrings({
  mgr: 'Manager', calTitle: 'Returns since 2019',
  calLead: 'Every fund of the selected manager: total and average annual return since the end of 2018, then each calendar year. The current year runs to the latest unit value.',
  thFund: 'Fund', thTot: 'Total for the whole period', thAvg: 'Average annual', ytdCol: y => `${y} (YTD)`,
  rkTip: 'Place among this manager’s funds in this table (1 = highest total return)',
  calNote: (a, e) => `Period ${a} → ${e}. * = the fund started later, so the figure covers only part of the period. Average annual = compound annual growth. Colour: green = gain, red = loss.`,
  monTitle: y => `Monthly returns ${y}`, ytd: 'Year to date',
  monNote: e => `Month-end unit values; the last month runs to the latest value (${e}).`,
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  kpiTitle: 'Performance KPI',
  kpiLead: 'Returns of the manager’s funds for the chosen period compared with the other managers’ funds in the same group and with the fund’s benchmark (SAA).',
  period: 'Period', per: { ytd: 'YTD', '1y': '1 year', '3y': '3 years', '5y': '5 years' }, endAt: 'To', endMonth: 'last month-end', endLast: 'latest day',
  cmp: 'Compare with',
  thNet: 'Net return', thMed: 'Peer median', thGross: 'Gross return', thFee: 'Fee now, % a year', thSaa: 'SAA (benchmark)', thNetD: 'Net − SAA', thGrossD: 'Gross − SAA',
  thRank: 'Ranking in risk class', thN: 'Number of funds in risk class', thRisk: 'Risk class', thAum: 'AUM, €', thShare: 'Share',
  eq: v => `${num(v, 0)}% equity`, total: 'Total', pl2: 'II pillar', pl3: 'III pillar',
  cats: { bond: 'Bond funds', mixed: 'Mixed funds', equity: 'Equity funds' }, cpf: 'Capital preservation fund',
  kpiNote: (a, e, lb, lg) => `Period ${a} → ${e}; returns are cumulative. Peer median = median of the other managers’ funds in the same group (risk class = birth-year group in the II pillar, fund type in the III pillar). Ranking 1 = best in the group. Gross = net + fees added back pro rata: until 2025 the 2025 BAR of each fund (Bank of Lithuania, ${lb}), from 2026 the fee published by the Bank of Lithuania (0.40 % instead of 0.50 % for managers whose pension funds averaged over €2.5 bn last year, now ${lg}); III pillar: the published asset management fee for the whole period. SAA = the fund’s benchmark index, published daily only by SEB and Goindex. Risk class = equity share in the fund strategy (Bank of Lithuania). Total = AUM-weighted return.`,
  foot: 'Sources: providers’ unit values and net assets (collected automatically), Bank of Lithuania results reports. For information only, not investment advice.',
}, {
  mgr: 'Valdytojas', calTitle: 'Grąža nuo 2019 m.',
  calLead: 'Visi pasirinkto valdytojo fondai: bendra ir vidutinė metinė grąža nuo 2018 m. pabaigos, tada kiekvieni kalendoriniai metai. Šie metai – iki paskutinės vieneto vertės.',
  thFund: 'Fondas', thTot: 'Bendra per visą laikotarpį', thAvg: 'Vidutinė metinė', ytdCol: y => `${y} (YTD)`,
  rkTip: 'Vieta tarp šio valdytojo fondų šioje lentelėje (1 = didžiausia bendra grąža)',
  calNote: (a, e) => `Laikotarpis ${a} → ${e}. * = fondas pradėjo veikti vėliau, todėl skaičius apima tik dalį laikotarpio. Vidutinė metinė = geometrinis vidurkis. Spalva: žalia = pelnas, raudona = nuostolis.`,
  monTitle: y => `Mėnesių grąža ${y} m.`, ytd: 'Nuo metų pradžios',
  monNote: e => `Mėnesių pabaigos vieneto vertės; paskutinis mėnuo – iki paskutinės vertės (${e}).`,
  months: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
  kpiTitle: 'Performance KPI',
  kpiLead: 'Valdytojo fondų grąža pasirinktu laikotarpiu, palyginti su kitų valdytojų tos pačios grupės fondais ir su fondo lyginamuoju indeksu (SAA).',
  period: 'Laikotarpis', per: { ytd: 'YTD', '1y': '1 metai', '3y': '3 metai', '5y': '5 metai' }, endAt: 'Iki', endMonth: 'paskutinės mėn. pabaigos', endLast: 'paskutinės dienos',
  cmp: 'Palyginti su',
  thNet: 'Grynoji grąža', thMed: 'Peer median', thGross: 'Bruto grąža', thFee: 'Mokestis dabar, % per metus', thSaa: 'SAA (indeksas)', thNetD: 'Grynoji − SAA', thGrossD: 'Bruto − SAA',
  thRank: 'Vieta rizikos klasėje', thN: 'Fondų skaičius klasėje', thRisk: 'Rizikos klasė', thAum: 'AUM, €', thShare: 'Dalis',
  eq: v => `${num(v, 0)}% akcijų`, total: 'Iš viso', pl2: 'II pakopa', pl3: 'III pakopa',
  cats: { bond: 'Obligacijų fondai', mixed: 'Mišraus investavimo fondai', equity: 'Akcijų fondai' }, cpf: 'Turto išsaugojimo fondas',
  kpiNote: (a, e, lb, lg) => `Laikotarpis ${a} → ${e}; grąža sukaupta per visą laikotarpį. Peer median = kitų valdytojų tos pačios grupės fondų grąžos mediana (rizikos klasė: II pakopoje – gimimo metų grupė, III pakopoje – fondo tipas). Vieta 1 = geriausias grupėje. Bruto = grynoji grąža + proporcingai pridėti atskaitymai: iki 2025 m. – kiekvieno fondo 2025 m. BAR (Lietuvos bankas, ${lb}), nuo 2026 m. – Lietuvos banko skelbiamas mokestis (0,40 % vietoj 0,50 % bendrovėms, kurių pensijų fondų turto vidurkis praėjusiais metais viršijo 2,5 mlrd. Eur, dabar: ${lg}); III pakopa – skelbiamas valdymo mokestis nuo turto visam laikotarpiui. SAA = fondo lyginamasis indeksas, kasdien jį skelbia tik SEB ir Goindex. Rizikos klasė = akcijų dalis fondo strategijoje (Lietuvos bankas). Iš viso = AUM pasverta grąža.`,
  foot: 'Šaltiniai: bendrovių skelbiamos vieneto vertės ir grynieji aktyvai (renkami automatiškai), Lietuvos banko rezultatų ataskaitos. Informacinė medžiaga, ne investavimo rekomendacija.',
});

const MGRS = ['ALLIANZ', 'ARTEA', 'GOINDEX', 'LUMINOR', 'SEB', 'SWEDBANK'];       // tvarka = spalvos --s1..--s6
const MLABEL = { ALLIANZ: 'Allianz', ARTEA: 'Artea', GOINDEX: 'Goindex', LUMINOR: 'Luminor', SEB: 'SEB', SWEDBANK: 'Swedbank' };
var DATA = { providers: MGRS.map(m => ({ id: m, label: MLABEL[m] })) };
const ORDER2 = ['turto', '1961-1967', '1968-1974', '1975-1981', '1982-1988', '1989-1995', '1996-2002', '2003-2009'];
const ORDER3 = ['bond', 'mixed', 'equity'];
const FEE_FROM_2026 = { life: 0.40, turto: 0.20 };        // atsarginė reikšmė, jei fondo nėra data/fees.csv
const M = REP.months, NM = M.length;
const field = (label, html) => `<label class="field">${label} ${html}</label>`;
function seg(id, opts, cur) {
  return `<div class="seg" role="group" data-seg="${id}">` + opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${t}</button>`).join('') + '</div>';
}
function wire(root, handlers) {
  root.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => handlers[g.dataset.seg](b.dataset.v))));
}
const ST = Object.assign({ m: 'SEB', per: 'ytd', end: 'month', c1: 'SWEDBANK', c2: 'ARTEA', c3: 'GOINDEX' },
  (() => { try { return JSON.parse(localStorage.getItem('repstate')) || {}; } catch (e) { return {}; } })());
try { const q = new URLSearchParams(location.search).get('m'); if (q && MGRS.includes(q)) ST.m = q; } catch (e) {}
const save = () => { try { localStorage.setItem('repstate', JSON.stringify(ST)); } catch (e) {} };

/* ---------- skaičiavimai ---------- */
const yearOf = d => new Date(d * DAY).getUTCFullYear(), monthOf = d => new Date(d * DAY).getUTCMonth();
const mIdx = (y, m) => M.findIndex(d => yearOf(d) === y && monthOf(d) === m);   // mėnesio pabaigos indeksas
const short = d => iso(d).replace(/-/g, '.');
/* taškas: mėnesio pabaigos indeksas arba 'L' (paskutinė diena) -> [diena, vertė] */
const pt = (f, i, bm) => i === 'L' ? (bm ? (f.blv != null ? [f.bld, f.blv] : null) : [f.ld, f.lv]) : ((bm ? f.bm && f.bm[i] : f.m[i]) != null ? [M[i], bm ? f.bm[i] : f.m[i]] : null);
function ret(f, a, b, bm) {                 // grąža %, null jei nėra abiejų taškų
  const p0 = pt(f, a, bm), p1 = pt(f, b, bm);
  return p0 && p1 && p1[0] > p0[0] ? (p1[1] / p0[1] - 1) * 100 : null;
}
function firstIdx(f, from) { for (let i = from; i < NM; i++) if (f.m[i] != null) return i; return null; }
function feeFor(f, d0, d1) {                // atskaitymai % per laikotarpį (proporcingai dienoms)
  if (f.pl === 'III' ? f.fee == null : f.bar == null && f.fee == null) return null;
  let s = 0;
  for (let y = yearOf(d0); y <= yearOf(d1); y++) {
    const ys = Math.round(Date.UTC(y, 0, 1) / DAY), ye = Math.round(Date.UTC(y + 1, 0, 1) / DAY);
    const days = Math.max(0, Math.min(d1, ye) - Math.max(d0, ys));
    // II pakopa: iki 2025 m. – fondo 2025 m. BAR, nuo 2026 m. – LB skelbiamas mokestis; III pakopa – LB skelbiamas mokestis
    const rate = f.pl === 'III' ? f.fee : y >= 2026 ? (f.fee ?? FEE_FROM_2026[f.g === 'turto' ? 'turto' : 'life']) : (f.bar ?? f.fee);
    s += rate * days / (ye - ys);
  }
  return s;
}
const median = xs => { const s = xs.filter(x => x != null).sort((a, b) => a - b); if (!s.length) return null; const k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
const fundsOf = (pl, m) => REP.funds.filter(f => f.pl === pl && f.p === m)
  .sort((a, b) => pl === 'II' ? ORDER2.indexOf(a.g) - ORDER2.indexOf(b.g) : ORDER3.indexOf(a.g) - ORDER3.indexOf(b.g) || a.n.localeCompare(b.n));
const shortName = f => f.n.replace(' tikslinės grupės pensijų fondas', '').replace(' gimusiems', '').replace(/ m\.$/, '').replace('–', '-');

/* ---------- spalvos ---------- */
function heat(v, scale) {
  if (v == null) return '';
  const t = Math.min(1, Math.abs(v) / scale);
  return `background:${v >= 0 ? `hsl(135,45%,${92 - 37 * t}%)` : `hsl(5,75%,${92 - 27 * t}%)`}`;
}
const pc = (v, p = 2) => v == null ? '–' : `${v < 0 ? '−' : ''}${num(Math.abs(v), p)}%`;
const pp = (v, p = 2) => v == null ? '–' : `${v > 0 ? '+' : v < 0 ? '−' : ''}${num(Math.abs(v), p)}`;
const hcell = (v, scale, extra = '', cls = '') => v == null ? '<td class="na">–</td>' : `<td class="hc ${cls}" style="${heat(v, scale)}">${pc(v)}${extra}</td>`;
const ranks = vals => vals.map(v => v == null ? null : 1 + vals.filter(o => o != null && o > v).length);

/* ---------- 1. grąža nuo 2019 m. ---------- */
function renderCal() {
  const i0 = mIdx(2018, 11), lastY = yearOf(Math.max(...REP.funds.map(f => f.ld)));
  const years = []; for (let y = lastY; y >= 2019; y--) years.push(y);
  let body = '';
  for (const pl of ['II', 'III']) {
    const fs = fundsOf(pl, ST.m);
    if (!fs.length) continue;
    const rows = fs.map(f => {
      const s = f.m[i0] != null ? i0 : firstIdx(f, i0);
      const tot = s != null ? ret(f, s, 'L') : null, yrs = s != null ? (f.ld - M[s]) / 365.25 : 0;
      const avg = tot != null && yrs >= 1 ? (Math.pow(1 + tot / 100, 1 / yrs) - 1) * 100 : null;
      const ys = years.map(y => { const a = mIdx(y - 1, 11), b = y === lastY ? 'L' : mIdx(y, 11); const aa = f.m[a] != null ? a : (firstIdx(f, a) != null && yearOf(M[firstIdx(f, a)]) === y ? firstIdx(f, a) : null); return aa == null ? null : { v: ret(f, aa, b), part: aa !== a }; });
      return { f, tot, avg, part: s !== i0, ys };
    });
    const rk = ranks(rows.map(r => r.tot));
    body += `<tr class="sep"><td colspan="${4 + years.length}">${pl === 'II' ? T().pl2 : T().pl3}</td></tr>`;
    body += rows.map((r, k) => `<tr><td class="rk" title="${T().rkTip}">${rk[k] ?? ''}</td><td class="l">${shortName(r.f)}</td>${hcell(r.tot, 150, r.part ? '*' : '')}<td class="hc b">${r.avg == null ? '–' : pc(r.avg)}</td>${r.ys.map((x, j) => x && x.v != null ? `<td class="hc${j ? '' : ' bl'}" style="${heat(x.v, 25)}">${pc(x.v)}${x.part ? '*' : ''}</td>` : `<td class="na${j ? '' : ' bl'}">–</td>`).join('')}</tr>`).join('');
  }
  document.getElementById('calTable').innerHTML = `<thead><tr><th></th><th class="l">${T().thFund}</th><th>${T().thTot}</th><th>${T().thAvg}</th>${years.map((y, j) => `<th class="${j ? '' : 'bl'}">${j ? y : T().ytdCol(y)}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
  const e = Math.max(...fundsOf('II', ST.m).concat(fundsOf('III', ST.m)).map(f => f.ld));
  document.getElementById('calNote').textContent = T().calNote(short(M[i0]), short(e));
}

/* ---------- 2. mėnesių grąža ---------- */
function renderMonths() {
  const all = fundsOf('II', ST.m).concat(fundsOf('III', ST.m));
  const e = Math.max(...all.map(f => f.ld)), y = yearOf(e), lastM = monthOf(e);
  document.getElementById('monTitle').textContent = T().monTitle(y);
  const i0 = mIdx(y - 1, 11);
  let body = '';
  for (const pl of ['II', 'III']) {
    const fs = fundsOf(pl, ST.m);
    if (!fs.length) continue;
    const rows = fs.map(f => ({ f, ytd: ret(f, i0, 'L'), ms: T().months.map((_, m) => { if (m > lastM) return undefined; const a = mIdx(y, m - 1 < 0 ? 0 : m - 1), b = m === lastM ? 'L' : mIdx(y, m); return ret(f, m === 0 ? i0 : a, b); }) }));
    const rk = ranks(rows.map(r => r.ytd));
    body += `<tr class="sep"><td colspan="${15}">${pl === 'II' ? T().pl2 : T().pl3}</td></tr>`;
    body += rows.map((r, k) => `<tr><td class="rk" title="${T().rkTip}">${rk[k] ?? ''}</td><td class="l">${shortName(r.f)}</td>${hcell(r.ytd, 20, '', 'b')}${r.ms.map((v, j) => v === undefined ? `<td class="na${j ? '' : ' bl'}"></td>` : v == null ? `<td class="na${j ? '' : ' bl'}">–</td>` : `<td class="hc${j ? '' : ' bl'}" style="${heat(v, 6)}">${pc(v)}</td>`).join('')}</tr>`).join('');
  }
  document.getElementById('monTable').innerHTML = `<thead><tr><th></th><th class="l">${T().thFund}</th><th>${T().ytd}</th>${T().months.map((m, j) => `<th class="${j ? '' : 'bl'}">${m}</th>`).join('')}</tr></thead><tbody>${body}</tbody>`;
  document.getElementById('monNote').textContent = T().monNote(short(e));
}

/* ---------- 3. Performance KPI ---------- */
function renderKpi() {
  const others = MGRS.filter(m => m !== ST.m);
  ['c1', 'c2', 'c3'].forEach((c, k) => { if (ST[c] === ST.m || !MGRS.includes(ST[c])) ST[c] = others[k]; });
  const sel = c => `<select data-c="${c}">${others.map(m => `<option value="${m}"${m === ST[c] ? ' selected' : ''}>${MLABEL[m]}</option>`).join('')}</select>`;
  const bar = document.getElementById('kpiBar');
  bar.innerHTML = field(T().period, seg('per', Object.keys(T().per).map(p => [p, T().per[p]]), ST.per))
    + field(T().endAt, seg('end', [['month', T().endMonth], ['last', T().endLast]], ST.end))
    + field(T().cmp, sel('c1') + sel('c2') + sel('c3'));
  wire(bar, { per: v => { ST.per = v; save(); renderKpi(); }, end: v => { ST.end = v; save(); renderKpi(); } });
  bar.querySelectorAll('select').forEach(s => s.addEventListener('change', () => { ST[s.dataset.c] = s.value; save(); renderKpi(); }));

  // pabaiga: paskutinė pilno mėnesio pabaiga arba kiekvieno fondo paskutinė diena; pradžia – mėnesio pabaiga prieš n mėn.
  const lastAll = Math.max(...REP.funds.map(f => f.ld)), bi = NM - 1;
  const endKey = ST.end === 'last' ? 'L' : bi, endDay = ST.end === 'last' ? lastAll : M[bi];
  const ai = ST.per === 'ytd' ? mIdx(yearOf(endDay) - 1, 11) : Math.max(0, bi - { '1y': 12, '3y': 36, '5y': 60 }[ST.per]);
  const r = f => ret(f, ai, endKey), rb = f => ret(f, ai, endKey, true);
  const cols = [ST.c1, ST.c2, ST.c3];
  let body = '';
  for (const pl of ['II', 'III']) {
    const fs = fundsOf(pl, ST.m);
    if (!fs.length) continue;
    const aumTot = fs.reduce((a, f) => a + (f.aum || 0), 0);
    let wsum = 0, wret = 0;
    body += `<tr class="sep"><td colspan="16">${pl === 'II' ? T().pl2 : T().pl3}</td></tr>`;
    body += fs.map(f => {
      const peers = REP.funds.filter(x => x.pl === pl && x.g === f.g);
      const net = r(f), med = median(peers.filter(x => x.p !== f.p).map(r));
      const p0 = pt(f, ai), p1 = pt(f, endKey), fee = p0 && p1 ? feeFor(f, p0[0], p1[0]) : null;
      const gross = net != null && fee != null ? net + fee : null, saa = rb(f);
      const vals = peers.map(r), rk = net == null ? null : 1 + vals.filter(v => v != null && v > net).length, n = vals.filter(v => v != null).length;
      const cmpv = cols.map(m => { if (pl !== 'II') return null; const x = peers.find(p => p.p === m); return x ? r(x) : null; });
      if (net != null && f.aum) { wsum += f.aum; wret += f.aum * net; }
      const vs = (a, b) => a == null || b == null ? '' : a >= b ? 'good' : 'bad';
      const risk = pl === 'II' ? (f.risky == null ? '–' : T().eq(f.risky)) : (f.risky || '–');
      return `<tr><td class="l">${shortName(f)}</td><td>${pc(net)}</td><td class="${vs(net, med)}">${pc(med)}</td><td>${pc(gross)}</td><td class="rsub">${f.fee == null ? '–' : num(f.fee, 2)}</td><td class="${vs(gross, saa)}">${pc(saa)}</td>`
        + `<td class="${net != null && saa != null ? (net >= saa ? 'up' : 'down') : ''}">${net != null && saa != null ? pp(net - saa) : '–'}</td><td class="${gross != null && saa != null ? (gross >= saa ? 'up' : 'down') : ''}">${gross != null && saa != null ? pp(gross - saa) : '–'}</td>`
        + cmpv.map((v, k) => `<td class="${k ? '' : 'bl'}">${pl === 'II' ? pc(v) : ''}</td>`).join('')
        + `<td class="bl">${rk ?? '–'}</td><td>${n || '–'}</td><td>${risk}</td><td class="bl">${f.aum ? num(f.aum, 0) : '–'}</td><td>${f.aum && aumTot ? pc(f.aum / aumTot * 100) : '–'}</td></tr>`;
    }).join('');
    body += `<tr class="tot"><td class="l">${T().total}</td><td>${wsum ? pc(wret / wsum) : '–'}</td><td colspan="12"></td><td class="bl">${num(aumTot, 0)}</td><td>100%</td></tr>`;
  }
  document.getElementById('kpiTable').innerHTML = `<thead><tr><th class="l">${T().thFund}</th><th>${T().thNet}</th><th>${T().thMed}</th><th>${T().thGross}</th><th>${T().thFee}</th><th>${T().thSaa}</th><th>${T().thNetD}</th><th>${T().thGrossD}</th>${cols.map((m, k) => `<th class="${k ? '' : 'bl'}">${MLABEL[m]}</th>`).join('')}<th class="bl">${T().thRank}</th><th>${T().thN}</th><th>${T().thRisk}</th><th class="bl">${T().thAum}</th><th>${T().thShare}</th></tr></thead><tbody>${body}</tbody>`;
  document.getElementById('kpiNote').textContent = T().kpiNote(short(M[ai]), short(endDay), REP.lbDate ? `${REP.lbDate.slice(0, 4)}-${REP.lbDate.slice(4, 6)}-${REP.lbDate.slice(6)}` : '', (REP.large || []).map(m => MLABEL[m]).join(', '));
}

function renderAllParts() {
  document.getElementById('sub').textContent = `${T().navReports} · ${T().updated} ${REP.generated}`;
  const bar = document.getElementById('mgrBar');
  bar.innerHTML = field(T().mgr, seg('m', MGRS.map(m => [m, MLABEL[m]]), ST.m));
  wire(bar, { m: v => { ST.m = v; save(); renderAllParts(); } });
  ['calTitle', 'calLead', 'kpiTitle', 'kpiLead', 'foot'].forEach(id => { document.getElementById(id).textContent = T()[id]; });
  renderCal(); renderMonths(); renderKpi();
}
renderHeader('reports', renderAllParts);
renderAllParts();
