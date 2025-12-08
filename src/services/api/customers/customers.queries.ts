/**
 * Brand Service Queries
 * TanStack Query hooks for brand management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import {
  Customer,
  CustomerFormData,
  CustomerQueryParams,
} from '@/types/customers.type';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

class CustomerService extends BaseApiService<
  Customer,
  CustomerFormData,
  CustomerFormData
> {
  constructor() {
    super(API_ENDPOINTS.CUSTOMERS.LIST);
  }

  // Get all customers with optional filters
  async getAllCustomers(
    params?: CustomerQueryParams,
  ): Promise<PaginatedResponse<Customer>> {
    return this.getAll(params);
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<SuccessResponse<Customer>> {
    return this.getById(id);
  }
}

// Create service instance
const customerService = new CustomerService();

// Query hooks

// Get all customers with pagination and filters
export const useCustomers = (
  params?: CustomerQueryParams,
  options?: UseQueryOptions<PaginatedResponse<Customer>>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS.LIST(params),
    queryFn: () => customerService.getAllCustomers(params),
    ...options,
  });
};

// Get single customer by ID
export const useCustomer = (
  id: string,
  options?: UseQueryOptions<SuccessResponse<Customer>>,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CUSTOMERS.DETAIL(id),
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
    ...options,
  });
};

// Export service for use in mutations
export { customerService };
