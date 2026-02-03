'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/hooks/useTranslation';
import { useIntl } from 'react-intl';
import { MealTimeReportItem } from '@/types/meal-time-report.type';

export const MealTimeDataColumns = (): ColumnDef<MealTimeReportItem>[] => {
  const { t } = useTranslation();
  const intl = useIntl();

  const localeMap: Record<string, string> = {
    en: 'en-GB',
    ar: 'ar-SA',
  };
  const localeCode = localeMap[intl.locale] || 'en-GB';

  const columns: ColumnDef<MealTimeReportItem>[] = [
    {
      accessorKey: 'name',
      header: t('reports.mealTime.columns.mealTime'),
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        const mealTime = row.original;
        return (
          <div className="space-y-1">
            <div className="font-medium">{mealTime.name}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'slot',
      header: t('reports.mealTime.columns.timeSlot'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        return <div className="text-sm font-medium">{row.original.slot}</div>;
      },
    },
    {
      accessorKey: 'totalOrders',
      header: t('reports.mealTime.columns.totalOrders'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const value = row.original.totalOrders;
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
      accessorKey: 'avgOrderValue',
      header: t('reports.mealTime.columns.avgOrderValue'),
      enableSorting: true,
      size: 150,
      cell: ({ row }) => {
        const value = row.original.avgOrderValue;
        return (
          <div className="font-medium">₹{value.toLocaleString(localeCode)}</div>
        );
      },
    },
    {
      accessorKey: 'topSellingItem',
      header: t('reports.mealTime.columns.topSellingItem'),
      enableSorting: true,
      size: 200,
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.topSellingItem}</div>;
      },
    },
  ];

  return columns;
};
