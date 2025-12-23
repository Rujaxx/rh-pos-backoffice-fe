'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent } from '@/components/ui/card';
import {
  useReports,
  useUpdateBill,
  useDeleteBill,
} from '@/services/api/reports';
import { ReportQueryParams } from '@/types/report.type';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  XCircle,
  FileText,
} from 'lucide-react';
import { ReportFilters } from '@/components/reports/report-filters';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { useEditableBillsColumns } from '@/components/reports/editable-bill-columns';
import { BillDetailsModal } from '@/components/reports/bill-details-modal';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Bill } from '@/types/bill.type';
import { toast } from 'sonner';

export default function SalesReportsPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ReportQueryParams>({});
  const [loadingBills, setLoadingBills] = useState<Set<string>>(new Set());

  // Modal state
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Build query params
  const queryParams: ReportQueryParams = {
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    term: searchTerm || undefined,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  };

  // Fetch reports
  const { data: reportsData, isLoading } = useReports(queryParams);
  const reportData = reportsData?.data;
  const bills = reportData?.bills || [];
  const totalCount = reportData?.meta?.total || 0;

  const updateBillMutation = useUpdateBill();
  const deleteBillMutation = useDeleteBill();

  // Filter handlers
  const handleFilterChange = (newFilters: ReportQueryParams) => {
    setFilters(newFilters);
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize }); // Reset to first page
  };

  const handleClearFilters = () => {
    setFilters({});
    setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleUpdateBill = async (billId: string, newBill: Partial<Bill>) => {
    setLoadingBills((prev) => new Set(prev).add(billId));
    try {
      await updateBillMutation.mutateAsync({
        billId,
        data: newBill,
      });
      toast.success('Bill updated successfully');
    } catch (error) {
      console.error('Failed to update bill:', error);
      toast.error('Failed to update bill');
    } finally {
      setLoadingBills((prev) => {
        const next = new Set(prev);
        next.delete(billId);
        return next;
      });
    }
  };

  // Handle view details
  const handleViewDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleDeleteBill = async (billId: string) => {
    setLoadingBills((prev) => new Set(prev).add(billId));
    try {
      await deleteBillMutation.mutateAsync({
        billId,
      });
      toast.success('Bill deleted successfully');
    } catch (error) {
      console.error('Failed to delete bill:', error);
      toast.error('Failed to delete bill');
    } finally {
      setLoadingBills((prev) => {
        const next = new Set(prev);
        next.delete(billId);
        return next;
      });
    }
  };

  const columns = useEditableBillsColumns({
    onBillUpdate: handleUpdateBill,
    onBillDelete: handleDeleteBill,
    onViewDetails: handleViewDetails,
    loadingBills,
  });

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-8 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center space-x-2">
              <TrendingUp className="h-6 w-6" />
              <span>{t('reports.salesReports.title')}</span>
            </h2>
            <p className="text-muted-foreground">
              {t('reports.salesReports.subtitle')}
            </p>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Summary Cards */}
        {reportData?.summary && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalRevenue')}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold break-all">
                      {formatCurrency(reportData.summary.totalRevenue)}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalTax')}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold break-all">
                      {formatCurrency(reportData.summary.totalTax)}
                    </p>
                  </div>
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalBills')}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold break-all">
                      {reportData.summary.totalBills}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.totalDiscount')}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold break-all">
                      {formatCurrency(reportData.summary.totalDiscount)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.cancelledBills')}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold break-all">
                      {reportData.summary.cancelledBills}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">
                      {t('reports.summary.duePayment') || 'Due Payment'}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold break-all">
                      {formatCurrency(reportData.summary.duePayment || 0)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            <TanStackTable
              data={bills}
              columns={columns}
              totalCount={totalCount}
              isLoading={
                isLoading ||
                updateBillMutation.isPending ||
                deleteBillMutation.isPending
              }
              searchValue={searchTerm}
              searchPlaceholder={
                t('reports.searchPlaceholder') || 'Search bills...'
              }
              onSearchChange={setSearchTerm}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortingChange={setSorting}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              manualPagination={true}
              manualSorting={true}
              manualFiltering={true}
              showSearch={true}
              showPagination={true}
              showPageSizeSelector={true}
              emptyMessage={t('reports.noDataFound')}
              enableMultiSort={false}
            />
          </CardContent>
        </Card>

        {/* Bill Details Modal */}
        <BillDetailsModal
          bill={selectedBill}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onUpdateBill={handleUpdateBill}
        />
      </div>
    </Layout>
  );
}
