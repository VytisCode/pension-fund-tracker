/* „Baltijos šalys“ (savininko užduotis 2026-10-20): Lietuvos, Latvijos ir Estijos II ir III pakopos fondai vienoje vietoje.
   Fondai lyginami šalies grupėse (LT – gimimo metų grupės, LV – akcijų dalis, EE – oficialių grupių nėra), o tarp šalių – tik
   panašios rizikos grupėse (3 metų metinis vertės svyravimas, skaičiuojamas vienodai visiems fondams). Skirtuke „Palyginti“ –
   laisvas bet kurių fondų palyginimas. Duomenys – docs/data_baltic.js (baltic.py). */
const ltN = (n, a, b, c) => { const k = Math.abs(Math.round(n)), d = k % 10, h = k % 100; return d === 1 && h !== 11 ? a : d >= 2 && (h < 12 || h > 19) ? b : c; };   // lietuviški linksniai (kaip mkt.js)
addStrings({
  navBaltic: 'Baltic states',
  ovT: 'Lithuania, Latvia and Estonia', ovL: 'Pillar II and III pension funds of the three Baltic states in one place. Within a country funds are compared in that country’s groups; across countries only funds of similar risk are compared (clearly marked).',
  c: { LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia' }, pl: p => `Pillar ${p}`, both: 'Both pillars',
  kFunds: (a, b) => `Funds: <b>${a}</b> in pillar II, <b>${b}</b> in pillar III`, kNa: v => `Pillar II assets: <b>${v}</b>`, kInv: v => `Pillar II active investors: <b>${v}</b>`,
  kNaLv: 'Assets and participants per plan are not published on manapensija.lv.', kNaQ: q => `quarterly reports, ${q}`, mkT: c => `${c}: market over time`, lvN: c => `Net assets at quarter end, all plans of the pillar (Bank of Latvia statistics, table 325). Assets of each pillar II plan – from managers’ quarterly reports (manapensija.lv)${c ? `; check: on ${c[0]} the sum of all plan reports is ${num(c[1], 1)} m €, the Bank of Latvia total ${num(c[2], 1)} m € (difference ${pctPlain(Math.abs(c[1] / c[2] - 1) * 100, 2)})` : ''}.`,
  topT: 'Largest investments', topL: 'The 10 largest investments of the selected funds, as published by the manager (Latvia – quarterly report, Estonia – monthly investment report on pensionikeskus.ee; Lithuanian portfolios – on the “Portfolios” page).', topNone: 'None of the selected funds has a published top-10 list here yet (it exists for Latvian pillar II plans and Estonian funds).', topQ: q => `As of ${q}`, topW: 'Share', kFee: (v, k) => `Average fee: <b>${v}</b> (${k})`, kR: (v, n) => `Median 1-year return of high-risk pillar II funds: <b>${v}</b> (${n} funds)`,
  feeK: { ter: 'ongoing charges, TER', fix: 'fixed part of the fee' }, feeLt: 'Lithuanian fees – on the “Reports” page',
  rkT: 'Similar risk across countries', rkN: 'Groups by 3-year annual volatility of unit value, the same calculation for every fund. Pillar II and III funds together. Median return of the group’s funds in each country; best fund below. 3, 5 and 10-year returns are annual.',
  rg: { r1: 'Low risk (volatility under 4%)', r2: 'Moderate (4–8%)', r3: 'Higher (8–12%)', r4: 'High (over 12%)' }, rgS: { r1: 'Low', r2: 'Moderate', r3: 'Higher', r4: 'High' }, rgNone: 'Too short history',
  hz: { y1: '1 year', y3: '3 years', y5: '5 years', y10: '10 years', ytd: 'Year to date', max: 'Since data start' },
  thRisk: 'Risk group', med: 'median', nF: n => `${n} funds`,
  eeT: 'Estonia: market over time', eeSeg: { na: 'Assets, € m', inv: 'Active investors (pillar II)' }, eeN: 'Sum of all funds at month end (pensionikeskus.ee).',
  fdT: 'All funds', fdL: 'Filter by country, pillar and group; click a column to sort; tick funds to compare them in the “Compare” tab.',
  fAll: 'All groups', fRisk: 'Risk groups (all countries)', fCg: c => `Groups – ${c}`, fQ: 'Search fund or manager…', fClosed: 'Show closed funds',
  cols: { c: 'Country', pl: 'Pillar', m: 'Manager', n: 'Fund', cg: 'Country group', risk: 'Risk group', vol: 'Volatility 3 y', y1: '1 y', y3: '3 y*', y5: '5 y*', y10: '10 y*', max: 'Since data start*', fee: 'Fee', eq: 'Equities', na: 'Assets, € m', inv: 'Participants', last: 'Data to', cmp: 'Compare' },
  fN: n => `${n} funds. * annual return. Returns are unit value changes (fees already deducted). Fee: Estonia – ongoing charges (TER), Latvia – fixed part only. Latvian values – manapensija.lv index points every 9–13 days, so a return may end a few days earlier. Lithuanian history on this page starts in 2018–2019 (daily unit values); longer Lithuanian results are on the Home and Results pages.`,
  cg: { e30: 'Up to 30% equities', e75: '31–75% equities', e100: 'Over 75% equities', turto: 'Asset preservation', born: (a, b) => `Born ${a}–${b}` }, none: '–',
  cmT: 'Compare any funds', cmL: 'Choose any funds of any country and pillar. Values are rebased to 0% at the start of the period; the period starts no earlier than the youngest selected fund.',
  cmAdd: 'Add a fund…', cmClear: 'Clear', cmDef: 'Suggested', cmNone: 'Choose at least one fund.',
  cmCols: { n: 'Fund', r: 'Return in period', a: 'Annual', vol: 'Volatility 3 y', fee: 'Fee', risk: 'Risk group' }, cmFrom: (a, b) => `Period: ${a} – ${b}.`,
  mtT: 'How it is calculated',
  xl: 'Excel with calculations', xlT: 'Baltic pension funds', xlS: 'Funds', xlV: 'Values and returns', xlM: 'Methodology',
  xlH: ['Country', 'Pillar', 'Manager', 'Fund', 'Country group', 'Risk group', 'Volatility 3 y, %', 'Fee, %', 'Fee type', 'Equities, %', 'Assets, € m', 'Participants', 'Start of data'],
  xlVH: ['Country', 'Pillar', 'Fund', 'Last date', 'Last value', 'Date 1 y ago', 'Value 1 y ago', '1 y return', 'Date 3 y ago', 'Value 3 y ago', '3 y annual return', 'Date 5 y ago', 'Value 5 y ago', '5 y annual return'],
  srcLine: 'Sources: pensionikeskus.ee (Estonia), manapensija.lv (Latvia), pension fund managers and the Bank of Lithuania (Lithuania).',
}, {
  navBaltic: 'Baltijos šalys',
  ovT: 'Lietuva, Latvija ir Estija', ovL: 'Trijų Baltijos šalių II ir III pakopos pensijų fondai vienoje vietoje. Šalies viduje fondai lyginami tos šalies grupėse, o tarp šalių – tik panašios rizikos fondai (aiškiai pažymėta).',
  c: { LT: 'Lietuva', LV: 'Latvija', EE: 'Estija' }, pl: p => `${p} pakopa`, both: 'Abi pakopos',
  kFunds: (a, b) => `Fondų: <b>${a}</b> II pakopoje, <b>${b}</b> III pakopoje`, kNa: v => `II pakopos turtas: <b>${v}</b>`, kInv: v => `II pakopos aktyvių investuotojų: <b>${v}</b>`,
  kNaLv: 'Plānų turto ir dalyvių skaičiaus manapensija.lv neskelbia.', kNaQ: q => `ketvirčio ataskaitos, ${q}`, mkT: c => `${c}: rinka laike`, lvN: c => `Grynieji aktyvai ketvirčio pabaigoje, visi tos pakopos plānai (Latvijas Banka statistika, lentelė 325). Kiekvieno II pakopos plāno turtas – iš valdytojų ketvirčio ataskaitų (manapensija.lv)${c ? `; patikra: ${c[0]} visų plānų ataskaitų suma ${num(c[1], 1)} mln. €, Latvijas Banka – ${num(c[2], 1)} mln. € (skirtumas ${pctPlain(Math.abs(c[1] / c[2] - 1) * 100, 2)})` : ''}.`,
  topT: 'Didžiausios investicijos', topL: 'Pasirinktų fondų 10 didžiausių investicijų, kaip jas skelbia valdytojas (Latvija – ketvirčio ataskaita, Estija – mėnesio investicijų ataskaita pensionikeskus.ee; Lietuvos fondų portfeliai – puslapyje „Portfeliai ir turtas“).', topNone: 'Pasirinktiems fondams 10 didžiausių investicijų sąrašo čia dar nėra (jis yra Latvijos II pakopos plānams ir Estijos fondams).', topQ: q => `Duomenys ${q}`, topW: 'Dalis', kFee: (v, k) => `Vidutinis mokestis: <b>${v}</b> (${k})`, kR: (v, n) => `Didelės rizikos II pakopos fondų 1 metų grąžos mediana: <b>${v}</b> (${n} fondai)`,
  feeK: { ter: 'einamosios išlaidos, TER', fix: 'pastovioji mokesčio dalis' }, feeLt: 'Lietuvos mokesčiai – puslapyje „Ataskaitos“',
  rkT: 'Panaši rizika skirtingose šalyse', rkN: 'Grupės pagal 3 metų metinį vieneto vertės svyravimą – visiems fondams skaičiuojama vienodai. II ir III pakopos fondai kartu. Kiekvienos šalies grupės fondų grąžos mediana; po ja – geriausias fondas. 3, 5 ir 10 metų grąžos – metinės.',
  rg: { r1: 'Maža rizika (svyravimas iki 4 %)', r2: 'Vidutinė (4–8 %)', r3: 'Didesnė (8–12 %)', r4: 'Didelė (daugiau nei 12 %)' }, rgS: { r1: 'Maža', r2: 'Vidutinė', r3: 'Didesnė', r4: 'Didelė' }, rgNone: 'Per trumpa istorija',
  hz: { y1: '1 metai', y3: '3 metai', y5: '5 metai', y10: '10 metų', ytd: 'Nuo metų pradžios', max: 'Nuo duomenų pradžios' },
  thRisk: 'Rizikos grupė', med: 'mediana', nF: n => `${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}`,
  eeT: 'Estija: rinka laike', eeSeg: { na: 'Turtas, mln. €', inv: 'Aktyvūs investuotojai (II pakopa)' }, eeN: 'Visų fondų suma mėnesio pabaigoje (pensionikeskus.ee).',
  fdT: 'Visi fondai', fdL: 'Atsirinkite šalį, pakopą ir grupę; spauskite stulpelį, kad surikiuotumėte; pažymėkite fondus, kad juos palygintumėte skirtuke „Palyginti“.',
  fAll: 'Visos grupės', fRisk: 'Rizikos grupės (visos šalys)', fCg: c => `Grupės – ${c}`, fQ: 'Ieškoti fondo ar valdytojo…', fClosed: 'Rodyti uždarytus fondus',
  cols: { c: 'Šalis', pl: 'Pakopa', m: 'Valdytojas', n: 'Fondas', cg: 'Grupė šalyje', risk: 'Rizikos grupė', vol: 'Svyravimas 3 m.', y1: '1 m.', y3: '3 m.*', y5: '5 m.*', y10: '10 m.*', max: 'Nuo duomenų pradžios*', fee: 'Mokestis', eq: 'Akcijos', na: 'Turtas, mln. €', inv: 'Dalyviai', last: 'Duomenys iki', cmp: 'Lyginti' },
  fN: n => `${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}. * metinė grąža. Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti). Mokestis: Estijoje – einamosios išlaidos (TER), Latvijoje – tik pastovioji dalis. Latvijos vertės – manapensija.lv indekso taškai kas 9–13 dienų, todėl grąža gali baigtis keliomis dienomis anksčiau. Lietuvos istorija šiame puslapyje – nuo 2018–2019 m. (kasdienės vieneto vertės); ilgesni Lietuvos rezultatai – Pradžios ir Rezultatų puslapiuose.`,
  cg: { e30: 'Iki 30 % akcijų', e75: '31–75 % akcijų', e100: 'Daugiau nei 75 % akcijų', turto: 'Turto išsaugojimo', born: (a, b) => `Gimę ${a}–${b}` }, none: '–',
  cmT: 'Palyginti bet kuriuos fondus', cmL: 'Pasirinkite bet kuriuos bet kurios šalies ir pakopos fondus. Vertės perskaičiuotos nuo 0 % laikotarpio pradžioje; laikotarpis prasideda ne anksčiau nei jauniausio pasirinkto fondo pradžia.',
  cmAdd: 'Pridėti fondą…', cmClear: 'Išvalyti', cmDef: 'Siūlomi', cmNone: 'Pasirinkite bent vieną fondą.',
  cmCols: { n: 'Fondas', r: 'Grąža per laikotarpį', a: 'Metinė', vol: 'Svyravimas 3 m.', fee: 'Mokestis', risk: 'Rizikos grupė' }, cmFrom: (a, b) => `Laikotarpis: ${a} – ${b}.`,
  mtT: 'Kaip skaičiuota',
  xl: 'Excel su skaičiavimais', xlT: 'Baltijos šalių pensijų fondai', xlS: 'Fondai', xlV: 'Vertės ir grąžos', xlM: 'Metodika',
  xlH: ['Šalis', 'Pakopa', 'Valdytojas', 'Fondas', 'Grupė šalyje', 'Rizikos grupė', 'Svyravimas 3 m., %', 'Mokestis, %', 'Mokesčio rūšis', 'Akcijos, %', 'Turtas, mln. €', 'Dalyviai', 'Duomenų pradžia'],
  xlVH: ['Šalis', 'Pakopa', 'Fondas', 'Paskutinė data', 'Paskutinė vertė', 'Data prieš 1 m.', 'Vertė prieš 1 m.', '1 m. grąža', 'Data prieš 3 m.', 'Vertė prieš 3 m.', '3 m. metinė grąža', 'Data prieš 5 m.', 'Vertė prieš 5 m.', '5 m. metinė grąža'],
  srcLine: 'Šaltiniai: pensionikeskus.ee (Estija), manapensija.lv (Latvija), pensijų fondų valdytojai ir Lietuvos bankas (Lietuva).',
});
const MT = {
  lt: `<h3>Šaltiniai</h3><ul>
<li><b>Estija</b> – pensionikeskus.ee (Estijos pensijų centras): kasdienės II ir III pakopos fondų vieneto vertės, grynieji aktyvai ir II pakopos aktyvūs investuotojai nuo 2002 m.; einamosios išlaidos (TER) ir grąžos – kasdienė statistika.</li>
<li><b>Latvija</b> – manapensija.lv (nacionalinė pensijų svetainė): II ir III pakopos plānų sąrašas, valdytojas, pastovioji mokesčio dalis, akcijų dalis, valdymo būdas ir plano vertės grafikas (indeksas, 100 = plano pradžia arba 2003 m.), taškai kas 9–13 dienų.</li>
<li><b>Lietuva</b> – tie patys duomenys kaip kituose šios svetainės puslapiuose: fondų valdytojų skelbiamos vieneto vertės (II ir III pakopa) ir grynieji aktyvai.</li></ul>
<p>Duomenys atnaujinami automatiškai kiekvieną dieną. Istorija nekeičiama – kiekvieną kartą tik papildoma.</p>
<h3>Grąža</h3><p>Grąža – vieneto vertės (Latvijoje – indekso) pokytis tarp dviejų datų; mokesčiai jau atskaityti. 3, 5, 10 metų ir „nuo pradžios“ grąžos – metinės: (1 + bendra grąža)<sup>365,25 / dienų skaičius</sup> − 1. Pradžios vertė – paskutinė žinoma vertė pradžios dieną ar prieš ją (Latvijoje – artimiausias ankstesnis taškas, ne senesnis kaip 20 d.).</p>
<h3>Rizikos grupės</h3><p>Tarp šalių lyginami tik panašios rizikos fondai. Rizika – paskutinių 3 metų metinis vertės svyravimas: logaritminių vertės pokyčių (savaitės pabaigos; Latvijoje – grafiko taškų) standartinis nuokrypis × √(365 / vidutinis intervalas dienomis). Grupės: iki 4 %, 4–8 %, 8–12 %, daugiau nei 12 %. Fondams, turintiems mažiau nei 3 metų istoriją, grupė nenustatoma.</p>
<h3>Šalių grupės</h3><p>Lietuvoje – LB gyvenimo ciklo grupės (pagal gimimo metus) ir turto išsaugojimo fondai. Latvijoje – pagal plane nurodytą akcijų dalį: iki 30 %, 31–75 %, daugiau nei 75 %. Estijoje oficialių grupių nėra, todėl naudojamos rizikos grupės.</p>
<h3>Ką verta žinoti</h3><ul><li>Mokesčiai nevienodi: Estijoje nurodomos visos einamosios išlaidos (TER), Latvijoje – tik pastovioji mokesčio dalis (kintamoji dalis priklauso nuo rezultatų ir čia neįtraukta).</li>
<li>Latvijos II pakopos plānų turtas ir 10 didžiausių investicijų imami iš valdytojų ketvirčio ataskaitų (PDF manapensija.lv), kurias svetainė perskaito automatiškai. Latvijos rinkos dydis laike – Latvijas Banka statistika (grynieji aktyvai ketvirčio pabaigoje, nuo 2022 m.); visų plānų ataskaitų suma su ja tikrinama (2026-06-30 skirtumas – 0,01 %). Dalyvių skaičius rodomas tik tų plānų, kurių ataskaitos tekste jis nurodytas. III pakopos plānų ataskaitų manapensija.lv neskelbia.</li>
<li>Estijos fondų 10 didžiausių investicijų – iš naujausios mėnesio investicijų ataskaitos pensionikeskus.ee (LHV, SEB, Luminor, Tuleva skelbia visą sąrašą – imamos 10 didžiausių pagal dalį grynųjų aktyvų; Swedbank – faktų lapo „Top 10“). Pinigai sąskaitose į sąrašą neįtraukiami.</li>
<li>Latvijos vertės – grafiko taškai, todėl paskutinė data gali būti kelias dienas senesnė nei Estijos ar Lietuvos.</li>
<li>Uždaryti ar sujungti fondai pagal nutylėjimą nerodomi (galima įjungti skirtuke „Rezultatai“ → „Fondo duomenys“).</li></ul>
<h3>Reali grąža</h3><p>Reali grąža – vieneto vertės pokytis, atėmus tos šalies infliaciją: (1 + grąža) ÷ (1 + infliacija) − 1. Infliacija – Eurostat suderintas vartotojų kainų indeksas (SVKI, visos prekės ir paslaugos), kiekvienai šaliai savas. Naudojamas datos mėnesio indeksas; dienoms po paskutinio paskelbto mėnesio – paskutinis žinomas.</p>`,
  en: `<h3>Sources</h3><ul>
<li><b>Estonia</b> – pensionikeskus.ee (Estonian Pension Centre): daily unit values, net assets of pillar II and III funds and active pillar II investors since 2002; ongoing charges (TER) and returns – daily statistics.</li>
<li><b>Latvia</b> – manapensija.lv (national pension website): list of pillar II and III plans, manager, fixed part of the fee, equity share, management style and the plan value chart (index, 100 = plan start or 2003), points every 9–13 days.</li>
<li><b>Lithuania</b> – the same data as on the other pages of this site: unit values published by managers (pillars II and III) and net assets.</li></ul>
<p>Data are updated automatically every day. History is never changed – only added to.</p>
<h3>Return</h3><p>Return is the change in unit value (in Latvia – index) between two dates; fees are already deducted. 3, 5, 10-year and “since start” returns are annual: (1 + total return)<sup>365.25 / days</sup> − 1. The start value is the last known value on or before the start date (in Latvia – the nearest earlier point, at most 20 days older).</p>
<h3>Risk groups</h3><p>Across countries only funds of similar risk are compared. Risk is the 3-year annual volatility of the value: standard deviation of log changes (week-end values; in Latvia – chart points) × √(365 / average interval in days). Groups: under 4%, 4–8%, 8–12%, over 12%. Funds with less than 3 years of history get no group.</p>
<h3>Country groups</h3><p>Lithuania – Bank of Lithuania life-cycle groups (by year of birth) and asset preservation funds. Latvia – by the plan’s equity share: up to 30%, 31–75%, over 75%. Estonia has no official groups, so risk groups are used.</p>
<h3>Good to know</h3><ul><li>Fees differ: Estonia shows total ongoing charges (TER), Latvia only the fixed part of the fee (the variable, performance-linked part is not included).</li>
<li>Latvian pillar II plan assets and the 10 largest investments come from managers’ quarterly reports (PDF on manapensija.lv), read automatically by this site. Latvian market size over time – Bank of Latvia statistics (net assets at quarter end, since 2022); the sum of all plan reports is checked against it (difference 0.01% on 30 June 2026). Participants are shown only where the report text states them. Pillar III plan reports are not published on manapensija.lv.</li>
<li>Estonian funds’ 10 largest investments – from the latest monthly investment report on pensionikeskus.ee (LHV, SEB, Luminor, Tuleva publish the full list – the 10 largest by share of net assets are taken; Swedbank – the factsheet “Top 10”). Cash accounts are not included.</li>
<li>Latvian values are chart points, so the last date may be a few days older than in Estonia or Lithuania.</li>
<li>Closed or merged funds are hidden by default (can be switched on in “Results” → “Fund data”).</li></ul>
<h3>Real return</h3><p>Real return is the change in unit value after the country’s inflation: (1 + return) ÷ (1 + inflation) − 1. Inflation – Eurostat harmonised index of consumer prices (HICP, all items), separate for each country. The index of the date’s month is used; for days after the last published month – the last known one.</p>`,
};
const $ = id => document.getElementById(id);
const BX = BALTIC.funds;
BX.forEach(f => { let s = 0; f.D = f.d.map(x => (s += x)); f.V = f.v; f.first = f.D[0]; f.last = f.D[f.D.length - 1]; });
const TOP = Math.max(...BX.map(f => f.last));
BX.forEach(f => { f.closed = f.last < TOP - 45; });
const TOL = f => f.c === 'LV' ? 20 : 7;   // LV taškai kas 9–18 d.
const PAL = ['#2b8de0', '#ff7a2a', '#2f8f12', '#8a43c4', '#12b5b0', '#c9765a', '#2b3a93', '#d4a017', '#e0457b', '#5e9c76'];
function at(f, x) {                                // paskutinė vertė dieną x ar anksčiau (ne senesnė nei TOL dienų)
  let lo = 0, hi = f.D.length - 1, k = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (f.D[m] <= x) { k = m; lo = m + 1; } else hi = m - 1; }
  return k < 0 || x - f.D[k] > TOL(f) ? null : { d: f.D[k], v: f.V[k] };
}
const ytdStart = x => Math.round(Date.UTC(new Date(x * DAY).getUTCFullYear() - 1, 11, 31) / DAY);
function ret(f, h, end = f.last) {               // grąža %: y1 – bendra, y3/y5/y10/max – metinė
  const e = at(f, end); if (!e) return null;
  const s = h === 'max' ? { d: f.first, v: f.V[0] } : at(f, h === 'ytd' ? ytdStart(e.d) : e.d - Math.round(365.25 * +h.slice(1)));
  if (!s || s.d >= e.d) return null;
  const tot = e.v / s.v - 1, yrs = (e.d - s.d) / 365.25;
  return (h === 'y1' || h === 'ytd' || yrs < 1 ? tot : Math.pow(1 + tot, 1 / yrs) - 1) * 100;
}
const median = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
const fmtP = x => x == null ? T().none : pctPlain(x);
const sgn = x => x == null ? '' : x < 0 ? 'neg' : 'pos';
function cgLabel(f) {
  const t = T().cg; if (!f.cg) return T().none;
  if (f.cg === 'turto') return t.turto;
  if (f.cg[0] === 'b') { const m = f.n.match(/(\d{4})\s*[-–]\s*(\d{4})/); return m ? t.born(m[1], m[2]) : f.cg; }
  return t[f.cg] || f.cg;
}
const label = f => `${f.c} · ${f.n}`;
const rgHtml = f => f.risk ? `<span class="rg ${f.risk}" title="${hEsc(T().rg[f.risk])}">${T().rgS[f.risk]}</span>` : `<span class="note">${T().rgNone}</span>`;

/* ---------- Puslapio sandara (savininkas 2026-10-21: „labai sudėtinga orientuotis … viską reikia perkurti“). Viršuje vienas
   pasirinkimas: Lietuva, Latvija, Estija arba Šalių palyginimas. Pasirinkus šalį – tie patys skirtukai ta pačia tvarka kaip Lietuvos
   puslapiuose (Apžvalga, Rezultatai, Rizika, Metai, Fondų palyginimas, Didžiausios investicijos), todėl perjungus šalį lieka tas pats
   vaizdas. Šalių palyginime – tik panašios rizikos fondai, laisvas palyginimas ir reformos. ---------- */
addStrings({ bx: {
  modes: { X: 'Compare countries' }, modesS: { X: 'Compare' },
  tabs: { fl: 'Asset change', ov: 'Overview', cr: 'Results', rs: 'Risk', yr: 'Years', cmp: 'Fund comparison', top: 'Largest investments', jr: 'Road to retirement', rk: 'Similar risk', hm: 'Yearly returns', rf: 'Reforms', bs: 'Baltic market' },
  ovT: c => `${c}: overview`, ovL: { LT: 'Lithuanian pillar II and III funds in the same views as Latvian and Estonian ones. More about Lithuania – on the Results and Market facts pages.', LV: 'Latvian pillar II and III pension plans (manapensija.lv). Funds are compared within Latvian groups by equity share.', EE: 'Estonian pillar II and III pension funds (pensionikeskus.ee). Estonia has no official groups, so funds are compared within risk groups.' },
  ldT: p => `Leaders of each group, ${p}`, ldN: 'Median return of the group and its best and weakest fund. 3, 5 and 10-year returns are annual.',
  ldH: ['Group', 'Funds', 'Median', 'Best', 'Weakest'],
  ltMk: 'Lithuanian market over time (assets, participants, managers’ shares) – on the <a href="facts.html#tab=mk">Market facts → Market over time</a> page.',
  xT: 'Lithuania, Latvia and Estonia side by side', xL: 'Funds of different countries are compared only within the same risk group (3-year volatility, the same calculation for every fund).',
  crL: 'Funds by their country group. Colour – the fund’s place in its group in that column (green – best, red – worst). Click a column to sort; tick funds to compare them in “Fund comparison”.',
  view: { ret: 'Return', dat: 'Fund data' },
  yrT: c => `${c}: calendar-year returns`, yrL: 'Each fund’s return in every calendar year, compared within its group. Colour – place in group that year. Click a year to sort.',
  yrN: d => `* – year to date (to ${d}). Return from the last value of the previous year to the last value of the year; years in which a fund did not exist for the whole year are empty.`,
  cmL: c => `Choose any ${c} funds. Values are rebased to 0% at the start of the period.`,
  topT: c => `${c}: largest investments`, topL: { LV: 'The 10 largest investments of each Latvian pillar II plan, from the managers’ quarterly reports (manapensija.lv).', EE: 'The 10 largest investments of each Estonian fund, from the monthly investment reports (pensionikeskus.ee).' },
  topLt: 'Full portfolios of Lithuanian funds – on the <a href="portfolios.html">Portfolios and assets</a> page.',
  cmTop: 'Largest investments of the selected funds', closed: 'closed', fClosed: 'Show closed funds', mt: 'How it is calculated (methodology)' } }, { bx: {
  modes: { X: 'Šalių palyginimas' }, modesS: { X: 'Palyginimas' },
  tabs: { fl: 'Turto pokytis', ov: 'Apžvalga', cr: 'Rezultatai', rs: 'Rizika', yr: 'Metai', cmp: 'Fondų palyginimas', top: 'Didžiausios investicijos', jr: 'Kelias į pensiją', rk: 'Panaši rizika', hm: 'Metų grąžos', rf: 'Reformos', bs: 'Baltijos rinka' },
  ovT: c => `${c}: apžvalga`, ovL: { LT: 'Lietuvos II ir III pakopos fondai tais pačiais vaizdais kaip Latvijos ir Estijos. Daugiau apie Lietuvą – puslapiuose „Rezultatai“ ir „Rinkos faktai“.', LV: 'Latvijos II ir III pakopos pensijų plānai (manapensija.lv). Fondai lyginami Latvijos grupėse pagal akcijų dalį.', EE: 'Estijos II ir III pakopos pensijų fondai (pensionikeskus.ee). Estijoje oficialių grupių nėra, todėl fondai lyginami rizikos grupėse.' },
  ldT: p => `Grupių lyderiai, ${p}`, ldN: 'Grupės grąžos mediana, geriausias ir silpniausias fondas. 3, 5 ir 10 metų grąžos – metinės.',
  ldH: ['Grupė', 'Fondų', 'Mediana', 'Geriausias', 'Silpniausias'],
  ltMk: 'Lietuvos rinka laike (turtas, dalyviai, valdytojų dalys) – puslapyje <a href="facts.html#tab=mk">Rinkos faktai → Rinka laike</a>.',
  xT: 'Lietuva, Latvija ir Estija greta', xL: 'Skirtingų šalių fondai lyginami tik tos pačios rizikos grupės viduje (3 metų svyravimas, visiems fondams skaičiuojamas vienodai).',
  crL: 'Fondai pagal jų šalies grupes. Spalva – fondo vieta grupėje tame stulpelyje (žalia – geriausia, raudona – prasčiausia). Spauskite stulpelį, kad surikiuotumėte; pažymėkite fondus, kad palygintumėte skirtuke „Fondų palyginimas“.',
  view: { ret: 'Grąža', dat: 'Fondo duomenys' },
  yrT: c => `${c}: kalendorinių metų grąžos`, yrL: 'Kiekvieno fondo grąža kiekvienais kalendoriniais metais, lyginama jo grupėje. Spalva – vieta grupėje tais metais. Spauskite metus, kad surikiuotumėte.',
  yrN: d => `* – nuo metų pradžios (iki ${d}). Grąža – nuo paskutinės praėjusių metų vertės iki paskutinės metų vertės; metai, kuriais fondas veikė ne visus metus, tušti.`,
  cmL: c => `Pasirinkite bet kuriuos fondus (${c}). Vertės perskaičiuotos nuo 0 % laikotarpio pradžioje.`,
  topT: c => `${c}: didžiausios investicijos`, topL: { LV: 'Kiekvieno Latvijos II pakopos plāno 10 didžiausių investicijų iš valdytojų ketvirčio ataskaitų (manapensija.lv).', EE: 'Kiekvieno Estijos fondo 10 didžiausių investicijų iš mėnesio investicijų ataskaitų (pensionikeskus.ee).' },
  topLt: 'Visi Lietuvos fondų portfeliai – puslapyje <a href="portfolios.html">Portfeliai ir turtas</a>.',
  cmTop: 'Pasirinktų fondų didžiausios investicijos', closed: 'uždarytas', fClosed: 'Rodyti uždarytus fondus', mt: 'Kaip skaičiuota (metodika)' } });
const TABS = { c: ['ov', 'cr', 'rs', 'mg', 'fl', 'top', 'jr'], X: ['bs', 'rk', 'hm', 'cmp', 'rf'] };   // kiti šalies skirtukai – baltic_*.html (common.js bxTabs)
const TMAP = { fl: 'bs', jr: 'rk', ov: 'rk', cr: 'rk', rs: 'rk', mg: 'bs', top: 'cmp', rk: 'cr', hm: 'cr', cmp: 'ov', rf: 'ov', bs: 'mg' };   // perjungus režimą – artimiausias skirtukas
const TID = { fl: 'flT', ov: 'ovT', cr: 'crT', rs: 'rsT', mg: 'mgT', top: 'topT', jr: 'jrT', rk: 'xT', hm: 'hmT', cmp: 'cmT', rf: 'rfT', bs: 'bsT' };
const modeTabs = () => CR.c === 'X' ? TABS.X : TABS.c.filter(k => k !== 'jr' || CR.pl === 'II');   // kelias į pensiją – tik II pakopa

/* ---------- Apžvalga (šalis) ir „Panaši rizika“ (šalių palyginimas) ---------- */
let RKH = 'ytd', EEK = 'na';   // numatytasis laikotarpis – nuo metų pradžios, kaip Lietuvos puslapiuose
function countryCard(c, act) {
  const t = T(), fs = act.filter(f => f.c === c), ii = fs.filter(f => f.pl === 'II'), na = ii.reduce((s, f) => s + (f.na || 0), 0), inv = ii.reduce((s, f) => s + (f.inv || 0), 0);
  const fees = fs.filter(f => f.fee != null).map(f => f.fee), hr = ii.filter(f => f.risk === 'r4').map(f => ret(f, 'y1')).filter(x => x != null);
  return `<section class="card"><h3><span class="flag">${c}</span>${t.c[c]}</h3><p>${t.kFunds(ii.length, fs.length - ii.length)}</p>`
    + (c === 'LV' && !na ? `<p>${t.kNaLv}</p>` : `<p>${t.kNa(na >= 1000 ? `${num(na / 1000, 2)} ${lang === 'lt' ? 'mlrd. €' : 'bn €'}` : `${num(na, 0)} ${lang === 'lt' ? 'mln. €' : 'm €'}`)}</p>`)
    + (c === 'LV' && na ? `<p class="note">${t.kNaQ(ii.map(f => f.naQ).filter(Boolean).sort().pop())}</p>` : '')
    + (inv && c !== 'LV' ? `<p>${t.kInv(num(inv, 0))}</p>` : '')
    + (fees.length ? `<p>${t.kFee(pctPlain(fees.reduce((a, b) => a + b, 0) / fees.length), t.feeK[fs.find(f => f.fee != null).feeK])}</p>` : `<p>${t.feeLt}</p>`)
    + (hr.length ? `<p>${t.kR(pctPlain(median(hr)), hr.length)}</p>` : '') + '</section>';
}
const hzSeg = (cur = RKH) => ['ytd', 'y1', 'y3', 'y5', 'y10'].map(h => `<button type="button" data-h="${h}" aria-pressed="${h === cur}">${T().hz[h]}</button>`).join('');
function renderOv() {
  const t = T(), b = t.bx, c = CR.c; if (c === 'X') return;
  const act = BX.filter(f => !f.closed);
  $('ovT').textContent = b.ovT(t.c[c]); $('ovL').textContent = b.ovL[c];
  $('kp1').innerHTML = countryCard(c, act);
  $('ldT').textContent = b.ldT(t.pl(CR.pl)); $('ldN').textContent = b.ldN; $('ldSeg').innerHTML = hzSeg();
  const cell = x => x ? `${hEsc(x.f.n)} <small class="note">${hEsc(x.f.m)}</small><br><b class="${sgn(x.v)}">${fmtP(x.v)}</b>` : t.none;
  $('ldTbl').innerHTML = `<thead><tr>${b.ldH.map((h, i) => `<th${i === 1 || i === 2 ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`
    + crGroups().map(g => { const xs = g.fs.map(f => ({ f, v: ret(f, RKH) })).filter(x => x.v != null).sort((a, b) => b.v - a.v);
      return `<tr><td>${hEsc(g.name)}</td><td class="n">${g.fs.length}</td><td class="n ${sgn(median(xs.map(x => x.v)))}"><b>${xs.length ? fmtP(median(xs.map(x => x.v))) : t.none}</b></td><td class="nm">${cell(xs[0])}</td><td class="nm">${xs.length > 1 ? cell(xs[xs.length - 1]) : t.none}</td></tr>`; }).join('') + '</tbody>';
  const E = (BALTIC.tot || {})[c], K = c === 'LV' ? 'na' : EEK;
  $('eeT').textContent = t.mkT(t.c[c]);
  if (!E) { $('eeSeg').innerHTML = ''; $('eeCh').innerHTML = `<p>${b.ltMk}</p>`; $('eeCh').style.minHeight = '0'; $('eeN').textContent = ''; return; }
  $('eeCh').style.minHeight = '';
  $('eeN').textContent = c === 'LV' ? t.lvN(E.chk) : t.eeN;
  $('eeSeg').innerHTML = (c === 'LV' ? ['na'] : ['na', 'inv']).map(k => `<button type="button" data-k="${k}" aria-pressed="${k === K}">${t.eeSeg[k]}</button>`).join('');
  const md = m => Math.round(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0) / DAY);
  const ser = (K === 'inv' ? ['II'] : ['II', 'III']).filter(p => E[p]).map((p, i) => ({ provider: p, label: t.pl(p), color: PAL[i], points: E[p].m.map((m, j) => [md(m), E[p][K][j]]).filter(x => x[1] != null) }));
  const xs = ser.flatMap(s => s.points.map(p => p[0]));
  $('eeCh').innerHTML = '';
  drawLineChart($('eeCh'), ser, Math.min(...xs), Math.max(...xs), { zero: true, axisUnit: '', fmt: v => num(v, 0) });
}
/* Edge kortelės „Šalių palyginimo“ viršuje: šalys lyginamos tik panašios rizikos grupėje (kaip lentelė „Panaši rizika“), turtas ir fondų skaičius – faktai. */
const XC = {
  q: { lt: ['Kurios šalies didelės rizikos fondams sekasi geriausiai?', 'Kurios šalies mažos rizikos fondams sekasi geriausiai?', 'Kiek turto II pakopos fonduose kiekvienoje šalyje?', 'Kiek fondų kiekvienoje šalyje?'],
    en: ['In which country do high-risk funds do best?', 'In which country do low-risk funds do best?', 'How much do pillar II funds hold in each country?', 'How many funds does each country have?'],
    lv: ['Kurā valstī augsta riska fondiem veicas vislabāk?', 'Kurā valstī zema riska fondiem veicas vislabāk?', 'Cik aktīvu ir II līmeņa fondos katrā valstī?', 'Cik fondu ir katrā valstī?'],
    et: ['Millise riigi kõrge riskiga fondidel läheb kõige paremini?', 'Millise riigi madala riskiga fondidel läheb kõige paremini?', 'Kui palju vara on II samba fondides igas riigis?', 'Mitu fondi on igas riigis?'] },
  ey: { lt: 'Šalys', en: 'Countries', lv: 'Valstis', et: 'Riigid' },
  med: { lt: 'fondų grąžos mediana', en: 'median fund return', lv: 'fondu ienesīguma mediāna', et: 'fondide tootluse mediaan' },
  nf: { lt: n => `${n} fond.`, en: n => `${n} funds`, lv: n => `${n} fondi`, et: n => `${n} fondi` },
  per: { lt: 'Laikotarpis:', en: 'Period:', lv: 'Periods:', et: 'Periood:' },
  i: { lt: ['Lyginama tik panašios rizikos grupėje: fondai suskirstyti pagal svyravimą (daugiau nei 12 % per metus). Grąža – iš vieneto verčių, jau po mokesčių; mediana – vidurinė grupės fondų reikšmė. Ta pati lentelė – „Panaši rizika“ žemiau.',
      'Mažos rizikos grupė – fondai, kurių svyravimas mažesnis nei 4 % per metus.', 'II pakopos fondų grynieji aktyvai (Latvijoje – iš ketvirčio ataskaitų, jei dienos duomenų nėra).', 'Veikiantys II ir III pakopos fondai mūsų duomenyse.'],
    en: ['Compared only within a similar-risk group: funds are grouped by volatility (over 12% a year). Returns come from unit values, net of fees; median – the middle value of the group’s funds. Same table – “Similar risk” below.',
      'Low-risk group – funds with volatility under 4% a year.', 'Net assets of pillar II funds (in Latvia from quarterly reports when daily data are missing).', 'Active pillar II and III funds in our data.'] },
};
const xcT = k => XC[k][ulang] || XC[k].en;
function xCards(act) {
  const el = $('xCards'); if (!el) return;
  try {
    const t = T(), Q = xcT('q'), I = xcT('i'), ey = xcT('ey'), C = ['LT', 'LV', 'EE'], col = { LT: 'var(--s1)', LV: 'var(--s2)', EE: 'var(--s3)' }, out = [];
    const more = `<span class="lbl">${xcT('per')}</span>` + ['ytd', 'y1', 'y3', 'y5', 'y10'].map(h => `<button type="button" class="btn" data-ecclick='#rkSeg button[data-h="${h}"]' aria-pressed="${h === RKH}">${hEsc(t.hz[h])}</button>`).join('');
    const rk = (r, i, img) => { const xs = C.map(c => { const v = act.filter(f => f.c === c && f.risk === r).map(f => ret(f, RKH)).filter(x => x != null); return v.length ? { c, v: median(v), n: v.length } : null; }).filter(Boolean).sort((a, b) => b.v - a.v);
      if (xs.length < 2) return '';
      return ecCard({ k: 'xc' + i, more, sz: 'w', img, ic: i ? 'scales' : 'trophy', ey, q: Q[i], big: `${hEsc(t.c[xs[0].c])} · ${fmtP(xs[0].v)}`, cls: 'sm', sub: `${hEsc(t.rg[r])} · ${xcT('med')} · ${hEsc(t.hz[RKH])}`, info: I[i], xt: 'rkTbl',
        vis: ecBars(xs.map(x => [`${t.c[x.c]} (${xcT('nf')(x.n)})`, x.v >= 0 ? col[x.c] : 'var(--dneg)', x.v, fmtP(x.v)])) }); };
    out.push(rk('r4', 0, 'sec2-results.jpg'), rk('r1', 1));
    const na = C.map(c => ({ c, v: act.filter(f => f.c === c && f.pl === 'II').reduce((s, f) => s + (f.na || 0), 0) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
    const mn = v => v >= 1000 ? `${num(v / 1000, 2)} ${lang === 'lt' ? 'mlrd. €' : 'bn €'}` : `${num(v, 0)} ${lang === 'lt' ? 'mln. €' : 'm €'}`;
    if (na.length) out.push(ecCard({ k: 'xc2', sz: 'w', ic: 'building-bank', ey, q: Q[2], big: mn(na.reduce((s, x) => s + x.v, 0)), sub: na.map(x => t.c[x.c]).join(' · '), info: I[2],
      vis: ecBars(na.map(x => [t.c[x.c], col[x.c], x.v, mn(x.v)])) }));
    const nf = C.map(c => ({ c, a: act.filter(f => f.c === c && f.pl === 'II').length, b: act.filter(f => f.c === c && f.pl === 'III').length }));
    out.push(ecCard({ k: 'xc3', sz: 'w', ic: 'data-pie', ey, q: Q[3], big: String(nf.reduce((s, x) => s + x.a + x.b, 0)), sub: nf.map(x => `${t.c[x.c]} ${x.a} + ${x.b}`).join(' · ') + ' (II + III)', info: I[3],
      vis: ecBars(nf.map(x => [`${t.c[x.c]} · II`, col[x.c], x.a, String(x.a)]).concat(nf.map(x => [`${t.c[x.c]} · III`, `color-mix(in srgb, ${col[x.c]} 50%, transparent)`, x.b, String(x.b)]))) }));
    el.className = 'hg jg'; el.style.margin = '10px 0 18px'; el.innerHTML = out.join(''); ecFold(el);
  } catch (e) { console.warn(e); el.innerHTML = ''; }
}
function renderX() {
  const t = T(), act = BX.filter(f => !f.closed);
  $('xT').textContent = t.bx.xT; $('xL').textContent = t.bx.xL;
  $('kp').innerHTML = ['LT', 'LV', 'EE'].map(c => countryCard(c, act)).join('');
  xCards(act);
  $('rkT').textContent = t.rkT; $('rkN').textContent = t.rkN; $('rkSeg').innerHTML = hzSeg();
  $('rkTbl').innerHTML = `<thead><tr><th>${t.thRisk}</th>${['LT', 'LV', 'EE'].map(c => `<th class="n">${t.c[c]}</th>`).join('')}</tr></thead><tbody>`
    + ['r1', 'r2', 'r3', 'r4'].map(r => `<tr><td>${rgHtml({ risk: r })} ${hEsc(t.rg[r])}</td>${['LT', 'LV', 'EE'].map(c => {
      const xs = act.filter(f => f.c === c && f.risk === r).map(f => ({ f, v: ret(f, RKH) })).filter(x => x.v != null);
      if (!xs.length) return `<td class="n">${t.none}</td>`;
      const b = xs.reduce((a, x) => x.v > a.v ? x : a);
      return `<td class="n"><b>${fmtP(median(xs.map(x => x.v)))}</b> <small class="note">${t.nF(xs.length)}</small><br><small class="note">${hEsc(b.f.n)} ${fmtP(b.v)}</small></td>`;
    }).join('')}</tr>`).join('') + '</tbody>';
}
['rkSeg', 'ldSeg'].forEach(id => $(id).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; RKH = b.dataset.h; renderOv(); renderX(); }));
$('eeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; EEK = b.dataset.k; renderOv(); });

/* ---------- Pasirinkti palyginimui fondai – atskirai kiekvienai šaliai ir šalių palyginimui ---------- */
let SELM = {};
try { SELM = JSON.parse(localStorage.getItem('bxSelM') || '{}') || {}; } catch (e) {}
const saveF = () => { try { localStorage.setItem('bxSelM', JSON.stringify(SELM)); } catch (e) {} };
function defaults(m) {                          // šalis – 3 didžiausi didelės rizikos II pakopos fondai; palyginimas – po didžiausią kiekvienos šalies
  const top = c => BX.filter(f => f.c === c && f.pl === 'II' && !f.closed && f.risk === 'r4').sort((a, b) => (b.na || 0) - (a.na || 0) || a.first - b.first);
  return (m === 'X' ? ['LT', 'LV', 'EE'].map(c => top(c)[0]) : top(m).slice(0, 3)).filter(Boolean).map(f => f.id);
}
const selOf = () => { const m = 'X'; if (!Array.isArray(SELM[m])) SELM[m] = defaults(m); return SELM[m]; };
const setSel = a => { SELM.X = a.slice(-10); saveF(); };
function toggleSel(id, on) { const s = selOf(); setSel(on ? (s.includes(id) ? s : [...s, id]) : s.filter(x => x !== id)); renderCmp(); }

/* ---------- Fondų palyginimas ---------- */
let CH = 'y5';
function renderCmp() {
  const t = T(), X = true, SEL = selOf(), fs = SEL.map(id => BX.find(f => f.id === id)).filter(Boolean);
  $('cmT').textContent = X ? t.cmT : t.bx.tabs.cmp; $('cmL').textContent = X ? t.cmL : t.bx.cmL(t.c[CR.c]);
  $('cmBar').innerHTML = `<div class="seg" role="group">${['y1', 'y3', 'y5', 'y10', 'max'].map(h => `<button type="button" data-h="${h}" aria-pressed="${h === CH}">${t.hz[h]}</button>`).join('')}</div>`
    + `<input type="search" id="cmQ" list="cmList" placeholder="${hEsc(t.cmAdd)}"><datalist id="cmList">${BX.filter(f => !SEL.includes(f.id) && (X || f.c === CR.c)).map(f => `<option value="${hEsc(`${f.c} · ${f.pl} · ${f.n}`)}">`).join('')}</datalist>`
    + `<button type="button" class="btn" id="cmDef">${t.cmDef}</button><button type="button" class="btn" id="cmClr">${t.cmClear}</button>`;
  $('cmSel').innerHTML = fs.map((f, i) => `<button type="button" class="chip" data-rm="${f.id}"><i style="background:${PAL[i % PAL.length]}"></i><span class="flag">${f.c}</span> ${hEsc(f.n)} <span class="x">×</span></button>`).join('');
  $('cmQ').addEventListener('change', e => { const v = e.target.value, f = BX.find(x => `${x.c} · ${x.pl} · ${x.n}` === v); if (f) toggleSel(f.id, true); });
  $('cmTopS').hidden = !X;
  if (!fs.length) { $('cmCh').innerHTML = `<p class="note">${t.cmNone}</p>`; $('cmTbl').innerHTML = ''; $('cmN').textContent = ''; $('cmTopG').innerHTML = ''; return; }
  const x1 = Math.max(...fs.map(f => f.last)), minStart = Math.max(...fs.map(f => f.first));
  const x0 = CH === 'max' ? minStart : Math.max(minStart, x1 - Math.round(365.25 * +CH.slice(1)));
  const ser = fs.map((f, i) => { const s = at(f, x0) || { d: f.first, v: f.V[0] }; const pts = [[x0, 0]];
    f.D.forEach((d, j) => { if (d > x0 && d <= x1) pts.push([d, (f.V[j] / s.v - 1) * 100]); });
    return { provider: f.id, label: `${f.c} ${f.n}`, color: PAL[i % PAL.length], points: pts }; });
  $('cmCh').innerHTML = '';
  drawLineChart($('cmCh'), ser, x0, x1, {});
  $('cmTbl').innerHTML = `<thead><tr>${['n', 'r', 'a', 'vol', 'fee', 'risk'].map(k => `<th${k === 'n' || k === 'risk' ? '' : ' class="n"'}>${t.cmCols[k]}</th>`).join('')}</tr></thead><tbody>`
    + fs.map((f, i) => { const s = at(f, x0) || { d: f.first, v: f.V[0] }, e = at(f, x1) || { d: f.last, v: f.V[f.V.length - 1] }, tot = (e.v / s.v - 1) * 100, yrs = (e.d - s.d) / 365.25, ann = yrs >= 1 ? (Math.pow(e.v / s.v, 1 / yrs) - 1) * 100 : null;
      return `<tr><td class="nm"><i class="sw" style="background:${PAL[i % PAL.length]};display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px"></i><span class="flag">${f.c}</span> ${hEsc(f.n)} <small class="note">${f.pl} · ${hEsc(f.m)}</small></td><td class="n ${sgn(tot)}">${fmtP(tot)}</td><td class="n ${sgn(ann)}">${fmtP(ann)}</td><td class="n">${f.vol == null ? t.none : pctPlain(f.vol)}</td><td class="n">${f.fee == null ? t.none : pctPlain(f.fee)}</td><td>${rgHtml(f)}</td></tr>`; }).join('') + '</tbody>';
  $('cmN').textContent = t.cmFrom(iso(x0), iso(x1));
  if (X) { $('cmTopT').textContent = t.bx.cmTop; $('cmTopL').textContent = t.topL; const xs = fs.filter(f => f.top && f.top.length); $('cmTopG').innerHTML = xs.length ? topCards(xs) : `<p class="note">${t.topNone}</p>`; }
}
function topCards(fs) {                                // 10 didžiausių investicijų kortelės (LV II pakopa – ketvirčio ataskaitos, EE – mėnesio ataskaitos)
  const t = T();
  return fs.map(f => `<div class="topc"><h3><span class="flag">${f.c}</span> ${hEsc(f.n)}</h3><p class="note">${t.topQ(f.topQ)} · ${hEsc(f.m)}</p>`
    + `<table class="bt"><tbody>${f.top.map((h, i) => `<tr><td class="n">${i + 1}.</td><td class="nm">${hEsc(h[0])}</td><td class="n">${num(h[1], Math.abs(h[1] * 10 - Math.round(h[1] * 10)) < 1e-9 ? 1 : 2)}${pctSfx()}</td></tr>`).join('')}</tbody></table></div>`).join('');
}
function renderTop() {
  const t = T(), b = t.bx, c = CR.c; if (c === 'X') return;
  $('topT').textContent = b.topT(t.c[c]);
  if (c === 'LT') { $('topL').innerHTML = b.topLt; $('topG').innerHTML = ''; return; }
  $('topL').textContent = b.topL[c];
  const fs = crGroups().flatMap(g => g.fs.slice().sort((x, y) => (y.na || 0) - (x.na || 0))).filter(f => f.top && f.top.length);
  $('topG').innerHTML = fs.length ? topCards(fs) : `<p class="note">${t.topNone}</p>`;
}
$('cmBar').addEventListener('click', e => {
  const b = e.target.closest('[data-h]'); if (b) { CH = b.dataset.h; renderCmp(); return; }
  if (e.target.closest('#cmDef')) { setSel(defaults('X')); renderCmp(); }
  if (e.target.closest('#cmClr')) { setSel([]); renderCmp(); }
});
$('cmSel').addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (!b) return; toggleSel(b.dataset.rm, false); });

/* ---------- Metų grąžos: heatmap (savininkas 2026-10-21 pritarė „Baltijos fondų grąžų heatmap“). Viena eilutė – vienas fondas,
   stulpelis – kalendoriniai metai. Rodoma tik viena peer grupė vienu metu: rizikos grupė (visos šalys) arba šalies grupė. ---------- */
addStrings({ hm: { t: 'Calendar-year returns', l: 'Each row is a fund, each column a calendar year. Funds of similar risk from all three countries, one risk group at a time. The colour shows the return, or the fund’s place in that year among the funds shown. Click a year to sort.',
  ret: 'Return', rk: 'Place in group', ytd: y => `${y}*`, med: c => `Median – ${c}`, n: (n, d) => `${n} funds. * – year to date (${d}). Return from the last value of the previous year to the last value of the year; years in which a fund did not exist for the whole year are empty. Place: 1 = best return that year among the funds shown.`,
  none: 'No funds in this group.', fund: 'Fund', xl: 'Calendar-year returns', xlN: 'Return = year-end value ÷ previous year-end value − 1 (formulas). Year-end value – last known value on or before 31 December.' } },
{ hm: { t: 'Kalendorinių metų grąžos', l: 'Viena eilutė – vienas fondas, stulpelis – kalendoriniai metai. Panašios rizikos visų trijų šalių fondai, po vieną rizikos grupę. Spalva rodo grąžą arba fondo vietą tais metais tarp rodomų fondų. Spauskite metus, kad surikiuotumėte.',
  ret: 'Grąža', rk: 'Vieta grupėje', ytd: y => `${y}*`, med: c => `Mediana – ${c}`, n: (n, d) => `${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}. * – nuo metų pradžios (iki ${d}). Grąža – nuo paskutinės praėjusių metų vertės iki paskutinės metų vertės; metai, kuriais fondas veikė ne visus metus, tušti. Vieta: 1 = geriausia tų metų grąža tarp rodomų fondų.`,
  none: 'Šioje grupėje fondų nėra.', fund: 'Fondas', xl: 'Metų grąžos', xlN: 'Grąža = metų pabaigos vertė ÷ praėjusių metų pabaigos vertė − 1 (formulės). Metų pabaigos vertė – paskutinė žinoma vertė gruodžio 31 d. ar anksčiau.' } });
const HM = { c: { LT: true, LV: true, EE: true }, pl: 'II', g: 'r4', m: 'ret', s: null, closed: false };
try { Object.assign(HM, JSON.parse(localStorage.getItem('bxH') || '{}')); } catch (e) {}
const yEnd = y => Math.round(Date.UTC(y, 11, 31) / DAY);
const CY = new Date(TOP * DAY).getUTCFullYear();
function yRet(f, y) {                                   // kalendorinių metų grąža %, tik jei fondas veikė visus metus
  const s = at(f, yEnd(y - 1)), e = y === CY ? at(f, f.last) : at(f, yEnd(y));
  return s && e && e.d > s.d ? (e.v / s.v - 1) * 100 : null;
}
function hmData() {
  const fs = BX.filter(f => HM.c[f.c] && (HM.pl === 'all' || f.pl === HM.pl) && (HM.closed || !f.closed)
    && (HM.g[0] === 'r' ? f.risk === HM.g : `${f.c}:${f.cg}` === HM.g));
  const R = fs.map(f => { const r = {}; for (let y = 2003; y <= CY; y++) { const v = yRet(f, y); if (v != null) r[y] = v; } return { f, r }; });
  const ys = []; for (let y = 2003; y <= CY; y++) if (R.some(x => x.r[y] != null)) ys.push(y);
  const rk = {}; ys.forEach(y => { const v = R.filter(x => x.r[y] != null).sort((a, b) => b.r[y] - a.r[y]); v.forEach((x, i) => { (x.k = x.k || {})[y] = [i + 1, v.length]; }); });
  return { R, ys };
}
function hmColor(v, k) {
  if (HM.m === 'rk') { if (!k) return ''; const p = k[1] > 1 ? (k[0] - 1) / (k[1] - 1) : 0.5, a = Math.round(Math.abs(p - 0.5) * 2 * 60); return `color-mix(in srgb, var(${p < 0.5 ? '--dpos' : '--dneg'}) ${a}%, transparent)`; }
  const a = Math.round(Math.min(Math.abs(v) / 25, 1) * 62 + 6); return `color-mix(in srgb, var(${v < 0 ? '--dneg' : '--dpos'}) ${a}%, transparent)`;
}
function renderHm() {
  const t = T(), h = t.hm;
  $('hmT').textContent = h.t; $('hmL').textContent = h.l;
  if (HM.g[0] !== 'r') HM.g = 'r4';                     // šalių palyginime – tik rizikos grupės (šalies grupės – šalies „Metai ir mėnesiai“)
  $('hmBar').innerHTML = `<div class="chips">${['LT', 'LV', 'EE'].map(c => `<button type="button" class="chip" data-c="${c}" aria-pressed="${HM.c[c]}"><span class="flag">${c}</span>${t.c[c]}</button>`).join('')}</div>`
    + `<div class="seg" role="group">${['II', 'III', 'all'].map(p => `<button type="button" data-pl="${p}" aria-pressed="${HM.pl === p}">${p === 'all' ? t.both : t.pl(p)}</button>`).join('')}</div>`
    + `<select id="hmG">${['r1', 'r2', 'r3', 'r4'].map(r => `<option value="${r}"${HM.g === r ? ' selected' : ''}>${hEsc(t.rg[r])}</option>`).join('')}</select>`
    + `<div class="seg" role="group">${['ret', 'rk'].map(m => `<button type="button" data-m="${m}" aria-pressed="${HM.m === m}">${h[m]}</button>`).join('')}</div>`
    + `<label class="field"><input type="checkbox" id="hmC"${HM.closed ? ' checked' : ''}> ${t.fClosed}</label>`;
  const { R, ys } = hmData();
  if (!R.length) { $('hmTbl').innerHTML = ''; $('hmN').textContent = h.none; return; }
  const sy = ys.includes(HM.s) ? HM.s : ys.filter(y => y < CY).pop() || ys[ys.length - 1];
  R.sort((a, b) => (b.r[sy] ?? -1e9) - (a.r[sy] ?? -1e9) || a.f.n.localeCompare(b.f.n));
  const cell = (v, k) => v == null ? '<td></td>' : `<td class="n" style="background:${hmColor(v, k)}" title="${hEsc(fmtP(v))}${k ? ` · ${k[0]}/${k[1]}` : ''}">${HM.m === 'rk' && k ? k[0] : num(v, Math.abs(v) < 10 ? 1 : 0)}</td>`;
  const cs = ['LT', 'LV', 'EE'].filter(c => R.some(x => x.f.c === c));
  $('hmTbl').innerHTML = `<thead><tr><th>${h.fund}</th>${ys.map(y => `<th class="n" data-y="${y}"${y === sy ? ' aria-sort="descending"' : ''}>${y === CY ? h.ytd(y) : y}</th>`).join('')}</tr></thead><tbody>`
    + R.map(x => `<tr><td class="nm"><span class="flag">${x.f.c}</span> ${hEsc(x.f.n)} <small class="note">${x.f.pl} · ${hEsc(x.f.m)}</small></td>${ys.map(y => cell(x.r[y], x.k && x.k[y])).join('')}</tr>`).join('')
    + (HM.m === 'ret' ? cs.map(c => `<tr class="med"><td class="nm">${h.med(t.c[c])}</td>${ys.map(y => { const v = median(R.filter(x => x.f.c === c && x.r[y] != null).map(x => x.r[y])); return cell(v); }).join('')}</tr>`).join('') : '') + '</tbody>';
  $('hmN').textContent = h.n(R.length, iso(TOP));
  const w = $('hmTbl').parentElement; w.scrollLeft = w.scrollWidth;           // naujausi metai matomi iš karto (ypač telefone)
}
const saveH = () => { try { localStorage.setItem('bxH', JSON.stringify(HM)); } catch (e) {} };
$('hmBar').addEventListener('click', e => {
  const c = e.target.closest('[data-c]'), p = e.target.closest('[data-pl]'), m = e.target.closest('[data-m]');
  if (c) { HM.c[c.dataset.c] = !HM.c[c.dataset.c]; if (!Object.values(HM.c).some(Boolean)) HM.c[c.dataset.c] = true; }
  else if (p) HM.pl = p.dataset.pl; else if (m) HM.m = m.dataset.m; else return;
  saveH(); renderHm();
});
$('hmBar').addEventListener('change', e => { if (e.target.id === 'hmG') HM.g = e.target.value; else if (e.target.id === 'hmC') HM.closed = e.target.checked; else return; saveH(); renderHm(); });
$('hmTbl').addEventListener('click', e => { const th = e.target.closest('th[data-y]'); if (th) { HM.s = +th.dataset.y; saveH(); renderHm(); } });
function hmSheet(wb) {                                  // Excel: metų pabaigos vertės ir grąžos – formulės
  const t = T(), h = t.hm, { R, ys } = hmData(); if (!R.length) return;
  const col = i => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = (i - m - 1) / 26; } return s; };
  const ends = [ys[0] - 1, ...ys], nv = ends.length, v0 = 4, r0 = v0 + nv;
  const rows = [[{ v: `${h.xl}: ${HM.g[0] === 'r' ? t.rg[HM.g] : cgLabel(BX.find(f => `${f.c}:${f.cg}` === HM.g))}`, s: 'title' }], [{ v: h.xlN, s: 'note' }], [],
    [...t.xlH.slice(0, 2), t.xlH[3], t.xlH[2], ...ends.map(y => ({ v: y === CY ? iso(TOP) : `${y}-12-31`, s: 'hdr' })), ...ys.map(y => ({ v: y === CY ? h.ytd(y) : String(y), s: 'hdr' }))].map(x => typeof x === 'string' ? { v: x, s: 'hdr' } : x)];
  R.forEach((x, i) => { const n = i + 5, f = x.f;
    const vals = ends.map(y => { const p = y === CY ? at(f, f.last) : at(f, yEnd(y)); return p && p.d >= f.first ? p : null; });
    rows.push([t.c[f.c], f.pl, f.n, f.m, ...vals.map(p => p ? { v: p.v, z: '0.00000', s: 'in' } : null),
      ...ys.map((y, j) => x.r[y] == null ? null : { f: `${col(v0 + j + 1)}${n}/${col(v0 + j)}${n}-1`, z: '0.00%', s: 'calc', v: x.r[y] / 100 })]); });
  XL.sheet(wb, h.xl, rows, { cols: [10, 7, 44, 14, ...ends.map(() => 11), ...ys.map(() => 8)], freeze: { r: 4, c: 3 } });
}

/* ---------- Šalies rezultatai: „Visa rinka“ ir „Rizika“ – tie patys vaizdai kaip Lietuvos „Rezultatų“ puslapyje, bet bet kuriai šaliai
   (auditas 2026-10-21, savininkas: „bekurią šalį atsidarius, būtų galima pasilyginti tuos pačius rodiklius“). Fondai lyginami tik
   savo šalies grupėje (LT – gimimo metai, LV – akcijų dalis, EE ir LT III pakopa – rizikos grupė); spalva – vieta grupėje stulpelyje. ---------- */
addStrings({ cr: {
  mkT: c => `${c}: return and place in group`, mkL: 'The same view for every country: funds by their country group, returns over several periods. The colour shows the fund’s place in its group in that column (green – best, red – worst). Click a column to sort.',
  rsT: c => `${c}: risk`, rsL: 'Volatility, largest fall, return per unit of risk and the worst calendar year of each fund, compared within its group. Colour – place in group (green – better).',
  per: { m1: '1 month', m3: '3 months', ytd: 'Year to date', y1: '1 year', y3: '3 years*', y5: '5 years*', y10: '10 years*' },
  fund: 'Fund', med: 'Group median', n: n => `${n} funds`,
  rs: { vol: 'Volatility 3 y', dd3: 'Largest fall 3 y', ddA: 'Largest fall, all history', sh: 'Sharpe 3 y', wy: 'Worst year' },
  mkN: (d, lv) => `* annual return. Returns are unit value changes (fees already deducted) up to ${d}.${lv ? ' Latvian values are chart points every 9–13 days, so a period may start or end a few days off.' : ''} Lithuanian history here starts in 2018–2019; longer results – on the Results page.`,
  rsN: r => `Volatility – 3-year annual standard deviation of weekly value changes. Largest fall – the deepest drop from a previous peak (3 years and whole history). Sharpe = (3-year annual return − average €STR, ${pctPlain(r)}) ÷ volatility. Worst year – lowest full calendar-year return. Colour – only for the 3-year fall and Sharpe (the other figures depend on how long the fund has existed).`,
  rv: { nom: 'Nominal', real: 'Real (after inflation)' }, rvN: m => `Real return = (1 + return) ÷ (1 + inflation) − 1; inflation – the country’s HICP (Eurostat), last month ${m} (used for later days too).`,
  none: 'No funds.' } }, { cr: {
  mkT: c => `${c}: grąža ir vieta grupėje`, mkL: 'Tas pats vaizdas kiekvienai šaliai: fondai pagal jų šalies grupes, grąža keliais laikotarpiais. Spalva rodo fondo vietą jo grupėje tame stulpelyje (žalia – geriausia, raudona – prasčiausia). Spauskite stulpelį, kad surikiuotumėte.',
  rsT: c => `${c}: rizika`, rsL: 'Kiekvieno fondo svyravimas, didžiausias kritimas, grąža rizikos vienetui ir blogiausi kalendoriniai metai – lyginama jo grupėje. Spalva – vieta grupėje (žalia – geriau).',
  per: { m1: '1 mėn.', m3: '3 mėn.', ytd: 'Nuo metų pradžios', y1: '1 metai', y3: '3 metai*', y5: '5 metai*', y10: '10 metų*' },
  fund: 'Fondas', med: 'Grupės mediana', n: n => `${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}`,
  rs: { vol: 'Svyravimas 3 m.', dd3: 'Didžiausias kritimas 3 m.', ddA: 'Didžiausias kritimas, visa istorija', sh: 'Sharpe 3 m.', wy: 'Blogiausi metai' },
  mkN: (d, lv) => `* metinė grąža. Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti) iki ${d}.${lv ? ' Latvijos vertės – grafiko taškai kas 9–13 dienų, todėl laikotarpis gali prasidėti ar baigtis keliomis dienomis kitaip.' : ''} Lietuvos istorija čia – nuo 2018–2019 m.; ilgesni rezultatai – puslapyje „Rezultatai“.`,
  rsN: r => `Svyravimas – 3 metų metinis savaitės vertės pokyčių standartinis nuokrypis. Didžiausias kritimas – giliausias nuosmukis nuo ankstesnės aukščiausios vertės (per 3 metus ir per visą istoriją). Sharpe = (3 metų metinė grąža − vidutinė €STR, ${pctPlain(r)}) ÷ svyravimas. Blogiausi metai – mažiausia viso kalendorinių metų grąža. Spalva – tik 3 metų kritimui ir Sharpe (kiti rodikliai priklauso nuo to, kiek laiko fondas veikia).`,
  rv: { nom: 'Nominali', real: 'Reali (po infliacijos)' }, rvN: m => `Reali grąža = (1 + grąža) ÷ (1 + infliacija) − 1; infliacija – tos šalies SVKI (Eurostat), paskutinis mėnuo ${m} (vėlesnėms dienoms naudojamas jis).`,
  none: 'Fondų nėra.' } });
const CR = { c: 'LT', pl: 'II', s: 'ytd', rs: 'sh', real: false, v: 'ret', ds: 'na', closed: false };
let HL = null;                                          // paieškos nuoroda (#bq=) – paryškinamas fondas
try { Object.assign(CR, JSON.parse(localStorage.getItem('bxC') || '{}')); } catch (e) {}
const saveC = () => { try { localStorage.setItem('bxC', JSON.stringify(CR)); } catch (e) {} };
const CRP = ['m1', 'm3', 'ytd', 'y1', 'y3', 'y5', 'y10'];
function rP(f, h) {                                     // grąža %: mėnesiai ir metai iki 1 – bendra, ilgesni – metinė (kaip ret)
  if (h[0] !== 'm') return ret(f, h);
  const e = at(f, f.last); if (!e) return null;
  const s = at(f, e.d - Math.round(30.44 * +h.slice(1))); if (!s || s.d >= e.d) return null;
  return (e.v / s.v - 1) * 100;
}
/* Reali grąža (auditas 2026-10-21): vieneto vertės pokytis, atėmus tos šalies infliaciją (Eurostat SVKI, BALTIC.cpi). Mėnesio indeksas –
   mėnesio vidurkis, todėl naudojamas datos mėnuo; vėlesnėms nei paskutinis paskelbtas mėnuo dienoms – paskutinis žinomas. */
const CPI = BALTIC.cpi || null;
function cpiAt(c, d) {
  const C = CPI && CPI[c]; if (!C) return null;
  const [y0, m0] = C.s.split('-').map(Number), dt = new Date(d * DAY), i = (dt.getUTCFullYear() - y0) * 12 + dt.getUTCMonth() - (m0 - 1);
  if (i < 0) return null;
  for (let k = Math.min(i, C.v.length - 1); k >= 0; k--) if (C.v[k] != null) return C.v[k];
  return null;
}
const cpiLast = c => { const C = CPI && CPI[c]; if (!C) return null; const [y0, m0] = C.s.split('-').map(Number), n = C.v.length - 1, m = m0 - 1 + n; return `${y0 + Math.floor(m / 12)}-${String(m % 12 + 1).padStart(2, '0')}`; };
function rReal(f, h) {
  const e = at(f, f.last); if (!e) return null;
  const sd = h[0] === 'm' ? e.d - Math.round(30.44 * +h.slice(1)) : h === 'ytd' ? ytdStart(e.d) : e.d - Math.round(365.25 * +h.slice(1));
  const s = at(f, sd); if (!s || s.d >= e.d) return null;
  const a = cpiAt(f.c, s.d), b = cpiAt(f.c, e.d); if (!a || !b) return null;
  const tot = (e.v / s.v) / (b / a), yrs = (e.d - s.d) / 365.25;
  return (h[0] === 'y' && h !== 'y1' && yrs >= 1 ? Math.pow(tot, 1 / yrs) - 1 : tot - 1) * 100;
}
const gKey = f => f.cg || f.risk || 'zz';
function gOrder(k) { return k === 'turto' ? '0' : k[0] === 'b' ? '1' + k : k[0] === 'e' ? '2' + k.slice(1).padStart(3, '0') : k[0] === 'r' ? '3' + k : '9'; }
function gName(k, f) { const t = T(); return k === 'zz' ? t.rgNone : k[0] === 'r' && !f.cg ? t.rg[k] : cgLabel(f); }
function crGroups(closed) {                             // [{k, name, fs:[f]}] pasirinktos šalies ir pakopos fondai (uždaryti – tik „Fondo duomenyse“)
  const fs = BX.filter(f => f.c === CR.c && f.pl === CR.pl && (closed || !f.closed)), m = new Map();
  fs.forEach(f => { const k = gKey(f); if (!m.has(k)) m.set(k, []); m.get(k).push(f); });
  return [...m.entries()].sort((a, b) => gOrder(a[0]).localeCompare(gOrder(b[0]))).map(([k, fs]) => ({ k, name: gName(k, fs[0]), fs }));
}
function rkColor(p, n) {                                // vieta grupėje → spalva (kaip Lietuvos lentelėse: žalia – geriausia)
  if (!(n > 1) || p == null) return '';
  const x = (p - 1) / (n - 1), a = Math.round(Math.abs(x - 0.5) * 2 * 55) + 8;
  return `color-mix(in srgb, var(${x < 0.5 ? '--dpos' : '--dneg'}) ${a}%, transparent)`;
}
function ranks(vals, hi) {                              // vals: [v|null] → vietos (1 = geriausia), hi – didesnė geriau
  const ix = vals.map((v, i) => [v, i]).filter(x => x[0] != null).sort((a, b) => hi ? b[0] - a[0] : a[0] - b[0]), r = vals.map(() => null);
  ix.forEach((x, j) => { r[x[1]] = j + 1; }); return [r, ix.length];
}
function crBar(id) {
  const t = T(), v = id === 'crBar' ? CR.v || 'ret' : 'ret';
  $(id).innerHTML = (id === 'crBar' ? `<div class="seg" role="group">${['ret', 'dat'].map(k => `<button type="button" data-cv="${k}" aria-pressed="${k === v}">${t.bx.view[k]}</button>`).join('')}</div>` : '')
    + (id === 'crBar' && v === 'ret' && CPI ? `<div class="seg" role="group">${['nom', 'real'].map(k => `<button type="button" data-cr="${k}" aria-pressed="${(k === 'real') === !!CR.real}">${t.cr.rv[k]}</button>`).join('')}</div>` : '')
    + (id === 'crBar' && v === 'dat' ? `<label class="field"><input type="checkbox" id="crC"${CR.closed ? ' checked' : ''}> ${t.bx.fClosed}</label>` : '');
}
function crTable(el, G, cols, val, hi, fmt, sortK) {    // bendra lentelė: grupės antraštė, fondai su spalva pagal vietą, mediana
  const t = T(), c = t.cr;
  let h = `<thead><tr><th>${c.fund}</th>${cols.map(k => `<th class="n" data-s="${k}"${sortK === k ? ' aria-sort="descending"' : ''}>${c.per[k] || c.rs[k] || t.cols[k] || k}</th>`).join('')}</tr></thead><tbody>`;
  G.forEach(g => {
    const V = g.fs.map(f => cols.map(k => val(f, k)));
    const R = cols.map((k, j) => hi[k] == null ? [[], 0] : ranks(V.map(v => v[j] == null ? null : (typeof v[j] === 'object' ? v[j].v : v[j])), hi[k]));
    const si = cols.indexOf(sortK), order = g.fs.map((f, i) => i).sort((a, b) => { const x = V[a][si], y = V[b][si], xv = x && typeof x === 'object' ? x.v : x, yv = y && typeof y === 'object' ? y.v : y; if (xv == null) return 1; if (yv == null) return -1; return hi[sortK] === false ? xv - yv : yv - xv; });
    h += `<tr class="gh"><td colspan="${cols.length + 1}">${hEsc(g.name)} <small class="note">${c.n(g.fs.length)}</small></td></tr>`;
    h += order.map(i => { const f = g.fs[i];
      return `<tr${f.id === HL ? ' class="hl" id="hlRow"' : ''}><td class="nm">${hEsc(f.n)} <small class="note">${hEsc(f.m)}${f.closed ? ` · ${t.bx.closed}` : ''}</small></td>${cols.map((k, j) => { const v = V[i][j], p = R[j][0][i];
        return `<td class="n" style="background:${rkColor(p, R[j][1])}"${p ? ` title="${p}/${R[j][1]}"` : ''}>${fmt(v, k)}</td>`; }).join('')}</tr>`; }).join('');
    if (g.fs.length > 2) h += `<tr class="med"><td class="nm">${c.med}</td>${cols.map((k, j) => { const xs = V.map(v => v[j]).filter(v => v != null).map(v => typeof v === 'object' ? v.v : v); return `<td class="n">${xs.length ? fmt(median(xs), k) : ''}</td>`; }).join('')}</tr>`;
  });
  el.innerHTML = h + '</tbody>';
}
function renderCr() {
  const t = T(), c = t.cr; if (CR.c === 'X') return;
  const G = crGroups(), V = CR.v || 'ret';
  crBar('crBar'); crBar('rsBar');
  $('crT').textContent = c.mkT(t.c[CR.c]); $('crL').textContent = t.bx.crL;
  $('rsT').textContent = c.rsT(t.c[CR.c]); $('rsL').textContent = c.rsL;
  if (!G.length) { $('crTbl').innerHTML = ''; $('rsTbl').innerHTML = ''; $('crN').textContent = c.none; $('rsN').textContent = c.none; return; }
  if (V === 'dat') {                                   // fondo duomenys (buvęs skirtukas „Visi fondai“): rizika, mokestis, akcijos, turtas, dalyviai
    const GD = crGroups(CR.closed), cols = ['risk', 'vol', 'fee', 'eq', 'na', 'inv', 'last'].filter(k => k === 'risk' || GD.some(g => g.fs.some(f => f[k] != null)));
    if (!cols.includes(CR.ds)) CR.ds = cols.includes('na') ? 'na' : 'vol';
    const val = (f, k) => k === 'risk' ? (f.vol == null ? null : { v: f.vol, h: rgHtml(f) }) : f[k];
    crTable($('crTbl'), GD, cols, val, { fee: false }, (v, k) => v == null ? '' : k === 'risk' ? v.h : k === 'na' ? num(v, 1) : k === 'inv' ? num(v, 0) : k === 'eq' ? num(v, 0) + pctSfx() : k === 'last' ? iso(v) : pctPlain(v), CR.ds);
    $('crN').textContent = t.fN(GD.reduce((s, g) => s + g.fs.length, 0));
  } else {
    const cols = CRP.filter(h => G.some(g => g.fs.some(f => rP(f, h) != null)));
    if (!cols.includes(CR.s)) CR.s = cols.includes('ytd') ? 'ytd' : cols[0];
    const hiP = Object.fromEntries(cols.map(k => [k, true]));
    crTable($('crTbl'), G, cols, CR.real && CPI ? rReal : rP, hiP, v => v == null ? '' : pctPlain(v), CR.s);
    $('crN').textContent = c.mkN(iso(Math.max(...G.flatMap(g => g.fs.map(f => f.last)))), CR.c === 'LV') + (CR.real && CPI ? ' ' + c.rvN(cpiLast(CR.c)) : '');
  }
  const rf = bxRf(TOP - 1096, TOP);
  const R = new Map(G.flatMap(g => g.fs).map(f => [f.id, riskOf(f, rf)]));
  const rc = ['vol', 'dd3', 'ddA', 'sh', 'wy'], hiR = { vol: null, dd3: true, ddA: null, sh: true, wy: null };   // istorijos ilgio priklausantys rodikliai nespalvinami (nesąžininga lyginti)
  if (!['dd3', 'sh'].includes(CR.rs)) CR.rs = 'sh';
  crTable($('rsTbl'), G, rc, (f, k) => R.get(f.id)[k], hiR, (v, k) => v == null ? '' : k === 'sh' ? num(v, 2) : k === 'wy' && typeof v === 'object' ? `${pctPlain(v.v)} <small class="note">${v.y}</small>` : pctPlain(v), CR.rs);
  $('rsN').textContent = c.rsN(rf);
  if (HL && $('hlRow') && TAB_CUR === 'cr') { const r = $('hlRow'); HL = null; setTimeout(() => r.scrollIntoView({ block: 'center' }), 80); }
}
function maxDD(f, from) {                               // didžiausias kritimas % nuo ankstesnės aukščiausios vertės (≤ 0)
  let pk = -Infinity, dd = 0, any = false;
  for (let i = 0; i < f.D.length; i++) { if (f.D[i] < from) continue; const v = f.V[i]; any = true; if (v > pk) pk = v; else dd = Math.min(dd, v / pk - 1); }
  return any ? dd * 100 : null;
}
function riskOf(f, rf) {
  const y3 = ret(f, 'y3'), cov = f.first <= f.last - 1090;
  let wy = null; for (let y = 2003; y < CY; y++) { const v = yRet(f, y); if (v != null && (!wy || v < wy.v)) wy = { v, y }; }
  return { vol: f.vol, dd3: cov ? maxDD(f, f.last - 1096) : null, ddA: maxDD(f, f.first), sh: y3 != null && f.vol ? (y3 - rf) / f.vol : null, wy };
}
function bxRf(a, b) {                                   // vidutinė €STR (kaip perf.js rfAvg): DATA.rfm mėnesių vidurkiai, svertiniai dienomis
  const H = typeof DATA !== 'undefined' && DATA.rfm; let s = 0, n = 0;
  if (H && H.v) { const [y0, m0] = H.start.split('-').map(Number), da = new Date(a * DAY); let y = da.getUTCFullYear(), m = da.getUTCMonth();
    for (let k = 0; k < 1000; k++) { const ms = Date.UTC(y, m, 1) / DAY, me = Date.UTC(y, m + 1, 1) / DAY; if (ms >= b) break;
      const ov = Math.min(b, me) - Math.max(a, ms), v = H.v[(y - y0) * 12 + m - (m0 - 1)]; if (ov > 0 && v != null) { s += v * ov; n += ov; } m++; if (m > 11) { m = 0; y++; } } }
  return n >= (b - a) / 2 ? s / n : typeof DATA !== 'undefined' && DATA.rf ? DATA.rf.value : 2;
}
$('crBar').addEventListener('click', e => { const v = e.target.closest('[data-cv]'), r = e.target.closest('[data-cr]'); if (v) CR.v = v.dataset.cv; else if (r) CR.real = r.dataset.cr === 'real'; else return; saveC(); renderCr(); });
$('crBar').addEventListener('change', e => { if (e.target.id === 'crC') { CR.closed = e.target.checked; saveC(); renderCr(); } });
$('crTbl').addEventListener('click', e => { const th = e.target.closest('th[data-s]'); if (!th) return; if ((CR.v || 'ret') === 'dat') CR.ds = th.dataset.s; else CR.s = th.dataset.s; saveC(); renderCr(); });
$('rsTbl').addEventListener('click', e => { const th = e.target.closest('th[data-s]'); if (th && ['dd3', 'sh'].includes(th.dataset.s)) { CR.rs = th.dataset.s; saveC(); renderCr(); } });

/* ---------- Valdytojai (kaip Lietuvos „Valdytojai“): turtas ir rinkos dalis, dalyviai, fondų skaičius, turtu svertinė grąža,
   kiek fondų geresnėje savo grupės pusėje ir kuo valdytojas gali pasigirti (geriausias fondas grupėje). Lyginama tik šalies viduje. ---------- */
addStrings({ mg: {
  t: c => `${c}: managers`, l: 'Managers of the selected country and pillar: size, market share and how their funds do compared with other funds of the same group.',
  h: { m: 'Manager', n: 'Funds', na: 'Assets, € m', sh: 'Market share', inv: 'Participants', wr: 'Return (asset-weighted)', top: 'Funds in the better half of their group', fee: 'Average fee' },
  shT: 'Market share by assets', brT: 'What each manager can be proud of', brNone: 'No fund is the best in its group in these periods.',
  br: (g, f, h, v, n) => `Best in “${g}” over ${h}: ${f} (${v}, ${n} funds in the group).`,
  n: (d, lv) => `Assets – latest known (${lv ? 'Latvia – manapensija.lv daily data' : 'daily data'}${d ? `, ${d}` : ''}). Asset-weighted return – average of the manager’s fund returns weighted by assets. Better half – the fund’s return is among the better half of its country group (only groups with at least 2 funds).`,
  noNa: 'Assets of these plans are not published.' } }, { mg: {
  t: c => `${c}: valdytojai`, l: 'Pasirinktos šalies ir pakopos valdytojai: dydis, rinkos dalis ir kaip jų fondams sekasi, palyginus su kitais tos pačios grupės fondais.',
  h: { m: 'Valdytojas', n: 'Fondų', na: 'Turtas, mln. €', sh: 'Rinkos dalis', inv: 'Dalyviai', wr: 'Grąža (svertinė turtu)', top: 'Fondų geresnėje grupės pusėje', fee: 'Vidutinis mokestis' },
  shT: 'Rinkos dalis pagal turtą', brT: 'Kuo gali pasigirti kiekvienas valdytojas', brNone: 'Nė vienas fondas šiais laikotarpiais nėra geriausias savo grupėje.',
  br: (g, f, h, v, n) => `Geriausias grupėje „${g}“ per ${h}: ${f} (${v}, grupėje ${n} ${ltN(n, 'fondas', 'fondai', 'fondų')}).`,
  n: (d, lv) => `Turtas – naujausias žinomas (${lv ? 'Latvija – manapensija.lv kasdieniai duomenys' : 'kasdieniai duomenys'}${d ? `, ${d}` : ''}). Svertinė grąža – valdytojo fondų grąžų vidurkis, sveriant turtu. Geresnė pusė – fondo grąža tarp geresnės pusės jo šalies grupės fondų (tik grupės, kuriose bent 2 fondai).`,
  noNa: 'Šių plānų turtas neskelbiamas.' } });
let MGH = 'ytd';
const BRH = { ytd: { lt: 'šiuos metus', en: 'this year' }, y1: { lt: '1 metus', en: '1 year' }, y3: { lt: '3 metus', en: '3 years' }, y5: { lt: '5 metus', en: '5 years' } };
function mgData() {
  const G = crGroups(), fs = G.flatMap(g => g.fs), M = new Map(), pos = new Map();
  fs.forEach(f => { if (!M.has(f.m)) M.set(f.m, []); M.get(f.m).push(f); });
  G.forEach(g => { const xs = g.fs.map(f => ({ f, v: ret(f, MGH) })).filter(x => x.v != null).sort((a, b) => b.v - a.v); xs.forEach((x, i) => pos.set(x.f.id, [i + 1, xs.length])); });
  const tot = fs.reduce((s, f) => s + (f.na || 0), 0);
  const rows = [...M.entries()].map(([m, xs]) => {
    const na = xs.reduce((s, f) => s + (f.na || 0), 0), w = xs.filter(f => f.na && ret(f, MGH) != null), wn = w.reduce((s, f) => s + f.na, 0);
    const rk = xs.filter(f => pos.has(f.id) && pos.get(f.id)[1] > 1), fees = xs.filter(f => f.fee != null);
    return { m, n: xs.length, na: na || null, sh: tot && na ? na / tot * 100 : null, inv: xs.reduce((s, f) => s + (f.inv || 0), 0) || null,
      wr: wn ? w.reduce((s, f) => s + f.na * ret(f, MGH), 0) / wn : null, top: rk.length ? [rk.filter(f => pos.get(f.id)[0] <= pos.get(f.id)[1] / 2).length, rk.length] : null,
      fee: fees.length ? fees.reduce((s, f) => s + f.fee, 0) / fees.length : null };
  }).sort((a, b) => (b.na || 0) - (a.na || 0) || b.n - a.n || a.m.localeCompare(b.m));
  const brag = new Map(rows.map(r => [r.m, []]));                  // geriausias fondas grupėje per kiekvieną laikotarpį
  G.forEach(g => ['ytd', 'y1', 'y3', 'y5'].forEach(h => { const xs = g.fs.map(f => ({ f, v: ret(f, h) })).filter(x => x.v != null).sort((a, b) => b.v - a.v);
    if (xs.length > 1) brag.get(xs[0].f.m).push({ g: g.name, f: xs[0].f.n, h, v: xs[0].v, n: xs.length }); }));
  return { rows, tot, brag, d: fs.map(f => f.naQ).filter(Boolean).sort().pop() };
}
function renderMg() {
  const t = T(), m = t.mg; if (CR.c === 'X') return;
  const { rows, tot, brag, d } = mgData();
  $('mgT').textContent = m.t(t.c[CR.c]); $('mgL').textContent = m.l; $('mgSeg').innerHTML = hzSeg(MGH);
  const cols = ['m', 'n', 'na', 'sh', 'inv', 'wr', 'top', 'fee'].filter(k => k === 'm' || k === 'n' || k === 'top' || rows.some(r => r[k] != null));
  const cell = (r, k) => { const v = r[k]; if (k === 'm') return `<td class="nm"><b>${hEsc(v)}</b></td>`; if (v == null) return `<td class="n">${t.none}</td>`;
    return `<td class="n${k === 'wr' ? ' ' + sgn(v) : ''}">${k === 'na' ? num(v, 1) : k === 'inv' ? num(v, 0) : k === 'n' ? v : k === 'top' ? `${v[0]} / ${v[1]}` : pctPlain(v)}</td>`; };
  $('mgTbl').innerHTML = `<thead><tr>${cols.map(k => `<th${k === 'm' ? '' : ' class="n"'}>${k === 'wr' ? `${m.h.wr}, ${t.hz[MGH].toLowerCase()}` : m.h[k]}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${cols.map(k => cell(r, k)).join('')}</tr>`).join('')}</tbody>`;
  $('mgN').textContent = m.n(d, CR.c === 'LV');
  { const S = shOf(CR.c, CR.pl);   // tie patys mėnesio skaičiai kaip plytelėse ir „Rinkos dalis laike“ (vienas rodiklis – vienas skaičius)
    if (S && S.m.length) { const i1 = S.m.length - 1, A = shAt(S, i1, 'na'), col = mgColor(S), gs = [...col.keys()].filter(g => A.o[g]);
      if (A.s) { $('mgShT').textContent = `${m.shT} · ${S.m[i1]}`;
        $('mgSh').innerHTML = `<div class="shbar">${gs.map(g => `<span style="width:${A.o[g] / A.s * 100}%;background:${col.get(g)}" title="${hEsc(g)} ${pctPlain(A.o[g] / A.s * 100)}"></span>`).join('')}</div>`
          + `<div class="sel">${gs.map(g => `<span class="chip"><i style="background:${col.get(g)}"></i>${hEsc(g)} <b>${pctPlain(A.o[g] / A.s * 100)}</b></span>`).join('')}</div>`; } } else S0(); }
  function S0() { $('mgShT').textContent = m.shT;
  $('mgSh').innerHTML = tot ? `<div class="shbar">${rows.filter(r => r.na).map((r, i) => `<span style="width:${r.sh}%;background:${brandCol(r.m) || PAL[i % PAL.length]}" title="${hEsc(r.m)} ${pctPlain(r.sh)}"></span>`).join('')}</div>`
    + `<div class="sel">${rows.filter(r => r.na).map((r, i) => `<span class="chip"><i style="background:${brandCol(r.m) || PAL[i % PAL.length]}"></i>${hEsc(r.m)} <b>${pctPlain(r.sh)}</b></span>`).join('')}</div>` : `<p class="note">${m.noNa}</p>`; }
  $('mgBrT').textContent = m.brT;
  $('mgBr').innerHTML = rows.map(r => { const b = brag.get(r.m);
    return `<section class="card"><h3>${hEsc(r.m)}</h3>${b.length ? `<ul>${b.slice(0, 6).map(x => `<li>${hEsc(m.br(x.g, x.f, BRH[x.h][lang] || BRH[x.h].lt, fmtP(x.v), x.n))}</li>`).join('')}${b.length > 6 ? `<li class="note">+${b.length - 6}</li>` : ''}</ul>` : `<p class="note">${m.brNone}</p>`}</section>`; }).join('');
}
$('mgSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; MGH = b.dataset.h; renderMg(); });

/* ---------- Rinkos dalis laike ir pokytis nuo metų pradžios (kolegės „QlikView“ vaizdai, savininkas 2026-11-09): valdytojų turtas ir
   dalyviai kiekvieno mėnesio (LV, EE) ar ketvirčio (LT, LB) pabaigoje – BALTIC.sh (baltic.py shares()). ---------- */
addStrings({ ms: {
  t: 'Market share over time', l: 'Each manager’s share of the country’s pillar market at the end of every month (Lithuania – every quarter, Bank of Lithuania data).',
  k: { na: 'By assets', inv: 'By participants' },
  n: (f, est) => `Source: ${f}.${est ? ' Latvia: the assets of “Luminor plāns 53-58” are not listed on manapensija.lv – taken from its quarterly report and moved between quarters by the plan’s unit value (estimate). Its assets before ${est} are not known, so until then the Latvian total and Luminor’s share are too small (about 8% of the market).' : ''}`,
  src: { LV: 'manapensija.lv (assets and participants of each plan)', EE: 'pensionikeskus.ee (assets and active investors of each fund)', LT: 'Bank of Lithuania quarterly results (sum of each manager’s funds)' },
  noInv: 'Participants by fund are not published for this pillar.', none: 'No data on managers’ assets for this pillar.',
  gapE: (m, v, p) => `${m} took over a fund that is not in the source data (${v} € m, ${p} % of the market). Before this, that fund's assets are missing, so the other managers' shares are overstated.`,
  gapN: (d, l) => `Caution: the source lists only today's funds, so funds that were taken over or closed are missing from the history; shares before ${d} are approximate. Takeovers of missing funds (≥ 1 % of the market): ${l}.`,
  cutN: d => `The chart starts in ${d}: in the first months after the launch only a few small funds existed.`,
  yT: d => `Change since the start of the year (${d})`,
  yH: ['Manager', 'Assets at year start, € m', 'Assets now, € m', 'Change, € m', 'Change', 'Market share', 'Share change, p.p.', 'Participants', 'Participants change', 'Assets per participant, €'],
  tot: 'Whole market', yN: (a, b) => `Year start – ${a}, now – ${b}. Change in assets includes both investment results and money flows (contributions, payouts, switches).` },
  bs: { t: 'Baltic pension market', l: 'Lithuania, Latvia and Estonia: market size, change since the start of the year and managers – each country with its latest available data.',
  mT: 'Markets', mH: ['Market', 'Data as of', 'Assets, € m', 'Change since year start, € m', 'Change', 'Participants', 'Managers', 'Largest manager'],
  gT: 'Managers across the Baltics', k: { na: 'Assets, € m', sh: 'Market share' }, tot: 'Total', all: 'Baltics, total',
  n: 'Latvian pillar III – only open pension funds (closed funds are not on manapensija.lv). Estonian pillar III – participants by fund (unit owners) are only shown for the current day, so they are collected from 10 November 2026; there is no earlier history. Lithuania – quarter-end data of the Bank of Lithuania; the fall of Lithuanian pillar II assets in 2026 is the reform (people leaving the pillar and taking money out).' } }, { ms: {
  t: 'Rinkos dalis laike', l: 'Kiekvieno valdytojo dalis šalies pakopos rinkoje kiekvieno mėnesio pabaigoje (Lietuva – kiekvieno ketvirčio, LB duomenys).',
  k: { na: 'Pagal turtą', inv: 'Pagal dalyvius' },
  n: (f, est) => `Šaltinis: ${f}.${est ? ' Latvija: „Luminor plāns 53-58“ manapensija.lv sąraše nėra – jo turtas paimtas iš ketvirčio ataskaitos ir tarp ketvirčių perskaičiuotas pagal plāno vieneto vertę (apytiksliai). Jo turtas iki ${est} nežinomas, todėl iki tol Latvijos suma ir Luminor dalis per mažos (apie 8 % rinkos).' : ''}`,
  src: { LV: 'manapensija.lv (kiekvieno plāno turtas ir dalyviai)', EE: 'pensionikeskus.ee (kiekvieno fondo turtas ir aktyvūs investuotojai)', LT: 'LB ketvirčio rezultatai (valdytojo fondų suma)' },
  noInv: 'Dalyvių skaičius pagal fondą šiai pakopai neskelbiamas.', none: 'Šiai pakopai valdytojų turto duomenų nėra.',
  gapE: (m, v, p) => `${m} perėmė fondą, kurio šaltinio duomenyse nėra (${v} mln. €, ${p} % rinkos). Iki tol šio fondo turto trūksta, todėl kitų valdytojų dalys padidintos.`,
  gapN: (d, l) => `Dėmesio: šaltinis rodo tik dabartinius fondus, todėl perimtų ar uždarytų fondų istorijos nėra; dalys iki ${d} – apytikslės. Trūkstamų fondų perėmimai (≥ 1 % rinkos): ${l}.`,
  cutN: d => `Grafikas prasideda ${d}: pirmaisiais mėnesiais po starto veikė tik keli maži fondai.`,
  yT: d => `Pokytis nuo metų pradžios (${d})`,
  yH: ['Valdytojas', 'Turtas metų pradžioje, mln. €', 'Turtas dabar, mln. €', 'Pokytis, mln. €', 'Pokytis', 'Rinkos dalis', 'Dalies pokytis, p. p.', 'Dalyviai', 'Dalyvių pokytis', 'Turtas vienam dalyviui, €'],
  tot: 'Visa rinka', yN: (a, b) => `Metų pradžia – ${a}, dabar – ${b}. Turto pokytis apima ir investicijų rezultatą, ir pinigų srautus (įmokas, išmokas, perėjimus).` },
  bs: { t: 'Baltijos pensijų rinka', l: 'Lietuva, Latvija ir Estija: rinkos dydis, pokytis nuo metų pradžios ir valdytojai – kiekviena šalis su naujausiais turimais duomenimis.',
  mT: 'Rinkos', mH: ['Rinka', 'Duomenys', 'Turtas, mln. €', 'Pokytis nuo metų pradžios, mln. €', 'Pokytis', 'Dalyviai', 'Valdytojų', 'Didžiausias valdytojas'],
  gT: 'Valdytojai visose Baltijos šalyse', k: { na: 'Turtas, mln. €', sh: 'Rinkos dalis' }, tot: 'Iš viso', all: 'Baltijos šalys iš viso',
  n: 'Latvijos III pakopa – tik atvirieji pensijų fondai (uždarųjų manapensija.lv nėra). Estijos III pakopa – dalyviai pagal fondą (vienetų savininkai) skelbiami tik einamajai dienai, todėl renkami nuo 2026-11-10; ankstesnės istorijos nėra. Lietuva – LB ketvirčio pabaigos duomenys; Lietuvos II pakopos turto sumažėjimas 2026 m. – reforma (dalyviai išeina ir atsiima pinigus).' } });
let MSK = 'na', BSK = 'na';
const shOf = (c, pl) => (BALTIC.sh || {})[c] && BALTIC.sh[c][pl];
const mEnd = m => Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0) / DAY;
const mLab = (S, i) => S.f === 'Q' ? S.m[i] : S.m[i];
function shAt(S, i, k) {                                  // {valdytojas: vertė} i-tajame taške ir suma
  const o = {}; let s = 0;
  Object.entries(S.mg).forEach(([g, x]) => { const v = x[k][i]; if (v != null) { o[g] = v; s += v; } });
  return { o, s };
}
function ytdIdx(S) {                                      // [metų pradžios (praėjusių metų paskutinis taškas), dabartinis] indeksai
  const i1 = S.m.length - 1, y = S.m[i1].slice(0, 4);
  let i0 = -1; S.m.forEach((m, i) => { if (m.slice(0, 4) < y) i0 = i; });
  return [i0, i1];
}
function mgColor(S) {                                     // ta pati spalva valdytojui grafike ir lentelėje: pagal dabartinį dydį
  const last = shAt(S, S.m.length - 1, 'na').o;
  return new Map(Object.keys(S.mg).sort((a, b) => (last[b] || 0) - (last[a] || 0) || a.localeCompare(b)).map((g, i) => [g, brandCol(g) || PAL[i % PAL.length]]));   // prekės ženklo spalva
}
function renderMs() {
  const t = T().ms, S = shOf(CR.c, CR.pl);
  $('msT').textContent = t.t; $('msL').textContent = t.l; $('myT').textContent = t.yT('');
  if (!S || !S.m.length) { $('msSeg').innerHTML = ''; $('msCh').innerHTML = `<p class="note">${t.none}</p>`; $('myTbl').innerHTML = ''; $('msN').textContent = ''; $('myN').textContent = ''; return; }
  const hasInv = Object.values(S.mg).some(x => x.inv.some(v => v));
  if (!hasInv) MSK = 'na';
  $('msSeg').innerHTML = ['na', 'inv'].map(k => `<button type="button" data-k="${k}" aria-pressed="${k === MSK}"${k === 'inv' && !hasInv ? ' disabled' : ''}>${t.k[k]}</button>`).join('');
  const col = mgColor(S), ser = [];
  col.forEach((c, g) => { const pts = [];
    S.m.forEach((m, i) => { const a = shAt(S, i, MSK), v = S.mg[g][MSK][i]; if (v != null && a.s > 0) pts.push([mEnd(m), v / a.s * 100]); });
    if (pts.length > 1) ser.push({ points: pts, color: c, label: g, provider: g }); });
  const x0 = mEnd(S.m[S.cut || 0]), x1 = mEnd(S.m[S.m.length - 1]), G = S.gap || [];   // cut, gap – build_site.py share_gaps()
  const ev = G.map((g, i) => ({ day: mEnd(g[0]), n: i + 1, title: g[1], text: t.gapE(g[1], num(g[2], 1), num(g[3], 1)) }));
  drawLineChart($('msCh'), ser.map(s => ({ ...s, points: s.points.filter(p => p[0] >= x0) })), x0, x1, { zero: true, events: ev, fmt: v => pctPlain(v) });
  $('msN').textContent = t.n(t.src[CR.c], CR.c === 'LV' && CR.pl === 'II' && S.lum ? S.lum : '') + (hasInv ? '' : ' ' + t.noInv)
    + (G.length ? ' ' + t.gapN(G[G.length - 1][0], G.map((g, i) => `${i + 1} – ${g[0]}, ${g[1]}, ${num(g[2], 1)} mln. € (${num(g[3], 1)} %)`).join('; ')) : '')
    + (S.cut ? ' ' + t.cutN(S.m[S.cut]) : '');
  // pokytis nuo metų pradžios
  const [i0, i1] = ytdIdx(S); if (i0 < 0) { $('myTbl').innerHTML = ''; $('myN').textContent = ''; return; }
  const A0 = shAt(S, i0, 'na'), A1 = shAt(S, i1, 'na'), P0 = shAt(S, i0, 'inv'), P1 = shAt(S, i1, 'inv');
  $('myT').textContent = t.yT(`${S.m[i0]} → ${S.m[i1]}`);
  const f1 = v => v == null ? '–' : num(v, 1), f0 = v => v == null ? '–' : num(v, 0), fp = v => v == null || !isFinite(v) ? '–' : pctPlain(v), fpp = v => v == null || !isFinite(v) ? '–' : (v < 0 ? '−' : '+') + num(Math.abs(v), 2);
  const row = (g, a0, a1, p0, p1, s0, s1, tot) => {
    const d = a0 != null && a1 != null ? a1 - a0 : null, dp = d != null && a0 ? d / a0 * 100 : null, sh = s1 ? a1 / s1 * 100 : null, sh0 = s0 && a0 != null ? a0 / s0 * 100 : null;
    const pd = p0 != null && p1 != null ? p1 - p0 : null;
    return `<tr${tot ? ' class="tot"' : ''}><td class="nm">${tot ? `<b>${hEsc(g)}</b>` : `<i class="dot" style="background:${col.get(g)}"></i><b>${hEsc(g)}</b>`}</td><td class="n">${f1(a0)}</td><td class="n">${f1(a1)}</td><td class="n ${sgn(d)}">${f1(d)}</td><td class="n ${sgn(dp)}">${fp(dp)}</td>`
      + `<td class="n">${tot ? '100' + pctSfx() : fp(sh)}</td><td class="n ${tot ? '' : sgn(sh - sh0)}">${tot || sh == null || sh0 == null ? '–' : fpp(sh - sh0)}</td><td class="n">${f0(p1)}</td><td class="n ${sgn(pd)}">${pd == null ? '–' : (pd < 0 ? '−' : '+') + num(Math.abs(pd), 0)}</td><td class="n">${a1 != null && p1 ? num(a1 * 1e6 / p1, 0) : '–'}</td></tr>`; };
  const gs = [...col.keys()].filter(g => A1.o[g] != null || A0.o[g] != null);
  $('myTbl').innerHTML = `<thead><tr>${t.yH.map((h, i) => `<th${i ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`
    + gs.map(g => row(g, A0.o[g], A1.o[g], P0.o[g], P1.o[g], A0.s, A1.s)).join('')
    + row(t.tot, A0.s, A1.s, P0.s || null, P1.s || null, A0.s, A1.s, true) + '</tbody>';
  $('myN').textContent = t.yN(S.m[i0], S.m[i1]);
}
$('msSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; MSK = b.dataset.k; renderMs(); });
/* Valdytojų plytelės (maketas 6, savininkas 2026-11-10: „tiek kortelių, kiek valdytojų, ir valdikliai“) – tie patys BALTIC.sh skaičiai kaip grafike ir lentelėje */
addStrings({ mt: { cmp: { m: 'Change in a month', ytd: 'Change since year start', y: 'Change in a year' }, part: 'participants', mn: '€ m' } },
  { mt: { cmp: { m: 'Pokytis per mėnesį', ytd: 'Pokytis nuo metų pradžios', y: 'Pokytis per metus' }, part: 'dalyviai', mn: 'mln. €' } });
let MTK = 'na', MTC = 'y';
function renderMt() {
  const box = $('mtTiles'), S = shOf(CR.c, CR.pl), t = T(); if (!box) return;
  if (!S || !S.m.length) { box.innerHTML = ''; $('mtSh').innerHTML = ''; $('mtCmp').innerHTML = ''; return; }
  const hasInv = Object.values(S.mg).some(x => x.inv.some(v => v)); if (!hasInv) MTK = 'na';
  const q = S.f === 'Q', i1 = S.m.length - 1, back = { m: q ? 1 : 1, y: q ? 4 : 12 }, i0 = MTC === 'ytd' ? ytdIdx(S)[0] : i1 - back[MTC];
  $('mtSh').innerHTML = (hasInv ? ['na', 'inv'] : ['na']).map(k => `<button type="button" data-k="${k}" aria-pressed="${k === MTK}">${t.ms.k[k]}</button>`).join('');
  $('mtCmp').innerHTML = (q ? ['ytd', 'y'] : ['m', 'ytd', 'y']).map(k => `<button type="button" data-k="${k}" aria-pressed="${k === MTC}">${t.mt.cmp[k]}</button>`).join('');
  const col = mgColor(S), A1 = shAt(S, i1, MTK), A0 = i0 >= 0 ? shAt(S, i0, MTK) : null, N1 = shAt(S, i1, 'na'), P1 = shAt(S, i1, 'inv'), pp = lang === 'lt' ? 'p. p.' : 'pp';
  const gs = [...col.keys()].filter(g => A1.o[g] != null);
  box.style.setProperty('--n', Math.min(gs.length, 6));
  box.innerHTML = gs.map(g => {
    const sh = A1.s ? A1.o[g] / A1.s * 100 : null, sh0 = A0 && A0.s && A0.o[g] != null ? A0.o[g] / A0.s * 100 : null, d = sh != null && sh0 != null ? sh - sh0 : null;
    const pts = []; for (let i = Math.max(0, i1 - (q ? 11 : 35)); i <= i1; i++) { const a = shAt(S, i, MTK); if (a.s && a.o[g] != null) pts.push(a.o[g] / a.s * 100); }
    let sp = ''; if (pts.length > 2) { const lo = Math.min(...pts), hi = Math.max(...pts), W = 120, H = 26;
      sp = `<svg class="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path d="${pts.map((v, i) => `${i ? 'L' : 'M'}${(i / (pts.length - 1) * W).toFixed(1)} ${(H - 3 - (v - lo) / ((hi - lo) || 1) * (H - 6)).toFixed(1)}`).join('')}" fill="none" stroke="${col.get(g)}" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`; }
    return `<div class="mgt"><span class="mgn"><i class="sw" style="background:${col.get(g)}"></i>${hEsc(g)}</span><b class="mgv">${sh == null ? '–' : pctPlain(sh, 1)}</b>`
      + `<span class="mgd"><span class="kd ${d == null ? '' : d < 0 ? 'neg' : 'pos'}">${d == null ? '–' : `${d >= 0 ? '+' : '−'}${num(Math.abs(d), 2)} ${pp}`}</span> ${t.mt.cmp[MTC].toLowerCase()}</span>${sp}`
      + `<small>${N1.o[g] != null ? `${num(N1.o[g], 0)} ${t.mt.mn}` : ''}${P1.o[g] ? `<br>${num(P1.o[g], 0)} ${t.mt.part}` : ''}</small></div>`; }).join('');
}
$('mtSh').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; MTK = b.dataset.k; renderMt(); });
$('mtCmp').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; MTC = b.dataset.k; renderMt(); });

/* ---------- Latvija, II pakopa: dalyvių judėjimas pagal valdytoją (VSAA metinės ataskaitos, BALTIC.mv; kolegės „Participant movements“) ---------- */
addStrings({ mv: { t: 'Participant movements (once a year)', h: ['Manager', 'At year start', 'New', 'Came from other plans', 'Left to other plans', 'Net switching', 'Died', 'Retired', 'Correction', 'At year end', 'Change'],
  n: 'Source: VSAA annual reports on the state funded pension scheme. Switches between plans of the same manager are counted both as “came” and “left”, so net switching shows the real gain or loss. VSAA publishes these figures once a year; the 2022 report is a PDF and is not read yet.', tot: 'Whole scheme' } },
  { mv: { t: 'Dalyvių judėjimas (kartą per metus)', h: ['Valdytojas', 'Metų pradžioje', 'Nauji', 'Atėjo iš kitų plānų', 'Išėjo į kitus plānus', 'Grynasis perėjimas', 'Mirė', 'Išėjo į pensiją', 'Korekcija', 'Metų pabaigoje', 'Pokytis'],
  n: 'Šaltinis: VSAA metinės valstybinės kaupiamųjų pensijų schemos ataskaitos. Perėjimai tarp to paties valdytojo plānų įskaičiuoti ir į „atėjo“, ir į „išėjo“, todėl tikrąjį laimėjimą ar praradimą rodo grynasis perėjimas. VSAA šiuos skaičius skelbia kartą per metus; 2022 m. ataskaita – PDF, kol kas neperskaityta.', tot: 'Visa schema' } });
let MVY = null;
function renderMv() {
  const M = BALTIC.mv, on = CR.c === 'LV' && CR.pl === 'II' && M && M.y && M.y.length;
  $('mvC').hidden = !on; if (!on) return;
  const t = T().mv; if (!M.y.includes(MVY)) MVY = M.y[M.y.length - 1];
  const i = M.y.indexOf(MVY);
  $('mvT').textContent = `${t.t}: ${MVY}`;
  $('mvSeg').innerHTML = M.y.map(y => `<button type="button" data-y="${y}" aria-pressed="${y === MVY}">${y}</button>`).join('');
  const f = v => v == null ? '–' : (v < 0 ? '−' : '') + num(Math.abs(v), 0), fs = v => v == null ? '–' : (v < 0 ? '−' : v > 0 ? '+' : '') + num(Math.abs(v), 0);
  const row = (g, x, tot) => { const net = x.inn[i] != null && x.out[i] != null ? x.inn[i] + x.out[i] : null, ch = x.end[i] != null && x.start[i] != null ? x.end[i] - x.start[i] : null;
    return `<tr${tot ? ' class="tot"' : ''}><td class="nm"><b>${hEsc(g)}</b></td><td class="n">${f(x.start[i])}</td><td class="n">${f(x.new[i])}</td><td class="n">${f(x.inn[i])}</td><td class="n">${f(x.out[i])}</td>`
      + `<td class="n ${tot ? '' : sgn(net)}">${tot ? '–' : fs(net)}</td><td class="n">${f(x.died[i])}</td><td class="n">${f(x.ret[i])}</td><td class="n">${f(x.cor[i])}</td><td class="n">${f(x.end[i])}</td><td class="n ${sgn(ch)}">${fs(ch)}</td></tr>`; };
  const gs = Object.keys(M.mg).filter(g => M.mg[g].end[i] != null || M.mg[g].start[i] != null).sort((a, b) => (M.mg[b].end[i] || 0) - (M.mg[a].end[i] || 0));
  $('mvTbl').innerHTML = `<thead><tr>${t.h.map((h, j) => `<th${j ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${gs.map(g => row(g, M.mg[g])).join('')}${row(t.tot, M.tot, true)}</tbody>`;
  $('mvN').textContent = t.n;
}
$('mvSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; MVY = +b.dataset.y; renderMv(); });

/* ---------- Latvija, II pakopa: dalyvių perėjimai tarp valdytojų kas mėnesį (VSAA „Dalībnieku kustība pa ieguldījumu plāniem“,
   nuo 2003-01; BALTIC.sw – baltic.py lv_switch(); kolegės BC šaltinis 2026-11-10) ---------- */
addStrings({ sw: { t: 'Switching between managers (every month)', l: 'How many pillar II participants moved their savings from one manager to another. Only switches – new participants, deaths and retirements are in the yearly table above.',
  p: { m: 'Last month', ytd: 'Since year start', 12: 'Last 12 months' }, y: 'Year…',
  h: ['Manager', 'Came from other managers', 'Left to other managers', 'Net', 'Between own plans', 'Came mostly from', 'Left mostly to'],
  cT: 'Net switching, cumulative over the period', mT: 'Who moved where (rows – left from, columns – came to)', from: 'From \\ To', tot: 'Total',
  n: (a, b) => `Source: VSAA monthly report “Participant movement by investment plan” (published around the 15th of the following month). Period: ${a} – ${b}. Plans are grouped by today’s manager; old managers that no longer exist are shown under their own name. When a plan is merged into another or moved to a new manager, VSAA counts its participants as switches – such months show unusually large numbers.` } },
  { sw: { t: 'Dalyvių perėjimai tarp valdytojų (kas mėnesį)', l: 'Kiek II pakopos dalyvių perkėlė santaupas iš vieno valdytojo pas kitą. Tik perėjimai – nauji dalyviai, mirę ir išėję į pensiją yra metinėje lentelėje aukščiau.',
  p: { m: 'Paskutinis mėnuo', ytd: 'Nuo metų pradžios', 12: 'Paskutiniai 12 mėn.' }, y: 'Metai…',
  h: ['Valdytojas', 'Atėjo iš kitų valdytojų', 'Išėjo pas kitus', 'Grynasis', 'Tarp savo plānų', 'Daugiausia atėjo iš', 'Daugiausia išėjo pas'],
  cT: 'Grynasis perėjimas, sukaupta per laikotarpį', mT: 'Kas kur perėjo (eilutės – iš kurio išėjo, stulpeliai – pas kurį atėjo)', from: 'Iš \\ Į', tot: 'Iš viso',
  n: (a, b) => `Šaltinis: VSAA mėnesinė ataskaita „Dalībnieku kustība pa ieguldījumu plāniem“ (skelbiama apie kito mėnesio 15 d.). Laikotarpis: ${a} – ${b}. Plānai sugrupuoti pagal valdytoją; nebesantys seni valdytojai rodomi savo vardu. Kai plānas sujungiamas su kitu ar perduodamas kitam valdytojui, VSAA jo dalyvius skaičiuoja kaip perėjusius – tokie mėnesiai rodo neįprastai didelius skaičius.` } });
let SWP = 'ytd';
function swRange(S) {
  const n = S.m.length, last = S.m[n - 1], y = last.slice(0, 4);
  if (SWP === 'm') return [n - 1, n - 1];
  if (SWP === '12') return [Math.max(0, n - 12), n - 1];
  if (SWP === 'ytd') return [S.m.findIndex(m => m.slice(0, 4) === y), n - 1];
  const yy = SWP.slice(2), i0 = S.m.findIndex(m => m.slice(0, 4) === yy); let i1 = i0; S.m.forEach((m, i) => { if (m.slice(0, 4) === yy) i1 = i; });
  return [i0, i1];
}
function renderSw() {
  const S = BALTIC.sw, on = CR.c === 'LV' && CR.pl === 'II' && S && S.m && S.m.length;
  $('swC').hidden = !on; if (!on) return;
  const t = T().sw, G = S.g, n = G.length;
  $('swT').textContent = t.t; $('swL').textContent = t.l;
  $('swSeg').innerHTML = ['m', 'ytd', '12'].map(k => `<button type="button" data-p="${k}" aria-pressed="${k === SWP}">${t.p[k]}</button>`).join('');
  const ys = [...new Set(S.m.map(m => m.slice(0, 4)))].reverse();
  $('swY').innerHTML = `<option value="">${t.y}</option>` + ys.map(y => `<option value="y:${y}"${SWP === 'y:' + y ? ' selected' : ''}>${y}</option>`).join('');
  const [i0, i1] = swRange(S);
  const mx = Array.from({ length: n }, () => new Array(n).fill(0)), own = new Array(n).fill(0);
  for (let i = i0; i <= i1; i++) { S.x[i].forEach(([a, b, v]) => { mx[a][b] += v; }); S.own[i].forEach(([g, v]) => { own[g] += v; }); }
  const inn = G.map((_, j) => mx.reduce((s, r) => s + r[j], 0)), out = G.map((_, i) => mx[i].reduce((s, v) => s + v, 0));
  const act = G.map((_, i) => i).filter(i => inn[i] || out[i] || own[i]).sort((a, b) => (inn[b] - out[b]) - (inn[a] - out[a]));
  const f0 = v => num(v, 0), fs = v => (v < 0 ? '−' : v > 0 ? '+' : '') + num(Math.abs(v), 0);
  const top = (arr) => { let k = -1; arr.forEach((v, i) => { if (v > 0 && (k < 0 || v > arr[k])) k = i; }); return k < 0 ? '–' : `${hEsc(G[k])} (${f0(arr[k])})`; };
  const col = new Map(act.map((g, i) => [g, brandCol(G[g]) || PAL[i % PAL.length]]));   // prekės ženklo spalva
  $('swTbl').innerHTML = `<thead><tr>${t.h.map((h, j) => `<th${j && j < 5 ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`
    + act.map(i => `<tr><td class="nm"><i class="dot" style="background:${col.get(i)}"></i><b>${hEsc(G[i])}</b></td><td class="n">${f0(inn[i])}</td><td class="n">${f0(out[i])}</td><td class="n ${sgn(inn[i] - out[i])}">${fs(inn[i] - out[i])}</td><td class="n">${f0(own[i])}</td><td>${top(mx.map(r => r[i]))}</td><td>${top(mx[i])}</td></tr>`).join('')
    + `<tr class="tot"><td class="nm"><b>${t.tot}</b></td><td class="n">${f0(inn.reduce((a, b) => a + b, 0))}</td><td class="n">${f0(out.reduce((a, b) => a + b, 0))}</td><td class="n">–</td><td class="n">${f0(own.reduce((a, b) => a + b, 0))}</td><td></td><td></td></tr></tbody>`;
  // sukauptas grynasis perėjimas
  let c0 = i0; if (i1 - c0 < 1) c0 = Math.max(0, i1 - 11);
  $('swCT').textContent = `${t.cT} (${S.m[c0]} – ${S.m[i1]})`;
  const ser = act.map(g => { let c = 0; const pts = [[mEnd(S.m[c0]) - 30, 0]];
    for (let i = c0; i <= i1; i++) { S.x[i].forEach(([a, b, v]) => { if (b === g) c += v; if (a === g) c -= v; }); pts.push([mEnd(S.m[i]), c]); }
    return { points: pts, color: col.get(g), label: G[g], provider: G[g] }; });
  drawLineChart($('swCh'), ser, mEnd(S.m[c0]) - 30, mEnd(S.m[i1]), { axisUnit: '', fmt: v => fs(Math.round(v)) });
  // matrica
  $('swMT').textContent = t.mT;
  const cols = act.slice().sort((a, b) => G[a].localeCompare(G[b]));
  $('swMx').innerHTML = `<thead><tr><th>${t.from}</th>${cols.map(j => `<th class="n">${hEsc(G[j])}</th>`).join('')}<th class="n">${t.tot}</th></tr></thead><tbody>`
    + cols.map(i => `<tr><td class="nm"><b>${hEsc(G[i])}</b></td>${cols.map(j => `<td class="n">${i === j ? '<span class="note">' + (own[i] ? f0(own[i]) : '–') + '</span>' : mx[i][j] ? f0(mx[i][j]) : '–'}</td>`).join('')}<td class="n"><b>${f0(out[i])}</b></td></tr>`).join('')
    + `<tr class="tot"><td class="nm"><b>${t.tot}</b></td>${cols.map(j => `<td class="n"><b>${f0(inn[j])}</b></td>`).join('')}<td class="n"><b>${f0(out.reduce((a, b) => a + b, 0))}</b></td></tr></tbody>`;
  $('swN').textContent = t.n(S.m[i0], S.m[i1]);
}
$('swSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; SWP = b.dataset.p; renderSw(); });
$('swY').addEventListener('change', e => { if (e.target.value) { SWP = e.target.value; renderSw(); } });

function renderBs() {
  const T0 = T(), b = T0.bs;
  $('bsT').textContent = b.t; $('bsL').textContent = b.l; $('bsMT').textContent = b.mT; $('bsGT').textContent = b.gT; $('bsN').textContent = b.n;
  const mk = [], G = new Map();
  ['LT', 'LV', 'EE'].forEach(c => ['II', 'III'].forEach(pl => { const S = shOf(c, pl); if (!S || !S.m.length) return;
    const [i0, i1] = ytdIdx(S), A1 = shAt(S, i1, 'na'), A0 = i0 >= 0 ? shAt(S, i0, 'na') : null, P1 = shAt(S, i1, 'inv');
    const big = Object.entries(A1.o).sort((x, y) => y[1] - x[1])[0];
    mk.push({ k: `${c}-${pl}`, lab: `${T0.c[c]}, ${T0.pl(pl)}`, d: S.m[i1], na: A1.s, d0: A0 ? A1.s - A0.s : null, dp: A0 && A0.s ? (A1.s / A0.s - 1) * 100 : null, inv: P1.s || null, n: Object.keys(A1.o).length, big, tot: A1.s });
    Object.entries(A1.o).forEach(([g, v]) => { if (!G.has(g)) G.set(g, {}); G.get(g)[`${c}-${pl}`] = v; }); }));
  const f1 = v => v == null ? '–' : num(v, 1);
  const sum = mk.reduce((s, r) => s + r.na, 0), sd = mk.every(r => r.d0 != null) ? mk.reduce((s, r) => s + r.d0, 0) : null;
  $('bsM').innerHTML = `<thead><tr>${b.mH.map((h, i) => `<th${i > 1 ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`
    + mk.map(r => `<tr><td class="nm"><b>${hEsc(r.lab)}</b></td><td>${r.d}</td><td class="n">${f1(r.na)}</td><td class="n ${sgn(r.d0)}">${f1(r.d0)}</td><td class="n ${sgn(r.dp)}">${r.dp == null ? '–' : pctPlain(r.dp)}</td><td class="n">${r.inv ? num(r.inv, 0) : '–'}</td><td class="n">${r.n}</td><td class="nm">${r.big ? `${hEsc(r.big[0])} (${pctPlain(r.big[1] / r.tot * 100)})` : '–'}</td></tr>`).join('')
    + `<tr class="tot"><td class="nm"><b>${b.all}</b></td><td></td><td class="n"><b>${f1(sum)}</b></td><td class="n ${sgn(sd)}">${f1(sd)}</td><td class="n ${sgn(sd)}">${sd == null ? '–' : pctPlain(sd / (sum - sd) * 100)}</td><td></td><td class="n">${G.size}</td><td></td></tr></tbody>`;
  $('bsSeg').innerHTML = ['na', 'sh'].map(k => `<button type="button" data-k="${k}" aria-pressed="${k === BSK}">${b.k[k]}</button>`).join('');
  const rows = [...G.entries()].map(([g, o]) => ({ g, o, s: Object.values(o).reduce((a, v) => a + v, 0) })).sort((x, y) => y.s - x.s);
  const cell = (r, m) => { const v = r.o[m.k]; return `<td class="n">${v == null ? '–' : BSK === 'na' ? num(v, 1) : pctPlain(v / m.tot * 100)}</td>`; };
  $('bsG').innerHTML = `<thead><tr><th>${T0.mg.h.m}</th>${mk.map(m => `<th class="n">${m.k.replace('-', ' ')}</th>`).join('')}<th class="n">${b.tot}</th></tr></thead><tbody>`
    + rows.map(r => `<tr><td class="nm"><b>${hEsc(r.g)}</b></td>${mk.map(m => cell(r, m)).join('')}<td class="n"><b>${BSK === 'na' ? num(r.s, 1) : pctPlain(r.s / sum * 100)}</b></td></tr>`).join('') + '</tbody>';
}
$('bsSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; BSK = b.dataset.k; renderBs(); });

/* ---------- Turto pokytis: kas keitė turtą – investicijų grąža, pinigų srautai ir sujungimai (kaip Lietuvos „Turtas“ – aum.html;
   savininkas 2026-11-10: „kad visos Baltijos šalys turėtų vienodas galimybes“). Duomenys – BXFLOW (baltic.py flows(), docs/data_bx_flow.js,
   įkeliama tik atidarius skirtuką): kiekvieno fondo mėnesio pabaigos turtas ir vieneto vertė. Tarp dviejų taškų: grąža = turtas₀ × (vv₁ ÷ vv₀ − 1),
   srautas = turtas₁ − turtas₀ × vv₁ ÷ vv₀; sujungimai (turtas iš šaltinio sąraše nesančių fondų) – atskirai. Tos pačios formulės – Excel. ---------- */
addStrings({ fl: {
  tab: 'Asset change', t: c => `${c}: what changed the assets`,
  l: 'Each change in fund assets is split into the investment result (how assets would have changed with no money coming in or out) and money flows: contributions, payouts and switches between managers. This shows whether a manager grows because of its results or because people bring (or take) money.',
  lt: 'Lithuanian funds: the same split (with reform payouts shown separately) – on the <a href="aum.html#tab=dc">Assets → What changed assets</a> page.',
  yT: 'By year', yH: ['Year', 'Assets at start, € m', 'Investment result, € m', 'Money flows, € m', 'Mergers, € m', 'Assets at end, € m', 'Flows, % of start assets', 'Result, % of start assets'],
  leg: { r: 'Investment result', f: 'Money flows', g: 'Mergers' },
  mT: 'By manager', mH: ['Manager', 'Assets at start, € m', 'Investment result, € m', 'Money flows, € m', 'Mergers, € m', 'Assets at end, € m', 'Flows, % of start assets', 'Share of market flows'],
  hz: { ytd: 'Since year start', y1: '12 months', y3: '3 years', y5: '5 years', y10: '10 years' },
  tot: 'Whole market', per: (a, b) => `Period: end of ${a} – end of ${b}.`,
  hT: 'Money flows by month, € m', hN: 'Monthly net money flow of each manager (contributions − payouts ± switches). Green – money comes in, red – goes out.',
  part: d => `* – year to date (data to ${d}).`,
  n: { LV: 'Source: manapensija.lv – daily assets and unit value of each plan (since 2003). Month-end – the last available day of the month. “Mergers” – assets that came from plans not listed on manapensija.lv (e.g. “Luminor plāns 53-58” merged into “Luminor plāns 50-60” on 20 October 2026) and one-off data jumps; for the market they are not new money, so they are shown separately. Latvian pillar II has no lump-sum reform payouts, so flows are mostly contributions (about 5–6% of gross wages), switches and pensions paid.',
       EE: 'Source: pensionikeskus.ee – daily net assets and unit value of each fund (since 2002). Month-end – the last available day of the month. “Mergers” – assets that came from funds not in the source list. The large outflow of 2021–2022 in pillar II is the Estonian reform (people withdrew their savings, payouts in September 2021, January, May and September 2022).' },
  none: 'No asset data for this pillar.', load: 'Loading…',
  xl: 'Excel with formulas', xlF: 'Asset change', xlS: ['Years', 'Managers', 'Points', 'Methodology'] } }, { fl: {
  tab: 'Turto pokytis', t: c => `${c}: kas keitė turtą`,
  l: 'Kiekvienas fondų turto pokytis išskaidytas į investicijų rezultatą (kiek turtas būtų pasikeitęs, jei pinigų nei įneštų, nei išimtų) ir pinigų srautus: įmokas, išmokas ir perėjimus tarp valdytojų. Taip matyti, ar valdytojas auga dėl rezultatų, ar dėl to, kad žmonės atneša (ar išsineša) pinigus.',
  lt: 'Lietuvos fondų tas pats išskaidymas (su atskirai parodytomis reformos išmokomis) – puslapyje <a href="aum.html#tab=dc">Turtas → Kas keitė turtą</a>.',
  yT: 'Pagal metus', yH: ['Metai', 'Turtas pradžioje, mln. €', 'Investicijų rezultatas, mln. €', 'Pinigų srautai, mln. €', 'Sujungimai, mln. €', 'Turtas pabaigoje, mln. €', 'Srautai, % pradžios turto', 'Rezultatas, % pradžios turto'],
  leg: { r: 'Investicijų rezultatas', f: 'Pinigų srautai', g: 'Sujungimai' },
  mT: 'Pagal valdytoją', mH: ['Valdytojas', 'Turtas pradžioje, mln. €', 'Investicijų rezultatas, mln. €', 'Pinigų srautai, mln. €', 'Sujungimai, mln. €', 'Turtas pabaigoje, mln. €', 'Srautai, % pradžios turto', 'Dalis rinkos srautų'],
  hz: { ytd: 'Nuo metų pradžios', y1: '12 mėn.', y3: '3 metai', y5: '5 metai', y10: '10 metų' },
  tot: 'Visa rinka', per: (a, b) => `Laikotarpis: ${a} pabaiga – ${b} pabaiga.`,
  hT: 'Pinigų srautai pagal mėnesį, mln. €', hN: 'Kiekvieno valdytojo grynasis mėnesio pinigų srautas (įmokos − išmokos ± perėjimai). Žalia – pinigai ateina, raudona – išeina.',
  part: d => `* – nuo metų pradžios (duomenys iki ${d}).`,
  n: { LV: 'Šaltinis: manapensija.lv – kiekvieno plāno kasdienis turtas ir vieneto vertė (nuo 2003 m.). Mėnesio pabaiga – paskutinė turima mėnesio diena. „Sujungimai“ – turtas, atėjęs iš plānų, kurių manapensija.lv sąraše nėra (pvz. „Luminor plāns 53-58“ 2026-10-20 sujungtas su „Luminor plāns 50-60“), ir vienkartiniai duomenų šuoliai; rinkai tai ne nauji pinigai, todėl rodoma atskirai. Latvijos II pakopoje vienkartinių reformos išmokų nėra, todėl srautai – daugiausia įmokos (apie 5–6 % bruto atlyginimo), perėjimai ir išmokėtos pensijos.',
       EE: 'Šaltinis: pensionikeskus.ee – kiekvieno fondo kasdieniai grynieji aktyvai ir vieneto vertė (nuo 2002 m.). Mėnesio pabaiga – paskutinė turima mėnesio diena. „Sujungimai“ – turtas, atėjęs iš fondų, kurių šaltinio sąraše nėra. Didelis 2021–2022 m. II pakopos ištekėjimas – Estijos reforma (žmonės atsiėmė santaupas; išmokos 2021 m. rugsėjį, 2022 m. sausį, gegužę ir rugsėjį).' },
  none: 'Šiai pakopai turto duomenų nėra.', load: 'Įkeliama…',
  xl: 'Excel su formulėmis', xlF: 'Turto pokytis', xlS: ['Metai', 'Valdytojai', 'Taškai', 'Metodika'] } });
let FLH = 'ytd';
const kLab = k => `${Math.floor(k / 12)}-${String(k % 12 + 1).padStart(2, '0')}`;
function loadFlow(cb) {
  if (typeof BXFLOW !== 'undefined') return cb();
  if (loadFlow.p) return loadFlow.p.push(cb);
  loadFlow.p = [cb]; const s = document.createElement('script'); s.src = `data_bx_flow.js?v=${BALTIC.flv || ''}`;
  s.onload = () => { const q = loadFlow.p; loadFlow.p = null; q.forEach(f => f()); }; s.onerror = () => { loadFlow.p = null; };
  document.head.appendChild(s);
}
const flS = () => typeof BXFLOW !== 'undefined' && BXFLOW[CR.c] && BXFLOW[CR.c][CR.pl];
function flPairs(S, fn) {                                 // fn(fondas, k, a0, u0, a1, u1, sujungimai) kiekvienai taškų porai (k – pabaigos mėnuo)
  S.f.forEach(f => { let p = null;
    f.a.forEach((a, i) => { if (a == null) return; const k = f.k0 + i;
      if (p) fn(f, k, p[0], p[1], a, f.u[i], (f.g && f.g[k]) || 0); p = [a, f.u[i]]; }); });
}
const flAt = (f, k) => { const i = k - f.k0; return i >= 0 && i < f.a.length && f.a[i] != null ? f.a[i] : 0; };
function flAgg(S, kS, kE, key) {                          // {raktas: {a0, a1, r, f, g}} laikotarpiui (kS; kE]
  const o = new Map(), get = x => { if (!o.has(x)) o.set(x, { a0: 0, a1: 0, r: 0, f: 0, g: 0 }); return o.get(x); };
  S.f.forEach(f => { const x = get(key(f)); x.a0 += flAt(f, kS); x.a1 += flAt(f, kE); });
  flPairs(S, (f, k, a0, u0, a1, u1, g) => { if (k <= kS || k > kE) return; const x = get(key(f)); x.r += a0 * (u1 / u0 - 1); x.f += a1 - a0 * u1 / u0 - g; x.g += g; });
  return o;
}
function flBars(el, rows) {                               // metų stulpeliai: rezultatas, srautai, sujungimai (kiekvienas savo stulpelis)
  const t = T().fl, W = el.clientWidth || 800, H = Math.max(240, Math.min(360, Math.round(W * 0.36))), m = { l: 54, r: 10, t: 10, b: 26 };
  let lo = 0, hi = 0; rows.forEach(r => [r.r, r.f, r.g].forEach(v => { lo = Math.min(lo, v); hi = Math.max(hi, v); }));
  const ticks = niceTicks(lo, hi); lo = Math.min(lo, ticks[0]); hi = Math.max(hi, ticks[ticks.length - 1]);
  const gw = (W - m.l - m.r) / rows.length, bw = Math.max(1.5, Math.min(14, gw * 0.8 / 3)), Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  const C = { r: '#2b8de0', f: '#2f8f12', g: '#9a9a9a' }, every = Math.max(1, Math.ceil(rows.length / Math.floor((W - m.l - m.r) / 38)));
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${t.yT}">`
    + ticks.map(v => `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === 0 ? 'var(--axis)' : 'var(--grid)'}"/><text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--text-3)">${num(v, 0)}</text>`).join('');
  rows.forEach((r, i) => { const x0 = m.l + i * gw + (gw - bw * 3) / 2;
    ['r', 'f', 'g'].forEach((k, j) => { const v = r[k]; if (!v) return; const y = Y(Math.max(0, v)), h = Math.abs(Y(v) - Y(0));
      s += `<rect x="${(x0 + j * bw).toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1, bw - 1).toFixed(1)}" height="${Math.max(0.5, h).toFixed(1)}" fill="${C[k]}"><title>${r.y}: ${t.leg[k]} ${num(v, 1)}</title></rect>`; });
    if (i % every === 0) s += `<text x="${m.l + (i + 0.5) * gw}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--text-3)">${r.y}</text>`; });
  el.innerHTML = s + '</svg>' + `<p class="note">${['r', 'f', 'g'].map(k => `<i class="dot" style="background:${C[k]}"></i>${t.leg[k]}`).join(' &nbsp; ')}</p>`;
}
function renderFl() {
  const t = T().fl, b = T();
  $('flT').textContent = t.t(b.c[CR.c] || CR.c);
  if (CR.c === 'LT') { $('flL').innerHTML = t.lt; $('flBody').style.display = 'none'; return; }
  $('flL').textContent = t.l; $('flBody').style.display = 'contents'; $('flYT').textContent = t.yT; $('flMT').textContent = t.mT;
  if (typeof BXFLOW === 'undefined') { $('flYTbl').innerHTML = `<tbody><tr><td>${t.load}</td></tr></tbody>`; return loadFlow(() => { if (TAB_CUR === 'fl') renderFl(); }); }
  const S = flS();
  if (!S) { ['flYTbl', 'flMTbl', 'flHTbl'].forEach(id => { $(id).innerHTML = ''; }); $('flCh').innerHTML = `<p class="note">${t.none}</p>`; $('flN').textContent = ''; return; }
  const kEnd = Math.max(...S.f.map(f => f.k0 + f.a.length - 1)), kFirst = Math.min(...S.f.map(f => f.k0)), y1 = Math.floor(kEnd / 12), y0 = Math.floor(kFirst / 12) + 1;
  const f1 = v => num(v, 1), pc = (v, a) => a > 0 ? pctPlain(v / a * 100) : '–';
  // pagal metus
  const ys = []; for (let y = y0; y <= y1; y++) { const x = flAgg(S, y * 12 - 1, Math.min(y * 12 + 11, kEnd), () => 1).get(1); ys.push({ y: y === y1 && kEnd % 12 !== 11 ? `${y}*` : String(y), ...x }); }
  flBars($('flCh'), ys);
  const hasG = ys.some(r => Math.abs(r.g) >= 0.05);
  const hd = h => `<thead><tr>${h.map((x, i) => i === 4 && !hasG ? '' : `<th${i ? ' class="n"' : ''}>${x}</th>`).join('')}</tr></thead>`;
  const row = (lab, x, tot, extra) => `<tr${tot ? ' class="tot"' : ''}><td class="nm"><b>${lab}</b></td><td class="n">${f1(x.a0)}</td><td class="n ${sgn(x.r)}">${f1(x.r)}</td><td class="n ${sgn(x.f)}">${f1(x.f)}</td>${hasG ? `<td class="n">${Math.abs(x.g) >= 0.05 ? f1(x.g) : '–'}</td>` : ''}<td class="n">${f1(x.a1)}</td><td class="n ${sgn(x.f)}">${pc(x.f, x.a0)}</td>${extra}</tr>`;
  $('flYTbl').innerHTML = hd(t.yH) + '<tbody>' + ys.slice().reverse().map(x => row(x.y, x, false, `<td class="n ${sgn(x.r)}">${pc(x.r, x.a0)}</td>`)).join('') + '</tbody>';
  // pagal valdytoją
  $('flSeg').innerHTML = ['ytd', 'y1', 'y3', 'y5', 'y10'].map(h => `<button type="button" data-h="${h}" aria-pressed="${h === FLH}">${t.hz[h]}</button>`).join('');
  const kS = FLH === 'ytd' ? y1 * 12 - 1 : Math.max(kFirst, kEnd - { y1: 12, y3: 36, y5: 60, y10: 120 }[FLH]);
  const M = flAgg(S, kS, kEnd, f => f.m), tot = { a0: 0, a1: 0, r: 0, f: 0, g: 0 };
  M.forEach(x => Object.keys(tot).forEach(k => { tot[k] += x[k]; }));
  const ms = [...M.entries()].filter(([, x]) => x.a0 || x.a1).sort((a, b) => b[1].a1 - a[1].a1);
  const posF = ms.reduce((s, [, x]) => s + Math.max(0, x.f), 0);
  $('flMTbl').innerHTML = hd(t.mH) + '<tbody>' + ms.map(([g, x]) => row(hEsc(g), x, false, `<td class="n">${x.f > 0 && posF ? pctPlain(x.f / posF * 100) : '–'}</td>`)).join('') + row(t.tot, tot, true, '<td class="n">–</td>') + '</tbody>';
  $('flMN').textContent = t.per(kLab(kS), kLab(kEnd)) + (lang === 'lt' ? ' „Dalis rinkos srautų“ – valdytojo įplaukų dalis visų valdytojų, kuriems pinigai atėjo, įplaukų sumoje.' : ' “Share of market flows” – the manager’s inflow as a share of the total inflow of all managers with positive flows.');
  // pagal mėnesį (paskutiniai 12)
  const ks = []; for (let k = Math.max(kFirst + 1, kEnd - 11); k <= kEnd; k++) ks.push(k);
  const H = new Map(); flPairs(S, (f, k, a0, u0, a1, u1, g) => { if (k < ks[0]) return; const m = H.get(f.m) || H.set(f.m, {}).get(f.m); m[k] = (m[k] || 0) + a1 - a0 * u1 / u0 - g; });
  const mx = Math.max(1e-9, ...[...H.values()].flatMap(o => Object.values(o).map(Math.abs)));
  const bg = v => v == null ? '' : ` style="background:${v >= 0 ? `rgba(47,143,18,${(0.08 + 0.5 * Math.abs(v) / mx).toFixed(2)})` : `rgba(214,69,65,${(0.08 + 0.5 * Math.abs(v) / mx).toFixed(2)})`}"`;
  $('flHTbl').innerHTML = `<thead><tr><th>${t.mH[0]}</th>${ks.map(k => `<th class="n">${kLab(k)}</th>`).join('')}<th class="n">Σ</th></tr></thead><tbody>`
    + ms.filter(([g]) => H.has(g)).map(([g]) => { const o = H.get(g); return `<tr><td class="nm"><b>${hEsc(g)}</b></td>${ks.map(k => `<td class="n"${bg(o[k])}>${o[k] == null ? '–' : num(o[k], 1)}</td>`).join('')}<td class="n ${sgn(ks.reduce((s, k) => s + (o[k] || 0), 0))}">${num(ks.reduce((s, k) => s + (o[k] || 0), 0), 1)}</td></tr>`; }).join('') + '</tbody>';
  $('flHT').textContent = t.hT; $('flHN').textContent = t.hN;
  $('flN').textContent = (kEnd % 12 !== 11 ? t.part(S.end) + ' ' : '') + t.n[CR.c];
  $('flXl').textContent = '⤓ ' + t.xl;
  renderFl.last = { S, kS, kEnd, y0, y1 };
}
$('flSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; FLH = b.dataset.h; renderFl(); });
/* Excel – įrodymų failas: lapas „Taškai“ – kiekviena fondo mėnesio pabaigos taškų pora (mėlyni pradiniai duomenys iš šaltinio),
   grąža ir srautai – formulės; „Metai“ ir „Valdytojai“ – SUMIFS iš „Taškai“, laikotarpio ribos – mėlyni įvesties langeliai. */
async function flExcel() {
  const L = lang === 'lt', t = T().fl, { S, kS, kEnd, y0, y1 } = renderFl.last, wb = XL.book(), sh = t.xlS, P = `'${sh[2]}'`, M3 = '#,##0.000', M1 = '#,##0.0';
  const src = CR.c === 'LV' ? 'manapensija.lv' : 'pensionikeskus.ee', name = `${T().c[CR.c]} ${CR.pl}`;
  const pts = [[{ v: `${t.xlF}: ${name} – ${sh[2].toLowerCase()}`, s: 'title' }], [{ v: (L ? 'Šaltinis: ' : 'Source: ') + src + (L ? ' (mėnesio pabaigos turtas ir vieneto vertė; sujungimai – nustatyti iš kasdienių duomenų, žr. „Metodika“).' : ' (month-end assets and unit value; mergers – found from daily data, see “Methodology”).'), s: 'sub' }], [],
    (L ? ['Valdytojas', 'Fondas', 'Pradžios mėnuo', 'Turtas pradžioje, mln. €', 'Vieneto vertė pradžioje', 'Pabaigos mėnuo', 'Turtas pabaigoje, mln. €', 'Vieneto vertė pabaigoje', 'Investicijų rezultatas, mln. €', 'Visas srautas, mln. €', 'Sujungimai, mln. €', 'Pinigų srautai, mln. €', 'Metai', 'Pabaigos mėnesio nr.', 'Pradžios mėnesio nr.']
      : ['Manager', 'Fund', 'Start month', 'Assets at start, € m', 'Unit value at start', 'End month', 'Assets at end, € m', 'Unit value at end', 'Investment result, € m', 'Total flow, € m', 'Mergers, € m', 'Money flows, € m', 'Year', 'End month no.', 'Start month no.']).map(h => ({ v: h, s: 'hdr' }))];
  const R0 = pts.length + 1;
  S.f.forEach(f => { let p = null;
    f.a.forEach((a, i) => { if (a == null) return; const k = f.k0 + i;
      if (p) { const n = pts.length + 1, [a0, u0, k0] = p, u1 = f.u[i], g = (f.g && f.g[k]) || 0;
        pts.push([f.m, f.n, kLab(k0), { v: a0, s: 'in', z: M3 }, { v: u0, s: 'in', z: '0.0000000' }, kLab(k), { v: a, s: 'in', z: M3 }, { v: u1, s: 'in', z: '0.0000000' },
          { f: `D${n}*(H${n}/E${n}-1)`, v: a0 * (u1 / u0 - 1), z: M3 }, { f: `G${n}-D${n}*H${n}/E${n}`, v: a - a0 * u1 / u0, z: M3 }, { v: g, s: 'in', z: M3 },
          { f: `J${n}-K${n}`, v: a - a0 * u1 / u0 - g, z: M3 }, { f: `VALUE(LEFT(F${n},4))`, v: Math.floor(k / 12) }, { f: `M${n}*12+VALUE(MID(F${n},6,2))-1`, v: k }, { f: `VALUE(LEFT(C${n},4))*12+VALUE(MID(C${n},6,2))-1`, v: k0 }]); }
      p = [a, f.u[i], k]; }); });
  const N = Math.max(R0, pts.length), rg = c => `${P}!$${c}$${R0}:$${c}$${N}`;
  // „Metai“
  const Y = [[{ v: `${t.xlF}: ${name} – ${sh[0].toLowerCase()}`, s: 'title' }], [{ v: L ? `Sumos iš lapo „${sh[2]}“ (SUMIFS pagal metus). Turtas – fondų mėnesio pabaigos turto suma; patikra = pradžia + rezultatas + srautai + sujungimai − pabaiga.` : `Sums from the “${sh[2]}” sheet (SUMIFS by year). Assets – sum of funds’ month-end assets; check = start + result + flows + mergers − end.`, s: 'sub' }], [],
    [...t.yH.slice(0, 6), L ? 'Patikra' : 'Check', L ? 'Pradžios mėnesio nr.' : 'Start month no.', L ? 'Pabaigos mėnesio nr.' : 'End month no.'].map(h => ({ v: h, s: 'hdr' }))];
  const yA = y => S.f.reduce((s, f) => s + flAt(f, Math.min(y * 12 + 11, kEnd)), 0);
  for (let y = y0; y <= y1; y++) { const n = Y.length + 1, x = flAgg(S, y * 12 - 1, Math.min(y * 12 + 11, kEnd), () => 1).get(1), ke = Math.min(y * 12 + 11, kEnd);
    Y.push([y, { f: `SUMIFS(${rg('D')},${rg('O')},H${n})`, v: x.a0, z: M1 }, { f: `SUMIFS(${rg('I')},${rg('M')},A${n})`, v: x.r, z: M1 }, { f: `SUMIFS(${rg('L')},${rg('M')},A${n})`, v: x.f, z: M1 },
      { f: `SUMIFS(${rg('K')},${rg('M')},A${n})`, v: x.g, z: M1 }, { f: `SUMIFS(${rg('G')},${rg('N')},I${n})`, v: yA(y), z: M1 }, { f: `B${n}+C${n}+D${n}+E${n}-F${n}`, v: x.a0 + x.r + x.f + x.g - yA(y), z: M3 }, { v: y * 12 - 1, s: 'in' }, { v: ke, s: 'in' }]); }
  // „Valdytojai“
  const Mg = flAgg(S, kS, kEnd, f => f.m), V = [[{ v: `${t.xlF}: ${name} – ${sh[1].toLowerCase()}`, s: 'title' }], [{ v: L ? 'Laikotarpio ribos (mėnesio nr. = metai × 12 + mėnuo − 1) – mėlyni langeliai, juos galima keisti.' : 'Period limits (month no. = year × 12 + month − 1) – blue cells, can be changed.', s: 'sub' }],
    [L ? 'Pradžia (mėnesio nr., neįskaitant)' : 'Start (month no., excluded)', { v: kS, s: 'in' }, kLab(kS)], [L ? 'Pabaiga (mėnesio nr.)' : 'End (month no.)', { v: kEnd, s: 'in' }, kLab(kEnd)], [],
    [t.mH[0], ...t.mH.slice(1, 6), L ? 'Patikra' : 'Check'].map(h => ({ v: h, s: 'hdr' }))];
  [...Mg.entries()].filter(([, x]) => x.a0 || x.a1).sort((a, b) => b[1].a1 - a[1].a1).forEach(([g, x]) => { const n = V.length + 1, q = `${rg('A')},$A${n}`;
    V.push([g, { f: `SUMIFS(${rg('D')},${q},${rg('O')},$B$3)`, v: x.a0, z: M1 },
      { f: `SUMIFS(${rg('I')},${q},${rg('N')},">"&$B$3,${rg('N')},"<="&$B$4)`, v: x.r, z: M1 }, { f: `SUMIFS(${rg('L')},${q},${rg('N')},">"&$B$3,${rg('N')},"<="&$B$4)`, v: x.f, z: M1 },
      { f: `SUMIFS(${rg('K')},${q},${rg('N')},">"&$B$3,${rg('N')},"<="&$B$4)`, v: x.g, z: M1 }, { f: `SUMIFS(${rg('G')},${q},${rg('N')},$B$4)`, v: x.a1, z: M1 }, { f: `B${n}+C${n}+D${n}+E${n}-F${n}`, v: x.a0 + x.r + x.f + x.g - x.a1, z: M3 }]); });
  const meth = (L ? [['Metodika ir šaltiniai'], [], ['Šaltinis', `${src}: kiekvieno fondo kasdienis turtas ir vieneto vertė; čia – paskutinė turima kiekvieno mėnesio diena.`],
    ['Investicijų rezultatas', 'Turtas pradžioje × (vieneto vertė pabaigoje ÷ vieneto vertė pradžioje − 1) – kiek turtas būtų pasikeitęs be jokių srautų.'],
    ['Visas srautas', 'Turtas pabaigoje − turtas pradžioje × vieneto vertė pabaigoje ÷ vieneto vertė pradžioje: įmokos, išmokos, perėjimai, sujungimai.'],
    ['Sujungimai', 'Turtas, atėjęs iš fondų, kurių šaltinio sąraše nėra (fondo dienos srautas didesnis už 5 mln. € ir 20 % jo turto, o visos rinkos tos dienos grynasis srautas – bent pusė jo), ir vienkartiniai duomenų šuoliai. Nustatoma iš kasdienių duomenų (svetainės baltic.py flows), todėl čia – mėlynas pradinis duomuo.'],
    ['Pinigų srautai', 'Visas srautas − sujungimai.'],
    ['Nauji ir uždaryti fondai', 'Naujas fondas – taškas prieš pradžią su turtu 0 (pradinis turtas – įplauka). Uždarytas ar sujungtas fondas – taškas po pabaigos su turtu 0 (visas turtas išeina; jį gavęs fondas rodo įplauką).'],
    ['Atsisiųsta', String(BALTIC.generated || iso(TOP))]]
    : [['Methodology and sources'], [], ['Source', `${src}: daily assets and unit value of each fund; here – the last available day of each month.`],
    ['Investment result', 'Assets at start × (unit value at end ÷ unit value at start − 1) – how assets would have changed with no flows.'],
    ['Total flow', 'Assets at end − assets at start × unit value at end ÷ unit value at start: contributions, payouts, switches, mergers.'],
    ['Mergers', 'Assets that came from funds not in the source list (a fund’s daily flow above €5 m and 20% of its assets while the whole market’s net flow that day is at least half of it) and one-off data jumps. Found from daily data (baltic.py flows), so here it is a blue input.'],
    ['Money flows', 'Total flow − mergers.'],
    ['New and closed funds', 'New fund – a point before its start with assets 0 (initial assets are an inflow). Closed or merged fund – a point after its end with assets 0 (all assets leave; the receiving fund shows an inflow).'],
    ['Downloaded', String(BALTIC.generated || iso(TOP))]]).map((r, i) => r.map((v, j) => ({ v, s: i === 0 ? 'title' : j === 0 ? 'b' : '' })));
  XL.sheet(wb, sh[0], Y, { cols: [8, 14, 16, 14, 13, 14, 10, 10, 10], freeze: { r: 4 } });
  XL.sheet(wb, sh[1], V, { cols: [26, 14, 16, 14, 13, 14, 10], freeze: { r: 6 } });
  XL.sheet(wb, sh[2], pts, { cols: [14, 40, 10, 13, 12, 10, 13, 12, 14, 13, 12, 13, 7, 9, 9], freeze: { r: 4 } });
  XL.sheet(wb, sh[3], meth, { cols: [24, 130] });
  await XL.save(wb, `${t.xlF} ${CR.c} ${CR.pl} ${kLab(kEnd)}.xlsx`);
}
$('flXl').addEventListener('click', () => flExcel().catch(e => console.error(e)));

/* ---------- Excel: fondai ir vertės su formulėmis ---------- */
async function excel() {
  const t = T(), rs = BX.filter(f => CR.c === 'X' || f.c === CR.c).map(f => ({ f })), wb = XL.book(), xd = d => ({ v: d + 25569, z: 'yyyy-mm-dd', s: 'in' }), xv = v => ({ v, z: '0.00000', s: 'in' });
  XL.sheet(wb, t.xlS, [[{ v: t.xlT, s: 'title' }], [{ v: t.srcLine, s: 'sub' }], [], t.xlH.map(h => ({ v: h, s: 'hdr' })),
    ...rs.map(({ f }) => [t.c[f.c], f.pl, f.m, f.n, cgLabel(f), f.risk ? t.rg[f.risk] : t.rgNone, f.vol, f.fee, f.feeK ? t.feeK[f.feeK] : '', f.eq, f.na, f.inv, xd(f.first)])],
    { cols: [10, 7, 12, 44, 22, 26, 10, 9, 24, 9, 11, 11, 12], freeze: { r: 4 } });
  const V = [[{ v: t.xlV, s: 'title' }], [{ v: lang === 'lt' ? '1 m. grąža = vertė ÷ vertė prieš 1 m. − 1; 3 ir 5 m. – metinė: (vertė ÷ pradžios vertė)^(365,25 ÷ dienų) − 1.' : '1 y return = value ÷ value 1 y ago − 1; 3 and 5 y – annual: (value ÷ start value)^(365.25 ÷ days) − 1.', s: 'note' }], [], t.xlVH.map(h => ({ v: h, s: 'hdr' }))];
  rs.forEach(({ f }, i) => { const r = i + 5, e = at(f, f.last), row = [t.c[f.c], f.pl, f.n, xd(e.d), xv(e.v)];
    [[1, 'F', 'G', 'H'], [3, 'I', 'J', 'K'], [5, 'L', 'M', 'N']].forEach(([y, cd, cv]) => { const s = at(f, e.d - Math.round(365.25 * y));
      if (!s) { row.push(null, null, null); return; }
      row.push(xd(s.d), xv(s.v), { f: y === 1 ? `E${r}/${cv}${r}-1` : `(E${r}/${cv}${r})^(365.25/(D${r}-${cd}${r}))-1`, z: '0.00%', s: 'calc', v: y === 1 ? e.v / s.v - 1 : Math.pow(e.v / s.v, 365.25 / (e.d - s.d)) - 1 }); });
    V.push(row); });
  hmSheet(wb); rfSheet(wb); if (CR.pl === 'II') jrSheet(wb);
  XL.sheet(wb, t.xlV, V, { cols: [10, 7, 44, 12, 11, 12, 11, 10, 12, 11, 10, 12, 11, 10], freeze: { r: 4 } });
  const tmp = document.createElement('div'); tmp.innerHTML = MT[lang];
  XL.sheet(wb, t.xlM, [[{ v: t.mtT, s: 'title' }], ...[...tmp.querySelectorAll('h3, p, li')].map(n => [{ v: (n.tagName === 'LI' ? '• ' : '') + n.textContent, s: n.tagName === 'H3' ? 'b' : '' }])], { cols: [140] });
  await XL.save(wb, `${t.xlT} ${iso(TOP)}.xlsx`);
}
$('xlBtn').addEventListener('click', () => excel().catch(e => console.error(e)));

/* ---------- Reformos: Estija (2021) ir Lietuva (2026) (savininkas 2026-10-21: „kurioje šalyje pensijų reforma prarado daugiau turto ar
   dalyvių … kaip tarp šalių skyrėsi reformos sąlygos“). Duomenys – BALTIC.rf (baltic.py reform()): EE – mėnesių pabaigos iš
   pensionikeskus.ee kasdienių duomenų, LT – LB ketvirčių duomenys; 0 – paskutinis mėnuo prieš reformą. Grynasis srautas = turto
   pokytis − investicijų uždarbis (įmokos − išmokos − išėjimai). Sąlygos – iš šaltinių, nurodytų lentelėje. */
addStrings({ rf: {
  t: 'Pension reforms: Estonia and Lithuania', l: 'Estonia allowed leaving the second pillar from 1 January 2021, Lithuania from 1 January 2026. How many participants and how much of the assets left, month by month from the start of each reform, and how the conditions differed.',
  seg: { part: 'Participants', na: 'Assets', flow: 'Net outflow' }, ax: { part: '% of participants before the reform', na: '% of assets before the reform', flow: 'net flow since the reform, % of assets before' },
  x: 'Months since the reform', lt: 'Lithuania (from 2026)', ee: 'Estonia (from 2021)',
  kT: 'In numbers', kH: ['', 'Estonia', 'Lithuania'], same: m => `Estonia after the same ${m} months`,
  rows: { start: 'Leaving allowed from', base: 'Before the reform', partB: 'Participants before the reform', naB: 'Assets before the reform, € m', partN: m => `Participants after ${m} months`, partC: m => `Change in participants after ${m} months`,
    flowN: m => `Net outflow in ${m} months, € m`, flowS: m => `Net outflow in ${m} months, % of assets`, gainN: m => `Investment gain in ${m} months, € m`, naN: m => `Assets after ${m} months, € m`, now: 'Latest', partNow: 'Participants now', naNow: 'Assets now, € m' },
  says: (lm, lp, lf, ef, ep, eP, eF, em) => `In ${lm} months of the reform Lithuania’s second pillar lost ${pctPlain(-lp, 0)} of participants, and a net ${pctPlain(-lf, 0)} of its assets left the funds. In Estonia after the same ${lm} months (the first payout round was in September 2021) a net ${pctPlain(-ef, 0)} of assets had left; the participant count fell by ${pctPlain(-ep, 0)} by January 2022 (it falls with a delay). Over ${em} months of its reform Estonia lost at most ${pctPlain(-eF, 0)} of assets in net terms and now has ${pctPlain(-eP, 0)} fewer participants than before.`,
  cT: 'Conditions', cH: ['', 'Estonia', 'Lithuania'],
  cond: [
    ['Start', 'From 1 January 2021 joining and leaving the second pillar became optional for everyone (before, it was mandatory for those born in 1983 or later).', 'The reform came into force on 1 January 2026; the opt-out window runs from 1 January 2026 to 31 December 2027.'],
    ['Is it a one-off?', 'No: leaving is a permanent option, applications are taken three times a year.', 'Full exit – only during the 2026–2027 window (for those who joined before the end of 2025).'],
    ['What you get', 'All savings at once, as a lump sum.', 'Own contributions and the returns on them. Contributions paid by Sodra or the state budget go back to Sodra and become additional pension points.'],
    ['Tax', '20% income tax on early withdrawal (22% according to a later LHV page).', 'The sources do not mention income tax on exit; a 3% deduction (to Sodra) applies to the one-time 25% withdrawal, and LRT mentions it for a full exit too.'],
    ['Contributions after leaving', 'Stop; the 4% from social tax was paid out with the savings for those leaving in 2021–2022.', 'Contributions can also be paused for 12 months, any number of times, and resumed at any time.'],
    ['Coming back', 'Not before 10 years.', 'No 10-year ban stated; Sodra reports people signing new contracts after exiting.'],
    ['When the money is paid', 'About five months after the application period: applications to 31 March – paid in September 2021, later rounds in January and May.', 'Within 10 working days after the end of each quarter (April, July, October…).'],
    ['Automatic enrolment', 'Not applicable – the pillar was mandatory for the younger generation.', 'Before the reform most participants were enrolled automatically; automatic enrolment was ended.'],
    ['Officially reported', '149,260 applications in the first round, 12,236 in the second, 23,441 in the third (2021).', 'About 580,000 people (40%) withdrew all or part by April 2026; about €2.9 bn paid to those who left in full.'],
  ],
  why: 'Possible reasons why more left in Lithuania (our interpretation, not an official assessment): leaving is cheaper (Estonia charged 20% income tax and barred rejoining for 10 years); contributions paid by the state are not lost but go back to Sodra; many participants had been enrolled automatically and had small balances; and the window is limited in time, which pushes people to decide early.',
  note: 'Participants: Estonia – active investors of pillar II funds (pensionikeskus.ee, the counter falls with a delay after payouts); Lithuania – Bank of Lithuania quarterly data (they differ from Sodra and LIPFA counts). Net flow = change in assets − investment gain, so market movements are excluded; it includes regular contributions.',
  src: 'Sources', xl: 'Reforms' } }, { rf: {
  t: 'Pensijų reformos: Estija ir Lietuva', l: 'Estija leido išeiti iš II pakopos nuo 2021 m. sausio 1 d., Lietuva – nuo 2026 m. sausio 1 d. Kiek dalyvių ir turto išėjo kiekvieną mėnesį nuo reformos pradžios ir kuo skyrėsi sąlygos.',
  seg: { part: 'Dalyviai', na: 'Turtas', flow: 'Grynasis srautas' }, ax: { part: '% dalyvių prieš reformą', na: '% turto prieš reformą', flow: 'grynasis srautas nuo reformos, % turto prieš reformą' },
  x: 'Mėnesiai nuo reformos', lt: 'Lietuva (nuo 2026 m.)', ee: 'Estija (nuo 2021 m.)',
  kT: 'Skaičiais', kH: ['', 'Estija', 'Lietuva'], same: m => `Estija po tų pačių ${m} mėn.`,
  rows: { start: 'Išeiti leidžiama nuo', base: 'Prieš reformą', partB: 'Dalyvių prieš reformą', naB: 'Turtas prieš reformą, mln. €', partN: m => `Dalyvių po ${m} mėn.`, partC: m => `Dalyvių pokytis po ${m} mėn.`,
    flowN: m => `Grynasis srautas per ${m} mėn., mln. €`, flowS: m => `Grynasis srautas per ${m} mėn., % turto`, gainN: m => `Investicijų uždarbis per ${m} mėn., mln. €`, naN: m => `Turtas po ${m} mėn., mln. €`, now: 'Naujausi', partNow: 'Dalyvių dabar', naNow: 'Turtas dabar, mln. €' },
  says: (lm, lp, lf, ef, ep, eP, eF, em) => `Per ${lm} reformos mėn. Lietuvos II pakopa neteko ${pctPlain(-lp, 0)} dalyvių, o iš fondų grynai išėjo ${pctPlain(-lf, 0)} turto. Estijoje po tų pačių ${lm} mėn. (pirmosios išmokos – 2021 m. rugsėjį) grynai buvo išėję ${pctPlain(-ef, 0)} turto, o dalyvių skaičius iki 2022 m. sausio sumažėjo ${pctPlain(-ep, 0)} (jis mažėja pavėluotai). Per ${em} reformos mėn. Estija daugiausia grynai neteko ${pctPlain(-eF, 0)} turto, o dalyvių dabar ${pctPlain(-eP, 0)} mažiau nei prieš reformą.`,
  cT: 'Sąlygos', cH: ['', 'Estija', 'Lietuva'],
  cond: [
    ['Pradžia', 'Nuo 2021 m. sausio 1 d. stoti į II pakopą ir iš jos išeiti tapo savanoriška visiems (anksčiau privaloma gimusiems 1983 m. ir vėliau).', 'Reforma įsigaliojo 2026 m. sausio 1 d.; išėjimo langas – 2026 m. sausio 1 d. – 2027 m. gruodžio 31 d.'],
    ['Ar vienkartinė galimybė?', 'Ne: išeiti galima nuolat, prašymai priimami tris kartus per metus.', 'Visiškas išėjimas – tik 2026–2027 m. lange (kaupti pradėjusiems iki 2025 m. pabaigos).'],
    ['Ką gauna žmogus', 'Visas sukauptas lėšas iš karto.', 'Savo įmokas ir jų uždarbį. Sodros ar valstybės biudžeto įmokos grąžinamos Sodrai ir virsta papildomais pensijos taškais.'],
    ['Mokesčiai', '20 % pajamų mokestis išsiimant anksčiau (vėlesniame LHV puslapyje – 22 %).', 'Šaltiniai pajamų mokesčio išeinant nemini; 3 % atskaitymas (Sodrai) taikomas vienkartiniam 25 % išsiėmimui, o LRT jį mini ir visiškam išėjimui.'],
    ['Įmokos išėjus', 'Nutrūksta; 2021–2022 m. išėjusiems neišmokėtos 4 % socialinio mokesčio įmokos išmokėtos kartu su santaupomis.', 'Įmokas taip pat galima sustabdyti 12 mėn., neribotą kartų skaičių, ir bet kada atnaujinti.'],
    ['Grįžimas', 'Ne anksčiau kaip po 10 metų.', '10 metų draudimo nenurodyta; Sodra skelbia, kad dalis išėjusių sudaro naujas sutartis.'],
    ['Kada išmokama', 'Maždaug po 5 mėn. nuo prašymų laikotarpio pabaigos: prašymai iki kovo 31 d. – išmokėta 2021 m. rugsėjį, vėlesni etapai – sausį ir gegužę.', 'Per 10 darbo dienų po kiekvieno ketvirčio pabaigos (balandį, liepą, spalį…).'],
    ['Automatinis įtraukimas', 'Netaikytas – jaunesniems II pakopa buvo privaloma.', 'Iki reformos dauguma dalyvių buvo įtraukti automatiškai; automatinis įtraukimas panaikintas.'],
    ['Oficialiai skelbta', 'Pirmame etape 149 260 prašymų, antrame 12 236, trečiame 23 441 (2021 m.).', 'Iki 2026 m. balandžio apie 580 tūkst. žmonių (40 %) atsiėmė visas ar dalį lėšų; visiškai išėjusiems išmokėta apie 2,9 mlrd. €.'],
  ],
  why: 'Galimos priežastys, kodėl Lietuvoje išėjo daugiau (mūsų vertinimas, ne oficiali išvada): išeiti pigiau (Estijoje – 20 % pajamų mokestis ir 10 metų draudimas grįžti); valstybės sumokėtos įmokos neprarandamos, o grįžta į Sodrą; daug dalyvių buvo įtraukti automatiškai ir turėjo nedideles sumas; langas ribotas laike, todėl skatina apsispręsti greitai.',
  note: 'Dalyviai: Estija – aktyvūs II pakopos fondų investuotojai (pensionikeskus.ee; skaičius po išmokų mažėja pavėluotai), Lietuva – Lietuvos banko ketvirčio duomenys (skiriasi nuo Sodros ir LIPFA skaičių). Grynasis srautas = turto pokytis − investicijų uždarbis, todėl rinkos svyravimai neįskaičiuoti; į jį įeina ir įprastos įmokos.',
  src: 'Šaltiniai', xl: 'Reformos' } });
const RF_SRC = [['ERR, 2021-03-29', 'https://news.err.ee/1608159100/17-percent-of-people-apply-to-leave-second-pillar-pension-fund'], ['ERR, 2021-08-01', 'https://news.err.ee/1608294564/around-160-000-people-leave-second-pension-pillar'],
  ['ERR, 2021-12-03', 'https://news.err.ee/1608424322/more-than-23-000-people-apply-to-leave-pension-system-in-third-round'], ['LHV', 'https://www.lhv.ee/en/faq/pension'],
  ['SADM (socmin.lrv.lt), 2025-06', 'https://socmin.lrv.lt/en/news/reform-approved-second-pillar-pension-scheme-to-become-more-attractive-and-flexible'], ['LRT, 2025-06-26', 'https://www.lrt.lt/en/news-in-english/19/2598158/lithuanian-mps-approve-pension-reform-allowing-opt-outs-and-withdrawals-from-private-funds'],
  ['LRT, 2026-04-15', 'https://www.lrt.lt/en/news-in-english/19/2899157/about-40-of-lithuanians-withdraw-private-pension-savings-after-reform'], ['Artea', 'https://www.artea.lt/en/private/pension/second-pillar-pension/second-pillar-pension-reform']];
let RFK = 'part';
function rfAt(S, m) {                                   // paskutinis taškas, kurio mėnuo nuo reformos ≤ m
  let i = -1; S.o.forEach((o, j) => { if (o <= m && j >= S.base) i = j; }); return i;
}
function rfStats() {
  const R = BALTIC.rf, L = R.LT, E = R.EE, li = L.o.length - 1, lm = L.o[li], ei = rfAt(E, lm), en = E.o.length - 1;
  const pc = (S, i) => (S.part[i] / S.part[S.base] - 1) * 100, fs = (S, i) => S.flow[i] / S.na[S.base] * 100;
  return { L, E, li, lm, ei, en, pc, fs };
}
function renderRf() {
  if (!BALTIC.rf || !$('rfT')) return;
  const t = T().rf, s = rfStats(), { L, E, li, lm, ei, en, pc, fs } = s;
  $('rfT').textContent = t.t; $('rfL').textContent = t.l;
  const e13 = rfAt(E, 13);
  $('rfSay').innerHTML = `${hEsc(t.says(lm, pc(L, li), fs(L, li), fs(E, ei), pc(E, e13), pc(E, en), Math.min(...E.flow.slice(E.base)) / E.na[E.base] * 100, E.o[en]))} <button type="button" class="btn" id="rfCp">${T().copy || (lang === 'lt' ? 'Kopijuoti' : 'Copy')}</button>`;
  $('rfSeg').innerHTML = ['part', 'na', 'flow'].map(k => `<button type="button" data-k="${k}" aria-pressed="${k === RFK}">${t.seg[k]}</button>`).join('');
  rfChart($('rfCh'));
  const n0 = v => v == null ? '–' : num(v, 0), m1 = v => v == null ? '–' : num(v, 1);
  const r = (h, a, b) => `<tr><td>${hEsc(h)}</td><td class="n">${a}</td><td class="n">${b}</td></tr>`, R = t.rows;
  $('rfK').innerHTML = `<thead><tr>${t.kH.map((h, i) => `<th${i ? ' class="n"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>`
    + r(R.start, BALTIC.rf.start.EE, BALTIC.rf.start.LT) + r(R.partB + ` (${E.d[E.base]} / ${L.d[L.base]})`, n0(E.part[E.base]), n0(L.part[L.base])) + r(R.naB, m1(E.na[E.base]), m1(L.na[L.base]))
    + r(R.partN(lm), n0(E.part[ei]), n0(L.part[li])) + r(R.partC(lm), pctPlain(pc(E, ei), 1), pctPlain(pc(L, li), 1))
    + r(R.flowN(lm), m1(E.flow[ei]), m1(L.flow[li])) + r(R.flowS(lm), pctPlain(fs(E, ei), 1), pctPlain(fs(L, li), 1))
    + r(R.gainN(lm), m1(E.gain[ei]), m1(L.gain[li])) + r(R.naN(lm), m1(E.na[ei]), m1(L.na[li]))
    + r(`${R.partNow} (${E.d[en]})`, n0(E.part[en]) + ` (${pctPlain(pc(E, en), 1)})`, '') + r(`${R.naNow} (${E.d[en]})`, m1(E.na[en]), '') + '</tbody>';
  $('rfCT').textContent = t.cT; $('rfKT').textContent = t.kT;
  $('rfC').innerHTML = `<thead><tr>${t.cH.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${t.cond.map(c => `<tr><td><b>${hEsc(c[0])}</b></td><td class="nm">${hEsc(c[1])}</td><td class="nm">${hEsc(c[2])}</td></tr>`).join('')}</tbody>`;
  $('rfWhy').textContent = t.why; $('rfN').textContent = t.note;
  $('rfSrc').innerHTML = `${t.src}: ` + RF_SRC.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${hEsc(n)}</a>`).join(', ');
}
function rfChart(el) {
  const t = T().rf, R = BALTIC.rf, W = el.clientWidth || 600, H = Math.max(230, Math.min(320, W * 0.45)), m = { l: 46, r: 12, t: 12, b: 34 };
  const ser = [['EE', t.ee, PAL[0]], ['LT', t.lt, PAL[1]]].map(([c, lab, col]) => { const S = R[c];
    const pts = S.o.map((o, i) => [o, i < S.base ? null : RFK === 'part' ? (S.part[i] ? S.part[i] / S.part[S.base] * 100 : null) : RFK === 'na' ? S.na[i] / S.na[S.base] * 100 : S.flow[i] / S.na[S.base] * 100]).filter(p => p[1] != null && p[0] >= 0);
    return { lab, col, pts }; });
  const all = ser.flatMap(s => s.pts), x1 = Math.max(...all.map(p => p[0])), ys = all.map(p => p[1]);
  let lo = Math.min(...ys, RFK === 'flow' ? 0 : 50), hi = Math.max(...ys, RFK === 'flow' ? 0 : 100); const pad = (hi - lo) * 0.06; lo -= pad; hi += pad;
  const X = o => m.l + o / x1 * (W - m.l - m.r), Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${hEsc(t.ax[RFK])}">`;
  niceTicks(lo, hi).forEach(v => { s += `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--grid)" stroke-dasharray="2 3"/><text x="${m.l - 6}" y="${Y(v) + 4}" text-anchor="end" fill="var(--text-3)" font-size="11">${num(v, 0)}</text>`; });
  niceTicks(0, x1, Math.max(3, Math.floor(W / 90))).forEach(o => { s += `<text x="${X(o)}" y="${H - 18}" text-anchor="middle" fill="var(--text-3)" font-size="11">${o}</text>`; });
  s += `<text x="${(m.l + W - m.r) / 2}" y="${H - 3}" text-anchor="middle" fill="var(--text-3)" font-size="11">${t.x}</text>`;
  ser.forEach(r => { s += `<polyline fill="none" stroke="${r.col}" stroke-width="2.2" points="${r.pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ')}"/>`
    + r.pts.map(p => `<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="${r.pts.length < 20 ? 3.5 : 1.6}" fill="${r.col}"><title>${hEsc(r.lab)}, ${p[0]}: ${num(p[1], 1)} %</title></circle>`).join(''); });
  el.innerHTML = s + '</svg>' + `<div class="sel">${ser.map(r => `<span class="chip"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${r.col};margin-right:6px"></span>${hEsc(r.lab)}</span>`).join('')}</div><p class="note">${hEsc(t.ax[RFK])}</p>`;
}
document.addEventListener('click', e => {
  const b = e.target.closest('#rfSeg button'); if (b) { RFK = b.dataset.k; renderRf(); return; }
  const c = e.target.closest('#rfCp'); if (c) { const txt = $('rfSay').textContent.replace(c.textContent, '').trim() + ' ' + T().srcLine; navigator.clipboard && navigator.clipboard.writeText(txt).then(() => { const o = c.textContent; c.textContent = '✓'; setTimeout(() => { c.textContent = o; }, 1500); }); }
});
function rfSheet(wb) {                                  // Excel: abiejų šalių taškai ir pokyčiai – formulės
  if (!BALTIC.rf) return;
  const t = T().rf, L = lang === 'lt', rows = [[{ v: t.t, s: 'title' }], [{ v: t.note, s: 'note' }], [],
    (L ? ['Šalis', 'Data', 'Mėn. nuo reformos', 'Dalyviai', 'Turtas, mln. €', 'Sukauptas uždarbis, mln. €', 'Sukauptas grynasis srautas, mln. €', 'Dalyviai, % prieš reformą', 'Turtas, % prieš reformą', 'Srautas, % turto prieš reformą']
      : ['Country', 'Date', 'Months since reform', 'Participants', 'Assets, € m', 'Cumulative gain, € m', 'Cumulative net flow, € m', 'Participants, % of before', 'Assets, % of before', 'Flow, % of assets before']).map(h => ({ v: h, s: 'hdr' }))];
  ['EE', 'LT'].forEach(c => { const S = BALTIC.rf[c], b0 = rows.length + 1 + S.base;
    S.o.forEach((o, i) => { const n = rows.length + 1;
      rows.push([c, S.d[i], o, { v: S.part[i], s: 'in' }, { v: S.na[i], s: 'in' }, { v: S.gain[i], s: 'in' }, { v: S.flow[i], s: 'in' },
        i >= S.base && S.part[i] ? { f: `D${n}/D$${b0}`, v: S.part[i] / S.part[S.base], z: '0.0%' } : '', i >= S.base ? { f: `E${n}/E$${b0}`, v: S.na[i] / S.na[S.base], z: '0.0%' } : '', i >= S.base ? { f: `G${n}/E$${b0}`, v: S.flow[i] / S.na[S.base], z: '0.0%' } : '']); }); });
  XL.sheet(wb, t.xl, rows, { cols: [8, 12, 10, 12, 12, 14, 16, 14, 14, 16], freeze: { r: 4 } });
}

function render() {
  const t = T(), L = lang === 'lt';
  BXM.c = CR.c; BXM.pl = CR.pl;
  document.title = `${CR.c === 'X' ? t.bx.modes.X : `${t.c[CR.c]} · ${t.pl(CR.pl)}`} · ${t.navBaltic} · ${t.siteTitle}`;
  $('xlBtn').textContent = t.xl;
  if (CR.c === 'X') { renderX(); renderBs(); renderHm(); renderCmp(); renderRf(); } else { renderOv(); renderCr(); renderMg(); renderMt(); renderMs(); renderMv(); renderSw(); renderTop(); if (TAB_CUR === 'fl' || typeof BXFLOW !== 'undefined') renderFl(); if (CR.pl === 'II') renderJr(); }
  $('mtT').textContent = t.bx.mt; $('mtB').innerHTML = MT[lang];
  $('foot').textContent = t.srcLine;
  const ks = modeTabs();
  document.querySelectorAll('main.bx > [data-tab]').forEach(p => { if (ks.includes(p.dataset.tab)) delete p.dataset.off; });
  addSubnav(ks.map(k => ({ id: TID[k], label: t.bx.tabs[k] })));
  if (!ks.includes(TAB_CUR)) showTab(TMAP[TAB_CUR] && ks.includes(TMAP[TAB_CUR]) ? TMAP[TAB_CUR] : ks[0], false);
  else markTab();
  bxBar();
}
function fromHash() {                                   // #c=LV&pl=III&tab=rs (šalies juosta, kitų puslapių nuorodos), #bq= – paieška
  let q; try { q = new URLSearchParams(location.hash.slice(1)); } catch (e) { return; }
  const c = q.get('c'), pl = q.get('pl'), k = q.get('tab'), bq = q.get('bq');
  if (['LT', 'LV', 'EE', 'X'].includes(c)) CR.c = c;
  else if (TABS.X.includes(k) && k !== 'cmp') CR.c = 'X';
  else if (k === 'fd' && CR.c === 'X') CR.c = 'LT';
  if (pl === 'II' || pl === 'III') CR.pl = pl;
  if (bq) { const f = BX.find(x => x.n === bq && (!c || x.c === c)); if (f) { CR.c = f.c; CR.pl = f.pl; if (f.closed) { CR.v = 'dat'; CR.closed = true; } HL = f.id; } }
  saveC();
  return k === 'fd' || bq ? 'cr' : k;
}
renderHeader('baltic', render);
{ const k = fromHash(); render(); if (k && modeTabs().includes(k)) showTab(k, false); if (TAB_CUR === 'fl') renderFl(); }
addEventListener('hashchange', () => { const k = fromHash(); render(); if (k && modeTabs().includes(k)) showTab(k, true); });
addEventListener('resize', () => { clearTimeout(render.r); render.r = setTimeout(() => { if (CR.c === 'X') { renderCmp(); renderRf(); } else { renderOv(); if (TAB_CUR === 'mg') renderMs(); if (TAB_CUR === 'fl') renderFl(); if (CR.pl === 'II' && TAB_CUR === 'jr') renderJr(); } }, 200); });
