/**
 * Restaurant Service Queries
 * TanStack Query hooks for restaurant management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BaseApiService } from '@/services/api/base/client'
import { Restaurant, RestaurantFormData, RestaurantQueryParams } from '@/types/restaurant'
import { PaginatedResponse, SuccessResponse } from '@/types/api'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api'

// Restaurant service extending base service
class RestaurantService extends BaseApiService<Restaurant, RestaurantFormData, RestaurantFormData> {
  constructor() {
    super(API_ENDPOINTS.RESTAURANTS.LIST)
  }

  // Get all restaurants with optional filters
  async getAllRestaurants(params?: RestaurantQueryParams): Promise<PaginatedResponse<Restaurant>> {
    return this.getAll(params)
  }

  // Get restaurant by ID
  async getRestaurantById(id: string): Promise<SuccessResponse<Restaurant>> {
    return this.getById(id)
  }

  // Get active restaurants only (for dropdowns)
  async getActiveRestaurants(params?: Omit<RestaurantQueryParams, 'isActive'>): Promise<PaginatedResponse<Restaurant>> {
    return this.getAll({ ...params, isActive: 'true' })
  }

  // Get restaurants by brand ID
  async getRestaurantsByBrand(brandId: string, params?: Omit<RestaurantQueryParams, 'brandId'>): Promise<PaginatedResponse<Restaurant>> {
    return this.getAll({ ...params, brandId })
  }
}

// Create service instance
const restaurantService = new RestaurantService()

// Query hooks

// Get all restaurants with pagination and filters
export const useRestaurants = (
  params?: RestaurantQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Restaurant>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS.LIST(params),
    queryFn: () => restaurantService.getAllRestaurants(params),
    ...options,
  })
}

// Get single restaurant by ID
export const useRestaurant = (
  id: string,
  options?: Omit<UseQueryOptions<SuccessResponse<Restaurant>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS.DETAIL(id),
    queryFn: () => restaurantService.getRestaurantById(id),
    enabled: !!id,
    ...options,
  })
}

// Get active restaurants only (for dropdowns and filters)
export const useActiveRestaurants = (
  params?: Omit<RestaurantQueryParams, 'isActive'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Restaurant>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS.LIST({ ...params, isActive: 'true' }),
    queryFn: () => restaurantService.getActiveRestaurants(params),
    ...options,
  })
}

// Get restaurants by brand ID
export const useRestaurantsByBrand = (
  brandId: string,
  params?: Omit<RestaurantQueryParams, 'brandId'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Restaurant>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESTAURANTS.LIST({ ...params, brandId }),
    queryFn: () => restaurantService.getRestaurantsByBrand(brandId, params),
    enabled: !!brandId,
    ...options,
  })
}

// Export service for use in mutations
export { restaurantService }