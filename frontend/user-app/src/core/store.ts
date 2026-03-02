import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppEnvironment } from "../core/types";

interface GlobalState {
  theme: "light" | "dark";
  environment: AppEnvironment;
  setTheme: (theme: "light" | "dark") => void;
  setEnvironment: (env: AppEnvironment) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      theme: "dark",
      environment: "dev",
      setTheme: (theme) => set({ theme }),
      setEnvironment: (environment) => set({ environment }),
    }),
    {
      name: "wetap-global-storage",
    },
  ),
);
