import { z } from 'zod';
import { multilingualTextSchema } from './common/common.validation';

export const tableSchema = z
  .object({
    _id: z.string().optional(),
    tableSectionId: z.string().min(1, 'Table section is required'),
    label: z.string().min(1, 'Label is required'),
    capacity: z
      .number()
      .min(1, 'Capacity is required')
      .refine((val) => Number(val) > 0, {
        message: 'Capacity must be greater than 0',
      }),
    isAvailable: z.boolean(),
    restaurantId: z.string().min(1, 'Restaurant is required'),
    restaurantName: multilingualTextSchema.optional(),
    isBulk: z.boolean().optional(),
    bulkCount: z
      .string()
      .refine((val) => !val || /^\d+$/.test(val), {
        message: 'Must be a valid number',
      })
      .refine((val) => !val || parseInt(val) >= 1, {
        message: 'Must be at least 1',
      })
      .optional(),
    bulkLabelPrefix: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isBulk = Boolean(data.isBulk);
    if (isBulk) {
      if (!data.bulkCount) {
        ctx.addIssue({
          code: 'custom',
          message: 'Number of tables is required',
          path: ['bulkCount'],
        });
      }
      if (!data.bulkLabelPrefix) {
        ctx.addIssue({
          code: 'custom',
          message: 'Label prefix is required',
          path: ['bulkLabelPrefix'],
        });
      }
    } else {
      if (!data.label || data.label.trim().length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Label is required',
          path: ['label'],
        });
      }
    }
  });

export type TableFormData = z.infer<typeof tableSchema>;
