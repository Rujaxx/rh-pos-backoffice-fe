'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ratingSchema,
  RatingQuestion,
} from '@/lib/validations/feedback-question.validation';
import {
  QuestionTypeEnum,
  RatingShapeEnum,
} from '@/types/feedback-config.type';
import {
  RHFInput,
  RHFSelect,
  RHFSwitch,
} from '@/components/ui/form-components';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValueChange, useFormReset } from '../hooks';
import { FormActions } from '../FormActions';
import { RatingFormProps } from '../types';

const defaultValues: Partial<RatingQuestion> = {
  type: QuestionTypeEnum.RATING,
  order: 0,
  ratingText: '',
  shape: RatingShapeEnum.STAR,
  steps: 5,
  rateColor: '#FFD700',
  emptyRateColor: '#D3D3D3',
  required: true,
};

export const RatingForm: React.FC<RatingFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<RatingQuestion>({
    resolver: zodResolver(ratingSchema),
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
          name="ratingText"
          label={t('feedbackQuestion.form.questionText')}
          placeholder={t('feedbackQuestion.form.ratingTextPlaceholder')}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <RHFSelect
            form={form}
            name="shape"
            label={t('feedbackQuestion.form.shape')}
            options={Object.values(RatingShapeEnum).map((v) => ({
              label: v,
              value: v,
            }))}
          />

          <RHFInput
            form={form}
            name="steps"
            type="number"
            label={t('feedbackQuestion.form.steps')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <RHFInput
            form={form}
            name="rateColor"
            label={t('feedbackQuestion.form.activeColor')}
            placeholder={t('feedbackQuestion.form.activeColorPlaceholder')}
          />

          <RHFInput
            form={form}
            name="emptyRateColor"
            label={t('feedbackQuestion.form.inactiveColor')}
            placeholder={t('feedbackQuestion.form.inactiveColorPlaceholder')}
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
