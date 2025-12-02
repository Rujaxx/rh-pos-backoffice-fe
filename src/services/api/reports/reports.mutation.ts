/**
 * Reports Mutations
 * TanStack Query mutations for bill operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  Bill,
  UpdateBillStatusDto,
  UpdatePaymentStatusDto,
} from '@/types/report.type';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import api from '@/lib/axios';
import { toast } from 'sonner';

// Update bill mutation (can update any fields)
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

    onSuccess: (data, variables) => {
      const { billId } = variables;

      toast.success('Bill updated successfully');

      // Invalidate reports list to refresh the data
      queryUtils.invalidateQueries(['reports', 'list']);
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update bill');
    },

    ...options,
  });
};

// Update bill status mutation
export const useUpdateBillStatus = (
  options?: UseMutationOptions<
    SuccessResponse<Bill>,
    Error,
    { billId: string; data: UpdateBillStatusDto }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ billId, data }) => {
      return api.patch(API_ENDPOINTS.BILLS.UPDATE(billId), data);
    },

    onSuccess: (data, variables) => {
      const { billId } = variables;

      toast.success('Bill status updated successfully');

      // Invalidate reports list to refresh the data
      queryUtils.invalidateQueries(['reports', 'list']);
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update bill status');
    },

    ...options,
  });
};

// Update payment status mutation
export const useUpdatePaymentStatus = (
  options?: UseMutationOptions<
    SuccessResponse<Bill>,
    Error,
    { billId: string; data: UpdatePaymentStatusDto }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ billId, data }) => {
      return api.patch(API_ENDPOINTS.BILLS.UPDATE(billId), data);
    },

    onSuccess: (data, variables) => {
      const { billId } = variables;

      toast.success('Payment status updated successfully');

      // Invalidate reports list to refresh the data
      queryUtils.invalidateQueries(['reports', 'list']);
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update payment status');
    },

    ...options,
  });
};
