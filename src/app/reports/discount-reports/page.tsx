'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ReportQueryParams, GeneratedReport } from '@/types/report.type';
import { toast } from 'sonner';
import { REPORT_TYPE_BUTTONS } from '@/components/reports/discount-reports/constants';
import { DiscountReportFilters } from '@/components/reports/report-filters/discount-report-filters';
import { DiscountReportItem } from '@/types/discount-report.type';
import { DiscountDataTable } from '@/components/reports/discount-reports/discount-table';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';
import { useGeneratedReports } from '@/services/api/reports/generated-reports';

// Mock discount data for table
const MOCK_DISCOUNT_REPORT_DATA: DiscountReportItem[] = [
  {
    _id: '1',
    orderNumber: 'ORD-001',
    orderFrom: 'John Doe',
    customerName: 'John Doe',
    orderDate: '2024-01-15T10:30:00Z',
    totalAmount: 1500,
    discountAmount: 150,
    discountPercentage: 10,
    discountType: 'Percentage',
    discountCode: 'WELCOME10',
    appliedBy: 'System',
    status: 'Fulfilled',
    restaurantName: 'Main Restaurant',
    orderType: 'Dine-in',
    billStatus: 'PAID',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    orderNumber: 'ORD-002',
    orderFrom: 'Jane Smith',
    customerName: 'Jane Smith',
    orderDate: '2024-01-15T11:45:00Z',
    totalAmount: 2500,
    discountAmount: 500,
    discountPercentage: 20,
    discountType: 'Fixed Amount',
    discountCode: 'FLAT500',
    appliedBy: 'Manager',
    status: 'Fulfilled',
    restaurantName: 'Main Restaurant',
    orderType: 'Takeaway',
    billStatus: 'PAID',
    createdAt: '2024-01-15T11:45:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
  },
  {
    _id: '3',
    orderNumber: 'ORD-003',
    orderFrom: 'Bob Johnson',
    customerName: 'Bob Johnson',
    orderDate: '2024-01-15T12:30:00Z',
    totalAmount: 1200,
    discountAmount: 0,
    discountPercentage: 0,
    discountType: 'None',
    discountCode: '',
    appliedBy: '',
    status: 'Cancelled',
    restaurantName: 'Main Restaurant',
    orderType: 'Delivery',
    billStatus: 'PAID',
    createdAt: '2024-01-15T12:30:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
  },
];

export default function DiscountReportPage() {
  const { t } = useTranslation();

  // Filters
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  const [selectedReportType, setSelectedReportType] = useState<string | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all generated reports from the system
  const { data: generatedReports = [], isLoading } = useGeneratedReports();

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const today = new Date();
    setFilters({
      from: today.toISOString(),
      to: today.toISOString(),
    });
  }, []);

  // Generate report handler
  const handleGenerateReport = useCallback(
    async (reportType: string) => {
      setSelectedReportType(reportType);
      setIsGenerating(true);

      const reportBtn = REPORT_TYPE_BUTTONS.find(
        (btn) => btn.type === reportType,
      );
      const reportLabel = reportBtn ? t(reportBtn.translationKey) : reportType;

      toast.success(
        t('reports.discount.generatingReport', { reportName: reportLabel }),
        {
          description: t('reports.discount.generatingDescription'),
        },
      );

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success(t('reports.discount.generationSuccess'));
      } catch (error) {
        toast.error(t('reports.discount.generationFailed'));
      } finally {
        setIsGenerating(false);
      }
    },
    [t],
  );

  const handleRefresh = useCallback(() => {
    toast.info(t('reports.discount.refreshingReports'));
  }, [t]);

  // Handler for showing report details
  const handleShowReportDetails = useCallback((report: GeneratedReport) => {
    toast.info('Report details would show here', {
      description: `Report ID: ${report._id}`,
    });
  }, []);

  // Handler for downloading report
  const handleDownloadReport = useCallback(
    (report: GeneratedReport) => {
      toast.success(
        t('reports.discount.downloadStarted') || 'Download started',
      );
    },
    [t],
  );

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
          onSubmit={() => {}}
        >
          <DiscountReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Report Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.discount.selectReportType') || 'Select Report Type'}
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

        {/* Generated Reports Table */}
        <GeneratedReportsTable
          title="reports.discount.generatedReports"
          data={generatedReports}
          isLoading={isLoading}
          onShowDetails={handleShowReportDetails}
          onDownload={handleDownloadReport}
          defaultCollapsed={false}
          searchPlaceholder="reports.discount.searchPlaceholder"
          emptyMessage="reports.discount.noGeneratedReports"
        />

        {/* Discount Data Table */}
        <DiscountDataTable
          data={MOCK_DISCOUNT_REPORT_DATA}
          isLoading={false}
          searchPlaceholder="reports.discount.searchPlaceholder"
          emptyMessage="reports.discount.noData"
        />
      </div>
    </Layout>
  );
}
