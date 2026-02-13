import { MultilingualText } from '@/types/common/common.type';
import { QueryParams } from './api';

export enum SendFromLinkEnum {
  ALL = 'All',
  SMS = 'SMS',
  WHATSAPP = 'Whatsapp',
}

export enum QuestionTypeEnum {
  WELCOME_SCREEN = 'WELCOME_SCREEN',
  PHONE_NUMBER = 'PHONE_NUMBER',
  RATING = 'RATING',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  INPUT_FIELD = 'INPUT_FIELD',
  SCALE = 'SCALE',
  YES_NO = 'YES_NO',
  ORDER_ITEMS = 'ORDER_ITEMS',
  THANK_YOU_SCREEN = 'THANK_YOU_SCREEN',
}

export enum RatingShapeEnum {
  STAR = 'STAR',
  HEART = 'HEART',
  CIRCLE = 'CIRCLE',
  SQUARE = 'SQUARE',
  EMOJI = 'EMOJI',
}

export enum InputTypeEnum {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  PHONE = 'PHONE',
}

export interface OrderType {
  _id: string;
  name: MultilingualText;
}

export interface ChoiceItem {
  text: string;
  value?: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
}

export interface FeedbackConfig extends Record<string, unknown> {
  _id: string;
  restaurantId: string;
  campaignName: string;
  isActive: boolean;
  isDefault: boolean;
  loyaltyPoint: number;
  sendFromLink: SendFromLinkEnum;
  timeToFill: number;
  delay: number;
  minOrderAmount: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackConfigFormData extends Record<string, unknown> {
  restaurantId: string;
  campaignName: string;
  isActive?: boolean;
  isDefault?: boolean;
  loyaltyPoint?: number;
  sendFromLink?: SendFromLinkEnum;
  timeToFill?: number;
  delay?: number;
  minOrderAmount?: number;
}

export interface FeedbackConfigQueryParams extends QueryParams {
  page?: number;
  limit?: number;

  term?: string;
  fields?: string[];

  restaurantId?: string;
  isActive?: string;

  sortBy?: 'campaignName' | 'createdAt' | 'updatedAt';
  // sortOrder removed as per user request and API error
}

export interface FeedbackQuestion extends Record<string, unknown> {
  _id: string;
  feedbackConfigId: string;
  type: QuestionTypeEnum;
  order: number;
  orderTypes?: OrderType[];

  // Welcome Screen
  welcomeText?: string;
  buttonText?: string;
  showButton?: boolean;

  // Phone Number
  phoneNumberText?: string;

  // Rating
  ratingText?: string;
  shape?: string;
  steps?: number;
  rateColor?: string;
  emptyRateColor?: string;

  // Multiple Choice / shared
  questionText?: string;
  choices?: ChoiceItem[];
  randomize?: boolean;
  allowOtherChoice?: boolean;
  verticalAlignment?: boolean;
  allowMultipleSelection?: boolean;

  // Input Field
  inputType?: string;
  placeholder?: string;
  maxLength?: number;

  // Scale
  scaleText?: string;
  minValue?: number;
  minLabel?: string;
  maxValue?: number;
  maxLabel?: string;

  // Yes / No
  yesText?: string;
  noText?: string;

  // Thank You Screen
  thankYouMessage?: string;
  loyaltyMessage?: string;
  redirectUrl?: string;
  socialMediaLinks?: SocialMediaLinks;

  // Common
  required?: boolean;

  createdAt: Date;
  updatedAt: Date;
}
