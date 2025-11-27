/**
 * Menu Items Mutations
 * TanStack Query mutations for menu item operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
  MenuItem,
  MenuItemFormData,
  UploadMenuItemsQueryDto,
  UploadFromExcelResponseDto,
} from '@/types/menu-item.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { menuItemService } from './menu-items.queries';
import { toast } from 'sonner';

// Create menu item mutation
export const useCreateMenuItem = (
  options?: UseMutationOptions<
    SuccessResponse<MenuItem>,
    Error,
    MenuItemFormData
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: MenuItemFormData) => {
      const result = await menuItemService.create(data);
      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success('Menu item created successfully');

      // Invalidate and refetch menu items list - use partial matching to catch all menu item list queries
      queryUtils.invalidateQueries(['menu-items', 'list']);

      // Also invalidate menus list to update menu item count
      queryUtils.invalidateQueries(['menus', 'list']);

      // Set the new menu item in cache
      if (data.data) {
        queryUtils.setQueryData(
          QUERY_KEYS.MENU_ITEMS.DETAIL(data.data._id!),
          data,
        );
      }
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to create menu item';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Update menu item mutation
export const useUpdateMenuItem = (
  options?: UseMutationOptions<
    SuccessResponse<MenuItem>,
    Error,
    { id: string; data: MenuItemFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: MenuItemFormData;
    }) => {
      // Exclude _id from data for update
      const { _id, ...dataWithoutId } = data;
      const result = await menuItemService.update(id, dataWithoutId);
      return result;
    },
    onSuccess: (data, variables) => {
      const { id } = variables;

      // Show success message
      toast.success('Menu item updated successfully');

      // Update specific menu item cache
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.MENU_ITEMS.DETAIL(id), data);
      }

      // Invalidate menu items list to refresh the table - use partial matching
      queryUtils.invalidateQueries(['menu-items', 'list']);

      // Also invalidate menus list to update menu item count
      queryUtils.invalidateQueries(['menus', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update menu item';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Delete menu item mutation
export const useDeleteMenuItem = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => menuItemService.delete(id),
    onSuccess: (_, id) => {
      // Show success message
      toast.success('Menu item deleted successfully');

      // Remove from cache
      queryUtils.removeQueries(QUERY_KEYS.MENU_ITEMS.DETAIL(id));

      // Invalidate menu items list - use partial matching
      queryUtils.invalidateQueries(['menu-items', 'list']);

      // Also invalidate menus list to update menu item count
      queryUtils.invalidateQueries(['menus', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to delete menu item';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Bulk update menu items mutation
export const useBulkUpdateMenuItems = (
  menuId: string,
  options?: UseMutationOptions<
    SuccessResponse<{ updated: number; failed: number; items: MenuItem[] }>,
    Error,
    MenuItemFormData[]
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (items: MenuItemFormData[]) => {
      items.map((item) => {
        if (item.primaryImage?.startsWith('http')) {
          delete item.primaryImage;
        }
        return item;
      });
      items.forEach((item) => {
        item.images = [item.primaryImage as string];
      });
      const result = await menuItemService.bulkUpdate(menuId, items);
      return result;
    },
    onSuccess: (data) => {
      // Show success message
      toast.success(`Successfully updated ${data.data.updated} menu item(s)`);

      // Invalidate menu items list to refresh the table
      queryUtils.invalidateQueries(['menu-items', 'list']);

      // Also invalidate menus list
      queryUtils.invalidateQueries(['menus', 'list']);
    },
    onError: (error) => {
      // Show error message
      const errorMessage = error.message || 'Failed to update menu items';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// Upload menu items from Excel mutation
export const useUploadMenuExcel = (
  options?: UseMutationOptions<
    UploadFromExcelResponseDto,
    Error,
    { file: File; params: UploadMenuItemsQueryDto }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ file, params }) => {
      const result = await menuItemService.uploadFromExcel(file, params);
      return result;
    },
    onSuccess: (data) => {
      if (data.status === 'success') {
        toast.success(`Successfully processed ${data.processed} rows`);
        // Invalidate menu items list
        queryUtils.invalidateQueries(['menu-items', 'list']);
        // Invalidate menus list
        queryUtils.invalidateQueries(['menus', 'list']);
      } else {
        toast.error('Upload completed with errors');
      }
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to upload menu items';
      toast.error(errorMessage);
    },
    ...options,
  });
};
