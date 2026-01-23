'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { BillDetail } from '@/types/item-report.type';

export const createBillDetailsColumns = (): ColumnDef<BillDetail>[] => [
  {
    accessorKey: 'billNumber',
    header: 'Bill Number',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.billNumber}</div>
    ),
  },
  {
    accessorKey: 'grandTotal',
    header: 'Grand Total',
    cell: ({ row }) => (
      <div className="font-medium">${row.original.grandTotal.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => <div>{row.original.user}</div>,
  },
  {
    accessorKey: 'kotNumber',
    header: 'KOT Number',
    cell: ({ row }) => <div>{row.original.kotNumber}</div>,
  },
  {
    accessorKey: 'dateTime',
    header: 'Date Time',
    cell: ({ row }) => (
      <div>{format(new Date(row.original.dateTime), 'MMM dd, yyyy HH:mm')}</div>
    ),
  },
];
