import { NextResponse } from "next/server";

import {
  allowMockFallback,
  backendMissingResponse,
  parseRequestPayload,
  proxyToBackend,
} from "@/app/api/_proxy";

const budgetRegex = /(budget|limit|ticket)\s*(is|around|about|=|:)?\s*(₹|inr|rs\.?)?\s*([\d,]+)/i;
const productRegex = /(loan|card|overdraft|insurance|term plan|credit line)/i;
const nextStepsRegex = /(follow up|callback|call back|send docs|share statement|kyc)/i;

const deriveSentiment = (text: string) => {
  const lowered = text.toLowerCase();
  const negative = ["hesitant", "concern", "not sure", "expensive", "lock-in"].some((word) =>
    lowered.includes(word),
  );
  const positive = ["great", "good", "interested", "approved", "okay"].some((word) =>
    lowered.includes(word),
  );
  if (negative && !positive) return "negative";
  if (positive && !negative) return "positive";
  return "neutral";
};

export async function POST(request: Request) {
  const payload = await parseRequestPayload(request);

  const proxied = await proxyToBackend("/api/v1/post-call/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (proxied) {
    return proxied;
  }

  if (!allowMockFallback) {
    return backendMissingResponse("/api/v1/post-call/process");
  }

  const transcript = Array.isArray(payload.transcript) ? payload.transcript : [];
  const transcriptText = transcript.map((entry: { text?: string }) => entry.text ?? "").join(" ");

  const budgetMatch = transcriptText.match(budgetRegex);
  const productMatch = transcriptText.match(productRegex);
  const nextStepMatch = transcriptText.match(nextStepsRegex);

  const entities = {
    budget: budgetMatch?.[4]?.replace(/,/g, "") ?? null,
    product_interest: productMatch?.[1] ?? null,
    sentiment: deriveSentiment(transcriptText),
    next_steps: nextStepMatch?.[1] ?? null,
  };

  return NextResponse.json(
    {
      session_id: payload.session_id,
      entities,
      crm: {
        provider: "mock-salesforce",
        status: "updated",
        external_id: `sf-${Math.random().toString(36).slice(2, 10)}`,
        received: entities,
      },
    },
    { status: 200 },
  );
}
