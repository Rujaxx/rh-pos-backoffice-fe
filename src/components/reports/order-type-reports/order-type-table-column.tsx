'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { OrderTypeReportItem } from '@/types/report.type';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Column definitions for the order type table
export const createOrderTypeColumns = (
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
): ColumnDef<OrderTypeReportItem>[] => [
  {
    accessorKey: 'orderType',
    id: 'orderType',
    header: t('reports.orderType.columns.orderFrom') || 'Order Type',
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const getText = (item: OrderTypeReportItem) => {
        const orderType = item.orderType;
        if (typeof orderType === 'string') return orderType.toLowerCase();
        if (typeof orderType === 'object') {
          return (orderType[locale] || orderType.en || '').toLowerCase();
        }
        return '';
      };

      const aValue = getText(rowA.original);
      const bValue = getText(rowB.original);
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const orderType = row.original.orderType;
      let orderTypeText = 'Unknown';

      if (typeof orderType === 'string') {
        orderTypeText = orderType;
      } else if (typeof orderType === 'object') {
        orderTypeText = orderType[locale] || orderType.en || 'Unknown';
      }

      return <div className="font-medium">{orderTypeText}</div>;
    },
  },
  {
    accessorKey: 'itemCount',
    id: 'itemCount',
    header: t('reports.orderType.columns.orderCount') || 'Items',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium text-center">{row.original.itemCount}</div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'amount',
    id: 'amount',
    header: t('reports.orderType.columns.totalAmount') || 'Amount',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">{formatCurrency(row.original.amount)}</div>
    ),
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: t('reports.orderType.columns.status') || 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusColors: Record<string, string> = {
        COMPLETED: 'bg-green-500 text-white',
        ACTIVE: 'bg-blue-500 text-white',
        CANCELLED: 'bg-red-500 text-white',
        PENDING: 'bg-yellow-500 text-white',
      };

      return (
        <Badge className={statusColors[status] || 'bg-gray-500 text-white'}>
          {status}
        </Badge>
      );
    },
  },
];

// Hook for using order type columns with current translation
export const useOrderTypeColumns = () => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createOrderTypeColumns(t, locale);
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  // Map TanStack column IDs to backend field names
  const fieldMap: Record<string, string> = {
    orderType: 'orderType',
    itemCount: 'itemCount',
    amount: 'amount',
    status: 'status',
  };

  return fieldMap[sort.id] || sort.id;
};

// Helper function to get sort order from TanStack sorting state
export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? 'desc' : 'asc';
};
