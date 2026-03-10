# Audatec Web

Audatec's marketing website and BFSI Voice + Audit demo. Built with Next.js, featuring a live voice demo powered by LiveKit.

## Local development

1. Install dependencies

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and configure:

```
LIVEKIT_API_KEY=<your API key>
LIVEKIT_API_SECRET=<your API secret>
NEXT_PUBLIC_LIVEKIT_URL=wss://<your LiveKit URL>
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

5. Ensure the backend agent is running (see `../backend/README.md`) for the voice demo to work.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run format` — Format with Prettier
- `npm run generate:expertise` — Regenerate expertise map from content

## Tech stack

- Next.js 16
- React 19
- Tailwind CSS
- LiveKit (voice/WebRTC)
- shadcn/ui components
