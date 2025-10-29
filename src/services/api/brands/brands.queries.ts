/**
 * Brand Service Queries
 * TanStack Query hooks for brand management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BaseApiService } from '@/services/api/base/client'
import { Brand, BrandFormData, BrandQueryParams } from '@/types/brand.type'
import { PaginatedResponse, SuccessResponse } from '@/types/api'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api'

// Brand service extending base service
class BrandService extends BaseApiService<Brand, BrandFormData, BrandFormData> {
  constructor() {
    super(API_ENDPOINTS.BRANDS.LIST)
  }

  // Get all brands with optional filters
  async getAllBrands(params?: BrandQueryParams): Promise<PaginatedResponse<Brand>> {
    return this.getAll(params)
  }

  // Get brand by ID
  async getBrandById(id: string): Promise<SuccessResponse<Brand>> {
    return this.getById(id)
  }

  // Get active brands only (for dropdowns)
  async getActiveBrands(params?: Omit<BrandQueryParams, 'isActive'>): Promise<PaginatedResponse<Brand>> {
    return this.getAll({ ...params, isActive: 'true' })
  }
}

// Create service instance
const brandService = new BrandService()

// Query hooks

// Get all brands with pagination and filters
export const useBrands = (
  params?: BrandQueryParams,
  options?: UseQueryOptions<PaginatedResponse<Brand>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.BRANDS.LIST(params),
    queryFn: () => brandService.getAllBrands(params),
    ...options,
  })
}

// Get single brand by ID
export const useBrand = (
  id: string,
  options?: UseQueryOptions<SuccessResponse<Brand>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.BRANDS.DETAIL(id),
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id,
    ...options,
  })
}

// Get active brands only (for dropdowns and filters)
export const useActiveBrands = (
  params?: Omit<BrandQueryParams, 'isActive'>,
  options?: UseQueryOptions<PaginatedResponse<Brand>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.BRANDS.LIST({ ...params, isActive: 'true' }),
    queryFn: () => brandService.getActiveBrands(params),
    ...options,
  })
}


// Export service for use in mutations
export { brandService }