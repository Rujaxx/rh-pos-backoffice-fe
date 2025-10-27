'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFSelect,
  RHFMultilingualInput,
  RHFSwitch,
} from '@/components/ui/form-components';
import {
  tableSectionSchema,
  TableSectionFormData,
} from '@/lib/validations/tablesection.validation';
import { TableSection } from '@/types/tablesection.type';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';

interface TableSectionFormContentProps {
  form: UseFormReturn<TableSectionFormData>;
}

export function TableSectionFormContent({
  form,
}: TableSectionFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch active restaurants from API
  const { data: restaurantsResponse, isLoading: _isLoadingRestaurants } = useActiveRestaurants();

  // Transform restaurants into dropdown options
  const restaurantOptions = (restaurantsResponse?.data || []).map(restaurant => ({
    value: restaurant._id,
    label: restaurant.name[locale] || restaurant.name.en,
  }));

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('tableSection.form.basicInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RHFSelect
            form={form}
            name="restaurantId"
            label={t('tableSection.form.restaurantLabel')}
            placeholder={t('tableSection.form.restaurantPlaceholder')}
            options={restaurantOptions}
          />

          <RHFMultilingualInput
            form={form}
            name="name"
            label={t('tableSection.form.nameLabel')}
            placeholder={{
              en: t('tableSection.form.namePlaceholderEn'),
              ar: t('tableSection.form.namePlaceholderAr'),
            }}
          />
          <RHFSwitch
            form={form}
            name="isActive"
            label={t('tableSection.form.activeStatusLabel')}
            description={t('tableSection.form.activeStatusDescription')}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for table section form logic
export function useTableSectionForm(editingTableSection?: TableSection | null) {
  const form = useForm<TableSectionFormData>({
    resolver: zodResolver(tableSectionSchema),
    defaultValues: {
      restaurantId: '',
      name: { en: '', ar: '' },
      isActive: true,
    },
  });

  // Reset form when editing table section changes
  React.useEffect(() => {
    if (editingTableSection) {
      form.reset({
        _id: editingTableSection._id,
        restaurantId: editingTableSection.restaurantId,
        name: editingTableSection.name,
        isActive: editingTableSection.isActive ?? false,
      });
    } else {
      form.reset({
        restaurantId: '',
        name: { en: '', ar: '' },
        isActive: true,
      });
    }
  }, [editingTableSection, form]);

  return {
    form,
    isEditing: !!editingTableSection,
  };
}

export default TableSectionFormContent;
