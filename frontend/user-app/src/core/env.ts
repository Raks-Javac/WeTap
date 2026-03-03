import type { AppEnvironment } from "./types";

const API_PATH = "/api/v1";

const ENV_URLS: Record<AppEnvironment, string> = {
  dev: import.meta.env.VITE_API_SERVER_DEV_URL || "http://127.0.0.1:8000",
  uat: import.meta.env.VITE_API_SERVER_UAT_URL || "http://127.0.0.1:8000",
  staging:
    import.meta.env.VITE_API_SERVER_STAGING_URL || "http://127.0.0.1:8000",
  prod: import.meta.env.VITE_API_SERVER_PROD_URL || "http://127.0.0.1:8000",
};

export const resolveEnvironment = (): AppEnvironment => {
  try {
    const raw = localStorage.getItem("wetap-global-storage");
    if (!raw) return "dev";
    const parsed = JSON.parse(raw);
    const env = parsed?.state?.environment;
    if (["dev", "uat", "staging", "prod"].includes(env)) {
      return env as AppEnvironment;
    }
  } catch {
    // no-op
  }
  return "dev";
};

export const resolveApiBaseUrl = () => {
  const env = resolveEnvironment();
  return `${ENV_URLS[env]}${API_PATH}`;
};
