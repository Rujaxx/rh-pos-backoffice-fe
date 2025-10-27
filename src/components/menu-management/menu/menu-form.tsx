'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RHFInput, RHFSwitch } from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { menuSchema, MenuFormData } from '@/lib/validations/menu.validation';
import { Menu } from '@/types/menu.type';

interface MenuFormContentProps {
  form: ReturnType<typeof useForm<MenuFormData>>;
}

export function MenuFormContent({ form }: MenuFormContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Menu Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('menus.form.details')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInput
              form={form}
              name="name.en"
              label={t('menus.form.nameEn')}
              placeholder={t('menus.form.nameEnPlaceholder')}
            />
            <RHFInput
              form={form}
              name="name.ar"
              label={t('menus.form.nameAr')}
              placeholder={t('menus.form.nameArPlaceholder')}
            />
          </div>

          <RHFInput
            form={form}
            name="shortCode"
            label={t('menus.form.shortCode')}
            placeholder={t('menus.form.shortCodePlaceholder')}
          />

          <RHFInput
            form={form}
            name="shortName"
            label={t('menus.form.shortName')}
            placeholder={t('menus.form.shortNamePlaceholder')}
          />
        </CardContent>
      </Card>

      {/* Status Toggles */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            {t('menus.form.settings')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSwitch
              form={form}
              name="isActive"
              label={t('menus.form.activeStatusLabel')}
              description={t('menus.form.activeStatusDescription')}
            />
            <RHFSwitch
              form={form}
              name="isPosDefault"
              label={t('menus.form.posDefaultLabel')}
              description={t('menus.form.posDefaultDescription')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSwitch
              form={form}
              name="isDigitalDefault"
              label={t('menus.form.digitalDefaultLabel')}
              description={t('menus.form.digitalDefaultDescription')}
            />
            <RHFSwitch
              form={form}
              name="isDigitalMenu"
              label={t('menus.form.digitalMenuLabel')}
              description={t('menus.form.digitalMenuDescription')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFSwitch
              form={form}
              name="isMobileApp"
              label={t('menus.form.mobileAppLabel')}
              description={t('menus.form.mobileAppDescription')}
            />
            <RHFSwitch
              form={form}
              name="isONDC"
              label={t('menus.form.ondcLabel')}
              description={t('menus.form.ondcDescription')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for menu form logic
export function useMenuForm(editingMenu?: Menu | null) {
  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      shortCode: '',
      shortName: '',
      isActive: true,
      isPosDefault: false,
      isDigitalDefault: false,
      isDigitalMenu: false,
      isMobileApp: false,
      isONDC: false,
      brandId: 'your-brand-id',
      restaurantId: 'your-restaurant-id',
    },
  });

  React.useEffect(() => {
    if (editingMenu) {
      form.reset({
        _id: editingMenu._id,
        name: editingMenu.name,
        shortCode: editingMenu.shortCode,
        shortName: editingMenu.shortName,
        isActive: editingMenu.isActive,
        isPosDefault: editingMenu.isPosDefault,
        isDigitalDefault: editingMenu.isDigitalDefault,
        isDigitalMenu: editingMenu.isDigitalMenu,
        isMobileApp: editingMenu.isMobileApp,
        isONDC: editingMenu.isONDC,
        brandId: editingMenu.brandId,
        restaurantId: editingMenu.restaurantId,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        shortCode: '',
        shortName: '',
        isActive: true,
        isPosDefault: false,
        isDigitalDefault: false,
        isDigitalMenu: false,
        isMobileApp: false,
        isONDC: false,
        brandId: 'your-brand-id',
        restaurantId: 'your-restaurant-id',
      });
    }
  }, [editingMenu, form]);

  return {
    form,
    isEditing: !!editingMenu,
  };
}

export default MenuFormContent;
