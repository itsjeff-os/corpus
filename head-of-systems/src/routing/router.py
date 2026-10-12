from __future__ import annotations

import re
from dataclasses import asdict, dataclass


AGENT_IDS = (
    "systems_engineer_lead",
    "architect",
    "ha_specialist",
    "node_red_specialist",
    "cloudflare_specialist",
    "networking_specialist",
    "linux_ssh_operator",
    "reviewer",
    "deployer",
)

DOMAIN_AGENTS: dict[str, str] = {
    "architecture": "architect",
    "home_assistant": "ha_specialist",
    "node_red": "node_red_specialist",
    "cloudflare": "cloudflare_specialist",
    "networking": "networking_specialist",
    "linux_ssh": "linux_ssh_operator",
}

DOMAIN_SIGNALS: dict[str, tuple[str, ...]] = {
    "architecture": (
        "architecture",
        "system design",
        "boundary",
        "interface",
        "dependency",
        "integration",
        "topology",
        "stack",
    ),
    "home_assistant": (
        "home assistant",
        "homeassistant",
        "hass",
        "entity",
        "automation",
        "helper",
        "device registry",
        "area registry",
    ),
    "node_red": (
        "node-red",
        "node red",
        "nodered",
        "flow",
        "webhook",
        "inject node",
        "function node",
    ),
    "cloudflare": (
        "cloudflare",
        "cloudflare tunnel",
        "worker",
        "workers.dev",
        "itsjeff.org",
        "zone id",
    ),
    "networking": (
        "network",
        "dns",
        "subnet",
        "firewall",
        "port",
        "reverse proxy",
        "tls",
        "routing",
    ),
    "linux_ssh": (
        "linux",
        "ubuntu",
        "ssh",
        "systemd",
        "service",
        "permission",
        "docker",
        "compose",
        "mini pc",
        "filesystem",
    ),
}


@dataclass(frozen=True, slots=True)
class RouteDecision:
    primary_domain: str
    domains: tuple[str, ...]
    agents: tuple[str, ...]
    matched_signals: dict[str, tuple[str, ...]]
    cross_domain: bool

    def to_dict(self) -> dict[str, object]:
        return asdict(self)


def _contains(text: str, signal: str) -> bool:
    pattern = rf"(?<![a-z0-9_]){re.escape(signal)}(?![a-z0-9_])"
    return re.search(pattern, text) is not None


def route_request(request: str) -> RouteDecision:
    """Route deterministically; the model never decides its own authority."""

    text = " ".join(request.lower().split())
    matched: dict[str, tuple[str, ...]] = {}
    scores: dict[str, int] = {}

    for domain, signals in DOMAIN_SIGNALS.items():
        hits = tuple(signal for signal in signals if _contains(text, signal))
        if hits:
            matched[domain] = hits
            scores[domain] = len(hits)

    if not scores:
        domains = ("architecture",)
        primary = "architecture"
    else:
        ordered = sorted(
            scores,
            key=lambda domain: (
                -scores[domain],
                domain == "architecture",
                list(DOMAIN_SIGNALS).index(domain),
            ),
        )
        domains = tuple(ordered)
        primary = ordered[0]

    substantive = tuple(domain for domain in domains if domain != "architecture")
    cross_domain = len(substantive) > 1

    agent_order = ["systems_engineer_lead", "architect"]
    for domain in domains:
        agent = DOMAIN_AGENTS[domain]
        if agent not in agent_order:
            agent_order.append(agent)
    agent_order.append("reviewer")

    return RouteDecision(
        primary_domain=primary,
        domains=domains,
        agents=tuple(agent_order),
        matched_signals=matched,
        cross_domain=cross_domain,
    )


def execution_agent_names() -> tuple[str, ...]:
    return ("systems_engineer_lead", "linux_ssh_operator", "deployer")
