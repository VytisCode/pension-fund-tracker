/* „Kelias į pensiją“: ateities scenarijai (auditas #65; savininko sprendimas 2026-10-14 – pasirenkami visi 3 variantai).
   Nuo šiandienos būsenos (modelio turtas, įmokų lygis per paskutinius 12 mėn., atlyginimas, Sodros pensija) iki 65 metų, šiandienos eurais.
   Variantai: 1) Sodra + LB keliai – kaupimas pagal Sodros skaičiuoklės prielaidas ir Sodros pensija pagal Lietuvos banko kelius;
   2) tik kaupimas – Sodros pensija ateičiai nerodoma; 3) pagal fondų KID – laukiama savininko medžiagos.
   Šaltiniai: Sodros prognozuojamos pensijos skaičiuoklės metodika (2025-12-16): akcijos 7 %, obligacijos 3 % per metus, mokestis 0,5 %;
   EK 2024 m. „Ageing Report“: darbo našumo augimas Lietuvoje 2,1 % per metus (2022–2070); LB teminis straipsnis Nr. 60 (2026-06-18):
   Sodros pakeitimo norma ~47 % 2026 m. → ~33 % (galiojantis įstatymas) arba ~40 % (7 metų vidurkio taisyklė be sustabdymų) 2050 m. */
addStrings({
  futTitle: 'Future scenarios', futVar: 'Variant:', futV: { lb: 'Sodra + Bank of Lithuania paths', acc: 'Savings only', kid: 'Funds’ KID scenarios' },
  futLead: (y, n) => `From today to age 65 (${y}, in ${n} years), in today’s euros. Contributions continue at the current level; the wage grows with labour productivity.`,
  futRetired: 'This participant is already 65 or older – there is nothing left to project.',
  futKid: 'There are no KID scenarios for your fund yet (the bond index data is still being collected) – choose another variant.', futKidSrc: (a, b) => `Returns: the fund’s KID scenarios (unfavourable / moderate / favourable average annual return over the recommended holding period, after costs; see “Reports” → KID performance scenarios)${a ? ` – pillar II: ${a}` : ''}${b ? `; pillar III: ${b}` : ''}.`,
  futSc: ['Pessimistic', 'Medium', 'Optimistic'], futRow: { r: 'Real return per year (after fees and inflation)', v2: 'Pillar II assets at 65', v3: 'Pillar III assets at 65', a2: 'Sodra annuity from pillar II, € / month', a3: 'Pillar III payout, € / month', pen: 'Sodra pension, € / month', tot: 'Total, € / month', net: 'Net wage at 65, € / month', rr: 'Replacement rate (total ÷ net wage)', rrS: 'Sodra replacement rate' },
  futAss: 'Assumptions', futAssL: (c2, c3, r0) => [
    'Returns (Sodra calculator methodology): equities 7 %, bonds 3 % per year in the medium scenario; pessimistic 5 % and 2 %, optimistic 9 % and 4 % (our ±2 pp / ±1 pp assumption). Fee 0.5 % per year, inflation 2 % (ECB target) – all amounts in today’s euros.',
    'Equity share (our assumption, similar to life-cycle funds): 95 % until age 45, then gradually down to 25 % at 65. Pillar III: by fund type (equity 95 %, mixed 50 %, bond 10 %).',
    'Wage growth above inflation: 2.1 % per year (EC 2024 Ageing Report, labour productivity in Lithuania 2022–2070).',
    `Contributions: as in the last 12 months of the model – pillar II ${c2} of gross wage (including the state incentive)${c3 ? `, pillar III ${c3}` : ''}.`,
    `Sodra pension (variant 1): today’s replacement rate ${r0} changes like the Bank of Lithuania paths – from 47 % in 2026 to 33 % (pessimistic, current law) or 40 % (medium and optimistic, 7-year average indexation without suspensions) in 2050, unchanged after 2050.`,
    'Annuity: today’s Sodra standard annuity factor at 65; pillar III – assets ÷ 240 months (or 0 if taken at once). This is a projection, not a promise.'],
  futSrc: 'Sources: Sodra “Prognozuojamos pensijos skaičiuoklė” methodology (2025-12-16); European Commission 2024 Ageing Report; Bank of Lithuania thematic article No. 60 (2026-06-18, authors’ view).',
}, {
  futTitle: 'Ateities scenarijai', futVar: 'Variantas:', futV: { lb: 'Sodra + Lietuvos banko keliai', acc: 'Tik kaupimas', kid: 'Pagal fondų KID' },
  futLead: (y, n) => `Nuo šiandien iki 65 metų (${y} m., po ${n} m.), šiandienos eurais. Įmokos mokamos kaip dabar, atlyginimas auga kartu su darbo našumu.`,
  futRetired: 'Šiam dalyviui jau 65 ar daugiau metų – ateities kaupimo nebėra.',
  futKid: 'Jūsų fondui KID scenarijų dar nėra (renkami obligacijų indekso duomenys) – rinkitės kitą variantą.', futKidSrc: (a, b) => `Grąža – fondo KID scenarijai (nepalankus / nuosaikus / palankus: vidutinė metinė grąža per rekomenduojamą laikymo laikotarpį po išlaidų; žr. „Ataskaitos“ → KID veiklos rezultatų scenarijai)${a ? ` – II pakopa: ${a}` : ''}${b ? `; III pakopa: ${b}` : ''}.`,
  futSc: ['Pesimistinis', 'Vidutinis', 'Optimistinis'], futRow: { r: 'Reali metinė grąža (po mokesčių ir infliacijos)', v2: 'II pakopos turtas 65 m.', v3: 'III pakopos turtas 65 m.', a2: 'Sodros anuitetas iš II pakopos, € / mėn.', a3: 'III pakopos išmoka, € / mėn.', pen: 'Sodros pensija, € / mėn.', tot: 'Iš viso, € / mėn.', net: 'Neto atlyginimas 65 m., € / mėn.', rr: 'Pakeitimo norma (iš viso ÷ neto atlyginimas)', rrS: 'Sodros pakeitimo norma' },
  futAss: 'Prielaidos', futAssL: (c2, c3, r0) => [
    'Grąža (Sodros skaičiuoklės metodika): vidutiniame scenarijuje akcijos 7 %, obligacijos 3 % per metus; pesimistiniame 5 % ir 2 %, optimistiniame 9 % ir 4 % (mūsų prielaida ±2 p. p. / ±1 p. p.). Mokestis 0,5 % per metus, infliacija 2 % (ECB tikslas) – visos sumos šiandienos eurais.',
    'Akcijų dalis (mūsų prielaida, panaši į gyvenimo ciklo fondus): 95 % iki 45 metų, toliau tolygiai mažėja iki 25 % 65 metų. III pakopa – pagal fondo tipą (akcijų 95 %, mišrus 50 %, obligacijų 10 %).',
    'Atlyginimas virš infliacijos auga 2,1 % per metus (EK 2024 m. „Ageing Report“, Lietuvos darbo našumas 2022–2070).',
    `Įmokos – kaip per paskutinius 12 modelio mėnesių: II pakopa ${c2} bruto atlyginimo (su valstybės skatinamąja įmoka)${c3 ? `, III pakopa ${c3}` : ''}.`,
    `Sodros pensija (1 variantas): dabartinė pakeitimo norma ${r0} kinta kaip Lietuvos banko keliuose – nuo 47 % 2026 m. iki 33 % (pesimistinis, galiojantis įstatymas) arba 40 % (vidutinis ir optimistinis, indeksavimas pagal 7 metų vidurkį be sustabdymų) 2050 m., po 2050 m. nekinta.`,
    'Anuitetas – dabartinis Sodros standartinio anuiteto koeficientas 65 m.; III pakopa – turtas ÷ 240 mėn. (arba 0, jei atsiimama iš karto). Tai prognozė, ne pažadas.'],
  futSrc: 'Šaltiniai: Sodros „Prognozuojamos pensijos skaičiuoklės“ metodika (2025-12-16); Europos Komisijos 2024 m. „Ageing Report“; Lietuvos banko teminis straipsnis Nr. 60 (2026-06-18, autorių nuomonė).',
});
const FUT = {
  sc: [{ eq: 5, bd: 2, lb: 33 }, { eq: 7, bd: 3, lb: 40 }, { eq: 9, bd: 4, lb: 40 }],   // nominali grąža %, LB Sodros pakeitimo norma 2050 m. %
  fee: 0.5, infl: 2, wage: 2.1, lb0: [2026, 47], lb1: 2050,
  eq2: age => age <= 45 ? 0.95 : age >= 65 ? 0.25 : 0.95 - (age - 45) / 20 * 0.70,
  eq3: { equity: 0.95, mixed: 0.5, bond: 0.1 },
};
let futVar = 'lb';
try { const v = localStorage.getItem('futVar'); if (FUT_OK(v)) futVar = v; } catch (e) {}
function FUT_OK(v) { return v === 'lb' || v === 'acc' || v === 'kid'; }
function futRate(S) {                      // įmokos per paskutinius 12 mėn. ÷ bruto atlyginimas per tą laiką
  if (!S) return null;
  const end = S.last.d, rs = S.rows.filter(r => r.m && r.d > end - 365);
  const c = rs.reduce((s, r) => s + r.ct, 0), w = rs.reduce((s, r) => s + r.wage * r.m, 0);
  return w ? c / w : null;
}
function futProject(sc, S2, S3, P, kr) {        // kr – KID variantas: {r2, r3} nominali grąža po išlaidų, %
  const y0 = yearOf(P.asof), yR = P.birth + 65, n = yR - y0, w0 = wageAt(P.asof, P.pay, null), g = FUT.wage / 100;
  const real = eq => ((1 + (eq * sc.eq + (1 - eq) * sc.bd - FUT.fee) / 100) / (1 + FUT.infl / 100)) - 1;
  const c2 = futRate(S2), c3 = futRate(S3), cat3 = S3 ? p3Fund(P.fund3).cat : null;
  let v2 = S2 ? S2.last.val : 0, v3 = S3 ? S3.last.val : 0, rs = [];
  for (let t = 1; t <= n; t++) {
    const age = y0 + t - P.birth, wy = w0.g * Math.pow(1 + g, t) * 12;
    const kReal = r => (1 + r / 100) / (1 + FUT.infl / 100) - 1;
    const r2 = kr && kr.r2 != null ? kReal(kr.r2) : real(FUT.eq2(age)), r3 = kr && kr.r3 != null ? kReal(kr.r3) : real(FUT.eq3[cat3] ?? 0.5); rs.push(r2);
    if (S2) v2 = v2 * (1 + r2) + (c2 || 0) * wy * (1 + r2 / 2);
    if (S3) v3 = v3 * (1 + r3) + (c3 || 0) * wy * (1 + r3 / 2);
  }
  const net = (w0.n || 0) * Math.pow(1 + g, n), pen0 = byYear(J.pensions, y0, null), rr0 = pen0 && w0.n ? pen0 / w0.n : null;
  const lbAt = y => { const [ya, a] = FUT.lb0; if (y >= FUT.lb1) return sc.lb; return a + (sc.lb - a) * Math.max(0, y - ya) / (FUT.lb1 - ya); };
  const rrS = rr0 != null ? rr0 * lbAt(yR) / FUT.lb0[1] : null;
  const a2 = S2 ? annuityOf(v2, P) : 0, a3 = S3 ? (P.pay3 === 'lump' ? 0 : v3 / PAY3_N) : 0, pen = rrS != null ? rrS * net : null;
  const avgR = rs.length ? Math.pow(rs.reduce((p, r) => p * (1 + r), 1), 1 / rs.length) - 1 : null;
  return { yR, n, v2, v3, a2, a3, pen, net, rrS, avgR, c2, c3, rr0 };
}
function renderFuture() {
  const t = T(), box = document.getElementById('futBody'); if (!box) return;
  document.getElementById('futTitle').textContent = t.futTitle;
  const opts = Object.entries(t.futV).map(([k, l]) => `<option value="${k}"${k === futVar ? ' selected' : ''}>${l}</option>`).join('');
  let h = `<div class="bar" style="margin-bottom:8px"><label class="field">${t.futVar} <select id="futSel">${opts}</select></label></div>`;
  const y0 = yearOf(P.asof), yR = P.birth + 65;
  if (yR <= y0) h += `<p class="note">${t.futRetired}</p>`;
  const S2 = P.pl === 'III' ? null : P.pl === 'both' ? SIM.parts[0] : SIM, S3 = P.pl === 'II' ? null : P.pl === 'both' ? SIM.parts[1] : SIM;
  const K = (typeof JDATA !== 'undefined' && JDATA.kid) || {}, kid = futVar === 'kid';
  const k2 = S2 ? K[`${P.mgr}|${groupOf(P.birth)}`] : null, k3 = S3 ? K[`III|${p3Fund(P.fund3).name}`] : null;
  if (yR <= y0) {}
  else if (kid && ((S2 && !k2) || (S3 && !k3))) h += `<p class="note">${t.futKid}</p>`;
  else {
    const R = FUT.sc.map((sc, i) => futProject(sc, S2, S3, P, kid ? { r2: k2 && k2[i + 1], r3: k3 && k3[i + 1] } : null)), lb = futVar === 'lb', e0 = x => eur(x, 0), e2 = x => eur(x, 2);
    const row = (l, f, show = true) => show ? `<tr><td class="l">${l}</td>${R.map(r => `<td>${f(r)}</td>`).join('')}</tr>` : '';
    h += `<p class="lead" style="margin:0 0 8px">${t.futLead(yR, yR - y0)}</p><div class="scroll"><table class="jt"><thead><tr><th class="l"></th>${t.futSc.map(s => `<th>${s}</th>`).join('')}</tr></thead><tbody>`
      + row(t.futRow.r, r => r.avgR == null ? '–' : pc(r.avgR), !!S2)
      + row(t.futRow.v2, r => e0(r.v2), !!S2) + row(t.futRow.v3, r => e0(r.v3), !!S3)
      + row(t.futRow.a2, r => e2(r.a2), !!S2) + row(t.futRow.a3, r => e2(r.a3), !!S3)
      + row(t.futRow.pen, r => r.pen == null ? '–' : e2(r.pen), lb) + row(t.futRow.rrS, r => r.rrS == null ? '–' : pc(r.rrS), lb)
      + row(`<b>${t.futRow.tot}</b>`, r => `<b>${e2((lb ? r.pen || 0 : 0) + r.a2 + r.a3)}</b>`)
      + row(t.futRow.net, r => e2(r.net)) + row(t.futRow.rr, r => r.net ? pc(((lb ? r.pen || 0 : 0) + r.a2 + r.a3) / r.net) : '–')
      + '</tbody></table></div>';
    const r1 = R[1];
    h += `<h3 style="margin:14px 0 6px;font-size:15px">${t.futAss}</h3><ul class="note" style="margin:0;padding-left:18px">${((L, kf) => kid ? [t.futKidSrc(kf(k2), kf(k3)), ...L.slice(2)] : L)(t.futAssL(r1.c2 != null ? pc(r1.c2, 2) : '–', r1.c3 != null ? pc(r1.c3, 2) : '', r1.rr0 != null ? pc(r1.rr0) : '–').filter((_, i) => lb || i !== 4), k => k ? `${k.slice(1).map(v => num(v, 2)).join(' / ')}${pctSfx()} (RHP ${k[0]})` : '').map(x => `<li>${x}</li>`).join('')}</ul><p class="note">${t.futSrc}</p>`;
  }
  box.innerHTML = h;
  document.getElementById('futSel').addEventListener('change', e => { futVar = e.target.value; try { localStorage.setItem('futVar', futVar); } catch (x) {} renderFuture(); });
}
if (typeof SIM !== 'undefined' && SIM) renderFuture();
