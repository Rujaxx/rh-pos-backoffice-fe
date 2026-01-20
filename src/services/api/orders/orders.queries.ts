import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { OrderListItem } from '@/types/order';
import { PaginatedResponse, QueryParams, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';

// Query parameters for filtering orders
export interface OrderQueryParams extends QueryParams {
  // Date filters
  startDate?: string;
  endDate?: string;

  // Entity filters
  restaurantId?: string;
  brandId?: string;
  menuId?: string;
  orderTypeId?: string;
  customerId?: string;
  tableId?: string;

  // Status filters
  orderStatus?: string;
  paymentStatus?: string;

  // Search filters
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
}

class OrderService extends BaseApiService<
  OrderListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(API_ENDPOINTS.ORDERS.LIST);
  }

  async getAllOrders(
    params?: OrderQueryParams,
  ): Promise<PaginatedResponse<OrderListItem>> {
    return this.getAll(params);
  }

  async getOrderById(id: string): Promise<SuccessResponse<OrderListItem>> {
    return this.getById(id);
  }
}

const orderService = new OrderService();

// Hook to fetch all orders with optional filtering
export const useOrders = (
  params?: OrderQueryParams,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<OrderListItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.LIST(params),
    queryFn: () => orderService.getAllOrders(params),
    ...options,
  });
};

// Hook to fetch a single order by ID
export const useOrder = (
  id: string,
  options?: Omit<
    UseQueryOptions<SuccessResponse<OrderListItem>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.DETAIL(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    ...options,
  });
};

export { orderService };
