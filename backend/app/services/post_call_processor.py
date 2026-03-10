from app.schemas.post_call import (
    MockCrmUpdateRequest,
    PostCallRequest,
    PostCallResponse,
)
from app.services.compliance_alerts import ComplianceAlertService
from app.services.entity_extractor import EntityExtractor
from app.services.emotion_aggregation import EmotionAggregationService
from app.services.mock_crm import MockCrmService


class PostCallProcessor:
    def __init__(self):
        self.extractor = EntityExtractor()
        self.crm = MockCrmService()
        self.emotions = EmotionAggregationService()
        self.compliance = ComplianceAlertService()

    def process(self, payload: PostCallRequest) -> PostCallResponse:
        entities = self.extractor.extract(payload.transcript)
        emotion_timeline = self.emotions.aggregate(payload.transcript)
        compliance_alerts = self.compliance.generate(
            transcript=payload.transcript,
            emotion_timeline=emotion_timeline,
        )
        crm_response = self.crm.push_update(
            MockCrmUpdateRequest(
                session_id=payload.session_id,
                entities=entities,
                raw_transcript=payload.transcript,
                source="post-call-processor",
            ),
        )
        return PostCallResponse(
            session_id=payload.session_id,
            entities=entities,
            crm=crm_response,
            emotion_timeline=emotion_timeline,
            compliance_alerts=compliance_alerts,
        )
