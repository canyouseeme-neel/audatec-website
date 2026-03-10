import { NextResponse } from "next/server";

import { demoStore } from "@/app/api/v1/_store";
import {
  allowMockFallback,
  backendMissingResponse,
  parseRequestPayload,
  proxyToBackend,
} from "@/app/api/_proxy";

export async function POST(request: Request) {
  const payload = await parseRequestPayload(request);
  const proxied = await proxyToBackend("/api/v1/sessions/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (proxied) {
    return proxied;
  }

  if (!allowMockFallback) {
    return backendMissingResponse("/api/v1/sessions/start");
  }

  const persona = String(payload.persona ?? "bfsi-audit");
  const channel = String(payload.channel ?? "voice");
  const metadata =
    payload.metadata && typeof payload.metadata === "object"
      ? (payload.metadata as Record<string, unknown>)
      : {};

  const sessionId = `demo-${Math.random().toString(36).slice(2, 10)}`;
  const startedAt = new Date().toISOString();
  demoStore.sessions[sessionId] = {
    sessionId,
    persona,
    channel,
    metadata,
    startedAt,
  };

  return NextResponse.json(
    {
      session_id: sessionId,
      started_at: startedAt,
      persona,
      mocked: true,
    },
    { status: 200 },
  );
}
