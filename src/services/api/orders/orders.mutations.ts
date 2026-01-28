import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BaseApiService } from '@/services/api/base/client';
import { OrderListItem, UpdateOrderDto } from '@/types/order';
import { SuccessResponse } from '@/types/api';
import { API_ENDPOINTS, QUERY_KEYS } from '@/config/api';
import { toast } from 'sonner';

class OrderMutationService extends BaseApiService<
  OrderListItem,
  Record<string, unknown>,
  UpdateOrderDto
> {
  constructor() {
    super(API_ENDPOINTS.ORDERS.LIST);
  }

  async updateOrder(
    orderId: string,
    data: UpdateOrderDto,
  ): Promise<SuccessResponse<OrderListItem>> {
    return this.update(orderId, data);
  }
}

const orderMutationService = new OrderMutationService();

// Hook to update an order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      data,
    }: {
      orderId: string;
      data: UpdateOrderDto;
    }) => orderMutationService.updateOrder(orderId, data),

    onSuccess: (response, variables) => {
      // Use prefix match to invalidate ALL order list queries (regardless of params)
      queryClient.invalidateQueries({
        queryKey: ['orders', 'list'],
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ORDERS.DETAIL(variables.orderId),
      });
      toast.success('Order updated successfully');
    },

    onError: (error: Error) => {
      toast.error(`Failed to update order: ${error.message}`);
    },
  });
};

export { orderMutationService };
