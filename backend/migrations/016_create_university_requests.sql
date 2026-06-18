CREATE TABLE IF NOT EXISTS university_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES super_admins(id)
);

CREATE INDEX IF NOT EXISTS idx_university_requests_user_id ON university_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_university_requests_status ON university_requests(status);

ALTER TABLE users ADD COLUMN IF NOT EXISTS university_request_status TEXT;

INSERT INTO universities (id, name, city, type)
VALUES ('other', 'Other (suggest yours)', '', 'public')
ON CONFLICT (id) DO NOTHING;
