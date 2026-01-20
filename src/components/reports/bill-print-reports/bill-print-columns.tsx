import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Printer, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useI18n } from '@/providers/i18n-provider';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { PrintStatus } from '@/types/report.type';

export interface BillPrintReportItem {
  id: string;
  orderNumber: string;
  orderType: string;
  date: string;
  amount: number;
  status: PrintStatus;
  printCount: number;
}

export const useBillPrintColumns = (): ColumnDef<BillPrintReportItem>[] => {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const { data: orderTypesData } = useOrderTypes();
  const orderTypes = orderTypesData?.data || [];

  // Helper function to get display name for order type
  const getOrderTypeDisplayName = (orderType: string): string => {
    // First check in backend order types
    const orderTypeNameMap = orderTypes.reduce(
      (acc, orderTypeItem) => {
        acc[orderTypeItem._id] =
          orderTypeItem.name[locale] || orderTypeItem.name.en;
        return acc;
      },
      {} as Record<string, string>,
    );

    if (orderTypeNameMap[orderType]) {
      return orderTypeNameMap[orderType];
    }

    // Fallback to specific order types
    const typeMap: Record<string, string> = {
      DINE_IN: t('orderTypes.dine_in') || 'Dine In',
      TAKE_AWAY: t('orderTypes.take_away') || 'Take Away',
      QUICK_BILL: t('orderTypes.quick_bill') || 'Quick Bill',
      DELIVERY: t('orderTypes.delivery') || 'Delivery',
    };

    return typeMap[orderType] || orderType;
  };

  // Helper function to get badge color for order type
  const getOrderTypeBadgeColor = (orderType: string): string => {
    const colorMap: Record<string, string> = {
      DINE_IN: 'bg-blue-100 text-blue-800 border-blue-200',
      TAKE_AWAY: 'bg-green-100 text-green-800 border-green-200',
      QUICK_BILL: 'bg-amber-100 text-amber-800 border-amber-200',
      DELIVERY: 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colorMap[orderType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Helper function to get status display name
  const getStatusDisplayName = (status: PrintStatus): string => {
    switch (status) {
      case PrintStatus.FULFILLED:
        return t('reports.billPrint.status.fulfilled') || 'Fulfilled';
      case PrintStatus.PENDING:
        return t('reports.billPrint.status.pending') || 'Pending';
      case PrintStatus.CANCELLED:
        return t('reports.billPrint.status.cancelled') || 'Cancelled';
      default:
        return status;
    }
  };

  // Helper function to get status config
  const getStatusConfig = (status: PrintStatus) => {
    switch (status) {
      case PrintStatus.FULFILLED:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          text: getStatusDisplayName(status),
        };
      case PrintStatus.PENDING:
        return {
          icon: <Clock className="h-4 w-4" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          text: getStatusDisplayName(status),
        };
      case PrintStatus.CANCELLED:
        return {
          icon: <XCircle className="h-4 w-4" />,
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          text: getStatusDisplayName(status),
        };
      default:
        return {
          icon: null,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          text: getStatusDisplayName(status),
        };
    }
  };

  return [
    {
      accessorKey: 'orderNumber',
      header: t('reports.billPrint.columns.orderNumber') || 'Order Number',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('orderNumber')}</div>
      ),
    },
    {
      accessorKey: 'orderType',
      header: t('reports.billPrint.columns.orderType') || 'Order Type',
      cell: ({ row }) => {
        const type = row.getValue('orderType') as string;
        const displayName = getOrderTypeDisplayName(type);
        const badgeColor = getOrderTypeBadgeColor(type);

        return (
          <Badge variant="outline" className={badgeColor}>
            {displayName}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'date',
      header: t('reports.billPrint.columns.date') || 'Date & Time',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));
        return (
          <div className="whitespace-nowrap">
            {date.toLocaleDateString()}{' '}
            {date.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: t('reports.billPrint.columns.amount') || 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        return (
          <div className="font-semibold">
            {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: t('reports.billPrint.columns.status') || 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as PrintStatus;
        const config = getStatusConfig(status);

        return (
          <Badge
            variant="outline"
            className={`${config.bgColor} ${config.color} border-0 gap-1`}
          >
            {config.icon}
            {config.text}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'printCount',
      header: t('reports.billPrint.columns.printCount') || 'Print Count',
      cell: ({ row }) => {
        const count = row.getValue('printCount') as number;
        const status = row.getValue('status') as PrintStatus;

        if (status === PrintStatus.CANCELLED) {
          return <div className="text-muted-foreground">-</div>;
        }

        return (
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">{count}</span>
          </div>
        );
      },
    },
  ];
};
