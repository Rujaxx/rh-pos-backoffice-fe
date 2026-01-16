'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/common/layout';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { OrderDetailsModal } from '@/components/online-orders/order-details-modal';
import { OrderFilters } from '@/components/online-orders/online-order-filter';
import { Order } from '@/types/order';
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

// Mock data (same as before)
const mockOrders: Order[] = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    externalOrderId: 'UBER-12345',
    restaurantId: 'resto-1',
    restaurantName: 'The Great Restaurant',
    customerName: 'John Doe',
    customerPhone: '+1 234 567 890',
    totalAmount: 45.99,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'active',
    orderStatus: 'acknowledged',
    deliveryType: 'delivery',
    platform: 'uber_eats',
    orderLater: false,
    items: [
      {
        _id: '1',
        name: 'Pizza',
        quantity: 1,
        price: 12.99,
        discount: 0,
        tax: 1.3,
        subtotal: 14.29,
      },
      {
        _id: '2',
        name: 'Garlic Bread',
        quantity: 2,
        price: 4.5,
        discount: 0,
        tax: 0.9,
        subtotal: 9.9,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    externalOrderId: 'ZOMATO-67890',
    restaurantId: 'resto-2',
    restaurantName: 'Fine Dining',
    customerName: 'Jane Smith',
    customerPhone: '+1 234 567 891',
    totalAmount: 89.5,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'active',
    orderStatus: 'food_ready',
    deliveryType: 'pickup',
    platform: 'zomato',
    orderLater: false,
    items: [
      {
        _id: '3',
        name: 'Salmon',
        quantity: 1,
        price: 24.99,
        discount: 2.0,
        tax: 2.3,
        subtotal: 25.29,
      },
    ],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: '3',
    orderNumber: 'ORD-003',
    externalOrderId: 'SWIGGY-54321',
    restaurantId: 'resto-3',
    restaurantName: 'Fast Food',
    customerName: 'Bob Johnson',
    customerPhone: '+1 234 567 892',
    totalAmount: 32.75,
    paymentMethod: 'pay_later',
    paymentStatus: 'pending',
    status: 'active',
    orderStatus: 'dispatched',
    deliveryType: 'delivery',
    deliveryBoy: 'Rider-001',
    platform: 'swiggy',
    orderLater: true,
    items: [
      {
        _id: '4',
        name: 'Burger',
        quantity: 2,
        price: 8.99,
        discount: 1.0,
        tax: 1.78,
        subtotal: 18.76,
      },
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: '4',
    orderNumber: 'ORD-004',
    externalOrderId: 'WEB-98765',
    restaurantId: 'resto-4',
    restaurantName: 'Coffee Corner',
    customerName: 'Alice Brown',
    customerPhone: '+1 234 567 893',
    totalAmount: 15.25,
    paymentMethod: 'online',
    paymentStatus: 'failed',
    status: 'cancelled',
    orderStatus: 'cancelled',
    deliveryType: 'pickup',
    platform: 'website',
    orderLater: false,
    items: [
      {
        _id: '5',
        name: 'Cappuccino',
        quantity: 1,
        price: 4.5,
        discount: 0,
        tax: 0.45,
        subtotal: 4.95,
      },
    ],
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    _id: '5',
    orderNumber: 'ORD-005',
    externalOrderId: 'UBER-54321',
    restaurantId: 'resto-1',
    restaurantName: 'The Great Restaurant',
    customerName: 'Michael Chen',
    customerPhone: '+1 234 567 894',
    totalAmount: 67.8,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'fulfilled',
    orderStatus: 'fulfilled',
    deliveryType: 'delivery',
    deliveryBoy: 'Rider-002',
    platform: 'uber_eats',
    orderLater: false,
    items: [
      {
        _id: '6',
        name: 'Sushi Platter',
        quantity: 1,
        price: 32.5,
        discount: 0,
        tax: 3.25,
        subtotal: 35.75,
      },
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

type OrderTab =
  | 'new'
  | 'running'
  | 'food_ready'
  | 'dispatched'
  | 'fulfilled'
  | 'cancelled';

export default function OnlineOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderTab>('new');

  // Filter states using OrderFilterParams
  const [filters, setFilters] = useState<OrderFilterParams>({});

  // Helper function to filter orders by status
  const filterOrdersByStatus = (ordersList: Order[]) => {
    return {
      new: ordersList.filter((o) => o.orderStatus === 'acknowledged'),
      running: ordersList.filter(
        (o) =>
          o.orderStatus === 'acknowledged' || o.orderStatus === 'food_ready',
      ),
      food_ready: ordersList.filter((o) => o.orderStatus === 'food_ready'),
      dispatched: ordersList.filter((o) => o.orderStatus === 'dispatched'),
      fulfilled: ordersList.filter((o) => o.orderStatus === 'fulfilled'),
      cancelled: ordersList.filter((o) => o.orderStatus === 'cancelled'),
    };
  };

  // Apply all filters to orders
  const applyFiltersToOrders = useCallback(
    (ordersList: Order[]) => {
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
            order.customerName.toLowerCase().includes(searchTerm) ||
            order.customerPhone.toLowerCase().includes(searchTerm) ||
            order.restaurantName.toLowerCase().includes(searchTerm),
        );
      }

      // External Order ID filter
      if (filters.externalOrderId) {
        filtered = filtered.filter((order) =>
          order.externalOrderId
            .toLowerCase()
            .includes(filters.externalOrderId!.toLowerCase()),
        );
      }

      // Platform filter
      if (filters.platform) {
        filtered = filtered.filter(
          (order) => order.platform === filters.platform,
        );
      }

      // Order Later filter
      if (filters.orderLater) {
        filtered = filtered.filter((order) => order.orderLater === true);
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
        await new Promise((resolve) => setTimeout(resolve, 500));

        setOrders((prev) =>
          prev.map((order) => {
            if (order._id === orderId) {
              const updated = { ...order };

              switch (action) {
                case 'food_ready':
                  updated.orderStatus = 'food_ready';
                  toast.success(
                    `Order #${order.orderNumber} marked as Food Ready`,
                  );
                  break;
                case 'dispatch':
                  updated.orderStatus = 'dispatched';
                  toast.success(
                    `Order #${order.orderNumber} marked as Dispatched`,
                  );
                  break;
                case 'mark_fulfilled':
                  updated.orderStatus = 'fulfilled';
                  toast.success(
                    `Order #${order.orderNumber} marked as Fulfilled`,
                  );
                  break;
                case 'cancel':
                  updated.orderStatus = 'cancelled';
                  toast.error(`Order #${order.orderNumber} cancelled`);
                  break;
                case 'reopen':
                  updated.orderStatus = 'acknowledged';
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

              updated.updatedAt = new Date().toISOString();
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

  const handleViewDetails = useCallback((order: Order) => {
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
