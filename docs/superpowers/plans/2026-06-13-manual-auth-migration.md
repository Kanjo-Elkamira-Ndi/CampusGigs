# Manual JWT Auth (Registration + Login) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace better-auth with manual JWT auth starting with registration and login (the foundation for everything else).

**Architecture:** Stateless JWT auth: bcryptjs for password hashing, jsonwebtoken for signing. Access token (`JWT_SECRET`) + refresh token (`JWT_REFRESH_SECRET`). Registration creates a user with `password_hash` and returns token pair. Login verifies credentials and returns token pair. AuthGuard middleware verifies Bearer token from `Authorization` header.

**Folder convention:** Every module uses `controllers/`, `routes/`, `services/` subdirectories within the module folder.

**Tech Stack:** bcryptjs, jsonwebtoken, Zod, pg

---

### Task 1: Create migration 010 — add password_hash, drop better-auth tables, fix university_id type

**Files:**
- Create: `migrations/010_manual_auth.sql`
- Delete: `migrations/002_create_better_auth_tables.sql`

- [ ] **Step 1: Create migration file**

```sql
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ALTER COLUMN university_id TYPE TEXT USING university_id::TEXT;

DROP TABLE IF EXISTS verifications CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

DROP TRIGGER IF EXISTS sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS accounts_updated_at ON accounts;
```

- [ ] **Step 2: Remove old better-auth migration**

```bash
rm migrations/002_create_better_auth_tables.sql
```

- [ ] **Step 3: Commit**

```bash
git add migrations/010_manual_auth.sql
git rm migrations/002_create_better_auth_tables.sql
git commit -m "feat: add migration 010 — manual auth schema"
```

---

### Task 2: Update env config — replace better-auth vars with JWT vars

**Files:**
- Modify: `src/config/env.ts`
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Update Zod schema in `src/config/env.ts`**

Replace:
```ts
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
```

With:
```ts
  JWT_SECRET: z.string().min(64, 'JWT_SECRET must be at least 64 characters'),
  JWT_REFRESH_SECRET: z.string().min(64, 'JWT_REFRESH_SECRET must be at least 64 characters'),
```

- [ ] **Step 2: Update `.env.example`**

Replace the old better-auth + Google lines with new JWT vars:
```
JWT_SECRET=your-jwt-secret-min-64-chars-long-replace-this-in-production
JWT_REFRESH_SECRET=your-jwt-refresh-secret-min-64-chars-long-replace-this
```

Remove:
```
BETTER_AUTH_SECRET=your-super-secret-min-32-chars-here
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

- [ ] **Step 3: Update `.env`** (same changes as Step 2)

- [ ] **Step 4: Commit**

```bash
git add src/config/env.ts .env.example .env
git commit -m "feat: replace better-auth env vars with JWT_SECRET/JWT_REFRESH_SECRET"
```

---

### Task 3: Create JWT utilities

**Files:**
- Create: `src/lib/jwt.ts`

- [ ] **Step 1: Create `src/lib/jwt.ts`**

```ts
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

interface TokenPayload {
  sub: string
  email: string
  role: string
}

export function signAccessToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}

export function signRefreshToken(payload: { id: string }): string {
  return jwt.sign(
    { sub: payload.id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  )
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/jwt.ts
git commit -m "feat: add JWT sign/verify utilities"
```

---

### Task 4: Update auth DTOs for frontend-compatible registration

**Files:**
- Modify: `src/modules/auth/auth.dto.ts`

- [ ] **Step 1: Rewrite DTO**

The frontend sends `fullName` (not `name`) and `universityId` as a short string (not UUID).

```ts
import { z } from 'zod'

export const RegisterDto = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['WORKER', 'POSTER']).default('WORKER'),
  universityId: z.string().min(1, 'University is required'),
})

export const LoginDto = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type RegisterInput = z.infer<typeof RegisterDto>
export type LoginInput = z.infer<typeof LoginDto>
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/auth/auth.dto.ts
git commit -m "feat: update auth DTOs for frontend-compatible registration"
```

---

### Task 5: Create auth service (register + login)

**Files:**
- Create: `src/modules/auth/services/auth.service.ts`

- [ ] **Step 1: Create dir and service file**

```bash
mkdir -p src/modules/auth/services
```

```ts
// src/modules/auth/services/auth.service.ts
import bcrypt from 'bcryptjs'
import { query, queryOne } from '../../../lib/db'
import { ApiError } from '../../../utils/ApiError'
import { signAccessToken, signRefreshToken } from '../../../lib/jwt'
import type { RegisterInput, LoginInput } from '../auth.dto'

interface DbUser {
  id: string
  email: string
  name: string
  full_name: string
  role: string
  university_id: string | null
  avatar_url: string | null
  bio: string | null
  avg_rating: string
  review_count: number
  is_banned: boolean
  email_verified: boolean
  created_at: string
  updated_at: string
}

const formatUser = (u: DbUser) => ({
  id: u.id,
  email: u.email,
  name: u.name,
  fullName: u.full_name,
  role: u.role,
  universityId: u.university_id,
  avatarUrl: u.avatar_url,
  bio: u.bio,
  avgRating: Number(u.avg_rating),
  reviewCount: u.review_count,
  isBanned: u.is_banned,
  emailVerified: u.email_verified,
  createdAt: u.created_at,
  updatedAt: u.updated_at,
})

export async function register(data: RegisterInput) {
  const existing = await queryOne('SELECT id FROM users WHERE email = $1', [data.email])
  if (existing) throw new ApiError(409, 'Email already registered')

  const passwordHash = await bcrypt.hash(data.password, 12)
  const name = data.fullName.split(' ')[0] || data.fullName

  const user = await queryOne<DbUser>(
    `INSERT INTO users (email, name, full_name, password_hash, role, university_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, name, full_name, role, university_id,
               avatar_url, bio, avg_rating, review_count,
               is_banned, email_verified, created_at, updated_at`,
    [data.email, name, data.fullName, passwordHash, data.role, data.universityId]
  )

  if (!user) throw new ApiError(500, 'Failed to create user')

  return {
    user: formatUser(user),
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role }),
    refreshToken: signRefreshToken({ id: user.id }),
  }
}

export async function login(data: LoginInput) {
  const user = await queryOne<DbUser & { password_hash: string }>(
    `SELECT id, email, name, full_name, role, university_id,
            avatar_url, bio, avg_rating, review_count,
            is_banned, email_verified, created_at, updated_at,
            password_hash
     FROM users WHERE email = $1`,
    [data.email]
  )

  if (!user) throw new ApiError(401, 'Invalid email or password')
  if (user.is_banned) throw new ApiError(403, 'Your account has been banned')

  const valid = await bcrypt.compare(data.password, user.password_hash)
  if (!valid) throw new ApiError(401, 'Invalid email or password')

  return {
    user: formatUser(user),
    accessToken: signAccessToken({ id: user.id, email: user.email, role: user.role }),
    refreshToken: signRefreshToken({ id: user.id }),
  }
}
```

- [ ] **Step 2: Remove old flat controller and routes files**

```bash
rm src/modules/auth/auth.controller.ts
rm src/modules/auth/auth.routes.ts
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/auth/services/auth.service.ts
git rm src/modules/auth/auth.controller.ts src/modules/auth/auth.routes.ts
git commit -m "feat: add auth service with register and login"
```

---

### Task 6: Create auth controller in controllers/ folder

**Files:**
- Create: `src/modules/auth/controllers/auth.controller.ts`

- [ ] **Step 1: Create dir and controller file**

```bash
mkdir -p src/modules/auth/controllers
```

```ts
// src/modules/auth/controllers/auth.controller.ts
import { Request, Response } from 'express'
import { asyncWrapper } from '../../../utils/asyncWrapper'
import { ApiResponse } from '../../../utils/ApiResponse'
import * as authService from '../services/auth.service'

export const register = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.register(req.body)
  res.status(201).json(ApiResponse.success(result, 'Registration successful'))
})

export const login = asyncWrapper(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  res.json(ApiResponse.success(result, 'Login successful'))
})
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/auth/controllers/auth.controller.ts
git commit -m "feat: create auth controller with register and login handlers"
```

---

### Task 7: Create auth routes in routes/ folder and update app.ts

**Files:**
- Create: `src/modules/auth/routes/auth.routes.ts`
- Modify: `src/app.ts`

- [ ] **Step 1: Create dir and routes file**

```bash
mkdir -p src/modules/auth/routes
```

```ts
// src/modules/auth/routes/auth.routes.ts
import { Router } from 'express'
import { validate } from '../../../middleware/validate'
import { RegisterDto, LoginDto } from '../auth.dto'
import * as authController from '../controllers/auth.controller'

const router = Router()

router.post('/register', validate(RegisterDto), authController.register)
router.post('/login', validate(LoginDto), authController.login)

export default router
```

- [ ] **Step 2: Update `src/app.ts` import path**

Change:
```ts
import authRoutes from './modules/auth/auth.routes'
```
To:
```ts
import authRoutes from './modules/auth/routes/auth.routes'
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/auth/routes/auth.routes.ts
git add src/app.ts
git commit -m "feat: create auth routes with register/login endpoints"
```

---

### Task 8: Rewrite authGuard middleware

**Files:**
- Modify: `src/middleware/authGuard.ts`

- [ ] **Step 1: Rewrite to verify JWT from Bearer token**

```ts
import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { asyncWrapper } from '../utils/asyncWrapper'
import { verifyAccessToken } from '../lib/jwt'

export const authGuard = asyncWrapper(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid authorization header')
    }

    const token = header.slice(7)
    let payload: { sub: string; email: string; role: string }
    try {
      payload = verifyAccessToken(token)
    } catch {
      throw new ApiError(401, 'Invalid or expired token')
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as 'WORKER' | 'POSTER' | 'ADMIN',
      name: '',
      fullName: '',
      universityId: null,
      avatarUrl: null,
      isBanned: false,
      emailVerified: false,
    }

    next()
  }
)
```

Note: The `authGuard` now only decodes token payload. It doesn't query the DB — that's the caller's job via service layer. The `req.user` fields like `isBanned` are checked in the service when needed.

- [ ] **Step 2: Commit**

```bash
git add src/middleware/authGuard.ts
git commit -m "feat: rewrite authGuard to verify JWT Bearer token"
```

---

### Task 9: Remove betterAuth entirely

**Files:**
- Delete: `src/lib/betterAuth.ts`
- Modify: `package.json`
- Modify: `src/app.ts` (remove import if any)

- [ ] **Step 1: Delete betterAuth.ts**

```bash
rm src/lib/betterAuth.ts
```

- [ ] **Step 2: Uninstall better-auth**

```bash
npm uninstall better-auth
```

- [ ] **Step 3: Remove better-auth import from `src/app.ts` if present**

Check `src/app.ts` for any `import { auth } from ...` or `import './lib/betterAuth'` and remove those lines.

(If there was a reference like `import { auth } from './lib/betterAuth'` and it's unused, remove it.)

- [ ] **Step 4: Commit**

```bash
git add src/lib/betterAuth.ts
git rm src/lib/betterAuth.ts
git add package.json
git add src/app.ts
git commit -m "chore: remove better-auth and all dependencies"
```

---

### Task 10: Apply migration and test end-to-end

**Files:** (no file changes — run commands)

- [ ] **Step 1: Drop and recreate database**

```bash
npm run db:reset
npm run db:migrate
npm run db:seed
```

- [ ] **Step 2: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 3: Test registration with curl**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@campusgigs.cm",
    "password": "password123",
    "role": "WORKER",
    "universityId": "ub"
  }'
```

Expected response (201):
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "email": "test@campusgigs.cm",
      "name": "Test",
      "fullName": "Test User",
      "role": "WORKER",
      "universityId": "ub",
      "createdAt": "..."
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

- [ ] **Step 4: Test login with curl**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@campusgigs.cm",
    "password": "password123"
  }'
```

Expected response (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "...": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

- [ ] **Step 5: Test authGuard with the token**

```bash
export TOKEN="<access_token_from_login>"
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/v1/auth/me
```

Expected: 200 with user profile data.

- [ ] **Step 6: Commit final state**

```bash
git add -A
git commit -m "feat: complete manual JWT auth with register and login"
```

---

## Self-Review Checklist

1. **Spec coverage:** The spec requires register + login as the starting point for manual auth. Tasks 1-10 cover: migration setup, env config, JWT utils, DTOs, service layer, controller, routes, middleware, cleanup, and end-to-end testing. ✓
2. **Placeholder scan:** All code blocks are filled. No TODOs or TBDs. ✓
3. **Type consistency:** `verifyAccessToken` returns `{ sub, email, role }` — matching what `authGuard` destructures. `signAccessToken` receives `{ id, email, role }` — calling services pass consistent fields. ✓
