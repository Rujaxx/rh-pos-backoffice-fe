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
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, CheckCircle, Printer } from 'lucide-react';
import { ReportQueryParams, PrintStatus } from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useBillPrintColumns } from '@/components/reports/bill-print-reports/bill-print-columns';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import { useBillPrintReport } from '@/services/api/reports/bill-print-report.query';

export default function BillPrintReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setHours(0, 0, 0, 0); // Default to start of day

    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999); // Default to end of day

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
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'date', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Store ref to download component's refetch function
  const downloadRefetchRef = useRef<(() => void) | null>(null);

  // Build query params
  const queryParams = useMemo(() => {
    const activeFilters = submittedFilters || {};
    return {
      ...activeFilters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      isDownload: activeFilters.isDownload,
    };
  }, [submittedFilters, pagination]);

  // Fetch reports
  const {
    data: reportsDataResponse,
    isLoading,
    refetch,
  } = useBillPrintReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Extract data and meta from PaginatedResponse
  const billPrintData = reportsDataResponse?.data || [];
  const meta = reportsDataResponse?.meta;
  const totalCount = meta?.total || billPrintData.length;

  // Calculate totals for the report
  const reportTotals = useMemo(() => {
    if (!billPrintData.length) {
      return {
        totalOrders: 0,
        fulfilledOrders: 0,
        totalAmount: 0,
        totalPrints: 0,
      };
    }

    const fulfilledData = billPrintData.filter(
      (item) => item.billStatus === PrintStatus.FULFILLED,
    );

    return {
      totalOrders: billPrintData.length,
      fulfilledOrders: fulfilledData.length,
      totalAmount: fulfilledData.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
      ),
      totalPrints: fulfilledData.reduce(
        (sum, item) => sum + item.printCount,
        0,
      ),
    };
  }, [billPrintData]);

  // Trigger download component refresh when report data loads
  useEffect(() => {
    if (reportsDataResponse && downloadRefetchRef.current) {
      downloadRefetchRef.current();
    }
  }, [reportsDataResponse]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const today = new Date();
    // Reset to defaults
    setFilters({
      from: today.toISOString(),
      to: today.toISOString(),
    });
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: 10 });
    setSorting([{ id: 'date', desc: true }]);
  }, []);

  const handleApplyFilters = useCallback(
    (isDownload?: boolean) => {
      // Reset pagination on new filter apply (only if not just changing page, but this handler is for Submit button)
      if (!isDownload) {
        setPagination((p) => ({ ...p, pageIndex: 0 }));
      }

      const queryParams = {
        ...filters,
        ...(isDownload && { isDownload: true }),
      };

      if (JSON.stringify(queryParams) === JSON.stringify(submittedFilters)) {
        refetch();
      } else {
        setSubmittedFilters(queryParams);
      }

      if (isDownload) {
        toast.info(t('reports.downloadInitiated') || 'Download initiated...');
      } else {
        toast.info(t('reports.generating') || 'Generating report...');
      }
    },
    [filters, submittedFilters, refetch, t],
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

  // Get columns using the hook
  const columns = useBillPrintColumns();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.billPrintReports') || 'Bill Print Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.billPrint.description') ||
                'View bill printing history and generate reports'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={!submittedFilters || isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              {t('common.refresh') || 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Report Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        />

        {/* Download Report Options */}
        <DownloadReportOptions
          restaurantId={filters.restaurantIds?.[0]}
          onRefetchReady={(refetchFn) => {
            downloadRefetchRef.current = refetchFn;
          }}
        />

        {/* Summary Cards */}
        {submittedFilters && billPrintData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.billPrint.summary.totalOrders') ||
                        'Total Orders'}
                    </p>
                    <p className="text-2xl font-bold">
                      {reportTotals.totalOrders}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.billPrint.summary.fulfilledOrders') ||
                        'Fulfilled Orders'}
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {reportTotals.fulfilledOrders}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.billPrint.summary.totalAmount') ||
                        'Total Amount'}
                    </p>
                    <p className="text-2xl font-bold">
                      {reportTotals.totalAmount.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary"></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.billPrint.summary.totalPrints') ||
                        'Total Prints'}
                    </p>
                    <p className="text-2xl font-bold">
                      {reportTotals.totalPrints}
                    </p>
                  </div>
                  <Printer className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.billPrint.table.title') || 'Bill Printing History'}
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
            ) : billPrintData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.billPrint.table.noData') ||
                  'No bill print data found'}
              </div>
            ) : (
              <TanStackTable
                data={billPrintData}
                columns={columns}
                totalCount={totalCount}
                isLoading={isLoading}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('reports.billPrint.table.searchPlaceholder') ||
                  'Search order number...'
                }
                onSearchChange={setSearchTerm}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                manualPagination={true} // Enable server-side pagination
                manualSorting={false}
                manualFiltering={false}
                showSearch={true}
                showPagination={true}
                showPageSizeSelector={true}
                emptyMessage={
                  t('reports.billPrint.table.noData') ||
                  'No bill print data found'
                }
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
