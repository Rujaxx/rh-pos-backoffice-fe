'use client';

import { ColumnDef } from '@tanstack/react-table';
import { KitchenDepartmentReportItem } from '@/types/kitchen-dept-report.type';
import { useTranslation } from '@/hooks/useTranslation';

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Create columns function
export const createKitchenDepartmentColumns = (
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<KitchenDepartmentReportItem>[] => [
  {
    accessorKey: 'kitchenDepartment',
    header:
      t('reports.kitchenDepartment.columns.kitchenDepartment') ||
      'Kitchen Department',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.kitchenDepartment}</div>
    ),
  },
  {
    accessorKey: 'categoryName',
    header: t('reports.category.columns.categoryName') || 'Category Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.categoryName}</div>
    ),
  },
  {
    accessorKey: 'soldItems',
    header: t('reports.category.columns.soldItems') || 'Total Sold Items',
    cell: ({ row }) => (
      <div className="font-medium">{formatNumber(row.original.soldItems)}</div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'totalAmount',
    header: t('reports.category.columns.totalAmount') || 'Total Amount',
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.original.totalAmount)}
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'itemLevelDiscount',
    header:
      t('reports.kitchenDepartment.columns.itemLevelDiscount') ||
      'Item Level Discount',
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.original.itemLevelDiscount)}
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  },
  {
    accessorKey: 'itemLevelTotalCharges',
    header:
      t('reports.kitchenDepartment.columns.itemLevelTotalCharges') ||
      'Item Level Total Charges',
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.original.itemLevelTotalCharges)}
      </div>
    ),
    meta: {
      className: 'text-center',
    },
  },
];

// Hook for using kitchen department columns
export const useKitchenDepartmentColumns = () => {
  const { t } = useTranslation();
  return createKitchenDepartmentColumns(t);
};
