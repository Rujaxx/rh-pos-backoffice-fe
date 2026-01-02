'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  X,
  Calendar,
  Filter,
  Clock,
  User,
  FileText,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { GeneratedMealTimeReport } from '@/types/meal-time-report.type';
import { ReportGenerationStatus } from '@/types/report.type';
import { format } from 'date-fns';

interface MealTimeReportDetailsModalProps {
  report: GeneratedMealTimeReport | null;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_STATUS_CONFIGS: Record<
  ReportGenerationStatus,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
  }
> = {
  [ReportGenerationStatus.COMPLETED]: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
  },
  [ReportGenerationStatus.FAILED]: {
    variant: 'destructive',
    className: 'bg-red-500 hover:bg-red-600 text-white',
  },
  [ReportGenerationStatus.PROCESSING]: {
    variant: 'secondary',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
  },
  [ReportGenerationStatus.PENDING]: {
    variant: 'outline',
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  },
};

export function MealTimeReportDetailsModal({
  report,
  isOpen,
  onClose,
}: MealTimeReportDetailsModalProps) {
  const { t } = useTranslation();

  if (!report) return null;

  const formatDateTime = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, hh:mm a');
    } catch {
      return dateString;
    }
  };

  const formatDateOnly = (dateString: string): string => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const handleDownload = () => {
    if (!report.downloadUrl) return;

    const link = document.createElement('a');
    link.href = report.downloadUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusConfig = REPORT_STATUS_CONFIGS[report.generationStatus];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('reports.mealTime.details.title')}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t('reports.mealTime.details.generateDate')}
                  </div>
                  <div className="font-medium">
                    {formatDateTime(report.generateDate)}
                  </div>
                </div>
              </div>
              {report.reportCompleteTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t('reports.mealTime.details.completedTime')}
                    </div>
                    <div className="font-medium">
                      {formatDateTime(report.reportCompleteTime)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t('reports.mealTime.details.generatedBy')}
                  </div>
                  <div className="font-medium">
                    {report.generatedByName || report.generatedBy}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    {t('reports.mealTime.details.reportType')}
                  </div>
                  <div className="font-medium">
                    {t(
                      `reports.mealTime.reportTypes.${report.reportType.toLowerCase()}`,
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Badge
              variant={statusConfig.variant}
              className={statusConfig.className}
            >
              {t(`reports.status.${report.generationStatus.toLowerCase()}`)}
            </Badge>
            {report.generationStatus === ReportGenerationStatus.FAILED &&
              report.errorMessage && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="text-sm font-medium text-red-800">
                    {t('reports.mealTime.details.errorMessage')}
                  </div>
                  <div className="text-sm text-red-600 mt-1">
                    {report.errorMessage}
                  </div>
                </div>
              )}
          </div>

          {report.filters && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {t('reports.mealTime.details.appliedFilters')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.filters.from && report.filters.to && (
                  <>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {t('reports.mealTime.details.fromDate')}
                      </div>
                      <div className="font-medium">
                        {formatDateOnly(report.filters.from)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {t('reports.mealTime.details.toDate')}
                      </div>
                      <div className="font-medium">
                        {formatDateOnly(report.filters.to)}
                      </div>
                    </div>
                  </>
                )}
                {report.filters.restaurantIds &&
                  report.filters.restaurantIds.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-muted-foreground">
                        {t('reports.mealTime.details.restaurants')}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.filters.restaurantIds.map((id, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {report.filters.menuIds &&
                  report.filters.menuIds.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-muted-foreground">
                        {t('reports.mealTime.details.menus')}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.filters.menuIds.map((id, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                {Array.isArray(report.filters.categoryIds) &&
                  report.filters.categoryIds.length > 0 && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-muted-foreground">
                        {t('reports.mealTime.details.categories')}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {report.filters.categoryIds.map((id, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {id}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}

          {report.mealTimeIds && report.mealTimeIds.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-lg">
                {t('reports.mealTime.details.includedMealTimes')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.mealTimeIds.map((id, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {id}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
