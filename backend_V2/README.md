# README pour lancer l'application

## Prérequis

- .NET 9.0 SDK
- MySQL Server

## Structure du projet

L'application est structurée selon une architecture en couches :
- `Api` : Couche de présentation et points d'entrée REST
- `Core` : Couche contenant la logique métier et les modèles
- `Infrastructure` : Couche d'accès aux données

## Configuration

1. Assurez-vous que votre base de données MySQL est en cours d'exécution

2. Modifiez le fichier appsettings.json dans le dossier Api pour configurer votre connexion à la base de données

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;user=votre_utilisateur;password=votre_mot_de_passe;database=votre_base_de_donnees"
  },
  // autres configurations
}
```

## Exécution de l'application

### En utilisant la ligne de commande

1. Accédez au répertoire racine du projet(BACKEND_V2)

```bash
cd /chemin/vers/le/projet
```

2. Restaurez les dépendances

```bash
dotnet restore Api.sln
```

3. Compilez le projet

```bash
dotnet build Api.sln
```

4. Exécutez l'application

```bash
dotnet run --project Api/Api.csproj
```

### En utilisant Visual Studio Code

1. Ouvrez le dossier du projet dans Visual Studio Code
2. Assurez-vous d'avoir l'extension C# installée
3. Ouvrez le fichier `Api.sln`
4. Appuyez sur F5 ou cliquez sur le bouton "Démarrer le débogage"

## Synchronisation des données depuis TMDB

Avant d'utiliser l'application, il est recommandé de remplir la base de données avec des films depuis l'API TMDB. Pour ce faire, exécutez la requête suivante une fois que l'application est lancée :

```
POST http://localhost:5165/api/movies/sync-from-tmdb?pages=2
```

Cette requête importera 2 pages de films depuis TMDB dans votre base de données locale. Vous pouvez ajuster le nombre de pages selon vos besoins.

## Points de terminaison API

L'application expose plusieurs points de terminaison REST :

- Gestion des films : implémentée dans `Api/EndPoints/MovieRoutes.cs`
- Gestion des genres : implémentée dans `Api/EndPoints/GenreRoutes.cs`
- Gestion des utilisateurs : implémentée dans `Api/EndPoints/UserRoutes.cs`
- Gestion des listes d'utilisateurs : implémentée dans `Api/EndPoints/UserListRoutes.cs`
- Gestion des commentaires : implémentée dans `Api/EndPoints/CommentRoutes.cs`

## Scripts de base de données

Les scripts SQL nécessaires pour initialiser la base de données se trouvent dans le dossier `Infrastructure/Scripts`.