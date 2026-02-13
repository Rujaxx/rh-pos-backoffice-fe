'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  yesNoSchema,
  YesNoQuestion,
} from '@/lib/validations/feedback-question.validation';
import { QuestionTypeEnum } from '@/types/feedback-config.type';
import { RHFInput, RHFSwitch } from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValueChange, useFormReset } from '../hooks';
import { FormActions } from '../FormActions';
import { YesNoFormProps } from '../types';

const defaultValues: Partial<YesNoQuestion> = {
  type: QuestionTypeEnum.YES_NO,
  order: 0,
  questionText: '',
  yesText: 'Yes',
  noText: 'No',
  required: true,
};

export const YesNoForm: React.FC<YesNoFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<YesNoQuestion>({
    resolver: zodResolver(yesNoSchema),
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
          name="questionText"
          label={t('feedbackQuestion.form.questionText')}
          placeholder={t('feedbackQuestion.form.questionTextPlaceholder')}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <RHFInput
            form={form}
            name="yesText"
            label={t('feedbackQuestion.form.yesText')}
            placeholder={t('feedbackQuestion.form.yesPlaceholder')}
          />
          <RHFInput
            form={form}
            name="noText"
            label={t('feedbackQuestion.form.noText')}
            placeholder={t('feedbackQuestion.form.noPlaceholder')}
          />
        </div>

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
