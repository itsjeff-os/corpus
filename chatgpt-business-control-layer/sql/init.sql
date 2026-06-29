CREATE TABLE IF NOT EXISTS control_runs (
  run_id TEXT PRIMARY KEY,
  app_version TEXT NOT NULL,
  actor_hash TEXT NOT NULL,
  thread_id TEXT,
  request_class TEXT NOT NULL,
  requested_mode TEXT NOT NULL,
  allow_write BOOLEAN NOT NULL,
  status TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  integrity_score INTEGER NOT NULL,
  source_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  score_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  evaluator_outputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  integrity_report JSONB NOT NULL,
  answer_payload JSONB NOT NULL,
  proposed_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_input TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS control_runs_actor_hash_idx ON control_runs (actor_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS write_approvals (
  approval_id TEXT PRIMARY KEY,
  run_id TEXT NOT NULL REFERENCES control_runs(run_id) ON DELETE CASCADE,
  actor_hash TEXT NOT NULL,
  action_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  payload_summary JSONB NOT NULL,
  risk_summary TEXT NOT NULL,
  required_scopes JSONB NOT NULL DEFAULT '[]'::jsonb,
  justification TEXT NOT NULL,
  confirmation_token_hash TEXT NOT NULL,
  status TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  executed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS write_approvals_idempotency_idx ON write_approvals (idempotency_key);

CREATE TABLE IF NOT EXISTS write_executions (
  execution_id TEXT PRIMARY KEY,
  approval_id TEXT NOT NULL REFERENCES write_approvals(approval_id) ON DELETE CASCADE,
  actor_hash TEXT NOT NULL,
  provider TEXT NOT NULL,
  target_ref TEXT NOT NULL,
  request_payload JSONB NOT NULL,
  provider_response JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
