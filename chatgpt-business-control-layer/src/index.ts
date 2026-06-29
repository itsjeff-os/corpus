import { getEnv } from "./config/env";
import type { ModelClient, StructuredGenerationRequest } from "./models/modelClient";
import { OpenAIModelClient } from "./models/openaiModelClient";
import { createMcpServer } from "./mcp/server";
import { ControlService } from "./services/controlService";
import { createControlStore } from "./stores";

class MissingApiKeyModelClient implements ModelClient {
  async generateStructured<T>(_request: StructuredGenerationRequest<T>): Promise<T> {
    throw new Error("OPENAI_API_KEY is required to run the governed control pipeline.");
  }
}

async function main() {
  const env = getEnv();
  const store = createControlStore(env);
  await store.initialize();

  const modelClient: ModelClient = env.OPENAI_API_KEY
    ? new OpenAIModelClient(env.OPENAI_API_KEY, env.OPENAI_MODEL)
    : new MissingApiKeyModelClient();

  const controlService = new ControlService(modelClient, store);
  const server = createMcpServer(controlService);

  server.listen(env.PORT, env.HOST, () => {
    console.log(`Listening on http://${env.HOST}:${env.PORT}`);
    console.log(`MCP endpoint: http://${env.HOST}:${env.PORT}${env.MCP_PATH}`);
  });
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
