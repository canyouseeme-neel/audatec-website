from functools import lru_cache

from app.core import Settings, get_settings

try:
    from supabase import Client, create_client  # type: ignore
except Exception:  # pragma: no cover
    Client = None  # type: ignore
    create_client = None  # type: ignore


@lru_cache(maxsize=1)
def get_supabase_client(settings: Settings | None = None):
    settings = settings or get_settings()
    if not settings.supabase_url or not settings.supabase_service_key:
        return None
    if create_client is None:
        return None
    return create_client(settings.supabase_url, settings.supabase_service_key)
