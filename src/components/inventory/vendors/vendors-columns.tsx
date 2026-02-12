'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Vendor } from '@/types/vendors.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Eye, CreditCard } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// Column definitions for the vendor table
export const createVendorColumns = (
  onEdit: (vendor: Vendor) => void,
  onDelete: (vendor: Vendor) => void,
  onViewDetails: (vendor: Vendor) => void,
  onMakePayment: (vendor: Vendor) => void,
  t: ReturnType<typeof useTranslation>['t'],
): ColumnDef<Vendor>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: t('vendors.table.name') || 'Name',
    enableSorting: false,
    cell: ({ row }) => {
      const vendor = row.original;
      return <div className="font-medium text-sm">{vendor.name || '-'}</div>;
    },
  },
  {
    accessorKey: 'email',
    id: 'email',
    header: t('vendors.table.email') || 'Email',
    enableSorting: false,
    cell: ({ row }) => {
      const vendor = row.original;
      return <div className="text-sm">{vendor.email || '-'}</div>;
    },
  },
  {
    accessorKey: 'phone',
    id: 'phone',
    header: t('vendors.table.phone') || 'Phone',
    enableSorting: false,
    cell: ({ row }) => {
      const vendor = row.original;
      return <div className="text-sm">{vendor.phone || '-'}</div>;
    },
  },
  {
    accessorKey: 'gstNumber',
    id: 'gstNumber',
    header: t('vendors.table.gst') || 'GST No',
    enableSorting: false,
    cell: ({ row }) => {
      const vendor = row.original;
      return <div className="text-sm">{vendor.gstNumber || '-'}</div>;
    },
  },
  {
    accessorKey: 'panNumber',
    id: 'panNumber',
    header: t('vendors.table.pan') || 'PAN No',
    enableSorting: false,
    cell: ({ row }) => {
      const vendor = row.original;
      return <div className="text-sm">{vendor.panNumber || '-'}</div>;
    },
  },
  {
    accessorKey: 'paymentType',
    id: 'paymentType',
    header: t('vendors.table.paymentType') || 'Payment Type',
    enableSorting: false,
    cell: ({ row }) => {
      const vendor = row.original;
      return <div className="text-sm">{vendor.paymentType || '-'}</div>;
    },
  },
  {
    accessorKey: 'isActive',
    id: 'status',
    header: t('vendors.table.status') || 'Status',
    enableSorting: true,
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <Badge variant={vendor.isActive ? 'default' : 'secondary'}>
          {vendor.isActive ? t('common.active') : t('common.inactive')}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: t('table.actions') || 'Actions',
    enableSorting: false,
    size: 120,
    cell: ({ row }) => {
      const vendor = row.original;
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(vendor);
            }}
            title={t('vendors.actions.viewDetails') || 'View Details'}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(vendor);
            }}
            title={t('vendors.actions.edit') || 'Edit'}
            className="h-7 w-7 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMakePayment(vendor);
            }}
            title={t('vendors.actions.makePayment') || 'Make Payment'}
            className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <CreditCard className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// Hook for using vendor columns with current translation
export const useVendorColumns = (
  onEdit: (vendor: Vendor) => void,
  onDelete: (vendor: Vendor) => void,
  onViewDetails: (vendor: Vendor) => void,
  onMakePayment: (vendor: Vendor) => void,
) => {
  const { t } = useTranslation();
  return createVendorColumns(onEdit, onDelete, onViewDetails, onMakePayment, t);
};
