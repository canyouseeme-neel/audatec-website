"use client";

import { useEffect, useMemo, useRef } from "react";

import gsap from "gsap";

type TranscriptRow = {
  id: string;
  text: string;
  timestamp: number;
};

type SentimentPoint = {
  x: number;
  y: number;
  value: number;
  text: string;
  timestamp: number;
};

const positiveWords = ["good", "great", "interested", "approved", "okay"];
const negativeWords = ["hesitant", "concern", "lock-in", "penalty", "not sure", "expensive"];

const sentimentScore = (text: string) => {
  const lowered = text.toLowerCase();
  const positive = positiveWords.filter((word) => lowered.includes(word)).length;
  const negative = negativeWords.filter((word) => lowered.includes(word)).length;
  return Math.max(-1, Math.min(1, (positive - negative) / 2));
};

export function SentimentPulseTimeline({
  transcript,
  complianceTerms,
}: {
  transcript: TranscriptRow[];
  complianceTerms: string[];
}) {
  const pathRef = useRef<SVGPathElement>(null);

  const points = useMemo<SentimentPoint[]>(() => {
    if (transcript.length === 0) {
      return [];
    }
    return transcript.map((line, index) => {
      const score = sentimentScore(line.text);
      const x = transcript.length === 1 ? 0 : (index / (transcript.length - 1)) * 100;
      const y = 50 - score * 40;
      return {
        x,
        y,
        value: score,
        text: line.text,
        timestamp: line.timestamp,
      };
    });
  }, [transcript]);

  const pathD = useMemo(() => {
    if (points.length === 0) {
      return "";
    }
    return points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");
  }, [points]);

  const complianceAlerts = useMemo(() => {
    return points
      .filter((point) => point.value < -0.4)
      .filter((point) =>
        complianceTerms.some((term) => point.text.toLowerCase().includes(term.toLowerCase())),
      )
      .map((point) => ({
        id: `${point.timestamp}-${point.x}`,
        message: `Negative sentiment spike near disclosure terms at ${new Date(
          point.timestamp * 1000,
        ).toLocaleTimeString()}`,
      }));
  }, [complianceTerms, points]);

  useEffect(() => {
    if (!pathRef.current || !pathD) {
      return;
    }
    const totalLength = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  }, [pathD]);

  return (
    <div className="surface-muted space-y-3 p-3">
      <p className="text-xs uppercase tracking-widest text-white/60">Sentiment Pulse</p>
      <svg viewBox="0 0 100 100" className="h-28 w-full overflow-visible">
        <path d="M 0 50 L 100 50" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
        {pathD && (
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#34F5A1"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>
      <div className="space-y-2">
        {complianceAlerts.length === 0 ? (
          <p className="text-xs text-white/50">No compliance sentiment alerts yet.</p>
        ) : (
          complianceAlerts.map((alert) => (
            <div
              key={alert.id}
              className="rounded-md border border-[var(--warning-amber)]/40 bg-[color:var(--warning-amber)]/10 px-2 py-1 text-xs text-[var(--warning-amber)]"
            >
              {alert.message}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
