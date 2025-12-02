'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Bill, BillStatus, PaymentStatus } from '@/types/report.type';
import { EditableSelectCell } from '@/components/menu-management/menu-items/editable-cells-components';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface EditableBillColumnsConfig {
  onBillStatusChange: (billId: string, status: BillStatus) => Promise<void>;
  onPaymentStatusChange: (
    billId: string,
    status: PaymentStatus,
  ) => Promise<void>;
  onViewDetails: (bill: Bill) => void;
  loadingBills: Set<string>;
}

export function createEditableBillColumns(
  t: (key: string) => string,
  config: EditableBillColumnsConfig,
): ColumnDef<Bill>[] {
  const { onBillStatusChange, onViewDetails, loadingBills } = config;

  // Bill status options
  const billStatusOptions = [
    { value: BillStatus.ACTIVE, label: 'Active' },
    { value: BillStatus.COMPLETED, label: 'Completed' },
    { value: BillStatus.CANCELLED, label: 'Cancelled' },
  ];

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return [
    // Bill Number
    {
      accessorKey: 'billNumber',
      enableSorting: true,
      id: 'billNumber',
      header: t('reports.table.billNumber'),
      size: 150,
      cell: ({ row }) => {
        const bill = row.original;
        return <div className="font-medium text-sm">{bill.billNumber}</div>;
      },
    },

    // Customer Name
    {
      accessorKey: 'customerName',
      id: 'customerName',
      header: t('reports.table.customerName') || 'Customer',
      size: 180,
      cell: ({ row }) => {
        const bill = row.original;
        return <div className="text-sm">{bill.customerName || '-'}</div>;
      },
    },

    // Total Amount
    {
      accessorKey: 'totalAmount',
      id: 'totalAmount',
      header: t('reports.table.totalAmount'),
      size: 150,
      cell: ({ row }) => {
        const bill = row.original;
        return (
          <div className="font-medium text-sm">
            {formatCurrency(bill.totalAmount)}
          </div>
        );
      },
    },

    // Amount Paid
    {
      accessorKey: 'amountPaid',
      id: 'amountPaid',
      header: t('reports.table.amountPaid') || 'Amount Paid',
      size: 150,
      cell: ({ row }) => {
        const bill = row.original;
        return <div className="text-sm">{formatCurrency(bill.amountPaid)}</div>;
      },
    },

    // Bill Status (Editable)
    {
      accessorKey: 'status',
      id: 'status',
      header: t('reports.table.billStatus'),
      size: 180,
      cell: ({ row }) => {
        const bill = row.original;
        return (
          <EditableSelectCell
            value={bill.status}
            options={billStatusOptions}
            onChange={(value) =>
              onBillStatusChange(bill._id, value as BillStatus)
            }
            isLoading={loadingBills.has(bill._id)}
            placeholder="Select status"
          />
        );
      },
    },

    // Waiter Name
    {
      accessorKey: 'waiterName',
      id: 'waiterName',
      header: t('reports.table.waiter') || 'Waiter',
      size: 150,
      cell: ({ row }) => {
        const bill = row.original;
        return <div className="text-sm">{bill.waiterName || '-'}</div>;
      },
    },

    // Created At
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: t('reports.table.createdAt'),
      size: 180,
      cell: ({ row }) => {
        const bill = row.original;
        return (
          <div className="text-sm">
            {bill.createdAt ? new Date(bill.createdAt).toLocaleString() : '-'}
          </div>
        );
      },
    },

    // Actions
    {
      id: 'actions',
      header: t('table.actions'),
      size: 120,
      cell: ({ row }) => {
        const bill = row.original;
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(bill)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {t('reports.table.viewDetails')}
          </Button>
        );
      },
    },
  ];
}
