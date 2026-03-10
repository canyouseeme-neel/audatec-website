from typing import Any
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class VoiceTokenRequest(BaseModel):
    model_config = ConfigDict(extra="allow")

    room_name: str | None = None
    roomName: str | None = None
    participant_identity: str | None = None
    participantName: str | None = None
    participant_name: str | None = None
    participant_metadata: str | None = None
    participant_attributes: dict[str, str] | None = None
    room_config: dict[str, Any] | None = None
    agent_name: str | None = Field(default=None, alias="agentName")
    agent_metadata: str | None = Field(default=None, alias="agentMetadata")

    def resolved_room_name(self) -> str:
        return self.room_name or self.roomName or f"room-{uuid4().hex[:8]}"

    def resolved_identity(self) -> str:
        return (
            self.participant_identity
            or self.participantName
            or self.participant_name
            or f"user-{uuid4().hex[:8]}"
        )


class VoiceTokenResponse(BaseModel):
    server_url: str
    participant_token: str
    room_name: str
    participant_identity: str
