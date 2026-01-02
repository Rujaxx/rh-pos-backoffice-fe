'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  GeneratedReport,
  ReportGenerationStatus,
  DailyReportType,
  HourlyReportType,
} from '@/types/report.type';
import { Calendar, Clock, Mail, User, Building2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ReportDetailsModalProps {
  report: GeneratedReport | null;
  isOpen: boolean;
  onClose: () => void;
}

// Unified mapping for all report types - handles both daily and hourly reports
// Using string type for keys to avoid duplicate enum value conflicts
const REPORT_TYPE_DISPLAY_NAMES: Record<string, string> = {
  // Daily Reports - full mapping
  [DailyReportType.DSR_BILL_WISE]: 'DSR Bill Wise Report',
  [DailyReportType.BILL_WISE_LIQUOR_SALE]: 'Bill Wise Liquor Sale Report',
  [DailyReportType.B2B_SALES]: 'B2B Sales Report',
  [DailyReportType.BILL_NO_SERIES]: 'Bill No. of Series',
  [DailyReportType.DSR_ITEM_WISE]: 'DSR Item Wise Report',
  [DailyReportType.DSR_BILL_MONTH_WISE]: 'DSR Bill Month Wise Report',
  [DailyReportType.DSR_DAY_WISE]: 'DSR Day Wise Report',
  [DailyReportType.DSR_DAY_WISE_SUMMARY]: 'DSR Day Wise Summary Report',
  [DailyReportType.SIMPLIFIED_DAY_WISE_DSR]: 'Simplified Day Wise DSR Report',
  [DailyReportType.MALL_REPORT]: 'Mall Report',
  [DailyReportType.TAX_SUBMISSION]: 'Tax Submission Report',
  [DailyReportType.TAX_SUBMISSION_PAYMENT]: 'Tax Submission Payment Report',
  [DailyReportType.ORDER_TYPE_DAY_WISE]: 'Order Type Day Wise Report',
  [DailyReportType.MONTH_WISE_SALES]: 'Month Wise Sales Report',

  // Note: HourlyReportType values that overlap with DailyReportType
  // will use the daily display names unless explicitly overridden
};

// Override mapping for hourly reports (when we want different display names)
const HOURLY_REPORT_OVERRIDES: Record<string, string> = {
  // These override the daily display names for hourly reports
  [HourlyReportType.DAY_WISE]: 'Hourly Day Wise Report',
  [HourlyReportType.DAY_WISE_SUMMARY]: 'Hourly Day Wise Summary Report',
  [HourlyReportType.MONTH_WISE]: 'Hourly Month Wise Sales Report',
};

// Report status configurations
const REPORT_STATUS_CONFIGS: Record<
  ReportGenerationStatus,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
    label: string;
  }
> = {
  [ReportGenerationStatus.COMPLETED]: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
    label: 'Completed',
  },
  [ReportGenerationStatus.FAILED]: {
    variant: 'destructive',
    className: 'bg-red-500 hover:bg-red-600 text-white',
    label: 'Failed',
  },
  [ReportGenerationStatus.PROCESSING]: {
    variant: 'secondary',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
    label: 'Processing',
  },
  [ReportGenerationStatus.PENDING]: {
    variant: 'outline',
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    label: 'Pending',
  },
};

// Helper functions
const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '-';
  }
};

const formatDateTime = (dateString?: string): string => {
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

// Type guard to check if a string is a valid HourlyReportType
const isHourlyReportType = (value: string): boolean => {
  const hourlyValues = Object.values(HourlyReportType) as string[];
  return hourlyValues.includes(value);
};

export function ReportDetailsModal({
  report,
  isOpen,
  onClose,
}: ReportDetailsModalProps) {
  const { t } = useTranslation();

  const modalData = useMemo(() => {
    if (!report) return null;

    // Determine if it's an hourly report by checking the string value
    const isHourlyReport = isHourlyReportType(report.reportType);

    // Get report type display name with hourly overrides
    const reportTypeDisplay = isHourlyReport
      ? HOURLY_REPORT_OVERRIDES[report.reportType] ||
        REPORT_TYPE_DISPLAY_NAMES[report.reportType] ||
        report.reportType
      : REPORT_TYPE_DISPLAY_NAMES[report.reportType] || report.reportType;

    // Extract date range from filters
    const fromDate = report.filters?.from;
    const toDate = report.filters?.to;
    const dateRange =
      fromDate && toDate
        ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
        : formatDate(fromDate) || '-';

    // Get user email (in production, this should come from user context or API)
    const userEmail = 'user@example.com';

    // Get restaurant names from filters
    const restaurants =
      report.filters?.restaurantIds?.map((id) => `Restaurant ${id}`) || [];

    return {
      isHourlyReport,
      reportTypeDisplay,
      dateRange,
      userEmail,
      restaurants,
      report,
    };
  }, [report]);

  if (!report || !modalData) return null;

  const {
    isHourlyReport,
    reportTypeDisplay,
    dateRange,
    userEmail,
    restaurants,
    report: currentReport,
  } = modalData;

  const getStatusBadge = (status: ReportGenerationStatus) => {
    const config = REPORT_STATUS_CONFIGS[status];
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const modalTitle = isHourlyReport
    ? t('reports.hourly.reportDetails')
    : t('reports.dailySales.reportDetails');

  const reportTypeLabel = isHourlyReport
    ? t('reports.hourly.reportType')
    : t('reports.dailySales.reportType');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{modalTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {reportTypeLabel}
            </h3>
            <p className="text-base font-semibold" data-testid="report-type">
              {reportTypeDisplay}
            </p>
          </div>

          <Separator />

          {/* Report Generated Between Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('reports.details.dateRange')}
              </h3>
              <p className="text-base truncate" title={dateRange}>
                {dateRange}
              </p>
            </div>
          </div>

          {/* Report Generation Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('reports.details.generationTime')}
              </h3>
              <p className="text-base">
                {formatDateTime(
                  currentReport.reportCompleteTime ||
                    currentReport.generateDate,
                )}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('reports.details.email')}
              </h3>
              <p className="text-base truncate" title={userEmail}>
                {userEmail}
              </p>
            </div>
          </div>

          {/* Generated By */}
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {t('reports.details.generatedBy')}
              </h3>
              <p
                className="text-base truncate"
                title={
                  currentReport.generatedByName || currentReport.generatedBy
                }
              >
                {currentReport.generatedByName || currentReport.generatedBy}
              </p>
            </div>
          </div>

          {/* Generation Status */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t('reports.details.status')}
            </h3>
            <div data-testid="report-status">
              {getStatusBadge(currentReport.generationStatus)}
            </div>
          </div>

          {/* Error Message (if failed) */}
          {currentReport.generationStatus === ReportGenerationStatus.FAILED &&
            currentReport.errorMessage && (
              <>
                <Separator />
                <div
                  className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"
                  role="alert"
                  aria-live="polite"
                >
                  <h3 className="text-sm font-medium text-destructive mb-1">
                    {t('reports.details.errorMessage')}
                  </h3>
                  <p className="text-sm text-destructive/90 wrap-break-word">
                    {currentReport.errorMessage}
                  </p>
                </div>
              </>
            )}

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {t('reports.details.restaurants')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurants.map((restaurant, index) => (
                      <Badge
                        key={`${restaurant}-${index}`}
                        variant="secondary"
                        className="text-sm max-w-full truncate"
                        title={restaurant}
                      >
                        {restaurant}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Additional Filters Info */}
          {currentReport.filters && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {t('reports.details.appliedFilters')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {currentReport.filters.b2bInvoices !== undefined && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {t('reports.filters.b2bInvoices')}:{' '}
                        {currentReport.filters.b2bInvoices
                          ? t('common.yes')
                          : t('common.no')}
                      </Badge>
                    </div>
                  )}
                  {currentReport.filters.liquorExemptedSales !== undefined && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {t('reports.filters.liquorExempted')}:{' '}
                        {currentReport.filters.liquorExemptedSales
                          ? t('common.yes')
                          : t('common.no')}
                      </Badge>
                    </div>
                  )}
                  {currentReport.filters.paymentMethods &&
                    currentReport.filters.paymentMethods.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {t('reports.filters.paymentMethods')}:{' '}
                          {currentReport.filters.paymentMethods.length}
                        </Badge>
                      </div>
                    )}
                  {currentReport.filters.orderTypeIds &&
                    currentReport.filters.orderTypeIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {t('reports.filters.orderTypes')}:{' '}
                          {currentReport.filters.orderTypeIds.length}
                        </Badge>
                      </div>
                    )}
                  {currentReport.filters.restaurantIds &&
                    currentReport.filters.restaurantIds.length > 0 && (
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <Badge variant="outline" className="text-xs">
                          {t('reports.filters.restaurants')}:{' '}
                          {currentReport.filters.restaurantIds.length}
                        </Badge>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
