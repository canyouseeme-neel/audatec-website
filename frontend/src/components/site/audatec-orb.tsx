"use client";

import { useEffect, useId, useState } from "react";

const DEFAULT_THOUGHTS = [
  "Checking Policy",
  "Analyzing Sentiment",
  "Verifying ID",
  "Processing Transcript",
  "Assessing Compliance",
];

/** Deeper blue palette: each node has a distinct shade. Active = detecting. */
const NODE_BASE_COLORS: readonly [string, string, string, string, string, string, string, string] = [
  "#0f172a", "#1e3a8a", "#1e40af", "#1d4ed8",
  "#2563eb", "#1e40af", "#1e3a8a", "#0f172a",
];
const NODE_DETECTING_COLOR = "#0ea5e9"; // Bright cyan-blue when this zone is "scanning"

function getNodePositions(radius: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  });
}

export function AudatecOrb({
  className,
  pulse = 0.35,
  glowColor = "#2ee8f9",
  currentThought,
}: {
  className?: string;
  pulse?: number;
  glowColor?: string;
  currentThought?: string;
}) {
  const [allowMotion, setAllowMotion] = useState(true);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const gradientId = useId();
  const color = glowColor;
  const nodes = getNodePositions(42);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAllowMotion(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (currentThought) return;
    const interval = setInterval(() => {
      setThoughtIndex((i) => (i + 1) % DEFAULT_THOUGHTS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [currentThought]);

  const displayThought = currentThought ?? DEFAULT_THOUGHTS[thoughtIndex];
  const sweepDuration = 4 - pulse * 2;

  // Resolve thought index for detection mapping (which nodes are "scanning")
  const resolvedIndex =
    currentThought != null
      ? DEFAULT_THOUGHTS.indexOf(currentThought)
      : thoughtIndex;
  const activeIndex = resolvedIndex >= 0 ? resolvedIndex : 0;
  // Nodes 0–1: Policy, 2–3: Sentiment, 4–5: ID, 6–7: Transcript; Compliance reuses 0–1
  const detectingNodeStart = (activeIndex % 5) * 2;
  const isDetecting = (i: number) =>
    i === detectingNodeStart || i === detectingNodeStart + 1;

  const getNodeColor = (i: number) =>
    isDetecting(i) ? NODE_DETECTING_COLOR : NODE_BASE_COLORS[i];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-[var(--orb-surface-bg)] ${className ?? ""} ${allowMotion ? "thought-radar-animate" : ""}`}
      aria-label={`Agent thought process: ${displayThought}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,_color-mix(in_srgb,var(--audit-cyan)_18%,transparent),transparent_70%)]" />
      <div className="relative flex h-full w-full items-center justify-center p-4">
        <div className="relative h-52 w-52" style={{ color }}>
          {/* Concentric rings */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <defs>
              <radialGradient id={`sweep-fade-${gradientId}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.06" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            {[1, 2, 3, 4].map((r) => (
              <circle
                key={r}
                cx="50"
                cy="50"
                r={8 + r * 10}
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.25"
              />
            ))}
            {/* Radar sweep - rotating wedge with fade-out from center */}
            <g className="radar-sweep origin-center" style={{ transformOrigin: "50px 50px" }}>
              <path
                d="M 50 50 L 50 3 A 47 47 0 0 1 97 50 Z"
                fill={`url(#sweep-fade-${gradientId})`}
              />
            </g>
            {/* Pulsing nodes around the circle */}
            {nodes.map((pos, i) => (
              <g key={i} className="radar-node">
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="2.5"
                  fill={getNodeColor(i)}
                  opacity={isDetecting(i) ? 1 : 0.85}
                />
              </g>
            ))}
          </svg>
          {/* Center thought label */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-center text-[10px] font-semibold uppercase tracking-wider text-black"
              style={{
                textShadow: `0 0 8px ${color}80, 0 0 2px rgba(255,255,255,0.5)`,
              }}
            >
              {displayThought}
            </span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .radar-sweep {
          animation: radar-sweep ${sweepDuration}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .radar-sweep {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
