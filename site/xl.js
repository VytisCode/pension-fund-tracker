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
