# Bloc-notes

Des notes rangées par dossiers, dans un onglet d'Allkin. On écrit dans le document mis en forme —
titres, listes, cases à cocher, tableaux, images — sans jamais voir une balise : c'est l'éditeur
markdown d'Allkin qui tient la plume.

Chaque note est un fichier `.md`, chaque dossier un vrai dossier, dans le dossier partagé
(`~/.allkin/share/notes/`). Vos agents lisent et écrivent donc les mêmes notes : « range le
compte rendu dans mes notes, dossier Réunions » fonctionne tel quel.

## Ce plugin a besoin de l'éditeur markdown

Le bloc-notes n'édite pas le texte lui-même : il s'appuie sur le plugin **Éditeur markdown**
(`markdown-editor`). S'il n'est pas déjà là, **Allkin l'installe automatiquement en même temps** —
la fenêtre d'installation vous le dit avant de commencer. Comme tout plugin, il arrive sans aucun
droit : accordez-lui son droit « Interface » sur sa page, sinon le bloc-notes affiche un écran qui
vous y conduit. (L'éditeur markdown est livré avec Allkin : dans la plupart des cas il est déjà
installé et autorisé.)

## Commencer

1. Installez le plugin, puis accordez-lui son droit sur sa page et rechargez Allkin.
2. Ouvrez **Bloc-notes** dans la liste des plugins du menu Allkin.
3. **Note** crée une note dans le dossier affiché : tapez son titre, puis Entrée pour écrire.

L'écran a trois volets : les dossiers, les notes du dossier, la note. Sur un smartphone, un seul
volet à la fois ; la flèche de la barre revient en arrière.

## Ce que l'on peut faire

- **Dossiers et sous-dossiers** — créer (bouton **Dossier**, ou clic droit sur un dossier), renommer,
  déplacer, supprimer. Un dossier se replie d'un clic sur sa flèche.
- **Ranger** — glissez une note ou un dossier sur un dossier, ou passez par **Déplacer vers…**.
  Déposer sur « Toutes les notes » sort l'élément de tout dossier.
- **Titre** — le titre au-dessus de la note est le nom de son fichier : le changer renomme la note.
- **Enregistrement automatique** — la note s'enregistre pendant que vous écrivez ; l'état est
  affiché dans la barre. Ctrl/⌘ + S enregistre tout de suite.
- **Épingler** — une note épinglée reste en tête de sa liste et apparaît dans « Épinglées ».
- **Rechercher** — le champ de la barre cherche dans les titres et dans le texte de toutes les notes.
- **Trier** — par dernière modification, date de création ou titre.
- **Dupliquer, copier le texte, télécharger** le fichier `.md` — clic droit sur une note (appui long
  sur un écran tactile), ou le bouton ⋯ de la barre pour la note ouverte.
- **Images et fichiers** — glissez-les dans le texte ou collez-les : ils sont rangés dans
  `notes/_files/` et la note les garde quand elle change de dossier.
- **Corbeille** — supprimer envoie dans la corbeille du bloc-notes, d'où l'on **restaure** à
  l'emplacement d'origine. Ce que l'on efface de cette corbeille part dans celle du dossier partagé
  (page Fichiers), où il reste jusqu'à ce qu'elle soit vidée : rien ne disparaît par accident.
- **Compteur** — mots, caractères et date de modification, sous la note.

## Où sont les notes

| Emplacement | Contenu |
|-------------|---------|
| `share/notes/…/*.md` | les notes, dans leurs dossiers |
| `share/notes/Trash/` | la corbeille du bloc-notes |
| `share/notes/_files/` | images et fichiers déposés dans les notes |
| `share/notes/.notes.json` | les épingles, et l'origine des éléments de la corbeille |

Une note modifiée par un agent pendant qu'elle est ouverte est relue quand vous revenez sur
l'onglet, tant que vous n'êtes pas en train de l'écrire.

## Réglages

Aucun.

## Droit demandé

- **Interface d'Allkin** — le plugin s'exécute dans la page d'Allkin, avec votre session : il y
  ajoute son onglet et son entrée dans la liste des plugins. Il n'a ni service ni agent, et n'écrit
  que dans son dossier du dossier partagé.

## Pour les autres plugins

```js
Allkin.capability("notes").open();
const path = await Allkin.capability("notes").create({ title: "Idée", content: "# Idée\n", folder: "Projets" });
```

## Si cela ne fonctionne pas

- **« L'éditeur markdown est absent »** — le plugin Éditeur markdown n'est pas installé, ou son
  droit n'est pas accordé. Le bouton de l'écran ouvre sa page ; accordez le droit, puis rechargez.
- **L'onglet n'apparaît pas** — le droit « Interface » du bloc-notes n'est pas accordé, ou la page
  n'a pas été rechargée depuis.
- **« Non enregistrée »** — l'écriture a échoué (disque plein, session expirée). Le texte reste à
  l'écran : reconnectez-vous dans un autre onglet, puis Ctrl/⌘ + S.
- **Une note n'apparaît pas** — seuls les fichiers `.md` sont des notes ; les noms commençant par
  un point ou un tiret bas sont ignorés.
