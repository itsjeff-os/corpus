from pathlib import Path
import os

from agents import Agent, Runner, function_tool, trace

from .models import CompileIntentRequest, IntentPacket


PROMPT_PATH = Path(__file__).resolve().parents[2] / "docs" / "prompt.md"


def _project_context(project: str | None) -> str:
    if project in {None, "", "general"}:
        return (
            "No single project was selected. Treat the request as cross-system "
            "intent until the domain is clearer."
        )

    normalized = project.strip().lower()
    contexts = {
        "home-assistant": (
            "Home Assistant is the device/state/control plane. Node-RED is the "
            "local automation wiring layer. Conversation should form intent; "
            "writes to entities, scenes, switches, or automations require an "
            "approval boundary and a receipt. Cloudflare may track durable "
            "workflow state but must not be treated as the main backend."
        ),
        "ha": (
            "HA means Home Assistant. Use the home-assistant context: device "
            "control plane, Node-RED wiring, approval for meaningful writes."
        ),
        "node-red": (
            "Node-RED is a local execution/wiring surface. It can receive "
            "approved decisions and call Home Assistant services. Flow edits "
            "should be proposed and approved before activation."
        ),
        "cloudflare": (
            "Cloudflare is useful for durable workflows, approval state, public "
            "callbacks, live status, and receipts. It is not the canonical brain, "
            "memory layer, or full backend."
        ),
        "memory": (
            "Memory spans working principles, decisions, interaction corrections, "
            "project state, and receipts. Zep/Chroma/Supabase may be storage "
            "surfaces, but conversation determines what is worth remembering."
        ),
    }
    return contexts.get(
        normalized,
        f"Project '{project}' has no detailed seed context yet. Preserve intent, "
        "surface assumptions, and avoid claiming live project facts.",
    )


@function_tool
def load_project_context(project: str | None) -> str:
    """Return local seed context for known project domains."""
    return _project_context(project)


def build_agent() -> Agent:
    instructions = PROMPT_PATH.read_text()
    return Agent(
        name="Intent Compiler",
        instructions=instructions,
        model=os.environ.get("INTENT_RUNTIME_MODEL", "gpt-4o"),
        tools=[load_project_context],
        output_type=IntentPacket,
    )


async def compile_intent(request: CompileIntentRequest) -> IntentPacket:
    agent = build_agent()
    project_context = _project_context(request.project)
    prompt = (
        "Compile this conversation request into an operational intent packet.\n\n"
        f"Project: {request.project or 'unspecified'}\n"
        f"Mode hint: {request.mode_hint or 'unspecified'}\n"
        f"Seed project context: {project_context}\n"
        f"User text: {request.text}"
    )
    with trace("compile_intent"):
        result = await Runner.run(agent, prompt)
    return result.final_output
