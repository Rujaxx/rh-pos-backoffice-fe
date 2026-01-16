'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/types/category.type';
import { Badge } from '@/components/ui/badge';
import { Tag, Calendar, Hash } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { TableActions } from '@/components/ui/table-actions';

// Column definitions for the categories table
export const createCategoryColumns = (
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void,
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<Category>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: t('categories.categoryName'),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aValue = (rowA.original.name.en || '').toLowerCase();
      const bValue = (rowB.original.name.en || '').toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm flex items-center space-x-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span>{category.name.en}</span>
          </div>
          {category.name.ar && (
            <div className="text-xs text-muted-foreground" dir="rtl">
              {category.name.ar}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'shortCode',
    header: t('categories.shortCode'),
    size: 100,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center space-x-1">
          <Hash className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-sm">{category.shortCode}</span>
        </div>
      );
    },
  },
  {
    id: 'status',
    header: t('categories.status'),
    size: 100,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <Badge variant={category.isActive ? 'default' : 'secondary'}>
          {category.isActive
            ? t('categories.active')
            : t('categories.inactive')}
        </Badge>
      );
    },
  },
  {
    id: 'sortOrder',
    header: t('categories.sortOrder'),
    size: 100,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <span className="text-sm text-muted-foreground">
          {category.sortOrder ?? 0}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('categories.created'),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const category = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(category.createdAt)?.toLocaleDateString() || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions'),
    enableSorting: false,
    size: 100,
    cell: ({ row }) => {
      const category = row.original;

      return (
        <TableActions
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category)}
          editLabel={t('categories.edit')}
          deleteLabel={t('categories.delete')}
        />
      );
    },
  },
];

// Hook for using category columns with current translation
export const useCategoryColumns = (
  onEdit: (category: Category) => void,
  onDelete: (category: Category) => void,
) => {
  const { t } = useTranslation();
  return createCategoryColumns(onEdit, onDelete, t);
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  // Map TanStack column IDs to backend field names
  const fieldMap: Record<string, string> = {
    name: 'name.en', // Sort by English name
    shortCode: 'shortCode',
    status: 'isActive',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt',
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
