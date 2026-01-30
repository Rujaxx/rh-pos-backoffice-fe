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
    accessorKey: 'restaurantName',
    header: 'Restaurant',
  },
  {
    accessorKey: 'categoryName',
    header: 'Category',
  },
  {
    accessorKey: 'parentCategoryName',
    header: 'Parent Category',
    cell: ({ row }) => <div>{row.original.parentCategoryName || '-'}</div>,
  },
  {
    accessorKey: 'taxProductGroupName',
    header: 'Tax Product Group',
    cell: ({ row }) => <div>{row.original.taxProductGroupName || '-'}</div>,
  },
  {
    accessorKey: 'taxType',
    header: 'Tax Type',
  },
  {
    accessorKey: 'taxValue',
    header: 'Tax Value',
    cell: ({ row }) => <div>{row.original.taxValue}</div>,
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: 'avgPrice',
    header: 'Avg Price',
    cell: ({ row }) => (
      <div className="font-medium">${row.original.avgPrice.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: 'totalPriceOfSoldItem',
    header: 'Total Price',
    cell: ({ row }) => (
      <div className="font-medium">
        ${row.original.totalPriceOfSoldItem.toFixed(2)}
      </div>
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
    accessorKey: 'netAmount',
    header: 'Net Amount',
    cell: ({ row }) => (
      <div className="font-medium font-bold">
        ${row.original.netAmount.toFixed(2)}
      </div>
    ),
  },
];
