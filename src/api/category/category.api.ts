import {
  TCreateCategoryRequest,
  TGetCategoriesResponse,
  TGetCategoryResponse,
  TUpdateCategoryRequest,
} from "@/@types/category.types";
import authorizedRequest from "../request";

export const categoryApi = {
  getCategories: () => {
    return authorizedRequest.get<TGetCategoriesResponse, TGetCategoriesResponse>("/categories");
  },
  getCategoryById: (id: number) => {
    return authorizedRequest.get<TGetCategoryResponse, TGetCategoryResponse>(`/categories/${id}`);
  },
  createCategory: (data: TCreateCategoryRequest) => {
    return authorizedRequest.post<TGetCategoryResponse, TGetCategoryResponse>("/categories", data);
  },
  updateCategory: (id: number, data: TUpdateCategoryRequest) => {
    return authorizedRequest.patch<TGetCategoryResponse, TGetCategoryResponse>(`/categories/${id}`, data);
  },
  deleteCategory: (id: number) => {
    return authorizedRequest.delete<{ success: boolean }, { success: boolean }>(`/categories/${id}`);
  },
};
