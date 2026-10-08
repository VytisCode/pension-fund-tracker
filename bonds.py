"""
Obligacijų pajamingumas (YTM) ir modifikuota trukmė (duration) kiekvieno ketvirčio pabaigoje.

Duomenys:
- data/security_terms.csv (tools/fetch_security_terms.py, ESMA FIRDS): išpirkimo data, fiksuota palūkanų norma, ar kintama;
- kaina iš LB portfelių ataskaitos: vertė ÷ nominalas (su sukauptomis palūkanomis, t. y. „dirty“).

Prielaidos: EUR ir kitų Europos valiutų obligacijos moka kuponą kartą per metus, USD – du kartus; dienų skaičiavimas ACT/365.
Kintamų palūkanų (FRN) obligacijoms YTM neskaičiuojamas (trukmė ≈ 0), nerealios reikšmės atmetamos.
"""
import csv
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TERMS = ROOT / "data" / "security_terms.csv"


def load_terms() -> dict:
    if not TERMS.exists():
        return {}
    with TERMS.open(encoding="utf-8", newline="") as f:
        return {r["isin"]: r for r in csv.DictReader(f)}


def _add_months(d: date, m: int) -> date:
    y, mo = divmod(d.month - 1 + m, 12)
    y += d.year
    day = min(d.day, [31, 29 if y % 4 == 0 and (y % 100 or y % 400 == 0) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo])
    return date(y, mo + 1, day)


def flows(settle: date, maturity: date, coupon: float, freq: int) -> list:
    """[(metai iki mokėjimo, suma 100 nominalo)] – kuponų datos skaičiuojamos atgal nuo išpirkimo."""
    out, k = [], 0
    while True:
        d = _add_months(maturity, -12 // freq * k)
        if d <= settle:
            break
        out.append(((d - settle).days / 365, coupon / freq + (100 if k == 0 else 0)))
        k += 1
    return out[::-1]


def ytm(dirty: float, cf: list, freq: int):
    """Pajamingumas (metinis, % su freq kartų kapitalizacija) ir modifikuota trukmė (metais)."""
    pv = lambda y: sum(c / (1 + y / freq) ** (freq * t) for t, c in cf)
    lo, hi = -0.05, 0.6
    if not (pv(hi) < dirty < pv(lo)):
        return None
    for _ in range(80):
        mid = (lo + hi) / 2
        lo, hi = (mid, hi) if pv(mid) > dirty else (lo, mid)
    y = (lo + hi) / 2
    p = pv(y)
    mac = sum(t * c / (1 + y / freq) ** (freq * t) for t, c in cf) / p
    return y * 100, mac / (1 + y / freq)


def metrics(isin: str, qdate: str, value: float, qty: float, cur: str, terms: dict):
    """(YTM %, modifikuota trukmė, metai iki išpirkimo, kuponas) arba None, jei apskaičiuoti negalima."""
    t = terms.get(isin)
    if not t or not t.get("maturity") or not qty or qty <= 0 or value <= 0:
        return None
    settle, mat = date.fromisoformat(qdate), date.fromisoformat(t["maturity"])
    if mat <= settle or mat.year > 2100:
        return None
    years = (mat - settle).days / 365
    if t.get("floating") == "1" or not t.get("coupon"):
        return None if t.get("floating") != "1" else (None, 0.0, years, None)
    price = value / qty * 100
    if price > 2000 and t.get("nominal_unit"):            # kiekis nurodytas vienetais, ne nominalu
        price /= float(t["nominal_unit"])
    if not 30 <= price <= 160:
        return None
    coupon = float(t["coupon"])
    freq = 2 if (t.get("currency") or cur) == "USD" else 1
    r = ytm(price, flows(settle, mat, coupon, freq), freq)
    if not r or not -2 < r[0] < 30:
        return None
    return r[0], r[1], years, coupon
