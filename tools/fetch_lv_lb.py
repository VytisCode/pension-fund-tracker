"""Latvijas Banka statistika: Latvijos pensijų sistemos grynieji aktyvai ketvirčio pabaigoje (statdb.bank.lv lentelė 325
„Pensiju fondu un plānu bilance“): II pakopa („Valsts fondēto pensiju shēmas līdzekļi“) ir III pakopa („Privātie pensiju plāni“),
tūkst. € -> data/baltic_lv_lb.csv (tik papildoma; esamos reikšmės neperrašomos).

Kiekvieno plāno duomenų banko statistikoje nėra – jie imami iš valdytojų ketvirčio ataskaitų (fetch_lv_reports.py); ši lentelė –
visos rinkos suma ir jų patikra. CSV atsisiunčiamas per puslapio „Eksportēt CSV“ (ASP.NET postback), todėl reikia Playwright.

Naudojimas: python tools/fetch_lv_lb.py [aplankas] [--file lentelė.csv]   (--file – skaityti jau atsisiųstą CSV)
"""
import csv
import io
import re
import sys
import tempfile
from datetime import date
from pathlib import Path

args = [a for a in sys.argv[1:] if not a.startswith("--")]
SRC = sys.argv[sys.argv.index("--file") + 1] if "--file" in sys.argv else None
args = [a for a in args if a != SRC]
OUT = Path(args[0]) if args else Path(__file__).resolve().parent.parent / "data"
TODAY = date.today().isoformat()
FIELDS = ["quarter", "pillar", "net_assets_k", "assets_k", "first_seen"]
QEND = {"I": "03-31", "II": "06-30", "III": "09-30", "IV": "12-31"}
SCHEME = {"Valsts fondēto pensiju shēmas līdzekļi": "II", "Privātie pensiju plāni": "III"}


def download():
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(accept_downloads=True)
        pg.goto("https://statdb.bank.lv/LB/Data/325", timeout=90000)
        pg.wait_for_timeout(2000)
        with pg.expect_download(timeout=90000) as d:
            pg.evaluate("__doPostBack('ctl00$ctl00$Main$Main$lnkCsv','')")
        f = Path(tempfile.mkdtemp()) / "325.csv"
        d.value.save_as(f)
        b.close()
    return f.read_bytes()


def parse(raw):
    rows = list(csv.reader(io.StringIO(raw.decode("cp1257"))))
    per = next(r for r in rows if any(re.fullmatch(r"(I|II|III|IV) / \d{4}", c.strip()) for c in r))
    sch = rows[rows.index(per) + 1]
    cols, cur = {}, None
    for j in range(len(per)):
        m = re.fullmatch(r"(I|II|III|IV) / (\d{4})", per[j].strip())
        cur = f"{m.group(2)}-{QEND[m.group(1)]}" if m else cur
        s = SCHEME.get(sch[j].strip()) if j < len(sch) else None
        if cur and s:
            cols[j] = (cur, s)
    get = lambda lab: next((r for r in rows if r and r[0].strip().upper().startswith(lab)), None)
    net, tot = get("NETO AKT"), get("AKTĪVI (TOTAL)")
    out = {}
    for j, (q, s) in cols.items():
        v = net[j].strip() if net and j < len(net) else ""
        if v:
            out[(q, s)] = {"quarter": q, "pillar": s, "net_assets_k": v, "assets_k": tot[j].strip() if tot and j < len(tot) else "", "first_seen": TODAY}
    return out


def main():
    new = parse(Path(SRC).read_bytes() if SRC else download())
    path = OUT / "baltic_lv_lb.csv"
    old = {(r["quarter"], r["pillar"]): r for r in csv.DictReader(path.open(encoding="utf-8"))} if path.exists() else {}
    add = 0
    for k, r in new.items():
        if k not in old:
            old[k] = r; add += 1
        else:
            for f, v in r.items():
                if v and not old[k].get(f):
                    old[k][f] = v
    with path.open("w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, FIELDS)
        w.writeheader()
        for k in sorted(old):
            w.writerow(old[k])
    print(f"baltic_lv_lb.csv: +{add}, iš viso {len(old)}; naujausias {max(old)}")


if __name__ == "__main__":
    main()
