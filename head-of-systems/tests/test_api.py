from fastapi.testclient import TestClient

from src.config import get_settings
from src.main import create_app


def candidate_payload():
    return {
        "request_id": "req_api",
        "objective": "Stage a bounded test change",
        "changes": [
            {
                "system": "filesystem",
                "operation": "config_write",
                "target": "staging/example.json",
                "before": None,
                "after": {"enabled": True},
                "purpose": "Exercise API approval flow",
            }
        ],
        "rollback_plan": ["Remove the staged example artifact"],
        "verification_plan": ["Validate the staged JSON"],
        "stop_conditions": [],
        "risks": [],
        "evidence_refs": [],
    }


def test_health_and_agent_roster(monkeypatch, tmp_path):
    monkeypatch.setenv("STAGING_DIR", str(tmp_path))
    get_settings.cache_clear()

    with TestClient(create_app()) as client:
        health = client.get("/health")
        roster = client.get("/agents")

    assert health.status_code == 200
    assert health.json()["execution_authority"] == "staging_only"
    assert len(roster.json()["agents"]) == 9
    get_settings.cache_clear()


def test_stage_approve_and_read(monkeypatch, tmp_path):
    monkeypatch.setenv("STAGING_DIR", str(tmp_path))
    get_settings.cache_clear()

    with TestClient(create_app()) as client:
        staged = client.post("/stage", json={"change_set": candidate_payload()})
        assert staged.status_code == 201
        body = staged.json()

        approved = client.post(
            "/approve",
            json={
                "approval_id": body["approval_id"],
                "expected_digest": body["digest"],
                "approved_by": "jeff",
            },
        )
        readback = client.get(f"/approvals/{body['approval_id']}")

    assert approved.status_code == 200
    assert approved.json()["status"] == "approved"
    assert readback.json()["digest"] == body["digest"]
    get_settings.cache_clear()


def test_optional_bearer_auth(monkeypatch, tmp_path):
    monkeypatch.setenv("STAGING_DIR", str(tmp_path))
    monkeypatch.setenv("SERVICE_API_TOKEN", "test-secret")
    get_settings.cache_clear()

    with TestClient(create_app()) as client:
        assert client.get("/health").status_code == 200
        assert client.get("/agents").status_code == 401
        assert (
            client.get("/agents", headers={"Authorization": "Bearer test-secret"}).status_code
            == 200
        )
    get_settings.cache_clear()

