from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "Audatec Backend"
    app_env: Literal["development", "staging", "production"] = "development"
    app_debug: bool = False

    allowed_origins: list[str] = Field(default_factory=lambda: ["*"])
    rate_limit_per_minute: int = 60

    livekit_url: str = "wss://livekit.example.com"
    livekit_api_key: str = ""
    livekit_api_secret: str = ""
    livekit_token_ttl_minutes: int = 10

    supabase_url: str = ""
    supabase_service_key: str = ""

    sentiment_mode: Literal["off", "mock", "live"] = "mock"
    website_mode: Literal["marketing_only", "marketing_plus_demo"] = "marketing_plus_demo"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
