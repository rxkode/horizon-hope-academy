"""
Core application configuration.
Reads from environment variables / .env file.
Kenya Data Protection Act 2019 — compliant field tagging.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
import json


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",   # silently ignore POSTGRES_HOST/PORT/USER/PASS/DB legacy vars
    )

    # App
    app_name: str = "Horizon Hope Academy API"
    app_env:  str = "development"
    debug:    bool = True
    secret_key: str = "insecure-dev-key-replace-in-prod"

    # CORS — may arrive as JSON array string or comma-separated; validator normalises
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Database (full asyncpg URL — the individual POSTGRES_* vars are ignored)
    database_url: str = (
        "postgresql+asyncpg://hhacademy:hhacademy_dev_password"
        "@localhost:5433/horizon_hope_db"
    )

    # Redis
    redis_url: str = "redis://:redis_dev_password@localhost:6380/0"

    # JWT
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Kenya DPA 2019 compliance
    data_retention_days: int = 365
    student_data_encrypted: bool = True

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, v: object) -> list[str]:
        """
        Accept three forms from .env:
          1. JSON array string : ["http://localhost:3000","https://example.com"]
          2. Comma-separated   : http://localhost:3000,https://example.com
          3. Already a list    : passed through unchanged
        """
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                return json.loads(v)
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v  # type: ignore[return-value]


@lru_cache
def get_settings() -> Settings:
    return Settings()
