import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import {
  Discount,
  DiscountFormData,
  DiscountQueryParams,
} from '@/types/discount.type';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Discount service extending base service
class DiscountService extends BaseApiService<
  Discount,
  DiscountFormData,
  DiscountFormData
> {
  constructor() {
    super(API_ENDPOINTS.DISCOUNTS.LIST);
  }

  // Get all discounts (with filters)
  async getAllDiscounts(
    params?: DiscountQueryParams,
  ): Promise<PaginatedResponse<Discount>> {
    return this.getAll(params);
  }

  // Get single discount by ID
  async getDiscountById(id: string): Promise<SuccessResponse<Discount>> {
    return this.getById(id);
  }

  // Get only active discounts
  async getActiveDiscounts(
    params?: Omit<DiscountQueryParams, 'isActive'>,
  ): Promise<PaginatedResponse<Discount>> {
    return this.getAll({ ...params, isActive: 'true' });
  }

  // Get discounts filtered by brand
  async getDiscountsByBrand(
    brandId: string,
    params?: Omit<DiscountQueryParams, 'brandId'>,
  ): Promise<PaginatedResponse<Discount>> {
    return this.getAll({ ...params, brandId });
  }

  // Get discounts filtered by restaurant
  async getDiscountsByRestaurant(
    restaurantId: string,
    params?: Omit<DiscountQueryParams, 'restaurantId'>,
  ): Promise<PaginatedResponse<Discount>> {
    return this.getAll({ ...params, restaurantId });
  }
}

const discountService = new DiscountService();

export const useDiscounts = (
  params?: DiscountQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Discount>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISCOUNTS.LIST(params),
    queryFn: () => discountService.getAllDiscounts(params),
    ...options,
  });
};

// Get single discount by ID
export const useDiscount = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<Discount>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISCOUNTS.DETAIL(id),
    queryFn: () => discountService.getDiscountById(id),
    enabled: !!id,
    ...options,
  });
};

// Get only active discounts
export const useActiveDiscounts = (
  params?: Omit<DiscountQueryParams, 'isActive'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Discount>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISCOUNTS.LIST({
      ...params,
      isActive: 'true',
    }),
    queryFn: () => discountService.getActiveDiscounts(params),
    ...options,
  });
};

// Get discounts by brand
export const useDiscountsByBrand = (
  brandId: string,
  params?: Omit<DiscountQueryParams, 'brandId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Discount>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISCOUNTS.LIST({
      ...params,
      brandId,
    }),
    queryFn: () => discountService.getDiscountsByBrand(brandId, params),
    enabled: !!brandId,
    ...options,
  });
};

// Get discounts by restaurant
export const useDiscountsByRestaurant = (
  restaurantId: string,
  params?: Omit<DiscountQueryParams, 'restaurantId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Discount>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.DISCOUNTS.LIST({
      ...params,
      restaurantId,
    }),
    queryFn: () =>
      discountService.getDiscountsByRestaurant(restaurantId, params),
    enabled: !!restaurantId,
    ...options,
  });
};

export { discountService };
