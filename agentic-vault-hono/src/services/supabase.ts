import { createClient } from '@supabase/supabase-js';
import type { Bindings, ControlPlaneState } from '../types';

function supabase(env: Bindings) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function fetchControlPlaneState(
  sessionId: string,
  env: Bindings
): Promise<ControlPlaneState> {
  const { data, error } = await supabase(env)
    .from('agent_control_plane')
    .select('session_id,constraints,permissions,updated_at')
    .eq('session_id', sessionId)
    .maybeSingle();

  if (error) {
    throw new Error(`Supabase control plane read failed: ${error.message}`);
  }

  return {
    sessionId,
    constraints: data?.constraints ?? {},
    permissions: data?.permissions ?? {},
    updatedAt: data?.updated_at
  };
}

export async function logInteraction(
  sessionId: string,
  userMessage: string,
  assistantReply: string,
  memoryDegraded: boolean,
  env: Bindings
): Promise<void> {
  const { error } = await supabase(env)
    .from('agent_interactions')
    .insert({
      session_id: sessionId,
      user_message: userMessage,
      assistant_reply: assistantReply,
      memory_degraded: memoryDegraded
    });

  if (error) {
    console.error('Supabase interaction log failed', error.message);
  }
}
