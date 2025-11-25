/**
 * Menu Items Mutations
 * TanStack Query mutations for menu item operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { MenuItem, MenuItemFormData } from '@/types/menu-item.type';
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
