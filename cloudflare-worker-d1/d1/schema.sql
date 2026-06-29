-- Cloudflare D1 runtime schema.
-- D1 is edge-operational state, not the metacognitive source of truth.

CREATE TABLE IF NOT EXISTS runtime_jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  payload_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS route_config (
  id TEXT PRIMARY KEY,
  route_name TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  config_json TEXT,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_ledger (
  id TEXT PRIMARY KEY,
  substrate TEXT NOT NULL,
  sync_type TEXT NOT NULL,
  status TEXT NOT NULL,
  cursor TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
