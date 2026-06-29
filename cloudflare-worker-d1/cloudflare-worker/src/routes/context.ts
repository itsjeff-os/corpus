import type { Env } from '../types';
import { buildContextBundle } from '../orchestration/context_orchestrator';

export async function handleGetContext(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id') ?? 'unknown';
  const chatId = url.searchParams.get('chat_id') ?? 'unknown';
  const project = url.searchParams.get('project') ?? undefined;

  const bundle = await buildContextBundle({ userId, chatId, project }, env);
  return Response.json(bundle);
}
