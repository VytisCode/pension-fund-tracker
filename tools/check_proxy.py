#!/usr/bin/env python3
"""
Luminor proxy (Proxy-Cheap) patikra: vienas mažas užklausimas per proxy, kad svetainė galėtų aiškiai pasakyti
„Luminor duomenų negaunama, nes proxy prieiga nebeveikia (gal baigėsi prenumerata)“, o ne tik rodyti seną datą.
Rezultatas – data/source_status.json raktas „proxy“ (žr. source_status.py). Niekada nesustabdo paleidimo.

Proxy formatai kaip sources/luminor_pensions.py: HOST:PORT:USER:PASS, USER:PASS@HOST:PORT arba http://…
"""
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import source_status  # noqa: E402

TEST_URL = "http://api.ipify.org"          # mažas atsakymas (tik IP adresas), mažai naudoja proxy srauto


def proxy_url() -> str:
    server = os.getenv("LUMINOR_PROXY_SERVER", "").strip().strip("'\"")
    user = os.getenv("LUMINOR_PROXY_USERNAME", "").strip().strip("'\"")
    pw = os.getenv("LUMINOR_PROXY_PASSWORD", "").strip().strip("'\"")
    if not server:
        return ""
    parts = server.split(":")
    if len(parts) == 4 and parts[1].isdigit() and not re.match(r"^[a-zA-Z][\w+.-]*://", server):
        server, user, pw = f"{parts[0]}:{parts[1]}", user or parts[2], pw or parts[3]
    if "@" in server and not re.match(r"^[a-zA-Z][\w+.-]*://", server):
        auth, server = server.rsplit("@", 1)
        if ":" in auth and not user:
            user, pw = auth.split(":", 1)
    if not re.match(r"^[a-zA-Z][\w+.-]*://", server):
        server = "http://" + server
    if user and "@" not in server:
        p = urllib.parse.urlsplit(server)
        server = f"{p.scheme}://{urllib.parse.quote(user)}:{urllib.parse.quote(pw)}@{p.netloc}"
    return server


def main() -> None:
    url = proxy_url()
    if not url:
        source_status.fail("proxy", "proxy nenurodytas (GitHub Secrets LUMINOR_PROXY_SERVER tuščias)", "auth")
        print("Proxy: nenurodytas")
        return
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({"http": url, "https": url}))
    try:
        with opener.open(TEST_URL, timeout=30) as r:
            r.read(64)
        source_status.ok("proxy")
        print("Proxy: veikia")
    except urllib.error.HTTPError as e:
        kind = "auth" if e.code in (402, 403, 407) else "network"
        source_status.fail("proxy", f"HTTP {e.code} {e.reason}", kind)
        print(f"Proxy: HTTP {e.code}")
    except Exception as e:  # noqa: BLE001
        msg = str(e)
        kind = "auth" if re.search(r"\b40[27]\b", msg) else "network"
        source_status.fail("proxy", e, kind)
        print(f"Proxy: nepavyko ({e.__class__.__name__})")


if __name__ == "__main__":
    main()
