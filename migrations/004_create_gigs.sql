CREATE TYPE gig_status AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

CREATE TABLE gigs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id   UUID NOT NULL REFERENCES categories(id),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  budget        NUMERIC(10,2) NOT NULL,
  location      TEXT NOT NULL,
  slots         INT NOT NULL DEFAULT 1,
  deadline      TIMESTAMPTZ NOT NULL,
  status        gig_status NOT NULL DEFAULT 'OPEN',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE gigs
  ADD COLUMN search_vector TSVECTOR
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX idx_gigs_poster_id    ON gigs (poster_id);
CREATE INDEX idx_gigs_category_id  ON gigs (category_id);
CREATE INDEX idx_gigs_status       ON gigs (status);
CREATE INDEX idx_gigs_created_at   ON gigs (created_at DESC);
CREATE INDEX idx_gigs_search       ON gigs USING GIN (search_vector);
