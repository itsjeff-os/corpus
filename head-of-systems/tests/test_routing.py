from src.routing.router import execution_agent_names, route_request


def test_home_assistant_routes_to_required_crew_without_deployer():
    route = route_request("Inspect the Home Assistant entity registry and helpers")

    assert route.primary_domain == "home_assistant"
    assert route.agents == (
        "systems_engineer_lead",
        "architect",
        "ha_specialist",
        "reviewer",
    )
    assert "deployer" not in route.agents


def test_cross_domain_request_keeps_every_relevant_specialist():
    route = route_request(
        "Trace the Cloudflare tunnel and DNS route to the Node-RED webhook on the mini PC"
    )

    assert route.cross_domain is True
    assert "cloudflare_specialist" in route.agents
    assert "networking_specialist" in route.agents
    assert "node_red_specialist" in route.agents
    assert "linux_ssh_operator" in route.agents


def test_signal_matching_does_not_match_substrings():
    route = route_request("Create a report about the current design")

    assert "networking" not in route.domains


def test_general_request_routes_to_architect_and_reviewer():
    route = route_request("Help me understand this")

    assert route.domains == ("architecture",)
    assert route.agents == (
        "systems_engineer_lead",
        "architect",
        "reviewer",
    )


def test_explicit_domain_wins_tie_with_generic_architecture_term():
    route = route_request("Inspect the Node-RED boundary")

    assert route.primary_domain == "node_red"


def test_execution_roster_is_fixed_and_bounded():
    assert execution_agent_names() == (
        "systems_engineer_lead",
        "linux_ssh_operator",
        "deployer",
    )
