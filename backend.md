# Documentation complete du backend Thiskord

## 1) Vue d'ensemble

Ce projet est un backend **ASP.NET Core Web API** en **C# (.NET 9)** avec:

- API REST (controllers)
- Authentification JWT
- SQL Server (via `Microsoft.Data.SqlClient`)
- SignalR pour le chat temps reel
- Execution locale ou via Docker Compose

Fichiers centraux:

- `Program.cs`: configuration globale (DI, JWT, controllers, SignalR)
- `compose.yaml`: stack Docker de dev (backend + SQL Server + init SQL)
- `Thiskord_db.sql`: creation schema + donnees de test
- `Hubs/ChatHub.cs`: messagerie en temps reel
- `Controllers/*.cs` et `Services/*.cs`: API + logique metier

---

## 2) Stack technique

- **Framework**: .NET 9 (`net9.0`)
- **Web API**: ASP.NET Core
- **Auth**: JWT Bearer
- **Temps reel**: SignalR
- **BDD**: SQL Server 2022
- **Hash mot de passe**: `BCrypt.Net-Next`
- **Acces SQL**: `Microsoft.Data.SqlClient`

Paquets (voir `Thiskord_Back.csproj`):

- `BCrypt.Net-Next`
- `Microsoft.AspNetCore.Authentication.JwtBearer`
- `Microsoft.AspNetCore.OpenApi`
- `Microsoft.AspNetCore.SignalR`
- `Microsoft.Data.SqlClient`
- `Microsoft.EntityFrameworkCore.SqlServer` (reference presente, mais acces actuel majoritairement en SQL brut)
- `Newtonsoft.Json`

---

## 3) Architecture applicative

### 3.1 Pipeline ASP.NET (`Program.cs`)

- `AddControllers()`
- `AddOpenApi()` (active en Developpement)
- `AddSignalR()`
- Injection de dependances:
  - `IDbConnectionService -> DBService`
  - `AuthService`
  - `JsonService`
  - `LogService`
  - `ProjectService`
  - `AccountService`
  - `InscriptionService`
  - `ChannelService`
- JWT Bearer configure avec:
  - `Jwt:Issuer`
  - `Jwt:Audience`
  - `Jwt:Key`
- Support token JWT dans query string pour SignalR:
  - Query param: `access_token`
  - Chemin hub: `/chatHub`
- Middleware:
  - `UseAuthentication()`
  - `UseHttpsRedirection()`
  - `UseAuthorization()`
  - `MapControllers()`
  - `MapHub<ChatHub>("/chatHub")`

### 3.2 Organisation

- `Controllers/`: endpoints HTTP
- `Services/`: logique metier + SQL
- `Models/`: DTO et models
- `Hubs/`: SignalR
- `Thiskord_db.sql`: schema + seed

---

## 4) Configuration

### 4.1 Fichiers appsettings

- `appsettings.json`: log level et `AllowedHosts`
- `appsettings.Development.json`:
  - `ConnectionStrings:DefaultConnection`
  - `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`
- `appsettings.Production.json`: meme structure

### 4.2 Variables d'environnement utiles

- `ASPNETCORE_ENVIRONMENT` (`Development`/`Production`)
- `ConnectionStrings__DefaultConnection`

En Docker Compose, la chaine de connexion est surchargee via:

- `ConnectionStrings__DefaultConnection=Server=database;Database=thiskord;User Id=sa;Password=...;TrustServerCertificate=True;`

---

## 5) Lancement du backend

### 5.1 Local (sans Docker)

Prerequis:

- SDK .NET 9
- SQL Server accessible

Commandes:

```powershell
dotnet restore
dotnet run
```

Par defaut en profil `http` (`Properties/launchSettings.json`):

- `http://localhost:5158`

### 5.2 Docker Compose (dev)

`compose.yaml` demarre:

1. `database` (SQL Server 2022)
2. `database.configurator` (execute `Thiskord_db.sql`)
3. `backend` (`dotnet watch run` sur port 8080)

Commandes:

```powershell
docker compose up
docker compose up -d
docker compose down
docker compose down -v
```

Ports exposes:

- Backend: `8080:8080`
- SQL Server: `1533:1433`

### 5.3 Dockerfile (image backend)

- Build: `mcr.microsoft.com/dotnet/sdk:9.0`
- Runtime: `mcr.microsoft.com/dotnet/aspnet:9.0`
- Publish puis `ENTRYPOINT ["dotnet", "Thiskord_Back.dll"]`

---

## 6) Authentification JWT

### 6.1 Login

Endpoint:

- `POST /api/Auth/auth`

Body attendu:

```json
{
  "user_auth": "EMRE",
  "password": "EMRE"
}
```

Reponse (si OK):

```json
{
  "user": {
    "user_id": 1,
    "user_name": "EMRE",
    "user_mail": "EMRE@EMRE.EMRE",
    "user_picture": "..."
  },
  "token": "<jwt>"
}
```

### 6.2 Utilisation du token

- REST: header `Authorization: Bearer <token>`
- SignalR: `?access_token=<token>` sur l'URL de connexion du hub

### 6.3 Claims utilises

Le token contient au minimum:

- `ClaimTypes.NameIdentifier` = `user_id`
- `ClaimTypes.Name` = `user_auth`

`ChatHub.SendMessage` lit `NameIdentifier` pour retrouver l'ID utilisateur.

---

## 7) API REST: endpoints

Base route: `/api`
Format de communication: `application/json`
Authentification: `Bearer <token>` (sauf pour Auth et Inscription)

### 7.1 Authentification (`/api/Auth`)

- `POST /api/Auth/auth`
  - **Description :** Authentifie un utilisateur et renvoie ses informations et un token JWT.
  - **Authentification requise :** Non
  - **Body attendu :**
    ```json
    {
      "user_auth": "string",
      "password": "string"
    }
    ```
  - **Reponse succes :**
    ```json
    {
      "user": {
        "user_id": 1,
        "user_name": "string",
        "user_mail": "string",
        "user_picture": "string"
      },
      "token": "string"
    }
    ```

### 7.2 Inscription (`/api/Inscription`)

- `POST /api/Inscription/register`
  - **Description :** Cree un nouveau compte utilisateur.
  - **Authentification requise :** Non
  - **Body attendu :**
    ```json
    {
      "user_name": "string",
      "user_mail": "string",
      "password": "string",
      "user_picture": "optionnel_string"
    }
    ```
  - **Reponse succes (exemple) :**
    ```json
    { "resultat": "success" }
    ```

### 7.3 Compte Utilisateur (`/api/Account` et `/api/User`)

- `GET /api/Account/account/{id}`
  - **Description :** Recupere les informations d'un compte specifique.
- `POST /api/Account/account`
  - **Description :** Met a jour les informations primaires d'un compte (nom, email, photo).
  - **Body attendu :**
    ```json
    {
      "user_id": int,
      "user_name": "string",
      "user_mail": "string",
      "user_picture": "string",
      "user_password": "..."
    }
    ```
- `POST /api/Account/account-password`
  - **Description :** Met a jour le mot de passe d'un compte. Utilise le meme format JSON que ci-dessus.
- `GET /api/User/all`
  - **Description :** Recupere la liste de tous les utilisateurs.
- `GET /api/User/project/{projectId}`
  - **Description :** Recupere tous les membres d'un projet specifique.

### 7.4 Projets (`/api/Project`)

- `POST /api/Project/create`
  - **Description :** Cree un nouveau projet.
  - **Body attendu :**
    ```json
    {
      "name": "string",
      "description": "string"
    }
    ```
- `DELETE /api/Project/{id}`
  - **Description :** Supprime un projet par son ID.
- `PUT /api/Project/{id}`
  - **Description :** Met a jour un projet existant. Identique au requete de creation mais prend l'ID en parametre.
- `GET /api/Project/all`
  - **Description :** Recupere l'ensemble des projets (generalement lies a l'utilisateur connecte).

### 7.5 Canaux (`/api/Channel`)

- `POST /api/Channel/create`
  - **Description :** Cree un nouveau canal au sein d'un projet.
  - **Body attendu :**
    ```json
    {
      "name": "string",
      "description": "string",
      "projectId": int
    }
    ```
- `DELETE /api/Channel/{id}`
  - **Description :** Supprime un canal via son ID.
- `PUT /api/Channel/{id}`
  - **Description :** Met a jour les informations du canal specifie. 
- `GET /api/Channel/project/{projectId}`
  - **Description :** Recupere la liste des canaux pour un projet donne.

### 7.6 Invitations (`/api/Invite`)

- `POST /api/Invite`
  - **Description :** Genere un lien/token d'invitation pour un projet.
  - **Body attendu :**
    ```json
    {
      "projectId": int,
      "expiresAt": "2026-12-31T23:59:59Z" // (optionnel)
    }
    ```
- `POST /api/Invite/{token}`
  - **Description :** Permet a l'utilisateur connecte d'accepter une invitation (via le token fourni).

### 7.7 Sprints (`/api/Sprint`)

- `POST /api/Sprint/create/sprint`
  - **Description :** Cree un nouveau sprint pour un projet.
  - **Body attendu :**
    ```json
    {
      "sprint_goal": "string",
      "sprint_begin_date": "YYYY-MM-DD",
      "sprint_end_date": "YYYY-MM-DD",
      "id_project_sprint": int
    }
    ```
- `DELETE /api/Sprint/{id}`
  - **Description :** Supprime le sprint correspondant.
- `GET /api/Sprint/sprint/{id}`
  - **Description :** Recupere un sprint specifique.
- `GET /api/Sprint/sprint/project/{projectId}`
  - **Description :** Liste tous les sprints d'un projet precis.
- `PATCH /api/Sprint/sprint`
  - **Description :** Met a jour un sprint. Prend la meme structure JSON (avec le `sprint_id` bien rempli).

### 7.8 Taches de Sprint (`/api/SprintTask`)

- `POST /api/SprintTask/task`
  - **Description :** Cree une nouvelle tache ou sous-tache rattachee a un sprint.
  - **Body attendu :**
    ```json
    {
      "task_title": "string",
      "task_desc": "string",
      "is_subtask": boolean,
      "task_status": "string",
      "id_creator": int,
      "id_resp": int,
      "id_project_task": int,
      "id_parent_task": int, // null si pas de sous-tache
      "id_sprint": int
    }
    ```
- `GET /api/SprintTask/sprint/task/{sprintId}`
  - **Description :** Recupere l'integralite des taches d'un sprint.
- `GET /api/SprintTask/parent/task/{parentId}`
  - **Description :** Recupere les sous-taches attachees a une tache parente.
- `DELETE /api/SprintTask/task/{id}`
  - **Description :** Supprime une tache.
- `PATCH /api/SprintTask/task`
  - **Description :** Met a jour la tache avec ses nouveaux parametres (titre, status...).

---

## 8) SignalR (chat temps reel)

Hub:

- `/chatHub`

Methodes cote serveur (`Hubs/ChatHub.cs`):

- `JoinChannel(int channelId)`
  - Ajoute la connexion au groupe du channel
  - Charge l'historique SQL (`dbo.Message` + `dbo.Account`)
  - Envoie `LoadMessages` au caller
  - Notifie le groupe avec `UserJoined`
- `LeaveChannel(int channelId)`
  - Retire la connexion du groupe
- `SendMessage(int channelId, string text)`
  - Lit l'ID utilisateur depuis le JWT
  - Insert le message en base
  - Broadcast `ReceiveMessage`

Evenements emis vers le client:

- `LoadMessages(history)`
- `UserJoined(user, text)`
- `ReceiveMessage(user, text, dateTime)`

Format date actuellement utilise: `dd/MM HH:mm` (heure convertie Europe/Paris dans le hub).

---

## 9) Base de donnees

Script: `Thiskord_db.sql`

### 9.1 Initialisation

- Cree la base `thiskord` si absente
- `ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = OFF;`
- Cree les tables si absentes (`IF NOT EXISTS`)
- Injecte des donnees de test (accounts, projects, channels, messages, etc.)

### 9.2 Tables principales

- `dbo.Account`
- `dbo.Project`
- `dbo.Channel`
- `dbo.Message`
- `dbo.ACCESS`
- `dbo.ALLOW`
- `dbo.Task`
- `dbo.Sprint`
- `dbo.External_Token`
- `dbo.Logs`

### 9.3 Relations utiles

- `Channel.id_project -> Project.project_id` (cascade delete)
- `Message.id_author -> Account.user_id` (set null)
- `Message.id_channel_author -> Channel.channel_id` (cascade delete)

### 9.4 Donnees seed

Le script insere notamment des comptes de test (ex. `EMRE`) si absents.

---

## 10) Logs et diagnostic

### 10.1 Fichier logs applicatif

`LogService.CreateLog(...)` ecrit dans:

- `logs.txt`

Emplacement: repertoire de travail du backend (en local: racine projet; en container: `/App/logs.txt` si `WORKDIR /App`).

### 10.2 Logs DB (attention)

`LogService.AddLog(...)` tente un `INSERT INTO logs (user_id, message, created_at)`.

Le schema SQL fourni cree une table `dbo.Logs` avec colonnes `logs_message`, `id_user_logs` (structure differente).

Cela peut provoquer des erreurs SQL si cette methode est utilisee sans aligner schema et requete.

---

## 11) Connexion SSMS a la base Docker

Avec `compose.yaml` actuel:

- Serveur: `localhost,1533`
- Login: `sa`
- Password: `MonSuperMotDePasse123!`
- Chiffrement: Trust server certificate (selon client)
- Base: `thiskord`

---

## 12) Defauts connus et points d'attention

- Plusieurs services utilisent SQL synchrone et sans `using` partout (risque de fuite de connexion).
- Certains `catch` loggent mais n'interrompent pas le flux (resultat parfois silencieux cote API).
- `AuthService.AuthLogin` suppose que le user existe (`Read()` sans verification).
- `AccountService.getAccount` lit `GetString(...)` sans verifier les `NULL`.
- `ChannelService.Create` n'assigne pas `id_project` a la creation du canal.
- Presence d'endpoints de test a nettoyer/securiser avant production.

---

## 13) Checklist avant mise en production

- Mettre les secrets hors repo (`Jwt:Key`, mots de passe SQL).
- Ajouter validation d'entree et codes HTTP explicites (400/401/404).
- Uniformiser la gestion d'erreurs et la journalisation.
- Ajouter migrations/versionnement schema ou pipeline DB robuste.
- Ajouter tests unitaires/integration sur auth, project, channel et chat hub.
- Restreindre CORS et securiser tous les endpoints sensibles.

---

## 14) Commandes utiles

Lancer backend local:

```powershell
dotnet run
```

Lancer stack docker:

```powershell
docker compose up
```

Reinitialiser completement la stack (dont volume SQL):

```powershell
docker compose down -v // Pour supprimer les volumes (BDD)
docker compose up
```

---

## 15) Resume rapide pour onboarding

1. Demarrer SQL + backend (`docker compose up`).
2. Verifier API sur `http://localhost:8080`.
3. Authentifier via `POST /api/Auth/auth` pour obtenir un JWT.
4. Appeler API REST (`/api/Project/all`, etc.).
5. Connecter le front SignalR sur `/chatHub?access_token=...`.
