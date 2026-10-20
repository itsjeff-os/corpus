import type { Bindings, ZepMemoryResult } from '../types';

const ZEP_BASE_URL = 'https://api.getzep.com/api/v2';

async function zepFetch<T>(path: string, env: Bindings, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${ZEP_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Authorization': `Bearer ${env.ZEP_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Zep request failed: ${response.status} ${detail}`);
  }

  return response.json<T>();
}

export async function handleZepMemory(
  sessionId: string,
  message: string,
  env: Bindings
): Promise<ZepMemoryResult> {
  try {
    // This endpoint shape is intentionally isolated here so any Zep SDK/API
    // evolution is contained to this adapter instead of leaking through routes.
    const data = await zepFetch<{ context?: string }>(
      `/sessions/${encodeURIComponent(sessionId)}/memory?text=${encodeURIComponent(message)}`,
      env,
      { method: 'GET' }
    );

    return {
      context: data.context ?? '',
      degraded: false
    };
  } catch (error) {
    console.error('Zep memory degraded for this turn', error);
    return {
      context: '',
      degraded: true
    };
  }
}

export async function saveTurnToZep(
  sessionId: string,
  userMessage: string,
  assistantReply: string,
  env: Bindings
): Promise<void> {
  try {
    await zepFetch(`/sessions/${encodeURIComponent(sessionId)}/messages`, env, {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: assistantReply }
        ]
      })
    });
  } catch (error) {
    console.error('Failed to persist turn to Zep', error);
  }
}
