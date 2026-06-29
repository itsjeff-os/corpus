"""
Chat Orchestrator — the main runtime loop of the Personal Context Engine.

Conversation flow:
  1. Receive user message
  2. Load session state
  3. Classify intent / generate retrieval plan
  4. Call Retrieval Engine
  5. Call Memory Engine
  6. Assemble model context
  7. Call LLM
  8. Validate output
  9. Write session updates
  10. Return answer + citations
"""

from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass, field
from typing import Any

from packages.schemas.sessions import Session, Turn, TurnRole, Citation, MemoryProposal
from packages.prompts.system import SYSTEM_PROMPT
from packages.prompts.answer_generation import build_answer_generation_prompt

from .retrieval_planner import RetrievalPlanner
from .context_builder import ContextBuilder
from .response_validator import ResponseValidator

logger = logging.getLogger(__name__)


@dataclass
class OrchestratorRequest:
    session_id: str
    user_id: str
    tenant_id: str
    message: str
    model_id: str = "gpt-4o"
    top_k: int = 20
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class OrchestratorResponse:
    turn_id: str
    session_id: str
    answer: str
    citations: list[dict[str, Any]] = field(default_factory=list)
    memory_proposals: list[dict[str, Any]] = field(default_factory=list)
    retrieval_plan: dict[str, Any] | None = None
    validation_issues: list[str] = field(default_factory=list)
    latency_ms: int | None = None


class ChatOrchestrator:
    """
    Orchestrates the full chat-time intelligence pipeline.

    In production, each step (retrieval, memory, LLM call) is a remote
    service call. Here we provide the interface with stub LLM integration.
    """

    def __init__(
        self,
        retrieval_engine=None,
        memory_engine=None,
        llm_client=None,
    ) -> None:
        self.retrieval_engine = retrieval_engine
        self.memory_engine = memory_engine
        self.llm_client = llm_client
        self._planner = RetrievalPlanner()
        self._builder = ContextBuilder()
        self._validator = ResponseValidator()

    def handle(self, request: OrchestratorRequest, session: Session) -> OrchestratorResponse:
        """Process a user message through the full intelligence pipeline."""
        import time

        start = time.time()
        turn_id = str(uuid.uuid4())

        # 1. Generate retrieval plan
        plan = self._planner.plan(
            session_id=request.session_id,
            turn_id=turn_id,
            user_message=request.message,
            known_entities=list(session.entity_ids),
        )
        logger.info("Retrieval plan: intent=%s, modes=%s", plan.intent, plan.retrieval_modes)

        # 2. Execute retrieval (stub — connect to Retrieval Engine service)
        retrieval_result = self._execute_retrieval(plan, request)

        # 3. Load memory context (stub — connect to Memory Engine service)
        memory_context = self._load_memory(request.session_id, request.user_id, request.tenant_id)

        # 4. Assemble context
        context = self._builder.build(
            user_message=request.message,
            intent=plan.intent,
            facts=retrieval_result.get("facts", []),
            chunks=retrieval_result.get("chunks", []),
            conflicts=retrieval_result.get("conflicts", []),
            session_memories=memory_context.get("session_memories", []),
            preferences=memory_context.get("preferences", []),
            stale_warnings=retrieval_result.get("stale_warnings", []),
        )
        trimmed = self._builder.estimate_token_budget(context)

        # 5. Build prompt and call LLM
        prompt = build_answer_generation_prompt(
            system_prompt=SYSTEM_PROMPT,
            user_message=request.message,
            intent=str(plan.intent),
            facts=trimmed.get("high_trust_facts", []),
            chunks=trimmed.get("supporting_chunks", []),
            conflicts=trimmed.get("conflicts", []),
            preferences=trimmed.get("preferences", []),
        )
        answer, citations = self._call_llm(prompt, request.model_id)

        # 6. Validate response
        validation = self._validator.validate(
            answer=answer,
            citations=citations,
            retrieved_chunk_ids=set(retrieval_result.get("chunk_ids", [])),
            selected_fact_ids=set(retrieval_result.get("fact_ids", [])),
            stale_fact_ids=set(retrieval_result.get("stale_fact_ids", [])),
            conflict_ids=set(retrieval_result.get("conflict_ids", [])),
            known_entities=set(session.entity_ids),
        )
        if not validation.is_valid:
            logger.warning("Validation issues: %s", validation.issues)

        latency_ms = int((time.time() - start) * 1000)

        return OrchestratorResponse(
            turn_id=turn_id,
            session_id=request.session_id,
            answer=answer,
            citations=citations,
            retrieval_plan=plan.dict() if hasattr(plan, "dict") else vars(plan),
            validation_issues=validation.issues,
            latency_ms=latency_ms,
        )

    def _execute_retrieval(self, plan: Any, request: OrchestratorRequest) -> dict[str, Any]:
        """Stub: call the Retrieval Engine service."""
        if self.retrieval_engine:
            return self.retrieval_engine.retrieve(plan, request.tenant_id, request.user_id)
        return {"facts": [], "chunks": [], "conflicts": [], "stale_warnings": [], "chunk_ids": [], "fact_ids": [], "stale_fact_ids": [], "conflict_ids": []}

    def _load_memory(self, session_id: str, user_id: str, tenant_id: str) -> dict[str, Any]:
        """Stub: call the Memory Engine service."""
        if self.memory_engine:
            return self.memory_engine.load(session_id=session_id, user_id=user_id, tenant_id=tenant_id)
        return {"session_memories": [], "preferences": []}

    def _call_llm(self, prompt: str, model_id: str) -> tuple[str, list[dict[str, Any]]]:
        """Stub: call the configured LLM client."""
        if self.llm_client:
            return self.llm_client.complete(prompt, model_id=model_id)
        return (
            "No LLM client configured. Connect an LLM provider to enable answer generation.",
            [],
        )
