'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { Button } from '@/components/ui/button';
import {
  Download,
  Eye,
  RefreshCw,
  FileText,
  BarChart,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table';
import {
  ReportQueryParams,
  GeneratedReport,
  ReportGenerationStatus,
  PaymentMethodsEnum,
  PaymentReportType,
} from '@/types/report.type';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { PaymentReportChart } from '@/components/reports/payment-reports/payment-graph';
import { PaymentReportFilters } from '@/components/reports/report-filters/payment-report-filter';

// Report Type Buttons - Use PaymentReportType directly
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

// Report Type Labels for Payment Reports
const PAYMENT_REPORT_TYPE_LABELS: Record<PaymentReportType, string> = {
  [PaymentReportType.PAYMENT_ORDER_DETAILS]:
    'reports.payment.reportTypes.orderDetails',
  [PaymentReportType.PAYMENT_SUMMARY]: 'reports.payment.reportTypes.summary',
};

// Report Status Colors
const REPORT_STATUS_CONFIGS: Record<
  ReportGenerationStatus,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
    translationKey: string;
  }
> = {
  [ReportGenerationStatus.COMPLETED]: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
    translationKey: 'reports.status.completed',
  },
  [ReportGenerationStatus.FAILED]: {
    variant: 'destructive',
    className: 'bg-red-500 hover:bg-red-600 text-white',
    translationKey: 'reports.status.failed',
  },
  [ReportGenerationStatus.PROCESSING]: {
    variant: 'secondary',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
    translationKey: 'reports.status.processing',
  },
  [ReportGenerationStatus.PENDING]: {
    variant: 'outline',
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    translationKey: 'reports.status.pending',
  },
};

// Payment Summary Interface
interface PaymentSummary {
  totalCollection: number;
  totalOrders: number;
  cashAmount: number;
  cardAmount: number;
  upiAmount: number;
  walletAmount: number;
  netBankingAmount: number;
  otherAmount: number;
  averageOrderValue: number;
}

// Payment Report Data Interface
interface PaymentReportData {
  paymentMethod: PaymentMethodsEnum;
  amount: number;
  orderCount: number;
  percentage: number;
  averageValue: number;
}

// Mock data - Store PaymentReportType directly
const MOCK_GENERATED_PAYMENT_REPORTS: GeneratedReport[] = [
  {
    _id: '1',
    generateDate: '2025-12-29T10:30:00Z',
    reportCompleteTime: '2025-12-29T10:32:15Z',
    generatedBy: 'user123',
    generatedByName: 'John Doe',
    reportType: PaymentReportType.PAYMENT_ORDER_DETAILS,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-29T23:59:59Z',
      restaurantIds: ['rest1', 'rest2'],
      paymentMethods: [
        PaymentMethodsEnum.CASH,
        PaymentMethodsEnum.CARD,
        PaymentMethodsEnum.UPI,
      ],
    },
    createdAt: '2025-12-29T10:30:00Z',
    updatedAt: '2025-12-29T10:32:15Z',
  },
  {
    _id: '2',
    generateDate: '2025-12-29T09:15:00Z',
    reportCompleteTime: '2025-12-29T09:16:45Z',
    generatedBy: 'user456',
    generatedByName: 'Jane Smith',
    reportType: PaymentReportType.PAYMENT_SUMMARY,
    generationStatus: ReportGenerationStatus.PROCESSING,
    downloadUrl: '',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-28T23:59:59Z',
      restaurantIds: ['rest1'],
    },
    createdAt: '2025-12-29T09:15:00Z',
    updatedAt: '2025-12-29T09:16:45Z',
  },
];

// Mock payment summary data
const MOCK_PAYMENT_SUMMARY: PaymentSummary = {
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
const MOCK_PAYMENT_REPORT_DATA: PaymentReportData[] = [
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

// Helper function
const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
};

// Helper function for formatting currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Type guard to check if report type is PaymentReportType
const isPaymentReportType = (
  reportType: string,
): reportType is PaymentReportType => {
  return Object.values(PaymentReportType).includes(
    reportType as PaymentReportType,
  );
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

  // Mock data - replace with actual API call in production
  const generatedReports = MOCK_GENERATED_PAYMENT_REPORTS;
  const totalCount = generatedReports.length;
  const isLoading = false;

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
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
        // Send paymentType directly to API
        // const response = await generatePaymentReportAPI({
        //     reportType: paymentType, // Send PaymentReportType directly
        //     filters
        // });
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

  // Memoized columns
  const generatedReportsColumns = useMemo<ColumnDef<GeneratedReport>[]>(
    () => [
      {
        accessorKey: 'generateDate',
        header: t('reports.payment.columns.generateDate'),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="whitespace-nowrap" title={row.original.generateDate}>
            {formatDateTime(row.original.generateDate)}
          </div>
        ),
      },
      {
        accessorKey: 'reportCompleteTime',
        header: t('reports.payment.columns.completeTime'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="whitespace-nowrap">
            {row.original.reportCompleteTime
              ? formatDateTime(row.original.reportCompleteTime)
              : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'generatedByName',
        header: t('reports.payment.columns.generatedBy'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.generatedByName || row.original.generatedBy}
          </div>
        ),
      },
      {
        accessorKey: 'reportType',
        header: t('reports.payment.columns.reportType'),
        enableSorting: false,
        cell: ({ row }) => {
          const reportType = row.original.reportType;

          // Check if it's a PaymentReportType
          if (isPaymentReportType(reportType)) {
            return (
              <div className="max-w-[200px]">
                {t(PAYMENT_REPORT_TYPE_LABELS[reportType])}
              </div>
            );
          }

          return <div className="max-w-[200px]">{reportType}</div>;
        },
      },
      {
        accessorKey: 'generationStatus',
        header: t('reports.payment.columns.status'),
        enableSorting: true,
        cell: ({ row }) => {
          const status = row.original.generationStatus;
          const statusConfig = REPORT_STATUS_CONFIGS[status];

          return (
            <Badge
              variant={statusConfig.variant}
              className={statusConfig.className}
            >
              {t(statusConfig.translationKey)}
            </Badge>
          );
        },
      },
      {
        id: 'details',
        header: t('reports.payment.columns.details'),
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShowDetails(row.original)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {t('reports.payment.showDetails')}
          </Button>
        ),
      },
      {
        id: 'actions',
        header: t('common.actions'),
        cell: ({ row }) => {
          const report = row.original;
          const isCompleted =
            report.generationStatus === ReportGenerationStatus.COMPLETED;

          return (
            <div className="flex items-center gap-2">
              {isCompleted && report.downloadUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownloadReport(report)}
                  className="flex items-center gap-1"
                  title={t('reports.payment.downloadReport')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [t, handleShowDetails, handleDownloadReport],
  );

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

        {/* Summary Cards Section - 3 Cards Total */}
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

          {/* Payment Report with Order Details Card - Button 1 */}
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

          {/* Payment Report Card - Button 2 */}
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

        {/* Generated Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.payment.generatedReports')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">{t('common.loading')}</div>
            ) : generatedReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('reports.payment.noGeneratedReports')}
              </div>
            ) : (
              <TanStackTable<GeneratedReport>
                data={generatedReports}
                columns={generatedReportsColumns}
                totalCount={totalCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                manualPagination={false}
                showPagination={true}
                showSearch={true}
                searchPlaceholder={t('reports.payment.searchPlaceholder')}
                isLoading={isLoading}
              />
            )}
          </CardContent>
        </Card>

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
