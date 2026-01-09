'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { PaymentMethodsEnum } from '@/types/payment-report.type';
import { GenericBarChart } from '@/components/ui/generic-bar-chart';
import type { ChartConfig } from '@/components/ui/chart';

interface PaymentReportData {
  paymentMethod: PaymentMethodsEnum;
  amount: number;
  orderCount: number;
  percentage: number;
  averageValue: number;
}

interface PaymentReportChartProps {
  data: PaymentReportData[];
}

const PAYMENT_METHOD_COLORS: Record<PaymentMethodsEnum, string> = {
  [PaymentMethodsEnum.CASH]: 'hsl(142, 76%, 36%)', // green-600
  [PaymentMethodsEnum.CARD]: 'hsl(217, 91%, 60%)', // blue-500
  [PaymentMethodsEnum.UPI]: 'hsl(258, 90%, 66%)', // purple-500
  [PaymentMethodsEnum.PHONEPE]: 'hsl(24, 90%, 60%)', //orange-500
  [PaymentMethodsEnum.WALLET]: '',
  [PaymentMethodsEnum.NET_BANKING]: '',
  [PaymentMethodsEnum.OTHER]: '',
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethodsEnum, string> = {
  [PaymentMethodsEnum.CASH]: 'Cash',
  [PaymentMethodsEnum.CARD]: 'Card',
  [PaymentMethodsEnum.UPI]: 'UPI',
  [PaymentMethodsEnum.PHONEPE]: 'PhonePe',
  [PaymentMethodsEnum.WALLET]: 'Wallet',
  [PaymentMethodsEnum.NET_BANKING]: 'Net Banking',
  [PaymentMethodsEnum.OTHER]: 'Other',
};

export function PaymentReportChart({ data }: PaymentReportChartProps) {
  const { t } = useTranslation();

  // Format data for chart
  const chartData = data.map((item) => ({
    ...item,
    name: PAYMENT_METHOD_LABELS[item.paymentMethod] || item.paymentMethod,
    color: PAYMENT_METHOD_COLORS[item.paymentMethod] || 'hsl(var(--muted))',
  }));

  // Create chart config
  const chartConfig: ChartConfig = {
    amount: {
      label: t('reports.payment.chart.amount') || 'Amount',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <GenericBarChart
      data={chartData}
      config={chartConfig}
      dataKeys={['amount']}
      xAxisKey="name"
      isStacked={false}
      isCollapsible={false}
      showXAxis={true}
      showLegend={false}
      xAxisFormatter={(value) => String(value)}
      yAxisFormatter={(value) =>
        new Intl.NumberFormat('en-IN', {
          notation: 'compact',
          compactDisplay: 'short',
        }).format(value)
      }
      tooltipFormatter={(value, name, item) => {
        const data = item?.payload;
        if (!data) return null;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">
                {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                }).format(data.amount)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Orders:</span>
              <span className="font-medium">{data.orderCount}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Percentage:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
          </div>
        );
      }}
      height="h-[400px]"
      barRadius={4}
    />
  );
}
