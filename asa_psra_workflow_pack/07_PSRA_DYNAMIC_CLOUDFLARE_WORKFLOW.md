# PSRA Dynamic Cloudflare Workflow

## Core idea

PSRA should be a dynamic workflow definition, not a static mega-prompt.

Good dynamic:

```text
manifest-driven
stateful
versioned
validated
traceable
```

Risky dynamic:

```text
model invents workflow and runs arbitrary process at runtime
```

---

## Architecture

```text
Client / ChatGPT / Claude / Codex / n8n
        |
        v
Cloudflare Worker API
        |
        v
Workflow Registry
        |
        v
Cloudflare Workflow run
        |
        |-- Step 1: bind scope
        |-- Step 2: inventory artefact
        |-- Step 3: analyze components
        |-- Step 4: runtime/import consequences
        |-- Step 5: whole-system contextualization
        |-- Step 6: validator pass
        |-- Step 7: persist audit result
        |
        v
Audit result + trace
```

---

## State split

```text
R2:
- raw artefacts
- extracted file snapshots
- audit result exports

Supabase / D1:
- workflow definitions
- workflow runs
- audit findings
- component records
- material divergences
- open questions
- missing expected pieces

Durable Object:
- live run state
- constraint ledger
- phase cursor
- rejected-frame register
- per-run locks

Cloudflare Workflow:
- durable phase execution
- retries
- wait/resume
- step results
```

---

## Minimal manifest shape

```json
{
  "workflow_id": "PSRA",
  "version": "1.1",
  "name": "Passive Structural Runtime Audit",
  "invariant": "Describe what exists and what happens as written. Do not fix.",
  "phase_order": [
    "scope_and_evidence_boundary",
    "inventory",
    "component_analysis",
    "runtime_import_operational_consequences",
    "whole_system_contextualization",
    "strengths",
    "incomplete_contradictory_misaligned",
    "obviously_missing",
    "open_questions_uncertainties",
    "clean_synthesis"
  ],
  "hard_exclusions": [
    "fixes",
    "refactors",
    "recommendations",
    "new_code",
    "reconciliation",
    "resolved_uncertainty"
  ],
  "priority_order": [
    "runtime_import_operational_behaviour",
    "implemented_structure",
    "explicit_artifact_evidence",
    "apparent_intent",
    "plausible_inference",
    "uncertainty"
  ],
  "validators": [
    "component_first_gate",
    "no_fix_gate",
    "no_recommendation_gate",
    "no_reconciliation_gate",
    "implementation_vs_intent_gate",
    "runtime_priority_gate",
    "uncertainty_preservation_gate",
    "evidence_reference_gate",
    "materiality_gate",
    "semantic_overlap_zero_credit_gate"
  ]
}
```

---

## API call shape

```text
POST /workflows/run
```

Payload:

```json
{
  "workflow_id": "PSRA",
  "version": "1.1",
  "mode": "standard",
  "artifact_ref": "r2://artefacts/acs_full_loop.zip",
  "caller": "chatgpt",
  "output": {
    "format": "markdown",
    "include_trace": true
  }
}
```

Response:

```json
{
  "run_id": "psra_run_2026_06_08_001",
  "status": "queued",
  "workflow_id": "PSRA",
  "version": "1.1"
}
```

Status:

```text
GET /workflows/runs/{run_id}
```

Result:

```json
{
  "run_id": "psra_run_2026_06_08_001",
  "status": "completed",
  "result_ref": "r2://audit-results/psra_run_2026_06_08_001.md",
  "trace": {
    "phases_completed": 10,
    "validators_triggered": ["component_first_gate", "no_advice_gate"]
  }
}
```

---

## Validator examples

```text
Does it propose fixes?
Reject.

Does it synthesize the whole before component analysis?
Reject.

Does it treat docs as implementation?
Reject.

Does it resolve ambiguity instead of preserving it?
Reject.

Does it mention a missing piece as “you should add”?
Reject.

Does it describe runtime consequence?
Accept only if tied to artefact evidence.
```

---

## Capability upgrade ladder

```text
Level 1: Static prompt
Repeatable wording, weak enforcement.

Level 2: Manifest workflow
Versioned phases, profiles, exclusions.

Level 3: Structured outputs
Component/finding/runtime/missing/uncertainty objects.

Level 4: Validators
Reject invalid audit outputs before final report.

Level 5: Evidence graph
Every material claim linked to artefact evidence.

Level 6: Stateful runs
Constraint ledger, phase cursor, blocked modes, retry history.

Level 7: Regression memory
Every failure becomes a test.

Level 8: Model routing
Use different models only where they reduce supervision burden.

Level 9: Promotion boundary
Audit can hand off to redesign/fix workflows only after explicit user action.
```

---

## Load-bearing design rule

Every added capability must improve one of:

```text
evidence capture
component understanding
runtime consequence mapping
materiality judgment
uncertainty preservation
validator enforcement
traceability
```

If it adds:

```text
advice
fixes
authority
redesign pressure
```

it belongs in a different workflow.
