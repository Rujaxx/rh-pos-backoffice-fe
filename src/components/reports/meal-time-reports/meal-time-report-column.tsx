'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { useIntl } from 'react-intl';
import {
  GeneratedMealTimeReport,
  MealTimeReportType,
} from '@/types/meal-time-report.type';
import { ReportGenerationStatus } from '@/types/report.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';

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

interface GeneratedReportsColumnsProps {
  onShowDetails?: (report: GeneratedMealTimeReport) => void;
  onDownload?: (report: GeneratedMealTimeReport) => void;
}

export const GeneratedReportsColumns = (
  props?: GeneratedReportsColumnsProps,
): ColumnDef<GeneratedMealTimeReport>[] => {
  const { t } = useTranslation();
  const intl = useIntl();

  const localeMap: Record<string, string> = {
    en: 'en-GB',
    ar: 'ar-SA',
  };
  const localeCode = localeMap[intl.locale] || 'en-GB';

  const columns: ColumnDef<GeneratedMealTimeReport>[] = [
    {
      accessorKey: 'generateDate',
      header: t('reports.mealTime.columns.generateDate'),
      enableSorting: true,
      size: 180,
      cell: ({ row }) => {
        const date = row.original.generateDate;

        const formatReportDateTime = (dateString: string): string => {
          if (!dateString) return '-';
          const date = new Date(dateString);
          return date.toLocaleString(localeCode, {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        };

        return (
          <div className="whitespace-nowrap">
            <div className="font-medium">{formatReportDateTime(date)}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'generatedByName',
      header: t('reports.mealTime.columns.generatedBy'),
      enableSorting: false,
      size: 150,
      cell: ({ row }) => {
        const report = row.original;
        return (
          <div>
            <div className="font-medium">
              {report.generatedByName || report.generatedBy}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'reportType',
      header: t('reports.mealTime.columns.reportType'),
      enableSorting: false,
      size: 200,
      cell: ({ row }) => {
        const reportType = row.original.reportType;
        const label =
          t(`reports.mealTime.reportTypes.${reportType.toLowerCase()}`) ||
          reportType;

        return (
          <div className="max-w-[200px]">
            <div className="font-medium truncate">{label}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'generationStatus',
      header: t('reports.mealTime.columns.status'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const status = row.original.generationStatus;
        const config = REPORT_STATUS_CONFIGS[status];
        const hasError =
          status === ReportGenerationStatus.FAILED && row.original.errorMessage;

        return (
          <div className="space-y-1">
            <Badge variant={config.variant} className={config.className}>
              {t(`reports.status.${status.toLowerCase()}`)}
            </Badge>
            {hasError && (
              <div
                className="text-xs text-red-500 truncate max-w-[150px]"
                title={row.original.errorMessage}
              >
                {t('common.error')}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'reportStatus',
      header: t('reports.mealTime.columns.reportStatus'),
      size: 150,
      cell: ({ row }) => {
        const report = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => props?.onShowDetails?.(report)}
            className="flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            {t('reports.mealTime.actions.showDetails')}
          </Button>
        );
      },
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
                onClick={() => props?.onDownload?.(report)}
                className="flex items-center gap-1"
                title={t('reports.mealTime.actions.download')}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return columns;
};
