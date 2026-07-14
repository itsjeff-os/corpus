import express from "express";
import { loadConfig } from "./config.js";
import { agentContracts } from "./registry/agents.js";
import { capabilities } from "./registry/capabilities.js";
import { dryRunRequest } from "./orchestrator/dry-run.js";
import { routeRequest } from "./orchestrator/router.js";
import { JsonlLedger } from "./ledger/ledger.js";

const config = loadConfig();
const app = express();
const ledger = new JsonlLedger(config.ledgerPath);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "agentic-control-plane",
    defaultAuthorization: config.defaultAuthorization
  });
});

app.get("/policy", (_req, res) => {
  res.json({
    defaultAuthorization: config.defaultAuthorization,
    mutationDefault: "blocked",
    naturalLanguagePermission: "not accepted for executor"
  });
});

app.get("/capabilities", (_req, res) => {
  res.json({ capabilities });
});

app.get("/agents", (_req, res) => {
  res.json({ agents: agentContracts });
});

app.post("/work-orders/dry-run", (req, res) => {
  const userIntent = String(req.body?.userIntent ?? "");
  if (!userIntent.trim()) {
    res.status(400).json({ error: "userIntent is required" });
    return;
  }
  res.json(dryRunRequest(userIntent));
});

app.post("/work-orders/route", (req, res) => {
  const userIntent = String(req.body?.userIntent ?? "");
  if (!userIntent.trim()) {
    res.status(400).json({ error: "userIntent is required" });
    return;
  }
  res.json(routeRequest(userIntent));
});

app.get("/work-orders/:id", (req, res) => {
  res.status(404).json({
    error: "work order persistence is not enabled in v1",
    requestId: req.params.id
  });
});

app.get("/ledger", async (_req, res) => {
  res.json({ events: await ledger.readAll() });
});

app.post("/evals/run", async (_req, res) => {
  res.status(501).json({
    error: "run evals through npm run evals in v1",
    command: "npm run evals"
  });
});

app.listen(config.port, () => {
  console.log(`agentic-control-plane listening on ${config.port}`);
});
