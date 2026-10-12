from .architect import SPEC as ARCHITECT_SPEC, create_architect_agent
from .cloudflare import SPEC as CLOUDFLARE_SPEC, create_cloudflare_agent
from .deployer import SPEC as DEPLOYER_SPEC, create_deployer_agent
from .ha import SPEC as HA_SPEC, create_ha_agent
from .lead import SPEC as LEAD_SPEC, create_lead_agent
from .linux_operator import SPEC as LINUX_SPEC, create_linux_operator_agent
from .networking import SPEC as NETWORKING_SPEC, create_networking_agent
from .node_red import SPEC as NODE_RED_SPEC, create_node_red_agent
from .reviewer import SPEC as REVIEWER_SPEC, create_reviewer_agent


AGENT_SPECS = {
    spec.agent_id: spec
    for spec in (
        LEAD_SPEC,
        ARCHITECT_SPEC,
        HA_SPEC,
        NODE_RED_SPEC,
        CLOUDFLARE_SPEC,
        NETWORKING_SPEC,
        LINUX_SPEC,
        REVIEWER_SPEC,
        DEPLOYER_SPEC,
    )
}

__all__ = [
    "AGENT_SPECS",
    "create_architect_agent",
    "create_cloudflare_agent",
    "create_deployer_agent",
    "create_ha_agent",
    "create_lead_agent",
    "create_linux_operator_agent",
    "create_networking_agent",
    "create_node_red_agent",
    "create_reviewer_agent",
]

