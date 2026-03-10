import { NextResponse } from "next/server";

import { demoStore } from "@/app/api/v1/_store";
import {
  allowMockFallback,
  backendMissingResponse,
  parseRequestPayload,
  proxyToBackend,
} from "@/app/api/_proxy";

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: Context) {
  const { sessionId } = await context.params;
  const payload = await parseRequestPayload(request);

  const proxied = await proxyToBackend(`/api/v1/sessions/${sessionId}/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (proxied) {
    return proxied;
  }

  if (!allowMockFallback) {
    return backendMissingResponse("/api/v1/sessions/[sessionId]/end");
  }

  const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
  const allText = transcript.map((entry: { text?: string }) => entry.text ?? "").join(" ");
  const required = ["interest", "lock-in", "consent"];
  const missing = required.filter((term) => !allText.toLowerCase().includes(term));
  demoStore.reports[sessionId] = {
    session_id: sessionId,
    generated_at: new Date().toISOString(),
    summary: {
      total_segments: transcript.length,
      risk_score: missing.length * 12 + 10,
    },
    compliance: {
      missing_disclosures: missing,
      passed: missing.length === 0,
    },
  };

  return NextResponse.json(
    {
      session_id: sessionId,
      ended_at: new Date().toISOString(),
      audit_report_ready: true,
    },
    { status: 200 },
  );
}
