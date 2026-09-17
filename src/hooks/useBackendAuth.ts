"use client";

import { authApi } from "@/api/auth/auth.api";
import { useAuthStore } from "@/state/auth";
import { authUtils } from "@/utils/auth";
import { useEffect } from "react";

export default function useBackendAuth() {
  const { setState: setAuth } = useAuthStore();

  useEffect(() => {
    const token = authUtils.getAccessToken();
    if (!token) {
      setAuth({
        user: undefined,
        token: undefined,
        authenticated: false,
        ready: true,
      });
      return;
    }

    // Restore session with saved token
    authApi
      .me()
      .then((user) => {
        setAuth({
          user,
          token,
          authenticated: true,
          ready: true,
        });
      })
      .catch(() => {
        authUtils.removeAccessToken();
        setAuth({
          user: undefined,
          token: undefined,
          authenticated: false,
          ready: true,
        });
      });
  }, [setAuth]);
}
