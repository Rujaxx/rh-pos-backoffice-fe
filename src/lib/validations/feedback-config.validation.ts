import { z } from 'zod';
import { SendFromLinkEnum } from '@/types/feedback-config.type';

export const feedbackConfigSchema = z.object({
  _id: z.string().optional(),

  restaurantId: z.string().min(1, 'Restaurant is required'),

  campaignName: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name cannot exceed 100 characters'),

  isActive: z.boolean(),

  isDefault: z.boolean(),

  loyaltyPoint: z.coerce
    .number()
    .min(0, 'Loyalty points cannot be negative')
    .optional(),

  sendFromLink: z.nativeEnum(SendFromLinkEnum).optional(),

  timeToFill: z.coerce
    .number()
    .min(0, 'Time to fill cannot be negative')
    .optional(),

  delay: z.coerce.number().min(0, 'Delay cannot be negative').optional(),

  minOrderAmount: z.coerce
    .number()
    .min(0, 'Minimum order amount cannot be negative')
    .optional(),
});

export type FeedbackConfigFormSchema = z.input<typeof feedbackConfigSchema>;
export type FeedbackConfigFormOutput = z.infer<typeof feedbackConfigSchema>;
