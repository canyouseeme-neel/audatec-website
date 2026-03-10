import { useMemo } from "react";

type EmotionVector = {
  state: "confidence" | "neutral" | "hesitation";
  intensity: number;
  color: string;
};

const hesitationWords = ["hesitant", "concern", "lock-in", "not sure", "penalty"];
const confidenceWords = ["approved", "great", "good", "interested", "proceed"];

export const useEmotionVector = (
  latestTranscriptLine: string | undefined,
  volume: number,
): EmotionVector => {
  return useMemo(() => {
    const lowered = (latestTranscriptLine ?? "").toLowerCase();
    const hesitationHits = hesitationWords.filter((word) => lowered.includes(word)).length;
    const confidenceHits = confidenceWords.filter((word) => lowered.includes(word)).length;

    if (hesitationHits > confidenceHits) {
      return {
        state: "hesitation",
        intensity: Math.min(1, 0.35 + volume + hesitationHits * 0.1),
        color: "#ffb200",
      };
    }

    if (confidenceHits > hesitationHits) {
      return {
        state: "confidence",
        intensity: Math.min(1, 0.3 + volume + confidenceHits * 0.1),
        color: "#00ff41",
      };
    }

    return {
      state: "neutral",
      intensity: Math.min(1, 0.25 + volume * 0.8),
      color: "#2ee8f9",
    };
  }, [latestTranscriptLine, volume]);
};
