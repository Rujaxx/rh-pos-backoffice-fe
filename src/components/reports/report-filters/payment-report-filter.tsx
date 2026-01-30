'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { ReportQueryParams } from '@/types/report.type';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { BillStatus } from '@/types/bill.type';

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

  const billStatusOptions = Object.values(BillStatus).map((status) => ({
    label: status,
    value: status,
  }));

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
        <Label>{t('reports.filters.billStatus') || 'Bill Status'}</Label>
        <MultiSelectDropdown
          options={billStatusOptions}
          value={filters.billStatus || []}
          onChange={(value) => handleMultiSelectChange('billStatus', value)}
          placeholder={
            t('reports.filters.selectBillStatus') || 'Select Bill Status'
          }
        />
      </div>
    </div>
  );
}
