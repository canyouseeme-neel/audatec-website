import { NextResponse } from "next/server";

const backendUrl = (process.env.BACKEND_URL ?? "").trim();

export const hasBackendUrl = backendUrl.length > 0;
export const allowMockFallback = process.env.NODE_ENV !== "production";

const readResponsePayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  const text = await response.text();
  return text ? { message: text } : {};
};

export const parseRequestPayload = async (request: Request): Promise<Record<string, unknown>> => {
  try {
    const payload = await request.json();
    if (payload && typeof payload === "object") {
      return payload as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
};

export const backendMissingResponse = (routeLabel: string) =>
  NextResponse.json(
    {
      message: `BACKEND_URL is not configured for ${routeLabel}.`,
    },
    { status: 503 },
  );

export const backendNetworkErrorResponse = () =>
  NextResponse.json(
    {
      message: "Unable to reach backend service.",
    },
    { status: 502 },
  );

export const proxyToBackend = async (
  path: string,
  init?: RequestInit & { cache?: RequestCache },
) => {
  if (!hasBackendUrl) {
    return null;
  }

  try {
    const response = await fetch(`${backendUrl}${path}`, init);
    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return backendNetworkErrorResponse();
  }
};
