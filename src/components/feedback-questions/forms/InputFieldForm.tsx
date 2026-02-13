'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  inputFieldSchema,
  InputFieldQuestion,
} from '@/lib/validations/feedback-question.validation';
import { QuestionTypeEnum, InputTypeEnum } from '@/types/feedback-config.type';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValueChange, useFormReset } from '../hooks';
import { FormActions } from '../FormActions';
import { InputFieldFormProps } from '../types';

const defaultValues: Partial<InputFieldQuestion> = {
  type: QuestionTypeEnum.INPUT_FIELD,
  order: 0,
  questionText: '',
  inputType: InputTypeEnum.TEXT,
  placeholder: '',
  required: false,
};

export const InputFieldForm: React.FC<InputFieldFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<InputFieldQuestion>({
    resolver: zodResolver(inputFieldSchema),
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

        <RHFSelect
          form={form}
          name="inputType"
          label={t('feedbackQuestion.form.inputType')}
          options={Object.values(InputTypeEnum).map((v) => ({
            label: v,
            value: v,
          }))}
        />

        <RHFInput
          form={form}
          name="placeholder"
          label={t('feedbackQuestion.form.placeholder')}
        />

        <RHFInput
          form={form}
          name="maxLength"
          type="number"
          label={t('feedbackQuestion.form.maxLength')}
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
