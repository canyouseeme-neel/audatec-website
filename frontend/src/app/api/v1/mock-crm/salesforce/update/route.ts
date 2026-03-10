import { NextResponse } from "next/server";

import {
  allowMockFallback,
  backendMissingResponse,
  parseRequestPayload,
  proxyToBackend,
} from "@/app/api/_proxy";

export async function POST(request: Request) {
  const payload = await parseRequestPayload(request);

  const proxied = await proxyToBackend("/api/v1/mock-crm/salesforce/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (proxied) {
    return proxied;
  }

  if (!allowMockFallback) {
    return backendMissingResponse("/api/v1/mock-crm/salesforce/update");
  }

  return NextResponse.json(
    {
      provider: "mock-salesforce",
      status: "updated",
      external_id: `sf-${Math.random().toString(36).slice(2, 10)}`,
      received: payload.entities ?? {},
      mocked: true,
    },
    { status: 200 },
  );
}
