import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { OrderListItem } from '@/types/order';
import { PaginatedResponse, QueryParams, SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { toast } from 'sonner';

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
  status?: string;
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

  /**
   * Batch fetch orders by IDs (professional pattern)
   * Fallback: fetch individually if backend doesn't support batch
   */
  async getOrdersByIds(orderIds: string[]): Promise<OrderListItem[]> {
    try {
      // Try individual fetches (fallback approach)
      const promises = orderIds.map((id) => this.getById(id));
      const results = await Promise.allSettled(promises);

      // Extract successful orders
      return results
        .filter((r) => r.status === 'fulfilled')
        .map(
          (r) =>
            (r as PromiseFulfilledResult<SuccessResponse<OrderListItem>>).value
              .data,
        );
    } catch (error) {
      toast.error(`[OrderService] Batch fetch failed.`);
      return [];
    }
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
