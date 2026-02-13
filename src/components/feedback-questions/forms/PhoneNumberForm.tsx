'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  phoneNumberSchema,
  PhoneNumberQuestion,
} from '@/lib/validations/feedback-question.validation';
import { QuestionTypeEnum } from '@/types/feedback-config.type';
import { RHFInput, RHFSwitch } from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValueChange, useFormReset } from '../hooks';
import { FormActions } from '../FormActions';
import { PhoneNumberFormProps } from '../types';

const defaultValues: Partial<PhoneNumberQuestion> = {
  type: QuestionTypeEnum.PHONE_NUMBER,
  order: 0,
  phoneNumberText: '',
  required: true,
};

export const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<PhoneNumberQuestion>({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: initialData || defaultValues,
  });

  const { watch, reset } = form;

  useFormValueChange(watch, onValuesChange);
  useFormReset(initialData, reset);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RHFInput
          form={form}
          name="phoneNumberText"
          label={t('feedbackQuestion.form.labelText')}
          placeholder={t('feedbackQuestion.form.labelTextPlaceholder')}
          required
        />

        <RHFSwitch
          form={form}
          name="required"
          label={t('feedbackQuestion.form.required')}
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
