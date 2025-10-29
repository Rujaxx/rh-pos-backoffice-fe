/**
 * Category Service Queries
 * TanStack Query hooks for category management
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { BaseApiService } from '@/services/api/base/client'
import { Category, CategoryFormData, CategoryQueryParams } from '@/types/category.type'
import { PaginatedResponse, SuccessResponse } from '@/types/api'
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api'

// Category service extending base service
class CategoryService extends BaseApiService<Category, CategoryFormData, CategoryFormData> {
  constructor() {
    super(API_ENDPOINTS.CATEGORIES.LIST)
  }

  // Get all categories with optional filters
  async getAllCategories(params?: CategoryQueryParams): Promise<PaginatedResponse<Category>> {
    return this.getAll(params)
  }

  // Get category by ID
  async getCategoryById(id: string): Promise<SuccessResponse<Category>> {
    return this.getById(id)
  }

  // Get active categories only (for dropdowns)
  async getActiveCategories(params?: Omit<CategoryQueryParams, 'isActive'>): Promise<PaginatedResponse<Category>> {
    return this.getAll({ ...params, isActive: 'true' })
  }

  // Get categories by brand ID
  async getCategoriesByBrand(brandId: string, params?: Omit<CategoryQueryParams, 'brandId'>): Promise<PaginatedResponse<Category>> {
    return this.getAll({ ...params, brandId })
  }

  // Get categories by parent category ID (subcategories)
  async getSubcategories(parentCategoryId: string, params?: Omit<CategoryQueryParams, 'parentCategoryId'>): Promise<PaginatedResponse<Category>> {
    return this.getAll({ ...params, parentCategoryId })
  }

  // Get root categories (categories without parent)
  async getRootCategories(params?: CategoryQueryParams): Promise<PaginatedResponse<Category>> {
    return this.getAll({ ...params, parentCategoryId: undefined })
  }
}

// Create service instance
const categoryService = new CategoryService()

// Query hooks

// Get all categories with pagination and filters
export const useCategories = (
  params?: CategoryQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Category>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST(params),
    queryFn: () => categoryService.getAllCategories(params),
    ...options,
  })
}

// Get single category by ID
export const useCategory = (
  id: string,
  options?: Omit<UseQueryOptions<SuccessResponse<Category>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.DETAIL(id),
    queryFn: () => categoryService.getCategoryById(id),
    enabled: !!id,
    ...options,
  })
}

// Get active categories only (for dropdowns and filters)
export const useActiveCategories = (
  params?: Omit<CategoryQueryParams, 'isActive'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Category>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST({ ...params, isActive: 'true' }),
    queryFn: () => categoryService.getActiveCategories(params),
    ...options,
  })
}

// Get categories by brand ID
export const useCategoriesByBrand = (
  brandId: string,
  params?: Omit<CategoryQueryParams, 'brandId'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Category>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST({ ...params, brandId }),
    queryFn: () => categoryService.getCategoriesByBrand(brandId, params),
    enabled: !!brandId,
    ...options,
  })
}

// Get subcategories by parent category ID
export const useSubcategories = (
  parentCategoryId: string,
  params?: Omit<CategoryQueryParams, 'parentCategoryId'>,
  options?: Omit<UseQueryOptions<PaginatedResponse<Category>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST({ ...params, parentCategoryId }),
    queryFn: () => categoryService.getSubcategories(parentCategoryId, params),
    enabled: !!parentCategoryId,
    ...options,
  })
}

// Get root categories (categories without parent)
export const useRootCategories = (
  params?: CategoryQueryParams,
  options?: Omit<UseQueryOptions<PaginatedResponse<Category>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST({ ...params, parentCategoryId: undefined }),
    queryFn: () => categoryService.getRootCategories(params),
    ...options,
  })
}

// Export service for use in mutations
export { categoryService }