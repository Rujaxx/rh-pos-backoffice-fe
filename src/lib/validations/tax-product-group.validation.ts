import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';

export const taxProductGroupSchema = z.object({
  name: multilingualTextSchema,
  productGroupName: z.string().trim().min(1, 'Product group name is required'),

  taxType: z.enum(['Percentage', 'Fixed Amount'], {
    error: 'You must select a tax type.',
  }),

  taxValue: z.number().min(0),
  isActive: z.boolean(),
  brandId: z.string().min(1, 'Brand ID is required'),
  restaurantId: z.string().optional(),
});

export type TaxProductGroupFormData = z.infer<typeof taxProductGroupSchema>;
