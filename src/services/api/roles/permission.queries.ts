import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { BaseApiService } from "@/services/api/base/client";
import { PaginatedResponse } from "@/types/api";
import { API_ENDPOINTS, QUERY_KEYS } from "@/config/api";
import {
  PermissionModuleGroup,
  PermissionQueryParams,
} from "@/types/permission.type";

class PermissionService extends BaseApiService<PermissionModuleGroup> {
  constructor() {
    super(API_ENDPOINTS.PERMISSIONS.LIST);
  }

  async getAllPermissions(
    params?: PermissionQueryParams,
  ): Promise<PaginatedResponse<PermissionModuleGroup>> {
    return this.getAll(params);
  }
}

const permissionService = new PermissionService();

// FETCH PAGINATED PERMISSIONS BY GROUP BY MODULES
export const usePermissions = (
  params?: PermissionQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<PermissionModuleGroup>>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PERMISSIONS.LIST(params),
    queryFn: () => permissionService.getAllPermissions(params),
    ...options,
  });
};

// NOT FETCHING SINGLE PERMISSION !

export { permissionService };
