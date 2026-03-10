import { NextResponse } from "next/server";

import { demoStore } from "@/app/api/v1/_store";
import {
  allowMockFallback,
  backendMissingResponse,
  proxyToBackend,
} from "@/app/api/_proxy";

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { sessionId } = await context.params;

  const proxied = await proxyToBackend(`/api/v1/sessions/${sessionId}/audit-report`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (proxied) {
    return proxied;
  }

  if (!allowMockFallback) {
    return backendMissingResponse("/api/v1/sessions/[sessionId]/audit-report");
  }

  return NextResponse.json(
    demoStore.reports[sessionId] || {
      session_id: sessionId,
      status: "pending",
    },
    { status: 200 },
  );
}
