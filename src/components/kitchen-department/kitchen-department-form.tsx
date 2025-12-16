'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFMultilingualInput,
  RHFSelect,
  RHFSwitch,
  RHFInput,
} from '@/components/ui/form-components';
import {
  kitchenDepartmentSchema,
  KitchenDepartmentFormData,
} from '@/lib/validations/kitchen-department.validation';
import { KitchenDepartment } from '@/types/kitchen-department.type';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';

interface KitchenDepartmentFormContentProps {
  form: UseFormReturn<KitchenDepartmentFormData>;
}

export function KitchenDepartmentFormContent({
  form,
}: KitchenDepartmentFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

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
    <>
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('kitchen.form.basicInfo')}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <RHFMultilingualInput
            form={form}
            name="name"
            label={t('kitchen.form.kitchenDeptLabel')}
            placeholder={{
              en: t('kitchen.form.kitchenDeptPlaceholderEn'),
              ar: t('kitchen.form.kitchenDeptPlaceholderAr'),
            }}
          />

          <RHFInput
            form={form}
            name="shortCode"
            label={t('kitchen.form.shortCodeLabel')}
            placeholder={t('kitchen.form.shortCodePlaceholder')}
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

          <RHFSelect
            form={form}
            name="brandId"
            label={t('kitchen.form.brandLabel')}
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

          <RHFSwitch
            form={form}
            name="isActive"
            label={t('kitchen.form.activeStatusLabel')}
            description={t('kitchen.form.activeStatusDescription')}
          />
        </CardContent>
      </Card>
    </>
  );
}

// Hook for kitchen department form logic
export function useKitchenDepartmentForm(
  editingKitchenDepartment?: KitchenDepartment | null,
): {
  form: UseFormReturn<KitchenDepartmentFormData, unknown>;
  isEditing: boolean;
} {
  const form = useForm<KitchenDepartmentFormData>({
    resolver: zodResolver(kitchenDepartmentSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      restaurantId: '',
      brandId: '',
      shortCode: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (editingKitchenDepartment) {
      form.reset({
        _id: editingKitchenDepartment._id,
        name: editingKitchenDepartment.name,
        restaurantId: editingKitchenDepartment.restaurantId,
        brandId: editingKitchenDepartment.brandId,
        shortCode: editingKitchenDepartment.shortCode,
        isActive: editingKitchenDepartment.isActive ?? true,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        restaurantId: '',
        brandId: '',
        shortCode: '',
        isActive: true,
      });
    }
  }, [editingKitchenDepartment, form]);

  return {
    form,
    isEditing: !!editingKitchenDepartment,
  };
}

export default KitchenDepartmentFormContent;
