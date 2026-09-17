import { TQueryOptions } from "@/@types/common.types";
import { TGetUserResponse, TGetUsersResponse, TUpdateUserRequest } from "@/@types/user.types";
import { userApi } from "@/api/user/user.api";
import { QUERY_KEYS } from "@/configs/constants";
import useAuthQuery from "@/hooks/useAuthQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TUseUsersQueryOptions = TQueryOptions<TGetUsersResponse>;

export function useUsersQuery(options?: TUseUsersQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: () => userApi.getUsers(),
    staleTime: 30_000,
    ...options,
  });
}

export type TUseUserDetailQueryOptions = TQueryOptions<TGetUserResponse>;

export function useUserDetailQuery(id: number, options?: TUseUserDetailQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_DETAIL, id],
    queryFn: () => userApi.getUserById(id),
    staleTime: 30_000,
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useUserProfileQuery(options?: TUseUserDetailQueryOptions) {
  return useAuthQuery({
    queryKey: [QUERY_KEYS.AUTH_ME],
    queryFn: () => userApi.getUsers().then((users) => users[0]), // or profile endpoint
    ...options,
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetUserResponse, Error, { id: number; data: TUpdateUserRequest }>({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_DETAIL, variables.id] });
    },
  });
}
