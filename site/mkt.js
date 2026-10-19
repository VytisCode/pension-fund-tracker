/* Pradžios puslapio rinkos dalis (savininkas 2026-10-19: Pradžioje – LIPFA ir visai rinkai aktuali informacija):
   Lietuvos banko ketvirčių rezultatų ataskaitos nuo 2015 m. (docs/data_mkt.js, žr. market.py) – visa rinka, valdytojai, fondai.
   Faktų kortelės – neutralūs, šaltinį ir skaičiavimą nurodantys sakiniai, kuriuos galima nukopijuoti į naujieną.
   Fondai lyginami tik LB grupės viduje (gyvenimo ciklo – pagal gimimo metus; turto išsaugojimo – tarpusavyje). */
const MK_ORDER = ['2003-2009', '1996-2002', '1989-1995', '1982-1988', '1975-1981', '1968-1974', '1961-1967', '1954-1960', 'turto', 'gc', 'akc', 'vid', 'maz', 'kons', 'mis', 'obl'];
const MK_PROV = ['Allianz', 'Artea', 'Goindex', 'Luminor', 'SEB', 'Swedbank', 'ERGO'];
const mkColor = p => { const i = MK_PROV.indexOf(p); return i >= 0 && i < 6 ? `var(--s${i + 1})` : 'var(--text-3)'; };
const MK_MON = { lt: ['sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };
const ROMAN = ['I', 'II', 'III', 'IV'];
addStrings({
  tdTitle: 'Today', qfTitle: 'Quarter facts', mkTitle: 'Market over time', mgTitle: 'Managers', fdTitle: 'Funds by group',
  qfLead: 'Ready-to-use facts for news and reviews from the Bank of Lithuania quarterly results reports: whole market, managers and funds. Each card names the period, source and how it was calculated; “Copy” copies the sentence with its source.',
  mkLead: 'Participants, net assets and asset-weighted returns of the whole pillar at each quarter end since 2015.',
  mgLead: 'Each manager’s participants, assets and market share. Predecessors are counted with today’s manager (Aviva → Allianz; DNB → Luminor; Finasta, MP Pension Funds Baltic, INVL, SB Asset Management → Artea; Danske Capital → Swedbank).',
  fdLead: 'Funds are compared only with funds of the same Bank of Lithuania group (life-cycle funds by year of birth; asset-preservation funds with each other). The last row is the Bank of Lithuania asset-weighted group average.',
  pl: 'Pillar', q: 'Quarter end', hl: 'Highlight manager', hlNone: 'whole market', grp: 'Group', grpAll: 'all groups', sortBy: 'Sort by', show: 'Show',
  copy: 'Copy', copied: 'Copied', copyAll: 'Copy all facts', srcLB: (pl, d) => `Source: Bank of Lithuania, pillar ${pl} pension fund results, ${d}.`,
  how: 'How:', period: 'Period:',
  kPart: pl => `Pillar ${pl} participants`, kNav: pl => `Pillar ${pl} assets`, kYtd: 'Weighted return since year start', kGain: 'Investment gain in the quarter (est.)',
  vs: (q, y) => `${q} vs prev. quarter · ${y} vs year ago`,
  ind: { part: 'Participants', nav: 'Net assets, € m', per: 'Assets per participant, €', ytd: 'Weighted return since year start', r1: 'Weighted return over 1 year', qret: 'Weighted return in the quarter', gain: 'Investment gain in the quarter, € m (est.)', gainY: 'Investment gain since year start, € m (est.)', nf: 'Funds' },
  thInd: 'Indicator', thNow: 'Quarter end', thPrevQ: 'Prev. quarter', thPrevY: 'Year ago', thDq: 'Change in quarter', thDy: 'Change in year',
  thDate: 'Quarter end', thPart: 'Participants', thNav: 'Assets, € m', thPer: 'Per participant, €', thYtd: 'Since year start', thQ: 'Quarter', th1y: '1 year', th3y: '3 years', th5y: '5 years', thGcf: 'Since start (annual)', thBm: 'Benchmark, since year start', thRisky: 'Risky assets', thGain: 'Gain in quarter, € m (est.)',
  thMgr: 'Manager', thFunds: 'Funds', thShare: 'Share', thFund: 'Fund', thAvg: 'Bank of Lithuania group average', thTot: 'Total', thGroup: 'Group',
  chOf: { part: 'Participants', nav: 'Net assets, € m', per: 'Assets per participant, €' }, shOf: { part: 'Share of participants', nav: 'Share of assets' },
  gpTitle: 'Participants by group', gpLead: 'Participants in each Bank of Lithuania group over the last quarters.',
  mgChart: 'Market share over time', fdNone: 'No funds in this quarter.',
  noteLB: 'Bank of Lithuania counts can differ from those published by managers or the association (e.g. participants whose payout is still in progress may still be counted). In pillar III a person saving in several funds is counted in each fund. The pillar II report for 2015-06-30 is not available (the Bank of Lithuania link opens the pillar III file).',
  noteGain: 'Investment gain is an estimate: fund quarter return × (assets at quarter start + half the net flow; from Q2 2026 the whole flow, as reform payouts are made at the start of the quarter). For pillar II in 2025 this gives € 618 m, as in the association’s review; 2026 figures differ because reform payouts are treated differently.',
  gl: { turto: 'Asset preservation', gc: 'Life-cycle (before 2019)', akc2: 'Equity (up to 100%)', vid: 'Medium equity (up to 70%)', maz: 'Low equity (up to 30%)', kons: 'Conservative', obl: 'Bond', mis: 'Mixed', akc3: 'Equity', born: g => `Born ${g.replace('-', '–')}` },
  dq: d => `${MK_MON.en[+d.slice(5, 7) - 1].slice(0, 3)} ${d.slice(0, 4)}`, qn: d => `Q${Math.ceil(+d.slice(5, 7) / 3)} ${d.slice(0, 4)}`,
  dLong: d => `${+d.slice(8)} ${MK_MON.en[+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`,
  f: {
    navH: 'Assets', partH: 'Participants', retH: 'Return', gainH: 'Investment gain', perH: 'Per participant', lcH: 'Life-cycle groups', mgrH: 'Market shares', bothH: 'Pillars II and III', chgH: 'Change in participants',
    nav: (pl, d, v, q, y) => `On ${d} pillar ${pl} pension funds managed ${v} of net assets${q ? ` – ${q} over the quarter` : ''}${y ? ` and ${y} over the year` : ''}.`,
    part: (pl, d, v, q, y) => `On ${d} ${v} people were saving in pillar ${pl} pension funds${q ? `; change over the quarter ${q}` : ''}${y ? `, over the year ${y}` : ''}.`,
    part3: (pl, d, v, q, y) => `On ${d} pillar ${pl} pension funds had ${v} participants (sum over funds)${q ? `; change over the quarter ${q}` : ''}${y ? `, over the year ${y}` : ''}.`,
    ret: (pl, qn, ytd, qr, r1) => `The asset-weighted return of all pillar ${pl} funds since the start of the year was ${ytd}${qr ? `, ${qr} in ${qn}` : ''}${r1 ? `; over 12 months ${r1}` : ''}.`,
    gain1: (pl, qn, v, y) => `Pillar ${pl} funds earned an investment gain of about ${v} in ${qn}${y ? ` and about ${y} since the start of the year` : ''}.`,
    per: (pl, v, y) => `Assets per pillar ${pl} participant averaged ${v}${y ? ` (a year earlier ${y})` : ''}.`,
    lc: (lo, lg, hi, hg) => `Since the start of the year life-cycle group averages ranged from ${lo} (${lg}) to ${hi} (${hg}).`,
    mgr: (a, as, p, ps) => `The largest manager by assets is ${a} (${as} of the market), by participants – ${p} (${ps}).`,
    both: (d, v, n) => `On ${d} pillar II and III pension funds together managed ${v}${n ? ` and had ${n} participations` : ''}.`,
    chg: (hi, hv, lo, lv) => `Change in participants over the quarter by manager: from ${lo} (${lv}) to ${hi} (${hv}).`,
    m1: (m, pl, v, s, p, ps) => `${m} managed ${v} of pillar ${pl} assets (${s} of the market) and had ${p} participants (${ps}).`,
    m2: (m, q, nq) => `Over the quarter ${m}’s participants changed by ${q} and assets by ${nq}.`,
    m3: (m, k, n) => `${m} funds beat the Bank of Lithuania group average since the start of the year in ${k} of ${n} groups.`,
    m4: (m, best) => `${m}’s best place in a group since the start of the year: ${best}.`,
    calcNav: 'Sum of fund net assets in the report.', calcPart: 'Sum of fund participants in the report.', calcRet: 'Bank of Lithuania asset-weighted average of all funds (“All funds”, weights – assets on the report date); quarter return – fund quarter returns weighted by quarter-end assets (fund quarter return = (1 + YTD) ÷ (1 + previous quarter YTD) − 1).',
    calcGain: 'Σ fund quarter return × (assets at quarter start + half the net flow; from Q2 2026 the whole flow, as reform payouts are made at the start of the quarter). An estimate.', calcPer: 'Net assets ÷ participants.', calcLc: 'Bank of Lithuania weighted group averages.', calcMgr: 'Manager’s funds ÷ whole pillar.', calcChg: 'Manager’s participants now − at previous quarter end.', calcM3: 'Manager fund’s YTD return vs Bank of Lithuania group average, groups where the manager has a fund.',
  },
}, {
  tdTitle: 'Šiandien', qfTitle: 'Ketvirčio faktai', mkTitle: 'Rinka laike', mgTitle: 'Valdytojai', fdTitle: 'Fondai pagal grupes',
  qfLead: 'Naujienoms ir apžvalgoms paruošti faktai iš Lietuvos banko ketvirčio rezultatų ataskaitų: visa rinka, valdytojai ir fondai. Kiekvienoje kortelėje – laikotarpis, šaltinis ir kaip skaičiuota; „Kopijuoti“ nukopijuoja sakinį su šaltiniu.',
  mkLead: 'Visos pakopos dalyviai, grynieji aktyvai ir svertinė grąža kiekvieno ketvirčio pabaigoje nuo 2015 m.',
  mgLead: 'Kiekvieno valdytojo dalyviai, turtas ir rinkos dalis. Pirmtakai priskirti dabartiniam valdytojui (Aviva → Allianz; DNB → Luminor; Finasta, MP Pension Funds Baltic, INVL, SB Asset Management → Artea; Danske Capital → Swedbank).',
  fdLead: 'Fondai lyginami tik su tos pačios Lietuvos banko grupės fondais (gyvenimo ciklo – pagal gimimo metus; turto išsaugojimo – tarpusavyje). Paskutinė eilutė – LB svertinis grupės vidurkis.',
  pl: 'Pakopa', q: 'Ketvirčio pabaiga', hl: 'Paryškinti valdytoją', hlNone: 'visa rinka', grp: 'Grupė', grpAll: 'visos grupės', sortBy: 'Rikiuoti pagal', show: 'Rodyti',
  copy: 'Kopijuoti', copied: 'Nukopijuota', copyAll: 'Kopijuoti visus faktus', srcLB: (pl, d) => `Šaltinis: Lietuvos bankas, ${pl} pakopos pensijų fondų veiklos rezultatai, ${d}.`,
  how: 'Kaip skaičiuota:', period: 'Laikotarpis:',
  kPart: pl => `${pl} pakopos dalyviai`, kNav: pl => `${pl} pakopos turtas`, kYtd: 'Svertinė grąža nuo metų pradžios', kGain: 'Investicinis prieaugis per ketvirtį (apyt.)',
  vs: (q, y) => `${q} per ketvirtį · ${y} per metus`,
  ind: { part: 'Dalyviai', nav: 'Grynieji aktyvai, mln. €', per: 'Turtas vienam dalyviui, €', ytd: 'Svertinė grąža nuo metų pradžios', r1: 'Svertinė grąža per 1 metus', qret: 'Svertinė ketvirčio grąža', gain: 'Investicinis prieaugis per ketvirtį, mln. € (apyt.)', gainY: 'Investicinis prieaugis nuo metų pradžios, mln. € (apyt.)', nf: 'Fondų skaičius' },
  thInd: 'Rodiklis', thNow: 'Ketvirčio pabaiga', thPrevQ: 'Prieš ketvirtį', thPrevY: 'Prieš metus', thDq: 'Pokytis per ketvirtį', thDy: 'Pokytis per metus',
  thDate: 'Ketvirčio pabaiga', thPart: 'Dalyviai', thNav: 'Turtas, mln. €', thPer: 'Vienam dalyviui, €', thYtd: 'Nuo metų pradžios', thQ: 'Ketvirtis', th1y: '1 metai', th3y: '3 metai', th5y: '5 metai', thGcf: 'Nuo veiklos pradžios (metinė)', thBm: 'Lyginamasis indeksas nuo metų pradžios', thRisky: 'Rizikingas turtas', thGain: 'Prieaugis per ketvirtį, mln. € (apyt.)',
  thMgr: 'Valdytojas', thFunds: 'Fondai', thShare: 'Dalis', thFund: 'Fondas', thAvg: 'LB svertinis grupės vidurkis', thTot: 'Iš viso', thGroup: 'Grupė',
  chOf: { part: 'Dalyviai', nav: 'Grynieji aktyvai, mln. €', per: 'Turtas vienam dalyviui, €' }, shOf: { part: 'Dalyvių dalis', nav: 'Turto dalis' },
  gpTitle: 'Dalyviai pagal grupes', gpLead: 'Dalyvių skaičius kiekvienoje Lietuvos banko grupėje per paskutinius ketvirčius.',
  mgChart: 'Rinkos dalis laike', fdNone: 'Šį ketvirtį fondų nėra.',
  noteLB: 'Lietuvos banko skaičiai gali skirtis nuo valdytojų ar asociacijos skelbiamų (pvz. gali būti dar skaičiuojami dalyviai, kurių išmoka vykdoma). III pakopoje žmogus, kaupiantis keliuose fonduose, skaičiuojamas kiekviename fonde. II pakopos 2015-06-30 ataskaitos nėra (LB nuoroda atidaro III pakopos failą).',
  noteGain: 'Investicinis prieaugis – įvertis: fondo ketvirčio grąža × (turtas ketvirčio pradžioje + pusė įmokų ir išmokų srauto; nuo 2026 II ketv. – visas srautas, nes reformos išmokos mokamos ketvirčio pradžioje). 2025 m. II pakopai gaunama 618 mln. €, kaip LIPFA apžvalgoje; 2026 m. LIPFA skaičiai skiriasi, nes jie kitaip vertina reformos išmokas.',
  gl: { turto: 'Turto išsaugojimo', gc: 'Gyvenimo ciklo (iki 2019 m.)', akc2: 'Akcijų (iki 100 %)', vid: 'Vidutinės akcijų dalies (iki 70 %)', maz: 'Mažos akcijų dalies (iki 30 %)', kons: 'Konservatyvaus investavimo', obl: 'Obligacijų', mis: 'Mišraus investavimo', akc3: 'Akcijų', born: g => `Gimę ${g.replace('-', '–')}` },
  dq: d => `${d.slice(0, 4)} ${ROMAN[Math.ceil(+d.slice(5, 7) / 3) - 1]} ketv.`, qn: d => `${d.slice(0, 4)} m. ${ROMAN[Math.ceil(+d.slice(5, 7) / 3) - 1]} ketvirtį`,
  dLong: d => `${d.slice(0, 4)} m. ${MK_MON.lt[+d.slice(5, 7) - 1]} ${+d.slice(8)} d.`,
  f: {
    navH: 'Turtas', partH: 'Dalyviai', retH: 'Grąža', gainH: 'Investicinis prieaugis', perH: 'Vienam dalyviui', lcH: 'Gyvenimo ciklo grupės', mgrH: 'Rinkos dalys', bothH: 'II ir III pakopa', chgH: 'Dalyvių pokytis',
    nav: (pl, d, v, q, y) => `${d} ${pl} pakopos pensijų fondai valdė ${v} grynųjų aktyvų${q ? ` – per ketvirtį ${q}` : ''}${y ? `, per metus ${y}` : ''}.`,
    part: (pl, d, v, q, y) => `${d} ${pl} pakopos pensijų fonduose kaupė ${v} dalyvių${q ? `; per ketvirtį pokytis ${q}` : ''}${y ? `, per metus ${y}` : ''}.`,
    part3: (pl, d, v, q, y) => `${d} ${pl} pakopos pensijų fondai turėjo ${v} dalyvių (suma per fondus)${q ? `; per ketvirtį pokytis ${q}` : ''}${y ? `, per metus ${y}` : ''}.`,
    ret: (pl, qn, ytd, qr, r1) => `Visų ${pl} pakopos pensijų fondų svertinė grąža nuo metų pradžios – ${ytd}${qr ? `, ${qn} – ${qr}` : ''}${r1 ? `; per 12 mėnesių – ${r1}` : ''}.`,
    gain1: (pl, qn, v, y) => `${pl} pakopos pensijų fondai ${qn} uždirbo apie ${v} investicinio prieaugio${y ? `, nuo metų pradžios – apie ${y}` : ''}.`,
    per: (pl, v, y) => `Vienam ${pl} pakopos dalyviui vidutiniškai teko ${v} sukaupto turto${y ? ` (prieš metus – ${y})` : ''}.`,
    lc: (lo, lg, hi, hg) => `Gyvenimo ciklo grupių vidutinė grąža nuo metų pradžios svyravo nuo ${lo} (${lg}) iki ${hi} (${hg}).`,
    mgr: (a, as, p, ps) => `Didžiausias valdytojas pagal turtą – ${a} (${as} rinkos), pagal dalyvių skaičių – ${p} (${ps}).`,
    both: (d, v, n) => `${d} II ir III pakopos pensijų fondai kartu valdė ${v}${n ? `, juose buvo ${n} dalyvavimų` : ''}.`,
    chg: (hi, hv, lo, lv) => `Dalyvių skaičiaus pokytis per ketvirtį pagal valdytoją – nuo ${lo} (${lv}) iki ${hi} (${hv}).`,
    m1: (m, pl, v, s, p, ps) => `${m} valdė ${v} ${pl} pakopos turto (${s} rinkos) ir turėjo ${p} dalyvių (${ps}).`,
    m2: (m, q, nq) => `Per ketvirtį ${m} dalyvių skaičius pakito ${q}, turtas – ${nq}.`,
    m3: (m, k, n) => `${m} fondų grąža nuo metų pradžios viršijo LB grupės vidurkį ${k} iš ${n} grupių.`,
    m4: (m, best) => `Geriausia ${m} fondo vieta grupėje nuo metų pradžios: ${best}.`,
    calcNav: 'Fondų grynųjų aktyvų suma ataskaitoje.', calcPart: 'Fondų dalyvių suma ataskaitoje.', calcRet: 'LB svertinis visų fondų vidurkis („Visi fondai“, svoriai – turtas ataskaitos dieną); ketvirčio grąža – fondų ketvirčio grąžų vidurkis, svertas turtu ketvirčio pabaigoje (fondo ketvirčio grąža = (1 + grąža nuo metų pradžios) ÷ (1 + ankstesnio ketvirčio grąža nuo metų pradžios) − 1).',
    calcGain: 'Σ fondo ketvirčio grąža × (turtas ketvirčio pradžioje + pusė įmokų ir išmokų srauto; nuo 2026 II ketv. – visas srautas, nes reformos išmokos mokamos ketvirčio pradžioje). Apytikslis įvertis.', calcPer: 'Grynieji aktyvai ÷ dalyviai.', calcLc: 'LB svertiniai grupių vidurkiai.', calcMgr: 'Valdytojo fondų suma ÷ visa pakopa.', calcChg: 'Valdytojo dalyviai dabar − ankstesnio ketvirčio pabaigoje.', calcM3: 'Valdytojo fondo grąža nuo metų pradžios lyginama su LB grupės vidurkiu tose grupėse, kur valdytojas turi fondą.',
  },
});

/* ---------- duomenys ---------- */
const MC = Object.fromEntries(MKT.cols.row.map((k, i) => [k, i])), MA = Object.fromEntries(MKT.cols.avg.map((k, i) => [k, i]));
const MS = { pl: 'II', d: null, mgr: '', grp: '', sort: 'ret_ytd', ch: 'part', sh: 'nav' };
try { Object.assign(MS, JSON.parse(localStorage.getItem('mktState') || '{}')); } catch (e) {}
if (!MKT[MS.pl]) MS.pl = 'II';
const mkSave = () => { try { localStorage.setItem('mktState', JSON.stringify(MS)); } catch (e) {} };
const P = () => MKT[MS.pl];
const mkIdx = {};
['II', 'III'].forEach(pl => { const m = new Map(); MKT[pl].rows.forEach(r => m.set(r[0] * 1000 + r[1], r)); mkIdx[pl] = m; });
function qBack(d, months) { let y = +d.slice(0, 4), m = +d.slice(5, 7) - months; while (m <= 0) { y--; m += 12; } return new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10); }
const dIdx = (pl, d) => MKT[pl].dates.indexOf(d);
const rowsAt = (pl, di) => MKT[pl].rows.filter(r => r[0] === di && (r[MC.nav] > 0 || r[MC.part] > 0));
const fundOf = (pl, r) => MKT[pl].funds[r[1]];
const rowOf = (pl, di, fid) => di < 0 ? null : mkIdx[pl].get(di * 1000 + fid) || null;
const avgOf = (pl, di, g) => MKT[pl].avgs.find(a => a[0] === di && a[1] === g) || null;
function totals(pl, di) {
  const t = { part: 0, nav: 0, nf: 0, ok: di >= 0 };
  if (di < 0) return t;
  rowsAt(pl, di).forEach(r => { t.part += r[MC.part] || 0; t.nav += r[MC.nav] || 0; t.nf++; });
  return t;
}
/* ketvirčio grąža visai pakopai ar grupei – fondų ketvirčio grąžų vidurkis, svertas fondų turtu ketvirčio pabaigoje
   (taip skaičiuoja LIPFA: sutampa su jų III pakopos 2025 III ketv. 4,93 % ir II pakopos 2026 II ketv. 11,5 %) */
function qRet(pl, di, gi = -1) {
  let s = 0, w = 0;
  if (di < 0) return null;
  rowsAt(pl, di).forEach(r => { if ((gi < 0 || fundOf(pl, r)[2] === gi) && r[MC.nav] && r[MC.ret_q] != null) { s += r[MC.nav] * r[MC.ret_q]; w += r[MC.nav]; } });
  return w ? s / w : null;
}
/* investicinis prieaugis per ketvirtį: kiekvieno fondo q × (turtas pradžioje + pusė pinigų srauto), srautas = pabaiga − pradžia × (1 + q).
   Nuo 2026 II ketv. reformos išmokos mokamos ketvirčio pradžioje, todėl tada visas srautas laikomas buvusiu pradžioje.
   Patikra: 2025 m. II pakopa – 618 mln. €, kaip LIPFA metų apžvalgoje. */
const payoutQ = d => d >= '2026-06-30';
function gainAt(pl, di) {
  if (di < 0) return null;
  const d = MKT[pl].dates[di], pd = dIdx(pl, qBack(d, 3)); if (pd < 0) return null;
  const k = payoutQ(d) ? 1 : 0.5;
  let s = 0, n = 0;
  rowsAt(pl, di).forEach(r => { const p = rowOf(pl, pd, r[1]); if (p && p[MC.nav] && r[MC.nav] && r[MC.ret_q] != null) { const q = r[MC.ret_q] / 100, fl = r[MC.nav] - p[MC.nav] * (1 + q); s += (p[MC.nav] + k * fl) * q; n++; } });
  return n ? s : null;
}
function gainYtd(pl, di) {
  const d = MKT[pl].dates[di], y = d.slice(0, 4); let s = 0;
  for (let m = +d.slice(5, 7); m >= 3; m -= 3) { const x = gainAt(pl, dIdx(pl, `${y}-${String(m).padStart(2, '0')}-${m === 6 || m === 9 ? 30 : 31}`)); if (x == null) return null; s += x; }
  return s;
}
function byMgr(pl, di) {
  const o = {};
  if (di < 0) return o;
  rowsAt(pl, di).forEach(r => { const p = fundOf(pl, r)[0], x = o[p] || (o[p] = { part: 0, nav: 0, nf: 0 }); x.part += r[MC.part] || 0; x.nav += r[MC.nav] || 0; x.nf++; });
  return o;
}
const groupKeyOf = (pl, gi) => MKT[pl].groups[gi][0];
function groupLbl(pl, gi) { const k = groupKeyOf(pl, gi), gl = T().gl; return /^\d{4}-\d{4}$/.test(k) ? gl.born(k) : k === 'akc' ? (pl === 'II' ? gl.akc2 : gl.akc3) : gl[k] || k; }
const groupsAt = (pl, di) => [...new Set(rowsAt(pl, di).map(r => fundOf(pl, r)[2]))].sort((a, b) => MK_ORDER.indexOf(groupKeyOf(pl, a)) - MK_ORDER.indexOf(groupKeyOf(pl, b)));

/* ---------- formatai ---------- */
const mInt = x => Math.round(x).toLocaleString(T().locale);
const mSInt = x => (x >= 0 ? '+' : '−') + mInt(Math.abs(x));
const mMn = v => v >= 1000 ? `${num(v / 1000, 2)} ${lang === 'lt' ? 'mlrd. €' : 'bn €'}` : `${num(v, v < 10 ? 2 : 1)} ${lang === 'lt' ? 'mln. €' : 'm €'}`;
const mSMn = v => (v >= 0 ? '+' : '−') + mMn(Math.abs(v));
const mRel = (a, b) => a != null && b ? pct((a / b - 1) * 100) : '';
const mPct = v => v == null ? '–' : pct(v);
const mShare = (a, b) => b ? pctPlain(a / b * 100, 1) : '–';
const mEurs = v => `${mInt(v)} €`;
const mCell = (v, f) => v == null || (typeof v === 'number' && !isFinite(v)) ? '–' : f(v);
const mCls = v => v == null ? '' : v > 0 ? ' up' : v < 0 ? ' down' : '';

/* ---------- valdikliai ---------- */
function mkBar(extra = '') {
  const t = T(), p = P(), opt = (v, l, cur) => `<option value="${v}"${v === cur ? ' selected' : ''}>${hEsc(l)}</option>`;
  const mgrs = MK_PROV.filter(m => p.funds.some(f => f[0] === m) && Object.keys(byMgr(MS.pl, dIdx(MS.pl, MS.d))).includes(m));
  return `<div class="bar mkbar"><span class="seg" role="group" aria-label="${t.pl}">${['II', 'III'].map(x => `<button type="button" data-pl="${x}" aria-pressed="${x === MS.pl}">${x} ${lang === 'lt' ? 'pakopa' : 'pillar'}</button>`).join('')}</span>`
    + `<label class="field">${t.q} <select data-k="d">${[...p.dates].reverse().map(d => opt(d, t.dq(d), MS.d)).join('')}</select></label>`
    + `<label class="field">${t.hl} <select data-k="mgr">${opt('', t.hlNone, MS.mgr)}${mgrs.map(m => opt(m, m, MS.mgr)).join('')}</select></label>${extra}</div>`;
}
function mkFixState() {
  const p = P();
  if (!p.dates.includes(MS.d)) MS.d = p.dates[p.dates.length - 1];
}
document.addEventListener('click', e => {
  const b = e.target.closest('.mkbar [data-pl]'); if (!b) return;
  MS.pl = b.dataset.pl; MS.grp = ''; const d = MS.d; mkFixState(); if (P().dates.includes(d)) MS.d = d; mkSave(); mkRender();
});
document.addEventListener('change', e => {
  const s = e.target.closest('[data-k]'); if (!s || !s.closest('.mkbar')) return;
  MS[s.dataset.k] = s.value; mkSave(); mkRender();
});

/* ---------- faktai ---------- */
function mkFacts() {
  const t = T(), F = t.f, pl = MS.pl, p = P(), di = dIdx(pl, MS.d), d = MS.d, dq = dIdx(pl, qBack(d, 3)), dy = dIdx(pl, qBack(d, 12));
  const T0 = totals(pl, di), Tq = totals(pl, dq), Ty = totals(pl, dy), A = avgOf(pl, di, -1), Ay = avgOf(pl, dy, -1);
  const L = t.dLong(d), qn = t.qn(d), src = t.srcLB(pl, d), out = [];
  const add = (h, text, calc, hl) => out.push({ h, text, calc, src, hl });
  add(F.navH, F.nav(pl, L, mMn(T0.nav), Tq.ok && Tq.nav ? `${mSMn(T0.nav - Tq.nav)} (${mRel(T0.nav, Tq.nav)})` : '', Ty.ok && Ty.nav ? `${mSMn(T0.nav - Ty.nav)} (${mRel(T0.nav, Ty.nav)})` : ''), F.calcNav);
  add(F.partH, (pl === 'III' ? F.part3 : F.part)(pl, L, mInt(T0.part), Tq.ok && Tq.part ? `${mSInt(T0.part - Tq.part)} (${mRel(T0.part, Tq.part)})` : '', Ty.ok && Ty.part ? `${mSInt(T0.part - Ty.part)} (${mRel(T0.part, Ty.part)})` : ''), F.calcPart);
  if (A && A[MA.ret_ytd] != null) add(F.retH, F.ret(pl, qn, pct(A[MA.ret_ytd]), d.slice(5, 7) !== '03' && qRet(pl, di) != null ? pct(qRet(pl, di)) : '', A[MA.ret_1y] != null ? pct(A[MA.ret_1y]) : ''), F.calcRet);
  const g = gainAt(pl, di), gy = gainYtd(pl, di);
  if (g != null) add(F.gainH, F.gain1(pl, qn, mMn(Math.abs(g)).replace(/^/, g < 0 ? '−' : ''), d.slice(5, 7) !== '03' && gy != null ? mMn(Math.abs(gy)).replace(/^/, gy < 0 ? '−' : '') : ''), F.calcGain);
  if (pl === 'II' && T0.part) add(F.perH, F.per(pl, mEurs(T0.nav * 1e6 / T0.part), Ty.part ? mEurs(Ty.nav * 1e6 / Ty.part) : ''), F.calcPer);
  const lc = groupsAt(pl, di).filter(gi => /^\d{4}-\d{4}$/.test(groupKeyOf(pl, gi))).map(gi => ({ gi, a: avgOf(pl, di, gi) })).filter(x => x.a && x.a[MA.ret_ytd] != null).sort((a, b) => a.a[MA.ret_ytd] - b.a[MA.ret_ytd]);
  if (lc.length > 1) add(F.lcH, F.lc(pct(lc[0].a[MA.ret_ytd]), groupLbl(pl, lc[0].gi), pct(lc[lc.length - 1].a[MA.ret_ytd]), groupLbl(pl, lc[lc.length - 1].gi)), F.calcLc);
  const M = byMgr(pl, di), Mq = byMgr(pl, dq), ms = Object.entries(M);
  if (ms.length > 1) {
    const a = [...ms].sort((x, y) => y[1].nav - x[1].nav)[0], b = [...ms].sort((x, y) => y[1].part - x[1].part)[0];
    add(F.mgrH, F.mgr(a[0], mShare(a[1].nav, T0.nav), b[0], mShare(b[1].part, T0.part)), F.calcMgr);
    const ch = ms.filter(([m]) => Mq[m]).map(([m, x]) => [m, x.part - Mq[m].part]).sort((x, y) => y[1] - x[1]);
    if (ch.length > 1) add(F.chgH, F.chg(ch[0][0], mSInt(ch[0][1]), ch[ch.length - 1][0], mSInt(ch[ch.length - 1][1])), F.calcChg);
  }
  const other = pl === 'II' ? 'III' : 'II', od = dIdx(other, d);
  if (od >= 0) { const o = totals(other, od); if (o.nav) add(F.bothH, F.both(L, mMn(T0.nav + o.nav), mInt(T0.part + o.part)), F.calcNav); }
  if (MS.mgr && M[MS.mgr]) {
    const m = MS.mgr, x = M[m], q = Mq[MS.mgr], hl = [];
    hl.push({ h: m, text: F.m1(m, pl, mMn(x.nav), mShare(x.nav, T0.nav), mInt(x.part), mShare(x.part, T0.part)), calc: F.calcMgr, src, hl: true });
    if (q) hl.push({ h: m, text: F.m2(m, `${mSInt(x.part - q.part)} (${mRel(x.part, q.part)})`, `${mSMn(x.nav - q.nav)} (${mRel(x.nav, q.nav)})`), calc: F.calcChg, src, hl: true });
    let k = 0, n = 0, best = null;
    groupsAt(pl, di).forEach(gi => {
      const a = avgOf(pl, di, gi), rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC.ret_ytd] != null).sort((u, v) => v[MC.ret_ytd] - u[MC.ret_ytd]);
      const mine = rs.filter(r => fundOf(pl, r)[0] === m);
      if (!mine.length) return;
      if (a && a[MA.ret_ytd] != null) { n++; if (mine.some(r => r[MC.ret_ytd] > a[MA.ret_ytd])) k++; }
      const pos = rs.indexOf(mine[0]) + 1; if (!best || pos < best.pos) best = { pos, of: rs.length, g: groupLbl(pl, gi) };
    });
    if (n) hl.push({ h: m, text: F.m3(m, k, n), calc: F.calcM3, src, hl: true });
    if (best) hl.push({ h: m, text: F.m4(m, lang === 'lt' ? `${best.pos} iš ${best.of} (${best.g})` : `${best.pos} of ${best.of} (${best.g})`), calc: F.calcM3, src, hl: true });
    out.unshift(...hl);
  }
  return out;
}
function renderFacts() {
  const t = T(), fs = mkFacts(), el = document.getElementById('qfCards');
  el.innerHTML = fs.map((f, i) => `<article class="fact${f.hl ? ' hl' : ''}"><span class="fh">${hEsc(f.h)}</span><p>${hEsc(f.text)}</p><small>${hEsc(f.src)} ${t.how} ${hEsc(f.calc)}</small><button type="button" class="btn" data-fact="${i}">${t.copy}</button></article>`).join('');
  el._facts = fs;
  document.getElementById('qfAll').textContent = t.copyAll;
  renderKeyTable();
}
async function mkCopy(text, b) {
  try { await navigator.clipboard.writeText(text); } catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  const o = b.textContent; b.textContent = '✓ ' + T().copied; setTimeout(() => { b.textContent = o; }, 1500);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-fact], #qfAll'); if (!b) return;
  const fs = document.getElementById('qfCards')._facts || [];
  const pick = b.id === 'qfAll' ? fs : [fs[+b.dataset.fact]];
  mkCopy(pick.map(f => `${f.text} ${f.src}`).join('\n\n'), b);
});
function renderKeyTable() {
  const t = T(), I = t.ind, pl = MS.pl, d = MS.d, ds = [d, qBack(d, 3), qBack(d, 12)].map(x => dIdx(pl, x));
  const vals = ds.map(di => { if (di < 0) return null; const T0 = totals(pl, di), A = avgOf(pl, di, -1), m = MKT[pl].dates[di].slice(5, 7);
    return { part: T0.part, nav: T0.nav, per: pl === 'II' && T0.part ? T0.nav * 1e6 / T0.part : null, ytd: A ? A[MA.ret_ytd] : null, r1: A ? A[MA.ret_1y] : null, qret: qRet(pl, di), gain: gainAt(pl, di), gainY: m === '03' ? null : gainYtd(pl, di), nf: T0.nf }; });
  const fm = { part: mInt, nav: v => num(v, 1), per: mInt, ytd: v => pct(v), r1: v => pct(v), qret: v => pct(v), gain: v => num(v, 1), gainY: v => num(v, 1), nf: mInt };
  const dv = (k, a, b) => a == null || b == null ? '–' : ['ytd', 'r1', 'qret'].includes(k) ? `${(a - b >= 0 ? '+' : '−') + num(Math.abs(a - b), 2)} ${lang === 'lt' ? 'p. p.' : 'pp'}` : ['gain', 'gainY', 'nf'].includes(k) ? (a - b >= 0 ? '+' : '−') + num(Math.abs(a - b), k === 'nf' ? 0 : 1) : b ? pct((a / b - 1) * 100) : '–';
  const keys = Object.keys(I).filter(k => k !== 'per' || pl === 'II');
  const c = (k, i) => vals[i] == null || vals[i][k] == null ? '–' : fm[k](vals[i][k]);
  document.getElementById('qfTable').innerHTML = `<thead><tr><th class="l">${t.thInd}</th><th>${t.thNow}<br><small>${d}</small></th><th>${t.thPrevQ}<br><small>${qBack(d, 3)}</small></th><th>${t.thPrevY}<br><small>${qBack(d, 12)}</small></th><th>${t.thDq}</th><th>${t.thDy}</th></tr></thead><tbody>`
    + keys.map(k => `<tr><td class="l">${I[k]}</td><td>${c(k, 0)}</td><td>${c(k, 1)}</td><td>${c(k, 2)}</td><td>${vals[1] ? dv(k, vals[0][k], vals[1][k]) : '–'}</td><td>${vals[2] ? dv(k, vals[0][k], vals[2][k]) : '–'}</td></tr>`).join('') + '</tbody>';
  const T0 = vals[0];
  const kp = document.getElementById('qfKpis'), items = [[t.kPart(pl), mInt(T0.part), vals[1] ? dv('part', T0.part, vals[1].part) + ' · ' + t.dq(d) : t.dq(d)], [t.kNav(pl), mMn(T0.nav), vals[1] ? dv('nav', T0.nav, vals[1].nav) : ''],
    T0.ytd != null ? [t.kYtd, pct(T0.ytd), t.dq(d)] : null, T0.gain != null ? [t.kGain, mMn(Math.abs(T0.gain)).replace(/^/, T0.gain < 0 ? '−' : '+'), t.qn(d)] : null];
  kp.innerHTML = items.filter(Boolean).map(([k, v, s]) => `<div class="kpi"><span>${k}</span><b>${v}</b>${s ? `<small>${s}</small>` : ''}</div>`).join('');
}

/* ---------- rinka laike ---------- */
function mkSeries() {
  const pl = MS.pl;
  return MKT[pl].dates.map((d, di) => { const T0 = totals(pl, di), A = avgOf(pl, di, -1); return { d, di, ...T0, per: T0.part ? T0.nav * 1e6 / T0.part : null, ytd: A ? A[MA.ret_ytd] : null, qret: qRet(pl, di), r1: A ? A[MA.ret_1y] : null, gain: gainAt(pl, di) }; });
}
function renderTime() {
  const t = T(), S = mkSeries(), el = document.getElementById('mkChart'), k = MS.ch;
  document.getElementById('mkSeg').innerHTML = Object.keys(t.chOf).filter(x => x !== 'per' || MS.pl === 'II').map(x => `<button type="button" data-ch="${x}" aria-pressed="${x === k}">${t.chOf[x]}</button>`).join('');
  const pts = S.filter(s => s[k] != null && s.nf).map(s => [dayOf(s.d), s[k]]);
  if (!el.closest('[hidden]')) drawLineChart(el, [{ provider: 'mkt', color: 'var(--s1)', label: `${MS.pl} ${lang === 'lt' ? 'pakopa' : 'pillar'}`, points: pts }], pts[0][0], pts[pts.length - 1][0],
    { axisUnit: '', zero: false, ml: 70, fmt: v => k === 'nav' ? mMn(v) : k === 'per' ? mEurs(v) : mInt(v) });
  const qd = (a, b) => a.ok && b && b.ok && b.part ? b : null;
  document.getElementById('mkTable').innerHTML = `<thead><tr><th class="l">${t.thDate}</th><th>${t.thPart}</th><th>${t.thDq}</th><th>${t.thDy}</th><th>${t.thNav}</th><th>${t.thDq}</th><th>${t.thDy}</th>${MS.pl === 'II' ? `<th>${t.thPer}</th>` : ''}<th>${t.thYtd}</th><th>${t.thQ}</th><th>${t.th1y}</th><th>${t.thGain}</th></tr></thead><tbody>`
    + [...S].reverse().filter(s => s.nf).map(s => { const q = S[dIdx(MS.pl, qBack(s.d, 3))], y = S[dIdx(MS.pl, qBack(s.d, 12))];
      return `<tr${s.d === MS.d ? ' class="cur"' : ''}><td class="l">${s.d}</td><td>${mInt(s.part)}</td><td class="${mCls(q && s.part - q.part)}">${q ? mSInt(s.part - q.part) : '–'}</td><td class="${mCls(y && s.part - y.part)}">${y ? mSInt(s.part - y.part) : '–'}</td>`
        + `<td>${num(s.nav, 1)}</td><td>${q ? mRel(s.nav, q.nav) : '–'}</td><td>${y ? mRel(s.nav, y.nav) : '–'}</td>${MS.pl === 'II' ? `<td>${mCell(s.per, mInt)}</td>` : ''}<td>${mPct(s.ytd)}</td><td>${mPct(s.qret)}</td><td>${mPct(s.r1)}</td><td>${mCell(s.gain, v => num(v, 1))}</td></tr>`; }).join('') + '</tbody>';
  // dalyviai pagal grupes – paskutiniai 6 ketvirčiai iki pasirinkto
  const pl = MS.pl, di = dIdx(pl, MS.d), cols = []; for (let i = di; i >= 0 && cols.length < 6; i--) cols.unshift(i);
  const gs = [...new Set(cols.flatMap(c => groupsAt(pl, c)))].sort((a, b) => MK_ORDER.indexOf(groupKeyOf(pl, a)) - MK_ORDER.indexOf(groupKeyOf(pl, b)));
  const sumG = (c, gi) => rowsAt(pl, c).filter(r => fundOf(pl, r)[2] === gi).reduce((s, r) => s + (r[MC.part] || 0), 0);
  const dy = dIdx(pl, qBack(MS.d, 12));
  document.getElementById('gpTable').innerHTML = `<thead><tr><th class="l">${t.thGroup}</th>${cols.map(c => `<th>${MKT[pl].dates[c]}</th>`).join('')}<th>${t.thDy}</th></tr></thead><tbody>`
    + gs.map(gi => { const v = cols.map(c => sumG(c, gi)), y = dy >= 0 ? sumG(dy, gi) : 0, last = v[v.length - 1];
      return `<tr><td class="l">${groupLbl(pl, gi)}</td>${v.map(x => `<td>${x ? mInt(x) : '–'}</td>`).join('')}<td class="${mCls(y && last - y)}">${y && last ? `${mSInt(last - y)} (${mRel(last, y)})` : '–'}</td></tr>`; }).join('')
    + `<tr class="tot"><td class="l">${t.thTot}</td>${cols.map(c => `<td>${mInt(totals(pl, c).part)}</td>`).join('')}<td></td></tr></tbody>`;
}
document.addEventListener('click', e => { const b = e.target.closest('#mkSeg [data-ch]'); if (b) { MS.ch = b.dataset.ch; mkSave(); renderTime(); } });

/* ---------- valdytojai ---------- */
function renderMgr() {
  const t = T(), pl = MS.pl, di = dIdx(pl, MS.d), dq = dIdx(pl, qBack(MS.d, 3)), dy = dIdx(pl, qBack(MS.d, 12));
  const M = byMgr(pl, di), Mq = byMgr(pl, dq), My = byMgr(pl, dy), T0 = totals(pl, di), Tq = totals(pl, dq);
  const list = Object.entries(M).sort((a, b) => b[1].nav - a[1].nav);
  const sh = (x, tot) => tot ? x / tot * 100 : null;
  const dpp = (a, b) => a == null || b == null ? '–' : `${(a - b >= 0 ? '+' : '−') + num(Math.abs(a - b), 2)} ${lang === 'lt' ? 'p. p.' : 'pp'}`;
  document.getElementById('mgT').innerHTML = `<thead><tr><th class="l">${t.thMgr}</th><th>${t.thFunds}</th><th>${t.thPart}</th><th>${t.thShare}</th><th>${t.thDq}</th><th>${t.thDy}</th><th>${t.thNav}</th><th>${t.thShare}</th><th>${t.thDq}</th><th>${t.thDy}</th>${pl === 'II' ? `<th>${t.thPer}</th>` : ''}</tr></thead><tbody>`
    + list.map(([m, x]) => { const q = Mq[m], y = My[m];
      return `<tr${m === MS.mgr ? ' class="hl"' : ''}><td class="l"><i class="sw" style="background:${mkColor(m)}"></i>${m}</td><td>${x.nf}</td><td>${mInt(x.part)}</td><td>${mShare(x.part, T0.part)}</td><td class="${mCls(q && x.part - q.part)}">${q ? mSInt(x.part - q.part) : '–'}</td><td class="${mCls(y && x.part - y.part)}">${y ? mSInt(x.part - y.part) : '–'}</td>`
        + `<td>${num(x.nav, 1)}</td><td>${mShare(x.nav, T0.nav)}</td><td title="${q ? dpp(sh(x.nav, T0.nav), sh(q.nav, Tq.nav)) : ''}">${q ? mRel(x.nav, q.nav) : '–'}</td><td>${y ? mRel(x.nav, y.nav) : '–'}</td>${pl === 'II' ? `<td>${x.part ? mInt(x.nav * 1e6 / x.part) : '–'}</td>` : ''}</tr>`; }).join('')
    + `<tr class="tot"><td class="l">${t.thTot}</td><td>${T0.nf}</td><td>${mInt(T0.part)}</td><td>100 %</td><td>${Tq.ok && Tq.part ? mSInt(T0.part - Tq.part) : '–'}</td><td></td><td>${num(T0.nav, 1)}</td><td>100 %</td><td>${Tq.ok && Tq.nav ? mRel(T0.nav, Tq.nav) : '–'}</td><td></td>${pl === 'II' ? `<td>${T0.part ? mInt(T0.nav * 1e6 / T0.part) : '–'}</td>` : ''}</tr></tbody>`;
  document.getElementById('mgSeg').innerHTML = Object.keys(t.shOf).map(x => `<button type="button" data-sh="${x}" aria-pressed="${x === MS.sh}">${t.shOf[x]}</button>`).join('');
  const el = document.getElementById('mgChartBox');
  if (el.closest('[hidden]')) return;
  const ds = MKT[pl].dates, ser = MK_PROV.map(m => ({ provider: m, color: mkColor(m), label: m, points: ds.map((d, i) => { const x = byMgr(pl, i)[m], T1 = totals(pl, i); return x && T1[MS.sh] ? [dayOf(d), x[MS.sh] / T1[MS.sh] * 100] : null; }).filter(Boolean) })).filter(s => s.points.length > 1);
  ser.forEach(s => { if (MS.mgr && s.provider !== MS.mgr) s.color = `color-mix(in srgb, ${s.color} 30%, transparent)`; });
  drawLineChart(el, ser, dayOf(ds[0]), dayOf(ds[ds.length - 1]), { fmt: v => pctPlain(v, 1), mr: el.clientWidth > 560 ? 90 : 16 });
  document.getElementById('mgLegend').innerHTML = ser.map(s => `<span class="chip"><i style="background:${mkColor(s.provider)}"></i>${s.provider}</span>`).join(' ');
}
document.addEventListener('click', e => { const b = e.target.closest('#mgSeg [data-sh]'); if (b) { MS.sh = b.dataset.sh; mkSave(); renderMgr(); } });

/* ---------- fondai pagal grupes ---------- */
const SORTS = ['ret_ytd', 'ret_q', 'ret_1y', 'ret_3y', 'ret_5y', 'part', 'nav'];
function renderFunds() {
  const t = T(), pl = MS.pl, di = dIdx(pl, MS.d), dq = dIdx(pl, qBack(MS.d, 3)), gs = groupsAt(pl, di);
  if (MS.grp && !gs.map(String).includes(String(MS.grp))) MS.grp = '';
  if (!SORTS.includes(MS.sort)) MS.sort = 'ret_ytd';
  const sl = { ret_ytd: t.thYtd, ret_q: t.thQ, ret_1y: t.th1y, ret_3y: t.th3y, ret_5y: t.th5y, part: t.thPart, nav: t.thNav };
  document.getElementById('fdBar').innerHTML = mkBar(`<label class="field">${t.grp} <select data-k="grp"><option value="">${t.grpAll}</option>${gs.map(g => `<option value="${g}"${String(g) === String(MS.grp) ? ' selected' : ''}>${hEsc(groupLbl(pl, g))}</option>`).join('')}</select></label>`
    + `<label class="field">${t.sortBy} <select data-k="sort">${SORTS.map(s => `<option value="${s}"${s === MS.sort ? ' selected' : ''}>${sl[s]}</option>`).join('')}</select></label>`);
  const show = MS.grp === '' ? gs : gs.filter(g => String(g) === String(MS.grp));
  const k = MC[MS.sort];
  const hdr = `<tr><th>#</th><th class="l">${t.thFund}</th><th>${t.thPart}</th><th>${t.thDq}</th><th>${t.thNav}</th><th>${t.thYtd}</th><th>${t.thQ}</th><th>${t.th1y}</th><th>${t.th3y}</th><th>${t.th5y}</th><th>${t.thGcf}</th><th>${t.thBm}</th><th>${t.thRisky}</th></tr>`;
  const html = show.map(gi => {
    const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi).sort((a, b) => (b[k] ?? -1e9) - (a[k] ?? -1e9)), a = avgOf(pl, di, gi);
    const body = rs.map((r, i) => { const f = fundOf(pl, r), q = rowOf(pl, dq, r[1]);
      return `<tr${f[0] === MS.mgr ? ' class="hl"' : ''}><td>${r[k] == null ? '' : i + 1}</td><td class="l"><i class="sw" style="background:${mkColor(f[0])}"></i>${hEsc(f[1])}</td><td>${mCell(r[MC.part], mInt)}</td><td class="${mCls(q && r[MC.part] - q[MC.part])}">${q && q[MC.part] != null && r[MC.part] != null ? mSInt(r[MC.part] - q[MC.part]) : '–'}</td><td>${mCell(r[MC.nav], v => num(v, 2))}</td>`
        + ['ret_ytd', 'ret_q', 'ret_1y', 'ret_3y', 'ret_5y', 'ret_gcf', 'bm_ytd'].map(c => `<td>${mPct(r[MC[c]])}</td>`).join('') + `<td>${mCell(r[MC.risky], v => pctPlain(v, 1))}</td></tr>`; }).join('');
    const avg = a ? `<tr class="tot"><td></td><td class="l">${t.thAvg}</td><td>${mInt(rs.reduce((s, r) => s + (r[MC.part] || 0), 0))}</td><td></td><td>${num(rs.reduce((s, r) => s + (r[MC.nav] || 0), 0), 2)}</td>${['ret_ytd', 'ret_q', 'ret_1y', 'ret_3y', 'ret_5y', 'ret_gcf', 'bm_ytd'].map(c => `<td>${mPct(c === 'ret_q' ? qRet(pl, di, gi) : a[MA[c]])}</td>`).join('')}<td></td></tr>` : '';
    return `<h3 class="gh">${hEsc(groupLbl(pl, gi))}</h3><div class="scroll"><table class="at" id="fd_${pl}_${groupKeyOf(pl, gi)}"><thead>${hdr}</thead><tbody>${body}${avg}</tbody></table></div>`;
  }).join('');
  document.getElementById('fdTables').innerHTML = html || `<p class="note">${t.fdNone}</p>`;
}

/* ---------- visa rinkos dalis ---------- */
function mkRender() {
  mkFixState();
  const t = T();
  ['tdTitle', 'qfTitle', 'mkTitle', 'mgTitle', 'fdTitle', 'qfLead', 'mkLead', 'mgLead', 'fdLead', 'gpTitle', 'gpLead', 'mgChart'].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = t[id]; });
  ['qfNote', 'mkNote', 'mgNote', 'fdNote'].forEach(id => { document.getElementById(id).textContent = t.noteLB; });
  document.getElementById('mkGainN').textContent = t.noteGain;
  ['qfBar', 'mkBar', 'mgBar'].forEach(id => { document.getElementById(id).innerHTML = mkBar(); });
  renderFacts(); renderTime(); renderMgr(); renderFunds();
  if (typeof srcLines === 'function') srcLines();
}
function mkTabs() {
  addSubnav([['tdTitle'], ['qfTitle'], ['mkTitle'], ['mgTitle'], ['fdTitle']].map(([id]) => ({ id, label: T()[id] })));
}
let mkRz; addEventListener('resize', () => { clearTimeout(mkRz); mkRz = setTimeout(() => { renderTime(); renderMgr(); }, 120); });
