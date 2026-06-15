CREATE TABLE super_admins (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  full_name      TEXT NOT NULL,
  last_login_at  TIMESTAMPTZ,
  last_login_ip  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_super_admins_email ON super_admins (email);

CREATE TABLE audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID NOT NULL REFERENCES super_admins(id),
  action       TEXT NOT NULL,
  target_type  TEXT NOT NULL,
  target_id    UUID NOT NULL,
  meta         JSONB,
  ip_address   TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_admin_id    ON audit_logs (admin_id);
CREATE INDEX idx_audit_logs_created_at  ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_target      ON audit_logs (target_type, target_id);
