import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { runOpenAIOrchestration } from './services/openai';
import { fetchControlPlaneState, logInteraction } from './services/supabase';
import { handleZepMemory, saveTurnToZep } from './services/zep';
import type { Bindings, ChatPayload, EngineResult } from './types';

const app = new Hono<{ Bindings: Bindings }>();

const chatPayloadSchema = z.object({
  message: z.string().min(1, 'Message string required'),
  sessionId: z.string().min(1, 'sessionId required'),
  userId: z.string().optional()
});

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization']
  })
);

app.get('/health', (c) => c.json({ ok: true, service: 'agentic-vault-hono' }));

// ROUTE A: Voice Intake
app.post('/stream-audio', async (c) => {
  const audioBuffer = await c.req.arrayBuffer();

  if (!audioBuffer || audioBuffer.byteLength === 0) {
    return c.json({ error: 'Empty audio stream' }, 400);
  }

  const whisperRes = await c.env.AI.run('@cf/openai/whisper-large-v3-turbo', {
    audio: [...new Uint8Array(audioBuffer)]
  }) as { text?: string };

  if (!whisperRes?.text) {
    return c.json({ error: 'Transcription failed' }, 400);
  }

  const sessionId = c.req.header('x-session-id') ?? 'ios-session-voice';
  const result = await runCognitiveEngine(whisperRes.text, sessionId, c.env, true);
  return c.json(result);
});

// ROUTE B: Clean Text Intake
app.post('/text-intake', zValidator('json', chatPayloadSchema), async (c) => {
  const body: ChatPayload = c.req.valid('json');
  const result = await runCognitiveEngine(body.message, body.sessionId, c.env, false);
  return c.json(result);
});

// THE UNIFIED ENGINE PIPELINE
async function runCognitiveEngine(
  message: string,
  sessionId: string,
  env: Bindings,
  transcriptionUsed: boolean
): Promise<EngineResult> {
  const controlPlane = await fetchControlPlaneState(sessionId, env);
  const zepData = await handleZepMemory(sessionId, message, env);

  const reply = await runOpenAIOrchestration({
    message,
    memoryContext: zepData.context,
    controlPlane,
    env
  });

  await Promise.all([
    saveTurnToZep(sessionId, message, reply, env),
    logInteraction(sessionId, message, reply, zepData.degraded, env)
  ]);

  return {
    reply,
    context: {
      constraints: controlPlane.constraints,
      memoryDegraded: zepData.degraded,
      transcriptionUsed
    }
  };
}

export default app;
