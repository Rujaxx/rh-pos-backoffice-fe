'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { DiscountReportItem } from '@/types/discount-report.type';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Helper functions
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Create columns for discount report items
const createDiscountReportItemColumns = (
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<DiscountReportItem>[] => [
  {
    accessorKey: 'orderType',
    id: 'orderType',
    header: t('reports.discount.columns.orderType') || 'Order Type',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.orderType}</div>
    ),
  },
  {
    accessorKey: 'billStatus',
    id: 'billStatus',
    header: t('reports.discount.columns.billStatus') || 'Bill Status',
    cell: ({ row }) => {
      const status = row.original.billStatus;
      // Simple status badge logic
      const variant =
        status === 'Paid' || status === 'PAID' ? 'default' : 'secondary';
      const className =
        status === 'Paid' || status === 'PAID'
          ? 'bg-green-500 text-white'
          : 'bg-gray-500 text-white';

      return (
        <Badge variant={variant} className={className}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'totalDiscount',
    id: 'totalDiscount',
    header: () => (
      <div className="text-right">
        {t('reports.discount.columns.totalDiscount') || 'Total Discount'}
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium text-orange-600">
        {formatAmount(row.original.totalDiscount)}
      </div>
    ),
  },
  {
    accessorKey: 'billCount',
    id: 'billCount',
    header: () => (
      <div className="text-center">
        {t('reports.discount.columns.billCount') || 'Bill Count'}
      </div>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.billCount}</div>
    ),
  },
];

interface DiscountDataTableProps {
  data: DiscountReportItem[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function DiscountDataTable({
  data,
  isLoading = false,
  searchPlaceholder = 'reports.discount.searchPlaceholder',
  emptyMessage = 'reports.discount.noData',
}: DiscountDataTableProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Memoize columns
  const columns = useMemo(() => createDiscountReportItemColumns(t), [t]);

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
  );

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <div>
          <CardTitle className="text-lg">
            {t('reports.discount.discountItemWise') || 'Discount Report'}
          </CardTitle>
        </div>
        {data.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {data.length} discount items
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('common.loading') || 'Loading discount data...'}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t(emptyMessage) || 'No discount data available'}
          </div>
        ) : (
          <TanStackTable<DiscountReportItem>
            data={data}
            columns={columns}
            totalCount={data.length}
            isLoading={false}
            searchValue={searchTerm}
            searchPlaceholder={
              t(searchPlaceholder) || 'Search discount data...'
            }
            onSearchChange={setSearchTerm}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            columnFilters={columnFilters}
            onColumnFiltersChange={handleColumnFiltersChange}
            manualPagination={false}
            manualSorting={false}
            manualFiltering={false}
            showSearch={true}
            showPagination={true}
            showPageSizeSelector={true}
            emptyMessage={t(emptyMessage) || 'No discount data available'}
            enableMultiSort={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
