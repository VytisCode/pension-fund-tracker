# Vienkartiniai istorinių duomenų importai

Jau įvykdyti istorinių failų importai (savininko CSV/PDF, Goindex, Luminor, SEB, Swedbank, turto grafikų duomenys) – perkelti
iš šakninio aplanko 2026-11-20. Veikiantys importai liko vietoje: `import_lb_fees.py` (naudoja `fetch_lb.py`, `build_site.py`),
`backfill_allianz.py`, `backfill_artea.py` (naudoja `update.py` ir darbo eigos).
Prireikus paleisti iš naujo – grąžinti į šakninį aplanką (`git mv archyvas/importai/<failas> .`).
