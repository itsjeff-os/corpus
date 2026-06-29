import type { Env } from '../types';
import { handleGetContext } from './context';
import { handleLogTurn } from './log_turn';
import { handleSnapshotSession } from './snapshot_session';
import { handleProposeUpdate } from './propose_update';
import { handleApprovalRequest } from './approval_request';

export async function routeRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  if (url.pathname === '/context' && request.method === 'GET') return handleGetContext(request, env, ctx);
  if (url.pathname === '/log-turn' && request.method === 'POST') return handleLogTurn(request, env, ctx);
  if (url.pathname === '/snapshot-session' && request.method === 'POST') return handleSnapshotSession(request, env, ctx);
  if (url.pathname === '/propose-update' && request.method === 'POST') return handleProposeUpdate(request, env, ctx);
  if (url.pathname === '/approval-request' && request.method === 'POST') return handleApprovalRequest(request, env, ctx);

  return Response.json({ error: 'not_found' }, { status: 404 });
}
