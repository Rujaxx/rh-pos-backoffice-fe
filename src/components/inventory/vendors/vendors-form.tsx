'use client';

import React from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Vendor, PaymentMethod, BalanceType } from '@/types/vendors.type';
import {
  CreateVendorData,
  createVendorSchema,
} from '@/lib/validations/vendors.validation';
import { useActiveBrands } from '@/services/api/brands/brands.queries';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';
import { useI18n } from '@/providers/i18n-provider';
import { useTranslation } from '@/hooks/useTranslation';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brand } from '@/types/brand.type';
import { Restaurant } from '@/types/restaurant';

interface VendorFormContentProps {
  form: UseFormReturn<CreateVendorData>;
  editingVendor?: Vendor | null;
}

interface SelectOption {
  value: string;
  label: string;
}

export function VendorFormContent({
  form,
  editingVendor,
}: VendorFormContentProps) {
  const { t } = useTranslation();
  const { locale } = useI18n();

  // Fetch real data for dropdowns
  const { data: brandsResponse, isLoading: isLoadingBrands } =
    useActiveBrands();
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();

  // Prepare options for dropdowns
  const brandOptions: SelectOption[] = (brandsResponse?.data || []).map(
    (brand: Brand) => ({
      value: brand._id,
      label: brand.name[locale] || brand.name.en || brand._id,
    }),
  );

  const restaurantOptions: SelectOption[] = (
    restaurantsResponse?.data || []
  ).map((restaurant: Restaurant) => ({
    value: restaurant._id,
    label: restaurant.name[locale] || restaurant.name.en || restaurant._id,
  }));

  // Payment type options with translations
  const paymentTypeOptions: SelectOption[] = [
    {
      value: PaymentMethod.CASH,
      label: t('common.paymentMethod.cash') || 'Cash',
    },
    {
      value: PaymentMethod.CHEQUE,
      label: t('common.paymentMethod.cheque') || 'Cheque',
    },
    {
      value: PaymentMethod.BANK_TRANSFER,
      label: t('common.paymentMethod.bankTransfer') || 'Bank Transfer',
    },
    {
      value: PaymentMethod.CARD,
      label: t('common.paymentMethod.card') || 'Card',
    },
    {
      value: PaymentMethod.ONLINE,
      label: t('common.paymentMethod.online') || 'Online',
    },
    {
      value: PaymentMethod.CREDIT,
      label: t('common.paymentMethod.credit') || 'Credit',
    },
  ];

  // Balance type options with translations
  const balanceTypeOptions: SelectOption[] = [
    {
      value: BalanceType.PAYABLE,
      label: t('vendors.details.value.payable') || 'Payable',
    },
    {
      value: BalanceType.RECEIVABLE,
      label: t('vendors.details.value.receivable') || 'Receivable',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('vendors.details.basicInfo') || 'Basic Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand  */}
            <RHFSelect
              form={form}
              name="brandId"
              label={t('vendors.form.label.brand') + ' *' || 'Brand *'}
              placeholder={
                t('vendors.form.placeholder.selectBrand') || 'Select brand'
              }
              options={brandOptions}
              disabled={!!editingVendor || isLoadingBrands}
            />

            {/* Restaurant */}
            <RHFSelect
              form={form}
              name="restaurantId"
              label={
                t('vendors.form.label.restaurant') + ' *' || 'Restaurant *'
              }
              placeholder={
                t('vendors.form.placeholder.selectRestaurant') ||
                'Select restaurant'
              }
              options={restaurantOptions}
              disabled={!!editingVendor || isLoadingRestaurants}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <RHFInput
              form={form}
              name="name"
              label={t('vendors.form.label.name') + ' *' || 'Vendor Name *'}
              placeholder={
                t('vendors.form.placeholder.name') || 'Enter vendor name'
              }
            />

            {/* Phone */}
            <RHFInput
              form={form}
              name="phone"
              label={t('vendors.form.label.phone') + ' *' || 'Phone Number *'}
              placeholder={
                t('vendors.form.placeholder.phone') || 'Enter phone number'
              }
            />
          </div>

          {/* Email */}
          <RHFInput
            form={form}
            name="email"
            label={t('vendors.form.label.email') || 'Email Address'}
            placeholder={
              t('vendors.form.placeholder.email') || 'Enter email address'
            }
            type="email"
          />
        </CardContent>
      </Card>

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('vendors.details.taxInfo') || 'Tax Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* GST Number */}
            <RHFInput
              form={form}
              name="gstNumber"
              label={t('vendors.form.label.gstNumber') || 'GST Number'}
              placeholder={
                t('vendors.form.placeholder.gstNumber') || 'Enter GST number'
              }
            />

            {/* PAN Number */}
            <RHFInput
              form={form}
              name="panNumber"
              label={t('vendors.form.label.panNumber') || 'PAN Number'}
              placeholder={
                t('vendors.form.placeholder.panNumber') || 'Enter PAN number'
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('vendors.details.financialInfo') || 'Financial Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payment Type */}
            <RHFSelect
              form={form}
              name="paymentType"
              label={t('vendors.form.label.paymentType') || 'Payment Type'}
              placeholder={
                t('vendors.form.placeholder.selectPaymentType') ||
                'Select payment type'
              }
              options={paymentTypeOptions}
            />

            {/* Credit Limit */}
            <RHFInput
              form={form}
              name="creditLimit"
              label={t('vendors.form.label.creditLimit') || 'Credit Limit'}
              placeholder={
                t('vendors.form.placeholder.creditLimit') ||
                'Enter credit limit'
              }
              type="number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opening Balance */}
            <RHFInput
              form={form}
              name="openingBalance"
              label={
                t('vendors.form.label.openingBalance') || 'Opening Balance'
              }
              placeholder={
                t('vendors.form.placeholder.openingBalance') ||
                'Enter opening balance'
              }
              type="number"
            />

            {/* Balance Type */}
            <RHFSelect
              form={form}
              name="balanceType"
              label={t('vendors.form.label.balanceType') || 'Balance Type'}
              placeholder={
                t('vendors.form.placeholder.selectBalanceType') ||
                'Select balance type'
              }
              options={balanceTypeOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('vendors.form.label.status') || 'Status'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RHFSwitch
            form={form}
            name="isActive"
            label={t('vendors.form.label.activeStatus') || 'Active Status'}
            description={
              t('vendors.form.label.activeDescription') ||
              'Enable or disable this vendor'
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for vendor form logic
export function useVendorForm(editingVendor?: Vendor | null) {
  const form = useForm<CreateVendorData>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      gstNumber: '',
      panNumber: '',
      paymentType: PaymentMethod.CASH,
      creditLimit: 0,
      openingBalance: 0,
      balanceType: BalanceType.PAYABLE,
      restaurantId: '',
      brandId: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (editingVendor) {
      form.reset({
        name: editingVendor.name,
        email: editingVendor.email || '',
        phone: editingVendor.phone || '',
        gstNumber: editingVendor.gstNumber || '',
        panNumber: editingVendor.panNumber || '',
        paymentType: editingVendor.paymentType || PaymentMethod.CASH,
        creditLimit: editingVendor.creditLimit || 0,
        openingBalance: editingVendor.openingBalance || 0,
        balanceType: editingVendor.balanceType || BalanceType.PAYABLE,
        restaurantId: editingVendor.restaurantId,
        brandId: editingVendor.brandId,
        isActive: editingVendor.isActive,
      });
    }
  }, [editingVendor, form]);

  return {
    form,
    isEditing: !!editingVendor,
  };
}
