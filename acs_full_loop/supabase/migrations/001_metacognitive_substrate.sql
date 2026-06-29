create extension if not exists "pgcrypto";

create table if not exists conversation_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text not null,
  project text,
  role text not null,
  message text not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);
create index if not exists idx_conversation_history_user_chat on conversation_history(user_id, chat_id, created_at);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  event_type text not null,
  payload jsonb default '{}',
  source_message_id uuid references conversation_history(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists idx_events_user_chat on events(user_id, chat_id, created_at);
create index if not exists idx_events_type on events(event_type);

create table if not exists assistant_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  current_mode text not null default 'responding',
  ambiguity_tolerance numeric default 0.5,
  reflection_depth text default 'light',
  visible_epistemics text default 'minimal',
  rationale text,
  active_constraint_ids uuid[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_assistant_state_user_chat on assistant_state(user_id, chat_id, updated_at desc);

create table if not exists user_state (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  inferred_state text not null,
  confidence_score numeric,
  supporting_signals jsonb default '[]',
  epistemic_stance text default 'provisional',
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists signal_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  source_message_id uuid references conversation_history(id) on delete set null,
  explicit_instructions jsonb not null default '[]',
  explicit_constraints jsonb not null default '[]',
  stated_intent text,
  implicit_detected jsonb not null default '[]',
  implicit_actionable jsonb not null default '[]',
  implicit_ignored jsonb not null default '[]',
  operative_basis text not null,
  inference_operations_used integer default 0,
  response_effects jsonb not null default '[]',
  blocked_effects jsonb not null default '[]',
  persistence_allowed boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists idx_signal_events_user_chat on signal_events(user_id, chat_id, created_at desc);

create table if not exists inference_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  inference text not null,
  epistemic_stance text not null default 'provisional',
  confidence_score numeric,
  supporting_signals jsonb default '[]',
  contradictions jsonb default '[]',
  user_feedback_status text default 'unconfirmed',
  user_feedback text,
  source_message_ids uuid[] default '{}',
  acted_on boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_inference_logs_user_chat on inference_logs(user_id, chat_id, updated_at desc);

create table if not exists epistemic_checks (
  id uuid primary key default gen_random_uuid(),
  inference_id uuid references inference_logs(id) on delete cascade,
  signal_strength numeric,
  pattern_history_score numeric,
  contradiction_score numeric,
  confirmation_needed boolean default false,
  recommended_visible_language text,
  created_at timestamptz default now()
);

create table if not exists strategy_library (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  trigger_conditions jsonb default '[]',
  move_pattern text not null,
  risks jsonb default '[]',
  default_visibility text default 'normal',
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists strategy_uses (
  id uuid primary key default gen_random_uuid(),
  strategy_id uuid references strategy_library(id) on delete set null,
  user_id uuid not null,
  chat_id text,
  project text,
  reason_used text,
  outcome text,
  user_feedback text,
  effectiveness_score numeric,
  source_message_ids uuid[] default '{}',
  created_at timestamptz default now()
);
create index if not exists idx_strategy_uses_user_chat on strategy_uses(user_id, chat_id, created_at desc);

create table if not exists soft_constraints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  project text,
  name text not null,
  description text not null,
  strength numeric default 0.5,
  confidence numeric default 0.5,
  source_inference_ids uuid[] default '{}',
  source_strategy_use_ids uuid[] default '{}',
  evidence_count integer default 0,
  last_confirmed_at timestamptz,
  last_challenged_at timestamptz,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_soft_constraints_user_project on soft_constraints(user_id, project, status);

create table if not exists constraint_updates (
  id uuid primary key default gen_random_uuid(),
  constraint_id uuid references soft_constraints(id) on delete cascade,
  update_type text not null,
  amount numeric not null,
  reason text,
  source_type text,
  source_id uuid,
  created_at timestamptz default now(),
  constraint valid_constraint_update_amount check (amount <= 0.05 and amount >= -0.08)
);

create table if not exists assistant_reflections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  session_id text,
  project text,
  phase text,
  evaluation text not null,
  result text,
  adjustment text,
  confidence_level integer,
  alignment_score integer,
  related_inference_id uuid references inference_logs(id) on delete set null,
  related_strategy_use_id uuid references strategy_uses(id) on delete set null,
  related_constraint_id uuid references soft_constraints(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists batch_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  batch_type text not null,
  flush_trigger text not null,
  importance_score numeric default 0.5,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists approval_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  action_name text not null,
  action_payload jsonb not null default '{}',
  rationale text,
  risk_level text default 'low',
  status text not null default 'pending',
  approved_at timestamptz,
  denied_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists idx_approval_requests_user_chat on approval_requests(user_id, chat_id, created_at desc);

create table if not exists candidate_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  chat_id text,
  project text,
  candidate_type text not null,
  content text not null,
  source_signal_event_id uuid references signal_events(id) on delete set null,
  source_inference_ids uuid[] default '{}',
  source_message_ids uuid[] default '{}',
  supporting_signals jsonb default '[]',
  contradictions jsonb default '[]',
  confidence numeric default 0.5,
  epistemic_stance text default 'provisional',
  scope text default 'unknown',
  target_system text not null default 'none',
  target_entity text,
  status text default 'pending',
  promotion_reason text,
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_candidate_updates_user_chat on candidate_updates(user_id, chat_id, created_at desc);
create index if not exists idx_candidate_updates_status on candidate_updates(status);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_assistant_state_updated_at on assistant_state;
create trigger trg_assistant_state_updated_at before update on assistant_state for each row execute function set_updated_at();

drop trigger if exists trg_user_state_updated_at on user_state;
create trigger trg_user_state_updated_at before update on user_state for each row execute function set_updated_at();

drop trigger if exists trg_inference_logs_updated_at on inference_logs;
create trigger trg_inference_logs_updated_at before update on inference_logs for each row execute function set_updated_at();

drop trigger if exists trg_strategy_library_updated_at on strategy_library;
create trigger trg_strategy_library_updated_at before update on strategy_library for each row execute function set_updated_at();

drop trigger if exists trg_soft_constraints_updated_at on soft_constraints;
create trigger trg_soft_constraints_updated_at before update on soft_constraints for each row execute function set_updated_at();

drop trigger if exists trg_candidate_updates_updated_at on candidate_updates;
create trigger trg_candidate_updates_updated_at before update on candidate_updates for each row execute function set_updated_at();
