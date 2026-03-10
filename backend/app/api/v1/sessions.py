from typing import Any

from fastapi import APIRouter, BackgroundTasks, Request

from app.schemas.session import (
    SessionEndRequest,
    SessionEndResponse,
    SessionStartRequest,
    SessionStartResponse,
    new_session_id,
    now_iso,
)
from app.services.audit_report import build_mock_audit_report

router = APIRouter(prefix="/sessions", tags=["sessions"])


def _ensure_state(request: Request) -> None:
    if not hasattr(request.app.state, "demo_sessions"):
        request.app.state.demo_sessions = {}
    if not hasattr(request.app.state, "audit_reports"):
        request.app.state.audit_reports = {}
    if not hasattr(request.app.state, "audit_events"):
        request.app.state.audit_events = []


@router.post("/start", response_model=SessionStartResponse)
async def start_session(
    payload: SessionStartRequest,
    request: Request,
) -> SessionStartResponse:
    _ensure_state(request)
    session_id = new_session_id()
    request.app.state.demo_sessions[session_id] = {
        "session_id": session_id,
        "persona": payload.persona,
        "channel": payload.channel,
        "metadata": payload.metadata,
        "started_at": now_iso(),
    }
    return SessionStartResponse(
        session_id=session_id,
        started_at=request.app.state.demo_sessions[session_id]["started_at"],
        persona=payload.persona,
    )


def _generate_report(
    *,
    app_state: Any,
    session_id: str,
    transcript: list[dict[str, Any]],
    metadata: dict[str, Any],
) -> None:
    events = [
        event
        for event in app_state.audit_events
        if event.get("session_id") == session_id or event.get("session_id") is None
    ]
    report = build_mock_audit_report(
        session_id=session_id,
        transcript=transcript,
        events=events,
        metadata=metadata,
    )
    app_state.audit_reports[session_id] = report


@router.post("/{session_id}/end", response_model=SessionEndResponse)
async def end_session(
    session_id: str,
    payload: SessionEndRequest,
    request: Request,
    background_tasks: BackgroundTasks,
) -> SessionEndResponse:
    _ensure_state(request)
    session_data = request.app.state.demo_sessions.get(session_id, {})
    metadata = {**session_data.get("metadata", {}), **payload.metadata}
    transcript = [segment.model_dump() for segment in payload.transcript]

    background_tasks.add_task(
        _generate_report,
        app_state=request.app.state,
        session_id=session_id,
        transcript=transcript,
        metadata=metadata,
    )

    return SessionEndResponse(
        session_id=session_id,
        ended_at=now_iso(),
        audit_report_ready=True,
    )


@router.get("/{session_id}/audit-report")
async def get_audit_report(session_id: str, request: Request) -> dict[str, Any]:
    _ensure_state(request)
    return request.app.state.audit_reports.get(
        session_id,
        {
            "session_id": session_id,
            "status": "pending",
            "message": "Audit report is being generated in background.",
        },
    )
