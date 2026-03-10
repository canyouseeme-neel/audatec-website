# Audatec Migration Map

This document tracks the concrete migration from the existing LiveKit playground into a website-first App Router architecture.

## Routing Migration

- `src/pages/_app.tsx` -> `src/app/layout.tsx`
- `src/pages/index.tsx` -> `src/app/demo/page.tsx` (command center)
- `src/pages/api/token.ts` -> `backend/app/api/v1/voice.py` + optional `src/app/api/livekit/token/route.ts` proxy

## Component Migration

- `src/components/playground/Playground.tsx` -> `src/components/demo/CommandCenter.tsx`
- `src/components/playground/PlaygroundHeader.tsx` -> `src/components/demo/CommandCenterHeader.tsx`
- `src/hooks/useTrackVolume.tsx` -> `src/hooks/audio/useTrackVolume.ts`
- `src/components/chat/*` -> `src/components/demo/transcript/*`

## New Website Structure

- `src/app/page.tsx` - home
- `src/app/expertise/page.tsx` - expertise + timeline
- `src/app/how-it-works/page.tsx` - RM/CRM flow
- `src/app/customers/page.tsx` - proofs + industries
- `src/app/contact/page.tsx` - lead capture
- `src/app/legal/*/page.tsx` - policy pages
- `src/app/demo/page.tsx` - command center

## Content Migration

- `demo/*.html` -> `src/content/expertise-map.json`
- Typed content model in `src/lib/content/expertise-map.ts`
- Extractor script in `scripts/extract-expertise-map.ts`

## Backend Sidecar Structure

- `backend/app/main.py` - FastAPI app
- `backend/app/api/v1/*` - API surface
- `backend/app/services/*` - business logic (voice, audit, CRM, sentiment)
- `backend/app/middleware/*` - audit + security middleware
- `backend/app/integrations/supabase_client.py` - Supabase bridge

