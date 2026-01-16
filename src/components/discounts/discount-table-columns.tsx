'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { Discount } from '@/types/discount.type';
import { MultilingualText } from '@/types';
import { TableActions } from '@/components/ui/table-actions';

export const createDiscountColumns = (
  onEdit: (item: Discount) => void,
  onDelete: (item: Discount) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: string,
): ColumnDef<Discount>[] => {
  return [
    {
      accessorKey: 'name',
      id: 'name',
      header: t('discounts.title'),
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const a = (rowA.original.name?.en || '').toLowerCase();
        const b = (rowB.original.name?.en || '').toLowerCase();
        return a.localeCompare(b);
      },
      cell: ({ row }) => {
        const item = row.original;
        const displayName =
          item.name?.[locale as keyof MultilingualText] || item.name?.en || '-';

        return (
          <div className="space-y-1">
            <div className="font-medium text-sm">{displayName}</div>
          </div>
        );
      },
    },
    {
      header: t('discounts.table.discountType'),
      cell: ({ row }) => {
        const type = row.original.discountType;
        return (
          <Badge variant="outline">
            {type === 'Percentage'
              ? t('discounts.type.percentage')
              : t('discounts.fixed')}
          </Badge>
        );
      },
    },
    {
      header: t('discounts.table.discountValue'),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.discountValue}</span>
      ),
    },
    {
      id: 'status',
      header: t('common.status'),
      cell: ({ row }) => {
        const active = row.original.isActive;
        return (
          <Badge variant={active ? 'default' : 'secondary'}>
            {active ? t('common.active') : t('common.inactive')}
          </Badge>
        );
      },
    },

    {
      header: t('discounts.table.brand'),
      enableSorting: false,
      cell: ({ row }) => (
        <span>
          {row.original.brandName?.[locale as keyof MultilingualText]}
        </span>
      ),
    },
    {
      header: t('table.restaurant'),
      enableSorting: false,
      cell: ({ row }) => (
        <span>
          {row.original.restaurantName?.[locale as keyof MultilingualText] ||
            row.original.restaurantName?.en ||
            '-'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t('table.actions'),
      enableSorting: false,
      size: 100,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <TableActions
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
            editLabel={t('common.edit')}
            deleteLabel={t('common.delete')}
          />
        );
      },
    },
  ];
};

export const useDiscountColumns = (
  onEdit: (item: Discount) => void,
  onDelete: (item: Discount) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createDiscountColumns(onEdit, onDelete, t, locale);
};

export const getSortFieldForDiscountQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const fieldMap: Record<string, string> = {
    name: 'name.en',
    discountType: 'discountType',
    discountValue: 'discountValue',
    status: 'isActive',
  };

  return fieldMap[sorting[0].id] || sorting[0].id;
};

export const getSortOrderForDiscountQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined =>
  sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : undefined;
