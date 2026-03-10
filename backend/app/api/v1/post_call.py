from fastapi import APIRouter

from app.schemas.post_call import PostCallRequest, PostCallResponse
from app.services.post_call_processor import PostCallProcessor

router = APIRouter(prefix="/post-call", tags=["post-call"])
processor = PostCallProcessor()


@router.post("/process", response_model=PostCallResponse)
async def process_post_call(payload: PostCallRequest) -> PostCallResponse:
    return processor.process(payload)
