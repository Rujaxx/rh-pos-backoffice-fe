'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import Layout from '@/components/common/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportFilters } from '@/components/reports/report-filters/report-filters';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { toast } from 'sonner';
import { TanStackTable } from '@/components/ui/tanstack-table';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useKitchenDepartmentColumns } from '@/components/reports/kitchen-department-reports/kitchen-dept-columns';
import { KitchenDepartmentReportFilters } from '@/components/reports/report-filters/kitchen-dept-filters';

// Mock kitchen department data
const MOCK_KITCHEN_DEPARTMENT_DATA = [
  {
    id: '1',
    kitchenDepartment: 'Main Kitchen',
    categoryName: 'Pizza',
    soldItems: 480,
    totalAmount: 720000,
    itemLevelDiscount: 7200,
    itemLevelTotalCharges: 3600,
  },
  {
    id: '2',
    kitchenDepartment: 'Main Kitchen',
    categoryName: 'Main Course',
    soldItems: 620,
    totalAmount: 620000,
    itemLevelDiscount: 6200,
    itemLevelTotalCharges: 3100,
  },
  {
    id: '3',
    kitchenDepartment: 'Beverage Station',
    categoryName: 'Beverages',
    soldItems: 850,
    totalAmount: 425000,
    itemLevelDiscount: 4250,
    itemLevelTotalCharges: 2125,
  },
  {
    id: '4',
    kitchenDepartment: 'Main Kitchen',
    categoryName: 'Rice Items',
    soldItems: 310,
    totalAmount: 372000,
    itemLevelDiscount: 3720,
    itemLevelTotalCharges: 1860,
  },
  {
    id: '5',
    kitchenDepartment: 'Special Counter',
    categoryName: 'Combos',
    soldItems: 280,
    totalAmount: 336000,
    itemLevelDiscount: 3360,
    itemLevelTotalCharges: 1680,
  },
  {
    id: '6',
    kitchenDepartment: 'Chinese Station',
    categoryName: 'Chinese',
    soldItems: 220,
    totalAmount: 330000,
    itemLevelDiscount: 3300,
    itemLevelTotalCharges: 1650,
  },
];

export default function KitchenDepartmentReportPage() {
  const { t } = useTranslation();
  // Initialize filters with today's date
  const [filters, setFilters] = useState<ReportQueryParams>(() => {
    const today = new Date();

    return {
      from: today.toISOString(),
      to: today.toISOString(),
    };
  });

  const [submittedFilters, setSubmittedFilters] =
    useState<ReportQueryParams | null>(null);

  // Table state
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'totalAmount', desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Filter mock data based on search term
  const filteredData = useMemo(() => {
    let data = [...MOCK_KITCHEN_DEPARTMENT_DATA];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter((item) => {
        return (
          item.kitchenDepartment.toLowerCase().includes(lowerSearchTerm) ||
          item.categoryName.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }

    // Apply sorting
    const sortConfig = sorting[0];
    if (sortConfig) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.id as keyof typeof a];
        const bValue = b[sortConfig.id as keyof typeof b];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.desc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.desc ? bValue - aValue : aValue - bValue;
        }

        return 0;
      });
    }

    return data;
  }, [searchTerm, sorting]);

  // Filter handlers
  const handleFilterChange = useCallback((newFilters: ReportQueryParams) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSubmittedFilters(null);
    setPagination({ pageIndex: 0, pageSize: 10 });
    setSorting([{ id: 'totalAmount', desc: true }]);
  }, []);

  const handleApplyFilters = useCallback(() => {
    setSubmittedFilters(filters);
    toast.info('Fetching kitchen department report data...');
  }, [filters]);

  const handleRefresh = useCallback(() => {
    toast.success('Data refreshed');
  }, []);

  const handleExport = useCallback(() => {
    toast.success('Export started');
  }, []);

  // Get columns from separate file
  const columns = useKitchenDepartmentColumns();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.kitchenDepartmentReports') ||
                'Kitchen Department Report'}
            </h2>
          </div>

          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('common.refresh') || 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters - Using the standard ReportFilters component */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <KitchenDepartmentReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">
                Kitchen Department Performance
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {filteredData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No kitchen department data found
              </div>
            ) : (
              <TanStackTable
                data={filteredData}
                columns={columns}
                totalCount={filteredData.length}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder="Search departments..."
                onSearchChange={setSearchTerm}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
                manualPagination={false}
                manualSorting={false}
                manualFiltering={false}
                showSearch={true}
                showPagination={true}
                showPageSizeSelector={true}
                emptyMessage="No kitchen department data found"
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
