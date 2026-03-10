import crypto from "node:crypto";

import { RoomConfiguration } from "@livekit/protocol";
import { AccessToken } from "livekit-server-sdk";
import { NextResponse } from "next/server";

import { parseRequestPayload, proxyToBackend } from "@/app/api/_proxy";

type TokenRequest = {
  room_name: string;
  participant_identity: string;
  participant_name?: string;
  participant_metadata?: string;
  participant_attributes?: Record<string, string>;
  room_config?: ReturnType<RoomConfiguration["toJson"]>;
};

async function createToken(request: TokenRequest) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: request.participant_identity,
      ttl: "10m",
    },
  );

  at.addGrant({
    roomJoin: true,
    room: request.room_name,
    canUpdateOwnMetadata: true,
  });

  if (request.participant_name) {
    at.name = request.participant_name;
  }
  if (request.participant_metadata) {
    at.metadata = request.participant_metadata;
  }
  if (request.participant_attributes) {
    at.attributes = request.participant_attributes;
  }
  if (request.room_config) {
    at.roomConfig = RoomConfiguration.fromJson(request.room_config);
  }

  return at.toJwt();
}

export async function POST(request: Request) {
  const body = await parseRequestPayload(request);
  const proxied = await proxyToBackend("/api/v1/voice/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (proxied) {
    return proxied;
  }

  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    return NextResponse.json(
      { message: "LIVEKIT_API_KEY / LIVEKIT_API_SECRET missing" },
      { status: 500 },
    );
  }

  const options = {
    ...body,
  } as Record<string, unknown> & {
    room_name?: string;
    roomName?: string;
    participant_identity?: string;
    participantName?: string;
  };
  const suffix = crypto.randomUUID().substring(0, 8);
  options.room_name = options.room_name ?? options.roomName ?? `room-${suffix}`;
  options.participant_identity =
    options.participant_identity ?? options.participantName ?? `user-${suffix}`;

  const participantToken = await createToken(options as TokenRequest);
  return NextResponse.json({
    server_url: process.env.NEXT_PUBLIC_LIVEKIT_URL,
    participant_token: participantToken,
    room_name: options.room_name,
    participant_identity: options.participant_identity,
  });
}
