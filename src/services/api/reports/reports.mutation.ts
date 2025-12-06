/**
 * Reports Mutations
 * TanStack Query mutations for bill operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Bill } from '@/types/bill.type';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import api from '@/lib/axios';

// Update bill mutation (can update any fields including status, payments, etc.)
export const useUpdateBill = (
  options?: UseMutationOptions<
    SuccessResponse<Bill>,
    Error,
    { billId: string; data: Partial<Bill> }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ billId, data }) => {
      return api.patch(API_ENDPOINTS.BILLS.UPDATE(billId), data);
    },

    onSuccess: () => {
      // Invalidate reports list to refresh the data
      queryUtils.invalidateQueries(['reports', 'list']);
    },

    onError: (error) => {
      // Error toast is handled by the component
      console.error('Failed to update bill:', error);
    },

    ...options,
  });
};

// Delete bill mutation
export const useDeleteBill = (
  options?: UseMutationOptions<
    SuccessResponse<void>,
    Error,
    { billId: string }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ billId }) => {
      return api.delete(API_ENDPOINTS.BILLS.DELETE(billId));
    },

    onSuccess: () => {
      // Invalidate reports list to refresh the data
      queryUtils.invalidateQueries(['reports', 'list']);
    },

    onError: (error) => {
      // Error toast is handled by the component
      console.error('Failed to delete bill:', error);
    },

    ...options,
  });
};
