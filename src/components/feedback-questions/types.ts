import { UseFormReturn } from 'react-hook-form';
import {
  YesNoQuestion,
  RatingQuestion,
  OrderItemsQuestion,
  InputFieldQuestion,
  PhoneNumberQuestion,
  WelcomeScreenQuestion,
  ThankYouScreenQuestion,
  MultipleChoiceQuestion,
  FeedbackQuestionFormSchema,
} from '@/lib/validations/feedback-question.validation';

export interface BaseQuestionFormProps<T extends FeedbackQuestionFormSchema> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  onCancel?: () => void;
  onValuesChange?: (data: Partial<T>) => void;
}

export type WelcomeScreenFormProps =
  BaseQuestionFormProps<WelcomeScreenQuestion>;

export type PhoneNumberFormProps = BaseQuestionFormProps<PhoneNumberQuestion>;

export type RatingFormProps = BaseQuestionFormProps<RatingQuestion>;

export type MultipleChoiceFormProps =
  BaseQuestionFormProps<MultipleChoiceQuestion>;

export type InputFieldFormProps = BaseQuestionFormProps<InputFieldQuestion>;

export type YesNoFormProps = BaseQuestionFormProps<YesNoQuestion>;

export type OrderItemsFormProps = BaseQuestionFormProps<OrderItemsQuestion>;

export type ThankYouScreenFormProps =
  BaseQuestionFormProps<ThankYouScreenQuestion>;

export type WelcomeScreenFormReturn = UseFormReturn<WelcomeScreenQuestion>;
export type PhoneNumberFormReturn = UseFormReturn<PhoneNumberQuestion>;
export type RatingFormReturn = UseFormReturn<RatingQuestion>;
export type MultipleChoiceFormReturn = UseFormReturn<MultipleChoiceQuestion>;
export type InputFieldFormReturn = UseFormReturn<InputFieldQuestion>;
export type YesNoFormReturn = UseFormReturn<YesNoQuestion>;
export type OrderItemsFormReturn = UseFormReturn<OrderItemsQuestion>;
export type ThankYouScreenFormReturn = UseFormReturn<ThankYouScreenQuestion>;
