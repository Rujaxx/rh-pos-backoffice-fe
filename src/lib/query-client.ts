/**
 * TanStack Query Client Utilities
 * Utilities for working with query client instances
 */

import { useQueryClient, type QueryKey } from '@tanstack/react-query';

// Hook to get query utilities
export const useQueryUtils = () => {
  const queryClient = useQueryClient();

  return {
    // Clear all queries
    clearAll: () => queryClient.clear(),

    // Invalidate queries by key pattern
    invalidateQueries: (queryKey: QueryKey) =>
      queryClient.invalidateQueries({ queryKey }),

    // Refetch queries by key pattern
    refetchQueries: (queryKey: QueryKey) =>
      queryClient.refetchQueries({ queryKey }),

    // Remove queries by key pattern
    removeQueries: (queryKey: QueryKey) =>
      queryClient.removeQueries({ queryKey }),

    // Set query data
    setQueryData: <T>(queryKey: QueryKey, data: T) =>
      queryClient.setQueryData(queryKey, data),

    // Get query data
    getQueryData: <T>(queryKey: QueryKey) =>
      queryClient.getQueryData<T>(queryKey),
  };
};
