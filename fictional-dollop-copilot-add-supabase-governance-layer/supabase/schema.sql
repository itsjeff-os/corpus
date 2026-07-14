create extension if not exists pgcrypto;

DO $$
BEGIN
  CREATE TYPE node_kind AS ENUM ('observation', 'interpretation', 'inference', 'conclusion', 'feedback');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$
BEGIN
  CREATE TYPE approval_state AS ENUM ('pending', 'approved', 'rejected', 'expired');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

create table if not exists conversation_history (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  role text not null check (role in ('user', 'assistant', 'system', 'tool')),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists assistant_state (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  current_mode text not null,
  strategy text,
  permission_state text not null default 'suggest_only',
  context_budget text not null default 'minimal',
  visible_epistemics text not null default 'light',
  response_shape text,
  updated_at timestamptz not null default now()
);

create table if not exists user_state (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  session_id text,
  preferences jsonb not null default '{}'::jsonb,
  constraints jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists reasoning_graphs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  title text,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reasoning_nodes (
  id uuid primary key default gen_random_uuid(),
  graph_id uuid not null references reasoning_graphs(id) on delete cascade,
  node_kind node_kind not null,
  content text not null,
  confidence numeric(5,4),
  epistemic_status text not null default 'inferred',
  created_at timestamptz not null default now(),
  constraint reasoning_nodes_graph_id_id_unique unique (graph_id, id)
);

create table if not exists reasoning_edges (
  id uuid primary key default gen_random_uuid(),
  graph_id uuid not null references reasoning_graphs(id) on delete cascade,
  from_node_id uuid not null,
  to_node_id uuid not null,
  relation text not null default 'supports',
  created_at timestamptz not null default now(),
  constraint no_self_edge check (from_node_id <> to_node_id),
  constraint fk_reasoning_edges_from_node foreign key (graph_id, from_node_id)
    references reasoning_nodes(graph_id, id) on delete cascade,
  constraint fk_reasoning_edges_to_node foreign key (graph_id, to_node_id)
    references reasoning_nodes(graph_id, id) on delete cascade
);

create or replace function enforce_reasoning_edge_same_graph()
returns trigger
language plpgsql
as $$
declare
  from_graph uuid;
  to_graph uuid;
begin
  select graph_id into from_graph from reasoning_nodes where id = new.from_node_id;
  select graph_id into to_graph from reasoning_nodes where id = new.to_node_id;

  if from_graph is null or to_graph is null then
    raise exception 'reasoning_edges references missing reasoning_nodes';
  end if;

  if from_graph <> new.graph_id or to_graph <> new.graph_id then
    raise exception 'reasoning_edges.graph_id must match from/to node graph_id';
  end if;

  return new;
end $$;

drop trigger if exists reasoning_edges_enforce_same_graph on reasoning_edges;
create trigger reasoning_edges_enforce_same_graph
before insert or update on reasoning_edges
for each row execute function enforce_reasoning_edge_same_graph();

create table if not exists inference_logs (
  id uuid primary key default gen_random_uuid(),
  graph_id uuid references reasoning_graphs(id) on delete set null,
  inference_summary text not null,
  evidence jsonb not null default '[]'::jsonb,
  status text not null default 'proposed',
  created_at timestamptz not null default now()
);

create table if not exists epistemic_checks (
  id uuid primary key default gen_random_uuid(),
  graph_id uuid references reasoning_graphs(id) on delete set null,
  check_name text not null,
  check_result text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists strategy_library (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  trigger text not null,
  move text not null,
  avoid jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists strategy_uses (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid references strategy_library(id) on delete set null,
  session_id text,
  outcome text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists misfire_taxonomy (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists repair_moves (
  id uuid primary key default gen_random_uuid(),
  misfire_id uuid references misfire_taxonomy(id) on delete set null,
  name text not null,
  instruction text not null,
  created_at timestamptz not null default now()
);

create table if not exists soft_constraints (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  constraint_key text not null,
  constraint_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists constraint_updates (
  id uuid primary key default gen_random_uuid(),
  constraint_id uuid references soft_constraints(id) on delete set null,
  update_reason text,
  previous_value jsonb,
  next_value jsonb,
  created_at timestamptz not null default now()
);

create table if not exists assistant_reflections (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  reflection text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists batch_logs (
  id uuid primary key default gen_random_uuid(),
  batch_name text not null,
  status text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  state approval_state not null default 'pending',
  requested_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists session_deltas (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  delta jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists cognitive_state_snapshots (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  assistant_state_id uuid references assistant_state(id) on delete set null,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

-- Permanent O/I/N/C/F traceability substrate per assistant turn.
create table if not exists reasoning_integrity_frames (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  graph_id uuid references reasoning_graphs(id) on delete set null,
  turn_ref text,
  observation text not null,
  interpretation text not null,
  inference text not null,
  conclusion text not null,
  feedback text,
  created_at timestamptz not null default now()
);

create table if not exists audit_tool_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text,
  tool_name text not null,
  operation text not null,
  request_payload jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes for common context-hydration and timeline access patterns.
create index if not exists idx_conversation_history_session_created_at
  on conversation_history (session_id, created_at desc);
create index if not exists idx_events_session_created_at
  on events (session_id, created_at desc);
create index if not exists idx_assistant_state_session
  on assistant_state (session_id);
create index if not exists idx_user_state_user
  on user_state (user_id);
create index if not exists idx_reasoning_graphs_session_status
  on reasoning_graphs (session_id, status);
create index if not exists idx_reasoning_nodes_graph_created_at
  on reasoning_nodes (graph_id, created_at desc);
create index if not exists idx_reasoning_edges_graph
  on reasoning_edges (graph_id);
create index if not exists idx_inference_logs_graph
  on inference_logs (graph_id);
create index if not exists idx_epistemic_checks_graph
  on epistemic_checks (graph_id);
create index if not exists idx_strategy_uses_session_created_at
  on strategy_uses (session_id, created_at desc);
create index if not exists idx_soft_constraints_session_key
  on soft_constraints (session_id, constraint_key);
create index if not exists idx_approval_requests_session_requested_at
  on approval_requests (session_id, requested_at desc);
create index if not exists idx_session_deltas_session_created_at
  on session_deltas (session_id, created_at desc);
create index if not exists idx_cognitive_state_snapshots_session_created_at
  on cognitive_state_snapshots (session_id, created_at desc);
create index if not exists idx_reasoning_integrity_frames_session_created_at
  on reasoning_integrity_frames (session_id, created_at desc);
create index if not exists idx_audit_tool_logs_session_created_at
  on audit_tool_logs (session_id, created_at desc);
