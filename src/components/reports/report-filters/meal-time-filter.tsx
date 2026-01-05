'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useActiveMenus } from '@/services/api/menus/menus.queries';
import { useCategories } from '@/services/api/categories/categories.queries';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from '@/components/reports/report-filters/report-filters';
import { ReportQueryParams } from '@/types/report.type';

export function MealTimeReportFilters({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active menus and categories
  const { data: menusData } = useActiveMenus();
  const { data: categoriesData } = useCategories();

  const menus = menusData?.data || [];
  const categories = categoriesData?.data || [];

  // Options for dropdowns - Matching exactly your other report patterns
  const menuOptions = menus.map((menu) => ({
    label: menu.name[locale] || menu.name.en,
    value: menu._id!,
  }));

  const categoryOptions = categories.map((category) => ({
    label: category.name[locale] || category.name.en,
    value: category._id!,
  }));

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <>
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

        {/* Categories */}
        <div className="space-y-2">
          <Label>{t('categories.title') || 'Categories'}</Label>
          <MultiSelectDropdown
            options={categoryOptions}
            value={
              Array.isArray(filters.categoryIds) ? filters.categoryIds : []
            }
            onChange={(value) => handleMultiSelectChange('categoryIds', value)}
            placeholder={t('common.selectCategories') || 'Select Categories'}
          />
        </div>
      </div>
    </>
  );
}
