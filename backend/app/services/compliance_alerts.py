from app.schemas.post_call import ComplianceAlert, EmotionPoint, TranscriptChunk


class ComplianceAlertService:
    mandatory_terms = ["interest", "lock-in", "processing fee", "consent", "disclosure"]

    def generate(
        self,
        *,
        transcript: list[TranscriptChunk],
        emotion_timeline: list[EmotionPoint],
    ) -> list[ComplianceAlert]:
        alerts: list[ComplianceAlert] = []
        joined = " ".join(chunk.text.lower() for chunk in transcript)
        missing = [term for term in self.mandatory_terms if term not in joined]

        if missing:
            alerts.append(
                ComplianceAlert(
                    timestamp=transcript[-1].timestamp if transcript else 0,
                    severity="medium",
                    message=f"Missing mandatory disclosures: {', '.join(missing[:3])}",
                ),
            )

        for point in emotion_timeline:
            if point.emotion in {"hesitation", "stress"} and point.topic in {
                "lock-in period",
                "interest disclosure",
                "processing fee",
            }:
                alerts.append(
                    ComplianceAlert(
                        timestamp=point.timestamp,
                        severity="high",
                        message=(
                            f"Negative sentiment spike near legal disclosure ({point.topic})."
                        ),
                    ),
                )

        return alerts
