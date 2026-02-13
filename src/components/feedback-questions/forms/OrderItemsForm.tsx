'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  orderItemsSchema,
  OrderItemsQuestion,
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
import { OrderItemsFormProps } from '../types';

const defaultValues: Partial<OrderItemsQuestion> = {
  type: QuestionTypeEnum.ORDER_ITEMS,
  order: 0,
  questionText: '',
  enableItemRating: true,
  shape: RatingShapeEnum.STAR,
  steps: 5,
  required: false,
};

export const OrderItemsForm: React.FC<OrderItemsFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<OrderItemsQuestion>({
    resolver: zodResolver(orderItemsSchema),
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
          <RHFSwitch
            form={form}
            name="enableItemRating"
            label={t('feedbackQuestion.form.enableItemRating')}
          />
          <RHFSwitch
            form={form}
            name="required"
            label={t('feedbackQuestion.form.required')}
          />
        </div>

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
            label={t('feedbackQuestion.form.ratingSteps')}
          />
        </div>

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
