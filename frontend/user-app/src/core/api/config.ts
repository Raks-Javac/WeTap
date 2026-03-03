// core/api/config.ts
export const API_CONFIG = {
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === "true",
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  TIMEOUT: 15000,
};
