/* Bendras kodas visiems puslapiams: kalba, tema, antraštė, pagalbinės funkcijos, linijinė diagrama. */
const DAY = 86400000;
const hEsc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const iso = d => new Date(d * DAY).toISOString().slice(0, 10);
const dayOf = s => Math.round(Date.parse(s + 'T00:00:00Z') / DAY);

const I18N = {
  en: {
    refresh: 'Refresh data', refreshTip: 'Opens the data update on GitHub. Tap “Run workflow”, then the green “Run workflow” button. The site updates about 5 minutes later (only the owner can start it).',
    siteTitle: 'Pension funds', monShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], naTip: 'No value: the fund did not exist yet in that period, or the data is not published', theme: 'Theme', period: 'Period', locale: 'en-GB',
    navIndex: 'Market today', printCozy: 'Print / PDF (as on screen)', printPlain: 'Print / PDF (white, for presentations)', printed: 'printed', printSrc: 'sources and methodology – page “About”', navApie: 'About', navManager: 'Manager & fund', navReview: 'Monthly review', srcPfx: 'Source:', srcMeth: 'Methodology →', srcT: { lbh: 'Bank of Lithuania quarterly pension fund results', nav: 'managers’ unit values', aum: 'managers’ net assets', p3: 'managers’ III pillar values', pf: 'Bank of Lithuania portfolio reports', rep: 'unit values, benchmarks, Bank of Lithuania results report', idx: 'MSCI, S&P, ECB', journey: 'Sodra, State Data Agency, laws', kid: 'SEB KIDs and KID calculation files, SEB unit values, Bloomberg (SOLEBLS EUR), Regulation 2017/653' }, navOverview: 'Overview', navPerformance: 'Performance & peers', navPillar3: 'Pillar III', navPortfolios: 'Portfolios', navAum: 'Assets (AUM)', navReports: 'Reports', navJourney: 'Retirement journey',
    thProvider: 'Manager', thReturn: 'Return', thUnit: 'Unit value', thAssets: 'Net assets, € m',
    dataUntil: 'Data until', updated: 'updated', freshLbl: 'Latest value:',
    freshLate: n => `${n} business day${n === 1 ? '' : 's'} behind the newest data – returns for this provider may be missing or older`,
    foldMore: 'How to read ▾', foldLess: 'Show less ▴', tools: 'Tools', navLbl: 'Pages', themeLight: 'Light theme', themeDark: 'Dark theme', sideOpen: 'Open menu', sideClose: 'Close menu', sideCollapse: 'Collapse menu', sideExpand: 'Expand menu', stLoading: 'Loading data…', stErrT: 'Could not load the data', stErrW: 'The data file did not load (network glitch or the site is being updated). The rest of the page works.', stRetry: 'Try again', stNoSel: 'No funds selected', stNoSelW: 'Select at least one fund above to draw the chart.', stNoPer: 'No data for this period', stNoPerW: 'The selected funds did not exist yet in this period or values are not published. Choose a longer period or other dates.', lateLbl: 'late:', allFresh: n => `all ${n} providers up to date`, freshMore: 'Show each provider’s latest value date',
    srcLbl: 'Other data:', srcLateLbl: 'overdue:', srcBy: d => `next by ${d}`, srcNext: d => `New data expected by ${d} (approximate)`, srcIrreg: 'Updated when the Bank of Lithuania publishes a new file',
    srcK: { p3: 'Pillar III', pf: 'LB portfolio reports', lbr: 'LB results report', fee2: 'LB fees (II)', fee3: 'LB fees (III)', idx: 'Indices', estr: '€STR', cpi: 'Inflation (CPI)' },
    freshOk: 'Up to date', noNew: 'no new data', noData: 'Not enough data for this period.',
    chartLabel: 'Return over the selected period', born: 'Born', turto: 'Payout',
    periods: { '1d': '1 day', '1w': '1 wk', '1m': '1 mo', '3m': '3 mo', '6m': '6 mo', ytd: 'YTD', '1y': '1 yr', '3y': '3 yr', '5y': '5 yr', max: 'All history', custom: 'Custom' },
  },
  lt: {
    refresh: 'Atnaujinti duomenis', refreshTip: 'Atidaro duomenų atnaujinimą GitHub’e. Paspausk „Run workflow“, tada žalią „Run workflow“ mygtuką. Svetainė atsinaujins maždaug po 5 minučių (paleisti gali tik savininkas).',
    siteTitle: 'Pensijų fondai', monShort: ['saus.', 'vas.', 'kov.', 'bal.', 'geg.', 'birž.', 'liep.', 'rugp.', 'rugs.', 'spal.', 'lapkr.', 'gruod.'], naTip: 'Reikšmės nėra: fondas tuo laikotarpiu dar neveikė arba duomenys neskelbti', theme: 'Tema', period: 'Laikotarpis', locale: 'lt-LT',
    navIndex: 'Rinka šiandien', printCozy: 'Spausdinti / PDF (kaip ekrane)', printPlain: 'Spausdinti / PDF (baltas, prezentacijoms)', printed: 'atspausdinta', printSrc: 'šaltiniai ir metodika – puslapis „Apie“', navApie: 'Apie', navManager: 'Valdytojas ir fondas', navReview: 'Mėnesio apžvalga', srcPfx: 'Šaltinis:', srcMeth: 'Metodika →', srcT: { lbh: 'Lietuvos banko ketvirčio pensijų fondų veiklos rezultatai', nav: 'valdytojų vieneto vertės', aum: 'valdytojų grynieji aktyvai', p3: 'valdytojų III pakopos vertės', pf: 'Lietuvos banko portfelių ataskaitos', rep: 'vieneto vertės, lyginamieji indeksai, LB rezultatų ataskaita', idx: 'MSCI, S&P, ECB', journey: 'Sodra, Valstybės duomenų agentūra, įstatymai', kid: 'SEB PID ir PID skaičiavimo failai, SEB vieneto vertės, Bloomberg (SOLEBLS EUR), Reglamentas 2017/653' }, navOverview: 'Apžvalga', navPerformance: 'Rezultatai ir palyginimas', navPillar3: 'III pakopa', navPortfolios: 'Portfeliai', navAum: 'Turtas (AUM)', navReports: 'Ataskaitos', navJourney: 'Kelias į pensiją',
    thProvider: 'Valdytojas', thReturn: 'Grąža', thUnit: 'Vieneto vertė', thAssets: 'Aktyvai, mln. €',
    dataUntil: 'Duomenys iki', updated: 'atnaujinta', freshLbl: 'Paskutinė vertė:',
    freshLate: n => `Atsilieka ${n} d. d. nuo naujausių duomenų – šio tiekėjo grąžos gali nebūti arba ji senesnė`,
    foldMore: 'Kaip skaityti? ▾', foldLess: 'Suskleisti ▴', tools: 'Įrankiai', navLbl: 'Puslapiai', themeLight: 'Šviesi tema', themeDark: 'Tamsi tema', sideOpen: 'Atidaryti meniu', sideClose: 'Uždaryti meniu', sideCollapse: 'Suskleisti meniu', sideExpand: 'Išskleisti meniu', stLoading: 'Kraunami duomenys…', stErrT: 'Duomenų įkelti nepavyko', stErrW: 'Duomenų failas neatsisiuntė (ryšio sutrikimas arba svetainė tuo metu atnaujinama). Kita puslapio dalis veikia.', stRetry: 'Bandyti dar kartą', stNoSel: 'Nepasirinktas nė vienas fondas', stNoSelW: 'Pažymėkite bent vieną fondą virš grafiko.', stNoPer: 'Šiam laikotarpiui duomenų nėra', stNoPerW: 'Pasirinkti fondai tuo metu dar neveikė arba vertės neskelbtos. Pasirinkite ilgesnį laikotarpį arba kitas datas.', lateLbl: 'vėluoja:', allFresh: n => `visi ${n} valdytojai atnaujinti`, freshMore: 'Rodyti kiekvieno valdytojo paskutinės vertės datą',
    srcLbl: 'Kiti duomenys:', srcLateLbl: 'vėluoja:', srcBy: d => `naujų laukiama iki ${d}`, srcNext: d => `Naujų duomenų laukiama iki ${d} (apytiksliai)`, srcIrreg: 'Atnaujinama, kai Lietuvos bankas paskelbia naują failą',
    srcK: { p3: 'III pakopa', pf: 'LB portfelių ataskaitos', lbr: 'LB rezultatų ataskaita', fee2: 'LB mokesčiai (II)', fee3: 'LB mokesčiai (III)', idx: 'Indeksai', estr: '€STR', cpi: 'Infliacija (VKI)' },
    freshOk: 'Duomenys naujausi', noNew: 'nėra naujų duomenų', noData: 'Šiam laikotarpiui duomenų nepakanka.',
    chartLabel: 'Grąžos kitimas pasirinktu laikotarpiu', born: 'Gimę', turto: 'Turto išsaugojimo',
    periods: { '1d': '1 d.', '1w': '1 sav.', '1m': '1 mėn.', '3m': '3 mėn.', '6m': '6 mėn.', ytd: 'Šie metai', '1y': '1 metai', '3y': '3 metai', '5y': '5 metai', max: 'Visa istorija', custom: 'Pasirinktas' },
  },
};
function addStrings(en, lt) { Object.assign(I18N.en, en); Object.assign(I18N.lt, lt); }

let lang = 'lt';                        // numatytoji kalba – lietuvių (auditas #28)
try { const l = localStorage.getItem('lang'); if (l === 'en' || l === 'lt') lang = l; } catch (e) {}
const T = () => I18N[lang];
// Vienas skaičių formatas visur (auditas #31): procentai – visada 2 skaitmenys po kablelio, LT – tarpas prieš %
const pctSfx = () => lang === 'lt' ? ' %' : '%';
const num = (x, p = 2) => x.toLocaleString(T().locale, { minimumFractionDigits: p, maximumFractionDigits: p });
const pct = (x, p = 2) => (x >= 0 ? '+' : '−') + num(Math.abs(x), 2) + pctSfx();
const pctPlain = (x, p = 1) => (x < 0 ? '−' : '') + num(Math.abs(x), 2) + pctSfx();
const colorOf = id => `var(--s${DATA.providers.findIndex(p => p.id === id) + 1})`;
const labelOf = id => DATA.providers.find(p => p.id === id).label;
const CAT3 = { lt: { bond: 'Obligacijų fondai', mixed: 'Mišraus investavimo fondai', equity: 'Akcijų fondai' }, en: { bond: 'Bond funds', mixed: 'Mixed funds', equity: 'Equity funds' } };
const groupLabel = g => g.id === 'turto' ? T().turto : (CAT3[lang] || CAT3.lt)[g.id] || g.id.replace('-', '–');

try { const t = localStorage.getItem('theme'); if (t) document.documentElement.dataset.theme = t; } catch (e) {}

/* „Atnaujinti duomenis“ mygtukas rodomas tik savininko naršyklėje: įjungiama vieną kartą atidarius bet kurį puslapį su ?owner=1
   (išjungiama ?owner=0). Tai tik paslėpimas, ne apsauga: paleisti atnaujinimą GitHub'e vis tiek gali tik savininkas. */
function isOwner() {
  try {
    const q = new URLSearchParams(location.search).get('owner');
    if (q === '1') localStorage.setItem('owner', '1');
    if (q === '0') localStorage.removeItem('owner');
    return localStorage.getItem('owner') === '1';
  } catch (e) { return false; }
}
// Navigacijos ikonos (auditas #41): paprastos linijinės, spalva – kaip teksto
const NAV_ICONS = {
  apie: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  index: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
  manager: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  review: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 14h3M8 17h6"/>',
  performance: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  pillar3: '<path d="M12 3 2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5"/>',
  aum: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
  portfolios: '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  reports: '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  journey: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
};
const NAV_PAGES = ['index', 'review', 'ops', 'performance', 'performance3', 'manager', 'overview', 'pillar3', 'aum', 'portfolios', 'reports', 'journey', 'apie'];
const navKey = p => 'nav' + p[0].toUpperCase() + p.slice(1);
const svgI = (body, s = 16) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
const MOON = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
const MENU = '<path d="M4 6h16M4 12h16M4 18h16"/>', CHEV_L = '<path d="M15 6l-6 6 6 6"/>';
/* Šoninio meniu elgsena: suskleidimas (kompiuteryje, įsimenamas), ištraukimas (≤ 1000 px), Esc ir fokusavimas klaviatūrai */
const SIDE_MQ = matchMedia('(max-width: 1000px)');
try { if (localStorage.getItem('side') === 'mini') document.documentElement.classList.add('side-mini'); } catch (e) {}
function sideLabels() {
  const t = T(), el = document.documentElement, tg = document.getElementById('sideTg'), mb = document.getElementById('menuBtn'); if (!tg) return;
  const mini = el.classList.contains('side-mini') && !SIDE_MQ.matches, open = el.classList.contains('side-open');
  tg.title = SIDE_MQ.matches ? t.sideClose : mini ? t.sideExpand : t.sideCollapse; tg.setAttribute('aria-label', tg.title);
  tg.querySelector('.nl').textContent = SIDE_MQ.matches ? t.sideClose : t.sideCollapse;
  tg.setAttribute('aria-expanded', SIDE_MQ.matches ? open : !mini);
  if (mb) { mb.title = t.sideOpen; mb.setAttribute('aria-label', t.sideOpen); mb.setAttribute('aria-expanded', open); }
  document.getElementById('side').querySelectorAll('.nav a[data-s]').forEach(a => a.title = mini ? (t.secNav[a.dataset.s] || '') : '');
}
function sideUI(side, scrim) {
  const el = document.documentElement, mb = () => document.getElementById('menuBtn');
  const setOpen = (on, focus) => {
    el.classList.toggle('side-open', on); scrim.hidden = !on; sideLabels();
    if (on && focus) (side.querySelector('.nav [aria-current]') || side.querySelector('a')).focus();
    if (!on && focus && mb()) mb().focus();
  };
  document.getElementById('sideTg').addEventListener('click', () => {
    if (SIDE_MQ.matches) return setOpen(false, true);
    const mini = el.classList.toggle('side-mini');
    try { localStorage.setItem('side', mini ? 'mini' : 'full'); } catch (e) {}
    sideLabels(); setTimeout(() => { window.dispatchEvent(new Event('resize')); if (typeof fitSticky === 'function') fitSticky(); }, 220);   // grafikai ir lentelės – pagal naują plotį
  });
  mb().addEventListener('click', () => setOpen(!el.classList.contains('side-open'), true));
  scrim.addEventListener('click', () => setOpen(false, true));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && el.classList.contains('side-open')) setOpen(false, true); });
  SIDE_MQ.addEventListener('change', () => setOpen(false, false));
}

/* Antraštė (auditas #41): ženkliukas ir pavadinimas, šviežumo eilutė, lipni navigacija vienoje eilutėje su ikonomis,
   įrankiai – „⋯ Įrankiai“ meniu, kalba ir tema – ikonos kampe. onLang – iš naujo nupiešia puslapį. */
function renderHeader(active, onLang) {
  const h = document.getElementById('top');
  document.body.dataset.page = active;
  h.innerHTML = `<div class="hrow"><button class="btn ico menu-btn" type="button" id="menuBtn" aria-controls="side" aria-expanded="false">${svgI(MENU)}</button><a class="brand" href="index.html"><img src="favicon.svg" width="28" height="28" alt=""><h1 id="title"></h1></a>
    <div class="srch"><svg class="qico" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" id="q" autocomplete="off" aria-expanded="false" aria-controls="qPanel"><kbd>/</kbd><div class="qpanel" id="qPanel" hidden></div></div>
    <div class="top-tools"><div class="tmwrap"><button class="btn" type="button" id="tmBtn" aria-expanded="false" aria-haspopup="true"></button>
      <div class="tmpanel" id="tmPanel" hidden><div class="tm-acts" id="tmActs"></div>
        <a class="btn" id="opsLink" href="ops.html"></a>
        <a class="btn" id="refresh" hidden href="https://github.com/VytisCode/pension-fund-tracker/actions/workflows/update.yml" target="_blank" rel="noopener">↻ <span></span></a>
        <div class="dlwrap"><button class="btn" type="button" id="dlBtn" aria-expanded="false"></button><div class="dlpanel" id="dlPanel" hidden></div></div></div></div>
      <button class="btn ico" type="button" id="lang"></button><button class="btn ico" type="button" id="theme"></button></div></div>
    <div class="status"><button type="button" class="stbtn" id="stBtn" aria-expanded="false"></button><span class="sub" id="sub"></span></div>
    <div class="fresh" id="fresh" hidden></div>`;
  /* Šoninis meniu (UI atnaujinimas 2026-10-17): kompiuteryje – kairėje, suskleidžiamas iki ikonų juostos (įsimenama);
     planšetėje ir telefone – ištraukiamas mygtuku ☰. Viršuje lieka lipni juosta su skyriaus puslapiais ir skirtukais. */
  const nav = document.createElement('nav');
  nav.className = 'snav'; nav.id = 'snav';
  const sec = SECTIONS.find(s => s.pages.includes(active));
  const subs = s => s.pages.filter(p => p !== 'ops' || active === 'ops');   // Duomenų kalendorius – įrankių meniu (kolegoms nereikalingas)
  nav.innerHTML = sec && sec.pages.length > 1 ? `<div class="subnav">${subs(sec).map(p => `<a href="${p}.html" data-p="${p}"></a>`).join('')}</div>` : '';
  h.after(nav);
  const side = document.createElement('aside');
  side.className = 'side'; side.id = 'side';
  side.innerHTML = `<button class="side-tg" type="button" id="sideTg" aria-controls="side">${svgI(CHEV_L)}<span class="nl"></span></button>`
    + `<div class="nav">${SECTIONS.map(s => `<a href="${s.pages[0]}.html" data-s="${s.id}">${svgI(NAV_ICONS[s.icon])}<span class="nl"></span></a>`
      + (s === sec && s.pages.length > 1 ? `<div class="side-sub">${subs(s).map(p => `<a href="${p}.html" data-p="${p}"></a>`).join('')}</div>` : '')).join('')}`
    + `<a href="apie.html" data-s="about" class="nav-about">${svgI(NAV_ICONS.apie)}<span class="nl"></span></a></div>`;
  const scrim = document.createElement('div'); scrim.className = 'side-scrim'; scrim.hidden = true;
  document.body.prepend(side, scrim);
  sideUI(side, scrim);
  const acts = document.getElementById('actions');
  if (acts) document.getElementById('tmActs').append(acts);   // puslapio veiksmų mygtukai (Kopijuoti, Excel, Spausdinti) – į meniu
  /* Spausdinimas (auditas #51): du dizainai – jaukus (kaip ekrane) ir baltas (prezentacijoms); antraštė su data ir šaltiniais */
  const pr = document.createElement('div'); pr.className = 'tm-print';
  pr.innerHTML = '<button class="btn" type="button" data-p="cozy"></button><button class="btn" type="button" data-p="plain"></button>';
  document.getElementById('tmActs').append(pr);
  pr.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; document.documentElement.dataset.print = b.dataset.p; tmShow(false); setTimeout(() => window.print(), 50); });
  addEventListener('afterprint', () => { delete document.documentElement.dataset.print; });
  const ph = document.createElement('div'); ph.className = 'printhead'; h.prepend(ph);
  const fillPh = () => { const t = T(); ph.innerHTML = `<b>${t.siteTitle} · ${t[navKey(active)]}</b> · ${typeof FRESH !== 'undefined' ? `${t.dataUntil} ${iso(FRESH.top)} · ` : ''}${t.printed} ${new Date().toISOString().slice(0, 10)} · ${t.printSrc}`; };
  addEventListener('beforeprint', fillPh);
  const tmb = document.getElementById('tmBtn'), tmp = document.getElementById('tmPanel');
  const tmShow = on => { tmp.hidden = !on; tmb.setAttribute('aria-expanded', on); };
  const el = document.documentElement, isDark = () => el.dataset.theme === 'dark' || (!el.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const apply = () => {
    el.lang = lang;
    const t = T();
    document.getElementById('title').textContent = t.siteTitle;
    document.getElementById('opsLink').textContent = '🗓 ' + t.navOps;
    const rb = document.getElementById('refresh'); rb.title = t.refreshTip; rb.querySelector('span').textContent = t.refresh; rb.hidden = !isOwner();
    const lb = document.getElementById('lang');
    lb.textContent = lang === 'lt' ? 'EN' : 'LT'; lb.title = lang === 'lt' ? 'English' : 'Lietuviškai'; lb.setAttribute('aria-label', lb.title);
    const tb = document.getElementById('theme'), dark = isDark();
    tb.innerHTML = svgI(dark ? SUN : MOON); tb.title = dark ? t.themeLight : t.themeDark; tb.setAttribute('aria-label', tb.title);
    nav.setAttribute('aria-label', t.navLbl);
    sideLabels();
    side.querySelectorAll('.nav a[data-s]').forEach(a => {
      a.querySelector('.nl').textContent = t.secNav[a.dataset.s]; a.title = t.secNav[a.dataset.s];
      if ((sec && a.dataset.s === sec.id) || (active === 'apie' && a.dataset.s === 'about')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('.subnav a, .side-sub a').forEach(a => {
      a.textContent = t.subNav[a.dataset.p];
      if (a.dataset.p === active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    const qb = document.getElementById('q'); qb.placeholder = t.qPh; qb.setAttribute('aria-label', t.qPh);
    document.title = `${t[navKey(active)]} · ${t.siteTitle}`;   // savas pavadinimas kiekvienam puslapiui (auditas #26)
    document.getElementById('tmBtn').innerHTML = `⋯<span class="tml"> ${t.tools}</span>`; document.getElementById('tmBtn').title = t.tools;
    pr.querySelector('[data-p=cozy]').textContent = '🖶 ' + t.printCozy; pr.querySelector('[data-p=plain]').textContent = '🖶 ' + t.printPlain;
    document.getElementById('dlBtn').textContent = '⬇ ' + t.dlBtn; if (!document.getElementById('dlPanel').hidden) dlRender();
    freshRender();
  };
  document.getElementById('lang').addEventListener('click', () => {
    lang = lang === 'lt' ? 'en' : 'lt'; try { localStorage.setItem('lang', lang); } catch (e) {}
    apply(); onLang();
  });
  document.getElementById('theme').addEventListener('click', () => {
    el.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', el.dataset.theme); } catch (e) {}
    apply();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);
  tmb.addEventListener('click', () => tmShow(tmp.hidden));
  const dlb = document.getElementById('dlBtn'), dlp = document.getElementById('dlPanel');
  dlb.addEventListener('click', () => { dlp.hidden = !dlp.hidden; dlb.setAttribute('aria-expanded', !dlp.hidden); if (!dlp.hidden) dlRender(); });
  document.addEventListener('click', e => { if (e.isTrusted && !tmp.hidden && !e.target.closest('.tmwrap')) tmShow(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !tmp.hidden) { tmShow(false); tmb.focus(); } });
  const sb = document.getElementById('stBtn'), fr = document.getElementById('fresh');
  sb.addEventListener('click', () => { fr.hidden = !fr.hidden; sb.setAttribute('aria-expanded', !fr.hidden); });
  if (typeof FRESH === 'undefined') {     // šviežumo duomenys – mažas bendras failas, kraunamas visuose puslapiuose
    const s = document.createElement('script');
    s.src = 'data_fresh.js?h=' + new Date().toISOString().slice(0, 13).replace(/\D/g, '');
    s.onload = freshRender; document.head.append(s);
  }
  apply();
  const row = nav.querySelector('.subnav');
  if (row) { const act = row.querySelector('[aria-current]'); if (act && row.scrollWidth > row.clientWidth) row.scrollLeft = act.offsetLeft - 16;   // telefone aktyvus puslapis matomas
    row.addEventListener('scroll', () => scrollEdges(row), { passive: true }); scrollEdges(row); }
  searchUI(); goTo();
  return apply;
}

/* Duomenų šviežumas: kiekvieno tiekėjo seniausia iš paskutinių fondų verčių dienų (uždaryti fondai,
   neatnaujinti > 30 d., neskaičiuojami). Atsiliekantys nuo naujausios dienos paryškinami. */
// Lentelių antraštės lieka matomos slenkant (auditas #20). Telpanti lentelė – antraštė prilimpa ekrano viršuje (po lipnia juosta);
// platesnė už ekraną – lentelė gauna aukščio ribą, o antraštė prilimpa jos viduje
function fitSticky() {
  const nav = document.getElementById('snav'), navh = nav && getComputedStyle(nav).position === 'sticky' ? nav.offsetHeight : 0;   // lipni navigacija (auditas #41)
  const bar = [...document.querySelectorAll('.bar.sticky, .jnav')].find(b => getComputedStyle(b).position === 'sticky');
  document.documentElement.style.setProperty('--navh', navh + 'px');
  if (nav) nav.querySelectorAll('.nav, .pnav').forEach(scrollEdges);
  document.documentElement.style.setProperty('--stick', navh + (bar ? bar.offsetHeight : 0) + 'px');
  document.querySelectorAll('.scroll').forEach(sc => {
    if (!sc.querySelector('thead')) return;
    sc.classList.remove('stick', 'stickbox', 'freeze');
    const fits = sc.scrollWidth <= sc.clientWidth + 1 && getComputedStyle(sc).maxHeight === 'none';   // savo aukščio ribą turinčios lentelės lieka dėžutėje
    sc.classList.add(fits ? 'stick' : 'stickbox');
    const th0 = sc.querySelector('thead th');   // pirmas stulpelis užšaldomas, kai jame pavadinimas (ne siauras numeris)
    sc.classList.toggle('freeze', !fits && !!th0 && th0.offsetWidth >= 80 && th0.offsetWidth < sc.clientWidth / 2);
    if (!sc.dataset.edges) { sc.dataset.edges = 1; sc.addEventListener('scroll', () => scrollEdges(sc), { passive: true }); }
    scrollEdges(sc);
    sc.querySelectorAll('thead tr').forEach((tr, i, rows) => tr.style.setProperty('--rowoff', (i ? rows[i - 1].offsetTop + rows[i - 1].offsetHeight - rows[0].offsetTop : 0) + 'px'));   // kelių eilučių antraštė
  });
  // „–“ langeliai: užuomina, kodėl reikšmės nėra (auditas #49)
  document.querySelectorAll('td').forEach(td => { if (!td.title && td.textContent.trim() === '–') td.title = T().naTip; });
}
// plačios lentelės: šešėlis prie užšaldyto pirmo stulpelio ir išblukęs dešinys kraštas rodo, kad galima slinkti į šonus (auditas #21, #22)
function scrollEdges(sc) {
  sc.classList.toggle('sl', sc.scrollLeft > 1);
  sc.classList.toggle('sr', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 1);
}
// Ilgi paaiškinimai po lentelėmis (auditas #45): matomas pirmas sakinys, likusi dalis – po „Kaip skaityti? ▾“.
// Puslapiui perrašius pastabą (kalba, laikotarpis), ji suskleidžiama iš naujo; atskleista lieka atskleista.
const foldOpen = new Set();
const NO_STOP = /(^|[\s(„“\"])([^\s(„“\"]{1,3}|angl|proc|pvz|plg|apyt)$/i;     // „2025 m.“, „mėn.“, „mln.“, „pvz.“ – ne sakinio pabaiga
function foldNotes() {
  document.querySelectorAll('p.note, div.note').forEach((n, i) => {
    if (n.hidden || n.querySelector('.nt-btn') || n.closest('.tmpanel')) return;
    const len = n.textContent.length; if (len < 170) return;
    const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let seen = 0, node, at = -1;
    while (at < 0 && (node = w.nextNode())) {
      const re = /[.!?](?=\s)/g; let m;
      while ((m = re.exec(node.data))) if (seen + m.index >= 40 && !NO_STOP.test(node.data.slice(0, m.index))) { at = m.index + 1; break; }
      if (at < 0) seen += node.data.length;
    }
    if (at < 0 || len - seen - at < 60) return;            // vienas ilgas sakinys arba trumpa uodega – nesuskleidžiame
    const r = document.createRange(); r.setStart(node, at); r.setEnd(n, n.childNodes.length);
    const rest = document.createElement('span'); rest.className = 'nt-rest'; rest.append(r.extractContents());
    const key = n.id || 'n' + i, btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'nt-btn';
    const show = on => { rest.hidden = !on; btn.textContent = on ? T().foldLess : T().foldMore; btn.setAttribute('aria-expanded', on); };
    btn.addEventListener('click', () => { const on = rest.hidden; if (on) foldOpen.add(key); else foldOpen.delete(key); show(on); });
    n.append(rest, ' ', btn); show(foldOpen.has(key));
  });
}
{ let q = 0; const later = () => { if (!q) q = requestAnimationFrame(() => { q = 0; foldNotes(); fitSticky(); }); };
  addEventListener('DOMContentLoaded', () => { new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); later(); });
  addEventListener('resize', later); }
function businessDaysBetween(a, b) {      // darbo dienos intervale (a, b]
  let n = 0; for (let d = a + 1; d <= b; d++) { const w = new Date(d * DAY).getUTCDay(); if (w !== 0 && w !== 6) n++; }
  return n;
}
// Kortelės antraštė – automatinė išvada (auditas #44): išvada stambiau, po ja mažiau – lentelės pavadinimas. Tuščias tekstas – išvados nėra
function setConcl(hid, html) {
  const h = document.getElementById(hid); if (!h) return;
  let c = h.previousElementSibling && h.previousElementSibling.classList.contains('concl') ? h.previousElementSibling : null;
  if (!html) { if (c) c.remove(); return; }
  if (!c) { c = document.createElement('p'); c.className = 'concl'; h.before(c); }
  c.innerHTML = html;
}
/* Vidinė puslapio navigacija (auditas #43): antra lipnios navigacijos eilutė su nuorodomis į skyrius; paryškinamas matomas skyrius.
   items – [{ id: antraštės id, label }]; kviečiama iš naujo pakeitus kalbą. Nieko neslepia – tik greitas perėjimas. */
function addSubnav(items) {
  const nav = document.getElementById('snav'); if (!nav) return;
  let pn = nav.querySelector('.pnav');
  if (!pn) {
    pn = document.createElement('div'); pn.className = 'pnav'; nav.append(pn);
    pn.addEventListener('click', e => {
      const a = e.target.closest('a'); if (!a) return;
      const el = pnTarget(a.dataset.id); if (!el) return;
      e.preventDefault();
      if (hasTabs()) { showTab(paneOf(el), true); return; }
      const stick = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stick')) || 0;
      scrollTo({ top: el.getBoundingClientRect().top + scrollY - stick - 12, behavior: 'smooth' });
    });
    pn.addEventListener('scroll', () => scrollEdges(pn), { passive: true });
    let q = 0; addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(() => { q = 0; pnSpy(); }); }, { passive: true });
  }
  pn.innerHTML = items.filter(x => !hasTabs() || paneOf(document.getElementById(x.id))).map(x => `<a href="#${x.id}" data-id="${x.id}">${x.label}</a>`).join('');
  pn.classList.toggle('tabs', hasTabs());
  if (hasTabs()) { if (!TAB_CUR) showTab(tabStart(), false); else markTab(); } else pnSpy();
  scrollEdges(pn);
}
/* ---------- Puslapio skirtukai (savininkas 2026-10-16: „per daug painus“): ilgas puslapis padalijamas į dalis [data-tab],
   rodoma viena; vidinė navigacija (pnav) tampa skirtukais. Pasirinkimas įsimenamas; paieška (#go=) atidaro reikiamą skirtuką. ---------- */
let TAB_CUR = null;
const hasTabs = () => !!document.querySelector('main [data-tab], .wrap > [data-tab]');
const paneOf = el => { const p = el && el.closest('[data-tab]'); return p ? p.dataset.tab : null; };
const tabKey = () => 'tab:' + (document.body.dataset.page || location.pathname.split('/').pop());
function tabStart() {
  const panes = [...document.querySelectorAll('[data-tab]')].map(p => p.dataset.tab);
  let k = null; try { k = localStorage.getItem(tabKey()); } catch (e) {}
  return panes.includes(k) ? k : panes[0];
}
function markTab() {
  const pn = document.querySelector('#snav .pnav'); if (!pn) return;
  pn.querySelectorAll('a').forEach(a => { const on = paneOf(pnTarget(a.dataset.id)) === TAB_CUR; if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
}
function openPane(id) {                   // atidaro skirtuką su elementu ir nuslenka prie jo
  const el = document.getElementById(id); if (!el) return;
  if (hasTabs() && paneOf(el)) showTab(paneOf(el), true);
  setTimeout(() => el.scrollIntoView({ block: 'start', behavior: 'smooth' }), 30);
}
function showTab(k, user) {
  if (!k) return;
  const prev = TAB_CUR; TAB_CUR = k;
  document.querySelectorAll('[data-tab]').forEach(p => { p.hidden = p.dataset.tab !== k; });
  document.body.dataset.ptab = k;
  markTab();
  if (user) { try { localStorage.setItem(tabKey(), k); } catch (e) {} }
  if (prev !== k) {
    window.dispatchEvent(new Event('resize'));           // grafikai perpiešiami pagal matomą plotį
    if (typeof chartTools === 'function') setTimeout(() => { try { chartTools(); tableTools(); } catch (e) {} }, 60);
    if (user) { const top = (document.getElementById('snav') || document.body).getBoundingClientRect().bottom + scrollY; if (scrollY > top) scrollTo({ top: Math.max(0, top - 80) }); }
  }
}
const pnTarget = id => { const h = document.getElementById(id); if (!h) return null; const c = h.previousElementSibling; return c && c.classList.contains('concl') ? c : h; };
function pnSpy() {
  const pn = document.querySelector('#snav .pnav'); if (!pn) return;
  const stick = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stick')) || 0;
  let cur = null;
  pn.querySelectorAll('a').forEach(a => { const el = pnTarget(a.dataset.id); if (el && el.offsetParent && el.getBoundingClientRect().top <= stick + 60) cur = a; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) cur = pn.lastElementChild;   // puslapio apačia – paskutinis skyrius
  pn.querySelectorAll('a').forEach(a => { if (a === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  if (cur && pn.scrollWidth > pn.clientWidth && (cur.offsetLeft < pn.scrollLeft || cur.offsetLeft + cur.offsetWidth > pn.scrollLeft + pn.clientWidth)) pn.scrollLeft = cur.offsetLeft - 16;
}
/* Šviežumo eilutė: „Duomenys iki … · visi 6 valdytojai atnaujinti ✓“ arba vėluojantis valdytojas geltonai.
   Valdytojo diena – seniausia iš jo fondų paskutinių dienų; atsiliekantys nuo naujausios dienos paryškinami. */
function freshRender() {
  const sb = document.getElementById('stBtn');
  if (!sb || typeof FRESH === 'undefined') return;
  const t = T(), late = FRESH.providers.map(p => ({ ...p, lag: businessDaysBetween(p.d, FRESH.top) })).filter(p => p.lag);
  sb.innerHTML = `${t.dataUntil} <b>${iso(FRESH.top)}</b> · ` + (late.length
    ? `<span class="late">${t.lateLbl} ${late.map(p => `${hEsc(p.label)} (${iso(p.d).slice(5)})`).join(', ')} <span class="chev">▾</span></span>`
    : `<span class="ok">${t.allFresh(FRESH.providers.length)} ✓ <span class="chev">▾</span></span>`);
  sb.title = t.freshMore;
  const nl = noticesList(), nA = nl.filter(x => x.lvl === 'act').length, nW = nl.filter(x => x.lvl === 'wait' && !x.id.startsWith('nav-')).length;
  if (nA || nW) sb.innerHTML += ` <span class="late">· ${NTH().sum(nA, nW)}</span>`;
  document.getElementById('fresh').innerHTML = noticesHTML(nl) + freshnessHTML() + srcHTML()
    + `<div class="fr-src"><a href="ops.html">${lang === 'lt' ? 'Duomenų kalendorius: kas ir kada atkeliavo, kas nepavyko, kas laukia →' : 'Data calendar: what arrived when, what failed, what is coming →'}</a></div>`;
  noticeBar(nl);
  srcLines();
}
/* Po lentele – „Šaltinis: …, data · Metodika →“ (auditas #55): elementams su data-src (raktas = „Apie“ skyriaus id) */
function srcLines() {
  const t = T(), dOf = k => {
    if (typeof FRESH === 'undefined') return '';
    if (k === 'nav' || k === 'aum' || k === 'journey') return iso(FRESH.top);
    const x = (FRESH.src || []).find(v => v.k === ({ rep: 'lbr', lbh: 'lbr' }[k] || k)); return x ? iso(x.d) : '';
  };
  document.querySelectorAll('[data-src]').forEach(el => {
    const k = el.dataset.src; let p = el.querySelector(':scope > p.srcl');
    if (!p) { p = document.createElement('p'); p.className = 'srcl'; el.append(p); }
    const d = dOf(k);
    p.innerHTML = `${t.srcPfx} ${t.srcT[k] || ''}${d ? ', ' + d : ''} · <a href="apie.html#${k}">${t.srcMeth}</a>`;
  });
}
/* Kitų duomenų šviežumas (auditas #54): data ir kada laukiama naujų; pavėlavę – antraštės juostoje */
const srcToday = () => Math.floor(Date.now() / DAY);
const srcLate = () => (FRESH.src || []).filter(x => x.next && srcToday() > x.next);
function srcHTML() {
  const t = T(); if (!FRESH.src || !FRESH.src.length) return '';
  return `<div class="fr-src"><span class="fr-l">${t.srcLbl}</span>` + FRESH.src.map(x => {
    if (x.k === 'idx' && FRESH.idx) {          // indeksai – kiekvieno data atskirai (paaiškinimas – pranešimuose)
      const nm = NTH().idxName, grp = {};
      Object.entries(FRESH.idx).forEach(([k, d]) => { (grp[iso(d).slice(5)] = grp[iso(d).slice(5)] || []).push(nm[k] || k); });
      return `<span class="fr" style="white-space:normal">${t.srcK.idx}: ${Object.entries(grp).sort((a, b) => b[0].localeCompare(a[0])).map(([d, ks]) => `${ks.join(', ')} ${d}`).join(' · ')}</span>`;
    }
    const late = x.next && srcToday() > x.next, d = x.k === 'cpi' ? iso(x.d).slice(0, 7) : iso(x.d);
    return `<span class="fr${late ? ' late' : ''}" title="${x.next ? t.srcNext(iso(x.next)) : t.srcIrreg}">${t.srcK[x.k]} ${d}${x.next ? ` <small>· ${t.srcBy(iso(x.next))}</small>` : ''}${late ? ' ⚠' : ''}</span>`;
  }).join('') + '</div>';
}
/* ---------- pranešimai apie duomenis (savininko užduotis 2026-10-16) ----------
   Kiekvienam vėluojančiam ar sutrikusiam duomeniui: kas tai, kodėl vėluoja (data/source_status.json), ką tai įtakoja,
   ar reikia ką nors daryti ir ką. Lygiai: info – galima ignoruoti, wait – laukiama (veiksmų nereikia), act – reikia veiksmo.
   „Reikia veiksmo“ pranešimai rodomi juosta virš puslapio, kol vartotojas paspaudžia „Šiandien nerodyti“. */
const NT = {
  lt: {
    lvl: { info: 'Galima ignoruoti', wait: 'Laukiama – nieko daryti nereikia', act: 'Reikia veiksmo' },
    what: 'Kas tai', why: 'Kodėl', impact: 'Ką įtakoja', todo: 'Ką daryti', open: 'Atidaryti šaltinį', hdr: 'Pranešimai',
    sum: (a, w) => [a ? `⚠ ${a} reikia veiksmo` : '', w ? `${w} laukiama` : ''].filter(Boolean).join(', '),
    barMore: 'Plačiau', barHide: 'Šiandien nerodyti', owner: 'Tai darbas svetainės prižiūrėtojui; kitiems lankytojams nieko daryti nereikia.',
    cause: { blocked: s => `Šaltinis atmeta automatines užklausas (nuo ${s}).`, auth: s => `Neveikia prieiga prie šaltinio (nuo ${s}).`,
             network: s => `Šaltinis nepasiekiamas (nuo ${s}); dažniausiai tai laikina.`, format: s => `Šaltinio puslapis tikriausiai pasikeitė – rinkimą reikia pataisyti (nepavyksta nuo ${s}).`,
             other: s => `Automatinis rinkimas nepavyksta (nuo ${s}).` },
    navT: (p, d) => `${p}: vertės iki ${d}`,
    navWhat: p => `${p} II pakopos fondų vieneto vertės. Valdytojas jas skelbia savo svetainėje kiekvieną darbo dieną (už praėjusią), dažniausiai po pietų; čia jos surenkamos automatiškai kas 30 min.`,
    navWait: 'Valdytojas dar nepaskelbė naujos vertės arba ji dar nesurinkta – tai įprasta iki vakaro.',
    navImpact: (p, d) => `${p} grąža skaičiuojama iki ${d}, kitų valdytojų – iki naujesnės dienos, todėl šiandienos palyginimai su ${p} truputį netikslūs. Kiti duomenys nepaveikti.`,
    navTodoWait: 'Nieko – sistema bandys dar kartą automatiškai.',
    navTodoAct: p => `Patikrinkite, ar ${p} svetainėje vertė jau paskelbta (nuoroda žemiau). Jei paskelbta, bet čia jos nėra – praneškite Claude: rinkimą reikia pataisyti.`,
    allT: d => `Visi valdytojai: vertės iki ${d}`,
    allWhat: 'Nė vieno valdytojo naujų verčių kelias darbo dienas – greičiausiai sustojo automatinis rinkimas.',
    allImpact: 'Visos grąžos ir palyginimai rodomi iki šios dienos.',
    allTodo: 'Praneškite Claude – tikėtina, kad sustojo kasdienis paleidimas.',
    proxyT: 'Luminor duomenų prieiga (proxy) neveikia',
    proxyWhat: 'Luminor svetainė blokuoja automatinį skaitymą, todėl jos duomenys renkami per mokamą tarpinį serverį (proxy).',
    proxyWhy: s => `Nuo ${s} prisijungti prie proxy nepavyksta – greičiausiai baigėsi prenumerata arba pasikeitė prisijungimo duomenys.`,
    proxyImpact: 'Luminor II ir III pakopos vertės nebeatsinaujina; Luminor grąža ir vietos rodomos iki paskutinės gautos dienos.',
    proxyTodo: '1) Prisijunkite prie proxy paslaugos paskyros ir patikrinkite, ar prenumerata galioja. 2) Jei atnaujinote prenumeratą ar gavote naujus prisijungimo duomenis – perduokite juos Claude (ar įrašykite projekto nustatymuose). 3) Jei nenorite mokėti – praneškite Claude: Luminor vertes tada galima įkelti rankiniu būdu.',
    idxT: (n, d) => `Indeksas ${n}: iki ${d}`,
    idxName: { MSCI_WORLD: 'MSCI World', MSCI_ACWI: 'MSCI ACWI', SP500: 'S&P 500 (eurais)', EUR_GOV7Y: 'Euro obligacijų (7 m.)' },
    idxWhat: { MSCI_WORLD: 'Išsivysčiusių šalių akcijų indeksas (MSCI) – palyginimo linija grafikuose.', MSCI_ACWI: 'Viso pasaulio akcijų indeksas (MSCI) – palyginimo linija grafikuose ir KID scenarijų pagrindas.',
               SP500: 'JAV akcijų indeksas S&P 500 su dividendais, perskaičiuotas eurais pagal ECB kursą (įprastai vėluoja 1–3 d.).', EUR_GOV7Y: 'Euro zonos AAA obligacijų indeksas iš ECB pajamingumo kreivės – naudojamas KID scenarijams.' },
    estT: (n, d) => `${n}: nuo ${d} – apytikslės vertės`,
    estWhy: d => `Tikslių S&P 500 su dividendais verčių po ${d} negauta, todėl jos pratęstos pagal oficialų S&P 500 kainų indeksą (FRED / Stooq), pridedant ~1,3 % metinių dividendų ir perskaičiuojant ECB kursu.`,
    estImpact: 'Tik S&P 500 palyginimo linija paskutinėmis dienomis – paklaida paprastai iki kelių šimtųjų procento. Fondų rezultatams įtakos nėra.',
    estTodo: 'Nieko – gavus tikslias vertes, jos automatiškai pakeis apytiksles.',
    idxImpact: 'Tik indekso palyginimo linija „Rezultatų“ grafikuose ir lentelėse baigiasi anksčiau. Fondų grąžoms, vietoms ir reitingams įtakos nėra.',
    idxTodo: 'Nieko – galima ignoruoti. Sistema bando kasdien; jei sutrikimas ilgas, Claude pataisys rinkimą (matysite dienos ataskaitoje).',
    estrWhat: 'Euro nerizikinga palūkanų norma (ECB) – naudojama tik Sharpe koeficientui.', estrImpact: 'Sharpe koeficientas skaičiuojamas su paskutine turima norma; skirtumas paprastai nežymus.',
    cpiWhat: 'Lietuvos vartotojų kainų indeksas (Valstybės duomenų agentūra) – realiai (be infliacijos) grąžai.', cpiImpact: 'Reali grąža naujausiems mėnesiams skaičiuojama su paskutiniu paskelbtu indeksu.',
    p3What: 'III pakopos fondų vieneto vertės (valdytojų svetainės).', p3Impact: 'III pakopos puslapis rodo vertes iki šios dienos.',
    lbWhat: 'Lietuvos banko ketvirtinė ataskaita (skelbiama apie 3 mėn. po ketvirčio pabaigos); čia parsisiunčiama automatiškai kasdien.',
    lbImpact: { pf: 'Puslapiuose „Portfeliai“ ir „Ataskaitos“ rodomas ankstesnis ketvirtis.', lbr: 'Ataskaitų lentelėse rizikingo turto dalis ir išlaidų rodikliai – ankstesnio ketvirčio.' },
    lbTodo: 'Dažniausiai nieko – Lietuvos bankas dar nepaskelbė. Jei banko svetainėje failas jau yra (nuoroda žemiau), o čia per 2 d. neatsirado – praneškite Claude.',
    srcTodo: 'Nieko – duomenys atsinaujins automatiškai, kai šaltinis paskelbs naujus.',
    lateT: (n, d) => `${n}: duomenys iki ${d}`,
    manT: n => `Priminimas: ${n}`, manWhat: f => `Šie duomenys atnaujinami rankiniu būdu (${f}).`,
    manDue: d => `Atnaujinti iki ${d}.`, manOver: d => `Turėjo būti atnaujinta iki ${d}.`, manImpact: 'Kol neatnaujinta, svetainė naudoja ankstesnes reikšmes.',
  },
  en: {
    lvl: { info: 'Can be ignored', wait: 'Waiting – nothing to do', act: 'Action needed' },
    what: 'What it is', why: 'Why', impact: 'What it affects', todo: 'What to do', open: 'Open the source', hdr: 'Notices',
    sum: (a, w) => [a ? `⚠ ${a} action needed` : '', w ? `${w} waiting` : ''].filter(Boolean).join(', '),
    barMore: 'Details', barHide: 'Hide for today', owner: 'This is a task for the site maintainer; other visitors need not do anything.',
    cause: { blocked: s => `The source rejects automated requests (since ${s}).`, auth: s => `Access to the source is not working (since ${s}).`,
             network: s => `The source is unreachable (since ${s}); usually temporary.`, format: s => `The source page has probably changed – collection needs fixing (failing since ${s}).`,
             other: s => `Automatic collection is failing (since ${s}).` },
    navT: (p, d) => `${p}: values up to ${d}`,
    navWhat: p => `${p} pillar II unit values. The manager publishes them on its website every business day (for the previous day), usually in the afternoon; they are collected here automatically every 30 min.`,
    navWait: 'The manager has not published the new value yet or it has not been collected – normal until evening.',
    navImpact: (p, d) => `${p} returns run to ${d}, other managers’ to a newer day, so today’s comparisons with ${p} are slightly off. Other data are not affected.`,
    navTodoWait: 'Nothing – the system will retry automatically.',
    navTodoAct: p => `Check whether the value is published on the ${p} website (link below). If it is, but not here – tell Claude: the collection needs fixing.`,
    allT: d => `All managers: values up to ${d}`,
    allWhat: 'No new values from any manager for several business days – the automatic collection has probably stopped.',
    allImpact: 'All returns and comparisons are shown up to this day.',
    allTodo: 'Tell Claude – the daily run has probably stopped.',
    proxyT: 'Luminor data access (proxy) is not working',
    proxyWhat: 'The Luminor website blocks automated reading, so its data are collected through a paid intermediary server (proxy).',
    proxyWhy: s => `Since ${s} the proxy login fails – most likely the subscription expired or the login details changed.`,
    proxyImpact: 'Luminor pillar II and III values no longer update; Luminor returns and ranks are shown up to the last day received.',
    proxyTodo: '1) Log in to the proxy service account and check the subscription. 2) If you renewed it or got new login details – pass them to Claude (or enter them in the project settings). 3) If you do not want to pay – tell Claude: Luminor values can then be uploaded manually.',
    idxT: (n, d) => `Index ${n}: up to ${d}`,
    idxName: { MSCI_WORLD: 'MSCI World', MSCI_ACWI: 'MSCI ACWI', SP500: 'S&P 500 (in EUR)', EUR_GOV7Y: 'Euro bonds (7y)' },
    idxWhat: { MSCI_WORLD: 'Developed-market equity index (MSCI) – a comparison line on charts.', MSCI_ACWI: 'All-world equity index (MSCI) – a comparison line on charts and the base of the KID scenarios.',
               SP500: 'US equity index S&P 500 with dividends, converted to euros at the ECB rate (normally 1–3 days behind).', EUR_GOV7Y: 'Euro-area AAA bond index from the ECB yield curve – used for KID scenarios.' },
    estT: (n, d) => `${n}: estimated values since ${d}`,
    estWhy: d => `Exact S&P 500 total-return values after ${d} were not received, so they are extended from the official S&P 500 price index (FRED / Stooq) plus ~1.3 % annual dividends, converted at the ECB rate.`,
    estImpact: 'Only the S&P 500 comparison line for the latest days – the error is usually a few hundredths of a percent. Fund results are not affected.',
    estTodo: 'Nothing – exact values will replace the estimates automatically once received.',
    idxImpact: 'Only the index comparison line on the Results charts and tables ends earlier. Fund returns, ranks and ratings are not affected.',
    idxTodo: 'Nothing – can be ignored. The system retries daily; if the outage is long, Claude will fix the collection (you will see it in the daily report).',
    estrWhat: 'Euro risk-free rate (ECB) – used only for the Sharpe ratio.', estrImpact: 'The Sharpe ratio uses the latest available rate; the difference is usually negligible.',
    cpiWhat: 'Lithuanian consumer price index (State Data Agency) – for real (after-inflation) returns.', cpiImpact: 'Real returns for the newest months use the latest published index.',
    p3What: 'Pillar III fund unit values (managers’ websites).', p3Impact: 'The pillar III page shows values up to this day.',
    lbWhat: 'Bank of Lithuania quarterly report (published about 3 months after quarter end); downloaded here automatically every day.',
    lbImpact: { pf: 'The Portfolios and Reports pages show the previous quarter.', lbr: 'Report tables show the previous quarter’s risky share and cost ratios.' },
    lbTodo: 'Usually nothing – the Bank has not published it yet. If the file is already on the Bank’s website (link below) but does not appear here within 2 days – tell Claude.',
    srcTodo: 'Nothing – the data will update automatically when the source publishes new ones.',
    lateT: (n, d) => `${n}: data up to ${d}`,
    manT: n => `Reminder: ${n}`, manWhat: f => `These data are updated manually (${f}).`,
    manDue: d => `Update by ${d}.`, manOver: d => `Should have been updated by ${d}.`, manImpact: 'Until updated, the site uses the previous values.',
  },
};
const NTH = () => NT[lang] || NT.lt;
function noticesList() {
  if (typeof FRESH === 'undefined') return [];
  const n = NTH(), t = T(), today = srcToday(), st = FRESH.st || {}, out = [];
  const why = k => { const s = st[k]; return s && s.err ? (n.cause[s.kind] || n.cause.other)(s.since || s.err) : ''; };
  // 1. valdytojų vertės
  const allLag = businessDaysBetween(FRESH.top, today);
  if (allLag >= 3) out.push({ id: 'nav-all', lvl: 'act', title: n.allT(iso(FRESH.top)), what: n.allWhat, impact: n.allImpact, todo: n.allTodo, owner: true });
  FRESH.providers.forEach(p => {
    const lag = businessDaysBetween(p.d, FRESH.top); if (!lag) return;
    const w = why(`nav.${p.id}`), proxyDown = p.id === 'LUMINOR' && st.proxy && st.proxy.err && st.proxy.kind === 'auth';
    const lvl = proxyDown ? 'act' : (lag >= 2 || (w && st[`nav.${p.id}`].kind === 'format')) ? 'act' : 'wait';
    out.push({ id: `nav-${p.id}`, lvl, title: n.navT(p.label, iso(p.d)), what: n.navWhat(p.label), why: proxyDown ? n.proxyWhy(st.proxy.since || st.proxy.err) : (w || n.navWait),
      impact: n.navImpact(p.label, iso(p.d)), todo: lvl === 'act' ? n.navTodoAct(p.label) : n.navTodoWait, url: p.url, owner: lvl === 'act' });
  });
  // 2. Luminor proxy – net jei Luminor dar nevėluoja (pvz. šiandien vertė gauta be proxy)
  if (st.proxy && st.proxy.err && st.proxy.kind === 'auth' && !out.some(x => x.id === 'nav-LUMINOR'))
    out.push({ id: 'proxy', lvl: 'act', title: n.proxyT, what: n.proxyWhat, why: n.proxyWhy(st.proxy.since || st.proxy.err), impact: n.proxyImpact, todo: n.proxyTodo, owner: true });
  else if (st.proxy && st.proxy.err && st.proxy.kind === 'auth') { const x = out.find(x => x.id === 'nav-LUMINOR'); x.title = n.proxyT + ' · ' + x.title; x.todo = n.proxyTodo; x.what = n.proxyWhat; }
  // 3. indeksai (kiekvienas atskirai; įprastas vėlavimas neberodomas)
  const lim = { MSCI_WORLD: 3, MSCI_ACWI: 3, SP500: 5, EUR_GOV7Y: 4 };
  const est = FRESH.idxEst || {};
  Object.entries(FRESH.idx || {}).forEach(([k, d0]) => {
    const d = est[k] ? Math.max(d0, est[k][1]) : d0;
    if (est[k]) out.push({ id: `est-${k}`, lvl: 'info', title: n.estT(n.idxName[k] || k, iso(est[k][0])), what: n.idxWhat[k] || '', why: n.estWhy(iso(d0)) + (why(`idx.${k}`) ? ' ' + why(`idx.${k}`) : ''),
      impact: n.estImpact, todo: n.estTodo });
    if (businessDaysBetween(d, today) <= (lim[k] || 4)) return;
    out.push({ id: `idx-${k}`, lvl: 'info', title: n.idxT(n.idxName[k] || k, iso(d)), what: n.idxWhat[k] || '', why: why(`idx.${k}`) || (k === 'SP500' ? why('idx.EURUSD') : ''),
      impact: n.idxImpact, todo: n.idxTodo, url: (FRESH.urls || {}).idx });
  });
  // 4. kiti automatiniai šaltiniai, kurių naujų duomenų laukta anksčiau
  const meta = { estr: [n.estrWhat, n.estrImpact, 'info', 'estr'], cpi: [n.cpiWhat, n.cpiImpact, 'info', 'cpi'], p3: [n.p3What, n.p3Impact, 'wait', ''],
                 pf: [n.lbWhat, n.lbImpact.pf, 'wait', 'lb'], lbr: [n.lbWhat, n.lbImpact.lbr, 'wait', 'lb'] };
  (FRESH.src || []).forEach(x => {
    if (x.k === 'idx' || !x.next || today <= x.next || !meta[x.k]) return;
    const [what, impact, lvl, sk] = meta[x.k], d = x.k === 'cpi' ? iso(x.d).slice(0, 7) : iso(x.d);
    out.push({ id: `src-${x.k}`, lvl, title: n.lateT(t.srcK[x.k] || x.k, d), what, why: sk ? why(sk) : '', impact,
      todo: sk === 'lb' ? n.lbTodo : n.srcTodo, url: (FRESH.urls || {})[x.k] });
  });
  // 5. rankiniai darbai: priminimai likus ≤ 21 d. ir pavėluoti
  (FRESH.man || []).forEach(m => {
    const over = today > m.next, L = lang === 'lt';
    out.push({ id: `man-${m.id}`, lvl: over ? 'act' : 'info', title: n.manT(L ? m.lt : m.en), what: n.manWhat(L ? m.f_lt : m.f_en),
      why: over ? n.manOver(iso(m.next)) : n.manDue(iso(m.next)), impact: n.manImpact, todo: L ? m.how_lt : m.how_en, url: m.url, owner: true });
  });
  const ord = { act: 0, wait: 1, info: 2 };
  return out.sort((a, b) => ord[a.lvl] - ord[b.lvl]);
}
function noticesHTML(list) {
  if (!list.length) return '';
  const n = NTH(), ic = { act: '⚠', wait: '⏳', info: 'ℹ' };
  return `<div class="ntc-list"><span class="fr-l">${n.hdr}</span>` + list.map(x => `<details class="ntc l-${x.lvl}" id="ntc-${hEsc(x.id)}"><summary><span class="ic">${ic[x.lvl]}</span><b>${hEsc(x.title)}</b> <span class="lv">${n.lvl[x.lvl]}</span></summary><dl>`
    + `<dt>${n.what}</dt><dd>${hEsc(x.what)}</dd>` + (x.why ? `<dt>${n.why}</dt><dd>${hEsc(x.why)}</dd>` : '')
    + `<dt>${n.impact}</dt><dd>${hEsc(x.impact)}</dd><dt>${n.todo}</dt><dd>${hEsc(x.todo)}${x.owner ? ` <span class="na">${n.owner}</span>` : ''}${x.url ? ` <a href="${hEsc(x.url)}" target="_blank" rel="noopener">${n.open} ↗</a>` : ''}</dd></dl></details>`).join('') + '</div>';
}
/* juosta virš puslapio: tik „reikia veiksmo“, kol nepaspausta „Šiandien nerodyti“ (atskirai kiekvienam pranešimui) */
function noticeBar(list) {
  const n = NTH(), key = 'ntcHide-' + new Date().toISOString().slice(0, 10);
  let hidden = []; try { hidden = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
  const show = list.filter(x => x.lvl === 'act' && !hidden.includes(x.id));
  let bar = document.getElementById('ntcBar');
  if (!show.length) { if (bar) bar.remove(); return; }
  if (!bar) { bar = document.createElement('div'); bar.id = 'ntcBar'; bar.className = 'ntcbar'; bar.setAttribute('role', 'status'); const h = document.querySelector('header'); (h || document.body).after(bar); }
  bar.innerHTML = `<span>⚠ ${show.map(x => hEsc(x.title)).join(' · ')}</span><button type="button" class="nb-more">${n.barMore}</button><button type="button" class="nb-hide">${n.barHide}</button>`;
  bar.querySelector('.nb-more').onclick = () => {
    const sb = document.getElementById('stBtn'), fr = document.getElementById('fresh');
    if (fr) { fr.hidden = false; if (sb) sb.setAttribute('aria-expanded', 'true'); const d = document.getElementById('ntc-' + show[0].id); if (d) { d.open = true; d.scrollIntoView({ block: 'nearest' }); } }
  };
  bar.querySelector('.nb-hide').onclick = () => {
    try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('ntcHide-') && k !== key) localStorage.removeItem(k); }
      localStorage.setItem(key, JSON.stringify([...hidden, ...show.map(x => x.id)])); } catch (e) {}
    bar.remove();
  };
}
function freshnessHTML() {
  return `<span class="fr-l">${T().freshLbl}</span>` + FRESH.providers.map((p, i) => {
    const lag = businessDaysBetween(p.d, FRESH.top), tip = lag ? T().freshLate(lag) : T().freshOk;
    return `<span class="fr${lag ? ' late' : ''}" title="${tip}"><i style="background:var(--s${i + 1})"></i>${hEsc(p.label)} ${iso(p.d).slice(5)}${lag ? ' ⚠' : ''}</span>`;
  }).join('') + `<span class="fr-g">${T().updated} ${FRESH.generated}</span>`;
}

/* ---------- laiko eilučių pagalbinės ---------- */
function lastOnOrBefore(f, day) {          // paskutinės reikšmės indeksas iki dienos (imtinai) arba -1
  let lo = 0, hi = f.d.length - 1, ans = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (f.d[mid] <= day) { ans = mid; lo = mid + 1; } else hi = mid - 1; }
  return ans;
}
function shiftMonths(day, months) {
  const dt = new Date(day * DAY); dt.setUTCMonth(dt.getUTCMonth() - months);
  return Math.round(dt.getTime() / DAY);
}
function groupEnd(group) {                  // bendra paskutinė diena grupėje (jau atnaujinusių tiekėjų)
  const funds = group.funds;
  const overallLast = Math.max(...funds.map(f => f.d[f.d.length - 1]));
  const live = funds.filter(f => f.d[f.d.length - 1] >= overallLast - 5);
  return { end: Math.min(...live.map(f => f.d[f.d.length - 1])), overallLast };
}
function anchorFor(per, end, funds) {
  const e = new Date(end * DAY);
  switch (per) {
    case '1d': {                                   // savininkas 2026-10-19: „1D, 1W mygtukai kaip profesionaliame investicijų puslapyje“ – ankstesnė duomenų diena
      let a = -Infinity; (funds || []).forEach(f => { for (let i = f.d.length - 1; i >= 0; i--) if (f.d[i] < end) { if (f.d[i] > a) a = f.d[i]; break; } });
      return isFinite(a) ? a : end - 1; }
    case '1w': return end - 7;
    case '1m': return shiftMonths(end, 1);
    case '3m': return shiftMonths(end, 3);
    case '6m': return shiftMonths(end, 6);
    case '1y': return shiftMonths(end, 12);
    case '3y': return shiftMonths(end, 36);
    case '5y': return shiftMonths(end, 60);
    case 'ytd': return Math.round(Date.UTC(e.getUTCFullYear() - 1, 11, 31) / DAY);
    default: return Math.max(...funds.map(f => f.d[0]));       // bendra pradžia
  }
}

/* ---------- Būsenos (UI atnaujinimas 2026-10-17): įkėlimas – rėmeliai, atkartojantys būsimą turinį (skeleton);
   tuščia (pasirinkimas / laikotarpis be duomenų) ir klaida su „Bandyti dar kartą“. Visur vienodas vaizdas, kad nebūtų įspūdžio, jog sistema neveikia. ---------- */
function skelHTML(kind = 'table', n = 6) {
  const bar = w => `<span class="skb" style="width:${w}%"></span>`;
  if (kind === 'cards') return `<div class="skel kpis" aria-hidden="true">${Array.from({ length: n }, () => `<div class="kpi">${bar(60)}${bar(40)}</div>`).join('')}</div>`;
  if (kind === 'chart') return '<div class="skel skchart" aria-hidden="true"></div>';
  return `<div class="skel" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<div class="skrow">${bar(i ? 28 : 34)}${bar(14)}${bar(14)}${bar(14)}</div>`).join('')}</div>`;
}
function showLoading(box, kind, n) { box.setAttribute('aria-busy', 'true'); box.innerHTML = `<span class="vh">${T().stLoading}</span>` + skelHTML(kind, n); }
function stateHTML(kind, title, why, retry) {   // kind: empty | error
  const ico = kind === 'error' ? '<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>' : '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>';
  return `<div class="state st-${kind}" role="${kind === 'error' ? 'alert' : 'status'}">${svgI(ico, 22)}<div><b>${title}</b>${why ? `<span>${why}</span>` : ''}`
    + `${retry ? `<button class="btn" type="button" data-retry>${T().stRetry}</button>` : ''}</div></div>`;
}
function showError(box, retry) {
  box.removeAttribute('aria-busy'); const t = T();
  box.innerHTML = stateHTML('error', t.stErrT, t.stErrW, !!retry);
  const b = box.querySelector('[data-retry]'); if (b) b.addEventListener('click', () => { showLoading(box); retry(); });
}
// Puslapio pradžia: tuščios lentelės ir grafikai rodomi kaip rėmeliai (CSS), kol puslapio skriptas jų neužpildo
addEventListener('load', () => requestAnimationFrame(() => document.documentElement.classList.add('booted')));

/* ---------- linijinė diagrama ----------
   series: [{ provider, points: [[diena, grąža %], ...] }] */
function niceTicks(min, max, n = 5) {
  const span = max - min || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw);
  const out = []; for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) out.push(+t.toFixed(10));
  return out;
}
function drawLineChart(el, series, x0, x1, opts = {}) {
  el.querySelectorAll('svg, p.na').forEach(s => s.remove());
  const nIn = series.length; series = series.filter(r => r.points.length > 1);
  const W = opts.width || el.clientWidth || 600, H = opts.height || Math.max(240, Math.min(340, W * 0.5));
  const wide = W > 560, m = { l: opts.ml ?? 46, r: opts.mr ?? 16, t: opts.events && opts.events.length ? 26 : 10, b: 26 };
  if (!series.length || x1 <= x0) { const t = T(), none = !nIn; el.insertAdjacentHTML('beforeend', `<p class="na state st-empty" role="status">${svgI('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>', 22)}<span><b>${none ? t.stNoSel : t.stNoPer}</b><span>${none ? t.stNoSelW : t.stNoPerW}</span></span></p>`); return null; }
  const els = {};                               // provider -> [elementai] paryškinimui
  const sCol = r => r.color || colorOf(r.provider), sLab = r => r.label || labelOf(r.provider);   // eilutė gali turėti savo spalvą / pavadinimą
  el._legend = series.map(r => { let l = ''; try { l = sLab(r); } catch (e) {} return { c: sCol(r), l, d: r.dash || '' }; }).filter(x => x.l);   // PNG legendai (chartPng)
  let lo = opts.zero === false ? Infinity : 0, hi = opts.zero === false ? -Infinity : 0;    // zero: false – ašis neprivalo apimti nulio
  series.forEach(s => s.points.forEach(p => { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); }));
  const pad = (hi - lo) * 0.06 || 1; lo -= pad; hi += pad;
  const X = d => m.l + (d - x0) / (x1 - x0) * (W - m.l - m.r);
  const Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', T().chartLabel);
  const add = (tag, attrs, parent = svg) => { const n = document.createElementNS(ns, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent.appendChild(n); return n; };

  niceTicks(lo, hi).forEach(t => {
    add('line', Object.assign({ x1: m.l, x2: W - m.r, y1: Y(t), y2: Y(t), stroke: t === 0 ? 'var(--axis)' : 'var(--grid)', 'stroke-width': 1 }, t === 0 ? {} : { 'stroke-opacity': 0.7, 'stroke-dasharray': '2 3' }));   // švelnesnis tinklelis (auditas #46)
    const tx = add('text', { x: m.l - 8, y: Y(t) + 4, 'text-anchor': 'end', fill: 'var(--text-3)', 'font-size': 11 }); tx.textContent = num(t, t % 1 ? 1 : 0) + (opts.axisUnit ?? '%');
  });
  // X ašis (auditas #25): pirma žyma – laikotarpio pradžia; toliau mėnesių pradžios žmonišku formatu („vas.“, „2026 bal.“), ilgiems laikotarpiams – metai
  const years = (x1 - x0) / 365, ticks = [], cur = new Date(x0 * DAY), plotW = W - m.l - m.r;
  if (years > 5) { const yStep = Math.max(years > 6 ? 2 : 1, Math.ceil(years * 40 / plotW));   // siauruose grafikuose – rečiau
    for (let y = cur.getUTCFullYear() + 1; Date.UTC(y, 0, 1) / DAY < x1; y += yStep) ticks.push([Math.round(Date.UTC(y, 0, 1) / DAY), String(y)]); }
  else {
    const months = years * 12, maxT = Math.max(2, Math.floor(plotW / 62)), stepM = [1, 2, 3, 6, 12].find(k => months / k <= maxT) || 12;
    for (let t = Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth() + 1, 1); t / DAY < x1; ) {
      const dt = new Date(t), mo = dt.getUTCMonth();
      if (mo % stepM === 0) ticks.push([Math.round(t / DAY), (mo === 0 || !ticks.length ? dt.getUTCFullYear() + ' ' : '') + T().monShort[mo]]);
      t = Date.UTC(dt.getUTCFullYear(), mo + 1, 1);
    }
  }
  const tickTxt = (x, label, anchor) => { const tx = add('text', { x, y: H - 6, 'text-anchor': anchor, fill: 'var(--text-3)', 'font-size': 11 }); tx.textContent = label; };
  tickTxt(m.l, iso(x0), 'start');
  ticks.forEach(([d, label]) => {
    if (d <= x0 || d > x1 || X(d) - m.l < 78) return;      // neužlipti ant pradžios žymos
    tickTxt(X(d), label, 'middle');
  });

  const step = Math.max(1, Math.floor((x1 - x0) / (W * 1.2)));
  series.slice().reverse().forEach(r => {
    let path = '', last = -1e9;
    let pts = r.points;
    if (r.dashUntil) {   // retos (ketvirčio) reikšmės – punktyras su taškais, toliau ištisinė linija (auditas #14)
      const q = pts.filter(p => p[0] <= r.dashUntil);
      pts = pts.slice(Math.max(0, q.length - 1));
      els[r.provider] = els[r.provider] || [];
      if (q.length > 1) els[r.provider].push(add('path', { d: q.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(''), fill: 'none', stroke: sCol(r), 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }));
      q.forEach(p => els[r.provider].push(add('circle', { cx: X(p[0]).toFixed(1), cy: Y(p[1]).toFixed(1), r: 2.6, fill: sCol(r) })));
    }
    pts.forEach((p, i) => { if (i === 0 || i === pts.length - 1 || p[0] - last >= step) { path += (path ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1); last = p[0]; } });
    (els[r.provider] = els[r.provider] || []).push(add('path', Object.assign({ d: path, fill: 'none', stroke: sCol(r), 'stroke-width': 2, 'stroke-linejoin': 'miter', 'stroke-miterlimit': 2, 'stroke-linecap': 'butt' }, r.dash ? { 'stroke-dasharray': r.dash } : {})));
  });
  if (wide) {                                  // tiesioginės žymos dešinėje be persidengimo
    const labels = series.map(r => ({ r, y: Y(r.points[r.points.length - 1][1]) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < labels.length; i++) labels[i].y = Math.max(labels[i].y, labels[i - 1].y + 13);
    labels.forEach(l => {
      const c = add('circle', { cx: X(x1), cy: Y(l.r.points[l.r.points.length - 1][1]), r: 3.5, fill: sCol(l.r), stroke: 'var(--card)', 'stroke-width': 2 });
      const t = add('text', { class: 'endlab', x: W - m.r + 8, y: l.y + 4, fill: 'var(--text-2)', 'font-size': 12, style: opts.onPick ? 'cursor:pointer' : 'cursor:default' });
      if (opts.onPick) t.addEventListener('click', () => opts.onPick(l.r.provider)); t.textContent = sLab(l.r) + ' ';
      const tv = add('tspan', { 'font-weight': 700, fill: 'var(--text)' }, t); const lv = l.r.points[l.r.points.length - 1][1]; tv.textContent = opts.fmt ? opts.fmt(lv) : pct(lv, 1);
      els[l.r.provider].push(c, t);
      t.addEventListener('mouseenter', () => ctl.highlight(l.r.provider)); t.addEventListener('mouseleave', () => ctl.highlight(opts.hl || null));
    });
  }
  const cross = add('line', { y1: m.t, y2: H - m.b, stroke: 'var(--axis)', 'stroke-width': 1, visibility: 'hidden' });
  const hit = add('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent', style: opts.onZoom ? 'cursor:crosshair' : '' });
  const sel = add('rect', { y: m.t, height: H - m.t - m.b, fill: 'var(--accent)', 'fill-opacity': 0.15, stroke: 'var(--accent)', 'stroke-width': 1, visibility: 'hidden', 'pointer-events': 'none' });
  el.appendChild(svg);
  let tip = el.querySelector('.tip'); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; el.appendChild(tip); }
  const place = ev => { const box = el.getBoundingClientRect(); tip.style.left = Math.max(0, Math.min((ev.clientX - box.left) + 14, el.clientWidth - tip.offsetWidth - 4)) + 'px'; tip.style.top = Math.max(0, (ev.clientY - box.top) - tip.offsetHeight - 10) + 'px'; };
  const dayAt = ev => { const rect = svg.getBoundingClientRect(), px = (ev.clientX - rect.left) * (W / rect.width); return Math.max(x0, Math.min(x1, Math.round(x0 + (px - m.l) / (W - m.l - m.r) * (x1 - x0)))); };
  let dragging = null;
  const move = ev => {
    if (dragging) return;
    const day = dayAt(ev);
    const vals = series.map(r => { let v = null; for (let i = r.points.length - 1; i >= 0; i--) if (r.points[i][0] <= day) { v = r.points[i][1]; break; } return { r, v }; })
      .filter(o => o.v !== null).sort((a, b) => b.v - a.v);
    if (!vals.length) return;
    cross.setAttribute('x1', X(day)); cross.setAttribute('x2', X(day)); cross.setAttribute('visibility', 'visible');
    tip.innerHTML = `<b>${iso(day)}</b>` + vals.map(o => `<div><span><span class="sw" style="background:${sCol(o.r)}"></span>${sLab(o.r)}</span><span>${opts.fmt ? opts.fmt(o.v) : pct(o.v).replace(' %', opts.unit || ' %')}</span></div>`).join('');
    tip.style.display = 'block'; place(ev);
  };
  hit.addEventListener('mousemove', move); hit.addEventListener('touchmove', e => move(e.touches[0]), { passive: true });
  hit.addEventListener('mouseleave', () => { if (!dragging) { tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden'); } });
  if (opts.onZoom) {                              // pelės tempimas = priartinimas
    hit.addEventListener('pointerdown', ev => {
      if (ev.pointerType !== 'mouse' || ev.button !== 0) return;
      dragging = { a: dayAt(ev) }; tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden');
      const upd = e2 => { const b = dayAt(e2); sel.setAttribute('x', X(Math.min(dragging.a, b))); sel.setAttribute('width', Math.abs(X(b) - X(dragging.a))); sel.setAttribute('visibility', 'visible'); dragging.b = b; };
      const up = () => { removeEventListener('pointermove', upd); removeEventListener('pointerup', up); sel.setAttribute('visibility', 'hidden'); const d = dragging; dragging = null; if (d && d.b !== undefined && Math.abs(X(d.b) - X(d.a)) > 8) opts.onZoom(Math.min(d.a, d.b), Math.max(d.a, d.b)); };
      addEventListener('pointermove', upd); addEventListener('pointerup', up); ev.preventDefault();
    });
  }
  if (opts.events && opts.events.length) {         // įvykių žymos viršuje (numeruotos), tekstas – po grafiku
    opts.events.forEach(e => {
      if (e.day < x0 || e.day > x1) return;
      const x = X(e.day);
      add('line', { x1: x, x2: x, y1: 20, y2: H - m.b, stroke: 'var(--text-3)', 'stroke-width': 1, 'stroke-dasharray': '3 3', 'pointer-events': 'none' });
      const g = add('g', { style: 'cursor:default' });
      add('circle', { cx: x, cy: 11, r: 9, fill: 'var(--card)', stroke: 'var(--text-2)', 'stroke-width': 1.2 }, g);
      const t = add('text', { x, y: 15, 'text-anchor': 'middle', fill: 'var(--text)', 'font-size': 11, 'font-weight': 600 }, g); t.textContent = e.n;
      g.addEventListener('mouseenter', ev => { tip.innerHTML = `<b>${iso(e.day)} · ${e.title}</b><div style="display:block;max-width:260px;white-space:normal">${e.text}</div>`; tip.style.display = 'block'; place(ev); });
      g.addEventListener('mousemove', place); g.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    });
  }
  const ctl = {
    svg,
    highlight(id) {
      Object.keys(els).forEach(k => els[k].forEach(n => {
        const on = !id || k === id;
        n.setAttribute('opacity', on ? 1 : 0.15);
        if (n.tagName === 'path') { n.setAttribute('stroke-width', id && on ? 3 : 2); if (id && on) n.parentNode.insertBefore(n, cross); }
      }));
    },
  };
  ctl.highlight(opts.hl || null);
  return ctl;
}

/* Pasaulio akcijų indeksai palyginimui (data_idx.js, žr. indexes.py): fondo pavidalo objektai { provider, id, label, color, dash, d, v }.
   Indeksų vertės be mokesčių, fondų vieneto vertės – jau po valdymo mokesčių. */
const IDX_META = {
  MSCI_ACWI: { en: 'World equity (MSCI ACWI)', lt: 'Pasaulio akcijos (MSCI ACWI)', color: '#6b7280', dash: '6 4' },
  MSCI_WORLD: { en: 'MSCI World', lt: 'MSCI World', color: '#a3a3a3', dash: '2 3' },
  SP500: { en: 'S&P 500', lt: 'S&P 500', color: '#b7791f', dash: '6 3 2 3' },
};
/* Indekso mokestis (savininko užduotis 2026-10-14): indeksų vertės be mokesčių, todėl palyginimui su fondais galima pritaikyti
   metinį mokestį, atskaitomą kasdien: v'(t) = v(t) × (1 − mokestis)^(dienos nuo pradžios ÷ 365,25).
   Režimai: 'etf' – tipinio to indekso ETF mokestis (numatytasis), 'none' – be mokesčio, 'avg' – rodomų pensijų fondų vidutinis
   valdymo mokestis (puslapis nustato IDX_AVG_FEE), 'custom' – įrašytas ranka. Pasirinkimas bendras visiems puslapiams. */
const IDX_TER = { MSCI_ACWI: 0.20, MSCI_WORLD: 0.20, SP500: 0.07 };   // iShares MSCI ACWI (SSAC), iShares Core MSCI World (IWDA), iShares Core S&P 500 (CSPX)
const IDXFEE = { mode: 'etf', custom: 0.20 };
try { const s = JSON.parse(localStorage.getItem('idxFee')); if (s && ['etf', 'none', 'avg', 'custom'].includes(s.mode)) IDXFEE.mode = s.mode; if (s && isFinite(s.custom)) IDXFEE.custom = +s.custom; } catch (e) {}
let IDX_AVG_FEE = null;
function idxFeeOf(id) {
  if (IDXFEE.mode === 'none') return 0;
  if (IDXFEE.mode === 'custom') return IDXFEE.custom;
  if (IDXFEE.mode === 'avg' && IDX_AVG_FEE != null) return IDX_AVG_FEE;
  return IDX_TER[id] || 0;
}
function idxFeeText(id) {                 // trumpas paaiškinimas legendoje / lentelėje
  const f = idxFeeOf(id);
  return f ? (lang === 'lt' ? `po ${num(f, 2)} % mokesčio` : `after ${num(f, 2)} % fee`) : (lang === 'lt' ? 'be mokesčio' : 'no fee');
}
function idxFeeCtl(el, onChange) {        // išskleidžiamasis sąrašas + laukelis mokesčiui įrašyti
  if (!el) return;
  const L = lang === 'lt'
    ? { lbl: 'Indekso mokestis', etf: 'Tipinis ETF', none: 'Be mokesčio', avg: 'Fondų vidutinis', custom: 'Įrašyti' }
    : { lbl: 'Index fee', etf: 'Typical ETF', none: 'No fee', avg: 'Funds’ average', custom: 'Enter' };
  const avg = IDX_AVG_FEE != null ? ` (${num(IDX_AVG_FEE, 2)} %)` : '';
  el.innerHTML = `<label class="field idxfee">${L.lbl} <select>${['etf', 'none', 'avg', 'custom'].filter(m => m !== 'avg' || IDX_AVG_FEE != null).map(m => `<option value="${m}"${m === IDXFEE.mode ? ' selected' : ''}>${L[m]}${m === 'avg' ? avg : ''}</option>`).join('')}</select>`
    + `<input type="number" class="small-in" step="0.01" min="0" max="5" value="${IDXFEE.custom}"${IDXFEE.mode === 'custom' ? '' : ' hidden'}> ${IDXFEE.mode === 'custom' ? '%' : ''}</label>`;
  const sel = el.querySelector('select'), inp = el.querySelector('input');
  const save = () => { try { localStorage.setItem('idxFee', JSON.stringify(IDXFEE)); } catch (e) {} };
  sel.onchange = () => { IDXFEE.mode = sel.value; save(); idxFeeCtl(el, onChange); onChange(); };
  inp.oninput = () => { const v = parseFloat(inp.value); if (isFinite(v) && v >= 0 && v <= 5) { IDXFEE.custom = v; save(); onChange(); } };
}
let IDX_CACHE = null;
function idxFunds() {
  if (typeof IDX === 'undefined') return [];
  if (!IDX_CACHE) IDX_CACHE = Object.keys(IDX_META).filter(k => IDX[k]).map(k => {
    const x = IDX[k], d = [x.d0]; x.dd.forEach(v => d.push(d[d.length - 1] + v));
    return { provider: 'IDX_' + k, id: k, color: IDX_META[k].color, dash: IDX_META[k].dash, d, raw: x.v, v: x.v, feeKey: null };
  });
  IDX_CACHE.forEach(f => {
    const fee = idxFeeOf(f.id);
    if (f.feeKey !== fee) { const k = 1 - fee / 100; f.v = fee ? f.raw.map((v, i) => v * Math.pow(k, (f.d[i] - f.d[0]) / 365.25)) : f.raw; f.feeKey = fee; }
    f.fee = fee; f.label = IDX_META[f.id][lang] + (fee ? (lang === 'lt' ? ` (po ${num(fee, 2)} % mokesčio)` : ` (after ${num(fee, 2)}% fee)`) : '');
  });
  return IDX_CACHE;
}

/* Grupės kortelės: grąža ir linijos laikotarpyje (naudoja ir apžvalga, ir rezultatų puslapis) */
// Dienos, kai vertę paskelbė tik vienas valdytojas (pvz. SEB per šventes), dienos statistikoje neįtraukiamos (auditas #17).
// Istoriniai duomenys nekeičiami – tik skaičiuojant tokia diena praleidžiama (pokytis skaičiuojamas iki kitos bendros dienos).
let LONE = null;
function loneDays() {
  if (LONE) return LONE;
  const by = new Map(), first = {};
  (typeof DATA !== 'undefined' && DATA.groups ? DATA.groups : []).forEach(g => g.funds.forEach(f => {
    first[f.provider] = Math.min(first[f.provider] ?? Infinity, f.d[0]);
    f.d.forEach(d => { if (!by.has(d)) by.set(d, new Set()); by.get(d).add(f.provider); });
  }));
  const starts = Object.values(first);
  LONE = new Set([...by].filter(([d, ps]) => ps.size === 1 && starts.filter(x => x <= d).length >= 2).map(([d]) => d));
  return LONE;
}
function statIdx(f, ia, ie) {            // indeksai be „vienišų“ dienų (paskutinis visada lieka)
  const L = loneDays(), out = [ia];
  for (let i = ia + 1; i <= ie; i++) if (i === ie || !L.has(f.d[i])) out.push(i);
  return out;
}
// Reali grąža (po infliacijos): grąža perskaičiuojama pagal Lietuvos VKI (CPI iš data_cpi.js; tik „Rezultatų“ puslapyje)
let REAL = false;
function cpiAt(day) {
  if (!REAL || typeof CPI === 'undefined') return null;
  const k = iso(day).slice(0, 7); if (CPI[k] != null) return CPI[k];
  const ks = Object.keys(CPI), last = ks[ks.length - 1];
  return k > last ? CPI[last] : null;            // naujausių mėnesių VKI dar neskelbtas – imamas paskutinis žinomas
}
function cpiRaw(day) {                    // VKI lygis dienos mėnesiui (be REAL sąlygos) – infliacijos linijai
  if (typeof CPI === 'undefined') return null;
  const k = iso(day).slice(0, 7); if (CPI[k] != null) return CPI[k];
  const ks = Object.keys(CPI), last = ks[ks.length - 1];
  return k > last ? CPI[last] : null;
}
const realRet = (r, d0, d1) => { const c0 = cpiAt(d0), c1 = cpiAt(d1); return c0 && c1 ? ((1 + r / 100) / (c1 / c0) - 1) * 100 : r; };
function seriesOf(f, anchor, end) {
  const ie = lastOnOrBefore(f, end); let ia = lastOnOrBefore(f, anchor);
  // fondas, įsteigtas ≤7 d. po laikotarpio pradžios už 1,00 € (pvz. 2003–2009 fondai 2025-01-02), skaičiuojamas nuo pirmos vertės (auditas #7)
  if (ia < 0 && f.d[0] - anchor <= 7 && Math.abs(f.v[0] - 1) < 0.005) ia = 0;
  if (ie < 0 || ia < 0 || ie < ia) return null;
  const base = f.v[ia], points = [[anchor, 0]];
  for (let i = ia + 1; i <= ie; i++) if (f.d[i] > anchor) points.push([f.d[i], realRet((f.v[i] / base - 1) * 100, anchor, f.d[i])]);
  return { ret: realRet((f.v[ie] / base - 1) * 100, anchor, f.d[ie]), points, ia, ie };
}


/* ---------- bendra laikotarpių logika (rezultatų ir apžvalgos puslapiai) ---------- */
const PRESET_IDS = ['1d', '1w', '1m', '3m', '6m', 'ytd', 'Q', '1y', 'Y', '3y', '5y', 'max'];   // Q ir Y – išskleidžiami sąrašai (ketvirtis „q:2026-3“, metai „y:2025“)
const isCalPeriod = id => /^q:\d{4}-[1-4]$/.test(id) || /^y:\d{4}$/.test(id);
const periodLabel = id => { let m; if ((m = /^q:(\d{4})-([1-4])$/.exec(id))) return `Q${m[2]} ${m[1]}`; if ((m = /^y:(\d{4})$/.exec(id))) return m[1]; return T().periods[id]; };
const maxAnchorOf = funds => {                  // „Visa istorija“: nuo ankstyviausio fondo; pradėję ≤31 d. vėliau laikomi pradėjusiais kartu
  const st = funds.map(f => f.d[0]).sort((x, y) => x - y);
  return Math.max(...st.filter(d => d - st[0] <= 31));
};
function presetRangeF(per, end, funds, maxA) {
  if (per === 'max') return { anchor: maxA, end };
  let m;
  if ((m = /^q:(\d{4})-([1-4])$/.exec(per))) { const y = +m[1], q = +m[2]; return { anchor: Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY), end: Math.min(end, Math.round(Date.UTC(y, q * 3, 0) / DAY)) }; }
  if ((m = /^y:(\d{4})$/.exec(per))) { const y = +m[1]; return { anchor: Math.round(Date.UTC(y - 1, 11, 31) / DAY), end: Math.min(end, Math.round(Date.UTC(y, 11, 31) / DAY)) }; }
  return { anchor: anchorFor(per, end, funds), end };
}
function calOptions(latest, earliest) {          // tik pilni ketvirčiai / metai, kurių pabaiga yra duomenų ribose
  const y1 = new Date(latest * DAY).getUTCFullYear(), y0 = new Date(earliest * DAY).getUTCFullYear(), qs = [], ys = [];
  for (let y = y1; y >= y0; y--) {
    for (let q = 4; q >= 1; q--) { const e = Math.round(Date.UTC(y, q * 3, 0) / DAY), st = Math.round(Date.UTC(y, (q - 1) * 3, 0) / DAY); if (e <= latest && st >= earliest) qs.push(`q:${y}-${q}`); }
    const e = Math.round(Date.UTC(y, 11, 31) / DAY), st = Math.round(Date.UTC(y - 1, 11, 31) / DAY); if (e <= latest && st >= earliest) ys.push(`y:${y}`);
  }
  return { q: qs, y: ys };
}
/* Eilutės grafikui: kiekvienam fondui nuo x0. Fondai, kurie pradėjo vėliau nei x0, grafike nerodomi
   (netikros pradžios vertės nekuriame) – jų sąrašas grąžinamas series.hidden, kad būtų galima paminėti po grafiku. */
function buildSeries(fs, x0, x1) {
  const series = fs.map(f => { const s = seriesOf(f, x0, x1); return s && s.points.length > 1 ? { provider: f.provider, points: s.points } : null; }).filter(Boolean);
  series.hidden = fs.filter(f => f.d[0] > x0 && f.d[0] < x1).map(f => ({ provider: f.provider, start: f.d[0] }));
  return series;
}
/* Grafikas „susispaudžia“ užvedus pelę, kad dešinėje tilptų fondų pavadinimai su galutinėmis reikšmėmis.
   paint(mr) – perpiešia grafiką su nurodyta dešine paraštė. */
function hoverCompress(el, paint) {
  const st = { mr: 16, anim: 0 };
  const go = target => {
    cancelAnimationFrame(st.anim);
    const step = () => { st.mr += (target - st.mr) * 0.35; if (Math.abs(target - st.mr) < 1) st.mr = target; paint(st.mr); if (st.mr !== target) st.anim = requestAnimationFrame(step); };
    st.anim = requestAnimationFrame(step);
  };
  if (!matchMedia('(hover: none)').matches) {
    el.addEventListener('mouseenter', () => { if ((el.clientWidth || 0) > 560) go(150); });
    el.addEventListener('mouseleave', () => go(16));
  }
  return st;
}
addStrings({
  qPlace: 'Quarter', yPlace: 'Year',
  notShown: l => `Not shown on the chart (started later than the period start): ${l}. Pick a shorter period to see them.`,
}, {
  qPlace: 'Ketvirtis', yPlace: 'Metai',
  notShown: l => `Grafike nerodoma (pradėjo vėliau nei laikotarpio pradžia): ${l}. Pasirinkite trumpesnį laikotarpį, kad juos matytumėte.`,
});

/* ---------- Kilimas ir kritimas (run-up / drawdown): rezultatų ir III pakopos puslapiai ----------
   Stulpeliai: kiekvieno laikotarpio (mėnesio, ketvirčio ar metų) didžiausias kilimas nuo žemiausio taško (+)
   ir didžiausias kritimas nuo aukščiausio taško (−) to laikotarpio viduje; lyginami tos pačios grupės fondai.
   Linija: sukaupta grąža nuo pradžios ir kritimas nuo iki tol aukščiausios vertės. */
addStrings({
  rdMode: 'View', rdBars: 'Columns', rdLine: 'Line', rdGran: { m: 'Months', q: 'Quarters', y: 'Years' },
  rdStart: 'From', rdIncep: 'Fund inception', rdDate: 'Chosen date', rdFund: 'Fund', rdAllDd: 'All funds – drawdown only',
  rdUp: 'Max run-up', rdDn: 'Max drawdown', rdCum: 'Cumulative return', rdDdLine: 'Drawdown from peak',
  rdQ: (y, q) => `Q${q} ${y}`,
  rdCapBars: g => `${g}. For every period: the full-colour column = the largest rise of the unit value from its lowest point within that period (run-up); the pale column below zero = the deepest point the unit value reached within that period below its highest value so far since the start (drawdown – the same dips as on the line view). The first period of a fund can be partial. Click a fund to hide or show it; hover for the figures.`,
  rdCapLine: (g, f) => `${g} · ${f}. Cumulative return = change of the unit value since the start; drawdown = how far the unit value is below its highest value so far (0 % = at a new high).`,
  rdCapAll: g => `${g}. Each line = how far the fund’s unit value is below its highest value so far (0 % = at a new high). Click a fund to hide or show it.`,
}, {
  rdMode: 'Rodinys', rdBars: 'Stulpeliai', rdLine: 'Linija', rdGran: { m: 'Mėnesiai', q: 'Ketvirčiai', y: 'Metai' },
  rdStart: 'Nuo', rdIncep: 'Fondo įsteigimo', rdDate: 'Pasirinktos datos', rdFund: 'Fondas', rdAllDd: 'Visi fondai – tik kritimas',
  rdUp: 'Didžiausias kilimas', rdDn: 'Didžiausias kritimas', rdCum: 'Sukaupta grąža', rdDdLine: 'Kritimas nuo viršūnės',
  rdQ: (y, q) => `${y} K${q}`,
  rdCapBars: g => `${g}. Kiekvienam laikotarpiui: ryškus stulpelis – didžiausias vieneto vertės kilimas nuo žemiausio taško to laikotarpio viduje; blyškus stulpelis žemiau nulio – giliausias taškas per tą laikotarpį žemiau iki tol (nuo pradžios) aukščiausios vertės (kritimas – tos pačios duobės kaip linijos rodinyje). Pirmasis fondo laikotarpis gali būti nepilnas. Paspaudus fondą jis paslepiamas arba parodomas; užvedus pelę matyti skaičiai.`,
  rdCapLine: (g, f) => `${g} · ${f}. Sukaupta grąža – vieneto vertės pokytis nuo pradžios; kritimas – kiek vieneto vertė yra žemiau iki tol aukščiausios vertės (0 % = nauja viršūnė).`,
  rdCapAll: g => `${g}. Kiekviena linija – kiek fondo vieneto vertė yra žemiau iki tol aukščiausios vertės (0 % = nauja viršūnė). Paspaudus fondą jis paslepiamas arba parodomas.`,
});
const rdBucket = (day, gran) => { const t = new Date(day * DAY), y = t.getUTCFullYear(), m = t.getUTCMonth(); return gran === 'y' ? y : gran === 'q' ? y * 4 + Math.floor(m / 3) : y * 12 + m; };
const rdBucketLabel = (k, gran) => gran === 'y' ? String(k) : gran === 'q' ? T().rdQ(Math.floor(k / 4), k % 4 + 1) : `${Math.floor(k / 12)}-${String(k % 12 + 1).padStart(2, '0')}`;
function rdBase(f, start) { return !start || start <= f.d[0] ? 0 : lastOnOrBefore(f, start); }   // pradžios vertės indeksas
function rdBars(f, start, gran) {           // Map laikotarpis -> { up, dn } procentais (kaip savininko Excel)
  // up – didžiausias kilimas nuo žemiausios vertės to laikotarpio viduje; dn – giliausias taškas žemiau iki tol aukščiausios vertės (nuo pradžios)
  const out = new Map(), ib = rdBase(f, start); let k = null, lo, up, dn, peak = f.v[ib];
  const flush = () => { if (k !== null) out.set(k, { up: up * 100, dn: dn * 100 }); };
  for (let i = ib + 1; i < f.d.length; i++) {
    const key = rdBucket(f.d[i], gran), v = f.v[i];
    if (key !== k) { flush(); k = key; lo = v; up = dn = 0; }
    lo = Math.min(lo, v); up = Math.max(up, v / lo - 1);
    peak = Math.max(peak, v); dn = Math.min(dn, v / peak - 1);
  }
  flush(); return out;
}
function rdLines(f, start) {                // sukaupta grąža ir kritimas nuo viršūnės
  const ib = rdBase(f, start), base = f.v[ib], cum = [[f.d[ib], 0]], dd = [[f.d[ib], 0]]; let peak = base;
  for (let i = ib + 1; i < f.d.length; i++) { const v = f.v[i]; peak = Math.max(peak, v); cum.push([f.d[i], (v / base - 1) * 100]); dd.push([f.d[i], (v / peak - 1) * 100]); }
  return { cum, dd };
}
/* root – tuščias elementas; groups – [{ id, label, funds }]; key – būsenos raktas naršyklėje */
function runupDrawdown(root, groups, key, defGroup) {
  const SK = 'rdd_' + key; let st = { group: defGroup, mode: 'bar', gran: 'y', start: '', fund: null, off: [] };
  try { Object.assign(st, JSON.parse(localStorage.getItem(SK)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(SK, JSON.stringify(st)); } catch (e) {} };
  const ctl = { render };
  function render() {
    const g = groups.find(x => x.id === st.group) || groups.find(x => x.id === defGroup) || groups[0]; st.group = g.id;
    const funds = g.funds, ids = funds.map(f => f.provider);
    if (st.fund !== 'all' && !ids.includes(st.fund)) st.fund = ids.find(id => /SEB/.test(labelOf(id))) || ids[0];
    const off = new Set(st.off.filter(id => ids.includes(id))), on = funds.filter(f => !off.has(f.provider));
    const first = Math.min(...funds.map(f => f.d[0])), last = Math.max(...funds.map(f => f.d[f.d.length - 1]));
    const startDay = st.start ? Math.max(first, Math.min(dayOf(st.start), last - 1)) : 0;
    const seg = (name, items, cur) => `<div class="seg" role="group" data-k="${name}">${items.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${l}</button>`).join('')}</div>`;
    const bars = st.mode === 'bar', single = !bars && st.fund !== 'all';
    root.innerHTML = `<div class="tools rdtools">
        <select data-k="group">${groups.map(x => `<option value="${x.id}"${x.id === g.id ? ' selected' : ''}>${x.label}</option>`).join('')}</select>
        ${seg('mode', [['bar', T().rdBars], ['line', T().rdLine]], st.mode)}
        ${bars ? seg('gran', [['m', T().rdGran.m], ['q', T().rdGran.q], ['y', T().rdGran.y]], st.gran) : `<label class="field"><span>${T().rdFund}</span><select data-k="fund"><option value="all">${T().rdAllDd}</option>${funds.map(f => `<option value="${f.provider}"${f.provider === st.fund ? ' selected' : ''}>${labelOf(f.provider)}</option>`).join('')}</select></label>`}
        <label class="field"><span>${T().rdStart}</span><select data-k="start"><option value="">${T().rdIncep}</option><option value="d"${st.start ? ' selected' : ''}>${T().rdDate}</option></select></label>
        ${st.start ? `<input type="date" data-k="date" value="${iso(startDay)}" min="${iso(first)}" max="${iso(last)}">` : ''}
      </div>
      ${single ? '' : `<div class="chips rdchips">${funds.map(f => `<button type="button" class="chip" data-id="${f.provider}" aria-pressed="${!off.has(f.provider)}"><i style="background:${colorOf(f.provider)}"></i>${labelOf(f.provider)}</button>`).join('')}</div>`}
      <div class="cap rdcap"></div><div class="chart rdchart"></div>`;
    const q = s => root.querySelector(s), set = (k, v) => { st[k] = v; save(); render(); };
    q('[data-k=group]').onchange = e => set('group', e.target.value);
    root.querySelectorAll('.seg button').forEach(b => b.onclick = () => set(b.parentNode.dataset.k, b.dataset.v));
    if (q('[data-k=fund]')) q('[data-k=fund]').onchange = e => set('fund', e.target.value);
    q('[data-k=start]').onchange = e => set('start', e.target.value ? iso(Math.max(first, shiftMonths(last, 60))) : '');
    if (q('[data-k=date]')) q('[data-k=date]').onchange = e => { if (e.target.value) set('start', e.target.value); };
    root.querySelectorAll('.rdchips .chip').forEach(b => b.onclick = () => {
      const id = b.dataset.id, s = new Set(st.off); if (s.has(id)) s.delete(id); else if (on.length > 1) s.add(id); set('off', [...s]);
    });
    const el = q('.rdchart'), cap = q('.rdcap');
    ctl.paint = () => {
      if (bars) { cap.textContent = T().rdCapBars(g.label); rdDrawBars(el, on, startDay, st.gran); return; }
      if (single) {
        const f = funds.find(x => x.provider === st.fund), L = rdLines(f, startDay);
        cap.textContent = T().rdCapLine(g.label, labelOf(f.provider));
        drawLineChart(el, [{ provider: 'cum', color: colorOf(f.provider), label: T().rdCum, points: L.cum }, { provider: 'dd', color: 'var(--dneg)', label: T().rdDdLine, points: L.dd }],
          L.cum[0][0], L.cum[L.cum.length - 1][0], { mr: el.clientWidth > 560 ? 190 : 16, fmt: v => pct(v, 2) });
      } else {
        const ser = on.map(f => ({ provider: f.provider, points: rdLines(f, startDay).dd }));
        cap.textContent = T().rdCapAll(g.label);
        drawLineChart(el, ser, Math.min(...ser.map(s => s.points[0][0])), Math.max(...ser.map(s => s.points[s.points.length - 1][0])), { mr: el.clientWidth > 560 ? 150 : 16, fmt: v => pct(v, 2) });
      }
    };
    ctl.paint();
  }
  render();
  return ctl;
}
function rdDrawBars(el, funds, start, gran) {
  el.innerHTML = '';
  const data = funds.map(f => ({ f, m: rdBars(f, start, gran) })), keys = [...new Set(data.flatMap(x => [...x.m.keys()]))].sort((a, b) => a - b);
  if (!keys.length) { el.innerHTML = `<p class="na">${T().noData}</p>`; return; }
  let lo = 0, hi = 0; data.forEach(x => x.m.forEach(v => { lo = Math.min(lo, v.dn); hi = Math.max(hi, v.up); }));
  const ticks = niceTicks(lo, hi); lo = Math.min(lo, ticks[0]); hi = Math.max(hi, ticks[ticks.length - 1]);
  const W = el.clientWidth || 800, H = Math.max(280, Math.min(420, Math.round(W * 0.42))), m = { l: 46, r: 10, t: 10, b: 28 };
  const gw = (W - m.l - m.r) / keys.length, n = data.length, bw = Math.max(1, Math.min(26, gw * 0.84 / n)), X = i => m.l + i * gw + (gw - bw * n) / 2;
  if (bw >= 22) { m.b = 42; m.t = 16; }   // vieta reikšmėms virš ir po stulpeliais
  const Y = v => m.t + (hi - v) / (hi - lo) * (H - m.t - m.b);
  const lblEvery = Math.max(1, Math.ceil(keys.length / Math.max(1, Math.floor((W - m.l - m.r) / (gran === 'y' ? 40 : gran === 'q' ? 64 : 58)))));
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${T().rdUp} / ${T().rdDn}">`
    + ticks.map(t => `<line x1="${m.l}" x2="${W - m.r}" y1="${Y(t)}" y2="${Y(t)}" stroke="${t === 0 ? 'var(--axis)' : 'var(--grid)'}"/><text x="${m.l - 8}" y="${Y(t) + 4}" text-anchor="end" font-size="11" fill="var(--text-3)">${num(t, t % 1 ? 1 : 0)}${pctSfx()}</text>`).join('')
    + keys.map((k, i) => i % lblEvery ? '' : `<text x="${m.l + (i + 0.5) * gw}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--text-3)">${rdBucketLabel(k, gran)}</text>`).join('')
    + `<rect class="rdhl" x="0" y="${m.t}" width="${gw}" height="${H - m.t - m.b}" fill="var(--hover)" visibility="hidden"/>`;
  keys.forEach((k, i) => data.forEach((x, j) => {
    const v = x.m.get(k); if (!v) return; const bx = (X(i) + j * bw).toFixed(1), w = Math.max(0.6, bw - (bw > 4 ? 1 : 0)).toFixed(1), c = colorOf(x.f.provider);
    svg += `<rect x="${bx}" y="${Y(v.up).toFixed(1)}" width="${w}" height="${Math.max(0, Y(0) - Y(v.up)).toFixed(1)}" fill="${c}"/>`
      + `<rect x="${bx}" y="${Y(0).toFixed(1)}" width="${w}" height="${Math.max(0, Y(v.dn) - Y(0)).toFixed(1)}" fill="${c}" fill-opacity="0.38"/>`
      + (bw >= 22 ? `<text x="${(+bx + bw / 2).toFixed(1)}" y="${(Y(v.up) - 3).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="var(--text-2)">${num(v.up, 2)}</text>`   // reikšmės prie stulpelių (auditas #31)
        + (v.dn < 0 ? `<text x="${(+bx + bw / 2).toFixed(1)}" y="${(Y(v.dn) + 11).toFixed(1)}" text-anchor="middle" font-size="8.5" fill="var(--text-3)">${num(v.dn, 2)}</text>` : '') : '');
  }));
  el.innerHTML = svg + '</svg>';
  const tip = document.createElement('div'); tip.className = 'tip'; tip.style.display = 'none'; el.appendChild(tip);
  const hl = el.querySelector('.rdhl'), s = el.querySelector('svg');
  s.onmousemove = e => {
    const r = s.getBoundingClientRect(), px = (e.clientX - r.left) * (W / r.width), i = Math.floor((px - m.l) / gw);
    if (i < 0 || i >= keys.length) { tip.style.display = 'none'; hl.setAttribute('visibility', 'hidden'); return; }
    const rows = data.map(x => ({ f: x.f, v: x.m.get(keys[i]) })).filter(x => x.v);
    tip.innerHTML = `<b>${rdBucketLabel(keys[i], gran)}</b><div><span></span><span>▲ ${T().rdUp} · ▼ ${T().rdDn}</span></div>` + rows.map(x => `<div><span><span class="sw" style="background:${colorOf(x.f.provider)}"></span>${labelOf(x.f.provider)}</span><span>▲ ${pctPlain(x.v.up, 1)} · ▼ ${pctPlain(x.v.dn, 1)}</span></div>`).join('');
    hl.setAttribute('x', m.l + i * gw); hl.setAttribute('visibility', 'visible'); tip.style.display = 'block';
    const cx = m.l + (i + 0.5) * gw, w = tip.offsetWidth; tip.style.left = (cx + gw / 2 + 8 + w > W ? Math.max(0, cx - gw / 2 - 8 - w) : cx + gw / 2 + 8) + 'px'; tip.style.top = m.t + 'px';
  };
  s.onmouseleave = () => { tip.style.display = 'none'; hl.setAttribute('visibility', 'hidden'); };
}

/* ---------- Neapdorotų duomenų atsisiuntimas (antraštės „Įrankiai“ › „Duomenys“, visuose puslapiuose) ----------
   Savininkas 2026-10-19: „žali duomenys“ kitiems darbams – pasirenkamas duomenų tipas ir laikotarpis arba viskas vienu failu.
   Kiekviename faile – lapas „Šaltiniai“ (iš kur kiekvienas duomuo, nuoroda, kaip dažnai atnaujinama).
   Duomenų failai įkeliami atskirai ir vykdomi atskiroje funkcijoje, kad nesusimaišytų su puslapio kintamaisiais. */
addStrings({
  dlBtn: 'Data', dlWhat: 'What to download', dlPillar: 'Pillar', dlMgr: 'Manager', dlFund: 'Fund', dlAll: 'All', dlFrom: 'From', dlTo: 'To', dlPerAll: 'empty = whole history',
  dlGo: 'Download (.xlsx)', dlBusy: 'Preparing…', dlFail: 'Could not prepare the file (no internet?).',
  dlSets: { all: 'Everything in one file', nav2: 'Unit values – Pillar II funds (daily)', nav3: 'Unit values – Pillar III funds (daily)', aum: 'Net assets and unit values (daily, II and III)',
    lb: 'Bank of Lithuania quarterly results: participants, assets, returns', pay: 'Pension reform payouts', macro: 'Inflation, wages, pensions, minimum wage, state incentive, contribution rates',
    estr: '€STR interest rate (monthly)', fee: 'Management fees', pf: 'Portfolios with instrument details' },
  dlNote: { all: 'All data sets on separate sheets (portfolios – the latest quarter in the period; full portfolios can be downloaded separately).',
    nav2: 'Two sheets: “Table” – one column per fund; “List” – one row per fund and day. As published by the managers.', nav3: 'Two sheets: “Table” – one column per fund; “List” – one row per fund and day. As published by the managers.',
    aum: 'One row per fund and day: unit value and net assets (€). Before daily data – Bank of Lithuania quarter-end figures.',
    lb: 'Each fund at each quarter end since 2015: participants, net assets, returns, benchmark, risk; Bank of Lithuania group averages; pillar and manager totals.',
    pay: 'Payouts under the 2026 pension reform by manager and fund, as estimated from daily net assets (see Assets page methodology).',
    macro: 'Separate sheets: CPI (monthly), average wage, average old-age pension, minimum wage, state incentive, contribution rates.',
    estr: 'Monthly average of the euro short-term rate (ECB).', fee: 'Current annual management fee of each fund, %.',
    pf: 'One row per position per quarter end (Bank of Lithuania reports), with asset class, region, SFDR, TER, and for bonds – maturity, coupon, yield and duration. Blank = not known.' },
  dlSrcH: ['Data set', 'Sheet', 'What it contains', 'Source', 'Link', 'Updated', 'Notes'], dlSrcT: 'Sources of the data in this file', dlMade: 'File created', dlPer: 'Period', dlSite: 'Site',
  dlDisc: 'For information only, not investment advice. Data are collected automatically from public sources; please cite the original source.',
  dlCols: { q: 'Quarter end', mgr: 'Manager', pl: 'Pillar', code: 'Fund code', fund: 'Fund', grp: 'Group', pos: 'Position', isin: 'ISIN', issuer: 'Issuer / company', type: 'Type', alt: 'Alternative kind', cty: 'Country', cur: 'Currency', units: 'Units / nominal', val: 'Value, €', w: 'Weight, %', ac: 'Asset class', reg: 'Region', em: 'Emerging markets', ap: 'Approach', sfdr: 'SFDR', ter: 'TER, %', hdg: 'Currency hedged', th: 'Theme', src: 'Source', mat: 'Maturity', cpn: 'Coupon, %', frn: 'Floating rate', ytm: 'Yield to maturity, %', md: 'Modified duration', yrs: 'Years to maturity', date: 'Date', unit: 'Unit value', nav: 'Net assets, €', navm: 'Net assets, € m', part: 'Participants', nf: 'Funds', lbg: 'Bank of Lithuania group', ytd: 'Return since year start, %', r1: 'Return 1 year, %', r3: 'Return 3 years (annual), %', r5: 'Return 5 years (annual), %', gcf: 'Return since start (annual), %', bmytd: 'Benchmark since year start, %', bm1: 'Benchmark 1 year, %', std3: 'Std. deviation 3 years, %', risky: 'Risky assets, %', rq: 'Quarter return, % (computed)', file: 'Bank of Lithuania file', month: 'Month', year: 'Year', cpi: 'CPI (2025 = 100)', gross: 'Gross, €', net: 'Net, €', pens: 'Average old-age pension, €', imax: 'Incentive, €/month (participant pays 3 %)', imin: 'Incentive, €/month (gradual rate)', from: 'From', sodra: 'Sodra, % of wage', state: 'State, % of average wage', pp: 'Participant, % of wage', ppg: 'Participant (gradual), %', estr: '€STR, %', fee: 'Management fee, %/year', qa: 'Application quarter', pdate: 'Payout dates', paid: 'Paid out, € m', base: 'Assets before payout, € m', share: 'Share of assets, %', est: 'Estimated from quarter data' },
  dlSheets: { tab: 'Table', list: 'List', lbf: 'LB funds', lba: 'LB averages', lbt: 'LB totals', cpi: 'CPI', wage: 'Average wage', pens: 'Average pension', mw: 'Minimum wage', inc: 'State incentive', rate: 'Contribution rates' },
  dlTypes: { e: 'Shares', b: 'Bonds', f: 'Funds & ETFs', c: 'Cash & deposits', d: 'Derivatives' }, dlYes: 'yes', dlNo: 'no', dlCat: { bond: 'Bond', mixed: 'Mixed', equity: 'Equity' },
}, {
  dlBtn: 'Duomenys', dlWhat: 'Ką atsisiųsti', dlPillar: 'Pakopa', dlMgr: 'Valdytojas', dlFund: 'Fondas', dlAll: 'Visi', dlFrom: 'Nuo', dlTo: 'Iki', dlPerAll: 'tuščia = visa istorija',
  dlGo: 'Atsisiųsti (.xlsx)', dlBusy: 'Ruošiama…', dlFail: 'Nepavyko paruošti failo (nėra interneto?).',
  dlSets: { all: 'Visi duomenys viename faile', nav2: 'Vieneto vertės – II pakopos fondai (kasdien)', nav3: 'Vieneto vertės – III pakopos fondai (kasdien)', aum: 'Grynieji aktyvai ir vieneto vertės (kasdien, II ir III)',
    lb: 'LB ketvirčių rezultatai: dalyviai, turtas, grąžos', pay: 'Pensijų reformos išmokos', macro: 'Infliacija, darbo užmokestis, pensijos, MMA, valstybės paskata, įmokų tarifai',
    estr: '€STR palūkanų norma (mėnesio)', fee: 'Valdymo mokesčiai', pf: 'Portfeliai su priemonių informacija' },
  dlNote: { all: 'Visi duomenų rinkiniai atskiruose lapuose (portfeliai – paskutinis laikotarpio ketvirtis; visus portfelius galima atsisiųsti atskirai).',
    nav2: 'Du lapai: „Lentelė“ – kiekvienas fondas atskirame stulpelyje; „Sąrašas“ – po eilutę kiekvienam fondui ir dienai. Kaip skelbia valdytojai.', nav3: 'Du lapai: „Lentelė“ – kiekvienas fondas atskirame stulpelyje; „Sąrašas“ – po eilutę kiekvienam fondui ir dienai. Kaip skelbia valdytojai.',
    aum: 'Po eilutę kiekvienam fondui ir dienai: vieneto vertė ir grynieji aktyvai (€). Kol nebuvo kasdienių duomenų – LB ketvirčio pabaigos sumos.',
    lb: 'Kiekvienas fondas kiekvieno ketvirčio pabaigoje nuo 2015 m.: dalyviai, grynieji aktyvai, grąžos, lyginamasis indeksas, rizika; LB grupių vidurkiai; pakopų ir valdytojų sumos.',
    pay: '2026 m. pensijų reformos išmokos pagal valdytoją ir fondą, įvertintos iš kasdienių grynųjų aktyvų (žr. puslapio „Turtas“ metodiką).',
    macro: 'Atskiri lapai: VKI (mėnesio), vidutinis darbo užmokestis, vidutinė senatvės pensija, MMA, valstybės paskata, įmokų tarifai.',
    estr: 'Euro trumpalaikės palūkanų normos (€STR) mėnesio vidurkis (ECB).', fee: 'Kiekvieno fondo dabartinis metinis valdymo mokestis, %.',
    pf: 'Po eilutę kiekvienai pozicijai kiekvieno ketvirčio pabaigoje (LB ataskaitos) su turto klase, regionu, SFDR, TER, o obligacijoms – išpirkimo data, kuponu, pajamingumu ir trukme. Tuščia = nežinoma.' },
  dlSrcH: ['Duomenų rinkinys', 'Lapas', 'Ką rodo', 'Šaltinis', 'Nuoroda', 'Atnaujinama', 'Pastabos'], dlSrcT: 'Šio failo duomenų šaltiniai', dlMade: 'Failas sukurtas', dlPer: 'Laikotarpis', dlSite: 'Svetainė',
  dlDisc: 'Informacinė medžiaga, ne investavimo rekomendacija. Duomenys renkami automatiškai iš viešų šaltinių; cituojant nurodykite pirminį šaltinį.',
  dlCols: { q: 'Ketvirčio pabaiga', mgr: 'Valdytojas', pl: 'Pakopa', code: 'Fondo kodas', fund: 'Fondas', grp: 'Grupė', pos: 'Pozicija', isin: 'ISIN', issuer: 'Emitentas / bendrovė', type: 'Tipas', alt: 'Alternatyvios rūšis', cty: 'Šalis', cur: 'Valiuta', units: 'Vienetai / nominalas', val: 'Vertė, €', w: 'Svoris, %', ac: 'Turto klasė', reg: 'Regionas', em: 'Besivystančios rinkos', ap: 'Valdymo būdas', sfdr: 'SFDR', ter: 'TER, %', hdg: 'Valiutos apsauga', th: 'Tema', src: 'Šaltinis', mat: 'Išpirkimo data', cpn: 'Kuponas, %', frn: 'Kintama palūkanų norma', ytm: 'Pajamingumas iki išpirkimo, %', md: 'Modifikuota trukmė', yrs: 'Metai iki išpirkimo', date: 'Data', unit: 'Vieneto vertė', nav: 'Grynieji aktyvai, €', navm: 'Grynieji aktyvai, mln. €', part: 'Dalyviai', nf: 'Fondų', lbg: 'LB grupė', ytd: 'Grąža nuo metų pradžios, %', r1: 'Grąža per 1 m., %', r3: 'Grąža per 3 m. (metinė), %', r5: 'Grąža per 5 m. (metinė), %', gcf: 'Grąža nuo veiklos pradžios (metinė), %', bmytd: 'Lyginamasis indeksas nuo metų pradžios, %', bm1: 'Lyginamasis indeksas per 1 m., %', std3: 'Standartinis nuokrypis 3 m., %', risky: 'Rizikingas turtas, %', rq: 'Ketvirčio grąža, % (apskaičiuota)', file: 'LB failas', month: 'Mėnuo', year: 'Metai', cpi: 'VKI (2025 = 100)', gross: 'Bruto, €', net: 'Neto, €', pens: 'Vidutinė senatvės pensija, €', imax: 'Paskata, €/mėn. (dalyvis moka 3 %)', imin: 'Paskata, €/mėn. (laipsniškas tarifas)', from: 'Nuo', sodra: 'Sodra, % nuo atlyginimo', state: 'Valstybė, % nuo VDU', pp: 'Dalyvis, % nuo atlyginimo', ppg: 'Dalyvis (laipsniškas), %', estr: '€STR, %', fee: 'Valdymo mokestis, %/metus', qa: 'Prašymų ketvirtis', pdate: 'Išmokėjimo dienos', paid: 'Išmokėta, mln. €', base: 'Turtas prieš išmoką, mln. €', share: 'Dalis turto, %', est: 'Įvertinta iš ketvirčio duomenų' },
  dlSheets: { tab: 'Lentelė', list: 'Sąrašas', lbf: 'LB fondai', lba: 'LB vidurkiai', lbt: 'LB sumos', cpi: 'VKI', wage: 'Darbo užmokestis', pens: 'Vidutinė pensija', mw: 'MMA', inc: 'Valstybės paskata', rate: 'Įmokų tarifai' },
  dlTypes: { e: 'Akcijos', b: 'Obligacijos', f: 'Fondai ir ETF', c: 'Pinigai ir indėliai', d: 'Išvestinės' }, dlYes: 'taip', dlNo: 'ne', dlCat: { bond: 'Obligacijų', mixed: 'Mišrus', equity: 'Akcijų' },
});
const DL_SETS = ['all', 'nav2', 'nav3', 'aum', 'lb', 'pay', 'macro', 'estr', 'fee', 'pf'];
const DL = { what: 'all', pl: '', mgr: '', fund: '', from: '', to: '', cache: {} };
try { const s = JSON.parse(localStorage.getItem('dlState') || '{}'); if (DL_SETS.includes(s.what)) DL.what = s.what; if (s.from) DL.from = s.from; if (s.to) DL.to = s.to; } catch (e) {}
function dlLoad(file, name) {             // grąžina failo kintamąjį (DATA, PF, AUM …), neliečiant puslapio kintamųjų
  if (!DL.cache[file]) DL.cache[file] = fetch(file, { cache: 'no-cache' }).then(r => { if (!r.ok) throw new Error(file); return r.text(); }).then(t => new Function(t + `;return ${name};`)());
  return DL.cache[file];
}
const LB_URL = 'https://www.lb.lt/lt/pf-veiklos-rodikliai';
const dlIn = s => (!DL.from || s >= DL.from) && (!DL.to || s <= DL.to);          // ISO data / mėnuo / metai laikotarpyje
const dlInY = y => (!DL.from || String(y) >= DL.from.slice(0, 4)) && (!DL.to || String(y) <= DL.to.slice(0, 4));
const dlD = s => s ? { v: dayOf(s.length === 7 ? s + '-01' : s) + 25569, z: s.length === 7 ? 'yyyy-mm' : 'yyyy-mm-dd' } : null;
const dlH = (hdr, rows) => [hdr.map(h => ({ v: h, s: 'hdr' })), ...rows];
const dlSheet = (name, hdr, rows, w) => ({ name, rows: dlH(hdr, rows), o: { cols: w || hdr.map(h => Math.min(44, Math.max(10, String(h).length + 2))), freeze: { r: 1 }, filter: rows.length ? `A1:${XL.col(hdr.length - 1)}${rows.length + 1}` : null } });
const dlDays = f => f.d || (() => { const d = [f.d0]; f.dd.forEach(x => d.push(d[d.length - 1] + x)); return d; })();
const dlFresh = () => typeof FRESH !== 'undefined' ? FRESH : { urls: {}, providers: [] };
const dlLink = u => u ? { v: u, l: u, s: 'link' } : '';

/* kiekvienas rinkinys grąžina { sheets: [...], src: [[rinkinys, lapas, ką rodo, šaltinis, nuoroda, atnaujinama, pastabos], …] } */
const DLB = {
  async nav2() { return dlNavSet(false); },
  async nav3() { return dlNavSet(true); },
  async aum() {
    const A = await dlLoad('data_aum.js', 'AUM'), c = T().dlCols, L = lang === 'lt', rows = [];
    A.funds.forEach(f => (f.d || []).forEach((d, i) => { const s = iso(d); if (dlIn(s)) rows.push([dlD(s), f.pl, labelOfMgr(f.p), f.g === 'turto' ? (L ? 'turto išsaugojimo' : 'asset preservation') : T().dlCat[f.g] || f.g, f.n, f.code || '', f.u ? f.u[i] : null, f.a && f.a[i] != null ? Math.round(f.a[i] * 1e6) : null]); }));
    rows.sort((a, b) => a[0].v - b[0].v);
    const sh = L ? 'Turtas kasdien' : 'Daily assets';
    return { sheets: [dlSheet(sh, [c.date, c.pl, c.mgr, c.grp, c.fund, c.code, c.unit, c.nav], rows, [11, 7, 11, 18, 46, 12, 12, 16])],
      src: [[T().dlSets.aum, sh, T().dlNote.aum, L ? 'Valdytojų svetainės (kasdien); LB ketvirčio portfelių ataskaitos' : 'Managers’ websites (daily); Bank of Lithuania quarterly portfolio reports', dlLink(dlFresh().urls.pf || LB_URL), L ? 'Darbo dienomis' : 'Business days', '']] };
  },
  async lb() {
    const M = typeof MKT !== 'undefined' ? MKT : await dlLoad('data_mkt.js', 'MKT'), t = T(), c = t.dlCols, L = lang === 'lt', K = Object.fromEntries(M.cols.row.map((k, i) => [k, i])), KA = Object.fromEntries(M.cols.avg.map((k, i) => [k, i]));
    const fr = [], av = [], tot = [];
    ['II', 'III'].forEach(pl => {
      const P = M[pl];
      P.rows.forEach(r => { const d = P.dates[r[0]], f = P.funds[r[1]]; if (!dlIn(d)) return;
        fr.push([dlD(d), pl, f[0], f[1], P.groups[f[2]][1], r[K.part], r[K.nav], ...['ret_ytd', 'ret_1y', 'ret_3y', 'ret_5y', 'ret_gcf', 'bm_ytd', 'bm_1y', 'std_3y', 'risky', 'ret_q'].map(k => r[K[k]])]); });
      P.avgs.forEach(a => { const d = P.dates[a[0]]; if (!dlIn(d)) return;
        av.push([dlD(d), pl, a[1] < 0 ? (L ? 'Visi fondai' : 'All funds') : P.groups[a[1]][1], ...['ret_ytd', 'ret_1y', 'ret_3y', 'ret_5y', 'ret_gcf', 'bm_ytd', 'bm_1y'].map(k => a[KA[k]])]); });
      P.dates.forEach((d, di) => { if (!dlIn(d)) return; const by = {};
        P.rows.forEach(r => { if (r[0] !== di) return; const m = P.funds[r[1]][0]; [m, ''].forEach(k => { const x = by[k] || (by[k] = [0, 0, 0]); x[0] += r[K.part] || 0; x[1] += r[K.nav] || 0; x[2]++; }); });
        Object.keys(by).sort().forEach(m => tot.push([dlD(d), pl, m || (L ? 'Visa pakopa' : 'Whole pillar'), by[m][0], +by[m][1].toFixed(3), by[m][2]])); });
    });
    const S = t.dlSheets;
    return { sheets: [dlSheet(S.lbt, [c.q, c.pl, c.mgr, c.part, c.navm, c.nf], tot, [12, 7, 14, 12, 14, 7]),
      dlSheet(S.lbf, [c.q, c.pl, c.mgr, c.fund, c.lbg, c.part, c.navm, c.ytd, c.r1, c.r3, c.r5, c.gcf, c.bmytd, c.bm1, c.std3, c.risky, c.rq], fr, [12, 7, 11, 46, 40, 11, 12, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12]),
      dlSheet(S.lba, [c.q, c.pl, c.lbg, c.ytd, c.r1, c.r3, c.r5, c.gcf, c.bmytd, c.bm1], av, [12, 7, 50, 11, 11, 11, 11, 11, 11, 11])],
      src: [[t.dlSets.lb, `${S.lbt}, ${S.lbf}, ${S.lba}`, t.dlNote.lb, L ? 'Lietuvos bankas, II ir III pakopos pensijų fondų veiklos rezultatai (ketvirčio failai)' : 'Bank of Lithuania, pillar II and III pension fund results (quarterly files)', dlLink(LB_URL), L ? 'Kas ketvirtį' : 'Quarterly',
        L ? 'Pirmtakai priskirti dabartiniam valdytojui (Aviva → Allianz, DNB → Luminor, Finasta / MP Pension Funds Baltic / INVL / SB Asset Management → Artea, Danske Capital → Swedbank). II pakopos 2015-06-30 failo LB nepaskelbė. III pakopos dalyvių suma – per fondus. Ketvirčio grąža apskaičiuota iš LB grąžų nuo metų pradžios.'
          : 'Predecessors are counted with today’s manager. The pillar II file for 2015-06-30 was not published. Pillar III participants are summed over funds. Quarter return computed from Bank of Lithuania year-to-date returns.']] };
  },
  async pay() {
    const A = await dlLoad('data_aum.js', 'AUM'), c = T().dlCols, L = lang === 'lt', rows = [];
    A.payouts.forEach(p => { if (!dlIn(p.dates[0] || '')) return; Object.entries(p.funds || {}).forEach(([n, v]) => rows.push([typeof appQ === 'function' ? appQ(p.q) : p.q, labelOfMgr(p.p), n, (p.dates || []).join(', '), v[0], v[1], v[1] ? +(v[0] / v[1] * 100).toFixed(3) : null, p.est ? T().dlYes : T().dlNo])); });
    const sh = L ? 'Reformos išmokos' : 'Reform payouts';
    return { sheets: [dlSheet(sh, [c.qa, c.mgr, c.fund, c.pdate, c.paid, c.base, c.share, c.est], rows, [12, 11, 46, 24, 13, 16, 12, 12])],
      src: [[T().dlSets.pay, sh, T().dlNote.pay, L ? 'Apskaičiuota iš valdytojų skelbiamų kasdienių grynųjų aktyvų ir vieneto verčių' : 'Computed from managers’ daily net assets and unit values', '', L ? 'Kas ketvirtį' : 'Quarterly', L ? 'Išmoka = turto pokytis, kurio nepaaiškina vieneto vertės pokytis.' : 'Payout = change in assets not explained by the unit value change.']] };
  },
  async macro() {
    const J = await dlLoad('data_journey.js', 'JDATA'), t = T(), c = t.dlCols, S = t.dlSheets, L = lang === 'lt';
    const src = k => (J.fresh || []).find(x => x.key === k) || {}, yrs = o => Object.keys(o || {}).filter(dlInY).sort();
    const sh = [dlSheet(S.cpi, [c.month, c.cpi], Object.keys(J.cpi || {}).filter(dlIn).sort().map(m => [dlD(m), J.cpi[m]]), [10, 16]),
      dlSheet(S.wage, [c.year, c.gross, c.net], yrs(J.wages).map(y => [+y, ...J.wages[y]]), [8, 12, 12]),
      dlSheet(S.pens, [c.year, c.pens], yrs(J.pensions).map(y => [+y, J.pensions[y]]), [8, 26]),
      dlSheet(S.mw, [c.year, c.gross, c.net], yrs(J.minWage).map(y => [+y, ...J.minWage[y]]), [8, 12, 12]),
      dlSheet(S.inc, [c.year, c.imax, c.imin], yrs(J.incentive).map(y => [+y, ...J.incentive[y]]), [8, 30, 30]),
      dlSheet(S.rate, [c.from, c.sodra, c.state, c.pp, c.ppg], (J.rates || []).filter(r => !DL.to || r[0] <= DL.to).map(r => [dlD(r[0]), ...r.slice(1)]), [11, 18, 20, 20, 18])];
    const row = (k, sheet, what, note = '') => { const s = src(k); return [s[lang] || s.lt || k, sheet, what, s[lang] || s.lt || '', dlLink(s.url), s.auto ? (L ? 'Automatiškai' : 'Automatic') : (L ? 'Ranka, kartą per metus' : 'By hand, yearly'), note]; };
    const pq = J.pensionsQ && Object.entries(J.pensionsQ).map(([y, q]) => L ? `${y} m. – ${q} ketv. duomenys` : `${y} – Q${q} data`).join('; ');
    return { sheets: sh, src: [row('cpi', S.cpi, L ? 'Vartotojų kainų indeksas, mėnesio' : 'Consumer price index, monthly', L ? 'Valstybės duomenų agentūra' : 'State Data Agency'),
      row('wages', S.wage, L ? 'Vidutinis mėnesinis darbo užmokestis, metinis' : 'Average monthly wage, annual'), row('pensions', S.pens, L ? 'Vidutinė senatvės pensija' : 'Average old-age pension', pq || ''),
      row('min_wage', S.mw, L ? 'Minimali mėnesinė alga (neto – metų vidurkis)' : 'Minimum monthly wage (net – annual average)'), row('incentive', S.inc, L ? 'Valstybės paskata II pakopos dalyviui, € per mėnesį' : 'State incentive for a pillar II participant, € per month'),
      row('rates', S.rate, L ? 'II pakopos įmokų tarifai nuo datos' : 'Pillar II contribution rates from date')] };
  },
  async estr() {
    const D = await dlLoad('data.js', 'DATA'), c = T().dlCols, L = lang === 'lt', m = D.rfm, rows = [];
    if (m) { let [y, mo] = m.start.split('-').map(Number); m.v.forEach(v => { const k = `${y}-${String(mo).padStart(2, '0')}`; if (dlIn(k)) rows.push([dlD(k), v]); mo++; if (mo > 12) { mo = 1; y++; } }); }
    return { sheets: [dlSheet('€STR', [c.month, c.estr], rows, [10, 10])],
      src: [[T().dlSets.estr, '€STR', T().dlNote.estr, L ? 'Europos centrinis bankas' : 'European Central Bank', dlLink((m && m.source) || dlFresh().urls.estr), L ? 'Kasdien' : 'Daily', L ? 'Naudojama kaip nerizikinga palūkanų norma Sharpe rodikliui.' : 'Used as the risk-free rate for the Sharpe ratio.']] };
  },
  async fee() {
    const F = await dlLoad('data_fee.js', 'FEES'), c = T().dlCols, L = lang === 'lt', sh = L ? 'Mokesčiai' : 'Fees';
    const rows = Object.entries(F).filter(([k, v]) => typeof v === 'number').map(([k, v]) => { const [m, g] = k.split('|'); return [labelOfMgr(m), g === 'turto' ? (L ? 'turto išsaugojimo' : 'asset preservation') : g, v]; });
    return { sheets: [dlSheet(sh, [c.mgr, c.grp, c.fee], rows, [12, 20, 20])],
      src: [[T().dlSets.fee, sh, T().dlNote.fee, L ? 'Lietuvos bankas, pensijų fondų mokesčių failai; valdytojų taisyklės' : 'Bank of Lithuania pension fund fee files; fund rules', dlLink(dlFresh().urls.fee2 || LB_URL), L ? 'Pasikeitus mokesčiams' : 'When fees change', '']] };
  },
  async pf(only) { return dlPfSet(only); },
};
const labelOfMgr = id => ({ ALLIANZ: 'Allianz', ARTEA: 'Artea', GOINDEX: 'Goindex', LUMINOR: 'Luminor', SEB: 'SEB', SWEDBANK: 'Swedbank' })[id] || id;
async function dlNavSet(p3) {
  const D = await dlLoad(p3 ? 'data3.js' : 'data.js', 'DATA'), t = T(), c = t.dlCols, L = lang === 'lt', S = t.dlSheets, F = dlFresh();
  const label = id => (D.providers.find(p => p.id === id) || {}).label || labelOfMgr(id);
  const brand = b => b === 'SWEDBANK' ? 'Swedbank' : b === 'GOINDEX' ? 'Goindex' : b[0] + b.slice(1).toLowerCase().replace(/^eb$/, 'EB');
  const funds = D.groups.flatMap(g => g.funds.map(f => ({ g: p3 ? t.dlCat[g.id] || g.id : g.id, name: f.name, mgr: p3 ? brand(f.brand || f.provider) : label(f.provider), d: dlDays(f), v: f.v })));
  const days = [...new Set(funds.flatMap(f => f.d))].filter(d => dlIn(iso(d))).sort((a, b) => a - b), pos = new Map(days.map((d, i) => [d, i]));
  const grid = days.map(d => [dlD(iso(d)), ...funds.map(() => null)]), long = [];
  funds.forEach((f, j) => f.d.forEach((d, i) => { if (pos.has(d)) { grid[pos.get(d)][j + 1] = f.v[i]; long.push([dlD(iso(d)), f.mgr, f.g, f.name, f.v[i]]); } }));
  const pl = p3 ? 'III' : 'II', tab = `${S.tab} ${pl}`, list = `${S.list} ${pl}`;
  const src = [[t.dlSets[p3 ? 'nav3' : 'nav2'], `${tab}, ${list}`, t.dlNote.nav2, L ? 'Valdytojų svetainės ir duomenų sąsajos; ankstesnė istorija – valdytojų failai' : 'Managers’ websites and data interfaces; earlier history – managers’ files', dlLink(p3 ? F.urls.p3 : F.urls.nav), L ? 'Darbo dienomis' : 'Business days', L ? 'Vieneto vertės jau po valdymo mokesčio.' : 'Unit values are already net of fees.']];
  if (!p3) (F.providers || []).forEach(p => src.push(['', '', p.label, L ? `${p.label} – vieneto vertės` : `${p.label} – unit values`, dlLink(p.url), '', '']));
  return { sheets: [{ name: tab, rows: [[{ v: c.date, s: 'hdr' }, ...funds.map(f => ({ v: f.name, s: 'hdr' }))], ...grid], o: { cols: [11, ...funds.map(() => 14)], freeze: { r: 1, c: 1 } } },
    dlSheet(list, [c.date, c.mgr, c.grp, c.fund, c.unit], long, [11, 12, 12, 48, 12])], src };
}
async function dlPfSet(only) {
  const PF = await dlLoad('data_pf.js', 'PF'), t = T(), c = t.dlCols, L = lang === 'lt';
  const bm = {}; Object.entries(PF.bm || {}).forEach(([si, a]) => { const m = bm[si] = new Map(); for (let i = 0; i < a.length; i += 4) m.set(a[i], a.slice(i + 1, i + 4)); });
  const yn = x => x === true || x === 1 || x === '1' || x === 'yes' ? t.dlYes : x === false || x === 0 || x === '0' || x === 'no' ? t.dlNo : (x ?? '');
  let qs = PF.quarters.map((q, i) => i).filter(i => dlIn(PF.quarters[i]));
  if (only && qs.length) qs = [qs[qs.length - 1]];
  const qset = new Set(qs);
  const cols = ['q', 'mgr', 'pl', 'code', 'fund', 'grp', 'pos', 'isin', 'issuer', 'type', 'alt', 'cty', 'cur', 'units', 'val', 'w', 'ac', 'reg', 'em', 'ap', 'sfdr', 'ter', 'hdg', 'th', 'src', 'mat', 'cpn', 'frn', 'ytm', 'md', 'yrs'];
  const rows = [];
  PF.funds.filter(f => only || ((!DL.pl || f.pl === DL.pl) && (!DL.mgr || f.p === DL.mgr) && (!DL.fund || f.c === DL.fund))).forEach(f => {
    const tot = {}; for (let i = 0; i < f.r.length; i += 4) if (qset.has(f.r[i])) tot[f.r[i]] = (tot[f.r[i]] || 0) + f.r[i + 3];
    for (let i = 0; i < f.r.length; i += 4) {
      const qi = f.r[i]; if (!qset.has(qi)) continue;
      const si = f.r[i + 1], s = PF.secs[si], a = s[9] || [], b = s[10] || [], y = bm[si] && bm[si].get(qi);
      rows.push([dlD(PF.quarters[qi]), f.p, f.pl, f.c, f.full || f.n, f.g || '', s[8] || s[0], s[5] || '', s[8] ? s[0] : '', t.dlTypes[s[1]] || s[1], s[7] || '', s[2] || '', s[3] || '',
        f.r[i + 2], f.r[i + 3], tot[qi] ? +(f.r[i + 3] / tot[qi] * 100).toFixed(4) : null,
        a[0] || '', a[1] || '', yn(a[2]), a[3] || '', a[4] || '', a[5] ?? '', yn(a[6]), a[7] || '', a[8] || '',
        b[0] || '', b[1] ?? '', b.length ? yn(b[2]) : '', y ? y[0] : '', y && y[1] !== null ? y[1] : '', y ? y[2] : '']);
    }
  });
  const sh = L ? 'Portfeliai' : 'Portfolios', F = dlFresh();
  return { sheets: [dlSheet(sh, cols.map(k => c[k]), rows, cols.map(k => ({ fund: 40, pos: 40, issuer: 28, src: 30 }[k] || 12)))],
    src: [[t.dlSets.pf, sh, t.dlNote.pf, L ? 'Lietuvos bankas, ketvirtinės pensijų fondų investicijų ataskaitos' : 'Bank of Lithuania quarterly pension fund investment reports', dlLink(F.urls.pf || LB_URL), L ? 'Kas ketvirtį' : 'Quarterly', ''],
      ['', '', L ? 'Vertybinių popierių pavadinimai' : 'Security names', 'OpenFIGI', dlLink('https://www.openfigi.com/'), '', ''],
      ['', '', L ? 'Obligacijų sąlygos (kuponas, išpirkimas)' : 'Bond terms (coupon, maturity)', 'ESMA FIRDS', dlLink(F.urls.isin), '', ''],
      ['', '', L ? 'Fondų ir ETF savybės (TER, SFDR, regionas)' : 'Fund and ETF attributes (TER, SFDR, region)', L ? 'Fondų dokumentai, viešos ETF duomenų bazės' : 'Fund documents, public ETF databases', dlLink(F.urls.attrs), '', '']] };
}
async function dlBuild() {
  const t = T(), L = lang === 'lt', sets = DL.what === 'all' ? DL_SETS.filter(k => k !== 'all') : [DL.what], parts = [];
  for (const k of sets) { try { parts.push(await DLB[k](DL.what === 'all')); } catch (e) { console.warn('dl', k, e); } }
  if (!parts.length) throw new Error('empty');
  const site = location.href.split('#')[0].replace(/[^/]*$/, '');
  const per = DL.from || DL.to ? `${DL.from || '…'} – ${DL.to || '…'}` : (L ? 'visa istorija' : 'whole history');
  const src = [[{ v: t.dlSrcT, s: 'title' }], [{ v: t.dlMade, s: 'b' }, new Date().toLocaleString(T().locale)], [{ v: t.dlPer, s: 'b' }, per], [{ v: t.dlSite, s: 'b' }, { v: site, l: site, s: 'link' }],
    [{ v: L ? 'Metodika' : 'Methodology', s: 'b' }, { v: site + 'apie.html', l: site + 'apie.html', s: 'link' }], [], t.dlSrcH.map(h => ({ v: h, s: 'hdr' })),
    ...parts.flatMap(p => p.src), [], [{ v: t.dlDisc, s: 'note' }]];
  const wb = XL.book();
  XL.sheet(wb, L ? 'Šaltiniai' : 'Sources', src, { cols: [34, 26, 48, 48, 50, 18, 60], grid: false });
  parts.forEach(p => p.sheets.forEach(s => XL.sheet(wb, s.name.slice(0, 31), s.rows, s.o)));
  const name = { all: L ? 'Visi_duomenys' : 'All_data' }[DL.what] || (t.dlSets[DL.what] || DL.what).split(/[–(:]/)[0].trim().replace(/[^\p{L}\p{N}]+/gu, '_');
  await XL.save(wb, `${name}${DL.from || DL.to ? `_${DL.from || 'pradzia'}_${DL.to || 'dabar'}` : ''}_${iso(Math.floor(Date.now() / DAY))}.xlsx`);
}
async function dlRender() {
  const p = document.getElementById('dlPanel'), t = T();
  const opt = (v, l, cur) => `<option value="${v}"${v === cur ? ' selected' : ''}>${hEsc(l)}</option>`;
  let extra = '';
  if (DL.what === 'pf') {
    let pf = null; try { pf = await dlLoad('data_pf.js', 'PF'); } catch (e) { pf = null; }
    if (pf) {
      const fs = pf.funds.filter(f => (!DL.pl || f.pl === DL.pl) && (!DL.mgr || f.p === DL.mgr)); if (!fs.some(f => f.c === DL.fund)) DL.fund = '';
      const mgrs = [...new Set(pf.funds.map(f => f.p))].sort();
      extra = `<label class="field"><span>${t.dlPillar}</span><select data-k="pl">${opt('', t.dlAll, DL.pl)}${opt('II', 'II', DL.pl)}${opt('III', 'III', DL.pl)}</select></label>
        <label class="field"><span>${t.dlMgr}</span><select data-k="mgr">${opt('', t.dlAll, DL.mgr)}${mgrs.map(m => opt(m, m, DL.mgr)).join('')}</select></label>
        <label class="field"><span>${t.dlFund}</span><select data-k="fund">${opt('', t.dlAll, DL.fund)}${fs.map(f => opt(f.c, f.full || f.n, DL.fund)).join('')}</select></label>`;
    }
  }
  p.innerHTML = `<label class="field"><span>${t.dlWhat}</span><select data-k="what">${DL_SETS.map(k => opt(k, t.dlSets[k], DL.what)).join('')}</select></label>${extra}
    <label class="field"><span>${t.dlFrom}</span><input type="date" data-k="from" value="${DL.from}"></label><label class="field"><span>${t.dlTo}</span><input type="date" data-k="to" value="${DL.to}"></label>
    <p class="note">${t.dlPerAll}. ${t.dlNote[DL.what]}</p><button class="btn dlgo" type="button">${t.dlGo}</button>`;
  p.querySelectorAll('select, input').forEach(el => el.addEventListener('change', () => {
    DL[el.dataset.k] = el.value; try { localStorage.setItem('dlState', JSON.stringify({ what: DL.what, from: DL.from, to: DL.to })); } catch (e) {}
    dlRender();
  }));
  const go = p.querySelector('.dlgo');
  go.addEventListener('click', async () => {
    go.disabled = true; go.textContent = t.dlBusy;
    try { await dlBuild(); } catch (e) { console.error(e); alert(t.dlFail); }
    go.disabled = false; go.textContent = t.dlGo;
  });
}

/* ---------- KPI kortelės puslapio viršuje (auditas #50) ----------
   kpiRow([[pavadinimas, reikšmė, paaiškinimas?], …]) – kortelių eilutė iškart po navigacija (arba į esamą #kpis). */
addStrings({
  kpFunds: 'Funds', kpMgrs: 'Managers', kpAssets: 'Net assets', kpFrom: 'History from', kpLc: 'Life-cycle funds since', kpUntil: 'Data until', kpBn: 'bn €', kpMn: 'm €',
  kpII: 'II pillar', kpIII: 'III pillar', kpYtd: 'II pillar change this year', kpPay: y => `Reform payouts ${y}`, kpQ: 'Latest portfolio report', kpPos: 'Holdings in it', kpSecs: 'Different securities',
  kpLb: 'Bank of Lithuania results', kpMonth: 'Latest month end', kpYtdS: (v, p) => `${v} (${p})`,
}, {
  kpFunds: 'Fondų', kpMgrs: 'Valdytojų', kpAssets: 'Grynieji aktyvai', kpFrom: 'Istorija nuo', kpLc: 'Gyvenimo ciklo fondai nuo', kpUntil: 'Duomenys iki', kpBn: 'mlrd. €', kpMn: 'mln. €',
  kpII: 'II pakopa', kpIII: 'III pakopa', kpYtd: 'II pakopos pokytis šiais metais', kpPay: y => `Reformos išmokos ${y} m.`, kpQ: 'Naujausia portfelių ataskaita', kpPos: 'Pozicijų joje', kpSecs: 'Skirtingų vertybinių popierių',
  kpLb: 'LB rezultatų ataskaita', kpMonth: 'Paskutinė mėnesio pabaiga', kpYtdS: (v, p) => `${v} (${p})`,
});
const kpMoney = eur => eur >= 1e9 ? `${num(eur / 1e9, 2)} ${T().kpBn}` : `${num(eur / 1e6, 1)} ${T().kpMn}`;
function kpiRow(items) {
  let el = document.getElementById('kpis');
  if (!el) { el = document.createElement('div'); el.className = 'kpis'; el.id = 'kpis'; (document.getElementById('snav') || document.getElementById('top')).after(el); }
  el.innerHTML = items.filter(Boolean).map(([k, v, s]) => `<div class="kpi"><span>${k}</span><b>${v}</b>${s ? `<small>${s}</small>` : ''}</div>`).join('');
}
function kpiIII() {                      // III pakopa iš data3.js (Rezultatai › III pakopa)
  const fs = DATA.groups.flatMap(g => g.funds), last = Math.max(...fs.map(f => f.d[f.d.length - 1]));
  return [[T().kpFunds, fs.length], [lang === 'lt' ? 'Bendrovių' : 'Providers', new Set(DATA.providers.map(p => p.brand)).size], [T().kpFrom, iso(Math.min(...fs.map(f => f.d[0])))], [T().kpUntil, iso(last)]];
}
/* III pakopos spalvos: bendrovės prekės ženklo atspalviai, kiekvienam fondui savas (kaip p3.js) */
function p3Colors() {
  const BR = { ARTEA: [230, 55, 40], GOINDEX: [178, 80, 38], LUMINOR: [276, 52, 52], SEB: [104, 70, 34], SWEDBANK: [22, 100, 54], ALLIANZ: [205, 75, 50] }, SH = [0, 14, -10, 24, -18, 7], seen = {};
  DATA.providers.forEach((p, i) => { const [h, s, l] = BR[p.brand] || [0, 0, 45]; const k = seen[p.brand] = (seen[p.brand] ?? -1) + 1;
    document.documentElement.style.setProperty(`--s${i + 1}`, `hsl(${h} ${s}% ${Math.max(22, Math.min(74, l + SH[k % SH.length]))}%)`); });
}
function kpiII() {                       // II pakopa iš data.js („Rezultatai“, „Apžvalga“)
  const fs = DATA.groups.flatMap(g => g.funds), last = Math.max(...fs.map(f => f.d[f.d.length - 1]));
  const live = fs.filter(f => f.assets && f.assetsDate >= last - 10);
  return [[T().kpFunds, fs.length], [T().kpMgrs, DATA.providers.length], [T().kpAssets, kpMoney(live.reduce((s, f) => s + f.assets, 0)), iso(Math.max(...live.map(f => f.assetsDate)))],
    [T().kpLc, lang === 'lt' ? '2019 m. sausio 1 d.' : '1 January 2019'], [T().kpUntil, iso(last)]];   // ankstesnės pavienės vertės – pertvarkymo dienos, ne fondų pradžia (savininkas 2026-10-14)
}

/* ---------- Telefone lentelė – kortelėmis (auditas #52) ----------
   cardify(lentelė): kiekvienam langeliui data-l = jo stulpelio antraštė (ir su kelių eilučių antraštėmis);
   iki 600 px pločio eilutės rodomos kaip kortelės „antraštė: reikšmė“ (CSS table.cardable). */
function cardify(tbl) {
  if (!tbl || !tbl.tHead) return;
  const grid = [];
  [...tbl.tHead.rows].forEach((tr, r) => {
    grid[r] = grid[r] || []; let c = 0;
    [...tr.cells].forEach(th => {
      while (grid[r][c] !== undefined) c++;
      for (let i = 0; i < th.rowSpan; i++) for (let j = 0; j < th.colSpan; j++) { grid[r + i] = grid[r + i] || []; grid[r + i][c + j] = th.textContent.trim(); }
      c += th.colSpan;
    });
  });
  const n = Math.max(0, ...grid.map(r => r.length)), lab = [];
  for (let c = 0; c < n; c++) { const parts = []; grid.forEach(r => { const x = r[c]; if (x && !parts.includes(x)) parts.push(x); }); lab[c] = parts.join(' · '); }
  [...tbl.tBodies].forEach(tb => [...tb.rows].forEach(tr => { let c = 0; [...tr.cells].forEach(td => { if (td.colSpan === 1 && lab[c]) td.dataset.l = lab[c]; c += td.colSpan; }); }));
  tbl.classList.add('cardable');
}

/* ---------- Grafiko kopijavimas ir PNG (auditas #67) ----------
   Prie kiekvieno grafiko (.chart, .riskmap su SVG) – du mygtukai: „Kopijuoti vaizdą“ ir „PNG“. Vaizde – pavadinimas, grafikas ir data. */
addStrings({ cpImg: 'Copy image', cpDone: 'Copied', cpFail: 'Copying is not allowed by this browser – the PNG was downloaded instead', pngImg: 'Download PNG' },
  { cpImg: 'Kopijuoti vaizdą', cpDone: 'Nukopijuota', cpFail: 'Ši naršyklė neleidžia kopijuoti – PNG atsisiųstas', pngImg: 'Atsisiųsti PNG' });
const SVG_PROPS = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'stroke-linecap', 'stroke-linejoin', 'opacity', 'font-size', 'font-family', 'font-weight', 'text-anchor', 'dominant-baseline', 'visibility', 'display'];
function chartTitle(box) {                  // artimiausia antraštė prieš lentelę / grafiką (einant aukštyn per tėvinius elementus)
  const isH = p => p && (/^H[23]$/.test(p.tagName) || p.classList.contains('group-h')) && p.textContent.trim();
  let h = null;
  for (let n = box; n && n !== document.body && !h; n = n.parentElement) {
    for (let p = n.previousElementSibling; p && !h; p = p.previousElementSibling) {
      if (isH(p)) h = p; else if (p.querySelectorAll) { const hs = [...p.querySelectorAll('h2, h3, .group-h')].filter(isH); if (hs.length && !p.querySelector('table, svg')) h = hs[hs.length - 1]; }
    }
  }
  if (h) { h = h.cloneNode(true); h.querySelectorAll('button, select, .info, .ik, .gbadge').forEach(n => n.remove()); }
  return (h ? h.textContent : document.title).replace(/[ⓘ▾▴]/g, '').replace(/\s+/g, ' ').trim();
}
function chartPng(box) {
  return new Promise((ok, no) => {
    const svg = box.querySelector('svg'); if (!svg) return no();
    const r = svg.getBoundingClientRect(), W = Math.ceil(r.width), H = Math.ceil(r.height), bottom = 24;
    const lg = box._legend || [], cs0 = getComputedStyle(document.documentElement);
    let sub = pngSub(box); const maxC = Math.floor(W / 6.4); if (sub.length > maxC) sub = sub.slice(0, maxC - 1) + '…';
    let lx = 16, ly = 50 + (sub ? 18 : 0), leg = '';                       // legenda po pavadinimu, eilutėmis per plotį
    lg.forEach(x => { const w = 34 + x.l.length * 7.4; if (lx + w > W + 16 && lx > 16) { lx = 16; ly += 18; }
      const col = x.c.startsWith('var(') ? cs0.getPropertyValue(x.c.slice(4, -1)).trim() : x.c;
      leg += `<line x1="${lx}" x2="${lx + 18}" y1="${ly - 4}" y2="${ly - 4}" stroke="${col}" stroke-width="2.5"${x.d ? ` stroke-dasharray="${x.d}"` : ''}/><text x="${lx + 23}" y="${ly}" font-size="12" fill="${cs0.getPropertyValue('--text-2').trim()}">${x.l.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>`;
      lx += w; });
    const top = lg.length ? ly + 12 : 40 + (sub ? 18 : 0);
    const clone = svg.cloneNode(true), src = [svg, ...svg.querySelectorAll('*')], dst = [clone, ...clone.querySelectorAll('*')];
    src.forEach((el, i) => { const cs = getComputedStyle(el); dst[i].setAttribute('style', SVG_PROPS.map(p => `${p}:${cs.getPropertyValue(p)}`).join(';')); });
    clone.setAttribute('x', 16); clone.setAttribute('y', top); clone.setAttribute('width', W); clone.setAttribute('height', H);
    const cs = getComputedStyle(document.documentElement), v = k => cs.getPropertyValue(k).trim(), esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const font = getComputedStyle(document.body).fontFamily.replace(/"/g, "'");
    const stamp = pngStamp(box);
    const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${W + 32}" height="${H + top + bottom}" font-family="${font}"><rect width="100%" height="100%" fill="${v('--card') || '#fff'}"/>`
      + `<text x="16" y="26" font-size="16" font-weight="600" fill="${v('--text')}">${esc(chartTitle(box))}</text>`
      + (sub ? `<text x="16" y="44" font-size="12" fill="${v('--text-2')}">${esc(sub)}</text>` : '')
      + leg
      + new XMLSerializer().serializeToString(clone)
      + `<text x="16" y="${H + top + 16}" font-size="11" fill="${v('--text-3')}">${esc(stamp)}</text></svg>`;
    const img = new Image();
    img.onload = () => { const c = document.createElement('canvas'); c.width = (W + 32) * 2; c.height = (H + top + bottom) * 2; const x = c.getContext('2d'); x.scale(2, 2); x.drawImage(img, 0, 0); c.toBlob(b => b ? ok(b) : no(), 'image/png'); };
    img.onerror = no;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(out);
  });
}
function savePng(blob, box) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (chartTitle(box).replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 60) || 'grafikas') + '.png'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
function chartTools() {
  document.querySelectorAll('.chart, .riskmap, .mchart').forEach(box => {
    if (!box.querySelector('svg') || box.querySelector(':scope > .ctools')) return;
    if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
    const t = document.createElement('div'); t.className = 'ctools';
    const card = box.closest('section, .card'), ctbl = box._xl ? null : card && [...card.querySelectorAll('table')].find(x => x.rows.length > 1 || x.hidden);
    t.innerHTML = `<button type="button" class="btn ico" data-a="cp" title="${T().cpImg}" aria-label="${T().cpImg}">⧉</button><button type="button" class="btn ico" data-a="png" title="${T().pngImg}" aria-label="${T().pngImg}">⤓</button>`
      + (box._xl || ctbl ? `<button type="button" class="btn ico xl" data-a="xl" title="${T().tXl}" aria-label="${T().tXl}">Excel</button>` : '');
    t.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return; e.stopPropagation();
      try {
        if (b.dataset.a === 'xl') { b.disabled = true; try { if (box._xl) await box._xl(); else await tableBook(ctbl); } finally { b.disabled = false; } return; }
        const blob = await chartPng(box);
        if (b.dataset.a === 'png') return savePng(blob, box);
        try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); b.textContent = '✓'; b.title = T().cpDone; setTimeout(() => { b.textContent = '⧉'; b.title = T().cpImg; }, 1500); }
        catch (err) { savePng(blob, box); alert(T().cpFail); }
      } catch (err) { /* grafiko nėra */ }
    });
    box.append(t);
  });
}
if (typeof MutationObserver !== 'undefined') { let ctT; new MutationObserver(() => { clearTimeout(ctT); ctT = setTimeout(chartTools, 200); }).observe(document.documentElement, { childList: true, subtree: true }); }

/* ---------- Žodynėlis (auditas #66) ----------
   Užvedus pelę (telefone – palietus) ant lentelės stulpelio ar KPI pavadinimo su terminu rodomas paaiškinimas.
   Elemento turinys nekeičiamas (tik title ir klasė), todėl nesugenda kortelės, Excel ir PNG. Visas sąrašas – puslapyje „Apie“ (#glossary). */
const GLOSS = [
  { id: 'ret', m: [/^grąža|grąža,|^return/i], lt: ['Grąža', 'Vieneto vertės pokytis per laikotarpį, %. Mokesčiai jau atskaityti. Jei nenurodyta „metinė“ – sukaupta per visą laikotarpį.'], en: ['Return', 'Change in unit value over the period, %. Fees are already deducted. Unless marked “annualised”, it is cumulative over the whole period.'] },
  { id: 'uv', m: [/vieneto vert|unit value/i], lt: ['Vieneto vertė', 'Vieno fondo vieneto kaina eurais. Valdytojas ją skaičiuoja kasdien: grynieji aktyvai ÷ vienetų skaičius.'], en: ['Unit value', 'Price of one fund unit in euros, calculated daily: net assets ÷ number of units.'] },
  { id: 'aum', m: [/grynieji aktyvai|^turtas|turtas,|net assets|^assets/i], lt: ['Grynieji aktyvai (AUM)', 'Visų fondo investicijų vertė atėmus įsipareigojimus – kiek dalyvių pinigų valdo fondas.'], en: ['Net assets (AUM)', 'Value of all the fund’s investments minus liabilities – how much of the members’ money the fund manages.'] },
  { id: 'pp', m: [/p\. ?p\.|, pp\b|\bpp$/i], lt: ['Procentinis punktas (p. p.)', 'Skirtumas tarp dviejų procentų: 12 % ir 10 % skiriasi 2 p. p. (o ne 20 %).'], en: ['Percentage point (pp)', 'Difference between two percentages: 12 % and 10 % differ by 2 pp (not 20 %).'] },
  { id: 'med', m: [/median/i], lt: ['Mediana', 'Vidurinė reikšmė surikiavus: pusė fondų geriau, pusė blogiau. Mažiau jautri vienam išskirtiniam fondui nei vidurkis.'], en: ['Median', 'The middle value when sorted: half of the funds did better, half worse. Less sensitive to one outlier than the average.'] },
  { id: 'vol', m: [/svyravim|standartinis nuokryp|volatil|std/i], lt: ['Svyravimas (standartinis nuokrypis)', 'Kiek vidutiniškai grąža nukrypsta nuo savo vidurkio, perskaičiuota metams. Didesnis – vertė šokinėja labiau, rizika didesnė.'], en: ['Volatility (standard deviation)', 'How far returns typically deviate from their average, annualised. Higher means bigger swings and more risk.'] },
  { id: 'dd', x: /\b1 d\.|1-day|one-day/i, m: [/kritim|drawdown|max fall/i], lt: ['Didžiausias kritimas', 'Didžiausias vieneto vertės sumažėjimas nuo ankstesnio piko iki dugno per laikotarpį, %.'], en: ['Maximum fall (drawdown)', 'The largest drop in unit value from a previous peak to the bottom within the period, %.'] },
  { id: 'runup', x: /\b1 d\.|1-day|one-day/i, m: [/kilim|run-?up/i], lt: ['Kilimas', 'Didžiausias vieneto vertės padidėjimas nuo žemiausio taško iki vėlesnio piko per laikotarpį, %.'], en: ['Run-up', 'The largest rise in unit value from a low to a later peak within the period, %.'] },
  { id: 'sharpe', m: [/sharp|šarp/i], lt: ['Sharpe koeficientas', '(Metinė grąža − vidutinė tų pačių dienų nerizikinga palūkanų norma €STR) ÷ svyravimas. Rodo, kiek grąžos gauta už prisiimtą riziką; didesnis – geriau.'], en: ['Sharpe ratio', '(Annualised return − average risk-free rate €STR over the same days) ÷ volatility. Return earned per unit of risk; higher is better.'] },
  { id: 'cagr', m: [/metinė grąža|annuali[sz]ed|cagr/i], lt: ['Metinė grąža', 'Vidutinė grąža per metus, jei ji būtų buvusi vienoda kasmet: (1 + grąža)^(1 ÷ metai) − 1.'], en: ['Annualised return', 'Average yearly return if it had been the same each year: (1 + return)^(1 ÷ years) − 1.'] },
  { id: 'ytd', m: [/nuo metų pradžios|^šie metai|ytd|this year/i], lt: ['Nuo metų pradžios (YTD)', 'Grąža nuo praėjusių metų gruodžio 31 d. iki naujausios dienos.'], en: ['Year to date (YTD)', 'Return from 31 December of last year to the latest day.'] },
  { id: 'lc', m: [/gyvenimo ciklo|life-cycle/i], lt: ['Gyvenimo ciklo fondas', 'II pakopos fondas pagal gimimo metų grupę: jauniems daugiau akcijų, artėjant pensijai rizika automatiškai mažinama. Lyginami tik tos pačios grupės fondai.'], en: ['Life-cycle fund', 'Pillar II fund for a birth-year group: more equities when young, risk reduced automatically towards retirement. Only funds of the same group are compared.'] },
  { id: 'tif', m: [/turto išsaugojimo|preservation/i], lt: ['Turto išsaugojimo fondas', 'II pakopos fondas pensijos amžių pasiekusiems: daugiausia obligacijos ir pinigai, maža rizika.'], en: ['Asset-preservation fund', 'Pillar II fund for those at pension age: mostly bonds and cash, low risk.'] },
  { id: 'ter', m: [/\bter\b/i], lt: ['TER (bendrasis išlaidų koeficientas)', 'Fondo, į kurį investuojama (pvz. ETF), metinės išlaidos, % – papildomai prie pensijų fondo valdymo mokesčio.'], en: ['TER (total expense ratio)', 'Annual costs of an underlying fund (e.g. an ETF), % – in addition to the pension fund’s own fee.'] },
  { id: 'fee', m: [/mokest|^fee|fee,/i], lt: ['Valdymo mokestis', 'Metinis mokestis valdytojui, % turto. Atskaitomas kasdien iš vieneto vertės, todėl grąžoje jau įvertintas.'], en: ['Management fee', 'Annual fee to the manager, % of assets. Deducted daily from the unit value, so already reflected in returns.'] },
  { id: 'etf', m: [/\betf\b/i], lt: ['ETF', 'Biržoje prekiaujamas fondas, dažniausiai indeksinis (atkartoja indeksą, pvz. MSCI World), su mažomis išlaidomis.'], en: ['ETF', 'Exchange-traded fund, usually an index fund (tracks an index such as MSCI World) with low costs.'] },
  { id: 'idx', m: [/indeksin|index fund|\bindex\b/i], lt: ['Indeksinis fondas', 'Fondas, kuris ne renkasi akcijas pats, o atkartoja rinkos indeksą. Aktyvus fondas bando indeksą aplenkti.'], en: ['Index fund', 'A fund that tracks a market index instead of picking securities. An active fund tries to beat the index.'] },
  { id: 'sfdr', m: [/sfdr/i], lt: ['SFDR straipsnis', 'ES tvarumo atskleidimo reglamentas: 6 str. – be tvarumo tikslų, 8 str. – skatina aplinkos ar socialines savybes, 9 str. – turi tvaraus investavimo tikslą.'], en: ['SFDR article', 'EU sustainability disclosure regulation: Article 6 – no sustainability goals, Article 8 – promotes environmental or social characteristics, Article 9 – has a sustainable investment objective.'] },
  { id: 'ytm', m: [/ytm|pajamingum|yield/i], lt: ['Pajamingumas iki išpirkimo (YTM)', 'Metinė grąža, kurią duotų obligacija, jei būtų laikoma iki išpirkimo ir emitentas sumokėtų viską laiku.'], en: ['Yield to maturity (YTM)', 'Annual return a bond would give if held to maturity and the issuer paid everything on time.'] },
  { id: 'dur', m: [/trukm|duration/i], lt: ['Modifikuota trukmė', 'Kiek % pasikeistų obligacijos kaina, palūkanoms pasikeitus 1 p. p. Didesnė trukmė – jautresnė palūkanoms.'], en: ['Modified duration', 'How much a bond’s price would change in % if interest rates moved by 1 pp. Longer duration means more rate sensitivity.'] },
  { id: 'alt', m: [/alternaty|alternative/i], lt: ['Alternatyvios investicijos', 'Privataus kapitalo, nekilnojamojo turto, infrastruktūros ir panašūs fondai – nekotiruojami biržoje, vertinami rečiau.'], en: ['Alternative investments', 'Private equity, real estate, infrastructure and similar funds – not exchange-listed, valued less often.'] },
  { id: 'risky', m: [/rizikingas turtas|risky assets/i], lt: ['Rizikingas turtas', 'Lietuvos banko skaičiuojama akcijų ir panašaus rizikingo turto dalis fondo portfelyje, %.'], en: ['Risky assets', 'Share of equities and similar risky assets in the fund’s portfolio as reported by the Bank of Lithuania, %.'] },
  { id: 'em', m: [/besivystanč|emerging/i], lt: ['Besivystančios rinkos (EM)', 'Kinija, Indija, Taivanas, Brazilija ir kt. – didesnio augimo, bet ir didesnės rizikos rinkos.'], en: ['Emerging markets (EM)', 'China, India, Taiwan, Brazil etc. – faster-growing but riskier markets.'] },
  { id: 'estr', m: [/€str|estr/i], lt: ['€STR', 'Europos centrinio banko skelbiama vienos nakties euro palūkanų norma – naudojama kaip nerizikinga grąža.'], en: ['€STR', 'The euro overnight interest rate published by the ECB – used as the risk-free return.'] },
  { id: 'real', m: [/reali grąža|infliacij|real return|inflation|vki|cpi/i], lt: ['Reali grąža, infliacija (VKI)', 'Reali grąža = grąža atėmus kainų augimą pagal Lietuvos vartotojų kainų indeksą (VKI).'], en: ['Real return, inflation (CPI)', 'Real return = return after price growth measured by the Lithuanian consumer price index (CPI).'] },
  { id: 'ann', m: [/anuitet|annuit/i], lt: ['Anuitetas', 'Sodros mokama periodinė išmoka iš II pakopos sukaupto turto iki gyvos galvos (standartinis, paveldimas arba atidėtasis).'], en: ['Annuity', 'Lifelong periodic payment by Sodra from the assets saved in pillar II (standard, inheritable or deferred).'] },
  { id: 'rr', m: [/pakeitimo norm|replacement/i], lt: ['Pakeitimo norma', 'Pensija ÷ paskutinis atlyginimas, % – kiek pajamų išlieka išėjus į pensiją.'], en: ['Replacement rate', 'Pension ÷ last wage, % – how much income remains after retiring.'] },
  { id: 'flow', m: [/srautas|įmokos ir perėjim|išmokos|contributions|payouts|flow/i], lt: ['Įmokos, perėjimai ir išmokos', 'Turto pokytis, kurio nepaaiškina grąža: naujos įmokos, perėjimai tarp fondų ir valdytojų, išmokos (2026 m. reformos išmokos – atskirai).'], en: ['Contributions, switches and payouts', 'Change in assets not explained by returns: new contributions, switches between funds and managers, payouts (2026 reform payouts shown separately).'] },
];
const glossText = g => (lang === 'lt' ? g.lt : g.en);
function glossScan() {
  document.querySelectorAll('th, .kpi > span, .bk > .l, .alloc > span:first-child').forEach(el => {
    const txt = el.textContent.trim();
    if (!txt || txt.length > 60 || (el.title && !el.classList.contains('glt'))) return;
    const g = GLOSS.find(x => !(x.x && x.x.test(txt)) && x.m.some(r => r.test(txt)));
    if (!g) { if (el.classList.contains('glt')) { el.classList.remove('glt'); el.removeAttribute('title'); } return; }
    const [h, d] = glossText(g); el.classList.add('glt'); el.title = `${h}: ${d}`;
  });
}
(() => {
  let tm; const run = () => { clearTimeout(tm); tm = setTimeout(glossScan, 150); };
  document.addEventListener('DOMContentLoaded', () => { glossScan(); new MutationObserver(run).observe(document.body, { childList: true, subtree: true }); });
  // telefone title nesimato – palietus terminą parodomas mažas langelis
  document.addEventListener('click', e => {
    const old = document.querySelector('.glpop'); if (old) old.remove();
    const el = e.target.closest && e.target.closest('.glt'); if (!el || !matchMedia('(hover: none)').matches) return;
    const p = document.createElement('div'); p.className = 'glpop'; p.textContent = el.title; document.body.append(p);
    const r = el.getBoundingClientRect(); p.style.top = `${scrollY + r.bottom + 6}px`; p.style.left = `${Math.max(8, Math.min(r.left, innerWidth - p.offsetWidth - 8))}px`;
  });
})();

/* ---------- Lentelių įrankiai (savininko užduotis 2026-10-16) ----------
   Prie kiekvienos lentelės: „Kopijuoti kaip paveikslėlį“ (Teams, el. laiškas), „Kopijuoti kaip lentelę“ (Excel, Teams – skaičiai)
   ir „Excel“ – failas su lapais Rezultatas (kaip ekrane), [Skaičiavimas, Duomenys – jei puslapis užregistravo XLB builderį]
   ir Metodika (iš kur duomenys, kaip skaičiuojama, žinomi apribojimai – tie patys tekstai kaip puslapyje „Apie“). */
addStrings({ tCpImg: 'Copy as image (Teams, e-mail)', tCpTbl: 'Copy as table (paste into Excel or Teams)', tXl: 'Excel with calculations and sources', tDone: 'Copied ✓', tFail: 'This browser does not allow copying – the file was downloaded instead' },
  { tCpImg: 'Kopijuoti kaip paveikslėlį (Teams, el. laiškas)', tCpTbl: 'Kopijuoti kaip lentelę (įklijuoti į Excel ar Teams)', tXl: 'Excel su skaičiavimais ir šaltiniais', tDone: 'Nukopijuota ✓', tFail: 'Ši naršyklė neleidžia kopijuoti – failas atsisiųstas' });
const XLB = new Map();                    // lentelės id → async () => ({ sheets: [{ name, rows, o }], meth: [[…]] }) – išsamūs skaičiavimai
function xlCellOf(text) {                 // ekrano tekstas → Excel reikšmė: „12,58 %“ → 0,1258 (formatas %), „2026-10-14“ → data
  const raw = String(text).replace(/[  ]/g, ' ').replace(/[ⓘ▾▴⚠✓]/g, '').trim();
  if (!raw || raw === '–' || raw === '-') return null;
  if (/^\d{4}-\d\d-\d\d$/.test(raw)) return { v: Math.round(Date.parse(raw) / 864e5) + 25569, z: 'yyyy-mm-dd' };
  const m = /^([−+-]?)([\d ,.]+?)\s?(%|p\. ?p\.|pp|€|EUR|mln\. €|mlrd\. €|tūkst\. €|mln\. EUR|€ ?\/ ?mėn\.|€ ?\/ ?month|m\.|d\.)?\*?$/.exec(raw);
  if (!m) return raw;
  let s = m[2].trim(); s = lang === 'en' ? s.replace(/,/g, '') : s.replace(/ /g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(s)) return raw;
  const neg = m[1] === '−' || m[1] === '-', n = Number(s) * (neg ? -1 : 1), dec = (s.split('.')[1] || '').length;
  if (m[3] === '%') return { v: n / 100, z: dec ? '0.' + '0'.repeat(dec) + '%' : '0%' };
  return { v: n, z: dec ? '0.' + '0'.repeat(dec) : '0' };
}
function tblCtx(tbl) {
  const card = tbl.closest('section, .card') || tbl.parentElement;
  const txt = sel => [...card.querySelectorAll(sel)].filter(n => !n.closest('table')).map(n => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const srcEl = tbl.closest('[data-src]') || card.querySelector('[data-src]');
  return { card, title: chartTitle(tbl), notes: [...txt('.concl'), ...txt('.meta, .sub, caption'), ...txt('p.note')].filter((x, i, a) => a.indexOf(x) === i),
    src: srcEl ? srcEl.dataset.src : '', srcLine: (txt('p.srcl')[0] || '').replace(/ · .*$/, '') };
}
function loadMeth() { return typeof DOC !== 'undefined' ? Promise.resolve() : new Promise(ok => { const s = document.createElement('script'); s.src = 'methodology.js?h=' + new Date().toISOString().slice(0, 13).replace(/\D/g, ''); s.onload = ok; s.onerror = ok; document.head.append(s); }); }
function tblRows(tbl) {                     // lentelė → eilutės (antraštės su colspan išskleidžiamos), be mygtukų ir ženkliukų
  const c = tbl.cloneNode(true); c.querySelectorAll('button, .info, .ik, .ttools, svg').forEach(n => n.remove());
  const out = [];
  [...c.rows].forEach(tr => {
    const head = tr.parentElement.tagName === 'THEAD' || [...tr.cells].every(x => x.tagName === 'TH') && tr.parentElement.tagName !== 'TBODY';
    const row = []; [...tr.cells].forEach(td => { const t = td.textContent.replace(/\s+/g, ' ').trim(); row.push({ t, th: td.tagName === 'TH' }); for (let i = 1; i < (td.colSpan || 1); i++) row.push({ t: '', th: true }); });
    out.push({ head, avg: tr.classList.contains('avg'), gap: tr.classList.contains('gap'), row });
  });
  return out.filter(r => !r.gap && r.row.some(x => x.t));
}
async function tableBook(tbl) {
  await loadMeth();
  const L = lang === 'lt', ctx = tblCtx(tbl), wb = XL.book(), rows = tblRows(tbl), nC = Math.max(...rows.map(r => r.row.length));
  const until = typeof FRESH !== 'undefined' ? iso(FRESH.top) : '';
  const res = [[{ v: ctx.title, s: 'title' }], ...ctx.notes.map(n => [{ v: n, s: 'sub' }]),
    [{ v: (L ? 'Duomenys iki ' : 'Data until ') + until + (ctx.srcLine ? ' · ' + ctx.srcLine : ''), s: 'sub' }], []];
  const top = res.length;
  rows.forEach(r => res.push(r.row.map((x, i) => {
    if (r.head) return { v: x.t, s: 'hdr' };
    const c = i === 0 && !/^[−+-]?\d/.test(x.t) ? x.t : xlCellOf(x.t);
    if (c === null) return r.avg ? { v: '', s: 'sum' } : null;
    const o = typeof c === 'object' ? c : { v: c };
    return { ...o, s: r.avg ? 'sum' : i === 0 ? 'b' : 'res' };
  })));
  const widths = Array.from({ length: nC }, (_, i) => Math.min(48, Math.max(10, ...rows.map(r => (r.row[i] ? r.row[i].t.length : 0) + 2))));
  const nHead = rows.filter(r => r.head).length;
  let rich = null;
  if (tbl.id && XLB.has(tbl.id)) { try { rich = await XLB.get(tbl.id)(); } catch (e) { console.warn(e); rich = null; } }
  if (!(rich && rich.own)) XL.sheet(wb, L ? 'Rezultatas' : 'Result', res, { cols: widths, freeze: { r: top + nHead, c: 1 } });   // own – builderis pateikia savo „Rezultatas“ lapą su formulėmis
  if (rich) {                               // builderio metodikos lapas sujungiamas su bendru „Metodika“ lapu
    const mi = rich.sheets.findIndex(s => /^(Metodika|Methodology)/i.test(s.name));
    if (mi >= 0) { rich.meth = (rich.meth || []).concat(rich.sheets[mi].rows.slice(1).map(r => (r || []).map((c, i) => c === null || c === undefined ? null : { v: typeof c === 'object' ? c.v : c, s: i ? 'note' : 'b' }))); rich.sheets.splice(mi, 1); }
    rich.sheets.forEach(s => XL.sheet(wb, s.name, s.rows, s.o || {}));
  }
  const D = typeof DOC !== 'undefined' ? (DOC[lang] || DOC.lt) : null, sec = D && ctx.src ? D.secs.find(s => s.id === ({ rep: 'rep' }[ctx.src] || ctx.src)) : null;
  const page = location.href, apie = page.split('#')[0].replace(/[^/]*$/, '') + 'apie.html' + (sec ? '#' + sec.id : '');
  const m = [[{ v: L ? 'Metodika ir šaltiniai' : 'Methodology and sources', s: 'title' }], [],
    [{ v: L ? 'Lentelė' : 'Table', s: 'b' }, ctx.title], [{ v: L ? 'Puslapis' : 'Page', s: 'b' }, { v: page, l: page, s: 'link' }],
    [{ v: L ? 'Duomenys iki' : 'Data until', s: 'b' }, until], [{ v: L ? 'Failas sukurtas' : 'File created', s: 'b' }, new Date().toLocaleString(T().locale)], [],
    [{ v: L ? 'Kaip skaityti šį failą' : 'How to read this file', s: 'b' }],
    [{ v: L ? 'Mėlyni skaičiai' : 'Blue numbers', s: 'in' }, { v: L ? 'Pradiniai duomenys iš šaltinio (pvz. valdytojo paskelbta vieneto vertė) – juos galima patikrinti šaltinyje.' : 'Source data (e.g. the unit value published by the manager) – can be checked at the source.', s: 'note' }],
    [{ v: L ? 'Juodi skaičiai' : 'Black numbers', s: 'calc' }, { v: L ? 'Excel formulės – spustelėkite langelį ir viršuje pamatysite, iš kurių langelių jis skaičiuojamas.' : 'Excel formulas – click a cell to see which cells it is computed from.', s: 'note' }],
    [{ v: L ? 'Geltonas fonas' : 'Yellow background', s: 'res' }, { v: L ? 'Rezultatas – tas pats skaičius, kuris rodomas svetainėje.' : 'Result – the same figure shown on the site.', s: 'note' }],
    [{ v: L ? 'Žalias fonas' : 'Green background', s: 'sum' }, { v: L ? 'Vidurkio ar suvestinės eilutė.' : 'Average or summary row.', s: 'note' }], []];
  if (ctx.notes.length) m.push([{ v: L ? 'Apie lentelę' : 'About the table', s: 'b' }, { v: ctx.notes.join(' '), s: 'note' }]);
  if (sec) {
    m.push([{ v: L ? 'Šaltinis' : 'Source', s: 'b' }, { v: sec.src, s: 'note' }], [{ v: L ? 'Atnaujinama' : 'Updated', s: 'b' }, { v: sec.upd, s: 'note' }],
      [{ v: L ? 'Skaičiavimas' : 'Calculation', s: 'b' }, { v: sec.calc, s: 'note' }]);
    (sec.lim || []).forEach((x, i) => m.push([i ? '' : { v: L ? 'Žinomi apribojimai' : 'Known limitations', s: 'b' }, { v: '• ' + x, s: 'note' }]));
  }
  if (rich && rich.meth) m.push([], ...rich.meth);
  m.push([], [{ v: L ? 'Visa metodika' : 'Full methodology', s: 'b' }, { v: apie, l: apie, s: 'link' }],
    [{ v: L ? 'Pastaba' : 'Note', s: 'b' }, { v: L ? 'Informacinė medžiaga, ne investavimo rekomendacija. Duomenys renkami automatiškai iš viešų šaltinių.' : 'For information only, not investment advice. Data are collected automatically from public sources.', s: 'note' }]);
  XL.sheet(wb, L ? 'Metodika' : 'Methodology', m, { cols: [24, 110], grid: false });
  XL.save(wb, `${ctx.title.replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 50)}_${until}.xlsx`);
}
async function tableCopy(tbl) {
  const rows = tblRows(tbl), tsv = rows.map(r => r.row.map(x => x.t).join('\t')).join('\n');
  const c = tbl.cloneNode(true); c.querySelectorAll('button, .info, .ik, svg').forEach(n => n.remove());
  const html = `<table border="1" style="border-collapse:collapse;font-family:Calibri,Arial,sans-serif;font-size:11pt">` + c.innerHTML + '</table>';
  try { await navigator.clipboard.write([new ClipboardItem({ 'text/html': new Blob([html], { type: 'text/html' }), 'text/plain': new Blob([tsv], { type: 'text/plain' }) })]); return true; }
  catch (e) { try { await navigator.clipboard.writeText(tsv); return true; } catch (e2) { return false; } }
}
const TBL_PROPS = ['color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style', 'font-variant-numeric', 'text-align', 'vertical-align', 'white-space', 'line-height',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-collapse', 'border-spacing', 'width', 'min-width'];
/* paveikslėliui prezentacijoms (savininkas 2026-10-16): po pavadinimu – laikotarpis / paaiškinimas, apačioje – šaltinis ir duomenų data */
function pngSub(el) {
  const c = el.id && document.getElementById('c_' + el.id), card = el.closest('.card, section') || el.parentElement;
  const m = c && c.textContent.trim() ? c : card && [...card.querySelectorAll('.meta, .cap, p.note')].find(n => !n.closest('table') && n.textContent.trim());
  const t = m ? m.textContent.replace(/\s+/g, ' ').trim() : '';
  return t.length > 260 ? t.slice(0, 257) + '…' : t;
}
function pngStamp(el) {
  const card = el.closest('.card, section') || el.parentElement, sl = card && [...card.querySelectorAll('p.srcl')].map(n => n.textContent.replace(/\s+/g, ' ').trim()).find(Boolean);
  const src = sl ? sl.replace(/ · Metodika.*$|· Methodology.*$/, '').trim() : '';
  return [T().siteTitle, src || (typeof FRESH !== 'undefined' ? T().dataUntil + ' ' + iso(FRESH.top) : '')].filter(Boolean).join(' · ');
}
function tablePng(tbl) {                    // lentelė → PNG: kopija su įterptais stiliais SVG foreignObject viduje → drobė
  return new Promise((ok, no) => {
    const cs0 = getComputedStyle(document.documentElement), v = k => cs0.getPropertyValue(k).trim();
    const clone = tbl.cloneNode(true);
    const src = [tbl, ...tbl.querySelectorAll('*')], dst = [clone, ...clone.querySelectorAll('*')];
    src.forEach((el, i) => { const cs = getComputedStyle(el); dst[i].setAttribute('style', TBL_PROPS.map(p => `${p}:${cs.getPropertyValue(p)}`).join(';') + ';position:static'); });
    clone.querySelectorAll('button, .info, .ik').forEach(n => n.remove());
    const sub = pngSub(tbl), W = Math.ceil(Math.max(tbl.scrollWidth, tbl.getBoundingClientRect().width)), H = Math.ceil(tbl.scrollHeight), pad = 16;
    const head = 34 + (sub ? 18 * Math.ceil(sub.length * 6.6 / Math.max(300, W)) : 0), foot = 28;
    const stamp = pngStamp(tbl), font = getComputedStyle(document.body).fontFamily;
    const wrap = document.createElement('div');
    wrap.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    wrap.setAttribute('style', `width:${W}px;padding:${pad}px;background:${v('--card') || '#fff'};font-family:${font};color:${v('--text')}`);
    const h = document.createElement('div'); h.textContent = chartTitle(tbl); h.setAttribute('style', 'font-size:16px;font-weight:600;margin-bottom:10px');
    const f = document.createElement('div'); f.textContent = stamp; f.setAttribute('style', `font-size:11px;color:${v('--text-3')};margin-top:8px`);
    const sb = document.createElement('div'); sb.textContent = sub; sb.setAttribute('style', `font-size:12px;color:${v('--text-2')};margin:-6px 0 10px;line-height:1.45`);
    wrap.append(h, ...(sub ? [sb] : []), clone, f);
    const TW = W + pad * 2, TH = H + head + foot + pad * 2;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TW}" height="${TH}"><foreignObject width="100%" height="100%">${new XMLSerializer().serializeToString(wrap)}</foreignObject></svg>`;
    const img = new Image();
    img.onload = () => { const c = document.createElement('canvas'); c.width = TW * 2; c.height = TH * 2; const x = c.getContext('2d'); x.scale(2, 2); x.drawImage(img, 0, 0);
      try { c.toBlob(b => b ? ok(b) : no(), 'image/png'); } catch (e) { no(e); } };
    img.onerror = no;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}
let TBL_N = 0;
function richXls(tbl) {                   // artimiausias puslapio „⤓ Excel“ mygtukas (button.xls), priklausantis tai pačiai daliai
  for (let n = tbl; n && n !== document.body; n = n.parentElement) {
    if (n !== tbl && n.querySelectorAll && n.querySelectorAll('table').length > 1 && !n.matches('[data-tab]')) { const own = [...n.querySelectorAll('button.xls')].filter(x => !x.closest('table')); if (own.length === 1 && n.querySelectorAll('table').length <= 2) return own[0]; }
    for (let p = n.previousElementSibling; p; p = p.previousElementSibling) {
      if (p.matches('table') || (p.querySelector && p.querySelector('table'))) break;
      const b = p.matches('button.xls') ? p : p.querySelector && p.querySelector('button.xls'); if (b) return b;
      if (/^H[12]$/.test(p.tagName)) break;
    }
    for (let p = n.nextElementSibling; p; p = p.nextElementSibling) {   // mygtukas iškart po lentele (pvz. „⤓ Excel su formulėmis“)
      if (p.matches('table') || (p.querySelector && p.querySelector('table')) || /^H[123]$/.test(p.tagName)) break;
      const b = p.matches('button.xls') ? p : p.querySelector && p.querySelector('button.xls'); if (b) return b;
    }
    if (n.matches && n.matches('[data-tab], section.sec')) break;
  }
  return null;
}
function tableTools() {
  document.querySelectorAll('main table, .wrap table').forEach(tbl => {
    if (tbl._tt || tbl.hidden || tbl.closest('.ntc, .ttools, header, .fresh, .fmore') || tbl.rows.length < 2) return;
    tbl._tt = true; if (!tbl.id) tbl.id = 'tbl' + (++TBL_N);
    const host = tbl.closest('.scroll') || tbl;
    const t = document.createElement('div'); t.className = 'ttools';
    t.innerHTML = `<button type="button" class="btn ico" data-a="img" title="${T().tCpImg}" aria-label="${T().tCpImg}">⧉</button>`
      + `<button type="button" class="btn ico" data-a="tbl" title="${T().tCpTbl}" aria-label="${T().tCpTbl}">⊞</button>`
      + `<button type="button" class="btn ico xl" data-a="xl" title="${T().tXl}" aria-label="${T().tXl}">Excel</button>`;
    t.addEventListener('click', async e => {
      const b = e.target.closest('button'); if (!b) return; e.stopPropagation();
      const flash = ok => { const o = b.textContent; b.textContent = ok ? '✓' : '!'; b.title = ok ? T().tDone : T().tFail; setTimeout(() => { b.textContent = o; b.title = T()[{ img: 'tCpImg', tbl: 'tCpTbl', xl: 'tXl' }[b.dataset.a]]; }, 1500); };
      try {
        if (b.dataset.a === 'xl') {
          /* jei lentelė turi savo išsamų Excel (su formulėmis, žingsniais ir šaltiniais) – naudojamas jis (savininkas 2026-10-16:
             „Excel failai nerodo jokių skaičiavimų“ – bendras mygtukas eksportuodavo tik rodomas reikšmes) */
          const rich = !(tbl.id && XLB.has(tbl.id)) && richXls(tbl);
          if (rich) { rich.click(); return; }
          b.disabled = true; await tableBook(tbl); b.disabled = false; return; }
        if (b.dataset.a === 'tbl') return flash(await tableCopy(tbl));
        const blob = await tablePng(tbl);
        try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); flash(true); }
        catch (err) { savePng(blob, tbl); alert(T().tFail); }
      } catch (err) { b.disabled = false; flash(false); console.error(err); }
    });
    /* jei lentelė yra tinklelio / eilutės (grid, flex) narys, įrankių juosta su lentele apgaubiama vienu elementu –
       kitaip juosta tampa atskiru tinklelio langeliu ir išstumia gretimą grafiką (savininkas 2026-10-16: „grafikai keistos formos“) */
    const pd = host.parentElement ? getComputedStyle(host.parentElement).display : 'block';
    if (/grid|flex/.test(pd)) { const w = document.createElement('div'); w.className = 'ttwrap'; w.style.minWidth = '0'; host.before(w); w.append(t, host); }
    else host.before(t);
  });
}
if (typeof MutationObserver !== 'undefined') { let ttT; new MutationObserver(() => { clearTimeout(ttT); ttT = setTimeout(tableTools, 250); }).observe(document.documentElement, { childList: true, subtree: true }); }

/* ---------- Skyriai, paieška ir katalogas (savininko patvirtinta struktūra 2026-10-16) ----------
   Meniu – 6 skyriai; po skyriumi – jo puslapių juosta. Paieška viršuje: tuščia – katalogas (kas yra kiekviename skyriuje
   ir ką gausi paspaudęs), su tekstu – rezultatai. Nuoroda „puslapis#go=…“ nuveda tiesiai prie lentelės ar grafiko. */
const SECTIONS = [
  { id: 'home', icon: 'index', pages: ['index', 'review', 'ops'] },
  { id: 'results', icon: 'performance', pages: ['performance', 'performance3', 'pillar3', 'overview'] },
  { id: 'mgr', icon: 'manager', pages: ['manager'] },
  { id: 'pf', icon: 'portfolios', pages: ['portfolios', 'aum'] },
  { id: 'rep', icon: 'reports', pages: ['reports'] },
  { id: 'jr', icon: 'journey', pages: ['journey'] },
];
addStrings({
  secNav: { home: 'Home', results: 'Results', mgr: 'Managers & funds', pf: 'Portfolios & assets', rep: 'Reports', jr: 'Retirement path', about: 'About', help: 'Help' },
  subNav: { index: 'Market today', review: 'Monthly review', ops: 'Data calendar', performance: 'Pillar II', performance3: 'Pillar III', pillar3: 'Pillar III categories', overview: 'Group charts', manager: 'Manager & fund', portfolios: 'Portfolios', aum: 'Assets (AUM)', reports: 'Reports', journey: 'Retirement path' },
  navOps: 'Data calendar', qPh: 'Search for a fund, metric or table…', qCat: 'Catalog – what you can find', qFound: q => `Found: “${q}”`, qNone: 'Nothing found. Try another word – or browse the catalog.',
  qOpen: 'Open →', qKind: { t: 'Table', g: 'Chart', x: 'Text', c: 'Calculator', p: 'Profile', d: 'Term', m: 'Methodology', f: 'Fund', s: 'Holding' }, qHint: 'Tip: press / to search',
}, {
  secNav: { home: 'Pradžia', results: 'Rezultatai', mgr: 'Valdytojai ir fondai', pf: 'Portfeliai ir turtas', rep: 'Ataskaitos', jr: 'Kelias į pensiją', about: 'Apie', help: 'Pagalba' },
  subNav: { index: 'Rinka šiandien', review: 'Mėnesio apžvalga', ops: 'Duomenų kalendorius', performance: 'II pakopa', performance3: 'III pakopa', pillar3: 'III pakopos kategorijos', overview: 'Grupių grafikai', manager: 'Valdytojas ir fondas', portfolios: 'Portfeliai', aum: 'Turtas (AUM)', reports: 'Ataskaitos', journey: 'Kelias į pensiją' },
  navOps: 'Duomenų kalendorius', qPh: 'Ieškoti fondo, rodiklio ar lentelės…', qCat: 'Katalogas – ką galima rasti', qFound: q => `Rasta: „${q}“`, qNone: 'Nieko nerasta. Pabandykite kitą žodį – arba naršykite katalogą.',
  qOpen: 'Atidaryti →', qKind: { t: 'Lentelė', g: 'Grafikas', x: 'Tekstas', c: 'Skaičiuoklė', p: 'Kortelė', d: 'Terminas', m: 'Metodika', f: 'Fondas', s: 'Investicija' }, qHint: 'Patarimas: paspauskite /, kad ieškotumėte',
});
// [skyrius, puslapis, go (id arba antraštės pradžia), rūšis, Excel, LT pavadinimas, LT – ką pamatysi, EN pavadinimas, EN aprašymas, papildomi žodžiai]
const CATALOG = [
  ['home', 'index', '', 'x', 0, 'Šiandien trumpai', 'Metų lyderis ir paskutinis, savaitės pokytis, II pakopos turtas, didžiausias skirtumas grupėje.', 'Today in brief', 'Year-to-date leader and laggard, weekly change, pillar II assets, widest gap in a group.', 'santrauka kpi lyderis'],
  ['home', 'index', 'Gyvenimo ciklo grupės', 't', 1, 'Lyderis ir paskutinis kiekvienoje grupėje', 'Kiekvienos gimimo metų grupės geriausias ir silpniausias fondas šiais metais ir skirtumas tarp jų.', 'Leader and laggard in each group', 'Best and weakest fund in each birth-year group this year and the gap.', 'grupės lyderis'],
  ['home', 'index', 'qfTitle', 'x', 1, 'Ketvirčio faktai naujienoms', 'Paruošti sakiniai apie visą II ir III pakopos rinką, valdytojus ir fondus iš LB ketvirčio ataskaitų – su šaltiniu ir mygtuku „Kopijuoti“.', 'Quarter facts for news', 'Ready sentences on the whole pillar II and III market, managers and funds from Bank of Lithuania quarterly reports – with source and a Copy button.', 'lipfa naujiena faktai dalyviai turtas prieaugis ketvirtis lb'],
  ['home', 'index', 'pvTitle', 'x', 1, 'Faktai visuomenei ir naujienlaiškiams', 'Paprasti faktai: ką grąža reiškia eurais (1 000 € prieš 5 metus), kiek fondai uždirba per dieną ir vienam dalyviui – su Excel skaičiavimais.', 'Facts for the public and newsletters', 'Plain facts: what returns mean in euros (€ 1,000 five years ago), daily and per-participant earnings – with Excel calculations.', 'marketingas naujienlaiškis visuomenė grąža eurais padvigubėjo per dieną dalyviui'],
  ['home', 'index', 'p23Title', 'x', 1, 'II ir III pakopa: palyginimas', 'III pakopos augimas vykstant II pakopos reformai: turtas, dalyviai, pinigų srautai, valdytojai, kurių augimas paspartėjo.', 'Pillars II and III compared', 'Pillar III growth during the pillar II reform: assets, participants, money flows, managers whose growth accelerated.', 'reforma iii pakopa augimas paspartėjo srautai valdytojai kartu'],
  ['home', 'index', 'mkTitle', 't', 1, 'Rinka laike: dalyviai ir turtas nuo 2015 m.', 'Kiekvieno ketvirčio dalyviai, grynieji aktyvai, turtas vienam dalyviui, svertinė grąža, investicinis prieaugis; dalyviai pagal grupes.', 'Market over time: participants and assets since 2015', 'Participants, net assets, assets per participant, weighted return and investment gain each quarter; participants by group.', 'dalyvių skaičius istorija 2015 reforma'],
  ['home', 'index', 'mgTitle', 't', 1, 'Valdytojų rinkos dalys', 'Kiekvieno valdytojo dalyviai, turtas, rinkos dalis ir jų pokyčiai per ketvirtį ir metus; rinkos dalis laike.', 'Manager market shares', 'Each manager’s participants, assets, market share and their change over the quarter and year; share over time.', 'rinkos dalis valdytojai dalyviai'],
  ['home', 'index', 'fdTitle', 't', 1, 'Fondai pagal LB grupes', 'Kiekvieno ketvirčio fondų dalyviai, turtas, grąžos ir LB svertinis grupės vidurkis – nuo 2015 m.', 'Funds by Bank of Lithuania group', 'Each quarter’s fund participants, assets, returns and the Bank of Lithuania weighted group average – since 2015.', 'lb grupės vidurkis fondai grąža dalyviai'],
  ['home', 'review', '', 'x', 1, 'Mėnesio apžvalga', 'Praėjusio mėnesio rezultatai: valdytojai, grupių lyderiai, kas keitė turtą, III pakopos lyderiai.', 'Monthly review', 'Last month: managers, group leaders, what changed assets, pillar III leaders.', 'mėnuo ketvirtis apžvalga'],
  ['home', 'ops', '', 'g', 0, 'Duomenų kalendorius', 'Kada kokie duomenys atkeliavo, kas nepavyko, kas laukia ateityje ir ką reikia įkelti ranka.', 'Data calendar', 'When data arrived, what failed, what is coming and what has to be uploaded by hand.', 'būsena atnaujinimas klaidos kalendorius'],
  ['home', 'ops', 'hArr', 't', 1, 'Kada valdytojai paskelbia vertes', 'Kiekvieno valdytojo vertės paskelbimo laikas per paskutines dienas ir įprastas laikas.', 'When managers publish values', 'Publication time of each manager’s values over recent days and the usual time.', 'laikas skelbimas'],
  ['results', 'performance', 'hSum', 't', 1, 'Automatinė santrauka', 'Pasirinktam laikotarpiui: kiekvienos grupės lyderis, atsiliekantis, didžiausias dienos kilimas ir kritimas.', 'Automatic summary', 'For the chosen period: leader, laggard, biggest daily rise and fall in each group.', 'santrauka geriausia blogiausia diena best worst day lyderis leader'],
  ['results', 'performance', 'hMarket', 't', 1, 'Visa rinka: grąža ir vieta', 'Visi fondai viename vaizde: eilutės – amžiaus grupės, stulpeliai – valdytojai; grąža, vieta, skirtumas nuo konkurentų, metinė grąža. Savos datos.', 'Whole market: return and rank', 'All funds in one view: rows – age groups, columns – managers; return, rank, relative, annualised. Custom dates.', 'grąža vieta reitingas heatmap mediana svertinis'],
  ['results', 'performance', 'hOv', 't', 1, 'Bendras reitingas', 'Kiek kartų kiekvienas valdytojas buvo 1-as ar 2-as per visas grupes ir laikotarpius.', 'Overall ranking', 'How often each manager ranked 1st or 2nd across all groups and periods.', 'reitingas vieta'],
  ['results', 'performance', 'hFund', 'g', 1, 'Fondų palyginimas grafike', 'Pasirinktos grupės fondų vertės kreivės, galima pridėti MSCI ir S&P 500 indeksus.', 'Fund comparison chart', 'Value lines of the chosen group’s funds, with MSCI and S&P 500 indices.', 'grafikas linija indeksas msci sp500'],
  ['results', 'performance', 'hBar', 'g', 0, 'Laikotarpio grąža (juostos)', 'Vienos grupės fondų ir indeksų grąža, surikiuota nuo didžiausios.', 'Period return (bars)', 'One group’s funds and indices, sorted by return.', 'juostos'],
  ['results', 'performance', 'hDd', 'g', 1, 'Kilimas ir kritimas', 'Didžiausias kritimas nuo piko ir kilimas nuo dugno kiekvienam fondui.', 'Rise and fall', 'Largest drawdown and run-up for each fund.', 'drawdown kritimas rizika'],
  ['results', 'performance', 'hMetrics', 't', 1, 'Rezultatų rodikliai', 'Grąža, metinė grąža, svyravimas, didžiausias kritimas pasirinktai grupei.', 'Performance metrics', 'Return, annualised return, volatility, max drawdown for the chosen group.', 'svyravimas volatility rodikliai'],
  ['results', 'performance', 'hRisk', 't', 1, 'Sharpe pagal grupes', 'Grąžos ir rizikos santykis kiekvienam valdytojui kiekvienoje grupėje, su vidutine laikotarpio €STR.', 'Sharpe by group', 'Return-to-risk ratio for each manager in each group, using the period-average €STR.', 'sharpe rizika estr'],
  ['results', 'performance', 'Papildomi rodikliai', 't', 1, 'Papildomi rodikliai', 'Sharpe, geriausia ir blogiausia diena, mėnuo, metai, teigiamų mėnesių dalis.', 'Advanced metrics', 'Sharpe, best and worst month, share of positive months.', 'sharpe geriausias blogiausias geriausia blogiausia mėnuo best worst month'],
  ['results', 'performance', 'hYM', 't', 1, 'Kalendorinių metų grąža', 'Kiekvienų metų grąža kiekvienam fondui.', 'Calendar-year returns', 'Each year’s return for each fund.', 'metai kalendoriniai geriausi blogiausi metai best worst year annual'],
  ['results', 'performance', 'hYM', 't', 1, 'Slenkanti grąža', 'Grąža per paskutinius 1, 3, 6, 12, 36, 60 mėn. ir slenkančių 1 metų statistika.', 'Rolling returns', 'Return over the last 1–60 months and rolling 1-year statistics.', 'slenkanti rolling'],
  ['results', 'performance', 'hOv', 't', 1, 'Vieta pagal laikotarpį', 'Vienos grupės valdytojų vietos skirtingais laikotarpiais.', 'Rank by period', 'One group’s manager ranks over different periods.', 'vieta laikotarpis'],
  ['results', 'performance', 'hYM', 't', 1, 'Mėnesių grąžos šilumos žemėlapis', 'Kiekvieno mėnesio grąža spalvomis – matyti geri ir blogi mėnesiai.', 'Monthly heat map', 'Every month’s return in colour – good and bad months at a glance.', 'mėnesiai heatmap'],
  ['results', 'performance3', '', 'g', 1, 'III pakopa: grafikai, rizika, kalendoriniai metai', 'Tie patys įrankiai kaip II pakopai: fondų palyginimo grafikas, rodikliai, Sharpe, kritimai, kalendoriniai metai, mėnesių grąža – fondai lyginami savo kategorijoje.', 'Pillar III: charts, risk, calendar years', 'The same tools as for pillar II: comparison chart, metrics, Sharpe, drawdowns, calendar years, monthly returns – funds compared within their category.', 'iii trečia pakopa savanoriška voluntary sharpe kalendoriniai'],
  ['results', 'pillar3', '', 't', 1, 'III pakopa: visi fondai', 'Obligacijų, mišraus investavimo ir akcijų fondai: grąža, vieta kategorijoje, svyravimas.', 'Pillar III: all funds', 'Bond, mixed and equity funds: return, rank in category, volatility.', 'iii trečia pakopa obligacijų akcijų mišrūs'],
  ['results', 'overview', '', 'g', 0, 'Grupių grafikai', 'Kiekvienos gimimo metų grupės fondų vertės kreivės vienoje vietoje.', 'Group charts', 'Value lines of every birth-year group in one place.', 'grafikai grupės apžvalga'],
  ['mgr', 'manager', '10 didžiausių', 't', 1, '10 didžiausių pozicijų', 'Kiekvieno valdytojo ar fondo didžiausios investicijos ir jų dalis portfelyje.', 'Top 10 holdings', 'Each manager’s or fund’s largest investments and their share of the portfolio.', 'top 10 top10 didžiausios pozicijos holdings largest'],
  ['mgr', 'manager', '', 'p', 1, 'Valdytojo ir fondo kortelė', 'Vieno valdytojo II ir III pakopos fondai, vieta grupėje, turtas, portfelis, didžiausios pozicijos.', 'Manager and fund profile', 'One manager’s pillar II and III funds, rank, assets, portfolio, top holdings.', 'valdytojas fondas kortelė'],
  ['pf', 'portfolios', 'ovTitle', 't', 1, 'Ketvirčio apžvalga', 'Kas pasikeitė per ketvirtį pas kiekvieną valdytoją, kuo išsiskiria fondai (randama automatiškai), pasirinktų fondų palyginimas.', 'Quarter overview', 'What changed in the quarter for each manager, what makes funds stand out (found automatically), comparison of chosen funds.', 'ketvirtis pokyčiai išskirtinumai palyginimas'],
  ['pf', 'portfolios', '', 't', 1, 'Fondo portfelis', 'Ką fondas turi: pozicijos, turto rūšys, regionai, ką dengia portfelis.', 'Fund portfolio', 'What a fund holds: positions, asset classes, regions, coverage.', 'portfelis pozicijos akcijos obligacijos isin'],
  ['pf', 'portfolios', 'Palyginimas grupėje', 't', 1, 'Portfelių palyginimas grupėje', 'Kas lemia skirtumus tarp tos pačios grupės fondų: akcijų dalis, regionai, alternatyvos.', 'Portfolio comparison in a group', 'What drives differences between funds of a group: equity share, regions, alternatives.', 'palyginimas skirtumai'],
  ['pf', 'portfolios', 'Palyginimas grupėje', 't', 1, 'Auksas ir kitos temos portfeliuose', 'Kiek kiekvienas fondas turi aukso fondų, tvarių (SFDR 8/9) ir indeksinių investicijų.', 'Gold and other themes', 'How much gold funds, sustainable (SFDR 8/9) and index investments each fund holds.', 'gold auksas sfdr tvarios esg indeksiniai index'],
  ['pf', 'portfolios', 'Kiek panašūs', 't', 0, 'Kiek panašūs valdytojų portfeliai', 'Bendros pozicijos ir panašus profilis tarp valdytojų, %.', 'How similar portfolios are', 'Common holdings and similar profile between managers, %.', 'panašumas bendros pozicijos'],
  ['pf', 'portfolios', 'Didžiausi ketvirčio', 't', 1, 'Didžiausi ketvirčio pokyčiai', 'Ką valdytojai pirko ir pardavė per ketvirtį.', 'Biggest quarterly changes', 'What managers bought and sold in the quarter.', 'pirkimai pardavimai pokyčiai'],
  ['pf', 'portfolios', 'Alternatyvios', 't', 1, 'Alternatyvios investicijos', 'Privatus kapitalas, nekilnojamasis turtas ir kitos alternatyvos pagal fondą.', 'Alternative investments', 'Private equity, real estate and other alternatives by fund.', 'privatus kapitalas nt alternatyvos'],
  ['pf', 'aum', '', 'g', 1, 'Fondų turtas (AUM)', 'Kiek turto valdo kiekvienas valdytojas ir fondas, rinkos dalys ir pokyčiai.', 'Fund assets (AUM)', 'Assets per manager and fund, market shares and changes.', 'turtas aum rinkos dalis'],
  ['pf', 'aum', 'Kas keitė turtą', 'g', 1, 'Kas keitė turtą', 'Turto pokytis išskaidytas: grąža, įmokos, išmokos.', 'What changed assets', 'Asset change split into return, contributions and payouts.', 'srautai įmokos'],
  ['pf', 'aum', 'Išmokėjimai', 't', 1, 'Pensijų reformos išmokėjimai', 'Kiek ir kada išmokėta pagal reformą kiekvienam fondui.', 'Pension reform payouts', 'How much was paid out under the reform and when, per fund.', 'reforma išmokos'],
  ['rep', 'reports', 'Grąža nuo 2019', 't', 1, 'Grąža nuo 2019 m.', 'Kiekvienų metų ir laikotarpio grąža ataskaitų formatu.', 'Returns since 2019', 'Each year’s and period return in report format.', 'metai ataskaita'],
  ['rep', 'reports', 'Mėnesių grąža', 't', 1, 'Mėnesių grąža', 'Šių metų kiekvieno mėnesio grąža visiems fondams.', 'Monthly returns', 'This year’s monthly returns for all funds.', 'mėnesiai'],
  ['rep', 'reports', 'Rezultatų rodikliai', 't', 1, 'Rezultatų rodikliai (KPI)', 'Grąža, lyginamasis indeksas, standartinis nuokrypis – kaip Lietuvos banko lentelėse.', 'Performance KPI', 'Return, benchmark, standard deviation – as in Bank of Lithuania tables.', 'kpi lb lentelės'],
  ['rep', 'reports', 'Pusmečio ataskaitos', 't', 1, 'Pusmečio ataskaitų lentelės', 'Mokesčiai, rizikingas turtas, tvarios investicijos, portfelio sudėtis, regionai.', 'Semi-annual report tables', 'Fees, risky assets, sustainable investments, portfolio, regions.', 'pusmetis sfdr mokesčiai'],
  ['rep', 'reports', 'KID', 't', 1, 'KID veiklos rezultatų scenarijai', 'SEB fondų scenarijai: kaip PID ir pagal reglamentą.', 'KID performance scenarios', 'SEB fund scenarios: as in the KID and per the regulation.', 'kid pid scenarijai'],
  ['jr', 'journey', '', 'c', 1, 'Pensijos sudėtis ir istorija', 'Kiek sukaupta nuo pirmos įmokos, kaip augo turtas, Sodros anuitetas.', 'Pension composition and history', 'Savings since the first contribution, asset growth, Sodra annuity.', 'kaupimas įmokos anuitetas'],
  ['jr', 'journey', 'Ateities scenarijai', 'c', 1, 'Ateities scenarijai', 'Kokios pensijos galima tikėtis: Sodra, LB, tik kaupimas.', 'Future scenarios', 'What pension to expect: Sodra, BoL, savings only.', 'ateitis pakeitimo norma'],
  ['jr', 'journey', 'Mokesčių poveikis', 'c', 0, 'Mokesčių poveikis santaupoms', 'Kiek valdymo mokestis sumažina santaupas per laiką.', 'Effect of fees on savings', 'How much the management fee reduces savings over time.', 'mokesčiai'],
  ['jr', 'journey', 'pickTitle', 'c', 1, 'Kurį fondą rinktis?', 'Pagal gimimo metus ir pakopą: visi palyginami fondai įvertinami balais (grąža, pastovumas, rizika, kritimai, mokestis) ir surikiuojami.', 'Which fund to choose?', 'By year of birth and pillar: comparable funds scored on return, consistency, risk, falls and fee, and ranked.', 'geriausias fondas rinktis rekomendacija best fund choose pick kurį'],
  ['results', 'performance', 'insTitle', 'x', 1, 'Rinkos įžvalgos', 'Automatinės išvados: kas pasikeitė, kas išsiskiria per laikotarpį.', 'Market insights', 'Automatic findings: what changed, what stands out.', 'įžvalgos'],
  ['help', 'apie', '', 'm', 0, 'Metodika ir šaltiniai', 'Iš kur kiekvienas duomuo, kaip skaičiuojama, žinomi apribojimai.', 'Methodology and sources', 'Where each figure comes from, how it is computed, known limitations.', 'metodika formulės'],
  ['help', 'apie', 'sources', 't', 0, 'Duomenų šaltiniai ir atnaujinimas', 'Visi šaltiniai, kada atnaujinami, rankinio atnaujinimo tvarkaraštis.', 'Data sources and updates', 'All sources, update schedule, manual update calendar.', 'šaltiniai'],
  ['help', 'apie', 'reliability', 't', 0, 'Kas nutinka, jei šaltinis neveikia', 'Atsarginis planas kiekvienam duomeniui.', 'If a source fails', 'Backup plan for each data source.', 'atsarginis patikimumas'],
  ['help', 'apie', 'glossary', 'd', 0, 'Žodynėlis', 'Visi terminai paprastais žodžiais.', 'Glossary', 'All terms in plain words.', 'terminai'],
];
const qNorm = s => String(s).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}&]+/gu, ' ').trim();
function catalogItems() {
  const L = lang === 'lt', out = CATALOG.map(([s, p, go, k, xl, lt, ld, et, ed, kw]) => ({ s, url: `${p}.html${go ? '#go=' + encodeURIComponent(go) : ''}`, k, xl: !!xl, t: L ? lt : et, d: L ? ld : ed, kw: `${kw || ''} ${L ? et + ' ' + ed : lt + ' ' + ld}` }));   // ieškoma abiem kalbomis
  ['ALLIANZ', 'ARTEA', 'GOINDEX', 'LUMINOR', 'SEB', 'SWEDBANK'].forEach(id => {
    const nm = id === 'SEB' ? 'SEB' : id.charAt(0) + id.slice(1).toLowerCase();
    out.push({ s: 'mgr', url: `manager.html#${id}`, k: 'p', xl: true, t: nm, d: L ? `${nm}: II ir III pakopos fondai, grąža ir vieta grupėje, turtas, portfelis.` : `${nm}: pillar II and III funds, return and rank, assets, portfolio.`, kw: 'valdytojas manager' });
  });
  (typeof GLOSS !== 'undefined' ? GLOSS : []).forEach(g => { const [t, d] = L ? g.lt : g.en, o = L ? g.en : g.lt; out.push({ s: 'help', url: 'apie.html#go=glossary', k: 'd', xl: false, t, d, kw: o.join(' '), term: true }); });
  if (typeof QIDX !== 'undefined') {           // fondai ir naujausio ketvirčio investicijos (data_search.js)
    const cat = { bond: L ? 'obligacijų' : 'bond', mixed: L ? 'mišraus investavimo' : 'mixed', equity: L ? 'akcijų' : 'equity' }, ty = { e: L ? 'Akcija' : 'Stock', b: L ? 'Obligacija' : 'Bond', f: L ? 'Fondas / ETF' : 'Fund / ETF' };
    QIDX.forEach(r => {
      if (r[0] === 'f') out.push({ s: 'mgr', url: r[4], k: 'f', xl: true, t: r[1], d: r[2] === 'II' ? (L ? `II pakopos fondas · grupė ${r[3]}` : `Pillar II fund · group ${r[3]}`) : (L ? `III pakopos ${cat[r[3]] || ''} fondas` : `Pillar III ${cat[r[3]] || ''} fund`), kw: r[5], sub: true });
      else out.push({ s: 'pf', url: r[5], k: 's', xl: false, t: r[1], d: `${ty[r[2]] || ''} · ${L ? 'laiko' : 'held by'}: ${r[3].join(', ')} · ${L ? 'iki' : 'up to'} ${num(r[4], 1)} % ${L ? 'fondo' : 'of a fund'}`, kw: r[6], sub: true, sec: true });
    });
  }
  return out;
}
function qSearch(q) {
  const toks = qNorm(q).split(' ').filter(Boolean); if (!toks.length) return [];
  const T_ = T();
  return catalogItems().map(it => {
    const tt = qNorm(it.t), hay = qNorm(`${it.t} ${it.d} ${it.kw} ${T_.secNav[it.s] || ''}`);
    if (!toks.every(x => hay.includes(x))) return null;
    const ws = tt.split(' ');
    let sc = toks.reduce((a, x) => a + (ws.includes(x) ? 3 : 0) + (tt.startsWith(x) ? 6 : ws.some(w => w.startsWith(x)) ? 4 : tt.includes(x) ? 3 : 1), 0) - (it.term ? 1.5 : 0) - (it.sec ? 2 : it.sub ? 1 : 0);
    return { it, sc };
  }).filter(Boolean).sort((a, b) => b.sc - a.sc).filter((x, i, a) => !x.it.sec || a.slice(0, i).filter(y => y.it.sec).length < 8).slice(0, 14).map(x => x.it);
}
function searchUI() {
  const box = document.getElementById('q'), pn = document.getElementById('qPanel'); if (!box) return;
  let cat = (SECTIONS.find(s => s.pages.includes(document.body.dataset.page)) || SECTIONS[1]).id, sel = 0, list = [];
  const kind = it => `<span class="qk">${T().qKind[it.k] || ''}</span>${it.xl ? '<span class="qx">Excel</span>' : ''}`;
  const row = (it, i) => `<a class="qi${i === sel ? ' on' : ''}" href="${it.url}" data-i="${i}"><span class="qt">${hEsc(it.t)} ${kind(it)}</span><span class="qd">${hEsc(it.d)}</span><span class="qs">${hEsc(T().secNav[it.s] || '')}</span></a>`;
  const draw = () => {
    const t = T(), q = box.value.trim();
    if (q) {
      list = qSearch(q);
      pn.innerHTML = `<div class="qres"><div class="qh">${hEsc(t.qFound(q))}</div>${list.length ? list.map(row).join('') : `<p class="qnone">${t.qNone}</p>`}</div>`;
    } else {
      const all = catalogItems().filter(x => !x.term && !x.sub), secs = [...SECTIONS.map(s => s.id), 'help'];
      list = all.filter(x => x.s === cat);
      pn.innerHTML = `<div class="qcats"><div class="qh">${t.qCat}</div>${secs.map(s => `<button type="button" class="qc${s === cat ? ' on' : ''}" data-c="${s}"><span>${t.secNav[s]}</span><small>${all.filter(x => x.s === s).length}</small></button>`).join('')}<p class="qhint">${t.qHint}</p></div>`
        + `<div class="qres">${list.map(row).join('')}</div>`;
      pn.querySelectorAll('.qc').forEach(b => b.onmouseenter = b.onclick = () => { cat = b.dataset.c; sel = 0; draw(); });
    }
    pn.querySelectorAll('.qi').forEach(a => a.onmouseenter = () => { sel = +a.dataset.i; pn.querySelectorAll('.qi').forEach(x => x.classList.toggle('on', x === a)); });
  };
  const show = on => { pn.hidden = !on; box.setAttribute('aria-expanded', on); if (on) draw(); };
  box.placeholder = T().qPh; box.setAttribute('aria-label', T().qPh);
  const loadIdx = () => { if (typeof QIDX !== 'undefined' || loadIdx.on) return; loadIdx.on = 1; const s = document.createElement('script'); s.src = 'data_search.js?h=' + new Date().toISOString().slice(0, 13).replace(/\D/g, ''); s.onload = () => { if (!pn.hidden) draw(); }; document.head.append(s); };
  box.addEventListener('focus', () => { loadIdx(); show(true); });
  box.addEventListener('input', () => { sel = 0; show(true); });
  box.addEventListener('keydown', e => {
    if (e.key === 'Escape') { box.blur(); show(false); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(0, Math.min(list.length - 1, sel + (e.key === 'ArrowDown' ? 1 : -1))); draw(); }
    else if (e.key === 'Enter' && list[sel]) { location.href = list[sel].url; show(false); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.srch')) show(false); });
  document.addEventListener('keydown', e => { if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); box.focus(); } });
  pn.addEventListener('click', e => { const a = e.target.closest('a.qi'); if (a && a.getAttribute('href').split('#')[0] === location.pathname.split('/').pop()) setTimeout(goTo, 50); });
}
/* „#go=…“ – nuveda prie elemento pagal id arba antraštės pradžią ir trumpai jį paryškina */
function goTo() {
  let g = null; try { g = new URLSearchParams(location.hash.slice(1)).get('go'); } catch (e) {}
  if (!g) return;
  const find = () => { const byId = document.getElementById(g); if (byId) return byId;
    const n = qNorm(g); return [...document.querySelectorAll('h2, h3, .group-h')].find(h => h.offsetParent !== null && qNorm(h.textContent).startsWith(n)); };
  let tries = 0;
  const find0 = find;
  const go = () => { const el = document.getElementById(g) || [...document.querySelectorAll('h2, h3, .group-h')].find(h => qNorm(h.textContent).startsWith(qNorm(g))) || find0();
    if (el && hasTabs() && paneOf(el)) showTab(paneOf(el), true);
    if (!el || !el.offsetParent) { if (++tries < 20) setTimeout(go, 250); return; }
    el.scrollIntoView({ block: 'start', behavior: 'smooth' }); const box = el.closest('section, .card') || el; box.classList.add('goflash'); setTimeout(() => box.classList.remove('goflash'), 2200); };
  setTimeout(go, 400);
}
addEventListener('hashchange', goTo);

/* Excel pagalbininkai: stulpelio raidė (0 → A), data (dienos nuo 1970 → Excel), formulė su apskaičiuota reikšme */
const xlCol = n => { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; };
const xlDate = d => ({ t: 'n', v: d + 25569, z: 'yyyy-mm-dd' });
const xlF = (f, v, z) => ({ t: 'n', f, v: v == null || !isFinite(v) ? 0 : v, z });
/* ---------- Excel skaičiavimai auditui: kiekvienas lentelės langelis = pabaigos vieneto vertė ÷ pradžios vieneto vertė − 1 ----------
   o.rows: [{ label, cells: [{ f, name, ia, ie, col, years?, note? } | null], extra?: [reikšmė % | {langelis} | (eilutė, pirmas, paskutinis stulpelis) => langelis], calcOnly? }];
   calcOnly – eilutė tik lape „Skaičiavimai“ (pvz. konkurentai vietai skaičiuoti); o.cols – stulpelių pavadinimai.
   Lapai: „Rezultatas“ (formulės į „Skaičiavimai“), „Skaičiavimai“ (vienas langelis – viena eilutė), „Vertės“ (valdytojų vieneto vertės), „Metodika“. */
function pairBook(o) {
  const L = lang === 'lt', SC = L ? 'Skaičiavimai' : 'Calculations', SV = L ? 'Vertės' : 'Values', q = s => `'${s}'`;
  const fl = [], names = [], fi = (f, n) => { let i = fl.indexOf(f); if (i < 0) { fl.push(f); names.push(n); i = fl.length - 1; } return i; };
  const hdr = L ? ['Eilutė', 'Stulpelis', 'Fondas / indeksas', 'Pradžios vertės data', 'Pradžios vieneto vertė', 'Pabaigos vertės data', 'Pabaigos vieneto vertė', 'Grąža', 'Metai', 'Metinė grąža', 'Pastaba']
    : ['Row', 'Column', 'Fund / index', 'Start value date', 'Start unit value', 'End value date', 'End unit value', 'Return', 'Years', 'Annualized return', 'Note'];
  const step = L ? ['', '', '', 'Paskutinė vertė laikotarpio pradžios dieną ar prieš ją', '= vertė iš lapo „Vertės“ tą dieną', 'Paskutinė vertė iki laikotarpio pabaigos', '= vertė iš lapo „Vertės“ tą dieną', '= G ÷ E − 1', 'Tik metinei grąžai', '= (1 + H) ^ (1 ÷ I) − 1', '']
    : ['', '', '', 'Last value on or before the period start', '= value from sheet “Values” on that day', 'Last value up to the period end', '= value from sheet “Values” on that day', '= G ÷ E − 1', 'Annualized only', '= (1 + H) ^ (1 ÷ I) − 1', ''];
  const calc = [hdr, step.map(x => x ? { v: x, s: 'step' } : null)];
  const cellRef = o.rows.map(r => r.cells.map(c => {
    if (!c || c.ia < 0 || c.ie <= c.ia) return null;
    const k = fi(c.f, c.name), r_ = calc.length + 1, vc = xlCol(k + 1), V = q(SV);
    const look = (dc, val) => ({ t: 'n', f: `INDEX(${V}!${vc}:${vc},MATCH(${dc}${r_},${V}!$A:$A,0))`, v: val, z: '0.0000' });
    const ret = c.f.v[c.ie] / c.f.v[c.ia] - 1;
    calc.push([r.label, c.col, c.name, xlDate(c.f.d[c.ia]), look('D', c.f.v[c.ia]), xlDate(c.f.d[c.ie]), look('F', c.f.v[c.ie]), xlF(`G${r_}/E${r_}-1`, ret, '0.00%'),
      c.years ? { t: 'n', v: c.years, z: Number.isInteger(c.years) ? '0' : '0.00' } : null, c.years ? xlF(`(1+H${r_})^(1/I${r_})-1`, Math.pow(1 + ret, 1 / c.years) - 1, '0.00%') : null, c.note || null]);
    return { ref: `${q(SC)}!${c.years ? 'J' : 'H'}${r_}`, v: c.years ? Math.pow(1 + ret, 1 / c.years) - 1 : ret };
  }));
  /* Vertės: visos dienos tarp naudojamų datų; jei per daug (> 150 tūkst. langelių) – tik skaičiavimuose naudotos datos */
  const lo = fl.map(() => Infinity), hi = fl.map(() => -Infinity);
  calc.slice(2).forEach(r => { const k = names.indexOf(r[2]); lo[k] = Math.min(lo[k], r[3].v - 25569); hi[k] = Math.max(hi[k], r[5].v - 25569); });
  let days = [...new Set(fl.flatMap((f, k) => f.d.filter(d => d >= lo[k] && d <= hi[k])))].sort((a, b) => a - b), full = true;
  if (days.length * fl.length > 150000) { full = false; days = [...new Set(calc.slice(2).flatMap(r => [r[3].v - 25569, r[5].v - 25569]))].sort((a, b) => a - b); }
  const maps = fl.map(f => new Map(f.d.map((d, i) => [d, f.v[i]])));
  const vals = [[L ? 'Data' : 'Date', ...names], ...days.map(d => [xlDate(d), ...maps.map(m => m.has(d) ? m.get(d) : null)])];
  /* Rezultatas – ta pati lentelė kaip svetainėje, langeliai – formulės */
  const res = [[o.title], [o.cap || ''], [o.rowHdr || (L ? 'Fondas' : 'Fund'), ...o.cols, ...(o.extraCols || [])]];
  o.rows.forEach((r, i) => r.calcOnly || res.push([r.label, ...cellRef[i].map(x => x ? xlF(x.ref, x.v, '0.00%') : null), ...(r.extra || []).map(v => v == null ? null : typeof v === 'function' ? v(res.length + 1, xlCol(1), xlCol(o.cols.length)) : typeof v === 'object' ? v : { t: 'n', v: v / 100, z: '0.00%' })]));
  const meth = [[L ? 'Metodika ir šaltiniai' : 'Methodology and sources'],
    [L ? 'Kaip patikrinti' : 'How to check', L ? `Kiekvienas lentelės langelis „Rezultatas“ lape – formulė, nurodanti eilutę lape „${SC}“. Ten pradžios ir pabaigos vieneto vertės paimamos iš lapo „${SV}“ (INDEX/MATCH pagal datą), grąža = pabaigos vertė ÷ pradžios vertė − 1. Vieneto vertes galima palyginti su valdytojų svetainėse skelbiamomis.`
      : `Every cell of the “Result” sheet is a formula pointing to a row in “${SC}”. There, start and end unit values are taken from “${SV}” (INDEX/MATCH by date); return = end value ÷ start value − 1. Unit values can be compared with those published by the managers.`],
    [L ? 'Vertės' : 'Values', full ? (L ? 'Visos dienos vieneto vertės skaičiuojamu laikotarpiu.' : 'All daily unit values in the calculated period.') : (L ? 'Dėl failo dydžio – tik skaičiavimuose naudotų datų vertės (visos dienos – svetainėje, „Fondų palyginimas“).' : 'Due to file size – only the values on the dates used (daily values – on the site).')],
    [L ? 'Mokesčiai' : 'Fees', L ? 'Vieneto vertės jau po valdymo mokesčio – mokesčiai antrą kartą neatimami.' : 'Unit values are net of the management fee – fees are not deducted again.'],
    ...(o.meth || [])];
  const wb = XLSX_SHIM.utils.book_new(), add = (rows, name, w) => { const ws = XLSX_SHIM.utils.aoa_to_sheet(rows); ws['!cols'] = w; XLSX_SHIM.utils.book_append_sheet(wb, ws, name); };
  (o.pre || []).forEach(x => add(x.rows, x.name, x.w));          // pre – papildomi lapai prieš lentelę (pvz. suvestinė iš jos)
  add(res, o.resName || (L ? 'Rezultatas' : 'Result'), [{ wch: 30 }, ...Array(o.cols.length + (o.extraCols || []).length).fill({ wch: 11 })]);
  (o.post || []).forEach(x => add(x.rows, x.name, x.w));
  add(calc, SC, [{ wch: 26 }, { wch: 12 }, { wch: 32 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 11 }, { wch: 7 }, { wch: 12 }, { wch: 30 }]);
  add(vals, SV, [{ wch: 11 }, ...names.map(() => ({ wch: 16 }))]);
  add(meth, L ? 'Metodika' : 'Methodology', [{ wch: 16 }, { wch: 110 }]);
  return { sheets: XLSX_SHIM.toXL(wb), own: true };
}

/* ---------- Excel failų kūrimas be išorinių bibliotekų (savininko užduotis 2026-10-16) ----------
   Mažas .xlsx rašytuvas: keli lapai, formulės (Excel jas perskaičiuoja atidarius), skaičių formatai, spalvos, stulpelių
   plotis, užšaldytos eilutės, nuorodos. Veikia ir be interneto. Tas pats failas įterpiamas į common.js (build_site.py).
   Langelis: null | tekstas | skaičius | { v, f, z, s, l }
     v – reikšmė, f – formulė be „=“, z – skaičiaus formatas ('0.00%', 'yyyy-mm-dd', '0.0000'), l – nuoroda (URL),
     s – stilius: 'title' | 'sub' | 'hdr' | 'in' (pradiniai duomenys – mėlyni) | 'calc' (formulė – juoda) | 'res' (rezultatas – paryškintas,
     geltonas fonas) | 'sum' (vidurkio eilutė) | 'note' (paaiškinimas – pilkas) | 'step' (žingsnio aprašas virš stulpelio) | 'link' | 'b' (paryškintas)
   Suderinama su ankstesniu formatu { t: 'n', v, f, z }. */
const XL = (() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  const col = n => { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; };
  // šriftai: 0 įprastas, 1 paryškintas, 2 mėlynas (įvestis), 3 pilkas kursyvas, 4 antraštė, 5 nuoroda, 6 baltas paryškintas, 7 pilkas
  const FONTS = ['<font><sz val="11"/><name val="Calibri"/></font>', '<font><b/><sz val="11"/><name val="Calibri"/></font>',
    '<font><sz val="11"/><color rgb="FF0000FF"/><name val="Calibri"/></font>', '<font><i/><sz val="10"/><color rgb="FF666666"/><name val="Calibri"/></font>',
    '<font><b/><sz val="14"/><name val="Calibri"/></font>', '<font><u/><sz val="11"/><color rgb="FF0563C1"/><name val="Calibri"/></font>',
    '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>', '<font><sz val="10"/><color rgb="FF555555"/><name val="Calibri"/></font>'];
  // užpildai: 0, 1 – privalomi; 2 antraštė (žalia), 3 rezultatas (geltonas), 4 įvestis (šviesiai mėlyna), 5 žingsnis (pilkas), 6 vidurkis (šviesiai žalia)
  const FILLS = ['<fill><patternFill patternType="none"/></fill>', '<fill><patternFill patternType="gray125"/></fill>']
    .concat(['FF2F6B5A', 'FFFFF2CC', 'FFEAF1FB', 'FFF2F2F2', 'FFE2EFDA'].map(c => `<fill><patternFill patternType="solid"><fgColor rgb="${c}"/><bgColor indexed="64"/></patternFill></fill>`));
  const BORDERS = ['<border><left/><right/><top/><bottom/><diagonal/></border>', '<border><left/><right/><top style="thin"><color rgb="FF999999"/></top><bottom/><diagonal/></border>',
    '<border><left/><right/><top/><bottom style="thin"><color rgb="FFBBBBBB"/></bottom><diagonal/></border>'];
  const STY = { '': [0, 0, 0], b: [1, 0, 0], title: [4, 0, 0], sub: [7, 0, 0], hdr: [6, 2, 0, 1], in: [2, 4, 0], calc: [0, 0, 0], res: [1, 3, 0],
    sum: [1, 6, 1], note: [3, 0, 0, 1], step: [3, 5, 2, 1], link: [5, 0, 0] };
  const BUILTIN = { '0': 1, '0.00': 2, '0%': 9, '0.00%': 10, 'yyyy-mm-dd': -1 };
  function book() { return { sheets: [] }; }
  function sheet(wb, name, rows, o = {}) {
    let n = String(name).replace(/[\\/?*[\]:]/g, ' ').slice(0, 31) || 'Lapas' + (wb.sheets.length + 1);
    while (wb.sheets.some(s => s.name === n)) n = n.slice(0, 28) + '_' + wb.sheets.length;
    wb.sheets.push({ name: n, rows, o }); return n;
  }
  function norm(c) {
    if (c === null || c === undefined || c === '') return null;
    if (typeof c !== 'object') return { v: c };
    return c;
  }
  function bytes(wb) {
    const fmts = [], xfs = [], xfKey = {}, fmtId = z => { if (!z) return 0; if (BUILTIN[z] > 0) return BUILTIN[z]; let i = fmts.indexOf(z); if (i < 0) { fmts.push(z); i = fmts.length - 1; } return 164 + i; };
    const xf = (s, z) => { const k = (s || '') + '|' + (z || ''); if (xfKey[k] !== undefined) return xfKey[k];
      const [fo, fi, bo, wrap] = STY[s] || STY['']; const nf = fmtId(z);
      xfs.push(`<xf numFmtId="${nf}" fontId="${fo}" fillId="${fi}" borderId="${bo}" xfId="0"${nf ? ' applyNumberFormat="1"' : ''}${fo ? ' applyFont="1"' : ''}${fi ? ' applyFill="1"' : ''}${bo ? ' applyBorder="1"' : ''}${wrap ? ' applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>' : '/>'}`);
      return (xfKey[k] = xfs.length - 1); };
    xf('', '');
    const files = {}, rels = [];
    wb.sheets.forEach((sh, si) => {
      const links = [];
      let maxC = 0;
      const rowsX = sh.rows.map((row, ri) => {
        if (!row || !row.length) return `<row r="${ri + 1}"/>`;
        const cells = row.map((c0, ci) => {
          const c = norm(c0); if (!c) return '';
          maxC = Math.max(maxC, ci + 1);
          const ref = col(ci) + (ri + 1), s = xf(c.s, c.z);
          if (c.l) links.push({ ref, url: c.l });
          if (c.f) { const v = c.v; const num = typeof v === 'number' && isFinite(v);
            return `<c r="${ref}" s="${s}"${num ? '' : ' t="str"'}><f>${esc(String(c.f).replace(/^=/, ''))}</f>${v === undefined || v === null ? '' : `<v>${num ? v : esc(v)}</v>`}</c>`; }
          if (typeof c.v === 'number') return isFinite(c.v) ? `<c r="${ref}" s="${s}"><v>${c.v}</v></c>` : '';
          if (typeof c.v === 'boolean') return `<c r="${ref}" s="${s}" t="b"><v>${c.v ? 1 : 0}</v></c>`;
          return `<c r="${ref}" s="${s}" t="inlineStr"><is><t xml:space="preserve">${esc(c.v)}</t></is></c>`;
        }).join('');
        const ht = sh.o.heights && sh.o.heights[ri];
        return `<row r="${ri + 1}"${ht ? ` ht="${ht}" customHeight="1"` : ''}>${cells}</row>`;
      }).join('');
      const fr = sh.o.freeze && (sh.o.freeze.r || sh.o.freeze.c) ? sh.o.freeze : null, pane = fr ? `<pane${fr.c ? ` xSplit="${fr.c}"` : ''}${fr.r ? ` ySplit="${fr.r}"` : ''} topLeftCell="${col(fr.c || 0)}${(fr.r || 0) + 1}" activePane="${fr.r && fr.c ? 'bottomRight' : fr.r ? 'bottomLeft' : 'topRight'}" state="frozen"/>` : '';
      const cols = (sh.o.cols || []).map((w, i) => w ? `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>` : '').join('');
      const merges = (sh.o.merges || []);
      files[`xl/worksheets/sheet${si + 1}.xml`] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        + `<sheetViews><sheetView workbookViewId="0"${si === 0 ? ' tabSelected="1"' : ''}${sh.o.grid === false ? ' showGridLines="0"' : ''}>${pane}</sheetView></sheetViews>`
        + (cols ? `<cols>${cols}</cols>` : '') + `<sheetData>${rowsX}</sheetData>`
        + (sh.o.filter && maxC ? `<autoFilter ref="${sh.o.filter}"/>` : '')
        + (merges.length ? `<mergeCells count="${merges.length}">${merges.map(m => `<mergeCell ref="${m}"/>`).join('')}</mergeCells>` : '')
        + (links.length ? `<hyperlinks>${links.map((l, i) => `<hyperlink ref="${l.ref}" r:id="rId${i + 1}"/>`).join('')}</hyperlinks>` : '')
        + '</worksheet>';
      if (links.length) files[`xl/worksheets/_rels/sheet${si + 1}.xml.rels`] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + links.map((l, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${esc(l.url)}" TargetMode="External"/>`).join('') + '</Relationships>';
      rels.push(`<Relationship Id="rId${si + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${si + 1}.xml"/>`);
    });
    const nSh = wb.sheets.length;
    files['xl/styles.xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
      + (fmts.length ? `<numFmts count="${fmts.length}">${fmts.map((z, i) => `<numFmt numFmtId="${164 + i}" formatCode="${esc(z)}"/>`).join('')}</numFmts>` : '')
      + `<fonts count="${FONTS.length}">${FONTS.join('')}</fonts><fills count="${FILLS.length}">${FILLS.join('')}</fills><borders count="${BORDERS.length}">${BORDERS.join('')}</borders>`
      + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
      + `<cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
    files['xl/workbook.xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
      + `<sheets>${wb.sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`;
    files['xl/_rels/workbook.xml.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + rels.join('') + `<Relationship Id="rId${nSh + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
    files['_rels/.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
    files['[Content_Types].xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
      + wb.sheets.map((s, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') + '</Types>';
    return files;
  }
  // ZIP be suspaudimo (STORE) – Excel tokius failus atidaro; CRC32 skaičiuojamas čia
  const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  const crc32 = b => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  // naršyklėje suspaudžiama (deflate, CompressionStream); jei negalima – saugoma be suspaudimo
  async function deflate(data) {
    if (typeof CompressionStream === 'undefined' || typeof Response === 'undefined') return null;
    try { return new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer()); } catch (e) { return null; }
  }
  async function zip(files, compress) {
    const enc = new TextEncoder(), parts = [], central = []; let off = 0;
    const u16 = v => [v & 255, (v >>> 8) & 255], u32 = v => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
    for (const [name, text] of Object.entries(files)) {
      const nb = enc.encode(name), raw = enc.encode(text), crc = crc32(raw), z = compress ? await deflate(raw) : null;
      const data = z || raw, meth = z ? 8 : 0;
      const head = [...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(meth), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(raw.length), ...u16(nb.length), ...u16(0)];
      parts.push(new Uint8Array(head), nb, data);
      central.push(new Uint8Array([...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(meth), ...u16(0), ...u16(0x21), ...u32(crc), ...u32(data.length), ...u32(raw.length),
        ...u16(nb.length), ...u16(0), ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(off)]), nb);
      off += head.length + nb.length + data.length;
    }
    const csize = central.reduce((s, p) => s + p.length, 0), n = Object.keys(files).length;
    const end = new Uint8Array([...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(n), ...u16(n), ...u32(csize), ...u32(off), ...u16(0)]);
    const all = [...parts, ...central, end], out = new Uint8Array(all.reduce((s, p) => s + p.length, 0)); let p = 0;
    all.forEach(a => { out.set(a, p); p += a.length; });
    return out;
  }
  async function save(wb, filename) {
    const blob = new Blob([await zip(bytes(wb), true)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename.replace(/[\\/:*?"<>|]+/g, '_'); document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  return { book, sheet, bytes: (wb, compress) => zip(bytes(wb), compress), save, col };
})();
/* Suderinamumas su ankstesniu kodu (SheetJS API: XLSX.utils.book_new / aoa_to_sheet / book_append_sheet, XLSX.writeFile):
   esami Excel mygtukai veikia per šį rašytuvą, be išorinės bibliotekos ir be interneto. Stilius parenkamas automatiškai:
   pirma eilutė – antraštė, formulės – juodos, skaičiai be formulių – mėlyni (pradiniai duomenys), vienas tekstas eilutėje viršuje – pavadinimas. */
const XLSX_SHIM = {
  utils: {
    book_new: () => ({ __xl: true, sheets: [] }),
    aoa_to_sheet: rows => ({ __rows: rows }),
    book_append_sheet: (wb, ws, name) => { wb.sheets.push({ name, ws }); },
    encode_col: c => XL.col(c),
    encode_range: r => `${XL.col(r.s.c)}${r.s.r + 1}:${XL.col(r.e.c)}${r.e.r + 1}`,
  },
  writeFile: (wb, filename) => { const out = XL.book(); XLSX_SHIM.toXL(wb).forEach(s => XL.sheet(out, s.name, s.rows, s.o)); XL.save(out, filename); },
  toXL: wb => wb.sheets.map(({ name, ws }) => {
      const src = ws.__rows || [], hdrRow = src.findIndex(r => r && r.filter(x => x !== null && x !== undefined && x !== '').length > 1);
      const rows = src.map((r, ri) => (r || []).map(c => {
        if (c === null || c === undefined || c === '') return null;
        if (c instanceof Date) return { v: Math.round(c.getTime() / 864e5) + 25569, z: 'yyyy-mm-dd', s: 'in' };
        const o = typeof c === 'object' ? { v: c.v, f: c.f, z: c.z } : { v: c };
        if (ri === hdrRow && typeof o.v === 'string' && !o.f) o.s = 'hdr';
        else if (ri < hdrRow && typeof o.v === 'string') o.s = ri === 0 ? 'title' : 'sub';
        else if (o.f) o.s = 'calc';
        else if (typeof o.v === 'number') o.s = 'in';
        return o;
      }));
      const cols = (ws['!cols'] || []).map(c => c && (c.wch || c.width) || 0);
      const fr = ws['!freeze'];
      return { name, rows, o: { cols, freeze: fr ? { r: fr.ySplit || 0, c: fr.xSplit || 0 } : hdrRow >= 0 && src.length > 15 ? { r: hdrRow + 1 } : null, filter: ws['!autofilter'] && ws['!autofilter'].ref } };
  }),
};
if (typeof window !== 'undefined' && !window.XLSX) window.XLSX = XLSX_SHIM;
if (typeof module !== 'undefined') module.exports = XL;
