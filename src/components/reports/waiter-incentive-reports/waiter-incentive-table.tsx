'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { WaiterIncentiveReportItem } from '@/types/waiter-incentive-report.type';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Settings } from 'lucide-react';

// Helper functions
const formatNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Create columns for waiter incentive report items
const createWaiterIncentiveColumns = (
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<WaiterIncentiveReportItem>[] => [
  {
    accessorKey: 'menuItemName',
    id: 'menuItemName',
    header: t('reports.waiterIncentive.columns.itemName') || 'Item Name',
    cell: ({ row }) => (
      <div className="font-medium">
        <div>{row.original.menuItemName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.menuItemShortCode}
        </div>
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: 'price',
    id: 'price',
    header: t('reports.waiterIncentive.columns.price') || 'Price',
    cell: ({ row }) => (
      <div className="font-medium">{formatNumber(row.original.price)}</div>
    ),
    size: 100,
  },
  {
    accessorKey: 'quantity',
    id: 'quantity',
    header: t('reports.waiterIncentive.columns.quantity') || 'Qty',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.quantity}</div>
    ),
    size: 80,
  },
  {
    accessorKey: 'amount',
    id: 'amount',
    header: t('reports.waiterIncentive.columns.amount') || 'Amount',
    cell: ({ row }) => (
      <div className="font-medium">{formatNumber(row.original.amount)}</div>
    ),
    size: 120,
  },
  {
    accessorKey: 'incentiveValue',
    id: 'incentiveValue',
    header:
      t('reports.waiterIncentive.columns.incentiveValue') || 'Incentive Value',
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.incentiveType === 'PERCENTAGE'
          ? `${formatNumber(row.original.incentiveValue)}%`
          : formatNumber(row.original.incentiveValue)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: 'totalIncentive',
    id: 'totalIncentive',
    header:
      t('reports.waiterIncentive.columns.totalIncentive') || 'Total Incentive',
    cell: ({ row }) => (
      <div className="font-bold">
        {formatNumber(row.original.totalIncentive)}
      </div>
    ),
    size: 120,
  },
];

interface WaiterIncentiveTableProps {
  data: WaiterIncentiveReportItem[];
  isLoading?: boolean;
  onConfigureIncentive?: () => void;
  onDownload?: () => void;
}

export function WaiterIncentiveTable({
  data,
  isLoading = false,
  onConfigureIncentive,
  onDownload,
}: WaiterIncentiveTableProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Memoize columns
  const columns = useMemo(() => createWaiterIncentiveColumns(t), [t]);

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

  // Calculate totals
  const totals = useMemo(() => {
    return data.reduce(
      (acc, item) => {
        acc.totalAmount += item.amount;
        acc.totalIncentive += item.totalIncentive;
        return acc;
      },
      { totalAmount: 0, totalIncentive: 0 },
    );
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            {t('reports.waiterIncentive.waiterIncentiveReport') ||
              'Waiter Incentive Report'}
          </CardTitle>
        </div>

        {/* Action buttons on the right */}
        <div className="flex items-center gap-2">
          {onConfigureIncentive && (
            <Button
              variant="outline"
              onClick={onConfigureIncentive}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('reports.waiterIncentive.configureIncentive') ||
                'Configure Incentive'}
            </Button>
          )}
          {onDownload && data.length > 0 && (
            <Button
              variant="default"
              onClick={onDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('common.download') || 'Download'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('common.loading') || 'Loading incentive data...'}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {t('reports.waiterIncentive.noData') ||
              'No incentive data available'}
          </div>
        ) : (
          <TanStackTable<WaiterIncentiveReportItem>
            data={data}
            columns={columns}
            totalCount={data.length}
            isLoading={false}
            searchValue={searchTerm}
            searchPlaceholder={
              t('reports.waiterIncentive.searchPlaceholder') ||
              'Search incentive data...'
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
            emptyMessage={
              t('reports.waiterIncentive.noData') ||
              'No incentive data available'
            }
            enableMultiSort={false}
          />
        )}
      </CardContent>
    </Card>
  );
}
