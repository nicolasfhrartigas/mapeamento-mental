CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  recovery_code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  athlete_name TEXT NOT NULL,
  sport TEXT NOT NULL,
  schema_version INTEGER NOT NULL,
  payload TEXT NOT NULL CHECK (json_valid(payload))
);

CREATE INDEX submissions_created_at ON submissions(created_at DESC);
