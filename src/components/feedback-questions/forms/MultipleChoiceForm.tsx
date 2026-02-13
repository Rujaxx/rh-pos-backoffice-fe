'use client';

import React from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  multipleChoiceSchema,
  MultipleChoiceQuestion,
} from '@/lib/validations/feedback-question.validation';
import { QuestionTypeEnum } from '@/types/feedback-config.type';
import { RHFInput, RHFSwitch } from '@/components/ui/form-components';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useFormValueChange, useFormReset } from '../hooks';
import { FormActions } from '../FormActions';
import { MultipleChoiceFormProps } from '../types';

const defaultValues: Partial<MultipleChoiceQuestion> = {
  type: QuestionTypeEnum.MULTIPLE_CHOICE,
  order: 0,
  questionText: '',
  choices: [{ text: '', value: '' }],
  randomize: false,
  allowOtherChoice: false,
  verticalAlignment: false,
  allowMultipleSelection: false,
  required: true,
};

export const MultipleChoiceForm: React.FC<MultipleChoiceFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();

  const form = useForm<MultipleChoiceQuestion>({
    resolver: zodResolver(multipleChoiceSchema),
    defaultValues: initialData || defaultValues,
  });

  const { watch, reset, control } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

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

        {/* Choices Array */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t('feedbackQuestion.form.choices')}
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <RHFInput
                  form={form}
                  name={`choices.${index}.text`}
                  label={t('feedbackQuestion.form.choicePlaceholder')}
                  placeholder={`${t('feedbackQuestion.form.choicePlaceholder')} ${index + 1}`}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="mt-0"
                disabled={fields.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ text: '', value: '' })}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('feedbackQuestion.form.addChoice')}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <RHFSwitch
            form={form}
            name="allowMultipleSelection"
            label={t('feedbackQuestion.form.allowMultiple')}
          />
          <RHFSwitch
            form={form}
            name="randomize"
            label={t('feedbackQuestion.form.randomize')}
          />
          <RHFSwitch
            form={form}
            name="allowOtherChoice"
            label={t('feedbackQuestion.form.allowOther')}
          />
          <RHFSwitch
            form={form}
            name="verticalAlignment"
            label={t('feedbackQuestion.form.verticalAlign')}
          />
          <RHFSwitch
            form={form}
            name="required"
            label={t('feedbackQuestion.form.required')}
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
