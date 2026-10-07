#!/usr/bin/env python3
"""
Kasdienis (tiksliau – kelis kartus per dieną) duomenų atnaujinimas.

Idėja: fondai skelbia ankstesnės darbo dienos vertę skirtingu metu. Todėl workflow
paleidžiamas kas valandą, bet kiekvieną tiekėją tikriname TIK jei saugykloje dar nėra
laukiamos dienos duomenų. Kai viskas jau yra, paleidimas baigiasi per sekundes.

Komandos:
    python update.py light            # HTTP be naršyklės: Artea (API), Allianz (POST), Goindex (API, reikia rakto)
    python update.py needs-browser    # parašo needs_browser=true/false į $GITHUB_OUTPUT
    python update.py browser          # merginos Playwright skaitytuvai: SEB, Swedbank, Luminor, (Goindex)
    python update.py status           # tik parodo, ko trūksta

Papildomi nustatymai (aplinkos kintamieji):
    GOINDEX_API_SECRET_KEY   Goindex API raktas (GitHub secret)
    CATCHUP=true             ryto papildomas paleidimas (laukiama diena skaičiuojama nuo vakar)
    MAX_BROWSER_ATTEMPTS     bandymų per dieną vienam naršyklės tiekėjui (numatyta 5)
"""
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

import store

ROOT = Path(__file__).parent
STATE_FILE = ROOT / "data" / "update_state.json"
TZ = ZoneInfo("Europe/Vilnius")
MAX_BROWSER_ATTEMPTS = int(os.getenv("MAX_BROWSER_ATTEMPTS", "5"))
MAX_DAILY_JUMP = 0.12  # didesnis vienos dienos pokytis laikomas klaida ir praleidžiamas
LOOKBACK_DAYS = 30  # fondas laikomas „aktyviu", jei turi duomenų per paskutines 30 d.

# provider -> naršyklės skaitytuvo failas (merginos kodas)
BROWSER_SCRIPTS = {
    "SEB": "seb_pensions.py",
    "SWEDBANK": "swedbank_pensions.py",
    "LUMINOR": "luminor_pensions.py",
    "GOINDEX": "goindex_pensions.py",  # pats pirma bando API, jei neina – naršyklė
}
LIGHT_PROVIDERS = ["ARTEA", "ALLIANZ", "GOINDEX"]
from fund_links import GOINDEX_API  # noqa: E402
GOINDEX_CODES = {
    "GOX-03/09": "Goindex pensija 2003-2009",
    "GOX-61/67": "Goindex pensija 1961-1967",
    "GOX-68/74": "Goindex pensija 1968-1974",
    "GOX-75/81": "Goindex pensija 1975-1981",
    "GOX-82/88": "Goindex pensija 1982-1988",
    "GOX-89/95": "Goindex pensija 1989-1995",
    "GOX-96/02": "Goindex pensija 1996-2002",
    "GOX-TIPF": "Goindex pensijų turto išsaugojimo fondas",
}


# --------------------------------------------------------------------------- kalendorius
def easter(year: int) -> date:
    a, b, c = year % 19, year // 100, year % 100
    d, e = b // 4, b % 4
    f = (b + 8) // 25
    g = (b - f + 1) // 3
    h = (19 * a + b - d - g + 15) % 30
    i, k = c // 4, c % 4
    l = (32 + 2 * e + 2 * i - h - k) % 7
    m = (a + 11 * h + 22 * l) // 451
    month = (h + l - 7 * m + 114) // 31
    day = (h + l - 7 * m + 114) % 31 + 1
    return date(year, month, day)


def lt_holidays(year: int) -> set:
    e = easter(year)
    days = {
        date(year, 1, 1), date(year, 2, 16), date(year, 3, 11), e, e + timedelta(days=1),
        date(year, 5, 1), date(year, 6, 24), date(year, 7, 6), date(year, 8, 15),
        date(year, 11, 1), date(year, 11, 2), date(year, 12, 24), date(year, 12, 25),
        date(year, 12, 26),
    }
    return days


def is_business_day(day: date) -> bool:
    return day.weekday() < 5 and day not in lt_holidays(day.year)


def today_vilnius() -> date:
    return datetime.now(TZ).date()


def expected_date(today: date = None) -> date:
    """Fondai darbo dieną paskelbia ANKSTESNĖS darbo dienos vertę (savaitgaliais ir šventinėmis
    dienomis nieko neskelbia). Todėl: randame paskutinę darbo dieną iki šiandien (imtinai),
    o laukiama diena – dar viena darbo diena atgal."""
    day = today or today_vilnius()
    # Ryto „papildomas" paleidimas tikrina vakarykštės dienos laukiamą vertę. GitHub kartais jį
    # pavėlina keliomis valandomis (2026-10-07 – iki 14:19), todėl po pietų jis elgiasi kaip įprastas.
    if today is None and os.getenv("CATCHUP", "").lower() == "true" and datetime.now(TZ).hour < 12:
        day -= timedelta(days=1)
    while not is_business_day(day):
        day -= timedelta(days=1)
    day -= timedelta(days=1)
    while not is_business_day(day):
        day -= timedelta(days=1)
    return day


# --------------------------------------------------------------------------- pagalbinės
def number(value):
    """„1,2345“, „1.2345 EUR“, „2 042 684.09“, 1.23, None → float arba None."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return None if value != value else float(value)
    text = str(value).replace("\xa0", " ").upper().replace("EUR", "").replace("€", "")
    text = re.sub(r"\s+", "", text)
    if not text or text in {"-", "NAN", "NONE"}:
        return None
    if "," in text and "." in text:
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return None


def clean_assets(value):
    """Grynieji aktyvai: sveikas skaičius be „.0“, kitu atveju 2 ženklai po kablelio."""
    if value is None:
        return None
    value = round(float(value), 2)
    return int(value) if value == int(value) else value


def iso_date(value):
    if value is None:
        return None
    if hasattr(value, "strftime"):
        return value.strftime("%Y-%m-%d")
    match = re.search(r"\d{4}-\d{2}-\d{2}", re.sub(r"[\s/.]", "-", str(value)))
    return match.group(0) if match else None


def first_present(record: dict, *keys):
    for key in keys:
        value = record.get(key)
        if value is not None and not (isinstance(value, float) and value != value) and str(value).strip() != "":
            return value
    return None


def canon_name(provider: str, name: str) -> str:
    name = " ".join(str(name).split()).replace("–", "-").replace("—", "-")
    if provider == "SWEDBANK" and not name.startswith("Swedbank"):
        if name.lower().startswith("turto"):
            return "Swedbank turto išsaugojimo pensijų fondas"
        return "Swedbank " + name[0].lower() + name[1:]
    return name


def active_funds(rows: dict, provider: str, expected: date) -> dict:
    """{fondas: paskutinė data} fondams, turintiems duomenų per LOOKBACK_DAYS."""
    cutoff = (expected - timedelta(days=LOOKBACK_DAYS)).isoformat()
    last = {}
    for (day, fund), row in rows.items():
        if row["provider"] == provider and day >= cutoff:
            if day > last.get(fund, ""):
                last[fund] = day
    return last


def missing_funds(rows: dict, provider: str, expected: date) -> list:
    last = active_funds(rows, provider, expected)
    return sorted(fund for fund, day in last.items() if day < expected.isoformat())


# --------------------------------------------------------------------------- būsena (bandymai)
def load_state() -> dict:
    try:
        state = json.loads(STATE_FILE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        state = {}
    today = today_vilnius().isoformat()
    return {today: state.get(today, {})}  # senesnių dienų neišsaugome


def save_state(state: dict) -> None:
    STATE_FILE.parent.mkdir(exist_ok=True)
    STATE_FILE.write_text(json.dumps(state, indent=1, sort_keys=True), encoding="utf-8")


def attempts_today(state: dict, provider: str) -> int:
    return state.get(today_vilnius().isoformat(), {}).get(provider, 0)


def add_attempt(state: dict, provider: str) -> None:
    day = state.setdefault(today_vilnius().isoformat(), {})
    day[provider] = day.get(provider, 0) + 1


# --------------------------------------------------------------------------- įrašymas
def commit_rows(provider: str, new_rows: list, existing: dict, expected: date, log: list) -> int:
    """Patikrina eilutes ir įrašo. Grąžina nauja/pakeista eilučių skaičių."""
    known = {fund for (_, fund), r in existing.items() if r["provider"] == provider}
    today = today_vilnius()
    earliest = (expected - timedelta(days=10)).isoformat()
    accepted = []
    for row in new_rows:
        fund, day = row["fund"], row["date"]
        if fund not in known:
            log.append(f"  ! {provider}: nežinomas fondas „{fund}“ – praleista")
            continue
        if not day or day > today.isoformat() or day < earliest:
            log.append(f"  ! {fund}: netinkama data {day} – praleista")
            continue
        unit = row.get("unit_value")
        if unit is None or unit <= 0:
            log.append(f"  ! {fund} {day}: nėra vieneto vertės – praleista")
            continue
        previous = [r for (d, f), r in existing.items() if f == fund and d < day]
        if previous:
            last = max(previous, key=lambda r: r["date"])
            try:
                change = abs(unit / float(last["unit_value"]) - 1)
            except (ValueError, ZeroDivisionError):
                change = 0
            if change > MAX_DAILY_JUMP:
                log.append(f"  ! {fund} {day}: pokytis {change:.1%} per didelis (buvo {last['unit_value']}, dabar {unit}) – praleista")
                continue
        old = existing.get((day, fund))
        merged = {
            "date": day, "provider": provider, "fund": fund, "unit_value": unit,
            "net_assets": clean_assets(row.get("net_assets")) or (old or {}).get("net_assets") or None,
            "benchmark_index": row.get("benchmark_index") or (old or {}).get("benchmark_index") or None,
        }
        accepted.append(merged)
    changed = store.upsert(accepted)
    for row in accepted:
        existing[(row["date"], row["fund"])] = {k: ("" if v is None else str(v)) for k, v in row.items()}
    return changed


# --------------------------------------------------------------------------- lengvi tiekėjai
def fetch_artea() -> list:
    import backfill_artea as artea

    rows = []
    for code, name in artea.FUND_CODE_MAP.items():
        for record in artea.fetch_history(code)[-12:]:
            if record.get("d") and record.get("p") is not None:
                rows.append({"date": iso_date(record["d"]), "fund": name, "unit_value": number(record["p"]),
                             "net_assets": number(record.get("n"))})
    return rows


def fetch_allianz() -> list:
    import time

    import backfill_allianz as allianz

    session = allianz.Session()
    rows = {}
    day = expected_date() - timedelta(days=6)
    end = today_vilnius()
    while day <= end:
        if day.weekday() < 5:
            shown, found = allianz.parse_response(session.fetch(day))
            if shown:
                for row in found:
                    rows[(shown.isoformat(), row["fund"])] = {
                        "date": shown.isoformat(), "fund": row["fund"],
                        "unit_value": row["unit_value"], "net_assets": row["net_assets"]}
            time.sleep(0.3)
        day += timedelta(days=1)
    return list(rows.values())


def fetch_goindex() -> list:
    key = os.getenv("GOINDEX_API_SECRET_KEY", "").strip()
    if not key:
        raise RuntimeError("nenustatytas GOINDEX_API_SECRET_KEY")
    rows = []
    for code, name in GOINDEX_CODES.items():
        query = urllib.parse.urlencode({"secret_key": key, "code": code})
        request = urllib.request.Request(f"{GOINDEX_API}?{query}",
                                         headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=30) as response:
            record = json.load(response)
        if not record:
            raise RuntimeError(f"tuščias Goindex atsakymas: {code}")
        rows.append({"date": iso_date(str(record.get("date", "")).split("T")[0]), "fund": name,
                     "unit_value": number(record.get("unitValue")), "net_assets": number(record.get("assets"))})
    return rows


LIGHT_FETCHERS = {"ARTEA": fetch_artea, "ALLIANZ": fetch_allianz, "GOINDEX": fetch_goindex}


# --------------------------------------------------------------------------- naršyklės tiekėjai
def rows_from_records(provider: str, records: list) -> list:
    rows = []
    for rec in records:
        name = first_present(rec, "Fund name")
        if not name:
            continue
        rows.append({
            "date": iso_date(first_present(rec, "Data", "Date")),
            "fund": canon_name(provider, name),
            "unit_value": number(first_present(rec, "Vieneto vertė", "GAV")),
            "net_assets": number(first_present(rec, "Grynieji aktyvai", "Fondo dydis value")),
        })
    return rows


def run_browser_script(provider: str, log: list) -> list:
    import pandas as pd

    script = ROOT / "sources" / BROWSER_SCRIPTS[provider]
    with tempfile.TemporaryDirectory() as tmp:
        env = {**os.environ, "PYTHONPATH": str(ROOT), "PYTHONIOENCODING": "utf-8"}
        result = subprocess.run([sys.executable, str(script)], cwd=tmp, env=env, timeout=600,
                                capture_output=True, text=True)
        tail = "\n".join((result.stdout + result.stderr).strip().splitlines()[-8:])
        files = sorted(Path(tmp).glob("*_data_*.xlsx"))
        if not files:
            log.append(f"  ! {provider}: skaitytuvas nesukūrė failo (kodas {result.returncode}). Pabaiga:\n{tail}")
            return []
        records = []
        for path in files:
            records.extend(pd.read_excel(path).to_dict("records"))
    return rows_from_records(provider, records)


# --------------------------------------------------------------------------- valdymas
LOG_FILE = ROOT / "data" / "last_update_log.txt"


IP_ADDRESS = re.compile(r"\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b")


def mask_private(text: str) -> str:
    """Žurnalas ir suvestinė vieši, todėl paslepiame proxy adresą ir prisijungimo duomenis."""
    for name in ("LUMINOR_PROXY_SERVER", "LUMINOR_PROXY_USERNAME", "LUMINOR_PROXY_PASSWORD"):
        value = os.getenv(name, "").strip().strip("'\"")
        for part in {value, *value.split(":")} if value else ():
            if len(part) >= 4:
                text = text.replace(part, "***")
    return IP_ADDRESS.sub("***", text)


def write_log(lines: list) -> None:
    """Palieka paskutinių bandymų žurnalą saugykloje (kad rezultatą matytų ir Claude)."""
    try:
        old = LOG_FILE.read_text(encoding="utf-8")[-15000:]
    except OSError:
        old = ""
    LOG_FILE.parent.mkdir(exist_ok=True)
    LOG_FILE.write_text(mask_private(old + "\n".join(lines) + "\n\n"), encoding="utf-8")


def summary(lines: list, attempted: bool = False) -> None:
    text = mask_private("\n".join(lines))
    print(text)
    if attempted:
        write_log(lines)
    target = os.getenv("GITHUB_STEP_SUMMARY")
    if target:
        with open(target, "a", encoding="utf-8") as f:
            f.write("```\n" + text + "\n```\n")


def run_group(providers: list, fetchers: dict) -> int:
    expected = expected_date()
    existing = store.load()
    state = load_state()
    log = [f"Vilnius: {datetime.now(TZ):%Y-%m-%d %H:%M}, laukiama diena: {expected}"]
    problems = 0
    attempted = False
    for provider in providers:
        missing = missing_funds(existing, provider, expected)
        if not missing:
            log.append(f"{provider}: jau atnaujinta iki {expected}")
            continue
        is_browser = fetchers is None
        if is_browser and attempts_today(state, provider) >= MAX_BROWSER_ATTEMPTS:
            log.append(f"{provider}: pasiektas dienos bandymų limitas ({MAX_BROWSER_ATTEMPTS})")
            continue
        attempted = True
        try:
            if is_browser:
                add_attempt(state, provider)
                rows = run_browser_script(provider, log)
            else:
                rows = fetchers[provider]()
        except Exception as exc:  # noqa: BLE001
            log.append(f"{provider}: klaida – {exc}")
            problems += 1
            continue
        changed = commit_rows(provider, rows, existing, expected, log)
        still = missing_funds(existing, provider, expected)
        log.append(f"{provider}: gauta {len(rows)} eil., nauja/pakeista {changed}; "
                   f"{'viskas iki ' + str(expected) if not still else 'dar trūksta: ' + str(len(still)) + ' fondų'}")
    save_state(state)
    summary(log, attempted)
    return 0 if problems == 0 else 0  # klaidos nenumuša workflow; matomos suvestinėje


def main() -> int:
    command = sys.argv[1] if len(sys.argv) > 1 else "status"
    existing = store.load()
    expected = expected_date()

    if command == "light":
        providers = [p for p in LIGHT_PROVIDERS if p != "GOINDEX" or os.getenv("GOINDEX_API_SECRET_KEY")]
        return run_group(providers, LIGHT_FETCHERS)

    if command == "needs-browser":
        state = load_state()
        needed = [p for p in BROWSER_SCRIPTS
                  if missing_funds(existing, p, expected) and attempts_today(state, p) < MAX_BROWSER_ATTEMPTS]
        print("Reikia naršyklės:", ", ".join(needed) or "niekam")
        target = os.getenv("GITHUB_OUTPUT")
        if target:
            with open(target, "a", encoding="utf-8") as f:
                f.write(f"needs_browser={'true' if needed else 'false'}\n")
        return 0

    if command == "browser":
        return run_group(list(BROWSER_SCRIPTS), None)

    if command == "status":
        print(f"Laukiama diena: {expected}")
        for provider in sorted({r["provider"] for r in existing.values()}):
            miss = missing_funds(existing, provider, expected)
            print(f"{provider}: {'atnaujinta' if not miss else 'trūksta ' + str(len(miss)) + ' fondų'}")
        return 0

    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main())
