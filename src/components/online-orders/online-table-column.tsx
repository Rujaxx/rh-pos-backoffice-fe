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
import { Order } from '@/types/order';

export const createOrdersColumns = (
  onViewDetails: (order: Order) => void,
  onAction: (orderId: string, action: string, data?: unknown) => void,
): ColumnDef<Order>[] => [
  {
    accessorKey: 'orderNumber',
    header: 'Order #',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="font-medium">
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
    header: 'Restaurant',
    cell: ({ row }) => {
      const order = row.original;
      return <div>{order.restaurantName}</div>;
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-medium">{order.customerName}</div>
          <div className="text-sm text-muted-foreground">
            {order.customerPhone}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Time',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div>{format(new Date(order.createdAt), 'MM/dd')}</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(order.createdAt), 'hh:mm a')}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'orderStatus',
    header: 'Status',
    cell: ({ row }) => {
      const order = row.original;
      const getStatusConfig = () => {
        switch (order.orderStatus) {
          case 'acknowledged':
            return {
              variant: 'default' as const,
              icon: Clock,
              label: 'Acknowledged',
            };
          case 'food_ready':
            return {
              variant: 'secondary' as const,
              icon: CheckCircle,
              label: 'Food Ready',
            };
          case 'dispatched':
            return {
              variant: 'default' as const,
              icon: Truck,
              label: 'Dispatched',
            };
          case 'fulfilled':
            return {
              variant: 'default' as const,
              icon: CheckCircle,
              label: 'Fulfilled',
              className: 'bg-green-100 text-green-800',
            };
          case 'cancelled':
            return {
              variant: 'destructive' as const,
              icon: XCircle,
              label: 'Cancelled',
            };
          default:
            return {
              variant: 'default' as const,
              icon: Clock,
              label: 'Acknowledged',
            };
        }
      };

      const config = getStatusConfig();
      const Icon = config.icon;

      return (
        <Badge
          variant={config.variant}
          className={`gap-1 ${config.className || ''}`}
        >
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'deliveryType',
    header: 'Delivery',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {order.deliveryType === 'delivery' ? (
              <Truck className="h-3 w-3" />
            ) : (
              <Package className="h-3 w-3" />
            )}
            <span className="capitalize">{order.deliveryType}</span>
          </div>
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
                {['Rider-001', 'Rider-002', 'Rider-003'].map((rider) => (
                  <SelectItem key={rider} value={rider}>
                    {rider}
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
    header: 'Total',
    cell: ({ row }) => {
      const order = row.original;
      return <div className="font-medium">${order.totalAmount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Payment',
    cell: ({ row }) => {
      const order = row.original;
      const getPaymentLabel = () => {
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

      const isPaid = order.paymentStatus === 'paid';
      return (
        <div>
          <Badge
            variant={isPaid ? 'default' : 'secondary'}
            className={isPaid ? 'bg-green-100 text-green-800' : ''}
          >
            {getPaymentLabel()}
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
    header: 'Platform',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <Badge variant="outline" className="capitalize">
          {order.platform.replace('_', ' ')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
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

              {order.orderStatus === 'acknowledged' && (
                <DropdownMenuItem
                  onClick={() => onAction(order._id, 'food_ready')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Food Ready
                </DropdownMenuItem>
              )}

              {order.orderStatus === 'food_ready' && (
                <>
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'dispatch')}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as Dispatched
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'mark_fulfilled')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Fulfilled
                  </DropdownMenuItem>
                </>
              )}

              {order.orderStatus === 'dispatched' && (
                <DropdownMenuItem
                  onClick={() => onAction(order._id, 'mark_fulfilled')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Fulfilled
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onAction(order._id, 'print_kot')}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print KOT
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAction(order._id, 'print_bill')}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Bill
              </DropdownMenuItem>

              {(order.orderStatus === 'acknowledged' ||
                order.orderStatus === 'food_ready' ||
                order.orderStatus === 'dispatched') && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onAction(order._id, 'cancel')}
                    className="text-red-600"
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
