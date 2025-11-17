import React, { useMemo } from "react";
import { ColumnDef, SortingState } from "@tanstack/react-table";
import { useTranslation } from "@/hooks/useTranslation";
import { TanStackTable } from "./tanstack-table";

// Types for legacy column shape
interface LegacyColumnBase<T> {
  id?: string;
  accessorKey?: keyof T | string;
  header?: string;
  title?: string;
  cell?: (props: {
    row: { original: T };
    getValue: () => unknown;
  }) => React.ReactNode;
  enableSorting?: boolean;
}

type LegacyColumn<T> = LegacyColumnBase<T> | ColumnDef<T>;

export interface LegacyDataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: LegacyColumn<T>[];
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: (p: { pageIndex: number; pageSize: number }) => void;
  sorting?: SortingState;
  onSortingChange?: (s: SortingState) => void;
  isLoading?: boolean;
  totalCount?: number;
  emptyMessage?: string;
}

/**
 * Compatibility adapter that maps legacy DataTable props to the new TanstackTable.
 * This file is intentionally small and typed to avoid unknown types and follow ESLint rules.
 */
export function DataTableLegacyAdapter<T extends Record<string, unknown>>(
  props: LegacyDataTableProps<T>,
) {
  const { t } = useTranslation();
  const {
    data,
    columns,
    searchValue = "",
    onSearchChange,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    isLoading,
    totalCount,
    emptyMessage,
  } = props;

  function isLegacyColumn<T>(col: LegacyColumn<T>): col is LegacyColumnBase<T> {
    return "accessorKey" in col || "header" in col || "title" in col;
  }

  const mappedColumns = useMemo<ColumnDef<T>[]>(() => {
    if (!columns || columns.length === 0) return [];

    return columns.map((col) => {
      // If already a ColumnDef, return as-is
      if (!isLegacyColumn(col)) {
        return col as ColumnDef<T>;
      }

      // Map legacy column to TanStack column
      return {
        id:
          col.id ??
          String(col.accessorKey) ??
          col.header ??
          String(Math.random()),
        accessorKey: col.accessorKey as string,
        header: col.header ?? col.title ?? "",
        cell: (info) => {
          if (col.cell) {
            return col.cell({ row: info.row, getValue: info.getValue });
          }
          return String(info.getValue() ?? "");
        },
        enableSorting: col.enableSorting ?? true,
      } satisfies ColumnDef<T>;
    });
  }, [columns]);

  return (
    <TanStackTable
      data={data}
      columns={mappedColumns}
      showSearch={Boolean(onSearchChange)}
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      pagination={pagination ?? { pageIndex: 0, pageSize: 10 }}
      showPagination={Boolean(pagination)}
      onPaginationChange={onPaginationChange}
      manualPagination={Boolean(totalCount)}
      pageCount={
        totalCount
          ? Math.ceil((totalCount as number) / (pagination?.pageSize ?? 10))
          : undefined
      }
      sorting={sorting}
      onSortingChange={onSortingChange}
      isLoading={isLoading}
      emptyMessage={emptyMessage ?? t("table.noData")}
    />
  );
}
