// services/api/raw-materials/raw-materials.queries.ts
import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { BaseApiService } from '@/services/api/base/client';
import { PaginatedResponse } from '@/types/api';
import { RawItem, RawItemQueryParams } from '@/types/raw-materials.type';

class RawItemService extends BaseApiService<
  RawItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(API_ENDPOINTS.RAW_MATERIALS.LIST);
  }

  public async getActiveRawItems(
    params?: RawItemQueryParams,
  ): Promise<PaginatedResponse<RawItem>> {
    return this.getAll({ ...params, isActive: 'true' });
  }
}

export const rawItemService = new RawItemService();

export const useRawItems = (params?: RawItemQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.RAW_MATERIALS.LIST(params),
    queryFn: () => rawItemService.getAll(params),
  });
};

export const useActiveRawItems = (params?: RawItemQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.RAW_MATERIALS.LIST({ ...params, isActive: 'true' }),
    queryFn: () => rawItemService.getActiveRawItems(params),
  });
};
