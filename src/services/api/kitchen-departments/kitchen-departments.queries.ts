import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { BaseApiService } from "@/services/api/base/client";
import {
  KitchenDepartment,
  KitchenDepartmentFormData,
  KitchenDepartmentQueryParams,
} from "@/types/kitchen-department.type";
import { PaginatedResponse, SuccessResponse } from "@/types/api";
import { API_ENDPOINTS, QUERY_KEYS } from "@/config/api";

// Kitchen Department service extending base service
class KitchenDepartmentService extends BaseApiService<
  KitchenDepartment,
  KitchenDepartmentFormData,
  KitchenDepartmentFormData
> {
  constructor() {
    super(API_ENDPOINTS.KITCHEN_DEPARTMENTS.LIST);
  }

  // Get all departments with optional filters
  async getAllKitchenDepartments(
    params?: KitchenDepartmentQueryParams,
  ): Promise<PaginatedResponse<KitchenDepartment>> {
    return this.getAll(params);
  }

  // Get department by ID
  async getKitchenDepartmentById(
    id: string,
  ): Promise<SuccessResponse<KitchenDepartment>> {
    return this.getById(id);
  }

  // Get active-only departments
  async getActiveKitchenDepartments(
    params?: Omit<KitchenDepartmentQueryParams, "isActive">,
  ): Promise<PaginatedResponse<KitchenDepartment>> {
    return this.getAll({ ...params, isActive: "true" });
  }

  // Filter departments by brand
  async getKitchenDepartmentsByBrand(
    brandId: string,
    params?: Omit<KitchenDepartmentQueryParams, "brandId">,
  ): Promise<PaginatedResponse<KitchenDepartment>> {
    return this.getAll({ ...params, brandId });
  }

  // Filter departments by restaurant
  async getKitchenDepartmentsByRestaurant(
    restaurantId: string,
    params?: Omit<KitchenDepartmentQueryParams, "restaurantId">,
  ): Promise<PaginatedResponse<KitchenDepartment>> {
    return this.getAll({ ...params, restaurantId });
  }
}

// Create service instance
const kitchenDepartmentService = new KitchenDepartmentService();

// Query hooks

// Get all departments
export const useKitchenDepartments = (
  params?: KitchenDepartmentQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<KitchenDepartment>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.KITCHEN_DEPARTMENTS.LIST(params),
    queryFn: () => kitchenDepartmentService.getAllKitchenDepartments(params),
    ...options,
  });
};

// Get single department by ID
export const useKitchenDepartment = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<KitchenDepartment>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.KITCHEN_DEPARTMENTS.DETAIL(id),
    queryFn: () => kitchenDepartmentService.getKitchenDepartmentById(id),
    enabled: !!id,
    ...options,
  });
};

// Get active-only departments
export const useActiveKitchenDepartments = (
  params?: Omit<KitchenDepartmentQueryParams, "isActive">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<KitchenDepartment>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.KITCHEN_DEPARTMENTS.LIST({
      ...params,
      isActive: "true",
    }),
    queryFn: () => kitchenDepartmentService.getActiveKitchenDepartments(params),
    ...options,
  });
};

// Get departments by brand
export const useKitchenDepartmentsByBrand = (
  brandId: string,
  params?: Omit<KitchenDepartmentQueryParams, "brandId">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<KitchenDepartment>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.KITCHEN_DEPARTMENTS.LIST({ ...params, brandId }),
    queryFn: () =>
      kitchenDepartmentService.getKitchenDepartmentsByBrand(brandId, params),
    enabled: !!brandId,
    ...options,
  });
};

// Get departments by restaurant
export const useKitchenDepartmentsByRestaurant = (
  restaurantId: string,
  params?: Omit<KitchenDepartmentQueryParams, "restaurantId">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<KitchenDepartment>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.KITCHEN_DEPARTMENTS.LIST({
      ...params,
      restaurantId,
    }),
    queryFn: () =>
      kitchenDepartmentService.getKitchenDepartmentsByRestaurant(
        restaurantId,
        params,
      ),
    enabled: !!restaurantId,
    ...options,
  });
};

// Export service for use in mutations
export { kitchenDepartmentService };
