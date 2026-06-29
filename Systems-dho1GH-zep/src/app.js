import express from "express";
import cors from "cors";

import { errorHandler } from "./middleware/error-handler.js";
import { createChatRouter } from "./routes/chat.routes.js";

export function createApp({ chatController }) {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.use("/chat", createChatRouter(chatController));

  app.use(errorHandler);

  return app;
}
