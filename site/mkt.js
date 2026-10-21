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
  mkLead: 'Participants, net assets and asset-weighted returns of the whole pillar at each quarter end since 2015.', mkMgr: m => `Showing ${m}: participants, assets, market shares and investment gain (weighted returns are not shown for a manager – they would mix different groups).`,
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
    nav: (pl, d, v, q, y) => `On ${d} pillar ${pl} pension funds managed ${v} of net assets.${wSeq('assets', [q && [wPer()[0], ...q], y && [wPer()[1], ...y]], mMn)}`,
    part: (pl, d, n, q, y) => `On ${d} ${mInt(n)} people were saving in pillar ${pl} pension funds.${wSeq('the number of participants', [q && [wPer()[0], ...q], y && [wPer()[1], ...y]], mInt)}`,
    part3: (pl, d, n, q, y) => `On ${d} pillar ${pl} pension funds had ${mInt(n)} participants (a person saving in several funds is counted in each).${wSeq('the number of participants', [q && [wPer()[0], ...q], y && [wPer()[1], ...y]], mInt)}`,
    ret: (pl, qn, ytd, qr, r1) => `Since the start of the year the average (asset-weighted) return of pillar ${pl} pension funds was ${ytd}${qr ? `; in ${qn} it was ${qr}` : ''}${r1 ? `, and over the last 12 months ${r1}` : ''}.`,
    gain1: (pl, qn, g, y) => `In ${qn} pillar ${pl} pension funds ${g >= 0 ? `earned an investment gain of about ${mMn(g)}` : `made an investment loss of about ${mMn(-g)}`}${y == null ? '' : (y >= 0) === (g >= 0) ? `, and about ${mMn(Math.abs(y))} since the start of the year` : y >= 0 ? `, but since the start of the year they have earned about ${mMn(y)}` : `, but since the start of the year they have lost about ${mMn(-y)}`}.`,
    per: (pl, v, y) => `Assets per pillar ${pl} participant averaged ${v}${y ? ` (a year earlier ${y})` : ''}.`,
    lc: (lo, lg, hi, hg) => `Since the start of the year the average return of life-cycle groups ranged from ${lo} (“${lg}”) to ${hi} (“${hg}”).`,
    mgr: (a, as, p, ps) => a === p ? `The largest manager is ${a}, with ${as} of the pillar’s assets and ${ps} of its participants.` : `${a} manages the most assets (${as} of the pillar), while ${p} has the most participants (${ps}).`,
    both: (d, v, n) => `On ${d} pillar II and III pension funds together managed ${v}${n ? ` and had ${mInt(n)} participants (a person saving in several funds is counted in each)` : ''}.`,
    chg: (hi, hv, lo, lv) => hv < 0 ? `Over the quarter every manager lost participants: ${lo} the most (${mInt(-lv)}), ${hi} the fewest (${mInt(-hv)}).` : lv > 0 ? `Over the quarter every manager gained participants: ${hi} the most (${mInt(hv)}), ${lo} the fewest (${mInt(lv)}).` : `Over the quarter ${hi} gained the most participants (${mInt(hv)}), while ${lo} lost the most (${mInt(-lv)}).`,
    m1: (m, pl, v, s, p, ps) => `${m} managed ${v} of pillar ${pl} assets (${s} of the pillar) and had ${mInt(p)} participants (${ps} of all).`,
    m2: (m, q, nq) => `Over the quarter ${m}’s participants changed by ${q} and assets by ${nq}.`,
    m3: (m, k, n) => `${m} funds beat the Bank of Lithuania group average since the start of the year in ${k} of ${n} groups.`,
    m4: (m, pos, of, gl) => `Since the start of the year ${m}’s best result was in the “${gl}” group: place ${pos} of ${of}.`,
    calcNav: 'Sum of fund net assets in the report.', calcPart: 'Sum of fund participants in the report.', calcRet: 'Bank of Lithuania asset-weighted average of all funds (“All funds”, weights – assets on the report date); quarter return – fund quarter returns weighted by quarter-end assets (fund quarter return = (1 + YTD) ÷ (1 + previous quarter YTD) − 1).',
    calcGain: 'Σ fund quarter return × (assets at quarter start + half the net flow; from Q2 2026 the whole flow, as reform payouts are made at the start of the quarter). An estimate.', calcPer: 'Net assets ÷ participants.', calcLc: 'Bank of Lithuania weighted group averages.', calcMgr: 'Manager’s funds ÷ whole pillar.', calcChg: 'Manager’s participants now − at previous quarter end.', calcM3: 'Manager fund’s YTD return vs Bank of Lithuania group average, groups where the manager has a fund.',
  },
}, {
  tdTitle: 'Šiandien', qfTitle: 'Ketvirčio faktai', mkTitle: 'Rinka laike', mgTitle: 'Valdytojai', fdTitle: 'Fondai pagal grupes',
  qfLead: 'Naujienoms ir apžvalgoms paruošti faktai iš Lietuvos banko ketvirčio rezultatų ataskaitų: visa rinka, valdytojai ir fondai. Kiekvienoje kortelėje – laikotarpis, šaltinis ir kaip skaičiuota; „Kopijuoti“ nukopijuoja sakinį su šaltiniu.',
  mkLead: 'Visos pakopos dalyviai, grynieji aktyvai ir svertinė grąža kiekvieno ketvirčio pabaigoje nuo 2015 m.', mkMgr: m => `Rodomas valdytojas ${m}: dalyviai, turtas, rinkos dalys ir investicinis prieaugis (svertinės grąžos valdytojui nerodomos – jos sumaišytų skirtingas grupes).`,
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
    nav: (pl, d, v, q, y) => `${d} ${pl} pakopos pensijų fondai valdė ${v} grynųjų aktyvų.${wSeq('turtas', [q && [wPer()[0], ...q], y && [wPer()[1], ...y]], mMn)}`,
    part: (pl, d, n, q, y) => `${d} ${pl} pakopos pensijų fonduose kaupė ${mInt(n)} ${ltN(n, 'dalyvis', 'dalyviai', 'dalyvių')}.${wSeq('dalyvių', [q && [wPer()[0], ...q], y && [wPer()[1], ...y]], mInt, 1)}`,
    part3: (pl, d, n, q, y) => `${d} ${pl} pakopos pensijų fondai turėjo ${mInt(n)} ${ltN(n, 'dalyvį', 'dalyvius', 'dalyvių')} (žmogus, kaupiantis keliuose fonduose, skaičiuojamas kiekviename).${wSeq('dalyvių', [q && [wPer()[0], ...q], y && [wPer()[1], ...y]], mInt, 1)}`,
    ret: (pl, qn, ytd, qr, r1) => `Nuo metų pradžios ${pl} pakopos pensijų fondų vidutinė (pagal turtą svertinė) grąža – ${ytd}${qr ? `, ${qn} – ${qr}` : ''}${r1 ? `, per pastaruosius 12 mėnesių – ${r1}` : ''}.`,
    gain1: (pl, qn, g, y) => `${qn[0].toUpperCase() + qn.slice(1)} ${pl} pakopos pensijų fondai ${g >= 0 ? `uždirbo apie ${mMn(g)} investicinio prieaugio` : `patyrė apie ${mMn(-g)} investicinių nuostolių`}${y == null ? '' : (y >= 0) === (g >= 0) ? `, nuo metų pradžios – apie ${mMn(Math.abs(y))}` : y >= 0 ? `, tačiau nuo metų pradžios uždirbo apie ${mMn(y)}` : `, tačiau nuo metų pradžios patyrė apie ${mMn(-y)} nuostolių`}.`,
    per: (pl, v, y) => `Vienam ${pl} pakopos dalyviui vidutiniškai teko ${v} sukaupto turto${y ? ` (prieš metus – ${y})` : ''}.`,
    lc: (lo, lg, hi, hg) => `Nuo metų pradžios gyvenimo ciklo grupių vidutinė grąža svyravo nuo ${lo} (grupė „${lg}“) iki ${hi} (grupė „${hg}“).`,
    mgr: (a, as, p, ps) => a === p ? `Didžiausias valdytojas – ${a}: jam tenka ${as} pakopos turto ir ${ps} visų dalyvių.` : `Daugiausia pakopos turto valdo ${a} (${as}), daugiausia dalyvių turi ${p} (${ps}).`,
    both: (d, v, n) => `${d} II ir III pakopos pensijų fondai kartu valdė ${v}${n ? `; juose kaupė ${mInt(n)} ${ltN(n, 'dalyvis', 'dalyviai', 'dalyvių')} (žmogus, kaupiantis keliuose fonduose, skaičiuojamas kiekviename)` : ''}.`,
    chg: (hi, hv, lo, lv) => hv < 0 ? `Per ketvirtį dalyvių sumažėjo visų valdytojų fonduose: labiausiai – ${lo} (${mInt(-lv)}), mažiausiai – ${hi} (${mInt(-hv)}).` : lv > 0 ? `Per ketvirtį dalyvių padaugėjo visų valdytojų fonduose: labiausiai – ${hi} (${mInt(hv)}), mažiausiai – ${lo} (${mInt(lv)}).` : `Per ketvirtį dalyvių labiausiai padaugėjo ${hi} fonduose (${mInt(hv)}), o labiausiai sumažėjo – ${lo} fonduose (${mInt(-lv)}).`,
    m1: (m, pl, v, s, p, ps) => `${m} valdė ${v} ${pl} pakopos turto (${s} pakopos) ir turėjo ${mInt(p)} ${ltN(p, 'dalyvį', 'dalyvius', 'dalyvių')} (${ps} visų dalyvių).`,
    m2: (m, q, nq) => `Per ketvirtį ${m} dalyvių skaičius pakito ${q}, turtas – ${nq}.`,
    m3: (m, k, n) => `${m} fondų grąža nuo metų pradžios viršijo LB grupės vidurkį ${k} iš ${n} grupių.`,
    m4: (m, pos, of, gl) => `Nuo metų pradžios geriausiai ${m} fondui sekėsi grupėje „${gl}“: ${pos} vieta iš ${of}.`,
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
const mMn = v => Math.abs(v) >= 1000 ? `${num(v / 1000, 2)} ${lang === 'lt' ? 'mlrd. €' : 'bn €'}` : `${num(v, Math.abs(v) < 10 ? 2 : 1)} ${lang === 'lt' ? 'mln. €' : 'm €'}`;
const mSMn = v => (v >= 0 ? '+' : '−') + mMn(Math.abs(v));
const mRel = (a, b) => a != null && b ? pct((a / b - 1) * 100) : '';
const mPct = v => v == null ? '–' : pct(v);
const mShare = (a, b) => b ? pctPlain(a / b * 100, 1) : '–';
const mEurs = v => `${mInt(v)} €`;
/* sakinių kalba: kryptis žodžiu, skaičiai be „+“, kad sakinį būtų galima kopijuoti į tekstą */
const ltN = (n, a, b, c) => { const k = Math.abs(Math.round(n)), d = k % 10, h = k % 100; return d === 1 && h !== 11 ? a : d >= 2 && (h < 12 || h > 19) ? b : c; };
const pA = v => pctPlain(Math.abs(v));
const ppA = v => `${num(Math.abs(v), 2)} ${lang === 'lt' ? 'p. p.' : 'pp'}`;
const wDir = (d, cnt) => lang === 'lt' ? (d > 0 ? (cnt ? 'padaugėjo' : 'padidėjo') : d < 0 ? 'sumažėjo' : 'nepakito') : (d > 0 ? 'rose by' : d < 0 ? 'fell by' : 'was unchanged');
const wList = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join(', ')} ${lang === 'lt' ? 'ir' : 'and'} ${a[a.length - 1]}`;
/* „Per ketvirtį turtas sumažėjo A (a %), per metus – B (b %).“ parts = [[laikotarpis, skirtumas, santykinis % | null], …] */
function wSeq(subj, parts, fmt, cnt) {
  const L = lang === 'lt', ps = parts.filter(x => x && x[1] != null && isFinite(x[1])); if (!ps.length) return '';
  const fig = x => x[1] ? `${fmt(Math.abs(x[1]))}${x[2] != null && isFinite(x[2]) ? ` (${pA(x[2])})` : ''}` : '';
  return ' ' + ps.map((x, i) => {
    if (!i) return `${x[0][0].toUpperCase() + x[0].slice(1)} ${subj} ${wDir(x[1], cnt)} ${fig(x)}`.trim();
    const same = x[1] && Math.sign(x[1]) === Math.sign(ps[i - 1][1]);
    return L ? `${x[0]} – ${same ? fig(x) : `${wDir(x[1], cnt)} ${fig(x)}`.trim()}` : `${x[0]} ${same ? 'by ' + fig(x) : `${wDir(x[1], cnt)} ${fig(x)}`.trim()}`;
  }).join(', ') + '.';
}
const wPer = () => lang === 'lt' ? ['per ketvirtį', 'per metus', 'per 3 metus'] : ['over the quarter', 'over the year', 'over 3 years'];
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
    flowH: 'Change in assets', flow: (v, g, fl, pl) => `Over the quarter pillar ${pl} assets ${wDir(v)} ${mMn(Math.abs(v))}: investments ${g >= 0 ? `earned about ${mMn(g)}` : `lost about ${mMn(-g)}`}, and ${fl >= 0 ? 'contributions exceeded payouts' : 'payouts exceeded contributions'} by about ${mMn(Math.abs(fl))}.`,
    calcFlow: 'Change = assets at quarter end − at quarter start; contributions minus payouts = change − investment gain (an estimate).',
    concH: 'Market concentration', conc: (n3, s3, hhi) => `The three largest managers (${n3}) manage ${s3} of the pillar’s assets; the market concentration index (HHI) is ${hhi}.`,
    calcConc: 'Managers’ shares of assets; HHI = Σ (share, %)²; above 2,500 a market is considered highly concentrated.',
    beatH: 'Funds vs group averages', beat: (k, n) => `Since the start of the year ${k} of ${n} funds earned more than the average of their group (Bank of Lithuania weighted average).`,
    calcBeat: 'In each Bank of Lithuania group – funds whose return since the start of the year is above the group average; summed over groups.',
    bmH: 'Benchmarks', bm: (k, n) => `Since the start of the year ${k} of ${n} funds beat their benchmark.`,
    calcBm: 'Fund return since the start of the year > its benchmark return (both from the Bank of Lithuania file); only funds with both figures.',
    recH: 'Records', recNow: v => `Pillar assets (${v}) are the highest in the whole Bank of Lithuania series since 2015.`, recWas: (v, d, now) => `Pillar assets peaked at ${v} on ${d}; they now stand at ${now}.`,
    calcRec: 'Largest sum of pillar net assets over all quarters up to the selected one.',
    grH: 'Assets over 5 years', gr: (a, b, x, c, up) => `Over 5 years pillar assets ${up ? 'grew' : 'fell'} from ${a} to ${b}${up && x >= 1.5 ? ` (×${num(x, 1)})` : ''}, an average of ${c} a year.`,
    calcGr: 'Assets now ÷ assets 5 years ago; annual growth = ratio^(1/5) − 1 (includes both contributions and returns).',
    m2: (m, pq, pr, mq, py, pyr, my) => `${wSeq(`the number of ${m} participants`, [[wPer()[0], pq, pr], [wPer()[1], py, pyr]], mInt).trim()}${wSeq('the number of participants in the whole pillar', [[wPer()[0], mq, null], [wPer()[1], my, null]], pA)}`,
    m5: (m, s0, a, b) => `${m}’s share of pillar assets is ${s0}.${wSeq('it', [[wPer()[1], a, null], b != null && [wPer()[2], b, null]], ppA)}`,
    calcM5: 'Manager’s assets ÷ whole pillar assets; change in percentage points.',
    m6: (m, g, s) => g >= 0 ? `Over the quarter ${m}’s funds earned an investment gain of about ${mMn(g)}${s ? ` (${s} of the pillar’s total gain)` : ''}.` : `Over the quarter ${m}’s funds made an investment loss of about ${mMn(-g)}.`,
    m7: (m, a, b) => `Average assets per ${m} participant: ${a} (pillar average ${b}).`,
    m3: (m, parts) => `${m}’s funds earned more than their group average (Bank of Lithuania) ${parts}.`,
    per: { ytd: 'since the start of the year', r1: 'over 1 year', r3: 'over 3 years' }, ofG: (k, n) => `in ${k} of ${n} groups`,
    calcM3: 'In each group where the manager has a fund, its best fund is compared with the Bank of Lithuania weighted group average (same group only).',
    calcM4: 'Place of the manager’s best fund by return since the start of the year among funds of the same group.',
    xl: 'Excel', xlAll: 'Excel with all calculations', miTitle: 'Manager insights', miLead: 'For each manager – market share and its trend, participants, investment gain and how its funds did against the Bank of Lithuania group averages. Funds are compared only within their group. “Excel” – every figure as a formula from the Bank of Lithuania data.',
    shTot: 'whole pillar', above: 'funds above average', withRet: 'funds with return', tot: 'Total', rank: 'Place', of: 'Funds in group', beatF: 'Beats average (1 = yes)', best: 'Manager’s best fund',
    sheetF: 'Facts', sheetT: 'Pillar over time', fact: 'Fact', fig: 'Figure in the sentence', val: 'Value', dates: 'Dates (all formulas use these cells)',
  },
}, {
  fx: {
    flowH: 'Turto pokytis', flow: (v, g, fl, pl) => `Per ketvirtį ${pl} pakopos turtas ${wDir(v)} ${mMn(Math.abs(v))}: investicijos ${g >= 0 ? `uždirbo apie ${mMn(g)}` : `prarado apie ${mMn(-g)}`}, o ${fl >= 0 ? 'įmokos viršijo išmokas' : 'išmokos viršijo įmokas'} apie ${mMn(Math.abs(fl))}.`,
    calcFlow: 'Pokytis = turtas ketvirčio pabaigoje − pradžioje; įmokų ir išmokų balansas = pokytis − investicinis prieaugis (įvertis).',
    concH: 'Rinkos koncentracija', conc: (n3, s3, hhi) => `Trys didžiausi valdytojai – ${n3} – valdo ${s3} pakopos turto; rinkos koncentracijos indeksas (HHI) – ${hhi}.`,
    calcConc: 'Valdytojų turto dalys; HHI = Σ (dalis, %)²; virš 2 500 rinka laikoma labai koncentruota.',
    beatH: 'Fondai ir grupių vidurkiai', beat: (k, n) => `Nuo metų pradžios ${k} iš ${n} fondų uždirbo daugiau nei vidutiniškai jų grupės fondai (LB svertinis grupės vidurkis).`,
    calcBeat: 'Kiekvienoje LB grupėje – fondai, kurių grąža nuo metų pradžios didesnė už LB grupės vidurkį; sudėta per grupes.',
    bmH: 'Lyginamieji indeksai', bm: (k, n) => `Nuo metų pradžios ${k} iš ${n} fondų uždirbo daugiau nei jų lyginamasis indeksas.`,
    calcBm: 'Fondo grąža nuo metų pradžios > jo lyginamojo indekso grąža (abi – LB failas); tik fondai, turintys abu skaičius.',
    recH: 'Rekordai', recNow: v => `Pakopos fondų turtas (${v}) dabar didžiausias per visą LB duomenų laikotarpį nuo 2015 m.`, recWas: (v, d, now) => `Daugiausia turto pakopos fondai valdė ${d} – ${v}; dabar jie valdo ${now}.`,
    calcRec: 'Didžiausia pakopos grynųjų aktyvų suma tarp visų ketvirčių iki pasirinkto.',
    grH: 'Turtas per 5 metus', gr: (a, b, x, c, up) => `Per 5 metus pakopos turtas ${up ? 'išaugo' : 'sumažėjo'} nuo ${a} iki ${b}${up && x >= 1.5 ? ` (${num(x, 1)} karto)` : ''}, t. y. vidutiniškai ${up ? 'augo' : 'mažėjo'} po ${c} per metus.`,
    calcGr: 'Turtas dabar ÷ turtas prieš 5 metus; metinis augimas = santykis^(1/5) − 1 (apima ir įmokas, ir grąžą).',
    m2: (m, pq, pr, mq, py, pyr, my) => `${wSeq(`${m} fondų dalyvių`, [[wPer()[0], pq, pr], [wPer()[1], py, pyr]], mInt, 1).trim()}${wSeq('visoje pakopoje dalyvių', [[wPer()[0], mq, null], [wPer()[1], my, null]], pA, 1)}`,
    m5: (m, s0, a, b) => `${m} dalis pakopos turto – ${s0}.${wSeq('ji', [[wPer()[1], a, null], b != null && [wPer()[2], b, null]], ppA)}`,
    calcM5: 'Valdytojo turtas ÷ visos pakopos turtas; pokytis procentiniais punktais.',
    m6: (m, g, s) => g >= 0 ? `Per ketvirtį ${m} fondai uždirbo apie ${mMn(g)} investicinio prieaugio${s ? ` (${s} visos pakopos prieaugio)` : ''}.` : `Per ketvirtį ${m} fondai patyrė apie ${mMn(-g)} investicinių nuostolių.`,
    m7: (m, a, b) => `Vidutinis ${m} dalyvio sukauptas turtas – ${a} (pakopos vidurkis – ${b}).`,
    m3: (m, parts) => `${m} fondai uždirbo daugiau nei jų grupės vidurkis (LB): ${parts}.`,
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
/* naujos kortelių temos (savininkas 2026-10-20: „kuo įvairesnių temų ir kuo įdomesnių kampų, kad naujienlaiškiai nesikartotų … verta turėti
   rezerve“): akcijų dalis strategijose, vertės svyravimai, mokesčiai (BAR), grąžų serijos, dalyviai pagal grupes, fondo pasirinkimo svarba,
   12 mėnesių lyderiai. Visur lyginama tik grupės viduje; kiekvienas skaičius – su Excel formule. */
addStrings({ nf: {
  rkH: 'Equity share in strategies', rk: (a, av, b, bv) => `The share of risky assets (mostly equities) in fund strategies is highest in the “${a}” group – ${av} on average – and lowest in the “${b}” group (${bv}).`,
  calcRk: 'Risky-asset share under the fund strategy (Bank of Lithuania file); group average weighted by fund net assets.',
  sdH: 'Ups and downs of value', sd: (a, av, b, bv) => `Over the last 3 years the value of “${a}” funds fluctuated the most – an average annual standard deviation of ${av} – and “${b}” funds the least (${bv}).`,
  calcSd: 'Standard deviation of the fund’s 3-year return, annualised (Bank of Lithuania file); group average weighted by net assets. A higher deviation means larger swings in value.',
  feH: 'Fees', fe: (pl, av, g, a, x, b, y) => `The average (asset-weighted) total deduction ratio (BAR) of pillar ${pl} funds is ${av} a year.${g ? ` Within one group the gap is largest in “${g}”: from ${x} (${a}) to ${y} (${b}).` : ''}`,
  calcFe: 'BAR – total deduction ratio, % of assets per year (Bank of Lithuania results report, since 2020; not given for every fund). Average weighted by net assets; the cheapest and the most expensive fund are compared only within the same group. Fees are already deducted from unit values.',
  skH: 'Streak of returns', skP: (pl, n, since, pos) => `The average quarterly return of pillar ${pl} funds has been ${pos ? 'positive' : 'negative'} for ${n} quarters in a row – since Q${Math.ceil(+since.slice(5, 7) / 3)} ${since.slice(0, 4)}.`,
  sk1: (pl, q, pos, n) => `In ${q} the average return of pillar ${pl} funds was ${pos ? 'positive' : 'negative'} after ${n} ${n === 1 ? 'quarter' : 'quarters'} of ${pos ? 'negative' : 'positive'} returns in a row.`,
  skL: y => ` It is the longest such streak since ${y}.`, calcSk: 'Quarter return – fund quarter returns weighted by quarter-end assets (as in “Return”); quarters in a row with the same sign are counted.',
  pgH: 'Participants by group', pg: (a, n, s, b, up, r) => `The most participants are in the “${a}” group: ${n} (${s} of all). Over the year the number of participants changed most in the “${b}” group – it ${up ? 'rose' : 'fell'} by ${r}.`,
  calcPg: 'Sum of fund participants in each group; change = now ÷ a year ago − 1, groups that existed a year ago.',
  fcH: 'Choosing a fund matters', fc: (g, b, bv, w, wv, eb, ew, dd) => `In the “${g}” group the best fund (${b}) earned on average ${bv} a year over 5 years and the weakest (${w}) ${wv}. € 1,000 invested 5 years ago would now be ${eb} and ${ew} respectively – a difference of ${dd}.`,
  calcFc: 'Fund 5-year annual return r (Bank of Lithuania file); 1,000 × (1 + r)^5. Only funds of the same group are compared; the group with the largest gap is shown. Past returns do not guarantee future ones.',
  m12H: '12-month leaders', m12: (m, xs) => `Group leaders over the 12 months to the end of ${m}: ${xs}.`, c12: 'Unit value at month end ÷ value 12 months earlier − 1, highest within each group.',
  msH: 'Monthly streak', msP: (n, since, pos) => `The average monthly return of pillar II funds has been ${pos ? 'positive' : 'negative'} for ${n} months in a row – since ${since}.`,
  ms1: (m, pos, n) => `${m} the average return of pillar II funds was ${pos ? 'positive' : 'negative'} after ${n} ${n === 1 ? 'month' : 'months'} of ${pos ? 'negative' : 'positive'} returns in a row.`,
  msL: y => ` It is the longest such streak since ${y}.`, cMs: 'Asset-weighted pillar II month return (sheet “Market by month”); months in a row with the same sign.',
  risky: 'risky-asset share, %', std: 'standard deviation 3 y, %', bar: 'BAR, %', grp: 'Group', min: 'cheapest', max: 'most expensive', qr: 'quarter return, %', n: 'Quarters in a row', nm: 'Months in a row', lg: 'Longest streak in the data', pt: 'Participants', ago: 'a year ago', chg: 'Change', e: '€ 1,000 became, €', diff: 'Difference, €', best: 'best', worst: 'weakest',
  feeH: 'Fees in euros', fee: (pl, v, b, p) => `On average a pillar ${pl} participant pays about ${v} a year in fees (asset-weighted BAR ${b} × average savings ${p}).`, calcFee: 'Asset-weighted average BAR × net assets per participant. An estimate: the actual amount depends on the fund and the savings; fees are already deducted from unit values.', per: 'Assets per participant, €', fy: 'Fees per year, €',
  wR: 'risky-asset share in the strategy', wS: 'standard deviation of the 3-year return', wF: 'BAR (total deduction ratio)', wP: 'the number of participants', gW: 'groups' } },
{ nf: {
  rkH: 'Akcijų dalis strategijose', rk: (a, av, b, bv) => `Fondų strategijose rizikingo turto (daugiausia akcijų) dalis didžiausia grupėje „${a}“ – vidutiniškai ${av}, mažiausia – grupėje „${b}“ (${bv}).`,
  calcRk: 'LB faile nurodyta rizikingo turto dalis pagal fondo strategiją; grupės vidurkis svertinis pagal fondų grynuosius aktyvus.',
  sdH: 'Vertės svyravimai', sd: (a, av, b, bv) => `Per pastaruosius 3 metus labiausiai svyravo grupės „${a}“ fondų vertė – vidutinis metinis standartinis nuokrypis ${av}, mažiausiai – grupės „${b}“ (${bv}).`,
  calcSd: 'LB faile nurodytas fondo 3 metų grąžos standartinis nuokrypis (metinis); grupės vidurkis svertinis pagal grynuosius aktyvus. Didesnis nuokrypis – didesni vertės svyravimai.',
  feH: 'Mokesčiai', fe: (pl, av, g, a, x, b, y) => `Vidutinis (pagal turtą svertinis) ${pl} pakopos fondų bendrasis atskaitymų rodiklis (BAR) – ${av} per metus.${g ? ` Toje pačioje grupėje skirtumas didžiausias grupėje „${g}“: nuo ${x} (${a}) iki ${y} (${b}).` : ''}`,
  calcFe: 'BAR – bendrasis atskaitymų rodiklis, % nuo turto per metus (LB rezultatų ataskaita, nuo 2020 m.; nurodomas ne visiems fondams). Vidurkis svertinis pagal grynuosius aktyvus; pigiausias ir brangiausias fondas lyginami tik toje pačioje grupėje. Mokesčiai jau išskaičiuoti iš vieneto verčių.',
  skH: 'Grąžų serija', skP: (pl, n, since, pos) => `${pl} pakopos fondų vidutinė ketvirčio grąža ${pos ? 'teigiama' : 'neigiama'} jau ${n} ${ltN(n, 'ketvirtį', 'ketvirčius', 'ketvirčių')} iš eilės – nuo ${since.slice(0, 4)} ${ROMAN[Math.ceil(+since.slice(5, 7) / 3) - 1]} ketv.`,
  sk1: (pl, q, pos, n) => `${q[0].toUpperCase() + q.slice(1)} ${pl} pakopos fondų vidutinė grąža buvo ${pos ? 'teigiama' : 'neigiama'} po ${n} ${ltN(n, 'ketvirčio', 'ketvirčių', 'ketvirčių')} ${pos ? 'neigiamos' : 'teigiamos'} grąžos iš eilės.`,
  skL: y => ` Tai ilgiausia tokia serija nuo ${y} m.`, calcSk: 'Ketvirčio grąža – fondų ketvirčio grąžų vidurkis, svertas turtu ketvirčio pabaigoje (kaip kortelėje „Grąža“); skaičiuojami ketvirčiai iš eilės su tuo pačiu ženklu.',
  pgH: 'Dalyviai pagal grupes', pg: (a, n, s, b, up, r) => `Daugiausia dalyvių – grupėje „${a}“: ${n} (${s} visų). Per metus labiausiai pasikeitė grupės „${b}“ dalyvių skaičius – jis ${up ? 'padidėjo' : 'sumažėjo'} ${r}.`,
  calcPg: 'Grupės fondų dalyvių suma; pokytis = dabar ÷ prieš metus − 1, grupės, kurios buvo ir prieš metus.',
  fcH: 'Fondo pasirinkimas svarbus', fc: (g, b, bv, w, wv, eb, ew, dd) => `Grupėje „${g}“ per 5 metus geriausias fondas (${b}) uždirbo vidutiniškai ${bv} per metus, silpniausias (${w}) – ${wv}. Prieš 5 metus investuoti 1 000 € dabar būtų atitinkamai ${eb} ir ${ew} – skirtumas ${dd}.`,
  calcFc: 'LB faile nurodyta fondo 5 metų metinė grąža r; 1 000 × (1 + r)^5. Lyginami tik tos pačios grupės fondai; parodyta grupė, kurioje skirtumas didžiausias. Ankstesnė grąža negarantuoja būsimos.',
  m12H: 'Per 12 mėnesių lyderiai', m12: (m, xs) => `Per 12 mėnesių iki ${m} pabaigos grupių lyderiai: ${xs}.`, c12: 'Vieneto vertė mėnesio pabaigoje ÷ vertė prieš 12 mėnesių − 1, didžiausia kiekvienoje grupėje.',
  msH: 'Mėnesių serija', msP: (n, since, pos) => `II pakopos fondų vidutinė mėnesio grąža ${pos ? 'teigiama' : 'neigiama'} jau ${n} ${ltN(n, 'mėnesį', 'mėnesius', 'mėnesių')} iš eilės – nuo ${since}.`,
  ms1: (m, pos, n) => `${m} II pakopos fondų vidutinė grąža buvo ${pos ? 'teigiama' : 'neigiama'} po ${n} ${ltN(n, 'mėnesio', 'mėnesių', 'mėnesių')} ${pos ? 'neigiamos' : 'teigiamos'} grąžos iš eilės.`,
  msL: y => ` Tai ilgiausia tokia serija nuo ${y} m.`, cMs: 'II pakopos svertinė mėnesio grąža (lapas „Rinka pagal mėnesius“); mėnesiai iš eilės su tuo pačiu ženklu.',
  risky: 'rizikingo turto dalis, %', std: 'standartinis nuokrypis 3 m., %', bar: 'BAR, %', grp: 'Grupė', min: 'pigiausias', max: 'brangiausias', qr: 'ketvirčio grąža, %', n: 'Ketvirčių iš eilės', nm: 'Mėnesių iš eilės', lg: 'Ilgiausia serija duomenyse', pt: 'Dalyviai', ago: 'prieš metus', chg: 'Pokytis', e: '1 000 € virto, €', diff: 'Skirtumas, €', best: 'geriausias', worst: 'silpniausias',
  feeH: 'Mokesčiai eurais', fee: (pl, v, b, p) => `Vidutinis ${pl} pakopos dalyvis per metus sumoka apie ${v} mokesčių (svertinis BAR ${b} × vidutinės santaupos ${p}).`, calcFee: 'Pagal turtą svertinis vidutinis BAR × grynieji aktyvai vienam dalyviui. Įvertis: tikroji suma priklauso nuo fondo ir santaupų; mokesčiai jau išskaičiuoti iš vieneto verčių.', per: 'Turtas vienam dalyviui, €', fy: 'Mokesčiai per metus, €',
  wR: 'rizikingo turto dalis strategijoje', wS: '3 metų grąžos standartinis nuokrypis', wF: 'BAR (bendrasis atskaitymų rodiklis)', wP: 'dalyvių skaičius', gW: 'grupių' } });
/* svertinis pagal turtą rodiklio vidurkis tarp fondų (fl – fondo atranka) */
const wAvgAt = (pl, di, k, fl = () => true) => { const rs = rowsAt(pl, di).filter(r => fl(r) && r[MC[k]] != null && r[MC.nav] > 0), s = rs.reduce((a, r) => a + r[MC.nav], 0); return s ? rs.reduce((a, r) => a + r[MC.nav] * r[MC[k]], 0) / s : null; };
const grpOf = (pl, r) => groupLbl(pl, fundOf(pl, r)[2]);
const GCOL = ['var(--s1)', 'var(--s6)', 'var(--s5)', 'var(--s4)', 'var(--s3)', 'var(--s2)', '#9aa5b1', '#c0392b', '#7f8c8d'];
/* tyrimo modelis grupėms (lvl su grupėmis vietoj valdytojų) */
const grpSpec = (pl, u, w, lab, vfn, ms) => ({ k: 'lvl', pl, u, dy: 5, cagr: false, wm: w, lab, w1: g => `${g}: ${w}`, ms,
  mlist: di => groupsAt(pl, di).map(gi => groupLbl(pl, gi)), mcol: g => GCOL[Math.max(0, groupsAt(pl, atIdx(pl, MS.d)).map(gi => groupLbl(pl, gi)).indexOf(g)) % GCOL.length], mfn: (g, di) => vfn(di, r => grpOf(pl, r) === g) });
function mkFacts() {
  const t = T(), F = t.f, X = t.fx, I = t.ind, L = lang === 'lt', pl = MS.pl, di = dIdx(pl, MS.d), d = MS.d, dq = dIdx(pl, qBack(d, 3)), dy = dIdx(pl, qBack(d, 12));
  const T0 = totals(pl, di), Tq = totals(pl, dq), Ty = totals(pl, dy), A = avgOf(pl, di, -1), ALL = L ? 'Visi fondai' : 'All funds';
  const Ln = t.dLong(d), qn = t.qn(d), src = t.srcLB(pl, d), out = [], { d0, dq: Q, dy: Y } = MKD, now = ` · ${t.thNow.toLowerCase()}`;
  const add = (h, text, calc, nb, o = {}) => out.push({ h, text: text.replace(/\.\.$/, '.'), calc, src, nums: nb.a, ...o });
  { const nb = NB(), i = nb.add(I.nav + now, T0.nav, () => fxNav(d0), Zm);
    if (Tq.ok && Tq.nav) nbCmp(nb, i, I.nav, Tq.nav, () => fxNav(Q), Zm, 1);
    if (Ty.ok && Ty.nav) nbCmp(nb, i, I.nav, Ty.nav, () => fxNav(Y), Zm, 2);
    add(F.navH, F.nav(pl, Ln, mMn(T0.nav), Tq.ok && Tq.nav ? [T0.nav - Tq.nav, (T0.nav / Tq.nav - 1) * 100] : null, Ty.ok && Ty.nav ? [T0.nav - Ty.nav, (T0.nav / Ty.nav - 1) * 100] : null), F.calcNav, nb); }
  { const nb = NB(), i = nb.add(I.part + now, T0.part, () => fxPart(d0), Zi);
    if (Tq.ok && Tq.part) nbCmp(nb, i, I.part, Tq.part, () => fxPart(Q), Zi, 1);
    if (Ty.ok && Ty.part) nbCmp(nb, i, I.part, Ty.part, () => fxPart(Y), Zi, 2);
    add(F.partH, (pl === 'III' ? F.part3 : F.part)(pl, Ln, T0.part, Tq.ok && Tq.part ? [T0.part - Tq.part, (T0.part / Tq.part - 1) * 100] : null, Ty.ok && Ty.part ? [T0.part - Ty.part, (T0.part / Ty.part - 1) * 100] : null), F.calcPart, nb); }
  const q1 = d.slice(5, 7) === '03', qr = qRet(pl, di);
  if (A && A[MA.ret_ytd] != null) {
    const nb = NB(); nb.add(I.ytd, A[MA.ret_ytd], () => fxAvg('C', d0, ALL), Zp);
    if (!q1 && qr != null) nb.add(I.qret, qr, () => fxQret(d0), Zp);
    if (A[MA.ret_1y] != null) nb.add(I.r1, A[MA.ret_1y], () => fxAvg('D', d0, ALL), Zp);
    add(F.retH, F.ret(pl, qn, pctPlain(A[MA.ret_ytd]), !q1 && qr != null ? pctPlain(qr) : '', A[MA.ret_1y] != null ? pctPlain(A[MA.ret_1y]) : ''), F.calcRet, nb);
  }
  const g = gainAt(pl, di), gy = gainYtd(pl, di);
  if (g != null) {
    const nb = NB(); nb.add(I.gain, g, () => fxGain(d0), Zm); if (!q1 && gy != null) nb.add(I.gainY, gy, () => fxGainY(d0), Zm);
    add(F.gainH, F.gain1(pl, qn, g, !q1 && gy != null ? gy : null), F.calcGain, nb);
    if (Tq.ok && Tq.nav) {
      const nb2 = NB(), a = nb2.add(I.nav + now, T0.nav, () => fxNav(d0), Zm), b = nb2.add(`${I.nav} · ${t.thPrevQ.toLowerCase()}`, Tq.nav, () => fxNav(Q), Zm);
      const c0 = nb2.add(t.thDq, T0.nav - Tq.nav, c => `${c(a)}-${c(b)}`, Zm), gi = nb2.add(I.gain, g, () => fxGain(d0), Zm);
      nb2.add(L ? 'Įmokų ir išmokų balansas, mln. € (apyt.)' : 'Contributions minus payouts, € m (est.)', T0.nav - Tq.nav - g, c => `${c(c0)}-${c(gi)}`, Zm);
      add(X.flowH, X.flow(T0.nav - Tq.nav, g, T0.nav - Tq.nav - g, pl), `${X.calcFlow} ${F.calcGain}`, nb2);
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
    add(F.lcH, F.lc(pctPlain(lc[0].a[MA.ret_ytd]), groupLbl(pl, lc[0].gi), pctPlain(lc[lc.length - 1].a[MA.ret_ytd]), groupLbl(pl, lc[lc.length - 1].gi)), F.calcLc, nb);
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
      add(X.concH, X.conc(wList(srt.slice(0, 3).map(x => x[0])), pctPlain(s3, 1), mInt(hhi)), X.calcConc, nb);
    }
    const ch = ms.filter(([m]) => Mq[m]).map(([m, x]) => [m, x.part - Mq[m].part]).sort((x, y) => y[1] - x[1]);
    if (ch.length > 1) {
      const nb = NB(), pair = ([m, v]) => { const i = nb.add(`${m} · ${I.part}${now}`, M[m].part, () => fxPart(d0, crM(m)), Zi), j = nb.add(`${m} · ${I.part} · ${t.thPrevQ.toLowerCase()}`, Mq[m].part, () => fxPart(Q, crM(m)), Zi); nb.add(`${m} · ${t.thDq}`, v, c => `${c(i)}-${c(j)}`, Zi); };
      pair(ch[0]); pair(ch[ch.length - 1]);
      add(F.chgH, F.chg(ch[0][0], ch[0][1], ch[ch.length - 1][0], ch[ch.length - 1][1]), F.calcChg, nb);
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
      add(X.grH, X.gr(mMn(T5.nav), mMn(T0.nav), T0.nav / T5.nav, pA(cg * 100), T0.nav >= T5.nav), X.calcGr, nb); } }
  const other = pl === 'II' ? 'III' : 'II', od = dIdx(other, d);
  if (od >= 0) { const o = totals(other, od); if (o.nav) {
    const OD = `'LB duomenys (${other})'`, nb = NB(), oS = (col) => `SUMIFS(${OD}!${col}:${col},${OD}!A:A,${d0})`;
    const a = nb.add(`${pl} · ${I.nav}`, T0.nav, () => fxNav(d0), Zm), b = nb.add(`${other} · ${I.nav}`, o.nav, () => oS('F'), Zm); nb.add(`${X.tot} · ${I.nav}`, T0.nav + o.nav, c => `${c(a)}+${c(b)}`, Zm);
    const p = nb.add(`${pl} · ${I.part}`, T0.part, () => fxPart(d0), Zi), q = nb.add(`${other} · ${I.part}`, o.part, () => oS('E'), Zi); nb.add(`${X.tot} · ${I.part}`, T0.part + o.part, c => `${c(p)}+${c(q)}`, Zi);
    add(F.bothH, F.both(Ln, mMn(T0.nav + o.nav), T0.part + o.part), F.calcNav, nb, { other }); } }
  // naujos temos: akcijų dalis, svyravimai, mokesčiai, grąžų serija, dalyviai pagal grupes
  { const N = t.nf, rg = (cc, X2) => `${MKX.D}!${cc}3:${cc}${X2.n}`, fxW = (col, gl) => (c, X2) => { const g = gl ? `*(${rg('D', X2)}=${xq(gl)})` : '';
      return `SUMPRODUCT((${rg('A', X2)}=${d0})${g}*(${rg(col, X2)}<>"")*(${rg('F', X2)}>0)*${rg('F', X2)}*${rg(col, X2)})/SUMPRODUCT((${rg('A', X2)}=${d0})${g}*(${rg(col, X2)}<>"")*(${rg('F', X2)}>0)*${rg('F', X2)})`; };
    const byG = k => groupsAt(pl, di).map(gi => ({ gi, gl: groupLbl(pl, gi), v: wAvgAt(pl, di, k, r => fundOf(pl, r)[2] === gi) })).filter(x => x.v != null).sort((a, b) => b.v - a.v);
    [['risky', 'R', N.rkH, N.rk, N.calcRk, N.risky, N.wR, 'risk'], ['std_3y', 'U', N.sdH, N.sd, N.calcSd, N.std, N.wS, 'risk']].forEach(([k, col, h, tx, calc, lbl, w, tp]) => {
      const gs = byG(k); if (gs.length < 2) return; const hi = gs[0], lo = gs[gs.length - 1], nb = NB();
      nb.add(`${hi.gl} · ${lbl}`, hi.v, fxW(col, hi.gl), Zp); nb.add(`${lo.gl} · ${lbl}`, lo.v, fxW(col, lo.gl), Zp);
      add(h, tx(hi.gl, pctPlain(hi.v), lo.gl, pctPlain(lo.v)), calc, nb, { tp, ex: () => grpSpec(pl, 'pct', w, h, (j, fl) => wAvgAt(pl, j, k, fl), [hi.gl, lo.gl]) }); });
    const av = wAvgAt(pl, di, 'bar');
    if (av != null) { const nb = NB(); nb.add(`${X.tot} · ${N.bar}`, av, fxW('V'), Zp);
      const sp = groupsAt(pl, di).map(gi => { const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC.bar] != null).sort((a, b) => a[MC.bar] - b[MC.bar]); return rs.length > 1 ? { gi, gl: groupLbl(pl, gi), a: rs[0], b: rs[rs.length - 1] } : null; })
        .filter(Boolean).sort((x, y) => (y.b[MC.bar] - y.a[MC.bar]) - (x.b[MC.bar] - x.a[MC.bar]))[0];
      if (sp) { const cg = crG(pl, sp.gi); nb.add(`${sp.gl} · ${N.min}: ${fundOf(pl, sp.a)[0]}`, sp.a[MC.bar], () => `_xlfn.MINIFS(${MKX.D}!V:V,${byD(d0)},${cg})`, Zp); nb.add(`${sp.gl} · ${N.max}: ${fundOf(pl, sp.b)[0]}`, sp.b[MC.bar], () => `_xlfn.MAXIFS(${MKX.D}!V:V,${byD(d0)},${cg})`, Zp); }
      add(N.feH, N.fe(pl, pctPlain(av), sp ? sp.gl : '', sp ? fundOf(pl, sp.a)[0] : '', sp ? pctPlain(sp.a[MC.bar]) : '', sp ? fundOf(pl, sp.b)[0] : '', sp ? pctPlain(sp.b[MC.bar]) : ''), N.calcFe, nb,
        { tp: 'fee', ex: () => ({ k: 'lvl', pl, u: 'pct', dy: 5, cagr: false, w: N.wF, wm: N.wF, w1: m => `${m}: ${N.wF}`, lab: N.feH, fn: j => wAvgAt(pl, j, 'bar'), mfn: (m, j) => wAvgAt(pl, j, 'bar', r => fundOf(pl, r)[0] === m) }) }); }
    // grąžų serija (ketvirčiai iš eilės su tuo pačiu ženklu)
    { const qs = []; for (let i = 0; i <= di; i++) { const v = qRet(pl, i); if (v != null) qs.push({ i, v }); }
      if (qs.length > 4) { const sg = x => x.v > 0 ? 1 : -1, lastS = sg(qs[qs.length - 1]); let n = 0; while (n < qs.length && sg(qs[qs.length - 1 - n]) === lastS) n++;
        let pn = 0; while (n + pn < qs.length && sg(qs[qs.length - 1 - n - pn]) === -lastS) pn++;
        let best = 0, cur = 0; qs.forEach((x, j) => { cur = j && sg(x) === sg(qs[j - 1]) ? cur + 1 : 1; if (sg(x) === lastS && j < qs.length - n) best = Math.max(best, cur); });
        const nb = NB(), show = qs.slice(-Math.min(qs.length, n + (n === 1 ? pn : 1))), ix = show.map(x => { const dd = MKT[pl].dates[x.i]; return nb.add(`${t.dq(dd)} · ${N.qr}`, x.v, () => fxQret(`DATE(${dd.slice(0, 4)},${+dd.slice(5, 7)},${+dd.slice(8)})`), Zp); });
        const sel = ix.slice(-n), crit = lastS > 0 ? '">0"' : '"<0"'; nb.add(N.n, n, c => `COUNTIF(${c(sel[0])}:${c(sel[sel.length - 1])},${crit})`, '0');
        const y0 = MKT[pl].dates[qs[0].i].slice(0, 4), longest = n > 1 && n > best;
        const text = n === 1 && pn ? N.sk1(pl, t.qn(d), lastS > 0, pn) : N.skP(pl, n, MKT[pl].dates[qs[qs.length - n].i], lastS > 0) + (longest ? N.skL(y0) : '');
        add(N.skH, text, N.calcSk, nb, { tp: 'ret', hot: n === 1 && pn >= 3 ? { s: 2.5, l: t.fu.flip } : longest && n >= 3 ? { s: 2, l: t.fu.hi(y0).replace(/^\S+/, L ? 'Ilgiausia' : 'Longest') } : null, ex: () => ({ k: 'real', pl, cmp: null, dy: 3 }) }); } }
    // dalyviai pagal grupes
    { const pg = k => groupsAt(pl, k).map(gi => ({ gi, gl: groupLbl(pl, gi), v: rowsAt(pl, k).filter(r => fundOf(pl, r)[2] === gi).reduce((s, r) => s + (r[MC.part] || 0), 0) }));
      const now = pg(di).filter(x => x.v > 0).sort((a, b) => b.v - a.v), ago = dy >= 0 ? pg(dy) : [], ch = now.map(x => { const p = ago.find(y => y.gi === x.gi); return p && p.v ? { ...x, p: p.v, r: (x.v / p.v - 1) * 100 } : null; }).filter(Boolean).sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
      if (now.length > 1 && ch.length && T0.part) { const nb = NB(), a = now[0], b = ch[0];
        const i1 = nb.add(`${a.gl} · ${N.pt}`, a.v, () => fxPart(d0, crG(pl, a.gi)), Zi), i2 = nb.add(`${X.tot} · ${N.pt}`, T0.part, () => fxPart(d0), Zi); nb.add(`${a.gl} · ${t.shOf.part}`, a.v / T0.part, c => `${c(i1)}/${c(i2)}`, Zr);
        const j1 = nb.add(`${b.gl} · ${N.pt}`, b.v, () => fxPart(d0, crG(pl, b.gi)), Zi), j2 = nb.add(`${b.gl} · ${N.pt} · ${N.ago}`, b.p, () => fxPart(Y, crG(pl, b.gi)), Zi); nb.add(`${b.gl} · ${N.chg}, %`, b.r / 100, c => `${c(j1)}/${c(j2)}-1`, Zr);
        add(N.pgH, N.pg(a.gl, mInt(a.v), pctPlain(a.v / T0.part * 100), b.gl, b.r > 0, pA(b.r)), N.calcPg, nb,
          { tp: 'part', ex: () => grpSpec(pl, 'int', N.wP, N.pgH, (j, fl) => { const rs = rowsAt(pl, j).filter(fl); return rs.length ? rs.reduce((s, r) => s + (r[MC.part] || 0), 0) : null; }, [a.gl, b.gl].filter((x, i, z) => z.indexOf(x) === i)) }); } }
  }
  if (MS.mgr && M[MS.mgr]) out.unshift(...[...mgrFacts(pl, di, MS.mgr), strengthFact(pl, di, MS.mgr)].filter(Boolean));
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
    add(F.m1(m, pl, mMn(x.nav), mShare(x.nav, T0.nav), x.part, mShare(x.part, T0.part)), F.calcMgr, nb); }
  // rinkos dalies kryptis
  { const share = k => { const Mk = byMgr(pl, k), Tk = totals(pl, k); return Mk[m] && Tk.nav ? Mk[m].nav / Tk.nav * 100 : null; };
    const s0 = share(di), sy = dy >= 0 ? share(dy) : null, s3 = d3 >= 0 ? share(d3) : null;
    if (sy != null) { const nb = NB();
      const blk = (lbl, k, R) => { const Mk = byMgr(pl, k)[m], Tk = totals(pl, k), a = nb.add(`${m} · ${I.nav} · ${lbl}`, Mk.nav, () => fxNav(R, cm), Zm), b = nb.add(`${I.nav} · ${X.shTot} · ${lbl}`, Tk.nav, () => fxNav(R), Zm);
        return nb.add(`${m} · ${t.shOf.nav}, % · ${lbl}`, Mk.nav / Tk.nav * 100, c => `${c(a)}/${c(b)}*100`, Zp); };
      const i0 = blk(t.thNow.toLowerCase(), di, d0), iy = blk(t.thPrevY.toLowerCase(), dy, Y);
      nb.add(`${t.thDy}, ${L ? 'p. p.' : 'pp'}`, s0 - sy, c => `${c(i0)}-${c(iy)}`, Zp);
      if (s3 != null) { const i3 = blk(L ? 'prieš 3 metus' : '3 years ago', d3, fxBack(36)); nb.add(`${L ? 'Pokytis per 3 metus' : 'Change in 3 years'}, ${L ? 'p. p.' : 'pp'}`, s0 - s3, c => `${c(i0)}-${c(i3)}`, Zp); }
      add(X.m5(m, pctPlain(s0, 1), s0 - sy, s3 != null ? s0 - s3 : null), X.calcM5, nb); } }
  // dalyvių pokytis prieš visą pakopą
  { const Mq = byMgr(pl, dq)[m], My = byMgr(pl, dy)[m], Tq = totals(pl, dq), Ty = totals(pl, dy);
    if (Mq && My && Tq.part && Ty.part) {
      const nb = NB(), a = nb.add(`${m} · ${I.part}${now}`, x.part, () => fxPart(d0, cm), Zi);
      nbCmp(nb, a, `${m} · ${I.part}`, Mq.part, () => fxPart(Q, cm), Zi, 1); nbCmp(nb, a, `${m} · ${I.part}`, My.part, () => fxPart(Y, cm), Zi, 2);
      const b = nb.add(`${X.shTot} · ${I.part}${now}`, T0.part, () => fxPart(d0), Zi);
      nbCmp(nb, b, `${X.shTot} · ${I.part}`, Tq.part, () => fxPart(Q), Zi, 1); nbCmp(nb, b, `${X.shTot} · ${I.part}`, Ty.part, () => fxPart(Y), Zi, 2);
      add(X.m2(m, x.part - Mq.part, (x.part / Mq.part - 1) * 100, (T0.part / Tq.part - 1) * 100, x.part - My.part, (x.part / My.part - 1) * 100, (T0.part / Ty.part - 1) * 100), F.calcChg, nb); } }
  // investicinis prieaugis
  { const g = gainAt(pl, di, m), G = gainAt(pl, di);
    if (g != null) { const nb = NB(), a = nb.add(`${m} · ${I.gain}`, g, () => fxGain(d0, cm), Zm), b = nb.add(`${X.shTot} · ${I.gain}`, G, () => fxGain(d0), Zm), ok = G > 0 && g > 0;
      if (ok) nb.add(L ? 'Dalis' : 'Share', g / G, c => `${c(a)}/${c(b)}`, Zr);
      add(X.m6(m, g, ok ? pctPlain(g / G * 100, 1) : ''), F.calcGain, nb); } }
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
      add(F.m4(m, best.pos, best.of, gl), X.calcM4, nb); } }
  return out;
}
function renderFacts() {
  const t = T(), fs = mkFacts();
  factCards(document.getElementById('qfCards'), fs, t.qfTitle, MS.pl);
  document.getElementById('qfAll').textContent = t.copyAll;
  document.getElementById('qfXl').textContent = t.fx.xlAll;
  const rb = document.getElementById('qfRev'); if (rb) { rb.textContent = t.rv.btn; rb.title = t.rv.btnT; }
  renderKeyTable();
}
function renderMgrCards() {
  const t = T(), X = t.fx, pl = MS.pl, di = dIdx(pl, MS.d), el = document.getElementById('miCards'); if (!el) return;
  document.getElementById('miTitle').textContent = X.miTitle; document.getElementById('miLead').textContent = X.miLead; document.getElementById('miXl').textContent = X.xlAll;
  const ms = Object.entries(byMgr(pl, di)).sort((a, b) => b[1].nav - a[1].nav).map(([m]) => m);
  mgrCards(el, Object.fromEntries(ms.map(m => [m, [...mgrFacts(pl, di, m), strengthFact(pl, di, m)].filter(Boolean)])), X.miTitle, pl);
}
/* „Kuo gali pasigirti“ (savininkas 2026-10-20: marketingui – paprasti, šiuo metu galiojantys faktai, kur valdytojas geriausias).
   Tik pirmos vietos rinkoje arba grupėje; fondai lyginami tik savo grupėje, grupės su mažiau nei 3 fondais neįtraukiamos. */
addStrings({ br: {
  title: 'What each manager can boast about', lead: 'Simple facts that are true right now, where a manager is first in the market or in a group – for advertising and the press. Funds are compared only within their group; groups with fewer than 3 funds are left out. “Excel” – every figure as a formula from the Bank of Lithuania data.',
  none: ms => `No first places at the moment: ${ms}.`,
  per: { ret_5y: 'over 5 years', ret_3y: 'over 3 years', ret_1y: 'over 12 months', ret_ytd: 'since the start of the year' }, ann: ' a year',
  best: (m, per, gs, k) => `${m}’s fund earned the highest return ${per} in its group${k > 1 ? 's' : ''}: ${gs}.`,
  bestN: (m, per, k, n, gs, r) => `${m}’s funds earned the highest return ${per} in ${k} of ${n} groups: ${gs} (${r}).`,
  gOne: (g, v, n) => `“${g}” (${v}; of ${n} funds)`,
  stab: (m, g, s, r, a) => `The steadiest growth in the “${g}” group: ${m}’s fund value fluctuated least over 3 years (standard deviation ${s}), while its return (${r} a year) beat the group average (${a}).`,
  share: (m, pl, x, y) => `Over the year ${m} gained the most market share in pillar ${pl}: +${x} pp, to ${y} of assets.`,
  big: (m, pl, a, p) => `${m} is the largest pillar ${pl} manager: ${a} of assets and ${p} of participants.`,
  bigN: (m, pl, a) => `${m} manages the largest share of pillar ${pl} assets – ${a}.`, bigP: (m, pl, p) => `${m} has the most pillar ${pl} participants – ${p} of all.`,
  grow: (m, pl, n, k) => `Over the year the number of ${m} pillar ${pl} participants grew the most of all managers: +${n} (${k}).`,
  fee: (m, gs, k) => `${m}’s fund charges the lowest fees in its group${k > 1 ? 's' : ''}: ${gs}.`, feeN: (m, k, n, gs, v, hi) => `${m} charges the lowest fees in ${k} of ${n} groups: ${gs} (BAR ${v}; other funds up to ${hi}).`, gN: g => `“${g}”`, fOne: (g, v, hi) => `“${g}” (BAR ${v}; others up to ${hi})`,
  all: (m, n) => `${n === 2 ? 'Both' : `All ${n}`} ${m} funds have beaten their group average since the start of the year.`,
  calcBest: 'Bank of Lithuania returns of the funds in the same group on the selected date; 3- and 5-year returns are annual. Groups with fewer than 3 funds are not counted.',
  calcStab: 'Standard deviation of the 3-year return (Bank of Lithuania file): the lowest in the group, and the 3-year return above the Bank of Lithuania weighted group average.',
  calcShare: 'Manager share of pillar net assets now and a year ago (Bank of Lithuania data).', calcBig: 'Manager share of pillar net assets and participants (Bank of Lithuania data).',
  calcGrow: 'Change in the number of the manager’s participants over 4 quarters (Bank of Lithuania data); the largest increase among managers.',
  calcFee: 'BAR – total deduction ratio, % of assets a year (Bank of Lithuania results file); the lowest in the group of at least 3 funds with BAR.',
  calcAll: 'Return since the start of the year of each manager fund compared with the Bank of Lithuania weighted average of its group.',
  mine: 'manager fund', top: 'best in group', min: 'lowest in group', max: 'highest in group', n: 'funds in group', avg: 'group average', first: 'First (1 = yes)', chg: 'Change, pp', yes: 'Funds above average', tot: 'Funds'
} }, { br: {
  title: 'Kuo gali pasigirti valdytojai', lead: 'Paprasti, šiuo metu galiojantys faktai, kuriuose valdytojas – pirmas rinkoje arba savo grupėje: reklamai ir žiniasklaidai. Fondai lyginami tik savo grupėje; grupės, kuriose mažiau nei 3 fondai, neįtraukiamos. „Excel“ – kiekvienas skaičius kaip formulė iš LB duomenų.',
  none: ms => `Pirmų vietų šiuo metu neturi: ${ms}.`,
  per: { ret_5y: 'per 5 metus', ret_3y: 'per 3 metus', ret_1y: 'per 12 mėnesių', ret_ytd: 'nuo metų pradžios' }, ann: ' per metus',
  best: (m, per, gs, k) => `${m} fondas ${per} uždirbo didžiausią grąžą ${k > 1 ? 'grupėse' : 'grupėje'} ${gs}.`,
  bestN: (m, per, k, n, gs, r) => `${m} fondai ${per} uždirbo didžiausią grąžą ${k} iš ${n} grupių: ${gs} (${r}).`,
  gOne: (g, v, n) => `„${g}“ (${v}; iš ${n} fondų)`,
  stab: (m, g, s, r, a) => `Stabiliausias augimas grupėje „${g}“: ${m} fondo vertė per 3 metus svyravo mažiausiai (standartinis nuokrypis ${s}), o grąža (${r} per metus) viršijo grupės vidurkį (${a}).`,
  share: (m, pl, x, y) => `Per metus ${m} labiausiai padidino rinkos dalį ${pl} pakopoje: +${x} p. p., iki ${y} turto.`,
  big: (m, pl, a, p) => `${m} – didžiausias ${pl} pakopos valdytojas: ${a} turto ir ${p} dalyvių.`,
  bigN: (m, pl, a) => `${m} valdo didžiausią ${pl} pakopos turto dalį – ${a}.`, bigP: (m, pl, p) => `${m} turi daugiausiai ${pl} pakopos dalyvių – ${p} visų.`,
  grow: (m, pl, n, k) => `Per metus ${m} ${pl} pakopos dalyvių skaičius išaugo labiausiai iš visų valdytojų: +${n} (${k}).`,
  fee: (m, gs, k) => `Mažiausius mokesčius ${k > 1 ? 'grupėse' : 'grupėje'} ${gs} taiko ${m} fondas.`, feeN: (m, k, n, gs, v, hi) => `${m} taiko mažiausius mokesčius ${k} iš ${n} grupių: ${gs} (BAR ${v}; kitų fondų – iki ${hi}).`, gN: g => `„${g}“`, fOne: (g, v, hi) => `„${g}“ (BAR ${v}; kitų – iki ${hi})`,
  all: (m, n) => `${n === 2 ? 'Abu' : `Visi ${n}`} ${m} fondai nuo metų pradžios uždirbo daugiau nei jų grupių vidurkis.`,
  calcBest: 'LB nurodytos tos pačios grupės fondų grąžos pasirinktą dieną; 3 ir 5 metų grąžos – metinės. Grupės, kuriose mažiau nei 3 fondai, neskaičiuojamos.',
  calcStab: 'LB faile nurodytas 3 metų grąžos standartinis nuokrypis: mažiausias grupėje, o 3 metų grąža didesnė už LB svertinį grupės vidurkį.',
  calcShare: 'Valdytojo dalis pakopos grynuosiuose aktyvuose dabar ir prieš metus (LB duomenys).', calcBig: 'Valdytojo dalis pakopos grynuosiuose aktyvuose ir dalyvių skaičiuje (LB duomenys).',
  calcGrow: 'Valdytojo dalyvių skaičiaus pokytis per 4 ketvirčius (LB duomenys); didžiausias padidėjimas tarp valdytojų.',
  calcFee: 'BAR – bendrasis atskaitymų rodiklis, % nuo turto per metus (LB rezultatų ataskaita); mažiausias grupėje, kurioje bent 3 fondai su BAR.',
  calcAll: 'Kiekvieno valdytojo fondo grąža nuo metų pradžios palyginta su jo grupės LB svertiniu vidurkiu.',
  mine: 'valdytojo fondas', top: 'geriausias grupėje', min: 'mažiausias grupėje', max: 'didžiausias grupėje', n: 'fondų grupėje', avg: 'grupės vidurkis', first: 'Pirmas (1 = taip)', chg: 'Pokytis, p. p.', yes: 'Fondai virš vidurkio', tot: 'Fondai'
} });
const BRC = { ret_5y: 'O', ret_3y: 'N', ret_1y: 'M', ret_ytd: 'G' };
function bragFacts(pl, di) {
  const t = T(), B = t.br, I = t.ind, X = t.fx, L = lang === 'lt', d = MKT[pl].dates[di], src = t.srcLB(pl, d), { d0, dy: Y } = MKD, out = {}, dy = dIdx(pl, qBack(d, 12));
  const M = byMgr(pl, di), T0 = totals(pl, di), ms = Object.keys(M);
  const add = (m, rank, text, calc, nb) => (out[m] = out[m] || []).push({ h: m, text, calc, src, hl: true, nums: nb.a, rank });
  const grs = k => groupsAt(pl, di).map(gi => ({ gi, gl: groupLbl(pl, gi), cg: crG(pl, gi), rs: rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC[k]] != null) })).filter(g => g.rs.length >= 3);
  const q = g => L ? g : g;
  // 1. didžiausias valdytojas (turtas ir (ar) dalyviai)
  { const tn = ms.reduce((a, b) => M[b].nav > M[a].nav ? b : a), tp = ms.reduce((a, b) => M[b].part > M[a].part ? b : a);
    [...new Set([tn, tp])].forEach(m => { const nb = NB(), cm = crM(m);
      const a = nb.add(`${m} · ${I.nav}`, M[m].nav, () => fxNav(d0, cm), Zm), b = nb.add(`${X.shTot} · ${I.nav}`, T0.nav, () => fxNav(d0), Zm); nb.add(`${m} · ${t.shOf.nav}`, M[m].nav / T0.nav, c => `${c(a)}/${c(b)}`, Zr);
      const p = nb.add(`${m} · ${I.part}`, M[m].part, () => fxPart(d0, cm), Zi), r = nb.add(`${X.shTot} · ${I.part}`, T0.part, () => fxPart(d0), Zi); nb.add(`${m} · ${t.shOf.part}`, M[m].part / T0.part, c => `${c(p)}/${c(r)}`, Zr);
      const sa = mShare(M[m].nav, T0.nav), sp = mShare(M[m].part, T0.part);
      add(m, 1, m === tn && m === tp ? B.big(m, pl, sa, sp) : m === tn ? B.bigN(m, pl, sa) : B.bigP(m, pl, sp), B.calcBig, nb); }); }
  // 2. labiausiai padidino rinkos dalį per metus
  if (dy >= 0) { const My = byMgr(pl, dy), Ty = totals(pl, dy), sh = (A, Tt, m) => A[m] && Tt.nav ? A[m].nav / Tt.nav * 100 : null;
    const best = ms.filter(m => sh(My, Ty, m) != null).map(m => ({ m, g: sh(M, T0, m) - sh(My, Ty, m) })).sort((a, b) => b.g - a.g)[0];
    if (best && best.g > 0) { const m = best.m, nb = NB(), cm = crM(m);
      const blk = (lbl, A, Tt, R) => { const a = nb.add(`${m} · ${I.nav} · ${lbl}`, A[m].nav, () => fxNav(R, cm), Zm), b = nb.add(`${X.shTot} · ${I.nav} · ${lbl}`, Tt.nav, () => fxNav(R), Zm); return nb.add(`${m} · ${t.shOf.nav}, % · ${lbl}`, A[m].nav / Tt.nav * 100, c => `${c(a)}/${c(b)}*100`, Zp); };
      const i0 = blk(t.thNow.toLowerCase(), M, T0, d0), iy = blk(t.thPrevY.toLowerCase(), My, Ty, Y); nb.add(B.chg, best.g, c => `${c(i0)}-${c(iy)}`, Zp);
      add(m, 2, B.share(m, pl, num(best.g, 2), pctPlain(sh(M, T0, m), 1)), B.calcShare, nb); }
    // 3. labiausiai išaugęs dalyvių skaičius
    const gp = ms.filter(m => My[m] && My[m].part).map(m => ({ m, n: M[m].part - My[m].part })).sort((a, b) => b.n - a.n)[0];
    if (gp && gp.n > 0) { const m = gp.m, nb = NB(), cm = crM(m), a = nb.add(`${m} · ${I.part} · ${t.thNow.toLowerCase()}`, M[m].part, () => fxPart(d0, cm), Zi), b = nb.add(`${m} · ${I.part} · ${t.thPrevY.toLowerCase()}`, My[m].part, () => fxPart(Y, cm), Zi);
      nb.add(t.thDy, gp.n, c => `${c(a)}-${c(b)}`, Zi); nb.add(`${t.thDy}, %`, (M[m].part / My[m].part - 1) * 100, c => `(${c(a)}/${c(b)}-1)*100`, Zp);
      add(m, 3, B.grow(m, pl, mInt(gp.n), pctPlain((M[m].part / My[m].part - 1) * 100)), B.calcGrow, nb); } }
  // 4. didžiausia grąža grupėje pagal laikotarpį
  ['ret_5y', 'ret_3y', 'ret_1y', 'ret_ytd'].forEach((k, ki) => { const col = BRC[k], by = {};
    grs(k).forEach(g => { const top = g.rs.reduce((a, b) => b[MC[k]] > a[MC[k]] ? b : a), m = fundOf(pl, top)[0]; if (g.rs.some(r => r !== top && r[MC[k]] === top[MC[k]] && fundOf(pl, r)[0] !== m)) return; if (top[MC[k]] > 0) (by[m] = by[m] || []).push({ ...g, v: top[MC[k]] }); });
    const nG = grs(k).length;
    Object.entries(by).forEach(([m, gs]) => { const nb = NB(), cm = crM(m), suf = k === 'ret_5y' || k === 'ret_3y' ? B.ann : '';
      gs.forEach(g => { const i = nb.add(`${g.gl} · ${B.mine} · ${B.per[k]}, %`, g.v, () => `_xlfn.MAXIFS(${MKX.D}!${col}:${col},${byD(d0)},${g.cg},${cm})`, Zp), j = nb.add(`${g.gl} · ${B.top} · ${B.per[k]}, %`, g.v, () => `_xlfn.MAXIFS(${MKX.D}!${col}:${col},${byD(d0)},${g.cg})`, Zp);
        nb.add(`${g.gl} · ${B.n}`, g.rs.length, () => `COUNTIFS(${byD(d0)},${g.cg},${MKX.D}!${col}:${col},"<>")`, '0'); nb.add(`${g.gl} · ${B.first}`, 1, c => `IF(${c(i)}>=${c(j)},1,0)`, '0'); });
      const vs = gs.map(g => g.v), rng = (Math.min(...vs) === Math.max(...vs) ? pctPlain(vs[0]) : `${pctPlain(Math.min(...vs))}–${pctPlain(Math.max(...vs))}`) + suf;
      add(m, 4 + ki, gs.length >= 3 ? B.bestN(m, B.per[k], gs.length, nG, gs.map(g => B.gN(g.gl)).join(', '), rng) : B.best(m, B.per[k], gs.map(g => B.gOne(q(g.gl), pctPlain(g.v) + suf, g.rs.length)).join('; '), gs.length), B.calcBest, nb); }); });
  // 5. stabiliausias augimas: mažiausias 3 m. standartinis nuokrypis, o 3 m. grąža virš grupės vidurkio
  grs('std_3y').forEach(g => { const a = avgOf(pl, di, g.gi); if (!a || a[MA.ret_3y] == null) return;
    const lo = g.rs.reduce((x, y) => y[MC.std_3y] < x[MC.std_3y] ? y : x), m = fundOf(pl, lo)[0]; if (lo[MC.ret_3y] == null || lo[MC.ret_3y] <= a[MA.ret_3y] || g.rs.some(r => r !== lo && r[MC.std_3y] === lo[MC.std_3y])) return;
    const nb = NB(), cm = crM(m), i = nb.add(`${g.gl} · ${B.mine} · ${t.nf.std}`, lo[MC.std_3y], () => `_xlfn.MINIFS(${MKX.D}!U:U,${byD(d0)},${g.cg},${cm})`, Zp), j = nb.add(`${g.gl} · ${B.min} · ${t.nf.std}`, lo[MC.std_3y], () => `_xlfn.MINIFS(${MKX.D}!U:U,${byD(d0)},${g.cg})`, Zp);
    const r = nb.add(`${g.gl} · ${B.mine} · ${B.per.ret_3y}, %`, lo[MC.ret_3y], c => `SUMIFS(${MKX.D}!N:N,${byD(d0)},${g.cg},${cm},${MKX.D}!U:U,${c(i)})`, Zp), v = nb.add(`${g.gl} · ${B.avg} · ${B.per.ret_3y}, %`, a[MA.ret_3y], () => fxAvg('E', d0, g.gl), Zp);
    nb.add(B.first, 1, c => `IF(AND(${c(i)}<=${c(j)},${c(r)}>${c(v)}),1,0)`, '0');
    add(m, 8, B.stab(m, g.gl, pctPlain(lo[MC.std_3y]), pctPlain(lo[MC.ret_3y]), pctPlain(a[MA.ret_3y])), B.calcStab, nb); });
  // 6. mažiausi mokesčiai grupėje
  { const by = {}, nF = grs('bar').length;
    grs('bar').forEach(g => { const lo = g.rs.reduce((x, y) => y[MC.bar] < x[MC.bar] ? y : x), m = fundOf(pl, lo)[0]; if (g.rs.some(r => r !== lo && r[MC.bar] === lo[MC.bar] && fundOf(pl, r)[0] !== m)) return; (by[m] = by[m] || []).push({ ...g, v: lo[MC.bar], hi: Math.max(...g.rs.map(r => r[MC.bar])) }); });
    Object.entries(by).forEach(([m, gs]) => { const nb = NB(), cm = crM(m);
      gs.forEach(g => { const i = nb.add(`${g.gl} · ${B.mine} · ${t.nf.bar}`, g.v, () => `_xlfn.MINIFS(${MKX.D}!V:V,${byD(d0)},${g.cg},${cm})`, Zp), j = nb.add(`${g.gl} · ${B.min} · ${t.nf.bar}`, g.v, () => `_xlfn.MINIFS(${MKX.D}!V:V,${byD(d0)},${g.cg})`, Zp);
        nb.add(`${g.gl} · ${B.max} · ${t.nf.bar}`, g.hi, () => `_xlfn.MAXIFS(${MKX.D}!V:V,${byD(d0)},${g.cg})`, Zp); nb.add(`${g.gl} · ${B.first}`, 1, c => `IF(${c(i)}<=${c(j)},1,0)`, '0'); });
      const lo = Math.min(...gs.map(g => g.v)), hi2 = Math.max(...gs.map(g => g.v)), top = Math.max(...gs.map(g => g.hi));
      add(m, 9, gs.length >= 3 ? B.feeN(m, gs.length, nF, gs.map(g => B.gN(g.gl)).join(', '), lo === hi2 ? pctPlain(lo) : `${pctPlain(lo)}–${pctPlain(hi2)}`, pctPlain(top)) : B.fee(m, gs.map(g => B.fOne(g.gl, pctPlain(g.v), pctPlain(g.hi))).join('; '), gs.length), B.calcFee, nb); }); }
  // 7. visi valdytojo fondai viršijo grupės vidurkį nuo metų pradžios
  ms.forEach(m => { const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[0] === m && r[MC.ret_ytd] != null); if (rs.length < 2) return;
    const ok = rs.every(r => { const a = avgOf(pl, di, fundOf(pl, r)[2]); return a && a[MA.ret_ytd] != null && r[MC.ret_ytd] > a[MA.ret_ytd]; }); if (!ok) return;
    const nb = NB(), cm = crM(m), fl = rs.map(r => { const gi = fundOf(pl, r)[2], gl = groupLbl(pl, gi), cg = crG(pl, gi), nm = fundOf(pl, r)[1];
      const i = nb.add(`${nm} · ${B.per.ret_ytd}, %`, r[MC.ret_ytd], () => `SUMIFS(${MKX.D}!G:G,${byD(d0)},${MKX.D}!C:C,${xq(nm)},${cg})`, Zp), j = nb.add(`${gl} · ${B.avg}, %`, avgOf(pl, di, gi)[MA.ret_ytd], () => fxAvg('C', d0, gl), Zp);
      return nb.add(`${nm} · ${B.first}`, 1, c => `IF(${c(i)}>${c(j)},1,0)`, '0'); });
    nb.add(B.yes, rs.length, c => fl.map(c).join('+'), '0'); nb.add(B.tot, rs.length, () => `COUNTIFS(${byD(d0)},${cm},${MKX.D}!G:G,"<>")`, '0');
    add(m, 10, B.all(m, rs.length), B.calcAll, nb); });
  Object.values(out).forEach(a => a.sort((x, y) => x.rank - y.rank));
  return out;
}
function renderBrag() {
  const t = T(), B = t.br, pl = MS.pl, di = dIdx(pl, MS.d), el = document.getElementById('brCards'); if (!el || di < 0) return;
  document.getElementById('brTitle').textContent = B.title; document.getElementById('brLead').textContent = B.lead; document.getElementById('brXl').textContent = t.fx.xlAll;
  const by = bragFacts(pl, di), ord = Object.entries(byMgr(pl, di)).sort((a, b) => b[1].nav - a[1].nav).map(([m]) => m), has = ord.filter(m => by[m]), no = ord.filter(m => !by[m]);
  mgrCards(el, Object.fromEntries(has.map(m => [m, by[m]])), B.title, pl);
  document.getElementById('brNote').textContent = no.length ? B.none(no.join(', ')) : '';
}
async function mkCopy(text, b) {
  try { await navigator.clipboard.writeText(text); } catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
  const o = b.textContent; b.textContent = '✓ ' + T().copied; setTimeout(() => { b.textContent = o; }, 1500);
}
/* kortelių mygtukai: data-fact / data-fx – vienas faktas; data-mcp / data-mxl – valdytojo kortelė; data-all / data-xall="dėžutės id" – visi */
document.addEventListener('click', async e => {
  const b = e.target.closest('[data-fact], [data-fx], [data-mcp], [data-mxl], [data-all], [data-xall]'); if (!b) return;
  const box = b.dataset.all || b.dataset.xall ? document.getElementById(b.dataset.all || b.dataset.xall) : b.closest('.facts'); if (!box) return;
  const fs = box._facts || [], bm = box._byM || {}, title = box.dataset.title, pl = box.dataset.pl;
  if (b.dataset.fact != null || b.dataset.all) return mkCopy((b.dataset.all ? fs : [fs[+b.dataset.fact]]).map(f => `${f.text} ${f.src}`).join('\n\n'), b);
  if (b.dataset.mcp) { const f = bm[b.dataset.mcp] || []; return mkCopy(f.map(x => x.text).join(' ') + (f[0] ? ' ' + f[0].src : ''), b); }
  const pick = b.dataset.xall ? fs : b.dataset.fx != null ? [fs[+b.dataset.fx]] : bm[b.dataset.mxl] || [];
  const ttl = b.dataset.fx != null ? `${title} · ${pick[0].h}` : b.dataset.mxl ? `${title} · ${b.dataset.mxl}` : title;
  const o = b.textContent; b.disabled = true; b.textContent = '…';
  try { await (pick[0] && pick[0].book ? pick[0].book(pick, ttl) : mkFactBook(pick, ttl, pl)); b.textContent = '✓'; } catch (err) { console.error(err); b.textContent = '!'; }
  setTimeout(() => { b.textContent = o; b.disabled = false; }, 1500);
});
function keyData(pl, d) {                   // pagrindinių rodiklių lentelė (svetainėje ir ketvirčio apžvalgoje)
  const t = T(), I = t.ind, ds = [d, qBack(d, 3), qBack(d, 12)].map(x => dIdx(pl, x));
  const vals = ds.map(di => { if (di < 0) return null; const T0 = totals(pl, di), A = avgOf(pl, di, -1), m = MKT[pl].dates[di].slice(5, 7);
    return { part: T0.part, nav: T0.nav, per: pl === 'II' && T0.part ? T0.nav * 1e6 / T0.part : null, ytd: A ? A[MA.ret_ytd] : null, r1: A ? A[MA.ret_1y] : null, qret: qRet(pl, di), gain: gainAt(pl, di), gainY: m === '03' ? null : gainYtd(pl, di), nf: T0.nf }; });
  const fm = { part: mInt, nav: v => num(v, 1), per: mInt, ytd: v => pct(v), r1: v => pct(v), qret: v => pct(v), gain: v => num(v, 1), gainY: v => num(v, 1), nf: mInt };
  const dv = (k, a, b) => a == null || b == null ? '–' : ['ytd', 'r1', 'qret'].includes(k) ? `${(a - b >= 0 ? '+' : '−') + num(Math.abs(a - b), 2)} ${lang === 'lt' ? 'p. p.' : 'pp'}` : ['gain', 'gainY', 'nf'].includes(k) ? (a - b >= 0 ? '+' : '−') + num(Math.abs(a - b), k === 'nf' ? 0 : 1) : b ? pct((a / b - 1) * 100) : '–';
  const keys = Object.keys(I).filter(k => k !== 'per' || pl === 'II');
  const c = (k, i) => vals[i] == null || vals[i][k] == null ? '–' : fm[k](vals[i][k]);
  return { vals, dv, rows: keys.map(k => [I[k], c(k, 0), c(k, 1), c(k, 2), vals[1] ? dv(k, vals[0][k], vals[1][k]) : '–', vals[2] ? dv(k, vals[0][k], vals[2][k]) : '–']),
    head: [t.thInd, `${t.thNow} ${d}`, `${t.thPrevQ} ${qBack(d, 3)}`, `${t.thPrevY} ${qBack(d, 12)}`, t.thDq, t.thDy] };
}
function renderKeyTable() {
  const t = T(), pl = MS.pl, d = MS.d, { vals, dv, rows } = keyData(pl, d);
  document.getElementById('qfTable').innerHTML = `<thead><tr><th class="l">${t.thInd}</th><th>${t.thNow}<br><small>${d}</small></th><th>${t.thPrevQ}<br><small>${qBack(d, 3)}</small></th><th>${t.thPrevY}<br><small>${qBack(d, 12)}</small></th><th>${t.thDq}</th><th>${t.thDy}</th></tr></thead><tbody>`
    + rows.map(r => `<tr><td class="l">${r[0]}</td>${r.slice(1).map(x => `<td>${x}</td>`).join('')}</tr>`).join('') + '</tbody>';
  const T0 = vals[0];
  const kp = document.getElementById('qfKpis'), items = [[t.kPart(pl), mInt(T0.part), vals[1] ? dv('part', T0.part, vals[1].part) + ' · ' + t.dq(d) : t.dq(d)], [t.kNav(pl), mMn(T0.nav), vals[1] ? dv('nav', T0.nav, vals[1].nav) : ''],
    T0.ytd != null ? [t.kYtd, pct(T0.ytd), t.dq(d)] : null, T0.gain != null ? [t.kGain, mMn(Math.abs(T0.gain)).replace(/^/, T0.gain < 0 ? '−' : '+'), t.qn(d)] : null];
  kp.innerHTML = items.filter(Boolean).map(([k, v, s]) => `<div class="kpi"><span>${k}</span><b>${v}</b>${s ? `<small>${s}</small>` : ''}</div>`).join('');
}

/* ---------- rinka laike ---------- */
/* m – paryškintas valdytojas (savininkas 2026-10-19: „pasirinkus valdytoją niekas nesikeičia“): tada rodomi jo dalyviai, turtas, rinkos dalys ir prieaugis;
   svertinės grąžos valdytojui nerodomos – jos sumaišytų skirtingas grupes */
function mkSeries(m = MS.mgr) {
  const pl = MS.pl;
  return MKT[pl].dates.map((d, di) => { const A = avgOf(pl, di, -1), Tm = totals(pl, di), T0 = m ? { ...Tm, ...(byMgr(pl, di)[m] || { part: 0, nav: 0, nf: 0 }) } : Tm;
    return { d, di, ...T0, per: T0.part ? T0.nav * 1e6 / T0.part : null, ytd: m ? null : A ? A[MA.ret_ytd] : null, qret: m ? null : qRet(pl, di), r1: m ? null : A ? A[MA.ret_1y] : null, gain: gainAt(pl, di, m || undefined),
      shN: m && Tm.nav ? T0.nav / Tm.nav * 100 : null, shP: m && Tm.part ? T0.part / Tm.part * 100 : null }; });
}
function renderTime() {
  const t = T(), S = mkSeries(), el = document.getElementById('mkChart'), k = MS.ch;
  const m = MS.mgr, chs = { ...t.chOf, ...(m ? { shN: t.shOf.nav, shP: t.shOf.part } : {}) }, kk = chs[k] ? k : 'part';
  document.getElementById('mkLead').textContent = t.mkLead + (m ? ' ' + t.mkMgr(m) : '');
  document.getElementById('mkSeg').innerHTML = Object.keys(chs).filter(x => x !== 'per' || MS.pl === 'II').map(x => `<button type="button" data-ch="${x}" aria-pressed="${x === kk}">${chs[x]}</button>`).join('');
  const pts = S.filter(s => s[kk] != null && s.nf).map(s => [dayOf(s.d), s[kk]]);
  if (!el.closest('[hidden]') && pts.length > 1) drawLineChart(el, [{ provider: m || 'mkt', color: m ? mkColor(m) : 'var(--s1)', label: m || `${MS.pl} ${lang === 'lt' ? 'pakopa' : 'pillar'}`, points: pts }], pts[0][0], pts[pts.length - 1][0],
    { axisUnit: '', zero: false, ml: 70, fmt: v => kk === 'nav' ? mMn(v) : kk === 'per' ? mEurs(v) : /^sh/.test(kk) ? pctPlain(v, 1) : mInt(v) });
  const qd = (a, b) => a.ok && b && b.ok && b.part ? b : null;
  document.getElementById('mkTable').innerHTML = `<thead><tr><th class="l">${t.thDate}</th><th>${t.thPart}</th><th>${t.thDq}</th><th>${t.thDy}</th><th>${t.thNav}</th><th>${t.thDq}</th><th>${t.thDy}</th>${MS.pl === 'II' ? `<th>${t.thPer}</th>` : ''}${m ? `<th>${t.shOf.nav}</th><th>${t.shOf.part}</th>` : `<th>${t.thYtd}</th><th>${t.thQ}</th><th>${t.th1y}</th>`}<th>${t.thGain}</th></tr></thead><tbody>`
    + [...S].reverse().filter(s => s.nf).map(s => { const q = S[dIdx(MS.pl, qBack(s.d, 3))], y = S[dIdx(MS.pl, qBack(s.d, 12))];
      return `<tr${s.d === MS.d ? ' class="cur"' : ''}><td class="l">${s.d}</td><td>${mInt(s.part)}</td><td class="${mCls(q && s.part - q.part)}">${q ? mSInt(s.part - q.part) : '–'}</td><td class="${mCls(y && s.part - y.part)}">${y ? mSInt(s.part - y.part) : '–'}</td>`
        + `<td>${num(s.nav, 1)}</td><td>${q ? mRel(s.nav, q.nav) : '–'}</td><td>${y ? mRel(s.nav, y.nav) : '–'}</td>${MS.pl === 'II' ? `<td>${mCell(s.per, mInt)}</td>` : ''}${m ? `<td>${mCell(s.shN, v => pctPlain(v, 2))}</td><td>${mCell(s.shP, v => pctPlain(v, 2))}</td>` : `<td>${mPct(s.ytd)}</td><td>${mPct(s.qret)}</td><td>${mPct(s.r1)}</td>`}<td>${mCell(s.gain, v => num(v, 1))}</td></tr>`; }).join('') + '</tbody>';
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

/* ---------- faktai visuomenei, II ir III pakopa, valdytojų stiprybės (savininkas 2026-10-19: „minkštų faktų plačiai visuomenei“,
   „palyginti II ir III pakopą … gal pas kažką paspartėjo naujų dalyvių augimas“). Visi skaičiai – su Excel formulėmis kaip ketvirčio faktuose. */
addStrings({
  pv: {
    title: 'Facts for the public', lead: 'Plain-language facts for newsletters and social media: what returns mean in euros, how much funds earn per day and per participant. Funds are compared only within their group. Each card has an Excel file with every figure as a formula.',
    k1H: '€ 1,000 five years ago', k1: (lo, lg, hi, hg) => `Had you put € 1,000 into an average life-cycle fund 5 years ago, today you would have from ${lo} (${lg}) to ${hi} (${hg}), depending on the age group.`,
    k1g: (lo, lg, hi, hg) => `Had you put € 1,000 into an average fund 5 years ago, today you would have from ${lo} (${lg}) to ${hi} (${hg}), depending on the fund group.`,
    calcK1: '1,000 × (1 + Bank of Lithuania group average 5-year annual return)^5. Past returns do not guarantee future returns.',
    dayH: 'Every day', day: (v, d) => `Since the start of the year (${d} days) pension funds ${v >= 0 ? 'earned' : 'lost'} on average about ${mMn(Math.abs(v))} a day for their participants.`, calcDay: 'Investment gain since the start of the year ÷ number of days since 1 January.',
    ppH: 'Per participant', pp: (q, qn, y) => `In ${qn} the funds earned on average about ${q} per participant${y ? `, since the start of the year about ${y}` : ''}.`, calcPp: 'Investment gain ÷ participants at quarter end.',
    dblH: 'What a return means', dbl: (r5, c5, e, n) => `A 100 % return means the money has doubled: € 1,000 became € 2,000. Over the last 5 years the average fund return was ${r5} a year, ${c5} in total, so € 1,000 became about ${e}. At this pace money doubles in about ${n} years.`,
    calcDbl: 'Bank of Lithuania weighted average of all funds, 5-year annual return r; total = (1 + r)^5 − 1; doubling time = ln 2 ÷ ln(1 + r).',
    hiH: 'Strong 5 years', hi: (k, n, th) => `${k} of ${n} funds earned more than ${th}% over 5 years – every € 100 invested 5 years ago became more than € ${100 + th}.`, calcHi: 'Funds whose 5-year annual return r gives (1 + r)^5 − 1 above the threshold.',
    dTot: 'Days since 1 January', perDay: 'Per day, € m', thr: 'Threshold (annual return giving the total), %',
  },
  p23: {
    title: 'Pillars II and III', lead: 'How pillar III is growing alongside the pillar II reform: assets, participants and money flows by manager. Bank of Lithuania quarterly data; in pillar III a person saving in several funds is counted in each fund.',
    rH: 'Pillar III vs pillar II', r: (a, b) => `Pillar III assets already equal ${a} of pillar II assets (a year earlier ${b}).`, calcR: 'Pillar III net assets ÷ pillar II net assets.',
    gH: 'Growth of pillar III', g: (a, b, w) => `Since the start of the year the number of pillar III participants ${a >= 0 ? 'grew' : 'fell'} by ${mInt(Math.abs(a))} – ${w} the same period last year (${mInt(Math.abs(b))}).`,
    gW: x => x >= 1.2 ? `${num(x, 1)} times as much as in` : x <= 0.8 ? 'less than in' : 'about as much as in',
    calcG: 'Participants (sum over funds) at quarter end − at the end of last year; the same period a year earlier.',
    fH: 'Money flows', f: (a, b) => `Over the quarter ${a >= 0 ? `pillar III funds took in about ${mMn(a)} more than they paid out` : `pillar III funds paid out about ${mMn(-a)} more than they took in`}, while ${b >= 0 ? `pillar II funds took in about ${mMn(b)} more than they paid out` : `pillar II funds paid out about ${mMn(-b)} more than they took in`}.`, calcF: 'Flow = change in assets − investment gain (an estimate, as in “Change in assets”).',
    lH: 'Who attracts pillar III participants', l: (m, n, s) => `Since the start of the year ${m} attracted the most new pillar III participants: ${mInt(n)}${s ? `, or ${s} of the net growth` : ''}.`, calcL: 'Manager’s pillar III participants now − at the end of last year.',
    aH: 'Fastest acceleration', a: list => `Compared with the same period last year, pillar III participant growth since the start of the year accelerated most at ${list}.`, calcA: 'Participant growth since the start of the year ÷ growth in the same period last year; managers with growth in both periods.',
    cH: 'Pillars II and III together', c: list => `Taking pillars II and III together, the largest managers by assets are ${list}.`, calcC: 'Manager’s pillar II + III assets ÷ all pillar II + III assets.',
    m1: (m, a, b, w) => `Since the start of the year the number of ${m}’s pillar III participants ${a >= 0 ? 'grew' : 'fell'} by ${mInt(Math.abs(a))} (same period last year: ${b == null ? '–' : (b < 0 ? '−' : '') + mInt(Math.abs(b))}${w ? `; ${w}` : ''}).`,
    m2: (m, s, d) => `${m}’s share of pillar III assets is ${s}.${wSeq('it', [[wPer()[1], d, null]], ppA)}`,
    m3: (m, s2, s3, s) => `${m}’s share of assets: pillar II ${s2}, pillar III ${s3}, together ${s}.`,
    acc: x => x >= 1.2 ? `growth ${num(x, 1)} times faster` : x <= 0.8 ? 'growth slower' : 'similar pace',
    miTitle: 'Managers in pillars II and III', ytd: 'since start of year', ly: 'same period last year', ratio: 'Ratio', ys: 'end of last year', ys1: 'end of the year before',
  },
  stH: 'Strengths', st: (m, list) => `${m} funds were the best in their group: ${list}.`, calcSt: 'The manager’s best fund in each Bank of Lithuania group is compared with the group’s best result (same group only).',
  stP: { ytd: 'since the start of the year', r1: 'over 1 year', r3: 'over 3 years', r5: 'over 5 years' }, stMax: 'Best in group',
}, {
  pv: {
    title: 'Faktai visuomenei', lead: 'Paprasti faktai naujienlaiškiams ir socialiniams tinklams: ką grąža reiškia eurais, kiek fondai uždirba per dieną ir vienam dalyviui. Fondai lyginami tik savo grupėje. Prie kiekvienos kortelės – Excel su visais skaičiavimais.',
    k1H: '1 000 € prieš 5 metus', k1: (lo, lg, hi, hg) => `Jei prieš 5 metus į vidutinį gyvenimo ciklo fondą būtumėte įdėję 1 000 €, šiandien turėtumėte nuo ${lo} (${lg}) iki ${hi} (${hg}) – priklausomai nuo amžiaus grupės.`,
    k1g: (lo, lg, hi, hg) => `Jei prieš 5 metus į vidutinį fondą būtumėte įdėję 1 000 €, šiandien turėtumėte nuo ${lo} (${lg}) iki ${hi} (${hg}) – priklausomai nuo fondų grupės.`,
    calcK1: '1 000 × (1 + LB grupės vidutinė 5 metų metinė grąža)^5. Ankstesnė grąža negarantuoja būsimos.',
    dayH: 'Kiekvieną dieną', day: (v, d) => `Nuo metų pradžios (per ${d} ${ltN(d, 'dieną', 'dienas', 'dienų')}) pensijų fondai dalyviams vidutiniškai ${v >= 0 ? 'uždirbdavo' : 'prarasdavo'} apie ${mMn(Math.abs(v))} per dieną.`, calcDay: 'Investicinis prieaugis nuo metų pradžios ÷ dienų nuo sausio 1 d. skaičius.',
    ppH: 'Vienam dalyviui', pp: (q, qn, y) => `${qn[0].toUpperCase() + qn.slice(1)} fondai vienam dalyviui vidutiniškai uždirbo apie ${q}${y ? `, nuo metų pradžios – apie ${y}` : ''}.`, calcPp: 'Investicinis prieaugis ÷ dalyvių skaičius ketvirčio pabaigoje.',
    dblH: 'Ką reiškia grąža', dbl: (r5, c5, e, n) => `100 % grąža reiškia, kad pinigai padvigubėjo: 1 000 € virto 2 000 €. Per pastaruosius 5 metus vidutinė fondų grąža buvo ${r5} per metus, iš viso – ${c5}, taigi 1 000 € virto maždaug ${e}. Tokiu tempu pinigai padvigubėja maždaug per ${n} ${ltN(+n, 'metus', 'metus', 'metų')}.`,
    calcDbl: 'LB svertinis visų fondų vidurkis, 5 metų metinė grąža r; iš viso = (1 + r)^5 − 1; padvigubėjimo laikas = ln 2 ÷ ln(1 + r).',
    hiH: 'Stiprūs 5 metai', hi: (k, n, th) => `${k} iš ${n} fondų per 5 metus uždirbo daugiau nei ${th} % – kiekvienas prieš 5 metus įneštas 100 € virto daugiau nei ${100 + th} €.`, calcHi: 'Fondai, kurių 5 metų metinė grąža r duoda (1 + r)^5 − 1 daugiau už ribą.',
    dTot: 'Dienų nuo sausio 1 d.', perDay: 'Per dieną, mln. €', thr: 'Riba (metinė grąža, duodanti bendrą grąžą), %',
  },
  p23: {
    title: 'II ir III pakopa', lead: 'Kaip auga III pakopa vykstant II pakopos reformai: turtas, dalyviai ir pinigų srautai pagal valdytoją. LB ketvirčio duomenys; III pakopoje žmogus, kaupiantis keliuose fonduose, skaičiuojamas kiekviename fonde.',
    rH: 'III ir II pakopa', r: (a, b) => `III pakopos turtas jau sudaro ${a} II pakopos turto (prieš metus – ${b}).`, calcR: 'III pakopos grynieji aktyvai ÷ II pakopos grynieji aktyvai.',
    gH: 'III pakopos augimas', g: (a, b, w) => `Nuo metų pradžios III pakopos fondų dalyvių ${a >= 0 ? 'padaugėjo' : 'sumažėjo'} ${mInt(Math.abs(a))} – ${w} per tą patį laikotarpį pernai (${mInt(Math.abs(b))}).`,
    gW: x => x >= 1.2 ? `${num(x, 1)} karto daugiau nei` : x <= 0.8 ? 'mažiau nei' : 'panašiai kaip',
    calcG: 'Dalyviai (suma per fondus) ketvirčio pabaigoje − praėjusių metų pabaigoje; tas pats laikotarpis prieš metus.',
    fH: 'Pinigų srautai', f: (a, b) => `Per ketvirtį ${a >= 0 ? `į III pakopos fondus įmokėta apie ${mMn(a)} daugiau, nei išmokėta` : `iš III pakopos fondų išmokėta apie ${mMn(-a)} daugiau, nei įmokėta`}, o ${b >= 0 ? `į II pakopos fondus įmokėta apie ${mMn(b)} daugiau, nei išmokėta` : `iš II pakopos fondų išmokėta apie ${mMn(-b)} daugiau, nei įmokėta`}.`, calcF: 'Srautas = turto pokytis − investicinis prieaugis (įvertis, kaip „Turto pokytis“).',
    lH: 'Kas pritraukia III pakopos dalyvių', l: (m, n, s) => `Nuo metų pradžios daugiausia naujų III pakopos dalyvių pritraukė ${m} – ${mInt(n)}${s ? `, arba ${s} viso grynojo prieaugio` : ''}.`, calcL: 'Valdytojo III pakopos dalyviai dabar − praėjusių metų pabaigoje.',
    aH: 'Labiausiai paspartėjo', a: list => `Palyginti su tuo pačiu laikotarpiu pernai, nuo metų pradžios III pakopos dalyvių augimas labiausiai paspartėjo šių valdytojų fonduose: ${list}.`, calcA: 'Dalyvių prieaugis nuo metų pradžios ÷ prieaugis per tą patį laikotarpį pernai; valdytojai, kurių dalyvių daugėjo abiem laikotarpiais.',
    cH: 'II ir III pakopa kartu', c: list => `Sudėjus II ir III pakopas, daugiausia turto valdo ${list}.`, calcC: 'Valdytojo II + III pakopos turtas ÷ visas II + III pakopos turtas.',
    m1: (m, a, b, w) => `Nuo metų pradžios ${m} III pakopos fondų dalyvių ${a >= 0 ? 'padaugėjo' : 'sumažėjo'} ${mInt(Math.abs(a))} (per tą patį laikotarpį pernai – ${b == null ? '–' : (b < 0 ? '−' : '') + mInt(Math.abs(b))}${w ? `; ${w}` : ''}).`,
    m2: (m, s, d) => `${m} dalis III pakopos turto – ${s}.${wSeq('ji', [[wPer()[1], d, null]], ppA)}`,
    m3: (m, s2, s3, s) => `${m} turto dalis: II pakopoje ${s2}, III pakopoje ${s3}, kartu ${s}.`,
    acc: x => x >= 1.2 ? `augimas ${num(x, 1)} karto spartesnis` : x <= 0.8 ? 'augimas lėtesnis' : 'panašus tempas',
    miTitle: 'Valdytojai II ir III pakopoje', ytd: 'nuo metų pradžios', ly: 'tas pats laikotarpis pernai', ratio: 'Santykis', ys: 'praėjusių metų pabaiga', ys1: 'užpraeitų metų pabaiga',
  },
  stH: 'Stiprybės', st: (m, list) => `${m} fondai buvo geriausi savo grupėje: ${list}.`, calcSt: 'Geriausias valdytojo fondas kiekvienoje LB grupėje lyginamas su geriausiu tos grupės rezultatu (tik tos pačios grupės fondai).',
  stP: { ytd: 'nuo metų pradžios', r1: 'per 1 metus', r3: 'per 3 metus', r5: 'per 5 metus' }, stMax: 'Geriausias grupėje',
});
const OD3 = "'LB duomenys (III)'";
const sumS = (sh, col, R, m) => `SUMIFS(${sh}!${col}:${col},${sh}!A:A,${R}${m ? `,${sh}!B:B,${xq(m)}` : ''})`;
const YS = 'EOMONTH(DATE(YEAR($B$4),1,1),-1)', YS1 = 'EOMONTH(DATE(YEAR($B$4)-1,1,1),-1)';
const yEnd = (d, k) => `${+d.slice(0, 4) - k}-12-31`;
/* valdytojo stiprybės – grupės, kuriose jo fondas pirmas (lyginama tik grupės viduje) */
function strengthFact(pl, di, m) {
  const t = T(), L = lang === 'lt', nb = NB(), parts = [], cm = crM(m), d0 = MKD.d0;
  [['ret_ytd', 'G', 'ytd'], ['ret_1y', 'M', 'r1'], ['ret_3y', 'N', 'r3'], ['ret_5y', 'O', 'r5']].forEach(([k, col, pk]) => {
    const gs = [];
    groupsAt(pl, di).forEach(gi => { const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC[k]] != null); if (rs.length < 2) return;
      const mine = rs.filter(r => fundOf(pl, r)[0] === m); if (!mine.length) return;
      const b = Math.max(...mine.map(r => r[MC[k]])), top = Math.max(...rs.map(r => r[MC[k]])); if (b < top) return;
      const gl = groupLbl(pl, gi), cg = crG(pl, gi);
      const i = nb.add(`${gl} · ${t.fx.best} · ${t.stP[pk]}`, b, () => `_xlfn.MAXIFS(${MKX.D}!${col}:${col},${byD(d0)},${cg},${cm})`, Zp);
      const j = nb.add(`${gl} · ${t.stMax} · ${t.stP[pk]}`, top, () => `_xlfn.MAXIFS(${MKX.D}!${col}:${col},${byD(d0)},${cg})`, Zp);
      nb.add(`${gl} · ${L ? 'Pirmas (1 = taip)' : 'First (1 = yes)'} · ${t.stP[pk]}`, 1, c => `IF(${c(i)}>=${c(j)},1,0)`, '0'); gs.push(gl); });
    if (gs.length) parts.push(`${t.stP[pk]} – ${gs.map(g => L ? `„${g}“` : `“${g}”`).join(', ')}`);
  });
  return parts.length ? { h: m, text: t.st(m, parts.join('; ')), calc: t.calcSt, src: t.srcLB(pl, MKT[pl].dates[di]), hl: true, nums: nb.a } : null;
}
function pvFacts() {
  const t = T(), X = t.pv, F = t.f, I = t.ind, L = lang === 'lt', pl = MS.pl, d = MS.d, di = dIdx(pl, d), T0 = totals(pl, di), src = t.srcLB(pl, d), out = [], ALL = L ? 'Visi fondai' : 'All funds', d0 = MKD.d0;
  const add = (h, text, calc, nb) => out.push({ h, text, calc, src, nums: nb.a });
  const gs = groupsAt(pl, di).filter(gi => pl === 'III' || /^\d{4}-\d{4}$/.test(groupKeyOf(pl, gi))).map(gi => ({ gi, a: avgOf(pl, di, gi) })).filter(x => x.a && x.a[MA.ret_5y] != null).map(x => ({ ...x, e: 1000 * (1 + x.a[MA.ret_5y] / 100) ** 5 })).sort((a, b) => a.e - b.e);
  if (gs.length > 1) { const nb = NB();
    gs.forEach(x => { const gl = groupLbl(pl, x.gi), i = nb.add(`${gl} · ${t.th5y.toLowerCase()} (${L ? 'metinė' : 'annual'}), %`, x.a[MA.ret_5y], () => fxAvg('F', d0, gl), Zp); nb.add(`${gl} · ${L ? '1 000 € po 5 metų' : '€ 1,000 after 5 years'}`, x.e, c => `1000*(1+${c(i)}/100)^5`, Zi); });
    const lo = gs[0], hi = gs[gs.length - 1]; add(X.k1H, (pl === 'II' ? X.k1 : X.k1g)(mEurs(lo.e), groupLbl(pl, lo.gi), mEurs(hi.e), groupLbl(pl, hi.gi)), X.calcK1, nb); }
  const A = avgOf(pl, di, -1);
  if (A && A[MA.ret_5y] != null) { const r = A[MA.ret_5y] / 100, nb = NB(), i = nb.add(`${ALL} · ${t.th5y.toLowerCase()} (${L ? 'metinė' : 'annual'}), %`, A[MA.ret_5y], () => fxAvg('F', d0, ALL), Zp);
    const c5 = nb.add(L ? 'Iš viso per 5 metus' : 'Total over 5 years', (1 + r) ** 5 - 1, c => `(1+${c(i)}/100)^5-1`, Zr); nb.add(L ? '1 000 € po 5 metų' : '€ 1,000 after 5 years', 1000 * (1 + r) ** 5, c => `1000*(1+${c(c5)})`, Zi);
    if (r > 0) nb.add(L ? 'Padvigubėjimo laikas, metai' : 'Doubling time, years', Math.log(2) / Math.log(1 + r), c => `LN(2)/LN(1+${c(i)}/100)`, '0.0');
    if (r > 0) add(X.dblH, X.dbl(pctPlain(A[MA.ret_5y]), pctPlain(((1 + r) ** 5 - 1) * 100), mEurs(1000 * (1 + r) ** 5), num(Math.log(2) / Math.log(1 + r), 0)), X.calcDbl, nb); }
  { const rs = rowsAt(pl, di).filter(r => r[MC.ret_5y] != null), cum = r => (1 + r[MC.ret_5y] / 100) ** 5 - 1, th = rs.some(r => cum(r) > 1) ? 100 : 50, k = rs.filter(r => cum(r) > th / 100).length;
    if (rs.length > 2 && k) { const nb = NB(), ti = nb.add(X.thr, ((1 + th / 100) ** 0.2 - 1) * 100, () => `((1+${th}/100)^(1/5)-1)*100`, '0.000');
      nb.add(L ? `Fondai, per 5 metus uždirbę daugiau nei ${th} %` : `Funds earning over ${th} % in 5 years`, k, c => `COUNTIFS(${byD(d0)},${MKX.D}!O:O,">"&${c(ti)})`, '0');
      nb.add(L ? 'Fondai, turintys 5 metų grąžą' : 'Funds with a 5-year return', rs.length, () => `COUNTIFS(${byD(d0)},${MKX.D}!O:O,"<>")`, '0');
      add(X.hiH, X.hi(k, rs.length, th), X.calcHi, nb); } }
  const q1 = d.slice(5, 7) === '03', g = gainAt(pl, di), gy = q1 ? g : gainYtd(pl, di);
  if (gy != null) { const days = dayOf(d) - dayOf(`${d.slice(0, 4)}-01-01`) + 1, nb = NB(), a = nb.add(I.gainY, gy, () => fxGainY(d0), Zm), b = nb.add(X.dTot, days, () => `${d0}-DATE(YEAR(${d0}),1,1)+1`, '0');
    nb.add(X.perDay, gy / days, c => `${c(a)}/${c(b)}`, '0.00'); add(X.dayH, X.day(gy / days, days), `${X.calcDay} ${F.calcGain}`, nb); }
  if (g != null && T0.part) { const nb = NB(), a = nb.add(I.gain, g, () => fxGain(d0), Zm), p = nb.add(I.part, T0.part, () => fxPart(d0), Zi);
    nb.add(L ? 'Per ketvirtį vienam dalyviui, €' : 'Per participant in the quarter, €', g * 1e6 / T0.part, c => `${c(a)}*1000000/${c(p)}`, Zi);
    if (!q1 && gy != null) { const y = nb.add(I.gainY, gy, () => fxGainY(d0), Zm); nb.add(L ? 'Nuo metų pradžios vienam dalyviui, €' : 'Since year start per participant, €', gy * 1e6 / T0.part, c => `${c(y)}*1000000/${c(p)}`, Zi); }
    add(X.ppH, X.pp(mEurs(g * 1e6 / T0.part), t.qn(d), !q1 && gy != null ? mEurs(gy * 1e6 / T0.part) : ''), `${X.calcPp} ${F.calcGain}`, nb); }
  { const N = t.nf, b = wAvgAt(pl, di, 'bar');
    if (b != null && T0.part) { const nb = NB(), rg = (cc, X2) => `${MKX.D}!${cc}3:${cc}${X2.n}`, pp = T0.nav * 1e6 / T0.part;
      const i = nb.add(`${t.fx.tot} · ${N.bar}`, b, (c, X2) => `SUMPRODUCT((${rg('A', X2)}=${d0})*(${rg('V', X2)}<>"")*(${rg('F', X2)}>0)*${rg('F', X2)}*${rg('V', X2)})/SUMPRODUCT((${rg('A', X2)}=${d0})*(${rg('V', X2)}<>"")*(${rg('F', X2)}>0)*${rg('F', X2)})`, Zp);
      const a = nb.add(I.nav, T0.nav, () => fxNav(d0), Zm), q = nb.add(I.part, T0.part, () => fxPart(d0), Zi), j = nb.add(N.per, pp, c => `${c(a)}*1000000/${c(q)}`, Zi); nb.add(N.fy, pp * b / 100, c => `${c(j)}*${c(i)}/100`, Zi);
      out.push({ h: N.feeH, text: N.fee(pl, mEurs(pp * b / 100), pctPlain(b), mEurs(pp)), calc: N.calcFee, src, nums: nb.a, tp: 'fee', ex: () => ({ k: 'lvl', pl, u: 'eur', dy: 5, cagr: false, w: N.fy.toLowerCase(), lab: N.feeH, fn: k => { const x = totals(pl, k), w = wAvgAt(pl, k, 'bar'); return x.part && w != null ? x.nav * 1e6 / x.part * w / 100 : null; } }) }); } }
  // fondo pasirinkimo svarba: grupė, kurioje 5 metų grąžų skirtumas tarp fondų didžiausias (lyginama tik grupės viduje)
  { const N = t.nf, e = r => 1000 * (1 + r / 100) ** 5;
    const g = groupsAt(pl, di).map(gi => { const rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === gi && r[MC.ret_5y] != null).sort((a, b) => b[MC.ret_5y] - a[MC.ret_5y]); return rs.length > 2 ? { gi, gl: groupLbl(pl, gi), b: rs[0], w: rs[rs.length - 1] } : null; })
      .filter(Boolean).sort((x, y) => (y.b[MC.ret_5y] - y.w[MC.ret_5y]) - (x.b[MC.ret_5y] - x.w[MC.ret_5y]))[0];
    if (g) { const nb = NB(), cg = crG(pl, g.gi), rb = g.b[MC.ret_5y], rw = g.w[MC.ret_5y];
      const a = nb.add(`${g.gl} · ${N.best} (${fundOf(pl, g.b)[0]}) · ${t.th5y.toLowerCase()}, %`, rb, () => `_xlfn.MAXIFS(${MKX.D}!O:O,${byD(d0)},${cg})`, Zp), b = nb.add(`${g.gl} · ${N.worst} (${fundOf(pl, g.w)[0]}) · ${t.th5y.toLowerCase()}, %`, rw, () => `_xlfn.MINIFS(${MKX.D}!O:O,${byD(d0)},${cg})`, Zp);
      const ea = nb.add(`${N.best} · ${N.e}`, e(rb), c => `1000*(1+${c(a)}/100)^5`, Zi), eb = nb.add(`${N.worst} · ${N.e}`, e(rw), c => `1000*(1+${c(b)}/100)^5`, Zi); nb.add(N.diff, e(rb) - e(rw), c => `${c(ea)}-${c(eb)}`, Zi);
      out.push({ h: N.fcH, text: N.fc(g.gl, fundOf(pl, g.b)[0], pctPlain(rb), fundOf(pl, g.w)[0], pctPlain(rw), mEurs(e(rb)), mEurs(e(rw)), mEurs(e(rb) - e(rw))), calc: N.calcFc, src, nums: nb.a, tp: 'ret', ex: () => ({ k: 'ret', pl, h: '5y', eur: true, g: g.gi }) }); } }
  out.push(...pvMore(), ...pvWages());
  return out;
}
/* sudėtingesni faktai visuomenei (savininkas 2026-10-19: „jų reiktų daugiau ir labiau sofistikuotų“): ilgo laikotarpio grandininė grąža,
   blogiausias kritimas ir atsigavimas, metai su teigiama grąža, grąža po infliacijos, rizika ilgame laikotarpyje, viso laikotarpio prieaugis */
addStrings({ pv2: {
  cumH: 'Earned since 2015', cum: (v, s, y) => `Since ${y} pension funds have earned their participants about ${v} of investment gain – about ${s} of today’s assets.`,
  calcCum: 'Sum of quarterly investment gains (Bank of Lithuania data) up to the selected quarter; quarters without previous-quarter data are not counted.',
  yrH: 'Good and bad years', yr: (k, n, by, bv, wy, wv, fy) => `The average fund return was positive in ${k} of ${n} full years since ${fy}; the best year was ${by} (${bv}), the worst ${wy} (${wv}).`,
  calcYr: 'Bank of Lithuania weighted average of all funds, return since the start of the year at 31 December.',
  chH: '€ 100 since', ch: (y, v, bad) => `€ 100 invested at the start of ${y} at the average fund return would now be about ${v}${bad ? `, even though some years (${bad}) were negative` : ''}.`,
  calcCh: 'Annual returns (weighted average of all funds at 31 December) chained: 100 × (1 + r₁) × (1 + r₂) × … × (1 + this year’s return so far).',
  ddH: 'Fall and recovery', dd: (v, a, b, n, c) => `The largest fall of the average fund was ${v} (from ${a} to ${b}); ${c ? `the funds recovered the loss in ${n} ${n === 1 ? 'quarter' : 'quarters'}, by ${c}` : 'the loss has not yet been fully recovered'}.`,
  ddNone: 'Fall and recovery', calcDd: 'Value index at quarter ends from the chained average return; fall = index ÷ previous peak − 1; recovery – first quarter the index is back at the peak.',
  reH: 'After inflation', re: (n, c, r, m) => `Over 5 years the average fund return was ${n}, while prices rose ${c}, so ${Math.abs(r) < 1 ? 'the funds preserved the purchasing power of savings' : r >= 0 ? `the purchasing power of savings grew about ${pctPlain(r, 1)}` : `inflation ate about ${pctPlain(-r, 1)} of their purchasing power`} (prices up to ${m}).`,
  calcRe: 'Fund: (1 + 5-year annual return)^5 − 1; prices: Lithuanian consumer price index (State Data Agency), month now ÷ same month 5 years ago − 1; real = (1 + fund) ÷ (1 + prices) − 1.',
  r3H: '3-year periods', r3: (k, n, y) => `Since ${y} the average fund’s return over the previous 3 years was positive at ${k === n ? `all ${n}` : `${k} of ${n}`} quarter ends.`, calcR3: 'Bank of Lithuania weighted average of all funds, 3-year annual return at each quarter end.',
  rkH: 'Risk over the long term', rk: (a, ar, b, br, ea, eb) => `Over 5 years ${a} funds earned on average ${ar} a year and ${b} funds ${br}: € 1,000 became ${ea} and ${eb}.`,
  calcRk: 'Bank of Lithuania group weighted averages, 5-year annual return; 1,000 × (1 + r)^5. Groups are compared, not individual funds.',
  idx: 'Value index', peak: 'Previous peak', ddL: 'Fall from peak', cpiL: 'Consumer price index', vki: 'CPI',
} }, { pv2: {
  cumH: 'Uždirbta nuo 2015 m.', cum: (v, s, y) => `Nuo ${y} m. pensijų fondai dalyviams uždirbo apie ${v} investicinio prieaugio – tai maždaug ${s} dabartinio turto.`,
  calcCum: 'Ketvirčių investicinių prieaugių (LB duomenys) suma iki pasirinkto ketvirčio; ketvirčiai be ankstesnio ketvirčio duomenų neskaičiuojami.',
  yrH: 'Geri ir blogi metai', yr: (k, n, by, bv, wy, wv, fy) => `Nuo ${fy} m. vidutinė fondų grąža buvo teigiama ${k} iš ${n} pilnų metų; geriausi metai – ${by} m. (${bv}), blogiausi – ${wy} m. (${wv}).`,
  calcYr: 'LB svertinis visų fondų vidurkis, grąža nuo metų pradžios gruodžio 31 d.',
  chH: '100 € nuo pradžios', ch: (y, v, bad) => `100 €, investuoti ${y} m. pradžioje pagal vidutinę fondų grąžą, šiandien būtų apie ${v}${bad ? `, nors kai kurie metai (${bad}) buvo nuostolingi` : ''}.`,
  calcCh: 'Metų grąžos (visų fondų svertinis vidurkis gruodžio 31 d.) sujungiamos: 100 × (1 + r₁) × (1 + r₂) × … × (1 + šių metų grąža iki šiol).',
  ddH: 'Kritimas ir atsigavimas', dd: (v, a, b, n, c) => `Didžiausias vidutinio fondo vertės kritimas – ${v} (nuo ${a} iki ${b}); ${c ? `prarastą vertę fondai atgavo per ${n} ${ltN(n, 'ketvirtį', 'ketvirčius', 'ketvirčių')}, iki ${c}` : 'prarasta vertė dar neatgauta visiškai'}.`,
  ddNone: 'Kritimas ir atsigavimas', calcDd: 'Vertės indeksas ketvirčių pabaigose iš sujungtos vidutinės grąžos; kritimas = indeksas ÷ ankstesnis didžiausias − 1; atsigavimas – pirmas ketvirtis, kai indeksas vėl pasiekia buvusį didžiausią.',
  reH: 'Po infliacijos', re: (n, c, r, m) => `Per 5 metus vidutinė fondų grąža buvo ${n}, o kainos per tą laiką pakilo ${c}, taigi ${Math.abs(r) < 1 ? 'fondai išsaugojo santaupų perkamąją galią' : r >= 0 ? `santaupų perkamoji galia padidėjo apie ${pctPlain(r, 1)}` : `infliacija suvalgė apie ${pctPlain(-r, 1)} santaupų perkamosios galios`} (kainų duomenys iki ${m}).`,
  calcRe: 'Fondai: (1 + 5 metų metinė grąža)^5 − 1; kainos: Lietuvos vartotojų kainų indeksas (Valstybės duomenų agentūra), dabartinis mėnuo ÷ tas pats mėnuo prieš 5 metus − 1; realioji = (1 + fondai) ÷ (1 + kainos) − 1.',
  r3H: 'Trejų metų laikotarpiai', r3: (k, n, y) => `Nuo ${y} m. vidutinio fondo pastarųjų 3 metų grąža buvo teigiama ${k === n ? `visų ${n}` : `${k} iš ${n}`} ketvirčių pabaigose.`, calcR3: 'LB svertinis visų fondų vidurkis, 3 metų metinė grąža kiekvieno ketvirčio pabaigoje.',
  rkH: 'Rizika ilgame laikotarpyje', rk: (a, ar, b, br, ea, eb) => `Per 5 metus grupės „${a}“ fondai vidutiniškai uždirbo ${ar} per metus, o „${b}“ – ${br}: 1 000 € virto atitinkamai ${ea} ir ${eb}.`,
  calcRk: 'LB grupių svertiniai vidurkiai, 5 metų metinė grąža; 1 000 × (1 + r)^5. Lyginamos grupės, ne atskiri fondai.',
  idx: 'Vertės indeksas', peak: 'Ankstesnis didžiausias', ddL: 'Kritimas nuo didžiausio', cpiL: 'Vartotojų kainų indeksas', vki: 'VKI',
} });
const CHN = {};
/* grandininis vidutinio fondo vertės indeksas: metų grąžos (gruodžio 31 d.) × šių metų grąža iki ketvirčio; pradžia – pirmi metai, nuo kurių grandinė nenutrūksta */
function chainOf(pl, upto = MS.d) {
  const key = pl + upto; if (CHN[key]) return CHN[key];
  const P = MKT[pl], y0 = +upto.slice(0, 4), dec = y => avgK(pl, dIdx(pl, `${y}-12-31`), 'ret_ytd');
  let fy = y0; while (fy - 1 >= 2015 && dec(fy - 1) != null) fy--;
  const base = { [fy - 1]: 100 }; for (let y = fy; y < y0; y++) base[y] = base[y - 1] * (1 + dec(y) / 100);
  const idx = {}; P.dates.forEach((d, di) => { const y = +d.slice(0, 4), a = avgK(pl, di, 'ret_ytd'); if (d <= upto && y >= fy && a != null && base[y - 1] != null) idx[di] = base[y - 1] * (1 + a / 100); });
  return (CHN[key] = { fy, base, idx, dec });
}
const cpiM = m => typeof CPI !== 'undefined' ? CPI[m] : undefined;
const mBack = (m, k) => { let y = +m.slice(0, 4), mm = +m.slice(5, 7) - k; while (mm <= 0) { y--; mm += 12; } return `${y}-${String(mm).padStart(2, '0')}`; };
function pvMore() {
  const t = T(), X = t.pv2, I = t.ind, L = lang === 'lt', pl = MS.pl, d = MS.d, di = dIdx(pl, d), T0 = totals(pl, di), src = t.srcLB(pl, d), out = [], ALL = L ? 'Visi fondai' : 'All funds', d0 = MKD.d0;
  const add = (h, text, calc, nb, o = {}) => out.push({ h, text, calc, src, nums: nb.a, ...o });
  // uždirbta nuo pradžios
  { let s = 0, y = null; for (let i = 0; i <= di; i++) { const g = gainAt(pl, i); if (g != null) { s += g; if (!y) y = MKT[pl].dates[i].slice(0, 4); } }
    if (y && T0.nav) { const nb = NB(), a = nb.add(L ? `Investicinis prieaugis nuo ${y} m., mln. € (apyt.)` : `Investment gain since ${y}, € m (est.)`, s, () => `SUMIFS(${MKX.D}!L:L,${MKX.D}!A:A,"<="&${d0})`, Zm), b = nb.add(I.nav, T0.nav, () => fxNav(d0), Zm);
      nb.add(L ? 'Dalis dabartinio turto' : 'Share of today’s assets', s / T0.nav, c => `${c(a)}/${c(b)}`, Zr);
      add(X.cumH, X.cum(mMn(s), `${Math.round(s / T0.nav * 100)} %`, y), `${X.calcCum} ${t.f.calcGain}`, nb); } }
  const C = chainOf(pl), y0 = +d.slice(0, 4), yrs = []; for (let y = C.fy; y < y0; y++) yrs.push(y);
  // geri ir blogi metai
  if (yrs.length >= 3) { const nb = NB(), ix = yrs.map(y => nb.add(`${y} · ${t.thYtd.toLowerCase()} (31.12), %`, C.dec(y), () => fxAvg('C', `DATE(${y},12,31)`, ALL), Zp));
    const k = yrs.filter(y => C.dec(y) > 0).length, best = yrs.reduce((a, b) => C.dec(b) > C.dec(a) ? b : a), worst = yrs.reduce((a, b) => C.dec(b) < C.dec(a) ? b : a);
    nb.add(L ? 'Metai su teigiama grąža' : 'Years with a positive return', k, c => `COUNTIF(${c(ix[0])}:${c(ix[ix.length - 1])},">0")`, '0'); nb.add(L ? 'Pilnų metų' : 'Full years', yrs.length, c => `COUNT(${c(ix[0])}:${c(ix[ix.length - 1])})`, '0');
    add(X.yrH, X.yr(k, yrs.length, best, pctPlain(C.dec(best)), worst, pctPlain(C.dec(worst)), C.fy), X.calcYr, nb); }
  // 100 € nuo pradžios
  if (yrs.length >= 3 && C.idx[di] != null) { const nb = NB(), b0 = nb.add(L ? `Pradžia (${C.fy} m. sausio 1 d.), €` : `Start (1 Jan ${C.fy}), €`, 100, () => '100', '0.00'); let prev = b0;
    yrs.forEach(y => { const r = nb.add(`${y} · ${t.thYtd.toLowerCase()} (31.12), %`, C.dec(y), () => fxAvg('C', `DATE(${y},12,31)`, ALL), Zp), p0 = prev; prev = nb.add(`${L ? 'Vertė' : 'Value'} 31.12.${y}, €`, C.base[y], c => `${c(p0)}*(1+${c(r)}/100)`, '0.00'); });
    if (d.slice(5) !== '12-31') { const r = nb.add(`${y0} · ${t.thYtd.toLowerCase()} (${d}), %`, avgK(pl, di, 'ret_ytd'), () => fxAvg('C', d0, ALL), Zp), p0 = prev; prev = nb.add(`${L ? 'Vertė' : 'Value'} ${d}, €`, C.idx[di], c => `${c(p0)}*(1+${c(r)}/100)`, '0.00'); }
    const bad = yrs.filter(y => C.dec(y) < 0).join(', ');
    add(X.chH, X.ch(C.fy, `${num(C.idx[di], 0)} €`, bad), X.calcCh, nb); }
  // kritimas ir atsigavimas (ketvirčių pabaigose)
  { const ks = Object.keys(C.idx).map(Number).sort((a, b) => a - b);
    if (ks.length > 8) { let pk = 100, pkD = null, best = { v: 0 };
      [[null, 100], ...ks.map(k => [k, C.idx[k]])].forEach(([k, v]) => { if (v >= pk) { pk = v; pkD = k; } else if (v / pk - 1 < best.v) best = { v: v / pk - 1, pk, pkD, tr: k }; });
      if (best.v < -0.02) { const rec = ks.find(k => k > best.tr && C.idx[k] >= best.pk), qn = rec != null ? ks.filter(k => k > best.tr && k <= rec).length : 0;
        const nb = NB(), D = MKT[pl].dates, lbl = k => k == null ? (L ? `${C.fy} m. pradžia` : `start of ${C.fy}`) : t.dq(D[k]), rows = {};
        const b0 = nb.add(L ? `Pradžia (${C.fy} m. sausio 1 d.)` : `Start (1 Jan ${C.fy})`, 100, () => '100', '0.00');
        const decRow = { [C.fy - 1]: b0 }; let pkr = b0;
        ks.forEach(k => { const dd = D[k], y = +dd.slice(0, 4), r = nb.add(`${dd} · ${t.thYtd.toLowerCase()}, %`, avgK(pl, k, 'ret_ytd'), () => fxAvg('C', `DATE(${y},${+dd.slice(5, 7)},${+dd.slice(8)})`, ALL), Zp), pr = decRow[y - 1];
          const v = nb.add(`${dd} · ${X.idx}`, C.idx[k], c => `${c(pr)}*(1+${c(r)}/100)`, '0.00'); rows[k] = v; if (dd.slice(5) === '12-31') decRow[y] = v; });
        const vs = [b0, ...ks.map(k => rows[k])], ti = rows[best.tr], pi = best.pkD == null ? b0 : rows[best.pkD]; void pkr; void vs;
        nb.add(X.peak, best.pk, c => `${c(pi)}`, '0.00'); nb.add(X.ddL, best.v, c => `${c(ti)}/${c(pi)}-1`, Zr);
        add(X.ddH, X.dd(pA(best.v * 100), lbl(best.pkD), lbl(best.tr), qn, rec != null ? t.dq(D[rec]) : ''), X.calcDd, nb); } } }
  // po infliacijos (5 metai)
  { const A = avgOf(pl, di, -1), m0 = d.slice(0, 7), cm = cpiM(m0) != null ? m0 : Object.keys(typeof CPI !== 'undefined' ? CPI : {}).filter(k => k <= m0).sort().pop(), c5 = cm ? mBack(cm, 60) : null;
    if (A && A[MA.ret_5y] != null && cm && cpiM(c5) != null) { const n = (1 + A[MA.ret_5y] / 100) ** 5 - 1, c = cpiM(cm) / cpiM(c5) - 1, r = (1 + n) / (1 + c) - 1, nb = NB(), V = `'${X.vki}'`;
      const i = nb.add(`${ALL} · ${t.th5y.toLowerCase()} (${L ? 'metinė' : 'annual'}), %`, A[MA.ret_5y], () => fxAvg('F', d0, ALL), Zp), j = nb.add(L ? 'Fondai per 5 metus iš viso' : 'Funds, 5 years total', n, cc => `(1+${cc(i)}/100)^5-1`, Zr);
      const a = nb.add(`${X.cpiL} ${cm}`, cpiM(cm), () => `INDEX(${V}!B:B,MATCH("${cm}",${V}!A:A,0))`, '0.0000'), b = nb.add(`${X.cpiL} ${c5}`, cpiM(c5), () => `INDEX(${V}!B:B,MATCH("${c5}",${V}!A:A,0))`, '0.0000');
      const k = nb.add(L ? 'Kainų pokytis per 5 metus' : 'Price change over 5 years', c, cc => `${cc(a)}/${cc(b)}-1`, Zr); nb.add(L ? 'Realioji grąža per 5 metus' : 'Real return over 5 years', r, cc => `(1+${cc(j)})/(1+${cc(k)})-1`, Zr);
      add(X.reH, X.re(pctPlain(n * 100), pctPlain(c * 100, 1), r * 100, cm), X.calcRe, nb, { cpi: true }); } }
  // trejų metų laikotarpiai
  { const ks = MKT[pl].dates.map((x, i) => i).filter(i => i <= di && avgK(pl, i, 'ret_3y') != null);
    if (ks.length > 4) { const nb = NB(), ix = ks.map(i => { const dd = MKT[pl].dates[i]; return nb.add(`${dd} · ${t.th3y.toLowerCase()}, %`, avgK(pl, i, 'ret_3y'), () => fxAvg('E', `DATE(${dd.slice(0, 4)},${+dd.slice(5, 7)},${+dd.slice(8)})`, ALL), Zp); });
      const k = ks.filter(i => avgK(pl, i, 'ret_3y') > 0).length;
      nb.add(L ? 'Teigiamų' : 'Positive', k, c => `COUNTIF(${c(ix[0])}:${c(ix[ix.length - 1])},">0")`, '0'); nb.add(L ? 'Iš viso' : 'Total', ks.length, c => `COUNT(${c(ix[0])}:${c(ix[ix.length - 1])})`, '0');
      add(X.r3H, X.r3(k, ks.length, MKT[pl].dates[ks[0]].slice(0, 4)), X.calcR3, nb); } }
  // rizika ilgame laikotarpyje: daugiausia ir mažiausiai rizikingos grupės
  { const ks = groupsAt(pl, di).map(gi => ({ gi, k: groupKeyOf(pl, gi), a: avgOf(pl, di, gi) })).filter(x => x.a && x.a[MA.ret_5y] != null);
    const lo = ks.find(x => x.k === (pl === 'II' ? 'turto' : 'obl')) || ks.find(x => x.k === 'kons'), lc = pl === 'II' ? ks.filter(x => /^\d{4}-\d{4}$/.test(x.k)) : ks.filter(x => x.k === 'akc'), hi = lc.sort((a, b) => b.a[MA.ret_5y] - a.a[MA.ret_5y])[0];
    if (lo && hi) { const nb = NB(), e = r => 1000 * (1 + r / 100) ** 5, gh = groupLbl(pl, hi.gi), gl = groupLbl(pl, lo.gi);
      const a = nb.add(`${gh} · ${t.th5y.toLowerCase()}, %`, hi.a[MA.ret_5y], () => fxAvg('F', d0, gh), Zp), b = nb.add(`${gl} · ${t.th5y.toLowerCase()}, %`, lo.a[MA.ret_5y], () => fxAvg('F', d0, gl), Zp);
      nb.add(`${gh} · 1 000 €`, e(hi.a[MA.ret_5y]), c => `1000*(1+${c(a)}/100)^5`, Zi); nb.add(`${gl} · 1 000 €`, e(lo.a[MA.ret_5y]), c => `1000*(1+${c(b)}/100)^5`, Zi);
      add(X.rkH, X.rk(gh, pctPlain(hi.a[MA.ret_5y]), gl, pctPlain(lo.a[MA.ret_5y]), mEurs(e(hi.a[MA.ret_5y])), mEurs(e(lo.a[MA.ret_5y]))), X.calcRk, nb, { gs: [hi.gi, lo.gi] }); } }
  return out;
}

/* fondai prieš darbo užmokestį, pensiją, MMA ir infliaciją (savininkas 2026-10-19: „kas sparčiau augo, investicijos ar darbo užmokestis … gal ne visais laikotarpiais“).
   Darbo užmokestis, pensija ir MMA – metų vidurkiai (Valstybės duomenų agentūra, docs/data_journey.js); fondai – grandininė vidutinė grąža (chainOf). */
addStrings({ pv3: {
  wH: 'Funds vs wages', pH: 'Funds vs pensions', mH: 'Funds vs minimum wage', iH: 'Funds vs inflation by year', eH: 'Savings in wages and pensions',
  what: { w: 'the average net monthly wage', p: 'the average old-age pension', m: 'the minimum monthly wage (net)' },
  cmp: (what, n, a, b, x, f, win) => `Over ${n} years (${a}–${b}) ${what} grew ${x}, while the value of the average pension fund grew ${f}, so ${win}.`,
  win: { f: 'investments grew faster', x: k => `${{ w: 'wages', p: 'pensions', m: 'the minimum wage' }[k]} grew faster`, e: 'both grew at about the same pace' },
  oth: list => ` ${list[0].toUpperCase() + list.slice(1)}.`, othI: (n, x, f, k) => `over ${n} years ${{ w: 'wages', p: 'pensions', m: 'the minimum wage' }[k]} grew ${x} and funds ${f}`,
  inf: (k, n, by, bv, wy, wv) => `In ${k} of ${n} years the average fund return beat inflation (December to December)${by ? `; the largest lead was in ${by} (${bv})` : ''}${wy ? `, the largest shortfall in ${wy} (${wv})` : ''}.`,
  eur: (v, y, a, b, c) => `Average savings of a pillar II participant (${v}) equal about ${a} average net monthly wages, ${b} average old-age pensions${c ? ` or ${c} net minimum wages` : ''} (${y}).`,
  calcCmp: 'Growth = annual average in the last year ÷ annual average n years earlier − 1; funds – chained weighted average return of all funds (31 December to 31 December).',
  calcInf: 'Fund return – Bank of Lithuania weighted average of all funds for the calendar year; inflation – consumer price index December ÷ previous December − 1.',
  calcEur: 'Assets per participant ÷ annual average net wage, old-age pension and net minimum wage (State Data Agency).',
  sh: 'Wages and pensions', srcW: 'Source: State Data Agency (osp.stat.gov.lt) – average monthly wage, old-age pension, minimum monthly wage (annual averages); consumer price index.',
  lw: 'Average net wage, €', lp: 'Average old-age pension, €', lm: 'Net minimum wage, €', lf: 'Average fund value (index)', infL: 'Inflation', retL: 'Fund return', diffL: 'Difference, pp',
} }, { pv3: {
  wH: 'Fondai ir darbo užmokestis', pH: 'Fondai ir pensijos', mH: 'Fondai ir MMA', iH: 'Fondai ir infliacija kasmet', eH: 'Santaupos atlyginimais ir pensijomis',
  what: { w: 'vidutinis neto darbo užmokestis', p: 'vidutinė senatvės pensija', m: 'minimali mėnesinė alga (neto)' },
  cmp: (what, n, a, b, x, f, win) => `Per ${n} ${ltN(n, 'metus', 'metus', 'metų')} (${a}–${b} m.) ${what} išaugo ${x}, o vidutinio pensijų fondo vertė – ${f}, taigi ${win}.`,
  win: { f: 'investicijos augo sparčiau', x: k => `${{ w: 'atlyginimai', p: 'pensijos', m: 'MMA' }[k]} augo sparčiau`, e: 'abu augo panašiu tempu' },
  oth: list => ` ${list[0].toUpperCase() + list.slice(1)}.`, othI: (n, x, f, k) => `per ${n} ${ltN(n, 'metus', 'metus', 'metų')} ${{ w: 'atlyginimai', p: 'pensijos', m: 'MMA' }[k]} išaugo ${x}, fondai – ${f}`,
  inf: (k, n, by, bv, wy, wv) => `${k} iš ${n} metų vidutinė fondų grąža viršijo infliaciją (gruodis prieš gruodį)${by ? `; didžiausias pranašumas – ${by} m. (${bv})` : ''}${wy ? `, didžiausias atsilikimas – ${wy} m. (${wv})` : ''}.`,
  eur: (v, y, a, b, c) => `Vidutinis II pakopos dalyvio sukauptas turtas (${v}) – tai maždaug ${a} vidutinio neto mėnesio atlyginimo, ${b} vidutinės senatvės pensijos${c ? ` arba ${c} neto MMA` : ''} (${y} m.).`,
  calcCmp: 'Augimas = paskutinių metų vidurkis ÷ vidurkis prieš n metų − 1; fondai – sujungta visų fondų svertinė vidutinė grąža (gruodžio 31 d. – gruodžio 31 d.).',
  calcInf: 'Fondų grąža – LB svertinis visų fondų vidurkis per kalendorinius metus; infliacija – vartotojų kainų indeksas gruodį ÷ ankstesnių metų gruodį − 1.',
  calcEur: 'Turtas vienam dalyviui ÷ metų vidutinis neto darbo užmokestis, senatvės pensija ir neto MMA (Valstybės duomenų agentūra).',
  sh: 'Atlyginimai ir pensijos', srcW: 'Šaltinis: Valstybės duomenų agentūra (osp.stat.gov.lt) – vidutinis mėnesinis darbo užmokestis, senatvės pensija, minimali mėnesinė alga (metų vidurkiai); vartotojų kainų indeksas.',
  lw: 'Vidutinis neto darbo užmokestis, €', lp: 'Vidutinė senatvės pensija, €', lm: 'Neto MMA, €', lf: 'Vidutinio fondo vertė (indeksas)', infL: 'Infliacija', retL: 'Fondų grąža', diffL: 'Skirtumas, p. p.',
} });
const JD = () => typeof JDATA !== 'undefined' ? JDATA : {};
const wSer = k => { const J = JD(), o = {}; Object.entries(k === 'w' ? J.wages || {} : k === 'm' ? J.minWage || {} : J.pensions || {}).forEach(([y, v]) => { const x = Array.isArray(v) ? v[1] : v; if (x != null && !(k === 'p' && (J.pensionsQ || {})[y])) o[+y] = x; }); return o; };
const WCOL = { w: 'C', m: 'E', p: 'F' };
function pvWages() {
  const t = T(), X = t.pv3, L = lang === 'lt', pl = MS.pl, d = MS.d, di = dIdx(pl, d), C = chainOf(pl), y0 = +d.slice(0, 4), out = [], ALL = L ? 'Visi fondai' : 'All funds', d0 = MKD.d0;
  const src = `${t.srcLB(pl, d)} ${X.srcW}`, W = `'${X.sh}'`;
  const add = (h, text, calc, nb, o = {}) => out.push({ h, text, calc, src, nums: nb.a, wages: true, ...o });
  const look = (col, y) => `INDEX(${W}!${col}:${col},MATCH(${y},${W}!A:A,0))`;
  /* fondų grandinė tarp metų a ir b Excel'yje: eilutės su metų grąžomis ir vertės indeksu */
  const fundRows = (nb, a, b) => { let p = nb.add(`${L ? 'Vertė' : 'Value'} 31.12.${a}`, 100, () => '100', '0.00');
    for (let y = a + 1; y <= b; y++) { const r = nb.add(`${y} · ${t.thYtd.toLowerCase()} (31.12), %`, C.dec(y), () => fxAvg('C', `DATE(${y},12,31)`, ALL), Zp), p0 = p; p = nb.add(`${L ? 'Vertė' : 'Value'} 31.12.${y}`, C.base[y] / C.base[a] * 100, c => `${c(p0)}*(1+${c(r)}/100)`, '0.00'); }
    return p; };
  ['w', 'p', 'm'].forEach(k => {
    const S = wSer(k), ys = Object.keys(S).map(Number), last = Math.min(y0 - 1, Math.max(...ys)), ok = n => S[last] != null && S[last - n] != null && C.base[last] != null && C.base[last - n] != null;
    const wins = [3, 5, 10].filter(ok); if (!wins.length) return;
    const main = wins.includes(5) ? 5 : wins[wins.length - 1], g = n => S[last] / S[last - n] - 1, f = n => C.base[last] / C.base[last - n] - 1;
    const nb = NB(), a = nb.add(`${X['l' + k]} · ${last - main}`, S[last - main], () => look(WCOL[k], last - main), '0.00'), b = nb.add(`${X['l' + k]} · ${last}`, S[last], () => look(WCOL[k], last), '0.00');
    nb.add(`${X['l' + k]} · ${t.thDy.split(' ')[0].toLowerCase()} ${main} m., %`, g(main), c => `${c(b)}/${c(a)}-1`, Zr);
    const fe = fundRows(nb, last - main, last); nb.add(`${X.lf} · ${main} m., %`, f(main), c => `${c(fe)}/100-1`, Zr);
    const winOf = n => Math.abs(f(n) - g(n)) < 0.02 ? X.win.e : f(n) > g(n) ? X.win.f : X.win.x(k);
    const others = wins.filter(n => n !== main).map(n => X.othI(n, pctPlain(g(n) * 100), pctPlain(f(n) * 100), k));
    add(X[k + 'H'], X.cmp(X.what[k], main, last - main, last, pctPlain(g(main) * 100), pctPlain(f(main) * 100), winOf(main)) + (others.length ? X.oth(others.join('; ')) : ''), X.calcCmp, nb, { wk: k, wy: [Math.min(...wins.map(n => last - n)), last] });
  });
  // infliacija kiekvienais metais
  { const ys = []; for (let y = C.fy; y < y0; y++) if (cpiM(`${y}-12`) != null && cpiM(`${y - 1}-12`) != null && C.dec(y) != null) ys.push(y);
    if (ys.length >= 3) { const nb = NB(), V = `'${t.pv2.vki}'`, inf = y => cpiM(`${y}-12`) / cpiM(`${y - 1}-12`) - 1, df = y => C.dec(y) / 100 - inf(y);
      const flags = ys.map(y => { const r = nb.add(`${y} · ${X.retL}, %`, C.dec(y), () => fxAvg('C', `DATE(${y},12,31)`, ALL), Zp), a = nb.add(`${y} · ${t.pv2.cpiL} 12`, cpiM(`${y}-12`), () => `INDEX(${V}!B:B,MATCH("${y}-12",${V}!A:A,0))`, '0.0000'), b = nb.add(`${y - 1} · ${t.pv2.cpiL} 12`, cpiM(`${y - 1}-12`), () => `INDEX(${V}!B:B,MATCH("${y - 1}-12",${V}!A:A,0))`, '0.0000');
        const i = nb.add(`${y} · ${X.infL}`, inf(y), c => `${c(a)}/${c(b)}-1`, Zr); return nb.add(`${y} · ${X.diffL}`, df(y) * 100, c => `${c(r)}-${c(i)}*100`, Zp); });
      const k = ys.filter(y => df(y) > 0).length, best = ys.reduce((p, q) => df(q) > df(p) ? q : p), worst = ys.reduce((p, q) => df(q) < df(p) ? q : p);
      nb.add(L ? 'Metai, kai grąža viršijo infliaciją' : 'Years return beat inflation', k, c => flags.map(i => `(${c(i)}>0)`).join('+'), '0');
      add(X.iH, X.inf(k, ys.length, df(best) > 0 ? best : '', ppA(df(best) * 100), df(worst) < 0 ? worst : '', ppA(df(worst) * 100)), X.calcInf, nb, { cpi: true, iys: ys }); } }
  // santaupos atlyginimais
  if (pl === 'II') { const T0 = totals(pl, di), per = T0.part ? T0.nav * 1e6 / T0.part : null, w = wSer('w'), p = wSer('p'), m = wSer('m'), yy = Math.max(...Object.keys(w).map(Number).filter(y => p[y] != null));
    if (per && isFinite(yy)) { const nb = NB(), a = nb.add(I_per(), per, c => `${fxNav(d0)}*1000000/${fxPart(d0)}`, Zi);
      const iw = nb.add(`${X.lw} · ${yy}`, w[yy], () => look('C', yy), '0.00'), ip = nb.add(`${X.lp} · ${yy}`, p[yy], () => look('F', yy), '0.00');
      nb.add(L ? 'Atlyginimų' : 'Wages', per / w[yy], c => `${c(a)}/${c(iw)}`, '0.0'); nb.add(L ? 'Pensijų' : 'Pensions', per / p[yy], c => `${c(a)}/${c(ip)}`, '0.0');
      if (m[yy] != null) { const im = nb.add(`${X.lm} · ${yy}`, m[yy], () => look('E', yy), '0.00'); nb.add(L ? 'MMA' : 'Minimum wages', per / m[yy], c => `${c(a)}/${c(im)}`, '0.0'); }
      add(X.eH, X.eur(mEurs(per), yy, num(per / w[yy], 1), num(per / p[yy], 1), m[yy] != null ? num(per / m[yy], 1) : ''), X.calcEur, nb); } }
  return out;
}
const I_per = () => T().ind.per;

/* II ir III pakopa */
function p23Facts() {
  const t = T(), X = t.p23, I = t.ind, L = lang === 'lt', d = MS.d, a2 = dIdx('II', d), a3 = dIdx('III', d), out = [], { d0, dy: Y } = MKD;
  if (a2 < 0 || a3 < 0) return { facts: out, mgr: {} };
  const y2 = dIdx('II', qBack(d, 12)), y3 = dIdx('III', qBack(d, 12)), q2 = dIdx('II', qBack(d, 3)), q3 = dIdx('III', qBack(d, 3)), e3 = dIdx('III', yEnd(d, 1)), e31 = dIdx('III', yEnd(d, 2));
  const T2 = totals('II', a2), T3 = totals('III', a3), src = t.srcLB(lang === 'lt' ? 'II ir III' : 'II and III', d), fin = x => x.replace(/\.\.$/, '.');
  const add = (h, text, calc, nb, o = {}) => out.push({ h, text: text.replace(/\.\.$/, '.'), calc, src, nums: nb.a, other: 'III', ...o });
  const n3 = (R, m) => sumS(OD3, 'F', R, m), p3 = (R, m) => sumS(OD3, 'E', R, m);
  if (y2 >= 0 && y3 >= 0) { const Ty2 = totals('II', y2), Ty3 = totals('III', y3), nb = NB();
    const i = nb.add(`III · ${I.nav}`, T3.nav, () => n3(d0), Zm), j = nb.add(`II · ${I.nav}`, T2.nav, () => fxNav(d0), Zm), r = nb.add(X.rH, T3.nav / T2.nav, c => `${c(i)}/${c(j)}`, Zr);
    const i2 = nb.add(`III · ${I.nav} · ${t.thPrevY.toLowerCase()}`, Ty3.nav, () => n3(Y), Zm), j2 = nb.add(`II · ${I.nav} · ${t.thPrevY.toLowerCase()}`, Ty2.nav, () => fxNav(Y), Zm);
    nb.add(`${X.rH} · ${t.thPrevY.toLowerCase()}`, Ty3.nav / Ty2.nav, c => `${c(i2)}/${c(j2)}`, Zr); void r;
    add(X.rH, X.r(pctPlain(T3.nav / T2.nav * 100, 1), pctPlain(Ty3.nav / Ty2.nav * 100, 1)), X.calcR, nb); }
  const ytdP = (k, m) => { const x = byMgr('III', k); return m ? (x[m] ? x[m].part : null) : totals('III', k).part; };
  if (e3 >= 0 && e31 >= 0 && y3 >= 0) {
    const a = T3.part - totals('III', e3).part, b = totals('III', y3).part - totals('III', e31).part, nb = NB();
    const i0 = nb.add(`III · ${I.part}${' · ' + t.thNow.toLowerCase()}`, T3.part, () => p3(d0), Zi), i1 = nb.add(`III · ${I.part} · ${X.ys}`, totals('III', e3).part, () => p3(YS), Zi);
    const ia = nb.add(`${t.thDy.split(' ')[0]} · ${X.ytd}`, a, c => `${c(i0)}-${c(i1)}`, Zi);
    const j0 = nb.add(`III · ${I.part} · ${t.thPrevY.toLowerCase()}`, totals('III', y3).part, () => p3(Y), Zi), j1 = nb.add(`III · ${I.part} · ${X.ys1}`, totals('III', e31).part, () => p3(YS1), Zi);
    const ib = nb.add(`${t.thDy.split(' ')[0]} · ${X.ly}`, b, c => `${c(j0)}-${c(j1)}`, Zi);
    if (b > 0) nb.add(X.ratio, a / b, c => `${c(ia)}/${c(ib)}`, '0.00');
    add(X.gH, X.g(a, b, b > 0 ? X.gW(a / b) : (L ? 'daugiau nei' : 'more than in')), X.calcG, nb);
  }
  const g2 = gainAt('II', a2), g3 = gainAt('III', a3);
  if (g2 != null && g3 != null && q2 >= 0 && q3 >= 0) { const nb = NB(), Q = MKD.dq;
    const i = nb.add(`III · ${I.nav}`, T3.nav, () => n3(d0), Zm), j = nb.add(`III · ${I.nav} · ${t.thPrevQ.toLowerCase()}`, totals('III', q3).nav, () => n3(Q), Zm), k = nb.add(`III · ${I.gain}`, g3, () => sumS(OD3, 'L', d0), Zm);
    const f3 = T3.nav - totals('III', q3).nav - g3; nb.add(`III · ${L ? 'srautas, mln. €' : 'flow, € m'}`, f3, c => `${c(i)}-${c(j)}-${c(k)}`, Zm);
    const i2 = nb.add(`II · ${I.nav}`, T2.nav, () => fxNav(d0), Zm), j2 = nb.add(`II · ${I.nav} · ${t.thPrevQ.toLowerCase()}`, totals('II', q2).nav, () => fxNav(Q), Zm), k2 = nb.add(`II · ${I.gain}`, g2, () => fxGain(d0), Zm);
    const f2 = T2.nav - totals('II', q2).nav - g2; nb.add(`II · ${L ? 'srautas, mln. €' : 'flow, € m'}`, f2, c => `${c(i2)}-${c(j2)}-${c(k2)}`, Zm);
    add(X.fH, X.f(f3, f2), `${X.calcF} ${t.f.calcGain}`, nb); }
  const mgr = {};
  if (e3 >= 0 && e31 >= 0 && y3 >= 0) {
    const ms = Object.keys(byMgr('III', a3)), ch = ms.map(m => ({ m, a: ytdP(a3, m) - (ytdP(e3, m) || 0), b: ytdP(y3, m) != null && ytdP(e31, m) != null ? ytdP(y3, m) - ytdP(e31, m) : null }));
    const totA = T3.part - totals('III', e3).part, top = [...ch].sort((x, y) => y.a - x.a)[0];
    { const nb = NB(), i = nb.add(`${top.m} · III · ${I.part}`, ytdP(a3, top.m), () => p3(d0, top.m), Zi), j = nb.add(`${top.m} · III · ${I.part} · ${X.ys}`, ytdP(e3, top.m) || 0, () => p3(YS, top.m), Zi);
      const k = nb.add(`${top.m} · ${X.ytd}`, top.a, c => `${c(i)}-${c(j)}`, Zi), i2 = nb.add(`III · ${I.part}`, T3.part, () => p3(d0), Zi), j2 = nb.add(`III · ${I.part} · ${X.ys}`, totals('III', e3).part, () => p3(YS), Zi);
      const k2 = nb.add(`III · ${X.ytd}`, totA, c => `${c(i2)}-${c(j2)}`, Zi); if (totA > 0 && top.a > 0) nb.add(L ? 'Dalis' : 'Share', top.a / totA, c => `${c(k)}/${c(k2)}`, Zr);
      add(X.lH, X.l(top.m, top.a, totA > 0 && top.a > 0 ? pctPlain(top.a / totA * 100, 1) : ''), X.calcL, nb); }
    const acc = ch.filter(x => x.b > 0 && x.a > 0).map(x => ({ ...x, r: x.a / x.b })).sort((x, y) => y.r - x.r);
    if (acc.length > 1 && acc[0].r >= 1.2) { const nb = NB(), list = acc.filter(x => x.r >= 1.2).slice(0, 3);
      acc.forEach(x => { const i = nb.add(`${x.m} · ${X.ytd}`, x.a, () => `${p3(d0, x.m)}-${p3(YS, x.m)}`, Zi), j = nb.add(`${x.m} · ${X.ly}`, x.b, () => `${p3(Y, x.m)}-${p3(YS1, x.m)}`, Zi); nb.add(`${x.m} · ${X.ratio}`, x.r, c => `${c(i)}/${c(j)}`, '0.00'); });
      add(X.aH, X.a(wList(list.map(x => `${x.m} (${L ? `${num(x.r, 1)} karto` : `×${num(x.r, 1)}`})`))), X.calcA, nb); }
    ch.forEach(x => { const nb = NB(), m = x.m, i = nb.add(`${m} · III · ${I.part}`, ytdP(a3, m), () => p3(d0, m), Zi), j = nb.add(`${m} · III · ${I.part} · ${X.ys}`, ytdP(e3, m) || 0, () => p3(YS, m), Zi);
      const ia = nb.add(`${m} · ${X.ytd}`, x.a, c => `${c(i)}-${c(j)}`, Zi);
      if (x.b != null) { const ib = nb.add(`${m} · ${X.ly}`, x.b, () => `${p3(Y, m)}-${p3(YS1, m)}`, Zi); if (x.b > 0 && x.a > 0) nb.add(X.ratio, x.a / x.b, c => `${c(ia)}/${c(ib)}`, '0.00'); }
      (mgr[m] = mgr[m] || []).push({ h: m, text: fin(X.m1(m, x.a, x.b, x.b > 0 && x.a > 0 ? X.acc(x.a / x.b) : '')), calc: X.calcL, src, hl: true, nums: nb.a, other: 'III' }); });
  }
  if (y3 >= 0) { const Ty3 = totals('III', y3), M3 = byMgr('III', a3), My = byMgr('III', y3);
    Object.keys(M3).forEach(m => { if (!My[m]) return; const nb = NB(), s = M3[m].nav / T3.nav * 100, sy = My[m].nav / Ty3.nav * 100;
      const i = nb.add(`${m} · III · ${t.shOf.nav}, %`, s, () => `${n3(d0, m)}/${n3(d0)}*100`, Zp), j = nb.add(`${m} · III · ${t.shOf.nav}, % · ${t.thPrevY.toLowerCase()}`, sy, () => `${n3(Y, m)}/${n3(Y)}*100`, Zp);
      nb.add(`${t.thDy}, ${L ? 'p. p.' : 'pp'}`, s - sy, c => `${c(i)}-${c(j)}`, Zp);
      (mgr[m] = mgr[m] || []).push({ h: m, text: fin(X.m2(m, pctPlain(s, 1), s - sy)), calc: t.fx.calcM5, src, hl: true, nums: nb.a, other: 'III' }); }); }
  { const M2 = byMgr('II', a2), M3 = byMgr('III', a3), all = [...new Set([...Object.keys(M2), ...Object.keys(M3)])], tot = T2.nav + T3.nav;
    const v = all.map(m => ({ m, n2: M2[m] ? M2[m].nav : 0, n3: M3[m] ? M3[m].nav : 0 })).map(x => ({ ...x, s: (x.n2 + x.n3) / tot * 100 })).sort((a, b) => b.s - a.s);
    const nb = NB(), t2 = nb.add(`II · ${I.nav}`, T2.nav, () => fxNav(d0), Zm), t3 = nb.add(`III · ${I.nav}`, T3.nav, () => n3(d0), Zm);
    v.forEach(x => { const i = nb.add(`${x.m} · II · ${I.nav}`, x.n2, () => fxNav(d0, crM(x.m)), Zm), j = nb.add(`${x.m} · III · ${I.nav}`, x.n3, () => n3(d0, x.m), Zm), k = nb.add(`${x.m} · II + III · ${t.thShare}`, x.s / 100, c => `(${c(i)}+${c(j)})/(${c(t2)}+${c(t3)})`, Zr);
      const nb2 = NB(), a = nb2.add(`${x.m} · II · ${I.nav}`, x.n2, () => fxNav(d0, crM(x.m)), Zm), b = nb2.add(`II · ${I.nav}`, T2.nav, () => fxNav(d0), Zm), a3_ = nb2.add(`${x.m} · III · ${I.nav}`, x.n3, () => n3(d0, x.m), Zm), b3 = nb2.add(`III · ${I.nav}`, T3.nav, () => n3(d0), Zm);
      nb2.add(`II · ${t.thShare}`, x.n2 / T2.nav, c => `${c(a)}/${c(b)}`, Zr); nb2.add(`III · ${t.thShare}`, x.n3 / T3.nav, c => `${c(a3_)}/${c(b3)}`, Zr); nb2.add(`II + III · ${t.thShare}`, x.s / 100, c => `(${c(a)}+${c(a3_)})/(${c(b)}+${c(b3)})`, Zr);
      if (x.n2 && x.n3) (mgr[x.m] = mgr[x.m] || []).push({ h: x.m, text: fin(X.m3(x.m, pctPlain(x.n2 / T2.nav * 100, 1), pctPlain(x.n3 / T3.nav * 100, 1), pctPlain(x.s, 1))), calc: X.calcC, src, hl: true, nums: nb2.a, other: 'III' }); void k; });
    add(X.cH, X.c(wList(v.slice(0, 3).map(x => `${x.m} (${pctPlain(x.s, 1)})`))), X.calcC, nb); }
  return { facts: out, mgr };
}
/* išskleidžiama kortelės dalis (savininkas 2026-10-19: „išskleidus kortelę – faktą paremiantis grafikas ar lentelė“):
   grafikas laike (visi ketvirčiai nuo 2015 m.) ir lentelė su visais fakto skaičiais (tie patys kaip Excel faile) */
addStrings({ fmore: 'More: chart and figures', fNoCh: 'Figures behind the fact', fSer: { nav: 'Net assets, € m', part: 'Participants', r1: 'Weighted return over 1 year, %', r5: 'Weighted 5-year annual return, %', gain: 'Investment gain in the quarter, € m', flow: 'Contributions minus payouts in the quarter, € m', per: 'Assets per participant, €', shN: 'Share of assets, %', shP: 'Share of participants, %', beat: 'Funds above group average, %', bm: 'Funds beating benchmark, %', both: 'Pillars II + III assets, € m', ratio: 'Pillar III assets ÷ pillar II, %', p3: 'Pillar III participants', ppg: 'Gain per participant in the quarter, €', hhi: 'HHI' } },
  { fmore: 'Daugiau: grafikas ir skaičiai', fNoCh: 'Fakto skaičiai', fSer: { nav: 'Grynieji aktyvai, mln. €', part: 'Dalyviai', r1: 'Svertinė grąža per 1 metus, %', r5: 'Svertinė 5 metų metinė grąža, %', gain: 'Investicinis prieaugis per ketvirtį, mln. €', flow: 'Įmokų ir išmokų balansas per ketvirtį, mln. €', per: 'Turtas vienam dalyviui, €', shN: 'Turto dalis, %', shP: 'Dalyvių dalis, %', beat: 'Fondai virš grupės vidurkio, %', bm: 'Fondai, lenkę lyginamąjį indeksą, %', both: 'II + III pakopos turtas, mln. €', ratio: 'III pakopos turtas ÷ II pakopos, %', p3: 'III pakopos dalyviai', ppg: 'Prieaugis vienam dalyviui per ketvirtį, €', hhi: 'HHI' } });
const flowAt = (pl, di) => { const d = MKT[pl].dates[di], q = dIdx(pl, qBack(d, 3)), g = gainAt(pl, di); return q < 0 || g == null ? null : totals(pl, di).nav - totals(pl, q).nav - g; };
const shareAt = (pl, di, m, k) => { const x = byMgr(pl, di)[m], T0 = totals(pl, di); return x && T0[k] ? x[k] / T0[k] * 100 : null; };
const avgK = (pl, di, k) => { const a = avgOf(pl, di, -1); return a ? a[MA[k]] : null; };
function beatAt(pl, di, bm) {
  let k = 0, n = 0;
  rowsAt(pl, di).forEach(r => { const v = r[MC.ret_ytd]; if (v == null) return; const ref = bm ? r[MC.bm_ytd] : (avgOf(pl, di, fundOf(pl, r)[2]) || [])[MA.ret_ytd]; if (ref == null) return; n++; if (v > ref) k++; });
  return n > 2 ? k / n * 100 : null;
}
function topMgrs(pl, n = 6) { const di = dIdx(pl, MS.d) >= 0 ? dIdx(pl, MS.d) : MKT[pl].dates.length - 1; return Object.entries(byMgr(pl, di)).sort((a, b) => b[1].nav - a[1].nav).slice(0, n).map(x => x[0]); }
/* grafiko aprašas: {u – vienetai, lines: [{l, pl, fn(di), c}]} */
function chartSpec(f, box) {
  if (f.sp !== undefined) return f.sp;                  // faktas su savo grafiku (mėnesio faktai)
  const t = T(), S = t.fSer, pl = box.dataset.pl || MS.pl, h = f.h, F = t.f, X = t.fx, V = t.pv, Q = t.p23;
  const one = (l, fn, u, p = pl) => ({ u, lines: [{ l, pl: p, fn }] }), mg = (p, k, ms) => ({ u: 'pct', lines: ms.map(m => ({ l: m, pl: p, fn: di => shareAt(p, di, m, k), c: mkColor(m) })) });
  if (box.id === 'miCards' || (f.hl && MK_PROV.includes(h) && box.id !== 'p23Mgr')) return { u: 'pct', lines: [{ l: `${h} · ${S.shN}`, pl, fn: di => shareAt(pl, di, h, 'nav'), c: mkColor(h) }, { l: `${h} · ${S.shP}`, pl, fn: di => shareAt(pl, di, h, 'part'), c: 'var(--text-3)' }] };
  if (box.id === 'p23Mgr') { const m = f.h; return { u: 'int', lines: [{ l: `${m} · ${S.p3}`, pl: 'III', fn: di => (byMgr('III', di)[m] || {}).part || null, c: mkColor(m) }] }; }
  const map = {
    [F.navH]: () => one(S.nav, di => totals(pl, di).nav || null, 'mn'), [X.recH]: () => one(S.nav, di => totals(pl, di).nav || null, 'mn'), [X.grH]: () => one(S.nav, di => totals(pl, di).nav || null, 'mn'),
    [F.partH]: () => one(S.part, di => totals(pl, di).part || null, 'int'), [F.retH]: () => one(S.r1, di => avgK(pl, di, 'ret_1y'), 'pct'), [V.dblH]: () => one(S.r5, di => avgK(pl, di, 'ret_5y'), 'pct'),
    [F.gainH]: () => one(S.gain, di => gainAt(pl, di), 'mn'), [V.dayH]: () => one(S.gain, di => gainAt(pl, di), 'mn'), [X.flowH]: () => ({ u: 'mn', lines: [{ l: S.gain, pl, fn: di => gainAt(pl, di), c: 'var(--s4)' }, { l: S.flow, pl, fn: di => flowAt(pl, di), c: 'var(--s1)' }] }),
    [F.perH]: () => one(S.per, di => { const x = totals(pl, di); return x.part ? x.nav * 1e6 / x.part : null; }, 'eur'),
    [V.ppH]: () => one(S.ppg, di => { const g = gainAt(pl, di), x = totals(pl, di); return g != null && x.part ? g * 1e6 / x.part : null; }, 'eur'),
    [F.mgrH]: () => mg(pl, 'nav', topMgrs(pl)), [F.chgH]: () => mg(pl, 'part', topMgrs(pl)),
    [X.concH]: () => one(S.hhi, di => { const T0 = totals(pl, di); if (!T0.nav) return null; return Object.values(byMgr(pl, di)).reduce((s, x) => s + (x.nav / T0.nav * 100) ** 2, 0); }, 'int'),
    [X.beatH]: () => one(S.beat, di => beatAt(pl, di, false), 'pct'), [X.bmH]: () => one(S.bm, di => beatAt(pl, di, true), 'pct'),
    [F.bothH]: () => one(S.both, di => { const d = MKT[pl].dates[di], o = pl === 'II' ? 'III' : 'II', j = dIdx(o, d); return j < 0 ? null : totals(pl, di).nav + totals(o, j).nav; }, 'mn'),
    [Q.rH]: () => one(S.ratio, di => { const j = dIdx('III', MKT.II.dates[di]); return j < 0 ? null : totals('III', j).nav / totals('II', di).nav * 100; }, 'pct', 'II'),
    [Q.gH]: () => one(S.p3, di => totals('III', di).part || null, 'int', 'III'),
    [Q.fH]: () => ({ u: 'mn', lines: [{ l: `III · ${S.flow}`, pl: 'III', fn: di => flowAt('III', di), c: 'var(--s4)' }, { l: `II · ${S.flow}`, pl: 'II', fn: di => flowAt('II', di), c: 'var(--s1)' }] }),
    [Q.lH]: () => ({ u: 'int', lines: topMgrs('III').map(m => ({ l: m, pl: 'III', fn: di => (byMgr('III', di)[m] || {}).part || null, c: mkColor(m) })) }),
    [Q.aH]: () => ({ u: 'int', lines: topMgrs('III').map(m => ({ l: m, pl: 'III', fn: di => (byMgr('III', di)[m] || {}).part || null, c: mkColor(m) })) }),
    [Q.cH]: () => ({ u: 'pct', lines: topMgrs('II').map(m => ({ l: m, pl: 'II', fn: di => { const d = MKT.II.dates[di], j = dIdx('III', d), a = byMgr('II', di)[m], b = j >= 0 ? byMgr('III', j)[m] : null, T2 = totals('II', di).nav, T3 = j >= 0 ? totals('III', j).nav : 0; return a || b ? ((a ? a.nav : 0) + (b ? b.nav : 0)) / (T2 + T3) * 100 : null; }, c: mkColor(m) })) }),
  };
  const P2 = t.pv2, P3 = t.pv3, C = chainOf(pl), cIdx = di => C.idx[di] ?? null, yd = y => dayOf(`${y}-12-31`);
  Object.assign(map, {
    [P2.cumH]: () => one(S.gain.replace(/ per ketvirtį| in the quarter/, '') + (lang === 'lt' ? ' (sukauptas)' : ' (cumulative)'), di => { let s = 0, n = 0; for (let i = 0; i <= di; i++) { const g = gainAt(pl, i); if (g != null) { s += g; n++; } } return n ? s : null; }, 'mn'),
    [P2.yrH]: () => one(P3.retL + ' (31.12), %', di => MKT[pl].dates[di].slice(5) === '12-31' ? avgK(pl, di, 'ret_ytd') : null, 'pct'),
    [P2.chH]: () => one(P2.idx, cIdx, 'eur'), [P2.ddH]: () => one(P2.idx, cIdx, 'eur'),
    [P2.r3H]: () => one(`${t.th3y}, %`, di => avgK(pl, di, 'ret_3y'), 'pct'),
    [P2.rkH]: () => ({ u: 'pct', lines: (f.gs || []).map((gi, i) => ({ l: `${groupLbl(pl, gi)} · ${t.th5y}`, pl, fn: di => (avgOf(pl, di, gi) || [])[MA.ret_5y] ?? null, c: i ? 'var(--s4)' : 'var(--s1)' })) }),
    [P2.reH]: () => { const d5 = qBack(MS.d, 60), j = dIdx(pl, d5), b = C.idx[j], m5 = d5.slice(0, 7), cb = cpiM(m5);
      return b && cb ? { u: 'int', lines: [{ l: P3.lf, pl, fn: di => MKT[pl].dates[di] >= d5 && C.idx[di] ? C.idx[di] / b * 100 : null }, { l: P2.cpiL, pl, c: 'var(--s6)', fn: di => { const d = MKT[pl].dates[di], c = cpiM(d.slice(0, 7)); return d >= d5 && c ? c / cb * 100 : null; } }] } : null; },
    [P3.iH]: () => ({ u: 'pct', lines: [{ l: P3.retL, pts: (f.iys || []).map(y => [yd(y), C.dec(y)]) }, { l: P3.infL, c: 'var(--s6)', pts: (f.iys || []).map(y => [yd(y), (cpiM(`${y}-12`) / cpiM(`${y - 1}-12`) - 1) * 100]) }] }),
  });
  ['w', 'p', 'm'].forEach(k => { map[P3[k + 'H']] = () => { const S2 = wSer(k), [a, b] = f.wy || [0, 0], ys = []; for (let y = a; y <= b; y++) if (S2[y] != null && C.base[y] != null) ys.push(y);
    return ys.length > 1 ? { u: 'int', lines: [{ l: P3.lf, pts: ys.map(y => [yd(y), C.base[y] / C.base[ys[0]] * 100]) }, { l: `${P3['l' + k].replace(/, €$/, '')} (${ys[0]} = 100)`, c: 'var(--s6)', pts: ys.map(y => [yd(y), S2[y] / S2[ys[0]] * 100]) }] } : null; }; });
  return map[h] ? map[h]() : null;
}
const zFmt = (v, z) => v == null || !isFinite(v) ? '–' : z === 'yyyy-mm-dd' ? new Date((v - 25569) * 864e5).toISOString().slice(0, 10) : z === Zr ? pctPlain(v * 100, 2) : z === Zm ? num(v, 1) : z === Zp ? num(v, 2) : z === '0.000' ? num(v, 3) : z === '0.0' ? num(v, 1) : mInt(v);
/* grafikas su valdikliais pristatymams (savininkas 2026-10-19: „koreguoti – susiaurinti laikotarpį, išimti kurį nors dalyvį“):
   laikotarpis (greiti mygtukai ir nuo–iki), linijos įjungiamos / išjungiamos paspaudus legendą, pavadinimą galima pataisyti (patenka į PNG) */
addStrings({ fcFrom: 'From', fcTo: 'To', fcAll: 'All', fcY: n => `${n} y`, fcTitleH: 'Click to edit the chart title (it goes into the image)', fcLegH: 'Click a line name to hide or show it' },
  { fcFrom: 'Nuo', fcTo: 'Iki', fcAll: 'Visas', fcY: n => `${n} m.`, fcTitleH: 'Paspauskite ir pataisykite grafiko pavadinimą (jis patenka į paveikslėlį)', fcLegH: 'Paspauskite linijos pavadinimą, kad ją paslėptumėte ar parodytumėte' });
const specSer = sp => !sp ? [] : sp.lines.map((L, i) => ({ provider: L.l, color: L.c || `var(--s${i + 1})`, label: L.l, points: L.pts ? L.pts : MKT[L.pl].dates.map((d, di) => { const v = L.fn(di); return v == null || !isFinite(v) || d > MS.d ? null : [dayOf(d), v]; }).filter(Boolean) })).filter(x => x.points.length > 1);
const specFmt = u => ({ mn: v => mMn(v), int: v => mInt(v), pct: v => pctPlain(v, 1), eur: v => mEurs(v) })[u];
function factMore(det) {
  const box = det.closest('.facts'), body = det.querySelector('.fxb'); if (!box || !body) return;
  const fs = det.dataset.m ? (box._byM || {})[det.dataset.m] || [] : [(box._facts || [])[+det.dataset.i]].filter(Boolean); if (!fs.length) return;
  const t = T(), sp = chartSpec(fs[0], box);
  const tbl = f => `<div class="scroll"><table class="at fnum"><tbody>${f.nums.map(n => `<tr><td class="l">${hEsc(n.l)}</td><td>${zFmt(n.v, n.z)}</td></tr>`).join('')}</tbody></table></div>`;
  const tables = fs.length > 1 ? fs.map(f => `<details class="fsub"><summary>${t.fNoCh}: ${hEsc(f.text.length > 70 ? f.text.slice(0, 68) + '…' : f.text)}</summary>${tbl(f)}</details>`).join('') : tbl(fs[0]);
  const ser = specSer(sp);
  if (!ser.length) { body.innerHTML = tables; return; }
  const ds = [...new Set(ser.flatMap(x => x.points.map(p => p[0])))].sort((a, b) => a - b), iso0 = x => new Date(x * 864e5).toISOString().slice(0, 10);
  const st = det._st || (det._st = { from: ds[0], to: ds[ds.length - 1], off: new Set(), title: `${fs[0].h}: ${ser.length > 1 ? ser.map(x => x.label).join(', ') : ser[0].label}` });
  const opt = (v, cur) => ds.map(x => `<option value="${x}"${x === cur ? ' selected' : ''}>${t.dq(iso0(x))}</option>`).join('');
  const span = (ds[ds.length - 1] - ds[0]) / 365.25;
  body.innerHTML = `<div class="fctl"><span class="seg">${[1, 3, 5, 10].filter(n => n < span).map(n => `<button type="button" data-fy="${n}">${t.fcY(n)}</button>`).join('')}<button type="button" data-fy="0">${t.fcAll}</button></span>`
    + `<label class="field">${t.fcFrom} <select data-fr="from">${opt(0, st.from)}</select></label><label class="field">${t.fcTo} <select data-fr="to">${opt(0, st.to)}</select></label></div>`
    + `<h3 class="fct" contenteditable="true" spellcheck="false" title="${t.fcTitleH}">${hEsc(st.title)}</h3><div class="chart fch"></div><div class="legend chips fleg" title="${t.fcLegH}"></div>` + tables;
  const fm = specFmt(sp.u), el = body.querySelector('.fch');
  const draw = () => {
    const on = ser.filter(x => !st.off.has(x.label)).map(x => ({ ...x, points: x.points.filter(p => p[0] >= st.from && p[0] <= st.to) })).filter(x => x.points.length > 1);
    el.querySelectorAll('.ctools').forEach(n => n.remove());
    drawLineChart(el, on, st.from, st.to, { fmt: fm, axisUnit: '', zero: sp.u === 'mn', ml: 70, height: 240, mr: on.length > 1 && el.clientWidth > 560 ? 120 : 16 });
    body.querySelector('.fleg').innerHTML = ser.map(x => `<button type="button" class="chip${st.off.has(x.label) ? ' off' : ''}" data-fl="${hEsc(x.label)}" aria-pressed="${!st.off.has(x.label)}"><i style="background:${x.color}"></i>${hEsc(x.label)}</button>`).join(' ');
    body.querySelectorAll('[data-fr]').forEach(sel => { sel.value = String(st[sel.dataset.fr]); });
    body.querySelectorAll('[data-fy]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.fy ? st.to === ds[ds.length - 1] && Math.abs((st.to - st.from) / 365.25 - +b.dataset.fy) < 0.2 : st.from === ds[0] && st.to === ds[ds.length - 1])));
  };
  body.onclick = e => {
    const y = e.target.closest('[data-fy]'), l = e.target.closest('[data-fl]');
    if (y) { const n = +y.dataset.fy; st.to = ds[ds.length - 1]; st.from = n ? ds.find(x => x >= st.to - n * 365.25 - 5) : ds[0]; draw(); }
    if (l) { const k = l.dataset.fl; if (st.off.has(k)) st.off.delete(k); else if (st.off.size < ser.length - 1) st.off.add(k); draw(); }
  };
  body.onchange = e => { const sel = e.target.closest('[data-fr]'); if (!sel) return; st[sel.dataset.fr] = +sel.value; if (st.from >= st.to) { if (sel.dataset.fr === 'from') st.to = ds[Math.min(ds.length - 1, ds.indexOf(st.from) + 1)]; else st.from = ds[Math.max(0, ds.indexOf(st.to) - 1)]; } draw(); };
  body.querySelector('.fct').oninput = e => { st.title = e.target.textContent; };
  draw();
}
document.addEventListener('toggle', e => { const d = e.target; if (d.classList && d.classList.contains('fmore') && d.open) (typeof exMore === 'function' ? exMore : factMore)(d); }, true);
/* kortelių atvaizdavimas (bendras visiems skirtukams). Savininkas 2026-10-20: „kad būtų lengva kuo greičiau peržvelgti … iš karto rasti
   įdomiausias korteles arba peržvelgti viską“. Kiekviena kortelė: tema, „akį traukia“ žyma (rekordas, neįprastas pokytis – iš visos
   istorijos), mažas grafikas su pavadinimu (tas pats skaičiavimas kaip išskleistoje kortelėje), sakinys su paryškintais skaičiais.
   Virš kortelių – temų filtrai, „Akį traukia“ ir sąrašo vaizdas. */
addStrings({ fu: { all: 'All', hot: '★ Eye-catching', vCards: 'Cards', vList: 'List', src: 'Source and method', none: 'No cards for this filter.',
  tp: { ret: 'Returns', nav: 'Assets and money', part: 'Participants', risk: 'Risk and history', life: 'Prices and wages', mgr: 'Managers', p3: 'Pillars II and III', fee: 'Fees', other: 'Other' },
  hi: y => `Highest since ${y}`, lo: y => `Lowest since ${y}`, bigUp: (p, y) => `Largest ${p} rise since ${y}`, bigDn: (p, y) => `Largest ${p} fall since ${y}`,
  rare: 'One of the largest changes', flip: 'Direction changed', per: { q: 'quarterly', m: 'monthly' }, tip: 'Why it stands out: compared with the whole history of this indicator (the chart of the expanded card, “Full history”).' } },
{ fu: { all: 'Visos', hot: '★ Akį traukia', vCards: 'Kortelės', vList: 'Sąrašas', src: 'Šaltinis ir skaičiavimas', none: 'Šiam filtrui kortelių nėra.',
  tp: { ret: 'Grąža', nav: 'Turtas ir pinigai', part: 'Dalyviai', risk: 'Rizika ir istorija', life: 'Kainos ir atlyginimai', mgr: 'Valdytojai', p3: 'II ir III pakopa', fee: 'Mokesčiai', other: 'Kita' },
  hi: y => `Daugiausia nuo ${y} m.`, lo: y => `Mažiausiai nuo ${y} m.`, bigUp: (p, y) => `Didžiausias ${p} augimas nuo ${y} m.`, bigDn: (p, y) => `Didžiausias ${p} kritimas nuo ${y} m.`,
  rare: 'Vienas didžiausių pokyčių', flip: 'Pasikeitė kryptis', per: { q: 'ketvirčio', m: 'mėnesio' }, tip: 'Kodėl išsiskiria: lyginama su visa šio rodiklio istorija (išskleistos kortelės grafikas, „Visa istorija“).' } });
function topicOf(f) {
  if (f.tp) return f.tp;
  const t = T(), F = t.f, X = t.fx, V = t.pv, V2 = t.pv2, V3 = t.pv3, Q = t.p23, M = t.mf, m = topicOf.m || (topicOf.m = {});
  if (m._l !== lang) { Object.keys(m).forEach(k => delete m[k]); m._l = lang;
    const set = (tp, hs) => hs.forEach(h => { if (h && !m[h]) m[h] = tp; });
    set('nav', [F.navH, X.flowH, F.gainH, X.recH, X.grH, F.perH, V.dayH, V.ppH, V2.cumH, M.hG]);
    set('part', [F.partH, F.chgH]);
    set('ret', [F.retH, F.lcH, X.beatH, X.bmH, V.k1H, V.dblH, V.hiH, V2.chH, M.hR, M.hL, M.hS, M.hY, M.hW, M.hH, M.hP, M.h3, M.h3y]);
    set('risk', [V2.yrH, V2.ddH, V2.r3H, V2.rkH]);
    set('life', [V2.reH, V3.wH, V3.pH, V3.mH, V3.iH, V3.eH]);
    set('mgr', [F.mgrH, X.concH, Q.cH, Q.lH, Q.aH]);
    set('p3', [F.bothH, Q.rH, Q.gH, Q.fH]); }
  return m[f.h] || 'other';
}
/* kortelės grafikas ir „akį traukia“ – iš to paties tyrimo modelio (exOf / EXK) */
function exDefault(f, box, full) {
  const sp = exOf(f, box); if (!sp || !EXK[sp.k] || (sp.k.startsWith('m') && !MFD)) return null;
  const K = EXK[sp.k], o = K.init(sp);
  if (full) { if (!['lvl', 'flow', 'mser'].includes(sp.k)) return null; o.a = sp.k === 'lvl' ? 0 : 1; o.view = sp.k === 'lvl' ? 'line' : sp.k === 'flow' ? 'q' : sp.key === 'nav' ? 'm' : 'm'; if (o.who === 'm') return null; }
  const r = K.run(sp, o); return r ? { sp, r } : null;
}
function hotOf(f, box) {
  if (f.hot !== undefined) return f.hot;
  let x = null; try { x = exDefault(f, box, true); } catch (e) { return null; }
  if (!x || !x.r.ch) return null;
  const ch = x.r.ch, U = T().fu, per = U.per[x.sp.k === 'mser' ? 'm' : 'q'];
  let v, y0;
  if (ch.t === 'line') { const s = ch.ser.find(s => s.pts.length > 1); if (!s || ch.ser.filter(s => s.pts.length > 1).length > 1) return null; v = s.pts.map(p => p[1]); y0 = new Date(s.pts[0][0] * 864e5).getUTCFullYear(); }
  else if (ch.t === 'cols') { if (ch.ser.length !== 1) return null; v = ch.ser[0].v; y0 = String(ch.cats[0]).slice(0, 4); }
  else return null;
  v = v.filter(z => z != null && isFinite(z)); const n = v.length; if (n < 8) return null;
  const last = v[n - 1], prev = v.slice(0, -1), flow = ch.t === 'cols';
  if (last > Math.max(...prev)) return { s: 3, l: U.hi(y0) };
  if (last < Math.min(...prev)) return { s: 3, l: U.lo(y0) };
  if (!flow) { const d = v.slice(1).map((z, i) => z - v[i]), dl = d[d.length - 1], ad = d.map(Math.abs).sort((a, b) => b - a);
    if (Math.abs(dl) >= ad[0] && dl) return { s: 2.5, l: dl > 0 ? U.bigUp(per, y0) : U.bigDn(per, y0) };
    if (d.length >= 10 && Math.abs(dl) >= ad[Math.floor(d.length / 10)] && dl) return { s: 1.5, l: U.rare }; }
  else { const a = [...v].map(Math.abs).sort((p, q) => q - p); if (n >= 10 && Math.abs(last) >= a[Math.floor(n / 10)]) return { s: 1.5, l: U.rare };
    if (prev.slice(-4).every(z => Math.sign(z) === -Math.sign(last)) && last) return { s: 1.2, l: U.flip }; }
  return null;
}
/* mažas grafikas: linija, stulpeliai arba horizontalūs stulpeliai; be ašių, su pavadinimu */
function miniSvg(ch) {
  const W = 300, H = 64, P = 4; let s = '';
  if (ch.t === 'line') {
    const ss = ch.ser.filter(x => x.pts.length > 1).slice(0, 4); if (!ss.length) return '';
    const xs = ss.flatMap(x => x.pts.map(p => p[0])), ys = ss.flatMap(x => x.pts.map(p => p[1])), x0 = Math.min(...xs), x1 = Math.max(...xs);
    let y0 = Math.min(...ys), y1 = Math.max(...ys); if (y0 === y1) { y0 -= 1; y1 += 1; }
    const X = x => P + (x - x0) / (x1 - x0 || 1) * (W - 2 * P - 4), Y = y => P + (y1 - y) / (y1 - y0) * (H - 2 * P);
    if (y0 < 0 && y1 > 0) s += `<line x1="${P}" x2="${W - P}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--axis);stroke-width:1"/>`;
    ss.forEach(x => { const pts = x.pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' '), l = x.pts[x.pts.length - 1];
      s += `<polyline points="${pts}" style="fill:none;stroke:${x.c};stroke-width:2;stroke-linejoin:round"/><circle cx="${X(l[0])}" cy="${Y(l[1])}" r="3" style="fill:${x.c}"/>`; });
  } else if (ch.t === 'cols') {
    const n0 = ch.cats.length, k0 = Math.max(0, n0 - 16), cats = ch.cats.slice(k0), ser = ch.ser.slice(0, 3).map(x => ({ ...x, v: x.v.slice(k0) })), vs = ser.flatMap(x => x.v).filter(v => v != null && isFinite(v));
    if (!vs.length) return ''; const lo = Math.min(0, ...vs), hi = Math.max(0, ...vs) || 1, Y = v => P + (hi - v) / (hi - lo || 1) * (H - 2 * P), bw = (W - 2 * P) / cats.length, w1 = bw * 0.8 / ser.length;
    cats.forEach((c, i) => ser.forEach((x, j) => { const v = x.v[i]; if (v == null || !isFinite(v)) return; const col = ch.sign && ser.length === 1 ? (v >= 0 ? 'var(--dpos)' : 'var(--dneg)') : x.c;
      s += `<rect x="${(P + i * bw + bw * 0.1 + j * w1).toFixed(1)}" y="${Math.min(Y(0), Y(v)).toFixed(1)}" width="${Math.max(1, w1 - 1).toFixed(1)}" height="${Math.max(1, Math.abs(Y(v) - Y(0))).toFixed(1)}" style="fill:${col}"/>`; }));
    s += `<line x1="${P}" x2="${W - P}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--axis);stroke-width:1"/>`;
  } else if (ch.t === 'hbar') {
    const rows = ch.rows.slice(0, 5), vs = rows.map(r => r.v).filter(v => v != null && isFinite(v)); if (!vs.length) return '';
    const lo = Math.min(0, ...vs), hi = Math.max(0, ...vs) || 1, rh = (H - 2) / rows.length, lw = 92, X = v => lw + (v - lo) / (hi - lo || 1) * (W - lw - 6);
    rows.forEach((r, i) => { if (r.v == null) return; const y = 1 + i * rh;
      s += `<text x="${lw - 5}" y="${(y + rh * 0.72).toFixed(1)}" style="fill:var(--text-3);font-size:${Math.min(11, rh * 0.8).toFixed(1)}px;text-anchor:end">${svgEsc(String(r.l).slice(0, 16))}</text><rect x="${Math.min(X(0), X(r.v)).toFixed(1)}" y="${(y + rh * 0.15).toFixed(1)}" width="${Math.max(1, Math.abs(X(r.v) - X(0))).toFixed(1)}" height="${(rh * 0.7).toFixed(1)}" rx="2" style="fill:${r.c || 'var(--s1)'}"/>`; });
  }
  return s ? `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-hidden="true">${s}</svg>` : '';
}
function miniOf(f, box) { let x = null; try { x = exDefault(f, box, false); } catch (e) { return ''; } if (!x || !x.r.ch) return '';
  const g = miniSvg(x.r.ch); return g ? `<div class="fmini">${g}<span>${hEsc(x.r.title)}</span></div>` : ''; }
/* skaičiai su vienetais paryškinami (greitam peržvelgimui); tekstas kopijuojamas be žymų */
const boldNums = s => hEsc(s).replace(/(?<![(\d,.  −])−?\d[\d  .,]*(?:\s?(?:%|p\. p\.|pp|mlrd\. €|mln\. €|bn €|m €|€|karto))(?![\w])/g, m => `<b>${m}</b>`);
const FU = { view: matchMedia('(max-width: 640px)').matches ? 'list' : 'cards', f: {} };
try { Object.assign(FU, JSON.parse(localStorage.getItem('factUi') || '{}')); } catch (e) {}
const fuSave = () => { try { localStorage.setItem('factUi', JSON.stringify(FU)); } catch (e) {} };
function factTool(el) {
  const U = T().fu, fs = el._facts, id = el.id, cur = FU.f[id] || '', cnt = {}; fs.forEach(f => { cnt[f._tp] = (cnt[f._tp] || 0) + 1; });
  const nh = fs.filter(f => f._hot).length, tps = Object.keys(U.tp).filter(k => cnt[k]);
  let tb = el.previousElementSibling; if (!tb || !tb.classList.contains('ftool')) { tb = document.createElement('div'); tb.className = 'ftool'; el.before(tb); }
  const chip = (k, l, n) => `<button type="button" class="chip" data-ff="${k}" aria-pressed="${cur === k}">${hEsc(l)} <em>${n}</em></button>`;
  tb.innerHTML = `<div class="chips">${chip('', U.all, fs.length)}${nh ? chip('*', U.hot, nh).replace('class="chip"', 'class="chip hotc"') : ''}${tps.length > 1 ? tps.map(k => chip(k, U.tp[k], cnt[k])).join('') : ''}</div>`
    + `<span class="seg"><button type="button" data-fv="cards" aria-pressed="${FU.view !== 'list'}">${U.vCards}</button><button type="button" data-fv="list" aria-pressed="${FU.view === 'list'}">${U.vList}</button></span>`;
  tb.onclick = e => { const a = e.target.closest('[data-ff]'), v = e.target.closest('[data-fv]');
    if (a) { FU.f[id] = a.dataset.ff; fuSave(); factTool(el); }
    if (v) { FU.view = v.dataset.fv; fuSave(); document.querySelectorAll('.facts').forEach(b => { b.classList.toggle('flist', FU.view === 'list'); if (b.previousElementSibling && b.previousElementSibling.classList.contains('ftool')) factTool(b); }); } };
  el.classList.toggle('flist', FU.view === 'list');
  const arts = [...el.children]; let shown = 0;
  arts.forEach((a, i) => { const f = fs[i]; if (!f) return; const ok = !cur || (cur === '*' ? f._hot : f._tp === cur); a.hidden = !ok; if (ok) shown++; a.style.order = cur === '*' && f._hot ? String(-Math.round(f._hot.s * 10)) : ''; });
  let na = el.querySelector(':scope > p.na'); if (!shown) { if (!na) { na = document.createElement('p'); na.className = 'na'; el.append(na); } na.textContent = U.none; } else if (na) na.remove();
}
function factCards(el, fs, title, pl) {
  const t = T(), U = t.fu; el._facts = fs; el.dataset.title = title; el.dataset.pl = pl;
  fs.forEach(f => { f._tp = topicOf(f); f._hot = hotOf(f, el); });
  el.innerHTML = fs.map((f, i) => `<article class="fact${f.hl ? ' hl' : ''}${f._hot ? ' hot' : ''}" data-tp="${f._tp}"><div class="ftop"><span class="ftp">${U.tp[f._tp].toLowerCase() === f.h.toLowerCase() ? '' : hEsc(U.tp[f._tp])}</span>${f._hot ? `<span class="fhot" title="${hEsc(U.tip)}">★ ${hEsc(f._hot.l)}</span>` : ''}</div>`
    + `<span class="fh">${hEsc(f.h)}</span>${miniOf(f, el)}<p>${boldNums(f.text)}</p><details class="fsrc"><summary>${U.src}</summary><small>${hEsc(f.src)} ${t.how} ${hEsc(f.calc)}</small></details>`
    + `<details class="fmore" data-i="${i}"><summary>${t.fmore}</summary><div class="fxb"></div></details><div class="fbtn"><button type="button" class="btn" data-fact="${i}">${t.copy}</button><button type="button" class="btn xl" data-fx="${i}" title="${t.tXl}">${t.fx.xl}</button></div></article>`).join('');
  factTool(el);
}
function mgrCards(el, byM, title, pl) {
  const t = T(), ms = Object.keys(byM); el._facts = ms.flatMap(m => byM[m]); el._byM = byM; el.dataset.title = title; el.dataset.pl = pl;
  el.innerHTML = ms.map(m => `<article class="fact mi${m === MS.mgr ? ' hl' : ''}"><span class="fh"><i class="sw" style="background:${mkColor(m)}"></i>${hEsc(m)}</span><ul>${byM[m].map(f => `<li>${hEsc(f.text)}</li>`).join('')}</ul><small>${hEsc(byM[m][0] ? byM[m][0].src : '')}</small><details class="fmore" data-m="${hEsc(m)}"><summary>${t.fmore}</summary><div class="fxb"></div></details><div class="fbtn"><button type="button" class="btn" data-mcp="${hEsc(m)}">${t.copy}</button><button type="button" class="btn xl" data-mxl="${hEsc(m)}" title="${t.tXl}">${t.fx.xl}</button></div></article>`).join('');
}
function renderPv() {
  const t = T(), el = document.getElementById('pvCards'); if (!el) return;
  document.getElementById('pvTitle').textContent = t.pv.title; document.getElementById('pvLead').textContent = t.pv.lead;
  document.getElementById('pvBar').innerHTML = mkBar();
  factCards(el, pvFacts(), t.pv.title, MS.pl);
  document.getElementById('pvAll').textContent = t.copyAll; document.getElementById('pvXl').textContent = t.fx.xlAll;
}
function renderP23() {
  const t = T(), X = t.p23, el = document.getElementById('p23Cards'); if (!el) return;
  ['title', 'lead', 'miTitle'].forEach(k => { document.getElementById('p23' + k[0].toUpperCase() + k.slice(1)).textContent = X[k]; });
  const keep = MS.pl; MS.pl = 'II'; document.getElementById('p23Bar').innerHTML = mkBar(); MS.pl = keep;
  const r = p23Facts();
  ['p23All', 'p23Xl', 'p23MXl'].forEach((id, i) => { document.getElementById(id).textContent = i ? t.fx.xlAll : t.copyAll; });
  factCards(el, r.facts, X.title, 'II');
  const ord = Object.keys(r.mgr).sort((a, b) => ((byMgr('II', dIdx('II', MS.d))[b] || {}).nav || 0) + ((byMgr('III', dIdx('III', MS.d))[b] || {}).nav || 0) - ((byMgr('II', dIdx('II', MS.d))[a] || {}).nav || 0) - ((byMgr('III', dIdx('III', MS.d))[a] || {}).nav || 0));
  mgrCards(document.getElementById('p23Mgr'), Object.fromEntries(ord.map(m => [m, r.mgr[m]])), X.miTitle, 'II');
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
  ['qfNote', 'mkNote', 'mgNote', 'fdNote', 'pvNote', 'p23Note'].forEach(id => { document.getElementById(id).textContent = t.noteLB; });
  document.getElementById('mkGainN').textContent = t.noteGain;
  ['qfBar', 'mkBar', 'mgBar'].forEach(id => { document.getElementById(id).innerHTML = mkBar(); });
  renderFacts(); renderMf(); if (typeof renderEarn === 'function') renderEarn(); if (typeof renderNews === 'function') renderNews(); renderPv(); renderP23(); renderTime(); renderMgr(); renderMgrCards(); renderBrag(); renderFunds(); renderTd();
  if (typeof srcLines === 'function') srcLines();
}
function mkTabs() {
  const t = T(); addSubnav([['tdTitle', t.tdTitle], ['nwTitle', t.nw.title], ['qfTitle', t.qfTitle], ['mfTitle', t.mf.title], ['euTitle', t.eu.title], ['pvTitle', t.pv.title], ['p23Title', t.p23.title], ['mkTitle', t.mkTitle], ['mgTitle', t.mgTitle], ['fdTitle', t.fdTitle]].map(([id, label]) => ({ id, label })));
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
  hdr.push(...(L ? ['Standartinis nuokrypis 3 m., %', 'BAR, %', 'BIK, %'] : ['Standard deviation 3 y, %', 'BAR, %', 'BIK, %'])); step.push(...(L ? ['LB failas', 'LB failas', 'LB failas'] : ['BoL file', 'BoL file', 'BoL file']));
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
        xF(`IF(OR(I${n}="",F${n}=""),0,F${n}*I${n})`, q != null && r[MC.nav] ? r[MC.nav] * q : 0, '0.00'), xF(`IF(OR(I${n}="",F${n}=""),0,F${n})`, q != null && r[MC.nav] ? r[MC.nav] : 0, '0.000'), xIn(r[MC.std_3y], '0.00'), xIn(r[MC.bar], '0.00'), xIn(r[MC.bik], '0.00')]);
    });
  });
  const av = [xHdr(L ? ['Ketvirčio pabaiga', 'Grupė', 'Grąža nuo metų pradžios, %', 'Grąža per 1 m., %', 'Grąža per 3 m., %', 'Grąža per 5 m., %', 'Nuo veiklos pradžios, %', 'Lyginamasis indeksas nuo metų pradžios, %'] : ['Quarter end', 'Group', 'Return since year start, %', 'Return 1 y, %', 'Return 3 y, %', 'Return 5 y, %', 'Since start, %', 'Benchmark since year start, %'])];
  const avPos = new Map(), ALL = L ? 'Visi fondai' : 'All funds';
  P.avgs.forEach(a => { avPos.set(a[0] * 100 + a[1], av.length + 1); av.push([xDate(P.dates[a[0]]), a[1] < 0 ? ALL : groupLbl(pl, a[1]), ...['ret_ytd', 'ret_1y', 'ret_3y', 'ret_5y', 'ret_gcf', 'bm_ytd'].map(k => xIn(a[MA[k]], '0.00'))]); });
  return { pos, avPos, ALL, n: rows.length, sheets: [{ name: L ? 'LB duomenys' : 'LB duomenys', rows, o: { cols: [12, 11, 46, 22, 11, 12, 11, 13, 11, 12, 12, 12, 10, 10, 10, 10, 11, 10, 12, 12, 11, 9, 9], freeze: { r: 2, c: 3 }, filter: `A1:W${rows.length}` } },
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
  const L = lang === 'lt', t = T(), pl = MS.pl, m = MS.mgr, S = mkSeries(), cm = m ? [crM(m)] : [];
  return mkBookOut(pl, X => {
    const res = [[{ v: `${t.mkTitle} · ${pl} ${L ? 'pakopa' : 'pillar'}${m ? ' · ' + m : ''}`, s: 'title' }], [{ v: t.srcLB(pl, MKT[pl].dates[MKT[pl].dates.length - 1]), s: 'sub' }],
      xHdr([t.thDate, t.thPart, t.thDq, t.thDy, t.thNav, t.thDq, t.thDy, t.thPer, ...(m ? [t.shOf.nav, t.shOf.part, ''] : [t.thYtd, t.thQ, t.th1y]), t.thGain])];
    [...S].reverse().filter(s => s.nf).forEach(s => {
      const r = res.length + 1, q = S[dIdx(pl, qBack(s.d, 3))], y = S[dIdx(pl, qBack(s.d, 12))], A = `A${r}`;
      const prev = (col, k) => S_(col, byD(`EOMONTH(${A},-${k})`), ...cm);
      if (m) { res.push([xDate(s.d), xF(S_('E', byD(A), ...cm), s.part, '#,##0', 'res'), q ? xF(`B${r}-${prev('E', 3)}`, s.part - q.part, '#,##0') : null, y ? xF(`B${r}-${prev('E', 12)}`, s.part - y.part, '#,##0') : null,
        xF(S_('F', byD(A), ...cm), s.nav, '#,##0.0', 'res'), q && q.nav ? xF(`E${r}/${prev('F', 3)}-1`, s.nav / q.nav - 1, '0.00%') : null, y && y.nav ? xF(`E${r}/${prev('F', 12)}-1`, s.nav / y.nav - 1, '0.00%') : null,
        s.per == null ? null : xF(`IF(B${r}=0,"",E${r}*1000000/B${r})`, s.per, '#,##0'), s.shN == null ? null : xF(`E${r}/${S_('F', byD(A))}`, s.shN / 100, '0.00%', 'res'), s.shP == null ? null : xF(`B${r}/${S_('E', byD(A))}`, s.shP / 100, '0.00%', 'res'), null,
        s.gain == null ? null : xF(S_('L', byD(A), ...cm), s.gain, '#,##0.0', 'res')]); return; }
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
const oth0 = (facts, pl) => facts.some(f => f.other && f.other !== pl) ? (lang === 'lt' ? 'II ir III pakopa' : 'pillars II and III') : `${pl} ${lang === 'lt' ? 'pakopa' : 'pillar'}`;
async function mkFactBook(facts, title, pl = MS.pl) {
  const L = lang === 'lt', t = T(), X0 = t.fx, d = MS.d, X = mkDataSheets(pl), wb = XL.book(), dv = s => dayOf(s) + 25569;
  const res = [[{ v: `${title} · ${oth0(facts, pl)} · ${d}`, s: 'title' }], [{ v: `${t.srcLB(pl, d)} https://www.lb.lt/lt/pf-veiklos-rodikliai`, s: 'sub' }], [{ v: X0.dates, s: 'b' }],
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
  if (facts.some(f => f.cpi) && typeof CPI !== 'undefined') XL.sheet(wb, t.pv2.vki, [xHdr([L ? 'Mėnuo' : 'Month', t.pv2.cpiL]), ...Object.entries(CPI).map(([m, v]) => [{ v: m, s: 'in' }, { v, z: '0.0000', s: 'in' }]),
    [], [{ v: L ? 'Šaltinis: Valstybės duomenų agentūra, vartotojų kainų indeksas, https://osp.stat.gov.lt' : 'Source: State Data Agency, consumer price index, https://osp.stat.gov.lt', s: 'note' }]], { cols: [12, 22], freeze: { r: 1 } });
  if (facts.some(f => f.wages)) { const J = JD(), X3 = t.pv3, ys = [...new Set([...Object.keys(J.wages || {}), ...Object.keys(J.pensions || {}), ...Object.keys(J.minWage || {})])].sort();
    XL.sheet(wb, X3.sh, [xHdr([L ? 'Metai' : 'Year', L ? 'Vid. bruto DU, €' : 'Avg gross wage, €', X3.lw, L ? 'Bruto MMA, €' : 'Gross min. wage, €', X3.lm, X3.lp]),
      ...ys.map(y => { const w = (J.wages || {})[y] || [], m = (J.minWage || {})[y] || [], p = (J.pensionsQ || {})[y] ? null : (J.pensions || {})[y]; const c = v => v == null ? null : { v, z: '0.00', s: 'in' }; return [{ v: +y, s: 'in' }, c(w[0]), c(w[1]), c(m[0]), c(m[1]), c(p)]; }),
      [], [{ v: X3.srcW, s: 'note' }], [{ v: L ? 'Pensija – tik pilni metai (einamųjų metų ketvirčių vidurkis nerodomas).' : 'Pension – full years only.', s: 'note' }]], { cols: [8, 16, 18, 14, 14, 18], freeze: { r: 1 } }); }
  const oth = [...new Set(facts.map(f => f.other).filter(o => o && o !== pl))];
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

/* ---------- Ketvirčio apžvalgos juodraštis vienu paspaudimu (savininkas 2026-10-19: „Ok. Gali dirbti“ – IDEAS.md) ----------
   Word (.docx) failas iš tų pačių faktų kaip kortelėse: svarbiausia, II pakopos rinka, valdytojai, III pakopa, II ir III pakopa,
   faktai visuomenei, pagrindinių rodiklių lentelės ir grafikai (PNG). Po kiekvienu faktu – kaip skaičiuota; skaičius galima patikrinti
   „Excel su skaičiavimais“. Kuriama naršyklėje be išorinių bibliotekų (XL.zip), todėl veikia ir be interneto. */
addStrings({ rv: { btn: 'Review draft (Word)', btnT: 'Download a quarterly review draft in Word: the same facts as the cards, key tables and charts. Edit it before publishing.',
  title: q => `Pension fund market review: ${q}`, qn: d => `Q${Math.ceil(+d.slice(5, 7) / 3)} ${d.slice(0, 4)}`,
  sub: (d, g) => `Draft generated on ${g} from Bank of Lithuania quarterly results (${d}). Check figures in the “Quarter facts” Excel file before publishing; edit the wording as needed.`,
  top: 'Key points', s2: 'Pillar II market', s2m: 'Pillar II managers', s3: 'Pillar III market', s23: 'Pillar II and III', spv: 'Facts for the public', sKey: p => `Key indicators, pillar ${p}`, sMt: p => `Managers, pillar ${p}`, sSrc: 'Sources and method',
  how: 'How calculated: ', mh: ['Manager', 'Participants', 'Net assets, € m', 'Share of assets', 'Change in assets, quarter'],
  peer: 'Funds are compared only within their peer groups: life-cycle funds by birth-year group, asset-preservation funds with each other. Returns are Bank of Lithuania weighted averages; fees are already deducted from unit values.',
  file: q => `Pension market review ${q}` } },
{ rv: { btn: 'Apžvalgos juodraštis (Word)', btnT: 'Atsisiųsti ketvirčio apžvalgos juodraštį Word formatu: tie patys faktai kaip kortelėse, pagrindinės lentelės ir grafikai. Prieš skelbdami pataisykite.',
  title: q => `Pensijų fondų rinkos apžvalga: ${q}`, qn: d => `${d.slice(0, 4)} m. ${ROMAN[Math.ceil(+d.slice(5, 7) / 3) - 1]} ketvirtis`,
  sub: (d, g) => `Juodraštis sugeneruotas ${g} iš Lietuvos banko ketvirčio rezultatų (${d}). Prieš skelbdami patikrinkite skaičius „Ketvirčio faktų“ Excel faile ir pataisykite formuluotes.`,
  top: 'Svarbiausia', s2: 'II pakopos rinka', s2m: 'II pakopos valdytojai', s3: 'III pakopos rinka', s23: 'II ir III pakopa', spv: 'Faktai visuomenei', sKey: p => `Pagrindiniai rodikliai, ${p} pakopa`, sMt: p => `Valdytojai, ${p} pakopa`, sSrc: 'Šaltiniai ir metodika',
  how: 'Kaip skaičiuota: ', mh: ['Valdytojas', 'Dalyviai', 'Grynieji aktyvai, mln. €', 'Turto dalis', 'Turto pokytis per ketvirtį'],
  peer: 'Fondai lyginami tik savo grupėse: gyvenimo ciklo – pagal gimimo metų grupę, turto išsaugojimo – tarpusavyje. Grąžos – Lietuvos banko svertiniai vidurkiai; valdymo mokesčiai jau atskaityti iš vieneto vertės.',
  file: q => `Pensijų rinkos apžvalga ${q}` } });
const DX = (() => {
  const x = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const run = (t, o = {}) => `<w:r>${o.b || o.c || o.sz ? `<w:rPr>${o.b ? '<w:b/>' : ''}${o.c ? `<w:color w:val="${o.c}"/>` : ''}${o.sz ? `<w:sz w:val="${o.sz}"/>` : ''}</w:rPr>` : ''}<w:t xml:space="preserve">${x(t)}</w:t></w:r>`;
  const p = (runs, st, num) => `<w:p>${st || num ? `<w:pPr>${st ? `<w:pStyle w:val="${st}"/>` : ''}${num ? '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>' : ''}</w:pPr>` : ''}${typeof runs === 'string' ? run(runs) : runs.join('')}</w:p>`;
  const cell = (t, h, w) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${h ? '<w:shd w:val="clear" w:color="auto" w:fill="2F6B5A"/>' : ''}</w:tcPr><w:p><w:pPr><w:spacing w:before="20" w:after="20"/></w:pPr>${run(t, h ? { b: 1, c: 'FFFFFF', sz: 18 } : { sz: 18 })}</w:p></w:tc>`;
  const table = (head, rows) => { const n = head.length, w0 = 2600, w = Math.floor((9000 - w0) / (n - 1)), ws = head.map((_, i) => i ? w : w0);
    return `<w:tbl><w:tblPr><w:tblStyle w:val="Lentele"/><w:tblW w:w="9000" w:type="dxa"/></w:tblPr><w:tblGrid>${ws.map(v => `<w:gridCol w:w="${v}"/>`).join('')}</w:tblGrid>`
      + [head, ...rows].map((r, i) => `<w:tr>${i ? '' : '<w:trPr><w:tblHeader/></w:trPr>'}${r.map((c, j) => cell(c == null ? '–' : c, !i, ws[j])).join('')}</w:tr>`).join('') + '</w:tbl>' + p('', 'Small'); };
  const img = (rid, n, wPx, hPx) => { const cx = 5760000, cy = Math.round(cx * hPx / wPx);
    return `<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="${n}" name="Grafikas ${n}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${n}" name="grafikas${n}.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`; };
  const sty = (id, name, rpr, ppr = '', based = 'Normal') => `<w:style w:type="paragraph" w:styleId="${id}"><w:name w:val="${name}"/><w:basedOn w:val="${based}"/><w:next w:val="Normal"/><w:qFormat/>${ppr ? `<w:pPr>${ppr}</w:pPr>` : ''}<w:rPr>${rpr}</w:rPr></w:style>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">`
    + '<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:lang w:val="lt-LT"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
    + '<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>'
    + sty('Title', 'Title', '<w:b/><w:color w:val="2F6B5A"/><w:sz w:val="40"/>', '<w:spacing w:after="80"/>')
    + sty('Heading1', 'heading 1', '<w:b/><w:color w:val="2F6B5A"/><w:sz w:val="30"/>', '<w:keepNext/><w:spacing w:before="360" w:after="120"/><w:outlineLvl w:val="0"/>')
    + sty('Heading2', 'heading 2', '<w:b/><w:color w:val="333333"/><w:sz w:val="24"/>', '<w:keepNext/><w:spacing w:before="240" w:after="80"/><w:outlineLvl w:val="1"/>')
    + sty('Small', 'Small', '<w:color w:val="777777"/><w:sz w:val="17"/>', '<w:spacing w:after="160"/>')
    + sty('ListParagraph', 'List Paragraph', '', '<w:ind w:left="360" w:hanging="260"/><w:spacing w:after="60"/>')
    + '<w:style w:type="table" w:styleId="Lentele"><w:name w:val="Lentele"/><w:tblPr><w:tblBorders><w:top w:val="single" w:sz="4" w:color="BBBBBB"/><w:bottom w:val="single" w:sz="4" w:color="BBBBBB"/><w:insideH w:val="single" w:sz="4" w:color="DDDDDD"/></w:tblBorders><w:tblCellMar><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style></w:styles>';
  const numbering = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="260"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>';
  async function save(body, imgs, filename, title) {
    const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="${W}" xmlns:r="${R}" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
    const files = {
      '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>',
      '_rels/.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${R}/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
      'docProps/core.xml': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${x(title)}</dc:title><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`,
      'word/_rels/document.xml.rels': `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdS" Type="${R}/styles" Target="styles.xml"/><Relationship Id="rIdN" Type="${R}/numbering" Target="numbering.xml"/>${imgs.map((_, i) => `<Relationship Id="rIdG${i + 1}" Type="${R}/image" Target="media/grafikas${i + 1}.png"/>`).join('')}</Relationships>`,
      'word/document.xml': doc, 'word/styles.xml': styles, 'word/numbering.xml': numbering };
    imgs.forEach((b, i) => { files[`word/media/grafikas${i + 1}.png`] = b; });
    const blob = new Blob([await XL.zip(files, true)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename.replace(/[\\/:*?"<>|]+/g, '_') + '.docx'; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return blob;
  }
  return { run, p, table, img, save };
})();
/* grafikas paslėptame lange → PNG (šviesi tema, kad tiktų spausdinti) */
async function rvChart(f, pl, imgs) {
  const sp = chartSpec(f, { id: '', dataset: { pl } }), ser = specSer(sp); if (!ser.length) return '';
  const wrap = document.createElement('section'); wrap.className = 'card'; wrap.style.cssText = 'position:fixed;left:-12000px;top:0;width:820px';
  wrap.innerHTML = `<h3>${hEsc(ser.length > 1 ? f.h : `${f.h}: ${ser[0].label}`)}</h3><div class="chart"></div><p class="srcl">${hEsc(f.src)}</p>`; document.body.append(wrap);
  try {
    const el = wrap.querySelector('.chart'), lo = Math.min(...ser.map(x => x.points[0][0])), hi = Math.max(...ser.map(x => x.points[x.points.length - 1][0]));
    drawLineChart(el, ser, lo, hi, { fmt: specFmt(sp.u), axisUnit: '', zero: sp.u === 'mn', ml: 70, height: 260, width: 788, mr: ser.length > 1 ? 120 : 16 });
    const blob = await chartPng(el), bm = await createImageBitmap(blob), u8 = new Uint8Array(await blob.arrayBuffer());
    imgs.push(u8); return DX.img(`rIdG${imgs.length}`, imgs.length, bm.width, bm.height);
  } catch (e) { console.error(e); return ''; } finally { wrap.remove(); }
}
async function quarterReview() {
  const t = T(), V = t.rv, F = t.f, X = t.fx, Q = t.p23, P2 = t.pv2, P3 = t.pv3;
  const last = (pl, d) => MKT[pl].dates.filter(x => x <= d).pop(), d2 = last('II', MS.d) || MKT.II.dates[MKT.II.dates.length - 1], d3 = last('III', d2);
  const keep = { pl: MS.pl, d: MS.d, mgr: MS.mgr }, html = document.documentElement, th = html.dataset.theme, imgs = [], out = [];
  const H1 = s => out.push(DX.p(s, 'Heading1')), H2 = s => out.push(DX.p(s, 'Heading2')), li = s => out.push(DX.p(s, 'ListParagraph', 1));
  const fact = (f, b = true) => { out.push(DX.p([DX.run(f.h.replace(/\.?$/, '. '), { b: 1 }), DX.run(f.text)])); if (b) out.push(DX.p(V.how + f.calc, 'Small')); };
  const chartsFor = async (fs, hs, pl) => { for (const h of hs) { const f = fs.find(x => x.h === h); if (f) { const s = await rvChart(f, pl, imgs); if (s) out.push(s); } } };
  const mgrTable = (pl, d) => { const di = dIdx(pl, d), dq = dIdx(pl, qBack(d, 3)), T0 = totals(pl, di), bm = byMgr(pl, di), bq = dq >= 0 ? byMgr(pl, dq) : {};
    return DX.table(V.mh, Object.entries(bm).sort((a, b) => b[1].nav - a[1].nav).map(([m, v]) => [m, mInt(v.part), num(v.nav, 1), T0.nav ? pctPlain(v.nav / T0.nav * 100, 1) : '–', bq[m] && bq[m].nav ? mRel(v.nav, bq[m].nav) : '–'])); };
  const srcs = new Set();
  if (th === 'dark' || (!th && matchMedia('(prefers-color-scheme: dark)').matches)) html.dataset.theme = 'light';
  try {
    Object.assign(MS, { pl: 'II', d: d2, mgr: '' });
    const f2 = mkFacts(), pv = pvFacts(), r23 = d3 === d2 ? p23Facts() : { facts: [], mgr: {} }, di2 = dIdx('II', d2);
    const mg = Object.entries(byMgr('II', di2)).sort((a, b) => b[1].nav - a[1].nav).map(([m]) => [m, [...mgrFacts('II', di2, m), strengthFact('II', di2, m)].filter(Boolean)]);
    let f3 = []; if (d3) { Object.assign(MS, { pl: 'III', d: d3 }); f3 = mkFacts(); }
    Object.assign(MS, { pl: 'II', d: d2 });
    [...f2, ...f3, ...r23.facts, ...pv].forEach(f => f.src.split(/(?<=\.)\s+(?=Šaltinis:|Source:)/).forEach(x => srcs.add(x.trim())));
    const title = V.title(V.qn(d2));
    out.push(DX.p(title, 'Title'), DX.p(V.sub(t.dLong(d2), t.dLong(new Date().toISOString().slice(0, 10))), 'Small'));
    H1(V.top); [[f2, [F.navH, X.flowH, X.beatH]], [f3, [F.navH]], [r23.facts, [Q.rH]]].forEach(([fs, hs]) => hs.forEach(h => { const f = fs.find(x => x.h === h); if (f) li(f.text); }));
    H1(V.s2); out.push(DX.table(keyData('II', d2).head, keyData('II', d2).rows)); f2.forEach(f => fact(f)); await chartsFor(f2, [F.navH, X.flowH, F.mgrH], 'II');
    H1(V.s2m); out.push(mgrTable('II', d2)); mg.forEach(([m, fs]) => { if (!fs.length) return; H2(m); fs.forEach(f => li(f.text)); });
    if (f3.length) { Object.assign(MS, { pl: 'III', d: d3 }); H1(V.s3); out.push(DX.table(keyData('III', d3).head, keyData('III', d3).rows), mgrTable('III', d3)); f3.forEach(f => fact(f)); await chartsFor(f3, [F.navH, F.partH], 'III'); Object.assign(MS, { pl: 'II', d: d2 }); }
    if (r23.facts.length) { H1(V.s23); r23.facts.forEach(f => fact(f)); await chartsFor(r23.facts, [Q.rH, Q.gH], 'II'); Object.entries(r23.mgr).forEach(([m, fs]) => { if (!fs.length) return; H2(m); fs.forEach(f => li(f.text)); }); }
    if (pv.length) { H1(V.spv); pv.forEach(f => fact(f)); await chartsFor(pv, [P2.chH, P3.wH], 'II'); }
    H1(V.sSrc); srcs.forEach(s => li(s)); out.push(DX.p(V.peer), DX.p(t.noteLB, 'Small'));
    return await DX.save(out.join(''), imgs, V.file(V.qn(d2)), title);
  } finally { Object.assign(MS, keep); if (th) html.dataset.theme = th; else delete html.dataset.theme; }
}
document.addEventListener('click', async e => {
  const b = e.target.closest('#qfRev'); if (!b) return;
  const o = b.textContent; b.disabled = true; b.textContent = '…';
  try { await quarterReview(); b.textContent = '✓'; } catch (err) { console.error(err); b.textContent = '!'; }
  setTimeout(() => { b.textContent = o; b.disabled = false; }, 1500);
});

/* ---------- Mėnesio faktai iš kasdienių duomenų (savininkas 2026-10-20: „Pratęsk abu darbus“ – IDEAS.md) ----------
   Faktai tarp LB ketvirčių: valdytojų skelbiamos kasdienės vieneto vertės ir grynieji aktyvai mėnesio pabaigoje (REP iš data_rep.js).
   Fondai lyginami tik savo grupėje (II – gimimo metų grupė ar turto išsaugojimo, III – kategorija). Rinkos grąža – svertinė pagal
   turtą mėnesio pradžioje (III pakopoje kasdienio turto nėra – paprastas vidurkis). Kiekvienas skaičius – Excel formulė lape „Faktai“. */
addStrings({ mf: { title: 'Month facts', lead: 'Facts between Bank of Lithuania quarters, from managers’ daily unit values and net assets at month end: the month’s return, leaders in each group, history. Funds are compared only within their group.',
  sel: 'Month:',
  mon: d => `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`, gen: d => `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`, inM: d => `in ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`,
  src: d => `Source: managers’ published daily unit values and net assets (last working day of the month), ${d}.`,
  shV: 'Month-end values', shR: 'Market by month', shF: 'Facts',
  hR: 'Month return', tR: (m, w, p, n, y) => `${m} the average (asset-weighted) return of pillar II funds was ${w}, and ${p} of ${n} funds rose in value. Since the start of the year the return is ${y}.`,
  cR: 'Each fund: month-end unit value ÷ previous month-end − 1; weights – fund net assets at the start of the month; year to date – monthly returns chained.',
  hG: 'Investment gain and assets', tG: (m, up, g, a, da, fl) => `${m} pillar II funds ${g >= 0 ? `earned an investment gain of about ${mMn(g)}` : `made an investment loss of about ${mMn(-g)}`}. At month end they managed ${mMn(a)}, ${mMn(Math.abs(da))} ${da >= 0 ? 'more' : 'less'} than a month earlier; ${fl >= 0 ? 'contributions exceeded payouts' : 'payouts exceeded contributions'} by about ${mMn(Math.abs(fl))}.`,
  cG: 'Gain = Σ fund return × assets at the start of the month; contributions, switches and payouts = change in assets − gain.',
  hL: 'Leaders in groups', tL: (m, xs) => `${m} the best return in each group: ${xs}.`, cL: 'Highest month return within each group (funds compared only within their group).',
  hS: 'Largest gap in a group', tS: (g, a, pa, b, pb, v, m) => `${m} the gap between funds was largest in the “${g}” group: ${a} returned ${pa} and ${b} ${pb}, a difference of ${v} pp.`, cS: 'Highest minus lowest month return within a group.',
  hY: 'Year-to-date leaders', tY: (m, xs) => `Year-to-date leaders (${m}): ${xs}.`, cY: 'Unit value at month end ÷ value on 31 December − 1, highest within each group.',
  hW: 'Most often first', tW: (p, n, tot, rest) => `This year ${p} was first in its group most often – ${n} times of ${tot} (groups × months)${rest ? `; then ${rest}` : ''}.`, cW: 'Count of months this year in which the manager’s fund had the highest month return in its group.',
  hH: 'The month in history', tH: (r, n, y, b, bv, w, wv) => `By the average pillar II return this month ranks ${r} of ${n} months since ${y} (1 is the best). The best month was ${b} (${bv}), the worst ${w} (${wv}).`, cH: 'Rank of the asset-weighted pillar II month return among all months in the data.',
  hP: 'Positive months', tP: (p, n, P, N, s) => `This year the pillar II return was positive in ${p} of ${n} months; over all data – ${P} of ${N} months (${s}).`, cP: 'Months with a positive asset-weighted pillar II return.',
  h3: 'Pillar III: category leaders', t3: (m, xs) => `Pillar III fund returns ${m}: ${xs}.`, c3: 'Simple average and highest month return within each category (bond, mixed, equity); pillar III daily assets are not published, so no weights.',
  x3: (c, a, f, v) => `${c} – average ${a}, best ${f} (${v})`, h3y: 'Pillar III: year-to-date leaders', t3y: (m, xs) => `Pillar III year-to-date leaders (${m}): ${xs}.`, end: d => `end of ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`,
  lW: 'Weighted return', lPos: 'Funds that rose', lN: 'Funds with a return', lYtd: 'Since start of year', lGain: 'Investment gain, € m', lNav: 'Net assets at month end, € m', lNavP: 'Net assets at the end of the previous month, € m', lFlow: 'Contributions, switches and payouts, € m',
  lMax: 'Highest', lMin: 'Lowest', lGap: 'Gap, pp', lRank: 'Rank of the month', lCnt: 'Months in data', lBest: 'Best month', lWorst: 'Worst month', lAvg: 'Average', lTot: 'All group-months',
  lPy: 'Positive months this year', lNy: 'Months this year', lPa: 'Positive months, all data', lNa: 'Months, all data', lSh: 'Share positive',
  sR: 'Pillar II weighted month return, %', sNav: 'Pillar II net assets, € m', s3: c => `${c}: average month return, %`, sW: 'Times first (cumulative)',
  vh: ['Pillar', 'Manager', 'Group', 'Fund', 'Month end', 'Unit value, €', 'Net assets, € m', 'Month return', 'Weight (assets at start), € m', 'Return × weight', 'Since start of year', '12 months', 'Rank in group', 'Funds in group'],
  rh: ['Month end', 'II weighted return', 'II investment gain, € m', 'II net assets, € m', 'III average return', 'II index (start = 100)'],
  dates: 'Dates', dM: 'Month end (change it to recalculate)', dP: 'Previous month end', dY: 'End of last year',
  legend: [['Blue numbers', 'Month-end unit values and net assets from the managers’ daily data (sheet “Month-end values”).'], ['Black numbers', 'Formulas: returns, weights, ranks (sheets “Month-end values”, “Market by month”).'], ['Yellow numbers', 'The same figures as on the site; each is a formula. Change cell B4 in “Facts” to another month end to recalculate them (the sentence text does not change).']] } },
{ mf: { title: 'Mėnesio faktai', lead: 'Faktai tarp Lietuvos banko ketvirčių iš valdytojų kasdien skelbiamų vieneto verčių ir grynųjų aktyvų mėnesio pabaigoje: mėnesio grąža, lyderiai kiekvienoje grupėje, istorija. Fondai lyginami tik savo grupėje.',
  sel: 'Mėnuo:', mon: d => `${d.slice(0, 4)} m. ${['sausis', 'vasaris', 'kovas', 'balandis', 'gegužė', 'birželis', 'liepa', 'rugpjūtis', 'rugsėjis', 'spalis', 'lapkritis', 'gruodis'][+d.slice(5, 7) - 1]}`,
  gen: d => `${d.slice(0, 4)} m. ${MK_MON.lt[+d.slice(5, 7) - 1]}`,
  inM: d => `${d.slice(0, 4)} m. ${['sausį', 'vasarį', 'kovą', 'balandį', 'gegužę', 'birželį', 'liepą', 'rugpjūtį', 'rugsėjį', 'spalį', 'lapkritį', 'gruodį'][+d.slice(5, 7) - 1]}`,
  src: d => `Šaltinis: valdytojų skelbiamos kasdienės vieneto vertės ir grynieji aktyvai (paskutinė mėnesio darbo diena), ${d}.`,
  shV: 'Mėnesio vertės', shR: 'Rinka pagal mėnesius', shF: 'Faktai',
  hR: 'Mėnesio grąža', tR: (m, w, p, n, y) => `${m} II pakopos fondų vidutinė (pagal turtą svertinė) grąža buvo ${w}, vertė padidėjo ${p} iš ${n} fondų. Nuo metų pradžios grąža siekia ${y}.`,
  cR: 'Kiekvieno fondo: vieneto vertė mėnesio pabaigoje ÷ ankstesnio mėnesio pabaigos vertė − 1; svoriai – fondų grynieji aktyvai mėnesio pradžioje; nuo metų pradžios – mėnesių grąžos sujungtos grandine.',
  hG: 'Prieaugis ir turtas', tG: (m, up, g, a, da, fl) => `${m} II pakopos fondai ${g >= 0 ? `uždirbo apie ${mMn(g)} investicinio prieaugio` : `patyrė apie ${mMn(-g)} investicinių nuostolių`}. Mėnesio pabaigoje jie valdė ${mMn(a)} – ${mMn(Math.abs(da))} ${da >= 0 ? 'daugiau' : 'mažiau'} nei prieš mėnesį; ${fl >= 0 ? 'įmokos viršijo išmokas' : 'išmokos viršijo įmokas'} apie ${mMn(Math.abs(fl))}.`,
  cG: 'Prieaugis = Σ fondo grąža × turtas mėnesio pradžioje; įmokos, perėjimai ir išmokos = turto pokytis − prieaugis.',
  hL: 'Lyderiai grupėse', tL: (m, xs) => `${m} grupių lyderiai: ${xs}.`, cL: 'Didžiausia mėnesio grąža kiekvienoje grupėje (fondai lyginami tik savo grupėje).',
  hS: 'Didžiausias skirtumas grupėje', tS: (g, a, pa, b, pb, v, m) => `${m} didžiausias grąžų skirtumas buvo grupėje „${g}“: ${a} fondo grąža – ${pa}, ${b} – ${pb}, skirtumas – ${v} p. p.`, cS: 'Didžiausia minus mažiausia mėnesio grąža grupėje.',
  hY: 'Nuo metų pradžios lyderiai', tY: (m, xs) => `Nuo metų pradžios lyderiai (${m}): ${xs}.`, cY: 'Vieneto vertė mėnesio pabaigoje ÷ vertė gruodžio 31 d. − 1, didžiausia kiekvienoje grupėje.',
  hW: 'Dažniausiai pirmi', tW: (p, n, tot, rest) => `Šiais metais dažniausiai savo grupėje pirmas buvo ${p} – ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'kartą' : n % 10 === 0 || (n % 100 > 10 && n % 100 < 20) ? 'kartų' : 'kartus'} iš ${tot} (grupės × mėnesiai)${rest ? `; toliau ${rest}` : ''}.`, cW: 'Kiek kartų šiais metais valdytojo fondo mėnesio grąža buvo didžiausia jo grupėje.',
  hH: 'Mėnuo istorijoje', tH: (r, n, y, b, bv, w, wv) => `Pagal II pakopos fondų vidutinę grąžą šis mėnuo užima ${r} vietą iš ${n} mėnesių nuo ${y} (1 – geriausias). Geriausias mėnuo – ${b} (${bv}), blogiausias – ${w} (${wv}).`, cH: 'II pakopos svertinės mėnesio grąžos vieta tarp visų duomenų mėnesių.',
  hP: 'Teigiami mėnesiai', tP: (p, n, P, N, s) => `Šiais metais II pakopos grąža buvo teigiama ${p} iš ${n} mėnesių; per visą duomenų laikotarpį – ${P} iš ${N} mėnesių (${s}).`, cP: 'Mėnesiai, kai II pakopos svertinė grąža buvo teigiama.',
  h3: 'III pakopa: kategorijų lyderiai', t3: (m, xs) => `${m} III pakopos fondų grąža: ${xs}.`, c3: 'Paprastas vidurkis ir didžiausia mėnesio grąža kiekvienoje kategorijoje (obligacijų, mišrūs, akcijų); III pakopos kasdienis turtas neskelbiamas, todėl be svorių.',
  x3: (c, a, f, v) => `${c} – vidutiniškai ${a}, geriausias ${f} (${v})`, h3y: 'III pakopa: nuo metų pradžios', t3y: (m, xs) => `III pakopos lyderiai nuo metų pradžios (${m}): ${xs}.`, end: d => `${d.slice(0, 4)} m. ${MK_MON.lt[+d.slice(5, 7) - 1]} pabaiga`,
  lW: 'Svertinė grąža', lPos: 'Fondų, kurių vertė augo', lN: 'Fondų su grąža', lYtd: 'Nuo metų pradžios', lGain: 'Investicinis prieaugis, mln. €', lNav: 'Grynieji aktyvai mėnesio pabaigoje, mln. €', lNavP: 'Grynieji aktyvai praėjusio mėnesio pabaigoje, mln. €', lFlow: 'Įmokos, perėjimai ir išmokos, mln. €',
  lMax: 'Didžiausia', lMin: 'Mažiausia', lGap: 'Skirtumas, p. p.', lRank: 'Mėnesio vieta', lCnt: 'Mėnesių duomenyse', lBest: 'Geriausias mėnuo', lWorst: 'Blogiausias mėnuo', lAvg: 'Vidurkis', lTot: 'Visi grupių mėnesiai',
  lPy: 'Teigiami mėnesiai šiais metais', lNy: 'Mėnesių šiais metais', lPa: 'Teigiami mėnesiai, visi duomenys', lNa: 'Mėnesių, visi duomenys', lSh: 'Teigiamų dalis',
  sR: 'II pakopos svertinė mėnesio grąža, %', sNav: 'II pakopos grynieji aktyvai, mln. €', s3: c => `${c}: vidutinė mėnesio grąža, %`, sW: 'Kartų pirmas (sukaupta)',
  vh: ['Pakopa', 'Valdytojas', 'Grupė', 'Fondas', 'Mėnesio pabaiga', 'Vieneto vertė, €', 'Grynieji aktyvai, mln. €', 'Mėnesio grąža', 'Svoris (turtas pradžioje), mln. €', 'Grąža × svoris', 'Nuo metų pradžios', '12 mėn.', 'Vieta grupėje', 'Fondų grupėje'],
  rh: ['Mėnesio pabaiga', 'II svertinė grąža', 'II investicinis prieaugis, mln. €', 'II grynieji aktyvai, mln. €', 'III vidutinė grąža', 'II indeksas (pradžia = 100)'],
  dates: 'Datos', dM: 'Mėnesio pabaiga (pakeiskite – skaičiai persiskaičiuos)', dP: 'Praėjusio mėnesio pabaiga', dY: 'Praėjusių metų pabaiga',
  legend: [['Mėlyni skaičiai', 'Vieneto vertės ir grynieji aktyvai mėnesio pabaigoje iš valdytojų kasdienių duomenų (lapas „Mėnesio vertės“).'], ['Juodi skaičiai', 'Formulės: grąžos, svoriai, vietos (lapai „Mėnesio vertės“, „Rinka pagal mėnesius“).'], ['Geltoni skaičiai', 'Tie patys skaičiai kaip svetainėje; kiekvienas – formulė. Lape „Faktai“ pakeitus langelį B4 į kitą mėnesio pabaigą, jie persiskaičiuoja (sakinių tekstas nesikeičia).']] } });
const MFD = (() => {                       // mėnesių duomenys: fondai, grąžos, rinkos eilutė (skaičiuojama vieną kartą)
  if (typeof REP === 'undefined') return null;
  const RM = REP.months, gl2 = Object.fromEntries(DATA.groups.map(g => [g.id, groupLabel(g)])), c3 = CAT3[lang] || CAT3.lt;
  const fs = REP.funds.filter(f => (f.pl === 'II' && gl2[f.g]) || (f.pl === 'III' && c3[f.g])).map(f => ({ ...f, gl: f.pl === 'II' ? gl2[f.g] : c3[f.g], pv: labelOfMgr(f.p) }));
  const mon = k => +iso(RM[k]).slice(5, 7);
  fs.forEach(f => {
    f.r = RM.map((_, k) => k > 0 && f.m[k] != null && f.m[k - 1] != null ? f.m[k] / f.m[k - 1] - 1 : null);
    f.a = f.am.map(x => x == null ? null : x / 1e6);
    f.w = RM.map((_, k) => f.r[k] != null && k > 0 && f.a[k - 1] != null ? f.a[k - 1] : null);
    f.y = RM.map((_, k) => { const j = k - mon(k); return j >= 0 && f.m[k] != null && f.m[j] != null ? f.m[k] / f.m[j] - 1 : null; });
    f.y12 = RM.map((_, k) => k >= 12 && f.m[k] != null && f.m[k - 12] != null ? f.m[k] / f.m[k - 12] - 1 : null);
  });
  fs.forEach(f => { f.rk = RM.map((_, k) => f.r[k] == null ? null : fs.filter(x => x.pl === f.pl && x.gl === f.gl && x.r[k] != null && x.r[k] > f.r[k]).length + 1);
    f.ng = RM.map((_, k) => f.r[k] == null ? null : fs.filter(x => x.pl === f.pl && x.gl === f.gl && x.r[k] != null).length); });
  const II = fs.filter(f => f.pl === 'II'), III = fs.filter(f => f.pl === 'III');
  const mkt = RM.map((_, k) => { let sw = 0, sx = 0, nav = 0, n3 = 0, s3 = 0;
    II.forEach(f => { if (f.w[k] != null) { sw += f.w[k]; sx += f.r[k] * f.w[k]; } if (f.a[k] != null) nav += f.a[k]; });
    III.forEach(f => { if (f.r[k] != null) { n3++; s3 += f.r[k]; } });
    return { w: sw ? sx / sw : null, g: sx, nav, r3: n3 ? s3 / n3 : null }; });
  let ix = 100; mkt.forEach((x, k) => { if (k > 0 && x.w != null) ix *= 1 + x.w; x.ix = ix; });   // mėnuo be grąžos – indeksas nesikeičia
  return { RM, fs, II, III, mkt, mon, k0: 1 };
})();
let MFK = MFD ? MFD.RM.length - 1 : -1;
function mfFacts(k) {
  const t = T(), V = t.mf, D = MFD; if (!D || k < 1) return [];
  const { RM, fs, II, III, mkt, mon } = D, d = iso(RM[k]), m = V.inM(d), src = V.src(d), out = [], L = lang === 'lt';
  const VS = `'${V.shV}'`, RS = `'${V.shR}'`, M = '$B$4', MP = '$B$5', MY = '$B$6', rp = x => pctPlain(x * 100), pp = x => num(x * 100, 2);
  const cr = (pl, gl) => `${VS}!A:A,"${pl}"${gl ? `,${VS}!C:C,${xq(gl)}` : ''},${VS}!E:E,${M}`;
  const add = (h, text, calc, nb, sp) => out.push({ h, text, calc, src, nums: nb.a, sp, book: mfBook });
  const kd = k - mon(k), yr = []; for (let j = Math.max(1, kd + 1); j <= k; j++) yr.push(j);
  const last = (n, fn) => { const pts = []; for (let j = Math.max(1, k - n + 1); j <= k; j++) { const v = fn(j); if (v != null) pts.push([RM[j], v]); } return pts; };
  const ord = pl => pl === 'II' ? DATA.groups.map(g => groupLabel(g)) : ['bond', 'mixed', 'equity'].map(c => (CAT3[lang] || CAT3.lt)[c]);
  const groupsOf = pl => { const o = ord(pl); return [...new Set(fs.filter(f => f.pl === pl).map(f => f.gl))].sort((a, b) => o.indexOf(a) - o.indexOf(b)); };
  const best = (pl, gl, key) => fs.filter(f => f.pl === pl && f.gl === gl && f[key][k] != null).sort((a, b) => b[key][k] - a[key][k]);
  const X = mkt[k];
  if (X.w != null) { const nb = NB(), rs = II.filter(f => f.r[k] != null), pos = rs.filter(f => f.r[k] > 0).length, y = kd >= 0 && mkt[kd].ix ? X.ix / mkt[kd].ix - 1 : null;
    nb.add(V.lW, X.w, () => `SUMIFS(${VS}!J:J,${cr('II')})/SUMIFS(${VS}!I:I,${cr('II')})`, Zr);
    nb.add(V.lPos, pos, () => `COUNTIFS(${cr('II')},${VS}!H:H,">0")`, Zi); nb.add(V.lN, rs.length, () => `COUNTIFS(${cr('II')},${VS}!H:H,">-1")`, Zi);
    if (y != null) nb.add(V.lYtd, y, () => `SUMIFS(${RS}!F:F,${RS}!A:A,${M})/SUMIFS(${RS}!F:F,${RS}!A:A,${MY})-1`, Zr);
    add(V.hR, V.tR(m[0].toUpperCase() + m.slice(1), rp(X.w), pos, rs.length, y == null ? '–' : rp(y)), V.cR, nb, { u: 'pct', lines: [{ l: V.sR, pts: last(36, j => mkt[j].w == null ? null : mkt[j].w * 100) }] }); }
  if (X.w != null && mkt[k - 1].nav) { const nb = NB(), da = X.nav - mkt[k - 1].nav, fl = da - X.g;
    const i0 = nb.add(V.lGain, X.g, () => `SUMIFS(${VS}!J:J,${cr('II')})`, Zm), i1 = nb.add(V.lNav, X.nav, () => `SUMIFS(${VS}!G:G,${cr('II')})`, Zm);
    const i2 = nb.add(V.lNavP, mkt[k - 1].nav, () => `SUMIFS(${VS}!G:G,${VS}!A:A,"II",${VS}!E:E,${MP})`, Zm); nb.add(V.lFlow, fl, c => `${c(i1)}-${c(i2)}-${c(i0)}`, Zm);
    add(V.hG, V.tG(m[0].toUpperCase() + m.slice(1), X.g >= 0, X.g, X.nav, da, fl), V.cG, nb, { u: 'mn', lines: [{ l: V.sNav, pts: RM.map((x, j) => j <= k && mkt[j].nav ? [x, mkt[j].nav] : null).filter(Boolean) }] }); }
  { const nb = NB(), xs = [];
    groupsOf('II').forEach(gl => { const b = best('II', gl, 'r'); if (!b.length) return; xs.push(`${gl} – ${b[0].pv} (${rp(b[0].r[k])})`); nb.add(`${gl}: ${b[0].pv}`, b[0].r[k], () => `_xlfn.MAXIFS(${VS}!H:H,${cr('II', gl)})`, Zr); });
    if (xs.length) add(V.hL, V.tL(m[0].toUpperCase() + m.slice(1), xs.join('; ')), V.cL, nb, null); }
  { const gs = groupsOf('II').map(gl => ({ gl, b: best('II', gl, 'r') })).filter(x => x.b.length > 1).map(x => ({ ...x, gap: x.b[0].r[k] - x.b[x.b.length - 1].r[k] })).sort((a, b) => b.gap - a.gap);
    if (gs.length) { const g = gs[0], a = g.b[0], z = g.b[g.b.length - 1], nb = NB();
      const i0 = nb.add(`${V.lMax}: ${a.pv}`, a.r[k], () => `_xlfn.MAXIFS(${VS}!H:H,${cr('II', g.gl)})`, Zr), i1 = nb.add(`${V.lMin}: ${z.pv}`, z.r[k], () => `_xlfn.MINIFS(${VS}!H:H,${cr('II', g.gl)})`, Zr);
      nb.add(V.lGap, g.gap * 100, c => `(${c(i0)}-${c(i1)})*100`, Zp);
      add(V.hS, V.tS(g.gl, a.pv, rp(a.r[k]), z.pv, rp(z.r[k]), pp(g.gap), m[0].toUpperCase() + m.slice(1)), V.cS, nb, { u: 'pct', lines: g.b.map(f => ({ l: f.pv, c: mkColor(f.pv), pts: last(12, j => f.r[j] == null ? null : f.r[j] * 100) })) }); out[out.length - 1].gx = g.gl; } }
  if (kd >= 0) { const nb = NB(), xs = [];
    groupsOf('II').forEach(gl => { const b = best('II', gl, 'y'); if (!b.length) return; xs.push(`${gl} – ${b[0].pv} (${rp(b[0].y[k])})`); nb.add(`${gl}: ${b[0].pv}`, b[0].y[k], () => `_xlfn.MAXIFS(${VS}!K:K,${cr('II', gl)})`, Zr); });
    if (xs.length) add(V.hY, V.tY(V.end(d), xs.join('; ')), V.cY, nb, null); }
  if (yr.length) { const ps = [...new Set(II.map(f => f.pv))], win = p => II.filter(f => f.pv === p).reduce((s, f) => s + yr.filter(j => f.rk[j] === 1).length, 0);
    const tot = II.reduce((s, f) => s + yr.filter(j => f.rk[j] === 1).length, 0), rk = ps.map(p => ({ p, n: win(p) })).filter(x => x.n).sort((a, b) => b.n - a.n);
    if (rk.length) { const nb = NB(), per = `${VS}!E:E,">"&${MY},${VS}!E:E,"<="&${M}`;
      rk.forEach(x => nb.add(x.p, x.n, () => `COUNTIFS(${VS}!A:A,"II",${VS}!B:B,${xq(x.p)},${VS}!M:M,1,${per})`, Zi)); nb.add(V.lTot, tot, () => `COUNTIFS(${VS}!A:A,"II",${VS}!M:M,1,${per})`, Zi);
      add(V.hW, V.tW(rk[0].p, rk[0].n, tot, rk.slice(1, 3).map(x => `${x.p} (${x.n})`).join(', ')), V.cW, nb,
        { u: 'int', lines: rk.slice(0, 6).map(x => ({ l: x.p, c: mkColor(x.p), pts: yr.map(j => [RM[j], II.filter(f => f.pv === x.p).reduce((s, f) => s + yr.filter(i => i <= j && f.rk[i] === 1).length, 0)]) })) }); } }
  if (X.w != null) { const all = mkt.map((x, j) => ({ j, w: x.w })).filter(x => x.j >= 1 && x.w != null), r = all.filter(x => x.w > X.w).length + 1;
    const b = all.reduce((a, x) => x.w > a.w ? x : a), w = all.reduce((a, x) => x.w < a.w ? x : a), nb = NB(), cur = `SUMIFS(${RS}!B:B,${RS}!A:A,${M})`;
    nb.add(V.lRank, r, () => `RANK(${cur},${RS}!B:B,0)`, Zi); nb.add(V.lCnt, all.length, () => `COUNT(${RS}!B:B)`, Zi);
    nb.add(`${V.lBest}: ${V.mon(iso(RM[b.j]))}`, b.w, () => `MAX(${RS}!B:B)`, Zr); nb.add(`${V.lWorst}: ${V.mon(iso(RM[w.j]))}`, w.w, () => `MIN(${RS}!B:B)`, Zr);
    add(V.hH, V.tH(r, all.length, L ? `${iso(RM[all[0].j]).slice(0, 4)} m. ${['sausio', 'vasario', 'kovo', 'balandžio', 'gegužės', 'birželio', 'liepos', 'rugpjūčio', 'rugsėjo', 'spalio', 'lapkričio', 'gruodžio'][+iso(RM[all[0].j]).slice(5, 7) - 1]}` : V.mon(iso(RM[all[0].j])),
      V.mon(iso(RM[b.j])), rp(b.w), V.mon(iso(RM[w.j])), rp(w.w)), V.cH, nb, { u: 'pct', lines: [{ l: V.sR, pts: all.map(x => [RM[x.j], x.w * 100]) }] });
    const py = yr.filter(j => mkt[j].w > 0).length, ny = yr.filter(j => mkt[j].w != null).length, upto = all.filter(x => x.j <= k), pa = upto.filter(x => x.w > 0).length, nb2 = NB();
    const yc = `${RS}!A:A,">"&${MY},${RS}!A:A,"<="&${M}`;
    nb2.add(V.lPy, py, () => `COUNTIFS(${RS}!B:B,">0",${yc})`, Zi); nb2.add(V.lNy, ny, () => `COUNTIFS(${RS}!B:B,">-1",${yc})`, Zi);
    const i2 = nb2.add(V.lPa, pa, () => `COUNTIFS(${RS}!B:B,">0",${RS}!A:A,"<="&${M})`, Zi), i3 = nb2.add(V.lNa, upto.length, () => `COUNTIFS(${RS}!B:B,">-1",${RS}!A:A,"<="&${M})`, Zi);
    nb2.add(V.lSh, pa / upto.length, c => `${c(i2)}/${c(i3)}`, Zr);
    add(V.hP, V.tP(py, ny, pa, upto.length, pctPlain(pa / upto.length * 100)), V.cP, nb2, null); }
  { const N = t.nf, nb = NB(), xs = [];
    groupsOf('II').forEach(gl => { const b = best('II', gl, 'y12'); if (!b.length) return; xs.push(`${gl} – ${b[0].pv} (${rp(b[0].y12[k])})`); nb.add(`${gl}: ${b[0].pv}`, b[0].y12[k], () => `_xlfn.MAXIFS(${VS}!L:L,${cr('II', gl)})`, Zr); });
    if (xs.length) out.push({ h: N.m12H, text: N.m12(V.gen(d), xs.join('; ')), calc: N.c12, src, nums: nb.a, book: mfBook, tp: 'ret', ex: () => ({ k: 'mgrp', pl: 'II', h: 'y12' }) }); }
  { const N = t.nf, ws = []; for (let j = 1; j <= k; j++) if (mkt[j].w != null) ws.push(j);
    if (ws.length > 6) { const sg = j => mkt[j].w > 0 ? 1 : -1, s0 = sg(ws[ws.length - 1]); let n = 0; while (n < ws.length && sg(ws[ws.length - 1 - n]) === s0) n++;
      let pn = 0; while (n + pn < ws.length && sg(ws[ws.length - 1 - n - pn]) === -s0) pn++;
      let bst = 0, cur = 0; ws.forEach((j, i) => { cur = i && sg(j) === sg(ws[i - 1]) ? cur + 1 : 1; if (sg(j) === s0 && i < ws.length - n) bst = Math.max(bst, cur); });
      const nb = NB(), show = ws.slice(-Math.min(ws.length, n + (n === 1 ? pn : 1))), L0 = show.length;
      const ix = show.map((j, i) => nb.add(`${V.mon(iso(RM[j]))} · ${V.sR}`, mkt[j].w, () => `INDEX(${RS}!B:B,MATCH(${M},${RS}!A:A,0)-${L0 - 1 - i})`, Zr)), sel = ix.slice(-n);
      nb.add(N.nm, n, c => `COUNTIF(${c(sel[0])}:${c(sel[sel.length - 1])},${s0 > 0 ? '">0"' : '"<0"'})`, '0');
      const y0 = iso(RM[ws[0]]).slice(0, 4), longest = n > 1 && n > bst;
      const text = n === 1 && pn ? N.ms1(m[0].toUpperCase() + m.slice(1), s0 > 0, pn) : N.msP(n, V.gen(iso(RM[ws[ws.length - n]])), s0 > 0) + (longest ? N.msL(y0) : '');
      out.push({ h: N.msH, text, calc: N.cMs, src, nums: nb.a, book: mfBook, tp: 'ret', hot: n === 1 && pn >= 3 ? { s: 2.5, l: t.fu.flip } : longest && n >= 3 ? { s: 2, l: t.fu.hi(y0).replace(/^\S+/, L ? 'Ilgiausia' : 'Longest') } : null, ex: () => ({ k: 'mser', key: 'w', n: 24 }) }); } }
  [['r', V.h3, V.t3, m], ['y', V.h3y, V.t3y, V.end(d)]].forEach(([key, h, tx, mm]) => { if (key === 'y' && kd < 0) return;
    const nb = NB(), xs = [], col = key === 'r' ? 'H' : 'K';
    groupsOf('III').forEach(gl => { const b = best('III', gl, key); if (!b.length) return; const av = b.reduce((s, f) => s + f[key][k], 0) / b.length;
      nb.add(`${gl}: ${V.lAvg.toLowerCase()}`, av, () => `AVERAGEIFS(${VS}!${col}:${col},${cr('III', gl)})`, Zr); nb.add(`${gl}: ${b[0].n}`, b[0][key][k], () => `_xlfn.MAXIFS(${VS}!${col}:${col},${cr('III', gl)})`, Zr);
      xs.push(V.x3(gl, rp(av), b[0].n, rp(b[0][key][k]))); });
    if (xs.length) add(h, tx(mm, xs.join('; ')), V.c3, nb, key === 'r' ? { u: 'pct', lines: groupsOf('III').map((gl, i) => ({ l: V.s3(gl), c: `var(--s${i + 1})`, pts: last(36, j => { const xs2 = III.filter(f => f.gl === gl && f.r[j] != null); return xs2.length ? xs2.reduce((s, f) => s + f.r[j], 0) / xs2.length * 100 : null; }) })) } : null); });
  return out;
}
async function mfBook(facts, title) {
  const t = T(), V = t.mf, D = MFD, L = lang === 'lt', k = MFK, d = iso(D.RM[k]), wb = XL.book(), ser = x => x + 25569, Rq = `'${V.shR}'`, Vq = `'${V.shV}'`;
  const res = [[{ v: `${title} · ${V.mon(d)}`, s: 'title' }], [{ v: V.src(d), s: 'sub' }], [{ v: V.dates, s: 'b' }],
    [{ v: V.dM, s: 'b' }, { v: ser(D.RM[k]), z: 'yyyy-mm-dd', s: 'in' }], [{ v: V.dP, s: 'b' }, xF('EOMONTH(B4,-1)', ser(D.RM[k - 1]), 'yyyy-mm-dd')],
    [{ v: V.dY, s: 'b' }, xF('EOMONTH(B4,-MONTH(B4))', ser(Math.round(Date.UTC(+d.slice(0, 4) - 1, 11, 31) / DAY)), 'yyyy-mm-dd')], [], xHdr([t.fx.fact, t.fx.fig, t.fx.val])];
  facts.forEach(f => { res.push([{ v: f.h, s: 'step' }, { v: f.text, s: 'b' }], [null, { v: `${t.how} ${f.calc}`, s: 'note' }]);
    const r0 = res.length + 1, c = i => `C${r0 + i}`; f.nums.forEach(n => res.push([null, n.l, n.v == null ? null : xF(n.f(c), n.v, n.z, 'res')])); res.push([]); });
  XL.sheet(wb, V.shF, res, { cols: [24, 70, 16], freeze: { r: 8 } });
  const rr = [xHdr(V.rh)];
  D.RM.forEach((x, j) => { const n = rr.length + 1, X = D.mkt[j], c = `${Vq}!A:A,"II",${Vq}!E:E,A${n}`;
    rr.push([{ v: ser(x), z: 'yyyy-mm-dd', s: 'in' }, { f: `IFERROR(SUMIFS(${Vq}!J:J,${c})/SUMIFS(${Vq}!I:I,${c}),"")`, v: X.w ?? '', z: Zr }, { f: `SUMIFS(${Vq}!J:J,${c})`, v: X.g, z: Zm },
      { f: `SUMIFS(${Vq}!G:G,${c})`, v: X.nav, z: Zm }, { f: `IFERROR(AVERAGEIFS(${Vq}!H:H,${Vq}!A:A,"III",${Vq}!E:E,A${n}),"")`, v: X.r3 ?? '', z: Zr },
      n === 2 ? { v: 100, z: '0.00', s: 'in' } : { f: `F${n - 1}*(1+N(B${n}))`, v: X.ix, z: '0.00' }]); });
  XL.sheet(wb, V.shR, rr, { cols: [12, 14, 16, 16, 14, 14], freeze: { r: 1 } });
  const vr = [xHdr(V.vh)], e = (f, v, z) => ({ f, v: v == null ? '' : v, z });
  D.fs.forEach(f => D.RM.forEach((x, j) => { const n = vr.length + 1;
    vr.push([f.pl, f.pv, f.gl, f.n, { v: ser(x), z: 'yyyy-mm-dd', s: 'in' }, f.m[j] == null ? null : { v: f.m[j], z: '0.0000', s: 'in' }, f.a[j] == null ? null : { v: f.a[j], z: '0.000', s: 'in' },
      e(`IF(AND(D${n}=D${n - 1},ISNUMBER(F${n}),ISNUMBER(F${n - 1})),F${n}/F${n - 1}-1,"")`, f.r[j], Zr), e(`IF(AND(ISNUMBER(H${n}),ISNUMBER(G${n - 1})),G${n - 1},"")`, f.w[j], '0.000'),
      e(`IF(ISNUMBER(I${n}),H${n}*I${n},"")`, f.w[j] == null ? null : f.r[j] * f.w[j], '0.0000'),
      e(`IFERROR(IF(AND(INDEX(D:D,ROW()-MONTH(E${n}))=D${n},ISNUMBER(F${n}),ISNUMBER(INDEX(F:F,ROW()-MONTH(E${n})))),F${n}/INDEX(F:F,ROW()-MONTH(E${n}))-1,""),"")`, f.y[j], Zr),
      e(`IFERROR(IF(AND(INDEX(D:D,ROW()-12)=D${n},ISNUMBER(F${n}),ISNUMBER(INDEX(F:F,ROW()-12))),F${n}/INDEX(F:F,ROW()-12)-1,""),"")`, f.y12[j], Zr),
      e(`IF(ISNUMBER(H${n}),COUNTIFS(A:A,A${n},C:C,C${n},E:E,E${n},H:H,">"&(H${n}+1E-12))+1,"")`, f.rk[j], Zi), e(`IF(ISNUMBER(H${n}),COUNTIFS(A:A,A${n},C:C,C${n},E:E,E${n},H:H,">-1"),"")`, f.ng[j], Zi)]); }));
  XL.sheet(wb, V.shV, vr, { cols: [7, 11, 22, 44, 12, 12, 14, 12, 14, 12, 12, 12, 10, 10], freeze: { r: 1 } });
  const meth = [[{ v: L ? 'Metodika ir šaltiniai' : 'Methodology and sources', s: 'title' }], [], ...V.legend.map(([a, b]) => [{ v: a, s: 'b' }, { v: b, s: 'note' }]), [],
    ...facts.map(f => [{ v: f.h, s: 'b' }, { v: f.calc, s: 'note' }]), [],
    [{ v: L ? 'Puslapis' : 'Page', s: 'b' }, { v: location.href.split('#')[0], l: location.href.split('#')[0], s: 'link' }], [{ v: L ? 'Failas sukurtas' : 'File created', s: 'b' }, new Date().toLocaleString(t.locale)],
    [{ v: L ? 'Pastaba' : 'Note', s: 'b' }, { v: L ? 'Informacinė medžiaga, ne investavimo rekomendacija. Valdytojų skelbiamos vertės gali būti vėliau patikslintos.' : 'For information only, not investment advice. Values published by managers may later be revised.', s: 'note' }]];
  XL.sheet(wb, L ? 'Metodika' : 'Methodology', meth, { cols: [28, 110], grid: false });
  await XL.save(wb, `${title.replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 40)}_${d}.xlsx`);
}
function renderMf() {
  const el = document.getElementById('mfCards'); if (!el) return;
  const t = T(), V = t.mf; document.getElementById('mfTitle').textContent = V.title; document.getElementById('mfLead').textContent = V.lead;
  if (!MFD) { el.innerHTML = ''; return; }
  document.getElementById('mfBar').innerHTML = `<div class="bar mkbar"><label class="field">${V.sel} <select id="mfSel">${MFD.RM.map((x, k) => k ? `<option value="${k}"${k === MFK ? ' selected' : ''}>${hEsc(V.mon(iso(x)))}</option>` : '').reverse().join('')}</select></label></div>`;
  factCards(el, mfFacts(MFK), V.title, 'II');
  document.getElementById('mfAll').textContent = t.copyAll; document.getElementById('mfXl').textContent = t.fx.xlAll;
  document.getElementById('mfNote').textContent = V.cR;
}
document.addEventListener('change', e => { if (e.target.id !== 'mfSel') return; MFK = +e.target.value; renderMf(); });

/* ---------- Išskleista kortelė – faktas perskaičiuojamas pagal pasirinkimą (savininkas 2026-10-20) ----------
   „Valdikliai tik priartina vaizdą, o ne perskaičiuoja“, „netinka linijinis grafikas“, „nėra galimybės patikrinti ilgesniais laikotarpiais“,
   „koreguoti rodomus valdytojus“. Kiekvienam faktui – tyrimo modelis (exOf): pasirinkus laikotarpį, datą, grupę ar valdytojus iš naujo
   apskaičiuojamas sakinys (kopijuojamas), grafikas (linija – lygiams laike, stulpeliai – pokyčiams ir srautams, horizontalūs – palyginimui)
   ir lentelė. Rūšys: lvl (lygis laike), flow (ketvirčių sumos), real (vertė prieš infliaciją / atlyginimus), ret (grąžos grupėse ir fonduose),
   mser / mgrp / mwin (mėnesio duomenys). Pradinis vaizdas atitinka kortelės faktą. */
addStrings({ ex: { per: 'Period', at: 'Date', from: 'From', to: 'To', all: 'Full history', y: n => `${n} y`, hor: 'Return', grp: 'Group', gAvg: 'Group averages', gLead: 'Leaders in all groups',
  view: 'View', vLine: 'Over time', vQ: 'Change by quarter', vY: 'Change by year', vSnap: 'Comparison', vQs: 'Quarters', vYs: 'Years', vC: 'Cumulative', vM: 'Months', vYr: 'Each year',
  who: 'Show', whoAll: 'Whole pillar', whoM: 'By manager', cp: 'Copy sentence', cpd: 'Copied', ttl: 'Click to edit the chart title (it goes into the image)', nums: 'Figures of the card fact (as in the Excel file)', none: 'No data for this choice.',
  h: { ytd: 'since the start of the year', '1y': 'over 1 year', '3y': 'over 3 years (annualised)', '5y': 'over 5 years (annualised)', gcf: 'since launch (annualised)', '10y': 'over 10 years (annualised)', '15y': 'over 15 years (annualised)', r: 'in the month', y: 'since the start of the year', y12: 'over 12 months' },
  hs: { ytd: 'Since start of year', '1y': '1 year', '3y': '3 years', '5y': '5 years', gcf: 'Since launch', '10y': '10 years', '15y': '15 years', r: 'Month', y: 'Since start of year', y12: '12 months' },
  up: 'rose', dn: 'fell', same: 'did not change', bigger: 'more', from_: (a, b) => `from ${a} to ${b}`,
  lvl1: (a, b, w, dir, va, vb, abs, rel) => `From ${a} to ${b} ${w} ${dir} from ${va} to ${vb} (${abs}${rel ? `, ${rel}` : ''}).`, cagr: v => `On average ${v} a year.`,
  lvlM: (a, b, w, xs) => `From ${a} to ${b} ${w}: ${xs}.`, rec: (v, d) => `The highest value in the period was ${v} (${d}).`, pos: (p, n) => `Positive at ${p} of ${n} quarter ends.`,
  flow1: (n, a, b, w, s) => `In ${n} quarters (${a} – ${b}) ${w} totalled ${s}.`, flowB: (p, n, hi, hv, lo, lv) => `${p} of ${n} quarters were positive; the largest was ${hi} (${hv}), the smallest ${lo} (${lv}).`,
  flowM: (n, a, b, w, xs) => `In ${n} quarters (${a} – ${b}) ${w}: ${xs}.`, flow0: (a, w, s) => `${a}: ${w} ${s}.`, flowM0: (a, w, xs) => `${a}, ${w}: ${xs}.`,
  real1: (a, b, pl, dir, r, c, e) => `From ${a} to ${b} the value of the average pillar ${pl} fund ${dir} ${r}${c ? ` (${c} a year)` : ''}: € 1,000 became € ${e}.`,
  realCpi: (dir, c, rr, pw) => `Prices (CPI) ${dir} ${c} over the same period, so the real return was ${rr}: purchasing power ${pw}.`,
  realW: (nm, dir, c, who, pp) => `${nm} ${dir} ${c} over the same period; ${who} grew faster (by ${pp} pp).`, fundsW: 'the funds',
  dd: (v, a, b, rec) => `The largest fall in the period was ${v} (${a} – ${b}); ${rec}.`, ddRec: n => `the loss was recovered in ${n} quarter(s)`, ddNo: 'the loss has not been recovered yet',
  retG: (d, h, pl, all, lo, lg, hi, hg) => `On ${d} the asset-weighted return of all pillar ${pl} funds ${h} was ${all}; group averages ranged from ${lo} (${lg}) to ${hi} (${hg}).`,
  retE: (lo, hi, h) => `€ 1,000 invested ${h} became € ${lo} – € ${hi}.`, ago: n => `${n} year(s) ago`,
  retF: (d, g, h, a, av, z, zv, avg, k, n) => `On ${d} in the ${g} group the return ${h}: best ${a} (${av}), weakest ${z} (${zv}); BoL weighted group average ${avg}. ${k} of ${n} funds beat the average.`,
  mser: (a, b, n, cum, p, hi, hv, lo, lv) => `From ${a} to ${b} (${n} months) the asset-weighted pillar II return totalled ${cum}; ${p} of ${n} months were positive. Best month ${hi} (${hv}), worst ${lo} (${lv}).`,
  mserG: (a, b, n, s, hi, hv, lo, lv) => `From ${a} to ${b} (${n} months) pillar II funds’ investment gain totalled ${s}. Largest ${hi} (${hv}), smallest ${lo} (${lv}).`,
  mserN: (a, b, va, vb, dir, abs) => `From the end of ${a} to the end of ${b} pillar II net assets ${dir} from ${va} to ${vb} (${abs}).`,
  mser3: (a, b, n, xs) => `From ${a} to ${b} (${n} months) cumulative average returns of pillar III categories: ${xs}.`,
  mgrp: (m, g, h, a, av, z, zv, gap) => `${m[0].toUpperCase() + m.slice(1)}, group ${g}, return ${h}: first ${a} (${av}), last ${z} (${zv}); gap ${gap} pp.`, mlead: (m, h, xs) => `${m} leaders (return ${h}): ${xs}.`,
  mwin: (y, p, n, tot, rest) => `In ${y} ${p} was first in its group most often – ${n} times of ${tot} (groups × months)${rest ? `; then ${rest}` : ''}.`,
  th: { item: 'Series', start: 'Start', end: 'End', chg: 'Change', chgP: 'Change, %', cagr: 'A year', q: 'Quarter', y: 'Year', sum: 'Total', fund: 'Value of average fund', cmp: 'Comparison', diff: 'Difference, pp', e: '€ 1,000 became', grp: 'Group', mgr: 'Manager', ret: 'Return', m: 'Month', n: 'Times first' } } },
{ ex: { per: 'Laikotarpis', at: 'Data', from: 'Nuo', to: 'Iki', all: 'Visa istorija', y: n => `${n} m.`, hor: 'Grąža', grp: 'Grupė', gAvg: 'Grupių vidurkiai', gLead: 'Lyderiai visose grupėse',
  view: 'Vaizdas', vLine: 'Laike', vQ: 'Pokytis per ketvirtį', vY: 'Pokytis per metus', vSnap: 'Palyginimas', vQs: 'Ketvirčiai', vYs: 'Metai', vC: 'Sukaupta', vM: 'Mėnesiai', vYr: 'Kasmet',
  who: 'Rodyti', whoAll: 'Visa pakopa', whoM: 'Pagal valdytojus', cp: 'Kopijuoti sakinį', cpd: 'Nukopijuota', ttl: 'Paspauskite ir pataisykite grafiko pavadinimą (jis patenka į paveikslėlį)', nums: 'Kortelės fakto skaičiai (kaip Excel faile)', none: 'Šiam pasirinkimui duomenų nėra.',
  h: { ytd: 'nuo metų pradžios', '1y': 'per 1 metus', '3y': 'per 3 metus (metinė)', '5y': 'per 5 metus (metinė)', gcf: 'nuo veiklos pradžios (metinė)', '10y': 'per 10 metų (metinė)', '15y': 'per 15 metų (metinė)', r: 'per mėnesį', y: 'nuo metų pradžios', y12: 'per 12 mėnesių' },
  hs: { ytd: 'Nuo metų pradžios', '1y': '1 metai', '3y': '3 metai', '5y': '5 metai', gcf: 'Nuo veiklos pradžios', '10y': '10 metų', '15y': '15 metų', r: 'Mėnesio', y: 'Nuo metų pradžios', y12: '12 mėn.' },
  up: 'padidėjo', dn: 'sumažėjo', same: 'nepakito', bigger: 'daugiau', from_: (a, b) => `nuo ${a} iki ${b}`,
  lvl1: (a, b, w, dir, va, vb, abs, rel) => `Nuo ${a} iki ${b} ${w} ${dir} nuo ${va} iki ${vb} (${abs}${rel ? `, ${rel}` : ''}).`, cagr: v => `Vidutiniškai – ${v} per metus.`,
  lvlM: (a, b, w, xs) => `Nuo ${a} iki ${b} ${w}: ${xs}.`, rec: (v, d) => `Didžiausia reikšmė per laikotarpį – ${v} (${d}).`, pos: (p, n) => `Teigiama ${p} iš ${n} ketvirčių pabaigų.`,
  flow1: (n, a, b, w, s) => `Per ${n} ketv. (${a} – ${b}) ${w} iš viso – ${s}.`, flowB: (p, n, hi, hv, lo, lv) => `Teigiamas ${p} iš ${n} ketvirčių; didžiausias – ${hi} (${hv}), mažiausias – ${lo} (${lv}).`,
  flowM: (n, a, b, w, xs) => `Per ${n} ketv. (${a} – ${b}) ${w}: ${xs}.`, flow0: (a, w, s) => `${a} ${w} – ${s}.`, flowM0: (a, w, xs) => `${a} ${w}: ${xs}.`,
  real1: (a, b, pl, dir, r, c, e) => `Nuo ${a} iki ${b} vidutinio ${pl} pakopos fondo vertė ${dir} ${r}${c ? ` (vidutiniškai ${c} per metus)` : ''}: 1 000 € virto ${e} €.`,
  realCpi: (dir, c, rr, pw) => `Kainos (VKI) per tą laiką ${dir} ${c}, todėl reali grąža – ${rr}: perkamoji galia ${pw}.`,
  realW: (nm, dir, c, who, pp) => `${nm} per tą laiką ${dir} ${c}; sparčiau augo ${who} (skirtumas – ${pp} p. p.).`, fundsW: 'fondai',
  dd: (v, a, b, rec) => `Didžiausias kritimas per laikotarpį – ${v} (${a} – ${b}); ${rec}.`, ddRec: n => `prarasta vertė atsigavo per ${n} ${n % 10 === 1 && n % 100 !== 11 ? 'ketvirtį' : n % 10 === 0 || (n % 100 > 10 && n % 100 < 20) ? 'ketvirčių' : 'ketvirčius'}`, ddNo: 'prarasta vertė dar neatsigavo',
  retG: (d, h, pl, all, lo, lg, hi, hg) => `${d} visų ${pl} pakopos fondų svertinė grąža ${h} – ${all}; grupių vidurkiai – nuo ${lo} („${lg}“) iki ${hi} („${hg}“).`,
  retE: (lo, hi, h) => `Prieš ${h} investuoti 1 000 € virto ${lo === hi ? `${lo} €` : `nuo ${lo} € iki ${hi} €`}.`, ago: n => `${n} m.`,
  retF: (d, g, h, a, av, z, zv, avg, k, n) => `${d} grupėje „${g}“ grąža ${h}: geriausiai sekėsi ${a} (${av}), silpniausiai – ${z} (${zv}); LB svertinis grupės vidurkis – ${avg}. Vidurkį viršijo ${k} iš ${n} fondų.`,
  mser: (a, b, n, cum, p, hi, hv, lo, lv) => `Nuo ${a} iki ${b} (${n} mėn.) II pakopos fondų svertinė grąža sukaupta – ${cum}; teigiami ${p} iš ${n} mėnesių. Geriausias mėnuo – ${hi} (${hv}), blogiausias – ${lo} (${lv}).`,
  mserG: (a, b, n, s, hi, hv, lo, lv) => `Nuo ${a} iki ${b} (${n} mėn.) II pakopos fondų investicinis prieaugis iš viso – ${s}. Didžiausias – ${hi} (${hv}), mažiausias – ${lo} (${lv}).`,
  mserN: (a, b, va, vb, dir, abs) => `Nuo ${a} pabaigos iki ${b} pabaigos II pakopos turtas ${dir} nuo ${va} iki ${vb} (${abs}).`,
  mser3: (a, b, n, xs) => `Nuo ${a} iki ${b} (${n} mėn.) III pakopos kategorijų vidutinė sukaupta grąža: ${xs}.`,
  mgrp: (m, g, h, a, av, z, zv, gap) => `${m[0].toUpperCase() + m.slice(1)} grupėje „${g}“ grąža ${h}: pirmas – ${a} (${av}), paskutinis – ${z} (${zv}); skirtumas – ${gap} p. p.`, mlead: (m, h, xs) => `${m} lyderiai (grąža ${h}): ${xs}.`,
  mwin: (y, p, n, tot, rest) => `${y} m. dažniausiai savo grupėje pirmas buvo ${p} – ${n} k. iš ${tot} (grupės × mėnesiai)${rest ? `; toliau ${rest}` : ''}.`,
  th: { item: 'Eilutė', start: 'Pradžia', end: 'Pabaiga', chg: 'Pokytis', chgP: 'Pokytis, %', cagr: 'Per metus', q: 'Ketvirtis', y: 'Metai', sum: 'Iš viso', fund: 'Vidutinio fondo vertė', cmp: 'Palyginimas', diff: 'Skirtumas, p. p.', e: '1 000 € virto', grp: 'Grupė', mgr: 'Valdytojas', ret: 'Grąža', m: 'Mėnuo', n: 'Kartų pirmas' } } });

/* stulpeliai (vertikalūs, grupuoti) ir horizontalūs stulpeliai – SVG, kaip drawLineChart (PNG ir „Kopijuoti“ veikia per chartTools) */
const svgEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function niceTicks(lo, hi, n = 5) {
  const span = hi - lo || 1, raw = span / n, p = 10 ** Math.floor(Math.log10(raw)), st = [1, 2, 2.5, 5, 10].map(x => x * p).find(x => x >= raw);
  const out = []; for (let v = Math.ceil(lo / st) * st; v <= hi + st * 1e-9; v += st) out.push(Math.abs(v) < st * 1e-9 ? 0 : v); return out;
}
function drawCols(el, cats, series, o = {}) {
  el.querySelectorAll('svg, p.na').forEach(s => s.remove());
  const W = o.width || el.clientWidth || 720, H = o.height || 260, m = { l: o.ml ?? 62, r: 12, t: 12, b: 38 }, ns = series.length;
  let lo = 0, hi = 0; series.forEach(s => s.v.forEach(v => { if (v != null && isFinite(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }));
  if (lo === hi) hi = 1; const pad = (hi - lo) * 0.08; if (hi > 0) hi += pad; if (lo < 0) lo -= pad;
  const ticks = niceTicks(lo, hi), Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b), bw = (W - m.l - m.r) / Math.max(1, cats.length), gw = bw * 0.78, w1 = gw / ns;
  const fmt = o.fmt || (v => num(v, 1)), afmt = o.afmt || fmt, every = Math.max(1, Math.ceil(cats.length / Math.floor((W - m.l - m.r) / 52)));
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">`;
  ticks.forEach(v => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" style="stroke:var(--grid);stroke-width:1"/><text x="${m.l - 6}" y="${Y(v) + 4}" style="fill:var(--text-3);font-size:11px;text-anchor:end">${svgEsc(afmt(v))}</text>`; });
  cats.forEach((c, i) => {
    const x0 = m.l + i * bw + (bw - gw) / 2;
    series.forEach((sr, j) => { const v = sr.v[i]; if (v == null || !isFinite(v)) return; const y = Y(Math.max(0, v)), h = Math.abs(Y(v) - Y(0)) || 1;
      const col = o.sign && ns === 1 ? (v >= 0 ? 'var(--dpos)' : 'var(--dneg)') : sr.c;
      s += `<rect x="${x0 + j * w1}" y="${y}" width="${Math.max(1, w1 - 1)}" height="${h}" style="fill:${col}"><title>${svgEsc(`${c} · ${sr.l}: ${fmt(v)}`)}</title></rect>`;
      if (o.labels && cats.length * ns <= 14) s += `<text x="${x0 + j * w1 + w1 / 2}" y="${v >= 0 ? y - 4 : y + h + 12}" style="fill:var(--text-2);font-size:10.5px;text-anchor:middle">${svgEsc(fmt(v))}</text>`; });
    if (i % every === 0) s += `<text x="${m.l + i * bw + bw / 2}" y="${H - m.b + 16}" style="fill:var(--text-3);font-size:11px;text-anchor:middle">${svgEsc(c)}</text>`;
  });
  s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--axis);stroke-width:1"/></svg>`;
  el.insertAdjacentHTML('afterbegin', s); el._legend = ns > 1 ? series.map(x => ({ c: x.c, l: x.l })) : [];
}
function drawHBars(el, rows, o = {}) {
  el.querySelectorAll('svg, p.na').forEach(s => s.remove());
  const W = o.width || el.clientWidth || 720, rh = 24, fmt = o.fmt || (v => num(v, 1)), lw = Math.min(260, Math.max(70, ...rows.map(r => String(r.l).length * 6.6))) + 10;
  const H = rows.length * rh + 16, vals = rows.map(r => r.v).filter(v => v != null && isFinite(v)), lo = Math.min(0, ...vals), hi = Math.max(0, ...vals) || 1, vw = 64;
  const X = v => lw + (v - lo) / (hi - lo || 1) * (W - lw - vw - 8);
  let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">`;
  rows.forEach((r, i) => { const y = 8 + i * rh, v = r.v; if (v == null || !isFinite(v)) return; const x = Math.min(X(0), X(v)), w = Math.max(1, Math.abs(X(v) - X(0)));
    s += `<text x="${lw - 8}" y="${y + 15}" style="fill:var(--text-2);font-size:12px;text-anchor:end;font-weight:${r.b ? 600 : 400}">${svgEsc(r.l)}</text>`
      + `<rect x="${x}" y="${y + 3}" width="${w}" height="${rh - 8}" rx="2" style="fill:${r.c || 'var(--s1)'};opacity:${r.dim ? 0.45 : 1}"><title>${svgEsc(`${r.l}: ${fmt(v)}`)}</title></rect>`
      + `<text x="${v >= 0 ? x + w + 5 : x - 5}" y="${y + 15}" style="fill:var(--text);font-size:11.5px;text-anchor:${v >= 0 ? 'start' : 'end'}">${svgEsc(fmt(v))}</text>`; });
  if (lo < 0) s += `<line x1="${X(0)}" x2="${X(0)}" y1="4" y2="${H - 4}" style="stroke:var(--axis);stroke-width:1"/>`;
  el.insertAdjacentHTML('afterbegin', s + '</svg>'); el._legend = [];
}

/* tyrimo variklis */
const XU = { mn: v => mMn(v), int: v => mInt(v), eur: v => `${mInt(v)} €`, pct: v => pctPlain(v, 2) };
const xAbs = (d, u) => u === 'pct' ? `${num(Math.abs(d), 2)} ${lang === 'lt' ? 'p. p.' : 'pp'}` : XU[u](Math.abs(d));
const xSg = (d, u) => (d >= 0 ? '+' : '−') + xAbs(d, u);
const xDir = v => { const E = T().ex; return v > 0 ? E.up : v < 0 ? E.dn : E.same; };
const xYrs = (a, b) => (dayOf(b) - dayOf(a)) / 365.25;
const xCagr = (va, vb, yrs) => va > 0 && vb > 0 && yrs >= 1.5 ? pctPlain(((vb / va) ** (1 / yrs) - 1) * 100) : '';
const yEndL = y => lang === 'lt' ? `${y} m. pabaigos` : `the end of ${y}`;
const CMPN = { lt: { cpi: ['Kainos (VKI)', 'kainos'], w: ['Vidutinis neto darbo užmokestis', 'atlyginimai'], p: ['Vidutinė senatvės pensija', 'pensijos'], m: ['Minimali mėnesinė alga (neto)', 'MMA'] },
  en: { cpi: ['Prices (CPI)', 'prices'], w: ['The average net wage', 'wages'], p: ['The average old-age pension', 'pensions'], m: ['The net minimum wage', 'the minimum wage'] } };
const cmpN = k => (CMPN[lang] || CMPN.lt)[k];
const lastD = pl => MKT[pl].dates[MKT[pl].dates.length - 1];
const atIdx = (pl, d) => { const ds = MKT[pl].dates; let i = ds.indexOf(d); if (i < 0) i = ds.filter(x => x <= d).length - 1; return Math.max(0, i); };
const mgrsAt = (pl, di) => Object.entries(byMgr(pl, di)).sort((a, b) => b[1].nav - a[1].nav).map(([m]) => m);

/* periodo valdikliai: ds – reikšmių sąrašas, lab – pavadinimas, per – žingsnių per metus */
function xPeriod(o, ds, lab, per, min = 0, inc = 0) {   // min – pirmas leidžiamas indeksas; inc – 1, kai abu galai įskaičiuojami (ketvirčių / mėnesių sumos)
  const t = T().ex, span = (ds.length - 1 - min + inc) / per, opt = cur => ds.map((x, i) => i < min ? '' : `<option value="${i}"${i === cur ? ' selected' : ''}>${hEsc(lab(x))}</option>`).join('');
  const at = `data-xper="${per}" data-xmin="${min}" data-xinc="${inc}"`;
  const pr = [1, 3, 5, 10].filter(n => n < span - 0.01).map(n => `<button type="button" data-xy="${n}" ${at} aria-pressed="${o.b - o.a + inc === n * per}">${t.y(n)}</button>`).join('');
  return `<span class="seg">${pr}<button type="button" data-xy="0" ${at} aria-pressed="${o.a === min}">${t.all}</button></span><label class="field">${t.from} <select data-xk="a">${opt(o.a)}</select></label><label class="field">${t.to} <select data-xk="b">${opt(o.b)}</select></label>`;
}
const xSeg = (k, cur, opts, lbl) => `<span class="seg" role="group"${lbl ? ` aria-label="${hEsc(lbl)}"` : ''}>${opts.map(([v, l]) => `<button type="button" data-xk="${k}" data-xv="${v}" aria-pressed="${String(v) === String(cur)}">${hEsc(l)}</button>`).join('')}</span>`;
const xSel = (k, cur, opts, lbl) => `<label class="field">${hEsc(lbl)} <select data-xk="${k}">${opts.map(([v, l]) => `<option value="${v}"${String(v) === String(cur) ? ' selected' : ''}>${hEsc(l)}</option>`).join('')}</select></label>`;
const xChips = (ms, on, col = mkColor) => `<div class="chips fleg">${ms.map(m => `<button type="button" class="chip" data-xm="${hEsc(m)}" aria-pressed="${on.has(m)}"><i style="background:${col(m)}"></i>${hEsc(m)}</button>`).join('')}</div>`;

const EXK = {
  /* lygis laike (turtas, dalyviai, dalys, santykiai): sp = { pl, u, w, fn?(di), mfn?(m, di), wm?, lab, rec?, pos?, dy?, who?, ms?, view? } */
  lvl: {
    init(sp) { const pl = sp.pl, b = atIdx(pl, MS.d), ds = MKT[pl].dates.map((d, i) => i).filter(i => i <= MKT[pl].dates.length - 1);
      const who = sp.fn ? sp.who || 'all' : 'm', ms = new Set(sp.ms || topMgrs(pl, 4)); return { ds, b, a: sp.dy === 0 ? 0 : Math.max(0, b - 4 * (sp.dy || 1)), who, ms, view: sp.view || 'line' }; },
    run(sp, o) {
      const t = T(), E = t.ex, pl = sp.pl, D = MKT[pl].dates, u = sp.u, A = D[o.a], B = D[o.b], mList = sp.mfn ? (sp.mlist ? sp.mlist(o.b) : mgrsAt(pl, o.b)) : [], col = sp.mcol || mkColor;
      const ser = o.who === 'all' ? [{ l: sp.lab, c: 'var(--s1)', fn: sp.fn }] : mList.filter(m => o.ms.has(m)).map(m => ({ l: m, c: col(m), fn: di => sp.mfn(m, di) }));
      const idx = []; for (let i = o.a; i <= o.b; i++) idx.push(i);
      const S = ser.map(s => ({ ...s, vals: idx.map(i => { const v = s.fn(i); return v == null || !isFinite(v) ? null : v; }) })).filter(s => s.vals.some(v => v != null));
      if (!S.length) return null;
      const first = s => s.vals.find(v => v != null), last = s => [...s.vals].reverse().find(v => v != null), yrs = xYrs(A, B);
      let text;
      if (S.length === 1) { const s = S[0], va = first(s), vb = last(s), d = vb - va;
        text = E.lvl1(t.dLong(A), t.dLong(B), o.who === 'm' ? (sp.w1 ? sp.w1(s.l) : `${s.l}: ${sp.wm}`) : sp.w, xDir(d), XU[u](va), XU[u](vb), xAbs(d, u), u !== 'pct' && va ? pctPlain(Math.abs(vb / va - 1) * 100) : '');
        const cg = u !== 'pct' && sp.cagr !== false ? xCagr(va, vb, yrs) : ''; if (cg) text += ' ' + E.cagr(cg);
        if (sp.rec) { let mi = 0; s.vals.forEach((v, i) => { if (v != null && v > s.vals[mi]) mi = i; }); text += ' ' + E.rec(XU[u](s.vals[mi]), t.dLong(D[idx[mi]])); }
        if (sp.pos) { const xs = s.vals.filter(v => v != null); text += ' ' + E.pos(xs.filter(v => v > 0).length, xs.length); }
      } else text = E.lvlM(t.dLong(A), t.dLong(B), sp.wm || sp.w, S.map(s => `${s.l} – ${E.from_(XU[u](first(s)), XU[u](last(s)))} (${xSg(last(s) - first(s), u)})`).join('; '));
      let ch;
      if (o.view === 'q') { const cats = idx.slice(1).map(i => t.dq(D[i])); ch = { t: 'cols', cats, ser: S.map(s => ({ l: s.l, c: s.c, v: s.vals.slice(1).map((v, j) => v != null && s.vals[j] != null ? v - s.vals[j] : null) })), u, sign: S.length === 1 }; }
      else if (o.view === 'y') { const ye = []; idx.forEach((i, j) => { const y = D[i].slice(0, 4); if (j === idx.length - 1 || D[idx[j + 1]].slice(0, 4) !== y) ye.push(j); });
        ch = { t: 'cols', cats: ye.slice(1).map(j => D[idx[j]].slice(0, 4)), ser: S.map(s => ({ l: s.l, c: s.c, v: ye.slice(1).map((j, k) => s.vals[j] != null && s.vals[ye[k]] != null ? s.vals[j] - s.vals[ye[k]] : null) })), u, sign: S.length === 1 }; }
      else if (o.view === 'snap') { const R = [...S].sort((a, b) => last(b) - last(a));
        ch = { t: 'cols', cats: R.map(s => s.l), ser: [{ l: t.dq(A), c: '#a9b3bd', v: R.map(first) }, { l: t.dq(B), c: 'var(--s1)', v: R.map(last) }], u }; }
      else ch = { t: 'line', ser: S.map(s => ({ l: s.l, c: s.c, pts: idx.map((i, j) => s.vals[j] == null ? null : [dayOf(D[i]), s.vals[j]]).filter(Boolean) })), u };
      const views = [['line', E.vLine], ['q', E.vQ], ['y', E.vY]].concat(S.length > 1 || o.who === 'm' ? [['snap', E.vSnap]] : []);
      const ctl = xPeriod(o, D, d => t.dq(d), 4) + (sp.fn && sp.mfn ? xSeg('who', o.who, [['all', E.whoAll], ['m', E.whoM]]) : '') + xSeg('view', o.view, views)
        + (o.who === 'm' ? xChips(mList, o.ms, col) : '');
      return { text, ch, ctl, title: `${sp.lab}: ${t.dq(A)} – ${t.dq(B)}`,
        head: [E.th.item, t.dq(A), t.dq(B), E.th.chg].concat(u !== 'pct' ? [E.th.chgP, E.th.cagr] : []), rows: S.map(s => { const va = first(s), vb = last(s); return [s.l, XU[u](va), XU[u](vb), xSg(vb - va, u)].concat(u !== 'pct' ? [va ? pct((vb / va - 1) * 100) : '–', xCagr(va, vb, yrs) || '–'] : []); }) };
    } },
  /* ketvirčių sumos (prieaugis, srautai, dalyvių pokyčiai): sp = { pl, u, w, ser?: [{l, c, fn(di)}], mfn?(m, di), lab, n?, ytd? } */
  flow: {
    init(sp) { const pl = sp.pl, b = atIdx(pl, MS.d), D = MKT[pl].dates, a = sp.ytd ? D.findIndex(d => d.slice(0, 4) === D[b].slice(0, 4)) : Math.max(1, b - (sp.n || 4) + 1);
      return { b, a: sp.all ? 1 : a, who: sp.ser ? 'all' : 'm', ms: new Set(sp.ms || topMgrs(pl, 4)), view: sp.view || 'q' }; },
    run(sp, o) {
      const t = T(), E = t.ex, pl = sp.pl, D = MKT[pl].dates, u = sp.u, mList = sp.mfn ? mgrsAt(pl, o.b) : [];
      const ser = o.who === 'all' ? sp.ser : mList.filter(m => o.ms.has(m)).map(m => ({ l: m, c: mkColor(m), fn: di => sp.mfn(m, di) }));
      const idx = []; for (let i = Math.max(1, o.a); i <= o.b; i++) idx.push(i);
      const S = ser.map(s => ({ ...s, vals: idx.map(i => { const v = s.fn(i); return v == null || !isFinite(v) ? null : v; }) })).filter(s => s.vals.some(v => v != null));
      if (!S.length || !idx.length) return null;
      const sum = s => s.vals.reduce((a, v) => a + (v || 0), 0), A = t.dq(D[idx[0]]), B = t.dq(D[idx[idx.length - 1]]), n = idx.length;
      let text;
      if (S.length === 1) { const s = S[0]; text = n === 1 ? E.flow0(A, sp.w, xSg(sum(s), u)) : E.flow1(n, A, B, sp.w, xSg(sum(s), u).replace(/^\+/, ''));
        if (n >= 3) { let hi = 0, lo = 0; s.vals.forEach((v, i) => { if (v != null && v > s.vals[hi]) hi = i; if (v != null && v < s.vals[lo]) lo = i; });
          text += ' ' + E.flowB(s.vals.filter(v => v > 0).length, n, t.dq(D[idx[hi]]), xSg(s.vals[hi], u), t.dq(D[idx[lo]]), xSg(s.vals[lo], u)); } }
      else text = (n === 1 ? E.flowM0(A, sp.w, S.map(s => `${s.sl || s.l} – ${xSg(sum(s), u)}`).join('; ')) : E.flowM(n, A, B, sp.w, S.map(s => `${s.sl || s.l} – ${xSg(sum(s), u)}`).join('; ')));
      const years = [...new Set(idx.map(i => D[i].slice(0, 4)))], ySum = (s, y) => s.vals.reduce((a, v, j) => a + (D[idx[j]].slice(0, 4) === y ? v || 0 : 0), 0);
      let ch;
      if (o.view === 'y') ch = { t: 'cols', cats: years, ser: S.map(s => ({ l: s.l, c: s.c, v: years.map(y => ySum(s, y)) })), u, sign: S.length === 1 };
      else if (o.view === 'c') ch = { t: 'line', ser: S.map(s => { let c = 0; return { l: s.l, c: s.c, pts: idx.map((i, j) => { c += s.vals[j] || 0; return [dayOf(D[i]), c]; }) }; }), u };
      else ch = { t: 'cols', cats: idx.map(i => t.dq(D[i])), ser: S.map(s => ({ l: s.l, c: s.c, v: s.vals })), u, sign: S.length === 1 };
      const ctl = xPeriod(o, D, d => t.dq(d), 4, 1, 1)
        + (sp.ser && sp.mfn ? xSeg('who', o.who, [['all', E.whoAll], ['m', E.whoM]]) : '') + xSeg('view', o.view, [['q', E.vQs], ['y', E.vYs], ['c', E.vC]]) + (o.who === 'm' ? xChips(mList, o.ms) : '');
      return { text, ch, ctl, title: `${sp.lab}: ${A} – ${B}`, head: [E.th.y, ...S.map(s => s.l)], rows: years.map(y => [y, ...S.map(s => xSg(ySum(s, y), u))]).concat([[E.th.sum, ...S.map(s => xSg(sum(s), u))]]) };
    } },
  /* vidutinio fondo vertė prieš infliaciją ar atlyginimus: sp = { pl, cmp: null|'cpi'|'w'|'p'|'m', dy?, dd?, view? } */
  real: {
    axis(sp) { const pl = sp.pl, C = chainOf(pl, lastD(pl)), D = MKT[pl].dates;
      if (sp.cmp && sp.cmp !== 'cpi') { const S2 = wSer(sp.cmp), ys = Object.keys(C.base).map(Number).filter(y => S2[y] != null).sort((a, b) => a - b);
        return { yearly: true, keys: ys, lab: y => String(y), long: yEndL, F: y => C.base[y], Cm: y => S2[y], per: 1 }; }
      const ks = D.map((d, i) => i).filter(i => C.idx[i] != null && (sp.cmp !== 'cpi' || cpiM(D[i].slice(0, 7)) != null));
      const d0 = `${C.fy - 1}-12-31`, dt = i => i < 0 ? d0 : D[i], ok0 = sp.cmp !== 'cpi' || cpiM(d0.slice(0, 7)) != null;   // −1 – praėjusių metų gruodžio 31 d. (indeksas 100)
      return { yearly: false, keys: (ok0 ? [-1] : []).concat(ks), lab: i => T().dq(dt(i)), long: i => T().dLong(dt(i)), F: i => i < 0 ? C.base[C.fy - 1] : C.idx[i], Cm: i => sp.cmp === 'cpi' ? cpiM(dt(i).slice(0, 7)) : null, per: 4, date: dt }; },
    init(sp) { const X = this.axis(sp), n = X.keys.length - 1, b = X.yearly ? n : Math.max(0, X.keys.filter(i => X.date(i) <= MS.d).length - 1);
      return { b, a: sp.dy === 0 ? 0 : Math.max(0, b - X.per * (sp.dy || 5)), view: sp.view || 'c' }; },
    run(sp, o) {
      const t = T(), E = t.ex, X = this.axis(sp), K = X.keys, ka = K[o.a], kb = K[o.b]; if (ka == null || kb == null || o.a >= o.b) return null;
      const r = X.F(kb) / X.F(ka) - 1, yrs = X.yearly ? kb - ka : xYrs(X.date(ka), X.date(kb));
      let text = E.real1(X.long(ka), X.long(kb), sp.pl, xDir(r), pctPlain(Math.abs(r) * 100), yrs >= 1.5 ? pct(((1 + r) ** (1 / yrs) - 1) * 100) : '', mInt(1000 * (1 + r)));
      let c = null;
      if (sp.cmp) { c = X.Cm(kb) / X.Cm(ka) - 1; const N = cmpN(sp.cmp);
        if (sp.cmp === 'cpi') { const rr = (1 + r) / (1 + c) - 1; text += ' ' + E.realCpi(c >= 0 ? (lang === 'lt' ? 'pakilo' : 'rose') : (lang === 'lt' ? 'nukrito' : 'fell'), pctPlain(Math.abs(c) * 100), pct(rr * 100), xDir(rr)); }
        else text += ' ' + E.realW(N[0], c >= 0 ? (lang === 'lt' ? 'išaugo' : 'rose') : (lang === 'lt' ? 'sumažėjo' : 'fell'), pctPlain(Math.abs(c) * 100), r > c ? E.fundsW : N[1], num(Math.abs(r - c) * 100, 2)); }
      const seg = K.slice(o.a, o.b + 1);
      if (sp.dd && !X.yearly) { let pk = seg[0], best = { v: 0 }; seg.forEach(k => { if (X.F(k) > X.F(pk)) pk = k; const v = X.F(k) / X.F(pk) - 1; if (v < best.v) best = { v, p: pk, tr: k }; });
        if (best.v < 0) { const after = K.filter(k => k > best.tr), rec = after.find(k => X.F(k) >= X.F(best.p)); text += ' ' + E.dd(pctPlain(Math.abs(best.v) * 100), X.lab(best.p), X.lab(best.tr), rec != null ? E.ddRec(K.indexOf(rec) - K.indexOf(best.tr)) : E.ddNo); } }
      /* metų atkarpos: kiekvienų metų paskutinis taškas (ir pradžia) */
      const ends = [0]; seg.forEach((k, j) => { if (j && (j === seg.length - 1 || (X.yearly ? true : X.date(seg[j + 1]).slice(0, 4) !== X.date(k).slice(0, 4)))) ends.push(j); });
      const ylab = j => X.yearly ? String(seg[j]) : X.date(seg[j]).slice(0, 4) + (X.date(seg[j]).slice(5) === '12-31' ? '' : ` (${X.lab(seg[j])})`);
      const yr = ends.slice(1).map((j, i) => { const p = seg[ends[i]], q = seg[j], fr = X.F(q) / X.F(p) - 1, cr = sp.cmp ? X.Cm(q) / X.Cm(p) - 1 : null; return { l: ylab(j), fr, cr, e: 1000 * X.F(q) / X.F(ka) }; });
      const N = sp.cmp ? cmpN(sp.cmp) : null; let ch;
      if (o.view === 'y') ch = { t: 'cols', cats: yr.map(x => x.l.slice(0, 4)), ser: [{ l: E.th.fund, c: 'var(--s1)', v: yr.map(x => x.fr * 100) }].concat(sp.cmp ? [{ l: N[0], c: 'var(--s6)', v: yr.map(x => x.cr * 100) }] : []), u: 'pct', sign: !sp.cmp };
      else ch = { t: 'line', ser: [{ l: `${E.th.fund} (${X.lab(ka)} = 100)`, c: 'var(--s1)', pts: seg.map(k => [X.yearly ? dayOf(`${k}-12-31`) : dayOf(X.date(k)), X.F(k) / X.F(ka) * 100]) }]
        .concat(sp.cmp ? [{ l: `${N[0]} (= 100)`, c: 'var(--s6)', pts: seg.map(k => [X.yearly ? dayOf(`${k}-12-31`) : dayOf(X.date(k)), X.Cm(k) / X.Cm(ka) * 100]) }] : []), u: 'int' };
      const ctl = xPeriod(o, K, X.lab, X.per) + xSeg('view', o.view, [['c', E.vC], ['y', E.vYr]]);
      return { text, ch, ctl, title: `${sp.cmp ? `${E.th.fund} / ${N[0]}` : E.th.fund}: ${X.lab(ka)} – ${X.lab(kb)}`,
        head: [E.th.y, E.th.ret].concat(sp.cmp ? [N[0], E.th.diff] : []).concat([E.th.e]),
        rows: yr.map(x => [x.l, pct(x.fr * 100)].concat(sp.cmp ? [pct(x.cr * 100), (x.fr - x.cr >= 0 ? '+' : '−') + num(Math.abs(x.fr - x.cr) * 100, 2)] : []).concat([`${mInt(x.e)} €`])) };
    } },
  /* grąžos grupėse ir grupės fonduose: sp = { pl, h?, g?, eur? } */
  ret: {
    init(sp) { return { at: atIdx(sp.pl, MS.d), h: sp.h || 'ytd', g: sp.g ?? '', ms: new Set(MK_PROV) }; },
    run(sp, o) {
      const t = T(), E = t.ex, pl = sp.pl, di = o.at, d = MKT[pl].dates[di], key = 'ret_' + o.h, gs = groupsAt(pl, di), ALL = lang === 'lt' ? 'Visi fondai' : 'All funds';
      const hz = ['ytd', '1y', '3y', '5y', '10y', '15y', 'gcf'].filter(h => MA['ret_' + h] != null && gs.concat([-1]).some(g => { const a = avgOf(pl, di, g); return a && a[MA['ret_' + h]] != null; }));
      const H = hz.includes(o.h) ? o.h : 'ytd', k = 'ret_' + H, hl = E.h[H], yrs = { '1y': 1, '3y': 3, '5y': 5, '10y': 10, '15y': 15 }[H];
      const Ee = v => yrs ? 1000 * (1 + v / 100) ** yrs : null;
      let text, rows;
      if (o.g === '' || !gs.includes(+o.g)) {
        rows = gs.map(g => ({ l: groupLbl(pl, g), v: (avgOf(pl, di, g) || [])[MA[k]] ?? null, c: 'var(--s1)' })).filter(r => r.v != null);
        const all = (avgOf(pl, di, -1) || [])[MA[k]]; if (!rows.length) return null;
        const so = [...rows].sort((a, b) => a.v - b.v), lo = so[0], hi = so[so.length - 1];
        text = E.retG(t.dLong(d), hl, pl, all != null ? pct(all) : '–', pct(lo.v), lo.l, pct(hi.v), hi.l);
        if (sp.eur && yrs) text += ' ' + E.retE(mInt(Ee(lo.v)), mInt(Ee(hi.v)), E.ago(yrs));
        if (all != null) rows.push({ l: ALL, v: all, c: 'var(--text-3)', b: 1 });
      } else {
        const g = +o.g, rs = rowsAt(pl, di).filter(r => fundOf(pl, r)[2] === g && r[MC[k]] != null), mgrs = rs.map(r => fundOf(pl, r)[0]);
        rows = rs.map(r => { const f = fundOf(pl, r), dup = mgrs.filter(x => x === f[0]).length > 1; return { l: dup ? f[1] : f[0], m: f[0], v: r[MC[k]], c: mkColor(f[0]), dim: !o.ms.has(f[0]) }; }).sort((a, b) => b.v - a.v);
        const avg = (avgOf(pl, di, g) || [])[MA[k]]; if (!rows.length) return null;
        const a = rows[0], z = rows[rows.length - 1];
        text = E.retF(t.dLong(d), groupLbl(pl, g), hl, a.l, pct(a.v), z.l, pct(z.v), avg != null ? pct(avg) : '–', avg != null ? rows.filter(r => r.v > avg).length : '–', rows.length);
        if (avg != null) rows.push({ l: t.thAvg, v: avg, c: 'var(--text-3)', b: 1 });
      }
      const ctl = xSel('at', di, MKT[pl].dates.map((x, i) => [i, t.dq(x)]).reverse(), E.at) + xSeg('h', H, hz.map(h => [h, E.hs[h]]))
        + xSel('g', o.g, [['', E.gAvg]].concat(gs.map(g => [g, groupLbl(pl, g)])), E.grp) + (o.g !== '' ? xChips([...new Set(rows.map(r => r.m).filter(Boolean))], o.ms) : '');
      return { text, ch: { t: 'hbar', rows, u: 'pct' }, ctl, title: `${o.g === '' ? E.gAvg : groupLbl(pl, +o.g)}: ${E.hs[H]}, ${t.dq(d)}`,
        head: [o.g === '' ? E.th.grp : E.th.mgr, `${E.th.ret} ${hl}`].concat(yrs ? [E.th.e] : []), rows: rows.map(r => [r.l, pct(r.v)].concat(yrs ? [`${mInt(Ee(r.v))} €`] : [])) };
    } },
  /* mėnesio eilutės: sp = { key: 'w'|'g'|'nav'|'r3', n? } */
  mser: {
    init(sp) { const b = MFK; return { b, a: Math.max(1, b - (sp.n || 12) + 1), view: sp.view || (sp.key === 'r3' ? 'c' : 'm') }; },
    run(sp, o) {
      const t = T(), E = t.ex, V = t.mf, D = MFD, RM = D.RM, idx = []; for (let k = Math.max(1, o.a); k <= o.b; k++) idx.push(k);
      if (!idx.length) return null;
      const L = k => V.mon(iso(RM[k])), G = k => V.gen(iso(RM[k])), A = G(idx[0]), B = G(idx[idx.length - 1]), n = idx.length, c3 = ['bond', 'mixed', 'equity'].map(c => (CAT3[lang] || CAT3.lt)[c]);
      const S = sp.key === 'r3' ? c3.map((gl, i) => ({ l: gl, c: `var(--s${i + 1})`, v: idx.map(k => { const xs = D.III.filter(f => f.gl === gl && f.r[k] != null); return xs.length ? xs.reduce((s, f) => s + f.r[k], 0) / xs.length * 100 : null; }) }))
        : [{ l: sp.key === 'w' ? V.sR : sp.key === 'g' ? V.lGain : V.sNav, c: 'var(--s1)', v: idx.map(k => { const x = D.mkt[k]; return sp.key === 'w' ? (x.w == null ? null : x.w * 100) : sp.key === 'g' ? x.g : x.nav || null; }) }];
      const u = sp.key === 'g' || sp.key === 'nav' ? 'mn' : 'pct', cum = v => v.reduce((a, x) => a * (1 + (x || 0) / 100), 1) - 1;
      let text; const s0 = S[0], hiI = s0.v.reduce((m, v, i) => v != null && (s0.v[m] == null || v > s0.v[m]) ? i : m, 0), loI = s0.v.reduce((m, v, i) => v != null && (s0.v[m] == null || v < s0.v[m]) ? i : m, 0);
      if (sp.key === 'w') text = E.mser(A, B, n, pct(cum(s0.v) * 100), s0.v.filter(v => v > 0).length, L(idx[hiI]), pct(s0.v[hiI]), L(idx[loI]), pct(s0.v[loI]));
      else if (sp.key === 'g') text = E.mserG(A, B, n, xSg(s0.v.reduce((a, v) => a + (v || 0), 0), 'mn'), L(idx[hiI]), xSg(s0.v[hiI], 'mn'), L(idx[loI]), xSg(s0.v[loI], 'mn'));
      else if (sp.key === 'nav') { const va = D.mkt[idx[0] - 1].nav || s0.v[0], vb = s0.v[n - 1]; text = E.mserN(G(idx[0] - 1 >= 1 ? idx[0] - 1 : idx[0]), B, mMn(va), mMn(vb), xDir(vb - va), xAbs(vb - va, 'mn')); }
      else text = E.mser3(A, B, n, S.map(s => `${s.l} – ${pct(cum(s.v) * 100)}`).join('; '));
      const years = [...new Set(idx.map(k => iso(RM[k]).slice(0, 4)))], yv = (s, y) => { const xs = s.v.filter((v, j) => iso(RM[idx[j]]).slice(0, 4) === y); return u === 'pct' ? cum(xs) * 100 : sp.key === 'nav' ? xs[xs.length - 1] : xs.reduce((a, v) => a + (v || 0), 0); };
      let ch;
      if (o.view === 'y') ch = { t: 'cols', cats: years, ser: S.map(s => ({ l: s.l, c: s.c, v: years.map(y => yv(s, y)) })), u, sign: S.length === 1 && sp.key !== 'nav' };
      else if (o.view === 'c' || sp.key === 'nav') ch = { t: 'line', ser: S.map(s => { let c = u === 'pct' ? 100 : 0; return { l: s.l, c: s.c, pts: idx.map((k, j) => { if (sp.key === 'nav') return s.v[j] == null ? null : [RM[k], s.v[j]]; c = u === 'pct' ? c * (1 + (s.v[j] || 0) / 100) : c + (s.v[j] || 0); return [RM[k], c]; }).filter(Boolean) }; }), u: u === 'pct' ? 'int' : 'mn' };
      else ch = { t: 'cols', cats: idx.map(k => iso(RM[k]).slice(0, 7)), ser: S.map(s => ({ l: s.l, c: s.c, v: s.v })), u, sign: S.length === 1 };
      const views = sp.key === 'nav' ? [['m', E.vLine], ['y', E.vYs]] : [['m', E.vM], ['y', E.vYs], ['c', E.vC]];
      const ctl = xPeriod(o, RM, x => V.mon(iso(x)), 12, 1, 1) + xSeg('view', o.view, views);
      return { text, ch, ctl, title: `${S.length === 1 ? S[0].l : t.mf.h3}: ${L(idx[0])} – ${L(idx[idx.length - 1])}`, head: [E.th.y, ...S.map(s => s.l)], rows: years.map(y => [y, ...S.map(s => u === 'pct' ? pct(yv(s, y)) : sp.key === 'nav' ? mMn(yv(s, y)) : xSg(yv(s, y), 'mn'))]) };
    } },
  /* mėnesio grąžos grupėje: sp = { pl, h? } */
  mgrp: {
    init(sp) { return { at: MFK, h: sp.h || 'r', g: sp.g || '*' }; },
    run(sp, o) {
      const t = T(), E = t.ex, V = t.mf, D = MFD, k = o.at, pl = sp.pl, key = o.h, c3 = CAT3[lang] || CAT3.lt;
      const gs = pl === 'II' ? DATA.groups.map(g => groupLabel(g)) : ['bond', 'mixed', 'equity'].map(c => c3[c]), lab = f => pl === 'II' ? f.pv : f.n, m = V.mon(iso(D.RM[k])), mg = V.gen(iso(D.RM[k])), ma = V.inM(iso(D.RM[k]));
      let rows, text;
      if (o.g === '*') { rows = gs.map(gl => { const b = D.fs.filter(f => f.pl === pl && f.gl === gl && f[key][k] != null).sort((a, b) => b[key][k] - a[key][k])[0]; return b ? { l: `${gl} – ${lab(b)}`, v: b[key][k] * 100, c: mkColor(b.pv) } : null; }).filter(Boolean);
        if (!rows.length) return null; text = E.mlead(mg, E.h[key], rows.map(r => `${r.l} (${pct(r.v)})`).join('; ')); }
      else { rows = D.fs.filter(f => f.pl === pl && f.gl === o.g && f[key][k] != null).map(f => ({ l: lab(f), v: f[key][k] * 100, c: mkColor(f.pv) })).sort((a, b) => b.v - a.v);
        if (!rows.length) return null; const a = rows[0], z = rows[rows.length - 1]; text = E.mgrp(ma, o.g, E.h[key], a.l, pct(a.v), z.l, pct(z.v), num(a.v - z.v, 2)); }
      const ctl = xSel('at', k, D.RM.map((x, i) => [i, V.mon(iso(x))]).slice(1).reverse(), E.at) + xSeg('h', key, [['r', E.hs.r], ['y', E.hs.y], ['y12', E.hs.y12]]) + xSel('g', o.g, [['*', E.gLead]].concat(gs.map(g => [g, g])), E.grp);
      return { text, ch: { t: 'hbar', rows, u: 'pct' }, ctl, title: `${o.g === '*' ? E.gLead : o.g}: ${E.hs[key]}, ${m}`, head: [o.g === '*' ? E.th.grp : E.th.mgr, E.th.ret], rows: rows.map(r => [r.l, pct(r.v)]) };
    } },
  /* kiek kartų valdytojo fondas buvo pirmas savo grupėje: sp = {} */
  mwin: {
    init() { return { y: iso(MFD.RM[MFK]).slice(0, 4) }; },
    run(sp, o) {
      const t = T(), E = t.ex, D = MFD, ks = D.RM.map((x, k) => k).filter(k => k && iso(D.RM[k]).slice(0, 4) === o.y), ys = [...new Set(D.RM.slice(1).map(x => iso(x).slice(0, 4)))].reverse();
      const ps = [...new Set(D.II.map(f => f.pv))], rows = ps.map(p => ({ l: p, v: D.II.filter(f => f.pv === p).reduce((s, f) => s + ks.filter(k => f.rk[k] === 1).length, 0), c: mkColor(p) })).filter(r => r.v).sort((a, b) => b.v - a.v);
      if (!rows.length) return null; const tot = rows.reduce((s, r) => s + r.v, 0);
      const text = E.mwin(o.y, rows[0].l, rows[0].v, tot, rows.slice(1, 3).map(r => `${r.l} (${r.v})`).join(', '));
      return { text, ch: { t: 'hbar', rows, u: 'int' }, ctl: xSel('y', o.y, ys.map(y => [y, y]), E.th.y), title: `${t.mf.hW}: ${o.y}`, head: [E.th.mgr, E.th.n], rows: rows.map(r => [r.l, r.v]) };
    } },
};

/* fakto → tyrimo modelio priskyrimas (pradinis vaizdas atitinka kortelės sakinį) */
function exOf(f, box) {
  const t = T(), pl = box.dataset.pl || MS.pl, F = t.f, X = t.fx, V = t.pv, P2 = t.pv2, P3 = t.pv3, Q = t.p23, M = t.mf, h = f.h, L = lang === 'lt';
  const bm = (p, k) => (m, di) => (byMgr(p, di)[m] || {})[k] ?? null, pn = p => L ? `${p} pakopos` : `pillar ${p}`;
  const nav = p => ({ k: 'lvl', pl: p, u: 'mn', w1: m => L ? `${m} valdomas ${p} pakopos turtas` : `${m}’s pillar ${p} assets`, w: L ? `${p} pakopos turtas` : `pillar ${p} assets`, wm: L ? 'valdytojų turtas' : 'managers’ assets', lab: L ? `${p} pakopos turtas` : `Pillar ${p} assets`, fn: di => totals(p, di).nav || null, mfn: bm(p, 'nav') });
  const part = p => ({ k: 'lvl', pl: p, u: 'int', w1: m => L ? `${m} ${p} pakopos dalyvių skaičius` : `${m}’s pillar ${p} participants`, w: L ? `${p} pakopos dalyvių skaičius` : `the number of pillar ${p} participants`, wm: L ? 'valdytojų dalyvių skaičius' : 'managers’ participants', lab: L ? `${p} pakopos dalyviai` : `Pillar ${p} participants`, fn: di => totals(p, di).part || null, mfn: bm(p, 'part') });
  const share = (p, k) => ({ k: 'lvl', pl: p, u: 'pct', w1: m => L ? `${m} ${k === 'nav' ? 'turto' : 'dalyvių'} dalis ${p} pakopoje` : `${m}’s share of pillar ${p} ${k === 'nav' ? 'assets' : 'participants'}`, wm: L ? (k === 'nav' ? 'valdytojų turto dalis' : 'valdytojų dalyvių dalis') : (k === 'nav' ? 'managers’ share of assets' : 'managers’ share of participants'), lab: L ? `${p} pakopos ${k === 'nav' ? 'turto' : 'dalyvių'} dalys` : `Pillar ${p} shares`, mfn: (m, di) => shareAt(p, di, m, k) });
  const gain = p => ({ k: 'flow', pl: p, u: 'mn', w: L ? 'investicinis prieaugis' : 'investment gain', lab: L ? `${p} pakopos investicinis prieaugis` : `Pillar ${p} investment gain`, ser: [{ l: t.fSer.gain, c: 'var(--s4)', fn: di => gainAt(p, di) }], mfn: (m, di) => gainAt(p, di, m) });
  const per = p => ({ k: 'lvl', pl: p, u: 'eur', w1: m => L ? `${m} dalyvio vidutinis turtas` : `${m}’s assets per participant`, w: L ? 'turtas vienam dalyviui' : 'assets per participant', wm: L ? 'turtas vienam dalyviui' : 'assets per participant', lab: L ? `${p} pakopos turtas vienam dalyviui` : `Pillar ${p} assets per participant`,
    fn: di => { const x = totals(p, di); return x.part ? x.nav * 1e6 / x.part : null; }, mfn: (m, di) => { const x = byMgr(p, di)[m]; return x && x.part ? x.nav * 1e6 / x.part : null; } });
  const dPart = p => ({ k: 'flow', pl: p, u: 'int', w: L ? 'dalyvių skaičiaus pokytis' : 'change in participants', lab: L ? `${p} pakopos dalyvių pokytis` : `Pillar ${p} change in participants`,
    mfn: (m, di) => { const j = dIdx(p, qBack(MKT[p].dates[di], 3)), a = byMgr(p, di)[m], b = j >= 0 ? byMgr(p, j)[m] : null; return a && b ? a.part - b.part : null; } });
  const at3 = di => dIdx('III', MKT.II.dates[di]);
  if (f.ex) return f.ex();
  if (box.id === 'miCards' || box.id === 'brCards') return { ...share(pl, 'nav'), ms: [h], dy: 3 };
  if (box.id === 'p23Mgr') return { ...part('III'), who: 'm', ms: [h], dy: 3 };
  if (box.id === 'mfCards') {
    const mm = { [M.hR]: { k: 'mser', key: 'w' }, [M.hG]: { k: 'mser', key: 'g' }, [M.hL]: { k: 'mgrp', pl: 'II' }, [M.hS]: { k: 'mgrp', pl: 'II', g: f.gx }, [M.hY]: { k: 'mgrp', pl: 'II', h: 'y' }, [M.hW]: { k: 'mwin' },
      [M.hH]: { k: 'mser', key: 'w', n: 999 }, [M.hP]: { k: 'mser', key: 'w', n: 999, view: 'y' }, [M.h3]: { k: 'mgrp', pl: 'III' }, [M.h3y]: { k: 'mgrp', pl: 'III', h: 'y' } };
    return mm[h] || null;
  }
  const lc0 = () => groupsAt(pl, atIdx(pl, MS.d)).find(g => /^\d{4}-\d{4}$/.test(groupKeyOf(pl, g))) ?? '';
  const map = {
    [F.navH]: () => nav(pl), [X.recH]: () => ({ ...nav(pl), dy: 0, rec: true }), [X.grH]: () => ({ ...nav(pl), dy: 5 }),
    [F.partH]: () => part(pl), [F.perH]: () => per(pl), [P3.eH]: () => ({ ...per(pl), dy: 5 }),
    [F.retH]: () => ({ k: 'ret', pl }), [F.lcH]: () => ({ k: 'ret', pl }), [X.beatH]: () => ({ k: 'ret', pl, g: lc0() }), [X.bmH]: () => ({ k: 'ret', pl, g: lc0() }),
    [F.gainH]: () => ({ ...gain(pl), ytd: true }), [V.dayH]: () => ({ ...gain(pl), ytd: true }), [P2.cumH]: () => ({ ...gain(pl), all: true, view: 'c' }),
    [V.ppH]: () => ({ k: 'flow', pl, u: 'eur', ytd: true, w: L ? 'prieaugis vienam dalyviui' : 'gain per participant', lab: L ? 'Prieaugis vienam dalyviui' : 'Gain per participant',
      ser: [{ l: L ? 'Prieaugis vienam dalyviui, €' : 'Gain per participant, €', c: 'var(--s4)', fn: di => { const g = gainAt(pl, di), x = totals(pl, di); return g != null && x.part ? g * 1e6 / x.part : null; } }] }),
    [X.flowH]: () => ({ k: 'flow', pl, u: 'mn', w: L ? 'turto pokyčio dalys' : 'parts of the change in assets', lab: L ? `${pl} pakopos turto pokytis` : `Pillar ${pl} change in assets`,
      ser: [{ l: t.fSer.gain, sl: L ? 'investicinis prieaugis' : 'investment gain', c: 'var(--s4)', fn: di => gainAt(pl, di) }, { l: t.fSer.flow, sl: L ? 'įmokų ir išmokų balansas' : 'net contributions', c: 'var(--s1)', fn: di => flowAt(pl, di) }] }),
    [F.mgrH]: () => ({ ...share(pl, 'nav'), view: 'snap', dy: 1 }), [F.chgH]: () => ({ ...dPart(pl), n: 1, view: 'q', ms: mgrsAt(pl, atIdx(pl, MS.d)) }),
    [X.concH]: () => ({ k: 'lvl', pl, u: 'int', dy: 5, cagr: false, w: L ? 'rinkos koncentracijos indeksas (HHI)' : 'the market concentration index (HHI)', lab: 'HHI',
      fn: di => { const T0 = totals(pl, di); return T0.nav ? Object.values(byMgr(pl, di)).reduce((s, x) => s + (x.nav / T0.nav * 100) ** 2, 0) : null; } }),
    [F.bothH]: () => ({ k: 'lvl', pl: 'II', u: 'mn', dy: 5, w: L ? 'II ir III pakopos turtas kartu' : 'pillar II and III assets together', lab: L ? 'II ir III pakopos turtas' : 'Pillar II and III assets',
      fn: di => { const j = at3(di); return j < 0 ? null : totals('II', di).nav + totals('III', j).nav; } }),
    [V.k1H]: () => ({ k: 'ret', pl, h: '5y', eur: true }), [V.hiH]: () => ({ k: 'ret', pl, h: '5y', eur: true }), [P2.rkH]: () => ({ k: 'ret', pl, h: '5y', eur: true }),
    [V.dblH]: () => ({ k: 'real', pl, cmp: null, dy: 5 }), [P2.yrH]: () => ({ k: 'real', pl, cmp: null, dy: 0, view: 'y' }), [P2.chH]: () => ({ k: 'real', pl, cmp: null, dy: 0 }),
    [P2.ddH]: () => ({ k: 'real', pl, cmp: null, dy: 0, dd: true }), [P2.reH]: () => ({ k: 'real', pl, cmp: 'cpi', dy: 5 }), [P3.iH]: () => ({ k: 'real', pl, cmp: 'cpi', dy: 0, view: 'y' }),
    [P2.r3H]: () => ({ k: 'lvl', pl, u: 'pct', dy: 0, cagr: false, pos: true, w: L ? 'vidutinė 3 metų grąža (metinė)' : 'the average 3-year return (annualised)', lab: L ? 'Vidutinė 3 metų grąža (metinė)' : 'Average 3-year return', fn: di => avgK(pl, di, 'ret_3y') }),
    [Q.rH]: () => ({ k: 'lvl', pl: 'II', u: 'pct', dy: 3, w: L ? 'III ir II pakopos turto santykis' : 'the ratio of pillar III to pillar II assets', lab: L ? 'III pakopos turtas ÷ II pakopos, %' : 'Pillar III ÷ pillar II assets, %',
      fn: di => { const j = at3(di); return j < 0 ? null : totals('III', j).nav / totals('II', di).nav * 100; } }),
    [Q.gH]: () => ({ ...part('III'), dy: 3 }), [Q.lH]: () => ({ ...dPart('III'), ytd: true, view: 'y' }), [Q.aH]: () => ({ ...dPart('III'), all: true, view: 'y' }),
    [Q.fH]: () => ({ k: 'flow', pl: 'II', u: 'mn', n: 4, w: L ? 'įmokų ir išmokų balansas' : 'net contributions', lab: L ? 'Įmokų ir išmokų balansas' : 'Net contributions',
      ser: [{ l: L ? 'III pakopa' : 'Pillar III', c: 'var(--s4)', fn: di => { const j = at3(di); return j < 0 ? null : flowAt('III', j); } }, { l: L ? 'II pakopa' : 'Pillar II', c: 'var(--s1)', fn: di => flowAt('II', di) }] }),
    [Q.cH]: () => ({ k: 'lvl', pl: 'II', u: 'pct', dy: 3, view: 'snap', wm: L ? 'valdytojų dalis II ir III pakopoje kartu' : 'managers’ combined share of pillars II and III', lab: L ? 'Dalis II ir III pakopoje kartu' : 'Combined share',
      w1: m => L ? `${m} dalis II ir III pakopoje kartu` : `${m}’s combined share of pillars II and III`, mfn: (m, di) => { const j = at3(di), a = byMgr('II', di)[m], b = j >= 0 ? byMgr('III', j)[m] : null, T2 = totals('II', di).nav, T3 = j >= 0 ? totals('III', j).nav : 0; return a || b ? ((a ? a.nav : 0) + (b ? b.nav : 0)) / (T2 + T3) * 100 : null; } }),
  };
  ['w', 'p', 'm'].forEach(k => { map[P3[k + 'H']] = () => ({ k: 'real', pl, cmp: k, dy: 5 }); });
  return map[h] ? map[h]() : null;
}
const exFmt = u => ({ mn: v => mMn(v), int: v => mInt(v), eur: v => `${mInt(v)} €`, pct: v => pctPlain(v, 1) })[u];
function exMore(det) {
  const box = det.closest('.facts'), body = det.querySelector('.fxb'); if (!box || !body) return;
  const fs = det.dataset.m ? (box._byM || {})[det.dataset.m] || [] : [(box._facts || [])[+det.dataset.i]].filter(Boolean); if (!fs.length) return;
  const f = fs[0]; let sp = null; try { sp = exOf(f, box); } catch (e) { console.error(e); }
  if (!sp || !EXK[sp.k] || (sp.k.startsWith('m') && !MFD)) return factMore(det);
  const t = T(), E = t.ex, K = EXK[sp.k], o = det._xo || (det._xo = K.init(sp));
  const nums = fs.map(x => `<div class="scroll"><table class="at fnum"><tbody>${x.nums.map(n => `<tr><td class="l">${hEsc(n.l)}</td><td>${zFmt(n.v, n.z)}</td></tr>`).join('')}</tbody></table></div>`).join('');
  const draw = () => {
    let r = null; try { r = K.run(sp, o); if (r) r.text = r.text.replace(/([–:] |\(|nuo |iki |from |to |vidutiniškai |average )\+(?=\d)(?![\d\s ,.]*(p\. p\.|pp))/g, '$1'); } catch (e) { console.error(e); }
    const ttl = det._ttlEd || (r ? r.title : f.h);
    body.innerHTML = `<div class="fctl">${r ? r.ctl : ''}</div>`
      + (r ? `<div class="fxt"><p>${hEsc(r.text)}</p><button type="button" class="btn" data-xcp>${E.cp}</button></div>` : `<p class="na">${E.none}</p>`)
      + `<h3 class="fct" contenteditable="true" spellcheck="false" title="${E.ttl}">${hEsc(ttl)}</h3><div class="chart fch"></div>`
      + (r ? `<div class="scroll"><table class="at fnum xtab"><thead><tr>${r.head.map((x, i) => `<th${i ? '' : ' class="l"'}>${hEsc(x)}</th>`).join('')}</tr></thead><tbody>${r.rows.map(row => `<tr>${row.map((x, i) => `<td${i ? '' : ' class="l"'}>${hEsc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : '')
      + `<details class="fsub"><summary>${E.nums}</summary>${nums}</details>`;
    body._txt = r ? r.text : '';
    if (!r) return;
    const el = body.querySelector('.fch'), ch = r.ch, fm = exFmt(ch.u);
    if (ch.t === 'line') { const ss = ch.ser.filter(s => s.pts.length > 1), xs = ss.flatMap(s => s.pts.map(p => p[0]));
      if (ss.length) drawLineChart(el, ss.map(s => ({ provider: s.l, label: s.l, color: s.c, points: s.pts })), Math.min(...xs), Math.max(...xs), { fmt: fm, axisUnit: { mn: lang === 'lt' ? ' mln. €' : ' € m', pct: ' %', eur: ' €' }[ch.u] || '', zero: ch.u === 'mn', ml: ch.u === 'mn' ? 92 : 70, height: 250, mr: 16 }); }
    else if (ch.t === 'cols') { const mx = Math.max(...ch.ser.flatMap(x => x.v.filter(v => v != null && isFinite(v)).map(Math.abs)), 0), bn = ch.u === 'mn' && mx >= 1000;
      const af = ch.u === 'mn' ? v => bn ? `${num(v / 1000, 1)} ${lang === 'lt' ? 'mlrd.' : 'bn'}` : `${num(v, mx < 20 ? 1 : 0)} ${lang === 'lt' ? 'mln.' : 'm'}` : ch.u === 'pct' ? v => `${num(v, 0)} %` : ch.u === 'eur' ? v => `${mInt(v)} €` : fm;
      const lf = ch.u === 'mn' ? v => Math.abs(v) >= 1000 ? `${num(v / 1000, 2)} ${lang === 'lt' ? 'mlrd.' : 'bn'}` : `${num(v, Math.abs(v) < 10 ? 1 : 0)} ${lang === 'lt' ? 'mln.' : 'm'}` : fm;
      drawCols(el, ch.cats, ch.ser, { fmt: lf, afmt: af, sign: ch.sign, labels: true, ml: 72 }); }
    else drawHBars(el, ch.rows, { fmt: ch.u === 'pct' ? v => pct(v) : fm });
    const lg = ch.t === 'hbar' ? [] : ch.ser.filter(x => ch.t !== 'line' || x.pts.length > 1);
    if (lg.length > 1) el.insertAdjacentHTML('afterend', `<div class="legend chips xleg">${lg.map(x => `<span class="chip"><i style="background:${x.c}"></i>${hEsc(x.l)}</span>`).join('')}</div>`);
  };
  const fix = () => { const inc = sp.k === 'flow' || sp.k === 'mser'; if (o.a > o.b) [o.a, o.b] = [o.b, o.a]; if (!inc && o.a === o.b) o.a = Math.max(0, o.b - 1); };
  body.onclick = e => {
    const y = e.target.closest('[data-xy]'), s = e.target.closest('button[data-xk]'), m = e.target.closest('[data-xm]'), c = e.target.closest('[data-xcp]');
    if (c) return mkCopy(`${body._txt} ${f.src}`, c);
    if (y) { const n = +y.dataset.xy, per = +y.dataset.xper, min = +y.dataset.xmin, inc = +y.dataset.xinc; o.a = n ? Math.max(min, o.b - n * per + inc) : min; fix(); return draw(); }
    if (s) { const k = s.dataset.xk, v = s.dataset.xv; o[k] = v; return draw(); }
    if (m) { const k = m.dataset.xm; if (o.ms.has(k)) { if (o.ms.size > 1) o.ms.delete(k); } else o.ms.add(k); return draw(); }
  };
  body.onchange = e => { const s = e.target.closest('select[data-xk]'); if (!s) return; const k = s.dataset.xk, v = s.value;
    o[k] = ['a', 'b', 'at'].includes(k) ? +v : k === 'g' && sp.k === 'ret' && v !== '' ? +v : v; fix(); draw(); };
  body.oninput = e => { if (e.target.classList.contains('fct')) det._ttlEd = e.target.textContent; };
  draw();
}
