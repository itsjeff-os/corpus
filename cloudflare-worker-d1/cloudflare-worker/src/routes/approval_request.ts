import type { Env } from '../types';

export async function handleApprovalRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const payload = await request.json().catch(() => ({}));
  return Response.json({
    ok: true,
    route: 'approval-request',
    accepted: true,
    payload
  });
}
