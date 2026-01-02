'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { Button } from '@/components/ui/button';
import {
  CalendarDays,
  Clock,
  Download,
  DownloadCloud,
  Eye,
  RefreshCw,
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
  DailyReportType,
  ReportGenerationStatus,
  HourlyReportType,
} from '@/types/report.type';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

// Mapping between HourlyReportType (UI) and DailyReportType (API)
const HOURLY_TO_DAILY_TYPE_MAP: Record<HourlyReportType, DailyReportType> = {
  [HourlyReportType.DAY_WISE]: DailyReportType.DSR_BILL_WISE,
  [HourlyReportType.DAY_WISE_SUMMARY]: DailyReportType.DSR_DAY_WISE_SUMMARY,
  [HourlyReportType.MONTH_WISE]: DailyReportType.MONTH_WISE_SALES,
};

// Reverse mapping for display
const DAILY_TO_HOURLY_TYPE_MAP: Partial<
  Record<DailyReportType, HourlyReportType>
> = {
  [DailyReportType.DSR_BILL_WISE]: HourlyReportType.DAY_WISE,
  [DailyReportType.DSR_DAY_WISE_SUMMARY]: HourlyReportType.DAY_WISE_SUMMARY,
  [DailyReportType.MONTH_WISE_SALES]: HourlyReportType.MONTH_WISE,
};

// Report Type Labels for Hourly Reports
const HOURLY_REPORT_TYPE_LABELS: Record<HourlyReportType, string> = {
  [HourlyReportType.DAY_WISE]: 'reports.hourly.reportTypes.dayWise',
  [HourlyReportType.DAY_WISE_SUMMARY]:
    'reports.hourly.reportTypes.dayWiseSummary',
  [HourlyReportType.MONTH_WISE]: 'reports.hourly.reportTypes.monthWise',
};

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

// Mock data (remove in production)
const MOCK_GENERATED_REPORTS: GeneratedReport[] = [
  {
    _id: '1',
    generateDate: '2025-12-29T10:30:00Z',
    reportCompleteTime: '2025-12-29T10:32:15Z',
    generatedBy: 'user123',
    generatedByName: 'John Doe',
    reportType: DailyReportType.DSR_BILL_WISE,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-29T23:59:59Z',
      restaurantIds: ['rest1', 'rest2'],
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
    reportType: DailyReportType.DSR_DAY_WISE_SUMMARY,
    generationStatus: ReportGenerationStatus.COMPLETED,
    downloadUrl: '#',
    filters: {
      from: '2025-12-28T00:00:00Z',
      to: '2025-12-28T23:59:59Z',
      restaurantIds: ['rest1'],
    },
    createdAt: '2025-12-29T09:15:00Z',
    updatedAt: '2025-12-29T09:16:45Z',
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

export default function HourlyReportPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ReportQueryParams>({});
  const [selectedReportType, setSelectedReportType] =
    useState<HourlyReportType | null>(null);
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
  const generatedReports = MOCK_GENERATED_REPORTS;
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
    async (hourlyType: HourlyReportType) => {
      setSelectedReportType(hourlyType);
      setIsGenerating(true);

      const dailyType = HOURLY_TO_DAILY_TYPE_MAP[hourlyType];
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
        // const response = await generateReportAPI({
        //     reportType: dailyType,
        //     filters
        // });
        await new Promise((resolve) => setTimeout(resolve, 2000));

        toast.success(t('reports.hourly.generationSuccess'));
      } catch (error) {
        console.error('Report generation failed:', error);
        toast.error(t('reports.hourly.generationFailed'), {
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
        toast.error(t('reports.hourly.downloadUrlNotAvailable'));
        return;
      }

      // Validate URL for security
      try {
        const url = new URL(report.downloadUrl);
        if (!['http:', 'https:'].includes(url.protocol)) {
          throw new Error('Invalid protocol');
        }
      } catch {
        toast.error(t('reports.hourly.invalidDownloadUrl'));
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

  // Memoized columns
  const generatedReportsColumns = useMemo<ColumnDef<GeneratedReport>[]>(
    () => [
      {
        accessorKey: 'generateDate',
        header: t('reports.hourly.columns.generateDate'),
        enableSorting: true,
        cell: ({ row }) => (
          <div className="whitespace-nowrap" title={row.original.generateDate}>
            {formatDateTime(row.original.generateDate)}
          </div>
        ),
      },
      {
        accessorKey: 'reportCompleteTime',
        header: t('reports.hourly.columns.completeTime'),
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
        header: t('reports.hourly.columns.generatedBy'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.generatedByName || row.original.generatedBy}
          </div>
        ),
      },
      {
        accessorKey: 'reportType',
        header: t('reports.hourly.columns.reportType'),
        enableSorting: false,
        cell: ({ row }) => {
          const reportType = row.original.reportType;
          const hourlyType = DAILY_TO_HOURLY_TYPE_MAP[reportType];

          if (hourlyType) {
            return (
              <div className="max-w-[200px]">
                {t(HOURLY_REPORT_TYPE_LABELS[hourlyType])}
              </div>
            );
          }

          return <div className="max-w-[200px]">{reportType}</div>;
        },
      },
      {
        accessorKey: 'generationStatus',
        header: t('reports.hourly.columns.status'),
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
        header: t('reports.hourly.columns.details'),
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShowDetails(row.original)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {t('reports.hourly.showDetails')}
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
                  title={t('reports.hourly.downloadReport')}
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
          onSubmit={() => {}}
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

        {/* Generated Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('reports.hourly.generatedReports')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">{t('common.loading')}</div>
            ) : generatedReports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {t('reports.hourly.noGeneratedReports')}
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
                searchPlaceholder={t('reports.hourly.searchPlaceholder')}
                isLoading={isLoading}
              />
            )}
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
