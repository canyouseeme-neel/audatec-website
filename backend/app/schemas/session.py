from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field


class SessionStartRequest(BaseModel):
    persona: str = "bfsi-audit"
    channel: str = "voice"
    metadata: dict[str, Any] = Field(default_factory=dict)


class SessionStartResponse(BaseModel):
    session_id: str
    started_at: str
    persona: str


class TranscriptSegment(BaseModel):
    speaker: str
    text: str
    timestamp: float


class SessionEndRequest(BaseModel):
    transcript: list[TranscriptSegment] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class SessionEndResponse(BaseModel):
    session_id: str
    ended_at: str
    audit_report_ready: bool


def new_session_id() -> str:
    return f"demo-{uuid4().hex[:12]}"


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
