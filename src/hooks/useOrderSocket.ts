import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { socketService } from '@/services/socket/socket.service';
import { SocketEvent, OrderEventPayload } from '@/services/socket/socket.types';
import { playNewOrderSound } from '@/services/sound/sound.service';
import { orderInvalidationQueue } from '@/services/socket/order-invalidation-queue';
import { orderService } from '@/services/api/orders/orders.queries';
import { OrderListItem } from '@/types/order';
import { useSocket } from '@/providers/socket-provider';

export interface UseOrderSocketOptions {
  enabled?: boolean;
  showNotifications?: boolean;
  onNewOrder?: (orderId: string) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
}

export interface UseOrderSocketReturn {
  isConnected: boolean;
  refetch: () => void;
}

export function useOrderSocket(
  options: UseOrderSocketOptions = {},
): UseOrderSocketReturn {
  const {
    enabled = true,
    showNotifications = true,
    onNewOrder,
    onConnect,
    onDisconnect,
  } = options;

  const queryClient = useQueryClient();

  // Use global socket context (connection is managed at app level)
  const { isConnected } = useSocket();

  /**
   * Professional batch fetch handler
   * Fetches only the orders that changed (not entire list!)
   */
  const handleBatchFetch = useCallback(
    async (orderIds: string[]) => {
      try {
        // Batch fetch using order service
        const freshOrders = await orderService.getOrdersByIds(orderIds);

        if (freshOrders.length === 0) {
          queryClient.invalidateQueries({ queryKey: ['orders', 'list'] });
          return;
        }

        // Get ALL order list caches (with any params)
        const allCaches = queryClient.getQueriesData<{ data: OrderListItem[] }>(
          {
            queryKey: ['orders', 'list'],
          },
        );

        if (allCaches.length === 0) {
          queryClient.invalidateQueries({
            queryKey: ['orders', 'list'],
          });
          return;
        }

        // Update ALL matching caches
        let updatedCount = 0;
        allCaches.forEach(([queryKey, cachedData]) => {
          if (cachedData?.data) {
            const mergedOrders = mergeOrders(cachedData.data, freshOrders);

            queryClient.setQueryData(queryKey, {
              ...cachedData,
              data: mergedOrders,
            });
            updatedCount++;
          }
        });
      } catch (error) {
        queryClient.invalidateQueries({ queryKey: ['orders', 'list'] });
      }
    },
    [queryClient],
  );

  /**
   * Intelligent merge: insert new + replace existing
   */
  const mergeOrders = (
    cached: OrderListItem[],
    fresh: OrderListItem[],
  ): OrderListItem[] => {
    const orderMap = new Map(cached.map((o) => [o._id, o]));

    // Replace/insert fresh orders
    fresh.forEach((freshOrder) => {
      orderMap.set(freshOrder._id, freshOrder);
    });

    // Convert back to array (maintains insertion order)
    return Array.from(orderMap.values());
  };

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['orders', 'list'], // Prefix match all variations
    });
  }, [queryClient]);

  useEffect(() => {
    if (!enabled) return;

    // Register batch fetch handler
    orderInvalidationQueue.onFlush(handleBatchFetch);

    // Handle disconnect events (for debugging)
    const handleDisconnectEvent = (reason: string) => {
      onDisconnect?.(reason);
    };

    // Call onConnect if already connected
    if (isConnected && onConnect) {
      onConnect();
    }

    /**
     * UNIFIED HANDLER: Both newOrder and updateOrder use same invalidation path
     */
    const handleOrderInvalidated = (orderId: string, isNew: boolean) => {
      orderInvalidationQueue.invalidate(orderId);

      // Notify ONLY on new orders (professional UX)
      if (isNew) {
        playNewOrderSound();

        if (showNotifications) {
          toast.success('New order received');
        }

        onNewOrder?.(orderId);
      }
    };

    const handleNewOrder = (payload: string | OrderEventPayload) => {
      const orderId = typeof payload === 'string' ? payload : payload.orderId;
      handleOrderInvalidated(orderId, true);
    };

    const handleOrderUpdate = (payload: string | OrderEventPayload) => {
      const orderId = typeof payload === 'string' ? payload : payload.orderId;
      handleOrderInvalidated(orderId, false);
    };

    // Register event listeners (NO connection management)
    socketService.on(SocketEvent.DISCONNECT, handleDisconnectEvent);
    socketService.on(SocketEvent.NEW_ORDER, handleNewOrder);
    socketService.on(SocketEvent.POS_ORDER_UPDATE, handleOrderUpdate);

    return () => {
      // Cleanup: remove listeners only, NO disconnect
      socketService.off(SocketEvent.DISCONNECT, handleDisconnectEvent);
      socketService.off(SocketEvent.NEW_ORDER, handleNewOrder);
      socketService.off(SocketEvent.POS_ORDER_UPDATE, handleOrderUpdate);
      orderInvalidationQueue.clear();
    };
  }, [
    enabled,
    showNotifications,
    onNewOrder,
    onConnect,
    onDisconnect,
    isConnected,
    handleBatchFetch,
  ]);

  return {
    isConnected,
    refetch,
  };
}
