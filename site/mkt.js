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
function gainAt(pl, di, m) {                // m – tik šio valdytojo fondai
  if (di < 0) return null;
  const d = MKT[pl].dates[di], pd = dIdx(pl, qBack(d, 3)); if (pd < 0) return null;
  const k = payoutQ(d) ? 1 : 0.5;
  let s = 0, n = 0;
  rowsAt(pl, di).forEach(r => { const p = rowOf(pl, pd, r[1]); if ((!m || fundOf(pl, r)[0] === m) && p && p[MC.nav] && r[MC.nav] && r[MC.ret_q] != null) { const q = r[MC.ret_q] / 100, fl = r[MC.nav] - p[MC.nav] * (1 + q); s += (p[MC.nav] + k * fl) * q; n++; } });
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

/* ---------- faktai ----------
   Kiekvienas faktas – {h, text, calc, src, hl, nums}. nums – visi sakinio skaičiai su Excel formulėmis (savininkas 2026-10-19: „baisu viešinti
   duomenis, kurių negaliu kokybiškai patikrinti“): {l – pavadinimas, v – reikšmė svetainėje, f(c, X) – formulė (c(i) – i-ojo skaičiaus langelis,
   X – duomenų lapų informacija), z – formatas}. Excel faile (mkFactBook) kiekvienas skaičius – formulė iš lapų „LB duomenys“ ir „LB vidurkiai“. */
addStrings({
  fx: {
    flowH: 'Change in assets', flow: (v, g, fl) => `Over the quarter assets changed by ${v}: investment gain of about ${g} and contributions minus payouts of about ${fl}.`,
    calcFlow: 'Change = assets at quarter end − at quarter start; contributions minus payouts = change − investment gain (an estimate).',
    concH: 'Market concentration', conc: (n3, s3, hhi) => `The three largest managers (${n3}) manage ${s3} of the pillar’s assets; the market concentration index (HHI) is ${hhi}.`,
    calcConc: 'Managers’ shares of assets; HHI = Σ (share, %)²; above 2,500 a market is considered highly concentrated.',
    beatH: 'Funds vs group averages', beat: (k, n) => `Since the start of the year ${k} of ${n} funds earned more than their Bank of Lithuania group weighted average.`,
    calcBeat: 'In each Bank of Lithuania group – funds whose return since the start of the year is above the group average; summed over groups.',
    bmH: 'Benchmarks', bm: (k, n) => `Since the start of the year ${k} of ${n} funds beat their benchmark.`,
    calcBm: 'Fund return since the start of the year > its benchmark return (both from the Bank of Lithuania file); only funds with both figures.',
    recH: 'Records', recNow: v => `Pillar assets (${v}) are the highest in the whole Bank of Lithuania series since 2015.`, recWas: (v, d, now) => `The highest pillar assets were ${v} on ${d}; now ${now}.`,
    calcRec: 'Largest sum of pillar net assets over all quarters up to the selected one.',
    grH: 'Assets over 5 years', gr: (a, b, x, c, up) => `Over 5 years pillar assets ${up ? 'grew' : 'fell'} from ${a} to ${b}${up && x >= 1.5 ? ` (×${num(x, 1)})` : ''}, on average ${c} a year.`,
    calcGr: 'Assets now ÷ assets 5 years ago; annual growth = ratio^(1/5) − 1 (includes both contributions and returns).',
    m2: (m, pq, pr, mq, py, pyr, my) => `Over the quarter ${m}’s participants changed by ${pq} (${pr}; whole pillar ${mq}), over the year by ${py} (${pyr}; whole pillar ${my}).`,
    m5: (m, s0, a, b) => `${m}’s share of assets is ${s0}; over the year it changed by ${a}${b ? `, over 3 years by ${b}` : ''}.`,
    calcM5: 'Manager’s assets ÷ whole pillar assets; change in percentage points.',
    m6: (m, g, s) => `${m}’s funds earned an investment gain of about ${g} in the quarter${s ? ` (${s} of the pillar’s gain)` : ''}.`,
    m7: (m, a, b) => `Average assets per ${m} participant: ${a} (pillar average ${b}).`,
    m3: (m, parts) => `${m}’s funds beat the Bank of Lithuania group average ${parts}.`,
    per: { ytd: 'since the start of the year', r1: 'over 1 year', r3: 'over 3 years' }, ofG: (k, n) => `in ${k} of ${n} groups`,
    calcM3: 'In each group where the manager has a fund, its best fund is compared with the Bank of Lithuania weighted group average (same group only).',
    calcM4: 'Place of the manager’s best fund by return since the start of the year among funds of the same group.',
    xl: 'Excel', xlAll: 'Excel with all calculations', miTitle: 'Manager insights', miLead: 'For each manager – market share and its trend, participants, investment gain and how its funds did against the Bank of Lithuania group averages. Funds are compared only within their group. “Excel” – every figure as a formula from the Bank of Lithuania data.',
    shTot: 'whole pillar', above: 'funds above average', withRet: 'funds with return', tot: 'Total', rank: 'Place', of: 'Funds in group', beatF: 'Beats average (1 = yes)', best: 'Manager’s best fund',
    sheetF: 'Facts', sheetT: 'Pillar over time', fact: 'Fact', fig: 'Figure in the sentence', val: 'Value', dates: 'Dates (all formulas use these cells)',
  },
}, {
  fx: {
    flowH: 'Turto pokytis', flow: (v, g, fl) => `Per ketvirtį turtas pakito ${v}: investicinis prieaugis – apie ${g}, įmokų ir išmokų balansas – apie ${fl}.`,
    calcFlow: 'Pokytis = turtas ketvirčio pabaigoje − pradžioje; įmokų ir išmokų balansas = pokytis − investicinis prieaugis (įvertis).',
    concH: 'Rinkos koncentracija', conc: (n3, s3, hhi) => `Trys didžiausi valdytojai (${n3}) valdo ${s3} pakopos turto; rinkos koncentracijos indeksas (HHI) – ${hhi}.`,
    calcConc: 'Valdytojų turto dalys; HHI = Σ (dalis, %)²; virš 2 500 rinka laikoma labai koncentruota.',
    beatH: 'Fondai ir grupių vidurkiai', beat: (k, n) => `Nuo metų pradžios ${k} iš ${n} fondų uždirbo daugiau nei jų LB grupės svertinis vidurkis.`,
    calcBeat: 'Kiekvienoje LB grupėje – fondai, kurių grąža nuo metų pradžios didesnė už LB grupės vidurkį; sudėta per grupes.',
    bmH: 'Lyginamieji indeksai', bm: (k, n) => `Nuo metų pradžios ${k} iš ${n} fondų grąža viršijo jų lyginamąjį indeksą.`,
    calcBm: 'Fondo grąža nuo metų pradžios > jo lyginamojo indekso grąža (abi – LB failas); tik fondai, turintys abu skaičius.',
    recH: 'Rekordai', recNow: v => `Pakopos turtas (${v}) – didžiausias per visą LB duomenų laikotarpį nuo 2015 m.`, recWas: (v, d, now) => `Didžiausias pakopos turtas – ${v} (${d}); dabar ${now}.`,
    calcRec: 'Didžiausia pakopos grynųjų aktyvų suma tarp visų ketvirčių iki pasirinkto.',
    grH: 'Turtas per 5 metus', gr: (a, b, x, c, up) => `Per 5 metus pakopos turtas ${up ? 'išaugo' : 'sumažėjo'} nuo ${a} iki ${b}${up && x >= 1.5 ? ` (${num(x, 1)} karto)` : ''}, vidutiniškai ${c} per metus.`,
    calcGr: 'Turtas dabar ÷ turtas prieš 5 metus; metinis augimas = santykis^(1/5) − 1 (apima ir įmokas, ir grąžą).',
    m2: (m, pq, pr, mq, py, pyr, my) => `Per ketvirtį ${m} dalyvių skaičius pakito ${pq} (${pr}; visos pakopos – ${mq}), per metus – ${py} (${pyr}; visos pakopos – ${my}).`,
    m5: (m, s0, a, b) => `${m} turto dalis rinkoje – ${s0}; per metus pakito ${a}${b ? `, per 3 metus – ${b}` : ''}.`,
    calcM5: 'Valdytojo turtas ÷ visos pakopos turtas; pokytis procentiniais punktais.',
    m6: (m, g, s) => `${m} fondai per ketvirtį uždirbo apie ${g} investicinio prieaugio${s ? ` (${s} visos pakopos prieaugio)` : ''}.`,
    m7: (m, a, b) => `Vidutinis ${m} dalyvio sukauptas turtas – ${a} (pakopos vidurkis – ${b}).`,
    m3: (m, parts) => `${m} fondų grąža viršijo LB grupės vidurkį ${parts}.`,
    per: { ytd: 'nuo metų pradžios', r1: 'per 1 metus', r3: 'per 3 metus' }, ofG: (k, n) => `${k} iš ${n} grupių`,
    calcM3: 'Kiekvienoje grupėje, kur valdytojas turi fondą, geriausias jo fondas lyginamas su LB svertiniu grupės vidurkiu (tik tos pačios grupės).',
    calcM4: 'Geriausio valdytojo fondo vieta pagal grąžą nuo metų pradžios tarp tos pačios grupės fondų.',
    xl: 'Excel', xlAll: 'Excel su visais skaičiavimais', miTitle: 'Valdytojų įžvalgos', miLead: 'Kiekvienam valdytojui – rinkos dalis ir jos kryptis, dalyviai, investicinis prieaugis ir kaip jo fondams sekėsi, palyginti su LB grupių vidurkiais. Fondai lyginami tik savo grupėje. „Excel“ – kiekvienas skaičius kaip formulė iš LB duomenų.',
    shTot: 'visa pakopa', above: 'fondų virš vidurkio', withRet: 'fondų su grąža', tot: 'Iš viso', rank: 'Vieta', of: 'Fondų grupėje', beatF: 'Viršija vidurkį (1 = taip)', best: 'Geriausias valdytojo fondas',
    sheetF: 'Faktai', sheetT: 'Pakopa laike', fact: 'Faktas', fig: 'Skaičius sakinyje', val: 'Reikšmė', dates: 'Datos (visos formulės naudoja šiuos langelius)',
  },
});
const MKD = { d0: '$B$4', dq: '$B$5', dy: '$B$6' };               // datų langeliai lape „Faktai“
const xq = s => `"${String(s).replace(/"/g, '""')}"`;
const crM = m => `${MKX.D}!B:B,${xq(m)}`, crG = (pl, gi) => `${MKX.D}!D:D,${xq(groupLbl(pl, gi))}`;
const fxNav = (R, ...cr) => S_('F', byD(R), ...cr), fxPart = (R, ...cr) => S_('E', byD(R), ...cr), fxGain = (R, ...cr) => S_('L', byD(R), ...cr);
const fxAvg = (col, R, lbl) => `SUMIFS(${MKX.V}!${col}:${col},${MKX.V}!A:A,${R},${MKX.V}!B:B,${xq(lbl)})`;
const fxQret = R => `IFERROR(${S_('S', byD(R))}/${S_('T', byD(R))},"")`;
const fxGainY = R => `SUMIFS(${MKX.D}!L:L,${MKX.D}!A:A,">="&DATE(YEAR(${R}),1,1),${MKX.D}!A:A,"<="&${R})`;
const fxBack = m => `EOMONTH(${MKD.d0},-${m})`;
const Zm = '#,##0.0', Zi = '#,##0', Zp = '0.00', Zr = '0.00%';
function NB() { const a = []; return { a, add: (l, v, f, z) => { a.push({ l, v, f, z }); return a.length - 1; }, v: i => a[i].v }; }
const mSg = v => (v < 0 ? '−' : '') + mMn(Math.abs(v));
const mPP = v => `${(v >= 0 ? '+' : '−') + num(Math.abs(v), 2)} ${lang === 'lt' ? 'p. p.' : 'pp'}`;
/* „dabar – prieš“ skaičių grupė: reikšmė prieš, skirtumas ir santykinis pokytis */
function nbCmp(nb, i, lbl, b, fb, z, k) {
  const t = T(), j = nb.add(`${lbl} · ${(k === 1 ? t.thPrevQ : t.thPrevY).toLowerCase()}`, b, fb, z), a = nb.v(i);
  nb.add(k === 1 ? t.thDq : t.thDy, a - b, c => `${c(i)}-${c(j)}`, z); nb.add(`${k === 1 ? t.thDq : t.thDy}, %`, b ? a / b - 1 : null, c => `IF(${c(j)}=0,"",${c(i)}/${c(j)}-1)`, Zr);
}
function mkFacts() {
  const t = T(), F = t.f, X = t.fx, I = t.ind, L = lang === 'lt', pl = MS.pl, di = dIdx(pl, MS.d), d = MS.d, dq = dIdx(pl, qBack(d, 3)), dy = dIdx(pl, qBack(d, 12));
  const T0 = totals(pl, di), Tq = totals(pl, dq), Ty = totals(pl, dy), A = avgOf(pl, di, -1), ALL = L ? 'Visi fondai' : 'All funds';
  const Ln = t.dLong(d), qn = t.qn(d), src = t.srcLB(pl, d), out = [], { d0, dq: Q, dy: Y } = MKD, now = ` · ${t.thNow.toLowerCase()}`;
  const add = (h, text, calc, nb, o = {}) => out.push({ h, text: text.replace(/\.\.$/, '.'), calc, src, nums: nb.a, ...o });
  { const nb = NB(), i = nb.add(I.nav + now, T0.nav, () => fxNav(d0), Zm);
    if (Tq.ok && Tq.nav) nbCmp(nb, i, I.nav, Tq.nav, () => fxNav(Q), Zm, 1);
    if (Ty.ok && Ty.nav) nbCmp(nb, i, I.nav, Ty.nav, () => fxNav(Y), Zm, 2);
    add(F.navH, F.nav(pl, Ln, mMn(T0.nav), Tq.ok && Tq.nav ? `${mSMn(T0.nav - Tq.nav)} (${mRel(T0.nav, Tq.nav)})` : '', Ty.ok && Ty.nav ? `${mSMn(T0.nav - Ty.nav)} (${mRel(T0.nav, Ty.nav)})` : ''), F.calcNav, nb); }
  { const nb = NB(), i = nb.add(I.part + now, T0.part, () => fxPart(d0), Zi);
    if (Tq.ok && Tq.part) nbCmp(nb, i, I.part, Tq.part, () => fxPart(Q), Zi, 1);
    if (Ty.ok && Ty.part) nbCmp(nb, i, I.part, Ty.part, () => fxPart(Y), Zi, 2);
    add(F.partH, (pl === 'III' ? F.part3 : F.part)(pl, Ln, mInt(T0.part), Tq.ok && Tq.part ? `${mSInt(T0.part - Tq.part)} (${mRel(T0.part, Tq.part)})` : '', Ty.ok && Ty.part ? `${mSInt(T0.part - Ty.part)} (${mRel(T0.part, Ty.part)})` : ''), F.calcPart, nb); }
  const q1 = d.slice(5, 7) === '03', qr = qRet(pl, di);
  if (A && A[MA.ret_ytd] != null) {
    const nb = NB(); nb.add(I.ytd, A[MA.ret_ytd], () => fxAvg('C', d0, ALL), Zp);
    if (!q1 && qr != null) nb.add(I.qret, qr, () => fxQret(d0), Zp);
    if (A[MA.ret_1y] != null) nb.add(I.r1, A[MA.ret_1y], () => fxAvg('D', d0, ALL), Zp);
    add(F.retH, F.ret(pl, qn, pct(A[MA.ret_ytd]), !q1 && qr != null ? pct(qr) : '', A[MA.ret_1y] != null ? pct(A[MA.ret_1y]) : ''), F.calcRet, nb);
  }
  const g = gainAt(pl, di), gy = gainYtd(pl, di);
  if (g != null) {
    const nb = NB(); nb.add(I.gain, g, () => fxGain(d0), Zm); if (!q1 && gy != null) nb.add(I.gainY, gy, () => fxGainY(d0), Zm);
    add(F.gainH, F.gain1(pl, qn, mSg(g), !q1 && gy != null ? mSg(gy) : ''), F.calcGain, nb);
    if (Tq.ok && Tq.nav) {
      const nb2 = NB(), a = nb2.add(I.nav + now, T0.nav, () => fxNav(d0), Zm), b = nb2.add(`${I.nav} · ${t.thPrevQ.toLowerCase()}`, Tq.nav, () => fxNav(Q), Zm);
      const c0 = nb2.add(t.thDq, T0.nav - Tq.nav, c => `${c(a)}-${c(b)}`, Zm), gi = nb2.add(I.gain, g, () => fxGain(d0), Zm);
      nb2.add(L ? 'Įmokų ir išmokų balansas, mln. € (apyt.)' : 'Contributions minus payouts, € m (est.)', T0.nav - Tq.nav - g, c => `${c(c0)}-${c(gi)}`, Zm);
      add(X.flowH, X.flow(mSMn(T0.nav - Tq.nav), mSg(g), mSg(T0.nav - Tq.nav - g)), `${X.calcFlow} ${F.calcGain}`, nb2);
    }
  }
  if (pl === 'II' && T0.part) {
    const nb = NB(), a = nb.add(I.nav + now, T0.nav, () => fxNav(d0), Zm), b = nb.add(I.part + now, T0.part, () => fxPart(d0), Zi);
    nb.add(I.per + now, T0.nav * 1e6 / T0.part, c => `${c(a)}*1000000/${c(b)}`, Zi);
    if (Ty.part) { const a2 = nb.add(`${I.nav} · ${t.thPrevY.toLowerCase()}`, Ty.nav, () => fxNav(Y), Zm), b2 = nb.add(`${I.part} · ${t.thPrevY.toLowerCase()}`, Ty.part, () => fxPart(Y), Zi);
      nb.add(`${I.per} · ${t.thPrevY.toLowerCase()}`, Ty.nav * 1e6 / Ty.part, c => `${c(a2)}*1000000/${c(b2)}`, Zi); }
    add(F.perH, F.per(pl, mEurs(T0.nav * 1e6 / T0.part), Ty.part ? mEurs(Ty.nav * 1e6 / Ty.part) : ''), F.calcPer, nb);
  }
  const lc = groupsAt(pl, di).filter(gi => /^\d{4}-\d{4}$/.test(groupKeyOf(pl, gi))).map(gi => ({ gi, a: avgOf(pl, di, gi) })).filter(x => x.a && x.a[MA.ret_ytd] != null).sort((a, b) => a.a[MA.ret_ytd] - b.a[MA.ret_ytd]);
  if (lc.length > 1) {
    const nb = NB(); lc.forEach(x => nb.add(`${groupLbl(pl, x.gi)} · ${t.thYtd.toLowerCase()}`, x.a[MA.ret_ytd], () => fxAvg('C', d0, groupLbl(pl, x.gi)), Zp));
    add(F.lcH, F.lc(pct(lc[0].a[MA.ret_ytd]), groupLbl(pl, lc[0].gi), pct(lc[lc.length - 1].a[MA.ret_ytd]), groupLbl(pl, lc[lc.length - 1].gi)), F.calcLc, nb);
  }
  // fondai virš savo grupės vidurkio (lyginama tik grupės viduje)
  { const nb = NB(), ks = [], ns = []; let K = 0, Nn = 0;
    groupsAt(pl, di).forEach(gi => { const a = avgOf(pl, di, gi); if (!a || a[MA.ret_ytd] == null) return;
      const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC.ret_ytd] != null), k = rs.filter(r => r[MC.ret_ytd] > a[MA.ret_ytd]).length, gl = groupLbl(pl, gi);
      const ia = nb.add(`${gl} · ${t.thAvg}`, a[MA.ret_ytd], () => fxAvg('C', d0, gl), Zp);
      ks.push(nb.add(`${gl} · ${X.above}`, k, c => `COUNTIFS(${byD(d0)},${crG(pl, gi)},${MKX.D}!G:G,">"&${c(ia)})`, '0'));
      ns.push(nb.add(`${gl} · ${X.withRet}`, rs.length, () => `COUNTIFS(${byD(d0)},${crG(pl, gi)},${MKX.D}!G:G,"<>")`, '0')); K += k; Nn += rs.length; });
    if (Nn) { nb.add(`${X.tot} · ${X.above}`, K, c => ks.map(c).join('+'), '0'); nb.add(`${X.tot} · ${X.withRet}`, Nn, c => ns.map(c).join('+'), '0');
      add(X.beatH, X.beat(K, Nn), X.calcBeat, nb); } }
  { const rs = rowsAt(pl, di).filter(r => r[MC.ret_ytd] != null && r[MC.bm_ytd] != null), k = rs.filter(r => r[MC.ret_ytd] > r[MC.bm_ytd]).length;
    if (rs.length > 2) { const nb = NB(), D = MKX.D, rg = (c, X2) => `${D}!${c}3:${c}${X2.n}`;
      nb.add(L ? 'Fondai, lenkę lyginamąjį indeksą' : 'Funds beating benchmark', k, (c, X2) => `SUMPRODUCT((${rg('A', X2)}=${d0})*(${rg('G', X2)}<>"")*(${rg('Q', X2)}<>"")*(${rg('G', X2)}>${rg('Q', X2)}))`, '0');
      nb.add(L ? 'Fondai su abiem skaičiais' : 'Funds with both figures', rs.length, (c, X2) => `SUMPRODUCT((${rg('A', X2)}=${d0})*(${rg('G', X2)}<>"")*(${rg('Q', X2)}<>""))`, '0');
      add(X.bmH, X.bm(k, rs.length), X.calcBm, nb); } }
  const M = byMgr(pl, di), Mq = byMgr(pl, dq), ms = Object.entries(M);
  if (ms.length > 1) {
    const a = [...ms].sort((x, y) => y[1].nav - x[1].nav)[0], b = [...ms].sort((x, y) => y[1].part - x[1].part)[0];
    { const nb = NB(), i1 = nb.add(`${a[0]} · ${I.nav}`, a[1].nav, () => fxNav(d0, crM(a[0])), Zm), i2 = nb.add(`${I.nav} · ${X.shTot}`, T0.nav, () => fxNav(d0), Zm);
      nb.add(`${a[0]} · ${t.shOf.nav}`, a[1].nav / T0.nav, c => `${c(i1)}/${c(i2)}`, Zr);
      const i3 = nb.add(`${b[0]} · ${I.part}`, b[1].part, () => fxPart(d0, crM(b[0])), Zi), i4 = nb.add(`${I.part} · ${X.shTot}`, T0.part, () => fxPart(d0), Zi);
      nb.add(`${b[0]} · ${t.shOf.part}`, b[1].part / T0.part, c => `${c(i3)}/${c(i4)}`, Zr);
      add(F.mgrH, F.mgr(a[0], mShare(a[1].nav, T0.nav), b[0], mShare(b[1].part, T0.part)), F.calcMgr, nb); }
    if (ms.length > 2) {
      const nb = NB(), srt = [...ms].sort((x, y) => y[1].nav - x[1].nav), ix = srt.map(([m, x]) => nb.add(`${m} · ${t.shOf.nav}, %`, x.nav / T0.nav * 100, () => `${fxNav(d0, crM(m))}/${fxNav(d0)}*100`, Zp));
      const s3 = srt.slice(0, 3).reduce((s, [, x]) => s + x.nav / T0.nav * 100, 0), hhi = srt.reduce((s, [, x]) => s + (x.nav / T0.nav * 100) ** 2, 0);
      nb.add(L ? 'Trijų didžiausių dalis, %' : 'Top-3 share, %', s3, c => ix.slice(0, 3).map(c).join('+'), Zp);
      nb.add('HHI', hhi, c => `SUMSQ(${c(ix[0])}:${c(ix[ix.length - 1])})`, Zi);
      add(X.concH, X.conc(srt.slice(0, 3).map(x => x[0]).join(', '), pctPlain(s3, 1), mInt(hhi)), X.calcConc, nb);
    }
    const ch = ms.filter(([m]) => Mq[m]).map(([m, x]) => [m, x.part - Mq[m].part]).sort((x, y) => y[1] - x[1]);
    if (ch.length > 1) {
      const nb = NB(), pair = ([m, v]) => { const i = nb.add(`${m} · ${I.part}${now}`, M[m].part, () => fxPart(d0, crM(m)), Zi), j = nb.add(`${m} · ${I.part} · ${t.thPrevQ.toLowerCase()}`, Mq[m].part, () => fxPart(Q, crM(m)), Zi); nb.add(`${m} · ${t.thDq}`, v, c => `${c(i)}-${c(j)}`, Zi); };
      pair(ch[0]); pair(ch[ch.length - 1]);
      add(F.chgH, F.chg(ch[0][0], mSInt(ch[0][1]), ch[ch.length - 1][0], mSInt(ch[ch.length - 1][1])), F.calcChg, nb);
    }
  }
  // rekordas ir augimas per 5 metus
  { let mx = -1, md = null; MKT[pl].dates.forEach((x, i) => { if (i <= di) { const v = totals(pl, i).nav; if (v > mx) { mx = v; md = x; } } });
    const TS = `'${X.sheetT}'`, nb = NB(), a = nb.add(I.nav + now, T0.nav, () => fxNav(d0), Zm);
    const b = nb.add(L ? 'Didžiausias turtas iki šios datos, mln. €' : 'Highest assets up to this date, € m', mx, () => `_xlfn.MAXIFS(${TS}!C:C,${TS}!A:A,"<="&${d0})`, Zm);
    nb.add(L ? 'Kada' : 'When', dayOf(md) + 25569, c => `INDEX(${TS}!A:A,MATCH(${c(b)},${TS}!C:C,0))`, 'yyyy-mm-dd');
    add(X.recH, md === d ? X.recNow(mMn(T0.nav)) : X.recWas(mMn(mx), t.dLong(md), mMn(T0.nav)), X.calcRec, nb); void a; }
  { const d5 = dIdx(pl, qBack(d, 60)), T5 = totals(pl, d5);
    if (d5 >= 0 && T5.nav) { const nb = NB(), a = nb.add(I.nav + now, T0.nav, () => fxNav(d0), Zm), b = nb.add(`${I.nav} · ${L ? 'prieš 5 metus' : '5 years ago'}`, T5.nav, () => fxNav(fxBack(60)), Zm);
      const r = nb.add(L ? 'Santykis' : 'Ratio', T0.nav / T5.nav, c => `${c(a)}/${c(b)}`, '0.00'), cg = (T0.nav / T5.nav) ** 0.2 - 1;
      nb.add(L ? 'Vidutinis metinis augimas' : 'Average annual growth', cg, c => `${c(r)}^(1/5)-1`, Zr);
      add(X.grH, X.gr(mMn(T5.nav), mMn(T0.nav), T0.nav / T5.nav, pct(cg * 100), T0.nav >= T5.nav), X.calcGr, nb); } }
  const other = pl === 'II' ? 'III' : 'II', od = dIdx(other, d);
  if (od >= 0) { const o = totals(other, od); if (o.nav) {
    const OD = `'LB duomenys (${other})'`, nb = NB(), oS = (col) => `SUMIFS(${OD}!${col}:${col},${OD}!A:A,${d0})`;
    const a = nb.add(`${pl} · ${I.nav}`, T0.nav, () => fxNav(d0), Zm), b = nb.add(`${other} · ${I.nav}`, o.nav, () => oS('F'), Zm); nb.add(`${X.tot} · ${I.nav}`, T0.nav + o.nav, c => `${c(a)}+${c(b)}`, Zm);
    const p = nb.add(`${pl} · ${I.part}`, T0.part, () => fxPart(d0), Zi), q = nb.add(`${other} · ${I.part}`, o.part, () => oS('E'), Zi); nb.add(`${X.tot} · ${I.part}`, T0.part + o.part, c => `${c(p)}+${c(q)}`, Zi);
    add(F.bothH, F.both(Ln, mMn(T0.nav + o.nav), mInt(T0.part + o.part)), F.calcNav, nb, { other }); } }
  if (MS.mgr && M[MS.mgr]) out.unshift(...mgrFacts(pl, di, MS.mgr));
  return out;
}
/* valdytojo įžvalgos – rinkos dalis ir jos kryptis, dalyviai, prieaugis, fondai prieš LB grupių vidurkius (tik savo grupėje) */
function mgrFacts(pl, di, m) {
  const t = T(), F = t.f, X = t.fx, I = t.ind, L = lang === 'lt', d = MKT[pl].dates[di], dq = dIdx(pl, qBack(d, 3)), dy = dIdx(pl, qBack(d, 12)), d3 = dIdx(pl, qBack(d, 36));
  const M = byMgr(pl, di), x = M[m]; if (!x) return [];
  const T0 = totals(pl, di), src = t.srcLB(pl, d), out = [], cm = crM(m), { d0, dq: Q, dy: Y } = MKD, now = ` · ${t.thNow.toLowerCase()}`;
  const add = (text, calc, nb) => out.push({ h: m, text: text.replace(/\.\.$/, '.'), calc, src, hl: true, nums: nb.a });
  { const nb = NB(), a = nb.add(`${m} · ${I.nav}`, x.nav, () => fxNav(d0, cm), Zm), b = nb.add(`${I.nav} · ${X.shTot}`, T0.nav, () => fxNav(d0), Zm);
    nb.add(`${m} · ${t.shOf.nav}`, x.nav / T0.nav, c => `${c(a)}/${c(b)}`, Zr);
    const p = nb.add(`${m} · ${I.part}`, x.part, () => fxPart(d0, cm), Zi), q = nb.add(`${I.part} · ${X.shTot}`, T0.part, () => fxPart(d0), Zi);
    nb.add(`${m} · ${t.shOf.part}`, x.part / T0.part, c => `${c(p)}/${c(q)}`, Zr);
    add(F.m1(m, pl, mMn(x.nav), mShare(x.nav, T0.nav), mInt(x.part), mShare(x.part, T0.part)), F.calcMgr, nb); }
  // rinkos dalies kryptis
  { const share = k => { const Mk = byMgr(pl, k), Tk = totals(pl, k); return Mk[m] && Tk.nav ? Mk[m].nav / Tk.nav * 100 : null; };
    const s0 = share(di), sy = dy >= 0 ? share(dy) : null, s3 = d3 >= 0 ? share(d3) : null;
    if (sy != null) { const nb = NB();
      const blk = (lbl, k, R) => { const Mk = byMgr(pl, k)[m], Tk = totals(pl, k), a = nb.add(`${m} · ${I.nav} · ${lbl}`, Mk.nav, () => fxNav(R, cm), Zm), b = nb.add(`${I.nav} · ${X.shTot} · ${lbl}`, Tk.nav, () => fxNav(R), Zm);
        return nb.add(`${m} · ${t.shOf.nav}, % · ${lbl}`, Mk.nav / Tk.nav * 100, c => `${c(a)}/${c(b)}*100`, Zp); };
      const i0 = blk(t.thNow.toLowerCase(), di, d0), iy = blk(t.thPrevY.toLowerCase(), dy, Y);
      nb.add(`${t.thDy}, ${L ? 'p. p.' : 'pp'}`, s0 - sy, c => `${c(i0)}-${c(iy)}`, Zp);
      if (s3 != null) { const i3 = blk(L ? 'prieš 3 metus' : '3 years ago', d3, fxBack(36)); nb.add(`${L ? 'Pokytis per 3 metus' : 'Change in 3 years'}, ${L ? 'p. p.' : 'pp'}`, s0 - s3, c => `${c(i0)}-${c(i3)}`, Zp); }
      add(X.m5(m, pctPlain(s0, 1), mPP(s0 - sy), s3 != null ? mPP(s0 - s3) : ''), X.calcM5, nb); } }
  // dalyvių pokytis prieš visą pakopą
  { const Mq = byMgr(pl, dq)[m], My = byMgr(pl, dy)[m], Tq = totals(pl, dq), Ty = totals(pl, dy);
    if (Mq && My && Tq.part && Ty.part) {
      const nb = NB(), a = nb.add(`${m} · ${I.part}${now}`, x.part, () => fxPart(d0, cm), Zi);
      nbCmp(nb, a, `${m} · ${I.part}`, Mq.part, () => fxPart(Q, cm), Zi, 1); nbCmp(nb, a, `${m} · ${I.part}`, My.part, () => fxPart(Y, cm), Zi, 2);
      const b = nb.add(`${X.shTot} · ${I.part}${now}`, T0.part, () => fxPart(d0), Zi);
      nbCmp(nb, b, `${X.shTot} · ${I.part}`, Tq.part, () => fxPart(Q), Zi, 1); nbCmp(nb, b, `${X.shTot} · ${I.part}`, Ty.part, () => fxPart(Y), Zi, 2);
      add(X.m2(m, mSInt(x.part - Mq.part), mRel(x.part, Mq.part), mRel(T0.part, Tq.part), mSInt(x.part - My.part), mRel(x.part, My.part), mRel(T0.part, Ty.part)), F.calcChg, nb); } }
  // investicinis prieaugis
  { const g = gainAt(pl, di, m), G = gainAt(pl, di);
    if (g != null) { const nb = NB(), a = nb.add(`${m} · ${I.gain}`, g, () => fxGain(d0, cm), Zm), b = nb.add(`${X.shTot} · ${I.gain}`, G, () => fxGain(d0), Zm), ok = G > 0 && g > 0;
      if (ok) nb.add(L ? 'Dalis' : 'Share', g / G, c => `${c(a)}/${c(b)}`, Zr);
      add(X.m6(m, mSg(g), ok ? pctPlain(g / G * 100, 1) : ''), F.calcGain, nb); } }
  if (pl === 'II' && x.part && T0.part) {
    const nb = NB(), a = nb.add(`${m} · ${I.nav}`, x.nav, () => fxNav(d0, cm), Zm), b = nb.add(`${m} · ${I.part}`, x.part, () => fxPart(d0, cm), Zi), p = nb.add(`${m} · ${I.per}`, x.nav * 1e6 / x.part, c => `${c(a)}*1000000/${c(b)}`, Zi);
    const a2 = nb.add(`${X.shTot} · ${I.nav}`, T0.nav, () => fxNav(d0), Zm), b2 = nb.add(`${X.shTot} · ${I.part}`, T0.part, () => fxPart(d0), Zi); nb.add(`${X.shTot} · ${I.per}`, T0.nav * 1e6 / T0.part, c => `${c(a2)}*1000000/${c(b2)}`, Zi); void p;
    add(X.m7(m, mEurs(x.nav * 1e6 / x.part), mEurs(T0.nav * 1e6 / T0.part)), F.calcPer, nb);
  }
  // fondai prieš LB grupės vidurkį: nuo metų pradžios, per 1 ir 3 metus
  { const nb = NB(), parts = [];
    [['ret_ytd', 'G', 'C', 'ytd'], ['ret_1y', 'M', 'D', 'r1'], ['ret_3y', 'N', 'E', 'r3']].forEach(([k, dc, vc, pk]) => {
      const flags = [];
      groupsAt(pl, di).forEach(gi => { const a = avgOf(pl, di, gi), mine = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && fundOf(pl, r)[0] === m && r[MC[k]] != null);
        if (!mine.length || !a || a[MA[k]] == null) return;
        const gl = groupLbl(pl, gi), best = Math.max(...mine.map(r => r[MC[k]])), per = X.per[pk];
        const ib = nb.add(`${gl} · ${X.best} · ${per}`, best, () => `_xlfn.MAXIFS(${MKX.D}!${dc}:${dc},${byD(d0)},${crG(pl, gi)},${cm})`, Zp), ia = nb.add(`${gl} · ${t.thAvg} · ${per}`, a[MA[k]], () => fxAvg(vc, d0, gl), Zp);
        flags.push(nb.add(`${gl} · ${X.beatF} · ${per}`, best > a[MA[k]] ? 1 : 0, c => `IF(${c(ib)}>${c(ia)},1,0)`, '0')); });
      if (!flags.length) return;
      const kk = flags.reduce((s, i) => s + nb.v(i), 0);
      nb.add(`${X.tot} · ${X.beatF} · ${X.per[pk]}`, kk, c => flags.map(c).join('+'), '0');
      parts.push(`${X.per[pk]} – ${X.ofG(kk, flags.length)}`);
    });
    if (parts.length) add(X.m3(m, parts.join(', ')), X.calcM3, nb); }
  // geriausia vieta grupėje
  { let best = null;
    groupsAt(pl, di).forEach(gi => { const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC.ret_ytd] != null), mine = rs.filter(r => fundOf(pl, r)[0] === m);
      if (!mine.length) return; const v = Math.max(...mine.map(r => r[MC.ret_ytd])), pos = rs.filter(r => r[MC.ret_ytd] > v).length + 1;
      if (!best || pos < best.pos) best = { pos, of: rs.length, gi, v }; });
    if (best) { const nb = NB(), gl = groupLbl(pl, best.gi), cg = crG(pl, best.gi);
      const iv = nb.add(`${gl} · ${X.best} · ${t.thYtd.toLowerCase()}`, best.v, () => `_xlfn.MAXIFS(${MKX.D}!G:G,${byD(d0)},${cg},${cm})`, Zp);
      nb.add(X.rank, best.pos, c => `COUNTIFS(${byD(d0)},${cg},${MKX.D}!G:G,">"&${c(iv)})+1`, '0'); nb.add(X.of, best.of, () => `COUNTIFS(${byD(d0)},${cg},${MKX.D}!G:G,"<>")`, '0');
      add(F.m4(m, L ? `${best.pos} iš ${best.of} (${gl})` : `${best.pos} of ${best.of} (${gl})`), X.calcM4, nb); } }
  return out;
}
function renderFacts() {
  const t = T(), fs = mkFacts(), el = document.getElementById('qfCards');
  el.innerHTML = fs.map((f, i) => `<article class="fact${f.hl ? ' hl' : ''}"><span class="fh">${hEsc(f.h)}</span><p>${hEsc(f.text)}</p><small>${hEsc(f.src)} ${t.how} ${hEsc(f.calc)}</small><div class="fbtn"><button type="button" class="btn" data-fact="${i}">${t.copy}</button><button type="button" class="btn xl" data-fx="${i}" title="${t.tXl}">${t.fx.xl}</button></div></article>`).join('');
  el._facts = fs;
  document.getElementById('qfAll').textContent = t.copyAll;
  document.getElementById('qfXl').textContent = t.fx.xlAll;
  renderKeyTable();
}
function renderMgrCards() {
  const t = T(), X = t.fx, pl = MS.pl, di = dIdx(pl, MS.d), el = document.getElementById('miCards'); if (!el) return;
  document.getElementById('miTitle').textContent = X.miTitle; document.getElementById('miLead').textContent = X.miLead; document.getElementById('miXl').textContent = X.xlAll;
  const ms = Object.entries(byMgr(pl, di)).sort((a, b) => b[1].nav - a[1].nav).map(([m]) => m), all = {};
  el.innerHTML = ms.map(m => { const fs = mgrFacts(pl, di, m); all[m] = fs;
    return `<article class="fact mi${m === MS.mgr ? ' hl' : ''}"><span class="fh"><i class="sw" style="background:${mkColor(m)}"></i>${hEsc(m)}</span><ul>${fs.map(f => `<li>${hEsc(f.text)}</li>`).join('')}</ul><small>${hEsc(t.srcLB(pl, MS.d))}</small><div class="fbtn"><button type="button" class="btn" data-mcp="${hEsc(m)}">${t.copy}</button><button type="button" class="btn xl" data-mxl="${hEsc(m)}" title="${t.tXl}">${X.xl}</button></div></article>`; }).join('');
  el._facts = all;
}
async function mkCopy(text, b) {
  try { await navigator.clipboard.writeText(text); } catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  const o = b.textContent; b.textContent = '✓ ' + T().copied; setTimeout(() => { b.textContent = o; }, 1500);
}
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-fact], #qfAll, [data-fx], #qfXl, [data-mcp], [data-mxl], #miXl'); if (!b) return;
  const fs = document.getElementById('qfCards')._facts || [], ma = (document.getElementById('miCards') || {})._facts || {}, t = T();
  if (b.matches('[data-fact], #qfAll')) return mkCopy((b.id === 'qfAll' ? fs : [fs[+b.dataset.fact]]).map(f => `${f.text} ${f.src}`).join('\n\n'), b);
  if (b.matches('[data-mcp]')) { const f = ma[b.dataset.mcp] || []; return mkCopy(f.map(x => x.text).join(' ') + (f[0] ? ' ' + f[0].src : ''), b); }
  const pick = b.id === 'qfXl' ? fs : b.dataset.fx != null ? [fs[+b.dataset.fx]] : b.id === 'miXl' ? Object.values(ma).flat() : ma[b.dataset.mxl] || [];
  const title = b.id === 'qfXl' ? t.qfTitle : b.dataset.fx != null ? pick[0].h : b.id === 'miXl' ? t.fx.miTitle : `${t.fx.miTitle} · ${b.dataset.mxl}`;
  const o = b.textContent; b.disabled = true; b.textContent = '…';
  try { await mkFactBook(pick, title); b.textContent = '✓'; } catch (err) { console.error(err); b.textContent = '!'; }
  setTimeout(() => { b.textContent = o; b.disabled = false; }, 1500);
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
  show.forEach(gi => XLB.set(`fd_${pl}_${groupKeyOf(pl, gi)}`, async () => mkFundBook(pl, gi)));
}

/* Šiandien skirtuke – naujausio LB ketvirčio santrauka su nuorodomis į kitus skirtukus (rinkos turinys matomas iš karto) */
addStrings({ tdMkH: d => `Pension market at ${d}`, tdMkM: 'Bank of Lithuania quarterly data; updated automatically when a new report is published. Each figure can be checked in Excel on the “Quarter facts” tab.', tdGo: { qf: 'All quarter facts →', mg: 'Managers →', mk: 'Market over time →' } },
  { tdMkH: d => `Pensijų rinka ${d}`, tdMkM: 'Lietuvos banko ketvirčio duomenys; atnaujinama automatiškai, kai LB paskelbia naują ataskaitą. Kiekvieną skaičių galima patikrinti Excel faile skirtuke „Ketvirčio faktai“.', tdGo: { qf: 'Visi ketvirčio faktai →', mg: 'Valdytojai →', mk: 'Rinka laike →' } });
function renderTd() {
  const el = document.getElementById('tdMkK'); if (!el) return;
  const t = T(), d2 = MKT.II.dates[MKT.II.dates.length - 1], d3 = MKT.III.dates[MKT.III.dates.length - 1], i2 = dIdx('II', d2), i3 = dIdx('III', d3);
  const T2 = totals('II', i2), T3 = totals('III', i3), A2 = avgOf('II', i2, -1), A3 = avgOf('III', i3, -1);
  document.getElementById('tdMkH').textContent = t.tdMkH(t.dLong(d2)); document.getElementById('tdMkM').textContent = t.tdMkM;
  const k = [[t.kPart('II'), mInt(T2.part)], [t.kNav('II'), mMn(T2.nav)], A2 ? [`II · ${t.kYtd}`, pct(A2[MA.ret_ytd])] : null, [t.kNav('III'), mMn(T3.nav)], A3 ? [`III · ${t.kYtd}`, pct(A3[MA.ret_ytd])] : null];
  el.innerHTML = k.filter(Boolean).map(([a, b]) => `<div class="kpi"><span>${a}</span><b>${b}</b></div>`).join('');
  const keep = { pl: MS.pl, d: MS.d, mgr: MS.mgr }; let fs = [];
  try { Object.assign(MS, { pl: 'II', d: d2, mgr: '' }); fs = mkFacts(); } finally { Object.assign(MS, keep); }
  const X = t.fx, pick = [X.flowH, X.beatH, X.concH, t.f.gainH].map(h => fs.find(f => f.h === h)).filter(Boolean).slice(0, 3);
  document.getElementById('tdMkL').innerHTML = pick.map(f => `<li>${hEsc(f.text)}</li>`).join('');
  document.getElementById('tdMkA').innerHTML = Object.entries(t.tdGo).map(([k2, l]) => `<a href="#" data-go="${k2}">${l}</a>`).join(' · ');
}
document.addEventListener('click', e => { const a = e.target.closest('#tdMkA [data-go]'); if (!a) return; e.preventDefault(); showTab(a.dataset.go, true); });

/* ---------- visa rinkos dalis ---------- */
function mkRender() {
  mkFixState();
  const t = T();
  ['tdTitle', 'qfTitle', 'mkTitle', 'mgTitle', 'fdTitle', 'qfLead', 'mkLead', 'mgLead', 'fdLead', 'gpTitle', 'gpLead', 'mgChart'].forEach(id => { const e = document.getElementById(id); if (e) e.textContent = t[id]; });
  ['qfNote', 'mkNote', 'mgNote', 'fdNote'].forEach(id => { document.getElementById(id).textContent = t.noteLB; });
  document.getElementById('mkGainN').textContent = t.noteGain;
  ['qfBar', 'mkBar', 'mgBar'].forEach(id => { document.getElementById(id).innerHTML = mkBar(); });
  renderFacts(); renderTime(); renderMgr(); renderMgrCards(); renderFunds(); renderTd();
  if (typeof srcLines === 'function') srcLines();
}
function mkTabs() {
  addSubnav([['tdTitle'], ['qfTitle'], ['mkTitle'], ['mgTitle'], ['fdTitle']].map(([id]) => ({ id, label: T()[id] })));
}
let mkRz; addEventListener('resize', () => { clearTimeout(mkRz); mkRz = setTimeout(() => { renderTime(); renderMgr(); }, 120); });

/* ---------- Excel su skaičiavimais (savininkas 2026-10-19: „kaip ir visur kitur – patikrinti skaičiavimus ir šaltinius“) ----------
   Lapas „LB duomenys“ – kiekvieno fondo ketvirčio eilutė iš LB failo (mėlyni skaičiai, galima sutikrinti su LB), ketvirčio grąža
   ir investicinis prieaugis – formulės. Lapas „LB vidurkiai“ – LB paskelbti svertiniai vidurkiai. „Rezultatas“ – ta pati lentelė
   kaip svetainėje, kiekvienas langelis – SUMIFS / formulė iš tų lapų. */
const MKX = { D: "'LB duomenys'", V: "'LB vidurkiai'" };
const xIn = (v, z) => v == null ? null : { v, z, s: 'in' };
const xF = (f, v, z, s = 'calc') => ({ f, v: v == null || !isFinite(v) ? 0 : v, z, s });
const xDate = d => ({ v: dayOf(d) + 25569, z: 'yyyy-mm-dd', s: 'in' });
const xHdr = a => a.map(h => ({ v: h, s: 'hdr' }));
function mkDataSheets(pl) {
  const L = lang === 'lt', P = MKT[pl], rows = [], pos = new Map();
  const hdr = L ? ['Ketvirčio pabaiga', 'Valdytojas', 'Fondas', 'LB grupė', 'Dalyviai', 'Grynieji aktyvai, mln. €', 'Grąža nuo metų pradžios, %', 'Ankstesnio ketvirčio grąža nuo metų pradžios, %', 'Ketvirčio grąža, %', 'Turtas ketvirčio pradžioje, mln. €', 'Srauto dalis (0,5 įprastai; 1 – reformos išmokų ketvirčiai)', 'Investicinis prieaugis, mln. €', 'Grąža per 1 m., %', 'Grąža per 3 m. (metinė), %', 'Grąža per 5 m. (metinė), %', 'Grąža nuo veiklos pradžios (metinė), %', 'Lyginamasis indeksas nuo metų pradžios, %', 'Rizikingas turtas, %', 'Turtas × ketvirčio grąža', 'Svoris (turtas, jei yra ketvirčio grąža)']
    : ['Quarter end', 'Manager', 'Fund', 'BoL group', 'Participants', 'Net assets, € m', 'Return since year start, %', 'Previous quarter return since year start, %', 'Quarter return, %', 'Assets at quarter start, € m', 'Flow share (0.5 normally; 1 – reform payout quarters)', 'Investment gain, € m', 'Return 1 y, %', 'Return 3 y (annual), %', 'Return 5 y (annual), %', 'Return since start (annual), %', 'Benchmark since year start, %', 'Risky assets, %', 'Assets × quarter return', 'Weight (assets if quarter return exists)'];
  const step = L ? ['', '', '', '', 'LB failas', 'LB failas', 'LB failas', 'LB failas (ankstesnis ketvirtis)', '= G, jei I ketv.; kitaip ((1 + G/100) ÷ (1 + H/100) − 1) × 100, suapvalinta iki 0,01', 'LB failas (ankstesnis ketvirtis)', 'prielaida', '= I/100 × (J + K × (F − J × (1 + I/100)))', 'LB failas', 'LB failas', 'LB failas', 'LB failas', 'LB failas', 'LB failas', '= F × I', '= F, jei yra I']
    : ['', '', '', '', 'BoL file', 'BoL file', 'BoL file', 'BoL file (previous quarter)', '= G in Q1; else ((1 + G/100) ÷ (1 + H/100) − 1) × 100, rounded to 0.01', 'BoL file (previous quarter)', 'assumption', '= I/100 × (J + K × (F − J × (1 + I/100)))', 'BoL file', 'BoL file', 'BoL file', 'BoL file', 'BoL file', 'BoL file', '= F × I', '= F if I exists'];
  rows.push(xHdr(hdr), step.map(x => x ? { v: x, s: 'step' } : null));
  P.dates.forEach((d, di) => {
    const pd = dIdx(pl, qBack(d, 3)), k = payoutQ(d) ? 1 : 0.5;
    rowsAt(pl, di).forEach(r => {
      const f = fundOf(pl, r), p = rowOf(pl, pd, r[1]), n = rows.length + 1, q = r[MC.ret_q], q1 = d.slice(5, 7) === '03';
      pos.set(di * 1000 + r[1], n);
      const pv = p && p[MC.nav] && r[MC.nav] && q != null ? p[MC.nav] : null, g = pv != null ? q / 100 * (pv + k * (r[MC.nav] - pv * (1 + q / 100))) : null;
      rows.push([xDate(d), f[0], f[1], groupLbl(pl, f[2]), xIn(r[MC.part], '#,##0'), xIn(r[MC.nav], '0.000'), xIn(r[MC.ret_ytd], '0.00'), q1 ? null : xIn(p ? p[MC.ret_ytd] : null, '0.00'),
        q == null ? null : xF(`IF(MONTH(A${n})=3,G${n},IF(H${n}="","",ROUND(((1+G${n}/100)/(1+H${n}/100)-1)*100,2)))`, q, '0.00'),
        xIn(pv, '0.000'), { v: k, z: '0.0', s: 'in' }, g == null ? null : xF(`IF(OR(I${n}="",J${n}="",F${n}=""),"",I${n}/100*(J${n}+K${n}*(F${n}-J${n}*(1+I${n}/100))))`, g, '0.00'),
        xIn(r[MC.ret_1y], '0.00'), xIn(r[MC.ret_3y], '0.00'), xIn(r[MC.ret_5y], '0.00'), xIn(r[MC.ret_gcf], '0.00'), xIn(r[MC.bm_ytd], '0.00'), xIn(r[MC.risky], '0.0'),
        xF(`IF(OR(I${n}="",F${n}=""),0,F${n}*I${n})`, q != null && r[MC.nav] ? r[MC.nav] * q : 0, '0.00'), xF(`IF(OR(I${n}="",F${n}=""),0,F${n})`, q != null && r[MC.nav] ? r[MC.nav] : 0, '0.000')]);
    });
  });
  const av = [xHdr(L ? ['Ketvirčio pabaiga', 'Grupė', 'Grąža nuo metų pradžios, %', 'Grąža per 1 m., %', 'Grąža per 3 m., %', 'Grąža per 5 m., %', 'Nuo veiklos pradžios, %', 'Lyginamasis indeksas nuo metų pradžios, %'] : ['Quarter end', 'Group', 'Return since year start, %', 'Return 1 y, %', 'Return 3 y, %', 'Return 5 y, %', 'Since start, %', 'Benchmark since year start, %'])];
  const avPos = new Map(), ALL = L ? 'Visi fondai' : 'All funds';
  P.avgs.forEach(a => { avPos.set(a[0] * 100 + a[1], av.length + 1); av.push([xDate(P.dates[a[0]]), a[1] < 0 ? ALL : groupLbl(pl, a[1]), ...['ret_ytd', 'ret_1y', 'ret_3y', 'ret_5y', 'ret_gcf', 'bm_ytd'].map(k => xIn(a[MA[k]], '0.00'))]); });
  return { pos, avPos, ALL, n: rows.length, sheets: [{ name: L ? 'LB duomenys' : 'LB duomenys', rows, o: { cols: [12, 11, 46, 22, 11, 12, 11, 13, 11, 12, 12, 12, 10, 10, 10, 10, 11, 10, 12, 12], freeze: { r: 2, c: 3 }, filter: `A1:T${rows.length}` } },
    { name: 'LB vidurkiai', rows: av, o: { cols: [12, 30, 12, 12, 12, 12, 12, 14], freeze: { r: 1 } } }] };
}
const S_ = (col, ...crit) => `SUMIFS(${MKX.D}!${col}:${col},${crit.join(',')})`;
const byD = ref => `${MKX.D}!A:A,${ref}`;
function mkMeth(extra = []) {
  const L = lang === 'lt';
  return [[L ? 'Metodika ir šaltiniai' : 'Methodology and sources'],
    [L ? 'Šaltinis' : 'Source', L ? 'Lietuvos bankas, II ir III pakopos pensijų fondų veiklos rezultatai (ketvirčio failai), https://www.lb.lt/lt/pf-veiklos-rodikliai. Mėlyni skaičiai lape „LB duomenys“ – tiesiai iš LB failų.' : 'Bank of Lithuania pillar II and III pension fund results (quarterly files), https://www.lb.lt/lt/pf-veiklos-rodikliai. Blue numbers in “LB duomenys” come straight from the BoL files.'],
    [L ? 'Kaip patikrinti' : 'How to check', L ? 'Kiekvienas „Rezultatas“ langelis – formulė (SUMIFS pagal datą, valdytoją ar grupę) iš lapų „LB duomenys“ ir „LB vidurkiai“. Spustelėkite langelį ir viršuje matysite formulę.' : 'Every “Result” cell is a formula (SUMIFS by date, manager or group) over “LB duomenys” and “LB vidurkiai”. Click a cell to see its formula.'],
    [L ? 'Svertinė grąža' : 'Weighted return', L ? 'LB paskelbtas svertinis vidurkis (svoriai – fondų turtas ataskaitos dieną), lapas „LB vidurkiai“.' : 'BoL published weighted average (weights – fund assets on the report date), sheet “LB vidurkiai”.'],
    [L ? 'Ketvirčio grąža' : 'Quarter return', L ? 'Fondo: ((1 + grąža nuo metų pradžios) ÷ (1 + ankstesnio ketvirčio grąža nuo metų pradžios) − 1); pakopos ar grupės: Σ turtas × ketvirčio grąža ÷ Σ turtas (svoriai – turtas ketvirčio pabaigoje, kaip LIPFA).' : 'Fund: (1 + YTD) ÷ (1 + previous quarter YTD) − 1; pillar or group: Σ assets × quarter return ÷ Σ assets (weights – quarter-end assets).'],
    [L ? 'Investicinis prieaugis' : 'Investment gain', L ? 'Apytikslis: fondo ketvirčio grąža × (turtas ketvirčio pradžioje + srauto dalis × pinigų srautas); srautas = turtas pabaigoje − turtas pradžioje × (1 + grąža). Srauto dalis 0,5 (įmokos tolygiai per ketvirtį), nuo 2026 II ketv. – 1 (reformos išmokos ketvirčio pradžioje). Patikra: 2025 m. II pakopa – 618 mln. €, kaip LIPFA.' : 'Estimate: fund quarter return × (assets at quarter start + flow share × net flow); flow = end assets − start assets × (1 + return). Flow share 0.5, from Q2 2026 – 1 (reform payouts at quarter start). Check: pillar II 2025 – € 618 m, as published by the association.'],
    [L ? 'Valdytojai' : 'Managers', L ? 'Pirmtakai priskirti dabartiniam valdytojui (Aviva → Allianz; DNB → Luminor; Finasta, MP Pension Funds Baltic, INVL, SB Asset Management → Artea; Danske Capital → Swedbank).' : 'Predecessors are counted with today’s manager.'], ...extra];
}
const mkBookOut = (pl, res, cols, extra) => { const ds = mkDataSheets(pl); return { sheets: [{ name: lang === 'lt' ? 'Rezultatas' : 'Result', rows: res(ds), o: { cols, freeze: { r: 3, c: 1 } } }, ...ds.sheets, { name: lang === 'lt' ? 'Metodika' : 'Methodology', rows: mkMeth(extra) }], own: true }; };
XLB.set('qfTable', async () => {
  const L = lang === 'lt', t = T(), I = t.ind, pl = MS.pl, d = MS.d, ds = [d, qBack(d, 3), qBack(d, 12)];
  return mkBookOut(pl, X => {
    const res = [[{ v: `${document.getElementById('qfTitle').textContent} · ${pl} ${L ? 'pakopa' : 'pillar'} · ${d}`, s: 'title' }], [{ v: t.srcLB(pl, d), s: 'sub' }],
      [{ v: t.thInd, s: 'hdr' }, ...ds.map(x => xDate(x)), { v: t.thDq, s: 'hdr' }, { v: t.thDy, s: 'hdr' }]];
    const di = ds.map(x => dIdx(pl, x)), C = ['B', 'C', 'D'];
    const val = { part: i => totals(pl, di[i]).part, nav: i => totals(pl, di[i]).nav, per: i => { const x = totals(pl, di[i]); return x.part ? x.nav * 1e6 / x.part : null; }, ytd: i => (avgOf(pl, di[i], -1) || [])[MA.ret_ytd], r1: i => (avgOf(pl, di[i], -1) || [])[MA.ret_1y], qret: i => qRet(pl, di[i]), gain: i => gainAt(pl, di[i]), gainY: i => gainYtd(pl, di[i]), nf: i => totals(pl, di[i]).nf };
    const fml = { part: c => S_('E', byD(`${c}$3`)), nav: c => S_('F', byD(`${c}$3`)), per: (c, r) => `IF(${c}${r - 2}=0,"",${c}${r - 1}*1000000/${c}${r - 2})`, ytd: c => `SUMIFS(${MKX.V}!C:C,${MKX.V}!A:A,${c}$3,${MKX.V}!B:B,"${X.ALL}")`, r1: c => `SUMIFS(${MKX.V}!D:D,${MKX.V}!A:A,${c}$3,${MKX.V}!B:B,"${X.ALL}")`,
      qret: c => `IFERROR(${S_('S', byD(`${c}$3`))}/${S_('T', byD(`${c}$3`))},"")`, gain: c => S_('L', byD(`${c}$3`)), gainY: c => `SUMIFS(${MKX.D}!L:L,${MKX.D}!A:A,">="&DATE(YEAR(${c}$3),1,1),${MKX.D}!A:A,"<="&${c}$3)`, nf: c => `COUNTIFS(${byD(`${c}$3`)})` };
    const z = { part: '#,##0', nav: '#,##0.0', per: '#,##0', ytd: '0.00', r1: '0.00', qret: '0.00', gain: '#,##0.0', gainY: '#,##0.0', nf: '0' };
    Object.keys(I).filter(k => k !== 'per' || pl === 'II').forEach(k => {
      const r = res.length + 1, row = [{ v: I[k], s: 'b' }];
      C.forEach((c, i) => { const v = di[i] < 0 ? null : val[k](i); row.push(di[i] < 0 || v == null ? null : xF(k === 'per' ? `IF(${c}${r - 2}=0,"",${c}${r - 1}*1000000/${c}${r - 2})` : fml[k](c, r), v, z[k], 'res')); });
      const pp = ['ytd', 'r1', 'qret'].includes(k), ab = ['gain', 'gainY', 'nf'].includes(k);
      ['C', 'D'].forEach(c => row.push(row[1] && row[c === 'C' ? 2 : 3] ? xF(pp || ab ? `B${r}-${c}${r}` : `B${r}/${c}${r}-1`, pp || ab ? row[1].v - row[c === 'C' ? 2 : 3].v : row[1].v / row[c === 'C' ? 2 : 3].v - 1, pp ? '0.00' : ab ? '#,##0.0' : '0.00%') : null));
      res.push(row);
    });
    return res;
  }, [44, 14, 14, 14, 16, 16], [[L ? 'Pokyčiai' : 'Changes', L ? 'Grąžų pokytis – procentiniais punktais (B − C); kiekių – procentais (B ÷ C − 1); prieaugio ir fondų skaičiaus – skirtumas.' : 'Return changes – percentage points (B − C); amounts – percent (B ÷ C − 1); gain and fund count – difference.']]);
});
XLB.set('mkTable', async () => {
  const L = lang === 'lt', t = T(), pl = MS.pl, S = mkSeries();
  return mkBookOut(pl, X => {
    const res = [[{ v: `${t.mkTitle} · ${pl} ${L ? 'pakopa' : 'pillar'}`, s: 'title' }], [{ v: t.srcLB(pl, MKT[pl].dates[MKT[pl].dates.length - 1]), s: 'sub' }],
      xHdr([t.thDate, t.thPart, t.thDq, t.thDy, t.thNav, t.thDq, t.thDy, t.thPer, t.thYtd, t.thQ, t.th1y, t.thGain])];
    [...S].reverse().filter(s => s.nf).forEach(s => {
      const r = res.length + 1, q = S[dIdx(pl, qBack(s.d, 3))], y = S[dIdx(pl, qBack(s.d, 12))], A = `A${r}`;
      const prev = (col, m) => S_(col, byD(`EOMONTH(${A},-${m})`));
      res.push([xDate(s.d), xF(S_('E', byD(A)), s.part, '#,##0', 'res'), q ? xF(`B${r}-${prev('E', 3)}`, s.part - q.part, '#,##0') : null, y ? xF(`B${r}-${prev('E', 12)}`, s.part - y.part, '#,##0') : null,
        xF(S_('F', byD(A)), s.nav, '#,##0.0', 'res'), q ? xF(`E${r}/${prev('F', 3)}-1`, s.nav / q.nav - 1, '0.00%') : null, y ? xF(`E${r}/${prev('F', 12)}-1`, s.nav / y.nav - 1, '0.00%') : null,
        s.per == null ? null : xF(`IF(B${r}=0,"",E${r}*1000000/B${r})`, s.per, '#,##0'), s.ytd == null ? null : xF(`SUMIFS(${MKX.V}!C:C,${MKX.V}!A:A,${A},${MKX.V}!B:B,"${X.ALL}")`, s.ytd, '0.00', 'res'),
        s.qret == null ? null : xF(`IFERROR(${S_('S', byD(A))}/${S_('T', byD(A))},"")`, s.qret, '0.00', 'res'), s.r1 == null ? null : xF(`SUMIFS(${MKX.V}!D:D,${MKX.V}!A:A,${A},${MKX.V}!B:B,"${X.ALL}")`, s.r1, '0.00', 'res'),
        s.gain == null ? null : xF(S_('L', byD(A)), s.gain, '#,##0.0', 'res')]);
    });
    return res;
  }, [12, 12, 12, 12, 12, 10, 10, 12, 11, 10, 10, 14]);
});
XLB.set('mgT', async () => {
  const L = lang === 'lt', t = T(), pl = MS.pl, di = dIdx(pl, MS.d), dq = dIdx(pl, qBack(MS.d, 3)), dy = dIdx(pl, qBack(MS.d, 12)), M = byMgr(pl, di), Mq = byMgr(pl, dq), My = byMgr(pl, dy);
  return mkBookOut(pl, () => {
    const res = [[{ v: `${t.mgTitle} · ${pl} ${L ? 'pakopa' : 'pillar'} · ${MS.d}`, s: 'title' }], [{ v: t.srcLB(pl, MS.d), s: 'sub' }],
      xHdr([t.thMgr, t.thFunds, t.thPart, t.thShare, t.thDq, t.thDy, t.thNav, t.thShare, t.thDq, t.thDy, t.thPer])];
    const list = Object.entries(M).sort((a, b) => b[1].nav - a[1].nav), r0 = 4, rT = r0 + list.length;
    const dc = `DATE(${MS.d.slice(0, 4)},${+MS.d.slice(5, 7)},${+MS.d.slice(8)})`, dQ = `EOMONTH(${dc},-3)`, dY = `EOMONTH(${dc},-12)`;
    list.forEach(([m, x]) => {
      const r = res.length + 1, mc = `${MKX.D}!B:B,$A${r}`, q = Mq[m], y = My[m];
      res.push([{ v: m, s: 'b' }, xF(`COUNTIFS(${byD(dc)},${mc})`, x.nf, '0'), xF(S_('E', byD(dc), mc), x.part, '#,##0', 'res'), xF(`C${r}/C$${rT}`, x.part / totals(pl, di).part, '0.00%'),
        q ? xF(`C${r}-${S_('E', byD(dQ), mc)}`, x.part - q.part, '#,##0') : null, y ? xF(`C${r}-${S_('E', byD(dY), mc)}`, x.part - y.part, '#,##0') : null,
        xF(S_('F', byD(dc), mc), x.nav, '#,##0.0', 'res'), xF(`G${r}/G$${rT}`, x.nav / totals(pl, di).nav, '0.00%'),
        q ? xF(`G${r}/${S_('F', byD(dQ), mc)}-1`, x.nav / q.nav - 1, '0.00%') : null, y ? xF(`G${r}/${S_('F', byD(dY), mc)}-1`, x.nav / y.nav - 1, '0.00%') : null,
        x.part ? xF(`G${r}*1000000/C${r}`, x.nav * 1e6 / x.part, '#,##0') : null]);
    });
    const T0 = totals(pl, di);
    res.push([{ v: t.thTot, s: 'sum' }, xF(`SUM(B${r0}:B${rT - 1})`, T0.nf, '0', 'sum'), xF(`SUM(C${r0}:C${rT - 1})`, T0.part, '#,##0', 'sum'), null, null, null, xF(`SUM(G${r0}:G${rT - 1})`, T0.nav, '#,##0.0', 'sum'), null, null, null, T0.part ? xF(`G${rT}*1000000/C${rT}`, T0.nav * 1e6 / T0.part, '#,##0', 'sum') : null]);
    return res;
  }, [14, 8, 12, 9, 12, 12, 12, 9, 10, 10, 12]);
});
XLB.set('gpTable', async () => {
  const L = lang === 'lt', t = T(), pl = MS.pl, di = dIdx(pl, MS.d), cols = []; for (let i = di; i >= 0 && cols.length < 6; i--) cols.unshift(i);
  const gs = [...new Set(cols.flatMap(c => groupsAt(pl, c)))].sort((a, b) => MK_ORDER.indexOf(groupKeyOf(pl, a)) - MK_ORDER.indexOf(groupKeyOf(pl, b)));
  return mkBookOut(pl, () => {
    const res = [[{ v: `${t.gpTitle} · ${pl} ${L ? 'pakopa' : 'pillar'}`, s: 'title' }], [{ v: t.srcLB(pl, MS.d), s: 'sub' }], [{ v: t.thGroup, s: 'hdr' }, ...cols.map(c => xDate(MKT[pl].dates[c]))]];
    gs.forEach(gi => { const r = res.length + 1; res.push([{ v: groupLbl(pl, gi), s: 'b' }, ...cols.map((c, j) => { const col = XL.col(j + 1), v = rowsAt(pl, c).filter(x => fundOf(pl, x)[2] === gi).reduce((s, x) => s + (x[MC.part] || 0), 0);
      return xF(S_('E', byD(`${col}$3`), `${MKX.D}!D:D,$A${r}`), v, '#,##0', 'res'); })]); });
    const r = res.length; res.push([{ v: t.thTot, s: 'sum' }, ...cols.map((c, j) => xF(`SUM(${XL.col(j + 1)}4:${XL.col(j + 1)}${r})`, totals(pl, c).part, '#,##0', 'sum'))]);
    return res;
  }, [30, ...cols.map(() => 12)]);
});
function mkFundBook(pl, gi) {
  const L = lang === 'lt', t = T(), di = dIdx(pl, MS.d), k = MC[MS.sort];
  return mkBookOut(pl, X => {
    const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi).sort((a, b) => (b[k] ?? -1e9) - (a[k] ?? -1e9)), a = avgOf(pl, di, gi);
    const res = [[{ v: `${groupLbl(pl, gi)} · ${pl} ${L ? 'pakopa' : 'pillar'} · ${MS.d}`, s: 'title' }], [{ v: t.srcLB(pl, MS.d), s: 'sub' }],
      xHdr([t.thFund, t.thMgr, t.thPart, t.thNav, t.thYtd, t.thQ, t.th1y, t.th3y, t.th5y, t.thGcf, t.thBm, t.thRisky])];
    const D = MKX.D, ref = (c, n) => `${D}!${c}${n}`;
    rs.forEach(r => { const n = X.pos.get(di * 1000 + r[1]), f = fundOf(pl, r), cell = (c, v, z) => v == null ? null : xF(ref(c, n), v, z);
      res.push([{ v: f[1], s: 'b' }, f[0], cell('E', r[MC.part], '#,##0'), cell('F', r[MC.nav], '0.000'), cell('G', r[MC.ret_ytd], '0.00'), cell('I', r[MC.ret_q], '0.00'), cell('M', r[MC.ret_1y], '0.00'), cell('N', r[MC.ret_3y], '0.00'), cell('O', r[MC.ret_5y], '0.00'), cell('P', r[MC.ret_gcf], '0.00'), cell('Q', r[MC.bm_ytd], '0.00'), cell('R', r[MC.risky], '0.0')]); });
    if (a) { const n = X.avPos.get(di * 100 + gi), r0 = 4, r1 = res.length, V = (c, v) => v == null ? null : xF(`${MKX.V}!${c}${n}`, v, '0.00', 'sum');
      res.push([{ v: t.thAvg, s: 'sum' }, '', xF(`SUM(C${r0}:C${r1})`, rs.reduce((s, r) => s + (r[MC.part] || 0), 0), '#,##0', 'sum'), xF(`SUM(D${r0}:D${r1})`, rs.reduce((s, r) => s + (r[MC.nav] || 0), 0), '0.000', 'sum'),
        V('C', a[MA.ret_ytd]), xF(`IFERROR(SUMPRODUCT(D${r0}:D${r1},F${r0}:F${r1})/SUMPRODUCT(D${r0}:D${r1}*(F${r0}:F${r1}<>"")),"")`, qRet(pl, di, gi), '0.00', 'sum'), V('D', a[MA.ret_1y]), V('E', a[MA.ret_3y]), V('F', a[MA.ret_5y]), V('G', a[MA.ret_gcf]), V('H', a[MA.bm_ytd]), null]); }
    return res;
  }, [50, 11, 11, 11, 11, 10, 10, 10, 10, 12, 12, 10], [[L ? 'Fondų eilutės' : 'Fund rows', L ? 'Kiekvienas langelis – nuoroda į fondo eilutę lape „LB duomenys“; vidurkio eilutė – LB paskelbtas svertinis grupės vidurkis (lapas „LB vidurkiai“), ketvirčio – turtu svertas fondų vidurkis.' : 'Each cell links to the fund row in “LB duomenys”; the average row is the BoL weighted group average (sheet “LB vidurkiai”), the quarter one – asset-weighted fund average.']]);
}
/* faktų Excel: lapas „Faktai“ – kiekvienas sakinys ir visi jo skaičiai kaip formulės (geltoni – tie patys skaičiai kaip svetainėje),
   „Pakopa laike“ – pakopos sumos kiekvieną ketvirtį (rekordams), LB duomenų lapai ir metodika */
async function mkFactBook(facts, title) {
  const L = lang === 'lt', t = T(), X0 = t.fx, pl = MS.pl, d = MS.d, X = mkDataSheets(pl), wb = XL.book(), dv = s => dayOf(s) + 25569;
  const res = [[{ v: `${title} · ${pl} ${L ? 'pakopa' : 'pillar'} · ${d}`, s: 'title' }], [{ v: `${t.srcLB(pl, d)} https://www.lb.lt/lt/pf-veiklos-rodikliai`, s: 'sub' }], [{ v: X0.dates, s: 'b' }],
    [{ v: t.thNow, s: 'b' }, xDate(d)], [{ v: t.thPrevQ, s: 'b' }, xF('EOMONTH(B4,-3)', dv(qBack(d, 3)), 'yyyy-mm-dd')], [{ v: t.thPrevY, s: 'b' }, xF('EOMONTH(B4,-12)', dv(qBack(d, 12)), 'yyyy-mm-dd')], [],
    xHdr([X0.fact, X0.fig, X0.val])];
  facts.forEach(f => {
    res.push([{ v: f.h, s: 'step' }, { v: f.text, s: 'b' }], [null, { v: `${t.how} ${f.calc}`, s: 'note' }]);
    const r0 = res.length + 1, c = i => `C${r0 + i}`;
    f.nums.forEach(n => res.push([null, n.l, n.v == null ? null : xF(n.f(c, X), n.v, n.z, 'res')]));
    res.push([]);
  });
  XL.sheet(wb, X0.sheetF, res, { cols: [24, 70, 16], freeze: { r: 8 } });
  const tr = [xHdr([t.thDate, t.thPart, t.thNav, t.thGain])];
  MKT[pl].dates.forEach((x, i) => { const T0 = totals(pl, i); if (!T0.nf) return; const n = tr.length + 1, g = gainAt(pl, i);
    tr.push([xDate(x), xF(S_('E', byD(`A${n}`)), T0.part, Zi), xF(S_('F', byD(`A${n}`)), T0.nav, Zm), g == null ? null : xF(S_('L', byD(`A${n}`)), g, Zm)]); });
  XL.sheet(wb, X0.sheetT, tr, { cols: [12, 12, 14, 16], freeze: { r: 1 } });
  X.sheets.forEach(s => XL.sheet(wb, s.name, s.rows, s.o));
  const oth = [...new Set(facts.map(f => f.other).filter(Boolean))];
  oth.forEach(o => { const s = mkDataSheets(o).sheets[0]; XL.sheet(wb, `LB duomenys (${o})`, s.rows, s.o); });
  const legend = L ? [['Mėlyni skaičiai', 'Tiesiai iš LB failų (lapai „LB duomenys“, „LB vidurkiai“) – galima sutikrinti su LB paskelbtu failu.'], ['Geltoni skaičiai', 'Tie patys skaičiai kaip svetainėje ir fakto sakinyje; kiekvienas – Excel formulė. Spustelėkite langelį ir viršuje matysite formulę.'],
    ['Datos', 'Lape „Faktai“ langelis B4 – ketvirčio pabaiga; pakeitus jį į kitą ketvirčio pabaigą, perskaičiuojama dauguma skaičių (sakinių tekstas nesikeičia).']]
    : [['Blue numbers', 'Straight from the BoL files (sheets “LB duomenys”, “LB vidurkiai”) – can be checked against the published file.'], ['Yellow numbers', 'The same figures as on the site and in the sentence; each is an Excel formula. Click a cell to see it.'],
      ['Dates', 'Cell B4 in “Facts” is the quarter end; change it to another quarter end and most figures recalculate (sentence text does not).']];
  const meth = [[{ v: L ? 'Metodika ir šaltiniai' : 'Methodology and sources', s: 'title' }], [], ...legend.map(([a, b]) => [{ v: a, s: 'b' }, { v: b, s: 'note' }]),
    ...mkMeth().slice(1).map(r => [{ v: r[0], s: 'b' }, { v: r[1], s: 'note' }]), [],
    ...facts.filter((f, i, a) => a.findIndex(g => g.calc === f.calc) === i).map(f => [{ v: f.h, s: 'b' }, { v: f.calc, s: 'note' }]), [],
    [{ v: L ? 'Puslapis' : 'Page', s: 'b' }, { v: location.href.split('#')[0], l: location.href.split('#')[0], s: 'link' }], [{ v: L ? 'Failas sukurtas' : 'File created', s: 'b' }, new Date().toLocaleString(t.locale)],
    [{ v: L ? 'Pastaba' : 'Note', s: 'b' }, { v: L ? 'Informacinė medžiaga, ne investavimo rekomendacija. LB skaičiai gali skirtis nuo valdytojų ar asociacijos skelbiamų.' : 'For information only, not investment advice. BoL figures may differ from those published by managers or the association.', s: 'note' }]];
  XL.sheet(wb, L ? 'Metodika' : 'Methodology', meth, { cols: [28, 110], grid: false });
  await XL.save(wb, `${title.replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 40)}_${pl}_${d}.xlsx`);
}
