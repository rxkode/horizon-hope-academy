"""
Core application configuration.
Reads from environment variables / .env file.
Kenya Data Protection Act 2019 — compliant field tagging.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # App
    app_name: str = "Horizon Hope Academy API"
    app_env: str = "development"
    debug: bool = True
    secret_key: str = "insecure-dev-key-replace-in-prod"
    allowed_origins: list[str] = ["http://localhost:3000"]

    # Database
    database_url: str = "postgresql+asyncpg://hhacademy:hhacademy_dev_password@localhost:5432/horizon_hope_db"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Kenya DPA 2019 compliance
    data_retention_days: int = 365
    student_data_encrypted: bool = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
