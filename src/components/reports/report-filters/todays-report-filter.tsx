'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FilterX, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useOrderTypes } from '@/services/api/order-types/order-types.queries';
import { useI18n } from '@/providers/i18n-provider';
import { Checkbox } from '@/components/ui/checkbox';
import { TodaysReportFilterState } from '@/types/todays-report.type';

export interface TodaysReportFiltersProps {
  filters: TodaysReportFilterState;
  onFilterChange: (filters: TodaysReportFilterState) => void;
  onClearFilters: () => void;
  onSubmit?: () => void;
  expandedSections: boolean;
  onToggleExpandedSections: () => void;
  onToggleSection: (sectionKey: string) => void;
  onToggleAllSections: (enabled: boolean) => void;
}

export function TodaysReportFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onSubmit,
  expandedSections,
  onToggleExpandedSections,
  onToggleSection,
  onToggleAllSections,
}: TodaysReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active brands, restaurants, menus, and order types
  const { data: brandsData } = useActiveBrands();
  const { data: restaurantsData } = useActiveRestaurants();
  const { data: orderTypesData } = useOrderTypes();

  const brands = brandsData?.data || [];
  const restaurants = restaurantsData?.data || [];
  const orderTypes = orderTypesData?.data || [];

  // Options for dropdowns
  const brandOptions = brands.map((brand) => ({
    label: brand.name[locale] || brand.name.en,
    value: brand._id!,
  }));

  const restaurantOptions = restaurants.map((restaurant) => ({
    label: restaurant.name[locale] || restaurant.name.en,
    value: restaurant._id!,
  }));

  const orderTypeOptions = orderTypes.map((orderType) => ({
    label: orderType.name[locale] || orderType.name.en,
    value: orderType._id!,
  }));

  // Convert ISO string to datetime-local format (YYYY-MM-DDTHH:mm)
  const isoToLocalDateTime = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      // Get local datetime string and remove seconds/milliseconds
      const localString = date.toISOString().slice(0, 16);
      return localString;
    } catch {
      return '';
    }
  };

  // Convert datetime-local string to ISO string
  const localDateTimeToISO = (localString: string): string => {
    if (!localString) return '';
    try {
      // Add seconds and timezone
      const date = new Date(localString);
      return date.toISOString();
    } catch {
      return '';
    }
  };

  // Handlers
  const handleDateTimeChange = (field: 'from' | 'to', value: string) => {
    const isoValue = localDateTimeToISO(value);
    onFilterChange({ ...filters, [field]: isoValue });
  };

  const handleMultiSelectChange = (
    field: keyof TodaysReportFilterState,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const sectionToggles = [
    { key: 'showSalesSummary', label: 'Sales Summary / Z Report Summary' },
    { key: 'showOrderTypeSummary', label: 'Order Type Summary' },
    { key: 'showPaymentTypeSummary', label: 'Payment Type Summary' },
    { key: 'showDiscountSummary', label: 'Discount Summary' },
    { key: 'showExpenseSummary', label: 'Expense Summary' },
    { key: 'showBillSummary', label: 'Bill Summary' },
    { key: 'showDeliveryBoySummary', label: 'Delivery Boy Summary' },
    { key: 'showWaiterSummary', label: 'Waiter Summary' },
    { key: 'showProductGroupSummary', label: 'Product Group Summary' },
    {
      key: 'showKitchenDepartmentSummary',
      label: 'Kitchen Department Summary',
    },
    { key: 'showCategorySummary', label: 'Category Summary' },
    { key: 'showSoldItemsSummary', label: 'Sold Items Summary' },
    { key: 'showCancelItemsSummary', label: 'Cancel Items Summary' },
    { key: 'showWalletSummary', label: 'Wallet Summary' },
    {
      key: 'showDuePaymentReceivedSummary',
      label: 'Due Payment Received Summary',
    },
    {
      key: 'showDuePaymentReceivableSummary',
      label: 'Due Payment Receivable Summary',
    },
    { key: 'showPaymentVarianceSummary', label: 'Payment Variance Summary' },
    {
      key: 'showCurrencyDenominationsSummary',
      label: 'Currency Denominations Summary',
    },
    { key: 'showOrderSourceSummary', label: 'Order Source Summary' },
  ];

  const enabledSectionsCount = sectionToggles.filter(
    (section) => filters[section.key as keyof typeof filters] as boolean,
  ).length;

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Time Range */}
            <div className="space-y-2 lg:col-span-2">
              <Label>{t('common.dateRange') || 'Date & Time Range'}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* From Date & Time */}
                <div className="space-y-2">
                  <Input
                    type="datetime-local"
                    value={isoToLocalDateTime(filters.from)}
                    onChange={(e) =>
                      handleDateTimeChange('from', e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                {/* To Date & Time */}
                <div className="space-y-2">
                  <Input
                    type="datetime-local"
                    value={isoToLocalDateTime(filters.to)}
                    onChange={(e) => handleDateTimeChange('to', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Brands */}
            <div className="space-y-2">
              <Label>{t('brands.title') || 'Brands'}</Label>
              <MultiSelectDropdown
                options={brandOptions}
                value={filters.brandIds || []}
                onChange={(value) => handleMultiSelectChange('brandIds', value)}
                placeholder={t('common.selectBrands') || 'Select Brands'}
              />
            </div>

            {/* Restaurants */}
            <div className="space-y-2">
              <Label>{t('restaurants.title') || 'Restaurants'}</Label>
              <MultiSelectDropdown
                options={restaurantOptions}
                value={filters.restaurantIds || []}
                onChange={(value) =>
                  handleMultiSelectChange('restaurantIds', value)
                }
                placeholder={
                  t('common.selectRestaurants') || 'Select Restaurants'
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {/* Order Types */}
            <div className="space-y-2">
              <Label>{t('orderTypes.title') || 'Order Types'}</Label>
              <MultiSelectDropdown
                options={orderTypeOptions}
                value={filters.orderTypeIds || []}
                onChange={(value) =>
                  handleMultiSelectChange('orderTypeIds', value)
                }
                placeholder={
                  t('common.selectOrderTypes') || 'Select Order Types'
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            {onSubmit && (
              <Button onClick={onSubmit} className="flex items-center gap-2">
                {t('reports.generate') || 'Generate Report'}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex items-center gap-2"
            >
              <FilterX className="h-4 w-4" />
              {t('common.clearFilters') || 'Clear Filters'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section Toggles Card */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-medium">Report Sections</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleAllSections(true)}
                className="h-7 text-xs"
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleAllSections(false)}
                className="h-7 text-xs"
              >
                Deselect All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleExpandedSections}
                className="h-7 w-7 p-0"
              >
                {expandedSections ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {expandedSections ? 'Collapse sections' : 'Expand sections'}
                </span>
              </Button>
            </div>
          </div>

          {/* Show sections when expanded */}
          {expandedSections && (
            <div
              className={cn(
                'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3',
              )}
            >
              {sectionToggles.map((section) => {
                const isEnabled = filters[
                  section.key as keyof typeof filters
                ] as boolean;

                return (
                  <div
                    key={section.key}
                    className={cn(
                      'flex items-center space-x-2 p-2 rounded-lg border transition-colors',
                      'bg-white dark:bg-gray-800',
                      isEnabled
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:bg-muted/30',
                    )}
                  >
                    <Checkbox
                      id={section.key}
                      checked={isEnabled}
                      onCheckedChange={() => onToggleSection(section.key)}
                      className={cn(
                        isEnabled && 'border-primary bg-primary text-white',
                      )}
                    />
                    <Label
                      htmlFor={section.key}
                      className={cn(
                        'text-sm cursor-pointer flex-1 truncate',
                        isEnabled
                          ? 'text-primary font-medium'
                          : 'text-foreground',
                      )}
                    >
                      {section.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show message when collapsed and sections are enabled */}
          {!expandedSections && enabledSectionsCount > 0 && (
            <div className="text-xs text-muted-foreground pt-2">
              <span className="font-medium">
                {enabledSectionsCount} sections
              </span>{' '}
              are enabled. Click the expand button to view/edit.
            </div>
          )}

          {/* Show message when collapsed and no sections are enabled */}
          {!expandedSections && enabledSectionsCount === 0 && (
            <div className="text-xs text-muted-foreground pt-2">
              No sections enabled. Click the expand button to select sections.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
