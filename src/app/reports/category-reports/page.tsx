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
import { RefreshCw, Package, TrendingUp, DollarSign } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { CategoryReportItem } from '@/types/category-report.type';
import { useCategoryReport } from '@/services/api/reports/category-report.query';
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
const getCategoryReportColumns = () => [
  {
    accessorKey: 'categoryName',
    header: 'Category Name',
    cell: ({ row }: { row: { original: CategoryReportItem } }) => (
      <div className="font-medium">{row.original.categoryName}</div>
    ),
  },
  {
    accessorKey: 'parentCategoryName',
    header: 'Parent Category',
    cell: ({ row }: { row: { original: CategoryReportItem } }) => (
      <div className="text-muted-foreground">
        {row.original.parentCategoryName || '—'}
      </div>
    ),
  },
  {
    accessorKey: 'totalItemSold',
    header: () => <div className="text-right">Items Sold</div>,
    cell: ({ row }: { row: { original: CategoryReportItem } }) => (
      <div className="text-right font-medium">
        {formatNumber(row.original.totalItemSold)}
      </div>
    ),
  },
  {
    accessorKey: 'totalRevenue',
    header: () => <div className="text-right">Total Revenue</div>,
    cell: ({ row }: { row: { original: CategoryReportItem } }) => (
      <div className="text-right font-medium text-green-600">
        {formatCurrency(row.original.totalRevenue)}
      </div>
    ),
  },
  {
    accessorKey: 'averagePrice',
    header: () => <div className="text-right">Average Price</div>,
    cell: ({ row }: { row: { original: CategoryReportItem } }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.original.averagePrice)}
      </div>
    ),
  },
];

// Main Component
export default function CategoryReportPage() {
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
  } = useCategoryReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Use real API data
  const categoryReportData = reportsData?.data ?? [];
  const totalCount = categoryReportData.length;

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!categoryReportData.length) {
      return {
        totalCategories: 0,
        totalItemsSold: 0,
        totalRevenue: 0,
      };
    }

    return {
      totalCategories: categoryReportData.length,
      totalItemsSold: categoryReportData.reduce(
        (sum, item) => sum + item.totalItemSold,
        0,
      ),
      totalRevenue: categoryReportData.reduce(
        (sum, item) => sum + item.totalRevenue,
        0,
      ),
    };
  }, [categoryReportData]);

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
  const columns = useMemo(() => getCategoryReportColumns(), []);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.categoryReports') || 'Category Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.category.description') ||
                'View category-wise sales statistics and analysis'}
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
        {submittedFilters && categoryReportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.category.totalCategories') ||
                      'Total Categories'}
                  </CardTitle>
                  <Package className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(summaryStats.totalCategories)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.category.totalItemsSold') || 'Total Items Sold'}
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
                    {t('reports.category.totalRevenue') || 'Total Revenue'}
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
          </div>
        )}

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.category.categoryReport') ||
                  'Category-wise Sales Report'}
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
            ) : categoryReportData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.noDataFound') || 'No data found'}
              </div>
            ) : (
              <TanStackTable
                data={categoryReportData}
                columns={columns}
                totalCount={totalCount}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('reports.category.searchPlaceholder') ||
                  'Search categories...'
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
