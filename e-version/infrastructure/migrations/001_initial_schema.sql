-- Personal Context Engine — Initial Database Migration
-- Run automatically by Docker when initializing the Postgres container.
-- All tables use UUIDs as primary keys and include tenant isolation.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ─── Users & Tenants ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS tenants (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email       TEXT NOT NULL,
    roles       TEXT[] NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, email)
);

-- ─── Sources & Documents ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sources (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_type     TEXT NOT NULL,
    source_uri      TEXT NOT NULL,
    permissions     TEXT[] NOT NULL DEFAULT '{}',
    last_synced_at  TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_id       UUID REFERENCES sources(id) ON DELETE SET NULL,
    title           TEXT NOT NULL,
    source_uri      TEXT NOT NULL,
    source_type     TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'pending',
    content_hash    TEXT,
    chunk_count     INT NOT NULL DEFAULT 0,
    permissions     TEXT[] NOT NULL DEFAULT '{}',
    tags            TEXT[] NOT NULL DEFAULT '{}',
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    indexed_at      TIMESTAMPTZ,
    last_synced_at  TIMESTAMPTZ
);

-- ─── Chunks ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS chunks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chunk_type      TEXT NOT NULL DEFAULT 'text',
    content         TEXT NOT NULL,
    content_hash    TEXT,
    chunk_index     INT NOT NULL DEFAULT 0,
    start_char      INT,
    end_char        INT,
    token_count     INT,
    section         TEXT,
    heading_path    TEXT[] NOT NULL DEFAULT '{}',
    embedding       vector(1536),
    embedding_model TEXT,
    entity_ids      UUID[] NOT NULL DEFAULT '{}',
    fact_ids        UUID[] NOT NULL DEFAULT '{}',
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chunks_document_id ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_chunks_tenant_user ON chunks(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_chunks_embedding ON chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ─── Facts ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS facts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject         TEXT NOT NULL,
    predicate       TEXT NOT NULL,
    value           JSONB,
    source          TEXT NOT NULL,
    source_type     TEXT NOT NULL,
    trust_level     TEXT NOT NULL DEFAULT 'source_backed',
    confidence      FLOAT NOT NULL DEFAULT 0.8 CHECK (confidence >= 0.0 AND confidence <= 1.0),
    freshness       TEXT NOT NULL DEFAULT 'current',
    embedding       vector(1536),
    embedding_model TEXT,
    last_verified_at TIMESTAMPTZ,
    derived_by      TEXT,
    user_confirmed  BOOLEAN NOT NULL DEFAULT FALSE,
    entity_ids      UUID[] NOT NULL DEFAULT '{}',
    chunk_ids       UUID[] NOT NULL DEFAULT '{}',
    document_ids    UUID[] NOT NULL DEFAULT '{}',
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facts_tenant_user ON facts(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_facts_subject ON facts(subject);
CREATE INDEX IF NOT EXISTS idx_facts_trust ON facts(trust_level);

-- ─── Entities & Relations ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS entities (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id               UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type             TEXT NOT NULL,
    name                    TEXT NOT NULL,
    canonical_name          TEXT,
    aliases                 TEXT[] NOT NULL DEFAULT '{}',
    description             TEXT,
    description_embedding   vector(1536),
    embedding_model         TEXT,
    attributes              JSONB NOT NULL DEFAULT '{}',
    source_ids              UUID[] NOT NULL DEFAULT '{}',
    document_ids            UUID[] NOT NULL DEFAULT '{}',
    fact_ids                UUID[] NOT NULL DEFAULT '{}',
    metadata                JSONB NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_entities_name_type_tenant ON entities(tenant_id, user_id, entity_type, lower(name));

CREATE TABLE IF NOT EXISTS relations (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    relation_type       TEXT NOT NULL,
    source_entity_id    UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    target_entity_id    UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    confidence          FLOAT NOT NULL DEFAULT 0.8,
    provenance          TEXT[] NOT NULL DEFAULT '{}',
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_relations_source ON relations(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_relations_target ON relations(target_entity_id);

-- ─── Memories ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS memories (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    memory_type         TEXT NOT NULL,
    subject             TEXT NOT NULL,
    summary             TEXT NOT NULL,
    value               JSONB,
    precision           TEXT NOT NULL DEFAULT 'summary',
    grounding_sources   TEXT[] NOT NULL DEFAULT '{}',
    grounding_fact_ids  UUID[] NOT NULL DEFAULT '{}',
    allowed_use         TEXT[] NOT NULL DEFAULT '{}',
    disallowed_use      TEXT[] NOT NULL DEFAULT '{}',
    confidence          FLOAT NOT NULL DEFAULT 0.8,
    user_confirmed      BOOLEAN NOT NULL DEFAULT FALSE,
    embedding           vector(1536),
    embedding_model     TEXT,
    expires_at          TIMESTAMPTZ,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_memories_tenant_user ON memories(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(memory_type);

-- ─── Sessions & Turns ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS sessions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id           UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status              TEXT NOT NULL DEFAULT 'active',
    title               TEXT,
    intent              TEXT,
    entity_ids          UUID[] NOT NULL DEFAULT '{}',
    active_memory_ids   UUID[] NOT NULL DEFAULT '{}',
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_turn_at        TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS turns (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id          UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role                TEXT NOT NULL,
    content             TEXT NOT NULL,
    citations           JSONB NOT NULL DEFAULT '[]',
    retrieval_plan      JSONB,
    retrieved_chunk_ids UUID[] NOT NULL DEFAULT '{}',
    selected_fact_ids   UUID[] NOT NULL DEFAULT '{}',
    discarded_fact_ids  UUID[] NOT NULL DEFAULT '{}',
    model_context       JSONB,
    memory_proposals    JSONB NOT NULL DEFAULT '[]',
    latency_ms          INT,
    token_count         INT,
    model_id            TEXT,
    metadata            JSONB NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_turns_session_id ON turns(session_id);

-- ─── Permissions & Policies ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS policies (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    policy_type TEXT NOT NULL,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    conditions  JSONB NOT NULL DEFAULT '{}',
    decision    TEXT NOT NULL,
    priority    INT NOT NULL DEFAULT 0,
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Audit Log ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS audit_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          TEXT NOT NULL,
    resource_type   TEXT NOT NULL DEFAULT '',
    resource_id     UUID,
    outcome         TEXT NOT NULL DEFAULT 'success',
    attributes      JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_tenant ON audit_events(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_events(user_id, created_at DESC);
