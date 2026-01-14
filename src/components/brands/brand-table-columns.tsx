'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Brand } from '@/types/brand.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import {
  Edit,
  Trash2,
  MoreHorizontal,
  Phone,
  Globe,
  Calendar,
  ImageIcon,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getFallbackAvatarUrl } from '@/lib/upload-utils';
import { useI18n } from '@/providers/i18n-provider';

// Column definitions for the brands table
export const createBrandColumns = (
  onEdit: (brand: Brand) => void,
  onDelete: (brand: Brand) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: 'en' | 'ar',
): ColumnDef<Brand>[] => [
  {
    id: 'logo',
    header: t('brands.logo'),
    size: 80,
    enableSorting: false,
    cell: ({ row }) => {
      const brand = row.original;
      const logoUrl = brand.logoUrl || brand.logo;

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
              alt={brand.name.en}
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
    accessorKey: 'name',
    id: 'name',
    header: t('brands.brandName'),
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const aValue = (rowA.original.name.en || '').toLowerCase();
      const bValue = (rowB.original.name.en || '').toLowerCase();
      return aValue.localeCompare(bValue);
    },
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium text-sm">
            {brand.name?.[locale] || brand.name?.en}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    id: 'description',
    header: t('brands.description'),
    enableSorting: false,
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="max-w-xs space-y-1">
          <div className="text-sm truncate">
            {brand.description?.[locale] || brand.description?.en}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: t('brands.status'),
    enableSorting: true,
    size: 100,
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <Badge variant={brand.isActive ? 'default' : 'secondary'}>
          {brand.isActive ? t('brands.active') : t('brands.inactive')}
        </Badge>
      );
    },
  },
  {
    id: 'contact',
    header: t('brands.contact'),
    enableSorting: false,
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="text-sm space-y-1">
          {brand.phone && (
            <div className="flex items-center space-x-1">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <span>{brand.phone}</span>
            </div>
          )}
          {brand.address?.city && brand.address?.country && (
            <div className="text-muted-foreground text-xs">
              {brand.address.city}, {brand.address.country}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: 'links',
    header: t('brands.links'),
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="flex space-x-1">
          {brand.website && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                window.open(brand.website, '_blank');
              }}
              className="h-7 px-2 text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              {t('brands.site')}
            </Button>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: t('brands.created'),
    enableSorting: true,
    size: 120,
    cell: ({ row }) => {
      const brand = row.original;
      return (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {new Date(brand.createdAt)?.toLocaleDateString() || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions'),
    enableSorting: false,
    size: 80,
    cell: ({ row }) => {
      const brand = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(brand);
              }}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('brands.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(brand);
              }}
              className="cursor-pointer text-destructive focus:text-destructive"
              disabled={brand.isActive ?? false} // Don't allow deleting active brands
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('brands.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Hook for using brand columns with current translation
export const useBrandColumns = (
  onEdit: (brand: Brand) => void,
  onDelete: (brand: Brand) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  return createBrandColumns(onEdit, onDelete, t, locale);
};

// Helper function to get sortable field from TanStack sorting state
export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];
  // Map TanStack column IDs to backend field names
  const fieldMap: Record<string, string> = {
    name: 'name.en', // or you might want to sort by name.en specifically
    status: 'isActive',
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
