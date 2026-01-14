'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { ReportQueryParams } from '@/types/report.type';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';

export function DailySalesReportFilters({
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

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Order Types */}
      <div className="space-y-2">
        <Label>{t('orderTypes.title') || 'Order Types'}</Label>
        <MultiSelectDropdown
          options={orderTypeOptions}
          value={filters.orderTypeIds || []}
          onChange={(value) => handleMultiSelectChange('orderTypeIds', value)}
          placeholder={t('common.selectOrderTypes') || 'Select Order Types'}
        />
      </div>
    </div>
  );
}
