'use client';

import { ColumnDef } from '@tanstack/react-table';
import { KitchenDepartmentReportItem } from '@/types/kitchen-department-report.type';
import { useTranslation } from '@/hooks/useTranslation';

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
    accessorKey: 'kitchenDepartmentName',
    header:
      t('reports.kitchenDepartment.kitchenDepartmentName') ||
      'Kitchen Department',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.kitchenDepartmentName}</div>
    ),
  },
  {
    accessorKey: 'totalItemSold',
    header: () => <div className="text-right">Items Sold</div>,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatNumber(row.original.totalItemSold)}
      </div>
    ),
  },
  {
    accessorKey: 'totalRevenue',
    header: () => <div className="text-right">Total Revenue</div>,
    cell: ({ row }) => (
      <div className="font-medium text-green-600">
        {formatCurrency(row.original.totalRevenue)}
      </div>
    ),
  },
  {
    accessorKey: 'itemLevelCharges',
    header: () => <div className="text-right">Total Charges</div>,
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {formatCurrency(row.original.itemLevelCharges)}
      </div>
    ),
  },
  {
    accessorKey: 'itemLevelDiscount',
    header: () => <div className="text-right">Total Discount</div>,
    cell: ({ row }) => (
      <div className="font-medium text-orange-600">
        {formatCurrency(row.original.itemLevelDiscount)}
      </div>
    ),
  },
  {
    accessorKey: 'averagePrice',
    header: () => <div className="text-right">Average Price</div>,
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.original.averagePrice)}
      </div>
    ),
  },
];

// Hook for using kitchen department columns
export const useKitchenDepartmentColumns = () => {
  const { t } = useTranslation();
  return createKitchenDepartmentColumns(t);
};
