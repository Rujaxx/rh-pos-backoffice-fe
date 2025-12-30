'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useActiveMenus } from '@/services/api/menus/menus.queries';
import { useI18n } from '@/providers/i18n-provider';
import { BillStatus, PaymentMethods } from '@/types/bill.type';
import { ReportFiltersProps } from './report-filters';
import { ReportQueryParams } from '@/types/report.type';

export function SalesReportFilters({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active brands, restaurants, menus, and order types
  const { data: menusData } = useActiveMenus();

  const menus = menusData?.data || [];

  // Options for dropdowns
  const menuOptions = menus.map((menu) => ({
    label: menu.name[locale] || menu.name.en,
    value: menu._id!,
  }));

  const paymentModeOptions = Object.values(PaymentMethods).map((mode) => ({
    label: t(`paymentMethods.${mode.label}`),
    value: mode.value,
  }));

  const billStatusOptions = Object.values(BillStatus).map((status) => ({
    label: status,
    value: status,
  }));

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Menus */}
      <div className="space-y-2">
        <Label>{t('menus.title') || 'Menus'}</Label>
        <MultiSelectDropdown
          options={menuOptions}
          value={filters.menuIds || []}
          onChange={(value) => handleMultiSelectChange('menuIds', value)}
          placeholder={t('common.selectMenus') || 'Select Menus'}
        />
      </div>
      {/* Payment Modes */}
      <div className="space-y-2">
        <Label>{t('reports.filters.paymentModes') || 'Payment Modes'}</Label>
        <MultiSelectDropdown
          options={paymentModeOptions}
          value={filters.paymentMethods || []}
          onChange={(value) => handleMultiSelectChange('paymentMethods', value)}
          placeholder={
            t('reports.filters.selectPaymentModes') || 'Select Modes'
          }
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
