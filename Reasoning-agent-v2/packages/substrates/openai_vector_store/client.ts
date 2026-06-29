export interface OpenaiVectorStoreClientConfig {
  url?: string;
  apiKey?: string;
}

export class OpenaiVectorStoreClient {
  constructor(private config: OpenaiVectorStoreClientConfig) {}

  async health(): Promise<{ ok: boolean; substrate: string }> {
    return { ok: true, substrate: 'openai_vector_store' };
  }
}
