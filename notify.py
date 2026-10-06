"""Trumpas laiškas savininkui po kiekvieno Claude vystymo ciklo.

Paleidžiama per GitHub Actions darbo eigą „Cycle report“ (notify.yml), kurią
ciklo pabaigoje paleidžia Claude. Tema ir tekstas gaunami per SUBJECT ir BODY.
Naudojami tie patys Secrets kaip ir dienos ataskaitai: GMAIL_USER, GMAIL_PASSWORD, RECIPIENT_EMAIL.
"""
import os
import smtplib
import sys
from email.mime.text import MIMEText
from email.utils import formatdate

from daily_report import mask

SITE_URL = "https://vytiscode.github.io/pension-fund-tracker/"


def main() -> int:
    subject = os.getenv("SUBJECT", "").strip() or "Claude vystymo ciklas"
    body = os.getenv("BODY", "").strip()
    if not body:
        print("Laiško tekstas tuščias – nesiunčiama.")
        return 1
    body = mask(body + f"\n\nSvetainė: {SITE_URL}")
    user, password = os.getenv("GMAIL_USER", "").strip(), os.getenv("GMAIL_PASSWORD", "").strip()
    to = [a.strip() for a in os.getenv("RECIPIENT_EMAIL", "").split(",") if a.strip()]
    if not (user and password and to):
        print("Gmail nustatymų (Secrets) nėra – laiškas neišsiųstas.\n\n" + subject + "\n\n" + body)
        return 1
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"], msg["From"], msg["To"], msg["Date"] = subject, user, ", ".join(to), formatdate(localtime=True)
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=60) as smtp:
        smtp.login(user, password)
        smtp.sendmail(user, to, msg.as_string())
    print(f"Išsiųsta: {subject}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
