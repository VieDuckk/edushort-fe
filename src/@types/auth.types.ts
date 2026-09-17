export enum EUserRole {
  USER = "USER",
  OWNER = "OWNER",
}

export type TAuthUser = {
  id: number;
  email: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  role: EUserRole;
  createdAt: string;
  updatedAt?: string;
};

export type TLoginRequest = {
  identifier: string;
  password: string;
};

export type TRegisterRequest = {
  email: string;
  username: string;
  password: string;
  name?: string;
  avatarUrl?: string;
};

export type TAuthResponse = {
  accessToken: string;
  access_token?: string;
  user: TAuthUser;
};

export type TAuthMeResponse = TAuthUser;
