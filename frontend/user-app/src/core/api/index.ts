import { API_CONFIG } from "./config";

// Mock Delay Helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generic Mock Adapter Structure
export const mockAdapter = {
  // Auth Mocks
  auth: {
    login: async (credentials: any) => {
      await delay(800);
      if (credentials.email === "error@wetap.com")
        throw new Error("Invalid credentials");
      return {
        token: "mock-jwt-token-123",
        user: { id: "usr_1", name: "Demo User", email: credentials.email },
      };
    },
    signup: async (data: any) => {
      await delay(1000);
      return {
        token: "mock-jwt-token-456",
        user: { id: "usr_2", name: data.name, email: data.email },
      };
    },
  },

  // Cards Mocks
  cards: {
    list: async () => {
      await delay(600);
      return [
        {
          id: "c_1",
          type: "VIRTUAL",
          last4: "4829",
          expMs: "12",
          expYr: "28",
          brand: "WeTap",
          status: "ACTIVE",
        },
        {
          id: "c_2",
          type: "PHYSICAL",
          last4: "1121",
          expMs: "04",
          expYr: "26",
          brand: "VISA",
          status: "FROZEN",
        },
      ];
    },
    tokenize: async () => {
      await delay(1500);
      return {
        id: `c_${Date.now()}`,
        type: "VIRTUAL",
        last4: "9999",
        expMs: "10",
        expYr: "29",
        brand: "WeTap",
        status: "ACTIVE",
      };
    },
    toggleFreeze: async (_id: string, isFrozen: boolean) => {
      await delay(400);
      return { success: true, newStatus: isFrozen ? "FROZEN" : "ACTIVE" };
    },
  },

  // Transactions & Transfers Mocks
  transactions: {
    list: async () => {
      await delay(500);
      return [
        {
          id: "TXN-9382",
          status: "SUCCESS",
          amount: -14500,
          type: "NFC Two-Tap",
          name: "NextGen Supermarket",
          date: new Date().toISOString(),
        },
        {
          id: "TXN-9381",
          status: "SUCCESS",
          amount: -2000,
          type: "Airtime",
          name: "MTN Nigeria",
          date: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: "TXN-9380",
          status: "SUCCESS",
          amount: 450000,
          type: "Transfer In",
          name: "Salary Deposit",
          date: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
    },
    createTransfer: async (data: any) => {
      await delay(1200);
      return {
        id: `TXN-${Math.floor(Math.random() * 10000)}`,
        status: "SUCCESS",
        ...data,
      };
    },
  },

  // Bills Mocks
  bills: {
    pay: async (data: any) => {
      await delay(1500);
      return {
        id: `BILL-${Math.floor(Math.random() * 10000)}`,
        status: "SUCCESS",
        ...data,
      };
    },
  },

  // Chat Mocks
  chat: {
    sendMessage: async (text: string) => {
      await delay(1000);
      let reply =
        "I can definitely help with that. Can you provide more details?";
      if (
        text.toLowerCase().includes("pay") ||
        text.toLowerCase().includes("send") ||
        text.toLowerCase().includes("transfer")
      ) {
        reply =
          "I've prepared a transfer draft for you. Just confirm the amount and recipient!";
      } else if (
        text.toLowerCase().includes("airtime") ||
        text.toLowerCase().includes("bill")
      ) {
        reply = "Got it. Taking you to the Bills page to recharge your number.";
      }
      return {
        role: "assistant",
        text: reply,
        timestamp: new Date().toISOString(),
      };
    },
  },
};

// Main API Wrapper (checks config to decide if mock or real)
export const api = {
  auth: {
    login: (data: any) =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.auth.login(data)
        : fetch("/api/auth/login").then((r) => r.json()),
    signup: (data: any) =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.auth.signup(data)
        : fetch("/api/auth/signup").then((r) => r.json()),
  },
  cards: {
    list: () =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.cards.list()
        : fetch("/api/cards").then((r) => r.json()),
    tokenize: () =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.cards.tokenize()
        : fetch("/api/cards/tokenize", { method: "POST" }).then((r) =>
            r.json(),
          ),
    toggleFreeze: (id: string, frozen: boolean) =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.cards.toggleFreeze(id, frozen)
        : fetch(`/api/cards/${id}/freeze`, {
            method: "POST",
            body: JSON.stringify({ frozen }),
          }).then((r) => r.json()),
  },
  transactions: {
    list: () =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.transactions.list()
        : fetch("/api/transactions").then((r) => r.json()),
    transfer: (data: any) =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.transactions.createTransfer(data)
        : fetch("/api/transfers", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((r) => r.json()),
  },
  bills: {
    pay: (data: any) =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.bills.pay(data)
        : fetch("/api/bills/pay", {
            method: "POST",
            body: JSON.stringify(data),
          }).then((r) => r.json()),
  },
  chat: {
    send: (text: string) =>
      API_CONFIG.USE_MOCK_API
        ? mockAdapter.chat.sendMessage(text)
        : fetch("/api/chat", {
            method: "POST",
            body: JSON.stringify({ text }),
          }).then((r) => r.json()),
  },
};
