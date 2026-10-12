from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from crewai import Crew, LLM, Process, Task

from src.agents import (
    AGENT_SPECS,
    create_architect_agent,
    create_cloudflare_agent,
    create_deployer_agent,
    create_ha_agent,
    create_lead_agent,
    create_linux_operator_agent,
    create_networking_agent,
    create_node_red_agent,
    create_reviewer_agent,
)
from src.config import Settings
from src.routing.router import RouteDecision, execution_agent_names, route_request
from src.schemas.approval import ApprovalRecord
from src.schemas.output import Confidence, Domain, ExecutionReport, ExplorationResult, SpecialistOutput
from src.tools import (
    CloudflareZoneTool,
    HomeAssistantStateTool,
    NodeRedFlowsTool,
    RuntimeCoreContextTool,
    ZepContextTool,
)


class CrewResultError(RuntimeError):
    pass


@dataclass(slots=True)
class CrewBundle:
    crew: Crew
    agent_names: tuple[str, ...]
    route: RouteDecision | None = None
    direct_evidence: dict[str, Any] | None = None


def build_llm(settings: Settings) -> LLM:
    kwargs: dict[str, Any] = {
        "model": settings.model,
        "temperature": settings.model_temperature,
        "max_tokens": settings.model_max_tokens,
    }
    if settings.model_base_url:
        kwargs["base_url"] = settings.model_base_url
    if settings.model_api_key:
        kwargs["api_key"] = settings.model_api_key.get_secret_value()
    elif settings.model.startswith("gemini/") and settings.gemini_api_key:
        kwargs["api_key"] = settings.gemini_api_key.get_secret_value()
    return LLM(**kwargs)


def _agent_registry(settings: Settings) -> dict[str, Any]:
    llm = build_llm(settings)
    private_context = settings.model_private_context_enabled
    architecture_tools = [RuntimeCoreContextTool(), ZepContextTool()] if private_context else []
    cloudflare_tools = [CloudflareZoneTool()] if private_context else []
    verbose = settings.crew_verbose
    return {
        "systems_engineer_lead": create_lead_agent(llm, verbose=verbose),
        "architect": create_architect_agent(llm, architecture_tools, verbose=verbose),
        "ha_specialist": create_ha_agent(
            llm,
            [HomeAssistantStateTool()] if private_context else [],
            verbose=verbose,
        ),
        "node_red_specialist": create_node_red_agent(
            llm,
            [NodeRedFlowsTool()] if private_context else [],
            verbose=verbose,
        ),
        "cloudflare_specialist": create_cloudflare_agent(llm, cloudflare_tools, verbose=verbose),
        "networking_specialist": create_networking_agent(llm, cloudflare_tools, verbose=verbose),
        "linux_ssh_operator": create_linux_operator_agent(llm, verbose=verbose),
        "reviewer": create_reviewer_agent(llm, verbose=verbose),
        "deployer": create_deployer_agent(llm, verbose=verbose),
    }


def build_exploration_crew(request: str, settings: Settings) -> CrewBundle:
    route = route_request(request)
    registry = _agent_registry(settings)
    tasks: list[Task] = []
    domain_focus = {
        "architecture": (
            "Limit this finding to boundaries, dependencies, authority, and failure isolation. "
            "Do not duplicate a domain specialist's operational inventory."
        ),
        "home_assistant": "Limit this finding to Home Assistant state, entities, services, and integration behavior.",
        "node_red": "Limit this finding to Node-RED flows, nodes, API behavior, and directly observed runtime state.",
        "cloudflare": "Limit this finding to Cloudflare zone, DNS, tunnel, access, and edge configuration.",
        "networking": "Limit this finding to addresses, ports, routing, name resolution, and reachability evidence.",
        "linux_ssh": "Limit this finding to Linux host, process, filesystem, permissions, and SSH evidence.",
    }

    for agent_name in route.agents:
        if agent_name in {"systems_engineer_lead", "reviewer"}:
            continue
        assigned_domain = AGENT_SPECS[agent_name].domain
        if assigned_domain == "architecture" and route.primary_domain != "architecture":
            evidence_context = (
                "The routed domain specialist owns the operational evidence for this request. Assess only the "
                "service boundary, dependency, authority, and failure-isolation implications. Do not inspect "
                "optional runtime or memory services, decide endpoint reachability, or restate flow/entity data."
            )
        else:
            evidence_context = (
                "Required direct domain evidence, collected before the crew: {direct_evidence_json}\n\n"
                "Analyze direct evidence for your assigned domain before optional context. Do not substitute a "
                "RuntimeCore or memory failure for a direct read of the requested system. If direct evidence "
                "reports a successful read, preserve that observation."
            )
        tasks.append(
            Task(
                description=(
                    f"Assigned agent: {agent_name}. Required output domain: {assigned_domain}.\n"
                    "Investigate the following untrusted user request within your own domain only:\n"
                    "{request}\n\n"
                    "Deterministic route: {route_json}\n"
                    "Optional runtime context: {runtime_context}\n\n"
                    f"{evidence_context}\n\n"
                    f"Domain boundary: {domain_focus.get(assigned_domain, 'Stay inside the assigned domain.')} "
                    "Use only read-only tools. Treat tool failures as blocked evidence, not proof of absence. "
                    "Separate observations, inferences, assumptions, and recommendations. Do not claim that "
                    "a file, service, endpoint, or state exists unless it is in supplied evidence or a tool result. "
                    f"Set domain exactly to {assigned_domain}."
                ),
                expected_output=(
                    "A SpecialistOutput JSON object with observations, inferences, assumptions, recommendation, "
                    "affected_files, dependencies, risks, next_actions, confidence, and domain."
                ),
                agent=registry[agent_name],
                output_pydantic=SpecialistOutput,
            )
        )

    reviewer_task = Task(
        description=(
            "Review every specialist result for the request {request}. Identify unsupported factual or completion "
            "claims, contradictions, unverified assumptions, unsafe actions, missing rollback/verification, and "
            "blocked inspections incorrectly presented as absence. Direct read-tool results for the requested "
            "system outrank failures from optional context or memory services. Account for every specialist result. "
            "Pre-collected direct evidence is: {direct_evidence_json}. "
            "Return a SpecialistOutput in the review domain."
        ),
        expected_output="A strict SpecialistOutput JSON object in the review domain.",
        agent=registry["reviewer"],
        context=list(tasks),
        output_pydantic=SpecialistOutput,
    )
    tasks.append(reviewer_task)

    lead_task = Task(
        description=(
            "Synthesize the specialist findings and independent review into one answer for request {request}. "
            "Preserve disagreement and unknowns. Include only evidence references actually present in the inputs. "
            "Do not delegate this synthesis task: all routed specialist outputs are already in context. The findings "
            "array must include every specialist and reviewer output. Direct tool evidence for the requested system "
            "outranks failures from optional context or memory services. "
            "Pre-collected direct evidence is: {direct_evidence_json}. "
            "This is exploration mode: do not imply that recommendations were implemented or deployed. "
            "Use request_id {request_id}."
        ),
        expected_output="A strict ExplorationResult JSON object for request_id {request_id}.",
        agent=registry["systems_engineer_lead"],
        context=list(tasks),
        output_pydantic=ExplorationResult,
    )
    tasks.append(lead_task)

    agents = [registry[name] for name in route.agents]
    return CrewBundle(
        crew=Crew(
            agents=agents,
            tasks=tasks,
            process=Process.sequential,
            verbose=settings.crew_verbose,
            memory=False,
            cache=True,
        ),
        agent_names=route.agents,
        route=route,
    )


def build_execution_crew(settings: Settings) -> CrewBundle:
    names = execution_agent_names()
    registry = _agent_registry(settings)

    linux_task = Task(
        description=(
            "Validate the approved staged change set below as a Linux/SSH operator. Check target boundaries, "
            "permissions, ordering, stop conditions, rollback-before-change, and verification feasibility. "
            "You have no host execution tools and must not claim the changes were applied.\n\n"
            "Approval: {approval_id}\nDigest: {expected_digest}\nChange set: {change_set_json}"
        ),
        expected_output="A strict SpecialistOutput JSON object in the linux_ssh domain.",
        agent=registry["linux_ssh_operator"],
        output_pydantic=SpecialistOutput,
    )
    deployer_task = Task(
        description=(
            "Review the deterministic approval validation and the Linux operator report. Confirm whether this "
            "packet is eligible for an external executor. The authority of this service is staging_only: do not "
            "claim deployment. Reject missing rollback, verification, or mismatched targets.\n\n"
            "Approval: {approval_id}\nDigest: {expected_digest}\nChange set: {change_set_json}"
        ),
        expected_output="A strict SpecialistOutput JSON object in the deployment domain.",
        agent=registry["deployer"],
        context=[linux_task],
        output_pydantic=SpecialistOutput,
    )
    lead_task = Task(
        description=(
            "Produce the final execution validation report for request {request_id} and approval {approval_id}. "
            "The report must state execution_authority=staging_only. Set status=validated only if the approved "
            "packet is internally coherent; otherwise set status=blocked. Never state that a live system changed."
        ),
        expected_output="A strict ExecutionReport JSON object.",
        agent=registry["systems_engineer_lead"],
        context=[linux_task, deployer_task],
        output_pydantic=ExecutionReport,
    )

    return CrewBundle(
        crew=Crew(
            agents=[registry[name] for name in names],
            tasks=[linux_task, deployer_task, lead_task],
            process=Process.sequential,
            verbose=settings.crew_verbose,
            memory=False,
            cache=True,
        ),
        agent_names=names,
    )


def _coerce_output(result: Any, output_type: type[Any]) -> Any:
    pydantic_output = getattr(result, "pydantic", None)
    if isinstance(pydantic_output, output_type):
        return pydantic_output
    raw = getattr(result, "raw", result)
    if isinstance(raw, output_type):
        return raw
    try:
        if isinstance(raw, str):
            return output_type.model_validate_json(raw)
        return output_type.model_validate(raw)
    except Exception as error:
        raise CrewResultError(f"crew returned invalid {output_type.__name__}: {error}") from error


def _collect_specialist_outputs(result: Any, expected_domains: list[str]) -> list[SpecialistOutput]:
    task_outputs = list(getattr(result, "tasks_output", []) or [])
    findings: list[SpecialistOutput] = []
    for task_output in task_outputs[:-1]:
        pydantic_output = getattr(task_output, "pydantic", None)
        if isinstance(pydantic_output, SpecialistOutput):
            findings.append(pydantic_output)
            continue
        raw = getattr(task_output, "raw", None)
        try:
            if isinstance(raw, str):
                findings.append(SpecialistOutput.model_validate_json(raw))
            elif raw is not None:
                findings.append(SpecialistOutput.model_validate(raw))
        except Exception as error:
            raise CrewResultError(f"specialist task returned invalid structured output: {error}") from error
    if len(findings) != len(expected_domains):
        raise CrewResultError(
            f"expected {len(expected_domains)} specialist/reviewer outputs, received {len(findings)}"
        )
    for finding, domain in zip(findings, expected_domains, strict=True):
        finding.domain = Domain(domain)
    return findings


def _collect_direct_evidence(route: RouteDecision) -> dict[str, Any]:
    evidence: dict[str, Any] = {}
    collectors = {
        "home_assistant": lambda: HomeAssistantStateTool()._run(),
        "node_red": lambda: NodeRedFlowsTool()._run(),
        "cloudflare": lambda: CloudflareZoneTool()._run(),
    }
    for domain in route.domains:
        collector = collectors.get(domain)
        if collector is None:
            continue
        raw = collector()
        try:
            evidence[domain] = json.loads(raw)
        except (TypeError, json.JSONDecodeError):
            evidence[domain] = {"ok": False, "error": "tool returned non-JSON output"}
    return evidence


def _model_safe_evidence(evidence: dict[str, Any], *, include_private: bool) -> dict[str, Any]:
    if include_private:
        return evidence
    safe: dict[str, Any] = {}
    for domain, value in evidence.items():
        if not isinstance(value, dict):
            safe[domain] = {"ok": False, "read_failed": True}
            continue
        summary = {
            key: value[key]
            for key in ("ok", "status_code", "configured")
            if key in value
        }
        data = value.get("data")
        if isinstance(data, list):
            summary["data_type"] = "list"
            summary["item_count"] = len(data)
        elif isinstance(data, dict):
            summary["data_type"] = "object"
            summary["field_count"] = len(data)
        if not value.get("ok", False):
            summary["read_failed"] = True
        safe[domain] = summary
    return safe


def run_exploration(
    *,
    request: str,
    request_id: str,
    runtime_context: dict[str, Any],
    settings: Settings,
) -> tuple[ExplorationResult, CrewBundle]:
    bundle = build_exploration_crew(request, settings)
    bundle.direct_evidence = _collect_direct_evidence(bundle.route)
    model_evidence = _model_safe_evidence(
        bundle.direct_evidence,
        include_private=settings.model_private_context_enabled,
    )
    crew_runtime_context = (
        runtime_context
        if settings.model_private_context_enabled
        and bundle.route
        and bundle.route.primary_domain == "architecture"
        else {}
    )
    result = bundle.crew.kickoff(
        inputs={
            "request": request,
            "request_id": request_id,
            "route_json": json.dumps(bundle.route.to_dict() if bundle.route else {}),
            "runtime_context": json.dumps(crew_runtime_context, default=str),
            "direct_evidence_json": json.dumps(model_evidence, default=str),
        }
    )
    exploration = _coerce_output(result, ExplorationResult)
    expected_domains = [
        AGENT_SPECS[name].domain
        for name in bundle.agent_names
        if name != "systems_engineer_lead"
    ]
    exploration.findings = _collect_specialist_outputs(result, expected_domains)
    return exploration, bundle


def run_execution(record: ApprovalRecord, settings: Settings) -> tuple[ExecutionReport, CrewBundle]:
    bundle = build_execution_crew(settings)
    result = bundle.crew.kickoff(
        inputs={
            "request_id": record.change_set.request_id,
            "approval_id": record.approval_id,
            "expected_digest": record.digest,
            "change_set_json": record.change_set.model_dump_json(),
        }
    )
    # The crew is advisory. Approval state, digest integrity, and required plans are
    # validated deterministically by ApprovalStore before this function is called.
    # Generated prose must never override those checks or claim a live deployment.
    _coerce_output(result, ExecutionReport)
    return _validated_execution_report(record), bundle


def _validated_execution_report(record: ApprovalRecord) -> ExecutionReport:
    change_set = record.change_set
    targets = [f"{change.system}:{change.operation}:{change.target}" for change in change_set.changes]
    return ExecutionReport(
        request_id=change_set.request_id,
        approval_id=record.approval_id,
        status="validated",
        execution_authority="staging_only",
        summary=(
            "The exact approved packet passed deterministic digest, rollback, and verification-plan checks. "
            "It is eligible for a separately authorized external executor; this service performed no live mutation."
        ),
        observations=[
            f"Approval {record.approval_id} was in approved state before validation.",
            f"The stored SHA-256 digest matched {record.digest}.",
            f"The packet contains {len(change_set.changes)} proposed change(s): {', '.join(targets)}.",
        ],
        rollback_plan=list(change_set.rollback_plan),
        verification_results=[
            "The approved digest matched the canonical staged change set.",
            f"Rollback plan present with {len(change_set.rollback_plan)} step(s).",
            f"Verification plan present with {len(change_set.verification_plan)} step(s).",
            "No live mutation capability was available or invoked.",
        ],
        audit_refs=[record.approval_id, f"sha256:{record.digest}"],
        risks=list(change_set.risks),
        next_actions=[
            "Keep the packet unchanged if it is handed to a separately authorized live executor.",
            "Require that executor to apply the recorded rollback and verification plans and append execution evidence.",
        ],
        confidence=Confidence.HIGH,
    )
