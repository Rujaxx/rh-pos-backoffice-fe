import { z } from 'zod';

export const mealTimeFrameSchema = z.object({
  _id: z.string().optional(),
  brandId: z.string().min(1, 'Restaurant ID is required'),
  name: z.string().trim().min(1, 'Name is required'),
  from: z.string().min(1, 'Start time is required'),
  to: z.string().min(1, 'End time is required'),
  isActive: z.boolean().default(true),
});

export type MealTimeFrameSchemaData = z.input<typeof mealTimeFrameSchema>;
