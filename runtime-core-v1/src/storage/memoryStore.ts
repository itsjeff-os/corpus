import type { ReasoningGraphCore } from "../reasoning/graphCore.js";

export interface StoredEvent {
  id: string;
  type: string;
  payload: unknown;
  created_at: string;
}

export class MemoryStore {
  private activeGraph: ReasoningGraphCore | null = null;
  private events: StoredEvent[] = [];

  getGraph(): ReasoningGraphCore | null {
    return this.activeGraph;
  }

  setGraph(graph: ReasoningGraphCore): ReasoningGraphCore {
    this.activeGraph = graph;
    return graph;
  }

  addEvent(type: string, payload: unknown): StoredEvent {
    const event = {
      id: crypto.randomUUID(),
      type,
      payload,
      created_at: new Date().toISOString()
    };
    this.events.push(event);
    return event;
  }

  listEvents(): StoredEvent[] {
    return [...this.events];
  }
}
