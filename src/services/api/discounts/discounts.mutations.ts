import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Discount, DiscountFormData } from '@/types/discount.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { discountService } from './discounts.queries';
import { toast } from 'sonner';

// Create discount mutation
export const useCreateDiscount = (
  options?: UseMutationOptions<
    SuccessResponse<Discount>,
    Error,
    DiscountFormData
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: DiscountFormData) => {
      return await discountService.create(data);
    },

    onSuccess: (data) => {
      toast.success('Discount created successfully');

      // Invalidate list queries
      queryUtils.invalidateQueries(['discounts', 'list']);

      // Cache the created item
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.DISCOUNTS.DETAIL(data.data._id!),
          data,
        );
      }
    },

    onError: (error) => {
      const msg = error.message || 'Failed to create discount';
      toast.error(msg);
    },

    ...options,
  });
};

// Update discount mutation
export const useUpdateDiscount = (
  options?: UseMutationOptions<
    SuccessResponse<Discount>,
    Error,
    { id: string; data: DiscountFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { _id, ...dataWithoutId } = data;
      return await discountService.update(id, dataWithoutId);
    },

    onSuccess: (data, variables) => {
      const { id } = variables;

      toast.success('Discount updated successfully');

      // Update cached detail
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.DISCOUNTS.DETAIL(id), data);
      }

      // Refresh list
      queryUtils.invalidateQueries(['discounts', 'list']);
    },

    onError: (error) => {
      const msg = error.message || 'Failed to update discount';
      toast.error(msg);
    },

    ...options,
  });
};

// Delete discount mutation
export const useDeleteDiscount = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (id: string) => {
      return await discountService.delete(id);
    },

    onSuccess: (_, id) => {
      toast.success('Discount deleted successfully');

      // Remove cached detail
      queryUtils.removeQueries(QUERY_KEYS.DISCOUNTS.DETAIL(id));

      // Refresh list
      queryUtils.invalidateQueries(['discounts', 'list']);
    },

    onError: (error) => {
      const msg = error.message || 'Failed to delete discount';
      toast.error(msg);
    },

    ...options,
  });
};
