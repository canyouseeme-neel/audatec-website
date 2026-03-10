import json
import os

import httpx

from app.schemas.post_call import EmotionPoint, TranscriptChunk


class EmotionAggregationService:
    """Maps transcript chunks to coarse emotional vectors with timestamps."""

    hesitation_markers = ["not sure", "hesitant", "lock-in", "concern", "penalty"]
    positive_markers = ["great", "good", "interested", "approved", "okay"]
    stress_markers = ["urgent", "immediately", "pressure", "overdue", "critical"]

    def aggregate(self, transcript: list[TranscriptChunk]) -> list[EmotionPoint]:
        gpt_mapped = self._aggregate_with_gpt53(transcript)
        if gpt_mapped:
            return gpt_mapped

        timeline: list[EmotionPoint] = []

        for chunk in transcript:
            lowered = chunk.text.lower()
            emotion = "neutral"
            intensity = 0.3
            topic = self._infer_topic(lowered)

            if any(marker in lowered for marker in self.hesitation_markers):
                emotion = "hesitation"
                intensity = 0.75
            elif any(marker in lowered for marker in self.stress_markers):
                emotion = "stress"
                intensity = 0.82
            elif any(marker in lowered for marker in self.positive_markers):
                emotion = "confidence"
                intensity = 0.72

            timeline.append(
                EmotionPoint(
                    timestamp=chunk.timestamp,
                    emotion=emotion,
                    intensity=intensity,
                    topic=topic,
                ),
            )

        return timeline

    def _aggregate_with_gpt53(
        self, transcript: list[TranscriptChunk]
    ) -> list[EmotionPoint] | None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or not transcript:
            return None

        compact_segments = [
            {
                "timestamp": segment.timestamp,
                "speaker": segment.speaker,
                "text": segment.text,
            }
            for segment in transcript[:50]
        ]
        prompt = (
            "Map transcript segments to emotions. "
            "Return strict JSON list with keys: timestamp, emotion, intensity, topic. "
            "Emotion values should use: confidence, hesitation, stress, neutral."
        )

        try:
            response = httpx.post(
                "https://api.openai.com/v1/responses",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-5.3",
                    "input": [
                        {"role": "system", "content": prompt},
                        {"role": "user", "content": json.dumps(compact_segments)},
                    ],
                },
                timeout=10.0,
            )
            response.raise_for_status()
            data = response.json()
            text_output = data.get("output_text") or "[]"
            parsed = json.loads(text_output)
            timeline = [
                EmotionPoint(
                    timestamp=float(item["timestamp"]),
                    emotion=str(item["emotion"]),
                    intensity=float(item["intensity"]),
                    topic=str(item.get("topic") or "general discussion"),
                )
                for item in parsed
            ]
            return timeline
        except Exception:
            return None

    def _infer_topic(self, lowered_text: str) -> str:
        if "lock-in" in lowered_text:
            return "lock-in period"
        if "processing fee" in lowered_text:
            return "processing fee"
        if "interest" in lowered_text or "apr" in lowered_text:
            return "interest disclosure"
        if "kyc" in lowered_text:
            return "kyc"
        return "general discussion"
