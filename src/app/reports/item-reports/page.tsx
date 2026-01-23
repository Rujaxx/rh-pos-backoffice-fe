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
import {
  ReportQueryParams,
  GeneratedReport,
  ReportGenerationStatus,
} from '@/types/report.type';
import { toast } from 'sonner';
import { GeneratedReportsTable } from '@/components/reports/generated-report-table';
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
import { useGeneratedReports } from '@/services/api/reports/generated-reports';
import { ReportDetailsModal } from '@/components/reports/daily-sales-reports/report-details-modal';
import { ItemReportFilter } from '@/components/reports/report-filters/item-report-filters';

// Mock sold items data
const MOCK_SOLD_ITEMS: SoldItem[] = [
  {
    _id: '1',
    itemName: 'Margherita Pizza',
    averagePrice: 12.99,
    quantity: 45,
    totalQty: 45,
    discountOnItem: 2.5,
    parentCategory: 'Main Course',
    subCategory: 'Pizza',
  },
  {
    _id: '2',
    itemName: 'Garlic Bread',
    averagePrice: 4.5,
    quantity: 89,
    totalQty: 89,
    discountOnItem: 0.5,
    parentCategory: 'Appetizers',
    subCategory: 'Breads',
  },
  {
    _id: '3',
    itemName: 'Chocolate Brownie',
    averagePrice: 6.99,
    quantity: 32,
    totalQty: 32,
    discountOnItem: 1.0,
    parentCategory: 'Desserts',
    subCategory: 'Cakes',
  },
  {
    _id: '4',
    itemName: 'Caesar Salad',
    averagePrice: 8.5,
    quantity: 27,
    totalQty: 27,
    discountOnItem: 0,
    parentCategory: 'Salads',
    subCategory: 'Vegetarian',
  },
  {
    _id: '5',
    itemName: 'Grilled Salmon',
    averagePrice: 18.99,
    quantity: 18,
    totalQty: 18,
    discountOnItem: 3.0,
    parentCategory: 'Main Course',
    subCategory: 'Seafood',
  },
];

// Mock complementary items data
const MOCK_COMPLEMENTARY_ITEMS: ComplementaryItem[] = [
  {
    _id: '1',
    itemName: 'Mineral Water',
    price: 2.0,
    quantity: 15,
    totalQty: 15,
    reason: 'Customer Complaint',
    date: '2024-01-15',
  },
  {
    _id: '2',
    itemName: 'Garlic Bread',
    price: 4.5,
    quantity: 8,
    totalQty: 8,
    reason: 'Birthday Celebration',
    date: '2024-01-14',
  },
  {
    _id: '3',
    itemName: 'Chocolate Brownie',
    price: 6.99,
    quantity: 5,
    totalQty: 5,
    reason: 'Anniversary',
    date: '2024-01-13',
  },
];

// Mock KOT items data
const MOCK_KOT_ITEMS: KotItem[] = [
  {
    _id: '1',
    kotNumber: 'KOT-001',
    itemName: 'Margherita Pizza',
    orderType: 'dine-in',
    tableNumber: 'T12',
    status: 'settled',
    username: 'john.doe',
    placedQty: 2,
    settleQty: 2,
    price: 12.99,
    date: '2024-01-15 19:30:00',
  },
  {
    _id: '2',
    kotNumber: 'KOT-002',
    itemName: 'Pasta Carbonara',
    orderType: 'takeaway',
    tableNumber: 'N/A',
    status: 'placed',
    username: 'jane.smith',
    placedQty: 1,
    settleQty: 0,
    price: 14.99,
    date: '2024-01-15 20:15:00',
  },
  {
    _id: '3',
    kotNumber: 'KOT-003',
    itemName: 'Caesar Salad',
    orderType: 'dine-in',
    tableNumber: 'T05',
    status: 'cancelled',
    username: 'bob.johnson',
    placedQty: 1,
    settleQty: 0,
    price: 8.5,
    date: '2024-01-15 18:45:00',
  },
];

// Mock bill details data
const MOCK_BILL_DETAILS: BillDetail[] = [
  {
    _id: '1',
    billNumber: 'BILL-001',
    orderId: 'ORD-12345',
    grandTotal: 45.97,
    user: 'John Doe',
    kotNumber: 'KOT-001',
    dateTime: '2024-01-15 20:45:00',
  },
  {
    _id: '2',
    billNumber: 'BILL-002',
    orderId: 'ORD-12346',
    grandTotal: 28.5,
    user: 'Jane Smith',
    kotNumber: 'KOT-002',
    dateTime: '2024-01-15 21:30:00',
  },
  {
    _id: '3',
    billNumber: 'BILL-003',
    orderId: 'ORD-12347',
    grandTotal: 67.8,
    user: 'Bob Johnson',
    kotNumber: 'KOT-003, KOT-004',
    dateTime: '2024-01-15 22:15:00',
  },
];

// Calculate consolidated data from mock sold items
const getConsolidatedData = () => {
  const totalAmount = MOCK_SOLD_ITEMS.reduce(
    (sum, item) => sum + item.averagePrice * item.quantity,
    0,
  );

  const totalItems = MOCK_SOLD_ITEMS.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return {
    totalAmount,
    totalItems,
    averagePrice: totalItems > 0 ? totalAmount / totalItems : 0,
    itemCount: MOCK_SOLD_ITEMS.length,
  };
};

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);

  // Local state to store generated reports
  const [localGeneratedReports, setLocalGeneratedReports] = useState<
    GeneratedReport[]
  >([]);

  const {
    data: generatedReports = [],
    isLoading: isLoadingReports,
    refetch,
  } = useGeneratedReports();

  // Combine API data with locally generated reports
  const allGeneratedReports = [...generatedReports, ...localGeneratedReports];

  // Get data count for each tab
  const getTabDataCount = useCallback((tabId: ItemReportTab) => {
    switch (tabId) {
      case 'sold-items':
        return MOCK_SOLD_ITEMS.length;
      case 'complimentary':
        return MOCK_COMPLEMENTARY_ITEMS.length;
      case 'kot-items':
        return MOCK_KOT_ITEMS.length;
      case 'bill-details':
        return MOCK_BILL_DETAILS.length;
      default:
        return 0;
    }
  }, []);

  // Get current tab data
  const getCurrentData = useCallback((): (
    | SoldItem
    | ComplementaryItem
    | KotItem
    | BillDetail
  )[] => {
    switch (activeTab) {
      case 'sold-items':
        return MOCK_SOLD_ITEMS;
      case 'complimentary':
        return MOCK_COMPLEMENTARY_ITEMS;
      case 'kot-items':
        return MOCK_KOT_ITEMS;
      case 'bill-details':
        return MOCK_BILL_DETAILS;
      default:
        return [];
    }
  }, [activeTab]);

  // Get current tab data
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

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch().finally(() => setIsRefreshing(false));
    toast.success(t('common.dataRefreshed'));
  }, [refetch, t]);

  // Generate Sold Items Report (Download button)
  const handleGenerateSoldReport = useCallback(async () => {
    setIsDownloading(true);
    toast.success(t('reports.itemReport.generatingSoldItems'), {
      description: t('reports.itemReport.mayTakeMoments'),
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a new report object
      const newReport: GeneratedReport = {
        _id: `sold_items_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: ItemReportType.SOLD_ITEMS_DETAILS,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/sold-items-${Date.now()}.csv`,
      };

      // Add the new report to local state
      setLocalGeneratedReports((prev) => [newReport, ...prev]);

      toast.success(t('common.reportGenerated'), {
        description: t('reports.itemReport.soldItemsAdded'),
      });

      refetch();
    } catch {
      toast.error(t('common.generateFailed'));
    } finally {
      setIsDownloading(false);
    }
  }, [filters, submittedFilters, refetch, t]);

  // Generate Consolidated Report (Consolidated button)
  const handleGenerateConsolidatedReport = useCallback(async () => {
    setIsGenerating(true);
    toast.success(t('reports.itemReport.generatingConsolidated'), {
      description: t('reports.itemReport.mayTakeMoments'),
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a consolidated report
      const newReport: GeneratedReport = {
        _id: `consolidated_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: ItemReportType.CONSOLIDATED_ITEM_REPORT,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/consolidated-${Date.now()}.csv`,
      };

      // Add to local state
      setLocalGeneratedReports((prev) => [newReport, ...prev]);

      toast.success(t('common.reportGenerated'), {
        description: t('reports.itemReport.consolidatedAdded'),
      });

      refetch();
    } catch {
      toast.error(t('common.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  }, [filters, submittedFilters, refetch, t]);

  // Generate Complementary Report (Download button)
  const handleGenerateComplementaryReport = useCallback(async () => {
    setIsDownloading(true);
    toast.success(t('reports.itemReport.generatingComplementary'), {
      description: t('reports.itemReport.mayTakeMoments'),
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a new report object
      const newReport: GeneratedReport = {
        _id: `complementary_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: ItemReportType.COMPLEMENTARY_ITEMS,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/complementary-${Date.now()}.csv`,
      };

      setLocalGeneratedReports((prev) => [newReport, ...prev]);
      toast.success(t('common.reportGenerated'), {
        description: t('reports.itemReport.complementaryAdded'),
      });

      refetch();
    } catch {
      toast.error(t('common.generateFailed'));
    } finally {
      setIsDownloading(false);
    }
  }, [filters, submittedFilters, refetch, t]);

  // Generate Bill Details Report (Bill-wise KOT Details Report button)
  const handleGenerateBillDetailsReport = useCallback(async () => {
    setIsGenerating(true);
    toast.success(t('reports.itemReport.generatingBillKOT'), {
      description: t('reports.itemReport.mayTakeMoments'),
    });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create a bill details report
      const newReport: GeneratedReport = {
        _id: `bill_details_${Date.now()}`,
        generateDate: new Date().toISOString(),
        generatedBy: 'current-user',
        generatedByName: 'Current User',
        reportType: ItemReportType.BILL_DETAILS_REPORT,
        generationStatus: ReportGenerationStatus.COMPLETED,
        filters: submittedFilters || filters,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloadUrl: `https://example.com/reports/bill-details-${Date.now()}.csv`,
      };

      setLocalGeneratedReports((prev) => [newReport, ...prev]);
      toast.success(t('common.reportGenerated'), {
        description: t('reports.itemReport.billKOTAdded'),
      });

      refetch();
    } catch {
      toast.error(t('common.generateFailed'));
    } finally {
      setIsGenerating(false);
    }
  }, [filters, submittedFilters, refetch, t]);

  // Show report details
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
        toast.error(t('common.downloadUrlNotAvailable'));
        return;
      }

      // Create download link
      const link = document.createElement('a');
      link.href = report.downloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = `item-report-${report._id}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(t('common.downloadStarted'));
    },
    [t],
  );

  // Get columns for current tab with proper typing
  const getCurrentColumns = useCallback((): ColumnDef<
    SoldItem | ComplementaryItem | KotItem | BillDetail
  >[] => {
    // Helper function to safely cast columns to the union type
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
  const consolidatedData = useMemo(() => getConsolidatedData(), []);

  // Get current columns
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
            onClick={handleRefresh}
            disabled={isRefreshing || isLoadingReports}
            className="flex items-center gap-2"
          >
            {isRefreshing ? (
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

        {/* Generated Reports Table */}
        <GeneratedReportsTable
          title="reports.generatedReports"
          data={allGeneratedReports}
          isLoading={isLoadingReports}
          onShowDetails={handleShowReportDetails}
          onDownload={handleDownloadGeneratedReport}
          defaultCollapsed={false}
          searchPlaceholder={t('common.searchGeneratedReports')}
          emptyMessage={t('common.noGeneratedReports')}
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
            {/* Total Sales Card */}
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

            {/* Average Price Card */}
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

            {/* Items Count Card */}
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
                {/* Sold Items Tab - Download and Consolidated buttons */}
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
                      disabled={isGenerating || currentData.length === 0}
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      {isGenerating
                        ? t('reports.itemReport.downloading')
                        : t('reports.itemReport.consolidatedReport')}
                    </Button>
                  </>
                )}

                {/* Complementary Tab */}
                {activeTab === 'complimentary' && (
                  <Button
                    variant="outline"
                    onClick={handleGenerateComplementaryReport}
                    disabled={isDownloading || currentData.length === 0}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isDownloading
                      ? t('reports.itemReport.downloading')
                      : t('common.download')}
                  </Button>
                )}

                {/* KOT Items Tab */}
                {activeTab === 'kot-items' && (
                  <div className="text-sm text-muted-foreground italic"></div>
                )}

                {/* Bill Details Tab - Bill-wise KOT Details Report button */}
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
            <TanStackTable
              columns={currentColumns}
              data={currentData}
              emptyMessage={t(`reports.itemReport.empty.${activeTab}`)}
              showSearch={true}
              searchPlaceholder={t('reports.itemReport.searchItems')}
              showPagination={true}
            />
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
