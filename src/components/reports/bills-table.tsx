'use client';

import React, { useMemo } from 'react';
import { Bill, BillStatus, PaymentStatus } from '@/types/report.type';
import { useTranslation } from '@/hooks/useTranslation';
import { TanStackTable } from '@/components/ui/tanstack-table';
import { createEditableBillColumns } from './editable-bill-columns';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface BillsTableProps {
  bills: Bill[];
  isLoading: boolean;
  onBillStatusChange: (billId: string, status: BillStatus) => Promise<void>;
  onPaymentStatusChange: (
    billId: string,
    status: PaymentStatus,
  ) => Promise<void>;
  onViewDetails: (bill: Bill) => void;
  loadingBills: Set<string>;
}

export function BillsTable({
  bills,
  isLoading,
  onBillStatusChange,
  onPaymentStatusChange,
  onViewDetails,
  loadingBills,
}: BillsTableProps) {
  const { t } = useTranslation();

  // Create columns with config
  const columns = useMemo(
    () =>
      createEditableBillColumns(t, {
        onBillStatusChange,
        onPaymentStatusChange,
        onViewDetails,
        loadingBills,
      }),
    [t, onBillStatusChange, onPaymentStatusChange, onViewDetails, loadingBills],
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bills.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {t('reports.noDataFound')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {t('reports.salesReports.billsList')}
          </h3>
          <TanStackTable
            data={bills}
            columns={columns}
            manualSorting={false}
            manualPagination={false}
            showSearch={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
