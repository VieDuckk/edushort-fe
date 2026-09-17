import { ACCESS_TOKEN_KEY } from "@/configs/constants";

export const authUtils = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY) || window.localStorage.getItem("token");
  },
  setAccessToken: (at: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, at);
    window.localStorage.setItem("token", at);
  },
  removeAccessToken: (): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem("token");
  },
};
