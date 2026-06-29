import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  AdapterKind,
  ApprovalRequest,
  ActionExecution,
  Ledger,
  ReflectionEvent,
  ReviewScope,
  RuntimeState,
  Session,
  UserLedgerRecord,
  WorkItem
} from "../types";

function createEmptyLedger(): Ledger {
  return {
    turnCount: 0,
    recentInputs: [],
    interactionHistory: [],
    decisions: [],
    assumptions: [],
    openQuestions: [],
    recoveryHistory: []
  };
}

function createEmptyState(): RuntimeState {
  return {
    sessions: [],
    workItems: [],
    approvals: [],
    executions: [],
    reflections: [],
    ledgers: []
  };
}

export class FileRuntimeStore {
  constructor(private readonly stateFilePath = path.resolve(process.cwd(), "runtime", "state.json")) {
    this.ensureStateFile();
  }

  loadState(): RuntimeState {
    return JSON.parse(readFileSync(this.stateFilePath, "utf8")) as RuntimeState;
  }

  getOrCreateSession(userId: string, adapter: AdapterKind): Session {
    const state = this.loadState();
    const existing = state.sessions.find((session) => session.userId === userId);
    const now = new Date().toISOString();

    if (existing) {
      if (!existing.sourceAdapters.includes(adapter)) {
        existing.sourceAdapters.push(adapter);
      }
      existing.updatedAt = now;
      this.saveState(state);
      return existing;
    }

    const session: Session = {
      id: randomUUID(),
      userId,
      sourceAdapters: [adapter],
      conversationId: `chief-of-staff:${userId}`,
      createdAt: now,
      updatedAt: now
    };

    state.sessions.push(session);
    this.saveState(state);
    return session;
  }

  getLedger(userId: string): Ledger {
    const state = this.loadState();
    return state.ledgers.find((record) => record.userId === userId)?.ledger ?? createEmptyLedger();
  }

  saveLedger(userId: string, ledger: Ledger): void {
    const state = this.loadState();
    const now = new Date().toISOString();
    const existing = state.ledgers.find((record) => record.userId === userId);

    if (existing) {
      existing.ledger = ledger;
      existing.updatedAt = now;
    } else {
      const record: UserLedgerRecord = { userId, ledger, updatedAt: now };
      state.ledgers.push(record);
    }

    this.saveState(state);
  }

  saveWorkItem(workItem: WorkItem): void {
    const state = this.loadState();
    const index = state.workItems.findIndex((candidate) => candidate.id === workItem.id);

    if (index >= 0) {
      state.workItems[index] = workItem;
    } else {
      state.workItems.push(workItem);
    }

    this.saveState(state);
  }

  getWorkItem(id: string): WorkItem | undefined {
    return this.loadState().workItems.find((workItem) => workItem.id === id);
  }

  getRecentWorkItems(userId: string, limit = 5): WorkItem[] {
    return this.loadState().workItems
      .filter((workItem) => workItem.userId === userId)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, limit);
  }

  saveApproval(approval: ApprovalRequest): void {
    const state = this.loadState();
    const index = state.approvals.findIndex((candidate) => candidate.id === approval.id);

    if (index >= 0) {
      state.approvals[index] = approval;
    } else {
      state.approvals.push(approval);
    }

    this.saveState(state);
  }

  getApproval(id: string): ApprovalRequest | undefined {
    return this.loadState().approvals.find((approval) => approval.id === id);
  }

  listPendingApprovals(): ApprovalRequest[] {
    return this.loadState().approvals
      .filter((approval) => approval.status === "pending")
      .sort((left, right) => left.createdAt.localeCompare(right.createdAt));
  }

  saveExecution(execution: ActionExecution): void {
    const state = this.loadState();
    state.executions.push(execution);
    this.saveState(state);
  }

  saveReflection(reflection: ReflectionEvent): void {
    const state = this.loadState();
    state.reflections.push(reflection);
    this.saveState(state);
  }

  listReflections(scope: ReviewScope): ReflectionEvent[] {
    const limit = scope.limit ?? 5;

    return this.loadState().reflections
      .filter((reflection) => !scope.userId || reflection.userId === scope.userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, limit);
  }

  private ensureStateFile(): void {
    const directory = path.dirname(this.stateFilePath);
    mkdirSync(directory, { recursive: true });

    if (!existsSync(this.stateFilePath)) {
      writeFileSync(this.stateFilePath, JSON.stringify(createEmptyState(), null, 2), "utf8");
    }
  }

  private saveState(state: RuntimeState): void {
    writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2), "utf8");
  }
}
