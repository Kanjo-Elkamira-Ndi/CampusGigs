CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TYPE user_role AS ENUM ('WORKER', 'POSTER', 'ADMIN');

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  name            TEXT NOT NULL,
  image           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Campus Gigs extensions
  full_name       TEXT NOT NULL DEFAULT '',
  avatar_url      TEXT,
  role            user_role NOT NULL DEFAULT 'WORKER',
  university_id   UUID,
  bio             TEXT,
  avg_rating      NUMERIC(3,2) NOT NULL DEFAULT 0,
  review_count    INT NOT NULL DEFAULT 0,
  is_banned       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_users_email    ON users (email);
CREATE INDEX idx_users_role     ON users (role);
