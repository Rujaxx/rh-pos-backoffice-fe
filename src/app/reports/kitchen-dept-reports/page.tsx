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
import {
  RefreshCw,
  ChefHat,
  TrendingUp,
  DollarSign,
  Receipt,
  Tag,
} from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { KitchenDepartmentReportItem } from '@/types/kitchen-department-report.type';
import { useKitchenDepartmentReport } from '@/services/api/reports/kitchen-department-report.query';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useKitchenDepartmentColumns } from '@/components/reports/kitchen-department-reports/kitchen-dept-columns';

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

// Main Component
export default function KitchenDepartmentReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date and 12:00 PM time
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setHours(12, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(12, 0, 0, 0);

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
    data: reportsData,
    isLoading,
    refetch,
  } = useKitchenDepartmentReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Use real API data
  const kitchenDepartmentReportData = reportsData?.data ?? [];
  const totalCount = kitchenDepartmentReportData.length;

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!kitchenDepartmentReportData.length) {
      return {
        totalDepartments: 0,
        totalItemsSold: 0,
        totalRevenue: 0,
        totalCharges: 0,
        totalDiscount: 0,
      };
    }

    return {
      totalDepartments: kitchenDepartmentReportData.length,
      totalItemsSold: kitchenDepartmentReportData.reduce(
        (sum, item) => sum + item.totalItemSold,
        0,
      ),
      totalRevenue: kitchenDepartmentReportData.reduce(
        (sum, item) => sum + item.totalRevenue,
        0,
      ),
      totalCharges: kitchenDepartmentReportData.reduce(
        (sum, item) => sum + item.itemLevelCharges,
        0,
      ),
      totalDiscount: kitchenDepartmentReportData.reduce(
        (sum, item) => sum + item.itemLevelDiscount,
        0,
      ),
    };
  }, [kitchenDepartmentReportData]);

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

  const handleApplyFilters = useCallback(
    (isDownload?: boolean) => {
      const queryParams = {
        ...filters,
        ...(isDownload && { isDownload: true }),
      };

      if (JSON.stringify(queryParams) === JSON.stringify(submittedFilters)) {
        refetch();
      } else {
        setSubmittedFilters(queryParams);
      }
    },
    [filters, submittedFilters, refetch],
  );

  // Custom validation
  const validateFilters = useCallback((filters: ReportQueryParams) => {
    return !!(
      filters.from &&
      filters.to &&
      filters.brandIds?.length &&
      filters.restaurantIds?.length
    );
  }, []);

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
  const columns = useKitchenDepartmentColumns();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.kitchenDepartmentReports') ||
                'Kitchen Department Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.kitchenDepartment.description') ||
                'View kitchen department-wise sales statistics and analysis'}
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

        {/* Summary Cards */}
        {submittedFilters && kitchenDepartmentReportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.kitchenDepartment.totalDepartments') ||
                      'Total Departments'}
                  </CardTitle>
                  <ChefHat className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(summaryStats.totalDepartments)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.kitchenDepartment.totalItemsSold') ||
                      'Total Items Sold'}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(summaryStats.totalItemsSold)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.kitchenDepartment.totalRevenue') ||
                      'Total Revenue'}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryStats.totalRevenue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.kitchenDepartment.totalCharges') ||
                      'Total Charges'}
                  </CardTitle>
                  <Receipt className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(summaryStats.totalCharges)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.kitchenDepartment.totalDiscount') ||
                      'Total Discount'}
                  </CardTitle>
                  <Tag className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(summaryStats.totalDiscount)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.kitchenDepartment.kitchenDepartmentReport') ||
                  'Kitchen Department Sales Report'}
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
            ) : kitchenDepartmentReportData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.noDataFound') || 'No data found'}
              </div>
            ) : (
              <TanStackTable
                data={kitchenDepartmentReportData}
                columns={columns}
                totalCount={totalCount}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('reports.kitchenDepartment.searchPlaceholder') ||
                  'Search departments...'
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
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
