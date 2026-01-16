'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { Customer } from '@/types/customers.type';
import { TableActions } from '@/components/ui/table-actions';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, MapPin, Award, MessageCircle } from 'lucide-react';
import { getFallbackAvatarUrl } from '@/lib/upload-utils';
import { getCountryCallingCode, CountryCode } from 'libphonenumber-js';

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
      enableSorting: true,
      sortingFn: (rowA, rowB) =>
        (rowA.original.name || '').localeCompare(rowB.original.name || ''),
      cell: ({ row }) => {
        const customer = row.original;

        // Convert ISO country code to dial code
        let dialCode = customer.countryCode;
        try {
          if (customer.countryCode && customer.countryCode.length === 2) {
            dialCode =
              '+' + getCountryCallingCode(customer.countryCode as CountryCode);
          }
        } catch {
          // Keep original countryCode if conversion fails
        }

        const fullPhone =
          dialCode && customer.phoneNumber
            ? `${dialCode} ${customer.phoneNumber}`
            : customer.phoneNumber || '-';

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border">
              <AvatarImage
                src={getFallbackAvatarUrl(customer.name)}
                alt={customer.name}
              />
              <AvatarFallback>
                {customer.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm leading-none">
                {customer.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Phone className="h-3 w-3" />
                <span>{fullPhone}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'address.country',
      id: 'location',
      header: t('customer.location'), // You might need to add this key or reuse 'address'
      enableSorting: false,
      cell: ({ row }) => {
        const customer = row.original;

        // Helper to check if address has meaningful data
        const hasAddressData = (addr: typeof customer.address) =>
          addr && (addr.city || addr.country || addr.addressLine1);

        // 1. Try primary address first
        let addr = hasAddressData(customer.address) ? customer.address : null;

        // 2. Fallback to addresses array
        if (!addr && customer.addresses && customer.addresses.length > 0) {
          // Find default address
          const defaultAddr = customer.addresses.find((a) => a.isDefault);
          addr = defaultAddr || customer.addresses[0];
        }

        if (!addr) return <span className="text-muted-foreground">-</span>;

        const locationStr = [addr.city, addr.country]
          .filter(Boolean)
          .join(', ');

        if (!locationStr)
          return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{locationStr}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'loyaltyPoints',
      id: 'loyaltyPoints',
      header: t('customer.loyaltyPoints'),
      enableSorting: true,
      cell: ({ row }) => {
        const points = row.original.loyaltyPoints ?? 0;
        return (
          <Badge
            variant="outline"
            className="flex w-fit items-center gap-1 font-mono"
          >
            <Award className="h-3.5 w-3.5 text-amber-500" />
            {points}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: t('customer.joined'), // Changed to "Joined" conceptually
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString(locale, {
              day: 'numeric',
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
      size: 100,
      cell: ({ row }) => {
        const customer = row.original;

        // Construct WhatsApp link using proper dial code from ISO country code
        let whatsappLink: string | undefined;
        if (customer.phoneNumber) {
          let dialCode = '';
          try {
            if (customer.countryCode && customer.countryCode.length === 2) {
              dialCode = getCountryCallingCode(
                customer.countryCode as CountryCode,
              );
            }
          } catch {
            // Fallback: try using countryCode as-is if it looks like a dial code
            dialCode = customer.countryCode?.replace('+', '') || '';
          }

          if (dialCode) {
            whatsappLink = `https://wa.me/${dialCode}${customer.phoneNumber}`;
          }
        }

        return (
          <TableActions
            onEdit={() => onEdit(customer)}
            onDelete={() => onDelete(customer)}
            editLabel={t('common.edit')}
            deleteLabel={t('common.delete')}
            additionalActions={[
              ...(whatsappLink
                ? [
                    {
                      label: 'WhatsApp',
                      icon: (
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      ),
                      onClick: () => window.open(whatsappLink, '_blank'),
                    },
                  ]
                : []),
              // Placeholder for future history feature
              // {
              //   label: 'Order History',
              //   icon: <History className="h-4 w-4" />,
              //   onClick: () => console.log('View history', customer._id),
              // }
            ]}
          />
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
