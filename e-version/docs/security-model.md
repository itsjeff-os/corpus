# Security Model

## Core Principles

1. **Credentials are never stored** — only references to secrets (vault paths, key names).
2. **Sensitive values are never in prompts** — redacted before LLM calls.
3. **Tenant isolation is enforced at every layer** — storage, retrieval, memory.
4. **Permissions flow from source to answer** — the assistant never retrieves content the active context is not permitted to see.
5. **Audit logs are immutable** — every significant action is recorded.
6. **Local-first deployment is supported** — for full data sovereignty.

---

## Credential Handling

### Never store
- Passwords, passphrases, or PINs
- API keys or tokens in raw form
- Private keys or certificates
- Database connection strings with embedded credentials

### Always store
- A **reference** to the secret (vault path, key name, environment variable name)
- Metadata about the secret (type, when rotated, who owns it)

### Detection
The `SensitivityPolicyEngine` scans ingested documents for accidental secrets using pattern matching. Matched documents are flagged for review. Flagged content is:
- Never indexed into the retrieval store
- Never surfaced in LLM prompts
- Flagged in the admin console for user review

---

## Authentication

- JWT-based authentication at the API Gateway
- Tokens signed with a secret stored in the secrets manager (never hard-coded)
- Tokens include `tenant_id`, `user_id`, and `roles`
- Token expiry: 1 hour (access), 30 days (refresh)
- All API requests require a valid JWT

---

## Tenant Isolation

- Every database record is scoped to `tenant_id` + `user_id`
- All queries include `WHERE tenant_id = $1 AND user_id = $2`
- Cross-tenant data access is a hard block at the service layer
- No shared state between tenants in Redis or object store

---

## Data Encryption

- **At rest:** Postgres data encrypted at the volume level (provider-managed or LUKS)
- **pgvector embeddings:** Stored in encrypted Postgres volumes
- **Object store:** MinIO with server-side encryption (SSE-S3 or SSE-KMS)
- **In transit:** TLS 1.3 required for all service-to-service and client-to-service communication

---

## Local-First Mode

For maximum privacy and data sovereignty:
- All services run locally via Docker Compose
- No data leaves the local machine unless you configure a cloud LLM
- Optional: use a local LLM (Ollama, LM Studio) for fully air-gapped operation
- Object store (MinIO) replaces cloud blob storage
- Meilisearch replaces cloud search

---

## Sensitive Data in Prompts

The Sensitivity Policy Engine enforces:
- Sensitive pattern detection before any content is included in a prompt
- Automatic redaction of matched values (replaced with `[REDACTED]`)
- CredentialReference entities are referenced by name only

Example safe prompt inclusion:
```
The router admin account is referenced as [router_admin_credentials].
Retrieve the actual value from your secrets manager before connecting.
```

---

## Audit Log

Every significant action is written to the `audit_events` table:

| Action | Resource Type | Logged |
|--------|--------------|--------|
| user.login | user | ✓ |
| user.logout | user | ✓ |
| session.create | session | ✓ |
| session.query | session | ✓ |
| memory.promote | memory | ✓ |
| memory.delete | memory | ✓ |
| source.ingest | source | ✓ |
| source.delete | source | ✓ |
| policy.create | policy | ✓ |
| policy.deny | resource | ✓ |
| sensitivity.flag | document | ✓ |

Audit logs are:
- Append-only (no updates or deletes)
- Indexed by tenant and timestamp
- Exportable by the user
- Retained for 90 days minimum

---

## Data Rights

Users may at any time:
- Export all their data (documents, chunks, facts, memories, sessions)
- Delete specific memories or all memories
- Delete their account and all associated data
- Inspect which sources are indexed and what facts were derived
- View the full retrieval trace for any past answer
