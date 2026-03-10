from fastapi import APIRouter

from app.api.v1.contacts import router as contacts_router
from app.api.v1.health import router as health_router
from app.api.v1.mock_crm import router as mock_crm_router
from app.api.v1.post_call import router as post_call_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.voice import router as voice_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health_router)
api_router.include_router(voice_router)
api_router.include_router(sessions_router)
api_router.include_router(contacts_router)
api_router.include_router(mock_crm_router)
api_router.include_router(post_call_router)
