'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { REPORT_TYPE_BUTTONS } from '@/components/reports/discount-reports/constants';
import { DiscountDataTable } from '@/components/reports/discount-reports/discount-table';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import {
  useDiscountReport,
  useGenerateItemWiseDiscountReport,
  useGenerateDiscountReport,
} from '@/services/api/reports/discount-report.query';

export default function DiscountReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
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

  const queryParams = useMemo(() => {
    const activeFilters = submittedFilters || {};
    return {
      ...activeFilters,
    };
  }, [submittedFilters]);

  // Hook for Simple Discount Report Table Data
  const {
    data: discountReportData,
    isLoading: isTableLoading,
    refetch: refetchTable,
  } = useDiscountReport(queryParams, {
    enabled: !!submittedFilters && !!queryParams.from && !!queryParams.to,
  });

  // Mutation for Item Wise Report Generation
  const generateItemWiseMutation = useGenerateItemWiseDiscountReport();
  const generateDiscountReportMutation = useGenerateDiscountReport();

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
  }, []);

  const handleApplyFilters = useCallback(() => {
    if (JSON.stringify(filters) === JSON.stringify(submittedFilters)) {
      refetchTable();
    } else {
      setSubmittedFilters(filters);
    }
  }, [filters, submittedFilters, refetchTable]);

  // Validation
  const validateFilters = useCallback((filters: ReportQueryParams) => {
    return !!(
      filters.from &&
      filters.to &&
      filters.brandIds?.length &&
      filters.restaurantIds?.length
    );
  }, []);

  const isValid = validateFilters(filters);

  // Handlers
  const handleGenerateReport = useCallback(
    (reportType: string) => {
      if (!isValid) {
        toast.error(
          t('reports.pleaseApplyFilters') || 'Please select required filters',
        );
        return;
      }

      const mutation =
        reportType === 'DISCOUNT_SUMMARY'
          ? generateDiscountReportMutation
          : generateItemWiseMutation;

      if (
        reportType === 'DISCOUNT_SUMMARY' ||
        reportType === 'DISCOUNT_ITEM_WISE'
      ) {
        const btn = REPORT_TYPE_BUTTONS.find((b) => b.type === reportType);
        const name = btn ? t(btn.translationKey) : 'Report';
        toast.info(
          t('reports.discount.generatingReport', { reportName: name }),
        );

        mutation.mutate(filters, {
          onSuccess: () => {
            toast.success(t('reports.discount.generationSuccess'));
            // Refresh download options
            if (downloadRefetchRef.current) {
              downloadRefetchRef.current();
            }
          },
          onError: () => {
            toast.error(t('reports.discount.generationFailed'));
          },
        });

        // Also refresh table if it is summary (optional but good UX)
        if (reportType === 'DISCOUNT_SUMMARY') {
          handleApplyFilters();
        }
        return;
      }
    },
    [
      isValid,
      filters,
      handleApplyFilters,
      generateItemWiseMutation,
      generateDiscountReportMutation,
      t,
    ],
  );

  const handleRefresh = useCallback(() => {
    if (submittedFilters) {
      refetchTable();
      // Also refresh downloads if needed
      if (downloadRefetchRef.current) {
        downloadRefetchRef.current();
      }
      toast.success(t('common.refreshSuccess'));
    } else {
      toast.info(t('reports.pleaseApplyFilters'));
    }
  }, [submittedFilters, refetchTable, t]);

  const tableData = discountReportData?.data?.report || [];

  const handleDownloadRefetchReady = useCallback((refetchFn: () => void) => {
    downloadRefetchRef.current = refetchFn;
  }, []);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.discountReports') || 'Discount Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.discount.description') ||
                'View and analyze discount reports'}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
            disabled={!submittedFilters || isTableLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isTableLoading ? 'animate-spin' : ''}`}
            />
            {t('common.refresh')}
          </Button>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
          validateFilters={validateFilters}
          showDownloadButton={false}
        />

        {/* Report Type Buttons (Actions) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.discount.selectReportType') || 'Select Report Type'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {REPORT_TYPE_BUTTONS.map((reportBtn) => {
                const Icon = reportBtn.icon;
                const label = t(reportBtn.translationKey);
                const isGenerating =
                  reportBtn.type === 'DISCOUNT_ITEM_WISE' &&
                  generateItemWiseMutation.isPending;

                return (
                  <Button
                    key={reportBtn.type}
                    variant="outline"
                    className="h-auto py-4 px-4 flex items-center gap-3 justify-start"
                    onClick={() => handleGenerateReport(reportBtn.type)}
                    disabled={!isValid || isGenerating}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    {isGenerating && (
                      <RefreshCw className="h-4 w-4 animate-spin ml-auto" />
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Download Report Options */}
        <DownloadReportOptions
          restaurantId={filters.restaurantIds?.[0]}
          onRefetchReady={handleDownloadRefetchReady}
        />

        {/* Discount Data Table */}
        <DiscountDataTable
          data={tableData}
          isLoading={isTableLoading}
          searchPlaceholder="reports.discount.searchPlaceholder"
          emptyMessage="reports.discount.noData"
        />
      </div>
    </Layout>
  );
}
