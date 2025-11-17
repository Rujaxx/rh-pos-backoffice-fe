import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { BaseApiService } from "@/services/api/base/client";
import { Menu, MenuFormData, MenuQueryParams } from "@/types/menu.type";
import { PaginatedResponse, SuccessResponse } from "@/types/api";
import { API_ENDPOINTS, QUERY_KEYS } from "@/config/api";

class MenuService extends BaseApiService<Menu, MenuFormData, MenuFormData> {
  constructor() {
    super(API_ENDPOINTS.MENUS.LIST);
  }

  async getAllMenus(
    params?: MenuQueryParams,
  ): Promise<PaginatedResponse<Menu>> {
    return this.getAll(params);
  }

  async getMenuById(id: string): Promise<SuccessResponse<Menu>> {
    return this.getById(id);
  }

  async getActiveMenus(
    params?: Omit<MenuQueryParams, "isActive">,
  ): Promise<PaginatedResponse<Menu>> {
    return this.getAll({ ...params, isActive: "true" });
  }

  async getMenusByBrand(
    brandId: string,
    params?: Omit<MenuQueryParams, "brandId">,
  ): Promise<PaginatedResponse<Menu>> {
    return this.getAll({ ...params, brandId });
  }

  async getMenusByRestaurant(
    restaurantId: string,
    params?: Omit<MenuQueryParams, "restaurantId">,
  ): Promise<PaginatedResponse<Menu>> {
    return this.getAll({ ...params, restaurantId });
  }
}

const menuService = new MenuService();

export const useMenus = (
  params?: MenuQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Menu>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENUS.LIST(params),
    queryFn: () => menuService.getAllMenus(params),
    ...options,
  });
};

// Get single menu by ID
export const useMenu = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<Menu>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENUS.DETAIL(id),
    queryFn: () => menuService.getMenuById(id),
    enabled: !!id,
    ...options,
  });
};

export const useActiveMenus = (
  params?: Omit<MenuQueryParams, "isActive">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Menu>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENUS.LIST({ ...params, isActive: "true" }),
    queryFn: () => menuService.getActiveMenus(params),
    ...options,
  });
};

// Menus by Brand
export const useMenusByBrand = (
  brandId: string,
  params?: Omit<MenuQueryParams, "brandId">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Menu>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENUS.LIST({ ...params, brandId }),
    queryFn: () => menuService.getMenusByBrand(brandId, params),
    enabled: !!brandId,
    ...options,
  });
};

// Menus by Restaurant
export const useMenusByRestaurant = (
  restaurantId: string,
  params?: Omit<MenuQueryParams, "restaurantId">,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Menu>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENUS.LIST({ ...params, restaurantId }),
    queryFn: () => menuService.getMenusByRestaurant(restaurantId, params),
    enabled: !!restaurantId,
    ...options,
  });
};

export { menuService };
