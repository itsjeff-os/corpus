# GPT Assistant

Persistent assistant runtime backed by OpenAI Conversations, Responses, file
search, and Zep Cloud conversational memory/user graph context.

## Runtime Configuration

Required:

- `OPENAI_API_KEY`

Common OpenAI controls:

- `OPENAI_MODEL` defaults to `gpt-4o` for compatibility. Set this to a newer
  model, such as `gpt-5.5` or a smaller GPT-5.4 variant, when evaluating the
  current model family.
- `OPENAI_TIMEOUT_SECONDS` defaults to `60`.
- `OPENAI_MAX_RETRIES` defaults to `2`.
- `OPENAI_REASONING_EFFORT` supports `none`, `minimal`, `low`, `medium`,
  `high`, and `xhigh` for reasoning-capable models.
- `OPENAI_VERBOSITY` supports `low`, `medium`, and `high` for GPT-5 models.
- `OPENAI_MAX_OUTPUT_TOKENS` caps response length.
- `OPENAI_STORE` controls Responses API storage when set.
- `OPENAI_PROMPT_CACHE_KEY` and `OPENAI_PROMPT_CACHE_RETENTION` tune repeated
  prompt-cache behavior.
- `OPENAI_FILE_SEARCH_MAX_RESULTS` limits file-search result count.

Local runtime controls:

- `APP_AGENTS_USE_AGENTS_SDK` defaults to enabled. Set to `0` to use the direct
  Responses API fallback.
- `ASSISTANT_DB_PATH` defaults to `assistant.db`.
- `ZEP_MEMORY_LIMIT` defaults to `8`.
- `APP_AGENTS_MEMORY_PATH` defaults to `.app_agents_memory.jsonl` and is used
  only as a fallback when Zep is not configured or temporarily unavailable.

Zep controls:

- `ZEP_API_KEY` enables Zep Cloud memory.
- `ZEP_API_URL` defaults to `https://api.getzep.com`.
- `ZEP_USER_ID` defaults to `USER_ID`, then `default`.
- `ZEP_THREAD_ID` defaults to `THREAD_ID`, then `gpt-assistant-main`.
- `ZEP_ASSISTANT_NAME` defaults to `GPT Assistant`.
- `ZEP_FALLBACK_TO_LOCAL` defaults to enabled.

Memory flow:

1. The user message is added to the configured Zep thread with
   `return_context=true`.
2. The returned Zep user graph context is injected into the OpenAI prompt beside
   recent thread messages.
3. The assistant response is added to the same Zep thread.
4. OpenAI file/vector search remains the document corpus lane.

Zep helper script:

- `.create_thread.py` reads `ZEP_API_KEY`, `ZEP_USER_ID`, and optional
  `ZEP_THREAD_ID` from the environment or `.env`.

## Mini-PC Deployment Shape

This project is packaged as a mini-PC app slot:

- app path: `/srv/ai-stack/apps/gpt-assistant`
- container: `gpt-assistant`
- HTTP MCP port: `8765`
- persisted runtime data: Docker volume `gpt_assistant_data`

Copy `.env.example` to `.env` on the mini-PC and fill the real keys there. The
repo intentionally does not include `.env`.
