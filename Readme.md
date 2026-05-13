# CampusGigs

> A bilingual (EN/FR) student gig marketplace for Cameroon — connecting university students to odd jobs & freelance work, with Mobile Money payments and escrow protection.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)](https://react.dev)
[![Flutter](https://img.shields.io/badge/Flutter-3.x-02569B.svg)](https://flutter.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-336791.svg)](https://www.postgresql.org)

---

## The Problem

University students in Cameroon regularly face cash shortfalls between parental remittances. There is no trusted, structured channel for students to advertise their availability for odd jobs — cleaning, cooking, painting, tutoring, delivery — or for clients to hire them safely. Most arrangements happen informally over WhatsApp with no payment protection, no accountability, and no recourse when things go wrong.

**CampusGigs fixes that.**

---

## What It Is

CampusGigs is a hyperlocal gig marketplace built specifically for Cameroonian university students. Think of it as a local Fiverr + Indeed + Upwork, focused on the student economy — both physical odd jobs and digital micro-tasks, with built-in trust mechanisms and Mobile Money payment protection.

| Feature | Details |
|---|---|
| **Bilingual** | Full English / French interface toggle |
| **Physical + Digital gigs** | Cleaning, cooking, painting, tutoring, design, translation, delivery, and more |
| **Dual marketplace** | Students post services (Fiverr-style) or clients post jobs and workers apply (Indeed-style) |
| **Escrow payments** | Funds held until client confirms completion — no more payment ghosting |
| **Mobile Money** | MTN Mobile Money & Orange Money — no credit card required |
| **Verified students** | Optional student ID upload for a trust badge |
| **Workroom** | Per-order chat, file exchange, and milestone tracking |
| **Hyperlocal** | Location-tagged by city and campus area |

---

## Tech Stack

### Server
- **Runtime:** Node.js 20 + Express.js
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL 16 + Drizzle ORM
- **Auth:** [better-auth](https://better-auth.com) — Google, Facebook, Apple, X + Phone OTP
- **Real-time:** Socket.io
- **Payments:** MTN Mobile Money API + Orange Money API
- **Storage:** Cloudinary
- **Notifications:** Africa's Talking (SMS + OTP)
- **Testing:** Vitest + Supertest

### Web
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State:** Zustand (UI) + TanStack Query (server state)
- **Auth client:** better-auth browser SDK
- **i18n:** i18next (EN + FR)
- **HTTP:** Axios

### Mobile *(Phase 2)*
- **Framework:** Flutter 3 (Android-first)
- **State:** Riverpod
- **Navigation:** GoRouter
- **HTTP:** Dio
- **Models:** freezed

---

## Project Structure

```
campusgigs/
├── server/          # Node.js + Express API (TypeScript)
│   └── src/
│       ├── auth/            # better-auth instance + social providers
│       ├── controllers/     # HTTP request handlers
│       ├── routes/          # Express routers
│       ├── services/        # Business logic (escrow, payments, orders…)
│       ├── models/          # Drizzle ORM schema
│       ├── middleware/       # Auth, RBAC, validation, rate limiting
│       ├── sockets/         # Socket.io event handlers (workroom, notifications)
│       └── jobs/            # Background cron jobs
│
├── web/             # React + Vite web app
│   └── src/
│       ├── components/      # UI primitives, gig, order, workroom, auth components
│       ├── pages/           # Route-level page components
│       ├── hooks/           # Custom React hooks
│       ├── store/           # Zustand global state
│       └── lib/             # API client, Socket.io, better-auth, i18n
│
├── mobile/          # Flutter mobile app (Phase 2)
│   └── lib/
│       ├── core/            # API client, auth, socket, shared widgets/models
│       └── features/        # Feature-first modules (auth, gig, order, payment…)
│
└── shared/          # TypeScript enums & constants shared by server + web
```

---

## Version Roadmap

| Version | Name | Scope |
|---|---|---|
| **v0.1** | Internal Alpha | Project scaffold, auth, basic gig CRUD — team only |
| **v0.2** | Closed Beta | Workroom, full order flow, bilingual UI — 1 pilot campus (~40 users) |
| **v1.0** | Public Pilot | Live MoMo payments, escrow, reviews, featured listings — 2–3 universities |
| **v1.1** | Stabilisation | Cash-on-delivery, client job postings, milestones, referral programme |
| **v2.0** | Mobile + Scale | Flutter Android app, push notifications, recurring gigs, regional expansion |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm 10+ (workspaces enabled)
- A [Cloudinary](https://cloudinary.com) account (free tier is fine)
- MTN / Orange Money sandbox credentials (optional for local dev)

### 1. Clone & install

```bash
git clone https://github.com/Kanjo-Elkamira-Ndi/CampusGigs
cd campusgigs
npm install
```

### 2. Set up environment variables

```bash
# Server
cp server/.env.example server/.env

# Web
cp web/.env.example web/.env
```

Open `server/.env` and fill in:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/campusgigs

# better-auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:4000

# Social providers (better-auth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Africa's Talking (OTP/SMS)
AT_API_KEY=
AT_USERNAME=

# MTN MoMo (sandbox)
MOMO_API_KEY=
MOMO_SUBSCRIPTION_KEY=
MOMO_TARGET_ENV=sandbox

# Orange Money
ORANGE_MONEY_CLIENT_ID=
ORANGE_MONEY_CLIENT_SECRET=
```

### 3. Set up the database

```bash
cd server
npm run db:migrate      # run Drizzle migrations
npm run db:seed         # optional: seed dev data
```

### 4. Start development servers

From the monorepo root:

```bash
# Start both server and web concurrently
npm run dev

# Or individually:
npm run dev --workspace=server
npm run dev --workspace=web
```

The API will be available at `http://localhost:4000`  
The web app will be available at `http://localhost:5173`

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server + web in parallel |
| `npm run build` | Build server + web for production |
| `npm run test` | Run all test suites |
| `npm run lint` | ESLint across all workspaces |
| `npm run db:migrate` | Run pending Drizzle migrations |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Drizzle Studio (DB GUI) |

---

## API Overview

All endpoints are prefixed with `/api/v1`. Authentication uses JWT (issued by better-auth).

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/*` | better-auth social + OTP flows |
| `GET` | `/gigs` | List & search gigs |
| `POST` | `/gigs` | Create a gig (students only) |
| `GET` | `/gigs/:id` | Gig detail |
| `POST` | `/orders` | Place an order |
| `PATCH` | `/orders/:id/status` | Update order status |
| `GET` | `/orders/:id/workroom` | Workroom messages |
| `POST` | `/payments/initiate` | Initiate MoMo payment |
| `POST` | `/payments/webhook` | MoMo/OM webhook callback |
| `POST` | `/payouts` | Worker withdrawal request |
| `POST` | `/reviews` | Submit dual rating |
| `GET` | `/search` | Search gigs + workers |

Full API documentation is generated with **Swagger UI** and available at `http://localhost:4000/api/docs` when running in development.

---

## Social Authentication

CampusGigs uses [better-auth](https://better-auth.com) for social sign-in. The following providers are supported:

- **Google** (Gmail)
- **Facebook**
- **Apple**
- **X** (Twitter)
- **Phone OTP** (via Africa's Talking SMS)

Configure provider credentials in `server/.env` as shown above. The better-auth instance is defined in `server/src/auth/auth.ts` and mounted at `/api/auth/*`.

---

## Contributing

Contributions are welcome! Please read the guidelines before submitting a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using conventional commits: `git commit -m "feat: add payout dashboard"`
4. Push and open a pull request against `main`

Please make sure `npm run lint` and `npm run test` pass before submitting.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

**KANJO ELKAMIRA NDI**  
Built for Cameroonian university students. 🇨🇲

---

*CampusGigs — survive smarter.*