'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/providers/i18n-provider';
import { ReportFiltersProps } from './report-filters';
import { useActiveMenus } from '@/services/api/menus/menus.queries';
import { useActiveCategories } from '@/services/api/categories/categories.queries';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { useActiveTaxProductGroups } from '@/services/api/tax-product-groups.ts/tax-product-groups.queries';
import { BillStatus, PaymentMethodsEnum } from '@/types/bill.type';
import { ReportQueryParams } from '@/types/report.type';
import { Menu } from '@/types/menu.type';
import { Category } from '@/types/category.type';
import { OrderType } from '@/types/order-type.type';
import { TaxProductGroup } from '@/types/tax-product-group.type';
import { Input } from '@/components/ui/input';

export interface ItemReportFilterProps extends ReportFiltersProps {
  activeTab: 'sold-items' | 'complimentary' | 'kot-items' | 'bill-details';
}

export function ItemReportFilter({
  filters,
  onFilterChange,
  onClearFilters,
  activeTab,
}: ItemReportFilterProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch data for dropdowns
  const { data: menusData } = useActiveMenus();
  const { data: categoriesData } = useActiveCategories();
  const { data: orderTypesData } = useOrderTypes();
  const { data: taxProductGroupsData } = useActiveTaxProductGroups();

  const menus: Menu[] = menusData?.data || [];
  const categories: Category[] = categoriesData?.data || [];
  const orderTypes: OrderType[] = orderTypesData?.data || [];
  const taxProductGroups: TaxProductGroup[] = taxProductGroupsData?.data || [];

  // Prepare options - ensure label is always a string
  const menuOptions = menus.map((menu: Menu) => {
    const name = menu.name;
    let label = '';

    if (typeof name === 'string') {
      label = name;
    } else if (name && typeof name === 'object') {
      // Handle multilingual object
      label = name[locale] || name.en || String(name);
    }

    return {
      label: label || menu._id || '',
      value: menu._id!,
    };
  });

  const categoryOptions = categories.map((category: Category) => {
    const name = category.name;
    let label = '';

    if (typeof name === 'string') {
      label = name;
    } else if (name && typeof name === 'object') {
      // Handle multilingual object
      label = name[locale] || name.en || String(name);
    }

    return {
      label: label || category._id || '',
      value: category._id!,
    };
  });

  const orderTypeOptions = orderTypes.map((orderType: OrderType) => {
    const name = orderType.name;
    let label = '';

    if (typeof name === 'string') {
      label = name;
    } else if (name && typeof name === 'object') {
      // Handle multilingual object
      label = name[locale] || name.en || String(name);
    }

    return {
      label: label || orderType._id! || '',
      value: orderType._id!,
    };
  });

  const taxProductGroupOptions = taxProductGroups.map(
    (group: TaxProductGroup) => {
      const name = group.name;
      let label = '';

      if (typeof name === 'string') {
        label = name;
      } else if (name && typeof name === 'object') {
        // Handle multilingual object
        label = name[locale] || name.en || String(name);
      }

      return {
        label: label || group._id || '',
        value: group._id,
      };
    },
  );

  // Bill Status Options
  const billStatusOptions = Object.values(BillStatus).map((status) => ({
    label: status,
    value: status,
  }));

  // Payment Method Options
  const paymentModeOptions = Object.values(PaymentMethodsEnum).map(
    (method) => ({
      label: method,
      value: method,
    }),
  );

  // Handler function - simplified to match PaymentReportFilters pattern
  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  // Tax Product Group Filter
  const renderTaxProductGroupFilter = () => (
    <div className="space-y-2">
      <Label>{t('taxProductGroups.title')}</Label>
      <MultiSelectDropdown
        options={taxProductGroupOptions}
        value={filters.taxProductGroupIds || []}
        onChange={(value) =>
          handleMultiSelectChange('taxProductGroupIds', value)
        }
        placeholder={t('common.selectTaxProductGroups')}
      />
    </div>
  );

  // Menu Filter
  const renderMenuFilter = () => (
    <div className="space-y-2">
      <Label>{t('menus.title')}</Label>
      <MultiSelectDropdown
        options={menuOptions}
        value={filters.menuIds || []}
        onChange={(value) => handleMultiSelectChange('menuIds', value)}
        placeholder={t('common.selectMenus')}
      />
    </div>
  );

  // Category Filter
  const renderCategoryFilter = () => (
    <div className="space-y-2">
      <Label>{t('categories.title')}</Label>
      <MultiSelectDropdown
        options={categoryOptions}
        value={filters.categoryIds || []}
        onChange={(value) => handleMultiSelectChange('categoryIds', value)}
        placeholder={t('common.selectCategories')}
      />
    </div>
  );

  // Order Type Filter
  const renderOrderTypeFilter = () => (
    <div className="space-y-2">
      <Label>{t('orderTypes.title')}</Label>
      <MultiSelectDropdown
        options={orderTypeOptions}
        value={filters.orderTypeIds || []}
        onChange={(value) => handleMultiSelectChange('orderTypeIds', value)}
        placeholder={t('common.selectOrderTypes')}
      />
    </div>
  );

  // Bill Status Filter
  const renderBillStatusFilter = () => (
    <div className="space-y-2">
      <Label>{t('reports.filters.billStatus')}</Label>
      <MultiSelectDropdown
        options={billStatusOptions}
        value={filters.billStatus || []}
        onChange={(value) => handleMultiSelectChange('billStatus', value)}
        placeholder={t('reports.filters.selectBillStatus')}
      />
    </div>
  );

  // Payment Method Filter
  const renderPaymentMethodFilter = () => (
    <div className="space-y-2">
      <Label>{t('reports.filters.paymentModes')}</Label>
      <MultiSelectDropdown
        options={paymentModeOptions}
        value={filters.paymentMethods || []}
        onChange={(value) => handleMultiSelectChange('paymentMethods', value)}
        placeholder={t('reports.filters.selectPaymentModes')}
      />
    </div>
  );

  // Top Filter
  const renderTopFilter = () => (
    <div className="space-y-2">
      <Label>{t('common.top')}</Label>
      <Input
        type="number"
        placeholder={t('common.topPlaceholder')}
        value={filters.top || ''}
        onChange={(e) =>
          onFilterChange({
            ...filters,
            top: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        min={1}
      />
    </div>
  );

  // Render different filters based on active tab
  const renderTabSpecificFilters = () => {
    switch (activeTab) {
      case 'sold-items':
        return (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderTaxProductGroupFilter()}
            {renderMenuFilter()}
            {renderCategoryFilter()}
            {renderOrderTypeFilter()}
            {renderBillStatusFilter()}
            {renderPaymentMethodFilter()}
            {renderTopFilter()}
          </div>
        );

      case 'complimentary':
        return (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderTaxProductGroupFilter()}
            {renderBillStatusFilter()}
          </div>
        );

      case 'kot-items':
        return (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderBillStatusFilter()}
          </div>
        );

      case 'bill-details':
        return null;

      default:
        return null;
    }
  };

  return <>{renderTabSpecificFilters()}</>;
}
