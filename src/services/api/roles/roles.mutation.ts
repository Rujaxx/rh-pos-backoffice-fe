/**
 * Role Mutations
 * TanStack Query mutations for role operations
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { SuccessResponse } from '@/types/api';
import { QUERY_KEYS } from '@/config/api';
import { useQueryUtils } from '@/lib/query-client';
import { roleService } from './roles.queries';
import { toast } from 'sonner';
import { Role } from '@/types/role.type';
import { RoleFormData } from '@/lib/validations/role.validation';

/**
 * Helper function to prepare data for the API.
 * This strips the _id for update operations, as it's passed in the URL.
 */
function transformToBackendFormat(
  data: RoleFormData,
  excludeId: boolean = false,
): Omit<RoleFormData, '_id'> | RoleFormData {
  // Create a copy to avoid mutating the original form data
  const transformed: RoleFormData & { _id?: string } = { ...data };

  // Add any default value logic here if needed, e.g.:
  // transformed.permissions = transformed.permissions ?? [];

  // Remove _id if excludeId is true (for update operations)
  if (excludeId && transformed._id) {
    const { _id, ...rest } = transformed;
    return rest;
  }

  return transformed;
}

// CREATE
export const useCreateRole = (
  options?: UseMutationOptions<SuccessResponse<Role>, Error, RoleFormData>,
) => {
  const queryUtils = useQueryUtils();
  return useMutation({
    mutationFn: async (data: RoleFormData) =>
      roleService.create(transformToBackendFormat(data)),
    onSuccess: (data) => {
      toast.success('Role created successfully');
      queryUtils.invalidateQueries(['roles']);
      queryUtils.invalidateQueries(QUERY_KEYS.ROLES.LIST());
      queryUtils.refetchQueries(['roles']);
      if (data.data)
        queryUtils.setQueryData(QUERY_KEYS.ROLES.DETAIL(data.data._id), data);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to create role';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// UPDATE
export const useUpdateRole = (
  options?: UseMutationOptions<
    SuccessResponse<Role>,
    Error,
    { id: string; data: RoleFormData }
  >,
) => {
  const queryUtils = useQueryUtils();
  return useMutation({
    mutationFn: async ({ id, data }) =>
      roleService.update(id, transformToBackendFormat(data, true)),
    onSuccess: (data, vars) => {
      toast.success('Role updated successfully');
      if (data.data)
        queryUtils.setQueryData(QUERY_KEYS.ROLES.DETAIL(vars.id), data);
      queryUtils.invalidateQueries(['roles']);
      queryUtils.invalidateQueries(QUERY_KEYS.ROLES.LIST());
      queryUtils.refetchQueries(['roles']);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to update role';
      toast.error(errorMessage);
    },
    ...options,
  });
};

// DELETE
export const useDeleteRole = (
  options?: UseMutationOptions<SuccessResponse<void>, Error, string>,
) => {
  const queryUtils = useQueryUtils();
  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: (_, id) => {
      toast.success('Role deleted successfully');
      queryUtils.removeQueries(QUERY_KEYS.ROLES.DETAIL(id));
      queryUtils.invalidateQueries(['roles']);
      queryUtils.invalidateQueries(QUERY_KEYS.ROLES.LIST());
      queryUtils.refetchQueries(['roles']);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to delete role';
      toast.error(errorMessage);
    },
    ...options,
  });
};
