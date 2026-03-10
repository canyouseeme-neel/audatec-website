"use client";

import {
  BarVisualizer,
  RoomAudioRenderer,
  SessionProvider,
  StartAudio,
  useAgent,
  useSession,
} from "@livekit/components-react";
import {
  ConnectionState,
  RoomEvent,
  TokenSource,
  Track,
  type Participant,
} from "livekit-client";
import { AlertCircle, CircleCheck, Mic2, Radio } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AudatecOrb } from "@/components/site/audatec-orb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrackVolume } from "@/hooks/useTrackVolume";
import { useEmotionVector } from "@/hooks/demo/use-emotion-vector";
import { isSentimentEnabled } from "@/lib/feature-flags";
import { extractCrmTags, type CrmTag } from "@/lib/demo/crm-tags";
import { audatecPersonas } from "@/lib/demo/personas";

import { CommandCenterHeader } from "./command-center-header";
import { LiveAuditPanel } from "./live-audit-panel";
import { LiveWaveform } from "./live-waveform";
import { SentimentPulseTimeline } from "./sentiment-pulse-timeline";

type TranscriptRow = {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
};

const endpoints = {
  sessionStart: "/api/v1/sessions/start",
  sessionEnd: (sessionId: string) => `/api/v1/sessions/${sessionId}/end`,
  postCall: "/api/v1/post-call/process",
  auditReport: (sessionId: string) => `/api/v1/sessions/${sessionId}/audit-report`,
};

type RoomWithTranscriptionEvent = {
  on: (
    event: "transcriptionReceived",
    callback: (segments: Array<Record<string, unknown>>) => void,
  ) => void;
  off: (
    event: "transcriptionReceived",
    callback: (segments: Array<Record<string, unknown>>) => void,
  ) => void;
};

const readJsonSafe = async (response: Response): Promise<Record<string, unknown>> => {
  try {
    const parsed = await response.json();
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Ignore non-JSON responses and return empty payload.
  }
  return {};
};

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await readJsonSafe(response);
  if (!response.ok) {
    const message =
      String(data.detail ?? data.message ?? "").trim() ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as T;
}

export function CommandCenter() {
  const [selectedPersonaId, setSelectedPersonaId] = useState(audatecPersonas[0].id);
  const [transcript, setTranscript] = useState<TranscriptRow[]>([]);
  const [crmTags, setCrmTags] = useState<CrmTag[]>([]);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<Track | undefined>();
  const [demoSessionId, setDemoSessionId] = useState<string | null>(null);
  const [auditMessage, setAuditMessage] = useState<string>("Waiting for session.");
  const [postCallInsights, setPostCallInsights] = useState<string[]>([]);
  const [requestError, setRequestError] = useState<string | null>(null);

  const selectedPersona =
    audatecPersonas.find((persona) => persona.id === selectedPersonaId) || audatecPersonas[0];
  const latestTranscriptText = transcript[transcript.length - 1]?.text;
  const trackVolume = useTrackVolume(remoteAudioTrack);
  const emotionVector = useEmotionVector(latestTranscriptText, trackVolume);

  const tokenSource = useMemo(
    () => TokenSource.endpoint("/api/livekit/token"),
    [],
  );
  const tokenFetchOptions = useMemo(
    () => ({
      agentName: selectedPersona.agentName,
      agentMetadata: JSON.stringify(selectedPersona.metadata),
    }),
    [selectedPersona],
  );

  const session = useSession(tokenSource, tokenFetchOptions);
  const { connectionState } = session;
  const agent = useAgent(session);
  const prevConnectionStateRef = useRef(connectionState);

  const appendTranscript = useCallback((speaker: string, text: string, timestamp?: number) => {
    const cleaned = text.trim();
    if (!cleaned) {
      return;
    }
    setTranscript((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${prev.length}`,
        speaker: speaker || "agent",
        text: cleaned,
        timestamp: timestamp ?? Date.now() / 1000,
      },
    ]);
  }, []);

  const refreshRemoteAudioTrack = useCallback(() => {
    let foundTrack: Track | undefined;
    for (const participant of Array.from(session.room.remoteParticipants.values())) {
      for (const publication of Array.from(participant.trackPublications.values())) {
        if (publication.track?.kind === Track.Kind.Audio) {
          foundTrack = publication.track;
          break;
        }
      }
      if (foundTrack) {
        break;
      }
    }
    setRemoteAudioTrack(foundTrack);
  }, [session.room.remoteParticipants]);

  useEffect(() => {
    const decoder = new TextDecoder();
    const room = session.room;
    const handleData = (payload: Uint8Array, participant?: Participant) => {
      const text = decoder.decode(payload);
      appendTranscript(participant?.identity ?? "agent", text);
    };

    const handleTranscription = (segments: Array<Record<string, unknown>>) => {
      segments.forEach((segment) => {
        const text = String(segment.text ?? "");
        const speaker = String(segment.participantIdentity ?? "agent");
        const startTime = Number(segment.startTime ?? Date.now() / 1000);
        appendTranscript(speaker, text, startTime);
      });
    };
    const roomWithTranscription = room as unknown as RoomWithTranscriptionEvent;

    room.on(RoomEvent.DataReceived, handleData);
    roomWithTranscription.on("transcriptionReceived", handleTranscription);
    room.on(RoomEvent.TrackSubscribed, refreshRemoteAudioTrack);
    room.on(RoomEvent.TrackUnsubscribed, refreshRemoteAudioTrack);
    room.on(RoomEvent.ParticipantConnected, refreshRemoteAudioTrack);
    room.on(RoomEvent.ParticipantDisconnected, refreshRemoteAudioTrack);

    refreshRemoteAudioTrack();

    return () => {
      room.off(RoomEvent.DataReceived, handleData);
      roomWithTranscription.off("transcriptionReceived", handleTranscription);
      room.off(RoomEvent.TrackSubscribed, refreshRemoteAudioTrack);
      room.off(RoomEvent.TrackUnsubscribed, refreshRemoteAudioTrack);
      room.off(RoomEvent.ParticipantConnected, refreshRemoteAudioTrack);
      room.off(RoomEvent.ParticipantDisconnected, refreshRemoteAudioTrack);
    };
  }, [appendTranscript, refreshRemoteAudioTrack, session.room]);

  useEffect(() => {
    if (transcript.length === 0) {
      return;
    }
    const last = transcript[transcript.length - 1];
    const newTags = extractCrmTags(
      last.text,
      transcript.map((entry) => entry.text),
      selectedPersona.metadata.complianceChecklist,
    );
    if (newTags.length === 0) {
      return;
    }
    setCrmTags((prev) => {
      const next = [...newTags, ...prev];
      const deduped = new Map(next.map((tag) => [tag.id, tag]));
      return Array.from(deduped.values()).slice(0, 25);
    });
  }, [selectedPersona.metadata.complianceChecklist, transcript]);

  const startDemoSession = useCallback(async () => {
    if (demoSessionId) {
      return;
    }

    setRequestError(null);

    try {
      const json = await postJson<{ session_id?: string }>(endpoints.sessionStart, {
        persona: selectedPersona.id,
        channel: "voice",
        metadata: selectedPersona.metadata,
      });
      if (!json.session_id) {
        throw new Error("Session start response did not include session_id.");
      }
      setDemoSessionId(json.session_id);
      setAuditMessage("Session started. Audit tracker active.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to start demo session.";
      setRequestError(message);
      setAuditMessage("Unable to start session. Please verify backend connectivity.");
    }
  }, [demoSessionId, selectedPersona]);

  const finalizeDemoSession = useCallback(async () => {
    if (!demoSessionId) {
      return;
    }
    const simplified = transcript.map((line) => ({
      speaker: line.speaker,
      text: line.text,
      timestamp: line.timestamp,
    }));

    setRequestError(null);

    try {
      await postJson(endpoints.sessionEnd(demoSessionId), {
        transcript: simplified,
        metadata: selectedPersona.metadata,
      });

      const processed = await postJson<{
        crm?: { external_id?: string };
        emotion_timeline?: Array<{ timestamp: number; emotion: string; topic?: string }>;
        compliance_alerts?: Array<{ severity: string; message: string }>;
      }>(endpoints.postCall, {
        session_id: demoSessionId,
        transcript: simplified,
        persona: selectedPersona.id,
      });

      const crmExternalId = processed.crm?.external_id;
      if (crmExternalId) {
        setAuditMessage(`CRM updated: ${crmExternalId}`);
        setCrmTags((prev) => [
          {
            id: `crm-${crmExternalId}`,
            key: "Next Steps",
            value: `CRM sync complete (${crmExternalId})`,
            status: "success",
          },
          ...prev,
        ]);
      } else {
        setAuditMessage("Session complete. Post-call insights generated.");
      }

      const insightRows: string[] = [];
      for (const point of processed.emotion_timeline ?? []) {
        if (point.emotion === "hesitation" && point.topic) {
          insightRows.push(
            `At ${Math.round(point.timestamp)}s, client showed hesitation around "${point.topic}".`,
          );
        }
      }
      for (const alert of processed.compliance_alerts ?? []) {
        insightRows.push(`${alert.severity.toUpperCase()}: ${alert.message}`);
      }

      try {
        const reportResponse = await fetch(endpoints.auditReport(demoSessionId), {
          method: "GET",
          cache: "no-store",
        });
        if (reportResponse.ok) {
          const report = await readJsonSafe(reportResponse);
          const summary = report.summary as Record<string, unknown> | undefined;
          if (summary?.risk_score != null) {
            insightRows.unshift(`Audit risk score: ${summary.risk_score}`);
          }
        }
      } catch {
        // Non-blocking call used for additional insight only.
      }

      setPostCallInsights(insightRows.slice(0, 6));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to finalize demo session.";
      setRequestError(message);
      setAuditMessage("Post-call processing failed. Please retry after reconnect.");
    } finally {
      setDemoSessionId(null);
    }
  }, [demoSessionId, selectedPersona, transcript]);

  useEffect(() => {
    const prevState = prevConnectionStateRef.current;
    const connectedNow =
      prevState !== ConnectionState.Connected &&
      connectionState === ConnectionState.Connected;
    const disconnectedNow =
      prevState === ConnectionState.Connected &&
      connectionState === ConnectionState.Disconnected;

    if (connectedNow) {
      startDemoSession();
    } else if (disconnectedNow) {
      void finalizeDemoSession();
    }

    prevConnectionStateRef.current = connectionState;
  }, [connectionState, finalizeDemoSession, startDemoSession]);

  const onConnectToggle = () => {
    if (connectionState === ConnectionState.Disconnected) {
      session.start();
    } else if (connectionState === ConnectionState.Connected) {
      session.end();
    }
  };

  const injectSampleTranscript = () => {
    appendTranscript(
      "agent",
      "Client mentions budget INR 500000 and asks about lock-in period before proceeding with a home loan.",
    );
  };

  return (
    <SessionProvider session={session}>
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8">
        <CommandCenterHeader
          personas={audatecPersonas}
          selectedPersonaId={selectedPersona.id}
          onSelectPersona={setSelectedPersonaId}
          onConnectToggle={onConnectToggle}
          connectionState={connectionState}
        />

        {requestError && (
          <div className="surface-muted flex items-start gap-2 rounded-xl border border-[var(--warning-amber)]/45 bg-[color:var(--warning-amber)]/10 p-3 text-sm text-[var(--warning-amber)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{requestError}</p>
          </div>
        )}

        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <Radio className="h-4 w-4 text-audit" />
                    Live Session Surface
                  </span>
                  <Badge
                    variant={
                      connectionState === ConnectionState.Connected
                        ? "default"
                        : "secondary"
                    }
                  >
                    {connectionState}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <AudatecOrb
                  className="h-[250px] w-full"
                  pulse={0.2 + emotionVector.intensity * 0.7}
                  glowColor={emotionVector.color}
                  currentThought={
                    connectionState === ConnectionState.Connected
                      ? isSentimentEnabled
                        ? emotionVector.state === "confidence"
                          ? "Analyzing Sentiment"
                          : emotionVector.state === "hesitation"
                            ? "Checking Policy"
                            : "Processing Transcript"
                        : "Processing Transcript"
                      : connectionState === ConnectionState.Connecting
                        ? "Verifying ID"
                        : "Initializing..."
                  }
                />
                <div className="space-y-3 text-sm">
                  <div className="surface-muted p-3 text-soft">
                    <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-white/55">
                      <Mic2 className="h-3.5 w-3.5 text-audit" />
                      Session status
                    </p>
                    <p className="mt-2">{auditMessage}</p>
                    {demoSessionId && (
                      <p className="mt-1 text-xs text-white/45">Session: {demoSessionId}</p>
                    )}
                  </div>
                  <div className="surface-muted p-3 text-soft">
                    <p className="text-xs uppercase tracking-[0.13em] text-white/55">
                      Persona
                    </p>
                    <p className="mt-2 font-medium text-white">{selectedPersona.label}</p>
                    <p className="mt-1 text-xs text-white/50">{selectedPersona.metadata.posture}</p>
                  </div>
                  {isSentimentEnabled && (
                    <div className="surface-muted p-3 text-soft">
                      <p className="text-xs uppercase tracking-[0.13em] text-white/55">
                        Live emotion state
                      </p>
                      <p className="mt-2">
                        {emotionVector.state} ({emotionVector.intensity.toFixed(2)})
                      </p>
                    </div>
                  )}
                  <Button onClick={injectSampleTranscript} variant="secondary" size="sm">
                    Inject sample transcript event
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Frequency Waveform</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <LiveWaveform track={remoteAudioTrack} />
                <div className="surface-muted p-2">
                  <BarVisualizer
                    state={agent.state}
                    track={agent.microphoneTrack}
                    barCount={16}
                    options={{ minHeight: 5 }}
                    className="[--lk-fg:var(--audit-green)] [--lk-va-bar-gap:3px] [--lk-va-bar-width:6px]"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Real-time Transcript</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="surface-muted max-h-[340px] space-y-2 overflow-y-auto p-3 text-sm">
                  {transcript.length === 0 && (
                    <p className="text-white/45">Transcript stream will appear here.</p>
                  )}
                  {transcript.map((line) => (
                    <div key={line.id} className="rounded-md border border-white/10 bg-black/25 px-3 py-2">
                      <p className="text-xs uppercase tracking-wide text-audit">
                        {line.speaker}
                      </p>
                      <p className="mt-1 text-white/80">{line.text}</p>
                    </div>
                  ))}
                </div>
                {isSentimentEnabled && (
                  <SentimentPulseTimeline
                    transcript={transcript}
                    complianceTerms={selectedPersona.metadata.complianceChecklist}
                  />
                )}
                {postCallInsights.length > 0 && (
                  <div className="surface-muted p-3 text-xs text-soft">
                    <p className="mb-2 uppercase tracking-widest text-white/55">
                      Emotion Aggregation
                    </p>
                    <div className="space-y-1">
                      {postCallInsights.map((insight, index) => (
                        <p key={`${insight}-${index}`}>{insight}</p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <LiveAuditPanel
            tags={crmTags}
            loading={connectionState !== ConnectionState.Disconnected}
          />
        </div>

        <RoomAudioRenderer />
        <div className="inline-flex">
          <StartAudio label="Enable playback" />
        </div>
        {connectionState === ConnectionState.Connected && (
          <p className="inline-flex items-center gap-2 text-xs text-audit">
            <CircleCheck className="h-3.5 w-3.5" />
            Live room connected and receiving events.
          </p>
        )}
      </div>
    </SessionProvider>
  );
}
