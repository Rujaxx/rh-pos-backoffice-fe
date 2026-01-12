'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useOrderTypeReports } from '@/services/api/reports';
import { OrderTypeReportItem } from '@/types/report.type';
import {
  useOrderTypeColumns,
  getSortFieldForQuery,
  getSortOrderForQuery,
  calculateStatusTotals,
} from '@/components/reports/order-type-reports/order-type-table-column';

export default function OrderTypeReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  // State for the filters that are actually applied
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

  // Build query params
  const queryParams: ReportQueryParams = useMemo(() => {
    const activeFilters = submittedFilters || {};
    return {
      ...activeFilters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      term: searchTerm || undefined,
      sortBy: getSortFieldForQuery(sorting),
      sortOrder: getSortOrderForQuery(sorting) || 'desc',
    };
  }, [submittedFilters, pagination, searchTerm, sorting]);

  // Fetch reports
  const {
    data: reportsData,
    isLoading,
    refetch,
  } = useOrderTypeReports(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  const orderTypeData: OrderTypeReportItem[] = reportsData?.data ?? [];
  const totalCount = reportsData?.meta?.total ?? orderTypeData.length;

  // CALCULATE TOTALS FROM DATA
  const statusTotals = useMemo(
    () => calculateStatusTotals(orderTypeData),
    [orderTypeData],
  );

  // Get columns using hook WITH CALCULATED TOTALS
  const orderTypeColumns = useOrderTypeColumns(statusTotals);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  }, [pagination.pageSize]);

  // Apply filters handler
  const handleApplyFilters = useCallback(() => {
    if (JSON.stringify(filters) === JSON.stringify(submittedFilters)) {
      refetch();
    } else {
      setSubmittedFilters(filters);
    }
  }, [filters, submittedFilters, refetch]);

  const handleRefresh = useCallback(() => {
    if (!submittedFilters) {
      toast.info('Please apply filters first');
      return;
    }

    refetch();
    toast.success(t('common.refreshSuccess') || 'Data refreshed');
  }, [submittedFilters, refetch, t]);

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
              onClick={handleRefresh}
              className="flex items-center gap-2"
              disabled={!submittedFilters}
            >
              <RefreshCw className="h-4 w-4" />
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
        />

        {/* Main Order Type Report Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.orderType.orderTypeReport')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading...
              </div>
            ) : orderTypeData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.orderType.noData') ||
                  'No order type data found for the selected date range'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <TanStackTable
                  data={orderTypeData}
                  columns={orderTypeColumns}
                  totalCount={totalCount}
                  isLoading={isLoading}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
