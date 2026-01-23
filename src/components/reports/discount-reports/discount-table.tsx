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

// Create columns for discount report items - LIKE PAYMENT TABLE
const createDiscountReportItemColumns = (
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<DiscountReportItem>[] => [
  {
    accessorKey: 'orderFrom',
    id: 'orderFrom',
    header: t('reports.discount.columns.orderFrom') || 'Order From',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.orderFrom}
        {row.original.customerName && (
          <div className="text-xs text-muted-foreground">
            {row.original.customerName}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'discountAmount',
    id: 'discountAmount',
    header: t('reports.discount.columns.discountAmount') || 'Discount Amount',
    cell: ({ row }) => (
      <div className="font-medium">
        {formatAmount(row.original.discountAmount)}
      </div>
    ),
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: t('reports.discount.columns.status') || 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        Fulfilled: {
          variant: 'default' as const,
          className: 'bg-green-500 text-white',
        },
        Free: {
          variant: 'outline' as const,
          className: 'bg-yellow-500 text-white',
        },
        Cancelled: {
          variant: 'secondary' as const,
          className: 'bg-red-500 text-white',
        },
      }[status] || {
        variant: 'outline' as const,
        className: 'bg-gray-100 text-gray-800',
      };

      return (
        <Badge
          variant={statusConfig.variant}
          className={statusConfig.className}
        >
          {status}
        </Badge>
      );
    },
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
