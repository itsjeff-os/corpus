# ASA / PSRA workflow pack — canonical source

Edit the numbered workflow documents in **`itsjeff-os/corpus/asa_psra_workflow_pack/`**. Start with [00_INDEX.md](00_INDEX.md).

This is the canonical GitHub editing location established by this consolidation. It does not promote every historical build variant into an accepted implementation decision.

## Source and interpretation

The [Notion ASA / PSRA Workflow Pack](https://app.notion.com/p/3c9457ee81e28028bb23d5694347a711), last edited 2026-09-26T23:43:04.777Z, contains the same 00–10 document map. It is the source reference; GitHub changes are maintained here.

Preserve the distinctions recorded in the [Drop Set A final index](../PSA:PRSA/psra_asa_drop_set_a_final_index.md):
- ASA is evidence-bound actual-state reporting; PSRA is component-first, as-written artefact analysis.
- The deployed-first ASA path is canonical. The local-first path is retained historical material.
- JeffeOS compatibility is required context; immediate runtime registration remains a variant requiring an explicit decision. See [05](05_ASA_JEFFEOS_RUNTIME_SUBSTRATE_COMPATIBILITY.md), including when reading the alternative packets in [08](08_CODEX_BUILD_PACKETS.md).
- These documents describe workflows and build plans, not proof of deployment.

## Location policy

| Location | Role |
| --- | --- |
| `corpus/asa_psra_workflow_pack/` | Canonical editing source; numbered documents 00–10 |
| `corpus/PSA:PRSA/asa_psra_workflow_pack/` | Retained snapshot within the historical drop bundle; do not edit independently |
| `curly-tribble/workers/PSA:PRSA/asa_psra_workflow_pack/` | Retained copy of that bundle in the Cloudflare monorepo; do not edit independently |
| `ALL_MATERIALS_COMBINED.md` and sibling combined/ZIP/dupe artefacts | Preserved source snapshots, not independent editing sources |

The root pack is selected because it already presents the standalone workflow set without placing general audit documentation inside a Worker package or the larger historical drop bundle. No existing reference found establishes a different editing authority; this is an explicit maintenance decision, not a claim about prior author intent.

The complete `corpus/PSA:PRSA/` and `curly-tribble/workers/PSA:PRSA/` trees match at baseline (`d6916c1a57206e5871f492651c662cfcccb364d9`). Their closed drop-set indexes distinguish canon, supporting material, and historical variants. Preserve that bundle context and existing direct file URLs. The available history records bulk imports, but does not establish an intentional automated vendoring contract or sync direction. Accordingly this change labels and retains the copies instead of deleting them or inventing a sync mechanism.

Future workflow edits belong here. Retained copies are frozen at the baseline below; refresh them only as an explicit, reviewed snapshot update with the new source commit recorded. The combined document is also a baseline snapshot: consult the numbered documents for current edits.

## Verified baseline inventory

Compared current `main` at:
- corpus: `abee4b50cc3d7aa274fdce26e687e778f25573ce`
- curly-tribble: `041e36ad61454c4e0b07d3c763b741551a791d5f`

All three pack directories contain exactly the same 12 files with tree SHA `573d1bb072cee1bcdb03ea237895e97cf4a3876f`. Every corresponding blob matches, including the previously checked 01 and 03.

| File | Git blob SHA (all three locations) |
| --- | --- |
| [00_INDEX.md](00_INDEX.md) | `c06d4d4e6254fdc45eed08e33c89fb9de5da7850` |
| [01_ASA_ACTUAL_STATE_AUDIT_WORKFLOW.md](01_ASA_ACTUAL_STATE_AUDIT_WORKFLOW.md) | `a81f7da6d52d3504feb3b914604af3b3f9557297` |
| [02_ASA_OUTPUT_TEMPLATES.md](02_ASA_OUTPUT_TEMPLATES.md) | `d0c33f96829a203bacbb368d750ec51d8ce01b57` |
| [03_ASA_IMPLEMENTATION_BUILD_PLAN.md](03_ASA_IMPLEMENTATION_BUILD_PLAN.md) | `8c7f7859e7ddeed33eb988c296fe7b59b3fe0821` |
| [04_ASA_DEPLOYED_FIRST_CLOUDFLARE_PLAN.md](04_ASA_DEPLOYED_FIRST_CLOUDFLARE_PLAN.md) | `c5a1ee6e412f94a6537afc5ad857c564edb5a290` |
| [05_ASA_JEFFEOS_RUNTIME_SUBSTRATE_COMPATIBILITY.md](05_ASA_JEFFEOS_RUNTIME_SUBSTRATE_COMPATIBILITY.md) | `1f231caa1f88e7cc64fb58a743440210a21c3077` |
| [06_PSRA_SIBLING_WORKFLOW.md](06_PSRA_SIBLING_WORKFLOW.md) | `4f3993ecee936a318b4c69e4b6eb920d695f39c9` |
| [07_PSRA_DYNAMIC_CLOUDFLARE_WORKFLOW.md](07_PSRA_DYNAMIC_CLOUDFLARE_WORKFLOW.md) | `49092079ec5f0459de90fb5e95d3ce5923d4af3b` |
| [08_CODEX_BUILD_PACKETS.md](08_CODEX_BUILD_PACKETS.md) | `6bd44c84e43713cb29bf88a691a9e41a6cc1423f` |
| [09_EXECUTION_BROKER_AND_MODE_HEADERS.md](09_EXECUTION_BROKER_AND_MODE_HEADERS.md) | `9ddba47ad990259a0d5f606c783692c74210cf4f` |
| [10_RELATIONSHIP_MAP.md](10_RELATIONSHIP_MAP.md) | `7434195fda757f2a95212bd8569c49a1ffb41613` |
| [ALL_MATERIALS_COMBINED.md](ALL_MATERIALS_COMBINED.md) | `29b9686b05a0d49afee83ba5700f42c3d992498c` |

Reference checks covered tracked corpus text and curly-tribble text at these commits, including package/workspace configuration. Pack-path and document-name references were confined to pack indexes and combined copies; no external code/config consumer of these paths was found. `workers/PSA:PRSA/` contains no package or Wrangler configuration, so its placement under `workers/` is not evidence of a deployable audit service. No automatic pack synchronization was identified. External bookmarks and consumers outside these repositories are not covered.

This consolidation changes navigation and maintenance guidance only. All 12 original files in every pack, the drop indexes, and surrounding archival artefacts remain byte-for-byte unchanged.
