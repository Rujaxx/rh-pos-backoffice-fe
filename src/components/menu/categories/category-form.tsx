'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { Category } from '@/types/category.type';
import { useIntl } from 'react-intl';
import { mockCategories } from '@/mock/categories';
import {
  categorySchema,
  CategoryFormData,
} from '@/lib/validations/category.validation';

interface CategoryFormContentProps {
  form: ReturnType<typeof useForm<CategoryFormData>>;
}

export function CategoryFormContent({ form }: CategoryFormContentProps) {
  const { t } = useTranslation();
  const locale = useIntl().locale as 'en' | 'ar';

  const parentCategoryOptions = mockCategories
    .filter((cat) => !cat.parentCategoryId)
    .map((cat) => ({
      value: cat._id!,
      label: cat.name[locale],
    }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('categories.form.details')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name="name.en"
              label={t('categories.form.nameEn')}
              placeholder={t('categories.form.nameEnPlaceholder')}
              isRequired
            />
            <RHFInput
              form={form}
              name="name.ar"
              label={t('categories.form.nameAr')}
              placeholder={t('categories.form.nameArPlaceholder')}
            />
          </div>

          <RHFInput
            form={form}
            name="shortCode"
            label={t('categories.form.shortCode')}
            placeholder={t('categories.form.shortCodePlaceholder')}
            description={t('categories.form.shortCodeDescription')}
            isRequired
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('categories.form.options')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelect
              form={form}
              name="parentCategoryId"
              label={t('categories.form.parentCategory')}
              placeholder={t('categories.form.parentCategoryPlaceholder')}
              options={parentCategoryOptions}
              description={t('categories.form.parentCategoryDescription')}
            />
            <RHFInput
              form={form}
              name="sortOrder"
              label={t('categories.form.sortOrder')}
              placeholder={t('categories.form.sortOrderPlaceholder')}
              type="number"
            />
          </div>

          <RHFSwitch
            form={form}
            name="isActive"
            label={t('categories.form.activeStatusLabel')}
            description={t('categories.form.activeStatusDescription')}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for category form logic
export function useCategoryForm(editingCategory?: Category | null) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { en: '', ar: '' },
      shortCode: '',
      parentCategoryId: '',
      sortOrder: 1,
      isActive: true,
      brandId: 'your-brand-id',
      restaurantId: 'your-restaurant-id',
    },
  });

  React.useEffect(() => {
    if (editingCategory) {
      form.reset({
        _id: editingCategory._id,
        name: editingCategory.name,
        shortCode: editingCategory.shortCode,
        parentCategoryId: editingCategory.parentCategoryId,
        sortOrder: editingCategory.sortOrder,
        isActive: editingCategory.isActive,
        brandId: editingCategory.brandId,
        restaurantId: editingCategory.restaurantId,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        shortCode: '',
        parentCategoryId: '',
        sortOrder: 1,
        isActive: true,
        brandId: 'your-brand-id',
        restaurantId: 'your-restaurant-id',
      });
    }
  }, [editingCategory, form]);

  return {
    form,
    isEditing: !!editingCategory,
  };
}

export default CategoryFormContent;
