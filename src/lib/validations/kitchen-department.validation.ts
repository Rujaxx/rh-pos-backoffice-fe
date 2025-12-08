import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';

export const kitchenDepartmentSchema = z.object({
  _id: z.string().optional(),
  name: multilingualTextSchema,
  shortCode: z.string().min(1, 'Short code is required'),
  isActive: z.boolean(),
  brandId: z.string().min(1, 'Brand is required'),
  restaurantId: z.string().min(1, 'Restaurant is required'),
});

export type KitchenDepartmentFormData = z.infer<typeof kitchenDepartmentSchema>;
