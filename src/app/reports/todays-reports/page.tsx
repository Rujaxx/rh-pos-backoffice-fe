'use client';

import React, { useState, useCallback } from 'react';
import Layout from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaperSizeButtons } from '@/components/reports/todays-reports/paper-size-buttons';
import { ReportLayout } from '@/components/reports/todays-reports/report-layout';
import { TodaysReportFilters } from '@/components/reports/report-filters/todays-report-filter';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import { useTranslation } from '@/hooks/useTranslation';
import {
  PaperSize,
  TDSReportFilter,
  TodaysReportFilterState,
} from '@/types/todays-report.type';
import { Printer, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ReportQueryParams } from '@/types/report.type';
import { PaginationState } from '@tanstack/react-table';
import { useGenerateTdsReprot } from '@/services/api/reports/todays-report/tds-report.mutation';

// Initialize with today's date
const today = new Date().toISOString().split('T')[0];

// Default filters
const defaultFilters: TodaysReportFilterState = {
  showSalesSummary: true,
  showZReportSummary: true,
  showOrderTypeSummary: true,
  showPaymentTypeSummary: true,
  showDiscountSummary: true,
  showExpenseSummary: true,
  showBillSummary: true,
  showDeliveryBoySummary: true,
  showWaiterSummary: true,
  showProductGroupSummary: true,
  showKitchenDepartmentSummary: true,
  showCategorySummary: true,
  showSoldItemsSummary: true,
  showCancelItemsSummary: true,
  showWalletSummary: true,
  showDuePaymentReceivedSummary: true,
  showDuePaymentReceivableSummary: true,
  showPaymentVarianceSummary: true,
  showCurrencyDenominationsSummary: true,
  showOrderSourceSummary: true,
  from: today,
  to: today,
  brandIds: [],
  restaurantIds: [],
  orderTypeIds: [],
};

export default function TodaysReportPage() {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [expandedSections, setExpandedSections] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isFullPreview, setIsFullPreview] = useState(false);

  const createTdsMutation = useGenerateTdsReprot();
  const isLoading = createTdsMutation.isPending;
  const reportData = createTdsMutation.data?.data?.data;

  // Initialize filters
  const [filters, setFilters] =
    useState<TodaysReportFilterState>(defaultFilters);

  const handleGenerateReport = async () => {
    try {
      const body: TDSReportFilter = {
        sales: filters.showSalesSummary,
        z_report: filters.showZReportSummary,
        order_type: filters.showOrderTypeSummary,
        payment_type: filters.showPaymentTypeSummary,
        discount: filters.showDiscountSummary,
        expense: filters.showExpenseSummary,
        bill: filters.showBillSummary,
        delivery_boy: filters.showDeliveryBoySummary,
        waiter: filters.showWaiterSummary,
        tax_product_group: filters.showProductGroupSummary,
        kitchen_department: filters.showKitchenDepartmentSummary,
        category: filters.showCategorySummary,
        sold_items: filters.showSoldItemsSummary,
        cancel_items: filters.showCancelItemsSummary,
        wallet: filters.showWalletSummary,
        due_payment_received: filters.showDuePaymentReceivedSummary,
        due_payment_receivable: filters.showDuePaymentReceivableSummary,
        payment_variance: filters.showPaymentVarianceSummary,
        currency_denominations: filters.showCurrencyDenominationsSummary,
        order_source: filters.showOrderSourceSummary,
        from: new Date(filters.from || today).toISOString(),
        to: (() => {
          const toDate = new Date(filters.to || today);
          toDate.setUTCHours(23, 59, 59, 999);
          return toDate.toISOString();
        })(),
        brandIds: filters.brandIds,
        restaurantIds: filters.restaurantIds,
        orderTypeIds: filters.orderTypeIds,
      };

      await createTdsMutation.mutateAsync({
        body,
      });
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const handleBaseFilterChange = useCallback(
    (newFilters: ReportQueryParams) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters);
    toast.success('Filters cleared');
  }, []);

  const toggleSection = useCallback((sectionKey: string) => {
    setFilters((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey as keyof TodaysReportFilterState],
    }));
  }, []);

  const toggleAllSections = useCallback(
    (enabled: boolean) => {
      const updatedFilters = { ...filters };
      const sectionKeys = [
        'showSalesSummary',
        'showZReportSummary',
        'showOrderTypeSummary',
        'showPaymentTypeSummary',
        'showDiscountSummary',
        'showExpenseSummary',
        'showBillSummary',
        'showDeliveryBoySummary',
        'showWaiterSummary',
        'showProductGroupSummary',
        'showKitchenDepartmentSummary',
        'showCategorySummary',
        'showSoldItemsSummary',
        'showCancelItemsSummary',
        'showWalletSummary',
        'showDuePaymentReceivedSummary',
        'showDuePaymentReceivableSummary',
        'showPaymentVarianceSummary',
        'showCurrencyDenominationsSummary',
        'showOrderSourceSummary',
      ];

      sectionKeys.forEach((key) => {
        updatedFilters[key as keyof TodaysReportFilterState] = enabled;
      });

      setFilters(updatedFilters);
      toast.success(enabled ? 'All sections enabled' : 'All sections disabled');
    },
    [filters],
  );

  const handlePrint = useCallback(() => {
    setIsPrinting(true);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups for printing');
      setIsPrinting(false);
      return;
    }

    const printContent =
      document.getElementById('report-print-content')?.innerHTML || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Today's Report - ${new Date().toLocaleDateString()}</title>
          <style>
            ${getPrintStyles(paperSize)}
            body {
              font-family: ${paperSize === 'A4' ? 'system-ui' : 'monospace'};
              margin: 0;
              padding: 0;
            }
            .print-content {
              max-width: ${paperSize === 'A4' ? '210mm' : paperSize === '80MM' ? '80mm' : '58mm'};
              margin: 0 auto;
              padding: ${paperSize === 'A4' ? '20mm' : paperSize === '80MM' ? '5mm' : '2mm'};
            }
          </style>
        </head>
        <body>
          <div class="print-content">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    setIsPrinting(false);
  }, [paperSize]);

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-4 md:p-8 print:hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t('navigation.tdsReports') || "Today's Report"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating report...
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setIsFullPreview(!isFullPreview)}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isFullPreview ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              {isFullPreview ? 'Compact View' : 'Full Preview'}
            </Button>
          </div>
        </div>

        {/* FILTERS SECTION */}
        <TodaysReportFilters
          filters={filters}
          onFilterChange={handleBaseFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleGenerateReport}
          expandedSections={expandedSections}
          onToggleExpandedSections={() =>
            setExpandedSections(!expandedSections)
          }
          onToggleSection={toggleSection}
          onToggleAllSections={toggleAllSections}
        />

        {/* PAPER SIZE SELECTION + REPORT PREVIEW */}
        <div
          className={cn(
            'grid gap-6',
            isFullPreview ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3',
          )}
        >
          {/* Paper Size Buttons - Left Column */}
          <div className={cn('space-y-6', isFullPreview && 'hidden')}>
            <PaperSizeButtons
              activePaperSize={paperSize}
              onPaperSizeChange={setPaperSize}
            />

            {/* Print Button */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col space-y-4">
                  <Button
                    onClick={handlePrint}
                    disabled={isPrinting || isLoading}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    {isPrinting ? 'Preparing...' : 'Print Report'}
                  </Button>

                  <div className="text-xs text-muted-foreground">
                    Print using the selected paper size:{' '}
                    <strong>{paperSize}</strong>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Stats */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="text-sm font-medium">Report Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paper Size</span>
                    <span className="font-medium">{paperSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date Range</span>
                    <span className="font-medium">
                      {filters.from} to {filters.to}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span
                      className={cn(
                        'font-medium',
                        isLoading ? 'text-yellow-600' : 'text-green-600',
                      )}
                    >
                      {isLoading ? 'Updating...' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span className="font-medium">
                      {new Date().toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Preview - Right Column */}
          <div className={cn('lg:col-span-2', isFullPreview && 'col-span-1')}>
            <Card className="border shadow-sm overflow-hidden h-full bg-white dark:bg-gray-900">
              <div className="p-2 bg-gray-100 dark:bg-gray-800 border-b text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 dark:text-gray-100">
                    Report Preview
                  </span>
                  <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    {paperSize}
                  </span>
                  {isLoading && (
                    <Loader2 className="h-3 w-3 animate-spin text-yellow-500 dark:text-yellow-400" />
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {isLoading ? 'Updating preview...' : 'Live preview'}
                </div>
              </div>
              <div
                className={cn(
                  'p-2 overflow-auto relative',
                  'max-h-[calc(100vh-150px)]', // Increased height
                  isLoading && 'opacity-70',
                  'bg-white dark:bg-gray-900',
                )}
              >
                {isLoading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Loading report data...
                      </p>
                    </div>
                  </div>
                )}
                <div
                  id="report-print-content"
                  className="bg-zinc-200 dark:bg-gray-900"
                >
                  <ReportLayout
                    paperSize={paperSize}
                    filters={filters}
                    data={reportData}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Download Report Options */}
        <DownloadReportOptions restaurantId={filters.restaurantIds?.[0]} />
      </div>

      {/* Print-only view */}
      <div className="hidden print:block">
        <ReportLayout
          paperSize={paperSize}
          filters={filters}
          data={reportData}
        />
      </div>
    </Layout>
  );
}

function getPrintStyles(paperSize: PaperSize): string {
  const isThermal = paperSize === '80MM' || paperSize === '58MM';

  const baseStyles = `
    @media print {
      @page {
        margin: ${isThermal ? '0' : '5mm'};
        size: ${paperSize === 'A4' ? 'A4 portrait' : 'auto'};
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
        font-family: ${paperSize === 'A4' ? 'system-ui, -apple-system, sans-serif' : 'monospace'} !important;
        font-size: ${paperSize === '58MM' ? '10px' : paperSize === '80MM' ? '11px' : '12px'} !important;
        ${isThermal ? 'overflow: visible !important;' : ''}
      }
      /* Override any max-width from tailwind classes during print */
      .print-container {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-content {
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        ${isThermal ? 'height: auto !important;' : ''}
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        box-sizing: border-box !important;
        ${isThermal ? 'page-break-inside: avoid !important;' : ''}
        ${isThermal ? 'break-inside: avoid !important;' : ''}
      }
    }
    /* Specific width enforcement for thermal in the print window body */
    ${
      isThermal
        ? `
      body {
        width: ${paperSize === '80MM' ? '80mm' : '58mm'} !important;
      }
    `
        : ''
    }
  `;

  return baseStyles;
}
