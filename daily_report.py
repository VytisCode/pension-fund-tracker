"""Kasdienė trumpa ataskaita el. paštu (viena per dieną).

Paleidžiama paskutiniame dienos „Update fund data“ paleidime. Laiškas siunčiamas per Gmail iš projekto dėžutės.
Reikalingi GitHub Secrets:
    GMAIL_USER        projekto pašto dėžutė (fundsautomationbot@gmail.com)
    GMAIL_PASSWORD    tos dėžutės „App password“ (ne įprastas slaptažodis)
    RECIPIENT_EMAIL   kam siųsti (savininko asmeninis paštas)

    python daily_report.py preview   – tik atspausdina ataskaitą
    python daily_report.py send      – išsiunčia laišką (jei šiandien dar nesiųsta)
Jei Gmail nustatymų nėra, „send“ parašo GITHUB_OUTPUT fallback=true ir ataskaitą palieka faile report.md.
"""
import json
import os
import re
import smtplib
import subprocess
import sys
import urllib.request
from datetime import datetime, timedelta
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
from pathlib import Path

import store
import update as u

ROOT = Path(__file__).parent
REPORT_STATE = ROOT / "data" / "report_state.json"
IDEAS_FILE = ROOT / "IDEAS.md"
SITE_URL = "https://vytiscode.github.io/pension-fund-tracker/"
IP_ADDRESS = re.compile(r"\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b")


def mask(text: str) -> str:
    """Laiškas neturi atskleisti proxy adreso ar prisijungimo duomenų."""
    for name in ("LUMINOR_PROXY_SERVER", "LUMINOR_PROXY_USERNAME", "LUMINOR_PROXY_PASSWORD"):
        value = os.getenv(name, "").strip().strip("'\"")
        for part in {value, *value.split(":")} if value else ():
            if len(part) >= 4:
                text = text.replace(part, "***")
    return IP_ADDRESS.sub("***", text)


def provider_lines(existing: dict, expected) -> tuple:
    lines, missing_names = [], []
    for provider in sorted({r["provider"] for r in existing.values()}):
        last = u.active_funds(existing, provider, expected)
        newest = max(last.values()) if last else "–"
        miss = u.missing_funds(existing, provider, expected)
        if miss:
            missing_names.append(provider)
            lines.append(f"  ❌ {provider}: trūksta {len(miss)} iš {len(last)} fondų (naujausia data {newest})")
        else:
            lines.append(f"  ✅ {provider}: atnaujinta ({newest})")
    return lines, missing_names


def pillar3_lines() -> list:
    try:
        out = subprocess.run([sys.executable, str(ROOT / "pillar3.py"), "status"], capture_output=True,
                             text=True, timeout=120, cwd=ROOT).stdout.strip().splitlines()
    except Exception as exc:  # noqa: BLE001 – ataskaita neturi lūžti dėl III pakopos
        return [f"  (III pakopos būsenos gauti nepavyko: {exc})"]
    return ["  " + line.replace(": atnaujinta", ": ✅ atnaujinta").replace(": trūksta", ": ❌ trūksta")
            for line in out[1:]]


def todays_problems(today: str) -> list:
    """Šiandienos žurnalo eilutės su klaidomis (be pasikartojimų)."""
    try:
        text = u.LOG_FILE.read_text(encoding="utf-8")
    except OSError:
        return []
    seen, result = set(), []
    for block in text.split("\n\n"):
        if f"Vilnius: {today}" not in block:
            continue
        for line in block.splitlines():
            line = line.strip()
            if (line.startswith("!") or "klaida" in line or "trūksta" in line) and line not in seen:
                seen.add(line)
                result.append("  " + line)
    return result[:15]


def runs_today(today: str) -> str:
    """Kiek kartų šiandien buvo paleistas duomenų rinkimas (padeda pastebėti, jei GitHub tvarkaraštis neveikia)."""
    token, repo = os.getenv("GITHUB_TOKEN"), os.getenv("GITHUB_REPOSITORY")
    if not token or not repo:
        return ""
    url = (f"https://api.github.com/repos/{repo}/actions/workflows/update.yml/runs"
           f"?created=%3E%3D{today}&per_page=100")
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {token}",
                                               "Accept": "application/vnd.github+json"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            runs = json.load(r).get("workflow_runs", [])
    except Exception:  # noqa: BLE001
        return ""
    scheduled = sum(1 for x in runs if x.get("event") == "schedule")
    manual = sum(1 for x in runs if x.get("event") == "workflow_dispatch")
    text = f"Šiandien paleidimų: {scheduled} pagal tvarkaraštį, {manual} ranka."
    if scheduled == 0:
        text += " ⚠️ Automatinis tvarkaraštis šiandien nesuveikė."
    return text


def ideas_section() -> list:
    """Iš IDEAS.md: naujos / siūlomos idėjos ir klausimas savininkui (jei įrašytas)."""
    try:
        text = IDEAS_FILE.read_text(encoding="utf-8")
    except OSError:
        return []
    ideas = [m.group(1).strip() for m in
             re.finditer(r"^###\s+(.+?)\n(?:(?!^###).*\n)*?- \*\*Būsena:\*\*\s*(?:nauja|siūloma)", text, re.M)]
    out = []
    if ideas:
        out += ["", "Idėjos, laukiančios jūsų sprendimo (IDEAS.md):"] + [f"  • {i}" for i in ideas]
    q = re.search(r"^## Klausimas savininkui\s*\n(.+?)(?=^## |\Z)", text, re.M | re.S)
    question = q.group(1).replace("---", "").strip() if q else ""
    if question:
        out += ["", "Klausimas jums:", "  " + question]
    return out


def stale_section(today: str) -> list:
    """Pasenę „Kelio į pensiją“ pradiniai duomenys – kartą per mėnesį (pirmoje to mėnesio ataskaitoje)."""
    try:
        last = json.loads(REPORT_STATE.read_text(encoding="utf-8")).get("last_sent", "")
    except (OSError, ValueError):
        last = ""
    if last[:7] == today[:7]:
        return []
    try:
        import journey
        late = journey.stale(datetime.strptime(today, "%Y-%m-%d").date())
    except Exception as e:  # noqa: BLE001
        return ["", f"Duomenų šviežumo patikra nepavyko: {e!r}"]
    try:   # kiti rankiniai šaltiniai iš sources_list.py (LB failai, fondų savybės, scenarijų prielaidos)
        import build_site
        import sources_list
        d0 = (datetime.strptime(today, "%Y-%m-%d").date() - datetime(1970, 1, 1).date()).days
        iso = lambda n: str(datetime(1970, 1, 1).date() + timedelta(days=n))
        late += [{"lt": s["lt"], "last": iso(s["last"]) if s["last"] is not None else "–", "due": iso(s["next"]), "auto": False, "url": s["url"]}
                 for s in sources_list.inventory(build_site.sources(), d0)
                 if s["id"] in ("pf", "lbr", "fee2", "fee3", "attrs", "future") and s["next"] is not None and d0 > s["next"]]
    except Exception as e:  # noqa: BLE001
        late.append({"lt": "Šaltinių sąrašo patikra", "last": "–", "due": today, "auto": True, "url": repr(e)})
    if not late:
        return []
    return ["", "Pasenę duomenys (priminimas kartą per mėnesį, kol neatnaujinta):"] + [
        f"  ⚠ {f['lt']}: turime {f['last']}, naujų laukta iki {f['due']} – "
        + ("automatinis atnaujinimas dar nerado" if f["auto"] else "reikia atnaujinti rankiniu būdu") + f" ({f['url']})"
        for f in late]


def lb_new_lines(today: str) -> list:
    """Šiandien parsisiųsti nauji Lietuvos banko failai (data/ops_log.csv, lb.*)."""
    try:
        import csv
        with (Path(__file__).parent / "data" / "ops_log.csv").open(encoding="utf-8") as f:
            rows = [r for r in csv.DictReader(f) if r["src"].startswith("lb.") and r["ev"] == "new" and r["ts"][:10] == today]
    except Exception:  # noqa: BLE001
        return []
    return (["", "🆕 Lietuvos bankas paskelbė naujų failų (jau įkelta į svetainę):"] + [f"  • {r['msg']}" for r in rows]) if rows else []


def source_lines() -> list:
    """Neveikiantys šaltiniai iš data/source_status.json (tie patys, kurie rodomi svetainės pranešimuose)."""
    try:
        import source_status
        st = source_status.load()
    except Exception:  # noqa: BLE001
        return []
    names = {"site": "Svetainės patikra (puslapiai / lentelės)", "eonia": "EONIA (ECB, iki 2019-10)", "proxy": "Luminor proxy (Proxy-Cheap)", "estr": "€STR (ECB)", "cpi": "VKI (VDA)", "lb": "Lietuvos banko failai"}
    why = {"auth": "baigėsi arba neveikia prieiga", "blocked": "šaltinis blokuoja", "network": "nepasiekiamas",
           "format": "pasikeitė puslapis – reikia taisyti", "other": "klaida"}
    out = [f"  ⚠ {names.get(k, k.replace('idx.', 'indeksas ').replace('nav.', ''))}: {why.get(v.get('kind'), 'klaida')} nuo {v.get('since') or v['err']} ({v.get('msg', '')})"
           for k, v in sorted(st.items()) if v.get("err")]
    if any(k == "proxy" and v.get("kind") == "auth" and v.get("err") for k, v in st.items()):
        out.append("    → Patikrinkite Proxy-Cheap prenumeratą; jei ji baigėsi ir nenorite mokėti – praneškite Claude.")
    return (["", "Neveikiantys šaltiniai:"] + out) if out else []


def build() -> tuple:
    """Savininkas 2026-11-06: kasdien – trumpas, žmogiškas laiškas („dabar skaitau kaip robotas“); platesnis – pirmame mėnesio laiške,
    ketvirčio pradžioje ir tą dieną, kai atkeliauja nauji LB portfeliai (report_market.py). Technika – tik kai kažkas negerai."""
    existing = store.load()
    expected = u.expected_date()
    today = f"{datetime.now(u.TZ):%Y-%m-%d}"
    lines2, missing = provider_lines(existing, expected)
    lines3 = pillar3_lines()
    missing3 = [x.split(":")[0].strip() for x in lines3 if "❌" in x]
    try:
        last_sent = json.loads(REPORT_STATE.read_text(encoding="utf-8")).get("last_sent", "")
    except (OSError, ValueError):
        last_sent = ""
    actions = []
    try:   # Claude darbai, kuriuos savininkas turi tik paprašyti
        import build_site
        am = build_site.attr_missing()
        if am["n"]:
            actions.append(f"{am['n']} naujiems portfelių fondams trūksta požymių. Parašykite Claude: „surink portfelių požymius“.")
        lt = build_site.ROOT / "data" / "lookthrough.csv"
        if am["q"] and (not lt.exists() or f"\n{am['q']}," not in lt.read_text(encoding="utf-8")):
            actions.append(f"{am['q']} portfelių „sudėtis pro fondus“ dar neapskaičiuota. Parašykite Claude: „atnaujink Morningstar portfelių analizę“.")
        if int(today[5:7]) in (1, 4, 7, 10) and int(today[8:10]) <= 10:
            actions.append("Ketvirtis ką tik baigėsi. Parašykite Claude: „surink ETF sudėtis ketvirčio pabaigai“.")
    except Exception:  # noqa: BLE001
        pass
    src = source_lines()
    if src:
        actions.append("Neveikia duomenų šaltinis (žr. apačioje).")
    stale = stale_section(today)
    if any("rankiniu būdu" in x for x in stale):
        actions.append("Reikia atnaujinti rankinius duomenis (žr. apačioje).")
    ideas = ideas_section()
    if any("Klausimas jums" in x for x in ideas):
        actions.append("Claude turi jums klausimą (žr. apačioje).")

    new_month = last_sent[:7] != today[:7]
    new_quarter = new_month and int(today[5:7]) in (1, 4, 7, 10)
    lb_new = lb_new_lines(today)
    new_pf = any("portfel" in x for x in lb_new)
    try:
        import report_market as rm
        head, daily = rm.daily(today)
        extra = (rm.month_block(today) if new_month else []) + (rm.quarter_block(today) if new_quarter else []) + (rm.portfolio_block() if new_pf else [])
    except Exception as e:  # noqa: BLE001 – rinkos dalis neturi sustabdyti laiško
        head, daily, extra = "", [f"(Rinkos santraukos šiandien paruošti nepavyko: {e!r})"], []
    ok = not missing and not missing3
    tag = " · portfeliai" if new_pf else " · ketvirčio apžvalga" if new_quarter else " · mėnesio apžvalga" if new_month else ""
    # Svarbiausia – temoje ir pirmoje eilutėje (savininkas skaito laikrodyje, laiško neatidarydamas)
    status = ("✅ Iš jūsų nieko nereikia" if not actions else "⚠ Reikia jūsų veiksmo") + (" · duomenys visi" if ok else " · trūksta duomenų")
    subject = f"{status} · {head or today}{tag}"
    body = [("Iš jūsų šiandien nieko nereikia. " if not actions else "Reikia jūsų veiksmo (žr. žemiau). ")
            + ("Duomenys surinkti visi." if ok else "Dar trūksta: " + ", ".join(missing + [f"{m} (III pakopa)" for m in missing3]) + " – dažniausiai pasitaiso savaime kitą rytą."),
            "", "Labas vakaras,", ""] + daily
    if actions:
        body += ["", "Reikia jūsų:"] + [f"  • {a}" for a in actions]
    body += extra
    if not ok or src or stale or ideas:                  # techninės detalės – tik kai kažkas negerai
        body += ["", "── Detalės ──"]
        if not ok:
            body += [f"Laukiama vertė už {expected}.", "II pakopa:"] + lines2 + ["III pakopa:"] + lines3
            body += [p for p in todays_problems(today) if "netinkama data" not in p][:8]
            runs = runs_today(today)
            if runs:
                body.append(runs)
        body += src + stale + ideas
    body += ["", f"Svetainė: {SITE_URL}"]
    return subject, mask("\n".join(body))


def already_sent(today: str) -> bool:
    try:
        return json.loads(REPORT_STATE.read_text(encoding="utf-8")).get("last_sent") == today
    except (OSError, ValueError):
        return False


def mark_sent(today: str, **extra) -> None:
    try:
        st = json.loads(REPORT_STATE.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        st = {}
    st.update(last_sent=today, **extra)
    REPORT_STATE.write_text(json.dumps(st, indent=1) + "\n", encoding="utf-8")


def liquidity_attachments() -> tuple:
    """Savininkas 2026-11-09: atsiradus naujiems LB portfeliams – SEB fondų likvidumo analizė (Excel + laiško projektai)
    pridedama prie vakarinio laiško. Tai SEB vidinė analizė: tik laiško priedas savininkui, ne svetainė / repo / Issue.
    Pats laiškas kolegoms niekada nesiunčiamas automatiškai."""
    try:
        import tempfile
        import liquidity
        try:
            done = json.loads(REPORT_STATE.read_text(encoding="utf-8")).get("liq", "")
        except (OSError, ValueError):
            done = ""
        latest = liquidity.latest_date()
        if not latest or latest <= done:
            return [], ""
        _, _, files = liquidity.run(out_dir=tempfile.mkdtemp(prefix="liq_"))
        return files, latest
    except Exception as e:  # noqa: BLE001 – priedas neturi sustabdyti laiško
        print(f"Likvidumo analizės paruošti nepavyko: {e!r}")
        return [], ""


def finish(today: str, forced: bool, keep: str, **extra) -> None:
    """Bandomasis (ranka paprašytas) laiškas nepažymi dienos kaip atliktos – vakarinė ataskaita vis tiek bus išsiųsta."""
    if forced and keep:
        REPORT_STATE.write_text(keep, encoding="utf-8")
    elif not forced:
        mark_sent(today, **extra)


def output(name: str, value: str) -> None:
    target = os.getenv("GITHUB_OUTPUT")
    if target:
        with open(target, "a", encoding="utf-8") as f:
            f.write(f"{name}={value}\n")


def previous_state() -> str:
    """Būsena prieš paleidimą (darbo eiga bandomajam laiškui failą ištrina)."""
    try:
        return subprocess.run(["git", "show", "HEAD:data/report_state.json"], capture_output=True,
                              text=True, cwd=ROOT, check=True).stdout
    except Exception:  # noqa: BLE001
        return ""


def send() -> int:
    today = f"{datetime.now(u.TZ):%Y-%m-%d}"
    forced = os.getenv("FORCE_REPORT") == "true"
    keep = previous_state() if forced else ""
    if not forced and already_sent(today):
        print("Šiandienos ataskaita jau išsiųsta.")
        return 0
    subject, body = build()
    user, password = os.getenv("GMAIL_USER", "").strip(), os.getenv("GMAIL_PASSWORD", "").strip()
    to = [a.strip() for a in os.getenv("RECIPIENT_EMAIL", "").split(",") if a.strip()]
    if not (user and password and to):
        print("Gmail nustatymų nėra – ataskaita bus paskelbta kaip GitHub Issue komentaras.")
        (ROOT / "report.md").write_text(f"**{subject}**\n\n```\n{body}\n```\n", encoding="utf-8")
        output("fallback", "true")
        finish(today, forced, keep)
        return 0
    liq_files, liq_date = liquidity_attachments()
    if liq_files:
        subject += " · likvidumo analizė"
        body += (f"\n\nPridėta: SEB pensijų fondų likvidumo analizė pagal {liq_date} LB portfelius (Excel su matricomis "
                 "ir laiško projektai A/B). Laiškas kolegoms niekur neišsiųstas – peržiūrėkite ir siųskite patys.")
    msg = MIMEMultipart()
    msg.attach(MIMEText(body, "plain", "utf-8"))
    for f in liq_files:
        part = MIMEApplication(Path(f).read_bytes(), Name=Path(f).name)
        part["Content-Disposition"] = f'attachment; filename="{Path(f).name}"'
        msg.attach(part)
    msg["Subject"], msg["From"], msg["To"], msg["Date"] = subject, user, ", ".join(to), formatdate(localtime=True)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.sendmail(user, to, msg.as_string())
    print(f"Išsiųsta: {subject}")
    finish(today, forced, keep, **({"liq": liq_date} if liq_date else {}))
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "send":
        sys.exit(send())
    s, b = build()
    print(s, "\n", b, sep="\n")
