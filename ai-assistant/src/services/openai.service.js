import OpenAI from "openai";
import { env } from "../config/env.js";
import { SYSTEM_PROMPT } from "../prompts/assistant.prompt.js";
import { tools } from "../schemas/tool.schema.js";

export class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: env.OPENAI_API_KEY
    });
    this.model = env.OPENAI_MODEL;
  }

  async createInitialResponse({ contextBlock, message }) {
    return this.client.responses.create({
      model: this.model,
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: contextBlock || "No additional context."
            }
          ]
        },
        {
          role: "user",
          content: [{ type: "input_text", text: message }]
        }
      ],
      tools
    });
  }

  async continueWithToolOutput({ previousResponseId, callId, toolOutput }) {
    return this.client.responses.create({
      model: this.model,
      instructions: SYSTEM_PROMPT,
      previous_response_id: previousResponseId,
      input: [
        {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(toolOutput)
        }
      ],
      tools
    });
  }

  extractText(response) {
    return response.output_text || "";
  }

  extractFunctionCalls(response) {
    return (response.output || []).filter((item) => item.type === "function_call");
  }
}
