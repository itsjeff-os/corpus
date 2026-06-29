import type {
  PersistedRun,
  PreparedWriteAction,
  StoredWriteExecution
} from "../types/contracts";

export interface ControlStore {
  initialize(): Promise<void>;
  getActorRunCount(actorHash: string): Promise<number>;
  saveRun(run: PersistedRun): Promise<void>;
  getRun(runId: string): Promise<PersistedRun | null>;
  saveApproval(approval: PreparedWriteAction): Promise<PreparedWriteAction>;
  getApproval(approvalId: string): Promise<PreparedWriteAction | null>;
  markApprovalExecuted(approvalId: string, executedAt: string): Promise<void>;
  recordExecution(execution: StoredWriteExecution): Promise<void>;
  getExecutionByApprovalId(approvalId: string): Promise<StoredWriteExecution | null>;
}
