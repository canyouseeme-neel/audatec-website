# Audatec Release Checklist

## Security

- Rotate LiveKit keys and keep them only in server env files.
- Set `BACKEND_URL` and `NEXT_PUBLIC_BACKEND_URL` for production domains.
- Configure strict CORS `ALLOWED_ORIGINS` in backend.
- Verify backend rate limiting is active (`429` after threshold).
- Confirm `NEXT_PUBLIC_WEBSITE_MODE` and `NEXT_PUBLIC_SENTIMENT_MODE` values.

## Content & UX

- Re-run `npm run generate:expertise` after demo content edits.
- Validate BFSI claims and legal wording against final compliance approval.
- Verify Lenis and GSAP performance on mid-range devices.
- Test orb glow/readability in dark and high-contrast displays.

## Demo Flow

- Confirm `/demo` can connect/disconnect to LiveKit.
- Check transcript stream, waveform render, and CRM tag extraction.
- Validate post-call processor output (`budget`, `product_interest`, `next_steps`).
- Confirm audit report availability after session end.
- Confirm sentiment pulse alerts for disclosure-related negative spikes.

## Data & Integrations

- Run a contact lead insertion into Supabase (`contact_leads` table).
- Validate mock CRM update endpoint payload and response contract.
- Verify backend health endpoint (`/api/v1/health`) in deployment checks.

## Rollout

- Stage with `NEXT_PUBLIC_WEBSITE_MODE=marketing_only` first.
- Enable demo after backend telemetry is healthy.
- Enable live sentiment mode only after monitoring and fallback validation.

