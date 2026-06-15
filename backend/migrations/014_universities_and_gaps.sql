CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'public'
);

INSERT INTO universities (id, name, city, type) VALUES
  ('uy1', 'University of Yaoundé I', 'Yaoundé', 'public'),
  ('uy2', 'University of Yaoundé II', 'Soa', 'public'),
  ('ub', 'University of Buea', 'Buea', 'public'),
  ('udschang', 'University of Dschang', 'Dschang', 'public'),
  ('udla', 'University of Douala', 'Douala', 'public'),
  ('un', 'University of Ngaoundéré', 'Ngaoundéré', 'public'),
  ('um', 'University of Maroua', 'Maroua', 'public'),
  ('ubam', 'University of Bamenda', 'Bamenda', 'public'),
  ('yibs', 'YIBS', 'Yaoundé', 'private'),
  ('esstic', 'ESSTIC', 'Yaoundé', 'public'),
  ('ensp', 'ENSP', 'Yaoundé', 'public'),
  ('catholic', 'Catholic University of Cameroon', 'Bamenda', 'private')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE users ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS experience_level TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS remote_available BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS hired_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS response_time TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

ALTER TABLE messages ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
