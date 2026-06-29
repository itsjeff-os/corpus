import type { Env } from '../types';

export async function callModelViaGateway(env: Env, payload: unknown): Promise<unknown> {
  if (!env.AI_GATEWAY_URL) {
    return { skipped: true, reason: 'AI_GATEWAY_URL is not configured' };
  }

  return { placeholder: true, gatewayUrl: env.AI_GATEWAY_URL, payload };
}
