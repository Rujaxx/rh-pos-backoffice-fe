import { z } from 'zod';
import {
  QuestionTypeEnum,
  RatingShapeEnum,
  InputTypeEnum,
} from '@/types/feedback-config.type';

// Base Schema
const baseQuestionSchema = z.object({
  _id: z.string().optional(),
  feedbackConfigId: z.string().optional(), // Usually passed via URL/Context
  type: z.nativeEnum(QuestionTypeEnum),
  order: z.number().min(0),
  orderTypes: z.array(z.string()).optional(), // Array of IDs
});

// 1. Welcome Screen
export const welcomeScreenSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.WELCOME_SCREEN),
  welcomeText: z.string().min(1, 'Welcome text is required'),
  buttonText: z.string().optional(),
  showButton: z.boolean().default(true).optional(),
});

// 2. Phone Number
export const phoneNumberSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.PHONE_NUMBER),
  phoneNumberText: z.string().min(1, 'Label text is required'),
  required: z.boolean().default(true).optional(),
});

// 3. Rating
export const ratingSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.RATING),
  ratingText: z.string().min(1, 'Rating question is required'),
  shape: z.nativeEnum(RatingShapeEnum).default(RatingShapeEnum.STAR).optional(),
  steps: z.number().min(3).max(10).default(5).optional(),
  rateColor: z.string().optional(),
  emptyRateColor: z.string().optional(),
  required: z.boolean().default(true).optional(),
});

// 4. Multiple Choice
export const choiceItemSchema = z.object({
  text: z.string().min(1, 'Choice text is required'),
  value: z.string().optional(),
});

export const multipleChoiceSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.MULTIPLE_CHOICE),
  questionText: z.string().min(1, 'Question text is required'),
  choices: z.array(choiceItemSchema).min(1, 'At least one choice is required'),
  randomize: z.boolean().default(false).optional(),
  allowOtherChoice: z.boolean().default(false).optional(),
  verticalAlignment: z.boolean().default(false).optional(),
  allowMultipleSelection: z.boolean().default(false).optional(),
  required: z.boolean().default(true).optional(),
});

// 5. Input Field
export const inputFieldSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.INPUT_FIELD),
  questionText: z.string().min(1, 'Label text is required'),
  inputType: z.nativeEnum(InputTypeEnum).default(InputTypeEnum.TEXT).optional(),
  placeholder: z.string().optional(),
  maxLength: z.number().min(1).optional(),
  required: z.boolean().default(false).optional(),
});

// 7. Yes/No
export const yesNoSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.YES_NO),
  questionText: z.string().min(1, 'Question text is required'),
  yesText: z.string().optional(),
  noText: z.string().optional(),
  required: z.boolean().default(true).optional(),
});

// 8. Order Items
export const orderItemsSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.ORDER_ITEMS),
  questionText: z.string().min(1, 'Rating label is required'),
  enableItemRating: z.boolean().default(true).optional(),
  shape: z.nativeEnum(RatingShapeEnum).default(RatingShapeEnum.STAR).optional(),
  steps: z.number().min(3).max(10).default(5).optional(),
  rateColor: z.string().optional(),
  emptyRateColor: z.string().optional(),
  required: z.boolean().default(false).optional(),
});

// 9. Thank You Screen
export const socialMediaLinksSchema = z.object({
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  youtube: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const thankYouScreenSchema = baseQuestionSchema.extend({
  type: z.literal(QuestionTypeEnum.THANK_YOU_SCREEN),
  thankYouMessage: z.string().min(1, 'Thank you message is required'),
  buttonText: z.string().optional(),
  showButton: z.boolean().default(true).optional(),
  loyaltyMessage: z.string().optional(),
  redirectUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  socialMediaLinks: socialMediaLinksSchema.optional(),
  showSocialLinks: z.boolean().default(false).optional(),
});

// Discriminated Union
export const feedbackQuestionSchema = z.discriminatedUnion('type', [
  welcomeScreenSchema,
  phoneNumberSchema,
  ratingSchema,
  multipleChoiceSchema,
  inputFieldSchema,
  yesNoSchema,
  orderItemsSchema,
  thankYouScreenSchema,
]);

export type FeedbackQuestionFormSchema = z.infer<typeof feedbackQuestionSchema>;

// Export individual types if needed
export type WelcomeScreenQuestion = z.infer<typeof welcomeScreenSchema>;
export type PhoneNumberQuestion = z.infer<typeof phoneNumberSchema>;
export type RatingQuestion = z.infer<typeof ratingSchema>;
export type MultipleChoiceQuestion = z.infer<typeof multipleChoiceSchema>;
export type InputFieldQuestion = z.infer<typeof inputFieldSchema>;
export type YesNoQuestion = z.infer<typeof yesNoSchema>;
export type OrderItemsQuestion = z.infer<typeof orderItemsSchema>;
export type ThankYouScreenQuestion = z.infer<typeof thankYouScreenSchema>;
