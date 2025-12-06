'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFMultilingualInput,
  RHFSelect,
  RHFSwitch, // UPDATED: Replaced RHFRadioGroup with RHFSelect
} from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import {
  TaxProductGroupFormData,
  taxProductGroupSchema,
} from '@/lib/validations/tax-product-group.validation';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useI18n } from '@/providers/i18n-provider';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { MultiSelectDropdown } from '../ui/multi-select-dropdown';
import {
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { TaxProductGroup } from '@/types';

interface TaxGroupFormContentProps {
  form: ReturnType<typeof useForm<TaxProductGroupFormData>>;
}

export function TaxGroupFormContent({ form }: TaxGroupFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const taxTypeOptions = [
    {
      label: t('taxGroups.form.taxTypePercentage'),
      value: 'Percentage',
    },
    {
      label: t('taxGroups.form.taxTypeFixedAmount'),
      value: 'Fixed Amount',
    },
  ];

  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  const brandOptions = (brandsResponse?.data || []).map((brand) => ({
    value: brand._id,
    label: brand.name[locale] || brand.name.en,
  }));

  const restaurantOptions = (restaurantsResponse?.data || []).map(
    (restaurant) => ({
      value: restaurant._id,
      label: restaurant.name[locale] || restaurant.name.en,
    }),
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('taxGroups.form.title')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* Multilingual Name Input */}
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t('taxGroups.table.name')}
              placeholder={{
                en: t('taxGroups.form.nameEnPlaceholder'),
                ar: t('taxGroups.form.nameArPlaceholder'),
              }}
            />
            <RHFInput
              form={form}
              name="billDisplayName"
              label={t('taxGroups.table.billDisplayName')}
              placeholder={t('taxGroups.form.billDisplayNamePlaceholder')}
            />
            <RHFSelect
              form={form}
              name="brandId"
              label={t('restaurants.form.brandLabel')}
              placeholder={
                isLoadingBrands
                  ? t('common.loading')
                  : brandOptions.length === 0
                    ? t('common.noBrandAvailable')
                    : t('common.brandPlaceholder')
              }
              options={brandOptions}
              disabled={isLoadingBrands}
            />

            <FormField
              control={form.control}
              name="restaurantIds"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium">
                    {t('taxGroups.form.restaurantLabel')}
                  </FormLabel>
                  <FormControl>
                    <MultiSelectDropdown
                      options={restaurantOptions}
                      value={field.value || []}
                      onChange={(val: string[]) => field.onChange(val)}
                      placeholder={t('taxGroups.form.restaurantPlaceholder')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Tax Type and Tax Value */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelect
                form={form}
                name="taxType"
                label={t('taxGroups.table.taxType')}
                placeholder={t('taxGroups.form.taxTypePlaceholder')}
                options={taxTypeOptions}
              />
              <RHFInput
                form={form}
                name="taxValue"
                label={t('taxGroups.table.taxValue')}
                placeholder={t('taxGroups.form.taxValuePlaceholder')}
                type="number"
                step="0.01"
              />
            </div>
            {/* boolean feilds */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSwitch
                form={form}
                name="isPrimary"
                label={t('taxGroups.form.primaryStatusLabel')}
                description={t('taxGroups.form.primaryStatusDescription')}
              />
              <RHFSwitch
                form={form}
                name="isActive"
                label={t('taxGroups.form.activeStatusLabel')}
                description={t('taxGroups.form.activeStatusDescription')}
              />
              <RHFSwitch
                form={form}
                name="isInclusive"
                label={t('taxGroups.form.inclusiveStatusLabel')}
                description={t('taxGroups.form.inclusiveStatusDescription')}
              />
              <RHFSwitch
                form={form}
                name="isDivisible"
                label={t('taxGroups.form.divisibleStatusLabel')}
                description={t('taxGroups.form.divisibleStatusDescription')}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for tax group form logic
export function useTaxProductGroupForm(
  editingTaxGroup?: TaxProductGroup | null,
) {
  const form = useForm<TaxProductGroupFormData>({
    resolver: zodResolver(taxProductGroupSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      billDisplayName: '',
      taxType: 'Percentage' as const,
      taxValue: 0,
      isActive: true,
      isPrimary: false,
      isInclusive: false,
      isDivisible: false,
      brandId: '',
      restaurantIds: [],
    },
  });

  // Fetch data needed for dropdowns
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();

  React.useEffect(() => {
    if (editingTaxGroup && brandsResponse?.data) {
      form.reset({
        _id: editingTaxGroup._id,
        name: editingTaxGroup.name,
        billDisplayName: editingTaxGroup.billDisplayName,
        taxType: editingTaxGroup.taxType || ('Percentage' as const),
        taxValue: editingTaxGroup.taxValue || 0,
        isActive: editingTaxGroup.isActive ?? true,
        isPrimary: editingTaxGroup.isPrimary ?? false,
        isInclusive: editingTaxGroup.isInclusive ?? false,
        isDivisible: editingTaxGroup.isDivisible ?? false,
        brandId: editingTaxGroup.brandId,
        restaurantIds: editingTaxGroup.restaurantIds?.map((r) => r._id) ?? [],
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        billDisplayName: '',
        taxType: 'Percentage' as const,
        taxValue: 0,
        isActive: true,
        isPrimary: false,
        isInclusive: false,
        isDivisible: false,
        brandId: '',
        restaurantIds: [],
      });
    }
  }, [editingTaxGroup, brandsResponse?.data, form]);

  return {
    form,
    isEditing: !!editingTaxGroup,
  };
}

export default TaxGroupFormContent;
