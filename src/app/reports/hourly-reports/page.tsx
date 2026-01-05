'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock, DownloadCloud, RefreshCw } from 'lucide-react';
import {
  ReportQueryParams,
  GeneratedReport,
  HourlyReportType,
  ReportGenerationStatus,
} from '@/types/report.type';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { toast } from 'sonner';
import { useGeneratedReports } from '@/services/api/reports/generated-reports';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';

// Report Type Buttons
const REPORT_TYPE_BUTTONS = [
  {
    type: HourlyReportType.DAY_WISE,
    translationKey: 'reports.hourly.reportTypes.dayWise',
    icon: Clock,
  },
  {
    type: HourlyReportType.DAY_WISE_SUMMARY,
    translationKey: 'reports.hourly.reportTypes.dayWiseSummary',
    icon: DownloadCloud,
  },
  {
    type: HourlyReportType.MONTH_WISE,
    translationKey: 'reports.hourly.reportTypes.monthWise',
    icon: CalendarDays,
  },
] as const;

export default function HourlyReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();

    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  // State for the filters that are actually applied (submitted)
  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);

  const [selectedReportType, setSelectedReportType] =
    useState<HourlyReportType | null>(null);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all generated reports from the system
  const {
    data: generatedReports = [],
    isLoading,
    refetch,
  } = useGeneratedReports();

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null);
  }, []);

  // Apply filters handler
  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
  }, [filters]);

  const handleGenerateReport = useCallback(
    async (hourlyType: HourlyReportType) => {
      setSelectedReportType(hourlyType);
      setIsGenerating(true);

      const reportBtn = REPORT_TYPE_BUTTONS.find(
        (btn) => btn.type === hourlyType,
      );
      const reportLabel = reportBtn ? t(reportBtn.translationKey) : hourlyType;

      toast.success(
        t('reports.hourly.generatingReport', { reportName: reportLabel }),
        {
          description: t('reports.hourly.generatingDescription'),
        },
      );

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast.success(t('reports.hourly.generationSuccess'));
        refetch(); // Refresh the reports list after generating
      } catch (error) {
        console.error('Report generation failed:', error);
        toast.error(t('reports.hourly.generationFailed'), {
          description: t('common.errors.tryAgainLater'),
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [t, refetch],
  );

  const handleShowDetails = useCallback((report: GeneratedReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedReport(null);
  }, []);

  const handleDownloadReport = useCallback(
    (report: GeneratedReport) => {
      if (!report.downloadUrl) {
        toast.error(t('reports.hourly.downloadUrlNotAvailable'));
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `report-${report._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t('reports.hourly.downloadStarted'));
    },
    [t],
  );

  const handleRefresh = useCallback(() => {
    toast.info(t('reports.hourly.refreshingReports'));
    // TODO: Add API refetch here
  }, [t]);

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

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {t('common.refresh')}
          </Button>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        />

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.hourly.selectReportType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_TYPE_BUTTONS.map((reportBtn) => {
                const Icon = reportBtn.icon;
                const isSelected = selectedReportType === reportBtn.type;
                const isCurrentlyGenerating =
                  isGenerating && selectedReportType === reportBtn.type;
                const label = t(reportBtn.translationKey);

                return (
                  <Button
                    key={reportBtn.type}
                    variant={isSelected ? 'default' : 'outline'}
                    className="h-auto py-4 px-4 flex flex-col items-start gap-2 relative"
                    onClick={() => handleGenerateReport(reportBtn.type)}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium text-left flex-1">
                        {label}
                      </span>
                      {isCurrentlyGenerating && (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                    {isCurrentlyGenerating && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 animate-pulse rounded-b-md" />
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Generated Reports Table using generic component */}
        <GeneratedReportsTable
          title="reports.hourly.generatedReports"
          data={generatedReports}
          isLoading={isLoading}
          onShowDetails={handleShowDetails}
          onDownload={handleDownloadReport}
          defaultCollapsed={false}
          searchPlaceholder="reports.hourly.searchPlaceholder"
          emptyMessage="reports.hourly.noGeneratedReports"
        />
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      )}
    </Layout>
  );
}
