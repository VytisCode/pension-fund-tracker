#!/usr/bin/env python3
"""
Allianz bandomasis zondas (vienkartinis): išsiaiškina, ar iš
/snippets/pensiju-fondai galima gauti vieneto vertes pasirinktai datai.

Žingsniai: 1) atsisiunčia puslapį (slapukas + CSRF), 2) išrašo formos laukus,
3) siunčia POST kelioms datoms, 4) viską išsaugo į data/probe/ ir parašo santrauką.
"""
import http.cookiejar
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://investavimorezultatai.allianz.lt"
PAGE = f"{BASE}/?tipas=gyvenimo-ciklo-pensiju-fondai"
ENDPOINT = f"{BASE}/snippets/pensiju-fondai"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
DATES = ["2020-09-30", "2023-06-15", "2026-10-01"]
OUT = Path(__file__).parent / "data" / "probe"


def strip_tags(html: str) -> str:
    return " ".join(re.sub(r"<[^>]+>", " ", html).split())


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    report = []
    jar = http.cookiejar.CookieJar()
    opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
    opener.addheaders = [("User-Agent", UA), ("Accept-Language", "lt-LT,lt;q=0.9")]

    try:
        page = opener.open(PAGE, timeout=60).read().decode("utf-8", errors="replace")
    except Exception as exc:  # noqa: BLE001
        print(f"Puslapio atsisiųsti nepavyko: {exc}")
        (OUT / "allianz_report.txt").write_text(f"GET klaida: {exc}\n", encoding="utf-8")
        return 1
    (OUT / "allianz_page.html").write_text(page, encoding="utf-8")
    report.append(f"GET puslapis: {len(page)} simbolių, slapukų: {len(jar)}")

    token_match = re.search(r'name="csrf-token"\s+content="([^"]+)"', page) or re.search(
        r'content="([^"]+)"\s+name="csrf-token"', page
    )
    token = token_match.group(1) if token_match else ""
    report.append(f"CSRF žetonas rastas: {bool(token)}")

    form_match = re.search(r'<form[^>]*id="pf"[^>]*>(.*?)</form>', page, re.S)
    fields = {}
    if form_match:
        for tag in re.findall(r"<input[^>]*>", form_match.group(1)):
            name = re.search(r'name="([^"]*)"', tag)
            value = re.search(r'value="([^"]*)"', tag)
            ident = re.search(r'id="([^"]*)"', tag)
            if name:
                fields[name.group(1)] = value.group(1) if value else ""
                report.append(f"  forma: name={name.group(1)!r} id={ident.group(1) if ident else None!r} value={fields[name.group(1)]!r}")
    else:
        report.append("Forma #pf pradiniame HTML nerasta (gali būti kraunama skriptu)")
    report.append(f"Visi <input name=...> puslapyje: {sorted(set(re.findall(r'<input[^>]*name=\"([^\"]+)\"', page)))}")

    for day in DATES:
        data = dict(fields)
        # Datos laukas: bandome rasti pagal pavadinimą, kitaip naudojame "inpDate"
        date_key = next((k for k in data if "date" in k.lower()), "inpDate")
        data[date_key] = day
        data.setdefault("direction", "")
        if token:
            data.setdefault("_token", token)
        body = urllib.parse.urlencode(data).encode()
        request = urllib.request.Request(
            ENDPOINT,
            data=body,
            headers={
                "X-CSRF-TOKEN": token,
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Referer": PAGE,
                "Origin": BASE,
                "Accept": "text/html, */*; q=0.01",
            },
            method="POST",
        )
        try:
            response = opener.open(request, timeout=60)
            status = response.status
            html = response.read().decode("utf-8", errors="replace")
        except urllib.error.HTTPError as exc:
            status = exc.code
            html = exc.read().decode("utf-8", errors="replace")
        except Exception as exc:  # noqa: BLE001
            status, html = "klaida", str(exc)
        (OUT / f"allianz_post_{day}.html").write_text(html, encoding="utf-8")
        text = strip_tags(html)
        report.append(
            f"POST {day} (laukas {date_key!r}): statusas {status}, {len(html)} simbolių, "
            f"randa 'Allianz': {'Allianz' in html}\n    pradžia: {text[:400]}"
        )

    (OUT / "allianz_report.txt").write_text("\n".join(report) + "\n", encoding="utf-8")
    print("\n".join(report))
    return 0


if __name__ == "__main__":
    sys.exit(main())
