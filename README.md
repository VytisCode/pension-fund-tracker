# pension-fund-tracker

Privatus Lietuvos II ir III pakopos pensijų fondų sekimo projektas: kasdien surenka fondų vieneto vertes, kaupia istoriją nuo 2019 m. ir rodo rezultatus svetainėje (GitHub Pages iš `docs/`).

- Kasdienis rinkimas: `update.py` per `.github/workflows/update.yml` („Update fund data“). `python update.py status` parodo, ko trūksta.
- Svetainė: šaltinis `site/`, `python build_site.py` sugeneruoja `docs/` (jo ranka netaisyti).
- Istorija: `data/nav_history.csv` (II pakopa), `data/pillar3_history.csv` (III pakopa).
- Raktai tik GitHub Secrets: `GOINDEX_API_SECRET_KEY`, `LUMINOR_PROXY_SERVER`, `LUMINOR_PROXY_USERNAME`, `LUMINOR_PROXY_PASSWORD`.

Darbo taisyklės ir failų žemėlapis – `CLAUDE.md`. Darbų sąrašas – `IDEAS.md`.
