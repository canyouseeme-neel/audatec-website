from fastapi import APIRouter, Depends

from app.core import Settings, get_settings
from app.schemas.voice import VoiceTokenRequest, VoiceTokenResponse
from app.services.voice import VoiceService

router = APIRouter(prefix="/voice", tags=["voice"])


@router.post("/token", response_model=VoiceTokenResponse)
async def create_voice_token(
    payload: VoiceTokenRequest,
    settings: Settings = Depends(get_settings),
) -> VoiceTokenResponse:
    service = VoiceService(settings)
    return service.create_token(payload)
