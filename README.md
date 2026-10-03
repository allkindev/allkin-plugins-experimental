# allkin-plugins-experimental

Les **plugins en cours de validation** d'[Allkin](https://github.com/allkindev/allkin).

Tout plugin naît ici. Chacun peut l'installer, **sans garantie de fonctionnement** : Allkin
l'affiche « En cours de validation ». Il y reste tant que le propriétaire d'Allkin ne l'a pas
vérifié ; une fois validé, il passe dans
[allkin-plugins-stable](https://github.com/allkindev/allkin-plugins-stable).

Allkin lit ce dépôt en plus du dépôt stable. On peut le désactiver : page Plugins → **Dépôts**.

- **Écrire un plugin** : [Créer un plugin](https://github.com/allkindev/allkin-plugins-stable/blob/main/CREER-UN-PLUGIN.md),
  et le format complet dans le [README du dépôt stable](https://github.com/allkindev/allkin-plugins-stable#readme).
- **Le standard** que suit tout plugin et tout service :
  [PLUGIN-STANDARD.md](plugins/creator/standard/PLUGIN-STANDARD.md) et
  [SERVICE-STANDARD.md](plugins/creator/standard/SERVICE-STANDARD.md), livrés avec le plugin
  **Creator** qui les applique.

## Règles de ce dépôt

- `validation.json` dit `{ "status": "pending" }` pour chaque plugin et chaque service.
  `scripts/catalogue.mjs` refuse un plugin validé ici : sa place est dans le dépôt stable.
- La version suit `1.0.N`, `N` augmenté de 1 à chaque modification.
- Après chaque modification : `node scripts/catalogue.mjs`, sinon Allkin refuse l'installation.
