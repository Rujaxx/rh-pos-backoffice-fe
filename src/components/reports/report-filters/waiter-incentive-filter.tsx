'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { ReportQueryParams } from '@/types/report.type';
import { useActiveUsers } from '@/services/api/users/users.queries';
import { useMenuItems } from '@/services/api/menu-items/menu-items.queries';

export function WaiterIncentiveFilter({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch all active users (we'll filter waiters client-side)
  const { data: usersData } = useActiveUsers();

  // Fetch menu items
  const { data: menuItemsData } = useMenuItems({
    brandId: filters.brandIds?.[0],
    restaurantId: filters.restaurantIds?.[0],
    isActive: 'true',
  });

  // Filter waiters from all users - check role name
  const allUsers = usersData?.data || [];
  const waiters = allUsers.filter((user) => {
    const roleName = user.role?.name?.[locale] || user.role?.name?.en || '';
    return (
      roleName.toLowerCase().includes('waiter') ||
      roleName.toLowerCase().includes('wait') ||
      roleName.toLowerCase().includes('service')
    );
  });

  const menuItems = menuItemsData?.data || [];

  const waiterOptions = waiters.map((waiter) => ({
    label: waiter.name || waiter.email || 'Unknown',
    value: waiter._id!,
  }));

  const menuItemOptions = menuItems.map((item) => ({
    label: `${item.shortCode || ''} - ${item.itemName?.[locale] || item.itemName?.en || 'Unknown'}`,
    value: item._id!,
  }));

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const getStringArrayValue = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map((v) => String(v));
    }
    if (typeof value === 'string' && value) {
      return [value];
    }
    return [];
  };

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Waiter Name */}
      <div className="space-y-2">
        <Label>
          {t('reports.waiterIncentive.waiterName') || 'Waiter Name'}
        </Label>
        <MultiSelectDropdown
          options={waiterOptions}
          value={getStringArrayValue(filters.waiterIds)}
          onChange={(value) => handleMultiSelectChange('waiterIds', value)}
          placeholder={t('common.selectWaiter') || 'Select Waiter'}
        />
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <Label>{t('reports.waiterIncentive.menuItems') || 'Menu Items'}</Label>
        <MultiSelectDropdown
          options={menuItemOptions}
          value={getStringArrayValue(filters.menuItemIds)}
          onChange={(value) => handleMultiSelectChange('menuItemIds', value)}
          placeholder={t('common.selectMenuItems') || 'Select Menu Items'}
        />
      </div>
    </div>
  );
}
