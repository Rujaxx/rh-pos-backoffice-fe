'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import {
  Download,
  RefreshCw,
  FileText,
  DollarSign,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { ReportQueryParams, GeneratedReport } from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  ItemReportTab,
  ItemReportType,
  SoldItem,
  ComplementaryItem,
  KotItem,
  BillDetail,
} from '@/types/item-report.type';
import { ITEM_REPORT_TABS } from '@/components/reports/item-reports/constants';
import { createSoldItemsColumns } from '@/components/reports/item-reports/sold-items-cols';
import { createComplementaryColumns } from '@/components/reports/item-reports/complementary-cols';
import { createKotItemsColumns } from '@/components/reports/item-reports/kot-items-cols';
import { createBillDetailsColumns } from '@/components/reports/item-reports/bill-details-cols';

import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { ItemReportFilter } from '@/components/reports/report-filters/item-report-filters';
import { DownloadReportOptions } from '@/components/reports/download-report-options';
import {
  useSoldItemReport,
  soldItemReportService,
} from '@/services/api/reports/sold-item-report.query';
import { SoldItemsFilterParams } from '@/types/item-report.type';

export default function ItemReportPage() {
  const { t } = useTranslation();

  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  const [activeTab, setActiveTab] = useState<ItemReportTab>('sold-items');
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ref for updating download options
  const optionsRefetchRef = React.useRef<(() => void) | null>(null);

  // Fetch Sold Item Report Data
  const {
    data: soldItemReportData,
    isLoading: isLoadingReports,
    refetch: refetchSoldItems,
    isRefetching: isRefetchingSoldItems,
  } = useSoldItemReport(submittedFilters as SoldItemsFilterParams, {
    enabled: !!submittedFilters && activeTab === 'sold-items',
  });

  const soldItemsData = (soldItemReportData?.data?.report as SoldItem[]) || [];

  // Refresh handler
  const handleRefresh = useCallback(() => {
    if (activeTab === 'sold-items' && submittedFilters) {
      refetchSoldItems();
      toast.success(t('common.refreshing'));
    }
  }, [activeTab, submittedFilters, refetchSoldItems, t]);

  // Generate Sold Items Report (Download button)
  const handleGenerateSoldReport = useCallback(async () => {
    if (!submittedFilters) return;

    setIsDownloading(true);
    toast.success(t('reports.itemReport.generatingSoldItems'), {
      description: t('reports.itemReport.mayTakeMoments'),
    });

    try {
      await soldItemReportService.downloadReport(
        submittedFilters as SoldItemsFilterParams,
      );

      // Refresh the download list
      if (optionsRefetchRef.current) {
        optionsRefetchRef.current();
      }
    } catch {
      toast.error(t('common.generateFailed'));
    } finally {
      setIsDownloading(false);
    }
  }, [submittedFilters, t]);

  const handleGenerateConsolidatedReport = useCallback(async () => {
    toast.info('Coming soon');
  }, []);

  const handleGenerateComplementaryReport = useCallback(async () => {
    toast.info('Coming soon');
  }, []);

  const handleGenerateBillDetailsReport = useCallback(async () => {
    toast.info('Coming soon');
  }, []);

  // Get data count for each tab
  const getTabDataCount = useCallback(
    (tabId: ItemReportTab) => {
      switch (tabId) {
        case 'sold-items':
          return soldItemsData.length;
        case 'complimentary':
          return 0; // Temporary 0 until API is integrated
        case 'kot-items':
          return 0;
        case 'bill-details':
          return 0;
        default:
          return 0;
      }
    },
    [soldItemsData],
  );

  // Get current tab data
  const getCurrentData = useCallback((): (
    | SoldItem
    | ComplementaryItem
    | KotItem
    | BillDetail
  )[] => {
    switch (activeTab) {
      case 'sold-items':
        return soldItemsData;
      case 'complimentary':
        return [];
      case 'kot-items':
        return [];
      case 'bill-details':
        return [];
      default:
        return [];
    }
  }, [activeTab, soldItemsData]);

  const currentData = getCurrentData();

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    const today = new Date();
    setFilters({
      from: today.toISOString(),
      to: today.toISOString(),
    });
    setSubmittedFilters(null);
    toast.success(t('common.filtersCleared'));
  }, [t]);

  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
    toast.info(t('reports.itemReport.fetchingData'));
  }, [filters, t]);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedReport(null);
  }, []);

  // Get columns for current tab with proper typing
  const getCurrentColumns = useCallback((): ColumnDef<
    SoldItem | ComplementaryItem | KotItem | BillDetail
  >[] => {
    const castColumns = <T,>(
      columns: ColumnDef<T>[],
    ): ColumnDef<SoldItem | ComplementaryItem | KotItem | BillDetail>[] =>
      columns as unknown as ColumnDef<
        SoldItem | ComplementaryItem | KotItem | BillDetail
      >[];

    switch (activeTab) {
      case 'sold-items':
        return castColumns<SoldItem>(createSoldItemsColumns());
      case 'complimentary':
        return castColumns<ComplementaryItem>(createComplementaryColumns());
      case 'kot-items':
        return castColumns<KotItem>(createKotItemsColumns());
      case 'bill-details':
        return castColumns<BillDetail>(createBillDetailsColumns());
      default:
        return [];
    }
  }, [activeTab]);

  // Consolidated data for sold items
  const consolidatedData = useMemo(() => {
    if (activeTab === 'sold-items' && soldItemReportData?.data) {
      return {
        totalAmount: soldItemReportData.data.totalRevenue,
        totalItems: soldItemReportData.data.totalItemSold,
        averagePrice: soldItemReportData.data.averageItemPrice,
        itemCount: soldItemsData.length,
      };
    }
    return {
      totalAmount: 0,
      totalItems: 0,
      averagePrice: 0,
      itemCount: 0,
    };
  }, [activeTab, soldItemReportData, soldItemsData]);

  const currentColumns = getCurrentColumns();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.itemReports')}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.itemReport.description')}
            </p>
          </div>

          <Button
            variant="outline"
            disabled={isRefetchingSoldItems || isLoadingReports}
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            {isRefetchingSoldItems ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {t('common.refresh')}
          </Button>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <ItemReportFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeTab={activeTab}
          />
        </ReportFilters>

        {/* Download Report Options */}
        <DownloadReportOptions
          restaurantId={filters.restaurantIds?.[0]}
          onRefetchReady={(refetch) => {
            optionsRefetchRef.current = refetch;
          }}
        />

        {/* Tabs with count on ALL tabs */}
        <div className="border-b">
          <div className="flex space-x-8">
            {ITEM_REPORT_TABS.map((tab) => {
              const tabCount = getTabDataCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'pb-3 px-1 border-b-2 text-sm font-medium transition-colors relative flex items-center gap-2',
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {t(tab.label)}
                  {tabCount > 0 && (
                    <Badge
                      variant={activeTab === tab.id ? 'default' : 'secondary'}
                      className="ml-2 h-5 px-1.5 text-xs"
                    >
                      {tabCount}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary Cards Section */}
        {activeTab === 'sold-items' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {t('reports.itemReport.totalSales')}
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ${consolidatedData.totalAmount.toFixed(2)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="flex-1">
                      {t('reports.itemReport.totalItems')}:
                    </span>
                    <span className="font-medium">
                      {consolidatedData.totalItems}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {t('reports.itemReport.averagePrice')}
                  </CardTitle>
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    ${consolidatedData.averagePrice.toFixed(2)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="flex-1">
                      {t('reports.itemReport.totalItems')}:
                    </span>
                    <span className="font-medium">
                      {consolidatedData.itemCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {t('reports.itemReport.itemsCount')}
                  </CardTitle>
                  <FileText className="h-5 w-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {consolidatedData.itemCount}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="flex-1">
                      {t('reports.itemReport.totalQuantity')}:
                    </span>
                    <span className="font-medium">
                      {consolidatedData.totalItems}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Table for Current Tab */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {t(
                  ITEM_REPORT_TABS.find((tab) => tab.id === activeTab)?.label ||
                    '',
                )}
              </CardTitle>

              {/* Tab-specific action buttons */}
              <div className="flex items-center gap-2">
                {activeTab === 'sold-items' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleGenerateSoldReport}
                      disabled={isDownloading || currentData.length === 0}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      {isDownloading
                        ? t('reports.itemReport.downloading')
                        : t('common.download')}
                    </Button>
                    <Button
                      onClick={handleGenerateConsolidatedReport}
                      disabled={
                        isGenerating ||
                        currentData.length === 0 ||
                        !submittedFilters
                      }
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {isGenerating
                        ? t('reports.itemReport.downloading')
                        : t('reports.itemReport.consolidatedReport')}
                    </Button>
                  </>
                )}

                {activeTab === 'complimentary' && (
                  <Button
                    variant="outline"
                    disabled={currentData.length === 0}
                    className="flex items-center gap-2"
                    onClick={handleGenerateComplementaryReport}
                  >
                    <Download className="h-4 w-4" />
                    {t('common.download')}
                  </Button>
                )}

                {/* Bill Details Tab */}
                {activeTab === 'bill-details' && (
                  <Button
                    variant="outline"
                    onClick={handleGenerateBillDetailsReport}
                    disabled={isGenerating || currentData.length === 0}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {isGenerating
                      ? t('reports.itemReport.downloading')
                      : t('reports.itemReport.billKotDetails')}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'sold-items' ? (
              <TanStackTable
                columns={currentColumns}
                data={currentData}
                emptyMessage={t(`reports.itemReport.empty.${activeTab}`)}
                showSearch={true}
                searchPlaceholder={t('reports.itemReport.searchItems')}
                showPagination={activeTab !== 'sold-items'}
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <div className="text-center">
                  <p className="text-lg font-medium">Coming Soon</p>
                  <p className="text-sm">
                    {t(
                      ITEM_REPORT_TABS.find((tab) => tab.id === activeTab)
                        ?.label || '',
                    )}{' '}
                    report is under development
                  </p>
                </div>
              </div>
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
