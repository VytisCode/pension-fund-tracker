/* ---------- Naujienos apie pensijas (savininkas 2026-10-21: „skiltis su nuorodomis į naujienų straipsnius apie pensijų sistemą
   LT, LV, EE … archyvuoti, kad būtų galima analizuoti temos aktualumą žiniasklaidoje ir valdžioje“; vėliau: „laiko juosta …
   kiek laiko buvo aktualus įvykis, kada pradėta ir baigta kalbėti; kurios partijos, organizacijos ar Sodra kokią poziciją turi
   ir kaip ji keitėsi; ką svarsto Seimas; kortelės su įžvalgomis, kad situaciją suprastum vos pažvelgęs“) ----------
   Duomenys – docs/data_news.js: NEWS = [[data, šalis, leidinys, antraštė, aprašas, nuoroda, temos „a;b“, veikėjai „a;b“], …]
   (naujausi pirmi; tools/fetch_news.py, veikėjai – news_tags.py), NEWS_ACT = [[id, grupė, šalis, LT, EN]],
   SEIMAS = [[data, klausimas, stadija, projektas, kategorija, nuoroda, pranešėjai]] (tools/fetch_seimas.py).
   Viskas be AI: temos ir veikėjai – raktažodžiai; „banga“ – savaitės su straipsniais, kai tarpas tarp jų ≤ 3 savaitės. */
addStrings({ nw: {
  title: 'Pension news', lead: 'News articles about the pension systems of Lithuania, Latvia and Estonia, collected automatically every day and kept in an archive: insights, a timeline of topics, who speaks about them, what the Seimas is considering, and all articles. Click a headline to open the full article.',
  all: 'All', search: 'Search headlines…', more: n => `Show ${n} more`, none: 'No articles for this choice.', count: (n, a) => `${n} of ${a} articles`,
  chart: 'Articles per month', chartQ: 'Articles per quarter', xl: 'Excel (for analysis)', latest: 'Latest pension news', toAll: 'All news →',
  t: { reform: 'Reform, exits', tax: 'Taxes, reliefs', state: 'State incentive', returns: 'Returns', fees: 'Fees', payout: 'Payouts, annuities', politics: 'Government, politics' },
  c: { LT: 'Lithuania', LV: 'Latvia', EE: 'Estonia' },
  per: { '': 'All time', 30: '30 days', 90: '3 months', 365: '12 months', c: 'Own dates' }, from: 'from', to: 'to',
  insT: 'Insights', insL: 'Generated automatically from the article archive (keywords, no AI). “Show” opens the articles behind the sentence.', show: 'Show',
  ins: {
    hot: (tp, n, r) => `Most written about now: “${tp}” – ${n} articles in 30 days${r ? `, ${r} times more than usual over the past year` : ''}.`,
    run: (tp, w, d, n) => `“${tp}” has been in the media for ${w} weeks in a row (since ${d}; ${n} articles).`,
    back: (tp, m, d, h) => `“${tp}” is back after a ${m}-month pause (first article ${d}: “${h}”).`,
    fade: (tp, w, d0, d1, n) => `“${tp}” has gone quiet for ${w} weeks (last wave ${d0} – ${d1}, ${n} articles).`,
    big: (tp, d0, d1, n, w, h) => `Biggest earlier media wave: “${tp}” ${d0} – ${d1}: ${n} articles over ${w} weeks (peak: “${h}”).`,
    act: l => `Most mentioned in 30 days: ${l}.`, newAct: (a, n) => `New voice in the debate: ${a} (${n} mentions in 30 days, none in the year before).`,
    seim: (n, d, h, s) => `Seimas agenda in 60 days: ${n} drafts on pensions and pension accumulation; latest ${d}: ${h}${s ? ` (${s.toLowerCase()})` : ''}.`,
    cty: (lt, ee, lv) => `In 30 days: ${lt} articles in Lithuania, ${ee} in Estonia, ${lv} in Latvia.`, none: 'Too few articles for insights in this choice.' },
  tlT: 'Timeline of topics', tlL: 'Each row is a topic; shading – articles per week, bars – “waves” (weeks with articles, gaps of up to 3 weeks). Click a wave to see when it started, peaked and ended and which articles it consisted of.',
  wave: (tp, d0, d1, w, n) => `“${tp}”: ${d0} – ${d1} · ${w} wk. · ${n} articles`, peak: (d, n) => `Peak: week of ${d} (${n})`, close: 'Close', hit: 'Click – articles of that period', hitNone: 'No articles near this point – click closer to a coloured mark.', week: (tp, d, n) => `“${tp}”: week of ${d} · ${n} articles`, seWeek: (d0, d1, n) => `Seimas agenda ${d0} – ${d1} · ${n} items`,
  acT: 'Who speaks', acL: 'Institutions, parties, organisations, commentators and managers mentioned in headlines or descriptions, by period. Click a row to see their statements over time and judge for yourself whether the position changed. Highlighted – words like “proposes”, “criticises”, “supports”, “against”. Positions are not assessed automatically.',
  grp: { '': 'All', inst: 'Institutions', party: 'Parties', org: 'Organisations', person: 'Commentators', mgr: 'Managers' },
  stT: 'Tone of statements', stL: 'Counted without AI: positive words (earned, grew, supports, recommends…) minus negative words (lost, criticises, against, risk…) in the headline and description of articles that mention the actor; the whole history of the country is used. This is the tone of articles, not a confirmed position – “Show” opens the articles to check. Each article in the list shows ▲/▼ and the words that decided it.',
  st: { pos: (a, k, n) => `${a}: in ${k} of ${n} articles with a tone it is positive – usually encourages and defends.`, neg: (a, k, n) => `${a}: in ${k} of ${n} articles with a tone it is negative – usually critical.`,
    vs: (a, x, b, y) => `${a} and ${b} speak in opposite tones: ${x} vs ${y} points out of 100 (100 – only positive).`,
    chg: (a, y0, p0, n0, y1, p1, n1) => `${a}: tone changed – in ${y0} mostly ${p0 ? 'positive' : 'negative'} (${n0} art.), in ${y1} mostly ${p1 ? 'positive' : 'negative'} (${n1} art.). Check whether the position changed.` },
  tone: { p: 'positive', n: 'negative' }, stSrc: 'Source: media article archive, tone counted from words (pension fund review).',
  acSel: a => `${a}: statements over time (newest first)`, acNone: 'Nobody mentioned in this choice.', mentions: 'mentions',
  seT: 'What the Seimas is considering', seL: 'Seimas agenda items on pensions, pension accumulation, annuities, the Sodra budget and personal income tax – with the stage (submission, consideration, adoption) and a link to the draft. Source: open data of the Office of the Seimas (CC BY 4.0), daily.',
  seC: { '': 'All', kaupimas: 'Pension accumulation', pensijos: 'Pensions', sodra: 'Sodra budget, insurance', gpm: 'Income tax' }, seNone: 'No items on the agenda for this choice.', seLane: c => `Seimas agenda${c && c !== 'All' ? ' – ' + c.toLowerCase() : ''} (items per week)`, listT: 'All articles',
  note: 'Sources: Google News search (the article’s own address and description are taken from the article page) and RSS feeds of LRT, 15min, Lrytas, the Ministry of Social Security and Labour, the Ministry of Finance, the Government, LIPFA, ERR, Postimees, Äripäev, Riigikogu, Tuleva, LSM, Dienas Bizness, Diena and TVNET. Articles are selected by keywords (pension funds, pillar II/III, sammas, līmenis…), so a few unrelated ones may slip in. Facebook posts cannot be collected automatically – only when the media quote them. The archive is only added to.',
  xh: ['Date', 'Country', 'Outlet', 'Headline', 'Description', 'Link', 'Topics', 'Actors (ids)'], shW: 'Waves', shA: 'Actors', shS: 'Seimas',
  xw: ['Topic', 'Start', 'End', 'Weeks', 'Articles', 'Peak week', 'Articles in peak week', 'Peak headline'], xs: ['Date', 'Agenda item', 'Stage', 'Draft', 'Category', 'Link', 'Speakers'] } }, { nw: {
  title: 'Naujienos apie pensijas', lead: 'Naujienų straipsniai apie Lietuvos, Latvijos ir Estijos pensijų sistemas – kasdien automatiškai renkami ir kaupiami archyve: įžvalgos, temų laiko juosta, kas apie jas kalba, ką svarsto Seimas ir visi straipsniai. Paspaudus antraštę atsidaro visas straipsnis.',
  all: 'Visos', search: 'Ieškoti antraštėse…', more: n => `Rodyti dar ${n}`, none: 'Šiam pasirinkimui straipsnių nėra.', count: (n, a) => `${n} iš ${a} straipsnių`,
  chart: 'Straipsniai per mėnesį', chartQ: 'Straipsniai per ketvirtį', xl: 'Excel (analizei)', latest: 'Naujausios naujienos apie pensijas', toAll: 'Visos naujienos →',
  t: { reform: 'Reforma, išėjimai', tax: 'Mokesčiai, lengvatos', state: 'Valstybės paskata', returns: 'Grąža', fees: 'Valdymo mokesčiai', payout: 'Išmokos, anuitetai', politics: 'Valdžia, politika' },
  c: { LT: 'Lietuva', LV: 'Latvija', EE: 'Estija' },
  per: { '': 'Visas laikas', 30: '30 d.', 90: '3 mėn.', 365: '12 mėn.', c: 'Savos datos' }, from: 'nuo', to: 'iki',
  insT: 'Įžvalgos', insL: 'Sudaromos automatiškai iš straipsnių archyvo (raktažodžiai, be AI). „Rodyti“ atidaro straipsnius, iš kurių padarytas sakinys.', show: 'Rodyti',
  ins: {
    hot: (tp, n, r) => `Dabar daugiausiai rašoma apie „${tp}“ – ${n} straipsn. per 30 dienų${r ? `, ${r} karto daugiau nei įprastai per pastaruosius metus` : ''}.`,
    run: (tp, w, d, n) => `Tema „${tp}“ žiniasklaidoje aktuali jau ${w} sav. iš eilės (nuo ${d}; ${n} straipsn.).`,
    back: (tp, m, d, h) => `Vėl iškilo tema „${tp}“ – po ${m} mėn. pertraukos (pirmas straipsnis ${d}: „${h}“).`,
    fade: (tp, w, d0, d1, n) => `Apie „${tp}“ nerašoma jau ${w} sav. (paskutinė banga ${d0} – ${d1}, ${n} straipsn.).`,
    big: (tp, d0, d1, n, w, h) => `Didžiausia ankstesnė žiniasklaidos banga – „${tp}“ ${d0} – ${d1}: ${n} straipsn. per ${w} sav. (pikas: „${h}“).`,
    act: l => `Per 30 d. dažniausiai minimi: ${l}.`, newAct: (a, n) => `Naujas balsas diskusijoje: ${a} (${n} paminėj. per 30 d., per ankstesnius metus – nė vieno).`,
    seim: (n, d, h, s) => `Per 60 d. Seimo darbotvarkėje – pensijų ir jų kaupimo projektų: ${n}; naujausias ${d}: ${h}${s ? ` (${s.toLowerCase()})` : ''}.`,
    cty: (lt, ee, lv) => `Per 30 d.: Lietuvoje ${lt} straipsn., Estijoje ${ee}, Latvijoje ${lv}.`, none: 'Šiam pasirinkimui straipsnių per mažai įžvalgoms.' },
  tlT: 'Temų laiko juosta', tlL: 'Kiekviena eilutė – tema; atspalvis – straipsniai per savaitę, juostos – „bangos“ (savaitės su straipsniais, kai tarpas ne ilgesnis nei 3 savaitės). Paspaudus bangą matyti, kada ji prasidėjo, kada buvo pikas, kada baigėsi ir iš kokių straipsnių susidėjo.',
  wave: (tp, d0, d1, w, n) => `„${tp}“: ${d0} – ${d1} · ${w} sav. · ${n} straipsn.`, peak: (d, n) => `Pikas: savaitė nuo ${d} (${n})`, close: 'Uždaryti', hit: 'Spauskite – to laikotarpio straipsniai', hitNone: 'Šalia šios vietos straipsnių nėra – spauskite arčiau spalvoto brūkšnelio.', week: (tp, d, n) => `„${tp}“: savaitė nuo ${d} · ${n} straipsn.`, seWeek: (d0, d1, n) => `Seimo darbotvarkė ${d0} – ${d1} · ${n} klausim.`,
  acT: 'Kas kalba', acL: 'Institucijos, partijos, organizacijos, komentatoriai ir valdytojai, paminėti antraštėje ar apraše, pagal laikotarpius. Paspaudus eilutę matyti jų pasisakymai laiko tvarka – galite patys įvertinti, ar pozicija keitėsi. Paryškinti žodžiai kaip „siūlo“, „kritikuoja“, „pritaria“, „prieš“. Pozicijos automatiškai nevertinamos.',
  grp: { '': 'Visi', inst: 'Institucijos', party: 'Partijos', org: 'Organizacijos', person: 'Komentatoriai', mgr: 'Valdytojai' },
  stT: 'Pasisakymų tonas', stL: 'Skaičiuojama be AI: teigiami žodžiai (uždirbo, augo, pritaria, rekomenduoja…) minus neigiami (prarado, kritikuoja, prieš, rizika…) straipsnių, kuriuose minimas veikėjas, antraštėje ir apraše; imama visa šalies istorija. Tai straipsnių tonas, o ne patvirtinta pozicija – „Rodyti“ atidaro straipsnius patikrinti. Kiekvienas sąrašo straipsnis pažymėtas ▲/▼ ir žodžiais, kurie lėmė toną.',
  st: { pos: (a, k, n) => `${a}: ${k} iš ${n} straipsnių su tonu – teigiami, dažniausiai skatina ir gina.`, neg: (a, k, n) => `${a}: ${k} iš ${n} straipsnių su tonu – neigiami, dažniausiai kritikuoja.`,
    vs: (a, x, b, y) => `${a} ir ${b} kalba priešingu tonu: ${x} prieš ${y} balų iš 100 (100 – tik teigiami).`,
    chg: (a, y0, p0, n0, y1, p1, n1) => `${a}: tonas pasikeitė – ${y0} m. vyravo ${p0 ? 'teigiamas' : 'neigiamas'} (${n0} str.), ${y1} m. – ${p1 ? 'teigiamas' : 'neigiamas'} (${n1} str.). Verta patikrinti, ar keitėsi pozicija.` },
  tone: { p: 'teigiamas', n: 'neigiamas' }, stSrc: 'Šaltinis: žiniasklaidos straipsnių archyvas, tonas skaičiuotas pagal žodžius (pensijų fondų apžvalga).',
  acSel: a => `${a}: pasisakymai laiko tvarka (naujausi viršuje)`, acNone: 'Šiam pasirinkimui veikėjų nepaminėta.', mentions: 'paminėj.',
  seT: 'Ką svarsto Seimas', seL: 'Seimo posėdžių darbotvarkės klausimai apie pensijas, pensijų kaupimą, anuitetus, Sodros biudžetą ir GPM – su stadija (pateikimas, svarstymas, priėmimas) ir nuoroda į projektą. Šaltinis – Seimo kanceliarijos atviri duomenys (CC BY 4.0), kasdien.',
  seC: { '': 'Visi', kaupimas: 'Pensijų kaupimas', pensijos: 'Pensijos', sodra: 'Sodros biudžetas, draudimas', gpm: 'GPM' }, seNone: 'Šiam pasirinkimui darbotvarkėje klausimų nėra.', seLane: c => `Seimo darbotvarkė${c && c !== 'Visi' ? ' – ' + c.toLowerCase() : ''} (klausimai per savaitę)`, listT: 'Visi straipsniai',
  note: 'Šaltiniai: Google News paieška (straipsnio adresas ir aprašas paimami iš paties straipsnio puslapio) ir LRT, 15min, Lrytas, Socialinės apsaugos ir darbo ministerijos, Finansų ministerijos, Vyriausybės, LIPFA, ERR, Postimees, Äripäev, Riigikogu, Tuleva, LSM, Dienas Bizness, Diena ir TVNET RSS srautai. Straipsniai atrenkami pagal raktažodžius (pensijų fondai, II/III pakopa, sammas, līmenis…), todėl gali pasitaikyti nesusijusių. Facebook įrašų automatiškai surinkti negalima – tik kai juos cituoja žiniasklaida. Archyvas tik papildomas.',
  xh: ['Data', 'Šalis', 'Leidinys', 'Antraštė', 'Aprašas', 'Nuoroda', 'Temos', 'Veikėjai (id)'], shW: 'Bangos', shA: 'Veikėjai', shS: 'Seimas',
  xw: ['Tema', 'Pradžia', 'Pabaiga', 'Savaitės', 'Straipsniai', 'Piko savaitė', 'Straipsniai piko savaitę', 'Piko antraštė'], xs: ['Data', 'Darbotvarkės klausimas', 'Stadija', 'Projektas', 'Kategorija', 'Nuoroda', 'Pranešėjai'] } });

const NWS = { c: 'LT', t: '', q: '', n: 30, p: '', from: '', to: '', a: '', g: '', w: null, sc: 'kaupimas', sn: 12 };
const NW_TOPICS = ['reform', 'tax', 'state', 'returns', 'fees', 'payout', 'politics'];
const NW_CUE = /\b(siūl\w*|ragin\w*|kritik\w*|nepritar\w*|pritar\w*|prieš|atmet\w*|palaik\w*|perspėj\w*|reikalauj\w*|žad\w*|pažad\w*|griežtai|ierosin\w*|aicin\w*|kritiz\w*|atbalst\w*|iebilst\w*|noraid\w*|brīdin\w*|ettepanek\w*|kriti\w*|toeta\w*|vastu|hoiat\w*|nõua\w*|propos\w*|urg\w*|critici\w*|support\w*|oppos\w*|against|warn\w*|reject\w*)/giu;
const nwTopic = k => T().nw.t[k] || k;
const nwHas = () => typeof NEWS !== 'undefined' && NEWS && NEWS.length;
const nwAct = () => typeof NEWS_ACT !== 'undefined' ? NEWS_ACT : [];
const nwActName = id => { const a = nwAct().find(x => x[0] === id); return a ? (lang === 'lt' ? a[3] : a[4]) : id; };
const nwWeek = d => Math.floor((d + 3) / 7);                    // savaitės nr. (pirmadienis); 1970-01-01 – ketvirtadienis
const nwWeekDay = w => w * 7 - 3;
const nwNow = () => nwHas() ? Math.max(dayOf(NEWS[0][0]), Math.round(Date.now() / DAY) - 1) : 0;
function nwRange() {                                           // [nuo, iki] dienomis pagal laikotarpio pasirinkimą
  const now = nwNow();
  if (NWS.p === 'c') return [NWS.from ? dayOf(NWS.from) : -1e9, NWS.to ? dayOf(NWS.to) : 1e9];
  return NWS.p ? [now - +NWS.p + 1, 1e9] : [-1e9, 1e9];
}
function nwRows(skip = {}) {
  if (!nwHas()) return [];
  const q = NWS.q.trim().toLowerCase(), [d0, d1] = nwRange();
  return NEWS.filter(r => { const d = dayOf(r[0]); return (!NWS.c || r[1] === NWS.c) && (skip.t || !NWS.t || r[6].split(';').includes(NWS.t)) && (skip.a || !NWS.a || (r[7] || '').split(';').includes(NWS.a))
    && (skip.p || (d >= d0 && d <= d1)) && (!q || (r[3] + ' ' + r[4] + ' ' + r[2]).toLowerCase().includes(q)); });
}
const nwMark = s => hEsc(s).replace(NW_CUE, '<mark>$1</mark>');
const nwCard = (r, cue) => `<article class="nwc"><div class="meta"><span class="flag">${r[1]}</span> ${hEsc(r[0])} · ${hEsc(r[2] || '')}</div>`
  + `${cue ? (tn => tn.v ? ` <span class="nwtone ${tn.v > 0 ? 'p' : 'n'}" title="${hEsc([...tn.p.map(x => '+' + x), ...tn.n.map(x => '−' + x)].join(', '))}">${tn.v > 0 ? '▲' : '▼'} ${T().nw.tone[tn.v > 0 ? 'p' : 'n']}</span>` : '')(nwTone(r)) : ''}`
  + `<h3><a href="${hEsc(r[5])}" target="_blank" rel="noopener noreferrer">${cue ? nwMark(r[3]) : hEsc(r[3])}</a></h3>${r[4] ? `<p>${(cue ? nwMark : hEsc)(r[4].length > 320 ? r[4].slice(0, 317) + '…' : r[4])}</p>` : ''}`
  + `<div class="tags">${r[6].split(';').filter(Boolean).map(x => `<button type="button" class="chip" data-nwt="${hEsc(x)}">${hEsc(nwTopic(x))}</button>`).join('')}`
  + `${(r[7] || '').split(';').filter(Boolean).map(x => `<button type="button" class="chip ac" data-nwa="${hEsc(x)}">${hEsc(nwActName(x))}</button>`).join('')}</div></article>`;

const nwSpan = e => { const d = e.rows.map(r => r[0]).sort(); return [d[0], d[d.length - 1]]; };   // pirmo ir paskutinio straipsnio datos
/* bangos: savaitės su straipsniais, sujungiamos, kai tarpas ≤ 3 savaitės; paliekamos ≥ 3 straipsnių */
function nwWaves(rows) {
  const by = {};
  rows.forEach(r => r[6].split(';').forEach(tp => { if (!NW_TOPICS.includes(tp)) return; (by[tp] = by[tp] || []).push(r); }));
  const out = {};
  NW_TOPICS.forEach(tp => {
    const wk = {}; (by[tp] || []).forEach(r => { const w = nwWeek(dayOf(r[0])); (wk[w] = wk[w] || []).push(r); });
    const ws = Object.keys(wk).map(Number).sort((a, b) => a - b), ep = [];
    ws.forEach(w => { const e = ep[ep.length - 1]; if (e && w - e.w1 <= 4) { e.w1 = w; e.rows.push(...wk[w]); } else ep.push({ w0: w, w1: w, rows: [...wk[w]] }); });
    ep.forEach(e => { e.n = e.rows.length; let pk = e.w0, pn = 0; for (let w = e.w0; w <= e.w1; w++) if ((wk[w] || []).length > pn) { pn = wk[w].length; pk = w; }
      e.pk = pk; e.pn = pn; e.head = (wk[pk] || []).slice().sort((a, b) => (b[4] ? 1 : 0) - (a[4] ? 1 : 0))[0]; e.tp = tp; });
    out[tp] = { wk, ep: ep.filter(e => e.n >= 3) };
  });
  return out;
}

function nwInsights() {
  const t = T().nw, I = t.ins, now = nwNow(), cw = nwWeek(now), all = NEWS.filter(r => !NWS.c || r[1] === NWS.c), out = [];
  const inD = (r, a, b) => { const d = dayOf(r[0]); return d > now - a && d <= now - b; };
  const r30 = all.filter(r => inD(r, 30, -1));
  if (all.length < 10) return [{ s: I.none }];
  const cnt = (rs, tp) => rs.filter(r => r[6].split(';').includes(tp)).length;
  const hot = NW_TOPICS.map(tp => { const n = cnt(r30, tp), base = cnt(all.filter(r => inD(r, 395, 30)), tp) / 12.17; return { tp, n, x: base ? n / base : 0 }; }).sort((a, b) => b.n - a.n)[0];
  if (hot && hot.n >= 2) out.push({ s: I.hot(nwTopic(hot.tp), hot.n, hot.x >= 1.3 ? num(hot.x, 1) : ''), go: { t: hot.tp, p: '30' } });
  const W = nwWaves(all);
  const run = NW_TOPICS.map(tp => W[tp].ep.slice(-1)[0]).filter(e => e && e.w1 >= cw - 1 && e.w1 - e.w0 >= 2 && e.n >= 5).sort((a, b) => (b.w1 - b.w0) - (a.w1 - a.w0)).slice(0, 2);
  run.forEach(e => out.push({ s: I.run(nwTopic(e.tp), e.w1 - e.w0 + 1, nwSpan(e)[0], e.n), go: { t: e.tp, w: [e.w0, e.w1] } }));
  NW_TOPICS.forEach(tp => { const ep = W[tp].ep, e = ep[ep.length - 1], pr = ep[ep.length - 2];
    if (e && pr && e.w0 >= cw - 3 && e.w0 - pr.w1 >= 9 && !run.includes(e)) { const f = e.rows.slice().sort((a, b) => a[0].localeCompare(b[0]))[0];
      out.push({ s: I.back(nwTopic(tp), Math.round((e.w0 - pr.w1) / 4.35), f[0], f[3]), go: { t: tp, w: [e.w0, e.w1] } }); } });
  const fade = NW_TOPICS.map(tp => W[tp].ep.filter(e => e.n >= 8 && e.w1 >= cw - 104).slice(-1)[0]).filter(e => e && e === W[e.tp].ep.slice(-1)[0] && cw - e.w1 >= 6).sort((a, b) => b.n - a.n)[0];
  if (fade) out.push({ s: I.fade(nwTopic(fade.tp), cw - fade.w1, nwSpan(fade)[0], nwSpan(fade)[1], fade.n), go: { t: fade.tp, w: [fade.w0, fade.w1] } });
  const big = NW_TOPICS.flatMap(tp => W[tp].ep).filter(e => !run.includes(e)).sort((a, b) => b.n - a.n)[0];   // ne ta pati, kuri vyksta dabar
  if (big && big.head) out.push({ s: I.big(nwTopic(big.tp), nwSpan(big)[0], nwSpan(big)[1], big.n, big.w1 - big.w0 + 1, big.head[3]), go: { t: big.tp, w: [big.w0, big.w1] } });
  const ac = {}, acPrev = {};
  r30.forEach(r => (r[7] || '').split(';').filter(Boolean).forEach(a => { ac[a] = (ac[a] || 0) + 1; }));
  all.filter(r => inD(r, 395, 30)).forEach(r => (r[7] || '').split(';').filter(Boolean).forEach(a => { acPrev[a] = 1; }));
  const isMgr = id => (nwAct().find(x => x[0] === id) || [])[1] === 'mgr';
  const top = Object.entries(ac).filter(([a]) => !isMgr(a)).sort((a, b) => b[1] - a[1]).slice(0, 4);
  if (top.length) out.push({ s: I.act(top.map(([a, n]) => `${nwActName(a)} (${n})`).join(', ')), go: { a: top[0][0], p: '30' } });
  const nu = Object.entries(ac).filter(([a, n]) => n >= 2 && !acPrev[a] && !isMgr(a)).sort((a, b) => b[1] - a[1])[0];
  if (nu && all.some(r => dayOf(r[0]) < now - 300)) out.push({ s: I.newAct(nwActName(nu[0]), nu[1]), go: { a: nu[0], p: '30' } });
  if (typeof SEIMAS !== 'undefined' && SEIMAS.length && (!NWS.c || NWS.c === 'LT')) {
    const s60 = SEIMAS.filter(r => dayOf(r[0]) > now - 60 && (r[4] === 'kaupimas' || r[4] === 'pensijos')), pj = new Set(s60.map(r => r[3] || r[1]));
    if (s60.length) out.push({ s: I.seim(pj.size, s60[0][0], s60[0][1], s60[0][2]), seim: 1 });
  }
  if (!NWS.c) { const c = k => r30.filter(r => r[1] === k).length; out.push({ s: I.cty(c('LT'), c('EE'), c('LV')), go: { p: '30' } }); }
  return out;
}

/* Tonas be AI (savininkas 2026-10-21: „kortelės, kurios parodytų, kad LIPFA visada skatina ir gina, valdžia turi priešingą
   nuomonę, Sodra nesilaiko anksčiau išsakytos pozicijos“): antraštėje ir apraše suskaičiuojami teigiami ir neigiami žodžiai.
   Tai straipsnio tonas, kai veikėjas paminėtas, – ne patvirtinta veikėjo pozicija; kortelės veda į straipsnius patikrinti. */
const NW_POS = /(?<!\p{L})(uždirb|augo|auga|augim|išaug|rekord|naudinga|naudingi|naudos|pelning|apsimok|verta|sėkming|pritar|palaik|rekomend|teigiam|privalum|pasitikėj|gina|gynė|skatin|pieaug|peļņ|ienesīg|atbalst|kasv|kasum|toeta)\p{L}*/giu;   // žodžio pradžia: „nepritaria“ nepateks į teigiamus
const NW_NEG = /(?<!\p{L})(prarad|nuostol|krito|kritim|sumaž|mažėj|kritik|kritiz|nepritar|prieš|atmet|smerk|žal[aąoi]|rizik|abejo|neapsimok|brang|nusivyl|problem|trūkum|nesąžin|apgaul|spąst|panaikin|apmokestin|nenaud|blog|grėsm|skaud|nepasitikėj|zaudēj|iebilst|noraid|slikt|kahjum|kukk|vastu|halb)\p{L}*/giu;
function nwTone(r) {
  const tx = `${r[3]} ${r[4]}`, p = tx.match(NW_POS) || [], n = tx.match(NW_NEG) || [];
  return { v: Math.sign(p.length - n.length), p, n };
}
function nwStance() {                                         // visa šalies istorija (ne laikotarpio filtras), kad matytųsi kaita
  const t = T().nw, S = t.st, rows = NEWS.filter(r => r[1] === NWS.c), by = {};
  rows.forEach(r => { const tn = nwTone(r).v; if (!tn) return; (r[7] || '').split(';').filter(Boolean).forEach(a => { (by[a] = by[a] || []).push([r[0], tn, r]); }); });
  const isMgr = id => (nwAct().find(x => x[0] === id) || [])[1] === 'mgr', out = [];
  const st = Object.entries(by).filter(([a, v]) => v.length >= 4 && !isMgr(a)).map(([a, v]) => { const pos = v.filter(x => x[1] > 0).length; return { a, n: v.length, pos, idx: (2 * pos - v.length) / v.length, v }; });
  st.filter(x => Math.abs(x.idx) >= 0.5).sort((a, b) => Math.abs(b.idx) * Math.sqrt(b.n) - Math.abs(a.idx) * Math.sqrt(a.n)).slice(0, 4)
    .forEach(x => out.push({ s: x.idx > 0 ? S.pos(nwActName(x.a), x.pos, x.n) : S.neg(nwActName(x.a), x.n - x.pos, x.n), a: x.a }));
  const hi = st.filter(x => x.idx >= 0.3).sort((a, b) => b.idx - a.idx)[0], lo = st.filter(x => x.idx <= -0.3).sort((a, b) => a.idx - b.idx)[0];
  if (hi && lo) out.push({ s: S.vs(nwActName(hi.a), Math.round((hi.idx + 1) * 50), nwActName(lo.a), Math.round((lo.idx + 1) * 50)), a: hi.a });
  st.forEach(x => {                                           // tono pokytis tarp gretimų metų (bent po 2 straipsnius su tonu)
    const yr = {}; x.v.forEach(([d, tn]) => { const y = d.slice(0, 4); yr[y] = yr[y] || [0, 0]; yr[y][0] += tn; yr[y][1]++; });
    const ys = Object.keys(yr).sort().filter(y => yr[y][1] >= 2);
    for (let i = ys.length - 1; i > 0; i--) { const a = yr[ys[i - 1]], b = yr[ys[i]], ia = a[0] / a[1], ib = b[0] / b[1];
      if (Math.sign(ia) !== Math.sign(ib) && Math.abs(ia - ib) >= 0.8) { out.push({ s: S.chg(nwActName(x.a), ys[i - 1], ia > 0, a[1], ys[i], ib > 0, b[1]), a: x.a, chg: 1 }); break; } }
  });
  return out.sort((a, b) => (b.chg || 0) - (a.chg || 0));
}

function renderNews() {
  const t = T().nw, box = document.getElementById('nwBody');
  const lt = document.getElementById('tdNews');
  if (lt) lt.innerHTML = nwHas() ? `<h2>${t.latest}</h2>${NEWS.filter(r => r[1] === 'LT').slice(0, 5).map(r => nwCard(r)).join('')}<p class="more"><a href="#" data-gonw="1">${t.toAll}</a></p>` : '';
  if (!box) return;
  nwHashQ();
  document.getElementById('nwTitle').textContent = t.title; document.getElementById('nwLead').textContent = t.lead;
  if (!nwHas()) { box.innerHTML = `<p class="note">${t.none}</p>`; return; }
  const chip = (k, v, l) => `<button type="button" class="chip" data-nw="${k}" data-v="${hEsc(v)}" aria-pressed="${String(NWS[k]) === String(v)}">${hEsc(l)}</button>`;
  document.getElementById('nwBar').innerHTML = `<div class="bar nwbar"><div class="chips">${['LT', 'LV', 'EE'].map(c => chip('c', c, t.c[c])).join('')}<span class="sep"></span>`
    + `${['', '30', '90', '365', 'c'].map(p => chip('p', p, t.per[p])).join('')}${NWS.p === 'c' ? `<label class="nwd">${t.from} <input type="date" id="nwFrom" value="${NWS.from}"></label><label class="nwd">${t.to} <input type="date" id="nwTo" value="${NWS.to}"></label>` : ''}</div>`
    + `<input type="search" id="nwQ" placeholder="${t.search}" value="${hEsc(NWS.q)}"><button type="button" class="btn xl" id="nwXl">${t.xl}</button>`
    + `<div class="chips">${chip('t', '', t.all)}${NW_TOPICS.map(x => chip('t', x, nwTopic(x))).join('')}</div></div>`;
  box.innerHTML = `<section class="card" id="nwIns"></section><section class="card" id="nwTl"></section><section class="card" id="nwAc"></section>`
    + `${typeof SEIMAS !== 'undefined' && SEIMAS.length && NWS.c === 'LT' ? '<section class="card" id="nwSe"></section>' : ''}<section class="card" id="nwLs"></section>`;
  nwDraw();
}
function nwDraw() { nwInsCard(); nwTimeline(); nwActors(); nwSeimas(); nwList(); }
function nwInsCard() {
  const t = T().nw, el = document.getElementById('nwIns'); if (!el) return;
  const ins = nwInsights(); el._ins = ins;
  el.innerHTML = `<h2>${t.insT}</h2><p class="note">${t.insL}</p><div class="nwins">${ins.map((x, i) => `<div class="nwi"><p>${hEsc(x.s)}</p><div>`
    + `${x.go || x.seim ? `<button type="button" class="btn" data-nwgo="${i}">${t.show}</button>` : ''}<button type="button" class="btn" data-nwcp="${i}">${T().copy}</button></div></div>`).join('')}</div>`;
}
function nwTimeline() {
  const t = T().nw, el = document.getElementById('nwTl'); if (!el) return;
  const rows = nwRows({ t: 1 }); el.innerHTML = `<h2>${t.tlT}</h2><p class="note">${t.tlL}</p><div class="nwtl" id="nwTlC"></div><div id="nwWave"></div>`;
  if (!rows.length) { document.getElementById('nwTlC').innerHTML = `<p class="note">${t.none}</p>`; return; }
  const W = nwWaves(rows), [r0, r1] = nwRange();
  const w0 = nwWeek(Math.max(r0, dayOf(rows[rows.length - 1][0]))), w1 = nwWeek(Math.min(r1, nwNow())), n = Math.max(1, w1 - w0 + 1);
  const seL = typeof SEIMAS !== 'undefined' && SEIMAS.length && (!NWS.c || NWS.c === 'LT'), nL = NW_TOPICS.length + (seL ? 1 : 0);
  const box = document.getElementById('nwTlC'), Wd = box.clientWidth || 640, m = { l: 6, r: 6 }, lh = 40, H = nL * lh + 22, X = w => m.l + (w - w0) / n * (Wd - m.l - m.r), bw = Math.max(1, (Wd - m.l - m.r) / n);
  let s = `<svg viewBox="0 0 ${Wd} ${H}" role="img" aria-label="${hEsc(t.tlT)}">`;
  NW_TOPICS.forEach((tp, i) => {
    const y = i * lh, wk = W[tp].wk, hi = Math.max(1, ...Object.values(wk).map(a => a.length)), sel = NWS.t === tp;
    s += `<text x="${m.l}" y="${y + 12}" font-size="12" fill="${sel ? 'var(--text)' : 'var(--text-2)'}" font-weight="${sel ? 700 : 500}">${hEsc(nwTopic(tp))}</text>`
      + `<rect x="${m.l}" y="${y + 17}" width="${Wd - m.l - m.r}" height="16" fill="var(--hover)" rx="3"/>`;
    Object.entries(wk).forEach(([w, a]) => { w = +w; if (w < w0 || w > w1) return; s += `<rect x="${X(w)}" y="${y + 17}" width="${bw}" height="16" fill="var(--accent, #2b8de0)" opacity="${(0.15 + 0.85 * a.length / hi).toFixed(2)}"/>`; });
    s += `<rect class="nwhit" data-nwlane="${tp}" x="${m.l}" y="${y + 14}" width="${Wd - m.l - m.r}" height="22" fill="transparent" style="cursor:pointer"><title>${hEsc(t.hit)}</title></rect>`;
    W[tp].ep.forEach((e, j) => { if (e.w1 < w0 || e.w0 > w1) return; const a = Math.max(e.w0, w0), b = Math.min(e.w1, w1), on = NWS.w && NWS.w.tp === tp && NWS.w.w0 === e.w0;
      s += `<rect class="nwep" data-nwep="${tp}:${j}" x="${X(a)}" y="${y + 15}" width="${Math.max(3, X(b) - X(a) + bw)}" height="20" fill="transparent" stroke="${on ? 'var(--text)' : 'var(--text-2)'}" stroke-width="${on ? 2 : 1}" rx="4" style="cursor:pointer"><title>${hEsc(t.wave(nwTopic(tp), ...nwSpan(e), e.w1 - e.w0 + 1, e.n))}</title></rect>`; });
  });
  if (seL) {                                                    // valdžios dėmesys: Seimo darbotvarkės klausimai per savaitę (pasirinkta kategorija)
    const y = NW_TOPICS.length * lh, wk = {}; SEIMAS.forEach(r => { if (NWS.sc && r[4] !== NWS.sc) return; const w = nwWeek(dayOf(r[0])); wk[w] = (wk[w] || 0) + 1; });
    const hi = Math.max(1, ...Object.values(wk));
    s += `<text x="${m.l}" y="${y + 12}" font-size="12" fill="var(--text-2)" font-weight="500">${hEsc(t.seLane(t.seC[NWS.sc] || ''))}</text><rect x="${m.l}" y="${y + 17}" width="${Wd - m.l - m.r}" height="16" fill="var(--hover)" rx="3"/>`;
    Object.entries(wk).forEach(([w, n]) => { w = +w; if (w < w0 || w > w1) return; s += `<rect x="${X(w)}" y="${y + 17}" width="${bw}" height="16" fill="#c9765a" opacity="${(0.25 + 0.75 * n / hi).toFixed(2)}"/>`; });
    s += `<rect class="nwhit" data-nwlane="seimas" x="${m.l}" y="${y + 14}" width="${Wd - m.l - m.r}" height="22" fill="transparent" style="cursor:pointer"><title>${hEsc(t.hit)}</title></rect>`;
  }
  const y0 = new Date(nwWeekDay(w0) * DAY).getUTCFullYear(), y1 = new Date(nwWeekDay(w1) * DAY).getUTCFullYear(), long = y1 - y0 >= 2; let lastX = -1e9;
  for (let w = w0; w <= w1; w++) { const d = iso(nwWeekDay(w)), prev = iso(nwWeekDay(w - 1)); const lab = long ? (d.slice(0, 4) !== prev.slice(0, 4) ? d.slice(0, 4) : '') : (d.slice(5, 7) !== prev.slice(5, 7) ? `${T().monShort[+d.slice(5, 7) - 1]}${d.slice(5, 7) === '01' ? ' ' + d.slice(0, 4) : ''}` : '');
    if (lab && X(w) - lastX > 44) { s += `<text x="${X(w)}" y="${H - 4}" font-size="11" fill="var(--text-3)">${lab}</text><line x1="${X(w)}" x2="${X(w)}" y1="14" y2="${H - 16}" stroke="var(--grid)" stroke-dasharray="2 3"/>`; lastX = X(w); } }
  box.innerHTML = s + '</svg>'; box._W = W; box._g = { w0, w1, n, l: m.l, r: m.r, Wd };
  nwWaveBox();
}
function nwWaveBox() {
  const t = T().nw, el = document.getElementById('nwWave'), W = (document.getElementById('nwTlC') || {})._W; if (!el) return;
  const hd = (txt, extra) => `<div class="hd"><b>${hEsc(txt)}</b>${extra || ''} <button type="button" class="btn" data-nwwc="1">${t.close}</button></div>`;
  const desc = rs => rs.slice().sort((a, b) => b[0].localeCompare(a[0]));             // naujausi viršuje (savininkas 2026-10-21)
  if (NWS.w && NWS.w.se) {                                                         // Seimo darbotvarkė: pasirinkta savaitė ±1
    const rs = SEIMAS.filter(r => (!NWS.sc || r[4] === NWS.sc) && Math.abs(nwWeek(dayOf(r[0])) - NWS.w.w) <= 1);
    el.innerHTML = rs.length ? `<div class="nwwave">${hd(t.seWeek(iso(nwWeekDay(NWS.w.w - 1)), iso(nwWeekDay(NWS.w.w + 1) + 6), rs.length))}${desc(rs).map(nwSeCard).join('')}</div>` : ''; return;
  }
  if (NWS.w && NWS.w.wk != null && W && W[NWS.w.tp]) {                             // viena savaitė be bangos
    const rs = W[NWS.w.tp].wk[NWS.w.wk] || [];
    el.innerHTML = rs.length ? `<div class="nwwave">${hd(t.week(nwTopic(NWS.w.tp), iso(nwWeekDay(NWS.w.wk)), rs.length))}${desc(rs).map(r => nwCard(r)).join('')}</div>` : ''; return;
  }
  const e = NWS.w && W && W[NWS.w.tp] ? W[NWS.w.tp].ep.find(x => x.w0 === NWS.w.w0) : null;
  if (!e) { el.innerHTML = ''; return; }
  const rs = desc(e.rows);
  el.innerHTML = `<div class="nwwave">${hd(t.wave(nwTopic(e.tp), rs[rs.length - 1][0], rs[0][0], e.w1 - e.w0 + 1, e.n), ` · ${hEsc(t.peak(iso(nwWeekDay(e.pk)), e.pn))}`)}${rs.map(r => nwCard(r)).join('')}</div>`;
}
const nwSeCard = r => `<article class="nwc"><div class="meta"><span class="flag">${hEsc(T().nw.seC[r[4]] || r[4])}</span> ${hEsc(r[0])} · ${hEsc(r[2] || '')} · ${hEsc(r[3] || '')}</div>`
  + `<h3>${r[5] ? `<a href="${hEsc(r[5])}" target="_blank" rel="noopener noreferrer">${hEsc(r[1])}</a>` : hEsc(r[1])}</h3>${r[6] ? `<p>${hEsc(r[6])}</p>` : ''}</article>`;
/* paspaudimas laiko juostos eilutėje: artimiausia savaitė su straipsniais (±4 sav.) – jos banga arba ta savaitė */
function nwLaneClick(hit, ev) {
  const box = document.getElementById('nwTlC'), g = box._g, svg = box.querySelector('svg'), rc = svg.getBoundingClientRect();
  const x = (ev.clientX - rc.left) * g.Wd / rc.width, w = g.w0 + Math.floor((x - g.l) / (g.Wd - g.l - g.r) * g.n), lane = hit.dataset.nwlane;
  const weeks = lane === 'seimas' ? [...new Set(SEIMAS.filter(r => !NWS.sc || r[4] === NWS.sc).map(r => nwWeek(dayOf(r[0]))))] : Object.keys(box._W[lane].wk).map(Number);
  const near = weeks.filter(v => Math.abs(v - w) <= Math.max(4, Math.ceil(g.n / 120))).sort((a, b) => Math.abs(a - w) - Math.abs(b - w))[0];
  if (near == null) { NWS.w = null; nwWaveBox(); document.getElementById('nwWave').innerHTML = `<p class="note">${T().nw.hitNone}</p>`; return; }
  if (lane === 'seimas') NWS.w = { se: 1, w: near };
  else { const e = box._W[lane].ep.find(x => near >= x.w0 && near <= x.w1); NWS.w = e ? { tp: lane, w0: e.w0 } : { tp: lane, wk: near }; }
  nwTimeline(); document.getElementById('nwWave').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function nwActors() {
  const t = T().nw, el = document.getElementById('nwAc'); if (!el) return;
  const rows = nwRows({ a: 1 }), grp = Object.fromEntries(nwAct().map(a => [a[0], a[1]]));
  const chip = (v, l) => `<button type="button" class="chip" data-nw="g" data-v="${v}" aria-pressed="${NWS.g === v}">${hEsc(l)}</button>`;
  let h = `<h2>${t.acT}</h2><p class="note">${t.acL}</p><div class="chips" style="margin-bottom:8px">${Object.entries(t.grp).map(([k, l]) => chip(k, l)).join('')}</div>`;
  const cnt = {}; rows.forEach(r => (r[7] || '').split(';').filter(Boolean).forEach(a => { if (!NWS.g || grp[a] === NWS.g) cnt[a] = (cnt[a] || 0) + 1; }));
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 16).map(x => x[0]);
  if (!top.length) { el.innerHTML = h + `<p class="note">${t.acNone}</p>`; return; }
  const d0 = dayOf(rows[rows.length - 1][0]), d1 = dayOf(rows[0][0]), span = d1 - d0;
  const key = s => span > 1500 ? s.slice(0, 4) : span > 400 ? `${s.slice(0, 4)} K${Math.floor((+s.slice(5, 7) - 1) / 3) + 1}` : s.slice(0, 7);
  const ks = [...new Set(rows.map(r => key(r[0])))].sort();
  const M = {}; rows.forEach(r => (r[7] || '').split(';').forEach(a => { if (!cnt[a]) return; const k = key(r[0]); M[a] = M[a] || {}; M[a][k] = (M[a][k] || 0) + 1; }));
  const hi = Math.max(1, ...top.flatMap(a => Object.values(M[a] || {})));
  h += `<div class="nwmxw"><table class="nwmx"><thead><tr><th></th>${ks.map(k => `<th>${hEsc(k)}</th>`).join('')}<th>Σ</th></tr></thead><tbody>`
    + top.map(a => `<tr data-nwa="${hEsc(a)}" class="${NWS.a === a ? 'on' : ''}"><th>${hEsc(nwActName(a))}</th>${ks.map(k => { const v = (M[a] || {})[k] || 0; return `<td style="${v ? `background:color-mix(in srgb, var(--accent, #2b8de0) ${Math.round(12 + 70 * v / hi)}%, transparent)` : ''}">${v || ''}</td>`; }).join('')}<td><b>${cnt[a]}</b></td></tr>`).join('')
    + `</tbody></table></div>`;
  const sts = nwStance(); el._st = sts;
  if (sts.length) h += `<h3 class="sub">${t.stT}</h3><p class="note">${t.stL}</p><div class="nwins" style="margin-bottom:12px">${sts.map((x, i) => `<div class="nwi${x.chg ? ' chg' : ''}"><p>${hEsc(x.s)}</p><div><button type="button" class="btn" data-nwst="${i}">${t.show}</button><button type="button" class="btn" data-nwstc="${i}">${T().copy}</button></div></div>`).join('')}</div>`;
  if (NWS.a) { const rs = nwRows(); h += `<div class="nwwave"><div class="hd"><b>${hEsc(t.acSel(nwActName(NWS.a)))}</b> <button type="button" class="btn" data-nwac="1">${t.close}</button></div>${rs.slice(0, 80).map(r => nwCard(r, 1)).join('') || `<p class="note">${t.none}</p>`}</div>`; }
  el.innerHTML = h;
}
function nwSeimas() {
  const t = T().nw, el = document.getElementById('nwSe'); if (!el) return;
  const [d0, d1] = nwRange(), q = NWS.q.trim().toLowerCase();
  const rs = SEIMAS.filter(r => { const d = dayOf(r[0]); return d >= d0 && d <= d1 && (!NWS.sc || r[4] === NWS.sc) && (!q || r[1].toLowerCase().includes(q)); });
  const pj = new Map(); rs.forEach(r => { const k = r[3] ? r[3].replace(/\(\d+\)$/, '') : r[1]; if (!pj.has(k)) pj.set(k, []); pj.get(k).push(r); });
  const chip = (v, l) => `<button type="button" class="chip" data-nw="sc" data-v="${v}" aria-pressed="${NWS.sc === v}">${hEsc(l)}</button>`;
  const list = [...pj.values()].slice(0, NWS.sn);
  el.innerHTML = `<h2>${t.seT}</h2><p class="note">${t.seL}</p><div class="chips" style="margin-bottom:8px">${Object.entries(t.seC).map(([k, l]) => chip(k, l)).join('')}</div>`
    + (list.length ? list.map(g => { const s = g.slice().sort((a, b) => a[0].localeCompare(b[0])), last = s[s.length - 1];
      return `<article class="nwc"><div class="meta"><span class="flag">${hEsc(t.seC[last[4]] || last[4])}</span> ${hEsc(last[3] || '')}</div><h3>${last[5] ? `<a href="${hEsc(last[5])}" target="_blank" rel="noopener noreferrer">${hEsc(last[1])}</a>` : hEsc(last[1])}</h3>`
        + `<p class="nwst">${s.map(r => `<span title="${hEsc(r[6] || '')}">${hEsc(r[0])} ${hEsc(r[2] || '–')}</span>`).join(' → ')}</p></article>`; }).join('')
      + (pj.size > NWS.sn ? `<p><button type="button" class="btn" id="nwSeMore">${t.more(Math.min(12, pj.size - NWS.sn))}</button></p>` : '') : `<p class="note">${t.seNone}</p>`);
}
function nwList() {
  const t = T().nw, rs = nwRows(), box = document.getElementById('nwLs'); if (!box) return;
  box.innerHTML = `<h2>${t.listT}</h2><h3 class="sub">${rs.length && dayOf(rs[rs.length - 1][0]) < dayOf(rs[0][0]) - 900 ? t.chartQ : t.chart}</h3><div class="chart" id="nwCh"></div>`
    + `<p class="meta">${t.count(rs.length, NEWS.length)}</p>${rs.length ? rs.slice(0, NWS.n).map(r => nwCard(r)).join('') : `<p class="note">${t.none}</p>`}`
    + `${rs.length > NWS.n ? `<p><button type="button" class="btn" id="nwMore">${t.more(Math.min(30, rs.length - NWS.n))}</button></p>` : ''}<p class="note">${t.note}</p>`;
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
    const sh = t.title.slice(0, 31), N = rs.length + 4;
    XL.sheet(wb, sh, [[{ v: t.title, s: 'title' }], [{ v: t.note, s: 'note' }], [], t.xh.map(h => ({ v: h, s: 'hdr' })),
      ...rs.map(r => [{ v: dayOf(r[0]) + 25569, z: 'yyyy-mm-dd' }, r[1], r[2], r[3], r[4], { v: r[5], l: r[5] }, r[6].split(';').filter(Boolean).map(nwTopic).join(', '), `;${r[7] || ''};`])], { cols: [12, 7, 18, 70, 70, 40, 30, 30], freeze: { r: 4 } });
    const W = nwWaves(rs), ep = NW_TOPICS.flatMap(tp => W[tp].ep).sort((a, b) => a.w0 - b.w0);
    XL.sheet(wb, t.shW, [[{ v: t.tlT, s: 'title' }], [{ v: t.tlL, s: 'note' }], [], t.xw.map(h => ({ v: h, s: 'hdr' })),
      ...ep.map(e => [nwTopic(e.tp), { v: dayOf(nwSpan(e)[0]) + 25569, z: 'yyyy-mm-dd' }, { v: dayOf(nwSpan(e)[1]) + 25569, z: 'yyyy-mm-dd' }, e.w1 - e.w0 + 1, e.n, { v: nwWeekDay(e.pk) + 25569, z: 'yyyy-mm-dd' }, e.pn, e.head ? e.head[3] : ''])], { cols: [22, 12, 12, 9, 10, 12, 10, 70], freeze: { r: 4 } });
    const yrs = [...new Set(rs.map(r => r[0].slice(0, 4)))].sort(), ids = [...new Set(rs.flatMap(r => (r[7] || '').split(';').filter(Boolean)))];
    const ar = [[{ v: t.acT, s: 'title' }], [{ v: t.acL, s: 'note' }], [], [{ v: 'id', s: 'hdr' }, { v: t.shA, s: 'hdr' }, ...yrs.map(y => ({ v: +y, s: 'hdr' }))]];
    ids.forEach((id, i) => { const n = i + 5; ar.push([id, nwActName(id), ...yrs.map((y, j) => { const c = xlCol(j + 2), v = rs.filter(r => r[0].startsWith(y) && (r[7] || '').split(';').includes(id)).length;
      return { f: `COUNTIFS('${sh}'!H$5:H$${N},"*;"&$A${n}&";*",'${sh}'!A$5:A$${N},">="&DATE(${c}$4,1,1),'${sh}'!A$5:A$${N},"<"&DATE(${c}$4+1,1,1))`, v }; })]); });
    XL.sheet(wb, t.shA, ar, { cols: [12, 34, ...yrs.map(() => 8)], freeze: { r: 4, c: 2 } });
    if (typeof SEIMAS !== 'undefined' && SEIMAS.length) XL.sheet(wb, t.shS, [[{ v: t.seT, s: 'title' }], [{ v: t.seL, s: 'note' }], [], t.xs.map(h => ({ v: h, s: 'hdr' })),
      ...SEIMAS.map(r => [{ v: dayOf(r[0]) + 25569, z: 'yyyy-mm-dd' }, r[1], r[2], r[3], t.seC[r[4]] || r[4], r[5] ? { v: r[5], l: r[5] } : '', r[6]])], { cols: [12, 80, 14, 14, 18, 40, 50], freeze: { r: 4 } });
    await XL.save(wb, `${lang === 'lt' ? 'pensiju-naujienos' : 'pension-news'}.xlsx`); b.textContent = '✓';
  } catch (e) { console.error(e); b.textContent = '!'; }
  setTimeout(() => { b.textContent = o; b.disabled = false; }, 1500);
}
/* paieška viršuje: „Visi straipsniai su …“ -> index.html#go=nwTitle&nwq=… */
function nwHashQ() {
  let q = null; try { q = new URLSearchParams(location.hash.slice(1)).get('nwq'); } catch (e) {}
  if (q != null && q !== nwHashQ.last) { nwHashQ.last = q; NWS.q = q; NWS.n = 30; }
}
addEventListener('hashchange', () => { const o = NWS.q; nwHashQ(); if (NWS.q !== o && document.getElementById('nwBody')) renderNews(); });
const nwShow = () => { const h = document.getElementById('nwTitle'); if (h && !document.getElementById('nwBody').offsetParent) showTab(paneOf(h), true); };
document.addEventListener('click', e => {
  const c = e.target.closest('[data-nw]'); if (c) { const k = c.dataset.nw; NWS[k] = c.dataset.v; NWS.n = 30; if (k === 'p' || k === 'c') NWS.w = null; if (k === 'c') { NWS.a = ''; NWS.t = ''; } if (k === 'sc') NWS.sn = 12; renderNews(); return; }
  const tg = e.target.closest('[data-nwt]'); if (tg) { NWS.t = tg.dataset.nwt; NWS.n = 30; nwShow(); renderNews(); return; }
  const ac = e.target.closest('[data-nwa]'); if (ac && !e.target.closest('a')) { NWS.a = NWS.a === ac.dataset.nwa && ac.tagName === 'TR' ? '' : ac.dataset.nwa; NWS.n = 30; nwShow(); renderNews(); if (NWS.a) setTimeout(() => document.getElementById('nwAc').scrollIntoView({ block: 'start', behavior: 'smooth' }), 60); return; }
  const hit = e.target.closest('[data-nwlane]'); if (hit) { nwLaneClick(hit, e); return; }
  const ep = e.target.closest('[data-nwep]'); if (ep) { const [tp, j] = ep.dataset.nwep.split(':'), W = document.getElementById('nwTlC')._W, x = W[tp].ep[+j]; NWS.w = NWS.w && NWS.w.tp === tp && NWS.w.w0 === x.w0 ? null : { tp, w0: x.w0 }; nwTimeline(); return; }
  if (e.target.closest('[data-nwwc]')) { NWS.w = null; nwWaveBox(); nwTimeline(); return; }
  const sb = e.target.closest('[data-nwst]'); if (sb) { NWS.a = document.getElementById('nwAc')._st[+sb.dataset.nwst].a; NWS.p = ''; NWS.t = ''; NWS.q = ''; renderNews(); setTimeout(() => document.querySelector('#nwAc .nwwave').scrollIntoView({ block: 'start', behavior: 'smooth' }), 60); return; }
  const sc = e.target.closest('[data-nwstc]'); if (sc) { mkCopy(`${document.getElementById('nwAc')._st[+sc.dataset.nwstc].s} ${T().nw.stSrc}`, sc); return; }
  if (e.target.closest('[data-nwac]')) { NWS.a = ''; renderNews(); return; }
  const g = e.target.closest('[data-nwgo]'); if (g) { const x = document.getElementById('nwIns')._ins[+g.dataset.nwgo];
    if (x.seim) { document.getElementById('nwSe').scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
    const o = x.go; NWS.t = o.t || ''; NWS.a = o.a || ''; NWS.q = ''; NWS.n = 30; NWS.w = null; NWS.p = o.p || '';
    if (o.w) { NWS.w = { tp: o.t, w0: o.w[0] }; NWS.t = ''; }
    renderNews(); document.getElementById(o.w ? 'nwTl' : o.a ? 'nwAc' : 'nwLs').scrollIntoView({ block: 'start', behavior: 'smooth' }); return; }
  const cp = e.target.closest('[data-nwcp]'); if (cp) { const x = document.getElementById('nwIns')._ins[+cp.dataset.nwcp]; mkCopy(`${x.s} ${lang === 'lt' ? 'Šaltinis: žiniasklaidos straipsnių archyvas (pensijų fondų apžvalga).' : 'Source: media article archive (pension fund review).'}`, cp); return; }
  if (e.target.closest('#nwMore')) { NWS.n += 30; nwList(); return; }
  if (e.target.closest('#nwSeMore')) { NWS.sn += 12; nwSeimas(); return; }
  if (e.target.closest('#nwXl')) return nwExcel(e.target.closest('#nwXl'));
  if (e.target.closest('[data-gonw]')) { e.preventDefault(); nwShow(); }
});
let nwQt; document.addEventListener('input', e => { if (e.target.id !== 'nwQ') return; clearTimeout(nwQt); nwQt = setTimeout(() => { NWS.q = e.target.value; NWS.n = 30; nwDraw(); }, 250); });
document.addEventListener('change', e => { if (e.target.id === 'nwFrom' || e.target.id === 'nwTo') { NWS[e.target.id === 'nwFrom' ? 'from' : 'to'] = e.target.value; NWS.w = null; nwDraw(); } });
