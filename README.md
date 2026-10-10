# allkin-tools-experimental

Les **outils en cours de validation** d'[Allkin](https://github.com/allkindev/allkin).

Dans Allkin, ce que ce dépôt contient s'appelle un **outil** (*tool*, *herramienta*, *Tool*) ; le
nom technique reste *plugin* : `plugin.json`, le dossier `plugins/<id>/`, les clés et le code.

Tout outil naît ici. Chacun peut l'installer, **sans garantie de fonctionnement** : Allkin
l'affiche « En cours de validation ». Il y reste tant que le propriétaire d'Allkin ne l'a pas
vérifié ; une fois validé, il passe dans
[allkin-tools-stable](https://github.com/allkindev/allkin-tools-stable).

Allkin lit ce dépôt en plus du dépôt stable. On peut le désactiver : page Outils → **Dépôts**.

- **Écrire un outil** : [Créer un outil](https://github.com/allkindev/allkin-tools-stable/blob/main/CREER-UN-PLUGIN.md),
  et le format complet dans le [README du dépôt stable](https://github.com/allkindev/allkin-tools-stable#readme).
- **Le standard** que suit tout outil et tout service :
  [PLUGIN-STANDARD.md](plugins/creator/standard/PLUGIN-STANDARD.md) et
  [SERVICE-STANDARD.md](plugins/creator/standard/SERVICE-STANDARD.md), livrés avec l'outil
  **Creator** qui les applique.

## Règles de ce dépôt

- `validation.json` dit `{ "status": "pending" }` pour chaque outil et chaque service.
  `scripts/catalogue.mjs` refuse un outil validé ici : sa place est dans le dépôt stable.
- La version suit `1.0.N`, `N` augmenté de 1 à chaque modification.
- Après chaque modification : `node scripts/catalogue.mjs`, sinon Allkin refuse l'installation.
