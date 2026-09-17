import { TAuthUser } from "@/@types/auth.types";
import { authUtils } from "@/utils/auth";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type TAuthState = {
  user?: TAuthUser;
  token?: string;
  authenticated: boolean;
  ready: boolean;
};

export type TAuthStore = {
  state: TAuthState;
  setState: (state: Partial<TAuthState>) => void;
  logout: () => void;
};

export const useAuthStore = create<TAuthStore, [["zustand/immer", never]]>(
  immer((set) => ({
    state: {
      user: undefined,
      token: undefined,
      authenticated: false,
      ready: false,
    },
    setState: (s) => {
      set((state) => {
        Object.assign(state.state, s);
      });
    },
    logout: () => {
      authUtils.removeAccessToken();
      set((state) => {
        state.state.user = undefined;
        state.state.token = undefined;
        state.state.authenticated = false;
        state.state.ready = true;
      });
    },
  }))
);

export const getAuthToken = () => useAuthStore.getState().state.token;
