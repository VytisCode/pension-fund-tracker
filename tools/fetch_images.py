"""Naujo dizaino šalių nuotraukos iš Unsplash (savininkas išrinko 2026-11-10).

Paleidžia .github/workflows/fetch_images.yml (Claude aplinka Unsplash nepasiekia). Kiekvienai nuotraukai:
licencijos patikra per unsplash.com/napi (Unsplash+ / premium – praleidžiama), parsisiuntimas, apkirpimas 1600×600,
įrašymas į site/img/ctry-<šalis>-<nr>.jpg ir autorius į site/img/CREDITS.md. Esamų failų neperrašo (nebent --force).
"""
import io, json, sys, urllib.request
from pathlib import Path
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / "site" / "img"
# (failo vardas, tiesioginis images.unsplash.com adresas, autorius, puslapis). unsplash.com iš Actions grąžina 401,
# todėl adresai surinkti iš anksto (napi, 2026-11-10); Unsplash+ (plus.unsplash.com) nuotraukos neįtrauktos:
# B4iaEyTgd0s (LV), ruooYeijjuc (EE), 22hpkhwWiXU (Kelias į pensiją) – mokamos.
U = "https://images.unsplash.com/photo-"
PHOTOS = [
    ("ctry-lt-1", U + "1761063816232-96f33e695227", "Vitalijs Barilo", "pCVeozgbhK8"),
    ("ctry-lt-2", U + "1667072464942-14b7c14622e8", "Piotr AMS", "vf3rllRAyiM"),
    ("ctry-lt-3", U + "1620480012482-71e8db98bfea", "Unsplash", ""),
    ("ctry-lv-1", U + "1686739366785-e50ee0b7e15a", "Raimond Klavins", "TxQlC_xdW6I"),
    ("ctry-lv-2", U + "1567669721460-221b82865ee0", "Darya Tryfanava", "uft-MemToy0"),
    ("ctry-ee-1", U + "1575561003164-f36f2e28a524", "Leo Roomets", "byPcCP45G_o"),
    ("ctry-ee-2", U + "1576356188000-90fe50405e65", "Julius Jansson", "4AwK3OeU6jQ"),
    ("sec2-results", U + "1618044733300-9472054094ee", "Markus Spiske", "XrIfY_4cK1w"),
    ("sec2-facts", U + "1647510283829-fb1ee4ce42cb", "Sortter", "qbHOMOKgPI0"),
    ("sec2-pf", U + "1579532582937-16c108930bf6", "Annie Spratt", "tuJ3tXSayco"),
    ("sec2-news", U + "1738739905706-2cc26e57f67d", "Cemrecan Yurtman", "zMxGeLo-VC8"),
    ("sec2-mgr", U + "1707823942892-3316eeb091a0", "Declan Sun", "8UDnSkjGqGU"),
    ("sec2-aum", U + "1591081658714-f576fb7ea3ed", "Ivars Utināns", "vkQgb1lZZPQ"),
    ("sec2-aum-2", U + "1508233620467-f79f1e317a05", "Jack Anstey", "zS4lUqLEiNA"),
    ("sec2-rep", U + "1631557777232-a2632ae3c67d", "2H Media", "3q4V539j_bw"),
    ("sec2-rep-2", U + "1544377193-33dcf4d68fb5", "NORTHFOLK", "Ok76F6yW2iA"),
]
UA = {"User-Agent": "Mozilla/5.0 (compatible; dashboard-image-fetch)"}


def get(url, accept=None):
    h = dict(UA)
    if accept:
        h["Accept"] = accept
    with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=60) as r:
        return r.read(), r.headers.get("Content-Type", ""), r.geturl()


def main(force=False):
    credits = []
    for name, src, who, pid in PHOTOS:
        out = IMG / f"{name}.jpg"
        try:
            url, page = src + "?w=2000&q=85&fm=jpg", f"https://unsplash.com/photos/{pid}" if pid else src
            credits.append(f"- `{name}.jpg` – {who}, {page} (Unsplash License)")
            if out.exists() and not force:
                print(f"{name}: jau yra"); continue
            data, ctype, _ = get(url)
            if "image" not in ctype:
                print(f"{name}: ne paveikslėlis ({ctype})"); continue
            im = Image.open(io.BytesIO(data)).convert("RGB")
            w, h = im.size; tw, th = 1800, 700
            s = max(tw / w, th / h); im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
            l, t = (im.width - tw) // 2, (im.height - th) // 2
            im.crop((l, t, l + tw, t + th)).save(out, "JPEG", quality=80, optimize=True, progressive=True)
            print(f"{name}: įrašyta {out.stat().st_size // 1024} KB")
        except Exception as e:  # viena nepavykusi nuotrauka nestabdo kitų
            print(f"{name}: klaida {e}")
    (IMG / "CREDITS.md").write_text("# Nuotraukų autoriai\n\n" + "\n".join(credits) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main("--force" in sys.argv)
