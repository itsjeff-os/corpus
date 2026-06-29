import { createGraphitiClient } from "../graphiti/client.js";
import { createZepClient } from "../zep/client.js";

type ContextPayload = {
  entityId: string;
  content: string;
  metadata?: Record<string, unknown>;
};

export const contextActivities = {
  async upsertGraphiti(payload: ContextPayload): Promise<void> {
    const client = createGraphitiClient();
    await client.upsertContext(payload);
  },
  async upsertZepGraph(payload: ContextPayload): Promise<void> {
    const client = createZepClient();
    await client.upsertGraphContext(payload);
  },
};

export type ContextActivities = typeof contextActivities;
