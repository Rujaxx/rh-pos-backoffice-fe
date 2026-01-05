'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { MealTimeReportFilters } from '@/components/reports/report-filters/meal-time-filter';
import { Button } from '@/components/ui/button';
import { FileText, Eye, RefreshCw, Settings } from 'lucide-react';
import { ReportQueryParams, ReportGenerationStatus } from '@/types/report.type';
import { MealTimeReportDetailsModal } from '@/components/reports/meal-time-reports/meal-time-modal';
import { MealTimeConfigModal } from '@/components/reports/meal-time-reports/meal-time-report-config';
import {
  GeneratedMealTimeReport,
  MealTimeReportType,
  MealTimeConfig,
  MealTimeReportData,
} from '@/types/meal-time-report.type';
import { toast } from 'sonner';
import { MealTimeDataTable } from '@/components/reports/meal-time-reports/meal-time-data-table';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';

// Mock data for generated reports table
const MOCK_GENERATED_REPORTS: GeneratedMealTimeReport[] = [
  {
    _id: '1',
    generateDate: '2025-12-29T10:30:00Z',
    reportCompleteTime: '2025-12-29T10:32:15Z',
    generatedBy: 'user123',
    generatedByName: 'John Doe',
    reportType: MealTimeReportType.MEAL_TIME_SALES,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-29T23:59:59Z',
      restaurantIds: ['rest1', 'rest2'],
      menuIds: ['menu1'],
      categoryIds: ['cat1'],
    },
    mealTimeIds: ['breakfast', 'lunch'],
    createdAt: '2025-12-29T10:30:00Z',
    updatedAt: '2025-12-29T10:32:15Z',
  },
];

// Mock data for meal time data table
const MOCK_MEAL_TIME_DATA: MealTimeReportData[] = [
  {
    mealTimeId: '1',
    mealTimeName: 'Breakfast',
    startTime: '06:00',
    endTime: '10:00',
    totalBills: 45,
    totalRevenue: 125000,
    totalTax: 18750,
    totalDiscount: 6250,
    averageBillValue: 2778,
    bills: [
      {
        billId: 'b1',
        billNo: 'B001',
        billTime: '07:30 AM',
        revenue: 2800,
        tax: 420,
        discount: 140,
        paymentMethod: 'CARD',
        status: 'PAID',
      },
    ],
  },
  {
    mealTimeId: '2',
    mealTimeName: 'Lunch',
    startTime: '12:00',
    endTime: '15:00',
    totalBills: 120,
    totalRevenue: 450000,
    totalTax: 67500,
    totalDiscount: 22500,
    averageBillValue: 3750,
    bills: [
      {
        billId: 'l1',
        billNo: 'L001',
        billTime: '12:45 PM',
        revenue: 4200,
        tax: 630,
        discount: 210,
        paymentMethod: 'UPI',
        status: 'PAID',
      },
    ],
  },
];

export default function MealTimeReportPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ReportQueryParams>({});
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<GeneratedMealTimeReport | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<
    GeneratedMealTimeReport[]
  >(MOCK_GENERATED_REPORTS);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleGenerateAllReport = async () => {
    setIsGenerating(true);

    toast.success(t('reports.mealTime.generatingAllReport'), {
      description: t('reports.mealTime.generatingAllDescription'),
    });

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create new report for all meal times
      const newReport: GeneratedMealTimeReport = {
        _id: Date.now().toString(),
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: MealTimeReportType.MEAL_TIME_SALES,
        generationStatus: ReportGenerationStatus.COMPLETED,
        downloadUrl: '#',
        filters,
        mealTimeIds: MOCK_MEAL_TIME_DATA.map((data) => data.mealTimeId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reportCompleteTime: new Date().toISOString(),
      };

      // Add to generated reports table
      setGeneratedReports((prev) => [newReport, ...prev]);

      toast.success(t('reports.mealTime.allReportGenerated'));
    } catch (error) {
      toast.error(t('reports.mealTime.generationFailed'), {
        description: t('common.errors.tryAgainLater'),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShowDetails = useCallback((report: GeneratedMealTimeReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedReport(null);
  }, []);

  const handleDownloadReport = useCallback(
    (report: GeneratedMealTimeReport) => {
      if (!report.downloadUrl) {
        toast.error('Download URL not available');
        return;
      }

      // Create a temporary link for download
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    },
    [],
  );

  const handleConfigureMealTimes = useCallback(() => {
    setIsConfigModalOpen(true);
  }, []);

  const handleSaveMealTimes = async (mealTimes: MealTimeConfig[]) => {
    try {
      // TODO: Implement save to API
      console.log('Saving meal times:', mealTimes);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t('reports.mealTime.configSaved'));
      setIsConfigModalOpen(false);
    } catch (error) {
      toast.error(t('common.errors.saveFailed'));
    }
  };

  const handleRefresh = useCallback(() => {
    toast.info(t('reports.mealTime.refreshingReport'));
    // TODO: Add API refetch here
  }, []);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.mealTimeReport')}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.mealTime.description')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
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
          onSubmit={() => {}}
        >
          <MealTimeReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Generated Reports Table using generic component */}
        <GeneratedReportsTable
          title="reports.mealTime.generatedReports"
          data={generatedReports}
          onShowDetails={handleShowDetails}
          onDownload={handleDownloadReport}
          defaultCollapsed={false} // Or true if you want it collapsed by default
          searchPlaceholder="reports.mealTime.searchPlaceholder"
          emptyMessage="reports.mealTime.noGeneratedReports"
        />

        {/* Meal Time Data Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.mealTime.mealTimeReport')}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleConfigureMealTimes}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {t('reports.mealTime.configureMealTimes')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAllReport}
                className="flex items-center gap-2"
                disabled={isGenerating}
              >
                <FileText className="h-4 w-4" />
                {isGenerating
                  ? t('reports.mealTime.generating')
                  : t('reports.mealTime.generateReport')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {MOCK_MEAL_TIME_DATA.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.mealTime.noData')}
              </div>
            ) : (
              <MealTimeDataTable data={MOCK_MEAL_TIME_DATA} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Meal Time Configuration Modal */}
      <MealTimeConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={handleSaveMealTimes}
      />

      {/* Report Details Modal */}
      <MealTimeReportDetailsModal
        report={selectedReport}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
      />
    </Layout>
  );
}
