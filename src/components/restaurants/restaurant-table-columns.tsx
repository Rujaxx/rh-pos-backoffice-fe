'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Restaurant } from '@/types/restaurant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  Mail,
  QrCode,
  ImageIcon,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { MultilingualText } from '@/types';
import { WhatsAppQRCode } from './qr-code';
import { TableActions } from '@/components/ui/table-actions';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const QRCodeCell = ({
  phoneNumber,
  restaurantName,
}: {
  phoneNumber: string;
  restaurantName: string;
}) => {
  if (!phoneNumber) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          <span className="sr-only">Show QR</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>WhatsApp QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center p-4">
          <WhatsAppQRCode
            phoneNumber={phoneNumber}
            restaurantName={restaurantName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Column definitions for the restaurants table
export const createRestaurantColumns = (
  onEdit: (restaurant: Restaurant) => void,
  onDelete: (restaurant: Restaurant) => void,
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
      const logoUrl = restaurant.logo;

      // If no logo URL, show thumbnail icon
      if (!logoUrl) {
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-md border bg-muted flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        );
      }

      return (
        <div className="flex items-center">
          <div className="relative w-10 h-10">
            <Image
              src={logoUrl}
              alt={restaurant.name?.en ?? 'Restaurant'}
              width={40}
              height={40}
              className="rounded-md object-cover border"
              onError={(e) => {
                // Hide image and show fallback icon
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="w-10 h-10 rounded-md border bg-muted flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                }
              }}
            />
          </div>
        </div>
      );
    },
  },
  {
    id: 'qrCode',
    header: t('restaurants.qrcode'),
    cell: ({ row }) => {
      const restaurant = row.original;
      if (!restaurant.phoneNumber) return t('restaurants.noQrCode');
      return (
        <div className="flex items-center">
          <QRCodeCell
            phoneNumber={restaurant.phoneNumber}
            restaurantName={restaurant.name?.en ?? ''}
          />
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
    accessorKey: 'restoCode',
    id: 'restoCode',
    header: t('restaurants.restoCode'),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="font-mono text-sm">{restaurant.restoCode || 'N/A'}</div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: t('restaurants.status'),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <Badge variant={restaurant.isActive ? 'default' : 'secondary'}>
          {restaurant.isActive
            ? t('restaurants.active')
            : t('restaurants.inactive')}
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
    id: 'contact',
    header: t('restaurants.contact'),
    enableSorting: false,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="text-sm space-y-1">
          <div className="flex items-center space-x-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]">
              {restaurant.contactEmail || 'N/A'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[150px]">
              {restaurant.phoneNumber || 'N/A'}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: 'resetBill',
    header: t('restaurants.nextResetBill'),
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="text-sm">
          <Badge variant="outline">
            {t(`restaurants.resetBill.${restaurant.nextResetBillFreq}`)}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('restaurants.created'),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const restaurant = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(restaurant.createdAt)?.toLocaleDateString() || 'N/A'}
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
      const restaurant = row.original;

      return (
        <TableActions
          onEdit={() => onEdit(restaurant)}
          onDelete={() => onDelete(restaurant)}
          editLabel={t('restaurants.edit')}
          deleteLabel={t('restaurants.delete')}
        />
      );
    },
  },
];

// Hook for using restaurant columns with current translation
export const useRestaurantColumns = (
  onEdit: (restaurant: Restaurant) => void,
  onDelete: (restaurant: Restaurant) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createRestaurantColumns(onEdit, onDelete, t, locale);
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
    brand: 'brandName.en',
    status: 'isActive',
    restoCode: 'restoCode',
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
