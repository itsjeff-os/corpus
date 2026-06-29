"""Answer generation prompt — assembles full model context and instructs the LLM."""

from __future__ import annotations


ANSWER_GENERATION_TEMPLATE = """\
{system_prompt}

---

## Task / User Intent
{user_intent}

## Current Goal
{current_goal}

## High-Trust Structured Facts
{facts_section}

## Relevant Document Excerpts
{chunks_section}

## Conflicts and Stale Warnings
{conflicts_section}

## Session State
{session_state}

## User Preferences
{preferences_section}

---

User question: {user_message}

Answer:
"""


def build_answer_generation_prompt(
    system_prompt: str,
    user_message: str,
    user_intent: str = "",
    current_goal: str = "",
    facts: list[dict] | None = None,
    chunks: list[dict] | None = None,
    conflicts: list[dict] | None = None,
    session_state: str = "",
    preferences: list[dict] | None = None,
) -> str:
    """Assemble the full answer generation prompt from layered context."""
    facts_section = _format_facts(facts or [])
    chunks_section = _format_chunks(chunks or [])
    conflicts_section = _format_conflicts(conflicts or [])
    preferences_section = _format_preferences(preferences or [])

    return ANSWER_GENERATION_TEMPLATE.format(
        system_prompt=system_prompt,
        user_message=user_message,
        user_intent=user_intent or "Not specified.",
        current_goal=current_goal or "Not specified.",
        facts_section=facts_section or "No high-trust facts available.",
        chunks_section=chunks_section or "No document excerpts available.",
        conflicts_section=conflicts_section or "No conflicts detected.",
        session_state=session_state or "No active session state.",
        preferences_section=preferences_section or "No preferences loaded.",
    )


def _format_facts(facts: list[dict]) -> str:
    if not facts:
        return ""
    lines = []
    for f in facts:
        subject = f.get("subject", "?")
        predicate = f.get("predicate", "is")
        value = f.get("value", "?")
        source = f.get("source", "unknown")
        trust = f.get("trust_level", "")
        line = f"- {subject} {predicate} {value}. Source: {source}"
        if trust:
            line += f" [{trust}]"
        lines.append(line)
    return "\n".join(lines)


def _format_chunks(chunks: list[dict]) -> str:
    if not chunks:
        return ""
    lines = []
    for c in chunks:
        source = c.get("source", "unknown")
        content = c.get("content", "")
        section = c.get("section", "")
        header = f"[{source}" + (f" > {section}" if section else "") + "]"
        lines.append(f"{header}\n{content}\n")
    return "\n".join(lines)


def _format_conflicts(conflicts: list[dict]) -> str:
    if not conflicts:
        return ""
    lines = []
    for conf in conflicts:
        entity = conf.get("entity", "?")
        field = conf.get("field", "?")
        claims = conf.get("claims", [])
        resolution = conf.get("resolution", "unresolved")
        lines.append(f"⚠ Conflict on {entity}.{field}:")
        for claim in claims:
            lines.append(f"  - {claim.get('value')} (source: {claim.get('source')}, trust: {claim.get('trust')})")
        lines.append(f"  Resolution: {resolution}")
    return "\n".join(lines)


def _format_preferences(preferences: list[dict]) -> str:
    if not preferences:
        return ""
    lines = []
    for p in preferences:
        lines.append(f"- {p.get('subject', '?')}: {p.get('summary', '')}")
    return "\n".join(lines)
