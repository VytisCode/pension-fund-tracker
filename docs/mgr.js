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
  hAum: 'Net assets', mAum: 'Sum of the manager’s funds, € m. Points – only days with data: daily since daily assets are collected, before that – Bank of Lithuania quarter-end portfolio totals; periods longer than ~13 months – last day of each month.',
  hAl: q => `Portfolio by asset class (look-through), ${q}`, hTop: q => `10 largest holdings, ${q}`, mPf: n => `Bank of Lithuania portfolio reports; ${n}.`, pfAll: 'all pillar II funds of the manager', pfOne: 'this fund',
  thPos: 'Holding', thType: 'Type', thW: 'Share, %',
  types: { e: 'Shares', b: 'Bonds', f: 'Funds & ETFs', c: 'Cash & deposits', d: 'Derivatives' }, cls: { eq: 'Equities (incl. equity funds)', bd: 'Bonds (incl. bond funds)', cash: 'Cash and money market', alt: 'Alternatives', der: 'Derivatives', oth: 'Other' },
  hPeers: 'Compared with the group', mPeers: 'Each period ends on the group’s common latest day.', hChart: '3-year return compared with the group', hRisk: 'Risk',
  rVol1: 'Volatility, 1 year', rVol3: 'Volatility, 3 years', rDd3: 'Maximum fall, 3 years', rRisky: 'Risky assets (LB)', rNote: 'Volatility – annualised standard deviation of daily changes; maximum fall – the largest drop from a peak.',
  dEnd: 'Data as of:', selX: 'Add period:', xNone: 'none', dFrom: 'From', reset: 'Latest', yeL: 'Year end', qeL: 'Quarter end', shownL: p => `Shown: ${p}`,
  aV: 'Show:', vEur: '€ m', vShare: 'Market share, %', vChg: 'Change over quarter, %', vCum: 'Change since period start, %', lgTip: 'Click to hide or show this line; double-click to show only it', lgAll: 'Show all', sMII: 'Whole market – pillar II', sMIII: 'Whole market – pillar III', sumH: 'Over the period:', sBoth: 'Pillar II and III', sFII: 'Each pillar II fund', sFIII: 'Each pillar III fund', thDate: 'Date', thSum: 'Total',
  mShare: 'Market share – of the assets of all managers’ funds of the same pillar on that day.', mChg: 'The change includes contributions, payouts and returns.', mCum: 'Change of net assets from the first day of the selected period (e.g. YTD – from 31 December); includes contributions, payouts and returns.',
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
  hAum: 'Grynieji aktyvai', mAum: 'Valdytojo fondų suma, mln. €. Taškai – tik dienos, kurioms yra duomenų: nuo tada, kai renkami kasdieniai aktyvai, – kasdien, anksčiau – Lietuvos banko ketvirčio pabaigos portfelių sumos; ilgesniems nei ~13 mėn. laikotarpiams – kiekvieno mėnesio paskutinė diena.',
  hAl: q => `Portfelis pagal turto klasę (pro fondus), ${q}`, hTop: q => `10 didžiausių pozicijų, ${q}`, mPf: n => `Lietuvos banko portfelių ataskaitos; ${n}.`, pfAll: 'visi valdytojo II pakopos fondai', pfOne: 'šis fondas',
  thPos: 'Pozicija', thType: 'Rūšis', thW: 'Dalis, %',
  types: { e: 'Akcijos', b: 'Obligacijos', f: 'Fondai ir ETF', c: 'Pinigai ir indėliai', d: 'Išvestinės' }, cls: { eq: 'Akcijos (su akcijų fondais)', bd: 'Obligacijos (su obligacijų fondais)', cash: 'Pinigai ir pinigų rinka', alt: 'Alternatyvios', der: 'Išvestinės', oth: 'Kita' },
  hPeers: 'Palyginimas su grupe', mPeers: 'Kiekvienas laikotarpis baigiasi bendra naujausia grupės diena.', hChart: '3 metų grąža, palyginti su grupe', hRisk: 'Rizika',
  rVol1: 'Svyravimas, 1 metai', rVol3: 'Svyravimas, 3 metai', rDd3: 'Didžiausias kritimas, 3 metai', rRisky: 'Rizikingas turtas (LB)', rNote: 'Svyravimas – metinis dienos pokyčių standartinis nuokrypis; didžiausias kritimas – didžiausias sumažėjimas nuo piko.',
  dEnd: 'Duomenys iki:', selX: 'Pridėti laikotarpį:', xNone: 'nepridėti', dFrom: 'Nuo', reset: 'Naujausi', yeL: 'Metų pabaiga', qeL: 'Ketvirčio pabaiga', shownL: p => `Rodoma: ${p}`,
  aV: 'Rodyti:', vEur: 'mln. €', vShare: 'Rinkos dalis, %', vChg: 'Pokytis per ketvirtį, %', vCum: 'Pokytis nuo laikotarpio pradžios, %', lgTip: 'Paspausk, kad paslėptum ar parodytum šią liniją; paspausk dukart, kad liktų tik ji', lgAll: 'Rodyti visas', sMII: 'Visa rinka – II pakopa', sMIII: 'Visa rinka – III pakopa', sumH: 'Per laikotarpį:', sBoth: 'II ir III pakopa', sFII: 'Kiekvienas II pakopos fondas', sFIII: 'Kiekvienas III pakopos fondas', thDate: 'Data', thSum: 'Iš viso',
  mShare: 'Rinkos dalis – nuo visų valdytojų tos pačios pakopos fondų turto tą dieną.', mChg: 'Pokytis apima įmokas, išmokas ir grąžą.', mCum: 'Grynųjų aktyvų pokytis nuo pasirinkto laikotarpio pirmos dienos (pvz. „Šie metai“ – nuo gruodžio 31 d.); apima įmokas, išmokas ir grąžą.',
  noPf: 'Šio fondo portfelio duomenų nėra.', foot: 'Grąža – vieneto vertės pokytis (mokesčiai jau atskaityti), ne metinė. Fondai lyginami tik savo grupėje. Informacinė medžiaga, ne investavimo rekomendacija.',
});
addStrings3({ selP: "Pārvaldītājs:", selF: "Skats:", allF: "Pārvaldītāja kopsavilkums (visi fondi)", optII: "II līmenis", optIII: "III līmenis", a4: "🖶 Vienas lapas A4 kopsavilkums", kII: "II līmeņa aktīvi", kIII: "III līmeņa aktīvi", kShare: "Daļa II līmeņa tirgū", kUv: "Daļas vērtība", kAs: "Neto aktīvi", kFeeF: "Pārvaldīšanas komisija", kPlace: "Vieta grupā šogad", h3: "III līmeņa fondi: ienesīgums un vieta kategorijā", thFee: "Komisija, %", thAum: "Aktīvi, milj. €", thDd: "Maks. kritums, %", thCat: "Kategorija", thMed: "Grupas mediāna", thDiff: "Starpība, pp", thPlace: "Vieta", hAum: "Neto aktīvi", thPos: "Pozīcija", thType: "Veids", thW: "Daļa, %", hPeers: "Salīdzinājumā ar grupu", mPeers: "Katrs periods beidzas grupas kopējā jaunākajā dienā.", hChart: "3 gadu ienesīgums salīdzinājumā ar grupu", rVol1: "Svārstīgums, 1 gads", rVol3: "Svārstīgums, 3 gadi", rDd3: "Maksimālais kritums, 3 gadi", dEnd: "Dati uz:", selX: "Pievienot periodu:", xNone: "nav", dFrom: "No", reset: "Jaunākie", yeL: "Gada beigas", qeL: "Ceturkšņa beigas", aV: "Rādīt:", vEur: "milj. €", vShare: "Tirgus daļa, %", vChg: "Izmaiņa ceturksnī, %", vCum: "Izmaiņa kopš perioda sākuma, %", lgTip: "Noklikšķiniet, lai paslēptu vai parādītu šo līniju; dubultklikšķis – rādīt tikai to", lgAll: "Rādīt visu", sMII: "Viss tirgus – II līmenis", sMIII: "Viss tirgus – III līmenis", sumH: "Periodā:", sBoth: "II un III līmenis", sFII: "Katrs II līmeņa fonds", sFIII: "Katrs III līmeņa fonds", thSum: "Kopā", mChg: "Izmaiņa ietver iemaksas, izmaksas un ienesīgumu.", hYears: "Kalendārie gadi salīdzinājumā ar grupu", thYr: "Gads", ann: "gadā" },
  { selP: "Fondivalitseja:", selF: "Vaade:", allF: "Fondivalitseja kokkuvõte (kõik fondid)", optII: "II sammas", optIII: "III sammas", a4: "🖶 Üheleheküljeline A4 kokkuvõte", kII: "II samba varad", kIII: "III samba varad", kShare: "Osa II samba turust", kUv: "Osaku väärtus", kAs: "Puhasvara", kFeeF: "Valitsemistasu", kPlace: "Koht grupis tänavu", h3: "III samba fondid: tootlus ja koht kategoorias", thFee: "Tasu, %", thAum: "Varad, mln €", thDd: "Maks. langus, %", thCat: "Kategooria", thMed: "Grupi mediaan", thDiff: "Vahe, pp", thPlace: "Koht", hAum: "Puhasvara", thPos: "Positsioon", thType: "Tüüp", thW: "Osakaal, %", hPeers: "Võrdlus grupiga", mPeers: "Iga periood lõpeb grupi ühisel viimasel päeval.", hChart: "3 aasta tootlus võrreldes grupiga", rVol1: "Volatiilsus, 1 aasta", rVol3: "Volatiilsus, 3 aastat", rDd3: "Suurim langus, 3 aastat", dEnd: "Andmed seisuga:", selX: "Lisa periood:", xNone: "puudub", dFrom: "Alates", reset: "Viimased", yeL: "Aasta lõpp", qeL: "Kvartali lõpp", aV: "Näita:", vEur: "mln €", vShare: "Turuosa, %", vChg: "Muutus kvartalis, %", vCum: "Muutus perioodi algusest, %", lgTip: "Klõpsa joone peitmiseks või näitamiseks; topeltklõps – näita ainult seda", lgAll: "Näita kõiki", sMII: "Kogu turg – II sammas", sMIII: "Kogu turg – III sammas", sumH: "Perioodil:", sBoth: "II ja III sammas", sFII: "Iga II samba fond", sFIII: "Iga III samba fond", thSum: "Kokku", mChg: "Muutus sisaldab sissemakseid, väljamakseid ja tootlust.", hYears: "Kalendriaastad võrreldes grupiga", thYr: "Aasta", ann: "aastas" });   // 4 etapas: LV/ET antraštės ir stulpeliai (ilgesni tekstai – kol kas angliškai)
/* LV/EE kopija (manager_lv.html, manager_ee.html; PERTVARKA-SALYS.md 3 etapas): DATA.providers – fondai (grupėje gali būti keli to paties
   valdytojo fondai), valdytojas – p.m. II pakopos fondo raktas – fondo id (Lietuvoje – grupės id); AUM / REP / TOPS – data_mgr_{c}.js
   (build_site.ctry_mgr_data). Valdytojo grąža grupėje – jo fondų vidurkis, svertinis turtu. */
const CTRY = typeof CTRY_COPY !== 'undefined', MOF = Object.fromEntries(DATA.providers.map(p => [p.id, p.m || p.id]));
const mLab = id => CTRY ? id : labelOf(id), mCol = id => CTRY ? colorOf((DATA.providers.find(p => MOF[p.id] === id) || {}).id) : colorOf(id);
const own = (f, p) => CTRY ? MOF[f.provider] === p : f.provider === p;
const nameOf = fid => (DATA.groups.flatMap(g => g.funds).find(f => f.provider === fid) || {}).name;
if (CTRY) addStrings({ mAum: 'Sum of the manager’s funds at each month end, € m (daily net assets from the source).', kYtd: 'This year, average fund', h2: 'Pillar II funds: return and place in group', mPf2: q => `Latest report (${q}).`, hTop2: '10 largest holdings',
  m2: d => `Unit value change to ${d}, not annualised; next to it – place among all funds of the group (1 = best). Volatility and maximum fall – last 3 years.` },
  { mAum: 'Valdytojo fondų suma kiekvieno mėnesio pabaigoje, mln. € (šaltinio kasdieniai fondų grynieji aktyvai).', kYtd: 'Šie metai, vidutinis fondas', h2: 'II pakopos fondai: grąža ir vieta grupėje', mPf2: q => `Naujausia ataskaita (${q}).`, hTop2: '10 didžiausių investicijų',
  m2: d => `Vieneto vertės pokytis iki ${d}, ne metinis; šalia – vieta tarp visų grupės fondų (1 – geriausia). Svyravimas ir didžiausias kritimas – paskutinių 3 metų.` });
const $ = id => document.getElementById(id);
const PROVS = CTRY ? [...new Set(DATA.providers.map(p => MOF[p.id]))] : DATA.providers.map(p => p.id);
const kII = x => CTRY ? x.f.provider : x.g.id;          // II pakopos fondo raktas (ST.f = 'II:' + raktas)
function mgrRet(g, per, q) {                           // valdytojo grąža grupėje (LV/EE – jo fondų vidurkis, svertinis turtu)
  const r = peerRets(g, per).rets; if (!CTRY) return r[q];
  let s = 0, w = 0, u = 0, n = 0; g.funds.forEach(f => { const v = r[f.provider]; if (v == null || !own(f, q)) return; const a = f.assets > 0 ? f.assets : 0; s += v * a; w += a; u += v; n++; });
  return n ? (w ? s / w : u / n) : null;
}
const PERS = ['ytd', '1y', '3y', '5y'];
const LC = DATA.groups.filter(g => g.id !== 'turto');
const median = xs => { const a = xs.filter(x => x != null).sort((x, y) => x - y); if (!a.length) return null; const k = a.length >> 1; return a.length % 2 ? a[k] : (a[k - 1] + a[k]) / 2; };
const mean = xs => { const a = xs.filter(x => x != null); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
const fmt = (x, p = 2) => x == null ? '–' : num(x, p);
const STK = CTRY ? 'mgrState' + CTRY_COPY : 'mgrState';
const ST = { p: CTRY ? PROVS[0] : 'SEB', f: '', e: 0, x: '', a: 0, av: 'eur', as: 'both' };   // e – „duomenys iki“ (0 – naujausi), x – papildomas laikotarpis, a – jo pradžia, av/as – turto vaizdas
try { const s = JSON.parse(localStorage.getItem(STK) || '{}'); if (PROVS.includes(s.p)) { ST.p = s.p; ST.f = s.f || ''; } ['x', 'av', 'as'].forEach(k => { if (typeof s[k] === 'string') ST[k] = s[k]; }); if (s.a > 0) ST.a = s.a; } catch (e) {}
const LATEST = Math.max(...DATA.groups.flatMap(g => g.funds.map(f => f.d[f.d.length - 1]))), EARLIEST = Math.min(...LC.flatMap(g => g.funds.map(f => f.d[0])));
const asOf = () => ST.e && ST.e < LATEST ? ST.e : 0;
const perLabel = x => x === 'custom' ? `${iso(ST.a)} –` : periodLabel(x);
const pers = () => ST.x ? [ST.x, ...PERS] : PERS;
(() => { const h = decodeURIComponent(location.hash.slice(1)); if (!h) return; const k = h.indexOf('/'), p = k < 0 ? h : h.slice(0, k), f = k < 0 ? '' : h.slice(k + 1); if (PROVS.includes(p)) { ST.p = p; ST.f = f || ''; } })();
function save() { try { localStorage.setItem(STK, JSON.stringify(ST)); } catch (e) {} history.replaceState(null, '', '#' + encodeURIComponent(ST.p) + (ST.f ? '/' + encodeURIComponent(ST.f) : '')); }

/* ---------- II pakopa: grąža, vieta ir rizika iš kasdienių verčių (data.js) ---------- */
const PEER = new Map();                 // grupė+laikotarpis -> {end, rets: {provider: grąža}}
function peerRets(g, per) {
  const cut = asOf(), key = [g.id, per, cut, ST.a].join('|'); if (PEER.has(key)) return PEER.get(key);
  let { end, overallLast } = groupEnd(g); if (cut && cut < end) end = cut;
  const r = per === 'custom' ? { anchor: ST.a, end } : presetRangeF(per, end, g.funds, maxAnchorOf(g.funds)), rets = {};
  const live = f => { if (!cut) return f.d[f.d.length - 1] >= overallLast - 5; const i = lastOnOrBefore(f, r.end); return i >= 0 && f.d[i] >= r.end - 5; };
  g.funds.forEach(f => { const s = live(f) && r.anchor < r.end ? seriesOf(f, r.anchor, r.end) : null; rets[f.provider] = s ? s.ret : null; });
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
const fundsII = p => DATA.groups.flatMap(g => g.funds.filter(f => own(f, p)).map(f => ({ g, f }))).reverse();   // jauniausi pirmi
const repOf = (pl, p, gOrN) => REP.funds.find(x => x.pl === pl && x.p === p && (pl === 'II' ? (CTRY ? x.n === nameOf(gOrN) : x.g === gOrN) : x.n === gOrN));

/* ---------- III pakopa: mėnesio pabaigos vertės (data_rep.js) ---------- */
const fundsIII = p => REP.funds.filter(x => x.pl === 'III' && x.p === p).sort((a, b) => ['bond', 'mixed', 'equity'].indexOf(a.g) - ['bond', 'mixed', 'equity'].indexOf(b.g) || a.n.localeCompare(b.n));
const M3E = () => { const fs = REP.funds.filter(x => x.pl === 'III'), cut = asOf(); for (let i = REP.months.length - 1; i >= 0; i--) if ((!cut || REP.months[i] <= cut + 3) && fs.filter(f => f.m[i] != null).length >= fs.length * 0.8) return i; return REP.months.length - 1; };
const mIdx = t => REP.months.findIndex(d => Math.abs(d - t) <= 3);
function rangeIII(per) {                 // mėnesio pabaigų indeksai [pradžia, pabaiga] arba null
  let j = M3E(), t, m; const e = REP.months[j], U = (y, mo) => Math.round(Date.UTC(y, mo, 0) / DAY);
  if ((m = /^q:(\d{4})-([1-4])$/.exec(per))) { t = U(+m[1], (+m[2] - 1) * 3); const k = mIdx(U(+m[1], +m[2] * 3)); if (k < 0 || k > j) return null; j = k; }
  else if ((m = /^y:(\d{4})$/.exec(per))) { t = U(+m[1] - 1, 12); const k = mIdx(U(+m[1], 12)); if (k < 0 || k > j) return null; j = k; }
  else if (per === 'custom') { let k = -1; REP.months.forEach((d, i) => { if (d <= ST.a + 3) k = i; }); return k < 0 || k >= j ? null : [k, j]; }
  else t = per === 'ytd' ? U(new Date(e * DAY).getUTCFullYear() - 1, 12) : shiftMonths(e, { '1m': 1, '3m': 3, '6m': 6, '1y': 12, '3y': 36, '5y': 60 }[per]);
  const i0 = mIdx(t); return i0 < 0 ? null : [i0, j];
}
function retIII(f, per) { const r = rangeIII(per); return !r || f.m[r[0]] == null || f.m[r[1]] == null ? null : (f.m[r[1]] / f.m[r[0]] - 1) * 100; }
const peersIII = (f, per) => Object.fromEntries(REP.funds.filter(x => x.pl === 'III' && x.g === f.g).map(x => [x.n, retIII(x, per)]));

/* ---------- turtas ketvirčių pabaigoje (data_aum.js): mln. €, rinkos dalis arba ketvirčio pokytis ---------- */
const PAL = ['#1f77b4', '#d95f02', '#2ca02c', '#9467bd', '#e7298a', '#8c564b', '#17becf', '#bcbd22', '#7f7f7f', '#e6ab02', '#1b9e77', '#d62728'];
const aumFs = (p, pl, g, n) => AUM.funds.filter(f => f.pl === pl && (!p || f.p === p) && (!g || f.g === g) && (!n || f.n === n));
const sumAtN = (fs, d, tol = 10) => { let s = 0, ok = 0; fs.forEach(f => { const i = lastOnOrBefore(f, d); if (i >= 0 && d - f.d[i] <= tol) { s += f.a[i]; ok++; } }); return { s: ok ? s : null, n: ok }; };
const sumAt = (fs, d, tol) => sumAtN(fs, d, tol).s;   // mln. €
function qEnds(first, last) {
  const ends = [];
  for (let y = new Date(first * DAY).getUTCFullYear(); ; y++) { let stop = false; for (const m of [3, 6, 9, 12]) { const d = Math.round(Date.UTC(y, m, 0) / DAY); if (d > last) { stop = true; break; } if (d >= first) ends.push(d); } if (stop) break; }
  if (ends[ends.length - 1] !== last) ends.push(last);
  return ends;
}
const assetsII = (q, gid) => { const cut = asOf();
  if (CTRY) { if (cut) return sumAt(aumFs(q, 'II', null, nameOf(gid)), cut, 40); const f = DATA.groups.flatMap(g => g.funds).find(x => x.provider === gid); return f && f.assets ? f.assets / 1e6 : null; }
  if (cut) return sumAt(aumFs(q, 'II', gid), cut, 92); const f = DATA.groups.find(g => g.id === gid).funds.find(x => x.provider === q); return f && f.assets ? f.assets / 1e6 : null; };
const assetsIII = f => asOf() ? sumAt(aumFs(f.p, 'III', null, f.n), asOf(), 92) : f.aum ? f.aum / 1e6 : null;
function aumLines() {                    // diagramos eilutės pagal pasirinkimą: [{l, c, dash, pl, fs}]
  const t = T(), p = ST.p;
  if (ST.f) { const k = ST.f.indexOf(':'), pl = ST.f.slice(0, k), key = ST.f.slice(k + 1); return [{ l: $('selF').selectedOptions[0].textContent, c: 'var(--mc)', pl, fs: pl === 'II' ? (CTRY ? aumFs(p, 'II', null, nameOf(key)) : aumFs(p, 'II', key)) : aumFs(p, 'III', null, key) }]; }
  if (ST.as === 'mII') return [{ l: t.sMII, c: 'var(--mc)', pl: 'II', fs: aumFs(null, 'II') }];
  if (ST.as === 'mIII') return [{ l: t.sMIII, c: 'var(--mc)', pl: 'III', fs: aumFs(null, 'III') }];
  if (ST.as === 'II') return [{ l: t.optII, c: 'var(--mc)', pl: 'II', fs: aumFs(p, 'II') }];
  if (ST.as === 'III') return [{ l: t.optIII, c: 'var(--mc)', pl: 'III', fs: aumFs(p, 'III') }];
  if (ST.as === 'fII') return fundsII(p).map(({ g, f }, i) => ({ l: CTRY ? f.name : groupLabel(g), c: PAL[i % PAL.length], pl: 'II', fs: CTRY ? aumFs(p, 'II', null, f.name) : aumFs(p, 'II', g.id) }));
  if (ST.as === 'fIII') return fundsIII(p).map((f, i) => ({ l: f.n, c: PAL[i % PAL.length], pl: 'III', fs: aumFs(p, 'III', null, f.n) }));
  return [{ l: t.optII, c: 'var(--mc)', pl: 'II', fs: aumFs(p, 'II'), start: 1 }, { l: t.optIII, c: 'var(--mc)', dash: 1, pl: 'III', fs: aumFs(p, 'III') }];   // nuo II pakopos pradžios
}
function aumData() {
  const L = aumLines().filter(x => x.fs.length); if (!L.length) return null;
  const dataLast = Math.min(asOf() || Infinity, Math.max(...L.flatMap(x => x.fs.map(f => f.d[f.d.length - 1]))));
  const s0 = L.find(x => x.start), first = Math.min(...(s0 ? [s0] : L).flatMap(x => x.fs.map(f => f.d[0])));
  /* laikotarpis (savininkas 2026-10-16): mygtukai, savos datos „Nuo–Iki“ arba ketvirtis; taškai – tik dienos, kurioms yra duomenų:
     iki ~13 mėn. – visos tokios dienos (nuo 2026 m. kasdien), ilgesniam – kiekvieno mėnesio paskutinė; „pokytis“ – ketvirčių pabaigos */
  const custom = ST.ar === 'custom' && ST.af && ST.at;
  const last = custom ? Math.min(ST.at, dataLast) : dataLast;
  const yrs = { all: 0, '5y': 5, '3y': 3, '1y': 1 }[ST.ar || 'all'];
  const from = custom ? Math.max(ST.af, first) : ST.ar === 'ytd' ? Math.round(Date.UTC(new Date(last * DAY).getUTCFullYear() - 1, 11, 31) / DAY) : yrs ? Math.max(first, shiftMonths(last, 12 * yrs)) : first;
  const days = [...new Set(L.flatMap(x => x.fs.flatMap(f => f.d)))].sort((a, b) => a - b);
  let ends;
  if (ST.av === 'chg') ends = qEnds(first, last).filter(d => d >= from - 1);
  else {
    const inR = days.filter(d => d > from && d <= last), base = days.filter(d => d <= from).pop();
    if (last - from <= 400) ends = inR; else { const mm = new Map(); inR.forEach(d => mm.set(iso(d).slice(0, 7), d)); ends = [...mm.values()]; }
    if (base != null) ends.unshift(base);
  }
  const tot = {}, NF = {}, fullN = pl => NF[pl] ??= sumAtN(aumFs(null, pl), last).n;
  /* suma tik tada, kai žinomas kiekvieno tuo metu veikusio fondo turtas (savininkas 2026-10-16: III pakopos YTD %) – kitaip
     dalis fondų (pvz. kurių turtas skelbiamas tik ketvirčio pabaigoje) iškristų ir suma klaidingai „kristų“ */
  const LMAX = Math.max(...AUM.funds.map(f => f.d[f.d.length - 1])), lastD = f => f.d[f.d.length - 1];
  const full = (fs, d) => { const r = sumAtN(fs, d), alive = fs.filter(f => f.d[0] <= d + 92 && (lastD(f) >= d || lastD(f) >= LMAX - 120)).length; return r.n >= alive ? r.s : null; };
  const val = (x, d) => { const v0 = full(x.fs, d), v = v0 > 0.05 ? v0 : null; if (v == null || ST.av !== 'share') return v; const k = x.pl + d; if (!(k in tot)) { const r = sumAtN(aumFs(null, x.pl), d); tot[k] = r.n >= 0.8 * fullN(x.pl) ? r.s : null; } return tot[k] ? v / tot[k] * 100 : null; };   // rinkos dalis – tik kai žinomas beveik viso rinkos turtas
  L.forEach(x => { const raw = ends.map(d => val(x, d)); x.raw = raw; const b0 = raw.find(v => v != null); x.vals = ST.av === 'chg' ? raw.map((v, i) => i && v != null && raw[i - 1] ? (v / raw[i - 1] - 1) * 100 : null) : ST.av === 'cum' ? raw.map(v => v != null && b0 ? (v / b0 - 1) * 100 : null) : raw;
    const ie = ends.map((d, i) => i).filter(i => full(x.fs, ends[i]) > 0.05); x.e0 = ie.length ? [ends[ie[0]], full(x.fs, ends[ie[0]])] : null; if (x.e0 && !(x.e0[1] > 0.05)) x.e0 = null; x.e1 = ie.length ? [ends[ie[ie.length - 1]], full(x.fs, ends[ie[ie.length - 1]])] : null; x.miss = x.e1 && x.e1[0] < last - 10 ? [...new Set(x.fs.filter(f => lastD(f) < last - 10 && lastD(f) >= LMAX - 120).map(f => (DATA.providers.find(q => q.id === f.p) || { label: f.p }).label))] : []; x.pts = ends.map((d, i) => x.vals[i] == null ? null : [d, x.vals[i]]).filter(Boolean); });
  return { L, ends };
}
function aumQuarters() {                  // [pradžia (ankstesnio ketvirčio pabaiga), pabaiga, pavadinimas] – naujausi pirmi
  const out = [], last = Math.min(asOf() || LATEST, LATEST);
  for (let y = new Date(last * DAY).getUTCFullYear(); y >= 2019; y--) for (const q of [4, 3, 2, 1]) {
    const e = Math.round(Date.UTC(y, q * 3, 0) / DAY), s = Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY);
    if (s >= last) continue; out.push([s, Math.min(e, last), lang === 'lt' ? `${y} m. ${['I', 'II', 'III', 'IV'][q - 1]} ketv.${e > last ? ' (iki šiol)' : ''}` : `Q${q} ${y}${e > last ? ' (to date)' : ''}`]);
  }
  return out;
}
function aumHTML() {
  const t = T(), opt = (id, xs, v) => `<select id="${id}">${xs.map(([k, l]) => `<option value="${k}"${k === v ? ' selected' : ''}>${l}</option>`).join('')}</select>`;
  const sc = ST.f ? '' : opt('aS', [['both', t.sBoth], ['II', t.optII], ['III', t.optIII], ['fII', t.sFII], ['fIII', t.sFIII], ['mII', t.sMII], ['mIII', t.sMIII]], ST.as);
  const L = lang === 'lt', ar = ST.ar || 'all', rb = [['ytd', T().periods.ytd], ['1y', T().periods['1y']], ['3y', T().periods['3y']], ['5y', T().periods['5y']], ['all', L ? 'Visa istorija' : 'All']];
  const seg = `<div class="seg aseg" id="aR" role="group" aria-label="${L ? 'Laikotarpis' : 'Period'}">${rb.map(([k, l]) => `<button type="button" data-k="${k}" aria-pressed="${k === ar}">${l}</button>`).join('')}</div>`
    + `<select id="aQ" aria-label="${L ? 'Ketvirtis' : 'Quarter'}"><option value="">${L ? 'Ketvirtis' : 'Quarter'} ▾</option>${aumQuarters().map(([a, b, l]) => `<option value="${a}:${b}"${ar === 'custom' && ST.af === a && ST.at === b ? ' selected' : ''}>${l}</option>`).join('')}</select>`
    + `<label class="field">${L ? 'Nuo' : 'From'} <input type="date" id="aF" value="${ar === 'custom' && ST.af ? iso(ST.af) : ''}"></label><label class="field">${L ? 'Iki' : 'To'} <input type="date" id="aT" value="${ar === 'custom' && ST.at ? iso(ST.at) : ''}"></label>`;
  /* lentelė paslėpta (savininkas 2026-10-16) – jos skaičiai patenka į diagramos Excel failą */
  return `<section class="card chart-card" data-src="aum"><h2>${t.hAum}</h2><div class="meta" id="aumM"></div><div class="pick apick">${sc}${opt('aV', [['eur', t.vEur], ['share', t.vShare], ['cum', t.vCum], ['chg', t.vChg]], ST.av)}${seg}</div>
    <div class="aumsum" id="aumS"></div><div class="mchart" id="aumC"></div><div class="lgd" id="aumL"></div><table class="mt" id="aumT" hidden></table></section>`;
}
function drawAum() {
  const t = T(), el = $('aumC'); if (!el) return;
  $('aumM').textContent = t.mAum + (ST.av === 'share' ? ' ' + t.mShare : ST.av === 'chg' ? ' ' + t.mChg : ST.av === 'cum' ? ' ' + t.mCum : '');
  const D = aumData();
  if (!D) { el.innerHTML = `<p class="na">${t.noData}</p>`; $('aumT').innerHTML = $('aumL').innerHTML = ''; return; }
  /* diagrama kaip „Fondų palyginimas“ (savininkas 2026-10-16): reikšmės užvedus pelę, žymos dešinėje, linijas galima paslėpti;
     mln. € ir rinkos dalies ašis neprivalo apimti nulio – kitaip linijos atrodo plokščios */
  D.L.forEach((x, i) => { x.key = 'a' + i; });
  const off = (ST.aoff || []).filter(l => D.L.some(x => x.l === l)), shown = D.L.filter(x => !off.includes(x.l) && x.pts.length > 1), U0 = lang === 'lt' ? 'mln. €' : '€ m';
  const fmtV = ST.av === 'eur' ? v => fmt(v, 1) + ' ' + U0 : ST.av === 'share' ? v => fmt(v, 2) + ' %' : v => pct(v);
  const ser = (shown.length ? shown : D.L.filter(x => x.pts.length > 1)).map(x => ({ provider: x.key, label: x.l, color: x.c, dash: x.dash ? '5 4' : null, points: x.pts }));
  el.innerHTML = '';
  if (!ser.length) el.innerHTML = `<p class="na">${t.noData}</p>`;
  else { const x0 = Math.min(...ser.map(r => r.points[0][0])), x1 = Math.max(...ser.map(r => r.points[r.points.length - 1][0]));
    const paint = mr => drawLineChart(el, ser, x0, x1, { fmt: fmtV, axisUnit: ST.av === 'eur' ? '' : '%', zero: ST.av === 'eur' || ST.av === 'share' ? false : true, mr, height: 300 });
    drawAum.hc = drawAum.hc && drawAum.hc.el === el ? drawAum.hc : Object.assign(hoverCompress(el, mr => drawAum.paint(mr)), { el });
    drawAum.paint = paint; paint(drawAum.hc.mr); }
  const U = lang === 'lt' ? 'mln. €' : '€ m';
  $('aumS').innerHTML = `<b>${t.sumH}</b> ` + D.L.filter(x => x.e0 && x.e1 && x.e0[1]).map(x => { const ch = x.e1[1] - x.e0[1], pc = (x.e1[1] / x.e0[1] - 1) * 100, y19 = CTRY ? x.e0[1] < 0.05 * x.e1[1] : x.e0[0] < Math.round(Date.UTC(2019, 6, 1) / DAY);   // 2019 m. I pusm. gyvenimo ciklo fondai tik kaupė turtą iš senų fondų – % nuo tada neinformatyvus
    return `<span>${D.L.length > 1 ? hEsc(x.l) + ': ' : ''}${fmt(x.e0[1], 1)} → ${fmt(x.e1[1], 1)} ${U} ${y19 && CTRY ? `<small>(${lang === 'lt' ? '% neskaičiuojamas – pradžioje turtas buvo labai mažas' : '% not shown – assets at the start were very small'})</small>` : y19 ? `<small>(${lang === 'lt' ? '% nuo 2019 m. pradžios neskaičiuojamas – tada fondai tik pradėjo veikti ir perėmė senų fondų turtą' : '% from early 2019 not shown – funds were just starting and taking over old funds’ assets'})</small>` : `<b class="${pc >= 0 ? 'pos' : 'neg'}">${pct(pc)}</b>`} (${ch >= 0 ? '+' : '−'}${fmt(Math.abs(ch), 1)} ${U}) <small>${iso(x.e0[0])} – ${iso(x.e1[0])}${x.miss.length ? (lang === 'lt' ? ` (vėlesnių duomenų dar nėra: ${x.miss.join(', ')})` : ` (no later data yet: ${x.miss.join(', ')})`) : ''}</small></span>`; }).join(' · ');
  const lv = x => x.pts.length ? fmtV(x.pts[x.pts.length - 1][1]) : '–';
  $('aumL').innerHTML = D.L.length > 1 ? D.L.map(x => `<button type="button" class="chip" data-l="${hEsc(x.l)}" aria-pressed="${!off.includes(x.l)}" title="${t.lgTip}"><i style="border-top:3px ${x.dash ? 'dashed' : 'solid'} ${x.c}"></i>${hEsc(x.l)} <b>${lv(x)}</b></button>`).join('')
    + (off.length ? `<button type="button" class="chip" data-l="*">${t.lgAll}</button>` : '') : '';
  let clickT = null;
  $('aumL').onclick = e => { const b = e.target.closest('.chip'); if (!b) return; const l = b.dataset.l; clearTimeout(clickT);
    clickT = setTimeout(() => { const o = ST.aoff || []; ST.aoff = l === '*' ? [] : o.includes(l) ? o.filter(x => x !== l) : D.L.filter(x => !o.includes(x.l)).length > 1 ? [...o, l] : o; save(); drawAum(); }, 220); };
  $('aumL').ondblclick = e => { const b = e.target.closest('.chip'); if (!b || b.dataset.l === '*') return; clearTimeout(clickT); ST.aoff = D.L.map(x => x.l).filter(l => l !== b.dataset.l); save(); drawAum(); };
  const f = v => v == null ? '–' : ST.av === 'eur' ? fmt(v, 1) : ST.av === 'share' ? fmt(v, 2) : pct(v);   // cum, chg – %
  const tot = D.L.length > 1 && (ST.av === 'eur' || (ST.av === 'share' && D.L.every(x => x.pl === D.L[0].pl)));
  const sum = i => { const xs = D.L.map(x => x.vals[i]).filter(v => v != null); return xs.length ? xs.reduce((a, b) => a + b, 0) : null; };
  const rows = D.ends.map((d, i) => ({ d, i })).filter(r => D.L.some(x => x.vals[r.i] != null)).reverse();
  $('aumT').innerHTML = `<thead><tr><th>${t.thDate}</th>${D.L.map(x => `<th class="n">${hEsc(x.l)}</th>`).join('')}${tot ? `<th class="n">${t.thSum}</th>` : ''}</tr></thead>`
    + `<tbody>${rows.map(r => `<tr><td>${iso(r.d)}</td>${D.L.map(x => `<td class="n">${f(x.vals[r.i])}</td>`).join('')}${tot ? `<td class="n"><b>${f(sum(r.i))}</b></td>` : ''}</tr>`).join('')}</tbody>`;
  $('aS')?.addEventListener('change', e => { ST.as = e.target.value; save(); drawAum(); });
  $('aV').onchange = e => { ST.av = e.target.value; save(); drawAum(); };
  $('aQ').onchange = e => { if (!e.target.value) return; const [a, b] = e.target.value.split(':').map(Number); ST.ar = 'custom'; ST.af = a; ST.at = b; save(); $('aR').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', false)); $('aF').value = iso(a); $('aT').value = iso(b); drawAum(); };
  const dIn = v => v ? Math.round(Date.parse(v) / DAY) : 0;
  ['aF', 'aT'].forEach(id => $(id).onchange = () => { const a = dIn($('aF').value), b = dIn($('aT').value); if (!a || !b || b <= a) return; ST.ar = 'custom'; ST.af = a; ST.at = b; save(); $('aQ').value = ''; $('aR').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', false)); drawAum(); });
  $('aR').onclick = e => { const b = e.target.closest('button'); if (!b) return; ST.ar = b.dataset.k; $('aQ').value = ''; $('aF').value = $('aT').value = ''; save(); $('aR').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); drawAum(); };
}

/* ---------- portfelis (data_pf.js): naujausias ketvirtis ---------- */
function portfolio(p, g) {               // g – grupė (vienas fondas) arba null (visi II pakopos fondai)
  if (CTRY) return null;
  const fs = PF.funds.filter(f => f.pl === 'II' && f.p === labelOf(p) && (g ? f.g === g : true));
  const cut = asOf(), qOk = qi => !cut || Math.round(Date.parse(PF.quarters[qi]) / DAY) <= cut;
  let q = -1; fs.forEach(f => { for (let i = 0; i < f.r.length; i += 4) if (qOk(f.r[i])) q = Math.max(q, f.r[i]); });
  if (q < 0) return null;
  const by = new Map(); let tot = 0;
  fs.forEach(f => { for (let i = 0; i < f.r.length; i += 4) if (f.r[i] === q) { by.set(f.r[i + 1], (by.get(f.r[i + 1]) || 0) + f.r[i + 3]); tot += f.r[i + 3]; } });
  /* turto klasė „pro fondus“ (kaip Portfelių puslapyje): ETF ir fondai – pagal jų turinį (akcijų, obligacijų, pinigų rinkos, alternatyvūs),
     ne „Fondai ir ETF 91 %“ (savininkas 2026-10-16: kad būtų aišku, į ką investuota) */
  const cls = x => { if (x[1] !== 'f') return { e: 'eq', b: 'bd', c: 'cash', d: 'der' }[x[1]] || 'oth'; if (x[7]) return 'alt';
    const ac = x[9] ? x[9][0] : { 1: 'bond', 3: 'equity', 4: 'money_market', 5: 'real_estate', 7: 'private_equity' }[x[4]] || '';
    return ac === 'equity' ? 'eq' : ac === 'bond' ? 'bd' : ac === 'money_market' ? 'cash' : ['private_equity', 'real_estate', 'other'].includes(ac) ? 'alt' : 'oth'; };
  const types = {}; by.forEach((v, si) => { const t = cls(PF.secs[si]); types[t] = (types[t] || 0) + v; });
  const top = [...by.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([si, v]) => ({ si, s: PF.secs[si], w: v / tot * 100 }));
  return { p, g, qi: q, fs, q: PF.quarters[q], tot, types: Object.entries(types).map(([t, v]) => ({ t, w: v / tot * 100 })).sort((a, b) => b.w - a.w), top };
}
const catL = g => CTRY ? ((GLBL.III || {})[g] || (GLBL.II || {})[g] || {})[lang] || g : T().cat[g] || g;
function topsHTML(pl, n) {               // LV/EE: 10 didžiausių investicijų (valdytojų ataskaitos; data_mgr_{c}.js TOPS)
  const x = typeof TOPS !== 'undefined' && TOPS[pl + '|' + n]; if (!x || !x[1] || !x[1].length) return '';
  const t = T();
  return `<section class="card"><h2>${t.hTop2} · ${hEsc(n)}</h2><div class="meta">${t.mPf2(x[0] || '')}</div><div class="scroll"><table class="mt"><thead><tr><th>${t.thPos}</th><th class="n">${t.thW}</th></tr></thead><tbody>`
    + x[1].map(([nm, w]) => `<tr><td class="wrap">${hEsc(nm)}</td><td class="n">${fmt(w, 2)}</td></tr>`).join('') + '</tbody></table></div></section>';
}
function pfHTML(pf, sub) {
  const t = T(); pfHTML.last = pf;
  if (!pf) return `<section class="card"><p class="na">${t.noPf}</p></section>`;
  const al = pf.types.map(x => `<span>${t.cls[x.t] || x.t}</span><span class="t"><i style="width:${Math.min(100, Math.max(0, x.w))}%"></i></span><span class="n">${fmt(x.w, 1)}</span>`).join('');
  const top = pf.top.map((x, i) => `<tr><td class="n">${i + 1}</td><td class="wrap">${hEsc(x.s[8] || x.s[0])}</td><td>${t.types[x.s[1]] || ''}</td><td class="n">${fmt(x.w, 2)}</td></tr>`).join('');
  return `<div class="two"><section class="card" data-src="pf"><h2>${t.hAl(pf.q)}</h2><div class="meta">${t.mPf(sub)}</div><div class="alloc">${al}</div></section>
    <section class="card" data-src="pf"><h2>${t.hTop(pf.q)}</h2><div class="scroll"><table class="mt" id="mgrTop"><thead><tr><th class="n">#</th><th>${t.thPos}</th><th>${t.thType}</th><th class="n">${t.thW}</th></tr></thead><tbody>${top}</tbody></table></div></section></div>`;
}

/* ---------- Edge kortelės valdytojo suvestinės viršuje (vietoj KPI juostos): kiekviena – klausimas, didelis skaičius ir visų valdytojų juostos
   (pasirinktas valdytojas paryškintas). Lyginami valdytojai, ne fondai: rinkos dalis, vidutinė gyvenimo ciklo fondų grąža (kaip KPI), svertinis mokestis, III pakopos turtas. ---------- */
const MGC = {
  q: { lt: [n => `Kokią II pakopos rinkos dalį valdo ${n}?`, n => `Kaip ${n} gyvenimo ciklo fondams sekasi šiais metais?`, n => `Kiek kainuoja ${n} II pakopos fondai?`, n => `Kiek ${n} valdo III pakopoje?`],
    en: [n => `What share of the pillar II market does ${n} manage?`, n => `How are ${n}’s life-cycle funds doing this year?`, n => `How much do ${n}’s pillar II funds cost?`, n => `How much does ${n} manage in pillar III?`],
    lv: [n => `Kādu II līmeņa tirgus daļu pārvalda ${n}?`, n => `Kā ${n} fondiem veicas šogad?`, n => `Cik maksā ${n} II līmeņa plāni?`, n => `Cik ${n} pārvalda III līmenī?`],
    et: [n => `Kui suure osa II samba turust haldab ${n}?`, n => `Kuidas ${n} fondidel sel aastal läheb?`, n => `Kui palju maksavad ${n} II samba fondid?`, n => `Kui palju haldab ${n} III sambas?`] },
  ey: { lt: ['Rinka', 'Grąža', 'Mokesčiai', 'III pakopa'], en: ['Market', 'Return', 'Fees', 'Pillar III'], lv: ['Tirgus', 'Ienesīgums', 'Komisijas', 'III līmenis'], et: ['Turg', 'Tootlus', 'Tasud', 'III sammas'] },
  i: { lt: ['Valdytojo II pakopos fondų grynieji aktyvai ÷ visų valdytojų II pakopos fondų grynieji aktyvai tą pačią dieną.',
      'Valdytojo gyvenimo ciklo fondų grąžų nuo metų pradžios paprastas vidurkis (kiekvienoje grupėje vienas fondas), palyginti su kitais valdytojais. Grąža – iš vieneto verčių, jau po mokesčių. Excel – II pakopos fondų lentelė su formulėmis.',
      'Valdytojo II pakopos fondų valdymo mokesčiai (LB ataskaita), sverti fondų grynaisiais aktyvais.',
      'Valdytojo III pakopos fondų grynųjų aktyvų suma.'],
    en: ['Net assets of the manager’s pillar II funds ÷ net assets of all managers’ pillar II funds on the same day.',
      'Simple average of the year-to-date returns of the manager’s life-cycle funds (one fund per group), compared with other managers. Returns come from unit values, already net of fees. Excel – the pillar II fund table with formulas.',
      'Management fees of the manager’s pillar II funds (LB report), weighted by fund net assets.',
      'Sum of net assets of the manager’s pillar III funds.'] },
  rk: { lt: (k, n) => `${k} vieta iš ${n} valdytojų`, en: (k, n) => `place ${k} of ${n} managers`, lv: (k, n) => `${k}. vieta no ${n} pārvaldītājiem`, et: (k, n) => `${k}. koht ${n} fondivalitseja seas` },
};
MGC.rkc = { lt: (k, n) => `${k} vieta iš ${n} pagal mažiausią mokestį`, en: (k, n) => `place ${k} of ${n} by lowest fee`, lv: (k, n) => `${k}. vieta no ${n} pēc zemākās komisijas`, et: (k, n) => `${k}. koht ${n}-st madalaima tasu järgi` };
const mgcT = k => MGC[k][ulang] || MGC[k].en;
function mgCards(o) {
  const { p, cut, live, aAll, ytdM, yNow, pay, feeW } = o, t = T();
  let el = document.getElementById('kpis');
  if (!el) { el = document.createElement('div'); el.id = 'kpis'; (document.getElementById('snav') || document.getElementById('top')).after(el); }
  try {
    const Q = mgcT('q').slice(), E = mgcT('ey'), I = mgcT('i'), me = mLab(p), out = [];
    if (CTRY) Q[1] = { lt: n => `Kaip ${n} fondams sekasi šiais metais?`, en: n => `How are ${n}’s funds doing this year?` }[ulang] || (ulang === 'lt' || ulang === 'en' ? Q[1] : mgcT('q')[1]);   // LV/EE – vidutinis fondas, ne gyvenimo ciklo
    const bars = (rows, f) => ecBars(rows.map(r => [mLab(r.q), r.q === p ? mCol(r.q) : 'color-mix(in srgb, ' + mCol(r.q) + ' 45%, transparent)', r.v, f(r.v), r.q === p]));
    const aII = q => cut ? (sumAt(aumFs(q, 'II'), cut, 92) || 0) * 1e6 : live.filter(f => own(f, q)).reduce((s, f) => s + f.assets, 0);
    const tot = cut ? (sumAt(aumFs(null, 'II'), cut, 92) || 0) * 1e6 : aAll;
    if (tot) { const sh = PROVS.map(q => ({ q, v: aII(q) / tot * 100 })).filter(x => x.v > 0).sort((a, b) => b.v - a.v), m = sh.find(x => x.q === p);
      if (m) out.push(ecCard({ sz: 'w', img: 'sec2-mgr.jpg', ic: 'building-bank', ey: E[0], q: Q[0](hEsc(me)), big: fmt(m.v, 1) + pctSfx(), sub: `${kpMoney(aII(p))} · ${mgcT('rk')(sh.indexOf(m) + 1, sh.length)}${pay ? ` · ${t.kPay(yNow)}: −${kpMoney(-pay * 1e6).replace(/^−/, '')}` : ''}`, info: I[0], xt: 'aumT',
        vis: bars(sh, v => fmt(v, 1) + pctSfx()) })); }
    const mY = ytdM.find(x => x.q === p);
    if (mY) out.push(ecCard({ sz: 'w', ic: 'arrow-trending', ey: E[1], q: Q[1](hEsc(me)), big: pct(mY.v), sub: mgcT('rk')(ytdM.indexOf(mY) + 1, ytdM.length), info: I[1], xt: 't2',
      vis: bars(ytdM, v => pct(v)) }));
    if (feeW != null) { const fw = PROVS.map(q => { let s = 0, w = 0; fundsII(q).forEach(x => { const r = repOf('II', q, kII(x)), f = live.find(y => y === x.f); if (r && r.fee != null && f) { s += r.fee * f.assets; w += f.assets; } }); return { q, v: w ? s / w : null }; }).filter(x => x.v != null).sort((a, b) => a.v - b.v);
      const m = fw.find(x => x.q === p); if (m) out.push(ecCard({ sz: 'w', ic: 'money-hand', ey: E[2], q: Q[2](hEsc(me)), big: fmt(m.v, 2) + pctSfx(), sub: `${t.kFee} · ${mgcT('rkc')(1 + fw.filter(x => +x.v.toFixed(2) < +m.v.toFixed(2)).length, fw.length)}`, info: I[2], xt: 't2',
        vis: bars(fw, v => fmt(v, 2) + pctSfx()) })); }
    const a3 = q => cut ? (sumAt(aumFs(q, 'III'), cut, 92) || 0) * 1e6 : fundsIII(q).reduce((s, f) => s + (f.aum || 0), 0);
    const r3 = PROVS.map(q => ({ q, v: a3(q) })).filter(x => x.v > 0).sort((a, b) => b.v - a.v), m3 = r3.find(x => x.q === p);
    if (m3) out.push(ecCard({ sz: 'w', ic: 'savings', ey: E[3], q: Q[3](hEsc(me)), big: kpMoney(m3.v), sub: mgcT('rk')(r3.indexOf(m3) + 1, r3.length), info: I[3], xt: 't3',
      vis: bars(r3, v => kpMoney(v)) }));
    if (out.length < 2) return false;
    el.className = 'hg jg'; el.style.margin = '6px 0 18px'; el.innerHTML = out.join(''); ecFold(el); return true;
  } catch (e) { console.warn(e); return false; }
}

/* ---------- valdytojo suvestinė ---------- */
function renderManager() {
  const t = T(), p = ST.p, ii = fundsII(p), iii = fundsIII(p);
  const all = DATA.groups.flatMap(g => g.funds), last = Math.max(...all.map(f => f.d[f.d.length - 1]));
  const live = all.filter(f => f.assets && f.assetsDate >= last - 10), mine = live.filter(f => own(f, p));
  const cut = asOf();
  let aII = mine.reduce((s, f) => s + f.assets, 0), aAll = live.reduce((s, f) => s + f.assets, 0), aIII = iii.reduce((s, f) => s + (f.aum || 0), 0), aD = Math.max(...mine.map(f => f.assetsDate));
  if (cut) { aII = (sumAt(aumFs(p, 'II'), cut, 92) || 0) * 1e6; aAll = (sumAt(aumFs(null, 'II'), cut, 92) || 0) * 1e6; aIII = (sumAt(aumFs(p, 'III'), cut, 92) || 0) * 1e6; aD = cut; }
  const ytdM = PROVS.map(q => ({ q, v: mean(LC.map(g => mgrRet(g, 'ytd', q))) })).filter(x => x.v != null).sort((a, b) => b.v - a.v);
  const me = ytdM.find(x => x.q === p);
  const feeW = (() => { let s = 0, w = 0; ii.forEach(x => { const r = repOf('II', p, kII(x)), f = mine.find(y => y === x.f); if (r && r.fee != null && f) { s += r.fee * f.assets; w += f.assets; } }); return w ? s / w : null; })();
  const yNow = new Date((cut || last) * DAY).getUTCFullYear(), pay = AUM.payouts.filter(e => e.p === p && e.q.startsWith(yNow + '-')).reduce((s, e) => s + e.flow, 0);
  if (!mgCards({ p, cut, last, live, aAll, ytdM, yNow, pay, feeW })) kpiRow([[t.kII, kpMoney(aII), iso(aD)], aAll && [t.kShare, fmt(aII / aAll * 100, 1) + pctSfx()],
    me && [t.kYtd, pct(me.v), t.kYtdS(ytdM.indexOf(me) + 1, ytdM.length)], feeW != null && [t.kFee, fmt(feeW, 2) + pctSfx()],
    pay ? [t.kPay(yNow), kpMoney(-pay * 1e6).replace(/^/, '−')] : null, iii.length && [t.kIII, kpMoney(aIII)]]);
  let h = '';
  const per2 = pers().map(per => ({ per, rs: ii.map(({ g }) => peerRets(g, per)) }));
  const endD = Math.max(...ii.map(({ g }) => peerRets(g, 'ytd').end));
  const cell = (v, pl) => `<td class="n${pl && pl.n > 2 && pl.k === 1 ? ' top' : pl && pl.n > 2 && pl.k === pl.n ? ' bot' : ''}">${v == null ? '–' : pct(v)}${pl ? `<small>${pl.k}/${pl.n}</small>` : ''}</td>`;
  const rows2 = ii.map(({ g, f }, i) => {
    const k = kII({ g, f }), r = repOf('II', p, k), rk = risk(f, endD, 36);
    return `<tr><td>${CTRY ? `${hEsc(f.name)}<small> · ${groupLabel(g)}</small>` : groupLabel(g)}</td>${per2.map(x => { const pr = x.rs[i]; return cell(pr.rets[f.provider], placeOf(pr.rets, f.provider)); }).join('')}<td class="n">${r && r.fee != null ? fmt(r.fee) : '–'}</td><td class="n">${fmt(assetsII(p, k), 1)}</td><td class="n">${rk ? fmt(rk.vol) : '–'}</td><td class="n">${rk ? fmt(rk.dd) : '–'}</td></tr>`;
  }).join('');
  h += `<section class="card" data-src="nav"><h2>${t.h2}</h2><div class="meta">${t.m2(iso(endD))}</div><div class="scroll"><table class="mt" id="t2"><thead><tr><th>${CTRY ? t.thFund : t.thG}</th>${pers().map(x => `<th class="n">${perLabel(x)}</th>`).join('')}<th class="n">${t.thFee}</th><th class="n">${t.thAum}</th><th class="n">${t.thVol}</th><th class="n">${t.thDd}</th></tr></thead><tbody>${rows2}</tbody></table></div></section>`;
  if (iii.length) {
    const rows3 = iii.map(f => `<tr><td>${hEsc(f.n)}</td><td>${catL(f.g)}</td>${pers().map(per => { const ps = peersIII(f, per); return cell(ps[f.n], placeOf(ps, f.n)); }).join('')}<td class="n">${f.fee != null ? fmt(f.fee) : '–'}</td><td class="n">${fmt(assetsIII(f), 1)}</td></tr>`).join('');
    h += `<section class="card" data-src="p3"><h2>${t.h3}</h2><div class="meta">${t.m3(iso(REP.months[M3E()]))}</div><div class="scroll"><table class="mt" id="t3"><thead><tr><th>${t.thFund}</th><th>${t.thCat}</th>${pers().map(x => `<th class="n">${perLabel(x)}</th>`).join('')}<th class="n">${t.thFee}</th><th class="n">${t.thAum}</th></tr></thead><tbody>${rows3}</tbody></table></div></section>`;
  }
  h += aumHTML();
  h += CTRY ? ii.map(x => topsHTML('II', x.f.name)).join('') + iii.map(f => topsHTML('III', f.n)).join('') : pfHTML(portfolio(p, null), t.pfAll);
  $('body').innerHTML = h;
  cardify($('t2')); if ($('t3')) cardify($('t3'));
  drawAum();
}

/* ---------- vienas fondas ---------- */
/* ---------- fondo kortelė: kalendoriniai metai ir lyginamasis indeksas (savininkas 2026-10-16) ---------- */
addStrings({
  hYears: 'Calendar years compared with the group', mYears: 'Each year: 31 Dec → 31 Dec unit values; the current year – to the latest day. Median – of the other funds in the group.', thYr: 'Year',
  hBm: 'Tracking the benchmark index', mBm: d => `Month-end values to ${d}. The fund’s return is after fees, the index’s is before fees, so a small negative difference is normal. Tracking error = annualised standard deviation of monthly differences (36 months).`,
  bmNone: 'The manager does not publish the values of this fund’s benchmark index, so tracking cannot be calculated.', thIdx: 'Index', thFundR: 'Fund', thTd: 'Difference, pp', te: 'Tracking error (36 m.)', bmMonths: 'Last 12 months', ann: 'p.a.',
  pfMore: 'Full portfolio analysis →' }, {
  hYears: 'Kalendoriniai metai, palyginti su grupe', mYears: 'Kiekvieni metai: gruodžio 31 d. → gruodžio 31 d. vieneto vertės; šie metai – iki naujausios dienos. Mediana – kitų grupės fondų.', thYr: 'Metai',
  hBm: 'Lyginamojo indekso sekimas', mBm: d => `Mėnesių pabaigų vertės iki ${d}. Fondo grąža – po mokesčių, indekso – be mokesčių, todėl nedidelis neigiamas skirtumas yra normalus. Sekimo paklaida = mėnesinių skirtumų standartinis nuokrypis, perskaičiuotas metams (36 mėn.).`,
  bmNone: 'Valdytojas šio fondo lyginamojo indekso verčių neskelbia, todėl sekimo apskaičiuoti negalima.', thIdx: 'Indeksas', thFundR: 'Fondas', thTd: 'Skirtumas, p. p.', te: 'Sekimo paklaida (36 mėn.)', bmMonths: 'Paskutiniai 12 mėnesių', ann: 'metinė',
  pfMore: 'Išsami portfelio analizė →' });
function calYearRet(f, y, end) {           // kalendorinių metų grąža iš kasdienių vieneto verčių (null – fondo tada dar nebuvo)
  const a = Math.round(Date.UTC(y - 1, 11, 31) / DAY), b = Math.min(end, Math.round(Date.UTC(y, 11, 31) / DAY));
  const ia = lastOnOrBefore(f, a), ib = lastOnOrBefore(f, b);
  if (ia < 0 && !(f.d[0] - a <= 7 && Math.abs(f.v[0] - 1) < 0.005)) return null;
  const i0 = ia < 0 ? 0 : ia; return ib > i0 ? (f.v[ib] / f.v[i0] - 1) * 100 : null;
}
function yearsHTML(g, p, end) {
  const t = T(), f = g.funds.find(x => x.provider === p), y1 = new Date(end * DAY).getUTCFullYear(), y0 = Math.max(2019, new Date(f.d[0] * DAY).getUTCFullYear());
  let rows = '';
  for (let y = y1; y >= y0; y--) {
    const rets = Object.fromEntries(g.funds.map(x => [x.provider, calYearRet(x, y, end)])), v = rets[p];
    const md = median(Object.entries(rets).filter(([q]) => q !== p).map(([, x]) => x)), pl1 = placeOf(rets, p);
    rows += `<tr><td>${y === y1 ? T().periods.ytd + ' ' + y : y}</td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${md == null ? '–' : pct(md)}</td><td class="n">${v == null || md == null ? '–' : (v - md >= 0 ? '+' : '−') + num(Math.abs(v - md), 2)}</td><td class="n">${pl1 && v != null ? `${pl1.k} / ${pl1.n}` : '–'}</td></tr>`;
  }
  return `<section class="card" data-src="nav"><h2>${t.hYears}</h2><div class="meta">${t.mYears}</div><div class="scroll"><table class="mt" id="ty"><thead><tr><th>${t.thYr}</th><th class="n">${labelOf(p)}</th><th class="n">${t.thMed}</th><th class="n">${t.thDiff}</th><th class="n">${t.thPlace}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}
/* lyginamasis indeksas: tik fondams, kurių valdytojas skelbia indekso vertes (data_rep.js „bm“ – SEB, Goindex); kitiems – pranešimas */
function bmHTML(r) {
  const t = T(), M = REP.months;
  if (!r || !r.bm || !r.bm.some(v => v != null)) return `<section class="card"><h2>${t.hBm}</h2><p class="note">${t.bmNone}</p></section>`;
  let e = M.length - 1; while (e > 0 && (r.m[e] == null || r.bm[e] == null)) e--;
  const ok = i => i >= 0 && r.m[i] != null && r.bm[i] != null;
  const yOf = i => new Date(M[i] * DAY).getUTCFullYear();
  const per = [[t.periods['1m'] || '1 mėn.', 1], [t.periods['3m'], 3], [t.periods['6m'], 6], [t.periods.ytd, 'ytd'], [t.periods['1y'], 12], [t.periods['3y'] + ', ' + t.ann, 36], [t.periods['5y'] + ', ' + t.ann, 60]];
  const rows = per.map(([lab, k]) => {
    let a = k === 'ytd' ? M.findIndex(d => { const dt = new Date(d * DAY); return dt.getUTCFullYear() === yOf(e) - 1 && dt.getUTCMonth() === 11; }) : e - k;
    if (!ok(a)) return '';
    const yrs = typeof k === 'number' && k > 12 ? k / 12 : 1, an = x => (Math.pow(x, 1 / yrs) - 1) * 100;
    const fr = an(r.m[e] / r.m[a]), br = an(r.bm[e] / r.bm[a]), d = fr - br;
    return `<tr><td>${lab}<small> ${iso(M[a])} – ${iso(M[e])}</small></td><td class="n">${pct(fr)}</td><td class="n">${pct(br)}</td><td class="n ${d >= 0 ? 'pos' : 'neg'}">${(d >= 0 ? '+' : '−') + num(Math.abs(d), 2)}</td></tr>`;
  }).join('');
  const diffs = []; for (let i = Math.max(1, e - 35); i <= e; i++) if (ok(i) && ok(i - 1)) diffs.push(((r.m[i] / r.m[i - 1]) - (r.bm[i] / r.bm[i - 1])) * 100);
  const te = diffs.length >= 12 ? (() => { const mu = diffs.reduce((s, x) => s + x, 0) / diffs.length; return Math.sqrt(diffs.reduce((s, x) => s + (x - mu) ** 2, 0) / (diffs.length - 1)) * Math.sqrt(12); })() : null;
  const mrows = []; for (let i = e; i > e - 12 && i > 0; i--) if (ok(i) && ok(i - 1)) { const fr = (r.m[i] / r.m[i - 1] - 1) * 100, br = (r.bm[i] / r.bm[i - 1] - 1) * 100, d = fr - br; mrows.push(`<tr><td>${iso(M[i]).slice(0, 7)}</td><td class="n">${pct(fr)}</td><td class="n">${pct(br)}</td><td class="n ${d >= 0 ? 'pos' : 'neg'}">${(d >= 0 ? '+' : '−') + num(Math.abs(d), 2)}</td></tr>`); }
  const head = `<thead><tr><th>${t.thPer}</th><th class="n">${t.thFundR}</th><th class="n">${t.thIdx}</th><th class="n">${t.thTd}</th></tr></thead>`;
  return `<section class="card" data-src="rep"><h2>${t.hBm}</h2><div class="meta">${t.mBm(iso(M[e]))}</div>
    <div class="scroll"><table class="mt" id="tbm">${head}<tbody>${rows}</tbody></table></div>${te != null ? `<p><b>${t.te}:</b> ${num(te, 2)} p. p.</p>` : ''}
    <h3>${t.bmMonths}</h3><div class="scroll"><table class="mt" id="tbm12">${head}<tbody>${mrows.join('')}</tbody></table></div></section>`;
}

function renderFund() {
  const t = T(), p = ST.p, [pl, key] = [ST.f.slice(0, ST.f.indexOf(':')), ST.f.slice(ST.f.indexOf(':') + 1)];
  let h = '';
  if (pl === 'II') {
    const fk = CTRY ? key : p, g = CTRY ? DATA.groups.find(x => x.funds.some(y => y.provider === key)) : DATA.groups.find(x => x.id === key);
    if (!g) { ST.f = ''; return renderManager(); }
    const f = g.funds.find(x => x.provider === fk), r = repOf('II', p, key);
    const ytd = peerRets(g, 'ytd'), pl0 = placeOf(ytd.rets, fk), end = ytd.end;
    const iu = asOf() ? lastOnOrBefore(f, asOf()) : f.v.length - 1, aF = assetsII(p, key);
    kpiRow([iu >= 0 && [t.kUv, num(f.v[iu], 4), iso(f.d[iu])], aF && [t.kAs, kpMoney(aF * 1e6), iso(asOf() || f.assetsDate)],
      r && r.fee != null && [t.kFeeF, fmt(r.fee) + pctSfx()], pl0 && [t.kPlace, `${pl0.k} / ${pl0.n}`, pct(ytd.rets[fk])]]);
    const rows = [...pers(), 'max'].map(per => { const x = peerRets(g, per), v = x.rets[fk], o = Object.entries(x.rets).filter(([q]) => q !== fk).map(([, v]) => v), md = median(o), pl1 = placeOf(x.rets, fk);
      return `<tr><td>${perLabel(per)}<small> ${iso(x.anchor)} – ${iso(x.end)}</small></td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${md == null ? '–' : pct(md)}</td><td class="n">${v == null || md == null ? '–' : (v - md >= 0 ? '+' : '−') + num(Math.abs(v - md), 2)}</td><td class="n">${pl1 ? `${pl1.k} / ${pl1.n}` : '–'}</td></tr>`; }).join('');
    const peers = g.funds.map(x => ({ p: x.provider, v: ytd.rets[x.provider], r: CTRY ? repOf('II', MOF[x.provider], x.provider) : repOf('II', x.provider, key), f: x, rk: risk(x, end, 36) })).sort((a, b) => (b.v ?? -1e9) - (a.v ?? -1e9));
    const prow = peers.map(x => `<tr${x.p === fk ? ' class="me"' : ''}><td><i class="sw" style="background:${colorOf(x.p)}"></i>${labelOf(x.p)}</td><td class="n">${x.v == null ? '–' : pct(x.v)}</td><td class="n">${x.r && x.r.fee != null ? fmt(x.r.fee) : '–'}</td><td class="n">${fmt(CTRY ? assetsII(MOF[x.p], x.p) : assetsII(x.p, key), 1)}</td><td class="n">${x.rk ? fmt(x.rk.vol) : '–'}</td><td class="n">${x.rk ? fmt(x.rk.dd) : '–'}</td></tr>`).join('');
    const r1 = risk(f, end, 12), r3 = risk(f, end, 36);
    h += `<section class="card" data-src="nav"><h2>${t.hPeers} · ${groupLabel(g)}</h2><div class="meta">${t.mPeers}</div><div class="scroll"><table class="mt" id="tp"><thead><tr><th>${t.thPer}</th><th class="n">${labelOf(fk)}</th><th class="n">${t.thMed}</th><th class="n">${t.thDiff}</th><th class="n">${t.thPlace}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    h += `<div class="two"><section class="card chart-card" data-src="nav"><h2>${t.hChart}</h2><div class="mchart" id="fC"></div></section>
      <section class="card" data-src="nav"><h2>${groupLabel(g)} · ${T().periods.ytd}</h2><div class="scroll"><table class="mt" id="tq"><thead><tr><th>${t.thFund}</th><th class="n">${T().periods.ytd}</th><th class="n">${t.thFee}</th><th class="n">${t.thAum}</th><th class="n">${t.thVol}</th><th class="n">${t.thDd}</th></tr></thead><tbody>${prow}</tbody></table></div>
      <h3>${t.hRisk}</h3><table class="mt"><tbody><tr><td>${t.rVol1}</td><td class="n">${r1 ? fmt(r1.vol) + pctSfx() : '–'}</td></tr><tr><td>${t.rVol3}</td><td class="n">${r3 ? fmt(r3.vol) + pctSfx() : '–'}</td></tr><tr><td>${t.rDd3}</td><td class="n">${r3 ? fmt(r3.dd) + pctSfx() : '–'}</td></tr>${r && r.risky != null ? `<tr><td>${t.rRisky}</td><td class="n">${fmt(r.risky, 1)}${pctSfx()}</td></tr>` : ''}</tbody></table><p class="note">${t.rNote}</p></section></div>`;
    h += yearsHTML(g, fk, end) + (CTRY ? '' : bmHTML(r));
    const pf = CTRY ? null : PF.funds.find(x => x.pl === 'II' && x.p === labelOf(p) && x.g === key);
    h += aumHTML() + (CTRY ? topsHTML('II', f.name) : pfHTML(portfolio(p, key), t.pfOne)) + (pf ? `<p class="more"><a href="portfolios.html#fund=${encodeURIComponent(pf.c)}">${t.pfMore}</a></p>` : '');
    $('body').innerHTML = h;
    cardify($('tp')); cardify($('tq')); cardify($('ty')); drawAum();
    const x = peerRets(g, '3y'), el = $('fC');
    drawLineChart(el, buildSeries(g.funds, x.anchor, x.end), x.anchor, x.end, { height: 260, mr: el.clientWidth > 500 ? 92 : 16 });
  } else {
    const f = REP.funds.find(x => x.pl === 'III' && x.p === p && x.n === key);
    if (!f) { ST.f = ''; return renderManager(); }
    const ytd = peersIII(f, 'ytd'), pl0 = placeOf(ytd, f.n);
    const j3 = M3E(), uv = asOf() ? [f.m[j3], REP.months[j3]] : [f.lv, f.ld], a3 = assetsIII(f);
    kpiRow([uv[0] != null && [t.kUv, num(uv[0], 4), iso(uv[1])], a3 && [t.kAs, kpMoney(a3 * 1e6), iso(asOf() || f.aumd)], f.fee != null && [t.kFeeF, fmt(f.fee) + pctSfx()], pl0 && [t.kPlace, `${pl0.k} / ${pl0.n}`, pct(ytd[f.n])]]);
    const rows = pers().map(per => { const ps = peersIII(f, per), v = ps[f.n], md = median(Object.entries(ps).filter(([n]) => n !== f.n).map(([, v]) => v)), pl1 = placeOf(ps, f.n);
      return `<tr><td>${perLabel(per)}</td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${md == null ? '–' : pct(md)}</td><td class="n">${v == null || md == null ? '–' : (v - md >= 0 ? '+' : '−') + num(Math.abs(v - md), 2)}</td><td class="n">${pl1 ? `${pl1.k} / ${pl1.n}` : '–'}</td></tr>`; }).join('');
    const peers = REP.funds.filter(x => x.pl === 'III' && x.g === f.g).map(x => ({ x, v: ytd[x.n] })).sort((a, b) => (b.v ?? -1e9) - (a.v ?? -1e9));
    const prow = peers.map(({ x, v }) => `<tr${x === f ? ' class="me"' : ''}><td><i class="sw" style="background:${mCol(x.p)}"></i>${hEsc(x.n)}</td><td class="n">${v == null ? '–' : pct(v)}</td><td class="n">${x.fee != null ? fmt(x.fee) : '–'}</td><td class="n">${fmt(assetsIII(x), 1)}</td></tr>`).join('');
    h += `<section class="card" data-src="p3"><h2>${t.hPeers} · ${catL(f.g)}</h2><div class="meta">${t.m3(iso(REP.months[M3E()]))}</div><div class="scroll"><table class="mt" id="tp"><thead><tr><th>${t.thPer}</th><th class="n">${hEsc(f.n)}</th><th class="n">${t.thMed}</th><th class="n">${t.thDiff}</th><th class="n">${t.thPlace}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
    h += `<section class="card" data-src="p3"><h2>${catL(f.g)} · ${T().periods.ytd}</h2><div class="scroll"><table class="mt" id="tq"><thead><tr><th>${t.thFund}</th><th class="n">${T().periods.ytd}</th><th class="n">${t.thFee}</th><th class="n">${t.thAum}</th></tr></thead><tbody>${prow}</tbody></table></div></section>`;
    h += (CTRY ? topsHTML('III', f.n) : bmHTML(f)) + aumHTML();
    $('body').innerHTML = h;
    cardify($('tp')); cardify($('tq')); drawAum();
  }
}

function render() {
  const t = T(), p = ST.p;
  document.documentElement.style.setProperty('--mc', mCol(p));
  $('selPL').textContent = t.selP; $('selFL').textContent = t.selF; $('btnA4').textContent = t.a4;
  $('dEndL').textContent = t.dEnd; $('selXL').textContent = t.selX; $('dFromL').textContent = t.dFrom; $('btnLast').textContent = t.reset;
  const de = $('dEnd'); de.min = iso(EARLIEST); de.max = iso(LATEST); de.value = iso(asOf() || LATEST);
  /* „Duomenys iki“: aiškūs pasirinkimai – Naujausi / metų pabaiga / ketvirčio pabaiga / bet kuri data (savininkas 2026-10-16) */
  $('btnLast').setAttribute('aria-pressed', !asOf());
  const ye = [], qe = []; for (let y = new Date(LATEST * DAY).getUTCFullYear(); y >= new Date(EARLIEST * DAY).getUTCFullYear(); y--) { [12, 9, 6, 3].forEach(m => { const d = Math.round(Date.UTC(y, m, 0) / DAY); if (d < LATEST && d >= EARLIEST) { qe.push(d); if (m === 12) ye.push(d); } }); }
  const opt0 = l => `<option value="">${l} ▾</option>`;
  $('selYE').innerHTML = opt0(t.yeL) + ye.map(d => `<option value="${d}">${iso(d)}</option>`).join(''); $('selYE').value = ye.includes(asOf()) ? String(asOf()) : '';
  $('selQE').innerHTML = opt0(t.qeL) + qe.map(d => `<option value="${d}">${iso(d)}</option>`).join(''); $('selQE').value = qe.includes(asOf()) && !ye.includes(asOf()) ? String(asOf()) : '';
  $('selYE').classList.toggle('on', $('selYE').value !== ''); $('selQE').classList.toggle('on', $('selQE').value !== ''); de.classList.toggle('on', !!asOf() && !$('selYE').value && !$('selQE').value);
  const co = calOptions(asOf() || LATEST, EARLIEST), o = (k, l) => `<option value="${k}">${l}</option>`;
  $('selX').innerHTML = o('', t.xNone) + ['1m', '3m', '6m'].map(k => o(k, T().periods[k])).join('') + `<optgroup label="${lang === 'lt' ? 'Ketvirtis' : 'Quarter'}">${co.q.map(k => o(k, periodLabel(k))).join('')}</optgroup><optgroup label="${lang === 'lt' ? 'Metai' : 'Year'}">${co.y.map(k => o(k, periodLabel(k))).join('')}</optgroup>` + o('custom', T().periods.custom);
  if (![...$('selX').options].some(x => x.value === ST.x)) ST.x = '';
  $('selX').value = ST.x; $('fromW').hidden = ST.x !== 'custom';
  $('shownP').textContent = t.shownL(pers().map(perLabel).join(', '));
  if (ST.x === 'custom') { if (!ST.a || ST.a >= (asOf() || LATEST)) ST.a = shiftMonths(asOf() || LATEST, 12); $('dFrom').min = iso(EARLIEST); $('dFrom').max = iso((asOf() || LATEST) - 1); $('dFrom').value = iso(ST.a); }
  $('selP').innerHTML = PROVS.map(q => `<option value="${q}">${mLab(q)}</option>`).join(''); $('selP').value = p;
  const ii = fundsII(p), iii = fundsIII(p);
  $('selF').innerHTML = `<option value="">${t.allF}</option><optgroup label="${t.optII}">${ii.map(x => `<option value="II:${kII(x)}">${CTRY ? hEsc(x.f.name) : `${labelOf(p)} ${groupLabel(x.g)}`}</option>`).join('')}</optgroup>`
    + (iii.length ? `<optgroup label="${t.optIII}">${iii.map(f => `<option value="III:${hEsc(f.n)}">${hEsc(f.n)}</option>`).join('')}</optgroup>` : '');
  if (ST.f && ![...$('selF').options].some(o => o.value === ST.f)) ST.f = '';
  $('selF').value = ST.f;
  const fl = ST.f ? $('selF').selectedOptions[0].textContent : t.allF;
  $('band').innerHTML = `<div><h2>${ST.f ? hEsc(fl) : mLab(p)}</h2><div class="s">${ST.f ? mLab(p) : t.bandS(ii.length, iii.length)}</div></div>`;
  document.title = `${ST.f ? fl : mLab(p)} · ${t.siteTitle}`;
  if (ST.f) renderFund(); else renderManager();
  $('foot').textContent = t.foot;
  if (typeof srcLines === 'function') srcLines();
}
$('selP').addEventListener('change', e => { ST.p = e.target.value; ST.f = ''; save(); render(); });
$('selF').addEventListener('change', e => { ST.f = e.target.value; save(); render(); });
const dayIn = v => v ? Math.round(Date.parse(v) / DAY) : 0;
$('dEnd').addEventListener('change', e => { const d = dayIn(e.target.value); ST.e = d && d < LATEST ? Math.max(d, EARLIEST) : 0; render(); });
$('btnLast').addEventListener('click', () => { ST.e = 0; render(); });
['selYE', 'selQE'].forEach(id => $(id).addEventListener('change', e => { const d = +e.target.value; ST.e = d || 0; render(); }));
$('selX').addEventListener('change', e => { ST.x = e.target.value; save(); render(); });
$('dFrom').addEventListener('change', e => { const d = dayIn(e.target.value); if (d) { ST.a = d; save(); render(); } });
$('btnA4').addEventListener('click', () => { const r = document.documentElement; r.dataset.print = 'plain'; r.dataset.printA4 = '1'; setTimeout(() => window.print(), 50); });
addEventListener('afterprint', () => { delete document.documentElement.dataset.printA4; });
addEventListener('hashchange', () => { const h = decodeURIComponent(location.hash.slice(1)), k = h.indexOf('/'), p = k < 0 ? h : h.slice(0, k), f = k < 0 ? '' : h.slice(k + 1); if (PROVS.includes(p)) { ST.p = p; ST.f = f || ''; render(); } });
let rsz; addEventListener('resize', () => { clearTimeout(rsz); rsz = setTimeout(render, 200); });
/* ---------- Excel su skaičiavimais (auditui): valdytojo fondų grąža ir vieta tarp konkurentų ----------
   Lape „Skaičiavimai“ – ir šio valdytojo, ir visų konkurentų tos grupės fondai; vieta = COUNTIFS(didesnė grąža toje grupėje ir laikotarpyje) + 1. */
function mgrRankCols(per, j, SCq) {
  const lab = String(perLabel(per)).replace(/"/g, '""');
  return (r, a) => { const c = xlCol(1 + j); return { t: 'n', f: `IF(${c}${r}="","",COUNTIFS(${SCq}!$A:$A,$A${r},${SCq}!$B:$B,"${lab}",${SCq}!$H:$H,">"&${c}${r})+1)`, v: null, z: '0' }; };
}
XLB.set('t2', async () => {
  const t = T(), L = lang === 'lt', p = ST.p, ii = fundsII(p), P = pers(), SCq = `'${L ? 'Skaičiavimai' : 'Calculations'}'`, rows = [];
  ii.forEach(({ g, f }) => {
    const cellOf = (ff, per) => { const r = peerRets(g, per); if (r.rets[ff.provider] == null) return null; const s = seriesOf(ff, r.anchor, r.end); return s ? { f: ff, name: `${groupLabel(g)} · ${labelOf(ff.provider)}`, ia: s.ia, ie: s.ie, col: String(perLabel(per)) } : null; };
    const rep = repOf('II', p, g.id), rk = risk(f, Math.max(...ii.map(x => peerRets(x.g, 'ytd').end)), 36), am = assetsII(p, g.id);
    rows.push({ label: groupLabel(g), cells: P.map(per => cellOf(f, per)),
      extra: [...P.map((per, j) => { const fn = mgrRankCols(per, j, SCq); return (r, a) => { const o = fn(r, a), pl = placeOf(peerRets(g, per).rets, p); o.v = pl ? pl.k : ''; return o; }; }),
        ...P.map(per => { const pl = placeOf(peerRets(g, per).rets, p); return pl ? { t: 'n', v: pl.n, z: '0' } : null; }),
        rep && rep.fee != null ? rep.fee : null, am == null ? null : { t: 'n', v: am, z: '#,##0.0' }, rk ? rk.vol : null, rk ? rk.dd : null] });
    g.funds.filter(x => x.provider !== p).forEach(x => rows.push({ label: groupLabel(g), calcOnly: true, cells: P.map(per => cellOf(x, per)) }));
  });
  return pairBook({ title: `${labelOf(p)} · ${t.h2}`, cap: document.querySelector('#t2') ? document.querySelector('#t2').closest('section').querySelector('.meta').textContent : '', rowHdr: t.thG,
    cols: P.map(perLabel), extraCols: [...P.map(per => `${L ? 'Vieta' : 'Rank'}: ${perLabel(per)}`), ...P.map(per => `${L ? 'Fondų sk.' : 'Funds'}: ${perLabel(per)}`), t.thFee, t.thAum, t.thVol, t.thDd], rows,
    meth: [[L ? 'Vieta' : 'Rank', L ? 'COUNTIFS: kiek tos pačios grupės fondų tame laikotarpyje turi didesnę grąžą (lapas „Skaičiavimai“, visi konkurentai) + 1; „Fondų sk.“ – kiek fondų turi grąžą.' : 'COUNTIFS: how many funds of the same group have a higher return in that period (sheet “Calculations”, all peers) + 1; “Funds” – how many funds have a return.'],
      [L ? 'Kiti stulpeliai' : 'Other columns', L ? 'Mokestis – iš valdytojų ataskaitų; turtas – mln. €; svyravimas ir didžiausias kritimas – 3 metų, iš dienos vieneto verčių (reikšmės).' : 'Fee – from manager reports; assets – € m; volatility and max drawdown – 3 years, from daily unit values (values).']] });
});
const M3S = new Map();
const m3Series = f => { if (!M3S.has(f)) { const d = [], v = []; REP.months.forEach((x, i) => { if (f.m[i] != null) { d.push(x); v.push(f.m[i]); } }); M3S.set(f, { d, v, k: REP.months.map((_, i) => f.m[i] == null ? -1 : d.indexOf(REP.months[i])) }); } return M3S.get(f); };
XLB.set('t3', async () => {
  const t = T(), L = lang === 'lt', p = ST.p, P = pers(), SCq = `'${L ? 'Skaičiavimai' : 'Calculations'}'`, rows = [], iii = fundsIII(p);
  const cellOf = (x, per) => { const r = rangeIII(per); if (!r || x.m[r[0]] == null || x.m[r[1]] == null) return null; const sr = m3Series(x); return { f: sr, name: x.n, ia: sr.k[r[0]], ie: sr.k[r[1]], col: String(perLabel(per)) }; };
  [...new Set(iii.map(f => f.g))].forEach(cat => {
    iii.filter(f => f.g === cat).forEach(f => rows.push({ label: f.n, grp: cat, cells: P.map(per => cellOf(f, per)),
      extra: [...P.map(per => { const pl = placeOf(peersIII(f, per), f.n); return pl ? { t: 'n', v: pl.k, z: '0' } : null; }), ...P.map(per => { const pl = placeOf(peersIII(f, per), f.n); return pl ? { t: 'n', v: pl.n, z: '0' } : null; }),
        f.fee != null ? f.fee : null, assetsIII(f) == null ? null : { t: 'n', v: assetsIII(f), z: '#,##0.0' }] }));
    REP.funds.filter(x => x.pl === 'III' && x.g === cat && x.p !== p).forEach(x => rows.push({ label: x.n, calcOnly: true, cells: P.map(per => cellOf(x, per)) }));
  });
  return pairBook({ title: `${labelOf(p)} · ${t.h3}`, cap: document.querySelector('#t3') ? document.querySelector('#t3').closest('section').querySelector('.meta').textContent : '', rowHdr: t.thFund,
    cols: P.map(perLabel), extraCols: [...P.map(per => `${L ? 'Vieta' : 'Rank'}: ${perLabel(per)}`), ...P.map(per => `${L ? 'Fondų sk.' : 'Funds'}: ${perLabel(per)}`), t.thFee, t.thAum], rows,
    meth: [[L ? 'III pakopa' : 'Pillar III', L ? 'Mėnesio pabaigos vieneto vertės (valdytojų ataskaitos, Lietuvos bankas); lape „Vertės“ – tik mėnesių pabaigos.' : 'Month-end unit values (manager reports, Bank of Lithuania); the “Values” sheet holds month ends only.'],
      [L ? 'Vieta' : 'Rank', L ? 'Tarp tos pačios kategorijos (obligacijų, mišrių, akcijų) III pakopos fondų; visų konkurentų skaičiavimai – lape „Skaičiavimai“.' : 'Among pillar III funds of the same category (bond, mixed, equity); all peers’ calculations – in the “Calculations” sheet.']] });
});
/* 10 didžiausių pozicijų – Excel su skaičiavimais: visos valdytojo (fondo) pozicijos ketvirčio pabaigoje (LB) → SUMIFS → dalis */
XLB.set('mgrTop', async () => {
  const pf = pfHTML.last; if (!pf) return null;
  const t = T(), L = lang === 'lt', SP = L ? 'Pozicijos' : 'Holdings', q = `'${SP}'`, pos = [[L ? 'Fondas' : 'Fund', L ? 'Pozicijos ID' : 'Holding ID', L ? 'Pozicija' : 'Holding', 'ISIN', L ? 'Vienetai' : 'Units', L ? 'Vertė, €' : 'Value, €']];
  pf.fs.forEach(f => { for (let i = 0; i < f.r.length; i += 4) if (f.r[i] === pf.qi) { const x = PF.secs[f.r[i + 1]]; pos.push([f.n, f.r[i + 1], x[8] || x[0], x[5] || '', f.r[i + 2] == null ? null : { t: 'n', v: f.r[i + 2], z: '#,##0.##' }, { t: 'n', v: f.r[i + 3], z: '#,##0' }]); } });
  const N = pos.length, res = [[`${labelOf(pf.p)} · ${t.hTop(pf.q)}`], [pf.g ? groupLabel(DATA.groups.find(g => g.id === pf.g) || { id: pf.g }) : t.pfAll], ['#', t.thPos, 'ISIN', t.thType, L ? 'Vertė, €' : 'Value, €', t.thW]];
  pf.top.forEach((x, i) => { const r = res.length + 1, v = x.w / 100 * pf.tot;
    res.push([i + 1, x.s[8] || x.s[0], x.s[5] || '', t.types[x.s[1]] || '', xlF(`SUMIFS(${q}!$F$2:$F$${N},${q}!$B$2:$B$${N},${x.si})`, v, '#,##0'), xlF(`E${r}/SUM(${q}!$F$2:$F$${N})`, x.w / 100, '0.00%')]); });
  const wb = XLSX_SHIM.utils.book_new(), add = (rows, name, w) => { const ws = XLSX_SHIM.utils.aoa_to_sheet(rows); ws['!cols'] = w; XLSX_SHIM.utils.book_append_sheet(wb, ws, name); };
  add(res, L ? 'Rezultatas' : 'Result', [{ wch: 4 }, { wch: 46 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 9 }]); add(pos, SP, [{ wch: 34 }, { wch: 8 }, { wch: 46 }, { wch: 14 }, { wch: 14 }, { wch: 14 }]);
  add([[L ? 'Metodika' : 'Methodology'], [L ? 'Šaltinis' : 'Source', L ? `Lietuvos banko ketvirtinės ataskaitos, ${pf.q}: visos valdytojo II pakopos fondų (ar pasirinkto fondo) pozicijos (lapas „${SP}“).` : `Bank of Lithuania quarterly reports, ${pf.q}: all holdings of the manager’s pillar II funds (or the chosen fund) (sheet “${SP}”).`],
    [L ? 'Dalis' : 'Weight', L ? 'Pozicijos vertė visuose fonduose (SUMIFS pagal pozicijos ID) ÷ visų pozicijų suma.' : 'Holding value across the funds (SUMIFS by holding ID) ÷ sum of all holdings.']], L ? 'Metodika' : 'Methodology', [{ wch: 16 }, { wch: 110 }]);
  return { sheets: XLSX_SHIM.toXL(wb), own: true };
});
renderHeader(CTRY ? 'manager_' + CTRY_COPY.toLowerCase() : 'manager', render);
render();
