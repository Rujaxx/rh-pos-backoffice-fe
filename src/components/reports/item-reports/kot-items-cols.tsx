'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { KotItem } from '@/types/item-report.type';

export const createKotItemsColumns = (): ColumnDef<KotItem>[] => [
  {
    accessorKey: 'kotNumber',
    header: 'KOT Number',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.kotNumber}</div>
    ),
  },
  {
    accessorKey: 'itemName',
    header: 'Item Name',
    cell: ({ row }) => <div>{row.original.itemName}</div>,
  },
  {
    accessorKey: 'orderType',
    header: 'Order Type',
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.orderType.replace('-', ' ')}
      </div>
    ),
  },
  {
    accessorKey: 'tableNumber',
    header: 'Table Number',
    cell: ({ row }) => <div>{row.original.tableNumber}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const getVariant = () => {
        switch (status) {
          case 'settled':
            return 'default';
          case 'placed':
            return 'secondary';
          case 'cancelled':
            return 'destructive';
          default:
            return 'secondary';
        }
      };

      return (
        <Badge variant={getVariant()} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <div>{row.original.username}</div>,
  },
  {
    accessorKey: 'placedQty',
    header: 'Placed Qty',
    cell: ({ row }) => (
      <div className="text-center">{row.original.placedQty}</div>
    ),
  },
  {
    accessorKey: 'settleQty',
    header: 'Settle Qty',
    cell: ({ row }) => (
      <div className="text-center">{row.original.settleQty}</div>
    ),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => (
      <div className="font-medium">${row.original.price.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <div>{format(new Date(row.original.date), 'MMM dd, yyyy HH:mm')}</div>
    ),
  },
];
