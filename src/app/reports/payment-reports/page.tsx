'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import {
  Download,
  Eye,
  RefreshCw,
  FileText,
  BarChart,
  DollarSign,
} from 'lucide-react';
import {
  ReportQueryParams,
  GeneratedReport,
  ReportGenerationStatus,
  PaymentMethodsEnum,
  PaymentReportType,
} from '@/types/report.type';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { toast } from 'sonner';
import { PaymentReportChart } from '@/components/reports/payment-reports/payment-graph';
import { PaymentReportFilters } from '@/components/reports/report-filters/payment-report-filter';
import { useGeneratedReports } from '@/services/api/reports/generated-reports';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';

// Report Type Buttons
const PAYMENT_REPORT_TYPE_BUTTONS = [
  {
    type: PaymentReportType.PAYMENT_ORDER_DETAILS,
    translationKey: 'reports.payment.reportTypes.orderDetails',
    icon: FileText,
  },
  {
    type: PaymentReportType.PAYMENT_SUMMARY,
    translationKey: 'reports.payment.reportTypes.summary',
    icon: Download,
  },
] as const;

// Mock payment summary data
const MOCK_PAYMENT_SUMMARY = {
  totalCollection: 152500,
  totalOrders: 245,
  cashAmount: 45000,
  cardAmount: 68500,
  upiAmount: 32000,
  walletAmount: 3500,
  netBankingAmount: 2500,
  otherAmount: 2000,
  averageOrderValue: 622,
};

// Mock payment report data for chart
const MOCK_PAYMENT_REPORT_DATA = [
  {
    paymentMethod: PaymentMethodsEnum.CASH,
    amount: 45000,
    orderCount: 90,
    percentage: 29.5,
    averageValue: 500,
  },
  {
    paymentMethod: PaymentMethodsEnum.CARD,
    amount: 68500,
    orderCount: 95,
    percentage: 44.9,
    averageValue: 721,
  },
  {
    paymentMethod: PaymentMethodsEnum.UPI,
    amount: 32000,
    orderCount: 50,
    percentage: 21.0,
    averageValue: 640,
  },
];

// Helper function for formatting currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function PaymentReportPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ReportQueryParams>({});
  const [selectedReportType, setSelectedReportType] =
    useState<PaymentReportType | null>(null);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch all generated reports from the system
  const { data: generatedReports = [], isLoading } = useGeneratedReports();

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleGenerateReport = useCallback(
    async (paymentType: PaymentReportType) => {
      setSelectedReportType(paymentType);
      setIsGenerating(true);

      const reportBtn = PAYMENT_REPORT_TYPE_BUTTONS.find(
        (btn) => btn.type === paymentType,
      );
      const reportLabel = reportBtn ? t(reportBtn.translationKey) : paymentType;

      toast.success(
        t('reports.payment.generatingReport', { reportName: reportLabel }),
        {
          description: t('reports.payment.generatingDescription'),
        },
      );

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        toast.success(t('reports.payment.generationSuccess'));
      } catch (error) {
        console.error('Report generation failed:', error);
        toast.error(t('reports.payment.generationFailed'), {
          description: t('common.errors.tryAgainLater'),
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [filters, t],
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
        toast.error(t('reports.payment.downloadUrlNotAvailable'));
        return;
      }

      // Validate URL for security
      try {
        const url = new URL(report.downloadUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        toast.error(t('reports.payment.invalidDownloadUrl'));
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `payment-report-${report._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t('reports.payment.downloadStarted'));
    },
    [t],
  );

  const handleRefresh = useCallback(() => {
    toast.info(t('reports.payment.refreshingReports'));
    // TODO: Add API refetch here
  }, [t]);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
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
          <PaymentReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Summary Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Collection Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {t('reports.payment.totalCollection') || 'Total Collection'}
                </CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {formatCurrency(MOCK_PAYMENT_SUMMARY.totalCollection)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex-1">
                    {t('reports.payment.totalOrders') || 'Total Orders'}:
                  </span>
                  <span className="font-medium">
                    {MOCK_PAYMENT_SUMMARY.totalOrders}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="flex-1">
                    {t('reports.payment.averageOrderValue') ||
                      'Avg Order Value'}
                    :
                  </span>
                  <span className="font-medium">
                    {formatCurrency(MOCK_PAYMENT_SUMMARY.averageOrderValue)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Report with Order Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {t('reports.payment.orderDetailsReport') ||
                    'Payment Report with Order Details'}
                </CardTitle>
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('reports.payment.orderDetailsDesc') ||
                    'Generate detailed report showing payment methods for each order'}
                </p>
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() =>
                    handleGenerateReport(
                      PaymentReportType.PAYMENT_ORDER_DETAILS,
                    )
                  }
                  disabled={isGenerating}
                >
                  {isGenerating &&
                  selectedReportType === PaymentReportType.PAYMENT_ORDER_DETAILS
                    ? t('reports.payment.generating')
                    : t('reports.payment.generateReport')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Report Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">
                  {t('reports.payment.paymentReport') || 'Payment Report'}
                </CardTitle>
                <Download className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('reports.payment.summaryDesc')}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    handleGenerateReport(PaymentReportType.PAYMENT_SUMMARY)
                  }
                  disabled={isGenerating}
                >
                  {isGenerating &&
                  selectedReportType === PaymentReportType.PAYMENT_SUMMARY
                    ? t('reports.payment.downloading')
                    : t('reports.payment.downloadNow')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Reports Table using generic component */}
        <GeneratedReportsTable
          title="reports.payment.generatedReports"
          data={generatedReports}
          isLoading={isLoading}
          onShowDetails={handleShowDetails}
          onDownload={handleDownloadReport}
          defaultCollapsed={false}
          searchPlaceholder="reports.payment.searchPlaceholder"
          emptyMessage="reports.payment.noGeneratedReports"
        />

        {/* Payment Graph Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {t('reports.payment.paymentGraph') ||
                  'Payment Method Distribution'}
              </CardTitle>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <PaymentReportChart data={MOCK_PAYMENT_REPORT_DATA} />
          </CardContent>
        </Card>
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
