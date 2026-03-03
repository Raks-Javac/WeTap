import { adminTokenStore } from "../core/auth/tokenStore";
import { apiRequest } from "../core/http/client";

export const adminApi = {
  login: async (payload: { email: string; password: string }) => {
    const response = await apiRequest<{
      access: string;
      refresh: string;
      admin: { id: string; email: string; role: string };
    }>("/admin/auth/login", {
      method: "POST",
      auth: false,
      body: payload,
    });

    adminTokenStore.setTokens({
      access: response.data.access,
      refresh: response.data.refresh,
    });

    return response.data;
  },

  logout: () => {
    adminTokenStore.clear();
  },

  dashboardStats: () =>
    apiRequest<{
      users: number;
      transactions: number;
      success_transactions: number;
      cards: number;
    }>("/admin/dashboard/stats"),

  transactions: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.status) query.set("status", params.status);
    if (params?.type) query.set("type", params.type);

    return apiRequest<{ items: Array<Record<string, unknown>>; count: number; page: number }>(
      `/admin/transactions${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },

  users: (page = 1, limit = 20) =>
    apiRequest<{ items: Array<Record<string, unknown>>; count: number; page: number }>(
      `/admin/users?page=${page}&limit=${limit}`,
    ),

  userById: (userId: string) => apiRequest<Record<string, unknown>>(`/admin/users/${userId}`),

  approveKyc: (userId: string) =>
    apiRequest<{ user_id: string }>(`/admin/users/${userId}/kyc/approve`, {
      method: "POST",
      body: {},
    }),

  rejectKyc: (userId: string, reason: string) =>
    apiRequest<{ user_id: string }>(`/admin/users/${userId}/kyc/reject`, {
      method: "POST",
      body: { reason },
    }),

  cards: (page = 1, limit = 20) =>
    apiRequest<{ items: Array<Record<string, unknown>>; count: number; page: number }>(
      `/admin/cards?page=${page}&limit=${limit}`,
    ),

  blockCard: (cardId: string) =>
    apiRequest<{ card_id: string }>(`/admin/cards/${cardId}/block`, {
      method: "POST",
      body: {},
    }),

  auditLogs: (page = 1, limit = 20) =>
    apiRequest<{ items: Array<Record<string, unknown>>; count: number; page: number }>(
      `/admin/audit-logs?page=${page}&limit=${limit}`,
    ),
};
