# WeTap Frontend Start Commands

This repository contains two React applications built with Vite: `user-app` and `admin-app`.
Below are the exact terminal commands required to run each project locally.

## Running the User App

To run the main NFC Fintech User platform:

```bash
cd frontend/user-app
npm install  # (if not already installed)
npm run dev
```

The User App will start locally, generally on `http://localhost:5173`.

---

## Running the Admin App

To run the Admin Dashboard portal:

```bash
cd frontend/admin-app
npm install  # (if not already installed)
npm run dev
```

The Admin App will start locally on a different port, e.g., `http://localhost:5174`.

---

## Running Both Apps with Docker

If you prefer to run them combined through Nginx as they will exist in production:

```bash
cd frontend
docker build -t wetap-frontend .
docker run -p 8080:8080 wetap-frontend
```

Then visit:

- **User App:** `http://localhost:8080/`
- **Admin App:** `http://localhost:8080/admin/`
