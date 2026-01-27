'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterX, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { ReportQueryParams } from '@/types/report.type';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';

export interface ReportFiltersProps {
  filters: ReportQueryParams;
  onFilterChange: (filters: ReportQueryParams) => void;
  onClearFilters: () => void;
  onSubmit?: (isDownload?: boolean) => void;
  children?: React.ReactNode;
  validateFilters?: (filters: ReportQueryParams) => boolean;
  disableSubmit?: boolean;
  showDownloadButton?: boolean;
}

export function ReportFilters({
  filters,
  onFilterChange,
  onClearFilters,
  onSubmit,
  children,
  validateFilters,
  disableSubmit = false,
  showDownloadButton = true,
}: ReportFiltersProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch brands & restaurants
  const { data: brandsData } = useActiveBrands();
  const { data: restaurantsData } = useActiveRestaurants();

  const brands = brandsData?.data || [];
  const restaurants = restaurantsData?.data || [];

  const brandOptions = brands.map((b) => ({
    label: b.name[locale] || b.name.en,
    value: b._id!,
  }));
  const restaurantOptions = restaurants.map((r) => ({
    label: r.name[locale] || r.name.en,
    value: r._id!,
  }));

  // Convert ISO to local datetime with time defaulting to 12:00 if not present
  const isoToLocalDateTime = (iso?: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    return date.toISOString().slice(0, 16);
  };

  // Convert local datetime to ISO, ensuring time is always 12:00 if only date is provided
  const localDateTimeToISO = (local: string) => {
    if (!local) return '';

    // Check if time portion exists (format: YYYY-MM-DDTHH:mm)
    const hasTime = local.length === 16 && local.includes('T');

    if (!hasTime) {
      // If only date is provided (YYYY-MM-DD), append 12:00
      const dateOnly = local.split('T')[0];
      return new Date(`${dateOnly}T12:00:00`).toISOString();
    }

    return new Date(local).toISOString();
  };

  const handleDateTimeChange = (field: 'from' | 'to', value: string) => {
    // If value is empty, don't update (keep existing value)
    if (!value) return;

    onFilterChange({ ...filters, [field]: localDateTimeToISO(value) });
  };

  const handleMultiSelectChange = (
    field: keyof ReportQueryParams,
    value: string[],
  ) => {
    onFilterChange({ ...filters, [field]: value });
  };

  // Default validation: check if from and to dates are filled
  const isValid = validateFilters
    ? validateFilters(filters)
    : !!(filters.from && filters.to);

  const isDisabled = disableSubmit || !isValid;

  return (
    <Card className="mb-6">
      {/* Header with Collapse Button */}
      <CardHeader
        className="flex justify-between items-center  cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-lg">
          {t('common.filters') || 'Filters'}
        </CardTitle>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden tr  nsition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0 translate-y-[-4px]' : 'max-h-[2000px] opacity-100 translate-y-0'}`}
      >
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Time Range */}
            <div className="space-y-2 lg:col-span-2">
              <Label>{t('common.dateRange') || 'Date & Time Range'}</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  type="datetime-local"
                  value={isoToLocalDateTime(filters.from)}
                  onChange={(e) => handleDateTimeChange('from', e.target.value)}
                />
                <Input
                  type="datetime-local"
                  value={isoToLocalDateTime(filters.to)}
                  onChange={(e) => handleDateTimeChange('to', e.target.value)}
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
          </div>

          {children}

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            {onSubmit && (
              <>
                {showDownloadButton && (
                  <Button
                    onClick={() => onSubmit(true)}
                    variant="default"
                    className="flex items-center gap-2"
                    disabled={isDisabled}
                  >
                    <Download className="h-4 w-4" />
                    {t('reports.download') || 'Download'}
                  </Button>
                )}
                <Button
                  onClick={() => onSubmit(false)}
                  variant="default"
                  className="flex items-center gap-2"
                  disabled={isDisabled}
                >
                  {t('reports.generate') || 'Generate Report'}
                </Button>
              </>
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
      </div>
    </Card>
  );
}
