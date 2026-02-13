'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  thankYouScreenSchema,
  ThankYouScreenQuestion,
} from '@/lib/validations/feedback-question.validation';
import { QuestionTypeEnum } from '@/types/feedback-config.type';
import {
  RHFInput,
  RHFSwitch,
  RHFTextarea,
} from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValueChange, useFormReset } from '../hooks';
import { FormActions } from '../FormActions';
import { ThankYouScreenFormProps } from '../types';

const defaultValues: Partial<ThankYouScreenQuestion> = {
  type: QuestionTypeEnum.THANK_YOU_SCREEN,
  order: 0,
  thankYouMessage: '',
  buttonText: 'Close',
  showButton: true,
  loyaltyMessage: '',
  redirectUrl: '',
  showSocialLinks: false,
};

export const ThankYouScreenForm: React.FC<ThankYouScreenFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<ThankYouScreenQuestion>({
    resolver: zodResolver(thankYouScreenSchema),
    defaultValues: initialData || defaultValues,
  });

  const { watch, reset } = form;

  useFormValueChange(watch, onValuesChange);
  useFormReset(initialData, reset);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RHFTextarea
          form={form}
          name="thankYouMessage"
          label={t('feedbackQuestion.form.thankYouMessage')}
          placeholder={t('feedbackQuestion.form.thankYouMessagePlaceholder')}
        />

        <RHFInput
          form={form}
          name="redirectUrl"
          label={t('feedbackQuestion.form.redirectUrl')}
          placeholder="https://..."
        />

        <RHFInput
          form={form}
          name="loyaltyMessage"
          label={t('feedbackQuestion.form.loyaltyMessage')}
        />

        <RHFSwitch
          form={form}
          name="showButton"
          label={t('feedbackQuestion.form.showCloseButton')}
        />

        <RHFSwitch
          form={form}
          name="showSocialLinks"
          label={t('feedbackQuestion.form.showSocialLinks')}
        />

        <FormActions
          isLoading={isLoading}
          onCancel={onCancel}
          submitLabel={t('feedbackQuestion.actions.save')}
          loadingLabel={t('feedbackQuestion.actions.saving')}
        />
      </form>
    </FormProvider>
  );
};
