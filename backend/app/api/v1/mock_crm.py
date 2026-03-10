from fastapi import APIRouter

from app.schemas.post_call import MockCrmUpdateRequest, MockCrmUpdateResponse
from app.services.mock_crm import MockCrmService

router = APIRouter(prefix="/mock-crm", tags=["mock-crm"])
service = MockCrmService()


@router.post("/salesforce/update", response_model=MockCrmUpdateResponse)
async def update_salesforce(payload: MockCrmUpdateRequest) -> MockCrmUpdateResponse:
    return service.push_update(payload)
