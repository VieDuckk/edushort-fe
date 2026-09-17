"use client";

import useBackendAuth from "@/hooks/useBackendAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";
import { Toaster } from "sonner";

function AppInitializer({ children }: { children: React.ReactNode }) {
  useBackendAuth();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer>{children}</AppInitializer>
      <Toaster position="top-center" richColors closeButton duration={3500} />
    </QueryClientProvider>
  );
}
