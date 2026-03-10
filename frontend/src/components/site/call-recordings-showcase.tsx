"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Circle, Pause, Play, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { callRecordings, type CallRecording } from "@/lib/content/call-recordings";

/** Normalized shape for player/transcript — works with main recording or followUp + parent scenario */
type PlayableRecording = Pick<
  CallRecording,
  "label" | "durationLabel" | "outcome" | "outcomePositive" | "transcript"
> & { scenario: string };

const SCENARIO_LABELS: Record<string, string> = {
  sales: "Sales",
  support: "Support",
  collections: "Collections",
};

const BAR_COUNT = 28;
const BAR_DELAYS = Array.from({ length: BAR_COUNT }, (_, i) =>
  ((i * 137.5) % 1000).toFixed(0),
);
const BAR_DURATIONS = Array.from({ length: BAR_COUNT }, (_, i) =>
  (700 + ((i * 113) % 600)).toFixed(0),
);
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const h = 18 + ((i * 79 + 13) % 38);
  return h;
});

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseDuration(label: string): number {
  const [m, s] = label.split(":").map(Number);
  return (m ?? 0) * 60 + (s ?? 0);
}

interface WaveformProps {
  playing: boolean;
}

function Waveform({ playing }: WaveformProps) {
  return (
    <div
      className="flex items-center gap-[2px]"
      aria-hidden="true"
      style={{ height: 48 }}
    >
      {BAR_HEIGHTS.map((h, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: 3,
            height: h,
            backgroundColor: "var(--audit-cyan)",
            opacity: playing ? 0.85 : 0.28,
            animationName: playing ? "waveform-pulse" : "none",
            animationDuration: `${BAR_DURATIONS[i]}ms`,
            animationDelay: `${BAR_DELAYS[i]}ms`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDirection: "alternate",
            transition: "opacity 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

interface PlayerCardProps {
  recording: PlayableRecording;
  playing: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onSeek: (t: number) => void;
}

function PlayerCard({ recording, playing, currentTime, onPlayPause, onSeek }: PlayerCardProps) {
  const duration = parseDuration(recording.durationLabel);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="surface-card flex flex-col gap-5 rounded-2xl p-6">
      <div className="space-y-1">
        <span
          className="text-caption inline-block rounded-full px-2.5 py-0.5 font-medium uppercase tracking-[0.12em]"
          style={{
            background: "rgba(19,182,255,0.12)",
            color: "var(--audit-cyan)",
          }}
        >
          {SCENARIO_LABELS[recording.scenario]}
        </span>
        <h3 className="text-body font-semibold text-[var(--text-primary)]">
          {recording.label}
        </h3>
        <div className="text-label flex items-center gap-3 text-[var(--text-muted)]">
          <span>{recording.durationLabel}</span>
          <span className="opacity-40">·</span>
          <span className="flex items-center gap-1">
            {recording.outcomePositive ? (
              <CheckCircle2 className="h-3 w-3" style={{ color: "var(--audit-cyan)" }} />
            ) : (
              <TrendingDown className="h-3 w-3 text-[var(--warning-amber)]" />
            )}
            {recording.outcome}
          </span>
        </div>
      </div>

      <Waveform playing={playing} />

      <div className="space-y-2">
        <div
          className="relative h-1.5 w-full cursor-pointer overflow-hidden rounded-full"
          style={{ background: "rgba(19,182,255,0.15)" }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onSeek(Math.max(0, Math.min(1, ratio)) * duration);
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100"
            style={{
              width: `${progress}%`,
              background: "var(--audit-cyan)",
            }}
          />
        </div>
        <div className="text-label flex items-center justify-between text-[var(--text-muted)]">
          <span>{formatTime(currentTime)}</span>
          <span>{recording.durationLabel}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onPlayPause}
        className="flex h-11 w-11 items-center justify-center self-start rounded-full transition-transform active:scale-95"
        style={{
          background: "var(--audit-cyan)",
          color: "#03050c",
          boxShadow: "0 0 28px rgba(19,182,255,0.35)",
        }}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
      </button>
    </div>
  );
}

interface TranscriptPanelProps {
  recording: PlayableRecording;
  currentTime: number;
}

function TranscriptPanel({ recording, currentTime }: TranscriptPanelProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  const activeIdx = recording.transcript.findLastIndex(
    (u) => u.startTime <= currentTime,
  );

  useEffect(() => {
    if (activeIdx > 0 && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [activeIdx]);

  return (
    <div
      className="surface-card flex flex-col gap-1 overflow-hidden rounded-2xl"
      style={{ minHeight: 320 }}
    >
      <div
        className="text-caption border-b px-5 py-3 font-medium uppercase tracking-[0.12em]"
        style={{
          borderColor: "rgba(19,182,255,0.18)",
          color: "var(--audit-cyan)",
          background: "rgba(19,182,255,0.04)",
        }}
      >
        Live Transcript
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto px-4 py-4" style={{ maxHeight: 380 }}>
        {recording.transcript.map((utterance, idx) => {
          const revealed = utterance.startTime <= currentTime;
          const isActive =
            utterance.startTime <= currentTime && currentTime < utterance.endTime;
          const isAgent = utterance.speaker === "agent";

          return (
            <div
              key={idx}
              ref={isActive ? activeRef : undefined}
              className={cn(
                "text-body rounded-xl px-3.5 py-2.5 leading-relaxed transition-all duration-500",
                revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none",
                isActive && isAgent && "backdrop-blur-xl",
              )}
              style={{
                background: isActive
                  ? isAgent
                    ? "rgba(19,182,255,0.14)"
                    : "rgba(15,23,42,0.08)"
                  : isAgent
                    ? "rgba(19,182,255,0.08)"
                    : "var(--surface-muted-bg)",
                backdropFilter: isAgent ? "blur(12px) saturate(1.15)" : undefined,
                WebkitBackdropFilter: isAgent ? "blur(12px) saturate(1.15)" : undefined,
                border: isAgent ? "1px solid rgba(19,182,255,0.22)" : undefined,
                borderLeft: isActive && isAgent
                  ? "2.5px solid var(--audit-cyan)"
                  : isActive
                    ? "2.5px solid transparent"
                    : isAgent
                      ? "2.5px solid rgba(19,182,255,0.18)"
                      : "2.5px solid transparent",
                boxShadow: isAgent
                  ? "0 4px 24px rgba(19,182,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12)"
                  : undefined,
                color: "var(--text-primary)",
              }}
            >
              <span
                className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  color: isAgent ? "var(--audit-cyan)" : "var(--text-muted)",
                }}
              >
                {isAgent ? "AI Agent" : "Customer"}
              </span>
              {utterance.text}
            </div>
          );
        })}
        {recording.transcript.every((u) => u.startTime > currentTime) && (
          <div className="text-body flex items-center gap-2 px-1 py-6 text-[var(--text-muted)]">
            <Circle className="h-3.5 w-3.5 animate-pulse" style={{ color: "var(--audit-cyan)" }} />
            Press play to see the conversation unfold in real time
          </div>
        )}
      </div>
    </div>
  );
}

export function CallRecordingsShowcase() {
  const [activeId, setActiveId] = useState<string>(callRecordings[0]!.id);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const recording = callRecordings.find((r) => r.id === activeId) ?? callRecordings[0]!;
  const hasFollowUp = Boolean(recording.followUp);
  const useFollowUp = hasFollowUp && isFollowUp;

  const effectiveRecording: PlayableRecording = useFollowUp && recording.followUp
    ? { ...recording.followUp, scenario: recording.scenario }
    : recording;
  const effectiveAudioSrc = useFollowUp && recording.followUp
    ? recording.followUp.audioSrc
    : recording.audioSrc;

  const switchRecording = (id: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setCurrentTime(0);
    setIsFollowUp(false);
    setActiveId(id);
  };

  const switchFollowUp = (followUp: boolean) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setCurrentTime(0);
    setIsFollowUp(followUp);
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => { });
    }
  };

  const handleSeek = (t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <>
      <style>{`
        @keyframes waveform-pulse {
          0%   { transform: scaleY(0.35); }
          100% { transform: scaleY(1); }
        }
      `}</style>

      <audio
        key={effectiveAudioSrc}
        ref={audioRef}
        src={effectiveAudioSrc}
        preload="none"
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrentTime(0); }}
      />

      <div
        className="rounded-2xl border px-6 py-8 sm:px-8"
        style={{
          background: "rgba(19,182,255,0.03)",
          borderColor: "rgba(19,182,255,0.14)",
        }}
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <p
              className="text-caption font-semibold uppercase tracking-[0.18em]"
              style={{ color: "var(--audit-cyan)" }}
            >
              Real Calls
            </p>
            <h2 className="section-title font-semibold text-[var(--text-primary)]">
              Hear Our AI in Action
            </h2>
            <p className="section-copy max-w-xl">
              Live outbound calls handled autonomously by Audatec AI Relationship Managers — across sales, support, and collections.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            {callRecordings.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => switchRecording(r.id)}
                className="text-label rounded-full px-3.5 py-1.5 font-medium transition-all"
                style={
                  r.id === activeId
                    ? {
                      background: "var(--audit-cyan)",
                      color: "#03050c",
                      boxShadow: "0 0 18px rgba(19,182,255,0.30)",
                    }
                    : {
                      background: "rgba(19,182,255,0.09)",
                      color: "var(--text-secondary)",
                      border: "1px solid rgba(19,182,255,0.18)",
                    }
                }
              >
                {SCENARIO_LABELS[r.scenario]}
              </button>
            ))}
          </div>
        </div>

        {hasFollowUp && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-label text-[var(--text-muted)]">Call:</span>
            <div className="flex rounded-full p-0.5" style={{ background: "rgba(19,182,255,0.08)" }}>
              <button
                type="button"
                onClick={() => switchFollowUp(false)}
                className={cn(
                  "text-label rounded-full px-3 py-1 font-medium transition-all",
                  !isFollowUp && "text-[#03050c]",
                )}
                style={
                  !isFollowUp
                    ? { background: "var(--audit-cyan)", boxShadow: "0 0 12px rgba(19,182,255,0.25)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                Initial
              </button>
              <button
                type="button"
                onClick={() => switchFollowUp(true)}
                className={cn(
                  "text-label rounded-full px-3 py-1 font-medium transition-all",
                  isFollowUp && "text-[#03050c]",
                )}
                style={
                  isFollowUp
                    ? { background: "var(--audit-cyan)", boxShadow: "0 0 12px rgba(19,182,255,0.25)" }
                    : { color: "var(--text-secondary)" }
                }
              >
                Follow-up (1 week later)
              </button>
            </div>
            <span className="text-label text-[var(--text-muted)]">
              — Agent speaks with context from previous calls
            </span>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
          <PlayerCard
            recording={effectiveRecording}
            playing={playing}
            currentTime={currentTime}
            onPlayPause={handlePlayPause}
            onSeek={handleSeek}
          />
          <TranscriptPanel recording={effectiveRecording} currentTime={currentTime} />
        </div>
      </div>
    </>
  );
}
