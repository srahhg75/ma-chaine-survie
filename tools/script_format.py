"""Lecture du format de script de la chaîne (videos/NNN-nom/script.txt).

Une ligne = une phrase de la timeline. Syntaxe :
  # commentaire                       ignoré
  @hook Jour 3 sans courant.          « hook » = identifiant de la phrase, lettres/chiffres/_ (sinon p1, p2…)
  @chute > Jamais de barbecue…        « > » = phrase-chute : 0,6 s de silence juste avant
  … une *bougie* …                    *mot* ou *plusieurs mots* = mot-clé ressource/chiffre (jaune)
  … le _monoxyde_ tue …               _mot_ = mot-clé danger (rouge)
  [indication de jeu]                 non lue, retirée
Le texte affiché (sous-titres) est exactement celui du script, sans les marqueurs.
"""
import re
import unicodedata
from dataclasses import dataclass, field

UNITES = ["zero", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze",
          "treize", "quatorze", "quinze", "seize"]
DIZAINES = {2: "vingt", 3: "trente", 4: "quarante", 5: "cinquante", 6: "soixante"}


def nombre_en_lettres(n: int) -> str:
    """Français, sans espaces ni tirets (sert uniquement à l'alignement)."""
    if n < 17:
        return UNITES[n]
    if n < 20:
        return "dix" + UNITES[n - 10]
    if n < 70:
        d, u = divmod(n, 10)
        return DIZAINES[d] + ("etun" if u == 1 else UNITES[u] if u else "")
    if n < 80:
        return "soixante" + ("etonze" if n == 71 else nombre_en_lettres(n - 60))
    if n < 100:
        return "quatrevingt" + (nombre_en_lettres(n - 80) if n > 80 else "s")
    if n < 1000:
        c, r = divmod(n, 100)
        return ("cent" if c == 1 else UNITES[c] + "cent") + (nombre_en_lettres(r) if r else "")
    if n < 1_000_000:
        m, r = divmod(n, 1000)
        return ("mille" if m == 1 else nombre_en_lettres(m) + "mille") + (nombre_en_lettres(r) if r else "")
    return str(n)


def sans_accents(s: str) -> str:
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if unicodedata.category(c) != "Mn").replace("œ", "oe").replace("æ", "ae")


def forme_parlee(mot: str) -> str:
    """Forme normalisée de ce qui est prononcé : minuscules, sans accents, lettres seules, chiffres en lettres."""
    m = sans_accents(mot)
    m = m.replace("°c", " degres").replace("°", " degres").replace("%", " pourcent")
    m = re.sub(r"\d+", lambda x: " " + nombre_en_lettres(int(x.group())) + " ", m)
    m = re.sub(r"^(km)$", "kilometres", m.strip())
    m = re.sub(r"^h$", "heures", m)
    return re.sub(r"[^a-z]", "", m)


@dataclass
class Mot:
    affiche: str  # texte exact affiché (ponctuation comprise)
    parle: str  # forme normalisée pour l'alignement
    style: str  # "normal" | "ressource" | "danger"
    phrase: int


@dataclass
class Phrase:
    id: str
    index: int
    chute: bool
    texte: str
    mots: list[Mot] = field(default_factory=list)


def lire_script(texte: str) -> list[Phrase]:
    phrases: list[Phrase] = []
    for ligne in texte.splitlines():
        ligne = ligne.strip()
        if not ligne or ligne.startswith("#"):
            continue
        m = re.match(r"^@(\w+)\s*", ligne)
        pid = m.group(1) if m else f"p{len(phrases) + 1}"
        if m:
            ligne = ligne[m.end():]
        chute = ligne.startswith(">")
        ligne = ligne.lstrip("> ").strip()
        ligne = re.sub(r"\[[^\]]*\]", " ", ligne)
        # Typographie française : la ponctuation haute reste collée au mot (espace insécable)
        ligne = re.sub(r"\s+([?!:;»…])", " \\1", ligne)
        ligne = re.sub(r"«\s+", "« ", ligne)
        ph = Phrase(pid, len(phrases), chute, "")
        style_ouvert = "normal"
        for jeton in ligne.split():
            style = style_ouvert
            if jeton.startswith("*"):
                style = style_ouvert = "ressource"
            elif jeton.startswith("_"):
                style = style_ouvert = "danger"
            ferme = re.search(r"[*_](?=[^\w]*$)", jeton) is not None and style_ouvert != "normal"
            affiche = jeton.replace("*", "").replace("_", "")
            if ferme:
                style_ouvert = "normal"
            parle = forme_parlee(affiche)
            if not parle:  # ponctuation isolée : on la colle au mot précédent
                if ph.mots:
                    ph.mots[-1].affiche += " " + affiche
                continue
            ph.mots.append(Mot(affiche, parle, style, ph.index))
        ph.texte = " ".join(x.affiche for x in ph.mots)
        if ids := [p.id for p in phrases if p.id == pid]:
            raise ValueError(f"identifiant de phrase en double : @{ids[0]}")
        phrases.append(ph)
    return phrases


def texte_a_lire(phrases: list[Phrase]) -> str:
    """Texte brut à donner à une voix de synthèse (sans marqueurs)."""
    return "\n".join(p.texte.replace(" ", " ") for p in phrases)
