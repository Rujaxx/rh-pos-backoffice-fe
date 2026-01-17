'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { ReportQueryParams } from '@/types/report.type';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { useActiveUsers } from '@/services/api/users/users.queries';
import { useActiveDiscounts } from '@/services/api/discounts/discounts.queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function DiscountReportFilters({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active order types, users, and discount types
  const { data: orderTypesData } = useOrderTypes();
  const { data: usersData } = useActiveUsers();
  const { data: discountsData } = useActiveDiscounts();

  const orderTypes = orderTypesData?.data || [];
  const users = usersData?.data || [];
  const discounts = discountsData?.data || [];

  const orderTypeOptions = orderTypes.map((orderType) => ({
    label: orderType.name[locale] || orderType.name.en,
    value: orderType._id!,
  }));

  const userOptions = users.map((user) => ({
    label: user.name || user.email,
    value: user._id!,
  }));

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleDiscountStatusChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === 'ALL') {
      // Use a special value like 'ALL' instead of empty string
      delete newFilters.discountStatus;
    } else {
      newFilters.discountStatus = value;
    }
    onFilterChange(newFilters);
  };

  // Discount status options
  const discountStatusOptions = [
    { value: 'ALL', label: 'All' }, // Use 'ALL' instead of empty string
    { value: 'FULFILLED', label: 'Fulfilled' },
    { value: 'FREE', label: 'Free' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const getStringArrayValue = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v));
    }
    return [];
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Order Types */}
      <div className="space-y-2">
        <Label>{t('orderTypes.title') || 'Order Types'}</Label>
        <MultiSelectDropdown
          options={orderTypeOptions}
          value={getStringArrayValue(filters.orderTypeIds)}
          onChange={(value) => handleMultiSelectChange('orderTypeIds', value)}
          placeholder={t('common.selectOrderTypes') || 'Select Order Types'}
        />
      </div>

      {/* User Name */}
      <div className="space-y-2">
        <Label>{t('reports.discount.username') || 'User Name'}</Label>
        <MultiSelectDropdown
          options={userOptions}
          value={getStringArrayValue(filters.userIds)}
          onChange={(value) => handleMultiSelectChange('userIds', value)}
          placeholder={t('common.selectUser') || 'Select User'}
        />
      </div>

      {/* Discount Status */}
      <div className="space-y-2">
        <Label>
          {t('reports.discount.discountStatus') || 'Discount Status'}
        </Label>
        <Select
          value={
            filters.discountStatus ? String(filters.discountStatus) : 'ALL'
          } // Default to 'ALL' if no status selected
          onValueChange={handleDiscountStatusChange}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={t('common.selectStatus') || 'Select Status'}
            />
          </SelectTrigger>
          <SelectContent>
            {discountStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
