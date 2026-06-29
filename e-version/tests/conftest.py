"""pytest configuration and shared fixtures.

This conftest adds the project root to sys.path and creates importable
aliases for service directories that use hyphens (not valid in Python identifiers).
"""

import sys
import importlib.util
import types
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))


def _register_service(module_name: str, service_dir: Path) -> None:
    """Register a hyphenated service directory as an importable Python module."""
    app_dir = service_dir / "app"

    # Register top-level namespace (services)
    top = module_name.split(".")[0]
    if top not in sys.modules:
        m = types.ModuleType(top)
        m.__path__ = [str(ROOT / top)]
        m.__package__ = top
        sys.modules[top] = m

    # Register the service package
    if module_name not in sys.modules:
        m = types.ModuleType(module_name)
        m.__path__ = [str(service_dir)]
        m.__package__ = module_name
        sys.modules[module_name] = m

    # Register the app sub-package
    app_name = f"{module_name}.app"
    if app_name not in sys.modules and app_dir.exists():
        m = types.ModuleType(app_name)
        m.__path__ = [str(app_dir)]
        m.__package__ = app_name
        sys.modules[app_name] = m


_SERVICES = {
    "services.chat_orchestrator": ROOT / "services" / "chat-orchestrator",
    "services.retrieval_engine": ROOT / "services" / "retrieval-engine",
    "services.ingestion_engine": ROOT / "services" / "ingestion-engine",
    "services.memory_engine": ROOT / "services" / "memory-engine",
    "services.knowledge_graph": ROOT / "services" / "knowledge-graph",
    "services.policy_engine": ROOT / "services" / "policy-engine",
    "services.eval_engine": ROOT / "services" / "eval-engine",
}

for _mod, _path in _SERVICES.items():
    _register_service(_mod, _path)
