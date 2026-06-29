import type {
  PersistedRun,
  PreparedWriteAction,
  StoredWriteExecution
} from "../types/contracts";
import type { ControlStore } from "./controlStore";

export class MemoryControlStore implements ControlStore {
  private readonly runs = new Map<string, PersistedRun>();
  private readonly approvals = new Map<string, PreparedWriteAction>();
  private readonly approvalsByIdempotency = new Map<string, PreparedWriteAction>();
  private readonly executions = new Map<string, StoredWriteExecution>();
  private readonly executionByApproval = new Map<string, StoredWriteExecution>();

  async initialize() {
    return;
  }

  async getActorRunCount(actorHash: string) {
    let count = 0;
    for (const run of this.runs.values()) {
      if (run.actorHash === actorHash) {
        count += 1;
      }
    }

    return count;
  }

  async saveRun(run: PersistedRun) {
    this.runs.set(run.runId, run);
  }

  async getRun(runId: string) {
    return this.runs.get(runId) ?? null;
  }

  async saveApproval(approval: PreparedWriteAction) {
    const existing = this.approvalsByIdempotency.get(approval.idempotencyKey);
    if (existing) {
      const updated = {
        ...existing,
        ...approval,
        approvalId: existing.approvalId
      };
      this.approvals.set(existing.approvalId, updated);
      this.approvalsByIdempotency.set(approval.idempotencyKey, updated);
      return updated;
    }

    this.approvals.set(approval.approvalId, approval);
    this.approvalsByIdempotency.set(approval.idempotencyKey, approval);
    return approval;
  }

  async getApproval(approvalId: string) {
    return this.approvals.get(approvalId) ?? null;
  }

  async markApprovalExecuted(approvalId: string, executedAt: string) {
    const existing = this.approvals.get(approvalId);
    if (!existing) {
      return;
    }

    this.approvals.set(approvalId, {
      ...existing,
      status: "executed"
    });
  }

  async recordExecution(execution: StoredWriteExecution) {
    this.executions.set(execution.executionId, execution);
    this.executionByApproval.set(execution.approvalId, execution);
  }

  async getExecutionByApprovalId(approvalId: string) {
    return this.executionByApproval.get(approvalId) ?? null;
  }
}
