'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FilterX } from 'lucide-react';
import {
  ReportQueryParams,
  BillStatus,
  PaymentMethods,
} from '@/types/report.type';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';

interface ReportFiltersProps {
  filters: ReportQueryParams;
  onFilterChange: (filters: ReportQueryParams) => void;
  onClearFilters: () => void;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active brands and restaurants
  const { data: brandsData } = useActiveBrands();
  const { data: restaurantsData } = useActiveRestaurants();

  const brands = brandsData?.data || [];
  const restaurants = restaurantsData?.data || [];

  // Options for dropdowns
  const brandOptions = brands.map((brand) => ({
    label: brand.name[locale] || brand.name.en,
    value: brand._id!,
  }));

  const restaurantOptions = restaurants.map((restaurant) => ({
    label: restaurant.name[locale] || restaurant.name.en,
    value: restaurant._id!,
  }));

  const paymentModeOptions = Object.values(PaymentMethods).map((mode) => ({
    label: mode,
    value: mode,
  }));

  const billStatusOptions = Object.values(BillStatus).map((status) => ({
    label: status,
    value: status,
  }));

  // Handlers
  const handleDateChange = (field: 'from' | 'to', value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <Label>{t('common.dateRange') || 'Date Range'}</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.from || ''}
                onChange={(e) => handleDateChange('from', e.target.value)}
                placeholder="From"
                className="w-full"
              />
              <Input
                type="date"
                value={filters.to || ''}
                onChange={(e) => handleDateChange('to', e.target.value)}
                placeholder="To"
                className="w-full"
              />
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

          {/* Payment Modes */}
          <div className="space-y-2">
            <Label>
              {t('reports.filters.paymentModes') || 'Payment Modes'}
            </Label>
            <MultiSelectDropdown
              options={paymentModeOptions}
              value={filters.paymentModes || []}
              onChange={(value) =>
                handleMultiSelectChange('paymentModes', value)
              }
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

        <div className="flex justify-end mt-4">
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
  );
}
