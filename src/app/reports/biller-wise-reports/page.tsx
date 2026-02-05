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
  XCircle,
  CheckCircle,
  Package,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { BillerWiseReportFilters } from '@/components/reports/report-filters/biller-wise-report-filter';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import { useBillerWiseReports } from '@/services/api/reports/reports.queries';

// Helper functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export default function BillerWiseReportPage() {
  const { t } = useTranslation();

  // Initialize filters
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

  // Store ref to download component's refetch function
  const downloadRefetchRef = useRef<(() => void) | null>(null);

  // API Call
  // We trigger the query only when submittedFilters is set.
  const {
    data: reportResponse,
    isLoading,
    refetch,
    isRefetching,
  } = useBillerWiseReports(submittedFilters || undefined, {
    enabled: !!submittedFilters,
  });

  const reportData = reportResponse?.data;
  const isQueryLoading = isLoading || isRefetching;

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    setFilters({
      from: lastMonth.toISOString().split('T')[0],
      to: today.toISOString().split('T')[0],
    });
    setSubmittedFilters(null);
  }, []);

  const handleApplyFilters = useCallback(
    (isDownload?: boolean) => {
      const queryParams = {
        ...filters,
        ...(isDownload && { isDownload: true }),
      };

      // If it's a download request, we force a refetch or update state to trigger query with isDownload=true
      if (isDownload) {
        // If we just setSubmittedFilters, it will trigger the useQuery.
        // But if we are ALREADY showing the same filters, React might skip update if state is identical.
        // However, 'isDownload' makes it different.
      }

      setSubmittedFilters(queryParams);

      if (isDownload) {
        toast.info(t('reports.downloadInitiated') || 'Download initiated...');
      } else {
        toast.info(t('reports.generating') || 'Generating report...');
      }
    },
    [filters, t],
  );

  // Trigger download component refresh when report data loads (if it was a download)
  useEffect(() => {
    // If the query finished and we have results, refresh the download list.
    // Ideally we check if `submittedFilters.isDownload` was true, but refreshing on any data load is also safe.
    if (reportResponse && downloadRefetchRef.current) {
      downloadRefetchRef.current();
    }
  }, [reportResponse]);

  const handleRefresh = useCallback(() => {
    if (!submittedFilters) {
      toast.info(
        t('reports.billerWise.applyFiltersFirst') ||
          'Please apply filters first',
      );
      return;
    }

    refetch();
    toast.success(t('common.dataRefreshed') || 'Data refreshed');
  }, [submittedFilters, refetch, t]);

  // Calculate derived values for UI
  const calculatedValues = useMemo(() => {
    if (!reportData) return null;

    const netSales = reportData.totalRevenue;
    const otherBills =
      reportData.totalBills -
      (reportData.fulfilledBills + reportData.cancelledBills);

    const paymentBreakdown = [...reportData.paymentMethods]
      .map((pm) => ({
        method: pm.paymentMethod,
        amount: pm.totalAmount,
      }))
      .sort((a, b) => b.amount - a.amount);

    const totalPaymentAmount = paymentBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    return {
      netSales,
      otherBills,
      totalPaymentAmount,
      paymentBreakdown,
    };
  }, [reportData]);

  const hasSpecificBiller = useMemo(() => {
    return submittedFilters?.userId && submittedFilters.userId !== 'all';
  }, [submittedFilters]);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t('navigation.billerWiseReports') || 'Biller Wise Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.billerWise.description') ||
                'View sales and order performance summary for selected biller(s)'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2 border-input bg-background hover:bg-accent hover:text-accent-foreground"
              disabled={!submittedFilters || isQueryLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isQueryLoading ? 'animate-spin' : ''}`}
              />
              {t('common.refresh') || 'Refresh'}
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
          <BillerWiseReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Download Report Options */}
        <DownloadReportOptions
          restaurantId={filters.restaurantIds?.[0]}
          onRefetchReady={(refetchFn) => {
            downloadRefetchRef.current = refetchFn;
          }}
        />

        {/* Main Content */}
        {!submittedFilters ? (
          <Card className="bg-background border-border">
            <CardContent className="p-12">
              <div className="text-center">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {t('reports.billerWise.selectBillerPrompt') ||
                    'Select biller and apply filters to view report'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t('reports.billerWise.dataWillShow') ||
                    'Data will show summary for selected biller'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : isQueryLoading ? (
          <Card className="bg-background border-border">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-4">
                  {t('reports.billerWise.loadingReport') ||
                    'Loading biller report...'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : !reportData ? (
          <Card className="bg-background border-border">
            <CardContent className="p-12">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {t('reports.billerWise.noDataFound') ||
                    'No data found for selected filters'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Key Metrics Cards - Compact version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Bills Card */}
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <ShoppingBag className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('reports.billerWise.metrics.totalBills') ||
                          'Total Bills'}
                      </div>
                      <div className="text-2xl font-bold text-foreground">
                        {formatNumber(reportData.totalBills)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Card */}
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('reports.billerWise.metrics.netSales') ||
                          'Net Sales'}
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.totalRevenue)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fulfilled Bills Card - Compact with inline items */}
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('reports.billerWise.metrics.fulfilledBills') ||
                          'Fulfilled Bills'}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold text-emerald-600">
                          {formatNumber(reportData.fulfilledBills)}
                        </div>
                        {/* Compact inline display */}
                        {hasSpecificBiller && (
                          <div className="text-sm text-amber-600 font-medium">
                            (+{reportData.complementaryItems}{' '}
                            {t('reports.billerWise.complementaryShort') ||
                              'comp'}
                            )
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cancelled Bills Card - Compact with inline items */}
              <Card className="border-border hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-muted-foreground">
                        {t('reports.billerWise.metrics.cancelledBills') ||
                          'Cancelled Bills'}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <div className="text-2xl font-bold text-red-600">
                          {formatNumber(reportData.cancelledBills)}
                        </div>
                        {/* Compact inline display */}
                        {hasSpecificBiller && (
                          <div className="text-sm text-red-600 font-medium">
                            (+{reportData.cancelledItems}{' '}
                            {t('reports.billerWise.itemsShort') || 'items'})
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Item Breakdown Section - Clear naming for "All Billers" */}
            {!hasSpecificBiller && reportData && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Free Items Given Card */}
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 ">
                      <div className="p-2 rounded-lg bg-amber-500/10">
                        <CheckCircle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {t('reports.billerWise.metrics.complementaryItems') ||
                            'Complementary Items Given'}
                        </div>
                        <div className="text-2xl font-bold text-amber-600">
                          {reportData.complementaryItems}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {t('reports.billerWise.acrossAllBillers') ||
                        'Across all billers'}
                    </div>
                  </CardContent>
                </Card>

                {/* Items in Cancelled Bills Card */}
                <Card className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-red-500/10">
                        <XCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">
                          {t(
                            'reports.billerWise.metrics.itemsInCancelledBills',
                          ) || 'Items in Cancelled Bills'}
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          {reportData.cancelledItems}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {t('reports.billerWise.fromBills', {
                        count: reportData.cancelledBills,
                      }) || `From ${reportData.cancelledBills} cancelled bills`}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment Methods Section */}
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {t('reports.billerWise.paymentMethods.title') ||
                    'Payment Methods'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {calculatedValues?.paymentBreakdown.map((payment) => (
                  <div
                    key={payment.method}
                    className="flex items-center justify-between p-4 bg-card rounded border border-border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="font-medium text-foreground">
                        {payment.method}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-foreground">
                        {formatCurrency(payment.amount)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Collection */}
                {calculatedValues && (
                  <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-semibold text-primary">
                            {t('reports.billerWise.totalCollection') ||
                              'Total Collection'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t('reports.billerWise.billsCount', {
                              count: formatNumber(reportData.totalBills),
                            }) ||
                              `${formatNumber(reportData.totalBills)} bills`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">
                          {formatCurrency(calculatedValues.totalPaymentAmount)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}

//reports.discount.columns.orderType, reports.discount.columns.billStatus, reports.discount.columns.totalDiscount, reports.discount.columns.billCount
