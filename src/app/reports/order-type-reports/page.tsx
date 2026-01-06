'use client';

import React, { useState, useCallback } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { OrderTypeData } from '@/types/order-report.type';

// Mock data for order type report table
const MOCK_ORDER_TYPE_DATA: OrderTypeData[] = [
  {
    id: '1',
    orderFrom: 'POS Terminal',
    orderCount: 156,
    totalAmount: 523400,
    status: 'Active',
  },
  {
    id: '2',
    orderFrom: 'Online Website',
    orderCount: 89,
    totalAmount: 267000,
    status: 'Inactive',
  },
  {
    id: '3',
    orderFrom: 'Delivery',
    orderCount: 67,
    totalAmount: 201000,
    status: 'Active',
  },
];

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function OrderTypeReportPage() {
  const { t } = useTranslation();

  // Initialize filters
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();
    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  // State for the filters that are actually applied (submitted)
  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false); // <-- Added loading state

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null); // Clear submitted filters
  }, []);

  // Apply filters handler
  const handleApplyFilters = useCallback(() => {
    if (!filters.from || !filters.to) {
      toast.error('Please select date range');
      return;
    }

    setIsLoading(true);

    // Simulate API call like Meal Time
    setTimeout(() => {
      setSubmittedFilters(filters);
      setIsLoading(false);
      toast.success('Filters applied successfully');
    }, 1000); // 1 second delay like API call
  }, [filters]);

  const handleRefresh = useCallback(() => {
    if (!submittedFilters) {
      toast.info('Please apply filters first');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t('common.refreshSuccess') || 'Data refreshed');
    }, 1000);
  }, [submittedFilters, t]);

  // Define columns for the main order type table
  const orderTypeColumns: ColumnDef<OrderTypeData>[] = [
    {
      accessorKey: 'orderFrom',
      header: t('reports.orderType.columns.orderFrom') || 'Order From',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.orderFrom}</div>
      ),
    },
    {
      accessorKey: 'orderCount',
      header: t('reports.orderType.columns.orderCount') || 'Count',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.orderCount}</div>
      ),
      meta: {
        className: 'text-center',
      },
    },
    {
      accessorKey: 'totalAmount',
      header: t('reports.orderType.columns.totalAmount') || 'Amount',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.totalAmount)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: t('reports.orderType.columns.status') || 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        const statusColors: Record<string, string> = {
          Active: 'bg-green-500 text-white',
          Inactive: 'bg-gray-500 text-white',
          Pending: 'bg-yellow-500 text-white',
        };

        return (
          <Badge className={statusColors[status] || 'bg-gray-500 text-white'}>
            {status}
          </Badge>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.orderTypeReports') || 'Order Type Report'}
            </h2>
            <p className="text-muted-foreground">
              {t('reports.orderType.description') ||
                'View order source statistics and analysis'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
              disabled={isLoading || !submittedFilters}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              {t('common.refresh')}
            </Button>
          </div>
        </div>

        {/* Filters - Now with onSubmit prop */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        />

        {/* Main Order Type Report Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                {t('reports.orderType.orderTypeReport')}
              </CardTitle>
              {submittedFilters && (
                <p className="text-sm text-muted-foreground">
                  Showing order type data for selected date range
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {/* Show message based on filter state */}
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin" />
                <p>Loading...</p>
              </div>
            ) : MOCK_ORDER_TYPE_DATA.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {t('reports.orderType.noData')}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <TanStackTable
                  data={MOCK_ORDER_TYPE_DATA}
                  columns={orderTypeColumns}
                  totalCount={MOCK_ORDER_TYPE_DATA.length}
                  pagination={{ pageIndex: 0, pageSize: 10 }}
                  onPaginationChange={() => {}}
                  sorting={[]}
                  onSortingChange={() => {}}
                  columnFilters={[]}
                  onColumnFiltersChange={() => {}}
                  searchValue={searchTerm}
                  onSearchChange={setSearchTerm}
                  manualPagination={false}
                  showPagination={true}
                  showSearch={true}
                  searchPlaceholder={
                    t('reports.orderType.searchPlaceholder') ||
                    'Search order types...'
                  }
                  isLoading={isLoading}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
