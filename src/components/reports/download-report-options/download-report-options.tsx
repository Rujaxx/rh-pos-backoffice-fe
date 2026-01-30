'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  RefreshCw,
} from 'lucide-react';
import {
  DownloadReportItem,
  DownloadReportStatus,
} from '@/types/download-report.type';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { useDownloadReports } from '@/services/api/reports/download-reports.query';
import { toast } from 'sonner';

// Report Status Config
const DOWNLOAD_REPORT_STATUS_CONFIGS: Record<
  DownloadReportStatus,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    className: string;
    translationKey: string;
  }
> = {
  [DownloadReportStatus.COMPLETED]: {
    variant: 'default',
    className: 'bg-green-500 hover:bg-green-600 text-white',
    translationKey: 'reports.status.completed',
  },
  [DownloadReportStatus.FAILED]: {
    variant: 'destructive',
    className: 'bg-red-500 hover:bg-red-600 text-white',
    translationKey: 'reports.status.failed',
  },
  [DownloadReportStatus.PROCESSING]: {
    variant: 'secondary',
    className: 'bg-blue-500 hover:bg-blue-600 text-white',
    translationKey: 'reports.status.processing',
  },
  [DownloadReportStatus.PENDING]: {
    variant: 'outline',
    className: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    translationKey: 'reports.status.pending',
  },
};

// Helper function for formatting dates
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

interface DownloadReportOptionsProps {
  restaurantId?: string;
  autoRefreshInterval?: number; // milliseconds
  onDownload?: (report: DownloadReportItem) => void;
  onRefetchReady?: (refetch: () => void) => void;
}

export function DownloadReportOptions({
  restaurantId,
  autoRefreshInterval = 30000, // 30 seconds
  onDownload,
  onRefetchReady,
}: DownloadReportOptionsProps) {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const brandId =
    JSON.parse(localStorage.getItem('rh-pos-auth') ?? '{}')?.user?.brandIds?.[0]
      ?.id ?? null;

  const {
    data: reportsData,
    isLoading,
    refetch,
    isFetching,
  } = useDownloadReports(
    {
      brandId,
      restaurantId,
    },
    {
      enabled: !!brandId,
      refetchInterval: autoRefreshInterval,
    },
  );

  // Expose refetch function to parent component
  useEffect(() => {
    if (onRefetchReady && refetch) {
      onRefetchReady(refetch);
    }
  }, [onRefetchReady, refetch]);

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
    toast.info(t('reports.refreshingReports') || 'Refreshing reports...');
  };

  const reports = reportsData?.data || [];

  // Handle download
  const handleDownload = (report: DownloadReportItem) => {
    if (onDownload) {
      onDownload(report);
    } else {
      // Default download behavior
      if (report.downloadUrl) {
        window.open(report.downloadUrl, '_blank');
        toast.success(
          t('reports.downloadStarted') || 'Download started successfully',
        );
      } else {
        toast.error(
          t('reports.downloadUrlMissing') || 'Download URL not found',
        );
      }
    }
  };

  // Table columns definition
  const columns: ColumnDef<DownloadReportItem>[] = [
    {
      accessorKey: 'name',
      header: t('reports.columns.reportName') || 'Report Name',
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'dateRange',
      header: t('reports.columns.dateRange') || 'Date Range',
      enableSorting: false,
      cell: ({ row }) => {
        const dateRange = row.original.dateRange;
        // Check if dateRange contains a separator like " - " or " to "
        if (dateRange?.includes(' - ') || dateRange?.includes(' to ')) {
          const [from, to] = dateRange.split(/ - | to /);
          const formattedFrom = formatDateTime(from.trim());
          const formattedTo = formatDateTime(to.trim());
          return (
            <div className="text-sm text-muted-foreground">
              {formattedFrom} - {formattedTo}
            </div>
          );
        }
        return (
          <div className="text-sm text-muted-foreground">
            {dateRange || '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: t('reports.columns.status') || 'Status',
      enableSorting: true,
      cell: ({ row }) => {
        const status = row.original.status;
        const statusConfig = DOWNLOAD_REPORT_STATUS_CONFIGS[status];

        return (
          <Badge
            variant={statusConfig.variant}
            className={statusConfig.className}
          >
            {t(statusConfig.translationKey) || status}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'generatedBy',
      header: t('reports.columns.generatedBy') || 'Generated By',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.generatedBy?.name || row.original.generatedBy?.email}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('common.actions') || 'Actions',
      cell: ({ row }) => {
        const report = row.original;
        const isCompleted = report.status === DownloadReportStatus.COMPLETED;

        return (
          <div className="flex items-center gap-2">
            {isCompleted && report.downloadUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(report)}
                className="flex items-center gap-1"
                title={t('reports.downloadReport') || 'Download Report'}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {!isCompleted && (
              <span className="text-xs text-muted-foreground">
                {t('reports.notAvailable') || 'Not available'}
              </span>
            )}
          </div>
        );
      },
    },
  ];

  if (!brandId) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg">
            {t('reports.downloadOptions') || 'Download Report Options'}
          </CardTitle>
          <p className="text-xs text-red-500 text-muted-foreground">
            {t('report.validTill24hr')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="px-2 py-1 bg-muted rounded">
                {reports.length} {t('reports.available') || 'available'}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleRefresh}
            disabled={isFetching}
            title={t('common.refresh') || 'Refresh'}
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out
            ${
              isCollapsed
                ? 'max-h-0 opacity-0 translate-y-[-4px]'
                : 'max-h-[1000px] opacity-100 translate-y-0'
            }
          `}
      >
        <CardContent className="p-4 pt-0">
          {isLoading ? (
            <div className="text-center py-8">
              {t('common.loading') || 'Loading...'}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('reports.noReportsAvailable') ||
                'No reports available for download'}
            </div>
          ) : (
            <TanStackTable<DownloadReportItem>
              data={reports}
              columns={columns}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </div>
    </Card>
  );
}
