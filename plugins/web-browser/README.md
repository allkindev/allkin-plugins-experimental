# Navigateur web

Ouvre les sites web dans des onglets d'Allkin. Un lien cliqué dans une conversation, un document ou
une page n'emmène plus hors de l'application : le site s'ouvre dans un onglet, à côté du reste.

## Démarrer

- **Un lien** : un clic sur un lien vers un autre site l'ouvre dans un onglet d'Allkin.
  **Ctrl + clic** (⌘ + clic sur Mac), Maj + clic ou le clic du milieu gardent le comportement du
  navigateur : nouvel onglet du navigateur, comme avant.
- **Une adresse** : liste Outils de la barre latérale › **Navigateur web**, puis l'adresse. Ce qui
  n'est pas une adresse lance une recherche.
- Dans l'onglet : la barre d'adresse (Entrée pour y aller), **Recharger**, **Copier le lien**,
  **Ouvrir dans le navigateur**. Le cadenas dit si la connexion est chiffrée (HTTPS).

Chaque site garde sa page tant que son onglet est ouvert : passer à une autre fenêtre puis revenir
la retrouve telle quelle (huit sites au plus ; au-delà, le plus ancien se recharge au retour).

## Les sites qui refusent

Beaucoup de sites interdisent d'être affichés à l'intérieur d'un autre (Google, GitHub, les
banques, la plupart des comptes en ligne) : c'est une protection contre le détournement de clics.
Le navigateur ne le dirait pas — le cadre resterait blanc. Le service du plugin lit les en-têtes du
site avant de l'afficher ; s'il refuse, l'onglet le dit et propose **Ouvrir dans le navigateur**.
« Essayer quand même » affiche le cadre malgré tout.

L'adresse affichée est celle qui a été ouverte : quand on suit des liens à l'intérieur du site, le
navigateur ne laisse pas Allkin la connaître.

## Réglages

- **Port local** (9345) : le port du service, sur cette machine seulement. À changer s'il est pris.

## Droits demandés

- **Interface** : les onglets du navigateur, et l'ouverture des liens externes dedans.
- **Réseau** : le service lit les en-têtes d'un site (rien d'autre, rien n'est gardé). Il n'écoute
  que sur 127.0.0.1, derrière la session d'Allkin.

Pour que la vérification marche, autoriser aussi le plugin à **démarrer en service** sur sa page.
Sans service, les sites s'ouvrent quand même ; seul l'avertissement manque.

## En cas de souci

- *Un onglet reste blanc* : le site refuse sans doute d'être encadré et le service ne tourne pas
  (page du plugin › service). Utiliser « Ouvrir dans le navigateur ».
- *Allkin est en HTTPS et un site en HTTP ne s'affiche pas* : le navigateur bloque un contenu non
  chiffré dans une page chiffrée. Ouvrir dans le navigateur.
- *Les liens s'ouvrent encore hors d'Allkin* : recharger la page après avoir activé le plugin.

Plugin expérimental : premier jet, à valider.
