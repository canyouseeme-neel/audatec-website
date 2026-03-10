# Development Guide

This project has two parts that run **separately**:

1. **Backend** – FastAPI service (Python) on port 8000  
2. **Frontend (Playground)** – Next.js app on port 3000  

---

## Prerequisites

- **Node.js** 18+ (for the playground)
- **Python** 3.11+ (for the backend)
- **npm** or **pnpm** (for the playground)

---

## 1. Backend Setup & Run

### First-time setup

```powershell
cd backend

# Create virtual environment
python -m venv .venv

# Activate (Windows PowerShell)
.venv\Scripts\Activate.ps1

# Install dependencies (editable mode)
pip install -e .

# Copy env template and fill in your values
copy .env.example .env
# Edit .env with your LiveKit, Supabase, etc.
```

### Environment variables

Create `backend/.env` from `backend/.env.example` and set:

| Variable | Description |
|----------|-------------|
| `APP_ENV` | `development` |
| `LIVEKIT_URL` | Your LiveKit WebSocket URL |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |

### Run the backend

```powershell
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

Backend will be available at **http://localhost:8000**.

---

## 2. Frontend (Playground) Setup & Run

### First-time setup

```powershell
cd playground

# Install dependencies
npm install

# Copy env template and fill in your values
copy .env.example .env.local
# Edit .env.local with your LiveKit, backend URL, etc.
```

### Environment variables

Create `playground/.env.local` from `playground/.env.example` and set:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_LIVEKIT_URL` | Same LiveKit URL as backend |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `BACKEND_URL` | `http://localhost:8000` (backend URL used by Next.js API routes) |

### Run the playground

```powershell
cd playground
npm run dev
```

Playground will be available at **http://localhost:3000**.

---

## 3. Running Both Together

Use **two terminals**:

**Terminal 1 – Backend**

```powershell
cd d:\Auflo\website\backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 – Playground**

```powershell
cd d:\Auflo\website\playground
npm run dev
```

Then open **http://localhost:3000** in your browser. The playground will call the backend at `http://localhost:8000` for LiveKit tokens and other API features.

---

## Quick Reference

| Component | Directory | Command | URL |
|-----------|-----------|---------|-----|
| Backend | `backend/` | `uvicorn app.main:app --reload --port 8000` | http://localhost:8000 |
| Playground | `playground/` | `npm run dev` | http://localhost:3000 |

---

## Troubleshooting

- **Backend not found**: Ensure the backend is running on port 8000 and `BACKEND_URL` is set in `playground/.env.local`.
- **CORS errors**: Backend `.env` should include `ALLOWED_ORIGINS=["http://localhost:3000"]`.
- **LiveKit errors**: Verify `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` match in both backend and playground env files.
