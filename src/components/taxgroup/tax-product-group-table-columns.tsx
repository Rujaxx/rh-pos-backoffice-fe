'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { TaxProductGroup } from '@/types/tax-product-group.type';
import { MultilingualText } from '@/types';
import { Restaurant } from '@/types/restaurant';
import { TableActions } from '@/components/ui/table-actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Type for restaurant reference that can be string ID or populated object
interface RestaurantRef {
  _id: string;
  name?: MultilingualText;
}

export const createTaxProductGroupColumns = (
  onEdit: (item: TaxProductGroup) => void,
  onDelete: (item: TaxProductGroup) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: string,
  restaurants: Restaurant[] = [],
): ColumnDef<TaxProductGroup>[] => {
  return [
    {
      accessorKey: 'name',
      id: 'name',
      header: t('taxGroups.title'),
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
            {item.name?.ar && (
              <div className="text-xs text-muted-foreground" dir="rtl">
                {item.name.ar}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: t('taxGroups.table.taxType'),
      cell: ({ row }) => {
        const type = row.original.taxType;
        return (
          <Badge variant="outline">
            {type === 'Percentage'
              ? t('taxGroups.type.percentage')
              : t('taxGroups.fixed')}
          </Badge>
        );
      },
    },
    {
      header: t('taxGroups.table.taxValue'),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.taxValue}</span>
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
      header: t('taxGroups.table.brand'),
      enableSorting: false,
      cell: ({ row }) => (
        <span>
          {row.original.brandName?.[locale as keyof MultilingualText]}
        </span>
      ),
    },

    {
      accessorKey: 'restaurantIds',
      header: t('common.restaurants'),
      cell: ({ row }) => {
        const itemRestaurantIds = row.original.restaurantIds || [];

        if (itemRestaurantIds.length === 0) return <span>-</span>;

        // Resolve restaurant names
        const resolvedRestaurants = itemRestaurantIds.map(
          (r: string | RestaurantRef) => {
            const id = typeof r === 'string' ? r : r._id;
            const found = restaurants.find((res) => res._id === id);
            if (found) return found;
            // Fallback if r has name (legacy/backend populated)
            return typeof r === 'object' && r.name
              ? r
              : { name: { en: 'Unknown', ar: 'Unknown' }, _id: id };
          },
        );

        if (resolvedRestaurants.length === 1) {
          const name =
            resolvedRestaurants[0].name?.[locale as keyof MultilingualText] ||
            resolvedRestaurants[0].name?.en ||
            '-';
          return (
            <Badge
              variant="outline"
              className="truncate max-w-[150px] block"
              title={name}
            >
              {name}
            </Badge>
          );
        }

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
              >
                {resolvedRestaurants.length} {t('common.restaurants')}
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2">
              <div className="space-y-1">
                <h4 className="font-medium text-sm border-b pb-1 mb-1">
                  {t('common.restaurants')}
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {resolvedRestaurants.map((r) => (
                    <div
                      key={r._id}
                      className="text-sm px-2 py-1 rounded hover:bg-muted truncate"
                    >
                      {r.name?.[locale as keyof MultilingualText] ||
                        r.name?.en ||
                        'Unknown'}
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        );
      },
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

export const useTaxProductGroupColumns = (
  onEdit: (item: TaxProductGroup) => void,
  onDelete: (item: TaxProductGroup) => void,
  restaurants: Restaurant[] = [],
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createTaxProductGroupColumns(onEdit, onDelete, t, locale, restaurants);
};

export const getSortFieldForTaxProductGroupQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const fieldMap: Record<string, string> = {
    name: 'name.en',
    productGroupName: 'productGroupName',
    taxType: 'taxType',
    taxValue: 'taxValue',
    status: 'isActive',
    inclusive: 'isInclusive',
  };

  return fieldMap[sorting[0].id] || sorting[0].id;
};

export const getSortOrderForTaxProductGroupQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined =>
  sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : undefined;
