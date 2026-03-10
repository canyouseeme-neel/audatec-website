import { NextResponse } from "next/server";

import {
  allowMockFallback,
  backendMissingResponse,
  parseRequestPayload,
  proxyToBackend,
} from "@/app/api/_proxy";

export async function POST(request: Request) {
  const payload = await parseRequestPayload(request);
  const proxied = await proxyToBackend("/api/v1/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (proxied) {
    return proxied;
  }

  if (!allowMockFallback) {
    return backendMissingResponse("/api/contacts");
  }

  const now = new Date().toISOString();
  return NextResponse.json(
    {
      lead_id: `lead-${Math.random().toString(36).slice(2, 10)}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone ?? null,
      company: payload.company ?? null,
      message: payload.message,
      source: payload.source ?? "website-contact",
      created_at: now,
      mocked: true,
    },
    { status: 201 },
  );
}
