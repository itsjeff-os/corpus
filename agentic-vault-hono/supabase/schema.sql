create table if not exists public.agent_control_plane (
  session_id text primary key,
  constraints jsonb not null default '{}'::jsonb,
  permissions jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_interactions (
  id bigserial primary key,
  session_id text not null,
  user_message text not null,
  assistant_reply text not null,
  memory_degraded boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists agent_interactions_session_id_created_at_idx
  on public.agent_interactions (session_id, created_at desc);
