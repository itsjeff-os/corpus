import { Pool } from "pg";
import type {
  PersistedRun,
  PreparedWriteAction,
  StoredWriteExecution
} from "../types/contracts";
import type { ControlStore } from "./controlStore";

const bootstrapSql = `
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
`;

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

function toJson<T>(value: JsonValue | T) {
  return JSON.stringify(value);
}

function fromRow(row: Record<string, unknown>): PersistedRun {
  const answerPayload = row.answer_payload as PersistedRun["answerPayload"];
  const scoreBreakdown = row.score_breakdown as PersistedRun["scoreBreakdown"];
  const evaluatorOutputs = row.evaluator_outputs as PersistedRun["evaluatorOutputs"];
  const createdAtValue = row.created_at;
  const createdAt =
    createdAtValue instanceof Date
      ? createdAtValue.toISOString()
      : new Date(String(createdAtValue)).toISOString();

  return {
    runId: String(row.run_id),
    actorHash: String(row.actor_hash),
    threadId: row.thread_id ? String(row.thread_id) : undefined,
    appVersion: String(row.app_version),
    requestClass: row.request_class as PersistedRun["requestClass"],
    requestedMode: row.requested_mode as PersistedRun["requestedMode"],
    allowWrite: Boolean(row.allow_write),
    status: row.status as PersistedRun["status"],
    confidence: Number(row.confidence),
    integrityScore: Number(row.integrity_score),
    sourceIds: row.source_ids as string[],
    scoreBreakdown,
    evaluatorOutputs,
    integrityReport: row.integrity_report as PersistedRun["integrityReport"],
    answerPayload,
    proposedActions: row.proposed_actions as string[],
    rawInput: row.raw_input ? String(row.raw_input) : undefined,
    createdAt
  };
}

function mapApproval(row: Record<string, unknown>): PreparedWriteAction {
  const expiresAtValue = row.expires_at;
  const expiresAt =
    expiresAtValue instanceof Date
      ? expiresAtValue.toISOString()
      : new Date(String(expiresAtValue)).toISOString();

  return {
    approvalId: String(row.approval_id),
    runId: String(row.run_id),
    actorHash: String(row.actor_hash),
    actionType: String(row.action_type),
    payload: row.payload as Record<string, unknown>,
    payloadSummary: row.payload_summary as PreparedWriteAction["payloadSummary"],
    riskSummary: String(row.risk_summary),
    requiredScopes: row.required_scopes as string[],
    justification: String(row.justification),
    confirmationTokenHash: String(row.confirmation_token_hash),
    expiresAt,
    idempotencyKey: String(row.idempotency_key),
    status: row.status as PreparedWriteAction["status"]
  };
}

function mapExecution(row: Record<string, unknown>): StoredWriteExecution {
  const createdAtValue = row.created_at;
  const createdAt =
    createdAtValue instanceof Date
      ? createdAtValue.toISOString()
      : new Date(String(createdAtValue)).toISOString();

  return {
    executionId: String(row.execution_id),
    approvalId: String(row.approval_id),
    actorHash: String(row.actor_hash),
    provider: String(row.provider),
    targetRef: String(row.target_ref),
    requestPayload: row.request_payload as Record<string, unknown>,
    providerResponse: row.provider_response as Record<string, unknown>,
    createdAt
  };
}

export class PostgresControlStore implements ControlStore {
  private readonly pool: Pool;

  constructor(databaseUrl: string) {
    this.pool = new Pool({
      connectionString: databaseUrl
    });
  }

  async initialize() {
    await this.pool.query(bootstrapSql);
  }

  async getActorRunCount(actorHash: string) {
    const result = await this.pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM control_runs WHERE actor_hash = $1`,
      [actorHash]
    );

    return Number(result.rows[0]?.count ?? "0");
  }

  async saveRun(run: PersistedRun) {
    await this.pool.query(
      `INSERT INTO control_runs (
        run_id, app_version, actor_hash, thread_id, request_class, requested_mode, allow_write,
        status, confidence, integrity_score, source_ids, score_breakdown, evaluator_outputs,
        integrity_report, answer_payload, proposed_actions, raw_input, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11::jsonb, $12::jsonb, $13::jsonb,
        $14::jsonb, $15::jsonb, $16::jsonb, $17, $18
      )`,
      [
        run.runId,
        run.appVersion,
        run.actorHash,
        run.threadId ?? null,
        run.requestClass,
        run.requestedMode,
        run.allowWrite,
        run.status,
        run.confidence,
        run.integrityScore,
        toJson(run.sourceIds),
        toJson(run.scoreBreakdown),
        toJson(run.evaluatorOutputs),
        toJson(run.integrityReport),
        toJson(run.answerPayload),
        toJson(run.proposedActions),
        run.rawInput ?? null,
        run.createdAt
      ]
    );
  }

  async getRun(runId: string) {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT * FROM control_runs WHERE run_id = $1`,
      [runId]
    );

    const row = result.rows[0];
    return row ? fromRow(row) : null;
  }

  async saveApproval(approval: PreparedWriteAction) {
    await this.pool.query(
      `INSERT INTO write_approvals (
        approval_id, run_id, actor_hash, action_type, payload, payload_summary, risk_summary,
        required_scopes, justification, confirmation_token_hash, status, idempotency_key, expires_at
      ) VALUES (
        $1, $2, $3, $4, $5::jsonb, $6::jsonb, $7,
        $8::jsonb, $9, $10, $11, $12, $13
      )
      ON CONFLICT (idempotency_key) DO UPDATE SET
        run_id = EXCLUDED.run_id,
        actor_hash = EXCLUDED.actor_hash,
        action_type = EXCLUDED.action_type,
        payload = EXCLUDED.payload,
        payload_summary = EXCLUDED.payload_summary,
        risk_summary = EXCLUDED.risk_summary,
        required_scopes = EXCLUDED.required_scopes,
        justification = EXCLUDED.justification,
        confirmation_token_hash = EXCLUDED.confirmation_token_hash,
        status = EXCLUDED.status,
        expires_at = EXCLUDED.expires_at`,
      [
        approval.approvalId,
        approval.runId,
        approval.actorHash,
        approval.actionType,
        toJson(approval.payload),
        toJson(approval.payloadSummary),
        approval.riskSummary,
        toJson(approval.requiredScopes),
        approval.justification,
        approval.confirmationTokenHash,
        approval.status,
        approval.idempotencyKey,
        approval.expiresAt
      ]
    );

    const existing = await this.pool.query<Record<string, unknown>>(
      `SELECT * FROM write_approvals WHERE idempotency_key = $1`,
      [approval.idempotencyKey]
    );

    const row = existing.rows[0];
    if (!row) {
      return approval;
    }

    return {
      ...mapApproval(row),
      confirmationTokenHash: approval.confirmationTokenHash
    };
  }

  async getApproval(approvalId: string) {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT * FROM write_approvals WHERE approval_id = $1`,
      [approvalId]
    );

    const row = result.rows[0];
    return row ? mapApproval(row) : null;
  }

  async markApprovalExecuted(approvalId: string, executedAt: string) {
    await this.pool.query(
      `UPDATE write_approvals
       SET status = 'executed', executed_at = $2
       WHERE approval_id = $1`,
      [approvalId, executedAt]
    );
  }

  async recordExecution(execution: StoredWriteExecution) {
    await this.pool.query(
      `INSERT INTO write_executions (
        execution_id, approval_id, actor_hash, provider, target_ref, request_payload, provider_response, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8
      )`,
      [
        execution.executionId,
        execution.approvalId,
        execution.actorHash,
        execution.provider,
        execution.targetRef,
        toJson(execution.requestPayload),
        toJson(execution.providerResponse),
        execution.createdAt
      ]
    );
  }

  async getExecutionByApprovalId(approvalId: string) {
    const result = await this.pool.query<Record<string, unknown>>(
      `SELECT * FROM write_executions WHERE approval_id = $1 LIMIT 1`,
      [approvalId]
    );

    const row = result.rows[0];
    return row ? mapExecution(row) : null;
  }
}
