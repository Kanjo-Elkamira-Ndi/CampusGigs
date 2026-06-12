# CampusGigs — Backend Agent Context

## Project Overview

A student gig marketplace. Students can post gigs (POSTER) or apply to work on them (WORKER). Has a separate Super Admin panel for platform management.

**Two frontends consume this API:**
- Student/poster app at `FRONTEND_URL` (port 5173)
- Admin panel at `ADMIN_PANEL_URL` (port 5174)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL via `pg` (raw SQL, no ORM) |
| Auth | Manual JWT (jsonwebtoken + bcryptjs) |
| File upload | Cloudinary via `multer-storage-cloudinary` |
| Email | Resend |
| Real-time | Socket.io |
| Validation | Zod |
| Testing | Jest + Supertest |

---

## Project Map

```
campus_gigs_backend/
├── migrations/             # SQL migration files (applied in order)
│   ├── 001_create_users.sql
│   ├── 002_create_better_auth_tables.sql   # TO BE REMOVED (see auth migration)
│   ├── 003_create_categories.sql
│   ├── 004_create_gigs.sql
│   ├── 005_create_applications.sql
│   ├── 006_create_reviews.sql
│   ├── 007_create_messages.sql
│   ├── 008_create_super_admins.sql
│   └── 009_create_updated_at_trigger.sql
├── scripts/
│   ├── migrate.js          # Reads & applies SQL files in order
│   ├── seed.js             # Seeds categories + super admin
│   └── reset.js            # Drops all tables
├── src/
│   ├── app.ts              # Express app factory
│   ├── server.ts           # Entry point
│   ├── config/
│   │   └── env.ts          # Zod-validated env vars
│   ├── lib/
│   │   ├── db.ts           # pg.Pool + query/queryOne/transaction helpers
│   │   ├── betterAuth.ts   # TO BE REMOVED (see auth migration)
│   │   └── socket.ts       # Socket.io init + getIO
│   ├── middleware/
│   │   ├── authGuard.ts    # JWT verification (TO BE REWRITTEN)
│   │   ├── requireRole.ts  # Role-based access control
│   │   ├── validate.ts     # Zod request validation
│   │   └── errorHandler.ts # Global error handler
│   ├── modules/
│   │   ├── auth/           # Auth (TO BE REWRITTEN for manual JWT)
│   │   ├── users/          # User profiles
│   │   └── categories/     # Gig categories
│   ├── types/
│   │   └── express.d.ts    # Express Request augmentation
│   └── utils/
│       ├── ApiResponse.ts  # Standard response wrapper
│       ├── ApiError.ts     # Custom error class
│       ├── asyncWrapper.ts # Async route handler wrapper
│       └── pagination.ts   # Pagination helper
├── package.json
└── tsconfig.json
```

---

## Architecture & Conventions

### Module Pattern

Every feature follows `routes → controller → service → dto (Zod)`:

```
modules/<name>/
├── <name>.routes.ts     # Router with middleware chain
├── <name>.controller.ts # Request/response handling (thin)
├── <name>.service.ts    # Business logic + DB queries
└── <name>.dto.ts        # Zod schemas + inferred types
```

**Rules:**
- Controllers call services, never query DB directly
- Services throw `ApiError` for error cases (never return error objects)
- All route handlers wrapped in `asyncWrapper` to forward errors
- DTOs define validation + TypeScript types via `z.infer`

### Response Format

Every response follows:

```ts
// Success
{ success: true, message: string, data: T }

// Error
{ success: false, message: string, errors?: unknown[] }
```

Use `ApiResponse.success(data, message)` and `ApiResponse.error(message, errors)`. The `errorHandler` middleware automatically formats unhandled errors.

### Error Handling

Throw `ApiError` (statusCode, message, errors?) anywhere in the chain — the `errorHandler` middleware catches it and returns a proper response. Unhandled errors return 500.

### Validation

Use `validate(Schema)` middleware in routes. By default validates `req.body`. Pass `'query'` or `'params'` as second arg for other sources.

### Route Registration

In `src/app.ts`:
```ts
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', usersRoutes)
app.use('/api/v1/categories', categoriesRoutes)
```

All new modules register here under the `/api/v1` prefix.

### Request Augmentation

`req.user` is populated by `authGuard` with:
```ts
{ id, email, name, fullName, role, universityId, avatarUrl, isBanned, emailVerified }
```

`req.admin` is populated by `superadminGuard` with:
```ts
{ id, email, type: 'superadmin' }
```

---

## Database

### Connection Pattern

```ts
import { query, queryOne, transaction } from '../../lib/db'

// Multiple rows
const rows = await query<MyType>('SELECT * FROM table WHERE id = $1', [id])

// Single row (null if not found)
const row = await queryOne<MyType>('SELECT * FROM table WHERE id = $1', [id])

// Transaction
const result = await transaction(async (client) => {
  await client.query('UPDATE ...', [val])
  return await client.query('INSERT ... RETURNING *', [val])
})
```

### Current Schema (tables)

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | All student/poster accounts | id, email, name, full_name, role (WORKER\|POSTER\|ADMIN), university_id, avatar_url, bio, avg_rating, review_count, is_banned, email_verified |
| `categories` | Gig categories | id, name, slug, icon_name |
| `gigs` | Gig listings | id, poster_id, category_id, title, description, budget, location, slots, deadline, status (OPEN\|IN_PROGRESS\|COMPLETED\|CANCELLED), search_vector (TSVECTOR) |
| `applications` | Worker applications to gigs | id, gig_id, worker_id, cover_note, status (PENDING\|ACCEPTED\|REJECTED\|COMPLETED), UNIQUE(gig_id, worker_id) |
| `reviews` | Ratings after completion | id, gig_id, reviewer_id, reviewee_id, rating (1-5), comment |
| `messages` | Per-application chat | id, application_id, sender_id, body, read, sent_at |
| `super_admins` | Platform admin accounts | id, email, password_hash, full_name, last_login_at |
| `audit_logs` | Super admin action trail | id, admin_id, action, target_type, target_id, meta (JSONB), ip_address |
| `sessions` | (to be removed) | Better-auth sessions |
| `accounts` | (to be removed) | Better-auth OAuth/password accounts |
| `verifications` | (to be removed) | Better-auth email verification |

---

## Auth Migration Plan — Better-Auth → Manual JWT

### Why

Better-auth adds complexity (its own tables, OAuth workflows, session management) that we don't need for this project. We want simple JWT-based auth with email/password.

### What to Remove

| File | Action |
|---|---|
| `src/lib/betterAuth.ts` | Delete entire file |
| `src/modules/auth/auth.routes.ts` | Rewrite — remove `toNodeHandler(auth)` delegate, add explicit routes |
| `src/modules/auth/auth.controller.ts` | Rewrite — no more `auth.api.getSession`, real DB queries |
| `src/middleware/authGuard.ts` | Rewrite — verify JWT from `Authorization: Bearer <token>` header instead of better-auth session |
| `migrations/002_create_better_auth_tables.sql` | Delete this migration file |
| `package.json` | Remove `better-auth` from dependencies |

### What to Add

| File | Purpose |
|---|---|
| `src/lib/jwt.ts` | `signAccessToken(user)`, `signRefreshToken(user)`, `verifyToken(token)` helpers. Access token signed with `JWT_SECRET`, refresh token signed with `JWT_REFRESH_SECRET` |
| `src/modules/auth/auth.service.ts` | `register()`, `login()`, `logout()`, `refreshToken()`, `getMe()`, `changePassword()` |
| `migrations/010_add_password_hash_to_users.sql` | `ALTER TABLE users ADD COLUMN password_hash TEXT;` Also: `DROP TABLE IF EXISTS sessions, accounts, verifications CASCADE;` |
| `Env vars` | Replace `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` with `JWT_SECRET` (min 64 chars), `JWT_REFRESH_SECRET` (min 64 chars). Remove `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Keep `JWT_EXPIRES_IN`, `SUPERADMIN_JWT_SECRET`, `SUPERADMIN_JWT_EXPIRES_IN` |

### Auth Flow

```
POST /api/v1/auth/register  → validate → hash password → insert user → return { user, accessToken, refreshToken }
POST /api/v1/auth/login      → find user by email → verify password → return { user, accessToken, refreshToken }
POST /api/v1/auth/logout     → verify access token → (stateless: client discards tokens)
POST /api/v1/auth/refresh    → verify refresh token → return new { accessToken, refreshToken }
GET  /api/v1/auth/me         → verify access token → return user profile
```

**Access token** — short-lived (default `JWT_EXPIRES_IN: 7d`). Sent as `Authorization: Bearer <token>`.

**Refresh token** — longer-lived (30d). Sent in httpOnly cookie or in response body (decide per frontend setup).

### Migration Steps (Ordered)

1. Run `npm run db:reset` (or create migration 010 that drops old tables + adds password_hash)
2. Delete `migrations/002_create_better_auth_tables.sql`
3. Add `migrations/010_manual_auth.sql` (add password_hash to users, drop sessions/accounts/verifications)
4. Create `src/lib/jwt.ts`
5. Rewrite `src/middleware/authGuard.ts`
6. Rewrite `src/modules/auth/auth.routes.ts` + `auth.controller.ts` + new `auth.service.ts`
7. Update `src/config/env.ts`
8. Remove `src/lib/betterAuth.ts`
9. `npm uninstall better-auth` + remove better-auth types if any
10. Run migrations + seed, test auth flow

### Super Admin Auth (separate, stays as-is)

Super admin uses a separate auth flow:
- `POST /api/v1/superadmin/auth/login` — credentials against `super_admins` table, JWT signed with `SUPERADMIN_JWT_SECRET`
- HttpOnly cookie-based (not Bearer token)
- No OAuth, no social login

---

## Module Catalog

### Auth (`/api/v1/auth`)

**Status:** Needs rewrite (see migration plan above).

### Users (`/api/v1/users`)

**Status:** Complete.

| Route | Method | Auth | Description |
|---|---|---|---|
| `/users/me` | GET | Bearer | Own profile with reviews + gig/application counts |
| `/users/me` | PATCH | Bearer | Update own profile (fullName, bio, universityId, avatarUrl) |
| `/users/:id` | GET | None | Public profile with reviews |

### Categories (`/api/v1/categories`)

**Status:** Complete.

| Route | Method | Auth | Description |
|---|---|---|---|
| `/categories` | GET | None | All categories with open gig count |
| `/categories/:slug` | GET | None | Single category by slug |

### Gigs (not yet built)

Expected at `/api/v1/gigs`. See frontend reference for expected shapes.

### Applications (not yet built)

Expected at `/api/v1/gigs/:id/applications`. See frontend reference.

### Reviews (not yet built)

Expected at `/api/v1/reviews`.

### Messages (not yet built)

Real-time via Socket.io + REST fallback.

### Super Admin (not yet built)

Separate prefix `/api/v1/superadmin/*`. Uses `SUPERADMIN_JWT_SECRET` auth. All mutations write to `audit_logs`.

---

## Middleware Catalog

| Middleware | Purpose | Usage |
|---|---|---|
| `authGuard` | Verifies JWT, populates `req.user` | Route-level: `router.get('/me', authGuard, handler)` |
| `requireRole('WORKER', 'POSTER')` | Restricts access by role | After authGuard: `router.post('/', authGuard, requireRole('POSTER'), handler)` |
| `validate(Schema)` | Zod validation of body/query/params | `router.patch('/', validate(UpdateProfileDto), handler)` |
| `errorHandler` | Global error formatting | Registered last in app |

### authGuard (after rewrite)

```ts
// Pseudocode for the new authGuard
// 1. Read Authorization header
// 2. Extract Bearer token
// 3. jwt.verify(token, JWT_SECRET)
// 4. If invalid → throw ApiError(401, '...')
// 5. If user is banned → throw ApiError(403, '...')
// 6. req.user = decoded payload
// 7. next()
```

### requireRole (stays as-is)

Takes variadic role strings. Works after `authGuard` has populated `req.user.role`.

### validate (stays as-is)

```ts
router.patch('/me', validate(UpdateProfileDto), handler)    // body (default)
router.get('/', validate(FilterDto, 'query'), handler)       // query
```

---

## Utilities

| File | Purpose |
|---|---|
| `ApiResponse.ts` | `success(data, msg)` / `error(msg, errors?)` |
| `ApiError.ts` | `new ApiError(401, 'msg')` or `(422, 'msg', fieldErrors)` |
| `asyncWrapper.ts` | Wraps async handlers so errors forward to `errorHandler` |
| `pagination.ts` | `parsePagination(req.query)` → `{ page, limit, skip, take }` |

### Pagination Pattern for New Modules

```ts
const { page, limit, skip } = parsePagination(req.query)

const [{ count }] = await queryOne<{ count: string }>('SELECT COUNT(*) FROM table')
const rows = await query<Type>('SELECT * FROM table ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, skip])

res.json(ApiResponse.success({
  data: rows,
  meta: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) },
}))
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | development / production / test |
| `PORT` | Server port (default 5000) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | (after migration) Min 64 chars for user tokens |
| `JWT_REFRESH_SECRET` | (after migration) Min 64 chars for refresh tokens |
| `JWT_EXPIRES_IN` | Access token expiry (default `7d`) |
| `SUPERADMIN_JWT_SECRET` | Min 64 chars for super admin tokens |
| `SUPERADMIN_JWT_EXPIRES_IN` | Super admin token expiry (default `4h`) |
| `SUPERADMIN_EMAIL` | Seeded super admin login |
| `SUPERADMIN_PASSWORD` | Seeded super admin password |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary config |
| `CLOUDINARY_API_KEY` | Cloudinary config |
| `CLOUDINARY_API_SECRET` | Cloudinary config |
| `RESEND_API_KEY` | Email sending |
| `RESEND_FROM_EMAIL` | Sender address |
| `FRONTEND_URL` | CORS origin for student/poster app |
| `ADMIN_PANEL_URL` | CORS origin for admin panel |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon + tsx |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled JS |
| `npm test` | Run Jest tests |
| `npm run db:migrate` | Apply SQL migrations in order |
| `npm run db:seed` | Seed categories + super admin |
| `npm run db:reset` | Drop all tables |

### Migration naming convention

Files in `migrations/` are prefixed with 3-digit numbers (`001_`, `002_`, ...) and applied alphabetically. Use the next available number for new migrations.

---

## Adding a New Module

1. Create `src/modules/<name>/<name>.dto.ts` — Zod schemas
2. Create `src/modules/<name>/<name>.service.ts` — DB queries + business logic
3. Create `src/modules/<name>/<name>.controller.ts` — Request/response handling
4. Create `src/modules/<name>/<name>.routes.ts` — Route definitions with middleware
5. Register in `src/app.ts`: `app.use('/api/v1/<name>', <name>Routes)`
6. Add migration file if new tables needed
7. Write tests in `tests/`

### Route File Template

```ts
import { Router } from 'express'
import { authGuard } from '../../middleware/authGuard'
import { requireRole } from '../../middleware/requireRole'
import { validate } from '../../middleware/validate'
import { CreateFooDto } from './foo.dto'
import * as controller from './foo.controller'

const router = Router()

router.get('/', controller.list)                              // public
router.post('/', authGuard, validate(CreateFooDto), controller.create)  // authenticated
router.get('/:id', controller.getById)                        // public
router.patch('/:id', authGuard, controller.update)            // owner only
router.delete('/:id', authGuard, requireRole('ADMIN'), controller.remove)  // admin

export default router
```

---

## Frontend Reference

The frontend lives at `references/frontend/`. It is currently a mock-based prototype — no real API calls exist yet. The `types/` directory in the frontend defines the expected response shapes for all entities (User, Gig, Application, Review, Message).

The `tasks.md` file documents the full API contract (endpoints, request/response shapes) derived from the frontend pages and the system architecture document.

---

## Notes for AI Agents

- **Always use `query`/`queryOne`/`transaction` from `../../lib/db`** for database access
- **Always wrap route handlers** with `asyncWrapper`
- **Always use `ApiResponse`** for responses and `ApiError` for errors
- **Always use `validate(Schema)`** for request body/query/params
- **Response keys are camelCase** even though DB columns are snake_case (mapped in services)
- **API version prefix is `/api/v1`** — register all new modules here
- **Auth is JWT-based** — `Authorization: Bearer <token>` after migration
- **Two separate JWT secrets**: one for users (`JWT_SECRET`), one for super admins (`SUPERADMIN_JWT_SECRET`)
- **No Redis** — cache is not used. No Pino — logging is not used.
