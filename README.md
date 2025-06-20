# projet_dev_web

Ce dépôt contient :

- backend_V2 : API .NET 9 (C#) pour gérer films, utilisateurs, commentaires, listes personnels.
- projet_web : frontend React + Vite consommant l'API.

## Prérequis

- .NET 9 SDK (https://dotnet.microsoft.com/)  
- Node.js 16.x ou supérieur (https://nodejs.org/)  
- [npm](https://www.npmjs.com/) (inclus avec Node.js) ou [yarn](https://yarnpkg.com/)
- MySQL (ou MariaDB)  
- Un éditeur/IDE (VS Code, Rider, Visual Studio…)

## Configuration de la base de données (MySQL)

1. Démarrer votre serveur MySQL.
2. Créer la base et les tables :
   ```bash
   mysql -u root -p < backend_V2/Infrastructure/Scripts/create_database.sql
   mysql -u root -p movie_manager < backend_V2/Infrastructure/Scripts/schema.sql
   ```
3. Vérifier le fichier `backend_V2/Api/appsettings.json` et renseigner :
   - `ConnectionStrings:DefaultConnection`  
   - `TMDBSettings:ApiKey`  
   - `Jwt:Issuer`, `Jwt:Audience`, `Jwt:Key`, `Jwt:ExpireTimeInMinutes`

## Lancement du backend

```bash
cd backend_V2/Api
dotnet restore
dotnet build
dotnet run
```

L'API écoute par défaut sur http://localhost:5165 (cf. `launchSettings.json`).  

## Synchronisation des données depuis TMDB

Avant d'utiliser l'application, il est recommandé de remplir la base de données avec des films depuis l'API TMDB. Pour ce faire, exécutez la requête suivante une fois que l'application est lancée :

```
POST http://localhost:5165/api/movies/sync-from-tmdb?pages=2
```

Cette requête importera 2 pages de films depuis TMDB dans votre base de données locale. Vous pouvez ajuster le nombre de pages selon vos besoins.

## Lancement du frontend

```bash
cd projet_web
npm install
npm run dev
```

Le frontend (Vite) sera disponible sur http://localhost:5173 et proxydera les appels `/api` vers le backend.

## Qualité et maintenance

- Linting (ESLint) : `npm run lint`  
- Architecture : services modulaires, contexte React pour l'authentification, séparation claire des responsabilités.  
- Authentification : JWT Bearer, header `Authorization: Bearer <token>` injecté automatiquement.

---

