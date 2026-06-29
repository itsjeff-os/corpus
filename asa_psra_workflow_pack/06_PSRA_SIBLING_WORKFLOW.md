# PSRA v1.1 — Passive Structural Runtime Audit

ASA sibling.

## Relationship to ASA

```text
ASA:
What exists right now across a system?

PSRA:
What does this specific artefact/codebase do as written?
```

Use ASA when the mess is broad.

Use PSRA when you have a specific artefact, repo, codebase, transcript, schema, config package, or zip to audit.

---

## Canonical call

```text
Run PSRA v1.1 on the attached artefact.

Mode: passive structural runtime audit.
Scope: all supplied files/snippets unless excluded below.
Focus: what exists, what each part appears to do, what happens as written, and where implementation materially diverges from apparent intent.

Do not fix, rewrite, improve, reconcile, or propose solutions.
Analyze components first. Contextualize the whole only after component analysis.
Surface runtime/import/operational consequences, missing expected pieces, material contradictions, and open uncertainties.
```

Short form:

```text
PSRA v1.1 this, component-first, as-written, no fixes.
```

---

## PSRA v1.1 optimized prompt

```text
# Passive Structural Runtime Audit v1.1

You are performing a Passive Structural Runtime Audit.

Purpose:
Analyze the supplied artefact as evidence. Describe what exists, what each part appears to do, what problem each part appears to solve, how it behaves when run/imported/used, and where it materially diverges from its own apparent intent.

This is not a redesign task.

## Non-negotiable controls

The following are controls, not content. Enforce them silently.

1. Do not rewrite, refactor, improve, rename, or generate code.
2. Do not propose fixes, best practices, recommendations, or next steps.
3. Do not reconcile contradictions.
4. Do not infer missing behaviour as definitely intended.
5. Do not treat docs, comments, names, or stated intent as proof of implementation.
6. Do not synthesize the whole before analyzing individual parts.
7. Do not treat terminology overlap as value.
8. Do not resolve uncertainty. Surface it.
9. Do not convert the audit into advice.
10. Do not use apology, validation, role-performance, or “I can help” framing.

Priority order:
runtime/import/operational behaviour
> implemented structure
> explicit artefact evidence
> apparent intent
> plausible inference
> uncertainty

When these conflict, prefer the higher-priority layer.

## Core distinction

Always distinguish:

- what is present
- what appears intended
- what is implemented
- what would happen at runtime/import/execution
- what is implied but missing
- what is uncertain

Use “appears to” for inferred purpose.
Use “as written” for runtime/import behaviour.
Use “not present in the supplied artefact” for missing expected pieces.

## Materiality rule

Surface contradictions only when they matter downstream.

Material contradictions include differences that affect:

- runtime behaviour
- import/build behaviour
- data shape
- persistence
- authority or permission
- external actions
- control flow
- validation
- task scope
- execution semantics
- downstream implementation

Do not nitpick harmless iterative naming drift unless the same name implies materially different behaviour.

## Audit workflow

Follow this exact order.

### 1. Scope and evidence boundary

State:
- artefact(s) analyzed
- artefact type
- what is in scope
- what is out of scope
- evidence limits

Do not summarize the whole system yet.

### 2. Inventory

List the concrete parts present.

### 3. Component-by-component analysis

Analyze each component separately:

Component: [name/path/section]

What is there:
- Concrete contents only.

What it appears to be trying to do:
- Apparent local purpose.

What problem it appears to solve:
- The local problem addressed.

How it behaves:
- For code: runtime/import/build/execution behaviour.
- For schemas: data model implications.
- For prompts/protocols: control or interaction behaviour.
- For docs: intended behaviour only, not proof of implementation.
- For diagrams: visible structure and implied relationships.

Dependencies and expectations:
- What this part relies on.
- What it appears to expect.

Material issues:
- Meaningful incompleteness, contradiction, ambiguity, or misalignment.
- State downstream effect where applicable.

Uncertainty:
- Give 1 to 2 plausible interpretations without choosing one.

Do not propose fixes.

### 4. Runtime / import / operational consequences

Describe what would happen when the artefact runs, imports, builds, deploys, or is used.

### 5. Whole-system contextualization

Only now describe how the parts appear to fit together.

### 6. Strengths

Identify what is strong, tied to evidence.

### 7. Incomplete, contradictory, or misaligned

Separate into:
A. Incomplete
B. Contradictory
C. Misaligned with wider intent
D. Runtime-significant ambiguity

For each item, describe the downstream effect.
Do not fix or reconcile it.

### 8. Obviously missing

List expected but absent pieces.
Phrase as:
“This code/schema/workflow/documentation appears to expect…”

### 9. Open questions / uncertainties

For each:
- state uncertainty
- give 1 to 2 plausible interpretations
- do not choose one
- do not propose a resolution

### 10. Clean synthesis

End with:
- what the artefact most strongly appears to be
- what it is strongest as
- what it is not yet, as written
- the main load-bearing divergence, if any
- the single most important distinction revealed by the audit

Use:
“Based only on what is present, this is strongest as…”
“As written, it is not yet…”
“The main divergence is…”
“The load-bearing distinction is…”

## Silent self-check before final answer

Reject any candidate answer that:
- proposes a fix
- rewrites code
- gives advice
- resolves uncertainty
- treats intent as implementation
- skips component analysis
- starts with whole-system synthesis
- uses generic praise
- uses apology/validation theatre
- substitutes meta-description for the actual audit
- treats wording as evidence of runtime behaviour
```

---

## PSRA variants

```text
PSRA v1.1 runtime-only:
Focus only on import/build/runtime/execution behaviour.

PSRA v1.1 missing-pieces pass:
List only what the artefact appears to expect but does not include.

PSRA v1.1 divergence pass:
Focus only on material divergence between apparent intent, docs/naming, and implemented behaviour.

PSRA v1.1 component map:
Inventory every part, what it appears to do, what it depends on, and how it fits after individual analysis.
```
