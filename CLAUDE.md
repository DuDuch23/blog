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
npx prisma migrate deploy         # apply existing migrations (no-op if none exist yet)
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

Environment variables required (create `.env` manually — not committed): `DATABASE_URL`, `POSTGRES_URL`, `SESSION_SECRET`, `JWT_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.

## Architecture

Next.js 16 App Router blog. Stack: Prisma 7 + PostgreSQL, Tailwind CSS v4, React 19.

### Two parallel auth systems (important)

The codebase has two auth systems that coexist and are **not interchangeable**:

1. **better-auth** (`app/lib/auth.ts`, `app/lib/auth-client.ts`) — mounted at `/api/auth/[...all]/route.ts`. Used in `app/layout.tsx` to get the session for the `<Header>`. Manages its own `User`, `Session`, `Account`, `Verification` tables.

2. **Custom JWT + cookie session** (`app/lib/jwt.ts`, `app/lib/session.ts`) — used by Server Actions (`app/actions/auth.ts`, `app/actions/post.ts`) and the API routes `/api/auth/login` and `/api/auth/register`. Stores a signed JWT in an `httpOnly` cookie named `session`. `app/lib/session.ts` is `server-only`.

These operate on different user tables: better-auth uses `User`; the custom system uses `Author`. When adding auth-gated features, check which system the surrounding code uses before calling session utilities.

### Data models

Two distinct user-like models in `prisma/schema.prisma`:
- `Author` — used by the custom auth system and all blog content (has `posts`, `role: BLOGGER|ADMIN`)
- `User` / `Session` / `Account` / `Verification` — managed by better-auth

`Post` belongs to `Author` (not `User`). `SiteSetting` is a key/value store for site-wide config.

The Prisma client is generated to `app/generated/prisma/` (non-default). Import from there or via `@/app/lib/prisma`.

### Key conventions

- Server Actions are in `app/actions/` and are marked `'use server'`. They call `getSession()` from `app/lib/session.ts` for auth checks.
- API routes under `app/api/auth/login` and `app/api/auth/register` use `signToken()` from `app/lib/jwt.ts` and operate on the `Author` model directly.
- `getSession()` (from `app/lib/session.ts`) is the authorization chokepoint for Server Actions — it is server-only and reads the `session` cookie.
- `authClient` (from `app/lib/auth-client.ts`) exposes `signIn`, `signUp`, `signOut`, `useSession` for client components via better-auth.
- Rich text posts use `react-quill-new`; the content is stored as HTML in `Post.wysiwygContent`.
