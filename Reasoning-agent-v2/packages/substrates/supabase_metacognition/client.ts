export interface SupabaseMetacognitionClientConfig {
  url?: string;
  apiKey?: string;
}

export class SupabaseMetacognitionClient {
  constructor(private config: SupabaseMetacognitionClientConfig) {}

  async health(): Promise<{ ok: boolean; substrate: string }> {
    return { ok: true, substrate: 'supabase_metacognition' };
  }
}
