from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Environment-backed configuration with secret-safe representations."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    service_name: str = "head-of-systems"
    service_host: str = "0.0.0.0"
    service_port: int = Field(default=5070, ge=1, le=65535)
    service_api_token: SecretStr | None = None
    log_level: str = "INFO"
    staging_dir: Path = Path("/app/staging")

    model: str = "gemini/gemini-3.5-flash"
    model_base_url: str | None = None
    model_api_key: SecretStr | None = None
    gemini_api_key: SecretStr | None = Field(
        default=None,
        validation_alias=AliasChoices("GEMINI_API_KEY", "ai-studio_gemini_api_key"),
    )
    model_temperature: float = Field(default=0.1, ge=0, le=2)
    model_max_tokens: int = Field(default=4096, ge=256, le=65536)
    model_private_context_enabled: bool = False
    crew_verbose: bool = False

    home_assistant_base_url: str = "http://host.docker.internal:8123"
    home_assistant_token: SecretStr | None = None
    node_red_base_url: str = "http://host.docker.internal:1880"
    node_red_token: SecretStr | None = None
    runtime_core_base_url: str = "http://runtime-core-v1:5061"
    runtime_core_token: SecretStr | None = None
    zep_api_url: str = "https://api.getzep.com"
    zep_api_key: SecretStr | None = None
    cloudflare_api_url: str = "https://api.cloudflare.com/client/v4"
    cloudflare_api_token: SecretStr | None = None
    cloudflare_account_id: str | None = None
    cloudflare_zone_id: str | None = None
    memory_write_enabled: bool = False
    default_user_id: str = "jeff"

    request_timeout_seconds: float = Field(default=15.0, gt=0, le=120)

    @field_validator(
        "model_base_url",
        "cloudflare_account_id",
        "cloudflare_zone_id",
        mode="before",
    )
    @classmethod
    def empty_string_to_none(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip():
            return None
        return value

    @property
    def model_configured(self) -> bool:
        if self.model.startswith("gemini/"):
            return bool(self.gemini_api_key or self.model_api_key)
        if self.model.startswith("ollama/"):
            return bool(self.model_base_url)
        return bool(self.model_api_key)

    def integration_status(self) -> dict[str, bool]:
        return {
            "model": self.model_configured,
            "model_private_context": self.model_private_context_enabled,
            "home_assistant": bool(self.home_assistant_token),
            "node_red": bool(self.node_red_base_url),
            "runtime_core": bool(self.runtime_core_base_url),
            "zep": bool(self.zep_api_key),
            "cloudflare": bool(self.cloudflare_api_token),
            "memory_writes": self.memory_write_enabled,
        }


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
