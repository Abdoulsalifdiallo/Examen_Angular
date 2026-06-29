# BadWallet Web Dashboard

SPA Angular pour la gestion de portefeuilles électroniques BadWallet, avec deux espaces :
**Agent de guichet** (gestion des portefeuilles) et **Client** (dashboard, transfert, factures,
historique). Consomme l'API réelle `badwallet-api` (port 8080), qui proxifie elle-même
`payment-service` (port 8081) pour les factures.

## Architecture

- **Angular 22** avec **NgModules classiques** (pas de composants standalone) : `CoreModule`,
  `SharedModule`, et des feature modules lazy-loadés (`auth`, `dashboard`, `transactions`,
  `billing`, `wallet-management`).
- **State management** : `BehaviorSubject` (RxJS) dans `AuthService`, `ToastService` et
  `BalanceStoreService` — le solde dans le header se met à jour automatiquement après chaque
  opération, sans rechargement de page.
- **Guards & Interceptors** : `roleGuard` (fonctionnel) protège les routes par rôle ;
  `AuthInterceptor` et `ErrorInterceptor` gèrent l'en-tête d'auth simulé et les toasts d'erreur.
- **Reactive Forms** avec validateurs personnalisés (`phoneValidator`, `differentPhoneValidator`,
  `phoneExistsValidator`) et pipes personnalisés (`xof`, `phoneFormat`).
- **Bootstrap 5** pour l'UI (tableaux, cartes, modales, badges).

## Prérequis

- Node.js 20+, npm
- Le backend `badwallet-api` (Java/Spring Boot) doit tourner sur `http://localhost:8080`
  (et `payment-service` sur `http://localhost:8081`, appelé en interne par badwallet-api).

## Lancer le projet

```bash
npm install
npm start
```

`npm start` lance `ng serve` avec un **proxy** (`proxy.conf.json`) qui redirige `/api/*` vers
`http://localhost:8080`, car le backend ne configure pas CORS — le proxy évite ce problème en
dev sans modifier le backend.

Ouvrir `http://localhost:4200`.

## Connexion

- **Client** : se connecte avec un numéro de téléphone correspondant à un portefeuille existant
  côté backend (ex: `770000003`). L'app vérifie son existence via `GET /api/wallets/{phone}`.
- **Agent** : se connecte avec un simple nom (pas d'entité backend dédiée — l'API n'expose pas
  d'authentification, ce rôle est simulé côté front pour respecter l'architecture Guards/
  Interceptors demandée).

## Routes principales

| Route | Description | Rôle |
|---|---|---|
| `/dashboard` | Solde, revenus/dépenses, dernières transactions | Client |
| `/transfer` | Transfert d'argent | Client |
| `/transactions` | Historique des transactions (filtres date/type côté client) | Client |
| `/bills/current` | Factures impayées du mois (ISM, WOYAFAL) | Client |
| `/bills/history` | Historique des paiements (dérivé des transactions `PAYMENT`) | Client |
| `/admin/wallets` | Listing paginé, création, recherche, dépôt/retrait | Agent |

## Notes sur le contrat API réel

Le backend n'expose pas un endpoint dédié pour l'historique des factures payées : la page
`/bills/history` est donc dérivée du flux `GET /api/wallets/{phone}/transactions` en filtrant
les transactions de type `PAYMENT`. De même, le filtrage par date/type de l'historique des
transactions est appliqué côté client car l'API ne supporte pas ces paramètres de requête.

## Build de production

```bash
npm run build
```
