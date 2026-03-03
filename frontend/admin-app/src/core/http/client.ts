import { adminTokenStore } from "../auth/tokenStore";
import { resolveApiBaseUrl, resolveEnvironment } from "../env";

export interface ApiEnvelope<T> {
  status: boolean;
  message: string;
  data: T;
}

export class ApiError extends Error {
  statusCode: number;
  details: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

let refreshInFlight: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refresh = adminTokenStore.getRefreshToken();
    if (!refresh) return null;

    try {
      const response = await fetch(`${resolveApiBaseUrl()}/auth/token/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Environment": resolveEnvironment(),
        },
        body: JSON.stringify({ refresh }),
      });

      const payload = (await response.json()) as ApiEnvelope<{
        access: string;
        refresh: string;
      }>;

      if (!response.ok || !payload?.status || !payload?.data?.access) {
        adminTokenStore.clear();
        return null;
      }

      adminTokenStore.setTokens(payload.data);
      return payload.data.access;
    } catch {
      adminTokenStore.clear();
      return null;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
}

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> => {
  const send = async (overrideToken?: string | null) => {
    const token = overrideToken ?? adminTokenStore.getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Environment": resolveEnvironment(),
      ...(options.headers || {}),
    };

    if (options.auth !== false && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${resolveApiBaseUrl()}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  };

  let response = await send();

  if (response.status === 401 && options.auth !== false) {
    const newAccess = await refreshAccessToken();
    if (newAccess) {
      response = await send(newAccess);
    }
  }

  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiError("Invalid server response", response.status);
  }

  if (!response.ok || !payload.status) {
    throw new ApiError(
      payload.message || "Request failed",
      response.status,
      payload.data,
    );
  }

  return payload;
};
