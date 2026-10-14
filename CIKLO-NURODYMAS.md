# Vystymo ciklo nurodymas (rutinai)

Rutina „Pensijų dashboard: vystymo ciklas“ **sustabdyta 2026-10-14**. Atnaujinti tik savininkui paprašius. Tada:

- rutinos nurodymą pakeisti žemiau esančiu tekstu;
- išjungti „persist session“ (kiekvienas ciklas – nauja, tuščia sesija; sena sesija kaupia visą ankstesnių ciklų kontekstą ir eikvoja limitą);
- dažnis – **1 kartą per darbo dieną** (pvz. `CRON_TZ=Europe/Vilnius 50 9 * * 1-5`), nebent savininkas nori kitaip.

---

## Nurodymas (kopijuoti į rutiną)

```
Pensijų fondų dashboard vystymo ciklas, repozitorija VytisCode/pension-fund-tracker. Atsakyk ir rašyk lietuviškai.

TAUPYK LIMITĄ: skaityk tik CLAUDE.md, IDEAS.md ir failus, kurių reikia pasirinktai užduočiai (CLAUDE.md „Failų žemėlapis“). Neskaityk git istorijos, archyvas/, docs/, imports/ ir didelių CSV.

1. `git fetch origin && git checkout main && git reset --hard origin/main`. Dirbk tik main šakoje: be naujų šakų ir PR.
2. Duomenys: `python update.py status` ir `python pillar3.py status`. Jei darbo dieną po 13:00 Vilniaus laiku trūksta laukiamos dienos ir „Update fund data“ per paskutinę valandą nevyko – paleisk jį (mcp__github__actions_run_trigger, update.yml, ref main). Jei kuris fondas sugedęs – taisyk pagal CLAUDE.md „Kai duomenų rinkimas sugenda“; tai pirmenybė.
3. Savininko atsakymai: jei turi Gmail įrankį – peržiūrėk tik naujus savininko atsakymus į ciklo laiškus fundsautomationbot@gmail.com nuo praeito ciklo; sprendimus trumpai įrašyk į IDEAS.md.
4. Darbas: imk pirmą nebaigtą paketą iš IDEAS.md „Eilė“. Įgyvendink kiek spėji (pilnai baigtus punktus). Patikra pagal CLAUDE.md „Patikra prieš push“. Atliktus punktus ištrink iš IDEAS.md ir įrašyk po eilutę į archyvas/ATLIKTA.md. Commit kiekvienam punktui, push į main.
5. Nesiūlyk naujų idėjų ir neklausk klausimų, nebent be atsakymo negali dirbti.
6. Laiškas: mcp__github__actions_run_trigger, workflow_id notify.yml, ref main, inputs {"subject": "Claude ciklas <data>: <trumpai>", "body": "..."}. Iki 10 eilučių: ką padarei (ką tai reiškia svetainėje), duomenų rinkimo būklė, ko reikia iš savininko (jei reikia – žingsniai telefonu). Jokių slaptažodžių.
Jei limitas baigiasi – sustok ties paskutiniu baigtu punktu, push, trumpas laiškas.
```
