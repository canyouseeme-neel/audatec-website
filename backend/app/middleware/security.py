from collections import defaultdict, deque
from time import time

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core import get_settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory limiter suitable for demo/staging traffic."""

    def __init__(self, app):
        super().__init__(app)
        self._windows: dict[str, deque[float]] = defaultdict(deque)
        self._settings = get_settings()

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        route_key = f"{client_ip}:{request.url.path}"
        now = time()
        window = self._windows[route_key]
        per_minute_limit = max(self._settings.rate_limit_per_minute, 1)

        while window and now - window[0] > 60:
            window.popleft()

        if len(window) >= per_minute_limit:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded. Retry in a few seconds.",
                    "limit_per_minute": per_minute_limit,
                },
            )

        window.append(now)
        return await call_next(request)
