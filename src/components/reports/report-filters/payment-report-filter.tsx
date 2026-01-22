'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { ReportQueryParams } from '@/types/report.type';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PaymentReportFilters({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active brands, restaurants, menus, and order types
  const { data: orderTypesData } = useOrderTypes();

  const orderTypes = orderTypesData?.data || [];

  const orderTypeOptions = orderTypes.map((orderType) => ({
    label: orderType.name[locale] || orderType.name.en,
    value: orderType._id!,
  }));

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const orderStatusOptions = [
    { value: 'all', label: t('common.all') },
    { value: 'pending', label: t('order.status.pending') || 'Pending' },
    { value: 'completed', label: t('order.status.completed') || 'Completed' },
    { value: 'cancelled', label: t('order.status.cancelled') || 'Cancelled' },
  ];
  const handleOrderStatusChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === 'all') {
      delete newFilters.status;
    } else {
      newFilters.status = value;
    }
    onFilterChange(newFilters);
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Order Types */}
      <div className="space-y-2">
        <Label>{t('orderTypes.title')}</Label>
        <MultiSelectDropdown
          options={orderTypeOptions}
          value={filters.orderTypeIds || []}
          onChange={(value) => handleMultiSelectChange('orderTypeIds', value)}
          placeholder={t('common.selectOrderTypes') || 'Select Order Types'}
        />
      </div>
      <div className="space-y-2">
        <Label>{t('order.status.title')}</Label>
        <Select
          value={filters.status ? String(filters.status) : undefined}
          onValueChange={handleOrderStatusChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select order status" />
          </SelectTrigger>
          <SelectContent>
            {orderStatusOptions.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
