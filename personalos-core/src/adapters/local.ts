import { IntakeRequest, WorkItem } from "../types";

export interface LocalAdapterInput {
  userId: string;
  input: string;
  metadata?: Record<string, string>;
}

export function fromLocalInput(payload: LocalAdapterInput): IntakeRequest {
  return {
    adapter: "local",
    userId: payload.userId,
    input: payload.input,
    metadata: payload.metadata
  };
}

export function toLocalSummary(workItem: WorkItem): string {
  return [
    `work-item=${workItem.id}`,
    `route=${workItem.normalizedIntent.route}`,
    `mode=${workItem.interaction.optimalMode.mode}`,
    `status=${workItem.status}`
  ].join(" ");
}
