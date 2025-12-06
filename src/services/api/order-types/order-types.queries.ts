import { useQuery } from '@tanstack/react-query';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { BaseApiService } from '@/services/api/base/client';
import { PaginatedResponse } from '@/types/api';
import { OrderType, OrderTypeQueryParams } from '@/types/order-type.type';

class OrderTypeService extends BaseApiService<
  OrderType,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(API_ENDPOINTS.ORDER_TYPES.LIST);
  }

  public async getActiveOrderTypes(
    params?: OrderTypeQueryParams,
  ): Promise<PaginatedResponse<OrderType>> {
    return this.getAll({ ...params, isActive: 'true' });
  }
}

export const orderTypeService = new OrderTypeService();

export const useOrderTypes = (params?: OrderTypeQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_TYPES.LIST(params),
    queryFn: () => orderTypeService.getAll(params),
  });
};

export const useActiveOrderTypes = (params?: OrderTypeQueryParams) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDER_TYPES.LIST({ ...params, isActive: 'true' }),
    queryFn: () => orderTypeService.getActiveOrderTypes(params),
  });
};
