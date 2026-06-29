# Ingestion

Turns raw source material into usable knowledge chunks, embeddings, facts, source refs, and provenance.

Home Assistant YAML support is scaffolded as a domain chunker, not a generic line splitter.

## Home Automation Ingestion

The home ingestion path uses typed Chroma collections:

- `home_ha_automations`
- `home_ha_reference`
- `home_system_docs`
- `home_patterns_rituals`

Run a dry-run manifest before writing anything:

```bash
python3 -m packages.ingestion.cli dry-run sources/home_assistant/raw/examples
```

Validate chunk metadata and redaction:

```bash
python3 -m packages.ingestion.cli validate sources/home_assistant/raw/examples
```

Upsert to Chroma after configuring `CHROMA_URL`, `CHROMA_API_KEY`,
`CHROMA_TENANT`, and `CHROMA_DATABASE` as needed:

```bash
python3 -m packages.ingestion.cli upsert sources/home_assistant/raw/examples --embedding-mode none
```

Use `--embedding-mode none` when Chroma has an embedding function configured.
Use `--embedding-mode hash` only for offline smoke tests; it is deterministic
but not semantic.
