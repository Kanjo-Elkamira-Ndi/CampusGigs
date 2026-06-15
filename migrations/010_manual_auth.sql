ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ALTER COLUMN university_id TYPE TEXT USING university_id::TEXT;

DROP TABLE IF EXISTS verifications CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

DROP TRIGGER IF EXISTS sessions_updated_at ON sessions;
DROP TRIGGER IF EXISTS accounts_updated_at ON accounts;
