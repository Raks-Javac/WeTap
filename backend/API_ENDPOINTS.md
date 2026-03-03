# WeTap API Endpoints Reference (v1)

This file is frontend-implementation ready: every endpoint includes auth, request payload, and response shape.

## Base URL
- Local: `http://127.0.0.1:8000/api/v1`
- Dev: `{API_SERVER_DEV_URL}/api/v1`
- UAT: `{API_SERVER_UAT_URL}/api/v1`
- Staging: `{API_SERVER_STAGING_URL}/api/v1`
- Prod: `{API_SERVER_PROD_URL}/api/v1`

## Global Rules
- Request body content type: `application/json`
- Protected routes: `Authorization: Bearer <access_token>`
- Idempotency header required for:
  - `POST /payments/nfc/execute`
  - `POST /bills/pay`
  - `POST /transfers/initiate`

## Standard Envelope (All Endpoints)
```json
{
  "status": true,
  "message": "human-readable",
  "data": {}
}
```

## Common Error Example
```json
{
  "status": false,
  "message": "Request failed",
  "data": {"detail": "error details"}
}
```

---
## Auth

### POST `/auth/otp/request`
Auth: Public

Request
```json
{ "email": "user@example.com" }
```

Response
```json
{
  "status": true,
  "message": "OTP requested",
  "data": { "email": "user@example.com", "ttl": 600, "debug_otp": "1234" }
}
```

### POST `/auth/otp/verify`
Auth: Public

Request
```json
{ "email": "user@example.com", "otp": "1234" }
```

Response
```json
{
  "status": true,
  "message": "OTP verified",
  "data": {
    "access": "<jwt>",
    "refresh": "<jwt>",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "full_name": "",
      "phone": "",
      "tap_mode": "two_tap",
      "is_new": true,
      "kyc_status": "pending",
      "wallet": { "balance": "0.00", "currency": "NGN" }
    },
    "is_new": true
  }
}
```

### POST `/auth/logout`
Auth: Bearer

Request
```json
{ "refresh": "<optional_refresh_token>" }
```

Response
```json
{ "status": true, "message": "Logged out", "data": null }
```

### POST `/auth/token/refresh`
Auth: Public

Request
```json
{ "refresh": "<refresh_token>" }
```

Response
```json
{ "status": true, "message": "Token refreshed", "data": { "access": "<jwt>", "refresh": "<jwt>" } }
```

---
## Users

### GET `/users/me`
Auth: Bearer

Response
```json
{
  "status": true,
  "message": "User profile",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "phone": "08030000000",
    "tap_mode": "two_tap",
    "is_new": false,
    "kyc_status": "pending",
    "wallet": { "balance": "1000.00", "currency": "NGN" }
  }
}
```

### PATCH `/users/me`
Auth: Bearer

Request
```json
{ "full_name": "John Doe", "phone": "08030000000" }
```

Response
```json
{ "status": true, "message": "User updated", "data": { "id": "uuid", "email": "user@example.com" } }
```

### POST `/users/me/onboarding/complete`
Auth: Bearer

Request
```json
{ "tap_mode": "one_tap", "pin_hash": "$2b$12$...bcrypt-hash..." }
```

Response
```json
{ "status": true, "message": "Onboarding complete", "data": { "id": "uuid", "tap_mode": "one_tap" } }
```

### POST `/users/me/kyc`
Auth: Bearer

Request
```json
{ "bvn": "12345678901", "nin": "12345678901", "address": "Lagos, Nigeria" }
```

Response
```json
{ "status": true, "message": "KYC submitted", "data": { "status": "pending" } }
```

### POST `/users/me/change-pin`
Auth: Bearer

Request
```json
{ "current_pin": "1234", "new_pin": "4321" }
```

Response
```json
{ "status": true, "message": "PIN changed", "data": null }
```

### GET `/users/me/dashboard`
Auth: Bearer

Response
```json
{
  "status": true,
  "message": "Dashboard",
  "data": {
    "user": { "id": "uuid", "email": "user@example.com" },
    "wallet": {
      "balance": "10000.00",
      "currency": "NGN",
      "virtual_account": { "number": "1234567890", "name": "John Doe", "bank": "WeTap Bank" }
    },
    "recent_transactions": []
  }
}
```

---
## Cards

### POST `/cards/provision`
Auth: Bearer

Dev/UAT request
```json
{ "pan": "4242424242424242", "expiry_month": "12", "expiry_year": "2030", "cvv": "123" }
```

Prod request
```json
{ "encrypted_card_data": "<processor-encrypted-payload>" }
```

Response
```json
{ "status": true, "message": "Card provisioned", "data": { "card_id": "uuid", "last4": "4242", "status": "active" } }
```

---
## Payments

### POST `/payments/fund`
Auth: Bearer

Request
```json
{ "amount": "5000.00" }
```

Response
```json
{ "status": true, "message": "Wallet funded", "data": { "reference": "fund_...", "status": "SUCCESS", "amount": "5000.00" } }
```

### POST `/nfc/initiate`
Auth: Bearer

Request
```json
{ "nfc_data": "base64-or-raw-nfc-payload" }
```

Response
```json
{ "status": true, "message": "NFC session initiated", "data": { "session_id": "uuid", "merchant": "Demo Merchant", "amount": "1500.00", "expiry": "datetime" } }
```

### POST `/payments/nfc/execute`
Auth: Bearer
Headers: `Idempotency-Key`

Request (one_tap)
```json
{ "session_id": "uuid", "card_id": "uuid", "method": "one_tap", "amount": "1500.00" }
```

Request (two_tap)
```json
{ "session_id": "uuid", "card_id": "uuid", "method": "two_tap", "pin_hash": "1234", "amount": "1500.00" }
```

Response
```json
{ "status": true, "message": "NFC payment executed", "data": { "reference": "nfc_...", "status": "SUCCESS", "amount": "1500.00" } }
```

---
## Bills

### GET `/bills/categories`
Auth: Bearer

Response
```json
{ "status": true, "message": "Bill categories", "data": [{ "code": "tv", "name": "TV" }] }
```

### GET `/bills/providers?category=<code>`
Auth: Bearer

Response
```json
{ "status": true, "message": "Bill providers", "data": [{ "code": "DSTV", "name": "DSTV" }] }
```

### POST `/bills/validate`
Auth: Bearer

Request
```json
{ "provider": "DSTV", "item_code": "DSTV_1000", "customer_identifier": "1234567890" }
```

Response
```json
{ "status": true, "message": "Bill validation", "data": { "valid": true, "customer_name": "Demo Customer" } }
```

### POST `/bills/pay`
Auth: Bearer
Headers: `Idempotency-Key`

Request
```json
{ "category": "tv", "provider": "DSTV", "item_code": "DSTV_1000", "customer_identifier": "1234567890", "amount": "1000.00" }
```

Response
```json
{ "status": true, "message": "Bill payment completed", "data": { "reference": "bill_...", "status": "SUCCESS", "amount": "1000.00" } }
```

---
## Transfers

### GET `/banks`
Auth: Bearer

Response
```json
{ "status": true, "message": "Banks", "data": [{ "code": "058", "name": "GTBank" }] }
```

### POST `/transfers/resolve-account`
Auth: Bearer

Request
```json
{ "bank_code": "058", "account_number": "0123456789" }
```

Response
```json
{ "status": true, "message": "Account resolved", "data": { "account_name": "Resolved Account", "account_number": "0123456789", "bank_code": "058" } }
```

### POST `/transfers/resolve-wetap-id`
Auth: Bearer

Request
```json
{ "email": "receiver@example.com" }
```

Response
```json
{ "status": true, "message": "WeTap user resolved", "data": { "user_id": "uuid", "email": "receiver@example.com", "name": "Receiver" } }
```

### POST `/transfers/initiate`
Auth: Bearer
Headers: `Idempotency-Key`

Request (bank)
```json
{ "amount": "2500.00", "bank_code": "058", "account_number": "0123456789", "account_name": "Receiver Name" }
```

Request (WeTap)
```json
{ "amount": "2500.00", "wetap_email": "receiver@example.com" }
```

Response
```json
{ "status": true, "message": "Transfer processed", "data": { "reference": "trf_...", "status": "SUCCESS", "amount": "2500.00", "fee": "10.50" } }
```

---
## Transactions

### GET `/transactions?page=&limit=&type=&status=`
Auth: Bearer

Response
```json
{ "status": true, "message": "Transactions", "data": { "items": [], "count": 0, "page": 1 } }
```

### GET `/transactions/{ref}`
Auth: Bearer

Response
```json
{ "status": true, "message": "Transaction", "data": { "reference": "fund_...", "status": "SUCCESS", "amount": "5000.00" } }
```

---
## Chat

### POST `/chat/message`
Auth: Bearer

Request
```json
{ "message": "Send money to John", "thread_id": "optional-uuid" }
```

Response
```json
{ "status": true, "message": "Chat response", "data": { "thread_id": "uuid", "assistant_message": "...", "action": { "type": "navigate", "route": "/app/transfers/new", "prefill": {} } } }
```

### GET `/chat/threads`
Auth: Bearer

Response
```json
{ "status": true, "message": "Chat threads", "data": [{ "id": "uuid", "title": "Support", "created_at": "datetime" }] }
```

---
## Admin

### POST `/admin/auth/login`
Auth: Public

Request
```json
{ "email": "admin@wetap.app", "password": "your-password" }
```

Response
```json
{ "status": true, "message": "Admin login successful", "data": { "access": "<jwt>", "refresh": "<jwt>", "admin": { "id": "uuid", "email": "admin@wetap.app", "role": "OPS" } } }
```

### GET `/admin/dashboard/stats`
Auth: Bearer admin token

Response
```json
{ "status": true, "message": "Admin stats", "data": { "users": 10, "transactions": 200, "success_transactions": 180, "cards": 15 } }
```

### GET `/admin/transactions?page=&limit=&status=&type=`
Auth: Bearer admin token

Response
```json
{ "status": true, "message": "Admin transactions", "data": { "items": [], "count": 0, "page": 1 } }
```

### GET `/admin/users?page=&limit=`
Auth: Bearer admin token

Response
```json
{ "status": true, "message": "Users", "data": { "items": [], "count": 0, "page": 1 } }
```

### GET `/admin/users/{user_id}`
Auth: Bearer admin token

Response
```json
{ "status": true, "message": "User detail", "data": { "id": "uuid", "email": "user@example.com" } }
```

### POST `/admin/users/{user_id}/kyc/approve`
Auth: Bearer admin token

Request
```json
{}
```

Response
```json
{ "status": true, "message": "KYC approved", "data": { "user_id": "uuid" } }
```

### POST `/admin/users/{user_id}/kyc/reject`
Auth: Bearer admin token

Request
```json
{ "reason": "Document mismatch" }
```

Response
```json
{ "status": true, "message": "KYC rejected", "data": { "user_id": "uuid" } }
```

### GET `/admin/cards`
Auth: Bearer admin token

Response
```json
{ "status": true, "message": "Cards", "data": { "items": [], "count": 0, "page": 1 } }
```

### POST `/admin/cards/{card_id}/block`
Auth: Bearer admin token

Request
```json
{}
```

Response
```json
{ "status": true, "message": "Card blocked", "data": { "card_id": "uuid" } }
```

### GET `/admin/audit-logs`
Auth: Bearer admin token

Response
```json
{ "status": true, "message": "Audit logs", "data": { "items": [], "count": 0, "page": 1 } }
```

---
## Frontend Integration Notes
- Store access/refresh tokens after login/verification.
- Attach bearer token on protected routes.
- Always parse `status` before using `data`.
- Show `message` for user-facing toasts.
