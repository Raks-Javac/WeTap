import { userTokenStore } from "../auth/tokenStore";
import { userApi } from "../../services/userApi";

const CARD_CACHE_KEY = "wetap_user_cards";

type LegacyCard = {
  id: string;
  type: string;
  last4: string;
  expMs: string;
  expYr: string;
  brand: string;
  status: string;
};

const readCardCache = (): LegacyCard[] => {
  try {
    return JSON.parse(localStorage.getItem(CARD_CACHE_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeCardCache = (cards: LegacyCard[]) => {
  localStorage.setItem(CARD_CACHE_KEY, JSON.stringify(cards));
};

const asNumber = (value: unknown): number => Number(value || 0);

const mapTx = (tx: Record<string, unknown>) => ({
  id: String(tx.reference || tx.id || ""),
  status: String(tx.status || "PENDING"),
  amount: tx.direction === "credit" ? asNumber(tx.amount) : -asNumber(tx.amount),
  type: String(tx.type || "Transaction"),
  name: String(tx.merchant || tx.counterparty || tx.narration || "WeTap"),
  date: String(tx.created_at || tx.timestamp || new Date().toISOString()),
});

export const api = {
  auth: {
    requestOtp: async (email: string) => {
      const response = await userApi.requestOtp(email);
      return response.data;
    },
    login: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await userApi.verifyOtp(email, otp);
      userTokenStore.setTokens({
        access: response.data.access,
        refresh: response.data.refresh,
      });
      return response.data;
    },
    logout: async () => {
      const refresh = userTokenStore.getRefreshToken() || undefined;
      await userApi.logout(refresh);
      userTokenStore.clear();
      return null;
    },
  },

  users: {
    me: async () => (await userApi.getMe()).data,
    dashboard: async () => (await userApi.getDashboard()).data,
    completeOnboarding: async (payload: { tap_mode: string; pin_hash: string }) =>
      (await userApi.completeOnboarding(payload)).data,
    changePin: async (payload: { current_pin: string; new_pin: string }) =>
      (await userApi.changePin(payload)).data,
    submitKyc: async (payload: { bvn: string; nin: string; address: string }) =>
      (await userApi.submitKyc(payload)).data,
  },

  cards: {
    list: async () => {
      const cached = readCardCache();
      return cached;
    },
    tokenize: async () => {
      const provisioned = await userApi.provisionCard({
        pan: "4242424242424242",
        expiry_month: "12",
        expiry_year: "2030",
        cvv: "123",
      });

      const card: LegacyCard = {
        id: provisioned.data.card_id,
        type: "VIRTUAL",
        last4: provisioned.data.last4,
        expMs: "12",
        expYr: "30",
        brand: "WeTap",
        status: provisioned.data.status.toUpperCase(),
      };

      const cards = [card, ...readCardCache().filter((c) => c.id !== card.id)];
      writeCardCache(cards);
      return card;
    },
    toggleFreeze: async (id: string, isFrozen: boolean) => {
      const cards = readCardCache().map((card) =>
        card.id === id
          ? { ...card, status: isFrozen ? "FROZEN" : "ACTIVE" }
          : card,
      );
      writeCardCache(cards);
      return { success: true, newStatus: isFrozen ? "FROZEN" : "ACTIVE" };
    },
  },

  transactions: {
    list: async () => {
      const response = await userApi.getTransactions({ page: 1, limit: 50 });
      return (response.data.items || []).map((tx) => mapTx(tx));
    },
    getByRef: async (reference: string) => {
      const response = await userApi.getTransactionByRef(reference);
      return mapTx(response.data);
    },
    transfer: async (payload: {
      amount: number;
      bank_code?: string;
      account_number?: string;
      account_name?: string;
      wetap_email?: string;
    }) => {
      const response = await userApi.initiateTransfer({
        amount: payload.amount.toFixed(2),
        ...(payload.wetap_email
          ? { wetap_email: payload.wetap_email }
          : {
              bank_code: payload.bank_code || "058",
              account_number: payload.account_number || "0000000000",
              account_name: payload.account_name || "Recipient",
            }),
      });

      return {
        id: response.data.reference,
        status: response.data.status,
        amount: response.data.amount,
      };
    },
  },

  bills: {
    categories: async () => (await userApi.getBillCategories()).data,
    providers: async (category: string) => (await userApi.getBillProviders(category)).data,
    validate: async (payload: {
      provider: string;
      item_code: string;
      customer_identifier: string;
    }) => (await userApi.validateBill(payload)).data,
    pay: async (payload: {
      category: string;
      provider: string;
      item_code?: string;
      customer_identifier?: string;
      amount: number;
      account?: string;
    }) => {
      const response = await userApi.payBill({
        category: payload.category,
        provider: payload.provider,
        item_code: payload.item_code || `${payload.provider}_1000`,
        customer_identifier: payload.customer_identifier || payload.account || "0000000000",
        amount: payload.amount.toFixed(2),
      });
      return {
        id: response.data.reference,
        status: response.data.status,
        amount: response.data.amount,
      };
    },
  },

  transfers: {
    banks: async () => (await userApi.getBanks()).data,
    resolveAccount: async (bank_code: string, account_number: string) =>
      (await userApi.resolveBankAccount({ bank_code, account_number })).data,
    resolveWetapId: async (email: string) => (await userApi.resolveWetapId(email)).data,
  },

  payments: {
    fund: async (amount: string) => (await userApi.fundWallet(amount)).data,
    initiateNfc: async (nfcData: string) => (await userApi.initiateNfc(nfcData)).data,
    executeNfc: async (payload: Record<string, unknown>) =>
      (await userApi.executeNfc(payload)).data,
  },

  chat: {
    send: async (text: string, threadId?: string) => {
      const response = await userApi.sendChatMessage(text, threadId);
      return {
        role: "assistant",
        text: response.data.assistant_message,
        thread_id: response.data.thread_id,
        action: response.data.action,
        timestamp: new Date().toISOString(),
      };
    },
    threads: async () => (await userApi.getChatThreads()).data,
  },
};
