import { AppError } from "../utils/errors.js";

export class ChatService {
  constructor({ zepService, openaiService, contextService, toolService, logger }) {
    this.zepService = zepService;
    this.openaiService = openaiService;
    this.contextService = contextService;
    this.toolService = toolService;
    this.logger = logger;
  }

  async reply({ userId, threadId, message }) {
    await this.zepService.ensureThread({ threadId, userId });

    // Fast path: add user message and get context in one Zep round-trip
    let zepContextResult;
    try {
      zepContextResult = await this.zepService.addUserMessageAndReturnContext({
        threadId,
        userId,
        message
      });
    } catch (err) {
      this.logger.warn({ err: err.message }, "zep add+context failed, retrying split flow");

      await this.zepService.addUserMessage({ threadId, userId, message });
      zepContextResult = await this.zepService.getUserContext({ threadId });
    }

    const contextBlock = this.contextService.build({
      zepContext: zepContextResult,
      appContext: {
        userProfile: { userId }
      }
    });

    let response = await this.openaiService.createInitialResponse({
      contextBlock,
      message
    });

    while (true) {
      const calls = this.openaiService.extractFunctionCalls(response);
      if (!calls.length) break;

      // V1: handle one at a time
      const call = calls[0];
      const args = JSON.parse(call.arguments || "{}");

      const toolOutput = await this.toolService.execute(call.name, args);

      response = await this.openaiService.continueWithToolOutput({
        previousResponseId: response.id,
        callId: call.call_id,
        toolOutput
      });
    }

    const reply = this.openaiService.extractText(response);

    if (!reply) {
      throw new AppError("Model did not return a reply", 502);
    }

    await this.zepService.addAssistantMessage({
      threadId,
      content: reply
    });

    return {
      reply
    };
  }
}
