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
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  | 'FOOD_READY'
  | 'DISPATCHED'
  | 'FULFILLED'
  | 'CANCELLED';

export default function OnlineOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderListItem | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>('new');

  // Filter states using OrderFilterParams
  const [filters, setFilters] = useState<OrderFilterParams>({});

  // Helper function to filter orders by status
  const filterOrdersByStatus = (ordersList: OrderListItem[]) => {
    return {
      new: ordersList.filter((o) => o.orderStatus === 'CONFIRMED'),
      running: ordersList.filter(
        (o) => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'FOOD_READY',
      ),
      FOOD_READY: ordersList.filter((o) => o.orderStatus === 'FOOD_READY'),
      DISPATCHED: ordersList.filter((o) => o.orderStatus === 'DISPATCHED'),
      FULFILLED: ordersList.filter((o) => o.orderStatus === 'FULFILLED'),
      CANCELLED: ordersList.filter((o) => o.orderStatus === 'CANCELLED'),
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
            order.restaurantDoc?.name.en.toLowerCase().includes(searchTerm),
        );
      }

      // Platform filter
      if (filters.platform) {
        filtered = filtered.filter(
          (order) => order.platform === filters.platform,
        );
      }

      return filtered;
    },
    [filters],
  );

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: OrderFilterParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    toast.success(t('common.filtersCleared') || 'Filters cleared');
  }, [t]);

  // Calculate tab counts based on filtered orders
  const orderCounts = useMemo(() => {
    const filtered = applyFiltersToOrders(orders);
    const statusFiltered = filterOrdersByStatus(filtered);
    return {
      new: statusFiltered.new.length,
      running: statusFiltered.running.length,
      FOOD_READY: statusFiltered.FOOD_READY.length,
      DISPATCHED: statusFiltered.DISPATCHED.length,
      FULFILLED: statusFiltered.FULFILLED.length,
      CANCELLED: statusFiltered.CANCELLED.length,
    };
  }, [orders, applyFiltersToOrders]);

  // Handle order action
  const handleOrderAction = useCallback(
    async (orderId: string, action: string, data?: unknown) => {
      setIsProcessing(orderId);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setOrders((prev) =>
          (prev || []).map((order) => {
            if (order._id === orderId) {
              const updated = { ...order };

              switch (action) {
                case 'FOOD_READY':
                  updated.orderStatus = OrderStatus.FOOD_READY;
                  toast.success(
                    `Order #${order.orderNumber} marked as Food Ready`,
                  );
                  break;
                case 'dispatch':
                  updated.orderStatus = OrderStatus.DISPATCHED;
                  toast.success(
                    `Order #${order.orderNumber} marked as Dispatched`,
                  );
                  break;
                case 'mark_fulfilled':
                  updated.orderStatus = OrderStatus.FULFILLED;
                  toast.success(
                    `Order #${order.orderNumber} marked as Fulfilled`,
                  );
                  break;
                case 'cancel':
                  updated.orderStatus = OrderStatus.CANCELLED;
                  toast.error(`Order #${order.orderNumber} CANCELLED`);
                  break;
                case 'reopen':
                  updated.orderStatus = OrderStatus.CONFIRMED;
                  toast.info(`Order #${order.orderNumber} reopened`);
                  break;
                case 'assign_delivery_boy':
                  const deliveryData = data as
                    | { deliveryBoyId?: string }
                    | undefined;
                  updated.deliveryBoy = deliveryData?.deliveryBoyId;
                  if (deliveryData?.deliveryBoyId) {
                    toast.success(
                      `Delivery boy assigned to order #${order.orderNumber}`,
                    );
                  }
                  break;
                case 'print_kot':
                  toast.success(`KOT printed for order #${order.orderNumber}`);
                  break;
                case 'print_bill':
                  toast.success(`Bill printed for order #${order.orderNumber}`);
                  break;
              }

              updated.updatedAt = new Date();
              return updated;
            }
            return order;
          }),
        );
      } catch (error) {
        toast.error(t('common.errors.actionFailed') || 'Action failed');
      } finally {
        setIsProcessing(null);
      }
    },
    [t],
  );

  const handleViewDetails = useCallback((order: OrderListItem) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    toast.success(t('common.refreshSuccess') || 'Orders refreshed');
  }, [t]);

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
      id: 'FOOD_READY' as const,
      label: t('orders.foodReady') || 'Food Ready',
      count: orderCounts.FOOD_READY,
    },
    {
      id: 'DISPATCHED' as const,
      label: t('orders.dispatchedOrders') || 'Dispatched',
      count: orderCounts.DISPATCHED,
    },
    {
      id: 'FULFILLED' as const,
      label: t('orders.fulfilledOrders') || 'Fulfilled',
      count: orderCounts.FULFILLED,
    },
    {
      id: 'CANCELLED' as const,
      label: t('orders.cancelledOrders') || 'Cancelled',
      count: orderCounts.CANCELLED,
    },
  ];

  // Mock platforms data
  const platforms = [
    { _id: '1', name: 'Uber Eats', code: 'uber_eats', isActive: true },
    { _id: '2', name: 'Zomato', code: 'zomato', isActive: true },
    { _id: '3', name: 'Swiggy', code: 'swiggy', isActive: true },
    { _id: '4', name: 'Website', code: 'website', isActive: true },
  ];

  // Check if any filters are active
  const isAnyFilterActive =
    filters.from ||
    filters.to ||
    (filters.restaurantIds && filters.restaurantIds.length > 0) ||
    (filters.search && filters.search !== '') ||
    (filters.externalOrderId && filters.externalOrderId !== '') ||
    (filters.platform && filters.platform !== '') ||
    filters.orderLater;

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

        {/* Order Filters */}
        <OrderFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
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
            <TanStackTable
              columns={columns}
              data={filteredOrders}
              emptyMessage={`No ${activeTab} orders found`}
            />
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
