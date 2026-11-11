/* Pradžia – kortelių tinklelis (savininkas 2026-11-11: „kaip Microsoft Edge pradžios puslapis“).
   Kiekviena kortelė atsako į vieną klausimą: klausimas + didelis skaičius + mažas vaizdas + „Plačiau“.
   Diagramos parinktos pagal klausimą: dalis iš visumos – žiedas, „kiek iš kiek“ – progreso juosta, kelias – mini linija,
   dienų uždarbis – kalendoriaus šilumos žemėlapis, intervalas grupėse – taškai, pokytis per metus – nuolydis.
   Bandomoji versija: įjungiama nuoroda ?nauja=1 (išjungiama ?nauja=0), kol savininkas patvirtins.
   Ikonos – Fluent UI System Icons (Microsoft, MIT) site/img/ic/, nuotraukos – site/img/ (CREDITS.md).
   Skaičiai – tie patys kaip senose kortelėse (compute(), EARN, MKT): viena sąvoka – vienas apibrėžimas. */
addStrings({
  hgQ: { avg: 'How is the average fund doing?', lead: 'Who is leading?', aum: 'How much is saved?', earn: 'How much did funds earn in euros?',
    pos: 'How many funds are up?', gap: 'Where are the gaps biggest?', part: 'How many participants?', share: 'Who gained market share?' },
  hgS: {
    avg: (l, w) => `Leader ${l}, last ${w}. Simple average of the life-cycle funds.`,
    lead: n => `Managers by average return of their ${n} life-cycle funds`,
    aum: (n, d) => `${n} funds · ${d}`,
    earn: (y, d) => `Investment gain of all funds since 1 January ${y} (to ${d}). Each square is one day.`,
    pos: (k, n) => `${k} of ${n} funds have a positive return in this period`,
    gap: 'Best and weakest fund in each age group, %',
    part: (d, ch, rf) => `Bank of Lithuania, ${d} · ${ch} over the year${rf ? ' (2026 reform: some participants left and withdrew their savings)' : ''}`,
    share: (a, b) => `Share of pillar assets, ${a} → ${b}`,
  },
  hgEy: { mk: 'Market', ld: 'Leaders', as: 'Assets', er: 'Earnings', br: 'Direction', gp: 'Gaps', pt: 'Participants', sh: 'Market shares' },
  hgHiS: (c, d) => `${c} · pillar II · data to ${d}`, hgSrc: 'Source', hgUV: 'managers’ unit values', hgNA: 'net assets of the funds (managers)', hgLB: 'Bank of Lithuania', hgTh: { ret: 'Return', aum: 'Net assets, €', sh: 'Share', mon: 'Month', gain: 'Investment gain', up: 'Up / all', q: 'Quarter end', part: 'Participants' },
  hgI: { lead: 'Each manager: simple average of its funds’ returns in the life-cycle groups (one number per group).', aum: 'Latest net assets of all pillar II funds updated within 10 days, split by manager.', earn: 'Investment gain in euros: each fund’s daily return × its assets the day before, summed (see Market facts → Earnings).', pos: 'Life-cycle funds with a return above zero in the chosen period.', gap: 'Difference between the best and the weakest fund in each age group, percentage points.', part: 'Pillar II participants at the end of each quarter.', share: 'Each manager’s share of pillar assets a year ago and now; change in percentage points.' },
  hgCp: 'Copy the answer as text', hgInfo: 'What is shown and where it comes from', hgOpen: 'Expand: details and settings', hgClose: 'Collapse', hgMore: 'More', hgLess: 'less', hgMoreC: 'more', hgDay: 'day', hgMon: 'Months',
}, {
  hgQ: { avg: 'Kaip sekasi vidutiniam fondui?', lead: 'Kas pirmauja?', aum: 'Kiek sukaupta?', earn: 'Kiek fondai uždirbo eurais?',
    pos: 'Kiek fondų kyla?', gap: 'Kur didžiausi skirtumai?', part: 'Kiek dalyvių?', share: 'Kas augino rinkos dalį?' },
  hgS: {
    avg: (l, w) => `Pirmauja ${l}, paskutinis – ${w}. Paprastas gyvenimo ciklo fondų vidurkis.`,
    lead: n => `Valdytojai pagal jų ${n} gyvenimo ciklo fondų vidutinę grąžą`,
    aum: (n, d) => `${n} fondai · ${d}`,
    earn: (y, d) => `Visų fondų investicinis uždarbis nuo ${y} m. sausio 1 d. (iki ${d}). Kiekvienas kvadratėlis – viena diena.`,
    pos: (k, n) => `${k} iš ${n} fondų šiuo laikotarpiu grąža teigiama`,
    gap: 'Geriausias ir silpniausias fondas kiekvienoje amžiaus grupėje, %',
    part: (d, ch, rf) => `Lietuvos bankas, ${d} · per metus ${ch}${rf ? ' (2026 m. reforma: dalis dalyvių išėjo ir atsiėmė lėšas)' : ''}`,
    share: (a, b) => `Dalis pakopos turto, ${a} → ${b}`,
  },
  hgEy: { mk: 'Rinka', ld: 'Lyderiai', as: 'Turtas', er: 'Uždarbis', br: 'Kryptis', gp: 'Skirtumai', pt: 'Dalyviai', sh: 'Rinkos dalys' },
  hgHiS: (c, d) => `${c} · II pakopa · duomenys iki ${d}`, hgSrc: 'Šaltinis', hgUV: 'valdytojų vieneto vertės', hgNA: 'fondų grynieji aktyvai (valdytojai)', hgLB: 'Lietuvos bankas', hgTh: { ret: 'Grąža', aum: 'Grynieji aktyvai, €', sh: 'Dalis', mon: 'Mėnuo', gain: 'Investicinis uždarbis', up: 'Kilo / visi', q: 'Ketvirčio pabaiga', part: 'Dalyviai' },
  hgI: { lead: 'Kiekvienas valdytojas – paprastas jo fondų grąžų vidurkis gyvenimo ciklo grupėse (po vieną skaičių grupei).', aum: 'Paskutiniai visų II pakopos fondų, atnaujintų per 10 dienų, grynieji aktyvai pagal valdytoją.', earn: 'Investicinis uždarbis eurais: kiekvieno fondo dienos grąža × jo turtas prieš dieną, sudėta (žr. Rinkos faktai → Uždarbis).', pos: 'Gyvenimo ciklo fondai, kurių grąža pasirinktu laikotarpiu didesnė už nulį.', gap: 'Skirtumas tarp geriausio ir silpniausio fondo kiekvienoje amžiaus grupėje, procentiniais punktais.', part: 'II pakopos dalyviai kiekvieno ketvirčio pabaigoje.', share: 'Kiekvieno valdytojo dalis pakopos turto prieš metus ir dabar; pokytis procentiniais punktais.' },
  hgCp: 'Kopijuoti atsakymą tekstu', hgInfo: 'Kas rodoma ir iš kur duomenys', hgOpen: 'Išskleisti: detalės ir nustatymai', hgClose: 'Suskleisti', hgMore: 'Plačiau', hgLess: 'mažiau', hgMoreC: 'daugiau', hgDay: 'diena', hgMon: 'Mėnesiai',
});

addStrings3({
  hgQ: { avg: 'Kā veicas vidējam fondam?', lead: 'Kas ir līderis?', aum: 'Cik uzkrāts?', earn: 'Cik fondi nopelnīja eiro?', pos: 'Cik fondu aug?', gap: 'Kur atšķirības ir lielākās?', part: 'Cik dalībnieku?', share: 'Kas palielināja tirgus daļu?' },
  hgS: { avg: (l, w) => `Līderis ${l}, pēdējais ${w}.`, lead: n => `Pārvaldītāji pēc vidējā ienesīguma ${n} fondu grupās`, aum: (n, d) => `${n} fondi · ${d}`,
    earn: (y, d) => `Visu fondu ieguldījumu peļņa kopš ${y}. gada 1. janvāra (līdz ${d}). Katrs kvadrātiņš – viena diena.`, pos: (k, n) => `${k} no ${n} fondiem šajā periodā ir pozitīvs ienesīgums`,
    gap: 'Labākais un vājākais fonds katrā fondu grupā, %', part: (d, ch) => `${({ LV: 'manapensija.lv', EE: 'pensionikeskus.ee' })[typeof CTRY_COPY !== 'undefined' ? CTRY_COPY : ''] || 'Lietuvas Banka'}, ${d} · gada laikā ${ch}`, share: (a, b) => `Daļa no līmeņa aktīviem, ${a} → ${b}` },
  hgEy: { mk: 'Tirgus', ld: 'Līderi', as: 'Aktīvi', er: 'Peļņa', br: 'Virziens', gp: 'Atšķirības', pt: 'Dalībnieki', sh: 'Tirgus daļas' },
  hgHiS: (c, d) => `${c} · II līmenis · dati līdz ${d}`, hgMore: 'Vairāk', hgLess: 'mazāk', hgMoreC: 'vairāk', hgSrc: 'Avots', hgUV: 'pārvaldītāju daļas vērtības', hgNA: 'fondu neto aktīvi (pārvaldītāji)', hgLB: 'Lietuvas Banka',
  hgTh: { ret: 'Ienesīgums', aum: 'Neto aktīvi, €', sh: 'Daļa', mon: 'Mēnesis', gain: 'Ieguldījumu peļņa', up: 'Auga / visi', q: 'Ceturkšņa beigas', part: 'Dalībnieki' },
  hgI: { lead: 'Katrs pārvaldītājs – tā fondu ienesīguma vidējais fondu grupās.', aum: 'Visu II līmeņa fondu, kas atjaunoti pēdējo 10 dienu laikā, jaunākie neto aktīvi pa pārvaldītājiem.', earn: 'Ieguldījumu peļņa eiro: katra fonda dienas ienesīgums × tā aktīvi iepriekšējā dienā, summēts.', pos: 'Fondi, kuru ienesīgums izvēlētajā periodā ir lielāks par nulli.', gap: 'Starpība starp labāko un vājāko fondu katrā grupā, procentpunktos.', part: 'II līmeņa dalībnieki katra ceturkšņa beigās.', share: 'Katra pārvaldītāja daļa līmeņa aktīvos pirms gada un tagad; izmaiņa procentpunktos.' },
  hgCp: 'Kopēt atbildi kā tekstu', hgInfo: 'Kas parādīts un no kurienes dati', hgOpen: 'Izvērst: detaļas un iestatījumi', hgClose: 'Sakļaut',
}, {
  hgQ: { avg: 'Kuidas keskmisel fondil läheb?', lead: 'Kes on liider?', aum: 'Kui palju on kogutud?', earn: 'Kui palju fondid eurodes teenisid?', pos: 'Mitu fondi on tõusnud?', gap: 'Kus on erinevused suurimad?', part: 'Mitu osalejat?', share: 'Kes suurendas turuosa?' },
  hgS: { avg: (l, w) => `Liider ${l}, viimane ${w}.`, lead: n => `Fondivalitsejad keskmise tootluse järgi ${n} fondigrupis`, aum: (n, d) => `${n} fondi · ${d}`,
    earn: (y, d) => `Kõigi fondide investeerimistulu alates ${y}. a 1. jaanuarist (kuni ${d}). Iga ruut on üks päev.`, pos: (k, n) => `${k} fondil ${n}-st on selles perioodis positiivne tootlus`,
    gap: 'Parim ja nõrgim fond igas fondigrupis, %', part: (d, ch) => `${({ LV: 'manapensija.lv', EE: 'pensionikeskus.ee' })[typeof CTRY_COPY !== 'undefined' ? CTRY_COPY : ''] || 'Leedu Pank'}, ${d} · aastaga ${ch}`, share: (a, b) => `Osa samba varadest, ${a} → ${b}` },
  hgEy: { mk: 'Turg', ld: 'Liidrid', as: 'Varad', er: 'Tulu', br: 'Suund', gp: 'Erinevused', pt: 'Osalejad', sh: 'Turuosad' },
  hgHiS: (c, d) => `${c} · II sammas · andmed kuni ${d}`, hgMore: 'Rohkem', hgLess: 'vähem', hgMoreC: 'rohkem', hgSrc: 'Allikas', hgUV: 'fondivalitsejate osakuväärtused', hgNA: 'fondide puhasvara (fondivalitsejad)', hgLB: 'Leedu Pank',
  hgTh: { ret: 'Tootlus', aum: 'Puhasvara, €', sh: 'Osa', mon: 'Kuu', gain: 'Investeerimistulu', up: 'Tõusis / kõik', q: 'Kvartali lõpp', part: 'Osalejad' },
  hgI: { lead: 'Iga fondivalitseja – tema fondide tootluse keskmine fondigruppides.', aum: 'Kõigi viimase 10 päeva jooksul uuendatud II samba fondide viimane puhasvara fondivalitsejate kaupa.', earn: 'Investeerimistulu eurodes: iga fondi päevatootlus × tema varad eelmisel päeval, kokku liidetud.', pos: 'Fondid, mille tootlus valitud perioodil on üle nulli.', gap: 'Parima ja nõrgima fondi vahe igas grupis, protsendipunktides.', part: 'II samba osalejad iga kvartali lõpus.', share: 'Iga fondivalitseja osa samba varadest aasta tagasi ja nüüd; muutus protsendipunktides.' },
  hgCp: 'Kopeeri vastus tekstina', hgInfo: 'Mida näidatakse ja kust andmed pärinevad', hgOpen: 'Laienda: üksikasjad ja seaded', hgClose: 'Ahenda',
});

const HG_SRC = { LV: 'manapensija.lv', EE: 'pensionikeskus.ee' };   // dalyvių šaltinis šalies kopijoje (ne Lietuvos bankas – savininkas pastebėjo 2026-11-11)
if (typeof CTRY_COPY !== 'undefined') addStrings({   // LV/EE: grupės – rizikos (akcijų dalies) grupės; ketvirčio duomenys – ne Lietuvos banko
  hgS: { ...I18N.en.hgS, avg: (l, w) => `Leader ${l}, last ${w}. Simple average of all funds.`, lead: n => `Managers by average return across ${n} fund groups`,
    gap: 'Best and weakest fund in each fund group, %', part: (d, ch) => `${HG_SRC[CTRY_COPY] || ''}, ${d} · ${ch} over the year` },
  hgI: { ...I18N.en.hgI, lead: 'Each manager: average over the fund groups of its funds’ returns (within a group – asset-weighted).', pos: 'Funds with a return above zero in the chosen period.', gap: 'Difference between the best and the weakest fund in each fund group, percentage points.', part: 'Pillar II participants at the end of each quarter.' } }, {
  hgS: { ...I18N.lt.hgS, avg: (l, w) => `Pirmauja ${l}, paskutinis – ${w}. Paprastas visų fondų vidurkis.`, lead: n => `Valdytojai pagal vidutinę grąžą ${n} fondų grupėse`,
    gap: 'Geriausias ir silpniausias fondas kiekvienoje fondų grupėje, %', part: (d, ch) => `${HG_SRC[CTRY_COPY] || ''}, ${d} · per metus ${ch}` },
  hgI: { ...I18N.lt.hgI, lead: 'Kiekvienas valdytojas – jo fondų grąžos vidurkis per fondų grupes (grupėje – svertinis turtu).', pos: 'Fondai, kurių grąža pasirinktu laikotarpiu didesnė už nulį.', gap: 'Skirtumas tarp geriausio ir silpniausio fondo kiekvienoje fondų grupėje, procentiniais punktais.', part: 'II pakopos dalyviai kiekvieno ketvirčio pabaigoje.' } });

/* savininkas patvirtino 2026-11-11 („Taip, tęsk. Viskas patinka.“) – kortelių tinklelis numatytasis; ?nauja=0 – senoji Pradžia (laikinai, palyginimui) */
const HG_ON = (() => { let v = null; try { const q = new URLSearchParams(location.search).get('nauja'); if (q != null) localStorage.setItem('homeV3', q === '0' ? '0' : '1'); v = localStorage.getItem('homeV3'); } catch (e) {} return v !== '0'; })();
const hgIc = n => `<span class="hgic" style="--ic:url(img/ic/${n}.svg)" aria-hidden="true"></span>`;
/* Kortelės įrankiai (savininko taisyklė: kiekviena kortelė – Kopijuoti / PNG / Excel / (i)) ir išskleidimas:
   Kopijuoti – atsakymo sakinys tekstu; PNG – mažos diagramos vaizdas (kur ji SVG); Excel – paslėpta kortelės lentelė per tableBook
   (jei tai lentelei XLB turi įrodymų builderį – jo lapai su formulėmis iš vieneto verčių); (i) – apibrėžimas, šaltinis, data;
   ⤢ – kortelė per visą plotį su detalia lentele ir laikotarpio jungikliu (savininkas 2026-11-11: „išskleidžiama kortelė ir pakoreguojami parametrai“). */
let HG_OPEN = '';
const hgTbl = (id, tb) => tb ? `<div class="hgdet"><div class="scroll"><table class="at" id="${id}">${tb.head ? `<thead><tr>${tb.head.map((h, i) => `<th${i ? ' class="n"' : ''}>${hEsc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${tb.rows.map(r => `<tr>${r.map((x, i) => `<td${i ? ' class="n"' : ''}>${x == null ? '–' : hEsc(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>` : '';
const hgCard = o => { const t = T(), id = 'hgT_' + o.k, op = HG_OPEN === o.k;
  return `<article class="hgc ${o.sz || 's'}${o.img ? ' ph' : ''}${op ? ' open' : ''}" data-k="${o.k}"${o.img ? ` style="--ph:url(img/${o.img})"` : ''} data-src="${o.src || 'nav'}">
  <header class="hgh">${hgIc(o.ic)}<span class="ey">${o.ey}</span>${o.per ? `<span class="per">${o.per}</span>` : ''}
    <span class="hgt"><button type="button" class="btn ico" data-h="cp" title="${t.hgCp}" aria-label="${t.hgCp}">⧉</button>${o.png ? `<button type="button" class="btn ico" data-h="png" title="${t.pngImg}" aria-label="${t.pngImg}">⤓</button>` : ''}${o.tbl ? `<button type="button" class="btn ico xl" data-h="xl" title="${t.tXl}">Excel</button>` : ''}<button type="button" class="btn ico" data-h="i" title="${t.hgInfo}" aria-label="${t.hgInfo}" aria-expanded="false">i</button>${o.tbl ? `<button type="button" class="btn ico" data-h="op" title="${op ? t.hgClose : t.hgOpen}" aria-label="${op ? t.hgClose : t.hgOpen}" aria-expanded="${op}">${op ? '×' : '⤢'}</button>` : ''}</span></header>
  <h3 class="hgq">${o.q}</h3>${o.big != null ? `<div class="hgb${o.cls ? ' ' + o.cls : ''}">${o.big}</div>` : ''}${o.sub ? `<p class="hgs">${o.sub}</p>` : ''}
  <p class="hginfo" hidden>${o.info || ''}</p>
  <div class="hgv">${o.vis || ''}</div>${op ? `<div class="hgpar"><span>${t.period.replace(/:$/, '')}:</span><div class="seg">${Object.keys(t.per).map(k => `<button type="button" data-hper="${k}" aria-pressed="${k === PER}">${t.per[k]}</button>`).join('')}</div></div>` : ''}${hgTbl(id, o.tbl)}<a class="hgm" href="${o.href}">${t.hgMore} ${hgIc('arrow-right')}</a></article>`; };
document.addEventListener('click', async e => {
  const b = e.target.closest('.hgc [data-h], .hgc [data-hper]'); if (!b) return;
  const card = b.closest('.hgc'), k = card.dataset.k, t = T();
  if (b.dataset.hper) { PER = b.dataset.hper; try { localStorage.setItem('homePer', PER); } catch (x) {} render(); return; }
  const a = b.dataset.h;
  if (a === 'i') { const p = card.querySelector('.hginfo'); p.hidden = !p.hidden; b.setAttribute('aria-expanded', !p.hidden); return; }
  if (a === 'op') { HG_OPEN = HG_OPEN === k ? '' : k; hgRender(); const c2 = document.querySelector(`.hgc[data-k="${k}"]`); if (c2 && HG_OPEN) c2.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
  if (a === 'xl') { const tb = card.querySelector('table'); if (!tb) return; b.disabled = true; try { await tableBook(tb); } finally { b.disabled = false; } return; }
  if (a === 'cp') { const txt = [card.querySelector('.hgq'), card.querySelector('.hgb'), card.querySelector('.hgs')].filter(Boolean).map(n => n.textContent.trim()).join(' – ');
    try { await navigator.clipboard.writeText(txt); b.textContent = '✓'; setTimeout(() => { b.textContent = '⧉'; }, 1500); } catch (x) { prompt(t.hgCp, txt); } return; }
  if (a === 'png') { const box = card.querySelector('.hgv'); try { const blob = await chartPng(box); savePng(blob, box); } catch (x) {} }
});
/* ---------- mažos diagramos ---------- */
function hgLine(pts, W = 320, H = 70) {          // tiesios atkarpos (savininkas nemėgsta suapvalintų kreivių), plotas po linija
  if (!pts || pts.length < 3) return '';
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = xs[0], x1 = xs[xs.length - 1], lo = Math.min(0, ...ys), hi = Math.max(...ys);
  const X = x => ((x - x0) / ((x1 - x0) || 1) * W).toFixed(1), Y = y => (H - 4 - (y - lo) / ((hi - lo) || 1) * (H - 10)).toFixed(1);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${X(x)} ${Y(y)}`).join('');
  return `<svg class="hgl" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" class="z"/><path d="${d}L${W} ${H}L0 ${H}Z" class="a"/><path d="${d}" class="l"/></svg>`;
}
function hgDonut(parts, label) {                   // dalis iš visumos: [pavadinimas, spalva, reikšmė]
  const tot = parts.reduce((s, p) => s + p[2], 0) || 1, R = 42, C = 2 * Math.PI * R; let off = 0;
  const arcs = parts.map(([, col, v]) => { const len = v / tot * C, s = `<circle r="${R}" cx="50" cy="50" fill="none" stroke="${col}" stroke-width="13" stroke-dasharray="${Math.max(0, len - 1.2).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}"/>`; off += len; return s; }).join('');
  return `<div class="hgdn"><svg viewBox="0 0 100 100" aria-hidden="true"><g transform="rotate(-90 50 50)">${arcs}</g><text x="50" y="55" text-anchor="middle">${label}</text></svg>
    <ul>${parts.map(([n, col, v]) => `<li><i style="background:${col}"></i>${hEsc(n)}<b>${num(v / tot * 100, 1)} %</b></li>`).join('')}</ul></div>`;
}
function hgBars(rows) {                             // [pavadinimas, spalva, reikšmė, tekstas] – nuo nulio
  const m = Math.max(...rows.map(r => Math.abs(r[2])), 0.01);
  return `<div class="hgbars">${rows.map(([n, col, v, tx], i) => `<div class="r${i ? '' : ' top'}"><span class="n">${hEsc(n)}</span><span class="t"><i style="width:${Math.abs(v) / m * 100}%;background:${col}"></i></span><b>${tx}</b></div>`).join('')}</div>`;
}
function hgDots(rows) {                             // intervalas grupėje: [grupė, min, max, minSpalva, maxSpalva]
  const lo = Math.min(0, ...rows.map(r => r[1])), hi = Math.max(...rows.map(r => r[2])), X = v => ((v - lo) / ((hi - lo) || 1) * 100).toFixed(1);
  return `<div class="hgdots">${rows.map(([g, a, b, ca, cb]) => `<div class="r"><span class="n">${hEsc(g)}</span><span class="t"><i class="rg" style="left:${X(a)}%;width:${X(b) - X(a)}%"></i><i class="d" style="left:${X(a)}%;background:${ca}"></i><i class="d" style="left:${X(b)}%;background:${cb}"></i></span><b>${num(b - a, 1)}</b></div>`).join('')}</div>`;
}
function hgSlope(rows, a, b) {                      // nuolydis: [pavadinimas, spalva, prieš, dabar]
  const W = 300, H = 180, vs = rows.flatMap(r => [r[2], r[3]]), lo = Math.min(...vs), hi = Math.max(...vs), Y = v => (10 + (hi - v) / ((hi - lo) || 1) * (H - 34)).toFixed(1);
  const L = 70, R = W - 70, sp = (vals) => { const o = vals.map((v, i) => [i, +Y(v)]).sort((a, b) => a[1] - b[1]); for (let i = 1; i < o.length; i++) if (o[i][1] - o[i - 1][1] < 12) o[i][1] = o[i - 1][1] + 12; const r = []; o.forEach(([i, y]) => { r[i] = y; }); return r; };
  const yl = sp(rows.map(r => r[2])), yr = sp(rows.map(r => r[3]));
  return `<svg class="hgsl" viewBox="0 0 ${W} ${H}" aria-hidden="true"><text x="${L}" y="${H}" class="ax" text-anchor="middle">${a}</text><text x="${R}" y="${H}" class="ax" text-anchor="middle">${b}</text>`
    + rows.map(([n, col, p, q], i) => `<line x1="${L}" y1="${Y(p)}" x2="${R}" y2="${Y(q)}" stroke="${col}" stroke-width="2.2"/><circle cx="${L}" cy="${Y(p)}" r="3.2" fill="${col}"/><circle cx="${R}" cy="${Y(q)}" r="3.2" fill="${col}"/>`
      + `<text x="${L - 7}" y="${yl[i] + 3.5}" text-anchor="end">${num(p, 1)}</text><text x="${R + 7}" y="${yr[i] + 3.5}">${hEsc(n)} ${num(q, 1)}</text>`).join('') + '</svg>';
}
function hgCal(daily, y) {                          // kalendoriaus šilumos žemėlapis: savaitės stulpeliai, dienos eilutės
  const d0 = dayOf(`${y}-01-01`), xs = daily.filter(z => z.d >= d0), m = Math.max(...xs.map(z => Math.abs(z.g)), 0.01);
  const wd = d => (new Date(d * DAY).getUTCDay() + 6) % 7, w0 = d0 - wd(d0), cs = 11, gp = 2;
  const last = xs.length ? xs[xs.length - 1].d : d0, nW = Math.floor((last - w0) / 7) + 1, W = nW * (cs + gp), H = 5 * (cs + gp) + 12;
  const mon = T().monShort || ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  let s = '';
  for (let mo = 0; mo < 12; mo++) { const md = dayOf(`${y}-${String(mo + 1).padStart(2, '0')}-01`); if (md > last) break; s += `<text x="${Math.floor((md - w0) / 7) * (cs + gp)}" y="9" class="ax">${mon[mo]}</text>`; }
  xs.forEach(z => { const k = wd(z.d); if (k > 4) return; const a = Math.min(1, Math.abs(z.g) / m), col = z.g >= 0 ? 'var(--dpos)' : 'var(--dneg)';
    s += `<rect x="${Math.floor((z.d - w0) / 7) * (cs + gp)}" y="${12 + k * (cs + gp)}" width="${cs}" height="${cs}" rx="2" style="fill:color-mix(in srgb, ${col} ${Math.round(18 + a * 82)}%, var(--card))"><title>${iso(z.d)}: ${mSMn(z.g)}</title></rect>`; });
  return `<svg class="hgcal" viewBox="0 0 ${W} ${H}" aria-hidden="true">${s}</svg>`;
}

/* ---------- kortelės ---------- */
/* Excel įrodymų failai: grąžos kortelės – grupių lentelės failas (gtBook: vieneto vertės → grąžos formulės „Rezultatas“ lape) + lapas „Kortelė“,
   kurio skaičiai – formulės į „Rezultatas“ (Lietuvoje kiekvienoje grupėje vienas valdytojo fondas, todėl stulpelis = valdytojas).
   Šalies kopijoje grupėje keli valdytojo fondai – kortelės lapo nėra, lieka grupių lentelės failas. */
const hgQ = s => `'${s}'`;
function hgPre(kind) {
  return (provs, gs, c) => {
    if (CTRY) return [];
    const L = lang === 'lt', t = T(), R = hgQ(L ? 'Rezultatas' : 'Result'), n = gs.length, r1 = 4, r2 = 3 + n, col = j => xlCol(1 + j), rg = j => `${R}!${col(j)}${r1}:${col(j)}${r2}`;
    const all = `${R}!${col(0)}${r1}:${col(provs.length - 1)}${r2}`, nm = L ? 'Kortelė' : 'Card', rows = [[t.kEu ? (kind === 'avg' ? t.kEu(t.per[PER]) : t.hgQ[kind]) : ''], [L ? 'Skaičiai – formulės į lapą „Rezultatas“ (fondų grąža iš vieneto verčių); mėlyni – pradiniai duomenys.' : 'Figures are formulas into the “Result” sheet (fund returns from unit values); blue – source data.'], []];
    if (kind === 'lead') { rows.push([L ? 'Valdytojas' : 'Manager', L ? 'Vidutinė grąža (gyvenimo ciklo grupių vidurkis)' : 'Average return (mean over life-cycle groups)']);
      provs.forEach((p, j) => { const m = c.mgr.find(x => x.id === p); rows.push([labelOf(p), xlF(`AVERAGE(${rg(j)})`, m ? m.ytd / 100 : null, '0.00%')]); }); }
    if (kind === 'pos') { const v = gs.flatMap(g => provs.map(p => g.out[p])).filter(x => x != null);
      rows.push([L ? 'Fondų su teigiama grąža' : 'Funds with a positive return', xlF(`COUNTIF(${all},">0")`, v.filter(x => x > 0).length, '0')], [L ? 'Iš viso fondų' : 'Funds in total', xlF(`COUNT(${all})`, v.length, '0')]); }
    if (kind === 'gap') { const gc = xlCol(1 + provs.length + 4), gr = `${R}!${gc}${r1}:${gc}${r2}`, mx = Math.max(...gs.map(g => g.gap ?? -1));
      rows.push([L ? 'Didžiausias skirtumas grupėje, p. p.' : 'Largest gap in a group, pp', xlF(`MAX(${gr})`, mx, '0.00')], [L ? 'Grupė' : 'Group', { t: 's', f: `INDEX(${R}!A${r1}:A${r2},MATCH(MAX(${gr}),${gr},0))`, v: groupLabel((gs.find(g => g.gap === mx) || gs[0]).g) }]); }
    if (kind === 'avg') {          // svoriai – paskutiniai fondų grynieji aktyvai (mėlyni), išdėstyti kaip „Rezultatas“ (tie patys langeliai)
      const W = [['', ''], ['', ''], [L ? 'Grynieji aktyvai, €' : 'Net assets, €', ...provs.map(labelOf)], ...gs.map(g => [groupLabel(g.g), ...provs.map(p => { const x = g.mo[p]; return x && x[1] > 0 && g.out[p] != null ? x[1] : null; })])];
      const wr = j => `${hgQ(L ? 'Svoriai' : 'Weights')}!${col(j)}${r1}:${col(j)}${r2}`, wall = `${hgQ(L ? 'Svoriai' : 'Weights')}!${col(0)}${r1}:${col(provs.length - 1)}${r2}`;
      const E = euroCmp(t, c), base = rows.length + 1;
      rows.push([L ? 'Visų fondų grąža, svertinė turtu' : 'All funds, asset-weighted', xlF(`SUMPRODUCT(${all},${wall})/SUM(${wall})`, E.pe / 100, '0.00%')]);
      provs.forEach((p, j) => { const m = c.byW.find(x => x.id === p); rows.push([labelOf(p), xlF(`SUMPRODUCT(${rg(j)},${wr(j)})/SUM(${wr(j)})`, m ? m.wk / 100 : null, '0.00%')]); });
      rows.push([]);
      if (E.inf) { const a0 = iso(c.anchor).slice(0, 7), r0 = rows.length + 1;
        rows.push([`${L ? 'VKI' : 'CPI'} ${a0}`, CPI[a0]], [`${L ? 'VKI' : 'CPI'} ${E.inf.m}`, CPI[E.inf.m]], [L ? 'Infliacija' : 'Inflation', xlF(`B${r0 + 1}/B${r0}-1`, E.inf.v / 100, '0.00%')],
          [L ? 'Grąža po infliacijos' : 'Return after inflation', xlF(`(1+B${base})/(1+B${r0 + 2})-1`, ((1 + E.pe / 100) / (1 + E.inf.v / 100) - 1), '0.00%')], []); }
      if (E.es != null && DATA.rfm) {   // €STR: kiekvieną dieną (metinė norma ÷ 360), norma – mėnesio vidurkis (ECB)
        const R0 = DATA.rfm, y0 = +R0.start.slice(0, 4), m0 = +R0.start.slice(5, 7) - 1, sr = rows.length + 2;
        rows.push([L ? 'Laikotarpio pradžia / pabaiga' : 'Period start / end', xlDate(c.anchor), xlDate(c.end)], [L ? 'Mėnuo' : 'Month', L ? '€STR mėnesio vidurkis, %' : '€STR monthly average, %', L ? 'Dienų laikotarpyje' : 'Days in period', L ? 'Augimo koeficientas' : 'Growth factor']);
        const ms = []; for (let d = c.anchor + 1; d <= c.end; d++) { const x = new Date(d * DAY), k = x.getUTCFullYear() * 12 + x.getUTCMonth(); if (!ms.includes(k)) ms.push(k); }
        const f0 = rows.length + 1;
        ms.forEach(k => { const y = Math.floor(k / 12), m = k % 12, i = (y - y0) * 12 + m - m0, rr = rows.length + 1, md = Math.round(Date.UTC(y, m, 1) / DAY);
          const rv = R0.v[Math.min(i, R0.v.length - 1)], me = Math.round(Date.UTC(y, m + 1, 0) / DAY), dn = Math.max(0, Math.min(c.end, me) - Math.max(c.anchor, md - 1));
          rows.push([xlDate(md), rv, xlF(`MAX(0,MIN($C$${sr - 1},EOMONTH(A${rr},0))-MAX($B$${sr - 1},A${rr}-1))`, dn, '0'), xlF(`(1+B${rr}/36000)^C${rr}`, Math.pow(1 + rv / 36000, dn), '0.000000')]); });
        rows.push([L ? '€STR indėlio grąža' : '€STR deposit return', null, null, xlF(`PRODUCT(D${f0}:D${rows.length})-1`, E.es / 100, '0.00%')]); }
      return [{ name: L ? 'Svoriai' : 'Weights', rows: W, w: [{ wch: 30 }, ...provs.map(() => ({ wch: 14 }))] }, { name: nm, rows, w: [{ wch: 44 }, { wch: 18 }, { wch: 16 }, { wch: 16 }] }].reverse();
    }
    return [{ name: nm, rows, w: [{ wch: 44 }, { wch: 18 }] }];
  };
}
['avg', 'lead', 'pos', 'gap'].forEach(k => XLB.set('hgT_' + k, async () => gtBook(hgPre(k))));

function hgRender() {
  if (!HG_ON) return;
  const t = T(), c = compute(), P = t.per[PER], g = document.getElementById('hg'); if (!g) return;
  const L = c.byY[0], Wn = c.byY[c.byY.length - 1], LT = lang === 'lt', pp = LT ? 'p. p.' : 'pp', out = [], src = (a, b) => `${t.hgSrc}: ${a}${b ? ` · ${b}` : ''}`;
  const pr = `${iso(c.anchor)} → ${iso(c.end)}`, retSrc = src(t.hgUV, pr);
  // 1. kiek uždirbo vidutinis dalyvio euras – nuotrauka + palyginimas su infliacija ir €STR
  { const E = euroCmp(t, c, ['#ffffff', '#f3a487', 'rgba(255,255,255,.55)']), real = E.inf && E.pe != null ? pct(((1 + E.pe / 100) / (1 + E.inf.v / 100) - 1) * 100) : null;
    out.push(hgCard({ k: 'avg', sz: 'l', img: 'sec2-results.jpg', ic: 'arrow-trending', ey: t.hgEy.mk, per: P, q: t.kEu(P).replace(/ · .*$/, ''),
      big: E.pe == null ? '–' : pct(E.pe), sub: [real && t.kEuReal(real), t.kEuS.replace(/\.\s.*$/, '.')].filter(Boolean).join(' · '), info: `${t.kEuS} ${retSrc}.`,
      vis: E.html + `<p class="hgs">${[E.inf ? t.kEuIN(E.inf.m) : t.kEuNo, E.es != null ? '€STR – ECB' : ''].filter(Boolean).join(' · ')}</p>`, href: 'performance.html',
      tbl: { head: [t.ldMgr, t.hgTh.ret], rows: [[t.kEuF, pct(E.pe)], ...(E.inf ? [[t.kEuI, pct(E.inf.v)]] : []), ...(E.es != null ? [[t.kEuR, pct(E.es)]] : []), ...c.byW.map(m => [mLab(m.id), pct(m.wk)])] } })); }
  // 2. lyderis – juostos
  out.push(hgCard({ k: 'lead', sz: 't', ic: 'trophy', ey: t.hgEy.ld, per: P, q: t.hgQ.lead, big: mLab(L.id), sub: `${pct(L.ytd)} · ${t.hgS.lead(LC.length)}`, info: `${t.hgI.lead} ${retSrc}.`,
    vis: hgBars(c.byY.map(m => [mLab(m.id), mCol(m.id), m.ytd, pct(m.ytd)])), href: 'performance.html#tab=sum', tbl: { head: [t.ldMgr, t.hgTh.ret], rows: c.byY.map(m => [mLab(m.id), pct(m.ytd)]) } }));
  // 3. turtas – žiedas
  const by = {}; DATA.groups.flatMap(x => x.funds).filter(f => f.assets && f.assetsDate >= c.end - 10).forEach(f => { const k = CTRY ? MOF[f.provider] : f.provider; by[k] = (by[k] || 0) + f.assets; });
  const byS = Object.entries(by).sort((a, b) => b[1] - a[1]);
  out.push(hgCard({ k: 'aum', sz: 't', ic: 'savings', ey: t.hgEy.as, q: t.hgQ.aum, big: money(c.aum), sub: t.hgS.aum(c.nAum, iso(c.aumD)), info: `${t.hgI.aum} ${src(t.hgNA, iso(c.aumD))}.`, png: 1,
    vis: hgDonut(byS.map(([p, v]) => [mLab(p), mCol(p), v]), money(c.aum).replace(/ .*/, '')), href: 'aum.html', src: 'aum',
    tbl: { head: [t.ldMgr, t.hgTh.aum, t.hgTh.sh], rows: byS.map(([p, v]) => [mLab(p), mInt(v), `${num(v / c.aum * 100, 1)} %`]) } }));
  // 4. uždarbis eurais – kalendorius
  if (typeof euDaily === 'function' && typeof EARN !== 'undefined' && EARN) {
    const daily = euDaily('II', ''); if (daily.length) { const Ld = daily[daily.length - 1], y = iso(Ld.d).slice(0, 4), yS = euSum(daily, dayOf(y + '-01-01'), Ld.d);
      out.push(hgCard({ k: 'earn', sz: 'w', ic: 'money-hand', ey: t.hgEy.er, per: y, q: t.hgQ.earn, big: mSMn(yS.g), cls: yS.g >= 0 ? 'up' : 'down', sub: t.hgS.earn(y, iso(Ld.d)), info: t.hgI.earn, png: 1,
        vis: hgCal(daily, y) + `<div class="hglg"><span>${t.hgLess}</span><i style="--a:20%"></i><i style="--a:55%"></i><i style="--a:100%"></i><span>${t.hgMoreC}</span><i class="n"></i><span>−</span></div>`, href: 'facts.html#tab=eu',
        tbl: { head: [t.hgTh.mon, t.hgTh.gain], rows: daily.filter(z => iso(z.d).slice(0, 4) === y).reduce((o, z) => { const m = iso(z.d).slice(0, 7), r = o.find(x => x[0] === m); if (r) r[2] += z.g; else o.push([m, null, z.g]); return o; }, []).map(([m, , v]) => [m, mSMn(v)]) } })); } }
  // 5. kiek fondų kyla – progreso juosta ir grupės (gyvenimo ciklo fondai – tie patys kaip Excel lape)
  const all = c.groups.flatMap(x => x.xs.map(z => z[1])), k = all.filter(v => v > 0).length;
  out.push(hgCard({ k: 'pos', sz: 's', ic: 'target-arrow', ey: t.hgEy.br, per: P, q: t.hgQ.pos, big: `${k} / ${all.length}`, sub: t.hgS.pos(k, all.length), info: `${t.hgI.pos} ${retSrc}.`,
    vis: `<div class="hgpr"><i style="width:${all.length ? k / all.length * 100 : 0}%"></i></div>`, href: 'performance.html',
    tbl: { head: [t.thG, t.hgTh.up], rows: [...c.groups].reverse().map(x => [groupLabel(x.g), `${x.xs.filter(z => z[1] > 0).length} / ${x.xs.length}`]) } }));
  // 6. skirtumai grupėse – taškai
  const G = c.groups.filter(x => x.gap != null), Gm = [...G].sort((a, b) => b.gap - a.gap)[0];
  if (Gm) out.push(hgCard({ k: 'gap', sz: 't', ic: 'scales', ey: t.hgEy.gp, per: P, q: t.hgQ.gap, big: `${num(Gm.gap, 2)} ${pp}`, sub: `${groupLabel(Gm.g)}: ${labelOf(Gm.xs[0][0])} – ${labelOf(Gm.xs[Gm.xs.length - 1][0])}`, info: `${t.hgI.gap} ${retSrc}.`,
    vis: hgDots([...G].reverse().map(x => [groupLabel(x.g).replace(/\s*\(.*$/, ''), x.xs[x.xs.length - 1][1], x.xs[0][1], colorOf(x.xs[x.xs.length - 1][0]), colorOf(x.xs[0][0])])) + `<p class="hgs">${t.hgS.gap}</p>`, href: 'performance.html#tab=market',
    tbl: { head: [t.thG, t.thLead, t.hgTh.ret, t.thLast, t.hgTh.ret, t.thGap], rows: [...G].reverse().map(x => [groupLabel(x.g), labelOf(x.xs[0][0]), pct(x.xs[0][1]), labelOf(x.xs[x.xs.length - 1][0]), pct(x.xs[x.xs.length - 1][1]), num(x.gap, 2)]) } }));
  // 7. dalyviai ir 8. rinkos dalys – ketvirčio duomenys (MKT)
  if (typeof MKT !== 'undefined' && MKT.II && typeof byMgr === 'function') {
    const ds = MKT.II.dates, di = ds.length - 1, d = ds[di], pdi = ds.indexOf(qBack(d, 12)), tn = totals('II', di), tp = totals('II', pdi), qs = CTRY ? (HG_SRC[CTRY_COPY] || '') : t.hgLB;
    const series = ds.map((x, i) => [dayOf(x), totals('II', i).part]).filter(p => p[1] > 0).slice(-12);
    out.push(hgCard({ k: 'part', sz: 's', ic: 'people', ey: t.hgEy.pt, per: d, q: t.hgQ.part, big: mInt(tn.part), sub: t.hgS.part(d, tp.ok ? mSInt(tn.part - tp.part) : '–', !CTRY && d >= '2026-06-30'), info: `${t.hgI.part} ${src(qs, d)}.`, png: 1,
      vis: hgLine(series, 240, 40), href: 'facts.html#tab=mk', src: 'lbh', tbl: { head: [t.hgTh.q, t.hgTh.part], rows: series.map(([x, v]) => [iso(x), mInt(v)]).reverse() } }));
    if (pdi >= 0) { const a = byMgr('II', pdi), b = byMgr('II', di);
      const rows = Object.keys(b).filter(m => a[m]).map(m => [m, mkColor(m), a[m].nav / tp.nav * 100, b[m].nav / tn.nav * 100]).sort((x, y) => y[3] - x[3]);
      const top = [...rows].sort((x, y) => (y[3] - y[2]) - (x[3] - x[2]))[0];
      out.push(hgCard({ k: 'share', sz: 'w', ic: 'data-pie', ey: t.hgEy.sh, per: `${ds[pdi]} → ${d}`, q: t.hgQ.share, big: top ? `${top[0]} ${top[3] - top[2] >= 0 ? '+' : '−'}${num(Math.abs(top[3] - top[2]), 2)} ${pp}` : '–', sub: t.hgS.share(ds[pdi], d), info: `${t.hgI.share} ${src(qs, `${ds[pdi]}, ${d}`)}.`, png: 1,
        vis: hgSlope(rows, ds[pdi].slice(0, 7), d.slice(0, 7)), href: 'managers.html#tab=mg', src: 'lbh',
        tbl: { head: [t.ldMgr, ds[pdi], d, pp], rows: rows.map(([m, , x, y]) => [m, `${num(x, 2)} %`, `${num(y, 2)} %`, `${y - x >= 0 ? '+' : '−'}${num(Math.abs(y - x), 2)}`]) } })); }
  }
  const keep = [...g.querySelectorAll(':scope > .hgx')];   // esamos kortelės (Lyderiai, naujienos…) – perpiešiant nepamesti
  g.innerHTML = out.join('');
  { const tx = document.querySelector('.sechero.has-kpi .shtx');   // nuotraukos juosta – tik šalis, pakopa ir duomenų data; skaičiai – kortelėse (be pasisveikinimo – savininkas)
    if (tx) { let hi = tx.querySelector('.hgreet'); if (!hi) { hi = document.createElement('div'); hi.className = 'hgreet'; tx.prepend(hi); }
      hi.innerHTML = `<span>${t.hgHiS(t.hC[PCTRY] || t.hC.LT, iso(c.end))}</span>`; } }
  if (keep.length) { keep.forEach(el => g.appendChild(el)); return; }
  // pirmą kartą: esamos kortelės (nieko nenumetame) – į tą patį tinklelį
  [['ldrC', 'w'], ['tdNews', 'w'], [document.querySelector('.says'), 'w'], [document.querySelector('.tdmk'), 'w'], [document.getElementById('gT') && document.getElementById('gT').closest('section'), 'f']]
    .forEach(([el, sz]) => { el = typeof el === 'string' ? document.getElementById(el) : el; if (!el) return; el.classList.add('hgx', sz); g.appendChild(el); });
}
if (HG_ON) {
  document.documentElement.classList.add('hv3');
  const td = document.querySelector('[data-tab="td"]'), big = document.getElementById('big');
  const g = document.createElement('div'); g.className = 'hg'; g.id = 'hg';
  const my = document.getElementById('myC'); td.insertBefore(g, my);
  const _render = render; render = function () { _render(); hgRender(); };   // eslint-disable-line no-func-assign
  render();
}
