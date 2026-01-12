'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, Eye } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { OrderTypeReportItem } from '@/types/report.type';
import { useOrderTypeReports } from '@/services/api/reports';
import { OrderTypeReportFilters } from '@/components/reports/report-filters/ordertype-report-filter';
import { OrderTypeDetailsModal } from '@/components/reports/order-type-reports/order-details-modal';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

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

const getSafeNumber = (value: number | undefined): number => value ?? 0;

// Define columns for TanStackTable
const getOrderTypeColumns = (
  handleViewDetails: (item: OrderTypeReportItem) => void,
) => [
  {
    accessorKey: 'orderType',
    header: 'Order Source',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => {
      const orderType = row.original.orderType;
      return (
        <div className="font-medium">
          {typeof orderType === 'string' ? orderType : orderType.en}
        </div>
      );
    },
  },
  {
    accessorKey: 'itemCount',
    header: 'Total Orders',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => (
      <div className="text-center font-medium">
        {formatNumber(row.original.itemCount)}
      </div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Total Amount',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => (
      <div className="text-center font-medium text-green-600">
        {formatCurrency(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: 'fulfilled',
    header: 'Fulfilled',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => (
      <div className="text-center font-medium">
        {formatNumber(getSafeNumber(row.original.fulfilled))}
      </div>
    ),
  },
  {
    accessorKey: 'cancelled',
    header: 'Cancelled',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => (
      <div className="text-center font-medium">
        {formatNumber(getSafeNumber(row.original.cancelled))}
      </div>
    ),
  },
  {
    accessorKey: 'pending',
    header: 'Pending',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => (
      <div className="text-center font-medium">
        {formatNumber(getSafeNumber(row.original.pending))}
      </div>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: OrderTypeReportItem } }) => (
      <div className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewDetails(row.original)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

// Main Component
export default function OrderTypeReportPage() {
  const { t } = useTranslation();

  // Initialize filters
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    return {
      from: lastMonth.toISOString(),
      to: today.toISOString(),
    };
  });

  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderTypeReportItem | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Build query params
  const queryParams: ReportQueryParams = useMemo(() => {
    const activeFilters = submittedFilters || {};
    return {
      ...activeFilters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [submittedFilters, pagination]);

  // Fetch reports - ALWAYS ENABLED when filters are submitted
  const {
    data: reportsData,
    isLoading,
    refetch,
  } = useOrderTypeReports(queryParams, {
    enabled: !!submittedFilters,
  });

  // Use real API data only
  const orderTypeData = reportsData?.data ?? [];
  const totalCount = reportsData?.meta?.total ?? 0;

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    setFilters({
      from: lastMonth.toISOString(),
      to: today.toISOString(),
    });
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: 10 });
  }, []);

  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
    toast.info('Fetching order type data...');
  }, [filters]);

  const handleRefresh = useCallback(() => {
    if (!submittedFilters) {
      toast.info('Please apply filters first');
      return;
    }

    refetch();
    toast.success(t('common.refreshSuccess') || 'Data refreshed');
  }, [submittedFilters, refetch, t]);

  const handleExport = useCallback(() => {
    toast.success(t('reports.exportStarted') || 'Export started');
  }, [t]);

  const handleViewDetails = useCallback((item: OrderTypeReportItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  // Get columns
  const columns = useMemo(
    () => getOrderTypeColumns(handleViewDetails),
    [handleViewDetails],
  );

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.orderTypeReports') || 'Order Type Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.orderType.description') ||
                'View order source statistics and analysis'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('common.export')}
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
              disabled={!submittedFilters}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              {t('common.refresh')}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <OrderTypeReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.orderType.orderTypeReport') ||
                  'Order Type Breakdown'}
              </CardTitle>
            </div>
            {orderTypeData.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {orderTypeData.length} order sources
                {totalCount > orderTypeData.length && ` of ${totalCount}`}
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {!submittedFilters ? (
              <div className="text-center py-12 text-muted-foreground">
                Apply filters to view order type data
              </div>
            ) : isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading order type data...
              </div>
            ) : orderTypeData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.orderType.noData') ||
                  'No order type data found for the selected date range'}
              </div>
            ) : (
              <TanStackTable
                data={orderTypeData}
                columns={columns}
                totalCount={totalCount}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('reports.orderType.searchPlaceholder') ||
                  'Search order types...'
                }
                onSearchChange={setSearchTerm}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                manualPagination={true}
                manualSorting={true}
                manualFiltering={true}
                showSearch={true}
                showPagination={true}
                showPageSizeSelector={true}
                emptyMessage={t('reports.orderType.noData')}
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Details Modal */}
      <OrderTypeDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Layout>
  );
}
