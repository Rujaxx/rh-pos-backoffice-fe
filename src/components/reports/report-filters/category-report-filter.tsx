'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { useActiveCategories } from '@/services/api/categories/categories.queries';
import { Category } from '@/types/category.type';

export function CategoryReportFilters({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active categories for the dropdown
  const { data: categoriesData, isLoading } = useActiveCategories();

  // Prepare category options for dropdown - EXACT same pattern as OrderType
  const categoryOptions =
    categoriesData?.data?.map((category: Category) => ({
      label: category.name[locale] || category.name.en || category._id,
      value: category._id,
    })) || [];

  const handleCategoryChange = (value: string[]) => {
    onFilterChange({ ...filters, categoryIds: value });
  };

  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Categories Dropdown */}
      <div className="space-y-2">
        <Label>
          {t('reports.category.columns.categoryName') || 'Categories'}
        </Label>
        <MultiSelectDropdown
          options={categoryOptions}
          value={filters.categoryIds || []}
          onChange={handleCategoryChange}
          placeholder={
            t('reports.category.searchPlaceholder') || 'Select Categories'
          }
        />
      </div>
    </div>
  );
}
