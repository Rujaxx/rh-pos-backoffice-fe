import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';

export const discountSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,

  discountType: z.enum(['Percentage', 'Fixed Amount'], {
    error: 'You must select a discount type.',
  }),

  discountValue: z
    .number()
    .min(0.01, 'Discount value must be greater than 0')
    .max(
      100,
      'Discount value cannot exceed 100 for percentage or be too large for fixed amount',
    ),
  isActive: z.boolean(),
  brandId: z.string(),
  restaurantId: z.string().optional(),
  categoryIds: z.array(z.string()),
  taxProductGroupIds: z.array(z.string()),
  orderTypeIds: z.array(z.string()),
});

export type DiscountFormData = z.infer<typeof discountSchema>;
