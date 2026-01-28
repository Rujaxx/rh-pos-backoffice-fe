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
import { EditableSelectCell } from '@/components/menu-management/menu-items/editable-cells-components';

import {
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Printer,
} from 'lucide-react';
import { format } from 'date-fns';
import { OrderListItem, OrderStatus } from '@/types/order';

export const createOrdersColumns = (
  onViewDetails: (order: OrderListItem) => void,
  onAction: (orderId: string, action: string, data?: unknown) => void,
  onStatusUpdate: (orderId: string, status: OrderStatus) => Promise<void>,
  loadingOrders: Set<string>,
): ColumnDef<OrderListItem>[] => [
  {
    accessorKey: 'orderNumber',
    header: 'Order #',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div className="font-medium">
          <div>{order.orderNumber}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'restaurantDoc',
    header: 'Restaurant',
    cell: ({ row }) => {
      const order = row.original;
      return <div>{order.restaurantDoc?.name.en || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => {
      const order = row.original;
      return (
        <div>
          <div className="font-medium">{order.customerName || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">
            {order.customerPhone || ''}
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const order = row.original;

      // Status options for the dropdown
      const statusOptions = [
        { value: OrderStatus.PENDING, label: 'Pending' },
        { value: OrderStatus.CONFIRMED, label: 'Confirmed' },
        { value: OrderStatus.RUNNING, label: 'Running' },
        { value: OrderStatus.ACTIVE, label: 'Active' },
        { value: OrderStatus.FOOD_READY, label: 'Food Ready' },
        { value: OrderStatus.DISPATCHED, label: 'Dispatched' },
        { value: OrderStatus.FULFILLED, label: 'Fulfilled' },
        { value: OrderStatus.CANCELLED, label: 'Cancelled' },
      ];

      return (
        <EditableSelectCell
          value={order.status}
          options={statusOptions}
          onChange={(value) => onStatusUpdate(order._id, value as OrderStatus)}
          isLoading={loadingOrders.has(order._id)}
          placeholder="Select status"
        />
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
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => {
      const order = row.original;
      const isPaid = order.paymentStatus === 'PAID';
      const paymentMethod = order.payments?.[0]?.method || 'N/A';

      return (
        <div>
          <Badge
            variant={isPaid ? 'default' : 'secondary'}
            className={isPaid ? 'bg-green-100 text-green-800' : ''}
          >
            {paymentMethod}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {order.paymentStatus}
          </div>
        </div>
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

              {order.status === 'CONFIRMED' && (
                <DropdownMenuItem
                  onClick={() => onAction(order._id, 'food_ready')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Food Ready
                </DropdownMenuItem>
              )}

              {order.status === 'FOOD_READY' && (
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

              {order.status === 'DISPATCHED' && (
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

              {(order.status === 'CONFIRMED' ||
                order.status === 'FOOD_READY' ||
                order.status === 'DISPATCHED') && (
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

              {(order.status === 'FULFILLED' ||
                order.status === 'CANCELLED') && (
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
