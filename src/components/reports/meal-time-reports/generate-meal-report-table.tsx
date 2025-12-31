'use client';

import React from 'react';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { GeneratedMealTimeReport } from '@/types/meal-time-report.type';
import { GeneratedReportsColumns } from './meal-time-report-column';

interface GeneratedReportsTableProps {
  data: GeneratedMealTimeReport[];
  onShowDetails: (report: GeneratedMealTimeReport) => void;
  onDownload: (report: GeneratedMealTimeReport) => void;
  isLoading?: boolean;
}

export function GeneratedReportsTable({
  data,
  onShowDetails,
  onDownload,
  isLoading = false,
}: GeneratedReportsTableProps) {
  const columns = GeneratedReportsColumns({ onShowDetails, onDownload });

  return (
    <TanStackTable<GeneratedMealTimeReport>
      data={data}
      columns={columns}
      totalCount={data.length}
      pagination={{ pageIndex: 0, pageSize: data.length }}
      onPaginationChange={() => {}}
      sorting={[]}
      onSortingChange={() => {}}
      columnFilters={[]}
      onColumnFiltersChange={() => {}}
      searchValue=""
      onSearchChange={() => {}}
      manualPagination={false}
      manualSorting={false}
      manualFiltering={false}
      showPagination={false}
      showSearch={false}
      showPageSizeSelector={false}
      isLoading={isLoading}
    />
  );
}
