/**
 * Table Section Service Queries
 * TanStack Query hooks for table section management
 */

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { BaseApiService } from "@/services/api/base/client";
import {
  TableSection,
  TableSectionFormData,
  TableSectionQueryParams,
} from "@/types/table-section.type";
import { PaginatedResponse, SuccessResponse } from "@/types/api";
import { API_ENDPOINTS, QUERY_KEYS } from "@/config/api";

// Table Section service extending base service
class TableSectionService extends BaseApiService<
  TableSection,
  TableSectionFormData,
  TableSectionFormData
> {
  constructor() {
    super(API_ENDPOINTS.TABLE_SECTIONS.LIST);
  }

  // Get all table sections with optional filters
  async getAllTableSections(
    params?: TableSectionQueryParams,
  ): Promise<PaginatedResponse<TableSection>> {
    return this.getAll(params);
  }

  // Get table section by ID
  async getTableSectionById(
    id: string,
  ): Promise<SuccessResponse<TableSection>> {
    return this.getById(id);
  }

  // Get active table sections only (for dropdowns)
  async getActiveTableSections(
    params?: Omit<TableSectionQueryParams, "isActive">,
  ): Promise<PaginatedResponse<TableSection>> {
    return this.getAll({ ...params, isActive: "true" });
  }

  // Get table sections by restaurant ID
  async getTableSectionsByRestaurant(
    restaurantId: string,
    params?: Omit<TableSectionQueryParams, "restaurantId">,
  ): Promise<PaginatedResponse<TableSection>> {
    return this.getAll({ ...params, restaurantId });
  }
}

// Create service instance
const tableSectionService = new TableSectionService();

// Query hooks

// Get all table sections with pagination and filters
export const useGetTableSections = (
  params?: TableSectionQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TableSection>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLE_SECTIONS.LIST(params),
    queryFn: () => tableSectionService.getAllTableSections(params),
    ...options,
  });
};

// Get single table section by ID
export const useGetTableSection = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<TableSection>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLE_SECTIONS.DETAIL(id),
    queryFn: () => tableSectionService.getTableSectionById(id),
    enabled: !!id,
    ...options,
  });
};

// Get active table sections only (for dropdowns and filters)
export const useGetActiveTableSections = (
  params?: Omit<TableSectionQueryParams, "isActive">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TableSection>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLE_SECTIONS.LIST({ ...params, isActive: "true" }),
    queryFn: () => tableSectionService.getActiveTableSections(params),
    ...options,
  });
};

// Get table sections by restaurant ID
export const useGetTableSectionsByRestaurant = (
  restaurantId: string,
  params?: Omit<TableSectionQueryParams, "restaurantId">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TableSection>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TABLE_SECTIONS.LIST({ ...params, restaurantId }),
    queryFn: () =>
      tableSectionService.getTableSectionsByRestaurant(restaurantId, params),
    enabled: !!restaurantId,
    ...options,
  });
};

// Export service for use in mutations
export { tableSectionService };
