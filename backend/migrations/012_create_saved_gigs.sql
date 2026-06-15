CREATE TABLE IF NOT EXISTS saved_gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gig_id UUID NOT NULL REFERENCES gigs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, gig_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_gigs_user_id ON saved_gigs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_gigs_gig_id ON saved_gigs(gig_id);
