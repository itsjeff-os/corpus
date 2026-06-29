# ASA / PSRA Workflow Pack

This folder captures the artefacts and snippets created after the previous temp-chat salvage pack, focused on:

- **ASA — Actual State Audit / Objective System Snapshot**
- **PSRA — Passive Structural Runtime Audit**
- Deployed-first implementation planning
- Codex build packets
- Cloudflare workflow/control-plane positioning
- JeffeOS runtime substrate compatibility notes
- Execution Broker snippets relevant to building these safely

## File map

1. `01_ASA_ACTUAL_STATE_AUDIT_WORKFLOW.md`  
   The ASA workflow identity, call phrases, output structure, status labels, and reusable prompt.

2. `02_ASA_OUTPUT_TEMPLATES.md`  
   Snapshot card, component card, relationship graph, status labels, and clean report templates.

3. `03_ASA_IMPLEMENTATION_BUILD_PLAN.md`  
   Implementation ladder and Codex tickets for building ASA, including local-first alternative and deployed-first correction.

4. `04_ASA_DEPLOYED_FIRST_CLOUDFLARE_PLAN.md`  
   Deployed-first architecture for Cloudflare Worker, GitHub Action evidence collection, smoke tests, R2/Supabase storage, and report routes.

5. `05_ASA_JEFFEOS_RUNTIME_SUBSTRATE_COMPATIBILITY.md`  
   Notes on how ASA should respect the existing JeffeOS assistant runtime substrate without prematurely becoming a parallel control plane.

6. `06_PSRA_SIBLING_WORKFLOW.md`  
   PSRA v1.1 workflow prompt and the sibling relationship between PSRA and ASA.

7. `07_PSRA_DYNAMIC_CLOUDFLARE_WORKFLOW.md`  
   Dynamic workflow architecture, manifest structure, validators, API shape, and capability ladder.

8. `08_CODEX_BUILD_PACKETS.md`  
   Ready-to-use Codex execution packets for ASA/PSRA build slices.

9. `09_EXECUTION_BROKER_AND_MODE_HEADERS.md`  
   Execution Broker, Execution Mode Header, and decision-closure controls for safe Codex usage.

10. `10_RELATIONSHIP_MAP.md`  
    How ASA, PSRA, Capability Graph Notes, Execution Broker, Codex, Cloudflare, and JeffeOS fit together.

## Core distinction

```text
ASA:
What exists right now across a system?

PSRA:
What does this specific artefact/codebase do as written?

Capability Graph Note:
How should a discovered component be represented as graph-addressable capability state?

Execution Broker:
How do we convert a decision into a Codex-safe implementation ticket?
```

## Master line

```text
Before fixing the system, produce an artefact the system can be held to.
```
