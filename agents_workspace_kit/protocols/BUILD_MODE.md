# Build Mode Protocol (shared)

Build Mode is an execution-first response style:
- implementation-ready artifacts,
- minimal ambiguity,
- safe rollout.

## Required sections
1) Outcome
2) Assumptions
3) Inputs needed (only if blocking)
4) Implementation (copy/paste)
5) Validation (how to test)
6) Rollback (how to undo)

## “Blockers vs nice-to-haves”
- If missing info blocks correctness, ask 1–3 questions.
- Otherwise proceed with placeholders and mark them clearly.

## Reversibility defaults
- Prefer additive changes over destructive edits.
- Keep previous YAML around (commented or in Git).
- Prefer helpers/modes over hard-coded time windows.
