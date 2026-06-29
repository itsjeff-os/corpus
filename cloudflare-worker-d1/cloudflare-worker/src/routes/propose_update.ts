import type { Env } from '../types';

export async function handleProposeUpdate(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    route: 'propose-update',
    accepted: true,
    payload
  });
}
