/* LV/ET Excel vertimų patikra (2026-11-10): atidaro puslapius latvių ar estų kalba, kiekviename skirtuke paspaudžia matomus
   Excel mygtukus ir išrašo Excel tekstus, kurių nėra žodyne site/i18n.tsv (xl.js renka į TR3_MISS).
   Paleisti kaip tools/i18n_scan.js: python build_site.py; cd docs && python -m http.server 8765 &;
   node tools/i18n_scan_xl.js [lv|et] [puslapiai,...] > trūksta_xl.tsv   (išvestis: raktas \t puslapis \t pavyzdys) */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASE = process.env.I18N_BASE || 'http://localhost:8765/';
const lg = process.argv[2] || 'lv';
const pages = process.argv[3] ? process.argv[3].split(',') : fs.readdirSync(path.join(__dirname, '..', 'docs')).filter(f => f.endsWith('.html'));
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ acceptDownloads: true, viewport: { width: 1400, height: 900 } });
  await ctx.addInitScript(l => { try { localStorage.setItem('lang', l); } catch (e) {} self.TR3_MISS = new Set(); }, lg);
  const pg = await ctx.newPage(); pg.on('download', d => d.cancel().catch(() => {})); pg.on('dialog', d => d.dismiss().catch(() => {}));
  const out = {};
  for (const p of pages) {
    try {
      await pg.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); await pg.waitForTimeout(1200);
      const tabs = await pg.evaluate(() => [...new Set([...document.querySelectorAll('[data-tab]')].map(e => e.dataset.tab))]);
      for (const t of [null, ...tabs]) {
        if (t) { await pg.evaluate(x => { try { showTab(x); } catch (e) {} }, t); await pg.waitForTimeout(500); }
        const n = await pg.evaluate(() => { let k = 0; document.querySelectorAll('button,a').forEach(b => { if (/Excel|⤓/.test(b.textContent || '') && b.offsetParent && !b.href) { try { b.click(); k++; } catch (e) {} } }); return k; });
        if (n) await pg.waitForTimeout(800);
      }
      const miss = await pg.evaluate(() => [...self.TR3_MISS].map(s => [tr3Key(s.replace(/\s+/g, ' ').trim())[0], s]));
      miss.forEach(([k, s]) => { if (!out[k]) out[k] = [p, s]; });
      console.error(lg, p, miss.length);
    } catch (e) { console.error('klaida', p, e.message); }
  }
  for (const [k, [p, s]] of Object.entries(out)) console.log([k, p, s.slice(0, 120)].join('\t').replace(/\n/g, ' '));
  await br.close();
})();
