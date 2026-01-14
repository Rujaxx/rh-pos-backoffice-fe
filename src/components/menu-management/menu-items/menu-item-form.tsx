'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
  RHFMultilingualInput,
} from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import {
  menuItemSchema,
  MenuItemFormData,
} from '@/lib/validations/menu-item.validation';
import { MeatType, MenuItem } from '@/types/menu-item.type';
import { useActiveCategories } from '@/services/api/categories/categories.queries';
import { useActiveTaxProductGroups } from '@/services/api/tax-product-groups.ts/tax-product-groups.queries';
import { useActiveKitchenDepartments } from '@/services/api/kitchen-departments/kitchen-departments.queries';
import { useI18n } from '@/providers/i18n-provider';
import { ImageUpload } from '@/components/ui/image-upload';
import { UploadFolderType } from '@/types/upload';
import { useMenu } from '@/services/api/menus/menus.queries';

interface MenuItemFormContentProps {
  form: ReturnType<typeof useForm<MenuItemFormData>>;
  editingItem?: MenuItem | null;
}

export function MenuItemFormContent({
  form,
  editingItem,
}: MenuItemFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch options
  const { data: categoriesData } = useActiveCategories({ limit: 100 });
  const { data: taxGroupsData } = useActiveTaxProductGroups({ limit: 100 });
  const { data: kitchenDeptsData } = useActiveKitchenDepartments({
    limit: 100,
  });

  const categoriesOptions = (categoriesData?.data || []).map((cat) => ({
    value: cat._id!,
    label: cat.name[locale] || cat.name.en,
  }));

  const taxGroupsOptions = (taxGroupsData?.data || []).map((tax) => ({
    value: tax._id!,
    label: tax.name[locale] || tax.name.en,
  }));

  const kitchenDeptOptions = (kitchenDeptsData?.data || []).map((dept) => ({
    value: dept._id!,
    label: dept.name[locale] || dept.name.en,
  }));

  const foodTypeOptions = [
    { value: 'VEG', label: t('menuItems.foodTypes.VEG') },
    { value: 'NON_VEG', label: t('menuItems.foodTypes.NON_VEG') },
    { value: 'VEGAN', label: t('menuItems.foodTypes.VEGAN') },
  ];

  const meatTypeOptions = MeatType.map((type) => ({
    value: type.value,
    label: t(`menuItems.meatTypes.${type.value}`),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('menuItems.form.sections.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFMultilingualInput
              form={form}
              name="itemName"
              label={t('menuItems.form.fields.itemNameEn')}
              placeholder={{ en: 'Item Name', ar: 'اسم العنصر' }}
            />
            <RHFInput
              form={form}
              name="shortCode"
              label={t('menuItems.form.fields.shortCode')}
            />
            <RHFMultilingualInput
              form={form}
              name="description"
              label={t('menuItems.form.fields.descriptionEn')}
              type="textarea"
            />
          </CardContent>
        </Card>

        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('menuItems.form.sections.images')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              form={form}
              name="primaryImage"
              label={t('menuItems.form.fields.primaryImage')}
              folderType={UploadFolderType.MENU_ITEMS}
              initialPreviewUrl={editingItem?.primaryImageUrl}
            />
          </CardContent>
        </Card>

        {/* Categorization & Classification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('menuItems.form.sections.categorization')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelect
              form={form}
              name="categoryId"
              label={t('menuItems.form.fields.category')}
              options={categoriesOptions}
            />
            <div className="grid grid-cols-2 gap-4">
              <RHFSelect
                form={form}
                name="foodType"
                label={t('menuItems.form.fields.foodType')}
                options={foodTypeOptions}
              />
              <RHFSelect
                form={form}
                name="meatType"
                label={t('menuItems.form.fields.meatType')}
                options={meatTypeOptions}
              />
            </div>
            <RHFSelect
              form={form}
              name="kitchenDepartmentId"
              label={t('menuItems.form.fields.kitchenDepartment')}
              options={kitchenDeptOptions}
            />
            <RHFSelect
              form={form}
              name="taxProductGroupId"
              label={t('menuItems.form.fields.taxProductGroup')}
              options={taxGroupsOptions}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('menuItems.form.sections.pricing')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFInput
              form={form}
              name="baseItemPrice"
              label={t('menuItems.form.fields.baseItemPrice')}
              type="number"
              min="0"
            />
            <div className="grid grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="currentStock"
                label={t('menuItems.form.fields.currentStock')}
                type="number"
                min="0"
              />
              <RHFInput
                form={form}
                name="preparationTime"
                label={t('menuItems.form.fields.preparationTime')}
                type="number"
                min="0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">
              {t('menuItems.form.sections.status')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RHFSwitch
              form={form}
              name="isActive"
              label={t('menuItems.form.fields.isActive')}
            />
            <RHFSwitch
              form={form}
              name="isRecommended"
              label={t('menuItems.form.fields.isRecommended')}
            />
            <RHFSwitch
              form={form}
              name="posStatus"
              label={t('menuItems.form.fields.posStatus')}
            />
            <RHFSwitch
              form={form}
              name="platformStatus"
              label={t('menuItems.form.fields.platformStatus')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function useMenuItemForm(
  menuId?: string,
  editingItem?: MenuItem | null,
) {
  // Fetch menu details to get brandId and restaurantId
  const { data: menuResponse } = useMenu(menuId || '', {
    enabled: !!menuId && !editingItem, // Only fetch if creating new item and menuId is present
  });
  const menu = menuResponse?.data;

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      itemName: { en: '', ar: '' },
      description: { en: '', ar: '' },
      shortCode: '',
      baseItemPrice: 0,
      currentStock: 0,
      isActive: true,
      isRecommended: false,
      posStatus: true,
      platformStatus: true,
      syncToAggregator: false,
      isCombo: false,
      isAddon: false,
      openPrice: false,
      openItem: false,
      digitalDiscount: false,
      menuId: menuId || '',
      brandId: '',
      restaurantId: '',
      categoryId: '',
      taxProductGroupId: '',
      kitchenDepartmentId: '',
      meatType: 'VEG',
      images: [],
      addOns: [],
      comboItems: [],
      multiplePrices: [],
    },
  });

  useEffect(() => {
    if (editingItem) {
      form.reset({
        ...editingItem,
        // Ensure arrays are initialized
        images: editingItem.images || [],
        addOns: editingItem.addOns || [],
        comboItems: editingItem.comboItems || [],
        multiplePrices: editingItem.multiplePrices || [],
      });
    } else if (menu) {
      // Pre-fill fields from menu context
      form.setValue('menuId', menu._id!);
      form.setValue('brandId', menu.brandId);
      form.setValue('restaurantId', menu.restaurantId);
    }
  }, [editingItem, menu, form]);

  return {
    form,
    isEditing: !!editingItem,
  };
}
