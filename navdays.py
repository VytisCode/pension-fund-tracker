"""Tikros vieneto vertės (GAV) skelbimo dienos – bendras filtras visiems Lietuvos istorijos skaitytuvams.

Kodėl: kai kurie viešieji šaltiniai (ypač SEB e.seb.lt VPFOND failai) šventinėmis dienomis ir kartais savaitgaliais
pateikia eilutę su lygiai tokia pačia verte kaip paskutinę darbo dieną, nors vertinimo nebuvo. Tokia eilutė –
netikras „0 % pokytis“: iškreipia standartinį nuokrypį, vidurkius, nulinių dienų skaičių, dienų lenteles.
Istorija `data/*.csv` netrinama (CLAUDE.md 6 taisyklė) – tokios eilutės tik praleidžiamos skaitant.

Taisyklės (fondui, eilutės surikiuotos pagal datą):
  A. Ne darbo diena Lietuvoje (savaitgalis ar valstybinė šventė) IR vieneto vertė lygiai tokia pati kaip ankstesnės
     paliktos eilutės → praleidžiama. Jei vertė pasikeitė – tai tikras vertinimas, paliekama.
  B. Darbo diena, kai VISŲ (bent 3, jau pradėjusių judėti – ne naujo fondo 1,0 laikotarpis) to valdytojo fondų vertės lygiai tokios pat kaip ankstesnės – pasenusi diena
     (kaip `update.stale_batch`), praleidžiama. Didysis penktadienis – išimtis (biržos uždarytos, vertė gali nesikeisti).

Naudojimas: `navdays.read(path)` vietoj `csv.DictReader(path.open())`; `python navdays.py` – kiek eilučių praleidžiama.
"""
import csv
from datetime import date, timedelta
from pathlib import Path


def easter(year: int) -> date:
    a, b, c = year % 19, year // 100, year % 100
    d, e = b // 4, b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    return date(year, (h + l - 7 * m + 114) // 31, (h + l - 7 * m + 114) % 31 + 1)


_HOL = {}


def lt_holidays(year: int) -> set:
    """Lietuvos valstybinės šventės (Darbo kodeksas). Gruodžio 24 d. – nedarbo diena nuo 2010 m. (duomenyse iki 2009 m.
    vertės tą dieną keitėsi), lapkričio 2 d. – nuo 2020 m."""
    if year not in _HOL:
        e = easter(year)
        s = {date(year, 1, 1), date(year, 2, 16), date(year, 3, 11), e, e + timedelta(days=1), date(year, 5, 1),
             date(year, 6, 24), date(year, 7, 6), date(year, 8, 15), date(year, 11, 1), date(year, 12, 25), date(year, 12, 26)}
        if year >= 2010:
            s.add(date(year, 12, 24))
        if year >= 2020:
            s.add(date(year, 11, 2))
        _HOL[year] = s
    return _HOL[year]


def is_pub_day(d: date) -> bool:
    return d.weekday() < 5 and d not in lt_holidays(d.year)


def fake_rows(rows) -> set:
    """{(data, fondas)} eilutės, kurios nėra tikros GAV skelbimo dienos (taisyklės A ir B, žr. viršuje)."""
    ser = {}
    for r in rows:
        try:
            v = float(r["unit_value"])
        except (TypeError, ValueError):
            continue
        ser.setdefault(r["fund"], []).append((r["date"], v, r.get("provider", "")))
    bad, same_day = set(), {}
    for fund, pts in ser.items():
        pts.sort()
        prev, moved = None, False   # moved – vertė jau keitėsi nuo pirmos dienos (naujo fondo 1,0 laikotarpis neliečiamas)
        for d, v, prov in pts:
            dd = date.fromisoformat(d)
            same = prev is not None and abs(v - prev) < 1e-12
            if same and not is_pub_day(dd):
                bad.add((d, fund))
                continue
            if is_pub_day(dd) and moved:
                same_day.setdefault((prov, d), []).append((fund, same))
            moved = moved or (prev is not None and not same)
            prev = v
    for (prov, d), fs in same_day.items():
        dd = date.fromisoformat(d)
        if len(fs) >= 3 and all(s for _, s in fs) and dd != easter(dd.year) - timedelta(days=2):
            bad |= {(d, f) for f, _ in fs}
    return bad


def read(path) -> list:
    """Visos CSV eilutės (dict), be netikrų skelbimo dienų."""
    path = Path(path)
    if not path.exists():
        return []
    with path.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    bad = fake_rows(rows)
    return [r for r in rows if (r["date"], r["fund"]) not in bad] if bad else rows


if __name__ == "__main__":
    from collections import Counter
    root = Path(__file__).parent / "data"
    for name in ("nav_history.csv", "pillar3_history.csv"):
        with (root / name).open(encoding="utf-8", newline="") as f:
            rows = list(csv.DictReader(f))
        prov = {(r["date"], r["fund"]): r["provider"] for r in rows}
        bad = fake_rows(rows)
        print(f"{name}: {len(rows)} eilučių, praleidžiama {len(bad)}")
        print("  pagal valdytoją:", dict(Counter(prov[k] for k in bad)))
        print("  pagal metus:", dict(sorted(Counter(d[:4] for d, _ in bad).items())))
