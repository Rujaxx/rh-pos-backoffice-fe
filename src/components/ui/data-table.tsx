'use client';

import React, { useState, useMemo } from 'react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';
import { DataTableProps } from '@/types';

export interface TableColumn<T> {
  id: string;
  label: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  actions = [],
  searchable = true,
  searchValue = '',
  searchPlaceholder = 'Search...',
  pagination = true,
  loading = false,
  onSort,
  onSearch,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { t } = useTranslation();
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      // Handle multilingual objects
      if (typeof aValue === 'object' && aValue !== null) {
        const aObj = aValue as Record<string, unknown>;
        const bObj = (bValue as Record<string, unknown>) || {};
        const aText = String(aObj.en || Object.values(aObj)[0] || '');
        const bText = String(bObj.en || Object.values(bObj)[0] || '');
        return sortDirection === 'asc'
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      }

      const aStr = String(aValue || '');
      const bStr = String(bValue || '');

      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }

    if (onSort) {
      onSort(
        columnId,
        sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc',
      );
    }
  };

  const renderCellValue = (item: T, column: TableColumn<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }

    const value = column.accessor
      ? item[column.accessor]
      : item[column.id as keyof T];

    // Handle different data types
    if (typeof value === 'object' && value !== null) {
      // Handle multilingual objects
      const obj = value as Record<string, unknown>;
      if ('en' in obj) {
        return String(obj.en || Object.values(obj)[0] || '');
      }
      return JSON.stringify(value);
    }

    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? t('table.status.active') : t('table.status.inactive')}
        </Badge>
      );
    }
    return String(value || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    'font-medium',
                    column.sortable && 'cursor-pointer hover:bg-muted/50',
                    column.width && `w-[${column.width}]`,
                  )}
                  onClick={
                    column.sortable ? () => handleSort(column.id) : undefined
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable &&
                      sortColumn === column.id &&
                      (sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="w-[100px]">
                  {t('table.actions')}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('table.noData')}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={(item._id as string) || (item.id as string) || index}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id} className="py-2">
                      {renderCellValue(item, column)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action, actionIndex) => (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={() => action.onClick(item)}
                              disabled={action.disabled?.(item)}
                              className={cn(
                                action.variant === 'destructive' &&
                                  'text-destructive focus:text-destructive',
                              )}
                            >
                              {action.icon && (
                                <action.icon className="mr-2 h-4 w-4" />
                              )}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('table.showing')}{' '}
            {Math.min((currentPage - 1) * itemsPerPage + 1, sortedData.length)}{' '}
            {t('table.to')}{' '}
            {Math.min(currentPage * itemsPerPage, sortedData.length)}{' '}
            {t('table.of')} {sortedData.length} {t('table.entries')}
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('table.previous')}
            </Button>
            <span className="text-sm">
              {t('table.page')} {currentPage} {t('table.of')} {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              {t('table.next')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
