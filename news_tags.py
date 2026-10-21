"""Naujienų veikėjai (savininkas 2026-10-21: „kurios partijos, organizacijos ar Sodra kokią poziciją turi … kaip ta pozicija keitėsi
laike … verta atkreipti dėmesį ir į pavienius asmenis“, be atskirų asmenų kortelių). Veikėjas priskiriamas, jei jo pavadinimas
(ar žinomos formos) yra antraštėje ar apraše – be AI, todėl tai paminėjimas, ne pozicija; poziciją vertina skaitytojas pagal
antraščių seką. Skaičiuojama kiekvieną kartą kuriant svetainę (data/news.csv nekeičiamas), tad sąrašą galima papildyti bet kada.

ACTORS: (id, grupė, šalis, regex, pavadinimas LT, pavadinimas EN). Grupės: inst – institucijos, party – partijos,
org – organizacijos, mgr – fondų valdytojai, person – komentatoriai (ekonomistai, ekspertai)."""
import re

ACTORS = [
    # Lietuva – institucijos
    ("sodra", "inst", "LT", r"\bsodr", "Sodra", "Sodra"),
    ("sadm", "inst", "LT", r"socialinės apsaugos ir darbo minist|\bSADM\b|socialinės apsaugos minist", "Socialinės apsaugos ir darbo ministerija", "Ministry of Social Security and Labour"),
    ("finmin", "inst", "LT", r"finansų minist", "Finansų ministerija", "Ministry of Finance (LT)"),
    ("seimas", "inst", "LT", r"\bseim", "Seimas", "Seimas (parliament)"),
    ("lrv", "inst", "LT", r"vyriausyb|premjer|ministr\w* pirminink", "Vyriausybė", "Government (LT)"),
    ("prez", "inst", "LT", r"prezident\w*(?! karis)|nausėd", "Prezidentas", "President (LT)"),
    ("lb", "inst", "LT", r"lietuvos bank|centrin\w* bank", "Lietuvos bankas", "Bank of Lithuania"),
    ("kt", "inst", "LT", r"konstitucin\w* teism", "Konstitucinis Teismas", "Constitutional Court (LT)"),
    # Lietuva – organizacijos
    ("lipfa", "org", "LT", r"\bLIPFA\b|investicinių ir pensijų fondų asociacij", "LIPFA", "LIPFA (fund association)"),
    ("unions", "org", "LT", r"profsąjung", "Profesinės sąjungos", "Trade unions (LT)"),
    ("biz", "org", "LT", r"pramonininkų konfederacij|\bLPK\b|verslo konfederacij|darbdavių konfederacij|investuotojų asociacij", "Verslo organizacijos", "Business associations (LT)"),
    ("seniors", "org", "LT", r"pensininkų (sąjung|partij|organizac)|senjorų", "Pensininkų organizacijos", "Pensioner organisations"),
    # Lietuva – partijos
    ("lsdp", "party", "LT", r"socialdemokrat|\bLSDP\b", "Socialdemokratai (LSDP)", "Social Democrats (LSDP)"),
    ("tslkd", "party", "LT", r"konservator|\bTS-LKD\b|tėvynės sąjung", "Konservatoriai (TS-LKD)", "Conservatives (TS-LKD)"),
    ("ls", "party", "LT", r"liberalų sąjūd|\bliberal(ai|ų|ams)\b", "Liberalų sąjūdis", "Liberal Movement"),
    ("lvzs", "party", "LT", r"valstieč|\bLVŽS\b|žaliųjų sąjung", "Valstiečiai (LVŽS)", "Farmers and Greens (LVŽS)"),
    ("na", "party", "LT", r"nemuno auš", "Nemuno aušra", "Dawn of Nemunas"),
    ("dvl", "party", "LT", r"vardan lietuvos|\bdemokrat(ai|ų|ams)\b", "Demokratai „Vardan Lietuvos“", "Democrats “For Lithuania”"),
    ("lp", "party", "LT", r"laisvės partij|laisviet", "Laisvės partija", "Freedom Party"),
    # Lietuva – komentatoriai (be atskirų kortelių – tik kaip veikėjai sąraše)
    ("lazutka", "person", "LT", r"lazutk", "R. Lazutka", "R. Lazutka"),
    ("rukas", "person", "LT", r"\bruk(as|o|ui|ą)\b", "Rukas", "Rukas"),
    ("kuodis", "person", "LT", r"kuod(is|žio|žiu)", "R. Kuodis", "R. Kuodis"),
    ("maciulis", "person", "LT", r"mačiuli", "N. Mačiulis", "N. Mačiulis"),
    ("mauricas", "person", "LT", r"mauric", "Ž. Mauricas", "Ž. Mauricas"),
    ("izgorodinas", "person", "LT", r"izgorodin", "A. Izgorodinas", "A. Izgorodinas"),
    ("povilauskas", "person", "LT", r"povilausk", "T. Povilauskas", "T. Povilauskas"),
    ("genyte", "person", "LT", r"genytė|pikčien", "I. Genytė-Pikčienė", "I. Genytė-Pikčienė"),
    ("dubnikovas", "person", "LT", r"dubnikov", "M. Dubnikovas", "M. Dubnikovas"),
    # Estija
    ("riigikogu", "inst", "EE", r"riigikog", "Riigikogu (EE parlamentas)", "Riigikogu (parliament)"),
    ("valitsus", "inst", "EE", r"\bvalitsus|peaminist", "Estijos vyriausybė", "Government (EE)"),
    ("ee_fin", "inst", "EE", r"rahandusminist", "Estijos finansų ministerija", "Ministry of Finance (EE)"),
    ("ee_soc", "inst", "EE", r"sotsiaalminist", "Estijos socialinių reikalų ministerija", "Ministry of Social Affairs (EE)"),
    ("eestipank", "inst", "EE", r"eesti pan(k|ga|ga)", "Eesti Pank", "Bank of Estonia"),
    ("pk", "inst", "EE", r"pensionikesk", "Pensionikeskus", "Pensionikeskus"),
    ("riigikohus", "inst", "EE", r"riigikoh|õiguskantsl", "Riigikohus, kancleris", "Supreme Court, Chancellor (EE)"),
    ("reform", "party", "EE", r"reformierak", "Reformų partija (EE)", "Reform Party (EE)"),
    ("isamaa", "party", "EE", r"\bisamaa", "Isamaa (EE)", "Isamaa (EE)"),
    ("ekre", "party", "EE", r"\bEKRE\b|konservatiivne rahvaerakond", "EKRE (EE)", "EKRE (EE)"),
    ("kesk", "party", "EE", r"keskerak", "Centro partija (EE)", "Centre Party (EE)"),
    ("sde", "party", "EE", r"sotsiaaldemokraa|\bSDE\b", "Socialdemokratai (EE)", "Social Democrats (EE)"),
    ("e200", "party", "EE", r"eesti 200", "Eesti 200", "Eesti 200"),
    # Latvija
    ("saeima", "inst", "LV", r"saeim", "Saeima (LV parlamentas)", "Saeima (parliament)"),
    ("lv_gov", "inst", "LV", r"valdīb|ministru prezident|premjer", "Latvijos vyriausybė", "Government (LV)"),
    ("lv_lm", "inst", "LV", r"labklājības minist", "Latvijos gerovės ministerija", "Ministry of Welfare (LV)"),
    ("lv_fm", "inst", "LV", r"finanšu minist", "Latvijos finansų ministerija", "Ministry of Finance (LV)"),
    ("vsaa", "inst", "LV", r"\bVSAA\b|sociālās apdrošināšanas aģentūr", "VSAA (LV Sodra)", "VSAA (social insurance)"),
    ("lvbank", "inst", "LV", r"latvijas bank", "Latvijas Banka", "Bank of Latvia"),
    ("fna", "org", "LV", r"finanšu nozares asociācij", "Finanšu nozares asociācija", "Finance Latvia Association"),
    ("jv", "party", "LV", r"jaunā vienotība|jaunās vienotības|\bJV\b", "Jaunā Vienotība (LV)", "New Unity (LV)"),
    ("zzs", "party", "LV", r"\bZZS\b|zaļo un zemnieku", "ZZS (LV)", "Greens and Farmers (LV)"),
    ("lv_na", "party", "LV", r"nacionālā apvienība|nacionālās apvienības", "Nacionālā apvienība (LV)", "National Alliance (LV)"),
    ("prog", "party", "LV", r"progresīv", "Progresīvie (LV)", "Progressives (LV)"),
    ("lpv", "party", "LV", r"latvija pirmajā vietā|\bLPV\b", "Latvija pirmajā vietā", "Latvia First"),
    # fondų valdytojai (visos šalys)
    ("SEB", "mgr", "", r"\bSEB\b", "SEB", "SEB"), ("Swedbank", "mgr", "", r"\bswedbank", "Swedbank", "Swedbank"),
    ("Luminor", "mgr", "", r"\bluminor", "Luminor", "Luminor"), ("Allianz", "mgr", "", r"\ballianz", "Allianz", "Allianz"),
    ("Artea", "mgr", "", r"\bartea", "Artea", "Artea"), ("Goindex", "mgr", "", r"\bgoindex", "Goindex", "Goindex"),
    ("INVL", "mgr", "", r"\bINVL\b", "INVL", "INVL"), ("LHV", "mgr", "", r"\bLHV\b", "LHV", "LHV"),
    ("Tuleva", "mgr", "", r"\btuleva", "Tuleva", "Tuleva"), ("Citadele", "mgr", "", r"\bcitadel", "Citadele", "Citadele"),
    ("Indexo", "mgr", "", r"\bindexo", "Indexo", "Indexo"), ("CBL", "mgr", "", r"\bCBL\b", "CBL", "CBL"),
]
_RX = [(a[0], a[2], re.compile(a[3], re.I if a[0] not in ("lb", "SEB", "INVL", "LHV", "CBL", "jv", "lpv", "ekre", "sde", "ZZS") else 0)) for a in ACTORS]
SOURCE_ACTOR = {"LIPFA": "lipfa", "Finansų ministerija": "finmin", "Vyriausybė": "lrv", "SADM": "sadm", "Riigikogu": "riigikogu", "Tuleva": "Tuleva", "Seimas": "seimas"}


def actors(title, summary, country, source=""):
    """Paminėti veikėjai „a;b“ (tik tos šalies arba bendri – kad Latvijos „Saeima“ nesimaišytų su LT straipsniu atsitiktinai)."""
    t = f"{title} {summary}"
    out = [i for i, c, rx in _RX if (not c or c == country) and rx.search(t)]
    s = SOURCE_ACTOR.get(source)
    if s and s not in out:
        out.insert(0, s)
    return ";".join(out)


def table():
    """Svetainei: [[id, grupė, šalis, LT, EN], …]"""
    return [[a[0], a[1], a[2], a[4], a[5]] for a in ACTORS]
