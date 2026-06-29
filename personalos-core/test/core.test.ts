import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  fromChatGPTMessage,
  fromCloudflarePayload,
  fromLocalInput,
  PersonalOSCore
} from "../src/index";

function setupCore() {
  const root = mkdtempSync(path.join(os.tmpdir(), "personalos-core-"));
  const lifeOsRoot = path.join(root, "Life_OS");

  [
    "01_Self",
    "02_Home",
    "05_Projects/Active",
    "06_Knowledge/Decisions",
    "07_Infra/Automations",
    "07_Infra/Systems"
  ].forEach((relativePath) => {
    mkdirSync(path.join(lifeOsRoot, relativePath), { recursive: true });
  });

  const core = new PersonalOSCore({
    lifeOsRoot,
    stateFilePath: path.join(root, "runtime", "state.json")
  });

  return { core };
}

test("router keeps rigor when casual tone carries structural audit", () => {
  const { core } = setupCore();
  const assessment = core.assessInteraction(
    "lol this is messy but what is the sloppiest assumption in my architecture?",
    { adapter: "local", recentTurnSummaries: [] }
  );

  assert.ok(assessment.cues.some((cue) => cue.kind === "casual-playful-serious-analysis"));
  assert.ok(assessment.cues.some((cue) => cue.kind === "assumption-testing-language"));
  assert.equal(assessment.optimalMode.mode, "stress-test");
  assert.match(assessment.likelyInference.summary, /low-stakes|light/i);
  assert.match(assessment.correctInference.summary, /structural audit|premises/i);
});

test("router unpacks metaphor as mechanism", () => {
  const { core } = setupCore();
  const assessment = core.assessInteraction(
    "This feels like a cathedral with no load-bearing walls.",
    { adapter: "local", recentTurnSummaries: [] }
  );

  assert.ok(assessment.cues.some((cue) => cue.kind === "metaphor-as-diagnosis"));
  assert.equal(assessment.optimalMode.mode, "interpretive-unpacking");
  assert.match(assessment.recoveryMoves[0]?.instruction ?? "", /definition|mechanism|image/i);
});

test("broad but dialogic prompts route to scoped co-design", () => {
  const { core } = setupCore();
  const assessment = core.assessInteraction(
    "I want to rethink the whole Personal OS, but let's pull on that thread first and start from our interaction.",
    { adapter: "local", recentTurnSummaries: [] }
  );

  assert.ok(assessment.cues.some((cue) => cue.kind === "broad-problem-iterative-preference"));
  assert.equal(assessment.optimalMode.mode, "scoped-co-design");
});

test("continuity compounds through ledger and recent work items", () => {
  const { core } = setupCore();
  const first = core.submitIntake(
    fromLocalInput({
      userId: "jeff",
      input: "Help me map my AI learning project, but do it one slice at a time."
    })
  );
  const second = core.submitIntake(
    fromLocalInput({
      userId: "jeff",
      input: "Good. What should the next slice be?"
    })
  );

  assert.equal(first.ledger.turnCount, 1);
  assert.equal(second.ledger.turnCount, 2);
  assert.ok(second.context.recentWorkItemIds.includes(first.id));
  assert.ok(second.context.ledgerSnapshot.length > 0);
});

test("adapter translations yield consistent routing outcomes", () => {
  const { core } = setupCore();
  const localItem = core.submitIntake(
    fromLocalInput({
      userId: "jeff",
      input: "Help me plan my project roadmap in one slice first."
    })
  );
  const chatgptItem = core.submitIntake(
    fromChatGPTMessage({
      userId: "jeff",
      message: "Help me plan my project roadmap in one slice first.",
      conversationId: "abc"
    })
  );

  assert.equal(localItem.normalizedIntent.route, chatgptItem.normalizedIntent.route);
  assert.equal(localItem.interaction.optimalMode.mode, chatgptItem.interaction.optimalMode.mode);
  assert.equal(localItem.status, chatgptItem.status);
});

test("mutating requests are approval gated before execution", () => {
  const { core } = setupCore();
  const workItem = core.submitIntake(
    fromCloudflarePayload({
      kind: "message",
      format: "text",
      payload: {
        userId: "jeff",
        message: "Please update my weekly plan and write it into Life_OS."
      }
    })
  );

  assert.equal(workItem.status, "awaiting_approval");
  const approvals = core.listPendingApprovals();
  assert.equal(approvals.length, 1);

  const execution = core.approveAction(approvals[0].id);
  assert.equal(execution.status, "executed");

  const refreshed = core.getWorkItem(workItem.id);
  assert.equal(refreshed?.status, "approved");
});
