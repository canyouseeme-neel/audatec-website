from datetime import timedelta
from typing import Any

from fastapi import HTTPException, status

from app.core import Settings
from app.schemas.voice import VoiceTokenRequest, VoiceTokenResponse

try:
    from livekit import api as lk_api  # type: ignore
except Exception:  # pragma: no cover
    lk_api = None


class VoiceService:
    """Token service extracted from playground token endpoint into modular service."""

    def __init__(self, settings: Settings):
        self.settings = settings

    def create_token(self, payload: VoiceTokenRequest) -> VoiceTokenResponse:
        if not self.settings.livekit_api_key or not self.settings.livekit_api_secret:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="LIVEKIT_API_KEY / LIVEKIT_API_SECRET not configured",
            )

        room_name = payload.resolved_room_name()
        identity = payload.resolved_identity()
        participant_name = payload.participant_name or payload.participantName or identity
        metadata = self._build_metadata(payload)
        token = self._generate_livekit_jwt(
            room_name=room_name,
            identity=identity,
            participant_name=participant_name,
            metadata=metadata,
            attributes=payload.participant_attributes or {},
        )

        return VoiceTokenResponse(
            server_url=self.settings.livekit_url,
            participant_token=token,
            room_name=room_name,
            participant_identity=identity,
        )

    def _build_metadata(self, payload: VoiceTokenRequest) -> str:
        metadata_parts = []
        if payload.participant_metadata:
            metadata_parts.append(payload.participant_metadata)
        if payload.agent_name:
            metadata_parts.append(f"agent={payload.agent_name}")
        if payload.agent_metadata:
            metadata_parts.append(f"agentMetadata={payload.agent_metadata}")
        return "; ".join(metadata_parts)

    def _generate_livekit_jwt(
        self,
        *,
        room_name: str,
        identity: str,
        participant_name: str,
        metadata: str,
        attributes: dict[str, str],
    ) -> str:
        if lk_api is None:
            # Fallback for environments where livekit-api package is unavailable.
            return f"mock-token::{room_name}::{identity}"

        token = (
            lk_api.AccessToken(
                self.settings.livekit_api_key,
                self.settings.livekit_api_secret,
            )
            .with_identity(identity)
            .with_name(participant_name)
            .with_ttl(timedelta(minutes=self.settings.livekit_token_ttl_minutes))
            .with_grants(
                lk_api.VideoGrants(
                    room_join=True,
                    room=room_name,
                    can_subscribe=True,
                    can_publish=True,
                ),
            )
        )

        if metadata:
            token = token.with_metadata(metadata)
        if attributes:
            token = token.with_attributes(attributes)

        return token.to_jwt()


def build_voice_payload(raw_payload: dict[str, Any]) -> VoiceTokenRequest:
    return VoiceTokenRequest.model_validate(raw_payload)
