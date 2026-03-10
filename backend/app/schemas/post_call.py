from typing import Literal

from pydantic import BaseModel, Field


class TranscriptChunk(BaseModel):
    speaker: str = "unknown"
    timestamp: float = 0
    text: str


class CrmEntitySnapshot(BaseModel):
    budget: str | None = None
    product_interest: str | None = None
    sentiment: Literal["positive", "neutral", "negative"] = "neutral"
    next_steps: str | None = None


class PostCallRequest(BaseModel):
    session_id: str
    transcript: list[TranscriptChunk] = Field(default_factory=list)
    persona: str = "bfsi-audit"


class MockCrmUpdateRequest(BaseModel):
    session_id: str
    source: str = "post-call-processor"
    entities: CrmEntitySnapshot
    raw_transcript: list[TranscriptChunk] = Field(default_factory=list)


class MockCrmUpdateResponse(BaseModel):
    provider: str
    status: str
    external_id: str
    received: CrmEntitySnapshot


class EmotionPoint(BaseModel):
    timestamp: float
    emotion: str
    intensity: float
    topic: str | None = None


class ComplianceAlert(BaseModel):
    timestamp: float
    severity: Literal["low", "medium", "high"]
    message: str


class PostCallResponse(BaseModel):
    session_id: str
    entities: CrmEntitySnapshot
    crm: MockCrmUpdateResponse
    emotion_timeline: list[EmotionPoint] = Field(default_factory=list)
    compliance_alerts: list[ComplianceAlert] = Field(default_factory=list)
