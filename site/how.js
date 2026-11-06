/* „Kaip tai veikia“ (savininkas 2026-11-06): interaktyvi visų duomenų gijų schema pristatymams –
   šaltiniai → rinkimas → duomenų failai → apdorojimas → svetainė ir laiškai; kur dirba kodas be AI, kur – Claude (AI), kur – žmogus.
   Schema – ranka aprašyta (NODES, EDGES). Pridėjus naują šaltinį ar puslapį – papildyti čia. */
const $ = id => document.getElementById(id);
addStrings({ navHow: 'How it works' }, { navHow: 'Kaip tai veikia' });

// rūšys: ext – išorinis šaltinis, code – kodas be AI (automatiškai), ai – Claude (AI) sesija, man – žmogus, out – rezultatas
const KINDS = { ext: ['Išorinis šaltinis', 'External source', 'ŠALTINIS', 'SOURCE'], code: ['Kodas be AI (automatiškai)', 'Code, no AI (automatic)', 'KODAS', 'CODE'],
  ai: ['Claude (AI)', 'Claude (AI)', 'AI', 'AI'], man: ['Žmogus (rankinis)', 'Human (manual)', 'RANKA', 'MANUAL'], out: ['Ką mato vartotojas', 'What the user sees', 'REZULTATAS', 'OUTPUT'] };
// gijos (temos), kurias galima paryškinti
const THREADS = [['II', 'II pakopa', 'Pillar II'], ['III', 'III pakopa', 'Pillar III'], ['pf', 'Portfeliai', 'Portfolios'], ['mac', 'Rinkos ir makro duomenys', 'Markets & macro'],
  ['bx', 'Baltijos šalys', 'Baltic states'], ['nw', 'Naujienos ir Seimas', 'News & Parliament'], ['ops', 'Priežiūra ir kokybė', 'Monitoring & quality']];
const COLS = [['Šaltiniai', 'Sources'], ['Rinkimas', 'Collection'], ['Duomenų failai', 'Data files'], ['Apdorojimas', 'Processing'], ['Svetainė ir laiškai', 'Site & e-mails']];
/* [id, stulpelis, rūšis, gijos, LT pavadinimas, LT trumpai, EN pavadinimas, EN trumpai, dažnumas LT, dažnumas EN, failai, LT plačiau, EN plačiau] */
const NODES = [
  ['s_mgr', 0, 'ext', 'II III', 'Valdytojų svetainės ir API', 'SEB, Swedbank, Luminor, Artea, Allianz, Goindex', 'Managers’ websites & APIs', 'SEB, Swedbank, Luminor, Artea, Allianz, Goindex',
    'kasdien', 'daily', '', 'Kiekvieną darbo dieną valdytojai skelbia fondų vieneto vertes ir grynuosius aktyvus. Tai pagrindinis viso įrankio šaltinis: iš jo skaičiuojamos grąžos, rizika, vietos grupėse.', 'Every business day managers publish unit values and net assets. This is the core source: returns, risk and ranks are computed from it.'],
  ['s_lb', 0, 'ext', 'II III pf', 'Lietuvos bankas', 'Ketvirčio portfeliai, rezultatai, mokesčiai', 'Bank of Lithuania', 'Quarterly portfolios, results, fees',
    'kas ketvirtį (~2 mėn. vėliau)', 'quarterly (~2 months later)', '', 'LB skelbia kiekvieno fondo investicijų sąrašą, dalyvius, turtą, grąžas ir mokesčius. Iš čia – portfeliai, Rinkos faktai, valdytojų rinkos dalys ir istorija nuo 2015 m.', 'The central bank publishes each fund’s holdings, members, assets, returns and fees. Portfolios, market facts, market shares and history since 2015 come from here.'],
  ['s_sec', 0, 'ext', 'pf', 'Vertybinių popierių registrai', 'ISIN pavadinimai, obligacijų sąlygos (ESMA FIRDS, OpenFIGI)', 'Securities registers', 'ISIN names, bond terms (ESMA FIRDS, OpenFIGI)',
    'kasdien, tik nauji ISIN', 'daily, new ISINs only', '', 'LB failuose investicijos nurodytos kodais. Registrai suteikia pavadinimus, obligacijų išpirkimo datas ir kuponus – iš jų skaičiuojamas pajamingumas (YTM).', 'Holdings come as codes. Registers add names, maturities and coupons, used to compute bond yields (YTM).'],
  ['s_ms', 0, 'ext', 'pf', 'Morningstar', 'ETF ir fondų vidus: sektoriai, regionai, pozicijos', 'Morningstar', 'Inside ETFs and funds: sectors, regions, holdings',
    'kas ketvirtį', 'quarterly', '', 'Apie 70 % pensijų fondų turto – ETF ir kiti fondai. Morningstar parodo, kas yra jų viduje, todėl matome tikrą fondų sudėtį „pro fondus“. Prieiga – tik per Claude.', 'About 70% of assets sit in ETFs and funds. Morningstar shows what is inside them, giving the true look-through composition. Accessible only through Claude.'],
  ['s_mac', 0, 'ext', 'mac II III', 'Rinkos ir statistika', 'MSCI, S&P 500, €STR (ECB), VKI, atlyginimai, pensijos', 'Markets & statistics', 'MSCI, S&P 500, €STR (ECB), CPI, wages, pensions',
    'kasdien / kas mėnesį', 'daily / monthly', '', 'Palyginimui ir realiai grąžai: pasaulio akcijų indeksai, nerizikinga palūkanų norma (Sharpe rodikliui), infliacija, vidutinis atlyginimas ir pensija (Kelias į pensiją).', 'For comparison and real returns: world equity indexes, the risk-free rate (Sharpe), inflation, average wage and pension (Retirement path).'],
  ['s_bx', 0, 'ext', 'bx', 'Latvija ir Estija', 'manapensija.lv, pensionikeskus.ee, Latvijas Banka, Eurostat', 'Latvia & Estonia', 'manapensija.lv, pensionikeskus.ee, Latvijas Banka, Eurostat',
    'kasdien', 'daily', '', 'Kaimyninių šalių fondų vieneto vertės, ketvirčio ataskaitos (PDF), didžiausios investicijos, rinkos suma ir infliacija – kad Baltijos palyginimas būtų tokios pat kokybės kaip Lietuvos.', 'Neighbouring countries’ unit values, quarterly PDF reports, top holdings, market totals and inflation – so the Baltic view matches Lithuania’s quality.'],
  ['s_nw', 0, 'ext', 'nw', 'Naujienos ir Seimas', 'Google News, leidinių RSS, Seimo atviri duomenys', 'News & Parliament', 'Google News, publishers’ RSS, Seimas open data',
    'kasdien', 'daily', '', 'Straipsniai apie pensijas iš LT, LV ir EE leidinių bei Seimo darbotvarkių pensijų klausimai.', 'Pension articles from LT, LV and EE media and pension items on the Seimas agenda.'],
  ['s_own', 0, 'man', 'II III', 'Savininko failai', 'Istorija, valdytojų pusmečio ataskaitos, KID', 'Owner’s files', 'History, managers’ half-year reports, KID',
    'pagal poreikį', 'as needed', '', 'Kai duomenų negalima gauti automatiškai (sena istorija, PDF ataskaitos), savininkas juos įkelia, o Claude vieną kartą importuoja. Istoriniai duomenys niekada neperrašomi – tik papildomi tušti laukai.', 'When data can’t be fetched automatically (old history, PDF reports) the owner uploads it and Claude imports it once. History is never overwritten – only empty fields are filled.'],

  ['c_nav', 1, 'code', 'II', 'II pakopos rinkikliai', 'update.py + sources/*.py; naršyklė SEB, Swedbank, Luminor', 'Pillar II collectors', 'update.py + sources/*.py; browser for SEB, Swedbank, Luminor',
    'darbo dienomis kas 30 min. 13–19 val.', 'weekdays every 30 min 13–19h', 'update.py, sources/, store.py', 'Kiekvienam valdytojui – savas skaitytuvas. Kur svetainė be API, naudojama automatinė naršyklė (Playwright); Luminor – per mokamą tarpinį serverį (proxy, ~10 € už 3 mėn.), nes jo svetainė blokuoja serverių užklausas. Nauja reikšmė įrašoma tik jei ji šviežia ir įtikėtina.', 'One reader per manager. Where there is no API an automated browser (Playwright) is used; Luminor goes through a paid proxy (~€10 per 3 months) because its site blocks server requests. A value is stored only if fresh and plausible.'],
  ['c_p3', 1, 'code', 'III', 'III pakopos rinkikliai', 'pillar3.py: 22 fondai, API ir naršyklė', 'Pillar III collectors', 'pillar3.py: 22 funds, API and browser',
    'kartu su II pakopa', 'together with pillar II', 'pillar3.py', 'Tas pats principas kaip II pakopai: lengvi šaltiniai per API, sunkesni – per naršyklę.', 'Same approach as pillar II: light sources via API, harder ones via browser.'],
  ['c_lb', 1, 'code', 'II III pf', 'LB failų parsisiuntimas', 'tools/fetch_lb.py, lb_history.py, portfolios.py', 'BoL file download', 'tools/fetch_lb.py, lb_history.py, portfolios.py',
    'kasdien tikrina, ar yra naujų', 'checks daily for new files', 'tools/fetch_lb.py', 'Kasdien tikrinama, ar LB įkėlė naujus ketvirčio failus; atsiradus – parsisiunčiami ir išskaidomi į portfelių bei rezultatų lenteles.', 'Checks daily whether the central bank posted new quarterly files; new ones are downloaded and parsed.'],
  ['c_sec', 1, 'code', 'pf', 'ISIN ir obligacijų sąlygos', 'fetch_isin_names.py, fetch_security_terms.py', 'ISIN & bond terms', 'fetch_isin_names.py, fetch_security_terms.py',
    'kasdien, tik nauji', 'daily, new only', 'tools/', 'Užklausiami tik dar nežinomi kodai, todėl darbas trunka sekundes.', 'Only unknown codes are queried, so it takes seconds.'],
  ['c_ms', 1, 'ai', 'pf', 'Morningstar procedūra', 'Claude kas ketvirtį: ETF sąrašas → profiliai → sudėtys', 'Morningstar procedure', 'Claude each quarter: ETF list → profiles → holdings',
    'kas ketvirtį (priminimas laiške)', 'quarterly (e-mail reminder)', 'MORNINGSTAR.md, tools/ms_*.py', 'Vienintelė vieta, kur duomenis renka AI: Morningstar įrankis veikia tik Claude sesijoje. Claude pagal aprašytą procedūrą surenka duomenis, o skaičiuoja jau įprastas kodas. Žali duomenys laikomi privačiai, viešai – tik apskaičiuoti rodikliai.', 'The only place where AI collects data: the Morningstar tool works only inside a Claude session. Claude follows a written procedure; ordinary code does the maths. Raw data stays private, only derived figures are public.'],
  ['c_mac', 1, 'code', 'mac', 'Rinkų ir statistikos rinkikliai', 'indexes.py, riskfree.py, fetch_cpi/wages/pension.py', 'Market & statistics collectors', 'indexes.py, riskfree.py, fetch_cpi/wages/pension.py',
    'kasdien', 'daily', 'tools/', 'Atnaujina indeksus, €STR ir oficialią statistiką; nauji duomenys tik papildo esamus.', 'Updates indexes, €STR and official statistics; new data only appends.'],
  ['c_bx', 1, 'code', 'bx', 'Baltijos rinkikliai', 'fetch_baltic.py, fetch_lv_reports.py (PDF), fetch_ee_reports.py …', 'Baltic collectors', 'fetch_baltic.py, fetch_lv_reports.py (PDF), fetch_ee_reports.py …',
    'kasdien', 'daily', 'tools/fetch_*.py', 'Latvijos ataskaitos skaitomos iš PDF, Latvijos rinkos suma – iš centrinio banko lentelės per naršyklę, Estijos 10 didžiausių investicijų – iš mėnesio ataskaitų.', 'Latvian reports are read from PDFs, the Latvian market total from the central bank table via browser, Estonian top-10 holdings from monthly reports.'],
  ['c_nw', 1, 'code', 'nw', 'Naujienų rinkiklis', 'fetch_news.py, fetch_seimas.py (be AI)', 'News collector', 'fetch_news.py, fetch_seimas.py (no AI)',
    'kasdien', 'daily', 'tools/fetch_news.py', 'Straipsniai atrenkami pagal raktažodžius, aprašas paimamas iš paties straipsnio – be AI santraukų (savininko sprendimas: jokių AI kaštų).', 'Articles are selected by keywords; the summary is taken from the article itself – no AI summaries (owner’s decision: no AI costs).'],
  ['c_imp', 1, 'ai', 'II III', 'Vienkartiniai importai', 'Claude paruošia import_*.py, backfill_*.py', 'One-off imports', 'Claude writes import_*.py, backfill_*.py',
    'pagal poreikį', 'as needed', 'import_*.py', 'Claude parašo importo skriptą, patikrina rezultatą su šaltiniu ir paleidžia vieną kartą. Toliau duomenys gyvena kaip įprasti failai.', 'Claude writes an import script, checks the result against the source and runs it once.'],

  ['d_nav', 2, 'code', 'II', 'II pakopos istorija', 'data/nav_history.csv', 'Pillar II history', 'data/nav_history.csv', '', '', 'data/nav_history.csv', 'Kiekvieno fondo kiekvienos dienos vieneto vertė ir turtas nuo 2019 m. (dalis – nuo fondų pradžios).', 'Every fund’s daily unit value and assets since 2019 (some since inception).'],
  ['d_p3', 2, 'code', 'III', 'III pakopos istorija', 'data/pillar3_history.csv', 'Pillar III history', 'data/pillar3_history.csv', '', '', 'data/pillar3_history.csv', 'III pakopos fondų vieneto vertės, kur įmanoma – nuo fondo pradžios (nuo 2004 m.).', 'Pillar III unit values, where possible since inception (from 2004).'],
  ['d_lb', 2, 'code', 'II III pf', 'LB portfeliai ir rezultatai', 'portfolios.csv, lb_results_history.csv', 'BoL portfolios & results', 'portfolios.csv, lb_results_history.csv', '', '', 'data/portfolios.csv', 'Visos fondų investicijos kiekvieno ketvirčio pabaigoje nuo 2019 m. ir LB rezultatų istorija nuo 2015 m.', 'All holdings at each quarter end since 2019 and BoL results history since 2015.'],
  ['d_pf', 2, 'code', 'pf', 'Investicijų požymiai', 'security_*.csv, lookthrough.csv, etf_profiles.csv', 'Holding attributes', 'security_*.csv, lookthrough.csv, etf_profiles.csv', '', '', 'data/lookthrough.csv', 'Pavadinimai, obligacijų sąlygos ir „pro fondus“ rodikliai: sektoriai, regionai, trukmė, kredito kokybė.', 'Names, bond terms and look-through figures: sectors, regions, duration, credit quality.'],
  ['d_mac', 2, 'code', 'mac', 'Rinkos ir makro', 'indexes.csv, cpi, wages, rf …', 'Markets & macro', 'indexes.csv, cpi, wages, rf …', '', '', 'data/', 'Indeksai, infliacija, atlyginimai, pensijos, nerizikinga norma.', 'Indexes, inflation, wages, pensions, risk-free rate.'],
  ['d_bx', 2, 'code', 'bx', 'Baltijos duomenys', 'baltic_*.csv, lv_reports.csv, ee_holdings.csv', 'Baltic data', 'baltic_*.csv, lv_reports.csv, ee_holdings.csv', '', '', 'data/baltic_*.csv', 'Latvijos ir Estijos fondų istorija, ataskaitų turtas ir didžiausios investicijos.', 'Latvian and Estonian fund history, report assets and top holdings.'],
  ['d_nw', 2, 'code', 'nw', 'Naujienos', 'news.csv, seimas.csv', 'News', 'news.csv, seimas.csv', '', '', 'data/news.csv', 'Straipsnių ir Seimo klausimų archyvas (tik papildomas).', 'Archive of articles and Seimas items (append-only).'],
  ['d_ops', 2, 'code', 'ops', 'Būsena ir žurnalas', 'source_status.json, ops_log.csv', 'Status & log', 'source_status.json, ops_log.csv', '', '', 'data/ops_log.csv', 'Kas atkeliavo, kas vėluoja, kas nepavyko – kiekvienam šaltiniui.', 'What arrived, what is late, what failed – per source.'],

  ['b_build', 3, 'code', 'II III pf mac bx nw', 'Svetainės generatorius', 'build_site.py + aum, reports, market, baltic … .py', 'Site generator', 'build_site.py + aum, reports, market, baltic … .py',
    'po kiekvieno rinkimo, jei pasikeitė duomenys', 'after each run if data changed', 'build_site.py', 'Iš duomenų failų paruošia svetainės duomenų rinkinius: grąžas, vietas, turto pokyčius, faktus su Excel formulėmis, Baltijos palyginimus. Skaičiavimai sutikrinti su LB ir valdytojų ataskaitomis.', 'Turns data files into the site’s datasets: returns, ranks, asset changes, facts with Excel formulas, Baltic comparisons. Calculations are checked against BoL and manager reports.'],
  ['b_test', 3, 'code', 'ops', 'Svetainės patikra', 'smoke_test.py: atidaro visus puslapius', 'Site check', 'smoke_test.py: opens every page',
    'po kiekvieno generavimo', 'after each build', 'tools/smoke_test.py', 'Automatinė naršyklė atidaro kiekvieną puslapį ir tikrina, ar nėra klaidų ir tuščių lentelių. Rezultatas patenka į vakarinį laišką.', 'An automated browser opens every page and checks for errors and empty tables. The result goes into the evening e-mail.'],
  ['b_dev', 3, 'ai', 'II III pf mac bx nw ops', 'Claude: kūrimas ir auditai', 'naujos funkcijos, klaidų taisymas, patikra', 'Claude: development & audits', 'new features, fixes, checks',
    'kai savininkas paprašo', 'when the owner asks', 'CLAUDE.md, IDEAS.md', 'Claude rašo ir taiso kodą, tikrina skaičiavimus su ataskaitomis ir prieš paskelbdamas sugeneruoja bei atidaro svetainę. Pats kasdienis darbas vyksta be AI – kodas veikia ir be Claude.', 'Claude writes and fixes code, checks numbers against reports, and builds and opens the site before publishing. The daily work itself runs without AI – the code works without Claude.'],

  ['o_lt', 4, 'out', 'II III mac', 'Rezultatai ir rinka', 'Pradžia, Rinkos faktai, Rezultatai (II ir III), Valdytojai', 'Results & market', 'Home, Market facts, Results (II & III), Managers', '', '', 'index, facts, performance(3), managers', 'Grąža, rizika, vietos grupėse, rinkos faktai su šaltiniais ir Excel.', 'Returns, risk, ranks, market facts with sources and Excel.'],
  ['o_pf', 4, 'out', 'pf II III', 'Portfeliai ir turtas', 'Investicijos, pokyčiai, „pro fondus“, turtas', 'Portfolios & assets', 'Holdings, changes, look-through, assets', '', '', 'portfolios, aum', 'Kur investuoja fondai, kas pasikeitė per ketvirtį ir kaip keitėsi turtas.', 'Where funds invest, what changed in the quarter and how assets moved.'],
  ['o_rep', 4, 'out', 'II III', 'Ataskaitos ir Kelias į pensiją', 'KID scenarijai, pusmečio lentelės, skaičiuoklės', 'Reports & retirement path', 'KID scenarios, half-year tables, calculators', '', '', 'reports, journey', 'Valdytojų ataskaitų patikra (dvi versijos: kaip valdytojo ir pagal reglamentą) ir asmeninės pensijos skaičiavimai.', 'Checks of manager reports (two versions: as published and per regulation) and personal pension calculations.'],
  ['o_bx', 4, 'out', 'bx', 'Baltijos šalys', 'LT, LV, EE tais pačiais skirtukais', 'Baltic states', 'LT, LV, EE with the same tabs', '', '', 'baltic', 'Kiekviena šalis ir pakopa – tie patys vaizdai; šalių palyginimas tik panašios rizikos fondų.', 'Each country and pillar gets the same views; cross-country only for similar-risk funds.'],
  ['o_nw', 4, 'out', 'nw', 'Naujienos', 'Įžvalgos, temų banga, Seimas', 'News', 'Insights, topic waves, Seimas', '', '', 'index#tab=nw', 'Kas ir kada kalba apie pensijas.', 'Who talks about pensions and when.'],
  ['o_mail', 4, 'out', 'ops II III nw', 'Vakarinis laiškas', 'Ar reikia veiksmo, rinka per dieną, naujienos, būklė', 'Evening e-mail', 'Action needed?, market today, news, status', 'kasdien vakare', 'every evening', 'daily_report.py', 'Vienas laiškas savininkui (daily_report.py + report_market.py): pirmoje eilutėje – ar reikia jūsų veiksmo; toliau II ir III pakopos dienos ir metų pokytis, vietų pokyčiai, neįprasti judesiai, naujienos, Seimas, laukiami duomenys; penktadienį – savaitė, mėnesio pradžioje – mėnuo; techninė būklė – viena eilutė, kai viskas gerai.', 'One e-mail to the owner: first line – is action needed; then pillar II and III daily and YTD moves, rank changes, unusual moves, news, Parliament, expected data; weekly on Fridays, monthly at month start; status in one line when all is fine.'],
  ['o_ops', 4, 'out', 'ops', 'Duomenų kalendorius', 'Kas atkeliavo ir ko laukiama', 'Data calendar', 'What arrived and what is due', '', '', 'ops', 'Kiekvieno šaltinio įvykiai kalendoriuje ir laukiamos datos.', 'Each source’s events on a calendar and expected dates.'],
];
const EDGES = [
  ['s_mgr', 'c_nav'], ['s_mgr', 'c_p3'], ['s_own', 'c_imp'], ['s_lb', 'c_lb'], ['s_sec', 'c_sec'], ['s_ms', 'c_ms'], ['s_mac', 'c_mac'], ['s_bx', 'c_bx'], ['s_nw', 'c_nw'],
  ['c_nav', 'd_nav'], ['c_p3', 'd_p3'], ['c_imp', 'd_nav'], ['c_imp', 'd_p3'], ['c_lb', 'd_lb'], ['c_sec', 'd_pf'], ['c_ms', 'd_pf'], ['c_mac', 'd_mac'], ['c_bx', 'd_bx'], ['c_nw', 'd_nw'],
  ['c_nav', 'd_ops'], ['c_p3', 'd_ops'], ['c_lb', 'd_ops'], ['c_bx', 'd_ops'],
  ['d_nav', 'b_build'], ['d_p3', 'b_build'], ['d_lb', 'b_build'], ['d_pf', 'b_build'], ['d_mac', 'b_build'], ['d_bx', 'b_build'], ['d_nw', 'b_build'], ['d_ops', 'b_build'],
  ['b_build', 'b_test'], ['b_dev', 'b_build'],
  ['b_build', 'o_lt'], ['b_build', 'o_pf'], ['b_build', 'o_rep'], ['b_build', 'o_bx'], ['b_build', 'o_nw'], ['b_build', 'o_ops'],
  ['b_test', 'o_mail'], ['d_ops', 'o_mail'], ['d_nav', 'o_mail'], ['d_p3', 'o_mail'], ['d_nw', 'o_mail'],
];
// pristatymo režimas: žingsniai po vieną giją
const STORY = [
  ['', 'Visa schema: kairėje – iš kur ateina duomenys, dešinėje – ką mato vartotojas. Spalva rodo, kas dirba: žalia – kodas be AI, violetinė – Claude (AI), oranžinė – žmogus. Paspauskite bet kurią kortelę, kad pamatytumėte jos gijas.', 'The whole map: left – where data comes from, right – what the user sees. Colour shows who does the work: green – code without AI, purple – Claude (AI), orange – a human. Click any card to see its threads.'],
  ['II', 'II pakopa: valdytojai kasdien skelbia vieneto vertes → rinkikliai jas paima kas 30 min. → įrašoma į istoriją → generatorius perskaičiuoja grąžas ir vietas → svetainė atsinaujina tą pačią dieną.', 'Pillar II: managers publish unit values daily → collectors fetch them every 30 min → stored in history → the generator recomputes returns and ranks → the site updates the same day.'],
  ['III', 'III pakopa: tas pats kelias kaip II pakopai, tik 22 fondai lyginami kategorijose (obligacijų, mišraus, akcijų), o istorija siekia 2004 m.', 'Pillar III: the same path as pillar II, but 22 funds are compared within categories (bond, mixed, equity) and history goes back to 2004.'],
  ['pf', 'Portfeliai: LB kas ketvirtį paskelbia visas investicijas → kodas jas parsisiunčia ir papildo registrų duomenimis → Claude kas ketvirtį per Morningstar pažiūri ETF vidų → matome tikrą sudėtį.', 'Portfolios: the central bank publishes all holdings quarterly → code downloads them and adds register data → each quarter Claude looks inside ETFs via Morningstar → we see the true composition.'],
  ['mac', 'Rinkos ir makro: indeksai, infliacija, atlyginimai ir pensijos leidžia skaičiuoti realią grąžą, Sharpe rodiklį ir būsimos pensijos scenarijus.', 'Markets & macro: indexes, inflation, wages and pensions make real returns, Sharpe ratios and future pension scenarios possible.'],
  ['bx', 'Baltijos šalys: Latvijos ir Estijos duomenys renkami tais pačiais principais, todėl kiekviena šalis turi tuos pačius vaizdus.', 'Baltic states: Latvian and Estonian data are collected the same way, so every country gets the same views.'],
  ['nw', 'Naujienos: kasdien surenkami straipsniai ir Seimo klausimai – be AI santraukų, todėl nėra jokių papildomų kaštų.', 'News: articles and Seimas items are collected daily – no AI summaries, so no extra costs.'],
  ['ops', 'Priežiūra: kiekvienas paleidimas įrašo, kas pavyko; svetainė automatiškai patikrinama; vakare savininkas gauna vieną laišką su būkle ir, jei reikia, aiškiais žingsniais.', 'Monitoring: every run logs what worked; the site is checked automatically; in the evening the owner gets one e-mail with the status and, if needed, clear steps.'],
];
let SEL = null, THR = '', STEP = 0;
const L = () => lang === 'lt';
const node = id => NODES.find(n => n[0] === id);
function lineage(id) {                       // visi aukštyn ir žemyn sujungti mazgai
  const up = new Set([id]), dn = new Set([id]);
  let ch = true; while (ch) { ch = false; EDGES.forEach(([a, b]) => { if (up.has(b) && !up.has(a) && a !== 'b_dev') { up.add(a); ch = true; } if (dn.has(a) && !dn.has(b)) { dn.add(b); ch = true; } }); }
  return new Set([...up, ...dn]);
}
function activeSet() {
  if (SEL) return lineage(SEL);
  if (THR) return new Set(NODES.filter(n => n[3].split(' ').includes(THR)).map(n => n[0]));
  return null;
}
function render() {
  const l = L(), t = (lt, en) => l ? lt : en;
  $('lead').textContent = t('Šis puslapis parodo, kaip veikia visas įrankis: iš kur ateina kiekvienas skaičius, kas jį surenka ir apdoroja, kur dirba kodas be dirbtinio intelekto, kur – Claude (AI), o kur reikia žmogaus. Tinka pristatymui: spauskite korteles arba „Toliau“.',
    'This page shows how the whole tool works: where each number comes from, who collects and processes it, where code runs without AI, where Claude (AI) helps and where a human is needed. Made for presentations: click cards or “Next”.');
  const nSrc = NODES.filter(n => n[1] === 0).length, nCode = NODES.filter(n => n[2] === 'code' && n[1] === 1).length;
  $('kpis').innerHTML = [[nSrc, t('šaltinių grupių', 'source groups')], [nCode, t('automatinių rinkiklių', 'automatic collectors')], ['~3,3 €', t('per mėn. proxy + Claude Pro prenumerata', 'a month for the proxy + Claude Pro subscription')], ['~12×', t('paleidimų per darbo dieną', 'runs per business day')]]
    .map(([v, s]) => `<div class="k"><b>${v}</b><span>${s}</span></div>`).join('');
  $('hFlow').textContent = t('Duomenų gijos', 'Data threads');
  $('threads').innerHTML = `<span class="lbl">${t('Gija:', 'Thread:')}</span>` + [['', t('Visos', 'All')], ...THREADS.map(([k, a, b]) => [k, l ? a : b])]
    .map(([k, s]) => `<button type="button" class="chipb" data-t="${k}" aria-pressed="${THR === k && !SEL}">${s}</button>`).join('');
  $('kinds').innerHTML = `<span class="lbl">${t('Kas dirba:', 'Who does it:')}</span>` + Object.entries(KINDS).map(([k, v]) => `<span class="chipb k-${k}" style="cursor:default"><span class="dot" style="background:var(--kc)"></span>${l ? v[0] : v[1]}</span>`).join('');
  const fl = $('flow'); fl.querySelectorAll('.col').forEach(c => c.remove());
  COLS.forEach((c, i) => { const col = document.createElement('div'); col.className = 'col';
    col.innerHTML = `<h3>${l ? c[0] : c[1]}</h3>` + NODES.filter(n => n[1] === i).map(n => `<button type="button" class="nd k-${n[2]}" data-id="${n[0]}"><span class="bd">${KINDS[n[2]][l ? 2 : 3]}</span><b>${l ? n[4] : n[6]}</b><small>${l ? n[5] : n[7]}</small></button>`).join('');
    fl.append(col); });
  fl.querySelectorAll('.nd').forEach(b => b.onclick = () => { SEL = SEL === b.dataset.id ? null : b.dataset.id; paint(); });
  $('threads').querySelectorAll('button').forEach(b => b.onclick = () => { THR = b.dataset.t; SEL = null; STEP = Math.max(0, STORY.findIndex(s => s[0] === THR)); paint(); });
  renderStory(); renderDay(); renderAi(); paint();
}
function renderStory() {
  const l = L(), s = STORY[STEP];
  $('story').innerHTML = `<span class="n">${STEP + 1} / ${STORY.length}</span><p>${l ? s[1] : s[2]}</p><button type="button" class="btn" id="stP"${STEP ? '' : ' disabled'}>← ${l ? 'Atgal' : 'Back'}</button><button type="button" class="btn" id="stN"${STEP < STORY.length - 1 ? '' : ' disabled'}>${l ? 'Toliau' : 'Next'} →</button>`;
  const go = d => { STEP = Math.min(STORY.length - 1, Math.max(0, STEP + d)); THR = STORY[STEP][0]; SEL = null; paint(); };
  $('stP').onclick = () => go(-1); $('stN').onclick = () => go(1);
}
function paint() {
  const on = activeSet(), fl = $('flow'), l = L();
  fl.classList.toggle('sel', !!on);
  fl.querySelectorAll('.nd').forEach(b => { b.classList.toggle('on', !!on && on.has(b.dataset.id)); b.classList.toggle('cur', b.dataset.id === SEL); b.setAttribute('aria-pressed', b.dataset.id === SEL); });
  $('threads').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(!SEL && THR === b.dataset.t)));
  renderStory(); wires(on);
  const d = $('det');
  if (!SEL) { d.innerHTML = `<p class="hint">${l ? 'Paspauskite kortelę – čia matysite, ką ji daro, kaip dažnai ir kuriuose failuose. Paryškės visos su ja susijusios gijos.' : 'Click a card to see what it does, how often and in which files. All its threads will light up.'}</p>`; return; }
  const n = node(SEL), k = KINDS[n[2]];
  const up = EDGES.filter(e => e[1] === SEL).map(e => l ? node(e[0])[4] : node(e[0])[6]), dn = EDGES.filter(e => e[0] === SEL).map(e => l ? node(e[1])[4] : node(e[1])[6]);
  d.innerHTML = `<h3>${l ? n[4] : n[6]}</h3><p>${l ? n[11] : n[12]}</p><dl>`
    + `<dt>${l ? 'Kas dirba' : 'Who'}</dt><dd><span class="dot k-${n[2]}" style="background:var(--kc)"></span> ${l ? k[0] : k[1]}</dd>`
    + (n[8] ? `<dt>${l ? 'Kaip dažnai' : 'How often'}</dt><dd>${l ? n[8] : n[9]}</dd>` : '')
    + (n[10] ? `<dt>${l ? 'Failai' : 'Files'}</dt><dd><code>${hEsc(n[10])}</code></dd>` : '')
    + (up.length ? `<dt>${l ? 'Gauna iš' : 'Gets from'}</dt><dd>${up.join(', ')}</dd>` : '')
    + (dn.length ? `<dt>${l ? 'Perduoda į' : 'Feeds'}</dt><dd>${dn.join(', ')}</dd>` : '') + '</dl>';
}
function wires(on) {
  const svg = $('wires'), fl = $('flow'); if (getComputedStyle(svg).display === 'none') return;
  const R = fl.getBoundingClientRect(); svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
  const box = id => { const e = fl.querySelector(`.nd[data-id="${id}"]`); if (!e) return null; const r = e.getBoundingClientRect(); return { l: r.left - R.left, r: r.right - R.left, y: r.top - R.top + r.height / 2 }; };
  svg.innerHTML = EDGES.map(([a, b]) => { const A = box(a), B = box(b); if (!A || !B) return '';
    const sameCol = node(a)[1] === node(b)[1], x1 = sameCol ? A.r : A.r, x2 = sameCol ? B.r : B.l, mx = sameCol ? A.r + 22 : (x1 + x2) / 2;
    const lit = on && on.has(a) && on.has(b) && (!SEL || lineage(SEL).has(a));
    return `<path class="${lit ? 'on' : ''}${node(a)[2] === 'ai' ? ' ai' : ''}" d="M${x1},${A.y} C${mx},${A.y} ${mx},${B.y} ${x2},${B.y}"/>`; }).join('');
}
function renderDay() {
  const l = L();
  $('hDay').textContent = l ? 'Paros ritmas (Vilniaus laiku)' : 'Daily rhythm (Vilnius time)';
  const rows = l ? [
    ['~6:40', 'Rytinis pasivijimas (pirm.–šešt.): surenkama tai, kas vakar paskelbta vėlai.'],
    ['13–19 val.', 'Darbo dienomis kas 30 min.: valdytojų vertės, LB failai, Baltijos šalys, naujienos. Svetainė perkuriama tik pasikeitus duomenims, tada automatiškai patikrinama.'],
    ['vakare', 'Vakarinis laiškas savininkui: kas atnaujinta, kas vėluoja, ar svetainė veikia.'],
    ['kas ketvirtį', 'LB portfeliai ir rezultatai (~2 mėn. po ketvirčio) – automatiškai; Morningstar „pro fondus“ – Claude pagal procedūrą, priminimas ateina laiške.'],
    ['nuolat', 'Jei serverio laikrodis praleidžia paleidimą, išorinis „žadintuvas“ jį paleidžia pats. Sugedus vienam šaltiniui, kiti dirba toliau.'],
  ] : [
    ['~6:40', 'Morning catch-up (Mon–Sat): collects what was published late the day before.'],
    ['13–19h', 'Business days every 30 min: manager values, BoL files, Baltic states, news. The site is rebuilt only when data changed, then checked automatically.'],
    ['evening', 'Evening e-mail to the owner: what updated, what is late, whether the site works.'],
    ['quarterly', 'BoL portfolios and results (~2 months after quarter end) – automatic; Morningstar look-through – Claude by procedure, reminded by e-mail.'],
    ['always', 'If the server clock skips a run, an external “alarm” starts it. If one source breaks, the others keep working.'],
  ];
  $('tl').innerHTML = rows.map(([a, b]) => `<div class="t">${a}</div><div>${b}</div>`).join('');
}
function renderAi() {
  const l = L();
  $('hAi').textContent = l ? 'Kur dirba AI, o kur – ne' : 'Where AI works and where it does not';
  const box = (k, h, xs) => `<div class="card k-${k}" style="border-left:4px solid var(--kc)"><h3><span class="dot" style="background:var(--kc)"></span>${h}</h3><ul>${xs.map(x => `<li>${x}</li>`).join('')}</ul></div>`;
  $('ai').innerHTML = l
    ? box('code', 'Kodas be AI – kasdien, savarankiškai', ['Visas duomenų rinkimas, tikrinimas ir saugojimas', 'Visi skaičiavimai: grąžos, rizika, vietos, faktai, Excel formulės', 'Svetainės generavimas, patikra ir vakarinis laiškas', 'Naujienų atranka (be AI santraukų)', 'Veikia ir be Claude – kasdienis darbas AI nenaudoja'])
      + box('ai', 'Claude (AI) – kai reikia žmogaus lygio darbo (Claude Pro prenumerata)', ['Naujų funkcijų kūrimas ir klaidų taisymas', 'Skaičiavimų sutikrinimas su LB ir valdytojų ataskaitomis', 'Ketvirtinė Morningstar „pro fondus“ procedūra', 'Vienkartiniai istorinių duomenų importai', 'Svetainės auditai ir pasiūlymai'])
    : box('code', 'Code without AI – daily, on its own', ['All data collection, validation and storage', 'All calculations: returns, risk, ranks, facts, Excel formulas', 'Site build, checks and the evening e-mail', 'News selection (no AI summaries)', 'Runs without Claude – daily work uses no AI'])
      + box('ai', 'Claude (AI) – when human-level work is needed (Claude Pro subscription)', ['Building features and fixing bugs', 'Checking calculations against BoL and manager reports', 'Quarterly Morningstar look-through procedure', 'One-off historical imports', 'Site audits and proposals']);
}
renderHeader('how', render);
render();
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => wires(activeSet()), 100); });
