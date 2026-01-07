'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/common/layout';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { OrderDetailsModal } from '@/components/online-orders/order-details-modal';
import { ReportQueryParams } from '@/types/report.type';
import { OrderFilters } from '@/components/online-orders/online-order-filter';
import { createOrdersColumns } from '@/components/online-orders/online-table-column';
import { CheckCircle, Clock, Truck, Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// Mock data types
interface Order {
  _id: string;
  orderNumber: string;
  externalOrderId: string;
  restaurantId: string;
  restaurantName: string;
  restaurantLogo?: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'pay_later' | 'paytm' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'new' | 'active' | 'fulfilled' | 'cancelled';
  deliveryType: 'pickup' | 'delivery';
  deliveryBoy?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  brandId?: string;
  platform: 'uber_eats' | 'zomato' | 'swiggy' | 'website';
  platformStore?: string;
  orderLater: boolean;
  orderStatus?:
    | 'acknowledged'
    | 'food_ready'
    | 'dispatched'
    | 'fulfilled'
    | 'cancelled';
}

interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  tax: number;
  subtotal: number;
}

interface AdditionalFilters {
  externalOrderId: string;
  platform: string;
  orderLater: boolean;
  search: string;
}

// Mock data with proper orderStatus
const mockOrders: Order[] = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    externalOrderId: 'UBER-12345',
    restaurantId: 'resto-1',
    restaurantName: 'The Great Restaurant',
    restaurantLogo: '',
    customerName: 'John Doe',
    customerPhone: '+1 234 567 890',
    totalAmount: 45.99,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    status: 'new',
    orderStatus: 'acknowledged',
    deliveryType: 'delivery',
    platform: 'uber_eats',
    platformStore: 'UBER-Store-123',
    orderLater: false,
    items: [
      {
        _id: 'item-1',
        name: 'Margherita Pizza',
        quantity: 1,
        price: 12.99,
        discount: 0,
        tax: 1.3,
        subtotal: 14.29,
      },
      {
        _id: 'item-2',
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
    restaurantName: 'Fine Dining Place',
    restaurantLogo: '',
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
        _id: 'item-3',
        name: 'Grilled Salmon',
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
    orderNumber: 'ORD-004',
    externalOrderId: 'WEB-98765',
    restaurantId: 'resto-4',
    restaurantName: 'Coffee Corner',
    restaurantLogo: '',
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
        _id: 'item-5',
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
];

// Print receipt function
const printReceipt = (order: Order, type: 'bill' | 'kot') => {
  const printContent = document.createElement('div');
  printContent.style.cssText = `
    position: fixed;
    left: -9999px;
    top: -9999px;
    width: 80mm;
    background: white;
    padding: 10px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: black;
  `;

  const totalTax = order.items.reduce((sum, item) => sum + item.tax, 0);
  const totalDiscount = order.items.reduce(
    (sum, item) => sum + item.discount,
    0,
  );
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const getPaymentMethodLabel = () => {
    switch (order.paymentMethod) {
      case 'cash':
        return 'Cash';
      case 'card':
        return 'Card';
      case 'pay_later':
        return 'Pay Later';
      case 'paytm':
        return 'Paytm';
      case 'online':
        return 'Online';
      default:
        return order.paymentMethod;
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  let html = `
    <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 15px;">
      <div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${order.restaurantName}</div>
  `;

  if (type === 'bill') {
    html += `
      <div style="font-size: 14px; margin-bottom: 10px;">TAX INVOICE</div>
      <div>Order: #${order.orderNumber}</div>
      <div>External: ${order.externalOrderId}</div>
      <div>${formatTime(order.createdAt)}</div>
    `;
  } else {
    html += `
      <div style="background: #000; color: #fff; padding: 5px; text-align: center; font-weight: bold; margin: 10px 0; border-radius: 3px;">
        KITCHEN ORDER TICKET
      </div>
      <div>KOT: #${order.orderNumber}</div>
      <div>Type: ${order.deliveryType === 'pickup' ? 'Pickup' : 'Delivery'}</div>
      <div>Time: ${new Date().toLocaleTimeString('en-US', { hour12: true })}</div>
    `;
  }

  html += `</div>`;

  if (type === 'bill') {
    html += `
      <div style="margin: 10px 0;">
        <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 8px;">CUSTOMER</div>
        <div>Name: ${order.customerName}</div>
        <div>Phone: ${order.customerPhone}</div>
        <div>Type: ${order.deliveryType.toUpperCase()}</div>
      </div>
    `;
  }

  html += `
    <div style="margin: 10px 0;">
      <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 8px;">
        ${type === 'bill' ? 'ITEMS' : 'ORDER ITEMS'}
      </div>
  `;

  order.items.forEach((item, index) => {
    html += `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px dotted #ccc; padding-bottom: 5px;">
        <div style="flex: 2;">${index + 1}. ${item.name}</div>
        <div style="flex: 1; text-align: center;">×${item.quantity}</div>
        <div style="flex: 1; text-align: right;">$${item.price.toFixed(2)}</div>
      </div>
    `;
  });

  html += `</div>`;

  if (type === 'bill') {
    html += `
      <div style="margin: 10px 0;">
        <div style="font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 8px;">PAYMENT SUMMARY</div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <div>Subtotal</div>
          <div>$${subtotal.toFixed(2)}</div>
        </div>
    `;

    if (totalDiscount > 0) {
      html += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <div>Discount</div>
          <div>-$${totalDiscount.toFixed(2)}</div>
        </div>
      `;
    }

    html += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
          <div>Tax</div>
          <div>$${totalTax.toFixed(2)}</div>
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 10px; padding-top: 10px; border-top: 2px solid #000;">
          <div>TOTAL</div>
          <div>$${order.totalAmount.toFixed(2)}</div>
        </div>
        <div style="margin-top: 5px;">Payment: ${getPaymentMethodLabel()}</div>
        ${order.paymentStatus === 'paid' ? '<div>Status: PAID</div>' : ''}
      </div>
    `;
  } else {
    html += `
      <div style="font-style: italic; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000;">
        <div>Order ID: #${order.orderNumber}</div>
        <div>Customer: ${order.customerName}</div>
        <div>Time: ${new Date().toLocaleTimeString('en-US', { hour12: true })}</div>
        <div>Platform: ${order.platform.toUpperCase()}</div>
        ${order.orderLater ? '<div>⚠️ ORDER FOR LATER</div>' : ''}
      </div>
      <div style="background: #000; color: #fff; padding: 5px; text-align: center; font-weight: bold; margin: 10px 0; border-radius: 3px;">
        PRIORITY: ${order.orderStatus?.toUpperCase() || 'NORMAL'}
      </div>
      <div style="font-style: italic; margin-top: 15px; padding-top: 10px; border-top: 1px dashed #000;">
        <div>Special Instructions:</div>
        <div>- Please prepare with care</div>
        <div>- Check all items</div>
        <div>- Mark as ready when done</div>
      </div>
    `;
  }

  html += `
    <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px dashed #000; font-style: italic;">
  `;

  if (type === 'bill') {
    html += `
      <div>Thank you for your order!</div>
      <div>Please visit again</div>
      <div style="border: 1px dashed #ccc; padding: 5px; text-align: center; margin: 10px 0; font-size: 10px;">
        [Payment QR Code]
      </div>
      <div>www.${order.restaurantName.toLowerCase().replace(/\s+/g, '')}.com</div>
    `;
  } else {
    html += `
      <div>--- KITCHEN COPY ---</div>
      <div>Generated: ${new Date().toLocaleString()}</div>
    `;
  }

  html += `</div>`;

  printContent.innerHTML = html;
  document.body.appendChild(printContent);

  // Trigger print
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${type === 'bill' ? 'Bill' : 'KOT'} - ${order.orderNumber}</title>
          <style>
            @media print {
              @page {
                margin: 0;
                size: 80mm auto;
              }
              body {
                margin: 0;
                padding: 10px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #000;
                background: #fff;
                width: 80mm;
              }
            }
            body {
              margin: 0;
              padding: 10px;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              color: #000;
              background: #fff;
              max-width: 80mm;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  setTimeout(() => {
    if (document.body.contains(printContent)) {
      document.body.removeChild(printContent);
    }
  }, 1000);
};

export default function OnlineOrdersPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filters, setFilters] = useState<ReportQueryParams>({});
  const [additionalFilters, setAdditionalFilters] = useState<AdditionalFilters>(
    {
      externalOrderId: '',
      platform: '',
      orderLater: false,
      search: '',
    },
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Handle filter changes from ReportFilters component
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setAdditionalFilters({
      externalOrderId: '',
      platform: '',
      orderLater: false,
      search: '',
    });
  }, []);

  // Handle additional filters change
  const handleAdditionalFilterChange = useCallback(
    (key: keyof AdditionalFilters, value: string | boolean) => {
      setAdditionalFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  // Handle view order details
  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    toast.info(t('common.refreshing') || 'Refreshing orders...');
    // In real app, this would refetch data from API
  }, [t]);

  // Handle order action with proper state updates
  const handleOrderAction = useCallback(
    async (orderId: string, action: string, data?: unknown) => {
      setIsProcessing(orderId);

      try {
        await new Promise<void>((resolve) => setTimeout(resolve, 500));

        setOrders((prevOrders) => {
          return prevOrders.map((order) => {
            if (order._id === orderId) {
              const updatedOrder = { ...order };

              switch (action) {
                case 'food_ready':
                  updatedOrder.orderStatus = 'food_ready';
                  updatedOrder.status = 'active';
                  toast.success(
                    `Order #${order.orderNumber} marked as Food Ready`,
                  );
                  break;

                case 'dispatch':
                  updatedOrder.orderStatus = 'dispatched';
                  updatedOrder.status = 'active';
                  toast.success(
                    `Order #${order.orderNumber} marked as Dispatched`,
                  );
                  break;

                case 'mark_fulfilled':
                  updatedOrder.orderStatus = 'fulfilled';
                  updatedOrder.status = 'fulfilled';
                  toast.success(
                    `Order #${order.orderNumber} marked as Fulfilled`,
                  );
                  break;

                case 'cancel':
                  updatedOrder.orderStatus = 'cancelled';
                  updatedOrder.status = 'cancelled';
                  toast.error(`Order #${order.orderNumber} has been cancelled`);
                  break;

                case 'reopen':
                  updatedOrder.orderStatus = 'acknowledged';
                  updatedOrder.status = 'new';
                  toast.info(`Order #${order.orderNumber} has been reopened`);
                  break;

                case 'assign_delivery_boy':
                  const deliveryData = data as
                    | { deliveryBoyId?: string }
                    | undefined;
                  updatedOrder.deliveryBoy = deliveryData?.deliveryBoyId;
                  if (deliveryData?.deliveryBoyId) {
                    toast.success(
                      `Delivery boy assigned to order #${order.orderNumber}`,
                    );
                  }
                  break;

                case 'print_kot':
                  printReceipt(order, 'kot');
                  toast.success(`KOT printed for order #${order.orderNumber}`);
                  break;

                case 'print_bill':
                  printReceipt(order, 'bill');
                  toast.success(`Bill printed for order #${order.orderNumber}`);
                  break;

                case 'contact_customer':
                  toast.info(
                    `Contacting customer for order #${order.orderNumber}`,
                  );
                  break;

                default:
                  console.warn(`Unknown action: ${action}`);
              }

              updatedOrder.updatedAt = new Date().toISOString();
              return updatedOrder;
            }
            return order;
          });
        });
      } catch (error) {
        toast.error(`Failed to process action: ${action}`);
        console.error('Order action error:', error);
      } finally {
        setIsProcessing(null);
      }
    },
    [],
  );

  // Handle apply filters
  const handleApplyFilters = useCallback(() => {
    console.log('Applying filters:', filters, additionalFilters);
  }, [filters, additionalFilters]);

  // Filter orders based on filters
  const filteredOrders = useMemo<Order[]>(() => {
    return orders.filter((order) => {
      if (additionalFilters.search) {
        const searchLower = additionalFilters.search.toLowerCase();
        if (
          !(
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.externalOrderId.toLowerCase().includes(searchLower) ||
            order.customerName.toLowerCase().includes(searchLower) ||
            order.customerPhone.toLowerCase().includes(searchLower) ||
            order.restaurantName.toLowerCase().includes(searchLower)
          )
        ) {
          return false;
        }
      }

      if (filters.from) {
        const orderDate = new Date(order.createdAt);
        const fromDate = new Date(filters.from);
        if (orderDate < fromDate) {
          return false;
        }
      }

      if (filters.to) {
        const orderDate = new Date(order.createdAt);
        const toDate = new Date(filters.to);
        if (orderDate > toDate) {
          return false;
        }
      }

      if (filters.brandIds && filters.brandIds.length > 0) {
        if (!order.brandId || !filters.brandIds.includes(order.brandId)) {
          return false;
        }
      }

      if (filters.restaurantIds && filters.restaurantIds.length > 0) {
        if (!filters.restaurantIds.includes(order.restaurantId)) {
          return false;
        }
      }

      if (
        additionalFilters.externalOrderId &&
        !order.externalOrderId
          .toLowerCase()
          .includes(additionalFilters.externalOrderId.toLowerCase())
      ) {
        return false;
      }

      if (
        additionalFilters.platform &&
        order.platform !== additionalFilters.platform
      ) {
        return false;
      }

      if (additionalFilters.orderLater && !order.orderLater) {
        return false;
      }

      return true;
    });
  }, [orders, filters, additionalFilters]);

  // Create columns with handlers
  const columns = useMemo(
    () => createOrdersColumns(handleViewDetails, handleOrderAction),
    [handleViewDetails, handleOrderAction],
  );

  // Get status counts for display
  const statusCounts = useMemo(
    () => ({
      new: orders.filter((o) => o.status === 'new').length,
      active: orders.filter((o) => o.status === 'active').length,
      fulfilled: orders.filter((o) => o.status === 'fulfilled').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
      total: orders.length,
    }),
    [orders],
  );

  return (
    <Layout>
      <div className="flex flex-col h-full space-y-6 p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {t('navigation.onlineOrders')}
            </h2>
            <p className="text-muted-foreground">
              {t('orders.managementDescription')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh')}
            </Button>
          </div>
        </div>

        {/* Filters Section - FIRST */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <OrderFilters
            additionalFilters={additionalFilters}
            onAdditionalFilterChange={handleAdditionalFilterChange}
          />
        </ReportFilters>

        {/* Status Summary Cards - SECOND */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{statusCounts.total}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    New/Acknowledged
                  </p>
                  <p className="text-2xl font-bold">{statusCounts.new}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{statusCounts.active}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fulfilled</p>
                  <p className="text-2xl font-bold">{statusCounts.fulfilled}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cancelled</p>
                  <p className="text-2xl font-bold">{statusCounts.cancelled}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table - THIRD */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>{t('orders.managementTitle')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <TanStackTable
              columns={columns}
              data={filteredOrders}
              emptyMessage={
                filteredOrders.length === 0
                  ? additionalFilters.search ||
                    additionalFilters.externalOrderId ||
                    additionalFilters.platform ||
                    additionalFilters.orderLater ||
                    Object.keys(filters).length > 0
                    ? t('orders.noOrdersMatchFilters')
                    : t('orders.noOrdersFound')
                  : undefined
              }
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
