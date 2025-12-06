'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { Discount } from '@/types/discount.type';
import { MultilingualText } from '@/types';

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
      id: 'actions',
      header: t('table.actions'),
      enableSorting: false,
      size: 80,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {/* Edit */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </DropdownMenuItem>

              {/* Delete */}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
