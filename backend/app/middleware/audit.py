from datetime import datetime, timezone
from time import perf_counter
from uuid import uuid4

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware


class AuditMiddleware(BaseHTTPMiddleware):
    """Collects lightweight audit events for every API call."""

    async def dispatch(self, request: Request, call_next):
        started_at = perf_counter()
        request_id = request.headers.get("x-request-id", uuid4().hex)
        session_id = request.headers.get("x-demo-session-id")

        response = await call_next(request)

        duration_ms = round((perf_counter() - started_at) * 1000, 2)
        event = {
            "request_id": request_id,
            "session_id": session_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": duration_ms,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

        if not hasattr(request.app.state, "audit_events"):
            request.app.state.audit_events = []
        request.app.state.audit_events.append(event)

        # Keep memory bounded for demo/runtime safety.
        if len(request.app.state.audit_events) > 3000:
            request.app.state.audit_events = request.app.state.audit_events[-3000:]

        response.headers["x-request-id"] = request_id
        return response
