# CampusGigs — API Tasks

## Response Types

```ts
// All responses follow this format:
{ success: true, message: string, data: T }
{ success: false, message: string, errors?: unknown[] }
```

### User

```ts
interface PublicUser {
  id: string;
  fullName: string;
  avatarUrl?: string;
  universityName: string;
  universityId: string;
  city: string;
  avgRating: number;
  reviewCount: number;
  hiredCount: number;
  skills: string[];
  hourlyRate?: number;
  responseTime?: string;
  availability?: "Immediately" | "This Week" | "Next Week" | "Flexible";
  verified?: boolean;
  experienceLevel?: "Entry" | "Intermediate" | "Expert";
  remoteAvailable?: boolean;
  bio?: string;
  createdAt: string;
}
```

### Gig

```ts
type GigCategory = "Tutoring" | "Errands" | "Tech help" | "Events" | "Creative" | "Delivery" | "Translation" | "Photography" | "Other";
type GigStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Gig {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  universityId: string;
  universityName: string;
  city: string;
  category: GigCategory;
  status: GigStatus;
  slots: number;
  slotsRemaining: number;
  deadline: string;          // ISO
  createdAt: string;         // ISO
  poster: PublicUser;
  applicationCount: number;
  isEasyApply: boolean;
  tags?: string[];
}
```

### Application

```ts
type AppStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";

interface Application {
  id: string;
  gig: Gig;
  worker: PublicUser;
  coverNote: string;
  status: AppStatus;
  appliedAt: string;
}
```

### Review

```ts
interface Review {
  id: string;
  gig: Pick<Gig, "id" | "title" | "category">;
  reviewer: PublicUser;
  rating: number;
  comment: string;
  createdAt: string;
}
```

---

## 1. Auth — `/api/v1/auth`

All student/poster auth. After migration from better-auth to manual JWT.

### POST `/auth/register`

Create student/poster account.

**Request body:**
```ts
{
  fullName: string;          // min 2
  email: string;             // valid email
  password: string;          // min 8 chars
  universityId: string;      // university id (e.g. "ub", "uy1")
  role: "WORKER" | "POSTER"; // default "WORKER"
}
```

**Response `data`:**
```ts
{
  user: { id, email, fullName, role, universityId, universityName, city, createdAt },
  accessToken: string,   // JWT signed with JWT_SECRET
  refreshToken: string   // JWT signed with JWT_REFRESH_SECRET
}
```

### POST `/auth/login`

Email/password login.

**Request body:**
```ts
{ email: string; password: string }
```

**Response `data`:** Same shape as register (user + accessToken + refreshToken).

### POST `/auth/logout`

Invalidate session.

**Auth:** Bearer token

**Response `data`:** `null`

### POST `/auth/refresh`

Issue new token pair from valid refresh token.

**Request body:**
```ts
{ refreshToken: string }
```

**Response `data`:**
```ts
{ accessToken: string; refreshToken: string }
```

### GET `/auth/me`

Return authenticated user profile.

**Auth:** Bearer token

**Response `data`:**
```ts
{
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: "WORKER" | "POSTER" | "ADMIN";
  universityId: string;
  universityName: string;
  city: string;
  bio?: string;
  skills: string[];
  avgRating: number;
  reviewCount: number;
  hiredCount: number;
  hourlyRate?: number;
  responseTime?: string;
  availability?: string;
  verified?: boolean;
  emailVerified?: boolean;
  experienceLevel?: string;
  remoteAvailable?: boolean;
  createdAt: string;
}
```

### POST `/auth/forgot-password`

Send password reset email via Resend.

**Request body:**
```ts
{ email: string }
```

**Response `data`:** `null`

### POST `/auth/reset-password`

Reset password with token from email.

**Request body:**
```ts
{ token: string; password: string }
```

**Response `data`:** `null`

### POST `/auth/change-password`

Change password while authenticated.

**Auth:** Bearer token

**Request body:**
```ts
{ currentPassword: string; newPassword: string }
```

**Response `data`:** `null`

### DELETE `/auth/delete-account`

Delete own account.

**Auth:** Bearer token

**Response `data`:** `null`

### POST `/auth/verify-email`

Resend email verification.

**Auth:** Bearer token

**Request body:**
```ts
{ email: string }
```

**Response `data`:** `null`

### POST `/auth/sessions/sign-out-all`

Sign out all other sessions.

**Auth:** Bearer token

**Response `data`:** `null`

---

## 2. Users — `/api/v1/users`

### GET `/users/me`

Own profile with full details + recent reviews + counts.

**Auth:** Bearer token

**Response `data`:**
```ts
{
  // All User fields from /auth/me
  reviewsReceived: Review[];
  _count: { gigs: number; applications: number };
}
```

### PATCH `/users/me`

Update own profile.

**Auth:** Bearer token

**Request body:**
```ts
{
  fullName?: string;
  bio?: string;
  universityId?: string;
  avatarUrl?: string;
  skills?: string[];
  hourlyRate?: number;
  availability?: string;
  experienceLevel?: string;
  remoteAvailable?: boolean;
}
```

**Response `data`:** Updated user object.

### GET `/users/:id`

Public profile.

**Auth:** None

**Response `data`:**
```ts
PublicUser & {
  reviewsReceived: (Review & { gig: { id: string; title: string } })[];
  _count: { gigs: number; applications: number };
}
```

### GET `/users/:id/reviews`

All reviews received by a user.

**Auth:** None

**Response `data`:**
```ts
{
  reviews: Review[];
  avgRating: number;
  total: number;
}
```

---

## 3. Categories — `/api/v1/categories`

### GET `/categories`

List categories with open gig count.

**Auth:** None

**Response `data`:**
```ts
{ id: string; name: string; slug: string; iconName: string | null; _count: { gigs: number } }[]
```

### GET `/categories/:slug`

Single category by slug.

**Auth:** None

---

## 4. Gigs — `/api/v1/gigs`

### GET `/gigs`

List open gigs with filters.

**Auth:** None (or Bearer for personalized results)

**Query params:**
| Param | Type | Description |
|---|---|---|
| `q` | string | Search title, description, category, city, tags |
| `category` | string | Filter by GigCategory |
| `universityId` | string | Filter by university |
| `minBudget` | number | Min budget |
| `maxBudget` | number | Max budget |
| `status` | string | Filter by status (default OPEN) |
| `posterId` | string | Filter by poster (used on profile page) |
| `page` | number | Page number (default 1) |
| `limit` | number | Items per page (default 10, max 50) |

**Response `data`:**
```ts
{ data: Gig[]; meta: { page: number; limit: number; total: number; totalPages: number } }
```

### POST `/gigs`

Create a new gig.

**Auth:** Bearer (POSTER role)

**Request body:**
```ts
{
  title: string;            // 5-100 chars
  category: GigCategory;
  description: string;      // 20-2000 chars
  location: string;         // min 2
  budget: number;           // min 500
  slots: number;            // 1-10 (default 1)
  deadline: string;         // ISO date string
  universityId: string;
  isEasyApply: boolean;     // default true
  tags?: string[];
}
```

**Response `data`:** `Gig`

### GET `/gigs/:id`

Get single gig with poster profile and application count.

**Auth:** None

**Response `data`:** `Gig`

### PATCH `/gigs/:id`

Update gig fields (blocked after first acceptance).

**Auth:** Bearer (owner only)

**Request body:** Partial gig fields.

**Response `data`:** `Gig`

### DELETE `/gigs/:id`

Soft-delete: sets status=CANCELLED, notifies applicants.

**Auth:** Bearer (owner only)

**Response `data`:** `null`

### PATCH `/gigs/:id/close`

Mark gig as COMPLETED.

**Auth:** Bearer (owner only)

**Response `data`:** `Gig`

### POST `/gigs/:id/save`

Save/bookmark a gig.

**Auth:** Bearer

**Response `data`:** `null`

### DELETE `/gigs/:id/save`

Unsave a gig.

**Auth:** Bearer

**Response `data`:** `null`

### GET `/gigs/saved`

List saved/bookmarked gigs.

**Auth:** Bearer

**Response `data`:** `Gig[]`

---

## 5. Applications — `/api/v1`

### GET `/gigs/:id/applications`

List all applications for a gig (poster only).

**Auth:** Bearer (poster of the gig)

**Response `data`:**
```ts
(Application & { worker: PublicUser })[]
```

### POST `/gigs/:id/applications`

Apply to a gig.

**Auth:** Bearer (WORKER role)

**Request body:**
```ts
{ coverNote: string }
```

**Response `data`:** `Application`

### GET `/applications`

List current user's applications.

**Auth:** Bearer

**Query params:**
| Param | Type | Description |
|---|---|---|
| `status` | string | Filter by AppStatus |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response `data`:**
```ts
{ data: (Application & { gig: Gig })[]; meta: PaginationMeta }
```

### PATCH `/applications/:id/accept`

Accept application. Auto-rejects others if slots filled.

**Auth:** Bearer (poster of the gig)

**Response `data`:** `Application`

### PATCH `/applications/:id/reject`

Reject application. Notifies worker by email.

**Auth:** Bearer (poster of the gig)

**Request body:**
```ts
{ reason?: string }
```

**Response `data`:** `Application`

### PATCH `/applications/:id/complete`

Mark application as completed. Triggers review prompt.

**Auth:** Bearer (poster of the gig)

**Response `data`:** `Application`

---

## 6. Reviews — `/api/v1/reviews`

### POST `/reviews`

Create a review after completion.

**Auth:** Bearer

**Request body:**
```ts
{
  gigId: string;
  revieweeId: string;
  rating: number;       // 1-5
  comment: string;      // min 10 chars
}
```

**Response `data`:** `Review`

---

## 7. Messages — `/api/v1/messages`

### GET `/messages`

List all chat threads for the current user.

**Auth:** Bearer

**Response `data`:**
```ts
{
  id: string;
  otherUser: PublicUser;
  gigTitle: string;
  lastMessage: { text: string; sentAt: string; fromUserId: string };
  unreadCount: number;
}[]
```

### GET `/messages/:threadId`

Get full message thread.

**Auth:** Bearer

**Response `data`:**
```ts
{
  id: string;
  otherUser: PublicUser;
  gigTitle: string;
  messages: {
    id: string;
    fromUserId: string;
    text: string;
    sentAt: string;
    attachments?: { type: "image" | "file"; url: string; fileName?: string; fileSize?: number }[];
  }[];
}
```

### POST `/messages/:threadId`

Send a message.

**Auth:** Bearer

**Request body:**
```ts
{ text: string; attachments?: { type: string; url: string }[] }
```

### Socket.io events

- `join:thread` — Join a thread room
- `message:send` — Send message in real-time
- `message:received` — Receive message
- `message:read` — Mark as read

---

## 8. Notifications — `/api/v1/notifications`

### GET `/notifications`

List notifications.

**Auth:** Bearer

**Query params:**
| Param | Type | Description |
|---|---|---|
| `unreadOnly` | boolean | Filter only unread |
| `page` | number | Page number |
| `limit` | number | Items per page |

**Response `data`:**
```ts
{
  data: {
    id: string;
    type: "application" | "message" | "review" | "gig_update";
    title: string;
    message: string;
    time: string;       // relative time string or ISO
    read: boolean;
  }[];
  meta: PaginationMeta;
}
```

### PATCH `/notifications/:id`

Mark notification as read/unread.

**Auth:** Bearer

**Request body:**
```ts
{ read: boolean }
```

**Response `data`:** Updated notification.

### PATCH `/notifications/read-all`

Mark all notifications as read.

**Auth:** Bearer

**Response `data`:** `null`

### GET `/notifications/unread-count`

Get count of unread notifications.

**Auth:** Bearer

**Response `data`:**
```ts
{ count: number }
```

---

## 9. Freelancers — `/api/v1/freelancers`

### GET `/freelancers`

List workers with filters.

**Auth:** None

**Query params:**
| Param | Type | Description |
|---|---|---|
| `q` | string | Search name, skills, university, city, bio |
| `cities` | string[] | Filter by city |
| `universityIds` | string[] | Filter by university |
| `minRating` | number | Minimum avg rating |
| `availability` | string[] | Availability values |
| `minRate` | number | Min hourly rate |
| `maxRate` | number | Max hourly rate |
| `remoteOnly` | boolean | Remote available only |
| `verifiedOnly` | boolean | Verified only |
| `experienceLevels` | string[] | Entry / Intermediate / Expert |
| `sort` | "relevant" | "rating" | "hired" | "newest" | "rate-asc" | "rate-desc" |
| `page` | number | Default 1 |
| `limit` | number | Default 12 |

**Response `data`:**
```ts
{ data: PublicUser[]; meta: PaginationMeta }
```

---

## 10. Dashboard — `/api/v1/dashboard`

### GET `/dashboard/worker`

Worker dashboard aggregated data.

**Auth:** Bearer (WORKER)

**Response `data`:**
```ts
{
  stats: {
    activeApplications: number;
    applicationsAwaitingResponse: number;
    gigsCompleted: number;
    monthlyGigsCompleted: number;
    totalEarned: number;
    rating: number;
    reviewCount: number;
  };
  recentApplications: {
    id: string;
    gigTitle: string;
    posterName: string;
    budget: number;
    status: AppStatus;
    category: GigCategory;
  }[];
  recentMessages: {
    id: string;
    senderName: string;
    preview: string;
    time: string;
    unread: boolean;
  }[];
  weeklyActivity: { day: string; value: number }[];
  upcomingDeadline?: { gigTitle: string; dateTime: string; location: string };
}
```

### GET `/dashboard/poster`

Poster dashboard aggregated data.

**Auth:** Bearer (POSTER)

**Response `data`:**
```ts
{
  stats: {
    activeGigs: number;
    openGigs: number;
    inProgressGigs: number;
    newApplicants: number;
    applicantsToReview: number;
    gigsCompleted: number;
    avgWorkerRating: number;
    gigsWithReviews: number;
  };
  postedGigs: {
    id: string;
    title: string;
    budget: number;
    applicantCount: number;
    status: GigStatus;
    category: GigCategory;
  }[];
  applicantsToReview: {
    id: string;
    name: string;
    gigTitle: string;
    rating: number;
    reviewCount: number;
  }[];
  receivedReviews: {
    id: string;
    reviewerName: string;
    comment: string;
    rating: number;
  }[];
  recentMessages: {
    id: string;
    senderName: string;
    preview: string;
    time: string;
    unread: boolean;
  }[];
  weeklyPosts: { day: string; value: number }[];
}
```

---

## 11. Super Admin Auth — `/api/v1/superadmin/auth`

### POST `/superadmin/auth/login`

Credentials-only login against `super_admins` table.

**Auth:** None

**Request body:**
```ts
{ email: string; password: string }
```

**Response:** Sets httpOnly cookie with JWT (SUPERADMIN_JWT_SECRET)

**Response `data`:**
```ts
{ admin: { id: string; email: string; fullName: string }; lastLoginAt: string }
```

### POST `/superadmin/auth/logout`

Clears httpOnly session cookie.

**Auth:** SuperAdmin JWT (cookie)

**Response `data`:** `null`

### GET `/superadmin/auth/me`

Returns super admin profile and last-login metadata.

**Auth:** SuperAdmin JWT (cookie)

**Response `data`:**
```ts
{ id: string; email: string; fullName: string; lastLoginAt: string; createdAt: string }
```

---

## 12. Super Admin — `/api/v1/superadmin`

All routes protected by `superadminGuard` (JWT from cookie, signed with `SUPERADMIN_JWT_SECRET`). Every mutating action writes to `audit_logs`.

### GET `/superadmin/dashboard`

Platform stats.

**Response `data`:**
```ts
{
  totalUsers: number;
  totalGigs: number;
  totalApplications: number;
  totalRevenue?: number;
  activeUniversities: number;
  dailyActiveUsers: { date: string; count: number }[];
}
```

### GET `/superadmin/users`

Full user list with filters.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `role` | string | Filter by WORKER/POSTER |
| `universityId` | string | Filter by university |
| `isBanned` | boolean | Filter banned status |
| `q` | string | Search name/email |
| `dateFrom` | string | Joined after |
| `dateTo` | string | Joined before |
| `page` | number | |
| `limit` | number | |

**Response `data:`** Paginated user list with meta.

### PATCH `/superadmin/users/:id`

Update any user field. Ban/unban, change role, verify identity.

**Request body:**
```ts
{
  isBanned?: boolean;
  role?: "WORKER" | "POSTER" | "ADMIN";
  emailVerified?: boolean;
  verified?: boolean;
  fullName?: string;
  universityId?: string;
}
```

### DELETE `/superadmin/users/:id`

Hard delete user and all their data. Writes detailed audit entry.

### GET `/superadmin/gigs`

All gigs across all statuses and universities.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `status` | string | Filter by GigStatus |
| `category` | string | Filter by category |
| `universityId` | string | Filter by university |
| `posterId` | string | Filter by poster |
| `q` | string | Search title/description |
| `page` | number | |
| `limit` | number | |

### DELETE `/superadmin/gigs/:id`

Hard delete a gig and its applications. Notifies all parties.

### GET `/superadmin/audit-logs`

Paginated audit log.

**Query params:**
| Param | Type | Description |
|---|---|---|
| `adminId` | string | Filter by admin |
| `action` | string | Filter by action type |
| `dateFrom` | string | Filter by date range |
| `dateTo` | string | Filter by date range |
| `page` | number | |
| `limit` | number | |

### GET `/superadmin/universities`

List all universities with gig and user counts.

### POST `/superadmin/universities`

Add a new university.

**Request body:**
```ts
{ id: string; name: string; city: string; type: "public" | "private" }
```

### DELETE `/superadmin/reviews/:id`

Remove a review that violates guidelines.

---

## Universities Data (reference)

```ts
const CAMEROON_UNIVERSITIES = [
  { id: "uy1", name: "University of Yaoundé I", city: "Yaoundé", type: "public" },
  { id: "uy2", name: "University of Yaoundé II", city: "Soa", type: "public" },
  { id: "ub", name: "University of Buea", city: "Buea", type: "public" },
  { id: "udschang", name: "University of Dschang", city: "Dschang", type: "public" },
  { id: "udla", name: "University of Douala", city: "Douala", type: "public" },
  { id: "un", name: "University of Ngaoundéré", city: "Ngaoundéré", type: "public" },
  { id: "um", name: "University of Maroua", city: "Maroua", type: "public" },
  { id: "ubam", name: "University of Bamenda", city: "Bamenda", type: "public" },
  { id: "yibs", name: "YIBS", city: "Yaoundé", type: "private" },
  { id: "esstic", name: "ESSTIC", city: "Yaoundé", type: "public" },
  { id: "ensp", name: "ENSP", city: "Yaoundé", type: "public" },
  { id: "catholic", name: "Catholic University of Cameroon", city: "Bamenda", type: "private" },
] as const;
```
