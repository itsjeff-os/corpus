import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

import { ZepService } from "./services/zep.service.js";
import { OpenAIService } from "./services/openai.service.js";
import { ContextService } from "./services/context.service.js";
import { ToolService } from "./services/tool.service.js";
import { ChatService } from "./services/chat.service.js";
import { ChatController } from "./controllers/chat.controller.js";

const zepService = new ZepService();
const openaiService = new OpenAIService();
const contextService = new ContextService({
  maxChars: env.MAX_CONTEXT_CHARS
});
const toolService = new ToolService();

const chatService = new ChatService({
  zepService,
  openaiService,
  contextService,
  toolService,
  logger
});

const chatController = new ChatController({ chatService });

const app = createApp({ chatController });

app.listen(env.PORT, () => {
  logger.info({ port: env.PORT }, "server started");
});
