'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { useIntl } from 'react-intl';
import { MealTimeReportData } from '@/types/meal-time-report.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ChevronRight } from 'lucide-react';

export const MealTimeDataColumns = (): ColumnDef<MealTimeReportData>[] => {
  const { t } = useTranslation();
  const intl = useIntl();

  const localeMap: Record<string, string> = {
    en: 'en-GB',
    ar: 'ar-SA',
  };
  const localeCode = localeMap[intl.locale] || 'en-GB';

  const columns: ColumnDef<MealTimeReportData>[] = [
    {
      accessorKey: 'mealTimeName',
      header: t('reports.mealTime.columns.mealTime'),
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const mealTime = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">{mealTime.mealTimeName}</div>
            <div className="text-sm text-muted-foreground">
              {mealTime.startTime} - {mealTime.endTime}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'totalBills',
      header: t('reports.mealTime.columns.totalBills'),
      enableSorting: true,
      size: 120,
      cell: ({ row }) => {
        const value = row.original.totalBills;
        return (
          <div className="font-medium">{value.toLocaleString(localeCode)}</div>
        );
      },
    },
    {
      accessorKey: 'totalRevenue',
      header: t('reports.mealTime.columns.totalRevenue'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const value = row.original.totalRevenue;
        return (
          <div className="font-medium">₹{value.toLocaleString(localeCode)}</div>
        );
      },
    },
    {
      accessorKey: 'totalTax',
      header: t('reports.mealTime.columns.totalTax'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const value = row.original.totalTax;
        return (
          <div className="font-medium">₹{value.toLocaleString(localeCode)}</div>
        );
      },
    },
    {
      accessorKey: 'totalDiscount',
      header: t('reports.mealTime.columns.totalDiscount'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const value = row.original.totalDiscount;
        return (
          <div className="font-medium">₹{value.toLocaleString(localeCode)}</div>
        );
      },
    },
    {
      accessorKey: 'averageBillValue',
      header: t('reports.mealTime.columns.averageBillValue'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const value = row.original.averageBillValue;
        return (
          <div className="font-medium">₹{value.toLocaleString(localeCode)}</div>
        );
      },
    },
  ];

  return columns;
};
