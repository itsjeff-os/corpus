from __future__ import annotations

import hmac
import logging
from contextlib import asynccontextmanager
from typing import Any
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

from src import __version__
from src.agents import AGENT_SPECS
from src.config import Settings, get_settings
from src.crew import CrewResultError, run_execution, run_exploration
from src.routing import execution_agent_names, route_request
from src.schemas import ApproveRequest, ExecuteRequest, ExploreRequest, StageRequest
from src.services import ApprovalConflict, ApprovalNotFound, ApprovalStore, RuntimeContextClient


logger = logging.getLogger("head_of_systems")


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    app.state.settings = settings
    app.state.approvals = ApprovalStore(settings.staging_dir)
    app.state.runtime_context = RuntimeContextClient(settings)
    logger.info("service_started port=%s execution_authority=staging_only", settings.service_port)
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Head of Systems",
        description="Governed multi-agent systems orchestration service",
        version=__version__,
        lifespan=lifespan,
    )

    @app.middleware("http")
    async def bearer_auth(request: Request, call_next):
        settings = get_settings()
        if request.url.path in {"/health", "/docs", "/openapi.json"} or not settings.service_api_token:
            return await call_next(request)
        provided = request.headers.get("authorization", "")
        expected = f"Bearer {settings.service_api_token.get_secret_value()}"
        if not hmac.compare_digest(provided, expected):
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"detail": "unauthorized"})
        return await call_next(request)

    @app.exception_handler(ApprovalNotFound)
    async def approval_not_found(_: Request, error: ApprovalNotFound):
        return JSONResponse(status_code=404, content={"detail": str(error)})

    @app.exception_handler(ApprovalConflict)
    async def approval_conflict(_: Request, error: ApprovalConflict):
        return JSONResponse(status_code=409, content={"detail": str(error)})

    @app.exception_handler(CrewResultError)
    async def crew_result_error(_: Request, error: CrewResultError):
        logger.error("crew_output_invalid error=%s", error)
        return JSONResponse(status_code=502, content={"detail": "agent crew returned an invalid structured result"})

    @app.get("/health")
    async def health(request: Request) -> dict[str, Any]:
        settings = _settings(request)
        return {
            "ok": True,
            "service": settings.service_name,
            "version": __version__,
            "port": settings.service_port,
            "model": settings.model,
            "provider": settings.model.partition("/")[0],
            "integrations": settings.integration_status(),
            "execution_authority": "staging_only",
        }

    @app.get("/agents")
    async def agents() -> dict[str, Any]:
        return {
            "agents": [spec.public_dict() for spec in AGENT_SPECS.values()],
            "delegation": {"allowed": ["systems_engineer_lead"]},
            "execution_agents": list(execution_agent_names()),
        }

    @app.post("/route")
    async def route(payload: ExploreRequest) -> dict[str, Any]:
        decision = route_request(payload.request)
        return decision.to_dict()

    @app.post("/explore")
    async def explore(payload: ExploreRequest, request: Request) -> dict[str, Any]:
        settings = _settings(request)
        _require_model(settings)
        request_id = f"req_{uuid4().hex}"
        context_client = _context_client(request)
        runtime_context = await context_client.get_context(
            thread_id=payload.thread_id,
            user_id=payload.user_id or settings.default_user_id,
            message=payload.request,
        )
        try:
            result, bundle = await run_in_threadpool(
                run_exploration,
                request=payload.request,
                request_id=request_id,
                runtime_context=runtime_context,
                settings=settings,
            )
        except CrewResultError:
            raise
        except Exception as error:
            logger.exception("exploration_crew_failed request_id=%s", request_id)
            raise HTTPException(status_code=502, detail="agent crew execution failed") from error
        result.request_id = request_id
        memory_write = await context_client.log_turn(
            thread_id=payload.thread_id,
            user_id=payload.user_id or settings.default_user_id,
            user_message=payload.request,
            assistant_message=result.model_dump_json(),
        )
        return {
            "request_id": request_id,
            "route": bundle.route.to_dict() if bundle.route else None,
            "agents": list(bundle.agent_names),
            "result": result.model_dump(mode="json"),
            "direct_evidence": {
                domain: {
                    key: value.get(key)
                    for key in ("ok", "status_code", "configured", "error")
                    if key in value
                }
                for domain, value in (bundle.direct_evidence or {}).items()
                if isinstance(value, dict)
            },
            "runtime_context": {
                "configured": runtime_context.get("configured", False),
                "degraded": runtime_context.get("degraded", False),
            },
            "memory_write": memory_write,
        }

    @app.post("/stage", status_code=201)
    async def stage_change(payload: StageRequest, request: Request) -> dict[str, Any]:
        record = _store(request).stage(payload.change_set)
        return {
            "approval_id": record.approval_id,
            "digest": record.digest,
            "status": record.status,
            "created_at": record.created_at,
            "change_set": record.change_set.model_dump(mode="json"),
        }

    @app.get("/approvals/{approval_id}")
    async def get_approval(approval_id: str, request: Request) -> dict[str, Any]:
        return _store(request).get(approval_id).model_dump(mode="json")

    @app.post("/approve")
    async def approve(payload: ApproveRequest, request: Request) -> dict[str, Any]:
        record = _store(request).approve(
            payload.approval_id,
            payload.expected_digest,
            payload.approved_by,
        )
        return record.model_dump(mode="json")

    @app.post("/approvals/{approval_id}/revoke")
    async def revoke(approval_id: str, request: Request) -> dict[str, Any]:
        return _store(request).revoke(approval_id).model_dump(mode="json")

    @app.post("/execute")
    async def execute(payload: ExecuteRequest, request: Request) -> dict[str, Any]:
        settings = _settings(request)
        _require_model(settings)
        store = _store(request)
        record = store.verify_for_execution(
            payload.approval_id,
            payload.expected_digest,
            payload.staged_output,
        )
        try:
            report, bundle = await run_in_threadpool(run_execution, record, settings)
        except CrewResultError:
            raise
        except Exception as error:
            logger.exception("execution_crew_failed approval_id=%s", record.approval_id)
            raise HTTPException(status_code=502, detail="agent crew execution failed") from error
        report.request_id = record.change_set.request_id
        report.approval_id = record.approval_id
        report.execution_authority = "staging_only"
        updated = store.record_execution(record, report)
        return {
            "approval": updated.model_dump(mode="json"),
            "agents": list(bundle.agent_names),
            "report": report.model_dump(mode="json"),
            "live_mutation_performed": False,
        }

    return app


def _settings(request: Request) -> Settings:
    return request.app.state.settings


def _store(request: Request) -> ApprovalStore:
    return request.app.state.approvals


def _context_client(request: Request) -> RuntimeContextClient:
    return request.app.state.runtime_context


def _require_model(settings: Settings) -> None:
    if not settings.model_configured:
        raise HTTPException(
            status_code=503,
            detail=f"model provider for {settings.model!r} is not configured",
        )


app = create_app()
