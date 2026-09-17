import {
  TCreateCategoryRequest,
  TGetCategoriesResponse,
  TGetCategoryResponse,
  TUpdateCategoryRequest,
} from "@/@types/category.types";
import { TQueryOptions } from "@/@types/common.types";
import { categoryApi } from "@/api/category/category.api";
import { QUERY_KEYS } from "@/configs/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TUseCategoriesQueryOptions = TQueryOptions<TGetCategoriesResponse>;

export function useCategoriesQuery(options?: TUseCategoriesQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: () => categoryApi.getCategories(),
    staleTime: 60_000,
    ...options,
  });
}

export type TUseCategoryDetailQueryOptions = TQueryOptions<TGetCategoryResponse>;

export function useCategoryDetailQuery(id: number, options?: TUseCategoryDetailQueryOptions) {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_DETAIL, id],
    queryFn: () => categoryApi.getCategoryById(id),
    staleTime: 60_000,
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetCategoryResponse, Error, TCreateCategoryRequest>({
    mutationFn: (data) => categoryApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<TGetCategoryResponse, Error, { id: number; data: TUpdateCategoryRequest }>({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORY_DETAIL, variables.id] });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, number>({
    mutationFn: (id) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    },
  });
}
