from src.config import Settings
from src.crew import build_llm


def test_current_generated_gemini_secret_name_is_supported(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    monkeypatch.setenv("ai-studio_gemini_api_key", "test-key")

    settings = Settings(_env_file=None)

    assert settings.model_configured is True
    assert settings.gemini_api_key.get_secret_value() == "test-key"


def test_native_gemini_provider_initializes(monkeypatch):
    monkeypatch.setenv("GEMINI_API_KEY", "test-key")
    settings = Settings(_env_file=None)

    llm = build_llm(settings)

    assert llm.model == "gemini-3.5-flash"


def test_private_model_context_is_opt_in(monkeypatch):
    monkeypatch.delenv("MODEL_PRIVATE_CONTEXT_ENABLED", raising=False)

    settings = Settings(_env_file=None)

    assert settings.model_private_context_enabled is False
