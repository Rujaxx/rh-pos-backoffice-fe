import { z } from 'zod';

export const rawItemTypeEnum = z.enum(['RAW', 'SEMI', 'FINISHED']);

export const unitEnum = z.enum([
  'kg',
  'gm',
  'mg',
  'ml',
  'ltr',
  'box',
  'piece',
  'pack',
  'dozen',
  'crate',
]);

export const rawItemSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),

  type: rawItemTypeEnum.default('RAW'),

  baseUnit: unitEnum.default('kg'),

  expectedWasteRatio: z
    .number()
    .min(0, 'Waste ratio must be positive')
    .max(1, 'Waste ratio cannot exceed 1')
    .optional()
    .default(0),

  minimumStock: z
    .number()
    .min(0, 'Minimum stock must be positive')
    .max(1000000, 'Minimum stock is too high')
    .optional()
    .default(0),

  isActive: z.boolean().default(true),

  // These will be populated from user context when submitting
  restaurantId: z.string().optional(),
  brandId: z.string().optional(),
});

export type RawItemFormData = z.input<typeof rawItemSchema>;
