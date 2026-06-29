export const HOME_CHROMA_COLLECTIONS = [
  'home_ha_automations',
  'home_ha_reference',
  'home_system_docs',
  'home_patterns_rituals'
] as const;

export type HomeChromaCollection = typeof HOME_CHROMA_COLLECTIONS[number];

export interface ChromaPatternsClientConfig {
  url?: string;
  apiKey?: string;
  tenant?: string;
  database?: string;
  collectionIds?: Partial<Record<HomeChromaCollection, string>>;
  fetchImpl?: typeof fetch;
  embedQuery?: (text: string) => Promise<number[]> | number[];
}

export interface ChromaQueryOptions {
  collection?: HomeChromaCollection;
  queryEmbedding?: number[];
  where?: Record<string, unknown>;
  whereDocument?: Record<string, unknown>;
  nResults?: number;
  include?: Array<'distances' | 'documents' | 'embeddings' | 'metadatas' | 'uris'>;
}

export interface ChromaQueryResult {
  collection: HomeChromaCollection;
  ids: string[][];
  documents?: Array<Array<string | null>> | null;
  metadatas?: Array<Array<Record<string, unknown> | null>> | null;
  distances?: Array<Array<number | null>> | null;
  uris?: Array<Array<string | null>> | null;
}

interface ChromaCollectionRecord {
  id: string;
  name: string;
}

export class ChromaPatternsClient {
  private collectionIdCache = new Map<HomeChromaCollection, string>();

  constructor(private config: ChromaPatternsClientConfig) {}

  async health(): Promise<{ ok: boolean; substrate: string }> {
    return { ok: true, substrate: 'chroma_patterns' };
  }

  async queryByIntent(intent: string, options: ChromaQueryOptions = {}): Promise<ChromaQueryResult> {
    return this.queryCollection(options.collection ?? 'home_system_docs', intent, options);
  }

  async queryByEntity(entityId: string, options: ChromaQueryOptions = {}): Promise<ChromaQueryResult> {
    return this.queryCollection(options.collection ?? 'home_ha_automations', entityId, {
      ...options,
      whereDocument: options.whereDocument ?? { '$contains': entityId }
    });
  }

  async queryByRoom(room: string, options: ChromaQueryOptions = {}): Promise<ChromaQueryResult> {
    return this.queryCollection(options.collection ?? 'home_system_docs', room, {
      ...options,
      whereDocument: options.whereDocument ?? { '$contains': room }
    });
  }

  async querySimilarAutomation(description: string, options: ChromaQueryOptions = {}): Promise<ChromaQueryResult> {
    return this.queryCollection('home_ha_automations', description, options);
  }

  private async queryCollection(
    collection: HomeChromaCollection,
    queryText: string,
    options: ChromaQueryOptions
  ): Promise<ChromaQueryResult> {
    const collectionId = await this.resolveCollectionId(collection);
    const queryEmbedding = options.queryEmbedding ?? await this.embed(queryText);
    const response = await this.request(`/collections/${encodeURIComponent(collectionId)}/query`, {
      method: 'POST',
      body: JSON.stringify({
        query_embeddings: [queryEmbedding],
        where: options.where,
        where_document: options.whereDocument,
        n_results: options.nResults ?? 8,
        include: options.include ?? ['documents', 'metadatas', 'distances']
      })
    });

    return {
      collection,
      ids: response.ids ?? [],
      documents: response.documents,
      metadatas: response.metadatas,
      distances: response.distances,
      uris: response.uris
    };
  }

  private async embed(text: string): Promise<number[]> {
    if (!this.config.embedQuery) {
      throw new Error('ChromaPatternsClient requires queryEmbedding or config.embedQuery for semantic queries.');
    }
    return await this.config.embedQuery(text);
  }

  private async resolveCollectionId(collection: HomeChromaCollection): Promise<string> {
    const configured = this.config.collectionIds?.[collection];
    if (configured) {
      return configured;
    }

    const cached = this.collectionIdCache.get(collection);
    if (cached) {
      return cached;
    }

    const records = await this.request('/collections', { method: 'GET' }) as ChromaCollectionRecord[];
    const record = records.find((item) => item.name === collection);
    if (!record) {
      throw new Error(`Chroma collection not found: ${collection}`);
    }
    this.collectionIdCache.set(collection, record.id);
    return record.id;
  }

  private async request(path: string, init: RequestInit): Promise<any> {
    if (!this.config.url) {
      throw new Error('CHROMA_URL is required for ChromaPatternsClient requests.');
    }
    const fetcher = this.config.fetchImpl ?? fetch;
    const tenant = this.config.tenant ?? 'default_tenant';
    const database = this.config.database ?? 'default_database';
    const baseUrl = this.config.url.replace(/\/+$/, '');
    const url = `${baseUrl}/api/v2/tenants/${encodeURIComponent(tenant)}/databases/${encodeURIComponent(database)}${path}`;
    const headers = new Headers(init.headers);
    headers.set('content-type', 'application/json');
    if (this.config.apiKey) {
      headers.set('x-chroma-token', this.config.apiKey);
    }

    const response = await fetcher(url, { ...init, headers });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Chroma request failed (${response.status}): ${body}`);
    }
    return await response.json();
  }
}
