CREATE TYPE app_status AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');

CREATE TABLE applications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id      UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  worker_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_note  TEXT NOT NULL,
  status      app_status NOT NULL DEFAULT 'PENDING',
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (gig_id, worker_id)
);

CREATE INDEX idx_applications_gig_id    ON applications (gig_id);
CREATE INDEX idx_applications_worker_id ON applications (worker_id);
CREATE INDEX idx_applications_status    ON applications (status);
