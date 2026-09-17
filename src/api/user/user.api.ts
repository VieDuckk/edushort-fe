import { TGetUserResponse, TGetUsersResponse, TUpdateUserRequest } from "@/@types/user.types";
import authorizedRequest from "../request";

export const userApi = {
  getUsers: () => {
    return authorizedRequest.get<TGetUsersResponse, TGetUsersResponse>("/users");
  },
  getUserById: (id: number) => {
    return authorizedRequest.get<TGetUserResponse, TGetUserResponse>(`/users/${id}`);
  },
  updateUser: (id: number, data: TUpdateUserRequest) => {
    return authorizedRequest.patch<TGetUserResponse, TGetUserResponse>(`/users/${id}`, data);
  },
};
