'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { OrderTypeReportItem } from '@/types/report.type';
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

// Helper function to format number
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Column definitions for the order type table WITH CALCULATED TOTALS
export const createOrderTypeColumns = (
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
  totals: {
    fulfilled: number;
    running: number;
    free: number;
    cancelled: number;
  },
): ColumnDef<OrderTypeReportItem>[] => [
  {
    accessorKey: 'orderType',
    id: 'orderType',
    header: t('reports.orderType.columns.orderFrom') || 'Order From',
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
    header: t('reports.orderType.columns.orderCount') || 'Total Orders',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium ">{formatNumber(row.original.itemCount)}</div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'amount',
    id: 'amount',
    header: t('reports.orderType.columns.totalAmount') || 'Total Amount',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">{formatCurrency(row.original.amount)}</div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'fulfilled',
    id: 'fulfilled',
    header: `${t('reports.orderType.columns.fulfilled') || 'Fulfilled'} (${formatNumber(totals.fulfilled)})`,
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatNumber(row.original.fulfilled || 0)}
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'running',
    id: 'running',
    header: `${t('reports.orderType.columns.running') || 'Running'} (${formatNumber(totals.running)})`,
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatNumber(row.original.running || 0)}
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'free',
    id: 'free',
    header: `${t('reports.orderType.columns.free') || 'Free'} (${formatNumber(totals.free)})`,
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">{formatNumber(row.original.free || 0)}</div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'cancelled',
    id: 'cancelled',
    header: `${t('reports.orderType.columns.cancelled') || 'Cancelled'} (${formatNumber(totals.cancelled)})`,
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatNumber(row.original.cancelled || 0)}
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  },
];

// Hook for using order type columns with current translation
export const useOrderTypeColumns = (totals: {
  fulfilled: number;
  running: number;
  free: number;
  cancelled: number;
}) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createOrderTypeColumns(t, locale, totals);
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
    fulfilled: 'fulfilled',
    running: 'running',
    free: 'free',
    cancelled: 'cancelled',
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

// Helper function to calculate totals from data
export const calculateStatusTotals = (data: OrderTypeReportItem[]) => {
  return data.reduce(
    (acc, item) => ({
      fulfilled: acc.fulfilled + (item.fulfilled || 0),
      running: acc.running + (item.running || 0),
      free: acc.free + (item.free || 0),
      cancelled: acc.cancelled + (item.cancelled || 0),
    }),
    {
      fulfilled: 0,
      running: 0,
      free: 0,
      cancelled: 0,
    },
  );
};
