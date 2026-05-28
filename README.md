# Mon Blog

Blog Next.js 16 avec Prisma 7, PostgreSQL, Tailwind CSS v4 et React 19.

## Prérequis

- Node.js 20+
- PostgreSQL 15+ (local ou via Docker)

---

## Installation locale

### 1. Cloner et installer

```bash
git clone <repo-url>
cd blog
npm install
```

### 2. Créer le fichier `.env`

```env
# Connexion Prisma pour les migrations
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/blog"

# Connexion directe pour le runtime (doit être une URL postgres:// standard)
POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/blog"

# Clés de signature JWT (valeurs quelconques en dev)
SESSION_SECRET="une-cle-secrete-longue-et-aleatoire"
JWT_SECRET="une-autre-cle-secrete"

# Better Auth (requis même si inutilisé pour le login)
BETTER_AUTH_SECRET="encore-une-cle-secrete"
BETTER_AUTH_URL="http://localhost:3000/"
```

### 3. Générer le client Prisma

```bash
npx prisma generate
```

> Génère le client dans `app/generated/prisma/` — ce dossier n'est pas commité.

### 4. Créer les tables

```bash
npx prisma migrate dev --name init
```

### 5. Insérer les données de test

```bash
npx prisma db seed
```

Crée 2 admins, 3 blogueurs et 6 articles.

| Email | Mot de passe | Rôle |
|---|---|---|
| `admin@blog.fr` | `admin1234` | Admin |
| `superadmin@blog.fr` | `super5678` | Admin |
| `claire@blog.fr` | `claire1234` | Blogueur |
| `david@blog.fr` | `david1234` | Blogueur |
| `emma@blog.fr` | `emma1234` | Blogueur |

### 6. Lancer le serveur

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Installation avec Docker

### Prérequis

- Docker Desktop ou Docker Engine + Docker Compose

### 1. Lancer l'environnement complet

```bash
docker compose up --build
```

Cela démarre :
- **PostgreSQL** sur le port `5432`
- **L'application Next.js** sur le port `3000`

Les migrations et le seed sont appliqués automatiquement au démarrage.

### 2. Ouvrir l'application

[http://localhost:3000](http://localhost:3000)

### Commandes utiles

```bash
# Démarrer en arrière-plan
docker compose up -d --build

# Voir les logs
docker compose logs -f app

# Arrêter
docker compose down

# Arrêter et supprimer les données (base incluse)
docker compose down -v

# Relancer uniquement l'app (sans rebuild)
docker compose restart app

# Ouvrir un shell dans le conteneur app
docker compose exec app sh

# Lancer Prisma Studio depuis le conteneur
docker compose exec app npx prisma studio
```

---

## Structure du projet

```
app/
├── actions/          # Server Actions
│   ├── auth.ts       # login(), logout()
│   ├── post.ts       # createPost(), editPost()
│   ├── about.ts      # saveAbout() — admin seulement
│   └── profile.ts    # updateProfile()
├── api/
│   ├── auth/
│   │   ├── login/    # POST — retourne un JWT (custom)
│   │   ├── register/ # POST — crée un Author (custom)
│   │   └── [...all]/ # better-auth (vestigial)
│   ├── about/        # GET/POST — contenu de la page À propos
│   └── posts/        # GET/POST — liste et création de posts
├── components/
│   ├── Header.tsx
│   ├── LogoutButton.tsx
│   ├── AboutEditor.tsx
│   ├── EditPostForm.tsx
│   └── ProfileForm.tsx
├── lib/
│   ├── session.ts    # getSession(), createSession() — server-only
│   ├── jwt.ts        # signToken(), decodeToken()
│   ├── prisma.ts     # client Prisma singleton
│   ├── auth.ts       # better-auth config (vestigial)
│   └── auth-client.ts# better-auth client (vestigial)
├── blog/
│   ├── page.tsx      # Liste des articles (ISR)
│   ├── [id]/         # Article complet (ISR)
│   ├── create/       # Créer un article
│   └── edit/[id]/    # Modifier un article
├── about/            # Page À propos (ISR, éditeur admin intégré)
├── profil/           # Profil utilisateur
│   └── edit/         # Modifier son profil
├── login/            # Connexion (custom JWT)
└── signup/           # Inscription (better-auth)
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
```

## Notes importantes

- **Authentification** : le login utilise un système JWT custom (`app/lib/session.ts`). Le cookie `session` est httpOnly et signé avec `SESSION_SECRET`.
- **Mots de passe** : stockés en clair dans la table `Author` (pas de hachage). À ne pas utiliser en production sans ajout de bcrypt.
- **ISR** : `/blog`, `/blog/[id]` et `/about` utilisent l'ISR on-demand. Les pages sont régénérées uniquement quand un article est créé/modifié ou que le contenu About est sauvegardé.
- **Client Prisma** : généré dans `app/generated/prisma/` avec `@prisma/adapter-pg` (driver adapter natif, pas le client standard).
