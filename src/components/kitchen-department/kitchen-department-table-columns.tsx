'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { KitchenDepartment } from '@/types/kitchen-department.type';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { MultilingualText } from '@/types';
import { TableActions } from '@/components/ui/table-actions';

// Column definitions
export const createKitchenDepartmentColumns = (
  onEdit: (department: KitchenDepartment) => void,
  onDelete: (department: KitchenDepartment) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: string,
): ColumnDef<KitchenDepartment>[] => {
  return [
    // Name column
    {
      accessorKey: 'name',
      id: 'name',
      header: t('kitchenDepartment.name'),
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.name?.en || '').toLowerCase();
        const b = (rowB.original.name?.en || '').toLowerCase();
        return a.localeCompare(b);
      },
      cell: ({ row }) => {
        const dept = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{dept.name.en}</div>
            {dept.name.ar && (
              <div className="text-xs text-muted-foreground" dir="rtl">
                {dept.name.ar}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'brandName',
      header: t('brands.brandName'),
      cell: ({ row }) => {
        const brandName = row.original.brandName;
        return (
          <div className="font-medium text-foreground truncate">
            {brandName?.[locale as keyof MultilingualText] ||
              brandName?.en ||
              'N/A'}
          </div>
        );
      },
    },
    {
      id: 'restaurantName',
      header: t('restaurants.name'),
      cell: ({ row }) => {
        const restaurantName = row.original.restaurantName;
        return (
          <div className="font-medium text-foreground truncate">
            {restaurantName?.[locale as keyof MultilingualText] ||
              restaurantName?.en ||
              'N/A'}
          </div>
        );
      },
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? t('common.active') : t('common.inactive')}
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
        const dept = row.original;

        return (
          <TableActions
            onEdit={() => onEdit(dept)}
            onDelete={() => onDelete(dept)}
            editLabel={t('common.edit')}
            deleteLabel={t('common.delete')}
          />
        );
      },
    },
  ];
};

export const useKitchenDepartmentColumns = (
  onEdit: (department: KitchenDepartment) => void,
  onDelete: (department: KitchenDepartment) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return createKitchenDepartmentColumns(onEdit, onDelete, t, locale);
};

export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];

  const fieldMap: Record<string, string> = {
    name: 'name.en',
    brandName: 'brandName',
    restaurantName: 'restaurantName',
    status: 'isActive',
  };

  return fieldMap[sort.id] || sort.id;
};

export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined => {
  if (!sorting.length) return undefined;
  return sorting[0].desc ? 'desc' : 'asc';
};
