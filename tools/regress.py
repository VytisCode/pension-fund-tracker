"""Regresijos patikra: ar po kodo pakeitimų svetainės skaičiai liko tie patys.

  python tools/regress.py save  [failas]   # po `python build_site.py` – įsimena docs/ turinį (numatyta /tmp/regress_base.json)
  python tools/regress.py check [failas]   # po pakeitimų ir build – parodo, kurie failai skiriasi

Lyginami visi docs/ failai (JS duomenys, HTML, Excel .xlsx turinys, JSON, CSV), išskyrus tai, kas keičiasi
kiekvieną build'ą: `?v=` maišos ir „sugeneruota“ laikas (YYYY-MM-DD HH:MM). Excel – lyginami lapų XML, be
docProps (sukūrimo laikas). Skaičiai, datos ir tekstai lyginami tiksliai.
"""
import hashlib, json, re, sys, zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SKIP_EXT = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".woff", ".woff2", ".ico", ".gif"}
RX = [(re.compile(rb"\?v=[0-9a-f]{6,40}"), b"?v=X"),
      (re.compile(rb"\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?"), b"TS")]


def norm(b: bytes) -> bytes:
    for rx, rep in RX:
        b = rx.sub(rep, b)
    return b


def digest(p: Path) -> str:
    h = hashlib.sha1()
    if p.suffix == ".xlsx":
        with zipfile.ZipFile(p) as z:
            for n in sorted(z.namelist()):
                if n.startswith("docProps/"):
                    continue
                h.update(n.encode()); h.update(norm(z.read(n)))
    else:
        h.update(norm(p.read_bytes()))
    return h.hexdigest()


def snap() -> dict:
    return {str(p.relative_to(DOCS)): digest(p) for p in sorted(DOCS.rglob("*"))
            if p.is_file() and p.suffix.lower() not in SKIP_EXT}


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "check"
    f = Path(sys.argv[2] if len(sys.argv) > 2 else "/tmp/regress_base.json")
    if cmd == "save":
        s = snap(); f.write_text(json.dumps(s, indent=0)); print(f"įsiminta {len(s)} failų -> {f}"); return
    base, now = json.loads(f.read_text()), snap()
    diff = sorted(k for k in base.keys() | now.keys() if base.get(k) != now.get(k))
    for k in diff:
        print(("NAUJAS " if k not in base else "DINGO " if k not in now else "SKIRIASI ") + k)
    print(f"{len(now)} failų, skiriasi {len(diff)}")
    sys.exit(1 if diff else 0)


if __name__ == "__main__":
    main()
