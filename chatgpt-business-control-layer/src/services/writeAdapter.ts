import { randomUUID } from "node:crypto";
import { getEnv } from "../config/env";
import type {
  PreparedWriteAction,
  StoredWriteExecution,
  WriteExecutionReceipt
} from "../types/contracts";

export class PrivateSystemWriteAdapter {
  private readonly env = getEnv();

  validateActionType(actionType: string) {
    if (actionType !== this.env.PRIVATE_SYSTEM_ACTION_TYPE) {
      throw new Error(
        `Unsupported action type "${actionType}". Only "${this.env.PRIVATE_SYSTEM_ACTION_TYPE}" is allowed in v1.`
      );
    }
  }

  summarizePayload(actionType: string, payload: Record<string, unknown>) {
    this.validateActionType(actionType);
    const title = String(payload.title ?? "Internal note");
    const body = String(payload.body ?? "");
    const preview = body.length > 140 ? `${body.slice(0, 137)}...` : body;

    return {
      title,
      preview
    };
  }

  requiredScopes() {
    return [this.env.PRIVATE_SYSTEM_SCOPE];
  }

  riskSummary() {
    return "This action writes a new internal note to a private system. It is reversible only through the private system’s own controls and therefore requires explicit human approval.";
  }

  async execute(
    approval: PreparedWriteAction,
    payload: Record<string, unknown>
  ): Promise<StoredWriteExecution> {
    this.validateActionType(approval.actionType);

    if (this.env.PRIVATE_SYSTEM_WRITE_URL && this.env.PRIVATE_SYSTEM_BEARER_TOKEN) {
      const response = await fetch(this.env.PRIVATE_SYSTEM_WRITE_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.env.PRIVATE_SYSTEM_BEARER_TOKEN}`
        },
        body: JSON.stringify({
          actionType: approval.actionType,
          payload
        })
      });

      const providerResponse = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (!response.ok) {
        throw new Error(`Private system write failed with status ${response.status}.`);
      }

      return {
        executionId: randomUUID(),
        approvalId: approval.approvalId,
        actorHash: approval.actorHash,
        provider: "private_system_http",
        targetRef: String(providerResponse.id ?? providerResponse.noteId ?? "unknown"),
        requestPayload: payload,
        providerResponse,
        createdAt: new Date().toISOString()
      };
    }

    return {
      executionId: randomUUID(),
      approvalId: approval.approvalId,
      actorHash: approval.actorHash,
      provider: "private_system_stub",
      targetRef: `stub:${approval.approvalId}`,
      requestPayload: payload,
      providerResponse: {
        ok: true,
        mode: "stub",
        message: "No PRIVATE_SYSTEM_WRITE_URL configured; returned a stub receipt."
      },
      createdAt: new Date().toISOString()
    };
  }

  toReceipt(execution: StoredWriteExecution): WriteExecutionReceipt {
    return {
      executionId: execution.executionId,
      approvalId: execution.approvalId,
      provider: execution.provider,
      targetRef: execution.targetRef,
      createdAt: execution.createdAt
    };
  }
}
