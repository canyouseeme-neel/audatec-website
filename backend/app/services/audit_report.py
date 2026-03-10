from collections import Counter
from datetime import datetime, timezone
from typing import Any


def build_mock_audit_report(
    *,
    session_id: str,
    transcript: list[dict[str, Any]] | None = None,
    events: list[dict[str, Any]] | None = None,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    transcript = transcript or []
    events = events or []
    metadata = metadata or {}

    combined_text = " ".join(segment.get("text", "") for segment in transcript).lower()
    compliance_mandatory_terms = [
        "interest",
        "apr",
        "lock-in",
        "processing fee",
        "consent",
        "disclosure",
    ]
    missing_disclosures = [
        term for term in compliance_mandatory_terms if term not in combined_text
    ]

    speaker_counts = Counter(segment.get("speaker", "unknown") for segment in transcript)
    risk_score = min(100, 10 + len(missing_disclosures) * 8 + max(len(events) - 25, 0))

    return {
        "session_id": session_id,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "brand": "Audatec",
        "mode": "mock",
        "summary": {
            "total_transcript_segments": len(transcript),
            "speaker_turns": dict(speaker_counts),
            "api_events_captured": len(events),
            "risk_score": risk_score,
        },
        "compliance": {
            "missing_disclosures": missing_disclosures,
            "passed": len(missing_disclosures) == 0,
        },
        "metadata": metadata,
    }
