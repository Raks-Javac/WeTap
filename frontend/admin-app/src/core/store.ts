import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppEnvironment } from "./types";

interface GlobalAdminState {
  theme: "light" | "dark";
  environment: AppEnvironment;
  isAuthenticated: boolean;
  setTheme: (theme: "light" | "dark") => void;
  setEnvironment: (env: AppEnvironment) => void;
  login: () => void;
  logout: () => void;
}

export const useAdminStore = create<GlobalAdminState>()(
  persist(
    (set) => ({
      theme: "dark",
      environment: "dev",
      isAuthenticated: false,
      setTheme: (theme) => set({ theme }),
      setEnvironment: (environment) => set({ environment }),
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "wetap-admin-storage",
    },
  ),
);
