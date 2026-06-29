import { Command } from "commander";
import { readFile } from "node:fs/promises";
import { capabilities } from "./registry/capabilities.js";
import { agentContracts } from "./registry/agents.js";
import { dryRunRequest } from "./orchestrator/dry-run.js";
import { routeRequest } from "./orchestrator/router.js";
import { ActionPacketSchema, AuthorizationGrantSchema } from "./schemas.js";
import { evaluateActionPacket } from "./policy/kernel.js";
import { inventoryCorpus } from "./adapters/filesystem.js";

const program = new Command();

program.name("agentic-control-plane").description("Authority-controlled agentic runtime CLI");

program.command("capabilities").action(() => {
  print({ capabilities });
});

program.command("agents").action(() => {
  print({ agents: agentContracts });
});

program.command("route").argument("<request-file>").action(async (requestFile) => {
  const payload = await readJson(requestFile);
  print(routeRequest(String(payload.userIntent ?? "")));
});

program.command("dry-run").argument("<request-file>").action(async (requestFile) => {
  const payload = await readJson(requestFile);
  print(dryRunRequest(String(payload.userIntent ?? "")));
});

program.command("policy-check").argument("<packet-file>").option("--grant <grant-file>").action(async (packetFile, options) => {
  const packet = ActionPacketSchema.parse(await readJson(packetFile));
  const grants = options.grant ? [AuthorizationGrantSchema.parse(await readJson(options.grant))] : [];
  print(evaluateActionPacket(packet, { defaultAuthorization: "READ_ONLY", grants }));
});

program.command("inspect").requiredOption("--domain <domain>").option("--root <path>").action(async (options) => {
  if (options.domain !== "filesystem") {
    print({ status: "read_only_adapter_scaffold", domain: options.domain });
    return;
  }
  print({ entries: await inventoryCorpus(options.root ?? ".", 2) });
});

program.command("evals").action(async () => {
  await import("../evals/run-local.js");
});

program.parseAsync();

async function readJson(path: string) {
  return JSON.parse(await readFile(path, "utf8"));
}

function print(value: unknown) {
  console.log(JSON.stringify(value, null, 2));
}
