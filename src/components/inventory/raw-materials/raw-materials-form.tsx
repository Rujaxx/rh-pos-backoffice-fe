'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFSwitch,
  RHFSelect,
} from '@/components/ui/form-components';
import {
  rawItemSchema,
  RawItemFormData,
} from '@/lib/validations/raw-item.validation';
import { RawItem, RawItemType, Unit } from '@/types/raw-materials.type';

interface RawItemFormContentProps {
  form: UseFormReturn<RawItemFormData>;
  editingItem?: RawItem | null;
}

export function RawItemFormContent({ form }: RawItemFormContentProps) {
  const { t } = useTranslation();

  const unitOptions: { value: Unit; label: string }[] = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'gm', label: 'Gram (gm)' },
    { value: 'mg', label: 'Milligram (mg)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'ltr', label: 'Liter (ltr)' },
    { value: 'box', label: 'Box' },
    { value: 'piece', label: 'Piece' },
    { value: 'pack', label: 'Pack' },
    { value: 'dozen', label: 'Dozen' },
    { value: 'crate', label: 'Crate' },
  ];

  const typeOptions: { value: RawItemType; label: string }[] = [
    { value: 'RAW', label: 'Raw Material' },
    { value: 'SEMI', label: 'Semi-Finished' },
    { value: 'FINISHED', label: 'Finished Product' },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('rawMaterials.form.basicInfo') || 'Basic Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RHFInput
            form={form}
            name="name"
            label={t('rawMaterials.form.nameLabel') || 'Name'}
            placeholder={
              t('rawMaterials.form.namePlaceholder') ||
              'Enter raw material name'
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSelect
              form={form}
              name="type"
              label={t('rawMaterials.form.typeLabel') || 'Type'}
              placeholder={
                t('rawMaterials.form.typePlaceholder') || 'Select type'
              }
              options={typeOptions}
            />

            <RHFSelect
              form={form}
              name="baseUnit"
              label={t('rawMaterials.form.unitLabel') || 'Base Unit'}
              placeholder={
                t('rawMaterials.form.unitPlaceholder') || 'Select unit'
              }
              options={unitOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('rawMaterials.form.inventoryDetails') || 'Inventory Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name="expectedWasteRatio"
              label={
                t('rawMaterials.form.wasteLabel') || 'Expected Waste Ratio'
              }
              placeholder={t('rawMaterials.form.wastePlaceholder') || '0.00'}
              type="number"
              step="0.01"
              min="0"
              max="1"
              description={
                t('rawMaterials.form.wasteDescription') ||
                'Between 0 and 1 (e.g., 0.1 for 10%)'
              }
            />

            <RHFInput
              form={form}
              name="minimumStock"
              label={t('rawMaterials.form.minStockLabel') || 'Minimum Stock'}
              placeholder={t('rawMaterials.form.minStockPlaceholder') || '0'}
              type="number"
              step="1"
              min="0"
              description={
                t('rawMaterials.form.minStockDescription') ||
                'Alert when stock goes below this'
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('rawMaterials.form.status') || 'Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <RHFSwitch
              form={form}
              name="isActive"
              label={t('rawMaterials.form.activeLabel') || 'Active'}
              description={
                t('rawMaterials.form.activeDescription') ||
                'Item is usable in the system'
              }
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook for raw item form logic
export function useRawItemForm(editingItem?: RawItem | null) {
  const form = useForm<RawItemFormData>({
    resolver: zodResolver(rawItemSchema),
    defaultValues: {
      name: '',
      type: 'RAW',
      baseUnit: 'kg',
      expectedWasteRatio: 0,
      minimumStock: 0,
      isActive: true,
    },
  });

  // Reset form when editing raw item changes
  React.useEffect(() => {
    if (editingItem) {
      form.reset({
        name: editingItem.name,
        type: editingItem.type,
        baseUnit: editingItem.baseUnit,
        expectedWasteRatio: editingItem.expectedWasteRatio || 0,
        minimumStock: editingItem.minimumStock || 0,
        isActive: editingItem.isActive ?? true,
        // These will be populated from user context when submitting
        restaurantId: editingItem.restaurantId,
        brandId: editingItem.brandId,
      });
    } else {
      form.reset({
        name: '',
        type: 'RAW',
        baseUnit: 'kg',
        expectedWasteRatio: 0,
        minimumStock: 0,
        isActive: true,
        restaurantId: undefined,
        brandId: undefined,
      });
    }
  }, [editingItem, form]);

  return {
    form,
    isEditing: !!editingItem,
  };
}
