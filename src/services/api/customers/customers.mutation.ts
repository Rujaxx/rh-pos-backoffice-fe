/**
 * Customer Mutations
 * TanStack Query mutations for customer operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Customer, CustomerFormData } from '@/types/customers.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { customerService } from './customers.queries';
import { toast } from 'sonner';

// Create customer mutation
export const useCreateCustomer = (
  options?: UseMutationOptions<
    SuccessResponse<Customer>,
    Error,
    CustomerFormData
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: CustomerFormData) => {
      const result = await customerService.create(data);
      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Customer created successfully');

      // Invalidate and refetch customers list - use partial matching to catch all customer list queries
      queryUtils.invalidateQueries(['customers', 'list']);

      // Set the new customer in cache
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.CUSTOMERS.DETAIL(data.data._id),
          data,
        );
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to create customer';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update customer mutation
export const useUpdateCustomer = (
  options?: UseMutationOptions<
    SuccessResponse<Customer>,
    Error,
    { id: string; data: CustomerFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CustomerFormData;
    }) => {
      // Exclude _id from data for update
      const { _id, ...dataWithoutId } = data;
      const result = await customerService.update(id, dataWithoutId);
      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Show success message
      toast.success('Customer updated successfully'); // FIXED: Changed from "Table" to "Customer"

      // Update specific customer cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.CUSTOMERS.DETAIL(id), data); // FIXED: Changed from TABLES to CUSTOMERS
      }

      // Invalidate customers list to refresh the list - use partial matching
      queryUtils.invalidateQueries(['customers', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update customer'; // FIXED: Changed from "table" to "customer"
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete customer mutation
export const useDeleteCustomer = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success('Customer deleted successfully');

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.CUSTOMERS.DETAIL(id));

      // Invalidate customers list - use partial matching
      queryUtils.invalidateQueries(['customers', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to delete customer'; // FIXED: Changed from "table" to "customer"
      toast.error(errorMessage);
    },
    ...options,
  });
};
