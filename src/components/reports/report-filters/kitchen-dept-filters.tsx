'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { useActiveCategories } from '@/services/api/categories/categories.queries';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { useActiveKitchenDepartments } from '@/services/api/kitchen-departments/kitchen-departments.queries';
import { Category } from '@/types/category.type';
import { KitchenDepartment } from '@/types/kitchen-department.type';

export function KitchenDepartmentReportFilters({
  filters,
  onFilterChange,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active kitchen departments for the dropdown
  const { data: kitchenDepartmentsData, isLoading: kitchenDeptLoading } =
    useActiveKitchenDepartments();

  // Fetch active categories for the dropdown
  const { data: categoriesData, isLoading: categoriesLoading } =
    useActiveCategories();

  // Fetch order types
  const { data: orderTypesData } = useOrderTypes();

  // Prepare kitchen department options for dropdown
  const kitchenDepartmentOptions =
    kitchenDepartmentsData?.data?.map((dept: KitchenDepartment) => ({
      label: dept.name[locale] || dept.name.en || dept._id,
      value: dept._id,
    })) || [];

  // Prepare category options for dropdown
  const categoryOptions =
    categoriesData?.data?.map((category: Category) => ({
      label: category.name[locale] || category.name.en || category._id,
      value: category._id,
    })) || [];

  // Prepare order type options
  const orderTypeOptions =
    orderTypesData?.data?.map((orderType) => ({
      label: orderType.name[locale] || orderType.name.en,
      value: orderType._id!,
    })) || [];

  const handleKitchenDepartmentChange = (value: string[]) => {
    onFilterChange({ ...filters, kitchenDepartmentIds: value });
  };

  const handleCategoryChange = (value: string[]) => {
    onFilterChange({ ...filters, categoryIds: value });
  };

  const handleOrderTypeChange = (value: string[]) => {
    onFilterChange({ ...filters, orderTypeIds: value });
  };

  // Ensure values are always arrays
  const kitchenDepartmentValue = Array.isArray(filters.kitchenDepartmentIds)
    ? filters.kitchenDepartmentIds
    : [];
  const categoryValue = Array.isArray(filters.categoryIds)
    ? filters.categoryIds
    : [];
  const orderTypeValue = Array.isArray(filters.orderTypeIds)
    ? filters.orderTypeIds
    : [];

  return (
    <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Kitchen Departments Dropdown */}
      <div className="space-y-2">
        <Label>
          {t('reports.kitchenDepartment.columns.kitchenDepartment') ||
            'Kitchen Departments'}
        </Label>
        <MultiSelectDropdown
          options={kitchenDepartmentOptions}
          value={kitchenDepartmentValue}
          onChange={handleKitchenDepartmentChange}
          placeholder={
            t('reports.kitchenDepartment.searchPlaceholder') ||
            'Select Kitchen Departments'
          }
        />
      </div>

      {/* Categories Dropdown */}
      <div className="space-y-2">
        <Label>
          {t('reports.category.columns.categoryName') || 'Categories'}
        </Label>
        <MultiSelectDropdown
          options={categoryOptions}
          value={categoryValue}
          onChange={handleCategoryChange}
          placeholder={
            t('reports.category.searchPlaceholder') || 'Select Categories'
          }
        />
      </div>

      {/* Order Types Dropdown */}
      <div className="space-y-2">
        <Label>{t('orderTypes.title') || 'Order Types'}</Label>
        <MultiSelectDropdown
          options={orderTypeOptions}
          value={orderTypeValue}
          onChange={handleOrderTypeChange}
          placeholder={t('common.selectOrderTypes') || 'Select Order Types'}
        />
      </div>
    </div>
  );
}
