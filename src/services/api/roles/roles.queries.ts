import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { PaginatedResponse, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { Role, RoleQueryParams } from '@/types/role.type';
import { RoleFormData } from '@/lib/validations/role.validation';

class RoleService extends BaseApiService<Role, RoleFormData, RoleFormData> {
  constructor() {
    super(API_ENDPOINTS.ROLES.LIST);
  }

  async getAllRoles(
    params?: RoleQueryParams,
  ): Promise<PaginatedResponse<Role>> {
    return this.getAll(params);
  }

  async getRoleById(id: string): Promise<SuccessResponse<Role>> {
    return this.getById(id);
  }
}

const roleService = new RoleService();

// Get paginated roles
export const useRoles = (
  params?: RoleQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<Role>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES.LIST(params),
    queryFn: () => roleService.getAllRoles(params),
    ...options,
  });
};

// Get single role
export const useRole = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<Role>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES.DETAIL(id),
    queryFn: () => roleService.getRoleById(id),
    enabled: !!id,
    ...options,
  });
};

export { roleService };
