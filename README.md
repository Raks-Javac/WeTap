# WeTap Platform

Full-stack WeTap platform with:
- `frontend/user-app`: end-user payments app
- `frontend/admin-app`: operations/admin console
- `backend`: Django + DRF API (NFC-first payments, transfers, bills, KYC, chat, admin APIs)

## Repository Structure

```text
fyntap/
├── backend/
├── frontend/
│   ├── user-app/
│   └── admin-app/
└── mobile/
```

## Tech Stack

- Backend: Python 3.11, Django 5, DRF, PostgreSQL (Neon), Redis, Celery, JWT
- Frontend user/admin: React, TypeScript, Vite, Zustand
- Deployment target: Render / Cloud Run

## 1) Backend Documentation

### API Base
- Local: `http://127.0.0.1:8000/api/v1`

### Core Features
- OTP auth (`/auth/otp/request`, `/auth/otp/verify`)
- User onboarding/profile/KYC
- Cards provisioning
- Wallet funding
- NFC initiate + execute
- Bills categories/providers/validate/pay
- Transfers (bank + WeTap)
- Transactions list/detail
- Chat threads/messages
- Admin auth + dashboard/users/kyc/cards/audit

### Response Contract
All endpoints return:

```json
{
  "status": true,
  "message": "human-readable",
  "data": {}
}
```

### Backend Local Setup

```bash
cd backend
/opt/homebrew/bin/python3.11 -m venv .venv311
source .venv311/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Set required `.env` values:
- `DATABASE_URL`
- `SECRET_KEY`
- `FIELD_ENCRYPTION_KEY`
- `ENVIRONMENT`

Run:

```bash
python manage.py migrate
python manage.py loaddata seed.json
python manage.py runserver 0.0.0.0:8000
```

### Redis-less Local Mode
If Redis is not running locally, set:

```env
CACHE_BACKEND=locmem
```

This allows local API testing without Redis.

### Production Notes
- `ENVIRONMENT=prod`
- `USE_MOCK_PROCESSOR=false`
- Set real Interswitch credentials
- Never commit `.env`

## 2) Frontend User App Documentation

### App Scope
End-user experience:
- Auth + onboarding
- Dashboard and add money
- NFC pay
- Transfers and bills
- Cards
- History
- Settings/KYC
- AI chat panel

### Run Locally

```bash
cd frontend/user-app
npm install
npm run dev
```

Default URL: `http://localhost:5173`

### Backend Integration
Set API target in user-app config/environment to backend URL:
- `http://127.0.0.1:8000/api/v1`

Auth uses JWT Bearer tokens from OTP verify flow.

## 3) Frontend Admin App Documentation

### App Scope
Operations/admin console:
- Admin login
- Mission control stats
- Transactions feed
- User directory
- KYC approve/reject
- Cards management/block
- Audit logs

### Run Locally

```bash
cd frontend/admin-app
npm install
npm run dev
```

Default URL: `http://localhost:5174` (or Vite-assigned port)

### Backend Integration
Point admin app API config to:
- `http://127.0.0.1:8000/api/v1`

Use admin JWT from `/api/v1/admin/auth/login`.

## 4) End-to-End Local Run

Open three terminals:

1. Backend
```bash
cd backend
source .venv311/bin/activate
python manage.py runserver 0.0.0.0:8000
```

2. User app
```bash
cd frontend/user-app
npm run dev
```

3. Admin app
```bash
cd frontend/admin-app
npm run dev
```

## 5) Deployment (Render)

### Backend Service
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
- Add env vars: `DATABASE_URL`, `REDIS_URL`, `SECRET_KEY`, `FIELD_ENCRYPTION_KEY`, `ENVIRONMENT`, JWT vars, Interswitch vars

### Worker Service (optional but recommended)
- Start command: `celery -A config worker -l info`

### Frontend Services
Deploy `frontend/user-app` and `frontend/admin-app` as static sites (or Node builds), and configure API base URL to backend public URL.

## 6) Security Checklist

- Keep `.env` out of git
- Rotate DB credentials if exposed
- Use separate `dev/uat/prod` credentials
- Disable mock processor in prod
- Enforce HTTPS and secure CORS in prod

## 7) Troubleshooting

- `password authentication failed for user postgres`: wrong local DB creds
- `connection refused localhost:6379`: Redis not running; set `CACHE_BACKEND=locmem`
- Django install fails on Python 3.9: use Python 3.11+
