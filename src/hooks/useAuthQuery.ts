"use client";

import { useAuthStore } from "@/state/auth";
import { InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions, useQuery } from "@tanstack/react-query";

const useAuthQuery = ((options) => {
  const authenticated = useAuthStore((state) => state.state.authenticated);

  return useQuery({
    ...options,
    enabled: (options.enabled ?? true) && authenticated,
  });
}) as typeof useQuery;

export default useAuthQuery;

export const useAuthInfiniteQuery = ((options) => {
  const authenticated = useAuthStore((state) => state.state.authenticated);

  return useInfiniteQuery({
    ...options,
    enabled: (options.enabled ?? true) && authenticated,
  });
}) as typeof useInfiniteQuery;
