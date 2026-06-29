# Rapport technique — BadWallet Web Dashboard

## Choix d'architecture

L'application est structurée en **NgModules classiques** (`CoreModule`, `SharedModule`, et un
module par feature : `auth`, `dashboard`, `transactions`, `billing`, `wallet-management`), chacun
lazy-loadé via `loadChildren`. Ce choix (plutôt que les Standalone Components) a été fait pour
correspondre à l'architecture explicitement demandée et démontrer la séparation des
responsabilités (déclarations vs. providers globaux vs. composants partagés).

L'état réactif (solde, toasts, session utilisateur) repose sur des `BehaviorSubject` exposés en
`Observable` et consommés via le pipe `async` dans les templates — ce qui garantit la mise à jour
automatique du header après chaque opération financière, sans rechargement de page.

Deux interceptors HTTP globaux (`AuthInterceptor`, `ErrorInterceptor`) et un guard fonctionnel
(`roleGuard`) protègent les routes par rôle et centralisent la gestion des erreurs API sous forme
de toasts contextuels (ex. "Solde insuffisant").

Côté UI, un design system minimal a été centralisé dans `styles.scss` (variables CSS de couleurs,
ombres, rayons), avec la charte de couleurs `#2087d9` / `#123065` et les icônes Bootstrap Icons,
plutôt que de styler chaque composant isolément — ce qui garantit une cohérence visuelle (cartes,
tableaux, boutons, badges) sur l'ensemble des écrans Agent et Client sans dupliquer de CSS.

## Difficultés rencontrées

**Découverte tardive du vrai backend.** Le cahier des charges laissait penser qu'aucun backend
n'était disponible ; il s'est avéré qu'un vrai backend Java (`badwallet-api` + `payment-service`,
issus de l'examen de Design Pattern du même jour) tournait déjà localement, avec un schéma de
données différent des hypothèses initiales (`phoneNumber`/`email`/`code` au lieu de `fullName`,
enums `PaymentMethod`/`ServiceName`, formats de pagination Spring). Il a fallu rétro-ingénierer le
contrat API exact par tests `curl` puis confirmation via le code source du backend, et réécrire
modèles/services en conséquence.

**Absence de configuration CORS côté backend.** Aucun `WebMvcConfigurer` n'autorise
`http://localhost:4200`. Plutôt que de modifier le backend (hors périmètre), un `proxy.conf.json`
Angular redirige les appels `/api/*` vers `localhost:8080`, contournant le problème uniquement
côté outillage de développement.

**Détection de changement non automatique.** La version d'Angular utilisée (22) génère par
défaut des projets sans `zone.js`, où les mutations d'état effectuées dans un callback
`.subscribe()` ne déclenchent pas de re-rendu (contrairement aux pipes `async`, qui appellent
`markForCheck()` en interne). Cela provoquait des écrans bloqués sur "Chargement..." malgré des
réponses HTTP réussies. La solution retenue est l'injection explicite de `ChangeDetectorRef` et
l'appel à `markForCheck()` après chaque mutation d'état asynchrone, plutôt qu'une réécriture
complète vers les Signals (hors du périmètre RxJS/NgModules demandé).

**Endpoints manquants côté API.** Le backend ne propose pas d'endpoint dédié à l'historique des
factures payées ni de filtrage serveur (date/type) sur l'historique des transactions. Ces
fonctionnalités ont été reconstruites côté client : l'historique des factures est dérivé des
transactions de type `PAYMENT`, et le filtrage des transactions s'applique sur la liste complète
déjà récupérée.
