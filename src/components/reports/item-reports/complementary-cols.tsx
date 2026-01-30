'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ComplementaryItem } from '@/types/item-report.type';

export const createComplementaryColumns =
  (): ColumnDef<ComplementaryItem>[] => [
    {
      accessorKey: 'itemName',
      header: 'Item Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.itemName}</div>
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
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.quantity}</div>
      ),
    },
    {
      accessorKey: 'totalQty',
      header: 'Total',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.totalQty}</div>
      ),
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => <div>{row.original.reason}</div>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div>{format(new Date(row.original.date), 'MMM dd, yyyy')}</div>
      ),
    },
  ];
