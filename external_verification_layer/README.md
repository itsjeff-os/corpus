# External Verification Layer

This project implements a structured, upstream verification gate between an LLM and end users.

Architecture:

User → Orchestrator → LLM → Claim Extractor → Evidence Retriever → Verifier → Patch Engine → User

## Core Invariants

- No claim is allowed to pass without eligibility validation.
- Unsupported specificity is rewritten or blocked.
- Risk tier influences enforcement level.

### JUDGEMENT
Default posture: pragmatic enforcement (rewrite over block unless high-risk).
You may reverse this by modifying config/policy.json.

---

## Modules

- claim_extractor.py
- evidence_index.py
- verifier.py
- patch_engine.py
- orchestrator.py

---

## Running

This is framework-agnostic.
Wire orchestrator.verify_response() into your backend LLM pipeline.

---

## Reversible Decisions

Search for:
- ### JUDGEMENT ###
- ### REVERSIBLE ###

These mark opinionated defaults.
