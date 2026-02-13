'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  welcomeScreenSchema,
  WelcomeScreenQuestion,
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
import { WelcomeScreenFormProps } from '../types';

const defaultValues: Partial<WelcomeScreenQuestion> = {
  type: QuestionTypeEnum.WELCOME_SCREEN,
  order: 0,
  welcomeText: '',
  buttonText: 'Start',
  showButton: true,
};

export const WelcomeScreenForm: React.FC<WelcomeScreenFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<WelcomeScreenQuestion>({
    resolver: zodResolver(welcomeScreenSchema),
    defaultValues: initialData || defaultValues,
  });

  const { watch, reset } = form;

  // Shared hooks
  useFormValueChange(watch, onValuesChange);
  useFormReset(initialData, reset);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <RHFTextarea
          form={form}
          name="welcomeText"
          label={t('feedbackQuestion.form.welcomeText')}
          placeholder={t('feedbackQuestion.form.welcomeTextPlaceholder')}
        />

        <RHFInput
          form={form}
          name="buttonText"
          label={t('feedbackQuestion.form.buttonText')}
          placeholder={t('feedbackQuestion.form.buttonTextPlaceholder')}
        />

        <RHFSwitch
          form={form}
          name="showButton"
          label={t('feedbackQuestion.form.showButton')}
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
