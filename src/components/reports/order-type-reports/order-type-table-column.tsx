'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { OrderTypeReportItem } from '@/types/report.type';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

// Create columns function
export const createOrderTypeColumns = (
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
): ColumnDef<OrderTypeReportItem>[] => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={row.getToggleExpandedHandler()}
          className="h-8 w-8 p-0"
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      );
    },
    size: 60,
  },
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
    size: 200,
  },
  {
    accessorKey: 'itemCount',
    id: 'itemCount',
    header: t('reports.orderType.columns.orderCount') || 'Total Orders',
    enableSorting: true,
    cell: ({ row }) => (
      <div className="font-medium text-center">
        {formatNumber(row.original.itemCount)}
      </div>
    ),
    size: 120,
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
      <div className="font-medium text-center">
        {formatCurrency(row.original.amount)}
      </div>
    ),
    size: 150,
    meta: {
      className: 'text-center',
    },
  },
];

// Hook for using order type columns
export const useOrderTypeColumns = () => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createOrderTypeColumns(t, locale);
};
