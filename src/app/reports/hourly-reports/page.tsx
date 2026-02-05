'use client';

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { Clock, CalendarDays } from 'lucide-react';
import { ReportQueryParams, HourlyReportType } from '@/types/report.type';
import { toast } from 'sonner';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import {
  useGenerateHourlyReport,
  useGenerateMonthlyHourlyReport,
} from '@/services/api/reports/hourly-report.query';

// Report Type Buttons
const REPORT_TYPE_BUTTONS = [
  {
    type: HourlyReportType.HOURLY_REPORT,
    translationKey: 'reports.hourly.hourlyReport',
    label: 'Hourly Report',
    icon: Clock,
  },
  {
    type: HourlyReportType.MONTHLY_HOURLY_REPORT,
    translationKey: 'reports.hourly.monthlyHourlyReport',
    label: 'Monthly Hourly Report',
    icon: CalendarDays,
  },
] as const;

export default function HourlyReportPage() {
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

  // Store ref to download component's refetch function
  const downloadRefetchRef = useRef<(() => void) | null>(null);

  // Setup mutation hooks for both report types
  const hourlyReportMutation = useGenerateHourlyReport({
    onSuccess: () => {
      toast.success(t('reports.hourly.reportGenerated'));
      // Trigger download component refresh
      if (downloadRefetchRef.current) {
        downloadRefetchRef.current();
      }
    },
    onError: (error) => {
      console.error('Hourly report generation failed:', error);
      toast.error(t('reports.hourly.generationFailed'));
    },
  });

  const monthlyReportMutation = useGenerateMonthlyHourlyReport({
    onSuccess: () => {
      toast.success(t('reports.hourly.reportGenerated'));
      // Trigger download component refresh
      if (downloadRefetchRef.current) {
        downloadRefetchRef.current();
      }
    },
    onError: (error) => {
      console.error('Monthly hourly report generation failed:', error);
      toast.error(t('reports.hourly.generationFailed'));
    },
  });

  // Build query params
  const queryParams = useMemo(() => {
    return {
      from: filters.from,
      to: filters.to,
      brandId: Array.isArray(filters.brandIds)
        ? filters.brandIds[0]
        : undefined,
      restaurantId: Array.isArray(filters.restaurantIds)
        ? filters.restaurantIds[0]
        : undefined,
      isDownload: true, // Always set to true for report generation
    };
  }, [filters]);

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
  }, []);

  // Custom validation: require from, to, brandIds, and restaurantIds
  const validateFilters = useCallback((filters: ReportQueryParams) => {
    return !!(
      filters.from &&
      filters.to &&
      filters.brandIds?.length &&
      filters.restaurantIds?.length
    );
  }, []);

  const isValid = validateFilters(filters);

  // Button click handlers
  const handleGenerateHourlyReport = useCallback(() => {
    if (!isValid) return;
    toast.info(t('reports.hourly.generatingHourlyReport'));
    hourlyReportMutation.mutate(queryParams);
  }, [isValid, queryParams, hourlyReportMutation, t]);

  const handleGenerateMonthlyReport = useCallback(() => {
    if (!isValid) return;
    toast.info(t('reports.hourly.generatingMonthlyReport'));
    monthlyReportMutation.mutate(queryParams);
  }, [isValid, queryParams, monthlyReportMutation, t]);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.hourlyReports')}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.hourly.description')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          validateFilters={validateFilters}
          showDownloadButton={false}
        />

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.hourly.selectReportType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REPORT_TYPE_BUTTONS.map((reportBtn) => {
                const Icon = reportBtn.icon;
                const label = t(reportBtn.translationKey) || reportBtn.label;
                const isLoading =
                  (reportBtn.type === HourlyReportType.HOURLY_REPORT &&
                    hourlyReportMutation.isPending) ||
                  (reportBtn.type === HourlyReportType.MONTHLY_HOURLY_REPORT &&
                    monthlyReportMutation.isPending);
                const handleClick =
                  reportBtn.type === HourlyReportType.HOURLY_REPORT
                    ? handleGenerateHourlyReport
                    : handleGenerateMonthlyReport;

                return (
                  <Button
                    key={reportBtn.type}
                    variant="outline"
                    className="h-auto py-4 px-4 flex items-center gap-3"
                    onClick={handleClick}
                    disabled={!isValid || isLoading}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium text-left flex-1">
                      {label}
                    </span>
                    {isLoading && <Clock className="h-4 w-4 animate-spin" />}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Download Report Options */}
        <DownloadReportOptions
          restaurantId={filters.restaurantIds?.[0]}
          onRefetchReady={(refetchFn) => {
            downloadRefetchRef.current = refetchFn;
          }}
        />
      </div>
    </Layout>
  );
}
