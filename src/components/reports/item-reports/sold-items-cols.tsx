'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SoldItem } from '@/types/item-report.type';

export const createSoldItemsColumns = (): ColumnDef<SoldItem>[] => [
  {
    accessorKey: 'itemName',
    header: 'Item Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.itemName}</div>
    ),
  },
  {
    accessorKey: 'averagePrice',
    header: 'Average Price',
    cell: ({ row }) => (
      <div className="font-medium">${row.original.averagePrice.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: 'quantity', // Changed from quality to quantity
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
    accessorKey: 'discountOnItem',
    header: 'Discount',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.discountOnItem.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: 'parentCategory',
    header: 'Parent Category',
    cell: ({ row }) => <div>{row.original.parentCategory}</div>,
  },
  {
    accessorKey: 'subCategory',
    header: 'Sub Category',
    cell: ({ row }) => <div>{row.original.subCategory}</div>,
  },
];
