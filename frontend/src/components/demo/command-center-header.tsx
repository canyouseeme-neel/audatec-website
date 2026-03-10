"use client";

import { ConnectionState } from "livekit-client";
import { Mic, MicOff, Radio } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AudatecPersona } from "@/lib/demo/personas";

export function CommandCenterHeader({
  personas,
  selectedPersonaId,
  onSelectPersona,
  onConnectToggle,
  connectionState,
}: {
  personas: AudatecPersona[];
  selectedPersonaId: string;
  onSelectPersona: (personaId: string) => void;
  onConnectToggle: () => void;
  connectionState: ConnectionState;
}) {
  const connected = connectionState === ConnectionState.Connected;
  const connecting = connectionState === ConnectionState.Connecting;
  const statusLabel = connecting
    ? "connecting"
    : connected
      ? "connected"
      : "standby";

  return (
    <header className="glass-panel flex flex-col gap-4 rounded-xl border border-white/15 p-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">
          Audatec Command Center
        </p>
        <h1 className="text-lg font-semibold text-white sm:text-xl">
          BFSI Voice + Audit Demonstration
        </h1>
        <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/65">
          <Radio className="h-3.5 w-3.5 text-audit" />
          {statusLabel}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedPersonaId}
          onChange={(event) => onSelectPersona(event.target.value)}
          className="rounded-md border border-white/20 bg-black/50 px-3 py-2 text-sm text-white focus-visible:border-[var(--audit-green)] focus-visible:outline-none"
          disabled={connected || connecting}
        >
          {personas.map((persona) => (
            <option key={persona.id} value={persona.id}>
              {persona.label}
            </option>
          ))}
        </select>
        <Button
          onClick={onConnectToggle}
          disabled={connecting}
          variant={connected ? "warning" : "default"}
          className="min-w-[130px]"
        >
          {connecting ? (
            "Connecting..."
          ) : connected ? (
            <>
              <MicOff className="h-3.5 w-3.5" />
              Disconnect
            </>
          ) : (
            <>
              <Mic className="h-3.5 w-3.5" />
              Connect
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
