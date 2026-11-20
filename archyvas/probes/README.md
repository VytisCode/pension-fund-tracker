# Senos šaltinių patikros (probe_*.py)

Vienkartiniai tyrimai, kuriais 2026-10–11 buvo tikrinami šaltiniai (valdytojų puslapiai, LB, manapensija.lv, pensionikeskus.ee ir kt.).
Perkelti iš `tools/` 2026-11-20, kad nesimaišytų su veikiančiu kodu. Niekas jų neimportuoja.
Nauja patikra rašoma `tools/probe_<tema>.py` ir paleidžiama per Actions „Probe III pillar sources“ (`script` = failo vardas);
senas galima paleisti taip pat – darbo eiga ieško ir šiame aplanke (kai kurios importuoja `tools/` modulius pagal seną vietą).
