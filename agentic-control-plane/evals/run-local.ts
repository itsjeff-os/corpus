import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dryRunRequest } from "../src/orchestrator/dry-run.js";
import { getCapability } from "../src/registry/capabilities.js";
import { evaluateCapability } from "../src/policy/kernel.js";

interface EvalCase {
  id: string;
  input: string;
  expect: {
    requiredAgents?: string[];
    forbiddenAgents?: string[];
    proposedCapability?: string;
    blockedCapability?: string;
    evidenceRequirement?: string;
  };
}

const here = dirname(fileURLToPath(import.meta.url));
const cases = JSON.parse(await readFile(join(here, "cases.json"), "utf8")) as EvalCase[];
const results = cases.map(runCase);
const failed = results.filter((result) => !result.pass);

console.log(JSON.stringify({ total: results.length, failed: failed.length, results }, null, 2));

if (failed.length) process.exit(1);

function runCase(testCase: EvalCase) {
  const result = dryRunRequest(testCase.input);
  const failures: string[] = [];

  for (const agent of testCase.expect.requiredAgents ?? []) {
    if (!result.workOrder.requiredAgents.includes(agent as never)) {
      failures.push(`missing required agent ${agent}`);
    }
  }

  for (const agent of testCase.expect.forbiddenAgents ?? []) {
    if (result.workOrder.requiredAgents.includes(agent as never)) {
      failures.push(`forbidden agent was routed ${agent}`);
    }
  }

  if (
    testCase.expect.proposedCapability &&
    !result.workOrder.proposedCapabilities.includes(testCase.expect.proposedCapability)
  ) {
    failures.push(`missing proposed capability ${testCase.expect.proposedCapability}`);
  }

  if (
    testCase.expect.evidenceRequirement &&
    !result.workOrder.evidenceRequirements.includes(testCase.expect.evidenceRequirement)
  ) {
    failures.push(`missing evidence requirement ${testCase.expect.evidenceRequirement}`);
  }

  if (testCase.expect.blockedCapability) {
    const capability = getCapability(testCase.expect.blockedCapability);
    if (!capability) {
      failures.push(`unknown expected capability ${testCase.expect.blockedCapability}`);
    } else {
      const decision = evaluateCapability(capability, { defaultAuthorization: "READ_ONLY" });
      if (decision.decision !== "block") {
        failures.push(`expected ${testCase.expect.blockedCapability} to be blocked`);
      }
    }
  }

  return {
    id: testCase.id,
    pass: failures.length === 0,
    failures
  };
}
