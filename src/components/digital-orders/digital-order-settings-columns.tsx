'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Restaurant } from '@/types/restaurant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Settings, MapPin, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getS3UrlFromKey, getFallbackAvatarUrl } from '@/lib/upload-utils';
import { useI18n } from '@/providers/i18n-provider';
import { MultilingualText } from '@/types';

// Column definitions for the digital order settings table
export const createDigitalOrderSettingsColumns = (
  onEdit: (restaurant: Restaurant) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: string,
): ColumnDef<Restaurant>[] => [
  {
    id: 'logo',
    header: t('restaurants.logo'),
    size: 80,
    enableSorting: false,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <Image
              src={
                getS3UrlFromKey(restaurant.logo) ||
                getFallbackAvatarUrl(restaurant.name?.en ?? '')
              }
              alt={restaurant.name?.en ?? 'Restaurant'}
              width={40}
              height={40}
              className="rounded-md object-cover border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackAvatarUrl(restaurant.name?.en ?? '');
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'name',
    id: 'name',
    header: t('restaurants.name'),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aValue = (rowA.original.name?.en ?? '').toLowerCase();
      const bValue = (rowB.original.name?.en ?? '').toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">
            {restaurant.name?.en ?? '—'}
          </div>
          {restaurant.name?.ar && (
            <div className="text-xs text-muted-foreground" dir="rtl">
              {restaurant.name.ar}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'brandName',
    id: 'brand',
    header: t('restaurants.brand'),
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.original.brandName?.[locale as keyof MultilingualText]}
        </Badge>
      );
    },
  },
  {
    id: 'location',
    header: t('restaurants.location'),
    enableSorting: false,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]">
              {restaurant.address?.city}, {restaurant.address?.country}
            </span>
          </div>
          {restaurant.timezone && (
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{restaurant.timezone}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'isDigitalOrderingEnabled',
    header: t('digitalOrders.digitalOrdering'),
    enableSorting: false,
    cell: ({ row }) => {
      const isEnabled =
        row.original.digitalOrderSettings?.isDigitalOrderingEnabled ?? true;
      return (
        <Badge variant={isEnabled ? 'default' : 'secondary'}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions'),
    enableSorting: false,
    size: 80,
    cell: ({ row }) => {
      const restaurant = row.original;

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(restaurant);
          }}
          title="Configure Digital Order Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      );
    },
  },
];

// Hook for using digital order settings columns with current translation
export const useDigitalOrderSettingsColumns = (
  onEdit: (restaurant: Restaurant) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createDigitalOrderSettingsColumns(onEdit, t, locale);
};
