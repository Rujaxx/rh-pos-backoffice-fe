'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Layout from '@/components/common/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaperSizeButtons } from '@/components/reports/todays-reports/paper-size-buttons';
import { ReportLayout } from '@/components/reports/todays-reports/report-layout';
import { TodaysReportFilters } from '@/components/reports/report-filters/todays-report-filter';
import { useTranslation } from '@/hooks/useTranslation';
import { ReportQueryParams } from '@/types/report.type';
import { PaperSize, TodaysReportFilterState } from '@/types/todays-report.type';
import { Printer, Maximize2, Minimize2, Loader2 } from 'lucide-react';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

// Initialize with today's date
const today = new Date().toISOString().split('T')[0];

// Default filters
const defaultFilters: TodaysReportFilterState = {
  from: today,
  to: today,
  brandIds: [],
  restaurantIds: [],
  orderTypeIds: [],
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
};

export default function TodaysReportPage() {
  const { t } = useTranslation();

  const [paperSize, setPaperSize] = useState<PaperSize>('A4');
  const [expandedSections, setExpandedSections] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isFullPreview, setIsFullPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize filters
  const [filters, setFilters] =
    useState<TodaysReportFilterState>(defaultFilters);

  // Debounced filters for API calls (300ms delay)
  const debouncedFilters = useDebounce(filters, 300);

  // This effect simulates API call when filters change
  useEffect(() => {
    // Skip initial render
    if (JSON.stringify(filters) === JSON.stringify(defaultFilters)) return;

    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetchTodayReport(debouncedFilters);
        // setReportData(response.data);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log('Fetching report with filters:', debouncedFilters);
        // In real implementation, you would update state with API data here
      } catch (error) {
        toast.error('Failed to load report data');
        console.error('API Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [debouncedFilters]); // Only fetch when debounced filters change

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
        <ReportFilters
          filters={{
            from: filters.from,
            to: filters.to,
            brandIds: filters.brandIds,
            restaurantIds: filters.restaurantIds,
            orderTypeIds: filters.orderTypeIds,
            billStatus: filters.billStatus,
          }}
          onFilterChange={handleBaseFilterChange}
          onClearFilters={handleClearFilters}
        >
          <TodaysReportFilters
            filters={filters}
            onFilterChange={handleBaseFilterChange}
            expandedSections={expandedSections}
            onToggleExpandedSections={() =>
              setExpandedSections(!expandedSections)
            }
            onToggleSection={toggleSection}
            onToggleAllSections={toggleAllSections}
          />
        </ReportFilters>

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
                    filters={debouncedFilters}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Print-only view */}
      <div className="hidden print:block">
        <ReportLayout paperSize={paperSize} filters={filters} />
      </div>
    </Layout>
  );
}

function getPrintStyles(paperSize: PaperSize): string {
  const baseStyles = `
    @media print {
      @page { 
        margin: 0; 
        size: ${paperSize === 'A4' ? 'A4 landscape' : paperSize === '80MM' ? '80mm' : '58mm'};
      }
      * { 
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body { 
        background: white !important;
        color: black !important;
        font-size: ${paperSize === '58MM' ? '10px' : paperSize === '80MM' ? '11px' : '12px'} !important;
      }
    }
  `;

  return baseStyles;
}
