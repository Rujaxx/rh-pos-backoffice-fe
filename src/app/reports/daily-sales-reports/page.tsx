'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { Download, Eye, RefreshCw } from 'lucide-react';
import {
  ReportQueryParams,
  GeneratedReport,
  DailyReportType,
  ReportGenerationStatus,
} from '@/types/report.type';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { toast } from 'sonner';
import { REPORT_TYPE_BUTTONS } from '@/components/reports/daily-sales-reports/constants';
import { DailySalesReportFilters } from '@/components/reports/report-filters/daily-sales-filter';
import { useGeneratedReports } from '@/services/api/reports/generated-reports';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';

export default function DailySalesReportPage() {
  const { t } = useTranslation();

  // Initialize filters
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
    useState<DailyReportType | null>(null);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Local state to store generated reports (in addition to API data)
  const [localGeneratedReports, setLocalGeneratedReports] = useState<
    GeneratedReport[]
  >([]);

  // Fetch all generated reports from the system
  const {
    data: generatedReports = [],
    isLoading,
    refetch,
  } = useGeneratedReports();

  // Combine API data with locally generated reports
  const allGeneratedReports = [...generatedReports, ...localGeneratedReports];

  // Filter handlers - SAME PATTERN
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null); // Clear submitted filters
  }, []);

  // Apply filters handler
  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
  }, [filters]);

  const handleGenerateReport = useCallback(
    async (reportType: DailyReportType) => {
      setSelectedReportType(reportType);
      setIsGenerating(true);

      const reportTranslationKey =
        REPORT_TYPE_BUTTONS.find((btn) => btn.type === reportType)
          ?.translationKey || '';
      const reportLabel = t(reportTranslationKey) || reportType;

      toast.success(
        t('reports.dailySales.generatingReport', { reportName: reportLabel }),
        {
          description: t('reports.dailySales.generatingDescription'),
        },
      );

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Create a new report object
        const newReport: GeneratedReport = {
          _id: `daily_${Date.now()}`,
          generateDate: new Date().toISOString(),
          generatedBy: 'current-user',
          generatedByName: 'Current User',
          reportType,
          generationStatus: ReportGenerationStatus.COMPLETED,
          filters: submittedFilters || {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          downloadUrl: `https://example.com/reports/daily-${Date.now()}.csv`,
          // Add report-specific data
        };

        // Add the new report to local state
        setLocalGeneratedReports((prev) => [newReport, ...prev]);

        toast.success(t('reports.dailySales.generationSuccess'), {
          description: `${reportLabel} report has been generated and added to the table.`,
        });

        // Also refetch from API if needed
        refetch();
      } catch (error) {
        toast.error(t('reports.dailySales.generationFailed'), {
          description: t('common.errors.tryAgainLater'),
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [t, refetch, submittedFilters],
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
        toast.error(t('reports.dailySales.downloadUrlNotAvailable'));
        return;
      }
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `report-${report._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t('reports.dailySales.downloadStarted'));
    },
    [t],
  );

  const handleRefresh = useCallback(() => {
    refetch(); // Refresh from API
    toast.success(t('common.refreshSuccess') || 'Reports refreshed');
  }, [refetch, t]);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.dailySalesReport')}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.dailySales.description')}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
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
        >
          <DailySalesReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.dailySales.selectReportType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          title="reports.dailySales.generatedReports"
          data={allGeneratedReports}
          isLoading={isLoading}
          onShowDetails={handleShowDetails}
          onDownload={handleDownloadReport}
          defaultCollapsed={false}
          searchPlaceholder="reports.dailySales.searchPlaceholder"
          emptyMessage="reports.dailySales.noGeneratedReports"
        />
      </div>

      {/* Report Details Modal */}
      <ReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </Layout>
  );
}
