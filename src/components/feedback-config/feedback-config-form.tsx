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
  feedbackConfigSchema,
  FeedbackConfigFormSchema,
} from '@/lib/validations/feedback-config.validation';
import { FeedbackConfig, SendFromLinkEnum } from '@/types/feedback-config.type';
import { useActiveRestaurants } from '@/services/api/restaurants/restaurants.queries';

interface FeedbackConfigFormContentProps {
  form: UseFormReturn<FeedbackConfigFormSchema, unknown>;
  editingConfig?: FeedbackConfig | null;
}

export function FeedbackConfigFormContent({
  form,
  editingConfig,
}: FeedbackConfigFormContentProps) {
  const { t } = useTranslation();

  // Fetch active restaurants for dropdown
  const { data: restaurantsResponse, isLoading: isLoadingRestaurants } =
    useActiveRestaurants();
  const restaurants = restaurantsResponse?.data || [];

  const restaurantOptions = restaurants.map((r) => ({
    label: r.name.en, // Or use r.name[locale] if available in context
    value: r._id,
  }));

  const sendFromLinkOptions = Object.values(SendFromLinkEnum).map((value) => ({
    label: value,
    value: value,
  }));

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('feedbackConfig.form.basicInfo') || 'Basic Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelect
              form={form}
              name="restaurantId"
              label={t('feedbackConfig.form.restaurantLabel') || 'Restaurant'}
              placeholder={
                t('feedbackConfig.form.restaurantPlaceholder') ||
                'Select Restaurant'
              }
              options={restaurantOptions}
              disabled={isLoadingRestaurants || !!editingConfig} // Disable restaurant selection on edit if desired, or keep enabled
            />

            <RHFInput
              form={form}
              name="campaignName"
              label={
                t('feedbackConfig.form.campaignNameLabel') || 'Campaign Name'
              }
              placeholder={
                t('feedbackConfig.form.campaignNamePlaceholder') ||
                'e.g. Summer Feedback 2026'
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <RHFSwitch
                form={form}
                name="isActive"
                label={t('feedbackConfig.form.activeStatusLabel') || 'Active'}
                description={
                  t('feedbackConfig.form.activeStatusDescription') ||
                  'Enable this campaign'
                }
              />
              <RHFSwitch
                form={form}
                name="isDefault"
                label={t('feedbackConfig.form.defaultLabel') || 'Default'}
                description={
                  t('feedbackConfig.form.defaultDescription') ||
                  'Set as default for this restaurant'
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuration settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t('feedbackConfig.form.settings') || 'Settings'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RHFSelect
              form={form}
              name="sendFromLink"
              label={t('feedbackConfig.form.sendFromLinkLabel') || 'Send From'}
              options={sendFromLinkOptions}
            />

            <div className="grid grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="timeToFill"
                type="number"
                label={
                  t('feedbackConfig.form.timeToFillLabel') ||
                  'Time to Fill (sec)'
                }
              />

              <RHFInput
                form={form}
                name="delay"
                type="number"
                label={t('feedbackConfig.form.delayLabel') || 'Delay (sec)'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <RHFInput
                form={form}
                name="loyaltyPoint"
                type="number"
                label={
                  t('feedbackConfig.form.loyaltyPointLabel') || 'Loyalty Points'
                }
              />
              <RHFInput
                form={form}
                name="minOrderAmount"
                type="number"
                label={
                  t('feedbackConfig.form.minOrderAmountLabel') ||
                  'Min Order Amount'
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Hook for feedback config form logic
export function useFeedbackConfigForm(editingConfig?: FeedbackConfig | null): {
  form: UseFormReturn<FeedbackConfigFormSchema, unknown>;
  isEditing: boolean;
} {
  const form = useForm<FeedbackConfigFormSchema>({
    resolver: zodResolver(feedbackConfigSchema),
    defaultValues: {
      restaurantId: '',
      campaignName: '',
      isActive: true,
      isDefault: false,
      loyaltyPoint: 0,
      sendFromLink: SendFromLinkEnum.ALL,
      timeToFill: 300,
      delay: 0,
      minOrderAmount: 0,
    },
  });

  // Reset form when editing item changes
  React.useEffect(() => {
    if (editingConfig) {
      form.reset({
        _id: editingConfig._id,
        restaurantId: editingConfig.restaurantId,
        campaignName: editingConfig.campaignName,
        isActive: editingConfig.isActive,
        isDefault: editingConfig.isDefault,
        loyaltyPoint: editingConfig.loyaltyPoint,
        sendFromLink: editingConfig.sendFromLink,
        timeToFill: editingConfig.timeToFill,
        delay: editingConfig.delay,
        minOrderAmount: editingConfig.minOrderAmount,
      });
    } else {
      form.reset({
        restaurantId: '',
        campaignName: '',
        isActive: true,
        isDefault: false,
        loyaltyPoint: 0,
        sendFromLink: SendFromLinkEnum.ALL,
        timeToFill: 300,
        delay: 0,
        minOrderAmount: 0,
      });
    }
  }, [editingConfig, form]);

  return {
    form,
    isEditing: !!editingConfig,
  };
}

export default FeedbackConfigFormContent;
