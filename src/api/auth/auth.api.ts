import { TAuthMeResponse, TAuthResponse, TLoginRequest, TRegisterRequest } from "@/@types/auth.types";
import authorizedRequest from "../request";

export const authApi = {
  login: (data: TLoginRequest) => {
    return authorizedRequest.post<TAuthResponse, TAuthResponse>("/auth/login", data);
  },
  register: (data: TRegisterRequest) => {
    return authorizedRequest.post<TAuthResponse, TAuthResponse>("/auth/register", data);
  },
  me: () => {
    return authorizedRequest.get<TAuthMeResponse, TAuthMeResponse>("/auth/me");
  },
};
