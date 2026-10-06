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
from datetime import datetime
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


def build() -> tuple:
    existing = store.load()
    expected = u.expected_date()
    today = f"{datetime.now(u.TZ):%Y-%m-%d}"
    lines2, missing = provider_lines(existing, expected)
    state = u.load_state().get(today, {})
    subject = (f"Pensijų fondai {today}: " +
               ("viskas atnaujinta" if not missing else "trūksta – " + ", ".join(missing)))
    body = [f"Dienos ataskaita, {today}. Laukiama fondų vertė už {expected}.", "",
            "II pakopa:"] + lines2
    body += ["", "III pakopa:"] + pillar3_lines()
    if state.get("LUMINOR"):
        body += ["", f"Luminor bandymų šiandien: {state['LUMINOR']} iš {u.MAX_BROWSER_ATTEMPTS}."]
    problems = todays_problems(today)
    body += ["", "Klaidos ir pastabos šiandien:"] + (problems or ["  nėra"])
    runs = runs_today(today)
    if runs:
        body += ["", runs]
    body += ideas_section()
    body += ["", f"Svetainė: {SITE_URL}"]
    return subject, mask("\n".join(body))


def already_sent(today: str) -> bool:
    try:
        return json.loads(REPORT_STATE.read_text(encoding="utf-8")).get("last_sent") == today
    except (OSError, ValueError):
        return False


def mark_sent(today: str) -> None:
    REPORT_STATE.write_text(json.dumps({"last_sent": today}, indent=1) + "\n", encoding="utf-8")


def finish(today: str, forced: bool, keep: str) -> None:
    """Bandomasis (ranka paprašytas) laiškas nepažymi dienos kaip atliktos – vakarinė ataskaita vis tiek bus išsiųsta."""
    if forced and keep:
        REPORT_STATE.write_text(keep, encoding="utf-8")
    elif not forced:
        mark_sent(today)


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
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"], msg["From"], msg["To"], msg["Date"] = subject, user, ", ".join(to), formatdate(localtime=True)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.sendmail(user, to, msg.as_string())
    print(f"Išsiųsta: {subject}")
    finish(today, forced, keep)
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "send":
        sys.exit(send())
    s, b = build()
    print(s, "\n", b, sep="\n")
