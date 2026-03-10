# Audatec Backend

FastAPI sidecar for Audatec platform features:

- LiveKit token issuance (`/api/v1/voice/token`)
- Session audit report generation
- Lead capture + Supabase persistence
- Post-call CRM entity extraction and mock CRM update
- Sentiment and compliance signal aggregation

## Local run

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -e .
uvicorn app.main:app --reload --port 8000
```

## Docker (local)

```bash
docker build -t audatec-backend .
docker run -p 8000:8000 -e PORT=8000 --env-file .env audatec-backend
```

## Deploy to Render

1. Push the repo to GitHub.
2. In [Render](https://render.com): **New** → **Web Service**.
3. Connect the repo and set **Root Directory** to `audatec-web/backend` (or `backend` if the repo root is `audatec-web`).
4. Set **Runtime** to **Docker**.
5. Add environment variables in the Render dashboard (same keys as `.env`).
6. Deploy. The service will be available at `https://<your-service>.onrender.com`.

## Environment

Create `.env` in `backend/` with:

```env
APP_ENV=development
LIVEKIT_URL=wss://your-livekit-host
LIVEKIT_API_KEY=your-key
LIVEKIT_API_SECRET=your-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

For production (e.g. Render), set `APP_ENV=production`, `APP_DEBUG=false`, and add `ALLOWED_ORIGINS` with your frontend URL.
