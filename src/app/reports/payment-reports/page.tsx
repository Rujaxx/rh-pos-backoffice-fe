'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, FileText, DollarSign } from 'lucide-react';
import {
  ReportQueryParams,
  GeneratedReport,
  PaymentReportType,
} from '@/types/report.type';
import { PaymentMethodsEnum } from '@/types/payment-report.type';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { toast } from 'sonner';
import { PaymentReportFilters } from '@/components/reports/report-filters/payment-report-filter';
import { useGeneratedReports } from '@/services/api/reports/generated-reports';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';

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

// Mock payment report data for table
const MOCK_PAYMENT_REPORT_DATA = [
  {
    id: '1',
    paymentMethod: PaymentMethodsEnum.CASH,
    amount: 45000,
    orderCount: 90,
    percentage: 29.5,
    averageValue: 500,
    status: 'ACTIVE',
  },
  {
    id: '2',
    paymentMethod: PaymentMethodsEnum.CARD,
    amount: 68500,
    orderCount: 95,
    percentage: 44.9,
    averageValue: 721,
    status: 'ACTIVE',
  },
  {
    id: '3',
    paymentMethod: PaymentMethodsEnum.PHONEPE,
    amount: 32000,
    orderCount: 50,
    percentage: 21.0,
    averageValue: 640,
    status: 'ACTIVE',
  },
  {
    id: '4',
    paymentMethod: PaymentMethodsEnum.UPI,
    amount: 5000,
    orderCount: 10,
    percentage: 3.3,
    averageValue: 500,
    status: 'ACTIVE',
  },
  {
    id: '5',
    paymentMethod: PaymentMethodsEnum.WALLET,
    amount: 3500,
    orderCount: 15,
    percentage: 2.3,
    averageValue: 233,
    status: 'ACTIVE',
  },
  {
    id: '6',
    paymentMethod: PaymentMethodsEnum.NET_BANKING,
    amount: 2500,
    orderCount: 8,
    percentage: 1.6,
    averageValue: 313,
    status: 'ACTIVE',
  },
  {
    id: '7',
    paymentMethod: PaymentMethodsEnum.OTHER,
    amount: 2000,
    orderCount: 7,
    percentage: 1.3,
    averageValue: 286,
    status: 'ACTIVE',
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

// Format percentage
const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
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

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch all generated reports from the system
  const { data: generatedReports = [], isLoading } = useGeneratedReports();

  // Filter mock data based on search term
  const filteredPaymentData = useMemo(() => {
    if (!searchTerm) return MOCK_PAYMENT_REPORT_DATA;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return MOCK_PAYMENT_REPORT_DATA.filter((item) => {
      const paymentMethod =
        PAYMENT_METHOD_LABELS[item.paymentMethod] || item.paymentMethod;
      return (
        paymentMethod.toLowerCase().includes(lowerSearchTerm) ||
        item.status.toLowerCase().includes(lowerSearchTerm)
      );
    });
  }, [searchTerm]);

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
    [t],
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

  // Define columns for payment method table
  const paymentMethodColumns: ColumnDef<
    (typeof MOCK_PAYMENT_REPORT_DATA)[0]
  >[] = [
    {
      accessorKey: 'paymentMethod',
      header: t('reports.payment.columns.paymentMethod') || 'Payment Method',
      cell: ({ row }) => (
        <div className="font-medium">
          {PAYMENT_METHOD_LABELS[row.original.paymentMethod] ||
            row.original.paymentMethod}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: t('reports.payment.columns.amount') || 'Amount',
      cell: ({ row }) => (
        <div className="font-medium">{formatCurrency(row.original.amount)}</div>
      ),
    },
    {
      accessorKey: 'orderCount',
      header: t('reports.payment.columns.orderCount') || 'Orders',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.orderCount}</div>
      ),
      meta: {
        className: 'text-center',
      },
    },
    {
      accessorKey: 'percentage',
      header: t('reports.payment.columns.percentage') || 'Percentage',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatPercentage(row.original.percentage)}
        </div>
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

        {/* Payment Method Distribution Table using TanStackTable */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.payment.paymentDistribution') ||
                  'Payment Method Distribution'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <TanStackTable
              data={filteredPaymentData}
              columns={paymentMethodColumns}
              totalCount={filteredPaymentData.length}
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
              emptyMessage={
                t('reports.payment.noPaymentData') || 'No payment data found'
              }
              enableMultiSort={false}
            />
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
