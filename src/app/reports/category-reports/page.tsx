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
import { useCategoryColumns } from '@/components/reports/category-reports/category-columns';
import { CategoryReportFilters } from '@/components/reports/report-filters/category-report-filter';

// Restaurant categories mock data
const MOCK_CATEGORY_DATA = [
  {
    id: '1',
    categoryName: 'Pizza',
    parentCategory: 'Main Menu',
    soldItems: 480,
    totalAmount: 720000,
  },
  {
    id: '2',
    categoryName: 'Main Course',
    parentCategory: 'Main Menu',
    soldItems: 620,
    totalAmount: 620000,
  },
  {
    id: '3',
    categoryName: 'Beverages',
    parentCategory: 'Drinks',
    soldItems: 850,
    totalAmount: 425000,
  },
  {
    id: '4',
    categoryName: 'Rice Items',
    parentCategory: 'Main Menu',
    soldItems: 310,
    totalAmount: 372000,
  },
  {
    id: '5',
    categoryName: 'Combos',
    parentCategory: 'Special',
    soldItems: 280,
    totalAmount: 336000,
  },
  {
    id: '6',
    categoryName: 'Chinese',
    parentCategory: 'International',
    soldItems: 220,
    totalAmount: 330000,
  },
  {
    id: '7',
    categoryName: 'Appetizers',
    parentCategory: 'Starters',
    soldItems: 350,
    totalAmount: 175000,
  },
  {
    id: '8',
    categoryName: 'South Indian',
    parentCategory: 'Regional',
    soldItems: 290,
    totalAmount: 174000,
  },
  {
    id: '9',
    categoryName: 'Thalis',
    parentCategory: 'Special',
    soldItems: 120,
    totalAmount: 168000,
  },
  {
    id: '10',
    categoryName: 'Desserts',
    parentCategory: 'Sweet',
    soldItems: 320,
    totalAmount: 160000,
  },
];

export default function CategoryReportPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ReportQueryParams>({});
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
  const filteredCategoryData = useMemo(() => {
    let data = [...MOCK_CATEGORY_DATA];

    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      data = data.filter((item) => {
        return (
          item.categoryName.toLowerCase().includes(lowerSearchTerm) ||
          item.parentCategory.toLowerCase().includes(lowerSearchTerm)
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
    toast.info('Fetching category report data...');
  }, [filters]);

  const handleRefresh = useCallback(() => {
    toast.success('Data refreshed');
  }, []);

  const handleExport = useCallback(() => {
    toast.success('Export started');
  }, []);

  // Get columns from separate file
  const columns = useCategoryColumns();

  return (
    <Layout>
      <div className="flex flex-1 flex-col space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {t('navigation.categoryReports') || 'Category Report'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Filters */}
        <ReportFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onSubmit={handleApplyFilters}
        >
          <CategoryReportFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </ReportFilters>

        {/* Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
            <div>
              <CardTitle className="text-lg">Restaurant Categories</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {filteredCategoryData.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No category data found
              </div>
            ) : (
              <TanStackTable
                data={filteredCategoryData}
                columns={columns}
                totalCount={filteredCategoryData.length}
                isLoading={false}
                searchValue={searchTerm}
                searchPlaceholder="Search categories..."
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
                emptyMessage="No category data found"
                enableMultiSort={false}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
