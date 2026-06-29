import { ContextBundle, WorkItem } from "../types";

export interface DerivedMemoryRecord {
  authority: "derived";
  userId: string;
  workItemId: string;
  summary: string;
  tags: string[];
  sourcePaths: string[];
}

export function toDerivedMemoryRecord(workItem: WorkItem): DerivedMemoryRecord {
  return {
    authority: "derived",
    userId: workItem.userId,
    workItemId: workItem.id,
    summary: workItem.interaction.correctInference.summary,
    tags: [
      workItem.normalizedIntent.domain,
      workItem.normalizedIntent.requestedOutcome,
      workItem.interaction.optimalMode.mode
    ],
    sourcePaths: workItem.context.candidatePaths
  };
}

export function attachDerivedMemory(context: ContextBundle, summaries: string[]): ContextBundle {
  return {
    ...context,
    memorySummaries: [...context.memorySummaries, ...summaries]
  };
}
