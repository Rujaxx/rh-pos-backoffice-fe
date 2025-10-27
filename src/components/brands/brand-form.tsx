'use client';

import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  RHFInput,
  RHFMultilingualInput,
  RHFSwitch,
  RHFAddressForm,
} from '@/components/ui/form-components';
import { ImageUpload } from '@/components/ui/image-upload';
import { UploadFolderType } from '@/types/upload';
import { brandSchema, BrandFormData } from '@/lib/validations/brand.validation';
import { Brand } from '@/types/brand.type';

interface BrandFormContentProps {
  form: ReturnType<typeof useForm<BrandFormData>>;
}

export function BrandFormContent({ form }: BrandFormContentProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('brands.form.basicInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFMultilingualInput
              form={form}
              name="name"
              label={t('brands.form.brandNameLabel')}
              placeholder={{
                en: t('brands.form.brandNamePlaceholderEn'),
                ar: t('brands.form.brandNamePlaceholderAr'),
              }}
            />

            <RHFMultilingualInput
              form={form}
              name="description"
              label={t('brands.form.descriptionLabel')}
              type="textarea"
              placeholder={{
                en: t('brands.form.descriptionPlaceholderEn'),
                ar: t('brands.form.descriptionPlaceholderAr'),
              }}
            />

            <RHFSwitch
              form={form}
              name="isActive"
              label={t('brands.form.activeStatusLabel')}
              description={t('brands.form.activeStatusDescription')}
            />
          </CardContent>
        </Card>

        {/* Logo and Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('brands.form.logoAndLinks')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              form={form}
              name="logo"
              label={t('brands.form.logoLabel')}
              description={t('brands.form.logoDescription')}
              folderType={UploadFolderType.BRAND}
            />

            <RHFInput
              form={form}
              name="menuLink"
              label={t('brands.form.menuLinkLabel')}
              placeholder={t('brands.form.menuLinkPlaceholder')}
              type="url"
              description={t('brands.form.menuLinkDescription')}
            />

            <RHFInput
              form={form}
              name="website"
              label={t('brands.form.websiteLabel')}
              placeholder={t('brands.form.websitePlaceholder')}
              type="url"
              description={t('brands.form.websiteDescription')}
            />
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('brands.form.contactInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <RHFInput
              form={form}
              name="phone"
              label={t('brands.form.phoneLabel')}
              placeholder={t('brands.form.phonePlaceholder')}
              type="tel"
              description={t('brands.form.phoneDescription')}
            />
          </div>

          <RHFAddressForm
            form={form}
            name="address"
            label={t('brands.form.addressLabel')}
          />
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t('brands.form.businessInfo')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RHFInput
              form={form}
              name="fssaiNo"
              label={t('brands.form.fssaiLabel')}
              placeholder={t('brands.form.fssaiPlaceholder')}
              description={t('brands.form.fssaiDescription')}
            />

            <RHFInput
              form={form}
              name="trnOrGstNo"
              label={t('brands.form.trnGstLabel')}
              placeholder={t('brands.form.trnGstPlaceholder')}
              description={t('brands.form.trnGstDescription')}
            />

            <RHFInput
              form={form}
              name="panNo"
              label={t('brands.form.panLabel')}
              placeholder={t('brands.form.panPlaceholder')}
              description={t('brands.form.panDescription')}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Hook for brand form logic
export function useBrandForm(editingBrand?: Brand | null) {
  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: { en: '', ar: '' },
      description: { en: '', ar: '' },
      logo: '',
      menuLink: '',
      website: '',
      isActive: true,
      phone: '',
      fssaiNo: '',
      trnOrGstNo: '',
      panNo: '',
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

  // Reset form when editing brand changes
  React.useEffect(() => {
    if (editingBrand) {
      form.reset({
        _id: editingBrand._id,
        name: editingBrand.name,
        description: editingBrand.description,
        logo: editingBrand.logo,
        menuLink: editingBrand.menuLink,
        website: editingBrand.website || '',
        isActive: editingBrand.isActive ?? true,
        phone: editingBrand.phone || '',
        fssaiNo: editingBrand.fssaiNo || '',
        trnOrGstNo: editingBrand.trnOrGstNo || '',
        panNo: editingBrand.panNo || '',
        address: editingBrand.address,
      });
    } else {
      form.reset({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        logo: '',
        menuLink: '',
        website: '',
        isActive: true,
        phone: '',
        fssaiNo: '',
        trnOrGstNo: '',
        panNo: '',
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
  }, [editingBrand, form]);

  return {
    form,
    isEditing: !!editingBrand,
  };
}

export default BrandFormContent;
