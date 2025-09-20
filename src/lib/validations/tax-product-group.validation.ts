import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';

export const taxProductGroupSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  productGroupName: z.string().trim().min(1, 'Product group name is required'),

  taxType: z.enum(['Percentage', 'Fixed Amount'], {
    error: 'You must select a tax type.',
  }),

  taxValue: z
    .number()
    .min(0.01, 'Tax value must be greater than 0')
    .max(100, 'Tax value cannot exceed 100 for percentage or be too large for fixed amount'),
  isActive: z.boolean(),
  brandId: z.string(),
  restaurantId: z.string().optional(),
});

export type TaxProductGroupFormData = z.infer<typeof taxProductGroupSchema>;
