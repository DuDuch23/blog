# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run lint      # ESLint

npx prisma generate               # regenerate client to app/generated/prisma/ (required after clone)
npx prisma migrate dev --name X   # create + apply a new migration
npx prisma migrate deploy         # apply existing migrations (production)
npx prisma db seed                # seed via tsx prisma/seed.ts
```

**After a fresh clone**, run in order:
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init   # creates tables
npx prisma db seed                   # inserts test data
npm run dev
```

Environment variables required (create `.env` manually — not committed):
- `DATABASE_URL` — Prisma migrations (supports `prisma+postgres://` for local dev server or standard `postgresql://`)
- `POSTGRES_URL` — runtime client (`@prisma/adapter-pg`), must be a standard `postgres://` URL
- `SESSION_SECRET` — HMAC key for the custom JWT cookie
- `JWT_SECRET` — HMAC key for the API JWT routes
- `BETTER_AUTH_SECRET` — required by better-auth even if unused for login
- `BETTER_AUTH_URL` — e.g. `http://localhost:3000/`

**Note:** If using Prisma's local dev server (`prisma+postgres://`), run `npx prisma dev` in a separate terminal before migrations or seeding. For Docker or standard Postgres, a plain `postgresql://` URL works for both variables.

## Architecture

Next.js 16 App Router blog. Stack: Prisma 7 + PostgreSQL, Tailwind CSS v4, React 19.

### Auth system

The codebase originally had two auth systems; only the **custom JWT + cookie session** is active:

- **`app/lib/session.ts`** (`server-only`) — signs/verifies a JWT stored in an `httpOnly` cookie named `session`. Exports `getSession()`, `createSession()`, `deleteSession()`.
- **`app/lib/jwt.ts`** — separate JWT utility used by `/api/auth/login` and `/api/auth/register` API routes (returns tokens as JSON, no cookie).
- **`app/actions/auth.ts`** — `login()` Server Action (used by `/login` page) and `logout()`.
- **better-auth** (`app/lib/auth.ts`, `app/lib/auth-client.ts`, `/api/auth/[...all]`) — still present but unused for login/logout. Do not use `signIn`/`signOut`/`useSession` from auth-client in new code.

`getSession()` is the authorization chokepoint for all Server Actions and protected pages.

### Data models (`prisma/schema.prisma`)

- **`Author`** — the active user model. Has `id`, `email`, `pseudo`, `password` (plaintext), `name`, `bio`, `avatar`, `interests[]`, `role (BLOGGER|ADMIN)`, `posts[]`. Used by all blog logic.
- **`Post`** — belongs to `Author`. Has `title`, `date`, `wysiwygContent` (HTML from Quill), `image` (URL).
- **`SiteSetting`** — key/value store. Currently used for `about_content`.
- **`User`/`Session`/`Account`/`Verification`** — better-auth tables, not used by blog logic.

Prisma client generated to `app/generated/prisma/` (non-default). Import via `@/app/lib/prisma`.

### Pages and rendering strategy

| Route | Type | Rendering |
|---|---|---|
| `/` | Server Component | Dynamic |
| `/blog` | Server Component | ISR on-demand (`revalidate = false`) |
| `/blog/[id]` | Server Component | ISR on-demand, revalidated on create/edit |
| `/blog/create` | Client Component | Dynamic |
| `/blog/edit/[id]` | Server Component (shell) + Client form | Dynamic |
| `/about` | Server Component | ISR on-demand (`revalidate = false`) |
| `/login` | Client Component | Dynamic |
| `/signup` | Client Component | Dynamic |
| `/profil` | Server Component | Dynamic (auth-gated) |
| `/profil/edit` | Server Component (shell) + Client form | Dynamic (auth-gated) |

### Server Actions (`app/actions/`)

- **`auth.ts`** — `login(state, formData)`, `logout()`. Used by `/login` and `LogoutButton`.
- **`post.ts`** — `createPost(data)`, `editPost(data)`. Both call `revalidatePath` after mutation. `editPost` checks that the caller is the post's author or ADMIN.
- **`about.ts`** — `saveAbout(content)`. ADMIN only. Calls `revalidatePath('/about')`.
- **`profile.ts`** — `updateProfile(state, formData)`. Updates `name`, `bio`, `avatar`, `interests`. Calls `revalidatePath('/profil')`.

### Key conventions

- Protected pages call `getSession()` at the top and `redirect('/login')` if null.
- Role-gated logic: `session.role === 'ADMIN'` or `session.role === 'BLOGGER'`.
- ISR invalidation is on-demand only — no time-based revalidation. `revalidatePath` is called inside Server Actions after every mutation.
- Rich text editor: `react-quill-new` loaded with `dynamic(..., { ssr: false })`. Content stored as HTML in `Post.wysiwygContent`.
- Client forms that call Server Actions use `useActionState` + `useEffect` on `{ success: true }` for navigation (not `redirect()` inside the action).
