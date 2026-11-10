/* LV/ET vertimų patikra (2026-11-10): atidaro visus docs/*.html anglų ir latvių/estų kalbomis, perjungia visus skirtukus
   ir išrašo tekstus, kurie LV/ET puslapyje liko tokie pat kaip angliškame (= neišversti). Rezultatas – šablonai (skaičiai {N},
   datos {D}, mėnesiai {M}), kuriuos reikia įrašyti į site/i18n.tsv.
   Paleisti: python build_site.py; cd docs && python -m http.server 8765 &; node tools/i18n_scan.js [lv|et] [puslapiai,...] > trūksta.tsv
   Išvestis: raktas \t puslapis \t pavyzdys \t kontekstas. Duomenys (fondų, vertybinių popierių pavadinimai, naujienos) irgi pateks –
   juos atmesti žiūrint (žodyne jų nereikia). */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.I18N_BASE || 'http://localhost:8765/';
const lg = process.argv[2] || 'lv';
const pages = process.argv[3] ? process.argv[3].split(',') : fs.readdirSync(path.join(__dirname, '..', 'docs')).filter(f => f.endsWith('.html'));
const collect = () => {
  const S = {};
  const add = (s, ctx) => { s = s.replace(/\s+/g, ' ').trim(); if (!s || !/[A-Za-z]{2}/.test(s)) return; if (!S[s]) S[s] = ctx; };
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const pe = n.parentElement; if (!pe || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(pe.tagName) || pe.closest('[translate=no],.notranslate')) continue;
    const b = pe.closest('p,li,td,th,h1,h2,h3,h4,label,button,option,summary,div'); add(n.nodeValue, (b ? b.textContent : '').replace(/\s+/g, ' ').trim().slice(0, 200)); }
  document.querySelectorAll('[title],[placeholder],[aria-label],[alt]').forEach(e => ['title', 'placeholder', 'aria-label', 'alt'].forEach(a => e.hasAttribute(a) && add(e.getAttribute(a), '@' + a)));
  add(document.title, '@title');
  return S;
};
async function run(br, l) {
  const ctx = await br.newContext({ viewport: { width: 1400, height: 900 } });
  await ctx.addInitScript(x => { try { localStorage.setItem('lang', x); } catch (e) {} }, l);
  const pg = await ctx.newPage(), res = {};
  for (const p of pages) {
    try {
      await pg.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1200);
      const all = await pg.evaluate(collect);
      const tabs = await pg.evaluate(() => [...new Set([...document.querySelectorAll('[data-tab]')].map(e => e.dataset.tab))]);
      for (const t of tabs) { try { await pg.evaluate(k => showTab(k), t); await pg.waitForTimeout(600); Object.assign(all, await pg.evaluate(collect)); } catch (e) {} }
      if (l !== 'en') { const keys = await pg.evaluate(xs => Object.fromEntries(xs.map(s => [s, tr3Key(s)[0]])), Object.keys(all)); for (const s in all) all[s] = [all[s], keys[s]]; }
      res[p] = all; process.stderr.write(`${l} ${p} ${Object.keys(all).length}\n`);
    } catch (e) { process.stderr.write(`FAIL ${l} ${p} ${e.message}\n`); }
  }
  await ctx.close(); return res;
}
(async () => {
  const br = await chromium.launch(), en = await run(br, 'en'), tr = await run(br, lg); await br.close();
  const E = new Set(Object.values(en).flatMap(o => Object.keys(o))), out = new Map();
  for (const [p, o] of Object.entries(tr)) for (const [s, [c, k]] of Object.entries(o)) if (E.has(s) && !out.has(k)) out.set(k, [p, s, c]);
  process.stdout.write([...out].map(([k, [p, s, c]]) => [k, p, s, c].map(x => String(x).replace(/\t/g, ' ')).join('\t')).join('\n') + '\n');
  process.stderr.write(`trūksta: ${out.size}\n`);
})();
