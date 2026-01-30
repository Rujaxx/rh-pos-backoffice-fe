'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  ColumnDef,
  PaginationState,
  SortingState,
  ColumnFiltersState,
  OnChangeFn,
  ExpandedState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { Column } from '@tanstack/react-table';

// DataTableColumnHeader component for sortable columns
interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('font-medium', className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <span className="font-medium">{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ChevronDown className="ml-2 h-4 w-4" />
        ) : column.getIsSorted() === 'asc' ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

// Types for the TanStack Table component
export interface TanStackTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  totalCount?: number;
  isLoading?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  pagination?: PaginationState;
  sorting?: SortingState;
  columnFilters?: ColumnFiltersState;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  showPageSizeSelector?: boolean;
  emptyMessage?: string;
  enableMultiSort?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  renderSubComponent?: (props: { row: unknown }) => React.ReactElement;
  getRowCanExpand?: (row: unknown) => boolean;
}

export function TanStackTable<T>({
  data,
  columns,
  totalCount = 0,
  isLoading = false,
  searchValue = '',
  searchPlaceholder = 'Search...',
  onSearchChange,
  onPaginationChange,
  onSortingChange,
  onColumnFiltersChange,
  pagination = { pageIndex: 0, pageSize: 10 },
  sorting = [],
  columnFilters = [],
  manualPagination = true,
  manualSorting = true,
  manualFiltering = true,
  pageCount = -1,
  showSearch = true,
  showPagination = true,
  showPageSizeSelector = true,
  emptyMessage,
  enableMultiSort = false,
  rowSelection = {},
  onRowSelectionChange,
  renderSubComponent,
  getRowCanExpand,
}: TanStackTableProps<T>) {
  const { t } = useTranslation();
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // Update local search when external search changes
  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  // Wrap callbacks to handle updater functions
  const handlePaginationChange: OnChangeFn<PaginationState> | undefined =
    onPaginationChange
      ? (updaterOrValue) => {
          const newValue =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(pagination)
              : updaterOrValue;
          onPaginationChange(newValue);
        }
      : undefined;

  const handleSortingChange: OnChangeFn<SortingState> | undefined =
    onSortingChange
      ? (updaterOrValue) => {
          const newValue =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(sorting)
              : updaterOrValue;
          onSortingChange(newValue);
        }
      : undefined;

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> | undefined =
    onColumnFiltersChange
      ? (updaterOrValue) => {
          const newValue =
            typeof updaterOrValue === 'function'
              ? updaterOrValue(columnFilters)
              : updaterOrValue;
          onColumnFiltersChange(newValue);
        }
      : undefined;

  const handleRowSelectionChange:
    | OnChangeFn<Record<string, boolean>>
    | undefined = onRowSelectionChange
    ? (updaterOrValue) => {
        const newValue =
          typeof updaterOrValue === 'function'
            ? updaterOrValue(rowSelection)
            : updaterOrValue;
        onRowSelectionChange(newValue);
      }
    : undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount:
      pageCount === -1
        ? Math.ceil(totalCount / pagination.pageSize)
        : pageCount,
    state: {
      pagination,
      sorting,
      columnFilters,
      rowSelection,
      expanded,
    },
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onRowSelectionChange: handleRowSelectionChange,
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: getRowCanExpand,
    enableMultiSort,
    enableSorting: true,
    enableColumnFilters: true,
    enableExpanding: !!renderSubComponent,
  });

  // Handle search input change (only updates local state)
  const handleSearchChange = useCallback((value: string) => {
    setLocalSearchValue(value);
  }, []);

  // Trigger search (called on Enter key or search button click)
  const triggerSearch = useCallback(() => {
    if (onSearchChange && localSearchValue !== searchValue) {
      onSearchChange(localSearchValue);
    }
  }, [onSearchChange, localSearchValue, searchValue]);

  // Handle Enter key press in search input
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        triggerSearch();
      }
    },
    [triggerSearch],
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setLocalSearchValue('');
    if (onSearchChange) {
      onSearchChange('');
    }
  }, [onSearchChange]);

  // Page size options
  const pageSizeOptions = [10, 20, 30, 40, 50];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Search Skeleton */}
        {showSearch && (
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <div className="h-10 bg-muted animate-pulse rounded-md"></div>
            </div>
            <div className="h-10 w-20 bg-muted animate-pulse rounded-md"></div>
          </div>
        )}

        {/* Table Skeleton */}
        <div className="rounded-md border">
          <div className="h-12 bg-muted/50 border-b animate-pulse"></div>
          {Array.from({ length: pagination.pageSize }).map((_, index) => (
            <div
              key={index}
              className="h-16 border-b bg-background animate-pulse"
            ></div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        {showPagination && (
          <div className="flex items-center justify-between">
            <div className="h-5 w-40 bg-muted animate-pulse rounded"></div>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      {showSearch && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-10"
              />
              {localSearchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  onClick={clearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <Button
              onClick={triggerSearch}
              size="sm"
              variant="outline"
              className="shrink-0"
              disabled={localSearchValue === searchValue}
            >
              Search
            </Button>
          </div>

          {/* Active Filters Display */}
          {columnFilters.length > 0 && (
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <Filter className="h-3 w-3" />
                <span>
                  {columnFilters.length} filter
                  {columnFilters.length > 1 ? 's' : ''}
                </span>
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'font-medium',
                      header.column.getCanSort() &&
                        'cursor-pointer hover:bg-muted/50',
                    )}
                    style={{
                      width:
                        header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col ml-2">
                          {header.column.getIsSorted() === 'asc' && (
                            <ChevronUp className="h-4 w-4" />
                          )}
                          {header.column.getIsSorted() === 'desc' && (
                            <ChevronDown className="h-4 w-4" />
                          )}
                          {!header.column.getIsSorted() && (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'hover:bg-muted/50',
                      renderSubComponent && 'cursor-pointer',
                    )}
                    onClick={() => {
                      if (renderSubComponent && row.getCanExpand()) {
                        row.toggleExpanded();
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && renderSubComponent && (
                    <TableRow>
                      <TableCell colSpan={row.getVisibleCells().length}>
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage || t('table.noData')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {showPageSizeSelector && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">Rows per page:</p>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => table.setPageSize(parseInt(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">
                {t('table.page')} {pagination.pageIndex + 1} {t('table.of')}{' '}
                {table.getPageCount()}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
