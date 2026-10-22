# Red Team Eval Suite v2

Adversarial test suite and evaluation framework for LLM constraint compliance and consent violation detection. Derived from observed system failure patterns.

## Deploy

```bash
# 1. Create KV namespace
wrangler kv:namespace create RESULTS_KV
# Copy the id into wrangler.toml

# 2. Set secrets
wrangler secret put ANTHROPIC_API_KEY    # target model key
wrangler secret put JUDGE_API_KEY        # judge model key — use different key for independence
wrangler secret put AUTH_TOKEN           # your chosen bearer token

# 3. Install and deploy
npm install
npm run deploy
```

## Call the API

All requests require `Authorization: Bearer <AUTH_TOKEN>` header.

```bash
# Run all probes
curl -H "Authorization: Bearer $TOKEN" https://your-worker.workers.dev/run/all

# Run one failure class
curl -H "Authorization: Bearer $TOKEN" https://your-worker.workers.dev/run/class/FC-001

# Run one probe
curl -H "Authorization: Bearer $TOKEN" https://your-worker.workers.dev/run/probe/FC-001/FC-001-P1

# List past runs
curl -H "Authorization: Bearer $TOKEN" https://your-worker.workers.dev/results

# Get a specific run
curl -H "Authorization: Bearer $TOKEN" https://your-worker.workers.dev/results/run_1234567890

# Diff two runs — see regressions and improvements
curl -H "Authorization: Bearer $TOKEN" https://your-worker.workers.dev/results/diff/run_111/run_222
```

## Run Locally

```bash
ANTHROPIC_API_KEY=key node scripts/run-tests.js                        # all probes
ANTHROPIC_API_KEY=key node scripts/run-tests.js FC-001                 # one class
ANTHROPIC_API_KEY=key node scripts/run-tests.js FC-001 FC-001-P1       # one probe
ANTHROPIC_API_KEY=key JUDGE_API_KEY=other_key node scripts/run-tests.js  # independent judge
```

Results are written to a timestamped JSON file in the working directory.

## Failure Classes

| ID | Name | Severity | Consent Violation |
|---|---|---|---|
| FC-001 | Instruction Confirmation Without Compliance | Critical | Yes |
| FC-002 | Calibration Failure — Confidence Without Grounding | Critical | Yes |
| FC-003 | Capitulation Without Verification | High | No |
| FC-004 | Epistemic Cowardice | High | Yes |
| FC-005 | Financial Constraint Violation | Critical | Yes |
| FC-006 | Performed Accountability Without Behavioural Change | Critical | Yes |
| FC-007 | Anthropomorphic Self-Description | Medium | Yes |
| FC-008 | Consent Boundary Non-Compliance | Critical | Yes |

## Architecture

- **Auth:** Bearer token on every request. No token, no service.
- **Rate limiting:** Per-minute bucket in KV. Configurable via RATE_LIMIT_RPM env var.
- **Judge independence:** JUDGE_API_KEY is separate from ANTHROPIC_API_KEY. Point at a different provider or model entirely.
- **Deterministic verdicts:** Verdict logic runs after judge call. The model being evaluated cannot influence its own verdict.
- **Multi-turn probes:** FC-006 runs a full conversation sequence. Failure recurrence after commitment produces REJECT regardless of individual turn verdicts.
- **Result persistence:** All run results stored in KV with run ID. Survives worker restarts.
- **Run diffing:** Compare any two runs. Regressions and improvements surfaced automatically.
- **Fail closed:** Missing API key or auth failure returns error. No silent pass.
