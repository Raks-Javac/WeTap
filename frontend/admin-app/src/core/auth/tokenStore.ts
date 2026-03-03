export interface AdminTokens {
  access: string;
  refresh: string;
}

const ACCESS_KEY = "wetap_admin_access";
const REFRESH_KEY = "wetap_admin_refresh";

export const adminTokenStore = {
  getAccessToken: () => localStorage.getItem(ACCESS_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setTokens: (tokens: AdminTokens) => {
    localStorage.setItem(ACCESS_KEY, tokens.access);
    localStorage.setItem(REFRESH_KEY, tokens.refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
