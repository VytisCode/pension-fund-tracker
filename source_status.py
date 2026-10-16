#!/usr/bin/env python3
"""
Šaltinių būsena (data/source_status.json): kiekvienam automatiniam šaltiniui – kada paskutinį kartą pavyko, kada
paskutinį kartą nepavyko ir kokia buvo klaida. Svetainė iš to paaiškina vėlavimą („šaltinis nepasiekiamas nuo …“,
„laukiama, kol paskelbs“), o ne tik rodo seną datą. Klaidos tekstas trumpinamas ir išvalomas nuo slaptažodžių.

  import source_status as st
  st.ok("idx.SP500", detail="Yahoo query2")      # pavyko
  st.fail("idx.SP500", exc)                      # nepavyko (exc – išimtis arba tekstas)
"""
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

PATH = Path(__file__).parent / "data" / "source_status.json"


def _load() -> dict:
    try:
        return json.loads(PATH.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _today() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _clean(msg: str) -> str:
    msg = re.sub(r"https?://\S+", "<url>", str(msg))                 # nuorodose gali būti raktų
    msg = re.sub(r"[\w.-]+:[^@\s]+@", "", msg)                        # user:pass@
    return msg.strip()[:160]


def _save(data: dict) -> None:
    # Įrašoma tik kasdieniame GitHub paleidime: kūrimo aplinkose šaltiniai dažnai užblokuoti, o jų „klaidos“
    # neturi patekti į svetainę. Bandymams: SOURCE_STATUS_WRITE=1.
    if os.getenv("GITHUB_ACTIONS") != "true" and os.getenv("SOURCE_STATUS_WRITE") != "1":
        return
    try:
        PATH.parent.mkdir(exist_ok=True)
        PATH.write_text(json.dumps(data, ensure_ascii=False, indent=1, sort_keys=True) + "\n", encoding="utf-8")
    except Exception as exc:                                         # būsenos įrašas niekada nestabdo rinkimo
        print(f"source_status: nepavyko įrašyti ({exc})")


def ok(key: str, detail: str = "") -> None:
    data = _load()
    old = dict(data.get(key, {}))
    cur = {"ok": _today()}
    if detail:
        cur["detail"] = _clean(detail)
    data[key] = cur                                                   # sėkmė panaikina ankstesnę klaidą
    if cur != old:
        _save(data)


def fail(key: str, err, kind: str = "") -> None:
    """kind – klaidos rūšis svetainės paaiškinimui: 'blocked' (šaltinis atmeta), 'auth' (baigėsi prieiga),
    'network', 'format' (pasikeitė puslapis), arba tuščia – nustatoma pagal tekstą.
    since – pirmoji šios klaidų serijos diena (svetainė rodo „nepavyksta nuo …“)."""
    msg = f"{err.__class__.__name__}: {err}" if isinstance(err, BaseException) else str(err)
    if not kind:
        low = msg.lower()
        kind = ("auth" if re.search(r"\b40[27]\b|proxy auth|payment|expired", low) else
                "blocked" if re.search(r"\b403\b|\b429\b|too many|forbidden|captcha|cloudflare", low) else
                "network" if re.search(r"timeout|timed out|urlerror|connection|resolve|unreachable|\b5\d\d\b", low) else
                "format" if re.search(r"keyerror|indexerror|valueerror|json|parse", low) else "other")
    data = _load()
    old = dict(data.get(key, {}))
    cur = dict(old)
    cur.update({"err": _today(), "since": old.get("since") if old.get("err") else _today(), "msg": _clean(msg), "kind": kind})
    data[key] = cur
    if cur != old:                                                    # įrašoma tik pasikeitus – ne kas paleidimą
        _save(data)


def load() -> dict:
    return _load()


if __name__ == "__main__":
    print(json.dumps(_load(), ensure_ascii=False, indent=1))
