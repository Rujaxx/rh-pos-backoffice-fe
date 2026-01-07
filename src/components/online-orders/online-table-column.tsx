'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  Printer,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Define button variant type
type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link';

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
  items: Array<{
    _id: string;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    tax: number;
    subtotal: number;
  }>;
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

interface ButtonAction {
  label: string;
  action: string;
  variant: ButtonVariant;
}

interface StatusConfig {
  variant: 'default' | 'secondary' | 'destructive';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  className?: string;
  buttonActions?: ButtonAction[];
}

// Available delivery boys
const deliveryBoys = [
  { id: 'rider-001', name: 'Rider-001' },
  { id: 'rider-002', name: 'Rider-002' },
  { id: 'rider-003', name: 'Rider-003' },
  { id: 'rider-004', name: 'Rider-004' },
];

export const createOrdersColumns = (
  onViewDetails: (order: Order) => void,
  onAction: (orderId: string, action: string, data?: unknown) => void,
): ColumnDef<Order>[] => [
  {
    accessorKey: 'orderNumber',
    id: 'orderNumber',
    header: 'Order #',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="font-medium text-sm">
          <div>{order.orderNumber}</div>
          <div className="text-xs text-muted-foreground">
            {order.externalOrderId}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'restaurantName',
    id: 'restaurant',
    header: 'Restaurant',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      return <div className="text-sm">{order.restaurantName}</div>;
    },
  },
  {
    accessorKey: 'customerName',
    id: 'customer',
    header: 'Customer',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">{order.customerName}</div>
          <div className="text-xs text-muted-foreground">
            {order.customerPhone}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'time',
    header: 'Time',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="text-sm space-y-1">
          <div>{format(new Date(order.createdAt), 'MM/dd')}</div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(order.createdAt), 'hh:mm a')}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'orderStatus',
    id: 'status',
    header: 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      const getStatusConfig = (): StatusConfig => {
        switch (order.orderStatus) {
          case 'acknowledged':
            return {
              variant: 'default',
              icon: Clock,
              label: 'Acknowledged',
              buttonActions: [
                {
                  label: 'Food Ready',
                  action: 'food_ready',
                  variant: 'default',
                },
                { label: 'Cancel', action: 'cancel', variant: 'destructive' },
              ],
            };
          case 'food_ready':
            return {
              variant: 'secondary',
              icon: CheckCircle,
              label: 'Food Ready',
              buttonActions: [
                { label: 'Dispatch', action: 'dispatch', variant: 'default' },
                {
                  label: 'Mark Fulfilled',
                  action: 'mark_fulfilled',
                  variant: 'outline',
                },
              ],
            };
          case 'dispatched':
            return {
              variant: 'default',
              icon: Truck,
              label: 'Dispatched',
              buttonActions: [
                {
                  label: 'Mark Fulfilled',
                  action: 'mark_fulfilled',
                  variant: 'default',
                },
              ],
            };
          case 'fulfilled':
            return {
              variant: 'default',
              icon: CheckCircle,
              label: 'Fulfilled',
              className: 'bg-green-100 text-green-800',
            };
          case 'cancelled':
            return {
              variant: 'destructive',
              icon: XCircle,
              label: 'Cancelled',
            };
          default:
            return {
              variant: 'default',
              icon: Clock,
              label: 'Acknowledged',
            };
        }
      };

      const config = getStatusConfig();
      const Icon = config.icon;

      return (
        <div className="space-y-2">
          <Badge
            variant={config.variant}
            className={cn('gap-1', config.className)}
          >
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>

          {/* Quick Action Buttons */}
          {config.buttonActions && (
            <div className="flex flex-wrap gap-1 mt-1">
              {config.buttonActions.map((action: ButtonAction) => (
                <Button
                  key={action.action}
                  variant={action.variant}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(order._id, action.action);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'deliveryType',
    id: 'delivery',
    header: 'Delivery',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      const Icon = order.deliveryType === 'delivery' ? Truck : Package;

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Icon className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm capitalize">{order.deliveryType}</span>
          </div>

          {/* Delivery Boy Assignment */}
          {order.deliveryType === 'delivery' && (
            <Select
              value={order.deliveryBoy || ''}
              onValueChange={(value) => {
                onAction(order._id, 'assign_delivery_boy', {
                  deliveryBoyId: value,
                });
              }}
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Assign Rider" />
              </SelectTrigger>
              <SelectContent>
                {deliveryBoys.map((rider) => (
                  <SelectItem key={rider.id} value={rider.id}>
                    {rider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'totalAmount',
    id: 'total',
    header: 'Total',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="font-medium text-sm">
          ${order.totalAmount.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: 'paymentMethod',
    id: 'payment',
    header: 'Payment',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      const getPaymentLabel = (): string => {
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

      const paymentLabel = getPaymentLabel();
      const isPaid = order.paymentStatus === 'paid';

      return (
        <div className="space-y-1">
          <Badge
            variant={isPaid ? 'default' : 'secondary'}
            className={isPaid ? 'bg-green-100 text-green-800' : ''}
          >
            {paymentLabel}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {order.paymentStatus}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'platform',
    id: 'platform',
    header: 'Platform',
    enableSorting: true,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Badge variant="outline" className="text-xs capitalize">
          {order.platform.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewDetails(order)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Status-specific actions */}
              {order.orderStatus === 'acknowledged' && (
                <>
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'food_ready')}
                    className="cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Food Ready
                  </DropdownMenuItem>
                </>
              )}

              {order.orderStatus === 'food_ready' && (
                <>
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'dispatch')}
                    className="cursor-pointer"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as Dispatched
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'mark_fulfilled')}
                    className="cursor-pointer"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Fulfilled
                  </DropdownMenuItem>
                </>
              )}

              {order.orderStatus === 'dispatched' && (
                <DropdownMenuItem
                  onClick={() => onAction(order._id, 'mark_fulfilled')}
                  className="cursor-pointer"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Fulfilled
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {/* Print Actions */}
              <DropdownMenuItem
                onClick={() => onAction(order._id, 'print_kot')}
                className="cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print KOT
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction(order._id, 'print_bill')}
                className="cursor-pointer"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Bill
              </DropdownMenuItem>

              {/* Cancel/Reopen based on status */}
              {(order.orderStatus === 'acknowledged' ||
                order.orderStatus === 'food_ready' ||
                order.orderStatus === 'dispatched') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'cancel')}
                    className="cursor-pointer text-red-600"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </DropdownMenuItem>
                </>
              )}

              {(order.orderStatus === 'fulfilled' ||
                order.orderStatus === 'cancelled') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'reopen')}
                    className="cursor-pointer"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Reopen Order
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
