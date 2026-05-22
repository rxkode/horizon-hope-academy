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
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────
    app_name: str  = "Horizon Hope Academy API"
    app_env:  str  = "development"
    debug:    bool = True
    secret_key: str = "insecure-dev-key-replace-in-prod"

    # ── CORS ─────────────────────────────────────────────────
    allowed_origins: list[str] = ["http://localhost:3000"]

    # ── Database ─────────────────────────────────────────────
    database_url: str = (
        "postgresql+asyncpg://hhacademy:hhacademy_dev_password"
        "@localhost:5433/horizon_hope_db"
    )

    # ── Redis ────────────────────────────────────────────────
    redis_url: str = "redis://:redis_dev_password@localhost:6380/0"

    # ── JWT ──────────────────────────────────────────────────
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # ── Kenya DPA 2019 ───────────────────────────────────────
    data_retention_days: int = 365
    student_data_encrypted: bool = True

    # ── Gmail SMTP ───────────────────────────────────────────
    gmail_address:      str = ""
    gmail_app_password: str = ""

    # ── M-Pesa Daraja ────────────────────────────────────────
    mpesa_consumer_key:    str = ""
    mpesa_consumer_secret: str = ""
    mpesa_shortcode:       str = "506900"
    mpesa_passkey:         str = ""
    mpesa_env:             str = "sandbox"   # sandbox | production
    mpesa_callback_url:    str = ""

    # ── Airtel Money ─────────────────────────────────────────
    airtel_client_id:     str = "not-configured-yet"
    airtel_client_secret: str = "not-configured-yet"
    airtel_env:           str = "sandbox"

    # ── Tower Sacco ──────────────────────────────────────────
    tower_sacco_paybill: str = "506900"
    tower_sacco_account: str = "000900502004324"

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_origins(cls, v: object) -> list[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                return json.loads(v)
            return [o.strip() for o in v.split(",") if o.strip()]
        return v  # type: ignore[return-value]


@lru_cache
def get_settings() -> Settings:
    return Settings()
