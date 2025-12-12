'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { Customer } from '@/types/customers.type';

export const createCustomerColumns = (
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void,
  t: ReturnType<typeof useTranslation>['t'],
  locale: string,
): ColumnDef<Customer>[] => {
  return [
    {
      accessorKey: 'name',
      id: 'name',
      header: t('customer.name'),
      enableSorting: true, // Keep sortable
      sortingFn: (rowA, rowB) =>
        (rowA.original.name || '').localeCompare(rowB.original.name || ''),
      cell: ({ row }) => (
        <div className="font-medium text-sm">{row.original.name}</div>
      ),
    },
    {
      accessorKey: 'countryCode',
      id: 'countryCode',
      header: t('customer.dialCode'),
      enableSorting: false, // Make NOT sortable
      cell: ({ row }) => (
        <div className="text-sm">{row.original.countryCode}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      id: 'phoneNumber',
      header: t('customer.phoneNumber'),
      enableSorting: false, // Make NOT sortable
      cell: ({ row }) => (
        <div className="text-sm">{row.original.phoneNumber}</div>
      ),
    },
    {
      accessorKey: 'address.country',
      id: 'country',
      header: t('customer.country'),
      enableSorting: false, // Make NOT sortable
      cell: ({ row }) => (
        <div className="text-sm">{row.original.address?.country || '-'}</div>
      ),
    },
    {
      accessorKey: 'loyaltyPoints',
      id: 'loyaltyPoints',
      header: t('customer.loyaltyPoints'),
      enableSorting: false, // Make NOT sortable
      cell: ({ row }) => (
        <div className="text-sm">{row.original.loyaltyPoints ?? 0}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: t('customer.createdAt'),
      enableSorting: true, // Keep sortable
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm">
            {date.toLocaleDateString(locale, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
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
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(customer);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                {t('common.edit')}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(customer);
                }}
                className="text-destructive"
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

export const useCustomersColumns = (
  onEdit: (customer: Customer) => void,
  onDelete: (customer: Customer) => void,
) => {
  const { t } = useTranslation();
  const { locale } = useI18n();

  return createCustomerColumns(onEdit, onDelete, t, locale);
};

export const getSortFieldForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): string | undefined => {
  if (!sorting.length) return undefined;

  const sort = sorting[0];

  // Only allow these fields to be sorted
  const allowedSortFields = ['name', 'createdAt'];

  // If the field is not in allowed list, return undefined
  if (!allowedSortFields.includes(sort.id)) {
    return undefined;
  }

  const fieldMap: Record<string, string> = {
    name: 'name',
    createdAt: 'createdAt',
  };

  return fieldMap[sort.id];
};

export const getSortOrderForQuery = (
  sorting: Array<{ id: string; desc: boolean }>,
): 'asc' | 'desc' | undefined => {
  if (!sorting.length) return undefined;

  // Check if the sorting field is allowed
  const allowedSortFields = ['name', 'createdAt'];
  if (!allowedSortFields.includes(sorting[0].id)) {
    return undefined;
  }

  return sorting[0].desc ? 'desc' : 'asc';
};
