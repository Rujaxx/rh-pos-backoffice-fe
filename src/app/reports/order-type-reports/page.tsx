'use client';

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw, ChevronRight, ChevronDown } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { OrderTypeGroupedItem } from '@/types/order-type-report.type';
import {
  useOrderTypeReport,
  useDownloadOrderTypeReport,
} from '@/services/api/reports/order-type-report.query';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Define columns for TanStackTable
const getOrderTypeColumns = () => [
  {
    id: 'expander',
    header: () => null,
    cell: ({ row }: { row: { getIsExpanded: () => boolean } }) => {
      return (
        <div className="flex items-center justify-center w-4 h-4">
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
    size: 40,
  },
  {
    accessorKey: 'orderType',
    header: 'Order Type',
    cell: ({ row }: { row: { original: OrderTypeGroupedItem } }) => (
      <div className="font-medium">{row.original.orderType}</div>
    ),
  },
  {
    accessorKey: 'totalBillCount',
    header: 'Total Bills',
    cell: ({ row }: { row: { original: OrderTypeGroupedItem } }) => (
      <div className="font-medium">
        {formatNumber(row.original.totalBillCount)}
      </div>
    ),
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Total Revenue',
    cell: ({ row }: { row: { original: OrderTypeGroupedItem } }) => (
      <div className="font-medium text-green-600">
        {formatCurrency(row.original.totalRevenue)}
      </div>
    ),
  },
];

// Main Component
export default function OrderTypeReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date and 12:00 PM time
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date().toISOString().split('T')[0];
    const fromDate = new Date(today);
    fromDate.setUTCHours(0, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setUTCHours(23, 59, 59, 999);

    return {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    };
  });

  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Store ref to download component's refetch function
  const downloadRefetchRef = useRef<(() => void) | null>(null);

  // Build query params for view (without isDownload)
  const queryParams = useMemo(() => {
    const activeFilters = submittedFilters || {};
    return {
      ...activeFilters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [submittedFilters, pagination]);

  // Fetch reports for view
  const {
    data: reportsData,
    isLoading,
    refetch,
  } = useOrderTypeReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Mutation for downloading report
  const downloadMutation = useDownloadOrderTypeReport();

  // Use real API data
  const orderTypeData = reportsData?.data ?? [];
  const totalCount = orderTypeData.length;

  // Trigger download component refresh when report data loads
  useEffect(() => {
    if (reportsData && downloadRefetchRef.current) {
      downloadRefetchRef.current();
    }
  }, [reportsData]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setHours(12, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(12, 0, 0, 0);

    setFilters({
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    });
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: 10 });
  }, []);

  // Custom validation
  const validateFilters = useCallback((filters: ReportQueryParams) => {
    return !!(
      filters.from &&
      filters.to &&
      filters.brandIds?.length &&
      filters.restaurantIds?.length
    );
  }, []);

  const handleApplyFilters = useCallback(
    (isDownload?: boolean) => {
      if (isDownload) {
        // Validate filters for download
        if (!validateFilters(filters)) {
          toast.error(
            t('reports.pleaseSelectRequiredFilters') ||
              'Please select brand, restaurant, and date range',
          );
          return;
        }

        // Handle download separately
        downloadMutation.mutate(filters, {
          onSuccess: () => {
            toast.success(
              t('reports.downloadInitiated') ||
                'Report generation started. Check Generated Reports section.',
            );
            // Refresh the download list after a short delay
            setTimeout(() => {
              if (downloadRefetchRef.current) {
                downloadRefetchRef.current();
              }
            }, 1000);
          },
          onError: (error: Error) => {
            console.error('Download error:', error);
            toast.error(
              t('reports.downloadFailed') ||
                'Failed to generate report. Please try again.',
            );
          },
        });
        return;
      }

      // For normal view
      const queryParams = {
        ...filters,
      };

      if (JSON.stringify(queryParams) === JSON.stringify(submittedFilters)) {
        refetch();
      } else {
        setSubmittedFilters(queryParams);
      }
    },
    [filters, submittedFilters, refetch, downloadMutation, t, validateFilters],
  );

  const handleRefresh = useCallback(() => {
    if (!submittedFilters) {
      toast.info(
        t('reports.pleaseApplyFilters') || 'Please apply filters first',
      );
      return;
    }
    refetch();
    toast.success(t('common.refreshSuccess') || 'Data refreshed');
  }, [submittedFilters, refetch, t]);

  // Get columns
  const columns = useMemo(() => getOrderTypeColumns(), []);

  // Render Sub Component for expansion
  const renderSubComponent = useCallback(({ row }: { row: unknown }) => {
    const typedRow = row as { original: OrderTypeGroupedItem };
    const breakdown = typedRow.original.breakdown || [];

    if (breakdown.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground text-sm">
          No breakdown details available
        </div>
      );
    }

    return (
      <div className="p-4 bg-muted/30 rounded-md">
        <h4 className="text-sm font-semibold mb-3">Status Breakdown</h4>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4 pb-2 border-b text-sm font-medium text-muted-foreground">
            <div>Status</div>
            <div>Bills</div>
            <div>Revenue</div>
          </div>
          {breakdown.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 text-sm">
              <div className="font-medium">{item.billStatus}</div>
              <div>{formatNumber(item.billCount)}</div>
              <div className="text-green-600">
                {formatCurrency(item.totalRevenue)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }, []);

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
                'View order type statistics and analysis'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
              disabled={!submittedFilters || isLoading}
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
          validateFilters={validateFilters}
        />

        {/* Download Report Options */}
        <DownloadReportOptions
          restaurantId={filters.restaurantIds?.[0]}
          onRefetchReady={(refetchFn) => {
            downloadRefetchRef.current = refetchFn;
          }}
        />

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.orderType.orderTypeReport') ||
                  'Order Type Statistics'}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            {!submittedFilters ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.applyFiltersMessage') ||
                  'Apply filters to view data'}
              </div>
            ) : isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('common.loading') || 'Loading...'}
              </div>
            ) : orderTypeData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.noDataFound') || 'No data found'}
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
                manualPagination={false}
                manualSorting={false}
                manualFiltering={false}
                showSearch={true}
                showPagination={true}
                showPageSizeSelector={true}
                emptyMessage={t('reports.noDataFound') || 'No data found'}
                enableMultiSort={false}
                renderSubComponent={renderSubComponent}
                getRowCanExpand={() => true}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
