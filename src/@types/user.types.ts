import { EUserRole, TAuthUser } from "./auth.types";
import { TBaseRecord } from "./common.types";

export type TUser = TBaseRecord<{
  email: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
  role: EUserRole;
}>;

export type TUpdateUserRequest = Partial<{
  email: string;
  username: string;
  name: string;
  avatarUrl: string;
  role: EUserRole;
}>;

export type TGetUserResponse = TUser;
export type TGetUsersResponse = TUser[];
