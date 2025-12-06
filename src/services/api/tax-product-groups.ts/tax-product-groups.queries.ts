import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import {
  TaxProductGroup,
  TaxProductGroupFormData,
  TaxProductGroupQueryParams,
} from '@/types/tax-product-group.type';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Tax Product Group service extending base service
class TaxProductGroupService extends BaseApiService<
  TaxProductGroup,
  TaxProductGroupFormData,
  TaxProductGroupFormData
> {
  constructor() {
    super(API_ENDPOINTS.TAX_PRODUCT_GROUPS.LIST);
  }

  // Get all tax product groups (with filters)
  async getAllTaxProductGroups(
    params?: TaxProductGroupQueryParams,
  ): Promise<PaginatedResponse<TaxProductGroup>> {
    return this.getAll(params);
  }

  // Get single tax product group by ID
  async getTaxProductGroupById(
    id: string,
  ): Promise<SuccessResponse<TaxProductGroup>> {
    return this.getById(id);
  }

  // Get only active groups
  async getActiveTaxProductGroups(
    params?: Omit<TaxProductGroupQueryParams, 'isActive'>,
  ): Promise<PaginatedResponse<TaxProductGroup>> {
    return this.getAll({ ...params, isActive: 'true' });
  }

  // Get groups filtered by brand
  async getTaxProductGroupsByBrand(
    brandId: string,
    params?: Omit<TaxProductGroupQueryParams, 'brandId'>,
  ): Promise<PaginatedResponse<TaxProductGroup>> {
    return this.getAll({ ...params, brandId });
  }

  // Get groups filtered by restaurant
  async getTaxProductGroupsByRestaurant(
    restaurantId: string,
    params?: Omit<TaxProductGroupQueryParams, 'restaurantId'>,
  ): Promise<PaginatedResponse<TaxProductGroup>> {
    return this.getAll({ ...params, restaurantId });
  }
}

const taxProductGroupService = new TaxProductGroupService();

export const useTaxProductGroups = (
  params?: TaxProductGroupQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TaxProductGroup>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_PRODUCT_GROUPS.LIST(params),
    queryFn: () => taxProductGroupService.getAllTaxProductGroups(params),
    ...options,
  });
};

// Get single group by ID
export const useTaxProductGroup = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<TaxProductGroup>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_PRODUCT_GROUPS.DETAIL(id),
    queryFn: () => taxProductGroupService.getTaxProductGroupById(id),
    enabled: !!id,
    ...options,
  });
};

// Get only active groups
export const useActiveTaxProductGroups = (
  params?: Omit<TaxProductGroupQueryParams, 'isActive'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TaxProductGroup>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_PRODUCT_GROUPS.LIST({
      ...params,
      isActive: 'true',
    }),
    queryFn: () => taxProductGroupService.getActiveTaxProductGroups(params),
    ...options,
  });
};

// Get groups by brand
export const useTaxProductGroupsByBrand = (
  brandId: string,
  params?: Omit<TaxProductGroupQueryParams, 'brandId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TaxProductGroup>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_PRODUCT_GROUPS.LIST({
      ...params,
      brandId,
    }),
    queryFn: () =>
      taxProductGroupService.getTaxProductGroupsByBrand(brandId, params),
    enabled: !!brandId,
    ...options,
  });
};

// Get groups by restaurant
export const useTaxProductGroupsByRestaurant = (
  restaurantId: string,
  params?: Omit<TaxProductGroupQueryParams, 'restaurantId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<TaxProductGroup>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_PRODUCT_GROUPS.LIST({
      ...params,
      restaurantId,
    }),
    queryFn: () =>
      taxProductGroupService.getTaxProductGroupsByRestaurant(
        restaurantId,
        params,
      ),
    enabled: !!restaurantId,
    ...options,
  });
};

export { taxProductGroupService };
