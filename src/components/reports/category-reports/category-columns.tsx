'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CategoryReportItem } from '@/types/category-report.type';
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
export const createCategoryColumns = (
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<CategoryReportItem>[] => [
  {
    accessorKey: 'categoryName',
    header: t('reports.category.columns.categoryName') || 'Category Name',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.categoryName}</div>
    ),
  },
  {
    accessorKey: 'parentCategoryName',
    header: t('reports.category.columns.parentCategory') || 'Parent Category',
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.parentCategoryName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'totalItemSold',
    header: t('reports.category.columns.soldItems') || 'Total Sold Items',
    cell: ({ row }) => (
      <div className="font-medium">
        {formatNumber(row.original.totalItemSold)}
      </div>
    ),
  },
  {
    accessorKey: 'totalRevenue',
    header: t('reports.category.columns.totalAmount') || 'Total Amount',
    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.original.totalRevenue)}
      </div>
    ),
  },
  {
    accessorKey: 'averagePrice',
    header: () => <div className="text-right">Average Price</div>,
    cell: ({ row }: { row: { original: CategoryReportItem } }) => (
      <div className="font-medium">
        {formatCurrency(row.original.averagePrice)}
      </div>
    ),
  },
];

// Hook for using category columns
export const useCategoryColumns = () => {
  const { t } = useTranslation();
  return createCategoryColumns(t);
};
