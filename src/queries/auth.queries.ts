import { TAuthMeResponse, TAuthResponse, TLoginRequest, TRegisterRequest } from "@/@types/auth.types";
import { TQueryOptions } from "@/@types/common.types";
import { authApi } from "@/api/auth/auth.api";
import { QUERY_KEYS } from "@/configs/constants";
import useAuthQuery from "@/hooks/useAuthQuery";
import { useAuthStore } from "@/state/auth";
import { authUtils } from "@/utils/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type TUseAuthMeQueryOptions = TQueryOptions<TAuthMeResponse>;

export function useAuthMeQuery(options?: TUseAuthMeQueryOptions) {
  return useAuthQuery({
    queryKey: [QUERY_KEYS.AUTH_ME],
    queryFn: () => authApi.me(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    ...options,
    enabled: options?.enabled ?? false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { setState: setAuth } = useAuthStore();

  return useMutation<TAuthResponse, Error, TLoginRequest>({
    mutationFn: (data: TLoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      const token = res.accessToken || res.access_token || "";
      if (token) {
        authUtils.setAccessToken(token);
      }
      setAuth({
        user: res.user,
        token: token,
        authenticated: true,
        ready: true,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_ME] });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const { setState: setAuth } = useAuthStore();

  return useMutation<TAuthResponse, Error, TRegisterRequest>({
    mutationFn: (data: TRegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      const token = res.accessToken || res.access_token || "";
      if (token) {
        authUtils.setAccessToken(token);
      }
      setAuth({
        user: res.user,
        token: token,
        authenticated: true,
        ready: true,
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTH_ME] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return () => {
    logout();
    queryClient.clear();
  };
}
