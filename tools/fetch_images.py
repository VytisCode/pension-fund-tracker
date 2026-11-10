"""Naujo dizaino šalių nuotraukos iš Unsplash (savininkas išrinko 2026-11-10).

Paleidžia .github/workflows/fetch_images.yml (Claude aplinka Unsplash nepasiekia). Kiekvienai nuotraukai:
licencijos patikra per unsplash.com/napi (Unsplash+ / premium – praleidžiama), parsisiuntimas, apkirpimas 1600×600,
įrašymas į site/img/ctry-<šalis>-<nr>.jpg ir autorius į site/img/CREDITS.md. Esamų failų neperrašo (nebent --force).
"""
import io, json, sys, urllib.request
from pathlib import Path
from PIL import Image

IMG = Path(__file__).resolve().parent.parent / "site" / "img"
# (failo vardas, Unsplash nuotraukos id arba tiesioginis images.unsplash.com adresas)
PHOTOS = [
    ("ctry-lt-1", "pCVeozgbhK8"), ("ctry-lt-2", "vf3rllRAyiM"),
    ("ctry-lt-3", "https://images.unsplash.com/photo-1620480012482-71e8db98bfea"),
    ("ctry-lv-1", "B4iaEyTgd0s"), ("ctry-lv-2", "TxQlC_xdW6I"), ("ctry-lv-3", "uft-MemToy0"),
    ("ctry-ee-1", "byPcCP45G_o"), ("ctry-ee-2", "4AwK3OeU6jQ"), ("ctry-ee-3", "ruooYeijjuc"),
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
    for name, src in PHOTOS:
        out = IMG / f"{name}.jpg"
        try:
            if src.startswith("http"):
                url, who, page, ok = src + "?w=2000&q=85&fm=jpg", "Unsplash", src, src.startswith("https://images.unsplash.com/photo-")
            else:
                meta = json.loads(get(f"https://unsplash.com/napi/photos/{src}", "application/json")[0])
                ok = not (meta.get("premium") or meta.get("plus"))
                url = meta["urls"]["raw"] + "&w=2000&q=85&fm=jpg"
                who, page = meta["user"]["name"], meta["links"]["html"]
            if not ok:
                print(f"{name}: {src} – Unsplash+ (mokama), praleidžiama"); continue
            credits.append(f"- `{name}.jpg` – {who}, {page} (Unsplash License)")
            if out.exists() and not force:
                print(f"{name}: jau yra"); continue
            data, ctype, _ = get(url)
            if "image" not in ctype:
                print(f"{name}: ne paveikslėlis ({ctype})"); continue
            im = Image.open(io.BytesIO(data)).convert("RGB")
            w, h = im.size; tw, th = 1600, 600
            s = max(tw / w, th / h); im = im.resize((round(w * s), round(h * s)), Image.LANCZOS)
            l, t = (im.width - tw) // 2, (im.height - th) // 2
            im.crop((l, t, l + tw, t + th)).save(out, "JPEG", quality=80, optimize=True, progressive=True)
            print(f"{name}: įrašyta {out.stat().st_size // 1024} KB")
        except Exception as e:  # viena nepavykusi nuotrauka nestabdo kitų
            print(f"{name}: klaida {e}")
    (IMG / "CREDITS.md").write_text("# Nuotraukų autoriai\n\n" + "\n".join(credits) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main("--force" in sys.argv)
