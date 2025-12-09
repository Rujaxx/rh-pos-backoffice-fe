'use client';

import React, { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RHFAddressForm, RHFInput } from '@/components/ui/form-components';
import {
  customerSchema,
  CustomerFormData,
} from '@/lib/validations/customers.validation';
import { Customer } from '@/types/customers.type';
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface CustomerFormContentProps {
  form: UseFormReturn<CustomerFormData>;
  editingCustomer?: Customer | null;
}

export function CustomerFormContent({
  form,
  editingCustomer,
}: CustomerFormContentProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('customer.form.personalInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RHFInput
            form={form}
            name="name"
            label={t('customer.form.nameLabel')}
            placeholder={t('customer.form.namePlaceholder')}
            required
          />
          {/* Dial Code (Read Only) */}
          <FormItem className="space-y-2">
            <FormLabel>{t('customer.dialCode')}</FormLabel>
            <FormControl>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {editingCustomer?.dialCode ?? '--'}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          {/* Phone Number - Read Only */}
          <FormItem className="space-y-2">
            <FormLabel>{t('customer.form.phoneLabel')}</FormLabel>
            <FormControl>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {editingCustomer?.phoneNumber ||
                  t('customer.form.phonePlaceholder')}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <RHFInput
            form={form}
            name="loyaltyPoints"
            label={t('customer.form.loyaltyPointsLabel')}
            placeholder={t('customer.form.loyaltyPointsPlaceholder')}
            type="number"
          />
        </CardContent>
      </Card>

      {/* Address*/}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('restaurants.form.addressLabel')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RHFAddressForm
            form={form}
            name="address"
            label={t('restaurants.form.addressLabel')}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function useCustomerForm(editingCustomer?: Customer | null): {
  form: UseFormReturn<CustomerFormData>;
  isEditing: boolean;
} {
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      dialCode: '',
      phoneNumber: '',
      loyaltyPoints: 0,
      address: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        location: '',
        state: '',
        country: '',
        pincode: '',
      },
    },
  });

  // Reset form when editing customer changes
  React.useEffect(() => {
    if (editingCustomer) {
      form.reset({
        _id: editingCustomer._id,
        name: editingCustomer.name,
        dialCode: editingCustomer.dialCode || '',
        phoneNumber: editingCustomer.phoneNumber || null,
        loyaltyPoints: editingCustomer.loyaltyPoints || 0,
        address: editingCustomer.address,
        billId: editingCustomer.billId || '',
      });
    } else {
      form.reset({
        name: '',
        dialCode: '',
        phoneNumber: null,
        loyaltyPoints: 0,
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          location: '',
          state: '',
          country: '',
          pincode: '',
        },
      });
    }
  }, [editingCustomer, form]);

  return {
    form,
    isEditing: !!editingCustomer,
  };
}

export default CustomerFormContent;
