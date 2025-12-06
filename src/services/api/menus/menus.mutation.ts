/**
 * Menu Mutations
 * TanStack Query mutations for menu operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { Menu, MenuFormData } from '@/types/menu.type';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { menuService } from './menus.queries';
import { toast } from 'sonner';

// Create menu mutation
export const useCreateMenu = (
  options?: UseMutationOptions<SuccessResponse<Menu>, Error, MenuFormData>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async (data: MenuFormData) => {
      return menuService.create(data);
    },

    onSuccess: (data) => {
      toast.success('Menu created successfully');

      // Invalidate menu list queries
      queryUtils.invalidateQueries(['menus', 'list']);

      // Cache new menu
      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.MENUS.DETAIL(data.data._id!), data);
      }
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to create menu');
    },

    ...options,
  });
};

// Update menu mutation
export const useUpdateMenu = (
  options?: UseMutationOptions<
    SuccessResponse<Menu>,
    Error,
    { id: string; data: MenuFormData }
  >,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const { _id, ...dataWithoutId } = data;
      return menuService.update(id, dataWithoutId);
    },

    onSuccess: (data, variables) => {
      const { id } = variables;

      toast.success('Menu updated successfully');

      if (data.data) {
        queryUtils.setQueryData(QUERY_KEYS.MENUS.DETAIL(id), data);
      }

      queryUtils.invalidateQueries(['menus', 'list']);
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update menu');
    },

    ...options,
  });
};

// Delete menu mutation
export const useDeleteMenu = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();

  return useMutation({
    mutationFn: (id: string) => menuService.delete(id),

    onSuccess: (_, id) => {
      toast.success('Menu deleted successfully');

      queryUtils.removeQueries(QUERY_KEYS.MENUS.DETAIL(id));
      queryUtils.invalidateQueries(['menus', 'list']);
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to delete menu');
    },

    ...options,
  });
};
