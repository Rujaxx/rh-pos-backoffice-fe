import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';


// TODO: Need Fix (input type conversion)
export const categorySchema = z.object({
  name: multilingualTextSchema,
  shortCode: z.string().min(1, 'Short code is required'),
  parentCategoryId: z.string().optional(),
  sortOrder: z.number().int().positive().min(1), 
  isActive: z.boolean(),
  brandId: z.string(),
  restaurantId: z.string(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
