'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFMultilingualInput,
  RHFSelect,
} from '@/components/ui/form-components';
import { MultiSelectDropdown } from '@/components/ui/multi-select-dropdown';
import { FormLabel, FormItem, FormMessage } from '@/components/ui/form';
import { useTranslation } from '@/hooks/useTranslation';
import {
  DiscountFormData,
  discountSchema,
} from '@/lib/validations/discount.validation';
import { Discount } from '@/types/discount.type';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useI18n } from '@/providers/i18n-provider';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useActiveCategories } from '@/services/api/categories/categories.queries';
import { useActiveTaxProductGroups } from '@/services/api/tax-product-groups.ts/tax-product-groups.queries';
import { useActiveOrderTypes } from '@/services/api/order-types/order-types.queries';
import { useGetActiveTableSections } from '@/services/api/tablesections/tablesections.queries';

interface DiscountFormContentProps {
  form: ReturnType<typeof useForm<DiscountFormData>>;
}

export function DiscountFormContent({ form }: DiscountFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();
  const discountTypeOptions = [
    {
      label: t('discounts.form.discountTypePercentage'),
      value: 'Percentage',
    },
    {
      label: t('discounts.form.discountTypeFixedAmount'),
      value: 'Fixed Amount',
    },
  ];

  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useActiveCategories();
  const { data: taxGroupsResponse, isLoading: isLoadingTaxGroups } =
    useActiveTaxProductGroups();
  const { data: orderTypesResponse, isLoading: isLoadingOrderTypes } =
    useActiveOrderTypes();
  const { data: tableSectionsResponse, isLoading: isLoadingTableSections } =
    useGetActiveTableSections();

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

  const categoryOptions = (categoriesResponse?.data || [])
    .filter((cat) => cat._id)
    .map((cat) => ({
      value: cat._id as string,
      label: cat.name[locale] || cat.name.en,
    }));

  const taxGroupOptions = (taxGroupsResponse?.data || [])
    .filter((group) => group._id)
    .map((group) => ({
      value: group._id as string,
      label: group.name[locale] || group.name.en,
    }));

  const orderTypeOptions = (orderTypesResponse?.data || [])
    .filter((orderType) => orderType._id)
    .map((orderType) => ({
      value: orderType._id as string,
      label: orderType.name[locale] || orderType.name.en,
    }));

  const tableSectionOptions = (tableSectionsResponse?.data || [])
    .filter((tableSection) => tableSection._id)
    .map((tableSection) => ({
      value: tableSection._id as string,
      label: tableSection.name[locale] || tableSection.name.en,
    }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('discounts.form.title')}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {/* Multilingual Name Input */}
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t('discounts.form.nameLabel')}
              placeholder={{
                en: t('discount.form.nameEnPlaceholder'),
                ar: t('discount.form.nameArPlaceholder'),
              }}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelect
                form={form}
                name="brandId"
                label={t('restaurants.form.brandLabel')}
                placeholder={
                  isLoadingBrands
                    ? t('common.loading')
                    : brandOptions.length === 0
                      ? t('common.noBrandsAvailable')
                      : t('common.brandPlaceholder')
                }
                options={brandOptions}
                disabled={isLoadingBrands}
              />

              <RHFSelect
                form={form}
                name="restaurantId"
                label={t('kitchen.form.restaurantLabel')}
                placeholder={
                  isLoadingRestaurants
                    ? t('common.loading')
                    : restaurantOptions.length === 0
                      ? t('restaurants.form.noRestaurantsAvailable')
                      : t('kitchen.form.restaurantPlaceholder')
                }
                options={restaurantOptions}
                disabled={isLoadingRestaurants}
              />
            </div>

            {/* Discount Type and Discount Value */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <RHFSelect
                form={form}
                name="discountType"
                label={t('discounts.table.discountType')}
                placeholder={t('discounts.form.discountTypePlaceholder')}
                options={discountTypeOptions}
              />
              <RHFInput
                form={form}
                name="discountValue"
                label={t('discounts.table.discountValue')}
                placeholder={t('discounts.form.discountValuePlaceholder')}
                type="number"
                step="0.01"
              />
            </div>

            {/* Multi-Select Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('discounts.form.categoriesLabel')}</FormLabel>
                    <MultiSelectDropdown
                      options={categoryOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingCategories
                          ? t('common.loading')
                          : t('discounts.form.categoriesPlaceholder')
                      }
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                control={form.control}
                name="taxProductGroupIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('discounts.form.taxProductGroupsLabel')}
                    </FormLabel>
                    <MultiSelectDropdown
                      options={taxGroupOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingTaxGroups
                          ? t('common.loading')
                          : t('discounts.form.taxProductGroupsPlaceholder')
                      }
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Controller
                control={form.control}
                name="orderTypeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('discounts.form.orderTypesLabel')}</FormLabel>
                    <MultiSelectDropdown
                      options={orderTypeOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingOrderTypes
                          ? t('common.loading')
                          : orderTypeOptions.length === 0
                            ? t('common.noOrderTypesAvailable')
                            : t('discounts.form.orderTypesPlaceholder')
                      }
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                control={form.control}
                name="tableSectionIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('discounts.form.tableSectionsLabel')}
                    </FormLabel>
                    <MultiSelectDropdown
                      options={tableSectionOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder={
                        isLoadingTableSections
                          ? t('common.loading')
                          : tableSectionOptions.length === 0
                            ? t('common.noTableSectionsAvailable')
                            : t('discounts.form.tableSectionsPlaceholder')
                      }
                      className="w-full"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for discount form logic
export function useDiscountForm(editingDiscount?: Discount | null) {
  const form = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      discountType: 'Percentage' as const,
      discountValue: 0,
      isActive: true,
      brandId: '',
      restaurantId: '',
      categoryIds: [],
      taxProductGroupIds: [],
      orderTypeIds: [],
      tableSectionIds: [],
    },
  });

  React.useEffect(() => {
    if (editingDiscount) {
      form.reset({
        _id: editingDiscount._id,
        name: editingDiscount.name,
        discountType: editingDiscount.discountType || ('Percentage' as const),
        discountValue: editingDiscount.discountValue || 0,
        isActive: editingDiscount.isActive ?? true,
        brandId: editingDiscount.brandId,
        restaurantId: editingDiscount.restaurantId || '',
        categoryIds: editingDiscount.categoryIds || [],
        taxProductGroupIds: editingDiscount.taxProductGroupIds || [],
        orderTypeIds: editingDiscount.orderTypeIds || [],
        tableSectionIds: editingDiscount.tableSectionIds || [],
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        discountType: 'Percentage' as const,
        discountValue: 0,
        isActive: true,
        brandId: '',
        restaurantId: '',
        categoryIds: [],
        taxProductGroupIds: [],
        orderTypeIds: [],
        tableSectionIds: [],
      });
    }
  }, [editingDiscount, form]);

  return {
    form,
    isEditing: !!editingDiscount,
  };
}

export default DiscountFormContent;
