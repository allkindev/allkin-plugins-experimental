# Éditeur d'images

Recadrer, réduire, compresser et annoter une image sans quitter Allkin : une capture d'écran à
commenter, une photo trop lourde à alléger, un détail à masquer avant de partager.

## Démarrer

- **Image d'un agent ou du dossier partagé** : dans l'explorateur de fichiers, clic droit sur
  l'image › **Modifier l'image**. Elle s'ouvre dans un onglet à elle.
- **Image de cet appareil** : liste Plugins du menu Allkin › **Éditeur d'images**, ou le bouton
  **Ouvrir** de l'éditeur. On peut aussi déposer un fichier sur l'éditeur, ou coller une image
  (Ctrl+V) quand il est affiché.

## Les outils

À gauche (en bas sur téléphone) :

- **Sélectionner** : un clic choisit une annotation, la glisser la déplace, Suppr l'efface ;
  double-clic sur un texte pour le modifier. Changer la couleur ou l'épaisseur s'applique à
  l'annotation choisie.
- **Recadrer** : tracer le cadre à garder, puis Entrée (ou « Recadrer »).
- **Flèche**, **ligne**, **rectangle**, **ellipse** : Maj pour une droite, un carré, un cercle.
  Rectangle et ellipse peuvent être pleins.
- **Crayon** et **surligneur** (trait large et translucide).
- **Texte** : un clic où le placer ; `\n` pour aller à la ligne ; fond contrasté au choix.
- **Étape numérotée** : chaque clic pose le numéro suivant (1, 2, 3…).
- **Pixeliser** : tracer sur ce qui ne doit pas être lu (un nom, une clé, une adresse). C'est
  définitif dans l'image enregistrée.
- **Pivoter**, **retourner**, **redimensionner** (pixels, pourcentage, proportions gardées).

Au-dessus de l'image : couleurs, épaisseur, taille du texte, zoom (Ctrl + molette, ou le
pourcentage pour passer de « ajusté » à « taille réelle »). Annuler / rétablir : Ctrl+Z /
Ctrl+Maj+Z, jusqu'à 40 étapes.

Les annotations restent modifiables jusqu'à l'enregistrement. Recadrer, pivoter, retourner ou
redimensionner les fond dans l'image, pour qu'elles suivent les pixels.

## Enregistrer, exporter

- **Enregistrer** (Ctrl+S) réécrit l'image à sa place, dans son format. **La version précédente
  part dans la corbeille** du dossier (`Trash/`) : rien n'est perdu. Un GIF ou un BMP, que le
  navigateur ne sait pas écrire, est proposé en copie PNG.
- **Exporter** choisit le format (PNG, JPEG, WebP), la **qualité** — c'est la compression : plus
  bas, plus léger — et le plus grand côté (réduction). Le poids obtenu s'affiche avant de valider.
  Puis **Télécharger**, ou **Enregistrer une copie** à côté de l'original. Une image venue de cet
  appareil est enregistrée dans le dossier partagé, sous `share/image-editor/`.
- **Copier** met l'image annotée dans le presse-papiers, prête à coller ailleurs.

Fermer un onglet sans enregistrer garde les modifications en mémoire jusqu'au rechargement de la
page : rouvrir l'image les retrouve.

## Réglages

Aucun.

## Droit demandé

- **Interface** : l'éditeur s'ajoute à la page d'Allkin. Il lit et écrit les images avec ta
  session, par les mêmes routes que l'explorateur de fichiers.

## En cas de souci

- *« Modifier l'image » n'apparaît pas dans l'explorateur* : l'explorateur doit être en 1.0.15 au
  moins, et la page rechargée après l'activation du plugin.
- *Copier ne marche pas* : le navigateur refuse le presse-papiers hors HTTPS ; utiliser Exporter.
- *Image très grande* : le navigateur peut manquer de mémoire au-delà d'environ 16 000 pixels de
  côté ; la réduire d'abord.

Plugin expérimental : premier jet, à valider.
