'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Download,
  FileText,
  CheckCircle,
  Printer,
} from 'lucide-react';
import {
  ReportQueryParams,
  GeneratedReport,
  BillPrintReportType,
  ReportGenerationStatus,
  PrintStatus,
} from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  useBillPrintColumns,
  BillPrintReportItem,
} from '@/components/reports/bill-print-reports/bill-print-columns';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { useGeneratedReports } from '@/services/api/reports/generated-reports';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';

// Mock bill print data with the 4 order types
const MOCK_BILL_PRINT_DATA: BillPrintReportItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    orderType: 'DINE_IN',
    date: '2024-01-20T10:30:00Z',
    amount: 2500.0,
    status: PrintStatus.FULFILLED,
    printCount: 3,
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    orderType: 'TAKE_AWAY',
    date: '2024-01-20T11:15:00Z',
    amount: 1800.5,
    status: PrintStatus.FULFILLED,
    printCount: 2,
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    orderType: 'DELIVERY',
    date: '2024-01-20T12:45:00Z',
    amount: 3200.75,
    status: PrintStatus.PENDING,
    printCount: 0,
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    orderType: 'QUICK_BILL',
    date: '2024-01-20T13:20:00Z',
    amount: 1500.0,
    status: PrintStatus.CANCELLED,
    printCount: 0,
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    orderType: 'TAKE_AWAY',
    date: '2024-01-20T14:10:00Z',
    amount: 2750.25,
    status: PrintStatus.FULFILLED,
    printCount: 1,
  },
];

export default function BillPrintReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedReportType, setSelectedReportType] =
    useState<BillPrintReportType | null>(null);

  // Local state to store generated reports
  const [localGeneratedReports, setLocalGeneratedReports] = useState<
    GeneratedReport[]
  >([]);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'status', desc: false },
    { id: 'date', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch ALL generated reports from the system
  const {
    data: generatedReports = [],
    isLoading: isLoadingReports,
    refetch,
  } = useGeneratedReports();

  // Combine API data with locally generated reports
  const allGeneratedReports = [...generatedReports, ...localGeneratedReports];

  // Get columns from separate file
  const columns = useBillPrintColumns();

  // Filter mock data based on search term and sort by status (Fulfilled → Pending → Cancelled)
  const filteredData = useMemo(() => {
    let data = [...MOCK_BILL_PRINT_DATA];

    // Apply status-based sorting first
    const statusOrder = {
      [PrintStatus.FULFILLED]: 1,
      [PrintStatus.PENDING]: 2,
      [PrintStatus.CANCELLED]: 3,
    };

    data.sort((a, b) => {
      const statusA = statusOrder[a.status];
      const statusB = statusOrder[b.status];

      // First sort by status
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // Then sort by date descending within same status
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter((item) => {
        return item.orderNumber.toLowerCase().includes(lowerSearchTerm);
      });
    }

    // Apply sorting from table
    const sortConfig = sorting[0];
    if (sortConfig && sortConfig.id !== 'status') {
      data.sort((a, b) => {
        const aValue = a[sortConfig.id as keyof BillPrintReportItem];
        const bValue = b[sortConfig.id as keyof BillPrintReportItem];

        if (sortConfig.id === 'date') {
          const aDate = new Date(aValue as string).getTime();
          const bDate = new Date(bValue as string).getTime();
          return sortConfig.desc ? bDate - aDate : aDate - bDate;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.desc ? bValue - aValue : aValue - bValue;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.desc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        return 0;
      });
    }

    return data;
  }, [searchTerm, sorting]);

  // Calculate totals for the report
  const reportTotals = useMemo(() => {
    const fulfilledData = filteredData.filter(
      (item) => item.status === PrintStatus.FULFILLED,
    );

    return {
      totalOrders: filteredData.length,
      fulfilledOrders: fulfilledData.length,
      totalAmount: fulfilledData.reduce((sum, item) => sum + item.amount, 0),
      totalPrints: fulfilledData.reduce(
        (sum, item) => sum + item.printCount,
        0,
      ),
    };
  }, [filteredData]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: 10 });
    setSorting([
      { id: 'status', desc: false },
      { id: 'date', desc: true },
    ]);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
    toast.info(
      t('reports.billPrint.generatingReport') ||
        'Fetching bill print report data...',
    );
  }, [filters, t]);

  const handleRefresh = useCallback(() => {
    refetch();
    toast.success(t('common.refresh') || 'Data refreshed');
  }, [refetch, t]);

  // Download button that generates and adds report to table
  const handleDownloadReport = useCallback(async () => {
    setIsDownloading(true);
    setSelectedReportType(BillPrintReportType.BILL_PRINT_SUMMARY);

    toast.success(
      t('reports.billPrint.generating') || 'Generating Bill Print Summary...',
      {
        description:
          t('reports.billPrint.generatingDescription') ||
          'This may take a few moments',
      },
    );

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a new report object
      const newReport: GeneratedReport = {
        _id: `billprint_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: BillPrintReportType.BILL_PRINT_SUMMARY,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/bill-print-${Date.now()}.csv`,
      };

      // Add the new report to local state
      setLocalGeneratedReports((prev) => [newReport, ...prev]);

      toast.success(
        t('reports.billPrint.generationSuccess') ||
          'Report generated successfully!',
        {
          description:
            t('reports.billPrint.generationSuccessDescription') ||
            'Bill Print Summary report has been generated and added to the table.',
        },
      );

      // Also refetch from API if needed
      refetch();
    } catch (error) {
      toast.error(
        t('reports.billPrint.generationFailed') || 'Failed to generate report',
      );
    } finally {
      setIsDownloading(false);
    }
  }, [filters, submittedFilters, refetch, t]);

  const handleShowReportDetails = useCallback((report: GeneratedReport) => {
    setSelectedReport(report);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedReport(null);
  }, []);

  // Download generated report from the table
  const handleDownloadGeneratedReport = useCallback(
    (report: GeneratedReport) => {
      if (!report.downloadUrl) {
        toast.error(
          t('reports.dailySales.downloadUrlNotAvailable') ||
            'Download URL not available',
        );
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `bill-print-report-${report._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        t('reports.dailySales.downloadStarted') || 'Download started',
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
              {t('navigation.billPrintReports') || 'Bill Print Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.billPrint.description') ||
                'View bill printing history and generate reports'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh') || 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Report Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('reports.billPrint.summary.totalOrders') ||
                      'Total Orders'}
                  </p>
                  <p className="text-2xl font-bold">
                    {reportTotals.totalOrders}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('reports.billPrint.summary.fulfilledOrders') ||
                      'Fulfilled Orders'}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {reportTotals.fulfilledOrders}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('reports.billPrint.summary.totalAmount') ||
                      'Total Amount'}
                  </p>
                  <p className="text-2xl font-bold">
                    {reportTotals.totalAmount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('reports.billPrint.summary.totalPrints') ||
                      'Total Prints'}
                  </p>
                  <p className="text-2xl font-bold">
                    {reportTotals.totalPrints}
                  </p>
                </div>
                <Printer className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Reports Table */}
        <GeneratedReportsTable
          title="reports.payment.generatedReports"
          data={allGeneratedReports}
          isLoading={isLoadingReports}
          onShowDetails={handleShowReportDetails}
          onDownload={handleDownloadGeneratedReport}
          defaultCollapsed={false}
          searchPlaceholder={
            t('reports.dailySales.searchPlaceholder') ||
            'Search generated reports...'
          }
          emptyMessage={
            t('reports.dailySales.noGeneratedReports') ||
            'No generated reports found'
          }
        />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.billPrint.table.title') || 'Bill Printing History'}
              </CardTitle>
            </div>
            {/* Download button */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport}
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isDownloading
                  ? t('reports.billPrint.generating') || 'Generating...'
                  : t('common.download') || 'Download Report'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.billPrint.table.noData') ||
                  'No bill print data found'}
              </div>
            ) : (
              <TanStackTable
                data={filteredData}
                columns={columns}
                totalCount={filteredData.length}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder={
                  t('reports.billPrint.table.searchPlaceholder') ||
                  'Search order number...'
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
                  t('reports.billPrint.table.noData') ||
                  'No bill print data found'
                }
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>

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
