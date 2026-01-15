'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Table } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Users } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { MultilingualText } from '@/types';
import { TableActions } from '@/components/ui/table-actions';

// Column definitions for the tables
export const createTableColumns = (
  onEdit: (table: Table) => void,
  onDelete: (table: Table) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: string,
): ColumnDef<Table>[] => {
  return [
    {
      accessorKey: 'label',
      id: 'label',
      header: t('table.label'),
      enableSorting: true,
      size: 100,
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div className="flex items-center space-x-2">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{table.label}</span>
          </div>
        );
      },
    },
    {
      id: 'restaurantName',
      header: t('table.restaurant'),
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div className="font-medium text-foreground truncate">
            {table.restaurantName?.[locale as keyof MultilingualText] ||
              table.restaurantName?.en ||
              'N/A'}
          </div>
        );
      },
    },
    {
      id: 'tableSectionName',
      header: t('table.section'),
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div className="font-medium text-foreground truncate">
            {table.tableSectionName?.[locale as keyof MultilingualText] ||
              table.tableSectionName?.en ||
              'N/A'}
          </div>
        );
      },
    },
    {
      id: 'capacity',
      header: t('table.capacity'),
      size: 120,
      cell: ({ row }) => {
        const table = row.original;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{table.capacity}</span>
            <span className="text-sm text-muted-foreground">
              {table.capacity === 1 ? 'seat' : 'seats'}
            </span>
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('table.status'),
      size: 100,
      cell: ({ row }) => {
        const table = row.original;
        return (
          <Badge
            variant={table.isAvailable ? 'default' : 'secondary'}
            className={
              table.isAvailable ? 'bg-green-500 hover:bg-green-600' : ''
            }
          >
            {table.isAvailable ? t('table.available') : t('table.unavailable')}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: t('table.actions'),
      enableSorting: false,
      size: 100,
      cell: ({ row }) => {
        const table = row.original;

        return (
          <TableActions
            onEdit={() => onEdit(table)}
            onDelete={() => onDelete(table)}
            editLabel={t('table.edit')}
            deleteLabel={t('table.delete')}
          />
        );
      },
    },
  ];
};

// Hook for using table columns with current translation
export const useTableColumns = (
  onEdit: (table: Table) => void,
  onDelete: (table: Table) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createTableColumns(onEdit, onDelete, t, locale);
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  // Map TanStack column IDs to backend field names
  const fieldMap: Record<string, string> = {
    restaurantName: 'restaurantName',
    label: 'label',
    capacity: 'capacity',
    status: 'isAvailable',
  };

  return fieldMap[sort.id] || sort.id;
};

// Helper function to get sort order from TanStack sorting state
export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? 'desc' : 'asc';
};
