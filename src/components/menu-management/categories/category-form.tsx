'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFMultilingualInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import {
  categorySchema,
  CategoryFormData,
} from '@/lib/validations/category.validation';
import { Category } from '@/types/category.type';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';
import { useActiveDiscounts } from '@/services/api/discounts/discounts.queries';

interface CategoryFormContentProps {
  form: UseFormReturn<CategoryFormData>;
}

export function CategoryFormContent({ form }: CategoryFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active brands from API
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();

  // Fetch active restaurants from API
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  // Fetch active discounts from API
  const { data: discountsResponse, isLoading: isLoadingDiscounts } =
    useActiveDiscounts();

  // Transform brands into dropdown options
  const brandOptions = (brandsResponse?.data || []).map((brand) => ({
    value: brand._id,
    label: brand.name[locale] || brand.name.en,
  }));

  // Transform restaurants into dropdown options
  const restaurantOptions = (restaurantsResponse?.data || []).map(
    (restaurant) => ({
      value: restaurant._id,
      label: restaurant.name[locale] || restaurant.name.en,
    }),
  );

  // Transform discounts into dropdown options
  const discountOptions = (discountsResponse?.data || [])
    .filter((discount) => discount._id) // Filter out any discounts without _id
    .map((discount) => ({
      value: discount._id!,
      label: discount.name[locale] || discount.name.en,
    }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('categories.form.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t('categories.form.categoryNameLabel')}
              placeholder={{
                en: t('categories.form.categoryNamePlaceholderEn'),
                ar: t('categories.form.categoryNamePlaceholderAr'),
              }}
            />

            <RHFInput
              form={form}
              name="shortCode"
              label={t('categories.form.shortCodeLabel')}
              placeholder={t('categories.form.shortCodePlaceholder')}
              description={t('categories.form.shortCodeDescription')}
            />

            <RHFSelect
              form={form}
              name="brandId"
              label={t('categories.form.brandLabel')}
              placeholder={
                isLoadingBrands
                  ? t('common.loading')
                  : brandOptions.length === 0
                    ? t('common.noBrandsAvailable')
                    : t('common.brandPlaceholder')
              }
              options={brandOptions}
            />

            <RHFSwitch
              form={form}
              name="isActive"
              label={t('categories.form.activeStatusLabel')}
              description={t('categories.form.activeStatusDescription')}
            />
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('categories.form.additionalSettings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFInput
              form={form}
              name="sortOrder"
              type="number"
              label={t('categories.form.sortOrderLabel')}
              placeholder={t('categories.form.sortOrderPlaceholder')}
              description={t('categories.form.sortOrderDescription')}
            />

            <RHFSelect
              form={form}
              name="restaurantId"
              label={t('categories.form.restaurantLabel')}
              placeholder={
                isLoadingRestaurants
                  ? t('common.loading')
                  : restaurantOptions.length === 0
                    ? t('categories.form.noRestaurantsAvailable')
                    : t('categories.form.restaurantPlaceholder')
              }
              options={
                restaurantOptions.length > 0
                  ? [
                      {
                        value: 'none',
                        label: t('categories.form.noRestaurantSelected'),
                      },
                      ...restaurantOptions,
                    ]
                  : []
              }
              description={t('categories.form.restaurantDescription')}
              disabled={isLoadingRestaurants || restaurantOptions.length === 0}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Hook for category form logic
export function useCategoryForm(editingCategory?: Category | null): {
  form: UseFormReturn<CategoryFormData>;
  isEditing: boolean;
} {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { en: '', ar: '' },
      shortCode: '',
      isActive: true,
      sortOrder: 0,
      brandId: '',
      restaurantId: '',
    },
  });

  // Reset form when editing category changes (using data from page-level API call)
  React.useEffect(() => {
    if (editingCategory) {
      form.reset({
        _id: editingCategory._id,
        name: editingCategory.name,
        shortCode: editingCategory.shortCode,
        parentCategoryId: editingCategory.parentCategoryId,
        isActive: editingCategory.isActive ?? true,
        sortOrder: editingCategory.sortOrder ?? 0,
        brandId: editingCategory.brandId, // This will now show the correct previously selected brand
        restaurantId: editingCategory.restaurantId || 'none',
      });
    } else {
      // Reset to defaults when creating new category
      form.reset({
        name: { en: '', ar: '' },
        shortCode: '',
        isActive: true,
        sortOrder: 0,
        brandId: '',
        restaurantId: 'none',
      });
    }
  }, [editingCategory, form]);

  return {
    form,
    isEditing: !!editingCategory,
  };
}

export default CategoryFormContent;
