import type { Env } from '../types';

export async function handleSnapshotSession(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    route: 'snapshot-session',
    accepted: true,
    payload
  });
}
