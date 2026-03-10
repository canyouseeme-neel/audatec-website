import re

from app.schemas.post_call import CrmEntitySnapshot, TranscriptChunk


class EntityExtractor:
    budget_pattern = re.compile(
        r"(budget|ticket|limit)\s*(is|around|about|=|:)?\s*(inr|rs\.?|₹)?\s*([\d,]+)",
        flags=re.IGNORECASE,
    )
    product_pattern = re.compile(
        r"(loan|card|overdraft|insurance|term plan|credit line|product)\s*[:\-]?\s*([a-zA-Z0-9 \-]+)?",
        flags=re.IGNORECASE,
    )
    next_step_pattern = re.compile(
        r"(next step|follow up|call back|callback|send docs|share statement|kyc)\s*[:\-]?\s*([a-zA-Z0-9 ,\-]+)?",
        flags=re.IGNORECASE,
    )

    negative_markers = {
        "not sure",
        "hesitant",
        "concern",
        "too expensive",
        "not comfortable",
        "lock-in",
        "penalty",
    }
    positive_markers = {
        "sounds good",
        "interested",
        "let us proceed",
        "approved",
        "okay",
        "great",
    }

    def extract(self, transcript: list[TranscriptChunk]) -> CrmEntitySnapshot:
        text = " ".join(chunk.text for chunk in transcript)
        lowered = text.lower()

        budget_match = self.budget_pattern.search(text)
        budget = None
        if budget_match:
            budget = budget_match.group(4).replace(",", "")

        product_match = self.product_pattern.search(text)
        product_interest = None
        if product_match:
            candidate = (product_match.group(2) or product_match.group(1) or "").strip()
            if candidate:
                product_interest = candidate

        next_steps_match = self.next_step_pattern.search(text)
        next_steps = None
        if next_steps_match:
            next_steps = (next_steps_match.group(0) or "").strip()

        sentiment = "neutral"
        negative_score = sum(1 for marker in self.negative_markers if marker in lowered)
        positive_score = sum(1 for marker in self.positive_markers if marker in lowered)
        if negative_score > positive_score:
            sentiment = "negative"
        elif positive_score > negative_score:
            sentiment = "positive"

        return CrmEntitySnapshot(
            budget=budget,
            product_interest=product_interest,
            sentiment=sentiment,  # type: ignore[arg-type]
            next_steps=next_steps,
        )
