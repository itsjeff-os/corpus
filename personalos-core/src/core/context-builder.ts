import { existsSync } from "fs";
import path from "path";
import { ContextBundle, Domain, RuntimeState, SpecialistResult, WorkItem } from "../types";

const domainPathMap: Record<Domain, string[]> = {
  self: ["01_Self"],
  home: ["02_Home"],
  money: ["03_Money"],
  work: ["04_Work"],
  projects: ["05_Projects", "05_Projects/Active"],
  knowledge: ["06_Knowledge", "06_Knowledge/Decisions"],
  operations: ["07_Infra", "07_Infra/Automations", "07_Infra/Systems"],
  admin: ["09_Admin"],
  media: ["08_Media"],
  inbox: ["00_Inbox"]
};

export class ContextBuilder {
  constructor(private readonly lifeOsRoot = process.env.LIFE_OS_ROOT ?? path.resolve(process.cwd(), "runtime", "life-os")) {}

  buildContext(workItem: WorkItem, runtimeState: RuntimeState): {
    context: ContextBundle;
    specialistResult: SpecialistResult;
  } {
    const rawPaths = [
      this.lifeOsRoot,
      ...domainPathMap[workItem.normalizedIntent.domain].map((relativePath) => path.join(this.lifeOsRoot, relativePath))
    ];

    const candidatePaths = Array.from(new Set(rawPaths)).filter((candidate) => existsSync(candidate));
    const recentWorkItemIds = runtimeState.workItems
      .filter((candidate) => candidate.userId === workItem.userId && candidate.id !== workItem.id)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, 3)
      .map((candidate) => candidate.id);

    const memorySummaries = runtimeState.reflections
      .filter((reflection) => reflection.userId === workItem.userId || reflection.workItemId === workItem.id)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
      .slice(0, 3)
      .map((reflection) => reflection.summary);

    const context: ContextBundle = {
      sourceOfTruth: "Life_OS",
      lifeOsRoot: this.lifeOsRoot,
      candidatePaths,
      notes: [
        `Route: ${workItem.normalizedIntent.route}`,
        `Mode: ${workItem.interaction.optimalMode.mode}`,
        `Correct inference: ${workItem.interaction.correctInference.summary}`
      ],
      recentWorkItemIds,
      memorySummaries,
      ledgerSnapshot: this.snapshotLedger(workItem.ledger),
      derivedSystems: {
        zep: "derived-memory-only",
        vectorStore: "derived-index-only"
      }
    };

    return {
      context,
      specialistResult: {
        specialist: "context-builder",
        summary: `Built a Life_OS context bundle with ${candidatePaths.length} candidate paths.`,
        payload: context
      }
    };
  }

  private snapshotLedger(ledger: WorkItem["ledger"]): string[] {
    const lines: string[] = [];

    lines.push(`turns=${ledger.turnCount}`);

    if (ledger.decisions.length > 0) {
      lines.push(`decision=${ledger.decisions[ledger.decisions.length - 1].decision}`);
    }
    if (ledger.assumptions.length > 0) {
      lines.push(`assumption=${ledger.assumptions[ledger.assumptions.length - 1].assumption}`);
    }
    if (ledger.openQuestions.length > 0) {
      lines.push(`open-question=${ledger.openQuestions[ledger.openQuestions.length - 1]}`);
    }
    if (ledger.recoveryHistory.length > 0) {
      lines.push(`recovery=${ledger.recoveryHistory[ledger.recoveryHistory.length - 1].move}`);
    }

    return lines;
  }
}
