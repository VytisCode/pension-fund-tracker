/* „Kelias į pensiją“: vieno II pakopos dalyvio kaupimas nuo pirmos įmokos iki šiandien (savininko Excel modelis).
   Kiekviena eilutė = Sodros pervedimo data (arba fondo keitimas). Įmoka = atlyginimas × tarifas; už ją perkami fondo vienetai
   tos dienos vieneto verte; sukaupta suma = vienetai × vieneto vertė. Duomenys: data.js (gyvenimo ciklo fondai), data_journey.js (lentelės). */
const MGRS = ['SEB', 'SWEDBANK', 'ARTEA', 'LUMINOR', 'ALLIANZ', 'GOINDEX'];
const MLABEL = { ALLIANZ: 'Allianz', ARTEA: 'Artea', GOINDEX: 'Goindex', LUMINOR: 'Luminor', SEB: 'SEB', SWEDBANK: 'Swedbank' };
const GRPS = ['1961-1967', '1968-1974', '1975-1981', '1982-1988', '1989-1995', '1996-2002', '2003-2009'];
const SW_P3 = dayOf('2006-03-27'), SW_LC = dayOf('2019-01-02');      // SEB pensija 2 -> 3; senieji fondai -> gyvenimo ciklo fondai
const SRC = ['s', 'v', 'd', 'r'];                                    // Sodra, valstybė, dalyvis, grąža
const SCOL = { s: 'var(--s4)', v: 'var(--s1)', d: 'var(--s6)', r: 'var(--s5)' };

addStrings({
  navJourney: 'Retirement journey',
  inBirth: 'Born', inStart: 'Started saving', inPay: 'Salary', inRate: 'Contribution rate from 2019', rMax: 'Maximum (3 %)', rGrad: 'Gradual',
  inMgr: 'Manager from 2019', inAsof: 'Data until', payOf: p => `${p} % of average`,
  sumTitle: 'From the first contribution to today', incTitle: 'Income if retiring this year',
  kAssets: 'Accumulated pension assets', kContrib: 'Contributions (nominal)', kReal: 'Contributions in today’s prices', kGainE: 'Growth after inflation, €', kGainP: 'Growth after inflation, %',
  kState: y => `State pension (${y})`, kRr: 'Replacement rate without II pillar', kAnn: 'Annuity, € / month', kAddRr: 'Extra replacement rate from II pillar', kTotal: 'Total monthly pension',
  kNet: y => `Average net salary (${y})`, kSal: 'Assets in average net salaries', kYears: 'Years the annuity would cover', kRrTot: 'Total replacement rate',
  chTitle: 'How the assets grew', chMeta: 'Accumulated assets by source, €', shMeta: 'Where the money came from',
  srcName: { s: 'Sodra', v: 'State', d: 'Participant', r: 'Investment return' }, value: 'Assets',
  tbTitle: 'Calculation', tbLead: 'Each row is a Sodra transfer date (or a fund change, highlighted). The Excel file has every row with formulas.',
  tbYear: 'By year', tbAll: 'All rows',
  th: { date: 'Date', fund: 'Fund', wage: 'Gross salary', rs: 'Sodra %', rv: 'State %', rd: 'Particip. %', cs: 'Sodra €', cv: 'State €', cd: 'Particip. €', ct: 'Contribution €',
    price: 'Unit value €', bought: 'Units bought', units: 'Units total', val: 'Assets €', ss: 'Sodra Σ', sv: 'State Σ', sd: 'Particip. Σ', st: 'Contributions Σ', ret: 'Return €', retp: 'Return %',
    ann: 'Annuity €/mo', pen: 'Avg pension', net: 'Avg net salary', tot: 'Pension with II pillar', rr0: 'Repl. rate without', rr1: 'Repl. rate with', rrd: 'Extra repl. rate',
    cpi: 'CPI', real: 'Contribution in today’s prices', gainE: 'Real growth €', gainP: 'Real growth %', year: 'Year', yc: 'Contributions in year €', ye: 'Assets at year end €' },
  swRow: (a, b) => `Fund change: ${a} → ${b}`, valRow: 'Valuation (no contribution)', quarter: '×3 months',
  est: 'estimate', estNote: e => `Estimates (no official figure yet, the latest known one is used): ${e}.`,
  story: x => [`This participant began saving for retirement in ${x.start}, at the age of ${x.ageStart}. Earning ${x.pay === 100 ? 'the national average salary' : `${x.pay} % of the national average salary`}, they have been saving for ${x.years} years. On ${x.date} the accumulated pension assets are ${x.assets} €, while all contributions in today’s prices are worth ${x.real} €. After inflation the assets ${x.gainP >= 0 ? 'have grown' : 'have shrunk'} by ${x.gainPs} in real terms.`,
    `${x.retShare >= x.maxShare ? 'Investment returns make up the largest part of the assets' : 'The largest part of the assets comes from ' + x.maxName.toLowerCase() + ' contributions'} (${x.retPs} from returns).`,
    `If they retired today, the total monthly income would be ${x.total} € – ${x.rr1} of the average net salary. The assets equal ${x.sal} average monthly net salaries.`],
  prof: x => [`<b>Born</b> ${x.birth}`, `<b>Started saving</b> ${x.start}, at ${x.ageStart}`, `<b>Retirement</b> ${x.ret}, at 65 (${x.left} years to go)`, `<b>Earnings</b> ${x.payL}`, `<b>Contribution rate</b> ${x.rateL}`, `<b>Fund path</b> ${x.path}`],
  xls: 'Excel', xlsTip: 'Download the calculation as Excel: every row, the formulas and the input tables',
  xSheets: ['Calculation', 'Inputs'], xIn: ['Contribution rates, %', 'Average salary, €', 'Average old-age pension, €', 'State incentive, € / month', 'CPI', 'Old funds’ unit values, €'],
  info: {
    sum: 'Accumulated assets = units held × unit value on the “Data until” date.\nContributions (nominal) = sum of all contributions (Sodra + state + participant).\nContributions in today’s prices = each contribution × CPI(latest month) ÷ CPI(contribution month).\nGrowth after inflation = assets − contributions in today’s prices; % = that ÷ contributions in today’s prices.\nUnit values are published net of management fees, so fees are already included.',
    inc: 'State pension = average old-age pension of the latest year published by Statistics Lithuania (not this participant’s own state pension).\nAnnuity = assets ÷ 1000 × 4.809 € (Bank of Lithuania base pension annuity table, payable from 65).\nReplacement rate = pension ÷ average net salary of the year; extra replacement rate = annuity ÷ net salary.\nYears covered = assets ÷ (annuity × 12). This is only an estimate; Sodra’s annuity calculator gives the real amount.',
    chart: 'Stacked areas = cumulative contributions by source; the green area = investment return (assets − contributions). If the return is negative the line drops into the contributions.',
    tbl: 'Contribution = gross salary × rate (state from 2019: fixed € amount per month, the higher one when the participant pays 3 %, the lower one in the gradual path). Until 2010 Sodra transferred quarterly. Units bought = contribution ÷ unit value on the transfer date. Assets = units total × unit value. A fund change converts the assets into the new fund’s units at that day’s unit values. Until 2015 unit values were in litas and are converted at 3.4528 LTL = 1 €.',
  },
  foot: 'Sources: Sodra transfer dates, contribution rates (laws), Statistics Lithuania (salaries, pensions, CPI), Bank of Lithuania (annuity), providers’ unit values. Model of one average participant; for information only, not investment advice.',
}, {
  navJourney: 'Kelias į pensiją',
  inBirth: 'Gimimo metai', inStart: 'Kaupti pradėjo', inPay: 'Atlyginimas', inRate: 'Įmokų tarifas nuo 2019 m.', rMax: 'Maksimalus (3 %)', rGrad: 'Laipsniškas',
  inMgr: 'Valdytojas nuo 2019 m.', inAsof: 'Duomenys iki', payOf: p => `${p} % vidutinio`,
  sumTitle: 'Nuo pirmos įmokos iki šiandien', incTitle: 'Pajamos išėjus į pensiją šiemet',
  kAssets: 'Sukauptas pensijų turtas', kContrib: 'Įmokų suma (nominali)', kReal: 'Įmokų perkamoji vertė šiandien', kGainE: 'Pokytis realia verte, €', kGainP: 'Pokytis realia verte, %',
  kState: y => `Valstybinė pensija (${y})`, kRr: 'Pakeitimo norma be kaupimo', kAnn: 'Anuitetas, € / mėn.', kAddRr: 'Papildoma pakeitimo norma iš II pakopos', kTotal: 'Bendra mėnesio išmoka',
  kNet: y => `Vidutinis neto atlyginimas (${y})`, kSal: 'Sukauptų atlyginimų skaičius', kYears: 'Metų, kuriems užteks anuiteto', kRrTot: 'Bendra pakeitimo norma',
  chTitle: 'Kaip augo turtas', chMeta: 'Sukauptas turtas pagal šaltinį, €', shMeta: 'Turto formavimo šaltiniai',
  srcName: { s: 'Sodra', v: 'Valstybė', d: 'Dalyvis', r: 'Investicijų grąža' }, value: 'Turtas',
  tbTitle: 'Skaičiavimas', tbLead: 'Kiekviena eilutė – Sodros pervedimo data (arba fondo keitimas, paryškinta). Excel faile – visos eilutės su formulėmis.',
  tbYear: 'Pagal metus', tbAll: 'Visos eilutės',
  th: { date: 'Data', fund: 'Fondas', wage: 'Bruto atlyginimas', rs: 'Sodra %', rv: 'Valstybė %', rd: 'Dalyvis %', cs: 'Sodra €', cv: 'Valstybė €', cd: 'Dalyvis €', ct: 'Įmoka €',
    price: 'Vieneto vertė €', bought: 'Įsigyta vnt.', units: 'Vnt. iš viso', val: 'Sukaupta €', ss: 'Sodra Σ', sv: 'Valstybė Σ', sd: 'Dalyvis Σ', st: 'Įmokos Σ', ret: 'Grąža €', retp: 'Grąža %',
    ann: 'Anuitetas €/mėn.', pen: 'Vid. pensija', net: 'Vid. neto DU', tot: 'Pensija su kaupimu', rr0: 'Pakeitimo norma be kaupimo', rr1: 'Pakeitimo norma su kaupimu', rrd: 'Papildoma pakeitimo norma',
    cpi: 'VKI', real: 'Įmokos vertė šiandien', gainE: 'Pokytis realia verte €', gainP: 'Pokytis realia verte %', year: 'Metai', yc: 'Įmokos per metus €', ye: 'Turtas metų pabaigoje €' },
  swRow: (a, b) => `Fondo keitimas: ${a} → ${b}`, valRow: 'Įvertinimas (be įmokos)', quarter: '×3 mėn.',
  est: 'įvertis', estNote: e => `Įverčiai (oficialaus skaičiaus dar nėra, naudojamas naujausias žinomas): ${e}.`,
  story: x => [`Šis dalyvis pensijai pradėjo kaupti ${x.start} m., būdamas ${x.ageStart}-ies. Uždirbdamas ${x.pay === 100 ? 'vidutinį šalies atlyginimą' : `${x.pay} % vidutinio šalies atlyginimo`}, jis kaupia jau ${x.years} m. ${x.date} jo sukauptas pensijų turtas siekia ${x.assets} €, o visų įmokų perkamoji vertė – ${x.real} €. Tai reiškia, kad atsižvelgus į infliaciją, jo turtas ${x.gainP >= 0 ? 'išaugo' : 'sumažėjo'} ${x.gainPs} realia verte.`,
    `${x.retShare >= x.maxShare ? 'Didžiausią turto dalį sudaro investicijų grąža' : 'Didžiausia turto dalis – ' + (x.maxKey === 'd' ? 'paties dalyvio įmokos' : x.maxKey === 'v' ? 'valstybės įmokos' : 'Sodros įmokos')} (grąža – ${x.retPs}).`,
    `Jei dalyvis išeitų į pensiją šiandien, bendros jo pajamos būtų ${x.total} € – tai ${x.rr1} vidutinio neto atlyginimo. Sukauptas pensijų turtas prilygsta ${x.sal} vidutinių šiandienos atlyginimų.`],
  prof: x => [`<b>Gimimo metai</b> ${x.birth}`, `<b>Kaupti pradėjo</b> ${x.start} m., ${x.ageStart} m. amžiaus`, `<b>Pensija</b> ${x.ret} m., 65 m. (liko ${x.left} m.)`, `<b>Pajamos</b> ${x.payL}`, `<b>Įmokų tarifas</b> ${x.rateL}`, `<b>Fondų kelias</b> ${x.path}`],
  xls: 'Excel', xlsTip: 'Atsisiųsti skaičiavimą Excel faile: visos eilutės, formulės ir pradinės lentelės',
  xSheets: ['Skaičiavimas', 'Pradiniai duomenys'], xIn: ['Įmokų tarifai, %', 'Vidutinis darbo užmokestis, €', 'Vidutinė senatvės pensija, €', 'Valstybės paskata, € / mėn.', 'VKI', 'Senųjų fondų vieneto vertė, €'],
  info: {
    sum: 'Sukauptas turtas = turimų vienetų skaičius × vieneto vertė dieną „Duomenys iki“.\nĮmokų suma (nominali) = visų įmokų suma (Sodra + valstybė + dalyvis).\nĮmokų perkamoji vertė šiandien = kiekviena įmoka × VKI(naujausias mėnuo) ÷ VKI(įmokos mėnuo).\nPokytis realia verte = turtas − įmokų perkamoji vertė; % = tas skirtumas ÷ įmokų perkamoji vertė.\nVieneto vertė skelbiama jau atskaičius valdymo mokesčius, todėl mokesčiai jau įskaičiuoti.',
    inc: 'Valstybinė pensija = Statistikos departamento paskelbta naujausių metų vidutinė senatvės pensija (ne šio dalyvio asmeninė).\nAnuitetas = turtas ÷ 1000 × 4,809 € (Lietuvos banko bazinio pensijų anuiteto lentelė, mokama nuo 65 m.).\nPakeitimo norma = pensija ÷ tų metų vidutinis neto atlyginimas; papildoma pakeitimo norma = anuitetas ÷ neto atlyginimas.\nMetų skaičius = turtas ÷ (anuitetas × 12). Tai tik prognozė – tikslią sumą parodo Sodros anuitetų skaičiuoklė.',
    chart: 'Spalvotos sritys = sukauptos įmokos pagal šaltinį; žalia sritis = investicijų grąža (turtas − įmokos). Kai grąža neigiama, turto linija nusileidžia žemiau įmokų.',
    tbl: 'Įmoka = bruto atlyginimas × tarifas (valstybės įmoka nuo 2019 m. – fiksuota suma per mėnesį: didesnė, kai dalyvis moka 3 %, mažesnė – laipsniškai didinant). Iki 2010 m. Sodra pervesdavo kas ketvirtį. Įsigyta vnt. = įmoka ÷ vieneto vertė pervedimo dieną. Sukaupta = vienetai × vieneto vertė. Keičiant fondą, turtas tos dienos vieneto vertėmis konvertuojamas į naujo fondo vienetus. Iki 2015 m. vieneto vertės buvo litais ir perskaičiuotos 3,4528 Lt = 1 €.',
  },
  foot: 'Šaltiniai: Sodros pervedimų datos, įmokų tarifai (įstatymai), Statistikos departamentas (atlyginimai, pensijos, VKI), Lietuvos bankas (anuitetas), bendrovių vieneto vertės. Vieno vidutinio dalyvio modelis; informacinė medžiaga, ne investavimo rekomendacija.',
});

const J = JDATA;
const LAST = Math.max(...DATA.groups.flatMap(g => g.funds.map(f => f.d[f.d.length - 1])));
const ST = Object.assign({ birth: 1984, start: 2004, pay: 100, rate: 'max', mgr: 'SEB', asof: '', tb: 'y', q3: true },
  (() => { try { return JSON.parse(localStorage.getItem('jrnstate')) || {}; } catch (e) { return {}; } })());
const save = () => { try { localStorage.setItem('jrnstate', JSON.stringify(ST)); } catch (e) {} };
const eur = (x, p = 2) => num(x, p) + ' €';
const pc = (x, p = 2) => (x < 0 ? '−' : '') + num(Math.abs(x) * 100, p) + ' %';
const yearOf = d => new Date(d * DAY).getUTCFullYear();
const dots = d => iso(d).replace(/-/g, '.');

/* ---------- pradiniai duomenys ---------- */
const DATES = J.dates.map(([d, m]) => [dayOf(d), m]);
const RATES = J.rates.map(([d, s, v, p, g]) => ({ d: dayOf(d), s, v, p, g }));
const OLD = {};   // fondas -> { d: [], v: [] }
J.old.forEach(([d, f, v]) => { const o = OLD[f] = OLD[f] || { d: [], v: [] }; o.d.push(dayOf(d)); o.v.push(v); });
const lcFund = (mgr, g) => { for (const gr of DATA.groups) for (const f of gr.funds) if (f.provider === mgr && gr.id === g) return f; return null; };
const groupOf = y => GRPS.find(g => { const [a, b] = g.split('-').map(Number); return y >= a && y <= b; });
/* reikšmė pagal metus: oficiali arba naujausia žinoma (pažymima kaip įvertis) */
function byYear(tbl, y, est, what) {
  if (tbl[y] != null) return tbl[y];
  const ys = Object.keys(tbl).map(Number).filter(k => k <= y && tbl[k] != null);
  if (!ys.length) return null;
  const k = Math.max(...ys); est.add(`${what} ${y} = ${k}`); return tbl[k];
}
function incentive(y, grad, est) {
  const t = J.incentive[y];
  if (t) return grad ? t[1] : t[0];
  const w = J.wages[y - 2];      // nėra paskelbtos sumos: 1,5 % vidutinio bruto atlyginimo prieš 2 metus
  if (w) { est.add(`${T().srcName.v} ${y} ≈ 1,5 % × ${T().th.wage} ${y - 2}`); return Math.round(w[0] * 1.5) / 100; }
  return byYear(Object.fromEntries(Object.entries(J.incentive).map(([k, v]) => [k, grad ? v[1] : v[0]])), y, est, T().srcName.v);
}
function cpiAt(day, est) {
  const m = iso(day).slice(0, 7);
  if (J.cpi[m] != null) return J.cpi[m];
  const ks = Object.keys(J.cpi).filter(k => k <= m).sort();
  if (!ks.length) return null;
  const k = ks[ks.length - 1]; est.add(`${T().th.cpi} > ${k}: ${k}`); return J.cpi[k];
}
/* fondas pagal dieną: iki 2006-03-27 – SEB pensija 2, iki 2019-01-02 – SEB pensija 3, vėliau – pasirinkto valdytojo gimimo metų fondas.
   Jei to fondo dar nebuvo (Goindex iki 2022-08, 2003–2009 fondai iki 2025): artimiausia vyresnė grupė, tada SEB. */
function fundFor(day, P) {
  if (day < SW_P3) return { id: 'SEB pensija 2', old: OLD['SEB pensija 2'] };
  if (day < SW_LC) return { id: 'SEB pensija 3', old: OLD['SEB pensija 3'] };
  const gi = GRPS.indexOf(groupOf(P.birth));
  for (const m of [P.mgr, 'SEB']) for (let i = gi; i >= 0; i--) {
    const f = lcFund(m, GRPS[i]);
    if (f && f.d[0] <= day) return { id: f.name, f };
  }
  return null;
}
function priceAt(fd, day) {
  const s = fd.f || fd.old;
  const i = lastOnOrBefore(s, day);
  if (i >= 0) return [s.d[i], fd.f ? s.v[i] : s.v[i]];
  return fd.f && s.d[0] - day <= 7 ? [s.d[0], s.v[0]] : null;   // fondas pradėjo veikti vos po dienos
}

/* ---------- modelis ---------- */
function simulate(P) {
  const est = new Set(), rows = [];
  const asof = P.asof, startDay = dayOf(`${P.start}-01-01`);
  const events = DATES.filter(([d]) => d >= startDay && d <= asof).map(([d, m]) => ({ d, m }));
  // fondų keitimo dienos: 2006-03-27, 2019-01-02, pasirinkto fondo pradžia
  const sw = [SW_P3, SW_LC];
  const gi = GRPS.indexOf(groupOf(P.birth));
  for (const m of [P.mgr, 'SEB']) for (let i = gi; i >= 0; i--) { const f = lcFund(m, GRPS[i]); if (f) sw.push(f.d[0]); }
  [...new Set(sw)].filter(d => d > startDay && d <= asof && !events.some(e => e.d === d)).forEach(d => events.push({ d, m: 0 }));
  events.sort((a, b) => a.d - b.d || b.m - a.m);
  if (!events.length || events[events.length - 1].d !== asof) events.push({ d: asof, m: 0, val: true });
  let fund = null, units = 0, cs = 0, cv = 0, cd = 0, real = [], path = [];
  for (const e of events) {
    const want = fundFor(e.d, P);
    if (!want) continue;
    if (!fund) { if (!e.m) continue; fund = want; path.push([fund.id, e.d]); }
    else if (want.id !== fund.id) {               // fondo keitimas
      const p0 = priceAt(fund, e.d), p1 = priceAt(want, e.d), value = units * p0[1];
      rows.push({ d: e.d, sw: [fund.id, want.id], fund: want.id, price: p1[1], oldPrice: p0[1], units0: units, bought: value / p1[1], units: value / p1[1], val: value, cs: 0, cv: 0, cd: 0, ct: 0 });
      units = value / p1[1]; fund = want; path.push([fund.id, e.d]);
      if (!e.m) continue;
    }
    if (!e.m && !e.val) continue;                 // keitimo diena be keitimo
    const pr = priceAt(fund, e.d);
    if (!pr) continue;
    const y = yearOf(e.d), r = RATES.filter(x => x.d <= e.d).pop();
    const row = { d: e.d, fund: fund.id, price: pr[1], m: 0, cs: 0, cv: 0, cd: 0 };
    if (e.m && r) {
      const m = P.q3 ? e.m : 1, w = byYear(J.wages, y, est, T().th.wage)[0], grad = P.rate === 'grad' && r.g != null;
      row.m = m; row.wage = w * P.pay / 100;
      row.rs = r.s; row.rd = grad ? r.g : r.p;
      row.cs = row.wage * r.s / 100 * m; row.cd = row.wage * row.rd / 100 * m;
      if (e.d >= SW_LC) { row.cv = incentive(y, grad, est) * m; row.rv = null; }
      else { row.rv = r.v; row.cv = w * r.v / 100 * m; }      // 2016–2018: 2 % vidutinio šalies atlyginimo
    }
    row.ct = row.cs + row.cv + row.cd;
    row.bought = row.ct / pr[1]; units += row.bought; row.units = units; row.val = units * pr[1];
    cs += row.cs; cv += row.cv; cd += row.cd;
    if (e.val) row.valOnly = true;
    rows.push(row);
  }
  // sukaupti stulpeliai, pensija, infliacija
  const cpiRef = cpiAt(asof, est);
  let realSum = 0; cs = cv = cd = 0;
  rows.forEach(r => {
    cs += r.cs || 0; cv += r.cv || 0; cd += r.cd || 0;
    r.ss = cs; r.sv = cv; r.sd = cd; r.st = cs + cv + cd; r.ret = r.val - r.st; r.retp = r.st ? r.ret / r.st : null;
    const y = yearOf(r.d);
    r.cpi = cpiAt(r.d, est); r.real = r.ct && r.cpi ? r.ct * cpiRef / r.cpi : 0; realSum += r.real; r.realSum = realSum;
    r.gainE = r.val - realSum; r.gainP = realSum ? r.gainE / realSum : null;
    r.ann = r.val / 1000 * J.annuity;
    if (y >= 2018) {
      const pen = byYear(J.pensions, y, new Set(), ''), wn = byYear(J.wages, y, new Set(), '');
      if (pen && wn) { r.pen = pen; r.net = wn[1] * P.pay / 100; r.tot = pen + r.ann; r.rr0 = pen / r.net; r.rr1 = r.tot / r.net; r.rrd = r.rr1 - r.rr0; }
    }
  });
  const yAs = yearOf(asof);
  const last = rows[rows.length - 1];
  const penY = Math.max(...Object.keys(J.pensions).map(Number).filter(k => k <= yAs));
  if (J.pensions[yAs] == null) est.add(`${T().th.pen} ${yAs} = ${penY}`);
  if (!J.wages[yAs]) est.add(`${T().th.net} ${yAs} = ${Math.max(...Object.keys(J.wages).map(Number))}`);
  return { rows, last, est: [...est], path, cpiRef, penY };
}

/* ---------- valdikliai ---------- */
const field = (label, html) => `<label class="field">${label} ${html}</label>`;
const sel = (k, opts, cur) => `<select data-k="${k}">${opts.map(([v, t]) => `<option value="${v}"${String(v) === String(cur) ? ' selected' : ''}>${t}</option>`).join('')}</select>`;
const ik = k => `<button type="button" class="info" data-k="${k}" aria-label="info">i</button>`;
const xbtn = () => `<button type="button" class="btn xls" title="${T().xlsTip}">⤓ ${T().xls}</button>`;
function seg(id, opts, cur) { return `<div class="seg" role="group" data-seg="${id}">` + opts.map(([v, t]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${t}</button>`).join('') + '</div>'; }

function params() {
  const minStart = Math.max(2004, ST.birth + 18);
  if (ST.start < minStart) ST.start = minStart;
  const maxAs = LAST, asof = ST.asof && dayOf(ST.asof) <= maxAs && dayOf(ST.asof) > dayOf(`${ST.start}-06-30`) ? dayOf(ST.asof) : maxAs;
  return { birth: ST.birth, start: ST.start, pay: ST.pay, rate: ST.rate, mgr: ST.mgr, asof, q3: ST.q3 };
}
function renderBar() {
  const bar = document.getElementById('inBar'), P = params(), lastY = yearOf(LAST);
  const births = []; for (let y = 1961; y <= lastY - 18; y++) births.push([y, y]);
  const starts = []; for (let y = Math.max(2004, ST.birth + 18); y <= lastY; y++) starts.push([y, y]);
  bar.innerHTML = field(T().inBirth, sel('birth', births, ST.birth)) + field(T().inStart, sel('start', starts, P.start))
    + field(T().inPay, sel('pay', [50, 75, 100, 125, 150, 200, 300].map(p => [p, T().payOf(p)]), ST.pay))
    + field(T().inRate, seg('rate', [['max', T().rMax], ['grad', T().rGrad]], ST.rate))
    + field(T().inMgr, sel('mgr', MGRS.map(m => [m, MLABEL[m]]), ST.mgr))
    + field(T().inAsof, `<input type="date" data-k="asof" value="${iso(P.asof)}" min="2005-01-01" max="${iso(LAST)}">`);
  bar.querySelectorAll('select[data-k]').forEach(s => s.addEventListener('change', () => { ST[s.dataset.k] = s.dataset.k === 'mgr' ? s.value : +s.value; save(); renderAll(); }));
  bar.querySelector('input[data-k="asof"]').addEventListener('change', e => { ST.asof = e.target.value === iso(LAST) ? '' : e.target.value; save(); renderAll(); });
  bar.querySelectorAll('[data-seg]').forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { ST[g.dataset.seg] = b.dataset.v; save(); renderAll(); })));
}

const kpi = (l, v, s, cls = '') => `<div class="kpi ${cls}"><div class="l">${l}</div><div class="v">${v}</div>${s ? `<div class="s">${s}</div>` : ''}</div>`;
let SIM = null, P = null;

function renderKpis() {
  const L = SIM.last, t = T(), yAs = yearOf(P.asof);
  const gcls = L.gainE >= 0 ? 'up' : 'down';
  document.getElementById('sumTitle').innerHTML = `${t.sumTitle} <span class="rsub" style="font-weight:400;font-size:13px;color:var(--text-3)">· ${dots(P.asof)}</span>${ik('sum')}${xbtn()}`;
  document.getElementById('kpiA').innerHTML = kpi(t.kAssets, eur(L.val, 0), '', 'hl') + kpi(t.kContrib, eur(L.st, 0)) + kpi(t.kReal, eur(L.realSum, 0))
    + kpi(t.kGainE, `<span class="${gcls}">${L.gainE >= 0 ? '+' : '−'}${eur(Math.abs(L.gainE), 0)}</span>`) + kpi(t.kGainP, `<span class="${gcls}">${pc(L.gainP)}</span>`);
  document.getElementById('incTitle').innerHTML = `${t.incTitle}${ik('inc')}`;
  const net = L.net, pen = L.pen;
  document.getElementById('kpiB').innerHTML = pen != null ? kpi(t.kState(SIM.penY), eur(pen, 0), `${t.kRr}: ${pc(L.rr0, 0)}`) + kpi(t.kAnn, eur(L.ann), `${t.kYears}: ${num(L.val / L.ann / 12, 1)}`)
    + kpi(t.kAddRr, pc(L.rrd), `${t.kRrTot}: ${pc(L.rr1)}`) + kpi(t.kTotal, eur(L.tot), `${t.kNet(Math.min(yAs, Math.max(...Object.keys(J.wages).map(Number))))}: ${eur(net, 0)} · ${t.kSal}: ${num(L.val / net, 1)}`, 'hl') : '';
}
function renderStory() {
  const L = SIM.last, t = T(), shares = shareOf(L);
  const maxKey = ['s', 'v', 'd'].reduce((a, k) => shares[k] > shares[a] ? k : a, 's');
  const x = { start: P.start, ageStart: P.start - P.birth, pay: P.pay, years: yearOf(P.asof) - P.start + 1, date: dots(P.asof), assets: num(L.val, 0), real: num(L.realSum, 0),
    gainP: L.gainP, gainPs: pc(Math.abs(L.gainP)), retShare: shares.r, maxShare: shares[maxKey], maxKey, maxName: t.srcName[maxKey], retPs: pc(Math.max(0, shares.r) , 0),
    total: L.tot != null ? num(L.tot) : '–', rr1: L.rr1 != null ? pc(L.rr1) : '–', sal: L.net ? num(L.val / L.net, 1) : '–' };
  document.getElementById('story').innerHTML = t.story(x).map(s => `<p>${s}</p>`).join('');
  const pathL = SIM.path.map(([f, d]) => `${f.replace(/ tikslinės grupės pensijų fondas/, '')} – ${lang === 'lt' ? 'nuo' : 'since'} ${dots(d)}`).join('<br>');
  const pr = { birth: P.birth, start: P.start, ageStart: P.start - P.birth, ret: P.birth + 65, left: Math.max(0, P.birth + 65 - yearOf(P.asof)),
    payL: P.pay === 100 ? (lang === 'lt' ? 'vidutinis šalies atlyginimas' : 'average national salary') : t.payOf(P.pay), rateL: P.rate === 'max' ? t.rMax : t.rGrad, path: pathL };
  document.getElementById('prof').innerHTML = t.prof(pr).map(s => `<div>${s}</div>`).join('');
}
function shareOf(L) {
  const tot = L.val, r = L.val - L.st;
  return { s: L.ss / tot, v: L.sv / tot, d: L.sd / tot, r: r / tot, abs: { s: L.ss, v: L.sv, d: L.sd, r } };
}

/* ---------- grafikas: sukauptos įmokos pagal šaltinį + grąža ---------- */
function renderChart() {
  const t = T(), el = document.getElementById('chart'), rows = SIM.rows;
  document.getElementById('chTitle').innerHTML = `${t.chTitle}${ik('chart')}`;
  document.getElementById('chMeta').textContent = t.chMeta;
  document.getElementById('shMeta').textContent = t.shMeta;
  el.querySelectorAll('svg, p.na').forEach(s => s.remove());
  const W = el.clientWidth || 700, H = Math.max(260, Math.min(360, W * 0.5)), m = { l: 58, r: 12, t: 10, b: 26 };
  const x0 = rows[0].d, x1 = rows[rows.length - 1].d;
  const hi = Math.max(...rows.map(r => Math.max(r.val, r.st))) * 1.04 || 1;
  const X = d => m.l + (d - x0) / Math.max(1, x1 - x0) * (W - m.l - m.r), Y = v => m.t + (hi - v) / hi * (H - m.t - m.b);
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', t.chMeta);
  const add = (tag, a, p = svg) => { const n = document.createElementNS(ns, tag); for (const k in a) n.setAttribute(k, a[k]); p.appendChild(n); return n; };
  niceTicks(0, hi).forEach(v => {
    add('line', { x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v), stroke: v === 0 ? 'var(--axis)' : 'var(--grid)' });
    add('text', { x: m.l - 8, y: Y(v) + 4, 'text-anchor': 'end', fill: 'var(--text-3)', 'font-size': 11 }).textContent = num(v, 0) + ' €';
  });
  const span = (x1 - x0) / 365, stepY = span > 12 ? 2 : 1;
  for (let y = yearOf(x0) + 1; y <= yearOf(x1); y += stepY) { const d = dayOf(`${y}-01-01`); add('text', { x: X(d), y: H - 6, 'text-anchor': 'middle', fill: 'var(--text-3)', 'font-size': 11 }).textContent = y; }
  // sukauptos įmokos: Sodra apačioje, tada valstybė, dalyvis (laiptelis – įmoka pridedama pervedimo dieną)
  const stack = [['s', r => r.ss], ['v', r => r.ss + r.sv], ['d', r => r.st]];
  let prev = () => 0;
  stack.forEach(([k, top]) => {
    const lo = prev, pts = rows.map(r => [X(r.d), Y(top(r))]), base = rows.map(r => [X(r.d), Y(lo(r))]).reverse();
    add('path', { d: 'M' + pts.concat(base).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z', fill: SCOL[k], 'fill-opacity': 0.8, stroke: 'var(--card)', 'stroke-width': 1 });
    prev = top;
  });
  // grąža: sritis tarp įmokų ir turto
  const vp = rows.map(r => [X(r.d), Y(r.val)]), cp = rows.map(r => [X(r.d), Y(r.st)]).reverse();
  add('path', { d: 'M' + vp.concat(cp).map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L') + 'Z', fill: SCOL.r, 'fill-opacity': 0.35 });
  add('path', { d: 'M' + vp.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'), fill: 'none', stroke: SCOL.r, 'stroke-width': 2, 'stroke-linejoin': 'round' });
  rows.filter(r => r.sw).forEach(r => add('line', { x1: X(r.d), x2: X(r.d), y1: m.t, y2: H - m.b, stroke: 'var(--text-3)', 'stroke-dasharray': '3 3' }));
  const cross = add('line', { y1: m.t, y2: H - m.b, stroke: 'var(--axis)', visibility: 'hidden' });
  const hit = add('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' });
  el.appendChild(svg);
  let tip = el.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; el.appendChild(tip); }
  const move = ev => {
    const rect = svg.getBoundingClientRect(), px = (ev.clientX - rect.left) * (W / rect.width), day = x0 + (px - m.l) / (W - m.l - m.r) * (x1 - x0);
    let r = rows[0]; for (const q of rows) if (q.d <= day) r = q;
    cross.setAttribute('x1', X(r.d)); cross.setAttribute('x2', X(r.d)); cross.setAttribute('visibility', 'visible');
    const line = (c, l, v) => `<div><span><span class="sw" style="background:${c}"></span>${l}</span><span>${eur(v, 0)}</span></div>`;
    tip.innerHTML = `<b>${dots(r.d)}</b>` + line('transparent', t.value, r.val) + line(SCOL.r, t.srcName.r, r.ret) + line(SCOL.d, t.srcName.d, r.sd) + line(SCOL.v, t.srcName.v, r.sv) + line(SCOL.s, t.srcName.s, r.ss);
    tip.style.display = 'block';
    const box = el.getBoundingClientRect();
    tip.style.left = Math.max(0, Math.min(ev.clientX - box.left + 14, el.clientWidth - tip.offsetWidth - 4)) + 'px'; tip.style.top = Math.max(0, ev.clientY - box.top - tip.offsetHeight - 10) + 'px';
  };
  hit.addEventListener('mousemove', move); hit.addEventListener('touchmove', e => move(e.touches[0]), { passive: true });
  hit.addEventListener('mouseleave', () => { tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden'); });
  document.getElementById('chLegend').innerHTML = ['r', 'd', 'v', 's'].map(k => `<span><i style="background:${SCOL[k]}"></i>${t.srcName[k]}</span>`).join('');
  // šaltinių dalys
  const sh = shareOf(SIM.last), pos = SRC.filter(k => sh.abs[k] > 0), sum = pos.reduce((a, k) => a + sh.abs[k], 0);
  document.getElementById('shares').innerHTML = `<div class="sbar">${pos.map(k => `<span style="flex:${sh.abs[k] / sum};background:${SCOL[k]}" title="${t.srcName[k]}"></span>`).join('')}</div>`
    + ['r', 'd', 'v', 's'].map(k => `<div class="row"><span><span class="sw" style="display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;background:${SCOL[k]}"></span>${t.srcName[k]}</span><span>${eur(sh.abs[k])}</span><span>${pc(sh[k], 0)}</span></div>`).join('')
    + `<div class="row"><b>${t.value}</b><b>${eur(SIM.last.val)}</b><span></span></div>`;
}

/* ---------- lentelė ---------- */
const COLS_ALL = ['date', 'fund', 'wage', 'rs', 'rv', 'rd', 'cs', 'cv', 'cd', 'ct', 'price', 'bought', 'units', 'val', 'ss', 'sv', 'sd', 'st', 'ret', 'retp', 'ann', 'pen', 'net', 'tot', 'rr0', 'rr1', 'rrd', 'cpi', 'real', 'gainE', 'gainP'];
const shortFund = f => f.replace(/ tikslinės grupės pensijų fondas/, '').replace(/^Allianz (\w+) gimusiems (\d{4}-\d{4}) m\./, 'Allianz $2');
function cellOf(r, k) {
  const v = r[k], n = (x, p) => x == null ? '' : num(x, p);
  switch (k) {
    case 'date': return dots(r.d);
    case 'fund': return shortFund(r.fund);
    case 'rs': case 'rv': case 'rd': return v == null ? '' : num(v, 2) + (r.m === 3 && v ? ` <span class="rsub" style="color:var(--text-3)">${T().quarter}</span>` : '');
    case 'retp': case 'rr0': case 'rr1': case 'rrd': case 'gainP': return v == null ? '' : pc(v);
    case 'price': return n(v, 4); case 'bought': case 'units': return n(v, 2);
    case 'cpi': return n(v, 2);
    default: return n(v, 2);
  }
}
function renderTable() {
  const t = T(), rows = SIM.rows;
  document.getElementById('tbTitle').innerHTML = `${t.tbTitle}${ik('tbl')}${xbtn()}`;
  document.getElementById('tbLead').textContent = t.tbLead;
  const bar = document.getElementById('tbBar');
  bar.innerHTML = seg('tb', [['y', t.tbYear], ['a', t.tbAll]], ST.tb);
  bar.querySelectorAll('[data-seg] button').forEach(b => b.addEventListener('click', () => { ST.tb = b.dataset.v; save(); renderTable(); }));
  const tb = document.getElementById('tbl');
  if (ST.tb === 'a') {
    tb.innerHTML = `<thead><tr>${COLS_ALL.map(k => `<th class="${k === 'date' || k === 'fund' ? 'l' : ''}">${t.th[k]}</th>`).join('')}</tr></thead><tbody>`
      + rows.map(r => r.sw ? `<tr class="sw"><td class="l">${dots(r.d)}</td><td class="l" colspan="9">${t.swRow(shortFund(r.sw[0]), shortFund(r.sw[1]))}</td><td>${num(r.price, 4)}</td><td>${num(r.bought, 2)}</td><td>${num(r.units, 2)}</td><td>${num(r.val, 2)}</td><td colspan="${COLS_ALL.length - 14}"></td></tr>`
        : `<tr${r.valOnly ? ' class="est"' : ''}>${COLS_ALL.map(k => `<td class="${k === 'date' || k === 'fund' ? 'l' : ''}">${cellOf(r, k)}</td>`).join('')}</tr>`).join('') + '</tbody>';
  } else {
    const ys = [...new Set(rows.map(r => yearOf(r.d)))];
    tb.innerHTML = `<thead><tr><th class="l">${t.th.year}</th><th class="l">${t.th.fund}</th><th>${t.th.cs}</th><th>${t.th.cv}</th><th>${t.th.cd}</th><th>${t.th.yc}</th><th class="bl">${t.th.st}</th><th>${t.th.ye}</th><th>${t.th.ret}</th><th>${t.th.retp}</th><th class="bl">${t.th.real}</th><th>${t.th.gainP}</th><th class="bl">${t.th.ann}</th><th>${t.th.rr1}</th></tr></thead><tbody>`
      + ys.map(y => {
        const rs = rows.filter(r => yearOf(r.d) === y), e = rs[rs.length - 1], s = k => rs.reduce((a, r) => a + (r[k] || 0), 0);
        return `<tr><td class="l">${y}</td><td class="l">${shortFund(e.fund)}</td><td>${num(s('cs'))}</td><td>${num(s('cv'))}</td><td>${num(s('cd'))}</td><td>${num(s('ct'))}</td><td class="bl">${num(e.st)}</td><td>${num(e.val)}</td>`
          + `<td class="${e.ret >= 0 ? 'up' : 'down'}">${num(e.ret)}</td><td>${e.retp == null ? '' : pc(e.retp)}</td><td class="bl">${num(e.realSum)}</td><td>${e.gainP == null ? '' : pc(e.gainP)}</td><td class="bl">${num(e.ann)}</td><td>${e.rr1 == null ? '' : pc(e.rr1)}</td></tr>`;
      }).join('') + '</tbody>';
  }
  document.getElementById('tbNote').textContent = SIM.est.length ? t.estNote(SIM.est.join('; ')) : '';
}

/* ---------- Excel su formulėmis ---------- */
function loadXlsx() { return new Promise((ok, no) => { if (window.XLSX) return ok(); const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload = ok; s.onerror = no; document.head.appendChild(s); }); }
function book() {
  const t = T(), rows = SIM.rows, H = t.th;
  // A data, B fondas, C atlyginimas, D-F tarifai, G-I įmokos, J bendra, K vieneto vertė, L įsigyta, M vnt. iš viso, N sukaupta, O-R sumos, S grąža, T grąža %, U anuitetas, V pensija, W neto DU, X pensija su kaupimu, Y-AA pakeitimo normos, AB VKI, AC įmokos vertė šiandien, AD vertė iš viso, AE pokytis €, AF pokytis %
  const head = [H.date, H.fund, H.wage, H.rs, H.rv, H.rd, H.cs, H.cv, H.cd, H.ct, H.price, H.bought, H.units, H.val, H.ss, H.sv, H.sd, H.st, H.ret, H.retp, H.ann, H.pen, H.net, H.tot, H.rr0, H.rr1, H.rrd, H.cpi, H.real, `Σ ${H.real}`, H.gainE, H.gainP];
  const aoa = [head], ref = SIM.rows.length + 3, cpiCell = `$AB$${ref}`;
  rows.forEach((r, i) => {
    const R = i + 2, P1 = i ? R - 1 : null, prev = c => P1 ? `${c}${P1}+` : '';
    const f = (x, v, z) => ({ f: x, v, z });
    const row = [{ v: iso(r.d) }, { v: r.sw ? t.swRow(r.sw[0], r.sw[1]) : r.fund }];
    if (r.sw) {
      row.push(null, null, null, null, { v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }, { v: r.price, z: '0.0000' }, f(`N${P1}/K${R}`, r.bought, '0.00'), f(`L${R}`, r.units, '0.00'));
    } else {
      const mult = r.m || 1;
      row.push(r.wage != null ? { v: r.wage, z: '0.00' } : null, r.rs != null ? { v: r.rs / 100, z: '0.00%' } : null, r.rv != null ? { v: r.rv / 100, z: '0.00%' } : null, r.rd != null ? { v: r.rd / 100, z: '0.00%' } : null,
        r.rs != null ? f(`C${R}*D${R}${mult > 1 ? `*${mult}` : ''}`, r.cs, '0.00') : { v: 0 },
        r.rv != null ? { v: r.cv, z: '0.00' } : { v: r.cv || 0, z: '0.00' },
        r.rd != null ? f(`C${R}*F${R}${mult > 1 ? `*${mult}` : ''}`, r.cd, '0.00') : { v: 0 },
        f(`G${R}+H${R}+I${R}`, r.ct, '0.00'), { v: r.price, z: '0.0000' }, f(`J${R}/K${R}`, r.bought, '0.00'), f(`${prev('M')}L${R}`, r.units, '0.00'));
    }
    row.push(f(`M${R}*K${R}`, r.val, '0.00'), f(`${prev('O')}G${R}`, r.ss, '0.00'), f(`${prev('P')}H${R}`, r.sv, '0.00'), f(`${prev('Q')}I${R}`, r.sd, '0.00'), f(`O${R}+P${R}+Q${R}`, r.st, '0.00'),
      f(`N${R}-R${R}`, r.ret, '0.00'), r.st ? f(`S${R}/R${R}`, r.retp, '0.00%') : null, f(`N${R}/1000*${J.annuity}`, r.ann, '0.00'),
      r.pen != null ? { v: r.pen, z: '0.00' } : null, r.net != null ? { v: r.net, z: '0.00' } : null,
      r.pen != null ? f(`V${R}+U${R}`, r.tot, '0.00') : null, r.pen != null ? f(`V${R}/W${R}`, r.rr0, '0.00%') : null, r.pen != null ? f(`X${R}/W${R}`, r.rr1, '0.00%') : null, r.pen != null ? f(`Z${R}-Y${R}`, r.rrd, '0.00%') : null,
      r.cpi != null ? { v: r.cpi, z: '0.00' } : null, r.cpi != null ? f(`J${R}*${cpiCell}/AB${R}`, r.real, '0.00') : { v: 0 }, f(`${prev('AD')}AC${R}`, r.realSum, '0.00'),
      f(`N${R}-AD${R}`, r.gainE, '0.00'), r.realSum ? f(`AE${R}/AD${R}`, r.gainP, '0.00%') : null);
    aoa.push(row);
  });
  aoa.push([]);
  const refRow = new Array(32).fill(null); refRow[0] = { v: lang === 'lt' ? 'Naujausias VKI (įmokų vertei šiandien)' : 'Latest CPI (for contributions in today’s prices)' }; refRow[27] = { v: SIM.cpiRef, z: '0.00' };
  aoa.push(refRow);
  aoa.push([{ v: t.info.tbl }]);
  if (SIM.est.length) aoa.push([{ v: t.estNote(SIM.est.join('; ')) }]);
  const cell = c => c == null ? null : c.f ? { t: 'n', f: c.f, v: c.v, z: c.z } : typeof c.v === 'number' ? { t: 'n', v: c.v, z: c.z } : { t: 's', v: c.v };
  const ws = XLSX.utils.aoa_to_sheet(aoa.map(r => r.map(cell)));
  ws['!cols'] = head.map((h, i) => ({ wch: i === 1 ? 34 : 13 }));
  // pradiniai duomenys
  const inp = [[t.xIn[0]], ['', H.rs, H.rv, H.rd, `${H.rd} (${t.rGrad})`], ...J.rates.map(r => r.map(x => x == null ? '' : x)), [],
    [t.xIn[1]], [H.year, 'Bruto', 'Neto'], ...Object.entries(J.wages).map(([y, w]) => [+y, w[0], w[1]]), [],
    [t.xIn[2]], ...Object.entries(J.pensions).map(([y, v]) => [+y, v]), [],
    [t.xIn[3]], [H.year, t.rMax, t.rGrad], ...Object.entries(J.incentive).map(([y, v]) => [+y, v[0], v[1]]), [],
    [t.xIn[4]], ...Object.entries(J.cpi).map(([m, v]) => [m, v]), [],
    [t.xIn[5]], ...J.old.map(r => r)];
  const wi = XLSX.utils.aoa_to_sheet(inp); wi['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, t.xSheets[0]); XLSX.utils.book_append_sheet(wb, wi, t.xSheets[1]);
  return wb;
}
async function download() { await loadXlsx(); XLSX.writeFile(book(), `${lang === 'lt' ? 'Kelias_i_pensija' : 'Retirement_journey'}_${P.birth}_${iso(P.asof)}.xlsx`); }

function renderAll() {
  document.getElementById('sub').textContent = `${T().navJourney} · ${T().updated} ${JDATA.generated}`;
  P = params(); SIM = simulate(P);
  renderBar(); renderKpis(); renderStory(); renderChart(); renderTable();
  document.getElementById('foot').textContent = T().foot;
}
document.addEventListener('click', e => {
  if (e.target.closest('.xls')) { download().catch(err => alert('Excel: ' + err)); return; }
  const pop = document.getElementById('pop'), b = e.target.closest('.info');
  if (!b) { if (!e.target.closest('#pop')) pop.style.display = 'none'; return; }
  e.stopPropagation();
  if (pop.style.display === 'block' && pop._b === b) { pop.style.display = 'none'; return; }
  pop.textContent = T().info[b.dataset.k]; pop._b = b; pop.style.display = 'block';
  const r = b.getBoundingClientRect(), w = pop.offsetWidth;
  pop.style.left = Math.max(8, Math.min(r.left + scrollX - 8, scrollX + document.documentElement.clientWidth - w - 8)) + 'px'; pop.style.top = (r.bottom + scrollY + 6) + 'px';
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.getElementById('pop').style.display = 'none'; });
addEventListener('resize', () => { clearTimeout(window._rz); window._rz = setTimeout(renderChart, 150); });
renderHeader('journey', renderAll);
renderAll();
