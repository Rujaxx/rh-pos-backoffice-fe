'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/common/layout';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { OrderDetailsModal } from '@/components/online-orders/order-details-modal';
import { OrderFilters } from '@/components/online-orders/online-order-filter';
import { OrderListItem, OrderStatus } from '@/types/order';
import { createOrdersColumns } from '@/components/online-orders/online-table-column';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useOrders } from '@/services/api/orders/orders.queries';
import { OrderQueryParams } from '@/services/api/orders/orders.queries';

// Create type for order filters
interface OrderFilterParams {
  // Date range
  from?: string;
  to?: string;

  // Restaurant filter
  restaurantIds?: string[];

  // Advanced filters
  search?: string;
  externalOrderId?: string;
  platform?: string;
  orderLater?: boolean;

  // Any other filters
  [key: string]: unknown;
}

type OrderTab =
  | 'new'
  | 'running'
  | 'food_ready'
  | 'dispatched'
  | 'fulfilled'
  | 'cancelled';

export default function OnlineOrdersPage() {
  const { t } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>('new');

  // Filter states using OrderFilterParams
  const [filters, setFilters] = useState<OrderFilterParams>({});

  // Convert filters to API query params
  const queryParams = useMemo<OrderQueryParams>(() => {
    return {
      startDate: filters.from,
      endDate: filters.to,
      restaurantId: filters.restaurantIds?.[0],
      orderNumber: filters.search,
    };
  }, [filters]);

  // Fetch orders from API
  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useOrders(queryParams);

  // ordersResponse IS the PaginatedResponse object, so we access data directly
  const orders = ordersResponse?.data || [];

  // Helper function to filter orders by status
  const filterOrdersByStatus = (ordersList: OrderListItem[]) => {
    return {
      new: ordersList.filter((o) => o.orderStatus === OrderStatus.PENDING),
      running: ordersList.filter(
        (o) =>
          o.orderStatus === OrderStatus.CONFIRMED ||
          o.orderStatus === OrderStatus.FOOD_READY,
      ),
      food_ready: ordersList.filter(
        (o) => o.orderStatus === OrderStatus.FOOD_READY,
      ),
      dispatched: ordersList.filter(
        (o) => o.orderStatus === OrderStatus.DISPATCHED,
      ),
      fulfilled: ordersList.filter(
        (o) => o.orderStatus === OrderStatus.FULFILLED,
      ),
      cancelled: ordersList.filter(
        (o) => o.orderStatus === OrderStatus.CANCELLED,
      ),
    };
  };

  // Apply all filters to orders
  const applyFiltersToOrders = useCallback(
    (ordersList: OrderListItem[]) => {
      let filtered = [...ordersList];

      // Date range filter
      if (filters.from) {
        const fromDate = new Date(filters.from);
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) >= fromDate,
        );
      }
      if (filters.to) {
        const toDate = new Date(filters.to);
        filtered = filtered.filter(
          (order) => new Date(order.createdAt) <= toDate,
        );
      }

      // Restaurant filter
      if (filters.restaurantIds && filters.restaurantIds.length > 0) {
        filtered = filtered.filter((order) =>
          filters.restaurantIds?.includes(order.restaurantId),
        );
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.customerName?.toLowerCase().includes(searchTerm) ||
            order.customerPhone?.toLowerCase().includes(searchTerm) ||
            order.restaurantDoc?.name.en?.toLowerCase().includes(searchTerm),
        );
      }

      // Note: External Order ID, Platform, and Order Later filters
      // have been removed as they don't exist in the backend DTO

      return filtered;
    },
    [filters],
  );

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: OrderFilterParams) => {
    setFilters(newFilters);
    toast.success('Filters applied');
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    toast.success(t('common.filtersCleared') || 'Filters cleared');
  }, [t]);

  // Handle Apply Filters button
  const handleApplyFilters = useCallback(() => {
    // This function is called when the Apply button is clicked in OrderFilters
    // Filters are already applied via handleFilterChange
    toast.success('Filters applied successfully');
  }, []);

  // Calculate tab counts based on filtered orders
  const orderCounts = useMemo(() => {
    const filtered = applyFiltersToOrders(orders);
    const statusFiltered = filterOrdersByStatus(filtered);
    return {
      new: statusFiltered.new.length,
      running: statusFiltered.running.length,
      food_ready: statusFiltered.food_ready.length,
      dispatched: statusFiltered.dispatched.length,
      fulfilled: statusFiltered.fulfilled.length,
      cancelled: statusFiltered.cancelled.length,
    };
  }, [orders, applyFiltersToOrders]);

  // Handle order action
  const handleOrderAction = useCallback(
    async (orderId: string, action: string, data?: unknown) => {
      setIsProcessing(orderId);
      try {
        // TODO: Implement actual API calls for order actions
        await new Promise((resolve) => setTimeout(resolve, 500));

        // For now, show success message and refetch
        switch (action) {
          case 'food_ready':
            toast.success(`Order marked as Food Ready`);
            break;
          case 'dispatch':
            toast.success(`Order marked as Dispatched`);
            break;
          case 'mark_fulfilled':
            toast.success(`Order marked as Fulfilled`);
            break;
          case 'cancel':
            toast.error(`Order cancelled`);
            break;
          case 'reopen':
            toast.info(`Order reopened`);
            break;
          case 'assign_delivery_boy':
            toast.success(`Delivery boy assigned`);
            break;
          case 'print_kot':
            toast.success(`KOT printed`);
            break;
          case 'print_bill':
            toast.success(`Bill printed`);
            break;
        }

        // Refetch orders after action
        await refetch();
      } catch (error) {
        toast.error(t('common.errors.actionFailed') || 'Action failed');
      } finally {
        setIsProcessing(null);
      }
    },
    [t, refetch],
  );

  const handleViewDetails = useCallback((order: OrderListItem) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    await refetch();
    toast.success(t('common.refreshSuccess') || 'Orders refreshed');
  }, [t, refetch]);

  // Get filtered orders for current tab
  const filteredOrders = useMemo(() => {
    const allFiltered = applyFiltersToOrders(orders);
    const statusFiltered = filterOrdersByStatus(allFiltered);
    return statusFiltered[activeTab] || [];
  }, [orders, activeTab, applyFiltersToOrders]);

  const columns = useMemo(
    () => createOrdersColumns(handleViewDetails, handleOrderAction),
    [handleViewDetails, handleOrderAction],
  );

  const tabs = [
    {
      id: 'new' as const,
      label: t('orders.newOrders') || 'New Orders',
      count: orderCounts.new,
    },
    {
      id: 'running' as const,
      label: t('orders.runningOrders') || 'Running Orders',
      count: orderCounts.running,
    },
    {
      id: 'food_ready' as const,
      label: t('orders.foodReady') || 'Food Ready',
      count: orderCounts.food_ready,
    },
    {
      id: 'dispatched' as const,
      label: t('orders.dispatchedOrders') || 'Dispatched',
      count: orderCounts.dispatched,
    },
    {
      id: 'fulfilled' as const,
      label: t('orders.fulfilledOrders') || 'Fulfilled',
      count: orderCounts.fulfilled,
    },
    {
      id: 'cancelled' as const,
      label: t('orders.cancelledOrders') || 'Cancelled',
      count: orderCounts.cancelled,
    },
  ];

  // Mock platforms data
  const platforms = [
    { _id: '1', name: 'Uber Eats', code: 'uber_eats', isActive: true },
    { _id: '2', name: 'Zomato', code: 'zomato', isActive: true },
    { _id: '3', name: 'Swiggy', code: 'swiggy', isActive: true },
    { _id: '4', name: 'Website', code: 'website', isActive: true },
  ];

  // Check if any filters are active (for showing "Filtered" badge)
  const isAnyFilterActive = useMemo(
    () =>
      filters.from ||
      filters.to ||
      (filters.restaurantIds && filters.restaurantIds.length > 0) ||
      (filters.search && filters.search !== ''),
    [filters],
  );

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6 p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t('navigation.webOrders')}
            </h2>
            <p className="text-muted-foreground">
              {t('orders.managementDescription')}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t('common.refresh')}
          </Button>
        </div>

        {/* Order Filters  */}
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
          platforms={platforms}
        />

        {/* Orders Tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'pb-3 px-1 border-b-2 text-sm font-medium transition-colors relative',
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Badge
                    variant={activeTab === tab.id ? 'default' : 'secondary'}
                    className="ml-2 h-5 px-1.5 text-xs"
                  >
                    {tab.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {tabs.find((tab) => tab.id === activeTab)?.label}
                <span className="text-muted-foreground ml-2">
                  ({filteredOrders.length} orders)
                </span>
              </CardTitle>
              {isAnyFilterActive && (
                <Badge variant="outline" className="ml-2">
                  Filtered
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">
                  Loading orders...
                </span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-8 text-destructive">
                <p>Error loading orders: {error?.message || 'Unknown error'}</p>
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <TanStackTable
                columns={columns}
                data={filteredOrders}
                emptyMessage={`No ${activeTab} orders found`}
              />
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
            onAction={handleOrderAction}
            isProcessing={isProcessing === selectedOrder._id}
          />
        )}
      </div>
    </Layout>
  );
}
