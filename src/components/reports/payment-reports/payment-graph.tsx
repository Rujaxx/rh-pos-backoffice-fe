'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from 'recharts';
import { useTranslation } from '@/hooks/useTranslation';
import { PaymentMethodsEnum } from '@/types/report.type';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

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
  [PaymentMethodsEnum.CASH]: '#10b981', // green-500
  [PaymentMethodsEnum.CARD]: '#3b82f6', // blue-500
  [PaymentMethodsEnum.UPI]: '#8b5cf6', // purple-500
  [PaymentMethodsEnum.PAYTM]: '#f59e0b', // yellow-500
  [PaymentMethodsEnum.GOOGLE_PAY]: '#34d399', // emerald-400
  [PaymentMethodsEnum.FREE_CHARGE]: '#ef4444', // red-500
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethodsEnum, string> = {
  [PaymentMethodsEnum.CASH]: 'Cash',
  [PaymentMethodsEnum.CARD]: 'Card',
  [PaymentMethodsEnum.UPI]: 'UPI',
  [PaymentMethodsEnum.PAYTM]: 'Paytm',
  [PaymentMethodsEnum.GOOGLE_PAY]: 'Google Pay',
  [PaymentMethodsEnum.FREE_CHARGE]: 'Freecharge',
};

// Define the structure for chart data
interface ChartDataItem extends PaymentReportData {
  name: string;
  color: string;
}

// Custom Tooltip props interface
interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataItem;
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
}

export function PaymentReportChart({ data }: PaymentReportChartProps) {
  const { t } = useTranslation();

  // Format data for chart
  const chartData: ChartDataItem[] = data.map((item) => ({
    ...item,
    name: PAYMENT_METHOD_LABELS[item.paymentMethod] || item.paymentMethod,
    color: PAYMENT_METHOD_COLORS[item.paymentMethod] || '#6b7280',
  }));

  // Custom tooltip with proper TypeScript types
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-white dark:bg-gray-800 p-4 border rounded-lg shadow-lg dark:border-gray-700">
          <p className="font-semibold dark:text-white">{label}</p>
          <p className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Amount: </span>
            <span className="font-medium dark:text-white">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 0,
              }).format(data.amount)}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">Orders: </span>
            <span className="font-medium dark:text-white">
              {data.orderCount}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Percentage:{' '}
            </span>
            <span className="font-medium dark:text-white">
              {data.percentage.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f0f0"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis
            tickFormatter={(value) =>
              new Intl.NumberFormat('en-IN', {
                notation: 'compact',
                compactDisplay: 'short',
              }).format(value)
            }
            width={80}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="amount"
            name={t('reports.payment.chart.amount') || 'Amount'}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
