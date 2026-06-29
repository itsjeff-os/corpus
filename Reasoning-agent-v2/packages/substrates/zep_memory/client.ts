export interface ZepMemoryClientConfig {
  url?: string;
  apiKey?: string;
}

export class ZepMemoryClient {
  constructor(private config: ZepMemoryClientConfig) {}

  async health(): Promise<{ ok: boolean; substrate: string }> {
    return { ok: true, substrate: 'zep_memory' };
  }
}
