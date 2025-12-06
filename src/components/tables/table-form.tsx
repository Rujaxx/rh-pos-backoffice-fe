'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import { TableFormData, tableSchema } from '@/lib/validations/table.validation';
import { Table } from '@/types/table';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useGetTableSectionsByRestaurant } from '@/services/api/tablesections/tablesections.queries';
import { useI18n } from '@/providers/i18n-provider';

interface TableFormContentProps {
  form: UseFormReturn<TableFormData>;
  isEditing?: boolean;
}

export function TableFormContent({
  form,
  isEditing = false,
}: TableFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Get restaurants for dropdown
  const { data: restaurantsData, isLoading: restaurantsLoading } =
    useActiveRestaurants();

  // Watch selected restaurant to filter table sections
  const selectedRestaurantId = form.watch('restaurantId');

  // Fetch table sections for the selected restaurant
  const { data: tableSectionsData, isLoading: tableSectionsLoading } =
    useGetTableSectionsByRestaurant(selectedRestaurantId || '', undefined, {
      enabled: !!selectedRestaurantId, // Only fetch when restaurant is selected
    });

  // Prepare table section options
  const tableSectionOptions = React.useMemo(() => {
    if (!tableSectionsData?.data) return [];

    return tableSectionsData.data.map((section) => ({
      value: section._id,
      label: section.name[locale] || section.name.en,
    }));
  }, [tableSectionsData?.data, locale]);

  // Prepare restaurant options
  const restaurantOptions = React.useMemo(() => {
    if (!restaurantsData?.data) return [];

    return restaurantsData.data.map((restaurant) => ({
      value: restaurant._id,
      label: restaurant.name[locale] || restaurant.name.en,
    }));
  }, [restaurantsData?.data, locale]);

  const isBulk = form.watch('isBulk');

  // Clear table section when restaurant changes
  React.useEffect(() => {
    form.setValue('tableSectionId', '');
  }, [selectedRestaurantId, form]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('table.form.basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing && (
            <RHFSwitch
              form={form}
              name="isBulk"
              label={t('table.form.bulkAdd')}
              description={t('table.form.bulkAddDescription')}
            />
          )}

          {/* Common required selections */}
          <RHFSelect
            form={form}
            name="restaurantId"
            label={t('table.form.restaurantLabel')}
            placeholder={
              restaurantsLoading
                ? t('common.loading')
                : restaurantOptions.length === 0
                  ? t('table.form.noRestaurantsAvailable')
                  : t('table.form.restaurantPlaceholder')
            }
            options={restaurantOptions}
            disabled={restaurantsLoading}
          />

          <RHFSelect
            form={form}
            name="tableSectionId"
            label={t('table.form.sectionLabel')}
            placeholder={
              !selectedRestaurantId
                ? t('table.form.selectRestaurantFirst')
                : tableSectionsLoading
                  ? t('common.loading')
                  : tableSectionOptions.length === 0
                    ? t('table.form.noTableSectionsAvailable')
                    : t('table.form.sectionPlaceholder')
            }
            options={tableSectionOptions}
            disabled={!selectedRestaurantId || tableSectionsLoading}
          />

          {/* Conditional fields based on bulk toggle */}
          {!isEditing && isBulk ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="bulkLabelPrefix"
                label={t('table.form.bulkLabelPrefix')}
                placeholder={t('table.form.bulkLabelPrefix')}
              />
              <RHFInput
                form={form}
                name="capacity"
                label={t('table.form.capacity')}
                placeholder={t('table.form.capacityPlaceholder')}
                type="number"
              />
              <RHFInput
                form={form}
                name="bulkCount"
                label={t('table.form.bulkCount')}
                placeholder={t('table.form.bulkCount')}
                type="number"
              />
              <div className="md:col-span-2">
                <RHFSwitch
                  form={form}
                  name="isAvailable"
                  label={t('table.form.availabilityLabel')}
                  description={t('table.form.availabilityDescription')}
                />
              </div>
            </div>
          ) : (
            <>
              <RHFInput
                form={form}
                name="label"
                label={t('table.form.label')}
                placeholder={t('table.form.labelPlaceholder')}
              />
              <RHFInput
                form={form}
                name="capacity"
                label={t('table.form.capacity')}
                placeholder={t('table.form.capacityPlaceholder')}
                type="number"
              />
              <RHFSwitch
                form={form}
                name="isAvailable"
                label={t('table.form.availabilityLabel')}
                description={t('table.form.availabilityDescription')}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for table form logic
export function useTableForm(editingTable?: Table | null): {
  form: UseFormReturn<TableFormData, unknown>;
  isEditing: boolean;
} {
  const form = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      restaurantId: '',
      tableSectionId: '',
      label: '',
      capacity: 0,
      isAvailable: true,
      isBulk: false,
      bulkCount: 0,
      bulkLabelPrefix: 'T',
    },
  });

  // Reset form when editing table changes (using data from page-level API call)
  React.useEffect(() => {
    if (editingTable) {
      form.reset({
        _id: editingTable._id,
        restaurantId: editingTable.restaurantId,
        tableSectionId: editingTable.tableSectionId,
        label: editingTable.label,
        capacity: editingTable.capacity,
        isAvailable: editingTable.isAvailable,
      });
    } else {
      form.reset({
        restaurantId: '',
        tableSectionId: '',
        label: '',
        capacity: 0,
        isAvailable: true,
        isBulk: false,
        bulkCount: 0,
        bulkLabelPrefix: 'T',
      });
    }
  }, [editingTable, form]);

  return { form, isEditing: !!editingTable };
}

export default TableFormContent;
