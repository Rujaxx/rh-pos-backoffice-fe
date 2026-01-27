'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import {
  RefreshCw,
  Download,
  Printer,
  FileText,
  Loader2,
  ChefHat,
} from 'lucide-react';
import {
  ReportQueryParams,
  GeneratedReport,
  KitchenDepartmentReportType,
  ReportGenerationStatus,
} from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useKitchenDepartmentColumns } from '@/components/reports/kitchen-department-reports/kitchen-dept-columns';
import { KitchenDepartmentReportFilters } from '@/components/reports/report-filters/kitchen-dept-filters';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { DownloadReportOptions } from '@/components/reports/download-report-options';

// Mock kitchen department data
const MOCK_KITCHEN_DEPARTMENT_DATA = [
  {
    id: '1',
    kitchenDepartment: 'Main Kitchen',
    categoryName: 'Pizza',
    soldItems: 480,
    totalAmount: 720000,
    itemLevelDiscount: 7200,
    itemLevelTotalCharges: 3600,
  },
  {
    id: '2',
    kitchenDepartment: 'Main Kitchen',
    categoryName: 'Main Course',
    soldItems: 620,
    totalAmount: 620000,
    itemLevelDiscount: 6200,
    itemLevelTotalCharges: 3100,
  },
  {
    id: '3',
    kitchenDepartment: 'Beverage Station',
    categoryName: 'Beverages',
    soldItems: 850,
    totalAmount: 425000,
    itemLevelDiscount: 4250,
    itemLevelTotalCharges: 2125,
  },
  {
    id: '4',
    kitchenDepartment: 'Main Kitchen',
    categoryName: 'Rice Items',
    soldItems: 310,
    totalAmount: 372000,
    itemLevelDiscount: 3720,
    itemLevelTotalCharges: 1860,
  },
  {
    id: '5',
    kitchenDepartment: 'Special Counter',
    categoryName: 'Combos',
    soldItems: 280,
    totalAmount: 336000,
    itemLevelDiscount: 3360,
    itemLevelTotalCharges: 1680,
  },
  {
    id: '6',
    kitchenDepartment: 'Chinese Station',
    categoryName: 'Chinese',
    soldItems: 220,
    totalAmount: 330000,
    itemLevelDiscount: 3300,
    itemLevelTotalCharges: 1650,
  },
];

export default function KitchenDepartmentReportPage() {
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedReportType, setSelectedReportType] =
    useState<KitchenDepartmentReportType | null>(null);

  // ADDED: Local state to store generated reports (like DSR)
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
    { id: 'totalAmount', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Fetch ALL generated reports from the system
  const generatedReports: GeneratedReport[] = [];
  const isLoading = false;

  // ADDED: Combine API data with locally generated reports (like DSR)
  const allGeneratedReports = [...generatedReports, ...localGeneratedReports];

  // Filter mock data based on search term
  const filteredData = useMemo(() => {
    let data = [...MOCK_KITCHEN_DEPARTMENT_DATA];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter((item) => {
        return (
          item.kitchenDepartment.toLowerCase().includes(lowerSearchTerm) ||
          item.categoryName.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }

    // Apply sorting
    const sortConfig = sorting[0];
    if (sortConfig) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.id as keyof typeof a];
        const bValue = b[sortConfig.id as keyof typeof b];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.desc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.desc ? bValue - aValue : aValue - bValue;
        }

        return 0;
      });
    }

    return data;
  }, [searchTerm, sorting]);

  // Calculate totals for the report
  const reportTotals = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        totalSoldItems: acc.totalSoldItems + item.soldItems,
        totalAmount: acc.totalAmount + item.totalAmount,
        totalDiscount: acc.totalDiscount + item.itemLevelDiscount,
        totalCharges: acc.totalCharges + item.itemLevelTotalCharges,
      }),
      {
        totalSoldItems: 0,
        totalAmount: 0,
        totalDiscount: 0,
        totalCharges: 0,
      },
    );
  }, [filteredData]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: 10 });
    setSorting([{ id: 'totalAmount', desc: true }]);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
    toast.info('Fetching kitchen department report data...');
  }, [filters]);

  // CHANGED: Download button now GENERATES AND ADDS REPORT TO TABLE like DSR
  const handleDownloadReport = useCallback(async () => {
    setIsDownloading(true);
    setSelectedReportType(
      KitchenDepartmentReportType.KITCHEN_DEPARTMENT_SUMMARY,
    );

    toast.success('Generating Kitchen Department Summary...', {
      description: 'This may take a few moments',
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ADDED: Create a new report object (like DSR)
      const newReport: GeneratedReport = {
        _id: `kitchen_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: KitchenDepartmentReportType.KITCHEN_DEPARTMENT_SUMMARY,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/kitchen-dept-${Date.now()}.csv`,
      };

      // ADDED: Add the new report to local state (like DSR)
      setLocalGeneratedReports((prev) => [newReport, ...prev]);

      toast.success('Report generated successfully!', {
        description:
          'Kitchen Department Summary report has been generated and added to the table.',
      });
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsDownloading(false);
    }
  }, [filters, submittedFilters]);

  // Keep the original generate report function (for the "Generate Report" button)
  const handleGenerateReport = useCallback(async () => {
    setIsGenerating(true);

    toast.info('Generating kitchen department report...', {
      description: 'This may take a few moments',
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ADDED: Also create a report for this button
      const newReport: GeneratedReport = {
        _id: `kitchen_gen_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: KitchenDepartmentReportType.KITCHEN_DEPARTMENT_SUMMARY,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/kitchen-dept-gen-${Date.now()}.csv`,
      };

      // ADDED: Add to local state
      setLocalGeneratedReports((prev) => [newReport, ...prev]);

      toast.success('Report generated successfully!', {
        description: 'The report has been added to your generated reports list',
      });
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  }, [filters, submittedFilters]);

  const handlePrint = useCallback(() => {
    if (filteredData.length === 0) {
      toast.error('No data to print');
      return;
    }

    setIsPrinting(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups for printing');
      setIsPrinting(false);
      return;
    }

    // Format dates for display
    const formatDate = (dateString?: string) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    // Generate clean print HTML
    const printContent = `
      <div class="print-content" style="padding: 20mm; max-width: 210mm; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Header -->
        <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e5e7eb;">
          <h1 style="font-size: 24pt; font-weight: bold; color: #111827; margin-bottom: 8px;">
            Kitchen Department Performance Report
          </h1>
          <div style="font-size: 10pt; color: #6b7280; margin-bottom: 4px;">
            <div>Period: ${formatDate(filters.from)} to ${formatDate(filters.to)}</div>
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Report ID: KD-${Date.now().toString(36).toUpperCase()}</div>
          </div>
        </div>

        <!-- Data Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border: 1px solid #e5e7eb;">
                Kitchen Department
              </th>
              <th style="padding: 12px 16px; text-align: left; font-weight: 600; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border: 1px solid #e5e7eb;">
                Category
              </th>
              <th style="padding: 12px 16px; text-align: right; font-weight: 600; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border: 1px solid #e5e7eb;">
                Sold Items
              </th>
              <th style="padding: 12px 16px; text-align: right; font-weight: 600; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border: 1px solid #e5e7eb;">
                Total Amount
              </th>
              <th style="padding: 12px 16px; text-align: right; font-weight: 600; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border: 1px solid #e5e7eb;">
                Discount
              </th>
              <th style="padding: 12px 16px; text-align: right; font-weight: 600; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; color: #374151; border: 1px solid #e5e7eb;">
                Charges
              </th>
            </tr>
          </thead>
          <tbody>
            ${filteredData
              .map(
                (item) => `
              <tr>
                <td style="padding: 12px 16px; border: 1px solid #e5e7eb; font-size: 11pt;">${item.kitchenDepartment}</td>
                <td style="padding: 12px 16px; border: 1px solid #e5e7eb; font-size: 11pt;">${item.categoryName}</td>
                <td style="padding: 12px 16px; border: 1px solid #e5e7eb; font-size: 11pt; text-align: right;">${item.soldItems.toLocaleString()}</td>
                <td style="padding: 12px 16px; border: 1px solid #e5e7eb; font-size: 11pt; text-align: right;">₹${item.totalAmount.toLocaleString()}</td>
                <td style="padding: 12px 16px; border: 1px solid #e5e7eb; font-size: 11pt; text-align: right;">₹${item.itemLevelDiscount.toLocaleString()}</td>
                <td style="padding: 12px 16px; border: 1px solid #e5e7eb; font-size: 11pt; text-align: right;">₹${item.itemLevelTotalCharges.toLocaleString()}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>

      </div>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kitchen Department Report - ${new Date().toLocaleDateString()}</title>
          <style>
            @media print {
              @page {
                margin: 15mm;
                size: A4 portrait;
              }
              html, body {
                height: auto;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
              }
              body {
                background: white !important;
                color: black !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                font-size: 12px !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              * {
                box-sizing: border-box !important;
              }
            }
          </style>
        </head>
        <body>
          ${printContent}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => {
                try { window.close(); } catch (e) {}
              }, 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setIsPrinting(false);
  }, [filteredData, filters, reportTotals]);

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
        toast.error('Download URL not available');
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `kitchen-dept-report-${report._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    },
    [],
  );

  // Get columns from separate file
  const columns = useKitchenDepartmentColumns();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.kitchenDepartmentReports') ||
                'Kitchen Department Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.kitchenDepartment.description') ||
                'View and analyze kitchen department performance and generate reports'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh') || 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <KitchenDepartmentReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Generated Reports Table - CHANGED: Now uses allGeneratedReports (like DSR) */}
        <GeneratedReportsTable
          title="reports.payment.generatedReports"
          data={allGeneratedReports} // ← CHANGED: Use combined reports
          onShowDetails={handleShowReportDetails}
          onDownload={handleDownloadGeneratedReport}
          defaultCollapsed={false}
          searchPlaceholder="Search generated reports..."
          emptyMessage="No generated reports found"
        />

        {/* Performance Data Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                Kitchen Department Performance
              </CardTitle>
            </div>
            {/* Print and Download buttons - Download button now ADDS TO TABLE like DSR */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={isPrinting || filteredData.length === 0}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                {isPrinting ? 'Preparing...' : 'Print'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadReport} // ← This now adds report to table
                disabled={isDownloading}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {isDownloading
                  ? 'Generating...'
                  : t('common.download') || 'Download Report'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No kitchen department data found
              </div>
            ) : (
              <TanStackTable
                data={filteredData}
                columns={columns}
                totalCount={filteredData.length}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder="Search departments..."
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
                emptyMessage="No kitchen department data found"
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>

        {/* Download Report Options */}
        <DownloadReportOptions restaurantId={filters.restaurantIds?.[0]} />

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
