from uuid import uuid4

from app.schemas.post_call import (
    MockCrmUpdateRequest,
    MockCrmUpdateResponse,
)


class MockCrmService:
    """Simulates Salesforce/CRM update for demo and QA flows."""

    def push_update(self, payload: MockCrmUpdateRequest) -> MockCrmUpdateResponse:
        external_id = f"sf-{uuid4().hex[:10]}"
        return MockCrmUpdateResponse(
            provider="mock-salesforce",
            status="updated",
            external_id=external_id,
            received=payload.entities,
        )
