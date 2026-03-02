# WeTap Backend

Django 5 + DRF backend for WeTap user and admin applications.

## Stack
- Python 3.x
- Django 5
- DRF + SimpleJWT
- PostgreSQL (Neon compatible)
- Redis (OTP/cache/rate limits)
- Celery (notifications/reconciliation/webhooks)

## Project structure
- `config/`: settings/urls/wsgi/asgi/celery
- `core/`: shared constants, exceptions, response helpers, security utilities
- `middleware/`: request security, response envelope, logging
- `apps/`: modular domain apps (`authn`, `users`, `kyc`, `wallets`, `cards`, `nfc`, `payments`, `bills`, `transfers`, `transactions`, `chat`, `admin_panel`, `audit`)
- `api/v1/`: serializers, views, routes

## Local run (venv)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py loaddata seed.json
python manage.py runserver
```

## Environment control
- `ENVIRONMENT=dev|uat|prod` controls behavior hard gates.
- `X-Environment` request header is accepted for tagging/logging; in `prod` it is forced to `prod`.

### Environment behavior
- `dev`: debug logs enabled, mock processor default
- `uat`: sandbox Interswitch if credentials exist; docs enabled
- `prod`: strict validation, docs disabled, errors masked, mock processor forbidden

## Processor selection
- `USE_MOCK_PROCESSOR=true` => mock processor for dev and fallback for uat
- `ENVIRONMENT=prod` requires real Interswitch processor (`USE_MOCK_PROCESSOR=false`)

Interswitch references embedded in code comments in `apps/payments/processors.py`:
- https://docs.interswitchgroup.com/reference/how-to-use-the-reference
- https://docs.interswitchgroup.com/docs/card360-test-card-data-encryption
- https://docs.interswitchgroup.com/docs/road-to-go-live-with-interswitch-apis
- https://docs.interswitchgroup.com/reference/tokenize-card-recurrents
- https://docs.interswitchgroup.com/reference/card-payment-api
- https://docs.interswitchgroup.com/reference/get-transactions
- https://docs.interswitchgroup.com/reference/query-transaction-1
- https://docs.interswitchgroup.com/reference/send-transaction
- https://docs.interswitchgroup.com/reference/get-billers
- https://docs.interswitchgroup.com/reference/get-billers-categories
- https://docs.interswitchgroup.com/reference/get-billers-by-category-2
- https://docs.interswitchgroup.com/reference/get-biller-payment-item
- https://github.com/techquest/isw-react-sdk

## API contract
All endpoints return:
```json
{
  "status": true,
  "message": "human-readable",
  "data": {}
}
```
This envelope also applies to errors.

## Auth endpoints
- `POST /api/v1/auth/otp/request`
- `POST /api/v1/auth/otp/verify`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/token/refresh`

## User app endpoints
- Onboarding/profile/KYC/settings:
  - `POST /api/v1/users/me/onboarding/complete`
  - `GET /api/v1/users/me`
  - `PATCH /api/v1/users/me`
  - `POST /api/v1/users/me/kyc`
  - `POST /api/v1/users/me/change-pin`
- Dashboard:
  - `GET /api/v1/users/me/dashboard`
- Cards:
  - `POST /api/v1/cards/provision`
- Payments:
  - `POST /api/v1/payments/fund`
  - `POST /api/v1/nfc/initiate`
  - `POST /api/v1/payments/nfc/execute`
- Bills:
  - `GET /api/v1/bills/categories`
  - `GET /api/v1/bills/providers?category=...`
  - `POST /api/v1/bills/validate`
  - `POST /api/v1/bills/pay`
- Transfers:
  - `GET /api/v1/banks`
  - `POST /api/v1/transfers/resolve-account`
  - `POST /api/v1/transfers/resolve-wetap-id`
  - `POST /api/v1/transfers/initiate`
- Transactions:
  - `GET /api/v1/transactions?page=&limit=&type=&status=`
  - `GET /api/v1/transactions/:ref`
- Chat:
  - `POST /api/v1/chat/message`
  - `GET /api/v1/chat/threads`

## Admin endpoints
- `POST /api/v1/admin/auth/login`
- `GET /api/v1/admin/dashboard/stats`
- `GET /api/v1/admin/transactions`
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/:id`
- `POST /api/v1/admin/users/:id/kyc/approve`
- `POST /api/v1/admin/users/:id/kyc/reject`
- `GET /api/v1/admin/cards`
- `POST /api/v1/admin/cards/:id/block`
- `GET /api/v1/admin/audit-logs`

## Security controls
- JWT auth + refresh
- Admin RBAC roles: `SUPER_ADMIN`, `OPS`, `SUPPORT`, `AUDITOR`
- Redis-backed rate limits
- Request payload validation and suspicious-pattern blocking
- Idempotency key enforcement on NFC execute, transfer initiate, bill pay
- Card PAN/CVV not persisted, only processor token persisted (encrypted)
- State-changing actions audited (`audit_logs`)

## Docs gating
- Swagger/OpenAPI enabled in `dev` and `uat`
- Disabled in `prod`

## Dev database reset
```bash
python manage.py flush --no-input
python manage.py migrate
python manage.py loaddata seed.json
```
Do not run against production.

## Celery
```bash
celery -A config worker -l info
```

## Security checks (CI-friendly)
```bash
bandit -r .
safety check -r requirements.txt
```
