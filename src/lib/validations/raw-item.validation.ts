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
    .min(0, 'Waste ratio must be at least 0')
    .max(1, 'Waste ratio cannot exceed 1')
    .optional()
    .default(0),

  minimumStock: z
    .number()
    .int('Minimum stock must be a whole number')
    .min(0, 'Minimum stock must be at least 0')
    .max(1000000, 'Minimum stock cannot exceed 1,000,000')
    .optional()
    .default(0),

  restaurantId: z.string().optional(),
  brandId: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type RawItemFormData = z.input<typeof rawItemSchema>;
