'use client';

import React, { useState } from 'react';
import { QuestionTypeEnum } from '@/types/feedback-config.type';
import { FeedbackQuestionFormSchema } from '@/lib/validations/feedback-question.validation';
import { RHFSelect } from '@/components/ui/form-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useForm } from 'react-hook-form';
import {
  WelcomeScreenForm,
  PhoneNumberForm,
  RatingForm,
  MultipleChoiceForm,
  InputFieldForm,
  YesNoForm,
  OrderItemsForm,
  ThankYouScreenForm,
} from './forms';

interface FeedbackQuestionFormProps {
  initialData?: Partial<FeedbackQuestionFormSchema>;
  onSubmit: (data: FeedbackQuestionFormSchema) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  onValuesChange?: (data: Partial<FeedbackQuestionFormSchema>) => void;
}

export const FeedbackQuestionForm: React.FC<FeedbackQuestionFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
  onValuesChange,
}) => {
  const { t } = useTranslation();
  const [questionType, setQuestionType] = useState<QuestionTypeEnum>(
    initialData?.type || QuestionTypeEnum.RATING,
  );

  const selectorForm = useForm({
    defaultValues: { type: questionType },
  });

  const handleTypeChange = (newType: string) => {
    setQuestionType(newType as QuestionTypeEnum);
  };

  const renderQuestionForm = () => {
    const formProps = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialData: initialData as any,
      onSubmit,
      isLoading,
      onCancel,
      onValuesChange,
    };

    switch (questionType) {
      case QuestionTypeEnum.WELCOME_SCREEN:
        return <WelcomeScreenForm {...formProps} />;
      case QuestionTypeEnum.PHONE_NUMBER:
        return <PhoneNumberForm {...formProps} />;
      case QuestionTypeEnum.RATING:
        return <RatingForm {...formProps} />;
      case QuestionTypeEnum.MULTIPLE_CHOICE:
        return <MultipleChoiceForm {...formProps} />;
      case QuestionTypeEnum.INPUT_FIELD:
        return <InputFieldForm {...formProps} />;
      case QuestionTypeEnum.YES_NO:
        return <YesNoForm {...formProps} />;
      case QuestionTypeEnum.ORDER_ITEMS:
        return <OrderItemsForm {...formProps} />;
      case QuestionTypeEnum.THANK_YOU_SCREEN:
        return <ThankYouScreenForm {...formProps} />;
      default:
        return (
          <div className="text-muted-foreground">Select a question type</div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('feedbackQuestion.form.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RHFSelect
          form={selectorForm}
          name="type"
          label={t('feedbackQuestion.form.questionType')}
          options={Object.values(QuestionTypeEnum).map((type) => ({
            label: t(`feedbackQuestion.types.${type}`),
            value: type,
          }))}
        />
        <div className="pt-4">{renderQuestionForm()}</div>
      </CardContent>
    </Card>
  );
};
