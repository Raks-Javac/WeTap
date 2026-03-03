import { apiRequest } from "../core/http/client";
import { createIdempotencyKey } from "../core/http/idempotency";

export const userApi = {
  requestOtp: (email: string) =>
    apiRequest<{ email: string; ttl: number; debug_otp?: string }>(
      "/auth/otp/request",
      {
        method: "POST",
        auth: false,
        body: { email },
      },
    ),

  verifyOtp: (email: string, otp: string) =>
    apiRequest<{
      access: string;
      refresh: string;
      user: Record<string, unknown>;
      is_new: boolean;
    }>("/auth/otp/verify", {
      method: "POST",
      auth: false,
      body: { email, otp },
    }),

  logout: (refresh?: string) =>
    apiRequest<null>("/auth/logout", {
      method: "POST",
      body: { refresh },
    }),

  refreshToken: (refresh: string) =>
    apiRequest<{ access: string; refresh: string }>("/auth/token/refresh", {
      method: "POST",
      auth: false,
      body: { refresh },
    }),

  getMe: () => apiRequest<Record<string, unknown>>("/users/me"),

  patchMe: (payload: { full_name?: string; phone?: string }) =>
    apiRequest<Record<string, unknown>>("/users/me", {
      method: "PATCH",
      body: payload,
    }),

  completeOnboarding: (payload: { tap_mode: string; pin_hash: string }) =>
    apiRequest<Record<string, unknown>>("/users/me/onboarding/complete", {
      method: "POST",
      body: payload,
    }),

  submitKyc: (payload: { bvn: string; nin: string; address: string }) =>
    apiRequest<{ status: string }>("/users/me/kyc", {
      method: "POST",
      body: payload,
    }),

  changePin: (payload: { current_pin: string; new_pin: string }) =>
    apiRequest<null>("/users/me/change-pin", {
      method: "POST",
      body: payload,
    }),

  getDashboard: () =>
    apiRequest<{
      user: Record<string, unknown>;
      wallet: {
        balance: string;
        currency: string;
        virtual_account?: {
          number: string;
          name: string;
          bank: string;
        };
      };
      recent_transactions: Array<Record<string, unknown>>;
    }>("/users/me/dashboard"),

  provisionCard: (payload: Record<string, string>) =>
    apiRequest<{ card_id: string; last4: string; status: string }>(
      "/cards/provision",
      {
        method: "POST",
        body: payload,
      },
    ),

  fundWallet: (amount: string) =>
    apiRequest<{ reference: string; status: string; amount: string }>(
      "/payments/fund",
      {
        method: "POST",
        body: { amount },
      },
    ),

  initiateNfc: (nfc_data: string) =>
    apiRequest<{
      session_id: string;
      merchant: string;
      amount: string;
      expiry: string;
    }>("/nfc/initiate", {
      method: "POST",
      body: { nfc_data },
    }),

  executeNfc: (payload: Record<string, unknown>) =>
    apiRequest<{ reference: string; status: string; amount: string }>(
      "/payments/nfc/execute",
      {
        method: "POST",
        body: payload,
        headers: { "Idempotency-Key": createIdempotencyKey() },
      },
    ),

  getBillCategories: () =>
    apiRequest<Array<{ code: string; name: string }>>("/bills/categories"),

  getBillProviders: (category: string) =>
    apiRequest<Array<{ code: string; name: string }>>(
      `/bills/providers?category=${encodeURIComponent(category)}`,
    ),

  validateBill: (payload: Record<string, string>) =>
    apiRequest<{ valid: boolean; customer_name?: string }>("/bills/validate", {
      method: "POST",
      body: payload,
    }),

  payBill: (payload: Record<string, string>) =>
    apiRequest<{ reference: string; status: string; amount: string }>(
      "/bills/pay",
      {
        method: "POST",
        body: payload,
        headers: { "Idempotency-Key": createIdempotencyKey() },
      },
    ),

  getBanks: () => apiRequest<Array<{ code: string; name: string }>>("/banks"),

  resolveBankAccount: (payload: { bank_code: string; account_number: string }) =>
    apiRequest<{
      account_name: string;
      account_number: string;
      bank_code: string;
    }>("/transfers/resolve-account", {
      method: "POST",
      body: payload,
    }),

  resolveWetapId: (email: string) =>
    apiRequest<{ user_id: string; email: string; name: string }>(
      "/transfers/resolve-wetap-id",
      {
        method: "POST",
        body: { email },
      },
    ),

  initiateTransfer: (payload: Record<string, string>) =>
    apiRequest<{ reference: string; status: string; amount: string; fee: string }>(
      "/transfers/initiate",
      {
        method: "POST",
        body: payload,
        headers: { "Idempotency-Key": createIdempotencyKey() },
      },
    ),

  getTransactions: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.type) query.set("type", params.type);
    if (params?.status) query.set("status", params.status);

    return apiRequest<{ items: Array<Record<string, unknown>>; count: number; page: number }>(
      `/transactions${query.toString() ? `?${query.toString()}` : ""}`,
    );
  },

  getTransactionByRef: (reference: string) =>
    apiRequest<Record<string, unknown>>(`/transactions/${reference}`),

  sendChatMessage: (message: string, thread_id?: string) =>
    apiRequest<{
      thread_id: string;
      assistant_message: string;
      action?: {
        type: string;
        route: string;
        prefill?: Record<string, unknown>;
      };
    }>("/chat/message", {
      method: "POST",
      body: { message, thread_id },
    }),

  getChatThreads: () =>
    apiRequest<Array<{ id: string; title: string; created_at: string }>>(
      "/chat/threads",
    ),
};
