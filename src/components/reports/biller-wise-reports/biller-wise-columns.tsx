import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { BillerWiseReportResponseDto } from '@/types/biller-wise-report.type';

export const useBillerWiseColumns =
  (): ColumnDef<BillerWiseReportResponseDto>[] => {
    const { t } = useTranslation();

    return [
      {
        accessorKey: 'billerName',
        header: t('reports.billerWise.columns.billerName') || 'Biller Name',
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue('billerName') || '—'}</div>
        ),
      },
      {
        accessorKey: 'totalBills',
        header: t('reports.billerWise.columns.totalBills') || 'Total Bills',
        cell: ({ row }) => (
          <div className="text-center">{row.getValue('totalBills')}</div>
        ),
      },
      {
        accessorKey: 'fulfilledBills',
        header:
          t('reports.billerWise.columns.fulfilledBills') || 'Fulfilled Bills',
        cell: ({ row }) => (
          <div className="text-center text-green-600">
            {row.getValue('fulfilledBills')}
          </div>
        ),
      },
      {
        accessorKey: 'cancelledBills',
        header:
          t('reports.billerWise.columns.cancelledBills') || 'Cancelled Bills',
        cell: ({ row }) => (
          <div className="text-center text-red-500">
            {row.getValue('cancelledBills')}
          </div>
        ),
      },
      {
        accessorKey: 'cancelledItems',
        header:
          t('reports.billerWise.columns.cancelledItems') || 'Cancelled Items',
        cell: ({ row }) => (
          <div className="text-center text-red-500">
            {row.getValue('cancelledItems')}
          </div>
        ),
      },
      {
        accessorKey: 'complementaryItems',
        header:
          t('reports.billerWise.columns.complementaryItems') ||
          'Complementary Items',
        cell: ({ row }) => (
          <div className="text-center text-amber-600">
            {row.getValue('complementaryItems')}
          </div>
        ),
      },
      {
        accessorKey: 'totalRevenue',
        header: t('reports.billerWise.columns.totalRevenue') || 'Total Revenue',
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('totalRevenue'));
          return (
            <div className="text-right font-bold text-green-600">
              {amount.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
              })}
            </div>
          );
        },
      },
    ];
  };
