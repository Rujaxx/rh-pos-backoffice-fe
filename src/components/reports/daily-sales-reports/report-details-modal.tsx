'use client';

import React from 'react';
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
} from '@/types/report.type';
import { Calendar, Clock, Mail, User, Building2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ReportDetailsModalProps {
  report: GeneratedReport | null;
  isOpen: boolean;
  onClose: () => void;
}

const reportTypeLabels: Record<DailyReportType, string> = {
  [DailyReportType.DSR_BILL_WISE]: 'DSR Bill Wise Report',
  [DailyReportType.BILL_WISE_LIQUOR_SALE]: 'Bill Wise Liquor Sale Report',
  [DailyReportType.B2B_SALES]: 'B2B Sales Report',
  [DailyReportType.BILL_NO_SERIES]: 'Bill No. of Series',
  [DailyReportType.DSR_ITEM_WISE]: 'DSR Item Wise',
  [DailyReportType.DSR_BILL_MONTH_WISE]: 'DSR Bill Month Wise Report',
  [DailyReportType.DSR_DAY_WISE]: 'DSR Day Wise Report',
  [DailyReportType.DSR_DAY_WISE_SUMMARY]: 'DSR Day Wise Summary Report',
  [DailyReportType.SIMPLIFIED_DAY_WISE_DSR]: 'Simplified Day Wise DSR Report',
  [DailyReportType.MALL_REPORT]: 'Mall Report',
  [DailyReportType.TAX_SUBMISSION]: 'Tax Submission Report',
  [DailyReportType.TAX_SUBMISSION_PAYMENT]: 'Tax Submission Payment Report',
  [DailyReportType.ORDER_TYPE_DAY_WISE]: 'Order Type Day Wise Report',
  [DailyReportType.MONTH_WISE_SALES]: 'Month Wise Sales',
};

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function ReportDetailsModal({
  report,
  isOpen,
  onClose,
}: ReportDetailsModalProps) {
  const { t } = useTranslation();
  if (!report) return null;

  // Get status badge styling
  const getStatusBadge = (status: ReportGenerationStatus) => {
    let variant: 'default' | 'secondary' | 'destructive' | 'outline' =
      'default';
    let className = '';

    switch (status) {
      case ReportGenerationStatus.COMPLETED:
        variant = 'default';
        className = 'bg-green-500 hover:bg-green-600 text-white';
        break;
      case ReportGenerationStatus.FAILED:
        variant = 'destructive';
        break;
      case ReportGenerationStatus.PROCESSING:
        variant = 'secondary';
        className = 'bg-blue-500 hover:bg-blue-600 text-white';
        break;
      case ReportGenerationStatus.PENDING:
        variant = 'outline';
        break;
    }

    return (
      <Badge variant={variant} className={className}>
        {status}
      </Badge>
    );
  };

  // Extract date range from filters
  const fromDate = report.filters?.from;
  const toDate = report.filters?.to;
  const dateRange =
    fromDate && toDate
      ? `${formatDate(fromDate)} - ${formatDate(toDate)}`
      : fromDate
        ? formatDate(fromDate)
        : '-';

  // Mock email - replace with actual data
  const userEmail = 'user@example.com'; // This should come from the user context or API

  // Mock restaurants - replace with actual data from filters
  const restaurants =
    report.filters?.restaurantIds?.map((id) => `Restaurant ${id}`) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t('reports.dailySales.reportDetails')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Type */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {t('reports.dailySales.reportType')}
            </h3>
            <p className="text-base font-semibold">
              {reportTypeLabels[report.reportType] || report.reportType}
            </p>
          </div>

          <Separator />

          {/* Report Generated Between Date */}
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Report Generated Between Date
              </h3>
              <p className="text-base">{dateRange}</p>
            </div>
          </div>

          {/* Report Generation Time */}
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Report Generation Time
              </h3>
              <p className="text-base">
                {formatDateTime(
                  report.reportCompleteTime || report.generateDate,
                )}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Email
              </h3>
              <p className="text-base">{userEmail}</p>
            </div>
          </div>

          {/* Generated By */}
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Generated By
              </h3>
              <p className="text-base">
                {report.generatedByName || report.generatedBy}
              </p>
            </div>
          </div>

          {/* Generation Status */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Generation Status
            </h3>
            <div>{getStatusBadge(report.generationStatus)}</div>
          </div>

          {/* Error Message (if failed) */}
          {report.generationStatus === ReportGenerationStatus.FAILED &&
            report.errorMessage && (
              <>
                <Separator />
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-destructive mb-1">
                    Error Message
                  </h3>
                  <p className="text-sm text-destructive/90">
                    {report.errorMessage}
                  </p>
                </div>
              </>
            )}

          {/* Restaurants */}
          {restaurants.length > 0 && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    These Restaurants Generated Reports
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {restaurants.map((restaurant, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
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
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Applied Filters
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {report.filters?.b2bInvoices && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    B2B Invoices
                  </Badge>
                </div>
              )}
              {report.filters?.liquorExemptedSales && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Liquor Exempted Sales
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
