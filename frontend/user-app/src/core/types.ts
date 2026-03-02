export type ThemeContextType = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export type AppEnvironment = "dev" | "uat" | "prod";
