'use client';

import React, { useState, useCallback } from 'react';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { MealTimeReportData } from '@/types/meal-time-report.type';
import {
  PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { MealTimeDataColumns } from './meal-time-column';
import { useTranslation } from '@/hooks/useTranslation';

interface MealTimeDataTableProps {
  data: MealTimeReportData[];
  isLoading?: boolean;
}

export function MealTimeDataTable({
  data,
  isLoading = false,
}: MealTimeDataTableProps) {
  const { t } = useTranslation();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = MealTimeDataColumns();

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      setPagination(newPagination);
    },
    [],
  );

  const handleSortingChange = useCallback((newSorting: SortingState) => {
    setSorting(newSorting);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [],
  );

  return (
    <TanStackTable<MealTimeReportData>
      data={data}
      columns={columns}
      totalCount={data.length}
      isLoading={isLoading}
      pagination={pagination}
      onPaginationChange={handlePaginationChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      columnFilters={columnFilters}
      onColumnFiltersChange={handleColumnFiltersChange}
      manualPagination={false}
      manualSorting={false}
      manualFiltering={false}
      showPagination={true}
      showSearch={false} // Set to false to hide search
      showPageSizeSelector={true}
      emptyMessage={t('reports.mealTime.noData')}
      enableMultiSort={false}
    />
  );
}
