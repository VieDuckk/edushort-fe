import { ComponentProps } from "react";
import { QueryKey, UseQueryOptions } from "@tanstack/react-query";

export type DivProps = ComponentProps<"div">;

export type SortDirectionType = "desc" | "asc";

export type BaseApiParamsType = Partial<{
  page: number;
  limit: number;
  sortBy: string;
  sortDirection: SortDirectionType;
  search: string;
}>;

export type MetadataApiType = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type TQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "initialData" | "queryFn">;

export type TBaseRecord<D> = D & {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type TPageParams = {
  page: number;
  limit: number;
};

export type TPageParamsWithSort = TPageParams & {
  sortBy?: string;
  sortDirection?: SortDirectionType;
  search?: string;
};
