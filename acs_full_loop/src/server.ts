import express from "express";
import { config } from "./config.js";
import { runAssistantTurn } from "./loop.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "assistant-cognitive-substrate-loop" });
});

app.post("/turn", async (req, res) => {
  try {
    const { userId, chatId, project, message } = req.body ?? {};

    if (!userId || !chatId || !message) {
      return res.status(400).json({
        error: "Missing required fields: userId, chatId, message"
      });
    }

    const result = await runAssistantTurn({
      userId,
      chatId,
      project: project ?? null,
      message
    });

    return res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message });
  }
});

app.listen(config.port, () => {
  console.log(`ACS loop listening on :${config.port}`);
});
