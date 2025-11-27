import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import {
  MenuItem,
  MenuItemFormData,
  MenuItemQueryParams,
  UploadMenuItemsQueryDto,
  UploadFromExcelResponseDto,
} from '@/types/menu-item.type';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import api from '@/lib/axios';

// Menu Items service extending base service
class MenuItemService extends BaseApiService<MenuItem, MenuItemFormData> {
  constructor() {
    super(API_ENDPOINTS.MENU_ITEMS.LIST);
  }

  // Get all menu items with optional filters
  async getAllMenuItems(
    params?: MenuItemQueryParams,
  ): Promise<PaginatedResponse<MenuItem>> {
    return this.getAll(params);
  }

  // Get menu item by ID
  async getMenuItemById(id: string): Promise<SuccessResponse<MenuItem>> {
    return this.getById(id);
  }

  // Get active menu items only (for dropdowns)
  async getActiveMenuItems(
    params?: Omit<MenuItemQueryParams, 'isActive'>,
  ): Promise<PaginatedResponse<MenuItem>> {
    return this.getAll({ ...params, isActive: 'true' });
  }

  // Get menu items by menu ID
  async getMenuItemsByMenu(
    menuId: string,
    params?: Omit<MenuItemQueryParams, 'menuId'>,
  ): Promise<PaginatedResponse<MenuItem>> {
    return this.getAll({ ...params, menuId });
  }

  // Get menu items by category ID
  async getMenuItemsByCategory(
    categoryId: string,
    params?: Omit<MenuItemQueryParams, 'categoryId'>,
  ): Promise<PaginatedResponse<MenuItem>> {
    return this.getAll({ ...params, categoryId });
  }

  // Get recommended menu items
  async getRecommendedMenuItems(
    params?: Omit<MenuItemQueryParams, 'isRecommended'>,
  ): Promise<PaginatedResponse<MenuItem>> {
    return this.getAll({ ...params, isRecommended: 'true' });
  }

  // Get combo items
  async getComboItems(
    params?: Omit<MenuItemQueryParams, 'isCombo'>,
  ): Promise<PaginatedResponse<MenuItem>> {
    return this.getAll({ ...params, isCombo: 'true' });
  }

  // Bulk update menu items
  async bulkUpdate(
    menuId: string,
    items: MenuItemFormData[],
  ): Promise<
    SuccessResponse<{ updated: number; failed: number; items: MenuItem[] }>
  > {
    return api.patch<
      SuccessResponse<{ updated: number; failed: number; items: MenuItem[] }>
    >(`${this.baseEndpoint}/bulk/${menuId}`, { items });
  }

  // Upload menu items from Excel
  async uploadFromExcel(
    file: File,
    params: UploadMenuItemsQueryDto,
  ): Promise<UploadFromExcelResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return api.post<UploadFromExcelResponseDto>(
      `${this.baseEndpoint}/upload`,
      formData,
      {
        params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
  }
}

// Create service instance
const menuItemService = new MenuItemService();

// Query hooks

// Get all menu items with pagination and filters
export const useMenuItems = (
  params?: MenuItemQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.LIST(params),
    queryFn: () => menuItemService.getAllMenuItems(params),
    ...options,
  });
};

// Get single menu item by ID
export const useMenuItem = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.DETAIL(id),
    queryFn: () => menuItemService.getMenuItemById(id),
    enabled: !!id,
    ...options,
  });
};

// Get active menu items only (for dropdowns and filters)
export const useActiveMenuItems = (
  params?: Omit<MenuItemQueryParams, 'isActive'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.LIST({ ...params, isActive: 'true' }),
    queryFn: () => menuItemService.getActiveMenuItems(params),
    ...options,
  });
};

// Get menu items by menu ID
export const useMenuItemsByMenu = (
  menuId: string,
  params?: Omit<MenuItemQueryParams, 'menuId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.LIST({ ...params, menuId }),
    queryFn: () => menuItemService.getMenuItemsByMenu(menuId, params),
    enabled: !!menuId,
    ...options,
  });
};

// Get menu items by category ID
export const useMenuItemsByCategory = (
  categoryId: string,
  params?: Omit<MenuItemQueryParams, 'categoryId'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.LIST({ ...params, categoryId }),
    queryFn: () => menuItemService.getMenuItemsByCategory(categoryId, params),
    enabled: !!categoryId,
    ...options,
  });
};

// Get recommended menu items
export const useRecommendedMenuItems = (
  params?: Omit<MenuItemQueryParams, 'isRecommended'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.LIST({ ...params, isRecommended: 'true' }),
    queryFn: () => menuItemService.getRecommendedMenuItems(params),
    ...options,
  });
};

// Get combo items
export const useComboItems = (
  params?: Omit<MenuItemQueryParams, 'isCombo'>,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<MenuItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.MENU_ITEMS.LIST({ ...params, isCombo: 'true' }),
    queryFn: () => menuItemService.getComboItems(params),
    ...options,
  });
};

// Export service for use in mutations
export { menuItemService };
