import { TGetUserResponse, TGetUsersResponse, TUpdateUserRequest } from "@/@types/user.types";
import authorizedRequest from "../request";
import axios from "axios";

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
  getAvatarUploadUrl: (fileName: string, contentType: string) => {
    return authorizedRequest.post<
      { url: string; key: string },
      { url: string; key: string }
    >("/users/avatar-upload-url", { fileName, contentType });
  },
  uploadAvatarToStorage: async (uploadUrl: string, file: File): Promise<void> => {
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });
  },
};
