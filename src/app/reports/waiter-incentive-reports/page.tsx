'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ReportQueryParams, GeneratedReport } from '@/types/report.type';
import { toast } from 'sonner';
import { WaiterIncentiveFilter } from '@/components/reports/report-filters/waiter-incentive-filter';
import { WaiterIncentiveReportItem } from '@/types/waiter-incentive-report.type';
import { WaiterIncentiveTable } from '@/components/reports/waiter-incentive-reports/waiter-incentive-table';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';
import { IncentiveConfigModal } from '@/components/reports/waiter-incentive-reports/waiter-config-modal';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { DownloadReportOptions } from '@/components/reports/download-report-options';

// Mock data for waiter incentive report
const MOCK_WAITER_INCENTIVE_DATA: WaiterIncentiveReportItem[] = [
  {
    _id: '1',
    orderId: 'ORD-001',
    orderNumber: 'ORD-001',
    orderDate: '2024-01-15T10:30:00Z',
    waiterId: 'WAIT-001',
    waiterName: 'John Doe',
    waiterCode: 'WD001',
    menuItemId: 'MENU-001',
    menuItemName: 'Grilled Chicken',
    menuItemShortCode: 'GC001',
    price: 450,
    quantity: 2,
    amount: 900,
    incentiveValue: 5,
    incentiveType: 'PERCENTAGE',
    totalIncentive: 45,
    status: 'PENDING',
    restaurantId: 'REST-001',
    restaurantName: 'Main Restaurant',
    brandId: 'BRAND-001',
    brandName: 'Food Chain',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    _id: '2',
    orderId: 'ORD-002',
    orderNumber: 'ORD-002',
    orderDate: '2024-01-15T11:45:00Z',
    waiterId: 'WAIT-002',
    waiterName: 'Jane Smith',
    waiterCode: 'JS002',
    menuItemId: 'MENU-002',
    menuItemName: 'Pasta Alfredo',
    menuItemShortCode: 'PA002',
    price: 350,
    quantity: 3,
    amount: 1050,
    incentiveValue: 10,
    incentiveType: 'PERCENTAGE',
    totalIncentive: 105,
    status: 'APPROVED',
    restaurantId: 'REST-001',
    restaurantName: 'Main Restaurant',
    brandId: 'BRAND-001',
    brandName: 'Food Chain',
    createdAt: '2024-01-15T11:45:00Z',
    updatedAt: '2024-01-15T11:45:00Z',
  },
  {
    _id: '3',
    orderId: 'ORD-003',
    orderNumber: 'ORD-003',
    orderDate: '2024-01-15T12:30:00Z',
    waiterId: 'WAIT-001',
    waiterName: 'John Doe',
    waiterCode: 'WD001',
    menuItemId: 'MENU-003',
    menuItemName: 'Chocolate Cake',
    menuItemShortCode: 'CC003',
    price: 200,
    quantity: 1,
    amount: 200,
    incentiveValue: 25,
    incentiveType: 'FIXED_AMOUNT',
    totalIncentive: 25,
    status: 'PAID',
    restaurantId: 'REST-001',
    restaurantName: 'Main Restaurant',
    brandId: 'BRAND-001',
    brandName: 'Food Chain',
    createdAt: '2024-01-15T12:30:00Z',
    updatedAt: '2024-01-15T12:30:00Z',
  },
  {
    _id: '4',
    orderId: 'ORD-004',
    orderNumber: 'ORD-004',
    orderDate: '2024-01-15T13:15:00Z',
    waiterId: 'WAIT-003',
    waiterName: 'Bob Johnson',
    waiterCode: 'BJ003',
    menuItemId: 'MENU-004',
    menuItemName: 'Vegetable Pizza',
    menuItemShortCode: 'VP004',
    price: 500,
    quantity: 2,
    amount: 1000,
    incentiveValue: 7.5,
    incentiveType: 'PERCENTAGE',
    totalIncentive: 75,
    status: 'CANCELLED',
    restaurantId: 'REST-001',
    restaurantName: 'Main Restaurant',
    brandId: 'BRAND-001',
    brandName: 'Food Chain',
    createdAt: '2024-01-15T13:15:00Z',
    updatedAt: '2024-01-15T13:15:00Z',
  },
];

export default function WaiterIncentivePage() {
  const { t } = useTranslation();

  // Filters
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

  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const generatedReports: GeneratedReport[] = [];
  const isLoading = false;
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
  const handleGenerateReport = useCallback(async () => {
    setIsGenerating(true);

    toast.success(
      t('reports.waiterIncentive.generatingReport') || 'Generating report...',
      {
        description:
          t('reports.waiterIncentive.generatingDescription') ||
          'This may take a few moments',
      },
    );

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(
        t('reports.waiterIncentive.generationSuccess') ||
          'Report generated successfully',
      );
    } catch (error) {
      toast.error(
        t('reports.waiterIncentive.generationFailed') ||
          'Failed to generate report',
      );
    } finally {
      setIsGenerating(false);
    }
  }, [t]);

  const handleRefresh = useCallback(() => {
    toast.info(
      t('reports.waiterIncentive.refreshingReports') || 'Refreshing reports',
    );
  }, [t]);

  const handleConfigureIncentive = useCallback(() => {
    setIsConfigModalOpen(true);
  }, []);

  const handleDownloadReport = useCallback(() => {
    toast.success(
      t('reports.waiterIncentive.downloadStarted') || 'Download started',
    );
    // In real app, trigger download
  }, [t]);

  // Handler for showing report details
  const handleShowReportDetails = useCallback((report: GeneratedReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedReport(null);
  }, []);

  // Handler for downloading generated report
  const handleDownloadGeneratedReport = useCallback(
    (report: GeneratedReport) => {
      toast.success(
        t('reports.waiterIncentive.downloadStarted') || 'Download started',
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
              {t('navigation.waiterIncentive') || 'Waiter Incentive Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.waiterIncentive.description') ||
                'View and analyze waiter incentive reports'}
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
          onSubmit={handleGenerateReport}
        >
          <WaiterIncentiveFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Download Report Options */}
        <DownloadReportOptions restaurantId={filters.restaurantIds?.[0]} />

        {/* Waiter Incentive Data Table */}
        <WaiterIncentiveTable
          data={MOCK_WAITER_INCENTIVE_DATA}
          isLoading={false}
          onConfigureIncentive={handleConfigureIncentive}
          onDownload={handleDownloadReport}
        />

        {/* Incentive Configuration Modal */}
        <IncentiveConfigModal
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />

        {/* Report Details Modal */}
        <ReportDetailsModal
          report={selectedReport}
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
        />
      </div>
    </Layout>
  );
}
