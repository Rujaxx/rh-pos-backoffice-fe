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
  DollarSign,
  CreditCard,
  Wallet,
  Banknote,
  Smartphone,
  Globe,
  MoreHorizontal,
} from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { usePaymentReport } from '@/services/api/reports/payment-report.query';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  PaymentMethodsEnum,
  PaymentReportItem,
  PaymentReportResponse,
} from '@/types/payment-report.type';

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

// Payment method icons
const PAYMENT_METHOD_ICONS: Record<
  PaymentMethodsEnum,
  React.ComponentType<{ className?: string }>
> = {
  [PaymentMethodsEnum.CASH]: Banknote,
  [PaymentMethodsEnum.CARD]: CreditCard,
  [PaymentMethodsEnum.UPI]: Smartphone,
  [PaymentMethodsEnum.PHONEPE]: Smartphone,
  [PaymentMethodsEnum.WALLET]: Wallet,
  [PaymentMethodsEnum.NET_BANKING]: Globe,
  [PaymentMethodsEnum.OTHER]: MoreHorizontal,
};

// Payment method labels
const PAYMENT_METHOD_LABELS: Record<PaymentMethodsEnum, string> = {
  [PaymentMethodsEnum.CASH]: 'Cash',
  [PaymentMethodsEnum.CARD]: 'Card',
  [PaymentMethodsEnum.UPI]: 'UPI',
  [PaymentMethodsEnum.PHONEPE]: 'PhonePe',
  [PaymentMethodsEnum.WALLET]: 'Wallet',
  [PaymentMethodsEnum.NET_BANKING]: 'Net Banking',
  [PaymentMethodsEnum.OTHER]: 'Other',
};

// Define table data type
interface PaymentMethodTableData {
  id: string;
  paymentMethod: PaymentMethodsEnum;
  amount: number;
  orderCount: number;
  percentage: number;
  averageValue: number;
}

// Main Component
export default function PaymentReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    const fromDate = new Date(today);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999);

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
  } = usePaymentReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Use real API data
  const paymentReportResponse = useMemo<PaymentReportResponse | null>(() => {
    if (!reportsData?.data) return null;

    const responseData = reportsData.data;

    // Check if it has the dailyReports property
    if (
      responseData &&
      typeof responseData === 'object' &&
      'dailyReports' in responseData
    ) {
      return responseData as PaymentReportResponse;
    }

    return null;
  }, [reportsData]);

  const paymentReportData = paymentReportResponse?.dailyReports || [];

  const totalCount = paymentReportData.length;

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!paymentReportData.length) {
      return {
        totalCollection: 0,
        totalOrders: 0,
        cashAmount: 0,
        cardAmount: 0,
        upiAmount: 0,
        walletAmount: 0,
        netBankingAmount: 0,
        otherAmount: 0,
        averageOrderValue: 0,
      };
    }

    // Aggregate payment methods from all daily reports
    const paymentMethodsMap = new Map<
      PaymentMethodsEnum,
      {
        amount: number;
        orderCount: number;
      }
    >();

    let totalCollection = 0;
    let totalOrders = 0;

    paymentReportData.forEach((item: PaymentReportItem) => {
      item.paymentMethods.forEach((pm) => {
        const method = pm.method as PaymentMethodsEnum;
        const current = paymentMethodsMap.get(method) || {
          amount: 0,
          orderCount: 0,
        };

        paymentMethodsMap.set(method, {
          amount: current.amount + pm.amount,
          orderCount: current.orderCount + 1,
        });

        totalCollection += pm.amount;
        totalOrders++;
      });
    });

    return {
      totalCollection,
      totalOrders,
      cashAmount: paymentMethodsMap.get(PaymentMethodsEnum.CASH)?.amount || 0,
      cardAmount: paymentMethodsMap.get(PaymentMethodsEnum.CARD)?.amount || 0,
      upiAmount: paymentMethodsMap.get(PaymentMethodsEnum.UPI)?.amount || 0,
      walletAmount:
        paymentMethodsMap.get(PaymentMethodsEnum.WALLET)?.amount || 0,
      netBankingAmount:
        paymentMethodsMap.get(PaymentMethodsEnum.NET_BANKING)?.amount || 0,
      otherAmount: paymentMethodsMap.get(PaymentMethodsEnum.OTHER)?.amount || 0,
      averageOrderValue: totalOrders > 0 ? totalCollection / totalOrders : 0,
    };
  }, [paymentReportData]);

  // Process data for table display
  const processedTableData = useMemo<PaymentMethodTableData[]>(() => {
    if (!paymentReportData.length) return [];

    const paymentMethodsMap = new Map<
      PaymentMethodsEnum,
      {
        amount: number;
        orderCount: number;
      }
    >();

    let totalAmount = 0;

    // Aggregate data
    paymentReportData.forEach((item: PaymentReportItem) => {
      item.paymentMethods.forEach((pm) => {
        const method = pm.method as PaymentMethodsEnum;
        const current = paymentMethodsMap.get(method) || {
          amount: 0,
          orderCount: 0,
        };

        paymentMethodsMap.set(method, {
          amount: current.amount + pm.amount,
          orderCount: current.orderCount + 1,
        });

        totalAmount += pm.amount;
      });
    });

    // Convert to array for table
    return Array.from(paymentMethodsMap.entries()).map(
      ([method, data], index) => ({
        id: String(index + 1),
        paymentMethod: method,
        amount: data.amount,
        orderCount: data.orderCount,
        percentage: totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0,
        averageValue: data.orderCount > 0 ? data.amount / data.orderCount : 0,
      }),
    );
  }, [paymentReportData]);

  // Filter data based on search term
  const filteredTableData = useMemo(() => {
    if (!searchTerm) return processedTableData;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return processedTableData.filter((item) => {
      const paymentMethod =
        PAYMENT_METHOD_LABELS[item.paymentMethod] || item.paymentMethod;
      return paymentMethod.toLowerCase().includes(lowerSearchTerm);
    });
  }, [processedTableData, searchTerm]);

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
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(today);
    toDate.setHours(23, 59, 59, 999);

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
    return !!(filters.from && filters.to && filters.restaurantIds?.length);
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

  // Define columns for payment method table
  const columns: ColumnDef<PaymentMethodTableData>[] = [
    {
      accessorKey: 'paymentMethod',
      header: t('reports.payment.columns.paymentMethod') || 'Payment Method',
      cell: ({ row }) => {
        const IconComponent = PAYMENT_METHOD_ICONS[row.original.paymentMethod];
        const label = PAYMENT_METHOD_LABELS[row.original.paymentMethod];

        return (
          <div className="flex items-center gap-2">
            {IconComponent && (
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium">{label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: t('reports.payment.columns.amount') || 'Amount',
      cell: ({ row }) => (
        <div className="font-medium text-green-600">
          {formatCurrency(row.original.amount)}
        </div>
      ),
    },
    {
      accessorKey: 'orderCount',
      header: t('reports.payment.columns.orderCount') || 'Orders',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatNumber(row.original.orderCount)}
        </div>
      ),
    },
    {
      accessorKey: 'percentage',
      header: t('reports.payment.columns.percentage') || 'Percentage',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.percentage.toFixed(1)}%</div>
      ),
    },
    {
      accessorKey: 'averageValue',
      header: t('reports.payment.columns.averageValue') || 'Avg Value',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.averageValue)}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.paymentReports') || 'Payment Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.payment.description') ||
                'View and analyze payment reports'}
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
        {submittedFilters && processedTableData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.payment.totalCollection') || 'Total Collection'}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(summaryStats.totalCollection)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('reports.payment.totalOrders') || 'Total Orders'}:{' '}
                  {formatNumber(summaryStats.totalOrders)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.payment.cash') || 'Cash'}
                  </CardTitle>
                  <Banknote className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryStats.cashAmount)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryStats.totalCollection > 0
                    ? `${((summaryStats.cashAmount / summaryStats.totalCollection) * 100).toFixed(1)}%`
                    : '0%'}{' '}
                  {t('reports.payment.ofTotal') || 'of total'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.payment.card') || 'Card'}
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryStats.cardAmount)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryStats.totalCollection > 0
                    ? `${((summaryStats.cardAmount / summaryStats.totalCollection) * 100).toFixed(1)}%`
                    : '0%'}{' '}
                  {t('reports.payment.ofTotal') || 'of total'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.payment.upi') || 'UPI'}
                  </CardTitle>
                  <Smartphone className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(summaryStats.upiAmount)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryStats.totalCollection > 0
                    ? `${((summaryStats.upiAmount / summaryStats.totalCollection) * 100).toFixed(1)}%`
                    : '0%'}{' '}
                  {t('reports.payment.ofTotal') || 'of total'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {t('reports.payment.other') || 'Other'}
                  </CardTitle>
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    summaryStats.otherAmount +
                      summaryStats.walletAmount +
                      summaryStats.netBankingAmount,
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {summaryStats.totalCollection > 0
                    ? `${(((summaryStats.otherAmount + summaryStats.walletAmount + summaryStats.netBankingAmount) / summaryStats.totalCollection) * 100).toFixed(1)}%`
                    : '0%'}{' '}
                  {t('reports.payment.ofTotal') || 'of total'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.payment.paymentDistribution') ||
                  'Payment Method Distribution'}
              </CardTitle>
              {submittedFilters &&
                !isLoading &&
                processedTableData.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('reports.noDataFound') ||
                      'No payment data found for selected filters'}
                  </p>
                )}
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            {!submittedFilters ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.applyFiltersMessage') ||
                  'Apply filters to view payment data'}
              </div>
            ) : isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  {t('common.loading') || 'Loading...'}
                </p>
              </div>
            ) : processedTableData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.noDataFound') || 'No data found'}
              </div>
            ) : (
              <TanStackTable
                data={filteredTableData}
                columns={columns}
                totalCount={totalCount}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('reports.payment.searchPaymentMethods') ||
                  'Search payment methods...'
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
