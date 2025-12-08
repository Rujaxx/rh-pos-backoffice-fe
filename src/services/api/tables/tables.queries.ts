/**
 * Table Service Queries
 * TanStack Query hooks for table management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { Table, TableFormData, TableQueryParams } from '@/types/table';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Table service extending base service
class TableService extends BaseApiService<Table, TableFormData, TableFormData> {
  constructor() {
    super(API_ENDPOINTS.TABLES.LIST);
  }

  // Get all tables with optional filters
  async getAllTables(
    params?: TableQueryParams,
  ): Promise<PaginatedResponse<Table>> {
    return this.getAll(params);
  }

  // Get table by ID
  async getTableById(id: string): Promise<SuccessResponse<Table>> {
    return this.getById(id);
  }

  // Get available tables only (for reservations/orders)
  async getAvailableTables(
    params?: Omit<TableQueryParams, 'isAvailable'>,
  ): Promise<PaginatedResponse<Table>> {
    return this.getAll({ ...params, isAvailable: 'true' });
  }

  // Get tables by restaurant ID
  async getTablesByRestaurant(
    restaurantId: string,
    params?: Omit<TableQueryParams, 'restaurantId'>,
  ): Promise<PaginatedResponse<Table>> {
    return this.getAll({ ...params, restaurantId });
  }

  // Get tables by table section ID
  async getTablesBySection(
    tableSectionId: string,
    params?: Omit<TableQueryParams, 'tableSectionId'>,
  ): Promise<PaginatedResponse<Table>> {
    return this.getAll({ ...params, tableSectionId });
  }

  // Get tables with minimum capacity
  async getTablesByCapacity(
    capacity: number,
    params?: Omit<TableQueryParams, 'capacity'>,
  ): Promise<PaginatedResponse<Table>> {
    return this.getAll({ ...params, capacity });
  }
}

// Create service instance
const tableService = new TableService();

// Query hooks

// Get all tables with pagination and filters
export const useTables = (
  params?: TableQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES.LIST(params),
    queryFn: () => tableService.getAllTables(params),
    ...options,
  });
};

// Get single table by ID
export const useTable = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES.DETAIL(id),
    queryFn: () => tableService.getTableById(id),
    enabled: !!id,
    ...options,
  });
};

// Get available tables only (for reservations/orders)
export const useAvailableTables = (
  params?: Omit<TableQueryParams, 'isAvailable'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES.LIST({ ...params, isAvailable: 'true' }),
    queryFn: () => tableService.getAvailableTables(params),
    ...options,
  });
};

// Get tables by restaurant ID
export const useTablesByRestaurant = (
  restaurantId: string,
  params?: Omit<TableQueryParams, 'restaurantId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES.LIST({ ...params, restaurantId }),
    queryFn: () => tableService.getTablesByRestaurant(restaurantId, params),
    enabled: !!restaurantId,
    ...options,
  });
};

// Get tables by table section ID
export const useTablesBySection = (
  tableSectionId: string,
  params?: Omit<TableQueryParams, 'tableSectionId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES.LIST({ ...params, tableSectionId }),
    queryFn: () => tableService.getTablesBySection(tableSectionId, params),
    enabled: !!tableSectionId,
    ...options,
  });
};

// Get tables with minimum capacity
export const useTablesByCapacity = (
  capacity: number,
  params?: Omit<TableQueryParams, 'capacity'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Table>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLES.LIST({ ...params, capacity }),
    queryFn: () => tableService.getTablesByCapacity(capacity, params),
    enabled: capacity > 0,
    ...options,
  });
};

// Export service for use in mutations
export { tableService };
