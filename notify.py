"""Trumpas laiškas savininkui po kiekvieno Claude vystymo ciklo.

Paleidžiama per GitHub Actions darbo eigą „Cycle report“ (notify.yml), kurią
ciklo pabaigoje paleidžia Claude. Tema ir tekstas gaunami per SUBJECT ir BODY.
Naudojami tie patys Secrets kaip ir dienos ataskaitai: GMAIL_USER, GMAIL_PASSWORD, RECIPIENT_EMAIL.

Visi ciklų laiškai siunčiami į vieną laiškų giją (savininko prašymas 2026-10-07):
tema visada ta pati, o laiškas yra atsakymas į paskutinį išsiųstą tos gijos laišką.
Ciklo tema (SUBJECT) perkeliama į pirmą teksto eilutę.
"""
import email
import imaplib
import os
import re
import smtplib
import sys
from email.mime.text import MIMEText
from email.utils import formatdate, make_msgid

from daily_report import mask

SITE_URL = "https://vytiscode.github.io/pension-fund-tracker/"
THREAD_SUBJECT = "Claude vystymo ciklų ataskaitos"
# Jei paskutinio laiško rasti nepavyksta, visi laiškai vis tiek nurodo tą patį „pradžios“ ID.
ROOT_ID = "<claude-cycle-reports@pension-fund-tracker>"


def last_sent(user: str, password: str):
    """Paskutinio išsiųsto gijos laiško (Message-ID, References) iš Gmail „Išsiųsti“."""
    try:
        with imaplib.IMAP4_SSL("imap.gmail.com", 993, timeout=60) as imap:
            imap.login(user, password)
            _, folders = imap.list()
            sent = next((re.search(rb'"([^"]+)"$', f).group(1).decode() for f in folders or []
                         if b"\\Sent" in f), "[Gmail]/Sent Mail")
            imap.select(f'"{sent}"', readonly=True)
            _, data = imap.search(None, "SUBJECT", '"Claude vystymo cikl"')
            ids = data[0].split() if data and data[0] else []
            if not ids:
                return None
            _, msg_data = imap.fetch(ids[-1], "(BODY.PEEK[HEADER.FIELDS (MESSAGE-ID REFERENCES)])")
            head = email.message_from_bytes(msg_data[0][1])
            return head.get("Message-ID", "").strip(), " ".join(head.get("References", "").split())
    except Exception as e:  # IMAP nepasiekiamas – siunčiama su ROOT_ID
        print(f"Paskutinio gijos laiško rasti nepavyko: {e}")
        return None


def main() -> int:
    subject = os.getenv("SUBJECT", "").strip() or "Claude vystymo ciklas"
    body = os.getenv("BODY", "").strip()
    if not body:
        print("Laiško tekstas tuščias – nesiunčiama.")
        return 1
    body = mask(f"{subject}\n{'=' * min(len(subject), 60)}\n\n{body}\n\nSvetainė: {SITE_URL}")
    user, password = os.getenv("GMAIL_USER", "").strip(), os.getenv("GMAIL_PASSWORD", "").strip()
    to = [a.strip() for a in os.getenv("RECIPIENT_EMAIL", "").split(",") if a.strip()]
    if not (user and password and to):
        print("Gmail nustatymų (Secrets) nėra – laiškas neišsiųstas.\n\n" + body)
        return 1
    parent_id, refs = last_sent(user, password) or (ROOT_ID, "")
    refs = refs if ROOT_ID in refs else f"{ROOT_ID} {refs}".strip()
    if parent_id and parent_id not in refs:
        refs = f"{refs} {parent_id}"
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = "Re: " + THREAD_SUBJECT
    msg["From"], msg["To"], msg["Date"] = user, ", ".join(to), formatdate(localtime=True)
    msg["Message-ID"] = make_msgid(domain="pension-fund-tracker")
    msg["In-Reply-To"], msg["References"] = parent_id, refs
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.sendmail(user, to, msg.as_string())
    print(f"Išsiųsta: {subject} (atsakymas į {parent_id})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
